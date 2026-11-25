#!/usr/bin/env node
// Cross-platform zero-dependency plugin packager for cupertino-forge.
// Builds a clean release ZIP containing ONLY runtime plugin files
// (excludes _upgrade/, _upgrade00-inputs/, .git/, tests/, qa/node_modules/, qa/references/, qa/out/, *.log).
//
// Usage:
//   node scripts/package-plugin.mjs [--out <zipPath>]
// Default output: _upgrade/scratch/cupertino-forge-v<version>.zip

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
const version = pkg.version || '2.0.0';

let outPath = path.join(root, '_upgrade', 'scratch', `cupertino-forge-v${version}.zip`);
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--out' && process.argv[i + 1]) {
    outPath = path.resolve(process.argv[++i]);
  }
}

// Explicit runtime allowlist (never packages _upgrade/, _upgrade00-inputs/, .git/, tests/, node_modules/)
const INCLUDE_DIRS = [
  '.claude-plugin',
  'agents',
  'assets',
  'commands',
  'hooks',
  'qa',
  'scripts',
  'skills',
  'templates',
  'tokens',
];
const INCLUDE_ROOT_FILES = ['README.md', 'GUIDE.md', 'CHANGELOG.md', 'LICENSE', '.gitattributes'];

const EXCLUDED_DIR_NAMES = new Set(['node_modules', '.git', 'references', 'out', 'dist', 'build', 'target', '.dart_tool']);
const EXCLUDED_EXTS = new Set(['.log']);

function collectFiles(absDir, relPrefix, acc) {
  if (!fs.existsSync(absDir)) return;
  const entries = fs.readdirSync(absDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const abs = path.join(absDir, entry.name);
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      // Allow skills/*/references/ (docs) while excluding qa/references/ (gitignored Apple reference images)
      if (entry.name === 'references' && rel === 'qa/references') continue;
      if (entry.name === 'out' && rel === 'qa/out') continue;
      if (EXCLUDED_DIR_NAMES.has(entry.name) && entry.name !== 'references' && entry.name !== 'out') continue;
      collectFiles(abs, rel, acc);
    } else if (entry.isFile()) {
      if (EXCLUDED_EXTS.has(path.extname(entry.name).toLowerCase())) continue;
      acc.push({ abs, rel });
    }
  }
}

const files = [];
for (const dir of INCLUDE_DIRS) {
  collectFiles(path.join(root, dir), dir, files);
}
for (const f of INCLUDE_ROOT_FILES) {
  const abs = path.join(root, f);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    files.push({ abs, rel: f });
  }
}
files.sort((a, b) => a.rel.localeCompare(b.rel));

// Pure Node ZIP writer (CRC32 + Deflate, POSIX forward slashes, works identically on Windows/macOS/Linux)
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const localParts = [];
const centralParts = [];
let offset = 0;
const dosTime = 0;
const dosDate = ((2026 - 1980) << 9) | (11 << 5) | 26;

for (const { abs, rel } of files) {
  const raw = fs.readFileSync(abs);
  const compressed = zlib.deflateRawSync(raw, { level: 9 });
  const crc = crc32(raw);
  const nameBuf = Buffer.from(rel, 'utf8');

  const localHeader = Buffer.alloc(30);
  localHeader.writeUInt32LE(0x04034b50, 0);
  localHeader.writeUInt16LE(20, 4);
  localHeader.writeUInt16LE(0x0800, 6); // UTF-8
  localHeader.writeUInt16LE(8, 8); // Deflate
  localHeader.writeUInt16LE(dosTime, 10);
  localHeader.writeUInt16LE(dosDate, 12);
  localHeader.writeUInt32LE(crc, 14);
  localHeader.writeUInt32LE(compressed.length, 18);
  localHeader.writeUInt32LE(raw.length, 22);
  localHeader.writeUInt16LE(nameBuf.length, 26);
  localHeader.writeUInt16LE(0, 28);
  localParts.push(localHeader, nameBuf, compressed);

  const centralHeader = Buffer.alloc(46);
  centralHeader.writeUInt32LE(0x02014b50, 0);
  centralHeader.writeUInt16LE(20, 4);
  centralHeader.writeUInt16LE(20, 6);
  centralHeader.writeUInt16LE(0x0800, 8);
  centralHeader.writeUInt16LE(8, 10);
  centralHeader.writeUInt16LE(dosTime, 12);
  centralHeader.writeUInt16LE(dosDate, 14);
  centralHeader.writeUInt32LE(crc, 16);
  centralHeader.writeUInt32LE(compressed.length, 20);
  centralHeader.writeUInt32LE(raw.length, 24);
  centralHeader.writeUInt16LE(nameBuf.length, 28);
  centralHeader.writeUInt16LE(0, 30);
  centralHeader.writeUInt16LE(0, 32);
  centralHeader.writeUInt16LE(0, 34);
  centralHeader.writeUInt16LE(0, 36);
  centralHeader.writeUInt32LE(0, 38);
  centralHeader.writeUInt32LE(offset, 42);
  centralParts.push(centralHeader, nameBuf);

  offset += localHeader.length + nameBuf.length + compressed.length;
}

const centralSize = centralParts.reduce((s, b) => s + b.length, 0);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4);
eocd.writeUInt16LE(0, 6);
eocd.writeUInt16LE(files.length, 8);
eocd.writeUInt16LE(files.length, 10);
eocd.writeUInt32LE(centralSize, 12);
eocd.writeUInt32LE(offset, 16);
eocd.writeUInt16LE(0, 20);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const zipBuf = Buffer.concat([...localParts, ...centralParts, eocd]);
fs.writeFileSync(outPath, zipBuf);

// Safety verification on included entry names
const forbidden = files.filter(
  (f) =>
    f.rel.startsWith('_upgrade') ||
    f.rel.startsWith('.git/') ||
    f.rel.startsWith('tests/') ||
    f.rel.includes('node_modules/') ||
    f.rel.startsWith('qa/references/') ||
    f.rel.startsWith('qa/out/') ||
    f.rel.endsWith('.log')
);

console.log(`Packaged ${files.length} files (${(zipBuf.length / 1024).toFixed(1)} KB) -> ${outPath}`);
console.log(`Forbidden entries: ${forbidden.length}`);
if (forbidden.length > 0) {
  console.error('FORBIDDEN:', forbidden.map((f) => f.rel));
  process.exit(1);
}

#!/usr/bin/env node
// Compare a screenshot against an Apple kit reference image.
// Usage: node pixel-diff.mjs ours.png reference.png [--out diff.png] [--threshold 0.1]
// Needs: npm i -D pixelmatch pngjs (installed on first run into the plugin's scripts folder if missing).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, 'package.json'));
let pixelmatch, PNG;
try { pixelmatch = require('pixelmatch'); PNG = require('pngjs').PNG; }
catch {
  execSync('npm i --no-save --silent pixelmatch@5 pngjs@7', { cwd: here, stdio: 'inherit' });
  pixelmatch = require('pixelmatch'); PNG = require('pngjs').PNG;
}
if (pixelmatch.default) pixelmatch = pixelmatch.default;

const [a, b] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'diff.png';
const threshold = process.argv.includes('--threshold') ? Number(process.argv[process.argv.indexOf('--threshold') + 1]) : 0.1;
if (!a || !b) { console.error('usage: pixel-diff.mjs ours.png reference.png [--out diff.png]'); process.exit(1); }

const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
const crop = (img) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
const ca = crop(A), cb = crop(B), diff = new PNG({ width: w, height: h });
const n = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold, includeAA: false });
fs.writeFileSync(out, PNG.sync.write(diff));
const pct = ((n / (w * h)) * 100).toFixed(2);
console.log(JSON.stringify({ mismatchedPixels: n, mismatchPercent: Number(pct), compared: `${w}x${h}`, sizeMismatch: A.width !== B.width || A.height !== B.height, diff: out }));
process.exit(Number(pct) > 5 ? 2 : 0);

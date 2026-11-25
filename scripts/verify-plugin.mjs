#!/usr/bin/env node
// Cross-platform runtime verification for cupertino-forge (/apple-doctor).
// Works on Windows, macOS, and Linux using path.join and process.execPath.
// Usage: node scripts/verify-plugin.mjs [--json]

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const asJson = process.argv.includes('--json');

const results = [];
const record = (name, status, detail) => results.push({ name, status, detail });

// 1. Plugin manifest
const manifestPath = path.join(root, '.claude-plugin', 'plugin.json');
try {
  const pkg = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!pkg.name || !pkg.version) throw new Error('missing name or version');
  record('manifest', 'PASS', `${pkg.name}@${pkg.version}`);
} catch (err) {
  record('manifest', 'FAIL', `Invalid or missing .claude-plugin/plugin.json: ${err.message}`);
}

// 2. Core runtime files
const requiredFiles = [
  path.join('tokens', 'color.json'),
  path.join('tokens', 'typography.json'),
  path.join('tokens', 'layout.json'),
  path.join('tokens', 'shape.json'),
  path.join('tokens', 'materials.json'),
  path.join('tokens', 'motion.json'),
  path.join('tokens', 'elevation.json'),
  path.join('tokens', 'feedback.json'),
  path.join('tokens', 'icons.json'),
  path.join('scripts', 'build-tokens.mjs'),
  path.join('scripts', 'contrast-check.mjs'),
  path.join('scripts', 'capture.py'),
  path.join('scripts', 'pixel-diff.mjs'),
  path.join('scripts', 'package-plugin.mjs'),
  path.join('scripts', 'setup-project.mjs'),
  path.join('scripts', 'synth-sounds.py'),
  path.join('hooks', 'hooks.json'),
  path.join('hooks', 'scripts', 'lint.mjs'),
  path.join('commands', 'apple-doctor.md'),
  path.join('commands', 'apple-redesign.md'),
  path.join('templates', 'AGENTS.apple.md'),
  path.join('skills', 'apple-design-core', 'references', 'patterns', 'redesign-playbook.md'),
  path.join('skills', 'apple-design-core', 'references', 'workflows', 'use-flow.md'),
  path.join('agents', 'apple-design-reviewer.md'),
];
const missingCore = requiredFiles.filter((rel) => !fs.existsSync(path.join(root, rel)));
record(
  'core-runtime-files',
  missingCore.length === 0 ? 'PASS' : 'FAIL',
  missingCore.length === 0 ? `${requiredFiles.length}/${requiredFiles.length} present` : `Missing: ${missingCore.join(', ')}`
);

// 3. Token JSON parse & $meta check
const tokenDir = path.join(root, 'tokens');
const tokenFiles = fs.existsSync(tokenDir) ? fs.readdirSync(tokenDir).filter((f) => f.endsWith('.json')) : [];
const badTokens = [];
for (const tf of tokenFiles) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(tokenDir, tf), 'utf8'));
    if (!parsed || typeof parsed !== 'object' || !parsed.$meta) badTokens.push(`${tf} (missing $meta)`);
  } catch (e) {
    badTokens.push(`${tf} (${e.message})`);
  }
}
record(
  'tokens-json-schema',
  badTokens.length === 0 && tokenFiles.length > 0 ? 'PASS' : 'FAIL',
  badTokens.length === 0 ? `${tokenFiles.length} JSON files valid` : `Invalid: ${badTokens.join('; ')}`
);

// 4. Verify all ${CLAUDE_PLUGIN_ROOT}/... references resolve
const walkPluginFiles = (dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_upgrade' || entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'tests') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkPluginFiles(full, acc);
    else if (/\.(md|json|mjs|js|ts|tsx|py|dart|rs|css)$/i.test(entry.name)) acc.push(full);
  }
  return acc;
};

const brokenRefs = [];
let checkedRefs = 0;
for (const file of walkPluginFiles(root)) {
  if (path.basename(file) === 'verify-plugin.mjs') continue;
  const txt = fs.readFileSync(file, 'utf8');
  for (const m of txt.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([A-Za-z0-9_./\-*]+)/g)) {
    const rel = m[1];
    if (rel === '...') continue;
    checkedRefs++;
    if (rel.includes('*')) {
      const parentRel = path.dirname(rel);
      const ext = path.extname(rel);
      const parentDir = path.join(root, ...parentRel.split('/'));
      const matched = fs.existsSync(parentDir) && fs.readdirSync(parentDir).some((f) => !ext || f.endsWith(ext));
      if (!matched) brokenRefs.push(`${path.relative(root, file)} -> ${rel}`);
    } else {
      const target = path.join(root, ...rel.split('/'));
      if (!fs.existsSync(target)) brokenRefs.push(`${path.relative(root, file)} -> ${rel}`);
    }
  }
}
record(
  'plugin-root-paths',
  brokenRefs.length === 0 ? 'PASS' : 'FAIL',
  brokenRefs.length === 0 ? `${checkedRefs} path references verified` : `Broken: ${brokenRefs.join('; ')}`
);

// 5. Synthesized sound assets check
const soundsDir = path.join(root, 'assets', 'sounds');
const wavCount = fs.existsSync(soundsDir) ? fs.readdirSync(soundsDir).filter((f) => f.endsWith('.wav')).length : 0;
record('audio-assets', wavCount >= 9 ? 'PASS' : 'FAIL', `${wavCount} WAV files in assets/sounds`);

// 6. Lint hook smoke test in an isolated temp project
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-doctor-'));
try {
  const lintScript = path.join(root, 'hooks', 'scripts', 'lint.mjs');
  fs.writeFileSync(path.join(tmpDir, '.apple-design.json'), JSON.stringify({ platform: 'web', style: 'ios', accent: '#0088FF', sounds: false }));
  const sess = spawnSync(process.execPath, [lintScript, '--hook', 'session'], {
    input: JSON.stringify({ cwd: tmpDir }),
    encoding: 'utf8',
  });
  const prompt = spawnSync(process.execPath, [lintScript, '--hook', 'prompt'], {
    input: JSON.stringify({ cwd: tmpDir, prompt: 'Build an iOS settings screen' }),
    encoding: 'utf8',
  });
  const ok = sess.status === 0 && sess.stdout.includes('[cupertino-forge]') && prompt.status === 0 && prompt.stdout.includes('[cupertino-forge]');
  record('lint-hook-smoke', ok ? 'PASS' : 'FAIL', ok ? 'session + prompt hooks exit 0' : `session=${sess.status}, prompt=${prompt.status}`);

  // 7. Token generator smoke test
  const outDir = path.join(tmpDir, 'tokens-out');
  const buildScript = path.join(root, 'scripts', 'build-tokens.mjs');
  const bt = spawnSync(process.execPath, [buildScript, '--out', outDir, '--targets', 'css,tailwind,ts,dart'], { encoding: 'utf8' });
  const expectedOut = ['cupertino.tokens.css', 'cupertino.theme.css', 'cupertino.tokens.ts', 'apple_tokens.dart'];
  const allCreated = bt.status === 0 && expectedOut.every((f) => fs.existsSync(path.join(outDir, f)));
  record('build-tokens-smoke', allCreated ? 'PASS' : 'FAIL', allCreated ? 'CSS, Tailwind, TS, Dart generated' : (bt.stderr || bt.stdout || 'failed'));
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// 8. Harness & QA toolchain probes (always PASS or NOT RUN — never FAIL when optional tools are absent)
const isWin = process.platform === 'win32';
const probeCmd = (cmds, args) => {
  for (const cmd of cmds) {
    const r = spawnSync(cmd[0], [...cmd.slice(1), ...args], {
      encoding: 'utf8',
      shell: isWin && cmd[0].endsWith('.bat'),
    });
    if (r.status === 0) return { cmd: cmd.join(' '), out: (r.stdout || r.stderr || '').trim() };
  }
  return null;
};

record('harness-node', 'PASS', `${process.version} (${process.execPath})`);

const pythonCandidates = isWin ? [['python'], ['py', '-3']] : [['python3'], ['python']];
let pyCmd = null;
for (const cmd of pythonCandidates) {
  const r = spawnSync(cmd[0], [...cmd.slice(1), '--version'], { encoding: 'utf8' });
  if (r.status === 0) { pyCmd = cmd; break; }
}
let hasPyPlaywright = false;
if (!pyCmd) {
  record('python-playwright-capture', 'NOT RUN', 'Python runtime unavailable on PATH (Windows Store python3 alias skipped)');
} else {
  const pw = spawnSync(pyCmd[0], [...pyCmd.slice(1), '-c', 'import playwright; print("ok")'], { encoding: 'utf8' });
  if (pw.status === 0) {
    hasPyPlaywright = true;
    record('python-playwright-capture', 'PASS', `${pyCmd.join(' ')} + playwright importable`);
  } else {
    record('python-playwright-capture', 'NOT RUN', `${pyCmd.join(' ')} found, playwright package not installed`);
  }
}

const qaPwDir = path.join(root, 'qa', 'node_modules', 'playwright');
const hasNodePlaywright = fs.existsSync(qaPwDir);
if (hasNodePlaywright || hasPyPlaywright) {
  const parts = [];
  if (hasPyPlaywright) parts.push(`python (${pyCmd.join(' ')})`);
  if (hasNodePlaywright) parts.push('node (qa/node_modules/playwright)');
  record('harness-playwright', 'PASS', parts.join(' + '));
} else {
  record('harness-playwright', 'NOT RUN', 'Playwright missing (run npm install in qa/ or pip install playwright)');
}

const flutterRes = probeCmd(isWin ? [['flutter.bat'], ['flutter']] : [['flutter']], ['--version']);
if (flutterRes) {
  const firstLine = flutterRes.out.split(/\r?\n/)[0] || 'flutter';
  record('harness-flutter', 'PASS', firstLine);
} else {
  record('harness-flutter', 'NOT RUN', 'Flutter SDK not found on PATH');
}

const cargoRes = probeCmd([['cargo']], ['--version']);
if (cargoRes) {
  record('harness-cargo', 'PASS', cargoRes.out.split(/\r?\n/)[0] || 'cargo');
} else {
  record('harness-cargo', 'NOT RUN', 'Rust cargo toolchain not found on PATH');
}

const fails = results.filter((r) => r.status === 'FAIL').length;
const notRun = results.filter((r) => r.status === 'NOT RUN').length;

if (asJson) {
  process.stdout.write(JSON.stringify({ root, results, fails, notRun }, null, 2) + '\n');
} else {
  console.log(`cupertino-forge doctor (${root})\n`);
  for (const r of results) {
    console.log(`${r.status.padEnd(8)} ${r.name.padEnd(26)} ${r.detail}`);
  }
  console.log(`\nSummary: ${results.length - fails - notRun} PASS, ${notRun} NOT RUN, ${fails} FAIL`);
}
process.exit(fails ? 1 : 0);

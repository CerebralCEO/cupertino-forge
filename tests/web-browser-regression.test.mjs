import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildScript = path.join(root, 'scripts', 'build-tokens.mjs');
const browserScript = path.join(root, 'tests', 'helpers', 'run-web-browser-checks.py');

test('Playwright headless Chromium verifies computed glass, squircle mask+shadow, reduced-transparency, reduced-motion, non-Latin tracking, prehydrate script, and RTL roving focus', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-web-browser-tokens-'));
  try {
    const build = spawnSync(process.execPath, [buildScript, '--out', out, '--targets', 'css'], { encoding: 'utf8' });
    assert.equal(build.status, 0, build.stderr || build.stdout);

    const py = spawnSync('python', [browserScript, out], { encoding: 'utf8', timeout: 60000 });
    assert.equal(py.status, 0, `Playwright check failed:\nSTDOUT: ${py.stdout}\nSTDERR: ${py.stderr}`);
    assert.match(py.stdout, /PLAYWRIGHT_CHECKS_OK: 8\/8 passed/);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

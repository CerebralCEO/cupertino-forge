import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('reviewer and audit skill invoke `python` first instead of hardcoding `python3` (Windows Store alias exit 9009)', () => {
  for (const rel of [
    path.join('agents', 'apple-design-reviewer.md'),
    path.join('skills', 'apple-design-audit', 'SKILL.md'),
  ]) {
    const txt = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.doesNotMatch(txt, /`python3\s+\$\{CLAUDE_PLUGIN_ROOT\}/, `${rel} must invoke python rather than python3`);
    assert.match(txt, /`python\s+"?\$\{CLAUDE_PLUGIN_ROOT\}\/scripts\/capture\.py/);
  }
  const cap = fs.readFileSync(path.join(root, 'scripts', 'capture.py'), 'utf8');
  assert.match(cap, /msedge\.exe/);
  assert.match(cap, /LOCALAPPDATA/);
});

test('verify-plugin.mjs exits 0 and emits explicit NOT RUN rather than fake OK when Playwright is missing', () => {
  const res = spawnSync(process.execPath, [path.join(root, 'scripts', 'verify-plugin.mjs'), '--json'], { encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr || res.stdout);
  const report = JSON.parse(res.stdout);
  assert.equal(report.fails, 0);
  const byName = Object.fromEntries(report.results.map((r) => [r.name, r.status]));
  assert.equal(byName['manifest'], 'PASS');
  assert.equal(byName['plugin-root-paths'], 'PASS');
  assert.equal(byName['lint-hook-smoke'], 'PASS');
  assert.equal(byName['build-tokens-smoke'], 'PASS');
  assert.ok(['PASS', 'NOT RUN'].includes(byName['python-playwright-capture']));
});

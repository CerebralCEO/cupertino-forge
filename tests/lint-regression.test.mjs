import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lintScript = path.join(root, 'hooks', 'scripts', 'lint.mjs');

test('lint.mjs allows CSS var() in backdrop-filter, box-shadow, and font-family without regex backtracking', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-lint-reg-'));
  try {
    const okCss = path.join(dir, 'valid.css');
    fs.writeFileSync(okCss, [
      '.bar {',
      '  backdrop-filter: var(--cf-glass-filter);',
      '  box-shadow: var(--cf-shadow-popover);',
      '  font-family: var(--cf-font);',
      '}',
      '.cleared { backdrop-filter: none; box-shadow: none; }',
    ].join('\n'));

    const resOk = spawnSync(process.execPath, [lintScript, okCss], { encoding: 'utf8' });
    assert.equal(resOk.status, 0, `Expected valid CSS to pass lint:\n${resOk.stdout}\n${resOk.stderr}`);

    const badCss = path.join(dir, 'invalid.css');
    fs.writeFileSync(badCss, [
      '.bad {',
      '  backdrop-filter: blur(12px);',
      '  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);',
      '  font-family: Inter, sans-serif;',
      '}',
    ].join('\n'));

    const resBad = spawnSync(process.execPath, [lintScript, '--json', badCss], { encoding: 'utf8' });
    assert.equal(resBad.status, 1);
    const findings = JSON.parse(resBad.stdout);
    const rules = new Set(findings.map((f) => f.rule));
    assert.ok(rules.has('raw-backdrop'), 'must flag raw backdrop-filter: blur(...)');
    assert.ok(rules.has('css-shadow'), 'must flag raw box-shadow: 0 4px 12px...');
    assert.ok(rules.has('font-family'), 'must flag literal font-family: Inter');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('lint.mjs handles Windows CRLF & PostToolUse hook blocking cleanly', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-hook-reg-'));
  try {
    fs.writeFileSync(path.join(dir, '.apple-design.json'), JSON.stringify({ platform: 'web', style: 'ios' }));
    const src = path.join(dir, 'card.tsx');
    fs.writeFileSync(src, 'export const Card = () => <div className="backdrop-blur-md" />;\r\n');
    const hook = spawnSync(process.execPath, [lintScript, '--hook', 'post'], {
      input: JSON.stringify({ tool_input: { file_path: src } }),
      encoding: 'utf8',
    });
    assert.equal(hook.status, 2, 'PostToolUse must exit 2 on raw backdrop-blur-md');
    assert.match(hook.stderr, /raw-backdrop/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

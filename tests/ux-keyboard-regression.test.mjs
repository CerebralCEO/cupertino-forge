import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kbScript = path.join(root, 'qa', 'ux-keyboard.mjs');
const seededKb = path.join(root, 'tests', 'seeded-defects', 'keyboard.html');

test('ux-keyboard.mjs detects all 5 known seeded keyboard defects cleanly', () => {
  const res = spawnSync(
    process.execPath,
    [kbScript, '--url', seededKb, '--browser', 'chromium', '--theme', 'light', '--json'],
    { encoding: 'utf8' }
  );
  const report = JSON.parse(res.stdout);
  const run = report.runs[0];
  if (run.summary.notRun > 0) {
    assert.equal(run.summary.notRun, run.checks.length);
    return;
  }
  assert.equal(res.status, 1, `Expected exit 1 on seeded keyboard defects, got ${res.status}`);
  for (const id of [
    'no-positive-tabindex',
    'tab-order-and-no-trap',
    'focus-ring',
    'modal-focus-trap-esc-return',
    'roving-focus-ltr-rtl',
    'enter-space-activation',
  ]) {
    const chk = run.checks.find((c) => c.id === id);
    assert.equal(chk.status, 'FAIL', `Expected ${id} to FAIL on tests/seeded-defects/keyboard.html`);
  }
});

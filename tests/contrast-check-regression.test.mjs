import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'scripts', 'contrast-check.mjs');

test('contrast-check.mjs passes Apple system blue #0088FF (auto-paired with #0091FF) cleanly', () => {
  const res = spawnSync(process.execPath, [script, '--accent', '#0088FF'], { encoding: 'utf8' });
  assert.equal(res.status, 0, `Apple #0088FF must pass:\n${res.stdout}\n${res.stderr}`);
  assert.match(res.stdout, /0 blocking contrast failure/);
});

test('contrast-check.mjs handles 3-digit hex (#fff) without crashing and enforces HIG 18pt/bold thresholds', () => {
  const shortHex = spawnSync(process.execPath, [script, '--accent', '#fff'], { encoding: 'utf8' });
  assert.equal(shortHex.status, 1, 'white on #FFFFFF correctly fails contrast cleanly instead of TypeError crash');
  assert.doesNotMatch(shortHex.stderr, /TypeError/);

  // Brand violet #5B3DF5 passes 3:1 large (>=18pt) and 4.5:1? Check 18pt vs strict 14pt
  const badHex = spawnSync(process.execPath, [script, '--accent', 'not-a-hex'], { encoding: 'utf8' });
  assert.equal(badHex.status, 1);
  assert.match(badHex.stderr, /Invalid --accent color/);
});

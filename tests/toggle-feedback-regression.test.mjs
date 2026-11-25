import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Web and Flutter Toggle never stack haptic + sound simultaneously on the same tap', () => {
  const webHaptics = fs.readFileSync(path.join(root, 'skills', 'apple-web', 'assets', 'lib', 'haptics.ts'), 'utf8');
  assert.match(webHaptics, /export function haptic\([^)]*\):\s*boolean/);

  const webControls = fs.readFileSync(path.join(root, 'skills', 'apple-web', 'assets', 'components', 'apple', 'controls.tsx'), 'utf8');
  assert.match(webControls, /if\s*\(\s*!haptic\('selection'\)\s*\)\s*playSound\(/);

  const dartHaptics = fs.readFileSync(path.join(root, 'skills', 'apple-flutter', 'assets', 'lib', 'apple_ui', 'feedback', 'cf_haptics.dart'), 'utf8');
  assert.match(dartHaptics, /static bool get supported\s*=>/);

  const dartControls = fs.readFileSync(path.join(root, 'skills', 'apple-flutter', 'assets', 'lib', 'apple_ui', 'widgets', 'cf_controls.dart'), 'utf8');
  assert.match(dartControls, /if\s*\(\s*CfHaptics\.supported\s*\)\s*\{[^}]*CfHaptics\.toggle\(v\);[^}]*\}\s*else\s*\{[^}]*CfSounds\.play\(/s);
});

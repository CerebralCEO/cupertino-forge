import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildScript = path.join(root, 'scripts', 'build-tokens.mjs');

test('build-tokens.mjs emits device-display/sheet radii, elevation tokens, dark-safe HC rules, and complete reduced-transparency CSS', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-bt-reg-'));
  try {
    const run = spawnSync(process.execPath, [buildScript, '--out', out, '--targets', 'css,tailwind,ts,dart'], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const css = fs.readFileSync(path.join(out, 'cupertino.tokens.css'), 'utf8');
    const tw = fs.readFileSync(path.join(out, 'cupertino.theme.css'), 'utf8');
    const dart = fs.readFileSync(path.join(out, 'apple_tokens.dart'), 'utf8');

    // Bug 2: missing radius & elevation tokens
    assert.match(css, /--cf-radius-device-display:\s*55px;/);
    assert.match(css, /--cf-radius-sheet-floating:\s*38px;/);
    assert.match(css, /--cf-radius-sheet:\s*var\(--cf-radius-sheet-floating\);/);
    assert.match(css, /--cf-shadow-none:\s*none;/);
    assert.match(css, /--cf-shadow-popover:/);
    assert.match(css, /--cf-shadow-window-active:/);
    assert.match(tw, /--radius-device-display:/);
    assert.match(tw, /--shadow-none:\s*none;/);
    assert.match(dart, /static const double deviceDisplay = 55;/);
    assert.match(dart, /static const double sheetFloating = 38;/);

    // Bug 3: prefers-contrast: more must NOT clobber data-theme="dark"
    assert.match(css, /:root:not\(\[data-contrast="normal"\]\):not\(\[data-theme="dark"\]\)/);
    assert.match(css, /:root\[data-theme="dark"\]:not\(\[data-contrast="normal"\]\)/);

    // Bug 3b: reduced transparency must cover all 4 glass tiers (including large & menu)
    const rtMatch = css.match(/:root\[data-transparency="reduce"\]\s*\{([^}]+)\}/);
    assert.ok(rtMatch, 'must emit :root[data-transparency="reduce"]');
    for (const prop of ['--cf-glass-bg', '--cf-glass-filter', '--cf-glass-clear-bg', '--cf-glass-large-bg', '--cf-glass-large-filter', '--cf-glass-menu-bg', '--cf-glass-menu-filter']) {
      assert.ok(rtMatch[1].includes(prop), `missing ${prop} in data-transparency="reduce"`);
    }
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

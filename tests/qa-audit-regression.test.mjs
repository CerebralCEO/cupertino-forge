import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const auditScript = path.join(root, 'qa', 'computed-style-audit.mjs');
const verifyScript = path.join(root, 'scripts', 'verify-plugin.mjs');
const buildScript = path.join(root, 'scripts', 'build-tokens.mjs');

test('verify-plugin.mjs reports harness toolchains as PASS or NOT RUN (never FAIL)', () => {
  const res = spawnSync(process.execPath, [verifyScript, '--json'], { encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr || res.stdout);
  const parsed = JSON.parse(res.stdout);
  assert.equal(parsed.fails, 0);
  for (const name of ['harness-node', 'harness-playwright', 'harness-flutter', 'harness-cargo']) {
    const row = parsed.results.find((r) => r.name === name);
    assert.ok(row, `missing harness check ${name}`);
    assert.ok(row.status === 'PASS' || row.status === 'NOT RUN', `${name} had unexpected status ${row.status}`);
  }
});

test('computed-style-audit.mjs passes 10/10 on a clean token-compliant HTML page and detects 7 catchable seeded defects', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-qa-reg-'));
  try {
    const tokenOut = path.join(tmpDir, 'cupertino');
    const bt = spawnSync(process.execPath, [buildScript, '--out', tokenOut, '--targets', 'css,json', '--accent', '#0088FF'], { encoding: 'utf8' });
    assert.equal(bt.status, 0, bt.stderr || bt.stdout);

    // Ensure seeded-defects also has fresh generated CSS if running on a clean checkout
    const seededCssOut = path.join(root, 'tests', 'seeded-defects', 'src', 'styles', 'cupertino');
    const btSeeded = spawnSync(process.execPath, [buildScript, '--out', seededCssOut, '--targets', 'css,json', '--accent', '#0088FF'], { encoding: 'utf8' });
    assert.equal(btSeeded.status, 0, btSeeded.stderr || btSeeded.stdout);

    const cleanHtml = path.join(tmpDir, 'clean.html');
    fs.writeFileSync(
      cleanHtml,
      `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="./cupertino/cupertino.tokens.css" />
  <style>
    * { box-sizing: border-box; margin: 0; }
    body {
      padding: 16px;
      background-color: var(--cf-bg);
      color: var(--cf-label);
      font-family: var(--cf-font);
      font-size: var(--cf-text-body-size);
      line-height: var(--cf-text-body-line);
      letter-spacing: var(--cf-text-body-tracking);
    }
    .card {
      padding: 16px;
      border-radius: var(--cf-radius-card);
      background-color: var(--cf-bg-2);
    }
    .btn {
      min-width: 44px;
      min-height: 44px;
      padding: 8px 16px;
      border: 0;
      border-radius: 9999px;
      background-color: var(--cf-accent);
      color: var(--cf-accent-contrast);
      font-size: var(--cf-text-headline-size);
      font-weight: var(--cf-text-headline-weight);
      letter-spacing: var(--cf-text-headline-tracking);
      transition: transform var(--cf-dur-snappy) var(--cf-ease-snappy);
    }
  </style>
</head>
<body>
  <div class="card">
    <p lang="bn" style="letter-spacing: 0">বাংলা পাঠ্য ঠিক আছে</p>
    <button type="button" class="btn">Save Changes</button>
  </div>
</body>
</html>`,
      'utf8'
    );

    const resolvedJson = path.join(tokenOut, 'cupertino.tokens.resolved.json');
    const cleanRun = spawnSync(
      process.execPath,
      [auditScript, '--url', cleanHtml, '--tokens', resolvedJson, '--platform', 'ios', '--json'],
      { encoding: 'utf8' }
    );
    const cleanReport = JSON.parse(cleanRun.stdout);
    const anyNotRun = cleanReport.checks.some((c) => c.status === 'NOT RUN');
    if (anyNotRun) {
      // Optional browser unavailable -> must explicitly report NOT RUN, never fake PASS
      assert.equal(cleanReport.summary.notRun, cleanReport.checks.length);
      return;
    }

    assert.equal(cleanRun.status, 0, `Clean page failed: ${cleanRun.stdout}`);
    assert.equal(cleanReport.summary.pass, 10);
    assert.equal(cleanReport.summary.fail, 0);

    // Check estimate-based tagging
    for (const estId of ['border-radius', 'spacing-grid', 'glass-budget', 'easing']) {
      const c = cleanReport.checks.find((x) => x.id === estId);
      assert.equal(c.basis, 'estimate-based', `${estId} must be tagged estimate-based`);
    }

    // Run on seeded defects fixture
    const seededHtml = path.join(root, 'tests', 'seeded-defects', 'index.html');
    const defectRun = spawnSync(
      process.execPath,
      [auditScript, '--url', seededHtml, '--tokens', resolvedJson, '--platform', 'ios', '--json'],
      { encoding: 'utf8' }
    );
    assert.equal(defectRun.status, 1, `Expected exit 1 on seeded defects, got ${defectRun.status}`);
    const defectReport = JSON.parse(defectRun.stdout);
    for (const expectedFail of ['font-size', 'raw-color', 'hit-target', 'focus-ring', 'easing', 'border-radius', 'contrast']) {
      const c = defectReport.checks.find((x) => x.id === expectedFail);
      assert.equal(c.status, 'FAIL', `Expected ${expectedFail} to FAIL on seeded-defects`);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

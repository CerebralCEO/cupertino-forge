import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const setupScript = path.join(root, 'scripts', 'setup-project.mjs');

function runSetup(args) {
  const res = spawnSync(process.execPath, [setupScript, ...args], { encoding: 'utf8' });
  let parsed = null;
  try {
    parsed = JSON.parse(res.stdout);
  } catch {
    // non-json output
  }
  return { status: res.status, stdout: res.stdout, stderr: res.stderr, json: parsed };
}

test('setup-project.mjs auto-bootstraps Web (redesign), Flutter (new), and Tauri (redesign), respects --dry-run, and never overwrites without --force', () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-setup-reg-'));
  try {
    // 1. Mock Web project (existing UI -> mode=redesign, existing CLAUDE.md preserved)
    const webDir = path.join(sandbox, 'mock-web');
    fs.mkdirSync(path.join(webDir, 'src', 'app'), { recursive: true });
    fs.writeFileSync(
      path.join(webDir, 'package.json'),
      JSON.stringify({ name: 'mock-web', dependencies: { next: '15.0.0', react: '19.0.0' } })
    );
    fs.writeFileSync(path.join(webDir, 'src', 'app', 'page.tsx'), 'export default function Page() { return <main />; }\n');
    fs.writeFileSync(path.join(webDir, 'CLAUDE.md'), '# Existing User Rules\nKeep this line intact.\n');

    // Dry run must detect web + redesign and create zero files on disk
    const webDry = runSetup(['--target', webDir, '--dry-run', '--json']);
    assert.equal(webDry.status, 0, webDry.stderr);
    assert.equal(webDry.json.detected.stack, 'web');
    assert.equal(webDry.json.detected.mode, 'redesign');
    assert.equal(webDry.json.dryRun, true);
    assert.equal(fs.existsSync(path.join(webDir, '.apple-design.json')), false);
    assert.equal(fs.existsSync(path.join(webDir, '.agent', 'rules', 'cupertino-forge.md')), false);

    // Real run
    const webRun = runSetup(['--target', webDir, '--json']);
    assert.equal(webRun.status, 0, webRun.stderr);
    assert.equal(webRun.json.detected.stack, 'web');
    assert.equal(webRun.json.detected.mode, 'redesign');
    assert.equal(fs.existsSync(path.join(webDir, '.apple-design.json')), true);
    assert.equal(fs.existsSync(path.join(webDir, 'src', 'styles', 'cupertino', 'cupertino.tokens.css')), true);
    assert.equal(fs.existsSync(path.join(webDir, 'src', 'styles', 'cupertino', 'cupertino.theme.css')), true);
    assert.equal(fs.existsSync(path.join(webDir, 'src', 'styles', 'cupertino', 'cupertino.tokens.ts')), true);
    assert.equal(fs.existsSync(path.join(webDir, 'src', 'styles', 'cupertino', 'cupertino.base.css')), true);
    assert.equal(fs.existsSync(path.join(webDir, 'src', 'components', 'apple', 'root.tsx')), true);

    const agRule = fs.readFileSync(path.join(webDir, '.agent', 'rules', 'cupertino-forge.md'), 'utf8');
    assert.equal(agRule.includes('<PLUGIN_PATH>'), false, 'zero <PLUGIN_PATH> placeholders should remain');
    assert.equal(agRule.includes(root), true, 'resolved plugin root path should be injected');

    const claudeMd = fs.readFileSync(path.join(webDir, 'CLAUDE.md'), 'utf8');
    assert.equal(claudeMd.includes('Keep this line intact.'), true, 'existing CLAUDE.md content preserved');
    assert.equal(claudeMd.includes('## Apple design system (cupertino-forge)'), true, 'cupertino-forge block appended');

    // Mutate .apple-design.json and re-run WITHOUT --force: must skip and preserve user edits
    const cfgPath = path.join(webDir, '.apple-design.json');
    const customCfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    customCfg.accent = '#5B3DF5';
    fs.writeFileSync(cfgPath, JSON.stringify(customCfg, null, 2));

    const webSecond = runSetup(['--target', webDir, '--json']);
    assert.equal(webSecond.status, 0, webSecond.stderr);
    assert.equal(webSecond.json.counts.overwritten, 0);
    assert.ok(webSecond.json.skipped.includes('.apple-design.json'));
    assert.equal(JSON.parse(fs.readFileSync(cfgPath, 'utf8')).accent, '#5B3DF5', 'existing file must not be overwritten without --force');

    // Re-run WITH --force: overwrites cleanly
    const webForce = runSetup(['--target', webDir, '--force', '--json']);
    assert.equal(webForce.status, 0, webForce.stderr);
    assert.ok(webForce.json.overwritten.includes('.apple-design.json'));

    // 2. Mock Flutter project (greenfield -> mode=new)
    const fluDir = path.join(sandbox, 'mock-flutter');
    fs.mkdirSync(path.join(fluDir, 'lib'), { recursive: true });
    fs.writeFileSync(path.join(fluDir, 'pubspec.yaml'), 'name: mock_flutter\ndependencies:\n  flutter:\n    sdk: flutter\n');

    const fluRun = runSetup(['--target', fluDir, '--platform', 'ios', '--ide', 'antigravity', '--json']);
    assert.equal(fluRun.status, 0, fluRun.stderr);
    assert.equal(fluRun.json.detected.stack, 'flutter');
    assert.equal(fluRun.json.detected.style, 'ios');
    assert.equal(fluRun.json.detected.mode, 'new');
    assert.equal(fs.existsSync(path.join(fluDir, 'lib', 'apple_ui', 'theme', 'apple_tokens.dart')), true);
    assert.equal(fs.existsSync(path.join(fluDir, 'lib', 'apple_ui', 'cf_app.dart')), true);
    assert.equal(fs.existsSync(path.join(fluDir, '.agent', 'rules', 'cupertino-forge.md')), true);
    assert.equal(fs.existsSync(path.join(fluDir, 'CLAUDE.md')), false, '--ide antigravity should not create CLAUDE.md');

    // 3. Mock Tauri project (tauri + web frontend -> stack=tauri, style=macos default, mode=redesign)
    const tauriDir = path.join(sandbox, 'mock-tauri');
    fs.mkdirSync(path.join(tauriDir, 'src-tauri', 'src'), { recursive: true });
    fs.mkdirSync(path.join(tauriDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(tauriDir, 'src-tauri', 'Cargo.toml'), '[package]\nname = "mock-tauri"\nversion = "0.1.0"\n');
    fs.writeFileSync(path.join(tauriDir, 'package.json'), JSON.stringify({ name: 'mock-tauri', dependencies: { react: '19.0.0', vite: '6.0.0' } }));
    fs.writeFileSync(path.join(tauriDir, 'src', 'App.tsx'), 'export function App() { return null; }\n');

    const tauriRun = runSetup(['--target', tauriDir, '--json']);
    assert.equal(tauriRun.status, 0, tauriRun.stderr);
    assert.equal(tauriRun.json.detected.stack, 'tauri');
    assert.equal(tauriRun.json.detected.style, 'macos');
    assert.equal(tauriRun.json.detected.mode, 'redesign');
    assert.equal(fs.existsSync(path.join(tauriDir, 'src-tauri', 'src', 'apple_tokens.rs')), true);
    assert.equal(fs.existsSync(path.join(tauriDir, 'src-tauri', 'src', 'apple_config.rs')), true);
    assert.equal(fs.existsSync(path.join(tauriDir, 'src-tauri', 'src', 'apple_window.rs')), true);
    assert.equal(fs.existsSync(path.join(tauriDir, 'src', 'styles', 'cupertino', 'cupertino.tokens.css')), true);

    // 4. Empty folder with no stack -> exits 2 cleanly
    const emptyDir = path.join(sandbox, 'mock-empty');
    fs.mkdirSync(emptyDir, { recursive: true });
    const emptyRun = runSetup(['--target', emptyDir, '--json']);
    assert.equal(emptyRun.status, 2);
    assert.equal(emptyRun.json.ok, false);
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
});

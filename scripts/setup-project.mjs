#!/usr/bin/env node
// Zero-config, cross-platform auto-bootstrapper for cupertino-forge.
// Detects stack (web | flutter | tauri) and mode (new | redesign), writes .apple-design.json,
// installs IDE rules (.agent/rules/cupertino-forge.md and/or CLAUDE.md), builds tokens,
// and copies adapter starter assets without overwriting existing user files unless --force is passed.
//
// Usage:
//   node scripts/setup-project.mjs --target <dir> [--platform ios|macos|adaptive|auto] [--mode new|redesign|auto] [--ide antigravity|claude|both] [--force] [--dry-run] [--json]
//
// Exit codes:
//   0 = success (or dry-run complete)
//   1 = runtime / token build error
//   2 = CLI usage or ambiguous/undetected stack error

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const opts = {
    target: process.cwd(),
    platform: 'auto',
    mode: 'auto',
    ide: 'both',
    force: false,
    dryRun: false,
    json: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target' && argv[i + 1]) opts.target = argv[++i];
    else if (a === '--platform' && argv[i + 1]) opts.platform = argv[++i].toLowerCase();
    else if (a === '--mode' && argv[i + 1]) opts.mode = argv[++i].toLowerCase();
    else if (a === '--ide' && argv[i + 1]) opts.ide = argv[++i].toLowerCase();
    else if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--help' || a === '-h') opts.help = true;
  }
  return opts;
}

function fail(code, message, asJson) {
  if (asJson) {
    process.stdout.write(JSON.stringify({ ok: false, error: message }, null, 2) + '\n');
  } else {
    process.stderr.write(`cupertino-forge setup error: ${message}\n`);
  }
  process.exit(code);
}

function detectStack(targetDir) {
  const hasTauri = fs.existsSync(path.join(targetDir, 'src-tauri', 'Cargo.toml'));
  const hasFlutter = fs.existsSync(path.join(targetDir, 'pubspec.yaml'));
  let hasWeb = false;
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps.next || deps.react || deps['react-dom'] || deps.vite) hasWeb = true;
    } catch {
      // ignore malformed package.json here; handled by no-stack check
    }
  }

  const detected = [];
  if (hasTauri) detected.push('tauri');
  if (hasFlutter) detected.push('flutter');
  // A Tauri project normally includes a web package.json frontend, so don't treat tauri+web as ambiguous.
  if (hasWeb && !hasTauri) detected.push('web');

  if (detected.length === 0) {
    return {
      ok: false,
      error:
        `Could not detect a supported stack in "${targetDir}". ` +
        'Expected one of: package.json (with next/react/vite), pubspec.yaml (Flutter), or src-tauri/Cargo.toml (Tauri 2).',
    };
  }
  if (detected.length > 1) {
    return {
      ok: false,
      error:
        `Multiple conflicting stacks detected in "${targetDir}": ${detected.join(', ')}. ` +
        'Run setup-project.mjs inside a single-stack project folder.',
    };
  }
  return { ok: true, stack: detected[0] };
}

function hasFilesRecursive(dir, predicate, excludeDirs = new Set()) {
  if (!fs.existsSync(dir)) return false;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (excludeDirs.has(entry.name)) continue;
      if (hasFilesRecursive(path.join(dir, entry.name), predicate, excludeDirs)) return true;
    } else if (entry.isFile() && predicate(entry.name)) {
      return true;
    }
  }
  return false;
}

function detectMode(targetDir, stack) {
  if (stack === 'flutter') {
    const mainDart = path.join(targetDir, 'lib', 'main.dart');
    if (fs.existsSync(mainDart)) return 'redesign';
    const hasDart = hasFilesRecursive(
      path.join(targetDir, 'lib'),
      (n) => n.endsWith('.dart'),
      new Set(['apple_ui'])
    );
    return hasDart ? 'redesign' : 'new';
  }
  // web or tauri frontend
  const uiCandidates = [
    path.join(targetDir, 'src', 'app'),
    path.join(targetDir, 'app'),
    path.join(targetDir, 'src', 'components'),
    path.join(targetDir, 'components'),
    path.join(targetDir, 'src', 'pages'),
    path.join(targetDir, 'pages'),
  ];
  const uiExt = (n) => /\.(tsx|jsx|vue|svelte|astro)$/i.test(n);
  const exclude = new Set(['apple', 'cupertino', 'node_modules', '.next', 'dist']);
  for (const dir of uiCandidates) {
    if (hasFilesRecursive(dir, uiExt, exclude)) return 'redesign';
  }
  for (const single of ['src/App.tsx', 'src/App.jsx', 'src/index.tsx']) {
    if (fs.existsSync(path.join(targetDir, single))) return 'redesign';
  }
  return 'new';
}

function walkFiles(baseDir, relPrefix = '', acc = []) {
  if (!fs.existsSync(baseDir)) return acc;
  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const abs = path.join(baseDir, entry.name);
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walkFiles(abs, rel, acc);
    else if (entry.isFile()) acc.push({ abs, rel });
  }
  return acc;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Usage: node scripts/setup-project.mjs --target <dir> [--platform ios|macos|adaptive|auto] [--mode new|redesign|auto] [--ide antigravity|claude|both] [--force] [--dry-run] [--json]'
    );
    process.exit(0);
  }

  const validPlatforms = new Set(['ios', 'macos', 'adaptive', 'auto']);
  const validModes = new Set(['new', 'redesign', 'auto']);
  const validIdes = new Set(['antigravity', 'claude', 'both']);
  if (!validPlatforms.has(opts.platform)) fail(2, `Invalid --platform "${opts.platform}". Expected ios|macos|adaptive|auto.`, opts.json);
  if (!validModes.has(opts.mode)) fail(2, `Invalid --mode "${opts.mode}". Expected new|redesign|auto.`, opts.json);
  if (!validIdes.has(opts.ide)) fail(2, `Invalid --ide "${opts.ide}". Expected antigravity|claude|both.`, opts.json);

  const targetDir = path.resolve(opts.target);
  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    fail(2, `Target directory does not exist: "${targetDir}"`, opts.json);
  }

  const stackRes = detectStack(targetDir);
  if (!stackRes.ok) fail(2, stackRes.error, opts.json);
  const stack = stackRes.stack;

  const style = opts.platform === 'auto' ? (stack === 'tauri' ? 'macos' : 'adaptive') : opts.platform;
  const mode = opts.mode === 'auto' ? detectMode(targetDir, stack) : opts.mode;
  const scenario = mode === 'redesign' ? 'Scenario B (Brownfield Redesign)' : 'Scenario A (Greenfield App)';

  const useSrcDir = fs.existsSync(path.join(targetDir, 'src')) || !fs.existsSync(path.join(targetDir, 'styles'));
  const webSrcRoot = useSrcDir ? 'src' : '.';
  const webTokensRel = useSrcDir ? 'src/styles/cupertino' : 'styles/cupertino';
  const tokensOutRel = stack === 'flutter' ? 'lib/apple_ui/theme' : webTokensRel;

  const created = [];
  const overwritten = [];
  const appended = [];
  const skipped = [];

  function writeSafe(relPath, content) {
    const abs = path.join(targetDir, ...relPath.split('/'));
    const exists = fs.existsSync(abs);
    if (exists && !opts.force) {
      skipped.push(relPath);
      return;
    }
    if (!opts.dryRun) {
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content, 'utf8');
    }
    if (exists) overwritten.push(relPath);
    else created.push(relPath);
  }

  function copySafe(srcAbs, relPath) {
    const abs = path.join(targetDir, ...relPath.split('/'));
    const exists = fs.existsSync(abs);
    if (exists && !opts.force) {
      skipped.push(relPath);
      return;
    }
    if (!opts.dryRun) {
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.copyFileSync(srcAbs, abs);
    }
    if (exists) overwritten.push(relPath);
    else created.push(relPath);
  }

  // 1. .apple-design.json
  const tplCfg = JSON.parse(fs.readFileSync(path.join(pluginRoot, 'templates', 'apple-design.json'), 'utf8'));
  const cfg = {
    ...tplCfg,
    platform: stack,
    style,
    tokensOut: tokensOutRel,
  };
  writeSafe('.apple-design.json', JSON.stringify(cfg, null, 2) + '\n');

  // 2. IDE rule placement
  if (opts.ide === 'antigravity' || opts.ide === 'both') {
    const rawAgents = fs.readFileSync(path.join(pluginRoot, 'templates', 'AGENTS.apple.md'), 'utf8');
    const resolvedAgents = rawAgents
      .replaceAll('<PLUGIN_PATH>', pluginRoot)
      .replace(
        /- \*\*Plugin path \(`.*?`\):\*\* `.*?`/,
        `- **Plugin path (\`${pluginRoot}\`):** \`${pluginRoot}\``
      );
    writeSafe('.agent/rules/cupertino-forge.md', resolvedAgents);
  }

  if (opts.ide === 'claude' || opts.ide === 'both') {
    const claudeBlock = fs.readFileSync(path.join(pluginRoot, 'templates', 'CLAUDE.apple.md'), 'utf8').trim();
    const claudeAbs = path.join(targetDir, 'CLAUDE.md');
    if (!fs.existsSync(claudeAbs)) {
      writeSafe('CLAUDE.md', claudeBlock + '\n');
    } else {
      const existing = fs.readFileSync(claudeAbs, 'utf8');
      if (existing.includes('## Apple design system (cupertino-forge)')) {
        skipped.push('CLAUDE.md');
      } else {
        if (!opts.dryRun) {
          const sep = existing.endsWith('\n') ? '\n' : '\n\n';
          fs.writeFileSync(claudeAbs, existing + sep + claudeBlock + '\n', 'utf8');
        }
        appended.push('CLAUDE.md');
      }
    }
  }

  // 3. Token generation (always build into an isolated temp dir first so --dry-run and non---force are 100% safe)
  const buildScript = path.join(pluginRoot, 'scripts', 'build-tokens.mjs');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-setup-tokens-'));
  try {
    const buildJobs = [];
    if (stack === 'web' || stack === 'tauri') {
      buildJobs.push({ targets: 'css,tailwind,ts', destRel: webTokensRel, sub: 'web' });
    }
    if (stack === 'flutter') {
      buildJobs.push({ targets: 'dart', destRel: 'lib/apple_ui/theme', sub: 'flutter' });
    }
    if (stack === 'tauri') {
      buildJobs.push({ targets: 'rust', destRel: 'src-tauri/src', sub: 'rust' });
    }

    for (const job of buildJobs) {
      const jobTmp = path.join(tmpDir, job.sub);
      fs.mkdirSync(jobTmp, { recursive: true });
      const res = spawnSync(
        process.execPath,
        [buildScript, '--out', jobTmp, '--targets', job.targets],
        { encoding: 'utf8' }
      );
      if (res.status !== 0) {
        fail(1, `build-tokens.mjs (${job.targets}) failed: ${res.stderr || res.stdout}`, opts.json);
      }
      for (const f of fs.readdirSync(jobTmp).sort()) {
        copySafe(path.join(jobTmp, f), `${job.destRel}/${f}`);
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  // 4. Adapter starter assets (never overwrite existing user files unless --force)
  const manualNotes = [];
  if (stack === 'web' || stack === 'tauri') {
    const webAssets = path.join(pluginRoot, 'skills', 'apple-web', 'assets');
    const libPrefix = webSrcRoot === '.' ? 'lib/cupertino' : `${webSrcRoot}/lib/cupertino`;
    const compPrefix = webSrcRoot === '.' ? 'components/apple' : `${webSrcRoot}/components/apple`;
    for (const f of walkFiles(path.join(webAssets, 'lib'))) {
      copySafe(f.abs, `${libPrefix}/${f.rel}`);
    }
    for (const f of walkFiles(path.join(webAssets, 'components', 'apple'))) {
      copySafe(f.abs, `${compPrefix}/${f.rel}`);
    }
    const baseCss = path.join(webAssets, 'styles', 'cupertino.base.css');
    if (fs.existsSync(baseCss)) {
      copySafe(baseCss, `${webTokensRel}/cupertino.base.css`);
    }
  }

  if (stack === 'flutter') {
    const flutterAssets = path.join(pluginRoot, 'skills', 'apple-flutter', 'assets', 'lib', 'apple_ui');
    for (const f of walkFiles(flutterAssets)) {
      // Freshly generated apple_tokens.dart already handled in step 3
      if (f.rel === 'theme/apple_tokens.dart') continue;
      copySafe(f.abs, `lib/apple_ui/${f.rel}`);
    }
    manualNotes.push(
      `Register optional native haptics from "${path.join(pluginRoot, 'skills', 'apple-flutter', 'assets', 'ios', 'AppleHapticsPlugin.swift')}" and "${path.join(pluginRoot, 'skills', 'apple-flutter', 'assets', 'android', 'AppleHapticsPlugin.kt')}".`
    );
  }

  if (stack === 'tauri') {
    const tauriSrc = path.join(pluginRoot, 'skills', 'apple-tauri', 'assets', 'src-tauri', 'src');
    for (const rsFile of ['apple_config.rs', 'apple_menu.rs', 'apple_window.rs']) {
      const abs = path.join(tauriSrc, rsFile);
      if (fs.existsSync(abs)) copySafe(abs, `src-tauri/src/${rsFile}`);
    }
    manualNotes.push(
      `Merge Rust/Tauri snippets manually from "${path.join(pluginRoot, 'skills', 'apple-tauri', 'assets')}" (Cargo-snippet.toml, tauri.conf.snippet.json or tauri.conf.mas.snippet.json, src-tauri/src/lib-snippet.rs).`
    );
  }

  const nextCommand =
    mode === 'redesign'
      ? `/apple-redesign (follow ${path.join(pluginRoot, 'skills', 'apple-design-core', 'references', 'patterns', 'redesign-playbook.md')})`
      : `/apple-screen <description> (follow ${path.join(pluginRoot, 'skills', 'apple-design-core', 'references', 'workflows', 'use-flow.md')})`;

  const summary = {
    ok: true,
    dryRun: opts.dryRun,
    force: opts.force,
    pluginRoot,
    target: targetDir,
    detected: { stack, style, mode, scenario, ide: opts.ide, tokensOut: tokensOutRel },
    counts: {
      created: created.length,
      overwritten: overwritten.length,
      appended: appended.length,
      skipped: skipped.length,
    },
    created,
    overwritten,
    appended,
    skipped,
    manualNotes,
    nextStep: {
      workflow: path.join(pluginRoot, 'skills', 'apple-design-core', 'references', 'workflows', 'use-flow.md'),
      scenario,
      recommended: nextCommand,
    },
  };

  if (opts.json) {
    process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
  } else {
    console.log(`cupertino-forge setup-project${opts.dryRun ? ' (DRY RUN)' : ''}`);
    console.log(`Plugin:   ${pluginRoot}`);
    console.log(`Target:   ${targetDir}`);
    console.log(`Detected: stack=${stack} | style=${style} | mode=${mode} -> ${scenario} | ide=${opts.ide}`);
    console.log(
      `Summary:  ${created.length} created, ${appended.length} appended, ${overwritten.length} overwritten, ${skipped.length} skipped`
    );
    if (created.length) console.log(`Created:  ${created.slice(0, 12).join(', ')}${created.length > 12 ? ` (+${created.length - 12} more)` : ''}`);
    if (appended.length) console.log(`Appended: ${appended.join(', ')}`);
    if (overwritten.length) console.log(`Overwritten (--force): ${overwritten.join(', ')}`);
    if (skipped.length) console.log(`Skipped (already exists; pass --force to overwrite): ${skipped.slice(0, 12).join(', ')}${skipped.length > 12 ? ` (+${skipped.length - 12} more)` : ''}`);
    for (const note of manualNotes) console.log(`Note:     ${note}`);
    console.log(`Next:     Start ${scenario} via ${summary.nextStep.workflow} -> ${nextCommand}`);
  }
}

main();

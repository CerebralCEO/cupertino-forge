#!/usr/bin/env node
// cupertino-forge design linter and hook entry point.
//
// CLI:   node lint.mjs --all [--root <dir>] [--json]       scan the whole project
//        node lint.mjs <file> [<file> ...]                   scan files
// Hooks (stdin JSON from Claude Code):
//        node lint.mjs --hook post      PostToolUse Write|Edit|MultiEdit: block on errors (exit 2)
//        node lint.mjs --hook stop      Stop: block finishing while changed files have errors
//        node lint.mjs --hook session   SessionStart: inject the design contract reminder
//        node lint.mjs --hook prompt    UserPromptSubmit: remind to load the skill for UI prompts
//
// Active only inside projects that contain .apple-design.json (searched upward).
// Suppress a finding on one line with a comment containing: cf-ignore

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };

// ---------------- config discovery ----------------
function findConfig(start) {
  let dir = path.resolve(start);
  for (;;) {
    const f = path.join(dir, '.apple-design.json');
    if (fs.existsSync(f)) {
      try { return { root: dir, config: JSON.parse(fs.readFileSync(f, 'utf8')) }; } catch { return { root: dir, config: {} }; }
    }
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

// ---------------- exclusions ----------------
const EXCLUDE_DIRS = /(^|[\\/])(node_modules|\.next|dist|build|out|\.dart_tool|\.git|target|coverage|\.turbo|\.vercel|ios[\\/]Pods|android[\\/]\.gradle)([\\/]|$)/;
// Vetted primitives and generated files are allowed to contain raw values.
const EXCLUDE_FILES = /(cupertino\.tokens\.(css|ts)|cupertino\.theme\.css|cupertino\.base\.css|apple_tokens\.dart|[\\/]components[\\/]apple[\\/]|[\\/]lib[\\/]cupertino[\\/]|[\\/]styles[\\/]cupertino[\\/]|[\\/]lib[\\/]apple_ui[\\/]|tailwind\.config|\.d\.ts$|\.test\.|\.spec\.|stories\.)/;
const WEB_EXT = /\.(tsx|jsx|ts|js|mjs|css|scss|html|vue|svelte|astro)$/;
const DART_EXT = /\.dart$/;

// ---------------- rules ----------------
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const webRules = [
  { id: 'raw-hex', sev: 'error', re: /(?<![\w&-])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![\w-])/, skipIf: /href=|url\(#|#[0-9a-fA-F]+\s*[:]|xlink/, msg: 'Raw hex color. Use a semantic token: text-label, bg-bg-grouped, var(--cf-accent) ...' },
  { id: 'raw-color-fn', sev: 'error', re: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(\s*(?!var\()[\d.]/, msg: 'Raw color function. Use cf color tokens.' },
  { id: 'tw-palette', sev: 'error', re: new RegExp(`\\b(?:text|bg|border|ring|fill|stroke|from|to|via|shadow|outline|decoration|divide|placeholder|accent|caret)-(?:${PALETTE})-\\d{2,3}\\b`), msg: 'Tailwind palette color. Use cf semantic classes (text-label-2, bg-fill-3, text-accent, text-red).' },
  { id: 'shadcn-default', sev: 'warn', re: /\b(?:bg-primary|text-primary-foreground|text-muted-foreground|bg-muted|bg-secondary|border-input|bg-card|bg-background|text-foreground|bg-destructive|bg-popover)\b/, msg: 'shadcn default token. It is remapped, but prefer cf names (bg-accent, text-label-2, bg-fill-4, bg-bg-2).' },
  { id: 'tw-rounded', sev: 'error', re: /\brounded(?:-[trblse]{1,2})?-(?:sm|md|lg|xl|2xl|3xl|\[\d+(?:\.\d+)?px\])\b/, skipIf: /\bsquircle\b/, msg: 'Plain rounded corner. Use rounded-capsule, rounded-full, or a radius token (rounded-card) together with the squircle utility.' },
  { id: 'css-radius', sev: 'error', re: /border(?:-[a-z-]+)?-radius\s*:\s*\d+(?:\.\d+)?px/, skipIf: /corner-shape|9999px|50%/, msg: 'border-radius in px without corner-shape. Use var(--cf-radius-*) with corner-shape: squircle, or a capsule.' },
  { id: 'tw-shadow', sev: 'error', re: /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/, msg: 'Tailwind shadow. Use elevation tokens: shadow-popover, shadow-knob, shadow-raised, or none for content.' },
  { id: 'css-shadow', sev: 'error', re: /box-shadow\s*:(?!\s*(?:var\(|(?:none|inherit|initial|unset)\b))[^;]*\d+px/, msg: 'Hand written box-shadow. Use var(--cf-shadow-*) or var(--cf-glass-shadow).' },
  { id: 'easing', sev: 'error', re: /\b(?:ease-in-out|ease-in|ease-out|ease-linear)\b|transition[^;:\n]*:\s*[^;]*\b(?:ease|ease-in-out|linear)\b|ease\s*:\s*['"](?:easeInOut|easeIn|easeOut|linear)['"]|cubic-bezier\(/, msg: 'Non spring easing. Use spring tokens: transition={spring("snappy")} or ease-snappy / var(--cf-ease-snappy) with var(--cf-dur-snappy).' },
  { id: 'tw-text-size', sev: 'error', re: /\btext-(?:xs|sm|base|lg|xl|[2-9]xl|\[\d+(?:\.\d+)?(?:px|rem)\])\b/, msg: 'Off scale text size. Use a named text style class: text-body, text-headline, text-footnote, text-large-title ...' },
  { id: 'css-font-size', sev: 'error', re: /font-size\s*:\s*\d+(?:\.\d+)?(?:px|rem|pt)/, msg: 'Raw font-size. Use var(--cf-text-<style>-size) and its line height and tracking.' },
  { id: 'font-family', sev: 'error', re: /font-family\s*:(?!\s*(?:var\(|inherit\b))\s*['"]?(?:Roboto|Arial|Helvetica|Inter|Open Sans|Poppins|Montserrat|Lato|system-ui)/i, msg: 'Literal font-family. Use var(--cf-font) (system font on Apple devices, Inter elsewhere).' },
  { id: 'thin-weight', sev: 'error', re: /\bfont-(?:thin|extralight|light)\b|font-weight\s*:\s*(?:100|200|300)\b/, msg: 'Light weights are not used for UI text. Use regular, medium, semibold, bold.' },
  { id: 'gradient-bg', sev: 'warn', re: /\bbg-gradient-to-|\bbg-linear-to-|linear-gradient\(/, skipIf: /mask|scroll-edge/, msg: 'Gradient. Apple controls and surfaces do not use decorative gradients.' },
  { id: 'hamburger', sev: 'error', re: /\b(?:Menu as Hamburger|HamburgerIcon|MenuIcon|<Menu\s+size)/, msg: 'Hamburger menu. Use a tab bar (iOS) or sidebar (iPad, macOS).' },
  { id: 'glass-border', sev: 'error', re: /border(?:-[a-z]+)?\s*:\s*1px\s+solid\s+rgba?\(\s*255\s*,\s*255\s*,\s*255/, msg: 'Dribbble style glass border. Use <Glass> or the glass utility (rim light comes from inset highlights).' },
  { id: 'raw-backdrop', sev: 'error', re: /backdrop-filter\s*:(?!\s*(?:var\(|(?:none|inherit|initial|unset)\b))|\bbackdrop-blur(?:-\w+)?\b/, msg: 'Hand rolled backdrop blur. Use <Glass> or glass / glass-large / glass-clear utilities.' },
  { id: 'emoji-icon', sev: 'warn', re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, msg: 'Emoji in UI code. Use an SF Symbol equivalent mapped in tokens/icons.json.' },
];

const dartRules = [
  { id: 'material-import', sev: 'error', re: /import\s+['"]package:flutter\/material\.dart['"]/, msg: 'Material import. Use package:flutter/cupertino.dart and apple_ui widgets.' },
  { id: 'material-widget', sev: 'error', re: /\b(?:Scaffold|AppBar|ElevatedButton|TextButton|OutlinedButton|FilledButton|FloatingActionButton|InkWell|InkResponse|ListTile|Card|SnackBar|MaterialApp|Switch|Slider|Checkbox|Radio|BottomNavigationBar|NavigationBar|Drawer|Chip|TabBar)\(/, skipIf: /Cupertino|Cf[A-Z]/, msg: 'Material widget. Use the cf equivalent (CfButton, CfListRow, CfToggle, CfTabBar, CfLargeTitleScaffold ...).' },
  { id: 'material-colors', sev: 'error', re: /\bColors\.\w+/, msg: 'Material Colors. Use context.cf.<token>.' },
  { id: 'raw-color', sev: 'error', re: /\bColor\(\s*0x[0-9a-fA-F]{8}\s*\)|Color\.fromARGB\(|Color\.fromRGBO\(/, msg: 'Raw Color. Use context.cf.<token>.' },
  { id: 'curves', sev: 'error', re: /\bCurves\.(?:ease|easeIn|easeOut|easeInOut|linear|fastOutSlowIn|decelerate|easeInOutCubic|easeOutCubic)\b/, msg: 'Non spring curve. Use animateSpring(controller, target, AppleSprings.snappy).' },
  { id: 'border-radius', sev: 'warn', re: /\bBorderRadius\.circular\(|\bRoundedRectangleBorder\(|\bContinuousRectangleBorder\(/, msg: 'Plain rounded corner. Use SquircleBorder(radius: AppleRadiusIOS.*) or StadiumBorder.' },
  { id: 'font-size', sev: 'error', re: /\bfontSize\s*:\s*\d/, msg: 'Raw fontSize. Use context.cf.type.<style>.' },
  { id: 'text-style-literal', sev: 'warn', re: /\bTextStyle\(/, msg: 'Literal TextStyle. Use context.cf.type.<style> (optionally .copyWith(color:)).' },
  { id: 'box-shadow', sev: 'warn', re: /\bBoxShadow\(/, msg: 'Literal BoxShadow. Use the elevation values from tokens or CfGlass.' },
  { id: 'ripple', sev: 'error', re: /\bsplashColor|highlightColor|InkSplash|splashFactory/, msg: 'Material ripple settings. Apple has no ripples; use CfPressable.' },
  { id: 'manual-text-scale', sev: 'error', re: /\btextScaler(?:Of\([^)]*\))?\.scale\(/, msg: 'Manual textScaler.scale() causes double scaling with Text widgets. Use MediaQuery.withClampedTextScaling instead.' },
  { id: 'navigation-mode', sev: 'warn', re: /\bnavigationMode\b/, msg: 'MediaQuery.navigationMode checks D-pad/TV navigation, not pointer vs touch. Inspect PointerDeviceKind instead.' },
];

function lintText(file, text) {
  const rules = DART_EXT.test(file) ? dartRules : WEB_EXT.test(file) ? webRules : null;
  if (!rules) return [];
  const out = [];
  const lines = text.split(/\r?\n/);
  let inBlockComment = false;
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (inBlockComment) { if (trimmed.includes('*/')) inBlockComment = false; return; }
    if (trimmed.startsWith('/*') && !trimmed.includes('*/')) { inBlockComment = true; return; }
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('<!--')) return;
    if (line.includes('cf-ignore')) return;
    for (const r of rules) {
      if (r.re.test(line) && !(r.skipIf && r.skipIf.test(line))) {
        out.push({ file, line: i + 1, rule: r.id, sev: r.sev, msg: r.msg, code: trimmed.slice(0, 140) });
      }
    }
  });
  return out;
}

function lintFile(file) {
  if (EXCLUDE_DIRS.test(file) || EXCLUDE_FILES.test(file)) return [];
  if (!WEB_EXT.test(file) && !DART_EXT.test(file)) return [];
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { return []; }
  return lintText(file, text);
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (EXCLUDE_DIRS.test(p + path.sep)) continue;
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function changedFiles(root) {
  try {
    const out = execSync('git status --porcelain', { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out.split(/\r?\n/).filter(Boolean).map((l) => {
      let rel = l.slice(3).split(' -> ').pop().trim();
      if (rel.startsWith('"') && rel.endsWith('"')) rel = rel.slice(1, -1).replace(/\\"/g, '"');
      return path.join(root, rel);
    });
  } catch { return null; }
}

function format(findings, root) {
  const by = {};
  for (const f of findings) (by[f.file] ??= []).push(f);
  const L = [];
  for (const [file, list] of Object.entries(by)) {
    L.push(path.relative(root, file));
    for (const f of list) L.push(`  ${f.line}  ${f.sev.toUpperCase()}  ${f.rule}: ${f.msg}\n        > ${f.code}`);
  }
  return L.join('\n');
}

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

// ---------------- hook modes ----------------
const hook = opt('hook');
if (hook) {
  const input = readStdin();
  const cwd = input.cwd || process.cwd();

  if (hook === 'session' || hook === 'prompt') {
    const found = findConfig(cwd);
    if (!found) process.exit(0);
    if (hook === 'prompt') {
      const p = String(input.prompt || '').toLowerCase();
      const ui = /(ui|screen|page|component|layout|design|style|button|modal|sheet|dialog|navbar|sidebar|toolbar|tab|card|list|form|theme|dark mode|animation|glass|ডিজাইন|স্ক্রিন|পেজ|বাটন)/.test(p);
      if (!ui) process.exit(0);
    }
    const c = found.config;
    process.stdout.write(
      `[cupertino-forge] This project uses the Apple design system (platform=${c.platform ?? '?'}, style=${c.style ?? '?'}, accent=${c.accent ?? 'system blue'}, sounds=${c.sounds ? 'on' : 'off'}). ` +
      'Before any UI work: load the apple-design-core skill, then the platform adapter skill (apple-web / apple-flutter / apple-tauri), follow the contract in section 0, use only generated tokens and the provided primitives, ' +
      'and end with the Apple Design Compliance report. Raw colors, px radii, hand written shadows, non spring easing and off scale font sizes are blocked by the lint hook.\n'
    );
    process.exit(0);
  }

  if (hook === 'post') {
    const file = input.tool_input?.file_path || input.tool_input?.path;
    if (!file) process.exit(0);
    const abs = path.isAbsolute(file) ? file : path.join(cwd, file);
    const found = findConfig(path.dirname(abs));
    if (!found) process.exit(0);
    const findings = lintFile(abs);
    const errors = findings.filter((f) => f.sev === 'error');
    const warns = findings.filter((f) => f.sev === 'warn');
    if (errors.length) {
      process.stderr.write(`cupertino-forge lint: ${errors.length} Apple design violation(s) in ${path.relative(found.root, abs)}. Fix them now using tokens and primitives (see apple-design-core references/anti-patterns.md). Add "cf-ignore" only for a justified exception and mention it in the Compliance report.\n\n${format(errors, found.root)}\n`);
      process.exit(2);
    }
    if (warns.length) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `cupertino-forge lint warnings (fix if possible):\n${format(warns, found.root)}` } }));
    }
    process.exit(0);
  }

  if (hook === 'stop') {
    if (input.stop_hook_active) process.exit(0); // never loop
    const found = findConfig(cwd);
    if (!found) process.exit(0);
    const files = changedFiles(found.root) ?? walk(found.root);
    const errors = files.flatMap(lintFile).filter((f) => f.sev === 'error');
    if (errors.length) {
      process.stderr.write(`cupertino-forge: ${errors.length} Apple design violation(s) remain in changed files. Fix them, then print the Apple Design Compliance report before finishing.\n\n${format(errors.slice(0, 40), found.root)}\n`);
      process.exit(2);
    }
    process.exit(0);
  }
  process.exit(0);
}

// ---------------- CLI ----------------
const root = path.resolve(opt('root') || process.cwd());
const targets = flag('all') ? walk(root) : args.filter((a) => !a.startsWith('--') && a !== opt('root'));
const findings = targets.flatMap((f) => lintFile(path.resolve(f)));
if (flag('json')) {
  process.stdout.write(JSON.stringify(findings, null, 2) + '\n');
} else if (findings.length) {
  process.stdout.write(format(findings, root) + '\n');
}
const errs = findings.filter((f) => f.sev === 'error').length;
const warns = findings.length - errs;
if (!flag('json')) {
  process.stdout.write(`\ncupertino-forge lint: ${errs} error(s), ${warns} warning(s) in ${targets.length} file(s)\n`);
}
process.exit(errs ? 1 : 0);

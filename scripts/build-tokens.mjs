#!/usr/bin/env node
// cupertino-forge: build platform token files from tokens/*.json
// Usage:
//   node build-tokens.mjs --out <dir> [--targets css,tailwind,ts,dart,rust,json,estimates] [--tokens <tokensDir>] [--accent "#0088FF"] [--write-estimates <file>]
// Outputs (only for requested targets):
//   cupertino.tokens.css            CSS custom properties, light, dark, elevated, increased contrast, ios and macos semantics
//   cupertino.theme.css             Tailwind v4 @theme mapping onto the CSS variables
//   cupertino.tokens.ts             Typed constants for JS (springs for motion, type scale, layout)
//   apple_tokens.dart               Flutter constants (colors, text styles, springs, radii, spacing)
//   apple_tokens.rs                 Rust constants for Tauri 2 (window radius, traffic lights, toolbar, sidebar, colors)
//   cupertino.tokens.resolved.json  Resolved token snapshot with provenance metadata
//   ESTIMATES.md                    Auto-generated ledger of estimated / community-alt / needs-verification tokens
// Never edit generated files by hand. Edit tokens/*.json and rebuild.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, [])
);
const tokensDir = path.resolve(args.tokens || path.join(here, '..', 'tokens'));
const outDir = path.resolve(args.out || process.cwd());
const targets = String(args.targets || 'css,tailwind,ts,dart').split(',');
const accentOverride = typeof args.accent === 'string' ? args.accent : null;

const read = (f) => JSON.parse(fs.readFileSync(path.join(tokensDir, f), 'utf8'));
const color = read('color.json');
const typo = read('typography.json');
const motion = read('motion.json');
const shape = read('shape.json');
const layout = read('layout.json');
const elev = read('elevation.json');
const mat = read('materials.json');

// ---------- helpers ----------
const parseColor = (v) => {
  const m = /^#([0-9A-Fa-f]{6})(?:@([\d.]+))?$/.exec(String(v).trim());
  if (!m) return null;
  const h = m[1];
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: m[2] === undefined ? 1 : Number(m[2]) };
};
const css = (v) => {
  const c = parseColor(v);
  if (!c) return v;
  return c.a === 1 ? `rgb(${c.r} ${c.g} ${c.b})` : `rgb(${c.r} ${c.g} ${c.b} / ${c.a})`;
};
const dart = (v) => {
  const c = parseColor(v);
  if (!c) throw new Error('bad color ' + v);
  const a = Math.round(c.a * 255).toString(16).padStart(2, '0');
  const hex = [c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, '0')).join('');
  return `Color(0x${(a + hex).toUpperCase()})`;
};
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
const camel = (s) => s.replace(/[-\s]+(.)/g, (_, c) => c.toUpperCase());
const entries = (o) => Object.entries(o).filter(([k]) => !k.startsWith('$'));

// Spring: duration d, bounce b -> stiffness, damping (mass 1). WWDC23 perceptual model.
const springPhysics = ({ duration: d, bounce: b }) => {
  const stiffness = Math.pow((2 * Math.PI) / d, 2);
  const damping = b >= 0 ? (4 * Math.PI * (1 - b)) / d : (4 * Math.PI) / (d * (1 + b));
  return { stiffness, damping };
};
// Sample a spring from 0 to 1 and emit a CSS linear() easing plus settle time.
const springToLinear = (sp) => {
  const { stiffness: k, damping: c } = springPhysics(sp);
  let x = 0, v = 0, t = 0;
  const dt = 1 / 600;
  const samples = [];
  let settled = 0;
  while (t < 3) {
    const a = -k * (x - 1) - c * v;
    v += a * dt; x += v * dt; t += dt;
    samples.push([t, x]);
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) { settled = t; break; }
  }
  if (!settled) settled = t;
  const N = 40;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const target = (settled * i) / N;
    const s = samples.reduce((best, cur) => (Math.abs(cur[0] - target) < Math.abs(best[0] - target) ? cur : best), samples[0]);
    pts.push(i === 0 ? 0 : i === N ? 1 : Number(s[1].toFixed(4)));
  }
  return { linear: `linear(${pts.join(', ')})`, ms: Math.round(settled * 1000) };
};

// ---------- semantic color sets ----------
// Each entry: name -> {light, dark, lightHC?, darkHC?, darkElevated?}
const sem = { shared: {}, ios: {}, macos: {} };
for (const [k, v] of entries(color.system)) sem.shared[k] = v;
for (const [k, v] of entries(color.grayIOS)) sem.ios[k] = v;
sem.macos.gray = color.grayMacOS.gray;
const labelKeys = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'];
labelKeys.forEach((k, i) => {
  sem.ios[`label${i ? '-' + (i + 1) : ''}`] = color.labelIOS[k];
  sem.macos[`label${i ? '-' + (i + 1) : ''}`] = color.labelMacOS[k];
});
sem.ios.placeholder = color.labelIOS.placeholder;
sem.macos.placeholder = color.labelMacOS.tertiary;
sem.ios.link = color.labelIOS.link;
sem.macos.link = { light: color.system.blue.light, dark: color.system.blue.dark };
['primary', 'secondary', 'tertiary', 'quaternary'].forEach((k, i) => {
  sem.ios[`label-glass${i ? '-' + (i + 1) : ''}`] = color.labelOnGlassIOS[k];
  sem.macos[`label-glass${i ? '-' + (i + 1) : ''}`] = color.labelVibrantMacOS[k];
  sem.ios[`label-vibrant${i ? '-' + (i + 1) : ''}`] = color.labelVibrantIOS[k];
  sem.macos[`label-vibrant${i ? '-' + (i + 1) : ''}`] = color.labelVibrantMacOS[k];
});
labelKeys.forEach((k, i) => {
  sem.ios[`fill${i ? '-' + (i + 1) : ''}`] = color.fillIOS[k];
  sem.macos[`fill${i ? '-' + (i + 1) : ''}`] = color.fillMacOS[k];
});
const bg = color.backgroundIOS;
sem.ios.bg = bg.primary; sem.ios['bg-2'] = bg.secondary; sem.ios['bg-3'] = bg.tertiary;
sem.ios['bg-grouped'] = bg.groupedPrimary; sem.ios['bg-grouped-2'] = bg.groupedSecondary; sem.ios['bg-grouped-3'] = bg.groupedTertiary;
const ms = color.macOSSurfaces;
sem.macos.bg = ms.windowBackground;
sem.macos['bg-2'] = ms.bg2;
sem.macos['bg-3'] = ms.bg3;
sem.macos['bg-grouped'] = ms.bgGrouped;
sem.macos['bg-grouped-2'] = ms.bgGrouped2;
sem.macos['bg-grouped-3'] = ms.bgGrouped3;
sem.ios.separator = color.separatorIOS.nonOpaque; sem.ios['separator-opaque'] = color.separatorIOS.opaque;
sem.macos.separator = ms.separator; sem.macos['separator-opaque'] = ms.separatorOpaque;
sem.macos['sidebar'] = ms.sidebarActive; sem.macos['sidebar-inactive'] = ms.sidebarInactive;
sem.ios['sidebar'] = bg.secondary; sem.ios['sidebar-inactive'] = bg.secondary;
sem.macos['field'] = ms.inputFieldIdle; sem.macos['field-border'] = ms.inputFieldBorder;
sem.ios['field'] = color.fillIOS.tertiary; sem.ios['field-border'] = color.iosFieldBorder;
const cf = color.macOSControlFills.contentArea;
sem.macos['control'] = cf.bordered; sem.macos['control-pressed'] = cf.borderedPressed; sem.macos['control-disabled'] = cf.borderedDisabled;
sem.ios['control'] = color.fillIOS.secondary; sem.ios['control-pressed'] = color.fillIOS.primary; sem.ios['control-disabled'] = color.fillIOS.quaternary;
sem.shared['scrim'] = color.dimming.sheetScrim;

const accent = accentOverride ? { light: accentOverride, dark: accentOverride } : color.system.blue;

// ---------- CSS ----------
function buildCSS() {
  const L = [];
  const block = (sel, fn) => { L.push(`${sel} {`); fn(); L.push('}'); };
  const put = (name, val) => L.push(`  --cf-${name}: ${val};`);
  const mode = (set, m, fallback = 'light') => entries(set).forEach(([k, v]) => {
    const val = v[m] ?? v[fallback];
    if (val !== undefined && typeof val === 'string') put(kebab(k), css(val));
  });

  L.push('/* Generated by cupertino-forge build-tokens.mjs. Do not edit. Edit tokens/*.json and rebuild. */');
  L.push('/* Platform semantics: set data-cf-platform="ios" or "macos" on <html>. Theme: data-theme="light"|"dark" or OS. Contrast: data-contrast="more" or OS. */');

  block(':root', () => {
    L.push('  color-scheme: light dark;');
    mode(sem.shared, 'light'); mode(sem.ios, 'light');
    put('accent', css(accent.light));
    put('accent-contrast', css(color.highContrastLabels.accentContrast));
    // typography (iOS Large default)
    const ios = typo.iosDynamicType.sizes.Large;
    put('type-scale', '1');
    put('font', typo.fontStacks.web); put('font-rounded', typo.fontStacks.webRounded);
    put('font-serif', typo.fontStacks.webSerif); put('font-mono', typo.fontStacks.webMono);
    put('font-bangla', typo.fontStacks.webBangla);
    for (const [k, s] of entries(ios)) {
      const n = kebab(k);
      put(`text-${n}-size`, `calc(${s.size}px * var(--cf-type-scale))`);
      put(`text-${n}-line`, `calc(${s.lineHeight}px * var(--cf-type-scale))`);
      put(`text-${n}-line-tight`, `calc(${s.lineHeightTight}px * var(--cf-type-scale))`);
      put(`text-${n}-line-loose`, `calc(${s.lineHeightLoose}px * var(--cf-type-scale))`);
      put(`text-${n}-weight`, s.weight); put(`text-${n}-weight-em`, s.emphasizedWeight);
      put(`text-${n}-tracking`, `${s.trackingEm}em`);
    }
    // spacing, radii, layout
    for (const [k, v] of entries(layout.spacing.names)) put(`space-${k}`, `${v}px`);
    const rI = shape.radiusIOS;
    for (const [k, v] of entries(rI)) if (typeof v === 'number') put(`radius-${kebab(k)}`, `${v}px`);
    if (rI.deviceDisplay && typeof rI.deviceDisplay.iPhone17Pro === 'number') {
      put('radius-device-display', `${rI.deviceDisplay.iPhone17Pro}px`);
    }
    const sheetFloat = typeof rI.sheetFloating === 'number' ? rI.sheetFloating : 38;
    put('radius-sheet-floating', `${sheetFloat}px`);
    put('radius-sheet', 'var(--cf-radius-sheet-floating)');
    put('radius-capsule', '9999px');
    put('hit', `${layout.hitTarget.ios}px`);
    put('margin', `${layout.ios.layoutMargins.compactWidth}px`);
    put('bar-height', `${layout.ios.navigationBar.height}px`);
    put('tabbar-height', `${layout.ios.tabBar.height}px`);
    const btn = layout.ios.button;
    for (const s of ['mini', 'small', 'medium', 'large', 'extraLarge']) put(`control-${kebab(s)}`, `${btn[s]}px`);
    // motion
    for (const [k, sp] of entries(motion.springs)) {
      const { linear, ms } = springToLinear(sp);
      put(`ease-${kebab(k)}`, linear); put(`dur-${kebab(k)}`, `${ms}ms`);
    }
    put('dur-fade', '200ms'); put('dur-color', '150ms');
    // elevation (light)
    put('shadow-none', 'none');
    for (const [k, v] of entries(elev.levels)) if (v && typeof v === 'object' && v.light) put(`shadow-${kebab(k)}`, v.light);
    // glass
    const g = mat.liquidGlass.tuned;
    put('glass-intensity', '0.5');
    put('glass-bg', g.regular.light.background); put('glass-filter', g.regular.light.backdrop); put('glass-shadow', g.regular.light.boxShadow);
    put('glass-clear-bg', g.clear.light.background); put('glass-clear-filter', g.clear.light.backdrop); put('glass-clear-shadow', g.clear.light.boxShadow);
    put('glass-large-bg', g.large.light.background); put('glass-large-filter', g.large.light.backdrop);
    put('glass-menu-bg', g.menuMacOS.light.background); put('glass-menu-filter', g.menuMacOS.light.backdrop); put('glass-menu-shadow', g.menuMacOS.light.boxShadow);
    put('glass-opaque', mat.liquidGlass.engine.fallbackOpaque.light);
    put('dim-clear-glass', css(color.dimming.clearGlassOverBrightContent));
    put('focus-ring', `0 0 0 1px color-mix(in srgb, var(--cf-accent) 15%, transparent), 0 0 0 3.5px color-mix(in srgb, var(--cf-accent) 25%, transparent)`);
  });

  const darkVars = () => {
    mode(sem.shared, 'dark'); mode(sem.ios, 'dark');
    put('accent', css(accent.dark));
    put('shadow-none', 'none');
    for (const [k, v] of entries(elev.levels)) {
      if (v && typeof v === 'object' && (v.dark || v.light)) put(`shadow-${kebab(k)}`, v.dark ?? v.light);
    }
    const g = mat.liquidGlass.tuned;
    put('glass-bg', g.regular.dark.background); put('glass-filter', g.regular.dark.backdrop); put('glass-shadow', g.regular.dark.boxShadow);
    put('glass-clear-bg', g.clear.dark.background); put('glass-clear-filter', g.clear.dark.backdrop); put('glass-clear-shadow', g.clear.dark.boxShadow);
    put('glass-large-bg', g.large.dark.background); put('glass-large-filter', g.large.dark.backdrop);
    put('glass-menu-bg', g.menuMacOS.dark.background); put('glass-menu-filter', g.menuMacOS.dark.backdrop); put('glass-menu-shadow', g.menuMacOS.dark.boxShadow);
    put('glass-opaque', mat.liquidGlass.engine.fallbackOpaque.dark);
  };
  block(':root[data-theme="dark"]', darkVars);
  L.push('@media (prefers-color-scheme: dark) {');
  block(':root:not([data-theme="light"])', darkVars);
  L.push('}');

  // Dark elevated: presented surfaces (sheets, popovers) must use elevated backgrounds in dark mode.
  const elevated = () => entries(color.backgroundIOS).forEach(([k, v]) => {
    const map = { primary: 'bg', secondary: 'bg-2', tertiary: 'bg-3', groupedPrimary: 'bg-grouped', groupedSecondary: 'bg-grouped-2', groupedTertiary: 'bg-grouped-3' };
    put(map[k], css(v.darkElevated));
  });
  block(':root[data-theme="dark"] [data-cf-elevated]', elevated);
  L.push('@media (prefers-color-scheme: dark) {');
  block(':root:not([data-theme="light"]) [data-cf-elevated]', elevated);
  L.push('}');

  // macOS semantics
  const macTypo = () => {
    for (const [k, s] of entries(typo.macosTextStyles.styles)) {
      const n = kebab(k);
      put(`text-${n}-size`, `${s.size}px`); put(`text-${n}-line`, `${s.lineHeight}px`);
      put(`text-${n}-line-tight`, `${s.lineHeightTight}px`); put(`text-${n}-line-loose`, `${s.lineHeightLoose}px`);
      put(`text-${n}-weight`, s.weight); put(`text-${n}-weight-em`, s.emphasizedWeight); put(`text-${n}-tracking`, `${s.trackingEm}em`);
    }
    const rM = shape.radiusMacOS;
    for (const [k, v] of entries(rM)) if (typeof v === 'number') put(`radius-${kebab(k)}`, `${v}px`);
    put('hit', `${layout.hitTarget.macos}px`);
    put('margin', `${layout.macos.contentPadding}px`);
    put('bar-height', `${layout.macos.toolbarHeight}px`);
    const cs = layout.macos.controlSizes;
    for (const s of ['mini', 'small', 'regular', 'large', 'extraLarge']) put(`control-${kebab(s)}`, `${cs[s]}px`);
    put('control-medium', `${cs.regular}px`);
  };
  block(':root[data-cf-platform="macos"]', () => { mode(sem.macos, 'light'); macTypo(); });
  block(':root[data-cf-platform="macos"][data-theme="dark"]', () => mode(sem.macos, 'dark'));
  L.push('@media (prefers-color-scheme: dark) {');
  block(':root[data-cf-platform="macos"]:not([data-theme="light"])', () => mode(sem.macos, 'dark'));
  L.push('}');

  // Increased contrast
  const hcl = color.highContrastLabels;
  const hc = (m) => () => {
    const modeKey = m === 'lightHC' ? 'light' : 'dark';
    entries(color.system).forEach(([k, v]) => put(kebab(k), css(v[m])));
    entries(color.grayIOS).forEach(([k, v]) => put(kebab(k), css(v[m])));
    put('accent', css(accentOverride || color.system.blue[m]));
    put('label-2', css(hcl.label2[modeKey]));
    put('label-3', css(hcl.label3[modeKey]));
    put('glass-filter', 'none');
    put('glass-shadow', `0 0 0 1px ${css(hcl.glassBorder[modeKey])}`);
    put('glass-bg', 'var(--cf-glass-opaque)');
  };
  block(':root[data-contrast="more"]', hc('lightHC'));
  block(':root[data-contrast="more"][data-theme="dark"]', hc('darkHC'));
  L.push('@media (prefers-contrast: more) {');
  block(':root:not([data-contrast="normal"]):not([data-theme="dark"])', hc('lightHC'));
  block(':root[data-theme="dark"]:not([data-contrast="normal"])', hc('darkHC'));
  L.push('}');
  L.push('@media (prefers-contrast: more) and (prefers-color-scheme: dark) {');
  block(':root:not([data-contrast="normal"]):not([data-theme="light"])', hc('darkHC'));
  L.push('}');

  // Reduce transparency
  const rt = () => {
    put('glass-bg', 'var(--cf-glass-opaque)'); put('glass-filter', 'none');
    put('glass-clear-bg', 'var(--cf-glass-opaque)'); put('glass-clear-filter', 'none');
    put('glass-large-bg', 'var(--cf-glass-opaque)'); put('glass-large-filter', 'none');
    put('glass-menu-bg', 'var(--cf-glass-opaque)'); put('glass-menu-filter', 'none');
  };
  L.push('@media (prefers-reduced-transparency: reduce) {');
  block(':root:not([data-transparency="normal"])', rt);
  L.push('}');
  block(':root[data-transparency="reduce"]', rt);

  // Reduce motion: collapse springs to fades
  L.push('@media (prefers-reduced-motion: reduce) {');
  block(':root', () => { for (const [k] of entries(motion.springs)) { put(`ease-${kebab(k)}`, 'linear(0, 1)'); put(`dur-${kebab(k)}`, '200ms'); } });
  L.push('}');

  // Non-Latin script protection (Indic matras & cursive Arabic break under negative SF tracking)
  L.push(':lang(bn), :lang(ar), :lang(he) { letter-spacing: 0 !important; }');
  L.push(':lang(bn) { font-family: var(--cf-font-bangla); }');

  // Dynamic Type: apps set --cf-type-scale (0.82 xSmall .. 1 Large .. 1.24 xxxLarge, AX up to 3.1) from a user setting.
  // lib/platform.ts reads the iOS text size via the -apple-system-body probe and writes it.

  return L.join('\n') + '\n';
}

// ---------- Tailwind v4 theme ----------
function buildTailwind() {
  const L = [];
  L.push('/* Generated by cupertino-forge. Tailwind v4 theme mapping onto --cf-* variables. Import AFTER tailwindcss and cupertino.tokens.css. */');
  L.push('@theme inline {');
  L.push('  --font-sans: var(--cf-font);');
  L.push('  --font-rounded: var(--cf-font-rounded);');
  L.push('  --font-serif: var(--cf-font-serif);');
  L.push('  --font-mono: var(--cf-font-mono);');
  const colorNames = new Set([...Object.keys(sem.shared), ...Object.keys(sem.ios), ...Object.keys(sem.macos)]);
  for (const n of colorNames) L.push(`  --color-${kebab(n)}: var(--cf-${kebab(n)});`);
  L.push('  --color-accent: var(--cf-accent);');
  L.push('  --color-accent-contrast: var(--cf-accent-contrast);');
  for (const [k] of entries(typo.iosDynamicType.sizes.Large)) {
    const n = kebab(k);
    L.push(`  --text-${n}: var(--cf-text-${n}-size);`);
    L.push(`  --text-${n}--line-height: var(--cf-text-${n}-line);`);
    L.push(`  --text-${n}--letter-spacing: var(--cf-text-${n}-tracking);`);
    L.push(`  --text-${n}--font-weight: var(--cf-text-${n}-weight);`);
  }
  const radii = new Set([...entries(shape.radiusIOS), ...entries(shape.radiusMacOS)].filter(([, v]) => typeof v === 'number').map(([k]) => kebab(k)));
  for (const r of radii) L.push(`  --radius-${r}: var(--cf-radius-${r});`);
  L.push('  --radius-device-display: var(--cf-radius-device-display);');
  L.push('  --radius-sheet-floating: var(--cf-radius-sheet-floating);');
  L.push('  --radius-sheet: var(--cf-radius-sheet);');
  L.push('  --radius-capsule: 9999px;');
  for (const [k] of entries(layout.spacing.names)) L.push(`  --spacing-${k}: var(--cf-space-${k});`);
  L.push('  --shadow-none: none;');
  for (const [k, v] of entries(elev.levels)) if (v && typeof v === 'object' && v.light) L.push(`  --shadow-${kebab(k)}: var(--cf-shadow-${kebab(k)});`);
  for (const [k] of entries(motion.springs)) L.push(`  --ease-${kebab(k)}: var(--cf-ease-${kebab(k)});`);
  L.push('}');
  L.push('');
  L.push('/* Utilities that Tailwind cannot express with theme keys */');
  L.push('@utility squircle { corner-shape: squircle; }');
  L.push('@utility glass { background: var(--cf-glass-bg); backdrop-filter: var(--cf-glass-filter); -webkit-backdrop-filter: var(--cf-glass-filter); box-shadow: var(--cf-glass-shadow); }');
  L.push('@utility glass-clear { background: var(--cf-glass-clear-bg); backdrop-filter: var(--cf-glass-clear-filter); -webkit-backdrop-filter: var(--cf-glass-clear-filter); box-shadow: var(--cf-glass-clear-shadow); }');
  L.push('@utility glass-large { background: var(--cf-glass-large-bg); backdrop-filter: var(--cf-glass-large-filter); -webkit-backdrop-filter: var(--cf-glass-large-filter); box-shadow: var(--cf-shadow-popover); }');
  L.push('@utility glass-menu { background: var(--cf-glass-menu-bg); backdrop-filter: var(--cf-glass-menu-filter); -webkit-backdrop-filter: var(--cf-glass-menu-filter); box-shadow: var(--cf-glass-menu-shadow); }');
  L.push('@utility focus-ring { outline: none; box-shadow: var(--cf-focus-ring); }');
  L.push('@utility emphasized { font-weight: 600; }');
  L.push('@utility tabular { font-variant-numeric: tabular-nums; }');
  L.push('@utility hairline-b { box-shadow: inset 0 -0.5px 0 var(--cf-separator); }');
  L.push('@utility hairline-t { box-shadow: inset 0 0.5px 0 var(--cf-separator); }');
  return L.join('\n') + '\n';
}

// ---------- TS ----------
function buildTS() {
  const springs = Object.fromEntries(entries(motion.springs).map(([k, s]) => {
    const p = springPhysics(s);
    return [k, { duration: s.duration, bounce: s.bounce, stiffness: +p.stiffness.toFixed(3), damping: +p.damping.toFixed(3), mass: 1 }];
  }));
  const out = {
    springs,
    typeIOS: typo.iosDynamicType.sizes,
    typeMacOS: typo.macosTextStyles.styles,
    spacing: layout.spacing.names,
    layout: { ios: layout.ios, macos: layout.macos, breakpoints: layout.breakpoints, hit: layout.hitTarget },
    radiusIOS: Object.fromEntries(entries(shape.radiusIOS)),
    radiusMacOS: Object.fromEntries(entries(shape.radiusMacOS)),
    press: motion.press,
    transitions: motion.transitions,
  };
  return `// Generated by cupertino-forge build-tokens.mjs. Do not edit.\n// Motion usage (motion / framer-motion): transition={{ type: 'spring', visualDuration: springs.snappy.duration, bounce: springs.snappy.bounce }}\nexport const cf = ${JSON.stringify(out, null, 2)} as const;\nexport const springs = cf.springs;\nexport type SpringName = keyof typeof cf.springs;\nexport const spring = (name: SpringName) => ({ type: 'spring' as const, visualDuration: cf.springs[name].duration, bounce: cf.springs[name].bounce });\n`;
}

// ---------- Dart ----------
function buildDart() {
  const L = [];
  L.push('// Generated by cupertino-forge build-tokens.mjs. Do not edit. Edit tokens/*.json and rebuild.');
  L.push("import 'package:flutter/widgets.dart';");
  L.push("import 'package:flutter/physics.dart';");
  L.push('');
  L.push('/// Resolved color pair. Use AppleColors.of(context) to get the right brightness.');
  L.push('class CfColor { final Color light; final Color dark; final Color? lightHC; final Color? darkHC; final Color? darkElevated;');
  L.push('  const CfColor(this.light, this.dark, {this.lightHC, this.darkHC, this.darkElevated});');
  L.push('  Color resolve(Brightness b, {bool highContrast = false, bool elevated = false}) {');
  L.push('    if (b == Brightness.dark) { if (highContrast && darkHC != null) return darkHC!; if (elevated && darkElevated != null) return darkElevated!; return dark; }');
  L.push('    if (highContrast && lightHC != null) return lightHC!; return light; } }');
  L.push('');
  const emitSet = (cls, set) => {
    L.push(`abstract final class ${cls} {`);
    for (const [k, v] of entries(set)) {
      if (typeof v.light !== 'string') continue;
      const opt = ['lightHC', 'darkHC', 'darkElevated'].filter((m) => v[m]).map((m) => `${m}: ${dart(v[m])}`).join(', ');
      L.push(`  static const ${camel(k.replace(/-(\d)/g, '$1'))} = CfColor(${dart(v.light)}, ${dart(v.dark)}${opt ? ', ' + opt : ''});`);
    }
    L.push('}');
  };
  emitSet('AppleSystemColors', sem.shared);
  // add darkElevated for iOS backgrounds
  const iosSet = { ...sem.ios };
  iosSet.bg = { ...bg.primary }; iosSet['bg-2'] = { ...bg.secondary }; iosSet['bg-3'] = { ...bg.tertiary };
  iosSet['bg-grouped'] = { ...bg.groupedPrimary }; iosSet['bg-grouped-2'] = { ...bg.groupedSecondary }; iosSet['bg-grouped-3'] = { ...bg.groupedTertiary };
  emitSet('AppleIOSColors', iosSet);
  emitSet('AppleMacOSColors', sem.macos);
  L.push('');
  L.push('abstract final class AppleSprings {');
  for (const [k, s] of entries(motion.springs)) {
    const p = springPhysics(s);
    L.push(`  /// duration ${s.duration}s bounce ${s.bounce}. ${s.usage}`);
    L.push(`  static const ${camel(k)} = SpringDescription(mass: 1, stiffness: ${p.stiffness.toFixed(3)}, damping: ${p.damping.toFixed(3)});`);
  }
  L.push('}');
  L.push('');
  const tsEmit = (cls, styles, family) => {
    L.push(`abstract final class ${cls} {`);
    L.push(`  static const String? _family = ${family};`);
    for (const [k, s] of entries(styles)) {
      L.push(`  static const ${camel(k)} = TextStyle(fontFamily: _family, fontSize: ${s.size}, height: ${(s.lineHeight / s.size).toFixed(4)}, letterSpacing: ${s.trackingPx}, fontWeight: FontWeight.w${s.weight}, leadingDistribution: TextLeadingDistribution.even);`);
      L.push(`  static const ${camel(k)}Emphasized = TextStyle(fontFamily: _family, fontSize: ${s.size}, height: ${(s.lineHeight / s.size).toFixed(4)}, letterSpacing: ${s.trackingPx}, fontWeight: FontWeight.w${s.emphasizedWeight}, leadingDistribution: TextLeadingDistribution.even);`);
    }
    L.push('}');
  };
  L.push('// On iOS and macOS leave fontFamily null so CupertinoTheme uses the real SF system font. On Android, Windows, Linux pass Inter via AppleTypography.withFamily.');
  tsEmit('AppleTypeIOS', typo.iosDynamicType.sizes.Large, 'null');
  tsEmit('AppleTypeMacOS', typo.macosTextStyles.styles, 'null');
  L.push('');
  L.push('abstract final class AppleSpacing {');
  for (const [k, v] of entries(layout.spacing.names)) L.push(`  static const double ${k} = ${v};`);
  L.push('}');
  L.push('abstract final class AppleRadiusIOS {');
  for (const [k, v] of entries(shape.radiusIOS)) if (typeof v === 'number') L.push(`  static const double ${camel(k)} = ${v};`);
  if (shape.radiusIOS.deviceDisplay && typeof shape.radiusIOS.deviceDisplay.iPhone17Pro === 'number') {
    L.push(`  static const double deviceDisplay = ${shape.radiusIOS.deviceDisplay.iPhone17Pro};`);
  }
  L.push(`  static const double sheetFloating = ${typeof shape.radiusIOS.sheetFloating === 'number' ? shape.radiusIOS.sheetFloating : 38};`);
  L.push('}');
  L.push('abstract final class AppleRadiusMacOS {');
  for (const [k, v] of entries(shape.radiusMacOS)) if (typeof v === 'number') L.push(`  static const double ${camel(k)} = ${v};`);
  L.push('}');
  L.push('abstract final class AppleLayout {');
  L.push(`  static const double hitIOS = ${layout.hitTarget.ios};`);
  L.push(`  static const double hitMacOS = ${layout.hitTarget.macos};`);
  L.push(`  static const double marginCompact = ${layout.ios.layoutMargins.compactWidth};`);
  L.push(`  static const double marginRegular = ${layout.ios.layoutMargins.regularWidth};`);
  L.push(`  static const double navBarHeight = ${layout.ios.navigationBar.height};`);
  L.push(`  static const double largeTitleExtra = ${layout.ios.navigationBar.largeTitleExtra};`);
  L.push(`  static const double tabBarHeight = ${layout.ios.tabBar.height};`);
  L.push(`  static const double tabBarSideInset = ${layout.ios.tabBar.sideInset};`);
  L.push(`  static const double listRowMinHeight = ${layout.ios.listRow.minHeight};`);
  L.push(`  static const double toggleWidth = ${layout.ios.toggle.width};`);
  L.push(`  static const double toggleHeight = ${layout.ios.toggle.height};`);
  L.push(`  static const double buttonLarge = ${layout.ios.button.large};`);
  L.push(`  static const double buttonMedium = ${layout.ios.button.medium};`);
  L.push(`  static const double buttonSmall = ${layout.ios.button.small};`);
  L.push(`  static const double macToolbarHeight = ${layout.macos.toolbarHeight};`);
  L.push(`  static const double macControlRegular = ${layout.macos.controlSizes.regular};`);
  L.push(`  static const double macSidebarWidth = ${layout.macos.sidebar.defaultWidth};`);
  L.push(`  static const double breakpointRegular = ${layout.breakpoints.regular};`);
  L.push(`  static const double breakpointDesktop = ${layout.breakpoints.desktop};`);
  L.push('}');
  return L.join('\n') + '\n';
}

// ---------- Rust (Tauri 2) ----------
function buildRust() {
  const mac = layout.macos;
  const rM = shape.radiusMacOS;
  const lines = [
    '// Generated by cupertino-forge build-tokens.mjs. Do not edit. Edit tokens/*.json and rebuild.',
    '#![allow(dead_code)]',
    '',
    `pub const WINDOW_CORNER_RADIUS: f64 = ${Number(rM.window).toFixed(1)};`,
    `pub const WINDOW_MIN_WIDTH: f64 = ${Number(mac.windowMinimum.width).toFixed(1)};`,
    `pub const WINDOW_MIN_HEIGHT: f64 = ${Number(mac.windowMinimum.height).toFixed(1)};`,
    `pub const TITLEBAR_HEIGHT: f64 = ${Number(mac.titlebarHeight).toFixed(1)};`,
    `pub const TOOLBAR_HEIGHT: f64 = ${Number(mac.toolbarHeight).toFixed(1)};`,
    `pub const TOOLBAR_HEIGHT_COMPACT: f64 = ${Number(mac.toolbarHeightCompact).toFixed(1)};`,
    `pub const TRAFFIC_LIGHT_DIAMETER: f64 = ${Number(mac.trafficLights.diameter).toFixed(1)};`,
    `pub const TRAFFIC_LIGHT_GAP: f64 = ${Number(mac.trafficLights.gap).toFixed(1)};`,
    `pub const TRAFFIC_LIGHT_X: f64 = ${Number(mac.trafficLights.leadingInset).toFixed(1)};`,
    `pub const TRAFFIC_LIGHT_Y: f64 = ${Number(mac.trafficLights.centerYFromTop).toFixed(1)};`,
    `pub const SIDEBAR_MIN_WIDTH: f64 = ${Number(mac.sidebar.minWidth).toFixed(1)};`,
    `pub const SIDEBAR_DEFAULT_WIDTH: f64 = ${Number(mac.sidebar.defaultWidth).toFixed(1)};`,
    `pub const SIDEBAR_MAX_WIDTH: f64 = ${Number(mac.sidebar.maxWidth).toFixed(1)};`,
    `pub const HIT_TARGET_MACOS: f64 = ${Number(layout.hitTarget.macos).toFixed(1)};`,
    `pub const ACCENT_LIGHT_HEX: &str = "${accent.light}";`,
    `pub const ACCENT_DARK_HEX: &str = "${accent.dark}";`,
    `pub const WINDOW_BG_LIGHT_HEX: &str = "${ms.windowBackground.light}";`,
    `pub const WINDOW_BG_DARK_HEX: &str = "${ms.windowBackground.dark}";`,
  ];
  return lines.join('\n') + '\n';
}

// ---------- Resolved JSON ----------
function buildJSON() {
  const springs = Object.fromEntries(entries(motion.springs).map(([k, s]) => {
    const p = springPhysics(s);
    return [k, { duration: s.duration, bounce: s.bounce, stiffness: +p.stiffness.toFixed(3), damping: +p.damping.toFixed(3), mass: 1, $class: s.$class || 'estimated' }];
  }));
  return JSON.stringify({
    $meta: { generatedBy: 'cupertino-forge/scripts/build-tokens.mjs', accent },
    colors: { system: color.system, backgroundIOS: color.backgroundIOS, macOSSurfaces: color.macOSSurfaces, focusRing: color.focusRing, dimming: color.dimming },
    typography: { iosLarge: typo.iosDynamicType.sizes.Large, macos: typo.macosTextStyles.styles, nonLatin: typo.nonLatin },
    layout: { spacing: layout.spacing, hitTarget: layout.hitTarget, ios: layout.ios, macos: layout.macos, breakpoints: layout.breakpoints },
    shape: { radiusIOS: shape.radiusIOS, radiusMacOS: shape.radiusMacOS, concentric: shape.concentric },
    materials: { officialSpec: mat.liquidGlass.officialSpec, intensityCurve: mat.liquidGlass.intensityCurve, perfBudget: mat.liquidGlass.perfBudget, fallbackOpaque: mat.liquidGlass.engine.fallbackOpaque },
    motion: { springs, scroll: motion.scroll, transitions: motion.transitions },
  }, null, 2) + '\n';
}

// ---------- Auto-generated ESTIMATES.md ----------
function buildEstimatesMd() {
  const tokenFiles = fs.readdirSync(tokensDir).filter((f) => f.endsWith('.json') && !f.startsWith('apple-')).sort();
  const estRows = [];
  const conflictRows = [];
  const summarize = (v) => {
    if (v === null || v === undefined) return 'null';
    if (typeof v !== 'object') return String(v);
    const ks = Object.keys(v).filter((k) => !k.startsWith('$'));
    return `{ ${ks.slice(0, 4).map((k) => `${k}: ${typeof v[k] === 'object' ? '[...]' : v[k]}`).join(', ')}${ks.length > 4 ? ', ...' : ''} }`;
  };
  const scan = (node, file, pathStr) => {
    if (!node || typeof node !== 'object') return;
    if (node.$alt && typeof node.$alt === 'object') {
      conflictRows.push({ file, path: `${pathStr}.$alt`, value: summarize(node.$alt), cls: node.$alt.$class || 'inferred/community', source: node.$alt.$source || '', url: node.$alt.$url || '' });
    }
    if (node.$kitConflict && typeof node.$kitConflict === 'object') {
      conflictRows.push({ file, path: `${pathStr}.$kitConflict`, value: summarize(node.$kitConflict), cls: node.$kitConflict.$status || 'needs-device-verification', source: node.$kitConflict.$source || '', url: node.$kitConflict.$url || '' });
    }
    const cls = String(node.$class || '').toLowerCase();
    const src = String(node.$source || '').toLowerCase();
    if (cls === 'estimated' || (!cls && src.includes('estimate'))) {
      estRows.push({ file, path: pathStr || '(root)', value: summarize(node), cls: node.$class || 'estimated', source: node.$source || 'estimated', url: node.$url || '' });
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && !Array.isArray(v)) scan(v, file, pathStr ? `${pathStr}.${k}` : k);
    }
  };
  for (const f of tokenFiles) scan(read(f), f, '');

  const L = [
    '# Token Estimates, Community Alternates & Pending Verification',
    '',
    '<!-- Generated automatically by `node scripts/build-tokens.mjs --write-estimates tokens/ESTIMATES.md`. Do not hand-edit. -->',
    '',
    'These token entries carry `$class: "estimated"` (not published numerically by Apple HIG or Sketch token exports), `$class: "inferred/community"` (community SPI benchmarks kept out of primary official/kit tokens per merge Rule 1), or `$status: "needs-device-verification"`. List relevant items in the Compliance Report (`Values marked estimate`).',
    '',
    `## 1. Estimated Tokens (${estRows.length} groups/entries)`,
    '',
    '| Token File | Path | Sample Value | Class | Source Note |',
    '|---|---|---|---|---|',
    ...estRows.map((r) => `| \`${r.file}\` | \`${r.path}\` | \`${r.value.replace(/\|/g, '\\|')}\` | \`${r.cls}\` | ${String(r.source).replace(/\|/g, '\\|')} |`),
    '',
    `## 2. Source Conflicts & Community Alternates (${conflictRows.length} entries)`,
    '',
    '| Token File | Path | Alternate / Conflict Values | Status / Class | Source |',
    '|---|---|---|---|---|',
    ...conflictRows.map((r) => `| \`${r.file}\` | \`${r.path}\` | \`${r.value.replace(/\|/g, '\\|')}\` | \`${r.cls}\` | ${String(r.source).replace(/\|/g, '\\|')} |`),
    '',
  ];
  return L.join('\n');
}

fs.mkdirSync(outDir, { recursive: true });
const written = [];
const write = (name, content) => { fs.writeFileSync(path.join(outDir, name), content); written.push(name); };
if (targets.includes('css')) write('cupertino.tokens.css', buildCSS());
if (targets.includes('tailwind')) write('cupertino.theme.css', buildTailwind());
if (targets.includes('ts')) write('cupertino.tokens.ts', buildTS());
if (targets.includes('dart')) write('apple_tokens.dart', buildDart());
if (targets.includes('rust')) write('apple_tokens.rs', buildRust());
if (targets.includes('json')) write('cupertino.tokens.resolved.json', buildJSON());
if (targets.includes('estimates')) write('ESTIMATES.md', buildEstimatesMd());
if (typeof args['write-estimates'] === 'string') {
  const estOut = path.resolve(args['write-estimates']);
  fs.writeFileSync(estOut, buildEstimatesMd());
  written.push(path.relative(outDir, estOut) || estOut);
}
console.log(`cupertino-forge: wrote ${written.join(', ')} to ${outDir}`);

#!/usr/bin/env node
// WCAG 2.1/2.2 & Apple HIG Accessibility contrast checks for cupertino-forge tokens and accents.
// Official Apple HIG Accessibility thresholds:
//   - Small regular text (<= 17 pt): min 4.5:1
//   - Large text (>= 18 pt) OR Bold (all sizes) OR non-text UI glyphs: min 3.0:1
// Usage:
//   node contrast-check.mjs
//   node contrast-check.mjs --accent #0088FF [--accent-dark #0091FF] [--size 17] [--bold] [--strict-text]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const color = JSON.parse(fs.readFileSync(path.join(here, '..', 'tokens', 'color.json'), 'utf8'));

const parse = (v) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})(?:@([\d.]+))?$/i.exec(String(v || '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: m[2] !== undefined ? Number(m[2]) : 1 };
};
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const lum = ({ r, g, b }) => {
  const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (fg, bg) => {
  const c = over(fg, bg);
  const [x, y] = [lum(c), lum(bg)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const opt = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 && i + 1 < process.argv.length && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : null;
};

const bgs = { light: ['#FFFFFF', '#F2F2F7'], dark: ['#000000', '#1C1C1E', '#2C2C2E'] };
const rows = [];
const check = (name, light, dark, min, blocking = true) => {
  const fgL = parse(light);
  const fgD = parse(dark);
  if (!fgL || !fgD) {
    console.error(`Invalid hex color supplied for "${name}": light="${light}", dark="${dark}"`);
    process.exit(1);
  }
  for (const [mode, fg] of [['light', fgL], ['dark', fgD]]) {
    for (const bg of bgs[mode]) {
      const r = ratio(fg, parse(bg));
      rows.push({ name, mode, bg, ratio: +r.toFixed(2), min, pass: r >= min, blocking });
    }
  }
};

const accentArg = opt('accent');
const accentDarkArg = opt('accent-dark');
const sizeArg = Number(opt('size') || 17);
const isBold = process.argv.includes('--bold');
const strictText = process.argv.includes('--strict-text');
const textMin = sizeArg >= 18 || isBold ? 3.0 : 4.5;

if (accentArg) {
  const parsed = parse(accentArg);
  if (!parsed) {
    console.error(`Invalid --accent color "${accentArg}". Expected #RGB, #RRGGBB, or #RRGGBB@alpha.`);
    process.exit(1);
  }
  // Auto-pair known Apple system colors with their official Dark variant when --accent-dark is omitted
  const norm = '#' + (accentArg.replace('#', '').split('@')[0].length === 3
    ? accentArg.replace('#', '').split('@')[0].split('').map((c) => c + c).join('')
    : accentArg.replace('#', '').split('@')[0]).toUpperCase();
  const sysMatch = Object.values(color.system).find((v) => v && typeof v === 'object' && v.light?.toUpperCase() === norm);
  const darkHex = accentDarkArg || (sysMatch ? sysMatch.dark : accentArg);

  check(`accent small/reg text (${sizeArg}pt${isBold ? ' bold' : ''})`, accentArg, darkHex, textMin, strictText || isBold || sizeArg >= 18);
  check('accent glyph / large (>=18pt)', accentArg, darkHex, 3.0, true);
} else {
  check('label-2 (iOS)', color.labelIOS.secondary.light, color.labelIOS.secondary.dark, 4.5, true);
  for (const [k, v] of Object.entries(color.system).filter(([k]) => !k.startsWith('$'))) check(`${k} glyph`, v.light, v.dark, 3.0, true);
}

for (const r of rows) {
  const tag = r.pass ? 'PASS' : (r.blocking ? 'FAIL' : 'WARN');
  console.log(`${tag.padEnd(5)} ${r.name.padEnd(32)} ${r.mode.padEnd(5)} on ${r.bg}  ${r.ratio}:1 (min ${r.min}:1)`);
}
const blockingFails = rows.filter((r) => !r.pass && r.blocking).length;
const advisoryWarns = rows.filter((r) => !r.pass && !r.blocking).length;
if (advisoryWarns) {
  console.log(`\n${advisoryWarns} small-text advisory warning(s): standard Apple system colors require bold/large (>=18pt), filled white-on-accent capsule, or lightHC/darkHC variant for <=17pt regular text.`);
}
console.log(`${blockingFails} blocking contrast failure(s). System fills/glyphs require >=3:1; <=17pt normal body text requires >=4.5:1 (HIG Accessibility).`);
process.exit(accentArg && blockingFails ? 1 : 0);

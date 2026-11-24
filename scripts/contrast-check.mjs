#!/usr/bin/env node
// WCAG contrast checks for cupertino-forge tokens and a brand accent.
// Usage: node contrast-check.mjs                 check label and system colors against backgrounds
//        node contrast-check.mjs --accent #5B3DF5 check a brand accent (text 4.5:1, glyph 3:1) in light and dark
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const color = JSON.parse(fs.readFileSync(path.join(here, '..', 'tokens', 'color.json'), 'utf8'));

const parse = (v) => { const m = /^#([0-9a-f]{6})(?:@([\d.]+))?$/i.exec(v); const h = m[1]; return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: m[2] ? +m[2] : 1 }; };
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const lum = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (fg, bg) => { const c = over(fg, bg); const [x, y] = [lum(c), lum(bg)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const bgs = { light: ['#FFFFFF', '#F2F2F7'], dark: ['#000000', '#1C1C1E', '#2C2C2E'] };
const rows = [];
const check = (name, light, dark, min) => {
  for (const [mode, val] of [['light', light], ['dark', dark]]) for (const bg of bgs[mode]) {
    const r = ratio(parse(val), parse(bg));
    rows.push({ name, mode, bg, ratio: +r.toFixed(2), min, pass: r >= min });
  }
};

const accentArg = process.argv.includes('--accent') ? process.argv[process.argv.indexOf('--accent') + 1] : null;
if (accentArg) {
  check('accent as text', accentArg, accentArg, 4.5);
  check('accent as glyph', accentArg, accentArg, 3);
} else {
  check('label-2 (iOS)', color.labelIOS.secondary.light, color.labelIOS.secondary.dark, 4.5);
  for (const [k, v] of Object.entries(color.system).filter(([k]) => !k.startsWith('$'))) check(`${k} glyph`, v.light, v.dark, 3);
}
for (const r of rows) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name.padEnd(18)} ${r.mode.padEnd(5)} on ${r.bg}  ${r.ratio}:1 (min ${r.min})`);
const fails = rows.filter((r) => !r.pass).length;
console.log(`\n${fails} failing combination(s). System colors like yellow and mint are not meant for text on white; use them for fills and glyphs with labels.`);
process.exit(accentArg && fails ? 1 : 0);

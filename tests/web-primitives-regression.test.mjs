import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webAssets = path.join(root, 'skills', 'apple-web', 'assets');
const compDir = path.join(webAssets, 'components', 'apple');
const libDir = path.join(webAssets, 'lib');
const cssPath = path.join(webAssets, 'styles', 'cupertino.base.css');

function readComp(name) {
  return fs.readFileSync(path.join(compDir, name), 'utf8');
}

test('zero arbitrary [Npx] Tailwind classes remain in Web apple components', () => {
  const files = fs.readdirSync(compDir).filter((f) => f.endsWith('.tsx')).sort();
  const hits = [];
  for (const f of files) {
    const src = readComp(f);
    const lines = src.split(/\r?\n/);
    lines.forEach((line, idx) => {
      const m = line.match(/\b[\w:-]*\[\d+(?:\.\d+)?px\]/g);
      if (m) hits.push(`${f}:${idx + 1}: ${m.join(', ')}`);
    });
  }
  assert.deepEqual(hits, [], `Unexpected arbitrary [Npx] classes found:\n${hits.join('\n')}`);
});

test('all 10+ confirmed Web adapter fixes are present in source primitives and CSS', () => {
  const baseCss = fs.readFileSync(cssPath, 'utf8');
  const squircleTs = fs.readFileSync(path.join(libDir, 'squircle.ts'), 'utf8');
  const themeScriptTs = fs.readFileSync(path.join(libDir, 'theme-script.ts'), 'utf8');

  const rootTsx = readComp('root.tsx');
  const squircleTsx = readComp('squircle.tsx');
  const glassTsx = readComp('glass.tsx');
  const buttonTsx = readComp('button.tsx');
  const sheetTsx = readComp('sheet.tsx');
  const tabBarTsx = readComp('tab-bar.tsx');
  const controlsTsx = readComp('controls.tsx');
  const alertTsx = readComp('alert.tsx');
  const navTsx = readComp('nav.tsx');
  const listTsx = readComp('list.tsx');
  const macTsx = readComp('mac.tsx');
  const menuTsx = readComp('menu.tsx');
  const popoverTsx = readComp('popover.tsx');
  const feedbackTsx = readComp('feedback.tsx');

  // 1. Squircle mask + shadow preservation & Glass asChild + rect fallback
  assert.match(squircleTs, /export function squircleMaskDataUrl\(/);
  assert.doesNotMatch(squircleTsx, /clipPath:/);
  assert.match(squircleTsx, /maskImage:/);
  assert.match(squircleTsx, /SHADOW_TOKEN_RE/);
  assert.match(glassTsx, /asChild:\s*_asChild/);
  assert.match(glassTsx, /squircleMaskDataUrl/);
  assert.match(glassTsx, /SHADOW_VAR_BY_VARIANT/);

  // 2 & 3. CupertinoRoot transparency/contrast settings, MotionConfig, TooltipProvider, matchMedia (no resize), prop sync
  assert.match(rootTsx, /<MotionConfig reducedMotion=/);
  assert.match(rootTsx, /<TooltipPrimitive\.Provider delayDuration=\{1000\}>/);
  assert.match(rootTsx, /setTransparency/);
  assert.match(rootTsx, /setContrast/);
  assert.match(rootTsx, /root\.dataset\.transparency =/);
  assert.match(rootTsx, /root\.dataset\.contrast =/);
  assert.doesNotMatch(rootTsx, /addEventListener\(['"]resize['"]/);
  assert.match(rootTsx, /useEffect\(\(\) => \{ setAppState\(appearance\); \}, \[appearance\]\)/);

  // 4. Sheet GPU transform-only y, no height animation, modal prop, scroll-top handoff
  assert.doesNotMatch(sheetTsx, /animate=\{\{[^}]*\bheight:/);
  assert.match(sheetTsx, /modal\s*=\s*true/);
  assert.match(sheetTsx, /handleBodyPointerDown/);
  assert.match(sheetTsx, /rounded-sheet-floating/);
  assert.match(sheetTsx, /rounded-t-device-display/);

  // 5. TabBar & SegmentedControl arrow keys + roving tabIndex + inner glass capsule + no layout wrapper on Glass lens
  assert.doesNotMatch(tabBarTsx, /<motion\.div[^>]*layout[^>]*>[\s\S]*?<Glass lens/);
  assert.match(tabBarTsx, /cf-glass-capsule-active/);
  assert.match(tabBarTsx, /tabIndex=\{active \? 0 : -1\}/);
  assert.match(tabBarTsx, /ArrowRight/);
  assert.match(controlsTsx, /tabIndex=\{active \? 0 : -1\}/);
  assert.match(controlsTsx, /ArrowRight/);

  // 6. Toggle & Slider glass knob mutually exclusive with bg-white
  assert.match(controlsTsx, /pressed && !mac \? 'cf-glass' : 'bg-white'/);
  assert.match(controlsTsx, /drag && !mac \? 'cf-glass' : 'bg-white'/);

  // 7. Pre-hydration FOUC script is valid JS
  const scriptMatch = themeScriptTs.match(/export const CF_THEME_INIT_SCRIPT = `([\s\S]*?)`;/);
  assert.ok(scriptMatch, 'CF_THEME_INIT_SCRIPT must exist in lib/theme-script.ts');
  assert.doesNotThrow(() => new Function(scriptMatch[1]));

  // 8. Button glass variant classes
  assert.doesNotMatch(buttonTsx, /!isGlass && variantCls\[variant\]/);
  assert.match(buttonTsx, /\n\s*variantCls\[variant\],/);

  // 9. Alert Enter guard, NavBar single h1, ListSection no nested <section> + logical separator, MacWindow inactive shadow, Menu trailing sep, Popover single provider, Feedback single keyframes
  assert.match(alertTsx, /!\(e\.target instanceof HTMLButtonElement\)/);
  assert.match(navTsx, /large \? \(\s*<motion\.span aria-hidden/);
  assert.match(listTsx, /as="div"/);
  assert.match(listTsx, /insetInlineStart:/);
  assert.match(macTsx, /active \? 'shadow-window-active' : 'shadow-window-inactive'/);
  assert.match(menuTsx, /last:hidden/);
  assert.doesNotMatch(popoverTsx, /T\.Provider/);
  assert.doesNotMatch(feedbackTsx, /@keyframes cf-spin/);

  // 10. Base CSS conditional translateZ(0), Inter non-Latin guard, dark sheen intensity, cf-spin, cf-glass-capsule-active
  const glassRule = baseCss.match(/\.cf-glass\s*\{([^}]+)\}/);
  assert.ok(glassRule);
  assert.doesNotMatch(glassRule[1], /translateZ\(0\)/);
  assert.match(baseCss, /html\[data-cf-font="inter"\]:not\(:lang\(bn\)\):not\(:lang\(ar\)\):not\(:lang\(he\)\) body/);
  assert.match(baseCss, /:root\[data-theme="dark"\] \.cf-glass::before \{[^}]*--cf-glass-intensity/);
  assert.match(baseCss, /@keyframes cf-spin/);
  assert.match(baseCss, /\.cf-glass-capsule-active/);
});

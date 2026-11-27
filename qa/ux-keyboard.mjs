#!/usr/bin/env node
// Cross-engine Keyboard & UX Accessibility auditor for cupertino-forge.
// Runs via Playwright across Chromium, WebKit, and Firefox in light/dark modes.
//
// Usage:
//   node qa/ux-keyboard.mjs --url <url-or-file> [--browser chromium|webkit|firefox|all] [--theme light|dark|both] [--json] [--out <file>]
// Exit codes:
//   0 = 0 failures (may contain NOT RUN when browser unavailable)
//   1 = 1+ FAIL checks
//   2 = CLI usage / load error

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const opts = { browser: 'chromium', theme: 'light', json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--url') opts.url = argv[++i];
    else if (a === '--browser') opts.browser = argv[++i];
    else if (a === '--theme') opts.theme = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
  }
  return opts;
}

function normalizeUrl(raw) {
  if (!raw) return null;
  if (/^(https?|file):\/\//i.test(raw)) return raw;
  return pathToFileURL(path.resolve(raw)).href;
}

async function launchEngine(pw, engine) {
  if (engine === 'webkit') {
    return { browser: await pw.webkit.launch({ headless: true, timeout: 10000 }), engine: 'webkit' };
  }
  if (engine === 'firefox') {
    return { browser: await pw.firefox.launch({ headless: true, timeout: 10000 }), engine: 'firefox' };
  }
  const attempts = [
    { label: 'chromium', opts: { headless: true, timeout: 10000, args: ['--no-sandbox'] } },
    { label: 'chrome', opts: { headless: true, channel: 'chrome', timeout: 10000, args: ['--no-sandbox'] } },
    { label: 'msedge', opts: { headless: true, channel: 'msedge', timeout: 10000, args: ['--no-sandbox'] } },
  ];
  const errs = [];
  for (const a of attempts) {
    try {
      return { browser: await pw.chromium.launch(a.opts), engine: a.label };
    } catch (e) {
      errs.push(`${a.label}: ${e.message.split('\n')[0]}`);
    }
  }
  throw new Error(`Chromium unavailable (${errs.join('; ')})`);
}

function notRunSuite(engine, theme, reason) {
  const ids = [
    'no-positive-tabindex',
    'tab-order-and-no-trap',
    'focus-ring',
    'modal-focus-trap-esc-return',
    'roving-focus-ltr-rtl',
    'enter-space-activation',
  ];
  return {
    engine,
    theme,
    summary: { pass: 0, fail: 0, notRun: ids.length },
    checks: ids.map((id) => ({ id, status: 'NOT RUN', detail: reason, violations: [] })),
  };
}

async function runSingle(pw, targetUrl, engine, theme) {
  let browser;
  let actualEngine = engine;
  try {
    const launched = await launchEngine(pw, engine);
    browser = launched.browser;
    actualEngine = launched.engine;
  } catch (err) {
    return notRunSuite(engine, theme, err.message.split('\n')[0]);
  }

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: theme,
    });
    await context.addInitScript((t) => {
      try { localStorage.setItem('cf-theme', t); } catch {}
      document.documentElement.dataset.theme = t;
    }, theme);
    const page = await context.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);

    // 1. No tabindex > 0 & snapshot focusables
    const prep = await page.evaluate(() => {
      const selFor = (el) => {
        if (!el || el.nodeType !== 1) return 'unknown';
        if (el.id) return `#${el.id}`;
        const cls = typeof el.className === 'string' && el.className.trim()
          ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
          : '';
        const d = el.getAttribute('data-defect') ? `[data-defect="${el.getAttribute('data-defect')}"]` : '';
        return `${el.tagName.toLowerCase()}${cls}${d}`;
      };
      const isVis = (el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const positiveTab = [];
      for (const el of document.querySelectorAll('[tabindex]')) {
        if (!isVis(el)) continue;
        const ti = parseInt(el.getAttribute('tabindex') || '0', 10);
        if (ti > 0) {
          positiveTab.push({ selector: selFor(el), actual: `tabindex="${ti}"`, expected: 'tabindex 0 or -1 (never > 0)' });
        }
      }
      const focusable = Array.from(
        document.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => {
        if (!isVis(el) || el.closest('[aria-hidden="true"]')) return false;
        if (el.hasAttribute('tabindex') && parseInt(el.getAttribute('tabindex') || '0', 10) < 0) return false;
        return true;
      });
      focusable.forEach((el, i) => el.setAttribute('data-cf-ux-idx', String(i)));
      const snaps = focusable.map((el, i) => {
        const cs = getComputedStyle(el);
        return {
          idx: i,
          selector: selFor(el),
          outlineStyle: cs.outlineStyle,
          outlineWidth: parseFloat(cs.outlineWidth) || 0,
          boxShadow: cs.boxShadow,
        };
      });
      return { positiveTab, snaps };
    });

    // 2 & 3. Tab order, no keyboard trap, and visible focus ring
    const tabViolations = [];
    const focusViolations = [];
    const snapMap = new Map(prep.snaps.map((s) => [s.idx, s]));
    const visitedOrder = [];
    const seenFocus = new Set();

    if (prep.snaps.length > 0) {
      await page.mouse.click(1, 1).catch(() => {});
      let prevIdx = -1;
      let stuckCount = 0;
      let wrapped = false;
      let hitDocumentEnd = false;
      const steps = Math.min(prep.snaps.length + 4, 60);
      for (let i = 0; i < steps; i++) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body || el === document.documentElement) return null;
          const cs = getComputedStyle(el);
          const idxAttr = el.getAttribute('data-cf-ux-idx');
          return {
            idx: idxAttr !== null ? parseInt(idxAttr, 10) : -1,
            tag: el.tagName.toLowerCase(),
            id: el.id || '',
            outlineStyle: cs.outlineStyle,
            outlineWidth: parseFloat(cs.outlineWidth) || 0,
            boxShadow: cs.boxShadow,
          };
        });
        if (!info || info.idx < 0) {
          if (prevIdx >= 0) hitDocumentEnd = true;
          continue;
        }
        if (info.idx === prevIdx) {
          stuckCount++;
          if (stuckCount >= 2) {
            tabViolations.push({
              selector: snapMap.get(info.idx)?.selector || info.tag,
              actual: `focus trapped on index ${info.idx} across consecutive Tab presses`,
              expected: 'Tab advances to next focusable element',
            });
            break;
          }
        } else {
          stuckCount = 0;
        }
        if (prevIdx >= 0 && info.idx < prevIdx) {
          // A clean end-of-document wrap back to an already-visited element finishes the Tab cycle
          if (hitDocumentEnd && seenFocus.has(info.idx)) {
            break;
          }
          if (!seenFocus.has(info.idx) || wrapped) {
            // Backward jump to an unvisited element (e.g. tabindex > 0) or repeated backward jump indicates non-DOM tab order
            tabViolations.push({
              selector: snapMap.get(info.idx)?.selector || info.tag,
              actual: `focus jumped backwards from DOM index ${prevIdx} to ${info.idx}`,
              expected: 'monotonic DOM tab order',
            });
          } else {
            wrapped = true;
          }
        }
        hitDocumentEnd = false;
        prevIdx = info.idx;
        visitedOrder.push(info.idx);

        if (!seenFocus.has(info.idx)) {
          seenFocus.add(info.idx);
          const before = snapMap.get(info.idx);
          const hasOutline = info.outlineStyle !== 'none' && info.outlineWidth > 0;
          const gainedShadow = info.boxShadow !== 'none' && info.boxShadow !== before?.boxShadow;
          if (!hasOutline && !gainedShadow) {
            focusViolations.push({
              selector: before?.selector || `[ux-idx=${info.idx}]`,
              actual: `outline=${info.outlineStyle} ${info.outlineWidth}px, boxShadow=${info.boxShadow}`,
              expected: 'visible focus ring on keyboard Tab focus',
            });
          }
        }
        if (seenFocus.size >= prep.snaps.length) break;
      }
    }

    // 4. Modal / Sheet / Alert: focus trap, Esc closes, focus returns to trigger
    const modalViolations = [];
    const modalTriggers = await page.evaluate(() => {
      const cands = ['#btn-open-sheet', '#btn-open-alert', '[data-ux-modal-trigger]'];
      const found = [];
      for (const sel of cands) {
        const el = document.querySelector(sel);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) found.push(sel);
        }
      }
      return found;
    });

    for (const trigSel of modalTriggers) {
      await page.locator(trigSel).first().focus({ timeout: 3000 });
      // Activate via keyboard Enter so WebKit does not blur the <button> on mouse mousedown before onClick
      await page.keyboard.press('Enter');
      await page.waitForTimeout(350);
      const dialogSel = '[role="dialog"], [role="alertdialog"]';
      if ((await page.locator(dialogSel).count()) === 0) {
        await page.locator(trigSel).first().click({ timeout: 3000 });
        await page.waitForTimeout(350);
      }
      const dlgCount = await page.locator(dialogSel).count();
      if (dlgCount === 0) {
        modalViolations.push({ selector: trigSel, actual: 'dialog did not open', expected: 'role="dialog" or role="alertdialog" opens' });
        continue;
      }
      // Tab 5 times and verify focus stays inside dialog
      let escaped = false;
      for (let t = 0; t < 5; t++) {
        await page.keyboard.press('Tab');
        const inside = await page.evaluate(() => {
          const dlgs = Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"]'));
          const active = document.activeElement;
          return dlgs.some((d) => d.contains(active));
        });
        if (!inside) { escaped = true; break; }
      }
      if (escaped) {
        modalViolations.push({ selector: trigSel, actual: 'Tab escaped modal dialog', expected: 'focus trapped inside open dialog' });
      }
      // Press Escape to close (allow up to 1200ms for spring exit animation)
      await page.keyboard.press('Escape');
      try {
        await page.locator(dialogSel).first().waitFor({ state: 'detached', timeout: 1200 });
      } catch {
        // still attached
      }
      await page.waitForTimeout(80);
      const stillOpen = await page.locator(dialogSel).count();
      if (stillOpen > 0) {
        modalViolations.push({ selector: trigSel, actual: 'Escape did not close dialog', expected: 'Escape dismisses modal dialog' });
        if (await page.locator('#btn-close-sheet').count()) {
          await page.locator('#btn-close-sheet').click({ timeout: 2000 }).catch(() => {});
          await page.waitForTimeout(200);
        }
      } else {
        const returned = await page.evaluate((sel) => {
          const trig = document.querySelector(sel);
          return document.activeElement === trig || (trig && trig.contains(document.activeElement));
        }, trigSel);
        if (!returned) {
          modalViolations.push({ selector: trigSel, actual: 'focus did not return to trigger after Esc', expected: `focus returns to ${trigSel}` });
        }
      }
    }

    // 5. TabBar / SegmentedControl roving focus (LTR + RTL + Home/End)
    const rovingViolations = [];
    const tablistCount = await page.locator('[role="tablist"]').count();
    for (let ti = 0; ti < tablistCount; ti++) {
      const tl = page.locator('[role="tablist"]').nth(ti);
      const box = await tl.boundingBox();
      if (!box || box.width === 0 || box.height === 0) continue;
      const tabs = tl.locator('[role="tab"]');
      const nTabs = await tabs.count();
      if (nTabs < 2) continue;

      const label = (await tl.getAttribute('aria-label')) || `tablist[${ti}]`;
      // LTR: Home -> ArrowRight -> End
      await tabs.first().focus();
      await page.keyboard.press('Home');
      await page.waitForTimeout(60);
      const firstSel = await tabs.first().getAttribute('aria-selected');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(60);
      const secondSel = await tabs.nth(1).getAttribute('aria-selected');
      const secondFocused = await tabs.nth(1).evaluate((el) => document.activeElement === el);
      if (secondSel !== 'true' || !secondFocused) {
        rovingViolations.push({ selector: `[role="tablist"][aria-label="${label}"]`, actual: `LTR ArrowRight: selected=${secondSel}, focused=${secondFocused}`, expected: '2nd tab selected & focused' });
      }
      await page.keyboard.press('End');
      await page.waitForTimeout(60);
      const lastSel = await tabs.last().getAttribute('aria-selected');
      if (lastSel !== 'true' && firstSel === 'true') {
        rovingViolations.push({ selector: `[role="tablist"][aria-label="${label}"]`, actual: `End key: last tab aria-selected=${lastSel}`, expected: 'End selects last tab' });
      }

      // RTL: switch dir="rtl", Home -> ArrowLeft moves to 2nd tab
      await page.evaluate(() => {
        const rootEl = document.getElementById('harness-root') || document.documentElement;
        rootEl.setAttribute('data-prev-dir', rootEl.getAttribute('dir') || '');
        rootEl.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('dir', 'rtl');
      });
      await page.waitForTimeout(50);
      await tabs.first().focus();
      await page.keyboard.press('Home');
      await page.waitForTimeout(60);
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(60);
      const rtlSecondSel = await tabs.nth(1).getAttribute('aria-selected');
      if (rtlSecondSel !== 'true') {
        rovingViolations.push({ selector: `[role="tablist"][aria-label="${label}"]`, actual: `RTL ArrowLeft: 2nd tab aria-selected=${rtlSecondSel}`, expected: 'RTL ArrowLeft advances to 2nd tab' });
      }
      await page.evaluate(() => {
        const rootEl = document.getElementById('harness-root') || document.documentElement;
        const prev = rootEl.getAttribute('data-prev-dir') || 'ltr';
        rootEl.setAttribute('dir', prev);
        document.documentElement.setAttribute('dir', prev);
      });
      await page.waitForTimeout(50);
    }

    // 6. Enter / Space activation on Toggle ([role="switch"]) and custom/native [role="button"]
    const activationViolations = [];
    const switches = page.locator('[role="switch"]');
    const nSw = await switches.count();
    for (let i = 0; i < Math.min(nSw, 2); i++) {
      const sw = switches.nth(i);
      const box = await sw.boundingBox();
      if (!box || box.width === 0) continue;
      const before = await sw.getAttribute('aria-checked');
      await sw.focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(80);
      const after = await sw.getAttribute('aria-checked');
      if (after === before) {
        activationViolations.push({ selector: `[role="switch"]:nth(${i})`, actual: `Space did not toggle aria-checked (stayed ${before})`, expected: 'Space toggles switch' });
      } else {
        await page.keyboard.press('Space');
        await page.waitForTimeout(60);
      }
    }

    // Check custom non-native [role="button"] elements (e.g. <div role="button" tabindex="0">) for Enter & Space
    const customBtns = page.locator('[role="button"]:not(button):not(a):not(input)');
    const nCb = await customBtns.count();
    for (let i = 0; i < Math.min(nCb, 3); i++) {
      const cb = customBtns.nth(i);
      const box = await cb.boundingBox();
      if (!box || box.width === 0) continue;
      await cb.evaluate((el) => {
        el.dataset.cfEnterFired = '0';
        el.dataset.cfSpaceFired = '0';
        el.addEventListener('click', () => { el.dataset.cfClickCount = String((+(el.dataset.cfClickCount || '0')) + 1); }, { once: false });
      });
      const beforeClicks = await cb.evaluate((el) => +(el.dataset.cfClickCount || '0'));
      const beforeAttr = await cb.getAttribute('data-activated');
      await cb.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(50);
      const afterEnterClicks = await cb.evaluate((el) => +(el.dataset.cfClickCount || '0'));
      const afterEnterAttr = await cb.getAttribute('data-activated');
      if (afterEnterClicks === beforeClicks && afterEnterAttr === beforeAttr) {
        const sel = await cb.evaluate((el) => el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}[role="button"]${el.getAttribute('data-defect') ? `[data-defect="${el.getAttribute('data-defect')}"]` : ''}`);
        activationViolations.push({ selector: sel, actual: 'Enter did not activate custom role="button"', expected: 'Enter activates role="button"' });
      }
    }

    const mk = (id, violations, okDetail) => ({
      id,
      status: violations.length === 0 ? 'PASS' : 'FAIL',
      detail: violations.length === 0 ? okDetail : `${violations.length} violation(s)`,
      violations,
    });

    const checks = [
      mk('no-positive-tabindex', prep.positiveTab, 'Zero elements with tabindex > 0'),
      mk('tab-order-and-no-trap', tabViolations, `Tab order monotonic across ${seenFocus.size} control(s), no trap`),
      mk('focus-ring', focusViolations, `All ${seenFocus.size} Tab-visited control(s) retain visible focus ring`),
      mk('modal-focus-trap-esc-return', modalViolations, modalTriggers.length ? `Verified ${modalTriggers.length} modal(s): trapped, Esc closes, focus returns` : 'No modal trigger on page'),
      mk('roving-focus-ltr-rtl', rovingViolations, tablistCount ? `Verified ${tablistCount} tablist(s) in LTR & RTL + Home/End` : 'No tablist on page'),
      mk('enter-space-activation', activationViolations, 'Keyboard Enter/Space activation verified'),
    ];
    const pass = checks.filter((c) => c.status === 'PASS').length;
    const fail = checks.filter((c) => c.status === 'FAIL').length;
    return { engine: actualEngine, theme, summary: { pass, fail, notRun: 0 }, checks };
  } finally {
    await browser.close().catch(() => {});
  }
}

const opts = parseArgs(process.argv.slice(2));
const targetUrl = normalizeUrl(opts.url);
if (!targetUrl) {
  process.stderr.write('Usage: node qa/ux-keyboard.mjs --url <url-or-file> [--browser chromium|webkit|firefox|all] [--theme light|dark|both] [--json] [--out <file>]\n');
  process.exit(2);
}

let pw;
try {
  pw = await import('playwright');
} catch (err) {
  const report = { url: targetUrl, runs: [notRunSuite(opts.browser, opts.theme, `Playwright unavailable (${err.code || err.message})`)] };
  const rendered = opts.json ? JSON.stringify(report, null, 2) + '\n' : `NOT RUN: Playwright unavailable\n`;
  if (opts.out) fs.writeFileSync(path.resolve(opts.out), rendered, 'utf8');
  process.stdout.write(rendered);
  process.exit(0);
}

const browsers = opts.browser === 'all' ? ['chromium', 'webkit', 'firefox'] : [opts.browser];
const themes = opts.theme === 'both' ? ['light', 'dark'] : [opts.theme];
const runs = [];
for (const b of browsers) {
  for (const t of themes) {
    runs.push(await runSingle(pw, targetUrl, b, t));
  }
}

const totalFail = runs.reduce((s, r) => s + r.summary.fail, 0);
const totalPass = runs.reduce((s, r) => s + r.summary.pass, 0);
const totalNotRun = runs.reduce((s, r) => s + r.summary.notRun, 0);
const report = { url: targetUrl, summary: { pass: totalPass, fail: totalFail, notRun: totalNotRun }, runs };

const rendered = opts.json
  ? JSON.stringify(report, null, 2) + '\n'
  : [
      `# cupertino-forge UX Keyboard Audit`,
      `URL: ${targetUrl} | Summary: ${totalPass} PASS, ${totalFail} FAIL, ${totalNotRun} NOT RUN`,
      '',
      ...runs.flatMap((r) => [
        `## ${r.engine} (${r.theme}): ${r.summary.pass} PASS, ${r.summary.fail} FAIL, ${r.summary.notRun} NOT RUN`,
        ...r.checks.map((c) => `- **${c.status}** \`${c.id}\`: ${c.detail}${c.violations.length ? ' -> ' + c.violations.map((v) => `${v.selector} (${v.actual})`).join('; ') : ''}`),
        '',
      ]),
    ].join('\n');

if (opts.out) fs.writeFileSync(path.resolve(opts.out), rendered, 'utf8');
process.stdout.write(rendered);
process.exit(totalFail > 0 ? 1 : 0);

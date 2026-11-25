# 16 — Automated Visual, Contrast & Cross-Platform QA Methodology

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `skills/apple-design-audit`, `scripts/capture.py`, `scripts/contrast-check.mjs`, `hooks/scripts/lint.mjs`, এবং ভবিষ্যতের regression test suite তৈরির জন্য QA ও পরিমাপ পদ্ধতি নির্ধারণ করে — Web, Flutter, ও Tauri-তে নির্ভুলভাবে Apple-fidelity ও Accessibility যাচাই করার প্রামাণ্য নির্দেশিকা।

---

## 1. Quantitative QA Gates & Bug Corrections (Prompt 3 Inputs)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `qa.contrast.smallFloor` | `>= 4.5` (`fontSize <= 17 pt`) | ratio | All | Light / Dark | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Direct input to fix `contrast-check.mjs` & `03-color.md` |
| `qa.contrast.largeOrBoldFloor` | `>= 3.0` (`>= 18 pt` OR Bold any size) | ratio | All | Light / Dark | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Exact boundary vs WCAG AA; note non-text UI also `>= 3.0` |
| `qa.contrast.ciede2000Noticeable` | `<= 2.0` (`Delta E00` color tolerance) | ΔE00 | Design vs Render | Both | https://en.wikipedia.org/wiki/Color_difference#CIEDE2000 | Official | high | Perceptually imperceptible threshold against kit color swatches |
| `qa.visual.ssimTarget` | `>= 0.92` (`Playwright` golden comparison) | SSIM score | Web / Flutter | Both | https://en.wikipedia.org/wiki/Structural_similarity_index_measure | Estimated | med | Structural regression threshold across identical mock data |
| `qa.playwright.emulateMedia` | `colorScheme: 'dark'`, `reducedMotion: 'reduce'`, `forcedColors` | Playwright API | Web | Both | https://playwright.dev/docs/api/class-page#page-emulate-media | Official | high | Pair with `toHaveScreenshot()` & `toMatchAriaSnapshot()` |
| `qa.tauri.webdriverStack` | `@wdio/tauri-service` / `tauri-plugin-webdriver` | WebDriver | Tauri macOS + Win | Both | https://v2.tauri.app/develop/tests/webdriver/ | Official | high | Native `tauri-driver` is **UNSUPPORTED on macOS WKWebView** — critical QA fix |
| `qa.flutter.goldenGate` | `matchesGoldenFile('goldens/...')` + `Surface` contrast/semantics finder | `flutter_test` | Flutter | Both | https://api.flutter.dev/flutter/flutter_test/matchesGoldenFile.html | Official | high | Test both `TextScaler.linear(1.0)` and `TextScaler.linear(2.0)` + `TextDirection.rtl` |
| `qa.perf.droppedFramesBudget` | `<= 1%` frames `> 16.6ms` (60Hz) / `> 8.3ms` (120Hz ProMotion) | frame time | All | Both | https://docs.flutter.dev/perf/ui-performance | Official | high | Enforce `<= 6` backdrop blur surfaces & grouped Flutter `BackdropGroup` |

---

## 2. Four-Pillar Automated Audit Pipeline *(Untested Blueprint)*

1. **Static Lint (`hooks/scripts/lint.mjs`)**:
   - Block hardcoded non-token hex values in components, physical `left`/`right` CSS without RTL logical twin (where RTL enabled), non-zero CSS `letter-spacing` inside `:lang(bn)`/`:lang(ar)`, missing `:focus-visible`, and `macOSPrivateApi: true` warning in `tauri.conf.json`.
2. **Runtime DOM & Contrast (`scripts/capture.py` + `contrast-check.mjs`)**:
   - Capture Light, Dark, Compact (`393×852`), Desktop (`1440×900`), `200%` text scaling, and `[dir="rtl"]` viewports via Playwright (`page.emulateMedia(...)`).
   - Run WCAG AA contrast check (`<=17pt -> 4.5:1`, `>=18pt or weight>=600/700 bold -> 3:1`, icons/borders `-> 3:1`) + verify no interactive target `< 44×44` (`iOS/touch`) or `< 28×28` (`desktop`).
3. **ARIA & Keyboard Matrix**:
   - Playwright `expect(locator).toMatchAriaSnapshot()` + scripted `Tab` / `Escape` / `Arrow` key traversal verifying dialog focus-trap & return focus.
4. **Performance & Backdrop Telemetry**:
   - Count live visible elements with computed `backdrop-filter != "none"` (`warn > 6`) and sample scroll frame delta via `requestAnimationFrame`.

---

## 3. Gaps & Open Questions
- Safari (WebKit) CI testing cannot run natively on Windows without macOS runner / Playwright WebKit + real iOS hardware validation.
- Existing `scripts/contrast-check.mjs` & `hooks/scripts/lint.mjs` bug fixes are intentionally deferred to Prompt 3.

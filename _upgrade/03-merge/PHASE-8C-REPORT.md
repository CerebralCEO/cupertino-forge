# Phase 8C Report — `cupertino-forge` v2.2.1

**Date:** 2026-11-27  
**Branch:** `main` (local commit only — **not pushed**, zero Figma MCP/REST calls)  
**Release Version:** `2.2.1` (bumped from `2.2.0`)  
**Release Artifact:** `D:\Claude-Plugins\cupertino-forge-v2.2.1.zip` (`165` entries, `463.9 KB`, `bad_crc=None`, `forbidden=0`)

---

## Executive Summary

All 5 Phase 8C workstreams were executed, verified with direct runtime and pixel/geometry evidence, and packaged into `v2.2.1`:

1. **`radiusIOS.textFieldRounded` corrected (`"capsule"` → fixed `26`):** Kit data proves fixed `cr=26` on both single-line (`160×52`) and multi-line (`272×104`) fields. Removed `9999px` / `StadiumBorder()` from `build-tokens.mjs` and `CfTextField`; verified auto-clamping at `40px` (`r=20`) and preserved `26px` at `104px` in **both CSS (Chromium pixel-arc proof) and Flutter (`RRect.scaleRadii()` + `RoundedRectangleBorder.getOuterPath` + widget test)**. `SearchField` / `CfSearchField` remain `capsule` (`StadiumBorder`).
2. **iOS Menu `r=34` corner-clipping eliminated using ForgeKit geometry:** Extracted exact measurements from ForgeKit `layout.json` into `_upgrade/03-merge/IOS-MENU-GEOMETRY.md`, added measured `tokens/layout.json :: ios.menu`, synced `menu.tsx`, `cupertino.base.css`, and `cf_menu.dart`, and visually confirmed zero corner clipping and crisp concentricity in Light & Dark renders (`_local/step-b-visual/after-8c/ios-{light,dark}.png`).
3. **3-Engine `qa/ux-keyboard.mjs` (`36/36 PASS`):** Installed Playwright WebKit (`webkit-2388`) & Firefox (`firefox-1572`) inside `qa/`. Initial 3-engine run surfaced 2 harness false positives (WebKit mouse-click blur on `<button>` before `onClick`; Firefox double-wrap caused by counting `tabindex="-1"` roving tabs in the Tab sequence). Both were diagnosed empirically, fixed in `qa/ux-keyboard.mjs`, and re-verified at **36 PASS, 0 FAIL, 0 NOT RUN** across Chromium, WebKit, and Firefox × Light & Dark.
4. **macOS Dark contrast consistency (`12/12 PASS` on all 4 platform×theme matrices):** Confirmed all 5 `3.23:1` macOS Dark findings were `#FFFFFF` on Apple's measured Dark System Blue (`#0091FF`, `$class: "measured"`, `>= 3.0:1`). Added `tok.colors.system.blue.{light,dark}` to `qa/computed-style-audit.mjs :: accentTokens` and documented the rule in `qa/ACCESSIBILITY-TRADEOFFS.md`; `< 3.0:1` remains a hard `FAIL`.
5. **Full `v2.2.1` verification & ZIP build:** All test suites (Node unit/fixture tests, `verify-plugin`, `contrast-check`, Web 3-engine mounted + keyboard UX, 4× `computed-style-audit`, Flutter analyze + 8 widget/geometry tests, Tauri `cargo check` + `cargo test`) passed cleanly.

---

## Task 1: `radiusIOS.textFieldRounded` Fixed `26pt` Correction & Clamp Proof

### Changes Made
- `tokens/shape.json`: Updated `radiusIOS.textFieldRounded` from `"capsule"` to `26` (`$class: "measured"`, `$verification: "needs-device-verification"`), with `$kitExample` citing BOTH:
  - Single-line `_Text-Field-Background`: node `5469:8386` / `5469:8387`, `160×52`, `cr=26`
  - Multi-line `Text-Field-2`: node `12616:832`, `272×104`, `cr=26`
- `scripts/build-tokens.mjs`: Removed the temporary `v === 'capsule'` (`9999px` / `9999`) special case; emits `--cf-radius-text-field-rounded: 26px;` (CSS) and `static const double textFieldRounded = 26;` (Dart).
- `skills/apple-flutter/assets/lib/apple_ui/widgets/cf_fields.dart` (and synced to `tests/harness/flutter/lib/apple_ui/widgets/cf_fields.dart`): Replaced `StadiumBorder()` on `CfTextField` with `RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppleRadiusIOS.textFieldRounded))`. Kept `CfSearchField` on `StadiumBorder()`.
- `skills/apple-web/assets/components/apple/fields.tsx`: `TextField` uses `rounded-text-field-rounded` (`26px`); `SearchField` remains `rounded-capsule` (`44/48pt`).
- Docs & tests synced: `skills/apple-design-core/references/foundations/05-shape.md`, `tests/build-tokens-regression.test.mjs`.

### Verification Proof — CSS (`40px` vs `104px`)
Executed `_local/forgekit/scripts/phase8c_clamp_proof.py` rendering two `200px`-wide boxes with `border-radius: 26px` in headless Chromium and measuring the painted corner arc chord at `y=0.5px` / `x=0.5px`:
- **`#h40` (`200×40`, `border-radius: 26px`):** `top_arc_start_x = 16px`, `left_arc_start_y = 16px`. Analytical semi-circle chord for clamped `r = 20px` at `0.5px` inset is `20 - sqrt(20² - 19.5²) = 15.56 → 16px` — **auto-clamped to full capsule**.
- **`#h104` (`200×104`, `border-radius: 26px`):** `top_arc_start_x = 21px`, `left_arc_start_y = 21px`. Analytical chord for `r = 26px` at `0.5px` inset is `26 - sqrt(26² - 25.5²) = 20.93 → 21px` — **preserved `26px` rounded-rect**.

### Verification Proof — Flutter (`40px` vs `104px`)
Added widget & geometry test in `tests/harness/flutter/test/apple_ui_test.dart`:
- `AppleRadiusIOS.textFieldRounded == 26.0`
- `RRect.fromRectAndRadius(Rect.fromLTWH(0, 0, 200, 40), Radius.circular(26)).scaleRadii()` → `tlRadiusX == 20.0`, `tlRadiusY == 20.0` (capsule clamp)
- `RRect.fromRectAndRadius(Rect.fromLTWH(0, 0, 200, 104), Radius.circular(26)).scaleRadii()` → `tlRadiusX == 26.0`, `tlRadiusY == 26.0` (fixed 26pt)
- `RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)).getOuterPath(...)`:
  - At `200×40`: `Offset(14.0, 0.5)` outside, `Offset(17.0, 0.5)` inside, `Offset(0.5, 20.0)` inside
  - At `200×104`: `Offset(19.0, 0.5)` outside, `Offset(22.0, 0.5)` inside, `Offset(0.5, 30.0)` inside
- Mounted `CfTextField` (44pt single-line & 104pt multi-line) confirmed `ShapeDecoration.shape is RoundedRectangleBorder` with `BorderRadius.circular(26)`; `CfSearchField` confirmed `StadiumBorder`.

Command:
```text
Push-Location "tests\harness\flutter" && flutter analyze && flutter test && Pop-Location
→ Analyzing flutter... No issues found! (ran in 1.8s)
→ 00:01 +8: All tests passed!
```

---

## Task 2: iOS Menu Geometry Extraction & Corner-Clipping Fix

### ForgeKit Extraction
Documented complete node-by-node geometry from `_local/forgekit/ios27/.../layout.json` in `_upgrade/03-merge/IOS-MENU-GEOMETRY.md`:
- Menu outer frame (`5908:6481`): `238×578`, `paddingTop: 10`, `paddingBottom: 10`
- Glass surface (`I5908:6372;10411:18670`): `cornerRadius: 34`
- Row wrapper (`5908:6377`): `paddingLeft: 16`, `paddingRight: 16`
- Row item (`5908:6379`): `height: 40` (subtitle row `5908:6381`: `60`), `paddingLeading: 6`, `paddingTrailing: 8`, `itemSpacing: 6`
- Selection highlight (`5856:13992`): `cornerRadius: 100` (`capsule`)
- Section separator (`5908:6378`): `height: 21`, horizontal inset `8`
- `_Menu-Indicator` (`5831:53947`): `36×36` circle

### Token & Component Sync
- Added `tokens/layout.json :: ios.menu` (`$class: "measured"`, `$verification: "needs-device-verification"`).
- `scripts/build-tokens.mjs`: Emits `--cf-menu-ios-w: 238px`, `--cf-menu-ios-pad-y: 10px`, `--cf-menu-ios-pad-x: 16px`, `--cf-menu-ios-row-h: 40px`, `--cf-menu-ios-row-pad-l: 6px`, `--cf-menu-ios-row-pad-r: 8px`, `--cf-menu-ios-sep-h: 21px`, `--cf-menu-ios-sep-inset: 8px` plus matching `AppleLayout.iosMenu*` Dart constants.
- Removed hardcoded `--cf-menu-ios-w: 250px` from `skills/apple-web/assets/styles/cupertino.base.css`.
- Synced `skills/apple-web/assets/components/apple/menu.tsx` and `skills/apple-flutter/assets/lib/apple_ui/widgets/cf_menu.dart` to consume generated `ios.menu` tokens.
- Updated `skills/apple-design-core/references/components-ios/presentation.md`.

### Visual Proof
Rendered `_local/step-b-visual/after-8c/ios-light.png` and `_local/step-b-visual/after-8c/ios-dark.png` and inspected both images directly: the `r=34` outer glass menu container with `10pt` vertical / `16pt` horizontal padding and `40pt` capsule row highlight shows zero corner clipping and clean concentric clearance in both Light and Dark themes.

---

## Task 3: 3-Engine `qa/ux-keyboard.mjs` Execution & Triage

### Browser Installation
```text
Push-Location qa && npx playwright install webkit firefox && Pop-Location
→ Installed webkit-2388, ffmpeg-1013, firefox-1572 (exit 0)
```

### Initial 3-Engine Run & Root-Cause Triage
Initial run of `node qa/ux-keyboard.mjs --url <dist> --browser all --theme both` reported `32 PASS, 4 FAIL, 0 NOT RUN`:
- **Chrome (Light & Dark):** `6/6 PASS` each.
- **WebKit (Light & Dark):** `FAIL modal-focus-trap-esc-return` on `#btn-open-sheet` & `#btn-open-alert` (`focus did not return to trigger after Esc`).
  - **Empirical diagnosis:** Running WebKit with `focus() + keyboard.press('Enter')` returned focus to `#btn-open-sheet` and `#btn-open-alert` (`100% PASS`). The failure occurred because `qa/ux-keyboard.mjs` called `.focus()` followed immediately by mouse `.click()`, and WebKit natively blurs `<button>` to `document.body` on mouse `mousedown` before React's `onClick` runs — a **harness false positive** in `qa/ux-keyboard.mjs`.
- **Firefox (Light & Dark):** `FAIL tab-order-and-no-trap` (`input.h-full.w-full focus jumped backwards from DOM index 19 to 14`).
  - **Empirical diagnosis:** Dumping Firefox's Tab sequence proved DOM order was strictly monotonic across all 16 tabbable controls (`0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 14 → 15 → 16 → 19`). `qa/ux-keyboard.mjs`'s selector `button:not([disabled])` mistakenly included 4 WAI-ARIA roving-tabindex `<button tabindex="-1">` tabs (`12, 13, 17, 18`), making `prep.snaps.length = 20` instead of `16`. Because `seenFocus.size` (`16`) could never reach `20`, the loop tabbed past document end (`BODY`) twice, triggering `if (wrapped)` on the second wrap — a **harness false positive** in `qa/ux-keyboard.mjs`.

### Fix & Re-Verification
Updated `qa/ux-keyboard.mjs`:
1. Filtered `tabindex < 0` elements out of `focusable` (respecting WAI-ARIA roving-tabindex).
2. Exited the Tab loop cleanly on a document-end (`BODY`) wrap back to an already-visited control, while continuing to fail any mid-document backward jump or `tabindex > 0`.
3. Activated focused modal triggers with `keyboard.press('Enter')` (with `.click()` fallback if a custom trigger does not open on `Enter`).

Re-run output (`exit 0`):
```text
URL: http://127.0.0.1:30329/ | Summary: 36 PASS, 0 FAIL, 0 NOT RUN
## chrome (light): 6 PASS, 0 FAIL, 0 NOT RUN
## chrome (dark): 6 PASS, 0 FAIL, 0 NOT RUN
## webkit (light): 6 PASS, 0 FAIL, 0 NOT RUN
## webkit (dark): 6 PASS, 0 FAIL, 0 NOT RUN
## firefox (light): 6 PASS, 0 FAIL, 0 NOT RUN
## firefox (dark): 6 PASS, 0 FAIL, 0 NOT RUN
```

---

## Task 4: macOS Dark Contrast Parity (`#0091FF`, `3.23:1`)

### Investigation
All 5 failing checks on `macos/dark` (`MacSidebarRow` selected label & badge, `MacTable` selected row cells, `MacButton` default `"Save"`) were `#FFFFFF` text on Apple's measured Dark System Blue (`#0091FF`, `$class: "measured"`, contrast `3.23:1 >= 3.0:1`). `qa/computed-style-audit.mjs` only checked `tok.$meta.accent.{light,dark}` and omitted `tok.colors.system.blue.{light,dark}`.

### Fix & Verification
- Updated `qa/computed-style-audit.mjs`: Included `tok.colors?.system?.blue?.light` (`#0088FF`) and `tok.colors?.system?.blue?.dark` (`#0091FF`) in `accentTokens` for `isWhiteOnOfficialAccent` (`ratio >= 3.0` advisory; `< 3.0` remains hard `FAIL`).
- Updated `qa/ACCESSIBILITY-TRADEOFFS.md`: Documented `#FFFFFF` on macOS Dark System Blue `#0091FF` (`3.23:1`, `>= 3.0:1` advisory).
- Re-ran all 4 `qa/computed-style-audit.mjs` matrices (`exit 0` each):
  - `ios/light`: **100 (3 advisories)/100 (12 PASS, 0 FAIL, 0 NOT RUN)**
  - `ios/dark`: **100/100 (12 PASS, 0 FAIL, 0 NOT RUN)**
  - `macos/light`: **100 (6 advisories)/100 (12 PASS, 0 FAIL, 0 NOT RUN)**
  - `macos/dark`: **100 (5 advisories)/100 (12 PASS, 0 FAIL, 0 NOT RUN)**

---

## Task 5: `v2.2.1` Version Bump, Full Test Matrix & Release ZIP

### Version Sync
Updated `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `README.md`, `GUIDE.md`, and `CHANGELOG.md` to `2.2.1`.

### Full Verification Matrix
| Check | Command | Result |
|---|---|---|
| Plugin Verification | `node scripts/verify-plugin.mjs` | **12 PASS, 0 NOT RUN, 0 FAIL** (`cupertino-forge@2.2.1`) |
| Node Unit & QA Fixture Tests | `node --test tests/*.test.mjs` | **16/16 PASS, 0 FAIL** |
| Token Contrast Check | `node scripts/contrast-check.mjs --accent "#0088FF"` | **exit 0, 0 blocking failures** |
| Web Mounted Harness (3 Engines) | `python tests/harness/web/verify_mounted.py --browser {chromium,webkit,firefox}` | **Chromium exit 0, WebKit exit 0, Firefox exit 0** |
| Web Keyboard UX (3 Engines × 2 Themes) | `node qa/ux-keyboard.mjs --browser all --theme both` | **36 PASS, 0 FAIL, 0 NOT RUN (exit 0)** |
| Computed-Style Audit (iOS + macOS × Light + Dark) | `node qa/computed-style-audit.mjs --platform {ios,macos} --theme {light,dark}` | **4/4 × 12/12 PASS (100/100, exit 0)** |
| Flutter Analyze & Widget/Clamp Tests | `flutter analyze && flutter test` | **No issues found; 8/8 PASS** |
| Tauri Rust Check & Tests | `cargo check && cargo test --lib` | **PASS; 2 passed, 0 failed** |
| Release ZIP Integrity | `node scripts/package-plugin.mjs --out "D:\Claude-Plugins\cupertino-forge-v2.2.1.zip"` + Python `zipfile` | **`exists=True, size=475030 (463.9 KB), entries=165, bad_crc=None, forbidden=0`** |

# Phase 8B Report — ForgeKit Visible-Surface Token Sync, Visual Check & Full Verification (`v2.2.0`)

**Date:** 2026-11-27  
**Workspace:** `D:\Claude-Plugins\cupertino-forge`  
**Branch:** `main` (local commit only; **not pushed**)  
**Version:** `2.2.0`

---

## (ক) Token Changes Applied (Old → New, Node / Variable ID, Class)

| Token File & Path | Old Value | New Value | Kit Node / Variable ID | `$class` & Verification |
|---|---|---|---|---|
| `tokens/shape.json :: radiusMacOS.alert` | `10` *(Phase 3c container-only bug; pre-3c `16`)* | **`34`** | `macos27` `Alert` `I494:3080;4311:12662` (`Fill + Shadow`) | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusMacOS.popover` | `10` *(Phase 3c container-only bug; pre-3c `16`)* | **`20`** | `macos27` `Popover-2` `I4336:13195;110:856` (`Body`) | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusMacOS.menu` | `12` (`estimated`) | **`12`** (confirmed) | `macos27` `Menu-Background` `4353:2522` | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusMacOS.utilityPanel` | *(new)* | **`15`** | `macos27` `Utility-Panel` `4374:54812` | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusMacOS.{window,sheet,menuItemHighlight}` | `16`, `16`, `8` | `16`, `16`, `8` (confirmed) | `585:3372`, `121:11423`, `685:23692` | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusIOS.popover` | `26` | **`38`** | `ios27` `Popovers-(iPad-Only)` `513:95247` (`Background`) | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusIOS.menu` | `26` | **`34`** | `ios27` `Menu` `I5908:6372;10411:18670` (`Fill + Shadow`) | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusIOS.contextMenuPreview` | `22` | **`30`** | `ios27` `Context-Menu` `548:48135` / `548:50347` / `548:49985` (`Content Area`) | `measured` (subfield), `needs-device-verification` |
| `tokens/shape.json :: radiusIOS.textFieldRounded` | `12` | **`"capsule"`** (`9999px` CSS / `StadiumBorder()` Flutter) | `ios27` `_Text-Field-Background` `5469:8386` / `5469:8387` (`160×52 cr=26` in `$kitExample`) | `measured` (subfield), `needs-device-verification` |
| `tokens/color.json :: dimming.sheetScrim` | `#000000@0.2 / #000000@0.48` (`estimated`) | **`#000000@0.2 / #000000@0.48`** (promoted) | `ios27` `Overlays/Default` `VariableID:13207:178` & `13207:240` | **`measured`** |
| `tokens/color.json :: selection.unemphasizedSelectedBackground` | `#DCDCDC / #464646` (`estimated`) | **`#000000@0.14 / #FFFFFF@0.18`** | `macos27` `BG - Selected + Inactive` `VariableID:4356:10110` | **`measured`** |
| `tokens/color.json :: selection` (parent) | `estimated` | promoted parent | `macos27` `4356:10117`, `4356:10110`, `207:14858` | **`measured`** |
| `tokens/color.json :: labelIOS.secondary` & `separatorIOS.nonOpaque` | Sketch primary `#EBEBF5@0.6` / `#FFFFFF@0.12` | Primary unchanged; added **`$kitConflict`** (`@0.7` / `@0.17`) | `ios27` `13207:204`, `13207:239` | `measured` + `needs-device-verification` |
| `tokens/layout.json` (10 ambiguous groups) | `estimated` | Primary values & 5-size button scale unchanged; added **`$kitSizes` / `$kitReference`** | Nodes documented per group (`2026-11-27`) | `estimated` (preserved) |
| `tokens/elevation.json :: levels.{knob,popover,sheet}` | `estimated` | Primary values unchanged; enriched **`$kitReference`** with full Light & Dark shadow stacks + blend modes | `10456:1593`, `5437:1568`, `61:65449`, `4336:13262`, `10525:1636`, `121:11423`, `4358:15436` | `estimated` + `measured-kit-reference` |
| `tokens/materials.json :: figmaGlass` | *(new)* | Added reference-only **`figmaGlass`** (`11` iOS `Kit` FLOAT vars + component `GLASS`/`BACKGROUND_BLUR`/`overlayFills`) | `VariableCollectionId:5565:22724` + `layout.json` | **`measured`** (`reference-only`; `tuned`/`engine` untouched & `estimated`) |
| `tokens/typography.json` | Official HIG | **100% unchanged** (`14` Apple Figma kit quirks logged in `qa/KIT-QUIRKS.md`) | — | `official` |

---

## (খ) Remaining Estimates & Why (`tokens/ESTIMATES.md`)

- **Total Remaining Estimates:** **`67` groups/entries** (down from **`70`** in v2.1.1 — promoted `dimming.sheetScrim`, `selection`, `selection.unemphasizedSelectedBackground`), plus **`5` conflicts/alternates** (up from `3` — added `labelIOS.secondary.$kitConflict` and `separatorIOS.nonOpaque.$kitConflict`).
- **Why they remain `estimated`:**
  - **51 `not-in-figma`:** Runtime spring physics & transition timings (`motion.json`: 25), CSS/Flutter blur approximations & perf budgets (`materials.json`: 7), macOS grouped surfaces & zero-stroke field convention absent from kit (`color.json`: 7), abstract 4pt grid / z-index / margins (`layout.json`: 4), Bangla/Inter heuristics (`typography.json`: 3), Web haptics/WAV audio (`feedback.json`: 2), Web card/toast shadows (`elevation.json`: 2), Lucide stroke table (`icons.json`: 1).
  - **16 `ambiguous`:** Multi-variant / multi-platform groups where kit values diverge by context or size (`ios.button` 3 vs 5 sizes, `segmentedControl` 32/36/50, `toolbar` 44/48/54, `tabBar` sideInset, `listRow`, `pageControl` gap, `safeArea` legacy hardware, `macos` parent, `trafficLights` 19 vs 12 leading, `sidebar` resize bounds, `radiusIOS` / `radiusMacOS` outer groups, `levels.{knob,popover,sheet}` shadows, and `highContrastLabels`).

---

## (গ) Visual Screenshot Inspection (`_local/step-b-visual/{before,after}/`, gitignored)

Rendered macOS (`Alert`, `Popover`, `Menu`, `Context Menu`, `Window`) and iOS (`Alert`, `Popover`, `Menu`, `Text Field`, `Sheet`) in headless Chromium (Light & Dark) before and after Step B tokens:

| Platform & Component | Before (`r`, `pad`, `inner`) | After (`r`, `pad`, `inner`) | Concentric? | Clipped? | Visual Observation |
|---|---|---|---|---|---|
| macOS `Alert` | `r=10, pad=20, in=9999` | **`r=34, pad=20, in=9999`** | Yes (capsule buttons) | No (`clip=False`) | Clean, generous corner curvature; zero clipping |
| macOS `Popover` | `r=10, pad=16, in=4` | **`r=20, pad=16, in=4`** | Yes (`20 - 16 = 4`) | No (`clip=False`) | Exact concentric fit (`4px` inner card) |
| macOS `Menu` | `r=12, pad=5, in=8` | **`r=12, pad=5, in=8`** | Near (`12 - 5 = 7` vs `8` kit value) | No (`clip=False`) | Crisp; 1px kit tolerance (`8` vs `7`) looks clean |
| macOS `Context Menu Preview` | `r=22, pad=14` | **`r=30, pad=14`** | N/A (text content) | No (`clip=False`) | Clean; well-padded |
| macOS `Window` | `r=16, pad=0` | **`r=16, pad=0`** | Yes | No (`clip=False`) | Clean traffic-light bar + window corners |
| iOS `Alert` | `r=34, pad=20, in=9999` | **`r=34, pad=20, in=9999`** | Yes (capsule buttons) | No (`clip=False`) | Crisp & balanced |
| iOS `Popover` | `r=26, pad=16, in=10` | **`r=38, pad=16, in=22`** | Yes (`38 - 16 = 22`) | No (`clip=False`) | Smooth concentric inner card |
| **iOS `Menu`** *(FLAGGED FOR USER DECISION)* | `r=26, pad=5, in=8` | **`r=34, pad=5, in=8`** | **No (`34 - 5 = 29` vs `8`)** | **Visual corner clip on top/bottom highlight edge** | **Issue flagged (not auto-fixed per instructions):** In `ios-light.png`, `r=34` with `5px` outer padding slices across the top/bottom corners of the first/last highlighted row right next to `"D"` in `"Duplicate"`. In `menu.tsx` (which uses `py-1` `4px` and full-width `bg-fill-4`), increasing iOS Menu vertical/outer padding (e.g., `p-2.5` + `rounded-capsule` row highlight) or keeping `menu.tsx` rows inset should be decided by the user before modifying component layout. |
| iOS `Context Menu Preview` | `r=22, pad=14` | **`r=30, pad=14`** | N/A | No (`clip=False`) | Clean |
| iOS `Text Field` | `r=12, pad=16` | **`r=9999` (capsule), `pad=16`** | Yes (capsule) | No (`clip=False`) | Smooth capsule at any height; `cupertino.base.css` `--radius` safely decoupled to `--cf-radius-thumbnail-medium` |
| iOS `Sheet` | `r=38, pad=16, in=22` | **`r=38, pad=16, in=22`** | Yes (`38 - 16 = 22`) | No (`clip=False`) | Exact concentricity |

---

## (ঘ) Physical Mac / iPhone Hardware Verification Checklist

Before removing `needs-device-verification` tags on real macOS 27 / iOS 27 / iPadOS 27 hardware:
1. **macOS 27 AppKit Radii (measure live window/panel screenshots at 2× Retina ÷ 2):**
   - `NSWindow` active/composed (`16pt` kit vs live OS), `NSPanel` / Utility Panel (`15pt`), `NSAlert` (`34pt`), `NSPopover` (`20pt`), `NSMenu` (`12pt`), `NSMenuItem` hover highlight (`8pt`), `NSWindow` attached Sheet (`16pt`), `NSTooltip` (live OS corner radius).
2. **iOS 27 / iPadOS 27 UIKit/SwiftUI Radii (measure at 3×/2× ÷ scale):**
   - `UIAlertController` (`34pt`), Action Sheet (`34pt`), Floating Medium Sheet top/bottom corners (`38pt` / `58pt`), iPad `UIPopoverPresentationController` (`38pt`), `UIMenu` (`34pt`), `UIContextMenuInteraction` preview (`30pt`), standalone capsule `UITextField` (`height 52pt`, `r = height/2`).
3. **Liquid Glass Optical & Blur Parity:**
   - Compare live `NSGlassEffectView` / SwiftUI `.glassEffect(.regular / .clear)` against `materials.json :: figmaGlass` (`Frost 6/16`, `Refraction 70`, `Depth 30`, `Dispersion 20`) and check whether `calibration: derived (Figma Dev Mode CSS export convention radius/2)` matches visual frost density on real Retina screens.
4. **Dark-Mode Alpha & Font-Weight Conflicts (`$kitConflict`):**
   - Inspect live iOS 27 Dark Mode `UIColor.secondaryLabel` (`@0.60` Sketch vs `@0.70` Figma) and `UIColor.separator` (`@0.12` Sketch vs `@0.17` Figma); inspect macOS 27 `headline`/`caption1`/`caption2` font weights.

---

## (ঙ) Full Verification Suite & `v2.2.0` Release ZIP Proof

| Check | Result |
|---|---|
| `node scripts/verify-plugin.mjs` | **12 PASS, 0 NOT RUN, 0 FAIL** (`cupertino-forge@2.2.0`, `24/24` core runtime files) |
| `node --test tests/*.test.mjs` | **16/16 PASS, 0 FAIL** (including updated `tests/build-tokens-regression.test.mjs`) |
| `node scripts/contrast-check.mjs --accent "#0088FF"` | **exit 0, 0 blocking contrast failure(s)** (`3` expected advisories) |
| Web 3-engine mounted harness (`verify_mounted.py`) | **Chromium 7/7 PASS, WebKit 7/7 PASS, Firefox 7/7 PASS** (`exit=0`) |
| `qa/ux-keyboard.mjs --browser all --theme both` | **Chrome 12/12 PASS, 0 FAIL**; WebKit & Firefox **24 NOT RUN** (Node Playwright `webkit-2388`/`firefox-1572` not installed) |
| `qa/computed-style-audit.mjs` (iOS + macOS, Light + Dark) | **iOS Light 12/12 (100/100)**, **iOS Dark 12/12 (100/100)**, **macOS Light 12/12 (100/100)**, **macOS Dark 11/12 (92/100)** *(same pre-existing dark accent contrast tradeoff; all geometry/radius/color checks PASS)* |
| Flutter harness (`flutter analyze` + `flutter test`) | **No issues found!**, **7/7 PASS** *(fixed unused `squircle_border.dart` import in `cf_fields.dart` after switching to `StadiumBorder()`)* |
| Tauri harness (`cargo check` + `cargo test --lib`) | **PASS** (`Finished dev profile`), **2/2 PASS** (`WINDOW_CORNER_RADIUS = 16.0` preserved) |
| `tokens/ESTIMATES.md` count | **`67` estimated groups/entries** (was `70`) + **`5` conflicts/alternates** (was `3`) |
| `node scripts/package-plugin.mjs` | `_upgrade/scratch/cupertino-forge-v2.2.0.zip` (**165 files, 0 forbidden entries, `bad_crc=None`**) |

# Estimate Resolution — Round 2 (Apple Figma Kits: iOS 27 & macOS 27)

> **Date:** 2026-11-25
> **Sources:** Apple Figma UI Kits via read-only `use_figma` (`qa/figma-call-log.md`, 7/8 counted calls):
> - **macOS 27:** file `5YNrD6VW0v0Meye5F2JIz0` (16 pages inspected: Buttons, Windows, Sidebars, Toolbars, Alerts, Dialogs, Sheets, Popovers, Menus, Toggles, Segmented Controls, Text Fields, Sliders and Dials, Steppers, Search Fields, Lists and Tables)
> - **iOS 27:** file `9XLHKxkIO24Er34C0DoMcR` (21 pages inspected: Product Bezels, Layout Guides, Status Bars and Menu Bars, System, Buttons, Toggles, Sliders, Segmented Controls, Steppers, Page Controls, Pop-up Buttons, Text Fields, Tab Bars, Toolbars, Lists, Alerts, Action Sheets, Sheets, Menus, Popovers, Sidebars)
> - Raw JSON outputs stored locally in gitignored `_upgrade/05-figma-geometry/raw/`.

---

## 1. Scale Verification (1x Logical Points Confirmed)

Before accepting any numeric measurement, device frames and system bars were checked to verify the kit coordinate scale:

| Kit | Reference Node | Node ID | Measured Size | Expected 1x pt | Scale Verdict |
|---|---|---|---|---|---|
| iOS 27 | `Product Bezels :: iPhone 17 Pro / 17 / 18 Pro` | `6316:14141`, `6316:14199`, `12887:20848` | `402 × 874` | `402 × 874 pt` | **1x pt CONFIRMED** |
| iOS 27 | `Product Bezels :: iPhone 17 Pro Max / 18 Pro Max` | `6316:14158`, `12887:20855` | `440 × 956` | `440 × 956 pt` | **1x pt CONFIRMED** |
| iOS 27 | `Product Bezels :: iPhone Air` | `6316:14173` | `420 × 912` | `420 × 912 pt` | **1x pt CONFIRMED** |
| iOS 27 | `Product Bezels :: iPad Pro M4 11" / 13"` | `487:11227`, `5456:18569` | `1210 × 834`, `1376 × 1034` | `1210 × 834`, `1376 × 1034 pt` | **1x pt CONFIRMED** |
| iOS 27 | `Status Bars :: Status Bar - iPhone` | `12961:29590` | `402 × 62` | `402 × 62 pt` | **1x pt CONFIRMED** |
| iOS 27 | `System :: Home Indicator (iPhone Portrait)` | `106:60032` | `402 × 34` | `402 × 34 pt` | **1x pt CONFIRMED** |
| macOS 27 | `Windows :: Window Controls/Standard (Close/Min/Zoom)` | `177:9888`, `4365:36385` | `14 × 14`, gap `9` | `14 × 14 pt`, gap `9 pt` | **1x pt CONFIRMED** |

Both kits are authoritatively authored at **1× logical points (`pt`)**.

---

## 2. Continuous Corner (`cornerSmoothing`) Audit

Distribution of non-zero `cornerSmoothing` across all extracted component and part nodes in both Apple Figma kits:

| `cornerSmoothing` | Node Count | Where Observed | Comparison with `tokens/shape.json` |
|---|---|---|---|
| **`0.6`** (60%) | **178** | All rounded-rect surfaces & controls: macOS Windows (`585:3372`), Sheets (`121:11423`), Dialogs (`174:9424`), Alerts (`121:11254`), Popovers (`4336:13305`), Buttons (`4341:2332`), Sidebar items (`4376:58611`), Menu highlights (`685:23691`), Segmented (`498:5499`), Steppers (`121:12080`), Toggles (`474:1326`); iOS Buttons (`5473:20461`), Toggles (`10456:1252`), Steppers (`5415:17699`), Segmented (`10460:170`), Tab Bar Glass (`10508:1528`), Alerts (`65:57149`), Sidebar rows (`147:62822`) | **Exact match** with `shape.json :: continuousCorner.smoothing = 0.6` (`inferred` -> promote to **`measured`**) |
| `1.0` (100%) | 17 | Pill/capsule inner items (`_Option` `cr=1000`, `_Search - 44pt/48pt` `cr=296`, `_Buttons - 44pt/48pt` `cr=296`, `Slider Knob` `38×24 cr=100`) and full-bleed masks (`Menu Background` `488:1821`, `_Overlay - Alerts` `12956:27840`) | Capsule ends (`cr >= h/2`) are geometrically circular regardless of smoothing; rounded-rect standard remains **`0.6`**. |

---

## 3. Estimate-by-Estimate Resolution (79 Entries from `tokens/ESTIMATES.md` + `continuousCorner`)

### 3.1 Confirmed & Contradicted (Clear, Unambiguous 1:1 Matches — Eligible for Step 4 Update)

| Token Path | Current Estimate | Figma Measured Value (File, Page, Node ID) | Verdict | Proposed `$class` |
|---|---|---|---|---|
| `shape.json :: continuousCorner.smoothing` | `0.6` (`inferred`) | `0.6` across 178 nodes (macOS `585:3372`, `4341:2332`; iOS `5473:20461`, `10456:1252`) | **confirmed** | `measured` |
| `layout.json :: ios.toggle` | `w: 64, h: 28, knobW: 38, knobH: 24, knobInset: 2` | iOS 27 `Toggles` (`10456:1252` = `64×28`, `I5433:20197;508:70021` Knob = `38×24`, inset `(28-24)/2 = 2`) | **confirmed** | `measured` |
| `layout.json :: ios.slider` | `trackHeight: 6, knobWidth: 38, knobHeight: 24` | iOS 27 `Sliders` (`5428:5504` Track `h=6`, `5437:1568` Knob `38×24`) | **confirmed** | `measured` |
| `layout.json :: ios.stepper` | `width: 94, height: 32` | iOS 27 `Steppers` (`5415:17699` = `92×32`; also `Lists` `29:56851` = `92×32`) | **contradicted** (`width: 94 -> 92`) | `measured` |
| `layout.json :: ios.textField` | `height: 44, horizontalPadding: 16` | iOS 27 `Text Fields` (`553:23061` = `402×52`, `pad=[0,16,0,16]`) | **contradicted** (`height: 44 -> 52`; `horizontalPadding: 16` confirmed) | `measured` |
| `layout.json :: ios.searchField` | `height: 44` | iOS 27 `Toolbars` (`5565:33301` `_Search - 44pt` = `190×44`) & `Sidebars` (`5840:30472` = `200×44`); note `48pt` bottom variant (`5565:35246`) | **confirmed** (`44`, note `48` variant) | `measured` |
| `layout.json :: ios.alert` | `width: 300, padding: 20, buttonHeight: 48` | iOS 27 `Alerts` (`65:57149` Side-by-Side `300×307 pad=14`, `61:67601` Stacked `300×419 pad=14`, `5446:6658` `_Buttons h=48`) | **contradicted** (`padding: 20 -> 14`; `width: 300` & `buttonHeight: 48` confirmed) | `measured` |
| `layout.json :: ios.sheet` | `grabber: 36×5 topInset: 5, floatingInsetAtMedium: 8` | iOS 27 `Sheets` (`5827:57545` Grabber `60×4`, `10525:1687` Grabber pad-top `6`, `10525:1635` Medium `390` inside `402` -> inset `6`) | **contradicted** (`grabber: 60×4 topInset: 6`, `floatingInsetAtMedium: 6`) | `measured` |
| `layout.json :: macos.controlSizes` | `mini: 16, small: 20, regular: 24, large: 28, extraLarge: 36` | macOS 27 `Toggles` (`4348:11337` Mini `16`, `4348:11331` Small `20`, `4348:11313` Medium `24`, `4348:11319` Large `28`, `4348:11321` XL `36`) + `Buttons` (`4341:2332` `24`) + `Text Field` (`479:5650` `24`) + `Toolbars` XL (`4363:11823` `36`) | **confirmed** (all 5 heights `16/20/24/28/36` exact match) | `measured` |
| `layout.json :: macos.menu` | `itemHeight: 24, itemHorizontalPadding: 10, outerPadding: 5, separatorHeight: 9` | macOS 27 `Menus` (`240:7945` Item `h=24`, `483:8811` Menu `pad=[5,12,5,12]`, `4353:3152` Separator `h=11`) | **contradicted** (`separatorHeight: 9 -> 11`; `itemHeight: 24`, `outerPadding: 5` confirmed) | `measured` |
| `shape.json :: radiusMacOS` *(partial — 5 subfields)* | `window: 12, sheet: 12, alert: 16, popover: 16, menuItemHighlight: 6` | macOS 27 `Windows` (`585:3372`, `4363:18479` `cr=16`), `Sheets` (`121:11423` `cr=16`), `Alerts` (`121:11254` `cr=10`), `Popovers` (`4336:13305` `cr=10`), `Menus` (`685:23691` `cr=8`) | **contradicted** (update 5 clear subfields; keep group `$class: estimated` because `tooltip`/`card`/`dockGlass`/`checkbox` unverified) | `estimated` (with `$measuredSubfields`) |

### 3.2 Ambiguous (Multiple Kit Sizes, Partial Subfield Coverage, or Platform Divergence — Keep `estimated`)

| Token Path | Current Estimate | Figma Observations | Why Ambiguous |
|---|---|---|---|
| `layout.json :: ios.button` | `mini: 28, small: 32, medium: 36, large: 50, extraLarge: 56; padH: 12/14/20` | iOS 27 `Buttons` (`5473:20465/20463/20461`, `10456:14495/14447/9809`): `Small=28 (padH 10)`, `Medium=34 (padH 14 bordered / 12 glass)`, `Large=50 (padH 20)`. No `Mini` or `XL` in kit. | Kit has 3 sizes (`28/34/50`), not 5, and `Medium` padH differs between Bordered (`14`) and Glass (`12`). Kept `estimated` (do not break existing 5-size scale without explicit spec decision). |
| `layout.json :: ios.segmentedControl` | `height: 36, selectedInset: 2` | iOS 27 `Segmented Controls` (`10460:170` Small `32`, `10460:177` Large `50`, `_Option` `28` -> inset `2`); `Toolbars` (`5573:24522`) = `36`. | Three valid heights depending on context (`32` Small, `50` Large, `36` Toolbar). |
| `layout.json :: ios.toolbar` | `height: 44, itemGlassGroupHeight: 44` | iOS 27 `Toolbars`: `_Buttons - 44pt` (`5432:23124`) and `_Buttons - 48pt` (`5565:35662`); `Toolbar - Top - iPad` (`5573:24144`) = `54`. | Multiple toolbar heights (`44pt` vs `48pt` glass groups). |
| `layout.json :: ios.tabBar` | `height: 62, sideInset: 20` | iOS 27 `Tab Bars` (`10508:1528` Glass `h=62` confirmed; `10508:1526` 5-tab `pad=[16,25,25,25]` -> button group inset `25`, glass edge inset `21`; 3-tab centered `pad=68`). | `height: 62` confirmed, but `sideInset` varies by tab count & glass vs inner buttons; `itemIconSize` not directly measured. |
| `layout.json :: ios.listRow` | `minHeight: 52, subtitleRow: 64, leadingInset: 16, iconSize: 29` | iOS 27 `Lists`: `Row Regular` (`550:50627`) = `52`, `padH=16` (confirmed); `Row Tall` (`550:50515`) = `68`; `_Images/Regular Rounded` (`24:56947`) = `30×30`. | `minHeightCompact` & `separatorLeadingInsetWithIcon` not directly measured on outer component. |
| `layout.json :: ios.pageControl` | `dot: 8, gap: 9` | iOS 27 `Page Controls` (`10520:3259` `dot=8` confirmed); `Toolbars :: _Toolbar page control` (`5704:38676`) has `gap=8`. | Standalone `Page Control` (`10520:3447`) has no auto-layout `gap`; only toolbar variant shows `gap=8`. |
| `layout.json :: ios.safeArea` | `topDynamicIsland: 62, bottomHomeIndicator: 34, topNotch: 47, topSE: 20` | iOS 27 `Status Bar` (`12961:29590`) = `62` (confirmed); `Home Indicator` (`106:60032`) = `34` (confirmed). | Legacy notch/SE/landscape values are not in iOS 27 kit. |
| `layout.json :: macos` *(parent group)* | `titlebarHeight: 32, toolbarHeight: 52, toolbarHeightCompact: 38, table.rowHeight: 24, table.headerHeight: 28` | macOS 27 `Sidebars` (`4358:9373` `h=52`), `Windows` (`4365:31705` Toolbar `h=44`), `Lists and Tables` (`4356:13469` Header `28` confirmed, `4356:11774` Table Row `20`). | Mix of confirmed (`52`, `28`), divergent (`44` vs `38`, `20` vs `24`), and unmeasured (`windowMinimum`, `inspector`, `settingsWindow`). |
| `layout.json :: macos.trafficLights` | `diameter: 14, gap: 9, leadingInset: 16, centerYFromTop: 26` | macOS 27 `Windows` (`177:9888`, `4365:36385`): `diameter=14`, `gap=9` (confirmed); `Sidebars` (`4358:9373` Default `padL=19`, `4358:9902` Compact `padL=12`, `centerY=26`). | `leadingInset` differs by toolbar style (`19` Default vs `12` Compact). |
| `layout.json :: macos.sidebar` | `minWidth: 180, defaultWidth: 220, maxWidth: 320, rowHeight: 32` | macOS 27 `Sidebars`: Medium item (`4376:58819`) = `32` (confirmed), Small = `24`, Large = `36`; Composed Large (`657:3895`) = `240`. | Min/max resize bounds are runtime behavior, not static Figma frame properties. |
| `shape.json :: radiusIOS` | `sheetFloating: 38, alert: 34, popover: 26, menu: 26, listSectionInsetGrouped: 26, card: 22, ...` | iOS 27 `Sheets` (`10525:1633` `cr=[38,38,0,0]` confirmed), `Buttons`/`Toggles`/`Segmented`/`TabBar` capsule confirmed; `Alert`/`Popover`/`Menu` outer components delegate radius to inner background layers. | Only `sheetFloating: 38` and capsule controls directly confirmed on outer component nodes. |
| `elevation.json :: levels.knob` | Multi-layer shadow + 0.5px rim | macOS 27 `Toggles` (`I478:1094;475:568;4348:11314`) = `0 3px 36px rgba(0,0,0,0.05)` (matches Sketch `$kitReference`); iOS 27 `Sliders` (`5437:1568`) = `0 6px 13px @0.12, 0 0.5px 4px @0.12`. | Single toggle drop-shadow looks flat on Web without Apple's blend-mode rim layers (verified visually in Phase 3b-lite). Kept in `$kitReference`. |
| `elevation.json :: levels.popover` | `0 8px 32px @0.16` light / `@0.5` dark | iOS 27 `Popovers` (`61:65449`) = `0 10px 100px rgba(0,0,0,0.3)`; macOS `Utility Panel` (`4374:54812`) = `0 5px 20px rgba(0,0,0,0.3)`. | Platform/component divergence; kept in `$kitReference` (iOS Figma value appended). |
| `elevation.json :: levels.sheet` | `0 -10px 40px @0.12` light / `@0.5` dark | iOS 27 `Sheets` (`10525:1647`) = `0 15px 75px @0.18`; macOS 27 `Sheets` (`121:11423`/`4358:15436`) = `0 18px 54px @0.3/@0.57, 0 0 1px @0.8`. | iOS floating bottom-sheet vs macOS attached modal sheet use different shadow geometries. |

### 3.3 Not in Figma (`not-in-figma` — 56 Entries, Remain `estimated`)

Static Figma UI kits do not contain runtime physics, audio/haptics, GPU budgets, color-fallback heuristics, or non-Latin typography expansion rules. All of these remain `$class: "estimated"`:
- **`color.json` (11 entries):** `macOSSurfaces.{bg2, bg3, bgGrouped, bgGrouped2, bgGrouped3, separatorOpaque}`, `selection`, `selection.unemphasizedSelectedBackground`, `dimming.sheetScrim`, `iosFieldBorder`, `highContrastLabels` *(not part of geometry batch; color variables were already extracted from Sketch kits in Phase 1/3b-0)*.
- **`elevation.json` (2 entries):** `levels.raised`, `levels.toast` *(no dedicated cross-platform toast/raised token in Apple kits)*.
- **`feedback.json` (2 entries):** `webHaptics`, `sounds` *(runtime vibration & WAV synthesis)*.
- **`icons.json` (1 entry):** `weightToLucideStroke` *(Web Lucide stroke mapping)*.
- **`layout.json` (4 entries):** `spacing`, `ios.layoutMargins`, `ios.listSection`, `zIndex` *(abstract 4pt grid / web stacking order)*.
- **`materials.json` (7 entries):** `liquidGlass.{engine, pressBehavior, tuned, intensityCurve, perfBudget}`, `standardMaterials.{ios.blurPx, macos.blurPx}` *(Apple Figma Glass Effect uses layered inner shadows, not CSS `backdrop-filter` blur sigmas)*.
- **`motion.json` (26 entries):** all `springs.*` (7), `transitions` + `transitions.*` (16), `press`, `hover`, `symbolEffects` *(runtime spring physics & interaction timings)*.
- **`typography.json` (3 entries):** `fallbackCompensation`, `nonLatin.banglaLineHeightScale`, `nonLatin.banglaExpansionPercent` *(Web fallback & Bangla heuristics)*.

---

## 4. Summary Count

- **Total entries audited:** **79** (`tokens/ESTIMATES.md`) + **1** (`shape.json :: continuousCorner`, previously `inferred`) = **80**
- **Promoted to `$class: "measured"` (Step 4):** **9** full token groups (`continuousCorner`, `ios.toggle`, `ios.slider`, `ios.stepper`, `ios.textField`, `ios.searchField`, `ios.alert`, `ios.sheet`, `macos.controlSizes`, `macos.menu` = **10** total, of which **9** were in `ESTIMATES.md` + **1** `continuousCorner` from `inferred`) + **5** clear subfields updated inside `shape.json :: radiusMacOS` (`window: 12->16`, `sheet: 12->16`, `alert: 16->10`, `popover: 16->10`, `menuItemHighlight: 6->8`).
- **Ambiguous (kept `estimated`):** **14** entries (`ios.button`, `ios.segmentedControl`, `ios.toolbar`, `ios.tabBar`, `ios.listRow`, `ios.pageControl`, `ios.safeArea`, `macos`, `macos.trafficLights`, `macos.sidebar`, `radiusIOS`, `radiusMacOS` outer group, `levels.knob`, `levels.popover`, `levels.sheet`).
- **Not in Figma (kept `estimated`):** **56** entries.

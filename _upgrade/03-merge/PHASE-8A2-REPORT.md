# Phase 8A-2 Report — Deep ForgeKit Corrections, Visible-Surface Radius, Triangulation & Blur Calibration

**Date:** 2026-11-27  
**Workspace:** `D:\Claude-Plugins\cupertino-forge`  
**Branch:** `main` (local commit only; **not pushed**)  
**Token Edits:** **0** (`git diff --name-only tokens/` is empty; Step B has NOT started)

---

## 1. Visible-Surface Radius Rule & Reversed Verdicts (`_upgrade/03-merge/RADIUS-CHAIN-CHECK.md`)

Applied the strict **Visible Container Rule (`দৃশ্যমান পাত্র`)**: a radius source must have visible `fills` or `GLASS`/`BACKGROUND_BLUR`/`DROP_SHADOW`/`INNER_SHADOW` effects, be the outermost main surface, and have `cr > 0`. Frames with `fills=[]`, `effects=[]`, `clipsContent=False` are `container-only` and disqualified.

### Reversed / Contradicted Verdicts vs Phase 3c & Phase 8A:
| Token | Previous Verdict | New Visible-Surface Verdict | Proof (Visible Node ID & Layer) |
|---|---|---|---|
| `radiusMacOS.alert` | `10` (Phase 3c) / `outer-confirmed` (8A) | **REVERSED → `34pt`** | `121:11254` (`cr=10`) is `container-only` (`fills=[]`, `effects=[]`, `clips=False`); visible `Fill + Shadow` & `Glass Effect` (`I494:3080;4311:12662`) has **`cr=34, cs=0.6, clips=True`** |
| `radiusMacOS.popover` | `10` (Phase 3c) / `outer-confirmed` (8A) | **REVERSED → `20pt`** | `4336:13305` (`cr=10`) is `container-only`; visible `Body` (`I4336:13195;110:856`) has **`cr=20, BACKGROUND_BLUR + shadows`** |
| `radiusIOS.popover` | `26` (estimate) | **CONTRADICTED → `38pt`** | `Popovers-(iPad-Only)` `513:95247 Background` (`200×200`, `clips=True` over `Thick` blur) has **`cr=38`** (`5433:21608` `cr=13` is just the arrow) |
| `radiusIOS.menu` | `26` (estimate) | **CONTRADICTED → `34pt`** | `Menu` `I5908:6372;10411:18670 Fill + Shadow` & `Glass Effect` has **`cr=34`** |
| `radiusIOS.contextMenuPreview` | `22` (estimate) | **CONTRADICTED → `30pt`** | `Context-Menu` visible inner surface has **`cr=30`** |
| `radiusIOS.textFieldRounded` | `12` (estimate) | **CONTRADICTED → `26pt`** | `_Text-Field-Background` (`5469:8386` `160×52`) & `Text-Field-2` (`12616:832`) use **`cr=26`** (full capsule for `52pt` height) |
| `ios.textField.height` | `ambiguous` (8A) | **REVERSED → `confirmed (52pt)`** | Clean filter (excluding `Context-Menu`/`Button-*`): BOTH form-row `Text-Field` (`553:23061` `402×52`) AND standalone `_Text-Field-Background` (`5469:8386` `160×52`) are **`52pt`**; all `44pt` narrow fields are Search Fields (`_Search-44pt` `190×44`) |
| `radiusMacOS.window`, `sheet`, `menu`, `menuItemHighlight` | `16`, `16`, `12`, `8` | **CONFIRMED** | Outer/visible surfaces confirmed (`Window` `585:3372` `16`, `Sheet` `121:11423` `16`, `Menu-Background` `4353:2522` `12`, `Menu-Items` `685:23692 BG` `8`) |
| `radiusIOS.alert`, `actionSheet`, `sheetFloating` | `34`, `34`, `38` | **CONFIRMED** | `Alert` `34`, `Action-Sheet` `34`, `Sheet-iPhone` Medium (`I10525:1636;10411:18581`) `rcr=[38,38,58,58]` (`38pt` top, `58pt` floating bottom; `Overlay` `cr=30` is dimming scrim) |

---

## 2. Triangulation of 14 Typography + 8 Color Mismatches & Updated ForgeKit Reliability Verdict

### (a) All 14 Typography Mismatches (Triangulated vs Official Apple HIG `_upgrade/02-research/json/typography.json`)
- **Result: 14 / 14 Official Apple HIG matches OUR `tokens/typography.json` — Apple's Figma kit diverges on all 14!**
  - **12 leading (`lineHeight`) deltas (off by 1–2 pt, 8 in `Small` mode):** `largeTitle/Small` (HIG/Ours `39` vs FK `38`), `title1/Small` (`32` vs `31`), `title1/xLarge` (`37` vs `36`), `title2/xSmall` (`24` vs `23`), `title2/Small` (`25` vs `23`), `title2/Medium` (`26` vs `28`), `title3/Small` (`23` vs `22`), `headline/Small` (`20` vs `19`), `body/Small` (`20` vs `19`), `callout/Small` (`19` vs `18`), `callout/xxLarge` (`25` vs `24`), `subheadline/Small` (`18` vs `16`).
  - **2 genuine size+leading bugs in Apple's Figma kit:** `title2/AX2` (HIG/Ours `39/47` vs FK `43/51`) and `title3/AX4` (HIG/Ours `49/58` vs FK `43/51`) — Apple's Figma kit duplicated `43/51` into both!
- **Action:** Keep `tokens/typography.json` **100% unchanged** (Official HIG beats Figma kit typos).

### (b) All 8 Color Mismatches (3-Way Comparison: Ours vs ForgeKit vs Sketch Kit `tokens/source/*`)
- **6 naming mismatches (100% VALUE MATCH once en-dash `–` is matched!):**
  - `backgroundIOS.groupedPrimary/Secondary/Tertiary` (Light & Dark) use en-dash `'Backgrounds – Grouped/Primary|Secondary|Tertiary'` in Figma -> `#F2F2F7/#000000`, `#FFFFFF/#1C1C1E`, `#F2F2F7/#2C2C2E` — **exact match (true color match rate = 54 / 56 = 96.4%)!**
- **2 genuine kit-to-kit value differences (NOT a mode-mapping bug):**
  1. `labelIOS.secondary.dark`: Ours/Sketch = `#EBEBF5@0.60` vs Apple Figma `Dark/Labels/Secondary` (`13207:204`, BOTH `Default` and `Increased Contrast` modes) = **`#EBEBF5@0.70`**.
  2. `separatorIOS.nonOpaque.dark`: Ours/Sketch = `#FFFFFF@0.12` (`tokens/source/apple-ios-27-ui-kit.tokens.json`) vs Apple Figma `Dark/Separators/Non-opaque` (`13207:239`, BOTH modes) = **`#FFFFFF@0.17`**.
- **Action:** Keep Sketch-kit values as primary in Step B and document the Figma kit dark-alpha bump as `$kitConflict` (`needs-device-verification`).

### (c) Updated ForgeKit Reliability Verdict
- **Revised Verdict: High extraction accuracy (mechanical), Medium semantic authority (requires visible-surface filtering + HIG tie-breaking).**
  - ForgeKit v2.0 faithfully extracted Apple's Figma JSON with **0 parse errors**, **96.4% color agreement** (once en-dash names are normalized), and **89.4% Dynamic Type agreement** (all 14 diffs are Apple Figma kit quirks, not ForgeKit bugs).
  - **HOWEVER**, blindly trusting top-level `variants.json :: cornerRadius` without applying the Visible-Surface Rule caused 2 critical false readings (`macOS Alert 10`, `macOS Popover 10`). Therefore, ForgeKit must ALWAYS be queried via visible-surface `layout.json` traversal and cross-checked against Official HIG before writing tokens.

---

## 3. Rewritten `qa/ESTIMATE-RESOLUTION-3.md` Totals (70 `ESTIMATES.md` Entries)

| Verdict | Count | Details |
|---|---|---|
| **`confirmed`** | **2** | `color.json :: dimming.sheetScrim` (`Overlays/Default` `#000@0.2` / `#000@0.48`), `color.json :: selection` (parent) |
| **`contradicted`** | **1** | `color.json :: selection.unemphasizedSelectedBackground` (`#000000@0.14` / `#FFFFFF@0.18`, `VariableID:4356:10110`) — *plus 6 contradicted subfields inside `radiusMacOS` (2) and `radiusIOS` (4)* |
| **`ambiguous`** | **16** | 15 geometry/radius/shadow entries (each with full variant table & 3-part Step B plan) + `color.json :: highContrastLabels` |
| **`not-in-figma`** | **51** | 7 `color.json` + 2 `elevation.json` + 2 `feedback.json` + 1 `icons.json` + 4 `layout.json` + 7 `materials.json` + 25 `motion.json` + 3 `typography.json` (each with specific verified reason, zero boilerplate) |
| **Total** | **70** | `2 + 1 + 16 + 51 = 70` (exact match with `tokens/ESTIMATES.md`) |

---

## 4. Top Liquid Glass Discoveries & Blur Calibration (`qa/LIQUID-GLASS-FIGMA.md`)

1. **`Sample Nodes: []` fixed:** Resolved `usedIn` across all **8** iOS `GLASS` + **7** macOS `GLASS` + **54/24** `BACKGROUND_BLUR` + **3/1** `LAYER_BLUR` derived effects.
2. **Official iOS `Kit` Liquid Glass FLOAT variables (`5565:22724`):** `Frost - Regular = 6`, `Frost - Medium/Large = 16`, `Refraction = 70`, `Depth = 30`, `Dispersion = 20`, `Splay = 20`, `Light Angle = 0`, `Opacity = 25`.
3. **Mode collections decoded:** iOS `Liquid Glass (Bright/Dim)` has **`0` variables** (empty placeholder); macOS `Context (Content Area/Over-glass)` has **`1` STRING switch variable** (`Mode`), not color/blur math.
4. **Figma `GlassEffect.radius` officially verified:** Figma Plugin/REST API defines `radius` as **frost (blur/softening) radius**.
5. **Blur-Scale Calibration (`calibration: derived (Figma Dev Mode CSS export convention radius/2); not verified against Apple OS` — no official Figma docs URL found):**
   - Headless Chromium (`_local/forgekit/scripts/a8a2_blur_calibrate.py`) measures CSS `blur()` linearity (`blur(20px)` = `50px` 10%→90% transition width, $\sigma = 19.51\text{px}$, vs `blur(10px)` = `24px`, $\sigma = 9.36\text{px}$); this verifies CSS linearity only, NOT Figma's internal renderer.
   - `refraction (0.7)` and `dispersion (0.2)` are **impossible** in portable CSS/Flutter; `GLASS.radius/2` (`3px`/`8px`) is lighter than our tuned CSS blur (`8–20px`) because Web lacks optical refraction.

---

## 5. Proposed Step B Token Change List (NOT Applied Yet — Awaiting `"ধাপ B শুরু কর"`)

| Token Path | Current Value | Proposed Step B Value | Kit Node / Variable ID | Proposed `$class` | `needs-device-verification`? |
|---|---|---|---|---|---|
| `shape.json :: radiusMacOS.alert` | `10` *(Phase 3c bug)* | **`34`** | `macos27` `Alert` `I494:3080;4311:12662` (`Fill + Shadow`) | `measured` (subfield) | **YES** (kit frame, unverified on macOS 27 HW) |
| `shape.json :: radiusMacOS.popover` | `10` *(Phase 3c bug)* | **`20`** | `macos27` `Popover-2` `I4336:13195;110:856` (`Body`) | `measured` (subfield) | **YES** (kit frame, unverified on macOS 27 HW) |
| `shape.json :: radiusMacOS.menu` | `12` (`estimated`) | **`12`** (confirm) | `macos27` `Menu-Background` `4353:2522` | `measured` (subfield) | **YES** |
| `shape.json :: radiusIOS.popover` | `26` (`estimated`) | **`38`** | `ios27` `Popovers-(iPad-Only)` `513:95247` (`Background`) | `measured` (subfield) | **YES** (kit frame, unverified on iPadOS 27 HW) |
| `shape.json :: radiusIOS.menu` | `26` (`estimated`) | **`34`** | `ios27` `Menu` `I5908:6372;10411:18670` (`Fill + Shadow`) | `measured` (subfield) | **YES** |
| `shape.json :: radiusIOS.contextMenuPreview` | `22` (`estimated`) | **`30`** | `ios27` `Context-Menu` visible surface | `measured` (subfield) | **YES** |
| `shape.json :: radiusIOS.textFieldRounded` | `12` (`estimated`) | **`26`** | `ios27` `_Text-Field-Background` `5469:8386` / `Text-Field-2` `12616:832` | `measured` (subfield) | **YES** |
| `color.json :: dimming.sheetScrim` | `#000@0.2 / #000@0.48` (`estimated`) | **`#000@0.2 / #000@0.48`** (promote) | `ios27` `VariableID:13207:178` & `13207:240` (`Overlays/Default`) | **`measured`** | No (exact variable match) |
| `color.json :: selection.unemphasizedSelectedBackground` | `#DCDCDC / #464646` (`estimated`) | **`#000000@0.14 / #FFFFFF@0.18`** | `macos27` `VariableID:4356:10110` (`BG - Selected + Inactive`) | **`measured`** | No (exact variable match; composites to `#DBDBDB`/`#464646`) |
| `color.json :: selection` | `estimated` | promote parent | `macos27` `4356:10117`, `4356:10110`, `207:14858` | **`measured`** | No |
| `color.json :: labelIOS.secondary.dark` & `separatorIOS.nonOpaque.dark` | `#EBEBF5@0.6` / `#FFFFFF@0.12` | Keep primary; add `$kitConflict` (`@0.7` / `@0.17`) | `ios27` `13207:204`, `13207:239` vs Sketch kit | `measured` + `$kitConflict` | **YES** (Sketch vs Figma conflict) |
| `elevation.json :: levels.{knob,popover,sheet}` | `estimated` | Keep primary; enrich `$kitReference` with macOS/iOS Figma stacks | `4336:13262`, `I10525:1636;10411:18581`, `121:11423`, `4358:15436` | `estimated` + `$kitReference` | **YES** |
| `shape.json :: radiusMacOS.{window,sheet,menuItemHighlight}` | `16`, `16`, `8` | Keep unchanged (`outer/visible-confirmed`) | `585:3372`, `121:11423`, `685:23692` | `measured` (subfield) | **YES** |

*(All 51 `not-in-figma` and 15 remaining ambiguous parent groups stay `$class: "estimated"`; `tokens/typography.json` stays 100% unchanged per Official Apple HIG.)*

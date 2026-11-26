# Phase 8A Report — ForgeKit Audit, Cross-Validation & Liquid Glass Extraction

**Date:** 2026-11-27  
**Workspace:** `D:\Claude-Plugins\cupertino-forge`  
**Branch:** `main` (local commit only; **not pushed**)  
**Token Edits:** **0** (`git diff --name-only tokens/` is empty; Step B deferred until `"ধাপ B শুরু কর"`)

---

## 1. A1 Intake Summary (`_upgrade/03-merge/FORGEKIT-INTAKE.md`)
- **`ios27` (`apple-ui-kit-ios-and-ipados-27-iPadOS-27`):** `schemaVersion 2.0.0`, `pluginVersion 0.1.0`, `1848` files on disk, `334` component folders (`1` skipped: `Examples/Sidebar`), `0` JSON parse errors, `0` zero-byte files, `28` `"variantProperties fallback used"` warnings.
- **`macos27` (`apple-ui-kit-macos-27-macOS-27`):** `schemaVersion 2.0.0`, `pluginVersion 0.1.0`, `1102` files on disk, `184` component folders (`0` skipped), `0` JSON parse errors, `0` zero-byte files, `96` `"variantProperties fallback used"` warnings.

## 2. A2 Cross-Validation Match Rates
- **Colors (`tokens/variables.json` vs `tokens/color.json`):** **48 / 56** matched (`85.7%`, `±1/255`), `2` value diffs, `6` name mismatches.
- **Typography (`Dynamic Type` 132 cells vs `tokens/typography.json`):** **118 / 132** matched (`89.4%`).
- **Scale Sanity (1x pt):** `Status-Bar-iPhone` = `402×62`, `Home-Indicator` = `402×34`, `Window-Controls-Standard` = `14×14` with `gap=9` (`68×14` total).
- **ForgeKit Reliability Verdict:** High reliability for 1x pt geometry, variables, Dynamic Type, and layer-derived effects; caveat on `variantProperties fallback used` warnings (verify in `layout.json`), `fileKey: None`, and `prototypeReactions: 0`.

## 3. A3 Radius Chain Verdicts (`_upgrade/03-merge/RADIUS-CHAIN-CHECK.md`)
- **macOS (5 `radiusMacOS` targets):**
  - `Window` (`585:3372`, `4363:18479`): **outer-confirmed** (`cr=16, cs=0.6`)
  - `Sheet` (`121:11423`): **outer-confirmed** (`cr=16, cs=0.6`)
  - `Alert` (`121:11254`): **outer-confirmed** (`cr=10, cs=0.6`)
  - `Popover` (`4336:13305`): **outer-confirmed** (`cr=10, cs=0.6`)
  - `Menu item highlight` (`685:23691`): **inner-layer-only** (`cr=8` hover highlight inside `160×24` menu row)
- **iOS (4 targets):**
  - `ios.textField` (`553:23061`): **ambiguous** (`402×52` full-screen-width form/list row)
  - `ios.alert` (`65:57149`, `61:67601`): **outer-confirmed** (`pad=14`)
  - `ios.sheet` (`5827:57545`, `10525:1687`, `10525:1635`): **inner-layer-only** (grabber `60×4`, `topInset=6`) + **outer-confirmed** (`medium` inset `6`)
  - `ios.stepper` (`5415:17699`): **outer-confirmed** (`92×32`)

## 4. A4 Estimate Resolution Round 3 (`qa/ESTIMATE-RESOLUTION-3.md`)
- **Phase 3c 10 provisional groups:** **9 confirmed**, **1 ambiguous** (`ios.textField` `402×52` full-width row).
- **70 `ESTIMATES.md` entries:** `confirmed`: **0**, `contradicted`: **0**, `ambiguous`: **15**, `not-in-figma`: **55**.

## 5. A5 Top 5 Liquid Glass Discoveries (`qa/LIQUID-GLASS-FIGMA.md`)
1. `tokens/effects.json` captures **8** `GLASS` instances + **54** `BACKGROUND_BLUR` instances in `ios27`, and **7** `GLASS` instances + **24** `BACKGROUND_BLUR` instances in `macos27`.
2. Figma `GLASS` carries `lightIntensity`, `lightAngle`, `refraction`, `depth`, `dispersion`, and `radius` — of which `refraction` and `dispersion` are **impossible** to reproduce in portable CSS `backdrop-filter` or Flutter `BackdropFilter` (Chromium-only `<feDisplacementMap>` is an approximation).
3. `overlayFills` and `BACKGROUND_BLUR` are separate from `GLASS` and map to CSS `color-mix` + `blur()` (**approximation**).
4. Native `NSGlassEffectView` (Tauri macOS Direct) is the only target with native optical parity.
5. No `tokens/materials.json` values were modified in Step A.

## 6. A6 Modes, Contrast & Motion
- **iOS Collections:** `Color Scheme` (`Light`, `Dark`), `Icons` (`Light`, `Dark`, `Clear Light`), `Dimensions` (`iPhone`, `iPad`, `iPhone Duo ...`), `Text Leading` (`Default`, `Loose`, `Tight`), `Dynamic Type` (`xSmall`..`xxxLarge`, `AX1`..`AX5`), `Color Contrast` (`Default`, `Increased Contrast`), `Liquid Glass` (`Bright`, `Dim`).
- **macOS Collections:** `Colors` (`Light`, `Dark`, `IC - Light`, `IC - Dark`), `Sizes` (`Mini`, `Small`, `Medium`, `Large`, `XL`), `Context` (`Content Area`, `Over-glass`).
- **Increased Contrast:** `2` `$hcClass: "inferred"` groups (`system`, `grayIOS`) identified in `tokens/color.json` for Step B verification.
- **`motion.json`:** Confirmed `missingFromFigma: true`, `reactionsCount: 0`, `transitions: []` in both `ios27` and `macos27`.

## 7. A7 Reference Map (`qa/reference-map.json`)
- Mapped **10** components (`Button`, `Toggle`, `Slider`, `Segmented Control`, `Tab Bar`, `Navigation / Toolbar`, `List row`, `Alert`, `Sheet`, `Menu`) to `skills/apple-web/assets/components/apple/*.tsx` and `tests/harness/web/src/App.tsx`, with `clamped_below_2x: []` and **0 PNGs committed**.

## 8. `NOT RUN` List
- **Step B token updates, `build-tokens.mjs` regeneration, and full Web/Flutter/Tauri runtime harnesses:** **`NOT RUN`** (intentionally deferred until user approves `"ধাপ B শুরু কর"`).

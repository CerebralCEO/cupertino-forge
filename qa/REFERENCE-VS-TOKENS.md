# Reference vs Tokens — Circularity Audit

> Comparing a token derived directly from the Apple Sketch kit back against that same Sketch kit is circular and meaningless. This audit separates **`derived-from-kit (not independent)`** token groups from truly **independent** groups (`official-hig` and `independent-estimate`) across all 9 plugin `tokens/*.json` files.

## Summary Counts (Top-Level Token Groups Across 9 `tokens/*.json` Files)

- **Total top-level token groups:** `61`
- **`derived-from-kit (not independent)` (excluded from kit-match count):** **`22`**
- **Truly independent groups (`counted`):** **`39`** (`16` `official-hig` + `23` `independent-estimate`)
- **Independent groups cross-checked against Sketch kit:** Of the independent groups, `typography.json` (`iosDynamicType` & `macosTextStyles`) independently matches Sketch kit text sizes/line-heights except the 3 known macOS kit-vs-HIG conflicts (`headline`, `caption1`, `caption2` in `macosTextStyles.$kitConflict`); and in `ESTIMATE-RESOLUTION.md`, `3 / 80` independent estimates (`elevation.levels.knob`, `elevation.levels.popover`, `shape.borders`) have direct kit counterparts (`1 confirmed`, `2 contradicted`, `77 not-in-kit`).

## Group-by-Group Classification

| Token File | Group | `$class` | Independence Status | Counted in Kit Comparison? | Source Summary |
|---|---|---|---|---|---|
| `color.json` | `system` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 & macOS 27 Sketch Kits (HC from HIG swatches) |
| `color.json` | `systemVibrantMacOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `grayIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit (HC from HIG swatches) |
| `color.json` | `grayMacOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `labelIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `labelVibrantIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `labelOnGlassIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `labelMacOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `labelVibrantMacOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `fillIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `fillVibrantIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `fillMacOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `fillVibrantMacOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `backgroundIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `separatorIOS` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit |
| `color.json` | `macOSSurfaces` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit (separator.dark & grouped surfaces estimated) |
| `color.json` | `macOSControlFills` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit |
| `color.json` | `focusRing` | `measured` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit (Global.Focus Ring: 3.5px@0.25 outer, 1px@0.15 inner) |
| `color.json` | `selection` | `estimated` | **derived-from-kit (not independent)** | No (circular) | Apple macOS 27 Sketch Kit + estimated unemphasized background |
| `color.json` | `dimming` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Materials (clear glass dimming) + estimated sheet scrim |
| `color.json` | `accent` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG System Blue & Accessibility 4.5:1 / 3:1 |
| `color.json` | `iosFieldBorder` | `estimated` | **independent-estimate** | Yes (independent) | estimated |
| `color.json` | `highContrastLabels` | `estimated` | **independent-estimate** | Yes (independent) | estimated |
| `elevation.json` | `levels` | `measured` | **derived-from-kit (not independent)** | No (circular) | macOS 27 Sketch Kit + estimated cross-platform levels |
| `feedback.json` | `events` | `inferred` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Playing haptics mapping + estimated Android/Web pairings |
| `feedback.json` | `webHaptics` | `estimated` | **independent-estimate** | Yes (independent) | estimated Web Vibration API + iOS Safari switch workaround |
| `feedback.json` | `sounds` | `estimated` | **independent-estimate** | Yes (independent) | estimated original 44.1kHz WAV synthesis (scripts/synth-sounds.py) |
| `icons.json` | `weightToLucideStroke` | `estimated` | **independent-estimate** | Yes (independent) | estimated |
| `icons.json` | `map` | `(mixed/nested)` | **independent-estimate** | Yes (independent) |                                                                       |
| `layout.json` | `spacing` | `estimated` | **independent-estimate** | Yes (independent) | estimated 4pt rhythm |
| `layout.json` | `hitTarget` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Accessibility |
| `layout.json` | `ios` | `(mixed/nested)` | **independent-estimate** | Yes (independent) | estimated (matches 16pt widget HIG on compact) estimated (primary 62pt preserved per Rule  |
| `layout.json` | `macos` | `estimated` | **independent-estimate** | Yes (independent) | estimated (menuBar 24pt & splitView divider 1pt official HIG) |
| `layout.json` | `breakpoints` | `inferred` | **independent-estimate** | Yes (independent) | inferred size-class breakpoints (768pt regular) + estimated 1180pt desktop |
| `layout.json` | `zIndex` | `estimated` | **independent-estimate** | Yes (independent) | estimated |
| `materials.json` | `liquidGlass` | `(mixed/nested)` | **derived-from-kit (not independent)** | No (circular) | estimated Apple iOS 27 Sketch Kit Apple macOS 27 Sketch Kit HIG Motion qualitative + estim |
| `materials.json` | `standardMaterials` | `(mixed/nested)` | **derived-from-kit (not independent)** | No (circular) | Apple iOS 27 Sketch Kit (blurPx estimated) Apple macOS 27 Sketch Kit (blurPx estimated) |
| `motion.json` | `springModel` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | WWDC23 Animate with springs + SwiftUI Spring |
| `motion.json` | `springs` | `(mixed/nested)` | **official-hig (independent of Sketch kit)** | Yes (independent) | SwiftUI Spring preset SwiftUI Spring preset SwiftUI Spring preset SwiftUI Spring preset es |
| `motion.json` | `cssFallbackEasing` | `(mixed/nested)` | **independent-estimate** | Yes (independent) | (see nested tokens) |
| `motion.json` | `transitions` | `estimated` | **independent-estimate** | Yes (independent) | estimated (navigationPush 30% outgoing parallax inferred from UIKit) |
| `motion.json` | `press` | `estimated` | **independent-estimate** | Yes (independent) | estimated (HIG Motion touch vs pointer qualitative) |
| `motion.json` | `hover` | `estimated` | **independent-estimate** | Yes (independent) | estimated |
| `motion.json` | `scroll` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | UIScrollView.DecelerationRate official; rubberBand c=0.55 inferred |
| `motion.json` | `reducedMotion` | `(mixed/nested)` | **independent-estimate** | Yes (independent) | (see nested tokens) |
| `motion.json` | `symbolEffects` | `estimated` | **independent-estimate** | Yes (independent) | estimated CSS/SVG timing approximations of SF Symbols animations |
| `shape.json` | `continuousCorner` | `inferred` | **independent-estimate** | Yes (independent) | inferred smoothing 0.6 / superellipse n~5; CSS corner-shape official baseline |
| `shape.json` | `shapes` | `(mixed/nested)` | **independent-estimate** | Yes (independent) |    |
| `shape.json` | `concentric` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple SwiftUI ConcentricRectangle / UICornerConfiguration |
| `shape.json` | `radiusIOS` | `estimated` | **independent-estimate** | Yes (independent) | estimated (primary deviceDisplay preserved at 55/30 per Rule 1; community 62/18 in $alt) |
| `shape.json` | `radiusMacOS` | `estimated` | **independent-estimate** | Yes (independent) | estimated (macOS 27 uniform window 12pt press report; unverified on device) |
| `shape.json` | `borders` | `estimated` | **independent-estimate** | Yes (independent) | estimated hairline 0.5px |
| `typography.json` | `fontStacks` | `platform-dependent` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple System Fonts + OFL cross-platform stacks |
| `typography.json` | `fallbackCompensation` | `estimated` | **independent-estimate** | Yes (independent) | estimated Inter width compensation |
| `typography.json` | `iosDynamicType` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Typography Dynamic Type tables (verified 0 diffs across 132 cells) |
| `typography.json` | `macosTextStyles` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Typography macOS built-in text styles |
| `typography.json` | `trackingTables` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Typography tracking tables (verified 0 diffs across 64+64+64 rows) |
| `typography.json` | `minimumSizes` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Accessibility |
| `typography.json` | `defaultSizes` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple HIG Accessibility |
| `typography.json` | `weights` | `official` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple SF Pro weights |
| `typography.json` | `nonLatin` | `inferred` | **official-hig (independent of Sketch kit)** | Yes (independent) | Apple System Fonts + HIG RTL + W3C ALReq |

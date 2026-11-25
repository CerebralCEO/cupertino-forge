# Token Estimates, Community Alternates & Pending Verification

<!-- Generated automatically by `node scripts/build-tokens.mjs --write-estimates tokens/ESTIMATES.md`. Do not hand-edit. -->

These token entries carry `$class: "estimated"` (not published numerically by Apple HIG or Sketch token exports), `$class: "inferred/community"` (community SPI benchmarks kept out of primary official/kit tokens per merge Rule 1), or `$status: "needs-device-verification"`. List relevant items in the Compliance Report (`Values marked estimate`).

## 1. Estimated Tokens (70 groups/entries)

| Token File | Path | Sample Value | Class | Source Note |
|---|---|---|---|---|
| `color.json` | `macOSSurfaces.bg2` | `{ light: #F5F5F7, dark: #262626 }` | `estimated` | estimated |
| `color.json` | `macOSSurfaces.bg3` | `{ light: #FFFFFF, dark: #2E2E2E }` | `estimated` | estimated |
| `color.json` | `macOSSurfaces.bgGrouped` | `{ light: #F5F5F7, dark: #1E1E1E }` | `estimated` | estimated |
| `color.json` | `macOSSurfaces.bgGrouped2` | `{ light: #FFFFFF, dark: #262626 }` | `estimated` | estimated |
| `color.json` | `macOSSurfaces.bgGrouped3` | `{ light: #F5F5F7, dark: #2E2E2E }` | `estimated` | estimated |
| `color.json` | `macOSSurfaces.separatorOpaque` | `{ light: #D8D8D8, dark: #3A3A3A }` | `estimated` | estimated |
| `color.json` | `selection` | `{ selectedContentText: [...], unemphasizedSelectedBackground: [...] }` | `estimated` | Apple macOS 27 Sketch Kit + estimated unemphasized background |
| `color.json` | `selection.unemphasizedSelectedBackground` | `{ light: #DCDCDC, dark: #464646 }` | `estimated` | estimate, verify in kit Lists page |
| `color.json` | `dimming.sheetScrim` | `{ light: #000000@0.2, dark: #000000@0.48 }` | `estimated` | estimated |
| `color.json` | `iosFieldBorder` | `{ light: #000000@0, dark: #000000@0 }` | `estimated` | estimated |
| `color.json` | `highContrastLabels` | `{ label2: [...], label3: [...], glassBorder: [...], accentContrast: #FFFFFF }` | `estimated` | estimated |
| `elevation.json` | `levels.knob` | `{ light: 0 3px 8px rgba(0,0,0,0.15), 0 3px 1px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04), dark: 0 3px 8px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.2) }` | `estimated` | estimated |
| `elevation.json` | `levels.raised` | `{ light: 0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06), dark: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.08) }` | `estimated` | estimated |
| `elevation.json` | `levels.popover` | `{ light: 0 8px 32px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.12), dark: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.12) }` | `estimated` | estimated |
| `elevation.json` | `levels.sheet` | `{ light: 0 -1px 0 rgba(0,0,0,0.04), 0 -10px 40px rgba(0,0,0,0.12), dark: 0 -10px 40px rgba(0,0,0,0.5) }` | `estimated` | estimated |
| `elevation.json` | `levels.toast` | `{ light: 0 10px 30px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06), dark: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.1) }` | `estimated` | estimated |
| `feedback.json` | `webHaptics` | `{ vibratePatternsMs: [...], iosSafariSwitchTrick: true }` | `estimated` | estimated Web Vibration API + iOS Safari switch workaround |
| `feedback.json` | `sounds` | `{ masterVolume: 0.35, throttleMs: 40, catalog: [...] }` | `estimated` | estimated original 44.1kHz WAV synthesis (scripts/synth-sounds.py) |
| `icons.json` | `weightToLucideStroke` | `{ ultralight: 1, thin: 1.25, light: 1.5, regular: 1.75, ... }` | `estimated` | estimated |
| `layout.json` | `spacing` | `{ scale: [...], names: [...] }` | `estimated` | estimated 4pt rhythm |
| `layout.json` | `ios.layoutMargins` | `{ compactWidth: 16, regularWidth: 20, iPhoneMax: 20 }` | `estimated` | estimated (matches 16pt widget HIG on compact) |
| `layout.json` | `ios.safeArea` | `{ topDynamicIsland: 62, topNotch: 47, topSE: 20, bottomHomeIndicator: 34, ... }` | `estimated` | estimated (primary 62pt preserved per Rule 1; see $alt for community 59pt iPhone 15/16) |
| `layout.json` | `ios.toolbar` | `{ height: 44, itemGlassGroupHeight: 44, bottomInsetFromSafeArea: 0 }` | `estimated` | estimated |
| `layout.json` | `ios.tabBar` | `{ style: floating capsule of Liquid Glass, separated from screen edges, height: 62, sideInset: 20, bottomGapAboveHomeIndicator: 0, ... }` | `estimated` | estimated |
| `layout.json` | `ios.listRow` | `{ minHeight: 52, minHeightCompact: 44, subtitleRow: 64, leadingInset: 16, ... }` | `estimated` | estimated |
| `layout.json` | `ios.listSection` | `{ insetGroupedSideInset: 16, headerStyle: headline sentence case, footerStyle: footnote secondary label, gapBetweenSections: 20 }` | `estimated` | estimated |
| `layout.json` | `ios.button` | `{ mini: 28, small: 32, medium: 36, large: 50, ... }` | `estimated` | estimated |
| `layout.json` | `ios.segmentedControl` | `{ height: 36, selectedInset: 2, labelStyle: subheadline emphasized when selected }` | `estimated` | estimated |
| `layout.json` | `ios.pageControl` | `{ dot: 8, gap: 9 }` | `estimated` | estimated |
| `layout.json` | `macos` | `{ windowMinimum: [...], titlebarHeight: 32, toolbarHeight: 52, toolbarHeightCompact: 38, ... }` | `estimated` | estimated (menuBar 24pt & splitView divider 1pt official HIG) |
| `layout.json` | `macos.trafficLights` | `{ diameter: 14, gap: 9, leadingInset: 16, centerYFromTop: 26, ... }` | `estimated` | estimate macOS 26 and 27 |
| `layout.json` | `macos.sidebar` | `{ minWidth: 180, defaultWidth: 220, maxWidth: 320, rowHeight: 32, ... }` | `estimated` | estimate; macOS 27 sidebars are edge to edge, not floating |
| `layout.json` | `zIndex` | `{ content: 0, scrollEdge: 10, bars: 20, floatingButton: 30, ... }` | `estimated` | estimated |
| `materials.json` | `liquidGlass.engine` | `{ blurPx: [...], saturate: 1.8, brightnessLight: 1.05, brightnessDark: 0.9, ... }` | `estimated` | estimated |
| `materials.json` | `liquidGlass.pressBehavior` | `{ onTouchDown: glass element scales to 1.08 to 1.12 with a spring (response 0.3, damping 0.7) and its highlight brightens; content below shows a soft glow, onRelease: springs back to 1.0, trackpadOrMouse: subdued: scale 1.02, no glow }` | `estimated` | HIG Motion qualitative + estimated numeric scale |
| `materials.json` | `liquidGlass.tuned` | `{ regular: [...], clear: [...], tinted: [...], large: [...], ... }` | `estimated` | estimated |
| `materials.json` | `liquidGlass.intensityCurve` | `{ min: 0, max: 1, default: 0.5, alphaScaleFormula: 0.7 + 0.6 * intensity, ... }` | `estimated` | estimated unified web/Flutter curve for iOS 27 / macOS 27 Settings intensity slider |
| `materials.json` | `liquidGlass.perfBudget` | `{ maxSimultaneousBackdrop: 6, neverAnimateBlurSigma: true, flutterRequireBackdropGroup: true }` | `estimated` | estimated GPU overdraw budget + Flutter 3.29 BackdropFilter.grouped |
| `materials.json` | `standardMaterials.ios.blurPx` | `{ ultraThin: 20, thin: 24, regular: 30, thick: 30 }` | `estimated` | estimate |
| `materials.json` | `standardMaterials.macos.blurPx` | `{ ultraThin: 20, thin: 24, regular: 30, thick: 30, ... }` | `estimated` | estimate |
| `motion.json` | `springs.interactive` | `{ duration: 0.15, bounce: 0, usage: Finger tracking, press down, drag follow. Must be near instant. }` | `estimated` | estimated |
| `motion.json` | `springs.press` | `{ duration: 0.2, bounce: 0, usage: Press down scale and highlight }` | `estimated` | estimated |
| `motion.json` | `springs.release` | `{ duration: 0.35, bounce: 0.15, usage: Release after press, glass settle }` | `estimated` | estimated |
| `motion.json` | `springs.sheet` | `{ duration: 0.5, bounce: 0, usage: Sheet present and dismiss, detent changes }` | `estimated` | estimated |
| `motion.json` | `springs.push` | `{ duration: 0.5, bounce: 0, usage: Navigation push and pop }` | `estimated` | estimated |
| `motion.json` | `springs.popover` | `{ duration: 0.35, bounce: 0.1, usage: Menus, popovers, context menus scale in from source }` | `estimated` | estimated |
| `motion.json` | `springs.glassMorph` | `{ duration: 0.45, bounce: 0.2, usage: Liquid Glass shapes merging, splitting, tab bar minimize }` | `estimated` | estimated |
| `motion.json` | `transitions` | `{ navigationPush: [...], sheetPresent: [...], sheetDismiss: [...], alertPresent: [...], ... }` | `estimated` | estimated (navigationPush 30% outgoing parallax inferred from UIKit) |
| `motion.json` | `transitions.sheetPresent` | `{ spring: sheet, from: bottom, scrim: fade 0 to scrim alpha in same spring, backgroundScale: underlying content stays at 1.0 on iOS 26+ (no card stack shrink) except fullscreen cover, ... }` | `estimated` | estimated |
| `motion.json` | `transitions.sheetDismiss` | `{ dragToDismiss: true, velocityThresholdPtPerS: 600, distanceThreshold: 40 percent of sheet height, interruptible: true, ... }` | `estimated` | estimated |
| `motion.json` | `transitions.alertPresent` | `{ from: scale 1.08 opacity 0, to: scale 1 opacity 1, spring: popover, interruptible: true, ... }` | `estimated` | estimated |
| `motion.json` | `transitions.alertDismiss` | `{ to: opacity 0, durationMs: 150, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.menuOpen` | `{ from: scale 0.6 from the source anchor opacity 0, to: scale 1, spring: popover, glassMorphFromButton: true, ... }` | `estimated` | estimated |
| `motion.json` | `transitions.menuClose` | `{ to: scale 0.8 opacity 0, durationMs: 180, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.contextMenu` | `{ liftScale: 1.04, blurBackground: 20, spring: popover, interruptible: true, ... }` | `estimated` | estimated |
| `motion.json` | `transitions.tabSwitch` | `{ content: crossfade 150ms, no slide, indicator: glass capsule slides with spring snappy, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.tabBarMinimize` | `{ spring: glassMorph, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.toggle` | `{ knob: spring snappy, knobStretchWhilePressed: 1.25, trackColor: 150ms crossfade, interruptible: true, ... }` | `estimated` | estimated |
| `motion.json` | `transitions.segmentedSelection` | `{ spring: snappy, indicatorStretchWhileDragging: true, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.listRowHighlight` | `{ pressInMs: 0, fadeOutMs: 250, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.fade` | `{ durationMs: 200, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `transitions.toast` | `{ from: top, translateY -20 opacity 0, spring: snappy, interruptible: true, reducedMotion: [...] }` | `estimated` | estimated |
| `motion.json` | `press` | `{ glassButton: [...], solidButton: [...], plainTextButton: [...], listRow: [...], ... }` | `estimated` | estimated (HIG Motion touch vs pointer qualitative) |
| `motion.json` | `hover` | `{ macOSToolbarItem: [...], macOSListRow: no hover background except in sidebars and menus, menuItem: [...], iPadPointer: [...], ... }` | `estimated` | estimated |
| `motion.json` | `symbolEffects` | `{ bounce: scale 1 to 1.2 to 1 with snappy spring, pulse: opacity 1 to 0.5 loop 1s, replace: old symbol scales to 0.6 and fades while new scales from 0.6, 250ms, wiggle: rotate -8 to 8 deg 3 times, ... }` | `estimated` | estimated CSS/SVG timing approximations of SF Symbols animations |
| `shape.json` | `radiusIOS` | `{ deviceDisplay: [...], sheet: device display radius when full height at the bottom edge; 38 when floating at medium detent with 8 inset, alert: 34, actionSheet: 34, ... }` | `estimated` | estimated (primary deviceDisplay preserved at 55/30 per Rule 1; community 62/18 in $alt) |
| `shape.json` | `radiusMacOS` | `{ window: 16, windowNote: Measured 16pt (cornerSmoothing 0.6) across all Window BG and Windows - Composed variants in Apple Figma kit macOS 27 (nodes 585:3372, 4363:18479, 4365:31678)., sheet: 16, alert: 10, ... }` | `estimated` | Apple Figma kit macOS 27 (window/sheet 16pt nodes 585:3372, 121:11423; alert 10pt 121:11254; popover 10pt 4336:13305; menuItemHighlight 8pt 685:23691, 2026-11-25) + estimated remaining subfields |
| `typography.json` | `fallbackCompensation` | `{ inter: [...] }` | `estimated` | estimated Inter width compensation |
| `typography.json` | `nonLatin.banglaLineHeightScale` | `{ min: 1.35, max: 1.5 }` | `estimated` | estimated |
| `typography.json` | `nonLatin.banglaExpansionPercent` | `{ min: 20, max: 30 }` | `estimated` | estimated |

## 2. Source Conflicts & Community Alternates (3 entries)

| Token File | Path | Alternate / Conflict Values | Status / Class | Source |
|---|---|---|---|---|
| `layout.json` | `ios.safeArea.$alt` | `{ iPhone15_16_topDynamicIsland: 59, iPhone17_17Pro_topDynamicIsland: 62 }` | `inferred/community` | screens.guide community specs |
| `shape.json` | `radiusIOS.deviceDisplay.$alt` | `{ iPhone16Pro_17Pro: 62, iPadPro_M4_M5: 18 }` | `inferred/community` | ScreenCorners community SPI |
| `typography.json` | `macosTextStyles.$kitConflict` | `{ headline: [...], caption1: [...], caption2: [...] }` | `needs-device-verification` | Apple macOS 27 Sketch Kit vs Apple HIG Typography |

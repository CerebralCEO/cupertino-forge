# Estimate Resolution — Round 3 (ForgeKit iOS 27 & macOS 27)

> **Date:** 2026-11-27 | **Sources:** Local ForgeKit exports (`ios27` + `macos27`), excluding `Examples/*`
> **Rule:** Step A is read-only audit. No `tokens/*.json` files were modified.

## 1. Phase 3c Provisional 10 Groups Re-Verified Against ForgeKit

| Token Path | Current Value | ForgeKit Evidence (Kit, Component, Node ID) | Verdict |
|---|---|---|---|
| `shape.json :: continuousCorner.smoothing` | `0.6` | Both kits `cornerSmoothing: 0.6` across rounded-rect components | **confirmed** |
| `layout.json :: ios.toggle` | `64x28, knob 38x24, inset 2` | `ios27` `Toggles` (`10456:1252` `64x28`) | **confirmed** |
| `layout.json :: ios.slider` | `trackH 6, knob 38x24` | `ios27` `Sliders` (`5428:5504`, `5437:1568`) | **confirmed** |
| `layout.json :: ios.stepper` | `92x32` | `ios27` `Steppers` (`5415:17699` `92x32`) | **confirmed** |
| `layout.json :: ios.textField` | `height 52, padH 16` | `ios27` `Text-Fields` (`553:23061` `402x52`, full-width row) | **ambiguous** (row width `402` vs standalone control) |
| `layout.json :: ios.searchField` | `height 44` | `ios27` `Toolbars` (`5565:33301` `44pt`; `48pt` bottom variant) | **confirmed** |
| `layout.json :: ios.alert` | `width 300, pad 14, btnH 48` | `ios27` `Alerts` (`65:57149` `300x307 pad=14`, `61:67601` `300x419 pad=14`) | **confirmed** |
| `layout.json :: ios.sheet` | `grabber 60x4 topInset 6, medInset 6` | `ios27` `Sheets` (`5827:57545`, `10525:1687`, `10525:1635`) | **confirmed** |
| `layout.json :: macos.controlSizes` | `16 / 20 / 24 / 28 / 36` | `macos27` `Toggles` (`4348:11337/11331/11313/11319/11321`) | **confirmed** |
| `layout.json :: macos.menu` | `itemH 24, outerPad 5, sepH 11` | `macos27` `Menus` (`240:7945`, `483:8811`, `4353:3152`) | **confirmed** |

## 2. All 70 Remaining `ESTIMATES.md` Entries

| Token | Current Sample | Verdict | Note |
|---|---|---|---|
| `color.json :: macOSSurfaces.bg2` | `{ light: #F5F5F7, dark: #262626 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: macOSSurfaces.bg3` | `{ light: #FFFFFF, dark: #2E2E2E }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: macOSSurfaces.bgGrouped` | `{ light: #F5F5F7, dark: #1E1E1E }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: macOSSurfaces.bgGrouped2` | `{ light: #FFFFFF, dark: #262626 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: macOSSurfaces.bgGrouped3` | `{ light: #F5F5F7, dark: #2E2E2E }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: macOSSurfaces.separatorOpaque` | `{ light: #D8D8D8, dark: #3A3A3A }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: selection` | `{ selectedContentText: [...], unemphasizedSelectedBackground: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: selection.unemphasizedSelectedBackground` | `{ light: #DCDCDC, dark: #464646 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: dimming.sheetScrim` | `{ light: #000000@0.2, dark: #000000@0.48 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: iosFieldBorder` | `{ light: #000000@0, dark: #000000@0 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `color.json :: highContrastLabels` | `{ label2: [...], label3: [...], glassBorder: [...], accentContrast: #FFFFFF }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `elevation.json :: levels.knob` | `{ light: 0 3px 8px rgba(0,0,0,0.15), 0 3px 1px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04), dark: 0 3px 8px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.2) }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `elevation.json :: levels.raised` | `{ light: 0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06), dark: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.08) }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `elevation.json :: levels.popover` | `{ light: 0 8px 32px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.12), dark: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.12) }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `elevation.json :: levels.sheet` | `{ light: 0 -1px 0 rgba(0,0,0,0.04), 0 -10px 40px rgba(0,0,0,0.12), dark: 0 -10px 40px rgba(0,0,0,0.5) }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `elevation.json :: levels.toast` | `{ light: 0 10px 30px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06), dark: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.1) }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `feedback.json :: webHaptics` | `{ vibratePatternsMs: [...], iosSafariSwitchTrick: true }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `feedback.json :: sounds` | `{ masterVolume: 0.35, throttleMs: 40, catalog: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `icons.json :: weightToLucideStroke` | `{ ultralight: 1, thin: 1.25, light: 1.5, regular: 1.75, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `layout.json :: spacing` | `{ scale: [...], names: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `layout.json :: ios.layoutMargins` | `{ compactWidth: 16, regularWidth: 20, iPhoneMax: 20 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `layout.json :: ios.safeArea` | `{ topDynamicIsland: 62, topNotch: 47, topSE: 20, bottomHomeIndicator: 34, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: ios.toolbar` | `{ height: 44, itemGlassGroupHeight: 44, bottomInsetFromSafeArea: 0 }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: ios.tabBar` | `{ style: floating capsule of Liquid Glass, separated from screen edges, height: 62, sideInset: 20, bottomGapAboveHomeIndicator: 0, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: ios.listRow` | `{ minHeight: 52, minHeightCompact: 44, subtitleRow: 64, leadingInset: 16, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: ios.listSection` | `{ insetGroupedSideInset: 16, headerStyle: headline sentence case, footerStyle: footnote secondary label, gapBetweenSections: 20 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `layout.json :: ios.button` | `{ mini: 28, small: 32, medium: 36, large: 50, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: ios.segmentedControl` | `{ height: 36, selectedInset: 2, labelStyle: subheadline emphasized when selected }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: ios.pageControl` | `{ dot: 8, gap: 9 }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: macos` | `{ windowMinimum: [...], titlebarHeight: 32, toolbarHeight: 52, toolbarHeightCompact: 38, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: macos.trafficLights` | `{ diameter: 14, gap: 9, leadingInset: 16, centerYFromTop: 26, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: macos.sidebar` | `{ minWidth: 180, defaultWidth: 220, maxWidth: 320, rowHeight: 32, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `layout.json :: zIndex` | `{ content: 0, scrollEdge: 10, bars: 20, floatingButton: 30, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: liquidGlass.engine` | `{ blurPx: [...], saturate: 1.8, brightnessLight: 1.05, brightnessDark: 0.9, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: liquidGlass.pressBehavior` | `{ onTouchDown: glass element scales to 1.08 to 1.12 with a spring (response 0.3, damping 0.7) and its highlight brightens; content below shows a soft glow, onRelease: springs back to 1.0, trackpadOrMouse: subdued: scale 1.02, no glow }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: liquidGlass.tuned` | `{ regular: [...], clear: [...], tinted: [...], large: [...], ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: liquidGlass.intensityCurve` | `{ min: 0, max: 1, default: 0.5, alphaScaleFormula: 0.7 + 0.6 * intensity, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: liquidGlass.perfBudget` | `{ maxSimultaneousBackdrop: 6, neverAnimateBlurSigma: true, flutterRequireBackdropGroup: true }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: standardMaterials.ios.blurPx` | `{ ultraThin: 20, thin: 24, regular: 30, thick: 30 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `materials.json :: standardMaterials.macos.blurPx` | `{ ultraThin: 20, thin: 24, regular: 30, thick: 30, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.interactive` | `{ duration: 0.15, bounce: 0, usage: Finger tracking, press down, drag follow. Must be near instant. }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.press` | `{ duration: 0.2, bounce: 0, usage: Press down scale and highlight }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.release` | `{ duration: 0.35, bounce: 0.15, usage: Release after press, glass settle }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.sheet` | `{ duration: 0.5, bounce: 0, usage: Sheet present and dismiss, detent changes }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.push` | `{ duration: 0.5, bounce: 0, usage: Navigation push and pop }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.popover` | `{ duration: 0.35, bounce: 0.1, usage: Menus, popovers, context menus scale in from source }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: springs.glassMorph` | `{ duration: 0.45, bounce: 0.2, usage: Liquid Glass shapes merging, splitting, tab bar minimize }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions` | `{ navigationPush: [...], sheetPresent: [...], sheetDismiss: [...], alertPresent: [...], ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.sheetPresent` | `{ spring: sheet, from: bottom, scrim: fade 0 to scrim alpha in same spring, backgroundScale: underlying content stays at 1.0 on iOS 26+ (no card stack shrink) except fullscreen cover, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.sheetDismiss` | `{ dragToDismiss: true, velocityThresholdPtPerS: 600, distanceThreshold: 40 percent of sheet height, interruptible: true, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.alertPresent` | `{ from: scale 1.08 opacity 0, to: scale 1 opacity 1, spring: popover, interruptible: true, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.alertDismiss` | `{ to: opacity 0, durationMs: 150, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.menuOpen` | `{ from: scale 0.6 from the source anchor opacity 0, to: scale 1, spring: popover, glassMorphFromButton: true, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.menuClose` | `{ to: scale 0.8 opacity 0, durationMs: 180, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.contextMenu` | `{ liftScale: 1.04, blurBackground: 20, spring: popover, interruptible: true, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.tabSwitch` | `{ content: crossfade 150ms, no slide, indicator: glass capsule slides with spring snappy, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.tabBarMinimize` | `{ spring: glassMorph, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.toggle` | `{ knob: spring snappy, knobStretchWhilePressed: 1.25, trackColor: 150ms crossfade, interruptible: true, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.segmentedSelection` | `{ spring: snappy, indicatorStretchWhileDragging: true, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.listRowHighlight` | `{ pressInMs: 0, fadeOutMs: 250, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.fade` | `{ durationMs: 200, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: transitions.toast` | `{ from: top, translateY -20 opacity 0, spring: snappy, interruptible: true, reducedMotion: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: press` | `{ glassButton: [...], solidButton: [...], plainTextButton: [...], listRow: [...], ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: hover` | `{ macOSToolbarItem: [...], macOSListRow: no hover background except in sidebars and menus, menuItem: [...], iPadPointer: [...], ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `motion.json :: symbolEffects` | `{ bounce: scale 1 to 1.2 to 1 with snappy spring, pulse: opacity 1 to 0.5 loop 1s, replace: old symbol scales to 0.6 and fades while new scales from 0.6, 250ms, wiggle: rotate -8 to 8 deg 3 times, ... }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `shape.json :: radiusIOS` | `{ deviceDisplay: [...], sheet: device display radius when full height at the bottom edge; 38 when floating at medium detent with 8 inset, alert: 34, actionSheet: 34, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `shape.json :: radiusMacOS` | `{ window: 16, windowNote: Measured 16pt (cornerSmoothing 0.6) across all Window BG and Windows - Composed variants in Apple Figma kit macOS 27 (nodes 585:3372, 4363:18479, 4365:31678)., sheet: 16, alert: 10, ... }` | **ambiguous** | Multiple kit variants / platform divergence (see Section 3) |
| `typography.json :: fallbackCompensation` | `{ inter: [...] }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `typography.json :: nonLatin.banglaLineHeightScale` | `{ min: 1.35, max: 1.5 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |
| `typography.json :: nonLatin.banglaExpansionPercent` | `{ min: 20, max: 30 }` | **not-in-figma** | Runtime physics / audio / CSS blur / fallback heuristic not in static Figma kit |

## 3. 14 Ambiguous Entries — Variant Breakdown & Step B Recommendation

### `ios.button` (12 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `5473:20407` | `Size=Large, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=True` | 50x50 | 500 | `None` | None |
| `5473:20409` | `Size=Medium, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=True` | 34x34 | 500 | `None` | None |
| `5473:20411` | `Size=Small, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=True` | 28x28 | 500 | `None` | None |
| `5473:20449` | `Size=Large, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=True` | 50x50 | 500 | `None` | None |
| `5473:20451` | `Size=Medium, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=True` | 34x34 | 500 | `None` | None |
| `5473:20453` | `Size=Small, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=True` | 28x28 | 500 | `None` | None |
| `5473:20491` | `Size=Large, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=True` | 50x50 | 500 | `None` | None |
| `5473:20494` | `Size=Medium, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=True` | 34x34 | 500 | `None` | None |
| `5473:20497` | `Size=Small, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=True` | 28x28 | 500 | `None` | None |
| `5473:20413` | `Size=Large, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=True` | 50x50 | 500 | `None` | None |
| `5473:20415` | `Size=Medium, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=True` | 34x34 | 500 | `None` | None |
| `5473:20417` | `Size=Small, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=True` | 28x28 | 500 | `None` | None |

### `ios.segmentedControl` (4 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `10460:170` | `Size=Small, Is Enabled=True` | 370x32 | 100 | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` | 0 |
| `10460:177` | `Size=Large, Is Enabled=True` | 370x50 | 100 | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` | 0 |
| `488:60882` | `Size=Small, Is Enabled=False` | 370x32 | 100 | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` | 0 |
| `10460:134` | `Size=Large, Is Enabled=False` | 370x50 | 100 | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` | 0 |

### `ios.toolbar` (12 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `5720:48152` | `Mode=Dark, Type=Button Group` | 168x48 | 296 | `{'top': 0, 'right': 18, 'bottom': 0, 'left': 18}` | 0 |
| `5720:48161` | `Mode=Dark, Type=Button` | 72x48 | 296 | `{'top': 0, 'right': 18, 'bottom': 0, 'left': 18}` | 12 |
| `5522:14799` | `Mode=Light, Type=Button Group` | 168x48 | 296 | `{'top': 0, 'right': 18, 'bottom': 0, 'left': 18}` | 0 |
| `5522:14808` | `Mode=Light, Type=Button` | 72x48 | 296 | `{'top': 0, 'right': 18, 'bottom': 0, 'left': 18}` | 12 |
| `8515:13163` | `Toolbar - Bottom - iPad` | 500x58 | 0 | `{'top': 4, 'right': 10, 'bottom': 10, 'left': 10}` | 0 |
| `5704:39190` | `Type=Buttons + Page Dots` | 402x84 | 0 | `{'top': 4, 'right': 28, 'bottom': 32, 'left': 28}` | 0 |
| `5432:24143` | `Type=Search with Focus` | 402x84 | 0 | `{'top': 4, 'right': 28, 'bottom': 32, 'left': 28}` | 12 |
| `5432:24116` | `Type=Search + Leading Item` | 402x84 | 0 | `{'top': 4, 'right': 28, 'bottom': 32, 'left': 28}` | 12 |
| `5432:24089` | `Type=Search + Trailing Item` | 402x84 | 0 | `{'top': 4, 'right': 28, 'bottom': 32, 'left': 28}` | 12 |
| `5432:23993` | `Type=Search` | 402x84 | 0 | `{'top': 4, 'right': 28, 'bottom': 32, 'left': 28}` | 0 |
| `4:55845` | `Type=Buttons` | 402x84 | 0 | `{'top': 4, 'right': 28, 'bottom': 32, 'left': 28}` | 0 |
| `5573:24144` | `Style=Compact Large, Tab Bar=True` | 820x54 | 0 | `{'top': 0, 'right': 10, 'bottom': 10, 'left': 10}` | 10 |

### `ios.tabBar` (12 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `2524:7957` | `Tab Bar - iPad` | 491x44 | 0 | `{'top': 4, 'right': 4, 'bottom': 4, 'left': 4}` | 0 |
| `10508:1516` | `Minimized=True, Tabs=5, Type=Prominent Tab` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |
| `10508:1272` | `Minimized=True, Tabs=4, Type=Prominent Tab` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |
| `10508:1081` | `Minimized=True, Tabs=3, Type=Prominent Tab` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |
| `10459:4762` | `Minimized=True, Tabs=2, Type=Prominent Tab` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |
| `10508:1544` | `Minimized=False, Tabs=5, Type=Prominent Tab` | 402x95 | 0 | `{'top': 16, 'right': 25, 'bottom': 25, 'left': 25}` | 16 |
| `10508:1244` | `Minimized=False, Tabs=4, Type=Prominent Tab` | 402x95 | 0 | `{'top': 16, 'right': 25, 'bottom': 25, 'left': 25}` | 16 |
| `10508:1109` | `Minimized=False, Tabs=3, Type=Prominent Tab` | 402x95 | 0 | `{'top': 16, 'right': 25, 'bottom': 25, 'left': 25}` | 16 |
| `10459:4738` | `Minimized=False, Tabs=2, Type=Prominent Tab` | 402x95 | 0 | `{'top': 16, 'right': 25, 'bottom': 25, 'left': 25}` | 16 |
| `10508:1506` | `Minimized=True, Tabs=5, Type=Search Role` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |
| `10508:1262` | `Minimized=True, Tabs=4, Type=Search Role` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |
| `10508:1071` | `Minimized=True, Tabs=3, Type=Search Role` | 402x88 | 0 | `{'top': 16, 'right': 32, 'bottom': 32, 'left': 32}` | 16 |

### `ios.listRow` (2 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `525:43156` | `Lock Screen Widget - Modular List` | 162x72 | 0 | `{'top': 0, 'right': 8, 'bottom': 0, 'left': 8}` | 0 |
| `135:73247` | `Notification - Collapsed - List` | 402x337.3320007324219 | 5 | `{'top': 16, 'right': 14, 'bottom': 16, 'left': 14}` | 8 |

### `ios.pageControl` (12 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `10520:3447` | `Pages=1-6` | 402x44 | 0 | `None` | None |
| `10520:3449` | `Pages=7` | 402x44 | 0 | `None` | None |
| `10520:3456` | `Pages=8+` | 402x44 | 0 | `None` | None |
| `5704:38676` | `Dots=8+, Selection=8` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38689` | `Dots=8+, Selection=7` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38702` | `Dots=8+, Selection=6` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38715` | `Dots=8+, Selection=5` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38731` | `Dots=8+, Selection=4` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38744` | `Dots=8+, Selection=3` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38757` | `Dots=8+, Selection=2` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38770` | `Dots=8+, Selection=1` | 168x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |
| `5704:38783` | `Dots=7, Selection=7` | 152x48 | 50 | `{'top': 20, 'right': 24, 'bottom': 20, 'left': 24}` | 8 |

### `macos.trafficLights` (4 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `4365:36385` | `Mode=Dark, Active=False` | 68x14 | 0 | `{'top': 0, 'right': 8, 'bottom': 0, 'left': 0}` | 9 |
| `4365:36389` | `Mode=Dark, Active=True` | 68x14 | 0 | `{'top': 0, 'right': 8, 'bottom': 0, 'left': 0}` | 9 |
| `488:17657` | `Mode=Light,Active=False` | 68x14 | 0 | `{'top': 0, 'right': 8, 'bottom': 0, 'left': 0}` | 9 |
| `121:11896` | `Mode=Light,Active=True` | 68x14 | 0 | `{'top': 0, 'right': 8, 'bottom': 0, 'left': 0}` | 9 |

### `macos.sidebar` (3 sampled variants)
| Node ID | Variant Name | WxH | cr | Padding | Gap |
|---|---|---|---|---|---|
| `657:3895` | `Size=Large` | 240x560 | 0 | `{'top': 0, 'right': 0, 'bottom': 10, 'left': 0}` | 0 |
| `656:3560` | `Size=Medium` | 240x560 | 0 | `{'top': 0, 'right': 0, 'bottom': 10, 'left': 0}` | 0 |
| `571:9795` | `Size=Small` | 240x560 | 0 | `{'top': 0, 'right': 0, 'bottom': 10, 'left': 0}` | 0 |

## 4. Summary Counts (70 `ESTIMATES.md` + 10 Phase 3c)
- **Phase 3c 10 groups:** 9 confirmed, 1 ambiguous (`ios.textField` full-width `402x52` row)
- **70 `ESTIMATES.md` entries:** `confirmed`=0, `contradicted`=0, `ambiguous`=15, `not-in-figma`=55

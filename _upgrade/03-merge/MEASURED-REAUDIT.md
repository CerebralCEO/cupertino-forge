# MEASURED Re-Audit Report (Pre-Merge Rule #2)

Date: 2026-11-25 | Branch: `upgrade/apple-dna-v2`

Rule applied: Only measurements directly extracted from Apple's own Sketch UI Kit JSON exports (`tokens/source/apple-ios-27-ui-kit.tokens.json` and `apple-macos-27-ui-kit.tokens.json`) remain labeled `Measured`. Community benchmarks, third-party blogs, private SPI reverse-engineering (`ScreenCorners`, `chpwn`), and self-computed synthesis scripts are downgraded to `Inferred` before merging into plugin tokens/docs.

## Summary Counts

| Scope | Measured Before | Group (a) Apple Kit Kept (`Measured`) | Group (b) Downgraded (`Inferred`) |
|---|---:|---:|---:|
| Research JSON (`_upgrade/02-research/json/*.json`) | 160 | 145 | 15 |
| Domain Markdown (`_upgrade/02-research/01..18-*.md`) | 53 | 36 | 17 |
| **Total** | **213** | **181** | **32** |

## Group (a) — Apple Kit Measurements Kept (`Measured`)

- JSON leaf tokens kept: **145** across `color.json`, `liquid-glass.json`, and `components-macos.json` (source: `apple-ios-27-ui-kit.tokens.json` & `apple-macos-27-ui-kit.tokens.json`).
- Markdown 9-col rows kept: **36** (`02-color.md`: 24 rows; `06-liquid-glass.md`: 9 rows; `09-components-macos.md`: 3 rows).

## Group (b) — Non-Apple-Kit Entries Downgraded to `Inferred`

### JSON Leaf Tokens Downgraded
| File | Token Path | Original Source | URL |
|---|---|---|---|
| `components-ios.json` | `navBar.barHeight` | Classic UIKit UINavigationBar compact portrait height | https://developer.apple.com/design/human-interface-guidelines/toolbars |
| `components-ios.json` | `toggle.legacyTrackSize` | Pre-iOS 26 UISwitch native intrinsicContentSize | https://developer.apple.com/documentation/uikit/uiswitch |
| `layout.json` | `spacing.readableContentMaxWidth` | UIKit readableContentGuide typical max measure | https://developer.apple.com/design/human-interface-guidelines/layout |
| `layout.json` | `devicesAndSafeAreas.iPhoneSE3` | Apple iOS device specs | https://useyourloaf.com/blog/iphone-screen-resolutions/ |
| `layout.json` | `devicesAndSafeAreas.iPhone15_16` | iPhone 15 / 16 / 16 Pro specs | https://screens.guide/ |
| `layout.json` | `devicesAndSafeAreas.iPhone17_17Pro` | iPhone 17 / 17 Pro 6.3-inch specs | https://screens.guide/ |
| `layout.json` | `devicesAndSafeAreas.iPhone17ProMax` | iPhone 17 Pro Max 6.9-inch specs | https://screens.guide/ |
| `layout.json` | `devicesAndSafeAreas.iPadPro11` | iPad Pro 11-inch M4/M5 | https://useyourloaf.com/ |
| `layout.json` | `devicesAndSafeAreas.iPadPro13` | iPad Pro 13-inch M4/M5 | https://useyourloaf.com/ |
| `motion.json` | `scrollAndPhysics.rubberBandConstantC` | Reverse-engineered UIScrollView overscroll constant | https://twitter.com/chpwn/status/285540192096497664 |
| `motion.json` | `transitions.navPushOutgoingParallax` | Standard UINavigationController outgoing shift 30% trailing->leading | https://developer.apple.com/documentation/uikit/uinavigationcontroller |
| `shape.json` | `continuousCorner.figmaSmoothing` | Figma 60% corner smoothing matching Apple continuous corner | https://www.figma.com/blog/desperately-seeking-squircles/ |
| `shape.json` | `deviceDisplayCornerRadii.iPhone16Pro_17Pro` | Hardware display corner radius (~55-62pt depending on model/sampling; 16 Pro/17 Pro reported 62pt) | https://github.com/kylebshr/ScreenCorners |
| `shape.json` | `deviceDisplayCornerRadii.iPhone15_16` | ScreenCorners / UIScreen._displayCornerRadius | https://github.com/kylebshr/ScreenCorners |
| `shape.json` | `deviceDisplayCornerRadii.iPadPro_M4_M5` | iPad Pro Liquid Retina / Tandem OLED display corner radius | https://github.com/kylebshr/ScreenCorners |

### Markdown Table Rows Downgraded
| File | Row Name | URL |
|---|---|---|
| `04-layout-spacing.md` | `layout.readableContentWidth` | https://developer.apple.com/design/human-interface-guidelines/layout |
| `04-layout-spacing.md` | `device.iPhoneSE3` | https://useyourloaf.com/blog/iphone-screen-resolutions/ |
| `04-layout-spacing.md` | `device.iPhone15_16_Pro` | https://screens.guide/ |
| `04-layout-spacing.md` | `device.iPhone17_17Pro` | https://screens.guide/ |
| `04-layout-spacing.md` | `device.iPhone17ProMax` | https://screens.guide/ |
| `04-layout-spacing.md` | `device.iPadPro11` | https://useyourloaf.com/ |
| `04-layout-spacing.md` | `device.iPadPro13` | https://useyourloaf.com/ |
| `05-shape-geometry.md` | `shape.continuous.figmaSmoothing` | https://www.figma.com/blog/desperately-seeking-squircles/ |
| `05-shape-geometry.md` | `shape.display.iPhone15_16` | https://github.com/kylebshr/ScreenCorners |
| `05-shape-geometry.md` | `shape.display.iPhone16Pro_17Pro` | https://github.com/kylebshr/ScreenCorners |
| `05-shape-geometry.md` | `shape.display.iPadPro_M4_M5` | https://github.com/kylebshr/ScreenCorners |
| `07-motion-physics.md` | `scroll.rubberBandConstantC` | https://twitter.com/chpwn/status/285540192096497664 |
| `07-motion-physics.md` | `nav.pushOutgoingParallax` | https://developer.apple.com/documentation/uikit/uinavigationcontroller |
| `08-components-ios.md` | `ios.navBar.height` | https://developer.apple.com/design/human-interface-guidelines/toolbars |
| `11-haptics-sound.md` | `web.iosSafariHapticWorkaround` | tokens/feedback.json |
| `11-haptics-sound.md` | `sound.synth.tap` | scripts/synth-sounds.py |
| `11-haptics-sound.md` | `sound.synth.toggle` | scripts/synth-sounds.py |

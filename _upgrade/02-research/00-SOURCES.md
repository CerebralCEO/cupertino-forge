# 00-SOURCES — Primary & Secondary Source Registry

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `_upgrade\02-research\`-এর প্রতিটি গবেষণা ফাইলের সব Official Apple ডকুমেন্টেশন, raw UI kit, WWDC তথ্য ও পরিমাপযোগ্য reference URL একত্রে নথিভুক্ত করে; plugin-এর `SKILL.md` ও `tokens/*.json`-এ `$source` ট্যাগ যাচাই করার সময় এখান থেকেই canonical URL ও source tier নেওয়া হবে।

---

## Source Trust Hierarchy

1. **Tier 1 (`Official`)**: Apple Human Interface Guidelines (DocC JSON API), Apple Developer Documentation (SwiftUI / UIKit / AppKit / TechnologyOverviews DocC JSON API), Apple System Fonts / Apple Design Resources.
2. **Tier 2 (`Measured`)**: Apple অফিসিয়াল iOS 27 ও macOS 27 Sketch UI Kit JSON exports (`tokens/source/apple-ios-27-ui-kit.tokens.json`, `tokens/source/apple-macos-27-ui-kit.tokens.json`), reverse-engineered runtime/hardware measurements (`ScreenCorners`, `UIScrollView` physics), ও local script verification।
3. **Tier 3 (`Inferred`)**: একাধিক Tier 1/Tier 2 সূত্র মিলিয়ে গাণিতিক বা architectural যুক্তি (যেমন WCAG vs Apple contrast boundary, Flutter/Web parity rules, Bangla/Arabic optical balance)।
4. **Tier 4 (`Estimated`) / Secondary Press**: সেসব মান যা Apple public doc/kit-এ সংখ্যা হিসেবে দেয়নি বা iOS 27 / macOS 27 press reports (MacRumors, Lifehacker ইত্যাদি) থেকে পাওয়া — চূড়ান্ত নিশ্চিতের জন্য Xcode / macOS hardware প্রয়োজন।

---

## Primary Sources Collected & Verified

| Source ID | Title / Artifact | URL / Path | Type | Access Date | Scope Covered |
| --- | --- | --- | --- | --- | --- |
| `SRC-APPLE-TYPO` | Apple HIG: Typography | https://developer.apple.com/design/human-interface-guidelines/typography | Official DocC JSON | 2026-11-25 | iOS Dynamic Type (12x11), macOS text styles, SF Pro / SF Pro Rounded / New York / macOS tracking tables |
| `SRC-APPLE-COLOR` | Apple HIG: Color | https://developer.apple.com/design/human-interface-guidelines/color | Official DocC JSON | 2026-11-25 | System/semantic/vibrant colors, Liquid Glass color guidance, Dark/HC principles |
| `SRC-APPLE-DARK` | Apple HIG: Dark Mode | https://developer.apple.com/design/human-interface-guidelines/dark-mode | Official DocC JSON | 2026-11-25 | Base vs elevated backgrounds, desktop tinting, contrast minimums (4.5:1 / 7:1) |
| `SRC-APPLE-MAT` | Apple HIG: Materials | https://developer.apple.com/design/human-interface-guidelines/materials | Official DocC JSON | 2026-11-25 | Liquid Glass regular vs clear, 35% dark dimming layer, standard materials, vibrancy |
| `SRC-APPLE-LAY` | Apple HIG: Layout | https://developer.apple.com/design/human-interface-guidelines/layout | Official DocC JSON | 2026-11-25 | Safe areas, margins, iPhone 17/Air/Pro metrics guidance, separation of controls & content |
| `SRC-APPLE-MOTION` | Apple HIG: Motion | https://developer.apple.com/design/human-interface-guidelines/motion | Official DocC JSON | 2026-11-25 | Liquid Glass touch vs pointer motion scaling, Reduce Motion guidance |
| `SRC-APPLE-A11Y` | Apple HIG: Accessibility | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official DocC JSON | 2026-11-25 | Hit targets (44pt/28pt), contrast rules (<=17pt 4.5:1, >=18pt/Bold 3:1), min font sizes |
| `SRC-APPLE-RTL` | Apple HIG: Right to left | https://developer.apple.com/design/human-interface-guidelines/right-to-left | Official DocC JSON | 2026-11-25 | Mirroring rules, 3+ line paragraph alignment, +2pt RTL vs uppercase Latin balancing, numerals |
| `SRC-APPLE-WRITE` | Apple HIG: Writing | https://developer.apple.com/design/human-interface-guidelines/writing | Official DocC JSON | 2026-11-25 | Voice, tone, sentence vs title case, error messages, empty states |
| `SRC-APPLE-HAPTICS` | Apple HIG: Playing haptics | https://developer.apple.com/design/human-interface-guidelines/playing-haptics | Official DocC JSON | 2026-11-25 | Transient vs continuous events, Notification/Impact/Selection, macOS Force Touch, watchOS |
| `SRC-APPLE-ICONS` | Apple HIG: SF Symbols & App Icons | https://developer.apple.com/design/human-interface-guidelines/sf-symbols | Official DocC JSON | 2026-11-25 | SF Symbols 7 Draw On/Off, gradients, localized RTL symbols, 1024x1024 layered `.icon` |
| `SRC-APPLE-ADOPT-LG` | Apple Technology Overviews: Adopting Liquid Glass | https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass | Official DocC JSON | 2026-11-25 | Liquid Glass functional layer, ConcentricRectangle, ScrollEdgeEffect, TabBarMinimizeBehavior |
| `SRC-APPLE-SW-GLASS` | SwiftUI Documentation: Glass, GlassEffectContainer, ConcentricRectangle | https://developer.apple.com/documentation/swiftui/glass | Official DocC JSON | 2026-11-25 | `.regular`, `.clear`, `.identity`, `.tint()`, `.interactive()`, `GlassEffectContainer`, `ConcentricRectangle` |
| `SRC-APPLE-SW-SPRING` | SwiftUI Documentation: Spring | https://developer.apple.com/documentation/swiftui/spring | Official DocC JSON | 2026-11-25 | `smooth`, `snappy`, `bouncy`, stiffness/damping math example |
| `SRC-APPLE-UIK-LG` | UIKit: UIGlassEffect & UIScrollView.DecelerationRate | https://developer.apple.com/documentation/uikit/uiglasseffect | Official DocC JSON | 2026-11-25 | `UIGlassEffect`, `decelerationRate` (`0.998` / `0.99`) |
| `SRC-APPLE-APPK-LG` | AppKit: NSGlassEffectView & NSHapticFeedbackManager | https://developer.apple.com/documentation/appkit/nsglasseffectview | Official DocC JSON | 2026-11-25 | `NSGlassEffectView` (`regular`, `clear`), `NSHapticFeedbackManager` |
| `SRC-KIT-IOS27` | Apple iOS 27 Sketch UI Kit export | `tokens/source/apple-ios-27-ui-kit.tokens.json` (from https://developer.apple.com/design/resources/) | Measured (Kit JSON) | 2026-11-25 | 402 tokens: System Colors, Grays, Labels, Fills, Backgrounds, Separators, Liquid Glass layers |
| `SRC-KIT-MAC27` | Apple macOS 27 Sketch UI Kit export | `tokens/source/apple-macos-27-ui-kit.tokens.json` (from https://developer.apple.com/design/resources/) | Measured (Kit JSON) | 2026-11-25 | 676 tokens: macOS Vibrant Colors, Sidebar, Focus Ring, Liquid Glass, Bordered controls |
| `SRC-FONTS` | Apple Developer: System Fonts | https://developer.apple.com/fonts/ | Official | 2026-11-25 | SF Pro, SF Compact, SF Arabic, Kohinoor Bangla, platform multilingual font families |

## Component HIG & Apple Framework Sources Added in Batch B–D

| Source ID | Title / URL | Type | Scope Covered |
| --- | --- | --- | --- |
| `SRC-HIG-ALERTS` | https://developer.apple.com/design/human-interface-guidelines/alerts | Official DocC JSON | Critical confirmations, button titles, Esc / Cmd+. |
| `SRC-HIG-APPICON` | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official DocC JSON | 1024px/1088px layered `.icon`, 6 appearances, Oct 2026 formats |
| `SRC-HIG-BTN` | https://developer.apple.com/design/human-interface-guidelines/buttons | Official DocC JSON | 44pt target, 1–2 prominent cap, macOS 10px image padding |
| `SRC-HIG-MAC` | https://developer.apple.com/design/human-interface-guidelines/designing-for-macos | Official DocC JSON | Mac ergonomics & Oct 2026 touch input update |
| `SRC-HIG-GEST` | https://developer.apple.com/design/human-interface-guidelines/gestures | Official DocC JSON | Standard gestures & Oct 2026 Mac touch display guidance |
| `SRC-HIG-KBD` | https://developer.apple.com/design/human-interface-guidelines/keyboards | Official DocC JSON | Full Keyboard Access, Cmd/Shift modifiers, upper-char rule |
| `SRC-HIG-LIST` | https://developer.apple.com/design/human-interface-guidelines/lists-and-tables | Official DocC JSON | Grouped lists, macOS alternating rows, no index+disclosure collision |
| `SRC-HIG-LIVE` | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official DocC JSON | 14pt Lock Screen margin, Oct 2026 `28×28` limited width |
| `SRC-HIG-LOC` | https://developer.apple.com/design/human-interface-guidelines/localization | Official | Expansion & locale adaptation companion to RTL |
| `SRC-HIG-MENU` | https://developer.apple.com/design/human-interface-guidelines/menus | Official DocC JSON | Menu organization, title-case, June 2026 menu icons |
| `SRC-HIG-NOTIF` | https://developer.apple.com/design/human-interface-guidelines/notifications | Official DocC JSON | Previews placeholder, badging restraint, watchOS long look |
| `SRC-HIG-ONB` | https://developer.apple.com/design/human-interface-guidelines/onboarding | Official DocC JSON | Defer setup & ratings, omit EULA duplication |
| `SRC-HIG-PICK` | https://developer.apple.com/design/human-interface-guidelines/pickers | Official DocC JSON | Inline/popover pickers, minute intervals dividing 60 |
| `SRC-HIG-AUDIO` | https://developer.apple.com/design/human-interface-guidelines/playing-audio | Official DocC JSON | AVAudioSession categories, 64 kbps HE-AAC watchOS |
| `SRC-HIG-POP` | https://developer.apple.com/design/human-interface-guidelines/popovers | Official DocC JSON | Avoid on compact width, 1 popover max, save on auto-close |
| `SRC-HIG-PRIV` | https://developer.apple.com/design/human-interface-guidelines/privacy | Official DocC JSON | No launch prompt, purpose strings, Passkeys/Keychain |
| `SRC-HIG-SCRL` | https://developer.apple.com/design/human-interface-guidelines/scroll-views | Official DocC JSON | June 2026 ScrollEdgeEffect updates |
| `SRC-HIG-SRCH` | https://developer.apple.com/design/human-interface-guidelines/search-fields | Official DocC JSON | Search tokens & June 2026 trailing search tab |
| `SRC-HIG-SEG` | https://developer.apple.com/design/human-interface-guidelines/segmented-controls | Official DocC JSON | Text-only or icon-only segments rule |
| `SRC-HIG-SET` | https://developer.apple.com/design/human-interface-guidelines/settings | Official DocC JSON | `AppMenu > Settings...`, never toolbar gear icon |
| `SRC-HIG-SHT` | https://developer.apple.com/design/human-interface-guidelines/sheets | Official DocC JSON | Detents, Mar 2026 Cancel-leading / Done-trailing |
| `SRC-HIG-SIDE` | https://developer.apple.com/design/human-interface-guidelines/sidebars | Official DocC JSON | June 2026 colored accent sidebar icons |
| `SRC-HIG-SLDR` | https://developer.apple.com/design/human-interface-guidelines/sliders | Official DocC JSON | Linear/circular macOS styles, tick tooltips |
| `SRC-HIG-SPLT` | https://developer.apple.com/design/human-interface-guidelines/split-views | Official DocC JSON | `1pt` thin divider, regular-only multi-pane |
| `SRC-HIG-TAB` | https://developer.apple.com/design/human-interface-guidelines/tab-bars | Official DocC JSON | `<= 5` tabs phone, minimize on scroll, search accessory |
| `SRC-HIG-MBAR` | https://developer.apple.com/design/human-interface-guidelines/the-menu-bar | Official DocC JSON | `24pt` menu bar, Duplicate vs Save As, iPadOS differences |
| `SRC-HIG-TOG` | https://developer.apple.com/design/human-interface-guidelines/toggles | Official DocC JSON | Switch vs checkbox vs radio (`<= 5` options) |
| `SRC-HIG-TOOL` | https://developer.apple.com/design/human-interface-guidelines/toolbars | Official DocC JSON | Grouped Liquid Glass toolbar items & spacers |
| `SRC-HIG-UNDO` | https://developer.apple.com/design/human-interface-guidelines/undo-and-redo | Official DocC JSON | Unlimited undo, system triggers |
| `SRC-HIG-WID` | https://developer.apple.com/design/human-interface-guidelines/widgets | Official DocC JSON | `16pt` margin, `11pt` min font, Oct 2026 HomeView |
| `SRC-HIG-WIN` | https://developer.apple.com/design/human-interface-guidelines/windows | Official DocC JSON | 3 macOS window states, fluid iPadOS resizing |
| `SRC-SW-CONC` | https://developer.apple.com/documentation/swiftui/concentricrectangle | Official DocC JSON | SwiftUI concentric corner API |
| `SRC-SW-GEC` | https://developer.apple.com/documentation/swiftui/glasseffectcontainer | Official DocC JSON | GlassEffectContainer `spacing` & batch pass |
| `SRC-SW-NAV` | https://developer.apple.com/documentation/swiftui/navigationtransition | Official DocC JSON | `NavigationTransition.zoom` |
| `SRC-SW-EDGE` | https://developer.apple.com/documentation/swiftui/view/scrolledgeeffectstyle(_:for:) | Official DocC JSON | `automatic`, `soft`, `hard` edge effects |
| `SRC-SW-TABMIN` | https://developer.apple.com/documentation/swiftui/view/tabbarminimizebehavior(_:) | Official DocC JSON | `onScrollDown`, `onScrollUp`, `never` |
| `SRC-UIK-IMP` | https://developer.apple.com/documentation/uikit/uiimpactfeedbackgenerator/feedbackstyle | Official | `light`, `medium`, `heavy`, `soft`, `rigid` |
| `SRC-UIK-NAV` | https://developer.apple.com/documentation/uikit/uinavigationcontroller | Official | UINavigationController interactive pop & layout |
| `SRC-UIK-NOTIF` | https://developer.apple.com/documentation/uikit/uinotificationfeedbackgenerator/feedbacktype | Official | `success`, `warning`, `error` |
| `SRC-UIK-DECEL` | https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate | Official | `normal` (`0.998`), `fast` (`0.99`) |
| `SRC-UIK-SW` | https://developer.apple.com/documentation/uikit/uiswitch | Official | Legacy UIKit `51×31` switch metrics |
| `SRC-APPK-HAP` | https://developer.apple.com/documentation/appkit/nshapticfeedbackmanager | Official DocC JSON | Force Touch `alignment`, `levelChange`, `generic` |

## Cross-Platform, Standards & Empirical Measurement Sources

| Source ID | Title / URL | Type | Scope Covered |
| --- | --- | --- | --- |
| `SRC-W3C-NONTEXT` | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | Official Standard | `3:1` UI component / graphical contrast |
| `SRC-W3C-ALREQ` | https://www.w3.org/TR/alreq/ | Official Standard | Arabic cursive joining & zero letter-spacing rule |
| `SRC-CIU-SQUIRCLE` | https://caniuse.com/?search=corner-shape / https://caniuse.com/mdn-css_properties_corner-shape_squircle | Browser Compatibility | `corner-shape: squircle` Chromium `139+`, Safari `18.4+`, Firefox `148+` |
| `SRC-CIU-REDTRANS` | https://caniuse.com/?search=prefers-reduced-transparency | Browser Compatibility | Chrome `118+` supported; Safari unsupported |
| `SRC-FLUT-BF` | https://api.flutter.dev/flutter/widgets/BackdropFilter-class.html | Official Flutter API | `BackdropGroup` & `BackdropFilter.grouped` (3.29+) |
| `SRC-FLUT-PBACK` | https://api.flutter.dev/flutter/material/PredictiveBackPageTransitionsBuilder-class.html | Official Flutter API | Android 14+ predictive back transition |
| `SRC-FLUT-GOLD` | https://api.flutter.dev/flutter/flutter_test/matchesGoldenFile.html | Official Flutter API | Golden image test verification |
| `SRC-FLUT-PERF` | https://docs.flutter.dev/perf/rendering-performance / https://docs.flutter.dev/perf/ui-performance | Official Flutter Docs | Impeller offscreen saveLayer & 8.3ms/16.6ms frame budgets |
| `SRC-FLUT-ICONS` | https://pub.dev/packages/cupertino_icons | Official Package | Flutter `CupertinoIcons` icon font mapping |
| `SRC-MOTION` | https://motion.dev/docs/react-transitions | Official Docs | `motion/react` spring presets & `<MotionConfig reducedMotion="user">` |
| `SRC-PW` | https://playwright.dev/docs/api/class-page#page-emulate-media | Official Docs | `emulateMedia`, `toHaveScreenshot`, `toMatchAriaSnapshot` |
| `SRC-TAURI-VIB` | https://docs.rs/window-vibrancy/latest/window_vibrancy/ | Official Rust Crate | `window-vibrancy 0.8+` `LiquidGlassOptions` + `NSGlassEffectViewStyle` |
| `SRC-TAURI-MAS` | https://tauri.app/distribute/app-store/ | Official Tauri Docs | `macOSPrivateApi` Mac App Store caveat |
| `SRC-TAURI-WD` | https://v2.tauri.app/develop/tests/webdriver/ | Official Tauri Docs | `@wdio/tauri-service` required (`tauri-driver` unsupported on macOS) |
| `SRC-ELECTRON` | https://www.electronjs.org/docs/latest/api/browser-window | Official Electron Docs | `vibrancy` & Windows 11 `backgroundMaterial: 'mica'` |
| `SRC-DEV-UYL` | https://useyourloaf.com/ / https://useyourloaf.com/blog/iphone-screen-resolutions/ | Measured Spec Ref | iPhone SE/15/16/iPad Pro points & `@2x`/`@3x` specs |
| `SRC-DEV-SG` | https://screens.guide/ | Measured Spec Ref | iPhone 16 Pro / 17 / 17 Pro / Pro Max logical dimensions & safe areas |
| `SRC-DEV-SC` | https://github.com/kylebshr/ScreenCorners | Measured Hardware SPI | `_displayCornerRadius` (`55pt` 15/16, `62pt` 16 Pro+, `18pt` iPad Pro M4+) |
| `SRC-DEV-FIG` | https://www.figma.com/blog/desperately-seeking-squircles/ | Measured Analysis | `60%` corner smoothing matching Apple G2 curve |
| `SRC-DEV-GRIDA` | https://grida.co/ | Analysis Ref | Quintic (`n=5`) vs quartic (`n=4`) superellipse curve |
| `SRC-DEV-CH` | https://twitter.com/chpwn/status/285540192096497664 | Measured Reverse-Eng | `UIScrollView` rubber-band constant `c = 0.55` |
| `SRC-PRESS-MR` | https://www.macrumors.com/ | Secondary Press | WWDC 2026 Liquid Glass slider, macOS 27 window radius reports |
| `SRC-CIEDE` | https://en.wikipedia.org/wiki/Color_difference#CIEDE2000 | Standard Math | ΔE00 `<= 2.0` perceptual match threshold |
| `SRC-SSIM` | https://en.wikipedia.org/wiki/Structural_similarity_index_measure | Standard Math | SSIM structural screenshot comparison metric |


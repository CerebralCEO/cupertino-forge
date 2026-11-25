# 08 — iOS & iPadOS 26/27 Components Specification

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `skills/apple-design-core/references/components-ios.md`, `tokens/layout.json`, `tokens/shape.json`, `apple-web`, এবং `apple-flutter`-এর iOS/iPadOS UI কম্পোনেন্টগুলোর Official HIG আচরণ ও সংখ্যাগত মাপ নির্ধারণ করে; বাটন, ফ্লোটিং ট্যাব বার, শিট, অ্যাকশন শিট, অ্যালার্ট, ইনপুট, লিস্ট ও উইজেট/লাইভ অ্যাক্টিভিটির সঠিক মান এখান থেকে নেওয়া হবে।

---

## 1. Quantitative iOS/iPadOS Component Matrix (9-Column Spec)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ios.button.hitTargetMin` | `44 × 44` | pt | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/buttons | Official | high | Even smaller icon buttons must expand hit region to 44x44pt |
| `ios.button.prominentMaxPerView` | `1–2` | count | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/buttons | Official | high | Keep primary tinted glass / prominent CTA rare; never mark destructive as primary |
| `ios.button.heights` | `28 / 32 / 36 / 50 / 56` | pt | iOS 26/27 | Both | `tokens/layout.json` | Estimated | med | Mini/Small/Medium/Large/XL plugin estimates (HIG documents 28/32/44/52/64 only for visionOS) |
| `ios.navBar.height` | `44` (`+52` Large Title) | pt | iOS | Both | https://developer.apple.com/design/human-interface-guidelines/toolbars | Inferred | high | Compact 44pt UIKit bar; background transparent with ScrollEdgeEffect (`soft`/`hard`/`automatic`) [Re-audited: Inferred from non-kit source] |
| `ios.tabBar.maxVisibleTabsPhone` | `<= 5` | tabs | iOS | Both | https://developer.apple.com/design/human-interface-guidelines/tab-bars | Official | high | Over 5 collapses into "More" or converts via `.sidebarAdaptable` on iPad |
| `ios.tabBar.floatingCapsuleHeight` | `62` (`sideInset: 20`) | pt | iOS 26/27 | Both | https://developer.apple.com/design/human-interface-guidelines/tab-bars | Estimated | med | Floating Liquid Glass capsule separated from display edge |
| `ios.tabBar.minimizeAndSearch` | `.tabBarMinimizeBehavior(.onScrollDown)` + `Tab(role: .search)` | SwiftUI API | iOS 26/27 | Both | https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass | Official | high | Shrinks on downward scroll; trailing standalone glass search button |
| `ios.sheet.detentsAndActions` | `medium (~50%)`, `large (100%)`; Cancel leading / Done trailing | behavior | iOS 26/27 | Both | https://developer.apple.com/design/human-interface-guidelines/sheets | Official | high | Updated Mar 24, 2026: single-view sheets place Cancel leading & Done trailing |
| `ios.sheet.floatingRadiusMedium` | `38` (`inset: 8`, grabber `36×5` at `5pt` top) | pt | iOS 26/27 | Both | `tokens/layout.json` & `tokens/shape.json` | Estimated | med | Medium sheet insets from screen edges so content peeks beneath |
| `ios.actionSheet.origin` | Inline popover from `sourceView`/`sourceItem` | interaction | iOS 26/27 | Both | https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass | Official | high | No longer slides exclusively from screen bottom; destructive action sits at top |
| `ios.alert.metrics` | `width: 300`, `radius: 34`, `buttonHeight: 48` | pt | iOS 26/27 | Both | `tokens/layout.json` & `tokens/shape.json` | Estimated | med | Capsule glass buttons inside; Esc / `Cmd+.` cancels on hardware keyboard |
| `ios.popover.compactRule` | Avoid on compact width; 1 popover max at once | rule | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/popovers | Official | high | Use full-width sheets on compact iPhone; never cascade popovers from popovers |
| `ios.listRow.height` | `52` (min accessible `44`), subtitle `64` | pt | iOS 26/27 | Both | `tokens/layout.json` | Estimated | med | Adopting Liquid Glass notes larger row height, padding & `26pt` section radius |
| `ios.listSection.headerCase` | Title-style capitalization (not forced ALL CAPS) | text rule | iOS 26/27 | Both | https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass | Official | high | Breaking change from iOS <=18 uppercase grouped headers |
| `ios.toggle.pillDimensions` | `64 × 28` (`knob: 38 × 24`; pre-26 UISwitch `51 × 31`) | pt | iOS 26/27 vs <=18 | Both | `tokens/layout.json` | Estimated | med | Legacy `51×31` is Measured UIKit `intrinsicContentSize`; `64×28` pill-knob is Estimated iOS 26/27 |
| `ios.segmentedControl.height` | `36` | pt | iOS 26/27 | Both | https://developer.apple.com/design/human-interface-guidelines/segmented-controls | Estimated | med | Never mix text and icons inside a single segmented control |
| `ios.stepper.size` | `94 × 32` | pt | iOS | Both | `tokens/layout.json` | Estimated | med | Standard two-segment increment/decrement control |
| `ios.picker.styles` | `compact`, `inline`, `wheels` (min intervals divide `60`) | UIKit/SwiftUI | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/pickers | Official | high | Present inline/popover in context; do not push a separate view just for a picker |
| `ios.textField.height` | `44` (`paddingH: 16`) | pt | iOS / iPadOS | Both | `tokens/layout.json` | Estimated | med | Pair with `textContentType` & appropriate virtual keyboard (`virtual-keyboards`) |
| `ios.widget.marginsAndFont` | `margin: 16` (tight `11`), `minFontSize: 11` | pt | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/widgets | Official | high | Up to `AX5` Dynamic Type; avoid `2s`+ update animations |
| `ios.liveActivity.margins` | `Lock Screen margin: 14`, `limitedWidth: 28×28` | pt | iOS 16–27 | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Updated Oct 13, 2026 (`isDynamicIslandLimitedInWidth`); limit interactivity to 1 essential control |

---

## 2. Behavior & Structural Rules Worth Enforcing in Code
1. **Alerts vs Action Sheets**: Unexpected critical system warnings or destructive confirmations with no extra branching choices -> **Alert** (title `<= 2 lines`, never use `"OK"` if `"Delete"`/`"Erase"` is clearer, trailing/top primary, leading/bottom `Cancel`). User-initiated multi-option flow (`Save Draft` / `Delete Draft` / `Keep Editing`) -> **Action Sheet** (`confirmationDialog` anchored to `sourceView`).
2. **Search Placement**: In iOS 26/27 tab bars, mark search tabs semantically with `Tab(role: .search)` / `UISearchTab` so the system isolates the trailing glass search circle and slides the search field cleanly above the virtual keyboard on focus.
3. **Lists & Indexes**: Never render an alphabetical vertical index on a list that puts disclosure indicators or trailing buttons on rows — touch collision occurs.
4. **Context Menus**: Every action inside a context menu must also exist in the primary toolbar/screen UI; hide unavailable items rather than dimming them; place destructive items at the end in system red.

---

## 3. Gaps & Open Questions
- iOS 26/27 floating capsule tab bar (`62pt`), pill switch (`64×28pt`), and alert radius (`34pt`) need direct Xcode 27 / iOS 27 Simulator `View Hierarchy` / UI Kit Sketch artboard inspection (`Estimated` until measured).

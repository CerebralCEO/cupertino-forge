# 09 — macOS 26/27 Components Specification

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `skills/apple-design-core/references/components-macos.md`, `tokens/layout.json`, `tokens/shape.json`, `tokens/color.json`, `apple-web`, `apple-flutter`, এবং `apple-tauri`-এর macOS ডেস্কটপ উইজেট, মেনু বার, উইন্ডো ক্রোম, সাইডবার ও ইনস্পেক্টর নিয়মের একমাত্র নির্ভরযোগ্য সূত্র।

---

## 1. Quantitative macOS 26/27 Component Matrix (9-Column Spec)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `macos.window.minSize` | `480 × 320` | pt | macOS | Both | `tokens/layout.json` | Estimated | med | Supports continuous fluid resizing; never draw custom non-system chrome on native apps |
| `macos.window.uniformRadius` | `12` | pt | macOS 27 | Both | https://www.macrumors.com/ | Estimated | low | Press reports iOS/macOS 27 uniform radius vs Tahoe (16–26pt); HIG omits exact pt |
| `macos.window.states` | Active (key/main), Inactive, Minimized | enum | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/windows | Official | high | Traffic lights turn `#000@0.1` / `#FFF@0.15` when window loses key focus |
| `macos.trafficLights.geometry` | `diameter: 14, gap: 9, inset: 16, centerY: 26` | pt | macOS 26/27 | Both | `tokens/layout.json` | Estimated | med | Colors `#FF5F57` / `#FEBC2E` / `#28C840`; glyphs visible on group hover only |
| `macos.menuBar.height` | `24` (extras & Apple menu) | pt | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/the-menu-bar | Official | high | iPadOS menu bar hidden by default & puts window controls inside when full-screen |
| `macos.toolbar.height` | `52` (compact `38`) | pt | macOS 26/27 | Both | https://developer.apple.com/design/human-interface-guidelines/toolbars | Estimated | med | Group related toolbar items; separate distinct groups with `ToolbarSpacer.fixed` |
| `macos.sidebar.appearance` | Edge-to-edge under window background, colored icons default | behavior | macOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/sidebars | Official | high | June 8, 2026 HIG: icons take app/system accent color; Light `#FAFAFA@0.8` / Dark `#0C0C0C@0.85` Measured in kit |
| `macos.sidebar.dimensions` | `min: 180, default: 220, max: 320, row: 32` | pt | macOS 26/27 | Both | `tokens/layout.json` | Estimated | med | Use `NSBackgroundExtensionView` / `.backgroundExtensionEffect()` to mirror hero media beneath |
| `macos.splitView.divider` | `1` (`thin` divider style) | pt | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/split-views | Official | high | Prevents wasted space while remaining draggable; avoid small panes hiding divider |
| `macos.controlSizes` | `16 (mini) / 20 (small) / 24 (reg) / 28 (large) / 36 (XL)` | pt | macOS 26/27 | Both | `tokens/layout.json` | Estimated | med | Supports new `extraLarge` size in macOS 26+; expand hit region when Mac has touch display (Oct 2026) |
| `macos.button.borderedFill` | `#000000@0.08` (Idle Light content area) | sRGB hex/alpha | macOS 27 | Light | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Exact kit Content Area `01 - Bordered / 01 - Idle` token |
| `macos.button.imagePadding` | `10` | px/pt | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/buttons | Official | high | Clickable margin between image edges and invisible image button bounds |
| `macos.input.borderIdle` | `#000000@0.05` (`1 px` solid, Light `#FFFFFF` fill) | sRGB/px | macOS 27 | Light | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Paired with measured `3.5px@0.25` + `1px@0.15` `#0088FF` Focus Ring (`Global.Focus Ring`) |
| `macos.toggle.variants` | Switch (`38×22` Est.) vs Checkbox (single toggle) vs Radio (`<=5`) | guidelines | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/toggles | Official | high | Over ~5 mutually exclusive options -> use Pop-Up button, not radio stack |
| `macos.slider.types` | Linear (with/without ticks) & Circular (`0–360°` / continuous) | HIG styles | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/sliders | Official | high | Show value tooltip on pointer hover over thumb |
| `macos.menu.glassFills` | Light `#E6E6E6@0.55` / Dark `#5A5A5A@0.5` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Common menu items auto-gain icons from standard selectors (June 8, 2026); `24pt` item height Est. |
| `macos.menu.tableDefaults` | `rowHeight: 24`, `alternatingRows: true`, resizable sortable columns | spec/HIG | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/lists-and-tables | Official | high | Use `OutlineView` (disclosure triangles, descriptive headers without colons) for trees |
| `macos.settings.placement` | `AppMenu > Settings…` (`Cmd+,`); width `~715pt` Est. | HIG rule | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/settings | Official | high | NEVER put a Settings gear button inside the window toolbar |

---

## 2. Key macOS vs iOS Rules Enforced in `apple-web` / `apple-tauri`
1. **Menu Bar & Toolbars**: Every command available via toolbar or context menu MUST also appear in the top menu bar (`App`, `File`, `Edit`, `Format`, `View`, `Window`, `Help`). Short one-word titles preferred.
2. **File > Duplicate vs Save As**: Apple HIG (`The menu bar`) prefers `Duplicate` (holding `Option` transforms it to `Save As…`) instead of listing both `Save As` and `Export`.
3. **Never Place Controls in Window Frame**: Checkboxes, radio buttons, switches, and help/image buttons belong in the **window body**, NOT in the toolbar or bottom status bar (`toolbars` only get `ToolbarItem`s).
4. **Touch on Mac (Oct 28, 2026 HIG Update)**: Mac apps with touch displays or Sidecar keep pointer+keyboard primary and **keep layout/element positions stable** regardless of touch vs trackpad, while allowing expandable touch targets cleanly without overlapping hit areas.
5. **Tooltip Timing**: Show hover tooltip after pointer rests (`~1000ms` Est.) on toolbar/square icon buttons; also use expansion tooltips for truncated table/text-field values.

---

## 3. Gaps & Open Questions
- Exact numeric corner radius of macOS 27 windows (`12pt` vs `16pt`) and `52pt` toolbar height need measurement directly on Xcode 27 / macOS 27 `.nib` or Accessibility Inspector.

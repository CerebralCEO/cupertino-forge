# 02 — Color System: Semantic Tokens, Dark Elevated, Vibrancy & Display P3

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/color.json`, `skills/apple-design-core/references/foundations/color.md`, `scripts/contrast-check.mjs`, ও cross-platform CSS/Flutter থিমের প্রামাণ্য রঙের দলিল; ১২টি সিস্টেম রঙ, macOS Vibrant সংস্করণ, iOS Base বনাম Elevated Dark Mode, এবং Liquid Glass-এর ওপরে ব্যবহৃত monochrome লেবেল টোকেন এখানে সংরক্ষিত আছে।

---

## 1. Color System Architecture (Apple HIG Official + Kit Measurements)

1. **HIG JSON Nuance (`Color` DocC vs Sketch Kits)**: Official Apple HIG ([Color](https://developer.apple.com/design/human-interface-guidelines/color)) JSON-এ system color ও gray swatch-গুলো hex টেক্সটের বদলে PNG ছবি হিসেবে এমবেড করা; তাই সুনির্দিষ্ট sRGB hex মান এসেছে অফিশিয়াল Apple iOS 27 ও macOS 27 Sketch UI Kit exports থেকে (`Class: Measured`), আর Increased Contrast (`HC`) hex মানগুলো HIG swatch page-অনুসারী plugin `tokens/color.json` থেকে নেওয়া (`Class: Inferred` — Xcode Asset Catalog দিয়ে যাচাই বাকি)।
2. **Dark Mode Two Tiers (`Base` vs `Elevated`)**: iOS/iPadOS Dark Mode-এ পুরো-স্ক্রিন ভিউ `#000000` (`Base`), আর উপরে ওঠা sheet/popover/alert বা multitasking বিভাজনে `#1C1C1E` / `#2C2C2E` (`Elevated`) ব্যবহৃত হয় ([Dark Mode HIG](https://developer.apple.com/design/human-interface-guidelines/dark-mode))।
3. **macOS Desktop Tinting & Vibrant Colors**: macOS-এ Graphite accent থাকলে উইন্ডো ওয়ালপেপারের রঙ শুষে নেয় (`desktop tinting`); তাই নিরপেক্ষ কন্ট্রোলের ব্যাকগ্রাউন্ডে আংশিক স্বচ্ছতা রাখলেও রঙিন active কন্ট্রোলে স্বচ্ছতা দেওয়া নিষেধ।
4. **Monochrome Text Over Liquid Glass**: Glass-এর ওপরে টেক্সট সবসময় নিরপেক্ষ monochrome (`labelOnGlassIOS` `#1A1A1A`/`#EDEDED` বা `labelVibrantMacOS`), আর ব্র্যান্ড/অ্যাকসেন্ট রঙ কেবল প্রাইমারি অ্যাকশনে (`tinted`) যায়।

---

## 2. Complete Quantitative Color Matrix (9-Column Spec)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `color.system.red` | `#FF383C` / `#FF4245` (`HC: #E9152D / #FF6165`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Exact match across iOS & macOS 27 kits; HC `Inferred` from HIG |
| `color.system.orange` | `#FF8D28` / `#FF9230` (`HC: #C55300 / #FFA056`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical in both kits; HC `Inferred` |
| `color.system.yellow` | `#FFCC00` / `#FFD600` (`HC: #A16A00 / #FEDF43`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Caution on white light surfaces without contrast check |
| `color.system.green` | `#34C759` / `#30D158` (`HC: #008932 / #4AD968`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Default toggle ON color on iOS |
| `color.system.mint` | `#00C8B3` / `#00DAC3` (`HC: #008575 / #54DFCB`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.system.teal` | `#00C3D0` / `#00D2E0` (`HC: #008198 / #3BDDEC`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.system.cyan` | `#00C0E8` / `#3CD3FE` (`HC: #007EAE / #6DD9FF`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.system.blue` | `#0088FF` / `#0091FF` (`HC: #1E6EF4 / #5CB8FF`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Default Apple accent color |
| `color.system.indigo` | `#6155F5` / `#6D7CFF` (`HC: #564ADE / #A7AAFF`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.system.purple` | `#CB30E0` / `#DB34F2` (`HC: #B02FC2 / #EA8DFF`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.system.pink` | `#FF2D55` / `#FF375F` (`HC: #E7124D / #FF8AC4`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.system.brown` | `#AC7F5E` / `#B78A66` (`HC: #956D51 / #DBA679`) | sRGB hex | iOS 27 / macOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Identical across iOS & macOS 27 |
| `color.mac.vibrantBlueRed` | `blue: #0078F0/#0A99FF`, `red: #F52F32/#FF4747` (12 vibrant tokens) | sRGB hex | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Light pairs with `plus-darker`; Dark pairs with `plus-lighter` |
| `color.gray.ios1to6` | `Gray #8E8E93` .. `Gray6 #F2F2F7 / #1C1C1E` | sRGB hex | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | 6 stepped semantic grays (full HC in `json/color.json`) |
| `color.gray.macos` | `gray: #8E8E93 / #98989D`; `vibrant: #848489 / #A2A2A7` | sRGB hex | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | macOS uses 1 neutral gray pair + vibrant pair |
| `color.label.iosStandard` | `primary: #000/#FFF`, `sec: #3C3C43@0.6/#EBEBF5@0.6`, `ter: 0.3`, `quat: 0.18/0.16`, `quin: 0.09` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Placeholder matches tertiary `0.3` alpha |
| `color.label.iosOnGlass` | `pri: #1A1A1A/#EDEDED`, `sec: #727272/#8A8A8A`, `ter: #BFBFBF/#404040` | sRGB hex | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Monochrome label ramp for Liquid Glass bars & pills |
| `color.label.macos` | `pri: #000@0.85/#FFF`, `sec: 0.5/0.55`, `ter: 0.25`, `quat: 0.1`, `quin: 0.05`, `sex: 0.03` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | 6 alpha tiers in macOS 27 kit |
| `color.fill.ios` | `pri: #787878@0.2/#787880@0.36`, `sec: 0.16/0.32`, `ter: 0.12/0.24`, `quat: 0.08/0.18`, `quin: 0.02` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Interactive thin controls, badges & grouped highlights |
| `color.bg.iosPrimaryAndGrouped` | `Light: #FFF/#F2F2F7`, `DarkBase: #000/#1C1C1E/#2C2C2E`, `DarkElev: #1C1C1E/#2C2C2E/#3A3A3C` | sRGB hex | iOS 27 | Light / Dark Base / Elev | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Switch from Base to Elevated on sheets/popovers/split layers |
| `color.separator.ios` | `nonOpaque: #000@0.12/#FFF@0.12`; `opaque: #C6C6C8/#38383A` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Hairline `0.5px` on `@2x`/`@3x` screens |
| `color.mac.windowAndSidebar` | `win: #FFF/#1E1E1E`; `sidebarActive: #FAFAFA@0.8/#0C0C0C@0.85`; `inact: #F4F4F4/#2E2E2E@0.85` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Edge-to-edge sidebar substrate |
| `color.mac.separatorLightDark` | `Light: #3C3C43@0.29` (Measured); `Dark: #FFFFFF@0.1` (Estimated) | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | med | macOS 27 kit JSON omits Dark separator; dark value is Estimated |
| `color.mac.focusRing` | `outer: 3.5px accent@0.25`, `inner: 1px accent@0.15` | px / alpha | macOS 27 | Both | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Directly verified in `Global.Focus Ring` of macOS 27 kit |
| `color.dimming.sheetAndClearGlass` | Clear glass dim: `#000@0.35` (`Official`); Sheet scrim: `#000@0.2 / @0.48` (`Estimated`) | sRGB hex/alpha | iOS 27 | Light / Dark | https://developer.apple.com/design/human-interface-guidelines/materials | Official | high | `35%` bright-media clear glass rule is Official HIG; sheet scrim is Estimated |

---

## 3. Gaps & Open Questions
- Increased Contrast (`lightHC`, `darkHC`) hex values এবং `macOSSurfaces.separator.dark` (`#FFFFFF@0.1`) ও `selection.unemphasizedSelectedBackground` (`#DCDCDC`/`#464646`) Apple Xcode Asset Catalog থেকে `Measured` হিসেবে যাচাই বাকি।
- Display P3 wide-gamut (`color(display-p3 ...)`) values raw Sketch JSON-এ `srgb` হিসেবে এক্সপোর্ট হওয়ায় P3 equivalents সরাসরি পাওয়া যায়নি (`Unknown`)।

# 04 — Layout, Grid Rhythm, Safe Areas, Devices & Adaptive Breakpoints

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/layout.json`, `skills/apple-design-core/references/foundations/layout.md`, `apple-web`, ও `apple-flutter`-এর সমস্ত স্পেসিং, গ্রিড, সেফ এরিয়া, ডিভাইস ভিউপোর্ট এবং অ্যাডাপ্টিভ ব্রেকপয়েন্টের প্রামাণ্য নথি।

---

## 1. Layout Architecture & Size Classes (Official HIG + Measured Devices)

Apple HIG ([Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — আপডেট `Sep 9, 2025` & `Sep 9, 2026`):
- প্রাইমারি কন্টেন্টকে কখনো ডিসপ্লে কোণ, Dynamic Island, হোম ইন্ডিকেটর বা উইন্ডো ক্রোম দিয়ে কাটতে দেওয়া যাবে না — সবসময় **Safe Area Insets** ও **Readable Content Guide** মানতে হবে।
- Web/Flutter-এ OS ডিভাইসের নাম চেক করে নয়, বরং **available viewport width (Size Class)** + **input precision (`pointer: fine`)** দেখে iOS compact (`< 768 pt`), iPadOS regular (`768–1179 pt`), ও macOS desktop (`>= 1180 pt`) লেআউট বাছাই করতে হবে।

---

## 2. Quantitative Layout & Device Specifications (9-Column Spec)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `layout.baseGrid` | `4` (`scale: 0,2,4,6,8,10,12,16,20,24,32,40,48,64`) | pt | All | Both | `tokens/layout.json` | Inferred | high | Apple interfaces align on `4pt` baseline, favoring `8`, `16`, `20` |
| `layout.readableContentWidth` | `672` | pt | iPadOS / Web | Both | https://developer.apple.com/design/human-interface-guidelines/layout | Inferred | med | UIKit `readableContentGuide` typical measure (~60–75 chars) [Re-audited: Inferred from non-kit source] |
| `layout.margins.compact` | `16` (`regular: 20`, `macos: 20`) | pt | iOS / iPadOS / macOS | Both | https://developer.apple.com/design/human-interface-guidelines/widgets | Inferred | high | Matches HIG 16pt widget standard margin on compact screens |
| `device.iPhoneSE3` | `375 × 667` (`@2x`, safe `top: 20, bot: 0`) | pt | iOS | Both | https://useyourloaf.com/blog/iphone-screen-resolutions/ | Inferred | high | Non-notched rectangular display reference [Re-audited: Inferred from non-kit source] |
| `device.iPhone15_16_Pro` | `393 × 852` (`@3x`, safe `top: 59, bot: 34`) | pt | iOS 17–26 | Both | https://screens.guide/ | Inferred | high | Dynamic Island top `59pt` on 15/16/16 Pro (plugin assumed 62pt for all DI phones) [Re-audited: Inferred from non-kit source] |
| `device.iPhone17_17Pro` | `402 × 874` (`@3x`, safe `top: 62, bot: 34`) | pt | iOS 26–27 | Both | https://screens.guide/ | Inferred | high | 6.3-inch chassis (`iPhone 16 Pro` / `17` / `17 Pro`) [Re-audited: Inferred from non-kit source] |
| `device.iPhone17ProMax` | `440 × 956` (`@3x`, safe `top: 62, bot: 34`) | pt | iOS 26–27 | Both | https://screens.guide/ | Inferred | high | 6.9-inch chassis (`16 Pro Max` / `17 Pro Max`) [Re-audited: Inferred from non-kit source] |
| `device.iPadPro11` | `834 × 1194` (`@2x`, safe `top: 24, bot: 20`) | pt | iPadOS 18–27 | Both | https://useyourloaf.com/ | Inferred | high | Standard portrait regular size class [Re-audited: Inferred from non-kit source] |
| `device.iPadPro13` | `1024 × 1366` (`@2x`, safe `top: 24, bot: 20`) | pt | iPadOS 18–27 | Both | https://useyourloaf.com/ | Inferred | high | Top-tier M4/M5 canvas [Re-audited: Inferred from non-kit source] |
| `layout.breakpoints` | `compact: 0–767`, `regular: 768–1179`, `desktop: >=1180` | pt | Web / Flutter | Both | `tokens/layout.json` | Inferred | high | Maps to iOS (`compact`), iPad (`regular`), macOS (`>=1180` or fine pointer) |
| `layout.hitTarget.ios` | `44 × 44` (`min 28 × 28`) | pt | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Target padding `12pt` bezeled / `24pt` bezel-less |
| `layout.hitTarget.macos` | `28 × 28` (`min 20 × 20`) | pt | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Desktop pointer minimum |
| `layout.liveActivity.ios` | `408×84..160` (`430×932`), `371×84..160` (`393×852`), compact circle `28×28` | pt | iOS 16–27 | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Oct 13, 2026 limited-width rule (`28×28`); Lock Screen margin `14pt` |
| `layout.zIndexLayers` | `content:0, scrollEdge:10, bars:20, floatBtn:30, popover:40, sheet:50, alert:60, toast:70` | CSS z-index | Web | Both | `tokens/layout.json` | Estimated | high | Stacking discipline matching Apple window hierarchy |

---

## 3. Gaps & Open Questions
- `iPhone Air` exact safe-area top inset (`62pt` vs `68pt` due to shifted Dynamic Island position reported in hardware reviews) should be confirmed in Simulator `safeAreaInsets` (`Platform-dependent`).
- `iPhone 15 / 16` uses `59pt` safe-area top while `16 Pro / 17 / 17 Pro` uses `62pt` — `tokens/layout.json` currently uses a single constant `topDynamicIsland: 62` (`DIFF-VS-PLUGIN.md` item).

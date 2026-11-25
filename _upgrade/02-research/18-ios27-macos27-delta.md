# 18 — iOS 27 & macOS 27 Delta: Official Changelogs vs Secondary Press Reports

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `apple-design-core` ও `DIFF-VS-PLUGIN.md`-এর জন্য iOS 26/27 ও macOS 26/27-এ কী সত্যিকারের নতুন পরিবর্তন এসেছে তার কঠোর শ্রেণিবিন্যাস — যেখানে Apple-এর নিজস্ব **Official DocC Changelogs (2025–2026)** এবং **Secondary Press (WWDC 2026)** আলাদা স্তরে ভাগ করা হয়েছে, যাতে কোনো আনুমানিক প্রেস রিপোর্টকে Official সত্য হিসেবে না ধরা হয়।

---

## 1. Tier A — Official Apple DocC Changelogs (June 2025 – Oct 2026)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `delta.oct2026.macTouchInput` | Added guidance for touch input on Mac & expanding targets cleanly | HIG changelog (`Oct 28, 2026`) | macOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/designing-for-macos | Official | high | Cross-verified in both `designing-for-macos.json` & `gestures.json` |
| `delta.oct2026.appIconFormats` | Documented nonlayered bitmap vs layered Icon Composer options | HIG changelog (`Oct 28, 2026`) | iOS / macOS 27 | 6 modes | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Builds atop `June 8, 2026` "Refined Liquid Glass" icon update |
| `delta.oct2026.liveActivitiesLimited` | Limited-width Dynamic Island layouts (`28×28 pt` circle) | HIG changelog (`Oct 13, 2026`) | iOS / watchOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | `isDynamicIslandLimitedInWidth`; Widgets updated same day for HomeView |
| `delta.sep2026.layoutBestPractices` | Updated Layout best practices (`Sep 9, 2026`; follows `iPhone 17/Air/Pro` `Sep 9, 2025`) | HIG changelog | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/layout | Official | high | Safe area & continuous container alignment focus |
| `delta.jun2026.sidebarColoredIcons` | Sidebar icons use app/system accent color by default | HIG changelog (`June 8, 2026`) | macOS 27 / iPadOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/sidebars | Official | high | Semantic fixed colors (e.g. Mail VIP yellow) used sparingly |
| `delta.jun2026.searchTrailingTab` | Search as standalone trailing tab in iOS (`Tab(role: .search)`) | HIG changelog (`June 8, 2026`) | iOS 26/27 | Both | https://developer.apple.com/design/human-interface-guidelines/search-fields | Official | high | Accompanies `.tabBarMinimizeBehavior(.onScrollDown)` |
| `delta.jun2026.scrollEdgeMenuIcons` | Refined ScrollEdgeEffect (`soft`/`hard`/`automatic`) & standard Menu item icons | HIG changelog (`June 8, 2026`) | iOS / macOS 26–27 | Both | https://developer.apple.com/design/human-interface-guidelines/scroll-views | Official | high | Plus `Mar 24, 2026` Sheets Cancel-leading/Done-trailing update |
| `delta.jul2025.sfSymbols7` | SF Symbols 7 Draw On / Draw Off & linear gradient rendering | HIG changelog (`July 28, 2025`) | All `26–27` | Both | https://developer.apple.com/design/human-interface-guidelines/sf-symbols | Official | high | Plus `Dec 16, 2025` Writing pronoun guidance & CarPlay Live Activities |

---

## 2. Tier B — Secondary Press Reports (WWDC 2026 iOS 27 / macOS 27 — Needs Hardware Verification)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `delta.press.glassIntensitySlider` | Continuous Settings slider replacing binary Clear/Tinted presets | UI setting report | iOS 27 / macOS 27 | Both | https://www.macrumors.com/ | Inferred | med | Reported across MacRumors, Lifehacker, TechCrunch; improves background diffusion & specular edges |
| `delta.press.edgeToEdgeSidebar` | iPadOS / macOS sidebars extend full window height & retain icon tint | UI behavior report | iPadOS 27 / macOS 27 | Both | https://www.macrumors.com/ | Inferred | med | Aligns with `June 8, 2026` Official Sidebars changelog & `.backgroundExtensionEffect()` |
| `delta.press.uniformWindowRadius` | macOS 27 standardizes window corner radius (`~12 pt` vs Tahoe `16–26pt`) | geometry report | macOS 27 | Both | https://www.macrumors.com/ | Estimated | low | HIG omits numeric window radius (`Unknown` exact pt until measured on macOS 27) |

---

## 3. Gaps & Open Questions
- এই ডেল্টার যেসব অংশ Tier B (`Inferred`/`Estimated`), তা কেবল Apple macOS 27 / iOS 27 Xcode Simulator ও Asset Catalog ডাম্প করার পরই `Official` বা `Measured` হবে।

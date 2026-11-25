# 03 — Typography, Optical Sizing, Tracking & Non-Latin Type Rules

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/typography.json`, `apple-design-core` (`typography`), `apple-web`, `apple-flutter`, এবং `apple-design-audit` / `lint.mjs`-এর টাইপোগ্রাফি টোকেন ও CSS/Flutter ফন্ট ম্যাপিংয়ের Official সূত্র; iOS 27 Dynamic Type (`12×11`), macOS text styles, SF Pro tracking (`1/1000 em`), এবং `tokens/source/*.tokens.json`-এর সঙ্গে Official HIG-এর অমিল এখানে নথিভুক্ত আছে।

---

## 1. Tracking Mystery Resolution (Kit vs Official HIG)

পূর্ববর্তী অডিটে প্রশ্ন ছিল `tokens/typography.json`-এর tracking টেবিলের উৎস কী, কারণ `tokens/source/apple-ios-27-ui-kit.tokens.json` এবং `apple-macos-27-ui-kit.tokens.json`-এর raw Sketch export-এ প্রতিটি text style-এ `letterSpacing: 0` ছিল।
**সমাধান (Official Verified)**: Apple-এর অফিসিয়াল DocC endpoint `https://developer.apple.com/design/human-interface-guidelines/typography` (`hig__typography.json`) নিজেই পূর্ণাঙ্গ Tracking টেবিল প্রকাশ করে (`SF Pro` ৬৪টি size `6–96 pt`, `SF Pro Rounded` ৬৪টি, `New York` ৫৭টি, এবং `macOS tracking values` ৬৪টি)। Python script (`diff_tokens_vs_official.py`) চালিয়ে যাচাই করা হয়েছে:
- `tokens/typography.json`-এর **১৩২টি iOS Dynamic Type cell (`12 categories × 11 styles`) Official HIG-এর সঙ্গে ০টি অমিল (`0 diffs`)**।
- `tokens/typography.json`-এর `sfProIOS` (৬৪ row), `sfProRounded` (৬৪ row), ও `sfProMacOS` (৬৪ row) tracking টেবিল **Official HIG-এর সঙ্গে ০টি অমিল (`0 diffs`)**।
*(পূর্ণ ১৩২+৬৪×৩ ডেটাসেট `_upgrade\02-research\json\typography.json`-এ `Class: Official` হিসেবে সংরক্ষিত আছে।)*

---

## 2. Official Optical Sizing, Weights & Tracking Specifications

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `typo.ios.defaultBody` | `17` | pt (22 pt leading) | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Dynamic Type `Large` default; `tracking: -0.026 em` (`-0.43 pt`) |
| `typo.ios.minimumSize` | `11` | pt | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | `Caption 2` default floor (`tracking: +0.006 em`) |
| `typo.macos.defaultBody` | `13` | pt (16 pt leading) | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | System UI default; `tracking: -0.006 em` (`-0.08 pt`) |
| `typo.macos.minimumSize` | `10` | pt | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | `Footnote`/`Caption 1`/`Caption 2` (`tracking: +0.012 em`) |
| `typo.opticalBoundary` | `Text <=19 / Display >=20` | pt | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | SF Pro Variable interpolates optically; tracking sign flips between 22pt (`-0.012em`) and 24pt+ (`+0.003em`..`+0.014em`) |
| `typo.tracking.11pt` | `+6` (`0.006` em / `+0.06` pt) | 1/1000 em | iOS / macOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Caption 2 (`iOS`) / Subheadline (`macOS`) |
| `typo.tracking.13pt` | `-6` (`-0.006` em / `-0.08` pt) | 1/1000 em | iOS / macOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Footnote (`iOS`) / Body (`macOS`) |
| `typo.tracking.15pt` | `-16` (`-0.016` em / `-0.23` pt) | 1/1000 em | iOS / macOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Subheadline (`iOS`) / Title 3 (`macOS`) |
| `typo.tracking.17pt` | `-26` (`-0.026` em / `-0.43` pt) | 1/1000 em | iOS / macOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Body & Headline (`iOS`) / Title 2 (`macOS`) |
| `typo.tracking.20pt` | `-23` (`-0.023` em / `-0.45` pt) | 1/1000 em | iOS / macOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Title 3 (`iOS`) |
| `typo.tracking.22pt` | `-12` (`-0.012` em / `-0.26` pt) | 1/1000 em | iOS / macOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Title 2 (`iOS`) / Title 1 (`macOS`) |
| `typo.tracking.28pt` | `+14` (`+0.014` em / `+0.38` pt) | 1/1000 em | iOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Title 1 (`iOS`) |
| `typo.tracking.34pt` | `+12` (`+0.012` em / `+0.40` pt) | 1/1000 em | iOS (SF Pro) | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Large Title (`iOS`) |
| `typo.ax5.maxScaling` | `40` (Cap2) – `60` (LargeTitle) | pt | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | Body grows from `17pt` (`Large`) to `53pt` (`AX5`, >300%) |
| `typo.enlargementTarget` | `200` (`140` watchOS) | % | All | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Minimum enlargement support for text & icons |
| `typo.dynamicTypeExclusion` | `UIApplication.shared` chrome/tabs | rule | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Official | high | HIG: do not bloat secondary tab bar labels into unreadability under AX sizes; prioritize readable content |

---

## 3. Known Discrepancies: Raw Sketch UI Kit vs Official HIG

| Token / Platform | Raw Sketch Kit Value (`tokens/source/`) | Official HIG & `tokens/typography.json` | Resolution |
| --- | --- | --- | --- |
| iOS `Caption 1` Emphasized | `500` (Medium) | `600` (Semibold) | Keep Official HIG (`600`) |
| macOS `Headline` Emphasized | `900` (Black) | `800` (Heavy) | Keep Official HIG (`800`) |
| macOS `Caption 1` Emphasized | `600` (Semibold) | `500` (Medium) | Keep Official HIG (`500`) |
| macOS `Caption 2` Default | `400` (Regular) | `500` (Medium) | Keep Official HIG (`500`) |

---

## 4. Platform Rendering, Tabular Numerals & Non-Latin Rules

1. **System Font Stack (`Web` / `Flutter`)** *(Untested)*:
   - Web Latin: `font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;` (Modern Safari/Chrome on macOS 11+/iOS maps `system-ui` / `-apple-system` to San Francisco variable font with continuous `opsz`).
   - Serif (New York): `font-family: ui-serif, "New York", Georgia, serif;`.
   - Monospace (SF Mono): `font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;`.
   - Tabular figures for timers, prices, counters: CSS `font-variant-numeric: tabular-nums;` / SwiftUI `.monospacedDigit()` / Flutter `fontFeatures: [FontFeature.tabularFigures()]`.
2. **Minimum Weight on Thin Strokes**: Apple HIG (`Typography` & `Accessibility`) warns that thin/ultralight weights require larger point sizes to stay legible; never use weight `< 400` below `20 pt`.
3. **Non-Latin Exclusion (`bn`, `ar`, `hi`)**: Negative tracking (`-0.026em`..`-0.006em`) **শুধু Latin/Cyrillic/Greek script-এ প্রয়োগযোগ্য**; বাংলা (`Kohinoor Bangla`) ও আরবি (`SF Arabic`) টেক্সটে `letter-spacing: 0` বাধ্যতামূলক (বিস্তারিত `17-localization-rtl.md`)।

---

## 5. Gaps & Open Questions
- Non-Apple OS-এ (Windows/Linux Web বা Android Flutter) `-apple-system` না থাকায় `tracking` টেবিল (`-0.026em`) Fallback font-এ (`Segoe UI` / `Roboto` / `Inter`) কিছুটা ভিন্ন kerning দিতে পারে; fallback optical metrics verification বাকি।
- iOS 27 / macOS 27 SwiftUI `Font.TextStyle` default sizes Xcode 27-এ বদলেছে কি না তা doc-এ আপডেট হয়নি (`hig__typography.json` এখনো একই 11 styles প্রকাশ করে)।

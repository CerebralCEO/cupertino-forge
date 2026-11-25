# 05 — Shape, Continuous Squircles, Concentricity & Display Radii

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/shape.json`, `skills/apple-design-core` (`shape-geometry`), `apple-web`, এবং `apple-flutter`-এর সমস্ত কর্নার রেডিয়াস, কনসেন্ট্রিক ফর্মুলা ও হার্ডওয়্যার ডিসপ্লে বক্রতার রেফারেন্স — যেখানে plugin-এর কিছু device corner radius (`iPhone 17 Pro`, `iPad Pro`) কমিউনিটি হার্ডওয়্যার পরিমাপের সঙ্গে অমিল দেখা গেছে।

---

## 1. Continuous Corners & Concentricity Mechanics

1. **Superellipse Continuity (G2 Curves)**: সাধারণ `border-radius` যেখানে সরাসরি লাইন থেকে বৃত্তাকার আর্কে ঝাঁপ দেয় (G1 discontinuity), Apple-এর `.continuous` corner curvature ধীরে ধীরে বৃদ্ধি পায় — গণিতে এটি প্রায় quintic (`n ≈ 5`) superellipse-এর সমতুল্য, অথবা Figma-তে **`60%` corner smoothing**।
2. **Concentricity (`ConcentricRectangle` / `UICornerConfiguration`)**: একটি প্যানেল (`R_outer`) এর ভেতরে `p` মার্জিন/প্যাডিং দিয়ে বসানো কার্ড বা বাটনের কোণা হবে:
   $$\text{R}_{\text{inner}} = \max(\text{R}_{\text{outer}} - p,\ \text{R}_{\text{min}})$$
   SwiftUI 26+ এ `.clipShape(.rect(corners: .concentric(minimum: 4)))` অথবা `ConcentricRectangle()` স্বয়ংক্রিয়ভাবে প্যারেন্ট কনটেইনার ও হার্ডওয়্যার বেজেলের বক্রতা অনুসরণ করে ([ConcentricRectangle](https://developer.apple.com/documentation/swiftui/concentricrectangle))।
3. **Browser `corner-shape: squircle` Nuance**: Modern CSS `corner-shape: squircle` (Chromium `139+`, Safari `18.4+`, Firefox `148+`) `superellipse(2)` সমতুল্য (যা প্রায় quartic `n=4`), তাই pixel-exact quintic সাদৃশ্যের জন্য `tokens/shape.json`-এর SVG `<clipPath>` / Flutter `ClipRSuperellipse` (`Flutter 3.32+`) বেশি নিখুঁত।

---

## 2. Quantitative Shape & Corner Radius Specifications

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `shape.continuous.figmaSmoothing` | `0.60` (`60%`) | ratio | Design Tools / All | Both | https://www.figma.com/blog/desperately-seeking-squircles/ | Inferred | high | Industry benchmark matching Apple iOS UIKit bezier curve [Re-audited: Inferred from non-kit source] |
| `shape.continuous.superellipseN` | `~5` (`quintic`) | exponent | All Apple | Both | https://grida.co/ | Inferred | med | CSS `corner-shape: squircle` equals `superellipse(2)` (`n=4`) |
| `shape.concentric.formula` | `max(outer - padding, minimumInner)` (`min: 4`) | pt | iOS 26+ / macOS 26+ | Both | https://developer.apple.com/documentation/swiftui/concentricrectangle | Official | high | `UICornerConfiguration` on UIKit |
| `shape.display.iPhone15_16` | `55` | pt | iOS 17–26 | Both | https://github.com/kylebshr/ScreenCorners | Inferred | high | Measured via `_displayCornerRadius` private SPI (`ScreenCorners`) [Re-audited: Inferred from non-kit source] |
| `shape.display.iPhone16Pro_17Pro` | `62` | pt | iOS 18–27 | Both | https://github.com/kylebshr/ScreenCorners | Inferred | med | **Conflict**: Plugin `shape.json` had `55pt` for iPhone 17 Pro; ScreenCorners reports `62pt` for 16 Pro+ [Re-audited: Inferred from non-kit source] |
| `shape.display.iPhoneSE3` | `0` | pt | iOS | Both | https://developer.apple.com/ | Official | high | Square hardware screen corners |
| `shape.display.iPadPro_M4_M5` | `18` | pt | iPadOS 18–27 | Both | https://github.com/kylebshr/ScreenCorners | Inferred | med | **Conflict**: Plugin `shape.json` had `30pt`; ScreenCorners measures `18pt` on OLED iPad Pro [Re-audited: Inferred from non-kit source] |
| `shape.appIcon.maskRatio` | `22.37` | % of icon size | iOS / macOS | Both | https://developer.apple.com/design/human-interface-guidelines/app-icons | Inferred | med | Never pre-clip 1024px icons; OS masks automatically |
| `shape.ios.sheetFloating` | `38` | pt | iOS 26/27 | Both | `tokens/shape.json` | Estimated | med | Floating medium-detent sheet (`26pt` insetGrouped section/menu/popover; `22pt` card; `34pt` alert) |
| `shape.macos.window` | `12` | pt | macOS 27 | Both | https://www.macrumors.com/ | Estimated | low | Secondary press uniform radius vs Tahoe `16–26pt`; needs macOS 27 window measurement |
| `shape.macos.controls` | `alert/popover: 16`, `menu: 12`, `card: 10`, `input: 6`, `checkbox: 4` | pt | macOS 26/27 | Both | `tokens/shape.json` | Estimated | med | Push buttons in toolbar = capsule; inside content area = `6–8pt` |
| `shape.border.hairline` | `0.5` (`1px @0.5 alpha` on `1x` screens) | px | All | Both | `tokens/shape.json` | Estimated | high | Avoid visible borders on iOS cards/inputs |

---

## 3. Gaps & Open Questions
- **iPhone 17 Pro (`55pt` vs `62pt`) ও iPad Pro (`30pt` vs `18pt`)**: Physical hardware বা Xcode 27 Simulator-এ `UIScreen.main.value(forKey: "_displayCornerRadius")` রান করে চূড়ান্ত নিশ্চিত করতে হবে।
- macOS 27-এর "uniform window corner radius" (`12pt`) এখনো Apple HIG DocC-তে সংখ্যাসূচকভাবে প্রকাশিত হয়নি (`Estimated`)।

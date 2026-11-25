# 12 — SF Symbols 7, Interface Icons & Layered App Icons

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `apple-design-core` (`icons` / `sf-symbols`), `apple-web`, `apple-flutter`, এবং `tokens/shape.json`-এর আইকন সিস্টেমের একমাত্র নির্ভরযোগ্য সূত্র; SF Symbols 7-এর নতুন অ্যানিমেশন ও গ্রেডিয়েন্ট রেন্ডারিং, ৪টি রেন্ডারিং মোড, ও Icon Composer ভিত্তিক iOS 26/27 / macOS 26/27 layered `.icon` স্পেক এখানে আছে।

---

## 1. SF Symbols 7 Architecture (Apple Official)

Apple HIG ([SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) — আপডেট `July 28, 2025`):
1. **Optical Weight Matching**: San Francisco-এর ৯টি weight (`Ultralight`..`Black`) ও ৩টি scale (`Small`, `Medium`, `Large`) সাথে অটোমেটিক align হয়; Web/Flutter-এ `lucide-react` বা `cupertino_icons` ব্যবহার করলে টেক্সটের optical weight অনুযায়ী `strokeWidth` বা size মেলাতে হবে।
2. **4 Rendering Modes**:
   - **Monochrome**: সব লেয়ারে একটিই রঙ।
   - **Hierarchical**: একটি রঙের ভিন্ন opacity স্তর (depth তৈরি করে)।
   - **Palette**: ২ বা ততোধিক রঙ স্তরভেদে (২টি দিলে `secondary` ও `tertiary` একই রঙ নেয়)।
   - **Multicolor**: নিজস্ব প্রাকৃতিক রঙ (`leaf` = সবুজ, `trash.slash` = লাল)।
3. **SF Symbols 7 New Features (`July 28, 2025`)**:
   - **Gradients**: একটি উৎস রঙ থেকে smooth linear gradient রেন্ডার করে (সব rendering mode-এ)।
   - **Draw On / Draw Off Animations**: Guide point বরাবর offscreen->onscreen বা onscreen->offscreen অঙ্কন animation (`all layers`, `staggered`, বা `by-layer`), যেমন ডাউনলোড প্রগতি বা directional arrow। (পূর্ববর্তী `Appear`, `Disappear`, `Bounce`, `Scale`, `Pulse`, `Variable color` [open/closed loop], `Replace` / `Magic Replace` [default], `Wiggle`, `Breathe`, `Rotate` সহ)।
4. **Negative Side Margins & RTL**: Badge-যুক্ত custom symbol হরিজন্টালভাবে center-align রাখতে `left-margin-Regular-M`-এর মতো negative side margins ব্যবহার হয়; Arabic, Hebrew, Hindi, Thai, CJK ও Indic numerals-এর জন্য script-specific symbol variant থাকে।
5. **Strict Copyright Boundary**: Apple product/hardware (`iPhone`, `AirPods`, `Apple Watch` ইত্যাদি — Inspector-এ Info ব্যাজযুক্ত) custom template হিসেবে পরিবর্তন বা app icon-এ ব্যবহার সম্পূর্ণ নিষিদ্ধ।

---

## 2. Layered App Icons & Specifications (2025–2026 HIG)

Apple HIG ([App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) — আপডেট `Oct 28, 2026` ও `June 8, 2026`):
- **Liquid Glass Icon Layers**: iOS, iPadOS, macOS, এবং watchOS আইকনে একটি full-bleed opaque background + ১ বা একাধিক foreground layer থাকে যা Icon Composer (`.icon`) দিয়ে compose করা হয়; OS স্বয়ংক্রিয়ভাবে specular highlight, refraction, blur ও shadow বসায় — তাই ডিজাইনে আগে থেকে static drop shadow, soft/feathered edge বা pre-baked rounded mask দেওয়া নিষেধ।

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `appIcon.iosMac.size` | `1024 × 1024` | px (Square input) | iOS / iPadOS / macOS 26–27 | 6 variants | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | OS applies squircle mask (`~22.37%` corner radius ratio Measured on exported masks) |
| `appIcon.watchOS.size` | `1088 × 1088` | px (Circular mask) | watchOS 10–27 | Default | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Avoid pure black `#000000` background on watchOS |
| `appIcon.tvOS.size` | `800 × 480` (`2–5` parallax layers) | px (Landscape) | tvOS | Default | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Foreground layers crop more during focus sway |
| `appIcon.visionOS.size` | `1024 × 1024` (bg + `1–2` upper layers) | px (Circular 3D) | visionOS | Default | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Avoid concave hole shapes in background layer |
| `appIcon.appearances` | `default`, `dark`, `clear light`, `clear dark`, `tinted light`, `tinted dark` | enum (6 modes) | iOS / iPadOS / macOS 26–27 | All | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Alternate icons MUST also provide dark/clear/tinted variants |
| `appIcon.colorSpaces` | `sRGB`, `Gray Gamma 2.2`, `Display P3` | gamut | iOS / iPadOS / macOS / tvOS / watchOS | All | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | visionOS icon gamut excluded from P3 note in table |
| `sfSymbol.scales` | `small`, `medium`, `large` | enum | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/sf-symbols | Official | high | Match Toolbar (`outline`) vs Tab Bar (`fill` in iOS) |
| `sfSymbol.animations` | `Appear`, `Disappear`, `Bounce`, `Scale`, `Pulse`, `VariableColor`, `Replace`/`MagicReplace`, `Wiggle`, `Breathe`, `Rotate`, `DrawOn`/`DrawOff` | enum (11+ effects) | iOS 17–27 / macOS 14–27 | Both | https://developer.apple.com/design/human-interface-guidelines/sf-symbols | Official | high | `Draw On/Off` & `Gradients` require SF Symbols 7 (2025+) |
| `web.iconApprox.stroke` | `1.5` (`medium`) / `2.0` (`semibold`) | px (`24x24` viewBox) | Web (`lucide-react` / SVG) | Both | `skills/apple-web` | Estimated | med | Approximates SF Symbol Regular/Medium stroke weight visually |
| `flutter.iconMapping` | `CupertinoIcons` (`cupertino_icons`) | package | Flutter | Both | https://pub.dev/packages/cupertino_icons | Official | high | Maps common iOS glyphs; missing SF Symbols 6/7 symbols require SVG bundle |

---

## 3. Variant Selection Rules (Toolbar vs Tab Bar vs Lists)
- **Toolbars & Navigation Bars**: `outline` variant (স্বচ্ছ, টেক্সট/কন্টেন্টের সাথে ভারসাম্যপূর্ণ)।
- **iOS Tab Bar & Swipe Actions**: `fill` variant (selection এবং solid action বোঝাতে); কিন্তু macOS বা list-এ সাধারণত outline।
- **Small Sizes (`12–15 pt`)**: Enclosed shape (`.circle`, `.square`) legibility বাড়ায়।

---

## 5. Gaps & Open Questions
- `app-icons` Oct 28, 2026 আপডেটে উল্লিখিত "App icon format options (nonlayered vs Icon Composer)" — নির্দিষ্ট Xcode 27 minimum version বা deprecation date এখনো DocC JSON-এ প্রকাশিত হয়নি।
- Web/Flutter-এ SF Symbols 7-এর `Draw On/Off` ও `Magic Replace` হুবহু পেতে হলে custom animated SVG paths (GSAP/CSS `stroke-dashoffset`) বানাতে হবে (`Untested`)।

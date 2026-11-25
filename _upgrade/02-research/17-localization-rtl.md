# 17 — Localization, RTL Mirroring & Non-Latin Typography (Bangla, Arabic, CJK)

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `apple-design-core` (layout, typography, patterns), `apple-web`, `apple-flutter`, এবং `apple-design-audit` / `lint.mjs`-এর RTL ও non-Latin नियम তৈরির জন্য ব্যবহৃত হবে; বিশেষত বাংলা (`bn`), আরবি/হিব্রু RTL (`ar`/`he`), logical CSS/Flutter properties, এবং bidi-safe text/numeral নির্দেশনার source হিসেবে কাজ করবে।

---

## 1. Core RTL Principles (Apple HIG Official)

Apple HIG ([Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)) অনুযায়ী:
1. **System frameworks mirror automatically** যখন standard layout constraints (`leading`/`trailing` বা CSS `inline-start`/`inline-end`, Flutter `EdgeInsetsDirectional`) ব্যবহার করা হয়।
2. **3+ line Paragraph Rule (অত্যন্ত গুরুত্বপূর্ণ)**: `1–2` লাইনের short text block সবসময় বর্তমান interface direction অনুযায়ী align হয়, কিন্তু **৩ বা ততোধিক লাইনের paragraph তার নিজের ভাষার reading direction অনুযায়ী align হবে**, current UI context অনুযায়ী নয় (নইলে LTR paragraph RTL UI-তে right-aligned হয়ে পড়তে কষ্ট হয়)।
3. **List Consistency**: একটি list-এর সব item-কে একই দিকে align করতে হবে (ভিন্ন script-এর item থাকলেও), যাতে চোখ দিয়ে scan করা সহজ থাকে।
4. **Controls & Navigation Mirroring**:
   - **Flip করবে**: Sliders, progress indicators, steppers, back/next chevron (`chevron.backward`/`chevron.forward`), ordered carousel/gallery।
   - **Flip করবে না**: Real-world physical direction pointer (যেমন "move right"), media playback transport controls (rewind/play/fast-forward tape metaphor), clocks, right-handed tool icons (কিন্তু tool-এর পেছনের UI-তে থাকা base badge পরিবেশ অনুযায়ী flip হতে পারে), logos, universal checkmarks (`checkmark`), ও prohibition backslash (`/` বা `\` in SF Symbols)।
5. **Numerals**:
   - কোনো সংখ্যার ভেতরের digit order **কখনো উল্টানো যাবে না** (যেমন `541`, phone number, credit card RTL-এও `541`-ই থাকবে)।
   - তবে **progress বা counting sequence** দেখানো আলাদা numeral label-গুলোর ক্রম উল্টাতে হবে (slider/step indicator-এ), কিন্তু digit-এর ভেতরকার order ঠিক থাকবে।
   - Hebrew-এ Western Arabic numerals (`0–9`), আর Arabic-এ দেশ ও অঞ্চলভেদে Western বা Eastern Arabic (`٠–٩`) ব্যবহৃত হয় — system formatter (`NumberFormatter` / `Intl.NumberFormat`) ব্যবহার করতে হবে।
6. **Optical Size Balance (RTL + All-Caps Latin)**:
   - Arabic/Hebrew script-এ uppercase না থাকায় all-caps Latin-এর পাশে ছোট দেখায়। Apple HIG সরাসরি বলেছে: visually balance করতে **RTL font size প্রায় `+2 pt` বাড়াতে**।

---

## 2. Numeric & Behavioral Specification Table

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `rtl.paragraphLanguageAlignThreshold` | 3 | lines | All (iOS / iPadOS / macOS / Web / Flutter) | Both | https://developer.apple.com/design/human-interface-guidelines/right-to-left | Official | high | >= 3 lines aligns to text script direction; 1-2 lines matches UI context |
| `rtl.arabicLatinAllCapsBalanceDelta` | +2 | pt | All | Both | https://developer.apple.com/design/human-interface-guidelines/right-to-left | Official | high | Increase Arabic/Hebrew font size by ~2pt beside all-caps Latin |
| `rtl.digitOrderInNumber` | preserve-ltr | behavior | All | Both | https://developer.apple.com/design/human-interface-guidelines/right-to-left | Official | high | Never reverse digits inside numbers (e.g., phone, "541", card numbers) |
| `nonLatin.banglaSystemFont` | Kohinoor Bangla | fontFamily | iOS / iPadOS / macOS | Both | https://developer.apple.com/fonts/ | Platform-dependent | high | Apple system Bengali typeface; web fallback: `'Hind Siliguri', 'Noto Sans Bengali', sans-serif` |
| `nonLatin.arabicSystemFont` | SF Arabic | fontFamily | iOS / iPadOS / macOS | Both | https://developer.apple.com/fonts/ | Official | high | Designed to pair optically with SF Pro |
| `nonLatin.banglaLetterSpacing` | 0 | em | All | Both | https://developer.apple.com/fonts/ | Inferred | high | Negative Latin tracking (e.g. `-0.026em`) breaks Indic matra/juktakkhor shaping in CSS/Canvas |
| `nonLatin.arabicLetterSpacing` | 0 | em | All | Both | https://www.w3.org/TR/alreq/ | Official | high | Cursive Arabic glyph joining breaks when non-zero letter-spacing is forced in CSS |
| `nonLatin.banglaLineHeightScale` | 1.35–1.5 | ratio | Web / Flutter | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Estimated | med | Vertical stack (ref, u-kar, juktakkhor) clips under tight Latin leading (`1.18–1.25`) |
| `nonLatin.banglaExpansionBudget` | +20 to +30 | % width | All | Both | https://developer.apple.com/design/human-interface-guidelines/writing | Estimated | med | Bengali/German/Arabic strings run longer than concise English labels |
| `nonLatin.cjkMinimumLegibleBoost` | +1 to +2 | pt | Web / Flutter / iOS | Both | https://developer.apple.com/design/human-interface-guidelines/typography | Estimated | low | Dense CJK strokes at 10-11pt benefit from higher contrast/size; no official pt number in HIG |
| `rtl.cssLogicalMigrationRule` | inset-inline / margin-inline / padding-inline / border-start-*-radius | CSS property | Web (All modern browsers) | Both | https://developer.apple.com/design/human-interface-guidelines/right-to-left | Inferred | high | Replaces physical `left`/`right` properties so `[dir="rtl"]` flips automatically |
| `rtl.flutterDirectionalRule` | EdgeInsetsDirectional / AlignmentDirectional / BorderRadiusDirectional | Dart API | Flutter (iOS / macOS / Android) | Both | https://developer.apple.com/design/human-interface-guidelines/right-to-left | Inferred | high | Avoid physical `EdgeInsets.only(left:)` or `Alignment.centerLeft` |

---

## 3. Script-Specific Engineering Rules (Bangla, Arabic, CJK)

### A. Bangla (`bn`)
- **NEVER apply SF Pro negative tracking (`-0.024em`..`-0.026em`)**: বাংলায় যুক্তবর্ণ (`ক্ষ`, `জ্ঞ`, `ক্ত`) ও স্বরচিহ্ন (`ি`, `ী`, `ু`, `ূ`, `ৃ`, `্র`) HarfBuzz/CoreText shaping-এর ওপর নির্ভর করে। CSS `letter-spacing` `0` এর কম হলে যুক্তবর্ণ ভেঙে যেতে বা overlap করতে পারে।
  - CSS Rule: `:lang(bn) { font-family: 'Kohinoor Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif; letter-spacing: 0 !important; line-height: 1.45; }`
- **Line Height / Leading**: Apple-এর `Tight Leading` (যেমন Display/Title-এ `1.15–1.22`) বাংলায় উপরের রেফ/চন্দ্রবিন্দু বা নিচের উ-কার কেটে দেয়। `line-height >= 1.40` (Body-তে `1.45–1.55`) নিরাপদ (Status: `Estimated` — needs visual test in Chromium/Safari)।
- **All-Caps Taboo**: বাংলায় uppercase নেই; `text-transform: uppercase` বা `letter-spacing: 0.08em` কেবল Latin-এ প্রযোজ্য, বাংলা section header-এ নয়।

### B. Arabic (`ar`) & Hebrew (`he`)
- **Zero Tracking**: আরবি cursive script-এ `letter-spacing != 0` দিলে connected glyphs বিচ্ছিন্ন হয়ে যায় (পড়ার অযোগ্য)।
- **Directional Icons**: `SF Symbols`-এ `.flipped` / localized variants (`arrow.backward`, `chevron.forward`, `speaker.wave.2`) ব্যবহার করলে Apple OS নিজেই ঘুরিয়ে দেয়। Web/Flutter-এ `dir="rtl"`-এ directional icon-এ `scaleX(-1)` এবং `LTR-locked` icons (checkmark, clock, logo, slash) কখনো flip না করা।
- **Bidi Isolation**: User-generated mixed RTL/LTR strings (যেমন আরবি বাক্যে ইংরেজি email বা phone number) সবসময় `<bdi>` অথবা Unicode isolate (`U+2068`..`U+2069`) / `dir="auto"` দিয়ে wrap করতে হবে।

---

## 4. Platform Parity & Anti-Patterns

| Area | Apple Native (SwiftUI/UIKit) | Web (`apple-web`) Recipe *(Untested)* | Flutter (`apple-flutter`) Recipe *(Untested)* | Common Plugin Bug Fixed |
| --- | --- | --- | --- | --- |
| Spacing & Padding | `.padding(.leading, 16)` | `padding-inline-start: 16px` | `EdgeInsetsDirectional.only(start: 16)` | Physical `left`/`right` breaks RTL |
| Corner Radii (asym) | `UnevenRoundedRectangle` leading/trailing | `border-start-start-radius` | `BorderRadiusDirectional.only(topStart: ...)` | Hardcoded `border-top-left-radius` |
| SF Pro Negative Tracking | OS CoreText handles Latin only | Restrict `letter-spacing` tokens to `:lang(en)` or Latin range; force `letter-spacing: 0` for `:lang(bn), :lang(ar)` | Skip `letterSpacing` when `Localizations.localeOf(context).languageCode` is `bn`/`ar`/`hi` | Global tracking `-0.026em` corrupts Bangla/Arabic |
| Paragraph Alignment | `.multilineTextAlignment(.leading)` + automatic script detect | `text-align: start;` + `dir="auto"` on >=3 line blocks | `TextAlign.start` on `Text` with dynamic `TextDirection` | Global right-aligning English paragraphs in RTL UI |

### Explicit Anti-Patterns
1. **Applying `-0.026em` CSS tracking universally** via `body` / `*` without script exclusion (`bn`, `ar`, `hi`).
2. **Flipping non-directional icons** (clocks, checkmarks, brand logos, globe, undo/redo icons arbitrarily vs reading-direction icons).
3. **Hardcoding `flex-direction: row` assumed LTR** with physical `margin-left`/`right-4` Tailwind utilities instead of `ms-4`/`me-4`/`start-4`/`end-4`.
4. **Reversing digits in RTL phone numbers or OTP codes** — OTP inputs must ALWAYS remain `dir="ltr"` even in `ar`/`he` locales.

---

## 5. Gaps & Open Questions
- Apple HIG সরাসরি কোনো explicit numeric line-height multiplier বাংলা বা Devanagari script-এর জন্য প্রকাশ করেনি (`Estimated` রাখা হয়েছে)।
- CJK (`ja`, `zh`, `ko`) Optical Balance & Dynamic Type minimum size boost Xcode Simulator বা Safari macOS-এ visual verification বাকি।

# 13 — Accessibility, Contrast, Hit Targets & Assistive Modes

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/layout.json`, `tokens/color.json`, `apple-design-core`, `apple-design-audit`, `scripts/contrast-check.mjs`, এবং `hooks/scripts/lint.mjs`-এর অ্যাক্সেসিবিলিটি নিয়মাবলী নির্ধারণ করে — বিশেষত HIG Contrast threshold ত্রুটি সংশোধন (Prompt 3-এ `18pt` rule প্রয়োগ), hit targets, VoiceOver, Full Keyboard Access ও Assistive Access-এর জন্য।

---

## 1. Official Contrast & Typography Rules (Bug Prevention Highlight)

> [!IMPORTANT]
> **গুরুত্বপূর্ণ ডিসকভারি (Plugin Doc Bug Caught)**: বর্তমান প্লাগইনের `03-color.md:57`-এ লেখা আছে *"3:1 for title3 (20pt) and up"* — এটি **ভুল/অসম্পূর্ণ**। Official Apple HIG ([Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)) স্পষ্টভাবে WCAG Level AA অনুসারে তিনটি শর্ত দেয়:
> 1. **`Up to 17 pts` (All weights)** -> কমপক্ষে **`4.5:1`**
> 2. **`18 pts` (and above, All weights)** -> কমপক্ষে **`3:1`**
> 3. **`All sizes` when `Bold` (Semibold/Bold in Accessibility)** -> কমপক্ষে **`3:1`**

এছাড়া **Dark Mode HIG** ([Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)) অনুযায়ী:
- সব appearance-এ কমপক্ষে **`4.5:1`** বজায় রাখার চেষ্টা করতে হবে এবং **custom foreground/background colors-এ ছোট টেক্সটের জন্য `7:1`** লক্ষ্য রাখতে হবে।
- সতর্কতা: Dark Mode + Increase Contrast + Reduce Transparency একসাথে চালু করলে গাঢ় টেক্সট গাঢ় ব্যাকগ্রাউন্ডের ওপর অদৃশ্য হওয়ার ঝুঁকি থাকে — প্রতিটি সমন্বয় পরীক্ষা করতে হবে।

---

## 2. Official Quantitative Specifications

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `a11y.contrast.smallText` | `4.5:1` (`<= 17 pt`, All weights) | contrast ratio | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Matches WCAG Level AA normal text |
| `a11y.contrast.largeText` | `3:1` (`>= 18 pt`, All weights) | contrast ratio | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Fixes plugin's erroneous `20pt` rule |
| `a11y.contrast.boldText` | `3:1` (All sizes, Bold) | contrast ratio | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Applies even at `< 18pt` when Bold |
| `a11y.contrast.customDarkTarget` | `7:1` | contrast ratio | All Apple | Dark | https://developer.apple.com/design/human-interface-guidelines/dark-mode | Official | high | Recommended target for small custom text in Dark Mode |
| `a11y.contrast.nonTextUI` | `3:1` | contrast ratio | Web / Flutter / Apple UI | Both | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | Official | high | Icons, borders, focus rings, active control states |
| `a11y.hitTarget.ios` | `44 × 44` (min `28 × 28`) | pt | iOS / iPadOS / watchOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Prefer 44x44; never below 28x28 even if visual glyph is smaller |
| `a11y.hitTarget.macos` | `28 × 28` (min `20 × 20`) | pt | macOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Pointer precision allows smaller target; expand on touch (Oct 2026 HIG) |
| `a11y.hitTarget.visionOS` | `60 × 60` (min `28 × 28`) | pt | visionOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Gaze + pinch ergonomic target |
| `a11y.hitTarget.tvOS` | `66 × 66` (min `56 × 56`) | pt | tvOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | 10-foot UI focus target |
| `a11y.targetPadding.bezeled` | `~12` | pt | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Minimum gap around controls that have visible bezel |
| `a11y.targetPadding.bezelLess` | `~24` | pt | All Apple | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Extra clearance around bezel-less controls to avoid mistaps |
| `a11y.textScaling.target` | `>= 200` (`140` watchOS) | % | All | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Up to `AX5` Dynamic Type (`Body = 53pt` vs `17pt` = 311%) |
| `a11y.font.defaultMinimum` | `17 / 11` (iOS), `13 / 10` (macOS) | pt | iOS / macOS | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Also `visionOS: 17/12`, `watchOS: 16/12`, `tvOS: 29/23` |

---

## 3. Assistive Modes & Interaction Compliance Checklist

1. **Color Blindness & Shape Redundancy**: কখনোই কেবল লাল/সবুজ বা নীল/কমলা রঙে state বোঝানো যাবে না (`red-green`, `blue-orange`) — আইকন, টেক্সট লেবেল বা প্যাটার্ন (`Differentiate Without Color Alone`) সাথে দিতে হবে।
2. **Focus Rings & Full Keyboard Access (FKA)**:
   - macOS Kit (`Global.Focus Ring` Measured): `3.5px` outer ring (`#0088FF@0.25`) + `1px` inner border (`#0088FF@0.15`)।
   - Web-এ `:focus-visible` ব্যবহার বাধ্যতামূলক (`outline: none` নিষেধ যখন পর্যন্ত custom Apple focus ring দেওয়া না হয়)।
   - W3C ARIA APG keyboard contracts: Tablist (`ArrowLeft`/`Right` + `Home`/`End`), Dialog (`Escape` + focus trap + return focus to trigger), RadioGroup (`Arrow` keys + roving `tabindex="0"`), Menu (`ArrowUp`/`Down` + `Escape` + typeahead)।
3. **Reduce Transparency & Increase Contrast Matrix**:
   - Web: `@media (prefers-reduced-transparency: reduce)` (`Chrome 118+`, Safari unsupported -> app setting fallback) + `@media (prefers-contrast: more)` -> Glass হারাবে, opaque surface (`#F6F6F6` / `#262626`) + `1px` border (`labelPrimary@0.35`) যোগ হবে।
   - Flutter: `MediaQuery.highContrastOf(context)` + `AccessibilityFeatures.reduceMotion`।
4. **No Time-Boxed Auto-Dismiss**: Toast বা alert-এ বাধ্যতামূলক short auto-dismiss timer দিলে cognitive / screen-reader ব্যবহারকারীরা পড়ার আগেই হারিয়ে যায়; গুরুত্বপূর্ণ বার্তায় explicit dismiss বা যথেষ্ট timeout + pause/action রাখতে হবে।
5. **Voice Control & VoiceOver**: প্রতিটি icon-only button-এ দৃশ্যমান নয় এমন স্পষ্ট `aria-label` / `Semantics(label: ...)` দিতে হবে (আরেকটি গুরুত্বপূর্ণ নিয়ম: `adopting-liquid-glass` পুনরায় জোর দিয়েছে যেন toolbar-এ টেক্সট সরিয়ে আইকন দিলে *প্রতিটি আইকনে accessibility label* থাকে)।
6. **Assistive Access**: Core workflow আলাদা করে multi-step flow single-focus screen-এ ভাঙা ও destructive action-এ **দুইবার confirmation** নেওয়া।

---

## 4. Browser & Platform Parity Notes
- `prefers-reduced-transparency`: Chromium 118+ ও Linux/macOS OS toggle-এ কাজ করে, **Safari (WebKit)-এ এখনো unsupported** (`caniuse.com`), তাই Web অ্যাপের Preferences/Settings-এ manual "Reduce Transparency" toggle (`[data-reduced-transparency]`) রাখা অপরিহার্য।
- Android / Flutter Text Scaling: `MediaQuery.withClampedTextScaling(maxScaleFactor: 2.0)` শুধু তখন ব্যবহারযোগ্য যখন layout overflow ঠেকানো জরুরি, আদর্শভাবে `ListView`/`Wrap` দিয়ে **`>= 200%`** সম্পূর্ণভাবে সাপোর্ট করতে হবে।

---

## 5. Gaps & Open Questions
- APCA contrast (`Lc`) মানের জন্য Apple এখনো কোন নির্দিষ্ট numeric floor দেয়নি — কেবল `Accessibility Inspector` WCAG AA (`4.5:1` / `3:1`) নথিভুক্ত আছে।

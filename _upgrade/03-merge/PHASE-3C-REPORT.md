# Phase 3c রিপোর্ট — Figma MCP জ্যামিতি সংগ্রহ (`upgrade/apple-dna-v2`)

> **তারিখ:** ২০২৬-১১-২৫
> **বাজেট:** Starter প্ল্যান (২০ কল/মাস); Phase 3c কঠোর সীমা **সর্বোচ্চ ৮টি গোনা-হওয়া কল** (`whoami` বাদে)।
> **ব্যবহৃত কল:** **৭ / ৮** (১টি কল অব্যবহৃত রইল)। কোনো ছবি/স্ক্রিনশট ডাউনলোড বা commit করা হয়নি; সব কাঁচা JSON `_upgrade/05-figma-geometry/raw/`-এ (gitignored)।

---

## ১. ব্যবহৃত Figma MCP কল তালিকা (`qa/figma-call-log.md`)

অ্যাকাউন্ট (`whoami`, গোনা নয়): handle **`Kian SINON`**, প্ল্যান **`Kian SINON's team`** (`starter`, seat `View`, role `admin`)। উভয় ফাইলে (`5YNrD6VW0v0Meye5F2JIz0`, `9XLHKxkIO24Er34C0DoMcR`) read-only `use_figma` সফল হওয়ায় মালিকানা/অ্যাক্সেস নিশ্চিত।

| # | গোনা? | টুল | ফাইল কী | উদ্দেশ্য | ফল |
|---|---|---|---|---|---|
| 0 | না | `whoami` | — | অ্যাকাউন্ট handle, plan, seat যাচাই | সফল (`Kian SINON`, `starter`) |
| 1 | হ্যাঁ (১/৮) | `use_figma` | `5YNrD6VW0v0Meye5F2JIz0` | ধাপ ১ যাচাই: macOS Buttons পাতা + পূর্ণ পাতা তালিকা | ব্যর্থ (৬০,৯৫০ B > ৪৮,০০০ B সীমা; ফাইল অ্যাক্সেস নিশ্চিত) |
| 2 | হ্যাঁ (২/৮) | `use_figma` | `5YNrD6VW0v0Meye5F2JIz0` | ধাপ ১ পুনরায়: deduplicated macOS Buttons + ৪৩ পাতার ID | সফল (৩,৭৭৭ B) |
| 3 | হ্যাঁ (৩/৮) | `use_figma` | `5YNrD6VW0v0Meye5F2JIz0` | ধাপ ২ macOS Batch A (Windows, Sidebars, Toolbars, Alerts, Dialogs, Sheets, Popovers, Menus) | সফল (২২,০৮৬ B, trimmed=false) |
| 4 | হ্যাঁ (৪/৮) | `use_figma` | `5YNrD6VW0v0Meye5F2JIz0` | ধাপ ২ macOS Batch B (Toggles, Segmented, Text Fields, Sliders, Steppers, Search, Lists) | সফল (৬,৮৯২ B, trimmed=false) |
| 5 | হ্যাঁ (৫/৮) | `use_figma` | `9XLHKxkIO24Er34C0DoMcR` | ধাপ ২ iOS Batch A (পূর্ণ পাতা তালিকা + scale check + Controls) | সফল (১৩,৭১৩ B, trimmed=false) |
| 6 | হ্যাঁ (৬/৮) | `use_figma` | `9XLHKxkIO24Er34C0DoMcR` | ধাপ ২ iOS Batch B (Layout Guides, Status Bars, Tab Bars, Toolbars, Toggles, System) | সফল (৩৩,৪৯৩ B, trimmed=false) |
| 7 | হ্যাঁ (৭/৮) | `use_figma` | `9XLHKxkIO24Er34C0DoMcR` | ধাপ ২ iOS Batch C (Lists, Alerts, Action Sheets, Sheets, Menus, Popovers, Sidebars) | সফল (১২,৩৬৬ B, trimmed=false) |

---

## ২. Scale যাচাইয়ের ফল (1x pt নিশ্চিত)

উভয় Apple Figma kit **১০০% 1× logical points (`pt`)**-এ তৈরি:
- **iOS 27 (`9XLHKxkIO24Er34C0DoMcR`):** `iPhone 17 Pro / 17 / 18 Pro` = **`402×874`** (`6316:14141`), `iPhone 17 Pro Max` = **`440×956`** (`6316:14158`), `iPhone Air` = **`420×912`** (`6316:14173`), `iPad Pro M4 11"/13"` = **`1210×834` / `1376×1034`**, `Status Bar - iPhone` = **`402×62`** (`12961:29590`), `Home Indicator (Portrait)` = **`402×34`** (`106:60032`)।
- **macOS 27 (`5YNrD6VW0v0Meye5F2JIz0`):** `Window Controls` traffic lights = **`14×14`, gap `9`** (`177:9888`, `4365:36385`), `Buttons` = **`h=24`** (`4341:2332`)।

---

## ৩. `cornerSmoothing` (Continuous Corner / Squircle) ফলাফল

- **`0.6` (৬০%) — ১৭৮টি নোড:** iOS 27 ও macOS 27-এর সব rounded-rect surface ও control (Window, Sheet, Dialog, Alert, Popover, Button, Sidebar item, Menu highlight, Segmented, Stepper, Toggle, Tab Bar glass)। আমাদের `tokens/shape.json :: continuousCorner.smoothing = 0.6`-এর সঙ্গে হুবহু মিলেছে (`inferred` -> **`measured`**)।
- **`1.0` (১০০%) — ১৭টি নোড:** কেবল ক্যাপসুল/পিল inner item (`cr >= h/2`, যেমন `_Option`, `_Search 44/48pt`, `Slider Knob`) ও full-bleed overlay mask (`Menu Background`, `_Overlay - Alerts`)।

---

## ৪. কতটা Estimate `measured` হলো (বিস্তারিত: `qa/ESTIMATE-RESOLUTION-2.md`)

- **মোট Estimate সংখ্যা পরিবর্তন (`tokens/ESTIMATES.md`):** **`79` -> `70`** (**৯টি** সম্পূর্ণ estimate group `measured`-এ উন্নীত; এ ছাড়া `shape.json :: continuousCorner` `inferred` -> `measured`, এবং `shape.json :: radiusMacOS`-এর **৫টি** স্পষ্ট subfield আপডেট হয়েছে)।
- **উন্নীত ৯টি Estimate group (+ ১টি `inferred` -> `measured`):**
  1. `layout.json :: ios.toggle` (confirmed: `64×28`, knob `38×24`, inset `2`)
  2. `layout.json :: ios.slider` (confirmed: `trackHeight 6`, knob `38×24`)
  3. `layout.json :: ios.searchField` (confirmed: `height 44`, `48pt` bottom variant নোট)
  4. `layout.json :: ios.stepper` (**contradicted:** `width 94 -> 92`, `height 32`)
  5. `layout.json :: ios.textField` (**contradicted:** `height 44 -> 52`, `padH 16`)
  6. `layout.json :: ios.alert` (**contradicted:** `padding 20 -> 14`, `width 300`, `buttonHeight 48`)
  7. `layout.json :: ios.sheet` (**contradicted:** `grabber 36×5 topInset 5 -> 60×4 topInset 6`, `floatingInsetAtMedium 8 -> 6`)
  8. `layout.json :: macos.controlSizes` (confirmed: `16 / 20 / 24 / 28 / 36`)
  9. `layout.json :: macos.menu` (**contradicted:** `separatorHeight 9 -> 11`, `itemHeight 24`, `outerPadding 5`)
  10. `shape.json :: continuousCorner.smoothing` (confirmed `0.6`, `inferred` -> `measured`)
- **`shape.json :: radiusMacOS` (৫টি স্পষ্ট subfield আপডেট, বাইরের group `estimated` রইল):**
  - `window`: **`12 -> 16`** (`585:3372`, `4363:18479`), `sheet`: **`12 -> 16`** (`121:11423`), `alert`: **`16 -> 10`** (`121:11254`), `popover`: **`16 -> 10`** (`4336:13305`), `menuItemHighlight`: **`6 -> 8`** (`685:23691`)।
- **`elevation.json :: levels.knob` ও `levels.popover`:** Figma-তে `knob` (`0 3px 36px @0.05`, node `I478:1094;475:568;4348:11314`) ও iOS `popover` (`0 10px 100px @0.3`, node `61:65449`) পাওয়া গেছে; cross-platform/visual কারণে মূল estimate রেখে `$kitReference`-এ Figma node যোগ করা হয়েছে।

### Ambiguous তালিকা (১৪টি — জোর করে বসানো হয়নি, `estimated` রইল)
`ios.button` (কিটে ৩ সাইজ `28/34/50`, ৫ সাইজ নয়), `ios.segmentedControl` (`32`/`50`/`36` তিন উচ্চতা), `ios.toolbar` (`44`/`48`/`54`), `ios.tabBar` (`height 62` নিশ্চিত কিন্তু `sideInset` ট্যাব-সংখ্যাভেদে ভিন্ন), `ios.listRow`, `ios.pageControl`, `ios.safeArea` (legacy notch/SE কিটে নেই), `macos` (parent group), `macos.trafficLights` (`leadingInset` Default `19` বনাম Compact `12`), `macos.sidebar`, `radiusIOS`, `radiusMacOS` (outer group), `elevation.levels.knob`, `elevation.levels.popover`, `elevation.levels.sheet`।

### Not in Figma (৫৬টি — `estimated` রইল)
`motion.json` (২৬), `color.json` (১১), `materials.json` (৭), `layout.json` (৪), `typography.json` (৩), `elevation.json` (২), `feedback.json` (২), `icons.json` (১)।

---

## ৫. ভাঙা টেস্ট ও পুনঃযাচাইয়ের ফল

- **ভাঙা টেস্ট (১টি — প্রত্যাশিত token-মান পরিবর্তন):**
  - `tests/build-tokens-regression.test.mjs:28` আগের অনুমান `pub const WINDOW_CORNER_RADIUS: f64 = 12.0;` খুঁজছিল; macOS 27 Figma কিটে আসল মান `16.0` পাওয়ায় assertion-টি `16.0`-এ আপডেট করা হয়েছে।
- **সব যাচাইয়ের চূড়ান্ত ফল:**
  - `node --test tests/*.test.mjs`: **15/15 PASS**
  - `node scripts/verify-plugin.mjs`: **12 PASS, 0 NOT RUN, 0 FAIL**
  - Flutter harness (`flutter analyze` + `flutter test`): **No issues found!**, **7/7 PASS**
  - Tauri harness (`cargo check`): **PASS** (`Finished dev profile in 1.55s`)
  - Web mounted harness (`verify_mounted.py` Chromium / WebKit / Firefox): **7/7 PASS (Chromium)**, **7/7 PASS (WebKit)**, **7/7 PASS (Firefox)**
  - `qa/computed-style-audit.mjs`: **iOS Light 12/12 PASS (100/100)**, **iOS Dark 12/12 PASS (100/100)**, **macOS Light 12/12 PASS (100/100)**, **macOS Dark 11/12 PASS** (সব জ্যামিতি/radius/spacing চেক PASS; ১টি পূর্ব-বিদ্যমান `contrast` `3.23:1` macOS dark accent tradeoff, Phase 3c-এর সাথে সম্পর্কিত নয়)

## ৬. `NOT RUN` তালিকা
- `qa/ux-keyboard.mjs` WebKit & Firefox: **`NOT RUN`** (Node Playwright v1.52 `webkit-2388`/`firefox-1572` অনুপস্থিত; Chromium 12/12 PASS)।
- Reference Fidelity (`--reference`): **`NOT RUN`** (`qa/references/`-এ কোনো PNG নেই)।

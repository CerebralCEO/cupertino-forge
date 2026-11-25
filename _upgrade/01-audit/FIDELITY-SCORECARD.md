# cupertino-forge — Apple-Fidelity Scorecard (১৬ ডোমেইন)

তারিখ: ২৫ নভেম্বর ২০২৬ · মূল্যায়ন ভিত্তি: Workspace-এর ১২২টি ফাইল পাঠ + স্ক্র্যাচ টেস্ট (`build-tokens.mjs`, `lint.mjs`, `contrast-check.mjs`)।
স্কেল: **০–৫** (০ = অনুপস্থিত, ১ = অতি প্রাথমিক/ভ্রান্ত, ২ = আংশিক/বড় ফাঁক, ৩ = মজবুত ভিত্তি কিন্তু গুরুত্বপূর্ণ ফাঁক আছে, ৪ = প্রোডাকশন-মান উচ্চ ফিডেলিটি, ৫ = সম্পূর্ণ ও যাচাইকৃত Apple ফিডেলিটি)।
**নিয়ম:** স্কোর **≤ ২** হলে **"Deep Research দরকার"** ফ্ল্যাগ করা হয়েছে।

---

## ১. সারসংক্ষেপ টেবিল (মোট: ৩৪ / ৮০ — ৪২.৫%)

| # | ডোমেইন | স্কোর (/৫) | Research Flag | মূল কারণ (এক নজরে) |
|---|---|---:|---|---|
| 1 | Design philosophy ও psychology | **3** | *(উন্নয়নযোগ্য)* | 4-question সিদ্ধান্ত প্রক্রিয়া ও deference মডেল শক্ত (`00-principles.md`), কিন্তু progressive disclosure/cognitive load ও UX psychology গভীরতা কম |
| 2 | Color | **3** | *(উন্নয়নযোগ্য)* | iOS/macOS 27 kit-যাচাইকৃত (`#0088FF`), HC ও dark elevated আছে; কিন্তু P3 wide gamut নেই ও custom accent script নিজেই fail করে |
| 3 | Typography (optical size, tracking, non-Latin সহ) | **2** | **Deep Research দরকার** | Raw Sketch kit `letterSpacing: 0` হওয়ায় tracking উৎস অপ্রমাণিত, CSS optical sizing/Inter compensation bug (`base.css:48`), Flutter double-scaling (`cf_theme.dart:92`), non-Latin/RTL কেবল ১ লাইনের বাংলা নোট |
| 4 | Layout ও grid | **3** | *(উন্নয়নযোগ্য)* | 4pt scale, 44/28 hit target, size-class breakpoints চমৎকার; কিন্তু safe-area/control metrics অনেক `estimate` ও `zIndex`/layout token components-এ ব্যবহৃত হয় না |
| 5 | Shape ও concentricity | **3** | *(উন্নয়নযোগ্য)* | `SquircleBorder` ও `squircle.ts` smoothing 0.6 দারুণ; কিন্তু `glass.tsx` rect-এ Safari fallback নেই, `clipPath` shadow কাটে, `--cf-radius-device-display` জেনারেটই হয় না (`sheet.tsx:63`) |
| 6 | Liquid Glass | **2** | **Deep Research দরকার** | Functional vs content বিভাজন ভালো, কিন্তু intensity curve অসঙ্গত (`A12`), Safari Reduce Transparency অদৃশ্য (`LG-1`), clear/regular adaptive luminance নেই, Flutter `ClipPath` shadow কাটে (`cf_glass.dart:82`), scroll-edge স্থির `6px` |
| 7 | Motion ও physics | **2** | **Deep Research দরকার** | WWDC23 spring math সঠিক (`Tested`), কিন্তু JS-এ Reduced Motion উপেক্ষিত (`M-01`), Sheet `height` animate করে (`M-02`), `CfPageRoute` spring নয় (`A4`), Matched Geometry/View Transitions অনুপস্থিত |
| 8 | Haptics ও sound | **2** | **Deep Research দরকার** | ৯টি original `.wav` + Web Audio দারুণ, কিন্তু Toggle haptic+sound stack করে (নীতিবিরুদ্ধ), TabBar অযথা buzz দেয়, iOS Flutter notification channel নেই, Web iOS `setTimeout(..., 0)` ঝুঁকিপূর্ণ, `sounds.ts` বনাম `synth-sounds.py` drift |
| 9 | SF Symbols ও app icon | **2** | **Deep Research দরকার** | `icons.json` ম্যাপ ও weight rule ভালো, কিন্তু runtime mapper নেই, symbol effects কোডে নেই, iOS/macOS 27-এর layered Liquid Glass App Icon (Icon Composer) ও dark/tinted icon spec অনুপস্থিত |
| 10 | Component spec-এ মাপ | **2** | **Deep Research দরকার** | Spec-এ বেশিরভাগ মাপ `estimate`, বহু spec'd component (`Picker`, `DatePicker`, `SwipeActions`, `SecureField`, এবং Flutter-এর ১০+ widget) কোডে নেই, `button.tsx` glass color bug, web components-এ ৩৪টি `[Npx]` |
| 11 | UX patterns (navigation, gesture, states, onboarding, permission) | **2** | **Deep Research দরকার** | `screens.md` ও `states.md` ভালো কাঠামো দেয়, কিন্তু gesture choreography (scroll-to-drag, swipe-back, undo), deep onboarding/permission flows, keyboard/focus UX (`U-01`) ও empty/error automation দুর্বল |
| 12 | Accessibility | **2** | **Deep Research দরকার** | Hit target ও dark/HC schema আছে; কিন্তু JS Reduced Motion নেই, Safari RT নেই, ARIA roving focus নেই, Flutter double text-scaling, `prefers-contrast` CSS cascade bug, AX contrast threshold অসঙ্গতি |
| 13 | Performance | **1** | **Deep Research দরকার** | কোনো measured budget নেই, Sheet `height` layout thrashing (`PF-1`), `TabBar` `layout`+`lens` (`PF-2`), `.cf-glass` permanent `translateZ(0)` (`PF-3`), `CfLargeTitleScaffold` প্রতি scroll pixel-এ `setState`, `SystemChrome` in `build()` |
| 14 | Platform adaptation | **2** | **Deep Research দরকার** | Size-class adapter বিভাজন ভালো, কিন্তু Flutter `navigationMode` touch-এ ভুল (`U-02`), Android predictive back/Material conflict অগভীর, Tauri MAS `macOSPrivateApi` বম্ব (`tauri.conf.snippet.json:4`), SwiftUI/Electron/iPadOS multitasking গাইডেন্স দুর্বল |
| 15 | QA / measurement | **2** | **Deep Research দরকার** | ১৫-layer scorecard ও lint hook আছে (`Tested`), কিন্তু `lint.mjs` `raw-backdrop` regex ভাঙা (`Tested`), reference ছাড়া fidelity বনাম conformance আলাদা নয়, computed-style/ARIA/SSIM/keyboard automation নেই, `python3` Windows-এ ভাঙে |
| 16 | Localization ও RTL | **1** | **Deep Research দরকার** | কেবল `11-accessibility.md:45` ও `12-ux-writing.md:46`-এ ২ লাইনের নোট ও অব্যবহৃত `webBangla` stack; কোডে `left`/`pl`/`chevron` সব LTR hardcoded (`list.tsx:82`, `cf_list.dart:58`, `nav.tsx:36`), কোনো RTL/CJK/Arabic বা locale formatting ব্যবস্থা নেই |

---

## ২. ডোমেইন-ভিত্তিক বিস্তারিত মূল্যায়ন

### ১. Design philosophy ও psychology — **৩/৫**
- **ভালো দিক:** `foundations/00-principles.md` স্পষ্ট ৪টি সিদ্ধান্ত-প্রশ্ন (content vs control, primary action, subtraction, platform familiarity), deference, এবং hierarchy ladder (position → weight → size → color → background level) দেয়। `anti-patterns.md` ও `apple-design-core/SKILL.md` ("Apple vs Apple-ish") কার্যকর।
- **ফাঁক:** Cognitive load management, progressive disclosure-এর concrete pattern, direct manipulation psychology (Fitts's Law, spatial continuity), এবং user mental model (যেমন destructive undo বনাম confirmation-এর psychological threshold) নিয়ে গভীর বিশ্লেষণ নেই।

### ২. Color — **৩/৫**
- **ভালো দিক:** `tokens/color.json` iOS 27 ও macOS 27 Sketch kit থেকে verified (`#0088FF`/`#0091FF`, `labelOnGlassIOS`, `macOSControlFills`, `backgroundIOS.darkElevated`)। `foundations/03-color.md` ও `13-dark-mode.md` semantic usage ও elevated dark surface ভালোভাবে ধরে।
- **ফাঁক:** Wide-gamut Display P3 color নেই (সব sRGB hex); `systemVibrantMacOS`, `macOSControlFills.overGlass` token-এ থাকলেও generated CSS/Dart-এ emit হয় না (`build-tokens.mjs`); custom brand accent-এর জন্য auto dark/HC derivation নেই; `contrast-check.mjs` নিজের `--accent "#0088FF"`-এও 3টি fail দেখায় (`Tested`)।

### ৩. Typography (optical size, tracking, non-Latin সহ) — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `tokens/typography.json` (১,৪৮১ লাইন)-এ iOS Dynamic Type (`xSmall`..`AX5`) এবং macOS styles, tight/loose leading, `tabular-nums`, ও weight rules আছে।
- **ফাঁক:**
  1. `tokens/source/*.json` পরীক্ষা করে দেখা গেছে Sketch kit-এ `letterSpacing: 0` — তাই `trackingTables`-এর উৎস `$source` ট্যাগহীন ও যাচাইহীন (`V-02`)।
  2. `cupertino.base.css:48` Inter tracking compensation (`-0.01em`) `body` tracking overwrite করে ও অন্যান্য style-এ প্রযোজ্য হয় না।
  3. `cf_theme.dart:84,92` Dynamic Type দ্বিগুণ scale করে (`U-03`)।
  4. Optical sizing (SF Pro Text ≤19pt vs SF Pro Display ≥20pt, CSS `font-optical-sizing` বনাম Inter variable axes) ও non-Latin (Bangla `webBangla` token অব্যবহৃত; Arabic/CJK/Devanagari অনুপস্থিত) গভীরতা শূন্য।

### ৪. Layout ও grid — **৩/৫**
- **ভালো দিক:** `tokens/layout.json` ও `foundations/01-layout.md` 4pt scale, `44`/`28` hit target, `672` readable width, `0/768/1180` size-class breakpoints, এবং iOS vs macOS skeleton দেয়।
- **ফাঁক:** প্রায় সব control/margin/safe-area মান `estimate`; `layout.json`-এর `zIndex` ও অনেক iOS control dimension generated CSS/TS-এ emit বা ব্যবহৃত হয় না (`sheet.tsx`, `alert.tsx`, `controls.tsx` hardcoded); responsive grid system (multi-column iPad/macOS adaptive columns) ও Dynamic Island / keyboard avoidance layout spec অগভীর।

### ৫. Shape ও concentricity — **৩/৫**
- **ভালো দিক:** `tokens/shape.json`, `foundations/05-shape.md`, `squircle.ts` ও `squircle_border.dart` continuous corner (`0.6` smoothing) ও `inner = outer - inset` নিয়ম স্পষ্টভাবে বাস্তবায়ন করে।
- **ফাঁক:** `glass.tsx:37` Safari/Firefox-এ squircle দেয় না (`V-01`); `squircle.tsx` `clipPath` shadow কেটে ফেলে; `--cf-radius-device-display` `build-tokens.mjs`-এ বাদ পড়ায় `sheet.tsx:63` 55px-এর বদলে 38px হয়; `corner-shape: squircle` (`superellipse(2)`) বনাম Apple continuous corner জ্যামিতির পার্থক্য সমাধান হয়নি; macOS-only radius CSS vars iOS mode-এ `undefined` থাকে।

### ৬. Liquid Glass — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `tokens/materials.json` (৩৩৪ লাইন) raw kit stack + tuned CSS recipe আলাদা করে রাখে; `04-liquid-glass.md` functional layer নীতি ও ৩৫% clear-glass dimming দেয়।
- **ফাঁক:** `glassIntensity` web ও Flutter-এ অসঙ্গত (`A12`) এবং dark sheen-এ কাজ করে না (`cupertino.base.css:109`); Safari-তে Reduce Transparency অকার্যকর (`LG-1`); small glass-এর dynamic light/dark background luminance adaptation কেবল doc-এ লেখা, কোডে নেই; `ScrollEdge` এক-স্তরের স্থির `6px` blur (`V-05`); Flutter `CfGlass`-এ `ClipPath` শ্যাডো কাটে (`cf_glass.dart:82`); `standardMaterials` CSS/Dart-এ জেনারেটই হয় না; glass-vs-solid decision tree নেই (`LG-2`)।

### ৭. Motion ও physics — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `tokens/motion.json` ও `build-tokens.mjs:61-88` WWDC23 `duration + bounce` → `stiffness + damping` + CSS `linear()` 40-point sampling সঠিকভাবে করে (`Tested`)।
- **ফাঁক:** Web JS (`motion`) components-এ `reducedMotion` একেবারেই মানা হয় না (`M-01`); `Sheet` `height` animate করে (`M-02`); `CfPageRoute` আসলে spring নয় (`A4`) এবং `CfSegmented` `Curves.easeOutBack` (`cf_controls.dart:113`) ব্যবহার করে; Matched Geometry / Hero / View Transitions অনুপস্থিত (`M-06`); interruptible gesture-velocity handoff শুধু doc-এ, web `Sheet`/`Slider`/`Toggle`-এ আংশিক/অনুপস্থিত।

### ৮. Haptics ও sound — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `tokens/feedback.json`, ৯টি original `.wav` (`assets/sounds/`, `synth-sounds.py`), `haptics.ts` (Android + iOS Safari switch trick), `sounds.ts` (Web Audio), `AppleHapticsPlugin.kt` (Android API 30/34+) বেশ সৃজনশীল।
- **ফাঁক:** `controls.tsx:29` ও `cf_controls.dart:38-39` Toggle-এ haptic+sound stack করে (`10-haptics-sound.md:37` ভঙ্গ); `tab-bar.tsx:44` ও `cf_tab_bar.dart:47` tab switch-এ haptic দেয় (spec-বিরোধী); Flutter iOS-এ `UINotificationFeedbackGenerator` নেই (`U-05`); `haptics.ts:38` `setTimeout(..., 0)` user gesture ভাঙতে পারে; `sounds.ts` ও `synth-sounds.py`-এর `send`/`error` waveform-এ drift আছে; macOS Tauri-তে `NSHapticFeedbackManager` নেই।

### ৯. SF Symbols ও app icon — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `tokens/icons.json` ৫১টি SF Symbol → Lucide/Phosphor/CupertinoIcons ম্যাপ ও `weightToLucideStroke` টেবিল দেয়; `foundations/07-iconography.md` ও `icon.tsx` weight/scale-matching করে।
- **ফাঁক:** `icons.json` build-tokens-এ যুক্ত নয় (runtime `<Icon name="gearshape" />` বা symbol registry নেই); `motion.json:214-220`-এর `symbolEffects` (bounce/pulse/replace/wiggle/variableColor) Web বা Flutter-এ implement হয়নি; `15-version-diff.md:14` ও `shape.json:63` iOS 27/macOS 27-এর multi-layer Liquid Glass App Icon (Icon Composer: default, dark, clear, tinted layers) উল্লেখ করলেও কোনো spec, template বা token দেয়নি।

### ১০. Component spec-এ মাপ — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `components-ios/` (৪ ফাইল) এবং `components-macos/` (৫ ফাইল) Anatomy/Metrics/States/Primitive কাঠামো দেয়; `apple-web`-এ ১৬টি component আছে।
- **ফাঁক:** `layout.json` ও `shape.json`-এর বেশিরভাগ component metric `estimate`; `button.tsx:61` `glass`/`prominentGlass` text color bug; `apple-web`-এ ৩৪টি `[Npx]` hardcoded literal (`A9`); ২২টি spec'd primitive নেই; `apple-flutter`-এ `TextField`, `SearchField`, `Slider`, `Stepper`, `Menu`, `Popover`, `Progress`, `EmptyState`, `Picker`, `SwipeActions`, এবং macOS desktop widgets অনুপস্থিত; `components-ios/*.md` ও `components-macos/*.md`-এ A11y/QA verify ক্ষেত্র অসম্পূর্ণ।

### ১১. UX patterns (navigation, gesture, states, onboarding, permission) — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `patterns/screens.md` (১২টি screen recipe) ও `patterns/states.md` (Empty, Loading 300ms delay, Error, Offline, Permission, Success, Destructive) শক্ত ভিত্তি দেয়।
- **ফাঁক:**
  - Navigation/Gesture: scroll-to-drag sheet handoff নেই (`M-02`), edge-swipe back কেবল `CupertinoPageRoute`-এ (Web-এ নেই), `SwipeActions` ও `PullToRefresh` implementation নেই, `ListRow` keyboard/arrow navigation নেই (`U-01`)।
  - Onboarding ও Permission: মাত্র ৩-৪ লাইনের recipe (`screens.md:15`, `states.md:35`); multi-step progress, permission priming psychology, denied recovery, progressive onboarding বা macOS onboarding নেই।
  - Undo/Redo, drag-and-drop reordering, search scope bar ও multi-select editing mode implementation অনুপস্থিত।

### ১২. Accessibility — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** Hit target (`44`/`28`), `useDelayedFlag`, `aria-label` enforced props (`IconButton`), `focus-visible:focus-ring`, `focusRing` token এবং `highContrast` token সাপোর্ট আছে।
- **ফাঁক:** JS Reduced Motion নেই (`M-01`); Safari Reduce Transparency নেই (`LG-1`); `TabBar`/`SegmentedControl` arrow-key roving focus নেই (`U-01`); `alert.tsx:34` `Enter` key trap bug; Flutter double Dynamic Type scaling (`U-03`); `build-tokens.mjs:263` `prefers-contrast: more` CSS cascade bug; `03-color.md:57` contrast threshold HIG-এর (18pt/14pt bold) থেকে সামান্য ভিন্ন; glass-এর ওপর focus ring ও VoiceOver/TalkBack automated verification নেই।

### ১৩. Performance — **১/৫ [Deep Research দরকার]**
- **ভালো দিক:** `04-liquid-glass.md:39` "limit simultaneous backdrop filters to about 6", `cf_glass.dart:94` `RepaintBoundary`, `feedback.tsx:23` `useDelayedFlag` ব্যবহার করে।
- **ফাঁক:** কোনো measured GPU/frame budget বা benchmark নেই। সক্রিয় performance anti-pattern কোডে রয়েছে: `sheet.tsx:60` layout `height` animation (`PF-1`), `tab-bar.tsx:35` `layout`+`backdrop-filter`+`lens` (`PF-2`), `cupertino.base.css:90` সর্বব্যাপী `translateZ(0)` (`PF-3`), `root.tsx:54` un-debounced `resize` (`PF-4`), `cf_nav_bar.dart:31` প্রতি scroll pixel-এ পুরো Scaffold `setState`, `cf_app.dart:79` `build()`-এ `SystemChrome` side effect (`PF-6`), `feedback.tsx:17` প্রতি spinner-এ `<style>` ইনজেকশন।

### ১৪. Platform adaptation — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** Web/Flutter/Tauri-এর জন্য `sizeClass`/`adaptive` breakpoint (`768`/`1180`), Windows Mica + `windowsChrome` config, Android `AppleHapticsPlugin.kt` ও `EdgeToEdge` রয়েছে।
- **ফাঁক:**
  1. Flutter `CfScope.isMacStyle` ও `CfPressable` `NavigationMode.traditional`-এর ওপর নির্ভর করে যা touch ডিভাইসে ভুল (`U-02`)।
  2. Tauri `tauri.conf.snippet.json:4` `macOSPrivateApi: true` Mac App Store-এ reject হয়; `apple_window.rs` config পড়ে না (`A11`); `window-vibrancy` 0.8.0 breaking change ও `trafficLightPosition` anchor যাচাইহীন।
  3. Android-এ Predictive Back gesture (Android 14+), gesture navigation bar insets, এবং Material conflict-মুক্ত navigation rule অসম্পূর্ণ।
  4. iPadOS multitasking / Split View / Pointer hover lift কেবল ১–২ লাইন doc; SwiftUI/AppKit native guidance ও Electron doc অনুপস্থিত।

### ১৫. QA / measurement — **২/৫ [Deep Research দরকার]**
- **ভালো দিক:** `lint.mjs` (২৮ নিয়ম + ৪ hooks), `apple-design-audit/references/scorecard.md` (১৫ স্তর), `capture.py`, `contrast-check.mjs`, `pixel-diff.mjs`, `apple-design-reviewer.md` (৮৫+ pass gate) সম্পূর্ণ QA কাঠামো তৈরি করেছে।
- **ফাঁক:**
  1. `lint.mjs:63` `raw-backdrop` regex bug (`Tested`: `var(--cf-glass-filter)` ব্লক করে দেয়!) ও `css-shadow` একই bug।
  2. `contrast-check.mjs` default ও `#0088FF`-এ fail করে এবং 3-digit hex-এ crash করে (`Tested`)।
  3. `capture.py` Windows-এ `python3` নির্দেশের কারণে ভেঙে যায় (`EXIT=9009`, `Tested`); WebKit/Firefox matrix নেই।
  4. `pixel-diff.mjs` কেবল raw `pixelmatch` দেয় (SSIM/CIEDE2000 নেই) এবং flag-before-arg হলে ভেঙে যায়; reference না থাকলে Rule-conformance ও Fidelity আলাদা করার মেকানিজম নেই; deterministic computed-style DOM audit, ARIA/axe-core, keyboard/focus ও animation frame-sampling QA অনুপস্থিত।

### ১৬. Localization ও RTL — **১/৫ [Deep Research দরকার]**
- **ভালো দিক:** `11-accessibility.md:45` logical properties-এর কথা বলে এবং `12-ux-writing.md:46` বাংলা টেক্সট ২০–৩০% বড় হয় ও `webBangla` stack ব্যবহারের পরামর্শ দেয়।
- **ফাঁক:**
  1. `tokens/typography.json:15`-এর `webBangla` stack `build-tokens.mjs`-এ emit-ই হয় না (`Tested`)! Non-Latin scripts (Bangla, Arabic, Hindi/Devanagari, CJK)-এর line-height, tracking disable/adjustment (Bangla বা Arabic-এ `-0.026em` negative letter-spacing ligature/matra ভেঙে দেয়!) নিয়ে কোনো নিয়ম বা CSS নেই।
  2. কোডে RTL-বিরোধী physical CSS/Dart প্রচুর: `list.tsx:82` ও `cf_list.dart:58` `left` (`inset-inline-start` নয়), `nav.tsx:36`/`cf_nav_bar.dart:66`/`list.tsx:78` `ChevronLeft`/`ChevronRight` RTL-এ mirror হয় না (`rtl:rotate-180` বা `Directionality` নেই), `alert.tsx`/`sheet.tsx`-এ physical `left-1/2` ও `ml-1 mr-2` (`mac.tsx:65`)।
  3. `Intl.NumberFormat` / `Intl.DateTimeFormat` / numeral localization (যেমন বাংলা/আরবি অঙ্ক বনাম Latin tabular) কোনো helper বা নিয়ম নেই।

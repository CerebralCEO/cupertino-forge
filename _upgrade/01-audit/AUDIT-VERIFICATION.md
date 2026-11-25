# cupertino-forge — Audit Verification ও New Issues Report

তারিখ: ২৫ নভেম্বর ২০২৬ · সূত্র: `_upgrade00-inputs\cupertino-forge — Audit, Gap Analysis ও Upgrade Blueprint.md`
যাচাই পদ্ধতি: পুরো repo-র ১২২টি ফাইল পাঠ ও পরিমাপ (`Measured`), `scripts/build-tokens.mjs`, `hooks/scripts/lint.mjs`, `scripts/contrast-check.mjs` ও `assets/sounds/*.wav` স্ক্র্যাচ টেস্ট (`Tested`), এবং কোড-স্তরের স্ট্যাটিক বিশ্লেষণ (`Static code check`)।
**যা চালানো হয়নি:** Playwright browser capture (`capture.py`), `pixel-diff.mjs`, `flutter analyze` / Flutter widget test, `cargo check`। এগুলোর কোনোটিকে "Tested" দাবি করা হয়নি।

---

## ১. আগের Audit-এর দাবিগুলোর রায় (Verdict Summary)

| Category | Total Claims | Confirmed | Not reproducible / Resolved in full repo | Partially true | Cannot verify (runtime/external) |
|---|---:|---:|---:|---:|---:|
| Architecture (A1–A12) | 12 | 9 | 2 | 1 | 0 |
| Visual Design (V-01–V-06) | 6 | 4 | 0 | 2 | 0 |
| Liquid Glass (LG-1–LG-4) | 4 | 4 | 0 | 0 | 0 |
| Motion (M-01–M-06) | 6 | 4 | 1 | 0 | 1 |
| UX & Interaction (U-01–U-07) | 7 | 6 | 0 | 1 | 0 |
| Accessibility (AX-1–AX-8) | 8 | 7 | 1 | 0 | 0 |
| Performance (PF-1–PF-6) | 6 | 5 | 0 | 0 | 1 |
| **Total** | **49** | **39** | **4** | **4** | **2** |

---

## ২. Claim-by-Claim যাচাই (A1–A12, V-, LG-, M-, U-, AX-, PF-, ও §৫/§১০)

### ২.১ Architecture Audit (A1–A12)

| ID | আগের দাবি | রায় | প্রমাণ (`file:line` ও পরীক্ষা) |
|---|---|---|---|
| **A1** | Runtime অংশ (`tokens`, `hooks`, `scripts`, `agents`, `templates`, `sounds`, `manifest`) অনুপস্থিত | **Not reproducible / Resolved in full repo** | `D:\Claude-Plugins\cupertino-forge`-এ সবগুলো ফাইল আছে (১২০টি plugin ফাইল)। `build-tokens.mjs` (`EXIT=0`), `lint.mjs` (`--hook session/prompt/post` `EXIT=0/2`), `contrast-check.mjs`, এবং ৯টি `.wav` (`Tested`)। Layout-ও `skills/apple-web/assets/` হিসেবে মিলেছে, flat নয়। |
| **A2** | Web asset-এ `cupertino.tokens.css` / `cupertino.theme.css` / `@/styles/cupertino/cupertino.tokens` import হয়, যা generator ছাড়া তৈরি হয় না | **Not reproducible (generator উপস্থিত, Tested)** | `scripts/build-tokens.mjs` (৪৪১ লাইন) বিদ্যমান এবং `_upgrade\scratch\tokens-out\`-এ চালিয়ে ৪টি ফাইল (`cupertino.tokens.css`, `cupertino.theme.css`, `cupertino.tokens.ts`, `apple_tokens.dart`) সফলভাবে তৈরি হয়েছে (`EXIT=0`)। তবে **নোট:** template বা repo-তে pre-built CSS/TS থাকে না; `/apple-init` চালাতেই হয়। |
| **A3** | Doc বনাম কোড: SKILL বলে `CupertinoRoot` contrast/transparency attribute বসায়; `root.tsx` বসায় না | **Confirmed** | `skills/apple-web/SKILL.md:30` বলে: "sets `data-cf-platform`, theme, contrast and transparency attributes"। কিন্তু `root.tsx:43-49` কেবল `data-cf-platform`, `data-theme`, `--cf-glass-intensity`, `data-cf-font`, `data-cf-squircle` বসায় — `data-contrast` বা `data-transparency` সেট করে না। |
| **A4** | Doc বনাম কোড: `CfPageRoute` "push spring"; কোড শুধু `CupertinoPageRoute`-এর `transitionDuration` override করে | **Confirmed** | `skills/apple-flutter/assets/lib/apple_ui/motion/cf_motion.dart:32-36` কেবল `transitionDuration => Duration(milliseconds: 500)` override করে; `CupertinoPageRoute` curve-ভিত্তিক (`Curves.linearToEaseOut`), কোনো `SpringSimulation` বা `AppleSprings.push` ব্যবহার করে না। |
| **A5** | Tab bar spec "inner glass capsule"; কোডে `bg-fill-3` | **Confirmed** | `components-ios/navigation.md:22` বলে "inner glass capsule highlight", কিন্তু `tab-bar.tsx:48` `bg-fill-3` এবং `cf_tab_bar.dart:53` `cf.fill3` ব্যবহার করে (`cf-glass` নয়)। |
| **A6** | Sheet spec "medium detent-এ scrim নেই"; কোডে modal Dialog + `0.4` opacity overlay | **Confirmed** | `components-ios/presentation.md:11` বলে "none at medium when the sheet does not block interaction", কিন্তু `sheet.tsx:48-54` always-modal `Dialog.Root` + `Dialog.Overlay` (`animate={{ opacity: medium ? 0.4 : 1 }}`) রেন্ডার করে। |
| **A7** | Toggle spec "knob drag"; কোডে শুধু Radix click | **Confirmed** | `components-ios/controls.md:32` বলে "tap toggles; drag knob", কিন্তু `controls.tsx:25-46` শুধু `SwitchPrimitive.Root` ও `onPointerDown`/`Up` চাপ-প্রসারণ দেয় (ড্র্যাগ নেই); `cf_controls.dart:49-53` শুধু `onTapDown`/`Up` ব্যবহার করে। |
| **A8** | `components-web.md`: "harness-এ verify করা" — harness শিপ হয়নি | **Confirmed** | `skills/apple-web/references/components-web.md:3`, `README.md:50`, `GUIDE.md:405` "rendered in Chrome / plugin's harness" দাবি করে, কিন্তু repo-তে কোনো `test/`, `harness/`, বা `package.json` শিপ হয়নি। |
| **A9** | Web component-এ ৩৪টি arbitrary `[Npx]`, `rounded-[38px]` literal + `--cf-radius-device-display` বনাম `38` ও doc `55` | **Confirmed (`Measured` + `Tested`)** | Node grep-এ `apple-web/assets/components/apple/*.tsx`-এ **ঠিক ৩৪টি** `[Npx]` ম্যাচ পাওয়া গেছে (`sheet.tsx:63` এ `rounded-[38px]` ও `rounded-t-[var(--cf-radius-device-display,38px)]`)। স্ক্র্যাচ `build-tokens.mjs` টেস্টে নিশ্চিত হয়েছে `--cf-radius-device-display` CSS-এ emit-ই হয় না! |
| **A10** | Duplicate: `/apple-audit` ও `apple-design-audit` একই পদ্ধতি দুবার বর্ণনা করে | **Confirmed** | `commands/apple-audit.md:10-15` এবং `skills/apple-design-audit/SKILL.md:10-16` একই ৪-ধাপের প্রক্রিয়া (static → structural → visual → report) ও ফরম্যাট দুবার লিখেছে। |
| **A11** | `.apple-design.json` Rust-এ পড়া হয় না; `lib-snippet.rs`-এ `WindowsChrome::Mac` ও `"MyApp"` hardcoded | **Confirmed** | `skills/apple-tauri/assets/src-tauri/src/lib-snippet.rs:13,20-21` এ `"MyApp"` ও `WindowsChrome::Mac` সরাসরি লেখা আছে; কোনো Rust ফাইলে `.apple-design.json` parse হয় না। |
| **A12** | Glass intensity সূত্র আলাদা: Flutter `0.7+0.6i`, web sheen-এ আলাদা সূত্র | **Confirmed** | `cf_glass.dart:59-60` এ `fill` alpha ও `blur` দুটোই `0.7 + 0.6 * intensity` দিয়ে গুণ হয়; web `cupertino.base.css:105` এ কেবল light-mode `::before` sheen-এ `calc(0.22 * var(--cf-glass-intensity) + 0.06)` আছে (blur বা fill alpha ও dark mode sheen-এ intensity কাজ করে না!)। |

### ২.২ Visual Design Gaps (V-01 – V-06)

| ID | রায় | প্রমাণ ও বিশ্লেষণ |
|---|---|---|
| **V-01** | **Confirmed** | `glass.tsx:37` `squircle` CSS ক্লাস ও `borderRadius` দেয় (clip-path/mask দেয় না); `squircle.tsx:18-46` আলাদা component এবং `clipPath` ব্যবহার করে (`mask-image` নয়), যা browser shadow কেটে দেয়। `squircle.ts:2` Figma corner smoothing `0.6` পোর্ট, আর CSS `corner-shape: squircle` = `superellipse(2)` (`shape.json:14`)। |
| **V-02** | **Confirmed (গুরুত্বপূর্ণ নতুন প্রমাণসহ)** | Node স্ক্রিপ্টে `tokens/typography.json` পরীক্ষা করে দেখা গেছে `$source` ট্যাগ **০টি**। আরও গুরুত্বপূর্ণ: `tokens/source/apple-ios-27-ui-kit.tokens.json` ও `apple-macos-27-ui-kit.tokens.json` (যা এখন আমাদের কাছে আছে!) থেকে দেখা যায় raw Sketch export-এ সব typography token-এর `letterSpacing` = `0` (`nonZeroLetterSpacing: 0`)! অর্থাৎ `typography.json`-এর `trackingTables` Sketch kit থেকে আসেনি; এটি HIG বা অন্য উৎস থেকে নেওয়া এবং যাচাই/ট্যাগ প্রয়োজন। |
| **V-03** | **Confirmed (Static CSS cascade check)** | `controls.tsx:39` (`Toggle`) এবং `controls.tsx:77` (`Slider` thumb) উভয়েই `bg-white` + `cf-glass` দেয়। `cupertino.base.css:81-86` অনুযায়ী `.cf-glass` আছে `@layer components`-এ, আর Tailwind v4-এর `bg-white` (`@layer utilities`) সবসময় `@layer components`-কে জিতে নেয় এবং translucent `--cf-glass-bg` ঢেকে দেয়। |
| **V-04** | **Confirmed** | `root.tsx:88-99` একটাই static 200×200 rectangular `LENS_MAP` এবং `scale="24"` (`root.tsx:80`) ব্যবহার করে; `cupertino.base.css:111-116` অনুযায়ী `@supports (backdrop-filter: url(#cf-lens))` ব্যবহার হয়। |
| **V-05** | **Confirmed** | `cupertino.base.css:124-129` ও `cf_glass.dart:144-173` একটাই স্থির `blur(6px)` + linear alpha mask ব্যবহার করে (`40%` থেকে `100%` transparent); multi-stop progressive blur নয়, এবং এর কোনো `estimate` ট্যাগও নেই। |
| **V-06** | **Partially true** | `tokens/*.json`-এ মোট ৫৪টি `$source` ট্যাগ থাকলেও `typography.json` (০), `feedback.json` (০), `icons.json` (০) এবং `layout.json`-এর অনেক key (`navBar`, `sheet`, `alert`, `macos.windowMinimum` ইত্যাদি) ট্যাগহীন। `ESTIMATES.md` তৈরির কোনো মেকানিজম নেই; `SKILL.md:137` কেবল Compliance Report-এ একটি লাইন লিখতে বলে। |

### ২.৩ Liquid Glass Gaps (LG-1 – LG-4)

| ID | রায় | প্রমাণ |
|---|---|---|
| **LG-1** | **Confirmed** | `foundations/11-accessibility.md:11` web signal হিসেবে `prefers-reduced-transparency` ধরে নেয়, আর `root.tsx` কোনো `data-transparency` attribute বা `prefers-contrast` / `forced-colors` হ্যান্ডেল করে না। `cf_glass.dart:40` মন্তব্য করে: `Flutter has no reduceTransparency query`। |
| **LG-2** | **Confirmed** | `foundations/04-liquid-glass.md:9-16` শুধু allowed/never তালিকা দেয়; কোনো decision tree, worst-case background contrast audit নিয়ম, বা screen-প্রতি max glass limit (যদিও line 39-এ "limit simultaneous backdrop filters to about 6" ও `apple-flutter/SKILL.md:68`-এ "max about 6" বলা আছে) আনুষ্ঠানিকভাবে সংযুক্ত নয়। |
| **LG-3** | **Confirmed** | A12-এ নিশ্চিত (`cf_glass.dart` vs `cupertino.base.css` বনাম `materials.json`)। `materials.json`-এ কোনো `intensityCurve` token নেই। |
| **LG-4** | **Confirmed** | `04-liquid-glass.md:39` ও `apple-flutter/SKILL.md:68` শুধু "about 6" বলে; কোনো measurable GPU/paint budget বা audit check নেই। |

### ২.৪ Motion Gaps (M-01 – M-06)

| ID | রায় | প্রমাণ |
|---|---|---|
| **M-01** | **Confirmed** | পুরো `apple-web/assets/components/apple/` grep করে দেখা গেছে `reducedMotion` শুধুমাত্র `root.tsx:12,32,42,66`-এ পড়া ও context-এ export করা হয় — **একটি component-ও `useCupertino().reducedMotion` বা `MotionConfig` ব্যবহার করে না** (`sheet.tsx`, `alert.tsx`, `menu.tsx`, `popover.tsx`, `controls.tsx`, `tab-bar.tsx`, `nav.tsx`, `feedback.tsx` সব `spring(...)` চালায়)। |
| **M-02** | **Confirmed** | `sheet.tsx:60` `animate={{ y: 0, height: `${DETENT_VH[detent]}dvh` }}` ব্যবহার করে (প্রতি ফ্রেমে layout height animate করে), `DETENT_VH` `{ medium: 52, large: 94 }` fixed (`sheet.tsx:24`), এবং drag শুধু header-এর `onPointerDown` (`sheet.tsx:66`) থেকে কাজ করে (content scroll-top handoff নেই)। |
| **M-03** | **Confirmed (Static analysis; unprofiled)** | `tab-bar.tsx:35-36` `<motion.div layout transition={spring('glassMorph')}>`-এর ভেতর `<Glass lens>` রাখে। |
| **M-04** | **Confirmed** | A4 দেখুন (`cf_motion.dart:32-36`)। |
| **M-05** | **Confirmed** | `08-motion.md:28-44` Transitions catalog দিলেও প্রতিটির `interruptible` flag এবং exact `reducedMotion` fallback কলাম নেই। |
| **M-06** | **Confirmed (Gap exists)** | `foundations/08-motion.md` ও সব references-এ `matchedGeometryEffect`, View Transitions API, বা Flutter `Hero` নিয়ে কোনো নির্দেশনাই নেই (`grep` শূন্য ফলাফল)। |

### ২.৫ UX & Interaction Gaps (U-01 – U-07)

| ID | রায় | প্রমাণ |
|---|---|---|
| **U-01** | **Confirmed** | `tab-bar.tsx` ও `controls.tsx` (`SegmentedControl`) উভয়ই custom `<button role="tab">` ব্যবহার করে; কোনো `onKeyDown` arrow-key navigation বা `tabIndex` roving নেই। `onKeyDown` পুরো `apple-web`-এ কেবল `alert.tsx:34`-এ আছে। |
| **U-02** | **Confirmed** | `cf_motion.dart:67` `MediaQuery.of(context).navigationMode == NavigationMode.traditional` দেখে `fine` নির্ধারণ করে এবং line 81-এ glass press scale `0.02` vs `0.1` বেছে নেয়; `cf_app.dart:28` ও একই `navigationMode` ব্যবহার করে। Flutter-এ touch ডিভাইসেও default `NavigationMode.traditional` থাকে। |
| **U-03** | **Confirmed (`Static code check`, widget test বাকি)** | `cf_theme.dart:84,92` এ `CfType._s` `_scaler.scale(s.fontSize!)` দিয়ে pre-scale করে (`maxScaleFactor: 3.1`), আবার `cf_list.dart:104`, `cf_button.dart:50`, `cf_nav_bar.dart:53` সহ সব widget সাধারণ `Text(...)` ব্যবহার করে যেখানে `textScaler: TextScaler.noScaling` সেট করা নেই (`cf_app.dart`-এও `MediaQuery` override নেই)। ফলে `Text` দ্বিতীয়বার `MediaQuery.textScalerOf(context)` দিয়ে scale করবে। |
| **U-04** | **Partially true** | `build-tokens.mjs:213-215` CSS-এ `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) ... }` **আসলেই** জেনারেট করে (`Tested`), তাই OS dark mode হলে SSR paint-ও dark হবে! তবে `root.tsx:35,44` `useLayoutEffect`-এ `root.dataset.theme` বসায়, ফলে user যদি `localStorage`/prop দিয়ে `appearance="light"` বা `"dark"` override করে (যা OS থেকে আলাদা), তবে hydration-এর আগে FOUC ঘটবে। |
| **U-05** | **Confirmed** | `cf_haptics.dart:46-69` iOS-এ `success`/`warning`/`error` অনুকরণ করে `lightImpact`/`mediumImpact`/`heavyImpact` + `Future.delayed` লুপ দিয়ে; কোনো iOS native `UINotificationFeedbackGenerator` platform channel নেই। Web-এ `haptics.ts:38` `setTimeout(() => iosLabel?.click(), i * 70)` করে (এমনকি `i=0`-তেও `setTimeout(..., 0)`!)। |
| **U-06** | **Confirmed** | `apple_menu.rs:43-44` `"Show Sidebar"` ও `"Show Inspector"` static string দেয় (toggle করলে `"Hide ..."` হয় না), `window` submenu (`lines 49-52`) কেবল `minimize` ও `Zoom`, এবং `help` (`line 55`) `"CmdOrCtrl+?"` ব্যবহার করে। |
| **U-07** | **Confirmed** | A11 দেখুন। |

### ২.৬ Accessibility Gaps (AX-1 – AX-8)

| ID | রায় | প্রমাণ |
|---|---|---|
| **AX-1** | **Confirmed** | M-01 দেখুন। |
| **AX-2** | **Confirmed** | LG-1 দেখুন। |
| **AX-3** | **Confirmed (Static)** | U-03 দেখুন। |
| **AX-4** | **Confirmed** | U-01 দেখুন। |
| **AX-5** | **Not reproducible / Resolved in full repo (তবে bug আছে)** | `build-tokens.mjs:251-274` আসলেই `:root[data-contrast="more"]`, `@media (prefers-contrast: more)`, `@media (prefers-reduced-transparency: reduce)`, ও `:root[data-transparency="reduce"]` CSS জেনারেট করে (`Tested`)! তাই generated CSS অনুপস্থিত দাবিটি full repo-তে প্রযোজ্য নয়; **তবে** `root.tsx` `data-contrast`/`data-transparency` বসায় না (A3), এবং `build-tokens.mjs`-এর HC ও RT CSS-এ bug আছে (§৩ দেখুন)। |
| **AX-6** | **Confirmed** | `03-color.md:57` লেখে `3:1 for large text (title3 and up)` (`title3` = 20pt regular), যেখানে HIG/WCAG থ্রেশহোল্ড ≥18pt regular বা ≥14pt bold। |
| **AX-7** | **Confirmed** | `apple-design-reviewer.md` বা `lint.mjs`-এ কোনো ARIA/Semantics automated check নেই। |
| **AX-8** | **Confirmed** | `focusRing` আছে (`color.json:203-208`), কিন্তু glass বা tinted surface-এর ওপর `--cf-focus-ring` contrast যাচাইয়ের কোনো নিয়ম নেই। |

### ২.৭ Performance Gaps (PF-1 – PF-6)

| ID | রায় | প্রমাণ |
|---|---|---|
| **PF-1** | **Confirmed** | `sheet.tsx:60` (`height` animate)। |
| **PF-2** | **Confirmed (Static; unprofiled)** | `tab-bar.tsx:35-36` (`motion.div layout` wrapping `<Glass lens>`)। |
| **PF-3** | **Confirmed** | `cupertino.base.css:90` `.cf-glass { transform: translateZ(0); }`। এটি প্রতিটি `.cf-glass`-কে permanent compositing layer বানায় এবং CSS spec অনুযায়ী ভেতরের কোনো `position: fixed` descendant-এর containing block পরিবর্তন করে ফেলে (যেমন `NavBar` বা `MacWindow`-এর ভেতর `fixed` element)। |
| **PF-4** | **Confirmed** | `root.tsx:54` `window.addEventListener('resize', update)` — কোনো debounce বা `matchMedia('(min-width: 1180px)')` listener নেই। |
| **PF-5** | **Confirmed** | `cf_glass.dart:94` `RepaintBoundary` দেয়, কিন্তু `BackdropFilter` সংখ্যার runtime guard বা profiling নেই। |
| **PF-6** | **Confirmed** | `cf_app.dart:77-79` `StatelessWidget.build()`-এর ভেতর `CfHaptics.enabled = haptics`, `CfSounds.enabled = sounds`, ও `SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge)` কল করে। |

### ২.৮ §৫ ও §১০ দাবি যাচাই (Kit, Tauri, Flutter Missing Table)

- **Tauri MAS Private API:** **Confirmed** — `Cargo-snippet.toml:3` এ `features = ["macos-private-api"]` এবং `tauri.conf.snippet.json:4` এ `"macOSPrivateApi": true` আছে, কিন্তু `apple-tauri/SKILL.md` বা `commands/apple-init.md`-এ Mac App Store rejection নিয়ে কোনো সতর্কতা নেই। `window-vibrancy = "0.7"` ও `apply_liquid_glass(window, NSGlassEffectViewStyle::Regular, None, Some(WINDOW_RADIUS))` (`apple_window.rs:26`) আছে। `trafficLightPosition` (`tauri.conf.snippet.json:17`) `{ "x": 16, "y": 26 }` বাম-প্রান্ত থেকে `x=16` এবং `52pt` toolbar-এর মাঝ `y=26` (`layout.json:62` এ `centerYFromTop: 26`) ধরে লেখা।
- **Flutter Missing Components Table (§১১):** **Confirmed** — `skills/apple-flutter/assets/lib/apple_ui/widgets/`-এ কেবল `cf_button.dart`, `cf_controls.dart` (`CfToggle`, `CfSegmented`), `cf_list.dart`, `cf_nav_bar.dart`, `cf_presentation.dart` (`showCfSheet`, `showCfAlert`), `cf_tab_bar.dart` আছে। Flutter-এ **TextField, SearchField, Slider, Stepper, Menu/ContextMenu, Popover, ProgressBar, ActivityIndicator wrapper, Hud, EmptyState, Picker/DatePicker, SwipeActions, macOS Desktop widgets** সবই অনুপস্থিত।

---

## ৩. নতুন সমস্যা (যা আগের Audit ধরেনি)

### ৩.১ Critical Code & Generator Bugs

1. **`hooks/scripts/lint.mjs:63` — `raw-backdrop` regex-এ `var()` বাইপাস হয়ে crash/false-positive (`Tested`!):**
   - Rule: `/backdrop-filter\s*:\s*(?!var\()|\bbackdrop-blur(?:-\w+)?\b/`
   - JavaScript regex-এ `(?!var\()`-এর আগে `\s*` থাকায় `backdrop-filter: var(--cf-glass-filter);` লিখলে `\s*` ১টি space না ধরে **০টি space-এ backtrack করে** এবং `: `-এ space দেখে `(?!var\()` true হয়ে যায়! স্ক্র্যাচ টেস্টে `backdrop-var.css` (`backdrop-filter: var(--cf-glass-filter);`) চালাতেই `lint.mjs` `raw-backdrop` ERROR দিয়েছে (`EXIT=2` hook-এ, `EXIT=1` CLI-তে)। অর্থাৎ কেউ token `var(--cf-glass-filter)` ব্যবহার করলেও লিন্টার তাকে ব্লক করবে! (`lint.mjs:54` `css-shadow`-এও একই `\s*` + `(?!var\()` pattern থাকায় `box-shadow: var(--cf-shadow-popover)` ও একইভাবে backtrack হয়ে false-positive হবে!)
2. **`skills/apple-web/assets/components/apple/button.tsx:61-62` — `<Button variant="glass">` ও `prominentGlass`-এর text color dead code:**
   - `variantCls` (`lines 17-26`)-এ `glass: 'text-label-glass'` ও `prominentGlass: 'text-accent-contrast'` রাখা হয়েছে, কিন্তু `line 61` লিখেছে `!isGlass && variantCls[variant]`! ফলে `variant="glass"` এবং `variant="prominentGlass"` বাটনে **কোনো text color ক্লাসই লাগে না** (সবসময় parent-এর color inherit করে)।
3. **`skills/apple-web/assets/styles/cupertino.base.css:48` — Inter tracking compensation নষ্ট ও অসম্পূর্ণ:**
   - `html[data-cf-font="inter"] body { letter-spacing: -0.01em; }` লেখা হয়েছে। এটি `body`-এর `--cf-text-body-tracking` (`-0.026em`) **যোগ না করে overwrite করে `-0.01em` বানিয়ে দেয়**, এবং Tailwind-এর `.text-headline`, `.text-large-title`, `.text-title1` ক্লাসে কোনো compensation দেয় না!
4. **`skills/apple-flutter/assets/lib/apple_ui/glass/cf_glass.dart:66,81-92` — `ClipPath` ড্রপ শ্যাডো কেটে ফেলে + dead code `rim`:**
   - `surface` (`DecoratedBox`, line 67-74)-এ outer `shadows` (`blurRadius: 24, offset: (0, 8)`) আছে, কিন্তু `line 82` সেই `surface`-কে `ClipPath(clipper: ShapeBorderClipper(shape: shape), child: BackdropFilter(... child: surface))` দিয়ে wrap করে। ফলে **সব outer box-shadow `ClipPath`-এ কাটা পড়ে যায়** (যখন `blur > 0`)! আর `line 66`-এর `final rim = Border.all(...)` ভ্যারিয়েবলটি কোথাও ব্যবহারই হয়নি।
5. **`skills/apple-flutter/assets/lib/apple_ui/widgets/cf_nav_bar.dart:31,65-68` — প্রতি স্ক্রল ফ্রেমে `setState` ও অফ-সেন্টার inline title:**
   - `_scroll.addListener(() => setState(() => _offset = _scroll.offset))` (`line 31`) প্রতি স্ক্রল পিক্সেলে পুরো `CfLargeTitleScaffold` (ও সব `widget.slivers`) rebuild করে!
   - `line 66-68`: `onBack == null` হলে বাম দিকে কোনো `44px` placeholder নেই, অথচ ডান দিকে `trailing == null` হলে `SizedBox(width: 44)` আছে — ফলে inline title কেন্দ্র থেকে সরে থাকে (`trailing` থাকলে আরও বেশি সরে)।
6. **`skills/apple-flutter/assets/lib/apple_ui/widgets/cf_tab_bar.dart:47,53,67` — Minimized ট্যাব কাজ করে না, capsule স্লাইড করে না, search a11y নেই:**
   - `onTap: () { if (i != index) ... }` (`line 47`) — minimized অবস্থায় শুধু `index` দেখায়, তাই minimized ট্যাবে ট্যাপ করলে `i == index` হওয়ায় **কোনো callback বা expand কাজই করে না** (Web `tab-bar.tsx:44`-এর মতো `if (minimized)` হ্যান্ডেল নেই)।
   - `AnimatedContainer` প্রতি ট্যাবের ভেতর আছে (`line 48`), তাই active ট্যাব বদলালে capsule এক ট্যাব থেকে আরেক ট্যাবে slide হয় না (শুধু fade হয়)।
   - Search button (`line 67-70`) `Semantics` wrapper ছাড়াই আছে।
7. **`skills/apple-web/assets/components/apple/alert.tsx:34` — Keyboard `Enter` conflict:**
   - `Dialog.Content`-এ `onKeyDown` সব `Enter` চাপেই `default` অ্যাকশন চালায় — এমনকি user Tab করে `Cancel` বা `Delete` (destructive) বাটনে ফোকাস করে `Enter` চাপলেও default অ্যাকশন ফায়ার হয়!
8. **`scripts/build-tokens.mjs:263-268 & 271-274` — CSS Cascade ও Reduced Transparency অসম্পূর্ণতা (`Tested`):**
   - `prefers-contrast: more` ব্লক (`line 264`) `:root:not([data-contrast="normal"])`-এ `lightHC` বসায়, যা specificity `[0,2,0]` — অথচ `line 212` `:root[data-theme="dark"]`-এরও specificity `[0,2,0]`। যেহেতু HC ব্লক **পরে** আছে, OS যদি Light + High Contrast হয় আর অ্যাপ dark mode-এ থাকে, তবে dark mode নষ্ট হয়ে `lightHC` জিতে যাবে (উল্টো `prefers-contrast: more` + `data-theme="dark"` selector নেই)!
   - `:root[data-transparency="reduce"]` (`line 274`) কেবল `glass-bg/filter` ও `glass-clear-*` সেট করে; `--cf-glass-large-bg/filter` এবং `--cf-glass-menu-bg/filter` বাদ পড়ে। আর `@media (prefers-reduced-transparency: reduce)` (`line 272`) `--cf-glass-large-bg` ও `--cf-glass-menu-bg` বাদ দিয়ে শুধু filter `none` করে।
9. **`scripts/contrast-check.mjs` — Apple System Blue ফেইল করে, ৩-ডিজিট hex-এ crash করে (`Tested`):**
   - Apple-এর নিজের `#0088FF` চালালে **৩টি FAIL** দেখায় (`3.52:1` on `#FFFFFF`, `3.15:1` on `#F2F2F7`, `3.96:1` on `#2C2C2E`, `EXIT=1`), `GUIDE.md`-এর `#5B3DF5` দিলে **৫টি FAIL** দেখায় (`EXIT=1`), default মোডে **১৪টি FAIL** (`label-2` light `3.44:1`) দেখায়, এবং `--accent "#fff"` দিলে `TypeError: Cannot read properties of null` দিয়ে crash করে (`Tested`)। এ ছাড়া line 14-এ WCAG 2.0-এর পুরনো `0.03928` ধ্রুবক ব্যবহৃত (WCAG 2.1/2.2 `0.04045`)।
10. **`scripts/pixel-diff.mjs:16,21` — Plugin ডিরেক্টরিতে side-effect ও flag parsing bug:**
    - `pixelmatch` না পেলে plugin-এর নিজের `scripts/` ফোল্ডারে `npm i` চালায়; আর `line 21` `process.argv.slice(2).filter(x => !x.startsWith('--'))` ব্যবহার করায় `--out diff.png ours.png ref.png` দিলে `diff.png`-কে `a` ফাইল ধরে ভুল করে!

### ৩.২ Doc বনাম Code ও Policy অসঙ্গতি

| Area | File:Line | Doc / Rule | বাস্তব কোড অসঙ্গতি |
|---|---|---|---|
| **Haptic + Sound stacking** | `controls.tsx:29`, `cf_controls.dart:38-39` | `10-haptics-sound.md:37`: *"Never stack haptic and sound on toggles"* | Toggle change-এ `haptic('selection')` এবং `playSound('toggle-on'/'toggle-off')` **দুটোই একসাথে** চালায়! |
| **TabBar default haptic** | `tab-bar.tsx:44`, `cf_tab_bar.dart:47` | `components-ios/navigation.md:26`: *"none by default"* | প্রতিবার ট্যাব বদলালে `haptic('selection')` ও `CfHaptics.selection()` চালায়। |
| **Separator inset** | `list.tsx:82`, `cf_list.dart:58` | `layout.json:38` & `01-layout.md:30`: `60` | কোডে `left: hasIcon ? 57 : 16` (`57`, token নয় ও RTL-বিরোধী `left`)। |
| **Duplicate `<h1>`** | `nav.tsx:39,58` | HTML semantics / a11y | একই সাথে `NavBar`-এ দুটো `<h1>` রেন্ডার করে (inline hidden + large title)। |
| **Nested `<section>`** | `list.tsx:23,26` | HTML semantics | `<section>`-এর ভেতর আরেকটি `<Squircle as="section">` রেন্ডার করে। |
| **Duplicate `<style>`** | `feedback.tsx:17` | Clean CSS | প্রতিটি `<ActivityIndicator />` মাউন্টে `<style>@keyframes cf-spin...</style>` ইনজেক্ট করে। |
| **Glass `asChild`** | `glass.tsx:18,26` | React DOM safety | `asChild?: boolean` টাইপে আছে কিন্তু destructure না করায় `...rest` দিয়ে DOM-এ `aschild="true"` attribute লিক হতে পারে। |
| **Dark mode sheen intensity** | `cupertino.base.css:109` | `materials.json:19`: `glassIntensity` scales glass | Dark mode-এ `.cf-glass::before` `0.10` hardcoded; `--cf-glass-intensity` ব্যবহারই করে না। |
| **`appearance` prop sync** | `root.tsx:29` | React controlled/prop update | `useState(appearance)` একবার ইনিশিয়াল হয়; parent `appearance` prop বদলালে state update হয় না। |
| **MacWindow inactive shadow & button type** | `mac.tsx:32,145,160` | `06-elevation.md:29` + HTML form safety | `MacWindow` `active={false}` হলেও `shadow-window-active` রাখে (`shadow-window-inactive` অব্যবহৃত); `Checkbox` ও `RadioGroup` `<button>`-এ `type="button"` নেই (ফর্মে submit হয়ে যাবে)। |
| **Menu trailing separator & iOS SubMenu** | `menu.tsx:71,79` | Menu anatomy | শেষ `MenuSection`-এর পরও separator রেন্ডার হয়; `SubMenu` (`h-6 rounded-menu-item-highlight`) শুধু macOS height/style-এ বাঁধা। |
| **Popover Tooltip Provider** | `popover.tsx:35-47` | Radix Tooltip pattern | প্রতিটি `<Tooltip>` আলাদা `<T.Provider delayDuration={1000}>` তৈরি করে, ফলে tooltip group skip-delay কাজ করে না। |
| **Flutter macOS bg & HC** | `cf_app.dart:96` | `cf_theme.dart:55` | `scaffoldBackgroundColor: AppleIOSColors.bg.resolve(b)` সবসময় iOS bg নেয় এবং `highContrast` পাস করে না। |
| **Flutter `CfSegmented` motion** | `cf_controls.dart:112-113` | `08-motion.md:26` | `Curves.easeOutBack` ব্যবহার করে (spring নয়, `disableAnimations` মানে না)। |
| **Flutter `showCfAlert` buttons** | `cf_presentation.dart:75-83` | `09-interaction-states.md` | Raw `GestureDetector` ব্যবহার করে — কোনো press feedback (`CfPressable`) বা `Semantics(button: true)` নেই। |
| **Flutter `CfSounds` audio context** | `cf_sounds.dart:31` | Performance | প্রতিটি play-এ `await p.setAudioContext(...)` কল করে; একবার player তৈরির সময় সেট করা উচিত ছিল। |

### ৩.৩ Hardcoded মান যা Token হওয়া উচিত

- `scripts/build-tokens.mjs:120-126,130,155,255-258`: ১১টি raw color/hex সরাসরি JS-এ লেখা (`#F5F5F7`, `#262626`, `#2E2E2E`, `#1E1E1E`, `#D8D8D8`, `#3A3A3A`, `#000000@0`, `#ffffff`, `rgb(60 60 67 / 0.8)` ইত্যাদি), যা `tokens/color.json`-এ থাকা উচিত।
- `controls.tsx:21,78` ও `cf_controls.dart:45-46,107`: Toggle `64×28` / `38×24` / `38×22`, Slider `38×24` / `20×20`, Segmented height `36` hardcoded — generated token থেকে পড়া হয় না।
- `cf_button.dart:23,27,53`: `mini: 28`, `extraLarge: 56`, horizontal paddings hardcoded (`AppleLayout` ব্যবহার না করে)।
- `apple_window.rs:8-10`: `WINDOW_RADIUS = 12.0`, `TRAFFIC_LIGHT_X = 16.0`, `TRAFFIC_LIGHT_Y = 26.0` ও `tauri.conf.snippet.json:17` hardcoded (`tokens/` থেকে build হয় না)।
- `apple-web/assets/components/apple/*.tsx`: ৩৪টি arbitrary `[Npx]` Tailwind class (`sheet.tsx`, `alert.tsx`, `mac.tsx`, `menu.tsx`, `nav.tsx`, `list.tsx`, `controls.tsx`, `feedback.tsx`, `fields.tsx`, `button.tsx`, `tab-bar.tsx`)।

### ৩.৪ Duplicate Logic ও Dead Code / Dead Files

1. **Squircle Bezier math দুবার লেখা:** `apple-web/assets/lib/squircle.ts:7-22` (TypeScript) এবং `apple-flutter/assets/lib/apple_ui/shapes/squircle_border.dart:20-59` (Dart)।
2. **Sound synthesis রেসিপি ৩ জায়গায়:** `tokens/feedback.json`, `scripts/synth-sounds.py`, ও `apple-web/assets/lib/sounds.ts`। **Drift:** `send`-এ `synth-sounds.py` দেয় `q=0.8`, `1200Hz` static bandpass + linear ramp; আর `sounds.ts` দেয় `Q=2`, `400→3000Hz` exponential sweep! `error`-এ `synth-sounds.py` `440→349.2Hz` triangle, যা `feedback.json` (`detuned square low pass 2kHz`)-এর থেকে ভিন্ন।
3. **Audit প্রসেস ডুপ্লিকেট:** `commands/apple-audit.md` ও `skills/apple-design-audit/SKILL.md`।
4. **Dead / Unused:** `skills/apple-tauri/references/` খালি ফোল্ডার; `cf_glass.dart:66` অব্যবহৃত `rim` ভ্যারিয়েবল; `button.tsx:18-19` অকার্যকর `variantCls.glass` / `prominentGlass`।
5. **Self-lint failure (`Tested`):** `node hooks/scripts/lint.mjs --all --root .` চালালে plugin-এর নিজের `hooks/scripts/lint.mjs`, `scripts/build-tokens.mjs`, `scripts/contrast-check.mjs`-এ ২০টি error ও ১টি warning আসে (যেহেতু plugin repo-তে `.apple-design.json` না থাকায় hook নিষ্ক্রিয়, কিন্তু manual CLI `--all` এগুলো ধরে)।

### ৩.৫ Windows Path ও OS-নির্ভরতা সমস্যা

1. **`python3` কমান্ড Windows 11-এ ভেঙে যায় (`Tested`, `EXIT=9009`):** `agents/apple-design-reviewer.md:12` এবং `skills/apple-design-audit/SKILL.md:14` `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/capture.py` চালাতে বলে। Windows-এ `python3.exe` হলো Microsoft Store App Execution Alias, যা exit code `9009` দিয়ে ব্যর্থ হয়; এখানে `python` ব্যবহার করতে হয়।
2. **`lint.mjs:122` `git status --porcelain` Windows-এ fragile:** `out.split('\n')` ব্যবহার করে — `core.autocrlf` বা `\r\n` থাকলে `\r` থেকে যায়; এছাড়া স্পেস বা non-ASCII থাকা ফাইলের নামে git যে `"..."` quotes দেয়, তা unquote করা হয় না।
3. **Hook stdin piping on Windows:** `hooks/hooks.json` `node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --hook ...` চালায় এবং `lint.mjs:138` `fs.readFileSync(0, 'utf8')` ব্যবহার করে। PowerShell থেকে pipe করে `--hook session`, `--hook prompt` (EN ও বাংলা উভয়!), ও `--hook post` Windows-এ Node v24.22.1 দিয়ে সফলভাবে চলেছে (`Tested`, exit `0` ও `2`)। তবে Windows paths-এ `EXCLUDE_FILES` (`[\\/]`) কাজ করলেও regex-এর backslash/forward-slash consistency যাচাই রাখা ভালো।
4. **`scripts/capture.py:17` Chrome discovery:** কেবল `C:\Program Files\Google\Chrome\Application\chrome.exe` দেখে; `Program Files (x86)`, `%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`, এবং Edge-এর `Program Files (x86)\Microsoft\Edge\Application\msedge.exe` fallback দেখে না।
5. **Line Endings (`Measured`):** `.gitattributes` (`* text=auto`) থাকায় সব ১০৯টি টেক্সট plugin ফাইল বর্তমানে পরিষ্কার **LF**। কোনো shell (`.sh`/`.bash`) স্ক্রিপ্ট plugin-এ নেই — সব স্ক্রিপ্ট Node (`.mjs`) বা Python (`.py`), যা Windows-এর জন্য বড় ইতিবাচক দিক।

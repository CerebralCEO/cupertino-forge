# cupertino-forge — Audit, Gap Analysis ও Upgrade Blueprint

তারিখ: ২৫ নভেম্বর ২০২৬ · পরিধি: শুধু Research ও Audit, কোনো Plugin ফাইল পরিবর্তন করা হয়নি।

**Evidence লেবেল:** `Official` (Apple/Flutter/Tauri/W3C/Playwright doc) · `Measured` (ইনস্টল করা ফাইলে grep/গণনা) · `Inferred` (কোড + doc থেকে যুক্তিভিত্তিক, চালিয়ে দেখা হয়নি) · `Estimated` · `Platform-dependent` · `Unverified`।

**সীমাবদ্ধতা (আগেই বলে রাখছি):** (১) এই sandbox-এ কোনো browser, Flutter বা Rust toolchain চালানো হয়নি, তাই কোনো কিছুই "Tested" নয়। (২) `github.com/CerebralCEO/cupertino-forge` fetch করা যায়নি (tool শুধু search-এ আসা URL খোলে), তাই upstream repo-তে কী আছে তা `Unverified`। (৩) iOS 27/macOS 27-এর পরিবর্তন শুধু প্রেস রিপোর্ট থেকে নিশ্চিত করেছি, Apple-এর primary iOS 27 পাতা পাইনি।

## ১. Executive Summary

- Plugin-এর **design knowledge** (foundations, patterns, component spec, anti-patterns, estimate-tagging, licensing নিয়ম) বেশ শক্ত এবং সৎ। Spring math Apple-এর doc-এর সঙ্গে মেলে (`Official`)।
- **সবচেয়ে বড় সমস্যা (P0):** ইনস্টল করা কপি শুধু `skills`। SKILL ফাইলগুলো যেসব জিনিসের ওপর নির্ভর করে (`tokens/*.json`, `scripts/build-tokens.mjs`, `hooks/scripts/lint.mjs`, `scripts/capture.py`, `scripts/contrast-check.mjs`, `scripts/synth-sounds.py`, `templates/`, `assets/sounds`, `agents/apple-design-reviewer`, `agents/apple-spec-researcher`, plugin manifest) তার একটাও এই tree-তে নেই (`Measured`: পুরো filesystem-এ find/grep)। অর্থাৎ "lint hook ব্লক করবে", "Visual Audit", "token generate" — এগুলো এখানে যাচাই করা অসম্ভব।
- **আসল কোডে verified/likely bug:** Flutter-এ touch ডিভাইসে glass press scale ভুল (`Official`), Dynamic Type সম্ভবত দুবার scale হচ্ছে (`Inferred`), web-এ Safari-তে Reduce Transparency ধরা যায় না (`Official`), Safari/Firefox-এ glass rect-এ squircle fallback নেই (`Measured`+`Official`), JS-এ Reduced Motion কোথাও মানা হয় না (`Measured`), Tauri transparent window Mac App Store-এ বাধা (`Official`)।
- **QA:** বর্তমানে ১৫-layer scorecard আছে, কিন্তু reference ছাড়া "fidelity" স্কোর দেওয়ার সুযোগ রয়ে গেছে। প্রস্তাব: Rule-conformance ও Fidelity আলাদা করা, deterministic computed-style audit + দ্বিমুখী image diff।
- **নতুন Agent/Skill/Command প্রায় লাগবে না।** আপনার তালিকার বেশিরভাগ প্রস্তাব আমি প্রত্যাখ্যান করেছি (কারণসহ, §১৬–১৭)। দরকার: `/apple-doctor` (P0) এবং বিদ্যমান audit skill-এর ভেতরে QA reference।

## ২. Current Plugin Architecture Overview

`Measured`: ৮২টি ফাইল, প্রায় ৫.৪ হাজার লাইন, ১৩টি folder।

| Folder | ভূমিকা |
| --- | --- |
| `apple-design-core` | Router skill + `references/foundations/00–15`, `anti-patterns.md`, `patterns/{screens,states}`, `components-ios/`, `components-macos/` |
| `apple-init`, `apple-screen`, `apple-audit`, `apple-component`, `apple-sync` | আসলে slash command (frontmatter-এ `description`/`argument-hint`, `name` নেই) |
| `apple-design-audit` | ১৫-layer scorecard + report format |
| `apple-web` | React/Tailwind/Radix/Motion asset: `cupertino.base.css`, `components/apple/*.tsx`, `lib/*` |
| `apple-flutter` | `cf_glass`, `cf_motion`, `squircle_border`, `cf_theme`, `cf_app`, widgets, Android haptics `.kt` |
| `apple-tauri` | `apple_window.rs`, `apple_menu.rs`, `lib-snippet.rs`, config snippet |

প্রবাহ: `.apple-design.json` → core router → platform adapter → Contract (১. spec পড়ো, ২. token, ৩. primitive, ৪. verify) → lint hook + audit।

**Layout অসঙ্গতি (`Measured`):** doc বলে `${CLAUDE_PLUGIN_ROOT}/skills/apple-web/assets/`, কিন্তু এখানে folder flat (`cupertino-forge:apple-web/assets`)। Command-গুলো skill হিসেবে দেখাচ্ছে।

## ৩. Existing Capabilities (যা রক্ষা করতে হবে)

1. **Estimate-tagging সংস্কৃতি:** Apple-এর অপ্রকাশিত মান `estimate` চিহ্নিত — এটি আপনার নিয়ম ৭-এর সঙ্গে মেলে।
2. **Spring math:** stiffness=(2π/d)², damping=4π(1−b)/d; `Spring(duration 0.5, bounce 0.3)` → 157.9/17.6 — Apple Spring doc-এর উদাহরণের সঙ্গে হুবহু মেলে (`Official`: developer.apple.com/documentation/swiftui/spring)। snappy base bounce 0.15 ও একই doc-এ নিশ্চিত।
3. **Glass নিয়ম:** "শুধু সবচেয়ে গুরুত্বপূর্ণ functional element-এ" এবং clear variant-এ ৩৫% dim layer — Apple HIG Materials-এর সঙ্গে সঙ্গত (`Official`: developer.apple.com/design/human-interface-guidelines/materials)। knob→glass ও button→menu morph-ও `Official` (Adopting Liquid Glass)।
4. **Hit target:** iOS 44 / macOS 28 default, ২৮/২০ minimum — HIG Accessibility-র সঙ্গে সঙ্গত (`Official`, HIG text mirror থেকে)।
5. **Dynamic Type table** (Large: body 17/22, title1 28/34 …) HIG-সম্মত বলে আমার জানা আছে, তবে tracking নিয়ে §৫ দেখুন।
6. **Licensing/fallback নিয়ম** (SF font/SF Symbols), ১৫-layer scorecard, Compliance Report, Golden Rules।
7. **Honest self-label:** Flutter/Tauri adapter "not compiled" বলে স্বীকার করে।

## ৪. Architecture Audit

| # | পর্যবেক্ষণ | Evidence |
| --- | --- | --- |
| A1 | Runtime অংশ (tokens, hooks, scripts, agents, templates, sounds, manifest) অনুপস্থিত | `Measured` |
| A2 | Web asset `cupertino.tokens.css`/`cupertino.theme.css`/`@/styles/cupertino/cupertino.tokens` import করে — generator ছাড়া এগুলো তৈরি হয় না | `Measured` |
| A3 | Doc বনাম কোড: SKILL বলে `CupertinoRoot` contrast/transparency attribute বসায়; `root.tsx` শুধু platform, theme, glass, font, squircle বসায় | `Measured` |
| A4 | Doc বনাম কোড: `CfPageRoute` "push spring"; কোড শুধু `CupertinoPageRoute`-এর `transitionDuration` override করে (Cupertino route curve-ভিত্তিক) | `Inferred` |
| A5 | Tab bar spec "inner glass capsule"; কোডে `bg-fill-3` | `Measured` |
| A6 | Sheet spec "medium detent-এ scrim নেই"; কোডে modal Dialog + 0.4 opacity overlay | `Measured` |
| A7 | Toggle spec "knob drag"; কোডে শুধু Radix click | `Measured` |
| A8 | `components-web.md`: "harness-এ verify করা" — harness শিপ হয়নি | `Unverified` |
| A9 | Plugin নিজের Golden Rule ভাঙে: web component-এ ৩৪টি arbitrary `[Npx]`, `rounded-[38px]` literal (সঙ্গে token fallback 38, doc-এ device radius 55) | `Measured` |
| A10 | Duplicate: `/apple-audit` ও `apple-design-audit` একই পদ্ধতি (static→structure→visual→report→fix?) দুবার বর্ণনা করে | `Measured` |
| A11 | `.apple-design.json` Rust-এ পড়া হয় না; `lib-snippet.rs`-এ `WindowsChrome::Mac` ও "MyApp" hard-coded | `Measured` |
| A12 | Glass intensity সূত্র আলাদা: Flutter `0.7+0.6i` (fill ও blur), web-এ sheen-এ আলাদা সূত্র — একক token উৎস নেই | `Measured` |

## ৫. Apple Design Research Findings

| বিষয় | ফল | Class |
| --- | --- | --- |
| iOS 27/macOS 27 অস্তিত্ব ও Liquid Glass পরিবর্তন (intensity slider, uniform corner radius, edge-to-edge sidebar, রঙিন sidebar icon) | একাধিক প্রেস রিপোর্টে সঙ্গত: macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27/, cultofmac.com/news/liquid-glass-changes-ios-27-macos-27, neowin.net/news/apple-finally-brings-the-slider-for-liquid-glass-and-many-other-changes/ | Secondary (Official নয়) |
| Slider-এর দিক | প্রেসে "opaque↔clear"; plugin বলে "clear↔tinted" | `Unverified` |
| Material নীতি | functional layer-এ সীমিত, clear variant-এ ৩৫% dim | `Official` (HIG Materials) |
| Spring | Apple formula plugin-এর সঙ্গে মেলে | `Official` |
| Typography tracking | Plugin iOS body 17pt = −0.026em (পুরনো HIG table-এর সঙ্গে সঙ্গত বলে আমার ধারণা), কিন্তু একটি তৃতীয়-পক্ষ সংকলন ভিন্ন সংখ্যা দেয়; Apple kit-এর প্রাথমিক table আনা যায়নি | `Unverified` (P1) |
| Contrast | HIG: ≤17pt এ 4.5:1, ≥18pt বা Bold-এ 3:1। Plugin: "title3 ও উপরে 3:1" (title3=20pt) — সামান্য কঠোর/অসঙ্গত | `Official` |
| Corner shape | CSS `corner-shape: squircle` শুধু Chromium 139+; Safari ও Firefox-এ নেই/সদ্য এসেছে (caniuse.com/mdn-css\_properties\_corner-shape\_squircle)। CSS `squircle` = `superellipse(2)`, Apple-এর continuous corner থেকে আলাদা (github.com/spatio-labs/squircle) | `Platform-dependent` / `Inferred` |
| Reduce Transparency (web) | `prefers-reduced-transparency` শুধু Chromium; Safari-তে নেই (caniuse.com/mdn-css\_at-rules\_media\_prefers-reduced-transparency) | `Official` |
| Flutter `MediaQuery.navigationMode` | ডিফল্ট `traditional`; এটি directional-focus বনাম pointer নির্দেশ করে, touch বনাম mouse নয় (api.flutter.dev/flutter/widgets/NavigationMode.html) | `Official` |
| Flutter `Text` নিজেই `textScaler` প্রয়োগ করে (api.flutter.dev/flutter/widgets/Text/textScaler.html; docs.flutter.dev/release/breaking-changes/deprecate-textscalefactor) | `Official` |  |
| Tauri transparent window-এর জন্য macOS private API লাগে, যা App Store গ্রহণযোগ্যতা বাধা দেয় (v1.tauri.app/fr/v1/api/config; v2 পাতা আবার দেখা দরকার) | `Official` (v1 doc) |  |
| `window-vibrancy` 0.7.1-এ `apply_liquid_glass(window, style, tint, radius)` (plugin-এর সঙ্গে মেলে); 0.8.0-এ API বদলেছে (docs.rs/crate/window-vibrancy/latest/source/src/lib.rs, docs.rs/crate/window-vibrancy/0.8.0) | `Official` |  |
| `trafficLightPosition`-এর বিন্দু (top-left না center) | doc-এ স্পষ্ট নয় | `Unverified` |

## ৬. Visual Design Gaps

**V-01 · P1 · Squircle fallback Glass rect-এ প্রযোজ্য নয়।** `glass.tsx` শুধু `border-radius` + `squircle` class দেয়; clip-path-ভিত্তিক `Squircle` আলাদা component। ফলে Safari/Firefox-এ alert, menu, popover, medium sheet-এর কোণ সাধারণ গোল। Chromium-এর native curve (superellipse 2) ও fallback (figma-smoothing 0.6) আবার ভিন্ন — Chrome ও Safari আলাদা দেখাবে। *সমাধান:* সব engine-এ একই path-based mask (SVG `mask-image`, clip-path নয়, যাতে shadow কাটা না পড়ে; shadow আলাদা sibling layer); native `corner-shape` ঐচ্ছিক। *ফাইল:* `glass.tsx`, `squircle.tsx`, `lib/squircle.ts`, `cupertino.base.css`, `05-shape.md`। *Verify:* WebKit+Chromium screenshot তুলনা। Token: না।

**V-02 · P1 · Tracking মান যাচাই।** Apple Design Resources kit export-এর সঙ্গে `tokens/typography.json` মিলিয়ে `$source` ট্যাগ বসান। *ফাইল:* `02-typography.md`, tokens, `apple-sync`। Token: হ্যাঁ (source ট্যাগ)।

**V-03 · P2 · Glass knob।** `controls.tsx`-এ knob `bg-white` + `cf-glass`। Tailwind utilities layer components layer-কে হারায়, তাই translucency সম্ভবত অকার্যকর (`Inferred`, render করা হয়নি)। *সমাধান:* knob-এ glass state-এর জন্য data-attribute দিয়ে `bg` বাদ দেওয়া। Slider thumb-এও একই।

**V-04 · P3 · Lens filter।** একটাই static displacement map, fixed scale 24, আকার/আকৃতি-নিরপেক্ষ, Chromium-only (`Platform-dependent`)। ক্যাপসুল/বৃত্তে rect gradient ভুল প্রান্ত দেয়। শুধু hero surface-এ রাখুন, per-size map তৈরি করুন — অগ্রাধিকার কম।

**V-05 · P3 · Scroll-edge effect:** স্থির `blur(6px)` + linear mask। Apple-এর progressive blur-এর সংখ্যাগত spec প্রকাশিত নয় (`Unknown`), তাই কয়েক-স্তর progressive blur `Estimated` হিসেবে চিহ্নিত করে করুন।

**V-06 · P2 · Estimate token-এর স্বচ্ছতা।** Safe-area top 62, section radius 26, alert radius 34, toggle 64×28 / 38×24, tab bar 62, macOS window radius 12 ইত্যাদি `estimate`। Gap: audit report এগুলোর ওপর "pixel-accurate" দাবি আটকায় না। *সমাধান:* generator `tokens/ESTIMATES.md` বানাক, report-এ "X টি estimate-ভিত্তিক" লাইন বাধ্যতামূলক।

## ৭. Liquid Glass ও Material Gaps

- **LG-1 (P1) Reduce Transparency Safari-তে অদৃশ্য।** `11-accessibility.md` web signal হিসেবে `prefers-reduced-transparency` ধরে নেয়; iOS/macOS Safari (সর্বোচ্চ fidelity-র target) এটি সমর্থন করে না। *সমাধান:* app-level `transparency: system | reduced` setting (`CupertinoRoot`), `prefers-contrast: more` ও `forced-colors` কে proxy ধরা, doc-এ platform matrix। `Official` ভিত্তি।
- **LG-2 (P2) Glass বনাম Solid সিদ্ধান্ত-গাছ নেই।** বর্তমানে allowed/never তালিকা আছে। যোগ করুন: (ক) কনটেন্ট স্তর হলে solid; (খ) navigation/controls ভাসমান হলে glass; (গ) glass-এর ওপর টেক্সট হলে worst-case background-এ contrast মাপা বাধ্যতামূলক; (ঘ) একই screen-এ glass-এর সংখ্যা সীমা (`Estimated`, HIG-এ সংখ্যা নেই)।
- **LG-3 (P2) Intensity একক উৎস।** A12 দেখুন → `materials.json`-এ `intensityCurve`।
- **LG-4 (P3) Performance বাজেট:** `backdrop-filter` ও Flutter `BackdropFilter` খরচ নিয়ে `Estimated` guardrail (সংখ্যা মাপার আগে দাবি নয়)।

## ৮. Animation ও Motion Gaps

- **M-01 (P1) JS Reduced Motion মানা হয় না।** `Measured`: শুধু `root.tsx` মান পড়ে, কোনো component পড়ে না। *সমাধান:* root-এ Motion-এর `MotionConfig reducedMotion="user"` (API বিবরণ আবার যাচাই করুন, `Unverified`) এবং layout animation-এর জন্য ক্রস-ফেড বিকল্প।
- **M-02 (P1) Sheet `height` animate করে** (প্রতি frame layout), detent `52dvh/94dvh` fixed, drag শুধু header থেকে — content scroll-top-এ নামানো যায় না। *সমাধান:* fixed-height container + `translateY` শুধু; scroll-to-drag handoff। ফাইল: `sheet.tsx`, `07/09` doc।
- **M-03 (P2) Tab bar `layout` prop glass-এর ওপর:** scale distortion ও খরচ (`Inferred`)। selection capsule আলাদা layer-এ `layoutId`।
- **M-04 (P2) `CfPageRoute`:** spring দাবি বাদ দিয়ে "Approximation (Cupertino curve, native back-gesture parity)" লিখুন। Interactive back gesture রাখা জরুরি।
- **M-05 (P2) Interaction→Motion সিদ্ধান্ত সারণি।** `08-motion.md`-এ token তালিকা আছে, কিন্তু "কোন ইন্টারঅ্যাকশনে কোন spring, interruptible কি না, reduced-motion বিকল্প কী" একটি টেবিল নেই। যোগ করুন (নতুন feature নয়, বিদ্যমান token-এর ম্যাপ)।
- **M-06 (`Unverified`)** Matched-geometry/View Transitions নির্দেশনা আছে কি না আমি নিশ্চিত হতে পারিনি; থাকলে সরাসরি নিয়ম, না থাকলে P3 reference।

## ৯. UX ও Interaction Gaps

- **U-01 (P1) Keyboard:** custom `TabBar`/`SegmentedControl`-এ arrow-key roving focus নেই; `onKeyDown` শুধু `alert.tsx`-এ (`Measured`)। W3C ARIA tabs pattern অনুযায়ী দরকার (লিংক এই সেশনে আনা হয়নি)। Radix `Tabs`/`ToggleGroup` ব্যবহার করুন।
- **U-02 (P1) Flutter `CfPressable`:** `navigationMode == traditional` প্রায় সবসময় true, তাই ফোনে glass press scale 1.1-এর বদলে 1.02 (`Official`)। *সমাধান:* `Listener`-এ `PointerDeviceKind` (touch/mouse/trackpad) দিয়ে সনাক্ত। *ফাইল:* `cf_motion.dart`।
- **U-03 (P1) Flutter Dynamic Type দুবার scale:** `CfType` `_scaler.scale(fontSize)` করে, অথচ `Text` নিজেও scale করে; widget-এ `textScaler` override মেলেনি (`Inferred`, একটি widget test দিয়ে আগে নিশ্চিত করুন)। ফলে ৩.১ clamp-ও এড়ানো যায়। *সমাধান:* CfType-এ pre-scale বাদ; `CfApp`-এ `MediaQuery.withClampedTextScaling`।
- **U-04 (P2) Dark-mode FOUC (Next.js):** theme `useLayoutEffect`-এ বসে; SSR-এ প্রথম paint light। `<head>`-এ blocking inline script বা token CSS-এ `prefers-color-scheme` default (token CSS অনুপস্থিত, তাই `Unverified`)।
- **U-05 (P2) Flutter haptics:** success/warning/error impact-এর ক্রম দিয়ে নকল; iOS-এ `UINotificationFeedbackGenerator` platform channel (Android-এর মতো)। `Platform-dependent`। Web iOS haptic কৌশল অ-নথিভুক্ত, `setTimeout` pulse user-activation-এর বাইরে পড়তে পারে — ডিভাইসে পরীক্ষা (`Unverified`)।
- **U-06 (P2) Tauri menu:** "Show Sidebar" লেবেল স্থির (Hide হয় না), Window menu ন্যূনতম, `CmdOrCtrl+?`। `apple_menu.rs`।
- **U-07 (P2) Config→Rust সেতু নেই (A11):** build-time codegen বা runtime command দিয়ে `.apple-design.json` পড়ুন।

## ১০. Platform-specific Gaps

| Platform | সরাসরি ব্যবহারযোগ্য | Adapt | বর্জন |
| --- | --- | --- | --- |
| iOS/iPadOS (native) | সব; system component | — | custom blur, নিজের tab bar |
| macOS (native) | সব | — | iOS-স্টাইল tab bar |
| Web (Safari) | token, glass CSS | squircle (path), Reduce Transparency (in-app) | `corner-shape` ভরসা, lens |
| Web (Chrome) | `corner-shape`, lens | curve ভিন্ন, সামঞ্জস্য রাখুন | — |
| Flutter iOS | Cupertino route, haptic | text scaling, press | — |
| Flutter Android | glass visual, spring | Back gesture, system insets | Cupertino nav chrome (Material সংঘাত এড়াতে) |
| Tauri macOS | `apply_liquid_glass` (macOS 26+), vibrancy fallback | window radius, traffic lights | **Mac App Store বিতরণ** (private API) |
| Tauri Windows/Linux | custom Mac-style chrome, Mica | Ctrl shortcut | native Apple glass দাবি |

**কভারেজ gap (প্রকৃত):** (ক) SwiftUI/AppKit native — Apple হার্ডওয়্যারে ১০০% parity এখানেই সম্ভব; adapter নেই। (খ) Electron, Vue/Svelte (Radix React-only), Rust-native GUI (egui/iced/Slint) — কোনো adapter নেই। (গ) Android Compose নেই। §১৬-এ খরচ-লাভ বিশ্লেষণ।

**Tauri-নির্দিষ্ট:** P1 — `/apple-init`-এ `distribution: mac-app-store | direct` প্রশ্ন ও SKILL-এ সতর্কতা (`Official`); P2 — `apply_liquid_glass`-এর radius 12 hard-coded (`Estimated`), `None` দিন বা config থেকে নিন; P3 — `window-vibrancy` 0.8 API পরিবর্তন ট্র্যাক; `trafficLightPosition`-এর অর্থ ডিভাইসে মেপে নিন (`Unverified`)।

## ১১. Component Library Gaps

SKILL-এ তালিকাভুক্ত Flutter widget: Button, NavBar, TabBar, List, Toggle, Segmented, Sheet, Alert। আপনার তালিকার বিপরীতে অনুপস্থিত/দুর্বল (SKILL-এর তালিকা অনুযায়ী `Inferred`; component grep-ফলাফল আমি এই report-এ পুনরায় উদ্ধৃত করছি না):

| Component | Web | Flutter | মন্তব্য |
| --- | --- | --- | --- |
| Slider/Stepper | আছে | নেই | P2 |
| Text/Search field | আছে | নেই | P1 (ফর্ম ছাড়া অ্যাপ হয় না) |
| Menu/ContextMenu/Popover | আছে | নেই | P2 |
| Progress/Activity/EmptyState | আছে | নেই | P2 |
| Picker/DatePicker, SwipeActions | spec আছে, কোড নেই | নেই | P3 |
| macOS Sidebar/Toolbar/Table | আছে (`mac.tsx`) | নেই | P3 (Flutter-desktop চাহিদা না থাকলে নয়) |

নিয়ম: প্রতি component-এ Visual/Interaction/States/Motion/A11y/Responsive/Platform variant/Token/QA — এই ১০ক্ষেত্র spec-এ ইতিমধ্যে অংশত আছে; **QA ও A11y ক্ষেত্র** অনেক component-এ অনুপস্থিত, সেটিই মূল ঘাটতি। প্রতিটি `components-ios/*.md`-এর শেষে "Verify" ও "A11y" লাইন বাধ্যতামূলক করুন।

## ১২. Accessibility Gaps

| ID | Gap | Priority | Evidence |
| --- | --- | --- | --- |
| AX-1 | JS Reduced Motion অনুপস্থিত (M-01) | P1 | `Measured` |
| AX-2 | Safari-তে Reduce Transparency ধরা যায় না (LG-1) | P1 | `Official` |
| AX-3 | Flutter Dynamic Type দুবার scale ও clamp এড়ানো (U-03) | P1 | `Inferred` |
| AX-4 | TabBar/Segmented-এ arrow-key navigation নেই (U-01) | P1 | `Measured` |
| AX-5 | `prefers-contrast`/`data-contrast` web asset-এ কোথাও নেই; doc বলে generated CSS সামলায়, কিন্তু সেই CSS অনুপস্থিত | P2 | `Measured` + `Unverified` |
| AX-6 | Contrast threshold HIG-এর (≤17pt 4.5:1; ≥18pt বা Bold 3:1) সঙ্গে মেলাতে হবে; plugin বলে "title3 ও উপরে" | P3 | `Official` |
| AX-7 | VoiceOver/TalkBack: custom glass control-এর semantic label/role-এর কোনো স্বয়ংক্রিয় যাচাই নেই | P2 | `Inferred` |
| AX-8 | Focus ring spec আছে, কিন্তু glass-এর ওপর focus-visible দৃশ্যমানতা মাপার নিয়ম নেই | P2 | `Inferred` |

**ভালো দিক:** hit target 44/28 (min 28/20) HIG-সম্মত; Reduced Motion-এর CSS-পাশ (press scale) আছে।

## ১৩. Performance Gaps

- **PF-1 (P1)** Sheet `height` animate (M-02)। layout thrash, low-end device-এ jank। transform-only করুন।
- **PF-2 (P2)** Tab bar `layout` + `backdrop-filter` একসঙ্গে (M-03)। `Inferred`; DevTools Performance panel-এ মাপুন।
- **PF-3 (P2)** `.cf-glass`-এ স্থায়ী `transform: translateZ(0)` — প্রতিটি glass আলাদা compositing layer; fixed-descendant-এর containing block বদলায়। কেবল hero/animated glass-এ রাখুন। `Inferred`।
- **PF-4 (P3)** `resize` listener-এ প্রতিবার state set (`root.tsx`)। debounce/`matchMedia` change event।
- **PF-5 (P3)** Flutter `BackdropFilter` সংখ্যার গার্ডরেল ও `RepaintBoundary` নির্দেশনা — সংখ্যা `Estimated`, আগে profile করুন।
- **PF-6 (P3)** Flutter `SystemChrome.setEnabledSystemUIMode` `build()`-এর ভেতরে (প্রতি rebuild-এ side effect)। `initState`/একবারে সরান।
- **সীমাবদ্ধতা:** কোনো performance সংখ্যা এই audit-এ **মাপা হয়নি**।

## ১৪. Visual QA Upgrade Suggestions

**বর্তমান:** ১৫-layer scorecard, `scripts/capture.py` (অনুপস্থিত), reviewer agent (অনুপস্থিত)। **মূল ঝুঁকি:** reference ছাড়া "fidelity" স্কোর দেওয়ার সুযোগ।

**প্রস্তাবিত স্তরায়ণ (প্রতিটি স্তরের ফল আলাদা রিপোর্ট হবে):**

1. **Deterministic computed-style audit (সবচেয়ে নির্ভরযোগ্য, reference লাগে না):** Playwright দিয়ে DOM ঘুরে `getComputedStyle` থেকে font-size বনাম type scale, radius বনাম token, letter-spacing, spacing 4pt-grid, hit-target ≥ 44/28, contrast (WCAG formula), glass element-এর সংখ্যা। যে নিয়মের সংখ্যাগত token আছে সেগুলো এখানেই ধরা পড়ে।
2. **Capture matrix:** light/dark × normal/high-contrast/reduced-transparency(app setting) × ৩ viewport (390/768/1180) × Chromium/WebKit/Firefox। animation বন্ধ, মুছে ফেলার জন্য mask, ফন্ট লোড অপেক্ষা (Playwright `toHaveScreenshot` অপশন: `animations`, `mask`, `maxDiffPixels`, `threshold` — `Official`: playwright.dev/docs/test-snapshots, playwright.dev/docs/api/class-pageassertions)।
3. **Reference diff (কেবল reference থাকলে):** pixelmatch (YIQ + anti-aliasing শনাক্তকরণ) প্রথম ফিল্টার; **দ্বিতীয় মত** হিসেবে SSIM বা CIEDE2000-ভিত্তিক perceptual ডিফ। শুধু দুটোই ব্যর্থ হলে "regression"; একটি হলে "সন্দেহ → AI review"। এটি একই UI-এর ভিন্ন OS/GPU/ফন্ট-rasterizer-এ false positive কমায় (সীমাবদ্ধতা-আলোচনা: practitioner সূত্র — dev.to/dennis-ddev/screenshot-diffing-pixel-level-comparison-techniques-18k, camoa.github.io/dev-guides/testing/visual-regression/pixelmatch/pixelmatch-limitations/; `Inferred`)। **একই engine+OS-এ baseline রাখুন**; cross-engine তুলনা pixel দিয়ে নয়, structure দিয়ে।
4. **AI screenshot review:** নির্দিষ্ট rubric + step-1-এর DOM facts একসঙ্গে দিন; AI-কে শুধু সেই বিষয়ে প্রশ্ন করুন যা সংখ্যায় বলা যায় না (hierarchy, ভারসাম্য, glass-এর ব্যবহার যথেষ্ট সংযত কিনা)।
5. **Reference না থাকলে:** রিপোর্টে লিখুন `Fidelity: N/A (no reference)`; কেবল Rule-conformance স্কোর দিন।

**Scorecard সংস্কার (P1, ছোট পরিবর্তন):** স্কোর দুই ভাগ — *Rule-conformance* (স্বয়ংক্রিয়, ১৫ layer) ও *Fidelity* (শুধু reference থাকলে)। যে check চালানো যায়নি তা "NOT RUN" — কখনও "OK" নয়।

**Platform ভেদে:** Web → Playwright; Flutter → golden test (`matchesGoldenFile`) ও integration\_test screenshot (লিংক এই সেশনে আনা হয়নি, `Unverified` সূত্র); Tauri → webview-তে Playwright Chromium/WebKit proxy + হাতে নেওয়া native window screenshot (macOS WKWebView-এ `tauri-driver` সমর্থন `Unverified`, যাচাই করুন)।

**Animation:** frame-sampling (CDP screencast বা `requestAnimationFrame`-এ `getBoundingClientRect` লগ) দিয়ে spring-এর overshoot/settle সময় মাপুন; pixel-diff নয়।

## ১৫. UX QA Upgrade Suggestions

Screenshot-এ যা ধরা পড়ে না, সেগুলোর জন্য:

| বিষয় | স্বয়ংক্রিয় পদ্ধতি |
| --- | --- |
| Keyboard/Focus order | Playwright `keyboard.press('Tab')` পথচলা, প্রতিটি ধাপে `document.activeElement` ও focus-ring দৃশ্যমান কিনা |
| Accessibility tree | Playwright ARIA snapshot; axe-core (সূত্র এই সেশনে আনা হয়নি) |
| Touch/hit target | DOM bounding box ≥ 44 (iOS-style) / 28 (macOS-style) |
| Reduced Motion / dark / contrast | `page.emulateMedia(...)` (অপশন তালিকা আবার যাচাই করুন) |
| Modal আচরণ | focus trap, Esc, scroll lock, return-focus স্ক্রিপ্ট |
| Interruptibility | animation চলাকালীন দ্বিতীয় input পাঠিয়ে transform ধারাবাহিক কিনা (frame-sampling) |
| Loading/Error/Empty/Disabled | `patterns/states.md`-এর checklist অনুযায়ী প্রতিটি screen-এ stub করা অবস্থা (agent-সহায়ক, পুরো স্বয়ংক্রিয় নয়) |
| Native iOS (SwiftUI প্রকল্প) | XCUITest `performAccessibilityAudit()` — এই plugin-এর পরিধির বাইরে, শুধু নির্দেশনা |

যা agent-assisted থাকবে: gesture-এর "অনুভূতি", haptic মানানসই কিনা, copy/tone (`12-ux-writing.md`)। এগুলো **কখনও "Tested" লেবেল পাবে না** — "Reviewed (manual/agent)"।

## ১৬. Agent ও Skill Architecture — খরচ-লাভ বিশ্লেষণ

আপনার তালিকার প্রতিটি প্রস্তাব যাচাই করলাম:

| প্রস্তাব | সিদ্ধান্ত | কারণ |
| --- | --- | --- |
| নতুন Skills: Design Research, Platform Design, Component Eng., Motion Eng. | **না** | বিদ্যমান `foundations/*` ও adapter SKILL একই বিষয় ঢেকে রাখে; নতুন skill মানে duplicate ও বাড়তি রক্ষণাবেক্ষণ |
| Visual QA, UX QA, A11y/Perf Audit skill | **না — `apple-design-audit`-এর ভেতরে `references/visual-qa.md`, `ux-qa.md`** | এখানে শুধু ফাইল যোগ, নতুন trigger নয় |
| Agents: Researcher | **আছে** (`apple-spec-researcher`, অনুপস্থিত — পুনরুদ্ধার) | `apple-sync`-এর জন্য |
| Agents: Visual/UX/A11y/Cross-platform Reviewer | **একটি `apple-design-reviewer`, দুটি mode: visual / behavior** | চারটি agent-এর প্রম্পট ৮০% একই হবে |
| Agents: UI Architecture Analyst, Motion Specialist | **না** | `/apple-init` detection ও motion doc যথেষ্ট |
| SwiftUI/AppKit adapter | **হ্যাঁ, P2, গাইডেন্স-ভিত্তিক (কম খরচ)** | Apple হার্ডওয়্যারে একমাত্র জায়গা যেখানে ১০০% parity সম্ভব; অধিকাংশ কাজ "system component ব্যবহার করুন, `glassEffect` দিন, custom blur নয়" |
| Electron adapter | **P3, শুধু doc** (`apple-web` + window chrome নোট) | বাস্তব চাহিদা না থাকলে কোডহীন |
| Vue/Svelte, Rust-native GUI, Compose adapter | **এখন না (স্পষ্ট non-goal)** | Radix React-only; প্রতিটি adapter পূর্ণ আলাদা প্রকল্প। বিকল্প: token + `cupertino.base.css` React ছাড়া ব্যবহারযোগ্য রাখা (P3) |

## ১৭. Commands ও Hooks Upgrade

**Commands**

- **`/apple-doctor` (P0, নতুন, ছোট):** SKILL-গুলোর সব `${CLAUDE_PLUGIN_ROOT}/…` পথ (tokens, scripts, hooks, templates, agents, sounds) আছে কিনা পরীক্ষা করে; অনুপস্থিত হলে শব্দ করে ব্যর্থ। **কেন:** এখন এনফোর্সমেন্ট নীরবে অনুপস্থিত থাকলে রিপোর্ট ভুল আত্মবিশ্বাস দেয়।
- `/apple-audit`: পাতলা wrapper করুন (পদ্ধতি শুধু `apple-design-audit`-এ); `--reference <dir>` ফ্ল্যাগ যোগ। নতুন `/apple-compare` **না**।
- `/apple-init`: `distribution` (mac-app-store | direct) প্রশ্ন; `reducedTransparency` সিদ্ধান্ত।
- `/apple-sync`: `$source`-ট্যাগ ও `ESTIMATES.md` পুনর্জেনারেট।
- নতুন Command যা **চাইনি**: Platform Adaptation, UX Audit, Visual Comparison আলাদা — সবই `/apple-audit` ফ্ল্যাগ।

**Hooks** (বর্তমান `lint.mjs` অনুপস্থিত — আগে পুনরুদ্ধার)

- নিয়মগুলো লিন্টে থাকুক: raw hex, px radius literal, `ease`/`linear` timing, off-scale font-size, `blur()` সরাসরি, `outline:none`।
- নতুন lint নিয়ম (P2): `bg-white` + `cf-glass` একসঙ্গে; `useReducedMotion`-হীন `motion.*` spring; Flutter-এ `MediaQuery.navigationMode` ব্যবহার; Flutter-এ `textScaler.scale(` ম্যানুয়াল।
- নতুন hook ধরন যোগ করার দরকার নেই।

## ১৮. Scripts ও Automation

| Script | অবস্থা | কাজ |
| --- | --- | --- |
| `verify-plugin.mjs` | নতুন (P0) | `/apple-doctor`-এর ইঞ্জিন |
| `build-tokens.mjs` | অনুপস্থিত | পুনরুদ্ধার + `ESTIMATES.md` ও `intensityCurve` |
| `contrast-check.mjs` | অনুপস্থিত | HIG থ্রেশহোল্ড (≤17pt 4.5, ≥18pt/Bold 3) |
| `capture.py` | অনুপস্থিত | matrix capture (§১৪.২) |
| `qa/computed-style-audit.mjs` | নতুন (P1) | §১৪.১ |
| `qa/diff.mjs` | নতুন (P2) | pixelmatch + SSIM/ΔE ডুয়াল-চেক |
| `qa/ux-keyboard.mjs` | নতুন (P2) | §১৫ |

নির্ভরতা: Playwright (+ pixelmatch, একটি SSIM লাইব্রেরি) — কেবল QA-র জন্য devDependency; adapter asset-এ কিছু নয়।

## ১৯. Token System Upgrade

1. প্রতিটি token-এ `$source: official | measured | estimated` ও `$kit: ios27 | macos27`; `ESTIMATES.md` স্বয়ংক্রিয়। (V-06)
2. `materials.json`-এ `intensityCurve` ও `reducedTransparency` অবস্থার মান — web ও Flutter একই উৎস (A12/LG-3)।
3. `typography.json`-এ tracking কেবল kit-যাচাইয়ের পর `official` (V-02)।
4. `radius.device-display` একমাত্র উৎস; সব হার্ডকোডেড `38`, `12` বাদ (A9)।
5. Component-স্তরের হার্ডকোডেড মান (toggle 64×28 / 38×24, `text-[Npx]`) token-এ আনুন (৩৪টি `[Npx]` উদাহরণ)।
6. Motion token-এ `reducedMotion` বিকল্প প্রতিটির সঙ্গে (আংশিক আছে)।
7. DTCG ফরম্যাট রপ্তানি `apple-sync`-এ (বিদ্যমান পরিকল্পনা মিলিয়ে) — কেবল অন্য টুল ব্যবহারকারী থাকলে।

## ২০. File-by-file Change Proposal

| ফাইল | পরিবর্তন | Gap |
| --- | --- | --- |
| `apple-design-core/SKILL.md` | Compliance Report-এ "NOT RUN" অবস্থা; contrast শব্দ HIG-মতো; path প্রিফ্লাইট লাইন | A1, AX-6 |
| `foundations/04-liquid-glass.md` | glass-vs-solid সিদ্ধান্ত-গাছ; Safari fallback; scroll-edge `Estimated` চিহ্ন | LG-2, V-05 |
| `foundations/05-shape.md` | native বনাম fallback curve নীতি | V-01 |
| `foundations/08-motion.md` | interaction→spring→interruptible→reduced টেবিল | M-05 |
| `foundations/11-accessibility.md` | web Reduce Transparency platform matrix; APG keyboard | LG-1, U-01 |
| `foundations/02-typography.md`, `tokens/typography.json` | tracking যাচাই + `$source` | V-02 |
| `apple-web/assets/.../root.tsx` | contrast/transparency attr; pre-hydration script; MotionConfig; in-app transparency setting | A3, M-01, U-04, LG-1 |
| `.../glass.tsx`, `squircle.tsx`, `lib/squircle.ts`, `cupertino.base.css` | path-mask squircle; `translateZ` শর্তাধীন | V-01, PF-3 |
| `.../tab-bar.tsx`, `controls.tsx` | arrow-key; inner capsule; glass knob (`bg-white` সরান); knob drag | U-01, A5, V-03, A7 |
| `.../sheet.tsx` | transform-only; scroll handoff; medium detent scrim নীতি; `38px` literal বাদ | M-02, A6, A9 |
| `apple-flutter/.../cf_motion.dart` | `PointerDeviceKind` দিয়ে press | U-02 |
| `.../cf_theme.dart`, `cf_app.dart` | text pre-scale বাদ; clamp; `SystemChrome` সরান | U-03, PF-6 |
| `.../cf_haptics.dart` + iOS channel | `UINotificationFeedbackGenerator` | U-05 |
| `.../cf_page_route.dart` + SKILL | "Approximation" লেবেল | M-04, A4 |
| `apple-tauri/SKILL.md`, `assets/.../apple_window.rs`, `lib-snippet.rs`, `apple_menu.rs`, config snippet | MAS সতর্কতা; radius config; config→Rust; মেনু লেবেল; vibrancy 0.8 নোট | §১০ Tauri, U-06, U-07 |
| `apple-design-audit/SKILL.md`, `references/scorecard.md`, নতুন `visual-qa.md`, `ux-qa.md` | দ্বিভাগ স্কোর; QA পদ্ধতি | §১৪–১৫ |
| `apple-audit/SKILL.md` (command) | পাতলা wrapper + `--reference` | A10 |
| নতুন `commands/apple-doctor.md`, `scripts/verify-plugin.mjs` | P0 | A1 |

## ২১. Priority-wise Implementation Roadmap

**Phase 1 — Critical Foundation**

- কাজ: Plugin runtime পুনরুদ্ধার/যাচাই (upstream repo খুলে); `/apple-doctor`; "NOT RUN" রিপোর্ট; Flutter U-02/U-03; web LG-1, M-01; Tauri MAS সতর্কতা; token `$source`/`ESTIMATES.md`; tracking যাচাই।
- নির্ভরতা: upstream repo অ্যাক্সেস। জটিলতা: মাঝারি। ফল: রিপোর্ট আর মিথ্যা আত্মবিশ্বাস দেয় না; Flutter touch/Dynamic Type সঠিক। যাচাই: widget test (text scale, pointer kind), `/apple-doctor` পরিষ্কার ইনস্টলে সবুজ।

**Phase 2 — Advanced Design Engineering**

- কাজ: squircle path-mask (V-01), sheet/tab bar/toggle সংশোধন, glass-vs-solid নিয়ম, motion টেবিল, intensityCurve, Flutter Text/Menu/Search/Progress, SwiftUI গাইডেন্স।
- জটিলতা: মাঝারি–উচ্চ। যাচাই: WebKit+Chromium screenshot তুলনা, DevTools profile।

**Phase 3 — Automated Intelligence**

- কাজ: computed-style audit, capture matrix, ডুয়াল-চেক diff, keyboard/focus script, reviewer-এর দুই mode, `/apple-audit --reference`।
- নির্ভরতা: Phase 1 scripts। জটিলতা: উচ্চ। যাচাই: জানা ভুলসহ নমুনা অ্যাপে প্রতিটি ভুল ধরা পড়ে কিনা (seeded-defect test)।

**Phase 4 — Optimization ও Final Polish**

- কাজ: PF-3…PF-6; AX-5…AX-8; contrast থ্রেশহোল্ড মিলানো; doc-vs-code সব অসঙ্গতি বন্ধ; lint নতুন নিয়ম; scroll-edge/lens উন্নয়ন (P3); Electron doc; সংস্করণ-টানা (vibrancy 0.8)।
- যাচাই: পূর্ণ regression + accessibility সুইট।

## ২২. Final Definition of Done

- `/apple-doctor` পরিষ্কার ইনস্টলে সবুজ; কোনো SKILL-পথ অনুপস্থিত নয়।
- প্রতিটি `estimate` token `ESTIMATES.md`-তে; রিপোর্ট কোনো estimate-কে "Official" বলে না।
- ডক-বনাম-কোড অসঙ্গতি (A3–A8) শূন্য বা "known limitation" হিসেবে লেখা।
- seeded-defect নমুনায় QA নির্ধারিত সব ভুল ধরে; reference ছাড়া Fidelity সবসময় N/A।
- Reduced Motion, Reduced Transparency (system বা in-app), Dynamic Type, keyboard — প্রতিটির জন্য স্বয়ংক্রিয় test।
- কোনো platform-এ "native parity" দাবি নেই; প্রতিটি adapter-এ Native/Approximation/Not-possible তালিকা।

### যা এখনও অজানা (Unverified)

1. Upstream repo-র আসল বিষয়বস্তু (tokens, hooks, scripts, agents)।
2. Token মান (JSON অনুপস্থিত); Apple kit-ভিত্তিক সব মান।
3. Tracking মানের সঠিক উৎস।
4. iOS 27 slider-এর দিক; Apple-এর প্রাথমিক iOS 27 পাতা।
5. `trafficLightPosition`-এর অর্থ; `tauri-driver` macOS সমর্থন।
6. Motion লাইব্রেরির `reducedMotion` API; ARIA APG ও axe-core সূত্র (এই সেশনে আনা হয়নি)।
7. কোনো কিছু render/চালানো হয়নি — V-03, M-03, U-03, PF-2, PF-3 সবই `Inferred`।

# Phase 2b রিপোর্ট — Tauri Adapter (`2b-1`) ও Flutter Adapter (`2b-2`)

**শাখা (Branch):** `upgrade/apple-dna-v2`  
**Tauri কমিট:** `e5e5116` (`Phase 2b-1: upgrade Tauri adapter to window-vibrancy 0.8, add MAS distribution config, Rust config bridge, full menu, and cargo check`)

---

## ১. Phase 2b-1: Tauri Adapter পরিবর্তনসমূহ

| # | ক্ষেত্র | পরিবর্তিত / নতুন ফাইল | বিবরণ |
|---|---|---|---|
| ১ | MAS বনাম Direct ডিস্ট্রিবিউশন | `templates/apple-design.json`, `commands/apple-init.md`, `skills/apple-tauri/assets/tauri.conf.snippet.json`, `tauri.conf.mas.snippet.json` (নতুন) | `macOSPrivateApi: true` না মুছে `distribution: "direct" | "mac-app-store"` প্রশ্ন `/apple-init`-এ যুক্ত হয়েছে। `direct` হলে `macOSPrivateApi: true` + `transparent: true`; `mac-app-store` হলে আলাদা `tauri.conf.mas.snippet.json` (`macOSPrivateApi: false`, `transparent: false`, `apply_vibrancy` ফলব্যাক) এবং MAS rejection সতর্কতা (`https://tauri.app/distribute/app-store/` `[official]`) যুক্ত হয়েছে। |
| ২ | `.apple-design.json` → Rust সেতু | `skills/apple-tauri/assets/src-tauri/src/apple_config.rs` (নতুন), `lib-snippet.rs` | `AppleDesignConfig` (`windowsChrome`, `distribution`, `glassIntensity`, `windowRadius`, `appName`) ও `get_apple_design_config` Tauri কমান্ড যোগ হয়েছে। হার্ডকোডেড `WindowsChrome::Mac` ও `"MyApp"` সরিয়ে কনফিগ এবং `app.package_info().name` থেকে মান নেওয়া হয়েছে। |
| ৩ | `window-vibrancy 0.8` API ও টোকেন রেডিয়াস | `skills/apple-tauri/assets/Cargo-snippet.toml`, `src-tauri/src/apple_window.rs` | crates.io থেকে প্রাপ্ত `window-vibrancy 0.8.1` (`src/macos/liquid_glass.rs`) যাচাই করে `LiquidGlassOptions::new(NSGlassEffectViewStyle::Regular).radius(radius)` ব্যবহার করা হয়েছে; হার্ডকোডেড `12.0` সরিয়ে `apple_tokens::WINDOW_CORNER_RADIUS` (`[estimate]`) থেকে রেডিয়াস নেওয়া হয়েছে। |
| ৪ | পূর্ণ macOS মেনু ও সাইডবার স্টেট | `skills/apple-tauri/assets/src-tauri/src/apple_menu.rs`, `lib-snippet.rs` | `AppleMenuHandles` দিয়ে `Hide Sidebar` ↔ `Show Sidebar` এবং `Hide Inspector` ↔ `Show Inspector` ডায়নামিক টগল, File মেনুতে `Duplicate`, পূর্ণ Window মেনু (`Minimize`, `Zoom`, `Bring All to Front`, `Close Window`) এবং সব শর্টকাটে `CmdOrCtrl` যুক্ত হয়েছে। |
| ৫ | Parity Matrix ও ডক | `skills/apple-tauri/SKILL.md` | Research নং ১৪ থেকে macOS Direct vs macOS MAS vs Windows 11 vs Linux **Native / Approximation / Not possible** প্যারিটি টেবিল ও MAS নির্দেশনা যোগ হয়েছে। |

---

## ২. Phase 2b-2: Flutter Adapter পরিবর্তনসমূহ (Path খ — Flutter `3.41.7` ইনস্টলড থাকায় পূর্ণ পথ)

| # | ক্ষেত্র | পরিবর্তিত / নতুন ফাইল | বিবরণ |
|---|---|---|---|
| ১ | `CfPressable` পয়েন্টার ও `CfPageRoute` সততা | `lib/apple_ui/motion/cf_motion.dart` | `MediaQuery.navigationMode` সরিয়ে `TapDownDetails.kind` (`PointerDeviceKind.mouse/trackpad/stylus` বনাম `touch`) ব্যবহার করা হয়েছে; `CfPageRoute`-কে স্পষ্ট **Approximation** লেবেল দেওয়া হয়েছে। |
| ২ | ডাবল Dynamic Type ফিক্স ও `SystemChrome` | `lib/apple_ui/theme/cf_theme.dart`, `lib/apple_ui/cf_app.dart` | `CfType._s` থেকে ম্যানুয়াল `_scaler.scale(...)` সরিয়ে একবারের স্কেলিং নিশ্চিত করা হয়েছে + `bn/ar/he` নন-ল্যাটিন ট্র্যাকিং সুরক্ষা; `CfApp` কে `StatefulWidget` করে `SystemChrome.setEnabledSystemUIMode(edgeToEdge)` `initState()`-এ আনা হয়েছে; `CupertinoApp.builder`-এ `MediaQuery.withClampedTextScaling(maxScaleFactor: mac ? 1.0 : 3.1)` ও `reduceTransparency` যোগ হয়েছে। |
| ৩ | স্ক্রল-ইভেন্টে শূন্য scaffold rebuild | `lib/apple_ui/widgets/cf_nav_bar.dart` | `CfLargeTitleScaffold`-এর `setState` সরিয়ে `ValueNotifier<double>` + দুইটি শিরোনামের `Opacity`-তে `ValueListenableBuilder` ব্যবহার করা হয়েছে। |
| ৪ | `CfGlass` আউটার শ্যাডো ও `BackdropGroup` | `lib/apple_ui/glass/cf_glass.dart` | আউটার `BoxShadow` ডেকোরেশন `ClipPath`-এর বাইরে সরানো হয়েছে যাতে শ্যাডো না কাটে; `grouped: true` দিয়ে Flutter `3.29+` `BackdropFilter.grouped` সাপোর্ট ও `reduceTransparency` ওপেক ফলব্যাক যুক্ত হয়েছে। |
| ৫ | iOS নেটিভ Haptics চ্যানেল | `lib/apple_ui/feedback/cf_haptics.dart`, `assets/ios/AppleHapticsPlugin.swift` (নতুন) | Android `AppleHapticsPlugin.kt`-এর মতো iOS-এ `MethodChannel('cupertino_forge/haptics')` ও Swift `UINotificationFeedbackGenerator` (`.success/.warning/.error`) + `UIImpactFeedbackGenerator(.rigid/.soft)` যোগ হয়েছে (চ্যানেল না থাকলে নিরাপদ ফলব্যাক)। |
| ৬ | ৪টি নতুন উইজেট (`08-components-ios.md` মাপ) | `cf_fields.dart`, `cf_menu.dart`, `cf_progress.dart`, `cf_slider.dart` (নতুন) | `CfTextField` / `CfSearchField`, `CfMenuItem` + `showCfMenu` + `showCfPopover`, `CfActivityIndicator` (300ms delay) + `CfProgressBar` (`AppleSprings.smooth`), ও `CfSlider` (ড্র্যাগে `CfGlass` নব + `1.15x` স্কেল)। |
| ৭ | Dart টোকেন জেনারেটর ফিক্স | `scripts/build-tokens.mjs`, `apple_tokens.dart` | `flutter analyze`-এ ধরা পড়া `AppleSprings.default` (Dart reserved keyword → `standard`), ডুপ্লিকেট `sheetFloating`, ও অপ্রয়োজনীয় `physics.dart` ইম্পোর্ট ঠিক করা হয়েছে। |
| ৮ | Lint নিয়ম ও Parity/Impeller ডক | `hooks/scripts/lint.mjs`, `tests/lint-regression.test.mjs`, `skills/apple-flutter/SKILL.md`, `references/widgets-flutter.md` | `manual-text-scale` (`error`, `textScaler.scale(` ও `textScalerOf(...).scale(`) ও `navigation-mode` (`warn`) নিয়ম যোগ; `BackdropGroup` (Research ১৫) গাইড ও Native/Approximation/Not possible প্যারিটি টেবিল যোগ। |

---

## ৩. চালানো পরীক্ষা (Tested) বনাম না-চালানো অংশ (`NOT RUN`)

### ৩.১ বাস্তবে চালানো ও উত্তীর্ণ (`Tested — PASS`)

| ক্ষেত্র | কমান্ড | ফলাফল |
|---|---|---|
| **Tauri Rust (Windows host)** | `_upgrade/scratch/tauri-check/src-tauri`-এ `cargo check` ও `cargo test --lib` | **PASS** — `0 errors, 0 warnings`; `apple_config::tests` **2 passed; 0 failed** (`mac-app-store`, `native`, token fallback)। |
| **Flutter Static Analysis** | `_upgrade/scratch/flutter-check`-এ `flutter analyze` (`Flutter 3.41.7`, `Dart 3.11.5`) | **PASS** — `No issues found! (ran in 1.7s)`। |
| **Flutter Widget Tests** | `_upgrade/scratch/flutter-check`-এ `flutter test` (`test/apple_ui_test.dart`) | **PASS — 7 / 7** (`CfPressable` touch vs mouse scale, `CfType` single-scale + `3.1x` clamp, `SystemChrome` once in `initState`, `CfLargeTitleScaffold` zero sliver rebuild on scroll, `CfGlass` shadow outside `ClipPath` + `grouped` + `reduceTransparency`, `CfHaptics` iOS MethodChannel, ও সব নতুন উইজেট)। |
| **Plugin Test Suite** | `node --test tests/*.test.mjs` | **PASS — 12 / 12** (নতুন Dart lint নিয়ম ও আগে থেকে থাকা ১১টি স্যুইট সহ)। |
| **Doctor ও Contrast** | `node scripts/verify-plugin.mjs` ও `node scripts/contrast-check.mjs --accent "#0088FF"` | **PASS** — `8 PASS, 0 NOT RUN, 0 FAIL`; `0 blocking failures`। |

### ৩.২ না চালানো অংশ (`NOT RUN`)

- **macOS Rust cross-check (`cargo check --target aarch64-apple-darwin`):** **NOT RUN for macOS `#[cfg(target_os = "macos")]` codegen** (`objc2-exception-helper v0.1.1` build script failed on Windows host: `cc: error: unrecognized command-line option '-arch' / '-mmacosx-version-min=11.0'` — requires Apple macOS Xcode Clang toolchain)। তবে `apple_window.rs`-এর `LiquidGlassOptions` API সরাসরি crates.io `window-vibrancy 0.8.1` সোর্স থেকে যাচাই করা হয়েছে।
- **Tauri full GUI / WebView runtime (`npm run tauri dev` / bundle build):** **NOT RUN (`no macOS/Linux desktop display session test harness for Tauri GUI`)**।
- **iOS Swift ও Android Kotlin নেটিভ প্লাগিন কম্পাইল (`AppleHapticsPlugin.swift`, `AppleHapticsPlugin.kt`):** **NOT RUN (`no Xcode / Android Gradle native app build in workspace`)**।

---

## ৪. আসল ডিভাইসে যাচাই দরকার

1. **iOS Native Haptics (`AppleHapticsPlugin.swift`):** আসল iPhone (Taptic Engine)-এ `UINotificationFeedbackGenerator` (`.success`, `.warning`, `.error`), `UIImpactFeedbackGenerator(.rigid/.soft)`, ও `AVAudioSession` (`sounds: true` হলে অডিও+হ্যাপ্টিক সমন্বয়) হাতে চালিয়ে যাচাই করতে হবে।
2. **Tauri Window Chrome ও macOS 26/27 `NSGlassEffectView`:** আসল Mac-এ (`cargo tauri dev`) `distribution: "direct"` মোডে `apply_liquid_glass` (`WINDOW_CORNER_RADIUS: 12.0` `[estimate]` ও `trafficLightPosition` `{16, 26}`), active/inactive শ্যাডো, এবং `distribution: "mac-app-store"` মোডে `apply_vibrancy(Sidebar)` + MAS binary validation যাচাই করতে হবে।
3. **Flutter Impeller Glass Shadow ও GPU Frame Timing:** আসল iOS/Android ডিভাইসে Impeller-এ `CfGlass`-এর `ClipPath`-বহির্ভূত শ্যাডো-রেন্ডারিং ও একাধিক পিলওয়ালা বারে `BackdropGroup` + `CfGlass(grouped: true)`-এর ৬০/১২০fps পারফরম্যান্স প্রোফাইলিং করতে হবে।

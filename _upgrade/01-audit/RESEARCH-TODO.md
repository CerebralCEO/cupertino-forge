# cupertino-forge — Deep Research Todo List (Prioritized)

তারিখ: ২৫ নভেম্বর ২০২৬ · ভিত্তি: `FIDELITY-SCORECARD.md`-এর ১২টি **≤ ২/৫** ফ্ল্যাগড ডোমেইন + `AUDIT-VERIFICATION.md`-এর `Unverified`/`Inferred` ও নতুন চিহ্নিত ফাঁকসমূহ।
প্রতিটি আইটেম পরবর্তী ধাপের Deep Research-এর সরাসরি ইনপুট হিসেবে ক্রমানুসারে (P0 → P3) সাজানো।

---

## P0 — Critical Spec Truth & Platform Blockers (আগেই সমাধান করতে হবে)

### R-01 · iOS 27 & macOS 27 Primary Design Spec যাচাই
- **Linked Domains:** Liquid Glass (2/5), Component Specs (2/5), Color (3/5)
- **অজানা / Research Questions:**
  1. iOS 27 / macOS 27 Liquid Glass intensity slider-এর সঠিক দিক (`opaque ↔ clear` নাকি `clear ↔ tinted`) এবং alpha/blur/saturation curve কী?
  2. macOS 27 uniform window corner radius (১২pt না অন্য কিছু?), edge-to-edge sidebar-এর সঠিক width/padding/vibrancy, এবং colored sidebar icons-এর exact HIG/API নিয়ম কী?
  3. Clear vs Regular vs Tinted glass-এর contrast threshold, adaptive light/dark luminance switching, এবং `tokens/source/*.tokens.json`-এর raw shadow/fill/blendMode থেকে কোন মান `official` ও কোনটি `estimate` তা চিহ্নিত করার নিয়ম।
- **Primary Sources:** `developer.apple.com/design/human-interface-guidelines/` (`.md` endpoints), `developer.apple.com/design/resources/` (iOS 27 / macOS 27 UI Kits), WWDC 2025/2026 Liquid Glass & Design System transcripts।
- **Deliverable:** Verified token `$source` diff table (`official` vs `estimate` + `intensityCurve` math) ও `15-version-diff.md` যাচাই।

### R-02 · Typography Optical Sizing, Tracking Tables ও Non-Latin Script Engineering
- **Linked Domains:** Typography (2/5), Localization & RTL (1/5)
- **অজানা / Research Questions:**
  1. যেহেতু `tokens/source/*.tokens.json`-এ `letterSpacing: 0`, Apple HIG Typography / CoreText-এর আসল `sfProIOS`, `sfProMacOS`, `sfProRounded` tracking tables-এর প্রামাণিক উৎস কী? `tokens/typography.json`-এর সংখ্যাগুলো (যেমন body 17pt = `-0.026em`) বর্তমান HIG-এর সঙ্গে মেলে কি না?
  2. CSS-এ Inter variable font-এর `font-optical-sizing`, `font-variation-settings`, এবং `-0.01em` tracking compensation-কে কীভাবে `--cf-text-*-tracking`-এর সাথে **যোগ** করা যায় (overwrite না করে)?
  3. Non-Latin scripts (Bangla, Arabic, Devanagari, CJK)-এ negative letter-spacing (`-0.026em`) দিলে ligature/matra/diacritics ভাঙে — কোন script-এ tracking `0` করতে হবে, line-height কীভাবে `loose` করতে হবে, এবং `webBangla` token কীভাবে generate হবে?
- **Primary Sources:** Apple HIG Typography (`.md`), Apple Dynamic Type & Font Metrics docs, `rsms/inter` variable metrics, W3C CSS Fonts Level 4 & Indic/Arabic layout specs।
- **Deliverable:** Verified tracking table (`$source` সহ), CSS/Dart Inter compensation সূত্র, ও multi-script typography matrix।

### R-03 · Accessibility Parity, ARIA APG ও Contrast Spec
- **Linked Domains:** Accessibility (2/5), Color (3/5)
- **অজানা / Research Questions:**
  1. Apple HIG Accessibility Contrast বনাম WCAG 2.1/2.2: Exact pt/weight threshold (`≥18pt` regular বা `≥14pt` bold → 3:1; `≤17pt` → 4.5:1) এবং `0.04045` sRGB linearization; Apple-এর `#0088FF` light white-এ `3.52:1` হওয়ায় `contrast-check.mjs` কীভাবে button fill vs inline text vs glyph আলাদা করে যাচাই করবে?
  2. WebKit/Safari-তে `prefers-reduced-transparency` unsupported — `CupertinoRoot` in-app setting + `prefers-contrast: more` + `forced-colors` fallback matrix কী হবে, এবং `prefers-contrast: more` CSS specificity যেন `data-theme="dark"` না ভাঙে তার exact CSS architecture কী?
  3. W3C ARIA Authoring Practices Guide (APG) অনুযায়ী `TabBar` (`tablist` arrow keys), `SegmentedControl`, `RadioGroup`, `MacTable` (`grid` keyboard navigation), `Alert` (`Enter` key focus safety) এর সঠিক keyboard ও focus behavior কী?
  4. Flutter-এ `CfType` double-scaling রোধ করতে `MediaQuery.withClampedTextScaling` বনাম `textScaler` architecture, এবং iOS `UIAccessibility.isReduceTransparencyEnabled` channel প্রয়োজন কি না?
- **Primary Sources:** Apple HIG Accessibility (`.md`), W3C WCAG 2.2, W3C ARIA APG, MDN / CanIUse (`prefers-reduced-transparency`, `prefers-contrast`), Flutter `Text` / `MediaQuery` API docs।
- **Deliverable:** Accessibility specification matrix + `contrast-check.mjs` ও CSS cascade fix blueprint।

### R-04 · Tauri 2 macOS App Store, `window-vibrancy` ও Window Chrome Spec
- **Linked Domains:** Platform Adaptation (2/5), Component Specs (2/5)
- **অজানা / Research Questions:**
  1. Tauri 2-এ `macOSPrivateApi: true` / `transparent: true` দিলে Mac App Store (MAS) review-এ নিশ্চিত reject হয় কি না? Public API দিয়ে `NSGlassEffectView` / `NSVisualEffectView` ও overlay titlebar কীভাবে করা যায় (এবং `distribution: mac-app-store | direct` বিভাজন)?
  2. `window-vibrancy` v0.7.1 vs v0.8.x API breaking changes (`apply_liquid_glass`, `NSGlassEffectViewStyle`) এবং `trafficLightPosition` `{ x, y }` Tauri v2-তে top-left না center-aligned?
  3. macOS WKWebView-এ `tauri-driver` কাজ করে কি না, এবং না করলে Tauri macOS visual QA কীভাবে automate করা হবে?
- **Primary Sources:** Tauri v2 official docs (`tauri.app`), `window-vibrancy` crate docs/source (`docs.rs`), Apple App Store Review Guidelines 2.5.1 (non-public APIs)।
- **Deliverable:** Tauri distribution decision matrix, updated `window-vibrancy` API guide, ও `.apple-design.json` → Rust config bridge design।

---

## P1 — High-Impact Visual, Motion & QA Engineering

### R-05 · Liquid Glass & Squircle Cross-Engine Rendering Engineering
- **Linked Domains:** Liquid Glass (2/5), Shape (3/5)
- **অজানা / Research Questions:**
  1. Safari/Firefox-এ shadow-না-কেটে squircle রেন্ডার করার জন্য SVG `mask-image` + sibling shadow wrapper কীভাবে কাজ করবে (dynamic resize-এ performance সহ)? CSS `corner-shape: squircle` (`superellipse(2)`) বনাম `smoothing: 0.6` SVG path-এর visual delta কতটা?
  2. Multi-stop progressive blur (Apple ScrollEdgeEffect) Safari, Chromium ও Flutter `ImageFilter.blur` / shader-এ কীভাবে নির্ভরযোগ্যভাবে বানানো যায়?
  3. Flutter `CfGlass`-এ `ClipPath` যেন outer `BoxShadow` না কাটে (outer shadow wrapper বনাম inner `ClipPath(BackdropFilter)`) তার exact widget tree এবং glass-vs-solid decision tree।
- **Primary Sources:** CSS Masking / `corner-shape` specs, WebKit `backdrop-filter` quirks, Flutter `BackdropFilter` & `PhysicalShape`/`ClipPath` docs।
- **Deliverable:** Cross-engine squircle+shadow pattern, progressive scroll-edge spec, ও glass-vs-solid decision tree।

### R-06 · Motion Physics, `MotionConfig`, Sheet Scroll-Handoff & Transitions
- **Linked Domains:** Motion ও Physics (2/5)
- **অজানা / Research Questions:**
  1. `motion/react` (v12+) `<MotionConfig reducedMotion="user">` exact API ও layout animation (`layout` / `layoutId`) এর ওপর এর আচরণ।
  2. Transform-only (`translateY`) multi-detent `Sheet` (layout `height` animation ছাড়া) এবং scrollable content থেকে sheet drag-to-dismiss handoff (`scrollTop === 0`) করার নির্ভরযোগ্য pattern।
  3. Flutter-এ সত্যিকারের spring-driven `PageRoute` (`SpringSimulation` vs `CupertinoPageRoute` curve), `CfSegmented` spring physics, এবং Matched Geometry / CSS View Transitions API guideline।
- **Primary Sources:** Motion (`motion.dev`) docs, Apple WWDC23 *Animate with springs*, Flutter `PageRoute` / `CupertinoSheetRoute` / `SpringSimulation` docs।
- **Deliverable:** Complete Interaction→Spring→Interruptible→ReducedMotion matrix ও `Sheet`/`CfPageRoute` engineering spec।

### R-07 · Automated Visual & UX QA Methodology (Windows-safe + Reference-optional)
- **Linked Domains:** QA / Measurement (2/5), Accessibility (2/5)
- **অজানা / Research Questions:**
  1. Reference screenshot ছাড়া "Rule-conformance" বনাম reference থাকলে "Visual Fidelity" আলাদা করে স্কোর করার deterministic DOM `getComputedStyle` audit spec (font-size, tracking, radius, 4pt grid, hit-target ≥44/28, worst-case glass contrast, glass count)।
  2. Cross-OS/GPU font-rasterizer false positive কমাতে `pixelmatch` + SSIM / CIEDE2000 dual-check threshold design ও Chromium/WebKit/Firefox capture matrix।
  3. Keyboard/Focus/Modal/Reduced-Motion automated Playwright UX audit, Flutter `matchesGoldenFile` + `integration_test` screenshot pipeline, এবং Windows-safe Python/Node invocation (`python` vs `python3`, `lint.mjs` regex fixes)।
- **Primary Sources:** Playwright test-snapshots & ARIA snapshot docs, `axe-core`, SSIM/CIEDE2000 visual regression literature, Flutter golden/integration_test docs।
- **Deliverable:** Upgraded QA architecture spec (`visual-qa.md`, `ux-qa.md`, `computed-style-audit`, dual-diff spec)।

### R-08 · Component Spec Precision & Missing Flutter/Web Primitives
- **Linked Domains:** Component Spec-এ মাপ (2/5)
- **অজানা / Research Questions:**
  1. `layout.json` ও `shape.json`-এর `estimate` মানগুলো (toggle `64×28`, button heights, tab bar `62`, macOS window `12`, sheet `38`, alert `34`, list row `52`) Apple UI Kit Inspect panel বা official SwiftUI/UIKit defaults দিয়ে কতদূর যাচাই করা সম্ভব?
  2. `apple-flutter`-এ অনুপস্থিত মূল উপাদানগুলোর (`CfTextField`, `CfSearchField`, `CfSlider`, `CfStepper`, `CfMenu`/`CfContextMenu`, `CfPopover`, `CfProgressBar`/`CfHud`/`CfEmptyState`, `CfPicker`/`CfDatePicker`, `CfSwipeActions`) exact Cupertino + Apple 27 spec কী হবে?
  3. প্রতিটি `components-ios/*.md` ও `components-macos/*.md` ফাইলে missing `A11y` ও `Verify` সেকশন কীভাবে standardized হবে?
- **Primary Sources:** Apple Sketch/Figma UI Kits Inspect values, Apple HIG Components (`.md`), Flutter `cupertino` library source (`CupertinoTextField`, `CupertinoSlider`, `CupertinoContextMenu`, `CupertinoDatePicker`)।
- **Deliverable:** Verified metrics diff + prioritized Flutter/Web missing-component specs।

---

## P2 — UX Depth, Performance, Platform Adaptation & Localization

### R-09 · Deep UX Patterns (Onboarding, Permissions, Gestures, Search, Undo)
- **Linked Domains:** UX Patterns (2/5), Design Philosophy (3/5)
- **অজানা / Research Questions:**
  1. Apple HIG-সম্মত Onboarding (value proposition, privacy/permission priming, skip/not-now), contextual permission denial recovery, ও macOS window-based onboarding।
  2. Gesture choreography: iOS edge-swipe back (on web/Flutter), rubber-banding formula implementation, pull-to-refresh threshold + haptic, inline Mail-style undo banner, এবং search scopes + recent history patterns।
- **Primary Sources:** Apple HIG Onboarding, Accessing User Data / Privacy, Gestures, Searching, Undo and Redo (`.md`)।
- **Deliverable:** Upgraded `patterns/screens.md`, `patterns/states.md`, ও gesture choreography spec।

### R-10 · Cross-Platform Performance Engineering & Budgets
- **Linked Domains:** Performance (1/5)
- **অজানা / Research Questions:**
  1. Web CSS `backdrop-filter` layer count, compositor promotion (`translateZ(0)` কখন ক্ষতিকর), ও scroll-driven collapse-এ zero-re-render technique (`useScroll` vs CSS scroll-driven animations)।
  2. Flutter-এ `BackdropFilter` + `SaveLayer` GPU overdraw budget, `RepaintBoundary` placement, ও `CfLargeTitleScaffold`-এ `CustomScrollView` + `AnimatedBuilder`/`ValueListenableBuilder` দিয়ে zero-`setState` scroll collapse।
  3. Low-end Android / mobile GPU-তে Liquid Glass graceful degradation threshold।
- **Primary Sources:** Chrome DevTools rendering/compositing docs, Flutter Performance Best Practices (`BackdropFilter` / `saveLayer` docs), Apple WWDC *Optimize Liquid Glass / SwiftUI performance*।
- **Deliverable:** Measurable performance budget guardrails ও refactor patterns for Web & Flutter।

### R-11 · Platform Adaptation Matrix (iOS, iPadOS, macOS, Android, Windows/Linux, SwiftUI, Electron)
- **Linked Domains:** Platform Adaptation (2/5)
- **অজানা / Research Questions:**
  1. Flutter touch vs pointer detection (`Listener` / `PointerDeviceKind` / `MouseRegion`) দিয়ে `U-02` সমাধান এবং iPadOS/Desktop mouse hover lift (`1.04`) ও pointer interactions।
  2. Android-এ Flutter Cupertino UI চালালে Predictive Back (Android 14+), system gesture navigation insets, ও Material 3 conflict এড়ানোর exact rules।
  3. Guidance-only `apple-swiftui` (native `.glassEffect()`, `GlassEffectContainer`) ও `apple-electron` (doc note) adapter-এর ন্যূনতম কার্যকর পরিধি কী?
- **Primary Sources:** Apple HIG Designing for iPadOS / macOS / iOS, Flutter `PointerDeviceKind` & Android Predictive Back docs, Apple SwiftUI `glassEffect` docs।
- **Deliverable:** 6-platform Native / Adapt / Avoid matrix ও Flutter pointer-kind fix spec।

### R-12 · Localization, RTL & Multi-Script Engineering
- **Linked Domains:** Localization & RTL (1/5)
- **অজানা / Research Questions:**
  1. Web Tailwind v4 logical utilities (`ps-`, `pe-`, `ms-`, `me-`, `inset-inline-start`) এবং Flutter `EdgeInsetsDirectional` / `AlignmentDirectional` / `PositionedDirectional` migration map।
  2. Directional icons (`chevron.left/right`, back swipe, arrows) vs non-directional icons (clock, checkmark, media transport) RTL mirroring rules।
  3. Bangla/Arabic/CJK text expansion (20–30%), tabular numerals vs localized digits, এবং `Intl` date/currency formatting standard।
- **Primary Sources:** Apple HIG Right-to-Left (`.md`), Apple Localization Guide, W3C Internationalization (RTL / Indic / Arabic typography), Flutter `Directionality` docs।
- **Deliverable:** RTL & Localization foundation doc + logical-property lint rules।

---

## P3 — Polish & Specialized Fidelity

### R-13 · Haptics & Sound Native Channel Fidelity
- **Linked Domains:** Haptics ও Sound (2/5)
- **অজানা / Research Questions:**
  1. Flutter iOS-এ `UINotificationFeedbackGenerator` (`success`/`warning`/`error`) ও `UIImpactFeedbackGenerator(rigid/soft)` এর জন্য lightweight Swift MethodChannel design (Android-এর `AppleHapticsPlugin.kt`-এর সমান্তরাল)।
  2. iOS Safari 18+ `<input switch>` haptic sync vs async (`setTimeout`) user-gesture limitation পরীক্ষা; `synth-sounds.py` বনাম `sounds.ts` waveform parity।
- **Primary Sources:** Apple CoreHaptics / UIFeedbackGenerator docs, WebKit `<input type=checkbox switch>` notes।
- **Deliverable:** iOS Swift Haptics snippet + harmonized sound synthesis recipes।

### R-14 · SF Symbols Symbol Effects & iOS 27 / macOS 27 App Icon Spec
- **Linked Domains:** SF Symbols ও App Icon (2/5)
- **অজানা / Research Questions:**
  1. iOS 26/27 & macOS 27 Icon Composer-এর layered Liquid Glass app icon specification (background, foreground glass layers, default/dark/clear/tinted variants, specular highlights)।
  2. Web/Flutter-এ `icons.json` compile-time mapper ও `symbolEffects` (bounce, replace, pulse, wiggle) animation wrappers।
- **Primary Sources:** Apple HIG App Icons (`.md`), Apple Icon Composer docs, Apple SF Symbols 6/7 docs।
- **Deliverable:** App icon design foundation section + icon/effect token integration spec।

### R-15 · P3 Wide-Gamut Color & Automated Brand Accent Derivation
- **Linked Domains:** Color (3/5)
- **অজানা / Research Questions:**
  1. একটি single brand hex থেকে WCAG-compliant `{ light, dark, lightHC, darkHC }` accent variants অ্যালগরিদমিকভাবে (OKLCH বা HSLuv) বের করার পদ্ধতি।
  2. CSS `color(display-p3 ...)` fallback সহ P3 token support প্রয়োজন কি না।
- **Primary Sources:** CSS Color Level 4, Apple HIG Color (`displayP3`, Dark/HC contrast adaptation)।
- **Deliverable:** Upgraded `contrast-check.mjs` + `build-tokens.mjs` multi-mode accent derivation proposal।

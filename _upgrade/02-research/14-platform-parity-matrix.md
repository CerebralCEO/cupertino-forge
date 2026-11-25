# 14 — Cross-Platform Fidelity & Feature Parity Matrix

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `apple-web` (Next.js/React), `apple-flutter` (iOS/macOS/Android), এবং `apple-tauri` (Rust/WKWebView/Electron)-এ ডিজাইন সিদ্ধান্ত নেওয়ার রেফারেন্স ম্যাট্রিক্স; কোন বৈশিষ্ট্য নেটিভ Apple OS-এ পূর্ণমাত্রায় চলে, কোনটি Web/Android-এ আনুমানিক অনুকরণ করতে হয়, এবং কোথায় hard platform limitation আছে তা এখানে স্পষ্ট করা হয়েছে।

---

## 1. Platform Parity Overview Matrix

| Capability | Apple Native (SwiftUI/UIKit/AppKit) | Web / Next.js (`apple-web`) | Flutter (`apple-flutter`) | Tauri v2 / Electron (`apple-tauri`) | Parity Gap / Mitigation |
| --- | --- | --- | --- | --- | --- |
| **Liquid Glass & Specular Lens** | Native (`Glass.regular`/`.clear`, `NSGlassEffectView`, slider-aware shaders) | CSS `backdrop-filter: blur() saturate()` + rim `box-shadow` (**no real refraction**) | `BackdropGroup` + `BackdropFilter.grouped` + overlay gradient (**3.29+ Impeller**) | macOS: `window-vibrancy 0.8+` (`LiquidGlassOptions`) / Win11: `mica` / CSS fallback | Specular displacement lens cannot be duplicated cleanly in pure DOM CSS without heavy SVG/WebGL |
| **Continuous Squircle Corners** | Native (`ConcentricRectangle`, `CALayer.cornerCurve = .continuous`) | `corner-shape: squircle` (Chromium 139+, Safari 18.4+, Firefox 148+) + SVG `<clipPath>` fallback | `ClipRSuperellipse` (`Flutter 3.32+`) / custom cubic `SquircleBorder` (`ContinuousRectangleBorder` is steeper) | WebView engine matches Safari (macOS) or Edge WebView2 (Win `139+`) | Legacy browsers fall back to SVG mask or standard `border-radius` |
| **System Typography & Optical Size** | Native `SF Pro` variable font + automatic CoreText `opsz` & tracking | `-apple-system, BlinkMacSystemFont, system-ui` (renders SF on Apple browsers, fallback `Segoe UI`/`Inter` on Win/Linux) | Native iOS/macOS Skia/Impeller text renders San Francisco; Material default on Android unless bundled/mapped | WKWebView uses Apple SF Pro on macOS; WebView2 uses Segoe UI on Win | Tracking values (`-0.026em`) must disable on non-Latin (`bn`, `ar`) & verify on Segoe/Roboto |
| **Spring Physics & Scroll Inertia** | `Spring(duration:bounce:)`, `UIScrollView.decelerationRate = 0.998`, rubber-band `c=0.55` | `motion/react` spring (`duration`, `bounce`) + CSS `linear()` sampled fallback | `SpringSimulation(mass: 1, stiffness, damping)` + `BouncingScrollPhysics` | Same as Web (`motion/react` / CSS `linear()`) | Browser wheel/trackpad scroll physics are owned by compositor (`overscroll-behavior`) |
| **Dynamic Type & 200% Text Scaling** | System AX1–AX5 (`17pt -> 53pt`) + `DynamicTypeSize` | Root `1rem = 17px` or `clamp()` + user font scale multiplier (`>=200%` zoom safe) | `MediaQuery.textScalerOf(context)` honored everywhere; clamp only with layout test | Same as Web + desktop zoom `Cmd+=`/`Cmd+-` | Never lock body text in `px` on Flutter/Web if user enlarges OS text |
| **Haptics & Tactile Feedback** | `UIImpactFeedbackGenerator`, `UISelectionFeedbackGenerator`, `UINotificationFeedbackGenerator`, Force Touch `NSHapticFeedbackManager` | Android Chrome: `navigator.vibrate`; iOS Safari: hidden `<input switch>` trick; Desktop: **no-op** | `HapticFeedback.light/medium/heavy/selectionClick`; Android maps to `HapticFeedbackConstants` | **Not available** on Mac/Win desktop webview (`skip`) | Optional synthesized `assets/sounds/*.wav` (`opt-in OFF by default`) fills desktop gap when enabled |
| **Reduce Transparency / Contrast** | Native `UIAccessibility` adapts every system glass/material automatically | `@media (prefers-reduced-transparency: reduce)` (`Chrome 118+`, **Safari unsupported**) + `[data-reduced-transparency]` toggle | `MediaQuery.highContrastOf(context)` + app-level glass intensity/opacity fallback | Respects macOS Accessibility via WKWebView/NSGlassEffectView (`native`) + CSS toggle | Must ship manual preference toggle on Web because Safari lacks media query |
| **Navigation & Back Gesture** | Interactive 20pt edge swipe + 30% outgoing parallax + `.tabBarMinimizeBehavior` | History API + animated shared container / sticky glass tab capsule | `CupertinoPageRoute` swipe back (iOS/macOS) + `PredictiveBackPageTransitionsBuilder` & `PopScope` (Android 14+) | Desktop sidebar + `Cmd+[` / `Cmd+]` navigation history | Android Predictive Back breaks if `WillPopScope` / root `PopScope(canPop: false)` intercepts naively |

---

## 2. Quantitative Cross-Platform Parity Thresholds (9-Column Spec)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `parity.web.squircleSupport` | Chromium `139+`, Safari `18.4+`, Firefox `148+` | browser version | Web | Both | https://caniuse.com/?search=corner-shape | Official | high | Progressive enhancement; SVG fallback required for older browsers |
| `parity.web.reducedTransparency` | Chromium `118+` supported; Safari unsupported | browser support | Web | Both | https://caniuse.com/?search=prefers-reduced-transparency | Official | high | Web apps MUST provide an explicit in-app Reduce Transparency setting |
| `parity.flutter.groupedBlurMin` | Flutter `3.29+` (`BackdropFilter.grouped`) | SDK version | Flutter (Impeller) | Both | https://api.flutter.dev/flutter/widgets/BackdropFilter-class.html | Official | high | Eliminates per-card framebuffer copies in glass toolbars/lists |
| `parity.android.predictiveBack` | Android `14+` (`PredictiveBackPageTransitionsBuilder` + Edge-to-Edge API `35+`) | Android SDK | Flutter Android | Both | https://api.flutter.dev/flutter/material/PredictiveBackPageTransitionsBuilder-class.html | Official | high | Pair with `MediaQuery.paddingOf(context)` for system bar insets on Android 15+ |
| `parity.tauri.vibrancyLiquidGlass` | `window-vibrancy >= 0.8.0` (`LiquidGlassOptions`) | crate version | Tauri v2 (macOS 26+) | Both | https://docs.rs/window-vibrancy/latest/window_vibrancy/ | Official | high | Plugin `Cargo-snippet.toml` currently pins older `0.7` (`NSVisualEffectView` only) |
| `parity.tauri.masPrivateApiRisk` | `macOSPrivateApi: true` risks Mac App Store rejection | App Review rule | Tauri / Electron macOS | Both | https://tauri.app/distribute/app-store/ | Official | high | Keep `macOSPrivateApi: false` for MAS builds; rely on standard traffic lights / public APIs |

---

## 3. Gaps & Open Questions
- Electron-এ macOS 26/27-এর `NSGlassEffectView` সমর্থন (`vibrancy` enum-এ official Tahoe/27 material যোগ হয়েছে কি না) Electron latest release notes দিয়ে runtime-এ যাচাই করতে হবে (`Unknown`)।

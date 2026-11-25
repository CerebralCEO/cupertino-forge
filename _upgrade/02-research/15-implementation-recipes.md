# 15 — Untested Cross-Platform Implementation Recipes (Web, Flutter, Tauri, Electron)

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `skills/apple-web`, `skills/apple-flutter`, এবং `skills/apple-tauri`-এর কোড টেমপ্লেট আপগ্রেড করার (Prompt 3) ব্লুপ্রিন্ট; এখানে প্রতিটি প্রডাকশন প্যাটার্ন দেওয়া আছে এবং প্রতিটি কোড স্নিপেট Windows গবেষণা পরিবেশে কম্পাইল/চালানো হয়নি বলে স্পষ্টভাবে **`Untested`** চিহ্নিত করা হয়েছে।

---

## 1. Quantitative Recipe Budgets & Verification Targets

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `recipe.web.springConfig` | `{ type: "spring", visualDuration: 0.5, bounce: 0.15 }` | `motion/react` | Web (Next.js / React) | Both | https://motion.dev/docs/react-transitions | Official | high | Wrap app root in `<MotionConfig reducedMotion="user">` |
| `recipe.web.backdropCap` | `<= 6` visible glass surfaces (`blur <= 20px`) | DOM layers | Web | Both | `tokens/materials.json` | Estimated | med | Avoid `backdrop-filter` inside virtualized 60fps list items |
| `recipe.flutter.blurGrouping` | `BackdropGroup` + `BackdropFilter.grouped` | widget tree | Flutter `3.29+` | Both | https://api.flutter.dev/flutter/widgets/BackdropFilter-class.html | Official | high | Constant `sigma`; animate overlay container alpha only; never animate sigma |
| `recipe.flutter.textScaling` | Honor `MediaQuery.textScalerOf` up to `>= 2.0x` | scale factor | Flutter | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Use `withClampedTextScaling(maxScaleFactor: 2.0)` only for tight toolbar badges |
| `recipe.tauri.vibrancyV08` | `apply_liquid_glass(&window, NSGlassEffectViewStyle::Regular, Some(radius), None)` | Rust API | Tauri v2 + `window-vibrancy 0.8+` | Both | https://docs.rs/window-vibrancy/latest/window_vibrancy/ | Official | high | Falls back to `apply_vibrancy` on pre-macOS 26; `v0.7` lacks `LiquidGlassOptions` |
| `recipe.tauri.win11Material` | `apply_mica(&window, Some(is_dark))` / Electron `backgroundMaterial: 'mica'` | desktop API | Windows 11 | Light / Dark | https://www.electronjs.org/docs/latest/api/browser-window | Official | high | Graceful Windows 11 counterpart when desktop app ships cross-platform |

---

## 2. Web / Next.js Recipes *(Untested)*

### A. Continuous Squircle + Logical RTL CSS & Fallback
```css
/* Untested — verify visually on Chromium 139+ and Safari 18.4+ */
.cf-card {
  border-radius: 22px;
  padding-inline: 16px;
  padding-block: 12px;
  background: var(--cf-bg-secondary-grouped);
}
@supports (corner-shape: squircle) {
  .cf-card { corner-shape: squircle; }
}
/* Non-Latin protection: disable negative SF Pro tracking on Bangla/Arabic */
:lang(bn), :lang(ar), :lang(he) {
  letter-spacing: 0 !important;
}
:lang(bn) {
  font-family: "Kohinoor Bangla", "Hind Siliguri", "Noto Sans Bengali", sans-serif;
  line-height: 1.45;
}
```

### B. `motion/react` Reduced Motion + iOS Safari Switch Haptic Helper
```tsx
// Untested — Next.js Client Component pattern
import { MotionConfig } from "motion/react";

export function AppleMotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

---

## 3. Flutter Recipes *(Untested)*

### A. Grouped Liquid Glass Bar (`Flutter 3.29+` Impeller) + RTL Directionality
```dart
// Untested — requires Flutter 3.29+ Impeller verification
import 'dart:ui' as ui;
import 'package:flutter/cupertino.dart';

class AppleGlassToolbar extends StatelessWidget {
  const AppleGlassToolbar({super.key, required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return BackdropGroup(
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: children.map((child) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: BackdropFilter.grouped(
                filter: ui.ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                child: child,
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
```

### B. Android Predictive Back + Safe Area Insets (`Android 14/15+`)
```dart
// Untested — ThemeData snippet for cross-platform Flutter apps targeting iOS + Android
final pageTransitions = const PageTransitionsTheme(
  builders: {
    TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
    TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
    TargetPlatform.android: PredictiveBackPageTransitionsBuilder(),
  },
);
```

---

## 4. Tauri v2 (`window-vibrancy 0.8+`) & Electron Recipes *(Untested)*

```rust
// Untested — Cargo.toml: window-vibrancy = "0.8"
// Use macOSPrivateApi: false if targeting Mac App Store
#[cfg(target_os = "macos")]
{
    use window_vibrancy::{apply_liquid_glass, LiquidGlassOptions, NSGlassEffectViewStyle};
    let opts = LiquidGlassOptions::new(NSGlassEffectViewStyle::Regular)
        .with_radius(12.0)
        .with_interactive(true);
    let _ = apply_liquid_glass(&window, opts);
}
```

---

## 5. Gaps & Open Questions
- সব recipe-ই `Untested` হিসেবে চিহ্নিত কারণ গবেষণা ধাপে কোড পরিবর্তন বা প্রজেক্ট বিল্ড নিষিদ্ধ (Prompt 3-এ বাস্তব প্রজেক্টে রান ও snapshot পরীক্ষা হবে)।
- `ClipRSuperellipse` (`Flutter 3.32+`)-এর তুলনায় plugin-এর `SquircleBorder` কত দ্রুত রেন্ডার করে তা Impeller profiler-এ মাপা বাকি।

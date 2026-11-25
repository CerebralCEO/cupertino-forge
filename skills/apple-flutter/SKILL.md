---
name: apple-flutter
description: Flutter adapter for the Apple iOS 27 and macOS 27 design system. Cupertino based, no Material look. Generated AppleTokens (colors, type, springs, radii), SquircleBorder, CfGlass Liquid Glass widget (with BackdropGroup support), spring physics, iOS & Android platform haptics, original UI sounds, and ready widgets (CfButton, CfNavBar, CfTabBar, CfList, CfToggle, CfSegmented, CfSlider, CfTextField, CfSearchField, CfMenu, CfProgressBar, CfSheet, CfAlert). Use whenever apple-design-core routes to flutter or the project has pubspec.yaml.
---

# Apple Flutter Adapter

Read `apple-design-core` first. This skill tells you HOW to implement in Flutter (Android, iOS, macOS, Windows, Linux).

## 1. Setup (once per project, /apple-init does this)

1. Generate tokens: `node ${CLAUDE_PLUGIN_ROOT}/scripts/build-tokens.mjs --out lib/apple_ui/theme --targets dart --accent <accent>` → `lib/apple_ui/theme/apple_tokens.dart`.
2. Copy `${CLAUDE_PLUGIN_ROOT}/skills/apple-flutter/assets/lib/apple_ui/` into the project's `lib/apple_ui/` (keep the generated tokens file).
3. Copy sounds if `sounds: true`: `${CLAUDE_PLUGIN_ROOT}/assets/sounds/*.wav` → `assets/sounds/` and register in pubspec.
4. pubspec dependencies:
   ```yaml
   dependencies:
     cupertino_icons: ^1.0.8
     audioplayers: ^6.1.0        # only when sounds are enabled
   flutter:
     fonts:                      # only for Android, Windows, Linux targets
       - family: Inter
         fonts: [{ asset: assets/fonts/InterVariable.ttf }]
   ```
   Download Inter (OFL) from the official rsms/inter GitHub release. Never add SF font files.
5. App root: use `CfApp` (wraps `CupertinoApp` with AppleTheme, single-pass text scaling via `MediaQuery.withClampedTextScaling`, Apple scroll physics, haptics, reduceTransparency, and sounds config). Never `MaterialApp`.
6. Platform haptics registration:
   - **iOS**: copy `assets/ios/AppleHapticsPlugin.swift` into `ios/Runner/` and register in `AppDelegate.swift` (`AppleHapticsPlugin.register(with: controller.binaryMessenger)`) for native `UINotificationFeedbackGenerator` & `UIImpactFeedbackGenerator(.rigid/.soft)`.
   - **Android**: copy `assets/android/AppleHapticsPlugin.kt` into `android/app/src/main/kotlin/<package>/` and register in `MainActivity`.
7. Run `flutter analyze` and `flutter test` after copying. Fix anything reported before building UI.

## 2. How to write UI code

- Root: `CfApp(style: CfStyle.ios | macos | adaptive, reduceTransparency: ..., home: ...)`. Read config values from `.apple-design.json` once and pass them in.
- Colors: `context.cf.label`, `context.cf.label2`, `context.cf.bgGrouped`, `context.cf.accent`, `context.cf.red` (extension resolves brightness, contrast, elevation and platform). Never `Colors.*` or `Color(0x...)` in feature code.
- Text: `context.cf.type.body`, `.headline`, `.largeTitleEmphasized` (tracks non-Latin protection `bn`/`ar`/`he` automatically and leaves `fontSize` unscaled so `Text` scales once via `MediaQuery.textScaler`). Never call `MediaQuery.textScalerOf(context).scale(...)` manually.
- Shapes: `SquircleBorder(radius: AppleRadiusIOS.card)` via `ShapeDecoration` or `CfSquircle` widget. Capsules: `StadiumBorder()`. Never `BorderRadius.circular` for rounded rects.
- Glass: `CfGlass(variant: CfGlassVariant.regular, grouped: ..., child: ...)` for the functional layer only. Outer shadow sits outside `ClipPath` so elevation shadow is never clipped.
- Motion: `AppleSprings.snappy` with `SpringSimulation`, or `animateSpring(controller, target, AppleSprings.snappy)`. Never `Curves.easeInOut` for movement. Page routes: `CfPageRoute` (**Approximation** — wraps `CupertinoPageRoute`, not a spring physics simulation).
- Scroll: `CfScrollPhysics` (bouncing iOS physics with `ScrollDecelerationRate.normal` `0.998`) set globally by `CfApp`.
- Haptics: `CfHaptics.selection()`, `.light()`, `.medium()`, `.rigid()`, `.success()`, `.warning()`, `.error()`. Sounds: `CfSounds.play(CfSound.toggleOn)` (no-op unless enabled).
- Icons: `CupertinoIcons.*` mapped from `tokens/icons.json`.

## 3. Flutter 3.29+ Impeller `BackdropGroup` Performance Rules (`[official]`)

When rendering multiple glass surfaces in a toolbar, floating bar, or header row on Flutter `3.29+` (Impeller):
1. Wrap sibling glass pills in a `BackdropGroup(child: ...)` and pass **`grouped: true`** to each `CfGlass(...)` so Impeller shares one backdrop pass (`BackdropFilter.grouped`) instead of multiple offscreen `saveLayer` copies.
2. **Never put overlapping glass elements in the same `BackdropGroup`** — spatial overlap inside one group produces visual artifacts.
3. **Always clip every `BackdropFilter` inside `ClipPath` / `ClipRRect`** (`CfGlass` already does) and **never animate `blur` sigma per frame** — keep `sigma` constant and animate overlay fill opacity only.

## 4. Native / Approximation / Not possible Parity Matrix

| Capability | iOS / macOS (`Cupertino`) | Android / Windows / Linux | Parity Status & Mitigation |
|---|---|---|---|
| Liquid Glass & specular lens | **Approximation** (`BackdropFilter` + `BackdropFilter.grouped` + saturation matrix + rim painter) | **Approximation** (`BackdropFilter` + rim painter; desktop GPU dependent) | Native specular chromatic dispersion requires shader / platform view (`liquid_glass_native` optional for hero iOS 26+ pills) |
| Continuous squircle corners | **Approximation / Native** (`SquircleBorder` cubic Bézier or Flutter `3.32+` `ClipRSuperellipse`) | **Approximation** (`SquircleBorder`) | Outer drop shadow lives outside `ClipPath` so elevation shadows never clip |
| System font (`SF Pro`) & non-Latin tracking | **Native** (`fontFamily: null` uses system SF) | **Approximation** (`Inter` variable via pubspec) | `CfType` disables negative tracking for `bn`/`ar`/`he` locales automatically |
| Spring motion & scroll inertia | **Approximation** (`SpringSimulation` for controls; `CfPageRoute` approximates push via `CupertinoPageRoute`) | **Approximation** (`SpringSimulation` + `CfScrollPhysics`) | Never call `CfPageRoute` an exact UIKit spring; use `animateSpring` for interactive controls |
| Dynamic Type scaling (`>= 2.0x`, max `3.1x`) | **Native** (single-pass `MediaQuery.textScaler` + `MediaQuery.withClampedTextScaling`) | **Native** (respects OS accessibility font scale) | `CfType` never pre-scales `fontSize` manually |
| Haptics (`UINotificationFeedbackGenerator` / Android) | **Native** (`AppleHapticsPlugin.swift` + `HapticFeedback` fallback) | **Native** (`AppleHapticsPlugin.kt` Android `30/34+`) / **Not possible** on Desktop | Opt-in synthesized `.wav` sounds fill desktop/non-haptic gaps |
| Reduce Transparency | **Approximation** (`CfApp(reduceTransparency: true)` + `highContrastOf`) | **Approximation** (`CfApp(reduceTransparency: true)` + `highContrastOf`) | Flutter lacks a dedicated OS reduce-transparency media query; expose toggle in app settings |
| Android Predictive Back & Edge-to-Edge | **Native** (`CupertinoPageRoute` swipe back) | **Native** (`SystemChrome.setEnabledSystemUIMode(edgeToEdge)` in `initState` + `PredictiveBackPageTransitionsBuilder` `[official]`) | Never block back gestures with naive root `PopScope(canPop: false)` |

## 5. Widget catalog (`lib/apple_ui`)

| File | Widgets |
|---|---|
| `cf_app.dart` | `CfApp`, `CfStyle`, `CfScope` (`reduceTransparency`, width+desktop `isMacStyle`) |
| `theme/cf_theme.dart` | `context.cf` extension, `CfColors`, `CfType`, `CfElevated` |
| `theme/apple_tokens.dart` | generated constants |
| `shapes/squircle_border.dart` | `SquircleBorder`, `CfSquircle` |
| `glass/cf_glass.dart` | `CfGlass` (`grouped`, unclipped shadow), `CfGlassVariant`, `CfScrollEdge` |
| `motion/cf_motion.dart` | `animateSpring`, `CfPageRoute` (Approximation), `CfScrollPhysics`, `CfPressable` (`PointerDeviceKind`) |
| `feedback/cf_haptics.dart` | `CfHaptics` (iOS + Android channels) |
| `feedback/cf_sounds.dart` | `CfSounds`, `CfSound` |
| `widgets/cf_button.dart` | `CfButton`, `CfIconButton` |
| `widgets/cf_nav_bar.dart` | `CfLargeTitleScaffold` (`ValueNotifier` scroll opacity), `CfBarButtonGroup` |
| `widgets/cf_tab_bar.dart` | `CfTabBar`, `CfTabItem` |
| `widgets/cf_list.dart` | `CfList`, `CfListSection`, `CfListRow`, `CfSettingsIcon` |
| `widgets/cf_controls.dart` | `CfToggle`, `CfSegmented` |
| `widgets/cf_slider.dart` | `CfSlider` |
| `widgets/cf_fields.dart` | `CfTextField`, `CfSearchField` |
| `widgets/cf_menu.dart` | `CfMenuItem`, `showCfMenu`, `showCfPopover` |
| `widgets/cf_progress.dart` | `CfActivityIndicator`, `CfProgressBar` |
| `widgets/cf_presentation.dart` | `showCfSheet`, `showCfAlert` |

Read `references/widgets-flutter.md` for usage.

## 6. Flutter specific rules

1. No Material widgets in UI (`Scaffold`, `AppBar`, `ElevatedButton`, `InkWell`, `ListTile`, `Card`, `FloatingActionButton`, `SnackBar`, `Switch`, `Slider` from `material`). The lint hook blocks them, plus manual `textScaler.scale(` (error) and `navigationMode` (warning).
2. No ripples, no splash: `CfApp` disables them globally; `CfPressable` gives Apple press feedback using `PointerDeviceKind`.
3. Respect `MediaQuery.textScalerOf`, `boldTextOf`, `highContrastOf`, `disableAnimationsOf`, `platformBrightnessOf`.
4. `BackdropFilter` is expensive: max about 6 glass surfaces per screen, wrap each in `RepaintBoundary` (`CfGlass` does), and use `BackdropGroup` + `CfGlass(grouped: true)` on non-overlapping multi-pill bars.
5. Status bar and system navigation bar on Android: transparent, edge to edge (`SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge)` in `CfApp.initState`), icons follow brightness.
6. Android: set `android:windowSplashScreenAnimatedIcon` style plain; disable Android overscroll stretch (`CfScrollPhysics` + `ScrollConfiguration`).

## 7. Done check (Flutter)

`flutter analyze`, `flutter test`, and `node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all` clean, run on an emulator/device, capture light and dark screenshots, and run `apple-design-reviewer`.

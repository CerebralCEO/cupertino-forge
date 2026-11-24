---
name: apple-flutter
description: Flutter adapter for the Apple iOS 27 and macOS 27 design system. Cupertino based, no Material look. Generated AppleTokens (colors, type, springs, radii), SquircleBorder, CfGlass Liquid Glass widget, spring physics, haptics, original UI sounds, and ready widgets (CfButton, CfNavBar, CfTabBar, CfList, CfToggle, CfSegmented, CfSheet, CfAlert). Use whenever apple-design-core routes to flutter or the project has pubspec.yaml.
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
5. App root: use `CfApp` (wraps `CupertinoApp` with AppleTheme, text styles, scroll physics, haptics and sounds config). Never `MaterialApp`.
6. Android native haptics: copy `assets/android/AppleHapticsPlugin.kt` into `android/app/src/main/kotlin/<package>/` and register it in MainActivity (instructions in the file header).
7. Run `flutter analyze` after copying. Fix anything it reports before building UI.

## 2. How to write UI code

- Root: `CfApp(style: CfStyle.ios | macos | adaptive, home: ...)`. Read config values from `.apple-design.json` once and pass them in.
- Colors: `context.cf.label`, `context.cf.label2`, `context.cf.bgGrouped`, `context.cf.accent`, `context.cf.red` (extension resolves brightness, contrast, elevation and platform). Never `Colors.*` or `Color(0x...)` in feature code.
- Text: `context.cf.type.body`, `.headline`, `.largeTitleEmphasized` (already sized, tracked, leading set, and scaled by MediaQuery.textScaler).
- Shapes: `SquircleBorder(radius: AppleRadiusIOS.card)` via `ShapeDecoration` or `CfSquircle` widget. Capsules: `StadiumBorder()`. Never `BorderRadius.circular` for rounded rects.
- Glass: `CfGlass(variant: CfGlassVariant.regular, child: ...)` for the functional layer only.
- Motion: `AppleSprings.snappy` with `SpringSimulation`, or the helper `CfSpringAnimation` / `animateSpring(controller, target, AppleSprings.snappy)`. Never `Curves.easeInOut` for movement. Page routes: `CfPageRoute` (push spring and edge swipe back).
- Scroll: `CfScrollPhysics` (bouncing iOS physics with Apple deceleration) is set globally by CfApp.
- Haptics: `CfHaptics.selection()`, `.light()`, `.medium()`, `.success()`, `.error()`. Sounds: `CfSounds.play(CfSound.toggleOn)` (no-op unless enabled).
- Icons: `CupertinoIcons.*` mapped from tokens/icons.json.

## 3. Widget catalog (lib/apple_ui)

| File | Widgets |
|---|---|
| cf_app.dart | CfApp, CfStyle, CfScope (inherited config) |
| theme/cf_theme.dart | context.cf extension, CfColors, CfType, CfElevated |
| theme/apple_tokens.dart | generated constants |
| shapes/squircle_border.dart | SquircleBorder, CfSquircle |
| glass/cf_glass.dart | CfGlass, CfGlassVariant, CfScrollEdge |
| motion/cf_motion.dart | animateSpring, CfPageRoute, CfScrollPhysics, CfPressable |
| feedback/cf_haptics.dart | CfHaptics |
| feedback/cf_sounds.dart | CfSounds, CfSound |
| widgets/cf_button.dart | CfButton (variants and sizes like web), CfIconButton |
| widgets/cf_nav_bar.dart | CfNavBar, CfLargeTitleScaffold, CfBarButtonGroup |
| widgets/cf_tab_bar.dart | CfTabBar, CfTabItem |
| widgets/cf_list.dart | CfList, CfListSection, CfListRow, CfSettingsIcon |
| widgets/cf_controls.dart | CfToggle, CfSegmented |
| widgets/cf_presentation.dart | showCfSheet, showCfAlert |

Read `references/widgets-flutter.md` for usage.

## 4. Flutter specific rules

1. No Material widgets in UI (Scaffold, AppBar, ElevatedButton, InkWell, ListTile, Card, FloatingActionButton, SnackBar, Switch, Slider from material). The lint hook blocks them. CupertinoPageScaffold plus cf widgets only.
2. No ripples, no splash: CfApp disables them globally; `CfPressable` gives Apple press feedback.
3. Respect `MediaQuery.textScalerOf`, `boldTextOf`, `highContrastOf`, `disableAnimationsOf`, `platformBrightnessOf`.
4. BackdropFilter is expensive: max about 6 glass surfaces per screen, wrap each in RepaintBoundary (CfGlass does).
5. On iOS 26+ native glass via platform views is optional (`liquid_glass_native` package) for hero elements; CfGlass is the default everywhere.
6. Status bar and system navigation bar on Android: transparent, edge to edge (`SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge)`), icons follow brightness.
7. Android: also set `android:windowSplashScreenAnimatedIcon` style plain; disable Android overscroll stretch (CfScrollPhysics + ScrollConfiguration).

## 5. Done check (Flutter)

`flutter analyze` clean, `node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all` clean, run on an emulator, capture screenshots light and dark, and run the `apple-design-reviewer` agent with them.

Note: the Dart sources in assets were written against Flutter 3.27+ APIs but were not compiled inside the plugin build environment (no Flutter SDK there). Expect to fix small API drift on first `flutter analyze`; keep the visual values unchanged.

import 'package:flutter/foundation.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'feedback/cf_haptics.dart';
import 'feedback/cf_sounds.dart';
import 'motion/cf_motion.dart';
import 'theme/apple_tokens.dart';
import 'theme/cf_theme.dart';

enum CfStyle { ios, macos, adaptive }

/// Inherited configuration from .apple-design.json.
class CfScope extends InheritedWidget {
  const CfScope({super.key, required this.style, required this.glassIntensity, required this.accent, required super.child});
  final CfStyle style;
  final double glassIntensity; // 0 clear .. 1 tinted
  final CfColor accent;

  static CfScope of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<CfScope>()!;

  /// Resolved platform for the current available width (size class), per apple-design-core section 3.
  bool isMacStyle(BuildContext context) {
    if (style == CfStyle.macos) return true;
    if (style == CfStyle.ios) return false;
    final w = MediaQuery.sizeOf(context).width;
    final fine = MediaQuery.of(context).navigationMode == NavigationMode.traditional &&
        (defaultTargetPlatformIsDesktop());
    return w >= AppleLayout.breakpointDesktop && fine;
  }

  @override
  bool updateShouldNotify(CfScope old) => old.style != style || old.glassIntensity != glassIntensity || old.accent != accent;
}

bool defaultTargetPlatformIsDesktop() {
  switch (defaultTargetPlatform) {
    case TargetPlatform.macOS:
    case TargetPlatform.windows:
    case TargetPlatform.linux:
      return true;
    default:
      return false;
  }
}

/// App root. Replaces MaterialApp. Cupertino theme with Apple tokens, no ripples, Apple scroll physics.
class CfApp extends StatelessWidget {
  const CfApp({
    super.key,
    this.style = CfStyle.adaptive,
    this.home,
    this.routes = const {},
    this.title = '',
    this.accent = AppleSystemColors.blue,
    this.glassIntensity = 0.5,
    this.sounds = false,
    this.haptics = true,
    this.brightness, // null follows the system
    this.onGenerateRoute,
  });

  final CfStyle style;
  final Widget? home;
  final Map<String, WidgetBuilder> routes;
  final RouteFactory? onGenerateRoute;
  final String title;
  final CfColor accent;
  final double glassIntensity;
  final bool sounds;
  final bool haptics;
  final Brightness? brightness;

  @override
  Widget build(BuildContext context) {
    CfHaptics.enabled = haptics;
    CfSounds.enabled = sounds;
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    return CfScope(
      style: style,
      glassIntensity: glassIntensity,
      accent: accent,
      child: Builder(builder: (context) {
        final b = brightness ?? MediaQuery.platformBrightnessOf(context);
        final hc = MediaQuery.highContrastOf(context);
        return CupertinoApp(
          title: title,
          debugShowCheckedModeBanner: false,
          home: home,
          routes: routes,
          onGenerateRoute: onGenerateRoute,
          theme: CupertinoThemeData(
            brightness: b,
            primaryColor: accent.resolve(b, highContrast: hc),
            scaffoldBackgroundColor: AppleIOSColors.bg.resolve(b),
            barBackgroundColor: const Color(0x00000000), // cf-ignore transparent bars, scroll edge effect instead
            textTheme: CupertinoTextThemeData(textStyle: CfType.forPlatform(context, b, hc).body),
          ),
          builder: (context, child) => ScrollConfiguration(
            behavior: const CfScrollBehavior(),
            child: AnnotatedRegion<SystemUiOverlayStyle>(
              value: b == Brightness.dark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
              child: child ?? const SizedBox.shrink(),
            ),
          ),
        );
      }),
    );
  }
}

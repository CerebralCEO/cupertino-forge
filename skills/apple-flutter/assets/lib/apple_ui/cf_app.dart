import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'feedback/cf_haptics.dart';
import 'feedback/cf_sounds.dart';
import 'motion/cf_motion.dart';
import 'theme/apple_tokens.dart';
import 'theme/cf_theme.dart';

enum CfStyle { ios, macos, adaptive }

/// Inherited configuration from .apple-design.json.
class CfScope extends InheritedWidget {
  const CfScope({
    super.key,
    required this.style,
    required this.glassIntensity,
    required this.accent,
    this.reduceTransparency = false,
    required super.child,
  });

  final CfStyle style;
  final double glassIntensity; // 0 clear .. 1 tinted
  final CfColor accent;
  final bool reduceTransparency;

  static CfScope of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<CfScope>()!;
  static CfScope? maybeOf(BuildContext context) => context.dependOnInheritedWidgetOfExactType<CfScope>();

  /// Resolved platform for the current available width (size class), per apple-design-core section 3.
  bool isMacStyle(BuildContext context) {
    if (style == CfStyle.macos) return true;
    if (style == CfStyle.ios) return false;
    final w = MediaQuery.sizeOf(context).width;
    return w >= AppleLayout.breakpointDesktop && defaultTargetPlatformIsDesktop();
  }

  @override
  bool updateShouldNotify(CfScope old) =>
      old.style != style ||
      old.glassIntensity != glassIntensity ||
      old.accent != accent ||
      old.reduceTransparency != reduceTransparency;
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
class CfApp extends StatefulWidget {
  const CfApp({
    super.key,
    this.style = CfStyle.adaptive,
    this.home,
    this.routes = const {},
    this.title = '',
    this.accent = AppleSystemColors.blue,
    this.glassIntensity = 0.5,
    this.reduceTransparency = false,
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
  final bool reduceTransparency;
  final bool sounds;
  final bool haptics;
  final Brightness? brightness;

  @override
  State<CfApp> createState() => _CfAppState();
}

class _CfAppState extends State<CfApp> {
  @override
  void initState() {
    super.initState();
    CfHaptics.enabled = widget.haptics;
    CfSounds.enabled = widget.sounds;
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  }

  @override
  void didUpdateWidget(CfApp oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.haptics != widget.haptics) CfHaptics.enabled = widget.haptics;
    if (oldWidget.sounds != widget.sounds) CfSounds.enabled = widget.sounds;
  }

  @override
  Widget build(BuildContext context) {
    return CfScope(
      style: widget.style,
      glassIntensity: widget.glassIntensity,
      accent: widget.accent,
      reduceTransparency: widget.reduceTransparency,
      child: Builder(builder: (context) {
        final scope = CfScope.of(context);
        final mac = scope.isMacStyle(context);
        final b = widget.brightness ?? MediaQuery.platformBrightnessOf(context);
        final hc = MediaQuery.highContrastOf(context);
        return CupertinoApp(
          title: widget.title,
          debugShowCheckedModeBanner: false,
          home: widget.home,
          routes: widget.routes,
          onGenerateRoute: widget.onGenerateRoute,
          theme: CupertinoThemeData(
            brightness: b,
            primaryColor: widget.accent.resolve(b, highContrast: hc),
            scaffoldBackgroundColor: (mac ? AppleMacOSColors.bg : AppleIOSColors.bg).resolve(b),
            barBackgroundColor: const Color(0x00000000), // cf-ignore transparent bars, scroll edge effect instead
            textTheme: CupertinoTextThemeData(textStyle: CfType.forPlatform(context, b, hc).body),
          ),
          builder: (context, child) => MediaQuery.withClampedTextScaling(
            maxScaleFactor: mac ? 1.0 : 3.1,
            child: ScrollConfiguration(
              behavior: const CfScrollBehavior(),
              child: AnnotatedRegion<SystemUiOverlayStyle>(
                value: b == Brightness.dark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
                child: child ?? const SizedBox.shrink(),
              ),
            ),
          ),
        );
      }),
    );
  }
}

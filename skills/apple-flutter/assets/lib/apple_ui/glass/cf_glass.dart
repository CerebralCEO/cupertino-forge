import 'dart:ui' as ui;
import 'package:flutter/cupertino.dart';

import '../cf_app.dart';
import '../motion/cf_motion.dart';
import '../shapes/squircle_border.dart';

enum CfGlassVariant { regular, clear, large, tinted }

/// Liquid Glass surface (functional layer only). Blur + saturation + tint + rim highlight + soft shadow,
/// using the tuned recipes from tokens/materials.json. Reduce Transparency / Increase Contrast make it opaque.
/// Outer drop shadow sits outside ClipPath so elevation shadow is never clipped.
/// Set [grouped] = true when wrapped in a BackdropGroup (Flutter 3.29+ Impeller optimization).
class CfGlass extends StatelessWidget {
  const CfGlass({
    super.key,
    required this.child,
    this.variant = CfGlassVariant.regular,
    this.shape = const StadiumBorder(),
    this.pressable = false,
    this.onTap,
    this.tint,
    this.dim = false,
    this.grouped = false,
    this.padding,
  });

  final Widget child;
  final CfGlassVariant variant;
  final ShapeBorder shape; // StadiumBorder (capsule), CircleBorder, or SquircleBorder(radius)
  final bool pressable;
  final VoidCallback? onTap;
  final Color? tint; // tinted variant color, defaults to accent
  final bool dim; // 35% black dimming under clear glass over bright media
  final bool grouped; // uses BackdropFilter.grouped inside a BackdropGroup
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final dark = CupertinoTheme.brightnessOf(context) == Brightness.dark;
    final hc = MediaQuery.highContrastOf(context);
    final scope = CfScope.maybeOf(context);
    final intensity = scope?.glassIntensity ?? 0.5;
    final reduce = hc || (scope?.reduceTransparency ?? false);

    double blur;
    Color fill;
    switch (variant) {
      case CfGlassVariant.clear:
        blur = 4;
        fill = dark ? const Color(0x0FFFFFFF) : const Color(0x1FFFFFFF); // cf-ignore tuned recipe
      case CfGlassVariant.large:
        blur = 24;
        fill = dark ? const Color(0xC7242426) : const Color(0xC7FFFFFF); // cf-ignore
      case CfGlassVariant.tinted:
        blur = 12;
        fill = (tint ?? CupertinoTheme.of(context).primaryColor).withValues(alpha: 0.85);
      case CfGlassVariant.regular:
        blur = 12;
        fill = dark ? const Color(0x941E1E20) : const Color(0x94FFFFFF); // cf-ignore
    }
    // intensity 0 = clearer, 1 = more tinted
    fill = fill.withValues(alpha: (fill.a * (0.7 + 0.6 * intensity)).clamp(0.0, 1.0));
    blur = blur * (0.7 + 0.6 * intensity);
    if (reduce) {
      fill = dark ? const Color(0xFF262626) : const Color(0xFFF6F6F6); // cf-ignore opaque fallback
      blur = 0;
    }

    // Inner fill + rim highlight live inside ClipPath; outer shadow sits outside ClipPath so it is never clipped.
    Widget inner = DecoratedBox(
      decoration: ShapeDecoration(shape: shape, color: fill),
      child: CustomPaint(
        foregroundPainter: _RimPainter(shape: shape, dark: dark, hc: hc),
        child: Padding(padding: padding ?? EdgeInsets.zero, child: child),
      ),
    );
    if (blur > 0) {
      final filter = ui.ImageFilter.compose(
        outer: ui.ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        inner: ui.ColorFilter.matrix(_saturation(dark ? 1.6 : 1.8)),
      );
      inner = ClipPath(
        clipper: ShapeBorderClipper(shape: shape),
        child: grouped
            ? BackdropFilter.grouped(filter: filter, child: inner)
            : BackdropFilter(filter: filter, child: inner),
      );
    }

    Widget surface = DecoratedBox(
      decoration: ShapeDecoration(
        shape: shape,
        shadows: [
          BoxShadow(color: Color(dark ? 0x80000000 : 0x24000000), blurRadius: 24, offset: const Offset(0, 8), spreadRadius: -4), // cf-ignore
          BoxShadow(color: Color(dark ? 0x4D000000 : 0x0F000000), blurRadius: 3, offset: const Offset(0, 1)), // cf-ignore
        ],
      ),
      child: inner,
    );

    if (dim) {
      surface = Stack(children: [
        Positioned.fill(child: DecoratedBox(decoration: ShapeDecoration(shape: shape, color: const Color(0x59000000)))), // cf-ignore
        surface,
      ]);
    }
    surface = RepaintBoundary(child: surface);
    if (pressable || onTap != null) surface = CfPressable(style: CfPressStyle.glass, onTap: onTap, child: surface);
    return surface;
  }

  static List<double> _saturation(double s) {
    const r = 0.2126, g = 0.7152, b = 0.0722;
    final i = 1 - s;
    return [
      r * i + s, g * i, b * i, 0, 0,
      r * i, g * i + s, b * i, 0, 0,
      r * i, g * i, b * i + s, 0, 0,
      0, 0, 0, 1, 0,
    ];
  }
}

/// Specular rim: bright top edge, faint bottom edge, hairline outline.
class _RimPainter extends CustomPainter {
  _RimPainter({required this.shape, required this.dark, required this.hc});
  final ShapeBorder shape;
  final bool dark;
  final bool hc;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final path = shape.getOuterPath(rect.deflate(0.25));
    final top = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = hc ? 1 : 0.75
      ..shader = ui.Gradient.linear(rect.topCenter, rect.bottomCenter, [
        Color(dark ? 0x40FFFFFF : 0xF2FFFFFF), // cf-ignore
        Color(dark ? 0x0FFFFFFF : 0x40FFFFFF), // cf-ignore
        Color(dark ? 0x14FFFFFF : 0x73FFFFFF), // cf-ignore
      ], [0, 0.5, 1]);
    canvas.drawPath(path, top);
    if (hc) {
      canvas.drawPath(
        path,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1
          ..color = Color(dark ? 0x59FFFFFF : 0x59000000), // cf-ignore
      );
    }
  }

  @override
  bool shouldRepaint(_RimPainter old) => old.dark != dark || old.hc != hc || old.shape != shape;
}

/// Soft blur and fade of content under bars (replaces solid bar backgrounds).
class CfScrollEdge extends StatelessWidget {
  const CfScrollEdge({super.key, this.top = true, this.height = 64});
  final bool top;
  final double height;
  @override
  Widget build(BuildContext context) {
    final bg = CupertinoTheme.of(context).scaffoldBackgroundColor;
    final safe = top ? MediaQuery.paddingOf(context).top : MediaQuery.paddingOf(context).bottom;
    return IgnorePointer(
      child: SizedBox(
        height: height + safe,
        child: ShaderMask(
          shaderCallback: (r) => LinearGradient(
            begin: top ? Alignment.topCenter : Alignment.bottomCenter,
            end: top ? Alignment.bottomCenter : Alignment.topCenter,
            colors: const [Color(0xFF000000), Color(0x00000000)], // cf-ignore mask
            stops: const [0.4, 1],
          ).createShader(r),
          blendMode: BlendMode.dstIn,
          child: ClipRect(
            child: BackdropFilter(
              filter: ui.ImageFilter.blur(sigmaX: 6, sigmaY: 6),
              child: ColoredBox(color: bg.withValues(alpha: 0.7)),
            ),
          ),
        ),
      ),
    );
  }
}

/// Re-export for convenience
typedef CfSquircleBorder = SquircleBorder;

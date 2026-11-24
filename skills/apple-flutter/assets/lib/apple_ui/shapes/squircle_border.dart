import 'dart:math' as math;
import 'package:flutter/widgets.dart';

/// Apple continuous corner (Figma corner smoothing 0.6). Use for every rounded rectangle.
/// Do NOT use RoundedRectangleBorder or ContinuousRectangleBorder for Apple shapes.
class SquircleBorder extends OutlinedBorder {
  const SquircleBorder({required this.radius, this.smoothing = 0.6, super.side});
  final double radius;
  final double smoothing;

  @override
  EdgeInsetsGeometry get dimensions => EdgeInsets.all(side.strokeInset);

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) => _path(rect.deflate(side.strokeInset));

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) => _path(rect);

  Path _path(Rect rect) {
    final w = rect.width, h = rect.height;
    final r = math.min(radius, math.min(w, h) / 2);
    final path = Path();
    if (r <= 0) return path..addRect(rect);
    final maxSide = math.min(w, h) / 2;
    var s = smoothing;
    var p = (1 + s) * r;
    if (p > maxSide) { s = math.min(s, maxSide / r - 1); p = math.min(p, maxSide); }
    double rad(double d) => d * math.pi / 180;
    final arcMeasure = 90 * (1 - s);
    final arcLen = math.sin(rad(arcMeasure / 2)) * r * math.sqrt2;
    final alpha = (90 - arcMeasure) / 2;
    final p3p4 = r * math.tan(rad(alpha / 2));
    final beta = 45 * s;
    final c = p3p4 * math.cos(rad(beta));
    final d = c * math.tan(rad(beta));
    var b = (p - arcLen - c - d) / 3;
    var a = 2 * b;
    if (s == 0) { a = 0; b = 0; }
    final x0 = rect.left, y0 = rect.top;
    path.moveTo(x0 + w - p, y0);
    path.relativeCubicTo(a, 0, a + b, 0, a + b + c, d);
    path.relativeArcToPoint(Offset(arcLen, arcLen), radius: Radius.circular(r));
    path.relativeCubicTo(d, c, d, b + c, d, a + b + c);
    path.lineTo(x0 + w, y0 + h - p);
    path.relativeCubicTo(0, a, 0, a + b, -d, a + b + c);
    path.relativeArcToPoint(Offset(-arcLen, arcLen), radius: Radius.circular(r));
    path.relativeCubicTo(-c, d, -(b + c), d, -(a + b + c), d);
    path.lineTo(x0 + p, y0 + h);
    path.relativeCubicTo(-a, 0, -(a + b), 0, -(a + b + c), -d);
    path.relativeArcToPoint(Offset(-arcLen, -arcLen), radius: Radius.circular(r));
    path.relativeCubicTo(-d, -c, -d, -(b + c), -d, -(a + b + c));
    path.lineTo(x0, y0 + p);
    path.relativeCubicTo(0, -a, 0, -(a + b), d, -(a + b + c));
    path.relativeArcToPoint(Offset(arcLen, -arcLen), radius: Radius.circular(r));
    path.relativeCubicTo(c, -d, b + c, -d, a + b + c, -d);
    path.close();
    return path;
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    if (side.style == BorderStyle.none || side.width == 0) return;
    canvas.drawPath(getOuterPath(rect).shift(Offset.zero), side.toPaint()..style = PaintingStyle.stroke);
  }

  @override
  ShapeBorder scale(double t) => SquircleBorder(radius: radius * t, smoothing: smoothing, side: side.scale(t));

  @override
  SquircleBorder copyWith({BorderSide? side, double? radius}) => SquircleBorder(radius: radius ?? this.radius, smoothing: smoothing, side: side ?? this.side);

  @override
  bool operator ==(Object other) => other is SquircleBorder && other.radius == radius && other.smoothing == smoothing && other.side == side;
  @override
  int get hashCode => Object.hash(radius, smoothing, side);
}

/// Convenience container with a squircle shape, color and clipping.
class CfSquircle extends StatelessWidget {
  const CfSquircle({super.key, required this.radius, this.color, this.padding, this.child, this.clip = true});
  final double radius;
  final Color? color;
  final EdgeInsetsGeometry? padding;
  final Widget? child;
  final bool clip;

  @override
  Widget build(BuildContext context) {
    final shape = SquircleBorder(radius: radius);
    final box = DecoratedBox(
      decoration: ShapeDecoration(shape: shape, color: color),
      child: Padding(padding: padding ?? EdgeInsets.zero, child: child),
    );
    return clip ? ClipPath(clipper: ShapeBorderClipper(shape: shape), child: box) : box;
  }
}

import 'package:flutter/cupertino.dart';

import '../feedback/cf_haptics.dart';
import '../glass/cf_glass.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

/// iOS 26/27 style slider: 6pt tall capsule fill3 track, accent range fill, and 38x24 white capsule thumb
/// that transforms into Liquid Glass and scales 1.15x while dragging.
class CfSlider extends StatefulWidget {
  const CfSlider({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.min = 0.0,
    this.max = 1.0,
    this.minIcon,
    this.maxIcon,
    this.enabled = true,
  });

  final double value;
  final ValueChanged<double>? onChanged;
  final String label;
  final double min;
  final double max;
  final Widget? minIcon;
  final Widget? maxIcon;
  final bool enabled;

  @override
  State<CfSlider> createState() => _CfSliderState();
}

class _CfSliderState extends State<CfSlider> {
  bool _dragging = false;
  double? _lastDetent;

  double get _norm {
    final span = widget.max - widget.min;
    if (span <= 0) return 0;
    return ((widget.value - widget.min) / span).clamp(0.0, 1.0);
  }

  void _updateFromLocalDx(double dx, double trackWidth) {
    if (!widget.enabled || widget.onChanged == null || trackWidth <= 0) return;
    final t = (dx / trackWidth).clamp(0.0, 1.0);
    final next = widget.min + t * (widget.max - widget.min);
    if ((next == widget.min || next == widget.max) && _lastDetent != next) {
      CfHaptics.light();
    }
    _lastDetent = next;
    widget.onChanged!(next);
  }

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    const knobW = 38.0;
    const knobH = 24.0;
    return Semantics(
      slider: true,
      enabled: widget.enabled,
      label: widget.label,
      value: '${(_norm * 100).round()}%',
      child: Opacity(
        opacity: widget.enabled ? 1.0 : 0.4,
        child: Row(children: [
          if (widget.minIcon != null) ...[widget.minIcon!, const SizedBox(width: AppleSpacing.md)],
          Expanded(
            child: LayoutBuilder(builder: (context, constraints) {
              final w = constraints.maxWidth;
              final usable = (w - knobW).clamp(0.0, double.infinity);
              final left = usable * _norm;
              final knob = SizedBox(width: knobW, height: knobH);
              final thumbWidget = _dragging
                  ? Transform.scale(scale: 1.15, child: CfGlass(child: knob))
                  : DecoratedBox(
                      decoration: const ShapeDecoration(
                        shape: StadiumBorder(),
                        color: Color(0xFFFFFFFF), // cf-ignore knob
                        shadows: [
                          BoxShadow(color: Color(0x26000000), blurRadius: 8, offset: Offset(0, 3)), // cf-ignore
                          BoxShadow(color: Color(0x0F000000), blurRadius: 1, offset: Offset(0, 3)), // cf-ignore
                        ],
                      ),
                      child: knob,
                    );

              return GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapDown: (d) => _updateFromLocalDx(d.localPosition.dx - knobW / 2, usable),
                onHorizontalDragStart: (d) {
                  if (!widget.enabled) return;
                  setState(() => _dragging = true);
                  _updateFromLocalDx(d.localPosition.dx - knobW / 2, usable);
                },
                onHorizontalDragUpdate: (d) => _updateFromLocalDx(d.localPosition.dx - knobW / 2, usable),
                onHorizontalDragEnd: (_) => setState(() => _dragging = false),
                onHorizontalDragCancel: () => setState(() => _dragging = false),
                child: SizedBox(
                  height: 44,
                  child: Stack(alignment: Alignment.centerLeft, children: [
                    Container(
                      height: 6,
                      width: w,
                      decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.fill3),
                      alignment: Alignment.centerLeft,
                      child: FractionallySizedBox(
                        widthFactor: _norm,
                        child: Container(
                          height: 6,
                          decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.accent),
                        ),
                      ),
                    ),
                    Positioned(left: left, child: thumbWidget),
                  ]),
                ),
              );
            }),
          ),
          if (widget.maxIcon != null) ...[const SizedBox(width: AppleSpacing.md), widget.maxIcon!],
        ]),
      ),
    );
  }
}

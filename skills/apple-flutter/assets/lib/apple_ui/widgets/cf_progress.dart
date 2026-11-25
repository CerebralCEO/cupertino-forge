import 'dart:async';
import 'package:flutter/cupertino.dart';

import '../motion/cf_motion.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

/// System style activity indicator. Waits [delay] (default 300ms per HIG/patterns) before appearing to prevent spinner flicker.
class CfActivityIndicator extends StatefulWidget {
  const CfActivityIndicator({super.key, this.radius = 10, this.delay = const Duration(milliseconds: 300)});
  final double radius;
  final Duration delay;

  @override
  State<CfActivityIndicator> createState() => _CfActivityIndicatorState();
}

class _CfActivityIndicatorState extends State<CfActivityIndicator> {
  Timer? _timer;
  late bool _visible = widget.delay == Duration.zero;

  @override
  void initState() {
    super.initState();
    if (!_visible) {
      _timer = Timer(widget.delay, () {
        if (mounted) setState(() => _visible = true);
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_visible) return SizedBox.square(dimension: widget.radius * 2);
    return Semantics(
      label: 'Loading',
      child: CupertinoActivityIndicator(radius: widget.radius, color: context.cf.label2),
    );
  }
}

/// 4pt tall capsule progress bar with AppleSprings.smooth animated fill.
class CfProgressBar extends StatefulWidget {
  const CfProgressBar({super.key, required this.value, required this.label});
  final double value; // 0.0 .. 1.0
  final String label;

  @override
  State<CfProgressBar> createState() => _CfProgressBarState();
}

class _CfProgressBarState extends State<CfProgressBar> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, value: widget.value.clamp(0.0, 1.0));

  @override
  void didUpdateWidget(CfProgressBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    final next = widget.value.clamp(0.0, 1.0);
    if (next != oldWidget.value.clamp(0.0, 1.0)) {
      animateSpring(_c, next, AppleSprings.smooth);
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    return Semantics(
      label: widget.label,
      value: '${(_c.value * 100).round()}%',
      child: SizedBox(
        height: 4,
        child: DecoratedBox(
          decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.fill3),
          child: AnimatedBuilder(
            animation: _c,
            builder: (context, _) => FractionallySizedBox(
              alignment: AlignmentDirectional.centerStart,
              widthFactor: _c.value.clamp(0.0, 1.0),
              child: DecoratedBox(
                decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.accent),
                child: const SizedBox.expand(),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

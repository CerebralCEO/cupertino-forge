import 'package:flutter/cupertino.dart';
import 'package:flutter/physics.dart';
import 'package:flutter/widgets.dart';

import '../theme/apple_tokens.dart';

/// Animate a controller to [target] with an Apple spring, keeping current velocity (interruptible).
TickerFuture animateSpring(AnimationController c, double target, SpringDescription spring) {
  if (WidgetsBinding.instance.platformDispatcher.accessibilityFeatures.disableAnimations) {
    return c.animateTo(target, duration: const Duration(milliseconds: 200));
  }
  return c.animateWith(SpringSimulation(spring, c.value, target, c.velocity));
}

/// Apple scroll physics: iOS bouncing everywhere, Apple deceleration (0.998 normal).
class CfScrollPhysics extends BouncingScrollPhysics {
  const CfScrollPhysics({super.parent}) : super(decelerationRate: ScrollDecelerationRate.normal);
  @override
  CfScrollPhysics applyTo(ScrollPhysics? ancestor) => CfScrollPhysics(parent: buildParent(ancestor));
}

/// Global scroll behavior: no Android glow or stretch, Apple physics, overlay scrollbars on desktop.
class CfScrollBehavior extends CupertinoScrollBehavior {
  const CfScrollBehavior();
  @override
  ScrollPhysics getScrollPhysics(BuildContext context) => const CfScrollPhysics(parent: AlwaysScrollableScrollPhysics());
  @override
  Widget buildOverscrollIndicator(BuildContext context, Widget child, ScrollableDetails details) => child;
}

/// Push route with Apple push spring and leading edge swipe back (CupertinoPageRoute behavior).
class CfPageRoute<T> extends CupertinoPageRoute<T> {
  CfPageRoute({required super.builder, super.settings, super.fullscreenDialog});
  @override
  Duration get transitionDuration => const Duration(milliseconds: 500);
}

enum CfPressStyle { glass, solid, plain, card, row }

/// Apple press feedback: instant on pointer down, spring release. No ripple.
class CfPressable extends StatefulWidget {
  const CfPressable({super.key, required this.child, this.onTap, this.onLongPress, this.style = CfPressStyle.solid, this.enabled = true});
  final Widget child;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final CfPressStyle style;
  final bool enabled;
  @override
  State<CfPressable> createState() => _CfPressableState();
}

class _CfPressableState extends State<CfPressable> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController.unbounded(vsync: this, value: 0);

  void _down(_) {
    if (!widget.enabled) return;
    animateSpring(_c, 1, AppleSprings.press);
  }

  void _up([_]) => animateSpring(_c, 0, AppleSprings.release);

  @override
  void dispose() { _c.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final fine = MediaQuery.of(context).navigationMode == NavigationMode.traditional;
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: _down,
      onTapUp: _up,
      onTapCancel: _up,
      onTap: widget.enabled ? widget.onTap : null,
      onLongPress: widget.onLongPress,
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, child) {
          final t = _c.value;
          switch (widget.style) {
            case CfPressStyle.glass:
              final s = 1 + (fine ? 0.02 : 0.1) * t;
              return Transform.scale(scale: s, child: child);
            case CfPressStyle.solid:
              return Transform.scale(scale: 1 - 0.03 * t, child: Opacity(opacity: 1 - 0.1 * t.clamp(0, 1), child: child));
            case CfPressStyle.card:
              return Transform.scale(scale: 1 - 0.02 * t, child: child);
            case CfPressStyle.plain:
              return Opacity(opacity: (1 - 0.65 * t).clamp(0.35, 1), child: child);
            case CfPressStyle.row:
              return child!; // rows paint their own highlight (CfListRow)
          }
        },
        child: widget.child,
      ),
    );
  }
}

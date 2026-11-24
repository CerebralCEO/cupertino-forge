import 'package:flutter/cupertino.dart';

import '../feedback/cf_haptics.dart';
import '../feedback/cf_sounds.dart';
import '../glass/cf_glass.dart';
import '../motion/cf_motion.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

/// iOS 26+ switch: 64x28 track, 38x24 pill knob that becomes glass and stretches 1.25x while pressed.
class CfToggle extends StatefulWidget {
  const CfToggle({super.key, required this.value, required this.onChanged, required this.label, this.green = false});
  final bool value;
  final ValueChanged<bool>? onChanged;
  final String label;
  final bool green;
  @override
  State<CfToggle> createState() => _CfToggleState();
}

class _CfToggleState extends State<CfToggle> with SingleTickerProviderStateMixin {
  late final AnimationController _pos = AnimationController.unbounded(vsync: this, value: widget.value ? 1 : 0);
  bool _pressed = false;

  @override
  void didUpdateWidget(CfToggle old) {
    super.didUpdateWidget(old);
    if (old.value != widget.value) animateSpring(_pos, widget.value ? 1 : 0, AppleSprings.snappy);
  }

  @override
  void dispose() { _pos.dispose(); super.dispose(); }

  void _toggle() {
    if (widget.onChanged == null) return;
    final v = !widget.value;
    widget.onChanged!(v);
    CfHaptics.toggle(v);
    CfSounds.play(v ? CfSound.toggleOn : CfSound.toggleOff);
  }

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    const w = AppleLayout.toggleWidth, h = AppleLayout.toggleHeight, kh = 24.0, inset = 2.0;
    final kw = _pressed ? 38 * 1.25 : 38.0;
    return Semantics(
      toggled: widget.value, label: widget.label, enabled: widget.onChanged != null,
      child: GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapUp: (_) { setState(() => _pressed = false); _toggle(); },
        onTapCancel: () => setState(() => _pressed = false),
        child: Opacity(
          opacity: widget.onChanged == null ? 0.4 : 1,
          child: AnimatedBuilder(
            animation: _pos,
            builder: (context, _) {
              final t = _pos.value;
              final track = Color.lerp(cf.fill, widget.green ? cf.green : cf.accent, t.clamp(0, 1))!;
              final x = inset + (w - kw - inset * 2) * t;
              final knob = SizedBox(width: kw, height: kh);
              return SizedBox(
                width: w, height: h,
                child: DecoratedBox(
                  decoration: ShapeDecoration(shape: const StadiumBorder(), color: track),
                  child: Stack(children: [
                    Positioned(
                      left: x, top: (h - kh) / 2,
                      child: _pressed
                          ? CfGlass(child: knob)
                          : DecoratedBox(
                              decoration: const ShapeDecoration(
                                shape: StadiumBorder(),
                                color: Color(0xFFFFFFFF), // cf-ignore knob
                                shadows: [BoxShadow(color: Color(0x26000000), blurRadius: 8, offset: Offset(0, 3)), BoxShadow(color: Color(0x0F000000), blurRadius: 1, offset: Offset(0, 3))], // cf-ignore elevation.knob
                              ),
                              child: knob,
                            ),
                    ),
                  ]),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

/// Segmented control: capsule fill track, raised selected capsule that slides with the snappy spring.
class CfSegmented<T> extends StatelessWidget {
  const CfSegmented({super.key, required this.options, required this.value, required this.onChanged});
  final Map<T, String> options;
  final T value;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final keys = options.keys.toList();
    final idx = keys.indexOf(value);
    final dark = CupertinoTheme.brightnessOf(context) == Brightness.dark;
    return LayoutBuilder(builder: (context, c) {
      final segW = (c.maxWidth - 4) / keys.length;
      return Container(
        height: 36,
        padding: const EdgeInsets.all(2),
        decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.fill3),
        child: Stack(children: [
          AnimatedPositioned(
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeOutBack, // cf-ignore approximates snappy spring for implicit animation
            left: segW * idx, top: 0, bottom: 0, width: segW,
            child: DecoratedBox(decoration: ShapeDecoration(shape: const StadiumBorder(), color: dark ? cf.gray3 : cf.bg, shadows: const [BoxShadow(color: Color(0x1F000000), blurRadius: 8, offset: Offset(0, 3))])), // cf-ignore
          ),
          Row(children: [
            for (final k in keys)
              Expanded(
                child: Semantics(
                  selected: k == value, button: true, label: options[k],
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () { if (k != value) { onChanged(k); CfHaptics.selection(); } },
                    child: Center(child: Text(options[k]!, style: k == value ? cf.type.subheadlineEmphasized : cf.type.subheadline)),
                  ),
                ),
              ),
          ]),
        ]),
      );
    });
  }
}

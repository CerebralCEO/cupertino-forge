import 'package:flutter/cupertino.dart';

import '../glass/cf_glass.dart';
import '../motion/cf_motion.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

enum CfButtonVariant { prominentGlass, glass, filled, tinted, gray, plain, destructive }
enum CfButtonSize { mini, small, medium, large, extraLarge }

/// Apple button. One prominent (prominentGlass or filled) per view.
class CfButton extends StatelessWidget {
  const CfButton({super.key, required this.label, this.onPressed, this.variant = CfButtonVariant.gray, this.size = CfButtonSize.medium, this.icon, this.loading = false, this.fullWidth = false});
  final String label;
  final VoidCallback? onPressed;
  final CfButtonVariant variant;
  final CfButtonSize size;
  final IconData? icon;
  final bool loading;
  final bool fullWidth;

  double get _h => switch (size) {
        CfButtonSize.mini => 28,
        CfButtonSize.small => AppleLayout.buttonSmall,
        CfButtonSize.medium => AppleLayout.buttonMedium,
        CfButtonSize.large => AppleLayout.buttonLarge,
        CfButtonSize.extraLarge => 56,
      };

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final enabled = onPressed != null && !loading;
    final textStyle = size.index <= CfButtonSize.small.index ? cf.type.subheadlineEmphasized : cf.type.bodyEmphasized;
    final (Color? bg, Color fg) = switch (variant) {
      CfButtonVariant.filled => (cf.accent, const Color(0xFFFFFFFF)), // cf-ignore label on accent
      CfButtonVariant.tinted => (cf.accent.withValues(alpha: 0.15), cf.accent),
      CfButtonVariant.gray => (cf.fill3, cf.label),
      CfButtonVariant.plain => (null, cf.accent),
      CfButtonVariant.destructive => (null, cf.red),
      CfButtonVariant.glass => (null, cf.labelGlass),
      CfButtonVariant.prominentGlass => (null, const Color(0xFFFFFFFF)), // cf-ignore
    };
    final content = Row(
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (loading) const Padding(padding: EdgeInsets.only(right: 8), child: CupertinoActivityIndicator(radius: 8))
        else if (icon != null) Padding(padding: const EdgeInsets.only(right: 6), child: Icon(icon, size: textStyle.fontSize! * 1.05, color: fg)),
        Flexible(child: Text(label, style: textStyle.copyWith(color: fg), overflow: TextOverflow.ellipsis)),
      ],
    );
    final padH = switch (size) { CfButtonSize.mini => 10.0, CfButtonSize.small => 12.0, CfButtonSize.medium => 14.0, _ => 20.0 };
    final sized = SizedBox(height: _h, width: fullWidth ? double.infinity : null, child: Padding(padding: EdgeInsets.symmetric(horizontal: variant == CfButtonVariant.plain || variant == CfButtonVariant.destructive ? 0 : padH), child: content));

    Widget w;
    if (variant == CfButtonVariant.glass || variant == CfButtonVariant.prominentGlass) {
      w = CfGlass(variant: variant == CfButtonVariant.prominentGlass ? CfGlassVariant.tinted : CfGlassVariant.regular, pressable: true, onTap: enabled ? onPressed : null, child: sized);
    } else {
      w = CfPressable(
        style: bg == null ? CfPressStyle.plain : CfPressStyle.solid,
        onTap: enabled ? onPressed : null,
        child: DecoratedBox(decoration: ShapeDecoration(shape: const StadiumBorder(), color: bg), child: sized),
      );
    }
    return Semantics(button: true, enabled: enabled, label: label, child: Opacity(opacity: enabled || loading ? 1 : 0.4, child: ConstrainedBox(constraints: const BoxConstraints(minHeight: 44, minWidth: 44), child: Center(widthFactor: 1, heightFactor: 1, child: w))));
  }
}

/// 44 glass circle icon button (bar buttons, close, more).
class CfIconButton extends StatelessWidget {
  const CfIconButton({super.key, required this.icon, required this.label, this.onPressed, this.prominent = false, this.size = 44});
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final bool prominent;
  final double size;

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    return Semantics(
      button: true,
      label: label,
      child: CfGlass(
        shape: const CircleBorder(),
        variant: prominent ? CfGlassVariant.tinted : CfGlassVariant.regular,
        pressable: true,
        onTap: onPressed,
        child: SizedBox.square(dimension: size, child: Icon(icon, size: 19, color: prominent ? const Color(0xFFFFFFFF) : cf.labelGlass)), // cf-ignore
      ),
    );
  }
}

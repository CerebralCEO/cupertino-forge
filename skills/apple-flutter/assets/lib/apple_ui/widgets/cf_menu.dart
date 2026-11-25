import 'package:flutter/cupertino.dart';

import '../feedback/cf_haptics.dart';
import '../glass/cf_glass.dart';
import '../shapes/squircle_border.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

class CfMenuItem {
  const CfMenuItem({
    required this.label,
    this.icon,
    this.isDestructive = false,
    this.checked = false,
    this.onSelected,
  });

  final String label;
  final IconData? icon;
  final bool isDestructive;
  final bool checked;
  final VoidCallback? onSelected;
}

/// iOS 27 pull-down glass menu (250pt wide, 44pt rows with trailing icon, destructive red last).
Future<void> showCfMenu(
  BuildContext context, {
  required List<CfMenuItem> items,
  Alignment alignment = Alignment.center,
}) {
  return showCupertinoDialog<void>(
    context: context,
    barrierDismissible: true,
    builder: (ctx) => CfElevated(
      child: Builder(builder: (ctx) {
        final cf = ctx.cf;
        return Align(
          alignment: alignment,
          child: Padding(
            padding: const EdgeInsets.all(AppleSpacing.lg),
            child: SizedBox(
              width: 250,
              child: CfGlass(
                variant: CfGlassVariant.large,
                shape: const SquircleBorder(radius: AppleRadiusIOS.menu),
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    for (var i = 0; i < items.length; i++) ...[
                      if (i > 0) Container(height: 0.5, color: cf.separator),
                      _MenuRow(
                        item: items[i],
                        onTap: () {
                          Navigator.of(ctx).pop();
                          CfHaptics.selection();
                          items[i].onSelected?.call();
                        },
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    ),
  );
}

class _MenuRow extends StatelessWidget {
  const _MenuRow({required this.item, required this.onTap});
  final CfMenuItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final fg = item.isDestructive ? cf.red : cf.label;
    return Semantics(
      button: true,
      label: item.label,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: SizedBox(
          height: 44,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppleSpacing.lg),
            child: Row(children: [
              if (item.checked) ...[
                Icon(CupertinoIcons.checkmark_alt, size: 17, color: fg),
                const SizedBox(width: AppleSpacing.sm),
              ],
              Expanded(
                child: Text(item.label, style: cf.type.body.copyWith(color: fg), maxLines: 1, overflow: TextOverflow.ellipsis),
              ),
              if (item.icon != null) Icon(item.icon, size: 19, color: fg),
            ]),
          ),
        ),
      ),
    );
  }
}

/// Anchored glass popover (large glass, radius 26, max 1 open at a time).
Future<T?> showCfPopover<T>(
  BuildContext context, {
  required WidgetBuilder builder,
  double width = 280,
  Alignment alignment = Alignment.center,
}) {
  return showCupertinoDialog<T>(
    context: context,
    barrierDismissible: true,
    builder: (ctx) => CfElevated(
      child: Align(
        alignment: alignment,
        child: Padding(
          padding: const EdgeInsets.all(AppleSpacing.lg),
          child: SizedBox(
            width: width,
            child: CfGlass(
              variant: CfGlassVariant.large,
              shape: const SquircleBorder(radius: AppleRadiusIOS.popover),
              padding: const EdgeInsets.all(AppleSpacing.lg),
              child: builder(ctx),
            ),
          ),
        ),
      ),
    ),
  );
}

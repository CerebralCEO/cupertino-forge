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

/// iOS 27 pull-down glass menu (238pt wide, pad 10v/16h, 40pt capsule rows, destructive red last).
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
              width: AppleLayout.iosMenuWidth,
              child: CfGlass(
                variant: CfGlassVariant.large,
                shape: const SquircleBorder(radius: AppleRadiusIOS.menu),
                padding: const EdgeInsets.symmetric(
                  vertical: AppleLayout.iosMenuPadY,
                  horizontal: AppleLayout.iosMenuPadX,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    for (var i = 0; i < items.length; i++) ...[
                      if (i > 0)
                        Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppleLayout.iosMenuSeparatorInset,
                            vertical: (AppleLayout.iosMenuSeparatorHeight - 1) / 2,
                          ),
                          child: Container(height: 1, color: cf.separator),
                        ),
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
        child: DecoratedBox(
          decoration: const ShapeDecoration(shape: StadiumBorder()),
          child: SizedBox(
            height: AppleLayout.iosMenuRowHeight,
            child: Padding(
              padding: const EdgeInsets.only(
                left: AppleLayout.iosMenuRowPadLeading,
                right: AppleLayout.iosMenuRowPadTrailing,
              ),
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

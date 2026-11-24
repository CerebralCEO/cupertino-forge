import 'dart:math' as math;
import 'package:flutter/cupertino.dart';

import '../feedback/cf_haptics.dart';
import '../glass/cf_glass.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

class CfTabItem {
  const CfTabItem({required this.label, required this.icon, this.iconSelected});
  final String label;
  final IconData icon;
  final IconData? iconSelected; // filled variant, e.g. CupertinoIcons.house_fill
}

/// iOS 27 floating Liquid Glass tab bar with a sliding selection capsule.
/// Set [minimized] from a scroll listener (scrolling down) to collapse to the selected tab.
class CfTabBar extends StatelessWidget {
  const CfTabBar({super.key, required this.items, required this.index, required this.onChanged, this.minimized = false, this.onSearch});
  final List<CfTabItem> items;
  final int index;
  final ValueChanged<int> onChanged;
  final bool minimized;
  final VoidCallback? onSearch;

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final bottom = MediaQuery.paddingOf(context).bottom;
    final shown = minimized ? [index] : List.generate(items.length, (i) => i);
    return Padding(
      padding: EdgeInsets.fromLTRB(AppleLayout.tabBarSideInset, 0, AppleLayout.tabBarSideInset, bottom > 0 ? bottom : 12),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        AnimatedSize(
          duration: const Duration(milliseconds: 450),
          curve: const _SpringCurve(),
          child: CfGlass(
            padding: const EdgeInsets.all(4),
            child: SizedBox(
              height: AppleLayout.tabBarHeight - 8,
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                for (final i in shown)
                  Semantics(
                    selected: i == index, button: true, label: items[i].label,
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () { if (i != index) { onChanged(i); CfHaptics.selection(); } },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 350),
                        curve: const _SpringCurve(),
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        constraints: const BoxConstraints(minWidth: 56),
                        decoration: ShapeDecoration(shape: const StadiumBorder(), color: i == index && !minimized ? cf.fill3 : const Color(0x00000000)), // cf-ignore transparent
                        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Icon(i == index ? (items[i].iconSelected ?? items[i].icon) : items[i].icon, size: 24, color: i == index ? cf.accent : cf.labelGlass),
                          if (!minimized) Text(items[i].label, style: cf.type.caption2Emphasized.copyWith(color: i == index ? cf.accent : cf.labelGlass)),
                        ]),
                      ),
                    ),
                  ),
              ]),
            ),
          ),
        ),
        if (onSearch != null) ...[
          const SizedBox(width: AppleSpacing.sm),
          CfGlass(
            shape: const CircleBorder(), pressable: true, onTap: onSearch,
            child: SizedBox.square(dimension: AppleLayout.tabBarHeight, child: Icon(CupertinoIcons.search, size: 22, color: cf.labelGlass)),
          ),
        ],
      ]),
    );
  }
}

/// Curve that approximates AppleSprings.glassMorph for implicit animations (AnimatedSize, AnimatedContainer).
class _SpringCurve extends Curve {
  const _SpringCurve();
  @override
  double transformInternal(double t) {
    // critically damped with slight overshoot (bounce about 0.15)
    const zeta = 0.8, w = 12.0;
    final wd = w * 0.6;
    return 1 - (math.exp(-zeta * w * t) * (math.cos(wd * t) + (zeta * w / wd) * math.sin(wd * t)));
  }
}

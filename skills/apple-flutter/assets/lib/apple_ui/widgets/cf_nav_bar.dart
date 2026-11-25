import 'package:flutter/cupertino.dart';

import '../glass/cf_glass.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';
import 'cf_button.dart';

/// Screen scaffold with an iOS 27 navigation bar: transparent bar, glass buttons, large title that
/// collapses into the inline title, scroll edge effect. Put content slivers in [slivers].
/// Uses a ValueNotifier so scroll offset updates only the two title opacities without rebuilding slivers.
class CfLargeTitleScaffold extends StatefulWidget {
  const CfLargeTitleScaffold({super.key, required this.title, required this.slivers, this.onBack, this.backLabel = 'Back', this.trailing, this.background, this.bottom});
  final String title;
  final List<Widget> slivers;
  final VoidCallback? onBack;
  final String backLabel;
  final Widget? trailing; // CfBarButtonGroup or a prominent CfIconButton
  final Color? background;
  final Widget? bottom; // CfTabBar or toolbar, floats above content

  @override
  State<CfLargeTitleScaffold> createState() => _CfLargeTitleScaffoldState();
}

class _CfLargeTitleScaffoldState extends State<CfLargeTitleScaffold> {
  final _scroll = ScrollController();
  final ValueNotifier<double> _offset = ValueNotifier<double>(0);

  void _onScroll() {
    if (_scroll.hasClients) _offset.value = _scroll.offset;
  }

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scroll.removeListener(_onScroll);
    _scroll.dispose();
    _offset.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final top = MediaQuery.paddingOf(context).top;
    return CupertinoPageScaffold(
      backgroundColor: widget.background ?? cf.bgGrouped,
      child: Stack(children: [
        CustomScrollView(controller: _scroll, slivers: [
          SliverToBoxAdapter(child: SizedBox(height: top + AppleLayout.navBarHeight)),
          SliverToBoxAdapter(
            child: ValueListenableBuilder<double>(
              valueListenable: _offset,
              builder: (context, offset, child) => Opacity(
                opacity: (1 - offset / 28).clamp(0.0, 1.0),
                child: child,
              ),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(AppleSpacing.lg, 0, AppleSpacing.lg, AppleSpacing.sm),
                child: Text(widget.title, style: cf.type.largeTitleEmphasized),
              ),
            ),
          ),
          ...widget.slivers,
          SliverToBoxAdapter(child: SizedBox(height: widget.bottom != null ? AppleLayout.tabBarHeight + 40 + MediaQuery.paddingOf(context).bottom : 32)),
        ]),
        const Positioned(top: 0, left: 0, right: 0, child: CfScrollEdge(top: true)),
        Positioned(
          top: top, left: 0, right: 0, height: AppleLayout.navBarHeight,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppleSpacing.lg),
            child: Row(children: [
              if (widget.onBack != null) CfIconButton(icon: CupertinoIcons.chevron_back, label: widget.backLabel, onPressed: widget.onBack),
              Expanded(
                child: ValueListenableBuilder<double>(
                  valueListenable: _offset,
                  builder: (context, offset, child) => Opacity(
                    opacity: ((offset - 28) / 16).clamp(0.0, 1.0),
                    child: child,
                  ),
                  child: Text(widget.title, textAlign: TextAlign.center, style: cf.type.headline, overflow: TextOverflow.ellipsis),
                ),
              ),
              if (widget.trailing != null) widget.trailing! else const SizedBox(width: 44),
            ]),
          ),
        ),
        if (widget.bottom != null) Positioned(left: 0, right: 0, bottom: 0, child: widget.bottom!),
      ]),
    );
  }
}

/// Groups 2 or 3 icon actions into one glass capsule.
class CfBarButtonGroup extends StatelessWidget {
  const CfBarButtonGroup({super.key, required this.items});
  final List<({IconData icon, String label, VoidCallback onPressed})> items;
  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    return CfGlass(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        for (final it in items)
          Semantics(
            button: true, label: it.label,
            child: CupertinoButton(padding: EdgeInsets.zero, minimumSize: const Size(44, 44), onPressed: it.onPressed, child: Icon(it.icon, size: 19, color: cf.labelGlass)),
          ),
      ]),
    );
  }
}

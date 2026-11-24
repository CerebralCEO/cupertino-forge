import 'package:flutter/cupertino.dart';

import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';
import '../shapes/squircle_border.dart';

enum CfListStyle { insetGrouped, plain }

/// Sliver list of sections. Use inside CfLargeTitleScaffold.slivers.
class CfList extends StatelessWidget {
  const CfList({super.key, required this.sections, this.style = CfListStyle.insetGrouped});
  final List<CfListSection> sections;
  final CfListStyle style;
  @override
  Widget build(BuildContext context) => SliverList.separated(
        itemCount: sections.length,
        separatorBuilder: (_, __) => const SizedBox(height: AppleSpacing.xl),
        itemBuilder: (context, i) => _SectionView(section: sections[i], style: style),
      );
}

class CfListSection {
  const CfListSection({required this.rows, this.header, this.footer});
  final List<CfListRow> rows;
  final String? header;
  final String? footer;
}

class _SectionView extends StatelessWidget {
  const _SectionView({required this.section, required this.style});
  final CfListSection section;
  final CfListStyle style;
  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final inset = style == CfListStyle.insetGrouped;
    final rows = Column(children: [
      for (var i = 0; i < section.rows.length; i++) _RowWithSeparator(row: section.rows[i], last: i == section.rows.length - 1),
    ]);
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: inset ? AppleSpacing.lg : 0),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (section.header != null) Padding(padding: const EdgeInsets.fromLTRB(AppleSpacing.lg, 0, AppleSpacing.lg, AppleSpacing.sm), child: Text(section.header!, style: cf.type.headline)),
        inset ? CfSquircle(radius: AppleRadiusIOS.listSectionInsetGrouped, color: cf.bgGrouped2, child: rows) : ColoredBox(color: cf.bg, child: rows),
        if (section.footer != null) Padding(padding: const EdgeInsets.fromLTRB(AppleSpacing.lg * 2, AppleSpacing.sm, AppleSpacing.lg * 2, 0), child: Text(section.footer!, style: cf.type.footnote.copyWith(color: cf.label2))),
      ]),
    );
  }
}

class _RowWithSeparator extends StatelessWidget {
  const _RowWithSeparator({required this.row, required this.last});
  final CfListRow row;
  final bool last;
  @override
  Widget build(BuildContext context) => Stack(children: [
        row,
        if (!last) Positioned(left: row.leading != null ? 57 : 16, right: 0, bottom: 0, child: Container(height: 0.5, color: context.cf.separator)),
      ]);
}

enum CfAccessory { none, chevron, checkmark }

/// List row: instant press highlight, fades 250ms after release.
class CfListRow extends StatefulWidget {
  const CfListRow({super.key, required this.title, this.subtitle, this.value, this.leading, this.accessory = CfAccessory.none, this.trailing, this.onTap, this.destructive = false});
  final String title;
  final String? subtitle;
  final String? value;
  final Widget? leading;
  final CfAccessory accessory;
  final Widget? trailing; // e.g. CfToggle
  final VoidCallback? onTap;
  final bool destructive;
  @override
  State<CfListRow> createState() => _CfListRowState();
}

class _CfListRowState extends State<CfListRow> {
  bool _down = false;
  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final tappable = widget.onTap != null;
    final titleColor = widget.destructive ? cf.red : (tappable && widget.accessory == CfAccessory.none && widget.value == null && widget.trailing == null ? cf.accent : cf.label);
    return Semantics(
      button: tappable,
      label: [widget.title, widget.value, widget.subtitle].whereType<String>().join(', '),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: tappable ? (_) => setState(() => _down = true) : null,
        onTapUp: tappable ? (_) => setState(() => _down = false) : null,
        onTapCancel: () => setState(() => _down = false),
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: _down ? Duration.zero : const Duration(milliseconds: 250),
          color: _down ? cf.fill4 : const Color(0x00000000), // cf-ignore transparent
          constraints: BoxConstraints(minHeight: widget.subtitle != null ? 64 : AppleLayout.listRowMinHeight),
          padding: const EdgeInsets.symmetric(horizontal: AppleSpacing.lg, vertical: 10),
          child: Row(children: [
            if (widget.leading != null) ...[widget.leading!, const SizedBox(width: AppleSpacing.md)],
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                Text(widget.title, style: cf.type.body.copyWith(color: titleColor), maxLines: 1, overflow: TextOverflow.ellipsis),
                if (widget.subtitle != null) Text(widget.subtitle!, style: cf.type.subheadline.copyWith(color: cf.label2), maxLines: 1, overflow: TextOverflow.ellipsis),
              ]),
            ),
            if (widget.value != null) Padding(padding: const EdgeInsets.only(left: 8), child: Text(widget.value!, style: cf.type.body.copyWith(color: cf.label2))),
            if (widget.trailing != null) Padding(padding: const EdgeInsets.only(left: 8), child: widget.trailing!),
            if (widget.accessory == CfAccessory.chevron) Padding(padding: const EdgeInsets.only(left: 8), child: Icon(CupertinoIcons.chevron_forward, size: 17, color: cf.label3)),
            if (widget.accessory == CfAccessory.checkmark) Padding(padding: const EdgeInsets.only(left: 8), child: Icon(CupertinoIcons.checkmark_alt, size: 20, color: cf.accent)),
          ]),
        ),
      ),
    );
  }
}

/// Settings style 29pt squircle icon, white glyph on a system color. Settings screens only.
class CfSettingsIcon extends StatelessWidget {
  const CfSettingsIcon({super.key, required this.icon, required this.color});
  final IconData icon;
  final Color color; // pass context.cf.blue etc.
  @override
  Widget build(BuildContext context) => CfSquircle(
        radius: AppleRadiusIOS.settingsIcon,
        color: color,
        child: SizedBox.square(dimension: 29, child: Icon(icon, size: 18, color: const Color(0xFFFFFFFF))), // cf-ignore
      );
}

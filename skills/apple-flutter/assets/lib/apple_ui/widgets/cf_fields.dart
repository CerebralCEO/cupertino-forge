import 'package:flutter/cupertino.dart';

import '../glass/cf_glass.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

/// iOS/macOS text field: 44pt+ standalone field (fixed 26pt radius auto-clamping to capsule <=52pt, fill3) with clear button & red error footnote,
/// or borderless inList variant inside grouped settings rows.
class CfTextField extends StatefulWidget {
  const CfTextField({
    super.key,
    this.controller,
    this.label,
    this.placeholder,
    this.error,
    this.clearable = true,
    this.inList = false,
    this.obscureText = false,
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.onChanged,
    this.onSubmitted,
    this.enabled = true,
  });

  final TextEditingController? controller;
  final String? label;
  final String? placeholder;
  final String? error;
  final bool clearable;
  final bool inList;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final bool enabled;

  @override
  State<CfTextField> createState() => _CfTextFieldState();
}

class _CfTextFieldState extends State<CfTextField> {
  TextEditingController? _owned;
  TextEditingController get _ctrl => widget.controller ?? (_owned ??= TextEditingController());

  void _sync() {
    if (mounted) setState(() {});
  }

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(_sync);
  }

  @override
  void didUpdateWidget(CfTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _owned)?.removeListener(_sync);
      _ctrl.addListener(_sync);
    }
  }

  @override
  void dispose() {
    _ctrl.removeListener(_sync);
    _owned?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final showClear = widget.clearable && widget.enabled && _ctrl.text.isNotEmpty;
    final field = CupertinoTextField.borderless(
      controller: _ctrl,
      enabled: widget.enabled,
      obscureText: widget.obscureText,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      autofillHints: widget.autofillHints,
      placeholder: widget.placeholder ?? widget.label,
      placeholderStyle: cf.type.body.copyWith(color: cf.placeholder),
      style: cf.type.body.copyWith(color: widget.enabled ? cf.label : cf.label3),
      padding: EdgeInsets.symmetric(
        horizontal: widget.inList ? AppleSpacing.lg : 0,
        vertical: 11,
      ),
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
      suffix: showClear
          ? Semantics(
              button: true,
              label: 'Clear text',
              child: GestureDetector(
                onTap: () {
                  _ctrl.clear();
                  widget.onChanged?.call('');
                },
                child: Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: Icon(CupertinoIcons.clear_circled_solid, size: 17, color: cf.label3),
                ),
              ),
            )
          : null,
    );

    final box = widget.inList
        ? ConstrainedBox(constraints: const BoxConstraints(minHeight: AppleLayout.listRowMinHeight), child: field)
        : DecoratedBox(
            decoration: ShapeDecoration(
              // cf-ignore: fixed 26pt radius auto-clamps to capsule at height <= 52 and stays 26pt on multi-line (104pt)
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppleRadiusIOS.textFieldRounded)),
              color: cf.fill3,
            ),
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 44),
              child: Padding(
                padding: const EdgeInsets.only(left: AppleSpacing.lg, right: 4),
                child: field,
              ),
            ),
          );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Semantics(
          textField: true,
          label: widget.label ?? widget.placeholder,
          child: box,
        ),
        if (widget.error != null)
          Padding(
            padding: const EdgeInsets.only(left: AppleSpacing.lg, right: AppleSpacing.lg, top: AppleSpacing.xs),
            child: Text(widget.error!, style: cf.type.footnote.copyWith(color: cf.red)),
          ),
      ],
    );
  }
}

/// Capsule search field (44pt). Use [glass] = true for iOS floating bottom search; fill3 for inline search.
class CfSearchField extends StatefulWidget {
  const CfSearchField({
    super.key,
    required this.value,
    required this.onChanged,
    this.placeholder = 'Search',
    this.onCancel,
    this.glass = false,
  });

  final String value;
  final ValueChanged<String> onChanged;
  final String placeholder;
  final VoidCallback? onCancel;
  final bool glass;

  @override
  State<CfSearchField> createState() => _CfSearchFieldState();
}

class _CfSearchFieldState extends State<CfSearchField> {
  late final TextEditingController _ctrl = TextEditingController(text: widget.value);
  final FocusNode _focus = FocusNode();
  bool _focused = false;

  void _onFocus() {
    if (mounted) setState(() => _focused = _focus.hasFocus);
  }

  @override
  void initState() {
    super.initState();
    _focus.addListener(_onFocus);
  }

  @override
  void didUpdateWidget(CfSearchField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != _ctrl.text) {
      _ctrl.value = TextEditingValue(
        text: widget.value,
        selection: TextSelection.collapsed(offset: widget.value.length),
      );
    }
  }

  @override
  void dispose() {
    _focus.removeListener(_onFocus);
    _focus.dispose();
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    final inner = SizedBox(
      height: 44,
      child: Row(children: [
        const SizedBox(width: 14),
        Icon(CupertinoIcons.search, size: 18, color: cf.label2),
        const SizedBox(width: AppleSpacing.sm),
        Expanded(
          child: CupertinoTextField.borderless(
            controller: _ctrl,
            focusNode: _focus,
            placeholder: widget.placeholder,
            placeholderStyle: cf.type.body.copyWith(color: cf.placeholder),
            style: cf.type.body,
            textInputAction: TextInputAction.search,
            onChanged: widget.onChanged,
          ),
        ),
        if (widget.value.isNotEmpty)
          Semantics(
            button: true,
            label: 'Clear search',
            child: GestureDetector(
              onTap: () {
                _ctrl.clear();
                widget.onChanged('');
              },
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Icon(CupertinoIcons.clear_circled_solid, size: 17, color: cf.label3),
              ),
            ),
          ),
      ]),
    );

    final field = widget.glass
        ? CfGlass(child: inner)
        : DecoratedBox(
            decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.fill3),
            child: inner,
          );

    return Row(children: [
      Expanded(child: field),
      if (widget.onCancel != null && _focused) ...[
        const SizedBox(width: AppleSpacing.md),
        CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: () {
            _focus.unfocus();
            widget.onCancel!();
          },
          child: Text('Cancel', style: cf.type.body.copyWith(color: cf.accent)),
        ),
      ],
    ]);
  }
}

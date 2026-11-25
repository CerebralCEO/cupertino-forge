import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';

import '../cf_app.dart';
import 'apple_tokens.dart';

/// Marks a presented surface (sheet, popover, alert) so dark mode uses elevated backgrounds.
class CfElevated extends InheritedWidget {
  const CfElevated({super.key, required super.child});
  static bool of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<CfElevated>() != null;
  @override
  bool updateShouldNotify(CfElevated oldWidget) => false;
}

/// Resolved semantic colors and text styles for the current context.
class CfColors {
  CfColors._(this.context);
  final BuildContext context;

  Brightness get _b => CupertinoTheme.brightnessOf(context);
  bool get _hc => MediaQuery.highContrastOf(context);
  bool get _el => CfElevated.of(context);
  CfScope? get _scope => CfScope.maybeOf(context);
  bool get isMac => _scope?.isMacStyle(context) ?? false;
  Color _r(CfColor c) => c.resolve(_b, highContrast: _hc, elevated: _el);

  // Accent and system colors
  Color get accent => _r(_scope?.accent ?? AppleSystemColors.blue);
  Color get red => _r(AppleSystemColors.red);
  Color get orange => _r(AppleSystemColors.orange);
  Color get yellow => _r(AppleSystemColors.yellow);
  Color get green => _r(AppleSystemColors.green);
  Color get mint => _r(AppleSystemColors.mint);
  Color get teal => _r(AppleSystemColors.teal);
  Color get cyan => _r(AppleSystemColors.cyan);
  Color get blue => _r(AppleSystemColors.blue);
  Color get indigo => _r(AppleSystemColors.indigo);
  Color get purple => _r(AppleSystemColors.purple);
  Color get pink => _r(AppleSystemColors.pink);
  Color get brown => _r(AppleSystemColors.brown);
  Color get scrim => _r(AppleSystemColors.scrim);

  // Semantic, platform dependent
  Color get label => isMac ? _r(AppleMacOSColors.label) : _r(AppleIOSColors.label);
  Color get label2 => isMac ? _r(AppleMacOSColors.label2) : _r(AppleIOSColors.label2);
  Color get label3 => isMac ? _r(AppleMacOSColors.label3) : _r(AppleIOSColors.label3);
  Color get label4 => isMac ? _r(AppleMacOSColors.label4) : _r(AppleIOSColors.label4);
  Color get labelGlass => isMac ? _r(AppleMacOSColors.labelGlass) : _r(AppleIOSColors.labelGlass);
  Color get placeholder => isMac ? _r(AppleMacOSColors.placeholder) : _r(AppleIOSColors.placeholder);
  Color get fill => isMac ? _r(AppleMacOSColors.fill) : _r(AppleIOSColors.fill);
  Color get fill2 => isMac ? _r(AppleMacOSColors.fill2) : _r(AppleIOSColors.fill2);
  Color get fill3 => isMac ? _r(AppleMacOSColors.fill3) : _r(AppleIOSColors.fill3);
  Color get fill4 => isMac ? _r(AppleMacOSColors.fill4) : _r(AppleIOSColors.fill4);
  Color get bg => isMac ? _r(AppleMacOSColors.bg) : _r(AppleIOSColors.bg);
  Color get bg2 => isMac ? _r(AppleMacOSColors.bg2) : _r(AppleIOSColors.bg2);
  Color get bg3 => isMac ? _r(AppleMacOSColors.bg3) : _r(AppleIOSColors.bg3);
  Color get bgGrouped => isMac ? _r(AppleMacOSColors.bgGrouped) : _r(AppleIOSColors.bgGrouped);
  Color get bgGrouped2 => isMac ? _r(AppleMacOSColors.bgGrouped2) : _r(AppleIOSColors.bgGrouped2);
  Color get separator => isMac ? _r(AppleMacOSColors.separator) : _r(AppleIOSColors.separator);
  Color get control => isMac ? _r(AppleMacOSColors.control) : _r(AppleIOSColors.control);
  Color get controlPressed => isMac ? _r(AppleMacOSColors.controlPressed) : _r(AppleIOSColors.controlPressed);
  Color get gray2 => _r(AppleIOSColors.gray2);
  Color get gray3 => _r(AppleIOSColors.gray3);

  CfType get type => CfType.forPlatform(context, _b, _hc);
}

/// Text styles with tracking, leading, bold text, and script protection applied.
/// Font sizes remain unscaled here so Flutter's Text applies MediaQuery.textScaler once (no double scaling).
class CfType {
  CfType._(this._isMac, this._bold, this._color, this._family, this._nonLatinScript);
  final bool _isMac;
  final bool _bold;
  final Color _color;
  final String? _family;
  final bool _nonLatinScript;

  static CfType forPlatform(BuildContext context, Brightness b, bool hc) {
    final scope = CfScope.maybeOf(context);
    final mac = scope?.isMacStyle(context) ?? false;
    final apple = defaultTargetPlatform == TargetPlatform.iOS || defaultTargetPlatform == TargetPlatform.macOS;
    final lang = Localizations.maybeLocaleOf(context)?.languageCode;
    final nonLatin = lang == 'bn' || lang == 'ar' || lang == 'he';
    return CfType._(
      mac,
      MediaQuery.boldTextOf(context),
      (mac ? AppleMacOSColors.label : AppleIOSColors.label).resolve(b, highContrast: hc),
      apple ? null : 'Inter', // real SF on Apple platforms, Inter elsewhere
      nonLatin,
    );
  }

  TextStyle _s(TextStyle s) {
    var out = s.copyWith(color: _color, fontFamily: _family);
    if (_nonLatinScript) {
      out = out.copyWith(letterSpacing: 0);
    } else if (_family == 'Inter') {
      out = out.copyWith(
        letterSpacing: (out.letterSpacing ?? 0) - 0.01 * out.fontSize!,
        fontFeatures: const [FontFeature.enable('cv11'), FontFeature.enable('ss01'), FontFeature.enable('ss03')],
      );
    }
    final w = out.fontWeight ?? FontWeight.w400;
    if (_bold && w.value < FontWeight.w600.value) {
      final idx = FontWeight.values.indexOf(w);
      out = out.copyWith(fontWeight: FontWeight.values[(idx + 2).clamp(0, 8)]);
    }
    return out;
  }

  TextStyle get largeTitle => _s(_isMac ? AppleTypeMacOS.largeTitle : AppleTypeIOS.largeTitle);
  TextStyle get largeTitleEmphasized => _s(_isMac ? AppleTypeMacOS.largeTitleEmphasized : AppleTypeIOS.largeTitleEmphasized);
  TextStyle get title1 => _s(_isMac ? AppleTypeMacOS.title1 : AppleTypeIOS.title1);
  TextStyle get title1Emphasized => _s(_isMac ? AppleTypeMacOS.title1Emphasized : AppleTypeIOS.title1Emphasized);
  TextStyle get title2 => _s(_isMac ? AppleTypeMacOS.title2 : AppleTypeIOS.title2);
  TextStyle get title2Emphasized => _s(_isMac ? AppleTypeMacOS.title2Emphasized : AppleTypeIOS.title2Emphasized);
  TextStyle get title3 => _s(_isMac ? AppleTypeMacOS.title3 : AppleTypeIOS.title3);
  TextStyle get title3Emphasized => _s(_isMac ? AppleTypeMacOS.title3Emphasized : AppleTypeIOS.title3Emphasized);
  TextStyle get headline => _s(_isMac ? AppleTypeMacOS.headline : AppleTypeIOS.headline);
  TextStyle get body => _s(_isMac ? AppleTypeMacOS.body : AppleTypeIOS.body);
  TextStyle get bodyEmphasized => _s(_isMac ? AppleTypeMacOS.bodyEmphasized : AppleTypeIOS.bodyEmphasized);
  TextStyle get callout => _s(_isMac ? AppleTypeMacOS.callout : AppleTypeIOS.callout);
  TextStyle get subheadline => _s(_isMac ? AppleTypeMacOS.subheadline : AppleTypeIOS.subheadline);
  TextStyle get subheadlineEmphasized => _s(_isMac ? AppleTypeMacOS.subheadlineEmphasized : AppleTypeIOS.subheadlineEmphasized);
  TextStyle get footnote => _s(_isMac ? AppleTypeMacOS.footnote : AppleTypeIOS.footnote);
  TextStyle get caption1 => _s(_isMac ? AppleTypeMacOS.caption1 : AppleTypeIOS.caption1);
  TextStyle get caption2 => _s(_isMac ? AppleTypeMacOS.caption2 : AppleTypeIOS.caption2);
  TextStyle get caption2Emphasized => _s(_isMac ? AppleTypeMacOS.caption2Emphasized : AppleTypeIOS.caption2Emphasized);
}

extension CfContext on BuildContext {
  CfColors get cf => CfColors._(this);
}

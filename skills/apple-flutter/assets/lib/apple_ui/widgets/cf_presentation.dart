import 'package:flutter/cupertino.dart';

import '../feedback/cf_haptics.dart';
import '../glass/cf_glass.dart';
import '../shapes/squircle_border.dart';
import '../theme/apple_tokens.dart';
import '../theme/cf_theme.dart';

/// iOS sheet. Uses the system Cupertino modal sheet route for gestures, adds elevated background,
/// grabber, header row (Cancel, title, Done) per components-ios/presentation.md.
Future<T?> showCfSheet<T>({
  required BuildContext context,
  required String title,
  required WidgetBuilder builder,
  String cancelLabel = 'Cancel',
  String? doneLabel,
  VoidCallback? onDone,
}) {
  return Navigator.of(context).push<T>(CupertinoSheetRoute<T>(
    builder: (ctx) => CfElevated(
      child: Builder(builder: (ctx) {
        final cf = ctx.cf;
        return CupertinoPageScaffold(
          backgroundColor: cf.bg,
          child: SafeArea(
            bottom: false,
            child: Column(children: [
              const SizedBox(height: 5),
              Container(width: 36, height: 5, decoration: ShapeDecoration(shape: const StadiumBorder(), color: cf.fill)),
              SizedBox(
                height: AppleLayout.navBarHeight,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppleSpacing.lg),
                  child: Row(children: [
                    CupertinoButton(padding: EdgeInsets.zero, onPressed: () => Navigator.of(ctx).pop(), child: Text(cancelLabel, style: cf.type.body.copyWith(color: cf.accent))),
                    Expanded(child: Text(title, textAlign: TextAlign.center, style: cf.type.headline)),
                    if (doneLabel != null)
                      CfGlass(
                        variant: CfGlassVariant.tinted, pressable: true,
                        onTap: () { onDone?.call(); Navigator.of(ctx).pop(); },
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: SizedBox(height: 36, child: Center(child: Text(doneLabel, style: cf.type.bodyEmphasized.copyWith(color: const Color(0xFFFFFFFF))))), // cf-ignore
                      )
                    else
                      const SizedBox(width: 60),
                  ]),
                ),
              ),
              Expanded(child: builder(ctx)),
            ]),
          ),
        );
      }),
    ),
  ));
}

class CfAlertAction {
  const CfAlertAction(this.label, {this.isDefault = false, this.isDestructive = false, this.isCancel = false, this.onPressed});
  final String label;
  final bool isDefault, isDestructive, isCancel;
  final VoidCallback? onPressed;
}

/// iOS 27 alert: large glass panel 300 wide, radius 34, capsule buttons, destructive red, default tinted.
Future<void> showCfAlert(BuildContext context, {required String title, String? message, required List<CfAlertAction> actions}) {
  if (actions.any((a) => a.isDestructive)) CfHaptics.warning();
  return showCupertinoDialog(
    context: context,
    barrierDismissible: false,
    builder: (ctx) => CfElevated(
      child: Builder(builder: (ctx) {
        final cf = ctx.cf;
        final stacked = actions.length > 2;
        Widget btn(CfAlertAction a) => GestureDetector(
              onTap: () { Navigator.of(ctx).pop(); a.onPressed?.call(); },
              child: Container(
                height: 48,
                alignment: Alignment.center,
                decoration: ShapeDecoration(shape: const StadiumBorder(), color: a.isDefault ? cf.accent : cf.fill3),
                child: Text(a.label, style: (a.isDefault || a.isDestructive ? cf.type.bodyEmphasized : cf.type.body).copyWith(color: a.isDefault ? const Color(0xFFFFFFFF) : a.isDestructive ? cf.red : cf.label)), // cf-ignore
              ),
            );
        return Center(
          child: SizedBox(
            width: 300,
            child: CfGlass(
              variant: CfGlassVariant.large,
              shape: const SquircleBorder(radius: AppleRadiusIOS.alert),
              padding: const EdgeInsets.all(AppleSpacing.xl),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Text(title, textAlign: TextAlign.center, style: cf.type.headline),
                if (message != null) ...[const SizedBox(height: 4), Text(message, textAlign: TextAlign.center, style: cf.type.footnote.copyWith(color: cf.label2))],
                const SizedBox(height: AppleSpacing.lg),
                stacked
                    ? Column(children: [for (final a in actions) Padding(padding: const EdgeInsets.only(top: 8), child: btn(a))])
                    : Row(children: [for (var i = 0; i < actions.length; i++) ...[if (i > 0) const SizedBox(width: 8), Expanded(child: btn(actions[i]))]]),
              ]),
            ),
          ),
        );
      }),
    ),
  );
}

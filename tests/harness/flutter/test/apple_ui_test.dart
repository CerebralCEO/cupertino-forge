import 'dart:ui' show PointerDeviceKind;
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:cupertino_forge_flutter_check/apple_ui/cf_app.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/feedback/cf_haptics.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/glass/cf_glass.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/motion/cf_motion.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/theme/apple_tokens.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/theme/cf_theme.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/widgets/cf_fields.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/widgets/cf_menu.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/widgets/cf_nav_bar.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/widgets/cf_progress.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/widgets/cf_slider.dart';

class _BuildCounter extends StatelessWidget {
  const _BuildCounter({required this.onBuild, required this.child});
  final VoidCallback onBuild;
  final Widget child;
  @override
  Widget build(BuildContext context) {
    onBuild();
    return child;
  }
}

void main() {
  testWidgets('CfPressable differentiates PointerDeviceKind touch vs mouse for glass scale', (tester) async {
    Future<double> measureScale(PointerDeviceKind kind) async {
      await tester.pumpWidget(
        CupertinoApp(
          home: Center(
            child: CfPressable(
              style: CfPressStyle.glass,
              onTap: () {},
              child: const SizedBox(width: 80, height: 40, child: Text('Tap')),
            ),
          ),
        ),
      );
      final center = tester.getCenter(find.text('Tap'));
      final g = await tester.startGesture(center, kind: kind);
      await tester.pump(const Duration(milliseconds: 120));
      await tester.pump(const Duration(milliseconds: 220));
      final transform = tester.widget<Transform>(find.descendant(of: find.byType(CfPressable), matching: find.byType(Transform)).first);
      final scale = transform.transform.storage[0];
      await g.up();
      await tester.pumpAndSettle();
      return scale;
    }

    final touchScale = await measureScale(PointerDeviceKind.touch);
    final mouseScale = await measureScale(PointerDeviceKind.mouse);
    expect(touchScale, greaterThan(1.05));
    expect(mouseScale, lessThanOrEqualTo(1.025));
  });

  testWidgets('CfType avoids double text scaling and CfApp clamps maxScaleFactor to 3.1', (tester) async {
    late double bodyFontSize;
    late double clampedScaled10;

    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(5.0)),
        child: CfApp(
          style: CfStyle.ios,
          home: Builder(builder: (context) {
            bodyFontSize = context.cf.type.body.fontSize!;
            clampedScaled10 = MediaQuery.textScalerOf(context).scale(10.0);
            return const SizedBox.shrink();
          }),
        ),
      ),
    );

    expect(bodyFontSize, equals(17.0));
    expect(clampedScaled10, closeTo(31.0, 0.01));
  });

  testWidgets('CfApp invokes SystemChrome.setEnabledSystemUIMode in initState only', (tester) async {
    int uiModeCalls = 0;
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, (call) async {
      if (call.method == 'SystemChrome.setEnabledSystemUIMode') uiModeCalls++;
      return null;
    });
    addTearDown(() => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, null));

    await tester.pumpWidget(const CfApp(style: CfStyle.ios, home: SizedBox(key: ValueKey('a'))));
    await tester.pumpWidget(const CfApp(style: CfStyle.ios, home: SizedBox(key: ValueKey('b'))));
    expect(uiModeCalls, equals(1));
  });

  testWidgets('CfLargeTitleScaffold updates scroll opacity via ValueNotifier without rebuilding slivers', (tester) async {
    int builds = 0;
    await tester.pumpWidget(
      CfApp(
        style: CfStyle.ios,
        home: CfLargeTitleScaffold(
          title: 'Settings',
          slivers: [
            SliverToBoxAdapter(
              child: _BuildCounter(
                onBuild: () => builds++,
                child: const SizedBox(height: 1200, child: Text('Body')),
              ),
            ),
          ],
        ),
      ),
    );
    expect(builds, equals(1));
    await tester.drag(find.byType(CustomScrollView), const Offset(0, -100));
    await tester.pump();
    expect(builds, equals(1));
  });

  testWidgets('CfGlass keeps outer shadow DecoratedBox outside ClipPath and supports grouped/reduceTransparency', (tester) async {
    await tester.pumpWidget(
      CfApp(
        style: CfStyle.ios,
        home: Center(
          child: BackdropGroup(
            child: const CfGlass(
              grouped: true,
              child: SizedBox(width: 100, height: 44, child: Text('Glass')),
            ),
          ),
        ),
      ),
    );

    final clipFinder = find.byType(ClipPath);
    expect(clipFinder, findsOneWidget);
    final ancestorBoxes = tester
        .widgetList<DecoratedBox>(find.ancestor(of: clipFinder, matching: find.byType(DecoratedBox)))
        .where((b) => b.decoration is ShapeDecoration && ((b.decoration as ShapeDecoration).shadows?.isNotEmpty ?? false))
        .toList();
    expect(ancestorBoxes.length, equals(1));
    expect(find.byType(BackdropFilter), findsOneWidget);

    await tester.pumpWidget(
      const CfApp(
        style: CfStyle.ios,
        reduceTransparency: true,
        home: Center(
          child: CfGlass(child: SizedBox(width: 100, height: 44, child: Text('Opaque'))),
        ),
      ),
    );
    expect(find.byType(BackdropFilter), findsNothing);
  });

  test('CfHaptics routes iOS success/warning/error to MethodChannel and falls back cleanly', () async {
    debugDefaultTargetPlatformOverride = TargetPlatform.iOS;
    final calls = <Object?>[];
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      const MethodChannel('cupertino_forge/haptics'),
      (call) async {
        calls.add(call.arguments);
        return null;
      },
    );
    addTearDown(() {
      debugDefaultTargetPlatformOverride = null;
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
        const MethodChannel('cupertino_forge/haptics'),
        null,
      );
    });

    await CfHaptics.success();
    await CfHaptics.warning();
    await CfHaptics.error();
    expect(calls, equals(['notificationSuccess', 'notificationWarning', 'notificationError']));
  });

  testWidgets('New Flutter widgets (CfTextField, CfSearchField, showCfMenu, CfProgressBar, CfActivityIndicator, CfSlider) work cleanly', (tester) async {
    String fieldVal = '';
    String searchVal = '';
    bool canceled = false;
    String menuPicked = '';
    double sliderVal = 0.25;

    await tester.pumpWidget(
      CfApp(
        style: CfStyle.ios,
        home: CupertinoPageScaffold(
          child: SafeArea(
            child: StatefulBuilder(builder: (context, setState) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CfTextField(
                    label: 'Name',
                    error: 'Required',
                    onChanged: (v) => setState(() => fieldVal = v),
                  ),
                  CfSearchField(
                    value: searchVal,
                    glass: true,
                    onChanged: (v) => setState(() => searchVal = v),
                    onCancel: () => setState(() => canceled = true),
                  ),
                  const CfProgressBar(value: 0.6, label: 'Upload'),
                  const CfActivityIndicator(delay: Duration(milliseconds: 300)),
                  CfSlider(
                    value: sliderVal,
                    label: 'Level',
                    onChanged: (v) => setState(() => sliderVal = v),
                  ),
                  CupertinoButton(
                    child: const Text('Menu'),
                    onPressed: () => showCfMenu(context, items: [
                      CfMenuItem(label: 'Rename', icon: CupertinoIcons.pencil, onSelected: () => menuPicked = 'rename'),
                      CfMenuItem(label: 'Delete', icon: CupertinoIcons.trash, isDestructive: true),
                    ]),
                  ),
                ],
              );
            }),
          ),
        ),
      ),
    );

    // Delayed spinner hidden initially, visible after 300ms
    expect(find.byType(CupertinoActivityIndicator), findsNothing);
    await tester.pump(const Duration(milliseconds: 350));
    expect(find.byType(CupertinoActivityIndicator), findsOneWidget);

    // CfTextField enter + clear
    await tester.enterText(find.byType(CupertinoTextField).first, 'Alice');
    await tester.pump();
    expect(fieldVal, equals('Alice'));
    expect(find.text('Required'), findsOneWidget);
    await tester.tap(find.byIcon(CupertinoIcons.clear_circled_solid).first);
    await tester.pump();
    expect(fieldVal, equals(''));

    // CfSearchField focus + Cancel
    await tester.tap(find.byType(CupertinoTextField).last);
    await tester.pump();
    await tester.tap(find.text('Cancel'));
    await tester.pump();
    expect(canceled, isTrue);

    // CfSlider drag changes value
    await tester.drag(find.byType(CfSlider), const Offset(120, 0));
    await tester.pump();
    expect(sliderVal, greaterThan(0.25));

    // showCfMenu opens and selects
    await tester.tap(find.text('Menu'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Rename'), findsOneWidget);
    await tester.tap(find.text('Rename'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    expect(menuPicked, equals('rename'));
  });

  testWidgets('CfTextField fixed 26pt radius auto-clamps to capsule at 40px and stays 26pt at 104px while CfSearchField stays StadiumBorder', (tester) async {
    expect(AppleRadiusIOS.textFieldRounded, equals(26.0));
    final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppleRadiusIOS.textFieldRounded));

    // Verify RRect radius scaling (what Flutter's Skia/Impeller renderer uses for RoundedRectangleBorder)
    final rrect40 = RRect.fromRectAndRadius(const Rect.fromLTWH(0, 0, 200, 40), const Radius.circular(AppleRadiusIOS.textFieldRounded)).scaleRadii();
    expect(rrect40.tlRadiusX, equals(20.0));
    expect(rrect40.tlRadiusY, equals(20.0));

    final rrect104 = RRect.fromRectAndRadius(const Rect.fromLTWH(0, 0, 200, 104), const Radius.circular(AppleRadiusIOS.textFieldRounded)).scaleRadii();
    expect(rrect104.tlRadiusX, equals(26.0));
    expect(rrect104.tlRadiusY, equals(26.0));

    // Verify rendered outer Path geometry directly at 40px vs 104px
    final path40 = shape.getOuterPath(const Rect.fromLTWH(0, 0, 200, 40));
    // For r=20 semi-circle on 200x40: at y=0.5, x boundary = 20 - sqrt(20^2 - 19.5^2) ~= 15.56
    expect(path40.contains(const Offset(14.0, 0.5)), isFalse);
    expect(path40.contains(const Offset(17.0, 0.5)), isTrue);
    // At y=20 (vertical midpoint), x=0.5 is inside the capsule edge
    expect(path40.contains(const Offset(0.5, 20.0)), isTrue);

    final path104 = shape.getOuterPath(const Rect.fromLTWH(0, 0, 200, 104));
    // For r=26 on 200x104: at y=0.5, x boundary = 26 - sqrt(26^2 - 25.5^2) ~= 20.93
    expect(path104.contains(const Offset(19.0, 0.5)), isFalse);
    expect(path104.contains(const Offset(22.0, 0.5)), isTrue);
    // At y=30 (below 26pt corner arc), x=0.5 is on the straight vertical edge
    expect(path104.contains(const Offset(0.5, 30.0)), isTrue);

    // Mount real CfTextField (44pt single-line minHeight <= 52pt -> auto-clamped capsule; 104pt multi-line -> 26pt radius) + CfSearchField (StadiumBorder)
    await tester.pumpWidget(
      CfApp(
        style: CfStyle.ios,
        home: CupertinoPageScaffold(
          child: Column(
            children: [
              const SizedBox(width: 200, height: 44, child: CfTextField(placeholder: 'Single')),
              const SizedBox(width: 200, height: 104, child: CfTextField(placeholder: 'Multi')),
              CfSearchField(value: '', onChanged: (_) {}),
            ],
          ),
        ),
      ),
    );
    final fieldBoxes = tester.widgetList<DecoratedBox>(find.descendant(of: find.byType(CfTextField), matching: find.byType(DecoratedBox))).toList();
    expect(fieldBoxes.length, equals(2));
    for (final box in fieldBoxes) {
      final sd = box.decoration as ShapeDecoration;
      expect(sd.shape, isA<RoundedRectangleBorder>());
      final rrb = sd.shape as RoundedRectangleBorder;
      expect(rrb.borderRadius, equals(BorderRadius.circular(26)));
    }
    final searchBox = tester.widget<DecoratedBox>(find.descendant(of: find.byType(CfSearchField), matching: find.byType(DecoratedBox)).first);
    expect((searchBox.decoration as ShapeDecoration).shape, isA<StadiumBorder>());
  });
}

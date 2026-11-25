import 'dart:ui' show PointerDeviceKind;
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:cupertino_forge_flutter_check/apple_ui/cf_app.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/feedback/cf_haptics.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/glass/cf_glass.dart';
import 'package:cupertino_forge_flutter_check/apple_ui/motion/cf_motion.dart';
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
}

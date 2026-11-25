# Flutter widgets: usage

## App root

```dart
void main() => runApp(const CfApp(style: CfStyle.ios, accent: AppleSystemColors.blue, glassIntensity: 0.5, sounds: false, home: SettingsScreen()));
```

## Screen with large title, list, tab bar

```dart
class SettingsScreen extends StatefulWidget { const SettingsScreen({super.key}); @override State<SettingsScreen> createState() => _S(); }
class _S extends State<SettingsScreen> {
  bool wifi = true; int tab = 0;
  @override
  Widget build(BuildContext context) {
    final cf = context.cf;
    return CfLargeTitleScaffold(
      title: 'Settings',
      trailing: CfBarButtonGroup(items: [(icon: CupertinoIcons.add, label: 'Add', onPressed: () {}), (icon: CupertinoIcons.ellipsis, label: 'More', onPressed: () {})]),
      bottom: CfTabBar(index: tab, onChanged: (i) => setState(() => tab = i), onSearch: () {}, items: const [
        CfTabItem(label: 'Home', icon: CupertinoIcons.house, iconSelected: CupertinoIcons.house_fill),
        CfTabItem(label: 'Library', icon: CupertinoIcons.book, iconSelected: CupertinoIcons.book_fill),
      ]),
      slivers: [
        CfList(sections: [
          CfListSection(header: 'Connectivity', footer: 'Turning off Wi-Fi disconnects all networks.', rows: [
            CfListRow(title: 'Wi-Fi', leading: CfSettingsIcon(icon: CupertinoIcons.wifi, color: cf.blue), trailing: CfToggle(label: 'Wi-Fi', value: wifi, onChanged: (v) => setState(() => wifi = v))),
            CfListRow(title: 'Bluetooth', value: 'On', accessory: CfAccessory.chevron, leading: CfSettingsIcon(icon: CupertinoIcons.bluetooth, color: cf.blue), onTap: () {}),
          ]),
          CfListSection(rows: [CfListRow(title: 'Sign Out', destructive: true, onTap: () {})]),
        ]),
      ],
    );
  }
}
```

## Buttons

`CfButton(label: 'Continue', variant: CfButtonVariant.filled, size: CfButtonSize.large, fullWidth: true, onPressed: ...)`; `CfIconButton(icon: CupertinoIcons.xmark, label: 'Close', onPressed: ...)`.

## Glass

`CfGlass(variant: CfGlassVariant.regular, shape: StadiumBorder(), grouped: false, child: ...)`. Shapes: `StadiumBorder` (capsule), `CircleBorder`, `SquircleBorder(radius: ...)`. Wrap non-overlapping sibling glass pills in a bar with `BackdropGroup` and pass `grouped: true` (Flutter `3.29+` Impeller optimization).

## Controls, Fields & Progress

```dart
CfSlider(value: level, onChanged: setLevel, label: 'Volume', minIcon: Icon(CupertinoIcons.speaker), maxIcon: Icon(CupertinoIcons.speaker_3))
CfTextField(label: 'Title', placeholder: 'Enter title', clearable: true, error: errText, onChanged: setText)
CfSearchField(value: query, onChanged: setQuery, glass: true, onCancel: clearSearch)
CfProgressBar(value: 0.65, label: 'Upload')
CfActivityIndicator(delay: Duration(milliseconds: 300))
```

## Menus and Popovers

```dart
showCfMenu(context, items: [
  CfMenuItem(label: 'Rename', icon: CupertinoIcons.pencil, onSelected: rename),
  CfMenuItem(label: 'Delete', icon: CupertinoIcons.trash, isDestructive: true, onSelected: del),
]);
```

## Sheets and alerts

```dart
showCfSheet(context: context, title: 'New Note', doneLabel: 'Done', onDone: save, builder: (_) => const NoteEditor());
showCfAlert(context, title: 'Delete this note?', message: "You can't undo this action.", actions: [
  const CfAlertAction('Cancel', isCancel: true),
  CfAlertAction('Delete', isDestructive: true, onPressed: delete),
]);
```

## Motion

```dart
late final c = AnimationController.unbounded(vsync: this);
animateSpring(c, 1, AppleSprings.snappy);         // interruptible, velocity preserving
Navigator.of(context).push(CfPageRoute(builder: (_) => Detail()));
```

## Haptics and sound

`CfHaptics.selection() / light() / medium() / success() / warning() / error()`; `CfSounds.play(CfSound.send)`.

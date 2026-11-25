# 01 Layout and metrics

All numbers come from `tokens/layout.json`. Values carry `[official]`, `[measured]`, `[inferred]`, or `[estimate]` provenance; estimates must be listed in the Compliance Report (`Values marked estimate`).

## Units

1 point = 1 CSS px = 1 Flutter logical pixel. Design at 1x points. Hairlines are 0.5pt (render 1 physical pixel on 2x and 3x screens `[estimate]`).

## Grid and spacing

- Base 4 `[estimate]`. Allowed steps: 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64.
- Inside a component: 4 to 12. Between related items: 8 to 16. Between groups or sections: 20 to 32. Hero spacing: 48 to 64.
- Never use 5, 7, 14, 15, 18, 30 or any value outside the scale (note: Apple official HIG margins for Widgets are `16` `[official]` with tight `11`, and Live Activities Lock Screen margin is `14` `[official]` / compact `28×28` `[official]`).

## iOS

| Item | Value |
|---|---|
| Screen side margin | 16 `[estimate]` compact (matches 16pt Widget margin `[official]`), 20 `[estimate]` regular width |
| Readable content max width | 672 `[inferred]` |
| Safe area top (Dynamic Island) | 62 `[estimate]` (iPhone 16 Pro / 17 / 17 Pro); community specs report 59 on iPhone 15/16 (`$alt` `[inferred/community]`) |
| Home indicator bottom inset | 34 `[inferred/community]` |
| Navigation bar | 44 `[inferred]` tall below status bar; large title adds 52 `[estimate]` |
| Large title | largeTitle emphasized (34 bold `[official]`), leading 16 `[estimate]` |
| Inline title | headline 17 semibold `[official]`, centered |
| Bar buttons | 44 circles or 44 tall capsules of glass, grouped (`[official]` min hit target) |
| Tab bar | floating glass capsule, sits above home indicator, about 62 tall `[estimate]`, 20 from sides `[estimate]`, max 5 tabs on iPhone `[official]`; `.tabBarMinimizeBehavior(.onScrollDown)` + `Tab(role: .search)` `[official]` |
| Search | capsule glass, 44 tall `[measured]` (`48pt` bottom variant in iOS 27 Figma kit), trailing standalone tab / bottom on iPhone (iOS 26+) |
| List row | min 52 `[estimate]` (44 minimum accessible `[official]`; Regular 52 / Tall 68 in iOS 27 Figma kit), leading inset 16 `[estimate]` |
| Settings style row icon | 29 square, radius 7, separator inset 60 `[estimate]` |
| Inset grouped section | 16 from sides, radius 26 `[estimate]`, 20 gap between sections |
| Sheet grabber | 60 by 4, 6 from top; floating inset at medium detent 6 `[measured]` (Apple Figma iOS 27 kit) |
| Alert | 300 wide, 14 padding, button height 48 `[measured]` (Apple Figma iOS 27 kit) |
| Buttons | mini 28, small 32, medium 36, large 50, extra large 56 `[estimate]` (iOS 27 Figma kit defines 3 sizes: Small 28, Medium 34, Large 50; HIG publishes 28/32/44/52/64 for visionOS) |
| Toggle | 64 by 28 track, 38 by 24 knob, inset 2 `[measured]` (Apple Figma iOS 27 kit; legacy <=18 UISwitch was 51 by 31 `[inferred]`) |
| Slider | track height 6, knob 38 by 24 `[measured]` (Apple Figma iOS 27 kit) |
| Stepper | 92 by 32 `[measured]` (Apple Figma iOS 27 kit) |
| Text field | 52 tall, 16 horizontal padding `[measured]` (Apple Figma iOS 27 kit) |
| Segmented control | 36 tall `[estimate]` (iOS 27 Figma kit: Small 32, Large 50, Toolbar 36) |
| Hit target | 44 by 44 recommended, 28 by 28 absolute minimum `[official]`; add ~12pt padding around bezeled or ~24pt around bezel-less controls `[official]` |

### iOS screen skeleton

```
status bar (system)
navigation bar: back (glass circle) | title | actions (glass group)
large title (scrolls up into inline title)
content (scrolls under bars, under tab bar)
floating tab bar (glass capsule)   or   bottom toolbar (glass group)
home indicator
```

### iPad (width 768 and up)

- Sidebar (leading, 320 wide, glass, more opaque) replaces the tab bar when it helps; tab bar can convert to a sidebar.
- Content in a centered readable column (max 672) for text heavy views; grids for media.
- Toolbar items move to the top trailing.

## macOS

| Item | Value |
|---|---|
| Window minimum | 480 by 320 `[estimate]` |
| Menu bar height | 24 `[official]` |
| Titlebar | 32 `[estimate]` |
| Unified toolbar | 52 (38 compact) `[estimate]` |
| Traffic lights | 14 diameter, 9 gap, 16 from leading, centered on the toolbar `[estimate]` |
| Sidebar | 180 to 320, default 220 `[estimate]`, edge to edge (macOS 27 `[official]`), rows 32, icons 16 `[estimate]` |
| Split view divider | 1pt (`thin` divider style `[official]`) |
| Inspector | 240 to 320, default 280, trailing `[estimate]` |
| Content padding | 20 `[estimate]` |
| Control heights | mini 16, small 20, regular 24, large 28, extra large 36 `[measured]` (Apple Figma macOS 27 kit) |
| Menu item | 24 tall, 10 side padding, menu 5 outer padding, separator 11 `[measured]` (Apple Figma macOS 27 kit) |
| Table row | 24 (32 large), header 28 `[estimate]` |
| Hit target | 28 by 28 recommended, 20 minimum `[official]` (do not shrink/move layout when Mac touch display is active) |

### macOS window skeleton

```
+--------------------------------------------------------------------+
| (o)(o)(o)  [sidebar toggle]   Title            [tools] [search]    |  unified toolbar 52
+----------------+---------------------------------------+-----------+
| Sidebar        | Content                               | Inspector |
| (edge to edge, | (window background, scrolls)          | (optional)|
|  vibrant)      |                                       |           |
+----------------+---------------------------------------+-----------+
```

- Primary actions live in the toolbar and in the menu bar (with keyboard shortcuts), not in big buttons inside content.
- Dialog buttons sit bottom trailing: Cancel then the default button (rightmost, accent, responds to Return).
- Do not put critical controls at the bottom edge of the window.

## Adaptive web and desktop

- Breakpoints: 0 to 767 iOS phone layout, 768 to 1179 iPad layout, 1180 and up with fine pointer macOS layout.
- Base decisions on available width (size class), not on device detection.
- Keep functionality identical across sizes; only reveal more of it.

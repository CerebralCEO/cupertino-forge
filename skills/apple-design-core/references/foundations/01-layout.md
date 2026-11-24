# 01 Layout and metrics

All numbers come from `tokens/layout.json`. Values marked estimate there must be listed in the Compliance Report.

## Units

1 point = 1 CSS px = 1 Flutter logical pixel. Design at 1x points. Hairlines are 0.5pt (render 1 physical pixel on 2x and 3x screens).

## Grid and spacing

- Base 4. Allowed steps: 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64.
- Inside a component: 4 to 12. Between related items: 8 to 16. Between groups or sections: 20 to 32. Hero spacing: 48 to 64.
- Never use 5, 7, 14, 15, 18, 30 or any value outside the scale.

## iOS

| Item | Value |
|---|---|
| Screen side margin | 16 compact, 20 regular width |
| Readable content max width | 672 |
| Safe area top (Dynamic Island) | 62 (estimate) |
| Home indicator bottom inset | 34 |
| Navigation bar | 44 tall below status bar; large title adds 52 |
| Large title | largeTitle emphasized (34 bold), leading 16 |
| Inline title | headline 17 semibold, centered |
| Bar buttons | 44 circles or 44 tall capsules of glass, grouped |
| Tab bar | floating glass capsule, about 62 tall, 20 from sides, sits above home indicator |
| Search | capsule glass, 44 tall, bottom of screen on iPhone (iOS 26+) |
| List row | min 52 (44 compact), subtitle row 64, leading inset 16 |
| Settings style row icon | 29 square, radius 7, separator inset 60 |
| Inset grouped section | 16 from sides, radius 26 (estimate), 20 gap between sections |
| Sheet grabber | 36 by 5, 5 from top |
| Alert | 300 wide, 20 padding |
| Buttons | mini 28, small 32, medium 36, large 50, extra large 56 (estimate) |
| Toggle | 64 by 28 track, 38 by 24 knob (estimate) |
| Segmented control | 36 tall (estimate) |
| Hit target | 44 by 44 minimum |

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
| Window minimum | 480 by 320 |
| Titlebar | 32 |
| Unified toolbar | 52 (38 compact) |
| Traffic lights | 14 diameter, 9 gap, 16 from leading, centered on the toolbar (estimate) |
| Sidebar | 180 to 320, default 220, edge to edge (macOS 27), rows 32, icons 16 |
| Inspector | 240 to 320, default 280, trailing |
| Content padding | 20 |
| Control heights | mini 16, small 20, regular 24, large 28, extra large 36 (estimate) |
| Menu item | 24 tall, 10 side padding, menu 5 outer padding |
| Table row | 24 (32 large), header 28 |
| Hit target | 28 by 28 recommended, 20 minimum |

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

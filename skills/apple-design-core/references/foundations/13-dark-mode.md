# 13 Dark mode

## Principles

- Dark mode is not inverted light mode. Backgrounds go true black (iOS base) or #1E1E1E (macOS window), and layers rise in lightness.
- Base vs elevated: full screen content uses base backgrounds; anything presented above (sheets, popovers, alerts, menus, multitasking windows) uses elevated backgrounds. Web: put `data-cf-elevated` on the presented container. Flutter: `CfElevated` inherited widget.
- System colors in dark are slightly brighter and less saturated (tokens handle it).
- Shadows barely read; separation comes from surface lightness and hairlines.

## Checklist for every screen

1. All colors are tokens (they flip automatically).
2. Images and illustrations: provide dark variants or reduce brightness 10 percent with a subtle dark overlay when they are bright white.
3. Pure white text on pure black only for label; secondary text uses label-2 (60 percent) to reduce glare.
4. Glass dark recipe is darker and less transparent; check legibility on light content scrolling beneath (glass adapts appearance from content for small elements).
5. Increased contrast dark values are applied when the user enables it.
6. Charts: use system colors dark variants; gridlines label-4.

## Appearance switching

- Default follows the system. Offer System, Light, Dark only if the app has a reason (reader apps).
- Switching animates with a 200ms crossfade of colors only; nothing moves.

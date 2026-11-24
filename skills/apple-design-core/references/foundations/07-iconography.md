# 07 Iconography

Source of truth: `tokens/icons.json` (SF Symbol name to Lucide, Phosphor, CupertinoIcons).

## Licensing

SF Symbols may only be used in apps for Apple platforms. Web apps, Android apps, Windows and Linux apps use the mapped open icon sets. When the Flutter target is iOS or macOS only, CupertinoIcons (MIT, drawn by Flutter) are fine everywhere.

## Pick the icon by SF Symbol name first

Think in SF Symbol names (house, gearshape, square.and.arrow.up), then map with tokens/icons.json. This keeps metaphors Apple standard: share is square.and.arrow.up, never a three node graph; settings is gearshape; more is ellipsis or ellipsis.circle; compose is square.and.pencil; delete is trash.

## Size and weight

- Icons sit next to text and inherit its size and weight. Regular text gets regular icon; semibold gets semibold.
- Lucide stroke widths: regular 1.75, medium 2, semibold 2.25, bold 2.5 (2 at 16px and below).
- Scales: small = 0.8 of the text size, medium = text size, large = 1.3 times.
- Bar buttons: 17 to 20 point glyph centered in a 44 glass circle. Tab bar: 24 to 28 glyph. macOS toolbar: 16 to 18 glyph in a 28 to 32 control. macOS sidebar: 16 glyph, accent colored by default (macOS 27 restored colored sidebar icons).
- Vertically align icons to the text cap height center, not the box center.

## State

- Tab bar and sidebar selected items use the filled variant (Phosphor fill), unselected use outline.
- Disabled icons use label-3.
- On glass: label-glass color. In content: label-2 for decorative row icons, accent only for actionable inline icons.

## Settings style row icons

29 by 29 squircle, radius 7, white glyph (17 to 18 semibold) on a system color background. Use only in settings and similar lists. Do not put colored circles behind icons anywhere else.

## Animated symbols

Use symbol effects from motion tokens: bounce on state change (like adding to favorites), replace for toggling between two symbols (play and pause), pulse for ongoing activity, wiggle for attention (rare). Never loop decorative animations.

## Never

Emoji as UI icons, mixed icon families, two tone duotone icons, icons in buttons that already have a clear text label (unless it is a standard pairing like plus with Add), icons with drop shadows.

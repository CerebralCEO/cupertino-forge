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

## Animated symbols & SF Symbols 7 (`[official]`)

SF Symbols supports four rendering modes (**Monochrome**, **Hierarchical**, **Palette**, **Multicolor**) plus **SF Symbols 7 (`July 28, 2025` HIG)** linear **Gradients** across all rendering modes `[official]`. Supported symbol effects include **Appear**, **Disappear**, **Bounce**, **Scale**, **Pulse**, **Variable color** (`open loop` vs `closed loop`), **Replace / Magic Replace**, **Wiggle**, **Breathe**, **Rotate**, and **Draw On / Draw Off** (draws along guide points in SF Symbols 7+ `[official]`). Never loop decorative animations.

## Layered App Icons (`[official]`)

iOS, iPadOS, macOS (`1024×1024 px` Square input `[official]`), and watchOS (`1088×1088 px` `[official]`) app icons use layered `.icon` artwork authored in Icon Composer (`Oct 28, 2026` HIG format options `[official]`). Provide 6 appearance variants (`default`, `dark`, `clear light`, `clear dark`, `tinted light`, `tinted dark` `[official]`), including for alternate app icons; let the OS apply squircle masking, shadows, refraction, and specular highlights.

## RTL & Localization (`[official]`)

Use SF Symbols RTL variants (`arrow.backward`, `chevron.forward`, localized signature/rich-text glyphs) or CSS `scaleX(-1)` ONLY for reading-direction or forward/backward motion glyphs (`16-localization-rtl.md`). Never flip checkmarks, clocks, logos, or prohibition slashes.

## Never

Emoji as UI icons, mixed icon families, two tone duotone icons, icons in buttons that already have a clear text label (unless it is a standard pairing like plus with Add), icons with drop shadows.

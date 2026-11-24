# 15 Version diff: what is new in iOS 27 and macOS 27

Baseline: iOS 26 and macOS 26 Tahoe introduced Liquid Glass (WWDC 2025). iOS 27 and macOS 27 Golden Gate refine it (WWDC 2026, shipped fall 2026). Plugin tokens are synced to the iOS 27 and macOS 27 UI kits (Sketch, exported November 2026).

## Changes that affect your UI

1. **Liquid Glass intensity slider.** Users choose from ultra clear to fully tinted. Implement `glassIntensity` (0 to 1). Your UI must stay legible at both ends.
2. **Better readability.** More uniform refraction, improved diffusion and contrast. Our tuned recipes use stronger tint than iOS 26.
3. **macOS uniform window corner radius.** All windows share one radius (12 estimate) instead of Tahoe's toolbar dependent 16 to 26.
4. **macOS edge to edge sidebars.** Sidebars are no longer floating glass slabs; they extend to the window edge with a vibrant material. Do not inset or float the sidebar.
5. **macOS uniform toolbars.** Toolbar items sit on a consistent bar behind them for legibility.
6. **macOS colored sidebar icons are back.** Sidebar glyphs use the accent color (or their fixed color) instead of monochrome.
7. **Window active state is clearer** via sidebar appearance, opacity and window shadow (use windowActive vs windowInactive tokens and sidebar vs sidebar-inactive).
8. **App icons** use multiple Liquid Glass layers (Icon Composer). For your own app icon design: layered foreground on glass, no text.
9. **iOS 26 to 27 carried over:** floating capsule tab bar that minimizes on scroll, bottom search, glass button groups in navigation bars, sheets that float at medium detent, scroll edge effects, concentric layout, system blue #0088FF.

## Things that are old and must not appear

- iOS 15 to 18 style: solid white or translucent bars spanning full width with a hairline, tab bar glued to the bottom edge, #007AFF blue, 10pt radius grouped sections, uppercase grouped section headers, 51 by 31 toggles.
- macOS Tahoe 26 style: floating inset sidebar, large window corner radius 26.
- macOS Sequoia and older style: opaque gray toolbars without glass, monochrome sidebar only, flat menus.

## Update procedure

Run `/apple-sync` after each WWDC and each kit update. Record the diff here with date and source.

| Date | Source | Change |
|---|---|---|
| 2026-11-21 | iOS 27 and macOS 27 Sketch kits, HIG | Initial token sync |

# 04 Liquid Glass and materials

Source of truth: `tokens/materials.json`. The adapters ship a `Glass` primitive; always use it, never hand roll backdrop filters.

## What Liquid Glass is

A translucent material for the functional layer. It blurs and refracts what is behind it, adds a specular rim highlight, adapts light or dark to the content beneath (small elements) and reacts to touch by scaling up and glowing. Apple's iOS 27 and macOS 27 add a user intensity slider from fully clear to fully tinted.

## Where glass goes (allowed list)

iOS: navigation bar buttons and button groups, floating tab bar, bottom toolbars, floating action buttons, search field at the bottom, sheets at medium detent, alerts, action sheets, menus, context menus, popovers, slider knob and toggle knob while dragged, keyboard background.
macOS: toolbar item groups, sidebars (edge to edge, more opaque), menus, popovers, alerts and sheets, the dock style floating panels, notification banners.

## Where glass never goes

Cards, list rows, list sections, page backgrounds, text fields inside content, images, tables, charts, form sections, modals that cover the full screen, anything stacked on another glass element.

## Variants

| Variant | When | Recipe |
|---|---|---|
| regular | default for every glass element | blur 12, saturate 1.8, white 58 percent (light) / charcoal 58 percent (dark), rim highlight, soft drop shadow |
| clear | only over photos, video, maps, rich media | blur 4, 12 percent white, rim highlight; add 35 percent black dimming layer if media is bright |
| large | sidebars, sheets, alerts, popovers (more text) | blur 24, 78 percent opaque |
| tinted | the ONE primary action | accent at 85 percent over regular glass, white label |
| menu (macOS) | menus | kit menu recipe |

Exact CSS values are generated as `--cf-glass-*` variables.

## Glass rules

1. Group related glass controls into one shape (a capsule containing back and forward, a capsule containing three toolbar actions). Separate unrelated groups with 8 to 12 spacing.
2. Glass shapes merge and split with the glassMorph spring when controls appear or disappear (tab bar minimizing, menu growing out of its button).
3. Labels on glass: label-glass colors (monochrome). Selected state on glass: accent tinted label, or an inner glass capsule behind the selected item (tab bar).
4. Glass sits on content that scrolls beneath it. Add the scroll edge effect: a 40 to 60 point gradient blur and fade of the content under top and bottom bars, instead of solid bar backgrounds.
5. Press: glass element scales up to about 1.1 with the press spring, rim brightens, releases with the release spring. With mouse or trackpad the effect is subdued (1.02, no glow).
6. Reduce Transparency: glass becomes opaque (`--cf-glass-opaque`). Increase Contrast: no blur, opaque, 1px label border at 35 percent.
7. **Unified Intensity Curve (`[estimate]`):** Honor `glassIntensity` (`0.0` clear to `1.0` tinted, default `0.5`) mapped via `materials.json -> liquidGlass.intensityCurve` (`alphaScale` & `blurScale = 0.7 + 0.6 * intensity` in both Web & Flutter). iOS 27 / macOS 27 press report indicates a continuous OS slider (`[inferred]`).
8. **Reduce Transparency & Safari Matrix:** `@media (prefers-reduced-transparency: reduce)` works in Chromium `118+` `[official]` but is **unsupported in Safari/WebKit `[official]`** — apps MUST provide an in-app `[data-transparency="reduce"]` setting (`--cf-glass-opaque` `#F6F6F6` / `#262626` `[estimate]`).
9. **Performance Budget (`[estimate]`):** Limit simultaneous backdrop filters to **`<= 6`** on screen. Never animate blur radius (`sigma`); animate opacity/transform only. In **SwiftUI**, wrap adjacent glass controls in `GlassEffectContainer(spacing:)` `[official]`. In **Flutter `3.29+`**, use `BackdropGroup` + `BackdropFilter.grouped` `[official]` (clipped with `ClipRRect`, never on overlapping siblings).

## Glass vs Solid Decision Tree

1. Is the element in the navigation/control **functional layer** floating over scrolling content (tab bar, nav bar, toolbar, sidebar, menu, popover, alert, medium sheet, active knob)? -> If NO (card, row, page bg, form section), use **solid/grouped background or standard material**, NEVER glass (`[official]`).
2. Is another glass layer already directly beneath it? -> If YES, use `overGlass` / vibrant fills, NEVER stack glass on glass (`[official]`).
3. Is it floating directly over bright photo/video/map media? -> Use `clear` variant + `#000000@0.35` dark dimming layer (`[official]`), else use `regular` (or `large` `[estimate]` for sidebars/sheets).
4. Are > 6 backdrop elements active or is `Reduce Transparency` / `Increase Contrast` on? -> Collapse to opaque fallback (`[estimate]`).

## Refraction (lens) effect

Real Liquid Glass bends the content at the rim. Implementations:
- Web: SVG `feDisplacementMap` filter used in `backdrop-filter: url(#cf-lens)` works in Chromium only. Safari and Firefox fall back to blur plus rim highlight. Enable lens only for hero elements (tab bar, floating buttons), not for every chip.
- Flutter: `liquid_glass_renderer` shader (experimental) or the plugin's `CfGlass` which uses BackdropFilter plus a rim painter; on iOS 26+ you may use native glass via platform views.
- Tauri on macOS 26+: native `NSGlassEffectView` through window-vibrancy `apply_liquid_glass` for window level glass; HTML elements still use the web Glass primitive.

## Standard materials (content layer)

ultraThin, thin, regular, thick (and ultraThick on macOS). Use for panels over imagery inside content, grouped areas over wallpapers, overlays on video. Pair with label-vibrant colors. Values in tokens.

## Reference-only Figma `GLASS` parameters (`materials.json :: figmaGlass`)

Apple's iOS 27 & macOS 27 Figma kits store `GLASS` parameters (`Frost Regular 6`, `Frost Medium/Large 16`, `Refraction 70`, `Depth 30`, `Dispersion 20`, `Splay 20`, `Light Angle 0`, `Opacity 25` — `VariableCollectionId:5565:22724`) and raw `BACKGROUND_BLUR` radii under `materials.json :: figmaGlass` (`[measured]`, reference-only; does not drive CSS). CSS/Flutter `liquidGlass.tuned` and `engine` remain `[estimate]` (`calibration: derived (Figma Dev Mode CSS export convention radius/2); not verified against Apple OS`, no official Figma docs URL found).

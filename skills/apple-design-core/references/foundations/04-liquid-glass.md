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
7. Intensity: honor `glassIntensity` from config (0 clear to 1 tinted). It scales the tint alpha and blur radius.
8. Performance: limit simultaneous backdrop filters to about 6 on screen. Never animate blur radius; animate opacity and transform only.

## Refraction (lens) effect

Real Liquid Glass bends the content at the rim. Implementations:
- Web: SVG `feDisplacementMap` filter used in `backdrop-filter: url(#cf-lens)` works in Chromium only. Safari and Firefox fall back to blur plus rim highlight. Enable lens only for hero elements (tab bar, floating buttons), not for every chip.
- Flutter: `liquid_glass_renderer` shader (experimental) or the plugin's `CfGlass` which uses BackdropFilter plus a rim painter; on iOS 26+ you may use native glass via platform views.
- Tauri on macOS 26+: native `NSGlassEffectView` through window-vibrancy `apply_liquid_glass` for window level glass; HTML elements still use the web Glass primitive.

## Standard materials (content layer)

ultraThin, thin, regular, thick (and ultraThick on macOS). Use for panels over imagery inside content, grouped areas over wallpapers, overlays on video. Pair with label-vibrant colors. Values in tokens.

# 05 Shape, corners, concentricity

Source of truth: `tokens/shape.json`.

## Continuous corners (non negotiable)

Apple rounded rectangles use a continuous curvature corner (superellipse), Figma equivalent corner smoothing 60 percent. A normal `border-radius` arc has a visible kink where the straight edge meets the curve. That kink is the single most common reason a UI looks "almost Apple".

- Web: `border-radius: R; corner-shape: squircle;` (Chromium 139+). Fallback for Safari and Firefox: the `squircle()` clip-path or SVG mask from `apple-web/assets/lib/squircle.ts`. Use the `Squircle` wrapper component for cards, sheets, images, app icons. For capsules and circles plain `border-radius: 9999px` is correct (a capsule has no corner kink).
- Flutter: `SquircleBorder(radius: R)` from the adapter (do not use RoundedRectangleBorder or ContinuousRectangleBorder, the latter's math does not match).
- Tauri: same as web.

## Shape vocabulary

| Shape | Use |
|---|---|
| Capsule (radius = height / 2) | All buttons with text, search fields, segmented controls, toggles, sliders, tab bar, toolbar groups, badges, tags, pills |
| Circle | Icon only buttons (close, more, back, add), avatars, page dots |
| Squircle rect | Cards, sheets, alerts, popovers, menus, list sections, images, thumbnails, windows, text fields on macOS |

## Concentric rule

Inner radius = outer radius minus the inset between them (minimum 4). Apply recursively.

Examples:
- Sheet radius 38, content padding 16 → inner card radius 22.
- Inset grouped section radius 26 with a full width image at 0 inset → the image takes the same 26 top corners.
- macOS window radius 12, toolbar button 6 from the edge → button is capsule because its height (24) allows it; a square tool button would take 6.
- A tab bar capsule 62 tall with the selected item inset 4 → inner capsule.

If the inner element is a capsule, concentricity is automatic.

## Radius table (iOS, estimate unless marked)

alert 34, action sheet 34, popover 26, menu 26, context menu preview 22, inset grouped section 26, card 22, text field 12, keyboard 26, small widget 22, small thumbnail 8, medium thumbnail 12, app icon mask 22.37 percent of size (superellipse). Device display radius 55 (iPhone 17 Pro), used for full height sheets and full bleed cards that touch screen corners.

## Radius table (macOS, estimate)

window 12 (uniform in macOS 27), sheet 12, alert 16, popover 16, menu 12, menu item highlight 6, tooltip 6, sidebar row selection 8, table row selection 6, text field 6, popup button 6, checkbox 4, large push button 8, card 10.

## Borders and separators

- iOS: no borders around content. Separators are 0.5 hairlines, inset from the leading edge to where text starts (16, or 60 when rows have 29pt icons). No separator after the last row of a section.
- macOS: text fields and some controls have the kit hairline (field-border). Tables use separators between rows only when alternating backgrounds are off.
- Never 1px gray borders on cards, never double borders, never borders plus shadows on content.

## Images

- Media in lists: squircle with thumbnail radius. Full bleed hero images: no radius unless inside a card.
- Avatars: circle. App icons: superellipse mask with the 22.37 percent radius and squircle corner.

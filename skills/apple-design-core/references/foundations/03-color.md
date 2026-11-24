# 03 Color

Source of truth: `tokens/color.json` (iOS 27 and macOS 27 kits, HIG increased contrast values).

## Token names you use in code

Generated CSS variables are `--cf-<name>`; Tailwind classes `text-<name>`, `bg-<name>`; Flutter `AppleIOSColors.<name>` and `AppleMacOSColors.<name>` resolved by brightness.

| Name | Meaning |
|---|---|
| label, label-2, label-3, label-4, label-5 | Text and glyph hierarchy (primary to quinary) |
| label-glass, label-glass-2.. | Text and symbols on Liquid Glass (monochrome) |
| label-vibrant.. | Text on standard materials and macOS sidebars |
| placeholder | Placeholder text |
| link | Inline links |
| fill, fill-2, fill-3, fill-4 | Thin fills for control backgrounds, search fields, pressed rows |
| bg, bg-2, bg-3 | Plain view backgrounds (primary, secondary, tertiary) |
| bg-grouped, bg-grouped-2, bg-grouped-3 | Grouped list backgrounds (screen, cell, nested) |
| separator, separator-opaque | Hairlines |
| control, control-pressed, control-disabled | Bordered button fills (macOS kit values) |
| field, field-border | Text field background and hairline |
| sidebar, sidebar-inactive | macOS sidebar fill (active and inactive window) |
| accent, accent-contrast | Brand or system blue, and the label color on it |
| red orange yellow green mint teal cyan blue indigo purple pink brown | System colors |
| gray, gray2..gray6 | iOS system grays |
| scrim | Dimming behind sheets |

## iOS 27 system colors (light / dark)

red #FF383C / #FF4245, orange #FF8D28 / #FF9230, yellow #FFCC00 / #FFD600, green #34C759 / #30D158, mint #00C8B3 / #00DAC3, teal #00C3D0 / #00D2E0, cyan #00C0E8 / #3CD3FE, blue #0088FF / #0091FF, indigo #6155F5 / #6D7CFF, purple #CB30E0 / #DB34F2, pink #FF2D55 / #FF375F, brown #AC7F5E / #B78A66. These are for reference only; code uses tokens.

Note the iOS 26 and later blue is #0088FF, not the old #007AFF. Using #007AFF instantly dates the design.

## Background levels

- iOS plain screen: `bg` (white / black). Cards or grouped content inside: `bg-2`.
- iOS grouped (Settings style): screen `bg-grouped` (#F2F2F7 / #000000), cells `bg-grouped-2` (#FFFFFF / #1C1C1E), nested `bg-grouped-3`.
- Dark mode presented surfaces (sheets, popovers, alerts) switch to elevated values: bg becomes #1C1C1E, bg-2 #2C2C2E, bg-3 #3A3A3C. Add `data-cf-elevated` (web) or `elevated: true` (Flutter) on the presented container.
- macOS window background #FFFFFF / #1E1E1E. Sidebar uses the sidebar material token, not a gray.

## Accent rules

1. Exactly one accent. Default system blue. A brand accent must provide light, dark and increased contrast values and pass 4.5:1 as text on bg and 3:1 as a glyph.
2. Accent appears on: the single prominent button (tinted glass or filled), selected tab, selected segment label, toggle on track, links, progress fill, selection in lists (macOS), focus ring.
3. Accent never appears on: titles, body text, list row icons (use label-2 or the row's own system color in Settings style), large backgrounds.
4. If the content is colorful (photos, maps), keep bars and controls monochrome.

## Semantic status colors

- Destructive: red (button label or tinted glass for confirm destructive).
- Success: green; warning: orange; error: red; info: blue. Use with an icon and text, never color alone.
- Badges: red with white caption2 emphasized.

## Increased contrast and accessibility

- Every token has light and dark; system colors and grays also have HC variants (tokens). The generated CSS switches on `prefers-contrast: more` or `data-contrast="more"`.
- Text contrast: 4.5:1 for body, 3:1 for large text (title3 and up) and glyphs.
- Never convey state with color alone (add a checkmark, label, or shape).

## Forbidden

Tailwind palette classes (gray-500, slate-*, zinc-*, blue-600 and so on), shadcn default colors not remapped, pure #000 text on white in iOS (use label which is #000 but semantic), #007AFF, gradients on controls, colored section backgrounds, colored text for emphasis.

# 06 Elevation and layering

Source of truth: `tokens/elevation.json` (macOS 27 kit window, panel, menu, sliderKnob `[measured]`; knob & popover keep cross-platform `[estimate]` with Sketch/Figma `$kitReference` `[measured-kit-reference]`; raised, sheet, toast `[estimate]`).

## Layer stack (bottom to top)

1. Window or screen background (bg or bg-grouped).
2. Content (cells, cards, media). No shadow on iOS.
3. Scroll edge effect (soft fade under bars).
4. Functional layer: glass bars, floating buttons, tab bar.
5. Popovers, menus, context menus.
6. Sheets (with scrim).
7. Alerts (with scrim).
8. Toasts or HUDs (rare on Apple platforms; prefer inline feedback).

z-index tokens follow this order (layout.json zIndex).

## Shadow levels

| Level | Use | Light |
|---|---|---|
| none | content, rows, cards on iOS | none |
| raised | macOS cards, draggable items while idle | 0 1 3 / 8 percent + hairline |
| knob | toggle and slider knobs | 0 3 8 / 15 percent + 0 3 1 / 6 percent |
| popover | popovers, context menus | 0 8 32 / 16 percent + hairline |
| menu | macOS menus | kit menu stack |
| panel | macOS panels and HUD | 0 5 20 / 30 percent |
| windowActive | macOS active window (Tauri custom chrome only) | 0 36 100 / 40 percent + 0 0 1 / 80 percent |
| windowInactive | inactive window | 0 16 32 / 20 percent |
| sheet | iOS sheets | upward 0 -10 40 / 12 percent |
| toast | rare banners | 0 10 30 / 15 percent |

Use the generated variables (`--cf-shadow-popover`, `shadow-popover` class, `AppleElevation.popover`). Never write box-shadow values by hand.

## Rules

1. Shadows only on floating things. If it scrolls with content, it does not have a shadow (iOS).
2. Every floating surface has a hairline edge so it holds up on any background.
3. Dark mode: surfaces get lighter as they rise (elevated backgrounds). Shadows alone do not read in dark mode.
4. Dragged items lift: scale 1.03 to 1.05, shadow popover, spring snappy.
5. Scrims: sheet scrim 20 percent black (light) / 48 percent (dark), fades with the sheet spring.

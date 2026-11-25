# 09 Interaction states

Every interactive element implements all applicable states. Values come from `tokens/motion.json` press and hover, and kit control fills in `tokens/color.json`.

## State matrix

| Element | Pressed | Hover (pointer only) | Focus (keyboard) | Disabled | Selected |
|---|---|---|---|---|---|
| Glass button (iOS) | scale 1.1, rim brighter, press spring | scale 1.02 | focus ring | label-3, no glass highlight | tinted label or inner capsule |
| Prominent button | overlay black 10 percent (light) / white 10 percent (dark), scale 0.97 | overlay 5 percent | focus ring | 40 percent opacity | n/a |
| Bordered button (macOS) | fill control-pressed | none (macOS buttons do not hover highlight in content) | focus ring | fill control-disabled, label-3 | n/a |
| Toolbar item (macOS) | fill control-pressed | fill fill-2, 100ms | focus ring | label-3 | accent glyph |
| Plain text button / link | opacity 0.35 instantly, fade back 200ms | none | focus ring | label-3 | n/a |
| List row (iOS) | background fill-4 (gray5 light / gray4 dark) instantly, fades 250ms after release | none on iOS; iPad pointer highlight fill-4 | focus ring inset | label-3 | checkmark trailing in accent |
| Sidebar row (macOS) | n/a | none | focus ring | label-3 | accent background (key window) or unemphasized gray (non key), radius 8, white label |
| Menu item (macOS) | n/a | accent background, white label, radius 6, no delay | same as hover | label-3 | checkmark leading |
| Card | scale 0.98 press spring | iPad pointer lift 1.04 | focus ring | 40 percent opacity | accent 2px inner ring rare |
| Toggle | knob stretches 1.25 | none | focus ring | 40 percent opacity | track accent (or green when set in config) |
| Text field | n/a | none | focus ring (macOS) or caret only (iOS) | label-3 text, field disabled | n/a |

## Focus ring (`[measured]` macOS 27 kit + `[estimate]` contrast verification)

macOS style (and all keyboard focus on web and desktop): two outlines following the exact control shape: outer `3.5px` accent at `25%` (`[measured]`), inner `1px` accent at `15%` (`[measured]` macOS 27 kit `Global.Focus Ring` -> `--cf-focus-ring` / `focus-ring` class). Show only on keyboard focus (`:focus-visible`). iOS touch never shows focus rings.
- **Glass/Tinted Focus Ring Contrast Rule (`AX-8`):** When focused controls sit atop Liquid Glass or tinted banners, ensure the inner `1px` + outer `3.5px` focus ring meets `>= 3:1` non-text UI contrast (`[official]` WCAG 2.2) or enable `prefers-contrast: more` ring borders.

## Timing

- Pressed state appears on pointer down with zero delay. Never wait for click or tap up.
- Release animates back with the release spring.
- Hover appears within 0 to 100ms and only for `(hover: hover) and (pointer: fine)`.
- Long press triggers at 500ms with medium haptic and context menu.

## Cursor

App UI uses the default arrow cursor on buttons in macOS style. Pointer (hand) cursor only for web links. Text cursor in editable text only.

## Disabled

Visible but dimmed; never hide a disabled action that the user expects. Explain why it is disabled in footer text when it is not obvious.

## Loading inside controls

Buttons that start async work show an activity indicator replacing the icon or next to the label and may change the label ("Checkout" becomes "Checking Out..."), keeping the same width.

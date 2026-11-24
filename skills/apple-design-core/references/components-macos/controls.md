# macOS components: controls

Control sizes (estimate, macOS 26 and 27): mini 16, small 20, regular 24, large 28, extra large 36. Default is regular. Labels use body (13) for regular and large, subheadline (11) for small.

Fills from the macOS 27 kit: bordered idle black 8 percent (light) / white 7 percent (dark), pressed 16 percent, disabled 4 percent. On glass (toolbars, popovers) use overGlass fills (two layers).

---

## Push button

**Styles:** bordered (control fill, label), prominent / default (accent fill, white label, responds to Return), destructive (red label in bordered, or red fill in prominent destructive), plain (borderless text, accent), glass (in toolbars).
**Shape:** capsule on Liquid Glass surfaces and in macOS 27 dialogs; radius 6 in dense content areas when the button sits in a grid of fields (estimate, check kit).
**Metrics:** regular 24 tall, 10 horizontal padding, min width 72 for dialog buttons.
**States:** pressed control-pressed (instant), disabled control-disabled with label-3, focus ring. No hover highlight.
**Placement in dialogs:** bottom trailing; order: [Help] ... [Secondary] [Cancel] [Default]. Default is rightmost.
**Ellipsis** when the button opens more input ("Export...").
**Primitive:** `MacButton`.

## Popup button and pull down

Bordered capsule or 6 radius with label and chevron.up.chevron.down trailing (popup = choose value) or chevron.down (pull down = actions). Opens a menu aligned so the selected item sits over the button.
**Primitive:** `PopupButton`, `PullDownButton`.

## Checkbox

16 squircle radius 4, unchecked field fill with field-border hairline, checked accent fill with white checkmark (semibold), mixed shows minus. Label body trailing, 6 gap. Clicking the label toggles.
**Primitive:** `Checkbox`.

## Radio button

16 circle, selected accent fill with white 6 dot. Group vertically with 8 gap.
**Primitive:** `RadioGroup`.

## Switch

Capsule like iOS but smaller: 38 by 22 regular (estimate), accent when on. Use for settings that apply immediately; use checkboxes in forms that need a Save.
**Primitive:** `MacSwitch`.

## Segmented control

Capsule, fill track, selected segment raised white (light) or gray (dark) with knob shadow, or accent filled for tool selection. Height matches control size.
**Primitive:** `MacSegmented`.

## Slider

4 tall capsule track, accent fill, 20 white circular knob with sliderKnob shadow (kit), optional tick marks (kit tick colors).
**Primitive:** `MacSlider`.

## Stepper

Small vertical pair of chevrons in a 13 by 22 capsule next to a number field.

## Text field

**Anatomy:** field background (field token) with field-border hairline (kit: black 5 percent light, white 4 percent dark), radius 6, 24 tall (regular), 6 horizontal padding, body text, placeholder label-3.
**Focus:** focus ring (outer 3.5 accent 25 percent, inner 1 accent 15 percent), no border color change.
**Disabled:** field-disabled background, label-3 text.
**Search field:** capsule, magnifyingglass leading, clear button trailing.
**Token field and combo box:** chips are capsules fill-2 with body label.
**Primitive:** `MacTextField`, `MacSearchField`.

## Color well, date picker, path control

Use native equivalents when possible. Date picker: text field style with stepper, or graphical calendar in a popover.

## Progress and activity

Bar: 6 tall capsule, accent fill, indeterminate uses moving gradient segment (kit fade mask). Spinner: 16 or 32 system style, label-2.

## Help button

22 circle, bordered, question mark glyph, bottom leading in dialogs, opens help.

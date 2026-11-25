# macOS components: controls

Control sizes (`[estimate]`, macOS 26 and 27; `Oct 2026` touch-display rule: keep layout stable `[official]`): mini `16`, small `20`, regular `24`, large `28`, extra large `36`. Default is `regular`. Labels use `body` (`13` `[official]`) for `regular` and `large`, `subheadline` (`11`) for `small`.

Fills from the macOS 27 kit (`tokens/source/apple-macos-27-ui-kit.tokens.json` `[measured]`): bordered idle `#000000@0.08` (light) / `#FFFFFF@0.07` (dark), pressed `16%`, disabled `4%`. On glass (toolbars, popovers) use `overGlass` fills (two layers `[measured]`).

---

## Push button

**Styles:** bordered (`control` fill, `label`), prominent / default (`accent` fill, white label, responds to `Return`), destructive (red label in bordered, or red fill in prominent destructive), plain (borderless text, `accent`), glass (in toolbars).
**Shape:** capsule on Liquid Glass surfaces and in macOS 27 dialogs (`[inferred]`); radius `6` in dense content areas when the button sits in a grid of fields (`[estimate]`).
**Metrics:** `regular` `24` tall `[estimate]`, `10` horizontal padding `[estimate]`, min width `72` (`--cf-mac-btn-min-w`) `[estimate]` for dialog buttons; `macos.button.imagePadding`: `10px/pt` clickable margin around borderless image buttons (`[official]`).
**States:** pressed `control-pressed` (instant), disabled `control-disabled` with `label-3`, `focus-ring`. No hover highlight.
**Hit targets (`Oct 2026` `[official]`):** `28 × 28` recommended, `20 × 20` minimum clickable; expand hit target cleanly without moving or resizing visible controls on touch-capable Macs (`[official]`).
**Placement in dialogs:** bottom trailing; order: `[Help] ... [Secondary] [Cancel] [Default]`. Default is rightmost.
**Ellipsis** when the button opens more input (`"Export..."`).
**Primitive:** `MacButton`.
**Verify:** Default button bottom-trailing, `#000@0.08`/`#FFF@0.07` kit fill on bordered idle, stable sizing on touch + pointer.

## Popup button and pull down

Bordered capsule or `6` radius `[estimate]` with label and `chevron.up.chevron.down` trailing (popup = choose value) or `chevron.down` (pull down = actions). Opens a menu aligned so the selected item sits over the button. Use Pop-Up instead of radio groups when options exceed `~5` (`[official]`).
**Primitive:** `PopupButton`, `PullDownButton`.
**Verify:** Used instead of radio stacks whenever choices `> 5`.

## Checkbox

`16` squircle radius `4` `[estimate]`, unchecked `field` fill with `field-border` hairline (`#000000@0.05` light `[measured]` / `#FFFFFF@0.04` dark `[measured]`), checked `accent` fill with white checkmark (semibold), `mixed` shows minus. Label `body` trailing, `6` gap. Clicking the label toggles (`[official]`). Never place checkboxes in the window frame or toolbar (`[official]`).
**Primitive:** `Checkbox`.
**Verify:** Supports `mixed` indeterminate state, clicking `<label>` toggles `checked`, placed in content/forms only.

## Radio button

`16` circle `[estimate]`, selected `accent` fill with white `6` dot. Group vertically with `8` gap (`[estimate]`), max `~5` options (over `~5` -> Pop-Up button `[official]`).
**Primitive:** `RadioGroup`.
**Verify:** `role="radiogroup"`, `<= 5` options vertically stacked.

## Switch

Capsule like iOS but smaller: `38 × 22` regular `[estimate]`, `accent` when on. Use **Switch** for settings that apply immediately (`[official]`); use **Checkbox** in forms requiring a confirmation/Save step (`[official]`); **Radio** for `<= 5` mutually exclusive choices (`[official]`).
**Primitive:** `MacSwitch` (or `Toggle` under `data-cf-platform="macos"`).
**Verify:** Dimensions `38×22` when `data-cf-platform="macos"`; used only for instant-apply toggles.

## Segmented control

Capsule, `fill` track, selected segment raised white (`light`) or `gray3` (`dark`) with `shadow-knob`, or `accent` filled for tool selection. Height matches `control-regular` (`24` `[estimate]`). Never mix text and icons (`[official]`); support RTL arrow keys.
**Primitive:** `MacSegmented` (or `SegmentedControl` under `data-cf-platform="macos"`).
**Verify:** `h-[var(--cf-control-regular)]`, uniform text-only or icon-only labels, keyboard arrow navigation works.

## Slider

**Linear & Circular (`[official]`):** Linear (`4` tall capsule track `[estimate]`, `accent` fill, `20` white circular knob with `sliderKnob` shadow `[measured]` kit, optional kit tick marks) and Circular (`0–360°` rotary dial `[official]`). Show value tooltip on pointer hover over thumb (`[official]`).
**Primitive:** `MacSlider` (or `Slider` under `data-cf-platform="macos"`).
**Verify:** `20pt` circular thumb on macOS (`sliderKnob` kit shadow), optional hover value tooltip.

## Stepper

Small vertical pair of chevrons in a `13 × 22` capsule `[estimate]` next to a number field.
**Verify:** Paired adjacent to numeric `MacTextField`.

## Text field

**Anatomy:** `field` background (`#FFFFFF` light `[measured]` / `#FFFFFF@0.1` dark `[measured]`) with `field-border` hairline (`#000000@0.05` light `[measured]` / `#FFFFFF@0.04` dark `[measured]`), radius `6` `[estimate]`, `24` tall (`regular` `[estimate]`), `6` horizontal padding, `body` text (`13pt` `[official]`), placeholder `label-3`.
**Focus:** measured kit `focus-ring` (outer `3.5px` `#0088FF@0.25`, inner `1px` `#0088FF@0.15` `[measured]`), no border color change.
**Disabled:** `field-disabled` background, `label-3` text.
**Search field:** capsule, `magnifyingglass` leading, clear button trailing.
**Token field and combo box:** chips are capsules `fill-2` with `body` label.
**Primitive:** `MacTextField`, `MacSearchField`.
**Verify:** Kit `field-border` + dual-layer `focus-ring`, expansion tooltip on truncated values (`[official]`).

## Color well, date picker, path control

Use native equivalents when possible. Date picker: text field style with stepper, or graphical calendar in a popover (`[official]`).
**Verify:** Native pickers on Tauri/macOS; popover calendar on web.

## Progress and activity

Bar: `6` tall capsule `[estimate]`, `accent` fill, indeterminate uses moving gradient segment (`kit` fade mask). Spinner: `16` or `32` system style, `label-2` `[estimate]`.
**Verify:** Indeterminate indicator only after `300ms` delay.

## Help button

`22` circle `[estimate]`, bordered, question mark glyph, bottom leading in dialogs, opens help (`[official]`).
**Verify:** Placed bottom-leading opposite the `[Cancel] [Default]` cluster.

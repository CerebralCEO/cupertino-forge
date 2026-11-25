# iOS components: controls

---

## Button

**Styles (pick one by hierarchy):**
| Style | Look | Use |
|---|---|---|
| `prominentGlass` | accent tinted glass capsule, white label | THE primary action (`1–2` max per view `[official]`; never mark destructive as primary `[official]`) |
| `glass` | regular glass capsule, `label-glass` text | secondary actions on bars and over content |
| `filled` (`borderedProminent` in content) | accent fill capsule, white label | primary action inside content (forms, onboarding) |
| `tinted` (`bordered`) | fill-3 or accent at `15%` capsule, accent label | secondary action inside content |
| `gray` | `fill-3` capsule, `label` | neutral secondary |
| `plain` | text only, accent label | tertiary, inline actions |
| `destructive` | red label (plain or tinted), or red tinted glass for confirmations | delete |
| `iconOnly` | `44` glass circle | toolbar and bar actions |

**Sizes:** mini `28`, small `32`, medium `36`, large `50`, extra large `56` `[estimate]` (HIG publishes `28/32/44/52/64` specifically for visionOS `[official]`). Large is the standard full-width primary button in onboarding and forms (width = container minus margins, max `400` centered on wide screens `[estimate]`).
**Label:** `body` emphasized (`medium`, `large`), `subheadline` emphasized (`small`), `caption1` emphasized (`mini`). Optional leading icon at `8` gap.
**Padding:** small `12`, medium `14`, large `20` horizontal `[estimate]`.
**States:** see `09-interaction-states.md`. Loading: activity indicator replaces the icon, label may change (`"Saving..."`), width fixed.
**Feedback:** no haptic on tap. Success or error haptic when the async result arrives.
**A11y:** `44 × 44` recommended hit target, `28 × 28` absolute minimum `[official]` (extend hit bounds around `mini`/`small` buttons by `~12pt` bezeled / `~24pt` bezel-less `[official]`); `role="button"`; disabled announced.
**Don't:** gradients, outlines (except macOS), icons on both sides, all caps, `> 2` prominent buttons per view.
**Primitive:** `Button` with `variant` and `size` props; `IconButton`.
**Verify:** Effective hit target `>= 44×44pt`, `<= 2` prominent actions per view, `text-accent-contrast` / `text-label-glass` applied on glass variants.

## Toggle (switch)

**Anatomy:** capsule track, capsule knob (iOS 26+ knob is a wide pill), `accent` (or `green` if configured) track when on, `fill` when off.
**Metrics:** `64 × 28` track, `38 × 24` knob, `2` inset `[estimate]` (legacy `<=18` `UISwitch` `intrinsicContentSize` was `51 × 31` `[measured]`).
**Behavior:** tap toggles; drag knob; while pressed the knob turns into Liquid Glass (no solid `bg-white` override) and stretches `1.25` `[estimate]`; release settles with `snappy` spring (`[official]`).
**Feedback:** selection haptic on change (audio `toggle-on`/`toggle-off` fallback only when haptic unavailable and sounds enabled `[inferred]`).
**Placement:** trailing in a list row with the label leading; the whole row is not tappable except the switch (Apple Settings behavior).
**A11y:** `role="switch"`, `aria-checked`.
**Primitive:** `Toggle`.
**Verify:** Knob turns translucent glass while pressed; track toggles state without double audio+haptic firing.

## Slider

**Anatomy:** `6` tall capsule track `[estimate]`; filled part `accent`; knob `38 × 24` white pill with `shadow-knob` `[estimate]`; becomes Liquid Glass (`cf-glass` without solid white override) while dragging; optional min and max icons (`speaker.fill`, `speaker.wave.3.fill`).
**Feedback:** light haptic at detents and edges (`[inferred]`).
**Primitive:** `Slider`.
**Verify:** Thumb switches to glass during drag and scales `1.15`; detents snap cleanly.

## Segmented control

**Anatomy:** capsule `fill-3` track, selected segment is a white (`light`) or `gray3` (`dark`) capsule with `shadow-knob`, label `subheadline` (emphasized when selected).
**Metrics:** `36` tall `[estimate]`, `2` to `5` segments, equal widths. Never mix text and icons inside a single segmented control (`[official]`).
**Behavior:** tap, drag, or RTL-aware arrow keys (`ArrowLeft`/`ArrowRight`/`Home`/`End` with roving `tabIndex`); indicator slides with `snappy` spring (`[official]`) and stretches while dragging `[estimate]`.
**Feedback:** selection haptic.
**Use:** switching views of the same content (`Day / Week / Month`). Not for navigation between unrelated screens (`[official]`).
**Primitive:** `SegmentedControl`.
**Verify:** Uniform text-only OR icon-only labels; `ArrowLeft`/`ArrowRight` move selection & focus (RTL aware).

## Stepper

**Anatomy:** capsule with minus and plus halves split by a hairline, `fill-3` background.
**Metrics:** `94 × 32` `[estimate]`.
**Feedback:** selection haptic per step; long press repeats.
**Primitive:** `Stepper`.
**Verify:** Disabled state dims minus/plus at `min`/`max`; separator uses hairline token.

## Picker

- **Styles (`[official]`):** `compact` (capsule chips in `fill-3` opening a popover), `inline` (calendar or list in context), and `wheels` (selection band `fill-4` capsule; selection haptic per row).
- **Rules (`[official]`):** Present inline or in a popover directly in context — do NOT push a separate full screen solely for a picker; date/time minute intervals MUST divide evenly into `60` (`[official]`).
**Primitive:** `Picker`, `WheelPicker`, `DatePicker`.
**Verify:** Minute interval divides `60`; picker opens inline/popover rather than pushing a separate navigation route.

## Text field

**Anatomy:** in grouped lists: label leading or placeholder only, no border, row background. Standalone: `fill-3` rounded rect squircle radius `12` `[estimate]`, `44` tall `[estimate]`, `16` padding `[estimate]`. Clear button appears while editing.
**States:** focused shows caret only (no ring on touch); error shows red `footnote` below and red glyph, never red border only (`[official]`).
**Keyboard:** correct type (`email`, `number`, `url` `[official]`), return key label matches action (`Search`, `Send`, `Done`), autofill `textContentType` (`[official]`).
**Primitive:** `TextField`, `SecureField`, `TextArea`.
**Verify:** Standalone field uses squircle `radius-text-field-rounded`; errors announce via `aria-describedby` + visible text.

## Checkbox and radio

iOS does not use checkboxes (`[official]`). Use list rows with a trailing checkmark (`accent`) for single or multi selection, or `Toggle` switches for on/off settings.
**Verify:** Zero standalone desktop checkboxes on iOS views.

## Activity indicator and progress

- Activity indicator: `8` or `12` spoke spinner (system style), `label-2` color, sizes `20` and `37` `[estimate]`. Show only after `300ms` of waiting (`useDelayedFlag`).
- Progress bar: `4` tall capsule, `fill-3` track, `accent` fill, animates with `smooth` spring (`[official]`).
- Circular progress (downloads): `2.5` stroke ring with a stop square in the center `[estimate]`.
**Primitive:** `ActivityIndicator`, `ProgressBar`, `ProgressRing`.
**Verify:** Spinner delayed `300ms`; uses shared CSS keyframes without per-instance `<style>` tags.

## Badge

Red capsule, white `caption2` emphasized, min `18` tall, `5` padding `[estimate]`, placed top trailing on icons with `4` overlap `[estimate]`.
**Verify:** Contrast ratio `>= 4.5:1` on `systemRed` with white `caption2` text.

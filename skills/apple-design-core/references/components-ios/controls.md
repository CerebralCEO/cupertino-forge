# iOS components: controls

---

## Button

**Styles (pick one by hierarchy):**
| Style | Look | Use |
|---|---|---|
| prominentGlass | accent tinted glass capsule, white label | THE primary action, one per view |
| glass | regular glass capsule, label-glass text | secondary actions on bars and over content |
| filled (borderedProminent in content) | accent fill capsule, white label | primary action inside content (forms, onboarding) |
| tinted (bordered) | fill-3 or accent at 15 percent capsule, accent label | secondary action inside content |
| gray | fill-3 capsule, label | neutral secondary |
| plain | text only, accent label | tertiary, inline actions |
| destructive | red label (plain or tinted), or red tinted glass for confirmations | delete |
| iconOnly | 44 glass circle | toolbar and bar actions |

**Sizes:** mini 28, small 32, medium 36, large 50, extra large 56 (estimate). Large is the standard full width primary button in onboarding and forms (width = container minus margins, max 400 centered on wide screens).
**Label:** body emphasized (medium, large), subheadline emphasized (small), caption1 emphasized (mini). Optional leading icon at 8 gap.
**Padding:** small 12, medium 14, large 20 horizontal.
**States:** see 09-interaction-states.md. Loading: activity indicator replaces the icon, label may change ("Saving..."), width fixed.
**Feedback:** no haptic on tap. Success or error haptic when the async result arrives.
**A11y:** 44 minimum target; role button; disabled announced.
**Don't:** gradients, outlines (except macOS), icons on both sides, all caps, two prominent buttons side by side.
**Primitive:** `Button` with `variant` and `size` props; `IconButton`.

## Toggle (switch)

**Anatomy:** capsule track, capsule knob (iOS 26+ knob is a wide pill), accent (or green if configured) track when on, fill when off.
**Metrics:** 64 by 28 track, 38 by 24 knob, 2 inset (estimate).
**Behavior:** tap toggles; drag knob; while pressed the knob turns into Liquid Glass and stretches 1.25; release settles with snappy spring.
**Feedback:** selection haptic on change; sound toggle-on/off only if sounds enabled.
**Placement:** trailing in a list row with the label leading; the whole row is not tappable except the switch (Apple Settings behavior).
**A11y:** role switch, aria-checked.
**Primitive:** `Toggle`.

## Slider

**Anatomy:** 6 tall capsule track; filled part accent; knob 38 by 24 white pill with knob shadow; becomes glass while dragging; optional min and max icons (speaker.fill, speaker.wave.3.fill).
**Feedback:** selection haptic at detents and edges.
**Primitive:** `Slider`.

## Segmented control

**Anatomy:** capsule fill-3 track, selected segment is a white (light) or gray3 (dark) capsule with knob shadow, label subheadline (emphasized when selected).
**Metrics:** 36 tall (estimate), 2 to 5 segments, equal widths.
**Behavior:** tap or drag; indicator slides with snappy and stretches while dragging.
**Feedback:** selection haptic.
**Use:** switching views of the same content (Day Week Month). Not for navigation between unrelated screens.
**Primitive:** `SegmentedControl`.

## Stepper

**Anatomy:** capsule with minus and plus halves split by a hairline, fill-3 background.
**Metrics:** 94 by 32.
**Feedback:** selection haptic per step; long press repeats.
**Primitive:** `Stepper`.

## Picker

- Menu picker (default in lists): trailing value in label-2 plus chevron.up.chevron.down; tapping opens a menu.
- Wheel picker: inline in a sheet or row expansion; selection band fill-4 capsule; selection haptic per row.
- Date picker: compact (capsule chips with the date and time in fill-3) that open a calendar popover; inline calendar for date centric apps.
**Primitive:** `Picker`, `WheelPicker`, `DatePicker`.

## Text field

**Anatomy:** in grouped lists: label leading or placeholder only, no border, row background. Standalone: fill-3 rounded rect radius 12 (estimate), 44 tall, 16 padding. Clear button appears while editing.
**States:** focused shows caret only (no ring on touch); error shows red footnote below and red glyph, never red border only.
**Keyboard:** correct type (email, number, url), return key label matches action (Search, Send, Done), autofill content types.
**Primitive:** `TextField`, `SecureField`, `TextArea`.

## Checkbox and radio

iOS does not use checkboxes. Use list rows with a trailing checkmark (accent) for single or multi selection, or toggles for on and off settings.

## Activity indicator and progress

- Activity indicator: 8 or 12 spoke spinner (system style), label-2 color, sizes 20 and 37. Show only after 300ms of waiting.
- Progress bar: 4 tall capsule, fill-3 track, accent fill, animates with smooth spring.
- Circular progress (downloads): 2.5 stroke ring with a stop square in the center.
**Primitive:** `ActivityIndicator`, `ProgressBar`, `ProgressRing`.

## Badge

Red capsule, white caption2 emphasized, min 18 tall, 5 padding, placed top trailing on icons with 4 overlap.

# iOS components: content

---

## List (the backbone of iOS apps)

**Styles:**
| Style | Background | Use |
|---|---|---|
| insetGrouped | screen bg-grouped, sections bg-grouped-2 with radius 26, inset 16 | settings, forms, detail screens |
| plain | bg, full width rows, hairlines inset 16 | feeds, messages, mail |
| sidebar | iPad sidebar | navigation |

**Row anatomy:** optional leading icon (Settings style 29 squircle or plain glyph) or avatar (40 circle), primary text (body), optional subtitle (subheadline label-2), trailing value (body label-2), trailing accessory (chevron.right label-3 13pt semibold for navigation, checkmark accent for selection, toggle, info button).
**Metrics:** min height 52 (estimate; 44 compact), subtitle rows 64, leading inset 16, icon to text 12 (row icons 29 give text inset 60), trailing inset 16, chevron 7 by 12 visual.
**Separators:** 0.5 hairline from the text start to the trailing edge; none after the last row; none between sections.
**Section header:** headline (sentence case) 16 inset, 8 above the section; footer: footnote label-2, 8 below.
**States:** pressed row fill-4 instantly, fades 250ms after release; selected (multi select) shows a leading circle checkmark filled accent.
**Swipe actions:** trailing swipe reveals actions (Delete red, Archive or Flag colored squares filling the row height); full swipe performs the first action with light haptic at the threshold. Leading swipe for secondary (mark read).
**Editing:** Edit button switches to reorder handles and delete circles.
**Primitive:** `List`, `ListSection`, `ListRow`, `SwipeActions`.

## Grid and collections

Media grids: square or 4:3 tiles, 2 gap (photos) or 12 to 16 gap (cards), thumbnail radius 8 to 12 squircle, no shadows. Card collections: bg-2 cards, radius 22, 16 padding, title headline, subtitle subheadline label-2.

## Cards

Use sparingly on iOS (Apple prefers lists). When used: bg-2 (or bg-grouped-2 on grouped screens), squircle 22, padding 16, no border, no shadow, press scale 0.98. Media cards may bleed the image to the card edges with concentric corners.

## Empty, loading, error

See patterns/states.md.

## Page control

Dots 8 diameter, 9 gap, current label, others label-3; glass capsule background when over media. Only for paged media or onboarding.

## Disclosure group

Row with chevron.right rotating 90 degrees on expand (snappy), children indented 16.

## Charts (Swift Charts look)

- Bars: rounded top (radius 4 squircle), accent or system colors, 60 percent bar fill of the slot.
- Lines: 2.5 stroke, rounded joins, gradient area fill from color at 20 percent to 0.
- Axes: caption2 label-2, gridlines separator at 50 percent, no chart borders.
- Selection: vertical rule label-3 plus a glass capsule annotation with values.
- Animate in with smooth spring once.

## Avatars and media

Avatars circle with initials (title3 emphasized white on a gray gradient system style is allowed: gray2 to gray), sizes 24, 32, 40, 60, 80. Images use squircle corners and a 0.5 inner hairline at 8 percent black to separate light images from white backgrounds.

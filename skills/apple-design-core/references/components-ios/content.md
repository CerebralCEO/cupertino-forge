# iOS components: content

---

## List (the backbone of iOS apps)

**Styles:**
| Style | Background | Use |
|---|---|---|
| `insetGrouped` | screen `bg-grouped`, sections `bg-grouped-2` with radius `26` `[estimate]`, inset `16` `[estimate]` | settings, forms, detail screens |
| `plain` | `bg`, full width rows, hairlines inset `16` `[estimate]` | feeds, messages, mail |
| `sidebar` | iPad sidebar | navigation |

**Row anatomy:** optional leading icon (Settings style `29` squircle `[estimate]` or plain glyph) or avatar (`40` circle `[estimate]`), primary text (`body` `[official]`), optional subtitle (`subheadline` `label-2` `[official]`), trailing value (`body` `label-2`), trailing accessory (`chevron.right` `label-3` 13pt semibold for navigation, checkmark `accent` for selection, toggle, info button).
**Metrics:** min height `52` `[estimate]` (min accessible `44` `[official]`), subtitle rows `64` `[estimate]`, leading inset `16` `[estimate]`, icon to text `12` `[estimate]` (row icons `29` give text inset `60` `[estimate]`), trailing inset `16` `[estimate]`, chevron `7 × 12` visual `[estimate]`.
**Separators:** `0.5` hairline `[estimate]` from the text start (`insetInlineStart`) to the trailing edge; none after the last row; none between sections.
**Section header:** title-style capitalization (NOT forced ALL CAPS `[official]`, breaking change from iOS `<=18`), `headline` `16` inset `[estimate]`, `8` above the section; footer: `footnote` `label-2`, `8` below.
**Lists & indexes rule:** Never render an alphabetical vertical section index on a list whose rows contain disclosure indicators or trailing buttons — touch collision occurs (`[official]`).
**States:** pressed row `fill-4` instantly, fades `250ms` after release `[estimate]`; selected (multi select) shows a leading circle checkmark filled `accent`.
**Swipe actions:** trailing swipe reveals actions (Delete red, Archive or Flag colored squares filling the row height); full swipe performs the first action with light haptic at the threshold. Leading swipe for secondary (mark read).
**Editing:** Edit button switches to reorder handles and delete circles.
**Primitive:** `List`, `ListSection`, `ListRow`, `SwipeActions`.
**Verify:** Row height `>= 44pt`, title-style section headers (no all-caps), hairline aligns under text, no alphabetical index over trailing accessories.

## Grid and collections

Media grids: square or 4:3 tiles, `2` gap (photos) or `12` to `16` gap (cards) `[estimate]`, thumbnail radius `8` to `12` squircle `[estimate]`, no shadows. Card collections: `bg-2` cards, radius `22` `[estimate]`, `16` padding, title `headline`, subtitle `subheadline` `label-2`.
**Verify:** Concentric squircle radii, `0` shadows on grid tiles, even `4pt`-step gutters.

## Cards

Use sparingly on iOS (Apple prefers lists). When used: `bg-2` (or `bg-grouped-2` on grouped screens), squircle `22` `[estimate]`, padding `16` `[estimate]`, no border, no shadow, press scale `0.98` `[estimate]`. Media cards may bleed the image to the card edges with concentric corners (`[official]`).
**Verify:** No dropshadow or glass on content cards; press feedback present on interactive cards only.

## Empty, loading, error

See `patterns/states.md`.
**Verify:** Centered layout uses semantic `label-2`/`label-3` and single clear action when recoverable.

## Page control

Dots `8` diameter, `9` gap `[estimate]`, current `label`, others `label-3`; glass capsule background when over media (`[inferred]`). Only for paged media or onboarding.
**Verify:** High-contrast active indicator; glass capsule used only over media.

## Disclosure group

Row with `chevron.right` rotating `90` degrees on expand (`snappy` `[official]`), children indented `16` `[estimate]`.
**Verify:** Chevron rotates smoothly with `snappy` spring; expanded content swaps via crossfade under Reduce Motion.

## Charts (Swift Charts look)

- Bars: rounded top (radius `4` squircle `[estimate]`), accent or system colors, `60%` bar fill of the slot.
- Lines: `2.5` stroke `[estimate]`, rounded joins, gradient area fill from color at `20%` to `0`.
- Axes: `caption2` `label-2`, gridlines `separator` at `50%`, no chart borders.
- Selection: vertical rule `label-3` plus a glass capsule annotation with values.
- Animate in with `smooth` spring (`[official]`) once.
**Verify:** Readable axis labels (`caption2`), single glass capsule selection callout, no chart borders.

## Widgets & Live Activities (`Oct 2026` `[official]`)

- **Widgets:** standard margin `16pt` (`11pt` tight margin for crowded layouts `[official]`), minimum text size `11pt` `[official]`, support Dynamic Type up to `AX5`, avoid update animations longer than `2s` `[official]`.
- **Live Activities & Dynamic Island:** Lock Screen banner margin `14pt` `[official]`, Dynamic Island `isDynamicIslandLimitedInWidth` compact circular region `28 × 28pt` `[official]`, limit interactivity to at most `1` essential interactive control per compact/expanded region (`[official]`).
**Verify:** Widget margin `>= 16pt` (`11pt` tight), font size `>= 11pt`, Live Activity lock margin `14pt`, at most 1 interactive control.

## Avatars and media

Avatars circle with initials (`title3` emphasized white on a gray gradient system style is allowed: `gray2` to `gray` `[estimate]`), sizes `24, 32, 40, 60, 80` `[estimate]`. Images use squircle corners (`[official]` continuous curve) and a `0.5` inner hairline at `8%` black to separate light images from white backgrounds (`[estimate]`).
**Verify:** Continuous squircle corners on media tiles and inner `0.5pt` hairline on light photos over light bg.

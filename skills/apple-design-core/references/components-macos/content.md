# macOS components: content

## Table and list

**Anatomy:** header row `28` tall `[estimate]` (`subheadline` emphasized `label-2`, sortable with `chevron.up` or `chevron.down`), rows `24` (`32` large) `[estimate]`, `alternatingRows: true` (`bg` and `fill-5` `[official]`) or plain with no horizontal separators, resizable sortable columns (`[official]`), `body` text, numbers trailing-aligned and `tabular-nums`.
**Selection:** squircle radius `6` `[estimate]` inset `6` horizontally, `accent` with white text in key window, unemphasized gray otherwise; multi select with `Cmd` and `Shift`.
**Interaction:** double click opens; `Return` renames; `Delete` moves to trash with confirmation for permanent deletes; drag to reorder with insertion line in `accent`.
**Column dividers:** hairlines in header only (`[estimate]`).
**Primitive:** `MacTable`, `MacList`.
**Verify:** Row height `24pt` (never iOS `44–52pt`), alternating row fill active, numeric columns use `tabular-nums`, column headers resizable/sortable.

## Outline view (`OutlineView` `[official]`)

Disclosure triangles (`chevron.right` `10` `label-2` `[estimate]`) rotate `90` with `snappy` spring (`[official]`), `16` indent per level `[estimate]`, descriptive section/group headers without trailing colons (`[official]`).
**Verify:** Descriptive headers omit colons; disclosure triangles animate with `snappy` spring (or crossfade under Reduce Motion).

## Collection and grids

Icons or thumbnails with labels below (`body`, `2` lines, center aligned), selection draws a squircle `fill-2` behind the icon and `accent` capsule behind the label. Use `NSBackgroundExtensionView` / `.backgroundExtensionEffect()` (`[official]`) when hero media extends softly behind edge-to-edge sidebars or inspectors.
**Verify:** Continuous squircle selection frame behind thumbnail + accent capsule around label.

## Forms (Settings style)

Grouped form sections: section background `bg-grouped-2` with radius `10` `[estimate]`, rows `40` tall `[estimate]`, label leading (`body`), control trailing, hairline separators inset `10` `[estimate]`, section header `subheadline` emphasized `label-2` (title-style capitalization, no ALL CAPS `[official]`). Footnotes below in `subheadline` `label-2`.
**Verify:** Grouped sections use `bg-grouped-2` + radius `10`, title-style headers, immediate-apply controls in Settings (no OK button).

## Empty, loading, error

See `patterns/states.md`. On macOS empty states center in the content area: `48` glyph (`--cf-empty-glyph-size`) `label-3`, `title2` emphasized, `body` `label-2` message, optional bordered button.
**Verify:** `--cf-empty-glyph-size` resolves to `48px` under `[data-cf-platform="macos"]`.

## Content padding and density

`20` padding around content `[estimate]`, `12` between form rows `[estimate]`, denser than iOS; never use iOS `44` to `52` row heights on Mac. On Macs with touch displays (`Oct 28, 2026` `[official]`), keep layout and control positions stable across touch and pointer input.
**Verify:** Content padding `20pt`, dense `24–40pt` rows, stable geometry across touch and trackpad input.

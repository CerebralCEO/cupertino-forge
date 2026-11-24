# macOS components: content

## Table and list

**Anatomy:** header row 28 tall (subheadline emphasized label-2, sortable with chevron.up or chevron.down), rows 24 (32 large), alternating backgrounds (bg and fill-5) or plain with no separators, body text, numbers trailing aligned and tabular.
**Selection:** squircle radius 6 inset 6 horizontally, accent with white text in key window, unemphasized gray otherwise; multi select with Cmd and Shift.
**Interaction:** double click opens; Return renames; Delete moves to trash with confirmation for permanent deletes; drag to reorder with insertion line in accent.
**Column dividers:** hairlines in header only.
**Primitive:** `MacTable`, `MacList`.

## Outline view

Disclosure triangles (chevron.right 10 label-2) rotate 90 with snappy, 16 indent per level.

## Collection and grids

Icons or thumbnails with labels below (body, 2 lines, center aligned), selection draws a squircle fill-2 behind the icon and accent capsule behind the label.

## Forms (Settings style)

Grouped form sections: section background bg-grouped-2 with radius 10, rows 40 tall, label leading (body), control trailing, hairline separators inset 10, section header subheadline emphasized label-2. Footnotes below in subheadline label-2.

## Empty, loading, error

See patterns/states.md. On macOS empty states center in the content area: 48 glyph label-3, title2 emphasized, body label-2 message, optional bordered button.

## Content padding and density

20 padding around content, 12 between form rows, denser than iOS; never use iOS 44 to 52 row heights on Mac.

# macOS components: navigation

## Sidebar (macOS 27)

**Anatomy:** edge to edge leading column with the sidebar material (sidebar token, vibrant), sections with a header (subheadline emphasized label-2, collapsible on hover chevron), rows with a 16 glyph (accent colored by default in macOS 27, or a fixed semantic color) and body label.
**Metrics:** width 220 default (180 to 320, user resizable, collapsible), row height 32, row inner padding 10, glyph to text 8, section gap 12 (estimate).
**Selection:** squircle radius 8 inset 10 from sidebar edges; key window: accent background with white label and white glyph; non key window: unemphasized gray (selection token) with label color.
**Inactive window:** sidebar-inactive token (more opaque, less vibrant).
**States:** no hover highlight on rows; pressed shows selection immediately.
**Keyboard:** arrow keys move selection, Cmd+Option+S toggles sidebar.
**Primitive:** `Sidebar`, `SidebarSection`, `SidebarRow`.

## Toolbar

**Anatomy:** groups of icon buttons (glyph 16 to 18) inside glass capsules, optional labels below in "icon and text" mode, flexible spaces, search field trailing, a primary action may be a prominent capsule (accent) at trailing.
**Item size:** 28 to 32 tall, icons centered, 6 between items in a group.
**States:** hover fill-2 behind the item (100ms), pressed control-pressed, toggled on shows accent glyph.
**Overflow:** chevron.right.2 menu when the window is narrow.
**Primitive:** `Toolbar`, `ToolbarGroup`, `ToolbarItem`, `ToolbarSearch`.

## Tab view and tabs

- Document tabs (like Safari, Finder): tab bar under the toolbar, tabs equal width, selected tab bg, others fill, close button on hover.
- Settings or segmented tabs: segmented control centered in the toolbar or top of content.

## Split views

Three column (sidebar, list, detail) for mail style apps; two column (sidebar, detail) for most. Dividers are hairlines, draggable with a 6 wide invisible handle, cursor col-resize.

## Inspector

Trailing column 280 wide (240 to 320), toggled with a toolbar button (sidebar.right) and Cmd+Option+I, grouped form sections with subheadline emphasized headers.

## Navigation behavior

- Back and forward buttons (chevron.left, chevron.right) in a glass group at the toolbar leading when there is history.
- No breadcrumbs except path control in file browsers.
- Keyboard shortcuts for every primary navigation (Cmd+1..9 for sidebar items).

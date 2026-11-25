# macOS components: navigation

## Sidebar (macOS 27)

**Anatomy:** edge-to-edge leading column with the vibrant `sidebar` material (Light `#FAFAFA@0.8` `[measured]` kit / Dark `#0C0C0C@0.85` `[measured]` kit), sections with a header (`subheadline` emphasized `label-2`, collapsible on hover chevron), rows with a `16` glyph (`June 8, 2026` HIG `[official]`: icons take app/system `accent` color by default, or fixed semantic color) and `body` label. Use `NSBackgroundExtensionView` / `.backgroundExtensionEffect()` (`[official]`) to mirror/extend hero media smoothly beneath the sidebar.
**Metrics:** width `220` default (`180` to `320` `[estimate]`, user resizable, collapsible), row height `32` `[estimate]`, row inner padding `10` `[estimate]`, glyph to text `8` `[estimate]`, section gap `12` `[estimate]`.
**Selection:** squircle radius `8` `[estimate]` inset `10` from sidebar edges; key window: `accent` background with white label and white glyph (`[official]`); non-key window: unemphasized gray (`selection` / `fill` token) with `label` color.
**Inactive window:** `sidebar-inactive` token (`[measured]` kit, more opaque, less vibrant).
**States:** no hover highlight on rows; pressed shows selection immediately.
**Keyboard:** arrow keys move selection, `Cmd+Option+S` toggles sidebar (`[official]`).
**Primitive:** `Sidebar`, `SidebarSection`, `SidebarRow` (`MacSidebarSection`, `MacSidebarRow`).
**Verify:** Edge-to-edge sidebar (NOT floating Tahoe slab), `#FAFAFA@0.8` / `#0C0C0C@0.85` kit fill, colored sidebar icons, inactive window dims selection & switches to `sidebar-inactive`.

## Toolbar

**Anatomy:** groups of icon buttons (glyph `16` to `18` `[estimate]`) inside glass capsules (`ToolbarSpacer.fixed` separates distinct groups `[official]`), optional labels below in `"icon and text"` mode, flexible spaces, search field trailing, a primary action may be a prominent capsule (`accent`) at trailing.
**Item size:** `28` to `32` tall `[estimate]`, icons centered, `6` between items in a group `[estimate]`. Never place Settings gear icons or window-body controls (checkboxes, radios, switches) inside the toolbar (`[official]`).
**States:** hover `fill-2` behind the item (`100ms` `[estimate]`), pressed `control-pressed`, toggled on shows `accent` glyph. Every icon-only item requires a hover `Tooltip` (`1000ms` delay `[estimate]`).
**Overflow:** `chevron.right.2` menu when the window is narrow.
**Primitive:** `Toolbar`, `ToolbarGroup`, `ToolbarItem`, `ToolbarSearch` (`MacToolbarGroup`, `MacToolbarItem`, `MacToolbarTitle`, `MacToolbarSpacer`).
**Verify:** Distinct groups separated (`ToolbarSpacer.fixed`), `1000ms` tooltips on icon-only buttons, zero Settings gear or body controls in toolbar.

## Tab view and tabs

- Document tabs (like Safari, Finder): tab bar under the toolbar, tabs equal width, selected tab `bg`, others `fill`, close button on hover.
- Settings or segmented tabs: segmented control centered in the toolbar or top of content.
**Verify:** Document tabs stay beneath toolbar; Settings tabs match macOS toolbar style.

## Split views

Three-column (`sidebar`, `list`, `detail`) for Mail-style apps; two-column (`sidebar`, `detail`) for most. Dividers are `1pt` (`thin` divider style `[official]`), draggable with a `6` wide invisible hit handle `[estimate]`, cursor `col-resize`.
**Verify:** `1pt` visible hairline divider; small panes do not swallow or hide the split divider (`[official]`).

## Inspector

Trailing column `280` wide (`240` to `320` `[estimate]`), toggled with a toolbar button (`sidebar.right`) and `Cmd+Option+I` (`[official]`), grouped form sections with `subheadline` emphasized headers.
**Verify:** `--cf-inspector-w` (`280px`), `Cmd+Option+I` shortcut parity in menu bar.

## Navigation behavior

- Back and forward buttons (`chevron.left`, `chevron.right`) in a glass group at the toolbar leading when there is history.
- No breadcrumbs except path control in file browsers.
- Menu bar & keyboard shortcuts for every primary navigation and toolbar/context command (`Cmd+1..9` for sidebar items, `[official]`).
**Verify:** Every toolbar & context action exists in the Menu Bar with an equivalent keyboard shortcut.

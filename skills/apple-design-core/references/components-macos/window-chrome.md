# macOS components: window chrome

Applies to Tauri apps with `style: macos` and to web apps rendering a desktop app shell.

## Window

- Corner radius: uniform 12 (estimate, macOS 27). Use the native window when possible (Tauri decorations on macOS with titleBarStyle Overlay keeps real corners, shadow, resize, full screen).
- Background: windowBackground token (#FFFFFF / #1E1E1E).
- Shadow: windowActive when key, windowInactive otherwise (only for custom drawn windows; native windows get it free).
- Minimum size 480 by 320; remember size and position between launches.

## Traffic lights

- Native on macOS (Tauri overlay titlebar). Position them centered vertically in the 52 toolbar: x 16 from leading, 14 diameter, 9 gap (estimate; verify in the kit Windows page).
- Custom drawn (Windows and Linux with `style: macos` and decorations off): close #FF5F57, minimize #FEBC2E, zoom #28C840, 0.5 inner hairline black 12 percent; glyphs (x, minus, diagonal arrows) appear on group hover only; inactive window shows all three as fill-3 gray.
- On Windows, consider keeping native caption buttons trailing instead (setting `windowsChrome: native|mac` in config). Never show both.

## Titlebar and unified toolbar

- Unified toolbar 52 tall (38 compact). Title (headline) leading after the sidebar toggle, or centered when there is no sidebar. Subtitle below in subheadline label-2 when useful.
- Drag region: the whole toolbar except controls (`data-tauri-drag-region` on the bar, not on buttons). Double click on empty toolbar zooms the window (system setting).
- macOS 27 toolbar: items sit in glass groups on a uniform bar; separate groups by 8; search field trailing (capsule, 200 to 260 wide, expands on focus).
- Sidebar toggle button (sidebar.left) at the leading side right after the traffic lights.

## Full screen and split view

Support native full screen (green button). In full screen the toolbar hides with the menu bar on hover.

## Menu bar (app menu)

The real macOS menu bar is outside your window. In Tauri define it natively (App, File, Edit, View, Window, Help) with standard items and shortcuts. Every toolbar and context action also exists in the menu bar with a shortcut. Web apps do not fake a menu bar.

## Settings window

Separate window opened with Cmd+Comma, title "Settings", toolbar tabs with icons (General, Accounts, Advanced) or a sidebar for many panes, width 715 (estimate), grouped form (label leading, control trailing), no OK button (changes apply immediately).

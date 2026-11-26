# macOS components: window chrome

Applies to Tauri apps with `style: macos` and to web apps rendering a desktop app shell.

## Window

- **Corner radius:** uniform `16` `[measured-from-kit, device-unverified]` (Apple Figma macOS 27 kit nodes `585:3372`, `4363:18479`, `cornerSmoothing: 0.6`; kit frame measurement, not live OS). Use the native window when possible (Tauri decorations on macOS with `titleBarStyle: "Overlay"` keeps real corners, shadow, resize, full screen `[official]`).
- **Background:** `windowBackground` token (`#FFFFFF` / `#1E1E1E` `[measured]` kit).
- **Window states (`[official]`):** `Active` (key/main), `Inactive`, `Minimized`. Shadow swaps cleanly between `shadow-window-active` when focused and `shadow-window-inactive` when unfocused (for custom chrome windows; native windows get it free). Active/inactive traffic lights follow `#000@0.1` (light) / `#FFF@0.15` (dark) (`[official]`/`[measured]`).
- **Minimum size:** `480 × 320` `[estimate]`; support continuous fluid resizing and remember size and position between launches (`[official]`).
**Verify:** Inactive custom chrome swaps to `shadow-window-inactive`, min window `480×320`, `macOSPrivateApi` remains `false` for MAS builds.

## Traffic lights

- **Native on macOS** (`Tauri` overlay titlebar). Position centered vertically in the `52` toolbar: `x: 16` from leading, `14` diameter, `9` gap, `centerY: 26` `[estimate]`.
- **Custom drawn** (Windows and Linux with `style: macos` and decorations off): close `#FF5F57`, minimize `#FEBC2E`, zoom `#28C840`, `0.5` inner hairline black `12%` (`[estimate]`); glyphs (`×`, `−`, diagonal arrows) appear on group hover only; inactive window shows all three muted (`fill-3`).
- On Windows, consider keeping native caption buttons trailing instead (setting `windowsChrome: native|mac` in config). Never show both (`[official]`).
**Verify:** Traffic light glyphs reveal on group hover only; buttons have `type="button"` and `aria-label`.

## Titlebar and unified toolbar

- Unified toolbar `52` tall (`38` compact) `[estimate]`. Title (`headline`) leading after the sidebar toggle, or centered when there is no sidebar. Subtitle below in `subheadline` `label-2` when useful.
- Drag region: the whole toolbar except controls (`data-tauri-drag-region` on the bar, NOT on buttons `[official]`). Double click on empty toolbar zooms the window.
- macOS 27 toolbar: items sit in glass groups on a uniform bar; separate groups by `8` (`ToolbarSpacer.fixed` `[official]`); search field trailing (capsule, `200` to `260` wide `[estimate]`, expands on focus).
- Sidebar toggle button (`sidebar.left`) at the leading side right after the traffic lights.
- **Hard placement rule (`[official]`):** NEVER place body controls (checkboxes, radio buttons, switches, help/Settings gear buttons) inside the toolbar or bottom status bar (`[official]`).
**Verify:** Toolbar height `52`, drag region excludes buttons, zero Settings gear or form controls inside the frame.

## Full screen and split view

Support native full screen (green button `[official]`). In full screen the toolbar hides with the menu bar (`24pt` height `[official]`) on hover. Split-view dividers stay `1pt` (`thin` `[official]`).
**Verify:** Full-screen green zoom works natively; menu bar `24pt` respected on desktop.

## Menu bar (app menu)

The real macOS menu bar (`24pt` tall `[official]`) is outside your window. In Tauri define it natively (`App`, `File`, `Edit`, `Format`, `View`, `Window`, `Help`) with standard items and shortcuts. Every toolbar and context action MUST also exist in the menu bar with a shortcut (`[official]`). Prefer `File > Duplicate` (`Option` -> `Save As…` `[official]`). Web apps do not fake a macOS menu bar (`[official]`).
**Verify:** Complete native menu bar in Tauri (`App..Help`); Web never renders a fake menu bar inside the viewport.

## Settings window (`Cmd+,` `[official]`)

Separate window opened strictly via **`AppMenu > Settings…` (`Cmd+,`)** — NEVER put a Settings gear button inside the window toolbar (`[official]`). Toolbar tabs with icons (`General`, `Accounts`, `Advanced`) or a sidebar for many panes, width `~715` `[estimate]`, grouped form (label leading, control trailing), switches apply immediately with no OK button (`[official]`).
**Verify:** Opens with `Cmd+,`, zero toolbar gear icon, instant-apply settings without OK/Cancel footer.

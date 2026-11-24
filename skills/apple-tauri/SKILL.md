---
name: apple-tauri
description: Tauri 2 (Rust) adapter for the Apple macOS 27 and iOS 27 design system. Native macOS window chrome (overlay titlebar, real traffic lights, Liquid Glass or vibrancy window background), Windows Mica fallback with custom macOS style chrome, native menu bar, and the apple-web primitives for the frontend. Use whenever apple-design-core routes to tauri or the project has src-tauri.
---

# Apple Tauri Adapter

Read `apple-design-core` first. The frontend is a web app: ALSO load `apple-web` and follow it fully. This skill covers the native shell.

## 1. Setup (once per project)

1. Frontend: follow apple-web setup (tokens, primitives, CupertinoRoot with `style` from config, usually `macos`).
2. Rust deps in `src-tauri/Cargo.toml`: see `assets/Cargo-snippet.toml` (window-vibrancy 0.7+, tauri features macos-private-api).
3. Copy `assets/src-tauri/src/apple_window.rs` and `apple_menu.rs` into `src-tauri/src/` and wire them in `lib.rs` as shown in `assets/src-tauri/src/lib-snippet.rs`.
4. Merge `assets/tauri.conf.snippet.json` into `src-tauri/tauri.conf.json` (transparent window, overlay titlebar on macOS, hidden title, traffic light position, macOSPrivateApi true).
5. Frontend CSS: `html, body { background: transparent }` when using window glass; the content area keeps `bg-bg` so only the sidebar and toolbar show glass.
6. Drag regions: put `data-tauri-drag-region` on the toolbar and sidebar header (MacWindow already does).

## 2. Platform behavior

| OS | Chrome | Window material | Traffic lights |
|---|---|---|---|
| macOS 26+ | native overlay titlebar, uniform radius | `apply_liquid_glass` (NSGlassEffectView) behind sidebar, or `apply_vibrancy(Sidebar)` | native, repositioned to x 16, centered in the 52 toolbar |
| macOS 13 to 15 | same | `apply_vibrancy(NSVisualEffectMaterial::Sidebar)` | native |
| Windows 11 | `decorations: false`, MacWindow customChrome | `apply_mica` (dark or light following theme) | custom TrafficLights if config `windowsChrome: "mac"`, else native caption buttons on the trailing side |
| Linux | `decorations: false` or native | none (compositor dependent) | as Windows |

Pass `customChrome={!isMac}` and `active={focused}` to MacWindow. Listen to `getCurrentWindow().onFocusChanged` for `active`.

## 3. Rules

1. Every command reachable from the toolbar or a context menu also exists in the native menu bar with a standard shortcut (`apple_menu.rs` builds App, File, Edit, View, Window, Help).
2. Settings open in a separate window (label `settings`, 715 wide, not resizable vertically) via Cmd+Comma.
3. Remember window size and position (tauri-plugin-window-state).
4. Do not draw fake menu bars inside the window.
5. Disable the web context menu except where you show an Apple ContextMenu; disable text selection in chrome; enable it in content.
6. Use system font: macOS WebKit renders SF with `-apple-system`; Windows WebView2 gets Inter from the web adapter.
7. Respect OS appearance: Tauri theme `null` (follow system); CupertinoRoot handles the CSS.
8. Haptics: none on desktop. Sounds: only if enabled, play through Web Audio (apple-web sounds.ts).

## 4. Done check

`cargo check` in src-tauri, run `npm run tauri dev`, verify traffic lights alignment with the toolbar, sidebar glass, active vs inactive window, light and dark, then run the `apple-design-reviewer` agent with screenshots.

Note: the Rust snippets target Tauri 2.x and window-vibrancy 0.7.x APIs (apply_liquid_glass exists from 0.7). They were not compiled inside the plugin build environment; run `cargo check` first and fix API drift without changing visual values.

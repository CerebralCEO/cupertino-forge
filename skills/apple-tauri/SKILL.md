---
name: apple-tauri
description: Tauri 2 (Rust) adapter for the Apple macOS 27 and iOS 27 design system. Native macOS window chrome (overlay titlebar, real traffic lights, Liquid Glass via window-vibrancy 0.8 or MAS vibrancy fallback), Windows Mica fallback with custom macOS style chrome, native menu bar, .apple-design.json Rust bridge, and the apple-web primitives for the frontend. Use whenever apple-design-core routes to tauri or the project has src-tauri.
---

# Apple Tauri Adapter

Read `apple-design-core` first. The frontend is a web app: ALSO load `apple-web` and follow it fully. This skill covers the native Rust shell.

## 1. Setup (once per project)

1. Frontend: follow `apple-web` setup (tokens, primitives, `CupertinoRoot` with `style` from `.apple-design.json`, usually `macos`).
2. Generate Rust token constants from `tokens/*.json`:
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/build-tokens.mjs --out src-tauri/src --targets rust --accent <accent>` → emits `apple_tokens.rs` (`WINDOW_CORNER_RADIUS` `[estimate]`, traffic light geometry, minimum size, hex colors).
3. Rust deps in `src-tauri/Cargo.toml`: see `assets/Cargo-snippet.toml` (`window-vibrancy = "0.8"`, `serde`, `serde_json`, `tauri-plugin-window-state = "2"`, plus `features = ["macos-private-api"]` ONLY when `.apple-design.json` has `"distribution": "direct"`).
4. Copy `assets/src-tauri/src/apple_config.rs`, `apple_window.rs`, and `apple_menu.rs` into `src-tauri/src/` and wire them in `lib.rs` as shown in `assets/src-tauri/src/lib-snippet.rs` (reads `.apple-design.json` at compile/setup time via `AppleDesignConfig::from_json` and exposes `get_apple_design_config` to the frontend).
5. Merge config by distribution target:
   - **`"distribution": "direct"`** → merge `assets/tauri.conf.snippet.json` (`"macOSPrivateApi": true`, `"transparent": true`).
   - **`"distribution": "mac-app-store"`** → merge `assets/tauri.conf.mas.snippet.json` (`"macOSPrivateApi": false`, `"transparent": false`).
6. Frontend CSS: `html, body { background: transparent }` when using transparent glass (`direct`); keep opaque `bg-bg` inside the content pane so only sidebar and toolbar show native glass.
7. Drag regions: put `data-tauri-drag-region` on the toolbar and sidebar header (`MacWindow` already does).

## 2. Mac App Store vs Direct Distribution (`[official]`)

- Enabling `macOSPrivateApi: true` in Tauri uses undocumented macOS window server APIs and **risks Mac App Store (MAS) review rejection** (`https://tauri.app/distribute/app-store/` `[official]`).
- For **direct builds (`distribution: "direct"`)**: `macOSPrivateApi: true` + `transparent: true` enables `apply_liquid_glass(&window, LiquidGlassOptions::new(NSGlassEffectViewStyle::Regular).radius(radius))` (`window-vibrancy 0.8+`, macOS 26+), with automatic fallback to `apply_vibrancy(Sidebar)` on macOS <= 15.
- For **Mac App Store builds (`distribution: "mac-app-store"`)**: keep `macOSPrivateApi: false`, omit `"macos-private-api"` Cargo feature, and `apple_window.rs` uses public `NSVisualEffectView` (`apply_vibrancy(NSVisualEffectMaterial::Sidebar)`).

## 3. Native / Approximation / Not possible Parity Matrix

| Capability | macOS Direct (`window-vibrancy 0.8`) | macOS MAS (`macOSPrivateApi: false`) | Windows 11 (`WebView2`) | Linux |
|---|---|---|---|---|
| Window Liquid Glass (`NSGlassEffectView`) | **Native** (`apply_liquid_glass` via `LiquidGlassOptions` on macOS 26+, radius from token `[estimate]`) | **Not possible** cleanly with transparent private SPI; **Approximation** via `apply_vibrancy(Sidebar)` + web CSS glass | **Approximation** (`apply_mica` dark/light + web CSS `.cf-glass`) | **Approximation** (compositor + web CSS `.cf-glass`) |
| Window chrome & traffic lights | **Native** (`titleBarStyle: Overlay`, native corners & shadow) | **Native** (`titleBarStyle: Overlay`) | **Approximation** (`decorations: false` + `MacWindow` `TrafficLights`, or native caption buttons via `windowsChrome`) | **Approximation** (`decorations: false` + `TrafficLights`) |
| Menu bar & shortcuts | **Native** (`apple_menu.rs`: App, File, Edit, View, Window, Help + dynamic Show/Hide labels + `CmdOrCtrl`) | **Native** | **Approximation** (attached window menu or hidden) | **Approximation** |
| System font (`SF Pro`) | **Native** (`WKWebView` `-apple-system`) | **Native** | **Approximation** (`Inter` variable + `Segoe UI` fallback) | **Approximation** (`Inter` fallback) |
| Tactile haptics | **Not possible** on desktop | **Not possible** | **Not possible** | **Not possible** |

Pass `customChrome={!isMac}` and `active={focused}` to `MacWindow`. Listen to `getCurrentWindow().onFocusChanged` for `active`, and sync `"windowsChrome"` / `"distribution"` cleanly via `invoke('get_apple_design_config')`.

## 4. Rules

1. Every command reachable from the toolbar or a context menu also exists in the native menu bar with a `CmdOrCtrl` shortcut (`apple_menu.rs` builds App, File, Edit, View, Window, Help, and flips `"Hide Sidebar"` ↔ `"Show Sidebar"` / `"Hide Inspector"` ↔ `"Show Inspector"`).
2. Settings open in a separate window (`settings`, `715` wide `[estimate]`, not resizable vertically) via `CmdOrCtrl+,`.
3. Remember window size and position (`tauri-plugin-window-state`).
4. Do not draw fake menu bars inside the web viewport.
5. Disable the web context menu except where showing an Apple `ContextMenu`; disable text selection in chrome; enable it in content.
6. Respect OS appearance (`theme: null` in Tauri config; `CupertinoRoot` handles CSS themes).
7. Haptics: none on desktop. Sounds: only if enabled via Web Audio (`apple-web` `sounds.ts`).

## 5. Done check

Run `cargo check` in `src-tauri`, run `npm run tauri dev`, verify traffic lights alignment (`x=16, y=26`), sidebar glass / vibrancy, active vs inactive window shadow, light and dark modes, then run `apple-design-reviewer`.

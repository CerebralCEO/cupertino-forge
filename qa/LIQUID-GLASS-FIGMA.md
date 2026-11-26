# Liquid Glass & Materials Extraction (Phase 8A: A5)

> **Date:** 2026-11-27 | **Sources:** `tokens/effects.json` (`ios27` 119 derived, `macos27` 154 derived) + component `layout.json`

## 1. Derived Effect Type Distribution

- **iOS 27 (`119` derived):** `{'INNER_SHADOW': 21, 'DROP_SHADOW': 33, 'GLASS': 8, 'BACKGROUND_BLUR': 54, 'LAYER_BLUR': 3}`
- **macOS 27 (`154` derived):** `{'INNER_SHADOW': 64, 'GLASS': 7, 'DROP_SHADOW': 58, 'LAYER_BLUR': 1, 'BACKGROUND_BLUR': 24}`

## 2. `GLASS` Effect Instances

| Kit | lightIntensity | lightAngle | refraction | depth | dispersion | radius | overlayFills | Sample Nodes |
|---|---|---|---|---|---|---|---|---|
| `ios27` | 0.25 | 0 | 0.7 | 30 | 0.2 | 6 | `0` | `[]` |
| `ios27` | 0.4 | 0 | 0.7 | 30 | 0.2 | 6 | `0` | `[]` |
| `ios27` | 0.25 | 0 | 0.7 | 30 | 0.2 | 16 | `1` | `[]` |
| `ios27` | 1 | 0 | 0.8 | 40 | 0.5 | 8 | `3` | `[]` |
| `ios27` | 0.2 | 0 | 0.7 | 30 | 0.2 | 3 | `0` | `[]` |
| `ios27` | 0 | 0 | 0.8 | 7 | 0 | 0 | `1` | `[]` |
| `ios27` | 0.4 | 0 | 0.5 | 1 | 0 | 0 | `0` | `[]` |
| `ios27` | 1 | 0 | 0.8 | 40 | 0 | 8 | `4` | `[]` |
| `macos27` | 0.25 | 0 | 0.7 | 30 | 0.2 | 6 | `1` | `[]` |
| `macos27` | 0 | 0 | 0.9 | 4 | 0 | 0 | `1` | `[]` |
| `macos27` | 0.2 | 0 | 0.7 | 40 | 0.4 | 25 | `1` | `[]` |
| `macos27` | 0.15 | 0 | 0.7 | 40 | 0.2 | 26 | `1` | `[]` |
| `macos27` | 0.25 | 0 | 0.7 | 30 | 0.2 | 25 | `1` | `[]` |
| `macos27` | 0.25 | 0 | 0.7 | 30 | 0.2 | 16 | `1` | `[]` |
| `macos27` | 0.1 | 0 | 0.7 | 30 | 0.2 | 16 | `1` | `[]` |

## 3. `BACKGROUND_BLUR` Instances

| Kit | Radius | Blur Type | Sample Nodes |
|---|---|---|---|
| `ios27` | 135.91 | `NORMAL` | `[]` |
| `ios27` | 16 | `NORMAL` | `[]` |
| `ios27` | 40 | `NORMAL` | `[]` |
| `ios27` | 100 | `NORMAL` | `[]` |
| `ios27` | 100 | `NORMAL` | `[]` |
| `ios27` | 10 | `PROGRESSIVE` | `[]` |
| `ios27` | 40 | `NORMAL` | `[]` |
| `ios27` | 135.91 | `NORMAL` | `[]` |
| `ios27` | 100 | `NORMAL` | `[]` |
| `ios27` | 130 | `NORMAL` | `[]` |
| `ios27` | 130 | `NORMAL` | `[]` |
| `ios27` | 70 | `NORMAL` | `[]` |
| `ios27` | 20 | `NORMAL` | `[]` |
| `ios27` | 80 | `NORMAL` | `[]` |
| `ios27` | 40 | `NORMAL` | `[]` |
| `ios27` | 100 | `NORMAL` | `[]` |
| `ios27` | 135.91 | `NORMAL` | `[]` |
| `ios27` | 100 | `NORMAL` | `[]` |
| `ios27` | 0 | `NORMAL` | `[]` |
| `ios27` | 70 | `NORMAL` | `[]` |
| `macos27` | 81.55 | `NORMAL` | `[]` |
| `macos27` | 6 | `NORMAL` | `[]` |
| `macos27` | 80 | `NORMAL` | `[]` |
| `macos27` | 6 | `NORMAL` | `[]` |
| `macos27` | 120 | `NORMAL` | `[]` |
| `macos27` | 120 | `NORMAL` | `[]` |
| `macos27` | 120 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 120 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 20 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |
| `macos27` | 60 | `NORMAL` | `[]` |

## 4. Inspected Glass / Material / Bar Components
- **iOS 27 (51):** `[('Accessory-Bar-iPhone-Toolbar', 4), ('Action-Sheet', 1), ('Alert', 2), ('Button-Liquid-Glass-Symbol', 8), ('Button-Liquid-Glass-Text', 24), ('Context-Menu', 4), ('Context-Menu-Dimming-Overlay', 1), ('Edit-Menu', 1), ('Liquid-Glass-Clear', 1), ('Liquid-Glass-Regular-Large', 2), ('Liquid-Glass-Regular-Medium', 2), ('Liquid-Glass-Regular-Small', 8), ('Menu', 2), ('Menu-Items', 12), ('Menu-Items-Submenus', 16), ('Scroll-Edge-Effect-Hard', 4), ('Scroll-Edge-Effect-Soft', 2), ('Sheet-iPad', 1), ('Sheet-iPhone', 3), ('Status-bar-and-Menu-bar-iPad', 4), ('Tab-Bar-iPad', 1), ('Tab-Bar-iPhone', 24), ('Tab-Bar-iPhone-Duo', 24), ('Toolbar-Bottom-iPad', 1), ('Toolbar-Bottom-iPhone', 6), ('Toolbar-Top-iPad', 8), ('Toolbar-Top-iPhone', 5), ('Toolbar-Top-iPhone-Duo', 8), ('_Button-Liquid-Glass', 2), ('_Dock-Material', 2), ('_Dock-iPad', 1), ('_Edit-Menu-Item', 4), ('_Materials', 5), ('_Materials-Mode-Options', 20), ('_Menu-Indicator', 2), ('_Menu-bar-item', 4), ('_Overlay-Alerts', 1), ('_Tab-Bar-Button-Round-iPhone', 4), ('_Tab-Bar-Button-Round-iPhone-Duo', 4), ('_Tab-Bar-Button-iPad-Symbol', 4), ('_Tab-Bar-Button-iPad-Text', 4), ('_Tab-Bar-Button-iPhone', 4), ('_Tab-Bar-Button-iPhone-Duo', 4), ('_Toolbar', 1), ('_Toolbar-page-control', 35), ('iPhone-Duo-Sheets-Inner-Landscape', 1), ('iPhone-Duo-Sheets-Inner-Landscape-Folded', 1), ('iPhone-Duo-Sheets-Inner-Portrait', 1), ('iPhone-Duo-Sheets-Inner-Portrait-Folded', 1), ('iPhone-Duo-Sheets-Outer-Landscape', 1), ('iPhone-Duo-Sheets-Outer-Portrait', 1)]`
- **macOS 27 (24):** `[('Alert', 2), ('Dock', 2), ('Dock-Icon', 2), ('Liquid-Glass-Large', 2), ('Liquid-Glass-Medium', 2), ('Liquid-Glass-Notification-Dark', 1), ('Liquid-Glass-Notification-Light', 1), ('Liquid-Glass-Small', 8), ('Materials', 10), ('Menu', 1), ('Menu-Background', 2), ('Menu-Bar', 2), ('Menu-Items', 32), ('Scroll-Edge-Effect-Hard', 4), ('Scroll-Edge-Effect-Soft', 2), ('Sheet', 2), ('Utility-Panel-Tab-Bar', 1), ('_Button-Utility-Panel-Tab-Bar', 2), ('_Menu-Bar-App-Name-Dark', 2), ('_Menu-Bar-App-Name-Light', 2), ('_Menu-Bar-Apple-Menu-Dark', 2), ('_Menu-Bar-Apple-Menu-Light', 2), ('_Menu-Bar-Menu-Item-Dark', 2), ('_Menu-Bar-Menu-Item-Light', 2)]`

## 5. Comparison with `tokens/materials.json` & Honest Translation Proposal (No Token Edits)

| Figma `GLASS` Parameter | Web (CSS / SVG) | Flutter | Tauri 2 (macOS) | Status |
|---|---|---|---|---|
| `radius` (blur) | `backdrop-filter: blur(var(--cf-glass-blur)) saturate(1.8)` | `ImageFilter.blur` inside `BackdropGroup` | `NSGlassEffectView` / `apply_vibrancy` | **approximation** (Web/Flutter), Native (macOS Direct) |
| `overlayFills` (tint + alpha) | `background: color-mix(...)` | `Container` tint overlay | Native material tint | **approximation** |
| `lightIntensity` / `lightAngle` | Specular top-edge rim `box-shadow` / linear-gradient | `CustomPainter` / `Border` rim | Native `NSGlassEffectView` | **approximation** (static, no dynamic angle) |
| `refraction` | SVG `<feDisplacementMap>` (Chromium-only) | Not available in standard `BackdropFilter` | Native `NSGlassEffectView` only | **impossible** in portable CSS/Flutter |
| `dispersion` (chromatic) | Not supported in CSS `backdrop-filter` | Not supported | Native `NSGlassEffectView` only | **impossible** in CSS/Flutter |

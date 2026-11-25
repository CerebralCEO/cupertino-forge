# 15 Version diff: what is new in iOS 27 and macOS 27

Baseline: iOS 26 and macOS 26 Tahoe introduced Liquid Glass (WWDC 2025 `[official]`). iOS 27 and macOS 27 refine it (`Oct 2026` HIG DocC `[official]` + WWDC 2026 secondary press `[inferred]`). Plugin primary tokens match the Apple iOS 27 and macOS 27 UI kits (`tokens/source/`, Sketch `[measured]`).

## Tier A — Official Apple HIG & SDK Changes (June 2025 – Oct 2026 `[official]`)

1. **Mac touch input (`Oct 28, 2026` `[official]`):** Desktop Mac UI with touch displays/Sidecar keeps keyboard & pointer primary and preserves control layout/sizing without jumping.
2. **App icon formats & 6 appearances (`Oct 28, 2026` / `June 8, 2026` `[official]`):** Layered `.icon` in Icon Composer (`1024×1024 px` Square input) vs nonlayered bitmap options; 6 required appearances (`default`, `dark`, `clear light/dark`, `tinted light/dark`). For your own app icon design: layered foreground on glass, no text.
3. **Live Activities & Dynamic Island limited width (`Oct 13, 2026` `[official]`):** `28×28 pt` compact circular fit and `14 pt` Lock Screen margins; Widgets `16 pt` margins and `11 pt` minimum text (`[official]`).
4. **Sidebar colored accent icons (`June 8, 2026` `[official]`):** Edge-to-edge sidebars extend to the window edge with a vibrant material — do not inset or float the sidebar. Sidebars use app/system accent color by default; `.backgroundExtensionEffect()` extends content smoothly under edge-to-edge sidebars/inspectors.
5. **Window active state is clearer (`[measured]`):** Reflected via sidebar appearance, opacity, and window shadow (`windowActive` vs `windowInactive` tokens `[measured]`, `sidebar` vs `sidebar-inactive` `[measured]`).
6. **Tab bar search & scroll edge (`June 8, 2026` `[official]`):** `Tab(role: .search)` trailing standalone capsule, `.tabBarMinimizeBehavior(.onScrollDown)`, `.scrollEdgeEffectStyle(.soft | .hard | .automatic)`, menu item icons from standard selectors, and iOS single-view Sheets placing Cancel leading & Done trailing (`Mar 24, 2026` `[official]`).
7. **List headers (`[official]`):** Lists, tables, and forms use title-style capitalization instead of forced ALL CAPS.
8. **SF Symbols 7 (`July 28, 2025` `[official]`):** `Draw On / Draw Off` animations and smooth linear gradient rendering across all modes.
9. **iOS 26 to 27 carried over (`[official]` / `[measured]`):** Floating capsule tab bar that minimizes on scroll, bottom search, glass button groups in navigation bars, sheets that float at medium detent, scroll edge effects, concentric layout, system blue `#0088FF`.

## Tier B — Secondary Press Reports (`[inferred]`/`[estimate]`, pending Xcode 27 / device measurement)

1. **Liquid Glass intensity slider (`[inferred]`):** Settings continuous slider between clear and tinted/more opaque; plugin models `--cf-glass-intensity` (`0..1`, default `0.5` `[estimate]`).
2. **Better readability (`[inferred]`/`[estimate]`):** More uniform refraction, improved diffusion and contrast; tuned recipes use stronger tint than iOS 26.
3. **macOS uniform toolbars (`[inferred]`):** Toolbar items sit on a consistent bar behind them for legibility.
4. **macOS uniform window corner radius (`[estimate]`):** Secondary press reports `~12 pt` uniform window radius replacing Tahoe `16–26 pt` (`[estimate]` until measured on macOS 27 hardware).
5. **Community hardware radius/safe-area `$alt` notes (`[inferred/community]`):** Community `ScreenCorners` / `screens.guide` report `62pt` display radius (16 Pro/17 Pro), `18pt` (iPad Pro OLED), and `59pt` safe-area top (iPhone 15/16); kept out of primary kit tokens (`55pt`/`30pt`/`62pt`) until official confirmation.

## Things that are old and must not appear

- iOS 15 to 18 style: solid full-width bars with hairline, bottom-glued tab bar, `#007AFF` blue, `10pt` grouped corners, uppercase grouped list headers, `51×31` toggle switch.
- macOS Tahoe 26 style: floating inset sidebar (`26` window corners).
- macOS Sequoia and older style: opaque gray toolbars without glass, monochrome sidebar only, flat menus.

## Update procedure

Run `/apple-sync` after each WWDC and each kit update. Record the diff here with date and source.

| Date | Source | Change |
|---|---|---|
| 2026-11-21 | iOS 27 and macOS 27 Sketch kits, HIG | Initial token sync |
| 2026-11-25 | Official Apple DocC (62 pages), Sketch kits, WWDC 2026 press | Reconciled provenance (`[official]`/`[measured]`/`[inferred]`/`[estimate]`), added Oct 2026 HIG deltas & conflicts ledger |

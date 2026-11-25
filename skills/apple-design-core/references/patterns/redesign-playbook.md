# Existing Project Redesign Playbook (iOS 27 / macOS 27)

Use this playbook when converting an existing Web (Next.js / React), Flutter, or Tauri 2 + Rust codebase into an Apple iOS 27 / macOS 27 experience. All numeric values come from `tokens/*.json` and `foundations/*.md` — never invent new measurements.

> **Cross-platform parity contract:** On Apple platforms (iOS, iPadOS, macOS), native APIs deliver maximum platform parity. On Web, Flutter, and Tauri, `cupertino-forge` delivers documented visual approximation paired with **100% Apple design psychology, spatial hierarchy, motion discipline, and UX**.

---

## 1. Deconstruction & IA Audit

Before touching styles, strip away non-Apple structure using the decision procedure in `foundations/00-principles.md` (Content-First, Restraint, and the four questions: *content vs control*, *one primary action*, *can it be removed?*, *does it behave like the platform?*):

1. **Eliminate card-in-card nesting:** Flatten nested bordered boxes into Apple background levels (`bg` -> `bg-grouped` -> `bg-grouped-2` on iOS; `macOSSurfaces` + edge-to-edge sidebar on macOS). Keep at most 2 surface levels inside a single viewport.
2. **Strip decorative borders and content shadows:** Remove all 1px gray borders around iOS cards, rows, and text inputs (`tokens/shape.json :: borders.rule`), and remove all drop shadows from iOS content-layer cards and list rows (`tokens/elevation.json :: rules`). Reserve 0.5px hairlines exclusively for inset row separators and floating glass rims.
3. **Prune CTA clutter:** Audit every screen for competing primary buttons. Keep **at most 1 prominent (tinted) CTA** per view (`foundations/00-principles.md`). Demote secondary actions to `bordered`/`plain` or move them into a `Menu` / toolbar overflow.
4. **Replace non-Apple navigation:** Delete hamburger drawers, multi-link web top navbars, floating Material FABs, and website footers inside app shells (`references/anti-patterns.md`). Map top-level destinations to `TabBar` (`<= 5` tabs on iPhone) or `Sidebar` (iPad / macOS).
5. **Audit text & icon noise:** Collapse every arbitrary font size to a named text style (`tokens/typography.json`), cap each card/row to `<= 3` type levels, replace emoji/colored-circle icon spam with monochrome/hierarchical symbols (`tokens/icons.json`), and shorten verbose helper copy (`foundations/12-ux-writing.md`).

---

## 2. Psychology & Philosophy Mapping

Translate Apple's core interaction principles into concrete code changes on every redesigned screen:

| Principle | Redesign Action Checklist | Source Reference |
|---|---|---|
| **Clarity** | Named text styles with exact Apple tracking; leading-aligned body copy; semantic colors only; tabular numerals (`tabular`) for changing numbers. | `foundations/02-typography.md`, `03-color.md` |
| **Deference** | Content fills the viewport edge-to-edge and scrolls underneath translucent bars (`ScrollEdge`); Liquid Glass appears **only** on functional controls, never on content or stacked glass-on-glass. | `foundations/00-principles.md`, `04-liquid-glass.md` |
| **Depth** | Communicate hierarchy through translucent functional layers, elevation tokens on floating surfaces only, and lighter elevated backgrounds (`data-cf-elevated`) in dark mode — never heavier dark-mode shadows alone. | `foundations/06-elevation.md`, `13-dark-mode.md` |
| **Concentricity** | Apply continuous corners (`cornerSmoothing: 0.6`, measured in Apple Figma kits) via `Squircle` / `SquircleBorder`, and enforce `innerRadius = max(outerRadius - padding, 4)` (`tokens/shape.json :: concentric`). | `foundations/05-shape.md`, `tokens/shape.json` |
| **Direct Manipulation** | Zero-delay pointer-down press feedback, 1:1 drag tracking on sheets and sliders (`interactive` spring), and velocity handoff on release; every animation stays interruptible. | `foundations/08-motion.md`, `09-interaction-states.md` |
| **Progressive Disclosure** | Surface only essential controls by default; tuck secondary filters, bulk actions, and advanced settings into `Menu`, `Popover`, `Sheet` detents, or macOS `Inspector` panes. | `patterns/screens.md`, `00-principles.md` |
| **Forgiveness (Undo/Redo)** | Prefer immediate reversible edits with Undo (inline banner or `Cmd+Z`) over nagging confirmations; reserve destructive confirmation dialogs/alerts for irreversible data loss and name the target object explicitly. | `patterns/states.md`, `foundations/12-ux-writing.md` |
| **Spatial Memory** | Keep navigation destinations, primary action positions (top-trailing on iOS, Cancel leading / Done trailing on iOS sheets, bottom-trailing in macOS dialogs), and touch/pointer layouts stable across visits. | `foundations/00-principles.md`, `01-layout.md` |

---

## 3. Pattern Translation Matrix

Map legacy Generic / Material / Web UI patterns to their exact Apple 27 equivalents:

| Legacy Generic / Material / Web Pattern | Apple iOS 27 Equivalent | Apple macOS 27 Equivalent |
|---|---|---|
| **Hamburger drawer menu** | Floating Liquid Glass `TabBar` (`<= 5` tabs, minimizes on scroll) + push stack | Edge-to-edge `Sidebar` (`MacSidebarSection`, `MacSidebarRow`) + unified `Toolbar` |
| **Web top navbar with links** | `NavBar` + `LargeTitle` (collapses to inline `headline` on scroll) + `BarButtonGroup` | Unified window `Toolbar` (`MacToolbarTitle`, `MacToolbarGroup`) + native Menu Bar |
| **Generic centered modal** | `Sheet` with `medium` / `large` detents and drag-to-dismiss grabber | Attached `Sheet` (radius `16pt` measured) or trailing `Inspector` panel |
| **Toast / Material Snackbar spam** | Inline state change + `success` haptic; top banner only for system/offline status | Inline status or non-blocking banner; never auto-dismiss critical messages |
| **Linear spinner / skeleton shimmer everywhere** | Show nothing `< 300ms`; delayed `ActivityIndicator` (`useDelayedFlag`); progressive cached content; determinate `ProgressBar` for `> 2s` | Toolbar or inline `ActivityIndicator` (`> 300ms`); determinate `ProgressBar` for long tasks |
| **Flat HTML `<select>` / dropdown** | `Menu` / `ContextMenu` (morphing from glass trigger) or `Popover` (iPad) | `Menu` (item height `24pt`, separator `11pt` measured) or `Pop-up` / `Pull-down` button |
| **Hardcoded shadowed card grid** | `List` (`insetGrouped`, `bg-grouped` + `bg-grouped-2`, no shadow) or calm Health-style summary cards (`bg-2`, squircle, no shadow) | Split View (`Sidebar` + `MacTable` or grid) with `Inspector` and keyboard navigation |
| **Material FAB (bottom-right circle)** | Primary action in `NavBar` / bottom `Toolbar` glass group (or single floating glass button when canvas-primary) | Primary toolbar item (`MacToolbarItem`) mirrored in Menu Bar with keyboard shortcut |
| **Bordered form inputs (`1px solid gray`)** | Borderless `TextField` (`52pt` height measured) inside `insetGrouped` rows with leading labels | `MacTextField` (`24pt` regular height measured) with kit hairline border in grouped form |
| **Yes / No confirmation modal** | `ConfirmationDialog` or `Alert` (`300pt` wide, `14pt` pad measured) with explicit verb + `Cancel` | `Alert` (radius `10pt` measured) with explicit verb (trailing default) + `Cancel` |

---

## 4. Motion & Micro-interaction Upgrade Checklist

Replace every CSS `ease` / `ease-in-out` / `linear` curve and Flutter `Curves.easeInOut` with `tokens/motion.json` and `foundations/08-motion.md`:

- [ ] **Spring physics only:** Map layout changes to `smooth` (`0.5, 0` `[official]`), selections/toggles/segmented indicators to `snappy` (`0.5, 0.15` `[official]`), drags to `interactive` (`0.15, 0`), press/release to `press` / `release`, sheets to `sheet`, pushes to `push`, menus/popovers/alerts to `popover`, and glass merges to `glassMorph`.
- [ ] **Instant pointer-down press state:** Every interactive control responds at `0ms` on pointer down — glass scales up (`1.08–1.12` touch vs `1.02` mouse) and brightens, solid buttons dim and scale `0.97`, plain text drops to `0.35` opacity.
- [ ] **Sheet drag & velocity handoff:** Track drag 1:1 (`interactive`) and dismiss at `>= 600 pt/s` velocity or `>= 40%` height (`tokens/motion.json :: transitions.sheetDismiss`); never snap abruptly without velocity.
- [ ] **Tab switch without slide:** Crossfade tab content in `150ms` (`no slide`) while sliding only the inner glass selection capsule with `snappy` (`transitions.tabSwitch`).
- [ ] **Interruptible transitions:** Ensure mid-flight sheets, menus, pushes, and toggles accept new input immediately without locking UI.
- [ ] **Reduced motion fallback:** Wrap Web React roots in `<MotionConfig reducedMotion="user">` and check `MediaQuery.disableAnimationsOf(context)` in Flutter. Under `prefers-reduced-motion: reduce`, swap slides/scales/blur transitions for `200ms` crossfades and set bounce to `0`.
- [ ] **No decorative motion:** Remove mount-time stagger animations, infinite floating/bouncing loops (except `ActivityIndicator`), animated `blur()` sigmas, and scroll-linked `box-shadow` animations.

---

## 5. Platform-Specific Conversion Order

Always convert an existing project in this exact 5-stage order so structural defects are fixed before visual polish:

### Stage A — Tokens & Theme Foundation
1. Create `.apple-design.json` (`templates/apple-design.json`), validate custom accent with `scripts/contrast-check.mjs`, and generate tokens with `scripts/build-tokens.mjs`:
   - **Web:** `--targets css,tailwind,ts`, import `cupertino.tokens.css` -> `cupertino.theme.css` -> `cupertino.base.css` in `globals.css`, wrap root in `<CupertinoRoot>` + prehydrate theme script (`theme-script.ts`).
   - **Flutter:** `--targets dart` into `lib/apple_ui/theme/apple_tokens.dart`, replace `MaterialApp` with `CfApp`, remove `package:flutter/material.dart` imports.
   - **Tauri 2:** Complete Web Stage A + merge `Cargo-snippet.toml` / `tauri.conf.snippet.json` (or `tauri.conf.mas.snippet.json` for Mac App Store), copy `apple_window.rs`, `apple_menu.rs`, `apple_config.rs`, and generate `--targets rust` (`apple_tokens.rs`).

### Stage B — Layout & Information Architecture
1. Replace legacy navigation shells with platform-native shells (`NavBar` + `TabBar` on iOS; `MacWindow` + `Sidebar` + `Toolbar` on macOS; `CfLargeTitleScaffold` + `CfTabBar` on Flutter).
2. Normalize all spacing to `tokens/layout.json :: spacing`, margins to `16pt` (iOS) / `20pt` (macOS), hit targets to `>= 44pt` (iOS) / `>= 28pt` (macOS), and enforce safe areas (`viewport-fit=cover` on Web).
3. Replace bordered boxes and shadowed lists with `List` / `ListSection` (`insetGrouped` or `plain`) and `bg` / `bg-grouped` / `bg-grouped-2` levels.

### Stage C — Liquid Glass & Continuous Shape
1. Remove any glass from content cards/rows/backgrounds and any stacked glass-on-glass. Apply `Glass` / `CfGlass` / native macOS `apply_liquid_glass` only to bars, floating controls, menus, popovers, alerts, and partial sheets.
2. Replace `rounded-*` / `BorderRadius.circular` on rectangular containers with `Squircle` / `SquircleBorder` (`smoothing: 0.6`) and verify concentric nesting (`inner = outer - padding`).
3. Ensure buttons, search fields, toggles, and segmented controls use capsule geometry (`tokens/shape.json :: shapes.capsule`).

### Stage D — Motion, Haptics, States & Accessibility
1. Swap all transitions to spring tokens, add zero-delay press states and pointer-only hover states, and wire haptics (`tokens/feedback.json`) without stacking haptic + sound on the same tap.
2. Ship explicit **empty, loading, error, offline, and destructive-confirmation** states (`patterns/states.md`) on every converted screen.
3. Verify light, dark (with `data-cf-elevated` on presented surfaces), `prefers-contrast: more`, `prefers-reduced-transparency: reduce`, `prefers-reduced-motion: reduce`, Dynamic Type scaling (no double-scaling in Flutter), and keyboard navigation (Tab order, focus rings, modal focus trap + `Esc` return, LTR/RTL roving focus).

### Stage E — Automated & Visual QA Audit
1. Run static lint: `node <PLUGIN_PATH>/hooks/scripts/lint.mjs --all --root .`
2. Run runtime DOM & keyboard audits (Web/Tauri):
   - `node <PLUGIN_PATH>/qa/computed-style-audit.mjs --url <url> --platform <ios|macos>`
   - `node <PLUGIN_PATH>/qa/ux-keyboard.mjs --url <url> --browser all --theme both`
3. Run platform analyzers (`tsc --noEmit` / `npm run build`, `flutter analyze` + `flutter test`, `cargo check`).
4. Run `apple-design-reviewer` (`visual` and `behavior` modes) or `/apple-audit`, and print the Apple Design Compliance report (marking any unexecuted check `NOT RUN (<reason>)`).

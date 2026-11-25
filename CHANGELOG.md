# Changelog

All notable changes to `cupertino-forge` are documented in this file.

## v2.1.0 — 2026-11-26 (Zero-Config Auto-Bootstrap & Global Antigravity Trigger)

Eliminates manual setup friction across both Claude Code and Google Antigravity with a single-command cross-platform project bootstrapper and safe non-destructive initialization.

- **Added Zero-Config Auto-Bootstrapper (`scripts/setup-project.mjs`):** Zero-dependency Node ESM CLI (`--target <dir> [--platform ios|macos|adaptive|auto] [--mode new|redesign|auto] [--ide antigravity|claude|both] [--force] [--dry-run] [--json]`) that auto-detects Web (Next.js/React/Vite), Flutter, or Tauri 2 stacks and `new` vs `redesign` modes, generates `.apple-design.json`, dynamically injects the live plugin path into `.agent/rules/cupertino-forge.md` (zero `<PLUGIN_PATH>` placeholders), safely appends `CLAUDE.md` without duplicating, builds tokens via `scripts/build-tokens.mjs`, copies adapter starter primitives without overwriting existing user files unless `--force` is specified, and prints Scenario A / Scenario B next steps.
- **Wired Commands to Auto-Bootstrapper:** Updated `commands/apple-init.md` and `commands/apple-redesign.md` so Step 1 executes `node "${CLAUDE_PLUGIN_ROOT}/scripts/setup-project.mjs" --target .` (with `--mode redesign` in `/apple-redesign`).
- **Updated Doctor & Regression Coverage:** Added `scripts/setup-project.mjs` to `scripts/verify-plugin.mjs` core runtime validation (`24/24` files) and added `tests/setup-project-regression.test.mjs` covering Web redesign, Flutter new, Tauri redesign, `--dry-run`, `--force`, non-overwrite safety, safe `CLAUDE.md` append, and empty-dir exit `2`.
- **Updated Documentation & Release Packaging (`v2.1.0`):** Updated `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `README.md`, and `GUIDE.md` (`Section 4.11`) for the 1-command auto-bootstrap workflow and rebuilt `cupertino-forge-v2.1.0.zip`.

## v2.0.0 — 2026-11-26 (`cupertino-forge` Apple DNA v2 Release)

Major cross-platform release unifying official Apple HIG DocC tables, Apple iOS 27 / macOS 27 Sketch & Figma kit measurements, deterministic Playwright/Flutter/Tauri verification harnesses, an Existing Project Redesign Engine, Canonical Master Use-Flow, Google Antigravity cross-IDE bridge, and clean release packaging.

### Phase 4 — Final Sync, Release v2.0.0 & Clean Packaging (2026-11-26)
- **Version bump to `2.0.0`:** Updated `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `README.md`, and `GUIDE.md`.
- **Synced all foundation, macOS component, Tauri, and command docs with Phase 3c/3e measurements:** Updated `01-layout.md`, `05-shape.md`, `06-elevation.md`, `15-version-diff.md`, `components-macos/{window-chrome,presentation,controls}.md`, `skills/apple-tauri/SKILL.md`, and `commands/{apple-screen,apple-component,apple-sync}.md`; regenerated `skills/apple-flutter/assets/lib/apple_ui/theme/apple_tokens.dart`.
- **Honest parity audit:** Audited all manifests, `SKILL.md` files, `README.md`, and `GUIDE.md` — removed overstated "indistinguishable" / "look and feel exactly like Apple" wording in favor of explicit native parity vs cross-platform documented visual approximation + 100% Apple design psychology, spatial hierarchy, motion discipline, and UX.
- **Added clean cross-platform packager (`scripts/package-plugin.mjs`):** Zero-dependency Node ZIP builder emitting `cupertino-forge-v2.0.0.zip` containing only runtime plugin files (strictly excluding `_upgrade/`, `_upgrade00-inputs/`, `.git/`, `tests/`, `qa/node_modules/`, `qa/references/`, `qa/out/`, and `*.log`).
- **Closed Phase 4 Merge Closure (`_upgrade/03-merge/MERGE-REPORT.md`):** Recorded full final verification proofs across Node, Web (Chromium/WebKit/Firefox), Flutter, Tauri, and remaining 70 estimated token checklist for physical Mac/iPhone validation.
- **Phase 4b Documentation Overhaul (`README.md`, `GUIDE.md`) & v2.0.0 ZIP Rebuild:** Rewrote `README.md` into a high-signal dual-IDE landing & quickstart doc (honest parity matrix, repository map, Claude Code + Google Antigravity setup, 7-command cheat sheet, Mermaid Master Use-Flow, verified CLI flags) and `GUIDE.md` into a complete engineering reference manual (Mermaid pipeline, token provenance, 5-stage brownfield redesign, copy-paste Web/Flutter/Tauri integration code, all 10 CLI/QA script specs with exact flags & exit codes, Windows gotchas, FAQ); audited with EGM (`egm-structural`, `egm-codebase-details`) & static cross-check (`0` broken internal paths/links), and rebuilt `_upgrade/scratch/cupertino-forge-v2.0.0.zip`.

### Phase 0 — Runtime Verification, Compliance Integrity & Confirmed Bug Fixes
- **Added `/apple-doctor` (`commands/apple-doctor.md`) & `scripts/verify-plugin.mjs`**: Cross-platform runtime validator (Windows, macOS, Linux via `path.join` and `process.execPath`) checking manifest, `${CLAUDE_PLUGIN_ROOT}/...` resolution (`32` paths), `tokens/*.json`, `lint.mjs` hooks, `build-tokens.mjs`, sound WAVs, and optional Python/Playwright probing (`NOT RUN` when missing instead of false `OK`).
- **Added `NOT RUN (<reason>)` status**: Updated `skills/apple-design-core/SKILL.md`, `skills/apple-design-audit/SKILL.md`, `skills/apple-design-audit/references/scorecard.md`, and `commands/apple-audit.md` so unexecuted passes are excluded/flagged honestly instead of reported `OK`.
- **Fixed `hooks/scripts/lint.mjs`**: Eliminated regex backtracking in `css-shadow`, `font-family`, and `raw-backdrop` (moving `\b` inside keyword branches so `var(--cf-*)` passes), normalized Windows CRLF & quoted `git status --porcelain` paths, and ensured `--json` emits clean parseable JSON without trailing summary text.
- **Fixed `scripts/build-tokens.mjs`**:
  - Emitted previously missing `--cf-radius-device-display` (`55px`), `--cf-radius-sheet-floating` (`38px`), `--cf-radius-sheet`, `--cf-shadow-none: none`, and all elevation levels in CSS, Tailwind v4 `@theme inline`, and Dart.
  - Scoped `@media (prefers-contrast: more)` so light high-contrast rules no longer override `:root[data-theme="dark"]`, and completed `@media (prefers-reduced-transparency: reduce)` + `:root[data-transparency="reduce"]` across all four glass surfaces (`glass`, `glass-clear`, `glass-large`, `glass-menu`).
- **Fixed `scripts/contrast-check.mjs`**: Added 3-digit hex (`#fff`) parsing without `TypeError`, updated WCAG sRGB linearization threshold from `0.03928` to `0.04045`, implemented Apple HIG Accessibility contrast rules (`<= 17pt`: `4.5:1`; `>= 18pt` or `Bold` or glyph: `3.0:1`), and auto-paired Apple `#0088FF` with Dark `#0091FF` so `node scripts/contrast-check.mjs --accent #0088FF` passes cleanly with advisory small-text warning.
- **Fixed Windows Python compatibility & Chrome/Edge discovery**: Replaced direct `python3` invocations in `agents/apple-design-reviewer.md`, `skills/apple-design-audit/SKILL.md`, `scripts/capture.py`, and `scripts/synth-sounds.py` with `python` (with macOS/Linux `python3` note), avoiding Windows Store alias exit `9009`, and added `LOCALAPPDATA` / `Program Files (x86)` / `msedge.exe` fallback paths in `scripts/capture.py`.
- **Fixed Toggle simultaneous haptic + sound firing**: Updated `haptic()` in `skills/apple-web/assets/lib/haptics.ts` to return `boolean` and gated `controls.tsx` `playSound()` on `!haptic('selection')`; exposed `CfHaptics.supported` in `cf_haptics.dart` and gated `cf_controls.dart` sound playback cleanly.
- **Added regression test suite (`tests/*.test.mjs`)**: 5 zero-dependency `node --test` suites verifying all 6 Phase 0 fixes.

### Phase 1 — Token Reconciliation, Provenance Metadata & Foundations Merge
- **Source & Provenance Audit (`tokens/*.json`)**:
  - Added `$source`, `$class` (`official` / `measured` / `inferred` / `estimated` / `platform-dependent`), `$url`, and `$platform` provenance metadata across all 9 token JSON files.
  - **`color.json`**: Kept kit-measured colors (`measured`); tagged HIG PNG-swatch high-contrast colors `inferred`; added explicit `official` tag to `dimming.clearGlassOverBrightContent` (`#000000@0.35`); moved previously hardcoded `build-tokens.mjs` macOS grouped/bg2/bg3/separatorOpaque and HC label values into `color.json` (`estimated`).
  - **`typography.json`**: Tagged `iosDynamicType`, `macosTextStyles`, and `trackingTables` (`sfProIOS`, `sfProMacOS`, `sfProRounded`) as `official` (verified `0` diffs against Official Apple HIG DocC `typography.json`); preserved HIG macOS weights (`headline` 700/800, `caption1` 400/500, `caption2` 500/600) while recording Sketch kit disagreement (`900`/`600`/`400`) under `$kitConflict` with `needs-device-verification`; added `nonLatin` rules (`Kohinoor Bangla`, `SF Arabic`, `0em` tracking override).
  - **`shape.json` & `layout.json`** (Rule 1 conflict protection): Kept Apple primary `deviceDisplay` (`55pt` / `30pt`) and `topDynamicIsland` (`62pt`); stored community SPI reports (`ScreenCorners` `62pt`/`18pt` and `screens.guide` `59pt`) under `$alt` with `$class: "inferred/community"`; added official HIG hit-target minimums/padding (`28/20`, `12/24`), Widgets (`16pt`/`11pt`), Live Activities (`14pt`/`28pt`), macOS menuBar (`24pt`), and split-view thin divider (`1pt`).
  - **`materials.json`, `motion.json`, `elevation.json`, `feedback.json`, `icons.json`**: Added `officialSpec`, unified `intensityCurve` (`0.7 + 0.6 * intensity`), Safari-aware `reducedTransparency`, `perfBudget` (`maxSimultaneousBackdrop: 6`, `flutterRequireBackdropGroup`), explicit `interruptible` + `reducedMotion` crossfade alternatives on every transition, and `sliderKnob.dark` fallback.
- **Upgraded `scripts/build-tokens.mjs`**: Removed all hardcoded hex strings; added non-Latin `:lang(bn), :lang(ar), :lang(he) { letter-spacing: 0 !important; }` CSS rule; added `--targets rust,json,estimates` (`apple_tokens.rs`, `cupertino.tokens.resolved.json`) and `--write-estimates` to auto-generate `tokens/ESTIMATES.md` (`80` estimated groups/entries + `3` conflicts/alternates).
- **Updated Foundations (`skills/apple-design-core/references/foundations/`)**: Updated `00`–`15` with `[official]`/`[measured]`/`[inferred]`/`[estimate]` tags, fixed `03-color.md` contrast boundary (`18pt` / `Bold` `3:1`, `<= 17pt` `4.5:1`), added Glass vs Solid decision tree & Safari matrix in `04-liquid-glass.md` and `11-accessibility.md`, added Interaction->Motion & shared-element transitions in `08-motion.md`, separated Official Oct 2026 HIG deltas vs press reports in `15-version-diff.md`, and added `16-localization-rtl.md`.

### Phase 3b-lite — Estimate Resolution Promotion
- **Promoted `tokens/shape.json :: borders` (`0.5px` hairline, `1px` control) from `estimated` to `measured`**: Verified directly against Apple iOS 27 Sketch Kit (`Controls.Light.Knobs - Toggle.03 - Clicked - Glow.borders.1` = `0.5px`, `.borders.0` = `1px`) and macOS 27 Sketch Kit (`Panels.Dark.borders.0` = `1px`, `Global.Focus Ring.borders.1` = `1px`).
- **Preserved `tokens/elevation.json :: levels.knob` & `levels.popover` as `estimated`**: Recorded Apple Sketch kit values under `$kitReference` (`$class: "measured-kit-reference"`) without overwriting primary cross-platform values (different component for macOS Panels vs Popover; iOS kit toggle knob shadow `0 3px 36px rgba(0,0,0,0.05)` appears flat/invisible in light/dark CSS without Sketch's dropped layers).

### Phase 3c — Figma Kit Geometry Measurement (iOS 27 & macOS 27, 2026-11-25)
- **Promoted to `$class: "measured"` (confirmed values):**
  - `shape.json :: continuousCorner.smoothing`: `0.6` (from `inferred` -> `measured`; 178 nodes across iOS 27 & macOS 27 Figma kits, e.g. `585:3372`, `5473:20461`).
  - `layout.json :: ios.toggle`: `64×28`, knob `38×24`, inset `2` (iOS 27 nodes `10456:1252`, `I5433:20197;508:70021`).
  - `layout.json :: ios.slider`: `trackHeight: 6`, knob `38×24` (iOS 27 nodes `5428:5504`, `5437:1568`).
  - `layout.json :: ios.searchField`: `height: 44` (`48pt` bottom variant noted; iOS 27 nodes `5565:33301`, `5840:30472`, `5565:35246`).
  - `layout.json :: macos.controlSizes`: `mini: 16, small: 20, regular: 24, large: 28, extraLarge: 36` (macOS 27 nodes `4348:11337/11331/11313/11319/11321`, `4341:2332`).
- **Updated & promoted to `$class: "measured"` (contradicted values, `$previous` preserved):**
  - `layout.json :: ios.stepper.width`: `94` -> `92` (iOS 27 nodes `5415:17699`, `29:56851`).
  - `layout.json :: ios.textField.height`: `44` -> `52` (iOS 27 node `553:23061`; `horizontalPadding: 16` confirmed).
  - `layout.json :: ios.alert.padding`: `20` -> `14` (iOS 27 nodes `65:57149`, `61:67601`; `width: 300`, `buttonHeight: 48` confirmed on `5446:6658`).
  - `layout.json :: ios.sheet`: `grabber` `36×5 (topInset 5)` -> `60×4 (topInset 6)`, `floatingInsetAtMedium` `8` -> `6` (iOS 27 nodes `5827:57545`, `10525:1687`, `10525:1635`).
  - `layout.json :: macos.menu.separatorHeight`: `9` -> `11` (macOS 27 node `4353:3152`; `itemHeight: 24` on `240:7945`, `outerPadding: 5` on `483:8811`).
- **Updated 5 unambiguous subfields in `shape.json :: radiusMacOS` (outer group kept `estimated`):**
  - `window`: `12` -> `16` (macOS 27 nodes `585:3372`, `4363:18479`).
  - `sheet`: `12` -> `16` (macOS 27 nodes `121:11423`, `4358:15436`).
  - `alert`: `16` -> `10` (macOS 27 nodes `121:11254`, `121:11240`).
  - `popover`: `16` -> `10` (macOS 27 nodes `4336:13293`, `4336:13305`).
  - `menuItemHighlight`: `6` -> `8` (macOS 27 nodes `685:23691`, `685:23678`).
- **Updated `$kitReference` in `tokens/elevation.json`:** Added Figma node references for `levels.knob` (`I478:1094;475:568;4348:11314`, `5437:1568`) and `levels.popover` (`61:65449`); primary estimates preserved.

### Phase 3d — Existing Project Redesign Engine & Google Antigravity Bridge (2026-11-26)
- **Added Existing Project Redesign Playbook (`skills/apple-design-core/references/patterns/redesign-playbook.md`):** 5-section engineering guide covering Deconstruction & IA Audit, Psychology & Philosophy Mapping, iOS/macOS Pattern Translation Matrix, Motion & Micro-interaction Upgrade Checklist, and Platform-Specific Conversion Order (Web, Flutter, Tauri).
- **Added `/apple-redesign` command (`commands/apple-redesign.md`) & router entry (`skills/apple-design-core/SKILL.md`):** Workflow command for detecting stack/style, loading `redesign-playbook.md`, converting screens in order, and running static/runtime QA audits.
- **Added Google Antigravity & Cross-IDE Bridge (`templates/AGENTS.apple.md`):** Portable rule template for `.agent/rules/` or project-root `AGENTS.md` with `<PLUGIN_PATH>` routing and manual terminal verification commands (`build-tokens.mjs`, `lint.mjs`, `contrast-check.mjs`, `computed-style-audit.mjs`, `ux-keyboard.mjs`) replacing Claude Code hooks.
- **Updated `README.md`, `GUIDE.md`, and `scripts/verify-plugin.mjs`:** Documented Google Antigravity setup, `/apple-redesign`, honest cross-platform parity framing, and added the 3 new Phase 3d artifacts to `verify-plugin.mjs` core runtime validation (`21/21` files).

### Phase 3e — Canonical Master Use-Flow & Plugin Readiness Audit (2026-11-26)
- **Added Canonical Master Use-Flow (`skills/apple-design-core/references/workflows/use-flow.md`):** Unified 5-section execution workflow (Entry Decision Tree for Scenarios A–D, Step-by-Step Serial Execution Flow, Blocking Quality Gates with `NOT RUN (<reason>)` discipline, Claude Code vs. Google Antigravity Execution Mapping, and Best-Output Prompting & Anti-Shortcut Rules).
- **Synced IDE entrypoints & router:** Added `workflows/use-flow.md` as Step 0 and top router entry in `skills/apple-design-core/SKILL.md`, linked it at the start of `templates/CLAUDE.apple.md` and `templates/AGENTS.apple.md`, updated `commands/apple-init.md` next-command handoff (`/apple-screen` vs `/apple-redesign`), and documented the Master Use-Flow in `README.md` and `GUIDE.md`.
- **Updated `scripts/verify-plugin.mjs`:** Added `skills/apple-design-core/references/workflows/use-flow.md` to `requiredFiles` (`22/22` core runtime files verified).

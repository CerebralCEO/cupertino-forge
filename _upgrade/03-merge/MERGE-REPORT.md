# cupertino-forge v2.0.0 — Final Merge & Release Closure Report

> **Release:** `cupertino-forge@2.0.0` (`zerofounder-local`)
> **Date:** 2026-11-26
> **Workspace:** `D:\Claude-Plugins\cupertino-forge`
> **Branch:** `main` (all Phase 0–4 work merged and committed directly on `main`)

---

## 1. Executive Upgrade Summary (v1.0.0 → v2.0.0)

| Phase | Scope Delivered |
|---|---|
| **Phase 0** | `/apple-doctor` (`scripts/verify-plugin.mjs`), `NOT RUN (<reason>)` honesty contract, lint regex/Windows CRLF fixes, `build-tokens.mjs` HC/RT/radius fixes, HIG `contrast-check.mjs` fixes, Toggle haptic+sound de-stacking, Windows `python` compatibility, regression tests. |
| **Phase 1** | Full `$class`/`$source`/`$url`/`$platform` provenance across all 9 `tokens/*.json` files reconciled against 62 Official Apple HIG DocC pages & Sketch kits; `build-tokens.mjs` zero-hex + Rust/JSON/`ESTIMATES.md` targets; Foundations `00`–`16` (`16-localization-rtl.md` added). |
| **Phase 2a / 2b** | Web adapter upgrades (`theme-script.ts` zero-FOUC, `Squircle` mask+shadow, GPU `Sheet` drag, LTR/RTL roving focus, zero arbitrary `[Npx]`, `Alert`/`Sheet` focus return); Flutter upgrades (single-pass text scaling, `CfGlass` unclipped shadow + `BackdropGroup`, `ValueNotifier` nav bar, 6 new widgets `CfTextField`/`CfSearchField`/`CfSlider`/`CfMenu`/`CfProgressBar`/`CfActivityIndicator`, iOS/Android native haptics); Tauri 2 Direct vs Mac App Store (`macOSPrivateApi: false`) + `.apple-design.json` Rust bridge. |
| **Phase 3a / 3b-0 / 3b-lite** | Preserved reproducible harnesses in `tests/harness/{web,flutter,tauri}/`; `qa/computed-style-audit.mjs` (12 checks, 17 seeded defects + blind gap ledger); `qa/ux-keyboard.mjs` (6 keyboard checks + seeded defects); `qa/ACCESSIBILITY-TRADEOFFS.md`; Sketch kit inventory (`qa/reference-manifest.json` 1,078 entries); limited HIG Extras (`references/extras/`, App Icon, TipKit, Live Activities, README Legal); 72-image `scripts/capture.py --matrix`, two-mode `apple-design-reviewer` (`visual` + `behavior`), `/apple-audit --reference <dir>`. |
| **Phase 3c** | Read-only Figma MCP extraction (`7/8` Starter budget calls) across Apple iOS 27 & macOS 27 Figma kits: verified 1× pt scale, measured `cornerSmoothing: 0.6` (178 nodes), promoted 9 estimate groups + `continuousCorner` to `measured` (`79 → 70` estimated groups), updated 5 `radiusMacOS` subfields (`window`/`sheet` 16, `alert`/`popover` 10, `menuItemHighlight` 8). |
| **Phase 3d / 3e** | Existing Project Redesign Engine (`patterns/redesign-playbook.md` + `/apple-redesign`); Canonical Master Use-Flow (`workflows/use-flow.md`); Google Antigravity & cross-IDE bridge (`templates/AGENTS.apple.md`); synced IDE entrypoints (`SKILL.md`, `CLAUDE.apple.md`, `AGENTS.apple.md`, `README.md`, `GUIDE.md`). |
| **Phase 4** | Final doc/command/asset sync, honest parity claim audit, version bump to `2.0.0`, cross-platform zero-dependency release packager (`scripts/package-plugin.mjs`), full verification suite, and this Merge Closure Report. |

---

## 2. Phase 4 Target vs Proof

| # | Target | Status | Exact Command & Observed Proof |
|---|---|---|---|
| 1 | Phase 3c & 3e Doc, Command & Asset Sync | **PASS** | Synced `01-layout.md`, `05-shape.md`, `06-elevation.md`, `15-version-diff.md`, `components-macos/{window-chrome,presentation,controls}.md`, `skills/apple-tauri/SKILL.md`, `commands/{apple-screen,apple-component,apple-sync}.md`, `agents/apple-spec-researcher.md`; regenerated `skills/apple-flutter/assets/lib/apple_ui/theme/apple_tokens.dart` via `node scripts/build-tokens.mjs --out skills/apple-flutter/assets/lib/apple_ui/theme --targets dart`. |
| 2 | Honest Parity Claim Audit | **PASS** | Audited `README.md`, `GUIDE.md`, `.claude-plugin/{plugin,marketplace}.json`, all `SKILL.md` & `commands/*.md`; replaced overstated `"indistinguishable"` / `"exactly like Apple"` wording with explicit native parity on Apple platforms + documented visual approximation elsewhere (further tightened in v2.1.1 Phase 6 hygiene to remove the unverified `"100% psychology"` phrasing). |
| 3 | Version Bump (`2.0.0`) & Release Docs | **PASS** | `.claude-plugin/plugin.json` (`2.0.0`), `.claude-plugin/marketplace.json` (`2.0.0`), `README.md`, `GUIDE.md`, `CHANGELOG.md` updated; confirmed by `verify-plugin.mjs` (`manifest cupertino-forge@2.0.0`). |
| 4a | Plugin Doctor (`scripts/verify-plugin.mjs`) | **PASS** | `node scripts/verify-plugin.mjs` -> `Summary: 12 PASS, 0 NOT RUN, 0 FAIL` (`manifest: cupertino-forge@2.0.0`, `core-runtime-files: 23/23 present`, `tokens-json-schema: 9 JSON files valid`, `plugin-root-paths: 53 path references verified`, `audio-assets: 9 WAV files`, Node/Playwright/Flutter/Cargo PASS). |
| 4b | Unit & Regression Tests | **PASS** | `node --test tests/*.test.mjs` -> `tests 15, pass 15, fail 0, skipped 0` (`duration_ms 7968.8403`). |
| 4c | Accent Contrast Check | **PASS** | `node scripts/contrast-check.mjs --accent "#0088FF"` -> `0 blocking contrast failure(s)` (3 expected small-text advisory warnings; all glyph/large `>=3:1` checks PASS). |
| 4d | Web Harness (`tsc`, `vite build`, `verify_mounted.py`) | **PASS** | `npx tsc --noEmit` (0 errors); `npm run build` (`built in 3.63s`); `verify_mounted.py`: **Chromium 7/7 PASS**, **WebKit 7/7 PASS**, **Firefox 7/7 PASS**. |
| 4e | Runtime QA (`computed-style-audit.mjs`, `ux-keyboard.mjs`) | **PASS (with documented tradeoff & `NOT RUN`)** | `computed-style-audit.mjs`: **iOS Light 12/12 (100/100)**, **iOS Dark 12/12 (100/100)**, **macOS Light 12/12 (100/100)**, **macOS Dark 11/12 (92/100)** (1 pre-existing Apple dark accent `3.23:1` contrast tradeoff in `qa/ACCESSIBILITY-TRADEOFFS.md`). `ux-keyboard.mjs`: **Chrome Light 6/6 PASS**, **Chrome Dark 6/6 PASS**; WebKit & Firefox **`NOT RUN`** (Node Playwright v1.52 `webkit-2388`/`firefox-1572` absent; Python Playwright `webkit-2104`/`firefox-1466` verified via `verify_mounted.py`). |
| 4f | Flutter Harness (`flutter analyze`, `flutter test`) | **PASS** | `cd tests/harness/flutter; flutter analyze; flutter test` -> `No issues found! (ran in 3.9s)` and `+7: All tests passed!`. |
| 4g | Tauri Harness (`cargo check`, `cargo test --lib`) | **PASS** | `cargo check` (`Finished dev profile in 4.92s`); `cargo test --lib` (`2 passed; 0 failed; 0 ignored`: `falls_back_to_token_radius_and_package_name`, `parses_mas_distribution_and_native_chrome`). |
| 5 | Clean Release Packager (`scripts/package-plugin.mjs`) | **PASS** | `node scripts/package-plugin.mjs` -> `Packaged 160 files (431.4 KB) -> _upgrade/scratch/cupertino-forge-v2.0.0.zip`, `Forbidden entries: 0`; verified independently with Python `zipfile`: `ZIP_VERIFY: entries=160 size_kb=431.4 bad_crc=None forbidden=0`. `_upgrade00-inputs/` preserved in repo for audit citations and strictly excluded from release ZIP. |

---

## 3. Audit Findings Closure Status (A1–A12 & Key Cross-Platform Findings)

| Finding | Status | Resolution / Known Limitation |
|---|---|---|
| **A1 / A2** | **Closed** | Full runtime files + `build-tokens.mjs` verified (`verify-plugin.mjs` 23/23). |
| **A3** | **Closed** | `root.tsx` + `theme-script.ts` set `data-theme`, `data-contrast`, `data-transparency` pre-hydration (zero FOUC, verified in Chromium/WebKit/Firefox). |
| **A4** | **Closed (Documented Approximation)** | `apple-flutter/SKILL.md` explicitly documents `CfPageRoute` as a `CupertinoPageRoute` approximation (use `animateSpring` / `SpringSimulation` for interactive control motion). |
| **A5** | **Known Limitation (Intentional)** | Web `tab-bar.tsx` & Flutter `cf_tab_bar.dart` use `fill-3` / subtle selection pill inside the glass `TabBar` to avoid muddy glass-on-glass stacking on non-Apple renderers. |
| **A6** | **Closed / Known Limitation** | `sheet.tsx` uses GPU `transform` + content scroll-top handoff (verified 3 engines). Non-modal medium-detent pass-through interaction remains a Radix `Dialog` modal limitation on Web; documented as approximation. |
| **A7** | **Known Limitation** | `Toggle` (`controls.tsx`, `cf_controls.dart`) supports tap + press-stretch without drag-to-toggle knob scrubbing (Radix Switch / Flutter GestureDetector limitation). |
| **A8** | **Closed** | Reproducible harnesses shipped in `tests/harness/{web,flutter,tauri}/` with `tests/harness/README.md` and `/apple-doctor` toolchain probes. |
| **A9** | **Closed** | Zero arbitrary `[Npx]` Tailwind classes in `skills/apple-web/assets/components/apple/*.tsx` (enforced by `tests/web-primitives-regression.test.mjs`); `--cf-radius-device-display` emitted by `build-tokens.mjs`. |
| **A10** | **Closed** | `commands/apple-audit.md` delegates directly to `skills/apple-design-audit/SKILL.md`; canonical flow unified in `workflows/use-flow.md`. |
| **A11** | **Closed** | `apple_config.rs` parses `.apple-design.json` into Rust (`get_apple_design_config` command + `distribution: direct | mac-app-store`). |
| **A12** | **Closed** | Unified `intensityCurve` (`0.7 + 0.6 * intensity`) documented in `tokens/materials.json` and mirrored across Web CSS & Flutter `CfGlass`. |
| **V-01..V-06, LG-1..4, M-01..6, U-01..7, AX-1..8, PF-1..6** | **Closed / Documented** | Fixed across Phases 0–3c (squircle mask+shadow, single-pass Flutter text scaling, `MotionConfig reducedMotion`, LTR/RTL roving focus, `BackdropGroup`, `ValueNotifier` nav bar, MAS `macOSPrivateApi: false`, HIG contrast rules, `qa/ACCESSIBILITY-TRADEOFFS.md`). Platform-inherent constraints (Safari SVG lens, Safari `prefers-reduced-transparency` media query, desktop haptics, Inter vs SF font on non-Apple OS) are documented explicitly in adapter parity matrices and `GUIDE.md` Section 14. |

---

## 4. Remaining 70 Estimated Token Groups & Physical Mac/iPhone Verification Checklist

After Phase 3c Figma kit extraction, **`tokens/ESTIMATES.md`** contains **70 remaining estimated groups/entries** (+ 3 `$alt` / `$kitConflict` entries):
- **Not present in static Figma/Sketch kits (56 entries):** `motion.json` spring/transition timings (26), `color.json` secondary macOS/HC fallbacks (11), `materials.json` CSS blur sigmas & GPU perf budget (7), `layout.json` 4pt spacing/margins/zIndex (4), `typography.json` Inter/Bangla heuristics (3), `elevation.json` `raised`/`toast` (2), `feedback.json` web haptics & WAV synthesis (2), `icons.json` Lucide stroke weights (1).
- **Ambiguous / multi-size in kits (14 entries):** `ios.button` (3 kit sizes `28/34/50` vs 5-size scale), `ios.segmentedControl` (`32`/`50`/`36`), `ios.toolbar` (`44`/`48`/`54`), `ios.tabBar` (height `62` measured; `sideInset` varies by tab count), `ios.listRow`, `ios.pageControl`, `ios.safeArea` (legacy notch/SE), `macos` parent group, `macos.trafficLights` (`leadingInset` 19 Default vs 12 Compact), `macos.sidebar`, `radiusIOS` outer group, `radiusMacOS` outer group (`tooltip`/`card`/`dockGlass`/`checkbox`), `elevation.levels.knob`, `elevation.levels.popover`, `elevation.levels.sheet`.

### Physical Mac / iPhone Verification Checklist (Manual Device Pass)
- [ ] **macOS 27 hardware:** Verify `NSGlassEffectView` (`apply_liquid_glass`) radius (`16pt`) and active/inactive window shadow in Tauri `direct` build vs `apply_vibrancy(Sidebar)` in `mac-app-store` build.
- [ ] **macOS 27 hardware:** Resolve `typography.json :: macosTextStyles.$kitConflict` (`headline` 700/800 vs 900, `caption1` 400/500 vs 600, `caption2` 500/600 vs 400) via Xcode/SwiftUI `Font.headline` / `.caption` / `.caption2` runtime dump.
- [ ] **iPhone 17 / 17 Pro & iPad Pro M4/M5 hardware:** Verify `deviceDisplay` corner radius (`55pt`/`30pt` vs `$alt` `62pt`/`18pt`) and Dynamic Island `safeArea.top` (`62pt` vs `59pt`), and capture real-device reference screenshots into local gitignored `qa/references/device/` for `/apple-audit --reference`.
- [ ] **iOS & macOS real devices:** Visually verify Liquid Glass tint readability over busy photography in Light, Dark, Increased Contrast, and Reduce Transparency modes (`qa/ACCESSIBILITY-TRADEOFFS.md`), and verify `AppleHapticsPlugin.swift` (`UINotificationFeedbackGenerator`) tactile feel on iPhone.

---

## 5. Step-by-Step Packaging & Installation Commands

### Build Clean Release ZIP (Windows, macOS, Linux)
```bash
node scripts/package-plugin.mjs
# Output: _upgrade/scratch/cupertino-forge-v2.0.0.zip (160 runtime files, 0 forbidden folders)
```

### Install in Claude Code
1. Unzip `cupertino-forge-v2.0.0.zip` to a stable folder (e.g., `D:\Claude-Plugins\cupertino-forge` or `~/cupertino-forge`).
2. Run inside Claude Code:
   ```
   /plugin marketplace add D:\Claude-Plugins\cupertino-forge
   /plugin install cupertino-forge@zerofounder-local
   ```
3. Restart Claude Code and run `/apple-doctor` to confirm `cupertino-forge@2.0.0` is healthy.

### Setup in Google Antigravity (or Other IDEs without Claude Hooks)
1. Unzip or clone `cupertino-forge` to a stable local folder (e.g., `D:\Claude-Plugins\cupertino-forge`).
2. Copy `templates/AGENTS.apple.md` into your project at `.agent/rules/cupertino-forge.md` (Google Antigravity) or project-root `AGENTS.md`.
3. Update `<PLUGIN_PATH>` inside that file to your local folder path, and copy `templates/apple-design.json` to `.apple-design.json`.
4. Follow `skills/apple-design-core/references/workflows/use-flow.md` and run the manual terminal gates (`build-tokens.mjs`, `lint.mjs`, `contrast-check.mjs`, `computed-style-audit.mjs`, `ux-keyboard.mjs`) after UI edits.

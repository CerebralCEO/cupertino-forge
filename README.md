# cupertino-forge

Apple iOS 27 and macOS 27 (Liquid Glass) design system for Claude Code, Google Antigravity, and cross-IDE workflows. On Apple platforms, native APIs deliver maximum parity; on Web (Next.js + shadcn), Flutter, and Tauri 2, `cupertino-forge` enforces documented visual approximation paired with 100% Apple design psychology, spatial hierarchy, motion discipline, and UX.

## Install (Windows, macOS, Linux)

### Claude Code
1. Clone or unzip to a stable folder, for example `D:\Claude-Plugins\cupertino-forge`.
2. In Claude Code:
   ```
   /plugin marketplace add D:\Claude-Plugins\cupertino-forge
   /plugin install cupertino-forge@zerofounder-local
   ```
   Restart Claude Code when asked.
3. Requirements: Node 18+ (hooks, linter, token builder). Optional: Python 3 with `playwright` (screenshots), Node `playwright` in `qa/` (runtime DOM & keyboard audits), `numpy` (sound re-synthesis).

### Google Antigravity & Other IDEs (No Claude Hooks Required)
1. Clone `cupertino-forge` to a stable local folder (e.g., `D:\Claude-Plugins\cupertino-forge`).
2. Copy [`templates/AGENTS.apple.md`](templates/AGENTS.apple.md) into your project's `.agent/rules/cupertino-forge.md` (Google Antigravity) or project-root `AGENTS.md`, and update `<PLUGIN_PATH>` to your local clone path.
3. Create `.apple-design.json` from `templates/apple-design.json` and run the terminal verification commands listed in `AGENTS.apple.md` (`build-tokens.mjs`, `lint.mjs`, `contrast-check.mjs`, `computed-style-audit.mjs`, `ux-keyboard.mjs`) after UI edits.

## Master Use-Flow (Claude Code & Google Antigravity)

Every task follows the single canonical workflow in [`skills/apple-design-core/references/workflows/use-flow.md`](skills/apple-design-core/references/workflows/use-flow.md):
1. **Pick scenario:** Greenfield (`/apple-doctor` -> `/apple-init` -> `/apple-screen`), Brownfield Redesign (`/apple-doctor` -> `/apple-init` -> `/apple-redesign` -> `/apple-audit`), Single Screen/Component (`/apple-screen` or `/apple-component`), or Token Sync/Audit (`/apple-sync` or `/apple-audit`).
2. **Enforce Quality Gates:** `verify-plugin.mjs`, `contrast-check.mjs`, `lint.mjs`, platform build/analyzer (`tsc` / `flutter analyze` / `cargo check`), `qa/computed-style-audit.mjs`, `qa/ux-keyboard.mjs`, and `apple-design-reviewer` (`visual` + `behavior`), marking any unavailable gate `NOT RUN (<reason>)`.

## Use

```
/apple-init web ios            # or: flutter macos, tauri adaptive "#5B3DF5"
/apple-screen settings screen with account, notifications and appearance
/apple-redesign src/app/dashboard ios   # convert an existing screen/project to Apple 27
/apple-component floating action toolbar for the photo editor
/apple-audit [--reference <dir>]        # score an existing app and get fixes
/apple-doctor                           # verify plugin health & local toolchains
/apple-sync                             # after WWDC or a kit update
```

After `/apple-init`, just prompt normally ("build the onboarding flow"). The SessionStart and UserPromptSubmit hooks remind Claude to load the skills, the PostToolUse hook blocks off-spec code, and the Stop hook refuses to finish while violations remain.

## What is inside

| Path | Purpose |
|---|---|
| tokens/ | Single source of truth. Colors, materials, typography exported from Apple's iOS 27 and macOS 27 Sketch UI kits (Nov 2026) plus HIG tables. Values Apple does not publish are tagged `"$source": "estimate"`. |
| scripts/build-tokens.mjs | Generates CSS variables, Tailwind v4 theme, TypeScript constants (springs) and Dart constants. |
| skills/apple-design-core | The brain: contract, 25 golden rules, router, Definition of Done, Compliance report, 16 foundation docs, iOS and macOS component specs, screen and state patterns, anti-patterns. |
| skills/apple-web | Next.js, Tailwind v4, shadcn remap, motion. 16 primitives (Glass, Button, NavBar, TabBar, List, Toggle, Slider, Segmented, Sheet, Alert, Menu, Popover, macOS window shell, Table ...). Typechecked and render tested. |
| skills/apple-flutter | CfApp, SquircleBorder, CfGlass, springs, haptics (with Android native constants), sounds, widgets. |
| skills/apple-tauri | Native macOS glass and vibrancy, Windows Mica, traffic lights, standard menu bar. |
| skills/apple-design-audit | 15 layer scorecard and report. |
| commands/ | apple-init, apple-screen, apple-redesign, apple-component, apple-audit, apple-doctor, apple-sync. |
| templates/ | `apple-design.json`, `CLAUDE.apple.md` (Claude Code), `AGENTS.apple.md` (Google Antigravity / cross-IDE bridge). |
| agents/ | apple-design-reviewer (visual + behavior QA), apple-spec-researcher (keeps tokens current). |
| hooks/ | Lint enforcement (web and Dart), session and prompt reminders, stop gate. |
| qa/ | Runtime Playwright DOM audit (`computed-style-audit.mjs`), keyboard UX audit (`ux-keyboard.mjs`), reference & estimate docs. |
| assets/sounds | Original synthesized UI sounds (no Apple audio). |

## Legal & Licensing

- **No Apple assets redistributed:** `cupertino-forge` does **not** ship, bundle, or redistribute Apple Design Resources (`.sketch`/`.fig` kits, exported UI PNGs, hardware frames, or brand button artwork), SF font files, SF Symbols, or Apple system sounds. It contains only independently documented HIG rules, measurements, and cross-platform implementation code.
- **System fonts & icons:** On Apple devices the system font renders San Francisco legally via system font stacks; elsewhere Inter is used with tracking compensation. Icons map to Lucide, Phosphor, or CupertinoIcons.
- **Brand-constrained controls:** Apple Pay, Tap to Pay on iPhone, Add to Apple Wallet, and Sign in with Apple must always use Apple's official APIs or unmodified official artwork downloaded directly from Apple (`skills/apple-design-core/references/extras/brand-constrained.md`).

## Verification status

- Plugin doctor (`node scripts/verify-plugin.mjs`) and unit/regression suite (`node --test tests/*.test.mjs`): automated across tokens, lint, contrast, runtime DOM audit, and keyboard UX audit.
- Web harness (`tests/harness/web`): Vite production build verified across Chromium, WebKit, and Firefox (`verify_mounted.py` 7/7) plus `computed-style-audit.mjs` and `ux-keyboard.mjs`.
- Flutter (`tests/harness/flutter`) and Tauri (`tests/harness/tauri`) harnesses: verified with `flutter analyze`, `flutter test`, and `cargo check` when those SDKs are installed (reported `NOT RUN` by `/apple-doctor` when absent).

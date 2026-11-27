# Apple Design System Rules (cupertino-forge) — Google Antigravity / Cross-IDE Bridge

> **Setup:** Copy this file into your project's `.agent/rules/cupertino-forge.md` (Google Antigravity) or project-root `AGENTS.md`. Replace `<PLUGIN_PATH>` below with your local clone path (for example `D:\Claude-Plugins\cupertino-forge` on Windows or `~/cupertino-forge` on macOS/Linux).

- **Plugin path (`<PLUGIN_PATH>`):** `D:\Claude-Plugins\cupertino-forge`
- **Project config:** `.apple-design.json` at project root (copy from `<PLUGIN_PATH>/templates/apple-design.json` if missing).
- **Parity contract:** Encodes Apple's published HIG principles and Apple Design Resources kit measurements; closest parity on Apple platforms with native APIs; documented approximation elsewhere; 67 values remain estimates (see `<PLUGIN_PATH>/tokens/ESTIMATES.md`).

## 1. Mandatory Reading Order

**Start here every session:** Read `<PLUGIN_PATH>/skills/apple-design-core/references/workflows/use-flow.md` first to select the entry scenario (Greenfield, Brownfield Redesign, Single Screen/Component, or Token Update/Audit) and follow its exact serial steps and blocking Quality Gates.

### Building a new screen or component
1. Read `.apple-design.json` (`platform`, `style`, `accent`, `glassIntensity`, `sounds`, `appearance`).
2. Read `<PLUGIN_PATH>/skills/apple-design-core/SKILL.md` (contract + 25 golden rules + router).
3. Read `<PLUGIN_PATH>/skills/apple-design-core/references/anti-patterns.md` (once per session).
4. Read the matching platform adapter skill and copy/use its primitives (never restyle shadcn/Material from scratch):
   - Web: `<PLUGIN_PATH>/skills/apple-web/SKILL.md` + `assets/`
   - Flutter: `<PLUGIN_PATH>/skills/apple-flutter/SKILL.md` + `assets/`
   - Tauri 2: `<PLUGIN_PATH>/skills/apple-tauri/SKILL.md` + `apple-web`
5. Read only the relevant foundation/pattern files from `<PLUGIN_PATH>/skills/apple-design-core/references/` (`foundations/00-principles.md` .. `16-localization-rtl.md`, `patterns/screens.md`, `patterns/states.md`) and exact token values from `<PLUGIN_PATH>/tokens/*.json`.

### Redesigning an existing project or screen
1. Read `<PLUGIN_PATH>/skills/apple-design-core/references/patterns/redesign-playbook.md` first.
2. Follow its 5-stage conversion order: **Tokens & Theme -> Layout & IA -> Liquid Glass & Shape -> Motion, Haptics, States & A11y -> QA Audit**.
3. Use `<PLUGIN_PATH>/commands/apple-redesign.md` as the step-by-step workflow checklist.

## 2. Hard Design Constraints
- Never write raw hex/rgb colors, px radii without squircle, hand-written shadows, off-scale font sizes, or `ease`/`ease-in-out`/`linear` movement curves in app code. Use generated tokens and adapter primitives only.
- Liquid Glass belongs **only** on functional controls (bars, floating controls, menus, popovers, alerts, partial sheets) — never on cards, list rows, or page backgrounds, and never stacked glass-on-glass.
- Continuous corners (`cornerSmoothing: 0.6`) via `Squircle` / `SquircleBorder` and concentric nesting (`inner = outer - padding`).
- Springs only (`tokens/motion.json`) with reduced-motion crossfade fallbacks.
- Every screen must ship explicit empty, loading, and error states (`patterns/states.md`).

## 3. Manual Terminal Verification (Replaces Claude Code Hooks)

Because Google Antigravity and non-Claude IDEs do not run `CLAUDE_PLUGIN_ROOT` hooks automatically, **run these terminal checks after every UI edit**:

```bash
# 1. Regenerate tokens whenever .apple-design.json or tokens/*.json changes
node "<PLUGIN_PATH>/scripts/build-tokens.mjs" --out src/styles/cupertino --targets css,tailwind,ts
# Flutter: --out lib/apple_ui/theme --targets dart
# Tauri:   --out src-tauri/src --targets rust

# 2. Validate custom brand accent contrast (if accent != null)
node "<PLUGIN_PATH>/scripts/contrast-check.mjs" --accent "#0088FF"

# 3. Run static design linter (must exit 0 before finishing)
node "<PLUGIN_PATH>/hooks/scripts/lint.mjs" --all --root .

# 4. Run runtime DOM & keyboard UX audits (when a web/Tauri dev or preview server is running)
node "<PLUGIN_PATH>/qa/computed-style-audit.mjs" --url http://127.0.0.1:3000 --platform ios
node "<PLUGIN_PATH>/qa/ux-keyboard.mjs" --url http://127.0.0.1:3000 --browser all --theme both
```

## 4. Reporting Rule
Finish every UI task with the **Apple Design Compliance** report from `<PLUGIN_PATH>/skills/apple-design-core/SKILL.md` Section 7. **Never** report an unexecuted check as `PASS` or `OK` — mark it `NOT RUN (<exact reason>)`.

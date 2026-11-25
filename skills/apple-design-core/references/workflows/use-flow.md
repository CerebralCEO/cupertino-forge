# Canonical Master Use-Flow (cupertino-forge)

This is the single canonical execution workflow for `cupertino-forge`. Both **Claude Code** and **Google Antigravity** (and any other agentic IDE) MUST follow the exact same scenario tree, serial step order, and blocking quality gates below.

> **Cross-platform parity contract:** Native Apple APIs provide maximum parity on iOS, iPadOS, and macOS. On Web, Flutter, and Tauri, this workflow enforces documented visual approximation paired with 100% Apple design psychology, spatial hierarchy, motion discipline, and UX.

---

## 1. Entry Decision Tree

Pick exactly one entry scenario before writing any code:

```
Start UI Task
  ├── No .apple-design.json AND greenfield app?
  │     └── Scenario A: Brand New Project (Greenfield Web / Flutter / Tauri)
  │
  ├── Existing app/screens built with generic / Material / Tailwind / shadcn UI?
  │     └── Scenario B: Existing Project Conversion (Brownfield Redesign)
  │
  ├── .apple-design.json already configured AND adding/modifying one screen or component?
  │     └── Scenario C: Single Screen or Single Component
  │
  └── Updating Apple release tokens, checking contrast/lint, auditing an app, or fixing UI bugs?
        └── Scenario D: Token Update or Design Audit / Bugfix
```

---

## 2. Step-by-Step Serial Execution Flow

### Scenario A — Brand New Project (Greenfield Web / Flutter / Tauri)
1. **Preflight plugin health:** Run `/apple-doctor` (`node <PLUGIN_PATH>/scripts/verify-plugin.mjs`). Record any `NOT RUN` toolchains honestly.
2. **Initialize project:** Run `/apple-init [web|flutter|tauri] [ios|macos|adaptive] [accent]`.
   - Creates `.apple-design.json` from `templates/apple-design.json`.
   - Validates custom accent with `scripts/contrast-check.mjs`.
   - Generates platform tokens via `scripts/build-tokens.mjs` (`css,tailwind,ts` for Web; `dart` for Flutter; `css,tailwind,ts,rust` for Tauri).
   - Copies adapter primitives (`skills/apple-web`, `apple-flutter`, or `apple-tauri` + `apple-web`).
   - Installs IDE rules (`templates/CLAUDE.apple.md` for Claude Code; `templates/AGENTS.apple.md` for Google Antigravity).
3. **Read core & adapter specs:** Read `skills/apple-design-core/SKILL.md`, `references/anti-patterns.md`, `references/foundations/00-principles.md`, `01-layout.md`, `patterns/screens.md`, `patterns/states.md`, and the matching adapter `SKILL.md`.
4. **Build screens:** Run `/apple-screen <description>` for each screen (shell first: navigation + root wrapper, then content screens with empty/loading/error states).
5. **Add missing reusable primitives (only if catalog lacks one):** Run `/apple-component <name>`.
6. **Run Quality Gates (Section 3):** Static lint -> platform compiler/analyzer -> runtime DOM & keyboard audits -> `apple-design-reviewer` (`visual` + `behavior`).
7. **Print Compliance Report:** Output `apple-design-core` Section 7 Compliance Report with any `NOT RUN (<reason>)` items and estimate-backed tokens explicitly listed.

### Scenario B — Existing Project Conversion (Brownfield Redesign)
1. **Preflight plugin health:** Run `/apple-doctor` (`node <PLUGIN_PATH>/scripts/verify-plugin.mjs`).
2. **Initialize tokens & primitives (if `.apple-design.json` is missing):** Run `/apple-init` and `scripts/build-tokens.mjs` so tokens and primitives exist before editing any legacy screen.
3. **Read Redesign Playbook first:** Read `references/patterns/redesign-playbook.md`, `references/foundations/00-principles.md`, `08-motion.md`, `references/anti-patterns.md`, `patterns/states.md`, and the platform adapter `SKILL.md`.
4. **Execute `/apple-redesign` screen-by-screen** following the 5-stage conversion order in `redesign-playbook.md`:
   - Stage A: Tokens & Theme Foundation (`.apple-design.json`, `build-tokens.mjs`, root wrapper).
   - Stage B: Layout & IA Deconstruction (remove card-in-card nesting, decorative borders, CTA clutter, hamburger drawers; install Apple native navigation).
   - Stage C: Liquid Glass & Continuous Shape (functional-layer-only glass, `Squircle` / `SquircleBorder` with `cornerSmoothing: 0.6`, concentric nesting).
   - Stage D: Motion, Haptics, States & Accessibility (springs from `tokens/motion.json`, zero-delay press, empty/loading/error states, reduced motion/transparency, contrast-more, Dynamic Type).
   - Stage E: QA Audit.
5. **Run full `/apple-audit` (plus `--reference <dir>` if reference images exist):** Executes static lint, `qa/computed-style-audit.mjs`, `qa/ux-keyboard.mjs`, screenshot capture (`scripts/capture.py`), and `apple-design-reviewer` (`visual` + `behavior`).
6. **Resolve all Blocking findings** (Rule-Conformance `< 85` is not done) and re-run failed gates.
7. **Print Compliance Report** (Section 7 of `SKILL.md`).

### Scenario C — Single Screen or Single Component
1. **Verify config:** Confirm `.apple-design.json` exists (if missing, run Scenario A step 2 first).
2. **Read targeted specs:** Read `SKILL.md`, `references/anti-patterns.md`, the platform adapter `SKILL.md`, and only the relevant references from the `SKILL.md` Section 2 router (`patterns/screens.md` + `patterns/states.md` for screens; `components-ios/*.md` or `components-macos/*.md` + `foundations/09-interaction-states.md` for components).
3. **Implement:** Run `/apple-screen <description>` or `/apple-component <description>` using existing generated tokens and adapter primitives only.
4. **Run Quality Gates (Section 3):** Static lint -> typecheck/analyzer -> runtime DOM & keyboard audits (when URL available) -> `apple-design-reviewer` (for visual changes).
5. **Print Compliance Report.**

### Scenario D — Token Update or Design Audit / Bugfix
- **For Apple release / token updates (`/apple-sync`):**
  1. Launch `apple-spec-researcher` to diff Apple kits / HIG against `tokens/*.json`.
  2. Confirm diff with user, apply updates preserving `$class` / `$source` / `$previous` metadata, and update `references/foundations/15-version-diff.md`.
  3. Rebuild generated files AND regenerate `tokens/ESTIMATES.md`:
     `node <PLUGIN_PATH>/scripts/build-tokens.mjs --out <tokensOut> --targets <targets> --write-estimates <PLUGIN_PATH>/tokens/ESTIMATES.md`
  4. Run `verify-plugin.mjs`, `contrast-check.mjs`, `lint.mjs`, and platform tests/analyzers.
- **For Design Audit / Bugfix (`/apple-audit`):**
  1. Run `lint.mjs --all --json`.
  2. Run `qa/computed-style-audit.mjs` and `qa/ux-keyboard.mjs` against the running URL (or report `NOT RUN (<reason>)`).
  3. Capture screenshots into `qa/out/` via `scripts/capture.py` (standard 4-image or `--matrix` 72-image) and run `apple-design-reviewer` (`visual` + `behavior`). Report `Fidelity: N/A (no reference)` when `--reference <dir>` has no images.
  4. Write `apple-audit-report.md`, ask before applying fixes (unless user asked to fix immediately), then re-verify after fixes.

---

## 3. Mandatory Quality Gates (Stop Conditions)

Do **NOT** advance past a failing gate or claim completion while a blocking gate is red:

| Gate | Command | Blocks Next Step If... | If Tool/Server Unavailable |
|---|---|---|---|
| **G1. Plugin Health** | `node <PLUGIN_PATH>/scripts/verify-plugin.mjs` | Any check reports `FAIL` | Never skip in plugin repo; optional toolchains report `NOT RUN` |
| **G2. Accent Contrast** | `node <PLUGIN_PATH>/scripts/contrast-check.mjs --accent "<hex>"` | Any blocking contrast failure (`< 3:1` glyph/large or `< 4.5:1` required text) | Run whenever `accent` is set or changed |
| **G3. Static Design Lint** | `node <PLUGIN_PATH>/hooks/scripts/lint.mjs --all --root .` | Exit code != `0` (any lint `error`) | Never skip; Node 18+ required |
| **G4. Platform Build / Analyzer** | Web: `tsc --noEmit` / `npm run build`<br>Flutter: `flutter analyze && flutter test`<br>Tauri: `cargo check` | Any compile, type, analyzer, or unit test error | Mark `NOT RUN (<missing SDK/toolchain>)` — never fake `PASS` |
| **G5. Runtime Computed-Style Audit** | `node <PLUGIN_PATH>/qa/computed-style-audit.mjs --url <url> --platform <ios\|macos>` | Exit code `1` (any real DOM/style `FAIL` not documented as accepted tradeoff) | Mark `NOT RUN (<no running URL or Playwright missing>)` |
| **G6. Keyboard & UX Accessibility** | `node <PLUGIN_PATH>/qa/ux-keyboard.mjs --url <url> --browser all --theme both` | Any `FAIL` on Tab order, focus ring, modal trap/`Esc`/return, roving focus, or Enter/Space | Missing browser engine reports `NOT RUN (<engine binary missing>)` |
| **G7. Design Review Score** | `apple-design-reviewer` (`visual` + `behavior`) or `/apple-audit` | Rule-Conformance `< 85` or any unresolved `Blocking` item | Mark visual pass `NOT RUN (<reason>)`; never fake Fidelity without `--reference` |

**Honesty rule:** Any gate that could not execute MUST be written as `NOT RUN (<exact reason>)` in the Compliance Report. Never mark an unrun gate `PASS`, `OK`, or `Tested`.

---

## 4. Claude Code vs. Google Antigravity Execution Mapping

Both environments execute the exact same workflow, differing only in automation mechanism:

| Workflow Step | Claude Code | Google Antigravity (or Other IDEs) |
|---|---|---|
| **Plugin Path Variable** | `${CLAUDE_PLUGIN_ROOT}` resolved automatically by plugin runtime | `<PLUGIN_PATH>` configured in `.agent/rules/cupertino-forge.md` or project-root `AGENTS.md` (copied from `templates/AGENTS.apple.md`) |
| **Project Rule Injection** | `templates/CLAUDE.apple.md` appended to `CLAUDE.md` + `SessionStart` / `UserPromptSubmit` hooks (`hooks/hooks.json`) | Workspace rule `.agent/rules/cupertino-forge.md` or root `AGENTS.md` loaded automatically by Antigravity |
| **Command Entrypoints** | Slash commands: `/apple-doctor`, `/apple-init`, `/apple-screen`, `/apple-redesign`, `/apple-component`, `/apple-audit`, `/apple-sync` | Read the matching command markdown in `<PLUGIN_PATH>/commands/*.md` and follow its steps verbatim |
| **Token Build** | Triggered by `/apple-init` or `/apple-sync` via `scripts/build-tokens.mjs` | Run `node "<PLUGIN_PATH>/scripts/build-tokens.mjs" --out <dir> --targets <targets>` in terminal |
| **Post-Edit Enforcement** | Automatic `PostToolUse` hook (`lint.mjs --hook post`, blocks with exit `2`) | Manual terminal gate after UI edits: `node "<PLUGIN_PATH>/hooks/scripts/lint.mjs" --all --root .` |
| **Pre-Finish Stop Gate** | Automatic `Stop` hook (`lint.mjs --hook stop` over git-changed files) | Manual pre-finish checklist: re-run `lint.mjs --all --root .` + platform build + runtime QA before replying done |
| **Visual & Behavior Review** | Invoke `apple-design-reviewer` agent (`agents/apple-design-reviewer.md`) | Capture screenshots via `python "<PLUGIN_PATH>/scripts/capture.py"` + run `qa/computed-style-audit.mjs` & `qa/ux-keyboard.mjs` + follow `agents/apple-design-reviewer.md` checklist |

---

## 5. Best-Output Prompting & Anti-Shortcut Rules

Follow these rules strictly to prevent degraded "Apple-ish" output:

1. **Never skip tokens to hardcode values:** Do not type raw hex colors, `rgb()`, `px` corner radii, hand-written `box-shadow`, off-scale `font-size`, or `ease`/`ease-in-out`/`linear` curves — even for "quick prototypes". If a token is missing, add it to `tokens/*.json`, rebuild via `build-tokens.mjs`, and import it.
2. **Never slap Liquid Glass onto broken IA:** On brownfield redesigns (Scenario B), **always** complete Stage B (Deconstruction & IA Audit: remove card-in-card nesting, decorative borders, CTA clutter, hamburger drawers) *before* applying Liquid Glass. Glass belongs only on the functional layer — never on content cards/rows and never glass-on-glass.
3. **Never ship happy-path-only screens:** Every new or redesigned screen must include empty, loading (`> 300ms` delay), and error states (`patterns/states.md`) plus pressed, pointer-only hover, visible focus ring, and disabled states (`foundations/09-interaction-states.md`).
4. **Never silence the linter casually:** Do not add `cf-ignore` to hide a real violation. Only justified exceptions (e.g., fixed macOS traffic-light colors) may use `cf-ignore`, and every exception must appear in the Compliance Report under `Deviations`.
5. **Never claim done without running gates & printing the Compliance Report:** Run all applicable Quality Gates (Section 3), fix every failure, and print the exact Compliance Report from `SKILL.md` Section 7 with honest `PASS` / `FAIL` / `NOT RUN (<reason>)` lines.
6. **Prompting formula for best output (for users):** Name (a) the **scenario** (new screen vs redesign vs audit), (b) the **target style** (`ios` | `macos` | `adaptive`), (c) the **primary user action** (single prominent CTA), and (d) the **exact screen/path** — e.g.:
   - Greenfield: `"/apple-screen Settings screen (ios): account header, notifications, appearance, sign out; single primary action none (instant toggles)"`
   - Redesign: `"/apple-redesign src/app/dashboard macos — replace top navbar + shadowed card grid with MacWindow sidebar, unified toolbar, and clean detail view"`

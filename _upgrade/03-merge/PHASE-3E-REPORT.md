# Phase 3e Report — Canonical Master Use-Flow & Plugin Readiness Audit

> **Date:** 2026-11-26
> **Workspace:** `D:\Claude-Plugins\cupertino-forge`
> **Branch:** `main` (direct commit on `main`; no feature branch created)
> **Scope:** Phase 3e only (no Phase 4 version bump, zip packaging, or `MERGE-REPORT`).

---

## 1. Readiness & Handoff Gap Audit Results

Audited all files in `commands/` (7 files), `skills/apple-design-core/SKILL.md`, `agents/` (2 files), `templates/` (3 files), `hooks/hooks.json`, and `scripts/verify-plugin.mjs`:

| # | Gap Found | Severity | Resolution in Phase 3e |
|---|---|---|---|
| 1 | **No single canonical end-to-end execution flow** uniting all 7 commands across Greenfield, Brownfield Redesign, Single Screen/Component, and Token Sync/Audit scenarios | High | Created `skills/apple-design-core/references/workflows/use-flow.md` (127 lines) and wired it as Step 0 + top router entry in `SKILL.md`, `CLAUDE.apple.md`, `AGENTS.apple.md`, `README.md`, `GUIDE.md`, and `verify-plugin.mjs`. |
| 2 | **`commands/apple-init.md` step 9 handoff was greenfield-only** (suggested only `/apple-screen`, omitting `/apple-redesign` for existing projects) | Medium | Updated `commands/apple-init.md` line 20 to reference `workflows/use-flow.md` with both `/apple-screen` (greenfield) and `/apple-redesign` (brownfield). |
| 3 | **Claude Code vs. Google Antigravity hook parity gap:** `hooks/hooks.json` runs `SessionStart`, `UserPromptSubmit`, `PostToolUse`, and `Stop` automatically in Claude Code, whereas Antigravity requires manual terminal enforcement | Medium | Added explicit side-by-side Execution Mapping (Section 4) and Blocking Quality Gates (Section 3) in `workflows/use-flow.md` and pointed `templates/AGENTS.apple.md` directly to `use-flow.md` at session start. |
| 4 | **`commands/apple-screen.md` & `commands/apple-component.md` did not explicitly name runtime QA (`computed-style-audit.mjs`, `ux-keyboard.mjs`) or `NOT RUN` rules** | Low | Centralized all 7 blocking Quality Gates (`G1`–`G7`) and the `NOT RUN (<reason>)` rule in `workflows/use-flow.md`, inherited by all commands via `SKILL.md` Step 0 (avoids duplicating rules across 7 command files). |
| 5 | **Minor doc drift noted for Phase 4 cleanup:** `commands/apple-sync.md` step 5 omits `--write-estimates tokens/ESTIMATES.md` and `agents/apple-spec-researcher.md` line 19 references `$source` estimate instead of `$class: "estimated"` | Low (noted) | Documented the exact `--write-estimates` command in `workflows/use-flow.md` Scenario D; logged for Phase 4 final sync without bloating Phase 3e scope. |

- **Missing Files Verdict:** Besides `skills/apple-design-core/references/workflows/use-flow.md`, **no other Skill, Agent, Command, or Template is missing**. Existing architecture (5 skills, 7 commands, 2 agents, 3 templates, 9 token JSONs, 7 scripts/QA tools) is complete and ready for Phase 4.

---

## 2. Created & Modified Files

| File Path | Action | Line Count | Summary |
|---|---|---|---|
| `skills/apple-design-core/references/workflows/use-flow.md` | Created | 127 | Canonical 5-section Master Use-Flow: Entry Decision Tree (Scenarios A–D), Serial Execution Flows, Blocking Quality Gates (`G1`–`G7`) + `NOT RUN` rule, Claude Code vs. Google Antigravity Mapping, Best-Output Prompting & Anti-Shortcut Rules |
| `skills/apple-design-core/SKILL.md` | Modified | 154 | Added Step 0 (`references/workflows/use-flow.md`) in Section 0 contract and top row in Section 2 router table |
| `templates/CLAUDE.apple.md` | Modified | 10 | Updated rule entrypoint to load `workflows/use-flow.md` first and aligned cross-platform parity wording |
| `templates/AGENTS.apple.md` | Modified | 57 | Added mandatory session-start pointer to `<PLUGIN_PATH>/skills/apple-design-core/references/workflows/use-flow.md` |
| `commands/apple-init.md` | Modified | 20 | Updated step 9 handoff to route greenfield -> `/apple-screen` and brownfield -> `/apple-redesign` via `workflows/use-flow.md` |
| `README.md` | Modified | 70 | Added `Master Use-Flow (Claude Code & Google Antigravity)` overview and link |
| `GUIDE.md` | Modified | 658 | Added `workflows/use-flow.md` to folder map and Section 5.3 Canonical Master Use-Flow summary |
| `scripts/verify-plugin.mjs` | Modified | 221 | Added `skills/apple-design-core/references/workflows/use-flow.md` to `requiredFiles` (`22/22`) |
| `CHANGELOG.md` | Modified | 63 | Added Phase 3e entry |
| `_upgrade/03-merge/PHASE-3E-REPORT.md` | Created | — | This report |

---

## 3. Target vs Proof

| Target | Status | Exact Command & Observed Output Proof |
|---|---|---|
| Readiness & Handoff Gap Audit | **PASS** | Inspected all 7 `commands/*.md`, `SKILL.md`, 2 `agents/*.md`, 3 `templates/*`, `hooks/hooks.json`, and `scripts/verify-plugin.mjs`; documented 5 real gaps and verified 0 unnecessary skills/agents added. |
| Canonical Master Use-Flow (`workflows/use-flow.md`) | **PASS** | Created `skills/apple-design-core/references/workflows/use-flow.md` (127 lines) with all 5 required sections; verified present by `verify-plugin.mjs` (`core-runtime-files: 22/22 present`). |
| Entrypoint & Router Sync (`SKILL.md`, `CLAUDE.apple.md`, `AGENTS.apple.md`, `apple-init.md`, `README.md`, `GUIDE.md`) | **PASS** | All entrypoints reference `workflows/use-flow.md`; all `${CLAUDE_PLUGIN_ROOT}/...` paths verified by `verify-plugin.mjs` (`plugin-root-paths: 48 path references verified`). |
| Plugin Doctor (`scripts/verify-plugin.mjs`) | **PASS** | `node scripts/verify-plugin.mjs` -> `Summary: 12 PASS, 0 NOT RUN, 0 FAIL` (`core-runtime-files: 22/22 present`, `tokens-json-schema: 9 JSON files valid`, `plugin-root-paths: 48 path references verified`, `audio-assets: 9 WAV files`, `lint-hook-smoke: exit 0`, `build-tokens-smoke: CSS, Tailwind, TS, Dart generated`, Node/Playwright/Flutter/Cargo PASS). |
| Unit & Regression Tests | **PASS** | `node --test tests/*.test.mjs` -> `tests 15, pass 15, fail 0, skipped 0` (`duration_ms 8081.0509`). |
| Accent Contrast Check | **PASS** | `node scripts/contrast-check.mjs --accent "#0088FF"` -> `0 blocking contrast failure(s)` (3 expected small-text advisory warnings; all glyph/large `>=3:1` PASS). |
| Git Branch & Clean Working Tree | **PASS** | `git branch`: `* main` (base `6369578`); committed directly on `main` as `feat: add canonical master use-flow and sync IDE entrypoints (Phase 3e)`. |

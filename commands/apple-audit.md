---
description: Audit existing UI against the Apple iOS 27 / macOS 27 design system and produce a two-part scored fix list
argument-hint: "[path or screen URL, default whole project] [--reference <dir>]"
---

# /apple-audit

Target: $ARGUMENTS (default: the whole project)

Load and follow [`skills/apple-design-audit/SKILL.md`](../skills/apple-design-audit/SKILL.md) (with `apple-design-core`), running:
1. Static lint: `node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --all --json` (or scoped to `$ARGUMENTS`)
2. Runtime DOM audit (when a URL/HTML target is available): `node "${CLAUDE_PLUGIN_ROOT}/qa/computed-style-audit.mjs" --url <target> --json`
3. Keyboard & UX audit (when a URL/HTML target is available): `node "${CLAUDE_PLUGIN_ROOT}/qa/ux-keyboard.mjs" --url <target> --browser all --theme both --json`
4. Visual pass & optional reference compare (`--reference <dir>`):
   - Capture screenshots into gitignored `qa/out/` via `python "${CLAUDE_PLUGIN_ROOT}/scripts/capture.py" --url <target> --out qa/out` (add `--matrix` for the 72-image accessibility/engine matrix).
   - If `--reference <dir>` is supplied and `<dir>` contains PNG/JPG images, run `apple-design-reviewer` in `visual` AI-compare mode against those images (no pixel-diff).
   - If `--reference` is omitted or `<dir>` has no images, report `Fidelity: N/A (no reference)` with zero fidelity claims.

Write `apple-audit-report.md` at the project root with separate **Rule-Conformance** (`0–100`) and **Fidelity** (`0–100` only when `--reference <dir>` has images, otherwise `N/A (no reference)`), tagging estimate-backed remarks `estimate-based` and marking any unexecuted check `NOT RUN (<reason>)`. Ask before applying fixes.

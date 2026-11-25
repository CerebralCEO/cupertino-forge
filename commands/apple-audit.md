---
description: Audit existing UI against the Apple iOS 27 / macOS 27 design system and produce a two-part scored fix list
argument-hint: "[path or screen URL, default whole project] (Note: --reference Fidelity diff arrives in a future update)"
---

# /apple-audit

Target: $ARGUMENTS (default: the whole project)

Load and follow [`skills/apple-design-audit/SKILL.md`](../skills/apple-design-audit/SKILL.md) (with `apple-design-core`), running both:
1. Static lint: `node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --all --json` (or scoped to `$ARGUMENTS`)
2. Runtime DOM audit (when a URL/HTML target is available): `node "${CLAUDE_PLUGIN_ROOT}/qa/computed-style-audit.mjs" --url <target> --json`

Write `apple-audit-report.md` at the project root with separate **Rule-Conformance** (`0–100`) and **Fidelity** (`N/A (no reference)` unless a reference image is provided) scores, marking any unexecuted check `NOT RUN (<reason>)`. Ask before applying fixes.

---
description: Audit existing UI against the Apple iOS 27 / macOS 27 design system and produce a scored fix list
argument-hint: "[path or screen URL, default whole project]"
---

# /apple-audit

Target: $ARGUMENTS (default: the whole project)

1. Load `apple-design-audit` and `apple-design-core`.
2. Static pass: `node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all --json` (or on the given path). Group findings by rule.
3. Structural pass: read the screens and check navigation pattern, hierarchy, glass placement, concentric shapes, states coverage, copy rules, accessibility (see the audit scorecard).
4. Visual pass (when the app can run): start it, then launch the `apple-design-reviewer` agent for each main screen in light and dark. If unrunnable, record visual layers as `NOT RUN (<reason>)` (never `OK`).
5. Write `apple-audit-report.md` at the project root using the scorecard format: score per layer (0 to 10), total, top 10 fixes ordered by visual impact, and the exact token or primitive to use for each fix.
6. Ask whether to apply the fixes. If yes, fix in order of impact, rerun lint, and print the Compliance report.

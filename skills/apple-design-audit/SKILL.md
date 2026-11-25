---
name: apple-design-audit
description: Audit any existing UI (web, Flutter, Tauri) against the Apple iOS 27 and macOS 27 design system and produce a two-part scored report (Rule-Conformance + Fidelity) with exact fixes. Use for /apple-audit, or when the user asks why their app does not look like Apple, or says ডিজাইন অডিট কর, অ্যাপলের মতো লাগতেছে না কেন.
---

# Apple Design Audit

Load `apple-design-core` first; the golden rules and token tables are the audit criteria. Consult `references/visual-qa.md`, `references/ux-qa.md`, and `references/scorecard.md` for exact thresholds.

## Procedure

1. **Static lint scan:**
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --all --json
   ```
   Group findings by rule (`error` vs `warn`).
2. **Deterministic DOM / Computed-Style audit (when a web build/URL is running or static HTML exists):**
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/qa/computed-style-audit.mjs" --url <url-or-file> --platform <ios|macos> --json
   ```
   If `playwright` is unavailable in `qa/node_modules` or no running URL exists, mark DOM checks `NOT RUN (<reason>)` — **never** report `OK` for unrun checks. Tag any check backed by `$class: "estimated"` tokens (`spacing-grid`, `glass-budget`, `easing`) as `estimate-based`.
3. **Structure read:** open the main screens. Check navigation pattern, primary CTA count (`<= 1` prominent CTA), layer separation, dark elevated backgrounds, concentric geometry, and empty/loading/error states.
4. **Visual pass & Reference Fidelity (optional):** if the app runs and visual screenshots are needed, capture via `python "${CLAUDE_PLUGIN_ROOT}/scripts/capture.py" --url <url>` (use `python3` on macOS/Linux if needed). Score **Part B (Fidelity)** only when a reference screenshot is explicitly supplied (`--reference`, Phase 3b); otherwise report `Fidelity: N/A (no reference)`. If runtime capture cannot execute, mark visual checks as `NOT RUN (<reason>)` — never report unrun checks as `OK`.
5. **Score** using the two-part `references/scorecard.md`.
6. **Write `apple-audit-report.md`** at the project root using the format below, then ask before applying fixes.

## Report format

```markdown
# Apple Design Audit: <app> (<date>, style <ios|macos>)
Rule-Conformance: <0-100> | Verdict: <Apple grade | Close | Apple-ish | Not Apple>
Fidelity: <0-100 or N/A (no reference)>

| # | Layer | Score /10 | Basis | Main issue |
|---|---|---|---|---|
...15 layers from references/scorecard.md (mark unrun layers NOT RUN (<reason>))...

## Computed-Style Audit Summary
<check: PASS | FAIL | NOT RUN (<reason>) [official|measured|estimate-based]>

## Top 10 fixes (by visual impact)
1. <issue> in <file:line or selector> -> <exact token or primitive to use>

## Lint summary
<rule: count>

## Missing states
<screen: empty|loading|error missing>
```

Verdicts (Part A): `90+ Apple grade`, `75–89 Close`, `50–74 Apple-ish`, `< 50 Not Apple`.

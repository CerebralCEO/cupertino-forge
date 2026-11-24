---
name: apple-design-audit
description: Audit any existing UI (web, Flutter, Tauri) against the Apple iOS 27 and macOS 27 design system and produce a scored report with exact fixes. Use for /apple-audit, or when the user asks why their app does not look like Apple, or says ডিজাইন অডিট কর, অ্যাপলের মতো লাগতেছে না কেন.
---

# Apple Design Audit

Load `apple-design-core` first; the golden rules are the audit criteria.

## Procedure

1. **Static scan:** `node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all --json`. Count findings per rule.
2. **Structure read:** open the main screens. For each, note navigation pattern, primary action count, layer separation, background levels, states coverage.
3. **Visual pass:** if the app runs, capture with `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/capture.py --url <url>` and run the `apple-design-reviewer` agent per screen.
4. **Score** with `references/scorecard.md`.
5. **Write `apple-audit-report.md`** at the project root (format below) and ask before applying fixes.

## Report format

```
# Apple Design Audit: <app>  (<date>, style <ios|macos>)
Total: <0-100>   Verdict: <Apple grade | Close | Apple-ish | Not Apple>

| Layer | Score /10 | Main issue |
|---|---|---|
...15 layers from the scorecard...

## Top 10 fixes (by visual impact)
1. <issue> in <file:line or screen> → <token or primitive to use>

## Lint summary
<rule: count>

## Missing states
<screen: empty|loading|error missing>
```

Verdicts: 90+ Apple grade, 75 to 89 Close, 50 to 74 Apple-ish, under 50 Not Apple.

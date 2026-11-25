---
description: Build a complete screen in Apple iOS 27 or macOS 27 style using the project's tokens and primitives
argument-hint: "<what the screen does>"
---

# /apple-screen

Build this screen: $ARGUMENTS

1. Load `apple-design-core` and the adapter skill named by `.apple-design.json`. If the config is missing, run the /apple-init flow first.
2. Pick the closest recipe in `references/patterns/screens.md` and state it in one line ("Pattern: list to detail, insetGrouped").
3. Plan in a short outline before coding: navigation (bar, title, actions), content structure (sections, rows, cards), the single primary action, states (empty, loading, error), and which primitives you will use. No new primitives unless the catalog lacks one; if so, build it inside the primitives folder following the component template and tokens.
4. Implement using only tokens and primitives. Text styles for every text node, semantic colors only, squircle and concentric shapes, springs for motion, haptics per feedback.json.
5. Add the empty, loading and error states from `patterns/states.md`.
6. Run the blocking Quality Gates from `references/workflows/use-flow.md`: static lint (`node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --all`), platform typecheck/analyzer, and when a URL is available `node "${CLAUDE_PLUGIN_ROOT}/qa/computed-style-audit.mjs"` + `node "${CLAUDE_PLUGIN_ROOT}/qa/ux-keyboard.mjs"`.
7. If a dev server can run, launch the `apple-design-reviewer` agent (`visual` + `behavior` modes) on the screen; mark any unavailable gate `NOT RUN (<reason>)`.
8. Print the Apple Design Compliance report (`apple-design-core` section 7).

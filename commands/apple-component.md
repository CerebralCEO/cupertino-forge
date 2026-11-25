---
description: Build or restyle one UI component to Apple spec (all states, tokens, motion, haptics, accessibility)
argument-hint: "<component name and purpose>"
---

# /apple-component

Component: $ARGUMENTS

1. Load `apple-design-core` and the platform adapter skill.
2. If a primitive already exists in the catalog, use or extend it instead of creating a new one.
3. Find the spec in `references/components-ios/*.md` or `references/components-macos/*.md` and copy its structure: Anatomy, Metrics, States, Motion, Feedback, Accessibility, Do and Don't.
4. Implement every state from `foundations/09-interaction-states.md`: pressed (instant), hover (pointer only), focus ring (keyboard only), disabled, selected, loading where relevant.
5. Values only from tokens. Motion only springs. Haptic per `tokens/feedback.json`.
6. Accessibility: role, label, keyboard behavior, 44 or 28 hit target.
7. Follow the Quality Gates in `references/workflows/use-flow.md`: run `node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --all`, platform typecheck/analyzer, and runtime QA (`computed-style-audit.mjs` / `ux-keyboard.mjs`) when mounted; mark unexecuted checks `NOT RUN (<reason>)`, show a usage example, and print the Compliance report.

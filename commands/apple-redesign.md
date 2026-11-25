---
description: Convert an existing Web, Flutter, or Tauri project or screen to Apple iOS 27 / macOS 27 style using the Redesign Playbook
argument-hint: "[path, screen, or 'whole project'] [ios|macos|adaptive]"
---

# /apple-redesign

Target: $ARGUMENTS (default: the active screen or project UI)

Follow these steps in order:

1. **Zero-config bootstrap & stack detection:** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/setup-project.mjs" --target . --mode redesign` (safe: skips existing files unless `--force` is passed). Confirm `.apple-design.json`, tokens, and starter adapter primitives exist before modifying screens.
2. **Load core references & adapter:**
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/apple-design-core/SKILL.md`
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/apple-design-core/references/patterns/redesign-playbook.md`
   - Read `${CLAUDE_PLUGIN_ROOT}/skills/apple-design-core/references/anti-patterns.md`
   - Load the matching platform adapter skill (`apple-web`, `apple-flutter`, or `apple-tauri` + `apple-web`).
3. **Deconstruct & plan (before editing):** Audit the existing target screen(s) against Section 1 (Deconstruction & IA Audit) and Section 3 (Pattern Translation Matrix) of `redesign-playbook.md`. List the exact legacy patterns being removed (card-in-card nesting, decorative borders, CTA clutter, hamburger drawers, non-spring motion) and their Apple 27 replacements.
4. **Convert screen-by-screen** following Section 5 (Platform-Specific Conversion Order):
   - Tokens & Theme -> Layout & IA -> Liquid Glass & Shape -> Motion, Haptics, States (`patterns/states.md`) & Accessibility.
   - Use only generated tokens and adapter primitives; never hand-type hex colors, px radii, shadows, font sizes, or `ease`/`linear` motion curves.
5. **Verify:**
   - Static lint: `node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs" --all --root .`
   - Platform build/analyzer: `tsc --noEmit` / `npm run build` (Web), `flutter analyze` + `flutter test` (Flutter), or `cargo check` (Tauri).
   - Runtime QA (when a web/Tauri URL is running):
     - `node "${CLAUDE_PLUGIN_ROOT}/qa/computed-style-audit.mjs" --url <target> --platform <ios|macos> --json`
     - `node "${CLAUDE_PLUGIN_ROOT}/qa/ux-keyboard.mjs" --url <target> --browser all --theme both --json`
   - Visual/behavior audit: run `apple-design-audit` or `apple-design-reviewer` (mark any unrun check `NOT RUN (<reason>)`).
6. **Report:** Print the **Apple Design Compliance** report (`apple-design-core` section 7), listing all touched screens, any `NOT RUN` checks, and any estimate-backed tokens used.

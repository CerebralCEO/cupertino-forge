---
description: Update cupertino-forge tokens to the latest Apple UI kits (after WWDC or a kit update) and rebuild generated files
argument-hint: "[optional notes]"
---

# /apple-sync

1. Launch the `apple-spec-researcher` agent. It finds the current iOS and macOS UI kit links on developer.apple.com/design/resources, exports design tokens from the Sketch kits (Export Design Tokens: Color Variables, Layer Styles, Text Styles, DTCG format), reads HIG pages for changed values, and returns a diff against `${CLAUDE_PLUGIN_ROOT}/tokens/*.json`.
2. Show the diff grouped by file and ask for confirmation.
3. Apply the changes to tokens (keep `$class`/`$source`/`$previous` tags; replace `$class: "estimated"` with `"measured"` where verified).
4. Update `skills/apple-design-core/references/foundations/15-version-diff.md` with date, source, and the list of changes.
5. In the current project, rebuild generated files AND regenerate `tokens/ESTIMATES.md`: `node "${CLAUDE_PLUGIN_ROOT}/scripts/build-tokens.mjs" --out <same paths as setup> --write-estimates "${CLAUDE_PLUGIN_ROOT}/tokens/ESTIMATES.md"`.
6. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/verify-plugin.mjs"`, lint, contrast check, and platform typecheck/tests. Report what changed visually.

---
description: Verify cupertino-forge plugin runtime, ${CLAUDE_PLUGIN_ROOT} paths, token JSONs, hooks, and optional harness/QA toolchains
argument-hint: "[--json]"
---

# /apple-doctor

Run the cross-platform plugin verification script:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/verify-plugin.mjs" $ARGUMENTS
```

This also probes harness & QA tools (`node`, `playwright`, `flutter`, `cargo`) and reports missing optional tools as `NOT RUN (<reason>)` rather than `FAIL`. Report the exact status (`PASS`, `FAIL`, or `NOT RUN (<reason>)`) for every check. Never report a `NOT RUN` check as `OK`.

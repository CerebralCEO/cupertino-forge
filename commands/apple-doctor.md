---
description: Verify cupertino-forge plugin runtime, ${CLAUDE_PLUGIN_ROOT} paths, token JSONs, hooks, and optional browser capture dependencies
argument-hint: "[--json]"
---

# /apple-doctor

Run the cross-platform plugin verification script:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/verify-plugin.mjs" $ARGUMENTS
```

Report the exact status (`PASS`, `FAIL`, or `NOT RUN (<reason>)`) for every check. Never report a `NOT RUN` check as `OK`.

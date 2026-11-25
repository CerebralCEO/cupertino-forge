# HealthKit Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `healthkit.iconClearSpace` | `>= 1/10` of Apple Health icon height | ratio | iOS, iPadOS (`version: unknown`) | Both | https://developer.apple.com/design/human-interface-guidelines/healthkit | Official | high | Never composite Apple Health icon onto another graphic |
| `healthkit.iconIntegrity` | Never mask, re-round, make circular, recolor, add borders/gradients/overlays to Apple Health icon | policy | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/healthkit | Official | high | Use official unmodified artwork only |
| `healthkit.activityRingMargin` | Outer margin `>=` distance between Activity rings | geometry | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/healthkit | Official | high | Never crop, obstruct, or encroach on Activity rings |
| `healthkit.permissionTiming` | Request HealthKit data access in context with clear purpose strings, not upfront at launch | policy | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/healthkit | Official | high | Respect granular read/write denial gracefully |

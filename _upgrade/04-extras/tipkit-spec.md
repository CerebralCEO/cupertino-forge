# TipKit & Offering Help Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `tipkit.styles` | `inline` (`TipView`, first choice) vs `popover` (`.popoverTip`, preserves layout) | enum | iOS, iPadOS, macOS (17–27) | Both | https://developer.apple.com/design/human-interface-guidelines/offering-help | Official | high | Prefer inline when surrounding UI must stay unobstructed; popover when shifting layout is undesirable |
| `tipkit.eligibilityRules` | Use parameter/event rules so tips never show to users who already used the feature | policy | iOS, iPadOS, macOS (17–27) | Both | https://developer.apple.com/design/human-interface-guidelines/offering-help | Official | high | Programmatically invalidate once action is performed |
| `tipkit.actionButtons` | Optional brief action buttons to open settings or feature area | policy | iOS, iPadOS, macOS (17–27) | Both | https://developer.apple.com/design/human-interface-guidelines/offering-help | Official | high | Always keep dismissal clear |
| `tooltip.maxLength` | `60–75` | characters | macOS (all–27) | Both | https://developer.apple.com/design/human-interface-guidelines/offering-help | Official | high | Sentence case; omit ending period on fragments; never repeat control's visible name |
| `tooltip.scope` | Describe only the hovered control, not nearby controls or full tasks | policy | macOS (all–27) | Both | https://developer.apple.com/design/human-interface-guidelines/offering-help | Official | high | Support state-sensitive tooltip copy where helpful |

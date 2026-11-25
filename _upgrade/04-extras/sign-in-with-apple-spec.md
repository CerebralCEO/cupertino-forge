# Sign in with Apple Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `siwa.minSize` | Width `>= 140` pt (`140px @1x`, `280px @2x`), Height `>= 30` pt (`30px @1x`, `60px @2x`) | pt / px | iOS, iPadOS, macOS, Web (`version: unknown` — last updated Sept 14, 2022) | Both | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Official | high | Account for localized title lengths |
| `siwa.minOuterMargin` | `>= 1/10` of button height | ratio | iOS, iPadOS, macOS, Web | Both | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Official | high | Applies to both full-title and 1:1 logo-only buttons |
| `siwa.titleRightMargin` | `>= 8%` of button width | ratio | All | Both | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Official | high | Minimum space between title and right button edge |
| `siwa.allowedTitles` | `"Sign in with Apple"`, `"Sign up with Apple"`, `"Continue with Apple"` | enum (exact) | All | Both | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Official | high | Never invent alternative phrasing; prefer system font |
| `siwa.logoOnlyRule` | `1:1` aspect ratio; never add extra horizontal padding; use SVG/PDF for arbitrary sizes | policy | All | Both | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Official | high | Corner radius may match sibling buttons in UI |
| `siwa.brandConstrained` | Use Apple-provided API or official downloadable artwork only | policy | All | Both | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | Official | high | See `brand-constrained-rules.md` — never recreate Apple logo |

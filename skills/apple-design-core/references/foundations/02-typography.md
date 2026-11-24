# 02 Typography

Source of truth: `tokens/typography.json` (HIG Dynamic Type tables, HIG tracking tables, iOS 27 and macOS 27 kit text styles).

## Styles (iOS Large default size)

| Style | Size | Line | Weight | Emphasized | Tracking (em) |
|---|---|---|---|---|---|
| largeTitle | 34 | 41 | 400 | 700 | +0.012 |
| title1 | 28 | 34 | 400 | 700 | +0.014 |
| title2 | 22 | 28 | 400 | 700 | -0.012 |
| title3 | 20 | 25 | 400 | 600 | -0.023 |
| headline | 17 | 22 | 600 | 600 | -0.026 |
| body | 17 | 22 | 400 | 600 | -0.026 |
| callout | 16 | 21 | 400 | 600 | -0.020 |
| subheadline | 15 | 20 | 400 | 600 | -0.016 |
| footnote | 13 | 18 | 400 | 600 | -0.006 |
| caption1 | 12 | 16 | 400 | 600 | 0 |
| caption2 | 11 | 13 | 400 | 600 | +0.006 |

## Styles (macOS)

| Style | Size | Line | Weight | Emphasized | Tracking (em) |
|---|---|---|---|---|---|
| largeTitle | 26 | 32 | 400 | 700 | +0.008 |
| title1 | 22 | 26 | 400 | 700 | -0.012 |
| title2 | 17 | 22 | 400 | 700 | -0.026 |
| title3 | 15 | 20 | 400 | 600 | -0.016 |
| headline | 13 | 16 | 700 | 800 | -0.006 |
| body | 13 | 16 | 400 | 600 | -0.006 |
| callout | 12 | 15 | 400 | 600 | 0 |
| subheadline | 11 | 14 | 400 | 600 | +0.006 |
| footnote | 10 | 13 | 400 | 600 | +0.012 |
| caption1 | 10 | 13 | 400 | 500 | +0.012 |
| caption2 | 10 | 13 | 500 | 600 | +0.012 |

Tight and loose leading variants exist for every style (tokens). Tight only inside single line controls; loose only for long reading text.

## Where each style goes

| Element | iOS | macOS |
|---|---|---|
| Screen title (scrolled to top) | largeTitle emphasized | window title: headline (system draws it) |
| Inline navigation title | headline | headline |
| Section header in grouped list | headline (sentence case) or footnote secondary uppercase is OLD, do not use | subheadline emphasized, label-2 |
| Row primary text | body | body |
| Row secondary text / value | body label-2 (trailing value) or subheadline label-2 (subtitle) | body label-2 |
| Section footer / helper | footnote label-2 | subheadline label-2 |
| Button label | body emphasized (medium, large), subheadline emphasized (small) | body (regular controls) |
| Tab bar label | caption2 emphasized | n/a |
| Badge | caption2 emphasized | caption1 emphasized |
| Card title | headline or title3 emphasized | title3 emphasized |
| Big number / stat | largeTitle or title1 emphasized, tabular | title1 emphasized, tabular |
| Timestamp | footnote label-2 or caption1 label-2 | callout label-2 |
| Alert title / message | headline / footnote | headline / body |
| Empty state title / message | title2 emphasized / body label-2 | title2 emphasized / body label-2 |

## Fonts

- Apple devices: system font (SF Pro). Web: `-apple-system, BlinkMacSystemFont, system-ui`. Flutter on iOS and macOS: leave fontFamily null in CupertinoTheme.
- Everywhere else: Inter variable font, plus the tracking from the table, plus `font-feature-settings: 'cv11','ss01','ss03'`, plus `trackingDeltaEm -0.01` to compensate Inter's width.
- Never bundle SF Pro font files (license: Apple platforms only). See 14-licensing-fallbacks.md.
- Rounded variant (ui-rounded) only for numerals in widgets, timers and playful contexts. Serif (New York or ui-serif) only for long reading.
- Monospace (ui-monospace) for code and fixed width data only.

## Rules

1. No size outside the table. If something feels like it needs 14 or 18, it is the wrong style.
2. Weight steps: regular for reading, semibold for emphasis, bold only for large titles. Never light, thin, ultralight under 20pt.
3. Never letter-space uppercase labels; avoid uppercase entirely except table column headers on macOS in small caps style (still use subheadline, not tracked caps).
4. Truncate with tail ellipsis in single line rows; let body text wrap. At AX sizes, stack trailing values under the title instead of truncating.
5. Text color comes from labels: label, label-2, label-3. Disabled text is label-3. Never gray-xxx.
6. Numbers that update use tabular figures. Currency and units use the locale formatter.
7. Bangla and other scripts: use the script font stack in tokens and raise line height by one step (use loose leading).

## Dynamic Type

- iOS sizes scale with the user setting from xSmall to AX5 (all tables in tokens). Web: set `--cf-type-scale`; Flutter: respect `MediaQuery.textScaler` (do not clamp below 1.0, clamp above 3.1).
- Layouts must reflow at large sizes: horizontal rows become vertical stacks, icons scale with text.
- macOS has no Dynamic Type.

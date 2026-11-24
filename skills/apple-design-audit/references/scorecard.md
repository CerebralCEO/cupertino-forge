# Audit scorecard (15 layers, 0 to 10 each, total scaled to 100)

| # | Layer | 10 means | Common deductions |
|---|---|---|---|
| 1 | Tokens | zero raw values outside generated files | each raw hex, px radius, shadow, easing: minus 1 |
| 2 | Navigation pattern | tab bar or sidebar, push stacks, sheets, native positions | hamburger minus 5, web navbar minus 4 |
| 3 | Hierarchy | one primary action, at most 3 type levels per group | two prominent buttons minus 3 |
| 4 | Typography | named styles, correct tracking and leading, system font on Apple | off scale sizes minus 1 each, light weights minus 2 |
| 5 | Color | semantic only, one accent, labels on glass monochrome | palette classes minus 1 each, #007AFF minus 2 |
| 6 | Dark mode | elevated surfaces, all tokens flip, images adapted | hardcoded light colors minus 2 each |
| 7 | Liquid Glass | functional layer only, no stacking, scroll edge effect | glass on cards minus 3, white glass borders minus 3 |
| 8 | Shape | squircle, concentric, capsules | circular corners minus 3, non concentric nesting minus 2 |
| 9 | Spacing and layout | 4 grid, correct margins, safe areas | off grid minus 1 each, edge collisions minus 2 |
| 10 | Elevation | shadows only on floating things, hairline edges | card shadows on iOS minus 3 |
| 11 | Iconography | SF metaphors, matched weight, one family | mixed families minus 3, emoji minus 3 |
| 12 | Interaction states | press instant, hover pointer only, focus ring, disabled | missing press minus 3, ripple minus 4 |
| 13 | Motion and feedback | springs, interruptible, reduced motion, right haptics | ease curves minus 2, haptic on every tap minus 2 |
| 14 | States | empty, loading (300ms delay), error per screen | each missing state minus 2 |
| 15 | Accessibility and copy | contrast, targets, labels, keyboard, Apple voice | each failing contrast minus 1, Yes/No alerts minus 2 |

Total = sum / 150 * 100, rounded.

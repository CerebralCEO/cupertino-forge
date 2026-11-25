# Audit Scorecard — Two-Part Model (Rule-Conformance + Fidelity)

Every `/apple-audit` report MUST keep **Part A (Rule-Conformance)** and **Part B (Fidelity)** strictly separate. Never combine reference-image visual similarity with deterministic rule conformance into a single blended number.

If any automated tool or check could not run (e.g., Playwright unavailable or no live URL), mark it `NOT RUN (<reason>)` and exclude it from the denominator — **never** report `10` or `OK` for unrun checks.

---

## Part A: Rule-Conformance (`0–100`)

Measured deterministically from static lint (`hooks/scripts/lint.mjs`), runtime DOM audit (`qa/computed-style-audit.mjs` against `cupertino.tokens.resolved.json`), and structural screen inspection across 15 layers (`0–10` per executed layer).

| # | Layer | 10 means | Deductions & Automated Signal | Token Basis |
|---|---|---|---|---|
| 1 | Tokens | Zero raw values outside generated files | Static lint (`raw-hex`, `tw-palette`, `css-radius`, `css-shadow`, `css-font-size`) + DOM `raw-color` (`-1` each) | `measured` |
| 2 | Navigation pattern | Tab bar or sidebar, push stacks, native positions | Hamburger (`lint: hamburger`, `-5`), web top navbar (`-4`), missing native bar (`-3`) | `official` |
| 3 | Hierarchy | One primary action, <=3 type levels per group | Multiple prominent CTAs (`-3`), flat contrast (`-2`) | `official` |
| 4 | Typography | On-scale named sizes, exact tracking, non-Latin `0`, no thin UI weights | DOM `font-size`, `letter-spacing`, lint `font-family`/`thin-weight` (`-1` off-scale, `-2` thin weight/broken tracking) | `measured` / `official` |
| 5 | Color | Semantic tokens, single accent, monochrome glass labels | Static `tw-palette`/`raw-color-fn` + DOM `raw-color` (`-1` each, `-2` `#007AFF`) | `measured` / `official` |
| 6 | Dark mode | Elevated surfaces, zero-FOUC theme init, adapted assets | Hardcoded light colors or missing `darkElevated` (`-2` each) | `measured` |
| 7 | Liquid Glass | Functional layer only, `<=6` simultaneous blurs, reduce-transparency fallback | Structural glass-on-cards (`-3`), white glass border (`-3`), DOM `glass-budget` (`-1`, **`estimate-based`**) | `official` + `estimate-based` |
| 8 | Shape | Squircle corners, concentric nesting, capsule buttons | Static `tw-rounded`/`css-radius` + DOM `border-radius` (`-2` non-token radius, `-2` non-concentric) | `official` / `measured` |
| 9 | Spacing & layout | 4pt spacing rhythm, safe margins, readable width | DOM `spacing-grid` (**`estimate-based`**, `-1` off-grid), edge collisions (`-2`) | `estimate-based` + `official` |
| 10 | Elevation | Shadows only on floating layers, hairline dividers | Static `tw-shadow`/`css-shadow`, card shadows on iOS (`-3`) | `measured` |
| 11 | Iconography | SF symbol metaphors, matched weight, one family | `emoji-icon` warning (`-3`), mixed icon families (`-3`) | `official` |
| 12 | Interaction states | Press instant, hover pointer-only, `:focus-visible` ring, disabled state | DOM `focus-ring` fail (`-3`), Material ripple (`-4`), missing press (`-3`) | `official` |
| 13 | Motion & feedback | Springs only (`linear(...)` / physics), interruptible, reduced-motion honored, intentional haptics | Static `easing` + DOM `easing` (**`estimate-based`**, `-2`), wrong haptics (`-2`) | `estimate-based` |
| 14 | States | Empty, loading (`300ms` delay), error coverage per view | Each missing state (`-2`) | `official` |
| 15 | Accessibility & copy | Contrast (`4.5:1` / `3:1`), hit targets (`44px`/`28px`), semantic roles, specific verbs | DOM `contrast` (`-2` fail), DOM `hit-target` (`-2` small target), vague Yes/No alerts (`-2`) | `official` |

**Part A Calculation:**
`Rule-Conformance Score = round((sum of executed layer scores / (10 * count of executed layers)) * 100)`
Verdicts: `90–100 Apple grade`, `75–89 Close`, `50–74 Apple-ish`, `< 50 Not Apple`.
Note explicitly in the report which deductions came from **`estimate-based`** rules (`spacing-grid`, `glass-budget`, `easing`).

---

## Part B: Fidelity (`0–100` or `N/A (no reference)`)

Evaluates perceptual and layout closeness **only when a reference screenshot or design mock is provided** (via `--reference`, introduced in Phase 3b):

- If **no reference image** is supplied: output **`Fidelity: N/A (no reference)`**.
- If **a reference image** is supplied: compare layout structure, SSIM (`>= 0.92`, `estimate-based`), and CIEDE2000 swatch color accuracy (`<= 2.0`, `official`). Keep Part B scores separate from Part A.

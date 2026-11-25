# Accessibility Trade-offs & Contrast Measurements

> Measurements taken in Chromium (`getComputedStyle` + WCAG 2.1 relative luminance compositing) using default Apple System Blue (`#0088FF` light). Nothing here alters Apple Sketch Kit official/measured tokens.

---

## 1. Tint Opacity Provenance (`tokens/materials.json`)

- **`liquidGlass.tuned.tinted.alpha` (`0.85` → `0.90`):** Source in `tokens/materials.json` is **`$class: "estimated"`** (`$source: "estimated"`, not an Apple Sketch kit measurement). Raised from `0.85` to `0.90` (`$note` added in `tokens/materials.json`) because `85%` `#0088FF` over `#FFFFFF` measured **`2.94:1`** (`< 3.0:1` Apple HIG bold/large minimum). At `90%` it reaches **`3.13:1`** while staying translucent (`< 0.95`).
- **`Button` `variant="tinted"` (`15%` → `12%` in `button.tsx`):** Estimated CSS `color-mix()` fill (not a kit token). Lowered from `15%` (`2.94:1` for `#0088FF` text on `#FFFFFF`) to `12%` (`3.05:1 >= 3.0:1`).
- **Official Apple Secondary Label (`labelIOS.secondary.light` = `#3C3C43@0.6`):** Measured directly from the Apple iOS 27 Sketch Kit (`$class: "measured"`). Over `#FFFFFF`, composited contrast is **`3.44:1`** (`< 4.5:1` WCAG AA normal text, raised to `#3C3C43@0.8` ≈ `5.8:1` in High Contrast mode). This token is **not** altered; `qa/computed-style-audit.mjs` reports it as a non-blocking **advisory** (shown in `scoreDisplay`, e.g., `100 (3 advisories)`) as long as contrast stays `>= 3.0:1`.
- **Official Apple macOS System Blue Selection / Default Button (`#FFFFFF` on `#0088FF`, 13pt regular):** Measured from the Apple macOS 27 Sketch Kit (`$class: "measured"`). Contrast is **`3.52:1`** (`>= 3.0:1` HIG large/bold/UI floor, below `4.5:1` WCAG AA 13pt normal text). Token is **not** altered; in `--platform macos`, `qa/computed-style-audit.mjs` reports it as a non-blocking **advisory** (shown in `scoreDisplay`, e.g., `100 (6 advisories)`).

---

## 2. `prominentGlass` (`#FFFFFF` bold label on tinted `#0088FF` glass) Across Backgrounds

Measured in headless Chromium (`color-mix(in srgb, #0088FF 90%, transparent)` vs previous `85%`, `15px` `weight: 600` bold — HIG bold/large threshold `>= 3.0:1`, regular small text threshold `>= 4.5:1`):

| Underlying Background | Hex | Composited RGB (`90%`) | Contrast (`90%`) | Contrast (`85%` prev.) | vs `>= 3.0:1` (Bold/Large) | vs `>= 4.5:1` (Small Regular) |
|---|---|---|---|---|---|---|
| White (Light canvas) | `#FFFFFF` | `rgb(25, 148, 255)` | **`3.13:1`** | `2.94:1` | PASS (`90%`) / FAIL (`85%`) | Below `4.5:1` |
| Black (Dark canvas) | `#000000` | `rgb(0, 122, 230)` | **`4.25:1`** | `4.69:1` | PASS | Below `4.5:1` (`90%`) / PASS (`85%`) |
| Dark Blue | `#0A2540` | `rgb(1, 126, 236)` | **`4.04:1`** | `4.33:1` | PASS | Below `4.5:1` |
| Bright Yellow | `#FFD600` | `rgb(25, 144, 230)` | **`3.41:1`** | `3.33:1` | PASS | Below `4.5:1` |

*Note: These values are documented strictly as measurements; no extra per-background overrides were added.*

# UX & Accessibility QA Measurement Guide

> Derived from `_upgrade/02-research/16-qa-measurement-method.md`.
> Checks interactive ergonomics, keyboard accessibility, Dynamic Type, and reduced-motion/transparency preferences.

---

## 1. Automated UX Gates (Rule-Conformance)

| Check | Requirement | Platform | Basis | Source |
|---|---|---|---|---|
| **Hit Target Size** | Touch interactive controls `>= 44×44px` (`ios`), desktop/pointer `>= 28×28px` (`macos`) with click floor `>= 20px`. | iOS / macOS / Web / Flutter | `official` | `tokens/layout.json` (`hitTarget`) |
| **Keyboard Focus Ring** | Interactive controls MUST retain a visible focus indicator when keyboard-focused (`:focus-visible`). `outline: none` without a replacement `box-shadow` focus ring fails. | Web / Desktop | `official` | `tokens/color.json` (`focusRing`) |
| **Non-Latin Typography Safety** | Indic/Arabic/Hebrew scripts (`:lang(bn)`, `:lang(ar)`, `:lang(he)`) must keep `letter-spacing: 0` to preserve glyph shaping/ligatures. | All | `official` | `tokens/typography.json` (`nonLatin`) |
| **Roving Focus & RTL Order** | TabBars and SegmentedControls use roving `tabIndex` (`0` on active, `-1` on others) with `ArrowLeft`/`ArrowRight`/`Home`/`End` matching visual RTL direction. | Web / Flutter | `official` | `08-motion.md` / `01-layout.md` |

---

## 2. Environment & Media Emulation Checks (`qa.playwright.emulateMedia`)

Always capture or test key accessibility media/environment states (`https://playwright.dev/docs/api/class-page#page-emulate-media`):

1. **Color Scheme:** `colorScheme: 'light'` vs `'dark'` (and `contrast: 'more'` where supported).
2. **Reduced Motion (`reducedMotion: 'reduce'`):**
   - Springs collapse to opacity crossfade/instant transition (`<= 200ms` duration, non-spatial `linear(0, 1)`), preserving state feedback (`keep state feedback`) without slide/scale travel.
3. **Reduced Transparency (`data-transparency="reduce"` / `CfApp.reduceTransparency`):**
   - Liquid Glass blurs turn off (`backdrop-filter: none`) and use solid `fallbackOpaque` surfaces (`#F6F6F6` light / `#262626` dark).
4. **Dynamic Type / Text Scaling (`200%` / `TextScaler.linear(2.0)` up to `3.1x` on iOS):**
   - No double scaling (`RenderParagraph` effective size must equal `tokenSize * scaleFactor`, e.g., `17 * 2.0 = 34.0pt`, never `68.0pt`).
   - Layouts reflow gracefully without clipping or horizontal overflow.
5. **Text Direction (`dir="rtl"`):**
   - Grouped list separators indent on `inset-inline-start`, back chevrons flip, and `TabBar`/`SegmentedControl` arrow navigation respects reading direction.

---

## 3. Structural UX Checks (Code Review + Reviewer)

Verify manually or via `apple-design-reviewer` alongside automated runs:

- **Navigation pattern:** Tab bar (iOS, floating pill capsule, minimized on scroll down) or edge-to-edge sidebar (macOS / iPadOS) — never hamburger drawers on desktop/iOS.
- **Primary action discipline:** At most ONE `prominentGlass` / `.accent` primary CTA per view/container.
- **State completeness:** Empty state (glyph + headline + single CTA), Loading (`>= 300ms` delay before showing `ActivityIndicator`), Error (inline cause + recovery).
- **Dialogs & Confirmation copy:** Specific verb labels (`Delete Note` / `Cancel`), never vague `Yes`/`No` or `OK` alone.

# Visual QA Measurement Guide (Deterministic & Reference Protocols)

> Derived from `_upgrade/02-research/16-qa-measurement-method.md`.
> Quantitative checks must separate **Official / Measured** HIG rules from **Estimate-based** heuristics (`tokens/ESTIMATES.md`), and never report an unrun check as `OK`.

---

## 1. Deterministic Computed-Style Checks (No Reference Image Needed)

Run via `node "${CLAUDE_PLUGIN_ROOT}/qa/computed-style-audit.mjs" --url <url> --platform <ios|macos>`.
Every threshold below is loaded dynamically from `cupertino.tokens.resolved.json` (`node scripts/build-tokens.mjs --targets json`).

| Check | Rule / Threshold | Token Basis | Source Path |
|---|---|---|---|
| **Font Size** | Every visible text element's computed `fontSize` must match a named type style in `typography.iosLarge` or `typography.macos` (`±0.5px`). | `measured` / `official` | `tokens/typography.json` |
| **Letter Spacing (Tracking)** | Must match the style's tracking value (`±0.25px`). For `:lang(bn)`, `:lang(ar)`, `:lang(he)`, `letter-spacing` MUST equal `0px`. | `measured` / `official` | `tokens/typography.json` |
| **Corner Radius & Shape** | Non-zero `borderRadius` must match `shape.radiusIOS` / `shape.radiusMacOS` tokens (`±1px`), capsule (`>= 999px` / pill `height/2`), or circle (`50%`). | `measured` / `official` | `tokens/shape.json` |
| **4pt Spacing Grid** | Visible element padding, margin, and gap align to `layout.spacing.scale` / `4px` base (`0px`, `1px`/`2px` hairline allowed). | **`estimate-based`** | `tokens/layout.json` |
| **Contrast Floor (HIG)** | Small text (`< 18pt` normal `< 600` weight): `>= 4.5:1`. Large text (`>= 18pt` OR bold `>= 600` weight) & non-text UI: `>= 3.0:1`. | `official` | `tokens/color.json` |
| **Raw Color / Token Match** | Computed text `color` and opaque `backgroundColor` must resolve to an entry in `cupertino.tokens.resolved.json` (system/label/fill/surface/accent/opaque fallback). | `measured` | `tokens/color.json` |
| **Glass Budget** | Count of simultaneously visible viewport elements with `backdrop-filter != none` must not exceed `materials.perfBudget.maxSimultaneousBackdrop` (`6`). | **`estimate-based`** | `tokens/materials.json` |
| **Timing Function (Motion)** | Active CSS transitions/animations must NOT use `ease`, `ease-in`, `ease-out`, `ease-in-out`, or bare `linear` (or their serialized `cubic-bezier(...)`). Sampled `linear(...)` springs are allowed. | **`estimate-based`** | `tokens/motion.json` |

---

## 2. Color & Visual Fidelity Metrics (Reference-Based — Phase 3b)

When a reference screenshot or design mock exists (deferred to Phase 3b `--reference` workflow):

- **CIEDE2000 Color Tolerance (`qa.contrast.ciede2000Noticeable`):** `ΔE00 <= 2.0` against kit color swatches (`[official]`).
- **Structural Regression (`qa.visual.ssimTarget`):** `SSIM >= 0.92` (`[estimated]`) across identical mock data/viewports, kept strictly in **Part B (Fidelity)** and never mixed into **Part A (Rule-Conformance)**.
- **Reduced Transparency State Check:** Verify `[data-transparency="reduce"]` renders `backdrop-filter: none` and opaque `fallbackOpaque` surfaces (`#F6F6F6` light / `#262626` dark) on Web and Flutter (`CfApp(reduceTransparency: true)`).
- **Drop Frame Telemetry Budget (`qa.perf.droppedFramesBudget`):** `<= 1%` frames over `16.6ms` (60Hz) or `8.3ms` (120Hz ProMotion) (`[official]`).

---

## 3. Native Platform Notes

- **WebKit (`backdrop-filter`):** Safari / WebKit requires literal `-webkit-backdrop-filter` rules inside `@supports (-webkit-hyphens: none)` (already emitted by `build-tokens.mjs`) because CSS custom properties inside `-webkit-backdrop-filter: var(...)` drop blur in WebKit.
- **Tauri WebDriver (`qa.tauri.webdriverStack`):** Native `tauri-driver` is unsupported on macOS WKWebView; use `@wdio/tauri-service` / `tauri-plugin-webdriver` (`[official]`) where available.
- **Flutter Golden Gate (`qa.flutter.goldenGate`):** Verify both `TextScaler.linear(1.0)` and `TextScaler.linear(2.0)` plus `TextDirection.rtl` (`matchesGoldenFile`).

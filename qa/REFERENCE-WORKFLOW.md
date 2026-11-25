# Reference Workflow (No Figma API)

> Apple Design Resources images and kit binaries are **never** committed to this repository (`qa/references/` and `_upgrade/04-extras/assets/` are gitignored). Only metadata, manifests, and audit reports are tracked in Git.

---

## 1. Current Manual Reference Status

- `qa/references/manual/ios27/`: **Not present** (`0` PNGs)
- `qa/references/manual/macos27/`: **Not present** (`0` PNGs)
- `qa/reference-map.json`: **`NOT RUN (manual reference PNG নেই)`** — generate this file once manual PNGs are placed in the folders below.

---

## 2. Adding Manual Kit Exports (`reference-class: design-kit-static`)

No Figma API calls are ever used. To add static kit references locally:

1. Open the official Apple Sketch / Figma Design Resources kit locally (iOS 27 / macOS 27).
2. Export component frames at `@2x` or `@3x` PNG into the gitignored directories:
   - `qa/references/manual/ios27/<component>-<variant>-<light|dark>.png`
   - `qa/references/manual/macos27/<component>-<variant>-<light|dark>.png`
   - Example names: `tab-bar-default-light.png`, `sheet-medium-dark.png`, `alert-destructive-light.png`, `sidebar-active-dark.png`, `toolbar-default-light.png`.
3. Tag every exported kit PNG with `"referenceClass": "design-kit-static"` (explicitly **not** a real-device render — Sketch/Figma static exports cannot simulate live Liquid Glass refraction or backdrop compositing).
4. Record the mapping in `qa/reference-map.json` linking each PNG to its `tests/harness/web` selector (or `"no-equivalent"` if the harness does not mount that component yet).

---

## 3. Adding Real-Device Screenshots (`reference-class: real-device`)

Real-device captures from an actual iPhone (iOS 27) or Mac (macOS 27) are the only valid ground truth for live Liquid Glass refraction, blur sigma, and system font rendering:

1. Capture clean screenshots on iOS (`Cmd+S` in Simulator or physical iPhone screenshot) or macOS (`Cmd+Shift+4`, Spacebar for window).
2. Save under gitignored `qa/references/device/<ios27|macos27>/<screen>-<light|dark>.png`.
3. Tag metadata with `"referenceClass": "real-device"`, device model, OS build version (or `"version": "unknown"` if unverified), scale factor (`@2x`/`@3x`), and Dynamic Type / Reduce Transparency state.

---

## 4. Glass-Dependent Components: Geometry + AI-Review, Not Pixel-Diff

For glass-dependent components (**`TabBar`, `Alert`, `Sheet`, `Menu`, `Toolbar`, `Sidebar`**), comparison MUST use **geometry checks (kit JSON / DOM metrics) + AI visual review (image)** rather than raw pixel-diff:

> Manually exported PNGs carry no node coordinates or layout tree metadata, so bounding-box alignment and text-wrap differences cause huge false pixel deltas; moreover, Liquid Glass appearance depends heavily on the dynamic background content behind the element, meaning two identical glass recipes over slightly different wallpapers or font renderers will fail raw pixel-diff even when visually faithful.

---

## 5. `/apple-audit --reference <dir>` & Why Pixel-Diff (`diff.mjs`) Is Intentionally Omitted

`/apple-audit --reference <dir>` uses **AI visual comparison** (via `agents/apple-design-reviewer.md` in `visual` mode):
1. Captures screenshots into gitignored `qa/out/` via `scripts/capture.py` (standard 4-image or `--matrix` 72-image capture).
2. If `<dir>` contains PNG/JPG reference images (plus optional `reference-map.json` metadata with `referenceClass`, `platform`, `theme`), compares our captures side-by-side against those references in `visual` mode and scores **Part B (Fidelity)** separately from **Part A (Rule-Conformance)**.
3. If `--reference` is omitted or `<dir>` has no images, outputs `Fidelity: N/A (no reference)` with zero fidelity claims.

### Why `qa/diff.mjs` (Pixel-Diff) Is Not Built Right Now
- **No reference images exist yet:** `qa/references/manual/` and `qa/references/device/` are empty, so a pixel-diff script would have no ground-truth inputs to validate against.
- **Component geometry tokens are still estimates:** 77 component geometry values (heights, padding, corner radii) remain `$class: "estimated"` in `tokens/` (see `tokens/ESTIMATES.md`). Running pixel-diff against unmeasured geometry plus dynamic Liquid Glass refraction produces noisy, low-value pixel deltas rather than actionable signal.
- Pixel-diff can be revisited only after real-device reference captures are available and geometry estimates are measured.

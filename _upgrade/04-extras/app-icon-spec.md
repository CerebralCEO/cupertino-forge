# App Icon Specification (HIG + Sketch Kit Check)

> Source: Apple HIG [App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) (DocC JSON, changelog updated Oct 28, 2026 & June 8, 2026). Rules and measurements only — no Apple artwork committed. `tokens/source/*` raw Sketch token JSON exports do not contain app icon grid geometry (`geometry not in export`).

## 1. Measurements & Rules Table

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `appIcon.canvasSize` | `1024 × 1024` | px (Square full-bleed) | iOS, iPadOS, macOS (26–27) | All 6 modes | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | System applies continuous rounded-rectangle (squircle) mask automatically; never pre-round corners |
| `appIcon.layerArchitecture` | Opaque full-bleed background + `1+` foreground layers (Icon Composer `.icon`) | layers | iOS, iPadOS, macOS (26–27) | All 6 modes | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | OS dynamically applies Liquid Glass specular highlights, refraction, blur, and inter-layer shadows |
| `appIcon.appearances` | `default`, `dark`, `clear light`, `clear dark`, `tinted light`, `tinted dark` | enum (6 variants) | iOS, iPadOS, macOS (26–27) | Both + Clear + Tinted | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Alternate icons on iOS/iPadOS MUST also supply dark, clear, and tinted variants |
| `appIcon.visualEffectsRule` | No baked drop shadows, specular highlights, or feathered edges | policy | iOS, iPadOS, macOS (26–27) | All | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | System renders dynamic lighting/shadows across layers |
| `appIcon.appleHardwareBan` | Never depict replicas of Apple hardware products | policy | All | All | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Apple hardware products are copyrighted |
| `appIcon.photoAvoidance` | Prefer bold simple illustrations over photos or UI component replicas | policy | All | All | https://developer.apple.com/design/human-interface-guidelines/app-icons | Official | high | Photos lose clarity at small sizes and across tinted/clear appearances |
| `appIcon.gridMaskRatio` | `~22.37%` of icon width (superellipse) | ratio | iOS / macOS (`version: unknown` for iOS 27 delta) | All | `tokens/shape.json` (`appIconMask`) | Inferred | med | Measured historically on exported masks; HIG DocC JSON does not publish exact numeric grid ratio |

## 2. Comparison with `_upgrade/02-research/12-icons-symbols-appicon.md`

- **Confirmed matches:** `1024 × 1024 px` canvas size, layered Icon Composer architecture, 6 appearances (`default`, `dark`, `clear light`, `clear dark`, `tinted light`, `tinted dark`), alternate-icon parity requirement, no pre-baked shadows/masks, and Apple hardware copyright ban all match `12-icons-symbols-appicon.md` cleanly.
- **New/clarified details:** HIG Oct 28, 2026 changelog explicitly adds *"guidance for app icon format options"* (non-layered vs Icon Composer layered), while watchOS (`1088×1088`) and tvOS/visionOS remain out-of-scope for `cupertino-forge`.
- **Unverified gap:** Exact numeric safe-zone grid lines (e.g., keyline circle/rect inset percentages) are distributed only inside Apple's downloadable `.sketch`/`.fig` App Icon templates, not in the HIG DocC JSON or Sketch token JSON exports.

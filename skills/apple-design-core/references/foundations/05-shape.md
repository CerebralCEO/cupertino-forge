# 05 Shape, corners, concentricity

Source of truth: `tokens/shape.json` (`ConcentricRectangle` formula `[official]`; `0.6` smoothing & borders `0.5px`/`1px` `[measured]`; 5 macOS kit radii `[measured-from-kit, device-unverified]`; remaining component radii `[estimate]`).

## Continuous corners (non negotiable)

Apple rounded rectangles use a continuous curvature corner (superellipse, approximately quintic `n ≈ 5` `[inferred]`), Figma equivalent corner smoothing **60 percent (`0.6`)** (`[measured]` across 178 nodes in Apple Figma iOS 27 & macOS 27 kits). A normal `border-radius` arc has a visible kink where the straight edge meets the curve.

- **Native vs Fallback Curve Policy:**
  - **Apple Native:** SwiftUI `ConcentricRectangle()` / `.rect(corners: .concentric(minimum: 4))` and UIKit `UICornerConfiguration` (`[official]`).
  - **Web:** `corner-shape: squircle` is supported in Chromium `139+`, Safari `18.4+`, Firefox `148+` (`[official]` CanIUse), matching `superellipse(2)` (`n=4`), while Safari/legacy fall back to `squircle()` SVG clip-path/mask (`apple-web/assets/lib/squircle.ts`). Keep `Squircle` wrapper for rects; capsules/circles use `9999px`.
  - **Flutter:** `ClipRSuperellipse` (`Flutter 3.32+`) or plugin `SquircleBorder(radius: R)` `[estimate]` (never `RoundedRectangleBorder`; `ContinuousRectangleBorder` has steeper corners).

## Shape vocabulary

| Shape | Use |
|---|---|
| Capsule (radius = height / 2) | All buttons with text, search fields, segmented controls, toggles, sliders, tab bar, toolbar groups, badges, tags, pills |
| Circle | Icon only buttons (close, more, back, add), avatars, page dots |
| Squircle rect | Cards, sheets, alerts, popovers, menus, list sections, images, thumbnails, windows, text fields on macOS |

## Concentric rule

Inner radius = outer radius minus the inset between them (minimum 4). Apply recursively.

Examples:
- Sheet radius 38, content padding 16 → inner card radius 22.
- Inset grouped section radius 26 with a full width image at 0 inset → the image takes the same 26 top corners.
- macOS window radius 16 (`[measured-from-kit, device-unverified]`), toolbar button 6 from the edge → button is capsule because its height (24) allows it; a square tool button would take 10 (`16 - 6`).
- A tab bar capsule 62 tall with the selected item inset 4 → inner capsule.

If the inner element is a capsule, concentricity is automatic.

## Radius table (iOS, `[measured-from-kit, device-unverified]` + `[estimate]`)

alert **34** `[measured-from-kit, device-unverified]`, action sheet **34** `[measured-from-kit, device-unverified]`, sheet floating **38** top / **58** bottom `[measured-from-kit, device-unverified]`, popover **38** `[measured-from-kit, device-unverified]` (`513:95247`), menu **34** `[measured-from-kit, device-unverified]` (`I5908:6372;10411:18670`), context menu preview **30** `[measured-from-kit, device-unverified]` (`548:48135`), text field **capsule** `[measured-from-kit, device-unverified]` (`5469:8386` `160×52 cr=26`); remaining `[estimate]`: inset grouped section 26, card 22, keyboard 26, small widget 22, small thumbnail 8, medium thumbnail 12, app icon mask 22.37 percent of size (`[inferred]` superellipse). Device display radius: primary token **55** (iPhone 17/17 Pro `[estimate]`) and **30** (iPad Pro `[estimate]`), used for full height sheets and full bleed cards that touch screen corners. Community `ScreenCorners` SPI measurements (`$alt` `[inferred/community]`) report **62pt** on iPhone 16 Pro/17 Pro and **18pt** on OLED iPad Pro M4/M5 — verify on physical device before changing primary tokens.

## Radius table (macOS, Figma `[measured-from-kit, device-unverified]` + `[estimate]`)

window **16** `[measured-from-kit, device-unverified]` (`585:3372`, `4363:18479`), sheet **16** `[measured-from-kit, device-unverified]` (`121:11423`), alert **34** `[measured-from-kit, device-unverified]` (`I494:3080;4311:12662`; corrected from Phase 3c container-only 10), popover **20** `[measured-from-kit, device-unverified]` (`I4336:13195;110:856`; corrected from Phase 3c container-only 10), menu **12** `[measured-from-kit, device-unverified]` (`4353:2522`), menu item highlight **8** `[measured-from-kit, device-unverified]` (`685:23692`), utility panel **15** `[measured-from-kit, device-unverified]` (`4374:54812`) — *visible kit surface measurements, not live OS measurements*; remaining `[estimate]`: tooltip 6, sidebar row selection 8 (Large 8 / Medium 5 in kit), table row selection 6, text field 6, popup button 6, checkbox 4, large push button 8, card 10.

## Borders and separators

- iOS: no borders around content. Separators are 0.5 hairlines, inset from the leading edge to where text starts (16, or 60 when rows have 29pt icons). No separator after the last row of a section.
- macOS: text fields and some controls have the kit hairline (field-border). Tables use separators between rows only when alternating backgrounds are off.
- Never 1px gray borders on cards, never double borders, never borders plus shadows on content.

## Images

- Media in lists: squircle with thumbnail radius. Full bleed hero images: no radius unless inside a card.
- Avatars: circle. App icons: superellipse mask with the 22.37 percent radius and squircle corner.

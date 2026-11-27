# iOS 27 Menu Geometry Extraction (`_upgrade/03-merge/IOS-MENU-GEOMETRY.md`)

> **Date:** 2026-11-27 | **Source:** ForgeKit v2.0 local export `ios27` (`_local/forgekit/ios27/apple-ui-kit-ios-and-ipados-27-iPadOS-27/components/{Menu,Menu-Items,Menu-Items-Submenus,_Menu-Indicator}/layout.json`)
> **Purpose:** Replaces estimated/guessed iOS menu padding and row highlight geometry to fix the `r=34` top/bottom corner-clipping issue observed in Phase 8B visual verification.

---

## 1. Extracted iOS 27 Menu Measurements (Node-by-Node)

| Layer / Property | Kit Component | Node ID | Measured Value (`1× pt`) | Notes |
|---|---|---|---|---|
| **Outer Menu Container** | `Menu` (`Mode=Dark`) | `5908:6481` | `238 × 578`, `padTop=10`, `padBottom=10`, `padLeft=0`, `padRight=0` | `layoutMode: VERTICAL` |
| **Visible Glass Surface** | `Menu` (`Fill + Shadow` & `Glass Effect`) | `I5908:6372;10411:18670`, `I5908:6372;10411:18671` | `238 × 578`, **`cr = 34`** (`cs = 0.6`, `clips=True`) | Outer visible glass radius |
| **Menu Items Slot** | `Menu` (`Menu Items`) | `5908:6377` | `238 × 502`, **`padLeft = 16`, `padRight = 16`** | Yields `206pt` inner row width (`238 - 32`) |
| **Control Group (Top Action Tiles)** | `Menu` (`Control Group`) | `5908:6373` / `5908:6374` (`I5908:6374;5712:39061 BG`) | `padLeft=10`, `padRight=10`, `gap=6`; Action tile `69 × 56`, **`cr = 20`** | Concentric inside `34 - 10 = 24` |
| **Menu Row (Single-Line)** | `Menu` (`Item`) / `Menu-Items` | `5908:6379`, `5908:6380` | `206 × 40` (**height `40pt`**), `padLeft=6` (`36` w/ selection col), `padRight=8`, `gap=6` | Leading symbol `28×20`, label `padTop=10, padBottom=10` |
| **Menu Row (With Subtitle)** | `Menu` (`Item`) | `5908:6381` | `206 × 60` (**height `60pt`**), `padLeft=6`, `padRight=8`, `gap=6` | 2-line label + subtitle |
| **Row Highlight / Open Submenu** | `Menu-Items-Submenus` (`Open=True`) | `5856:13992`, `5854:9645` | `190 × 40`, **`cr = 100` (capsule)** | Effective radius `20pt` (`40 / 2`) sits cleanly inside `10pt` vertical + `16pt` horizontal padding with **zero corner clipping** |
| **Separator** | `Menu` (`Separator`) | `5908:6378` / `I5908:6378;5855:5820` | Container `206 × 21` (**height `21pt`**, `pad=[10, 8, 10, 8]`), inner hairline `190 × 1` | Centered hairline with `10pt` vertical breathing room |
| **Menu Indicator** | `_Menu-Indicator` (`Dark` / `Light`) | `5831:53947`, `5831:53945` | `36 × 36`, **`cr = 100` (circle)** | Leading/trailing circular submenu indicator |

---

## 2. Concentricity Math (Why Phase 8B Clipped & How Kit Geometry Solves It)

- **Why Phase 8B clipped:** Phase 8B tested `cr = 34` with `pad = 5px` (macOS menu padding) and `item cr = 8px` → `34 - 5 = 29px >> 8px`, so the outer `34px` curve sliced right through the top-left/top-right corners of the first row.
- **How Apple's iOS 27 kit solves it:**
  - Outer glass radius = **`34pt`**
  - Outer padding = **`10pt` vertical (`5908:6481`) + `16pt` horizontal (`5908:6377`)**
  - Highlighted row shape = **`40pt` tall capsule (`cr = 100`, effective radius `20pt`, `5856:13992`)**
  - Horizontal concentric target: `34 - 16 = 18pt` vs `20pt` capsule; vertical concentric target: `34 - 10 = 24pt` vs `20pt` capsule → **smoothly nested with zero clipping!**

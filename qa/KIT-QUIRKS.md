# Apple Figma Kit Quirks & Known Divergences (`qa/KIT-QUIRKS.md`)

> **Date:** 2026-11-27 | **Purpose:** Documents confirmed discrepancies and authoring quirks inside Apple's iOS 27 & macOS 27 Figma UI Kits so future ForgeKit audits do **not** falsely flag them as plugin bugs.

---

## 1. iOS 27 Dynamic Type — 14 Divergences vs Official Apple HIG (HIG Wins)

Cross-validated `ios27/tokens/variables.json` (`Dynamic Type` collection) against Official Apple HIG Typography (`_upgrade/02-research/json/typography.json` & `tokens/typography.json`, 132 cells). **All 14 mismatches match Official HIG in `tokens/typography.json` — keep `tokens/typography.json` unchanged.**

| # | Text Style | Dynamic Type Mode | Official HIG / Ours `(size, lineHeight)` | Apple Figma Kit `(size, lineHeight)` | Quirk Type |
|---|---|---|---|---|---|
| 1 | `largeTitle` | `Small` | `(32, 39)` | `(32, 38)` | Kit leading `-1pt` |
| 2 | `title1` | `Small` | `(26, 32)` | `(26, 31)` | Kit leading `-1pt` |
| 3 | `title1` | `xLarge` | `(30, 37)` | `(30, 36)` | Kit leading `-1pt` |
| 4 | `title2` | `xSmall` | `(19, 24)` | `(19, 23)` | Kit leading `-1pt` |
| 5 | `title2` | `Small` | `(20, 25)` | `(20, 23)` | Kit leading `-2pt` |
| 6 | `title2` | `Medium` | `(21, 26)` | `(21, 28)` | Kit leading `+2pt` |
| 7 | **`title2`** | **`AX2`** | **`(39, 47)`** | **`(43, 51)`** | **Apple Figma kit bug** (duplicated `43/51`) |
| 8 | `title3` | `Small` | `(18, 23)` | `(18, 22)` | Kit leading `-1pt` |
| 9 | **`title3`** | **`AX4`** | **`(49, 58)`** | **`(43, 51)`** | **Apple Figma kit bug** (duplicated `43/51`) |
| 10 | `headline` | `Small` | `(15, 20)` | `(15, 19)` | Kit leading `-1pt` |
| 11 | `body` | `Small` | `(15, 20)` | `(15, 19)` | Kit leading `-1pt` |
| 12 | `callout` | `Small` | `(14, 19)` | `(14, 18)` | Kit leading `-1pt` |
| 13 | `callout` | `xxLarge` | `(20, 25)` | `(20, 24)` | Kit leading `-1pt` |
| 14 | `subheadline` | `Small` | `(13, 18)` | `(13, 16)` | Kit leading `-2pt` |

---

## 2. Apple Figma Kit vs Apple Sketch Kit Dark-Mode Alpha Conflicts (`needs-device-verification`)

| Token (`tokens/color.json`) | Sketch Kit (Primary) | Figma Kit (`ios27` `variables.json`, Default & IC modes) | Status |
|---|---|---|---|
| `labelIOS.secondary.dark` | `#EBEBF5@0.60` | `#EBEBF5@0.70` (`VariableID:13207:204`) | Recorded under `$kitConflict` (`needs-device-verification`) |
| `separatorIOS.nonOpaque.dark` | `#FFFFFF@0.12` | `#FFFFFF@0.17` (`VariableID:13207:239`) | Recorded under `$kitConflict` (`needs-device-verification`) |

---

## 3. Structural Kit Quirks (Do Not Treat as Token Values)

- **Invisible `container-only` outer frames:** macOS `Alert` (`121:11254`) and `Popover` (`4336:13305`) carry `cornerRadius=10` on invisible outer wrappers (`fills=[]`, `effects=[]`, `clipsContent=False`), while their visible surfaces inside have `cr=34` (`Alert Fill + Shadow`) and `cr=20` (`Popover Body`). Always apply the Visible-Surface Rule.
- **En-dash in iOS grouped background names:** Apple's Figma variables use en-dash `Backgrounds – Grouped/*` (not space `Backgrounds Grouped/*`).
- **Empty `Liquid Glass` variable collection:** `VariableCollectionId:5473:22573` (`Bright`/`Dim`) has `0` variables; actual Liquid Glass FLOAT variables live in `Kit` (`VariableCollectionId:5565:22724`).

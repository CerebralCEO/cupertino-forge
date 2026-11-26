# ForgeKit Intake & Cross-Validation Report (Phase 8A: A1 + A2)

> **Date:** 2026-11-27 | **Step:** Phase 8A (Read-only verification; zero token edits)

## 1. A1 — Intake Summary (`ios27` & `macos27`)

### Kit: `ios27` (`ios-and-ipados-27` / `iPadOS-27`)
- **Schema / Plugin:** `2.0.0` / `0.1.0` (exported `2026-11-26T17:09:17.815Z`)
- **File Counts:** `manifest.totalZipEntries` = **1848**, `directory-map.totalFiles` = **1845**, actual disk files = **1848**
- **JSON Parse Errors:** **0** | **Zero-Byte Files:** **0**
- **Components:** `manifest.components` = **334**, `components/` folders = **334**, `variants.json` = **334**, `layout.json` = **334**, `preview@2x.png` = **334**, `preview-dark@2x.png` = **334**
- **Skipped:** `[{'id': '12740:37613', 'name': 'Examples/Sidebar', 'reason': 'in get_visible: The node (instance sublayer or table cell) with id "I12740:35255;5572:23786;10473:45325;5569:7321" does not exist'}]`
- **Warnings:** **42** total, of which **`variantProperties fallback used`**: **28**

| `tokens/*.json` | Size (bytes) | Entries |
|---|---|---|
| `colors.json` | 37320 | 50 |
| `effects.json` | 175363 | 119 derived (0 styles) |
| `grids.json` | 2 | 0 |
| `motion.json` | 74 | 3 |
| `radius.json` | 6816 | 7 varTokens / 19 scale |
| `sizes.json` | 56038 | 28 varTokens / 141w+155h |
| `spacing.json` | 15822 | 30 varTokens / 35 scale |
| `typography.json` | 45347 | 34 |
| `variables.json` | 323707 | 414 vars / 8 cols |

<details><summary>variantProperties fallback used warnings (28)</summary>

- `Mode=Light, Item=App,Selected=False, Selected=: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget Small, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget Medium, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget Large, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget XL, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=App, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget Small, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget Large, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget Medium, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Item=Widget XL, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=App, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget Large, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget Small, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget Medium, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget XL, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget Large, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=App, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget Small, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget Medium, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, Item=Widget XL, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light,Disabled=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light,Disabled=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark,Disabled=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark,Disabled=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Selected=False: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, Selected=True: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark,Selected=False, Selected=: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark,Selected=True, Selected=: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`

</details>

### Kit: `macos27` (`macos-27` / `macOS-27`)
- **Schema / Plugin:** `2.0.0` / `0.1.0` (exported `2026-11-26T20:26:12.119Z`)
- **File Counts:** `manifest.totalZipEntries` = **1102**, `directory-map.totalFiles` = **1099**, actual disk files = **1102**
- **JSON Parse Errors:** **0** | **Zero-Byte Files:** **0**
- **Components:** `manifest.components` = **184**, `components/` folders = **184**, `variants.json` = **184**, `layout.json` = **184**, `preview@2x.png` = **184**, `preview-dark@2x.png` = **184**
- **Skipped:** `[]`
- **Warnings:** **101** total, of which **`variantProperties fallback used`**: **96**

| `tokens/*.json` | Size (bytes) | Entries |
|---|---|---|
| `colors.json` | 5966 | 10 |
| `effects.json` | 230827 | 154 derived (0 styles) |
| `grids.json` | 2 | 0 |
| `motion.json` | 74 | 3 |
| `radius.json` | 5128 | 6 varTokens / 12 scale |
| `sizes.json` | 37750 | 42 varTokens / 87w+87h |
| `spacing.json` | 6411 | 15 varTokens / 19 scale |
| `typography.json` | 17430 | 22 |
| `variables.json` | 106073 | 151 vars / 7 cols |

<details><summary>variantProperties fallback used warnings (96)</summary>

- `Mode=Dark, App Icon=Shortcuts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Xcode: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Weather: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Voice Memos: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Terminal: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=TextEdit: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Settings: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Stocks: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Siri: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Safari: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Reminders: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Quicktime Player: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Preview: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Podcasts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Podcasts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Photos: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Photo Booth: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Phone: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Passwords: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Pages: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Numbers: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Notes: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=News: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Music: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=iPhone Mirroring: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Games: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Messages: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Maps: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Mail: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Keynote: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Freeform: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Final Cut Pro: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Find My: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Finder: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=FaceTime: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Home: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Calculator: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Calendar: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Books: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Contacts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=App Store: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Apple TV: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Custom: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Folder: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Trash Full: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Trash Empty: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Dark, App Icon=Apps: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Shortcuts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Xcode: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Weather: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Voice Memos: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Voice Memos: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Terminal: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=TextEdit: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Settings: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Stocks: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Siri: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Safari: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Reminders: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Quicktime Player: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Preview: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Podcasts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Photos: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Photo Booth: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Phone: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Passwords: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Pages: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Pages: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Numbers: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Notes: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=News: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Music: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=iPhone Mirroring: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Games: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Messages: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Maps: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Mail: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Keynote: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Freeform: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Freeform: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Final Cut Pro: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Find My: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Finder: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=FaceTime: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Home: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Calculator: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Calendar: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Books: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Contacts: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=App Store: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Apple TV: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Custom: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Folder: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Trash Full: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Trash Empty: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`
- `Mode=Light, App Icon=Apps: variantProperties fallback used (in get_variantProperties: Component set for node has existing errors).`

</details>

## 2. A2 — Extractor Cross-Validation

### (a) Colors (`tokens/variables.json` vs `tokens/color.json`)
- **Compared:** 56 | **Matched (±1/255):** **48/56** (85.7%)
- **True Value Diffs:** 2 | **Name Mismatches:** 6

| Our Token | Our Value | ForgeKit Value / Status | Kind |
|---|---|---|---|
| `labelIOS.secondary.dark` | `#EBEBF5@0.6` | `rgba(235, 235, 245, 0.7) (Labels/Secondary)` | `value-diff` |
| `separatorIOS.nonOpaque.dark` | `#FFFFFF@0.12` | `rgba(255, 255, 255, 0.17) (Separators/Non-opaque)` | `value-diff` |
| `backgroundIOS.groupedPrimary.light` | `#F2F2F7` | `None` | `name-mismatch` |
| `backgroundIOS.groupedPrimary.dark` | `#000000` | `None` | `name-mismatch` |
| `backgroundIOS.groupedSecondary.light` | `#FFFFFF` | `None` | `name-mismatch` |
| `backgroundIOS.groupedSecondary.dark` | `#1C1C1E` | `None` | `name-mismatch` |
| `backgroundIOS.groupedTertiary.light` | `#F2F2F7` | `None` | `name-mismatch` |
| `backgroundIOS.groupedTertiary.dark` | `#2C2C2E` | `None` | `name-mismatch` |

### (b) Typography (`Dynamic Type` 132 cells vs `tokens/typography.json`)
- **Matched:** **118/132** (89.4%)

- Discrepancies (14): sample `[('largeTitle', 'Small', 'our=(32.0,39.0) vs fk=(32,38)'), ('title1', 'Small', 'our=(26.0,32.0) vs fk=(26,31)'), ('title1', 'xLarge', 'our=(30.0,37.0) vs fk=(30,36)'), ('title2', 'xSmall', 'our=(19.0,24.0) vs fk=(19,23)'), ('title2', 'Small', 'our=(20.0,25.0) vs fk=(20,23)')]`

### (c) Scale Sanity (1x pt)
| Check | Component | Node ID | Size | Gap |
|---|---|---|---|---|
| iOS Status Bar | `Status-Bar-iPhone` | `12961:29590` | `402x62` | `0` |
| iOS Home Indicator | `Home-Indicator` | `106:60032` | `402x34` | `0` |
| iOS Bezel/iPhone | `Examples-Home-Screen-Widgets` | `12740:23796` | `1210x834` | `None` |
| macOS Window Controls | `Window-Controls-Standard` | `4365:36385` | `68x14` | `9` |

### (d) ForgeKit Reliability Verdict
- **High reliability for 1x pt geometry, variables, Dynamic Type, and layer-derived effects:** 0 JSON parse errors, 0 zero-byte files, exact 1x pt coordinate scale, and high color/typography agreement with our Sketch-derived tokens.
- **Known caveats:** (1) `fileKey` is `None` in manifest; (2) `variantProperties fallback used` warnings require checking `layout.json` directly rather than relying solely on `variants.json` property keys; (3) `effectStyles: 0` because Apple Figma kits apply effects at the layer level (`derivedEffects` captures them); (4) `prototypeReactions: 0` (`motion.json` is empty/`missingFromFigma: true`); (5) some `preview@2x.png` files are clamped below 2x due to pixel/axis budget.

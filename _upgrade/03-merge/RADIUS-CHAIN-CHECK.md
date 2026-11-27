# Radius Chain Check — Round 2 (Visible-Surface Rule Applied)

> **Date:** 2026-11-27 | **Phase:** 8A-2 Task 1 (Read-only audit; **zero token edits**)
> **Visible Container Rule (`দৃশ্যমান পাত্র`):** A valid radius surface MUST satisfy ALL three criteria:
> (a) has visible `fills` OR `GLASS` / `BACKGROUND_BLUR` / `DROP_SHADOW` / `INNER_SHADOW` effect,
> (b) is the outermost such visible surface covering the component's main area (excluding dimming overlays or tiny arrows/knobs), and
> (c) `cornerRadius > 0` (or `rectangleCornerRadii` with values `> 0`).
> Any frame with `fills=[]`, `effects=[]`, `clipsContent=False` is **`container-only`** and MUST NOT be used as a token radius source.

---

## 1. macOS Components — Visible-Surface Audit (vs Current `shape.json` & Pre-Phase 3c)

| Component | Kit Folder | Component Node ID | Outer Frame (`cr`, fills, effects, clips) | Visible-Surface Node ID & `cr` (`cs`) | Current `shape.json` | Pre-3c Estimate | Verdict |
|---|---|---|---|---|---|---|---|
| **Window (BG)** | `Window-BG` | `585:3372` (`Light, Active=True`) | `cr=16`, `f=['SOLID']`, `e=['DROP_SHADOW']`, `clip=True` | `585:3372` (`cr=16`, `cs=0.6`) | `16` | `12` | **outer-visible-confirmed** (`16pt`) |
| **Window (Composed)** | `Windows-Composed` | `4363:18479` (`Expanded Toolbar+Sidebar`) | `cr=16`, `f=['SOLID']`, `e=['DROP_SHADOW']`, `clip=True` | `4363:18479` (`cr=16`, `cs=0.6`) | `16` | `12` | **outer-visible-confirmed** (`16pt`) |
| **Sheet** | `Sheet` | `121:11423` (`Mode=Light`) | `cr=16`, `f=['SOLID']`, `e=['DROP_SHADOW']`, `clip=True` | `121:11423` (`cr=16`, `cs=0.6`) | `16` | `12` | **outer-visible-confirmed** (`16pt`) |
| **Alert** | `Alert` | `121:11254` (`Type=Stacked`) | `cr=10`, `f=[]`, `e=[]`, `clip=False` (**container-only!**) | `I494:3080;4311:12662` `Fill + Shadow` & `Glass Effect` (**`cr=34`**, `cs=0.6`, `clip=True`, `GLASS` + shadows) | `10` | `16` | **REVERSED (Phase 3c wrong!)** — true visible radius is **`34pt`**, not `10pt` |
| **Popover** | `Popover` / `Popover-2` | `4336:13305` / `4336:13199` | `cr=10` (Dark) / `cr=0` (Light), `f=[]`, `e=[]`, `clip=False` (**container-only!**) | `I4336:13195;110:856` `Body` (**`cr=20`**, `BACKGROUND_BLUR` + shadows) | `10` | `16` | **REVERSED (Phase 3c wrong!)** — true visible radius is **`20pt`**, not `10pt` |
| **Menu** | `Menu` | `483:8811` | `cr=0`, `f=[]`, `e=[]`, `clip=False` (container-only) | Inner `Menu Background` (**`cr=12`**, `GLASS` + shadows) | `12` | `12` | **inner-visible-confirmed** (`12pt`) |
| **Menu Background** | `Menu-Background` | `4353:2522` | `cr=0`, `f=[]`, `e=[]`, `clip=False` (container-only) | `Fill + Shadow` / `Glass Effect` (**`cr=12`**) | `12` | `12` | **inner-visible-confirmed** (`12pt`) |
| **Menu Item Highlight** | `Menu-Items` | `685:23691` (`State=Hover`) | `cr=8`, `f=[]`, `e=[]`, `clip=False` | `685:23692` `BG` (`174×24`, **`cr=8`**, `f=['SOLID']`) | `8` | `6` | **visible-surface-confirmed** (`8pt` hover highlight) |
| **Dialogs** | `Examples-Dialog-Save-*` | *(Examples only)* | No standalone `Dialog` ComponentSet outside `Examples/*` | — | n/a | n/a | **not-standalone-in-kit** (Examples excluded per rules) |
| **Utility Panel** | `Utility-Panel` | `4374:54812` | `cr=15`, `f=['SOLID']`, `e=['DROP_SHADOW']`, `clip=True` | `4374:54812` (**`cr=15`**) | `12` (doc) | `12` (doc) | **outer-visible-confirmed** (`15pt`, new kit finding) |
| **Tooltips** | `Tooltip` | `0:2793` (`49×18`) | `cr=None`, `clip=True` | `4331:12203` `Materials` (`cr=None`, `BACKGROUND_BLUR`) | `6` | `6` | **no-cr-in-kit** (keep `6` estimated) |

---

## 2. iOS Components — Visible-Surface Audit (vs Current `shape.json` & Pre-Phase 3c)

| Component | Kit Folder | Component Node ID | Outer Frame (`cr`, fills, effects, clips) | Visible-Surface Node ID & `cr` (`cs`) | Current `shape.json` | Pre-3c Estimate | Verdict |
|---|---|---|---|---|---|---|---|
| **Alert** | `Alert` | `65:57149` (`Side-by-Side`) | `cr=0`, `f=[]`, `e=[]`, `clip=False` | `I5446:7340;10411:18581` `Fill + Shadow` & `Glass Effect` (**`cr=34`**, `GLASS` + shadows) | `34` | `34` | **visible-surface-confirmed** (`34pt`) |
| **Action Sheet** | `Action-Sheet` | `Action-Sheet` | `cr=0`, `f=[]`, `e=[]`, `clip=False` | Inner `Fill + Shadow` / `Glass Effect` (**`cr=34`**) | `34` | `34` | **visible-surface-confirmed** (`34pt`) |
| **Sheet (Floating Medium)** | `Sheet-iPhone` | `10525:1633` (`Detent=Medium`) | `rcr=[38,38,0,0]`, `f=[]`, `clip=False` | `I10525:1636;10411:18581` `Fill + Shadow` (`390×459`, **`rcr=[38,38,58,58]`**, `clip=True`, `GLASS`); `10525:1634 Overlay` (`cr=30`) is dimming backdrop, NOT sheet! | `38` (`sheetFloating`) | `38` | **visible-surface-confirmed** (`38pt` top, `58pt` floating bottom; `Large` `10525:1640` = `[38,38,0,0]`) |
| **Popover (iPad)** | `Popovers-(iPad-Only)` | `61:65449` (`Edge=Bottom`) | `cr=0`, `f=[]`, `e=[]`, `clip=False` | `513:95247` `Background` (`200×200`, **`cr=38`**, `clip=True` clipping `Thick` `BACKGROUND_BLUR`); `5433:21608 Arrow` (`cr=13`) is just the arrow tip | `26` | `26` | **CONTRADICTED** — visible popover body in kit is **`38pt`**, not `26pt` |
| **Menu** | `Menu` | `5908:6372` (`Mode=Dark`) | `cr=0`, `f=[]`, `e=[]`, `clip=False` | `I5908:6372;10411:18670` `Fill + Shadow` & `Glass Effect` (**`cr=34`**) | `26` | `26` | **CONTRADICTED** — visible iOS Menu in kit is **`34pt`**, not `26pt` |
| **Context Menu** | `Context-Menu` | `Context-Menu` | `cr=0`, `f=[]`, `e=[]`, `clip=False` | Inner preview/menu surface (**`cr=30`**) | `22` (`contextMenuPreview`) | `22` | **CONTRADICTED** — kit surface is **`30pt`** vs `22pt` estimate |
| **Text Field** | `Text-Field` / `_Text-Field-Background` | `553:23061` / `5469:8386` | `553:23061` (`402×52`, `cr=None`, form row); `5469:8386` (`160×52`, **`cr=26`** capsule) | Standalone `_Text-Field-Background` = **`52pt` tall, `cr=26` (capsule)**; multi-line `Text-Field-2` (`12616:832`) = **`cr=26`** | `12` (`textFieldRounded`) | `12` | **CONTRADICTED** — iOS 27 kit text fields use **`cr=26` (capsule/rounded 52pt)**, not `12pt` |
| **Tab Bar** | `Tab-Bar-iPad` / `Tab-Bar-iPhone` | `10508:1528` | `cr=0`, `f=[]` | Inner glass pill (**`cr=1000` / capsule**) | `capsule` | `capsule` | **visible-surface-confirmed** (`capsule`) |
| **Toolbar** | `Toolbar-Bottom-iPhone` | `5565:*` | `cr=0`, `f=[]` | Inner glass pill (**`cr=50` / `1000` capsule**) | `capsule` | `capsule` | **visible-surface-confirmed** (`capsule`) |
| **Toggle** | `Toggle-Switch` | `10456:1252` (`64×28`) | `cr=100`, `f=['SOLID']` | `10456:1252` (**`cr=100` / capsule**) | `capsule` | `capsule` | **outer-visible-confirmed** (`capsule`) |
| **Button** | `Button-Liquid-Glass-Text` | `5473:20461` | `cr=1000` | Inner glass pill (**`cr=1000` / capsule**) | `capsule` | `capsule` | **visible-surface-confirmed** (`capsule`) |

---

## 3. Clean `ios.textField` / Search Field / Form Row Audit (Corrected Filter)

- **Strictly filtered folders (10 — excluded `Context-Menu`, `Button-*`, `Examples-*`):**
  `['Accessory-Bar-iPhone-Web-Form', 'Sidebar-Search-Field', 'Text-Field', 'Text-Field-2', '_Search-44pt', '_Search-48pt', '_Search-Accessory', '_Search-Emoji', '_Search-Field', '_Text-Field-Background']`
- **Key Findings:**
  1. **`Text-Field` (`553:23061` Placeholder, `5433:15646` Focused):** `402×52`, `pad=[0,16,0,16]`, no visible fill/radius — this is a **full-width grouped-list form row**, NOT a boxed standalone field.
  2. **`_Text-Field-Background` (`5469:8386` Dark, `5469:8387` Light):** **`160×52`, `cr=26`** (full capsule = `52/2`) — standalone pill text field is ALSO **`52pt` tall**.
  3. **`Text-Field-2` (`12616:942`):** Multi-line text field (`272×123`, `_Background` `12616:832` = `272×104`, **`cr=26`**).
  4. **Are there ANY narrow `44pt` Text Fields?** **NO.** All 12 narrow `h=44` controls found by the filter are **Search Fields** (`_Search-44pt` `190×44` `cr=1000` glass pill, `Sidebar-Search-Field` `200×44`, `_Search-Field`), plus `_Search-48pt` (`48pt` bottom bar search variant).
  5. **Verdict for `layout.json :: ios.textField.height = 52`:** **CONFIRMED (`52pt`)** across BOTH form-row `Text-Field` (`402×52`) and standalone `_Text-Field-Background` (`160×52`, `cr=26`). `44pt` belongs strictly to `ios.searchField`.

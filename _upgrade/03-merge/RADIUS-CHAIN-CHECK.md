# Radius & Geometry Ancestor-Descendant Chain Check (Phase 8A: A3)

> **Date:** 2026-11-27 | **Method:** Full `layout.json` ancestor→target→descendant inspection

## 1. macOS 5 `radiusMacOS` Targets

### `585:3372` (Component: `Window-BG`) — Verdict: **outer-confirmed (`Window BG` outer component frame has `cr=16, cs=0.6`)**
**Ancestor chain:**
- `683:16442` **Window BG** (COMPONENT_SET) 710x500 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `585:3372` **Mode=Light,Active=True** (COMPONENT) 300x200 | cr=16 cs=0.6 | clips=True | fills=['SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW'] 
**Descendants (depth ≤ 2):**
- `585:3372` **Mode=Light,Active=True** (COMPONENT) 300x200 | cr=16 cs=0.6 | clips=True | fills=['SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW'] 

### `4363:18479` (Component: `Windows-Composed`) — Verdict: **outer-confirmed (`Windows - Composed` outer frame has `cr=16, cs=0.6`; no larger outer radius)**
**Ancestor chain:**
- `4363:18459` **Windows - Composed** (COMPONENT_SET) 7320x2800 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `4363:18479` **Mode=Light, Active=True, Window Type=Expanded Toolbar + Title + Sidebar** (COMPONENT) 840x400 | cr=16 cs=0.6 | clips=True | fills=['SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW'] 
**Descendants (depth ≤ 2):**
- `4363:18479` **Mode=Light, Active=True, Window Type=Expanded Toolbar + Title + Sidebar** (COMPONENT) 840x400 | cr=16 cs=0.6 | clips=True | fills=['SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW'] 
  - `4364:20805` **Left Pane** (FRAME) 240x400 | cr=None  | clips=False | fills=[] | eff=[] 
    - `4364:20806` **BG** (INSTANCE) 240x400 | cr=None  | clips=True | fills=[] | eff=['BACKGROUND_BLUR'] 
    - `4364:20832` **Sidebars - Composed** (INSTANCE) 240x560 | cr=None  | clips=False | fills=[] | eff=[] pad=[None, None, 10, None]
  - `4364:20833` **Right Pane** (FRAME) 600x400 | cr=None  | clips=False | fills=['SOLID'] | eff=[] 
    - `4364:21141` **Title Bar** (FRAME) 600x31 | cr=None  | clips=False | fills=[] | eff=[] pad=[8, 8, 8, 8]
    - `4364:21144` **Toolbar** (FRAME) 600x44 | cr=None  | clips=False | fills=[] | eff=[] pad=[None, 8, 8, 8]
    - `4364:20838` **Content Area** (FRAME) 600x325 | cr=None  | clips=False | fills=[] | eff=[] 

### `121:11423` (Component: `Sheet`) — Verdict: **outer-confirmed (`Sheet` outer frame has `cr=16, cs=0.6`)**
**Ancestor chain:**
- `4358:15435` **Sheet** (COMPONENT_SET) 680x340 | cr=5 cs=0 | clips=False | fills=[] | eff=[] 
  - `121:11423` **Mode=Light** (COMPONENT) 300x300 | cr=16 cs=0.6 | clips=False | fills=['SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW'] 
**Descendants (depth ≤ 2):**
- `121:11423` **Mode=Light** (COMPONENT) 300x300 | cr=16 cs=0.6 | clips=False | fills=['SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW'] 
  - `4358:15653` **Content View** (FRAME) 300x300 | cr=None  | clips=False | fills=[] | eff=[] 
    - `4358:17279` **Content View** (TEXT) 139x300 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 

### `121:11254` (Component: `Alert`) — Verdict: **outer-confirmed (`Alert` outer frame has `cr=10, cs=0.6`)**
**Ancestor chain:**
- `121:11186` **Alert** (COMPONENT_SET) 590x350 | cr=5 cs=0 | clips=False | fills=['SOLID'] | eff=[] 
  - `121:11254` **Type=Stacked** (COMPONENT) 260x216 | cr=10 cs=0.6 | clips=False | fills=[] | eff=[] pad=[20, 16, 16, 16]
**Descendants (depth ≤ 2):**
- `121:11254` **Type=Stacked** (COMPONENT) 260x216 | cr=10 cs=0.6 | clips=False | fills=[] | eff=[] pad=[20, 16, 16, 16]
  - `494:3080` **BG** (INSTANCE) 260x216 | cr=None  | clips=False | fills=[] | eff=[] 
    - `I494:3080;4311:12662` **Fill + Shadow** (FRAME) 260x216 | cr=34 cs=0.6 | clips=True | fills=['SOLID', 'SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW'] 
    - `I494:3080;4311:12663` **Glass Effect** (FRAME) 260x216 | cr=34 cs=0.6 | clips=True | fills=['SOLID'] | eff=['GLASS', 'INNER_SHADOW', 'INNER_SHADOW'] 
  - `152:9961` **Title + Description** (FRAME) 228x70 | cr=None  | clips=False | fills=[] | eff=[] pad=[None, 6, 2, 6]
    - `152:9962` **Title** (TEXT) 216x16 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
    - `152:9963` **Description** (TEXT) 216x42 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
  - `493:2993` **Buttons** (SLOT) 228x96 | cr=None  | clips=False | fills=[] | eff=[] 
    - `493:2994` **Button 1** (INSTANCE) 228x28 | cr=100 cs=0.6 | clips=False | fills=['SOLID'] | eff=[] pad=[None, 8, None, 8]
    - `493:2995` **Button 2** (INSTANCE) 228x28 | cr=100 cs=0.6 | clips=False | fills=[] | eff=[] pad=[None, 8, None, 8]
    - `493:2996` **Button 3** (INSTANCE) 228x28 | cr=100 cs=0.6 | clips=False | fills=['SOLID'] | eff=[] pad=[None, 8, None, 8]

### `4336:13305` (Component: `Popover`) — Verdict: **outer-confirmed (`Popover` outer frame has `cr=10, cs=0.6`)**
**Ancestor chain:**
- `121:11291` **Popover** (COMPONENT_SET) 1460x1200 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `4336:13305` **Mode=Dark, Edge=Leading (Top)** (COMPONENT) 200x200 | cr=10 cs=0.6 | clips=False | fills=[] | eff=[] 
**Descendants (depth ≤ 2):**
- `4336:13305` **Mode=Dark, Edge=Leading (Top)** (COMPONENT) 200x200 | cr=10 cs=0.6 | clips=False | fills=[] | eff=[] 
  - `4336:13306` **Fill + Shadow** (BOOLEAN_OPERATION) 210.5x200 | cr=None  | clips=None | fills=['SOLID', 'SOLID', 'SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW'] 
    - `4336:13307` **Body** (RECTANGLE) 200x200 | cr=20 cs=0.6 | clips=None | fills=['SOLID', 'SOLID'] | eff=['BACKGROUND_BLUR', 'DROP_SHADOW', 'DROP_SHADOW', 'INNER_SHADOW'] 
    - `4336:13308` **Cartouche** (VECTOR) 30.5x39.0099983215332 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
  - `4336:13391` **Glass Effect** (BOOLEAN_OPERATION) 210.5x200 | cr=None  | clips=None | fills=['SOLID'] | eff=['GLASS', 'INNER_SHADOW', 'INNER_SHADOW'] 
    - `4336:13392` **Body** (RECTANGLE) 200x200 | cr=20 cs=0.6 | clips=None | fills=['SOLID', 'SOLID'] | eff=['BACKGROUND_BLUR', 'DROP_SHADOW', 'DROP_SHADOW', 'INNER_SHADOW'] 
    - `4336:13393` **Cartouche** (VECTOR) 30.5x39.0099983215332 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 

### `685:23691` (Component: `Menu-Items`) — Verdict: **inner-layer-only (`Menu Items` row is `160x24`, `cr=8` is the hover highlight layer inside the menu)**
**Ancestor chain:**
- `121:12600` **Menu Items** (COMPONENT_SET) 410x570 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `685:23691` **Mode=Light, State=Hover, Menu has Selection=True, Type=Submenu** (COMPONENT) 160x24 | cr=8 cs=0.6 | clips=False | fills=[] | eff=[] pad=[None, None, None, 12]
**Descendants (depth ≤ 2):**
- `685:23691` **Mode=Light, State=Hover, Menu has Selection=True, Type=Submenu** (COMPONENT) 160x24 | cr=8 cs=0.6 | clips=False | fills=[] | eff=[] pad=[None, None, None, 12]
  - `685:23692` **BG** (RECTANGLE) 174x24 | cr=8 cs=0.6 | clips=None | fills=['SOLID'] | eff=[] 
  - `685:23693` **Frame** (FRAME) 4x24 | cr=None  | clips=False | fills=[] | eff=[] 
  - `4354:3070` **Symbol and Title** (FRAME) 116x24 | cr=None  | clips=False | fills=[] | eff=[] 
    - `4354:3071` **Symbol** (FRAME) 12x24 | cr=None  | clips=False | fills=[] | eff=[] 
    - `4354:3073` **Label** (TEXT) 96x24 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
  - `685:23697` **Chevron** (TEXT) 12x24 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 

## 2. iOS 4 Suspicious Targets

### All non-Example `Text Field` components in `ios27`:
| Component | Node ID | Variant | Size | Padding |
|---|---|---|---|---|
| `Button-Liquid-Glass-Text` | `10456:14495` | `Size=Small, Style=Glass, Is Enabled=False, Destructive=True` | `60x28` | `{'top': 5, 'right': 10, 'bottom': 5, 'left': 10}` |
| `Button-Liquid-Glass-Text` | `10456:14447` | `Size=Medium, Style=Glass, Is Enabled=False, Destructive=True` | `69x34` | `{'top': 8, 'right': 12, 'bottom': 8, 'left': 12}` |
| `Button-Liquid-Glass-Text` | `10456:9809` | `Size=Large, Style=Glass, Is Enabled=False, Destructive=True` | `85x50` | `{'top': 16, 'right': 20, 'bottom': 16, 'left': 20}` |
| `Button-Liquid-Glass-Text` | `10456:14498` | `Size=Small, Style=Glass, Is Enabled=True, Destructive=True` | `60x28` | `{'top': 5, 'right': 10, 'bottom': 5, 'left': 10}` |
| `Button-Liquid-Glass-Text` | `10456:14450` | `Size=Medium, Style=Glass, Is Enabled=True, Destructive=True` | `69x34` | `{'top': 8, 'right': 12, 'bottom': 8, 'left': 12}` |
| `Context-Menu` | `128:77880` | `Alignment=Horizontal (iPad only), Side=Trailing` | `351x161` | `None` |
| `Context-Menu` | `128:77888` | `Alignment=Horizontal (iPad only), Side=Leading` | `351x161` | `None` |
| `Context-Menu` | `125:58751` | `Alignment=Vertical, Side=Trailing` | `351x160` | `None` |
| `Context-Menu` | `125:58302` | `Alignment=Vertical, Side=Leading` | `351x160` | `None` |
| `Context-Menu-Dimming-Overlay` | `128:76929` | `Context Menu - Dimming Overlay` | `200x200` | `None` |
| `Lock-Screen-Widget-Rectangular-Text-Gauge` | `525:43106` | `Lock Screen Widget - Rectangular Text Gauge` | `160x72` | `{'top': 8, 'right': 8, 'bottom': 13, 'left': 8}` |
| `Sidebar-Search-Field` | `5840:30516` | `Sidebar Search Field` | `200x64` | `{'top': 0, 'right': 0, 'bottom': 20, 'left': 0}` |
| `Text-Field` | `553:23061` | `State=Placeholder` | `402x52` | `{'top': 0, 'right': 16, 'bottom': 0, 'left': 16}` |
| `Text-Field` | `5433:15646` | `State=Focused` | `402x52` | `{'top': 0, 'right': 16, 'bottom': 0, 'left': 16}` |
| `Text-Field` | `5433:15631` | `State=Value Entered` | `402x52` | `{'top': 0, 'right': 16, 'bottom': 0, 'left': 16}` |
| `Text-Field` | `5433:15635` | `State=Typing` | `402x52` | `{'top': 0, 'right': 16, 'bottom': 0, 'left': 16}` |
| `Text-Field-2` | `12616:942` | `Text Field` | `272x123` | `{'top': 0, 'right': 0, 'bottom': 19, 'left': 0}` |
| `Text-Selection` | `5711:35414` | `Text Selection` | `94x22` | `None` |
| `_Button-Text` | `5565:34912` | `Mode=Dark, State=Disabled` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text` | `5565:34914` | `Mode=Dark, State=Tinted` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text` | `5565:34916` | `Mode=Dark, State=Selected` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text` | `5565:34918` | `Mode=Dark, State=Default` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text` | `5429:7005` | `Mode=Light,State=Tinted` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text-Prominent` | `10479:19511` | `Mode=Dark, State=Disabled` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text-Prominent` | `10479:19517` | `Mode=Dark, State=Default` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text-Prominent` | `10479:19521` | `Mode=Light,State=Disabled` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Button-Text-Prominent` | `10479:19525` | `Mode=Light,State=Default` | `57x36` | `{'top': 0, 'right': 6, 'bottom': 0, 'left': 6}` |
| `_Field-BG` | `5522:15882` | `Mode=Dark` | `140x36` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-BG` | `5522:15880` | `Mode=Light` | `140x36` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Find` | `5522:14988` | `Mode=Light, State=Text Entered` | `200x22` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Find` | `5522:15229` | `Mode=Dark, State=Text Entered` | `200x22` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Find` | `5522:15008` | `Mode=Light, State=Typing` | `200x23` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Find` | `5522:15241` | `Mode=Dark, State=Typing` | `200x23` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Find` | `5522:15024` | `Mode=Light, State=Focused` | `200x23` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Replace` | `5522:15559` | `Mode=Light, State=Text Entered` | `200x22` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Replace` | `5522:15570` | `Mode=Dark, State=Text Entered` | `200x22` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Replace` | `5522:15581` | `Mode=Light, State=Typing` | `200x23` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Replace` | `5522:15589` | `Mode=Dark, State=Typing` | `200x23` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Field-Replace` | `5522:15597` | `Mode=Light, State=Focused` | `200x23` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Label-Text` | `5566:15290` | `Mode=Dark, Size=Large, Type=Preferred, Is Enabled=False` | `45x18` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Label-Text` | `10462:31824` | `Mode=Dark, Size=Small, Type=Preferred, Is Enabled=False` | `40x18` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Label-Text` | `5566:15292` | `Mode=Dark, Size=Large, Type=Preferred, Is Enabled=True` | `45x18` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Label-Text` | `10462:31826` | `Mode=Dark, Size=Small, Type=Preferred, Is Enabled=True` | `40x18` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Label-Text` | `5522:11900` | `Mode=Light, Size=Large, Type=Preferred, Is Enabled=False` | `45x18` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Search-Field` | `5840:30472` | `Mode=Dark, State=Typing` | `200x44` | `{'top': 11, 'right': 11, 'bottom': 11, 'left': 11}` |
| `_Search-Field` | `5840:30479` | `Mode=Dark, State=Value` | `200x44` | `{'top': 11, 'right': 11, 'bottom': 11, 'left': 11}` |
| `_Search-Field` | `5840:30484` | `Mode=Dark, State=Placeholder` | `200x44` | `{'top': 11, 'right': 11, 'bottom': 11, 'left': 11}` |
| `_Search-Field` | `5840:30489` | `Mode=Light, State=Typing` | `200x44` | `{'top': 11, 'right': 11, 'bottom': 11, 'left': 11}` |
| `_Search-Field` | `5840:30496` | `Mode=Light, State=Value` | `200x44` | `{'top': 11, 'right': 11, 'bottom': 11, 'left': 11}` |
| `_Tab-Bar-Button-iPad-Text` | `5569:7317` | `Mode=Light, Selected=False` | `75x36` | `{'top': 8, 'right': 18, 'bottom': 8, 'left': 18}` |
| `_Tab-Bar-Button-iPad-Text` | `5569:7316` | `Mode=Light, Selected=True` | `77x36` | `{'top': 8, 'right': 18, 'bottom': 8, 'left': 18}` |
| `_Tab-Bar-Button-iPad-Text` | `5569:7320` | `Mode=Dark, Selected=False` | `75x36` | `{'top': 8, 'right': 18, 'bottom': 8, 'left': 18}` |
| `_Tab-Bar-Button-iPad-Text` | `5569:7322` | `Mode=Dark, Selected=True` | `77x36` | `{'top': 8, 'right': 18, 'bottom': 8, 'left': 18}` |
| `_Text-Field-Background` | `5469:8386` | `Mode=Dark` | `160x52` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |
| `_Text-Field-Background` | `5469:8387` | `Mode=Light` | `160x52` | `{'top': 0, 'right': 0, 'bottom': 0, 'left': 0}` |

### `553:23061` (Component: `Text-Field`) — Verdict: **ambiguous (`402x52` is full-screen-width form/list row style; standalone narrower 44pt control not separate)**
**Ancestor chain:**
- `553:23047` **Text Field** (COMPONENT_SET) 442x310 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `553:23061` **State=Placeholder** (COMPONENT) 402x52 | cr=None  | clips=False | fills=[] | eff=[] pad=[None, 16, None, 16]
**Descendants (depth ≤ 2):**
- `553:23061` **State=Placeholder** (COMPONENT) 402x52 | cr=None  | clips=False | fills=[] | eff=[] pad=[None, 16, None, 16]
  - `553:23062` **Contents** (FRAME) 370x52 | cr=None  | clips=False | fills=[] | eff=[] 
    - `5469:7944` **_Separator** (INSTANCE) 370x1 | cr=None  | clips=False | fills=[] | eff=[] 
    - `553:23064` **Value** (TEXT) 370x51 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 

### `65:57149` (Component: `Alert`) — Verdict: **outer-confirmed (`Alert` Side-by-Side outer frame `300x307` has `pad=14`)**
**Ancestor chain:**
- `63:57121` **Alert** (COMPONENT_SET) 670x480 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `65:57149` **Button Layout=Side-by-Side** (COMPONENT) 300x307 | cr=None  | clips=False | fills=[] | eff=[] pad=[14, 14, 14, 14]
**Descendants (depth ≤ 2):**
- `65:57149` **Button Layout=Side-by-Side** (COMPONENT) 300x307 | cr=None  | clips=False | fills=[] | eff=[] pad=[14, 14, 14, 14]
  - `5446:7340` **BG** (INSTANCE) 300x307 | cr=None  | clips=False | fills=[] | eff=[] 
    - `I5446:7340;10411:18581` **Fill + Shadow** (FRAME) 300x307 | cr=34 cs=0.6 | clips=True | fills=['SOLID', 'SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW'] 
    - `I5446:7340;10411:18582` **Glass Effect** (FRAME) 300x307 | cr=34 cs=0.6 | clips=True | fills=['SOLID'] | eff=['GLASS', 'INNER_SHADOW', 'INNER_SHADOW'] 
  - `65:57150` **Title and Message** (FRAME) 272x108 | cr=None  | clips=False | fills=[] | eff=[] pad=[8, 8, 24, 8]
    - `65:57151` **A Short Title Is Best** (TEXT) 256x22 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
    - `65:57152` **A message should be a short, complete sentence.** (TEXT) 256x44 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
  - `12616:1078` **Text Field** (INSTANCE) 272x123 | cr=26 cs=0.6 | clips=False | fills=[] | eff=[] pad=[None, None, 19, None]
    - `I12616:1078;12616:831` **Fields** (FRAME) 272x104 | cr=None  | clips=True | fills=[] | eff=[] 
  - `65:57156` **Buttons** (FRAME) 272x48 | cr=None  | clips=False | fills=[] | eff=[] 
    - `5446:6990` **Button** (INSTANCE) 132x48 | cr=100 cs=0.6 | clips=False | fills=[] | eff=[] pad=[13, 16, 13, 16]
    - `5446:7014` **Button** (INSTANCE) 132x48 | cr=100 cs=0.6 | clips=False | fills=['SOLID'] | eff=[] pad=[13, 16, 13, 16]

### `61:67601` (Component: `Alert`) — Verdict: **outer-confirmed (`Alert` Stacked outer frame `300x419` has `pad=14`)**
**Ancestor chain:**
- `63:57121` **Alert** (COMPONENT_SET) 670x480 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `61:67601` **Button Layout=Stacked** (COMPONENT) 300x419 | cr=None  | clips=False | fills=[] | eff=[] pad=[14, 14, 14, 14]
**Descendants (depth ≤ 2):**
- `61:67601` **Button Layout=Stacked** (COMPONENT) 300x419 | cr=None  | clips=False | fills=[] | eff=[] pad=[14, 14, 14, 14]
  - `5742:38608` **BG** (INSTANCE) 300x419 | cr=None  | clips=False | fills=[] | eff=[] 
    - `I5742:38608;10411:18581` **Fill + Shadow** (FRAME) 300x419 | cr=34 cs=0.6 | clips=True | fills=['SOLID', 'SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW'] 
    - `I5742:38608;10411:18582` **Glass Effect** (FRAME) 300x419 | cr=34 cs=0.6 | clips=True | fills=['SOLID'] | eff=['GLASS', 'INNER_SHADOW', 'INNER_SHADOW'] 
  - `61:67654` **Title and Message** (FRAME) 272x108 | cr=None  | clips=False | fills=[] | eff=[] pad=[8, 8, 24, 8]
    - `61:67599` **A Short Title Is Best** (TEXT) 256x22 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
    - `61:67600` **A message should be a short, complete sentence.** (TEXT) 256x44 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
  - `12616:1055` **Text Field** (INSTANCE) 272x123 | cr=26 cs=0.6 | clips=False | fills=[] | eff=[] pad=[None, None, 19, None]
    - `I12616:1055;12616:831` **Fields** (FRAME) 272x104 | cr=None  | clips=True | fills=[] | eff=[] 
  - `537:39280` **Actions** (SLOT) 272x160 | cr=None  | clips=False | fills=[] | eff=[] 
    - `5446:6744` **Button** (INSTANCE) 272x48 | cr=100 cs=0.6 | clips=False | fills=['SOLID'] | eff=[] pad=[13, 16, 13, 16]
    - `5446:7598` **Button** (INSTANCE) 272x48 | cr=100 cs=0.6 | clips=False | fills=[] | eff=[] pad=[13, 16, 13, 16]
    - `5446:7604` **Button** (INSTANCE) 272x48 | cr=100 cs=0.6 | clips=False | fills=[] | eff=[] pad=[13, 16, 13, 16]

### `5827:57545` (Component: `Grabber`) — Verdict: **inner-layer-only (`Grabber` is `60x4` inner child inside Sheet)**
**Ancestor chain:**
- `5827:57566` **Grabber** (COMPONENT_SET) 100x70 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] 
  - `5827:57545` **Mode=Light** (COMPONENT) 60x4 | cr=100 cs=0 | clips=False | fills=['SOLID'] | eff=[] 
**Descendants (depth ≤ 2):**
- `5827:57545` **Mode=Light** (COMPONENT) 60x4 | cr=100 cs=0 | clips=False | fills=['SOLID'] | eff=[] 

### `10525:1687` (Component: `Sheet-iPhone`) — Verdict: **inner-layer-only (`Grabber` container padding `top=6` inside Sheet)**
**Ancestor chain:**
- `10525:1632` **Sheet - iPhone** (COMPONENT_SET) 1302x914 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] pad=[20, 20, 20, 20]
  - `10525:1633` **Detent=Medium** (COMPONENT) 402x874 | rcr=[38, 38, 0, 0] cs=0 | clips=False | fills=[] | eff=[] 
    - `10525:1635` **Sheet** (FRAME) 390x459 | cr=None  | clips=False | fills=[] | eff=[] 
      - `10525:1687` **Grabber** (FRAME) 390x10 | cr=None  | clips=False | fills=[] | eff=[] pad=[6, None, None, None]
**Descendants (depth ≤ 2):**
- `10525:1687` **Grabber** (FRAME) 390x10 | cr=None  | clips=False | fills=[] | eff=[] pad=[6, None, None, None]
  - `10525:1688` **Grabber** (INSTANCE) 60x4 | cr=100 cs=0 | clips=False | fills=['SOLID'] | eff=[] 

### `10525:1635` (Component: `Sheet-iPhone`) — Verdict: **outer-confirmed (`Medium` Sheet `390` inside `402` -> `6pt` floating inset)**
**Ancestor chain:**
- `10525:1632` **Sheet - iPhone** (COMPONENT_SET) 1302x914 | cr=5 cs=0 | clips=True | fills=['SOLID'] | eff=[] pad=[20, 20, 20, 20]
  - `10525:1633` **Detent=Medium** (COMPONENT) 402x874 | rcr=[38, 38, 0, 0] cs=0 | clips=False | fills=[] | eff=[] 
    - `10525:1635` **Sheet** (FRAME) 390x459 | cr=None  | clips=False | fills=[] | eff=[] 
**Descendants (depth ≤ 2):**
- `10525:1635` **Sheet** (FRAME) 390x459 | cr=None  | clips=False | fills=[] | eff=[] 
  - `10525:1636` **BG** (INSTANCE) 390x459 | cr=None  | clips=False | fills=[] | eff=[] 
    - `I10525:1636;10411:18581` **Fill + Shadow** (FRAME) 390x459 | rcr=[38, 38, 58, 58] cs=0.6 | clips=True | fills=['SOLID', 'SOLID'] | eff=['DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW', 'DROP_SHADOW'] 
    - `I10525:1636;10411:18582` **Glass Effect** (FRAME) 390x459 | rcr=[38, 38, 58, 58] cs=0.6 | clips=True | fills=['SOLID'] | eff=['GLASS', 'INNER_SHADOW', 'INNER_SHADOW'] 
  - `10525:1696` **Content** (SLOT) 390x459 | cr=None  | clips=True | fills=[] | eff=[] pad=[16, None, None, None]
    - `10525:1697` **Toolbar - Top - iPhone** (INSTANCE) 390x54 | cr=None  | clips=False | fills=[] | eff=[] pad=[None, 16, 10, 16]
  - `10525:1687` **Grabber** (FRAME) 390x10 | cr=None  | clips=False | fills=[] | eff=[] pad=[6, None, None, None]
    - `10525:1688` **Grabber** (INSTANCE) 60x4 | cr=100 cs=0 | clips=False | fills=['SOLID'] | eff=[] 

### `5415:17699` (Component: `Stepper`) — Verdict: **outer-confirmed (`Stepper` outer frame `92x32`)**
**Ancestor chain:**
- `5415:17699` **Stepper** (COMPONENT) 92x32 | cr=100 cs=0.6 | clips=True | fills=[] | eff=[] 
**Descendants (depth ≤ 2):**
- `5415:17699` **Stepper** (COMPONENT) 92x32 | cr=100 cs=0.6 | clips=True | fills=[] | eff=[] 
  - `5415:17700` **Separator** (RECTANGLE) 1x24 | cr=8 cs=0 | clips=None | fills=['SOLID'] | eff=[] 
  - `5415:17701` **_Decrement** (INSTANCE) 46x32 | cr=None  | clips=False | fills=['SOLID'] | eff=[] 
    - `I5415:17701;5415:17690` **Decrement** (TEXT) 46x22 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 
  - `5415:17702` **_Increment** (INSTANCE) 46x32 | cr=None  | clips=False | fills=['SOLID'] | eff=[] 
    - `I5415:17702;5415:17697` **Increment** (TEXT) 46x22 | cr=None  | clips=None | fills=['SOLID'] | eff=[] 

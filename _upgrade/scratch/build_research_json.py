import json, os, math

ROOT = r"d:\Claude-Plugins\cupertino-forge"
DOCS_DIR = os.path.join(ROOT, "_upgrade", "scratch", "apple-docs")
TOK_DIR = os.path.join(ROOT, "tokens")
SRC_DIR = os.path.join(TOK_DIR, "source")
OUT_JSON = os.path.join(ROOT, "_upgrade", "02-research", "json")
os.makedirs(OUT_JSON, exist_ok=True)

def load(p):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def save(name, obj):
    p = os.path.join(OUT_JSON, name)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
    print("WROTE", name, os.path.getsize(p), "bytes")

def tok(val, unit, source, cls, platform, url, notes=None, confidence="high"):
    d = {"$value": val, "$unit": unit, "$source": source, "$class": cls, "$platform": platform, "$url": url, "$confidence": confidence}
    if notes: d["$notes"] = notes
    return d

def fmt_col(c):
    a = c.get("alpha", 1)
    h = c.get("hex", "#000000").upper()
    return h if a == 1 else f"{h}@{round(a, 4)}"

ios_kit = load(os.path.join(SRC_DIR, "apple-ios-27-ui-kit.tokens.json"))
mac_kit = load(os.path.join(SRC_DIR, "apple-macos-27-ui-kit.tokens.json"))
plug_color = load(os.path.join(TOK_DIR, "color.json"))
plug_typo = load(os.path.join(TOK_DIR, "typography.json"))
plug_mat = load(os.path.join(TOK_DIR, "materials.json"))
plug_lay = load(os.path.join(TOK_DIR, "layout.json"))
plug_shp = load(os.path.join(TOK_DIR, "shape.json"))
plug_mot = load(os.path.join(TOK_DIR, "motion.json"))
plug_elv = load(os.path.join(TOK_DIR, "elevation.json"))

URL_COLOR = "https://developer.apple.com/design/human-interface-guidelines/color"
URL_TYPO = "https://developer.apple.com/design/human-interface-guidelines/typography"
URL_MAT = "https://developer.apple.com/design/human-interface-guidelines/materials"
URL_ALG = "https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass"
URL_LAY = "https://developer.apple.com/design/human-interface-guidelines/layout"
URL_A11Y = "https://developer.apple.com/design/human-interface-guidelines/accessibility"
URL_SPR = "https://developer.apple.com/documentation/swiftui/spring"
URL_CONC = "https://developer.apple.com/documentation/swiftui/concentricrectangle"
URL_SHP_CON = "https://caniuse.com/mdn-css_properties_corner-shape_squircle"
URL_BTN = "https://developer.apple.com/design/human-interface-guidelines/buttons"
URL_SHEET = "https://developer.apple.com/design/human-interface-guidelines/sheets"
URL_TAB = "https://developer.apple.com/design/human-interface-guidelines/tab-bars"
URL_SIDE = "https://developer.apple.com/design/human-interface-guidelines/sidebars"
URL_TOOL = "https://developer.apple.com/design/human-interface-guidelines/toolbars"
URL_APPICON = "https://developer.apple.com/design/human-interface-guidelines/app-icons"
URL_LIVE = "https://developer.apple.com/design/human-interface-guidelines/live-activities"
URL_WID = "https://developer.apple.com/design/human-interface-guidelines/widgets"
URL_IOS_KIT = "tokens/source/apple-ios-27-ui-kit.tokens.json"
URL_MAC_KIT = "tokens/source/apple-macos-27-ui-kit.tokens.json"

# ==============================================================================
# 1. color.json
# ==============================================================================
sys_colors_out = {}
kit_sys_names = [
    ("red","1 Red"),("orange","2 Orange"),("yellow","3 Yellow"),("green","4 Green"),
    ("mint","5 Mint"),("teal","6 Teal"),("cyan","7 Cyan"),("blue","8 Blue"),
    ("indigo","9 Indigo"),("purple","10 Purple"),("pink","11 Pink"),("brown","12 Brown")
]
for sk, kname in kit_sys_names:
    l_val = fmt_col(ios_kit["System Colors"]["Light"][kname]["$value"])
    d_val = fmt_col(ios_kit["System Colors"]["Dark"][kname]["$value"])
    # HC values come from HIG/existing plugin (HIG page uses image swatches in JSON, not hex text)
    lhc = plug_color["system"][sk]["lightHC"]
    dhc = plug_color["system"][sk]["darkHC"]
    sys_colors_out[sk] = {
        "light": tok(l_val, "sRGB hex", "Apple iOS 27 & macOS 27 Sketch Kits", "Measured", "iOS 27 / macOS 27", URL_IOS_KIT),
        "dark": tok(d_val, "sRGB hex", "Apple iOS 27 & macOS 27 Sketch Kits", "Measured", "iOS 27 / macOS 27", URL_IOS_KIT),
        "lightHC": tok(lhc, "sRGB hex", "Apple HIG Color (image swatch in HIG, carried from plugin)", "Inferred", "iOS / macOS", URL_COLOR, "HIG JSON uses PNG swatches; unverified against Xcode asset catalog", "med"),
        "darkHC": tok(dhc, "sRGB hex", "Apple HIG Color (image swatch in HIG, carried from plugin)", "Inferred", "iOS / macOS", URL_COLOR, "HIG JSON uses PNG swatches; unverified against Xcode asset catalog", "med"),
    }

sys_vib_mac = {}
for sk, kname in kit_sys_names:
    lv = fmt_col(mac_kit["System Colors"]["Light Vibrant (use plus darker)"][kname]["$value"])
    dv = fmt_col(mac_kit["System Colors"]["Dark (use plus lighter)"][kname]["$value"])
    sys_vib_mac[sk] = {
        "light": tok(lv, "sRGB hex", "Apple macOS 27 Sketch Kit (Light Vibrant)", "Measured", "macOS 27", URL_MAC_KIT),
        "dark": tok(dv, "sRGB hex", "Apple macOS 27 Sketch Kit (Dark plus lighter)", "Measured", "macOS 27", URL_MAC_KIT),
    }

grays_ios = {}
for gk, kname in [("gray","Gray"),("gray2","Gray 2"),("gray3","Gray 3"),("gray4","Gray 4"),("gray5","Gray 5"),("gray6","Gray 6")]:
    lv = fmt_col(ios_kit["Grays"]["Light"][kname]["$value"])
    dv = fmt_col(ios_kit["Grays"]["Dark"][kname]["$value"])
    grays_ios[gk] = {
        "light": tok(lv, "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "dark": tok(dv, "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "lightHC": tok(plug_color["grayIOS"][gk]["lightHC"], "sRGB hex", "Apple HIG Color (image swatch in HIG)", "Inferred", "iOS", URL_COLOR, confidence="med"),
        "darkHC": tok(plug_color["grayIOS"][gk]["darkHC"], "sRGB hex", "Apple HIG Color (image swatch in HIG)", "Inferred", "iOS", URL_COLOR, confidence="med"),
    }

labels_ios = {}
for lk, kname in [("primary","1 Primary"),("secondary","2 Secondary"),("tertiary","3 Tertiary"),("quaternary","4 Quaternary"),("quinary","5 Quinary")]:
    labels_ios[lk] = {
        "light": tok(fmt_col(ios_kit["Labels"]["Light"][kname]["$value"]), "sRGB hex/alpha", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "dark": tok(fmt_col(ios_kit["Labels"]["Dark"][kname]["$value"]), "sRGB hex/alpha", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
    }

labels_glass_ios = {}
for lk, kname in [("primary","1 Primary"),("secondary","2 Secondary"),("tertiary","3 Tertiary"),("quaternary","4 Quaternary")]:
    labels_glass_ios[lk] = {
        "light": tok(fmt_col(ios_kit["Labels - Liquid Glass"]["Light"][kname]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "dark": tok(fmt_col(ios_kit["Labels - Liquid Glass"]["Dark"][kname]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
    }

labels_macos = {}
for lk, kname in [("primary","1 Primary"),("secondary","2 Secondary"),("tertiary","3 Tertiary"),("quaternary","4 Quaternary"),("quinary","5 Quinary"),("seximal","6 Seximal")]:
    labels_macos[lk] = {
        "light": tok(fmt_col(mac_kit["Labels"]["Light"][kname]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        "dark": tok(fmt_col(mac_kit["Labels"]["Dark"][kname]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
    }

fills_ios = {}
for fk, kname in [("primary","1 Primary"),("secondary","2 Secondary"),("tertiary","3 Tertiary"),("quaternary","4 Quaternary"),("quinary","5 Quinary")]:
    fills_ios[fk] = {
        "light": tok(fmt_col(ios_kit["Fills"]["Light"][kname]["$value"]), "sRGB hex/alpha", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "dark": tok(fmt_col(ios_kit["Fills"]["Dark"][kname]["$value"]), "sRGB hex/alpha", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
    }

bg_ios = {}
for bk, grp, kname in [
    ("primary","Backgrounds","Primary"),("secondary","Backgrounds","Secondary"),("tertiary","Backgrounds","Tertiary"),
    ("groupedPrimary","Backgrounds Grouped","Primary"),("groupedSecondary","Backgrounds Grouped","Secondary"),("groupedTertiary","Backgrounds Grouped","Tertiary")
]:
    bg_ios[bk] = {
        "light": tok(fmt_col(ios_kit[grp]["Light"][kname]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "darkBase": tok(fmt_col(ios_kit[grp]["Dark - Base"][kname]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        "darkElevated": tok(fmt_col(ios_kit[grp]["Dark - Elevated"][kname]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
    }

color_research = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_COLOR, URL_IOS_KIT, URL_MAC_KIT]},
    "system": sys_colors_out,
    "systemVibrantMacOS": sys_vib_mac,
    "grayIOS": grays_ios,
    "grayMacOS": {
        "gray": {
            "light": tok(fmt_col(mac_kit["Grays"]["Light"]["Grey"]["$value"]), "sRGB hex", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
            "dark": tok(fmt_col(mac_kit["Grays"]["Dark"]["Grey"]["$value"]), "sRGB hex", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        },
        "grayVibrant": {
            "light": tok(fmt_col(mac_kit["Grays"]["Light Vibrant (use plus darker)"]["Grey"]["$value"]), "sRGB hex", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
            "dark": tok(fmt_col(mac_kit["Grays"]["Dark (use plus lighter)"]["Grey"]["$value"]), "sRGB hex", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        }
    },
    "labelIOS": labels_ios,
    "labelOnGlassIOS": labels_glass_ios,
    "labelMacOS": labels_macos,
    "fillIOS": fills_ios,
    "backgroundIOS": bg_ios,
    "separatorIOS": {
        "nonOpaque": {
            "light": tok(fmt_col(ios_kit["Separators"]["Light"]["Non-Opaque"]["$value"]), "sRGB hex/alpha", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
            "dark": tok(fmt_col(ios_kit["Separators"]["Dark"]["Non-Opaque"]["$value"]), "sRGB hex/alpha", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        },
        "opaque": {
            "light": tok(fmt_col(ios_kit["Separators"]["Light"]["Opaque"]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
            "dark": tok(fmt_col(ios_kit["Separators"]["Dark"]["Opaque"]["$value"]), "sRGB hex", "Apple iOS 27 Sketch Kit", "Measured", "iOS 27", URL_IOS_KIT),
        }
    },
    "macOSSurfaces": {
        "windowBackground": {
            "light": tok(fmt_col(mac_kit["Window Backgrounds"]["Light Background"]["$value"]), "sRGB hex", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
            "dark": tok(fmt_col(mac_kit["Window Backgrounds"]["Dark Background"]["$value"]), "sRGB hex", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        },
        "sidebarActive": {
            "light": tok(fmt_col(mac_kit["Sidebar"]["Background"]["Light"]["Active"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
            "dark": tok(fmt_col(mac_kit["Sidebar"]["Background"]["Dark"]["Active"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        },
        "sidebarInactive": {
            "light": tok(fmt_col(mac_kit["Sidebar"]["Background"]["Light"]["Inactive"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
            "dark": tok(fmt_col(mac_kit["Sidebar"]["Background"]["Dark"]["Inactive"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        },
        "separator": {
            "light": tok(fmt_col(mac_kit["Separators"]["Light"]["$value"]), "sRGB hex/alpha", "Apple macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
            "dark": tok(plug_color["macOSSurfaces"]["separator"]["dark"], "sRGB hex/alpha", "Plugin color.json (absent in macOS kit JSON)", "Estimated", "macOS 27", URL_MAC_KIT, "macOS kit Separators only contains Light", "low"),
        },
    },
    "focusRing": {
        "outerWidth": tok(mac_kit["Global"]["Focus Ring"]["borders"]["0"]["$value"]["width"]["value"], "px/pt", "Apple macOS 27 Sketch Kit (Global.Focus Ring)", "Measured", "macOS 27", URL_MAC_KIT),
        "innerWidth": tok(mac_kit["Global"]["Focus Ring"]["borders"]["1"]["$value"]["width"]["value"], "px/pt", "Apple macOS 27 Sketch Kit (Global.Focus Ring)", "Measured", "macOS 27", URL_MAC_KIT),
        "outerAlpha": tok(mac_kit["Global"]["Focus Ring"]["borders"]["0"]["$value"]["color"]["alpha"], "alpha", "Apple macOS 27 Sketch Kit (Global.Focus Ring)", "Measured", "macOS 27", URL_MAC_KIT),
        "innerAlpha": tok(mac_kit["Global"]["Focus Ring"]["borders"]["1"]["$value"]["color"]["alpha"], "alpha", "Apple macOS 27 Sketch Kit (Global.Focus Ring)", "Measured", "macOS 27", URL_MAC_KIT),
    },
    "dimming": {
        "clearGlassOverBrightContent": tok("#000000@0.35", "sRGB hex/alpha", "Apple HIG Materials (35% dark dimming layer)", "Official", "iOS 26+ / macOS 26+", URL_MAT),
        "sheetScrim": {
            "light": tok("#000000@0.2", "sRGB hex/alpha", "Plugin color.json", "Estimated", "iOS", URL_SHEET, confidence="low"),
            "dark": tok("#000000@0.48", "sRGB hex/alpha", "Plugin color.json", "Estimated", "iOS", URL_SHEET, confidence="low"),
        }
    }
}
save("color.json", color_research)

# ==============================================================================
# 2. typography.json
# ==============================================================================
def txt(nodes):
    out = []
    for n in nodes or []:
        t = n.get("type")
        if t == "text": out.append(n.get("text", ""))
        elif t == "codeVoice": out.append(n.get("code", ""))
        elif t == "reference": out.append(n.get("overridingTitle") or n.get("identifier", "").split("/")[-1])
        elif "inlineContent" in n: out.append(txt(n["inlineContent"]))
    return "".join(out).strip()

def walk_tables(items, ctx=""):
    res = []; cur = ctx
    for it in items or []:
        t = it.get("type")
        if t == "heading": cur = it.get("text", "")
        elif t == "tabNavigator":
            for tab in it.get("tabs", []): res.extend(walk_tables(tab.get("content", []), f"{cur} > {tab.get('title','')}"))
        elif t == "table":
            res.append((cur, [[" ".join(txt(c.get("inlineContent")) for c in cell if c.get("type") == "paragraph").strip() for cell in row] for row in it.get("rows", [])]))
    return res

typo_hig = load(os.path.join(DOCS_DIR, "hig__typography.json"))
t_tables = []
for sec in typo_hig.get("primaryContentSections", []): t_tables.extend(walk_tables(sec.get("content")))

dt_map = {"xSmall":"xSmall","Small":"Small","Medium":"Medium","Large (default)":"Large","xLarge":"xLarge","xxLarge":"xxLarge","xxxLarge":"xxxLarge","AX1":"AX1","AX2":"AX2","AX3":"AX3","AX4":"AX4","AX5":"AX5"}
style_map = {"Large Title":"largeTitle","Title 1":"title1","Title 2":"title2","Title 3":"title3","Headline":"headline","Body":"body","Callout":"callout","Subhead":"subheadline","Subheadline":"subheadline","Footnote":"footnote","Caption 1":"caption1","Caption 2":"caption2"}
weight_map = {"Regular":400,"Medium":500,"Semibold":600,"Bold":700,"Heavy":800,"Black":900}

tracking_out = {}
for h, rows in t_tables:
    ch = h.split(" > ")[-1].strip()
    if ch in ("SF Pro", "SF Pro Rounded", "New York", "macOS tracking values") and rows and "Size" in rows[0][0]:
        key = {"SF Pro":"sfProIOS", "SF Pro Rounded":"sfProRounded", "New York":"newYorkIOS", "macOS tracking values":"sfProMacOS"}[ch]
        tbl = {}
        for r in rows[1:]:
            sz = r[0].strip()
            em_k = int(r[1].replace("+","").replace("\u2212","-").strip())
            pt_v = float(r[2].replace("+","").replace("\u2212","-").strip())
            tbl[sz] = tok({"1000em": em_k, "em": round(em_k/1000, 4), "pt": pt_v}, "1/1000 em & pt", f"Apple HIG Typography ({ch})", "Official", "iOS / macOS", URL_TYPO)
        tracking_out[key] = tbl

ios_dt_out = {}
for h, rows in t_tables:
    ch = h.split(" > ")[-1].strip()
    if ch in dt_map and len(rows) == 12 and rows[0][0] == "Style":
        pkey = dt_map[ch]
        ios_dt_out[pkey] = {}
        for r in rows[1:]:
            sn = style_map[r[0].strip()]
            sz = float(r[2].strip()); lh = float(r[3].strip())
            w = weight_map[r[1].strip()]; ew = weight_map[r[4].strip()]
            # Exact tracking from Official HIG sfProIOS
            tr_entry = tracking_out["sfProIOS"].get(str(int(sz)))
            tr_em = tr_entry["$value"]["em"] if tr_entry else 0.0
            ios_dt_out[pkey][sn] = tok(
                {"size": sz, "lineHeight": lh, "weight": w, "emphasizedWeight": ew, "trackingEm": tr_em},
                "pt / CSS weight / em", "Apple HIG Typography Dynamic Type + Tracking table", "Official", "iOS / iPadOS", URL_TYPO
            )

mac_styles_out = {}
for h, rows in t_tables:
    if "macOS built-in text styles" in h:
        for r in rows[1:]:
            sn = style_map[r[0].strip()]
            sz = float(r[2].strip()); lh = float(r[3].strip())
            w = weight_map[r[1].strip()]; ew = weight_map[r[4].strip()]
            tr_entry = tracking_out["sfProMacOS"].get(str(int(sz)))
            tr_em = tr_entry["$value"]["em"] if tr_entry else 0.0
            mac_styles_out[sn] = tok(
                {"size": sz, "lineHeight": lh, "weight": w, "emphasizedWeight": ew, "trackingEm": tr_em},
                "pt / CSS weight / em", "Apple HIG Typography macOS built-in text styles", "Official", "macOS", URL_TYPO,
                "Note: macOS 27 Sketch kit has Caption1 emW=600, Caption2 w=400, Headline emW=900; HIG says 500, 500, 800."
            )

typo_research = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_TYPO, URL_A11Y, URL_IOS_KIT, URL_MAC_KIT]},
    "defaults": {
        "iosDefaultBody": tok(17, "pt", "Apple HIG Typography & Accessibility", "Official", "iOS / iPadOS", URL_TYPO),
        "iosMinimumSize": tok(11, "pt", "Apple HIG Typography & Accessibility", "Official", "iOS / iPadOS", URL_TYPO),
        "macosDefaultBody": tok(13, "pt", "Apple HIG Typography & Accessibility", "Official", "macOS", URL_TYPO),
        "macosMinimumSize": tok(10, "pt", "Apple HIG Typography & Accessibility", "Official", "macOS", URL_TYPO),
        "opticalBoundaryTextToDisplay": tok(20, "pt", "Apple SF Pro optical size boundary (Text <=19pt, Display >=20pt)", "Official", "iOS / macOS", URL_TYPO),
    },
    "nonLatinRules": {
        "banglaSystemFont": tok("Kohinoor Bangla", "fontFamily", "Apple iOS/macOS bundled Bengali system font", "Platform-dependent", "iOS / macOS", URL_TYPO, "Web fallback: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif"),
        "banglaTracking": tok(0, "em", "Indic/matra shaping requires zero letter-spacing (never apply -0.026em)", "Inferred", "All", "https://developer.apple.com/fonts/"),
        "banglaExpansionBudget": tok("20-30%", "percent width", "Typical Bangla UI string length vs English", "Estimated", "All", "https://developer.apple.com/design/human-interface-guidelines/localization"),
        "arabicSystemFont": tok("SF Arabic", "fontFamily", "Apple SF Arabic system typeface", "Official", "iOS / macOS", "https://developer.apple.com/fonts/"),
        "arabicTracking": tok(0, "em", "Cursive Arabic joining breaks under non-zero letter-spacing", "Official", "All", "https://www.w3.org/TR/alreq/"),
    },
    "iosDynamicType": ios_dt_out,
    "macosTextStyles": mac_styles_out,
    "trackingTables": tracking_out,
}
save("typography.json", typo_research)

# ==============================================================================
# 3. layout.json
# ==============================================================================
layout_research = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_LAY, URL_A11Y, "https://screens.guide", "https://useyourloaf.com"]},
    "hitTargets": {
        "iosDefault": tok(44, "pt", "Apple HIG Accessibility (44x44 pt)", "Official", "iOS / iPadOS", URL_A11Y),
        "iosMinimum": tok(28, "pt", "Apple HIG Accessibility (28x28 pt minimum)", "Official", "iOS / iPadOS", URL_A11Y),
        "macosDefault": tok(28, "pt", "Apple HIG Accessibility (28x28 pt)", "Official", "macOS", URL_A11Y),
        "macosMinimum": tok(20, "pt", "Apple HIG Accessibility (20x20 pt minimum)", "Official", "macOS", URL_A11Y),
        "paddedTargetWithBezel": tok(12, "pt", "Apple HIG Accessibility (~12pt padding around bezeled controls)", "Official", "All", URL_A11Y),
        "paddedTargetWithoutBezel": tok(24, "pt", "Apple HIG Accessibility (~24pt padding around bezel-less controls)", "Official", "All", URL_A11Y),
    },
    "spacing": {
        "baseGrid": tok(4, "pt", "Plugin 4pt base rhythm", "Inferred", "All", URL_LAY),
        "scale": tok([0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64], "pt", "Plugin spacing scale", "Estimated", "All", URL_LAY),
        "iosMarginCompact": tok(16, "pt", "Apple standard iOS compact margin (matches widget 16pt HIG)", "Inferred", "iOS", URL_WID),
        "iosMarginRegular": tok(20, "pt", "Apple standard regular-width margin", "Estimated", "iOS / iPadOS", URL_LAY),
        "macosContentPadding": tok(20, "pt", "Standard macOS content margin", "Estimated", "macOS", URL_LAY),
        "readableContentMaxWidth": tok(672, "pt", "UIKit readableContentGuide typical max measure", "Measured", "iPadOS / Web", URL_LAY, confidence="med"),
    },
    "devicesAndSafeAreas": {
        "iPhoneSE3": tok({"width":375,"height":667,"scale":2,"safeTop":20,"safeBottom":0}, "pt", "Apple iOS device specs", "Measured", "iOS", "https://useyourloaf.com/blog/iphone-screen-resolutions/"),
        "iPhone15_16": tok({"width":393,"height":852,"scale":3,"safeTop":59,"safeBottom":34}, "pt", "iPhone 15 / 16 / 16 Pro specs", "Measured", "iOS", "https://screens.guide/"),
        "iPhone17_17Pro": tok({"width":402,"height":874,"scale":3,"safeTop":62,"safeBottom":34}, "pt", "iPhone 17 / 17 Pro 6.3-inch specs", "Measured", "iOS 26/27", "https://screens.guide/"),
        "iPhone17ProMax": tok({"width":440,"height":956,"scale":3,"safeTop":62,"safeBottom":34}, "pt", "iPhone 17 Pro Max 6.9-inch specs", "Measured", "iOS 26/27", "https://screens.guide/"),
        "iPadPro11": tok({"width":834,"height":1194,"scale":2,"safeTop":24,"safeBottom":20}, "pt", "iPad Pro 11-inch M4/M5", "Measured", "iPadOS", "https://useyourloaf.com/"),
        "iPadPro13": tok({"width":1024,"height":1366,"scale":2,"safeTop":24,"safeBottom":20}, "pt", "iPad Pro 13-inch M4/M5", "Measured", "iPadOS", "https://useyourloaf.com/"),
    },
    "sizeClassBreakpoints": {
        "compactMax": tok(767, "pt", "Adaptive compact width (<768pt)", "Inferred", "iOS / Web / Flutter", URL_LAY),
        "regularMin": tok(768, "pt", "Adaptive regular/iPad width (>=768pt)", "Inferred", "iPadOS / Web / Flutter", URL_LAY),
        "desktopMin": tok(1180, "pt", "Adaptive macOS desktop width with fine pointer", "Estimated", "macOS / Web / Flutter", URL_LAY),
    },
    "macosMetrics": {
        "windowMinWidth": tok(480, "pt", "Plugin macOS window min width", "Estimated", "macOS", URL_LAY),
        "windowMinHeight": tok(320, "pt", "Plugin macOS window min height", "Estimated", "macOS", URL_LAY),
        "toolbarHeight": tok(52, "pt", "macOS unified toolbar height", "Estimated", "macOS 26/27", URL_TOOL),
        "sidebarDefaultWidth": tok(220, "pt", "macOS sidebar default width (180..320)", "Estimated", "macOS 26/27", URL_SIDE),
        "inspectorDefaultWidth": tok(280, "pt", "macOS inspector default width (240..320)", "Estimated", "macOS 26/27", URL_LAY),
    },
    "liveActivities": {
        "lockScreenMargin": tok(14, "pt", "Apple HIG Live Activities standard Lock Screen margin", "Official", "iOS", URL_LIVE),
    },
    "widgets": {
        "standardMargin": tok(16, "pt", "Apple HIG Widgets standard margin", "Official", "iOS / macOS", URL_WID),
        "minimumFontSize": tok(11, "pt", "Apple HIG Widgets minimum text size", "Official", "iOS / macOS", URL_WID),
    }
}
save("layout.json", layout_research)

# ==============================================================================
# 4. shape.json
# ==============================================================================
shape_research = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_CONC, URL_SHP_CON, URL_APPICON, "https://kylebashour.com/posts/finding-the-real-iphone-x-corner-radius"]},
    "continuousCorner": {
        "figmaSmoothing": tok(0.6, "ratio", "Figma 60% corner smoothing matching Apple continuous corner", "Measured", "All", "https://www.figma.com/blog/desperately-seeking-squircles/"),
        "superellipseApproxN": tok(5, "exponent", "Quintic superellipse approximation of Apple icon curve (vs quartic n=4)", "Inferred", "All", "https://grida.co/"),
        "cssCornerShape": tok("squircle", "CSS keyword (superellipse(2))", "Chromium 139+, Safari 18.4+, Firefox 148+ (check caniuse)", "Official", "Web", URL_SHP_CON, "Note: superellipse(2) differs slightly from Apple n~5 smoothing 0.6"),
        "appIconRadiusRatio": tok(22.37, "percent of icon size", "iOS/macOS squircle icon mask ratio", "Inferred", "iOS / macOS", URL_APPICON, "In iOS 26/27, submit unmasked 1024x1024 square layers; OS applies mask"),
    },
    "concentricRule": {
        "formula": tok("innerRadius = max(outerRadius - padding, minimumInner)", "pt", "SwiftUI ConcentricRectangle behavior", "Official", "iOS 26+ / macOS 26+", URL_CONC),
        "minimumInner": tok(4, "pt", "Plugin minimum inner corner radius", "Estimated", "All", URL_CONC),
    },
    "deviceDisplayCornerRadii": {
        "iPhone16Pro_17Pro": tok(62, "pt", "Hardware display corner radius (~55-62pt depending on model/sampling; 16 Pro/17 Pro reported 62pt)", "Measured", "iOS", "https://github.com/kylebshr/ScreenCorners", "Plugin previously had 55pt for iPhone 17 Pro and 62pt for Air; confirm on physical hardware"),
        "iPhone15_16": tok(55, "pt", "ScreenCorners / UIScreen._displayCornerRadius", "Measured", "iOS", "https://github.com/kylebshr/ScreenCorners"),
        "iPhoneSE3": tok(0, "pt", "Rectangular display", "Official", "iOS", "https://developer.apple.com/"),
        "iPadPro_M4_M5": tok(18, "pt", "iPad Pro Liquid Retina / Tandem OLED display corner radius", "Measured", "iPadOS", "https://github.com/kylebshr/ScreenCorners", "Plugin previously had 30pt; measured community value is 18pt"),
    },
    "componentRadii": {
        "iosSheetFloating": tok(38, "pt", "Floating medium sheet corner radius", "Estimated", "iOS 26/27", URL_SHEET),
        "iosAlert": tok(34, "pt", "iOS 26/27 alert corner radius", "Estimated", "iOS 26/27", URL_LAY),
        "iosPopoverMenu": tok(26, "pt", "iOS popover / menu corner radius", "Estimated", "iOS 26/27", URL_LAY),
        "iosInsetGroupedSection": tok(26, "pt", "iOS 26/27 insetGrouped section radius", "Estimated", "iOS 26/27", URL_LAY),
        "iosCard": tok(22, "pt", "iOS card radius", "Estimated", "iOS 26/27", URL_LAY),
        "iosSettingsIcon": tok(7, "pt", "29pt settings icon squircle radius", "Estimated", "iOS", URL_LAY),
        "macosWindow": tok(12, "pt", "macOS 27 uniform window radius report (Tahoe 26 varied 16-26pt)", "Estimated", "macOS 27", "https://www.macrumors.com/", "Secondary press report; Apple HIG does not publish exact px"),
        "macosAlertPopover": tok(16, "pt", "macOS alert / popover radius", "Estimated", "macOS 26/27", URL_LAY),
        "macosMenu": tok(12, "pt", "macOS menu corner radius", "Estimated", "macOS 26/27", URL_LAY),
        "macosCheckbox": tok(4, "pt", "macOS checkbox corner radius", "Estimated", "macOS", URL_LAY),
    }
}
save("shape.json", shape_research)

# ==============================================================================
# 5. liquid-glass.json
# ==============================================================================
lg_research = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_MAT, URL_ALG, URL_IOS_KIT, URL_MAC_KIT, "https://developer.apple.com/documentation/swiftui/glass"]},
    "officialSpec": {
        "variants": tok(["regular", "clear", "identity"], "enum", "SwiftUI Glass type properties (plus .tint() & .interactive())", "Official", "iOS 26+ / macOS 26+", "https://developer.apple.com/documentation/swiftui/glass"),
        "clearDimmingLayer": tok("#000000@0.35", "sRGB hex/alpha", "Apple HIG Materials: 35% dark dimming layer behind clear glass over bright media", "Official", "iOS 26+ / macOS 26+", URL_MAT),
        "scrollEdgeStyles": tok(["automatic", "soft", "hard"], "enum", "SwiftUI ScrollEdgeEffectStyle", "Official", "iOS 26+ / macOS 26+", "https://developer.apple.com/documentation/swiftui/view/scrolledgeeffectstyle(_:for:)"),
        "tabBarMinimizeBehavior": tok(["automatic", "onScrollDown", "onScrollUp", "never"], "enum", "SwiftUI TabBarMinimizeBehavior", "Official", "iOS 26+", "https://developer.apple.com/documentation/swiftui/view/tabbarminimizebehavior(_:)"),
        "uiKitClass": tok("UIGlassEffect", "class", "UIKit Liquid Glass visual effect", "Official", "iOS 26+", "https://developer.apple.com/documentation/uikit/uiglasseffect"),
        "appKitClass": tok("NSGlassEffectView", "class", "AppKit Liquid Glass view (styles Regular=0, Clear=1)", "Official", "macOS 26+", "https://developer.apple.com/documentation/appkit/nsglasseffectview"),
        "ios27IntensitySlider": tok("0.0 (clear) to 1.0 (tinted/opaque)", "normalized range", "WWDC 2026 / iOS 27 & macOS 27 system Liquid Glass appearance slider", "Inferred", "iOS 27 / macOS 27", "https://www.macrumors.com/", "Secondary press confirmed slider between clear and tinted/more opaque; exact SwiftUI API value range unverified on Windows", "med"),
    },
    "kitRawStacks": {
        "iosRegularLargeLight0": tok(fmt_col(ios_kit["Liquid Glass"]["Light"]["Regular - Large"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "iOS 27 Sketch Kit (Regular - Large fills[0])", "Measured", "iOS 27", URL_IOS_KIT),
        "iosRegularLargeLight1": tok(fmt_col(ios_kit["Liquid Glass"]["Light"]["Regular - Large"]["fills"]["1"]["$value"]), "sRGB hex/alpha", "iOS 27 Sketch Kit (Regular - Large fills[1])", "Measured", "iOS 27", URL_IOS_KIT),
        "macosMenuLightFill": tok(fmt_col(mac_kit["Liquid Glass"]["Light"]["Menus"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        "macosMenuDarkFill": tok(fmt_col(mac_kit["Liquid Glass"]["Dark"]["Menus"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
    },
    "approximations": {
        "regularLight": tok(plug_mat["liquidGlass"]["tuned"]["regular"]["light"], "CSS recipe", "Tuned CSS backdrop approximation of iOS 27 kit", "Estimated", "Web / Flutter", URL_MAT),
        "regularDark": tok(plug_mat["liquidGlass"]["tuned"]["regular"]["dark"], "CSS recipe", "Tuned CSS backdrop approximation of iOS 27 kit", "Estimated", "Web / Flutter", URL_MAT),
        "clearLight": tok(plug_mat["liquidGlass"]["tuned"]["clear"]["light"], "CSS recipe", "Tuned CSS clear variant", "Estimated", "Web / Flutter", URL_MAT),
        "clearDark": tok(plug_mat["liquidGlass"]["tuned"]["clear"]["dark"], "CSS recipe", "Tuned CSS clear variant", "Estimated", "Web / Flutter", URL_MAT),
        "largeLight": tok(plug_mat["liquidGlass"]["tuned"]["large"]["light"], "CSS recipe", "Sidebars, alerts, popovers, medium sheets", "Estimated", "Web / Flutter", URL_MAT),
        "largeDark": tok(plug_mat["liquidGlass"]["tuned"]["large"]["dark"], "CSS recipe", "Sidebars, alerts, popovers, medium sheets", "Estimated", "Web / Flutter", URL_MAT),
        "fallbackOpaqueLight": tok("#F6F6F6", "sRGB hex", "Reduce Transparency / Increase Contrast opaque fallback", "Estimated", "Web / Flutter", URL_MAT),
        "fallbackOpaqueDark": tok("#262626", "sRGB hex", "Reduce Transparency / Increase Contrast opaque fallback", "Estimated", "Web / Flutter", URL_MAT),
        "simultaneousBackdropLimit": tok(6, "elements/screen", "Practical GPU overdraw guardrail for CSS/Flutter BackdropFilter", "Estimated", "Web / Flutter", "https://docs.flutter.dev/perf/rendering-performance"),
    }
}
save("liquid-glass.json", lg_research)

# ==============================================================================
# 6. motion.json
# ==============================================================================
def spring_calc(d, b):
    k = round((2 * math.pi / d) ** 2, 3)
    c = round((4 * math.pi * (1 - b)) / d if b >= 0 else (4 * math.pi) / (d * (1 + b)), 3)
    return {"duration": d, "bounce": b, "stiffness": k, "damping": c, "mass": 1.0}

motion_research = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_SPR, "https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate", "https://developer.apple.com/design/human-interface-guidelines/motion"]},
    "springs": {
        "default": tok(spring_calc(0.55, 0.0), "s / bounce / N/m / N·s/m", "SwiftUI Spring.default / WWDC23", "Official", "iOS / macOS", URL_SPR),
        "smooth": tok(spring_calc(0.5, 0.0), "s / bounce / N/m / N/s/m", "SwiftUI Spring.smooth", "Official", "iOS / macOS", URL_SPR),
        "snappy": tok(spring_calc(0.5, 0.15), "s / bounce / N/m / N/s/m", "SwiftUI Spring.snappy", "Official", "iOS / macOS", URL_SPR),
        "bouncy": tok(spring_calc(0.5, 0.3), "s / bounce / N/m / N/s/m", "SwiftUI Spring.bouncy (verified against Apple Spring doc example: mass 1, stiffness 157.9, damping 17.6)", "Official", "iOS / macOS", URL_SPR),
        "interactive": tok(spring_calc(0.15, 0.0), "s / bounce / N/m / N/s/m", "Gesture finger tracking", "Estimated", "iOS / macOS", URL_SPR),
        "press": tok(spring_calc(0.2, 0.0), "s / bounce / N/m / N/s/m", "Press down spring", "Estimated", "iOS / macOS", URL_SPR),
        "release": tok(spring_calc(0.35, 0.15), "s / bounce / N/m / N/s/m", "Press release settle", "Estimated", "iOS / macOS", URL_SPR),
        "popover": tok(spring_calc(0.35, 0.1), "s / bounce / N/m / N/s/m", "Menu / popover / alert entry", "Estimated", "iOS / macOS", URL_SPR),
        "glassMorph": tok(spring_calc(0.45, 0.2), "s / bounce / N/m / N/s/m", "Liquid Glass merge/split morph", "Estimated", "iOS 26+ / macOS 26+", URL_ALG),
    },
    "scrollAndPhysics": {
        "decelerationRateNormal": tok(0.998, "per ms multiplier", "UIScrollView.DecelerationRate.normal", "Official", "iOS / iPadOS", "https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate"),
        "decelerationRateFast": tok(0.99, "per ms multiplier", "UIScrollView.DecelerationRate.fast", "Official", "iOS / iPadOS", "https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate"),
        "rubberBandConstantC": tok(0.55, "coefficient", "Reverse-engineered UIScrollView overscroll constant", "Measured", "iOS", "https://twitter.com/chpwn/status/285540192096497664", confidence="high"),
    },
    "transitions": {
        "navPushOutgoingParallax": tok(0.30, "viewport ratio", "Standard UINavigationController outgoing shift 30% trailing->leading", "Measured", "iOS", "https://developer.apple.com/documentation/uikit/uinavigationcontroller"),
        "sheetDismissVelocity": tok(600, "pt/s", "Sheet fling dismiss threshold", "Estimated", "iOS", URL_SHEET),
        "sheetDismissDistance": tok(0.40, "sheet height ratio", "Sheet drag distance threshold", "Estimated", "iOS", URL_SHEET),
        "glassPressTouchScale": tok(1.10, "scale", "HIG Motion: Liquid Glass responds with greater emphasis on touch (~1.08-1.12)", "Inferred", "iOS 26+", "https://developer.apple.com/design/human-interface-guidelines/motion"),
        "glassPressPointerScale": tok(1.02, "scale", "HIG Motion: subdued effect on trackpad/mouse", "Inferred", "iPadOS / macOS", "https://developer.apple.com/design/human-interface-guidelines/motion"),
        "reducedMotionCrossfade": tok(200, "ms", "HIG Accessibility Reduce Motion: replace x/y/z movement with fade", "Inferred", "All", URL_A11Y),
    }
}
save("motion.json", motion_research)

# ==============================================================================
# 7. components-ios.json
# ==============================================================================
comp_ios = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_BTN, URL_TAB, URL_SHEET, URL_TOOL, URL_LAY, URL_A11Y]},
    "button": {
        "minHitTarget": tok(44, "pt", "Apple HIG Buttons & Accessibility", "Official", "iOS / iPadOS", URL_BTN),
        "heights": tok({"mini":28,"small":32,"medium":36,"large":50,"extraLarge":56}, "pt", "Plugin iOS 26/27 estimate (HIG documents 28/32/44/52/64 for visionOS)", "Estimated", "iOS 26/27", URL_BTN),
        "maxProminentPerView": tok("1-2", "count", "Apple HIG Buttons: keep prominent buttons to one or two per view", "Official", "All", URL_BTN),
    },
    "navBar": {
        "barHeight": tok(44, "pt", "Classic UIKit UINavigationBar compact portrait height", "Measured", "iOS", URL_TOOL),
        "largeTitleExtraHeight": tok(52, "pt", "UIKit large title extension height", "Estimated", "iOS", URL_TOOL),
    },
    "tabBar": {
        "floatingCapsuleHeight": tok(62, "pt", "iOS 26/27 floating glass tab bar estimate", "Estimated", "iOS 26/27", URL_TAB),
        "sideInset": tok(20, "pt", "Floating capsule horizontal inset", "Estimated", "iOS 26/27", URL_TAB),
        "maxVisibleTabsPhone": tok(5, "tabs", "Apple HIG Tab bars (aim for 5 or fewer before More tab)", "Official", "iOS", URL_TAB),
        "minimizeBehavior": tok("onScrollDown", "enum", "SwiftUI TabBarMinimizeBehavior", "Official", "iOS 26+", URL_TAB),
    },
    "sheet": {
        "detents": tok(["medium (~50%)", "large (100%)"], "detents", "Apple HIG Sheets", "Official", "iOS / iPadOS", URL_SHEET),
        "grabberSize": tok({"width":36,"height":5,"topInset":5}, "pt", "Standard UIKit sheet grabber", "Estimated", "iOS", URL_SHEET),
        "floatingRadiusMedium": tok(38, "pt", "iOS 26/27 floating medium sheet radius", "Estimated", "iOS 26/27", URL_SHEET),
    },
    "listRow": {
        "minHeight": tok(52, "pt", "iOS 26/27 spacious insetGrouped row", "Estimated", "iOS 26/27", URL_LAY),
        "minHeightCompact": tok(44, "pt", "Minimum accessible row height", "Official", "iOS", URL_A11Y),
        "settingsIcon": tok({"size":29,"radius":7}, "pt", "iOS Settings icon squircle", "Estimated", "iOS", URL_LAY),
    },
    "toggle": {
        "ios26TrackSize": tok({"width":64,"height":28,"knobWidth":38,"knobHeight":24}, "pt", "iOS 26/27 pill-knob Liquid Glass switch", "Estimated", "iOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/toggles"),
        "legacyTrackSize": tok({"width":51,"height":31}, "pt", "Pre-iOS 26 UISwitch native intrinsicContentSize", "Measured", "iOS <=18", "https://developer.apple.com/documentation/uikit/uiswitch"),
    },
    "alert": {
        "width": tok(300, "pt", "iOS 26/27 alert width", "Estimated", "iOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/alerts"),
        "radius": tok(34, "pt", "iOS 26/27 alert corner radius", "Estimated", "iOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/alerts"),
        "buttonHeight": tok(48, "pt", "iOS 26/27 glass capsule alert button height", "Estimated", "iOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/alerts"),
    }
}
save("components-ios.json", comp_ios)

# ==============================================================================
# 8. components-macos.json
# ==============================================================================
comp_mac = {
    "$meta": {"generated": "2026-11-25", "sources": [URL_MAC_KIT, URL_TOOL, URL_SIDE, URL_BTN, "https://developer.apple.com/design/human-interface-guidelines/windows"]},
    "window": {
        "minSize": tok({"width":480,"height":320}, "pt", "Plugin macOS window min size", "Estimated", "macOS", "https://developer.apple.com/design/human-interface-guidelines/windows"),
        "uniformCornerRadius": tok(12, "pt", "macOS 27 uniform window corner radius report", "Estimated", "macOS 27", "https://www.macrumors.com/"),
        "toolbarHeight": tok(52, "pt", "Unified toolbar height", "Estimated", "macOS 26/27", URL_TOOL),
        "trafficLights": tok({"diameter":14,"gap":9,"leadingInset":16,"centerY":26}, "pt", "Traffic light button geometry", "Estimated", "macOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/windows"),
    },
    "sidebar": {
        "edgeToEdge": tok(True, "boolean", "macOS 27 sidebar style + HIG backgroundExtensionEffect", "Inferred", "macOS 27", URL_SIDE),
        "coloredIconsDefault": tok(True, "boolean", "HIG Sidebars (June 8, 2026): sidebar icons use app/system accent color by default", "Official", "macOS 27", URL_SIDE),
        "defaultWidth": tok(220, "pt", "Default sidebar width (range 180-320)", "Estimated", "macOS", URL_SIDE),
        "rowHeight": tok(32, "pt", "Medium sidebar row height", "Estimated", "macOS", URL_SIDE),
    },
    "controls": {
        "sizes": tok({"mini":16,"small":20,"regular":24,"large":28,"extraLarge":36}, "pt", "macOS ControlSize heights", "Estimated", "macOS 26/27", URL_BTN),
        "borderedFillLight": tok(fmt_col(mac_kit["Content Area"]["Light"]["01 - Bordered"]["01 - Idle"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        "switchSize": tok({"width":38,"height":22}, "pt", "macOS regular switch", "Estimated", "macOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/toggles"),
        "inputBorderLight": tok(fmt_col(mac_kit["Content Area"]["Light"]["Input Fields"]["01 - Idle"]["borders"]["0"]["$value"]["color"]), "sRGB hex/alpha", "macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
    },
    "menu": {
        "itemHeight": tok(24, "pt", "macOS menu item height", "Estimated", "macOS 26/27", "https://developer.apple.com/design/human-interface-guidelines/menus"),
        "glassFillLight": tok(fmt_col(mac_kit["Liquid Glass"]["Light"]["Menus"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
        "glassFillDark": tok(fmt_col(mac_kit["Liquid Glass"]["Dark"]["Menus"]["fills"]["0"]["$value"]), "sRGB hex/alpha", "macOS 27 Sketch Kit", "Measured", "macOS 27", URL_MAC_KIT),
    },
    "tooltip": {
        "hoverDelayMs": tok(1000, "ms", "Standard macOS tooltip hover delay (~1s)", "Estimated", "macOS", URL_BTN),
    },
    "settingsWindow": {
        "width": tok(715, "pt", "macOS System Settings / standard settings pane width", "Estimated", "macOS", "https://developer.apple.com/design/human-interface-guidelines/settings"),
    }
}
save("components-macos.json", comp_mac)

#!/usr/bin/env python3
"""
Phase 1 Token Merge:
Update all 9 tokens/*.json files in D:/Claude-Plugins/cupertino-forge/tokens/
while strictly enforcing Additional Rules #1-#4:
- Rule 1: Keep official/kit values; store community alternatives under $alt ($class: inferred/community).
- Rule 2: Only Apple Sketch kit values remain 'measured'; community metrics are 'inferred'.
- Rule 3: Estimates remain $source: 'estimated' / $class: 'estimated'.
- Rule 4: Keep macOS Headline/Caption1/Caption2 weights from HIG; store kit conflict in $kitConflict + needs-device-verification.
"""
import json, pathlib

TOK = pathlib.Path(r"d:\Claude-Plugins\cupertino-forge\tokens")
URL_IOS_KIT = "tokens/source/apple-ios-27-ui-kit.tokens.json"
URL_MAC_KIT = "tokens/source/apple-macos-27-ui-kit.tokens.json"
URL_BOTH_KITS = "tokens/source/apple-ios-27-ui-kit.tokens.json & apple-macos-27-ui-kit.tokens.json"
URL_COLOR = "https://developer.apple.com/design/human-interface-guidelines/color"
URL_TYPO = "https://developer.apple.com/design/human-interface-guidelines/typography"
URL_LAY = "https://developer.apple.com/design/human-interface-guidelines/layout"
URL_A11Y = "https://developer.apple.com/design/human-interface-guidelines/accessibility"
URL_MAT = "https://developer.apple.com/design/human-interface-guidelines/materials"
URL_SHP_CON = "https://developer.apple.com/documentation/swiftui/concentricrectangle"
URL_SPR = "https://developer.apple.com/documentation/swiftui/spring"
URL_HAP = "https://developer.apple.com/design/human-interface-guidelines/playing-haptics"
URL_ICN = "https://developer.apple.com/design/human-interface-guidelines/sf-symbols"

def load(name):
    return json.loads((TOK / name).read_text(encoding="utf-8"))

def save(name, obj):
    (TOK / name).write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

def tag(d, src, cls, url, plat="All"):
    d["$source"] = src
    d["$class"] = cls
    d["$url"] = url
    d["$platform"] = plat

# ------------------------------------------------------------------
# 1. color.json
# ------------------------------------------------------------------
col = load("color.json")
col["$meta"]["reconciledDate"] = "2026-11-25"
col["$meta"]["sources"]["hig"] = "Apple HIG Color & Accessibility (HC image swatches in HIG JSON -> inferred)"
tag(col["system"], "Apple iOS 27 & macOS 27 Sketch Kits (HC from HIG swatches)", "measured", URL_BOTH_KITS, "iOS 27 / macOS 27")
col["system"]["$hcClass"] = "inferred"
tag(col["systemVibrantMacOS"], "Apple macOS 27 Sketch Kit", "measured", URL_MAC_KIT, "macOS 27")
tag(col["grayIOS"], "Apple iOS 27 Sketch Kit (HC from HIG swatches)", "measured", URL_IOS_KIT, "iOS 27")
col["grayIOS"]["$hcClass"] = "inferred"
tag(col["grayMacOS"], "Apple macOS 27 Sketch Kit", "measured", URL_MAC_KIT, "macOS 27")
for k in ["labelIOS", "labelVibrantIOS", "labelOnGlassIOS", "fillIOS", "fillVibrantIOS", "backgroundIOS", "separatorIOS"]:
    tag(col[k], "Apple iOS 27 Sketch Kit", "measured", URL_IOS_KIT, "iOS 27")
for k in ["labelMacOS", "labelVibrantMacOS", "fillMacOS", "fillVibrantMacOS", "macOSControlFills"]:
    tag(col[k], "Apple macOS 27 Sketch Kit", "measured", URL_MAC_KIT, "macOS 27")

ms = col["macOSSurfaces"]
tag(ms, "Apple macOS 27 Sketch Kit (separator.dark & grouped surfaces estimated)", "measured", URL_MAC_KIT, "macOS 27")
ms["$darkSeparatorClass"] = "estimated"
# Move previously hardcoded build-tokens.mjs colors into tokens/color.json cleanly
ms["bg2"] = {"light": "#F5F5F7", "dark": "#262626", "$source": "estimated", "$class": "estimated", "$platform": "macOS 27", "$url": URL_COLOR}
ms["bg3"] = {"light": "#FFFFFF", "dark": "#2E2E2E", "$source": "estimated", "$class": "estimated", "$platform": "macOS 27", "$url": URL_COLOR}
ms["bgGrouped"] = {"light": "#F5F5F7", "dark": "#1E1E1E", "$source": "estimated", "$class": "estimated", "$platform": "macOS 27", "$url": URL_COLOR}
ms["bgGrouped2"] = {"light": "#FFFFFF", "dark": "#262626", "$source": "estimated", "$class": "estimated", "$platform": "macOS 27", "$url": URL_COLOR}
ms["bgGrouped3"] = {"light": "#F5F5F7", "dark": "#2E2E2E", "$source": "estimated", "$class": "estimated", "$platform": "macOS 27", "$url": URL_COLOR}
ms["separatorOpaque"] = {"light": "#D8D8D8", "dark": "#3A3A3A", "$source": "estimated", "$class": "estimated", "$platform": "macOS 27", "$url": URL_COLOR}
col["iosFieldBorder"] = {"light": "#000000@0", "dark": "#000000@0", "$source": "estimated", "$class": "estimated", "$platform": "iOS 27", "$url": URL_COLOR}

col["highContrastLabels"] = {
    "$source": "estimated",
    "$class": "estimated",
    "$platform": "iOS 27 / macOS 27",
    "$url": URL_A11Y,
    "label2": {"light": "#3C3C43@0.8", "dark": "#EBEBF5@0.8"},
    "label3": {"light": "#3C3C43@0.6", "dark": "#EBEBF5@0.6"},
    "glassBorder": {"light": "#000000@0.35", "dark": "#FFFFFF@0.35"},
    "accentContrast": "#FFFFFF"
}

tag(col["focusRing"], "Apple macOS 27 Sketch Kit (Global.Focus Ring: 3.5px@0.25 outer, 1px@0.15 inner)", "measured", URL_MAC_KIT, "macOS 27 / Web")
tag(col["selection"], "Apple macOS 27 Sketch Kit + estimated unemphasized background", "estimated", URL_MAC_KIT, "macOS 27")
col["dimming"] = {
    "$source": "Apple HIG Materials (clear glass dimming) + estimated sheet scrim",
    "$class": "official",
    "$url": URL_MAT,
    "$platform": "All",
    "clearGlassOverBrightContent": "#000000@0.35",
    "sheetScrim": {"light": "#000000@0.2", "dark": "#000000@0.48", "$source": "estimated", "$class": "estimated", "$platform": "iOS", "$url": "https://developer.apple.com/design/human-interface-guidelines/sheets"}
}
tag(col["accent"], "Apple HIG System Blue & Accessibility 4.5:1 / 3:1", "official", URL_A11Y, "All")
save("color.json", col)

# ------------------------------------------------------------------
# 2. typography.json (Rule #4: Keep HIG weights; record Sketch kit conflict)
# ------------------------------------------------------------------
typ = load("typography.json")
typ["$meta"]["reconciledDate"] = "2026-11-25"
tag(typ["fontStacks"], "Apple System Fonts + OFL cross-platform stacks", "platform-dependent", "https://developer.apple.com/fonts/", "All")
tag(typ["fallbackCompensation"], "estimated Inter width compensation", "estimated", URL_TYPO, "Web / Non-Apple OS")
tag(typ["iosDynamicType"], "Apple HIG Typography Dynamic Type tables (verified 0 diffs across 132 cells)", "official", URL_TYPO, "iOS / iPadOS")
tag(typ["macosTextStyles"], "Apple HIG Typography macOS built-in text styles", "official", URL_TYPO, "macOS")
typ["macosTextStyles"]["$kitConflict"] = {
    "$status": "needs-device-verification",
    "$source": "Apple macOS 27 Sketch Kit vs Apple HIG Typography",
    "$class": "measured",
    "$url": URL_TYPO,
    "headline": {"higEmphasizedWeight": 800, "kitEmphasizedWeight": 900},
    "caption1": {"higEmphasizedWeight": 500, "kitEmphasizedWeight": 600},
    "caption2": {"higWeight": 500, "kitWeight": 400}
}
tag(typ["trackingTables"], "Apple HIG Typography tracking tables (verified 0 diffs across 64+64+64 rows)", "official", URL_TYPO, "iOS / macOS")
typ["nonLatin"] = {
    "$source": "Apple System Fonts + HIG RTL + W3C ALReq",
    "$class": "inferred",
    "$url": "https://developer.apple.com/design/human-interface-guidelines/right-to-left",
    "$platform": "All",
    "banglaSystemFont": "Kohinoor Bangla",
    "arabicSystemFont": "SF Arabic",
    "disableTrackingLangs": ["bn", "ar", "he"],
    "trackingOverrideEm": 0,
    "banglaLineHeightScale": {"min": 1.35, "max": 1.5, "$source": "estimated", "$class": "estimated"},
    "banglaExpansionPercent": {"min": 20, "max": 30, "$source": "estimated", "$class": "estimated"},
    "rtlAllCapsBalanceDeltaPt": {"value": 2, "$source": "Apple HIG Right to left", "$class": "official", "$url": "https://developer.apple.com/design/human-interface-guidelines/right-to-left"}
}
if "minimumSizes" in typ: tag(typ["minimumSizes"], "Apple HIG Accessibility", "official", URL_A11Y, "All")
if "defaultSizes" in typ: tag(typ["defaultSizes"], "Apple HIG Accessibility", "official", URL_A11Y, "All")
if "weights" in typ: tag(typ["weights"], "Apple SF Pro weights", "official", URL_TYPO, "All")
save("typography.json", typ)

# ------------------------------------------------------------------
# 3. layout.json (Rule #1: Keep primary 62pt safeTop; community 59pt in $alt)
# ------------------------------------------------------------------
lay = load("layout.json")
lay["$meta"]["reconciledDate"] = "2026-11-25"
tag(lay["spacing"], "estimated 4pt rhythm", "estimated", URL_LAY, "All")
lay["hitTarget"] = {
    "ios": 44,
    "iosMinimum": 28,
    "ipadPointer": 44,
    "macos": 28,
    "macosMinimumClickable": 20,
    "paddedWithBezel": 12,
    "paddedWithoutBezel": 24,
    "$source": "Apple HIG Accessibility",
    "$class": "official",
    "$url": URL_A11Y,
    "$platform": "All"
}
ios_l = lay["ios"]
tag(ios_l["layoutMargins"], "estimated (matches 16pt widget HIG on compact)", "estimated", URL_LAY, "iOS")
ios_l["safeArea"]["$source"] = "estimated (primary 62pt preserved per Rule 1; see $alt for community 59pt iPhone 15/16)"
ios_l["safeArea"]["$class"] = "estimated"
ios_l["safeArea"]["$url"] = URL_LAY
ios_l["safeArea"]["$platform"] = "iOS"
ios_l["safeArea"]["$alt"] = {
    "iPhone15_16_topDynamicIsland": 59,
    "iPhone17_17Pro_topDynamicIsland": 62,
    "$source": "screens.guide community specs",
    "$class": "inferred/community",
    "$url": "https://screens.guide/"
}
ios_l["navigationBar"]["$source"] = "inferred (44pt UIKit height) + estimated largeTitleExtra"
ios_l["navigationBar"]["$class"] = "inferred"
ios_l["navigationBar"]["$url"] = "https://developer.apple.com/design/human-interface-guidelines/toolbars"
ios_l["navigationBar"]["$platform"] = "iOS"
for sec in ["toolbar", "tabBar", "searchField", "listRow", "listSection", "sheet", "alert", "button", "toggle", "slider", "segmentedControl", "stepper", "pageControl", "textField"]:
    tag(ios_l[sec], "estimated", "estimated", URL_LAY, "iOS 27")
ios_l["tabBar"]["maxVisibleTabsPhone"] = 5
ios_l["widgets"] = {
    "standardMargin": 16,
    "tightMargin": 11,
    "minimumFontSize": 11,
    "$source": "Apple HIG Widgets (Oct 2026)",
    "$class": "official",
    "$url": "https://developer.apple.com/design/human-interface-guidelines/widgets",
    "$platform": "iOS / macOS"
}
ios_l["liveActivities"] = {
    "lockScreenMargin": 14,
    "limitedWidthCircle": 28,
    "$source": "Apple HIG Live Activities (Oct 2026)",
    "$class": "official",
    "$url": "https://developer.apple.com/design/human-interface-guidelines/live-activities",
    "$platform": "iOS"
}
tag(lay["macos"], "estimated (menuBar 24pt & splitView divider 1pt official HIG)", "estimated", URL_LAY, "macOS 27")
lay["macos"]["menuBarHeight"] = 24
lay["macos"]["splitViewDividerWidth"] = 1
tag(lay["breakpoints"], "inferred size-class breakpoints (768pt regular) + estimated 1180pt desktop", "inferred", URL_LAY, "Web / Flutter")
tag(lay["zIndex"], "estimated", "estimated", URL_LAY, "Web")
save("layout.json", lay)

# ------------------------------------------------------------------
# 4. shape.json (Rule #1: Keep 55pt / 30pt; community 62pt / 18pt in $alt)
# ------------------------------------------------------------------
shp = load("shape.json")
shp["$meta"]["reconciledDate"] = "2026-11-25"
tag(shp["continuousCorner"], "inferred smoothing 0.6 / superellipse n~5; CSS corner-shape official baseline", "inferred", URL_SHP_CON, "All")
tag(shp["concentric"], "Apple SwiftUI ConcentricRectangle / UICornerConfiguration", "official", URL_SHP_CON, "iOS 26+ / macOS 26+")
ri = shp["radiusIOS"]
tag(ri, "estimated (primary deviceDisplay preserved at 55/30 per Rule 1; community 62/18 in $alt)", "estimated", URL_LAY, "iOS 27")
ri["sheetFloating"] = 38
ri["deviceDisplay"]["$alt"] = {
    "iPhone16Pro_17Pro": 62,
    "iPadPro_M4_M5": 18,
    "$source": "ScreenCorners community SPI",
    "$class": "inferred/community",
    "$url": "https://github.com/kylebshr/ScreenCorners"
}
tag(shp["radiusMacOS"], "estimated (macOS 27 uniform window 12pt press report; unverified on device)", "estimated", "https://www.macrumors.com/", "macOS 27")
tag(shp["borders"], "estimated hairline 0.5px", "estimated", URL_LAY, "All")
save("shape.json", shp)

# ------------------------------------------------------------------
# 5. materials.json (Add intensityCurve, reducedTransparency, perfBudget)
# ------------------------------------------------------------------
mat = load("materials.json")
mat["$meta"]["reconciledDate"] = "2026-11-25"
lg = mat["liquidGlass"]
lg["officialSpec"] = {
    "$source": "Apple HIG Materials & SwiftUI Glass / UIKit UIGlassEffect / AppKit NSGlassEffectView",
    "$class": "official",
    "$url": URL_MAT,
    "$platform": "iOS 26+ / macOS 26+",
    "variants": ["regular", "clear", "identity"],
    "clearDimmingLayer": "#000000@0.35",
    "scrollEdgeStyles": ["automatic", "soft", "hard"],
    "tabBarMinimizeBehavior": ["automatic", "onScrollDown", "onScrollUp", "never"]
}
lg["intensityCurve"] = {
    "$source": "estimated unified web/Flutter curve for iOS 27 / macOS 27 Settings intensity slider",
    "$class": "estimated",
    "$url": URL_MAT,
    "$platform": "Web / Flutter",
    "min": 0.0,
    "max": 1.0,
    "default": 0.5,
    "alphaScaleFormula": "0.7 + 0.6 * intensity",
    "blurScaleFormula": "0.7 + 0.6 * intensity"
}
lg["reducedTransparency"] = {
    "$source": "CanIUse prefers-reduced-transparency (Safari unsupported) + estimated opaque fallback",
    "$class": "official",
    "$url": "https://caniuse.com/?search=prefers-reduced-transparency",
    "$platform": "Web / Flutter",
    "safariMediaQuerySupported": False,
    "chromiumMediaQuerySupported": "118+",
    "requireInAppToggle": True,
    "fallbackOpaqueLight": lg["engine"]["fallbackOpaque"]["light"],
    "fallbackOpaqueDark": lg["engine"]["fallbackOpaque"]["dark"]
}
lg["perfBudget"] = {
    "$source": "estimated GPU overdraw budget + Flutter 3.29 BackdropFilter.grouped",
    "$class": "estimated",
    "$url": "https://api.flutter.dev/flutter/widgets/BackdropFilter-class.html",
    "$platform": "Web / Flutter",
    "maxSimultaneousBackdrop": 6,
    "neverAnimateBlurSigma": True,
    "flutterRequireBackdropGroup": True
}
tag(lg["engine"], "estimated", "estimated", URL_MAT, "Web / Flutter")
tag(lg["ios"], "Apple iOS 27 Sketch Kit", "measured", URL_IOS_KIT, "iOS 27")
tag(lg["macos"], "Apple macOS 27 Sketch Kit", "measured", URL_MAC_KIT, "macOS 27")
tag(lg["pressBehavior"], "HIG Motion qualitative + estimated numeric scale", "estimated", "https://developer.apple.com/design/human-interface-guidelines/motion", "All")
tag(lg["tuned"], "estimated", "estimated", URL_MAT, "Web / Flutter")
tag(mat["standardMaterials"]["ios"], "Apple iOS 27 Sketch Kit (blurPx estimated)", "measured", URL_IOS_KIT, "iOS 27")
tag(mat["standardMaterials"]["macos"], "Apple macOS 27 Sketch Kit (blurPx estimated)", "measured", URL_MAC_KIT, "macOS 27")
save("materials.json", mat)

# ------------------------------------------------------------------
# 6. motion.json (Per-spring class, reducedMotion per transition)
# ------------------------------------------------------------------
mot = load("motion.json")
mot["$meta"]["reconciledDate"] = "2026-11-25"
tag(mot["springModel"], "WWDC23 Animate with springs + SwiftUI Spring", "official", URL_SPR, "iOS / macOS")
for k, sp in mot["springs"].items():
    if k in ("default", "smooth", "snappy", "bouncy"):
        tag(sp, "SwiftUI Spring preset", "official", URL_SPR, "iOS / macOS")
    else:
        tag(sp, "estimated", "estimated", URL_SPR, "iOS / macOS")

mot["transitions"]["$source"] = "estimated (navigationPush 30% outgoing parallax inferred from UIKit)"
mot["transitions"]["$class"] = "estimated"
mot["transitions"]["$url"] = "https://developer.apple.com/documentation/swiftui/navigationtransition"
mot["transitions"]["$platform"] = "All"

for tk, tv in list(mot["transitions"].items()):
    if tk.startswith("$") or not isinstance(tv, dict):
        continue
    tv["interruptible"] = True
    tv["reducedMotion"] = {
        "strategy": "crossfade",
        "durationMs": 200,
        "bounce": 0,
        "$source": "Apple HIG Accessibility Reduce Motion",
        "$class": "inferred",
        "$url": URL_A11Y
    }
    if tk == "navigationPush":
        tag(tv, "inferred from UINavigationController (estimated 20pt edge width)", "inferred", "https://developer.apple.com/documentation/uikit/uinavigationcontroller", "iOS")
    else:
        tag(tv, "estimated", "estimated", "https://developer.apple.com/design/human-interface-guidelines/motion", "All")

tag(mot["press"], "estimated (HIG Motion touch vs pointer qualitative)", "estimated", "https://developer.apple.com/design/human-interface-guidelines/motion", "All")
tag(mot["hover"], "estimated", "estimated", URL_LAY, "macOS / iPadOS / Web")
mot["scroll"]["$source"] = "UIScrollView.DecelerationRate official; rubberBand c=0.55 inferred"
mot["scroll"]["$class"] = "official"
mot["scroll"]["$url"] = "https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate"
mot["scroll"]["$platform"] = "iOS / iPadOS"
mot["scroll"]["rubberBand"]["$class"] = "inferred"
mot["scroll"]["rubberBand"]["$source"] = "inferred reverse-engineered UIScrollView c=0.55"
tag(mot["symbolEffects"], "estimated CSS/SVG timing approximations of SF Symbols animations", "estimated", URL_ICN, "Web / Flutter")
save("motion.json", mot)

# ------------------------------------------------------------------
# 7. elevation.json
# ------------------------------------------------------------------
elv = load("elevation.json")
elv["$meta"]["reconciledDate"] = "2026-11-25"
tag(elv["levels"], "macOS 27 Sketch Kit + estimated cross-platform levels", "measured", URL_MAC_KIT, "All")
elv["levels"]["sliderKnob"]["dark"] = "0 1px 5px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.12)"
elv["levels"]["sliderKnob"]["$darkClass"] = "estimated"
for lk in ["knob", "raised", "popover", "sheet", "toast"]:
    if isinstance(elv["levels"].get(lk), dict):
        tag(elv["levels"][lk], "estimated", "estimated", URL_LAY, "All")
for lk in ["menu", "panel", "windowActive", "windowInactive"]:
    if isinstance(elv["levels"].get(lk), dict):
        tag(elv["levels"][lk], "Apple macOS 27 Sketch Kit", "measured", URL_MAC_KIT, "macOS 27")
save("elevation.json", elv)

# ------------------------------------------------------------------
# 8. feedback.json
# ------------------------------------------------------------------
fb = load("feedback.json")
fb["$meta"]["reconciledDate"] = "2026-11-25"
tag(fb["events"], "Apple HIG Playing haptics mapping + estimated Android/Web pairings", "inferred", URL_HAP, "All")
tag(fb["webHaptics"], "estimated Web Vibration API + iOS Safari switch workaround", "estimated", URL_HAP, "Web")
tag(fb["sounds"], "estimated original 44.1kHz WAV synthesis (scripts/synth-sounds.py)", "estimated", "https://developer.apple.com/design/human-interface-guidelines/playing-audio", "Web / Flutter / Tauri")
save("feedback.json", fb)

# ------------------------------------------------------------------
# 9. icons.json
# ------------------------------------------------------------------
icn = load("icons.json")
icn["$meta"]["reconciledDate"] = "2026-11-25"
tag(icn, "Apple SF Symbols HIG + estimated Lucide/Phosphor/CupertinoIcons cross-mapping", "inferred", URL_ICN, "All")
icn["weightToLucideStroke"]["$source"] = "estimated"
icn["weightToLucideStroke"]["$class"] = "estimated"
icn["weightToLucideStroke"]["$url"] = URL_ICN
save("icons.json", icn)

print("Updated all 9 tokens/*.json files successfully.")

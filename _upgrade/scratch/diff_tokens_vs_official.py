import os, json

ROOT = r"d:\Claude-Plugins\cupertino-forge"
DOCS_DIR = os.path.join(ROOT, "_upgrade", "scratch", "apple-docs")
TOK_DIR = os.path.join(ROOT, "tokens")
SRC_DIR = os.path.join(TOK_DIR, "source")
OUT_PATH = os.path.join(ROOT, "_upgrade", "scratch", "official_vs_plugin_diff.json")

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
    res = []
    cur = ctx
    for it in items or []:
        t = it.get("type")
        if t == "heading": cur = it.get("text", "")
        elif t == "tabNavigator":
            for tab in it.get("tabs", []):
                res.extend(walk_tables(tab.get("content", []), f"{cur} > {tab.get('title','')}"))
        elif t == "table":
            rows = []
            for row in it.get("rows", []):
                rows.append([" ".join(txt(c.get("inlineContent")) for c in cell if c.get("type") == "paragraph").strip() for cell in row])
            res.append((cur, rows))
    return res

def load_json(p):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

diff_report = {"typography": {}, "color": {}, "kits": {}}

typo_hig = load_json(os.path.join(DOCS_DIR, "hig__typography.json"))
plug_typo = load_json(os.path.join(TOK_DIR, "typography.json"))

tables = []
for sec in typo_hig.get("primaryContentSections", []):
    tables.extend(walk_tables(sec.get("content", [])))

# Map HIG Dynamic Type table titles -> plugin keys
dt_map = {
    "xSmall": "xSmall", "Small": "Small", "Medium": "Medium",
    "Large (default)": "Large", "xLarge": "xLarge", "xxLarge": "xxLarge",
    "xxxLarge": "xxxLarge", "AX1": "AX1", "AX2": "AX2", "AX3": "AX3", "AX4": "AX4", "AX5": "AX5"
}
style_map = {
    "Large Title": "largeTitle", "Title 1": "title1", "Title 2": "title2", "Title 3": "title3",
    "Headline": "headline", "Body": "body", "Callout": "callout", "Subheadline": "subheadline",
    "Footnote": "footnote", "Caption 1": "caption1", "Caption 2": "caption2"
}
weight_map = {"Regular": 400, "Medium": 500, "Semibold": 600, "Bold": 700, "Heavy": 800, "Black": 900}

dt_diffs = []
for h, rows in tables:
    clean_h = h.split(" > ")[-1].strip()
    if clean_h in dt_map and rows and rows[0][0] == "Style":
        pkey = dt_map[clean_h]
        for r in rows[1:]:
            sname = style_map.get(r[0].strip())
            if not sname: continue
            hw = weight_map.get(r[1].strip())
            hsz = float(r[2].strip())
            hlh = float(r[3].strip())
            hem = weight_map.get(r[4].strip())
            pt = plug_typo["iosDynamicType"]["sizes"][pkey][sname]
            if pt["size"] != hsz or pt["lineHeight"] != hlh or pt["weight"] != hw or pt["emphasizedWeight"] != hem:
                dt_diffs.append({"sizeCat": pkey, "style": sname, "hig": {"size": hsz, "lh": hlh, "w": hw, "emW": hem}, "plugin": {"size": pt["size"], "lh": pt["lineHeight"], "w": pt["weight"], "emW": pt["emphasizedWeight"]}})

# macOS styles
mac_diffs = []
for h, rows in tables:
    if "macOS built-in text styles" in h:
        for r in rows[1:]:
            sname = style_map.get(r[0].strip())
            if not sname: continue
            hw = weight_map.get(r[1].strip())
            hsz = float(r[2].strip())
            hlh = float(r[3].strip())
            hem = weight_map.get(r[4].strip())
            pt = plug_typo["macosTextStyles"]["styles"][sname]
            if pt["size"] != hsz or pt["lineHeight"] != hlh or pt["weight"] != hw or pt["emphasizedWeight"] != hem:
                mac_diffs.append({"style": sname, "hig": {"size": hsz, "lh": hlh, "w": hw, "emW": hem}, "plugin": {"size": pt["size"], "lh": pt["lineHeight"], "w": pt["weight"], "emW": pt["emphasizedWeight"]}})

# Tracking tables
track_diffs = {}
for h, rows in tables:
    ch = h.split(" > ")[-1].strip()
    if ch in ("SF Pro", "SF Pro Rounded", "macOS tracking values") and rows and "Size" in rows[0][0]:
        tkey = "sfProIOS" if ch == "SF Pro" else ("sfProRounded" if ch == "SF Pro Rounded" else "sfProMacOS")
        td = []
        for r in rows[1:]:
            sz = r[0].strip()
            em_val = int(r[1].replace("+", "").replace("\u2212", "-").strip())
            pt_val = float(r[2].replace("+", "").replace("\u2212", "-").strip())
            pv = plug_typo["trackingTables"][tkey].get(sz)
            if pv != em_val:
                td.append({"size": sz, "higEm": em_val, "higPt": pt_val, "pluginEm": pv})
        track_diffs[tkey] = {"totalRows": len(rows)-1, "diffs": td}

diff_report["typography"] = {
    "iosDynamicTypeDiffs": dt_diffs,
    "macosStyleDiffs": mac_diffs,
    "trackingDiffs": track_diffs,
}

# Color HIG tables
color_hig = load_json(os.path.join(DOCS_DIR, "hig__color.json"))
plug_color = load_json(os.path.join(TOK_DIR, "color.json"))
ctables = []
for sec in color_hig.get("primaryContentSections", []):
    ctables.extend(walk_tables(sec.get("content", [])))

def rgb_to_hex(s):
    # Parse e.g. "255, 59, 48" or "255 59 48" or "R: 255 G: 59 B: 48"
    import re
    nums = [int(x) for x in re.findall(r"\b(\d{1,3})\b", s)]
    if len(nums) >= 3:
        return "#{:02X}{:02X}{:02X}".format(nums[0], nums[1], nums[2])
    return s

color_sys_diffs = []
hig_color_dump = []
for h, rows in ctables:
    hig_color_dump.append({"heading": h, "rows": rows[:15], "totalRows": len(rows)})

diff_report["color"] = {"tableSummaries": hig_color_dump}

with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(diff_report, f, indent=2, ensure_ascii=False)

print("iOS Dynamic Type diffs vs HIG:", len(dt_diffs))
for d in dt_diffs: print(" ", d)
print("macOS style diffs vs HIG:", len(mac_diffs))
for d in mac_diffs: print(" ", d)
print("Tracking diffs vs HIG:", {k: len(v["diffs"]) for k, v in track_diffs.items()})
for k, v in track_diffs.items():
    if v["diffs"]: print(" ", k, v["diffs"])
print("Color HIG tables count:", len(ctables))
for c in hig_color_dump:
    print(" ", c["heading"], "rows:", c["totalRows"], "hdr:", c["rows"][0] if c["rows"] else [])

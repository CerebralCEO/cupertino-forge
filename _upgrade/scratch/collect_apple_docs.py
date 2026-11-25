import os, json, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

ROOT = r"d:\Claude-Plugins\cupertino-forge"
SCRATCH = os.path.join(ROOT, "_upgrade", "scratch")
DOCS_DIR = os.path.join(SCRATCH, "apple-docs")
DIGEST_DIR = os.path.join(SCRATCH, "digests")
RES_DIR = os.path.join(ROOT, "_upgrade", "02-research")
JSON_DIR = os.path.join(RES_DIR, "json")

for d in (DOCS_DIR, DIGEST_DIR, RES_DIR, JSON_DIR):
    os.makedirs(d, exist_ok=True)

HIG_SLUGS = [
    "typography", "color", "materials", "layout", "motion", "accessibility",
    "right-to-left", "dark-mode", "sf-symbols", "app-icons", "playing-haptics",
    "playing-audio", "onboarding", "privacy", "keyboards", "gestures",
    "undo-and-redo", "writing", "designing-for-ios", "designing-for-ipados",
    "designing-for-macos", "buttons", "tab-bars", "sidebars", "toolbars",
    "sheets", "alerts", "action-sheets", "menus", "context-menus", "popovers",
    "lists-and-tables", "toggles", "sliders", "segmented-controls", "steppers",
    "pickers", "text-fields", "search-fields", "progress-indicators", "widgets",
    "live-activities", "windows", "the-menu-bar", "navigation-and-search",
    "split-views", "status-bars", "notifications", "scroll-views", "tooltips",
    "outline-views", "inspectors", "settings"
]

DOC_SLUGS = [
    "technologyoverviews/adopting-liquid-glass",
    "swiftui/spring",
    "swiftui/glass",
    "swiftui/glasseffectcontainer",
    "swiftui/concentricrectangle",
    "swiftui/view/glasseffect(_:in:)",
    "swiftui/view/scrolledgeeffectstyle(_:for:)",
    "swiftui/view/tabbarminimizebehavior(_:)",
    "uikit/uiglasseffect",
    "appkit/nsglasseffectview",
    "uikit/uiscrollview/decelerationrate",
    "appkit/nshapticfeedbackmanager",
]

TARGETS = []
for s in HIG_SLUGS:
    TARGETS.append(("hig__" + s, f"https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{s}.json", f"https://developer.apple.com/design/human-interface-guidelines/{s}"))
for s in DOC_SLUGS:
    safe = "doc__" + s.replace("/", "__").replace("(", "_").replace(")", "_").replace(":", "_")
    TARGETS.append((safe, f"https://developer.apple.com/tutorials/data/documentation/{s}.json", f"https://developer.apple.com/documentation/{s}"))

def fetch_one(item):
    key, api_url, web_url = item
    out_json = os.path.join(DOCS_DIR, key + ".json")
    if os.path.exists(out_json) and os.path.getsize(out_json) > 100:
        with open(out_json, "r", encoding="utf-8") as f:
            return (key, api_url, web_url, "CACHED", json.load(f))
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read().decode("utf-8")
            with open(out_json, "w", encoding="utf-8") as f:
                f.write(raw)
            return (key, api_url, web_url, "OK", json.loads(raw))
    except Exception as e:
        return (key, api_url, web_url, f"ERR:{e}", None)

def inline_txt(nodes):
    out = []
    for n in nodes or []:
        t = n.get("type")
        if t == "text": out.append(n.get("text", ""))
        elif t == "codeVoice": out.append(f"`{n.get('code', '')}`")
        elif t == "reference": out.append(n.get("overridingTitle") or n.get("identifier", "").split("/")[-1])
        elif "inlineContent" in n: out.append(inline_txt(n["inlineContent"]))
    return "".join(out).strip()

def render_items(items, lines, tables_count):
    for it in items or []:
        t = it.get("type")
        if t == "heading":
            lines.append(f"\n{'#' * min(it.get('level', 2), 4)} {it.get('text', '')}")
        elif t == "paragraph":
            p = inline_txt(it.get("inlineContent"))
            if p: lines.append(p)
        elif t == "unorderedList":
            for li in it.get("items", []):
                parts = []
                for c in li.get("content", []):
                    if c.get("type") == "paragraph":
                        parts.append(inline_txt(c.get("inlineContent")))
                if parts: lines.append("- " + " ".join(parts))
        elif t == "orderedList":
            for idx, li in enumerate(it.get("items", []), 1):
                parts = [inline_txt(c.get("inlineContent")) for c in li.get("content", []) if c.get("type") == "paragraph"]
                if parts: lines.append(f"{idx}. " + " ".join(parts))
        elif t == "aside":
            lines.append(f"[{it.get('style','note').upper()}]")
            render_items(it.get("content"), lines, tables_count)
        elif t == "codeListing":
            code = "\n".join(it.get("code", []))
            lines.append(f"```{it.get('syntax','')}\n{code}\n```")
        elif t == "tabNavigator":
            for tab in it.get("tabs", []):
                lines.append(f"\n[TAB: {tab.get('title','')}]")
                render_items(tab.get("content"), lines, tables_count)
        elif t == "table":
            tables_count[0] += 1
            lines.append(f"\n[TABLE #{tables_count[0]}]")
            for r_i, row in enumerate(it.get("rows", [])):
                cells = []
                for cell in row:
                    cp = [inline_txt(c.get("inlineContent")) for c in cell if c.get("type") == "paragraph"]
                    cells.append(" ".join(cp).strip())
                lines.append(" | ".join(cells))
                if r_i == 0:
                    lines.append(" | ".join(["---"] * len(cells)))

def write_digest(key, web_url, data):
    meta = data.get("metadata", {})
    lines = [f"TITLE: {meta.get('title', key)}", f"URL: {web_url}", ""]
    abstract = inline_txt(data.get("abstract"))
    if abstract:
        lines.append("ABSTRACT: " + abstract)
    tc = [0]
    for sec in data.get("primaryContentSections", []):
        if sec.get("kind") == "declarations":
            for dec in sec.get("declarations", []):
                toks = "".join(t.get("text", "") for t in dec.get("tokens", []))
                if toks: lines.append(f"DECL: {toks}")
        render_items(sec.get("content"), lines, tc)
    for ts in data.get("topicSections", []):
        lines.append(f"\nTOPIC SECTION: {ts.get('title','')}")
        lines.append("  " + ", ".join(ts.get("identifiers", [])[:25]))
    with open(os.path.join(DIGEST_DIR, key + ".txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=10) as ex:
        results = list(ex.map(fetch_one, TARGETS))
    ok = []; err = []
    for key, api_url, web_url, status, data in results:
        if data:
            write_digest(key, web_url, data)
            ok.append((key, status, web_url))
        else:
            err.append((key, status, web_url))
    print(f"FETCHED OK/CACHED: {len(ok)} | ERRORS: {len(err)}")
    for e in err:
        print("  ERR:", e[0], e[1])

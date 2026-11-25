#!/usr/bin/env python3
"""
Parse all _upgrade/02-research/01..18 .md 9-column tables + json/*.json leaf tokens,
verify structural invariants, collect every unique URL, and emit exact coverage metrics.
"""
import json, pathlib, re
from collections import Counter

RES_DIR = pathlib.Path(r"d:\Claude-Plugins\cupertino-forge\_upgrade\02-research")
JSON_DIR = RES_DIR / "json"

ALLOWED_CLASSES = {"Official", "Measured", "Inferred", "Estimated", "Platform-dependent", "Unknown"}
MD_DOMAIN_FILES = sorted([p for p in RES_DIR.glob("*.md") if re.match(r"^(0[1-9]|1[0-8])-", p.name)])

all_urls = set()
md_rows_total = 0
md_class_counts = Counter()
per_file_stats = []
bad_tables = []
missing_usage_header = []

for p in MD_DOMAIN_FILES:
    text = p.read_text(encoding="utf-8")
    if "## এই ফাইল কীভাবে ব্যবহার হবে" not in text:
        missing_usage_header.append(p.name)
    lines = text.splitlines()
    file_cls = Counter()
    file_rows = 0
    in_9col = False
    for idx, ln in enumerate(lines, 1):
        if ln.startswith("| Name | Value | Unit | Platform & OS version |"):
            in_9col = True
            continue
        if in_9col:
            if not ln.strip().startswith("|"):
                in_9col = False
                continue
            if re.match(r"^\|\s*---", ln):
                continue
            parts = [c.strip() for c in ln.strip().strip("|").split("|")]
            if len(parts) != 9:
                bad_tables.append((p.name, idx, len(parts), ln[:80]))
                continue
            url_col = parts[5].strip("`")
            cls_col = parts[6].strip("`")
            if cls_col not in ALLOWED_CLASSES:
                bad_tables.append((p.name, idx, f"bad_class:{cls_col}", parts[0]))
            file_cls[cls_col] += 1
            md_class_counts[cls_col] += 1
            file_rows += 1
            md_rows_total += 1
            if url_col.startswith("http"):
                all_urls.add(url_col)
    per_file_stats.append((p.name, file_rows, dict(file_cls)))

json_leaf_total = 0
json_class_counts = Counter()
json_bad = []

def walk_json(obj, fname, path=""):
    global json_leaf_total
    if isinstance(obj, dict):
        if "$value" in obj:
            json_leaf_total += 1
            cls = obj.get("$class")
            url = obj.get("$url", "")
            if cls not in ALLOWED_CLASSES:
                json_bad.append((fname, path, cls))
            else:
                json_class_counts[cls] += 1
            if isinstance(url, str) and url.startswith("http"):
                all_urls.add(url)
            return
        for k, v in obj.items():
            if k == "$meta":
                continue
            walk_json(v, fname, f"{path}.{k}")

for jp in sorted(JSON_DIR.glob("*.json")):
    walk_json(json.loads(jp.read_text(encoding="utf-8")), jp.name)

# Check which URLs are missing from 00-SOURCES.md
sources_text = (RES_DIR / "00-SOURCES.md").read_text(encoding="utf-8")
missing_urls = sorted([u for u in all_urls if u not in sources_text])

summary = {
    "domain_md_count": len(MD_DOMAIN_FILES),
    "missing_usage_header": missing_usage_header,
    "bad_tables": bad_tables,
    "md_rows_total": md_rows_total,
    "md_class_counts": dict(md_class_counts),
    "per_file_stats": per_file_stats,
    "json_leaf_total": json_leaf_total,
    "json_bad": json_bad,
    "json_class_counts": dict(json_class_counts),
    "unique_urls_total": len(all_urls),
    "all_urls": sorted(all_urls),
    "missing_urls_in_sources": missing_urls,
}
print(json.dumps(summary, indent=2, ensure_ascii=False))

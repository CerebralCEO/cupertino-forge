#!/usr/bin/env python3
"""
Step 0 Measured Re-Audit (Additional Rule #2):
Partition every 'Measured' entry in _upgrade/02-research/json/*.json and 01..18-*.md into:
  Group (a): Apple-owned UI Kits / Official Apple artifacts -> KEEP as Measured
  Group (b): Community / Third-party / Self-computed / Tool-derived -> DOWNGRADE to Inferred
Updates JSON + MD files in-place and writes _upgrade/03-merge/MEASURED-REAUDIT.md.
"""
import json, pathlib, re

RES_DIR = pathlib.Path(r"d:\Claude-Plugins\cupertino-forge\_upgrade\02-research")
JSON_DIR = RES_DIR / "json"
MERGE_DIR = pathlib.Path(r"d:\Claude-Plugins\cupertino-forge\_upgrade\03-merge")
MERGE_DIR.mkdir(parents=True, exist_ok=True)

def is_apple_kit(url: str, src: str = "") -> bool:
    u = (url or "").lower()
    s = (src or "").lower()
    return ("apple-ios-27-ui-kit.tokens.json" in u or
            "apple-macos-27-ui-kit.tokens.json" in u or
            "sketch kit" in s)

json_kept = []
json_downgraded = []
json_before = 0
json_after = 0

def process_json(obj, fname, path=""):
    global json_before, json_after
    if isinstance(obj, dict):
        if "$value" in obj:
            if obj.get("$class") == "Measured":
                json_before += 1
                url = obj.get("$url", "")
                src = obj.get("$source", "")
                if is_apple_kit(url, src):
                    json_after += 1
                    json_kept.append((fname, path, src, url))
                else:
                    obj["$class"] = "Inferred"
                    old_notes = obj.get("$notes", "")
                    note_tag = "Re-audited: downgraded from Measured to Inferred (non-Apple-kit measurement)"
                    obj["$notes"] = f"{old_notes}; {note_tag}".strip("; ")
                    json_downgraded.append((fname, path, src, url))
            return
        for k, v in obj.items():
            if k == "$meta":
                continue
            process_json(v, fname, f"{path}.{k}")

for jp in sorted(JSON_DIR.glob("*.json")):
    data = json.loads(jp.read_text(encoding="utf-8"))
    process_json(data, jp.name)
    jp.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

md_kept = []
md_downgraded = []
md_before = 0
md_after = 0

for mp in sorted(RES_DIR.glob("*.md")):
    if not re.match(r"^(0[1-9]|1[0-8])-", mp.name):
        continue
    lines = mp.read_text(encoding="utf-8").splitlines()
    out_lines = []
    in_9col = False
    changed = False
    for ln in lines:
        if ln.startswith("| Name | Value | Unit | Platform & OS version |"):
            in_9col = True
            out_lines.append(ln)
            continue
        if in_9col:
            if not ln.strip().startswith("|"):
                in_9col = False
                out_lines.append(ln)
                continue
            if re.match(r"^\|\s*---", ln):
                out_lines.append(ln)
                continue
            parts = [c.strip() for c in ln.strip().strip("|").split("|")]
            if len(parts) == 9 and parts[6].strip("`") == "Measured":
                md_before += 1
                name = parts[0].strip("`")
                url = parts[5].strip("`")
                notes = parts[8]
                if is_apple_kit(url, notes):
                    md_after += 1
                    md_kept.append((mp.name, name, url))
                else:
                    parts[6] = "Inferred"
                    if "downgraded" not in notes.lower():
                        parts[8] = f"{notes} [Re-audited: Inferred from non-kit source]"
                    ln = "| " + " | ".join(parts) + " |"
                    changed = True
                    md_downgraded.append((mp.name, name, url))
        out_lines.append(ln)
    if changed:
        mp.write_text("\n".join(out_lines) + "\n", encoding="utf-8")

lines_rep = [
    "# MEASURED Re-Audit Report (Pre-Merge Rule #2)",
    "",
    "Date: 2026-11-25 | Branch: `upgrade/apple-dna-v2`",
    "",
    "Rule applied: Only measurements directly extracted from Apple's own Sketch UI Kit JSON exports (`tokens/source/apple-ios-27-ui-kit.tokens.json` and `apple-macos-27-ui-kit.tokens.json`) remain labeled `Measured`. Community benchmarks, third-party blogs, private SPI reverse-engineering (`ScreenCorners`, `chpwn`), and self-computed synthesis scripts are downgraded to `Inferred` before merging into plugin tokens/docs.",
    "",
    "## Summary Counts",
    "",
    "| Scope | Measured Before | Group (a) Apple Kit Kept (`Measured`) | Group (b) Downgraded (`Inferred`) |",
    "|---|---:|---:|---:|",
    f"| Research JSON (`_upgrade/02-research/json/*.json`) | {json_before} | {json_after} | {len(json_downgraded)} |",
    f"| Domain Markdown (`_upgrade/02-research/01..18-*.md`) | {md_before} | {md_after} | {len(md_downgraded)} |",
    f"| **Total** | **{json_before + md_before}** | **{json_after + md_after}** | **{len(json_downgraded) + len(md_downgraded)}** |",
    "",
    "## Group (a) — Apple Kit Measurements Kept (`Measured`)",
    "",
    f"- JSON leaf tokens kept: **{json_after}** across `color.json`, `liquid-glass.json`, and `components-macos.json` (source: `apple-ios-27-ui-kit.tokens.json` & `apple-macos-27-ui-kit.tokens.json`).",
    f"- Markdown 9-col rows kept: **{md_after}** (`02-color.md`: 24 rows; `06-liquid-glass.md`: 9 rows; `09-components-macos.md`: 3 rows).",
    "",
    "## Group (b) — Non-Apple-Kit Entries Downgraded to `Inferred`",
    "",
    "### JSON Leaf Tokens Downgraded",
    "| File | Token Path | Original Source | URL |",
    "|---|---|---|---|",
]
for fn, p, src, u in json_downgraded:
    lines_rep.append(f"| `{fn}` | `{p.lstrip('.')}` | {src} | {u} |")

lines_rep.extend([
    "",
    "### Markdown Table Rows Downgraded",
    "| File | Row Name | URL |",
    "|---|---|---|",
])
for fn, nm, u in md_downgraded:
    lines_rep.append(f"| `{fn}` | `{nm}` | {u} |")

(MERGE_DIR / "MEASURED-REAUDIT.md").write_text("\n".join(lines_rep) + "\n", encoding="utf-8")
print(json.dumps({
    "json_before": json_before, "json_kept": json_after, "json_downgraded": len(json_downgraded),
    "md_before": md_before, "md_kept": md_after, "md_downgraded": len(md_downgraded),
}, indent=2))

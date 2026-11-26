# Phase 6 Report — Hygiene, Honest Claims, Device-Verification Tagging & License/Trigger Audit (`v2.1.1`)

**Date:** 2026-11-27  
**Workspace:** `D:\Claude-Plugins\cupertino-forge`  
**Branch:** `main` (local commit only; **not pushed**)  
**Version:** `2.1.1`  
**Numeric Token Value Changes:** **0** (all numeric values untouched)

---

## 1. Claim Audit (`N = 70` from `tokens/ESTIMATES.md`)

- **Verified Estimate Count:** `tokens/ESTIMATES.md` (`## 1. Estimated Tokens (70 groups/entries)`) = **70**.
- **Standardized Honest Framing Applied:**
  > `encodes Apple's published HIG principles and Apple Design Resources kit measurements; closest parity on Apple platforms with native APIs; documented approximation elsewhere; 70 values remain estimates (see tokens/ESTIMATES.md)`
- **Files Updated:**
  - `README.md` (Honest Parity Contract blockquote)
  - `GUIDE.md` (Section 1.2)
  - `skills/apple-design-core/SKILL.md` (`description:` frontmatter + intro paragraph)
  - `templates/AGENTS.apple.md` (`Parity contract` bullet)
  - `templates/CLAUDE.apple.md` (first bullet)
  - `CHANGELOG.md` & `_upgrade/03-merge/MERGE-REPORT.md` (historical parity audit note tightened)
- **After-Edit Grep Proof (`pixel-perfect|100%|95%|exactly like Apple|Apple designer|psychology` across `README.md`, `GUIDE.md`, `.claude-plugin/*.json`, `skills/**/SKILL.md`, `commands/*.md`, `templates/*`):**
  ```text
  AFTER_CLAIM_GREP_HITS: 1
  GUIDE.md:54: - **Web, Flutter, and Tauri (Windows / Linux / MAS):** `cupertino-forge` encodes Apple's published HIG principles and Apple Design Resources kit measurements; closest parity on Apple platforms with native APIs; documented approximation elsewhere; 70 values remain estimates (see `tokens/ESTIMATES.md`). Never claim pixel-perfect parity across non-Apple platforms.
  ```
  *(Only 1 hit remains, which is the explicit prohibition `Never claim pixel-perfect parity across non-Apple platforms.`)*

---

## 2. "Where It Works" Table (`README.md`)

Added `## Where It Works` to `README.md` with honest support boundaries and explicit `untested` status:
- **Claude Code:** Full plugin (`commands/`, `skills/`, `agents/`, `tokens/`, `scripts/`, `qa/`, `hooks/`). CLI/hook/script runners tested via Node (`verify-plugin.mjs`, `lint.mjs --hook`, 16 tests); interactive Claude Code `/plugin install` UI flow: **untested** in this environment.
- **Google Antigravity:** Supported (`setup-project.mjs`, `.agent/rules/cupertino-forge.md` / `AGENTS.apple.md`, global `~/.gemini/GEMINI.md`, manual QA CLI; no automatic Claude Code hooks). `setup-project.mjs` + terminal CLI/QA scripts tested; restarted Antigravity `/cupertino-forge:*` slash UI: **untested**.
- **Claude.ai Chat / Cowork:** Skills only (partial). `tokens/`, `scripts/`, `hooks/`, and `${CLAUDE_PLUGIN_ROOT}` are unavailable (`untested`).

---

## 3. Phase 3c `radiusMacOS` Measurements — Kit Frame vs Live OS (`needs-device-verification`)

- **Token File (`tokens/shape.json :: radiusMacOS`):** Added `"$verification": "needs-device-verification"` and `"$kitMeasurementNote"` (0 numeric values changed).
- **Docs Tagged `[measured-from-kit, device-unverified]`:** `05-shape.md`, `15-version-diff.md`, `components-macos/window-chrome.md`, `components-macos/presentation.md`.

| Token (`radiusMacOS.*`) | Old → New | `$source` | Figma Node IDs | Exact Figma Variant Names (`macos-batch-a.json`) | Status |
|---|---|---|---|---|---|
| `window` | `12 → 16` | Apple Figma kit macOS 27 (`5YNrD6VW0v0Meye5F2JIz0`) | `585:3372`, `4363:18479`, `4365:31678` | `Window BG` (`Mode=Light,Active=True`); `Windows - Composed` (`Mode=Light/Dark, Active=True, Window Type=Expanded Toolbar + Title + Sidebar`) | Kit frame `cornerRadius`; **not live macOS OS** (`needs-device-verification`) |
| `sheet` | `12 → 16` | Apple Figma kit macOS 27 (`5YNrD6VW0v0Meye5F2JIz0`) | `121:11423`, `4358:15436` | `Sheet` (`Mode=Light`, `Mode=Dark`) | Kit frame `cornerRadius`; **not live macOS OS** (`needs-device-verification`) |
| `alert` | `16 → 10` | Apple Figma kit macOS 27 (`5YNrD6VW0v0Meye5F2JIz0`) | `121:11254`, `121:11240` | `Alert` (`Type=Stacked`, `Type=Side-by-side`) | Kit frame `cornerRadius`; **not live macOS OS** (`needs-device-verification`) |
| `popover` | `16 → 10` | Apple Figma kit macOS 27 (`5YNrD6VW0v0Meye5F2JIz0`) | `4336:13293`, `4336:13305` | `Popover` (`Mode=Dark, Edge=Top (Leading)`, `Mode=Dark, Edge=Leading (Top)`) | Kit frame `cornerRadius`; **not live macOS OS** (`needs-device-verification`) |
| `menuItemHighlight` | `6 → 8` | Apple Figma kit macOS 27 (`5YNrD6VW0v0Meye5F2JIz0`) | `685:23691`, `685:23678` | `Menu Items` (`Mode=Light, State=Hover, Menu has Selection=True/False, Type=Submenu`) | Kit frame `cornerRadius`; **not live macOS OS** (`needs-device-verification`) |

---

## 4. License Hygiene & Personal Path Audit

1. **`_upgrade/04-extras/LICENSE-NOTES.md` Summary:** Marks `tokens/source/apple-*-ui-kit.tokens.json` redistribution as **`unclear`** under the strictest interpretation of Apple Design Resources terms, and recommends reviewing whether `tokens/source/*.tokens.json` should be kept local-only before any public open-source release.
2. **Raw Apple Files Inside `cupertino-forge-v2.1.1.zip`:**
   ```text
   RAW_APPLE_IN_ZIP: ['tokens/source/apple-ios-27-ui-kit.tokens.json', 'tokens/source/apple-macos-27-ui-kit.tokens.json']
   ```
3. **Proposal (Not Implemented Yet):** Yes — `tokens/source/*` can be safely excluded from the release ZIP and/or gitignored while keeping only derived values in `tokens/*.json`. Verified via `Select-String` across `scripts/*.mjs`, `hooks/scripts/*.mjs`, `qa/*`, and `tests/*.mjs` that **zero runtime scripts read `tokens/source/*`** (only `qa/ESTIMATE-RESOLUTION.md` and `qa/reference-manifest.json` cite them as provenance docs).
4. **Personal Path Grep (`C:\Users\Asus` / `Asus` across `git ls-files`):**
   - **Total tracked hits: 3** (all inside internal `_upgrade/03-merge/` historical reports; **0 hits** in runtime `scripts/`, `skills/`, `commands/`, `templates/`, `README.md`, `GUIDE.md`):
     - `_upgrade/03-merge/FIGMA-MCP-PLAN.md:3`
     - `_upgrade/03-merge/PHASE-5-AUTO-BOOTSTRAP-REPORT.md:16`
     - `_upgrade/03-merge/PHASE-5-AUTO-BOOTSTRAP-REPORT.md:27`

---

## 5. Global Trigger & Bootstrap Safety

- **Global Trigger (`C:\Users\Asus\.gemini\GEMINI.md`):**
  - Tightened `## Apple UI Trigger (cupertino-forge)` so it activates **ONLY** on explicit user requests naming `cupertino-forge`, `/cupertino-forge`, `Apple 27`, `iOS 27`, `macOS 27`, or `Liquid Glass` (and explicitly states: *"Do NOT trigger automatically on generic UI, Next.js, Flutter, or Tauri requests that do not explicitly ask for `cupertino-forge` or Apple 27 / Liquid Glass styling."*).
  - `# ZeroFounder Global Rules` (lines 1–31) preserved intact.
- **Live `setup-project.mjs` Scratch Verification (`_upgrade/scratch/phase6-bootstrap-test/`):**
  ```text
  === mock-nextjs ===
  dry_exit=0, files_after_dry=4 (expected 4)
  real_exit=0, created=27, updated=0, skipped=1
  overwritten_sentinels=[], claude_appended_safely=True
  === mock-flutter ===
  dry_exit=0, files_after_dry=3 (expected 3)
  real_exit=0, created=20, updated=0, skipped=1
  overwritten_sentinels=[], claude_appended_safely=True
  === mock-tauri ===
  dry_exit=0, files_after_dry=4 (expected 4)
  real_exit=0, created=32, updated=0, skipped=1
  overwritten_sentinels=[], claude_appended_safely=True
  ```

---

## 6. Full Verification & Release ZIP Proofs (`v2.1.1`)

```text
node scripts/verify-plugin.mjs                  -> exit 0 (cupertino-forge@2.1.1, 12 PASS, 0 NOT RUN, 0 FAIL)
node --test tests/*.test.mjs                    -> exit 0 (16/16 PASS, 0 FAIL)
node scripts/contrast-check.mjs --accent #0088FF -> exit 0 (0 blocking contrast failure(s))
node scripts/package-plugin.mjs                 -> exit 0 (161 files, 438.9 KB, Forbidden entries: 0)
python zipfile verify (v2.1.1.zip)              -> exists=True, size=449433 bytes (438.9 KB), entries=161, bad_crc=None, forbidden=0
DOC_LINKS_BROKEN                                -> 0 []
```

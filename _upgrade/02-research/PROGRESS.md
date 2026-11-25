# Deep Research Progress — `cupertino-forge` (iOS 27 / macOS 27)

## Phase Status Overview

- [x] **Step 0 — Source Collection & Official Diff**: 62 Apple DocC JSON files cached (`_upgrade/scratch/apple-docs/`) & parsed into `_upgrade/scratch/digests/`; 8 structured research JSON files generated (`_upgrade/02-research/json/*.json`, `703` leaf tokens); `tokens/typography.json` verified against Official HIG (`0 diffs` across 132 iOS Dynamic Type cells + 3×64 tracking rows).
- [x] **Batch A (1/5 Flagged Domains)**:
  - [x] `00-SOURCES.md` (Synced with all 87 unique cited URLs)
  - [x] `17-localization-rtl.md` (R-13 — Localization, RTL & Non-Latin Scripts)
  - [x] `06-liquid-glass.md` (R-07 — Liquid Glass & Vibrancy Spec + Performance Budgets)
- [x] **Batch B (2/5 Flagged Domains)**:
  - [x] `03-typography.md`
  - [x] `07-motion-physics.md`
  - [x] `13-accessibility.md`
  - [x] `11-haptics-sound.md`
  - [x] `12-icons-symbols-appicon.md`
- [x] **Batch C (UX Patterns, Components, Platform Parity, Recipes & QA)**:
  - [x] `08-components-ios.md`
  - [x] `09-components-macos.md`
  - [x] `10-ux-patterns.md`
  - [x] `14-platform-parity-matrix.md`
  - [x] `15-implementation-recipes.md`
  - [x] `16-qa-measurement-method.md`
- [x] **Batch D (Foundations 3/5, iOS 27/macOS 27 Delta, Open Questions, Plugin Diff)**:
  - [x] `01-philosophy-psychology.md`
  - [x] `02-color.md`
  - [x] `04-layout-spacing.md`
  - [x] `05-shape-geometry.md`
  - [x] `18-ios27-macos27-delta.md`
  - [x] `19-OPEN-QUESTIONS.md`
  - [x] `DIFF-VS-PLUGIN.md`
- [x] **Final Verification & Coverage Calculation**:
  - [x] `20-COVERAGE-REPORT.md` (Computed by `_upgrade/scratch/compute_coverage.py`: `82.10%` Official + Measured across `944` items)
  - [x] Final `00-SOURCES.md` reconciliation + `git status --short` clean check (only `?? _upgrade/`)

---

**Phase 2 Complete (Non-Destructive)**: Zero files modified inside the plugin tree; ready for Prompt 3 implementation & bugfixes.

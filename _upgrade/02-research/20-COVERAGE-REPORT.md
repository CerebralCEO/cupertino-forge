# 20 — Computed Research Coverage & Verification Report

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি Phase 2 গবেষণার পূর্ণ সংখ্যাগত অডিট (`_upgrade/scratch/compute_coverage.py` স্ক্রিপ্টের সরাসরি আউটপুট থেকে তৈরি); কোনো সংখ্যা অনুমান করে লেখা হয়নি। Prompt 3-এ প্লাগইন আপডেট শুরু করার আগে কোথায় আমাদের প্রমাণ `Official`/`Measured` (`82.10%`) আর কোথায় এখনো `Estimated` (`11.02%`) আছে তা দেখতে এটি ব্যবহার হবে।

---

## 1. Aggregate Coverage Summary (Computed `2026-11-25`)

| Artifact Scope | Total Items | `Official` | `Measured` | `Inferred` | `Estimated` | `Platform-dependent` | `Unknown` | Directly Grounded (`Official + Measured`) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Markdown 9-Col Tables (`01`–`18`)** | `241` | `131` (`54.36%`) | `53` (`21.99%`) | `15` (`6.22%`) | `41` (`17.01%`) | `1` (`0.41%`) | `0` (`0.00%`) | **`184 / 241` (`76.35%`)** |
| **Structured Research JSON (`json/*.json`)** | `703` | `431` (`61.31%`) | `160` (`22.76%`) | `48` (`6.83%`) | `63` (`8.96%`) | `1` (`0.14%`) | `0` (`0.00%`) | **`591 / 703` (`84.07%`)** |
| **Combined Total** | **`944`** | **`562` (`59.53%`)** | **`213` (`22.56%`)** | **`63` (`6.67%`)** | **`104` (`11.02%`)** | **`2` (`0.21%`)** | **`0` (`0.00%`)** | **`775 / 944` (`82.10%`)** |

- **Schema & Structural Integrity (`compute_coverage.py`)**:
  - `domain_md_count`: **`18`** (`01-*.md`..`18-*.md`), সাথে `00-SOURCES.md`, `19-OPEN-QUESTIONS.md`, `20-COVERAGE-REPORT.md`, `DIFF-VS-PLUGIN.md`, `PROGRESS.md` (মোট `23` `.md` + `8` `.json`)।
  - `missing_usage_header`: `[]` (`0`টি)।
  - `bad_tables`: `[]` (`0`টি — সব `241`টি রো ৯-কলাম এবং অনুমোদিত `Class` মেনে চলে)।
  - `json_bad`: `[]` (`0`টি — সব `703`টি leaf token-এ `$value`, `$unit`, `$source`, `$class`, `$platform`, `$url` উপস্থিত)।
  - `unique_urls_total`: **`87`** ইউনিক URL সংগ্রহ ও যাচাইকৃত।

*(টীকা: Quantitative টেবিলে placeholder সংখ্যা না বসিয়ে যেসব বিস্তারিত মান বা হার্ডওয়্যার আচরণ অজানা আছে যেমন iOS 27 Liquid Glass slider-এর exact shader sigma, Display P3 hex বা macOS 27 exact corner radius, সেগুলো আলাদাভাবে [19-OPEN-QUESTIONS.md](file:///d:/Claude-Plugins/cupertino-forge/_upgrade/02-research/19-OPEN-QUESTIONS.md)-এ `9`টি ওপেন আইটেম হিসেবে স্পষ্ট নথিভুক্ত আছে।)*

---

## 2. Per-File Breakdown (`01`–`18` Markdown Tables)

| File | Total Rows | `Official` | `Measured` | `Inferred` | `Estimated` | `Platform-dependent` |
| --- | --- | --- | --- | --- | --- | --- |
| `01-philosophy-psychology.md` | 5 | 4 | 0 | 1 | 0 | 0 |
| `02-color.md` | 25 | 1 | 24 | 0 | 0 | 0 |
| `03-typography.md` | 16 | 16 | 0 | 0 | 0 | 0 |
| `04-layout-spacing.md` | 14 | 3 | 7 | 3 | 1 | 0 |
| `05-shape-geometry.md` | 12 | 2 | 4 | 2 | 4 | 0 |
| `06-liquid-glass.md` | 24 | 8 | 9 | 2 | 5 | 0 |
| `07-motion-physics.md` | 16 | 7 | 2 | 1 | 6 | 0 |
| `08-components-ios.md` | 21 | 11 | 1 | 0 | 9 | 0 |
| `09-components-macos.md` | 18 | 9 | 3 | 0 | 6 | 0 |
| `10-ux-patterns.md` | 11 | 10 | 0 | 1 | 0 | 0 |
| `11-haptics-sound.md` | 13 | 7 | 3 | 0 | 3 | 0 |
| `12-icons-symbols-appicon.md` | 10 | 9 | 0 | 0 | 1 | 0 |
| `13-accessibility.md` | 13 | 13 | 0 | 0 | 0 | 0 |
| `14-platform-parity-matrix.md` | 6 | 6 | 0 | 0 | 0 | 0 |
| `15-implementation-recipes.md` | 6 | 5 | 0 | 0 | 1 | 0 |
| `16-qa-measurement-method.md` | 8 | 7 | 0 | 0 | 1 | 0 |
| `17-localization-rtl.md` | 12 | 5 | 0 | 3 | 3 | 1 |
| `18-ios27-macos27-delta.md` | 11 | 8 | 0 | 2 | 1 | 0 |

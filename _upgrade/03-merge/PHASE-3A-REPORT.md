# Phase 3a রিপোর্ট — Pre-3 হারনেস/যাচাই ও Deterministic DOM QA (Phase 3a)

**শাখা (Branch):** `upgrade/apple-dna-v2`  
**Pre-3 কমিট:** `7764c3b` (`Pre-3: preserve verification harnesses, add doctor toolchain probes, prove Flutter scaling fix, and clarify WebKit report`)

> **Phase 3b সীমানা:** এই ধাপটি শুধু **Pre-3 + Phase 3a**। Phase 3b (`qa/diff.mjs`, `qa/ux-keyboard.mjs`, `capture.py` multi-state matrix, দুই-মোড রিভিউয়ার ও `--reference` ফ্ল্যাগ) এখনো শুরু করা হয়নি — `"3b শুরু কর"` অনুমোদন পেলে শুরু হবে।

---

## ১. Pre-3 কাজের ফলাফল

| # | Pre-3 কাজ | বাস্তব ফলাফল (`Tested` / `NOT RUN`) | নথিপত্র / ফাইল |
|---|---|---|---|
| ১ | **স্ক্র্যাচ হার্নেস সংরক্ষণ ও `.gitignore`** | `_upgrade/scratch/{tsx-check,tauri-check,flutter-check}` থেকে বিল্ড আর্টিফ্যাক্ট (`node_modules`, `dist`, `target`, `.dart_tool`, `build`, ইত্যাদি) বাদ দিয়ে [`tests/harness/{web,tauri,flutter}/`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/README.md)-এ সংরক্ষিত; [`.gitignore`](file:///D:/Claude-Plugins/cupertino-forge/.gitignore) আপডেটেড। | [`tests/harness/README.md`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/README.md) |
| ২ | **`/apple-doctor` টুলচেইন প্রোব** | [`scripts/verify-plugin.mjs`](file:///D:/Claude-Plugins/cupertino-forge/scripts/verify-plugin.mjs)-এ `harness-node`, `harness-playwright` (Python + `qa/node_modules/playwright`), `harness-flutter` (Windows `flutter.bat`), ও `harness-cargo` যোগ করা হয়েছে; টুল না থাকলে `FAIL` না করে `NOT RUN` দেখায়। বর্তমান রান: **12 PASS, 0 NOT RUN, 0 FAIL**। | [`commands/apple-doctor.md`](file:///D:/Claude-Plugins/cupertino-forge/commands/apple-doctor.md) |
| ৩ | **পরিষ্কার ক্লোন (`git clone`) যাচাই** | `%TEMP%\cf-clean-clone`-এ ফ্রেশ ক্লোন করে `build-tokens.mjs` → `npm install` (207 pkg) → `npx tsc --noEmit` (**0 errors**) → `vite build` → `run_vite_and_verify.py` চালানো হয়েছে: Chromium **7/7 PASS**, Firefox **7/7 PASS** (`CLEAN_CLONE_VERIFIED_OK`), তারপর টেম্প ক্লোন মুছে ফেলা হয়েছে। | [`tests/harness/web/`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/package.json) |
| ৪ | **Flutter Dynamic Type Before/After প্রমাণ** | `TextScaler.linear(2.0)`-এ `context.cf.type.body` (`17pt`) রেন্ডার করে `RenderParagraph` মাপা হয়েছে:<br>• **Before (`e5e5116`):** `styleFontSize=34.0`, `effectiveFontSize=68.0` (`4x` ডাবল-স্কেল!), `renderedHeight=88.0` → **FAIL** (`Expected 34.0, Actual 68.0`, exit `1`)।<br>• **After (`b8fdf02`):** `styleFontSize=17.0`, `effectiveFontSize=34.0` (`2x`), `renderedHeight=44.0` → **PASS** (exit `0`)। | [`PHASE-2B-REPORT.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/PHASE-2B-REPORT.md) |
| ৫ | **"Safari" → "Playwright WebKit" শব্দসংশোধন** | [`PHASE-2A-VERIFICATION.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/PHASE-2A-VERIFICATION.md)-এর টেস্ট ফলাফলে ভুল `"Safari"` লেবেল বদলে স্পষ্টভাবে `Playwright WebKit (UA Safari 18.2 — real Safari নয়)` করা হয়েছে। | [`PHASE-2A-VERIFICATION.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/PHASE-2A-VERIFICATION.md) |
| ৬ | **মাল্টি-ইঞ্জিন গ্লাস ও Firefox যাচাই** | `python -m playwright install firefox` সম্পন্ন করে **Chromium**, **Playwright WebKit**, ও **Firefox (`Gecko/132.0`)**-এ যাচাই:<br>• `CSS.supports('-webkit-hyphens', 'none')`: Chromium `False`, WebKit `True`, Firefox `False` (অর্থাৎ Firefox `@supports (-webkit-hyphens: none)`-এ পড়ে না!)।<br>• Firefox গ্লাস: স্বাভাবিক অবস্থায় `backdropFilter: blur(12px) saturate(1.8) brightness(1.05)`, `transparency="reduce"`-এ `bf: 'none'` + `rgb(246, 246, 246)`। এছাড়া পরিষ্কার ক্লোনে `verify_mounted.py --browser firefox` **7/7 PASS**। | [`tests/harness/web/verify_mounted.py`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/verify_mounted.py) |

---

## ২. Phase 3a নির্মিত অংশ

1. **টোকেন-ভিত্তিক ও `estimate-based` ট্যাগযুক্ত [`qa/computed-style-audit.mjs`](file:///D:/Claude-Plugins/cupertino-forge/qa/computed-style-audit.mjs):**
   - কোনো হার্ডকোডেড টোকেন মান নেই; [`scripts/build-tokens.mjs`](file:///D:/Claude-Plugins/cupertino-forge/scripts/build-tokens.mjs) (`--targets json`) থেকে `cupertino.tokens.resolved.json` (সব সেমান্টিক কালার, `fallbackCompensation`, ও `materials` সমৃদ্ধ) পড়ে ১০টি ডোম/কম্পিউটেড চেক চালায়:
     - `font-size` (`measured`), `letter-spacing` (`measured`, `:lang(bn/ar/he) -> 0` সহ), `border-radius` (`estimate-based`), `spacing-grid` (`estimate-based`), `hit-target` (`official` `44px`/`28px`), `contrast` (`official` `<=17pt 4.5:1`, `>=18pt/Bold>=600 3.0:1`), `glass-budget` (`estimate-based` `<= 6`), `focus-ring` (`measured`, প্রকৃত কীবোর্ড `Tab` ট্রাভার্সালে `:focus-visible`), `raw-color` (`measured`), `easing` (`estimate-based`, `ease`/`linear` ও canonical `cubic-bezier(...)` নিষিদ্ধ, `linear(...)` স্প্রিং অনুমোদিত)।
   - Playwright অনুপস্থিত থাকলে মিথ্যা `OK` না দিয়ে সব চেক `NOT RUN (<reason>)` হিসেবে রিপোর্ট করে।
2. **বিচ্ছিন্ন QA ডিপেন্ডেন্সি:** [`qa/package.json`](file:///D:/Claude-Plugins/cupertino-forge/qa/package.json)-এ `playwright` শুধুমাত্র `devDependencies`-এ যুক্ত (`qa/node_modules/` `.gitignore`-এ)।
3. **দুই-ভাগে Scorecard ও Reference-সংশোধন:**
   - [`skills/apple-design-audit/references/scorecard.md`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-design-audit/references/scorecard.md)-কে **Part A: Rule-Conformance (`0–100`)** ও **Part B: Fidelity (`0–100` বা `N/A (no reference)`)**-এ ভাগ করা হয়েছে।
   - [`_upgrade/02-research/16-qa-measurement-method.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/02-research/16-qa-measurement-method.md) থেকে [`visual-qa.md`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-design-audit/references/visual-qa.md) এবং [`ux-qa.md`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-design-audit/references/ux-qa.md) তৈরি করে [`skills/apple-design-audit/SKILL.md`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-design-audit/SKILL.md)-এ সংযুক্ত করা হয়েছে।
   - [`commands/apple-audit.md`](file:///D:/Claude-Plugins/cupertino-forge/commands/apple-audit.md)-কে পাতলা wrapper-এ আনা হয়েছে (`--reference` Phase 3b-তে আসবে উল্লেখসহ)।

---

## ৩. `tests/seeded-defects/` ৯টি প্ল্যান্টেড ডিফেক্টের সততা-ভিত্তিক ফলাফল (`7 Detected / 2 Missed`)

[`tests/seeded-defects/`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/index.html) (`index.html`, `defects.css`, `DefectsSample.tsx`)-এর ওপর `hooks/scripts/lint.mjs` এবং `qa/computed-style-audit.mjs` উভয়ই চালানো হয়েছে।

| # | প্ল্যান্টেড ডিফেক্ট | `lint.mjs` (স্ট্যাটিক) | `computed-style-audit.mjs` (DOM) | সামগ্রিক (`Detected` / `Missed`) | কারণ |
|---|---|---|---|---|---|
| ১ | অফ-স্কেল `font-size` (`23px`) | **Detected** (`css-font-size` `.css`-এ; `.tsx` ইনলাইন `fontSize` মিস) | **Detected** (`font-size`: `23px`) | **Detected** | রিয়েল DOM ও CSS লিন্ট `23px`-কে টাইপ-স্কেল `[11..34]px`-এর বাইরে ধরেছে। |
| ২ | Raw hex কালার (`#123456`) | **Detected** (`raw-hex` `.tsx` ও `.css` উভয়েই) | **Detected** (`raw-color`: `rgb(18, 52, 86)`) | **Detected** | উভয় টুলই নন-টোকেন কালার চিহ্নিত করেছে। |
| ৩ | ছোট হিট-টার্গেট (`30×30px` বাটন) | *Missed* (স্ট্যাটিক টেক্সট রুল নেই) | **Detected** (`hit-target`: `30x30px < 44x44px`) | **Detected** | রেন্ডারড বাউন্ডিং-বক্স পরিমাপ ৩ নম্বর ডিফেক্ট ধরেছে। |
| ৪ | ফোকাস রিং ছাড়া `outline: none` | *Missed* (`outline: none` নিষিদ্ধ রুল নেই) | **Detected** (`focus-ring`: `outline=none, boxShadow=none`) | **Detected** | প্রকৃত `Tab` ট্রাভার্সালে `:focus-visible` রিং না থাকায় ধরা পড়েছে। |
| ৫ | `ease` টাইমিং কার্ভ | **Detected** (`easing` `.tsx` ও `.css` উভয়েই) | **Detected** (`easing`: `transitionTimingFunction: ease`) | **Detected** | স্ট্যাটিক ও DOM উভয় চেকই `ease` ধরেছে। |
| ৬ | ভুল `border-radius` (`15px`, squircle ছাড়া) | **Detected** (`css-radius` `.css`-এ; JSX `borderRadius` মিস) | **Detected** (`border-radius`: `15px` [**`estimate-based`**]) | **Detected** | DOM `shape.radiusIOS`-এর বাইরের `15px` ব্যাসার্ধ ধরেছে। |
| ৭ | কম কন্ট্রাস্ট টেক্সট (`#999999` / `#FFFFFF`) | *আংশিক* (শুধু `raw-hex` ধরেছে, কন্ট্রাস্ট অনুপাত নয়) | **Detected** (`contrast`: `2.85:1 < 4.5:1`) | **Detected** | DOM কন্ট্রাস্ট ক্যালকুলেটর `4.5:1` থ্রেশহোল্ড ব্যর্থতা প্রমাণ করেছে। |
| ৮ | `.cf-glass`-এ সলিড `background: var(--cf-bg)` ওভাররাইড | **Missed** | **Missed** | **Missed** | `var(--cf-bg)` বৈধ টোকেন ও `glass-budget <= 6` পাস করে; গ্লাস এলিমেন্টের `alpha === 1` ক্লবারিং চেক এখনো নেই। |
| ৯ | `prefers-reduced-motion` উপেক্ষা (`linear(0, 0.5, 1)` ইনফিনিট স্পিন) | **Missed** | **Missed** | **Missed** | `lint.mjs`-এ reduced-motion গার্ড চেক নেই ও `computed-style-audit.mjs` এখনো `reducedMotion: 'reduce'` পাস চালায় না। |

মিস হওয়া সব ডিফেক্ট ও সেগুলোর বিস্তারিত বিশ্লেষণ (কোনো গোপন রুল না বানিয়ে) [`_upgrade/03-merge/QA-GAPS.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/QA-GAPS.md)-এ নথিভুক্ত আছে।

---

## ৪. পূর্ণ ভেরিফিকেশন ফলাফল ও `NOT RUN` তালিকা

### ৪.১ বাস্তবে চালানো ও উত্তীর্ণ (`Tested — PASS`)
- `node --test tests/*.test.mjs`: **14 / 14 PASS** (নতুন [`tests/qa-audit-regression.test.mjs`](file:///D:/Claude-Plugins/cupertino-forge/tests/qa-audit-regression.test.mjs)-এ ক্লিন পেজ `10/10 PASS` + সিডেড-ডিফেক্টস `7/10 FAIL` + ডক্টর হার্নেস প্রোবসহ)।
- `node scripts/verify-plugin.mjs`: **12 PASS, 0 NOT RUN, 0 FAIL** (`36 path references verified`, `node v24.22.1`, `playwright python+node`, `Flutter 3.41.7`, `cargo 1.95.0`)।
- `node scripts/contrast-check.mjs --accent "#0088FF"`: **0 blocking failures** (৩টি অনুমোদিত `17pt regular` advisory warning সহ)।

### ৪.২ `NOT RUN` অংশ
- **আসল Apple Safari হার্ডওয়্যার / macOS / iPhone ডিভাইস যাচাই:** **NOT RUN** (`Windows 11 host — real Safari/macOS/iOS hardware unavailable`; Chromium, Playwright WebKit `18.2`, এবং Firefox `132` চালানো হয়েছে)।
- **Tauri macOS `aarch64-apple-darwin` & GUI WebView:** **NOT RUN** (Windows হোস্টে macOS Xcode Clang অনুপস্থিত; হার্নেস `tests/harness/tauri/`-এ সংরক্ষিত ও পূর্বের Windows `cargo check` / `cargo test --lib` উত্তীর্ণ)।
- **Phase 3b কাজের পরিধি (`qa/diff.mjs`, `qa/ux-keyboard.mjs`, `--reference` ডিফ, reviewer ২-মোড):** **NOT RUN (Phase 3b অনুমোদনের অপেক্ষায় intentionally থামানো)**।

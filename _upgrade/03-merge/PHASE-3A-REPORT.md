# Phase 3a রিপোর্ট — Pre-3 হারনেস/যাচাই, False-Positive অডিট ও Deterministic DOM QA (Phase 3a)

**শাখা (Branch):** `upgrade/apple-dna-v2`  
**Pre-3 কমিট:** `7764c3b`  
**প্রাথমিক Phase 3a কমিট:** `96ba2dd`

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
| ৬ | **মাল্টি-ইঞ্জিন গ্লাস ও Firefox যাচাই** | `python -m playwright install firefox` সম্পন্ন করে **Chromium**, **Playwright WebKit**, ও **Firefox (`Gecko/132.0`)**-এ যাচাই:<br>• `CSS.supports('-webkit-hyphens', 'none')`: Chromium `False`, WebKit `True`, Firefox `False`।<br>• Firefox গ্লাস: স্বাভাবিক অবস্থায় `backdropFilter: blur(12px) saturate(1.8) brightness(1.05)`, `transparency="reduce"`-এ `bf: 'none'` + `rgb(246, 246, 246)`। | [`tests/harness/web/verify_mounted.py`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/verify_mounted.py) |

---

## ২. False-Positive পরীক্ষা (`tests/harness/web` — Light ও Dark)

আসল মাউন্টেড Vite প্রোডাকশন অ্যাপে (`tests/harness/web/`, যেখানে কোনো ইচ্ছাকৃত ভুল নেই) `qa/computed-style-audit.mjs` ও `hooks/scripts/lint.mjs` চালিয়ে প্রতিটি finding ট্রায়াজ করা হয়েছে — পূর্ণ টেবিল দেখুন [`_upgrade/03-merge/FALSE-POSITIVE-CHECK.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/FALSE-POSITIVE-CHECK.md)-এ।

- **ধরা পড়া ও ঠিক করা আসল প্লাগিন/হার্নেস বাগ:**
  1. [`tests/harness/web/src/app.css`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/src/app.css): `@source` রিলেটিভ পাথ ৩ ধাপের বদলে ৪ ধাপ (`../../../../skills/apple-web/assets`) ঠিক করা হয়েছে। (রিপো-ব্যাপী `grep` করে নিশ্চিত হওয়া গেছে `/apple-init`, `README.md`, বা `skills/`-এ এই ভুল নেই।) পূর্ণ `67.77 kB` CSS-এ **Chromium**, **Playwright WebKit**, ও **Firefox** তিন ইঞ্জিনেই `verify_mounted.py` পুনরায় **7/7 PASS** ([`PHASE-2A-VERIFICATION.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/PHASE-2A-VERIFICATION.md))।
  2. [`cupertino.base.css`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/styles/cupertino.base.css): `.cf-press` ও `.cf-press-plain`-এ `opacity 200ms` ডিফল্ট `ease` → `var(--cf-dur-color) var(--cf-ease-release)`; tinted glass `85%` (`2.94:1`) → `90%` (`3.13:1`) — `tokens/materials.json`-এ `$class: "estimated"` নিশ্চিত করে `$note` যোগ করা হয়েছে এবং ৪টি ব্যাকগ্রাউন্ডে (`#FFFFFF`, `#000000`, `#0A2540`, `#FFD600`) মেপে [`qa/ACCESSIBILITY-TRADEOFFS.md`](file:///D:/Claude-Plugins/cupertino-forge/qa/ACCESSIBILITY-TRADEOFFS.md)-এ টেবিল দেওয়া হয়েছে।
  3. [`button.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/button.tsx): `tinted` (`estimated`) `15%` (`2.94:1`) → `12%` (`3.05:1`)।
  4. [`controls.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/controls.tsx): iOS `Toggle`, `Stepper`, ও `SegmentedControl`-এ `::after` টাচ হিট-এরিয়া এক্সটেন্ডার (`44px`)।
  5. [`fields.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/fields.tsx): `SearchField` `<input>`-এ `h-full` (`44px`) এবং `px-3.5` → `px-4` (`16px`)।
  6. [`mac.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/mac.tsx): `MacTable` কলাম হেডারে অনুপস্থিত `outline-none focus-visible:focus-ring` যোগ ও `Checkbox`/`RadioGroup` লেবেলে `min-h-5`।
- **চূড়ান্ত Clean App ফলাফল (iOS `/` ও macOS `/?view=mac`):**
  - iOS Light: **12/12 PASS (`100 (3 advisories)`)** | iOS Dark: **12/12 PASS (`100`)**
  - macOS Light (`--platform mac`): **12/12 PASS (`100 (6 advisories)`)** | macOS Dark (`--platform mac`): **12/12 PASS (`100 (5 advisories)`)**
  - Chromium / WebKit / Firefox mounted React: **7/7 PASS** | `lint.mjs`: **0 error(s), 0 warning(s)**।

---

## ৩. Seeded-Defect স্যুইট (`tests/seeded-defects/` — মূল ৯টি + ৩টি অপ্রত্যাশিত Blind ডিফেক্ট)

> **সততা নোট (Upper-Bound Caveat):** [`tests/seeded-defects/`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/index.html) ফিক্সচারটি অডিটরের লেখক নিজেই বানিয়েছে। তাই নিচের **12 / 12** ডিটেকশন রেটকে **ওপরের সীমা (upper bound)** হিসেবে ধরতে হবে — অজানা বাস্তব অ্যাপে অপ্রত্যাশিত CSS/JS প্যাটার্নে মিস হতে পারে (বিস্তারিত [`QA-GAPS.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/QA-GAPS.md))।

### ৩.১ মূল ৯টি Seeded Defect (`9 / 9 Detected`)

| # | প্ল্যান্টেড ডিফেক্ট | `lint.mjs` (স্ট্যাটিক) | `computed-style-audit.mjs` (DOM) | সামগ্রিক |
|---|---|---|---|---|
| ১ | অফ-স্কেল `font-size` (`23px`) | **Detected** (`css-font-size` `.css`-এ) | **Detected** (`font-size`: `23px`) | **Detected** |
| ২ | Raw hex কালার (`#123456`) | **Detected** (`raw-hex`) | **Detected** (`raw-color`: `rgb(18, 52, 86)`) | **Detected** |
| ৩ | ছোট হিট-টার্গেট (`30×30px` বাটন) | *Missed* | **Detected** (`hit-target`: `30x30px < 44x44px`) | **Detected** |
| ৪ | ফোকাস রিং ছাড়া `outline: none` | *Missed* | **Detected** (`focus-ring`: `outline=none, boxShadow=none`) | **Detected** |
| ৫ | `ease` টাইমিং কার্ভ | **Detected** (`easing`) | **Detected** (`easing`: `transitionTimingFunction: ease`) | **Detected** |
| ৬ | ভুল `border-radius` (`15px`, squircle ছাড়া) | **Detected** (`css-radius` `.css`-এ) | **Detected** (`border-radius`: `15px` [**`estimate-based`**]) | **Detected** |
| ৭ | কম কন্ট্রাস্ট টেক্সট (`#999999` / `#FFFFFF`) | *আংশিক* (`raw-hex`) | **Detected** (`contrast`: `2.85:1 < 4.5:1`) | **Detected** |
| ৮ | `.cf-glass`-এ সলিড `background: var(--cf-bg)` ওভাররাইড | *Missed* | **Detected** (`glass-translucency`: `alpha=1.00`, reduce-transparency/forced-colors-এ চুপ থাকে) | **Detected** |
| ৯ | `prefers-reduced-motion` উপেক্ষা (ইনফিনিট স্পিন) | *Missed* | **Detected** (`reduced-motion`: `running CSSAnimation (transform)` under `reducedMotion: 'reduce'`) | **Detected** |

### ৩.২ ৩টি নতুন Blind / Unplanned ডিফেক্ট (কোনো আলাদা নতুন রুল যোগ না করেই চালানো — `3 / 3 Detected`)

| # | নতুন Blind ডিফেক্ট | `lint.mjs` | `computed-style-audit.mjs` (বিদ্যমান নিয়মেই) | সামগ্রিক |
|---|---|---|---|---|
| ১০ | ভুল `letter-spacing` (`3px` on `17px` body) | *Missed* | **Detected** (`letter-spacing`: `3.00px @ 17px`, expected `-0.44px`) | **Detected** |
| ১১ | ৪pt-গ্রিড-বহির্ভূত spacing (`padding: 13px`) | *Missed* | **Detected** (`spacing-grid` [**`estimate-based`**]: `paddingTop: 13px`) | **Detected** |
| ১২ | `.cf-glass`-এর ওপর কম-কন্ট্রাস্ট টেক্সট (`var(--cf-label-glass-3)` `#BFBFBF` on light glass) | *Missed* | **Detected** (`contrast`: `1.84:1 < 4.5:1`) | **Detected** |

### ৩.৩ সত্যিকারের ৫টি নিয়ম-বহির্ভূত Blind ডিফেক্ট (`0 / 5 Detected` — `5 / 5 Known Gaps`)

`grep` করে নিয়ম নেই নিশ্চিত হয়ে `tests/seeded-defects/`-এ ৫টি নতুন ভুল (`#13` ভুল `font-family` অর্ডার `'Segoe UI', -apple-system`, `#14` আইকন-টেক্সট baseline অমিল, `#15` ভুল z-order গ্লাসের ওপর কনটেন্ট, `#16` স্ক্রল কনটেইনারে `overscroll-behavior` অনুপস্থিত, `#17` ডার্ক মোডে `border: 1px solid white`) চালানো হয়েছে: `lint.mjs` এবং `computed-style-audit.mjs` (Light ও Dark) কোনোটিই এদের ধরেনি (**`0 / 5`**; মোট `12 / 17`)। কোনো নতুন রুল না বানিয়ে সবগুলো [`QA-GAPS.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/QA-GAPS.md)-এ Known Gap হিসেবে নথিভুক্ত আছে।

---

## ৪. চূড়ান্ত ভেরিফিকেশন ফলাফল ও `NOT RUN` তালিকা

### ৪.১ বাস্তবে চালানো ও উত্তীর্ণ (`Tested — PASS`)
- `node --test tests/*.test.mjs`: **14 / 14 PASS** (`tests/qa-audit-regression.test.mjs`-এ clean page `12/12 PASS`, `reduce-transparency` নীরবতা যাচাই, ও `12/12` seeded-defect যাচাইসহ)।
- `node scripts/verify-plugin.mjs`: **12 PASS, 0 NOT RUN, 0 FAIL** (`36 path references verified`, `node v24.22.1`, `playwright python+node`, `Flutter 3.41.7`, `cargo 1.95.0`)।
- `node scripts/contrast-check.mjs --accent "#0088FF"`: **0 blocking failures**।
- Clean mounted `tests/harness/web`: Chromium **7/7 PASS**, Light **12/12 PASS**, Dark **12/12 PASS**, `lint.mjs` **0 errors / 0 warnings**।

### ৪.২ `NOT RUN` অংশ
- **আসল Apple Safari হার্ডওয়্যার / macOS / iPhone ডিভাইস যাচাই:** **NOT RUN** (`Windows 11 host — real Safari/macOS/iOS hardware unavailable`; Chromium, Playwright WebKit `18.2`, এবং Firefox `132` চালানো হয়েছে)।
- **Tauri macOS `aarch64-apple-darwin` & GUI WebView:** **NOT RUN** (Windows হোস্টে macOS Xcode Clang অনুপস্থিত)।
- **Phase 3b (`qa/diff.mjs`, `qa/ux-keyboard.mjs`, `--reference` ডিফ, reviewer ২-মোড):** **NOT RUN (Phase 3b অনুমোদনের অপেক্ষায় থামানো)**।

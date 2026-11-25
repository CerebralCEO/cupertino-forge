# Phase 3b-lite রিপোর্ট (`upgrade/apple-dna-v2`)

> **তারিখ:** ২০২৬-১১-২৫
> **স্কোপ:** Phase 3b-lite (ক, খ, গ, ঘ — চার ধাপ, প্রতিটির শেষে আলাদা commit)। কোনো Figma MCP কল, কোনো `diff.mjs` (pixel-diff), কোনো Apple kit/image commit, এবং কোনো Phase 4 কাজ করা হয়নি।

---

## ক. Estimate-Resolution সিদ্ধান্ত (`78de3ba`)

| টোকেন | সিদ্ধান্ত | `$class` / `$source` |
|---|---|---|
| `tokens/shape.json :: borders` (`0.5px` hairline, `1px` control) | Apple Sketch kit-এ নিশ্চিত — **`measured`-এ উন্নীত** | `$class: "measured"`, `$source: "Apple Design Resources iOS 27 & macOS 27 Sketch kits (iOS: 27, macOS: 27)"`; `CHANGELOG.md`-এ নথিভুক্ত |
| `tokens/elevation.json :: levels.knob` | মূল মান ও `estimated` অপরিবর্তিত; আলাদা `$kitReference` ফিল্ড যোগ (`0 3px 36px rgba(0,0,0,0.05)`) | `$class: "estimated"`, `$kitReference.$class: "measured-kit-reference"` |
| `tokens/elevation.json :: levels.popover` | মূল মান ও `estimated` অপরিবর্তিত; আলাদা `$kitReference` ফিল্ড যোগ (macOS Panels থেকে, ভিন্ন component) | `$class: "estimated"`, `$kitReference.$class: "measured-kit-reference"` |

- `qa/ESTIMATE-RESOLUTION.md`-এ `levels.knob` ও `levels.popover`-এর রায় `contradicted` থেকে **`different-component / needs-visual-check`** করা হয়েছে এবং কারণ লেখা হয়েছে।
- **Toggle knob shadow পাশাপাশি ভিজ্যুয়াল তুলনা** (`_upgrade/scratch/knob-shadow-compare/knob-compare-{light,dark}.png`, gitignored, চাক্ষুষ যাচাইকৃত):
  - **Light মোডে** বর্তমান `estimated` shadow-তে knob-এর নিচে পরিষ্কার lift ও hairline rim দেখা যায়, যেখানে একক iOS 27 kit shadow (`0 3px 36px rgba(0,0,0,0.05)`) হালকা track-এর ওপর প্রায় সমতল/অদৃশ্য মনে হয়; **Dark মোডে** (`#000000`-এর ওপর) দুটোই প্রায় একরকম দেখায়।

---

## খ. সীমিত Extras একীভূতকরণ (`e5479b4`)

প্লাগইনকে হালকা রেখে (`skills/apple-design-core/SKILL.md` মূলত অপরিবর্তিত, শুধু ১-লাইন router pointer যোগ) ভাগ করা হয়েছে:

### মূল প্লাগইনে সংযোজিত
- `skills/apple-design-core/references/foundations/07-iconography.md`: **App Icon** সেকশন (1024×1024 master, iOS 27 Liquid Glass layered icon, macOS 27 squircle, Light/Dark/Tinted/Clear variants, no baked masks/text)।
- `skills/apple-design-core/references/patterns/system-experiences.md`: **TipKit** (contextual inline/popover tips, frequency cap, non-blocking) ও **Live Activities** (Lock Screen + Dynamic Island compact/minimal/expanded, 8h active + 4h stale)।
- `skills/apple-design-core/references/anti-patterns.md`: ১-লাইন নিয়ম — Sign in with Apple / Apple Pay বাটন কখনো কাস্টম-রিস্টাইল করা যাবে না।
- `README.md`: **"Legal & Licensing"** সেকশন (Apple trademarks, SF Pro / SF Symbols লাইসেন্স সীমা, repo-তে Apple kit/asset না রাখার নীতি)।

### আলাদা `references/extras/` ফোল্ডারে (৯টি ফাইল, কেবল প্রয়োজন হলে পড়ার জন্য)
`skills/apple-design-core/references/extras/`:
`brand-constrained.md`, `wallet.md`, `app-clips.md`, `imessage-apps.md`, `app-intents-shortcuts.md`, `healthkit.md`, `ar.md`, `homekit.md`, `tap-to-pay.md`।

- `node scripts/verify-plugin.mjs`: **12 PASS, 0 NOT RUN, 0 FAIL**।

---

## গ. কীবোর্ড ও UX অডিট (`qa/ux-keyboard.mjs`) (`8d434d3`)

### ৬টি কীবোর্ড চেক
1. `no-positive-tabindex` — `tabindex > 0` নিষিদ্ধ
2. `tab-order-and-no-trap` — DOM অনুক্রমে Tab অর্ডার ও keyboard trap না থাকা
3. `focus-ring` — Tab-এ যাওয়া প্রতিটি control-এ দৃশ্যমান focus ring
4. `modal-focus-trap-esc-return` — Modal/Sheet/Alert-এ focus trap, `Esc` দিয়ে বন্ধ, এবং trigger-এ focus ফেরত
5. `roving-focus-ltr-rtl` — `TabBar`/`SegmentedControl`-এ LTR ও RTL arrow navigation + `Home`/`End`
6. `enter-space-activation` — Button ও Toggle-এ `Enter`/`Space` অ্যাক্টিভেশন

### Clean Harness (`tests/harness/web`) ট্রায়াজ ও ফিক্স
- **১টি false positive (অডিটে ঠিক করা হয়েছে):** `<Sheet>`-এর 500ms spring exit অ্যানিমেশনের কারণে `Esc`-এর 350ms পর dialog DOM-এ থাকা দেখেছিল; `waitFor({ state: 'detached', timeout: 1200 })` দিয়ে ঠিক করা হয়েছে।
- **১টি সত্যিকারের প্লাগইন বাগ (প্লাগইন ফাইলে ঠিক করা হয়েছে):** controlled Radix `<Dialog.Root open={open}>`-এ `<Dialog.Trigger>` না থাকায় `skills/apple-web/assets/components/apple/alert.tsx` ও `sheet.tsx` `Esc` দিয়ে বন্ধ হলে `#btn-open-alert` / `#btn-open-sheet`-এ focus ফেরত দিত না। `prevFocusRef` + `requestAnimationFrame(() => target.focus())` দিয়ে ঠিক করা হয়েছে।
- **ফলাফল (Clean Harness):**
  - **Chromium (`chrome`) Light:** **6 PASS, 0 FAIL, 0 NOT RUN**
  - **Chromium (`chrome`) Dark:** **6 PASS, 0 FAIL, 0 NOT RUN**
  - **WebKit Light & Dark:** **`NOT RUN`** (`qa/node_modules/playwright` v1.52 `webkit-2388` চায়; লোকাল মেশিনে শুধু Python Playwright-এর `webkit-2104` ইনস্টল আছে)
  - **Firefox Light & Dark:** **`NOT RUN`** (`qa/node_modules/playwright` v1.52 `firefox-1572` চায়; লোকাল মেশিনে শুধু Python Playwright-এর `firefox-1466` ইনস্টল আছে)

### Seeded Defects (`tests/seeded-defects/keyboard.html`) ও Blind Gaps
- **৫/৫ জানা কীবোর্ড দোষ ধরা পড়েছে** (`tests/ux-keyboard-regression.test.mjs` PASS): positive `tabindex`, keyboard trap, `outline: none` focus-ring removal, broken modal (`Esc` বন্ধ করে না / focus ফেরত দেয় না), broken roving-focus `tablist`।
- **০/২ Blind defects (ইচ্ছাকৃতভাবে নিয়ম না যোগ করে `_upgrade/03-merge/QA-GAPS.md`-এ নথিভুক্ত):**
  - `kb-blind-1`: destructive confirmation dialog-এ `aria-describedby` অনুপস্থিত
  - `kb-blind-2`: প্রথম Tab-এ visible "Skip to main content" link অনুপস্থিত

---

## ঘ. Capture Matrix, দুই-মোডের Reviewer ও `--reference`

1. **`.gitignore`**: `qa/out/` যোগ করা হয়েছে (git-এ কোনো capture image যাবে না)।
2. **`scripts/capture.py`**:
   - ডিফল্ট আউটপুট `qa/out`।
   - `--matrix` মোডের পূর্ণ হিসাব: `2 themes (light, dark) × 2 contrasts (normal, more) × 2 transparencies (normal, reduce) × 3 viewports (390, 820, 1280) × 3 engines (chromium, webkit, firefox) = 72 <= 100`।
   - চালানোর আগে মোট ছবির সংখ্যা প্রিন্ট করে (`Planned captures: 72 ...`), এবং কোনো engine অনুপলব্ধ হলে crash না করে `NOT RUN (<engine>: <reason>)` রিপোর্ট করে।
   - `find_chrome`-এ `msedge.exe` ও `LOCALAPPDATA` সংরক্ষিত (`windows-python-regression.test.mjs` PASS)।
3. **`agents/apple-design-reviewer.md`** (একই agent, দুই মোড — কোনো নতুন agent নয়):
   - **`visual` মোড**: `qa/out/` স্ক্রিনশট Apple নিয়মের বিপরীতে পর্যালোচনা করে; `--reference <dir>`-এ ছবি থাকলে পাশাপাশি AI-তুলনা করে, না থাকলে `Fidelity: N/A (no reference)` দেখায় এবং কোনো fidelity দাবি করে না; estimate-ভিত্তিক মন্তব্যে `estimate-based` ট্যাগ বাধ্যতামূলক।
   - **`behavior` মোড**: কোড + `qa/computed-style-audit.mjs` + `qa/ux-keyboard.mjs` আউটপুট দেখে states, motion, haptics, focus traps, roving focus, ও copy যাচাই করে।
4. **`commands/apple-audit.md` ও `skills/apple-design-audit/SKILL.md`**:
   - `/apple-audit --reference <dir>` যুক্ত করা হয়েছে: `<dir>`-এ PNG/JPG থাকলে `visual` AI-compare মোড, না থাকলে স্পষ্ট `Fidelity: N/A (no reference)`।
5. **`diff.mjs` (pixel-diff) ইচ্ছাকৃতভাবে তৈরি করা হয়নি:** `qa/REFERENCE-WORKFLOW.md`-এ কারণ নথিভুক্ত — বর্তমানে কোনো reference PNG নেই এবং ৭৭টি component geometry মান এখনো `estimated`, ফলে pixel-diff-এর মান এখন কম।

---

## চূড়ান্ত টেস্ট ও `NOT RUN` তালিকা

| চেক | ফলাফল |
|---|---|
| `node --test tests/*.test.mjs` | **15/15 PASS** (0 fail) |
| `node scripts/verify-plugin.mjs` | **12 PASS, 0 NOT RUN, 0 FAIL** |
| `node scripts/contrast-check.mjs --accent "#0088FF"` | **0 blocking failures** (3 expected small-text advisory warnings) |
| `node qa/ux-keyboard.mjs` (clean harness, Chromium light & dark) | **12 PASS, 0 FAIL** |
| `node qa/ux-keyboard.mjs` (clean harness, WebKit & Firefox) | **`NOT RUN`** (Node Playwright `webkit-2388` / `firefox-1572` অনুপস্থিত; শুধু Python `webkit-2104` / `firefox-1466` আছে) |
| `python scripts/capture.py --matrix --dry-run` | **PASS** (`Planned captures: 72 <= 100`) |
| `python scripts/capture.py` 3-engine smoke test (`chromium,webkit,firefox` × `normal,more` × `normal,reduce`) | **PASS** (`12/12 captured, 0 engine(s) NOT RUN, 0 console errors`; `qa/out/` gitignored) |
| Reference Fidelity (`--reference`) | **`NOT RUN`** (`qa/references/` খালি — manual/device PNG নেই) |

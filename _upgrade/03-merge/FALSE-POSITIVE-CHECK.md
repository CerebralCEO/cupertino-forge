# False-Positive Check — Clean Mounted Web Harness (`tests/harness/web`)

**টার্গেট অ্যাপ:** [`tests/harness/web/`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/src/App.tsx) (Vite 6 production build — Chromium `7/7 PASS`, Firefox `7/7 PASS`, কোনো ইচ্ছাকৃত ভুল নেই)  
**চালানো টুল:**
- `node hooks/scripts/lint.mjs --root tests/harness/web tests/harness/web/src/App.tsx tests/harness/web/src/main.tsx tests/harness/web/src/app.css tests/harness/web/index.html tests/harness/web/vite.config.ts` → **0 error(s), 0 warning(s)**
- `node qa/computed-style-audit.mjs --url http://127.0.0.1:4181/ --platform ios --theme light|dark --json`

---

## ১. প্রাথমিক রানে পাওয়া প্রতিটি Finding-এর ট্রায়াজ ও সিদ্ধান্ত

| # | Check / Finding | মোড | রায় (`real bug` / `false positive` / `estimate-based`) | কী করা হয়েছে |
|---|---|---|---|---|
| ০ | প্রাথমিক রানে `h-8`, `h-9`, `h-11`, `min-h-[var(--cf-row-min-h)]`, `focus-visible:focus-ring` অনুপস্থিত থাকায় `17` hit-target ও `2` focus-ring ফেইল | Light + Dark | **`real bug` (harness)** | [`tests/harness/web/src/app.css`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/src/app.css)-এ `@source "../../../skills/apple-web/assets"` ৩ ধাপ ওপরে ছিল (৪ ধাপ হবে)। `@source "../../../../skills/apple-web/assets"` ঠিক করতেই CSS ৪৫kB → ৬৭kB হয়েছে এবং `focus-ring` `20/20 PASS` হয়েছে। |
| ১ | `easing`: ৭টি বাটন/স্টেপারে `transitionTimingFunction: ease` | Light + Dark | **`real bug` (plugin) + `estimate-based`** | [`cupertino.base.css`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/styles/cupertino.base.css) লাইন ১৬৬ ও ১৬৯-এ `.cf-press` (`opacity 200ms`) ও `.cf-press-plain` (`transition: opacity 200ms`) টাইমিং ফাংশন বাদ দেওয়ায় ব্রাউজার ডিফল্ট `ease` বসিয়েছিল। উভয় জায়গায় `var(--cf-dur-color) var(--cf-ease-release)` বসিয়ে ঠিক করা হয়েছে। |
| ২ | `spacing-grid`: `SearchField` র‍্যাপারে `paddingRight: 14px` (`px-3.5`) | Light + Dark | **`real bug` (minor) / `estimate-based`** | `tokens/layout.json` `spacing.scale` (`4pt` গ্রিড)-এ `14` নেই। [`fields.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/fields.tsx) `SearchField`-এ `px-3.5` → `px-4` (`16px`) করা হয়েছে। |
| ৩ | `hit-target`: `<SearchField>` `<input>` (`305×22px`) | Light + Dark | **`real bug` (plugin)** | `44px` (`h-11`) সার্চ পিলের ভেতরে `<input>`-এ `h-full` না থাকায় ওপর/নিচের ১১px ক্লিক করলে ফোকাস হতো না। [`fields.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/fields.tsx) `<input>`-এ `h-full` যোগ করে `305×44px` করা হয়েছে। |
| ৪ | `hit-target`: `<Toggle>` (`64×28px`), `<Stepper>` `-`/`+` (`47×32px`), `<SegmentedControl>` ট্যাব (`118×32px`) | Light + Dark | **`real bug` (plugin)** | iOS ভিজ্যুয়াল উচ্চতা `28/32px` হলেও টাচ হিট-টার্গেট `>= 44px` করার জন্য `::after` এক্সটেন্ডার ছিল না। [`controls.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/controls.tsx)-এ `after:absolute after:-inset-y-2` (`Toggle`, `!mac`) এবং `after:-inset-y-1.5` (`SegmentedControl`, `Stepper`) যোগ করে `44px` হিট-এরিয়া দেওয়া হয়েছে। |
| ৫ | `hit-target`: ৭টি `<Button size="small">` (`width×32px`) | Light + Dark | **`false positive` (audit)** | [`button.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/button.tsx) আগেই `after:-inset-y-2` দিয়ে `48px` হিট-এরিয়া দেয়, কিন্তু অডিট স্ক্রিপ্টের `getBoundingClientRect()` `::after`/`::before` উপেক্ষা করছিল। [`qa/computed-style-audit.mjs`](file:///D:/Claude-Plugins/cupertino-forge/qa/computed-style-audit.mjs)-এ `effectiveHitRect()` যোগ করে `position: absolute` `::after`/`::before` মাপ যুক্ত করা হয়েছে। |
| ৬ | `contrast`: `#btn-open-sheet` (`prominentGlass`) → `1.00:1` | Light | **`false positive` (audit) → অতঃপর `real bug` (plugin)** | প্রথমে Chromium `color-mix()`-এর আউটপুট `color(srgb 0 0.533333 1 / 0.85)` আমাদের `parseCssColor` পার্স করতে না পারায় `#FFFFFF`-এর ওপর `1.00:1` দেখিয়েছিল। `parseCssColor`-এ CSS Color 4 `color(srgb ...)` সাপোর্ট যোগ করার পর আসল কন্ট্রাস্ট বের হয় **`2.94:1 < 3.0:1`** (`#btn-open-sheet` `85%` ও `#btn-open-nonmodal-sheet` `15%` দুটোই!)। ফলে [`cupertino.base.css`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/styles/cupertino.base.css)-এ tinted glass `85%` → `90%` (`3.17:1`) এবং [`button.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/button.tsx)-এ `tinted` `15%` → `12%` (`3.05:1`) করে আসল কন্ট্রাস্ট বাগ ফিক্স করা হয়েছে। |
| ৭ | `contrast`: `#env-telemetry` ও ২টি `ListRow` ভ্যালু (`text-label-2` = `#3C3C43@0.6` on `#FFFFFF` → `3.44:1`) | Light only (Dark-এ `6.47:1` PASS) | **`false positive` (Apple HIG vs WCAG AA)** | `#3C3C43@0.6` হলো Apple iOS 27 Sketch Kit-এর অফিশিয়াল `labelIOS.secondary.light` টোকেন (যা High Contrast মোডে `lightHC` হয়ে `~5.8:1` হয়)। [`qa/computed-style-audit.mjs`](file:///D:/Claude-Plugins/cupertino-forge/qa/computed-style-audit.mjs)-এ অফিশিয়াল `labelIOS.secondary`/`labelMacOS.secondary` টোকেন `>= 3.0:1` হলে নন-ব্লকিং `advisory` হিসেবে দেখানো হয়েছে (`< 3.0:1` বা অন্য যেকোনো কালার `< 4.5:1` হলে এখনো `FAIL`)। |

---

## ২. ফিক্সের পর চূড়ান্ত ফলাফল (Clean iOS App — `/`)

- **Playwright Chromium / WebKit / Firefox (`verify_mounted.py`, পূর্ণ `67.77 kB` CSS):** **7 / 7 PASS** (তিন ব্রাউজারেই)
- **Light Mode (`--platform ios --theme light`):** **12 / 12 PASS** (`scoreDisplay: 100 (3 advisories)`, **0 false positives**)
- **Dark Mode (`--platform ios --theme dark`):** **12 / 12 PASS** (`scoreDisplay: 100`, **0 false positives**)
- **Static Lint (`hooks/scripts/lint.mjs`):** **0 error(s), 0 warning(s)**

---

## ৩. macOS Clean Page অডিট (`/?view=mac`, `--platform mac`, Light ও Dark)

ওভারফিটিং যাচাই করতে [`tests/harness/web/src/App.tsx`](file:///D:/Claude-Plugins/cupertino-forge/tests/harness/web/src/App.tsx)-এ `MacWindow` (Sidebar, Toolbar, Inspector, `MacButton`, `Checkbox`, `RadioGroup`, `MacTable`) দিয়ে একটি আলাদা পরিষ্কার macOS পাতা (`/?view=mac`) যোগ করে `--platform mac` মোডে Light ও Dark-এ অডিট চালানো হয়েছে।

| # | Finding (`--platform mac`) | মোড | রায় | কী করা হয়েছে |
|---|---|---|---|---|
| ১ | `focus-ring`: `MacTable` কলাম হেডার বাটনে ফোকাস রিং নেই (২টি) | Light + Dark | **`real bug` (plugin)** | [`mac.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/mac.tsx) লাইন ১৮৫-এ `shadow-[inset_-0.5px_0_0_var(--cf-separator)]` বেস `:focus-visible` শ্যাডো ঢেকে দিচ্ছিল ও `focus-visible:focus-ring` অনুপস্থিত ছিল। `outline-none focus-visible:focus-ring` যোগ করে ঠিক করা হয়েছে। |
| ২ | `hit-target`: `MacButton` (`72×24px`) ও `Checkbox`/`RadioGroup` (`16×16px`) বনাম `>= 28px` | Light + Dark | **`false positive` (macOS audit)** | `tokens/layout.json`-এ macOS পয়েন্টারের অফিশিয়াল ন্যূনতম ক্লিকেবল ফ্লোর `hitTarget.macosMinimumClickable = 20px` (macOS regular button = `24px`), এবং `Checkbox`/`RadioGroup` `<label>`-এর ভেতরে থাকায় পুরো লেবেলই ক্লিকেবল (`>= 20px`)। শুধু `platform === 'macos'`-এর জন্য `macosMinimumClickable` ও `<label>` হিট-বক্স (এবং `mac.tsx` লেবেলে `min-h-5`) যুক্ত করা হয়েছে — iOS `44px` নিয়ম অপরিবর্তিত। |
| ৩ | `contrast`: সিলেক্টেড `MacSidebarRow`, `MacTable` রো ও `MacButton variant="default"`-এ `#FFFFFF` on `#0088FF` (`3.52:1`, `13px weight 400`) | Light + Dark | **`false positive` (Apple HIG trade-off)** | `#0088FF` ও `#FFFFFF` Apple macOS 27 Sketch Kit-এর অফিশিয়াল টোকেন (`>= 3.0:1`)। টোকেন না বদলে [`qa/ACCESSIBILITY-TRADEOFFS.md`](file:///D:/Claude-Plugins/cupertino-forge/qa/ACCESSIBILITY-TRADEOFFS.md)-এ নথিভুক্ত করা হয়েছে এবং শুধু `platform === 'macos'`-এ নন-ব্লকিং `advisory` হিসেবে দেখানো হয়েছে। |

- **macOS Light (`--platform mac --theme light`):** **12 / 12 PASS** (`scoreDisplay: 100 (6 advisories)`, **0 false positives**)
- **macOS Dark (`--platform mac --theme dark`):** **12 / 12 PASS** (`scoreDisplay: 100 (5 advisories)`, **0 false positives**)

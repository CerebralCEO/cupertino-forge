# QA Gaps & Known Limitations (`tests/seeded-defects/` — Phase 3a)

> প্রাথমিক Phase 3a রানে যে ২টি ডিফেক্ট মিস হয়েছিল (#৮ ও #৯), সেগুলো এখন বাড়তি হার্ডকোড ছাড়া [`qa/computed-style-audit.mjs`](file:///D:/Claude-Plugins/cupertino-forge/qa/computed-style-audit.mjs)-এ যুক্ত করে **Seeded Fixture (`12/12 Detected`)** এবং **Clean Mounted App (`12/12 PASS` Light ও Dark, `0` false positives)** উভয়েই যাচাই করা হয়েছে।

---

## ১. সমাধানকৃত DOM QA গ্যাপ (#৮ ও #৯)

1. **Defect #8 (`.cf-glass`-এ সলিড `background` ওভাররাইড) — এখন `DETECTED` (`glass-translucency`):**
   - `.cf-glass` বা `backdrop-filter != none` এলিমেন্টের `backgroundColor` alpha `>= 0.95` হলে `FAIL` দেয়।
   - `data-transparency="reduce"`, `data-contrast="more"`, `prefers-reduced-transparency: reduce`, `prefers-contrast: more`, বা `forced-colors: active` সক্রিয় থাকলে চুপ থাকে (টেস্টে `reduce-trans.html` দিয়ে যাচাইকৃত)।
2. **Defect #9 (`prefers-reduced-motion` উপেক্ষা) — এখন `DETECTED` (`reduced-motion`):**
   - `page.emulateMedia({ reducedMotion: 'reduce' })` চালিয়ে idle ও hover/press ইন্টারঅ্যাকশনের সময় `document.getAnimations()` পরীক্ষা করে কোনো চলমান spatial (`transform`/`scale`/`rotate`/`translate`) অ্যানিমেশন থাকলে `FAIL` দেয়; বিশুদ্ধ `opacity` ক্রস-ফেড অনুমোদিত।

---

## ২. অবশিষ্ট Known Limitations (সততার সাথে নথিভুক্ত)

1. **Static Lint (`hooks/scripts/lint.mjs`) সীমাবদ্ধতা (DOM-এ ধরা পড়ে, শুধু স্ট্যাটিক লিন্টে নয়):**
   - JSX inline camelCase স্টাইল (`style={{ fontSize: '23px', borderRadius: '15px', letterSpacing: '3px', padding: '13px' }}`) `lint.mjs`-এর CSS kebab-case রেজেক্সে ধরা পড়ে না।
   - হিট-টার্গেট (`30×30px`), `outline: none` বনাম `:focus-visible` রিং, সেমান্টিক কন্ট্রাস্ট (`#999999` বনাম `#FFFFFF`, বা গ্লাসের ওপর `label-glass-3`), `.cf-glass bg-bg` সলিড ওভাররাইড, এবং `@keyframes`/`animate-spin`-এ `prefers-reduced-motion` গার্ড না থাকা — এগুলো কেবল রানটাইম Playwright DOM অডিটেই নির্ভরযোগ্যভাবে ধরা পড়ে, স্ট্যাটিক `lint.mjs`-এ নয়।
2. **Reduced-Motion ইন্টারঅ্যাকশন কভারেজ সীমা:**
   - `computed-style-audit.mjs`-এর `reduced-motion` পাস idle অবস্থা ও প্রথম ৩টি দৃশ্যমান pressable কন্ট্রোলে hover/press পরীক্ষা করে। যেসব মোশন কেবল গভীর ফর্ম সাবমিট, ড্র্যাগ জেসচার বা নির্দিষ্ট স্টেট-মেশিন ট্রিগার ছাড়া চালু হয় না (যেমন কোনো কাস্টম ড্র্যাগ অ্যানিমেশন), সেগুলো স্বয়ংক্রিয়ভাবে ট্রিগার নাও হতে পারে।
3. **Self-Authored Fixture Upper-Bound সীমাবদ্ধতা:**
   - [`tests/seeded-defects/`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/index.html) ফিক্সচারটি অডিটরের লেখক নিজেই তৈরি করেছে; তাই নিয়ম-আওতাভুক্ত ডিফেক্টে `12/12` রেটকে প্রকৃত অজানা প্রোজেক্টের গ্যারান্টি না ভেবে **ওপরের সীমা (upper bound)** হিসেবে দেখতে হবে।

---

## ৩. সত্যিকারের Blind পরীক্ষা — ৫টি নিয়ম-বহির্ভূত ডিফেক্ট (`0 / 5 Detected`, `5 / 5 Known Gaps`)

`qa/computed-style-audit.mjs` এবং `hooks/scripts/lint.mjs`-এ `grep` করে নিশ্চিত হওয়া গেছে যে নিচের ৫টি ভুলের কোনোটির জন্যই কোনো নিয়ম নেই। [`tests/seeded-defects/`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/index.html)-এ এগুলো (`data-defect="13"` থেকে `"17"`) ঢুকিয়ে `lint.mjs` এবং `computed-style-audit.mjs` (Light ও Dark) চালানো হয়েছে — **কোনো নতুন নিয়ম বানানো হয়নি**:

| # | Blind ডিফেক্ট (`tests/seeded-defects/`) | `lint.mjs` | `computed-style-audit.mjs` (Light & Dark) | ফলাফল | Known Gap কারণ |
|---|---|---|---|---|---|
| ১৩ | ভুল `font-family` ফলব্যাক ক্রম (`'Segoe UI', -apple-system, sans-serif`) | **Missed** | **Missed** | **Known Gap** | `lint.mjs` কেবল `Roboto/Arial/Inter/...` ম্যাচ করে (`Segoe UI` নয়) এবং DOM অডিটে `font-family` ফলব্যাক অর্ডার চেক নেই। |
| ১৪ | আইকন ও টেক্সটের baseline অমিল (`align-items: flex-start` + `margin-top: 8px`) | **Missed** | **Missed** | **Known Gap** | আইকন বনাম টেক্সট ভার্টিকাল সেন্টার/বেসলাইন অ্যালাইনমেন্ট মাপার কোনো জ্যামিতিক নিয়ম নেই। |
| ১৫ | ভুল z-order (`.cf-glass` `z-index: 1`-এর ওপরে কনটেন্ট `z-index: 20`) | **Missed** | **Missed** | **Known Gap** | ফাংশনাল গ্লাস লেয়ার ও কনটেন্ট লেয়ারের স্ট্যাকিং কনটেক্সট / z-index তুলনা করার নিয়ম নেই। |
| ১৬ | স্ক্রল কনটেইনারে `overscroll-behavior` অনুপস্থিত (`overflow-y: auto`) | **Missed** | **Missed** | **Known Gap** | স্ক্রল কনটেইনারে `overscroll-behavior: contain/none` যাচাইয়ের কোনো নিয়ম নেই। |
| ১৭ | ডার্ক মোডে হার্ডকোডেড সাদা বর্ডার (`border: 1px solid white;`) | **Missed** | **Missed** | **Known Gap** | `lint.mjs`-এর `glass-border` শুধু `rgba?(255,255,255` খোঁজে, আর `computed-style-audit.mjs` এখনো `borderColor` অডিট করে না। |

**সামগ্রিক সৎ ফলাফল (১৭টি ডিফেক্ট):** `12 / 17` Detected (`9/9` মূল + `3/3` বিদ্যমান-নিয়ম blind + **`0/5` সত্যিকারের নিয়ম-বহির্ভূত blind**)।

---

## ৪. UX কীবোর্ড Blind পরীক্ষা (`tests/seeded-defects/keyboard.html` — Phase 3b-lite)

`qa/ux-keyboard.mjs` চালালে ৫টি জানা কীবোর্ড ডিফেক্টের **৫/৫টিই ধরা পড়েছে** (`no-positive-tabindex`, `tab-order-and-no-trap`, `focus-ring`, `modal-focus-trap-esc-return`, `roving-focus-ltr-rtl`, `enter-space-activation`), কিন্তু যে ২টি কীবোর্ড/অ্যাক্সেসিবিলিটি ভুলের জন্য কোনো নিয়ম লেখা হয়নি, সেগুলো ধরা পড়েনি (**`0 / 2` Known Gaps**):

| # | Blind কীবোর্ড ডিফেক্ট (`tests/seeded-defects/keyboard.html`) | `qa/ux-keyboard.mjs` | ফলাফল | Known Gap কারণ |
|---|---|---|---|---|
| kb-blind-1 | `aria-invalid="true"` ইনপুটে এরর মেসেজের সাথে `aria-describedby` যুক্ত নেই | **Missed** | **Known Gap** | `ux-keyboard.mjs` ফর্ম ভ্যালিডেশন `aria-describedby` রেফারেন্স লিংক যাচাই করে না। |
| kb-blind-2 | ন্যাভিগেশনের আগে "Skip to main content" লিংক অনুপস্থিত | **Missed** | **Known Gap** | `ux-keyboard.mjs` ল্যান্ডমার্ক স্কিপ-লিংক উপস্থিতি যাচাই করে না। |

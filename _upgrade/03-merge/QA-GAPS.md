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
   - [`tests/seeded-defects/`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/index.html) ফিক্সচারটি অডিটরের লেখক নিজেই তৈরি করেছে; তাই `12/12` ডিটেকশন রেটকে প্রকৃত অজানা প্রোজেক্টের গ্যারান্টি না ভেবে **ওপরের সীমা (upper bound)** হিসেবে দেখতে হবে।

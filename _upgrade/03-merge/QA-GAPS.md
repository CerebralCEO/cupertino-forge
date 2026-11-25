# QA Gaps Report (`tests/seeded-defects/` — Phase 3a)

> এই নথিতে `hooks/scripts/lint.mjs` এবং `qa/computed-style-audit.mjs` চালিয়ে যে প্ল্যান্টেড (seeded) ও স্ট্যাটিক ডিফেক্টগুলো **ধরা পড়েনি (`Missed`)**, সেগুলো কোনো অ্যাড-হক রুল দিয়ে লুকানো ছাড়াই স্পষ্টভাবে নথিভুক্ত করা হলো। পরবর্তী ধাপে অনুমোদন পেলে এই গ্যাপগুলো বন্ধ করা যাবে।

---

## ১. সম্পূর্ণ Missed Defects (উভয় টুলই ধরতে পারেনি)

### গ্যাপ ১: `.cf-glass`-এর ওপর সলিড `background` ওভাররাইড (Seeded Defect #8)
- **টেস্ট কেস:** [`tests/seeded-defects/defects.css`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/defects.css) (`.cf-glass.defect-solid-glass` → `background: var(--cf-bg) !important;`) ও [`DefectsSample.tsx`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/DefectsSample.tsx) (`className="cf-glass bg-bg"`).
- **কেন `lint.mjs` ধরতে পারেনি:** `var(--cf-bg)` ও `bg-bg` হলো বৈধ সেমান্টিক টোকেন; লিন্টারে কোনো রুল নেই যা একই এলিমেন্টে `.cf-glass`/`<Glass>`-এর সাথে সলিড ব্যাকগ্রাউন্ড (`bg-white`, `bg-bg`, `bg-bg-2`, `background: var(--cf-bg...)`) মেশানো আটকায়।
- **কেন `qa/computed-style-audit.mjs` ধরতে পারেনি:** `raw-color` শুধু দেখে ব্যাকগ্রাউন্ড কালার টোকেন প্যালেটে আছে কি না (`#FFFFFF` বৈধ টোকেন হিসেবে পাস করে), আর `glass-budget` শুধু একসাথে কতগুলো `backdrop-filter != none` এলিমেন্ট দৃশ্যমান তা গোনে (`<= 6`)। `[data-transparency="reduce"]` সক্রিয় না থাকা অবস্থায় `.cf-glass` এলিমেন্টের `backgroundColor` অ্যালফা `1.0` (সলিড) হয়ে গেলে সেটি ধরার কোনো চেক এখনো নেই।
- **প্রস্তাবিত ভবিষ্যৎ ফিক্স:**
  1. `computed-style-audit.mjs`-এ গ্লাস এলিমেন্টের জন্য: `dataset.transparency !== 'reduce'` ও `dataset.contrast !== 'more'` অবস্থায় `.cf-glass` (বা `backdropFilter !== 'none'`) এলিমেন্টের `backgroundColor` alpha `< 0.99` হতে হবে (অর্থাৎ সলিড `alpha === 1` হলে `FAIL`)।
  2. `lint.mjs`-এ: একই JSX/HTML এলিমেন্টে `cf-glass` / `<Glass` এবং সলিড ব্যাকগ্রাউন্ড ক্লাস (`bg-white`, `bg-black`, `bg-bg`, `bg-bg-2`, `bg-bg-3`, `bg-bg-grouped*`) একসাথে থাকলে `error`।

### গ্যাপ ২: `prefers-reduced-motion` উপেক্ষা করা (Seeded Defect #9)
- **টেস্ট কেস:** [`tests/seeded-defects/defects.css`](file:///D:/Claude-Plugins/cupertino-forge/tests/seeded-defects/defects.css) (`.defect-ignores-reduced-motion` → `@keyframes cf-defect-spin` + `animation: cf-defect-spin 1.2s linear(0, 0.5, 1) infinite !important;` এবং কোনো `@media (prefers-reduced-motion: reduce)` নিষ্ক্রিয়করণ ছাড়া)।
- **কেন `lint.mjs` ধরতে পারেনি:** CSS-এ `@keyframes` বা `animation:` ও TSX-এ Tailwind `animate-*` ব্যবহারের পাশে `@media (prefers-reduced-motion: reduce)` বা `useReducedMotion` গার্ড আছে কি না, তা পরীক্ষা করার কোনো AST/লাইন রুল `lint.mjs`-এ নেই।
- **কেন `qa/computed-style-audit.mjs` ধরতে পারেনি:** বর্তমান `computed-style-audit.mjs` কেবল ডিফল্ট মোশন মোডে একটি সিঙ্গেল-পাস DOM স্ক্যান চালায় (`easing` শুধু `linear(...)` বনাম `ease` কার্ভ চেক করে)। এটি `page.emulateMedia({ reducedMotion: 'reduce' })` চালিয়ে কোনো চলমান `animationName !== 'none'` বা `iterationCount === 'infinite'` বা spatial transform-সক্রিয় অ্যানিমেশন থামছে/ছোট হচ্ছে কি না তা যাচাই করে না।
- **প্রস্তাবিত ভবিষ্যৎ ফিক্স:**
  1. Phase 3b-এর multi-state Playwright ম্যাট্রিক্স (`qa/computed-style-audit.mjs` বা `qa/ux-keyboard.mjs`)-এ `emulateMedia({ reducedMotion: 'reduce' })` পাস যোগ করে ইনফিনিট বা `> 250ms` চলমান অ্যানিমেশন (`animationName !== 'none' && animationPlayState === 'running'`) ফ্ল্যাগ করা।
  2. `lint.mjs`-এ Tailwind `animate-spin`/`animate-bounce`/`animate-pulse` (reduced-motion প্রিফিক্স ছাড়া) বা `@keyframes`/`animation:` ওয়ার্নিং/এরর বিবেচনা করা।

---

## ২. আংশিক বা মাধ্যম-ভিত্তিক স্ট্যাটিক লিন্ট গ্যাপ (`lint.mjs` সীমাবদ্ধতা, DOM-এ ধরা পড়েছে)

নিচের ডিফেক্টগুলো `qa/computed-style-audit.mjs` (Playwright DOM)-এ **নির্ভুলভাবে ধরা পড়েছে**, কিন্তু শুধু স্ট্যাটিক `lint.mjs` চালালে নিচের ফর্মগুলো এড়িয়ে যায়:

1. **JSX inline camelCase styles (`fontSize: '23px'`, `borderRadius: '15px'`):** `lint.mjs`-এর `css-font-size` ও `css-radius` রেজেক্স kebab-case CSS (`font-size:`, `border-radius:`) খোঁজে; React JSX `style={{ fontSize: '23px', borderRadius: '15px' }}` স্ট্রিংয়ে ম্যাচ করে না।
2. **অ্যাক্সেসিবিলিটি হিট-টার্গেট (`w-[30px] h-[30px]`, CSS `width: 30px; height: 30px`) এবং `outline-none`:** স্ট্যাটিক টেক্সট-লিন্টার `<button>`-এর `padding`/`min-width` সমীকরণ বুঝতে পারে না, এবং `outline-none` অনেক সময় `focus-visible:ring` বা ইনপুট র‍্যাপারের সাথে বৈধ হতে পারে—ফলে কেবল রিয়েল DOM অডিটই এগুলো নির্ভরযোগ্যভাবে ধরে (`hit-target`, `focus-ring`)।
3. **সেমান্টিক কন্ট্রাস্ট (`#999999` on `#FFFFFF`):** `#999999` এবং `#FFFFFF` দুটোই `tokens/color.json`-এ আছে (`labelVibrantIOS.secondary` এবং `backgroundIOS.primary`), তাই কোনো বৈধ-টোকেন জোড়ার কন্ট্রাস্ট ব্যর্থতা স্ট্যাটিক টোকেন-নামের লিন্ট দিয়ে ধরা যায় না — এর জন্য রিয়েল DOM `contrast` কম্পিউটেশনই (`2.85:1 < 4.5:1`) অপরিহার্য।

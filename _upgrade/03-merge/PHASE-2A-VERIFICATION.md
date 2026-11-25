# Phase 2a Real TSX Type-Check, React Mount (Chromium + Playwright WebKit) ও Diff Audit রিপোর্ট

**শাখা (Branch):** `upgrade/apple-dna-v2`  
**স্ক্র্যাচ হার্নেস (gitignored):** `_upgrade/scratch/tsx-check/` (`React 19.1`, `Motion 12.15`, `Radix UI`, `Tailwind CSS v4`, `Vite 6`, `TypeScript 5.8 strict`)

---

## ১. রিয়েল TSX Type-Check (`tsc --noEmit --strict`)

- **কমান্ড:** `_upgrade/scratch/tsx-check/`-এ `npx tsc --noEmit` (এবং `--listFiles` দিয়ে ফাইল নিশ্চিতকরণ)।
- **যাচাইকৃত প্লাগিন ফাইল:** `skills/apple-web/assets/`-এর **২২টি** `.ts` ও `.tsx` ফাইলের সবকটি (`platform.ts`, `haptics.ts`, `sounds.ts`, `squircle.ts`, `theme-script.ts`, `cn.ts`, `root.tsx`, `glass.tsx`, `squircle.tsx`, `feedback.tsx`, `button.tsx`, `controls.tsx`, `tab-bar.tsx`, `sheet.tsx`, `alert.tsx`, `nav.tsx`, `list.tsx`, `fields.tsx`, `menu.tsx`, `popover.tsx`, `mac.tsx`, `icon.tsx`) `path-alias` (`@/lib/cupertino/*`, `@/components/apple/*`, `@/styles/cupertino/*`) সহ `strict: true` মোডে টাইপ-চেক হয়েছে।
- **ফলাফল:** **0 TypeScript errors** (`tsconfig.json`-এ বাইরের ফোল্ডার থেকে `_upgrade/scratch/tsx-check/node_modules` রেজোলিউশন যুক্ত করার পর প্লাগিন `.ts`/`.tsx` কোডে কোনো TS error পাওয়া যায়নি)।

---

## ২. রিয়েল মাউন্টেড React (Vite Production Build) Playwright যাচাই — Chromium, Playwright WebKit ও Firefox

`vite build` + `vite preview` সার্ভারে আসল `<CupertinoRoot>`, `<Glass>`, `<Squircle>`, `<Sheet>`, `<TabBar>`, `<SegmentedControl>`, `<Toggle>`, ও `<Alert>` রেন্ডার করে Playwright দিয়ে Chromium, **Playwright WebKit (`Version/18.2 Safari/605.1.15` — real Apple Safari নয়, Playwright WebKit ইঞ্জিন)** ও **Firefox (`Gecko/132.0`)** তিন ইঞ্জিনেই **৭/৭** চেক চালানো হয়েছে।

> **সংশোধনী (Phase 3a অডিটে ধরা পড়া `@source` হার্নেস বাগ):** প্রাথমিক Phase 2a রান (`45.56 kB` CSS)-এ হার্নেসের `src/app.css`-এ `@source "../../../skills/apple-web/assets"` (৪ ধাপের বদলে ৩ ধাপ) থাকায় অর্ধেক Tailwind utility CSS জেনারেট হয়েছিল। Phase 3a-তে `@source "../../../../skills/apple-web/assets"` ঠিক করার পর পূর্ণ CSS (`67.73 kB`, `gzip: 12.93 kB`)-এ তিনটি ব্রাউজারেই পুনরায় যাচাই চালানো হয়েছে:
> - **Chromium (পূর্ণ `67.73 kB` CSS):** **7 / 7 PASS** (Sheet `height: 793.36px` = সঠিক `94dvh`)
> - **Playwright WebKit (পূর্ণ `67.73 kB` CSS):** **7 / 7 PASS** (`height: 793.36px`, `top: 396.50px`)
> - **Playwright Firefox (পূর্ণ `67.73 kB` CSS):** **7 / 7 PASS** (`height: 793.35px`, `top: 396.67px`)
> - পুরো রিপোজিটরিতে (`README.md`, `commands/*.md`, `skills/**/*.md`) `@source` খুঁজে দেখা গেছে এই ভুলটি শুধু হার্নেসের out-of-tree পাথেই সীমাবদ্ধ ছিল; `/apple-init` ও ব্যবহারকারীর প্রজেক্টে কম্পোনেন্টগুলো প্রজেক্টের ভেতরে কপি হয় বলে এই সমস্যা নেই।

### ২.১ ধরা পড়া ও প্লাগিনে সরাসরি ঠিক করা ২টি বাস্তব রানটাইম বাগ

| # | বাগ / ধরা পড়া সমস্যা | প্রভাবিত প্লাগিন ফাইল | কার্যকর করা ফিক্স |
|---|---|---|---|
| ১ | **WebKit `-webkit-backdrop-filter` blur ড্রপ বাগ:** Playwright WebKit-এ unprefixed `backdrop-filter` সাপোর্টেড নয় (`CSS.supports('backdrop-filter', ...)` = `false`), এবং WebKit CSS পার্সার `-webkit-backdrop-filter: var(--cf-glass-filter)` দিলে কম্পিউটেড ফিল্টার `'none'` করে ফেলে। তাছাড়া Tailwind v4-এর LightningCSS `@supports not (backdrop-filter: blur(1px))`-কে `@supports not ((-webkit-backdrop-filter:...) or (backdrop-filter:...))`-এ রূপান্তর করে অকার্যকর করে দিচ্ছিল। | [`scripts/build-tokens.mjs`](file:///D:/Claude-Plugins/cupertino-forge/scripts/build-tokens.mjs) | Tailwind v4 ব্যবহৃত WebKit-এক্সক্লুসিভ ফিচার কুয়েরি `@supports (-webkit-hyphens: none)` ব্লকে `tokens/materials.json` থেকে সরাসরি `.cf-glass`, `clear`, `large`, `menu` (লাইট ও ডার্ক) লিটারাল `-webkit-backdrop-filter` ও `[data-transparency="reduce"]` / `[data-contrast="more"]`-এ `none` ওভাররাইড জেনারেট করা হয়েছে। |
| ২ | **`Sheet` মিডিয়াম ডিটেন্টে পরপর ২য় ড্র্যাগ আটকে যাওয়া:** `large` → `medium` ডিটেন্ট বদলের পর `animate={{ y: '42dvh' }}` ও `dragConstraints` একই `motion.div`-এ থাকায় `medium` থেকে নিচে ড্র্যাগ করলে `y` ওপরে লাফিয়ে উঠছিল (`top: 397 → 223`) বা ড্র্যাগ কাজ করছিল না। | [`sheet.tsx`](file:///D:/Claude-Plugins/cupertino-forge/skills/apple-web/assets/components/apple/sheet.tsx) | বাইরের `motion.div`-এ শুধু ডিটেন্ট/ওপেন/ক্লোজ `y` (`42dvh` / `0%` / `100%`) রাখা হয়েছে এবং ভেতরের ড্র্যাগেবল `motion.div`-কে `y: 0`-তে `dragSnapToOrigin` দিয়ে আলাদা করা হয়েছে। এতে Chromium ও WebKit দুটোতেই `large -> medium` স্ক্রল হ্যান্ডঅফ এবং `medium -> dismiss` ড্র্যাগ ১:১ কাজ করে। |

### ২.২ Chromium ও Playwright WebKit ফলাফল (`7/7 PASS` উভয় ব্রাউজারে)

| # | যাচাইকৃত দৃশ্যকল্প | Chromium ফলাফল | Playwright WebKit (UA Safari 18.2 — real Safari নয়) ফলাফল |
|---|---|---|---|
| ১ | ডার্ক মোড প্রথম পেইন্টে zero-FOUC (`CF_THEME_INIT_SCRIPT`) | **PASS** — React মাউন্টের আগেই `themeBeforeReact: 'dark'`, `bgColor: 'rgb(0, 0, 0)'` | **PASS** — `themeBeforeReact: 'dark'`, `bgColor: 'rgb(0, 0, 0)'` |
| ২ | ইন-অ্যাপ `setTransparency('reduce')` দিয়ে আসল `<Glass>` solid হওয়া | **PASS** — `dataset: 'reduce'`, `bf: 'none'`, `bg: 'rgb(38, 38, 38)'` | **PASS** — `dataset: 'reduce'`, `bf: 'none'`, `bg: 'rgb(38, 38, 38)'` |
| ৩ | আসল `<Toggle>` চাপা অবস্থায় translucent glass (`bg-white` নেই) | **PASS** — unpressed `bg-white` (`rgb(255,255,255)`), pressed `cf-glass` (`rgba(255, 255, 255, 0.58)`, `blur(12px) saturate(1.8) brightness(1.05)`) | **PASS** — unpressed `bg-white`, pressed `cf-glass` (`rgba(255, 255, 255, 0.58)`, `blur(12px) saturate(1.8) brightness(1.05)`) |
| ৪ | আসল `<TabBar>` ও `<SegmentedControl>` arrow-key roving focus (LTR ও RTL) + ইনার ক্যাপসুল | **PASS** — `ArrowRight` → `Browse` (`tabIndex=0`), RTL `ArrowLeft` → `Week`, `.cf-glass-capsule-active` সক্রিয় | **PASS** — `ArrowRight` → `Browse`, RTL `ArrowLeft` → `Week`, `.cf-glass-capsule-active` সক্রিয় |
| ৫ | আসল `<Sheet>` GPU `y` ও `scrollTop <= 0` scroll-handoff ড্র্যাগ ডিসমিস | **PASS** — `scrollTop=250` অবস্থায় ড্র্যাগ খুলেনি; `scrollTop=0`-তে ড্র্যাগ `large -> medium` (`top: 396.5`) স্ন্যাপ ও হেডার ড্র্যাগে ডিসমিস (`count=0`) | **PASS** — `scrollTop=250` খোলা ছিল; `scrollTop=0` ড্র্যাগে `medium` (`top: 396.5`) ও হেডার ড্র্যাগে ডিসমিস (`count=0`) |
| ৬ | `prefers-reduced-motion: reduce` + `<Alert>` ফোকাসড Cancel + `Enter` | **PASS** — `data-reduced-motion="true"`, `--cf-dur-snappy: .2s`, `--cf-ease-snappy: linear(0, 1)`, Alert result `'cancelled'` | **PASS** — `data-reduced-motion="true"`, `--cf-dur-snappy: .2s`, `--cf-ease-snappy: linear(0, 1)`, Alert result `'cancelled'` |
| ৭ | `!corner-shape` মোডে `<Squircle>` ও `<Glass shape="rect">` SVG `mask-image` ও আউটার `box-shadow` | **PASS** — `sqAttr: 'mask'`, `hasCardMask: True`, `hasGlassMask: True`, আউটার শ্যাডো অক্ষুণ্ণ | **PASS** — `sqAttr: 'mask'`, `hasCardMask: True`, `hasGlassMask: True`, আউটার শ্যাডো অক্ষুণ্ণ |

---

## ৩. বিদ্যমান `tests/helpers/run-web-browser-checks.py`-এর স্বরূপ (HTML/CSS Fixture বনাম React Mount)

[`tests/helpers/run-web-browser-checks.py`](file:///D:/Claude-Plugins/cupertino-forge/tests/helpers/run-web-browser-checks.py) (যা `node --test tests/*.test.mjs` থেকে চলে) **আসল React `.tsx` কম্পোনেন্ট মাউন্ট করে না** — প্লাগিন রিপোজিটরির নিজস্ব `node_modules`-বিহীন টেস্ট স্যুইট হিসেবে এটি একটি **স্ট্যাটিক HTML/CSS/JS ফিক্সচারে** আসল জেনারেটেড `cupertino.tokens.css`, আসল `cupertino.base.css`, আসল `CF_THEME_INIT_SCRIPT`, ও আসল `squircleMaskDataUrl` ফাংশন লোড করে নিম্নোক্ত ৮টি **HTML/CSS ফিক্সচার চেক** চালায়:

1. `CF_THEME_INIT_SCRIPT` প্রি-হাইড্রেশন স্ক্রিপ্ট (`localStorage` থেকে `data-theme`/`contrast`/`transparency`) — *HTML ফিক্সচার*
2. `data-transparency="reduce"` ৪টি `.cf-glass` সারফেসে (`light`/`dark`) — *HTML/CSS ফিক্সচার*
3. নিঃশর্ত `translateZ(0)` না থাকা ও `position: fixed` ডিসেন্ড্যান্ট কন্টেইনিং-ব্লক চেক — *HTML/CSS ফিক্সচার*
4. SVG squircle `mask-image` ও আউটার `box-shadow` সংরক্ষণ — *HTML/CSS + `squircleMaskDataUrl` ফিক্সচার*
5. `bg-white` বনাম `cf-glass` Tailwind ক্যাসকেড লেয়ার প্রুফ ও ট্রান্সলুসেন্সি — *HTML/CSS ফিক্সচার*
6. `prefers-reduced-motion: reduce` (`--cf-dur-snappy`, `--cf-ease-snappy`, `.cf-press:active` transform) — *HTML/CSS ফিক্সচার*
7. `data-cf-font="inter"` অবস্থায় `lang="bn"` ও `lang="ar"` zero `letter-spacing` সুরক্ষা — *HTML/CSS ফিক্সচার*
8. `[role="tablist"]` RTL-সচেতন রোভিং `tabIndex` JS হ্যান্ডলার — *JS ফিক্সচার সিমুলেশন*

পক্ষান্তরে উপরের **সেকশন ২**-এর ৭টি চেক সরাসরি আসল `.tsx` ফাইলগুলোর Tailwind v4 + React 19 + Motion 12 + Radix কম্পাইলড Vite প্রোডাকশন বান্ডেলে চালানো হয়েছে।

---

## ৪. `git diff --numstat 8b4493a..HEAD` (`skills/apple-web/assets/` ও `build-tokens.mjs`)

| ফাইল | `+যোগ` | `-বিয়োগ` | মোট লাইন | পরিবর্তনের ব্যাখ্যা (যেখানে বদল বড় সেখানে কারণসহ) |
|---|---:|---:|---:|---|
| `components/apple/root.tsx` | `+135` | `-19` | `215` | **বড় পরিবর্তন (যাচিত):** Safari `prefers-reduced-transparency` না থাকায় `transparency`/`contrast` স্টেট+সেটার ও `localStorage` সিঙ্ক, `<MotionConfig>`, শেয়ার্ড `<TooltipPrimitive.Provider>`, `matchMedia` দিয়ে `resize` প্রতিস্থাপন ও প্রপ সিঙ্ক যুক্ত হয়েছে। |
| `components/apple/sheet.tsx` | `+89` | `-24` | `149` | **বড় পরিবর্তন (যাচিত):** লেআউট `height` অ্যানিমেশন সরিয়ে GPU `y`-only বাইরের কনটেইনার + ভেতরের `y=0` ড্র্যাগেবল সারফেস, `scrollTop <= 0` স্ক্রল হ্যান্ডঅফ, নন-মডাল `modal` প্রপ ও `reducedMotion` ক্রসফেড। |
| `components/apple/glass.tsx` | `+70` | `-2` | `132` | **বড় পরিবর্তন (যাচিত):** `asChild` DOM লিক ফিক্স এবং `!squircleNative` ব্রাউজারে `shape="rect"`-এর জন্য `ResizeObserver` + `squircleMaskDataUrl` ও আউটার শ্যাডো র‍্যাপার। |
| `components/apple/squircle.tsx` | `+58` | `-11` | `94` | **বড় পরিবর্তন (যাচিত):** `clipPath` সরিয়ে SVG `maskImage`, আউটার `shadow-*`/`boxShadow` র‍্যাপার স্প্লিট (`SHADOW_TOKEN_RE`), ও `forwardRef`। |
| `components/apple/controls.tsx` | `+44` | `-12` | `155` | **মাঝারি পরিবর্তন (যাচিত):** `Toggle`/`Slider`-এ `cf-glass` বনাম `bg-white` ক্যাসকেড ফিক্স, `onPointerCancel`, `SegmentedControl` রোভিং `tabIndex` ও RTL অ্যারো কী। |
| `components/apple/tab-bar.tsx` | `+38` | `-8` | `96` | `<Glass lens>` র‍্যাপার থেকে `motion.div layout` অপসারণ, `.cf-glass-capsule-active`, রোভিং `tabIndex` ও RTL অ্যারো কী। |
| `styles/cupertino.base.css` | `+42` | `-3` | `182` | নিঃশর্ত `translateZ(0)` অপসারণ, `.cf-glass-capsule-active`, Inter `:not(:lang(bn/ar/he))`, ডার্ক শিন স্কেলিং, কম্পোনেন্ট `--cf-*` ভেরিয়েবল ও `@keyframes cf-spin`। |
| `scripts/build-tokens.mjs` | `+33` | `-1` | `617` | কম্পোনেন্ট জ্যামিতি `--cf-*` ভেরিয়েবল, `[data-reduced-motion="true"]`, ও WebKit `@supports (-webkit-hyphens: none)` গ্লাস ফলব্যাক। |
| `components/apple/nav.tsx` | `+13` | `-7` | `104` | `large` অবস্থায় একক `<h1>` ফিক্স + `min-w-11` + `--cf-glyph-bar`। |
| `components/apple/mac.tsx` | `+12` | `-12` | `209` | নিষ্ক্রিয় উইন্ডো `shadow-window-inactive`, সব বাটনে `type="button"`, `--cf-*` টোকেন প্রতিস্থাপন। |
| `components/apple/popover.tsx` | `+9` | `-11` | `46` | ডুপ্লিকেট `TooltipPrimitive.Provider` অপসারণ (`CupertinoRoot`-এ স্থানান্তরিত)। |
| `components/apple/list.tsx` | `+9` | `-4` | `100` | নেস্টেড `<section>` ফিক্স, `insetInlineStart` RTL সেপারেটর ও `--cf-*` টোকেন। |
| `lib/theme-script.ts` | `+9` | `-0` | `9` | নতুন প্রি-হাইড্রেশন zero-FOUC স্ক্রিপ্ট ও `<CupertinoThemeScript />`। |
| `components/apple/alert.tsx` | `+6` | `-6` | `98` | বাটনে `Enter` কনফ্লিক্ট গার্ড + `--cf-alert-w`। |
| `lib/squircle.ts` | `+6` | `-0` | `59` | `squircleMaskDataUrl()` হেল্পার যোগ। |
| `components/apple/button.tsx` | `+5` | `-4` | `112` | `variantCls` ডেড-কোড ফিক্স + `type="button"` + `--cf-*`। |
| `components/apple/menu.tsx` | `+4` | `-4` | `108` | `last:hidden` ট্রেইলিং সেপারেটর + `--cf-*` টোকেন। |
| `components/apple/feedback.tsx` | `+2` | `-3` | `74` | ডুপ্লিকেট `<style>` অপসারণ + `--cf-*` টোকেন। |
| `components/apple/fields.tsx` | `+1` | `-1` | `76` | `min-h-[var(--cf-row-min-h)]`। |

কোনো ফাইলে অযথা বা অস্বাভাবিক রি-রাইট নেই; প্রতিটি পরিবর্তন সরাসরি Phase 2a বাগ ফিক্স বা WebKit যাচাইয়ের ঘাটতি পূরণে সীমাবদ্ধ।

---

## ৫. সর্বশেষ পূর্ণ টেস্ট ও ভেরিফিকেশন রান (সব ফিক্সের পর)

- `npx tsc --noEmit` (`_upgrade/scratch/tsx-check/`): **0 errors** (২২টি ফাইল)
- `vite build` + Playwright Chromium (`verify_mounted.py --browser chromium`): **7 / 7 PASS**
- `vite build` + Playwright WebKit (`verify_mounted.py --browser webkit` — *Playwright WebKit UA Safari 18.2, real Safari নয়*): **7 / 7 PASS**
- `node --test tests/*.test.mjs`: **11 / 11 PASS**
- `node scripts/verify-plugin.mjs`: **8 PASS, 0 NOT RUN, 0 FAIL**
- `node scripts/contrast-check.mjs --accent "#0088FF"`: **0 blocking failures**

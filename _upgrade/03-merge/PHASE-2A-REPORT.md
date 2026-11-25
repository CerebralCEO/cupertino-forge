# Phase 2a রিপোর্ট — Web Adapter সংশোধন, iOS/macOS Component Specs ও Playwright Browser যাচাই

**শাখা (Branch):** `upgrade/apple-dna-v2`  
**পূর্ববর্তী প্রি-2a কমিট:** `8b4493a` (`Phase 1 fix: restore dropped foundation rules and document motion.json additions`)

---

## ১. Web Adapter সংশোধনের সারসংক্ষেপ

| # | বাগ / উন্নয়ন | পরিবর্তিত ফাইল | কার্যকর করা সমাধান |
|---|---|---|---|
| ১ | Squircle মাস্ক ও আউটার `box-shadow` সংরক্ষণ + `Glass` `asChild` লিক ও `rect` ফলব্যাক | `lib/squircle.ts`, `components/apple/squircle.tsx`, `components/apple/glass.tsx` | `clipPath` বাদ দিয়ে SVG `maskImage` (`squircleMaskDataUrl`) ব্যবহার; `!squircleNative` অবস্থায় শ্যাডো ক্লাস ও ইনলাইন `boxShadow` বাইরের নন-মাস্কড র‍্যাপারে সরানো হয়েছে; `Glass`-এ `asChild` ডিস্ট্রাকচার করে DOM লিক বন্ধ ও `shape="rect"` ফলব্যাক যুক্ত হয়েছে। |
| ২ | ইন-অ্যাপ Reduce Transparency ও High Contrast সেটিং | `components/apple/root.tsx` | `CupertinoRoot` ও `useCupertino()`-এ `transparency`, `contrast`, `setTransparency`, `setContrast`, `resolvedTransparency`, `resolvedContrast` যোগ ও `localStorage` (`cf-transparency`, `cf-contrast`, `cf-theme`)-এ সংরক্ষণ (Safari-তে `@media (prefers-reduced-transparency)` নেই বলে আবশ্যক)। |
| ৩ | JS Reduced Motion ও শেয়ার্ড Tooltip Provider | `components/apple/root.tsx`, `popover.tsx` | `<MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>` এবং `<TooltipPrimitive.Provider delayDuration={1000}>` এক জায়গায় `CupertinoRoot`-এ বসানো হয়েছে; `Tooltip` থেকে ডুপ্লিকেট প্রোভাইডার সরানো হয়েছে। |
| ৪ | `Sheet` GPU-only `y` অ্যানিমেশন, scroll-top handoff ও নন-মডাল মিডিয়াম ডিটেন্ট | `components/apple/sheet.tsx` | `height` অ্যানিমেশন সরিয়ে স্থির `h-[94dvh]`-এর ওপর শুধু `y` ট্রান্সফর্ম (`42dvh` / `0%` / `100%`) চালু করা হয়েছে; `scrollTop <= 0`-তে নিচে টানলে `drag.start(e)` হ্যান্ডঅফ, `modal={false}` সাপোর্ট, ও `reducedMotion` ক্রসফেড যোগ হয়েছে। |
| ৫ | `TabBar` ও `SegmentedControl` কীবোর্ড ন্যাভিগেশন ও ইনার গ্লাস ক্যাপসুল | `components/apple/tab-bar.tsx`, `components/apple/controls.tsx`, `styles/cupertino.base.css` | `<Glass lens>`-এর ওপরের `motion.div layout` র‍্যাপার সরানো হয়েছে; `bg-fill-3`-এর বদলে `.cf-glass-capsule-active` ইনার ক্যাপসুল; রোভিং `tabIndex` ও RTL-সচেতন `ArrowLeft`/`ArrowRight`/`Home`/`End` সাপোর্ট যোগ হয়েছে। |
| ৬ | Toggle ও Slider নবে `bg-white` বনাম `.cf-glass` Tailwind ক্যাসকেড দ্বন্দ্ব | `components/apple/controls.tsx` | `bg-white` আর `cf-glass` একসাথে না রেখে `pressed && !mac ? 'cf-glass' : 'bg-white'` এবং `drag && !mac ? 'cf-glass' : 'bg-white'` মিউচুয়ালি এক্সক্লুসিভ করা হয়েছে + `onPointerCancel` যোগ হয়েছে। |
| ৭ | প্রি-হাইড্রেশন FOUC প্রতিরোধ ও `matchMedia` লিসেনার | `lib/theme-script.ts`, `components/apple/root.tsx` | নতুন `CF_THEME_INIT_SCRIPT` / `<CupertinoThemeScript />` তৈরি (রেন্ডারের আগেই `data-theme`, `data-contrast`, `data-transparency` সেট করে); `CupertinoRoot`-এ `appearance` প্রপ সিঙ্ক ও অনির্ধারিত `resize`-এর বদলে `matchMedia` লিসেনার। |
| ৮ | `Button` `glass`/`prominentGlass` ডেড-কোড ফিক্স | `components/apple/button.tsx` | `!isGlass && variantCls[variant]` বদলে `variantCls[variant]` করা হয়েছে যাতে `text-label-glass` ও `text-accent-contrast` প্রযোজ্য হয়। |
| ৯ | অ্যাক্সেসিবিলিটি, RTL ও DOM স্ট্রাকচার সংশোধন | `alert.tsx`, `nav.tsx`, `list.tsx`, `mac.tsx`, `menu.tsx`, `feedback.tsx` | `Alert` `Enter` বাটন ফোকাস গার্ড; `NavBar` একক `<h1>` (`large` হলে ইনলাইন টাইটেল `<motion.span aria-hidden>`); `ListSection` ভেতরের `<section>` → `div` এবং বিভাজকে `insetInlineStart`; `MacWindow` নিষ্ক্রিয় উইন্ডোতে `shadow-window-inactive` + সব বাটনে `type="button"`; `MenuSection`-এ `last:hidden` সেপারেটর; `ActivityIndicator`-এর ইনলাইন `<style>` সরিয়ে `cupertino.base.css`-এ `@keyframes cf-spin`। |
| ১০ | নিঃশর্ত `translateZ(0)`, ডার্ক শিন, Inter নন-ল্যাটিন ও সব হার্ডকোডেড `[Npx]` অপসারণ | `scripts/build-tokens.mjs`, `cupertino.base.css`, `components/apple/*.tsx` | `.cf-glass` থেকে নিঃশর্ত `transform: translateZ(0)` সরিয়ে `[data-pressable="true"]` ও `[data-lens="true"]`-এ শর্তসাপেক্ষ `will-change: transform`; `Inter` `-0.01em` থেকে `:lang(bn/ar/he)` বাদ; ডার্ক শিনে `--cf-glass-intensity` স্কেলিং; ৩৪+ `[Npx]` ক্লাস `--cf-*` ভেরিয়েবলে রূপান্তর (`tokens/*.json`-এর কোনো মান না বদলে)। |

---

## ২. Web Parity ম্যাট্রিক্স ও iOS/macOS Component Spec আপডেট

- **`skills/apple-web/SKILL.md` ও `references/components-web.md`**: Safari বনাম Chromium **"Native / Approximation / Not possible"** প্যারিটি টেবিল (`14-platform-parity-matrix.md` ভিত্তিক), `<CupertinoThemeScript />`, `transparency`/`contrast` সেটার ও `Sheet` `modal` প্রপ নথিভুক্ত।
- **`skills/apple-design-core/references/components-ios/{content,controls,navigation,presentation}.md`**: প্রতিটি কম্পোনেন্টে `[official]`/`[measured]`/`[inferred]`/`[estimate]` প্রমাণ ট্যাগ ও `Verify:` চেকলাইন; নতুন করে যোগ হয়েছে Widgets (`16pt`/`11pt` মার্জিন, `11pt` ন্যূনতম ফন্ট), Live Activities (`14pt` Lock Screen মার্জিন, `28×28pt` সীমিত প্রস্থ, সর্বোচ্চ ১টি ইন্টারঅ্যাকটিভ কন্ট্রোল), লিস্টে টাইটেল-কেস হেডার ও ভার্টিকাল ইনডেক্স নিয়ম, `1–2` prominent button সীমা, পিকার `60` বিভাজ্য মিনিট রুল, `.tabBarMinimizeBehavior(.onScrollDown)` + `Tab(role: .search)`, `Cancel` leading / `Done` trailing শিট, ও Alert বনাম Action Sheet সিদ্ধান্ত নিয়ম।
- **`skills/apple-design-core/references/components-macos/{content,controls,navigation,presentation,window-chrome}.md`**: প্রমাণ ট্যাগ + `Verify:` চেকলাইন; নতুন করে যোগ হয়েছে `OutlineView` কোলন-মুক্ত হেডার, `.backgroundExtensionEffect()`, `macos.button.imagePadding: 10pt`, Mac টাচ ডিসপ্লে (`Oct 2026`) স্থির লেআউট নিয়ম, Switch/Checkbox/Radio (`<=5`) ও `>5` হলে Pop-Up বাটন, `1pt` স্প্লিট ডিভাইডার, `ToolbarSpacer.fixed`, `File > Duplicate` (`Option` → `Save As…`), উইন্ডো-ফ্রেম কন্ট্রোল নিষেধাজ্ঞা এবং `AppMenu > Settings… (Cmd+,)` নিয়ম।

---

## ৩. চালানো পরীক্ষা (Tested) বনাম না-চালানো অংশ (`NOT RUN`)

### ৩.১ বাস্তবে চালানো ও উত্তীর্ণ পরীক্ষা (`Tested — PASS`)

| কমান্ড / স্যুইট | ফলাফল | যাচাইকৃত ক্ষেত্র |
|---|---|---|
| `node --test tests/*.test.mjs` | **11 / 11 PASS** (0 fail) | বিদ্যমান ৮টি রেগ্রেশন টেস্ট + ৩টি নতুন স্যুইট (`web-primitives-regression.test.mjs`, `web-browser-regression.test.mjs`, `run-web-browser-checks.py`)। |
| Playwright Headless Chromium (`tests/helpers/run-web-browser-checks.py`) | **8 / 8 PASS** | ১) `CF_THEME_INIT_SCRIPT` প্রি-হাইড্রেশন, ২) `data-transparency="reduce"` ৪টি গ্লাস সারফেসে (`light` ও `dark`), ৩) নিঃশর্ত `translateZ(0)` নেই + `position: fixed` ডিসেন্ড্যান্ট ট্র্যাপ হয়নি, ৪) SVG squircle `mask-image` ও আউটার `box-shadow` সংরক্ষণ, ৫) `bg-white` বনাম `cf-glass` গ্লাস নব কম্পিউটেড ট্রান্সলুসেন্সি, ৬) `prefers-reduced-motion: reduce` (`200ms`, `linear(0, 1)`, সক্রিয় ট্রান্সফর্ম `none`), ৭) Inter ফন্টে `bn`/`ar` `letter-spacing` শূন্য সুরক্ষা, ৮) RTL-সচেতন রোভিং `tabIndex` কীবোর্ড ন্যাভিগেশন। |
| `node scripts/verify-plugin.mjs` | **8 PASS, 0 NOT RUN, 0 FAIL** | প্লাগিন ম্যানিফেস্ট, ১৮/১৮ রানটাইম ফাইল, ৯ JSON স্কিমা, ৩২ পাথ, ৯ WAV ফাইল, lint হুক স্মোক টেস্ট, `build-tokens` স্মোক ও `python + playwright` ইম্পোর্ট। |
| `node scripts/contrast-check.mjs --accent "#0088FF"` | **0 blocking failures** | `#0088FF` / `#0091FF` জোড়া ও WCAG ২.২ `3:1` / `4.5:1` থ্রেশহোল্ড পাস (৩টি অনুমোদিত small-text advisory warning সহ)। |

### ৩.২ না চালানো অংশ (`NOT RUN`)

- **পূর্ণ Next.js / React `tsc --noEmit` ও React JSX কম্পোনেন্ট মাউন্ট**: **NOT RUN (`no package.json / node_modules / Next.js app installed in this plugin repository`)**। Web `.tsx` প্রিমিটিভগুলো স্ট্যাটিক রেগ্রেশন টেস্ট (`tests/web-primitives-regression.test.mjs`), JS স্প্রিং/প্রি-হাইড্রেশন এক্সিকিউশন ও CSS/DOM/Squircle আচরণের বাস্তব Playwright হেডলেস Chromium পরীক্ষার মাধ্যমে যাচাই করা হয়েছে; পূর্ণ Next.js প্রজেক্টে কপি করার পরই অ্যাপ-লেভেল `tsc` ও React মাউন্ট চলে।

---

## ৪. Phase 2b (Flutter ও Tauri) পরিবেশ প্রস্তুতি

- **`flutter --version`**: **NOT installed** (`[WinError 2] The system cannot find the file specified`) — Phase 2b-তে Flutter পরিবর্তনগুলো `dart analyze` / `flutter test` ছাড়া `NOT RUN (Flutter SDK not installed)` হিসেবে চিহ্নিত রাখতে হবে।
- **`cargo --version`**: **Installed** (`cargo 1.95.0 (f2d3ce0bd 2026-03-21)`) — Phase 2b-তে Tauri Rust টোকেন / কম্পাইল যাচাই সম্ভব।

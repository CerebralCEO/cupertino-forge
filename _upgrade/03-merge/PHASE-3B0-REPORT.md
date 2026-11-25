# Phase 3b-0 রিপোর্ট — Step 0 ক্লোজআউট, Sketch Kit ইনভেন্টরি, Estimate Resolution ও HIG Extras

**শাখা (Branch):** `upgrade/apple-dna-v2`  
**Step 0 কমিট:** `674de01` (`docs: 3a closeout verification`)  
**Figma API ব্যবহার:** **০টি** (কোনো curl/fetch/API অনুরোধ করা হয়নি; সব ডেটা স্থানীয় `tokens/source/*` ও অফিশিয়াল Apple HIG DocC JSON থেকে নেওয়া)।  
**প্লাগিন ফাইল অপরিবর্তিত:** Step 0 ক্লোজআউট ও `.gitignore` ছাড়া প্লাগিনের কোনো বিদ্যমান কোড/টোকেন/স্কিল ফাইল বদলানো হয়নি।

---

## ১. Step 0 ফলাফল (`674de01`)
- **পূর্ণ CSS (`67.77 kB`) WebKit ও Firefox যাচাই:** [`PHASE-2A-VERIFICATION.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/03-merge/PHASE-2A-VERIFICATION.md)-এ বাধ্যতামূলক লাইন (*"Phase 2a-র আগের WebKit/Firefox ৭/৭ অসম্পূর্ণ CSS-এ (`45.56 kB`) চলেছিল; নতুন ফল নিচে।"*) যুক্ত হয়েছে; **Chromium 7/7 PASS**, **Playwright WebKit 7/7 PASS**, **Firefox 7/7 PASS**।
- **[`qa/ACCESSIBILITY-TRADEOFFS.md`](file:///D:/Claude-Plugins/cupertino-forge/qa/ACCESSIBILITY-TRADEOFFS.md):**
  - tinted glass alpha `0.85 → 0.90`-এ কালো ব্যাকগ্রাউন্ডে কন্ট্রাস্ট `4.69:1 → 4.25:1` নামার ট্রেড-অফ ও আলাদা light/dark alpha token-এর সম্ভাব্যতা (CSS/Dart/TS-এ সহজেই সম্ভব) যুক্ত হয়েছে।
  - Apple HIG Accessibility DocC JSON যাচাই করে নিশ্চিত হওয়া গেছে HIG-তে `"All | Bold | 3:1"` লেখা থাকলেও numeric weight (`600` Semibold বনাম `700` Bold) সংজ্ঞায়িত নয় → **`unverified`** নথিভুক্ত এবং **`"3:1 পাস; 4.5:1 নয়; HIG bold-সংজ্ঞা অযাচাই"`** বাক্য বসানো হয়েছে।

---

## ২. Kit Inventory (`qa/reference-manifest.json`)
[`qa/reference-manifest.json`](file:///D:/Claude-Plugins/cupertino-forge/qa/reference-manifest.json)-এ `tokens/source/*` থেকে মোট **`1,078`** এন্ট্রি তালিকাভুক্ত (`referenceClass: "design-kit-static"`):
- **iOS 27 Sketch Kit (`apple-ios-27-ui-kit.tokens.json`):** **`402`** এন্ট্রি (`271 color`, `105 typography`, `20 shadow`, `5 border`, `1 gradient`)
- **macOS 27 Sketch Kit (`apple-macos-27-ui-kit.tokens.json`):** **`676`** এন্ট্রি (`544 color`, `67 typography`, `46 shadow`, `18 border`, `1 gradient`)
- **কম্পোনেন্ট ফ্রেম জ্যামিতি (`frameSizePt`, `radius`, `padding`):** সব এন্ট্রিতে **`"geometry not in export"`** (Sketch-এর *Export Design Tokens* JSON ফ্রেম ডাইমেনশন, কর্নার রেডিয়াস বা প্যাডিং এক্সপোর্ট করে না)।

---

## ৩. Estimate Resolution (`qa/ESTIMATE-RESOLUTION.md`) — শুধু Apple Sketch Kit থেকে
[`tokens/ESTIMATES.md`](file:///D:/Claude-Plugins/cupertino-forge/tokens/ESTIMATES.md)-এর **`80`** এস্টিমেট এন্ট্রির বিপরীতে [`qa/ESTIMATE-RESOLUTION.md`](file:///D:/Claude-Plugins/cupertino-forge/qa/ESTIMATE-RESOLUTION.md):
- **`confirmed`:** **`1`** (`shape.json :: borders` — `0.5px` hairline ও `1px` control width কিটে নিশ্চিত) → **`Measured`**-এ উন্নীত করার প্রস্তাব।
- **`contradicted`:** **`2`** (`elevation.json :: levels.knob` এবং `elevation.json :: levels.popover` — iOS `Controls.Light.Knobs - Toggle.01 - Idle.shadows` ও macOS `Panels.Light/Dark.shadows` কিটে ভিন্ন মান আছে) → কিটের মান গ্রহণ করে **`Measured`**-এ উন্নীত করার প্রস্তাব।
- **`not-in-kit`:** **`77`** (জ্যামিতি, স্পেসিং, রেডিয়াস, মোশন স্প্রিং, ব্লার সিগমা, হ্যাপ্টিকস কিট টোকেন এক্সপোর্টে নেই) → `estimated` থাকবে।
- **মোট `Measured`-এ উন্নীত হওয়ার সম্ভাবনা:** **`3 / 80`** (`3.75%`)। কোনো প্লাগিন টোকেন এখনই বদলানো হয়নি।

---

## ৪. Circularity অডিট (`qa/REFERENCE-VS-TOKENS.md`)
৯টি `tokens/*.json` ফাইলের মোট **`61`** টপ-লেভেল গ্রুপের মধ্যে [`qa/REFERENCE-VS-TOKENS.md`](file:///D:/Claude-Plugins/cupertino-forge/qa/REFERENCE-VS-TOKENS.md):
- **`derived-from-kit (not independent)` (বৃত্তাকার, বাদ দেওয়া):** **`22`** গ্রুপ
- **সত্যিকারের স্বাধীন তুলনাযোগ্য গ্রুপ:** **`39`** গ্রুপ (**`16`** `official-hig` + **`23`** `independent-estimate`)।

---

## ৫. Manual PNG অবস্থা ও `NOT RUN` তালিকা
- **Manual PNG (`qa/references/manual/{ios27,macos27}/`):** **পাওয়া যায়নি (`0` ফাইল)**।
- **`qa/reference-map.json`:** **`NOT RUN (manual reference PNG নেই)`** — হাতে PNG এক্সপোর্ট যোগ করার প্রক্রিয়া, `reference-class: design-kit-static` বনাম `real-device`, গ্লাস কম্পোনেন্টে (`TabBar`, `Alert`, `Sheet`, `Menu`, `Toolbar`, `Sidebar`) কেন pixel-diff নয় বরং geometry + AI-review হবে, এবং `/apple-audit --reference <dir>` ডিজাইন নোট [`qa/REFERENCE-WORKFLOW.md`](file:///D:/Claude-Plugins/cupertino-forge/qa/REFERENCE-WORKFLOW.md)-এ লেখা হয়েছে।
- **watchOS:** পরিধির বাইরে (`NOT RUN / excluded`)।
- **Phase 3b (`diff.mjs`, `ux-keyboard.mjs`, reviewer 2-mode, `--reference` কোড):** অনুমোদনের আগে শুরু করা হয়নি (`NOT RUN`)।

---

## ৬. `EXTRAS-VS-PLUGIN.md`-এর শীর্ষ ১০ আবিষ্কার
সব ১২টি Extras + App Icon ([`_upgrade/04-extras/`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/04-extras/EXTRAS-VS-PLUGIN.md)), [`brand-constrained-rules.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/04-extras/brand-constrained-rules.md) (কোনো ব্র্যান্ড অ্যাসেট প্রতিলিপি ছাড়া + `anti-patterns.md`-এ ১ লাইনের সতর্কতার প্রস্তাব), এবং [`LICENSE-NOTES.md`](file:///D:/Claude-Plugins/cupertino-forge/_upgrade/04-extras/LICENSE-NOTES.md) সম্পন্ন:

1. **TipKit (`Offering help`):** Inline tip (`TipView`) হলো প্রথম পছন্দ (popover দ্বিতীয়); macOS tooltip সর্বোচ্চ **`60–75` অক্ষর**, sentence case, কন্ট্রোলের নাম পুনরাবৃত্তি নিষেধ।
2. **Live Activities (macOS 27):** এখন **macOS মেনু বারেও** দেখায়; সর্বোচ্চ স্থায়িত্ব **`<= 8` ঘণ্টা**, containerless লোগো মার্ক (পুরো অ্যাপ আইকন নিষেধ), অ্যাপের ভেতর থেকে Dynamic Island নির্দেশ করা নিষেধ।
3. **Sign in with Apple:** ন্যূনতম **`140×30pt`**, বাইরের মার্জিন **`>= 1/10` উচ্চতা**, ডান মার্জিন **`>= 8%` প্রস্থ**, `1:1` লোগো-অনলিতে বাড়তি হরিজন্টাল প্যাডিং নিষেধ, এবং মাত্র ৩টি বৈধ শিরোনাম (`Sign in / Sign up / Continue with Apple`)।
4. **Apple Pay:** ন্যূনতম **`100×30pt`** (প্লেইন) ও **`140×30pt`** (অ্যাকশন ভার্ব), **`1/10` উচ্চতা** ক্লিয়ার স্পেস, ওয়েব অথ আইকন **`60×60pt`**, শুধু API দিয়ে রেন্ডার (কাস্টম বাটন নিষেধ), বাটন ডিম/ডিসেবল নিষেধ, মার্ক কখনোই ক্লিকেবল বাটন নয়।
5. **Wallet (iOS 27 Pass Designer, June 8, 2026):** অফিশিয়াল পাস PNG ডাইমেনশন (`icon 38×38pt`, `logo 50–160×50pt`, `strip 375×144pt`, `background 343×503pt`, `artwork 358×448pt`, `footer 268×15pt`) ও `Verify with Apple Wallet` purpose-string নিয়ম।
6. **App Clips (June 9, 2025 demo update):** ট্যাব বার/সেটিংস/স্প্ল্যাশ/WebView ছাড়া লিনিয়ার UI, ভ্যালুর আগে অ্যাকাউন্ট তৈরি বাধ্যতামূলক নয়, Title Case `"App Clips"` / `"App Clip Code"`।
7. **App Intents / App Shortcuts (June 8, 2026):** Apple Intelligence-এর জন্য **App Schemas**; কপি কেস নিয়ম (`"App Shortcuts"`/`"Shortcuts"` Title Case বহুবচন, একক `"shortcut"` ছোট হাতের)।
8. **App Icons (Oct 28, 2026):** নন-লেয়ার্ড বনাম Icon Composer `.icon` ফরম্যাট গাইডেন্স; `1024×1024px`, ৬টি appearance (`default/dark/clear light/clear dark/tinted light/tinted dark`), alternate আইকনেও সব ভ্যারিয়েন্ট বাধ্যতামূলক।
9. **HealthKit:** Apple Health আইকনে **`>= 1/10` উচ্চতা** ক্লিয়ার স্পেস ও মাস্ক/রঙ বদল নিষেধ; Activity ring বাইরের মার্জিন রিং-মধ্যবর্তী দূরত্বের সমান বা বেশি।
10. **HomeKit ও AR কপি নিয়ম:** HomeKit UI-তে সবসময় `"scene"` (API-এর `"action set"` নয়); AR প্রম্পটে `"plane"`, `"anchor"`, `"tracking"`, `"insufficient features"`-এর মতো টেকনিক্যাল জার্গন নিষিদ্ধ।

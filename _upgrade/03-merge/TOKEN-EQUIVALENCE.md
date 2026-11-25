# Token Equivalence & Foundation Diff Verification (`main` -> `HEAD`)

Date: 2026-11-25 | Branch: `upgrade/apple-dna-v2` | Script: `_upgrade/scratch/check_token_equivalence.py`

> Verification only (read-only audit). `tokens/*.json`, `01-layout.md`, এবং `08-motion.md`-এ এখানে কোনো পরিবর্তন করা হয়নি।

---

## ১. Git Housekeeping (`_upgrade/scratch/`)

- `.gitignore`-এ `_upgrade/scratch/` যোগ করা হয়েছে এবং `git rm -r --cached _upgrade/scratch` চালিয়ে `chore: untrack scratch outputs` commit সম্পন্ন হয়েছে (`git status --short` সম্পূর্ণ পরিষ্কার)।

---

## ২. `tokens/*.json` Comparison (`git show main:tokens/<f>` vs `HEAD`)

Comparison scope: All 9 token JSON files (`color.json`, `elevation.json`, `feedback.json`, `icons.json`, `layout.json`, `materials.json`, `motion.json`, `shape.json`, `typography.json`) plus `tokens/source/*.tokens.json` (unchanged).  
Ignored metadata keys during recursive leaf comparison (exact list requested):  
`$source`, `$class`, `$url`, `$platform`, `$alt`, `$kitConflict`, `$note`, `$description`.

### সামগ্রিক ফলাফল

| File | Raw `git diff --numstat` (+ / -) | (a) Changed | (b) Deleted | (c) Added | (d) Structural | Verdict |
|---|---|---:|---:|---:|---:|---|
| `tokens/color.json` | `+721 / -172` | **1** (`$meta.sources.hig` string only) | **0** | **12** | **0** | Zero runtime token value changed |
| `tokens/elevation.json` | `+87 / -11` | **0** | **0** | **3** | **0** | 100% backward-compatible |
| `tokens/feedback.json` | `+214 / -35` | **0** | **0** | **1** | **0** | 100% backward-compatible |
| `tokens/icons.json` | `+371 / -73` | **0** | **0** | **1** | **0** | 100% backward-compatible |
| `tokens/layout.json` | `+361 / -51` | **0** | **0** | **9** | **0** | 100% backward-compatible |
| `tokens/materials.json` | `+397 / -319` | **0** | **0** | **5** | **0** | Pretty-print line diff only |
| `tokens/motion.json` | `+481 / -217` | **0** | **0** | **30** | **0** | Pretty-print line diff only |
| `tokens/shape.json` | `+37 / -10` | **0** | **0** | **2** | **0** | 100% backward-compatible |
| `tokens/typography.json` | `+1558 / -1475` | **0** | **0** | **2** | **0** | Pretty-print + metadata only |
| `tokens/source/*.tokens.json` | `0 / 0` | **0** | **0** | **0** | **0** | Untouched |
| **Total** | — | **1** (`$meta` text only) | **0** | **65** | **0** | **0 runtime value drift** |

### (a) Changed Values — বিস্তারিত

1. `tokens/color.json -> $meta.sources.hig`:
   - **Old (`main`):** `"Apple HIG Color page, increased contrast values"`
   - **New (`HEAD`):** `"Apple HIG Color & Accessibility (HC image swatches in HIG JSON -> inferred)"`
   - *Data tokens (`system`, `grayIOS`, `label*`, `fill*`, `backgroundIOS`, `separatorIOS`, `macOSSurfaces`, `macOSControlFills`, `focusRing`, `selection`, `dimming`, `accent`):* **০টি বদল।**

### (b) Deleted Paths
- **কোনো ফাইল থেকেই ১টি path-ও মুছে যায়নি (`deleted = 0` সর্বত্র)।**

### (c) Added Paths (65টি — summary)
- `color.json` (`12`): `$meta.reconciledDate`, `system.$hcClass`, `grayIOS.$hcClass`, `macOSSurfaces.$darkSeparatorClass`, `macOSSurfaces.{bg2,bg3,bgGrouped,bgGrouped2,bgGrouped3,separatorOpaque}` (previously hardcoded in `build-tokens.mjs`), `iosFieldBorder`, `highContrastLabels`.
- `elevation.json` (`3`): `$meta.reconciledDate`, `levels.sliderKnob.$darkClass`, `levels.sliderKnob.dark`.
- `feedback.json` (`1`): `$meta.reconciledDate`.
- `icons.json` (`1`): `$meta.reconciledDate`.
- `layout.json` (`9`): `$meta.reconciledDate`, `hitTarget.{iosMinimum,paddedWithBezel,paddedWithoutBezel}`, `ios.tabBar.maxVisibleTabsPhone`, `ios.widgets`, `ios.liveActivities`, `macos.menuBarHeight`, `macos.splitViewDividerWidth`.
- `materials.json` (`5`): `$meta.reconciledDate`, `liquidGlass.{officialSpec,intensityCurve,perfBudget,reducedTransparency}`.
- `motion.json` (`30`): `$meta.reconciledDate`, `transitions.*.interruptible` (14 additions; `navigationPush` already had it), `transitions.*.reducedMotion` (15 objects).
- `shape.json` (`2`): `$meta.reconciledDate`, `radiusIOS.sheetFloating`.
- `typography.json` (`2`): `$meta.reconciledDate`, `nonLatin`.

### (d) Structural / Nesting Changes
- **`0`টি structural type change।** সব object/array/scalar টাইপ `main`-এর মতোই আছে।

---

## ৩. `materials.json` ও `motion.json` Deep Check (`-319` ও `-217` লাইন কেন দেখাল?)

`git diff --numstat`-এ `materials.json`-এ `319` লাইন এবং `motion.json`-এ `217` লাইন লাল (`-`) দেখানোর একমাত্র কারণ **JSON indentation / formatting change**:
- `main`-এ `materials.json` (৩৩৪ লাইন) এবং `motion.json` (২২১ লাইন) compact formatting ব্যবহার করত (যেমন `motion.json`-এ পুরো single transition object বা `{ "light": "...", "dark": "..." }` একই লাইনে ছিল, আর array ও ২-space indent mixed ছিল)।
- Phase 1-এ Python `json.dumps(..., indent=2)` দিয়ে লেখার ফলে ওই এক-লাইনের object ও array-গুলো multi-line `indent=2` হয়ে গেছে, তাই text-diff হিসেবে পুরনো এক-লাইনের টেক্সটগুলো `-` হিসেবে দেখিয়েছে এবং নতুন expanded লাইন `+` হিসেবে এসেছে।
- AST / parsed JSON তুলনায় প্রমাণিত: **`materials.json`-এ `changed=0, deleted=0, structural=0`** এবং **`motion.json`-এ `changed=0, deleted=0, structural=0`**।

---

## ৪. প্রতিটি মান-বদলের (a) শ্রেণিবিন্যাস: (i) / (ii) / (iii)

| Class | Count | Items & Explanation |
|---|---:|---|
| **(i) Documented intentional** | 0 numeric tokens (N/A) | `DIFF-VS-PLUGIN.md` ও `CHANGELOG.md`-এ Rule 1 (`shape` `55/30`, `layout` `62`) ও Rule 4 (`typography` macOS weights) **অপরিবর্তিত রাখার** কথা নথিভুক্ত, এবং `added` আইটেমগুলো (`macOSSurfaces.*`, `highContrastLabels`, `intensityCurve`, `reducedMotion`, `widgets`, `liveActivities`, `nonLatin`) `CHANGELOG.md`-এ নথিভুক্ত। |
| **(ii) Undocumented** | **1 metadata text** (`0` data values) | `tokens/color.json -> $meta.sources.hig` string updated from `'Apple HIG Color page, increased contrast values'` to `'Apple HIG Color & Accessibility (HC image swatches in HIG JSON -> inferred)'` without naming that exact `$meta` string path in `CHANGELOG.md`. *(এছাড়া `$hcClass`, `$darkSeparatorClass`, `$darkClass`, ও `$meta.reconciledDate` helper keys — যা top 8 ignore-list-এর বাইরে — কেবল Phase 1 provenance annotation হিসেবে যোগ হয়েছে; চাইলে CHANGELOG-এ উল্লেখ বা `added`-এর সাথে রাখা যায়।)* |
| **(iii) Suspicious** | **0** | **কোনো Official/Apple-kit মান ওভাররাইড হয়নি; কোনো numeric/hex/string token মান-বিচ্যুতি নেই।** |

---

## ৫. `01-layout.md` ও `08-motion.md` এর `git diff main..HEAD` Deleted/Altered Rule Audit

### ক. `01-layout.md` (`hunks: @@ -1,40 +1,40 @@`, `@@ -57,17 +57,19 @@`)

১. **বাদ পড়া বাক্যাংশ — Tab bar অবস্থান (`line 27`)**:
   - **আগে (`main`):** `floating glass capsule, about 62 tall, 20 from sides, sits above home indicator`
   - **এখন (`HEAD`):** `"sits above home indicator"` অংশটি বাদ পড়েছে (তার বদলে `max 5 tabs on iPhone [official]; .tabBarMinimizeBehavior(.onScrollDown) + Tab(role: .search) [official]` যোগ হয়েছে)।
২. **Hit target শব্দের পরিবর্তন (`line 37`)**:
   - **আগে (`main`):** `44 by 44 minimum`
   - **এখন (`HEAD`):** `44 by 44 recommended, 28 by 28 absolute minimum [official]`
   - **ঝুঁকি (অডিট নোট):** যদিও Official HIG Accessibility-তে `28x28` minimum আছে, তবু আগের সরাসরি `"44 by 44 minimum"` হার্ড রুলটি `"recommended"` হওয়ায় `apple-design-core` golden rule #2 (`44 by 44`) সঙ্গে একটু নরম শোনায়।
*(macOS skeleton, breakpoint `768`/`1180`, এবং `Never use 5, 7, 14...` সহ বাকি সব নিয়ম অক্ষত আছে।)*

### খ. `08-motion.md` (`hunks: @@ -1,24 +1,24 @@`, `@@ -27,32 +27,32 @@`)

টেবিল ও Gestures/Reduced motion অংশ সংক্ষেপ ও পুনর্গঠনের সময় নিচের **৭টি নির্দিষ্ট নিয়ম/বাক্যাংশ** মুছে গেছে বা সংকুচিত হয়েছে:

1. **Menu / popover (`Transitions catalog`)**: **`"glass morphs out of the button"`** এবং **`"opacity"`** বাদ পড়েছে।
2. **Tab switch (`Transitions catalog`)**: **`"(no slide)"`** নিষেধাজ্ঞা মুছে গেছে!
3. **Tab bar minimize (`Transitions catalog`)**: **`"while scrolling down, restore on scroll up"`** বর্ণনা মুছে শুধু `.tabBarMinimizeBehavior(.onScrollDown)` রাখা হয়েছে।
4. **Segmented control row (`Transitions catalog`)**: `Toggle` ও `Segmented` দুটি আলাদা রো একত্র করার ফলে Segmented-এর নিজস্ব নিয়ম **`"indicator slides snappy, stretches while dragging"`** পুরোপুরি মুছে গেছে!
5. **Drag and drop (`Transitions catalog`)**: **`"with shadow"`** (`lift 1.03 to 1.05 with shadow` -> `lift 1.03–1.05`) বাদ পড়েছে।
6. **Gestures (`Bullet 1 & Bullet 4`)**:
   - **`"Never snap without velocity."`** — এই গুরুত্বপূর্ণ physics সতর্কতাটি মুছে গেছে!
   - **`"Every animation can be interrupted mid flight by a new gesture."`** — bullet হিসেবে মুছে গেছে (যদিও নতুন `Interruptible: Yes` কলাম যোগ হয়েছে, সামগ্রিক গ্লোবাল নিয়মটি bullet আকারে থাকা নিরাপদ)।
7. **Reduced motion (`Paragraph`)**:
   - **`"keep state feedback"`** (`..., keep state feedback.`) — এই critical accessibility সতর্কতাটি মুছে গেছে! (যাতে developer ভুল করে `Reduced Motion`-এ state transition feedback-ই বন্ধ না করে ফেলে)।

*(বাকি `Do not` সেকশন `lines 57-59` অপরিবর্তিত রয়েছে।)*

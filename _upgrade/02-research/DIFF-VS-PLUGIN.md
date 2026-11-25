# DIFF-VS-PLUGIN — Current Plugin Tokens & Docs vs Research Findings

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি Prompt 3 (Implementation & Bugfix)-এর সরাসরি কাজের তালিকা: `cupertino-forge`-এর বর্তমান `tokens/*.json`, `skills/`, `scripts/`, ও `hooks/` কোথায় Official Apple HIG-এর সাথে পুরোপুরি মিলেছে, কোথায় ভুল/অমিল ধরা পড়েছে, এবং কোন Estimate টোকেন এখন Official বা Measured সূত্র পেল তার পূর্ণ তুলনা এখানে।

---

## 1. Exact Official & Kit Matches (Keep As-Is)

1. **`tokens/typography.json` (132 iOS Dynamic Type cells + 3×64 SF Pro Tracking tables)**:
   - আমাদের `diff_tokens_vs_official.py` যাচাইয়ে Official HIG `typography.json`-এর সঙ্গে **০টি অমিল (`0 diffs`)** পাওয়া গেছে! (`largeTitle` থেকে `caption2`, `xSmall` থেকে `AX5`, এবং `sfProIOS`/`sfProRounded`/`sfProMacOS` tracking `6–96pt`)।
2. **`tokens/color.json` System Colors Light/Dark, Grays, Labels, Fills, Backgrounds**:
   - Raw `apple-ios-27-ui-kit.tokens.json` ও `apple-macos-27-ui-kit.tokens.json`-এর সঙ্গে সিস্টেম রঙ ও লেবেল হুবহু মিলেছে।
3. **`tokens/color.json` Focus Ring (`3.5px@0.25` outer, `1px@0.15` inner)**:
   - ইতিপূর্বে সন্দেহ থাকলেও macOS 27 Sketch Kit-এর `Global.Focus Ring`-এ হুবহু `width: 3.5, alpha: 0.25` ও `width: 1, alpha: 0.15` (`Measured`) পাওয়া গেছে!
4. **`tokens/motion.json` Spring Math (`SwiftUI.Spring`)**:
   - `Spring(duration: 0.5, bounce: 0.3)` -> `(1.0, 157.9, 17.6)` Apple Official SwiftUI doc-এর উদাহরণের সঙ্গে `157.914` / `17.593` হিসেবে মিলেছে।

---

## 2. Discrepancies, Errors & Bugs Found (Must Fix in Prompt 3)

| Target File in Plugin | Current Plugin Value / Claim | Researched Official / Measured Fact | Action Required in Prompt 3 |
| --- | --- | --- | --- |
| `skills/apple-design-core/.../03-color.md:57` & QA logic | "3:1 for title3 (20pt) and up" | Official Apple HIG Accessibility: **`>= 18 pt`** (All weights) এবং **Bold (All sizes)** -> **`3:1`**; কেবল `<= 17 pt` -> `4.5:1` | `03-color.md` এবং `scripts/contrast-check.mjs`-এ threshold `20pt` নয়, **`18pt` ও `bold`** করতে হবে |
| `tokens/shape.json:38-42` | `iPhone17Pro: 55`, `iPadPro: 30` | `ScreenCorners` hardware measurements: `iPhone 16 Pro/17 Pro: 62pt`, `iPad Pro M4/M5: 18pt` (`15/16: 55pt`) | অন্তত `$note`/comment দিয়ে conflict নথিভুক্ত করা এবং `iPadPro` `18pt` / `17Pro` যাচাই করে আপডেট করা |
| `tokens/layout.json:20` | `topDynamicIsland: 62` (একক মান) | `iPhone 15 / 16`: **`59pt`**; `iPhone 16 Pro / 17 / 17 Pro / Pro Max`: **`62pt`** | দুইটি আলাদা ডিভাইস টিয়ার (`59pt` বনাম `62pt`) স্পষ্ট করা |
| `skills/apple-tauri/...` (`Cargo-snippet.toml`) | Pins `window-vibrancy = "0.7"` (uses `NSVisualEffectView`) + `macOSPrivateApi` warning gap | `window-vibrancy >= 0.8` introduces `apply_liquid_glass` (`LiquidGlassOptions` + `NSGlassEffectViewStyle`); `macOSPrivateApi: true` causes Mac App Store rejection | `Cargo-snippet.toml` ও Tauri docs `0.8+` এবং MAS `macOSPrivateApi: false` caveat যোগ করা |
| `skills/apple-design-audit` / Tauri QA docs | Suggests `tauri-driver` uniformly | Official Tauri v2 Docs: **`tauri-driver` DOES NOT support macOS WKWebView** — use `@wdio/tauri-service` / `tauri-plugin-webdriver` | Tauri audit checklist আপডেট করা |
| `tokens/layout.json` / `03-typography.md` non-Latin | Tracking rules globalized without Bangla/Arabic exclusion alert inside token `$usage` | Official HIG RTL + Arabic/Bengali typography: `-0.026em` tracking breaks Indic matra & cursive Arabic; LTR `dir` must disable tracking | Web/Flutter recipe ও `lint.mjs`-এ `:lang(bn)`/`:lang(ar)` tracking guard ও logical CSS enforcement যোগ করা |
| `skills/apple-flutter` BackdropFilter | Standard `BackdropFilter` without grouping guidance | Flutter `3.29+`: `BackdropGroup` + `BackdropFilter.grouped` required on multiple glass pills under Impeller (plus never animate `sigma`) | `apple-flutter` গাইড ও টেমপ্লেট আপডেট করা |
| `tokens/layout.json:42-46` & `tokens/color.json` `$source` tags | `button` heights `28/32/36/50/56` lacks explicit note that Official HIG gives those steps for `visionOS` (`44/52/64`), not iOS | Honest classification in `08-components-ios.md` & `RESEARCH` JSONs | Prompt 3-এ `$source` metadata আরও স্বচ্ছ করা (`Estimated` vs `Official`) |

---

## 3. Previously Uncited / Upgraded to Official or Measured
- **SF Pro & macOS Tracking Tables (`tokens/typography.json`)**: আগে Sketch Kit-এ `0` থাকায় উৎস নিয়ে প্রশ্ন ছিল -> এখন **Official HIG `typography.json`** (`64` + `64` + `64` rows) হিসেবে প্রমাণিত।
- **Clear Glass Dimming Layer (`#000000@0.35`)**: এখন **Official HIG `Materials`** (`35% dark dimming layer`) হিসেবে প্রমাণিত।
- **Sidebar Colored Icons & Edge-to-Edge Extension**: এখন **Official HIG `Sidebars` (`June 8, 2026`)** + **`.backgroundExtensionEffect()`** হিসেবে প্রমাণিত।
- **Sheets Button Order (`Cancel` leading, `Done` trailing)**: এখন **Official HIG `Sheets` (`March 24, 2026`)** হিসেবে প্রমাণিত।
- **SF Symbols 7 Animations (`Draw On / Draw Off`, `Gradients`)**: এখন **Official HIG `SF Symbols` (`July 28, 2025`)** হিসেবে প্রমাণিত।
- **macOS Touch Input Guidelines (`Oct 28, 2026`)**: এখন **Official HIG `Gestures` & `Designing for macOS`** হিসেবে প্রমাণিত।

---

## 4. Still Estimated (Carry Forward Honestly — Do Not Claim Official)
- `tokens/materials.json` `tuned` blur radius (`8/12/20/24 px`), `saturate(1.8)`, `brightness(1.05/0.9)`, `--cf-glass-intensity` (`0..1`) ও `perf.maxSimultaneousBackdrop = 6`
- `tokens/layout.json` `tabBar` (`62pt`), `toggle` (`64×28pt`), `listRow` (`52pt`), `alert` (`300pt`), `macos` `toolbar` (`52pt`), `trafficLights` (`14/9/16/26pt`), `sidebar` (`220pt`), `settingsWindow` (`715pt`)
- `tokens/shape.json` component radii (`sheet: 38`, `alert: 34`, `popover/menu: 26`, `card: 22`, `macosWindow: 12`)
- `tokens/motion.json` custom transitions (`press`, `release`, `popover`, `glassMorph`, `sheetDismissVelocity: 600`)

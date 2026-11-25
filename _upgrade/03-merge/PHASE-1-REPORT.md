# Phase 0 & Phase 1 Merge Report — `cupertino-forge` (`upgrade/apple-dna-v2`)

Date: 2026-11-25 | Branch: `upgrade/apple-dna-v2`

---

## ১. কী বদলানো হয়েছে

### Pre-Merge Measured Re-Audit (`_upgrade/03-merge/MEASURED-REAUDIT.md`)
- Apple Sketch UI Kit (`apple-ios-27-ui-kit.tokens.json`, `apple-macos-27-ui-kit.tokens.json`)-এর বাইরের সব তৃতীয়-পক্ষ ও স্ব-গণিত `Measured` মানকে `Inferred`-এ নামানো হয়েছে:
  - Research JSON (`_upgrade/02-research/json/*.json`): `160` থেকে **`145`** kept (`Measured`), **`15`** downgraded (`Inferred`)।
  - Domain Markdown (`_upgrade/02-research/01..18-*.md`): `53` থেকে **`36`** kept (`Measured`), **`17`** downgraded (`Inferred`)।

### Phase 0 (Commit `3bac7f9`)
- **Runtime Verification (`/apple-doctor`)**: `scripts/verify-plugin.mjs` ও `commands/apple-doctor.md` যোগ করা হয়েছে; manifest, `32`টি `${CLAUDE_PLUGIN_ROOT}` পাথ, `9`টি token JSON, `9`টি WAV, `lint.mjs` hook smoke, `build-tokens.mjs` smoke, এবং Python/Playwright (`NOT RUN` fallback সহ) যাচাই করে।
- **`NOT RUN` Status Integrity**: `skills/apple-design-core/SKILL.md`, `skills/apple-design-audit/SKILL.md`, `skills/apple-design-audit/references/scorecard.md`, এবং `commands/apple-audit.md`-এ যেকোনো না চালানো ধাপ `NOT RUN (<reason>)` হিসেবে দেখানো ও স্কোর ডিনমিনেটর থেকে বাদ দেওয়ার নিয়ম যুক্ত হয়েছে।
- **৬টি প্রমাণিত Bug Fix + Regression Tests (`tests/*.test.mjs`)**:
  1. `hooks/scripts/lint.mjs`: `css-shadow`, `font-family`, `raw-backdrop` regex backtracking ঠিক (`var(--cf-*)` আর ব্লক হয় না), Windows CRLF/quoted `git status --porcelain` ফিক্স, `--json` pure JSON আউটপুট।
  2. `scripts/build-tokens.mjs`: `--cf-radius-device-display`, `--cf-radius-sheet-floating`, `--cf-radius-sheet`, `--cf-shadow-none` ও সব elevation স্তর CSS/Tailwind/Dart-এ নির্গত হয়।
  3. `scripts/build-tokens.mjs`: `@media (prefers-contrast: more)` আর `data-theme="dark"` ওভাররাইড করে না; `data-transparency="reduce"` ও `prefers-reduced-transparency` এখন ৪টি glass surface-এই কাজ করে।
  4. `scripts/contrast-check.mjs`: `#fff` 3-digit hex crash ঠিক, WCAG 2.2 ধ্রুবক `0.04045`, Apple HIG `<=17pt (4.5:1)` বনাম `>=18pt/Bold/Glyph (3:1)` কার্যকর, Apple `#0088FF` অটো-পেয়ার `#0091FF` সহ `0 blocking failures` পাস।
  5. Windows `python3` Store alias (exit `9009`) এড়াতে `agents/apple-design-reviewer.md`, `skills/apple-design-audit/SKILL.md`, `capture.py`, `synth-sounds.py`-তে `python` ব্যবহার ও `LOCALAPPDATA`/`Program Files (x86)`/`msedge.exe` fallback।
  6. `skills/apple-web/assets/{lib/haptics.ts,components/apple/controls.tsx}` ও `skills/apple-flutter/assets/lib/apple_ui/{feedback/cf_haptics.dart,widgets/cf_controls.dart}`-এ Toggle-এ haptic+sound একসঙ্গে চলা বন্ধ (`haptic()` boolean / `CfHaptics.supported` gate)।

### Phase 1 (Current Commit)
- **All 9 `tokens/*.json` Updated**:
  - প্রতিটি টোকেন সেকশনে `$source`, `$class`, `$url`, `$platform` যোগ।
  - **Rule 1 (`$alt` conflict protection)**: `shape.json` (`55`/`30` primary রাখা, `ScreenCorners` `62`/`18` `$alt`-এ `inferred/community`) এবং `layout.json` (`62pt` primary রাখা, `screens.guide` `59pt` `$alt`-এ `inferred/community`)।
  - **Rule 4 (`needs-device-verification`)**: `typography.json`-এ macOS `headline` (`700/800`), `caption1` (`400/500`), `caption2` (`500/600`) Official HIG মান বহাল রেখে Sketch kit অমিল (`900`/`600`/`400`) `$kitConflict`-এ রাখা হয়েছে; পাশাপাশি `nonLatin` (`Kohinoor Bangla`, `SF Arabic`, `0em` tracking) যুক্ত হয়েছে।
  - **`color.json`**: `build-tokens.mjs`-এর ভেতরে থাকা hardcoded macOS/HC hex `color.json`-এ আনা হয়েছে; Clear glass 35% dimming `official` ট্যাগ পেয়েছে।
  - **`materials.json`, `motion.json`, `elevation.json`, `feedback.json`, `icons.json`**: `officialSpec`, unified `intensityCurve`, Safari `reducedTransparency` matrix, `perfBudget`, প্রতি transition-এ `interruptible` ও `reducedMotion` crossfade এবং `sliderKnob.dark` যোগ।
- **`scripts/build-tokens.mjs`**: সব hardcoded hex অপসারণ; `:lang(bn), :lang(ar), :lang(he) { letter-spacing: 0 !important; }`; নতুন `--targets rust,json,estimates` (`apple_tokens.rs`, `cupertino.tokens.resolved.json`) এবং `--write-estimates` দিয়ে স্বয়ংক্রিয় [tokens/ESTIMATES.md](file:///d:/Claude-Plugins/cupertino-forge/tokens/ESTIMATES.md) জেনারেট (`80` estimated entries + `3` conflicts/alternates)।
- **Foundations (`skills/apple-design-core/references/foundations/00`–`16` + `SKILL.md` + `CHANGELOG.md`)**: সব ফাইলে `[official]`/`[measured]`/`[inferred]`/`[estimate]` ট্যাগ যুক্ত, `03-color.md` contrast (`>=18pt`/`Bold` `3:1`) সংশোধন, নতুন `16-localization-rtl.md` যোগ, এবং `CHANGELOG.md` তৈরি।

---

## ২. কী Test চালানো হয়েছে (Latest Run Results)

| Check / Command | Outcome | Notes |
|---|---|---|
| `node --test tests/*.test.mjs` | **PASS (8/8)** | `build-tokens`, `contrast-check`, `lint` (`var()` + Hook CRLF), `toggle-feedback`, `windows-python` + `doctor` |
| `node scripts/verify-plugin.mjs` | **PASS (8 PASS, 0 NOT RUN, 0 FAIL)** | Manifest, `18/18` core files, `9` token JSONs, `32` `${CLAUDE_PLUGIN_ROOT}` refs, `9` WAVs, hooks & build-tokens smoke, Python+Playwright probe |
| `node scripts/contrast-check.mjs --accent "#0088FF"` | **PASS (0 blocking fail)** | 3 small-text `<=17pt` advisory warnings printed honestly |
| `node scripts/build-tokens.mjs --out _upgrade/scratch/phase1-tokens-out --targets css,tailwind,ts,dart,rust,json --write-estimates tokens/ESTIMATES.md` | **PASS** | Generated all 6 token artifacts + `tokens/ESTIMATES.md` |
| Live Safari/Chromium UI render (`capture.py`), `flutter test`, `cargo check` | **NOT RUN** | Phase 2–4 ও অ্যাপ প্রজেক্ট / Apple হার্ডওয়্যার ছাড়া চালানো যায়নি |

---

## ৩. কী বাকি আছে (Next Phases — অপেক্ষমাণ `"Phase 2 শুরু কর"`)

- **Phase 2**: `components-ios/` ও `components-macos/` স্পেক আপডেট ও মিসিং স্পেক যোগ, `apple-web` / `apple-flutter` / `apple-tauri` adapter Confirmed bugs ঠিক (squircle mask, Reduce Transparency setting, JS `MotionConfig`, sheet transform + handoff, tab bar capsule + arrow keys, `PointerDeviceKind`, Dynamic Type double-scaling, `SystemChrome`, iOS haptic channel, Flutter missing widgets, Tauri MAS `macOSPrivateApi` ও `.apple-design.json`→Rust bridge, SwiftUI/Electron docs, parity matrix)।
- **Phase 3**: `apple-design-audit` scorecard দুভাগ করা (`Rule-conformance` vs `Fidelity`), `visual-qa.md` ও `ux-qa.md`, `qa/*.mjs`, `--reference <dir>`, `apple-design-reviewer` 2 modes, নতুন lint rules।
- **Phase 4**: `tests/seeded-defects/` যাচাই, চূড়ান্ত `/apple-doctor`, `README.md` / `plugin.json` version bump, ও `_upgrade/03-merge/MERGE-REPORT.md`।

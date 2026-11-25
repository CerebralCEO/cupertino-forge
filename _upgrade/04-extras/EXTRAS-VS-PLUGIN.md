# Extras vs Plugin Comparison (`skills/apple-design-core/references/{patterns,components-ios}`)

> Compares the 12 newly extracted HIG Extras + App Icon specs (`_upgrade/04-extras/*-spec.md`) against existing plugin docs in `skills/apple-design-core/references/patterns/{screens,states}.md` and `components-ios/{content,controls,navigation,presentation}.md`. **No plugin files modified in Phase 3b-0.**

---

## 1. New Information Relevant to Plugin Scope (iOS / macOS / Web / Flutter)

| # | Extra | New Actionable Info Not Yet in Plugin | Suggested Future Home |
|---|---|---|---|
| 1 | **TipKit / Offering Help** | Inline tips (`TipView`) are Apple's **first choice** over popover tips; macOS tooltips must stay **`60–75` characters**, sentence case, no repeating control name, omit period on fragments. | `patterns/states.md` & `components-macos/presentation.md` |
| 2 | **Live Activities (macOS 27)** | Live Activities now appear in the **macOS menu bar** (in addition to iPhone/iPad Lock Screen, Dynamic Island, StandBy `2x` scale); strict `<= 8` hours duration, containerless logo mark (never full app icon), never point in-app UI at Dynamic Island. | `components-ios/content.md` & `components-macos/` |
| 3 | **Sign in with Apple** | Exact official dimensions (`>= 140×30pt`), `>= 1/10` height outer margin, `>= 8%` width right title margin, `1:1` logo-only no horizontal padding, and exact 3 allowed titles (`"Sign in with Apple"`, `"Sign up with Apple"`, `"Continue with Apple"`). | `brand-constrained-rules` / `anti-patterns.md` |
| 4 | **Apple Pay** | Exact official button minimums (`100×30pt` plain, `140×30pt` action verbs), `1/10` height clear space, `60×60pt` web authorization icon (`120px @2x`/`180px @3x`), never disable/dim button, API-only (never draw custom Apple Pay button), mark is acceptance-only (never clickable). | `brand-constrained-rules` / `anti-patterns.md` |
| 5 | **Wallet (iOS 27 Pass Designer)** | Updated June 8, 2026 for iOS 27: exact PNG pass dimensions (`icon.png 38×38pt`, `logo.png 50–160×50pt`, `strip.png 375×144pt`, `background.png 343×503pt`, `artwork.png 358×448pt`, `footer.png 268×15pt`), group-add related passes, `Verify with Apple Wallet` purpose string rules. | Reference doc (optional) |
| 6 | **App Clips** | Updated June 9, 2025 for demo App Clips: linear UI without tab bars or settings, zero splash screen, no WebViews, no forced account creation before value, Title Case `"App Clips"` / `"App Clip Code"`. | `patterns/screens.md` (lightweight task flows) |
| 7 | **App Intents / App Shortcuts** | Updated June 8, 2026 with **App Schemas** for Apple Intelligence; strict copy capitalization (`"App Shortcuts"` / `"Shortcuts"` Title Case plural; individual `"shortcut"` lowercase). | `apple-design-core` voice/copy rules |
| 8 | **App Icons (Oct 28, 2026)** | New HIG guidance on app icon format options (non-layered vs Icon Composer `.icon` layered), confirming `1024×1024px` + 6 appearances + alternate icon variant parity. | `skills/apple-design-core` |
| 9 | **HealthKit** | Apple Health icon `>= 1/10` height clear space, never mask/re-round/recolor; Activity ring outer margin `>=` inter-ring spacing; contextual permission requests. | Brand/health guidance |
| 10 | **HomeKit & AR Copy** | HomeKit UI must say `"scene"` (never API term `"action set"`); AR prompts must avoid technical jargon (`"plane"`, `"anchor"`, `"tracking"`, `"insufficient features"`). | `apple-design-core` copy rules |

---

## 2. Conflicts with Existing Plugin Docs

- **No hard numeric conflicts found.**
  - Note: `components-ios/content.md` already documents Live Activities `14pt` Lock Screen margins, `28×28pt` compact width, and `<= 1` interactive control — the new HIG details (`<= 8h` duration, macOS menu bar placement, containerless logo mark) **extend** rather than contradict it.
  - Note on `Sign in with Apple` & `Apple Pay` minimum height (`30pt`) vs general iOS hit target (`44pt`): Apple's brand button APIs allow `30pt` minimum visual height (matching compact/small buttons) with `>= 1/10` height outer margin, while general touch ergonomics still recommend `44pt` touch targets where space permits.

---

## 3. Out-of-Scope for `cupertino-forge` UI Primitives

- **Tap to Pay on iPhone (`ProximityReader`):** iPhone-only hardware NFC payment terminal requiring PSP integration & Apple entitlement — out of scope for Web/Tauri/Flutter UI component primitives (only brand copy/UX rules belong in reference notes).
- **iMessage Apps & Stickers:** iOS Messages extension packaging (`500 KB` sticker packs, Messages drawer icon slots) — out of scope for core web/desktop/mobile app primitives.
- **ARKit 3D / Spatial Coaching & HomeKit Hardware Setup:** Native Apple framework flows (`ARCoachingOverlayView`, `HMHomeManager` Wi-Fi setup) — out of scope for cross-platform UI primitives (only plain-language copy rules apply).
- **App Clip Print Manufacturing (`>= 600 ppi` SVG, `300 dpi` matte print, `35 mm` Type 5 NFC):** Physical print production — out of scope for UI code generation.
- **watchOS:** Explicitly excluded per project scope.

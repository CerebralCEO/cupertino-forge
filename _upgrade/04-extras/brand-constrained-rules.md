# Apple Brand-Constrained UI Rules (No Reproduced Assets)

> **Policy:** This document records **official Apple usage rules, minimum sizes, clear space, and mandatory phrasing ONLY**. Do **NOT** draw, bundle, SVG-trace, or replicate Apple Pay buttons, Apple logos, Wallet badges, or Tap to Pay marks inside `cupertino-forge` or generated user apps. Always use Apple's official APIs or unmodified official artwork downloaded directly from Apple.

---

## 1. Apple Pay
- **Source:** https://developer.apple.com/design/human-interface-guidelines/apple-pay (`Official`, updated June 8, 2026)
- **Allowed / Required:**
  - Always render buttons via Apple's official API (`PKPaymentButton` / Apple Pay JS) so appearance and localization stay compliant.
  - Corner radius may be adjusted to match sibling buttons.
  - Make Apple Pay the primary payment option when credentials are available; show only on supported devices/browsers.
  - **Minimum sizes & margins:**
    - Plain `"Apple Pay"` button: **`>= 100pt × 30pt`** (`200×60px @2x`), minimum outer margin **`>= 1/10` of button height**.
    - Action-verb buttons (`"Book/Buy/Check Out/Donate/Set Up/Subscribe with Apple Pay"`): **`>= 140pt × 30pt`** (`280×60px @2x`), minimum outer margin **`>= 1/10` of button height**.
    - Apple Pay acceptance mark: clear space **`>= 1/10` of mark height**; height `>=` sibling payment marks.
    - Web authorization icon: **`60×60pt`** (`120×120px @2x`, `180×180px @3x`).
- **Prohibited:**
  - Never draw a custom button displaying `"Apple Pay"` or the Apple Pay logo.
  - Never use the Apple Pay acceptance mark as a clickable payment button or share its border with another button/graphic.
  - Never disable, dim, or hide an unavailable Apple Pay button when a product option is missing — explain the missing option after tap instead.

---

## 2. Tap to Pay on iPhone
- **Source:** https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone (`Official`)
- **Allowed / Required:**
  - Use the exact mandatory phrase **`"Tap to Pay on iPhone"`**.
  - Require PSP + Apple entitlement + `ProximityReader` API; present Terms & Conditions only to administrative users before initial setup.
  - Keep the Tap to Pay on iPhone checkout option visible without scrolling even before enabled or while background configuration runs.
  - Provide a merchant tutorial covering contactless cards, Apple Pay, and digital wallets.
- **Prohibited:**
  - Never block checkout waiting on background re-configuration or show Terms & Conditions to non-admin staff.
  - Never alter the official phrase or fabricate custom Apple contactless branding.

---

## 3. Apple Wallet (`Add to Apple Wallet` / `Verify with Apple Wallet`)
- **Source:** https://developer.apple.com/design/human-interface-guidelines/wallet (`Official`, updated June 8, 2026)
- **Allowed / Required:**
  - Use the official **`"Add to Apple Wallet"`** button/badge to add passes; group related passes so users add them in one tap.
  - Display **`"Verify with Apple Wallet"`** only on devices that support identity verification, requested at the exact moment needed with a clear purpose string.
  - Use Apple's Pass Designer / semantic pass fields (never bake text into pass PNGs).
- **Prohibited:**
  - Never redraw the Wallet icon/badge or repeatedly re-prompt after a user declines adding a pass.

---

## 4. Sign in with Apple
- **Source:** https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple (`Official`, last updated Sept 14, 2022)
- **Allowed / Required:**
  - Use Apple's official API (`ASAuthorizationAppleIDButton` / Sign in with Apple JS) or official unmodified downloadable artwork (SVG/PDF for arbitrary sizes).
  - **Mandatory exact titles only:** **`"Sign in with Apple"`**, **`"Sign up with Apple"`**, or **`"Continue with Apple"`**.
  - **Minimum sizes & margins:**
    - Full-title button: **`>= 140pt × 30pt`** (`280×60px @2x`), outer margin **`>= 1/10` of button height**, right margin between title and right edge **`>= 8%` of button width**.
    - Logo-only button: **`1:1` aspect ratio**, outer margin **`>= 1/10` of button height**, **zero extra horizontal padding** (artwork includes built-in padding).
  - Corner radius may match sibling buttons; prefer the system font.
- **Prohibited:**
  - Never invent custom button labels (e.g., `"Login via Apple"`, `"Apple Auth"`), alter the Apple logo proportions, or recreate the Apple logo in hand-coded SVG.

---

## Proposal for `skills/apple-design-core/references/anti-patterns.md` (NOT Applied Yet)

**Recommendation: Yes** — adding a single-line warning to `anti-patterns.md` would prevent LLMs from hallucinating hand-coded SVG Apple Pay / Sign in with Apple / Wallet buttons when scaffolding checkout or auth screens:

> *Proposed 1-line addition (awaiting approval):*
> `- Never hand-draw or replicate brand-constrained Apple buttons or marks (Apple Pay, Tap to Pay on iPhone, Add to Apple Wallet, Sign in with Apple) — always use Apple's official APIs or unmodified official artwork and obey exact phrasing/size/clear-space rules.`

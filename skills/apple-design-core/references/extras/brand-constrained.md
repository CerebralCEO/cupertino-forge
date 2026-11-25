# Brand-Constrained Controls (Sign in with Apple, Apple Pay, Wallet, Tap to Pay)

> Never hand-draw or replicate Apple brand buttons or marks. Always render through Apple's official APIs or unmodified official artwork.

## Sign in with Apple (`[official]`, https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple, `version: unknown`)
- **API:** `ASAuthorizationAppleIDButton` / Sign in with Apple JS `[official]`.
- **Exact titles only:** `"Sign in with Apple"`, `"Sign up with Apple"`, or `"Continue with Apple"` `[official]`.
- **Minimum size & margins:** `>= 140×30pt` (`280×60px @2x`); outer margin `>= 1/10` of button height; right title margin `>= 8%` of button width; logo-only `1:1` with zero extra horizontal padding `[official]`. Corner radius may match sibling buttons `[official]`.

## Apple Pay (`[official]`, https://developer.apple.com/design/human-interface-guidelines/apple-pay, updated June 8, 2026)
- **API:** `PKPaymentButton` / Apple Pay JS `[official]`. Never draw custom `"Apple Pay"` buttons or use the Apple Pay acceptance mark as a clickable button `[official]`.
- **Minimum size & margins:** Plain `"Apple Pay"` `>= 100×30pt`; action-verb buttons (`Buy/Check Out/Book/Donate/Set Up/Subscribe with Apple Pay`) `>= 140×30pt`; outer margin & mark clear space `>= 1/10` of height; web authorization icon `60×60pt` (`120×120 @2x`, `180×180 @3x`) `[official]`.
- **Availability:** Hide if unsupported; make primary when credentials exist; never disable/dim the button `[official]`.

## Wallet & Tap to Pay (`[official]`)
- Use official `"Add to Apple Wallet"` / `"Verify with Apple Wallet"` buttons (https://developer.apple.com/design/human-interface-guidelines/wallet) and exact phrase `"Tap to Pay on iPhone"` (https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone, `version: unknown`) `[official]`.

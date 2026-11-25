# Tap to Pay on iPhone Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `tapToPay.entitlementAndApi` | Requires PSP + Apple Tap to Pay entitlement + `ProximityReader` API | policy | iOS (iPhone only; `version: unknown`) | Both | https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone | Official | high | Not available on macOS / Web / Android |
| `tapToPay.adminTermsGate` | Present Terms & Conditions only to admin user before initial configuration | policy | iOS | Both | https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone | Official | high | Non-admins see message stating admin access is required |
| `tapToPay.alwaysVisibleCheckout` | Keep Tap to Pay on iPhone checkout button visible without scrolling even before enabled or while configuring in background | policy | iOS | Both | https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone | Official | high | Never block merchant waiting for background re-configuration |
| `tapToPay.merchantTutorial` | Provide tutorial covering contactless card, Apple Pay, and digital wallet tap position | policy | iOS | Both | https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone | Official | high | Present after accepting terms & allow re-access |
| `tapToPay.brandPhrasing` | Always use exact phrase `"Tap to Pay on iPhone"` | copy rule | iOS | N/A | https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone | Official | high | Brand-constrained — see `brand-constrained-rules.md` |

# Wallet Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `wallet.passIcon` | `38 × 38` (`icon.png`, `@2x`/`@3x`) | pt | iOS (updated June 8, 2026 for iOS 27 & Pass Designer) | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | System applies rounded corners automatically |
| `wallet.passLogo` | `50–160 × 50` (`logo.png`); Primary `30–126 × 30`; Secondary `12–135 × 12` | pt | iOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Reserve pass images for visual content; put text in semantic pass fields |
| `wallet.passStrip` | `375 × 144` (`strip.png`) | pt | iOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Coupons & store cards |
| `wallet.passThumbnail` | `60–90 × 90` (`thumbnail.png`) | pt | iOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Event tickets & generic passes |
| `wallet.passBackground` | Event `343 × 503` (`background.png`); Poster `358 × 448` (`artwork.png`) | pt | iOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Poster generic & poster event ticket styles |
| `wallet.passFooter` | `268 × 15` (`footer.png`) | pt | iOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Airline boarding passes |
| `wallet.addButtonRule` | Use official `Add to Apple Wallet` button; add related passes as a group | policy | iOS, Web | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Brand-constrained asset — see `brand-constrained-rules.md` |
| `wallet.verifyIdentity` | Show `Verify with Apple Wallet` only on supported devices + explicit purpose string | policy | iOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/wallet | Official | high | Request only at the exact moment needed |

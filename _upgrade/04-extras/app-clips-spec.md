# App Clips Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `appClips.navRule` | Linear, focused UI — no tab bars, complex navigation, or settings | policy | iOS, iPadOS (14–27; updated June 9, 2025 for demo App Clips) | Both | https://developer.apple.com/design/human-interface-guidelines/app-clips | Official | high | Launch directly into the contextually relevant task |
| `appClips.noSplashNoWebView` | Omit splash screens; avoid WebViews; no ads/pure marketing | policy | iOS, iPadOS (14–27) | Both | https://developer.apple.com/design/human-interface-guidelines/app-clips | Official | high | Bundle all required assets for instant launch |
| `appClips.accountDeferral` | Avoid requiring account creation before value; prefer Sign in with Apple | policy | iOS, iPadOS (14–27) | Both | https://developer.apple.com/design/human-interface-guidelines/app-clips | Official | high | Allow completing the task or demo without installing full app |
| `appClips.codeGeneration` | Must use App Store Connect or Apple App Clip Code Generator CLI only; never alter | policy | iOS, iPadOS (14–27) | N/A | https://developer.apple.com/design/human-interface-guidelines/app-clips | Official | high | No filters, glows, shadows, or custom redraws |
| `appClips.printSpecs` | Rasterize SVG `>= 600` ppi; print `>= 300` dpi on matte non-reflective finish | ppi / dpi | Physical / iOS | N/A | https://developer.apple.com/design/human-interface-guidelines/app-clips | Official | high | NFC-integrated codes require Type 5 NFC tag `>= 35 mm` diameter |
| `appClips.copyCase` | Always Title Case: `"App Clips"`, `"App Clip Code"` | copy rule | All | N/A | https://developer.apple.com/design/human-interface-guidelines/app-clips | Official | high | Stop displaying code if App Clip is deactivated |

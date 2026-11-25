# Augmented Reality (ARKit) Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `ar.coachingView` | Use system `ARCoachingOverlayView` during initialization/relocalization; hide unrelated app UI while active | policy | iOS, iPadOS (`version: unknown`) | Both | https://developer.apple.com/design/human-interface-guidelines/augmented-reality | Official | high | Guides user to move device to detect horizontal/vertical surfaces |
| `ar.noScaleForDistance` | Never scale virtual objects up/down to simulate distance changes | policy | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/augmented-reality | Official | high | Breaks depth perception; move in real 3D space instead |
| `ar.maxReferenceImages` | `<= 100` distinct reference images active simultaneously | count | iOS, iPadOS | N/A | https://developer.apple.com/design/human-interface-guidelines/augmented-reality | Official | high | Optimal ARKit image detection performance limit |
| `ar.plainLanguageCopy` | Avoid technical jargon (`"plane"`, `"anchor"`, `"tracking"`, `"insufficient features"`) in user prompts | copy rule | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/augmented-reality | Official | high | Say `"surface"`, `"moving around"`, `"turn on more lights"` |
| `ar.physicsConsistency` | Object motion must match real-world surface physics | policy | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/augmented-reality | Official | high | Avoid gliding smoothly across uneven surfaces |

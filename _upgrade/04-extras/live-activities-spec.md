# Live Activities Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `liveActivity.locations` | Lock Screen, Home Screen, Dynamic Island, StandBy (iPhone/iPad); Menu Bar (macOS) | enum | iOS, iPadOS, macOS (16–27) | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | macOS displays Live Activities in the menu bar |
| `liveActivity.presentations` | `compact` (leading+trailing), `minimal` (up to 3 active), `expanded`, `lockScreen`, `standBy` (`2x` scale) | enum | iOS, iPadOS (16–27) | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | StandBy shows minimal, taps into 2x Lock Screen layout |
| `liveActivity.maxDuration` | `<= 8` | hours | iOS, iPadOS, macOS (16–27) | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Must have a defined beginning and end |
| `liveActivity.noAdsRule` | Never display ads or promotions | policy | All | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Only task/event-relevant live updates |
| `liveActivity.privacyRule` | Avoid sensitive personal data on Lock Screen / Always-On | policy | All | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Visible to casual observers |
| `liveActivity.logoRule` | Use containerless logo mark; never place full app icon | policy | All | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Integrates cleanly with Dynamic Island & Lock Screen |
| `liveActivity.noAppCallout` | Never draw in-app UI pointing to the Dynamic Island | policy | iOS (16–27) | Both | https://developer.apple.com/design/human-interface-guidelines/live-activities | Official | high | Dynamic Island shows Live Activities while app is backgrounded |

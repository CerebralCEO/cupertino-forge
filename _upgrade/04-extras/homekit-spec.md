# HomeKit Specification (HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|
| `homekit.objectHierarchy` | `Home` → `Zone` → `Room` → `Accessory` → `Service` → `Characteristic` | taxonomy | iOS, iPadOS, macOS (`version: unknown`) | Both | https://developer.apple.com/design/human-interface-guidelines/homekit | Official | high | Always align UI terminology with HomeKit model |
| `homekit.sceneTerm` | Always display `"scene"` in UI (never API term `"action set"`) | copy rule | iOS, iPadOS, macOS | Both | https://developer.apple.com/design/human-interface-guidelines/homekit | Official | high | Mandatory UX vocabulary alignment with Apple Home app |
| `homekit.systemSetupFlow` | Use system-provided HomeKit accessory setup flow; never duplicate home settings | policy | iOS, iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/homekit | Official | high | Lets users name accessories, join Wi-Fi, and assign rooms seamlessly |
| `homekit.detailDiscoverability` | Even in accessory-centric UIs, keep Room and Zone details discoverable | policy | iOS, iPadOS, macOS | Both | https://developer.apple.com/design/human-interface-guidelines/homekit | Official | high | Prevents user confusion between app and Apple Home |

# HomeKit (`[official]`, `version: unknown`)

- **Source:** https://developer.apple.com/design/human-interface-guidelines/homekit (`version: unknown` for iOS/macOS 27 delta) `[official]`.
- **Hierarchy & copy:** Follow `Home → Zone → Room → Accessory → Service → Characteristic`; always display `"scene"` in UI (never API term `"action set"`); keep Room/Zone details discoverable even in accessory-centric layouts `[official]`.
- **Setup:** Use the system-provided HomeKit accessory setup flow and never duplicate home configuration UI `[official]`.

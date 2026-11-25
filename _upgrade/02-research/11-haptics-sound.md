# 11 — Haptics, Tactile Feedback & Synthesized UI Sound Design

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/feedback.json`, `scripts/synth-sounds.py`, `assets/sounds/*.wav`, `apple-design-core` (`patterns`), এবং `apple-web` / `apple-flutter` / `apple-tauri`-এর হ্যাপটিক ও অডিও ফিডব্যাক সিস্টেমের রেফারেন্স; Apple-এর নিজস্ব copyrighted অডিও ফাইল এড়িয়ে বৈধ ও সুসঙ্গত ট্যাকটাইল ফিডব্যাক ডিজাইন করতে এটি ব্যবহার হবে।

---

## 1. Apple Haptic Design Principles (HIG Official)

Apple HIG ([Playing haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics)) এবং ([Playing audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio)) অনুসারে:
1. **Causal & Consistent Mapping**: প্রতিটি haptic pattern-কে তার documented অর্থ অনুযায়ী ব্যবহার করতে হবে (negative/error pattern কখনো success-এ বাজানো যাবে না)।
2. **Restraint & Optionality**: অতিরিক্ত haptic বিরক্তিকর হয়ে ওঠে; short transient events (`CoreHaptics` transient vs continuous) সাধারণ UI-র জন্য উত্তম, এবং মানুষ যেন haptics mute/off করতে পারে তা নিশ্চিত করতে হবে।
3. **Device Interoperability Caution**: Haptic vibration যেন camera capture, gyroscope বা active microphone recording নষ্ট না করে।
4. **Hardware Differences**:
   - **iPhone (Taptic Engine)**: Switches, sliders, pickers স্বয়ংক্রিয়ভাবে haptic বাজায়; custom controls-এ `UIFeedbackGenerator`।
   - **macOS (Force Touch Trackpad)**: কেবল drag/force-click context-এ `NSHapticFeedbackPerformer` (`alignment`, `levelChange`, `generic`) — সাধারণ button click-এ macOS কোনো haptic বা sound দেয় না।
   - **watchOS**: Taptic Engine haptic + audible tone সংমিশ্রণ ও Digital Crown detent; **9টি `WKHapticType`**।
5. **Silent Switch & Audio Session Category**: Non-essential UI sound সবসময় **Silent Switch / Ring-Silent** মানবে (`Ambient` বা `SoloAmbient` category), এবং কখনো অন্য অ্যাপের music থামাবে না (`Ambient` mixes with other audio)।

---

## 2. Official APIs & Cross-Platform Haptic/Sound Matrix

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `haptic.ios.impactStyles` | `light`, `medium`, `heavy`, `soft`, `rigid` | Swift enum | iOS 10–27 (soft/rigid 13+) | Both | https://developer.apple.com/documentation/uikit/uiimpactfeedbackgenerator/feedbackstyle | Official | high | Physical collision metaphor; match intensity to visual mass |
| `haptic.ios.notificationTypes` | `success`, `warning`, `error` | Swift enum | iOS 10–27 | Both | https://developer.apple.com/documentation/uikit/uinotificationfeedbackgenerator/feedbacktype | Official | high | Task completion / warning / failure |
| `haptic.ios.selection` | `UISelectionFeedbackGenerator` | class | iOS 10–27 | Both | https://developer.apple.com/design/human-interface-guidelines/playing-haptics | Official | high | Discrete selection changes (picker wheel, slider tick, segment) |
| `haptic.macos.patterns` | `alignment`, `levelChange`, `generic` | NSHapticFeedbackPattern | macOS (Force Touch Trackpad) | Both | https://developer.apple.com/documentation/appkit/nshapticfeedbackmanager | Official | high | Only during drag alignment / scrub / force click (`performer`) |
| `haptic.watchos.types` | `notification`, `directionUp`, `directionDown`, `success`, `failure`, `retry`, `start`, `stop`, `click` | WKHapticType | watchOS 4–27 | Both | https://developer.apple.com/design/human-interface-guidelines/playing-haptics | Official | high | Digital Crown & explicit timer/task states |
| `audio.sessionCategories` | `soloAmbient`, `ambient`, `playback`, `record`, `playAndRecord` | AVAudioSession | iOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/playing-audio | Official | high | Use `ambient` for optional UI sound effects so music keeps playing |
| `audio.watchos.encoding` | `64` (`HE-AAC`) | kbps | watchOS | Both | https://developer.apple.com/design/human-interface-guidelines/playing-audio | Official | high | Recommended bandwidth-efficient audio asset encoding |
| `web.vibrate.selection` | `[8]` (light `[10]`, medium `[18]`, heavy `[28]`) | ms pattern | Android Chrome Web | Both | `tokens/feedback.json` | Estimated | med | `navigator.vibrate(...)`; no effect on iOS Safari or Desktop |
| `web.vibrate.notification` | `success: [12,60,18]`, `warn: [20,80,20]`, `err: [25,50,25,50,25]` | ms pattern | Android Chrome Web | Both | `tokens/feedback.json` | Estimated | med | User-gesture gated |
| `web.iosSafariHapticWorkaround` | `<input type="checkbox" switch>` hidden label `.click()` | DOM trick | iOS Safari 17.4–27 | Both | `tokens/feedback.json` | Measured | med | Unofficial Safari switch haptic trigger; only works synchronously inside user gesture |
| `sound.catalog.masterVolume` | `0.35` (`throttle: 40 ms`) | gain / ms | Web / Desktop | Both | `tokens/feedback.json` & `scripts/synth-sounds.py` | Estimated | high | Original 44.1 kHz 16-bit mono WAV synthesis; opt-in OFF by default |
| `sound.synth.tap` | `4.5kHz bandnoise + 1.8kHz sine, 25ms, -14 dBFS` | WAV (0.06s) | Web / Desktop | Both | `scripts/synth-sounds.py` | Measured | high | Exact parameters verified from generator script; zero Apple copyright risk |
| `sound.synth.toggle` | `on: 1.2kHz -> 2.4kHz (+18ms), off: reverse` | WAV (0.09s) | Web / Desktop | Both | `scripts/synth-sounds.py` | Measured | high | Verified in `scripts/synth-sounds.py:61-62` |

---

## 3. Flutter & Web Cross-Platform Implementation Parity *(Untested)*

| Event | Apple Native | Flutter (`services`) | Web (`lib/haptics.ts`) | Sound Opt-in |
| --- | --- | --- | --- | --- |
| `toggleChange` / `segmentChange` / `pickerTick` | `UISelectionFeedbackGenerator` | `HapticFeedback.selectionClick()` | Android `vibrate([8])` / iOS Safari `<input switch>` | `toggle-on/off.wav`, `tick.wav` (40ms throttle) |
| `longPressMenuOpen` | `UIImpactFeedbackGenerator(.medium)` | `HapticFeedback.mediumImpact()` | `vibrate([18])` | `none` |
| `pullToRefreshTrigger` / `sheetDetentSnap` | `UIImpactFeedbackGenerator(.light)` | `HapticFeedback.lightImpact()` | `vibrate([10])` | `refresh.wav` |
| `success` / `error` | `UINotificationFeedbackGenerator` | `mediumImpact` / `heavyImpact` (+ `vibrate`) | Notification `vibrate` patterns | `success.wav` / `error.wav` |
| `buttonPrimaryTap` | **None** (System buttons do not buzz) | `none` | `none` | `tap.wav` (opt-in only) |

> [!WARNING]
> **Copyright Guardrail**: Apple-এর macOS/iOS system `.aiff`/`.caf` ফাইলের কপি প্রজেক্টে ship করা যাবে না (`Apple copyrighted assets`)। `scripts/synth-sounds.py` কেবল পরিচ্ছন্ন `numpy` দিয়ে নিজস্ব `WAV` (`tap`, `toggle-on`, `toggle-off`, `tick`, `success`, `error`, `send`, `refresh`, `keyboard`) তৈরি করে।

---

## 5. Gaps & Open Questions
- iOS 27 `CoreHaptics` বা নতুন `UIImpactFeedbackGenerator` style যোগ হয়েছে কি না — Apple DocC `Playing haptics` মে ৭, ২০২৪-এর পর হালনাগাদ হয়নি (iOS 27-এ নতুন haptic enum নেই বলেই প্রতীয়মান)।
- Safari 26/27-এ hidden `<input type="checkbox" switch>` haptic trick অব্যাহত আছে কি না তা Windows-এ পরীক্ষা করা সম্ভব হয়নি (`Platform-dependent` — physical iPhone প্রয়োজন)।

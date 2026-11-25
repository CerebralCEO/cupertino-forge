# 07 — Motion, Spring Physics, Scroll Deceleration & Gesture Curves

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/motion.json`, `scripts/build-tokens.mjs` (CSS `linear()` spring sampler), `apple-design-core` (`motion`), `apple-web` (`motion/react`), এবং `apple-flutter` (`SpringSimulation` / `BouncingScrollPhysics`)-এর জন্য Apple spring physics, scroll inertia, navigation transitions ও Reduce Motion fallback-এর প্রামাণ্য সূত্র।

---

## 1. Apple Spring Model (WWDC23 `Spring(duration:bounce:)` Exact Math)

Apple SwiftUI `Spring` documentation (`https://developer.apple.com/documentation/swiftui/spring`) সরাসরি উদাহরণ দিয়ে যাচাই করে দিয়েছে:
- `Spring(duration: 0.5, bounce: 0.3)` → `(mass: 1.0, stiffness: 157.9, damping: 17.6)`.
- আমাদের সূত্র `stiffness = (2π / d)²`, `damping = 4π(1 - b) / d` (যখন `b ≥ 0`, `mass = 1`) দিয়ে হিসাব করলে পাওয়া যায় **`stiffness = 157.914`, `damping = 17.593`** — যা Apple-এর rounded output-এর সঙ্গে হুবহু মিলে যায়!
- **Perceptual Preset Names (`Official` APIs)**: SwiftUI `Spring` নির্ধারিত built-in preset দেয়: `smooth`, `snappy`, `bouncy` (ও `Animation.default` = response `0.55`, critically damped)।

---

## 2. Numeric & Behavioral Motion Specification

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `spring.default` | `duration: 0.55, bounce: 0.0` (`k=130.507, c=22.848`) | s / N·m⁻¹ / N·s·m⁻¹ | iOS / macOS | Both | https://developer.apple.com/documentation/swiftui/spring | Official | high | Critically damped (`ζ = 1.0`) baseline |
| `spring.smooth` | `duration: 0.5, bounce: 0.0` (`k=157.914, c=25.133`) | s / N·m⁻¹ / N·s·m⁻¹ | iOS / macOS | Both | https://developer.apple.com/documentation/swiftui/spring | Official | high | Layout reflows & size transitions |
| `spring.snappy` | `duration: 0.5, bounce: 0.15` (`k=157.914, c=21.363`) | s / N·m⁻¹ / N·s·m⁻¹ | iOS / macOS | Both | https://developer.apple.com/documentation/swiftui/spring | Official | high | Toggles, segmented indicator, selection pills |
| `spring.bouncy` | `duration: 0.5, bounce: 0.3` (`k=157.914, c=17.593`) | s / N·m⁻¹ / N·s·m⁻¹ | iOS / macOS | Both | https://developer.apple.com/documentation/swiftui/spring | Official | high | Verified directly against Apple doc example (`157.9, 17.6`) |
| `spring.interactive` | `duration: 0.15, bounce: 0.0` (`k=1754.596, c=83.776`) | s | iOS / macOS | Both | https://developer.apple.com/documentation/swiftui/spring | Estimated | med | Immediate finger tracking & drag settle |
| `spring.press` / `release` | `0.2 / 0.0` & `0.35 / 0.15` | s / bounce | iOS / macOS | Both | `tokens/motion.json` | Estimated | med | Button press & Liquid Glass release settle |
| `spring.popover` | `duration: 0.35, bounce: 0.1` (`k=322.273, c=32.314`) | s | iOS / macOS | Both | `tokens/motion.json` | Estimated | med | Scale-in from anchor for menus & popovers |
| `spring.glassMorph` | `duration: 0.45, bounce: 0.2` (`k=194.955, c=22.34`) | s | iOS 26+ / macOS 26+ | Both | https://developer.apple.com/documentation/swiftui/glasseffectcontainer | Estimated | low | `GlassEffectContainer` merge/split morph timing; visually tuned |
| `scroll.decelerationRate.normal` | `0.998` | per-ms velocity multiplier | iOS / iPadOS | Both | https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate | Official | high | Exponential decay factor per millisecond after finger lift |
| `scroll.decelerationRate.fast` | `0.99` | per-ms velocity multiplier | iOS / iPadOS | Both | https://developer.apple.com/documentation/uikit/uiscrollview/decelerationrate | Official | high | Used in paging / quick-stop pickers & tables |
| `scroll.rubberBandConstantC` | `0.55` | dimensionless | iOS / iPadOS | Both | https://twitter.com/chpwn/status/285540192096497664 | Inferred | high | `offset = (1 - 1 / ((x * 0.55 / d) + 1)) * d` [Re-audited: Inferred from non-kit source] |
| `nav.pushOutgoingParallax` | `30` | % viewport width | iOS | Both | https://developer.apple.com/documentation/uikit/uinavigationcontroller | Inferred | high | Outgoing view shifts `30%` toward leading edge under incoming 100% slide [Re-audited: Inferred from non-kit source] |
| `nav.zoomTransition` | `NavigationTransition.zoom` + `matchedTransitionSource` | SwiftUI API | iOS 18+ / 26+ | Both | https://developer.apple.com/documentation/swiftui/navigationtransition | Official | high | Fluid shared-element morph from tapped card/thumbnail |
| `sheet.dismissVelocity` | `600` | pt/s | iOS / iPadOS | Both | `tokens/motion.json` | Estimated | med | Fling gesture dismiss threshold |
| `sheet.dismissDistance` | `40` | % sheet height | iOS / iPadOS | Both | `tokens/motion.json` | Estimated | med | Release threshold when velocity is low |
| `motion.reducedMotionFade` | `200` | ms | All | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Inferred | high | HIG: replace x/y/z slide & scale/blur transitions with crossfade, bounce=0 |

---

## 3. Input Modality Differentiation & Reduce Motion (HIG Official)

Apple HIG ([Motion](https://developer.apple.com/design/human-interface-guidelines/motion) এবং [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)) অনুসারে:
1. **Direct Touch vs Trackpad**: Liquid Glass touch-এ বেশি প্রাণবন্ত (`scale ~1.08–1.12`, glow highlight) প্রতিক্রিয়া দেয়, কিন্তু trackpad/mouse-এ **subdued** থাকে (`scale ~1.02`)।
2. **Interruptibility & Cancellation**: User কোনো animation শেষ হওয়ার আগেই পরের ট্যাপ/ড্র্যাগ করতে পারতে হবে — animation চলাকালীন UI block করা নিষেধ।
3. **Scroll Edge Effects (iOS 26+/27)**: Scrollable content বারের নিচে গেলে কঠোর কাট-লাইন না দিয়ে `ScrollEdgeEffectStyle` (`automatic`, `soft`, `hard`) দিয়ে ক্রমশ ঝাপসা/fade করে দেয়।
4. **Reduce Motion (`prefers-reduced-motion: reduce`)**:
   - Bounce বন্ধ করতে হবে (`bounce = 0`)।
   - X/Y/Z axis-এ slide, zoom বা Z-depth পরিবর্তন **crossfade** দিয়ে প্রতিস্থাপন করতে হবে (~`180–200ms`)।
   - Blur-এর ভেতরে-বাইরে animate করা যাবে না (`Avoid animating into and out of blurs`)।
   - Gesture-driven 1:1 direct tracking (যেমন drag-to-scroll) চালু রাখা যায়, কেবল spring fling ও parallax বাদ যাবে।

---

## 4. Untested Cross-Platform Recipes

### Web (`motion/react` + CSS `linear()`, Untested)
- **`motion/react`**: App root-এ `<MotionConfig reducedMotion="user">` দিয়ে wrap করলে OS-level Reduce Motion অটোমেটিক `transform`/`scale` বন্ধ করে opacity রাখবে; spring call-এ `{ type: "spring", duration: 0.5, bounce: 0.15 }` ব্যবহার করুন।
- **Pure CSS**: `scripts/build-tokens.mjs` `--cf-ease-<name>` (`linear(...)`) ও `--cf-dur-<name>` জেনারেট করে; `@media (prefers-reduced-motion: reduce)`-এ duration `200ms` ও easing `ease` (বা opacity-only transition) করতে হবে।

### Flutter (`SpringSimulation` & Scroll, Untested)
- **Spring**: `SpringDescription(mass: 1.0, stiffness: 157.914, damping: 21.363)` (`snappy`) + `SpringSimulation` বা `CurvedAnimation` থেকে দূর হয়ে physics-driven `AnimationController.animateWith(sim)`।
- **Scroll**: iOS/macOS-এ `BouncingScrollPhysics(decelerationRate: ScrollDecelerationRate.fast)` (বা default normal যা `0.998` মডেলে চলে); `MediaQuery.disableAnimationsOf(context)` true হলে `AnimatedSwitcher` duration `200ms` fade-only-তে নামাতে হবে।

---

## 5. Gaps & Open Questions
- `tokens/motion.json`-এর `press` (`0.2s`), `release` (`0.35s`), `popover` (`0.35s`), `glassMorph` (`0.45s`), `sheet.dismissVelocity` (`600 pt/s`), এবং `listRowHighlight` (`250ms`) মানগুলো `Estimated` — macOS 27 / iOS 27 high-FPS (120Hz ProMotion) স্ক্রিন রেকর্ডিং ফ্রেম-বাই-ফ্রেম বিশ্লেষণ করে যাচাই প্রয়োজন।

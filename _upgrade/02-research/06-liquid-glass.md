# 06 — Liquid Glass, Standard Materials, Vibrancy & GPU Performance Budgets

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `tokens/materials.json`, `apple-design-core` (`liquid-glass` / `materials`), `apple-web`, `apple-flutter`, `apple-tauri`, ও `apple-design-audit` / `lint.mjs`-এর জন্য Liquid Glass-এর একমাত্র সত্য সূত্র (single source of truth); এখানে Official iOS 26/27 ও macOS 26/27 API spec, Sketch UI Kit raw layers, এবং Web/Flutter GPU performance ও accessibility fallback নিয়ম সংরক্ষিত আছে।

---

## 1. Architecture: Functional Layer vs Content Layer (Apple Official)

Apple HIG ([Materials](https://developer.apple.com/design/human-interface-guidelines/materials)) এবং [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass) অনুযায়ী:
1. **Liquid Glass শুধু Functional Layer-এ থাকে**: Tab bars, toolbars, navigation bars, sidebars (macOS/iPadOS edge-to-edge), floating action buttons, menus, popovers, alerts, partial-height sheets, এবং interactive control-এর active/dragged thumb (sliders/toggles)।
2. **Content Layer-এ নিষেধ**: Card, list row, table cell বা screen background-এ Liquid Glass ব্যবহার করা যাবে না — সেখানে **Standard Materials** (`ultraThin`, `thin`, `regular`, `thick`; macOS-এ + `ultraThick`) এবং solid/grouped backgrounds ব্যবহার করতে হবে।
3. **Never Stack Glass on Glass**: একটি glass container-এর (যেমন toolbar বা popover) ভেতরের nested button/control আরেকটি আলাদা Liquid Glass backdrop তৈরি করবে না; বরং `overGlass` / vibrant fills অথবা `GlassEffectContainer`-এর shared lens ব্যবহার করবে।
4. **Two Variants Only (`regular` vs `clear`)**:
   - **`regular`** (default): Background blur + luminosity adaptation করে, যাতে text, labels, alerts ও sidebars-এর legibility বজায় থাকে।
   - **`clear`**: উচ্চ স্বচ্ছতা (highly translucent), কেবল photo/video/rich media-এর ওপর ব্যবহারযোগ্য; নিচের media উজ্জ্বল হলে **35% dark dimming layer** (`#000000@0.35`) দিতে হবে।
5. **Small vs Large Luminance Adaptation**: ছোট glass elements (tab bar, pill button) নিচের content অনুযায়ী light/dark-এ রূপান্তরিত হতে পারে; বড় elements (sidebar, full/medium sheet) readability ধরে রাখতে বেশি opaque থাকে।
6. **iOS 27 / macOS 27 (WWDC 2026) Refinement — Intensity Slider**: WWDC 2026 press reports অনুযায়ী iOS 27 ও macOS 27 Settings-এ পূর্বে থাকা binary preset-এর পরিবর্তে **Clear থেকে Tinted/More Opaque পর্যন্ত একটি continuous intensity slider** এবং text legibility বাড়াতে উন্নত background diffusion ও stronger specular highlights যোগ করা হয়েছে (`Class: Inferred` — Xcode 27 / physical device ছাড়া exact shader curve পরিমাপ করা যায়নি)।

---

## 2. Official APIs & Kit Measurements (9-Column Specification)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `glass.variants` | `regular`, `clear`, `identity` | SwiftUI enum | iOS 26+ / macOS 26+ | Both | https://developer.apple.com/documentation/swiftui/glass | Official | high | Supports `.tint(_:)` & `.interactive(_:)` chaining |
| `glass.clear.dimmingLayerAlpha` | 35 (`#000000@0.35`) | % opacity | iOS 26+ / macOS 26+ | Both | https://developer.apple.com/design/human-interface-guidelines/materials | Official | high | Required behind `.clear` when underlying media is bright |
| `glass.scrollEdgeStyles` | `automatic`, `soft`, `hard` | SwiftUI enum | iOS 26+ / macOS 26+ | Both | https://developer.apple.com/documentation/swiftui/view/scrolledgeeffectstyle(_:for:) | Official | high | Obscures scrolled content beneath bars (`UIScrollEdgeElementContainerInteraction`) |
| `glass.tabBarMinimizeBehavior` | `automatic`, `onScrollDown`, `onScrollUp`, `never` | SwiftUI enum | iOS 26+ | Both | https://developer.apple.com/documentation/swiftui/view/tabbarminimizebehavior(_:) | Official | high | Recedes floating tab bar to elevate underlying content |
| `glass.uiKitClass` | `UIGlassEffect` | class | iOS 26+ / iPadOS 26+ | Both | https://developer.apple.com/documentation/uikit/uiglasseffect | Official | high | Paired with `UIVisualEffectView` (`style`, `isInteractive`, `tintColor`) |
| `glass.appKitClass` | `NSGlassEffectView` | class | macOS 26+ | Both | https://developer.apple.com/documentation/appkit/nsglasseffectview | Official | high | Properties: `style` (`regular`/`clear`), `cornerRadius`, `tintColor`, `effectIsInteractive` |
| `glass.ios27.intensitySlider` | `0.0` (clear) – `1.0` (tinted) | normalized | iOS 27 / macOS 27 | Both | https://www.macrumors.com/ | Inferred | med | WWDC 2026 continuous Settings slider (`--cf-glass-intensity` default `0.5` is Estimated) |
| `kit.ios.regularLarge.fills` | `["#FFFFFF@0.7", "#BFBFBF@0.1"]` / `["#1A1A1A@0.5", "#1A1A1A@0.9", "#1A1A1A"]` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Sketch drops `plus-lighter`/`plus-darker` blend modes |
| `kit.ios.regularMedium.fills` | `["#CCCCCC@0.7", "#BFBFBF@0.1"]` / `["#1A1A1A@0.3", "#1A1A1A@0.3", "#1A1A1A"]` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | 9 shadow/rim-highlight layers in kit JSON |
| `kit.ios.regularSmall.fills` | `["#F8F8F8@0.2", "#000000@0.25", "#FFFFFF@0.25", "#444444@0.6"]` / `["#000000", "#999999@0.17"]` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Requires tuned CSS composite (`tokens/materials.json`) without raw Sketch blend loss |
| `kit.ios.clear.fills` | `["#F8F8F8@0.12"]` | sRGB hex/alpha | iOS 27 | Any | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Pair with 35% dimming if media behind is bright |
| `kit.macos.menus.fills` | `["#E6E6E6@0.55"]` / `["#5A5A5A@0.5"]` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Plus 7 rim/drop shadow stops (`0 4 24 #000@0.3` outer) |
| `kit.macos.notification.fills` | `["#BFBFBF@0.25"]` / `["#666666@0.1"]` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Light & Dark share 7 rim-highlight/shadow stops |
| `kit.macos.dock.fills` | `["#4D4D4D@0.3", "#1A1A1A@0.1", "#FFFFFF@0.08"]` / `["#454545@0.5", ...]` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | Dock frosted capsule substrate |
| `material.std.ios.fills` | `ultraThin:#FFF@0.07+.03`..`thick:#FFF@0.34+.84` / `#000@0`..`0.6` | sRGB hex/alpha | iOS 27 | Light / Dark | `tokens/source/apple-ios-27-ui-kit.tokens.json` | Measured | high | Content-layer materials behind vibrant labels |
| `material.std.macos.fills` | `ultraThin:#ECECEC@0.38`..`ultraThick:0.88` / `#292929@0.4`..`#2C2C2C@0.82` | sRGB hex/alpha | macOS 27 | Light / Dark | `tokens/source/apple-macos-27-ui-kit.tokens.json` | Measured | high | macOS uses 5 thickness tiers (`ultraThin`..`ultraThick`) |
| `tuned.blurPx` | `8` (small), `12` (medium), `20` (large) | px | Web / Flutter | Both | https://developer.apple.com/design/human-interface-guidelines/materials | Estimated | med | Sketch token export drops live blur kernel; tuned against kit screenshots |
| `tuned.saturateBrightness` | `saturate(1.8) brightness(1.05)` Light / `brightness(0.9)` Dark | CSS filter | Web | Light / Dark | `tokens/materials.json` | Estimated | med | Compensates for Sketch blend mode omission on Web |
| `tuned.refractionEdgePx` | `12` | px | Web | Both | `tokens/materials.json` | Estimated | low | Edge lens displacement fading to `0` at 30% inset (CSS cannot truly refract without SVG/WebGL) |
| `tuned.pressScaleTouch` | `1.08–1.12` (mouse/trackpad `1.02`) | scale | iOS / macOS | Both | https://developer.apple.com/design/human-interface-guidelines/motion | Inferred | med | HIG confirms greater touch emphasis & subdued pointer effect; exact ratio Estimated |
| `glass.fallbackOpaque` | `#F6F6F6` / `#262626` | sRGB hex | All | Light / Dark | `tokens/materials.json` | Estimated | med | Active under Reduce Transparency or low-tier GPU fallback |
| `perf.maxSimultaneousBackdrop` | `6` | elements/viewport | Web / Flutter | Both | https://docs.flutter.dev/perf/rendering-performance | Estimated | med | Each ungrouped blur triggers an offscreen framebuffer pass (`saveLayer`) |
| `desktop.tauriVibrancyCrate` | `window-vibrancy` `0.8+` (`LiquidGlassOptions`) | Rust crate | macOS 26+ (Desktop) | Both | https://docs.rs/window-vibrancy/latest/window_vibrancy/ | Official | high | `v0.7` uses legacy `NSVisualEffectView`; `v0.8` exposes `NSGlassEffectViewStyle` + `radius` |
| `desktop.electronVibrancy` | `vibrancy: 'sidebar'/'hud-window'` (`macOS`) / `backgroundMaterial: 'mica'` (`Win11`) | API config | macOS / Windows 11 | Both | https://www.electronjs.org/docs/latest/api/browser-window | Official | high | Cross-platform desktop approximation without private SPIs |

---

## 3. GPU & Rendering Performance Rules (Cross-Platform)

1. **SwiftUI (`GlassEffectContainer`)**: একাধিক custom `.glassEffect()` view-কে আলাদা না রেখে সবসময় `GlassEffectContainer(spacing:)` দিয়ে wrap করতে হবে — এটি শুধু কাছাকাছি এলে morphing দেয় না, Apple doc অনুসারে **rendering performanceও অপটিমাইজ করে** single unified pass-এ।
2. **Flutter (Impeller Optimization — Critical)**:
   - Flutter 3.29+ এ scrollable list বা toolbar-এ একাধিক glass pill থাকলে **`BackdropGroup` + `BackdropFilter.grouped`** ব্যবহার করা বাধ্যতামূলক (প্রতিটি card-এ আলাদা `BackdropFilter` দিলে Impeller প্রতি ফ্রেমে একাধিক `saveLayer` কপি করে frame drop করায়)।
   - **Gotcha 1 (Overlap)**: Spatialভাবে একে অপরকে ঢেকে রাখা (overlapping) দুইটি element-এ একই `BackdropGroup` ব্যবহার করা যাবে না (artifact হয়)।
   - **Gotcha 2 (Clipping)**: প্রতিটি `BackdropFilter` অবশ্যই `ClipRRect` / `ClipRect`-এর ভেতর থাকতে হবে।
   - **Gotcha 3 (Animation)**: কখনেই blur `sigmaX`/`sigmaY` frame-by-frame animate করবেন না (`convolution kernel` rebuild হয়); `sigma` স্থির রেখে overlay color-এর opacity animate করতে হবে।
3. **Web / Chromium / Safari Compositor**:
   - `backdrop-filter: blur(...)` একটি নতুন stacking context ও GPU readback layer তৈরি করে। Scrolling container-এ ৬টির বেশি active backdrop element একসাথে visible থাকলে (`perf.maxSimultaneousBackdrop`) লো-এন্ড Android/laptop GPU-তে scroll jank তৈরি হয়।
   - `@media (prefers-reduced-transparency: reduce)` এখনো Safari-তে সমর্থিত নয় (Chromium `118+` supported), তাই Web runtime-এ একটি user-accessible toggle (`[data-reduced-transparency="true"]`) রাখা বাধ্যতামূলক।
4. **Tauri / Electron App Store Warning**:
   - Tauri-তে `macOSPrivateApi: true` ব্যবহার করলে Mac App Store (MAS) review-এ **private API rejection** হতে পারে; MAS distribution-এর জন্য `window-vibrancy 0.8+` (`NSGlassEffectView` / public `NSVisualEffectView`) অথবা pure Web/CSS backdrop fallback (`Untested`) বেছে নেওয়া উচিত।

---

## 4. Untested Implementation Recipes

### Web CSS (`--cf-glass-intensity`, Untested)
```css
/* Untested — verify against kit screenshots on Safari & Chromium */
:root { --cf-glass-intensity: 0.5; }
.cf-glass-regular {
  background: color-mix(in srgb, rgba(255,255,255, calc(0.32 + 0.46 * var(--cf-glass-intensity))) 100%, transparent);
  backdrop-filter: blur(calc(8px + 12px * var(--cf-glass-intensity))) saturate(1.8) brightness(1.05);
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(0,0,0,0.06), 0 8px 24px -4px rgba(0,0,0,0.14);
}
@media (prefers-reduced-transparency: reduce) {
  .cf-glass-regular { backdrop-filter: none; background: #F6F6F6; }
}
```

### Flutter (`BackdropGroup` + `BackdropFilter.grouped`, Untested)
```dart
// Untested — requires Flutter 3.29+ Impeller verification
BackdropGroup(
  child: Row(
    children: [
      ClipRSuperellipse(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter.grouped(
          filter: ui.ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Container(color: const Color(0x94FFFFFF), child: childA),
        ),
      ),
    ],
  ),
)
```

---

## 5. Gaps & Open Questions
- Sketch token export `blendMode` (`plus-lighter`/`plus-darker`) এবং live Gaussian blur sigma বাদ দেয় — `tuned.blurPx` ও `tuned.refractionEdgePx` Live macOS 27 / iOS 27 Simulator screenshot-এর সঙ্গে SSIM/pixel comparison দিয়ে যাচাই বাকি।
- iOS 27 Settings-এর নতুন Liquid Glass transparency slider ঠিক কত sigma ও opacity range বদলায় তা public DocC-তে সংখ্যা আকারে আসেনি (`Unknown` exact shader curve)।

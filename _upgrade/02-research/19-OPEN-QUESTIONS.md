# 19 — Consolidated Open Questions & Hardware Verification Backlog

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি কেবল সেইসব প্রশ্ন ও সংখ্যাগত ফাঁক তালিকাভুক্ত করে যা Windows পরিবেশে Apple DocC JSON, iOS/macOS 27 Sketch Kits ও ওয়েব অনুসন্ধান দিয়ে `Official` বা `Measured` করা যায়নি — ভবিষ্যতে macOS / Xcode 27 / iOS 27 Simulator-এ প্রজেক্ট বা প্লাগইন যাচাই করার সময় এই চেকলিস্ট ব্যবহার হবে।

---

## Priority Open Questions Requiring Apple Hardware / Xcode 27

1. **Liquid Glass iOS 27 Settings Slider Exact Parameters (`06-liquid-glass.md`, `18-ios27-macos27-delta.md`)** — `Inferred / Unknown`:
   - iOS 27 / macOS 27 Settings-এর continuous transparency slider `0%` থেকে `100%` পর্যন্ত ঠিক কোন Gaussian blur sigma, tint opacity ও specular rim highlight curve পরিবর্তন করে, তার exact SwiftUI/Shader parameter এখনো প্রকাশ পায়নি।
2. **Exact Display Corner Radius Conflict (`05-shape-geometry.md`)** — `Measured Conflict`:
   - `tokens/shape.json`-এ আছে `iPhone17Pro: 55pt` এবং `iPadPro: 30pt`, অথচ কমিউনিটি `ScreenCorners` পরিমাপ বলে `iPhone 16 Pro / 17 Pro: 62pt` এবং `iPad Pro M4/M5: 18pt`। বাস্তব ডিভাইস বা Xcode Simulator-এ `UIScreen._displayCornerRadius` যাচাই প্রয়োজন।
3. **iPhone Safe Area Top Differentiation (`04-layout-spacing.md`)** — `Measured Conflict`:
   - `iPhone 15 / 16` = `59pt` বনাম `iPhone 16 Pro / 17 / 17 Pro` = `62pt`; পাশাপাশি `iPhone Air`-এর শীর্ষ safe area inset `62pt` না `68pt` তা যাচাই বাকি।
4. **macOS 27 Uniform Window Corner Radius (`05-shape-geometry.md`, `09-components-macos.md`)** — `Estimated`:
   - প্রেস রিপোর্ট অনুযায়ী macOS 27 সব অ্যাপের উইন্ডো কোণ প্রায় `12pt` একীভূত করেছে (Tahoe `16–26pt` এর বদলে); Apple HIG DocC সংখ্যাসূচক মান দেয় না — macOS 27 NSWindow Accessibility tree থেকে মাপা প্রয়োজন।
5. **macOS Sketch Kit vs HIG Typography Weight Discrepancies (`03-typography.md`)** — `Official vs Measured Conflict`:
   - macOS `Headline` Emphasized (HIG `800` vs Kit `900`), `Caption 1` Emphasized (HIG `500` vs Kit `600`), ও `Caption 2` Default (HIG `500` vs Kit `400`) — লাইভ macOS 27 TextStyle font descriptor ডাম্প করে কোনটি আসল রেন্ডারড ওয়েট তা যাচাই করা দরকার।
6. **iOS 27 & macOS 27 Individual Control Dimensions (`08-components-ios.md`, `09-components-macos.md`)** — `Estimated`:
   - Floating capsule tab bar (`62pt`, inset `20pt`), iOS 27 pill switch (`64×28pt`), floating medium sheet radius (`38pt`), alert width (`300pt`) / radius (`34pt`), macOS toolbar (`52pt`) এবং control sizes (`16/20/24/28/36pt`) — HIG এগুলো সংখ্যায় দেয় না; Simulator/Kit artboard inspect দিয়ে চূড়ান্ত যাচাই বাকি।
7. **Increased Contrast (`HC`) Hex Values & Missing macOS Dark Separator (`02-color.md`)** — `Inferred / Estimated`:
   - HIG Color JSON কেবল PNG swatch দেখায়, এবং `apple-macos-27-ui-kit.tokens.json`-এ Dark Separator অনুপস্থিত। Xcode 27 `UIColor`/`NSColor` resolved sRGB + Display P3 asset ডাম্প করলে `Measured` হয়ে যাবে।
8. **iOS Safari 26/27 Hidden `<input type="checkbox" switch>` Haptic & Electron `vibrancy` Support (`11`, `14`)** — `Platform-dependent / Unknown`:
   - Safari 26/27-এ `<input switch>` haptic trick এখনও কাজ করে কি না, এবং Electron-এর লেটেস্ট macOS build-এ `NSGlassEffectView` এসেছে কি না তা লাইভ macOS/iPhone ছাড়া পরীক্ষা করা সম্ভব নয়।
9. **Non-Latin Line Height & Optical Boost (`17-localization-rtl.md`)** — `Estimated`:
   - বাংলা (`Kohinoor Bangla`, `line-height: 1.35–1.5`, `+20–30%` width budget) ও CJK (`+1–2pt` minimum legibility boost) Safari/Chrome-এ visual baseline test করা প্রয়োজন।

# 01 — Apple Design Philosophy, Ergonomics & Liquid Glass Mental Model

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `skills/apple-design-core/SKILL.md` ও `references/foundations/*`-এর দর্শন ও সিদ্ধান্ত-নীতি নির্ধারণ করে; একটি অ্যাপকে কেবল Apple-রঙ দিয়ে না সাজিয়ে কীভাবে Clarity, Deference, Spatial Depth এবং Liquid Glass functional-vs-content স্তর দিয়ে চিন্তা করতে হবে, তার প্রামাণ্য ব্যাখ্যা এখানে।

---

## 1. Evolution: Classic HIG Pillars to Liquid Glass (2025–2026)

1. **Content-First Hierarchy (Clarity & Deference)**:
   - কন্ট্রোল ও নেভিগেশন কখনো কন্টেন্টের সাথে প্রতিযোগিতা করে না। iOS 26/27 এবং macOS 26/27-এ **Liquid Glass** কেবল উপরের *Functional Layer*-এ ভাসে, যাতে নিচের *Content Layer* পর্দাজুড়ে শ্বাস নিতে পারে ([Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass))।
2. **Dynamic Physicality & Restraint**:
   - "Avoid overusing Liquid Glass effects": বেশি glass ব্যবহার করলে পুরো UI ধোঁয়াটে ও বিশৃঙ্খল হয়; প্রতি ভিউতে মূল অ্যাকশনে (`1–2` prominent/tinted CTA) গুরুত্ব দিন ([Buttons HIG](https://developer.apple.com/design/human-interface-guidelines/buttons))।
3. **Hardware-Driven Concentricity**:
   - সফটওয়্যার শেপ হার্ডওয়্যারের বক্রতা অনুসরণ করে: iPhone-এর গোলাকার কোণ -> floating capsule tab bar -> medium sheet (`inset 8pt`) -> ভেতরের card। সব nested কোণ `inner = outer - padding` মেনে চলে।
4. **Platform Ergonomics & Oct 2026 Mac Touch Update**:
   - **iOS**: এক হাতের thumb reach, নিচের দিকে tab bar ও floating search, direct 1:1 gesture।
   - **iPadOS**: মাল্টিটাস্কিংয়ে continuous fluid window resizing, `.sidebarAdaptable` ও keyboard+pointer সমন্বয়।
   - **macOS (`Oct 28, 2026` HIG)**: কীবোর্ড + পয়েন্টার প্রাথমিক, তবে touch display / Sidecar-এর জন্য **"Keep layout and size stable; expand targets cleanly on touch"** নিয়ম যুক্ত হয়েছে ([Gestures HIG](https://developer.apple.com/design/human-interface-guidelines/gestures))।

---

## 2. Core Philosophical Rules (Quantified Guardrails)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `philosophy.layerSeparation` | Functional Layer (Glass) strictly above Content Layer | architecture | All Apple `26–27` | Both | https://developer.apple.com/design/human-interface-guidelines/materials | Official | high | Never apply Liquid Glass onto cards or table rows |
| `philosophy.prominentCtaCap` | `1–2` per view | CTA count | All | Both | https://developer.apple.com/design/human-interface-guidelines/buttons | Official | high | Preserve visual hierarchy; destructive CTA never gets primary prominence |
| `philosophy.autoDismissAvoidance` | Avoid time-boxed critical UI dismissal | cognitive rule | All | Both | https://developer.apple.com/design/human-interface-guidelines/accessibility | Official | high | Supports VoiceOver, low-vision & cognitive comprehension |
| `philosophy.macTouchStability` | Preserve control positions when supporting touch on Mac | ergonomics | macOS `27` (`Oct 2026`) | Both | https://developer.apple.com/design/human-interface-guidelines/designing-for-macos | Official | high | Never switch desktop layout geometry based solely on touch event |
| `philosophy.borderRestraint` | Separation via spacing/material, not gray 1px borders | styling rule | iOS / macOS | Both | `tokens/shape.json` | Inferred | high | Differentiates Apple cards from generic boxed CSS UIs |

---

## 3. Gaps & Open Questions
- মনস্তাত্ত্বিক ও ডিজাইন-দর্শন সংক্রান্ত নিয়মগুলো স্বভাবতই গুণগত (`qualitative`); কোয়ান্টিটেটিভ সীমা (`1–2` CTA, `44pt` target, `<= 6` backdrop caps) সংশ্লিষ্ট ডোমেইন ফাইলে সংযুক্ত আছে।

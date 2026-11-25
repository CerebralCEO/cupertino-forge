---
name: apple-design-core
description: Apple iOS 27 and macOS 27 design system (Liquid Glass era) for building any UI that must look and feel exactly like Apple made it, in Flutter, Next.js with shadcn, or Tauri 2 with Rust. Use for ANY UI, screen, component, layout, theme, animation, or styling work in a project that has .apple-design.json, and whenever the user asks for Apple style, iOS look, macOS look, Cupertino, Liquid Glass, premium Apple-like UI, or says অ্যাপলের মতো ডিজাইন, iOS স্টাইল, macOS স্টাইল, প্রিমিয়াম ডিজাইন. Load before writing a single line of UI code.
---

# Apple Design Core (cupertino-forge)

You are acting as a senior Apple Human Interface designer and engineer. The output must be indistinguishable from an Apple first party app on iOS 27 or macOS 27. Every value comes from this plugin's tokens. You do not improvise design values.

## 0. The contract (do these steps in order, every time, no skipping)

1. **Read the project config.** Open `.apple-design.json` at the project root. If it is missing, run the `/apple-init` command flow first (ask platform, then create it). Fields: `platform` (web | flutter | tauri), `style` (ios | macos | adaptive), `accent`, `glassIntensity`, `sounds` (bool), `appearance` (system | light | dark).
2. **Load the platform adapter skill.** web → `apple-web`. flutter → `apple-flutter`. tauri → `apple-tauri` (which also uses `apple-web` for the frontend). Read its SKILL.md fully before coding.
3. **Read the references for the task** using the router table in section 2. Read only what the task needs, but ALWAYS read `references/anti-patterns.md` once per session.
4. **Use the generated tokens and primitives.** Never type a hex color, px radius, shadow, font size, duration or easing into app code. Use the generated variables or classes. If a value you need does not exist, add it to the plugin tokens file, rebuild, then use it.
5. **Build with the primitives** the adapter ships (Glass, Button, List, Sheet, Toggle and so on). Compose; do not restyle shadcn, Material or default widgets from scratch.
6. **Verify before you say done.** Run the Definition of Done checklist (section 6) and print the Compliance Report (section 7). If anything fails, fix it first. The lint hook will block you anyway.

If a rule here conflicts with a user request, follow the user but say in one line which Apple rule you broke and why.

## 1. Mental model in five lines

- Two layers: **content** (your data, opaque, calm) and **functional** (controls and navigation floating above it in Liquid Glass).
- Hierarchy comes from **typography weight, background level, and spacing**, not from borders, boxes, or color.
- Everything is **continuous curves** (squircle corners, concentric radii, capsules) and **spring motion**.
- Color is **semantic and scarce**: one accent, used on the single primary action and selection. Labels on glass are monochrome.
- Every interaction has **immediate press feedback**, a spring settle, and the right haptic, and nothing makes the user wait for an animation.

## 2. Router: what to read for what task

| Task | Read |
|---|---|
| Any new screen | foundations/00-principles.md, foundations/01-layout.md, patterns/screens.md |
| Text, headings, numbers | foundations/02-typography.md |
| Colors, theming, dark mode | foundations/03-color.md, foundations/13-dark-mode.md |
| Bars, floating controls, translucency | foundations/04-liquid-glass.md |
| Corners, cards, nesting | foundations/05-shape.md |
| Shadows, layering | foundations/06-elevation.md |
| Icons | foundations/07-iconography.md and tokens/icons.json |
| Animation, transitions, gestures | foundations/08-motion.md |
| Hover, pressed, focus, disabled | foundations/09-interaction-states.md |
| Haptics, sounds | foundations/10-haptics-sound.md and tokens/feedback.json |
| Accessibility | foundations/11-accessibility.md |
| Copy, labels, alerts text | foundations/12-ux-writing.md |
| Fonts, SF licensing, non Apple OS | foundations/14-licensing-fallbacks.md |
| What changed in 27 | foundations/15-version-diff.md |
| Localization, RTL, Bangla/Arabic | foundations/16-localization-rtl.md |
| iOS style components | components-ios/navigation.md, controls.md, presentation.md, content.md |
| macOS style components | components-macos/window-chrome.md, navigation.md, controls.md, presentation.md, content.md |
| Empty, loading, error, onboarding, settings, forms, search, tips, Live Activities | patterns/screens.md, patterns/states.md, patterns/system-experiences.md |
| Specialized Apple framework UI (Wallet, HealthKit, App Clips, HomeKit, AR, iMessage, App Shortcuts, Tap to Pay, Brand-constrained buttons) | references/extras/ |

All paths are relative to this skill folder. Token JSON lives in the plugin root `tokens/` folder (`${CLAUDE_PLUGIN_ROOT}/tokens`).

## 3. Choosing iOS or macOS style

- `style: ios` → iOS rules everywhere (phone first; iPad rules at width 768 and up).
- `style: macos` → macOS rules everywhere (Mac app look even on Windows or Linux).
- `style: adaptive` → by available width and input: under 768 iOS; 768 to 1179 iPad (iOS rules plus sidebar); 1180 and up with a fine pointer → macOS rules. Decide by size class, never by user agent.
- Set `data-cf-platform="ios"` or `"macos"` on the root (web) or pick `AppleIOS*` vs `AppleMacOS*` tokens (Flutter). Never mix iOS metrics and macOS metrics on one screen.

## 4. Golden rules (each one is checked by the reviewer)

**Layout**
1. Use only the spacing scale (2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64). iOS screen margins 16 (20 on wide), macOS content padding 20.
2. Every tappable target is at least 44 by 44 on iOS and 28 by 28 on macOS even if the visible shape is smaller (extend the hit area).
3. Respect safe areas. Content scrolls under bars and under the home indicator; controls never sit inside the unsafe region.
4. Group with background levels: plain list on `bg`, grouped list sections on `bg-grouped` with `bg-grouped-2` cells. Do not draw boxes with borders.

**Typography**
5. Every text node uses one named text style (largeTitle, title1, title2, title3, headline, body, callout, subheadline, footnote, caption1, caption2). No other sizes. iOS body 17, macOS body 13.
6. Always apply the style's tracking and line height. Emphasis is the emphasized weight of the same style, not a bigger size.
7. Hierarchy: at most 3 type levels on one card or row. Secondary info uses label-2 color, not a smaller font.
8. Use tabular figures for changing numbers. Never use font weights below regular for UI text.

**Color**
9. Only semantic tokens: label, label-2..5, fill, bg, bg-grouped, separator, accent, system colors. Never raw hex, never Tailwind palette (gray-500, blue-600 and so on), never shadcn defaults (bg-primary, text-muted-foreground) unless they are remapped to cf tokens by the adapter.
10. One accent color per app. It appears on: the one prominent button per view, selection, links, toggles on, progress. Not on headings, icons in lists, or backgrounds.
11. Destructive is system red, only on the destructive action label or glass tint. Success green only for success status.
12. Every color works in light, dark, and increased contrast. Presented surfaces in dark mode use elevated backgrounds (`data-cf-elevated`).

**Material and shape**
13. Liquid Glass only for the functional layer: bars, floating buttons, tab bar, toolbar groups, menus, popovers, alerts, partial sheets, active slider and toggle knobs. Never on cards, rows, or page backgrounds. Never glass on glass.
14. Text on glass uses label-glass colors and stays monochrome. Tint glass only for the single primary action.
15. Every rounded rect uses continuous corners (squircle). Capsules for buttons, fields, segmented controls, toggles. Circles for icon-only buttons.
16. Nested shapes are concentric: inner radius = outer radius minus padding.
17. No visible borders around content on iOS. Hairline separators (0.5px) only between rows, inset to the text start. macOS fields keep the kit hairline border.

**Elevation**
18. Content layer has no shadows on iOS. Floating surfaces use the elevation tokens, which always include a hairline edge.

**Motion and feedback**
19. All movement uses spring tokens (smooth, snappy, bouncy, interactive, press, release, sheet, push, popover, glassMorph). Never ease, ease-in-out or linear for movement. Durations are never hand typed.
20. Every pressable element has a press state that starts on pointer down with zero delay: glass scales up and brightens, solid buttons dim and scale 0.97, plain text buttons drop to 35 percent opacity.
21. Animations are interruptible and never block input. Respect reduced motion (crossfade instead).
22. Haptics follow tokens/feedback.json. Sounds are off by default and only play when `.apple-design.json` has `sounds: true`.

**Behavior and content**
23. Use the platform's native navigation pattern: iOS tab bar plus push stacks plus sheets; macOS window with sidebar, toolbar, inspector, menus, keyboard shortcuts. Never a hamburger menu. Never a web style top navbar in an app.
24. Copy follows UX writing rules: title case for buttons and menu items, sentence case for descriptions, verbs on buttons, no exclamation marks, alert buttons never say Yes or No.
25. Every screen ships its empty, loading, and error states (patterns/states.md).

## 5. Things you must never produce (instant fail)

Gradients on buttons, drop shadows on cards in iOS lists, colored icon circles everywhere, uppercase tracking-wide labels, Material ripples, Material floating action buttons, hamburger menus, toast at the bottom in Material style, 1px gray borders around inputs on iOS, border-radius without squircle, more than one prominent button in a view, emoji as icons, center aligned body text, carousels with dots for primary content, web style footers inside apps, glassmorphism with heavy white borders, neon glows, skeuomorphic textures, Inter or Roboto on Apple devices (use system font there), SF font files bundled in the project. See references/anti-patterns.md for the full list with fixes.

## 6. Definition of Done (check every item, in your head and then in the report)

- [ ] `.apple-design.json` exists and the adapter skill was read.
- [ ] Generated tokens are imported; `grep` finds no raw hex, rgb(), px radius, ms duration or ease keyword in the files you touched (except generated token files and lines marked `cf-ignore`).
- [ ] Every text node maps to a named style; every color to a semantic token.
- [ ] Glass only in the functional layer; no glass on glass.
- [ ] All rounded rects squircle; nested radii concentric.
- [ ] Press, hover (pointer only), focus ring, disabled, selected states exist for every interactive element.
- [ ] Springs used for all motion; reduced motion handled.
- [ ] Light, dark, increased contrast and reduce transparency all checked.
- [ ] Hit targets meet 44 (iOS) or 28 (macOS).
- [ ] Empty, loading, error states exist.
- [ ] Copy follows the writing rules.
- [ ] Lint hook passes (`node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all`).
- [ ] For visual work: run the `apple-design-reviewer` agent or `/apple-audit` on the changed screens.

## 7. Compliance Report (print this at the end of every UI task)

Rule: NEVER report an unverified check as `OK`. Any step that could not run (e.g., visual screenshot capture, Playwright/Flutter runtime test) MUST state `NOT RUN (<reason>)`.

```
Apple Design Compliance
Platform: <web|flutter|tauri>   Style: <ios|macos|adaptive>
Screens/components touched: <list>
Tokens: OK | NOT RUN (<reason>) | <violations>
Typography: OK | NOT RUN (<reason>) | <issues>
Color and dark mode: OK | NOT RUN (<reason>) | <issues>
Glass and materials: OK | NOT RUN (<reason>) | <issues>
Shape and concentricity: OK | NOT RUN (<reason>) | <issues>
Motion and feedback: OK | NOT RUN (<reason>) | <issues>
States (press, hover, focus, disabled, empty, loading, error): OK | NOT RUN (<reason>) | <issues>
Accessibility: OK | NOT RUN (<reason>) | <issues>
Lint: PASS | FAIL (<count>) | NOT RUN (<reason>)
Visual capture / reviewer: PASS | FAIL (<issues>) | NOT RUN (<reason>)
Deviations from Apple rules (with reason): <none | list>
Values marked estimate that this work depends on: <list or none>
```

## 8. Values marked estimate

Some token values carry `"$source": "estimate"` because Apple's kit export does not include them (control heights, blur radius, some radii). Use them, but list them in the Compliance Report. If the user has access to the Apple UI kit Inspect panel, the `apple-spec-researcher` agent can verify and update them.

## 9. Updating for a new Apple release

Run `/apple-sync` after WWDC or a new kit release. It re-exports kit tokens, diffs them against tokens/*.json, updates foundations/15-version-diff.md, and rebuilds generated files.

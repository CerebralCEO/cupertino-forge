# 11 Accessibility

Apple quality means accessible by default. These are requirements, not extras.

## Settings every build must honor

| Setting | Web signal | Web Browser Matrix (`[official]`) | Flutter signal | Behavior |
|---|---|---|---|---|
| Dark mode | prefers-color-scheme | All modern browsers | MediaQuery.platformBrightness | dark tokens |
| Increase contrast | prefers-contrast: more | Chromium 96+, Safari 14.1+, Firefox 101+ | MediaQuery.highContrast | HC colors, opaque glass, borders on glass (`--cf-glass-shadow`) |
| Reduce transparency | prefers-reduced-transparency + `[data-transparency="reduce"]` | Chromium `118+` supported; **Safari unsupported** (`[official]` CanIUse -> mandatory in-app toggle) | App setting + OS accessibility | opaque glass (`glass`, `glass-clear`, `glass-large`, `glass-menu`) |
| Reduce motion | prefers-reduced-motion + `<MotionConfig reducedMotion="user">` | All modern browsers | MediaQuery.disableAnimations | crossfades (`200ms` `[inferred]`) instead of movement, bounce `0` |
| Larger text | `--cf-type-scale` + browser zoom | Target `>= 200%` enlargement (`140%` watchOS `[official]`) | MediaQuery.textScaler | reflow layouts, never clip |
| Bold text | app setting | Fallback CSS class | MediaQuery.boldText | step weights up one level |
| Button shapes (iOS) | app setting | Fallback CSS underline | n/a | underline plain text buttons |

## Contrast (`[official]` Apple HIG Accessibility & WCAG 2.2)

- Regular text `<= 17 pt` (all weights): **`>= 4.5:1`** (`[official]`)
- Large text **`>= 18 pt`** (all weights): **`>= 3.0:1`** (`[official]`)
- **Bold text** (all sizes): **`>= 3.0:1`** (`[official]`)
- Non-text UI controls, glyphs, focus rings: **`>= 3.0:1`** (`[official]`)
- Dark Mode small custom text goal: **`7.0:1`** (`[official]` HIG Dark Mode)
Use `scripts/contrast-check.mjs` (never exempt text over Liquid Glass — test worst-case background).

## Targets and spacing (`[official]`)

- iOS / iPadOS / watchOS: **`44 × 44 pt`** recommended, **`28 × 28 pt`** minimum (`[official]`).
- macOS: **`28 × 28 pt`** recommended, **`20 × 20 pt`** minimum (`[official]`).
- Target padding: **`~12 pt`** around bezeled controls, **`~24 pt`** around bezel-less controls (`[official]`).
- Avoid time-boxed auto-dismissal on notifications/alerts where cognitive or VoiceOver users need time to read (`[official]`). Support Assistive Access (`>= 2` confirmations on destructive actions `[official]`).

## Screen readers

- Every icon only button has a label (aria-label / Semantics label) using the verb ("Share", "Close").
- Decorative images are hidden from assistive tech.
- Group row content so a row reads as one element: "Wi-Fi, Home Network, button".
- Toggles expose role switch and state. Segmented controls expose tabs.
- Custom components expose the same roles and keyboard behavior as their native counterparts.

## Keyboard (web, desktop, iPad with keyboard)

- Full keyboard navigation with visible focus rings (focus-visible only).
- Standard shortcuts on macOS style: Cmd+N new, Cmd+W close, Cmd+F find, Cmd+, settings, Esc cancels sheets and menus, Return triggers the default button, Space toggles, arrow keys move in lists and menus, Tab and Shift+Tab move focus.
- On Windows map Cmd to Ctrl automatically.

## Motion and flashing

No flashing above 3 per second. Parallax and auto playing motion off under reduced motion.

## Language & RTL

Support right-to-left interfaces using logical properties (`padding-inline`, `margin-inline`, `EdgeInsetsDirectional`) and follow the 3-line paragraph rule, `+2pt` RTL/all-caps Latin balance, numeral digit-preservation, and non-Latin zero-tracking rules in `foundations/16-localization-rtl.md`.

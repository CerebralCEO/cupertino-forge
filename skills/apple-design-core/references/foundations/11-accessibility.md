# 11 Accessibility

Apple quality means accessible by default. These are requirements, not extras.

## Settings every build must honor

| Setting | Web signal | Flutter signal | Behavior |
|---|---|---|---|
| Dark mode | prefers-color-scheme | MediaQuery.platformBrightness | dark tokens |
| Increase contrast | prefers-contrast: more | MediaQuery.highContrast | HC colors, opaque glass, borders on glass |
| Reduce transparency | prefers-reduced-transparency | (iOS) accessibility features via channel; expose app setting | opaque glass |
| Reduce motion | prefers-reduced-motion | MediaQuery.disableAnimations | crossfades instead of movement |
| Larger text | --cf-type-scale from app setting; respect browser zoom | MediaQuery.textScaler | reflow layouts, never clip |
| Bold text | app setting | MediaQuery.boldText | step weights up one level |
| Button shapes (iOS) | app setting | n/a | underline plain text buttons |

## Contrast

Body text 4.5:1, large text (title3 and up) and glyphs 3:1, against the actual background including glass over the worst case content. Use `scripts/contrast-check.mjs`.

## Targets and spacing

44 by 44 iOS, 28 by 28 macOS minimum. Keep 8 points between adjacent targets.

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

## Language

Support right to left by using logical properties (margin-inline-start, Alignment.start). Mirror directional icons (chevrons, back arrows) in RTL.

# 00 Principles: how an Apple designer decides

Use this as a decision procedure, not as inspiration.

## The four questions, asked for every element

1. **Is this content or control?** Content sits in the content layer: opaque, calm, edge to edge, no glass (`[official]`). Controls float in the functional layer: Liquid Glass, grouped, minimal.
2. **What is the one thing the user came here to do?** That action gets the single prominent (tinted) button (`1–2` max per view `[official]`) or the primary position (top trailing on iOS navigation, Cancel leading / Done trailing on iOS single-view sheets `[official]`, bottom trailing in macOS dialogs). Everything else is secondary or goes in a menu.
3. **Can it be removed?** Apple screens feel premium because of what is missing. Remove decorative icons, borders, dividers between unrelated groups, helper text that repeats the label, and duplicate actions.
4. **Does it behave like the platform?** Same gestures, same positions, same words as Settings, Mail, Notes, Finder. On Macs with touch displays (`Oct 2026` HIG `[official]`), keyboard + pointer remain primary and layout/control positions MUST stay stable across touch and pointer input. Familiar beats clever.
5. **Avoid time-boxed auto-dismissal on critical UI (`[official]`).** Cognitive & VoiceOver accessibility requires explicit user actions rather than timed disappears.

## Hierarchy

- Hierarchy order of tools, use the first that works: **position** (top and leading are important), **weight** (emphasized weight), **size** (next text style), **color** (label to label-2), **background level** (grouped vs secondary). Never boxes, never color blocks, never icons for emphasis.
- A screen has one large title (iOS) or one window title (macOS). Section headers are headline (iOS) or subheadline emphasized secondary (macOS sidebar).
- Alignment is leading for text, controls trailing in rows. Center alignment only for empty states, onboarding hero, and alerts.

## Deference

- Content fills the screen; bars become transparent and blur only where content scrolls beneath them (scroll edge effect).
- Full bleed imagery extends under bars, sidebars and tab bars.
- No ornament: no textures, no gradients for decoration, no illustration unless it is the content.

## Consistency

- One component per job across the app (do not have two different looking toggles).
- Same spacing rhythm everywhere: 16 margins, 8 inside groups, 20 or 32 between groups.
- Same icon family, same weight logic, same corner logic.

## Depth

- Depth is communicated by material (glass over content), elevation tokens for floating surfaces, and motion (sheets slide over, menus grow from their source).
- In dark mode, depth is lighter surfaces for higher layers (elevated backgrounds), not darker shadows.

## Feedback

- Every touch gets instant visual response at pointer down.
- State changes animate with springs so the user sees cause and effect.
- Important outcomes get a haptic. Nothing gets a sound unless sounds are enabled.

## Premium checklist (what separates Apple from Apple-ish)

- Exact tracking on every text size.
- Squircle corners and concentric nesting.
- Hairline (0.5px) separators inset to the text start, never full width in grouped lists.
- Real spring physics with interruption.
- Correct dark mode elevated backgrounds.
- Icons aligned to text baseline and matched in weight.
- Generous but consistent whitespace; nothing touches the edges except full bleed media.
- Copy that is short, calm, and specific.

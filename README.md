# cupertino-forge

Apple iOS 27 and macOS 27 (Liquid Glass) design system as a Claude Code plugin. Any project, any stack (Next.js + shadcn, Flutter, Tauri 2), same Apple result.

## Install (Windows, macOS, Linux)

1. Unzip to a stable folder, for example `D:\Projects\cupertino-forge`.
2. In Claude Code:
   ```
   /plugin marketplace add D:\Projects\cupertino-forge
   /plugin install cupertino-forge@zerofounder-local
   ```
   Restart Claude Code when asked.
3. Requirements: Node 18+ (hooks and token builder). Optional: Python 3 with `playwright` for screenshots, `numpy` to re-render sounds.

## Use

```
/apple-init web ios            # or: flutter macos, tauri adaptive "#5B3DF5"
/apple-screen settings screen with account, notifications and appearance
/apple-component floating action toolbar for the photo editor
/apple-audit                   # score an existing app and get fixes
/apple-sync                    # after WWDC or a kit update
```

After `/apple-init`, just prompt normally ("build the onboarding flow"). The SessionStart and UserPromptSubmit hooks remind Claude to load the skills, the PostToolUse hook blocks off-spec code, and the Stop hook refuses to finish while violations remain.

## What is inside

| Path | Purpose |
|---|---|
| tokens/ | Single source of truth. Colors, materials, typography exported from Apple's iOS 27 and macOS 27 Sketch UI kits (Nov 2026) plus HIG tables. Values Apple does not publish are tagged `"$source": "estimate"`. |
| scripts/build-tokens.mjs | Generates CSS variables, Tailwind v4 theme, TypeScript constants (springs) and Dart constants. |
| skills/apple-design-core | The brain: contract, 25 golden rules, router, Definition of Done, Compliance report, 16 foundation docs, iOS and macOS component specs, screen and state patterns, anti-patterns. |
| skills/apple-web | Next.js, Tailwind v4, shadcn remap, motion. 16 primitives (Glass, Button, NavBar, TabBar, List, Toggle, Slider, Segmented, Sheet, Alert, Menu, Popover, macOS window shell, Table ...). Typechecked and render tested. |
| skills/apple-flutter | CfApp, SquircleBorder, CfGlass, springs, haptics (with Android native constants), sounds, widgets. |
| skills/apple-tauri | Native macOS glass and vibrancy, Windows Mica, traffic lights, standard menu bar. |
| skills/apple-design-audit | 15 layer scorecard and report. |
| commands/ | apple-init, apple-screen, apple-component, apple-audit, apple-sync. |
| agents/ | apple-design-reviewer (visual QA), apple-spec-researcher (keeps tokens current). |
| hooks/ | Lint enforcement (28 rules for web and Dart), session and prompt reminders, stop gate. |
| assets/sounds | Original synthesized UI sounds (no Apple audio). |

## Licensing notes

SF fonts, SF Symbols and Apple system sounds are not included and must not be bundled. On Apple devices the system font renders SF legally; elsewhere Inter is used with tracking compensation. Icons map to Lucide, Phosphor or CupertinoIcons.

## Verification status

- Web primitives: TypeScript strict typecheck passes; rendered in Chrome (iOS light, dark, alert; macOS window) during build.
- Lint and hooks: tested with violating and clean files (blocks with exit 2, passes clean code).
- Dart and Rust assets: written for Flutter 3.29+ and Tauri 2 with window-vibrancy 0.7.1 (API checked against crate source) but not compiled in the build environment. Run `flutter analyze` / `cargo check` once after install.

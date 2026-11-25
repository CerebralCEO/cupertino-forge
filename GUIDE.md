# cupertino-forge: Installation and User Guide

> **For Claude Code:** read this whole file before doing anything with the cupertino-forge plugin. It explains what the plugin is, where it lives on this machine, how it is installed, how every part works, and the exact procedures to follow. When this guide and a plugin file disagree, the plugin file wins (it is newer); when the plugin files are silent, follow this guide.

---

## 0. Quick facts

| Item | Value |
|---|---|
| Plugin name | `cupertino-forge` |
| Version | 1.0.0 |
| Owner | ZeroFounder (Rahat) |
| Location on disk | `D:\Claude-Plugins\cupertino-forge` |
| Local marketplace name | `zerofounder-local` |
| Install id | `cupertino-forge@zerofounder-local` |
| OS | Windows 11 (PowerShell), Node 18+ required |
| Design target | Apple iOS 27 and macOS 27 (Liquid Glass era, WWDC 2026) |
| Supported stacks | Next.js + Tailwind v4 + shadcn/ui (web), Flutter (Android, iOS, macOS, Windows, Linux), Tauri 2 + Rust (desktop) |
| Source of design values | Apple iOS 27 and macOS 27 UI kits (Sketch, Export Design Tokens, Nov 2026) + Apple HIG tables |

**Goal of the plugin:** whatever app is built (Flutter mobile app, Next.js web app, Tauri desktop app), its design, typography, color, buttons, materials, shadows, corner radius, hover and press states, animation, haptics and optional UI sounds must look and feel as if Apple's own designers made it, using the latest iOS 27 / macOS 27 style. The plugin does not just describe this; it **enforces** it with hooks.

---

## 1. How the plugin works (mental model)

The plugin has four layers. Understand all four before using it.

| Layer | What it is | Where |
|---|---|---|
| 1. Knowledge | Rules, specs and decisions an Apple designer uses | `skills/apple-design-core` (SKILL.md + references) |
| 2. Values | Every color, size, radius, shadow, spring and sound spec as data | `tokens/*.json` (single source of truth) |
| 3. Code | Ready made primitives per platform built from the values | `skills/apple-web`, `skills/apple-flutter`, `skills/apple-tauri` assets |
| 4. Enforcement and verification | Lint hook that blocks off spec code, stop gate, reviewer agent, audit | `hooks/`, `agents/`, `skills/apple-design-audit` |

Flow of a typical task:

```
User prompt (any UI request)
  -> UserPromptSubmit hook reminds Claude to load the skills
  -> Claude loads apple-design-core, then the platform adapter skill
  -> Claude builds with generated tokens + primitives
  -> every Write/Edit is linted by the PostToolUse hook (violations = blocked, exit 2)
  -> Stop hook refuses to finish while changed files still violate rules
  -> apple-design-reviewer agent checks screenshots (score must be 85+)
  -> Claude prints the Apple Design Compliance report
```

---

## 2. Folder map (what every file is for)

```
D:\Claude-Plugins\cupertino-forge
|   README.md                      short overview
|
+---.claude-plugin
|       plugin.json                plugin manifest (name, version, description)
|       marketplace.json           local marketplace "zerofounder-local" pointing to this folder
|
+---agents
|       apple-design-reviewer.md   visual QA agent: screenshots -> scored deviation list
|       apple-spec-researcher.md   keeps tokens current with new Apple kits and HIG
|
+---assets\sounds                  9 ORIGINAL synthesized UI sounds (no Apple audio)
|       tap, toggle-on, toggle-off, tick, success, error, send, refresh, keyboard (.wav)
|
+---commands                       slash commands
|       apple-init.md              install the system into a project
|       apple-screen.md            build a full screen
|       apple-redesign.md          convert an existing project/screen using redesign-playbook.md
|       apple-component.md         build or restyle one component
|       apple-audit.md             score an existing app and list fixes (--reference optional)
|       apple-doctor.md            verify plugin integrity and local toolchains
|       apple-sync.md              update tokens after WWDC or a kit update
|
+---hooks
|   |   hooks.json                 SessionStart, UserPromptSubmit, PostToolUse, Stop
|   \---scripts
|           lint.mjs               the design linter (28 rules) + all hook entry points
|
+---scripts
|       build-tokens.mjs           tokens -> CSS vars, Tailwind v4 theme, TS constants, Dart constants
|       capture.py                 screenshots at 390 and 1100 widths, light and dark
|       contrast-check.mjs         WCAG contrast for tokens or a brand accent
|       pixel-diff.mjs             compare a screenshot with an Apple kit reference
|       synth-sounds.py            re-render the original UI sounds
|
+---skills
|   +---apple-design-core          THE BRAIN (always load first)
|   |   |   SKILL.md               contract, router, 25 golden rules, Definition of Done, Compliance report
|   |   \---references
|   |       |   anti-patterns.md   instant fails and their fixes
|   |       +---foundations        00-principles .. 15-version-diff (16 files)
|   |       +---components-ios     navigation, controls, presentation, content
|   |       +---components-macos   window-chrome, navigation, controls, presentation, content
|   |       \---patterns           screens (recipes), states (empty, loading, error), system-experiences, redesign-playbook
|   +---apple-web                  Next.js adapter: SKILL.md, references/components-web.md, assets (16 components, 5 lib files, base CSS)
|   +---apple-flutter              Flutter adapter: SKILL.md, references/widgets-flutter.md, assets (13 Dart files, Android haptics Kotlin)
|   +---apple-tauri                Tauri adapter: SKILL.md, assets (tauri.conf snippet, Cargo snippet, apple_window.rs, apple_menu.rs, lib-snippet.rs)
|   \---apple-design-audit         audit skill + references/scorecard.md (15 layers)
|
+---templates
|       apple-design.json          template for the per project config .apple-design.json
|       CLAUDE.apple.md            block appended to a project's CLAUDE.md by /apple-init
|       AGENTS.apple.md            portable rule template for Google Antigravity (.agent/rules/) & cross-IDE AGENTS.md
|
\---tokens
        color.json                 system colors (light, dark, increased contrast), labels, fills, backgrounds, macOS control fills, focus ring
        typography.json            iOS Dynamic Type (all sizes xSmall..AX5), macOS styles, tracking tables, font stacks, Inter compensation
        materials.json             Liquid Glass recipes (kit raw + tuned CSS), standard materials, glass rules
        shape.json                 continuous corners, concentric rule, iOS and macOS radius tables
        layout.json                spacing scale, hit targets, iOS and macOS metrics, breakpoints, z-index
        elevation.json             shadow levels (from macOS kit windows, panels, menus, knobs)
        motion.json                springs (duration + bounce), transitions catalog, press, hover, scroll physics
        feedback.json              haptic map per event (iOS, Android, Flutter, web) and sound catalog
        icons.json                 SF Symbol -> Lucide / Phosphor / CupertinoIcons map, icon rules
        \---source
                apple-ios-27-ui-kit.tokens.json     raw export from Apple's iOS 27 Sketch kit (402 tokens)
                apple-macos-27-ui-kit.tokens.json   raw export from Apple's macOS 27 Sketch kit (676 tokens)
```

Notes:
- `tokens/source/` holds the untouched Apple kit exports. They are not read at runtime. `/apple-sync` uses them as the baseline to diff against future kit versions. Never edit them.
- `skills/apple-tauri/references/` may be an empty folder. It is unused and harmless.
- Values that Apple's kit export does not include (some control heights, blur radii, some corner radii) carry `"$source": "estimate"` inside the token files. They are used, but must be listed in the Compliance report.

---

## 3. Installation

### 3.1 Prerequisites

| Tool | Why | Check |
|---|---|---|
| Claude Code (latest) | runs the plugin | `claude --version` |
| Node.js 18+ | hooks, linter, token builder | `node -v` |
| Git | Stop hook uses `git status` to find changed files (falls back to full scan) | `git --version` |
| Python 3 + `pip install playwright` (optional) | screenshots for the reviewer agent | `python -c "import playwright"` |
| Chrome or Edge (optional) | used by capture.py | installed browser |
| numpy (optional) | only to re-render sounds | `python -c "import numpy"` |

### 3.2 Install steps

1. Make sure the folder exists exactly at `D:\Claude-Plugins\cupertino-forge` and contains `.claude-plugin\plugin.json`.
2. In Claude Code run:
   ```
   /plugin marketplace add D:\Claude-Plugins\cupertino-forge
   /plugin install cupertino-forge@zerofounder-local
   ```
3. Restart Claude Code.

### 3.3 Verify the install

- `/plugin` lists `cupertino-forge` as installed and enabled.
- Typing `/` shows: `apple-init`, `apple-screen`, `apple-component`, `apple-audit`, `apple-sync` (may appear as `cupertino-forge:apple-init` and so on).
- Skills available: `apple-design-core`, `apple-web`, `apple-flutter`, `apple-tauri`, `apple-design-audit`.
- Agents available: `apple-design-reviewer`, `apple-spec-researcher`.
- Linter runs:
  ```powershell
  node D:\Claude-Plugins\cupertino-forge\hooks\scripts\lint.mjs --all --root .
  ```
  It prints `cupertino-forge lint: X error(s), Y warning(s) in N file(s)`.

### 3.4 Important rules about the folder

- Do not move or rename `D:\Claude-Plugins\cupertino-forge` after installing. If it moves, run `/plugin marketplace remove zerofounder-local` and add it again from the new path.
- After editing any plugin file, run `/plugin` and reinstall or restart Claude Code so changes load.
- `${CLAUDE_PLUGIN_ROOT}` inside plugin files always resolves to the installed plugin folder. Use it in commands instead of hardcoded paths.

### 3.5 Using cupertino-forge in Google Antigravity (or other IDEs without Claude hooks)

Google Antigravity and other agentic IDEs do not run Claude Code's `CLAUDE_PLUGIN_ROOT` hooks automatically. Use the portable bridge template instead:

1. Copy `D:\Claude-Plugins\cupertino-forge\templates\AGENTS.apple.md` into your target project at either:
   - `.agent/rules/cupertino-forge.md` (Google Antigravity workspace rule), or
   - `AGENTS.md` at the project root.
2. Edit the `<PLUGIN_PATH>` line inside that copied file to match your local clone path (e.g., `D:\Claude-Plugins\cupertino-forge`).
3. Create `.apple-design.json` at the project root from `templates/apple-design.json`.
4. After each UI edit, run the manual verification scripts from the terminal (the agent is instructed to run these in `AGENTS.apple.md`):
   ```powershell
   node D:\Claude-Plugins\cupertino-forge\scripts\build-tokens.mjs --out src\styles\cupertino --targets css,tailwind,ts
   node D:\Claude-Plugins\cupertino-forge\hooks\scripts\lint.mjs --all --root .
   node D:\Claude-Plugins\cupertino-forge\scripts\contrast-check.mjs --accent "#0088FF"
   node D:\Claude-Plugins\cupertino-forge\qa\computed-style-audit.mjs --url http://127.0.0.1:3000 --platform ios
   ```

---

## 4. Setting up a project (`/apple-init`)

Run inside the project root:

```
/apple-init                         # auto detect stack, ask the rest
/apple-init web ios                 # Next.js app, iPhone style
/apple-init flutter adaptive        # Flutter, iOS on phones, macOS style on desktop widths
/apple-init tauri macos "#5B3DF5"   # Tauri desktop app with a brand accent
```

What it does, in order:

1. Detects the stack (`package.json` with next/react/vite = web, `pubspec.yaml` = flutter, `src-tauri/` = tauri).
2. Asks only missing choices: style, accent, sounds, Windows chrome (Tauri).
3. Writes `.apple-design.json` at the project root.
4. Checks a custom accent with `contrast-check.mjs` and proposes a passing shade if it fails.
5. Runs the adapter skill's setup (dependencies, token generation, copying primitives, root wrapper).
6. Copies sounds for Flutter and Tauri when sounds are enabled.
7. Appends the Apple rules block to the project's `CLAUDE.md`.
8. Runs typecheck or `flutter analyze` plus the linter.
9. Reports what was installed.

### 4.1 `.apple-design.json` (project config)

```json
{
  "platform": "web",
  "style": "adaptive",
  "accent": null,
  "appearance": "system",
  "glassIntensity": 0.5,
  "sounds": false,
  "haptics": true,
  "windowsChrome": "mac",
  "tokensOut": "src/styles/cupertino",
  "appleRelease": "iOS 27 / macOS 27"
}
```

| Field | Values | Meaning |
|---|---|---|
| platform | web, flutter, tauri | which adapter skill to load |
| style | ios, macos, adaptive | adaptive = iOS under 768pt, iPad 768 to 1179, macOS at 1180+ with a fine pointer |
| accent | null or hex | null = Apple system blue #0088FF; custom must pass 4.5:1 |
| appearance | system, light, dark | default follows the OS |
| glassIntensity | 0 to 1 | 0 clear, 1 tinted (mirrors iOS 27's Liquid Glass slider) |
| sounds | true, false | UI sounds, OFF by default |
| haptics | true, false | haptic feedback |
| windowsChrome | mac, native | Tauri on Windows: custom traffic lights or native caption buttons |
| tokensOut | path | where generated token files go |

**The presence of `.apple-design.json` is what activates all hooks.** Projects without it are never linted or blocked.

---

## 5. Daily usage

### 5.1 Commands

| Command | Use it when | Output |
|---|---|---|
| `/apple-init [stack] [style] [accent]` | first time in a project | config, tokens, primitives, CLAUDE.md block |
| `/apple-screen <description>` | building a whole screen | screen with all states + Compliance report |
| `/apple-redesign [path or 'whole project'] [style]` | converting an existing app/screen to Apple 27 | deconstruction plan, converted screens via `redesign-playbook.md`, QA checks + Compliance report |
| `/apple-component <description>` | one component (or restyling one) | component with all states, usage example |
| `/apple-audit [path or URL] [--reference <dir>]` | checking an existing app | `apple-audit-report.md` with Rule-Conformance (`0-100`), Fidelity (`N/A` without reference), and top fixes |
| `/apple-doctor` | checking plugin health & local toolchains | `PASS` / `NOT RUN` / `FAIL` summary |
| `/apple-sync` | after WWDC or a new Apple kit | token diff, updated tokens, rebuilt files |

After `/apple-init`, normal prompts work too ("build the onboarding flow", "make the settings page"). The hooks make Claude load the skills automatically.

### 5.2 Example prompts

```
/apple-screen settings screen with account row, notifications, appearance and sign out
/apple-screen macOS style file browser window with sidebar, table and inspector
/apple-component floating glass toolbar for a photo editor with undo, redo, share
/apple-audit
Build the paywall screen following patterns/screens.md
Make this dashboard look like Apple's Health app summary
```

### 5.3 What Claude must do on every UI task (the contract)

From `apple-design-core/SKILL.md` section 0:

1. Read `.apple-design.json` (run `/apple-init` if missing).
2. Load the adapter skill (`apple-web`, `apple-flutter`, or `apple-tauri` + `apple-web`).
3. Read the references the router table points to, and `anti-patterns.md` once per session.
4. Use only generated tokens. Never type raw hex, px radii, shadows, font sizes, durations or easing. Missing value = add it to plugin tokens, rebuild, then use it.
5. Build with the primitives; do not restyle shadcn, Material or default widgets from scratch.
6. Verify with the Definition of Done and print the Compliance report.

---

## 6. Enforcement: the hooks

All hooks run `hooks/scripts/lint.mjs` and only act when `.apple-design.json` exists in the project (searched upward from the file or working folder).

| Hook | When | Behavior |
|---|---|---|
| SessionStart | session opens | injects a reminder of the design contract with the project's platform, style, accent, sounds |
| UserPromptSubmit | each prompt that mentions UI words (ui, screen, page, button, sheet, theme, ডিজাইন, স্ক্রিন, বাটন ...) | injects the same reminder |
| PostToolUse (Write, Edit, MultiEdit) | after every file write | lints the file; **errors block with exit 2** and the violations are sent back to Claude to fix; warnings are added as context |
| Stop | Claude tries to finish | lints changed files (git status); remaining errors block finishing once; never loops |

### 6.1 Lint rules

Web (tsx, jsx, ts, js, css, scss, html, vue, svelte, astro), 18 rules:

| Rule | Severity | Catches |
|---|---|---|
| raw-hex | error | `#007AFF`, `#fff` in app code |
| raw-color-fn | error | `rgb(`, `rgba(`, `hsl(`, `oklch(` literals |
| tw-palette | error | `text-gray-500`, `bg-blue-600`, slate, zinc ... |
| shadcn-default | warn | `bg-primary`, `text-muted-foreground` ... (remapped, but prefer cf names) |
| tw-rounded | error | `rounded-md`, `rounded-lg`, `rounded-[12px]` without `squircle` |
| css-radius | error | `border-radius: 12px` without `corner-shape` |
| tw-shadow | error | `shadow-sm` .. `shadow-2xl` |
| css-shadow | error | hand written `box-shadow` values |
| easing | error | `ease-in-out`, `linear`, `cubic-bezier(`, motion `ease: "easeInOut"` |
| tw-text-size | error | `text-sm`, `text-lg`, `text-[14px]` |
| css-font-size | error | `font-size: 14px` |
| font-family | error | literal Roboto, Arial, Helvetica, Inter, Poppins ... |
| thin-weight | error | `font-light`, `font-thin`, weight 100 to 300 |
| gradient-bg | warn | decorative gradients |
| hamburger | error | hamburger menu icons |
| glass-border | error | Dribbble glass `1px solid rgba(255,255,255,...)` |
| raw-backdrop | error | hand rolled `backdrop-filter` / `backdrop-blur` |
| emoji-icon | warn | emoji used as icons |

Dart, 10 rules:

| Rule | Severity | Catches |
|---|---|---|
| material-import | error | `package:flutter/material.dart` |
| material-widget | error | Scaffold, AppBar, ElevatedButton, InkWell, ListTile, Card, SnackBar, MaterialApp, Material Switch/Slider ... |
| material-colors | error | `Colors.blue` |
| raw-color | error | `Color(0xFF...)`, `Color.fromARGB` |
| curves | error | `Curves.easeInOut`, `Curves.linear` ... |
| border-radius | warn | `BorderRadius.circular`, `RoundedRectangleBorder` |
| font-size | error | `fontSize: 14` |
| text-style-literal | warn | `TextStyle(` |
| box-shadow | warn | literal `BoxShadow(` |
| ripple | error | splash / highlight ripple settings |

Excluded from linting (vetted or generated): `components/apple/`, `lib/cupertino/`, `styles/cupertino/`, `lib/apple_ui/`, `cupertino.tokens.*`, `cupertino.theme.css`, `cupertino.base.css`, `apple_tokens.dart`, tests, stories, `node_modules`, build folders.

### 6.2 Exceptions

Add the comment `cf-ignore` on a line to skip it. Use only for justified cases (for example Apple's fixed traffic light colors) and list every exception in the Compliance report under "Deviations".

### 6.3 Running the linter manually

```powershell
node D:\Claude-Plugins\cupertino-forge\hooks\scripts\lint.mjs --all --root .
node D:\Claude-Plugins\cupertino-forge\hooks\scripts\lint.mjs src\app\page.tsx
node D:\Claude-Plugins\cupertino-forge\hooks\scripts\lint.mjs --all --json > lint.json
```

Exit code 1 means errors exist.

---

## 7. Tokens and the build pipeline

`tokens/*.json` is the single source of truth. Code never contains raw values; it uses generated files.

```powershell
# web (CSS variables + Tailwind v4 theme + TypeScript constants)
node D:\Claude-Plugins\cupertino-forge\scripts\build-tokens.mjs --out src\styles\cupertino --targets css,tailwind,ts --accent "#0088FF"

# flutter (Dart constants)
node D:\Claude-Plugins\cupertino-forge\scripts\build-tokens.mjs --out lib\apple_ui\theme --targets dart
```

Generated files (never edit by hand):

| File | Contents |
|---|---|
| `cupertino.tokens.css` | `--cf-*` variables for light, dark, dark elevated (`data-cf-elevated`), increased contrast, reduce transparency, reduce motion, iOS vs macOS semantics (`data-cf-platform`) |
| `cupertino.theme.css` | Tailwind v4 `@theme` mapping: `text-label`, `bg-bg-grouped`, `text-body`, `rounded-card`, `shadow-popover`, `ease-snappy`, plus utilities `squircle`, `glass`, `glass-large`, `glass-clear`, `glass-menu`, `focus-ring`, `emphasized`, `tabular`, `hairline-b`, `hairline-t` |
| `cupertino.tokens.ts` | `cf` object, `springs`, `spring('snappy')` helper for motion |
| `apple_tokens.dart` | `AppleSystemColors`, `AppleIOSColors`, `AppleMacOSColors`, `AppleSprings`, `AppleTypeIOS`, `AppleTypeMacOS`, `AppleSpacing`, `AppleRadiusIOS`, `AppleRadiusMacOS`, `AppleLayout` |

Springs are converted from Apple's duration + bounce model (stiffness = (2π/d)², damping = 4π(1−b)/d). For CSS only transitions, each spring is sampled into a `linear()` easing curve (`--cf-ease-<name>`, `--cf-dur-<name>`).

To change a value: edit the token JSON in the plugin, rebuild in the project, never patch generated files.

---

## 8. Platform adapters

### 8.1 Web: Next.js + Tailwind v4 + shadcn (`apple-web`)

Setup (done by `/apple-init`):

1. `npm i motion @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-context-menu @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-tooltip @radix-ui/react-toggle-group clsx tailwind-merge lucide-react @phosphor-icons/react @fontsource-variable/inter`
2. Build tokens into `src/styles/cupertino`.
3. Copy `assets/lib/*` to `src/lib/cupertino/`, `assets/components/apple/*` to `src/components/apple/`, `assets/styles/cupertino.base.css` to `src/styles/cupertino/`.
4. `app/globals.css`:
   ```css
   @import "tailwindcss";
   @import "@fontsource-variable/inter";
   @import "../styles/cupertino/cupertino.tokens.css";
   @import "../styles/cupertino/cupertino.theme.css";
   @import "../styles/cupertino/cupertino.base.css";
   ```
5. Wrap the app in `<CupertinoRoot style="..." appearance="system" glassIntensity={0.5} sounds={false}>`. Add `viewport-fit=cover` to the viewport meta.

Primitives (`src/components/apple`):

| File | Exports |
|---|---|
| root.tsx | CupertinoRoot, useCupertino |
| glass.tsx | Glass, GlassGroup, ScrollEdge |
| squircle.tsx | Squircle |
| icon.tsx | Icon |
| button.tsx | Button (prominentGlass, glass, filled, tinted, gray, plain, destructive, destructiveFilled; mini..xl), IconButton |
| nav.tsx | NavBar, LargeTitle, BarButton, BarButtonGroup, Toolbar, ToolbarGroup |
| tab-bar.tsx | TabBar (floating glass, minimizes on scroll, optional search button) |
| list.tsx | List, ListSection, ListRow, SettingsIcon |
| controls.tsx | Toggle, Slider, SegmentedControl, Stepper |
| fields.tsx | TextField, SearchField |
| sheet.tsx | Sheet (medium and large detents, drag to dismiss) |
| alert.tsx | Alert, ConfirmationDialog |
| menu.tsx | Menu, MenuItem, MenuSection, SubMenu, ContextMenu |
| popover.tsx | Popover, Tooltip |
| feedback.tsx | ActivityIndicator, useDelayedFlag, ProgressBar, Hud, EmptyState |
| mac.tsx | MacWindow, TrafficLights, MacToolbarTitle, MacToolbarSpacer, MacToolbarGroup, MacToolbarItem, MacSidebarSection, MacSidebarRow, MacButton, Checkbox, RadioGroup, MacTextField, MacTable |

Libs (`src/lib/cupertino`): `cn.ts`, `haptics.ts` (Android vibrate, iOS Safari 18+ switch trick, desktop no-op), `sounds.ts` (Web Audio synthesized, off by default), `squircle.ts` (path generator for browsers without `corner-shape`), `platform.ts`.

Full props and examples: `skills/apple-web/references/components-web.md`.

Verified: strict TypeScript typecheck passes; rendered in Chrome (iOS light, dark, alert, macOS window).

### 8.2 Flutter (`apple-flutter`)

Setup:

1. Build tokens to `lib/apple_ui/theme/apple_tokens.dart`.
2. Copy `assets/lib/apple_ui/` into the project's `lib/apple_ui/`.
3. pubspec: `cupertino_icons`, `audioplayers` (only if sounds), Inter font for Android, Windows, Linux (download from the rsms/inter GitHub release). Never add SF fonts.
4. App root: `CfApp(...)` instead of `MaterialApp`.
5. Android haptics: copy `assets/android/AppleHapticsPlugin.kt` to `android/app/src/main/kotlin/<package>/` and register in `MainActivity` (instructions in the file header).
6. Run `flutter analyze` and fix API drift.

Widgets: `CfApp`, `CfScope`, `context.cf` (colors and `context.cf.type` text styles), `CfElevated`, `SquircleBorder`, `CfSquircle`, `CfGlass`, `CfScrollEdge`, `animateSpring`, `CfPageRoute`, `CfScrollPhysics`, `CfPressable`, `CfHaptics`, `CfSounds`, `CfButton`, `CfIconButton`, `CfLargeTitleScaffold`, `CfBarButtonGroup`, `CfTabBar`, `CfList`, `CfListSection`, `CfListRow`, `CfSettingsIcon`, `CfToggle`, `CfSegmented`, `showCfSheet`, `showCfAlert`.

Examples: `skills/apple-flutter/references/widgets-flutter.md`.

Status: written for Flutter 3.29+ (uses `CupertinoSheetRoute`, `Color.withValues`), **not compiled during plugin build**. The first `flutter analyze` may need small API fixes. Keep visual values unchanged when fixing.

### 8.3 Tauri 2 + Rust (`apple-tauri`)

Frontend = web adapter (do section 8.1 too). Native shell:

1. Merge `assets/Cargo-snippet.toml` (tauri with `macos-private-api`, `window-vibrancy = "0.7"`, `tauri-plugin-window-state`).
2. Merge `assets/tauri.conf.snippet.json` (transparent window, Overlay titlebar, hidden title, traffic lights at x 16 y 26, `macOSPrivateApi: true`).
3. Copy `apple_window.rs` and `apple_menu.rs` into `src-tauri/src/`, wire them as in `lib-snippet.rs`.
4. Frontend: `<MacWindow customChrome={!isMac} active={focused}>`.

| OS | Result |
|---|---|
| macOS 26+ | native traffic lights, Liquid Glass window material (`apply_liquid_glass`), uniform radius |
| macOS 13 to 15 | sidebar vibrancy fallback |
| Windows 11 | Mica background; custom macOS traffic lights if `windowsChrome: "mac"` |
| Linux | decorations off when `windowsChrome: "mac"` |

`apple_menu.rs` builds the standard menu bar (App, File, Edit, View, Window, Help) and forwards clicks to the frontend as a `menu` event.

Status: `window-vibrancy` 0.7.1 API verified against the crate source; Rust not compiled during plugin build. Run `cargo check` first.

---

## 9. The design rules in short (from apple-design-core)

Full detail lives in the skill. These are the non negotiables:

1. Content layer is calm and opaque; controls float above it in Liquid Glass. Never glass on cards, rows or backgrounds. Never glass on glass.
2. Every text node uses a named style (largeTitle .. caption2) with Apple tracking. iOS body 17, macOS body 13.
3. Only semantic colors. One accent (system blue #0088FF by default). Labels on glass are monochrome.
4. Squircle (continuous) corners everywhere; concentric nesting (inner radius = outer minus padding); capsules for buttons, fields, toggles.
5. Spacing only from the 4pt scale; margins 16 (iOS) and 20 (macOS); hit targets 44 (iOS) and 28 (macOS).
6. No shadows on iOS content; elevation tokens only on floating things.
7. All motion is springs; instant press feedback; interruptible; reduced motion respected.
8. Haptics per `feedback.json`; no buzz on every button; sounds off unless enabled.
9. Native navigation: tab bar + push + sheets on iOS; sidebar + toolbar + menu bar on macOS. Never hamburger menus.
10. Every screen ships empty, loading and error states.
11. Light, dark, increased contrast and reduce transparency all work.
12. Copy: title case buttons, verbs, no Yes/No alerts, no exclamation marks.

### 9.1 Definition of Done

- `.apple-design.json` exists, adapter skill read.
- Generated tokens imported; no raw values in touched files (except `cf-ignore` lines).
- Named text styles and semantic colors only.
- Glass only in the functional layer.
- Squircle and concentric shapes.
- Press, hover (pointer only), focus ring, disabled, selected states.
- Springs and reduced motion.
- Light, dark, increased contrast, reduce transparency checked.
- Hit targets met.
- Empty, loading, error states.
- Copy rules followed.
- Lint passes.
- Reviewer agent run for visual work.

### 9.2 Compliance report (must be printed at the end of every UI task)

```
Apple Design Compliance
Platform: <web|flutter|tauri>   Style: <ios|macos|adaptive>
Screens/components touched: <list>
Tokens: OK | <violations>
Typography: OK | <issues>
Color and dark mode: OK | <issues>
Glass and materials: OK | <issues>
Shape and concentricity: OK | <issues>
Motion and feedback: OK | <issues>
States (press, hover, focus, disabled, empty, loading, error): OK | <issues>
Accessibility: OK | <issues>
Lint: PASS | FAIL (<count>)
Deviations from Apple rules (with reason): <none | list>
Values marked estimate that this work depends on: <list or none>
```

---

## 10. Verification tools

### 10.1 Reviewer agent

Use after building or changing UI:

```
Use the apple-design-reviewer agent on http://localhost:3000/settings (style ios, screens: Settings)
```

It captures screenshots (390 and 1100 widths, light and dark) with `scripts/capture.py`, checks 10 areas (structure, typography, color, material, shape, spacing, icons, states, motion, copy), and returns a score. **Under 85 = not done.**

### 10.2 Screenshots manually

```powershell
python D:\Claude-Plugins\cupertino-forge\scripts\capture.py --url http://localhost:3000 --out .cf-review --widths 390,1100 --themes light,dark
```

### 10.3 Pixel diff against an Apple kit reference

```powershell
node D:\Claude-Plugins\cupertino-forge\scripts\pixel-diff.mjs ours.png apple-ref.png --out diff.png
```

Prints mismatch percent; exit 2 above 5 percent. Installs `pixelmatch` and `pngjs` on first run.

### 10.4 Contrast

```powershell
node D:\Claude-Plugins\cupertino-forge\scripts\contrast-check.mjs --accent "#5B3DF5"
```

Text needs 4.5:1, glyphs 3:1, in light and dark.

### 10.5 Audit

`/apple-audit` writes `apple-audit-report.md` with 15 layer scores, verdict (90+ Apple grade, 75 to 89 Close, 50 to 74 Apple-ish, under 50 Not Apple), top 10 fixes and missing states.

---

## 11. Keeping it current (`/apple-sync`)

Run after each WWDC or Apple kit update:

1. The `apple-spec-researcher` agent finds the newest kits on developer.apple.com/design/resources, exports tokens from the Sketch kits (Export Design Tokens: Color Variables, Layer Styles, Text Styles, DTCG format), reads HIG `.md` pages (append `.md` to any HIG URL), and diffs against `tokens/*.json` using `tokens/source/` as the old baseline.
2. You confirm the diff.
3. Tokens update; `estimate` values replaced where verified.
4. `foundations/15-version-diff.md` gets a dated entry.
5. Generated files rebuild in the project; lint and typecheck rerun.

Kit links used for iOS 27 / macOS 27:
- iOS 27 kit (Sketch): https://www.sketch.com/s/04c24d8b-38fb-4afb-8836-36617e022f02
- macOS 27 kit (Sketch): https://www.sketch.com/s/57153a31-3379-4737-8ac6-dbfd6525f052

Save new raw exports into `tokens/source/` with the release in the filename (for example `apple-ios-28-ui-kit.tokens.json`) and keep the old ones.

---

## 12. Licensing rules (must follow)

- **SF Pro, SF Mono, New York fonts**: licensed only for Apple platform apps. Never bundle or load font files. On Apple devices call the system font (web `-apple-system, system-ui`; Flutter default Cupertino font on iOS and macOS). Elsewhere use Inter with the tracking compensation in `typography.json`.
- **SF Symbols**: Apple platforms only. Use the mapping in `tokens/icons.json` (Lucide, Phosphor, CupertinoIcons).
- **Apple system sounds**: never ship. Use the plugin's synthesized sounds.
- **Apple kits**: values are references; do not ship their artwork, device frames, wallpapers, logos or Apple app icons.
- Do not use Apple trademarks in user facing product names.

---

## 13. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Commands not visible | plugin not installed or not reloaded | `/plugin`, reinstall `cupertino-forge@zerofounder-local`, restart |
| `marketplace add` fails | wrong path or missing `.claude-plugin\marketplace.json` | check `D:\Claude-Plugins\cupertino-forge\.claude-plugin\` |
| Hooks do nothing | no `.apple-design.json` in the project | run `/apple-init` |
| Hook error "node not found" | Node not on PATH | install Node 18+, restart terminal and Claude Code |
| Every edit blocked | real violations | fix with tokens; read the message; `cf-ignore` only with a reason |
| Stop hook keeps blocking | errors in changed files | run the linter with `--all`, fix all errors |
| Tailwind classes like `text-body` do nothing | theme not imported or wrong order | import order in globals.css (section 8.1) |
| Glass looks flat in Firefox or Safari | lens refraction is Chromium only | expected; blur and rim still render |
| Corners look circular in Safari | `corner-shape` unsupported | use `Squircle` component (SVG clip fallback) |
| Fonts look wide on Windows | Inter instead of SF | expected; tracking compensation applied by `CupertinoRoot` |
| `flutter analyze` errors in apple_ui | Flutter API drift | fix API calls, keep values |
| `cargo check` errors | Tauri or window-vibrancy version drift | align versions with `Cargo-snippet.toml` |
| `capture.py` fails | Playwright or Chrome missing | `pip install playwright`, install Chrome |
| Sounds silent on web | sounds false, or no user gesture yet, or user setting off | set `sounds: true`; sounds start after first interaction |

---

## 14. Known limitations (be honest about these)

1. Some numbers are not published by Apple (control heights, some radii, blur radii, tab bar height, macOS 27 window radius). They are tagged `estimate` and listed in reports. Verify with the kit's Inspect panel or `/apple-sync`.
2. Sketch token export drops inner versus outer shadow flags and blend modes. `materials.json` keeps Apple's raw stacks for reference, and the code uses tuned recipes that reproduce the look.
3. True Liquid Glass refraction is GPU native on Apple OSes. Web gets SVG lens refraction in Chromium only; Flutter uses blur + saturation + rim light (native glass via platform views is optional on iOS 26+).
4. Highest platform parity is achieved on Apple platforms via native APIs (and real SF system fonts). On Web, Flutter, and Tauri (Windows, Android, Linux), `cupertino-forge` provides documented visual approximation (e.g., Inter with tracking compensation) paired with 100% Apple design psychology, spatial hierarchy, motion discipline, and UX.
5. Web, Flutter, and Tauri harnesses live in `tests/harness/{web,flutter,tauri}/` and can be verified locally whenever Node/Playwright, Flutter, and Rust `cargo` are installed (absent toolchains are reported as `NOT RUN` by `/apple-doctor`).
6. iOS Safari web haptics are limited to the switch trick (one pulse type).

---

## 15. Instructions for Claude Code when maintaining this plugin

- Edit `tokens/*.json` for values, never generated files. Keep `$source` tags accurate (`kit-ios27`, `kit-macos27`, `hig`, `estimate`).
- When adding a primitive: follow the component template (Anatomy, Metrics, States, Motion, Feedback, Accessibility, Do and Don't), add it to the adapter's catalog table and references doc, typecheck, and render test.
- When adding a lint rule: add it to `webRules` or `dartRules` in `lint.mjs`, test with one violating and one clean file, update section 6.1 of this guide and the count in README.
- Keep `SKILL.md` files short and directive; put detail in `references/`.
- After changes: `claude plugin validate D:\Claude-Plugins\cupertino-forge`, then reinstall the plugin.
- Bump `version` in `.claude-plugin/plugin.json` for every release and log it in `foundations/15-version-diff.md`.

---

## 16. One page cheat sheet

```
INSTALL     /plugin marketplace add D:\Claude-Plugins\cupertino-forge
            /plugin install cupertino-forge@zerofounder-local   (restart)
PROJECT     /apple-init [web|flutter|tauri] [ios|macos|adaptive] [accent]
BUILD       /apple-screen <screen>   /apple-component <component>
CHECK       /apple-audit   |   apple-design-reviewer agent   |   lint.mjs --all
UPDATE      /apple-sync
TOKENS      node scripts/build-tokens.mjs --out <dir> --targets css,tailwind,ts | dart
RULE #1     no raw values: tokens + primitives only
RULE #2     glass only for controls, never content, never stacked
RULE #3     squircle + concentric, springs only, one accent
DONE        lint PASS + reviewer 85+ + Compliance report printed
```

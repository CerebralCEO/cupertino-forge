---
name: apple-web
description: Web adapter for the Apple iOS 27 and macOS 27 design system. Next.js (App Router) plus Tailwind v4 plus shadcn/ui plus motion. Installs generated tokens, remaps shadcn to Apple semantics, and provides ready primitives (Glass, Button, NavBar, TabBar, List, Toggle, Sheet, Menu, macOS window shell and more). Use whenever apple-design-core routes to web, or the project is Next.js, React, Vite, or the frontend of a Tauri app.
---

# Apple Web Adapter (Next.js, Tailwind v4, shadcn, motion)

Read `apple-design-core` first. This skill tells you HOW to implement on the web.

## 1. Setup (run once per project, /apple-init does this)

1. Install deps:
   `npm i motion @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-context-menu @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-tooltip @radix-ui/react-toggle-group clsx tailwind-merge lucide-react @phosphor-icons/react`
   Fonts for non Apple devices: `npm i @fontsource-variable/inter`.
2. Generate tokens into the app:
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/build-tokens.mjs --out src/styles/cupertino --targets css,tailwind,ts --accent <accent from .apple-design.json>`
3. Copy primitives: everything in `${CLAUDE_PLUGIN_ROOT}/skills/apple-web/assets/` into the project:
   - `assets/lib/*` → `src/lib/cupertino/`
   - `assets/components/apple/*` → `src/components/apple/`
   - `assets/styles/cupertino.base.css` → `src/styles/cupertino/`
   Keep the folder names; imports inside assume `@/lib/cupertino/*` and `@/components/apple/*` and `@/styles/cupertino/*`.
4. Global CSS (app/globals.css), in this order:
   ```css
   @import "tailwindcss";
   @import "@fontsource-variable/inter";
   @import "../styles/cupertino/cupertino.tokens.css";
   @import "../styles/cupertino/cupertino.theme.css";
   @import "../styles/cupertino/cupertino.base.css";
   ```
5. Root layout: render `<CupertinoRoot style="ios|macos|adaptive">` from `@/components/apple/root` around the app. It sets `data-cf-platform`, theme, contrast and transparency attributes, injects the lens SVG filter, and provides haptics and sound settings.
6. shadcn: keep using shadcn's Radix based behavior, but the `cupertino.base.css` remaps every shadcn CSS variable (--background, --foreground, --primary, --muted, --border, --ring, --radius and the rest) onto cf tokens so shadcn components that you still use inherit Apple colors. Prefer the Apple primitives over shadcn's visual components (Button, Card, Switch, Tabs, Sheet, Dialog, DropdownMenu, Input).

## 2. How to write UI code

- Colors: Tailwind classes generated from tokens: `text-label`, `text-label-2`, `bg-bg`, `bg-bg-grouped`, `bg-bg-grouped-2`, `bg-fill-3`, `text-accent`, `bg-accent`, `text-red`, `border-separator`. Never Tailwind palette colors.
- Type: `text-body`, `text-headline`, `text-large-title`, `text-footnote` and so on (size, line height, tracking, weight in one class). Emphasis: add `emphasized` utility (weight 600) or use the style's emphasized weight via `[font-weight:var(--cf-text-body-weight-em)]`.
- Spacing: `p-lg` (16), `gap-sm` (8), `px-xl` (20) from tokens, or Tailwind numeric spacing that equals scale steps (p-4 = 16 is allowed, p-3.5 is not).
- Radius: `rounded-card squircle`, `rounded-alert squircle`, `rounded-capsule`. Never `rounded-md`.
- Shadows: `shadow-popover`, `shadow-knob`. Never `shadow-md`.
- Glass: `<Glass>` component or `glass` / `glass-large` / `glass-clear` / `glass-menu` utilities. Never write backdrop-filter yourself.
- Motion: import `spring` from `@/styles/cupertino/cupertino.tokens` and use `transition={spring('snappy')}` with `motion` components. CSS only transitions: `transition-transform duration-[var(--cf-dur-snappy)] ease-snappy`.
- Icons: lucide-react with `strokeWidth` from tokens/icons.json (1.75 regular); filled selected states with @phosphor-icons weight="fill". Use the `Icon` wrapper which picks size and stroke from the text style.
- Haptics: `haptic('selection')` from `@/lib/cupertino/haptics`. Sounds: `playSound('toggle')` (no-op unless sounds are enabled in config and user setting).

## 3. Primitive catalog (src/components/apple)

| File | Exports |
|---|---|
| root.tsx | CupertinoRoot, useCupertino |
| glass.tsx | Glass, GlassGroup, ScrollEdge |
| squircle.tsx | Squircle |
| icon.tsx | Icon |
| button.tsx | Button (variant: prominentGlass, glass, filled, tinted, gray, plain, destructive; size: mini, small, medium, large, xl), IconButton |
| nav.tsx | NavBar, LargeTitle, BarButton, BarButtonGroup, Toolbar, ToolbarGroup |
| tab-bar.tsx | TabBar, TabBarItem |
| list.tsx | List, ListSection, ListRow, SettingsIcon |
| controls.tsx | Toggle, Slider, SegmentedControl, Stepper |
| fields.tsx | TextField, SearchField |
| sheet.tsx | Sheet (detents medium, large) |
| alert.tsx | Alert, ConfirmationDialog |
| menu.tsx | Menu, MenuItem, MenuSection, ContextMenu |
| popover.tsx | Popover |
| feedback.tsx | ActivityIndicator, ProgressBar, Hud, EmptyState |
| mac.tsx | MacWindow, TrafficLights, MacToolbar, MacSidebar, MacSidebarSection, MacSidebarRow, MacButton, Checkbox, MacTextField, Tooltip, MacTable |

Read `references/components-web.md` for props and usage examples before using a primitive for the first time.

## 4. Web specific rules

1. `CupertinoRoot` must wrap the app. Never set `data-theme` or `data-cf-platform` manually elsewhere.
2. Use `100dvh` and `env(safe-area-inset-*)` for iOS web layouts; the NavBar and TabBar already pad for safe areas. Add `viewport-fit=cover` in the viewport meta.
3. Prevent web feel on iOS: `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, `user-select: none` on controls (base CSS does it), `overscroll-behavior` contained on scroll areas.
4. Hover styles only inside `@media (hover: hover) and (pointer: fine)` (the `hover:` variant in Tailwind v4 already does this).
5. Focus: `focus-visible:focus-ring` only.
6. Lens refraction (`<Glass lens>`) only on up to two hero elements per screen; Chromium only, automatic fallback elsewhere.
7. Server components may render layout; interactive primitives are client components (they include "use client").
8. Never import a CSS framework theme (DaisyUI, Material, Chakra). Never use shadcn `Card` for content cards (use `Squircle` with bg tokens).

## 5. Done check (web)

Run `node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all` from the project root. Start the dev server and run the `apple-design-reviewer` agent with the URL and the screen names.

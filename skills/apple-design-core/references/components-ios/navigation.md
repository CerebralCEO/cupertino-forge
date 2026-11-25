# iOS components: navigation

Template for every component: Anatomy, Metrics, States, Motion, Feedback, Accessibility, Do and Don't, Primitive (adapter component name), Verify. Metrics from `tokens/layout.json`; `[estimate]` values listed in the Compliance Report (`tokens/ESTIMATES.md`).

---

## Navigation bar

**Anatomy:** leading back button (glass circle with `chevron.left`, or glass capsule "Back title" on iPad), single semantic `<h1>` title (`LargeTitle` when `large=true`, inline title becomes `<span aria-hidden>` `[inferred]` so headings do not duplicate), trailing actions grouped in one glass capsule (max `3` icons `[estimate]`) or one prominent tinted circle for the primary action (`Done` uses checkmark on tinted glass `[official]`).
**Metrics:** bar `44` tall `[inferred]` below safe area top; buttons `44` diameter `[official]`; glyph `17` to `20` semibold `[estimate]`; `16` leading and trailing margins `[estimate]`; `8` between separate glass groups; large title `34` bold `[official]`, `52` extra height `[estimate]`, leading `16`, sits under the bar and collapses into the inline title on scroll.
**Background:** transparent. Content scrolls beneath; apply `.scrollEdgeEffectStyle(.soft | .hard | .automatic)` (`[official]`, top `64pt` soft blur and fade). No hairline, no solid fill.
**States:** buttons follow glass press (scale `1.1` touch / `1.02` pointer, release spring). Disabled `label-3`.
**Motion:** large title collapse is scroll driven (no spring), title crossfades into inline at threshold. Push transition per `tokens/motion.json` (100% incoming / 30% trailing dim outgoing `[inferred]`).
**Feedback:** none on taps.
**A11y:** single `<h1>` per screen; back button label is the previous title; actions have verb labels.
**Do:** keep actions to the top trailing group; use a menu (`ellipsis.circle`) for overflow.
**Don't:** colored bar backgrounds, centered logos, more than one tinted button, text buttons in bars except `Cancel` and `Done` on modal sheets.
**Primitive:** `NavBar`, `LargeTitle`, `BarButton`, `BarButtonGroup`.
**Verify:** Single `<h1>`, scroll edge blur present with zero hairline/solid bar bg, all bar buttons `>= 44×44pt`.

## Tab bar (iOS 26 and 27)

**Anatomy:** floating Liquid Glass capsule above the home indicator (`[official]`), `2` to `<= 5` visible tabs on iPhone (`[official]`; over 5 collapses into "More" or adapts via `.sidebarAdaptable` on iPad `[official]`), each icon over `caption2` label; selected tab renders an **inner glass capsule highlight** (`.cf-glass-capsule-active`, no nested `backdrop-filter`) and `accent` tinted icon + label (filled symbol). Mark search semantically via `Tab(role: .search)` / `UISearchTab` (`[official]`) for a standalone trailing circular glass search button.
**Metrics:** height about `62` `[estimate]`, side inset `20` `[estimate]`, icon `24` to `28` `[estimate]`, label `caption2` emphasized (`[official]`), item min width `56` `[estimate]`.
**Behavior:** `.tabBarMinimizeBehavior(.onScrollDown)` (`[official]`): shrinks on scroll down into a compact capsule showing the selected tab icon (`glassMorph` spring `[estimate]`), restores on scroll up or tap. Content scrolls under it. Do NOT wrap `<Glass lens>` in `motion.div layout` (avoids SVG displacement transform distortion).
**States:** pressed item scales inner capsule; selection slides inner capsule with `snappy` spring (`[official]`) or `150ms` crossfade under Reduce Motion (`[inferred]`).
**Feedback:** selection haptic on tab switch in web primitive (optional/off by default on iOS native).
**A11y:** `role="tablist"`, roving `tabIndex={active ? 0 : -1}`, RTL-aware `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard navigation (`[official]`), `aria-selected` announced.
**Do:** use for `3` to `5` top-level sections. Keep labels one word.
**Don't:** use for actions (no "plus" tab that opens a sheet unless dedicated create tab like Photos), hide labels, glue to the bottom edge, use more than `5`.
**Primitive:** `TabBar`, `TabBarItem`, `TabBarSearchButton`.
**Verify:** `<= 5` tabs, floating above safe-area bottom, inner glass capsule highlight (not `bg-fill-3`), RTL-aware arrow-key tab switching, no `layout` transform distortion on `<Glass lens>`.

## Toolbar (bottom)

**Anatomy:** glass capsule groups of actions floating above the home indicator, or at the bottom of a sheet. Leading group, flexible space, trailing group.
**Metrics:** `44` tall items `[official]`, `16` margins `[estimate]`.
**Do:** use in screens without a tab bar (document editors, Mail message view).
**Don't:** show both tab bar and bottom toolbar simultaneously.
**Primitive:** `Toolbar`, `ToolbarGroup`.
**Verify:** Only shown when `TabBar` is absent; interactive items meet `44pt` target.

## Search

**Anatomy:** capsule glass field with `magnifyingglass`, placeholder `"Search"`, clear button (`xmark.circle.fill`) while typing, `Cancel` appears trailing when focused. On iPhone the search field lives at the bottom (iOS 26+ `[official]`) or slides cleanly above the virtual keyboard when using `Tab(role: .search)`; on iPad at top trailing or in the sidebar.
**Metrics:** `44` tall (`36` inside nav bar) `[estimate]`, `16` horizontal padding `[estimate]`, `body` text (`[official]`).
**Behavior:** focusing expands the field with `glassMorph`; keyboard appears; results replace content with a crossfade. Scope bar (`segmented`) below when needed.
**Primitive:** `SearchField`.
**Verify:** `type="search"` + `role="searchbox"`, bottom/trailing glass placement on iOS, Cancel button appears when focused.

## Sidebar (iPad)

**Anatomy:** large glass panel on the leading edge with sections and rows (icon + label), selected row has a capsule highlight in `accent` or `fill`. Supports `.sidebarAdaptable` tab bars on iPadOS (`[official]`).
**Metrics:** `320` wide, rows `44`, icon `22` `[estimate]`.
**Primitive:** `Sidebar` (shared with macOS adapter in iPad mode).
**Verify:** Converts from/cooperates with `TabBar` at regular width (`>= 768pt`).

## Page navigation patterns

- Hierarchical: push stack with back button. Swipe from `20pt` leading edge to go back (`[estimate]`).
- Flat: tab bar (`<= 5` items `[official]`).
- Modal: sheets for self-contained tasks (compose, add item) with `Cancel` leading and `Done` or `Add` trailing (`[official]`).
- Never: hamburger, side drawers on iPhone, breadcrumbs, top tabs as primary navigation (segmented controls for filtering views only).
**Verify:** Zero hamburger menus or iPhone side drawers; top tabs never replace primary navigation.

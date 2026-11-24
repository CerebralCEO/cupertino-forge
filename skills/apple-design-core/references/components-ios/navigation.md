# iOS components: navigation

Template for every component: Anatomy, Metrics, States, Motion, Feedback, Accessibility, Do and Don't, Primitive (adapter component name). Metrics from tokens/layout.json; estimate values listed in the Compliance Report.

---

## Navigation bar

**Anatomy:** leading back button (glass circle with chevron.left, or glass capsule "Back title" on iPad), title (inline) or large title below the bar, trailing actions grouped in one glass capsule (max 3 icons) or one prominent tinted circle for the primary action (Done uses checkmark on tinted glass).
**Metrics:** bar 44 tall below safe area top; buttons 44 diameter; glyph 17 to 20 semibold; 16 leading and trailing margins; 8 between separate glass groups; large title 34 bold, 52 extra height, leading 16, sits under the bar and collapses into the inline title on scroll.
**Background:** transparent. Content scrolls beneath; apply the scroll edge effect (top 60pt soft blur and fade). No hairline, no solid fill.
**States:** buttons follow glass press (scale 1.1, release spring). Disabled label-3.
**Motion:** large title collapse is scroll driven (no spring), title crossfades into inline at threshold. Push transition per motion tokens.
**Feedback:** none on taps.
**A11y:** back button label is the previous title; actions have verb labels.
**Do:** keep actions to the top trailing group; use a menu (ellipsis.circle) for overflow.
**Don't:** colored bar backgrounds, centered logos, more than one tinted button, text buttons in bars except Cancel and Done on modal sheets.
**Primitive:** `NavBar`, `LargeTitle`, `BarButton`, `BarButtonGroup`.

## Tab bar (iOS 26 and 27)

**Anatomy:** floating Liquid Glass capsule above the home indicator, 2 to 5 tabs, each icon over caption2 label; selected tab shows an inner glass capsule highlight and accent tinted icon and label (filled symbol). Optional separate circular glass search button at trailing (search tab).
**Metrics:** height about 62 (estimate), side inset 20, icon 24 to 28, label caption2 emphasized, item min width 56.
**Behavior:** minimizes on scroll down into a compact capsule showing the selected tab icon (glassMorph spring), expands on scroll up or tap. Content scrolls under it.
**States:** pressed item scales the inner capsule 1.1; selection moves the inner capsule with snappy spring.
**Feedback:** selection haptic optional when switching tabs (Apple apps do not), none by default.
**A11y:** role tablist, selected state announced.
**Do:** use for 3 to 5 top level sections. Keep labels one word.
**Don't:** use for actions (no "plus" tab that opens a sheet unless it is a dedicated create tab like Photos), hide the labels, glue it to the bottom edge, use more than 5.
**Primitive:** `TabBar`, `TabBarItem`, `TabBarSearchButton`.

## Toolbar (bottom)

**Anatomy:** glass capsule groups of actions floating above the home indicator, or at the bottom of a sheet. Leading group, flexible space, trailing group.
**Metrics:** 44 tall items, 16 margins.
**Do:** use in screens without a tab bar (document editors, Mail message view).
**Don't:** show both tab bar and bottom toolbar.
**Primitive:** `Toolbar`, `ToolbarGroup`.

## Search

**Anatomy:** capsule glass field with magnifyingglass, placeholder "Search", clear button (xmark.circle.fill) while typing, Cancel appears trailing when focused. On iPhone the search field lives at the bottom (iOS 26 and later) or as a tab; on iPad at top trailing or in the sidebar.
**Metrics:** 44 tall (36 inside nav bar), 16 horizontal padding, body text.
**Behavior:** focusing expands the field with glassMorph; keyboard appears; results replace content with a crossfade. Scope bar (segmented) below when needed.
**Primitive:** `SearchField`.

## Sidebar (iPad)

**Anatomy:** large glass panel on the leading edge with sections and rows (icon plus label), selected row has a capsule highlight in accent or fill.
**Metrics:** 320 wide, rows 44, icon 22.
**Primitive:** `Sidebar` (shared with macOS adapter in iPad mode).

## Page navigation patterns

- Hierarchical: push stack with back button. Swipe from leading edge to go back.
- Flat: tab bar.
- Modal: sheets for self contained tasks (compose, add item) with Cancel leading and Done or Add trailing (tinted).
- Never: hamburger, side drawers on iPhone, breadcrumbs, top tabs as primary navigation (segmented controls for filtering views only).

# iOS components: presentation

---

## Sheet

**Anatomy:** grabber (36 by 5, fill), optional header row (Cancel leading plain, title headline centered, Done or Add trailing as tinted glass circle or prominent), content.
**Detents:** medium (about half, floats inset 8 from screen edges with glass and radius 38) and large (full height, top corners match device radius, background elevated). Custom detents allowed for small pickers.
**Background:** at medium: large glass recipe. At large: bg (elevated in dark) solid.
**Motion:** sheet spring; drag down to dismiss (velocity 600 or 40 percent); detent snaps give light haptic. Underlying content does not shrink (iOS 26+).
**Scrim:** scrim token at large detent; none at medium when the sheet does not block interaction (map style).
**Rules:** use sheets for self contained tasks. Confirm before discarding edits (action sheet "Discard Changes"). Never stack more than two sheets.
**Primitive:** `Sheet` with `detents` prop.

## Alert

**Anatomy:** title (headline), message (footnote), 1 to 3 buttons as glass capsules side by side (2) or stacked (3), preferred action tinted, destructive red.
**Metrics:** 300 wide, 20 padding, radius 34 (estimate), buttons 48 tall.
**Background:** large glass, scrim behind.
**Motion:** scale 1.08 to 1 and fade with popover spring.
**Rules:** only for important, blocking information or destructive confirmation. Never for success messages. Text fields in alerts only for short input (rename).
**Primitive:** `Alert`.

## Action sheet / confirmation dialog

**Anatomy:** on iPhone a glass panel near the source (iOS 26+ anchored to the source button as a popover style menu) with actions as rows, destructive in red, Cancel separate.
**Use:** choosing among actions related to a user initiated task, especially destructive confirmations.
**Primitive:** `ConfirmationDialog`.

## Menu (pull down)

**Anatomy:** glass panel growing from its source button, rows 44 tall with leading label and trailing icon (iOS menu rows put the icon trailing), separators between groups (8 gap with fill hairline), destructive red last.
**Metrics:** radius 26 (estimate), width 250, row padding 16.
**Motion:** grows from the button with glassMorph and popover spring; selection item highlight fill-4.
**Feedback:** none on open by tap; medium impact when opened by long press.
**Primitive:** `Menu`, `MenuItem`, `MenuSection`.

## Context menu

**Anatomy:** long press lifts the item (1.04), blurs the background, shows a preview above or below and the menu.
**Feedback:** impact medium on open.
**Primitive:** `ContextMenu`.

## Popover (iPad, and anchored panels on iPhone)

Glass large panel with arrow less rounded shape (radius 26), anchored to the source with 8 gap. On iPhone, compact popovers adapt to sheets unless small.
**Primitive:** `Popover`.

## Banner and inline feedback

Apple apps rarely use toasts. Prefer: inline state change in the control, a checkmark animation, a status line in the toolbar. For background events (copied, saved offline) use a small glass capsule HUD at the top center for 1.5 seconds with snappy spring, and no stacking.
**Primitive:** `Hud`.

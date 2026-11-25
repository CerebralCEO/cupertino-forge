# iOS components: presentation

---

## Sheet

**Anatomy:** grabber (`36 × 5`, `fill` `[estimate]`), optional header row (`Cancel` leading plain, `title` headline centered, `Done` or `Add` trailing as tinted glass circle or prominent button — `Mar 24, 2026` HIG single-view sheet rule `[official]`), scrollable content.
**Detents (`[official]`):** `medium` (~half height, floats inset `8` from screen edges with large glass and radius `38` `[estimate]`) and `large` (full height, top corners match `deviceDisplay` radius `[measured]` kit, background elevated solid). Custom detents allowed for small pickers.
**Background:** at `medium`: large glass recipe. At `large`: `bg` (elevated in dark) solid.
**Motion:** GPU transform-only `y` translation with `sheet` spring (`[estimate]` — never animate layout `height`); drag down from header OR scrolled-top (`scrollTop <= 0` handoff) to dismiss (velocity `600` or `40%` distance `[estimate]`); detent snaps give light haptic. Reduced Motion swaps slide for `200ms` crossfade (`[inferred]`). Underlying content does not shrink (iOS 26+).
**Scrim:** `scrim` token at `large` detent or blocking `modal={true}` sheets; omit scrim and set `modal={false}` at `medium` when underlying content (maps, palettes) stays interactive (`[official]`).
**Rules:** use sheets for self-contained tasks. Confirm before discarding edits (`confirmationDialog` "Discard Changes"). Never stack more than two sheets (`[official]`).
**Primitive:** `Sheet` with `detents` and `modal` props.
**Verify:** `Cancel` leading / `Done` trailing; animates transform `y` (no height animation); scroll-top handoff works; `modal={false}` at medium leaves backdrop interactive.

## Alert vs Action Sheet Decision Rule (`[official]`)

- **Alert:** unexpected critical system warnings or destructive confirmations with no extra branching choices (title `<= 2 lines`, verb button labels — never `"OK"` if `"Delete"`/`"Erase"` is clearer, trailing/top primary, leading/bottom `Cancel`; supports `Esc` / `Cmd+.` `[official]`). Never use for success messages.
- **Action Sheet (`ConfirmationDialog`):** user-initiated multi-option flow (`Save Draft` / `Delete Draft` / `Keep Editing`) anchored inline to its `sourceView` / `sourceItem`.

## Alert

**Anatomy:** title (`headline`), message (`footnote`), `1` to `3` buttons as glass capsules side by side (`2`) or stacked (`3`), preferred action tinted, destructive red.
**Metrics:** `300` wide, `20` padding, radius `34`, buttons `48` tall `[estimate]`.
**Background:** large glass, `scrim` behind.
**Motion:** scale `1.08` to `1` and fade with `popover` spring (`[estimate]`); `200ms` crossfade under Reduce Motion (`[inferred]`).
**Rules:** `Enter` key activates the default action ONLY when focus is not already on an explicit button (never hijack `Enter` on focused Cancel/Destructive).
**Primitive:** `Alert`.
**Verify:** Verb labels (no Yes/No), `Enter` on focused Cancel does not trigger Default, title `<= 2 lines`.

## Action sheet / confirmation dialog

**Anatomy:** on iOS 26+ anchored inline to the triggering `sourceView` / `sourceItem` as a popover-style glass menu (`[official]`), or anchored at bottom on compact sheets with destructive action prominent in red (first/top in inline iOS 26+ sheets `[official]`) and `Cancel` separate.
**Use:** choosing among actions related to a user-initiated task, especially destructive confirmations (`[official]`).
**Primitive:** `ConfirmationDialog`.
**Verify:** Anchored near triggering control on regular/iOS 26+; destructive choice clearly marked red.

## Menu (pull down)

**Anatomy:** glass panel morphing from its source button with scale + opacity (`[estimate]`), rows `44` tall `[estimate]` with leading label and trailing icon (iOS menu rows put the icon trailing), separators between groups (`8` gap `[estimate]`; hide trailing separator via `last:hidden`), destructive red last.
**Metrics:** radius `26`, width `250`, row padding `16` `[estimate]`.
**Motion:** morphs out of the button with `glassMorph` and `popover` spring (`[estimate]`); selection item highlight `fill-4`.
**Feedback:** none on open by tap; medium impact when opened by long press.
**Primitive:** `Menu`, `MenuItem`, `MenuSection`.
**Verify:** Trailing icons on iOS menu rows, no trailing separator after the final `MenuSection`, destructive items last.

## Context menu

**Anatomy:** long press lifts the item (`1.04` `[estimate]`) with shadow, blurs background (`20` `[estimate]`), shows preview + glass menu.
**Rules (`[official]`):** Every action inside a context menu MUST also exist in the primary toolbar or screen UI; hide unavailable items rather than dimming them; place destructive items last in red (`[official]`).
**Feedback:** impact `medium` on open (`tokens/feedback.json`).
**Primitive:** `ContextMenu`.
**Verify:** Every menu action has a visible UI counterpart; zero disabled/dimmed-only items when hiding is clearer.

## Popover (iPad, and anchored panels on iPhone)

Large glass panel (`radius-popover`: `26` `[estimate]`), anchored to the source with `8` gap (`[estimate]`). Show at most **1 popover at once** (`[official]`), never cascade popovers from popovers (`[official]`), and avoid popovers on compact iPhone screens — adapt to full-width `Sheet` unless very small (`[official]`).
**Primitive:** `Popover`.
**Verify:** Max 1 open popover, adapts to `Sheet` on compact width (`< 768pt`).

## Banner and inline feedback

Apple apps rarely use toasts (`[official]`). Prefer: inline state change in the control, a checkmark animation, or a toolbar status line. For background events (`Copied`, `Saved offline`) use a small glass capsule HUD at the top center for `1.5s` with `snappy` spring (`[official]`), zero stacking, and never auto-dismiss critical actionable errors (`[official]`).
**Primitive:** `Hud`.
**Verify:** Non-stacking `role="status"` HUD for transient info only; critical alerts remain persistent until dismissed.

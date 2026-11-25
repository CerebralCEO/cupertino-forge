# macOS components: presentation

## Menu (and context menu)

**Anatomy:** glass menu recipe (`tokens/source/apple-macos-27-ui-kit.tokens.json` `[measured]`: Light `#E6E6E6@0.55` / Dark `#5A5A5A@0.5` + kit shadow stack), radius `12` `[estimate]`, `5` outer padding `[measured]`; items `24` tall `[measured]`, `10` horizontal padding, `body` text (`13pt` `[official]`); leading checkmark column (`14`) when any item is checkable; leading `16` icon optional (`June 8, 2026` HIG `[official]`: common menu actions automatically gain standard selector icons); trailing shortcut in `label-2` using symbols (`Cmd ⌘`, `Shift ⇧`, `Option ⌥`, `Control ⌃`, `Return ↩`); submenu `chevron.right`; separators `11` tall `[measured]` (`4353:3152`) with a hairline inset `10` (`last:hidden` trailing separator guard).
**Menu Bar Commands (`[official]`):** Every toolbar and context menu command MUST also exist in the menu bar; prefer `File > Duplicate` (`Option` held transforms it to `Save As…`) rather than listing both `Save As` and `Export` (`[official]`).
**Hover/keyboard highlight:** `accent` fill squircle radius `8` `[measured]` (`685:23691`), white text and white shortcut, instant (no fade).
**Open:** appears instantly at the pointer or under the control (`100ms` fade allowed `[estimate]`; Reduce Motion `200ms` fade `[inferred]`).
**Close:** selected item blinks once (`accent` off and on `80ms`) then fades `150ms` `[estimate]`.
**Primitive:** `Menu` / `ContextMenu` (`MacMenu`, `MacContextMenu`).
**Verify:** Light `#E6E6E6@0.55` / Dark `#5A5A5A@0.5` kit glass, `24pt` row height, standard selector icons, no trailing separator, `Duplicate` + `Option` `Save As…` convention.

## Popover

Large glass recipe, radius `10` `[measured]` (`4336:13305`), optional arrow (macOS popovers have arrows pointing to the source `[official]`), `12` to `20` padding `[estimate]`, closes on outside click or `Esc` (`[official]`). Spring `popover` in (`[estimate]`; `200ms` crossfade under Reduce Motion `[inferred]`). Limit to 1 open popover at a time (`[official]`).
**Primitive:** `Popover` (`MacPopover`).
**Verify:** Directional arrow points to anchor, closes on `Esc`/outside click, max 1 open.

## Sheet (window modal)

Slides down from under the toolbar (macOS 27: centered sheet with glass `[inferred]`), radius `16` `[measured]` (`121:11423`), width `400` to `600` `[estimate]`, title `headline`, content, bottom trailing buttons (`Cancel`, `Default`). Scrim dims the parent window lightly.
**Primitive:** `MacSheet`.
**Verify:** Parent-window scoped modal sheet, bottom-trailing `[Cancel] [Default]`.

## Alert

Centered panel radius `10` `[measured]` (`121:11254`), `260` wide `[measured]`, app icon `64` at top, title `headline` (bold), message `body` `label-2`, buttons stacked full width (macOS 26+) or trailing row: `default` `accent` (first/top or rightmost), `Cancel` bordered, `destructive` red label. Optional suppression checkbox (`"Don't ask again"` `[official]`).
**Primitive:** `Alert` (`MacAlert`).
**Verify:** `Enter` activates default only when another button is not focused; suppression checkbox available for recurring prompts.

## Tooltip

Appears after `1000ms` hover (`[estimate]`, provided via shared root `<TooltipPrimitive.Provider>`), small rect radius `6` `[estimate]`, `bg-3` elevated, `caption1` text (`[official]`), `4 × 8` padding, `popover` shadow `[estimate]`, disappears on pointer move out. Every icon-only toolbar button and truncated table/text-field value gets one (`[official]` expansion tooltips).
**Primitive:** `Tooltip`.
**Verify:** Single root provider with `1000ms` delay, `caption1` text, attached to every icon-only toolbar item.

## Notifications and banners

In-app, avoid toasts (`[official]`). For background completion, update the toolbar status or Dock badge. System notifications use the OS (`UNUserNotificationCenter`).
**Verify:** Zero Web/Snackbar-style bottom toasts on macOS windows.

## Panels (inspectors that float, HUD)

Panel shadow (`tokens/elevation.json` `[measured]` kit), radius `12` `[estimate]`, title bar small (title `subheadline` emphasized), dark HUD style only for media/pro apps (`[official]`).
**Verify:** Uses measured `shadow-panel` from `elevation.json` when floating.

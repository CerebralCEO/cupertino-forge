# macOS components: presentation

## Menu (and context menu)

**Anatomy:** glass menu recipe (kit: light #E6E6E6 at 55 percent, dark #5A5A5A at 50 percent, plus the kit shadow stack), radius 12, 5 outer padding; items 24 tall, 10 horizontal padding, body text; leading checkmark column (14) when any item is checkable; leading 16 icon optional; trailing shortcut in label-2 using symbols (Cmd ⌘, Shift ⇧, Option ⌥, Control ⌃, Return ↩); submenu chevron.right; separators 9 tall with a hairline inset 10.
**Hover/keyboard highlight:** accent fill squircle radius 6, white text and white shortcut, instant (no fade).
**Open:** appears instantly at the pointer or under the control (macOS menus do not grow with a long animation; 100ms fade allowed).
**Close:** selected item blinks once (accent off and on 80ms) then fades 150ms.
**Primitive:** `MacMenu`, `MacContextMenu`.

## Popover

Large glass recipe, radius 16, optional arrow (macOS popovers have arrows pointing to the source), 12 to 20 padding, closes on outside click or Esc. Spring popover in.
**Primitive:** `MacPopover`.

## Sheet (window modal)

Slides down from under the toolbar (macOS 27: centered sheet with glass), radius 12, width 400 to 600, title headline, content, bottom trailing buttons (Cancel, Default). Scrim dims the parent window lightly.
**Primitive:** `MacSheet`.

## Alert

Centered panel radius 16, app icon 64 at top, title headline (bold), message body label-2, buttons stacked full width (macOS 26+) or trailing row: default accent, Cancel bordered, destructive red label. Optional suppression checkbox ("Don't ask again").
**Primitive:** `MacAlert`.

## Tooltip

Appears after 1000ms hover, small rect radius 6, bg elevated, caption1 text, 4 by 8 padding, popover shadow, disappears on pointer move out. Every icon only toolbar button has one.
**Primitive:** `Tooltip`.

## Notifications and banners

In app, avoid toasts. For background completion, update the toolbar status or Dock badge. System notifications use the OS.

## Panels (inspectors that float, HUD)

Panel shadow (kit), radius 12, title bar small (title subheadline emphasized), dark HUD style only for media apps.

# State patterns: empty, loading, error, offline, permission

Every screen ships all states that can occur. The reviewer checks them.

## Empty

- Centered in the content area (vertically slightly above center, about 40 percent from top).
- Glyph: SF style symbol 48 (iOS 56) label-3, hierarchical.
- Title: title2 emphasized (iOS) / title2 emphasized (macOS), label.
- Message: body label-2, max width 300, one or two sentences that tell how to fill it.
- Action: one bordered or tinted button (not prominent unless it is the only thing to do).
- First run empty vs no results vs cleared: different copy.

## Loading

- Under 300ms: show nothing (avoid flicker).
- Content placeholders: keep layout stable; show the activity indicator centered for full screen loads, inline small indicator in rows or buttons for partial loads.
- Progressive: show cached content immediately, refresh silently with pull to refresh or a toolbar spinner.
- Long operations (over 2s): progress bar with determinate value when known and a short status line (footnote label-2).
- No shimmering skeletons unless the layout is a feed of images (then use fill-4 squircle placeholders without shimmer, or a very subtle 1.5s opacity pulse between 0.6 and 1).

## Error

- Inline errors next to the source (field footnote in red with exclamationmark.circle).
- Full screen errors: empty state layout with exclamationmark.triangle label-3, title "Couldn't Load Items", message with a human cause, "Try Again" bordered button.
- Network errors keep stale content visible with a small banner row at the top of the list ("You're offline. Showing saved items.") in footnote label-2 with wifi.slash glyph.
- Never show raw error codes or stack traces; log them.

## Offline

Show stale data, disable actions that need network with an explanation, queue writes when possible and show a pending glyph (clock) in rows.

## Permission

Ask in context with a pre-prompt only if the system prompt alone is unclear. Denied state shows an empty state explaining the benefit with an "Open Settings" button.

## Success

Prefer the result itself (the new item appears with a smooth spring insert, the button turns into a checkmark for 1.5s) plus success haptic. No modal success alerts.

## Destructive confirmation

Confirmation dialog (iOS) or alert (macOS) naming the object: "Delete "Trip Notes"?" with Delete (red) and Cancel. Offer Undo where possible instead of confirmation (Mail style undo banner or Cmd+Z).

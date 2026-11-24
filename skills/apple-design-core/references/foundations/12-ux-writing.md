# 12 UX writing (Apple voice)

## Voice

Clear, calm, direct, friendly, never cute or loud. Talk to the user as "you". Short sentences. No jargon, no blame, no exclamation marks, no emoji in UI text.

## Capitalization

- Title case: buttons, menu items, navigation titles, tab names, toolbar labels, window titles, alert titles that are not sentences.
- Sentence case: descriptions, footers, helper text, alert messages, placeholder text, toggles row labels in settings are title case.
- Never ALL CAPS.

## Buttons

- Start with a verb that names the result: Save, Add to Cart, Delete Photo, Send, Continue.
- In alerts, never Yes or No; name the action: "Delete" and "Cancel".
- Cancel is always "Cancel". Done confirms edits. Close dismisses informational views.
- Append an ellipsis (...) when the action needs more input before it happens (macOS: "Export...", "Rename...").
- Destructive actions say what is destroyed: "Delete Conversation".

## Alerts

- Title states the situation or question in a few words: "Delete this conversation?"
- Message (optional) explains consequences in one or two sentences: "This conversation will be deleted from all your devices. You can't undo this action."
- Buttons: the safe choice is Cancel; the destructive one is red; the preferred one is default (bold, Return key).

## Empty states

Title says what is missing ("No Favorites Yet"), message says how to fill it ("Tap the heart on any item to save it here."), one optional action button.

## Errors

Say what happened and what to do, without technical codes: "Couldn't load your library. Check your connection and try again." Provide a Try Again button.

## Placeholders and labels

- Placeholder shows an example or the field purpose ("Search", "Name"), never instructions that disappear when typing.
- Field labels on macOS forms end without a colon in iOS, with a colon in macOS forms ("Name:").

## Numbers, dates, units

Use locale formatters. Relative dates for recent items ("Yesterday", "2 min ago" in feeds), absolute for records. Never show raw ISO strings.

## Bangla and localization

Keep text containers flexible (Bangla runs about 20 to 30 percent longer). Never hardcode strings into images. Use the script font stack and loose leading for Bangla.

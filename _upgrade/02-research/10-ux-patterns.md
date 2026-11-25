# 10 — UX Patterns: Onboarding, Navigation, Keyboard, Privacy & Microcopy

## এই ফাইল কীভাবে ব্যবহার হবে
এই ফাইলটি `skills/apple-design-core/references/patterns.md`, `anti-patterns.md`, `apple-web`, `apple-flutter`, এবং `apple-design-audit`-এর ইন্টারঅ্যাকশন ও কপি রাইটিং মানদণ্ড নির্ধারণ করে; ব্যবহারকারীর প্রথম অভিজ্ঞতা, undo/redo, পারমিশন প্রম্পট, কীবোর্ড শর্টকাট, ও নোটিফিকেশন ডিজাইন এই নিয়ম মেনে চলবে।

---

## 1. UX Pattern Specifications (Official Apple HIG)

| Name | Value | Unit | Platform & OS version | Light/Dark | Source URL | Class | Confidence (high/med/low) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ux.onboarding.timing` | Defer nonessential setup; let user try app before rating/IAP | pattern | All | Both | https://developer.apple.com/design/human-interface-guidelines/onboarding | Official | high | Do not show license/EULA inside onboarding (App Store shows it before install) |
| `ux.privacy.permissionTiming` | Never prompt at launch unless core functionality immediately requires it | pattern | All | Both | https://developer.apple.com/design/human-interface-guidelines/privacy | Official | high | Pre-alert screens must NEVER offer cancel/close to bypass OS ATT/permission sheet (App Store rejection) |
| `ux.privacy.copyStyle` | Sentence case, active voice, ends with period (`.`), plain concrete purpose | microcopy | All | Both | https://developer.apple.com/design/human-interface-guidelines/privacy | Official | high | Prefer Passkeys + Keychain; never plaintext secret storage or custom auth schemes |
| `ux.undo.limitAndTrigger` | Unlimited undo per session; Cmd+Z / 3-finger swipe / shake (no forced toolbar clutter) | pattern | All | Both | https://developer.apple.com/design/human-interface-guidelines/undo-and-redo | Official | high | Common undoable deletes (e.g. email/row) should undo silently without confirmation alert |
| `ux.keyboard.primaryModifier` | `Command` (primary) + `Shift` (secondary); AVOID `Control` | shortcut rule | macOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/keyboards | Official | high | Control is reserved by OS (screenshot/focus); support `Esc` & `Cmd+.` to cancel dialogs |
| `ux.keyboard.shiftUpperChar` | Omit `Shift` when shortcut uses upper shifted glyph (`Cmd+?`, NOT `Shift-Cmd-/`) | shortcut notation | macOS / iPadOS | Both | https://developer.apple.com/design/human-interface-guidelines/keyboards | Official | high | Verified against `Help` shortcut example in HIG Keyboards |
| `ux.gestures.touchMacOct2026` | Touch is secondary on Mac; never break keyboard/pointer parity or move layout | rule | macOS 27 | Both | https://developer.apple.com/design/human-interface-guidelines/gestures | Official | high | Oct 28, 2026 HIG update; never make action touch-only or pointer-hover-only |
| `ux.writing.pronouns` | Avoid `"we"` completely; minimize `"my"`/`"your"` (use `"Favorites"`, `"Unable to load content"`) | microcopy | All | Both | https://developer.apple.com/design/human-interface-guidelines/writing | Official | high | Dec 16, 2025 HIG update; replace `"That password is too short"` with `"Choose a password with at least 8 characters."` |
| `ux.writing.emptyStates` | Guide next action with button/link; never put critical persistent info inside temporary empty view | pattern | All | Both | https://developer.apple.com/design/human-interface-guidelines/writing | Official | high | Device-specific verbs: `"Tap"` (iOS) vs `"Click"` (macOS) |
| `ux.notifications.rules` | Max 1 per event; hide sensitive body behind `hiddenPreviewsBodyPlaceholder`; no "Open App" button | pattern | All | Both | https://developer.apple.com/design/human-interface-guidelines/notifications | Official | high | WatchOS Long Look translucent fallback uses white `@0.18` alpha if styled |
| `ux.modality.escalation` | Toast (non-blocking) -> Popover (anchored contextual) -> Sheet (task) -> Alert (critical blocking) | hierarchy | All | Both | https://developer.apple.com/design/human-interface-guidelines/alerts | Inferred | high | Never use an Alert just to show status info or on app startup |

---

## 2. Standard Keyboard & Navigation Contracts (Cross-Platform)
- **Web (`apple-web`) & Desktop (`apple-tauri`)**:
  - Windows/Linux users expect `Ctrl+Z`, `Ctrl+K`, `Ctrl+S` whereas macOS users expect `Cmd+Z`, `Cmd+K`, `Cmd+S`. Shortcuts helper MUST map `Mod` -> `Meta` on Apple (`navigator.platform` / UA-CH) and `Ctrl` on Windows/Linux.
  - Modals/Alerts: Pressing `Escape` OR clicking outside non-modal popovers (saving non-modal popover work automatically unless explicit `Cancel` was clicked, per `hig__popovers`) must restore focus to the triggering element.
- **Mobile Navigation**:
  - Back gesture: iOS interactive edge swipe from leading `20pt` (`backSwipeEdgeWidth`, Estimated) with `30%` outgoing view parallax (`Measured`); Android routes predictive back cleanly through system back callback without breaking swipe-back on iOS.

---

## 3. Gaps & Open Questions
- `ux.writing` title-case vs sentence-case rules vary per component (Menus/Alerts fragment titles = Title Case; Privacy purpose strings/Setting explanations/Complete-sentence alert titles = Sentence Case).Automated lint rules can flag obvious `"Oops!"` / `"Invalid name"` / `"We're having trouble"` anti-patterns in copy audits.

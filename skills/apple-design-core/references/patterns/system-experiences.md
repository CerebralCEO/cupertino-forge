# System Experiences: TipKit & Live Activities

## TipKit & Tooltips (`[official]`, https://developer.apple.com/design/human-interface-guidelines/offering-help)
- **Inline tips first (`TipView`):** Prefer inline tips over popover tips whenever surrounding UI must stay unobstructed; use popover tips (`.popoverTip`) only when shifting the layout is undesirable `[official]`.
- **Eligibility & dismissal:** Gate tips with parameter/event rules so users who already used a feature never see them; always keep dismissal clear and invalidate immediately on action `[official]`.
- **macOS tooltips (help tags):** Keep to **`60–75` characters**, sentence case, describe only the hovered control, never repeat the control's visible name, and omit ending periods on sentence fragments `[official]`.

## Live Activities (`[official]`, https://developer.apple.com/design/human-interface-guidelines/live-activities)
- **Surfaces:** iPhone/iPad Lock Screen (`14pt` margins `[official]`), Dynamic Island (`compact`, `minimal` up to 3 active, `expanded`, `28×28pt` constrained width `[official]`), StandBy (`2×` scale), and **macOS menu bar** (`iOS/macOS 26–27` `[official]`).
- **Duration & content:** Track tasks with a defined start and end lasting **`<= 8` hours**; never display ads, promotions, or sensitive personal info on Lock Screen / Always-On displays `[official]`.
- **Branding & UI discipline:** Use a **containerless logo mark** (never the full app icon), at most `1` interactive control on Lock Screen, and never draw in-app UI pointing to the Dynamic Island `[official]`.

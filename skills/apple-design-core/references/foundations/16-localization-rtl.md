# 16 Localization, RTL mirroring, and non-Latin typography

Source of truth: Apple HIG Right to left `[official]`, Apple System Fonts (`Kohinoor Bangla` `[platform-dependent]`, `SF Arabic` `[official]`), W3C ALReq (`[official]`), and `tokens/typography.json` (`nonLatin`).

## Core RTL mirroring rules (`[official]` Apple HIG)

1. **Use logical properties everywhere:** Web uses `padding-inline`, `margin-inline`, `inset-inline`, `border-start-start-radius`, `ms-*`/`me-*`, NEVER physical `left`/`right` (`[inferred]`). Flutter uses `EdgeInsetsDirectional`, `AlignmentDirectional`, `BorderRadiusDirectional`.
2. **3-line paragraph alignment rule (`[official]`):** Short 1–2 line blocks align to the current UI direction (`dir="rtl"`), whereas paragraphs of **3 or more lines** MUST align according to the paragraph's own script language (`dir="auto"` / `TextAlign.start` per paragraph language) so LTR paragraphs inside RTL interfaces remain scannable.
3. **List consistency (`[official]`):** Align every row inside the same list consistently to the current reading direction even when individual items use mixed scripts.
4. **Directional controls & icons (`[official]`):**
   - **Flip in RTL:** sliders, progress bars, steppers, back/next chevrons (`chevron.backward`/`chevron.forward`), ordered carousels, icons showing forward motion (e.g., speaker sound waves), or icons representing UI alignment.
   - **Never flip in RTL:** checkmarks (`checkmark`), traditional clocks, brand logos, physical real-world "to the right" pointers, right-handed tool orientation (flip base/badge only if needed), and prohibition slashes (`\` in SF Symbols).
5. **Numerals (`[official]`):** Never reverse digits inside a single number (phone numbers, OTPs, `"541"`, credit cards stay LTR). Reverse only sequences/labels representing progress order along flipped sliders/steps. Use locale formatters (`Intl.NumberFormat` / `NumberFormatter`) for Western vs Eastern Arabic digits (`0–9` vs `٠–٩`).
6. **Optical balance with ALL-CAPS Latin (`[official]`):** Arabic and Hebrew have no uppercase letters; when placed adjacent to all-caps Latin labels, increase RTL font size by **`+2 pt`** (`[official]`) for optical parity.

## Bangla, Arabic & Non-Latin script rules

| Language / Script | Font Rule | Letter Spacing (Tracking) | Leading / Line Height | Expansion Budget |
|---|---|---|---|---|
| Bangla (`bn`) | `Kohinoor Bangla` (`[platform-dependent]`), Web fallback `'Hind Siliguri', 'Noto Sans Bengali', sans-serif` | **`0em` REQUIRED (`[inferred]`)** — `:lang(bn) { letter-spacing: 0 !important; }` | `1.35–1.5` / loose leading (`[estimate]`) to avoid clipping `ref`/`u-kar`/conjuncts | `+20–30%` width (`[estimate]`) |
| Arabic (`ar`) / Hebrew (`he`) | `SF Arabic` (`[official]`) | **`0em` REQUIRED (`[official]` ALReq)** — negative tracking breaks cursive joining | Match Arabic Naskh vertical metrics (`>= 1.35` `[estimate]`) | Wrap mixed bidi spans in `<bdi>` / `dir="auto"` |
| CJK (`ja`, `zh`, `ko`) | System CJK (`Hiragino Sans`, `PingFang`, `Apple SD Gothic Neo`) | `0em` (`[inferred]`) | Never drop below legible floor (`+1–2pt` optional boost `[estimate]`) | Avoid italics; use weight/color for emphasis |

# Apple Design Resources — License Summary (Strict Interpretation)

> **Primary Source:** `https://developer.apple.com/design/resources/` and the *Apple License Agreement for Apple Design Resources* (linked at download / `https://www.apple.com/legal/internet-services/terms/site.html` & `https://developer.apple.com/support/terms/`).
> **Policy:** Where any clause is ambiguous or not publicly downloadable without accepting click-through terms, this summary marks it **`unclear`** and applies the **strictest interpretation**.

---

## 1. What Is Permitted
- **Mock-up creation for Apple OS apps:** Apple licenses its official Design Resources (Sketch/Figma UI kits, templates, artwork) **solely for designing and creating UI mock-ups for software products running on Apple operating systems** (iOS, iPadOS, macOS, tvOS, watchOS, visionOS).
- **Internal design inspection:** Inspecting numeric measurements, documenting HIG rules in original prose/metadata, and storing local gitignored reference exports strictly on the developer's own machine for private verification.

## 2. What Is Prohibited (Strict No-Redistribution)
- **No redistribution of kits, images, or artwork:** You **may not** redistribute, publish, sublicense, lend, sell, or bundle Apple Design Resources files (`.sketch`, `.fig`, exported PNGs, icons, pass templates, hardware bezels, or artwork) in a public or third-party repository, plugin, or component library.
- **No repackaging as a public template/library:** Publishing modified versions of Apple's official kits or porting Apple's raw artwork into public design systems/frameworks violates the agreement.
- **Separate strict licenses for fonts & symbols:** San Francisco (`SF Pro`) fonts and `SF Symbols` carry separate Apple licenses that also prohibit standalone redistribution or non-Apple bundling (already enforced by `cupertino-forge` via system font stacks + `lucide-react` / `cupertino_icons`).

## 3. Unclear Areas (Strictest Interpretation Applied)
- **Derived JSON token exports (`tokens/source/apple-*-ui-kit.tokens.json`) — `unclear`:** The public `developer.apple.com/design/resources/` page does not explicitly clarify whether machine-exported numeric color/shadow JSON extracted from a downloaded Sketch kit counts as a prohibited derivative work if redistributed publicly. **Strictest interpretation:** Keep any raw kit screenshots/PNGs (`qa/references/`) and extra assets (`_upgrade/04-extras/assets/`) strictly **gitignored** and never commit Apple artwork/PNGs; before any public open-source release of `cupertino-forge`, review whether `tokens/source/*.tokens.json` should also be kept local-only while shipping only independently authored HIG/measured token definitions.
- **Cross-platform (Web/Android/Windows) mock-ups — `unclear`:** The license explicitly restricts Design Resources to mock-ups for software running on Apple platforms. **Strictest interpretation:** Never ship Apple kit graphics or Apple-copyrighted hardware/brand assets in Web, Flutter/Android, or Windows Tauri builds.

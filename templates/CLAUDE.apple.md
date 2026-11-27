
## Apple design system (cupertino-forge) — MANDATORY for all UI work

- This project's UI encodes Apple's published HIG principles and Apple Design Resources kit measurements; closest parity on Apple platforms with native APIs; documented approximation elsewhere; 67 values remain estimates (see `tokens/ESTIMATES.md`). Config: `.apple-design.json`.
- Before writing or changing any UI: follow the canonical Master Use-Flow (`skills/apple-design-core/references/workflows/use-flow.md`), load the `apple-design-core` skill, then the adapter skill for this platform (`apple-web`, `apple-flutter`, or `apple-tauri`). Follow section 0 (the contract) step by step.
- Use ONLY generated tokens and the provided primitives (`components/apple` or `lib/apple_ui`). Never type raw colors, px radii, shadows, font sizes, durations or easing curves. If a value is missing, add it to the plugin tokens and rebuild.
- Liquid Glass only in the functional layer. Squircle corners and concentric nesting everywhere. Springs for all motion.
- Every screen ships empty, loading and error states.
- The lint hook blocks violations. Do not bypass it with `cf-ignore` unless the exception is justified and listed in the report.
- Finish every UI task with the **Apple Design Compliance** report from apple-design-core section 7.

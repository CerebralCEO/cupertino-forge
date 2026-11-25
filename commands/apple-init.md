---
description: Set up the Apple iOS 27 / macOS 27 design system in this project (config, tokens, primitives, CLAUDE.md rules)
argument-hint: "[web|flutter|tauri] [ios|macos|adaptive] [accent hex]"
---

# /apple-init

Install cupertino-forge into the current project. Arguments (optional): $ARGUMENTS

Follow these steps exactly and in order.

1. **Detect the stack** if not given: `package.json` with next or react or vite → web; `pubspec.yaml` → flutter; `src-tauri/` → tauri (frontend = web). If ambiguous, ask with one multiple choice question.
2. **Ask only what is missing** (one AskUserQuestion call, max 4 questions): style (ios, macos, adaptive), accent (system blue default, or a brand hex), sounds (off default), and for Tauri: Windows chrome (mac or native) and distribution (`direct` default for transparent window + Liquid Glass, or `mac-app-store` which disables `macOSPrivateApi` and uses public vibrancy fallback per https://tauri.app/distribute/app-store/). Save `distribution` into `.apple-design.json`.
3. **Write `.apple-design.json`** at the project root from `${CLAUDE_PLUGIN_ROOT}/templates/apple-design.json`, filling the answers.
4. **Validate the accent** if custom: run `node ${CLAUDE_PLUGIN_ROOT}/scripts/contrast-check.mjs --accent <hex>`; if it fails 4.5:1 on light or dark backgrounds, tell the user and propose the nearest passing shade.
5. **Install the adapter** by reading the adapter skill (apple-web, apple-flutter, or apple-tauri plus apple-web) section 1 and executing every setup step there: dependencies, `build-tokens.mjs`, copying assets, global CSS or CfApp root, root wrapper.
6. **Sounds**: if enabled, copy `${CLAUDE_PLUGIN_ROOT}/assets/sounds/*.wav` for Flutter and Tauri targets (web synthesizes in code).
7. **CLAUDE.md**: append the block from `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.apple.md` to the project's CLAUDE.md (create it if missing). Do not duplicate if already present.
8. **Verify**: run the project's typecheck or `flutter analyze`, then `node ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/lint.mjs --all`. Fix setup errors.
9. **Report** in 5 lines: what was installed, where tokens live, which primitives are available, how to rebuild tokens, and the next command to try (`/apple-screen <description>`).

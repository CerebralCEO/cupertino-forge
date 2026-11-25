# cupertino-forge Real Verification Harnesses

These minimal test harnesses verify the plugin's generated tokens and runtime primitives across **Web (React 19 + Vite + Tailwind v4)**, **Tauri 2 (Rust)**, and **Flutter**. Generated token outputs, `node_modules/`, `dist/` (except the Tauri placeholder `dist/index.html`), `target/`, `.dart_tool/`, and synced adapter source copies are gitignored so they always stay fresh from the plugin's source files.

---

## 1. Web Harness (`tests/harness/web/`)

- **Required tools:** Node.js (`>= 18`), `npm`, Python 3 (`python` on Windows, `python3` on macOS/Linux) with `playwright` installed (plus WebKit via `python -m playwright install webkit` and optionally Firefox via `python -m playwright install firefox`).
- **Commands (from repo root):**

```bash
node scripts/build-tokens.mjs --out tests/harness/web/src/styles/cupertino --targets css,tailwind,ts --accent "#0088FF"
cd tests/harness/web
npm install
npx tsc --noEmit
npm run build
python run_vite_and_verify.py --browser chromium
python run_vite_and_verify.py --browser webkit
```

---

## 2. Tauri 2 Harness (`tests/harness/tauri/`)

- **Required tools:** Node.js (`>= 18`), Rust toolchain (`cargo`, `rustc`). Full macOS `NSGlassEffectView` compilation additionally requires macOS + Xcode Clang (`aarch64-apple-darwin` cross-compilation from Windows/Linux fails in `objc2-exception-helper`).
- **Commands (from repo root):**

```bash
node scripts/build-tokens.mjs --out tests/harness/tauri/src-tauri/src --targets rust --accent "#0088FF"
cp skills/apple-tauri/assets/src-tauri/src/apple_config.rs tests/harness/tauri/src-tauri/src/
cp skills/apple-tauri/assets/src-tauri/src/apple_menu.rs tests/harness/tauri/src-tauri/src/
cp skills/apple-tauri/assets/src-tauri/src/apple_window.rs tests/harness/tauri/src-tauri/src/
cd tests/harness/tauri/src-tauri
cargo check
cargo test --lib
```

*(On PowerShell/Windows, use `Copy-Item skills/apple-tauri/assets/src-tauri/src/apple_*.rs tests/harness/tauri/src-tauri/src/`.)*

---

## 3. Flutter Harness (`tests/harness/flutter/`)

- **Required tools:** Node.js (`>= 18`), Flutter SDK (`flutter` on PATH).
- **Commands (from repo root):**

```bash
cp -r skills/apple-flutter/assets/lib/apple_ui tests/harness/flutter/lib/apple_ui
node scripts/build-tokens.mjs --out tests/harness/flutter/lib/apple_ui/theme --targets dart --accent "#0088FF"
cd tests/harness/flutter
flutter pub get
flutter analyze
flutter test
```

*(On PowerShell/Windows, use `Copy-Item -Recurse -Force skills/apple-flutter/assets/lib/apple_ui tests/harness/flutter/lib/apple_ui`.)*

---

## 4. Toolchain Check (`/apple-doctor`)

Run `node scripts/verify-plugin.mjs` from the repo root. Missing optional tools (`playwright`, `flutter`, `cargo`) are reported as `NOT RUN (<reason>)`, never `FAIL`.

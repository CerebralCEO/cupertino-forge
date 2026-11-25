#!/usr/bin/env python3
"""Real headless Chromium browser regression checks for cupertino-forge Web adapter."""
import functools
import http.server
import os
import re
import shutil
import socketserver
import sys
import tempfile
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright


def find_chrome():
    for c in ["google-chrome", "chromium", "chromium-browser", "chrome", "msedge"]:
        p = shutil.which(c)
        if p:
            return p
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ]
    for p in candidates:
        if p and os.path.exists(p):
            return p
    return None


def extract_theme_script(repo_root: Path) -> str:
    src = (repo_root / "skills/apple-web/assets/lib/theme-script.ts").read_text("utf-8")
    m = re.search(r"export const CF_THEME_INIT_SCRIPT = `([\s\S]*?)`;", src)
    assert m, "Could not extract CF_THEME_INIT_SCRIPT"
    return m.group(1)


def extract_squircle_js(repo_root: Path) -> str:
    src = (repo_root / "skills/apple-web/assets/lib/squircle.ts").read_text("utf-8")
    js_src = src.replace("export interface SquircleOptions { width: number; height: number; radius: number; smoothing?: number }", "")
    js_src = re.sub(r"export function (\w+)\(", r"function \1(", js_src)
    js_src = re.sub(r":\s*SquircleOptions\b", "", js_src)
    js_src = re.sub(r":\s*(?:number|string|boolean)\b", "", js_src)
    js_src = js_src.replace("const toRad = (deg) => (deg * Math.PI) / 180;", "const toRad = (deg) => (deg * Math.PI) / 180;")
    return js_src


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def main():
    if len(sys.argv) < 2:
        print("Usage: python run-web-browser-checks.py <tokens_dir>", file=sys.stderr)
        sys.exit(2)

    tokens_dir = Path(sys.argv[1]).resolve()
    repo_root = Path(__file__).resolve().parents[2]
    tokens_css = (tokens_dir / "cupertino.tokens.css").read_text("utf-8")
    base_css = (repo_root / "skills/apple-web/assets/styles/cupertino.base.css").read_text("utf-8")
    theme_init_js = extract_theme_script(repo_root)
    squircle_js = extract_squircle_js(repo_root)

    with tempfile.TemporaryDirectory(prefix="cf-web-browser-") as srv_dir:
        srv_path = Path(srv_dir)
        (srv_path / "cupertino.tokens.css").write_text(tokens_css, "utf-8")
        (srv_path / "cupertino.base.css").write_text(base_css, "utf-8")

        prehydrate_html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<script>{theme_init_js}</script>
</head>
<body><div id="status">ok</div></body>
</html>"""
        (srv_path / "prehydrate.html").write_text(prehydrate_html, "utf-8")

        fixture_html = f"""<!doctype html>
<html lang="en" data-cf-font="inter">
<head>
<meta charset="utf-8" />
<style>@layer base, components, utilities;</style>
<link rel="stylesheet" href="/cupertino.tokens.css" />
<link rel="stylesheet" href="/cupertino.base.css" />
<style>
@layer utilities {{
  .bg-white {{ background-color: rgb(255 255 255); }}
}}
</style>
<script>{squircle_js}</script>
</head>
<body style="margin:0; padding:24px;">
  <div id="glass-regular" class="cf-glass" data-variant="regular" style="width:120px;height:40px;"></div>
  <div id="glass-clear" class="cf-glass" data-variant="clear" style="width:120px;height:40px;"></div>
  <div id="glass-large" class="cf-glass" data-variant="large" style="width:120px;height:40px;"></div>
  <div id="glass-menu" class="cf-glass" data-variant="menu" style="width:120px;height:40px;"></div>

  <div id="fixed-parent" class="cf-glass" style="position:fixed;top:100px;left:100px;width:160px;height:44px;">
    <div id="fixed-child" style="position:fixed;top:0;left:0;width:20px;height:20px;"></div>
  </div>

  <div id="squircle-shadow-outer" style="width:200px;height:120px;border-radius:22px;box-shadow:0 4px 16px rgba(0,0,0,0.25);">
    <div id="squircle-mask-inner" style="width:200px;height:120px;border-radius:22px;box-shadow:none;background:rgb(255,255,255);"></div>
  </div>

  <span id="knob-unpressed" class="bg-white" style="display:block;width:38px;height:24px;"></span>
  <span id="knob-pressed" class="cf-glass" style="display:block;width:47.5px;height:24px;"></span>
  <span id="knob-clobbered" class="cf-glass bg-white" style="display:block;width:38px;height:24px;"></span>

  <button id="press-target" class="cf-press" style="width:80px;height:40px;">Tap</button>

  <p id="txt-en" lang="en">English</p>
  <p id="txt-bn" lang="bn">বাংলা</p>
  <p id="txt-ar" lang="ar">مرحبا</p>

  <div id="tablist-ltr" role="tablist">
    <button type="button" role="tab" id="t1" aria-selected="true" tabindex="0">Home</button>
    <button type="button" role="tab" id="t2" aria-selected="false" tabindex="-1">Browse</button>
    <button type="button" role="tab" id="t3" aria-selected="false" tabindex="-1">Search</button>
  </div>
  <div id="tablist-rtl" dir="rtl" role="tablist">
    <button type="button" role="tab" id="r1" aria-selected="true" tabindex="0">One</button>
    <button type="button" role="tab" id="r2" aria-selected="false" tabindex="-1">Two</button>
    <button type="button" role="tab" id="r3" aria-selected="false" tabindex="-1">Three</button>
  </div>

<script>
const inner = document.getElementById('squircle-mask-inner');
const url = squircleMaskDataUrl({{ width: 200, height: 120, radius: 22, smoothing: 0.6 }});
inner.style.webkitMaskImage = url;
inner.style.maskImage = url;

function bindTablist(root) {{
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  tabs.forEach((btn, idx) => {{
    btn.addEventListener('keydown', (e) => {{
      const isRtl = getComputedStyle(e.currentTarget).direction === 'rtl';
      let nextIdx = -1;
      if (e.key === 'ArrowRight') nextIdx = (idx + (isRtl ? -1 : 1) + tabs.length) % tabs.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx + (isRtl ? 1 : -1) + tabs.length) % tabs.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabs.length - 1;
      if (nextIdx >= 0) {{
        e.preventDefault();
        tabs.forEach((t, j) => {{
          t.tabIndex = j === nextIdx ? 0 : -1;
          t.setAttribute('aria-selected', String(j === nextIdx));
        }});
        tabs[nextIdx].focus();
      }}
    }});
  }});
}}
bindTablist(document.getElementById('tablist-ltr'));
bindTablist(document.getElementById('tablist-rtl'));
</script>
</body>
</html>"""
        (srv_path / "fixture.html").write_text(fixture_html, "utf-8")

        handler = functools.partial(QuietHandler, directory=str(srv_path))
        httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
        port = httpd.server_address[1]
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()

        try:
            exe = find_chrome()
            with sync_playwright() as p:
                browser = p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else p.chromium.launch()
                context = browser.new_context(viewport={"width": 390, "height": 844})
                page = context.new_page()

                # Check 1: Pre-hydration CF_THEME_INIT_SCRIPT
                page.goto(f"http://127.0.0.1:{port}/prehydrate.html")
                page.evaluate("""() => {
                  localStorage.setItem('cf-theme', 'dark');
                  localStorage.setItem('cf-contrast', 'more');
                  localStorage.setItem('cf-transparency', 'reduce');
                }""")
                page.reload()
                ds = page.evaluate("() => ({ theme: document.documentElement.dataset.theme, contrast: document.documentElement.dataset.contrast, transparency: document.documentElement.dataset.transparency })")
                assert ds == {"theme": "dark", "contrast": "more", "transparency": "reduce"}, f"Prehydrate mismatch: {ds}"

                # Main fixture checks
                page.goto(f"http://127.0.0.1:{port}/fixture.html")

                # Check 2: data-transparency="reduce" across all 4 glass surfaces (light & dark)
                for theme_name, expected_rgb in [("light", "rgb(246, 246, 246)"), ("dark", "rgb(38, 38, 38)")]:
                    page.evaluate("""(t) => {
                      document.documentElement.dataset.theme = t;
                      document.documentElement.dataset.transparency = 'reduce';
                    }""", theme_name)
                    for vid in ["glass-regular", "glass-clear", "glass-large", "glass-menu"]:
                        st = page.evaluate(f"() => {{ const s = getComputedStyle(document.getElementById('{vid}')); return {{ bg: s.backgroundColor, bf: s.backdropFilter }}; }}")
                        assert st["bf"] == "none", f"{theme_name} {vid} backdropFilter expected none, got {st['bf']}"
                        assert st["bg"] == expected_rgb, f"{theme_name} {vid} expected {expected_rgb}, got {st['bg']}"

                # Check 3: No unconditional translateZ(0) on .cf-glass
                # Under backdrop-filter:none (reduced transparency), fixed child is NOT trapped at (100,100),
                # and .cf-glass computes transform: none & will-change: auto (while [data-pressable="true"] opts into will-change: transform).
                tf_check = page.evaluate("""() => {
                  const p = document.getElementById('fixed-parent');
                  const c = document.getElementById('fixed-child').getBoundingClientRect();
                  const ps = getComputedStyle(p);
                  const kp = getComputedStyle(document.getElementById('knob-pressed'));
                  const pr = document.getElementById('press-target');
                  const glPress = document.createElement('div');
                  glPress.className = 'cf-glass';
                  glPress.setAttribute('data-pressable', 'true');
                  document.body.appendChild(glPress);
                  const glPs = getComputedStyle(glPress);
                  const out = { top: c.top, left: c.left, parentTf: ps.transform, parentWc: ps.willChange, knobTf: kp.transform, pressWc: glPs.willChange };
                  glPress.remove();
                  return out;
                }""")
                assert tf_check["top"] == 0 and tf_check["left"] == 0, f"fixed child trapped even when backdrop-filter is none: {tf_check}"
                assert tf_check["parentTf"] == "none", f"Expected no unconditional translateZ(0), got transform={tf_check['parentTf']}"
                assert tf_check["parentWc"] == "auto", f"Expected will-change auto on default .cf-glass, got {tf_check['parentWc']}"
                assert tf_check["pressWc"] == "transform", f"Expected conditional will-change: transform on pressable glass, got {tf_check['pressWc']}"

                # Reset to explicit normal transparency light mode for translucent glass checks
                page.evaluate("""() => {
                  document.documentElement.dataset.theme = 'light';
                  document.documentElement.dataset.transparency = 'normal';
                }""")

                # Check 4: Squircle SVG mask fallback + outer shadow not clipped
                sq = page.evaluate("""() => {
                  const o = getComputedStyle(document.getElementById('squircle-shadow-outer'));
                  const i = getComputedStyle(document.getElementById('squircle-mask-inner'));
                  return {
                    outerShadow: o.boxShadow,
                    outerClip: o.clipPath,
                    innerMask: i.webkitMaskImage || i.maskImage
                  };
                }""")
                assert sq["outerShadow"] != "none", f"Outer boxShadow lost: {sq}"
                assert sq["outerClip"] == "none", f"Outer clipPath should be none: {sq}"
                assert "data:image/svg+xml" in sq["innerMask"], f"Inner mask missing SVG data url: {sq}"

                # Check 5: Toggle/Slider knob (mutually exclusive cf-glass vs bg-white)
                knobs = page.evaluate("""() => {
                  const u = getComputedStyle(document.getElementById('knob-unpressed'));
                  const pr = getComputedStyle(document.getElementById('knob-pressed'));
                  const cl = getComputedStyle(document.getElementById('knob-clobbered'));
                  return {
                    unpressedBg: u.backgroundColor,
                    pressedBg: pr.backgroundColor,
                    pressedBf: pr.backdropFilter,
                    clobberedBg: cl.backgroundColor
                  };
                }""")
                assert knobs["unpressedBg"] == "rgb(255, 255, 255)", f"Unpressed knob expected white: {knobs}"
                assert "rgba(" in knobs["pressedBg"], f"Pressed glass knob must be translucent rgba: {knobs}"
                assert knobs["pressedBf"] != "none", f"Pressed glass knob must have backdrop-filter: {knobs}"
                assert knobs["clobberedBg"] == "rgb(255, 255, 255)", "Proof check: Tailwind utility bg-white overrides @layer components .cf-glass"

                # Check 6: prefers-reduced-motion: reduce
                page.emulate_media(reduced_motion="reduce")
                rm = page.evaluate("""() => {
                  const root = getComputedStyle(document.documentElement);
                  return {
                    durSnappy: root.getPropertyValue('--cf-dur-snappy').trim(),
                    easeSnappy: root.getPropertyValue('--cf-ease-snappy').trim()
                  };
                }""")
                assert rm["durSnappy"] == "200ms", f"Expected --cf-dur-snappy 200ms, got {rm['durSnappy']}"
                assert rm["easeSnappy"] == "linear(0, 1)", f"Expected --cf-ease-snappy linear(0, 1), got {rm['easeSnappy']}"
                # Verify real active press transform stays none under reduced motion
                btn = page.locator("#press-target")
                box = btn.bounding_box()
                page.mouse.move(box["x"] + 10, box["y"] + 10)
                page.mouse.down()
                active_tf = page.evaluate("() => getComputedStyle(document.getElementById('press-target')).transform")
                page.mouse.up()
                assert active_tf == "none", f"Expected active transform none under reduce-motion, got {active_tf}"
                page.emulate_media(reduced_motion="no-preference")

                # Check 7: Non-Latin letter-spacing protection under Inter
                ls = page.evaluate("""() => ({
                  en: getComputedStyle(document.getElementById('txt-en')).letterSpacing,
                  bn: getComputedStyle(document.getElementById('txt-bn')).letterSpacing,
                  ar: getComputedStyle(document.getElementById('txt-ar')).letterSpacing
                })""")
                assert ls["bn"] in ("0px", "normal"), f"Bangla letter-spacing must be 0px/normal, got {ls['bn']}"
                assert ls["ar"] in ("0px", "normal"), f"Arabic letter-spacing must be 0px/normal, got {ls['ar']}"
                assert ls["en"] not in ("0px", "normal"), f"English Inter compensation expected non-zero tracking, got {ls['en']}"
                # Also verify switching <html> lang to bn disables Inter -0.01em body compensation
                page.evaluate("() => { document.documentElement.lang = 'bn'; }")
                bn_body_ls = page.evaluate("() => getComputedStyle(document.body).letterSpacing")
                assert bn_body_ls in ("0px", "normal"), f"Expected 0px/normal on <html lang='bn'> body, got {bn_body_ls}"
                page.evaluate("() => { document.documentElement.lang = 'en'; }")

                # Check 8: RTL-aware roving tabindex arrow keyboard navigation
                page.focus("#t1")
                page.keyboard.press("ArrowRight")
                assert page.evaluate("() => document.activeElement.id") == "t2"
                page.keyboard.press("End")
                assert page.evaluate("() => document.activeElement.id") == "t3"
                page.keyboard.press("Home")
                assert page.evaluate("() => document.activeElement.id") == "t1"

                page.focus("#r1")
                page.keyboard.press("ArrowLeft")
                assert page.evaluate("() => document.activeElement.id") == "r2", "In RTL, ArrowLeft moves to next logical tab r2"
                assert page.evaluate("() => document.getElementById('r2').tabIndex") == 0
                assert page.evaluate("() => document.getElementById('r1').tabIndex") == -1

                browser.close()
                print("PLAYWRIGHT_CHECKS_OK: 8/8 passed")
        finally:
            httpd.shutdown()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Capture review screenshots of a running app across Apple viewports, themes, accessibility modes, and engines.

Usage:
  Standard (4 images):
    python scripts/capture.py --url http://localhost:3000/settings --out qa/out

  Full matrix (72 images = 2 themes x 2 contrasts x 2 transparencies x 3 viewports x 3 engines):
    python scripts/capture.py --url http://localhost:3000/settings --matrix --out qa/out

  Custom subset:
    python scripts/capture.py --url http://localhost:3000/settings --out qa/out \
      --widths 390,820,1280 --themes light,dark --contrasts normal,more \
      --transparencies normal,reduce --engines chromium,webkit,firefox

  # Use `python3` on macOS/Linux if `python` is not aliased.
Requires: pip install playwright ; local Chrome/Edge or `playwright install chromium webkit firefox`.
Sets data-theme, data-contrast, and data-transparency on <html> so CupertinoRoot apps switch deterministically.
"""
import argparse, asyncio, os, shutil, sys
from playwright.async_api import async_playwright

VIEWPORT_HEIGHTS = {
    390: 844,   # iPhone
    820: 1180,  # iPad
    1280: 800,  # Desktop / macOS
}


def find_chrome(explicit):
    if explicit:
        return explicit
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


def parse_csv(val):
    return [x.strip() for x in val.split(",") if x.strip()]


async def launch_engine(p, engine, explicit_chrome):
    if engine == "chromium":
        exe = find_chrome(explicit_chrome)
        if exe:
            return await p.chromium.launch(executable_path=exe, args=["--no-sandbox"])
        return await p.chromium.launch(args=["--no-sandbox"])
    if engine == "webkit":
        return await p.webkit.launch()
    if engine == "firefox":
        return await p.firefox.launch()
    raise ValueError(f"Unsupported engine: {engine}")


async def apply_modes(page, engine, theme, contrast, transparency):
    # Emulate media features where supported by Playwright version/engine.
    try:
        await page.emulate_media(color_scheme=theme)
    except Exception:
        pass
    if engine == "chromium":
        try:
            cdp = await page.context.new_cdp_session(page)
            features = [
                {"name": "prefers-color-scheme", "value": theme},
                {"name": "prefers-contrast", "value": "more" if contrast == "more" else "no-preference"},
                {"name": "prefers-reduced-transparency", "value": "reduce" if transparency == "reduce" else "no-preference"},
            ]
            await cdp.send("Emulation.setEmulatedMedia", {"features": features})
        except Exception:
            pass
    await page.evaluate(
        """({ theme, contrast, transparency }) => {
            const root = document.documentElement;
            root.setAttribute('data-theme', theme);
            if (contrast === 'more') root.setAttribute('data-contrast', 'more');
            else root.removeAttribute('data-contrast');
            if (transparency === 'reduce') root.setAttribute('data-transparency', 'reduce');
            else root.removeAttribute('data-transparency');
        }""",
        {"theme": theme, "contrast": contrast, "transparency": transparency},
    )


async def main(a):
    if a.matrix:
        widths = [390, 820, 1280]
        themes = ["light", "dark"]
        contrasts = ["normal", "more"]
        transparencies = ["normal", "reduce"]
        engines = ["chromium", "webkit", "firefox"]
    else:
        widths = [int(x) for x in parse_csv(a.widths)]
        themes = parse_csv(a.themes)
        contrasts = parse_csv(a.contrasts)
        transparencies = parse_csv(a.transparencies)
        engines = parse_csv(a.engines)

    total = len(themes) * len(contrasts) * len(transparencies) * len(widths) * len(engines)
    print(
        f"Planned captures: {total} "
        f"({len(themes)} themes x {len(contrasts)} contrasts x {len(transparencies)} transparencies "
        f"x {len(widths)} viewports x {len(engines)} engines) -> {a.out}"
    )
    if total > 100 and not a.allow_over_100:
        print(f"ERROR: Planned capture count ({total}) exceeds 100-image cap. Reduce axes or pass --allow-over-100.", file=sys.stderr)
        sys.exit(2)

    if a.dry_run:
        return

    os.makedirs(a.out, exist_ok=True)
    multi_axis = (
        a.matrix
        or len(engines) > 1
        or engines != ["chromium"]
        or contrasts != ["normal"]
        or transparencies != ["normal"]
    )

    captured = 0
    not_run = []

    async with async_playwright() as p:
        for engine in engines:
            try:
                browser = await launch_engine(p, engine, a.chrome)
            except Exception as err:
                reason = str(err).splitlines()[0]
                not_run.append((engine, reason))
                print(f"NOT RUN ({engine}): {reason}")
                continue

            try:
                for w in widths:
                    h = VIEWPORT_HEIGHTS.get(w, 844 if w < 768 else 760)
                    for theme in themes:
                        for contrast in contrasts:
                            for transparency in transparencies:
                                context = await browser.new_context(
                                    viewport={"width": w, "height": h},
                                    device_scale_factor=2,
                                    color_scheme=theme,
                                )
                                page = await context.new_page()
                                errors = []
                                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                                await page.goto(a.url, wait_until="networkidle")
                                await apply_modes(page, engine, theme, contrast, transparency)
                                await page.wait_for_timeout(450)
                                if multi_axis:
                                    fname = f"{engine}-{w}-{theme}-c_{contrast}-t_{transparency}.png"
                                else:
                                    fname = f"{w}-{theme}.png"
                                out_path = os.path.join(a.out, fname)
                                await page.screenshot(path=out_path, full_page=a.full)
                                captured += 1
                                print(out_path, "console errors:", errors[:5])
                                await context.close()
            finally:
                await browser.close()

    print(f"Summary: {captured}/{total} captured, {len(not_run)} engine(s) NOT RUN")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Capture cupertino-forge review screenshots.")
    ap.add_argument("--url", required=True)
    ap.add_argument("--out", default="qa/out")
    ap.add_argument("--matrix", action="store_true", help="Full 72-image matrix: light/dark x contrast normal/more x transparency normal/reduce x 390/820/1280 x chromium/webkit/firefox")
    ap.add_argument("--widths", default="390,1100")
    ap.add_argument("--themes", default="light,dark")
    ap.add_argument("--contrasts", default="normal")
    ap.add_argument("--transparencies", default="normal")
    ap.add_argument("--engines", default="chromium")
    ap.add_argument("--chrome")
    ap.add_argument("--full", action="store_true")
    ap.add_argument("--dry-run", action="store_true", help="Print planned capture count and exit without launching browsers")
    ap.add_argument("--allow-over-100", action="store_true")
    asyncio.run(main(ap.parse_args()))

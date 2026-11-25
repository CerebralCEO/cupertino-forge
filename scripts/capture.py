#!/usr/bin/env python3
"""Capture review screenshots of a running app at Apple widths and themes.

Usage: python capture.py --url http://localhost:3000/settings --out .cf-review \
          [--widths 390,1100] [--themes light,dark] [--chrome /path/to/chrome]
          # Use `python3` on macOS/Linux if `python` is not aliased.
Requires: pip install playwright ; a local Chrome or Chromium (or `playwright install chromium`).
Sets data-theme on <html> after load so CupertinoRoot apps switch theme deterministically.
"""
import argparse, asyncio, os, shutil
from playwright.async_api import async_playwright

def find_chrome(explicit):
    if explicit: return explicit
    for c in ["google-chrome", "chromium", "chromium-browser", "chrome", "msedge"]:
        p = shutil.which(c)
        if p: return p
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ]
    for p in candidates:
        if p and os.path.exists(p): return p
    return None

async def main(a):
    os.makedirs(a.out, exist_ok=True)
    exe = find_chrome(a.chrome)
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else await p.chromium.launch()
        for w in [int(x) for x in a.widths.split(",")]:
            h = 844 if w < 768 else 760
            for theme in a.themes.split(","):
                page = await browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=theme)
                errors = []
                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                await page.goto(a.url, wait_until="networkidle")
                await page.evaluate("t => document.documentElement.setAttribute('data-theme', t)", theme)
                await page.wait_for_timeout(600)
                name = os.path.join(a.out, f"{w}-{theme}.png")
                await page.screenshot(path=name, full_page=a.full)
                print(name, "console errors:", errors[:5])
                await page.close()
        await browser.close()

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--out", default=".cf-review")
    ap.add_argument("--widths", default="390,1100")
    ap.add_argument("--themes", default="light,dark")
    ap.add_argument("--chrome")
    ap.add_argument("--full", action="store_true")
    asyncio.run(main(ap.parse_args()))

#!/usr/bin/env python3
"""Playwright verification against REAL mounted React components bundled by Vite."""
import argparse
import os
import shutil
import sys
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


def launch_browser(p, browser_name: str):
    if browser_name == "webkit":
        return p.webkit.launch()
    if browser_name == "firefox":
        return p.firefox.launch()
    exe = find_chrome()
    return p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else p.chromium.launch()


def drag_pointer(page, x1, y1, x2, y2, steps=16):
    page.mouse.move(x1, y1)
    page.mouse.down()
    for i in range(1, steps + 1):
        t = i / steps
        page.mouse.move(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)
        page.wait_for_timeout(16)
    page.mouse.up()


def run_checks(url: str, browser_name: str):
    results = {}
    with sync_playwright() as p:
        browser = launch_browser(p, browser_name)
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        # 1. Zero-FOUC dark mode on first paint
        page.goto(url, wait_until="networkidle")
        page.evaluate("""() => {
          localStorage.setItem('cf-theme', 'dark');
          localStorage.setItem('cf-transparency', 'normal');
          localStorage.removeItem('cf-contrast');
        }""")
        page.reload(wait_until="networkidle")
        first_paint = page.evaluate("""() => ({
          themeBeforeReact: window.__FIRST_PAINT_THEME__,
          transBeforeReact: window.__FIRST_PAINT_TRANSPARENCY__,
          domTheme: document.documentElement.dataset.theme,
          bgColor: getComputedStyle(document.documentElement).backgroundColor
        })""")
        assert first_paint["themeBeforeReact"] == "dark", f"FOUC: pre-React theme was {first_paint}"
        assert first_paint["domTheme"] == "dark", f"DOM theme mismatch: {first_paint}"
        assert first_paint["bgColor"] == "rgb(0, 0, 0)", f"Dark bg mismatch: {first_paint}"
        results["1_dark_first_paint_zero_fouc"] = first_paint

        # 2. In-app transparency="reduce" turns real <Glass> solid opaque
        page.click("#btn-toggle-transparency")
        page.wait_for_timeout(100)
        trans_state = page.evaluate("""() => {
          const g = getComputedStyle(document.getElementById('test-glass-rect'));
          const bf = (g.backdropFilter && g.backdropFilter !== 'none') ? g.backdropFilter : (g.webkitBackdropFilter || 'none');
          return {
            dataset: document.documentElement.dataset.transparency,
            stored: localStorage.getItem('cf-transparency'),
            bg: g.backgroundColor,
            bf
          };
        }""")
        assert trans_state["dataset"] == "reduce", f"Expected data-transparency=reduce: {trans_state}"
        assert trans_state["stored"] == "reduce", f"Expected localStorage cf-transparency=reduce: {trans_state}"
        assert trans_state["bf"] == "none", f"Expected backdropFilter none: {trans_state}"
        assert trans_state["bg"] == "rgb(38, 38, 38)", f"Expected opaque dark glass rgb(38, 38, 38): {trans_state}"
        results["2_inapp_reduce_transparency"] = trans_state

        # Switch back to light + normal transparency for translucent glass knob test
        page.click("#btn-toggle-transparency")
        page.click("#btn-toggle-theme")
        page.wait_for_timeout(120)

        # 3. Real <Toggle> translucent glass knob (no bg-white clobber)
        sw = page.locator('#toggle-wrap [role="switch"]')
        unpressed = page.evaluate("""() => {
          const el = document.querySelector('#toggle-wrap [role="switch"] span');
          const cs = getComputedStyle(el);
          return { cls: el.className, bg: cs.backgroundColor };
        }""")
        assert "bg-white" in unpressed["cls"] and "cf-glass" not in unpressed["cls"], f"Unpressed class wrong: {unpressed}"
        assert unpressed["bg"] == "rgb(255, 255, 255)", f"Unpressed bg wrong: {unpressed}"

        box = sw.bounding_box()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        page.mouse.down()
        page.wait_for_timeout(120)
        pressed = page.evaluate("""() => {
          const el = document.querySelector('#toggle-wrap [role="switch"] span');
          const cs = getComputedStyle(el);
          const bf = (cs.backdropFilter && cs.backdropFilter !== 'none') ? cs.backdropFilter : (cs.webkitBackdropFilter || 'none');
          return { cls: el.className, bg: cs.backgroundColor, bf };
        }""")
        page.mouse.up()
        page.wait_for_timeout(120)
        assert "cf-glass" in pressed["cls"] and "bg-white" not in pressed["cls"], f"Pressed toggle class clobbered: {pressed}"
        assert ("rgba(" in pressed["bg"] or "/" in pressed["bg"]), f"Pressed toggle glass must be translucent: {pressed}"
        assert pressed["bf"] != "none", f"Pressed toggle must have backdrop-filter: {pressed}"
        results["3_toggle_translucent_glass"] = {"unpressed": unpressed, "pressed": pressed}

        # 4. Real <TabBar> & <SegmentedControl> arrow-key roving focus (LTR & RTL) + inner capsule
        has_capsule_cls = page.evaluate("() => Boolean(document.querySelector('nav[aria-label=\"Tabs\"] .cf-glass-capsule-active'))")
        assert has_capsule_cls, "TabBar selected tab must use .cf-glass-capsule-active"

        page.focus('nav[aria-label="Tabs"] [role="tab"][aria-selected="true"]')
        page.keyboard.press("ArrowRight")
        tab_ltr = page.evaluate("""() => ({
          activeText: document.activeElement?.textContent,
          selected: document.querySelector('nav[aria-label="Tabs"] [role="tab"][aria-selected="true"]')?.textContent,
          activeTabIndex: document.activeElement?.getAttribute('tabindex')
        })""")
        assert tab_ltr["selected"] == "Browse" and tab_ltr["activeText"] == "Browse" and tab_ltr["activeTabIndex"] == "0", f"TabBar LTR ArrowRight failed: {tab_ltr}"

        page.focus('#seg-wrap [role="tab"][aria-selected="true"]')
        page.keyboard.press("ArrowRight")
        seg_ltr = page.evaluate("() => document.querySelector('#seg-wrap [aria-selected=\"true\"]')?.textContent")
        assert seg_ltr == "Week", f"SegmentedControl LTR ArrowRight failed: {seg_ltr}"

        # Reset SegmentedControl to Day, switch to RTL, press ArrowLeft (next logical item -> Week)
        page.keyboard.press("Home")
        page.click("#btn-toggle-dir")
        page.wait_for_timeout(80)
        page.focus('#seg-wrap [role="tab"][aria-selected="true"]')
        page.keyboard.press("ArrowLeft")
        seg_rtl = page.evaluate("""() => ({
          dir: getComputedStyle(document.getElementById('harness-root')).direction,
          selected: document.querySelector('#seg-wrap [aria-selected="true"]')?.textContent,
          activeText: document.activeElement?.textContent
        })""")
        assert seg_rtl["dir"] == "rtl" and seg_rtl["selected"] == "Week" and seg_rtl["activeText"] == "Week", f"SegmentedControl RTL ArrowLeft failed: {seg_rtl}"
        page.click("#btn-toggle-dir")
        page.wait_for_timeout(80)
        results["4_roving_focus_ltr_rtl"] = {"tab_ltr": tab_ltr, "seg_rtl": seg_rtl}

        # 5. Real <Sheet> drag & scroll-top handoff
        page.click("#btn-open-sheet")
        page.wait_for_selector('[role="dialog"]', timeout=4000)
        page.wait_for_timeout(600)

        sheet_metrics_open = page.evaluate("""() => {
          const d = document.querySelector('[role="dialog"]');
          const cs = getComputedStyle(d);
          return { height: d.getBoundingClientRect().height, transform: cs.transform, inlineY: d.style.transform };
        }""")
        # Scroll body down first and try downward drag -> must NOT dismiss/snap while scrolled
        page.evaluate("""() => {
          const body = document.getElementById('sheet-scroll-content').parentElement;
          body.scrollTop = 250;
        }""")
        drag_pointer(page, 195, 250, 195, 520, steps=10)
        page.wait_for_timeout(450)
        still_open_when_scrolled = page.locator('[role="dialog"]').count() == 1
        assert still_open_when_scrolled, "Sheet should stay open when dragging down mid-scroll"

        # Scroll back to scrollTop === 0 -> drag down on body should hand off to sheet drag!
        page.evaluate("""() => {
          const body = document.getElementById('sheet-scroll-content').parentElement;
          body.scrollTop = 0;
        }""")
        page.wait_for_timeout(50)
        drag_pointer(page, 195, 250, 195, 650, steps=18)
        page.wait_for_timeout(850)
        after_scroll_handoff = page.evaluate("""() => {
          const d = document.querySelector('[role="dialog"]');
          if (!d) return { closed: true, top: null };
          return { closed: false, top: d.getBoundingClientRect().top };
        }""")
        # Handoff either closed the sheet directly OR snapped from large (~50px top) down to medium (~397px top)
        if not after_scroll_handoff["closed"]:
            assert after_scroll_handoff["top"] > 200, f"Scroll-top handoff did not drag/snap sheet down from large: {after_scroll_handoff}"
            # Now drag header down from medium to dismiss completely
            header_y = after_scroll_handoff["top"] + 20
            drag_pointer(page, 195, header_y, 195, 810, steps=16)
            page.wait_for_selector('[role="dialog"]', state="detached", timeout=3000)
        closed_count = page.locator('[role="dialog"]').count()
        assert closed_count == 0, f"Sheet failed to close after drag dismiss, count={closed_count}"
        results["5_sheet_drag_and_scroll_handoff"] = {"open": sheet_metrics_open, "after_handoff": after_scroll_handoff, "final_count": closed_count}

        # 6. Real prefers-reduced-motion + Alert Enter guard
        page.emulate_media(reduced_motion="reduce")
        page.wait_for_timeout(120)
        rm_state = page.evaluate("""() => ({
          datasetRM: document.documentElement.dataset.reducedMotion,
          durSnappy: getComputedStyle(document.documentElement).getPropertyValue('--cf-dur-snappy').trim(),
          easeSnappy: getComputedStyle(document.documentElement).getPropertyValue('--cf-ease-snappy').trim()
        })""")
        assert rm_state["datasetRM"] == "true", f"CupertinoRoot did not set data-reduced-motion=true: {rm_state}"
        assert rm_state["durSnappy"] in ("200ms", ".2s"), f"Expected 200ms/.2s dur-snappy under reduce motion: {rm_state}"

        page.click("#btn-open-alert")
        page.wait_for_selector('[role="alertdialog"]', timeout=3000)
        page.locator('[role="alertdialog"] button', has_text="Cancel").focus()
        page.keyboard.press("Enter")
        page.wait_for_timeout(200)
        alert_res = page.locator("#alert-result").get_attribute("data-result")
        assert alert_res == "cancelled", f"Focused Cancel + Enter triggered wrong action: {alert_res}"
        page.emulate_media(reduced_motion="no-preference")
        results["6_reduced_motion_and_alert_enter"] = {"rm": rm_state, "alert_result": alert_res}

        # 7. Real <Squircle> & <Glass shape="rect"> SVG mask fallback + outer shadow preservation (forced !corner-shape)
        context_sq = browser.new_context(viewport={"width": 390, "height": 844})
        context_sq.add_init_script("""(() => {
          const orig = CSS.supports.bind(CSS);
          CSS.supports = (prop, val) => (prop === 'corner-shape' ? false : orig(prop, val));
        })();""")
        page_sq = context_sq.new_page()
        page_sq.goto(url, wait_until="networkidle")
        page_sq.wait_for_timeout(250)
        sq_mask = page_sq.evaluate("""() => {
          const card = document.getElementById('test-squircle-card');
          const outer = card.parentElement;
          const cardCs = getComputedStyle(card);
          const outerCs = getComputedStyle(outer);
          const glass = document.getElementById('test-glass-rect');
          const glassOuter = glass.parentElement;
          const glassCs = getComputedStyle(glass);
          const glassOuterCs = getComputedStyle(glassOuter);
          const pickMask = (cs) => (cs.maskImage && cs.maskImage !== 'none') ? cs.maskImage : (cs.webkitMaskImage || 'none');
          return {
            sqAttr: document.documentElement.dataset.cfSquircle,
            cardMask: pickMask(cardCs),
            cardShadow: cardCs.boxShadow,
            outerShadow: outerCs.boxShadow,
            outerClip: outerCs.clipPath,
            glassMask: pickMask(glassCs),
            glassOuterShadow: glassOuterCs.boxShadow
          };
        }""")
        assert sq_mask["sqAttr"] == "mask", f"Expected data-cf-squircle=mask: {sq_mask}"
        assert "data:image/svg+xml" in sq_mask["cardMask"], f"Squircle missing SVG maskImage: {sq_mask}"
        assert sq_mask["outerShadow"] != "none" and sq_mask["outerClip"] == "none", f"Squircle outer shadow clipped/missing: {sq_mask}"
        assert "data:image/svg+xml" in sq_mask["glassMask"] and sq_mask["glassOuterShadow"] != "none", f"Glass rect fallback mask/shadow failed: {sq_mask}"
        results["7_squircle_mask_and_shadow_fallback"] = {
            "sqAttr": sq_mask["sqAttr"],
            "hasCardMask": "data:image/svg+xml" in sq_mask["cardMask"],
            "outerShadow": sq_mask["outerShadow"],
            "hasGlassMask": "data:image/svg+xml" in sq_mask["glassMask"],
        }

        assert not page_errors, f"Uncaught page errors: {page_errors}"
        context_sq.close()
        context.close()
        browser.close()
    print(f"MOUNTED_REACT_OK ({browser_name}): 7/7 checks passed")
    for k, v in results.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--browser", choices=["chromium", "webkit", "firefox"], default="chromium")
    args = ap.parse_args()
    run_checks(args.url, args.browser)

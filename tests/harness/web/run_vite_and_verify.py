#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


def wait_server(url: str, timeout: float = 20.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=1) as r:
                if r.status == 200:
                    return
        except Exception:
            time.sleep(0.25)
    raise RuntimeError(f"Server did not become ready at {url}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--browser", choices=["chromium", "webkit", "firefox"], default="chromium")
    ap.add_argument("--port", type=int, default=4173)
    args = ap.parse_args()

    here = Path(__file__).resolve().parent
    url = f"http://127.0.0.1:{args.port}/"
    vite_cmd = "npx.cmd" if os.name == "nt" else "npx"
    proc = subprocess.Popen(
        [vite_cmd, "vite", "preview", "--host", "127.0.0.1", "--port", str(args.port), "--strictPort"],
        cwd=str(here),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    try:
        wait_server(url)
        res = subprocess.run(
            [sys.executable, str(here / "verify_mounted.py"), "--url", url, "--browser", args.browser],
            cwd=str(here),
            text=True,
        )
        sys.exit(res.returncode)
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()


if __name__ == "__main__":
    main()

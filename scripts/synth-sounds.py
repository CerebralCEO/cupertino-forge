#!/usr/bin/env python3
"""Render cupertino-forge's ORIGINAL UI sounds to WAV (44.1 kHz, 16 bit mono).
These are synthesized from scratch per tokens/feedback.json specs; they contain no Apple audio.
Usage: python3 synth-sounds.py [out_dir]   (default: ../assets/sounds)
Requires: numpy
"""
import os, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-np.maximum(t - attack, 0) / max(decay / 5, 1e-4))
    return a * d

def tone(freq, dur, peak, glide_to=None, kind="sine"):
    n = int(SR * dur)
    f = np.linspace(freq, glide_to or freq, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if kind == "sine" else (2 / np.pi) * np.arcsin(np.sin(ph))  # triangle
    return w * env(n, 0.004, dur) * peak

def bandnoise(center, dur, peak, q=1.2):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    # simple biquad bandpass
    w0 = 2 * np.pi * center / SR
    alpha = np.sin(w0) / (2 * q)
    b0, b1, b2 = alpha, 0, -alpha
    a0, a1, a2 = 1 + alpha, -2 * np.cos(w0), 1 - alpha
    y = np.zeros(n); x1 = x2 = y1 = y2 = 0.0
    for i in range(n):
        yi = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x[i], y1, yi
        y[i] = yi
    y /= np.max(np.abs(y)) + 1e-9
    return y * env(n, 0.001, dur) * peak

def mix(parts, total):
    out = np.zeros(int(SR * total))
    for start, sig in parts:
        s = int(SR * start)
        out[s:s + len(sig)] += sig[: len(out) - s]
    return out

def write(path, x):
    x = np.clip(x, -1, 1)
    fade = int(SR * 0.004)
    x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def db(d): return 10 ** (d / 20)

SOUNDS = {
    "tap": lambda: mix([(0, bandnoise(4500, 0.025, db(-14))), (0, tone(1800, 0.025, db(-20)))], 0.06),
    "toggle-on": lambda: mix([(0, tone(1200, 0.04, db(-16))), (0.018, tone(2400, 0.04, db(-18)))], 0.09),
    "toggle-off": lambda: mix([(0, tone(2400, 0.04, db(-18))), (0.018, tone(1200, 0.04, db(-16)))], 0.09),
    "tick": lambda: mix([(0, bandnoise(6000, 0.012, db(-22)))], 0.03),
    "success": lambda: mix([(0, tone(1318.5, 0.22, db(-16))), (0.09, tone(1975.5, 0.26, db(-16)))], 0.4),
    "error": lambda: mix([(0, tone(440, 0.12, db(-15), kind="tri")), (0.11, tone(349.2, 0.16, db(-15), kind="tri"))], 0.32),
    "send": lambda: mix([(0, bandnoise(1200, 0.3, db(-16), q=0.8) * np.linspace(0.3, 1, int(SR * 0.3)))], 0.34),
    "refresh": lambda: mix([(0, tone(900, 0.03, db(-16), glide_to=600))], 0.06),
    "keyboard": lambda: mix([(0, bandnoise(3200, 0.008, db(-16))), (0, tone(180, 0.015, db(-18)))], 0.03),
}

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "..", "assets", "sounds")
    os.makedirs(out, exist_ok=True)
    for name, fn in SOUNDS.items():
        write(os.path.join(out, f"{name}.wav"), fn())
        print("wrote", os.path.join(out, f"{name}.wav"))

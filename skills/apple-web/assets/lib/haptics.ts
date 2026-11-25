'use client';
// Apple style haptics for the web.
// Android Chrome: Vibration API. iOS Safari 18+: no Vibration API, but toggling a native
// <input type="checkbox" switch> plays the system selection haptic, so we click a hidden one.
// Must be called inside a user gesture (pointerdown, click). Desktop: no-op.

export type HapticKind = 'selection' | 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error';

const patterns: Record<HapticKind, number[]> = {
  selection: [8], light: [10], soft: [10], medium: [18], rigid: [14], heavy: [28],
  success: [12, 60, 18], warning: [20, 80, 20], error: [25, 50, 25, 50, 25],
};

let enabled = true;
let iosLabel: HTMLLabelElement | null = null;

export function setHapticsEnabled(v: boolean) { enabled = v; }

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function iosSwitchTap(times: number) {
  if (typeof document === 'undefined') return;
  if (!iosLabel) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.id = 'cf-haptic-switch';
    input.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;left:-9px;top:-9px';
    iosLabel = document.createElement('label');
    iosLabel.htmlFor = input.id;
    iosLabel.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;left:-9px;top:-9px';
    iosLabel.setAttribute('aria-hidden', 'true');
    document.body.append(input, iosLabel);
  }
  for (let i = 0; i < times; i++) setTimeout(() => iosLabel?.click(), i * 70);
}

/** Plays a haptic pulse when supported and enabled. Returns true if a haptic fired (callers must not stack sound on top). */
export function haptic(kind: HapticKind = 'selection'): boolean {
  if (!enabled || typeof window === 'undefined') return false;
  if (window.matchMedia?.('(pointer: fine)').matches && !('ontouchstart' in window)) return false; // desktop
  if (isIOS()) {
    // iOS only exposes one (selection like) haptic this way. Multi pulse for notifications.
    const times = kind === 'success' ? 2 : kind === 'error' ? 3 : kind === 'warning' ? 2 : 1;
    iosSwitchTap(times);
    return true;
  }
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    return navigator.vibrate(patterns[kind]) !== false;
  }
  return false;
}

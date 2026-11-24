'use client';
// Resolves which Apple style to render (ios or macos) by size class and input, per apple-design-core section 3.

export type CfStyle = 'ios' | 'macos' | 'adaptive';
export type CfPlatform = 'ios' | 'macos';

export const BREAKPOINT_REGULAR = 768;
export const BREAKPOINT_DESKTOP = 1180;

export function resolvePlatform(style: CfStyle): CfPlatform {
  if (style !== 'adaptive') return style;
  if (typeof window === 'undefined') return 'ios';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  return window.innerWidth >= BREAKPOINT_DESKTOP && fine ? 'macos' : 'ios';
}

export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
}

/** Size class by available width (not device). */
export function sizeClass(width: number): 'compact' | 'regular' {
  return width < BREAKPOINT_REGULAR ? 'compact' : 'regular';
}

/** Shortcut glyph for the current OS: Cmd on Apple, Ctrl elsewhere. */
export function modKeyLabel(): string {
  return isApplePlatform() ? '⌘' : 'Ctrl+';
}

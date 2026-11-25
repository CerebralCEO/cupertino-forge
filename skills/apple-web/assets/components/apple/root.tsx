'use client';
import * as React from 'react';
import { MotionConfig } from 'motion/react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { resolvePlatform, isApplePlatform, BREAKPOINT_DESKTOP, type CfPlatform, type CfStyle } from '@/lib/cupertino/platform';
import { setHapticsEnabled } from '@/lib/cupertino/haptics';
import { setSoundsEnabled } from '@/lib/cupertino/sounds';
import { supportsCornerShape } from '@/lib/cupertino/squircle';

export type Appearance = 'system' | 'light' | 'dark';
export type Transparency = 'system' | 'normal' | 'reduce';
export type Contrast = 'system' | 'normal' | 'more';

interface CupertinoCtx {
  platform: CfPlatform;
  theme: 'light' | 'dark';
  reducedMotion: boolean;
  squircleNative: boolean;
  resolvedTransparency: 'normal' | 'reduce';
  resolvedContrast: 'normal' | 'more';
  setAppearance: (a: Appearance) => void;
  setTransparency: (t: Transparency) => void;
  setContrast: (c: Contrast) => void;
}
const Ctx = React.createContext<CupertinoCtx>({
  platform: 'ios',
  theme: 'light',
  reducedMotion: false,
  squircleNative: true,
  resolvedTransparency: 'normal',
  resolvedContrast: 'normal',
  setAppearance: () => {},
  setTransparency: () => {},
  setContrast: () => {},
});
export const useCupertino = () => React.useContext(Ctx);

export interface CupertinoRootProps {
  style?: CfStyle;              // from .apple-design.json
  appearance?: Appearance;      // from .apple-design.json, user can override
  transparency?: Transparency;  // explicit user setting (Safari lacks prefers-reduced-transparency)
  contrast?: Contrast;          // explicit high-contrast setting
  glassIntensity?: number;      // 0 clear .. 1 tinted, default 0.5
  sounds?: boolean;             // from .apple-design.json; still requires user setting
  haptics?: boolean;
  children: React.ReactNode;
}

function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function CupertinoRoot({
  style = 'adaptive',
  appearance = 'system',
  transparency = 'system',
  contrast = 'system',
  glassIntensity = 0.5,
  sounds = false,
  haptics = true,
  children,
}: CupertinoRootProps) {
  const [app, setAppState] = React.useState<Appearance>(appearance);
  const [trans, setTransState] = React.useState<Transparency>(transparency);
  const [hc, setHcState] = React.useState<Contrast>(contrast);
  const [platform, setPlatform] = React.useState<CfPlatform>(style === 'macos' ? 'macos' : 'ios');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [reducedMotion, setRM] = React.useState(false);
  const [resolvedTransparency, setResolvedTransparency] = React.useState<'normal' | 'reduce'>('normal');
  const [resolvedContrast, setResolvedContrast] = React.useState<'normal' | 'more'>('normal');
  const [squircleNative, setSq] = React.useState(true);

  React.useEffect(() => { setAppState(appearance); }, [appearance]);
  React.useEffect(() => { setTransState(transparency); }, [transparency]);
  React.useEffect(() => { setHcState(contrast); }, [contrast]);

  const setAppearance = React.useCallback((next: Appearance) => {
    setAppState(next);
    try {
      if (next === 'system') localStorage.removeItem('cf-theme');
      else localStorage.setItem('cf-theme', next);
    } catch { /* storage may be unavailable */ }
  }, []);

  const setTransparency = React.useCallback((next: Transparency) => {
    setTransState(next);
    try {
      if (next === 'system') localStorage.removeItem('cf-transparency');
      else localStorage.setItem('cf-transparency', next);
    } catch { /* storage may be unavailable */ }
  }, []);

  const setContrast = React.useCallback((next: Contrast) => {
    setHcState(next);
    try {
      if (next === 'system') localStorage.removeItem('cf-contrast');
      else localStorage.setItem('cf-contrast', next);
    } catch { /* storage may be unavailable */ }
  }, []);

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    const mqRM = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqContrast = window.matchMedia('(prefers-contrast: more)');
    const mqTrans = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const mqDesktop = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`);
    const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');

    const update = () => {
      const storedTheme = app === 'system' ? readStored('cf-theme', ['light', 'dark'] as const) : null;
      const storedTrans = trans === 'system' ? readStored('cf-transparency', ['normal', 'reduce'] as const) : null;
      const storedContrast = hc === 'system' ? readStored('cf-contrast', ['normal', 'more'] as const) : null;

      const p = resolvePlatform(style);
      const t = storedTheme ?? (app === 'system' ? (mqDark.matches ? 'dark' : 'light') : app);
      const rTrans: 'normal' | 'reduce' = storedTrans ?? (trans === 'system' ? (mqTrans.matches ? 'reduce' : 'normal') : trans);
      const rContrast: 'normal' | 'more' = storedContrast ?? (hc === 'system' ? (mqContrast.matches ? 'more' : 'normal') : hc);
      const rm = mqRM.matches;

      setPlatform(p);
      setTheme(t);
      setRM(rm);
      setResolvedTransparency(rTrans);
      setResolvedContrast(rContrast);

      root.dataset.cfPlatform = p;
      root.dataset.theme = t;
      root.dataset.transparency = rTrans;
      root.dataset.contrast = rContrast;
      root.dataset.reducedMotion = rm ? 'true' : 'false';
      root.style.setProperty('--cf-glass-intensity', String(glassIntensity));
      root.dataset.cfFont = isApplePlatform() ? 'system' : 'inter';

      const native = supportsCornerShape();
      setSq(native);
      root.dataset.cfSquircle = native ? 'native' : 'mask';
    };

    update();
    const listeners: Array<[MediaQueryList, () => void]> = [
      [mqDark, update],
      [mqRM, update],
      [mqContrast, update],
      [mqTrans, update],
      [mqDesktop, update],
      [mqFine, update],
    ];
    for (const [mq, fn] of listeners) mq.addEventListener('change', fn);
    return () => { for (const [mq, fn] of listeners) mq.removeEventListener('change', fn); };
  }, [style, app, trans, hc, glassIntensity]);

  React.useEffect(() => { setHapticsEnabled(haptics); }, [haptics]);
  React.useEffect(() => {
    let user = true;
    try { user = localStorage.getItem('cf-sounds') !== 'off'; } catch { /* storage may be unavailable */ }
    setSoundsEnabled(sounds && user);
  }, [sounds]);

  return (
    <Ctx.Provider
      value={{
        platform,
        theme,
        reducedMotion,
        squircleNative,
        resolvedTransparency,
        resolvedContrast,
        setAppearance,
        setTransparency,
        setContrast,
      }}
    >
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
        <TooltipPrimitive.Provider delayDuration={1000}>
          <LensFilter />
          {children}
        </TooltipPrimitive.Provider>
      </MotionConfig>
    </Ctx.Provider>
  );
}

/** SVG displacement filter used by Glass lens (Chromium only). Rim refraction, flat center. */
function LensFilter() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="cf-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage result="map" preserveAspectRatio="none" href={LENS_MAP} />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="24" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

// Displacement map: neutral gray center, red and green gradients at the rim push pixels inward.
const LENS_MAP =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="r" x1="0" x2="1"><stop offset="0" stop-color="#ff0000"/><stop offset="0.18" stop-color="#800000"/><stop offset="0.82" stop-color="#800000"/><stop offset="1" stop-color="#000000"/></linearGradient>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00ff00"/><stop offset="0.18" stop-color="#008000"/><stop offset="0.82" stop-color="#008000"/><stop offset="1" stop-color="#000000"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#r)"/>
      <rect width="200" height="200" fill="url(#g)" style="mix-blend-mode:screen"/>
    </svg>`
  );

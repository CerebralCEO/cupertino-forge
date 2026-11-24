'use client';
import * as React from 'react';
import { resolvePlatform, isApplePlatform, type CfPlatform, type CfStyle } from '@/lib/cupertino/platform';
import { setHapticsEnabled } from '@/lib/cupertino/haptics';
import { setSoundsEnabled } from '@/lib/cupertino/sounds';
import { supportsCornerShape } from '@/lib/cupertino/squircle';

type Appearance = 'system' | 'light' | 'dark';
interface CupertinoCtx {
  platform: CfPlatform;
  theme: 'light' | 'dark';
  reducedMotion: boolean;
  squircleNative: boolean;
  setAppearance: (a: Appearance) => void;
}
const Ctx = React.createContext<CupertinoCtx>({ platform: 'ios', theme: 'light', reducedMotion: false, squircleNative: true, setAppearance: () => {} });
export const useCupertino = () => React.useContext(Ctx);

export interface CupertinoRootProps {
  style?: CfStyle;            // from .apple-design.json
  appearance?: Appearance;    // from .apple-design.json, user can override
  glassIntensity?: number;    // 0 clear .. 1 tinted, default 0.5
  sounds?: boolean;           // from .apple-design.json; still requires user setting
  haptics?: boolean;
  children: React.ReactNode;
}

export function CupertinoRoot({ style = 'adaptive', appearance = 'system', glassIntensity = 0.5, sounds = false, haptics = true, children }: CupertinoRootProps) {
  const [app, setApp] = React.useState<Appearance>(appearance);
  const [platform, setPlatform] = React.useState<CfPlatform>(style === 'macos' ? 'macos' : 'ios');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [reducedMotion, setRM] = React.useState(false);
  const [squircleNative, setSq] = React.useState(true);

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    const mqRM = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const p = resolvePlatform(style);
      const t = app === 'system' ? (mqDark.matches ? 'dark' : 'light') : app;
      setPlatform(p); setTheme(t); setRM(mqRM.matches);
      root.dataset.cfPlatform = p;
      root.dataset.theme = t;
      root.style.setProperty('--cf-glass-intensity', String(glassIntensity));
      root.dataset.cfFont = isApplePlatform() ? 'system' : 'inter';
      const native = supportsCornerShape();
      setSq(native);
      root.dataset.cfSquircle = native ? 'native' : 'mask';
    };
    update();
    mqDark.addEventListener('change', update);
    mqRM.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => { mqDark.removeEventListener('change', update); mqRM.removeEventListener('change', update); window.removeEventListener('resize', update); };
  }, [style, app, glassIntensity]);

  React.useEffect(() => { setHapticsEnabled(haptics); }, [haptics]);
  React.useEffect(() => {
    let user = true;
    try { user = localStorage.getItem('cf-sounds') !== 'off'; } catch { /* storage may be unavailable */ }
    setSoundsEnabled(sounds && user);
  }, [sounds]);

  return (
    <Ctx.Provider value={{ platform, theme, reducedMotion, squircleNative, setAppearance: setApp }}>
      <LensFilter />
      {children}
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

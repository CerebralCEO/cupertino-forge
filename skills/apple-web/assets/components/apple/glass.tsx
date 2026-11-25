'use client';
import * as React from 'react';
import { cn } from '@/lib/cupertino/cn';
import { squircleMaskDataUrl } from '@/lib/cupertino/squircle';
import { useCupertino } from './root';

export type GlassVariant = 'regular' | 'clear' | 'large' | 'menu' | 'tinted';

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  /** capsule (default for controls), circle, or a radius token name like "alert", "popover", "menu" */
  shape?: 'capsule' | 'circle' | 'rect';
  radiusToken?: string;
  /** scale up and brighten on press (glass buttons) */
  pressable?: boolean;
  /** Chromium lens refraction. Max two per screen. */
  lens?: boolean;
  /** add 35 percent black dimming under clear glass over bright media */
  dim?: boolean;
  asChild?: boolean;
}

const SHADOW_VAR_BY_VARIANT: Record<GlassVariant, string> = {
  regular: 'var(--cf-glass-shadow)',
  clear: 'var(--cf-glass-clear-shadow)',
  large: 'var(--cf-glass-shadow)',
  menu: 'var(--cf-glass-menu-shadow)',
  tinted: 'var(--cf-glass-shadow)',
};

/**
 * Liquid Glass surface. Functional layer ONLY (bars, floating buttons, menus, popovers, alerts, partial sheets).
 * Never use on cards, rows or backgrounds. Never nest Glass in Glass: use overGlass fills for inner controls.
 */
export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(function Glass(
  { variant = 'regular', shape = 'capsule', radiusToken, pressable, lens, dim, asChild: _asChild, className, style, children, ...rest },
  ref
) {
  void _asChild;
  const { squircleNative } = useCupertino();
  const needsRectMask = shape === 'rect' && !squircleNative;
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const [maskUrl, setMaskUrl] = React.useState<string | undefined>();

  const setMergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      surfaceRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  React.useLayoutEffect(() => {
    if (!needsRectMask || !surfaceRef.current) { setMaskUrl(undefined); return; }
    const el = surfaceRef.current;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const px = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      setMaskUrl(squircleMaskDataUrl({ width, height, radius: px, smoothing: 0.6 }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [needsRectMask]);

  const radius =
    shape === 'capsule' ? '9999px' : shape === 'circle' ? '50%' : `var(--cf-radius-${radiusToken ?? 'popover'})`;

  if (needsRectMask && maskUrl) {
    return (
      <div style={{ borderRadius: radius, boxShadow: SHADOW_VAR_BY_VARIANT[variant] }}>
        <div
          ref={setMergedRef}
          data-variant={variant}
          data-pressable={pressable ? 'true' : undefined}
          data-lens={lens ? 'true' : undefined}
          className={cn('cf-glass squircle', className)}
          style={{
            borderRadius: radius,
            boxShadow: 'none',
            WebkitMaskImage: maskUrl,
            maskImage: maskUrl,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            ...style,
          }}
          {...rest}
        >
          {dim && <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]" style={{ background: 'var(--cf-dim-clear-glass)' }} />}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setMergedRef}
      data-variant={variant}
      data-pressable={pressable ? 'true' : undefined}
      data-lens={lens ? 'true' : undefined}
      className={cn('cf-glass', shape === 'rect' && 'squircle', className)}
      style={{ borderRadius: radius, ...style }}
      {...rest}
    >
      {dim && <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]" style={{ background: 'var(--cf-dim-clear-glass)' }} />}
      {children}
    </div>
  );
});

/** Groups several controls into one glass capsule (e.g. back + forward, or 3 toolbar actions). */
export function GlassGroup({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Glass className={cn('inline-flex items-center gap-0 p-0', className)} {...rest}>
      {children}
    </Glass>
  );
}

/** Soft blur and fade of content scrolling under top and bottom bars (replaces solid bar backgrounds). */
export function ScrollEdge({ edges = ['top', 'bottom'] }: { edges?: Array<'top' | 'bottom'> }) {
  return (
    <>
      {edges.includes('top') && <div aria-hidden className="cf-scroll-edge-top" />}
      {edges.includes('bottom') && <div aria-hidden className="cf-scroll-edge-bottom" />}
    </>
  );
}

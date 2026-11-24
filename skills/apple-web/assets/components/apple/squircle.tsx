'use client';
import * as React from 'react';
import { cn } from '@/lib/cupertino/cn';
import { squirclePath } from '@/lib/cupertino/squircle';
import { useCupertino } from './root';

export interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** radius token name (card, alert, popover, list-section-inset-grouped, thumbnail-small, ...) or a number in px from tokens */
  radius: string | number;
  smoothing?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'figure';
}

/**
 * Continuous corner container. Uses CSS corner-shape: squircle where supported,
 * otherwise measures itself and applies an SVG clip-path with Apple's corner smoothing.
 */
export function Squircle({ radius, smoothing = 0.6, as = 'div', className, style, children, ...rest }: SquircleProps) {
  const Tag = as as React.ElementType;
  const { squircleNative } = useCupertino();
  const ref = React.useRef<HTMLDivElement>(null);
  const [clip, setClip] = React.useState<string | undefined>();
  const r = typeof radius === 'number' ? `${radius}px` : `var(--cf-radius-${radius})`;

  React.useLayoutEffect(() => {
    if (squircleNative || !ref.current) { setClip(undefined); return; }
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const px = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      setClip(`path('${squirclePath({ width, height, radius: px, smoothing })}')`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [squircleNative, smoothing]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('squircle', className)}
      style={{ borderRadius: r, clipPath: clip, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

'use client';
import * as React from 'react';
import { cn } from '@/lib/cupertino/cn';
import { squircleMaskDataUrl } from '@/lib/cupertino/squircle';
import { useCupertino } from './root';

export interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** radius token name (card, alert, popover, list-section-inset-grouped, thumbnail-small, ...) or a number in px from tokens */
  radius: string | number;
  smoothing?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'figure';
}

const SHADOW_TOKEN_RE = /\bshadow-(?!none\b)\S+/g;

/**
 * Continuous corner container. Uses CSS corner-shape: squircle where supported,
 * otherwise measures itself and applies an SVG mask-image so outer box-shadow is never clipped.
 */
export const Squircle = React.forwardRef<HTMLDivElement, SquircleProps>(function Squircle(
  { radius, smoothing = 0.6, as = 'div', className, style, children, ...rest },
  forwardedRef
) {
  const Tag = as as React.ElementType;
  const { squircleNative } = useCupertino();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [maskUrl, setMaskUrl] = React.useState<string | undefined>();
  const r = typeof radius === 'number' ? `${radius}px` : `var(--cf-radius-${radius})`;

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  React.useLayoutEffect(() => {
    if (squircleNative || !innerRef.current) { setMaskUrl(undefined); return; }
    const el = innerRef.current;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const px = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      setMaskUrl(squircleMaskDataUrl({ width, height, radius: px, smoothing }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [squircleNative, smoothing]);

  const maskStyle: React.CSSProperties | undefined = maskUrl
    ? {
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
      }
    : undefined;

  const shadowClasses = !squircleNative && className ? className.match(SHADOW_TOKEN_RE) : null;
  const hasStyleShadow = !squircleNative && Boolean(style?.boxShadow && style.boxShadow !== 'none');

  if (!squircleNative && (shadowClasses?.length || hasStyleShadow)) {
    const innerClassName = shadowClasses?.length ? className?.replace(SHADOW_TOKEN_RE, '').trim() : className;
    const outerShadow = shadowClasses?.join(' ');
    const { boxShadow, ...innerStyle } = style ?? {};
    return (
      <div className={cn(outerShadow)} style={{ borderRadius: r, boxShadow }}>
        <Tag
          ref={setRefs as React.Ref<never>}
          className={cn('squircle', innerClassName)}
          style={{ borderRadius: r, ...innerStyle, ...maskStyle }}
          {...rest}
        >
          {children}
        </Tag>
      </div>
    );
  }

  return (
    <Tag
      ref={setRefs as React.Ref<never>}
      className={cn('squircle', className)}
      style={{ borderRadius: r, ...style, ...maskStyle }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

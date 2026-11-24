'use client';
import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

const stroke = { regular: 1.75, medium: 2, semibold: 2.25, bold: 2.5 } as const;
const scale = { small: 0.8, medium: 1, large: 1.3 } as const;

export interface IconProps {
  icon: LucideIcon;
  /** text size in px the icon sits next to (17 body iOS, 13 body macOS). Defaults to 1em of the parent. */
  textSize?: number;
  weight?: keyof typeof stroke;
  iconScale?: keyof typeof scale;
  label?: string; // set only when the icon is the only content of a control
  className?: string;
}

/** Lucide icon sized and weighted like an SF Symbol next to text. */
export function Icon({ icon: I, textSize, weight = 'regular', iconScale = 'medium', label, className }: IconProps) {
  const size = textSize ? Math.round(textSize * scale[iconScale]) : undefined;
  const sw = size !== undefined && size <= 16 ? 2 : stroke[weight];
  return (
    <I
      aria-hidden={label ? undefined : true}
      aria-label={label}
      size={size ?? '1em'}
      strokeWidth={sw}
      absoluteStrokeWidth={false}
      className={className}
      style={{ flexShrink: 0, verticalAlign: '-0.125em' }}
    />
  );
}

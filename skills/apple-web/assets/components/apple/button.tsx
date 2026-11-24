'use client';
import * as React from 'react';
import { cn } from '@/lib/cupertino/cn';
import { ActivityIndicator } from './feedback';

export type ButtonVariant = 'prominentGlass' | 'glass' | 'filled' | 'tinted' | 'gray' | 'plain' | 'destructive' | 'destructiveFilled';
export type ButtonSize = 'mini' | 'small' | 'medium' | 'large' | 'xl';

const sizeCls: Record<ButtonSize, string> = {
  mini: 'h-[var(--cf-control-mini)] px-2.5 text-caption1 emphasized gap-1',
  small: 'h-[var(--cf-control-small)] px-3 text-subheadline emphasized gap-1.5',
  medium: 'h-[var(--cf-control-medium)] px-3.5 text-body emphasized gap-1.5',
  large: 'h-[var(--cf-control-large)] px-5 text-body emphasized gap-2',
  xl: 'h-[var(--cf-control-extra-large)] px-6 text-body emphasized gap-2',
};

const variantCls: Record<ButtonVariant, string> = {
  prominentGlass: 'text-accent-contrast',
  glass: 'text-label-glass',
  filled: 'bg-accent text-accent-contrast cf-press',
  tinted: 'bg-[color-mix(in_srgb,var(--cf-accent)_15%,transparent)] text-accent cf-press',
  gray: 'bg-fill-3 text-label cf-press',
  plain: 'bg-transparent text-accent cf-press-plain px-0',
  destructive: 'bg-transparent text-red cf-press-plain px-0',
  destructiveFilled: 'bg-red text-white cf-press',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Apple button. ONE prominent (prominentGlass or filled) per view.
 * Glass variants belong on bars and over content; filled, tinted, gray, plain belong inside content.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'gray', size = 'medium', loading, loadingLabel, icon, fullWidth, className, children, disabled, ...rest },
  ref
) {
  const isGlass = variant === 'glass' || variant === 'prominentGlass';
  const inner = (
    <>
      {loading ? <ActivityIndicator size="small" className="text-current" /> : icon}
      {children !== undefined && <span className="truncate">{loading && loadingLabel ? loadingLabel : children}</span>}
    </>
  );
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      data-variant={variant === 'prominentGlass' ? 'tinted' : variant}
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-capsule outline-none',
        'focus-visible:focus-ring disabled:opacity-40',
        sizeCls[size],
        !isGlass && variantCls[variant],
        isGlass && 'cf-glass',
        fullWidth && 'w-full',
        // extend the hit area to at least 44 (iOS) for mini and small sizes
        (size === 'mini' || size === 'small') && "after:absolute after:-inset-x-1 after:-inset-y-2 after:content-['']",
        className
      )}
      data-pressable={isGlass ? 'true' : undefined}
      {...rest}
    >
      {inner}
    </button>
  );
});

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // required accessible name
  icon: React.ReactNode;
  variant?: 'glass' | 'prominentGlass' | 'plain' | 'gray';
  size?: 'small' | 'medium' | 'large';
}

const iconSize = { small: 'size-8', medium: 'size-11', large: 'size-[50px]' } as const;

/** Icon only button: 44 glass circle by default (bar buttons, close, more). */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'glass', size = 'medium', className, ...rest },
  ref
) {
  const glass = variant === 'glass' || variant === 'prominentGlass';
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full text-[19px] outline-none focus-visible:focus-ring disabled:opacity-40',
        iconSize[size],
        glass ? 'cf-glass' : variant === 'gray' ? 'bg-fill-3 text-label cf-press' : 'text-accent cf-press-plain',
        variant === 'glass' && 'text-label-glass',
        variant === 'prominentGlass' && 'text-accent-contrast',
        className
      )}
      data-pressable={glass ? 'true' : undefined}
      data-variant={variant === 'prominentGlass' ? 'tinted' : undefined}
      {...rest}
    >
      {icon}
    </button>
  );
});

'use client';
import * as React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cupertino/cn';
import { Glass, ScrollEdge } from './glass';
import { IconButton } from './button';

export interface NavBarProps {
  title: string;
  /** show a large title that collapses into the inline title on scroll */
  large?: boolean;
  back?: { label: string; onBack: () => void };
  leading?: React.ReactNode;
  trailing?: React.ReactNode; // BarButtonGroup or a single prominent IconButton
  /** element that scrolls; defaults to window */
  scrollRef?: React.RefObject<HTMLElement | null>;
  subtitle?: string;
}

/**
 * iOS 27 navigation bar: transparent, content scrolls beneath with scroll edge effect,
 * glass circles and capsule groups for buttons, large title that collapses.
 */
export function NavBar({ title, large = true, back, leading, trailing, scrollRef, subtitle }: NavBarProps) {
  const { scrollY } = useScroll(scrollRef ? { container: scrollRef as React.RefObject<HTMLElement> } : undefined);
  const inlineOpacity = useTransform(scrollY, large ? [28, 44] : [0, 1], [0, 1]);
  const largeOpacity = useTransform(scrollY, [0, 28], [1, 0]);

  return (
    <>
      <ScrollEdge edges={['top']} />
      <header className="fixed inset-x-0 top-0 z-20 pt-[env(safe-area-inset-top)]">
        <div className="relative mx-auto flex h-[var(--cf-bar-height)] items-center justify-between px-lg">
          <div className="flex min-w-11 items-center gap-sm">
            {back && <IconButton label={back.label} icon={<ChevronLeft strokeWidth={2.25} size={22} />} onClick={back.onBack} />}
            {leading}
          </div>
          {large ? (
            <motion.span aria-hidden style={{ opacity: inlineOpacity }} className="pointer-events-none absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate text-headline text-label">
              {title}
            </motion.span>
          ) : (
            <motion.h1 style={{ opacity: inlineOpacity }} className="pointer-events-none absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate text-headline text-label">
              {title}
            </motion.h1>
          )}
          <div className="flex min-w-11 items-center justify-end gap-sm">{trailing}</div>
        </div>
      </header>
      <div aria-hidden className="h-[calc(env(safe-area-inset-top)+var(--cf-bar-height))]" />
      {large && (
        <motion.div style={{ opacity: largeOpacity }} className="px-lg pb-2">
          <LargeTitle subtitle={subtitle}>{title}</LargeTitle>
        </motion.div>
      )}
    </>
  );
}

export function LargeTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-large-title [font-weight:var(--cf-text-large-title-weight-em)] text-label">{children}</h1>
      {subtitle && <p className="text-subheadline text-label-2">{subtitle}</p>}
    </div>
  );
}

/** Groups 2 or 3 icon actions into one glass capsule. */
export function BarButtonGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Glass role="group" aria-label={label} className="flex h-11 items-center px-1">
      {React.Children.map(children, (c) => (
        <div className="flex size-11 items-center justify-center">{c}</div>
      ))}
    </Glass>
  );
}

/** Icon inside a BarButtonGroup (no own glass). */
export function BarButton({ label, icon, onClick, disabled }: { label: string; icon: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className="cf-press flex size-11 items-center justify-center rounded-full text-[length:var(--cf-glyph-bar)] text-label-glass outline-none focus-visible:focus-ring disabled:text-label-3">
      {icon}
    </button>
  );
}

/** Bottom floating toolbar of glass groups (screens without a tab bar). */
export function Toolbar({ leading, trailing, center }: { leading?: React.ReactNode; center?: React.ReactNode; trailing?: React.ReactNode }) {
  return (
    <>
      <ScrollEdge edges={['bottom']} />
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between px-lg pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <div className="flex gap-sm">{leading}</div>
        <div>{center}</div>
        <div className="flex gap-sm">{trailing}</div>
      </div>
    </>
  );
}
export const ToolbarGroup = BarButtonGroup;

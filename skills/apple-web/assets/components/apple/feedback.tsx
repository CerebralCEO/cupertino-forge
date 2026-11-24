'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';

/** System style 8 spoke activity indicator. Show only after 300ms of waiting (use useDelayedFlag). */
export function ActivityIndicator({ size = 'medium', className, label = 'Loading' }: { size?: 'small' | 'medium' | 'large'; className?: string; label?: string }) {
  const px = size === 'small' ? 16 : size === 'medium' ? 20 : 37;
  return (
    <span role="progressbar" aria-label={label} className={cn('inline-block text-label-2', className)} style={{ width: px, height: px }}>
      <svg viewBox="0 0 24 24" width={px} height={px} style={{ animation: 'cf-spin 1s steps(8) infinite' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="11" y="2" width="2.2" height="6" rx="1.1" fill="currentColor" opacity={0.25 + (i / 8) * 0.75} transform={`rotate(${i * 45} 12 12)`} />
        ))}
      </svg>
      <style>{'@keyframes cf-spin{to{transform:rotate(360deg)}}'}</style>
    </span>
  );
}

/** Returns true only after `ms` of `active` being true. Avoids spinner flicker. */
export function useDelayedFlag(active: boolean, ms = 300) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!active) { setOn(false); return; }
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return on;
}

export function ProgressBar({ value, className, label }: { value: number; className?: string; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}
      className={cn('h-1 w-full overflow-hidden rounded-capsule bg-fill-3', className)}>
      <motion.div className="h-full rounded-capsule bg-accent" initial={false} animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} transition={spring('smooth')} />
    </div>
  );
}

/** Small glass capsule at top center for background events (Copied, Saved). 1.5s, no stacking. */
export function Hud({ show, icon, children }: { show: boolean; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={spring('snappy')}
          className="cf-glass fixed left-1/2 top-[calc(env(safe-area-inset-top)+8px)] z-[70] flex -translate-x-1/2 items-center gap-2 rounded-capsule px-4 py-2.5 text-subheadline emphasized text-label-glass"
        >
          {icon}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface EmptyStateProps { icon: React.ReactNode; title: string; message?: string; action?: React.ReactNode; className?: string }

/** Centered empty, error or no results state (patterns/states.md). */
export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn('mx-auto flex min-h-[50dvh] max-w-[300px] flex-col items-center justify-center gap-2 px-lg text-center', className)}>
      <div className="mb-2 text-[56px] text-label-3 [:root[data-cf-platform=macos]_&]:text-[48px]">{icon}</div>
      <h2 className="text-title2 emphasized text-label">{title}</h2>
      {message && <p className="text-body text-label-2">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

'use client';
import * as React from 'react';
import * as P from '@radix-ui/react-popover';
import * as T from '@radix-ui/react-tooltip';
import { motion } from 'motion/react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { useCupertino } from './root';

/** Glass large popover anchored to its source (8 gap). macOS shows an arrow. */
export function Popover({ trigger, children, side = 'bottom', className }: { trigger: React.ReactNode; children: React.ReactNode; side?: 'top' | 'bottom' | 'left' | 'right'; className?: string }) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  return (
    <P.Root>
      <P.Trigger asChild>{trigger}</P.Trigger>
      <P.Portal>
        <P.Content side={side} sideOffset={8} asChild>
          <motion.div
            data-cf-elevated data-variant="large"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring('popover')}
            style={{ transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
            className={cn('cf-glass squircle z-40 rounded-popover p-lg outline-none', className)}
          >
            {children}
            {mac && <P.Arrow width={18} height={9} style={{ fill: 'var(--cf-glass-large-bg)' }} />}
          </motion.div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/** macOS tooltip: 1000ms delay (provided at CupertinoRoot), small rect, caption1. Every icon only toolbar button gets one. */
export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content sideOffset={6} data-cf-elevated className="squircle z-[70] rounded-tooltip bg-bg-3 px-2 py-1 text-caption1 text-label shadow-popover">
          {label}
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}

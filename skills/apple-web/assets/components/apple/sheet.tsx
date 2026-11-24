'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'motion/react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { haptic } from '@/lib/cupertino/haptics';

export type Detent = 'medium' | 'large';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** leading action, normally Cancel */
  leading?: React.ReactNode;
  /** trailing action, normally a prominent glass IconButton (checkmark) or Done */
  trailing?: React.ReactNode;
  detents?: Detent[];
  initialDetent?: Detent;
  children: React.ReactNode;
}

const DETENT_VH: Record<Detent, number> = { medium: 52, large: 94 };

/**
 * iOS sheet with detents. Medium floats inset with large glass and radius 38; large is solid elevated bg with device radius.
 * Drag down to dismiss (velocity 600 or 40 percent). Content behind does not shrink (iOS 26+).
 */
export function Sheet({ open, onOpenChange, title, leading, trailing, detents = ['large'], initialDetent, children }: SheetProps) {
  const [detent, setDetent] = React.useState<Detent>(initialDetent ?? detents[0]);
  const drag = useDragControls();
  React.useEffect(() => { if (open) setDetent(initialDetent ?? detents[0]); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const h = (window.innerHeight * DETENT_VH[detent]) / 100;
    if (info.velocity.y > 600 || info.offset.y > h * 0.4) {
      const smaller = detents.indexOf(detent) > 0 ? detents[detents.indexOf(detent) - 1] : null;
      if (smaller && info.offset.y < h * 0.7) { setDetent(smaller); haptic('light'); } else onOpenChange(false);
    } else if (info.velocity.y < -600 || info.offset.y < -60) {
      const bigger = detents[detents.indexOf(detent) + 1];
      if (bigger) { setDetent(bigger); haptic('light'); }
    }
  };
  const medium = detent === 'medium';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-50 bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: medium ? 0.4 : 1 }} exit={{ opacity: 0 }} transition={spring('sheet')} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                data-cf-elevated
                drag="y" dragControls={drag} dragListener={false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.05, bottom: 0.6 }}
                onDragEnd={onDragEnd}
                initial={{ y: '100%' }} animate={{ y: 0, height: `${DETENT_VH[detent]}dvh` }} exit={{ y: '100%' }}
                transition={spring('sheet')}
                className={cn('fixed z-50 flex flex-col overflow-hidden outline-none squircle',
                  medium ? 'cf-glass inset-x-2 bottom-2 rounded-[38px]' : 'inset-x-0 bottom-0 rounded-t-[var(--cf-radius-device-display,38px)] bg-bg shadow-sheet')}
                data-variant={medium ? 'large' : undefined}
              >
                <div onPointerDown={(e) => drag.start(e)} className="flex shrink-0 cursor-grab touch-none flex-col">
                  <span aria-hidden className="mx-auto mt-[5px] h-[5px] w-9 rounded-capsule bg-fill" />
                  {(title || leading || trailing) && (
                    <div className="relative flex h-[var(--cf-bar-height)] items-center justify-between px-lg">
                      <div className="min-w-11">{leading}</div>
                      <Dialog.Title className="absolute left-1/2 -translate-x-1/2 text-headline text-label">{title}</Dialog.Title>
                      <div className="flex min-w-11 justify-end">{trailing}</div>
                    </div>
                  )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

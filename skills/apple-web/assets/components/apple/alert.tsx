'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { haptic } from '@/lib/cupertino/haptics';
import { useCupertino } from './root';

export interface AlertAction { label: string; role?: 'cancel' | 'destructive' | 'default'; onPress?: () => void }
export interface AlertProps { open: boolean; onOpenChange: (o: boolean) => void; title: string; message?: string; actions: AlertAction[]; icon?: React.ReactNode }

/**
 * iOS: large glass panel 300 wide, radius 34, capsule glass buttons (2 side by side, 3 stacked).
 * macOS: 16 radius, app icon on top, buttons stacked full width. Default action is tinted and answers Return.
 * Never use for success messages. Button labels are verbs, never Yes or No.
 */
export function Alert({ open, onOpenChange, title, message, actions, icon }: AlertProps) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  const prevFocusRef = React.useRef<HTMLElement | null>(null);
  const wasOpenRef = React.useRef(false);
  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      prevFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (!open && wasOpenRef.current) {
      const target = prevFocusRef.current;
      prevFocusRef.current = null;
      if (target && target.isConnected) requestAnimationFrame(() => target.focus());
    }
    wasOpenRef.current = open;
    if (open && actions.some((a) => a.role === 'destructive')) haptic('warning');
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const stacked = mac || actions.length > 2;
  const ordered = mac ? [...actions].sort((a, b) => (a.role === 'default' ? -1 : b.role === 'default' ? 1 : 0)) : actions;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-[60] bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount role="alertdialog"
              onKeyDown={(e) => { if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) { const d = actions.find((a) => a.role === 'default'); if (d) { d.onPress?.(); onOpenChange(false); } } }}>
              <motion.div
                data-cf-elevated data-variant="large"
                initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={spring('popover')}
                className={cn('cf-glass squircle fixed left-1/2 top-1/2 z-[60] flex w-[var(--cf-alert-w)] -translate-x-1/2 -translate-y-1/2 flex-col p-xl text-center outline-none rounded-alert',
                  mac ? 'gap-md' : 'gap-lg')}
              >
                {mac && icon && <div className="mx-auto size-16">{icon}</div>}
                <div className="flex flex-col gap-1">
                  <Dialog.Title className="text-headline text-label">{title}</Dialog.Title>
                  {message && <Dialog.Description className={cn(mac ? 'text-body' : 'text-footnote', 'text-label-2')}>{message}</Dialog.Description>}
                </div>
                <div className={cn('flex gap-sm', stacked ? 'flex-col' : 'flex-row')}>
                  {ordered.map((a) => (
                    <button key={a.label} type="button"
                      autoFocus={a.role === 'default'}
                      onClick={() => { a.onPress?.(); onOpenChange(false); }}
                      className={cn('cf-press flex flex-1 items-center justify-center rounded-capsule text-body outline-none focus-visible:focus-ring',
                        mac ? 'h-[var(--cf-control-large)]' : 'h-12',
                        a.role === 'default' ? 'bg-accent text-accent-contrast emphasized' : 'bg-fill-3',
                        a.role === 'destructive' ? 'text-red emphasized' : a.role !== 'default' && 'text-label')}
                    >{a.label}</button>
                  ))}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/** iOS confirmation dialog for destructive choices, anchored at the bottom on phones. */
export function ConfirmationDialog({ open, onOpenChange, title, actions }: { open: boolean; onOpenChange: (o: boolean) => void; title?: string; actions: AlertAction[] }) {
  const cancel = actions.find((a) => a.role === 'cancel') ?? { label: 'Cancel', role: 'cancel' as const };
  const rest = actions.filter((a) => a.role !== 'cancel');
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-[60] bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring('sheet')} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div data-cf-elevated initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={spring('sheet')}
                className="fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+8px)] z-[60] flex flex-col gap-sm outline-none">
                <div className="cf-glass squircle overflow-hidden rounded-alert" data-variant="large">
                  {title && <Dialog.Title className="px-lg py-3 text-center text-footnote text-label-2">{title}</Dialog.Title>}
                  {rest.map((a) => (
                    <button key={a.label} type="button" onClick={() => { a.onPress?.(); onOpenChange(false); }}
                      className={cn('flex h-14 w-full items-center justify-center text-body active:bg-fill-4', 'shadow-[inset_0_0.5px_0_var(--cf-separator)]', a.role === 'destructive' ? 'text-red' : 'text-accent')}>{a.label}</button>
                  ))}
                </div>
                <button type="button" onClick={() => { cancel.onPress?.(); onOpenChange(false); }} className="cf-glass squircle h-14 rounded-alert text-body emphasized text-accent" data-variant="large">{cancel.label}</button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

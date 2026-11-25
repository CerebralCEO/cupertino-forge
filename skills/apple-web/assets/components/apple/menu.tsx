'use client';
import * as React from 'react';
import * as DM from '@radix-ui/react-dropdown-menu';
import * as CM from '@radix-ui/react-context-menu';
import { motion } from 'motion/react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { haptic } from '@/lib/cupertino/haptics';
import { useCupertino } from './root';

/** iOS: glass panel growing from its button, 44 rows, icon trailing. macOS: kit menu glass, 24 rows, accent highlight, shortcuts. */
export function Menu({ trigger, children, align = 'end' }: { trigger: React.ReactNode; children: React.ReactNode; align?: 'start' | 'center' | 'end' }) {
  return (
    <DM.Root>
      <DM.Trigger asChild>{trigger}</DM.Trigger>
      <DM.Portal>
        <DM.Content align={align} sideOffset={8} asChild>
          <MenuPanel>{children}</MenuPanel>
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

const MenuPanel = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(function MenuPanel({ children, ...rest }, ref) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  return (
    <motion.div
      ref={ref} {...rest}
      data-cf-elevated
      data-variant={mac ? 'menu' : 'large'}
      initial={mac ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={mac ? { duration: 0.1 } : spring('popover')}
      style={{ transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin, var(--radix-context-menu-content-transform-origin))' }}
      className={cn('cf-glass squircle z-40 overflow-hidden outline-none', mac ? 'min-w-[var(--cf-menu-min-w)] rounded-menu p-[var(--cf-menu-pad)]' : 'w-[var(--cf-menu-ios-w)] rounded-menu py-1')}
    >
      {children}
    </motion.div>
  );
});

export interface MenuItemProps { label: string; icon?: React.ReactNode; shortcut?: string; destructive?: boolean; checked?: boolean; disabled?: boolean; onSelect?: () => void }

export function MenuItem({ label, icon, shortcut, destructive, checked, disabled, onSelect }: MenuItemProps) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  return (
    <DM.Item disabled={disabled} onSelect={() => onSelect?.()}
      className={cn('flex select-none items-center outline-none',
        mac ? 'h-6 gap-1.5 rounded-menu-item-highlight px-2.5 text-body data-[highlighted]:bg-accent data-[highlighted]:text-white' :
              'h-11 gap-3 px-lg text-body data-[highlighted]:bg-fill-4',
        destructive ? 'text-red' : 'text-label', disabled && 'text-label-3')}>
      {mac && <span className="w-3.5 shrink-0">{checked && <Check size={13} strokeWidth={2.5} />}</span>}
      {mac && icon && <span className="shrink-0 text-[length:var(--cf-glyph-mac-menu)]">{icon}</span>}
      {!mac && checked && <Check size={17} strokeWidth={2.5} className="shrink-0" />}
      <span className="flex-1 truncate">{label}</span>
      {mac && shortcut && <span className="text-label-2 [[data-highlighted]_&]:text-white">{shortcut}</span>}
      {!mac && icon && <span className="shrink-0 text-[length:var(--cf-glyph-bar)]">{icon}</span>}
    </DM.Item>
  );
}

export function MenuSection({ children }: { children: React.ReactNode }) {
  const { platform } = useCupertino();
  return (
    <>
      <DM.Group>{children}</DM.Group>
      <DM.Separator className={cn('last:hidden', platform === 'macos' ? 'mx-2.5 my-1 h-[var(--cf-hairline)] bg-separator' : 'my-1 h-2 bg-fill-4')} />
    </>
  );
}

export function SubMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DM.Sub>
      <DM.SubTrigger className="flex h-6 items-center gap-1.5 rounded-menu-item-highlight px-2.5 text-body text-label outline-none data-[highlighted]:bg-accent data-[highlighted]:text-white">
        <span className="w-3.5" /><span className="flex-1">{label}</span><ChevronRight size={12} strokeWidth={2.5} />
      </DM.SubTrigger>
      <DM.Portal><DM.SubContent sideOffset={4} asChild><MenuPanel>{children}</MenuPanel></DM.SubContent></DM.Portal>
    </DM.Sub>
  );
}

/** Long press (touch) or right click: lifts the target, medium haptic, glass menu. */
export function ContextMenu({ children, items }: { children: React.ReactNode; items: MenuItemProps[] }) {
  return (
    <CM.Root onOpenChange={(o) => { if (o) haptic('medium'); }}>
      <CM.Trigger asChild>{children}</CM.Trigger>
      <CM.Portal>
        <CM.Content asChild>
          <MenuPanel>
            {items.map((it) => (
              <CM.Item key={it.label} disabled={it.disabled} onSelect={() => it.onSelect?.()}
                className={cn('flex h-11 select-none items-center gap-3 px-lg text-body outline-none data-[highlighted]:bg-fill-4 [:root[data-cf-platform=macos]_&]:h-6 [:root[data-cf-platform=macos]_&]:rounded-menu-item-highlight [:root[data-cf-platform=macos]_&]:px-2.5 [:root[data-cf-platform=macos]_&]:data-[highlighted]:bg-accent [:root[data-cf-platform=macos]_&]:data-[highlighted]:text-white',
                  it.destructive ? 'text-red' : 'text-label')}>
                <span className="flex-1 truncate">{it.label}</span>
                {it.icon && <span className="shrink-0">{it.icon}</span>}
              </CM.Item>
            ))}
          </MenuPanel>
        </CM.Content>
      </CM.Portal>
    </CM.Root>
  );
}

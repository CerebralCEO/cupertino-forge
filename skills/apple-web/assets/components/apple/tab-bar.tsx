'use client';
import * as React from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { haptic } from '@/lib/cupertino/haptics';
import { Glass } from './glass';

export interface TabItem { id: string; label: string; icon: React.ReactNode; iconSelected?: React.ReactNode }

export interface TabBarProps {
  items: TabItem[]; // 2 to 5
  selected: string;
  onSelect: (id: string) => void;
  /** separate circular glass search button at the trailing side */
  search?: { label: string; icon: React.ReactNode; onPress: () => void };
  minimizeOnScroll?: boolean;
}

/** iOS 27 floating Liquid Glass tab bar with sliding selection capsule and minimize on scroll. */
export function TabBar({ items, selected, onSelect, search, minimizeOnScroll = true }: TabBarProps) {
  const [mini, setMini] = React.useState(false);
  const { scrollY } = useScroll();
  const last = React.useRef(0);
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!minimizeOnScroll) return;
    const dy = y - last.current;
    if (Math.abs(dy) > 6) setMini(dy > 0 && y > 80);
    last.current = y;
  });
  const current = items.find((i) => i.id === selected) ?? items[0];

  return (
    <nav aria-label="Tabs" className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-center gap-sm px-[var(--cf-space-xl)] pb-[max(env(safe-area-inset-bottom),12px)]">
      <motion.div layout transition={spring('glassMorph')} className="pointer-events-auto">
        <Glass lens className="flex h-[var(--cf-tabbar-height)] items-center p-1" role="tablist">
          {(mini ? [current] : items).map((it) => {
            const active = it.id === selected;
            return (
              <button
                key={it.id}
                role="tab"
                aria-selected={active}
                onClick={() => { if (mini) { setMini(false); return; } if (!active) { onSelect(it.id); haptic('selection'); } }}
                className={cn('relative flex h-full min-w-14 flex-col items-center justify-center gap-0.5 rounded-capsule px-3 outline-none focus-visible:focus-ring', active ? 'text-accent' : 'text-label-glass')}
              >
                {active && !mini && (
                  <motion.span layoutId="cf-tab-sel" transition={spring('snappy')} className="absolute inset-0 rounded-capsule bg-fill-3" />
                )}
                <span className="relative text-[24px] leading-none">{active && it.iconSelected ? it.iconSelected : it.icon}</span>
                {!mini && <span className="relative text-caption2 emphasized">{it.label}</span>}
              </button>
            );
          })}
        </Glass>
      </motion.div>
      {search && (
        <Glass pressable shape="circle" className="pointer-events-auto flex size-[var(--cf-tabbar-height)] items-center justify-center">
          <button aria-label={search.label} onClick={search.onPress} className="flex size-full items-center justify-center rounded-full text-[22px] text-label-glass outline-none focus-visible:focus-ring">
            {search.icon}
          </button>
        </Glass>
      )}
    </nav>
  );
}

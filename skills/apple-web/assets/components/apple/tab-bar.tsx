'use client';
import * as React from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { haptic } from '@/lib/cupertino/haptics';
import { Glass } from './glass';
import { useCupertino } from './root';

export interface TabItem { id: string; label: string; icon: React.ReactNode; iconSelected?: React.ReactNode }

export interface TabBarProps {
  items: TabItem[]; // 2 to 5
  selected: string;
  onSelect: (id: string) => void;
  /** separate circular glass search button at the trailing side */
  search?: { label: string; icon: React.ReactNode; onPress: () => void };
  minimizeOnScroll?: boolean;
}

/** iOS 27 floating Liquid Glass tab bar with sliding inner glass capsule, RTL-aware keyboard nav, and minimize on scroll. */
export function TabBar({ items, selected, onSelect, search, minimizeOnScroll = true }: TabBarProps) {
  const { reducedMotion } = useCupertino();
  const [mini, setMini] = React.useState(false);
  const { scrollY } = useScroll();
  const last = React.useRef(0);
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!minimizeOnScroll) return;
    const dy = y - last.current;
    if (Math.abs(dy) > 6) setMini(dy > 0 && y > 80);
    last.current = y;
  });
  const visibleItems = mini ? [items.find((i) => i.id === selected) ?? items[0]] : items;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (mini || visibleItems.length <= 1) return;
    const isRtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let nextIdx = -1;
    if (e.key === 'ArrowRight') nextIdx = (idx + (isRtl ? -1 : 1) + visibleItems.length) % visibleItems.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx + (isRtl ? 1 : -1) + visibleItems.length) % visibleItems.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = visibleItems.length - 1;
    if (nextIdx >= 0) {
      e.preventDefault();
      const target = visibleItems[nextIdx];
      tabRefs.current[nextIdx]?.focus();
      if (target && target.id !== selected) {
        onSelect(target.id);
        haptic('selection');
      }
    }
  };

  return (
    <nav aria-label="Tabs" className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-center gap-sm px-[var(--cf-space-xl)] pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="pointer-events-auto">
        <Glass lens className="flex h-[var(--cf-tabbar-height)] items-center p-1" role="tablist">
          {visibleItems.map((it, idx) => {
            const active = it.id === selected;
            return (
              <button
                key={it.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onClick={() => { if (mini) { setMini(false); return; } if (!active) { onSelect(it.id); haptic('selection'); } }}
                className={cn('relative flex h-full min-w-14 flex-col items-center justify-center gap-0.5 rounded-capsule px-3 outline-none focus-visible:focus-ring', active ? 'text-accent' : 'text-label-glass')}
              >
                {active && !mini && (
                  <motion.span
                    layoutId="cf-tab-sel"
                    transition={reducedMotion ? { duration: 0.15 } : spring('snappy')}
                    className="cf-glass-capsule-active absolute inset-0 rounded-capsule"
                  />
                )}
                <span className="relative text-[length:var(--cf-glyph-tab)] leading-none">{active && it.iconSelected ? it.iconSelected : it.icon}</span>
                {!mini && <span className="relative text-caption2 emphasized">{it.label}</span>}
              </button>
            );
          })}
        </Glass>
      </div>
      {search && (
        <Glass pressable shape="circle" className="pointer-events-auto flex size-[var(--cf-tabbar-height)] items-center justify-center">
          <button type="button" aria-label={search.label} onClick={search.onPress} className="flex size-full items-center justify-center rounded-full text-[length:var(--cf-glyph-search)] text-label-glass outline-none focus-visible:focus-ring">
            {search.icon}
          </button>
        </Glass>
      )}
    </nav>
  );
}

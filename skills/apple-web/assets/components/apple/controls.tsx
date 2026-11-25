'use client';
import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cupertino/cn';
import { spring } from '@/styles/cupertino/cupertino.tokens';
import { haptic } from '@/lib/cupertino/haptics';
import { playSound } from '@/lib/cupertino/sounds';
import { useCupertino } from './root';

// ---------- Toggle ----------
export interface ToggleProps { checked: boolean; onCheckedChange: (v: boolean) => void; label: string; disabled?: boolean; color?: 'accent' | 'green' }

/** iOS 26+ switch (64 by 28, pill knob that turns to glass and stretches while pressed). macOS style uses 38 by 22. */
export function Toggle({ checked, onCheckedChange, label, disabled, color = 'accent' }: ToggleProps) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  const [pressed, setPressed] = React.useState(false);
  const W = mac ? 38 : 64, H = mac ? 22 : 28, KW = mac ? 20 : 38, KH = mac ? 20 : 24, I = mac ? 1 : 2;
  const knobW = pressed && !mac ? KW * 1.25 : KW;
  const x = checked ? W - knobW - I : I;
  return (
    <SwitchPrimitive.Root
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onCheckedChange={(v) => { onCheckedChange(v); if (!haptic('selection')) playSound(v ? 'toggle-on' : 'toggle-off'); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={cn('relative shrink-0 rounded-capsule outline-none transition-colors duration-[var(--cf-dur-color)] focus-visible:focus-ring disabled:opacity-40',
        checked ? (color === 'green' ? 'bg-green' : 'bg-accent') : 'bg-fill')}
      style={{ width: W, height: H }}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          className={cn('absolute top-0 block rounded-capsule bg-white shadow-knob', pressed && !mac && 'cf-glass')}
          style={{ height: KH, top: (H - KH) / 2 }}
          initial={false}
          animate={{ x, width: knobW }}
          transition={spring('snappy')}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

// ---------- Slider ----------
export interface SliderProps { value: number; onValueChange: (v: number) => void; min?: number; max?: number; step?: number; label: string; minIcon?: React.ReactNode; maxIcon?: React.ReactNode; disabled?: boolean }

export function Slider({ value, onValueChange, min = 0, max = 1, step = 0.01, label, minIcon, maxIcon, disabled }: SliderProps) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  const [drag, setDrag] = React.useState(false);
  const lastDetent = React.useRef(value);
  return (
    <div className="flex w-full items-center gap-md text-label-2">
      {minIcon}
      <SliderPrimitive.Root
        className="relative flex h-11 flex-1 touch-none select-none items-center"
        value={[value]} min={min} max={max} step={step} disabled={disabled}
        onValueChange={([v]) => {
          onValueChange(v);
          if ((v === min || v === max) && lastDetent.current !== v) haptic('light');
          lastDetent.current = v;
        }}
        onPointerDown={() => setDrag(true)} onPointerUp={() => setDrag(false)}
        aria-label={label}
      >
        <SliderPrimitive.Track className={cn('relative grow overflow-hidden rounded-capsule bg-fill-3', mac ? 'h-1' : 'h-1.5')}>
          <SliderPrimitive.Range className="absolute h-full rounded-capsule bg-accent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb asChild>
          <motion.span
            className={cn('block rounded-capsule bg-white shadow-knob outline-none focus-visible:focus-ring', drag && !mac && 'cf-glass')}
            style={{ width: mac ? 20 : 38, height: mac ? 20 : 24 }}
            animate={{ scale: drag && !mac ? 1.15 : 1 }}
            transition={spring(drag ? 'press' : 'release')}
          />
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      {maxIcon}
    </div>
  );
}

// ---------- Segmented control ----------
export interface SegmentedProps<T extends string> { options: { value: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; label: string; size?: 'regular' | 'small' }

export function SegmentedControl<T extends string>({ options, value, onChange, label, size = 'regular' }: SegmentedProps<T>) {
  const { platform } = useCupertino();
  const id = React.useId();
  const h = platform === 'macos' ? 'h-[var(--cf-control-regular)]' : size === 'small' ? 'h-8' : 'h-9';
  return (
    <div role="tablist" aria-label={label} className={cn('relative inline-flex w-full items-stretch rounded-capsule bg-fill-3 p-0.5', h)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} role="tab" aria-selected={active}
            onClick={() => { if (!active) { onChange(o.value); haptic('selection'); } }}
            className={cn('relative flex flex-1 items-center justify-center rounded-capsule px-3 text-subheadline outline-none focus-visible:focus-ring [:root[data-cf-platform=macos]_&]:text-body', active ? 'emphasized text-label' : 'text-label')}>
            {active && <motion.span layoutId={`seg-${id}`} transition={spring('snappy')} className="absolute inset-0 rounded-capsule bg-bg shadow-knob [:root[data-theme=dark]_&]:bg-gray3" />}
            <span className="relative truncate">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Stepper ----------
export function Stepper({ value, onChange, min = 0, max = 99, step = 1, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label: string }) {
  const set = (v: number) => { const n = Math.max(min, Math.min(max, v)); if (n !== value) { onChange(n); haptic('selection'); } };
  return (
    <div role="group" aria-label={label} className="inline-flex h-8 w-[94px] items-center rounded-capsule bg-fill-3 text-label">
      <button aria-label="Decrement" disabled={value <= min} onClick={() => set(value - step)} className="cf-press flex h-full flex-1 items-center justify-center rounded-l-capsule outline-none focus-visible:focus-ring disabled:text-label-3"><Minus size={18} strokeWidth={2.25} /></button>
      <span aria-hidden className="h-[18px] w-[0.5px] bg-separator" />
      <button aria-label="Increment" disabled={value >= max} onClick={() => set(value + step)} className="cf-press flex h-full flex-1 items-center justify-center rounded-r-capsule outline-none focus-visible:focus-ring disabled:text-label-3"><Plus size={18} strokeWidth={2.25} /></button>
    </div>
  );
}

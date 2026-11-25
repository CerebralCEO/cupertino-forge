'use client';
import * as React from 'react';
import { Check, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cupertino/cn';
import { TextField } from './fields';

/* ------------------------------------------------------------------
   macOS 27 app shell for web and Tauri.
   MacWindow
     MacToolbar (52, traffic lights area, sidebar toggle, title, tool groups, search)
     MacSidebar (edge to edge, vibrant) | content | inspector
------------------------------------------------------------------- */

export interface MacWindowProps {
  sidebar?: React.ReactNode;
  toolbar: React.ReactNode;
  inspector?: React.ReactNode;
  children: React.ReactNode;
  /** true when this window has focus (Tauri: listen to focus events). Controls sidebar and selection emphasis. */
  active?: boolean;
  /** draw custom traffic lights (Windows or Linux with decorations off). On macOS native ones are used. */
  customChrome?: boolean;
  sidebarWidth?: number;
}

const WinCtx = React.createContext({ active: true });
export const useMacWindow = () => React.useContext(WinCtx);

export function MacWindow({ sidebar, toolbar, inspector, children, active = true, customChrome = false, sidebarWidth = 220 }: MacWindowProps) {
  return (
    <WinCtx.Provider value={{ active }}>
      <div data-window-active={active} className={cn('flex h-dvh w-full flex-col overflow-hidden bg-bg text-body text-label', customChrome && cn('squircle rounded-window', active ? 'shadow-window-active' : 'shadow-window-inactive'))}>
        <div className="flex min-h-0 flex-1">
          {sidebar && (
            <aside className={cn('flex shrink-0 flex-col', active ? 'bg-sidebar' : 'bg-sidebar-inactive')} style={{ width: sidebarWidth, backdropFilter: 'var(--cf-glass-large-filter)' }}>
              <div data-tauri-drag-region className="h-[var(--cf-bar-height)] shrink-0">{customChrome && <TrafficLights />}</div>
              <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">{sidebar}</div>
            </aside>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <div data-tauri-drag-region className="flex h-[var(--cf-bar-height)] shrink-0 items-center gap-sm px-3 hairline-b">
              {!sidebar && customChrome && <TrafficLights />}
              {toolbar}
            </div>
            <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          </div>
          {inspector && <aside className="w-[var(--cf-inspector-w)] shrink-0 overflow-y-auto bg-bg-2 p-lg shadow-[inset_0.5px_0_0_var(--cf-separator)]">{inspector}</aside>}
        </div>
      </div>
    </WinCtx.Provider>
  );
}

/** Custom traffic lights for non macOS chrome. Glyphs show on group hover; inactive window shows gray. */
export function TrafficLights({ onClose, onMinimize, onZoom }: { onClose?: () => void; onMinimize?: () => void; onZoom?: () => void }) {
  const { active } = useMacWindow();
  const dot = (bg: string, label: string, glyph: React.ReactNode, fn?: () => void) => (
    <button type="button" aria-label={label} onClick={fn}
      className="flex size-3.5 items-center justify-center rounded-full text-[rgb(0_0_0/0.55)] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.12)] outline-none"
      style={{ background: active ? bg : 'var(--cf-fill-3)' }}>
      <span className="opacity-0 group-hover:opacity-100">{glyph}</span>
    </button>
  );
  return (
    <div className="group ml-1 mr-2 flex items-center gap-[var(--cf-traffic-gap)]" data-tauri-drag-region={false}>
      {dot('#FF5F57', 'Close', <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1 1l4 4M5 1L1 5" stroke="currentColor" strokeWidth="1.2" /></svg>, onClose /* cf-ignore traffic light colors are fixed by Apple */)}
      {dot('#FEBC2E', 'Minimize', <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0.5 3h5" stroke="currentColor" strokeWidth="1.2" /></svg>, onMinimize /* cf-ignore */)}
      {dot('#28C840', 'Zoom', <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1 1h3L1 4zM5 5H2l3-3z" fill="currentColor" /></svg>, onZoom /* cf-ignore */)}
    </div>
  );
}

/** Toolbar content helpers */
export function MacToolbarTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div data-tauri-drag-region className="flex min-w-0 flex-col justify-center leading-tight">
      <span className="truncate text-headline text-label">{title}</span>
      {subtitle && <span className="truncate text-subheadline text-label-2">{subtitle}</span>}
    </div>
  );
}
export function MacToolbarSpacer() { return <div data-tauri-drag-region className="flex-1 self-stretch" />; }

export function MacToolbarGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return <div role="group" aria-label={label} className="cf-glass flex h-8 items-center gap-0.5 rounded-capsule px-1">{children}</div>;
}

export function MacToolbarItem({ label, icon, onClick, active, disabled }: { label: string; icon: React.ReactNode; onClick?: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} aria-pressed={active} disabled={disabled} onClick={onClick}
      className={cn('flex h-7 min-w-7 items-center justify-center rounded-capsule px-1.5 text-[length:var(--cf-glyph-mac)] outline-none transition-colors duration-100',
        'hover:bg-fill-2 active:bg-control-pressed focus-visible:focus-ring disabled:text-label-3', active ? 'text-accent' : 'text-label-glass')}>
      {icon}
    </button>
  );
}

/* ---------------- Sidebar ---------------- */
export function MacSidebarSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      {title && <div className="px-2.5 pb-1 pt-2 text-subheadline emphasized text-label-2">{title}</div>}
      <ul role="listbox" className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

export function MacSidebarRow({ label, icon, selected, onSelect, badge, iconColor = 'accent' }: { label: string; icon?: React.ReactNode; selected?: boolean; onSelect?: () => void; badge?: string | number; iconColor?: string }) {
  const { active } = useMacWindow();
  return (
    <li role="option" aria-selected={selected}>
      <button type="button" onClick={onSelect}
        className={cn('squircle flex h-8 w-full items-center gap-2 rounded-sidebar-row-selection px-2.5 text-left text-body outline-none focus-visible:focus-ring',
          selected && active && 'bg-accent text-white',
          selected && !active && 'bg-fill text-label',
          !selected && 'text-label')}>
        {icon && <span className="shrink-0 text-[length:var(--cf-glyph-mac)]" style={{ color: selected && active ? 'currentColor' : `var(--cf-${iconColor})` }}>{icon}</span>}
        <span className="flex-1 truncate">{label}</span>
        {badge !== undefined && <span className={cn('text-callout tabular', selected && active ? 'text-white' : 'text-label-2')}>{badge}</span>}
      </button>
    </li>
  );
}

/* ---------------- Controls ---------------- */
export type MacButtonVariant = 'bordered' | 'default' | 'destructive' | 'plain';
export const MacButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: MacButtonVariant; size?: 'small' | 'regular' | 'large' }>(
  function MacButton({ variant = 'bordered', size = 'regular', className, ...rest }, ref) {
    return (
      <button ref={ref}
        className={cn('inline-flex min-w-[var(--cf-mac-btn-min-w)] items-center justify-center gap-1.5 rounded-capsule px-2.5 outline-none focus-visible:focus-ring disabled:opacity-40',
          size === 'small' ? 'h-[var(--cf-control-small)] text-subheadline' : size === 'large' ? 'h-[var(--cf-control-large)] text-body' : 'h-[var(--cf-control-regular)] text-body',
          variant === 'bordered' && 'bg-control text-label active:bg-control-pressed',
          variant === 'default' && 'bg-accent text-accent-contrast active:brightness-90',
          variant === 'destructive' && 'bg-control text-red active:bg-control-pressed',
          variant === 'plain' && 'min-w-0 bg-transparent px-1 text-accent active:opacity-50',
          className)}
        {...rest} />
    );
  });

export function Checkbox({ checked, onChange, label, mixed, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; mixed?: boolean; disabled?: boolean }) {
  return (
    <label className={cn('inline-flex min-h-5 items-center gap-1.5 text-body text-label', disabled && 'opacity-40')}>
      <button type="button" role="checkbox" aria-checked={mixed ? 'mixed' : checked} disabled={disabled} onClick={() => onChange(!checked)}
        className={cn('squircle flex size-4 items-center justify-center rounded-checkbox outline-none focus-visible:focus-ring',
          checked || mixed ? 'bg-accent text-white' : 'bg-field shadow-[inset_0_0_0_0.5px_var(--cf-label-4)]')}>
        {mixed ? <Minus size={11} strokeWidth={3} /> : checked ? <Check size={11} strokeWidth={3} /> : null}
      </button>
      {label}
    </label>
  );
}

export function RadioGroup<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-sm">
      {options.map((o) => (
        <label key={o.value} className="inline-flex min-h-5 items-center gap-1.5 text-body text-label">
          <button type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}
            className={cn('flex size-4 items-center justify-center rounded-full outline-none focus-visible:focus-ring', o.value === value ? 'bg-accent' : 'bg-field shadow-[inset_0_0_0_0.5px_var(--cf-label-4)]')}>
            {o.value === value && <span className="size-1.5 rounded-full bg-white" />}
          </button>
          {o.label}
        </label>
      ))}
    </div>
  );
}

export const MacTextField = TextField;

/* ---------------- Table ---------------- */
export interface Column<R> { key: keyof R & string; title: string; width?: number; align?: 'start' | 'end'; numeric?: boolean }
export function MacTable<R extends { id: string }>({ columns, rows, selected, onSelect, sort, onSort, alternating = true }: {
  columns: Column<R>[]; rows: R[]; selected?: string[]; onSelect?: (ids: string[]) => void;
  sort?: { key: string; dir: 'asc' | 'desc' }; onSort?: (key: string) => void; alternating?: boolean;
}) {
  const { active } = useMacWindow();
  return (
    <div role="grid" className="w-full text-body">
      <div role="row" className="sticky top-0 z-10 flex h-7 items-center bg-bg hairline-b">
        {columns.map((c) => (
          <button key={c.key} type="button" role="columnheader" onClick={() => onSort?.(c.key)}
            className={cn('flex h-full items-center gap-1 px-2.5 text-subheadline emphasized text-label-2 shadow-[inset_-0.5px_0_0_var(--cf-separator)] outline-none focus-visible:focus-ring', c.align === 'end' && 'justify-end')}
            style={{ width: c.width, flex: c.width ? undefined : 1 }}>
            {c.title}
            {sort?.key === c.key && (sort.dir === 'asc' ? <ChevronUp size={10} strokeWidth={3} /> : <ChevronDown size={10} strokeWidth={3} />)}
          </button>
        ))}
      </div>
      {rows.map((r, i) => {
        const sel = selected?.includes(r.id);
        return (
          <div key={r.id} role="row" aria-selected={sel}
            onClick={(e) => onSelect?.(e.metaKey || e.ctrlKey ? (sel ? selected!.filter((x) => x !== r.id) : [...(selected ?? []), r.id]) : [r.id])}
            className={cn('squircle mx-1.5 flex h-6 items-center rounded-table-row-selection',
              sel ? (active ? 'bg-accent text-white' : 'bg-fill text-label') : alternating && i % 2 === 1 ? 'bg-fill-5' : '')}>
            {columns.map((c) => (
              <div key={c.key} role="gridcell" className={cn('truncate px-2.5', c.numeric && 'tabular', c.align === 'end' && 'text-right')} style={{ width: c.width, flex: c.width ? undefined : 1 }}>
                {String(r[c.key] ?? '')}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

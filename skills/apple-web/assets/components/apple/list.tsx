'use client';
import * as React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/cupertino/cn';
import { Squircle } from './squircle';

type ListStyle = 'insetGrouped' | 'plain';
const ListCtx = React.createContext<ListStyle>('insetGrouped');

/** iOS list. insetGrouped for settings, forms, detail; plain for feeds. Screen background is set here. */
export function List({ style = 'insetGrouped', className, children }: { style?: ListStyle; className?: string; children: React.ReactNode }) {
  return (
    <ListCtx.Provider value={style}>
      <div className={cn(style === 'insetGrouped' ? 'bg-bg-grouped' : 'bg-bg', 'flex flex-col gap-[var(--cf-space-xl)] pb-[var(--cf-space-section)]', className)}>{children}</div>
    </ListCtx.Provider>
  );
}

export function ListSection({ header, footer, children }: { header?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode }) {
  const style = React.useContext(ListCtx);
  const rows = React.Children.toArray(children);
  return (
    <section className={cn(style === 'insetGrouped' && 'px-lg')}>
      {header && <h2 className={cn('pb-sm text-headline text-label', style === 'insetGrouped' ? 'px-lg' : 'px-lg pt-lg')}>{header}</h2>}
      {style === 'insetGrouped' ? (
        <Squircle radius="list-section-inset-grouped" className="overflow-hidden bg-bg-grouped-2" as="div">
          <ul role="list">{rows.map((r, i) => <RowWrap key={i} last={i === rows.length - 1}>{r}</RowWrap>)}</ul>
        </Squircle>
      ) : (
        <ul role="list" className="bg-bg">{rows.map((r, i) => <RowWrap key={i} last={i === rows.length - 1}>{r}</RowWrap>)}</ul>
      )}
      {footer && <p className="px-[calc(var(--cf-space-lg)*2)] pt-sm text-footnote text-label-2">{footer}</p>}
    </section>
  );
}

const LastCtx = React.createContext(false);
function RowWrap({ last, children }: { last: boolean; children: React.ReactNode }) {
  return <LastCtx.Provider value={last}><li className="relative">{children}</li></LastCtx.Provider>;
}

export interface ListRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  value?: React.ReactNode;           // trailing secondary value
  leading?: React.ReactNode;         // SettingsIcon, avatar, or glyph
  accessory?: 'chevron' | 'checkmark' | 'none' | React.ReactNode; // React node for Toggle etc.
  onPress?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
}

/** List row. Tappable rows highlight instantly on press and fade 250ms after release. */
export function ListRow({ title, subtitle, value, leading, accessory = 'none', onPress, href, destructive, disabled }: ListRowProps) {
  const last = React.useContext(LastCtx);
  const hasIcon = !!leading;
  const tappable = !!(onPress || href) && !disabled;
  const Comp: React.ElementType = href ? 'a' : tappable ? 'button' : 'div';
  return (
    <Comp
      href={href}
      type={Comp === 'button' ? 'button' : undefined}
      onClick={onPress}
      disabled={Comp === 'button' ? disabled : undefined}
      className={cn(
        'group relative flex w-full items-center gap-md px-lg text-left outline-none',
        subtitle ? 'min-h-16 py-2' : 'min-h-[var(--cf-row-min-h)] py-2.5',
        tappable && 'transition-colors duration-[250ms] active:bg-fill-4 active:duration-0 focus-visible:bg-fill-4',
        disabled && 'opacity-40'
      )}
    >
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn('truncate text-body', destructive ? 'text-red' : tappable && accessory === 'none' && !value ? 'text-accent' : 'text-label')}>{title}</span>
        {subtitle && <span className="truncate text-subheadline text-label-2">{subtitle}</span>}
      </span>
      {value !== undefined && <span className="shrink-0 truncate text-body text-label-2">{value}</span>}
      {accessory === 'chevron' && <ChevronRight aria-hidden size={17} strokeWidth={2.5} className="shrink-0 text-label-3" />}
      {accessory === 'checkmark' && <Check aria-label="Selected" size={20} strokeWidth={2.5} className="shrink-0 text-accent" />}
      {React.isValidElement(accessory) && accessory}
      {!last && (
        <span
          aria-hidden
          className="absolute bottom-0 h-[var(--cf-hairline)] bg-separator"
          style={{ insetInlineStart: hasIcon ? 'var(--cf-row-sep-inset-icon)' : 'var(--cf-row-sep-inset)', insetInlineEnd: 0 }}
        />
      )}
    </Comp>
  );
}

/** Settings style 29pt squircle icon with white glyph on a system color. Settings screens only. */
export function SettingsIcon({ color, children }: { color: 'red' | 'orange' | 'yellow' | 'green' | 'mint' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'pink' | 'brown' | 'gray'; children: React.ReactNode }) {
  return (
    <span className="squircle flex size-[var(--cf-settings-icon-size)] items-center justify-center rounded-settings-icon text-[length:var(--cf-glyph-settings)] text-white" style={{ background: `var(--cf-${color})` }}>
      {children}
    </span>
  );
}

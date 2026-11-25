'use client';
import * as React from 'react';
import { Search, CircleX } from 'lucide-react';
import { cn } from '@/lib/cupertino/cn';
import { useCupertino } from './root';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;         // visible label (macOS forms) or aria label
  error?: string;         // footnote in red below
  clearable?: boolean;
  inList?: boolean;       // inside an insetGrouped list row: no background, no border
}

/** iOS: fill background, no border, no focus ring on touch. macOS: field background, kit hairline, focus ring. */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, clearable, inList, className, value, onChange, ...rest }, ref
) {
  const { platform } = useCupertino();
  const mac = platform === 'macos';
  const id = React.useId();
  const showClear = clearable && value !== undefined && String(value).length > 0;
  return (
    <div className="w-full">
      {mac && label && <label htmlFor={id} className="mb-1 block text-body text-label">{label}</label>}
      <div className={cn('relative flex items-center',
        inList ? 'min-h-[var(--cf-row-min-h)] px-lg' :
        mac ? 'squircle h-[var(--cf-control-regular)] rounded-text-field bg-field px-1.5 shadow-[0_0_0_0.5px_var(--cf-field-border)] focus-within:focus-ring' :
              'squircle h-11 rounded-text-field-rounded bg-fill-3 px-lg')}>
        <input
          id={id} ref={ref} value={value} onChange={onChange}
          aria-label={!mac || !label ? label : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn('w-full min-w-0 bg-transparent text-label outline-none placeholder:text-placeholder', mac ? 'text-body' : 'text-body', className)}
          {...rest}
        />
        {showClear && (
          <button type="button" aria-label="Clear text" className="ml-2 text-label-3"
            onClick={() => onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
            <CircleX size={17} fill="currentColor" stroke="var(--cf-bg)" />
          </button>
        )}
      </div>
      {error && <p id={`${id}-err`} className="px-lg pt-1 text-footnote text-red">{error}</p>}
    </div>
  );
});

export interface SearchFieldProps { value: string; onChange: (v: string) => void; placeholder?: string; onCancel?: () => void; glass?: boolean; autoFocus?: boolean }

/** Capsule search field. glass=true for the iOS bottom search; plain fill for in-content search. */
export function SearchField({ value, onChange, placeholder = 'Search', onCancel, glass, autoFocus }: SearchFieldProps) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="flex w-full items-center gap-md">
      <div className={cn('flex h-11 flex-1 items-center gap-2 rounded-capsule px-4 text-label-2 [:root[data-cf-platform=macos]_&]:h-[var(--cf-control-regular)]',
        glass ? 'cf-glass' : 'bg-fill-3')}>
        <Search aria-hidden size={18} strokeWidth={2.25} />
        <input
          type="search" role="searchbox" aria-label={placeholder} value={value} autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="h-full w-full min-w-0 bg-transparent text-body text-label outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button type="button" aria-label="Clear search" onClick={() => onChange('')} className="text-label-3">
            <CircleX size={17} fill="currentColor" stroke="var(--cf-bg)" />
          </button>
        )}
      </div>
      {onCancel && focused && (
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onCancel} className="cf-press-plain text-body text-accent">Cancel</button>
      )}
    </div>
  );
}

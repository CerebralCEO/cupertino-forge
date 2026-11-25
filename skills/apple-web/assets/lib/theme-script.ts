'use client';
import * as React from 'react';

export const CF_THEME_INIT_SCRIPT = `(function(){try{var r=document.documentElement;var t=localStorage.getItem('cf-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=t==='light'||t==='dark'?t:(d?'dark':'light');var c=localStorage.getItem('cf-contrast');var hc=window.matchMedia('(prefers-contrast: more)').matches;r.dataset.contrast=c==='more'||c==='normal'?c:(hc?'more':'normal');var tr=localStorage.getItem('cf-transparency');var rt=window.matchMedia('(prefers-reduced-transparency: reduce)').matches;r.dataset.transparency=tr==='reduce'||tr==='normal'?tr:(rt?'reduce':'normal');}catch(e){}})();`;

/** Synchronous pre-hydration script to apply persisted or OS theme/contrast/transparency before first paint. */
export function CupertinoThemeScript() {
  return React.createElement('script', { dangerouslySetInnerHTML: { __html: CF_THEME_INIT_SCRIPT } });
}

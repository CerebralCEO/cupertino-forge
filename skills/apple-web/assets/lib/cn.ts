import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge needs to know the cf text styles are font-size classes, not colors.
const cfText = ['large-title', 'title1', 'title2', 'title3', 'headline', 'body', 'callout', 'subheadline', 'footnote', 'caption1', 'caption2'];

const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: cfText }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

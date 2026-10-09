import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge with Fasla's type sizes it doesn't know. Unknown, `text-xxs`
 * reads as a colour, and merging drops the `text-foreground` beside it.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["xxs", "link", "list-header"] }] } },
})

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * This ensures proper class merging and deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: Progress (3831:2727), 126 variants plus a `Show Percentage` toggle.
 *
 * Built on Base UI's Progress, which owns the semantics: the `progressbar`
 * role, `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, an
 * `aria-valuetext` read as a percentage, the clamped value and the
 * indicator's width. This file owns the look.
 *
 * Figma axis → code:
 *  - `Percentage` (0%, 5% … 100%) → `value`, any number from 0 to 100. Out of
 *    range values are clamped, so the bar never overflows its track.
 *  - `Size` (sm / md / lg) → `size`.
 *  - `Show Percentage` (On / Off) → `showPercentage`.
 *  - `Direction` → the page's `dir`, never a prop. The bar fills from the
 *    inline start and the label sits before it, so Arabic mirrors both, as
 *    Figma's RTL variants do.
 *
 * Layers, named as in Figma (`data-slot`): `track`, `indicator` and
 * `percentage`, inside a `progress` root.
 */

type ProgressSize = "sm" | "md" | "lg"

/**
 * The row: the percentage label, an 8px gap (Figma `spacing/2`), then the bar,
 * which fills the rest. It takes the full width of its container, as Figma's
 * `Fill` resizing does; 200px is only the canvas width.
 */
const progressVariants = cva("flex w-full min-w-0 items-center gap-2")

/**
 * The Track: the full range, a pill in `primary` at 20% (Figma
 * `opacity/primary-light`, the same `primary/20` Tabs uses). It clips the
 * indicator, so the indicator is rounded only where it meets the track's
 * ends: at its start always, and at its far end only at 100%. That is exactly
 * Figma's `9999 / 0 / 9999 / 0` bar radius, with no rounded tip mid-track.
 *
 * Heights per Figma: 6, 8 and 12px.
 *
 * In forced colors (Windows high contrast) the browser drops both fills and
 * the bar would vanish, so the track gains a 1px outline in the system text
 * colour there. It is inset, so the bar keeps its height. Nothing changes
 * outside that mode.
 */
const progressTrackVariants = cva(
  [
    "relative block min-w-0 flex-1 overflow-hidden rounded-full bg-primary/20",
    "forced-colors:outline forced-colors:outline-1 forced-colors:-outline-offset-1 forced-colors:outline-[CanvasText]",
  ],
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

/**
 * The Indicator: `primary`, the track's full height. Base UI sets its width to
 * the clamped percentage and `inset-inline-start: 0`. It is an ordinary block,
 * so it starts at the inline start of the track: the left in English, the
 * right in Arabic. No `left` or `right` anywhere. In forced colors it fills
 * with the system text colour, which that mode keeps.
 */
const progressIndicatorClasses =
  "block h-full bg-primary transition-[width] motion-reduce:transition-none forced-colors:bg-[CanvasText]"

/**
 * The Percentage label: Medium weight in `foreground`, Geist in English and
 * Cairo in Arabic (Figma's `Tailwind En` and `Tailwind AR` styles). Its column
 * has a fixed width per size (32, 38 and 44px, Figma's own), wide enough for
 * "100%", so the bar does not move as the number grows. The widths are in rem,
 * like the text, so a larger text setting widens the column with the number
 * instead of pushing "100%" into the bar.
 *
 * Tabular figures (code only; Figma sets proportional ones) give every digit
 * the same width, so the number does not jitter as the value changes.
 * The text sits at the column's end, against the bar, in both directions.
 *
 * Sizes 12, 14 and 16px. The line height comes from the type ramp: 16/20/24px
 * in English and 20/24/28px in Arabic, as Figma's two ramps set it.
 */
const progressPercentageVariants = cva("shrink-0 text-end font-medium tabular-nums text-foreground", {
  variants: {
    size: {
      sm: "w-8 text-xs",
      md: "w-[2.375rem] text-sm",
      lg: "w-11 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface ProgressProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    "className" | "value" | "min" | "max" | "children"
  > {
  /**
   * How much is done, from 0 to 100. Any number works, not only Figma's 5%
   * steps; values outside the range are clamped.
   */
  value?: number
  /** Bar height and label size: 6px with a 12px label, 8px with 14px, or 12px with 16px. */
  size?: ProgressSize
  /**
   * Shows the percentage before the bar, as Figma's default does. Screen readers hear the value once,
   * from the progress bar itself; the label is hidden from them.
   */
  showPercentage?: boolean
  className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, size = "md", showPercentage = true, locale = "en-US", className, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      data-size={size}
      value={value}
      // Formats both the label and `aria-valuetext`. A fixed locale keeps the
      // digits Latin in Arabic, as in Figma's RTL variants, and keeps the
      // server and the browser rendering the same text.
      locale={locale}
      className={cn(progressVariants(), className)}
      {...props}
    >
      {showPercentage ? (
        // Base UI renders this aria-hidden: the progressbar's own value is
        // what assistive tech reads, so the number is not announced twice.
        <ProgressPrimitive.Value
          data-slot="percentage"
          className={progressPercentageVariants({ size })}
        />
      ) : null}
      <ProgressPrimitive.Track data-slot="track" className={progressTrackVariants({ size })}>
        <ProgressPrimitive.Indicator data-slot="indicator" className={progressIndicatorClasses} />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
)
Progress.displayName = "Progress"

export {
  Progress,
  progressVariants,
  progressTrackVariants,
  progressPercentageVariants,
  type ProgressSize,
}

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/**
 * Skeleton — a loading placeholder that stands in for content until it arrives.
 *
 * Matches the Figma set (Skeleton, `15120:8056`):
 * - every block is `secondary`, the token Figma binds (`theme/secondary`),
 *   solid rather than a tint, so it reads the same on any surface;
 * - bars are 16px tall with a 4px radius, stacked 8px apart;
 * - the list item puts a 48px circle 16px before its lines;
 * - the card puts a 122px media block 16px above its lines.
 *
 * Blocks are decorative, so each is `aria-hidden`. Announce loading on the
 * region that is loading instead, with `aria-busy="true"`.
 *
 * The pulse is Tailwind's built-in `animate-pulse`, behind `motion-safe:`, so
 * it stops when the user has asked for reduced motion.
 *
 * Every composition lays out with flex and logical order only, so in RTL the
 * circle moves to the inline start (the right) with no `rtl:` overrides.
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The shape of the skeleton */
  variant?: "default" | "circular" | "rectangular"
  /** Whether to animate the skeleton */
  animate?: boolean
}

/**
 * A single block. A drop-in replacement for shadcn's Skeleton: size it with
 * `className`, such as `h-4 w-48`.
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", animate = true, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "bg-secondary",
        animate && "motion-safe:animate-pulse",
        variant === "default" && "rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-none",
        className
      )}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

/** Props for the compositions: `animate` reaches every block inside. */
type SkeletonGroupProps = SkeletonProps & {
  /** Number of text lines */
  lines?: number
}

/** Pre-built skeleton for text lines. Every line is full width, as in Figma. */
function SkeletonText({
  className,
  lines = 2,
  // A group has no shape of its own; taken out so it never reaches the DOM.
  variant: _variant,
  animate = true,
  ...props
}: SkeletonGroupProps) {
  return (
    <div
      data-slot="skeleton-text"
      aria-hidden="true"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} animate={animate} className="h-4 w-full" />
      ))}
    </div>
  )
}

/** Pre-built skeleton for avatars: a 48px circle. */
function SkeletonAvatar({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      variant="circular"
      className={cn("h-12 w-12 shrink-0", className)}
      {...props}
    />
  )
}

/**
 * Pre-built skeleton for a list row: an avatar at the inline start, then text
 * lines filling the rest. For lists, comments and profile rows.
 */
function SkeletonListItem({
  className,
  lines = 2,
  variant: _variant,
  animate = true,
  ...props
}: SkeletonGroupProps) {
  return (
    <div
      data-slot="skeleton-list-item"
      aria-hidden="true"
      className={cn("flex items-center gap-4", className)}
      {...props}
    >
      <SkeletonAvatar animate={animate} />
      <SkeletonText lines={lines} animate={animate} className="min-w-0 flex-1" />
    </div>
  )
}

/**
 * Pre-built skeleton for cards: a media block above text lines. It has no
 * border or background of its own, so it can sit inside a real Card.
 */
function SkeletonCard({
  className,
  lines = 2,
  variant: _variant,
  animate = true,
  ...props
}: SkeletonGroupProps) {
  return (
    <div
      data-slot="skeleton-card"
      aria-hidden="true"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <Skeleton animate={animate} className="h-[122px] w-full" />
      <SkeletonText lines={lines} animate={animate} />
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonListItem, SkeletonCard }

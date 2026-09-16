import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The shape of the skeleton */
  variant?: "default" | "circular" | "rectangular"
  /** Whether to animate the skeleton */
  animate?: boolean
}

function Skeleton({
  className,
  variant = "default",
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-primary/10",
        animate && "animate-pulse",
        variant === "default" && "rounded-md",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-none",
        className
      )}
      {...props}
    />
  )
}

/** Pre-built skeleton for text lines */
function SkeletonText({
  className,
  lines = 3,
  ...props
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-4/5" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

/** Pre-built skeleton for avatars */
function SkeletonAvatar({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      variant="circular"
      className={cn("h-10 w-10", className)}
      {...props}
    />
  )
}

/** Pre-built skeleton for cards */
function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <SkeletonAvatar />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="mt-4">
        <SkeletonText lines={3} />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard }

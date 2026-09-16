import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The main title/label */
  title: string
  /** The primary value to display */
  value: string | number
  /** Optional description or subtitle */
  description?: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Trend direction and value */
  trend?: {
    value: number
    direction: "up" | "down" | "neutral"
  }
  /** Whether the card is loading */
  loading?: boolean
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  loading = false,
  className,
  ...props
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                trend.direction === "up" && "text-green-600 dark:text-green-400",
                trend.direction === "down" && "text-red-600 dark:text-red-400",
                trend.direction === "neutral" && "text-muted-foreground"
              )}
            >
              {trend.direction === "up" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              )}
              {trend.direction === "down" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}

export interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: 2 | 3 | 4
  children: React.ReactNode
}

export function StatsGrid({
  columns = 4,
  className,
  children,
  ...props
}: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

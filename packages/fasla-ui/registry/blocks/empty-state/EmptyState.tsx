import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon to display (should be a React element) */
  icon?: React.ReactNode
  /** Main title */
  title: string
  /** Description text */
  description?: string
  /** Primary action button/link */
  action?: React.ReactNode
  /** Secondary action */
  secondaryAction?: React.ReactNode
  /** Size variant */
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: {
    container: "py-8",
    icon: "[&_svg]:h-8 [&_svg]:w-8",
    title: "text-base",
    description: "text-sm",
  },
  default: {
    container: "py-12",
    icon: "[&_svg]:h-12 [&_svg]:w-12",
    title: "text-lg",
    description: "text-sm",
  },
  lg: {
    container: "py-16",
    icon: "[&_svg]:h-16 [&_svg]:w-16",
    title: "text-xl",
    description: "text-base",
  },
}

/**
 * Empty state component for displaying when there's no data.
 * Provides contextual messaging and primary actions to guide users.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "default",
  className,
  ...props
}: EmptyStateProps) {
  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes.container,
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            "mb-4 text-muted-foreground/50",
            sizes.icon
          )}
        >
          {icon}
        </div>
      )}
      <h3 className={cn("font-semibold text-foreground", sizes.title)}>
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "mt-2 max-w-sm text-muted-foreground",
            sizes.description
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}

/** Pre-built empty state for no search results */
export function EmptySearchResults({
  query,
  onClear,
  ...props
}: Omit<EmptyStateProps, "title" | "description"> & {
  query?: string
  onClear?: () => void
}) {
  return (
    <EmptyState
      title="No results found"
      description={
        query
          ? `No results for "${query}". Try a different search term.`
          : "Try adjusting your search or filters."
      }
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      }
      {...props}
    />
  )
}

/** Pre-built empty state for no data */
export function EmptyData({
  resourceName = "items",
  ...props
}: Omit<EmptyStateProps, "title" | "description"> & {
  resourceName?: string
}) {
  return (
    <EmptyState
      title={`No ${resourceName} yet`}
      description={`Get started by creating your first ${resourceName.replace(/s$/, "")}.`}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      }
      {...props}
    />
  )
}

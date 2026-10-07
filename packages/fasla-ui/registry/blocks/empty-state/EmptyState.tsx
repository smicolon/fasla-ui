import * as React from "react"
import { FilePlusIcon, SearchIcon } from "lucide-react"
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
  title,
  description,
  ...rest
}: Omit<EmptyStateProps, "title" | "description"> & {
  /** Replaces the English title */
  title?: string
  /** Replaces the English description */
  description?: string
  query?: string
  /**
   * @deprecated Does nothing: this empty state has no clear control. Pass a
   * button as `action` instead.
   */
  onClear?: () => void
}) {
  // onClear is kept so existing callers still compile; take it out here so it
  // never reaches the DOM through EmptyState's spread.
  const props = { ...rest }
  delete props.onClear

  return (
    <EmptyState
      // ?? rather than a later spread, so an undefined title keeps the English one
      title={title ?? "No results found"}
      description={
        description ??
        (query
          ? `No results for "${query}". Try a different search term.`
          : "Try adjusting your search or filters.")
      }
      icon={
        <SearchIcon strokeWidth={1.5} />
      }
      {...props}
    />
  )
}

/** Pre-built empty state for no data */
export function EmptyData({
  resourceName = "items",
  title,
  description,
  ...props
}: Omit<EmptyStateProps, "title" | "description"> & {
  /** Replaces the English title */
  title?: string
  /** Replaces the English description */
  description?: string
  resourceName?: string
}) {
  return (
    <EmptyState
      title={title ?? `No ${resourceName} yet`}
      description={description ?? `Get started by creating your first ${resourceName.replace(/s$/, "")}.`}
      icon={
        <FilePlusIcon strokeWidth={1.5} />
      }
      {...props}
    />
  )
}

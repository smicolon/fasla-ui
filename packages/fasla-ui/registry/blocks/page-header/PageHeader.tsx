import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title: string
  /** Optional description below the title */
  description?: string
  /** Action buttons/controls on the right side */
  actions?: React.ReactNode
  /** Breadcrumb navigation above the title */
  breadcrumb?: React.ReactNode
  /** Whether to show the bottom border */
  bordered?: boolean
  /** Semantic heading level for the title */
  headingLevel?: 1 | 2 | 3
}

/**
 * Page header with title, breadcrumb, description, and actions.
 * Use at the top of page content to provide context and primary actions.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  bordered = true,
  headingLevel = 1,
  className,
  ...props
}: PageHeaderProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <div
      className={cn(
        "flex flex-col gap-3 bg-background px-4 py-4 md:px-6",
        bordered && "border-b",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {breadcrumb && (
            <nav className="mb-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              {breadcrumb}
            </nav>
          )}
          <Heading className="truncate text-xl font-semibold tracking-tight md:text-2xl">
            {title}
          </Heading>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}

import * as React from "react"
import { cn } from "../../../src/lib/utils"

// Column definition
export interface Column<T> {
  /** Unique identifier for the column */
  id: string
  /** Header text or element */
  header: React.ReactNode
  /** Cell renderer function */
  cell: (row: T) => React.ReactNode
  /** Whether the column is sortable */
  sortable?: boolean
  /** Column width class */
  width?: string
  /** Alignment */
  align?: "left" | "center" | "right"
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /** Data to display */
  data: T[]
  /** Column definitions */
  columns: Column<T>[]
  /** Unique key extractor for each row */
  getRowKey: (row: T) => string | number
  /** Loading state */
  loading?: boolean
  /** Empty state content */
  emptyState?: React.ReactNode
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void
  /** Currently selected row key */
  selectedKey?: string | number
  /** Sticky header */
  stickyHeader?: boolean
}

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

/**
 * Data table component for displaying tabular data.
 * Supports sorting, row selection, and custom cell rendering.
 */
export function DataTable<T>({
  data,
  columns,
  getRowKey,
  loading = false,
  emptyState,
  onRowClick,
  selectedKey,
  stickyHeader = false,
  className,
  ...props
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn("rounded-md border", className)} {...props}>
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className={cn(stickyHeader && "sticky top-0 z-10 bg-muted/50")}>
              <tr className="border-b transition-colors">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "h-10 px-4 font-medium text-muted-foreground",
                      alignClasses[column.align || "left"],
                      column.width
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {columns.map((column) => (
                    <td key={column.id} className="h-12 px-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-md border", className)} {...props}>
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className={cn(stickyHeader && "sticky top-0 z-10 bg-muted/50")}>
              <tr className="border-b transition-colors">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "h-10 px-4 font-medium text-muted-foreground",
                      alignClasses[column.align || "left"],
                      column.width
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="py-8">
          {emptyState || (
            <p className="text-center text-sm text-muted-foreground">
              No data to display.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-md border", className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className={cn(stickyHeader && "sticky top-0 z-10 bg-muted/50")}>
            <tr className="border-b transition-colors hover:bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "h-10 px-4 font-medium text-muted-foreground",
                    alignClasses[column.align || "left"],
                    column.width
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const key = getRowKey(row)
              const isSelected = selectedKey === key

              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    isSelected && "bg-muted"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "p-4",
                        alignClasses[column.align || "left"],
                        column.width
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export interface PaginationProps {
  /** Current page (1-indexed) */
  page: number
  /** Total number of pages */
  totalPages: number
  /** Called when page changes */
  onPageChange: (page: number) => void
  /** Show page numbers */
  showPageNumbers?: boolean
  className?: string
}

/**
 * Pagination component for data tables.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className,
}: PaginationProps) {
  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const showEllipsisAfter = page < totalPages - 2
    const showEllipsisBefore = page > 3

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)
    if (showEllipsisBefore) pages.push("ellipsis")

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (showEllipsisAfter) pages.push("ellipsis")
    if (!pages.includes(totalPages)) pages.push(totalPages)

    return pages
  }

  return (
    <nav
      className={cn("flex items-center justify-between px-2 py-3", className)}
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrevious}
          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Go to previous page"
        >
          Previous
        </button>
        {showPageNumbers &&
          getPageNumbers().map((pageNum, i) =>
            pageNum === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  pageNum === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum}
              </button>
            )
          )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Go to next page"
        >
          Next
        </button>
      </div>
    </nav>
  )
}

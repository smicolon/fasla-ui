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
  /** Alignment. `start` and `end` follow the reading direction; `left` and `right` are physical sides. Defaults to `start`. */
  align?: "start" | "center" | "end" | "left" | "right"
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
  start: "text-start",
  center: "text-center",
  end: "text-end",
  left: "text-left",
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
                      alignClasses[column.align || "start"],
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
                      alignClasses[column.align || "start"],
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
                    alignClasses[column.align || "start"],
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
                        alignClasses[column.align || "start"],
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

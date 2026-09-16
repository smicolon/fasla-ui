import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sidebar content, hidden on mobile by default */
  sidebar?: React.ReactNode
  /** Header content */
  header?: React.ReactNode
  /** Main content */
  children: React.ReactNode
  /** Width of the sidebar */
  sidebarWidth?: "sm" | "md" | "lg"
  /** Whether to show sidebar on mobile */
  sidebarMobile?: boolean
}

const sidebarWidths = {
  sm: "w-56",
  md: "w-64",
  lg: "w-72",
}

/**
 * Application shell with sidebar, header, and content area.
 * Provides the main layout structure for dashboard-style applications.
 */
export function AppShell({
  sidebar,
  header,
  children,
  sidebarWidth = "md",
  sidebarMobile = false,
  className,
  ...props
}: AppShellProps) {
  return (
    <div
      className={cn("min-h-dvh bg-background text-foreground", className)}
      {...props}
    >
      <div className="flex min-h-dvh">
        {sidebar && (
          <aside
            className={cn(
              "shrink-0 border-r bg-muted/30",
              sidebarWidths[sidebarWidth],
              sidebarMobile ? "block" : "hidden md:block"
            )}
          >
            {sidebar}
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {header && (
            <header className="shrink-0 border-b bg-background">
              {header}
            </header>
          )}
          <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

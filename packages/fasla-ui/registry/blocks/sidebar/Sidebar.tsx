"use client"

import * as React from "react"
import { ChevronsLeftIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the sidebar is collapsed */
  collapsed?: boolean
  /** Called when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Sidebar width when expanded */
  width?: "sm" | "default" | "lg"
  children: React.ReactNode
}

const widthClasses = {
  sm: "w-56",
  default: "w-64",
  lg: "w-72",
}

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
  width = "default",
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-e bg-background transition-all duration-200",
        collapsed ? "w-16" : widthClasses[width],
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarHeader({
  className,
  children,
  ...props
}: SidebarHeaderProps) {
  return (
    <div
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarContent({
  className,
  children,
  ...props
}: SidebarContentProps) {
  return (
    <div
      className={cn("flex-1 overflow-auto p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarFooter({
  className,
  children,
  ...props
}: SidebarFooterProps) {
  return (
    <div
      className={cn("border-t p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group label */
  label?: string
  children: React.ReactNode
}

export function SidebarGroup({
  label,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  return (
    <div className={cn("py-2", className)} {...props}>
      {label && (
        <div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          {label}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element */
  icon?: React.ReactNode
  /** Whether item is active */
  active?: boolean
  /** Whether sidebar is collapsed (hides label) */
  collapsed?: boolean
  children: React.ReactNode
}

export function SidebarItem({
  icon,
  active,
  collapsed,
  className,
  children,
  ...props
}: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {!collapsed && <span className="truncate">{children}</span>}
    </button>
  )
}

export interface SidebarCollapseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function SidebarCollapseButton({
  collapsed,
  onCollapsedChange,
  className,
  ...props
}: SidebarCollapseButtonProps) {
  return (
    <button
      onClick={() => onCollapsedChange(!collapsed)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent",
        className
      )}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      {...props}
    >
      {/* Points at the edge the sidebar collapses toward, so it mirrors in RTL. */}
      <ChevronsLeftIcon
        size={16}
        strokeWidth={1.5}
        className={cn("transition-transform motion-reduce:transition-none rtl:-scale-x-100", collapsed && "rotate-180")}
      />
    </button>
  )
}

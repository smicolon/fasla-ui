import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the navbar is sticky */
  sticky?: boolean
  /** Whether to show border at bottom */
  bordered?: boolean
  children: React.ReactNode
}

export function Navbar({
  sticky = true,
  bordered = true,
  className,
  children,
  ...props
}: NavbarProps) {
  return (
    <nav
      className={cn(
        "z-50 flex h-14 w-full items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        sticky && "sticky top-0",
        bordered && "border-b",
        className
      )}
      {...props}
    >
      <div className="container flex h-full items-center px-4">
        {children}
      </div>
    </nav>
  )
}

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function NavbarBrand({ className, children, ...props }: NavbarBrandProps) {
  return (
    <div
      className={cn("flex items-center gap-2 font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment of content */
  align?: "start" | "center" | "end"
  children: React.ReactNode
}

export function NavbarContent({
  align = "start",
  className,
  children,
  ...props
}: NavbarContentProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-4",
        align === "start" && "justify-start",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function NavbarItem({ className, children, ...props }: NavbarItemProps) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  )
}

export interface NavbarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether link is active */
  active?: boolean
  children: React.ReactNode
}

export function NavbarLink({
  active,
  className,
  children,
  ...props
}: NavbarLinkProps) {
  return (
    <a
      className={cn(
        "text-sm font-medium transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show on mobile */
  mobileMenu?: boolean
  children: React.ReactNode
}

export function NavbarMenu({
  mobileMenu,
  className,
  children,
  ...props
}: NavbarMenuProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-6",
        mobileMenu && "hidden md:flex",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface NavbarToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether menu is open */
  open?: boolean
}

export function NavbarToggle({
  open,
  className,
  ...props
}: NavbarToggleProps) {
  return (
    <button
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md md:hidden",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-label={open ? "Close menu" : "Open menu"}
      {...props}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {open ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </>
        )}
      </svg>
    </button>
  )
}

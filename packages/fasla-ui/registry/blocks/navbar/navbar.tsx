"use client"

import * as React from "react"
import { Bell, ChevronDown, Menu, Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button, buttonVariants } from "../../ui/button/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu/dropdown-menu"
import { Input, type InputProps } from "../../ui/input/input"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet/sheet"
import { StatusIndicator } from "../../ui/status-indicator/status-indicator"

/*
 * Figma: `Navbar` (4103:4910). The parts every `navbar-*` block is built
 * from, one per thing the Figma set repeats: the padded bar and its 1248px
 * content, the logo, a link (`Menu Item`) with its three active styles, a link
 * that opens a menu (the chevron), the search field, the icon actions, the
 * notification dot, the account, and the menu button that opens the Sheet when
 * the links no longer fit.
 *
 * Mobile first, like the blocks: the base classes are Figma's Mobile (360),
 * `md:` its Tablet (768) and `lg:` its Desktop (1440). The page's `dir` sets
 * the direction; nothing here takes one.
 */

type Locale = "en" | "ar"

/** One destination in the bar, or in the Sheet. */
export interface NavbarLinkItem {
  label: string
  href: string
  /** The page the visitor is on: the link carries the layout's active style and `aria-current="page"`. */
  current?: boolean
  /** Figma's chevron: the link opens a menu of these pages instead. */
  items?: { label: string; href: string }[]
  /** An icon after the label, as the E-commerce categories have. Sized to 22px. */
  icon?: React.ReactNode
}

/**
 * How the current link is marked, one per Figma layout: an `accent` fill, a
 * 1px or 2px `foreground` line under it, a 5px `primary` dot under it, or only
 * its colour (the others are `muted-foreground`).
 */
export type NavbarIndicator = "fill" | "underline" | "border" | "dot" | "text"

/** The words only assistive tech reads, the Sheet's title and the search placeholder. */
export interface NavbarLabels {
  /** The bar's `nav` landmark. */
  nav: string
  /** The menu button. */
  openMenu: string
  /** The Sheet's close button. */
  closeMenu: string
  /** The Sheet's title, and its `nav` landmark. */
  menuTitle: string
  /** The search field's name. */
  search: string
  /** The search field's placeholder, the one label on screen. */
  searchPlaceholder: string
  /** The bell. */
  notifications: string
  /** The notification dot, read after the bell. */
  unread: string
  /** The account button. */
  account: string
}

/** Every label, per script. */
export const navbarLabels: Record<Locale, NavbarLabels> = {
  en: {
    nav: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
    search: "Search",
    searchPlaceholder: "Type here",
    notifications: "Notifications",
    unread: "New notifications",
    account: "Account",
  },
  ar: {
    nav: "الرئيسي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    menuTitle: "القائمة",
    search: "بحث",
    searchPlaceholder: "اكتب هنا",
    notifications: "الإشعارات",
    unread: "إشعارات جديدة",
    account: "الحساب",
  },
}

export interface NavbarBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes for the 1248px content row inside the side padding. */
  contentClassName?: string
}

/**
 * A full-width row with Figma's side padding, `horizontal-padding` 16, 24 and
 * 32px, around content that stops at 1248px. Top and bottom padding are the
 * block's own.
 */
export function NavbarBar({ className, contentClassName, children, ...props }: NavbarBarProps) {
  return (
    <div className={cn("px-4 md:px-6 lg:px-8", className)} {...props}>
      <div className={cn("mx-auto flex w-full max-w-[1248px] items-center", contentClassName)}>{children}</div>
    </div>
  )
}

export interface NavbarLogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The logo: an `svg` or an `img`. Figma's Fasla Logo is 34px tall. Nothing shows without it. */
  children?: React.ReactNode
}

/** The logo, a link home. The row it sits in is 36px tall, as Figma's icon actions are. */
export function NavbarLogo({ href = "/", className, children, ...props }: NavbarLogoProps) {
  if (!children) return null
  return (
    <a
      href={href}
      className={cn(
        "flex h-9 shrink-0 items-center rounded-[var(--radius-sm)] outline-none focus-visible:ring-2 focus-visible:ring-ring [&>img]:h-[34px] [&>img]:w-auto [&>svg]:h-[34px] [&>svg]:w-auto",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

const LINK =
  "relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"

/** Figma's two link sizes: `SM/Medium` in the bar, `Base/Regular` in With Submenu's second row. */
const SIZE = { sm: "h-9 py-2 text-sm font-medium", base: "h-10 py-2 text-base" } as const

/** The current link, per indicator. The lines and the dot are drawn over the link, so it never changes size. */
const CURRENT: Record<NavbarIndicator, string> = {
  fill: "bg-accent text-accent-foreground",
  underline: "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground",
  // Figma's 2px stroke is centred on the edge: half of it hangs below.
  border: "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-foreground",
  dot: "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:mx-auto after:size-[5px] after:rounded-full after:bg-primary",
  text: "text-foreground",
}

export interface NavbarLinkStyle {
  /** How the current link is marked. */
  indicator?: NavbarIndicator
  /** The colour of the links that are not current: Figma uses both. */
  tone?: "foreground" | "muted"
  /** `sm` in the bar; `base` in With Submenu's second row. */
  size?: keyof typeof SIZE
}

function linkClasses({ indicator = "fill", tone = "foreground", size = "sm" }: NavbarLinkStyle, current: boolean) {
  // A line under the link reads against square corners, as Figma draws it.
  const lined = indicator === "underline" || indicator === "border"
  return cn(
    LINK,
    SIZE[size],
    lined ? "rounded-none" : "rounded-[var(--radius-sm)]",
    current
      ? CURRENT[indicator]
      : cn(
          tone === "muted" ? "text-muted-foreground hover:text-foreground" : "text-foreground",
          indicator === "fill" && "hover:bg-accent hover:text-accent-foreground"
        )
  )
}

/** Figma's 22px `chevron-down` and category icons. */
const GLYPH = "flex size-[1.375rem] shrink-0 items-center justify-center [&>svg]:size-full"

export interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, NavbarLinkStyle {
  current?: boolean
  /** An icon after the label. */
  icon?: React.ReactNode
}

/** Figma `Menu Item`: one link in the bar. */
export function NavbarLink({ current = false, indicator, tone, size, icon, className, children, ...props }: NavbarLinkProps) {
  return (
    <a aria-current={current ? "page" : undefined} className={cn(linkClasses({ indicator, tone, size }, current), className)} {...props}>
      {children}
      {icon ? (
        <span aria-hidden="true" className={GLYPH}>
          {icon}
        </span>
      ) : null}
    </a>
  )
}

export interface NavbarDropdownProps extends NavbarLinkStyle {
  label: string
  items: { label: string; href: string }[]
  current?: boolean
  className?: string
}

/** A `Menu Item` with Figma's chevron: it opens a Dropdown Menu of pages. */
export function NavbarDropdown({ label, items, current = false, indicator, tone, size, className }: NavbarDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-current={current ? "page" : undefined}
        // The chevron's 22px leaves 7px above and below, as in Figma.
        className={cn(linkClasses({ indicator, tone, size }, current), "py-[7px] data-[popup-open]:bg-accent", className)}
      >
        {label}
        <span aria-hidden="true" className={GLYPH}>
          <ChevronDown strokeWidth={1.5} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} render={<a href={item.href} />}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface NavbarLinksProps extends NavbarLinkStyle {
  links: NavbarLinkItem[]
  className?: string
}

/** The row of links, 8px apart. A link with `items` opens a menu. */
export function NavbarLinks({ links, indicator, tone, size, className }: NavbarLinksProps) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map((link) => (
        <li key={link.href} className="flex">
          {link.items?.length ? (
            <NavbarDropdown label={link.label} items={link.items} current={link.current} indicator={indicator} tone={tone} size={size} />
          ) : (
            <NavbarLink href={link.href} current={link.current} indicator={indicator} tone={tone} size={size} icon={link.icon}>
              {link.label}
            </NavbarLink>
          )}
        </li>
      ))}
    </ul>
  )
}

export interface NavbarIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The accessible name: the button shows only its icon. */
  label: string
  /** A lucide icon. */
  icon: React.ReactNode
  /** Makes it a link to this page. */
  href?: string
}

/** Figma's Icon Button: Ghost, Secondary, md (36px). */
export function NavbarIconButton({ label, icon, href, className, ...props }: NavbarIconButtonProps) {
  // A link styled as the button: `asChild` would not survive the shadcn CLI.
  if (href) {
    return (
      <a href={href} aria-label={label} className={buttonVariants({ variant: "ghost", size: "icon-md", className })}>
        {icon}
      </a>
    )
  }
  return (
    <Button type="button" variant="ghost" size="icon-md" aria-label={label} className={className} {...props}>
      {icon}
    </Button>
  )
}

export interface NavbarNotificationsProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The button's name. */
  label: string
  /** Shows the dot. */
  unread?: boolean
  /** The dot's name, read after the button's. */
  unreadLabel: string
}

/**
 * The bell, with Figma's notification dot: Status Indicator `busy`, 8px, at
 * the bell's top end. Figma turns the indicator's ring off here, so the bell's
 * outline stays whole under it.
 */
export function NavbarNotifications({ label, unread = true, unreadLabel, className, ...props }: NavbarNotificationsProps) {
  return (
    <Button type="button" variant="ghost" size="icon-md" className={cn("relative", className)} {...props}>
      <Bell />
      <span className="sr-only">{label}</span>
      {unread ? <StatusIndicator status="busy" label={unreadLabel} className="absolute end-1.5 top-2 ring-0" /> : null}
    </Button>
  )
}

export interface NavbarSearchProps extends Omit<InputProps, "label" | "startIcon"> {
  /** The field's name. The field shows no label, as in Figma. */
  label: string
}

/**
 * Figma's Default Input, md, with the search icon at its start, in a search
 * landmark so screen-reader users can jump to it. `className` sizes the field.
 */
export function NavbarSearch({ label, radius = "rounded", className, ...props }: NavbarSearchProps) {
  return (
    <div role="search" className={className}>
      <Input type="search" aria-label={label} radius={radius} startIcon={<Search />} className="w-full" {...props} />
    </div>
  )
}

export interface NavbarAccountProps {
  /** The person's name: the photo's alternative text, and the initials while it loads. */
  name: string
  /** The photo. */
  src?: string
  /** What the button opens, read after the name ("Chris Doe, Account"), when the account opens a menu. */
  label?: string
  /** Shows the name and a chevron beside the photo, and opens a menu of these pages. */
  items?: { label: string; href: string }[]
  /** Classes for the name and the chevron, to hide them on small screens. */
  detailClassName?: string
  className?: string
}

/** The account: Figma's Avatar, 32px and round, on its own or opening a menu. */
export function NavbarAccount({ name, src, label, items, detailClassName, className }: NavbarAccountProps) {
  const avatar = <Avatar variant="image" src={src} name={name} size="32" radius="rounded" />
  if (!items?.length) return <span className={cn("flex shrink-0", className)}>{avatar}</span>
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        // The visible name leads the accessible one (WCAG 2.5.3), so saying it reaches the button.
        aria-label={label ? `${name}, ${label}` : name}
        className={cn(
          "flex shrink-0 items-center gap-2.5 rounded-full text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        {avatar}
        <span className={cn("flex items-center gap-2.5", detailClassName)}>
          <span className="whitespace-nowrap">{name}</span>
          <span aria-hidden="true" className={GLYPH}>
            <ChevronDown strokeWidth={1.5} />
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} render={<a href={item.href} />}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface NavbarMenuProps {
  /** The links the bar hides at this size. A link with `items` lists its pages under it. */
  links: NavbarLinkItem[]
  /** The menu button's name. */
  label: string
  /** The Sheet's title. */
  title: string
  /** The Sheet's close button's name. */
  closeLabel?: string
  /** More of the bar's content, under the links. */
  children?: React.ReactNode
  /** The bar's actions that no longer fit, at the foot of the Sheet. */
  footer?: React.ReactNode
  /** Whether the Sheet is open, to control it. */
  open?: boolean
  /** Called when the Sheet opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Classes for the menu button: the block shows it only where the links collapse. */
  className?: string
}

const SHEET_LINK =
  "flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-base outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"

/**
 * Figma's `menu-2` Icon Button and the Sheet it opens from the end side,
 * holding the links the bar no longer shows, in the bar's order. Choosing a
 * link closes the Sheet.
 */
export function NavbarMenu({ links, label, title, closeLabel, children, footer, open, onOpenChange, className }: NavbarMenuProps) {
  const [ownOpen, setOwnOpen] = React.useState(false)
  const isOpen = open ?? ownOpen
  const setOpen = (next: boolean) => {
    if (open === undefined) setOwnOpen(next)
    onOpenChange?.(next)
  }
  const close = () => setOpen(false)
  // A link's own pages sit under it in `muted-foreground`, so the list keeps its hierarchy.
  const item = (link: { label: string; href: string; current?: boolean; icon?: React.ReactNode }, sub = false) => (
    <a
      href={link.href}
      onClick={close}
      aria-current={link.current ? "page" : undefined}
      className={cn(
        SHEET_LINK,
        link.current ? "bg-accent font-medium text-accent-foreground" : sub ? "text-muted-foreground" : "text-foreground"
      )}
    >
      {link.label}
      {link.icon ? (
        <span aria-hidden="true" className={GLYPH}>
          {link.icon}
        </span>
      ) : null}
    </a>
  )
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger render={<Button type="button" variant="ghost" size="icon-md" aria-label={label} className={className} />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="end" closeLabel={closeLabel}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <nav aria-label={title} className="flex flex-col gap-1 px-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                {item(link)}
                {link.items?.length ? (
                  <ul className="flex flex-col gap-1 ps-4">
                    {link.items.map((sub) => (
                      <li key={sub.href}>{item(sub, true)}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          {children}
        </nav>
        {footer ? <SheetFooter>{footer}</SheetFooter> : null}
      </SheetContent>
    </Sheet>
  )
}

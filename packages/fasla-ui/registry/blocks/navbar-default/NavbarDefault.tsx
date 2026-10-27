"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { NavbarBar, NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Default.
 *
 * The logo at the start and the links at the end, the current one on an
 * `accent` fill. Desktop and Tablet show the links; on Mobile they move into
 * the Sheet behind the menu button, and the logo stays.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarDefaultCopy {
  /** The links, in reading order. The `current` one carries the `accent` fill. */
  links: NavbarLinkItem[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarDefaultCopy> = {
  en: {
    links: [
      { label: "Home", href: "/", current: true },
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
    ],
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/", current: true },
      { label: "الخدمات", href: "/services" },
      { label: "المنتجات", href: "/products" },
    ],
  },
}

export interface NavbarDefaultProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarDefaultCopy> {
  /** Which language the default copy and labels are in. The page's `dir` sets the direction. */
  locale?: Locale
  /** Your logo, a link home: Figma shows the 34px Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Where the logo links.
   * @default "/"
   */
  logoHref?: string
  /** The names only assistive tech reads, in place of `locale`'s. */
  labels?: Partial<NavbarLabels>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

export function NavbarDefault({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  links,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarDefaultProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const items = links ?? COPY[locale].links

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-6">
        <div className="flex flex-1">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden md:block">
          <NavbarLinks links={items} indicator="fill" />
        </nav>
        <NavbarMenu
          links={items}
          label={l.openMenu}
          title={l.menuTitle}
          closeLabel={l.closeMenu}
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
          className="md:hidden"
        />
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarDefaultCopy = COPY

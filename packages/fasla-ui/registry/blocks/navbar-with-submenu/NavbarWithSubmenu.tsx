"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  NavbarAccount,
  NavbarBar,
  NavbarLinks,
  NavbarLogo,
  NavbarMenu,
  NavbarSearch,
  navbarLabels,
  type NavbarLabels,
  type NavbarLinkItem,
} from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=With Submenu.
 *
 * Two rows: the logo, a 288px search field and the account's avatar; then,
 * under a `border` line, the links in `Base/Regular`, the current one
 * underlined. On Mobile the second row moves into the Sheet behind the menu
 * button, and the search field takes a full-width row of its own under the
 * first, 12px below it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarWithSubmenuCopy {
  /** The second row's links, in reading order. A link with `items` opens a menu of them; the `current` one is underlined. */
  links: NavbarLinkItem[]
  /** The account holder's name: the avatar's alternative text, and its initials while the photo loads. */
  accountName: string
}

/** Figma's copy, English and Arabic. The menu's pages are not in Figma. */
const COPY: Record<Locale, NavbarWithSubmenuCopy> = {
  en: {
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services", current: true },
      {
        label: "Products",
        href: "/products",
        items: [
          { label: "All products", href: "/products" },
          { label: "New arrivals", href: "/products/new" },
          { label: "Best sellers", href: "/products/best-sellers" },
        ],
      },
    ],
    accountName: "Chris Doe",
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "الخدمات", href: "/services", current: true },
      {
        label: "المنتجات",
        href: "/products",
        items: [
          { label: "كل المنتجات", href: "/products" },
          { label: "وصل حديثًا", href: "/products/new" },
          { label: "الأكثر مبيعًا", href: "/products/best-sellers" },
        ],
      },
    ],
    accountName: "أحمد علي",
  },
}

export interface NavbarWithSubmenuProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarWithSubmenuCopy> {
  /** Which language the default copy and labels are in. The page's `dir` sets the direction. */
  locale?: Locale
  /** Your logo, a link home: Figma shows the 34px Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Where the logo links.
   * @default "/"
   */
  logoHref?: string
  /** The names only assistive tech reads, and the search placeholder, in place of `locale`'s. */
  labels?: Partial<NavbarLabels>
  /** The account photo. Without it the avatar shows the name's initials. */
  avatar?: string
  /** The search field's value, to control it. */
  searchValue?: string
  /** Called as the search field changes. */
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

export function NavbarWithSubmenu({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  links,
  accountName,
  avatar,
  searchValue,
  onSearchChange,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarWithSubmenuProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links

  return (
    <header className={cn("bg-background", className)} {...props}>
      {/* One search field: on Mobile it wraps to a row of its own, after the avatar and the menu button. */}
      <NavbarBar className="py-3" contentClassName="flex-wrap gap-x-4 gap-y-3">
        <div className="flex flex-1">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <NavbarSearch
          label={l.search}
          placeholder={l.searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          className="order-last w-full md:order-none md:w-72"
        />
        <NavbarAccount name={accountName ?? copy.accountName} src={avatar} />
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
      <nav aria-label={l.nav} className="hidden border-t border-border md:block">
        <NavbarBar className="py-2">
          <NavbarLinks links={items} indicator="underline" size="base" />
        </NavbarBar>
      </nav>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarWithSubmenuCopy = COPY

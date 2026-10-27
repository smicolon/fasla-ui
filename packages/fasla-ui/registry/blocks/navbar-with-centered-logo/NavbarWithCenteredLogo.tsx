"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  NavbarAccount,
  NavbarBar,
  NavbarIconButton,
  NavbarLogo,
  NavbarMenu,
  navbarLabels,
  type NavbarLabels,
  type NavbarLinkItem,
} from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=With Centered Logo.
 *
 * The menu button at the start, the logo in the middle, search and the
 * account's avatar at the end. The links live in the Sheet at every
 * breakpoint, so nothing collapses.
 */

type Locale = "en" | "ar"

export interface NavbarWithCenteredLogoCopy {
  /** The links the menu opens, in reading order. The `current` one is marked. */
  links: NavbarLinkItem[]
  /** The account holder's name: the avatar's alternative text, and its initials while the photo loads. */
  accountName: string
}

/** Figma's copy, English and Arabic. The menu's links are not in Figma. */
const COPY: Record<Locale, NavbarWithCenteredLogoCopy> = {
  en: {
    links: [
      { label: "Home", href: "/", current: true },
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
    ],
    accountName: "Chris Doe",
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/", current: true },
      { label: "الخدمات", href: "/services" },
      { label: "المنتجات", href: "/products" },
    ],
    accountName: "أحمد علي",
  },
}

export interface NavbarWithCenteredLogoProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarWithCenteredLogoCopy> {
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
  /** The account photo. Without it the avatar shows the name's initials. */
  avatar?: string
  /** Called when the search button is pressed. */
  onSearchClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

export function NavbarWithCenteredLogo({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  links,
  accountName,
  avatar,
  onSearchClick,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarWithCenteredLogoProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-4">
        <NavbarMenu
          links={links ?? copy.links}
          label={l.openMenu}
          title={l.menuTitle}
          closeLabel={l.closeMenu}
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
        />
        <div className="flex flex-1 justify-center">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <NavbarIconButton label={l.search} icon={<Search />} onClick={onSearchClick} />
        <NavbarAccount name={accountName ?? copy.accountName} src={avatar} />
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarWithCenteredLogoCopy = COPY

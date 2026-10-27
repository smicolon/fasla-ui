"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { NavbarAccount, NavbarBar, NavbarLogo, NavbarSearch, navbarLabels, type NavbarLabels } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=With Search Input.
 *
 * The logo, a 288px search field and the account's avatar. It has no links,
 * so it has no menu: on Mobile the search field takes a full-width row of its
 * own under the logo and the avatar, 12px below them.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarWithSearchInputCopy {
  /** The account holder's name: the avatar's alternative text, and its initials while the photo loads. */
  accountName: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarWithSearchInputCopy> = {
  en: { accountName: "Chris Doe" },
  ar: { accountName: "أحمد علي" },
}

export interface NavbarWithSearchInputProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarWithSearchInputCopy> {
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
}

export function NavbarWithSearchInput({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  accountName,
  avatar,
  searchValue,
  onSearchChange,
  className,
  ...props
}: NavbarWithSearchInputProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]

  return (
    <header className={cn("bg-background", className)} {...props}>
      {/* One search field: on Mobile it wraps to a row of its own, after the avatar. */}
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
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarWithSearchInputCopy = COPY

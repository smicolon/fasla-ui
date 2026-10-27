"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Centered Floating.
 *
 * A slim `background` pill in the middle of the page, 4px above and below and
 * 8px at its ends: the logo, four links in `muted-foreground` with the
 * current one in `foreground`, and a small round Solid button. On Mobile the
 * pill spans the width and the links move into the Sheet; the button still
 * fits, so it stays.
 *
 * The block itself has no fill: the pill floats on the page under it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarCenteredFloatingCopy {
  /** The links, in reading order. The `current` one is in `foreground`. */
  links: NavbarLinkItem[]
  /** The button's label. */
  ctaLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarCenteredFloatingCopy> = {
  en: {
    links: [
      { label: "Home", href: "/", current: true },
      { label: "Services", href: "/services" },
      { label: "About Us", href: "/about" },
      { label: "Pricing", href: "/pricing" },
    ],
    ctaLabel: "Log in",
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/", current: true },
      { label: "الخدمات", href: "/services" },
      { label: "من نحن", href: "/about" },
      { label: "التسعير", href: "/pricing" },
    ],
    ctaLabel: "تسجيل الدخول",
  },
}

export interface NavbarCenteredFloatingProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarCenteredFloatingCopy> {
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
  /** Called when the button is pressed. */
  onCtaClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

export function NavbarCenteredFloating({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  links,
  ctaLabel,
  onCtaClick,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarCenteredFloatingProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links

  return (
    <header className={cn("flex justify-center px-4 md:px-6 lg:px-8", className)} {...props}>
      <div className="flex w-full items-center gap-4 rounded-full bg-background px-2 py-1 md:w-auto">
        <div className="flex flex-1 md:flex-none">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden md:block">
          <NavbarLinks links={items} indicator="text" tone="muted" />
        </nav>
        <Button type="button" size="sm" radius="rounded" onClick={onCtaClick}>
          {ctaLabel ?? copy.ctaLabel}
        </Button>
        <NavbarMenu
          links={items}
          label={l.openMenu}
          title={l.menuTitle}
          closeLabel={l.closeMenu}
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
          className="md:hidden"
        />
      </div>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarCenteredFloatingCopy = COPY

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { NavbarBar, NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Active Action with Round.
 *
 * The logo, four links at the end in `muted-foreground`, the current one in
 * `foreground` with a 5px `primary` dot under it, and a small Outline button.
 * On Mobile the links move into the Sheet; the button still fits beside the
 * logo, so it stays.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarActiveActionWithRoundCopy {
  /** The links, in reading order. The `current` one has the dot. */
  links: NavbarLinkItem[]
  /** The button's label. */
  ctaLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarActiveActionWithRoundCopy> = {
  en: {
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing", current: true },
      { label: "About Us", href: "/about" },
    ],
    ctaLabel: "Log in",
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "الخدمات", href: "/services" },
      { label: "التسعير", href: "/pricing", current: true },
      { label: "من نحن", href: "/about" },
    ],
    ctaLabel: "تسجيل الدخول",
  },
}

export interface NavbarActiveActionWithRoundProps
  extends React.HTMLAttributes<HTMLElement>,
    Partial<NavbarActiveActionWithRoundCopy> {
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

export function NavbarActiveActionWithRound({
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
}: NavbarActiveActionWithRoundProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-6">
        <div className="flex flex-1">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden flex-1 justify-end md:flex">
          <NavbarLinks links={items} indicator="dot" tone="muted" />
        </nav>
        <Button type="button" variant="outline" tone="primary" size="sm" onClick={onCtaClick}>
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
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarActiveActionWithRoundCopy = COPY

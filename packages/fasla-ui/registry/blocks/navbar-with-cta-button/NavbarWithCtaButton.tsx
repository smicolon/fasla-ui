"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { NavbarBar, NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=With CTA Button.
 *
 * The logo, the links in the middle (the last opens a menu) and a Solid
 * button at the end. On Mobile the links move into the Sheet; the button
 * still fits beside the logo, so it stays.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarWithCtaButtonCopy {
  /** The links, in reading order. A link with `items` opens a menu of them; the `current` one carries the `accent` fill. */
  links: NavbarLinkItem[]
  /** The button's label. */
  ctaLabel: string
}

/** Figma's copy, English and Arabic. The menu's pages are not in Figma. */
const COPY: Record<Locale, NavbarWithCtaButtonCopy> = {
  en: {
    links: [
      { label: "Home", href: "/", current: true },
      { label: "Services", href: "/services" },
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
    ctaLabel: "Get Started",
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/", current: true },
      { label: "الخدمات", href: "/services" },
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
    ctaLabel: "ابدأ الآن",
  },
}

export interface NavbarWithCtaButtonProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarWithCtaButtonCopy> {
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

export function NavbarWithCtaButton({
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
}: NavbarWithCtaButtonProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-4">
        <div className="flex flex-1 md:flex-none">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden flex-1 justify-center md:flex">
          <NavbarLinks links={items} indicator="fill" />
        </nav>
        <Button type="button" size="md" onClick={onCtaClick}>
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
export const navbarWithCtaButtonCopy = COPY

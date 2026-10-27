"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Rounded.
 *
 * The bar as a `background` pill as wide as the content, 24px in from its
 * rounded ends: the logo, the links in the middle with a `primary` dot under
 * the current one, and a Solid button. On Mobile the button no longer fits
 * beside the logo, so it moves into the Sheet with the links.
 *
 * The block itself has no fill: the pill floats on the page under it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarRoundedCopy {
  /** The links, in reading order. A link with `items` opens a menu of them; the `current` one has the dot. */
  links: NavbarLinkItem[]
  /** The button's label. */
  ctaLabel: string
}

/** Figma's copy, English and Arabic. The menu's pages are not in Figma. */
const COPY: Record<Locale, NavbarRoundedCopy> = {
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

export interface NavbarRoundedProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarRoundedCopy> {
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
  /** Called when the button is pressed, in the bar or in the Sheet. */
  onCtaClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

export function NavbarRounded({
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
}: NavbarRoundedProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links
  const cta = ctaLabel ?? copy.ctaLabel

  return (
    <header className={cn("px-4 md:px-6 lg:px-8", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] items-center gap-4 rounded-full bg-background px-6 py-3">
        <div className="flex flex-1 md:flex-none">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden flex-1 justify-center md:flex">
          <NavbarLinks links={items} indicator="dot" />
        </nav>
        <Button type="button" size="md" onClick={onCtaClick} className="hidden md:inline-flex">
          {cta}
        </Button>
        <NavbarMenu
          links={items}
          label={l.openMenu}
          title={l.menuTitle}
          closeLabel={l.closeMenu}
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
          className="md:hidden"
          footer={
            <Button type="button" size="md" onClick={onCtaClick}>
              {cta}
            </Button>
          }
        />
      </div>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarRoundedCopy = COPY

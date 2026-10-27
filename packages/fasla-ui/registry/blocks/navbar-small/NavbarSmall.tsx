"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Small.
 *
 * A `card` panel hanging from the top of the page, centred and only as wide
 * as what it holds, its bottom corners rounded (Figma `border radius/xl`,
 * 14px): the logo, the links with a `primary` dot under the current one, and
 * a small Outline button. On Mobile the panel spans the width; the links and
 * the button no longer fit in it, so they move into the Sheet.
 *
 * The block itself has no fill: the panel sits on the page under it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarSmallCopy {
  /** The links, in reading order. A link with `items` opens a menu of them; the `current` one has the dot. */
  links: NavbarLinkItem[]
  /** The button's label. */
  ctaLabel: string
}

/** Figma's copy, English and Arabic. The menu's pages are not in Figma. */
const COPY: Record<Locale, NavbarSmallCopy> = {
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
    ctaLabel: "Log in",
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
    ctaLabel: "تسجيل الدخول",
  },
}

export interface NavbarSmallProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarSmallCopy> {
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

export function NavbarSmall({
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
}: NavbarSmallProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links
  const cta = ctaLabel ?? copy.ctaLabel

  return (
    <header className={cn("flex justify-center px-4 md:px-6 lg:px-8", className)} {...props}>
      {/* Figma `border radius/xl`: no class is 14px in both apps. */}
      <div className="flex w-full items-center gap-6 rounded-b-[14px] bg-card p-6 text-card-foreground md:w-auto">
        <div className="flex flex-1 md:flex-none">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden md:block">
          <NavbarLinks links={items} indicator="dot" />
        </nav>
        <Button type="button" variant="outline" tone="primary" size="sm" onClick={onCtaClick} className="hidden md:inline-flex">
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
            <Button type="button" variant="outline" tone="primary" size="md" onClick={onCtaClick}>
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
export const navbarSmallCopy = COPY

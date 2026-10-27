"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { SocialIcon, SOCIAL_PLATFORM_NAMES, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { NavbarBar, NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Extended at Top.
 *
 * A 40px `primary` band over Default's bar: the contact email at the start,
 * after a mail icon, and the social marks at the end, all in
 * `primary-foreground`. On Mobile the bar's links move into the Sheet; the
 * band keeps everything.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarExtendedAtTopSocial {
  /** Which platform's mark. Its name is the link's accessible name. */
  platform: SocialPlatform
  href: string
}

export interface NavbarExtendedAtTopCopy {
  /** The links, in reading order. The `current` one carries the `accent` fill. */
  links: NavbarLinkItem[]
  /** The contact address in the band. */
  email: string
  /** The social links in the band, in reading order. */
  socials: NavbarExtendedAtTopSocial[]
}

const SOCIALS: NavbarExtendedAtTopSocial[] = [
  { platform: "github", href: "https://github.com" },
  { platform: "facebook", href: "https://facebook.com" },
  { platform: "x", href: "https://x.com" },
  { platform: "google", href: "https://google.com" },
]

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarExtendedAtTopCopy> = {
  en: {
    links: [
      { label: "Home", href: "/", current: true },
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
    ],
    email: "hello@Fasla.com",
    socials: SOCIALS,
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/", current: true },
      { label: "الخدمات", href: "/services" },
      { label: "المنتجات", href: "/products" },
    ],
    email: "hello@Fasla.com",
    socials: SOCIALS,
  },
}

export interface NavbarExtendedAtTopProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarExtendedAtTopCopy> {
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

export function NavbarExtendedAtTop({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  links,
  email,
  socials,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarExtendedAtTopProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links
  const address = email ?? copy.email

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="bg-primary py-2 text-primary-foreground" contentClassName="justify-between gap-6">
        <a
          href={`mailto:${address}`}
          className="flex min-w-0 items-center gap-2 rounded-[var(--radius-sm)] text-base outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
        >
          <Mail aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0" />
          {/* An address reads left to right in both directions. */}
          <span dir="ltr" className="truncate">
            {address}
          </span>
        </a>
        <ul className="flex shrink-0 items-center gap-4">
          {(socials ?? copy.socials).map((social) => (
            <li key={social.platform} className="flex">
              <a
                href={social.href}
                aria-label={SOCIAL_PLATFORM_NAMES[social.platform]}
                className="rounded-[var(--radius-xs)] outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              >
                <SocialIcon platform={social.platform} color="current" className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </NavbarBar>
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
export const navbarExtendedAtTopCopy = COPY

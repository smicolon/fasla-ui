"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { NavbarBar, NavbarLinks, NavbarLogo, NavbarMenu, navbarLabels, type NavbarLabels, type NavbarLinkItem } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Multiple Action.
 *
 * The logo, the links at the end with a `foreground` line under the current
 * one, then two small buttons: Outline to log in, Solid to sign up. On Mobile
 * the links and the Outline button move into the Sheet; the Solid button
 * stays beside the logo.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarMultipleActionCopy {
  /** The links, in reading order. The `current` one is underlined. */
  links: NavbarLinkItem[]
  /** The Outline button's label. */
  logInLabel: string
  /** The Solid button's label. */
  signUpLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarMultipleActionCopy> = {
  en: {
    links: [
      { label: "Home", href: "/", current: true },
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
    ],
    logInLabel: "Log in",
    signUpLabel: "Sign up",
  },
  ar: {
    links: [
      { label: "الرئيسية", href: "/", current: true },
      { label: "الخدمات", href: "/services" },
      { label: "المنتجات", href: "/products" },
    ],
    logInLabel: "تسجيل الدخول",
    signUpLabel: "إنشاء حساب",
  },
}

export interface NavbarMultipleActionProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarMultipleActionCopy> {
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
  /** Called when the Outline button is pressed, in the bar or in the Sheet. */
  onLogInClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Called when the Solid button is pressed. */
  onSignUpClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

export function NavbarMultipleAction({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  links,
  logInLabel,
  signUpLabel,
  onLogInClick,
  onSignUpClick,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarMultipleActionProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = links ?? copy.links
  const logIn = logInLabel ?? copy.logInLabel

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-6">
        <div className="flex flex-1">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <nav aria-label={l.nav} className="hidden flex-1 justify-end md:flex">
          <NavbarLinks links={items} indicator="underline" />
        </nav>
        <Button type="button" variant="outline" tone="primary" size="sm" onClick={onLogInClick} className="hidden md:inline-flex">
          {logIn}
        </Button>
        <Button type="button" size="sm" onClick={onSignUpClick}>
          {signUpLabel ?? copy.signUpLabel}
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
            <Button type="button" variant="outline" tone="primary" size="md" onClick={onLogInClick}>
              {logIn}
            </Button>
          }
        />
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarMultipleActionCopy = COPY

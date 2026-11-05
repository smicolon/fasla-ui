"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet/sheet"

/*
 * Figma: `Mahaam Template` (47694:6712), the Navbar section of each of its six
 * variants (Breakpoint Desktop / Tablet / Mobile × Direction LTR / RTL).
 *
 * The wordmark at the start, the links, and the actions at the end. The links
 * show from Tablet up (20px apart, 32px on Desktop). On Mobile the links and
 * Sign in leave the bar for a Sheet behind an outline Icon Button, and Get
 * Mahaam stays. The bar has no fill and no border.
 *
 * Sized by the section's own width, as the other blocks are: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop (1440). Direction is the page's `dir`: every
 * side is a logical one, so the same markup is Figma's RTL variant. The check
 * in the mark is not mirrored; the Menu icon is symmetric.
 */

type Locale = "en" | "ar"

export interface MahaamNavbarLink {
  label: string
  href: string
}

export interface MahaamNavbarCopy {
  /** The wordmark's text, next to the mark. Latin in English, «مهام» in Arabic. */
  brand: string
  /** The links, in reading order. */
  links: MahaamNavbarLink[]
  /** The quiet button. It moves into the Sheet on Mobile. */
  signIn: string
  /** The solid button. */
  cta: string
  /** The names only assistive tech reads. */
  labels: {
    nav: string
    openMenu: string
    closeMenu: string
    menuTitle: string
  }
}

/** Figma's copy, English and Arabic. «مهام» is masculine. */
const COPY: Record<Locale, MahaamNavbarCopy> = {
  en: {
    brand: "mahaam",
    links: [
      { label: "Product", href: "#product" },
      { label: "For teams", href: "#teams" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
    ],
    signIn: "Sign in",
    cta: "Get Mahaam",
    labels: { nav: "Main", openMenu: "Open menu", closeMenu: "Close menu", menuTitle: "Menu" },
  },
  ar: {
    brand: "مهام",
    links: [
      { label: "المنتج", href: "#product" },
      { label: "للفرق", href: "#teams" },
      { label: "الأسعار", href: "#pricing" },
      { label: "سجل التحديثات", href: "#changelog" },
    ],
    signIn: "تسجيل الدخول",
    cta: "احصل على مهام",
    labels: { nav: "الرئيسي", openMenu: "فتح القائمة", closeMenu: "إغلاق القائمة", menuTitle: "القائمة" },
  },
}

export interface MahaamNavbarProps extends React.HTMLAttributes<HTMLElement>, Partial<Omit<MahaamNavbarCopy, "labels">> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** The names only assistive tech reads, in place of `locale`'s. */
  labels?: Partial<MahaamNavbarCopy["labels"]>
  /**
   * Where the wordmark links.
   * @default "/"
   */
  homeHref?: string
  /**
   * Where Sign in goes.
   * @default "#sign-in"
   */
  signInHref?: string
  /**
   * Where Get Mahaam goes.
   * @default "#get-mahaam"
   */
  ctaHref?: string
  /** Whether the menu's Sheet is open on Mobile, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

/** The mark: a 26px ink square, radius/lg 10, with a round-capped check in `background`. Not mirrored in RTL. */
export function MahaamMark() {
  return (
    <span aria-hidden="true" className="flex size-[26px] shrink-0 items-center justify-center rounded-[10px] bg-foreground">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="overflow-visible">
        <path d="M0 4.29 3.2 8 10 0" className="stroke-background" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function MahaamNavbar({
  locale = "en",
  brand,
  links,
  signIn,
  cta,
  labels,
  homeHref = "/",
  signInHref = "#sign-in",
  ctaHref = "#get-mahaam",
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: MahaamNavbarProps) {
  const copy = COPY[locale]
  const l = { ...copy.labels, ...labels }
  const items = links ?? copy.links
  const [ownOpen, setOwnOpen] = React.useState(false)
  const isOpen = menuOpen ?? ownOpen
  const setOpen = (next: boolean) => {
    if (menuOpen === undefined) setOwnOpen(next)
    onMenuOpenChange?.(next)
  }

  return (
    <header className={cn("[container-type:inline-size]", className)} {...props}>
      {/* 32px side padding on Mobile, 64 on Tablet, 48 on Desktop (spacing/8, /16, /12); the row is 36px between 20px above and below. */}
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-8 [@container(min-width:48rem)]:px-16 [@container(min-width:90rem)]:px-12">
        <a
          href={homeHref}
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] text-xl font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MahaamMark />
          {brand ?? copy.brand}
        </a>

        <nav aria-label={l.nav} className="hidden [@container(min-width:48rem)]:block">
          <ul className="flex items-center gap-5 [@container(min-width:90rem)]:gap-8">
            {items.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-[var(--radius-sm)] text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <a href={signInHref} className={buttonVariants({ variant: "ghost", tone: "primary", className: "hidden [@container(min-width:48rem)]:inline-flex" })}>
            {signIn ?? copy.signIn}
          </a>
          <a href={ctaHref} className={buttonVariants()}>
            {cta ?? copy.cta}
          </a>
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button type="button" variant="outline" tone="primary" size="icon-md" aria-label={l.openMenu} className="[@container(min-width:48rem)]:hidden" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="end" closeLabel={l.closeMenu}>
              <SheetHeader>
                <SheetTitle>{l.menuTitle}</SheetTitle>
              </SheetHeader>
              <nav aria-label={l.menuTitle} className="px-4">
                <ul className="flex flex-col gap-1">
                  {items.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-2 text-base text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <SheetFooter>
                <a href={signInHref} className={buttonVariants({ variant: "ghost", tone: "primary" })}>
                  {signIn ?? copy.signIn}
                </a>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamNavbarCopy = COPY

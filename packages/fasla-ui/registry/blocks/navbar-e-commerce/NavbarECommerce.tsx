"use client"

import * as React from "react"
import { Baby, Bike, Brush, Computer, Heart, House, Laptop, Paintbrush, PencilRuler, ShoppingCart } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  NavbarAccount,
  NavbarBar,
  NavbarIconButton,
  NavbarLinks,
  NavbarLogo,
  NavbarMenu,
  NavbarSearch,
  navbarLabels,
  type NavbarLabels,
  type NavbarLinkItem,
} from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=E-commerce.
 *
 * A shop's header in two rows. The first: the logo, a search field that
 * takes the room between, and home, wishlist, cart and the account 24px apart.
 * The second, under a `border` line: the categories, each with its icon after
 * its name, the current one on an `accent` fill.
 *
 * Tablet hides the category row behind the menu button and closes the 112px
 * gaps around the search field to 24px. Mobile keeps the logo, the cart and
 * the menu button; the search field takes a full-width row of its own, and
 * home, wishlist and the account join the categories in the Sheet.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarECommerceCopy {
  /** The categories, in reading order, each with an icon after its name. The `current` one carries the `accent` fill. */
  categories: NavbarLinkItem[]
  /** The home button's name. */
  homeLabel: string
  /** The wishlist button's name. */
  wishlistLabel: string
  /** The cart button's name. */
  cartLabel: string
  /** The account holder's name: the avatar's alternative text, and its initials while the photo loads. */
  accountName: string
}

const ICONS = [<Brush key="a" />, <PencilRuler key="b" />, <Computer key="c" />, <Bike key="d" />, <Baby key="e" />, <Paintbrush key="f" />, <House key="g" />, <Laptop key="h" />]
const HREFS = ["/art", "/study", "/electronics", "/sport", "/toys", "/painting", "/house", "/computers"]
const categories = (names: string[]): NavbarLinkItem[] =>
  names.map((label, index) => ({ label, href: HREFS[index]!, icon: ICONS[index], current: index === 1 }))

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarECommerceCopy> = {
  en: {
    categories: categories(["Art & craft", "Study", "Electronics", "Sport", "Toys", "Painting", "House accessories", "Computer"]),
    homeLabel: "Home",
    wishlistLabel: "Wishlist",
    cartLabel: "Cart",
    accountName: "Chris Doe",
  },
  ar: {
    categories: categories(["الفنون والحِرف", "الدراسة", "الإلكترونيات", "الرياضة", "الألعاب", "الرسم", "مستلزمات المنزل", "الكمبيوتر"]),
    homeLabel: "الرئيسية",
    wishlistLabel: "المفضلة",
    cartLabel: "سلة التسوق",
    accountName: "أحمد علي",
  },
}

export interface NavbarECommerceProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarECommerceCopy> {
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
  /**
   * Where home links.
   * @default "/"
   */
  homeHref?: string
  /**
   * Where the wishlist links.
   * @default "/wishlist"
   */
  wishlistHref?: string
  /**
   * Where the cart links.
   * @default "/cart"
   */
  cartHref?: string
  /**
   * Where the account links, in the Sheet.
   * @default "/account"
   */
  accountHref?: string
  /** The search field's value, to control it. */
  searchValue?: string
  /** Called as the search field changes. */
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>
  /** Whether the menu's Sheet is open, to control it. */
  menuOpen?: boolean
  /** Called when the menu's Sheet opens or closes. */
  onMenuOpenChange?: (open: boolean) => void
}

const SHEET_EXTRA =
  "flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-2 text-base text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"

export function NavbarECommerce({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  categories: categoryLinks,
  homeLabel,
  wishlistLabel,
  cartLabel,
  accountName,
  avatar,
  homeHref = "/",
  wishlistHref = "/wishlist",
  cartHref = "/cart",
  accountHref = "/account",
  searchValue,
  onSearchChange,
  menuOpen,
  onMenuOpenChange,
  className,
  ...props
}: NavbarECommerceProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]
  const items = categoryLinks ?? copy.categories
  const home = homeLabel ?? copy.homeLabel
  const wishlist = wishlistLabel ?? copy.wishlistLabel

  return (
    <header className={cn("bg-background", className)} {...props}>
      {/* One search field: on Mobile it wraps to a row of its own, after the cart and the menu button. */}
      <NavbarBar className="py-3" contentClassName="flex-wrap gap-x-6 gap-y-3 lg:gap-x-28">
        <div className="flex flex-1 md:flex-none">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <NavbarSearch
          label={l.search}
          placeholder={l.searchPlaceholder}
          radius="standard"
          value={searchValue}
          onChange={onSearchChange}
          className="order-last w-full md:order-none md:w-auto md:min-w-0 md:flex-1"
        />
        <div className="flex items-center gap-6">
          <NavbarIconButton label={home} icon={<House />} href={homeHref} className="hidden md:inline-flex" />
          <NavbarIconButton label={wishlist} icon={<Heart />} href={wishlistHref} className="hidden md:inline-flex" />
          <NavbarIconButton label={cartLabel ?? copy.cartLabel} icon={<ShoppingCart />} href={cartHref} />
          <NavbarAccount name={accountName ?? copy.accountName} src={avatar} className="hidden md:flex" />
          <NavbarMenu
            links={items}
            label={l.openMenu}
            title={l.menuTitle}
            closeLabel={l.closeMenu}
            open={menuOpen}
            onOpenChange={onMenuOpenChange}
            className="lg:hidden"
          >
            {/* On Tablet these stay in the bar; on Mobile they join the categories here. */}
            <ul className="mt-2 flex flex-col gap-1 border-t border-border pt-2 md:hidden">
              <li>
                <a href={homeHref} className={SHEET_EXTRA}>
                  {home}
                </a>
              </li>
              <li>
                <a href={wishlistHref} className={SHEET_EXTRA}>
                  {wishlist}
                </a>
              </li>
              <li>
                <a href={accountHref} className={SHEET_EXTRA}>
                  {l.account}
                </a>
              </li>
            </ul>
          </NavbarMenu>
        </div>
      </NavbarBar>
      <nav aria-label={l.nav} className="hidden border-t border-border lg:block">
        <NavbarBar className="py-1.5">
          <NavbarLinks links={items} indicator="fill" className="gap-6" />
        </NavbarBar>
      </nav>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarECommerceCopy = COPY

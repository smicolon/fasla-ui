"use client"

import * as React from "react"
import { Mail, Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  NavbarAccount,
  NavbarBar,
  NavbarIconButton,
  NavbarLogo,
  NavbarNotifications,
  navbarLabels,
  type NavbarLabels,
} from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=Multiple Icon.
 *
 * The logo, then the bell with its notification dot, messages, search and the
 * account: the avatar, the name and a chevron that opens the account's menu.
 * It has no links, so it has no menu button: on Mobile the account shows its
 * avatar alone and the four icons close up from 16px to 8px apart.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

type Locale = "en" | "ar"

export interface NavbarMultipleIconCopy {
  /** The account holder's name, beside the avatar. */
  accountName: string
  /** The account menu's pages. */
  accountItems: { label: string; href: string }[]
  /** The messages button's name. */
  messagesLabel: string
}

/** Figma's copy, English and Arabic. The account menu's pages are not in Figma. */
const COPY: Record<Locale, NavbarMultipleIconCopy> = {
  en: {
    accountName: "Chris Doe",
    accountItems: [
      { label: "Profile", href: "/account" },
      { label: "Settings", href: "/settings" },
      { label: "Log out", href: "/logout" },
    ],
    messagesLabel: "Messages",
  },
  ar: {
    accountName: "أحمد علي",
    accountItems: [
      { label: "الملف الشخصي", href: "/account" },
      { label: "الإعدادات", href: "/settings" },
      { label: "تسجيل الخروج", href: "/logout" },
    ],
    messagesLabel: "الرسائل",
  },
}

export interface NavbarMultipleIconProps extends React.HTMLAttributes<HTMLElement>, Partial<NavbarMultipleIconCopy> {
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
  /** The account photo. Without it the avatar shows the name's initials. */
  avatar?: string
  /**
   * Shows the notification dot on the bell.
   * @default true
   */
  unread?: boolean
  /** Called when the bell is pressed. */
  onNotificationsClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Called when the messages button is pressed. */
  onMessagesClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Called when the search button is pressed. */
  onSearchClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function NavbarMultipleIcon({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  accountName,
  accountItems,
  messagesLabel,
  avatar,
  unread = true,
  onNotificationsClick,
  onMessagesClick,
  onSearchClick,
  className,
  ...props
}: NavbarMultipleIconProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-2 md:gap-4">
        <div className="flex flex-1">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <NavbarNotifications label={l.notifications} unread={unread} unreadLabel={l.unread} onClick={onNotificationsClick} />
        <NavbarIconButton label={messagesLabel ?? copy.messagesLabel} icon={<Mail />} onClick={onMessagesClick} />
        <NavbarIconButton label={l.search} icon={<Search />} onClick={onSearchClick} />
        <NavbarAccount
          name={accountName ?? copy.accountName}
          src={avatar}
          label={l.account}
          items={accountItems ?? copy.accountItems}
          detailClassName="hidden md:flex"
        />
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarMultipleIconCopy = COPY

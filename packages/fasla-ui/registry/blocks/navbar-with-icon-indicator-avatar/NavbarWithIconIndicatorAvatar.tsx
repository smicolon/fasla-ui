"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { NavbarAccount, NavbarBar, NavbarLogo, NavbarNotifications, navbarLabels, type NavbarLabels } from "../navbar/navbar"

/*
 * Figma: `Navbar` (4103:4910), Type=With Icon Indicator & Avatar.
 *
 * The logo, then the bell with its notification dot and the account's
 * avatar at the end. It has no links, so nothing collapses: the bar is the
 * same at every breakpoint but for its side padding.
 */

type Locale = "en" | "ar"

export interface NavbarWithIconIndicatorAvatarCopy {
  /** The account holder's name: the avatar's alternative text, and its initials while the photo loads. */
  accountName: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, NavbarWithIconIndicatorAvatarCopy> = {
  en: { accountName: "Chris Doe" },
  ar: { accountName: "أحمد علي" },
}

export interface NavbarWithIconIndicatorAvatarProps
  extends React.HTMLAttributes<HTMLElement>,
    Partial<NavbarWithIconIndicatorAvatarCopy> {
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
}

export function NavbarWithIconIndicatorAvatar({
  locale = "en",
  logo,
  logoHref = "/",
  labels,
  accountName,
  avatar,
  unread = true,
  onNotificationsClick,
  className,
  ...props
}: NavbarWithIconIndicatorAvatarProps) {
  const l = { ...navbarLabels[locale], ...labels }
  const copy = COPY[locale]

  return (
    <header className={cn("bg-background", className)} {...props}>
      <NavbarBar className="py-3" contentClassName="gap-4">
        <div className="flex flex-1">
          <NavbarLogo href={logoHref}>{logo}</NavbarLogo>
        </div>
        <NavbarNotifications label={l.notifications} unread={unread} unreadLabel={l.unread} onClick={onNotificationsClick} />
        <NavbarAccount name={accountName ?? copy.accountName} src={avatar} />
      </NavbarBar>
    </header>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const navbarWithIconIndicatorAvatarCopy = COPY

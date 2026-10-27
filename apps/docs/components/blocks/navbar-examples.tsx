import * as React from "react"
import { FaslaLogo } from "../../../../packages/fasla-ui/registry/ui/fasla-logo/fasla-logo"

/**
 * What the Navbar examples pass besides `locale`: the Fasla Logo in the logo
 * slot, and the account photo no block ships with, hosted with the docs site
 * in public/blocks/navbar/. The docs previews and the Storybook stories both
 * read them from here, so the two show the same example. Imported by relative
 * path, as Storybook has no `@/` alias.
 */

// Built once, not per render: Storybook's source panel and React both expect
// the same element each time.
const LOGO: React.ReactElement = <FaslaLogo />
const AVATAR = "/blocks/navbar/avatar.webp"

/** The Types that show the account's avatar. */
const WITH_AVATAR = new Set([
  "navbar-with-icon-indicator-avatar",
  "navbar-with-centered-logo",
  "navbar-with-submenu",
  "navbar-with-search-input",
  "navbar-multiple-icon",
  "navbar-e-commerce",
])

/** The example props for one Navbar block. */
export function navbarExample(slug: string): Record<string, unknown> {
  return WITH_AVATAR.has(slug) ? { logo: LOGO, avatar: AVATAR } : { logo: LOGO }
}

/*
 * A docs preview frame is as tall as what it holds, as on every block page. A
 * navbar alone is 44 to 116px, so each Type adds only the room what it opens
 * needs inside the frame: 160px for a Dropdown Menu where its links show
 * (Tablet and Desktop; the account menu at every width), and 360px in all for
 * the Sheet where the menu button shows. Base classes are Mobile (360), `md:`
 * Tablet (768), `lg:` Desktop (1440).
 */
const SHEET = "min-h-[360px] md:min-h-0"
const DROPDOWN = "md:pb-40"
const ROOM: Record<string, string> = {
  "navbar-default": SHEET,
  "navbar-with-dropdown": `${SHEET} ${DROPDOWN}`,
  "navbar-with-icon-indicator-avatar": "",
  // Its menu button shows at every width.
  "navbar-with-centered-logo": "min-h-[360px]",
  "navbar-with-cta-button": `${SHEET} ${DROPDOWN}`,
  "navbar-with-submenu": `${SHEET} ${DROPDOWN}`,
  "navbar-rounded": `${SHEET} ${DROPDOWN}`,
  "navbar-with-search-input": "",
  // The account opens a menu at every width.
  "navbar-multiple-icon": "pb-40",
  "navbar-multiple-action": SHEET,
  "navbar-extended-at-top": SHEET,
  "navbar-small": `${SHEET} ${DROPDOWN}`,
  "navbar-rounded-small": `${SHEET} ${DROPDOWN}`,
  "navbar-centered-floating": SHEET,
  "navbar-active-action-with-border": SHEET,
  "navbar-active-action-with-round": SHEET,
  // Its menu button shows on Mobile and Tablet.
  "navbar-e-commerce": "min-h-[360px] lg:min-h-0",
}

/**
 * The room under a navbar in an example. In a docs preview frame: what the
 * Type opens needs, per `ROOM`. In Storybook (`short`), whose canvas is the
 * whole window: a strip of `muted` page the floating pills read against.
 */
export function NavbarStage({ slug, short = false, children }: { slug: string; short?: boolean; children: React.ReactNode }) {
  if (short) return <div className="flex min-h-40 flex-col bg-muted">{children}</div>
  return <div className={ROOM[slug]}>{children}</div>
}

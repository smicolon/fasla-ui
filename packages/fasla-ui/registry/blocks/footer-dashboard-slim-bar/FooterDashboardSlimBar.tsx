import * as React from "react"
import { LifeBuoyIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { StatusIndicator } from "../../ui/status-indicator/status-indicator"
import { FooterDot, FooterLinkItem, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Dashboard Slim Bar.
 *
 * One thin bar under an app: on one side the system status (an 8px online dot
 * and "System status"), then the version ("Latest") and its Changelog link; on
 * the other a keyboard hint (the key and "to search"), three links
 * (Documentation, Support, Send feedback) and a help Icon Button. A 1px top
 * border; no logo, no copyright. No motion: Figma has no chip for this Type.
 *
 * Figma drops items as the width falls, and this does the same, by the
 * block's own width: Desktop (1440, 58px tall) shows everything; Tablet (768,
 * 50px) drops the search hint; Mobile (360, 78px) drops the hint and the three
 * links, stacks the status line over the help button and lets the status line
 * wrap. The bar runs the full width with 24px (16 on phones) at each side, not
 * the 1280 column the other footers use.
 */

export interface FooterDashboardSlimBarCopy {
  /** The status line, next to the dot. */
  status: string
  /** The accessible name of the dot. */
  statusLabel: string
  /** The version label. */
  version: string
  changelog: FooterLink
  /** The words after the key. */
  searchHint: string
  /** The key itself. */
  searchKey: string
  links: FooterLink[]
  /** The help button's accessible name. */
  helpLabel: string
  /** Accessible name of the release link group. */
  releaseLabel: string
  /** Accessible name of the help link group. */
  helpLinksLabel: string
}

const COPY: Record<FooterLocale, FooterDashboardSlimBarCopy> = {
  en: {
    status: "System status",
    statusLabel: "Online",
    version: "Latest",
    changelog: { label: "Changelog", href: "#" },
    searchHint: "to search",
    searchKey: "⌘K",
    links: ["Documentation", "Support", "Send feedback"].map((label) => ({ label, href: "#" })),
    helpLabel: "Help",
    releaseLabel: "Release",
    helpLinksLabel: "Help",
  },
  ar: {
    status: "حالة النظام",
    statusLabel: "متصل",
    version: "الأحدث",
    changelog: { label: "سجل التغييرات", href: "#" },
    searchHint: "للبحث",
    searchKey: "⌘K",
    links: ["التوثيق", "الدعم", "أرسل ملاحظاتك"].map((label) => ({ label, href: "#" })),
    helpLabel: "المساعدة",
    releaseLabel: "الإصدار",
    helpLinksLabel: "المساعدة",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerDashboardSlimBarCopy = COPY

export interface FooterDashboardSlimBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterDashboardSlimBarCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** Called when the help button is pressed. */
  onHelp?: () => void
}

const T = "[@container(min-width:40rem)]:"
const D = "[@container(min-width:64rem)]:"

export function FooterDashboardSlimBar({
  locale = "en",
  status,
  statusLabel,
  version,
  changelog,
  searchHint,
  searchKey,
  links,
  helpLabel,
  releaseLabel,
  helpLinksLabel,
  onHelp,
  className,
  ...props
}: FooterDashboardSlimBarProps) {
  const copy = COPY[locale]
  const items = links ?? copy.links
  const log = changelog ?? copy.changelog
  return (
    <FooterSection
      className={cn("border-t border-border px-4 py-3 md:px-6 lg:px-6 lg:py-4", className)}
      contentClassName="max-w-none"
      {...props}
    >
      <div className={cn("flex flex-col gap-3", T + "flex-row", T + "items-center", T + "justify-between", T + "gap-5", D + "gap-6")}>
        <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", T + "flex-nowrap", D + "gap-4")}>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <StatusIndicator status="online" size="8" label={statusLabel ?? copy.statusLabel} />
            {status ?? copy.status}
          </span>
          <FooterDot className="text-border opacity-100" />
          <span className="text-xs font-medium text-foreground">{version ?? copy.version}</span>
          <nav aria-label={releaseLabel ?? copy.releaseLabel} className="flex">
            <FooterLinkItem link={log} className="text-xs" />
          </nav>
        </div>
        <div className={cn("flex items-center", T + "gap-4", D + "gap-5")}>
          <div className={cn("hidden items-center gap-2", D + "flex")}>
            <kbd className="inline-flex h-5 items-center rounded-xs border border-border bg-secondary px-2 text-xs font-medium text-secondary-foreground">
              <bdi dir="ltr">{searchKey ?? copy.searchKey}</bdi>
            </kbd>
            <span className="text-xs text-muted-foreground">{searchHint ?? copy.searchHint}</span>
          </div>
          {items.length ? (
            <nav aria-label={helpLinksLabel ?? copy.helpLinksLabel} className={cn("hidden", T + "flex")}>
              <ul className={cn("flex items-center gap-4", D + "gap-5")}>
                {items.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-xs" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <Button variant="ghost" size="icon-xs" aria-label={helpLabel ?? copy.helpLabel} onClick={onHelp}>
            <LifeBuoyIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </FooterSection>
  )
}

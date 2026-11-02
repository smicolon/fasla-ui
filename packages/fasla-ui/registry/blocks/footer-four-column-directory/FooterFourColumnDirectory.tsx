import * as React from "react"
import { cn } from "../../../src/lib/utils"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FooterBrand,
  FooterLegalBar,
  FooterLinkColumn,
  FooterRule,
  FooterSection,
  FooterSocial,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Four-Column Directory.
 *
 * The plain directory: the brand block (the logo, a one-sentence blurb and
 * five social marks) beside four link columns of six links each (Product,
 * Resources, Company, Legal), a hairline, and the legal bar (the copyright
 * and three legal links). No motion: Figma has no chip for this Type.
 *
 * Desktop (Figma 1440) sets the brand 320 wide with the four columns filling
 * the rest, 56px apart. Tablet (768) gives the brand its own row, then the
 * four columns across, 24px apart. Mobile (360) gives the brand its own row,
 * then the columns two across. In Arabic everything mirrors by the page's
 * `dir`; the social marks and the logo are never flipped.
 */

export interface FooterFourColumnDirectoryCopy {
  /** The sentence beside the logo. Hidden when empty. */
  blurb: string
  /** The link columns, in reading order. */
  columns: FooterColumn[]
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterFourColumnDirectoryCopy> = (["en", "ar"] as const).reduce(
  (acc, locale) => {
    const common = FOOTER_COMMON[locale]
    acc[locale] = {
      blurb: common.blurb,
      columns: [common.columns.product, common.columns.resources, common.columns.company, common.columns.legal],
      copyright: common.copyright,
      legal: [
        { label: common.privacy, href: "#" },
        { label: common.terms, href: "#" },
        { label: common.cookies, href: "#" },
      ],
      legalLabel: locale === "en" ? "Legal" : "قانوني",
    }
    return acc
  },
  {} as Record<FooterLocale, FooterFourColumnDirectoryCopy>
)

/** The block's English and Arabic copy, for stories and previews. */
export const footerFourColumnDirectoryCopy = COPY

export interface FooterFourColumnDirectoryProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterFourColumnDirectoryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "dribbble", "youtube"]

export function FooterFourColumnDirectory({
  locale = "en",
  blurb,
  columns,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterFourColumnDirectoryProps) {
  const copy = COPY[locale]
  const text = blurb ?? copy.blurb
  return (
    <FooterSection className={cn("py-8 md:py-16 lg:pb-10 lg:pt-20", className)} contentClassName="gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-12" {...props}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 [@container(min-width:40rem)]:grid-cols-4 [@container(min-width:40rem)]:gap-x-6 [@container(min-width:40rem)]:gap-y-10 [@container(min-width:64rem)]:grid-cols-[320px_repeat(4,minmax(0,1fr))] [@container(min-width:64rem)]:gap-x-14">
        <FooterBrand blurb={text} className="col-span-2 [@container(min-width:40rem)]:col-span-4 [@container(min-width:64rem)]:col-span-1">
          {socials.length ? <FooterSocial platforms={socials} /> : null}
        </FooterBrand>
        {(columns ?? copy.columns).map((column) => (
          <FooterLinkColumn key={column.title} title={column.title} links={column.links} />
        ))}
      </div>
      <FooterRule />
      <FooterLegalBar copyright={copyright ?? copy.copyright} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
    </FooterSection>
  )
}

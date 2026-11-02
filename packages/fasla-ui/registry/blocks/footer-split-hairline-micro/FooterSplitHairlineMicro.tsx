import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FooterCopyright, FooterLinkItem, FooterLogo, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Split Hairline Micro.
 *
 * The smallest footer: the logo and the full copyright line at the start; three
 * legal links and three 16px social marks at the end, under a hairline. No
 * motion: Figma has no chip for this Type.
 *
 * Desktop (1440) is one row with 20px above and below, Tablet (768) the same
 * with 16px, Mobile (360) two rows (logo and copyright, then links and marks
 * at the two ends) with 12px. In Arabic everything mirrors by the page's `dir`.
 */

export interface FooterSplitHairlineMicroCopy {
  /** The copyright line beside the logo. */
  copyright: string
  /** The legal links. Hidden when empty. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
  /** The accessible name of the social marks. */
  socialLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterSplitHairlineMicroCopy> = {
  en: {
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal",
    socialLabel: "Social",
  },
  ar: {
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط"].map((label) => ({ label, href: "#" })),
    legalLabel: "قانوني",
    socialLabel: "التواصل الاجتماعي",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerSplitHairlineMicroCopy = COPY

export interface FooterSplitHairlineMicroProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterSplitHairlineMicroCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github"]

export function FooterSplitHairlineMicro({ locale = "en", copyright, legal, legalLabel, socialLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterSplitHairlineMicroProps) {
  const copy = COPY[locale]
  const links = legal ?? copy.legal
  return (
    <FooterSection className={cn("border-t border-border py-3 md:py-4 lg:py-5", className)} {...props}>
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
          <FooterLogo className="h-[22px]" />
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
        </div>
        <div className="flex items-center justify-between gap-3 [@container(min-width:40rem)]:justify-start [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-5">
          {links.length ? (
            <nav aria-label={legalLabel ?? copy.legalLabel}>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
                {links.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-xs" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {socials.length ? (
            <nav aria-label={socialLabel ?? copy.socialLabel}>
              <ul className="flex items-center gap-2 [@container(min-width:40rem)]:gap-3">
                {socials.map((platform) => (
                  <li key={platform} className="flex">
                    <a
                      href="#"
                      aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                      className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3.5 after:content-['']"
                    >
                      <SocialIcon platform={platform} color="negative" className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </FooterSection>
  )
}

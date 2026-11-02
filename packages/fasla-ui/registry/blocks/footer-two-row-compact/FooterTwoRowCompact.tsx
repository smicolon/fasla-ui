import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FooterCopyright, FooterLinkItem, FooterLogo, FooterRule, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Two-Row Compact.
 *
 * A rounded `secondary` card on the page: the first row holds the logo, five
 * links in Medium and four social marks; a hairline; the second row holds the
 * copyright and five legal links. No motion: Figma has no chip for this Type.
 *
 * Desktop (1440) keeps both rows as rows, 32px of padding either side of the
 * card's content and 20px between the rows. Tablet (768) lets the links wrap.
 * Mobile (360) stacks: the logo, the links, the marks, the hairline, then the
 * copyright and the legal links. In Arabic everything mirrors by the page's `dir`.
 */

export interface FooterTwoRowCompactCopy {
  /** The links beside the logo. Hidden when empty. */
  links: FooterLink[]
  /** The accessible name of those links. */
  navLabel: string
  /** The copyright line. */
  copyright: string
  /** The legal links. Hidden when empty. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
  /** The accessible name of the social marks. */
  socialLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterTwoRowCompactCopy> = {
  en: {
    links: ["Components", "Blocks", "Templates", "Documentation", "Pricing"].map((label) => ({ label, href: "#" })),
    navLabel: "Footer",
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: ["Privacy", "Terms", "Cookies", "Accessibility", "Sitemap"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal links",
    socialLabel: "Social",
  },
  ar: {
    links: ["المكوّنات", "الكتل", "القوالب", "التوثيق", "الأسعار"].map((label) => ({ label, href: "#" })),
    navLabel: "التذييل",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: ["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول", "خريطة الموقع"].map((label) => ({ label, href: "#" })),
    legalLabel: "روابط قانونية",
    socialLabel: "التواصل الاجتماعي",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerTwoRowCompactCopy = COPY

export interface FooterTwoRowCompactProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterTwoRowCompactCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "youtube"]

export function FooterTwoRowCompact({ locale = "en", links, navLabel, copyright, legal, legalLabel, socialLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterTwoRowCompactProps) {
  const copy = COPY[locale]
  const nav = links ?? copy.links
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection className={cn("py-5 md:py-8 lg:py-10", className)} {...props}>
      <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4 [@container(min-width:40rem)]:gap-4 [@container(min-width:40rem)]:px-6 [@container(min-width:40rem)]:py-5 [@container(min-width:64rem)]:gap-5 [@container(min-width:64rem)]:px-8 [@container(min-width:64rem)]:py-6">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
          <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8">
            <FooterLogo className="h-[26px]" />
            {nav.length ? (
              <nav aria-label={navLabel ?? copy.navLabel}>
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
                  {nav.map((link) => (
                    <li key={`${link.label}-${link.href}`} className="flex">
                      <FooterLinkItem link={link} className="font-medium text-secondary-foreground" />
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
          {socials.length ? (
            <nav aria-label={socialLabel ?? copy.socialLabel}>
              <ul className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
                {socials.map((platform) => (
                  <li key={platform} className="flex">
                    <a
                      href="#"
                      aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                      className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3.5 after:content-['']"
                    >
                      <SocialIcon platform={platform} color="negative" className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <FooterRule />
        <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
          {legalLinks.length ? (
            <nav aria-label={legalLabel ?? copy.legalLabel}>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
                {legalLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-xs" />
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

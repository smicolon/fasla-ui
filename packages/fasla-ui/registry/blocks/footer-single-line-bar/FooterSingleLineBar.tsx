import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FooterCopyright, FooterLinkItem, FooterLogo, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Single-Line Bar.
 *
 * One line: the logo and six links at the start, three social marks and the
 * short copyright at the end, under a hairline. No motion: Figma has no chip
 * for this Type; the links keep the shared 120ms colour change.
 *
 * Desktop (1440) is one row, 24px of padding above and below. Tablet (768)
 * is the same row with the links allowed to wrap, 20px above and below.
 * Mobile (360) stacks: the logo, the links (wrapping), then the social marks
 * and the copyright on one line, 16px above and below. In Arabic everything
 * mirrors by the page's `dir`; the marks and the logo are never flipped.
 */

export interface FooterSingleLineBarCopy {
  /** The links beside the logo. Hidden when empty. */
  links: FooterLink[]
  /** The accessible name of the links. */
  navLabel: string
  /** The copyright line. */
  copyright: string
  /** The accessible name of the social marks. */
  socialLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterSingleLineBarCopy> = {
  en: {
    links: ["Components", "Blocks", "Pricing", "Docs", "Blog", "Contact"].map((label) => ({ label, href: "#" })),
    navLabel: "Footer",
    copyright: "© 2026 Fasla",
    socialLabel: "Social",
  },
  ar: {
    links: ["المكوّنات", "الكتل", "الأسعار", "التوثيق", "المدونة", "اتصل بنا"].map((label) => ({ label, href: "#" })),
    navLabel: "التذييل",
    copyright: "© 2026 فاصلة",
    socialLabel: "التواصل الاجتماعي",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerSingleLineBarCopy = COPY

export interface FooterSingleLineBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterSingleLineBarCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github"]

/** The social marks at Figma's 18px, 12px apart (8px on phones), each a link named by its platform. */
function SocialRow({ platforms, label }: { platforms: SocialPlatform[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-2 [@container(min-width:40rem)]:gap-3">
        {platforms.map((platform) => (
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
  )
}

export function FooterSingleLineBar({ locale = "en", links, navLabel, copyright, socialLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterSingleLineBarProps) {
  const copy = COPY[locale]
  const items = links ?? copy.links
  return (
    <FooterSection className={cn("border-t border-border py-4 md:py-5 lg:py-6", className)} {...props}>
      <div className="flex flex-col items-stretch gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-[26px]" />
          {items.length ? (
            <nav aria-label={navLabel ?? copy.navLabel}>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
                {items.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-foreground" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-4 [@container(min-width:40rem)]:justify-start [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          {socials.length ? <SocialRow platforms={socials} label={socialLabel ?? copy.socialLabel} /> : null}
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
        </div>
      </div>
    </FooterSection>
  )
}

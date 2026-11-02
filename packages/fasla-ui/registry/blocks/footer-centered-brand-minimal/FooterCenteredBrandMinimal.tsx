import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FOOTER_LINK, FooterCopyright, FooterLogo, FooterRule, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Centered Brand Minimal.
 *
 * The smallest footer: everything on one centred axis. The logo, a one-line
 * tagline, a wrapping row of eight links (in `foreground`), five social marks,
 * a hairline and the copyright. A hairline sits on the block's top edge. No
 * motion: Figma has no chip for this Type.
 *
 * Gaps tighten with width: 24, 20, 16 between the rows. Desktop (1440) keeps
 * the links on one line; Tablet and Mobile let them wrap, centred.
 */

export interface FooterCenteredBrandMinimalCopy {
  /** The line under the logo. Hidden when empty. */
  tagline: string
  /** The row of links. */
  links: FooterLink[]
  /** The accessible name of the row of links. */
  navLabel: string
  /** The copyright line. */
  copyright: string
}

const links = (labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterCenteredBrandMinimalCopy> = {
  en: {
    tagline: "The bilingual design system for product teams.",
    links: links(["Components", "Blocks", "Templates", "Documentation", "Pricing", "Blog", "Careers", "Contact"]),
    navLabel: "Footer",
    copyright: "© 2026 Fasla. All rights reserved.",
  },
  ar: {
    tagline: "نظام التصميم ثنائي اللغة لفرق المنتج.",
    links: links(["المكوّنات", "الكتل", "القوالب", "التوثيق", "الأسعار", "المدونة", "الوظائف", "اتصل بنا"]),
    navLabel: "التذييل",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerCenteredBrandMinimalCopy = COPY

export interface FooterCenteredBrandMinimalProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterCenteredBrandMinimalCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "instagram", "youtube"]

function Digits({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, index) =>
        index % 2 ? (
          <bdi key={index} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  )
}

export function FooterCenteredBrandMinimal({ locale = "en", tagline, links: navLinks, navLabel, copyright, socials = DEFAULT_SOCIALS, className, ...props }: FooterCenteredBrandMinimalProps) {
  const copy = COPY[locale]
  const line = tagline ?? copy.tagline
  const items = navLinks ?? copy.links
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-12", className)}
      contentClassName="items-center gap-4 text-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6"
      {...props}
    >
      <FooterLogo className="h-[30px]" />
      {line ? <p className="w-full text-sm text-muted-foreground">{line}</p> : null}
      {items.length ? (
        <nav aria-label={navLabel ?? copy.navLabel}>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
            {items.map((link) => (
              <li key={`${link.label}-${link.href}`} className="flex">
                <a href={link.href} className={cn(FOOTER_LINK, "text-foreground hover:text-muted-foreground focus-visible:text-foreground active:text-muted-foreground")}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {socials.length ? (
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
          {socials.map((platform) => (
            <li key={platform} className="flex">
              <a
                href="#"
                aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']"
              >
                <SocialIcon platform={platform} color="negative" className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <FooterRule />
      <FooterCopyright className="w-full">
        <Digits text={copyright ?? copy.copyright} />
      </FooterCopyright>
    </FooterSection>
  )
}

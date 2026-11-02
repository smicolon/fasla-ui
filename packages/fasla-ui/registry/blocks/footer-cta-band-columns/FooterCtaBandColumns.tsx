"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FooterColumnTitle,
  FooterCopyright,
  FooterLinkItem,
  FooterRule,
  FooterSection,
  useFooterReveal,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=CTA Band + Columns.
 *
 * Two bands. The inverse band on top (`background-inverse`: dark in light
 * mode) holds a headline, a sentence and two Buttons; the page-coloured tier
 * under it holds the directory (the logo, a blurb and four social marks, then
 * four link columns of five links), a hairline and the legal bar.
 *
 * Desktop (Figma 1440): the band is copy (660 wide) then the Buttons, side by
 * side; the directory is the brand (300 wide) and four columns across.
 * Tablet (768): copy and Buttons still side by side; the directory puts the
 * brand on its own row, then three columns across (the fourth wraps). Mobile
 * (360): the band stacks with both Buttons full width; the columns go two
 * across. In Arabic everything mirrors by the page's `dir`.
 *
 * Motion (Figma's chip): when 25% of the band is on screen the headline, the
 * sentence and the Button pair each fade in and rise 16px over 400ms on
 * cubic-bezier(.2,.8,.2,1), 80ms apart. Reduced motion: a 200ms fade, no rise.
 * The columns tier does not animate. Not built: the solid Button's 1.02 scale
 * on hover and the outline Button's border colour change. Those are states of
 * the Button atom, which does not have them, and a block does not add them.
 *
 * Buttons: Solid Secondary and Outline Secondary, size lg, as the atom draws
 * them on this band (`variant="secondary"` and `variant="outline"`).
 */

export interface FooterCtaBandColumnsCopy {
  headline: string
  sub: string
  /** The solid Button. */
  primary: FooterLink
  /** The outline Button. */
  secondary: FooterLink
  /** The sentence beside the logo in the columns tier. Hidden when empty. */
  blurb: string
  /** The link columns, in reading order. */
  columns: FooterColumn[]
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterCtaBandColumnsCopy> = {
  en: {
    headline: "Ship your next release on Fasla.",
    sub: "Ready-made components, bilingual by default, and a token layer your engineers already speak.",
    primary: { label: "Start free", href: "#" },
    secondary: { label: "Book a demo", href: "#" },
    blurb: "The bilingual design system for product teams.",
    columns: [
      { title: "Product", links: links("Components", "Blocks", "Templates", "Pricing", "Changelog") },
      { title: "Resources", links: links("Documentation", "Guides", "Blog", "Showcase", "Status") },
      { title: "Company", links: links("About", "Careers", "Customers", "Press", "Contact") },
      { title: "Legal", links: links("Privacy", "Terms", "Cookies", "Licenses", "Security") },
    ],
    copyright: FOOTER_COMMON.en.copyright,
    legal: links(FOOTER_COMMON.en.privacy, FOOTER_COMMON.en.terms, FOOTER_COMMON.en.cookies),
    legalLabel: "Legal",
  },
  ar: {
    headline: "أطلق إصدارك القادم على فاصلة.",
    sub: "مكوّنات جاهزة، ثنائية اللغة افتراضيًا، وطبقة رموز يفهمها مهندسوك بالفعل.",
    primary: { label: "ابدأ مجانًا", href: "#" },
    secondary: { label: "احجز عرضًا", href: "#" },
    blurb: "نظام التصميم ثنائي اللغة لفرق المنتج.",
    columns: [
      { title: "المنتج", links: links("المكوّنات", "الكتل", "القوالب", "الأسعار", "سجل التغييرات") },
      { title: "الموارد", links: links("التوثيق", "الأدلة", "المدونة", "المعرض", "الحالة") },
      { title: "الشركة", links: links("من نحن", "الوظائف", "العملاء", "الصحافة", "اتصل بنا") },
      { title: "قانوني", links: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط", "التراخيص", "الأمان") },
    ],
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links(FOOTER_COMMON.ar.privacy, FOOTER_COMMON.ar.terms, FOOTER_COMMON.ar.cookies),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerCtaBandColumnsCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

function DirectoryColumn({ column }: { column: FooterColumn }) {
  const id = React.useId()
  return (
    <nav aria-labelledby={id} className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
      <FooterColumnTitle id={id}>{column.title}</FooterColumnTitle>
      <ul className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** The social marks at Figma's 18px for this Type. Marks are never mirrored. */
function SocialMarks({ platforms }: { platforms: SocialPlatform[] }) {
  return (
    <ul className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
      {platforms.map((platform) => (
        <li key={platform} className="flex">
          <a
            href="#"
            aria-label={SOCIAL_PLATFORM_NAMES[platform]}
            className="relative inline-flex rounded-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']"
          >
            <SocialIcon platform={platform} color="negative" className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export interface FooterCtaBandColumnsProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterCtaBandColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "youtube"]

export function FooterCtaBandColumns({ locale = "en", headline, sub, primary, secondary, blurb, columns, copyright, legal, legalLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterCtaBandColumnsProps) {
  const copy = COPY[locale]
  const bandRef = React.useRef<HTMLDivElement | null>(null)
  useFooterReveal(bandRef, { threshold: 0.25, duration: 400, stagger: 80, rise: 16, easing: "cubic-bezier(.2,.8,.2,1)", reducedFade: 200 })
  const headingId = React.useId()
  const text = headline ?? copy.headline
  const subText = sub ?? copy.sub
  const first = primary ?? copy.primary
  const second = secondary ?? copy.secondary
  const blurbText = blurb ?? copy.blurb
  const cols = (columns ?? copy.columns).filter((column) => column.links.length > 0)
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection
      labelledBy={text ? headingId : undefined}
      className={cn("bg-background px-0 md:px-0 lg:px-0", className)}
      contentClassName="max-w-none"
      {...props}
    >
      <div ref={bandRef} className="bg-background-inverse px-4 py-8 text-foreground-inverse md:px-6 md:py-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16">
          <div className="flex min-w-0 flex-col gap-2 [@container(min-width:40rem)]:flex-1 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:w-[660px] [@container(min-width:64rem)]:flex-none">
            {text ? (
              <h2 id={headingId} data-reveal="" className="text-2xl font-semibold text-foreground-inverse [@container(min-width:40rem)]:text-3xl">
                {text}
              </h2>
            ) : null}
            {subText ? (
              <p data-reveal="" className="text-base text-muted-foreground-inverse">
                {subText}
              </p>
            ) : null}
          </div>
          <div data-reveal="" className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-3">
            <a href={first.href} className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full [@container(min-width:40rem)]:w-auto" })}>{first.label}</a>
            <a href={second.href} className={buttonVariants({ variant: "outline", size: "lg", className: "w-full [@container(min-width:40rem)]:w-auto" })}>{second.label}</a>
          </div>
        </div>
      </div>
      <div className="bg-background px-4 pb-4 pt-8 md:px-6 md:pb-16 md:pt-16 lg:px-20 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-12">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-[300px_repeat(4,minmax(0,1fr))] [@container(min-width:64rem)]:gap-x-14">
            <div className="col-span-2 flex flex-col items-start gap-3 [@container(min-width:40rem)]:col-span-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:col-span-1 [@container(min-width:64rem)]:gap-5">
              <FaslaLogo className="h-[30px]" title="" />
              {blurbText ? <p className="text-sm text-muted-foreground">{blurbText}</p> : null}
              {socials.length ? <SocialMarks platforms={socials} /> : null}
            </div>
            {cols.map((column) => (
              <DirectoryColumn key={column.title} column={column} />
            ))}
          </div>
          <FooterRule />
          <div className="flex flex-col [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
            <FooterCopyright>{bidi(copyright ?? copy.copyright, locale)}</FooterCopyright>
            {legalLinks.length ? (
              <nav aria-label={legalLabel ?? copy.legalLabel}>
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
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
      </div>
    </FooterSection>
  )
}

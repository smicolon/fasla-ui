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
  usePrefersReducedMotion,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Floating Demo Card.
 *
 * A footer with a card that floats across its top edge. Above the footer body
 * (`secondary`) sits the Page Tail, a plain band of the page (`background`)
 * that stands for the page's last content: 96px high on Desktop (Figma 1440),
 * 88 on Tablet (768), 32 on Mobile (360). The card (a title, a sentence and
 * two Buttons, `shadow-xl`, 16px radius) straddles the edge between them:
 * centred on it on Desktop (half its height on each side, so it is placed with
 * no offset that depends on its height), 44px over the edge on Tablet, and in
 * the flow at the top of the body on Mobile, where there is no edge to cross.
 * The body's top padding (112 / 208 / 32) clears the part of the card that
 * hangs into it. Under the card: the directory (the logo, a blurb and four 18px
 * social marks, then four link columns of five links), a hairline and the legal
 * bar. In Arabic everything mirrors by the page's `dir`.
 *
 * Motion (Figma's chip), transform only so the card keeps straddling the edge
 * at every width: when 25% of the card is on screen it rises into place from
 * 24px below (16px on phones) while its shadow goes from `shadow-md` to
 * `shadow-xl`, 380ms ease-out. On a pointer that hovers, from Tablet up, the
 * card lifts 4px in 180ms. Reduced motion: the shadow change only, no rise and
 * no lift. Not built: the primary Button's arrow sliding 4px (Figma's chip
 * mentions it, but the frame draws no arrow in the Button).
 */

export interface FooterFloatingDemoCardCopy {
  title: string
  sub: string
  /** The solid Button. */
  primary: FooterLink
  /** The ghost Button. */
  secondary: FooterLink
  /** The sentence beside the logo. Hidden when empty. */
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
const COPY: Record<FooterLocale, FooterFloatingDemoCardCopy> = {
  en: {
    title: "See Fasla on your own product.",
    sub: "A 30-minute walkthrough with a design engineer — bring a screen you want rebuilt.",
    primary: { label: "Book a demo", href: "#" },
    secondary: { label: "See pricing", href: "#" },
    blurb: "Components, tokens and patterns that behave the same in English and Arabic.",
    columns: [
      { title: "Product", links: links("Components", "Blocks", "Templates", "Pricing", "Changelog") },
      { title: "Resources", links: links("Documentation", "Guides", "Blog", "Status", "Support") },
      { title: "Company", links: links("About", "Careers", "Customers", "Press", "Contact") },
      { title: "Legal", links: links("Privacy", "Terms", "Cookies", "Security", "Licenses") },
    ],
    copyright: FOOTER_COMMON.en.copyright,
    legal: links(FOOTER_COMMON.en.privacy, FOOTER_COMMON.en.terms, FOOTER_COMMON.en.cookies),
    legalLabel: "Legal",
  },
  ar: {
    title: "شاهد فاصلة على منتجك أنت.",
    sub: "جولة 30 دقيقة مع مهندس تصميم: أحضر شاشة تريد إعادة بنائها.",
    primary: { label: "احجز عرضًا", href: "#" },
    secondary: { label: "اطّلع على الأسعار", href: "#" },
    blurb: "مكوّنات ورموز وأنماط تتصرف بالطريقة نفسها بالعربية والإنجليزية.",
    columns: [
      { title: "المنتج", links: links("المكوّنات", "الكتل", "القوالب", "الأسعار", "سجل التغييرات") },
      { title: "الموارد", links: links("التوثيق", "الأدلة", "المدونة", "الحالة", "الدعم") },
      { title: "الشركة", links: links("من نحن", "الوظائف", "العملاء", "الصحافة", "اتصل بنا") },
      { title: "قانوني", links: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط", "الأمان", "التراخيص") },
    ],
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links(FOOTER_COMMON.ar.privacy, FOOTER_COMMON.ar.terms, FOOTER_COMMON.ar.cookies),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerFloatingDemoCardCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

/**
 * The card's entrance, once, when 25% of it is on screen: it rises (transform
 * only). The chip also grows the shadow from `shadow-md` to `shadow-xl`; the
 * card rests on `shadow-xl`, as the frame draws it, and the growth is not
 * animated (a theme colour cannot be written into a keyframe). Reduced motion
 * plays nothing.
 */
function useCardEntrance(ref: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const card = ref.current
    if (!card || typeof IntersectionObserver === "undefined" || typeof card.animate !== "function") return
    const play = () => {
      const rise = card.getBoundingClientRect().width < 640 ? 16 : 24
      if (reduced) return
      card.animate([{ transform: `translateY(${rise}px)` }, { transform: "none" }], { duration: 380, easing: "ease-out", fill: "backwards" })
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          play()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [ref, reduced])
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

export interface FooterFloatingDemoCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterFloatingDemoCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "dribbble"]

export function FooterFloatingDemoCard({ locale = "en", title, sub, primary, secondary, blurb, columns, copyright, legal, legalLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterFloatingDemoCardProps) {
  const copy = COPY[locale]
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  useCardEntrance(cardRef)
  const headingId = React.useId()
  const heading = title ?? copy.title
  const subText = sub ?? copy.sub
  const first = primary ?? copy.primary
  const second = secondary ?? copy.secondary
  const blurbText = blurb ?? copy.blurb
  const cols = (columns ?? copy.columns).filter((column) => column.links.length > 0)
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection labelledBy={heading ? headingId : undefined} className={cn("relative bg-background px-0 md:px-0 lg:px-0", className)} contentClassName="max-w-none" {...props}>
      {/* The Page Tail: the page's last band, which the card straddles. */}
      <div aria-hidden="true" className="h-8 bg-background [@container(min-width:40rem)]:h-[88px] [@container(min-width:64rem)]:h-24" />
      <div className="bg-secondary px-4 pb-4 pt-8 text-foreground md:px-6 md:pb-16 md:pt-[208px] lg:px-20 lg:pb-8 lg:pt-28">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-12">
          {/*
           * Desktop: a zero-height band on the edge with the card centred in it,
           * so the card is half above and half below whatever its height is, and
           * its own transform is free for the motion. Tablet: 44px over the edge.
           * Mobile: in the flow.
           */}
          <div className="relative [@container(min-width:40rem)]:absolute [@container(min-width:40rem)]:inset-x-6 [@container(min-width:40rem)]:top-11 [@container(min-width:64rem)]:inset-x-20 [@container(min-width:64rem)]:top-24 [@container(min-width:64rem)]:flex [@container(min-width:64rem)]:h-0 [@container(min-width:64rem)]:items-center">
            <div
              ref={cardRef}
              className={cn(
                "flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl [@container(min-width:40rem)]:p-6 [@container(min-width:64rem)]:mx-auto [@container(min-width:64rem)]:max-w-[1120px] [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-10 [@container(min-width:64rem)]:px-10 [@container(min-width:64rem)]:py-8",
                "transition-transform duration-[180ms] ease-out motion-reduce:transition-none",
                "hover:motion-safe:[@container(min-width:40rem)]:-translate-y-1"
              )}
            >
              <div className="flex min-w-0 flex-col gap-2 [@container(min-width:64rem)]:max-w-[620px]">
                {heading ? (
                  <h2 id={headingId} className="text-xl font-semibold [@container(min-width:40rem)]:text-2xl">
                    {heading}
                  </h2>
                ) : null}
                {subText ? <p className="text-sm text-muted-foreground">{bidi(subText, locale)}</p> : null}
              </div>
              <div className="flex flex-col gap-2 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-3">
                <a href={first.href} className={buttonVariants({ size: "lg", className: "w-full [@container(min-width:64rem)]:w-auto" })}>{first.label}</a>
                <a href={second.href} className={buttonVariants({ variant: "ghost", size: "lg", className: "w-full [@container(min-width:64rem)]:w-auto" })}>{second.label}</a>
              </div>
            </div>
          </div>
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

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_COMMON,
  FooterCopyright,
  FooterLinkItem,
  FooterRule,
  FooterSection,
  usePrefersReducedMotion,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Big-Question CTA.
 *
 * A question set large and light, with a sentence and two Buttons, then a
 * hairline, one row of site links with the logo and four 18px social marks,
 * and a legal bar. The footer is mostly the question.
 *
 * Desktop (Figma 1440): the question (5XL Light, up to 880 wide) and the
 * Buttons sit in a row, the Buttons on the baseline side; the nav row is the
 * logo and seven links on one side and the social marks on the other.
 * Tablet (768) and Mobile (360): both stack, and the headline renders 30px (Tablet) and 24px (Mobile), Light, in
 * the frames at both. The Buttons are size lg, Solid Primary and Outline
 * Secondary; on Mobile they stack at full width. In Arabic everything mirrors
 * by the page's `dir`.
 *
 * Motion (Figma's chip), once, when 25% of the question is on screen: the
 * headline reveals line by line (each line's words clip-path from inset(100% 0
 * 0 0) to inset(0), 520ms cubic-bezier(.16,1,.3,1), 90ms per line, 60ms on
 * phones), then the sentence and the Buttons fade in and rise 10px at 240ms.
 * Letter-spacing is never animated. Reduced motion: the headline fades for
 * 200ms and nothing rises. Not built: the primary Button's arrow sliding 4px
 * (the chip mentions it, but the frame draws no arrow in the Button).
 */

export interface FooterBigQuestionCtaCopy {
  headline: string
  sub: string
  /** The solid Button. */
  primary: FooterLink
  /** The outline Button. */
  secondary: FooterLink
  /** The site links beside the logo. */
  nav: FooterLink[]
  /** The accessible name of the site links. */
  navLabel: string
  copyright: string
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (...labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterBigQuestionCtaCopy> = {
  en: {
    headline: "Ready to make your next release feel inevitable?",
    sub: "Start with the free tier — 40 components, full token set, no card required.",
    primary: { label: "Start building", href: "#" },
    secondary: { label: "Talk to us", href: "#" },
    nav: links("Components", "Blocks", "Pricing", "Documentation", "Blog", "Careers", "Contact"),
    navLabel: "Footer",
    copyright: FOOTER_COMMON.en.copyright,
    legal: links("Privacy", "Terms", "Cookies", "Accessibility"),
    legalLabel: "Legal",
  },
  ar: {
    headline: "مستعدّ ليبدو إصدارك القادم أمرًا محتومًا؟",
    sub: "ابدأ بالخطة المجانية: 40 مكوّنًا، مجموعة الرموز كاملة، دون بطاقة.",
    primary: { label: "ابدأ البناء", href: "#" },
    secondary: { label: "تحدّث إلينا", href: "#" },
    nav: links("المكوّنات", "الكتل", "الأسعار", "التوثيق", "المدونة", "الوظائف", "اتصل بنا"),
    navLabel: "التذييل",
    copyright: FOOTER_COMMON.ar.copyright,
    legal: links("الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerBigQuestionCtaCopy = COPY

/** Numbers and Latin words inside an Arabic line keep their own direction. */
function bidi(text: string, locale: FooterLocale): React.ReactNode {
  if (locale !== "ar") return text
  return text.split(/([A-Za-z0-9][A-Za-z0-9@./:–-]*)/).map((part, index) => (index % 2 ? <bdi key={index} dir="ltr">{part}</bdi> : part))
}

/**
 * Plays the question's entrance once, at 25% visible. The headline's words are
 * grouped into the lines they sit on and each line reveals upward through a
 * clip-path; the sentence and the Buttons follow. Reduced motion fades the
 * headline for 200ms and plays nothing else.
 */
function useQuestionReveal(ref: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === "undefined" || typeof root.animate !== "function") return
    const play = () => {
      const words = Array.from(root.querySelectorAll<HTMLElement>("[data-q-word]"))
      if (reduced) {
        root.querySelector<HTMLElement>("[data-q-headline]")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out", fill: "backwards" })
        return
      }
      const perLine = root.getBoundingClientRect().width < 640 ? 60 : 90
      const tops: number[] = []
      words.forEach((word) => {
        if (!tops.includes(word.offsetTop)) tops.push(word.offsetTop)
        const line = tops.indexOf(word.offsetTop)
        word.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0)" }], { duration: 520, delay: line * perLine, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" })
      })
      root.querySelectorAll<HTMLElement>("[data-q-follow]").forEach((el) => {
        el.animate(
          [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 300, delay: 240, easing: "ease-out", fill: "backwards" }
        )
      })
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
    observer.observe(root)
    return () => observer.disconnect()
  }, [ref, reduced])
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

export interface FooterBigQuestionCtaProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterBigQuestionCtaCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "youtube"]

export function FooterBigQuestionCta({ locale = "en", headline, sub, primary, secondary, nav, navLabel, copyright, legal, legalLabel, socials = DEFAULT_SOCIALS, className, ...props }: FooterBigQuestionCtaProps) {
  const copy = COPY[locale]
  const questionRef = React.useRef<HTMLDivElement | null>(null)
  useQuestionReveal(questionRef)
  const headingId = React.useId()
  const text = headline ?? copy.headline
  const subText = sub ?? copy.sub
  const first = primary ?? copy.primary
  const second = secondary ?? copy.secondary
  const navLinks = nav ?? copy.nav
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection
      labelledBy={text ? headingId : undefined}
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-24", className)}
      contentClassName="gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16"
      {...props}
    >
      <div ref={questionRef} className="flex flex-col gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-16">
        <div className="flex min-w-0 flex-col gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:max-w-[880px] [@container(min-width:64rem)]:gap-5">
          {text ? (
            <h2 id={headingId} data-q-headline="" className="text-2xl font-light text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-5xl">
              {text.split(" ").map((word, index) => (
                <React.Fragment key={`${word}-${index}`}>
                  {index > 0 ? " " : null}
                  <span data-q-word="" className="inline-block">
                    {word}
                  </span>
                </React.Fragment>
              ))}
            </h2>
          ) : null}
          {subText ? (
            <p data-q-follow="" className="text-base text-muted-foreground">
              {bidi(subText, locale)}
            </p>
          ) : null}
        </div>
        <div data-q-follow="" className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:shrink-0">
          <a href={first.href} className={buttonVariants({ size: "lg", className: "w-full [@container(min-width:40rem)]:w-auto" })}>{first.label}</a>
          <a href={second.href} className={buttonVariants({ variant: "outline", size: "lg", className: "w-full [@container(min-width:40rem)]:w-auto" })}>{second.label}</a>
        </div>
      </div>
      <FooterRule />
      <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FaslaLogo className="h-[26px]" title="" />
          {navLinks.length ? (
            <nav aria-label={navLabel ?? copy.navLabel}>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
                {navLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        {socials.length ? <SocialMarks platforms={socials} /> : null}
      </div>
      <div className="flex flex-col [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <FooterCopyright>{bidi(copyright ?? copy.copyright, locale)}</FooterCopyright>
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
    </FooterSection>
  )
}

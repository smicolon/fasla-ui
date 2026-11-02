"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FOOTER_LINK_INVERSE,
  FooterLegalBar,
  FooterLogo,
  FooterRule,
  FooterSection,
  useFooterReveal,
  usePrefersReducedMotion,
  type FooterLink,
  type FooterLocale,
  type FooterPhoto,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Image-Backed Brand.
 *
 * An inverse band over a photo. A scrim in `background-inverse` sits between
 * the photo and the text, so the text is always `foreground-inverse` (the sentence
 * and the legal line too, not `muted-foreground-inverse`: in dark mode the scrim is light and
 * the muted token would not read on it) on a dark
 * (or, in dark mode, light) ground. Centred: the logo, a 3XL Light headline and
 * a Base line, a wrapping row of eight links, five social marks at 22px, a
 * hairline, and the legal bar with four links.
 *
 * The photo is a prop (`background`); without one the band shows the `muted`
 * ground at the same size. The scrim is its own layer at .62 (a separate
 * layer, since Tailwind 3 drops the opacity modifier on a var() colour).
 *
 * Motion (Figma chip): the photo drifts translateY -24px to 24px across the
 * footer's scroll range (16 on Tablet, 8 on Mobile), transform only, and the
 * scrim goes .72 to .62 over the same range. Both run only with a fine pointer
 * (iOS Safari judders on scroll-driven layers) and not under reduced motion;
 * otherwise nothing drifts and the scrim stays .62. The content fades in once
 * at 30% visible: 320ms, 60ms apart down the stack, the links as one group.
 */

export interface FooterImageBackedBrandCopy {
  /** The headline. */
  headline: string
  /** The line under it. Hidden when empty. */
  sub: string
  /** The row of links. */
  links: FooterLink[]
  /** The accessible name of the row of links. */
  navLabel: string
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterImageBackedBrandCopy> = {
  en: {
    headline: "Design once. Ship in every direction.",
    sub: "The bilingual design system trusted by product teams across the region.",
    links: links(["Components", "Blocks", "Templates", "Documentation", "Pricing", "Blog", "Careers", "Contact"]),
    navLabel: "Footer",
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: links(["Privacy", "Terms", "Cookies", "Accessibility"]),
    legalLabel: "Legal links",
  },
  ar: {
    headline: "صمّم مرة واحدة. أطلق في كل اتجاه.",
    sub: "نظام التصميم ثنائي اللغة الذي تثق به فرق المنتجات في المنطقة.",
    links: links(["المكوّنات", "الكتل", "القوالب", "التوثيق", "الأسعار", "المدونة", "الوظائف", "اتصل بنا"]),
    navLabel: "التذييل",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: links(["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"]),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerImageBackedBrandCopy = COPY

export interface FooterImageBackedBrandProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterImageBackedBrandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
  /** The photo behind the band. Without one the band shows the `muted` ground. */
  background?: FooterPhoto
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "instagram", "youtube"]

/** The container width where Figma's Tablet and Desktop start: 40rem and 64rem. */
const TABLET = 640
const DESKTOP = 1024
const SCRIM_START = 0.72
const SCRIM_END = 0.62

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

/** Whether reduced motion is asked for right now, read at the moment an effect starts so the first run is already right. */
const motionReduced = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Parallax: with a fine pointer and without reduced motion, one passive scroll
 * listener maps the block's pass through the window (0 as it enters, 1 as it
 * leaves) to the photo's translateY (-range to +range) and the scrim's opacity
 * (.72 to .62). Otherwise nothing is applied and the scrim stays at .62.
 */
function useParallax(rootRef: React.RefObject<HTMLElement | null>, photoRef: React.RefObject<HTMLElement | null>, scrimRef: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const root = rootRef.current
    const photo = photoRef.current
    const scrim = scrimRef.current
    if (reduced || !root || !photo || !scrim || motionReduced() || typeof window.matchMedia !== "function") return
    if (!window.matchMedia("(pointer: fine)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const width = root.clientWidth
      const range = width >= DESKTOP ? 24 : width >= TABLET ? 16 : 8
      const rect = root.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
      photo.style.transform = `translateY(${+(range * (2 * progress - 1)).toFixed(2)}px)`
      scrim.style.opacity = String(+(SCRIM_START - (SCRIM_START - SCRIM_END) * progress).toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      photo.style.transform = ""
      scrim.style.opacity = ""
    }
  }, [reduced, rootRef, photoRef, scrimRef])
}

export function FooterImageBackedBrand({
  locale = "en",
  headline,
  sub,
  links: navLinks,
  navLabel,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  background,
  className,
  ...props
}: FooterImageBackedBrandProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const photoRef = React.useRef<HTMLDivElement>(null)
  const scrimRef = React.useRef<HTMLDivElement>(null)
  useFooterReveal(rootRef, { threshold: 0.3, selector: "[data-reveal]", duration: 320, stagger: 60, rise: 12 })
  useParallax(rootRef, photoRef, scrimRef)
  const line = sub ?? copy.sub
  const items = navLinks ?? copy.links
  return (
    <FooterSection
      ref={rootRef}
      inverse
      behind={
        <>
          {/* The layers fill the whole band, not the 1280px column. The photo is taller than the band by the parallax range, so it never shows an edge. */}
      <div ref={photoRef} aria-hidden="true" data-photo="" className="pointer-events-none absolute inset-x-0 -inset-y-2 -z-20 bg-muted [@container(min-width:40rem)]:-inset-y-4 [@container(min-width:64rem)]:-inset-y-6">
        {background ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={background.src} alt="" loading="lazy" className="size-full object-cover" />
        ) : null}
      </div>
      <div ref={scrimRef} aria-hidden="true" data-scrim="" className="pointer-events-none absolute inset-0 -z-10 bg-background-inverse opacity-[.62]" />
        </>
      }
      className={cn("relative isolate overflow-hidden py-8 md:py-16 lg:pb-10 lg:pt-20", className)}
      contentClassName="relative z-10 gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col items-center gap-3 text-center [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-5">
        <div data-reveal="">
          <FooterLogo inverse className="h-9" />
        </div>
        <h2 data-reveal="" className="text-2xl font-light text-foreground-inverse [@container(min-width:40rem)]:text-3xl">
          {headline ?? copy.headline}
        </h2>
        {line ? (
          <p data-reveal="" className="text-base text-foreground-inverse">
            {line}
          </p>
        ) : null}
      </div>
      {items.length ? (
        <nav data-reveal="" aria-label={navLabel ?? copy.navLabel}>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
            {items.map((link) => (
              <li key={`${link.label}-${link.href}`} className="flex">
                <a href={link.href} className={cn(FOOTER_LINK_INVERSE, "text-foreground-inverse hover:text-muted-foreground-inverse focus-visible:text-foreground-inverse active:text-muted-foreground-inverse")}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {socials.length ? (
        <ul data-reveal="" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
          {socials.map((platform) => (
            <li key={platform} className="flex">
              <a
                href="#"
                aria-label={SOCIAL_PLATFORM_NAMES[platform]}
                className="relative inline-flex rounded-sm text-foreground-inverse [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:-inset-3 after:content-['']"
              >
                <SocialIcon platform={platform} color="current" className="size-[22px]" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div data-reveal="" className="flex flex-col gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10">
        <FooterRule inverse className="opacity-[.18]" />
        <FooterLegalBar inverse className="[&_a]:text-foreground-inverse" copyright={<span className="text-foreground-inverse"><Digits text={copyright ?? copy.copyright} /></span>} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
      </div>
    </FooterSection>
  )
}

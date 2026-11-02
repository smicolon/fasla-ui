"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { FOOTER_LINK, FooterLegalBar, FooterLogo, FooterRule, FooterSection, usePrefersReducedMotion, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Marquee Strip.
 *
 * A full-bleed `secondary` stage on top, then the footer body. The stage holds
 * a track of fourteen children (a phrase, then a sparkles icon, seven times)
 * clipped hard at both edges. The body is the logo and six links on a row with
 * four social marks (18px), a hairline and the legal bar.
 *
 * Stage 132 / 104 / 88 tall; the phrase is 4XL / 3XL / 2XL Light and the
 * separator icon 24 / 20 / 16, gaps 32 / 24 / 20.
 *
 * Motion (Figma chip): the track is drawn twice, end to end, and translates X
 * from 0 to -50% of its own width (so the seam never shows), linear, infinite:
 * 28s on Desktop, 15s on Tablet, 7s on Mobile (about 48px/s at each track
 * width). In Arabic it runs the other way, 0 to +50%, so phrases enter from the
 * left. The loop pauses on hover where there is a real hover (not on touch,
 * and not on Mobile, where it just runs). Reduced motion stops the loop and
 * centres one phrase set.
 */

export interface FooterMarqueeStripCopy {
  /** The phrase the track repeats. */
  phrase: string
  /** The row of links beside the logo. */
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
const COPY: Record<FooterLocale, FooterMarqueeStripCopy> = {
  en: {
    phrase: "Bilingual by default",
    links: links(["Components", "Blocks", "Templates", "Documentation", "Pricing", "Blog"]),
    navLabel: "Footer",
    copyright: "© 2026 Fasla. All rights reserved.",
    legal: links(["Privacy", "Terms", "Cookies", "Accessibility"]),
    legalLabel: "Legal",
  },
  ar: {
    phrase: "ثنائية اللغة افتراضيًا",
    links: links(["المكوّنات", "الكتل", "القوالب", "التوثيق", "الأسعار", "المدونة"]),
    navLabel: "التذييل",
    copyright: "© 2026 فاصلة. جميع الحقوق محفوظة.",
    legal: links(["الخصوصية", "الشروط", "ملفات تعريف الارتباط", "إمكانية الوصول"]),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerMarqueeStripCopy = COPY

export interface FooterMarqueeStripProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterMarqueeStripCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "instagram"]

/** How many phrases one set of the track holds. Each is followed by an icon: fourteen children. */
const PHRASES_PER_SET = 7
/** The loop's length in seconds, by the stage's width: Desktop from 64rem, Tablet from 40rem, else Mobile. */
const DURATIONS = { desktop: 28, tablet: 15, mobile: 7 } as const

type Size = keyof typeof DURATIONS

function sizeOf(width: number): Size {
  return width >= 1024 ? "desktop" : width >= 640 ? "tablet" : width > 0 ? "mobile" : "desktop"
}

/** Whether reduced motion is asked for right now, read at the moment an effect starts so the first run is already right. */
const motionReduced = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

function isRtl(el: HTMLElement | null, locale: FooterLocale): boolean {
  const own = el?.closest("[dir]")?.getAttribute("dir") ?? (typeof document !== "undefined" ? document.documentElement.getAttribute("dir") : null)
  return own ? own.toLowerCase() === "rtl" : locale === "ar"
}

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

/** One set of the track: seven phrases, each followed by the sparkles icon. The trailing padding is one gap, so two sets meet like neighbours. */
function PhraseSet({ phrase, hidden }: { phrase: string; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden ? true : undefined} data-marquee-set="" className="flex shrink-0 items-center gap-5 pe-5 [@container(min-width:40rem)]:gap-6 [@container(min-width:40rem)]:pe-6 [@container(min-width:64rem)]:gap-8 [@container(min-width:64rem)]:pe-8">
      {Array.from({ length: PHRASES_PER_SET }, (_, index) => (
        <React.Fragment key={index}>
          <span data-marquee-phrase="" className="whitespace-nowrap text-2xl font-light text-secondary-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
            {phrase}
          </span>
          <Sparkles aria-hidden="true" className="size-4 shrink-0 text-secondary-foreground [@container(min-width:40rem)]:size-5 [@container(min-width:64rem)]:size-6" />
        </React.Fragment>
      ))}
    </div>
  )
}

export function FooterMarqueeStrip({
  locale = "en",
  phrase,
  links: navLinks,
  navLabel,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterMarqueeStripProps) {
  const copy = COPY[locale]
  const reduced = usePrefersReducedMotion()
  const stageRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const animationRef = React.useRef<Animation | null>(null)
  const [size, setSize] = React.useState<Size | null>(null)
  const text = phrase ?? copy.phrase
  const items = navLinks ?? copy.links

  // The stage's width picks the loop's length. ResizeObserver is optional: without it the width is read once.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const read = () => setSize(sizeOf(stage.clientWidth))
    read()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(read)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // The loop: 0 to -50% of the track (0 to +50% in Arabic), linear, forever.
  React.useEffect(() => {
    const track = trackRef.current
    if (!track || !size || reduced || motionReduced() || !text || typeof track.animate !== "function") return
    const end = isRtl(track, locale) ? "50%" : "-50%"
    const animation = track.animate([{ transform: "translateX(0)" }, { transform: `translateX(${end})` }], {
      duration: DURATIONS[size] * 1000,
      iterations: Infinity,
      easing: "linear",
    })
    animationRef.current = animation
    return () => {
      animation.cancel?.()
      animationRef.current = null
    }
  }, [reduced, size, text, locale])

  // Pause on hover, only where a pointer really hovers and not on Mobile.
  const canPause = () => size !== null && size !== "mobile" && typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(hover: hover)").matches
  const pause = () => {
    if (canPause()) animationRef.current?.pause?.()
  }
  const resume = () => {
    if (canPause()) animationRef.current?.play?.()
  }

  return (
    <FooterSection className={cn("px-0 md:px-0 lg:px-0", className)} contentClassName="max-w-none" {...props}>
      <div
        ref={stageRef}
        data-marquee-stage=""
        onMouseEnter={pause}
        onMouseLeave={resume}
        className={cn("relative flex h-[88px] w-full items-center overflow-hidden bg-secondary [@container(min-width:40rem)]:h-[104px] [@container(min-width:64rem)]:h-[132px]", reduced && "justify-center")}
      >
        {text ? <span className="sr-only">{text}</span> : null}
        {text ? (
          <div ref={trackRef} aria-hidden="true" data-marquee-track="" className="flex w-max shrink-0 items-center">
            <PhraseSet phrase={text} />
            {reduced ? null : <PhraseSet phrase={text} hidden />}
          </div>
        ) : null}
      </div>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-4 pt-5 [@container(min-width:40rem)]:gap-6 [@container(min-width:40rem)]:px-6 [@container(min-width:40rem)]:pb-6 [@container(min-width:40rem)]:pt-8 [@container(min-width:64rem)]:gap-8 [@container(min-width:64rem)]:px-20 [@container(min-width:64rem)]:pb-8 [@container(min-width:64rem)]:pt-10">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
          <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
            <FooterLogo className="h-7" />
            {items.length ? (
              <nav aria-label={navLabel ?? copy.navLabel}>
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 [@container(min-width:40rem)]:gap-x-5 [@container(min-width:64rem)]:gap-x-6">
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
          </div>
          {socials.length ? (
            <ul className="flex items-center gap-3 [@container(min-width:64rem)]:gap-4">
              {socials.map((platform) => (
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
          ) : null}
        </div>
        <FooterRule />
        <FooterLegalBar copyright={<Digits text={copyright ?? copy.copyright} />} links={legal ?? copy.legal} label={legalLabel ?? copy.legalLabel} />
      </div>
    </FooterSection>
  )
}

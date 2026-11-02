"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import type { SocialPlatform } from "../../ui/social-icons/social-icons"
import {
  FooterColumnTitle,
  FooterCopyright,
  FooterLegalLinks,
  FooterLinkItem,
  FooterSection,
  FooterSocial,
  useFooterReveal,
  usePrefersReducedMotion,
  type FooterColumn,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Giant Wordmark.
 *
 * An inverse band: a line of intro copy beside three link columns of four
 * links, a utility row (copyright, legal links, five social marks), and the
 * Fasla lockup drawn huge in flow at the bottom of the block, fully visible.
 *
 * The frames draw the lockup 260 tall on Desktop (803 wide in English, 904 in
 * Arabic), 207 on Tablet (640) and 97 on Mobile (300), at the start edge. The
 * heights are set, so each script keeps its own drawing's proportions.
 *
 * Motion (Figma chip): the link columns fade and rise 12px, 300ms, 60ms apart,
 * once. The lockup rises with the scroll: translateY 48px to 0 over the last
 * 60% of the block's entrance, no spring, driven by a passive scroll listener
 * (a transform on the lockup only). On Mobile the rise would read as noise, so
 * the lockup is pinned and fades in over 260ms. Reduced motion pins it at its
 * final place and plays nothing.
 */

export interface FooterGiantWordmarkCopy {
  /** The big line in the top row. */
  intro: string
  /** The small line under it. Hidden when empty. */
  introSub: string
  /** The link columns, in reading order. */
  columns: FooterColumn[]
  /** The copyright line. */
  copyright: string
  /** The legal links. */
  legal: FooterLink[]
  /** The accessible name of the legal links. */
  legalLabel: string
}

const links = (labels: string[]): FooterLink[] => labels.map((label) => ({ label, href: "#" }))

/** Figma's copy, English and Arabic. */
const COPY: Record<FooterLocale, FooterGiantWordmarkCopy> = {
  en: {
    intro: "A design system that reads both ways.",
    introSub: "Built near City 1, used by product teams from City 2 to City 3.",
    columns: [
      { title: "Product", links: links(["Components", "Blocks", "Templates", "Pricing"]) },
      { title: "Resources", links: links(["Documentation", "Guides", "Blog", "Status"]) },
      { title: "Company", links: links(["About", "Careers", "Press", "Contact"]) },
    ],
    copyright: "© 2026 Fasla",
    legal: links(["Privacy", "Terms", "Cookies"]),
    legalLabel: "Legal links",
  },
  ar: {
    intro: "نظام تصميم يُقرأ في الاتجاهين.",
    introSub: "صُنع قرب مدينة 1، وتستخدمه فرق المنتجات من مدينة 2 إلى مدينة 3.",
    columns: [
      { title: "المنتج", links: links(["المكوّنات", "الكتل", "القوالب", "الأسعار"]) },
      { title: "الموارد", links: links(["التوثيق", "الأدلة", "المدونة", "الحالة"]) },
      { title: "الشركة", links: links(["من نحن", "الوظائف", "الصحافة", "اتصل بنا"]) },
    ],
    copyright: "© 2026 فاصلة",
    legal: links(["الخصوصية", "الشروط", "ملفات تعريف الارتباط"]),
    legalLabel: "روابط قانونية",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerGiantWordmarkCopy = COPY

export interface FooterGiantWordmarkProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, Partial<FooterGiantWordmarkCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The social marks, in order. */
  socials?: SocialPlatform[]
}

const DEFAULT_SOCIALS: SocialPlatform[] = ["linkedin", "x", "github", "dribbble", "youtube"]

/** The container width where Figma's Tablet starts: 40rem. */
const TABLET = 640
/** How far the lockup travels, in px, and the share of the entrance it rises over. */
const RISE = 48
const RISE_SHARE = 0.6

/** Numbers inside Arabic text are Latin digits kept left to right. */
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
 * Drives the lockup. Tablet and Desktop: a passive scroll listener maps how
 * much of the block has entered the window to a translateY from 48px to 0
 * over the last 60% of that, applied with one rAF per scroll burst. Mobile:
 * the lockup stays put and fades in over 260ms the first time the block is
 * seen. Reduced motion: nothing, so the lockup sits at its final place.
 */
function useWordmarkRise(rootRef: React.RefObject<HTMLElement | null>, markRef: React.RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion()
  React.useEffect(() => {
    const root = rootRef.current
    const mark = markRef.current
    if (reduced || !root || !mark || motionReduced()) return
    const width = root.clientWidth
    if (width > 0 && width < TABLET) {
      if (typeof IntersectionObserver === "undefined" || typeof mark.animate !== "function") return
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect()
            mark.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out", fill: "backwards" })
          }
        },
        { threshold: 0.25 }
      )
      observer.observe(root)
      return () => observer.disconnect()
    }
    let frame = 0
    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const entered = rect.height > 0 ? Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height)) : 1
      const progress = Math.min(1, Math.max(0, (entered - (1 - RISE_SHARE)) / RISE_SHARE))
      mark.style.transform = progress >= 1 ? "" : `translateY(${+(RISE * (1 - progress)).toFixed(2)}px)`
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
      mark.style.transform = ""
    }
  }, [reduced, rootRef, markRef])
}

export function FooterGiantWordmark({
  locale = "en",
  intro,
  introSub,
  columns,
  copyright,
  legal,
  legalLabel,
  socials = DEFAULT_SOCIALS,
  className,
  ...props
}: FooterGiantWordmarkProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const markRef = React.useRef<HTMLDivElement>(null)
  useFooterReveal(rootRef, { selector: "[data-reveal]", duration: 300, stagger: 60, rise: 12 })
  useWordmarkRise(rootRef, markRef)
  const sub = introSub ?? copy.introSub
  const cols = columns ?? copy.columns
  const legalLinks = legal ?? copy.legal
  return (
    <FooterSection
      ref={rootRef}
      inverse
      className={cn("overflow-hidden py-8 md:py-16", className)}
      contentClassName="gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-16"
      {...props}
    >
      <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-20">
        <div className="flex flex-col gap-3 [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:gap-4">
          <p className="text-xl text-foreground-inverse">{intro ?? copy.intro}</p>
          {sub ? (
            <p className="text-sm text-muted-foreground-inverse">
              <Digits text={sub} />
            </p>
          ) : null}
        </div>
        {cols.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:w-[700px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:gap-x-10">
            {cols.map((column) => (
              <WordmarkColumn key={column.title} column={column} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterCopyright inverse>
            <Digits text={copyright ?? copy.copyright} />
          </FooterCopyright>
          {legalLinks.length ? <FooterLegalLinks links={legalLinks} inverse label={legalLabel ?? copy.legalLabel} /> : null}
        </div>
        {socials.length ? <FooterSocial platforms={socials} inverse className="gap-3 [@container(min-width:64rem)]:gap-4" /> : null}
      </div>
      <div ref={markRef} data-wordmark="" className="flex will-change-transform">
        <FaslaLogo title="" className="h-[97px] w-auto text-foreground-inverse [@container(min-width:40rem)]:h-[207px] [@container(min-width:64rem)]:h-[260px]" />
      </div>
    </FooterSection>
  )
}

/** A link column on the inverse band: the title in `muted-foreground-inverse`, as Figma binds it. */
function WordmarkColumn({ column }: { column: FooterColumn }) {
  const id = React.useId()
  return (
    <nav aria-labelledby={id} data-reveal="" className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
      <FooterColumnTitle id={id} inverse className="text-muted-foreground-inverse">
        {column.title}
      </FooterColumnTitle>
      <ul className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3">
        {column.links.map((link) => (
          <li key={`${link.label}-${link.href}`} className="flex">
            <FooterLinkItem link={link} inverse />
          </li>
        ))}
      </ul>
    </nav>
  )
}

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Story Photos.
 *
 * A short company story over three snapshot cards. The story (heading, a
 * lead line and a paragraph) is a 720px column centred in the block, its
 * text set from the start. Under it sit three cards in a centred row, each a
 * `card` frame with a hairline border, a small radius and a medium shadow,
 * 12px around a photo and a one-line caption. The outer two tilt, 4° and −3°
 * (CSS degrees, clockwise; Figma stores the opposite sign), the middle one
 * stands straight.
 *
 * Desktop cards are 340 wide with a 236px photo, 48px apart. Tablet keeps
 * the row with 216px cards, 150px photos and 16px gaps. Mobile stacks the
 * cards, 280 wide with 190px photos, 32px apart, tilts kept.
 *
 * In Arabic the row runs right to left and the tilts mirror, as Figma's RTL
 * variants draw them; the photos are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content, and `[@container(min-width:64rem)]:` its Desktop,
 * from 1024px of content. The section's own padding still follows the
 * window, since an element can't query itself.
 */

export interface AboutStoryPhotosPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutStoryPhotosItem {
  /** The caption under the photo. */
  caption: React.ReactNode
  /** The card's photo. A `muted` placeholder when missing. */
  image?: AboutStoryPhotosPhoto
}

export interface AboutStoryPhotosCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading, set darker than the paragraph. */
  lead: React.ReactNode
  /** The story's paragraph. */
  body: React.ReactNode
  /**
   * The snapshot cards, from the start side. Figma draws three; more repeat
   * the tilt pattern and wrap onto further rows.
   */
  items: AboutStoryPhotosItem[]
  /** Shown in place of the cards when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutStoryPhotosCopy> = {
  en: {
    heading: "Our story",
    lead: "Here is how we got here — the honest version, not the brochure one.",
    body: "Fasla began as three friends sharing one long table, a kettle and a stubborn idea: that everyday software could feel calmer. Each of us had spent years in a different corner of design and engineering, and we kept noticing that the people we most wanted to build with were already sitting beside us.",
    items: [
      { caption: "Design crit, Thursday" },
      { caption: "New studio, day one" },
      { caption: "The long kitchen table" },
    ],
    empty: "No photos yet.",
  },
  ar: {
    heading: "قصتنا",
    lead: "هكذا وصلنا إلى هنا، بالرواية الصادقة لا بنسخة الكتيّب الدعائي.",
    body: "بدأت فاصلة بثلاثة أصدقاء يتقاسمون طاولة طويلة وإبريق شاي وفكرة عنيدة: أن البرمجيات اليومية يمكن أن تكون أهدأ. أمضى كل واحد منا سنوات في زاوية مختلفة من التصميم والهندسة، وكنا نلاحظ دائمًا أن الأشخاص الذين نتمنى العمل معهم يجلسون إلى جوارنا بالفعل.",
    items: [
      { caption: "مراجعة التصميم، يوم الخميس" },
      { caption: "الاستوديو الجديد، اليوم الأول" },
      { caption: "طاولة المطبخ الطويلة" },
    ],
    empty: "لا توجد صور بعد.",
  },
}

/** Each slot's tilt, repeating every three cards. RTL mirrors it. */
const TILTS = ["rotate-[4deg] [&:dir(rtl)]:rotate-[-4deg]", "", "rotate-[-3deg] [&:dir(rtl)]:rotate-[3deg]"]

/**
 * Figma's motion: on first entry the heading, lead and paragraph fade up
 * 16px, 80ms apart; then the cards rise 24px, starting flat and easing into
 * their tilt, 120ms apart, 400ms ease-out. Each card is watched on its own,
 * so on a phone, where they stack, each one arrives as it scrolls in; cards
 * that arrive together stagger from the start side (the right in Arabic).
 * Runs once per element; skipped under prefers-reduced-motion.
 */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ease = "cubic-bezier(0, 0, 0.2, 1)"
    const animations: Animation[] = []
    let copyStart = -Infinity

    const story = node.querySelector<HTMLElement>("[data-reveal-story]")
    const copyObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        copyObserver.disconnect()
        copyStart = performance.now()
        Array.from(node.querySelectorAll<HTMLElement>("[data-reveal-copy]")).forEach((line, index) =>
          animations.push(
            line.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
              duration: 400,
              delay: index * 80,
              easing: ease,
              fill: "backwards",
            })
          )
        )
      },
      { threshold: 0.2 }
    )
    if (story) copyObserver.observe(story)

    const cardObserver = new IntersectionObserver(
      (entries) => {
        const arriving = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement)
        // Wait for the copy when it has only just started, as Figma's "then" asks.
        const after = Math.max(0, 400 - (performance.now() - copyStart))
        arriving.forEach((card, index) => {
          cardObserver.unobserve(card)
          const tilt = getComputedStyle(card).transform
          animations.push(
            card.animate(
              [
                { opacity: 0, transform: "translateY(24px) rotate(0deg)" },
                { opacity: 1, transform: tilt === "none" ? "none" : tilt },
              ],
              { duration: 400, delay: after + index * 120, easing: ease, fill: "backwards" }
            )
          )
        })
      },
      { threshold: 0.2 }
    )
    node.querySelectorAll<HTMLElement>("[data-reveal-card]").forEach((card) => cardObserver.observe(card))

    return () => {
      copyObserver.disconnect()
      cardObserver.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root])
}

export interface AboutStoryPhotosProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutStoryPhotosCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function AboutStoryPhotos({
  locale = "en",
  heading,
  lead,
  body,
  items,
  empty,
  className,
  ...props
}: AboutStoryPhotosProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = items ?? copy.items
  useReveal(rootRef)

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12 [@container(min-width:40rem)]:gap-16">
        <div data-reveal-story="" className="flex w-full max-w-[720px] flex-col gap-6">
          <h2
            id={headingId}
            data-reveal-copy=""
            className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
          >
            {heading ?? copy.heading}
          </h2>
          <p data-reveal-copy="" className="text-base font-medium text-foreground [@container(min-width:40rem)]:text-lg">
            {lead ?? copy.lead}
          </p>
          <p data-reveal-copy="" className="text-base text-muted-foreground [@container(min-width:40rem)]:text-lg">
            {body ?? copy.body}
          </p>
        </div>

        {list.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="flex w-full flex-col items-center gap-8 pb-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:flex-wrap [@container(min-width:40rem)]:justify-center [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-12">
            {list.map((item, index) => (
              <li
                key={index}
                data-reveal-card=""
                className={cn(
                  "w-full max-w-[280px] [@container(min-width:40rem)]:max-w-[216px] [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:max-w-[340px]",
                  "transition-transform duration-200 ease-out motion-reduce:transition-none",
                  "hover:[@media(pointer:fine)]:!rotate-0 hover:[@media(pointer:fine)]:-translate-y-1",
                  TILTS[index % TILTS.length]
                )}
              >
                <figure className="flex flex-col gap-3 rounded-sm border border-border bg-card p-3 shadow-md">
                  <div className="relative h-[190px] w-full overflow-hidden rounded-[2px] bg-muted [@container(min-width:40rem)]:h-[150px] [@container(min-width:64rem)]:h-[236px]">
                    {item.image ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <figcaption className="text-xs text-muted-foreground">{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutStoryPhotosCopy = COPY

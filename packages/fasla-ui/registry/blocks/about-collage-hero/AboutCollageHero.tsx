"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `About` (46368:243915), Type=Collage Hero.
 *
 * A centred intro (heading, paragraph, a solid and a ghost button) over a
 * fanned collage of five photo cards. The middle card stands straight and
 * tallest; the pair beside it tilt 7°, the outer pair 12°, each leaning
 * away from the middle and sitting a little lower, so the five read as a
 * hand of cards spread on a table. Every card has the border, a 14px radius
 * and the `md` shadow.
 *
 * Desktop's heading is 48px over a 680px paragraph, its cards 200×250,
 * 240×300 and 280×340 in a 400px-tall collage. Tablet uses Figma's 4XL
 * style, which its responsive size variable sets at 30px on the 4XL line
 * height, with cards of 144×180, 172×216 and 200×244 in 320px. Mobile shows
 * the middle three only (120×150 and 150×184, in 240px), at 30px, with the
 * buttons stacked at full width. Each card's centre is placed as a share of
 * the collage's width, as Figma places it, so the fan holds its shape at any
 * width in a breakpoint.
 *
 * In Arabic the fan mirrors: the first card sits at the right and every
 * tilt turns the other way, as Figma's RTL variants draw it. The photos are
 * never flipped.
 *
 * Motion: once the collage scrolls into view the cards fan out from a stack
 * at its centre (upright, at 0.8 scale and transparent) to their tilts, with
 * an exponential ease-out, 60ms apart in reading order (from the right in Arabic).
 * The motion card's pointer parallax and bobbing are left out, by design
 * decision. Skipped under prefers-reduced-motion.
 *
 * Mobile first, and sized by the block's own width: the section is a query
 * container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * follows the window, since an element can't query itself.
 */

export interface AboutCollageHeroAction {
  label: React.ReactNode
  href: string
}

export interface AboutCollageHeroPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutCollageHeroCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: AboutCollageHeroAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: AboutCollageHeroAction | null
  /** Shown in place of the collage when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutCollageHeroCopy> = {
  en: {
    heading: "The team behind calmer workdays",
    description:
      "We're 140 people across 12 countries with one shared obsession: software that gets out of your way.",
    primaryAction: { label: "See open roles", href: "#careers" },
    secondaryAction: { label: "Meet the team", href: "#team" },
    empty: "No photos yet.",
  },
  ar: {
    heading: "الفريق الذي يجعل أيام العمل أهدأ",
    description: "نحن 140 شخصًا في 12 دولة نتشارك هوسًا واحدًا: برمجيات لا تعترض طريقك.",
    primaryAction: { label: "الوظائف المتاحة", href: "#careers" },
    secondaryAction: { label: "تعرّف على الفريق", href: "#team" },
    empty: "لا توجد صور بعد.",
  },
}

/**
 * The five cards in Figma's order, start to end. `place` is each card's size
 * and position per breakpoint: its centre as a share of the collage's width
 * (Figma's centre over its collage width) less half the card, and its top in
 * px. `rotate` is the tilt: Figma turns a card anticlockwise for a positive
 * angle and CSS clockwise, so each is Figma's negated, and Arabic turns it
 * back. The outer pair is hidden on Mobile.
 */
const CARDS = [
  {
    place:
      "hidden [@container(min-width:40rem)]:block [@container(min-width:40rem)]:h-[180px] [@container(min-width:40rem)]:w-[144px] [@container(min-width:40rem)]:start-[calc(15.14%-72px)] [@container(min-width:40rem)]:top-[63px] [@container(min-width:64rem)]:h-[250px] [@container(min-width:64rem)]:w-[200px] [@container(min-width:64rem)]:start-[calc(12.34%-100px)] [@container(min-width:64rem)]:top-[76px]",
    rotate: "rotate-[-12deg] [&:dir(rtl)]:rotate-[12deg]",
  },
  {
    place:
      "h-[150px] w-[120px] start-[calc(25.3%-60px)] top-9 [@container(min-width:40rem)]:h-[216px] [@container(min-width:40rem)]:w-[172px] [@container(min-width:40rem)]:start-[calc(34.58%-86px)] [@container(min-width:40rem)]:top-[39px] [@container(min-width:64rem)]:h-[300px] [@container(min-width:64rem)]:w-[240px] [@container(min-width:64rem)]:start-[calc(28.61%-120px)] [@container(min-width:64rem)]:top-11",
    rotate: "rotate-[-7deg] [&:dir(rtl)]:rotate-[7deg]",
  },
  {
    place:
      "h-[184px] w-[150px] start-[calc(50%-75px)] top-2.5 [@container(min-width:40rem)]:h-[244px] [@container(min-width:40rem)]:w-[200px] [@container(min-width:40rem)]:start-[calc(50%-100px)] [@container(min-width:40rem)]:top-5 [@container(min-width:64rem)]:h-[340px] [@container(min-width:64rem)]:w-[280px] [@container(min-width:64rem)]:start-[calc(50%-140px)]",
    rotate: "",
  },
  {
    place:
      "h-[150px] w-[120px] start-[calc(74.39%-60px)] top-[51px] [@container(min-width:40rem)]:h-[216px] [@container(min-width:40rem)]:w-[172px] [@container(min-width:40rem)]:start-[calc(64.17%-86px)] [@container(min-width:40rem)]:top-[60px] [@container(min-width:64rem)]:h-[300px] [@container(min-width:64rem)]:w-[240px] [@container(min-width:64rem)]:start-[calc(71.39%-120px)] [@container(min-width:64rem)]:top-[74px]",
    rotate: "rotate-[7deg] [&:dir(rtl)]:rotate-[-7deg]",
  },
  {
    place:
      "hidden [@container(min-width:40rem)]:block [@container(min-width:40rem)]:h-[180px] [@container(min-width:40rem)]:w-[144px] [@container(min-width:40rem)]:start-[calc(84.44%-72px)] [@container(min-width:40rem)]:top-[93px] [@container(min-width:64rem)]:h-[250px] [@container(min-width:64rem)]:w-[200px] [@container(min-width:64rem)]:start-[calc(88.3%-100px)] [@container(min-width:64rem)]:top-[118px]",
    rotate: "rotate-[12deg] [&:dir(rtl)]:rotate-[-12deg]",
  },
]

/**
 * Figma's motion: the cards start stacked at the collage's centre (upright,
 * at 0.8 scale, transparent) and fan out to their tilts with an exponential ease-out,
 * 60ms apart in reading order. Only the cards on screen take part, so Mobile
 * fans three. Runs once, when the collage scrolls into view.
 */
function playFanOut(node: HTMLElement): Animation[] {
  const box = node.getBoundingClientRect()
  const cards = Array.from(node.querySelectorAll<HTMLElement>("[data-card]")).filter(
    (card) => card.getClientRects().length > 0
  )
  return cards.map((card, index) => {
    const rect = card.getBoundingClientRect()
    const dx = box.left + box.width / 2 - (rect.left + rect.width / 2)
    const dy = box.top + box.height / 2 - (rect.top + rect.height / 2)
    const rest = getComputedStyle(card).transform
    return card.animate(
      [
        { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(0.8)` },
        { opacity: 1, transform: rest === "none" ? "none" : rest },
      ],
      {
        duration: 700,
        delay: index * 60,
        // An exponential ease-out: fast, then a long settle with no overshoot.
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      }
    )
  })
}

function useInViewEntrance(root: React.RefObject<HTMLElement | null>, play: (node: HTMLElement) => Animation[]) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        animations = play(node)
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root, play])
}

export interface AboutCollageHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutCollageHeroCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The five card photos, in Figma's order from the start side: the outer
   * start card, the inner start card, the middle card, the inner end card,
   * the outer end card. Mobile shows the middle three (slots 2 to 4).
   * Photos past the fifth are not shown. None by default: five `muted`
   * placeholders. An empty list shows the `empty` line instead of the
   * collage.
   * @default none: `muted` placeholders
   */
  photos?: AboutCollageHeroPhoto[]
}

export function AboutCollageHero({
  locale = "en",
  heading,
  description,
  primaryAction,
  secondaryAction,
  empty,
  photos,
  className,
  ...props
}: AboutCollageHeroProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const collageRef = React.useRef<HTMLDivElement>(null)
  useInViewEntrance(collageRef, playFanOut)
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] overflow-hidden bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <div className="flex w-full flex-col items-center gap-5 text-center">
          <h2
            id={headingId}
            className="max-w-[900px] text-3xl font-semibold text-foreground [@container(min-width:40rem)]:leading-[calc(var(--leading-4xl)*2.25rem)] [@container(min-width:64rem)]:text-5xl"
          >
            {heading ?? copy.heading}
          </h2>
          <p className="max-w-[720px] text-base text-muted-foreground [@container(min-width:40rem)]:text-lg [@container(min-width:64rem)]:max-w-[680px]">
            {description ?? copy.description}
          </p>
          <div className="flex w-full flex-col gap-3 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:justify-center">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "ghost" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>

        {photos && photos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div
            ref={collageRef}
            className="relative h-[240px] w-full [@container(min-width:40rem)]:h-[320px] [@container(min-width:64rem)]:h-[400px]"
          >
            {CARDS.map((card, index) => {
              const photo = photos?.[index]
              return (
                <div
                  key={index}
                  data-card
                  className={cn(
                    "absolute overflow-hidden rounded-xl border border-border bg-muted shadow-md",
                    card.place,
                    card.rotate
                  )}
                >
                  {photo ? (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutCollageHeroCopy = COPY

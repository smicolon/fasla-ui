"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Statement Band.
 *
 * A band in the primary colour carrying one big centred statement under a
 * short eyebrow, with small tilted photos pinned around its edges and cut
 * off by them: one over the top edge at the start, one near the top at the
 * end, one half out of the start edge at mid height, and one off the bottom
 * corner at the end. The band follows the theme (`primary` with its
 * foreground), so it turns light in Dark mode as Figma's binding does.
 *
 * Desktop sets the statement at 60px, 1000px wide at most, with photos of
 * 200×140 and 220×156. Tablet uses Figma's 4XL style, which its responsive
 * size variable sets at 30px on the 4XL line height, 540px wide, with
 * photos about three quarters the size. Mobile sets 30px across the full
 * width and keeps two photos only: the top start one and the bottom end
 * one. Each photo is placed from the band's nearest corner, in px as Figma
 * draws it, except the mid-height one, whose top is a share of the band's
 * height. The statement paints over the photos, so it stays readable where
 * a narrow band brings them together.
 *
 * In Arabic the photos swap sides and their tilts turn the other way, as
 * Figma's RTL variants draw them. The photos themselves are never flipped.
 *
 * Motion: the first time the band scrolls into view the statement rises
 * line by line from behind a mask, 80ms apart. The motion card's scroll
 * parallax on the photos is left out: scroll-linked motion is replaced by
 * the one-time reveal, and the photos stay put. Skipped under
 * prefers-reduced-motion.
 *
 * Mobile first, and sized by the block's own width: the section is a query
 * container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * follows the window, since an element can't query itself.
 */

export interface AboutStatementBandPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutStatementBandCopy {
  /** The short label above the statement. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The statement, the section's heading, an `h2`. A string reveals line by line. */
  statement: React.ReactNode
  /** Shown under the statement when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutStatementBandCopy> = {
  en: {
    eyebrow: "WHO WE ARE",
    statement: "We're designers, engineers, and dreamers building software that feels human.",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "من نحن",
    statement: "نحن مصممون ومهندسون وحالمون نبني برمجيات ذات طابع إنساني.",
    empty: "لا توجد صور بعد.",
  },
}

/**
 * The four edge photos in Figma's order: top start, top end, mid start,
 * bottom end. Sizes and offsets are Figma's per breakpoint; the middle two
 * are hidden on Mobile. Figma turns a photo anticlockwise for a positive
 * angle and CSS clockwise, so each tilt is Figma's negated, and Arabic turns
 * it back.
 */
const EDGE_PHOTOS = [
  {
    place:
      "h-[70px] w-[100px] start-[15px] top-[-24px] [@container(min-width:40rem)]:h-[105px] [@container(min-width:40rem)]:w-[150px] [@container(min-width:40rem)]:start-10 [@container(min-width:40rem)]:top-[-38px] [@container(min-width:64rem)]:h-[140px] [@container(min-width:64rem)]:w-[200px] [@container(min-width:64rem)]:start-[70px] [@container(min-width:64rem)]:top-[-57px]",
    rotate: "rotate-[-5deg] [&:dir(rtl)]:rotate-[5deg]",
  },
  {
    place:
      "hidden [@container(min-width:40rem)]:block [@container(min-width:40rem)]:h-[105px] [@container(min-width:40rem)]:w-[150px] [@container(min-width:40rem)]:end-[-40px] [@container(min-width:40rem)]:top-[38px] [@container(min-width:64rem)]:h-[140px] [@container(min-width:64rem)]:w-[200px] [@container(min-width:64rem)]:end-[-44px] [@container(min-width:64rem)]:top-[54px]",
    rotate: "rotate-[6deg] [&:dir(rtl)]:rotate-[-6deg]",
  },
  {
    place:
      "hidden [@container(min-width:40rem)]:block [@container(min-width:40rem)]:h-[117px] [@container(min-width:40rem)]:w-[165px] [@container(min-width:40rem)]:start-[-52px] [@container(min-width:40rem)]:top-[38%] [@container(min-width:64rem)]:h-[156px] [@container(min-width:64rem)]:w-[220px] [@container(min-width:64rem)]:start-[-71px] [@container(min-width:64rem)]:top-[55%]",
    rotate: "rotate-[-4deg] [&:dir(rtl)]:rotate-[4deg]",
  },
  {
    place:
      "h-[74px] w-[110px] end-[-9px] bottom-[-8px] [@container(min-width:40rem)]:h-[112px] [@container(min-width:40rem)]:w-[165px] [@container(min-width:40rem)]:end-[-56px] [@container(min-width:40rem)]:bottom-[-38px] [@container(min-width:64rem)]:h-[150px] [@container(min-width:64rem)]:w-[220px] [@container(min-width:64rem)]:end-[-75px] [@container(min-width:64rem)]:bottom-[-87px]",
    rotate: "rotate-[4deg] [&:dir(rtl)]:rotate-[-4deg]",
  },
]

/**
 * Figma's motion: the statement rises line by line from behind a mask
 * (100% to 0, 600ms, 80ms apart). The lines are found at run time by the
 * words' tops, so the reveal follows wherever the text wraps. Runs once,
 * the first time the band scrolls into view.
 */
function playReveal(node: HTMLElement): Animation[] {
  const words = Array.from(node.querySelectorAll<HTMLElement>("[data-line-word]"))
  const tops = Array.from(new Set(words.map((word) => word.offsetTop))).sort((a, b) => a - b)
  return words.map((word) => {
    const inner = word.firstElementChild as HTMLElement
    return inner.animate([{ transform: "translateY(100%)" }, { transform: "none" }], {
      duration: 600,
      delay: tops.indexOf(word.offsetTop) * 80,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
      fill: "backwards",
    })
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

export interface AboutStatementBandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutStatementBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The four edge photos, in Figma's order: over the top edge at the start,
   * near the top at the end, half out of the start edge at mid height, off
   * the bottom corner at the end. Mobile shows the first and the fourth.
   * Photos past the fourth are not shown. None by default: four `muted`
   * placeholders. An empty list shows the `empty` line instead.
   * @default none: `muted` placeholders
   */
  photos?: AboutStatementBandPhoto[]
}

export function AboutStatementBand({
  locale = "en",
  eyebrow,
  statement,
  empty,
  photos,
  className,
  ...props
}: AboutStatementBandProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  useInViewEntrance(headingRef, playReveal)
  const label = eyebrow ?? copy.eyebrow
  const text = statement ?? copy.statement
  const noPhotos = photos !== undefined && photos.length === 0

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] relative overflow-hidden bg-primary px-4 pb-20 pt-8 text-primary-foreground md:px-6 md:py-16 lg:p-24",
        className
      )}
      {...props}
    >
      {noPhotos
        ? null
        : EDGE_PHOTOS.map((slot, index) => {
            const photo = photos?.[index]
            return (
              <div
                key={index}
                className={cn("absolute overflow-hidden rounded-xl bg-muted shadow-lg", slot.place, slot.rotate)}
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

      <div className="relative mx-auto flex w-full max-w-[1248px] flex-col items-center gap-8 text-center">
        {label ? <p className="text-sm font-medium">{label}</p> : null}
        <h2
          ref={headingRef}
          id={headingId}
          className="text-3xl font-semibold [@container(min-width:40rem)]:max-w-[540px] [@container(min-width:40rem)]:leading-[calc(var(--leading-4xl)*2.25rem)] [@container(min-width:64rem)]:max-w-[1000px] [@container(min-width:64rem)]:text-6xl"
        >
          {typeof text === "string"
            ? text.split(" ").map((word, index) => (
                <React.Fragment key={index}>
                  {index > 0 ? " " : null}
                  {/* The mask: each word rises from behind its own clip. */}
                  <span data-line-word className="inline-block overflow-hidden align-top">
                    <span className="inline-block">{word}</span>
                  </span>
                </React.Fragment>
              ))
            : text}
        </h2>
        {noPhotos ? <p className="text-sm">{empty ?? copy.empty}</p> : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutStatementBandCopy = COPY

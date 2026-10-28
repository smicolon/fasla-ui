"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Headline Photos.
 *
 * A big start-aligned headline in seven runs, three of them set on a
 * highlighter band ("We are a [small studio] that turns [careful ideas]
 * into [calm software] people enjoy."), over a row of five tall photos.
 * The bands are the warning colour at 30%, 6px round, padded 12px each
 * side. The photos share the row's width equally; each column drops its
 * photo by its own top offset and the photos differ in height, so their
 * tops and bottoms step unevenly along the row.
 *
 * Desktop sets the headline at 60px (runs 12px apart, lines 8px) over
 * photos 260 to 360px tall, offset 0 to 128px, 24px apart. Tablet keeps the
 * five photos at about half the height and offset (143 to 198px tall), 16px
 * apart, under a 48px headline. Mobile uses Figma's 4XL style, which its
 * responsive size variable sets at 24px on the 4XL line height, and shows
 * the first three photos only, 12px apart.
 *
 * In Arabic the headline is the same single flex-wrap line, so `dir="rtl"`
 * on the page starts it on the right with the runs in reading order, and
 * the photo row starts on the right too. The photos are never flipped.
 *
 * Motion: when the block scrolls into view the headline fades in, then each
 * highlight band sweeps in behind its phrase from the start edge (the right
 * in Arabic), 350ms, 120ms apart, while the photos rise 32px into place,
 * 80ms apart in reading order. A photo lifts 6px under a mouse pointer.
 * Under prefers-reduced-motion everything is shown at once and the lift has
 * no transition.
 *
 * Mobile first, and sized by the block's own width: the section is a query
 * container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * follows the window, since an element can't query itself.
 */

export interface AboutHeadlinePhotosPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutHeadlinePhotosRun {
  text: React.ReactNode
  /** Sets the run on the highlighter band. */
  highlight?: boolean
}

export interface AboutHeadlinePhotosCopy {
  /** The headline, an `h2`, as runs in reading order. */
  headline: AboutHeadlinePhotosRun[]
  /** Shown in place of the photo row when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutHeadlinePhotosCopy> = {
  en: {
    headline: [
      { text: "We are a" },
      { text: "small studio", highlight: true },
      { text: "that turns" },
      { text: "careful ideas", highlight: true },
      { text: "into" },
      { text: "calm software", highlight: true },
      { text: "people enjoy." },
    ],
    empty: "No photos yet.",
  },
  ar: {
    headline: [
      { text: "نحن" },
      { text: "استوديو صغير", highlight: true },
      { text: "يحوّل" },
      { text: "الأفكار المتأنية", highlight: true },
      { text: "إلى" },
      { text: "برمجيات هادئة", highlight: true },
      { text: "يستمتع بها الناس." },
    ],
    empty: "لا توجد صور بعد.",
  },
}

/**
 * The five photo columns in Figma's order: each column's top offset (Figma's
 * column paddingTop) and its photo's height, per breakpoint. The last two
 * are hidden on Mobile.
 */
const COLUMNS = [
  {
    column: "",
    photo: "h-40 [@container(min-width:40rem)]:h-[187px] [@container(min-width:64rem)]:h-[340px]",
  },
  {
    column: "pt-6 [@container(min-width:40rem)]:pt-12 [@container(min-width:64rem)]:pt-24",
    photo: "h-[140px] [@container(min-width:40rem)]:h-[165px] [@container(min-width:64rem)]:h-[300px]",
  },
  {
    column: "pt-2 [@container(min-width:40rem)]:pt-5 [@container(min-width:64rem)]:pt-10",
    photo: "h-[170px] [@container(min-width:40rem)]:h-[198px] [@container(min-width:64rem)]:h-[360px]",
  },
  {
    column: "hidden [@container(min-width:40rem)]:block [@container(min-width:40rem)]:pt-16 [@container(min-width:64rem)]:pt-32",
    photo: "[@container(min-width:40rem)]:h-[143px] [@container(min-width:64rem)]:h-[260px]",
  },
  {
    column: "hidden [@container(min-width:40rem)]:block [@container(min-width:40rem)]:pt-2 [@container(min-width:64rem)]:pt-4",
    photo: "[@container(min-width:40rem)]:h-[176px] [@container(min-width:64rem)]:h-[320px]",
  },
]

/**
 * Figma's motion: the headline fades in, the highlight bands sweep in from
 * the start edge 120ms apart, and the photos rise 32px, 80ms apart. Only
 * the photos on screen take part. Runs once, when the block scrolls into
 * view.
 */
function playEntrance(node: HTMLElement): Animation[] {
  const ease = "cubic-bezier(0, 0, 0.2, 1)"
  const rtl = getComputedStyle(node).direction === "rtl"
  const animations: Animation[] = []
  const heading = node.querySelector<HTMLElement>("h2")
  if (heading)
    animations.push(heading.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: ease, fill: "backwards" }))
  node.querySelectorAll<HTMLElement>("[data-band]").forEach((band, index) =>
    animations.push(
      band.animate(
        [
          { transform: "scaleX(0)", transformOrigin: rtl ? "right" : "left" },
          { transform: "none", transformOrigin: rtl ? "right" : "left" },
        ],
        { duration: 350, delay: 250 + index * 120, easing: ease, fill: "backwards" }
      )
    )
  )
  Array.from(node.querySelectorAll<HTMLElement>("[data-photo-column]"))
    .filter((column) => column.getClientRects().length > 0)
    .forEach((column, index) =>
      animations.push(
        column.animate([{ opacity: 0, transform: "translateY(32px)" }, { opacity: 1, transform: "none" }], {
          duration: 500,
          delay: 200 + index * 80,
          easing: ease,
          fill: "backwards",
        })
      )
    )
  return animations
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
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root, play])
}

export interface AboutHeadlinePhotosProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutHeadlinePhotosCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The five photos, in Figma's order from the start side: linen curtain,
   * sketching by hand, drawings on the table, material swatches, studio
   * cabinet. Mobile shows the first three. Photos past the fifth are not
   * shown. None by default: five `muted` placeholders. An empty list shows
   * the `empty` line instead of the row.
   * @default none: `muted` placeholders
   */
  photos?: AboutHeadlinePhotosPhoto[]
}

export function AboutHeadlinePhotos({
  locale = "en",
  headline,
  empty,
  photos,
  className,
  ...props
}: AboutHeadlinePhotosProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  useInViewEntrance(rootRef, playEntrance)
  const runs = headline ?? copy.headline

  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 [@container(min-width:40rem)]:gap-16">
        <h2
          id={headingId}
          className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-2xl font-semibold leading-[calc(var(--leading-4xl)*2.25rem)] text-foreground [@container(min-width:40rem)]:gap-2 [@container(min-width:40rem)]:text-5xl [@container(min-width:64rem)]:gap-x-3 [@container(min-width:64rem)]:text-6xl"
        >
          {runs.map((run, index) =>
            run.highlight ? (
              <span key={index} className="relative isolate px-3">
                <span data-band aria-hidden className="absolute inset-0 -z-10 rounded-sm bg-warning/30" />
                {run.text}
              </span>
            ) : (
              <span key={index}>{run.text}</span>
            )
          )}
        </h2>

        {photos && photos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:gap-6">
            {COLUMNS.map((slot, index) => {
              const photo = photos?.[index]
              return (
                <div key={index} data-photo-column className={cn("min-w-0 flex-1", slot.column)}>
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg bg-muted transition-transform duration-200 ease-out motion-reduce:transition-none hover:[@media(pointer:fine)]:-translate-y-1.5",
                      slot.photo
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
export const aboutHeadlinePhotosCopy = COPY

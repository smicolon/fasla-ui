"use client"

import * as React from "react"
import { Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Masked Type Reveal Hero.
 *
 * A film launch set in one huge two-line word with a photo showing through
 * its letters: an eyebrow, the word, a film still with a play button and a
 * caption plate, then a closing paragraph and a button.
 *
 * Desktop sets the eyebrow and the word at the start and the film still,
 * 460 × 420, at the end, with the paragraph and the button in one row along
 * the foot. Tablet stacks the eyebrow, a smaller word, the still at full
 * width and the same foot row. Mobile stacks the foot too: the paragraph over
 * a full-width button.
 *
 * The word is the `h1`, real text that screen readers read. The photo is
 * painted inside its letters (`background-clip: text`), so the photo's `alt`
 * is never read: the word is the heading. Under it lies the same word in the
 * `border` colour, the letters before the photo fills them.
 *
 * The reveal moves, once: when the word scrolls into view the photo sweeps
 * into the letters from the start edge to the end. The server's HTML, a
 * visitor who asks for reduced motion and a browser without the Web
 * Animations API all get the word fully revealed, with nothing moving. It
 * runs in about a second, so it needs no pause button. Figma's reveal edge
 * and "62%" label were design annotations and are left out.
 *
 * In Arabic the columns mirror: the word sits on the right, the still on the
 * left, and the sweep starts from the right. The caption plate moves to the
 * still's bottom right. The running time stays left to right. Neither photo
 * is flipped, and the play glyph points right in both languages: playback
 * does not mirror.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the word crowds the still, so Tablet's layout
 * covers 768 to 1439.
 */

export interface HeroMaskedTypeRevealAction {
  label: React.ReactNode
  href: string
}

export interface HeroMaskedTypeRevealPlayAction {
  /** The link's accessible name: it shows only a play glyph. */
  label: string
  href: string
}

export interface HeroMaskedTypeRevealPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroMaskedTypeRevealCopy {
  /** The line above the word. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The word, an `h1`, with the photo inside its letters. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph along the foot. */
  description: React.ReactNode
  /** The solid button beside it. */
  primaryAction: HeroMaskedTypeRevealAction
  /**
   * The round play button on the still: a link to the film, not a player.
   * Hidden when null.
   */
  playAction: HeroMaskedTypeRevealPlayAction | null
  /** The plate at the still's foot: the film's title and running time. Hidden when empty. */
  caption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroMaskedTypeRevealCopy> = {
  en: {
    eyebrow: "NORTHFIELD — THE STUDIO FILM",
    headline: "MAKE IT\nMATTER",
    description: "Four minutes on the work behind the work — the teams, the tools, the arguments worth having.",
    primaryAction: { label: "Watch the film", href: "#film" },
    playAction: { label: "Play the film", href: "#film" },
    caption: (
      <>
        MAKE IT MATTER · <bdi dir="ltr">4:12</bdi>
      </>
    ),
  },
  ar: {
    eyebrow: "شمال، فيلم الاستوديو",
    headline: "اصنع\nالفرق",
    description: "أربع دقائق عن العمل خلف العمل: الفرق، والأدوات، والنقاشات التي تستحق.",
    primaryAction: { label: "شاهد الفيلم", href: "#film" },
    playAction: { label: "شغّل الفيلم", href: "#film" },
    caption: (
      <>
        اصنع الفرق، <bdi dir="ltr">4:12</bdi>
      </>
    ),
  },
}

/*
 * The reveal's timing, built from the house motion presets
 * (src/motion/presets.ts): the sweep is four `slow` steps (4 × 260ms), it
 * waits one `base` step (180ms) after the word comes into view, and it moves
 * on the `emphasized` easing.
 */
const REVEAL_MS = 4 * 260
const REVEAL_DELAY_MS = 180
const EMPHASIZED = "cubic-bezier(0.2, 0.8, 0.2, 1)"
/** How much of the word must be on screen before the sweep starts. */
const REVEAL_THRESHOLD = 0.3
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

/**
 * Sweeps the photo into the letters from the start edge, once, when the word
 * scrolls into view. The letters are hidden as soon as the block mounts on
 * the client, so the sweep starts from empty; anything that stops it leaves
 * the word fully revealed, its natural state.
 */
function useLetterReveal(word: React.RefObject<HTMLElement | null>, fill: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const target = word.current
    const node = fill.current
    if (!target || !node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    const reduce = window.matchMedia(REDUCED_MOTION)
    if (reduce.matches) return

    // Clips the fill away from the end edge: the right in LTR, the left in
    // RTL, so the photo grows from the start.
    const sweep = () => {
      const rtl = getComputedStyle(node).direction === "rtl"
      const hidden = rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"
      return node.animate([{ clipPath: hidden }, { clipPath: "inset(0 0 0 0)" }], {
        duration: REVEAL_MS,
        delay: REVEAL_DELAY_MS,
        easing: EMPHASIZED,
        fill: "backwards",
      })
    }

    // Held at its first frame until the word is in view.
    let animation = sweep()
    animation.pause()

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        // Built again, in case the direction changed while it waited.
        animation.cancel()
        animation = sweep()
      },
      { threshold: REVEAL_THRESHOLD }
    )
    observer.observe(target)

    // Reduced motion turned on part way: show the word revealed at once.
    const stop = () => {
      if (!reduce.matches) return
      observer.disconnect()
      animation.cancel()
    }
    reduce.addEventListener("change", stop)

    return () => {
      observer.disconnect()
      reduce.removeEventListener("change", stop)
      animation.cancel()
    }
  }, [word, fill])
}

export interface HeroMaskedTypeRevealProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroMaskedTypeRevealCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo inside the letters. It is painted as the word's background, so
   * its `alt` is never read: the word itself is the heading, and the photo
   * is decorative. None by default: the letters fill with the `foreground`
   * colour instead, and still sweep in.
   * @default none: `foreground` letters
   */
  photo?: HeroMaskedTypeRevealPhoto
  /**
   * The film still on the card. None by default: the card shows the `muted`
   * colour in its place.
   * @default none: a `muted` placeholder
   */
  stillPhoto?: HeroMaskedTypeRevealPhoto
}

export function HeroMaskedTypeReveal({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  playAction,
  caption,
  photo,
  stillPhoto,
  className,
  ...props
}: HeroMaskedTypeRevealProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const wordRef = React.useRef<HTMLHeadingElement>(null)
  const fillRef = React.useRef<HTMLSpanElement>(null)
  useLetterReveal(wordRef, fillRef)

  const label = eyebrow ?? copy.eyebrow
  const word = headline ?? copy.headline
  const primary = primaryAction ?? copy.primaryAction
  const play = playAction === undefined ? copy.playAction : playAction
  const plate = caption ?? copy.caption

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:grid-cols-[minmax(0,1fr)_460px] [@container(min-width:90rem)]:gap-x-16 [@container(min-width:90rem)]:gap-y-0 [@container(min-width:90rem)]:px-[100px] [@container(min-width:90rem)]:pb-[104px] [@container(min-width:90rem)]:pt-[110px]">
        {label ? (
          <p className="text-sm font-medium text-muted-foreground [@container(min-width:90rem)]:col-start-1 [@container(min-width:90rem)]:row-start-1">
            {label}
          </p>
        ) : null}

        {/* Figma sets the word 60px under the eyebrow on Desktop. */}
        <h1
          ref={wordRef}
          id={headingId}
          className="relative w-fit max-w-full whitespace-pre-line break-words text-7xl font-semibold [@container(min-width:90rem)]:col-start-1 [@container(min-width:90rem)]:row-start-2 [@container(min-width:90rem)]:mt-[60px] [@container(min-width:90rem)]:self-start [@container(min-width:90rem)]:text-9xl"
        >
          {/* The letters before the photo fills them: Figma's `border` fill. A copy, hidden from screen readers. */}
          <span aria-hidden="true" className="absolute inset-0 text-border">
            {word}
          </span>
          {/*
             * The real word, on top, with the photo clipped to its letters. In
             * dark mode a wash of `foreground` at 40% lies over the photo, inside
             * the letters only: a photo is mostly dark, and on the dark page its
             * letters would not read. The photo still shows through.
             */}
          <span
            ref={fillRef}
            className={cn(
              "relative block",
              photo
                ? "bg-cover bg-center bg-clip-text text-transparent dark:[--hero-wash:linear-gradient(color-mix(in_oklab,var(--foreground)_40%,transparent),color-mix(in_oklab,var(--foreground)_40%,transparent))]"
                : "text-foreground"
            )}
            style={photo ? { backgroundImage: `var(--hero-wash, none), url(${JSON.stringify(photo.src)})` } : undefined}
          >
            {word}
          </span>
        </h1>

        {/* Figma drops the still 40px below the eyebrow's top on Desktop. */}
        <figure className="relative isolate h-[240px] w-full overflow-hidden rounded-xl bg-muted shadow-lg [@container(min-width:48rem)]:h-[400px] [@container(min-width:90rem)]:col-start-2 [@container(min-width:90rem)]:row-span-2 [@container(min-width:90rem)]:row-start-1 [@container(min-width:90rem)]:mt-10 [@container(min-width:90rem)]:h-[420px]">
          {stillPhoto ? (
            <img src={stillPhoto.src} alt={stillPhoto.alt} decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
          ) : null}
          {play ? (
            <a
              href={play.href}
              aria-label={play.label}
              className="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-background text-foreground shadow-lg [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse focus-visible:dark:outline-foreground"
            >
              {/*
                 * Playback does not mirror: the glyph points right in Arabic
                 * too, so its optical nudge toward its point is a physical
                 * one, not a logical margin.
                 */}
              <Play aria-hidden="true" size={24} strokeWidth={1.5} absoluteStrokeWidth className="translate-x-0.5 fill-current" />
            </a>
          ) : null}
          {plate ? (
            // Figma's plate is black at 60% with white text, dark in both
            // modes over the photo: the inverse tokens in Light, the page's
            // own in Dark.
            <figcaption className="absolute bottom-4 start-4 whitespace-nowrap rounded-full bg-background-inverse/60 px-4 py-2.5 text-xs font-medium text-foreground-inverse dark:bg-background/60 dark:text-foreground [@container(min-width:90rem)]:bottom-5 [@container(min-width:90rem)]:start-5">
              {plate}
            </figcaption>
          ) : null}
        </figure>

        {/* Figma leaves 70px between the still and the foot row on Desktop. */}
        <div className="flex flex-col gap-8 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-between [@container(min-width:90rem)]:col-span-2 [@container(min-width:90rem)]:mt-[70px]">
          <p className="min-w-0 text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:flex-1 [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[560px]">
            {description ?? copy.description}
          </p>
          <a
            href={primary.href}
            className={buttonVariants({ size: "lg", className: "w-full whitespace-nowrap [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:shrink-0" })}
          >
            {primary.label}
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroMaskedTypeRevealCopy = COPY

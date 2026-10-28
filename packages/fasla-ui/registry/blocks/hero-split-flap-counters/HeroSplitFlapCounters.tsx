"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Split-Flap Counters Hero.
 *
 * A centred band in `primary` that reads like a departures board: a small
 * eyebrow, the headline, then three live figures, each set in split-flap
 * tiles with its separators (a dot, a unit) between them and a short label
 * under it, and two buttons at the foot.
 *
 * Desktop centres everything in an 800px band, the three counters side by
 * side with 58 × 86 tiles. Tablet keeps the counters in a row with smaller
 * tiles (49 × 73), 3XL digits and 2XL separators, as the designer approved.
 * Mobile stacks the counters, one centred row each, with 46 × 69 tiles, and
 * the buttons full width, one over the other, in a footer that hugs them.
 *
 * The digits flip, once, as the block comes into view: each tile turns over
 * three flaps to land on its figure, the top half of the old digit folding
 * down over the bottom, tile after tile. Figma's still shows one tile of
 * "4.2M" mid-flip; here every tile moves and then settles. The server HTML,
 * and the page under `prefers-reduced-motion: reduce`, show the final digits
 * at once. The flaps are decoration, hidden from assistive technology: each
 * figure is also there as text, so it reads whether or not the flip ran. The
 * motion is the Web Animations API and needs no keyframes in your config.
 *
 * In Arabic the order of the three counters mirrors, the first on the right.
 * A figure never does: its tiles, dot and unit stay left to right.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroSplitFlapCountersAction {
  label: React.ReactNode
  href: string
}

export interface HeroSplitFlapCountersCounter {
  /**
   * The figure, as text: every digit gets a flap tile, every other character
   * (".", "M", "%") is set between the tiles. Shown left to right in either
   * language.
   */
  value: string
  /** The short line under the tiles. */
  label: React.ReactNode
}

export interface HeroSplitFlapCountersCopy {
  /** The small line above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. */
  headline: React.ReactNode
  /** The figures, in reading order. Figma shows three. */
  counters: HeroSplitFlapCountersCounter[]
  /** The light button. */
  primaryAction: HeroSplitFlapCountersAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: HeroSplitFlapCountersAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroSplitFlapCountersCopy> = {
  en: {
    eyebrow: "LIVE ON THE NETWORK",
    headline: "Numbers that keep moving",
    counters: [
      { value: "214", label: "REGIONS LIVE" },
      { value: "4.2M", label: "REQUESTS / MIN" },
      { value: "99.99%", label: "UPTIME" },
    ],
    primaryAction: { label: "See the status page", href: "#status" },
    secondaryAction: { label: "Read the SLA", href: "#sla" },
  },
  ar: {
    eyebrow: "مباشر على الشبكة",
    headline: "أرقام لا تتوقف",
    counters: [
      { value: "214", label: "منطقة تعمل" },
      { value: "4.2M", label: "طلب في الدقيقة" },
      { value: "99.99%", label: "وقت التشغيل" },
    ],
    primaryAction: { label: "صفحة الحالة", href: "#status" },
    secondaryAction: { label: "اتفاقية الخدمة", href: "#sla" },
  },
}

/*
 * The flip, built from the house motion presets (src/motion/presets.ts).
 * One flap turns in `slow` (260ms) on the `standard` curve; each tile starts
 * `fast` (120ms) after the one before it.
 */
const FLAP_MS = 260
const STAGGER_MS = 120
const EASING = "cubic-bezier(0.2, 0, 0, 1)"
/** Flaps each tile turns over before it lands on its digit. */
const FLAPS = 3
/** How much of the block is on screen before the flip runs. */
const THRESHOLD = 0.3

/** The digits a tile shows on its way to `digit`, oldest first: 3 before 6 is 3, 4, 5. */
function flapRun(digit: string) {
  const end = Number(digit)
  return Array.from({ length: FLAPS }, (_, step) => String((end - FLAPS + step + 10) % 10))
}

/** One digit centred on a whole tile, so a half-tile box shows only its half. */
function Face({ digit, half }: { digit: string; half: "top" | "bottom" }) {
  return (
    <span className={cn("absolute inset-x-0 flex h-[200%] items-center justify-center", half === "top" ? "top-0" : "bottom-0")}>
      {digit}
    </span>
  )
}

function FlapTile({ digit, tile }: { digit: string; tile: number }) {
  const run = flapRun(digit)
  return (
    <span className="relative flex h-[69px] w-[46px] shrink-0 items-center justify-center rounded-sm bg-primary-foreground text-3xl font-semibold text-primary opacity-[0.94] [@container(min-width:48rem)]:h-[73px] [@container(min-width:48rem)]:w-[49px] [@container(min-width:90rem)]:h-[86px] [@container(min-width:90rem)]:w-[58px] [@container(min-width:90rem)]:text-4xl">
      {digit}
      {/*
         * The flaps, one card per step of the run, hidden until the flip is
         * armed. The first step paints on top, so they come last-first. Each
         * card is the old digit's lower half and a flap: its front the old
         * digit's upper half, its back the next digit's lower half. The flap
         * folds down on the seam and lands over the lower half.
         */}
      {run
        .map((from, step) => (
          <span key={step} data-hero-flap-card="" data-tile={tile} data-step={step} className="invisible absolute inset-0 [perspective:400px]">
            <span className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-sm bg-primary-foreground">
              <Face digit={from} half="bottom" />
            </span>
            <span data-hero-flap="" className="absolute inset-x-0 top-0 h-1/2 origin-bottom [transform-style:preserve-3d]">
              <span className="absolute inset-0 overflow-hidden rounded-t-sm bg-primary-foreground [backface-visibility:hidden]">
                <Face digit={from} half="top" />
              </span>
              <span className="absolute inset-0 overflow-hidden rounded-b-sm bg-primary-foreground shadow-sm [backface-visibility:hidden] [transform:rotateX(180deg)]">
                <Face digit={run[step + 1] ?? digit} half="bottom" />
              </span>
            </span>
          </span>
        ))
        .reverse()}
      <span className="absolute inset-x-0 top-1/2 h-px bg-primary/25" />
    </span>
  )
}

export interface HeroSplitFlapCountersProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroSplitFlapCountersCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function HeroSplitFlapCounters({
  locale = "en",
  eyebrow,
  headline,
  counters,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: HeroSplitFlapCountersProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const listRef = React.useRef<HTMLDListElement>(null)
  const label = eyebrow ?? copy.eyebrow
  const figures = counters ?? copy.counters
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const values = figures.map((counter) => counter.value).join("|")

  // Every digit is one tile, numbered across the counters in reading order
  // for the stagger.
  let tiles = 0
  const rows = figures.map((counter) =>
    Array.from(counter.value).map((char) => (/\d/.test(char) ? { char, tile: tiles++ } : { char, tile: -1 }))
  )

  React.useEffect(() => {
    const list = listRef.current
    if (!list || typeof IntersectionObserver === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduce.matches) return
    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-hero-flap-card]"))
    if (cards.length === 0 || typeof cards[0]!.animate !== "function") return
    const animations: Animation[] = []

    // Back to the server's final digits: no flaps showing, nothing running.
    const settle = () => {
      observer.disconnect()
      reduce.removeEventListener("change", onReduce)
      for (const animation of animations) animation.cancel()
      animations.length = 0
      for (const card of cards) card.style.visibility = ""
    }
    const onReduce = () => {
      if (reduce.matches) settle()
    }

    const flip = () => {
      for (const card of cards) {
        const start = Number(card.dataset.tile) * STAGGER_MS + Number(card.dataset.step) * FLAP_MS
        const flap = card.querySelector<HTMLElement>("[data-hero-flap]")
        if (flap) {
          animations.push(
            flap.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-180deg)" }], {
              delay: start,
              duration: FLAP_MS,
              easing: EASING,
              fill: "forwards",
            })
          )
        }
        // Landed: the card gives way to the next one under it.
        animations.push(card.animate([{ opacity: 1 }, { opacity: 0 }], { delay: start + FLAP_MS, duration: 1, fill: "forwards" }))
      }
      Promise.all(animations.map((animation) => animation.finished)).then(settle, () => {})
    }

    // Armed as soon as the page is interactive, so the tiles already show the
    // first digit of their run when they scroll in, then flip once.
    for (const card of cards) card.style.visibility = "visible"
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        flip()
      },
      { threshold: THRESHOLD }
    )
    observer.observe(list)
    reduce.addEventListener("change", onReduce)
    return settle
  }, [values])

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-primary", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col items-center gap-10 px-4 py-8 text-center [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:min-h-[800px] [@container(min-width:90rem)]:justify-center [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:py-20">
        <div className="flex w-full flex-col gap-4 [@container(min-width:90rem)]:max-w-[820px]">
          {label ? <p className="text-sm font-medium text-primary-foreground">{label}</p> : null}
          <h1 id={headingId} className="text-balance text-4xl font-semibold text-primary-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl">
            {headline ?? copy.headline}
          </h1>
        </div>

        <dl
          ref={listRef}
          className="flex w-full flex-col items-center gap-[26px] [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-start [@container(min-width:48rem)]:justify-center [@container(min-width:48rem)]:gap-7 [@container(min-width:90rem)]:gap-8"
        >
          {figures.map((counter, index) => (
            <div key={index} className="flex flex-col-reverse items-center gap-2.5 [@container(min-width:90rem)]:gap-3">
              <dt className="whitespace-nowrap text-xxs font-medium text-primary-foreground/70 [@container(min-width:90rem)]:text-xs">{counter.label}</dt>
              <dd>
                {/* The figure as text, for assistive technology; the tiles are its picture. */}
                <bdi dir="ltr" className="sr-only">
                  {counter.value}
                </bdi>
                <bdi dir="ltr" aria-hidden="true" className="flex items-start gap-[5px] [@container(min-width:90rem)]:gap-1.5">
                  {rows[index]!.map((glyph, position) =>
                    glyph.tile >= 0 ? (
                      <FlapTile key={position} digit={glyph.char} tile={glyph.tile} />
                    ) : (
                      <span
                        key={position}
                        className="px-0.5 py-1.5 text-2xl font-semibold text-primary-foreground [@container(min-width:90rem)]:py-2 [@container(min-width:90rem)]:text-3xl"
                      >
                        {glyph.char}
                      </span>
                    )
                  )}
                </bdi>
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex w-full flex-col gap-4 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:justify-center">
          <a href={primary.href} className={buttonVariants({ variant: "secondary", size: "lg" })}>
            {primary.label}
          </a>
          {secondary ? (
            <a
              href={secondary.href}
              // Figma sets the ghost label in `primary-foreground` to read on
              // the band; the hover tint follows it, so the label stays legible.
              className={buttonVariants({
                variant: "ghost",
                tone: "secondary",
                size: "lg",
                className: "text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/10",
              })}
            >
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroSplitFlapCountersCopy = COPY

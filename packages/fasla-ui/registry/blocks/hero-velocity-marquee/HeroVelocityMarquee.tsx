"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Velocity Marquee Hero.
 *
 * A studio introduction told in type: an eyebrow, the headline and a
 * paragraph, then a stage of three huge rows of words running across the
 * block at slight angles. The first two tilt toward each other and cross on
 * purpose; the second is in `info`, the third in `foreground` at a quarter
 * strength. A pill on the inverse surface under the stage names the speed,
 * as static copy, and a button sits at the end of that row.
 *
 * The rows scroll on their own, as the designer decided: the first and third
 * toward the start of the line, the second toward its end, at one em a
 * second, so the speed follows the type size. Each row loops seamlessly over
 * a duplicate of its run. A pause button beside the pill eases all three to
 * a stop and starts them again; it is not in Figma, but moving content needs
 * a way to stop it (WCAG 2.2.2). Under `prefers-reduced-motion: reduce` the
 * rows stay at rest and the pause button is not shown. The server renders
 * the rows at rest; the motion is the Web Animations API, client only, so
 * the block needs no keyframes in your Tailwind config.
 *
 * The rows are decorative repetition, so they are hidden from assistive
 * technology. Their words are said once, as a visually hidden list, in the
 * order the rows show them.
 *
 * Desktop draws the rows in 7XL on a 380px stage, the copy 700px wide over
 * it, and the pill and the button 20px under it. Tablet sets the rows in 5XL
 * on a 266px stage and the headline in 4XL; Mobile sets the rows and the
 * headline in 3XL on a 160px stage. At every width the stage runs to the
 * block's edges, past the content's padding, and the rows run past the
 * stage's, so they never stop short. On Mobile the button sits under the
 * pill and the pause button, which leave it no room beside them.
 *
 * In Arabic the rows run the mirrored way, the start being the right, and
 * tilt the other way; the pill and the button swap sides. The speed stays
 * left to right.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroVelocityMarqueeAction {
  label: React.ReactNode
  href: string
}

/** One row's words, said once. The row repeats them. */
export type HeroVelocityMarqueeRow = string[]

export interface HeroVelocityMarqueeCopy {
  /** The line above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /**
   * The three rows' words, top row first. Set in capitals on screen; the
   * hidden list reads them as written.
   */
  rows: [HeroVelocityMarqueeRow, HeroVelocityMarqueeRow, HeroVelocityMarqueeRow]
  /** What sits between the words in a row, spaces included. */
  separator: string
  /** The pill under the stage. Static copy: it names the speed, it does not measure it. */
  velocity: React.ReactNode
  /** The solid button at the end of the pill's row. */
  primaryAction: HeroVelocityMarqueeAction
  /** The pause button's accessible name while the rows move. */
  pauseLabel: string
  /** Its accessible name while they are paused. */
  playLabel: string
}

/**
 * Figma's copy, English and Arabic, but for the description. Figma's says the
 * type leans as you scroll faster and settles as you slow down; the rows here
 * run at one speed, so the description says what the studio does instead.
 */
const COPY: Record<"en" | "ar", HeroVelocityMarqueeCopy> = {
  en: {
    eyebrow: "NORTHFIELD STUDIO",
    headline: "We make brands move",
    description: "Identity, motion and film for brands that never stand still.",
    rows: [
      ["Identity", "Motion", "Product"],
      ["Strategy", "Type", "Sound"],
      ["Web", "Film", "Packaging"],
    ],
    separator: " · ",
    velocity: (
      <>
        velocity <bdi dir="ltr">×2.4</bdi>
        {"  "}↓ scrolling
      </>
    ),
    primaryAction: { label: "See the reel", href: "#reel" },
    pauseLabel: "Pause the animation",
    playLabel: "Play the animation",
  },
  ar: {
    eyebrow: "استوديو شمال",
    headline: "نمنح العلامات حركتها",
    description: "هوية وحركة وأفلام لعلامات لا تعرف السكون.",
    rows: [
      ["الهوية", "الحركة", "المنتج"],
      ["الاستراتيجية", "الخط", "الصوت"],
      ["الويب", "الأفلام", "التغليف"],
    ],
    separator: "   ",
    velocity: (
      <>
        السرعة <bdi dir="ltr">×2.4</bdi>
        {"  "}↓ تمرير
      </>
    ),
    primaryAction: { label: "شاهد العرض", href: "#reel" },
    pauseLabel: "إيقاف الحركة مؤقتًا",
    playLabel: "تشغيل الحركة",
  },
}

/** The rows' speed, in ems a second: about 72px a second on Desktop, 48 on Tablet, 30 on Mobile. */
const SPEED_EM = 1
/** Word groups in one run: wide enough to cover a 4K-wide stage before the duplicate. */
const RUN_LENGTH = 8
/** How long the rows take to ease to a stop, and back: the motion presets' slow step. */
const EASE_MS = 260

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {}
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Whether the visitor asks for reduced motion. False on the server and while
 * hydrating, so both renders agree, then the setting as it is and as it
 * changes.
 */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

function MarqueeRow({
  text,
  toward,
  paused,
  reduced,
  className,
}: {
  /** One run of the row: its words repeated, separators included. */
  text: string
  /** Which end of the line the run travels toward. */
  toward: "start" | "end"
  /** Stopped with the pause button. */
  paused: boolean
  /** Reduced motion: the row stays at rest. */
  reduced: boolean
  /** The row's place, tilt and colour. */
  className: string
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const runRef = React.useRef<HTMLSpanElement>(null)
  const animationRef = React.useRef<Animation | null>(null)
  const easeFrame = React.useRef(0)
  const pausedRef = React.useRef(paused)
  pausedRef.current = paused

  React.useEffect(() => {
    const track = trackRef.current
    const run = runRef.current
    if (!track || !run || reduced || typeof track.animate !== "function") return

    const play = () => {
      animationRef.current?.cancel()
      animationRef.current = null
      const width = run.getBoundingClientRect().width
      if (width === 0) return
      // The duplicate run follows the first toward the line's end, so moving
      // toward the start slides it in. The start is the left in LTR and the
      // right in RTL.
      const style = getComputedStyle(track)
      const shift = (style.direction === "rtl" ? 1 : -1) * width
      const from = toward === "start" ? 0 : shift
      const to = toward === "start" ? shift : 0
      const speed = SPEED_EM * parseFloat(style.fontSize)
      animationRef.current = track.animate(
        [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
        { duration: (width / speed) * 1000, iterations: Infinity, easing: "linear" }
      )
      // A resize (a new type size, a loaded font) restarts the run; a paused
      // row stays still.
      if (pausedRef.current) animationRef.current.playbackRate = 0
    }

    play()
    const observer = new ResizeObserver(play)
    observer.observe(run)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(easeFrame.current)
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [toward, reduced])

  // The pause button eases the row to a stop, and back.
  React.useEffect(() => {
    const animation = animationRef.current
    if (!animation) return
    cancelAnimationFrame(easeFrame.current)
    const target = paused ? 0 : 1
    const from = animation.playbackRate
    const began = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / EASE_MS)
      animation.playbackRate = from + (target - from) * (1 - (1 - t) * (1 - t))
      if (t < 1) easeFrame.current = requestAnimationFrame(step)
    }
    easeFrame.current = requestAnimationFrame(step)
  }, [paused])

  return (
    <div
      aria-hidden="true"
      className={cn(
        // A quarter wider than the stage on each side, so a tilted row's ends
        // stay past the stage's edges. The tilt turns about the row's centre.
        "absolute inset-x-[-25%] -translate-y-1/2 text-3xl font-semibold uppercase [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-7xl",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max">
        <span ref={runRef} className="shrink-0 whitespace-pre">
          {text}
        </span>
        <span className="shrink-0 whitespace-pre">{text}</span>
      </div>
    </div>
  )
}

export interface HeroVelocityMarqueeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroVelocityMarqueeCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function HeroVelocityMarquee({
  locale = "en",
  eyebrow,
  headline,
  description,
  rows,
  separator,
  velocity,
  primaryAction,
  pauseLabel,
  playLabel,
  className,
  ...props
}: HeroVelocityMarqueeProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const label = eyebrow ?? copy.eyebrow
  const words = rows ?? copy.rows
  const between = separator ?? copy.separator
  const primary = primaryAction ?? copy.primaryAction
  // One run of a row: its words, then a separator before the next group.
  const run = (row: HeroVelocityMarqueeRow) => (row.join(between) + between).repeat(RUN_LENGTH)

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one. The stage alone
         * runs to the section's edges.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-5 [@container(min-width:90rem)]:px-[110px] [@container(min-width:90rem)]:pb-[60px] [@container(min-width:90rem)]:pt-[90px]">
        <div className="flex flex-col gap-4 [@container(min-width:90rem)]:max-w-[700px]">
          {label ? <p className="text-sm font-medium text-muted-foreground">{label}</p> : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl">
            {headline ?? copy.headline}
          </h1>
          <p className="text-pretty text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>

        {/*
         * The stage's negative margins carry it from the content's edges to
         * the section's, whatever the padding and the cap. It clips the rows
         * sideways only, so a tilted row's letters are never cut at the top
         * or the bottom. Figma spaces it 76px under the copy on Desktop.
         */}
        <div className="relative mx-[calc(50%_-_50cqw)] h-40 overflow-x-clip [@container(min-width:48rem)]:h-[266px] [@container(min-width:90rem)]:mt-14 [@container(min-width:90rem)]:h-[380px]">
          <ul className="sr-only">
            {words.flat().map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
          <MarqueeRow
            text={run(words[0])}
            toward="start"
            paused={paused}
            reduced={reduced}
            className="top-[38px] rotate-[1.5deg] text-foreground [&:dir(rtl)]:-rotate-[1.5deg] [@container(min-width:48rem)]:top-[67px] [@container(min-width:90rem)]:top-[100px]"
          />
          <MarqueeRow
            text={run(words[1])}
            toward="end"
            paused={paused}
            reduced={reduced}
            className="top-[77px] -rotate-[1.2deg] text-info [&:dir(rtl)]:rotate-[1.2deg] [@container(min-width:48rem)]:top-[127px] [@container(min-width:90rem)]:top-[177px]"
          />
          <MarqueeRow
            text={run(words[2])}
            toward="start"
            paused={paused}
            reduced={reduced}
            className="top-[144px] rotate-[0.8deg] text-foreground/25 [&:dir(rtl)]:-rotate-[0.8deg] [@container(min-width:48rem)]:top-[241px] [@container(min-width:90rem)]:top-[347px]"
          />
        </div>

        {/*
         * Figma's Mobile fits the pill and the button on one row; with the
         * pause button beside the pill it does not, so Mobile puts the button
         * under them. Under reduced motion there is no pause button and the
         * row is Figma's again.
         */}
        <div
          className={cn(
            "flex gap-3",
            reduced
              ? "items-center justify-between"
              : "flex-col items-start [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <p className="whitespace-pre rounded-full bg-background-inverse px-3 py-1.5 text-xs font-medium text-foreground-inverse">
              {velocity ?? copy.velocity}
            </p>
            {reduced ? null : (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                radius="rounded"
                aria-label={paused ? playLabel ?? copy.playLabel : pauseLabel ?? copy.pauseLabel}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? (
                  <Play aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth />
                ) : (
                  <Pause aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth />
                )}
              </Button>
            )}
          </div>
          <a href={primary.href} className={buttonVariants({ size: "lg" })}>
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
export const heroVelocityMarqueeCopy = COPY

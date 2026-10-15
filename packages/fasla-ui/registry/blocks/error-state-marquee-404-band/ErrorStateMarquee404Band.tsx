"use client"

import * as React from "react"
import { CircleDot, Signpost } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Marquee 404 Band.
 *
 * A centred message between two tickers on inverted bands. The bands are
 * painted with the inverse tokens, the only way Fasla inverts a surface: dark
 * in Light, light in Dark. The theme-inverse registry item maps them, falling
 * back to the page colours swapped in a theme without them.
 *
 * The tickers scroll for real, as Figma's motion notes ask: the top one
 * toward the start of the line and the bottom one toward its end, at 55px a
 * second (half that below Tablet), each looping seamlessly over a duplicate of
 * its run. Hovering a band eases it to a stop over 300ms, and leaving it eases
 * it back. In Arabic the start is the right, so both swap directions. Under
 * `prefers-reduced-motion: reduce` neither moves. The animation is the Web
 * Animations API, so the block needs no keyframes in your Tailwind config.
 *
 * The tickers repeat the heading's news, so they are hidden from assistive
 * technology; the heading carries it. The signpost is a pictogram and is never
 * mirrored. Mobile first: the base classes are Figma's Mobile (360), `md:` its
 * Tablet (768) and `lg:` its Desktop (1440).
 */

export interface ErrorStateMarquee404BandAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateMarquee404BandCopy {
  /** The code in each ticker, in the inverse foreground. */
  tickerCode: React.ReactNode
  /** The words after it in each ticker, in the muted inverse foreground. */
  tickerLabel: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateMarquee404BandAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: ErrorStateMarquee404BandAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateMarquee404BandCopy> = {
  en: {
    tickerCode: "404",
    tickerLabel: "PAGE NOT FOUND",
    heading: "Nothing lives at this address",
    description:
      "The link may be old, or the page may have been renamed. Everything else on Fasla is exactly where it should be.",
    primaryAction: { label: "Take me home", href: "/" },
    secondaryAction: { label: "Search the site", href: "#search" },
  },
  ar: {
    tickerCode: "404",
    tickerLabel: "الصفحة غير موجودة",
    heading: "لا يوجد شيء على هذا العنوان",
    description: "قد يكون الرابط قديمًا، أو أُعيدت تسمية الصفحة. كل شيء آخر في فاصلة في مكانه تمامًا.",
    primaryAction: { label: "خذني إلى الرئيسية", href: "/" },
    secondaryAction: { label: "ابحث في الموقع", href: "#search" },
  },
}

/** Figma's speed, in pixels a second, from Tablet up; below Tablet it is halved. */
const SPEED = 55
/** Code-and-label pairs in one run: wide enough to fill a 2560px screen before the duplicate. */
const RUN_LENGTH = 8
/** How long a band takes to ease to a stop on hover, and back. */
const EASE_MS = 300

function Ticker({
  code,
  label,
  toward,
}: {
  code: React.ReactNode
  label: React.ReactNode
  /** Which end of the line the run travels toward. */
  toward: "start" | "end"
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const runRef = React.useRef<HTMLDivElement>(null)
  const animationRef = React.useRef<Animation | null>(null)
  const easeFrame = React.useRef(0)

  React.useEffect(() => {
    const track = trackRef.current
    const run = runRef.current
    if (!track || !run || typeof track.animate !== "function") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const tablet = window.matchMedia("(min-width: 768px)")

    const play = () => {
      animationRef.current?.cancel()
      animationRef.current = null
      const width = run.getBoundingClientRect().width
      if (reduce.matches || width === 0) return
      // The duplicate run follows the first toward the line's end, so moving
      // toward the start slides it in. The start is the left in LTR and the
      // right in RTL.
      const rtl = getComputedStyle(track).direction === "rtl"
      const shift = (rtl ? 1 : -1) * width
      const from = toward === "start" ? 0 : shift
      const to = toward === "start" ? shift : 0
      const speed = tablet.matches ? SPEED : SPEED / 2
      animationRef.current = track.animate(
        [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
        { duration: (width / speed) * 1000, iterations: Infinity, easing: "linear" }
      )
    }

    play()
    const observer = new ResizeObserver(play)
    observer.observe(run)
    reduce.addEventListener("change", play)
    tablet.addEventListener("change", play)
    return () => {
      observer.disconnect()
      reduce.removeEventListener("change", play)
      tablet.removeEventListener("change", play)
      cancelAnimationFrame(easeFrame.current)
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [toward])

  /** Eases the band's speed to `target` (0 stops it, 1 is full speed). */
  const easeTo = (target: number) => {
    const animation = animationRef.current
    if (!animation) return
    cancelAnimationFrame(easeFrame.current)
    const from = animation.playbackRate
    const began = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / EASE_MS)
      animation.playbackRate = from + (target - from) * (1 - (1 - t) * (1 - t))
      if (t < 1) easeFrame.current = requestAnimationFrame(step)
    }
    easeFrame.current = requestAnimationFrame(step)
  }

  const pairs = Array.from({ length: RUN_LENGTH }, (_, index) => (
    <React.Fragment key={index}>
      <span className="text-foreground-inverse">{code}</span>
      <CircleDot strokeWidth={1.5} className="size-3 shrink-0 text-muted-foreground-inverse" />
      <span className="whitespace-nowrap text-muted-foreground-inverse">{label}</span>
      <CircleDot strokeWidth={1.5} className="size-3 shrink-0 text-muted-foreground-inverse" />
    </React.Fragment>
  ))

  return (
    <div
      aria-hidden="true"
      onPointerEnter={() => easeTo(0)}
      onPointerLeave={() => easeTo(1)}
      className="flex h-14 items-center overflow-hidden bg-background-inverse ps-6 text-lg font-semibold md:h-[68px] md:text-xl lg:h-[76px]"
    >
      <div ref={trackRef} className="flex w-max shrink-0">
        <div ref={runRef} className="flex shrink-0 items-center gap-4 pe-4 md:gap-6 md:pe-6">
          {pairs}
        </div>
        <div className="flex shrink-0 items-center gap-4 pe-4 md:gap-6 md:pe-6">{pairs}</div>
      </div>
    </div>
  )
}

export interface ErrorStateMarquee404BandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateMarquee404BandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph in the badge. Pass `null` to drop the badge.
   * @default a signpost
   */
  icon?: React.ReactNode
}

export function ErrorStateMarquee404Band({
  locale = "en",
  tickerCode,
  tickerLabel,
  heading,
  description,
  primaryAction,
  secondaryAction,
  icon,
  className,
  ...props
}: ErrorStateMarquee404BandProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const code = tickerCode ?? copy.tickerCode
  const label = tickerLabel ?? copy.tickerLabel
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const glyph = icon === undefined ? <Signpost aria-hidden="true" strokeWidth={1.5} className="size-7" /> : icon

  return (
    <section aria-labelledby={headingId} className={cn("bg-background", className)} {...props}>
      <Ticker code={code} label={label} toward="start" />

      <div className="p-8 md:px-16 md:py-12 lg:px-24 lg:py-16">
        <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 text-center">
          {glyph ? (
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground md:size-16">
              {glyph}
            </div>
          ) : null}
          <div className="flex w-full flex-col gap-2.5">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <Ticker code={code} label={label} toward="end" />
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateMarquee404BandCopy = COPY

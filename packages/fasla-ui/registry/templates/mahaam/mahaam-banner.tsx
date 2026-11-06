"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import { MahaamPauseButton, usePausedState, type MahaamPauseButtonLabels } from "./mahaam-pause-button"
import { useInView, useLoopAnimation, usePageVisible, usePrefersReducedMotion } from "./mahaam-motion"

/*
 * Figma: `Mahaam Template` (47694:6712), the Banner section of each of its six
 * variants, and its motion card "Banner Rings".
 *
 * An outlined panel (no fill) with a voice icon, a line, and two buttons. Three
 * outline rings expand from a corner of the panel and fade, one after another,
 * and the bars in the icon swell and settle. Desktop sets everything on one
 * row; Tablet puts the buttons under the copy; Mobile stacks it all and gives
 * the buttons the full width.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): the rings and the bars loop on
 * their own. They wait under the pointer, while the section is off screen and
 * while the page is hidden, and the pause button stops them. Under
 * `prefers-reduced-motion: reduce` they stay on Figma's still frame (the rings
 * at full size, the bars at full height) and the button is not drawn.
 *
 * In Arabic the rings start from the other corner and the icon moves to the
 * end of the line.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"

export interface MahaamBannerCopy {
  heading: string
  body: string
  primary: string
  secondary: string
}

const COPY: Record<Locale, MahaamBannerCopy> = {
  en: {
    heading: "Your next meeting starts soon.",
    body: "Set Mahaam up in two minutes, before it does.",
    primary: "Get Mahaam free",
    secondary: "Book a demo",
  },
  ar: {
    heading: "اجتماعك القادم يبدأ قريبًا.",
    body: "جهّز مهام في دقيقتين، قبل أن يبدأ.",
    primary: "ابدأ مع مهام مجانًا",
    secondary: "احجز عرضًا تجريبيًا",
  },
}

export interface MahaamBannerProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamBannerCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /**
   * Where the solid button goes.
   * @default "#get-mahaam"
   */
  primaryHref?: string
  /**
   * Where the outline button goes.
   * @default "#demo"
   */
  secondaryHref?: string
  paused?: boolean
  defaultPaused?: boolean
  /** Holds the section on Figma's still frame without changing the pause button, which still shows Pause. For stills of the finished state. */
  still?: boolean
  onPausedChange?: (paused: boolean) => void
  pauseLabels?: Partial<MahaamPauseButtonLabels>
  /** Where in the 5s ring loop the rings start, 0 to 1. Without it they rest on Figma's still frame until they play. */
  progress?: number
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

/** The icon's bars at their full height, which is how Figma draws them. */
const BAR_HEIGHTS = [7, 12, 15, 10, 14, 8, 12, 16]
const BAR_KEYFRAMES: Keyframe[] = [{ transform: "scaleY(.3)" }, { transform: "scaleY(1)" }, { transform: "scaleY(.3)" }]
const RING_KEYFRAMES: Keyframe[] = [
  { transform: "scale(.35)", opacity: 1 },
  { transform: "scale(1.25)", opacity: 0 },
]
const RING_MS = 5000
const RING_GAP_MS = 1600

function Bar({ height, index, enabled, active, at }: { height: number; index: number; enabled: boolean; active: boolean; at?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useLoopAnimation(ref, BAR_KEYFRAMES, { duration: 900, iterations: Infinity, easing: "ease-in-out", delay: -index * 110 }, { enabled, active, at })
  return <span ref={ref} className="block w-[2.5px] shrink-0 rounded-[1px] bg-foreground" style={{ height }} />
}

function Ring({ index, className, still, enabled, active, at }: { index: number; className: string; still: string; enabled: boolean; active: boolean; at?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useLoopAnimation(ref, RING_KEYFRAMES, { duration: RING_MS, iterations: Infinity, easing: "ease-out", delay: index * RING_GAP_MS }, { enabled, active, at })
  return <span ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute rounded-full border border-border", className, !enabled && still)} />
}

export function MahaamBanner({
  locale = "en",
  heading,
  body,
  primary,
  secondary,
  primaryHref = "#get-mahaam",
  secondaryHref = "#demo",
  paused: pausedProp,
  defaultPaused,
  still,
  onPausedChange,
  pauseLabels,
  progress,
  reducedMotion,
  className,
  ...props
}: MahaamBannerProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion(reducedMotion)
  const inView = useInView(rootRef)
  const visible = usePageVisible()
  const { paused, toggle } = usePausedState({ paused: pausedProp, defaultPaused, onPausedChange })
  const frozen = paused || Boolean(still)
  const [hovered, setHovered] = React.useState(false)
  const active = !frozen && !reduced && inView && visible && !hovered
  // The rings rest on Figma's frame until they first play (or are given a place in the loop).
  const [started, setStarted] = React.useState(progress !== undefined)
  React.useEffect(() => {
    if (active) setStarted(true)
  }, [active])
  const animate = started && !reduced
  const at = progress !== undefined ? progress * RING_MS : undefined

  return (
    <section ref={rootRef} className={cn("[container-type:inline-size]", className)} {...props}>
      <div className="mx-auto max-w-[1440px] px-8 pb-24 pt-8 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-36 [@container(min-width:48rem)]:pt-12 [@container(min-width:90rem)]:px-28 [@container(min-width:90rem)]:pb-40 [@container(min-width:90rem)]:pt-16">
        <div
          className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-border px-6 py-8 [--mahaam-cx:60px] [--mahaam-cy:60px] [--mahaam-d1:115.5px] [--mahaam-d2:178.5px] [--mahaam-d3:241.5px] [@container(min-width:48rem)]:px-10 [@container(min-width:48rem)]:py-12 [@container(min-width:48rem)]:[--mahaam-d1:161.7px] [@container(min-width:48rem)]:[--mahaam-d2:249.9px] [@container(min-width:48rem)]:[--mahaam-d3:338.1px] [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-center [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-10 [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:py-14 [@container(min-width:90rem)]:[--mahaam-cx:90px] [@container(min-width:90rem)]:[--mahaam-cy:168px] [@container(min-width:90rem)]:[--mahaam-d1:231px] [@container(min-width:90rem)]:[--mahaam-d2:357px] [@container(min-width:90rem)]:[--mahaam-d3:483px]"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <Ring index={0} enabled={animate} active={active} at={at} className="size-[var(--mahaam-d1)] end-[calc(var(--mahaam-cx)-var(--mahaam-d1)/2)] top-[calc(var(--mahaam-cy)-var(--mahaam-d1)/2)]" still="opacity-100" />
          <Ring index={1} enabled={animate} active={active} at={at} className="size-[var(--mahaam-d2)] end-[calc(var(--mahaam-cx)-var(--mahaam-d2)/2)] top-[calc(var(--mahaam-cy)-var(--mahaam-d2)/2)]" still="opacity-60" />
          <Ring index={2} enabled={animate} active={active} at={at} className="size-[var(--mahaam-d3)] end-[calc(var(--mahaam-cx)-var(--mahaam-d3)/2)] top-[calc(var(--mahaam-cy)-var(--mahaam-d3)/2)]" still="opacity-30" />

          <div className="relative flex flex-col gap-5 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:gap-7">
            <div
              aria-hidden="true"
              className="flex size-[72px] shrink-0 items-center justify-center gap-0.5 rounded-2xl bg-card shadow-[0_14px_30px_-18px_color-mix(in_srgb,var(--foreground)_30%,transparent)]"
            >
              {BAR_HEIGHTS.map((h, index) => (
                <Bar key={index} height={h} index={index} enabled={animate} active={active} at={at === undefined ? undefined : (at % 900) + index * 0} />
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <h2 className="text-2xl font-normal text-foreground [@container(min-width:48rem)]:text-3xl [@container(min-width:90rem)]:text-4xl">{heading ?? copy.heading}</h2>
              <p className="text-base text-muted-foreground [@container(min-width:48rem)]:text-lg">{body ?? copy.body}</p>
            </div>
          </div>
          <div className="relative flex flex-col gap-2.5 [@container(min-width:48rem)]:flex-row">
            <a href={primaryHref} className={buttonVariants({ size: "lg", className: "w-full [@container(min-width:48rem)]:w-auto" })}>
              {primary ?? copy.primary}
            </a>
            <a href={secondaryHref} className={buttonVariants({ variant: "outline", tone: "primary", size: "lg", className: "w-full [@container(min-width:48rem)]:w-auto" })}>
              {secondary ?? copy.secondary}
            </a>
          </div>
          {reduced ? null : <MahaamPauseButton paused={paused} locale={locale} labels={pauseLabels} onClick={toggle} className="absolute end-4 top-4 z-10" />}
        </div>
      </div>
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamBannerCopy = COPY

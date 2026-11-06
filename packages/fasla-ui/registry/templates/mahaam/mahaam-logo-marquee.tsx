"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { MahaamPauseButton, usePausedState, type MahaamPauseButtonLabels } from "./mahaam-pause-button"
import { useInView, usePageVisible, usePrefersReducedMotion } from "./mahaam-motion"

/*
 * Figma: `Mahaam Template` (47694:6712), the Logo marquee section of each of
 * its six variants, and its motion card.
 *
 * A caption over a strip of ten invented logos that scrolls in a loop. The
 * ten are drawn twice, and the track moves one copy to the start side at a
 * constant speed over 42s, then begins again with no seam. The strip fades out
 * over its outer 12% on each side. On Desktop it runs the page's full width;
 * on Tablet and Mobile it is held to the content width while its fade is
 * drawn across the page width, as Figma does.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): the strip scrolls on its own and
 * loops. It waits under the pointer, while it is off screen and while the page
 * is hidden, and the pause button stops it. Under `prefers-reduced-motion:
 * reduce` it stays on Figma's still frame and the button is not drawn.
 *
 * In Arabic the strip travels the other way. The logos and their wordmarks are
 * not mirrored.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"

export interface MahaamLogo {
  /** The company's name, as its wordmark. */
  name: string
  /** The mark before the name; some wordmarks have none. */
  mark?: React.ReactNode
  /** The wordmark's type, as Figma sets it: a size and weight. */
  nameClassName?: string
}

export interface MahaamLogoMarqueeCopy {
  /** The line above the strip. */
  caption: string
  /** The logos, in reading order. */
  logos: MahaamLogo[]
}

/** One 22px box with Figma's vectors in it, at Figma's offsets. */
function Mark({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0">
      {children}
    </svg>
  )
}

const stroke = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const

const LOGOS: MahaamLogo[] = [
  {
    name: "Northwind",
    nameClassName: "text-xl font-semibold",
    mark: (
      <Mark>
        <path d="M2 20 10 4l8 16" strokeWidth="2.4" {...stroke} />
      </Mark>
    ),
  },
  {
    name: "Halcyon",
    nameClassName: "text-2xl font-normal",
    mark: (
      <Mark>
        <circle cx="11" cy="11" r="9" fill="currentColor" />
        <circle cx="15" cy="10" r="6" className="fill-background" />
      </Mark>
    ),
  },
  {
    name: "QAMAR",
    nameClassName: "text-lg font-semibold",
    mark: (
      <Mark>
        <rect x="2" y="2" width="18" height="18" rx="3" fill="currentColor" />
      </Mark>
    ),
  },
  { name: "basalt", nameClassName: "text-2xl font-semibold" },
  {
    name: "Meridian",
    nameClassName: "text-xl font-medium",
    mark: (
      <Mark>
        <circle cx="11" cy="11" r="8" strokeWidth="2" {...stroke} />
        <path d="M10 3v16" strokeWidth="2" {...stroke} />
      </Mark>
    ),
  },
  {
    name: "Sahm",
    nameClassName: "text-xl font-semibold",
    mark: (
      <Mark>
        <path d="M12 5l6 6-6 6M2 11h15" strokeWidth="2.4" {...stroke} />
      </Mark>
    ),
  },
  {
    name: "Oasis Labs",
    nameClassName: "text-xl font-medium",
    mark: (
      <Mark>
        <path d="M11 3c4 5 6 8 6 11 0 3.31-2.69 6-6 6s-6-2.69-6-6c0-3 2-6 6-11Z" fill="currentColor" />
      </Mark>
    ),
  },
  {
    name: "kestrel",
    nameClassName: "text-xl font-medium",
    mark: (
      <Mark>
        <path d="M2 15 11 6l9 9-9-3-9 3Z" fill="currentColor" />
      </Mark>
    ),
  },
  { name: "Lumen&Co", nameClassName: "text-2xl font-normal" },
  {
    name: "ATLAS",
    nameClassName: "text-lg font-semibold",
    mark: (
      <Mark>
        <path d="M6 18V9l5-4 5 4v9M3 18h16" strokeWidth="2" {...stroke} />
      </Mark>
    ),
  },
]

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, MahaamLogoMarqueeCopy> = {
  en: { caption: "Loved by teams who talk more than they type", logos: LOGOS },
  ar: { caption: "تحبه الفرق التي تتكلم أكثر مما تكتب", logos: LOGOS },
}

export interface MahaamLogoMarqueeProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamLogoMarqueeCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** Whether the strip is paused. Set it to control the pause button; leave it out and the button keeps its own state. */
  paused?: boolean
  /** Whether an uncontrolled strip starts paused. */
  defaultPaused?: boolean
  /** Holds the section on Figma's still frame without changing the pause button, which still shows Pause. For stills of the finished state. */
  still?: boolean
  /** Called when the visitor presses the pause button. */
  onPausedChange?: (paused: boolean) => void
  /** The pause button's names, in place of `locale`'s. */
  pauseLabels?: Partial<MahaamPauseButtonLabels>
  /** Where in the 42s loop the strip starts, 0 to 1. Figma's still frame is a few pixels in. */
  progress?: number
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

/** The loop's length, and how far Figma's still frame has got into it. */
const LOOP_MS = 42000
const STILL_OFFSET = 12

export function MahaamLogoMarquee({
  locale = "en",
  caption,
  logos,
  paused: pausedProp,
  defaultPaused,
  still,
  onPausedChange,
  pauseLabels,
  progress,
  reducedMotion,
  className,
  ...props
}: MahaamLogoMarqueeProps) {
  const copy = COPY[locale]
  const items = logos ?? copy.logos
  const rootRef = React.useRef<HTMLElement>(null)
  const bandRef = React.useRef<HTMLDivElement>(null)
  const groupRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const copyRef = React.useRef<HTMLUListElement>(null)
  const secondRef = React.useRef<HTMLUListElement>(null)
  const animationRef = React.useRef<Animation | null>(null)
  const reduced = usePrefersReducedMotion(reducedMotion)
  const inView = useInView(rootRef)
  const visible = usePageVisible()
  const { paused, toggle } = usePausedState({ paused: pausedProp, defaultPaused, onPausedChange })
  const frozen = paused || Boolean(still)
  const [hovered, setHovered] = React.useState(false)
  const active = !frozen && !reduced && inView && visible && !hovered
  const activeRef = React.useRef(active)
  activeRef.current = active

  // The still frame: the track's left edge sits 12px in; in Arabic the page-wide fade moves with the strip, and so does the track.
  const rest = React.useCallback(() => {
    const band = bandRef.current
    const group = groupRef.current
    if (!band || !group) return 0
    const rtl = getComputedStyle(group).direction === "rtl"
    return rtl ? -STILL_OFFSET - (group.offsetWidth - band.offsetWidth) : -STILL_OFFSET
  }, [])

  React.useEffect(() => {
    const track = trackRef.current
    const first = copyRef.current
    const second = secondRef.current
    if (!track || !first || !second) return
    const place = () => {
      animationRef.current?.cancel()
      animationRef.current = null
      const left = rest()
      track.style.transform = `translateX(${left}px)`
      if (reduced || typeof track.animate !== "function") return
      // One copy and the gap after it: where the second copy begins.
      const shift = Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().left)
      if (!shift) return
      const rtl = getComputedStyle(track).direction === "rtl"
      // The strip travels to the end of the line: left in English, right in Arabic.
      const from = rtl ? -shift : 0
      const to = rtl ? 0 : -shift
      const animation = track.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }], {
        duration: LOOP_MS,
        iterations: Infinity,
        easing: "linear",
      })
      animation.currentTime = (progress ?? ((left - from) / (to - from)) % 1) * LOOP_MS
      if (!activeRef.current) animation.pause()
      animationRef.current = animation
    }
    place()
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null
    observer?.observe(first)
    if (bandRef.current) observer?.observe(bandRef.current)
    return () => {
      observer?.disconnect()
      animationRef.current?.cancel()
      animationRef.current = null
    }
    // `progress` is where it starts; a later change of it is not a reason to restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, rest, items])

  React.useEffect(() => {
    const animation = animationRef.current
    if (!animation) return
    if (active) animation.play()
    else animation.pause()
  }, [active])

  const run = (ref: React.Ref<HTMLUListElement>, hidden: boolean) => (
    <ul ref={ref} aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-16">
      {items.map((logo) => (
        // Logos and wordmarks are not mirrored in Arabic.
        <li key={logo.name} dir="ltr" className="flex shrink-0 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none">
          {logo.mark}
          <span className={cn("whitespace-nowrap", logo.nameClassName)}>{logo.name}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <section ref={rootRef} className={cn("[container-type:inline-size]", className)} {...props}>
      <div className="flex flex-col items-center gap-4 px-8 pt-14 [@container(min-width:48rem)]:px-16 [@container(min-width:90rem)]:px-0">
        <p className="w-full text-center text-sm text-muted-foreground">{caption ?? copy.caption}</p>
        <div ref={bandRef} className="relative h-16 w-full" onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
          <div className="absolute inset-0 overflow-hidden">
            {/* The fade is drawn across the page width, from the strip's start, as Figma draws it; the strip itself is held to the content width. */}
            <div
              ref={groupRef}
              className="absolute top-0 h-16 w-[100cqw] start-0 [mask-image:linear-gradient(90deg,transparent,var(--foreground)_12%,var(--foreground)_88%,transparent)]"
            >
              <div ref={trackRef} className="absolute left-0 top-0 flex h-16 w-max items-center gap-16 will-change-transform">
                {run(copyRef, false)}
                {run(secondRef, true)}
              </div>
            </div>
          </div>
          {reduced ? null : (
            <MahaamPauseButton
              paused={paused}
              locale={locale}
              labels={pauseLabels}
              onClick={toggle}
              className="absolute end-0 top-4 z-10 [@container(min-width:90rem)]:end-28"
            />
          )}
        </div>
      </div>
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamLogoMarqueeCopy = COPY

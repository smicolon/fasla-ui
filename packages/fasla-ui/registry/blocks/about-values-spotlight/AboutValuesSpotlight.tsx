"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Values Spotlight.
 *
 * A framed photo beside the team's values. The photo sits 16px inside a
 * frame marked by four plus ticks, one on each corner, in the primary
 * colour. Beside it, an "Our Values" heading over three values, each a
 * small label (a plus and an uppercase word) over a one-sentence statement.
 * One value is active: its label turns primary and its statement
 * foreground; the others stay muted.
 *
 * Desktop puts the frame (480 by 460) at the start and the list beside it,
 * centred against each other. Tablet and Mobile stack the frame over the
 * list at full width, 300px tall on Tablet and 200 on Mobile, and the
 * statements step down from 24px to 20 and 18.
 *
 * Motion: a value becomes active as it crosses the middle of the window,
 * at every size, and when it is clicked or focused. The statement's colour
 * eases over 300ms and the four corner ticks pulse once per change. Figma's
 * note pins the section while it scrolls; this block does not pin, by the
 * house rule against scroll-jacking. There is one photo, as in Figma, so
 * nothing crossfades. Under reduced motion the scroll link is off and a
 * click or focus swaps the colours at once.
 *
 * In Arabic the frame moves to the right and the list to the left, as
 * Figma's RTL variants draw it. The photo is never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutValuesSpotlightValue {
  /** The short uppercase label, such as "CRAFT". */
  label: React.ReactNode
  /** The one-sentence statement under it. */
  statement: React.ReactNode
}

export interface AboutValuesSpotlightPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutValuesSpotlightCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The values, in order. Figma has three. */
  values: AboutValuesSpotlightValue[]
  /** Shown in place of the list when `values` is an empty list. */
  empty: React.ReactNode
  /** Shown in place of the frame when `photos` is an empty list. */
  emptyPhoto: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutValuesSpotlightCopy> = {
  en: {
    heading: "Our Values",
    values: [
      { label: "OWNERSHIP", statement: "We take initiative, make the call, and stay accountable along the way." },
      { label: "CRAFT", statement: "We sweat the details until powerful feels simple — and simple feels obvious." },
      { label: "CANDOR", statement: "We say what we think, so what you hear from us is what we believe." },
    ],
    empty: "No values yet.",
    emptyPhoto: "No photo yet.",
  },
  ar: {
    heading: "قيمنا",
    values: [
      { label: "المسؤولية", statement: "نأخذ المبادرة، ونتخذ القرار، ونبقى مسؤولين حتى النهاية." },
      { label: "الإتقان", statement: "نُتقن التفاصيل حتى يصبح القوي بسيطًا، والبسيط بديهيًا." },
      { label: "الصراحة", statement: "نقول ما نفكر فيه، فما تسمعه منّا هو ما نؤمن به." },
    ],
    empty: "لا توجد قيم بعد.",
    emptyPhoto: "لا توجد صورة بعد.",
  },
}

/** The four corner ticks: Figma's Corner Tick 1 to 4, 16px on each corner of the frame. */
const TICKS = ["top-0 start-0", "top-0 end-0", "bottom-0 start-0", "bottom-0 end-0"]

const FOCUS = "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Makes a value active as it crosses the middle of the window. A thin band
 * across the middle is the observer's root, so only the value under it
 * counts. Off under reduced motion, where the active value changes only on
 * click or focus.
 */
function useMidViewportActive(list: React.RefObject<HTMLElement | null>, count: number, onActive: (index: number) => void) {
  const callback = React.useRef(onActive)
  callback.current = onActive
  React.useEffect(() => {
    const node = list.current
    if (!node || typeof IntersectionObserver === "undefined" || reducedMotion()) return
    const items = Array.from(node.querySelectorAll<HTMLElement>("[data-value-index]"))
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) callback.current(Number((hit.target as HTMLElement).dataset.valueIndex))
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [list, count])
}

/** Pulses the four corner ticks once each time the active value changes, never on the first render. */
function useTickPulse(frame: React.RefObject<HTMLElement | null>, active: number) {
  const first = React.useRef(true)
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const node = frame.current
    if (!node || typeof node.animate !== "function" || reducedMotion()) return
    const animations = Array.from(node.querySelectorAll<HTMLElement>("[data-tick]")).map((tick) =>
      tick.animate([{ transform: "none" }, { transform: "scale(1.4)" }, { transform: "none" }], {
        duration: 400,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      })
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [frame, active])
}

export interface AboutValuesSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutValuesSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The value that is active before any scrolling or clicking. Figma's is
   * the second, CRAFT.
   * @default 1
   */
  defaultActive?: number
  /**
   * The one photo in the frame (Figma's Value Image). Photos past the first
   * are not shown. None by default: a `muted` placeholder. An empty list
   * shows the `emptyPhoto` line instead of the frame.
   * @default none: a `muted` placeholder
   */
  photos?: AboutValuesSpotlightPhoto[]
}

export function AboutValuesSpotlight({
  locale = "en",
  heading,
  values,
  empty,
  emptyPhoto,
  defaultActive = 1,
  photos,
  className,
  ...props
}: AboutValuesSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const items = values ?? copy.values
  const [active, setActive] = React.useState(defaultActive)
  const list = React.useRef<HTMLUListElement>(null)
  const frame = React.useRef<HTMLDivElement>(null)
  const photo = photos?.[0]

  useMidViewportActive(list, items.length, setActive)
  useTickPulse(frame, active)

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 [@container(min-width:40rem)]:gap-16 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center">
        {photos && photos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground [@container(min-width:64rem)]:w-[480px] [@container(min-width:64rem)]:shrink-0">
            {emptyPhoto ?? copy.emptyPhoto}
          </p>
        ) : (
          <div
            ref={frame}
            className="relative h-[200px] w-full shrink-0 [@container(min-width:40rem)]:h-[300px] [@container(min-width:64rem)]:h-[460px] [@container(min-width:64rem)]:w-[480px]"
          >
            <div className="absolute inset-4 overflow-hidden rounded-xl bg-muted">
              {photo ? (
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
              ) : null}
            </div>
            {TICKS.map((position) => (
              <span key={position} data-tick aria-hidden className={cn("absolute flex size-4 items-center justify-center text-primary", position)}>
                <Plus size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
              </span>
            ))}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <h2 id={headingId} className="text-3xl font-medium text-foreground">
            {heading ?? copy.heading}
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
          ) : (
            <ul ref={list} className="flex flex-col gap-8">
              {items.map((value, index) => {
                const on = index === active
                return (
                  <li key={index} data-value-index={index}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={cn("flex w-full flex-col items-start gap-2 rounded-sm text-start", FOCUS)}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium transition-colors duration-300 motion-reduce:transition-none",
                          on ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        <Plus size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                        {value.label}
                      </span>
                      <span
                        className={cn(
                          "text-lg font-medium transition-colors duration-300 motion-reduce:transition-none [@container(min-width:40rem)]:text-xl [@container(min-width:64rem)]:text-2xl",
                          on ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {value.statement}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutValuesSpotlightCopy = COPY

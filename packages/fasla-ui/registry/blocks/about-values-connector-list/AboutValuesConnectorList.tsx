"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `About` (46368:243915), Type=Values Connector List.
 *
 * An "Our Values" heading over a column of value names and, beside it, the
 * active value's description. A hand-drawn line (Figma's Connector Line, a
 * loop and a long stroke in the primary colour) runs from the end of the
 * active name to the description, joining the two. The active name is
 * primary; the others are muted.
 *
 * Desktop gives the names a 480px column and the description the rest, 64px
 * apart; Tablet narrows the names to 300 with a 32px gap, and the names
 * drop from 30px to 24. Mobile stacks the names over the description and
 * has no connector: the description carries a 2px bar on its start edge
 * instead. The line's start follows the active name's end and its finish
 * the description's start, so it stretches to the room between them; its
 * vertical position follows the active row.
 *
 * Motion: hovering, focusing or clicking a name makes it active. The
 * outgoing name fades to muted and the incoming one to primary (250ms), the
 * connector redraws from the name to the description (500ms), and the
 * description fades in, rising 8px. On Mobile the accent bar grows down the
 * description instead. The description keeps the height of the longest one,
 * so changing value never moves what is below it. Figma's note also cycles the values every 4s when
 * idle; this block does not, by the house rule against autoplay. Under
 * reduced motion every change is instant.
 *
 * In Arabic the names move to the right and the description to the left,
 * and the connector is mirrored, so it draws from right to left, as
 * Figma's RTL variants draw it. The Mobile bar sits on the right.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutValuesConnectorListValue {
  /** The value's name, shown in the column. */
  name: React.ReactNode
  /** What it means, shown beside the column while the value is active. */
  description: React.ReactNode
}

export interface AboutValuesConnectorListCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The values, in order. Figma has five. */
  values: AboutValuesConnectorListValue[]
  /** Shown in place of the list when `values` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. Figma writes only the first description; the rest are ours. */
const COPY: Record<"en" | "ar", AboutValuesConnectorListCopy> = {
  en: {
    heading: "Our Values",
    values: [
      {
        name: "Kindness",
        description: "Kindness is at the heart of how we conduct ourselves — with users, with partners, and with each other.",
      },
      { name: "Trust", description: "We earn trust slowly and keep it carefully, by doing what we said we would, every time." },
      { name: "Quality", description: "We would rather ship one thing that works well than three that almost do." },
      { name: "Simplicity", description: "We take complexity on ourselves, so the people using our work never have to." },
      {
        name: "Safety & Security",
        description: "We protect people's data as if it were our own, and we are open about how we do it.",
      },
    ],
    empty: "No values yet.",
  },
  ar: {
    heading: "قيمنا",
    values: [
      { name: "اللطف", description: "اللطف هو جوهر تعاملنا مع المستخدمين، ومع الشركاء، ومع بعضنا البعض." },
      { name: "الثقة", description: "نكسب الثقة ببطء ونحافظ عليها بعناية، بأن نفعل ما وعدنا به في كل مرة." },
      { name: "الجودة", description: "نفضّل أن نطلق شيئًا واحدًا يعمل جيدًا على ثلاثة أشياء تكاد تعمل." },
      { name: "البساطة", description: "نتحمّل التعقيد عن غيرنا، حتى لا يضطر من يستخدم عملنا إلى ذلك." },
      { name: "السلامة والأمان", description: "نحمي بيانات الناس كأنها بياناتنا، ونتحدث بصراحة عن طريقة حمايتها." },
    ],
    empty: "لا توجد قيم بعد.",
  },
}

/** Figma's Connector Line, drawn in a 310 by 26 box from the name end (0, 18) to the description (310, 0). */
const CONNECTOR = "M 0 18 C 70 -26 120 54 170 14 C 190 -2 194 30 176 24 C 214 10 260 6 310 0"

/** Room left between the line and the active name's end, and between the line and the description. */
const GAP_FROM_NAME = 24
const GAP_TO_DESCRIPTION = 12

const FOCUS = "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

interface ConnectorBox {
  start: number
  top: number
  width: number
  height: number
}

/** The description's type, and its place in the one grid cell all descriptions share. */
const DESCRIPTION =
  "[grid-area:1/1] text-lg text-foreground [@container(min-width:40rem)]:text-xl [@container(min-width:64rem)]:text-2xl"

/**
 * Measures where the connector goes: from the end of the active name's text
 * to the start of the description, on the active row's line. Distances are
 * from the row's start edge, so the same numbers place it in either
 * direction. Re-measures when anything resizes.
 */
function useConnectorBox(row: React.RefObject<HTMLElement | null>, active: number, count: number) {
  const [box, setBox] = React.useState<ConnectorBox | null>(null)
  React.useLayoutEffect(() => {
    const node = row.current
    if (!node) return
    const measure = () => {
      const name = node.querySelector<HTMLElement>(`[data-name-index="${active}"] [data-name-text]`)
      const description = node.querySelector<HTMLElement>("[data-description]")
      if (!name || !description) return setBox(null)
      const rtl = getComputedStyle(node).direction === "rtl"
      const rowRect = node.getBoundingClientRect()
      const nameRect = name.getBoundingClientRect()
      const descriptionRect = description.getBoundingClientRect()
      const nameEnd = rtl ? rowRect.right - nameRect.left : nameRect.right - rowRect.left
      const descriptionStart = rtl ? rowRect.right - descriptionRect.right : descriptionRect.left - rowRect.left
      const start = nameEnd + GAP_FROM_NAME
      const width = descriptionStart - GAP_TO_DESCRIPTION - start
      // Figma's line sits from 30% down the name's line and is 65% as tall.
      setBox(
        width < 32
          ? null
          : { start, width, top: nameRect.top - rowRect.top + nameRect.height * 0.3, height: nameRect.height * 0.65 }
      )
    }
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [row, active, count])
  return box
}

/**
 * Redraws the connector and brings in the description each time the active
 * value changes, never on the first render. The connector traces from the
 * name to the description; the Mobile accent bar grows down from the top.
 */
function useChangeMotion(row: React.RefObject<HTMLElement | null>, active: number) {
  const first = React.useRef(true)
  React.useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const node = row.current
    if (!node || typeof node.animate !== "function" || reducedMotion()) return
    const ease = "cubic-bezier(0.4, 0, 0.2, 1)"
    const animations: Animation[] = []
    const path = node.querySelector<SVGPathElement>("[data-connector-path]")
    if (path && path.getClientRects().length)
      animations.push(path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 500, easing: ease, fill: "backwards" }))
    const description = node.querySelector<HTMLElement>("[data-description-text]")
    if (description)
      animations.push(
        description.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
          duration: 250,
          easing: "cubic-bezier(0, 0, 0.2, 1)",
          fill: "backwards",
        })
      )
    const bar = node.querySelector<HTMLElement>("[data-accent-bar]")
    if (bar && bar.getClientRects().length)
      animations.push(bar.animate([{ transform: "scaleY(0)" }, { transform: "none" }], { duration: 300, easing: ease, fill: "backwards" }))
    return () => animations.forEach((animation) => animation.cancel())
  }, [row, active])
}

export interface AboutValuesConnectorListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutValuesConnectorListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The value that is active before any hover or click. Figma's is the first.
   * @default 0
   */
  defaultActive?: number
}

export function AboutValuesConnectorList({
  locale = "en",
  heading,
  values,
  empty,
  defaultActive = 0,
  className,
  ...props
}: AboutValuesConnectorListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const descriptionId = React.useId()
  const items = values ?? copy.values
  const [active, setActive] = React.useState(defaultActive)
  const current = items[Math.min(active, items.length - 1)]
  const row = React.useRef<HTMLDivElement>(null)
  const box = useConnectorBox(row, active, items.length)
  useChangeMotion(row, active)

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-secondary px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <h2 id={headingId} className="text-3xl font-medium text-foreground">
          {heading ?? copy.heading}
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div
            ref={row}
            className="relative flex flex-col gap-6 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-16"
          >
            <ul className="flex shrink-0 flex-col gap-3 [@container(min-width:40rem)]:w-[300px] [@container(min-width:64rem)]:w-[480px]">
              {items.map((value, index) => {
                const on = index === active
                return (
                  <li key={index} data-name-index={index}>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-controls={descriptionId}
                      onClick={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      className={cn(
                        "rounded-sm text-start text-2xl font-medium transition-colors duration-[250ms] motion-reduce:transition-none [@container(min-width:64rem)]:text-3xl",
                        on ? "text-primary" : "text-muted-foreground",
                        FOCUS
                      )}
                    >
                      <span data-name-text>{value.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div
              id={descriptionId}
              data-description
              className="relative grid min-w-0 flex-1 ps-4 pt-1 [@container(min-width:40rem)]:ps-0"
            >
              {/* Every description, unseen, in the same cell: it is always as tall as the longest, so changing value moves nothing. */}
              {items.map((value, index) => (
                <p key={index} aria-hidden className={cn(DESCRIPTION, "invisible")}>
                  {value.description}
                </p>
              ))}
              <p key={`active-${active}`} data-description-text className={cn(DESCRIPTION, "relative self-start")}>
                {/* The Mobile bar runs the visible description's height, on the cell's start edge. */}
                <span
                  data-accent-bar
                  aria-hidden
                  className="absolute -top-1 bottom-0 -start-4 w-0.5 origin-top bg-foreground [@container(min-width:40rem)]:hidden"
                />
                {current?.description}
              </p>
            </div>

            {box ? (
              <svg
                aria-hidden
                viewBox="0 -4 310 34"
                preserveAspectRatio="none"
                fill="none"
                className="pointer-events-none absolute hidden overflow-visible text-primary [@container(min-width:40rem)]:block [&:dir(rtl)]:-scale-x-100"
                style={{ insetInlineStart: box.start, top: box.top, width: box.width, height: box.height }}
              >
                <path
                  data-connector-path
                  d={CONNECTOR}
                  pathLength={1}
                  strokeDasharray={1}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ) : null}
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
export const aboutValuesConnectorListCopy = COPY

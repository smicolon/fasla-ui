"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `About` (46368:243915), Type=Values Focus.
 *
 * A framed photo beside three values. Over the photo, an "OUR VALUES" badge
 * (Outline, Secondary, md, standard radius) is the section's heading. The
 * photo sits 48px inside a 1px border frame, and a plus mark is centred on
 * each of the frame's four corners. Each value is a pill badge over a 30px
 * statement. One value is in focus: its badge is Solid Primary and its
 * statement foreground; the others are Outline Secondary over muted text.
 *
 * Desktop puts the framed photo (a 480px square) at the start and the list
 * beside it, centred against each other, 64px apart. Tablet and Mobile
 * stack the photo over the list at full width, the frame 420px tall on
 * Tablet and 300 on Mobile, and the statements step down to 24px and 20.
 *
 * Motion: as the list scrolls past a line across the window, the value on
 * that line comes into focus, its statement easing from muted to full
 * contrast (250ms) while the previous one fades back. The line is the
 * middle of the window on Desktop and 40% down on Tablet and Mobile.
 * Hovering or focusing a value previews it; clicking it keeps it. The four
 * corner marks grow in from their corners once, when the frame scrolls into
 * view (300ms). Under reduced motion there is no scroll link and no draw:
 * the middle value stays in focus until a value is hovered or clicked.
 *
 * In Arabic the photo moves to the right and the list to the left, as
 * Figma's RTL variants draw it. The photo is never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutValuesFocusValue {
  /** The value's name, shown in the pill badge. */
  label: React.ReactNode
  /** The statement under it. */
  statement: React.ReactNode
}

export interface AboutValuesFocusPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutValuesFocusCopy {
  /** The badge over the photo, the section's heading (an `h2`). */
  heading: React.ReactNode
  /** The values, in order. Figma has three. */
  values: AboutValuesFocusValue[]
  /** Shown in place of the list when `values` is an empty list. */
  empty: React.ReactNode
  /** Shown in place of the frame when `photos` is an empty list. */
  emptyPhoto: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutValuesFocusCopy> = {
  en: {
    heading: "OUR VALUES",
    values: [
      { label: "Patience", statement: "We would rather get it right than get it first, so we give every problem the time it needs." },
      { label: "Clarity", statement: "We write plainly, explain our choices and never hide behind jargon." },
      { label: "Care", statement: "We design every screen as if the person using it has already had a long day." },
    ],
    empty: "No values yet.",
    emptyPhoto: "No photo yet.",
  },
  ar: {
    heading: "قيمنا",
    values: [
      { label: "الصبر", statement: "نفضّل أن نتقن العمل على أن نسبق إليه، لذلك نمنح كل مشكلة الوقت الذي تحتاجه." },
      { label: "الوضوح", statement: "نكتب بلغة واضحة، ونشرح قراراتنا، ولا نختبئ خلف المصطلحات." },
      { label: "العناية", statement: "نصمم كل شاشة وكأن من يستخدمها قد أنهى للتو يومًا طويلًا." },
    ],
    empty: "لا توجد قيم بعد.",
    emptyPhoto: "لا توجد صورة بعد.",
  },
}

/**
 * The four corner marks, 24px, centred on the frame's outer corners. The
 * frame's 1px border puts the outer corner 1px past the padding box, hence
 * 13 rather than 12. `corner` names the corner each grows from.
 */
const MARKS = [
  { position: "-top-[13px] -start-[13px]", corner: "start-top" },
  { position: "-top-[13px] -end-[13px]", corner: "end-top" },
  { position: "-bottom-[13px] -start-[13px]", corner: "start-bottom" },
  { position: "-bottom-[13px] -end-[13px]", corner: "end-bottom" },
]

const FOCUS = "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Brings the value on the trigger line into focus: the middle of the
 * window when the block is Desktop-wide, 40% down otherwise. Off under
 * reduced motion.
 */
function useScrollFocus(list: React.RefObject<HTMLElement | null>, count: number, onFocusValue: (index: number) => void) {
  const callback = React.useRef(onFocusValue)
  callback.current = onFocusValue
  React.useEffect(() => {
    const node = list.current
    if (!node || typeof IntersectionObserver === "undefined" || reducedMotion()) return
    // Desktop is the block's own width from 1024px, as the container queries have it.
    const wide = (node.parentElement?.getBoundingClientRect().width ?? 0) >= 1024
    const items = Array.from(node.querySelectorAll<HTMLElement>("[data-value-index]"))
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) callback.current(Number((hit.target as HTMLElement).dataset.valueIndex))
      },
      { rootMargin: wide ? "-50% 0px -50% 0px" : "-40% 0px -60% 0px" }
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [list, count])
}

/** Grows the four corner marks in from their corners once, when the frame scrolls into view. */
function useCornerDraw(frame: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = frame.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (reducedMotion()) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const rtl = getComputedStyle(node).direction === "rtl"
        node.querySelectorAll<HTMLElement>("[data-corner]").forEach((mark) => {
          const [inline, block] = (mark.dataset.corner ?? "").split("-")
          const x = (inline === "start") !== rtl ? -8 : 8
          const y = block === "top" ? -8 : 8
          animations.push(
            mark.animate(
              [
                { opacity: 0, transform: `translate(${x}px, ${y}px) scale(0.4)` },
                { opacity: 1, transform: "none" },
              ],
              { duration: 300, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
            )
          )
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [frame])
}

export interface AboutValuesFocusProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutValuesFocusCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The value in focus before any scrolling or hovering. Figma's is the
   * middle one, Clarity.
   * @default 1
   */
  defaultActive?: number
  /**
   * The one photo in the frame (Figma's "Photo — ceramic series"). Photos
   * past the first are not shown. None by default: a `muted` placeholder.
   * An empty list shows the `emptyPhoto` line instead of the frame.
   * @default none: a `muted` placeholder
   */
  photos?: AboutValuesFocusPhoto[]
}

export function AboutValuesFocus({
  locale = "en",
  heading,
  values,
  empty,
  emptyPhoto,
  defaultActive = 1,
  photos,
  className,
  ...props
}: AboutValuesFocusProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const items = values ?? copy.values
  const [active, setActive] = React.useState(defaultActive)
  const [preview, setPreview] = React.useState<number | null>(null)
  const shown = preview ?? active
  const list = React.useRef<HTMLUListElement>(null)
  const frame = React.useRef<HTMLDivElement>(null)
  const photo = photos?.[0]

  useScrollFocus(list, items.length, setActive)
  useCornerDraw(frame)

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 [@container(min-width:40rem)]:gap-16 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center">
        <div className="flex shrink-0 flex-col items-start gap-8 [@container(min-width:64rem)]:w-[480px]">
          <h2 id={headingId} className="flex">
            <Badge variant="outline" tone="secondary" size="md" radius="standard">
              {heading ?? copy.heading}
            </Badge>
          </h2>
          {photos && photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyPhoto ?? copy.emptyPhoto}</p>
          ) : (
            <div
              ref={frame}
              className="relative flex h-[300px] w-full border border-border p-12 [@container(min-width:40rem)]:h-[420px] [@container(min-width:64rem)]:h-[480px]"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
                {photo ? (
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                ) : null}
              </div>
              {MARKS.map((mark) => (
                <span
                  key={mark.corner}
                  data-corner={mark.corner}
                  aria-hidden
                  className={cn("absolute flex size-6 items-center justify-center text-foreground", mark.position)}
                >
                  <Plus size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                </span>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul ref={list} className="flex min-w-0 flex-1 flex-col gap-12" onMouseLeave={() => setPreview(null)}>
            {items.map((value, index) => {
              const on = index === shown
              return (
                <li key={index} data-value-index={index}>
                  <button
                    type="button"
                    aria-pressed={index === active}
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setPreview(index)}
                    onFocus={() => setPreview(index)}
                    onBlur={() => setPreview(null)}
                    className={cn("flex w-full flex-col items-start gap-4 rounded-sm text-start", FOCUS)}
                  >
                    <Badge
                      variant={on ? "solid" : "outline"}
                      tone={on ? "primary" : "secondary"}
                      size="md"
                      radius="rounded"
                      className="transition-colors duration-[250ms] motion-reduce:transition-none"
                    >
                      {value.label}
                    </Badge>
                    <span
                      className={cn(
                        "text-xl transition-colors duration-[250ms] motion-reduce:transition-none [@container(min-width:40rem)]:text-2xl [@container(min-width:64rem)]:text-3xl",
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
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutValuesFocusCopy = COPY

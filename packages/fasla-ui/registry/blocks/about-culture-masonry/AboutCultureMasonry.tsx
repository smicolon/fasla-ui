"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `About` (46368:243915), Type=Culture Masonry.
 *
 * A band on `primary`. An intro column (eyebrow, heading, paragraph and a
 * Secondary button) takes a fixed 460px at the start and is centred against
 * a two-column masonry of culture tiles that fills the rest. Each column
 * holds a captioned card (a photo on `card`, inset 12px, with a title and a
 * caption under it, `md` shadow) and a short photo-only tile (150px). The
 * end column starts 40px lower and runs short-then-tall, so the tiles make
 * an offset brick.
 *
 * Tablet stacks the intro over the masonry, 64px apart, and the heading
 * drops from 36px to 30. Mobile is a single column in slot order, 48px
 * below the intro, with the button full width, the card photos 180px and
 * the photo tiles 130px, and the heading at 24px.
 *
 * In Arabic the intro moves to the right and the masonry to the left, the
 * lowered column still on the end side, all through flex order. The
 * photographs are never flipped.
 *
 * Motion: the intro and the tiles fade up once, in reading order, when the
 * block scrolls into view. Figma's card asks for column parallax and a
 * sticky intro; both follow the scroll, so this block replaces them with the
 * one-time reveal. On hover or keyboard focus a tile's photo zooms to 1.05
 * inside its frame and the title underlines; under reduced motion the photo
 * stays still and nothing fades.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface AboutCultureMasonryAction {
  label: React.ReactNode
  href: string
}

export interface AboutCultureMasonryPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutCultureMasonryItem {
  /** The card's title under the photo. Without a title (or caption) the tile is a photo alone. */
  title?: React.ReactNode
  /** The line under the title. */
  caption?: React.ReactNode
  /** The tile's photo. A `muted` placeholder when missing. */
  image?: AboutCultureMasonryPhoto
  /** Makes the tile a link to this address. */
  href?: string
}

export interface AboutCultureMasonryCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. */
  description: React.ReactNode
  /** The button under the paragraph. Hidden when null. */
  action: AboutCultureMasonryAction | null
  /**
   * The tiles, in Figma's slot order: the start column top to bottom, then
   * the end column. The first half of the list fills the start column, the
   * rest the end column; on a phone they run in this order in one column.
   */
  items: AboutCultureMasonryItem[]
  /** Shown in place of the tiles when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutCultureMasonryCopy> = {
  en: {
    eyebrow: "LIFE WITH US",
    heading: "Built by people obsessed with the details.",
    description:
      "Remote-first, deeply async, and serious about the small stuff — from kerning to coffee. We get together twice a year to argue about both.",
    action: { label: "See open roles", href: "#careers" },
    items: [
      { title: "The adventures", caption: "Our best memories are made beyond the office." },
      {},
      {},
      { title: "Late-night launches", caption: "Ship nights end with playlists, not postmortems." },
    ],
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "الحياة معنا",
    heading: "بناه أشخاص مهووسون بالتفاصيل.",
    description:
      "نعمل عن بُعد أولًا، وبتزامن مرن، ونهتم بالتفاصيل الصغيرة، من تنسيق الحروف إلى القهوة. نجتمع مرتين سنويًا لنتجادل حول كليهما.",
    action: { label: "الوظائف المتاحة", href: "#careers" },
    items: [
      { title: "المغامرات", caption: "أفضل ذكرياتنا تُصنع خارج المكتب." },
      {},
      {},
      { title: "إطلاقات آخر الليل", caption: "ليالي الإطلاق تنتهي بقوائم الأغاني، لا بتحليل الأخطاء." },
    ],
    empty: "لا توجد صور بعد.",
  },
}

/** The photo's zoom inside its frame, on hover or keyboard focus; none under reduced motion. */
const ZOOM =
  "absolute inset-0 size-full object-cover transition-transform duration-[400ms] ease-out motion-reduce:transition-none motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"

const FOCUS =
  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Fades the `[data-reveal]` parts up 16px, 80ms apart in reading order, once, when the block scrolls into view. */
function useReveal(scope: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = scope.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (reducedMotion()) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]")).forEach((part, index) =>
          animations.push(
            part.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
              duration: 500,
              delay: index * 80,
              easing: "cubic-bezier(0, 0, 0.2, 1)",
              fill: "backwards",
            })
          )
        )
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [scope])
}

function CultureTile({ item }: { item: AboutCultureMasonryItem }) {
  const captioned = item.title != null || item.caption != null
  const photo = (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        captioned
          ? "h-[180px] rounded-md [@container(min-width:40rem)]:h-[240px]"
          : "h-[130px] rounded-xl [@container(min-width:40rem)]:h-[150px]"
      )}
    >
      {item.image ? (
        <img src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" className={ZOOM} />
      ) : null}
    </div>
  )
  const body = captioned ? (
    <>
      {photo}
      <div className="flex flex-col gap-1 px-2 pb-2">
        {item.title != null ? (
          <h3 className="text-lg font-semibold text-foreground decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
            {item.title}
          </h3>
        ) : null}
        {item.caption != null ? <p className="text-xs text-muted-foreground">{item.caption}</p> : null}
      </div>
    </>
  ) : (
    photo
  )
  const frame = cn(
    "group block",
    captioned ? "flex flex-col gap-3 rounded-xl bg-card p-3 shadow-md" : "rounded-xl",
    item.href && FOCUS
  )
  return item.href ? (
    <a href={item.href} className={frame}>
      {body}
    </a>
  ) : (
    <div className={frame}>{body}</div>
  )
}

export interface AboutCultureMasonryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutCultureMasonryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function AboutCultureMasonry({
  locale = "en",
  eyebrow,
  heading,
  description,
  action,
  items,
  empty,
  className,
  ...props
}: AboutCultureMasonryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const label = eyebrow ?? copy.eyebrow
  const button = action === undefined ? copy.action : action
  const tiles = items ?? copy.items
  const half = Math.ceil(tiles.length / 2)
  const columns = [tiles.slice(0, half), tiles.slice(half)]

  useReveal(root)

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-primary px-4 py-8 text-primary-foreground md:px-6 md:py-16 lg:p-24",
        className
      )}
      {...props}
    >
      <div
        ref={root}
        className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 [@container(min-width:40rem)]:gap-16 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center"
      >
        <div className="flex flex-col gap-6 [@container(min-width:64rem)]:w-[460px] [@container(min-width:64rem)]:shrink-0">
          {label ? (
            <p data-reveal="" className="text-sm font-medium">
              {label}
            </p>
          ) : null}
          <h2
            id={headingId}
            data-reveal=""
            className="text-2xl font-semibold [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
          >
            {heading ?? copy.heading}
          </h2>
          <p data-reveal="" className="text-base">
            {description ?? copy.description}
          </p>
          {button ? (
            <div data-reveal="" className="flex">
              <a
                href={button.href}
                className={buttonVariants({
                  variant: "secondary",
                  className: "w-full [@container(min-width:40rem)]:w-auto",
                })}
              >
                {button.label}
              </a>
            </div>
          ) : null}
        </div>

        {tiles.length === 0 ? (
          <p className="flex-1 text-center text-sm">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-6 [@container(min-width:40rem)]:grid [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:items-start">
            {columns.map((column, columnIndex) =>
              column.length === 0 ? null : (
                <ul
                  key={columnIndex}
                  className={cn(
                    "flex flex-col gap-6",
                    columnIndex === 1 && "[@container(min-width:40rem)]:pt-10"
                  )}
                >
                  {column.map((item, index) => (
                    <li key={index} data-reveal="">
                      <CultureTile item={item} />
                    </li>
                  ))}
                </ul>
              )
            )}
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
export const aboutCultureMasonryCopy = COPY

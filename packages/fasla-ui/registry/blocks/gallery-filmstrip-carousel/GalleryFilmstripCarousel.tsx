"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Filmstrip Carousel.
 *
 * A header with a pair of arrows, one big stage, and a strip of thumbnails
 * under it. The stage shows the active photo, with a caption card at its
 * bottom start and a "3 / 8" counter at its bottom end; the strip holds every
 * photo, the active one ringed in `primary` and the rest dimmed to 70%.
 * Figma's stage repeats the third thumbnail, so the third photo is active by
 * default. No photos come with the block: pass each item's `image`, and until
 * then the stage and the thumbnails are `muted` placeholders of the same size.
 *
 * The stage is not a scroller: Figma draws one frame, and the photo changes
 * in place, a short crossfade that reduced motion turns off. The arrows, the
 * thumbnails, and the arrow keys (Home and End too) from anywhere in the
 * stage or the strip change it; a thumbnail moved to by key also takes the
 * focus. The arrows wrap from the last photo to the first. Nothing plays on
 * its own.
 *
 * On Desktop the arrows sit at the end of the header, on the heading's
 * baseline row; on Tablet and Mobile they drop under the description. Tablet
 * and Desktop fit all eight thumbnails in one row. Mobile shows four at a
 * time, Figma's Mobile slots, and the strip scrolls sideways to the rest, so
 * every photo can still be picked; it scrolls the active thumbnail into view
 * when the photo changes.
 *
 * In Arabic the layout mirrors through logical sides alone: the arrows sit at
 * the header's start and point the other way, the caption card moves to the
 * stage's right, and the strip runs right to left. The photographs are never
 * flipped, and the counter's numerals stay left to right.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryFilmstripCarouselPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryFilmstripCarouselItem {
  /** The caption card's first line, in parts. A middle dot goes between each part. */
  title: React.ReactNode[]
  /** The caption card's second line, in parts, under the title. */
  meta: React.ReactNode[]
  /** The photo, on the stage when active and in the strip. A `muted` placeholder when missing. */
  image?: GalleryFilmstripCarouselPhoto
}

export interface GalleryFilmstripCarouselCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The photos with their captions, in strip order. Each has a `title`, a `meta` line and an optional `image`. */
  items: GalleryFilmstripCarouselItem[]
  /** The previous arrow's accessible name. */
  previousLabel: string
  /** The next arrow's accessible name. */
  nextLabel: string
  /** Shown in place of the stage and the strip when `items` is empty. */
  empty: React.ReactNode
}

/*
 * Figma captions only the third photo ("Look 03 · Sunset silk"). The other
 * seven captions follow its pattern so every photo has one.
 */
const look = (n: string, name: string, studio: string): GalleryFilmstripCarouselItem => ({
  title: [`Look ${n}`, name],
  meta: ["Autumn / Winter 2026", `Studio ${studio}`],
})
const lookAr = (n: string, name: string, studio: string): GalleryFilmstripCarouselItem => ({
  title: [
    <>
      الإطلالة <bdi dir="ltr">{n}</bdi>
    </>,
    name,
  ],
  meta: [
    <>
      خريف / شتاء <bdi dir="ltr">2026</bdi>
    </>,
    <>
      استوديو <bdi>{studio}</bdi>
    </>,
  ],
})

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryFilmstripCarouselCopy> = {
  en: {
    eyebrow: "GALLERY",
    heading: "The 2026 collection",
    description: "Browse the full set, or jump straight to a frame from the strip below.",
    items: [
      look("01", "Desert linen", "A"),
      look("02", "Ivory wool", "A"),
      look("03", "Sunset silk", "B"),
      look("04", "Slate cable knit", "B"),
      look("05", "Open shelf", "C"),
      look("06", "Harvest stack", "C"),
      look("07", "Sage weave", "A"),
      look("08", "Winter fold", "B"),
    ],
    previousLabel: "Previous photo",
    nextLabel: "Next photo",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "معرض الصور",
    heading: (
      <>
        مجموعة <bdi dir="ltr">2026</bdi>
      </>
    ),
    description: "تصفح المجموعة كاملة، أو انتقل مباشرةً إلى أي صورة من الشريط أدناه.",
    items: [
      lookAr("01", "كتان الصحراء", "A"),
      lookAr("02", "صوف عاجي", "A"),
      lookAr("03", "حرير الغروب", "B"),
      lookAr("04", "صوف رمادي مجدول", "B"),
      lookAr("05", "الرف المفتوح", "C"),
      lookAr("06", "كومة الحصاد", "C"),
      lookAr("07", "نسيج المريمية", "A"),
      lookAr("08", "طيّة الشتاء", "B"),
    ],
    previousLabel: "الصورة السابقة",
    nextLabel: "الصورة التالية",
    empty: "لا توجد صور بعد.",
  },
}

/** A line made of parts, each isolated, with a middle dot between them that never flips. */
function Parts({ parts }: { parts: React.ReactNode[] }) {
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          <bdi>{part}</bdi>
        </React.Fragment>
      ))}
    </>
  )
}

/** Brings a thumbnail into the strip's view, moving the strip only, never the page. */
function reveal(strip: HTMLElement | null, thumb: HTMLElement | null | undefined) {
  if (!strip || !thumb) return
  const view = strip.getBoundingClientRect()
  const box = thumb.getBoundingClientRect()
  if (box.left < view.left) strip.scrollBy({ left: box.left - view.left })
  else if (box.right > view.right) strip.scrollBy({ left: box.right - view.right })
}

const FOCUS_RING =
  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const ICON = "size-4 [&:dir(rtl)]:-scale-x-100"

export interface GalleryFilmstripCarouselProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryFilmstripCarouselCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo active at first, by index. Figma's stage shows the third.
   * @default 2
   */
  defaultActiveIndex?: number
  /** Called with the new index whenever the active photo changes. */
  onActiveIndexChange?: (index: number) => void
}

export function GalleryFilmstripCarousel({
  locale = "en",
  eyebrow,
  heading,
  description,
  items,
  previousLabel,
  nextLabel,
  empty,
  defaultActiveIndex = 2,
  onActiveIndexChange,
  className,
  ...props
}: GalleryFilmstripCarouselProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const count = list.length
  const [requested, setRequested] = React.useState(defaultActiveIndex)
  const active = count === 0 ? 0 : Math.max(0, Math.min(count - 1, requested))
  const current = list[active]

  const stripRef = React.useRef<HTMLDivElement>(null)
  const thumbRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    if (count === 0) return
    const next = ((index % count) + count) % count
    if (next === active) return
    setRequested(next)
    onActiveIndexChange?.(next)
  }

  React.useEffect(() => {
    reveal(stripRef.current, thumbRefs.current[active])
  }, [active])

  /*
   * The arrow keys step one photo, read against the computed direction so
   * the key pointing forward on screen goes forward; Home and End jump to
   * the ends. From a thumbnail the focus follows the new photo.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") return
    event.preventDefault()
    const isRtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const next =
      key === "Home"
        ? 0
        : key === "End"
          ? count - 1
          : Math.max(0, Math.min(count - 1, active + ((key === "ArrowRight") !== isRtl ? 1 : -1)))
    select(next)
    if (thumbRefs.current.includes(event.target as HTMLButtonElement)) thumbRefs.current[next]?.focus()
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        <header className="flex flex-col gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
            <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          {count > 0 ? (
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="icon-md"
                radius="rounded"
                aria-label={previousLabel ?? copy.previousLabel}
                onClick={() => select(active - 1)}
              >
                <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
              </Button>
              <Button
                variant="outline"
                size="icon-md"
                radius="rounded"
                aria-label={nextLabel ?? copy.nextLabel}
                onClick={() => select(active + 1)}
              >
                <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
              </Button>
            </div>
          ) : null}
        </header>

        {count === 0 || !current ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex flex-col gap-8" onKeyDown={handleKeyDown}>
            <div className="relative aspect-[296/240] w-full overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:aspect-[640/400] [@container(min-width:64rem)]:aspect-[1248/640]">
              {list.map((item, index) =>
                item.image ? (
                  <img
                    key={index}
                    src={item.image.src}
                    alt={item.image.alt}
                    aria-hidden={index === active ? undefined : true}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
                      index === active ? "opacity-100" : "opacity-0"
                    )}
                  />
                ) : null
              )}
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 [@container(min-width:40rem)]:inset-x-6 [@container(min-width:40rem)]:bottom-6">
                <div className="flex min-w-0 flex-col gap-1 rounded-md bg-card px-4 py-3">
                  <p className="truncate whitespace-nowrap text-sm font-semibold text-foreground">
                    <Parts parts={current.title} />
                  </p>
                  <p className="truncate whitespace-nowrap text-xs text-muted-foreground">
                    <Parts parts={current.meta} />
                  </p>
                </div>
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className="shrink-0 whitespace-nowrap rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <bdi dir="ltr">
                    {active + 1} / {count}
                  </bdi>
                </p>
              </div>
            </div>

            <div
              ref={stripRef}
              className="relative -m-1 flex gap-3 overflow-x-auto scroll-smooth p-1 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
            >
              {list.map((item, index) => {
                const isActive = index === active
                return (
                  <button
                    key={index}
                    ref={(node) => {
                      thumbRefs.current[index] = node
                    }}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => select(index)}
                    className={cn(
                      "group h-14 shrink-0 basis-[calc((100%-36px)/4)] rounded-md p-0.5 [@container(min-width:40rem)]:h-16 [@container(min-width:40rem)]:flex-1 [@container(min-width:40rem)]:basis-0 [@container(min-width:64rem)]:h-[88px]",
                      isActive && "ring-2 ring-inset ring-primary",
                      FOCUS_RING
                    )}
                  >
                    <span className="sr-only">
                      <Parts parts={item.title} />
                    </span>
                    <span
                      className={cn(
                        "relative block size-full overflow-hidden rounded-[var(--radius-sm)] bg-muted transition-opacity motion-reduce:transition-none",
                        isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                      )}
                    >
                      {item.image ? (
                        <img
                          src={item.image.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 size-full object-cover"
                        />
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
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
export const galleryFilmstripCarouselCopy = COPY

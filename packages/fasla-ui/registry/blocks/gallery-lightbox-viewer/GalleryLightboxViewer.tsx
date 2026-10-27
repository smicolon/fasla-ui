"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Lightbox Viewer.
 *
 * A photo viewer on an inverted band: the album's title and a "4 of 12 ·
 * credit" line, one big stage between two round arrows, and a centred strip
 * of thumbnails under it, the active one ringed in `primary` and the rest
 * dimmed to 55%. Figma's stage repeats the fourth thumbnail, so the fourth
 * photo is active by default. No photos come with the block: pass `photos`,
 * and until then the stage and the twelve thumbnails are `muted`
 * placeholders of the same size.
 *
 * It is drawn inline, as a page section, not as a dialog. The stage is not
 * a scroller: the photo changes in place, a short crossfade that reduced
 * motion turns off. The arrows, the thumbnails, and the arrow keys (Home and
 * End too) from anywhere in the stage or the strip change it; a thumbnail
 * moved to by key also takes the focus. The arrows wrap from the last photo
 * to the first. The count is a polite live region. Nothing plays on its own.
 *
 * The band is painted with the inverse tokens, dark in Light and light in
 * Dark, as Figma binds it (theme-inverse maps them). The arrows are the
 * library's outline Icon Buttons; only their focus ring is set here, in the
 * inverse foreground, so it shows on the band.
 *
 * The stage fills the row between the arrows. On Tablet and Mobile that
 * leaves no gap (Figma's 24px item spacing is over-subscribed there, so the
 * arrows touch the photo); on Desktop the stage stops at Figma's 1064px and
 * the arrows sit at the row's ends. The strip shows Figma's slots, eight
 * thumbnails on Desktop and Tablet and four on Mobile, and scrolls sideways
 * to the rest, bringing the active one into view when the photo changes.
 *
 * In Arabic the layout mirrors through logical sides alone: the title sits
 * at the right, the arrows swap ends and point the other way, and the strip
 * runs right to left. The photographs are never flipped, and the numerals
 * stay left to right.
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

export interface GalleryLightboxViewerPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryLightboxViewerCopy {
  /** The album's title, the section's `h2`. */
  heading: React.ReactNode
  /** Who took the photos, after the count on the line under the title. Hidden when null. */
  credit: React.ReactNode | null
  /** The count on the line under the title, from the 1-based index and the total: "4 of 12". */
  counter: (index: number, total: number) => React.ReactNode
  /** The back arrow's accessible name. */
  previousLabel: string
  /** The forward arrow's accessible name. */
  nextLabel: string
  /** A thumbnail's accessible name, from its 1-based index and the total. */
  thumbLabel: (index: number, total: number) => string
  /** Shown in place of the stage and the strip when `photos` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryLightboxViewerCopy> = {
  en: {
    heading: "Atrium refit",
    credit: "Shot by the in-house team",
    counter: (index, total) => `${index} of ${total}`,
    previousLabel: "Previous photo",
    nextLabel: "Next photo",
    thumbLabel: (index, total) => `Show photo ${index} of ${total}`,
    empty: "No photos yet.",
  },
  ar: {
    heading: "تجديد البهو",
    credit: "بتصوير فريقنا الداخلي",
    counter: (index, total) => (
      <>
        <bdi dir="ltr">{index}</bdi> من <bdi dir="ltr">{total}</bdi>
      </>
    ),
    previousLabel: "الصورة السابقة",
    nextLabel: "الصورة التالية",
    thumbLabel: (index, total) => `عرض الصورة ${index} من ${total}`,
    empty: "لا توجد صور بعد.",
  },
}

/** Figma's album: twelve photos, eight of them in the strip at a time. */
const SLOTS = 12

/** Brings a thumbnail into the strip's view, moving the strip only, never the page. */
function reveal(strip: HTMLElement | null, thumb: HTMLElement | null | undefined) {
  if (!strip || !thumb) return
  const view = strip.getBoundingClientRect()
  const box = thumb.getBoundingClientRect()
  if (box.left < view.left) strip.scrollBy({ left: box.left - view.left })
  else if (box.right > view.right) strip.scrollBy({ left: box.right - view.right })
}

/** The house ring, in the inverse foreground so it shows on the band. */
const FOCUS_RING =
  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse"

const ON_BAND_RING = "after:ring-foreground-inverse"

const ICON = "size-4 [&:dir(rtl)]:-scale-x-100"

export interface GalleryLightboxViewerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryLightboxViewerCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The album's photos, in strip order; the stage shows the active one.
   * Pass `[]` for the empty state.
   * @default none: twelve `muted` placeholders
   */
  photos?: GalleryLightboxViewerPhoto[]
  /**
   * The photo active at first, by index. Figma's stage shows the fourth.
   * @default 3
   */
  defaultActiveIndex?: number
  /** Called with the new index whenever the active photo changes. */
  onActiveIndexChange?: (index: number) => void
}

export function GalleryLightboxViewer({
  locale = "en",
  heading,
  credit,
  counter,
  previousLabel,
  nextLabel,
  thumbLabel,
  empty,
  photos,
  defaultActiveIndex = 3,
  onActiveIndexChange,
  className,
  ...props
}: GalleryLightboxViewerProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list: (GalleryLightboxViewerPhoto | undefined)[] = photos ?? Array.from({ length: SLOTS }, () => undefined)
  const count = list.length
  const [requested, setRequested] = React.useState(defaultActiveIndex)
  const active = count === 0 ? 0 : Math.max(0, Math.min(count - 1, requested))
  const byline = credit === undefined ? copy.credit : credit
  const countOf = counter ?? copy.counter
  const nameThumb = thumbLabel ?? copy.thumbLabel

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
      className={cn("[container-type:inline-size] bg-background-inverse p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        <header className="flex min-w-0 flex-col gap-0.5">
          <h2 id={headingId} className="text-base font-semibold text-foreground-inverse">
            {heading ?? copy.heading}
          </h2>
          {count > 0 ? (
            <p className="truncate whitespace-nowrap text-sm text-muted-foreground-inverse">
              <bdi aria-live="polite" aria-atomic="true">
                {countOf(active + 1, count)}
              </bdi>
              {byline ? (
                <>
                  <span aria-hidden="true"> · </span>
                  <bdi>{byline}</bdi>
                </>
              ) : null}
            </p>
          ) : null}
        </header>

        {count === 0 ? (
          <p className="text-center text-sm text-muted-foreground-inverse">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex flex-col gap-8" onKeyDown={handleKeyDown}>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon-lg"
                radius="rounded"
                aria-label={previousLabel ?? copy.previousLabel}
                onClick={() => select(active - 1)}
                className={ON_BAND_RING}
              >
                <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
              </Button>
              <div className="relative aspect-[216/240] min-w-0 flex-1 overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:aspect-[560/400] [@container(min-width:64rem)]:aspect-[1064/600] [@container(min-width:64rem)]:max-w-[1064px]">
                {list.map((photo, index) =>
                  photo ? (
                    <img
                      key={index}
                      src={photo.src}
                      alt={photo.alt}
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
              </div>
              <Button
                variant="outline"
                size="icon-lg"
                radius="rounded"
                aria-label={nextLabel ?? copy.nextLabel}
                onClick={() => select(active + 1)}
                className={ON_BAND_RING}
              >
                <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
              </Button>
            </div>

            <div className="flex justify-center">
              {/* The window is Figma's slots plus the 4px either side that keeps the focus rings in view. */}
              <div
                ref={stripRef}
                className="relative -my-1 flex min-w-0 max-w-[288px] gap-2 overflow-x-auto scroll-smooth p-1 [scrollbar-width:none] motion-reduce:scroll-auto [@container(min-width:40rem)]:max-w-[640px] [@container(min-width:64rem)]:max-w-[832px] [&::-webkit-scrollbar]:hidden"
              >
                {list.map((photo, index) => {
                  const isActive = index === active
                  return (
                    <button
                      key={index}
                      ref={(node) => {
                        thumbRefs.current[index] = node
                      }}
                      type="button"
                      aria-label={nameThumb(index + 1, count)}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => select(index)}
                      className={cn(
                        "group h-11 w-16 shrink-0 rounded-md p-0.5 [@container(min-width:40rem)]:h-12 [@container(min-width:40rem)]:w-[72px] [@container(min-width:64rem)]:h-16 [@container(min-width:64rem)]:w-24",
                        isActive && "ring-2 ring-inset ring-primary",
                        FOCUS_RING
                      )}
                    >
                      <span
                        className={cn(
                          "relative block size-full overflow-hidden rounded-[var(--radius-sm)] bg-muted transition-opacity motion-reduce:transition-none",
                          isActive ? "opacity-100" : "opacity-[0.55] group-hover:opacity-100"
                        )}
                      >
                        {photo ? (
                          <img
                            src={photo.src}
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
export const galleryLightboxViewerCopy = COPY

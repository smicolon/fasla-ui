"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Masonry Gallery.
 *
 * A centred header over a masonry of photos in three heights (240, 320 and
 * 400px) and a "Load more" button under it. Figma draws nine photos: three
 * columns of three on Desktop, staggered so every column ends level; two
 * columns on Tablet (five and four); one column on a phone, every photo
 * 240px tall. No photos come with the block: pass `photos`, and until then
 * each slot shows a `muted` placeholder of the same box.
 *
 * Photo `i` keeps the height Figma gives slot `i % 9`, and its column, at
 * each breakpoint, is the one Figma puts that slot in; a longer list repeats
 * the pattern under the first nine, each column carrying on from where it
 * ended, so "Load more" can append without the layout falling apart. From
 * Tablet up it is a grid of 8px rows: each photo spans its height plus the
 * 24px gap, which it carries as bottom padding, and is placed through two
 * custom properties set inline (`--gallery-masonry-md`, `--gallery-masonry-lg`), so one list
 * of photos serves both column counts. The DOM order is the reading order,
 * across each band of three: the phone's single column in Figma's order, and
 * the order a screen reader and the Tab key follow at every breakpoint.
 *
 * The photos open nothing on their own. Pass `onPhotoOpen` and each one is a
 * button that calls it with the photo's index, for a full-screen viewer of
 * your own. "Load more" calls `onLoadMore`; pass `loadMore={null}` to hide it.
 *
 * In Arabic the first column is on the right, as Figma's RTL variants place
 * it; grid columns follow the page's direction, so nothing here knows about
 * it. The years in the Arabic heading sit in `<bdi dir="ltr">`. The
 * photographs are never flipped.
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

export interface GalleryMasonryGalleryPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryMasonryGalleryCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The outline button's label under the photos. Hidden when null. */
  loadMore: React.ReactNode | null
  /** Shown in place of the photos when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryMasonryGalleryCopy> = {
  en: {
    eyebrow: "PORTFOLIO",
    heading: "Selected work, 2024 – 2026",
    description: "Photography, spaces and objects from recent commissions. Load more to see the rest.",
    loadMore: "Load more",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "أعمالنا",
    heading: (
      <>
        أعمال مختارة، <bdi dir="ltr">2024 – 2026</bdi>
      </>
    ),
    description: "تصوير ومساحات وقطع من أعمال حديثة، وتظهر البقية عند تحميل المزيد.",
    loadMore: "تحميل المزيد",
    empty: "لا توجد صور بعد.",
  },
}

/** How many photos Figma draws: the pattern below repeats every nine. */
const PATTERN = 9

/**
 * Each slot's height in 8px grid rows, its 24px gap included: 43 rows is a
 * 320px photo, 33 is 240px and 53 is 400px, in Figma's Desktop LTR order.
 */
const SPAN = [43, 33, 53, 33, 53, 43, 53, 43, 33]

/** Which slots each column stacks, top to bottom, as Figma's Desktop draws them. */
const DESKTOP_COLUMNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
]

/** The same for Figma's Tablet: the third column's slots move into the first two. */
const TABLET_COLUMNS = [
  [0, 1, 2, 6, 8],
  [3, 4, 5, 7],
]

/** Reading order within a band of nine: across the three Desktop columns, row by row. Figma's Mobile order. */
const READING_ORDER = [0, 3, 6, 1, 4, 7, 2, 5, 8]

/** Each photo's `grid-area` for one column layout: `row / column / span rows / auto`. */
function placements(columns: number[][], count: number) {
  const areas: string[] = []
  const offsets = columns.map(() => 1)
  for (let band = 0; band * PATTERN < count; band++) {
    columns.forEach((slots, column) => {
      slots.forEach((slot) => {
        const index = band * PATTERN + slot
        if (index >= count) return
        const span = SPAN[slot] ?? 33
        areas[index] = `${offsets[column]} / ${column + 1} / span ${span} / auto`
        offsets[column] = (offsets[column] ?? 1) + span
      })
    })
  }
  return areas
}

export interface GalleryMasonryGalleryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryMasonryGalleryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photos, in Figma's Desktop LTR order: down the first column, then the
   * second, then the third (320, 240, 400 · 240, 400, 320 · 400, 320, 240px
   * tall). Past nine the pattern repeats. Leave it out for Figma's nine
   * `muted` placeholders; an empty list shows `empty`.
   * @default none: nine `muted` placeholders
   */
  photos?: GalleryMasonryGalleryPhoto[]
  /** Makes each photo a button, called with that photo's index: open your viewer here. */
  onPhotoOpen?: (index: number) => void
  /** Called when "Load more" is pressed. */
  onLoadMore?: () => void
}

export function GalleryMasonryGallery({
  locale = "en",
  eyebrow,
  heading,
  description,
  loadMore,
  empty,
  photos,
  onPhotoOpen,
  onLoadMore,
  className,
  ...props
}: GalleryMasonryGalleryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const count = photos ? photos.length : PATTERN
  const loadMoreLabel = loadMore === undefined ? copy.loadMore : loadMore

  const desktop = placements(DESKTOP_COLUMNS, count)
  const tablet = placements(TABLET_COLUMNS, count)
  const order: number[] = []
  for (let band = 0; band * PATTERN < count; band++) {
    READING_ORDER.forEach((slot) => {
      const index = band * PATTERN + slot
      if (index < count) order.push(index)
    })
  }

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="flex w-full flex-col gap-4">
            <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          <p className="w-full max-w-[560px] text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {count === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <>
            <ul className="flex flex-col gap-6 [@container(min-width:40rem)]:-mb-6 [@container(min-width:40rem)]:grid [@container(min-width:40rem)]:auto-rows-[8px] [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-x-6 [@container(min-width:40rem)]:gap-y-0 [@container(min-width:64rem)]:grid-cols-3">
              {order.map((index) => {
                const photo = photos?.[index]
                const image = photo ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : null
                const tile = "relative block h-[240px] w-full overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-full"
                return (
                  <li
                    key={index}
                    className="[@container(min-width:40rem)]:pb-6 [@container(min-width:40rem)]:[grid-area:var(--gallery-masonry-md)] [@container(min-width:64rem)]:[grid-area:var(--gallery-masonry-lg)]"
                    style={{ "--gallery-masonry-md": tablet[index], "--gallery-masonry-lg": desktop[index] } as React.CSSProperties}
                  >
                    {onPhotoOpen && photo ? (
                      <button
                        type="button"
                        onClick={() => onPhotoOpen(index)}
                        className={cn(
                          tile,
                          "cursor-pointer [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        )}
                      >
                        {image}
                      </button>
                    ) : (
                      <div className={tile}>{image}</div>
                    )}
                  </li>
                )
              })}
            </ul>

            {loadMoreLabel ? (
              <div className="flex justify-center">
                <Button variant="outline" onClick={onLoadMore}>
                  {loadMoreLabel}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryMasonryGalleryCopy = COPY

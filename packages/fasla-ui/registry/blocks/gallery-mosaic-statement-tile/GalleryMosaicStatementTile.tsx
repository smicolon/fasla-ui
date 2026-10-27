"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Mosaic + Statement Tile.
 *
 * A full-bleed mosaic of square photos, edge to edge with no gaps, with one
 * tile in the primary colour that carries the section's heading, a line of
 * text and a link. The block has no padding and no max width: the mosaic is
 * the section, and its squares grow with the page.
 *
 * Desktop is five columns by two rows, the statement tile in the middle of
 * the first row, so nine photos show. Tablet is four columns by three rows,
 * the tile two squares wide at the start of the first row; Mobile is two
 * columns, the tile across the top. Both show ten photos. The photos are one
 * list in the same order at every breakpoint: only the tile moves, and
 * Desktop hides the tenth. The tile is placed in the grid and the photos
 * flow round it, so the order holds however many photos there are.
 *
 * On Tablet and Desktop the tile's heading sits at the top and its text and
 * link at the bottom; on Mobile the three stack from the top, as in Figma.
 *
 * In Arabic the grid runs from the right, as Figma's RTL variants draw it,
 * with the tile's text right-aligned. The photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:48rem)]:` is its Tablet,
 * from 768px, and `[@container(min-width:64rem)]:` its Desktop, from
 * 1024px. The section's own padding still follows the window, since an
 * element can't query itself.
 */

export interface GalleryMosaicStatementTileAction {
  label: React.ReactNode
  href: string
}

export interface GalleryMosaicStatementTilePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryMosaicStatementTileCopy {
  /** The section's heading, an `h2`, at the top of the statement tile. */
  heading: React.ReactNode
  /** The text at the bottom of the tile. */
  description: React.ReactNode
  /** The solid secondary button under the text, to the full album. Hidden when null. */
  action: GalleryMosaicStatementTileAction | null
  /** Shown in place of the photos when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryMosaicStatementTileCopy> = {
  en: {
    heading: "Life at Fasla",
    description: "Two studios, one long table and a lot of coffee. See what a week here looks like.",
    action: { label: "Open the album", href: "#gallery" },
    empty: "No photos yet.",
  },
  ar: {
    heading: "الحياة في فاصلة",
    description: "استوديوهان وطاولة طويلة وكثير من القهوة. اطّلع على شكل أسبوع هنا.",
    action: { label: "افتح الألبوم", href: "#gallery" },
    empty: "لا توجد صور بعد.",
  },
}

/** Figma's mosaic holds ten photos (Desktop shows the first nine). */
const SLOTS = 10

export interface GalleryMosaicStatementTileProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryMosaicStatementTileCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photos, in Figma's order, which is the same at every breakpoint:
   * row by row from the start edge, skipping the statement tile. Figma's
   * mosaic holds ten; Desktop shows the first nine, Tablet and Mobile all
   * ten. Photos past the tenth are not shown. None by default: ten `muted`
   * placeholders. An empty list shows the `empty` line in place of the
   * photos, under the tile.
   * @default none: `muted` placeholders
   */
  photos?: GalleryMosaicStatementTilePhoto[]
}

export function GalleryMosaicStatementTile({
  locale = "en",
  heading,
  description,
  action,
  empty,
  photos,
  className,
  ...props
}: GalleryMosaicStatementTileProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const link = action === undefined ? copy.action : action
  const squares: (GalleryMosaicStatementTilePhoto | undefined)[] = (
    photos ?? Array.from({ length: SLOTS }, () => undefined)
  ).slice(0, SLOTS)

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      <div className="grid grid-cols-2 [@container(min-width:48rem)]:grid-cols-4 [@container(min-width:64rem)]:grid-cols-5">
        <div className="col-span-2 flex aspect-[2/1] flex-col gap-3 bg-primary p-6 text-primary-foreground [@container(min-width:48rem)]:justify-between [@container(min-width:64rem)]:col-span-1 [@container(min-width:64rem)]:col-start-3 [@container(min-width:64rem)]:row-start-1 [@container(min-width:64rem)]:aspect-square">
          <h2 id={headingId} className="text-2xl font-semibold">
            {heading ?? copy.heading}
          </h2>
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm">{description ?? copy.description}</p>
            {link ? (
              <a href={link.href} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                {link.label}
              </a>
            ) : null}
          </div>
        </div>

        {squares.length === 0 ? (
          <p className="col-span-full px-8 py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          squares.map((photo, index) => (
            <div
              key={index}
              className={cn("relative aspect-square overflow-hidden bg-muted", index === SLOTS - 1 && "[@container(min-width:64rem)]:hidden")}
            >
              {photo ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryMosaicStatementTileCopy = COPY

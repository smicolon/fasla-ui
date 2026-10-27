"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Photo Bento.
 *
 * One large hero photo beside a two-by-two of smaller ones, under a header
 * with an "Open gallery" link. On Desktop the hero takes the start side
 * (824 of 1248px) and the four tiles stack two-high at the end, the hero as
 * tall as both rows; on Tablet and phones the hero goes full width on top
 * and the four tiles sit in two rows under it. The header's link sits at the
 * end of the row on Desktop, its foot level with the description's, and
 * drops under the description from Tablet down. No photos come with the
 * block: pass `photos`, and until then each slot shows a `muted`
 * placeholder of the same box.
 *
 * Heights are Figma's at each breakpoint (hero 240/400/584px, tiles
 * 120/200/280px) and widths share the row, so between breakpoints the photos
 * crop rather than change height. Figma's phone leaves 16px between the hero
 * and the tiles and 24px between the tiles; that is kept.
 *
 * In Arabic the hero moves to the right and the tiles fill from the right,
 * as Figma's RTL variants place them; every side here is a logical one. The
 * link's arrow points up and to the end, so it turns to up-left in Arabic,
 * as Figma swaps it. The photographs are never flipped.
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

export interface GalleryPhotoBentoAction {
  label: React.ReactNode
  href: string
}

export interface GalleryPhotoBentoPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryPhotoBentoCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The solid link to the full gallery, with an arrow. Hidden when null. */
  action: GalleryPhotoBentoAction | null
  /** Shown in place of the photos when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryPhotoBentoCopy> = {
  en: {
    eyebrow: "GALLERY",
    heading: "A closer look at the studio",
    description: "Four floors, two cities and one very long table. Here is where the work happens.",
    action: { label: "Open gallery", href: "#gallery" },
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "معرض الصور",
    heading: "نظرة أقرب إلى الاستوديو",
    description: "أربعة طوابق ومدينتان وطاولة واحدة طويلة. هنا يحدث العمل.",
    action: { label: "افتح المعرض", href: "#gallery" },
    empty: "لا توجد صور بعد.",
  },
}

/** Figma's five slots: the hero, then the four tiles row by row. */
const SLOTS = 5

export interface GalleryPhotoBentoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryPhotoBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The five photos, in Figma's order: the hero, then the tiles row by row
   * from the start (top start, top end, bottom start, bottom end). Leave it
   * out for `muted` placeholders; an empty list shows `empty`.
   * @default none: `muted` placeholders
   */
  photos?: GalleryPhotoBentoPhoto[]
}

export function GalleryPhotoBento({
  locale = "en",
  eyebrow,
  heading,
  description,
  action,
  empty,
  photos,
  className,
  ...props
}: GalleryPhotoBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const link = action === undefined ? copy.action : action

  const photo = (index: number, frame: string) => {
    const image = photos?.[index]
    return (
      <div className={cn("relative min-w-0 overflow-hidden rounded-lg bg-muted", frame)}>
        {image ? (
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        ) : null}
      </div>
    )
  }

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col items-start gap-2 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:gap-16">
          <div className="flex w-full min-w-0 flex-col gap-2 [@container(min-width:64rem)]:flex-1">
            <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          {link ? (
            <a href={link.href} className={buttonVariants()}>
              {link.label}
              <ArrowUpRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </a>
          ) : null}
        </header>

        {photos && photos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex flex-col gap-4 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:flex-row">
            {photo(0, "h-[240px] [@container(min-width:40rem)]:h-[400px] [@container(min-width:64rem)]:h-[584px] [@container(min-width:64rem)]:flex-[824_1_0%]")}
            <div className="grid min-w-0 grid-cols-2 gap-6 [@container(min-width:64rem)]:flex-[400_1_0%]">
              {Array.from({ length: SLOTS - 1 }, (_, tile) => (
                <React.Fragment key={tile}>{photo(tile + 1, "h-[120px] [@container(min-width:40rem)]:h-[200px] [@container(min-width:64rem)]:h-[280px]")}</React.Fragment>
              ))}
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
export const galleryPhotoBentoCopy = COPY

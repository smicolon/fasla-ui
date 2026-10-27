"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Gallery` (42478:479), Type=Culture Photo Grid.
 *
 * A start-aligned header over a grid of captioned photos: three columns on
 * Desktop, two on Tablet, one on a phone, with the same 32px gap both ways.
 * Each card is a photo with a one-line caption under it, the title at the
 * start and a short meta (a month, "Weekly") at the end. The photo travels
 * with its caption, so it lives on the item (`items[i].image`), and the cards
 * keep Figma's order at every breakpoint. No photos come with the block:
 * until you pass them, each card shows a `muted` placeholder of the same box.
 *
 * The photo's shape changes with the breakpoint, as Figma draws it (296×220,
 * 304×240, 395×288), so its height tracks the column width between them. A
 * caption never wraps: a long title trims with an ellipsis and the meta keeps
 * its width.
 *
 * In Arabic the grid fills from the right and each caption mirrors, title on
 * the right and meta on the left, as Figma's RTL variants do; nothing here
 * knows about direction, because every side is a logical one. Years in the
 * Arabic meta sit in `<bdi dir="ltr">`. The photographs are never flipped.
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

export interface GalleryCulturePhotoGridPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryCulturePhotoGridItem {
  /** The caption's title, at the start. One line; trims when too long. */
  title: React.ReactNode
  /** The short note at the caption's end: a month, a cadence. One line. */
  meta: React.ReactNode
  /**
   * The card's photo. None by default: the card shows a `muted` placeholder.
   * @default none: `muted` placeholder
   */
  image?: GalleryCulturePhotoGridPhoto
}

export interface GalleryCulturePhotoGridCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The cards, in order. Each has a `title`, a `meta` and an optional `image`. */
  items: GalleryCulturePhotoGridItem[]
  /** Shown in place of the grid when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryCulturePhotoGridCopy> = {
  en: {
    eyebrow: "GALLERY",
    heading: "Moments from the year",
    description: "A few of the places, faces and late nights that made this year what it was.",
    items: [
      { title: "Offsite in Lisbon", meta: "May 2026" },
      { title: "Launch night", meta: "Feb 2026" },
      { title: "Design crit, Thursday", meta: "Weekly" },
      { title: "New studio, day one", meta: "Jan 2026" },
      { title: "Hack week finals", meta: "Aug 2026" },
      { title: "Summer picnic", meta: "Jul 2026" },
    ],
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "معرض الصور",
    heading: "لحظات من العام",
    description: "بعض الأماكن والوجوه وليالي السهر التي صنعت هذا العام.",
    items: [
      {
        title: "رحلة الفريق في لشبونة",
        meta: (
          <>
            مايو <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
      {
        title: "ليلة الإطلاق",
        meta: (
          <>
            فبراير <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
      { title: "جلسة نقد التصميم، الخميس", meta: "أسبوعيًا" },
      {
        title: "الاستوديو الجديد، اليوم الأول",
        meta: (
          <>
            يناير <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
      {
        title: "نهائيات أسبوع الابتكار",
        meta: (
          <>
            أغسطس <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
      {
        title: "نزهة الصيف",
        meta: (
          <>
            يوليو <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
    ],
    empty: "لا توجد صور بعد.",
  },
}

export interface GalleryCulturePhotoGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryCulturePhotoGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function GalleryCulturePhotoGrid({
  locale = "en",
  eyebrow,
  heading,
  description,
  items,
  empty,
  className,
  ...props
}: GalleryCulturePhotoGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
            {list.map((item, index) => (
              <li key={index}>
                <figure className="flex flex-col gap-3">
                  <div className="relative aspect-[296/220] overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:aspect-[304/240] [@container(min-width:64rem)]:aspect-[395/288]">
                    {item.image ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <figcaption className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">{item.title}</span>
                    <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{item.meta}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
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
export const galleryCulturePhotoGridCopy = COPY

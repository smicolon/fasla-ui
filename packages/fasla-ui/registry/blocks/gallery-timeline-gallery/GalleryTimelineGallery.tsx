"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Timeline Gallery.
 *
 * An archive read year by year: a header, then one row per year, newest
 * first, ruled off from the next by a divider. Each row has the year, its
 * photo count and an "Open year" link in a narrow column at the start, and
 * a strip of that year's photos filling the rest.
 *
 * Desktop's strip is four photos 176px tall; Tablet's is three, 120px tall,
 * in a 120px year column, and hides each year's fourth photo, as Figma's
 * Tablet does. On a phone the year sits over its photos, as a 2 × 2 grid
 * 110px tall: the year and the link share the first line, with the count
 * under them, as Figma's Mobile wraps them. The photos' heights are fixed,
 * as Figma's are, and their widths share the strip.
 *
 * The rows are an ordered list and each year is an `h3`, so a screen reader
 * can jump year to year. Every row's link reads "Open year", so each one is
 * described by its year.
 *
 * In Arabic the year column moves to the right and the strip runs from the
 * right, as Figma's RTL variants draw it, and the link's arrow points the
 * reading direction. The counts' numerals are isolated in the Arabic copy.
 * The photographs are never flipped.
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

export interface GalleryTimelineGalleryPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryTimelineGalleryYear {
  /** The year, in display type: the row's `h3`. */
  year: React.ReactNode
  /** The line under the year, such as "18 photos". Hidden when empty. */
  count?: React.ReactNode
  /** Where the row's "Open year" link goes. Without it the row has no link. */
  href?: string
}

export interface GalleryTimelineGalleryCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The rows, newest first. Each takes the next four photos. */
  years: GalleryTimelineGalleryYear[]
  /** The label of every row's link. Each link is described by its row's year. */
  openLabel: React.ReactNode
  /** Shown in place of the rows when `years` or `photos` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryTimelineGalleryCopy> = {
  en: {
    eyebrow: "ARCHIVE",
    heading: "Three years, one long table",
    years: [
      { year: "2026", count: "18 photos", href: "#year-2026" },
      { year: "2025", count: "32 photos", href: "#year-2025" },
      { year: "2024", count: "27 photos", href: "#year-2024" },
    ],
    openLabel: "Open year",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "الأرشيف",
    heading: "ثلاث سنوات وطاولة واحدة طويلة",
    years: [
      {
        year: "2026",
        count: (
          <>
            <bdi dir="ltr">18</bdi> صورة
          </>
        ),
        href: "#year-2026",
      },
      {
        year: "2025",
        count: (
          <>
            <bdi dir="ltr">32</bdi> صورة
          </>
        ),
        href: "#year-2025",
      },
      {
        year: "2024",
        count: (
          <>
            <bdi dir="ltr">27</bdi> صورة
          </>
        ),
        href: "#year-2024",
      },
    ],
    openLabel: "افتح العام",
    empty: "لا توجد صور بعد.",
  },
}

/** Each row's strip holds four photos; Tablet shows the first three. */
const PER_YEAR = 4

export interface GalleryTimelineGalleryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryTimelineGalleryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photos, in Figma's order: four a year, row by row from the newest
   * year, each row from the start edge. Photos 1–4 go to the first year,
   * 5–8 to the second, and so on. Tablet hides each year's fourth. None by
   * default: `muted` placeholders. An empty list shows the `empty` line in
   * place of the rows.
   * @default none: `muted` placeholders
   */
  photos?: GalleryTimelineGalleryPhoto[]
}

export function GalleryTimelineGallery({
  locale = "en",
  eyebrow,
  heading,
  years,
  openLabel,
  empty,
  photos,
  className,
  ...props
}: GalleryTimelineGalleryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rowId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const rows = years ?? copy.years
  const open = openLabel ?? copy.openLabel

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          {label ? <p className="text-xs font-medium text-primary">{label}</p> : null}
          <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </header>

        {rows.length === 0 || (photos && photos.length === 0) ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ol className="flex flex-col gap-8">
            {rows.map((row, rowIndex) => {
              const yearId = `${rowId}-${rowIndex}`
              return (
                <li
                  key={rowIndex}
                  className="flex flex-col gap-4 border-t border-border pb-8 pt-8 first:border-t-0 first:pt-0 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-10"
                >
                  <div className="flex flex-wrap items-start gap-1 [@container(min-width:40rem)]:w-[120px] [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:flex-nowrap [@container(min-width:64rem)]:w-40">
                    <h3 id={yearId} className="min-w-0 flex-1 text-3xl font-semibold text-foreground [@container(min-width:40rem)]:flex-none">
                      {row.year}
                    </h3>
                    {row.count ? (
                      <p className="order-last w-full whitespace-nowrap text-sm text-muted-foreground [@container(min-width:40rem)]:order-none">
                        {row.count}
                      </p>
                    ) : null}
                    {row.href ? (
                      <a
                        href={row.href}
                        aria-describedby={yearId}
                        className={buttonVariants({ variant: "secondary", size: "sm", className: "[@container(min-width:40rem)]:mt-3" })}
                      >
                        {open}
                        <ArrowRight
                          size={16}
                          strokeWidth={1.5}
                          absoluteStrokeWidth
                          aria-hidden
                          className="[&:dir(rtl)]:-scale-x-100"
                        />
                      </a>
                    ) : null}
                  </div>

                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:64rem)]:grid-cols-4">
                    {Array.from({ length: PER_YEAR }, (_, index) => {
                      const photo = photos?.[rowIndex * PER_YEAR + index]
                      return (
                        <div
                          key={index}
                          className={cn(
                            "relative h-[110px] overflow-hidden rounded-md bg-muted [@container(min-width:40rem)]:h-[120px] [@container(min-width:64rem)]:h-44",
                            index === PER_YEAR - 1 && "[@container(min-width:40rem)]:hidden [@container(min-width:64rem)]:block"
                          )}
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
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryTimelineGalleryCopy = COPY

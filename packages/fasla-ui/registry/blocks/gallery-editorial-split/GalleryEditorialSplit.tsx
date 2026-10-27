"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Editorial Split.
 *
 * An editorial intro beside a cluster of four photos. The copy (eyebrow,
 * heading, description and two links) takes a fixed 448px column at the
 * start; the cluster fills the rest, as two columns of two photos. The
 * columns are staggered: the first starts lower (40px, 24 on Mobile) and
 * runs tall-then-short, the second short-then-tall, so the four photos make
 * an offset brick rather than a grid. The copy is centred against the
 * cluster's height.
 *
 * Tablet and Mobile stack the copy over the cluster. Tablet keeps Desktop's
 * photo heights (300 and 220); Mobile shortens them to 160 and 120 and the
 * heading drops from 48px to 30. The photos' heights are fixed, as Figma's
 * are, and their widths follow the column.
 *
 * In Arabic the copy moves to the right and the cluster to the left, with
 * the lowered column still on the start side, as Figma's RTL variants draw
 * it. The arrow on "View all photos" points the reading direction. The
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

export interface GalleryEditorialSplitAction {
  label: React.ReactNode
  href: string
}

export interface GalleryEditorialSplitPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryEditorialSplitCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. */
  description: React.ReactNode
  /** The solid button: the main way in, such as the team page. */
  primaryAction: GalleryEditorialSplitAction
  /** The outline button beside it, with an arrow: the full gallery. Hidden when null. */
  secondaryAction: GalleryEditorialSplitAction | null
  /** Shown in place of the photos when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryEditorialSplitCopy> = {
  en: {
    eyebrow: "WHO WE ARE",
    heading: "Built by people obsessed with the details",
    description:
      "Designers, engineers and writers working out of two studios. We photograph almost everything we make, and most of what we do not.",
    primaryAction: { label: "Meet the team", href: "#team" },
    secondaryAction: { label: "View all photos", href: "#gallery" },
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "من نحن",
    heading: "بناه أشخاص مهووسون بالتفاصيل",
    description: "مصمّمون ومهندسون وكُتّاب في استوديوين. نصوّر أعمالنا كلها تقريبًا، وما هو أكثر منها.",
    primaryAction: { label: "تعرّف على الفريق", href: "#team" },
    secondaryAction: { label: "عرض كل الصور", href: "#gallery" },
    empty: "لا توجد صور بعد.",
  },
}

/**
 * The four photo frames in slot order, two to a column. The heights are
 * Figma's: tall 300 and short 220 from Tablet up, 160 and 120 on Mobile.
 */
const TALL = "h-40 [@container(min-width:40rem)]:h-[300px]"
const SHORT = "h-[120px] [@container(min-width:40rem)]:h-[220px]"
const COLUMNS = [
  { className: "pt-6 [@container(min-width:40rem)]:pt-10", frames: [TALL, SHORT] },
  { className: "", frames: [SHORT, TALL] },
]

export interface GalleryEditorialSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryEditorialSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The four photos, in Figma's order: the lowered start column top to
   * bottom (tall, then short), then the end column (short, then tall).
   * Photos past the fourth are not shown. None by default: four `muted`
   * placeholders. An empty list shows the `empty` line instead of the
   * cluster.
   * @default none: `muted` placeholders
   */
  photos?: GalleryEditorialSplitPhoto[]
}

export function GalleryEditorialSplit({
  locale = "en",
  eyebrow,
  heading,
  description,
  primaryAction,
  secondaryAction,
  empty,
  photos,
  className,
  ...props
}: GalleryEditorialSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-16">
        <div className="flex flex-col gap-6 [@container(min-width:64rem)]:w-[448px] [@container(min-width:64rem)]:shrink-0">
          {label ? <p className="text-xs font-medium text-primary">{label}</p> : null}
          <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-5xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          <div className="flex flex-wrap gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
                <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
              </a>
            ) : null}
          </div>
        </div>

        {photos && photos.length === 0 ? (
          <p className="flex-1 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-6">
            {COLUMNS.map((column, columnIndex) => (
              <div key={columnIndex} className={cn("flex flex-col gap-6", column.className)}>
                {column.frames.map((frame, frameIndex) => {
                  const photo = photos?.[columnIndex * 2 + frameIndex]
                  return (
                    <div key={frameIndex} className={cn("relative overflow-hidden rounded-lg bg-muted", frame)}>
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
            ))}
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
export const galleryEditorialSplitCopy = COPY

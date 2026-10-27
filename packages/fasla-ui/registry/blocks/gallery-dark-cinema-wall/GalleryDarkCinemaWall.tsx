"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Gallery` (42478:479), Type=Dark Cinema Wall.
 *
 * A centred header over two rows of wide stills on an inverted surface, like
 * a wall of screens. Each row runs past both edges of the section and is
 * clipped there; its first and last stills are dimmed to 35%, so the wall
 * fades out at the sides. The two rows are staggered: the first starts half
 * a still before the start edge, the second a little later (96px on Desktop,
 * 80 on Tablet, 60 on Mobile), so the gaps never line up. Past Figma's 1440
 * the wall keeps Figma's 1440 width, centred, with the surface either side.
 *
 * The surface is painted with the inverse tokens, the only way Fasla inverts
 * one: dark in Light, light in Dark, without forcing a `.dark` class, as
 * Error State's Dark Spotlight does. The theme-inverse registry item maps the
 * tokens, falling back to the page colours swapped in a theme that doesn't
 * define them. A missing still is a placeholder in the inverse muted colour,
 * not `muted`, which would show as a pale tile on the dark wall.
 *
 * Nothing moves: the wall is still, as Figma's motion note says. A
 * still with an `href` is a link, with the house focus ring in the inverse
 * foreground, so it shows on the inverted surface. The rows clip only
 * sideways, so a ring above or below a still is never cut off.
 *
 * In Arabic the rows start at the right, as Figma's RTL variants draw them:
 * the first still sits at the right edge, half outside, and the stagger runs
 * from the right. The photographs are never flipped. Figma hides the
 * description on Mobile; so does the block.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:48rem)]:` is its Tablet,
 * from 768px, and `[@container(min-width:64rem)]:` its Desktop, from
 * 1024px. The section's own padding still follows the window, since an
 * element can't query itself.
 */

export interface GalleryDarkCinemaWallPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
  /** Where the still links to, such as its film or project. Without it the still is a plain image. */
  href?: string
}

export interface GalleryDarkCinemaWallCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden on Mobile, as in Figma. */
  description: React.ReactNode
  /** Shown in place of the wall when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryDarkCinemaWallCopy> = {
  en: {
    eyebrow: "ARCHIVE",
    heading: "Every frame we have ever shipped",
    description: "Stills from launches, films and studio life, in two rows that fade at the edges.",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "الأرشيف",
    heading: "كل صورة أطلقناها يومًا",
    description: "لقطات من الإطلاقات والأفلام وحياة الاستوديو، في صفّين يتلاشيان عند الأطراف.",
    empty: "لا توجد صور بعد.",
  },
}

/** How far each row starts before the start edge, per breakpoint. */
const ROW_OFFSET = ["-ms-20 [@container(min-width:48rem)]:-ms-[110px] [@container(min-width:64rem)]:-ms-[136px]", "-ms-5 [@container(min-width:48rem)]:-ms-[30px] [@container(min-width:64rem)]:-ms-10"]

export interface GalleryDarkCinemaWallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryDarkCinemaWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The stills, in Figma's order: the first row from the start edge, then the
   * second. Figma's wall holds 12, six a row; any other count splits in half,
   * the first row taking the odd one. The first and last still of each row
   * are dimmed and half outside the wall, so put the strongest ones in
   * between. None by default: 12 placeholders. An empty list shows the
   * `empty` line instead of the wall.
   * @default none: 12 placeholders
   */
  photos?: GalleryDarkCinemaWallPhoto[]
}

export function GalleryDarkCinemaWall({
  locale = "en",
  eyebrow,
  heading,
  description,
  empty,
  photos,
  className,
  ...props
}: GalleryDarkCinemaWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const stills: (GalleryDarkCinemaWallPhoto | undefined)[] = photos ?? Array.from({ length: 12 }, () => undefined)
  const half = Math.ceil(stills.length / 2)
  const rows = [stills.slice(0, half), stills.slice(half)].filter((row) => row.length > 0)

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] flex flex-col gap-8 bg-background-inverse py-8 md:py-16 lg:py-24", className)}
      {...props}
    >
      <div className="px-8 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-4 [@container(min-width:64rem)]:px-24">
        <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-4 text-center">
          <div className="flex w-full flex-col gap-3">
            {label ? <p className="text-xs font-medium text-muted-foreground-inverse">{label}</p> : null}
            <h2 id={headingId} className="text-2xl font-semibold text-foreground-inverse [@container(min-width:48rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          <p className="hidden w-full max-w-[520px] text-base text-muted-foreground-inverse [@container(min-width:48rem)]:block">
            {description ?? copy.description}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="px-8 text-center text-sm text-muted-foreground-inverse">{empty ?? copy.empty}</p>
      ) : (
        rows.map((row, rowIndex) => (
          <div key={rowIndex} className="mx-auto w-full max-w-[1440px] overflow-x-clip">
            <ul className={cn("flex w-max gap-4", ROW_OFFSET[rowIndex])}>
              {row.map((photo, index) => {
                const edge = index === 0 || index === row.length - 1
                const tile = cn(
                  "relative block h-24 w-40 overflow-hidden rounded-md bg-muted-foreground-inverse/20 [@container(min-width:48rem)]:h-[130px] [@container(min-width:48rem)]:w-[220px] [@container(min-width:64rem)]:h-40 [@container(min-width:64rem)]:w-[272px]",
                  edge && "opacity-[0.35]"
                )
                const image = photo ? (
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                ) : null
                return (
                  <li key={index} className="shrink-0">
                    {photo?.href ? (
                      <a
                        href={photo.href}
                        className={cn(
                          tile,
                          "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse"
                        )}
                      >
                        {image}
                      </a>
                    ) : (
                      <div className={tile}>{image}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryDarkCinemaWallCopy = COPY

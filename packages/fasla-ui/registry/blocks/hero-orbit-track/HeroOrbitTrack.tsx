"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Hero` (46552:249264), Type=Orbit Track Hero.
 *
 * A studio introduction on an inverse band: a frosted pill, a light two-line
 * headline, a paragraph and three frosted figure cards. Beside them runs a
 * racetrack, a thick rounded band with nine round photos on it, each in a
 * coloured ring, and a short caption inside the loop.
 *
 * Desktop sets the copy at the start and the track beside it, 900 × 420, its
 * far end running off the block's edge as Figma's does; thin guide lines
 * frame the block 48px in. Tablet stacks the copy over the whole track,
 * scaled to 720 × 336, with the caption set smaller. Mobile drops the track
 * and its photos and keeps the caption alone, centred under the cards, which
 * go two by two.
 *
 * In Arabic the track mirrors: the copy sits on the right, the photos ring
 * the right end of the loop and the track runs off the left edge. Numbers
 * stay left to right. The photos themselves are never flipped.
 *
 * Each photo's place is Figma's: its centre as a share of the track's width
 * and height. The track keeps one shape at every width, so the same numbers
 * serve Desktop and Tablet, and they are placed from the inline start, so
 * they draw the mirrored track in Arabic.
 *
 * The band is an inverse surface, a deliberate contrast band rather than a
 * photo, so it uses the inverse tokens with no `dark:` switch, and the
 * frosted cards the light foreground at 20%, which follows them.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at. Narrower, the track crowds the copy, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroOrbitTrackPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroOrbitTrackStat {
  /** The figure. Shown left to right in either language. */
  value: React.ReactNode
  label: React.ReactNode
}

export interface HeroOrbitTrackCopy {
  /** The frosted pill above the headline. Hidden when empty. */
  label: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The figure cards under the paragraph. Figma shows three. */
  stats: HeroOrbitTrackStat[]
  /** The line inside the track; on Mobile, under the cards. Hidden when empty. */
  caption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroOrbitTrackCopy> = {
  en: {
    label: "OUR STUDIO",
    headline: "Many projects,\none shared ambition",
    description: "A small team of designers, writers and engineers shaping how people experience brands online.",
    stats: [
      { value: "84", label: "Projects shipped" },
      { value: "12", label: "Countries served" },
      { value: "05", label: "Product launches" },
    ],
    caption: "Twelve countries. One studio.",
  },
  ar: {
    label: "استوديونا",
    headline: "مشاريع كثيرة\nوطموح واحد",
    description: "فريق صغير من المصممين والكتّاب والمهندسين يرسم طريقة تفاعل الناس مع العلامات على الإنترنت.",
    stats: [
      { value: "84", label: "مشروعًا مُنجزًا" },
      { value: "12", label: "دولة نخدمها" },
      { value: "05", label: "إطلاقات منتجات" },
    ],
    caption: "اثنتا عشرة دولة، واستوديو واحد.",
  },
}

/**
 * The nine photos in Figma's order: three along the top from the middle
 * outwards, three round the start end of the loop, three along the bottom.
 * `x` and `y` are the photo's centre as percentages of the track's width and
 * height, measured on Desktop's 900 × 420 track (Tablet's is the same shape at
 * 0.8), all on the middle line of the band. `ring` is its ring's token.
 */
const PLACES = [
  { x: 40, y: 9.524, ring: "bg-chart-1" },
  { x: 57.778, y: 9.524, ring: "bg-chart-2" },
  { x: 75.556, y: 9.524, ring: "bg-chart-4" },
  { x: 8.111, y: 26.19, ring: "bg-chart-5" },
  { x: 4.556, y: 50, ring: "bg-info" },
  { x: 8.111, y: 73.81, ring: "bg-success" },
  { x: 40, y: 90.476, ring: "bg-chart-1" },
  { x: 57.778, y: 90.476, ring: "bg-chart-2" },
  { x: 75.556, y: 90.476, ring: "bg-chart-4" },
] as const

export interface HeroOrbitTrackProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroOrbitTrackCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The nine photos on the track, in Figma's order: three along the top,
   * three round the start end, three along the bottom. Photos past the ninth
   * are not shown; Mobile shows none. None by default: `muted` circles in
   * their rings.
   * @default none: `muted` placeholders
   */
  photos?: HeroOrbitTrackPhoto[]
}

export function HeroOrbitTrack({
  locale = "en",
  label,
  headline,
  description,
  stats,
  caption,
  photos,
  className,
  ...props
}: HeroOrbitTrackProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const pill = label ?? copy.label
  const figures = stats ?? copy.stats
  const line = caption ?? copy.caption

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden [container-type:inline-size] bg-background-inverse", className)}
      {...props}
    >
      {/* Figma's guide lines across the block, 48px in from the top and bottom, on Desktop only. */}
      <div aria-hidden className="absolute inset-x-0 top-12 hidden h-px bg-foreground-inverse/10 [@container(min-width:90rem)]:block" />
      <div aria-hidden className="absolute inset-x-0 bottom-12 hidden h-px bg-foreground-inverse/10 [@container(min-width:90rem)]:block" />

      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="relative mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:min-h-[900px] [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-center [@container(min-width:90rem)]:gap-[104px] [@container(min-width:90rem)]:py-24 [@container(min-width:90rem)]:pe-0 [@container(min-width:90rem)]:ps-24">
        {/* The guide lines down the block, 48px in from each side. */}
        <div aria-hidden className="absolute inset-y-0 start-12 hidden w-px bg-foreground-inverse/10 [@container(min-width:90rem)]:block" />
        <div aria-hidden className="absolute inset-y-0 end-12 hidden w-px bg-foreground-inverse/10 [@container(min-width:90rem)]:block" />

        <div className="flex min-w-0 flex-col items-start gap-6 [@container(min-width:90rem)]:w-[560px] [@container(min-width:90rem)]:shrink-0">
          {pill ? (
            <p className="whitespace-nowrap rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-medium text-foreground-inverse">{pill}</p>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-light text-foreground-inverse [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-pretty text-base text-muted-foreground-inverse [@container(min-width:90rem)]:max-w-[440px]">
            {description ?? copy.description}
          </p>
          <dl className="grid w-full grid-cols-2 gap-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:grid-cols-[repeat(3,minmax(148px,max-content))]">
            {figures.map((stat, index) => (
              <div key={index} className="flex min-w-0 flex-col-reverse gap-2 rounded-lg bg-primary-foreground/20 p-4">
                <dt className="whitespace-nowrap text-xs text-muted-foreground-inverse dark:text-foreground-inverse">{stat.label}</dt>
                <dd className="text-2xl text-foreground-inverse [@container(min-width:48rem)]:text-3xl">
                  <bdi dir="ltr">{stat.value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/*
         * The track: the band and its photos from Tablet up, 15:7 at every
         * width. On Mobile only the caption is left, in the flow.
         */}
        <div className="relative [@container(min-width:48rem)]:aspect-[15/7] [@container(min-width:48rem)]:w-full [@container(min-width:90rem)]:w-[900px] [@container(min-width:90rem)]:shrink-0">
          <div aria-hidden className="absolute inset-0 hidden rounded-full bg-foreground-inverse/10 [@container(min-width:48rem)]:block">
            <div className="absolute inset-16 rounded-full bg-background-inverse [@container(min-width:90rem)]:inset-20" />
          </div>

          {line ? (
            // A zero-width anchor at Figma's spot, a little past the middle,
            // so the caption centres on it in either direction.
            <p className="text-balance text-center text-base font-medium text-foreground-inverse [@container(min-width:48rem)]:absolute [@container(min-width:48rem)]:start-[54.4%] [@container(min-width:48rem)]:top-1/2 [@container(min-width:48rem)]:flex [@container(min-width:48rem)]:w-0 [@container(min-width:48rem)]:-translate-y-1/2 [@container(min-width:48rem)]:justify-center [@container(min-width:48rem)]:text-xs [@container(min-width:90rem)]:text-base">
              <span className="[@container(min-width:48rem)]:whitespace-nowrap">{line}</span>
            </p>
          ) : null}

          <ul className="absolute inset-0 hidden [@container(min-width:48rem)]:block">
            {PLACES.map((place, index) => {
              const photo = photos?.[index]
              return (
                <li
                  key={index}
                  style={{ insetInlineStart: `${place.x}%`, top: `${place.y}%` }}
                  className={cn(
                    // Placed by its centre: the start offset less half the ring.
                    "absolute -ms-[27px] -mt-[27px] size-[54px] rounded-full p-[3px] [@container(min-width:90rem)]:-ms-[34px] [@container(min-width:90rem)]:-mt-[34px] [@container(min-width:90rem)]:size-[68px] [@container(min-width:90rem)]:p-1",
                    place.ring
                  )}
                >
                  <div className="relative size-full overflow-hidden rounded-full bg-muted">
                    {photo ? (
                      <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroOrbitTrackCopy = COPY

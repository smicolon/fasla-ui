"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Photo Constellation Hero.
 *
 * A centred pitch on a dark band, ringed by a loose scatter of photo tiles:
 * a frosted pill, a two-line headline, a paragraph and a light button. Each
 * tile has its own size and place, and some are dimmed to 55%, so the field
 * reads as near and far.
 *
 * Desktop scatters fourteen tiles over the whole block, around and behind
 * the copy; the one at the bottom start corner runs off the block's foot, as
 * Figma's does. Tablet keeps the first nine, five along the top and four
 * along the foot, smaller, with the copy centred between them; Mobile keeps
 * the first eight, four and four, and its button runs full width.
 *
 * The band is the inverse background in both modes, a deliberate contrast
 * band rather than a photo, so the inverse tokens carry it with no `dark:`
 * switch.
 *
 * In Arabic the scatter mirrors: the first tile stands at the top right.
 * The photographs themselves are never flipped.
 *
 * Each tile's place is Figma's: its start and top edges as shares of the
 * field, its size in px and whether it is dimmed, held in the tile's own
 * `--hero-tile-*` variables. The tiles are placed from the inline start, so
 * the same numbers draw the mirrored scatter in Arabic.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the width its tile places are measured
 * on. Narrower, the fourteen tiles crowd the copy, so Tablet's layout covers
 * 768 to 1439.
 */

export interface HeroPhotoConstellationAction {
  label: React.ReactNode
  href: string
}

export interface HeroPhotoConstellationPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroPhotoConstellationCopy {
  /** The frosted pill above the headline. Hidden when empty. */
  label: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The light button. */
  action: HeroPhotoConstellationAction
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroPhotoConstellationCopy> = {
  en: {
    label: "Introducing shared collections",
    headline: "Your space for\neveryday inspiration.",
    description: "Discover, save and share the images and ideas that move your work forward.",
    action: { label: "Join for free", href: "#join" },
  },
  ar: {
    label: "جديد: المجموعات المشتركة",
    headline: "مساحتك\nللإلهام كل يوم.",
    description: "اكتشف الصور والأفكار التي تدفع عملك إلى الأمام، واحفظها وشاركها.",
    action: { label: "انضم مجانًا", href: "#join" },
  },
}

/** A tile in Figma's px: its start and top edges in the field, its size, and whether it is dimmed to 55%. */
type Place = { x: number; y: number; w: number; h: number; dim?: boolean }

/** The field each breakpoint's places are measured in: Figma's frame, width × height. */
const FIELD = { d: [1440, 900], t: [768, 960], m: [360, 760] } as const

/**
 * The fourteen tiles in Figma's order, from the top start corner. Tablet
 * shows tiles 1–9, Mobile 1–8.
 */
const PLACES: { desktop: Place; tablet?: Place; mobile?: Place }[] = [
  { desktop: { x: 40, y: 40, w: 150, h: 190 }, tablet: { x: 24, y: 40, w: 120, h: 150 }, mobile: { x: 16, y: 24, w: 72, h: 90 } },
  { desktop: { x: 250, y: 110, w: 120, h: 150, dim: true }, tablet: { x: 176, y: 24, w: 90, h: 70, dim: true }, mobile: { x: 108, y: 16, w: 64, h: 52, dim: true } },
  { desktop: { x: 430, y: 30, w: 140, h: 110 }, tablet: { x: 330, y: 56, w: 110, h: 88 }, mobile: { x: 200, y: 32, w: 64, h: 80 } },
  { desktop: { x: 880, y: 40, w: 130, h: 170 }, tablet: { x: 500, y: 24, w: 96, h: 124 }, mobile: { x: 284, y: 20, w: 60, h: 76, dim: true } },
  { desktop: { x: 1080, y: 90, w: 170, h: 130 }, tablet: { x: 640, y: 64, w: 104, h: 130, dim: true }, mobile: { x: 16, y: 640, w: 64, h: 80, dim: true } },
  { desktop: { x: 1300, y: 30, w: 120, h: 160, dim: true }, tablet: { x: 24, y: 770, w: 110, h: 140, dim: true }, mobile: { x: 110, y: 684, w: 72, h: 60 } },
  { desktop: { x: 60, y: 330, w: 130, h: 130, dim: true }, tablet: { x: 180, y: 840, w: 110, h: 90 }, mobile: { x: 200, y: 650, w: 64, h: 84 } },
  { desktop: { x: 1260, y: 300, w: 150, h: 200 }, tablet: { x: 470, y: 800, w: 120, h: 100 }, mobile: { x: 284, y: 676, w: 60, h: 64, dim: true } },
  { desktop: { x: 110, y: 560, w: 150, h: 190 }, tablet: { x: 630, y: 760, w: 110, h: 150 } },
  { desktop: { x: 30, y: 790, w: 140, h: 150, dim: true } },
  { desktop: { x: 480, y: 720, w: 130, h: 170 } },
  { desktop: { x: 840, y: 740, w: 150, h: 120 } },
  { desktop: { x: 1070, y: 610, w: 160, h: 210 } },
  { desktop: { x: 1290, y: 720, w: 130, h: 160, dim: true } },
]

/** A breakpoint's place as the tile's custom properties; a hidden tile gets none. */
function placeVars(prefix: keyof typeof FIELD, place?: Place): Record<string, string> {
  if (!place) return {}
  const [width, height] = FIELD[prefix]
  return {
    [`--hero-tile-${prefix}x`]: `${(place.x / width) * 100}%`,
    [`--hero-tile-${prefix}y`]: `${(place.y / height) * 100}%`,
    [`--hero-tile-${prefix}w`]: `${place.w}px`,
    [`--hero-tile-${prefix}h`]: `${place.h}px`,
    [`--hero-tile-${prefix}o`]: place.dim ? "0.55" : "1",
  }
}

export interface HeroPhotoConstellationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroPhotoConstellationCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The fourteen tile photos, in Figma's order from the top start corner.
   * Tablet shows the first nine, Mobile the first eight. Photos past the
   * fourteenth are not shown. None by default: `muted` tiles.
   * @default none: `muted` placeholders
   */
  photos?: HeroPhotoConstellationPhoto[]
}

export function HeroPhotoConstellation({
  locale = "en",
  label,
  headline,
  description,
  action,
  photos,
  className,
  ...props
}: HeroPhotoConstellationProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const pill = label ?? copy.label
  const button = action ?? copy.action

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden [container-type:inline-size] bg-background-inverse", className)}
      {...props}
    >
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col justify-center px-4 py-8 [@container(min-width:48rem)]:min-h-[960px] [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:min-h-[900px] [@container(min-width:90rem)]:justify-start [@container(min-width:90rem)]:px-[220px] [@container(min-width:90rem)]:pb-20 [@container(min-width:90rem)]:pt-[290px]">

        <div className="relative z-10 flex w-full flex-col items-center gap-6 text-center">
          {pill ? (
            <p className="whitespace-nowrap rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-medium text-foreground-inverse">{pill}</p>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-5xl font-medium text-foreground-inverse [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-8xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-balance text-base text-muted-foreground-inverse [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[560px]">
            {description ?? copy.description}
          </p>
          <a
            href={button.href}
            className={cn(buttonVariants({ variant: "secondary", size: "lg", radius: "rounded" }), "w-full [@container(min-width:48rem)]:w-auto")}
          >
            {button.label}
          </a>
        </div>

        {/*
         * The field: the whole block, behind the copy. It comes after the
         * copy in the source, so a screen reader reaches the headline before
         * fourteen photos.
         */}
        <ul className="absolute inset-0">
          {PLACES.map((place, index) => {
            const photo = photos?.[index]
            return (
              <li
                key={index}
                style={
                  {
                    ...placeVars("d", place.desktop),
                    ...placeVars("t", place.tablet),
                    ...placeVars("m", place.mobile),
                  } as React.CSSProperties
                }
                className={cn(
                  "absolute overflow-hidden rounded-md bg-muted",
                  "start-[var(--hero-tile-mx)] top-[var(--hero-tile-my)] h-[var(--hero-tile-mh)] w-[var(--hero-tile-mw)] opacity-[var(--hero-tile-mo)]",
                  "[@container(min-width:48rem)]:start-[var(--hero-tile-tx)] [@container(min-width:48rem)]:top-[var(--hero-tile-ty)] [@container(min-width:48rem)]:h-[var(--hero-tile-th)] [@container(min-width:48rem)]:w-[var(--hero-tile-tw)] [@container(min-width:48rem)]:opacity-[var(--hero-tile-to)]",
                  "[@container(min-width:90rem)]:start-[var(--hero-tile-dx)] [@container(min-width:90rem)]:top-[var(--hero-tile-dy)] [@container(min-width:90rem)]:h-[var(--hero-tile-dh)] [@container(min-width:90rem)]:w-[var(--hero-tile-dw)] [@container(min-width:90rem)]:opacity-[var(--hero-tile-do)]",
                  !place.mobile && "hidden",
                  !place.tablet && "[@container(min-width:48rem)]:hidden",
                  !place.mobile && place.tablet && "[@container(min-width:48rem)]:block",
                  "[@container(min-width:90rem)]:block"
                )}
              >
                {photo ? (
                  <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroPhotoConstellationCopy = COPY

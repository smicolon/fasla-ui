"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Arc Gallery Hero.
 *
 * A centred headline under a rainbow of photo cards. The cards stand on an
 * arc, each turned to follow it, from 70° at the start end through upright at
 * the top to −70° at the other; a single button and three short features
 * with thin lines between them sit under the headline.
 *
 * Desktop fans eleven 140 × 176 cards over the whole block, behind the copy.
 * Tablet shows the middle seven, at 100 × 126, and Mobile the five from the
 * third, at 64 × 80; on both the arc is its own band above the copy, and its
 * two end cards run off the block's edges, as Figma's do. Mobile stacks the
 * features and drops the lines.
 *
 * In Arabic the arc mirrors: the first card stands at the right end and the
 * turns reverse. The photographs themselves are never flipped.
 *
 * Each card's place is Figma's: its centre as a share of the arc's width,
 * and its height in px, held in the card's own `--hero-arc-*` variables. The
 * cards are placed from the inline start, so the same numbers draw the
 * mirrored arc in Arabic.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the width its card places are measured
 * on. Narrower, the eleven cards crowd together, so Tablet's layout covers
 * 768 to 1439.
 */

export interface HeroArcGalleryAction {
  label: React.ReactNode
  href: string
}

export interface HeroArcGalleryPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroArcGalleryFeature {
  title: React.ReactNode
  description: React.ReactNode
}

export interface HeroArcGalleryCopy {
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  action: HeroArcGalleryAction
  /** The features under the button. Figma shows three. */
  features: HeroArcGalleryFeature[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroArcGalleryCopy> = {
  en: {
    headline: "Stunning visuals,\ncreated in seconds.",
    description: "Describe what you need and get polished, on-brand images ready for every channel.",
    action: { label: "Start creating", href: "#start" },
    features: [
      { title: "Realistic results", description: "Photos that look professionally shot." },
      { title: "Fast generation", description: "From idea to image in seconds." },
      { title: "Many styles", description: "Editorial, product and lifestyle." },
    ],
  },
  ar: {
    headline: "صور مبهرة\nفي ثوانٍ معدودة.",
    description: "صِف ما تحتاجه، واحصل على صور متقنة تناسب علامتك وجاهزة لكل منصة.",
    action: { label: "ابدأ الإنشاء", href: "#start" },
    features: [
      { title: "نتائج واقعية", description: "صور تبدو كأنها التُقطت باحتراف." },
      { title: "إنشاء سريع", description: "من الفكرة إلى الصورة في ثوانٍ." },
      { title: "أساليب متعددة", description: "تحريرية، ومنتجات، وأسلوب حياة." },
    ],
  },
}

type Place = { x: number; y: number; turn: number }

/**
 * The eleven cards in Figma's order, from the start end of the arc. `x` is the
 * card's centre as a percentage of the arc's width, `y` its centre in px from
 * the arc's top and `turn` its rotation in degrees. Desktop's arc is the whole
 * block; Tablet's and Mobile's are their 720 and 328px bands. Tablet shows
 * cards 3–9, Mobile 3–7.
 */
const PLACES: { desktop: Place; tablet?: Place; mobile?: Place }[] = [
  { desktop: { x: 8.264, y: 731, turn: 70 } },
  { desktop: { x: 13.125, y: 592, turn: 56 } },
  { desktop: { x: 20.278, y: 474, turn: 42 }, tablet: { x: -0.556, y: 283, turn: 60 }, mobile: { x: -2.439, y: 140, turn: 55 } },
  { desktop: { x: 29.167, y: 385, turn: 28 }, tablet: { x: 12.5, y: 171, turn: 40 }, mobile: { x: 20.427, y: 74, turn: 27.5 } },
  { desktop: { x: 39.236, y: 329, turn: 14 }, tablet: { x: 30, y: 98, turn: 20 }, mobile: { x: 50, y: 50, turn: 0 } },
  { desktop: { x: 50, y: 310, turn: 0 }, tablet: { x: 50, y: 73, turn: 0 }, mobile: { x: 79.573, y: 74, turn: -27.5 } },
  { desktop: { x: 60.764, y: 329, turn: -14 }, tablet: { x: 70, y: 98, turn: -20 }, mobile: { x: 102.439, y: 140, turn: -55 } },
  { desktop: { x: 70.833, y: 385, turn: -28 }, tablet: { x: 87.5, y: 171, turn: -40 } },
  { desktop: { x: 79.722, y: 474, turn: -42 }, tablet: { x: 100.556, y: 283, turn: -60 } },
  { desktop: { x: 86.875, y: 592, turn: -56 } },
  { desktop: { x: 91.736, y: 731, turn: -70 } },
]

/** A breakpoint's place as the card's custom properties; a hidden card gets none. */
function placeVars(prefix: string, place?: Place): Record<string, string> {
  if (!place) return {}
  return {
    [`--hero-arc-${prefix}x`]: `${place.x}%`,
    [`--hero-arc-${prefix}y`]: `${place.y}px`,
    [`--hero-arc-${prefix}turn`]: `${place.turn}deg`,
  }
}

export interface HeroArcGalleryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroArcGalleryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The eleven card photos, in Figma's order from the start end of the arc.
   * Tablet shows the third to the ninth, Mobile the third to the seventh.
   * Photos past the eleventh are not shown. None by default: `muted` cards.
   * @default none: `muted` placeholders
   */
  photos?: HeroArcGalleryPhoto[]
}

export function HeroArcGallery({
  locale = "en",
  headline,
  description,
  action,
  features,
  photos,
  className,
  ...props
}: HeroArcGalleryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const button = action ?? copy.action
  const items = features ?? copy.features

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden [container-type:inline-size] bg-background", className)}
      {...props}
    >
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col items-center gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-[18px] [@container(min-width:90rem)]:px-20 [@container(min-width:90rem)]:pb-[54px] [@container(min-width:90rem)]:pt-[500px]">

        <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-5 text-center">
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="max-w-[480px] text-balance text-base text-muted-foreground [@container(min-width:48rem)]:max-w-none [@container(min-width:90rem)]:max-w-[480px]">
            {description ?? copy.description}
          </p>
          <a href={button.href} className={cn(buttonVariants({ size: "lg", radius: "rounded" }), "w-full [@container(min-width:48rem)]:w-auto")}>
            {button.label}
          </a>
        </div>

        {/*
         * The arc: an in-flow band on Mobile and Tablet, the whole block
         * behind the copy on Desktop. It comes after the copy in the
         * source, so a screen reader reaches the headline before eleven
         * photos, and `order-first` draws it on top.
         */}
        <ul className="relative order-first h-[200px] w-full [@container(min-width:48rem)]:h-[366px] [@container(min-width:90rem)]:absolute [@container(min-width:90rem)]:inset-0 [@container(min-width:90rem)]:h-auto">
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
                  "absolute overflow-hidden rounded-xl bg-muted shadow-lg",
                  // Placed by its centre: the start offset less half the card.
                  "start-[var(--hero-arc-mx)] top-[var(--hero-arc-my)] -ms-8 -mt-10 h-20 w-16 rotate-[var(--hero-arc-mturn)] [&:dir(rtl)]:rotate-[calc(var(--hero-arc-mturn)*-1)]",
                  "[@container(min-width:48rem)]:start-[var(--hero-arc-tx)] [@container(min-width:48rem)]:top-[var(--hero-arc-ty)] [@container(min-width:48rem)]:-ms-[50px] [@container(min-width:48rem)]:-mt-[63px] [@container(min-width:48rem)]:h-[126px] [@container(min-width:48rem)]:w-[100px] [@container(min-width:48rem)]:rotate-[var(--hero-arc-tturn)] [@container(min-width:48rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-arc-tturn)*-1)]",
                  "[@container(min-width:90rem)]:start-[var(--hero-arc-dx)] [@container(min-width:90rem)]:top-[var(--hero-arc-dy)] [@container(min-width:90rem)]:-ms-[70px] [@container(min-width:90rem)]:-mt-[88px] [@container(min-width:90rem)]:h-44 [@container(min-width:90rem)]:w-[140px] [@container(min-width:90rem)]:rounded-3xl [@container(min-width:90rem)]:rotate-[var(--hero-arc-dturn)] [@container(min-width:90rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-arc-dturn)*-1)]",
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

        <ul className="relative z-10 grid w-full gap-8 text-center [@container(min-width:48rem)]:max-w-[720px] [@container(min-width:48rem)]:grid-cols-3 [@container(min-width:48rem)]:gap-16">
          {items.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex min-w-0 flex-col gap-1",
                // A plain 1px line, centred in the gap, where Figma draws its
                // Separator. Swap in Separator once it is built.
                index > 0 &&
                  "[@container(min-width:48rem)]:before:absolute [@container(min-width:48rem)]:before:-ms-8 [@container(min-width:48rem)]:before:h-12 [@container(min-width:48rem)]:before:w-px [@container(min-width:48rem)]:before:bg-border"
              )}
            >
              <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroArcGalleryCopy = COPY

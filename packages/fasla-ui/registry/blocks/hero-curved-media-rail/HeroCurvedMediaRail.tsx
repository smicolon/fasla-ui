"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Curved Media Rail Hero.
 *
 * A centred pitch over a rail of tall rounded media cards: a badge, the
 * headline, a paragraph, then the cards in a row whose ends curve upward and
 * outward. Every card shares one centre line; the outer ones are taller and
 * turned further, from −7° at the start end through upright in the middle
 * to 7° at the other, so the rail bows like a lens. One button sits under
 * the rail.
 *
 * Desktop draws seven 176px-wide cards across the whole block, a handwritten
 * "Made for you" note with a curved arrow beside the headline, and a small
 * "it's free" line beside the button. Tablet shows the middle five, 136px
 * wide, and Mobile the middle three, 104px wide; both leave out the note and
 * the free line, and Mobile's button spans the width. The end cards run a
 * little past the rail's edges, as Figma's do.
 *
 * In Arabic the rail mirrors: the first card stands at the right end and the
 * turns reverse. The note, its arrow and the free line move to the other
 * side and tilt the other way. The photographs are never flipped, and the
 * badge's number stays left to right.
 *
 * Each card's place is Figma's: its centre as a share of the rail's width,
 * its height and its turn, held in the card's own `--hero-rail-*` variables.
 * The cards are placed from the inline start, so the same numbers draw the
 * mirrored rail in Arabic.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the width its card places and the note
 * are measured on. Narrower, the seven cards crowd together, so Tablet's
 * layout covers 768 to 1439.
 */

export interface HeroCurvedMediaRailAction {
  label: React.ReactNode
  href: string
}

export interface HeroCurvedMediaRailPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroCurvedMediaRailCopy {
  /** The badge above the headline. Hidden when empty. */
  badge: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button under the rail. */
  action: HeroCurvedMediaRailAction
  /**
   * The handwritten note beside the headline, with its arrow. Decorative,
   * hidden from assistive technology; Desktop only. Hidden when empty.
   */
  note: React.ReactNode
  /** The small line beside the button. Desktop only. Hidden when empty. */
  freeNote: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroCurvedMediaRailCopy> = {
  en: {
    badge: (
      <>
        Short videos from <bdi dir="ltr">2,000+</bdi> vetted creators
      </>
    ),
    headline: "Stories that\nstop the scroll",
    description: "Videos made for your brand by real creators, ready for every channel in days.",
    action: { label: "Get started", href: "#start" },
    note: "Made for you",
    freeNote: "it’s free",
  },
  ar: {
    badge: (
      <>
        فيديوهات قصيرة من أكثر من <bdi dir="ltr">2,000</bdi> مبدع موثوق
      </>
    ),
    headline: "قصص توقف\nالتمرير",
    description: "فيديوهات يصنعها مبدعون حقيقيون لعلامتك، جاهزة لكل منصة خلال أيام.",
    action: { label: "ابدأ الآن", href: "#start" },
    note: "مصنوعة لك",
    freeNote: "مجانًا",
  },
}

type Place = { x: number; h: number; turn: number }

/**
 * The seven cards in Figma's order, from the start end of the rail. `x` is
 * the card's centre as a percentage of the rail's width, `h` its height in
 * px and `turn` its rotation in degrees; every card is centred on the same
 * line. Desktop's rail is the whole block, 1440px; Tablet's and Mobile's are
 * 720 and 328px. Tablet shows cards 2–6, Mobile 3–5.
 */
const PLACES: { desktop: Place; tablet?: Place; mobile?: Place }[] = [
  { desktop: { x: 7.639, h: 290, turn: -7 } },
  { desktop: { x: 22.222, h: 250, turn: -4 }, tablet: { x: 9.444, h: 240, turn: -6 } },
  { desktop: { x: 36.458, h: 220, turn: -1.5 }, tablet: { x: 29.722, h: 210, turn: -3 }, mobile: { x: 15.854, h: 200, turn: -5 } },
  { desktop: { x: 50, h: 210, turn: 0 }, tablet: { x: 50, h: 190, turn: 0 }, mobile: { x: 50, h: 180, turn: 0 } },
  { desktop: { x: 63.542, h: 220, turn: 1.5 }, tablet: { x: 70.278, h: 210, turn: 3 }, mobile: { x: 84.146, h: 200, turn: 5 } },
  { desktop: { x: 77.778, h: 250, turn: 4 }, tablet: { x: 90.556, h: 240, turn: 6 } },
  { desktop: { x: 92.361, h: 290, turn: 7 } },
]

/** A breakpoint's place as the card's custom properties; a hidden card gets none. */
function placeVars(prefix: string, place?: Place): Record<string, string> {
  if (!place) return {}
  return {
    [`--hero-rail-${prefix}x`]: `${place.x}%`,
    [`--hero-rail-${prefix}h`]: `${place.h}px`,
    [`--hero-rail-${prefix}turn`]: `${place.turn}deg`,
  }
}

export interface HeroCurvedMediaRailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroCurvedMediaRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The seven card photos, in Figma's order from the start end of the rail.
   * Tablet shows the second to the sixth, Mobile the third to the fifth.
   * Photos past the seventh are not shown. None by default: `background`
   * cards on the muted section.
   * @default none: `background` placeholders
   */
  photos?: HeroCurvedMediaRailPhoto[]
}

export function HeroCurvedMediaRail({
  locale = "en",
  badge,
  headline,
  description,
  action,
  note,
  freeNote,
  photos,
  className,
  ...props
}: HeroCurvedMediaRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = badge ?? copy.badge
  const button = action ?? copy.action
  const aside = note ?? copy.note
  const free = freeNote ?? copy.freeNote

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden [container-type:inline-size] bg-muted", className)}
      {...props}
    >
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="relative mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col items-center gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-0 [@container(min-width:90rem)]:px-0 [@container(min-width:90rem)]:pb-12 [@container(min-width:90rem)]:pt-16">
        <div className="flex w-full max-w-[900px] flex-col items-center gap-5 text-center">
          {label ? (
            <Badge variant="soft" tone="warning" size="md" radius="rounded">
              {label}
            </Badge>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-balance text-base text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[560px]">
            {description ?? copy.description}
          </p>
        </div>

        {/*
         * The handwritten note and its arrow, beside the headline's end on
         * Desktop only. Placed from the inline start of the 1440px block, so
         * Arabic puts them on the left; the arrow mirrors and the note tilts
         * the other way.
         */}
        {aside ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden [@container(min-width:90rem)]:block">
            <span className="absolute start-[1108px] top-[236px] whitespace-nowrap text-sm font-medium text-muted-foreground rotate-[8deg] [&:dir(rtl)]:-rotate-[8deg]">
              {aside}
            </span>
            <svg
              viewBox="0 0 54 80"
              fill="none"
              className="absolute start-[1150px] top-[262px] h-20 w-[54px] overflow-visible text-muted-foreground [&:dir(rtl)]:-scale-x-100"
            >
              <path d="M 0 0 C 30 10 50 40 44 80 M 44 80 L 34 68 M 44 80 L 54 66" stroke="currentColor" strokeWidth={1.5} />
            </svg>
          </div>
        ) : null}

        {/*
         * The rail: a band 220px tall on Mobile, 260 on Tablet and 450 on
         * Desktop, where it fills the space between the copy and the button
         * and its centre line sits 278px down, as Figma's does.
         */}
        <ul className="relative h-[220px] w-full [@container(min-width:48rem)]:h-[260px] [@container(min-width:90rem)]:h-[450px]">
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
                  "absolute overflow-hidden rounded-3xl bg-background shadow-lg",
                  // Placed by its centre: the start offset less half the card, and half its height up.
                  "start-[var(--hero-rail-mx)] top-1/2 -ms-[52px] h-[var(--hero-rail-mh)] w-[104px] -translate-y-1/2 rotate-[var(--hero-rail-mturn)] [&:dir(rtl)]:rotate-[calc(var(--hero-rail-mturn)*-1)]",
                  "[@container(min-width:48rem)]:start-[var(--hero-rail-tx)] [@container(min-width:48rem)]:-ms-[68px] [@container(min-width:48rem)]:h-[var(--hero-rail-th)] [@container(min-width:48rem)]:w-[136px] [@container(min-width:48rem)]:rotate-[var(--hero-rail-tturn)] [@container(min-width:48rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-rail-tturn)*-1)]",
                  "[@container(min-width:90rem)]:start-[var(--hero-rail-dx)] [@container(min-width:90rem)]:top-[278px] [@container(min-width:90rem)]:-ms-[88px] [@container(min-width:90rem)]:h-[var(--hero-rail-dh)] [@container(min-width:90rem)]:w-44 [@container(min-width:90rem)]:rotate-[var(--hero-rail-dturn)] [@container(min-width:90rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-rail-dturn)*-1)]",
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

        <div className="relative flex w-full justify-center [@container(min-width:48rem)]:w-auto">
          <a href={button.href} className={cn(buttonVariants({ size: "lg", radius: "rounded" }), "w-full [@container(min-width:48rem)]:w-auto")}>
            {button.label}
          </a>
          {/* Desktop only: tilted, 149px before the button's centre and a little below its top. */}
          {free ? (
            <p className="absolute end-[calc(50%+149px)] top-[27px] hidden whitespace-nowrap text-sm font-medium text-muted-foreground -rotate-6 [&:dir(rtl)]:rotate-6 [@container(min-width:90rem)]:block">
              {free}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroCurvedMediaRailCopy = COPY

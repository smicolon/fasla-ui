"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Inline Image Headline Hero.
 *
 * A centred, three-line headline with a picture inside the words: a small
 * pill-shaped photo after the first line's words and a dark pill around the
 * second line's first words. Under it sit a paragraph, two buttons and three
 * soft chips, and along the foot a row of photo cards, each tilted over a
 * `secondary` card turned the other way.
 *
 * Desktop shows four 240 × 300 cards and lets them run off the block's
 * bottom edge, as Figma's frame crops them. Tablet shows the first three, at
 * 196 × 244, and Mobile the first two, at 132 × 168, both whole; Mobile also
 * stacks the buttons at full width and wraps the chips.
 *
 * The card row is in the flow, under the chips, never behind them. Cairo's
 * taller lines make the Arabic headline taller, and the row moves down with
 * it rather than covering the copy, as Figma's RTL Desktop moves it. On
 * Desktop the row starts 32px under the chips in both languages (Figma puts
 * it 26px under in English, 35 in Arabic). Where Figma's Desktop frame stays
 * 900px tall and crops the Arabic cards further, the block here grows by the
 * difference, so the cards show as much in Arabic as in English.
 *
 * In Arabic the headline's photo and pill keep their places in the reading
 * order, so the photo ends the first line on the left and the pill opens the
 * second on the right. The card row mirrors: the first card stands at the
 * right end and every tilt reverses. The photographs themselves are never
 * flipped.
 *
 * Each card's place is Figma's: its centre as px from the row's middle and
 * from its top, and its turn in degrees, held in the card's own
 * `--hero-card-*` variables. They are measured from the inline start, so the
 * same numbers draw the mirrored row in Arabic.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroInlineImageHeadlineAction {
  label: React.ReactNode
  href: string
}

export interface HeroInlineImageHeadlinePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroInlineImageHeadlineCopy {
  /**
   * The headline, an `h1`, in its parts: the first line, which the photo
   * follows; the words in the dark pill that open the second line; the rest
   * of the second line; and the last line.
   */
  headline: { start: React.ReactNode; accent: React.ReactNode; rest: React.ReactNode; end: React.ReactNode }
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroInlineImageHeadlineAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: HeroInlineImageHeadlineAction | null
  /** The soft chips under the buttons. Figma shows three. */
  chips: React.ReactNode[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroInlineImageHeadlineCopy> = {
  en: {
    headline: { start: "Put your brand", accent: "in front", rest: "of the people", end: "who matter most." },
    description: "Branded samples and gifts, delivered to the customers you want to reach first.",
    primaryAction: { label: "Launch a campaign", href: "#campaign" },
    secondaryAction: { label: "How it works", href: "#how-it-works" },
    chips: ["Free samples", "Fast delivery", "Real results"],
  },
  ar: {
    headline: { start: "ضع علامتك", accent: "أمام", rest: "الأشخاص", end: "الأهم لديك." },
    description: "عينات وهدايا تحمل علامتك، تصل إلى العملاء الذين تريد الوصول إليهم أولًا.",
    primaryAction: { label: "أطلق حملة", href: "#campaign" },
    secondaryAction: { label: "طريقة العمل", href: "#how-it-works" },
    chips: ["عينات مجانية", "توصيل سريع", "نتائج حقيقية"],
  },
}

/** A card's centre, in px from the row's middle (`x`) and its top (`y`), and its turn in degrees, clockwise. */
type Place = { x: number; y: number; turn: number }

/** A photo card and the `secondary` card behind it. */
type Pair = { photo: Place; back: Place }

/**
 * The four cards in Figma's order, from the start end of the row. Desktop's
 * row is 1200px wide, Tablet's 720 and Mobile's 328. Tablet shows cards 1–3,
 * Mobile 1–2.
 */
const CARDS: { desktop: Pair; tablet?: Pair; mobile?: Pair }[] = [
  {
    desktop: { photo: { x: -456.3, y: 181.7, turn: 6 }, back: { x: -422.3, y: 167.5, turn: -3 } },
    tablet: { photo: { x: -273, y: 150.1, turn: 5 }, back: { x: -243.7, y: 137, turn: -5 } },
    mobile: { photo: { x: -104, y: 108.4, turn: 4 }, back: { x: -84.3, y: 103.2, turn: -4 } },
  },
  {
    desktop: { photo: { x: -132.3, y: 163.5, turn: -3 }, back: { x: -140.8, y: 182, turn: 4 } },
    tablet: { photo: { x: 4.2, y: 138.5, turn: -2 }, back: { x: 3.7, y: 149.3, turn: 2 } },
    mobile: { photo: { x: 103.7, y: 99.2, turn: -4 }, back: { x: 100, y: 112.4, turn: 4 } },
  },
  {
    desktop: { photo: { x: 152, y: 176.1, turn: 3 }, back: { x: 182.6, y: 163, turn: -5 } },
    tablet: { photo: { x: 272.3, y: 133, turn: -5 }, back: { x: 259, y: 154.1, turn: 5 } },
  },
  {
    desktop: { photo: { x: 475, y: 156.6, turn: -6 }, back: { x: 462, y: 180.1, turn: 3 } },
  },
]

/** A breakpoint's places as the card's custom properties; a hidden card gets none. */
function placeVars(prefix: string, pair?: Pair): Record<string, string> {
  if (!pair) return {}
  const vars: Record<string, string> = {}
  for (const [part, place] of [
    ["p", pair.photo],
    ["b", pair.back],
  ] as const) {
    vars[`--hero-card-${prefix}${part}x`] = `${place.x}px`
    vars[`--hero-card-${prefix}${part}y`] = `${place.y}px`
    vars[`--hero-card-${prefix}${part}turn`] = `${place.turn}deg`
  }
  return vars
}

export interface HeroInlineImageHeadlineProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroInlineImageHeadlineCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The pill-shaped photo inside the headline's first line. It sits inside
   * the `h1`, so its `alt` is read as part of the heading: pass "" unless it
   * adds to it. None by default: a `muted` pill.
   * @default none: a `muted` placeholder
   */
  photo?: HeroInlineImageHeadlinePhoto
  /**
   * The four card photos, in Figma's order from the start end of the row.
   * Tablet shows the first three, Mobile the first two. Photos past the
   * fourth are not shown. None by default: `muted` cards.
   * @default none: `muted` placeholders
   */
  photos?: HeroInlineImageHeadlinePhoto[]
}

export function HeroInlineImageHeadline({
  locale = "en",
  headline,
  description,
  primaryAction,
  secondaryAction,
  chips,
  photo,
  photos,
  className,
  ...props
}: HeroInlineImageHeadlineProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const lines = headline ?? copy.headline
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const labels = chips ?? copy.chips

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
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col items-center gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-8 [@container(min-width:90rem)]:px-[120px] [@container(min-width:90rem)]:pb-0 [@container(min-width:90rem)]:pt-[88px]">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          {/*
           * The spaces between the parts are for the heading's accessible
           * name; a flex container drops them from the layout, and the gaps
           * space the words.
           */}
          <h1
            id={headingId}
            className="flex flex-col items-center text-4xl font-semibold text-foreground [@container(min-width:48rem)]:gap-1 [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-8xl"
          >
            <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>{lines.start}</span>{" "}
              <span className="relative h-12 w-[88px] shrink-0 overflow-hidden rounded-full bg-muted [@container(min-width:48rem)]:h-[72px] [@container(min-width:48rem)]:w-[132px] [@container(min-width:90rem)]:h-[92px] [@container(min-width:90rem)]:w-[176px]">
                {photo ? (
                  <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                ) : null}
              </span>
            </span>{" "}
            <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {/* An inverse band on purpose, not a photo: dark in light mode and light in dark. */}
              <span className="rounded-full bg-background-inverse px-6 pb-1 text-foreground-inverse">{lines.accent}</span>{" "}
              <span>{lines.rest}</span>
            </span>{" "}
            <span>{lines.end}</span>
          </h1>
          <p className="max-w-[520px] text-balance text-base text-muted-foreground [@container(min-width:48rem)]:max-w-none [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[520px]">
            {description ?? copy.description}
          </p>
          <div className="flex w-full flex-col gap-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline", tone: "primary", size: "lg", radius: "rounded" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
          {labels.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-2">
              {labels.map((chip, index) => (
                <li key={index}>
                  <Badge variant="soft" tone="secondary" size="md" radius="rounded">
                    {chip}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/*
         * The card row, in the flow under the copy. On Desktop the cards are
         * taller than the row and the section's edge crops them, as Figma's
         * frame does; on Tablet and Mobile they sit whole inside it.
         */}
        <ul className="relative h-[228px] w-full shrink-0 [@container(min-width:48rem)]:h-[304px] [@container(min-width:90rem)]:h-[260px]">
          {CARDS.map((card, index) => {
            const image = photos?.[index]
            return (
              <li
                key={index}
                style={
                  {
                    ...placeVars("d", card.desktop),
                    ...placeVars("t", card.tablet),
                    ...placeVars("m", card.mobile),
                  } as React.CSSProperties
                }
                className={cn(
                  "absolute inset-0",
                  !card.mobile && "hidden",
                  !card.tablet && "[@container(min-width:48rem)]:hidden",
                  !card.mobile && card.tablet && "[@container(min-width:48rem)]:block",
                  "[@container(min-width:90rem)]:block"
                )}
              >
                {/* Placed by its centre: the start offset less half the card. */}
                <div
                  aria-hidden
                  className={cn(
                    "absolute rounded-3xl bg-secondary",
                    "start-[calc(50%+var(--hero-card-mbx))] top-[var(--hero-card-mby)] -ms-[66px] -mt-[84px] h-[168px] w-[132px] rotate-[var(--hero-card-mbturn)] [&:dir(rtl)]:rotate-[calc(var(--hero-card-mbturn)*-1)]",
                    "[@container(min-width:48rem)]:start-[calc(50%+var(--hero-card-tbx))] [@container(min-width:48rem)]:top-[var(--hero-card-tby)] [@container(min-width:48rem)]:-ms-[98px] [@container(min-width:48rem)]:-mt-[122px] [@container(min-width:48rem)]:h-[244px] [@container(min-width:48rem)]:w-[196px] [@container(min-width:48rem)]:rotate-[var(--hero-card-tbturn)] [@container(min-width:48rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-card-tbturn)*-1)]",
                    "[@container(min-width:90rem)]:start-[calc(50%+var(--hero-card-dbx))] [@container(min-width:90rem)]:top-[var(--hero-card-dby)] [@container(min-width:90rem)]:-ms-[120px] [@container(min-width:90rem)]:-mt-[150px] [@container(min-width:90rem)]:h-[300px] [@container(min-width:90rem)]:w-[240px] [@container(min-width:90rem)]:rotate-[var(--hero-card-dbturn)] [@container(min-width:90rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-card-dbturn)*-1)]"
                  )}
                />
                <div
                  className={cn(
                    "absolute overflow-hidden rounded-3xl bg-muted shadow-xl",
                    "start-[calc(50%+var(--hero-card-mpx))] top-[var(--hero-card-mpy)] -ms-[66px] -mt-[84px] h-[168px] w-[132px] rotate-[var(--hero-card-mpturn)] [&:dir(rtl)]:rotate-[calc(var(--hero-card-mpturn)*-1)]",
                    "[@container(min-width:48rem)]:start-[calc(50%+var(--hero-card-tpx))] [@container(min-width:48rem)]:top-[var(--hero-card-tpy)] [@container(min-width:48rem)]:-ms-[98px] [@container(min-width:48rem)]:-mt-[122px] [@container(min-width:48rem)]:h-[244px] [@container(min-width:48rem)]:w-[196px] [@container(min-width:48rem)]:rotate-[var(--hero-card-tpturn)] [@container(min-width:48rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-card-tpturn)*-1)]",
                    "[@container(min-width:90rem)]:start-[calc(50%+var(--hero-card-dpx))] [@container(min-width:90rem)]:top-[var(--hero-card-dpy)] [@container(min-width:90rem)]:-ms-[120px] [@container(min-width:90rem)]:-mt-[150px] [@container(min-width:90rem)]:h-[300px] [@container(min-width:90rem)]:w-[240px] [@container(min-width:90rem)]:rotate-[var(--hero-card-dpturn)] [@container(min-width:90rem)]:[&:dir(rtl)]:rotate-[calc(var(--hero-card-dpturn)*-1)]"
                  )}
                >
                  {image ? (
                    <img src={image.src} alt={image.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                  ) : null}
                </div>
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
export const heroInlineImageHeadlineCopy = COPY

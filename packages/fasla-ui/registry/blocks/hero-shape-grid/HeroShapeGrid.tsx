"use client"

import * as React from "react"
import { ArrowDownRight, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Shape Grid Hero.
 *
 * A modular playground beside the pitch. The copy: an eyebrow behind a dot,
 * a two-line headline, a paragraph, a solid button and a "how it works" link
 * with an arrow, then a strip of four colour dots with a short note. The
 * artwork: a four-by-four grid of 150px tiles under hairline guides, filled
 * with geometric shapes (a toggle, discs, quarter discs, a ring, an arch and
 * a smile) in `primary` and the chart colours, with one photo in the middle
 * four tiles, cut round at two corners, and a caption under it. Along the
 * foot, under a line, the disciplines and "your next idea starts here".
 *
 * Desktop sets the copy and the 600px grid side by side, both from the top.
 * Tablet stacks the copy over the grid, still 600px and at the start edge;
 * the foot keeps its two ends. Mobile scales the grid to the full width,
 * hides the caption (Figma hides it there), stacks a full-width button over
 * the link, centred, and stacks the foot's two lines.
 *
 * Figma colours the shapes from the raw palette (amber, orange, violet, cyan
 * and rose); here they are the theme's chart tokens nearest each hue:
 * orange `chart-1`, cyan `chart-2`, violet `chart-3` (the theme has no
 * violet), amber `chart-4` and rose `chart-5`. The colour dots use the same
 * four as their shapes. The artwork is decoration and is hidden from screen
 * readers; the photo carries the `alt` you pass. The nav row Figma draws
 * above the copy (the wordmark, links, "Log in" and "Start creating") is
 * left out: the page's own navbar does that job.
 *
 * In Arabic the copy moves to the right and the grid to the left, and the
 * artwork mirrors tile for tile, as Figma draws it; the arrows point left.
 * The photo is never flipped, and keeps the cut Figma gives it in both
 * directions: rounded at the top-left and bottom-right corners.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroShapeGridAction {
  label: React.ReactNode
  href: string
}

export interface HeroShapeGridPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroShapeGridCopy {
  /** The line above the headline, behind a dot. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroShapeGridAction
  /** The text link beside it, with an arrow. Hidden when null. */
  secondaryAction: HeroShapeGridAction | null
  /** The note beside the colour dots. The dots are hidden with it when empty. */
  note: React.ReactNode
  /** The caption under the grid. Hidden when empty, and always on Mobile. */
  caption: React.ReactNode
  /** The start of the foot: the disciplines, in one line. Hidden when empty. */
  disciplines: React.ReactNode
  /** The end of the foot, before its arrow. Hidden when empty. */
  scrollCue: React.ReactNode
}

/** Figma's copy, English and Arabic. The arrow after the last line is an icon, not part of the string. */
const COPY: Record<"en" | "ar", HeroShapeGridCopy> = {
  en: {
    eyebrow: "A LITTLE PLAY. ENDLESS POSSIBILITY.",
    headline: "Big ideas.\nNo boundaries.",
    description:
      "A space to imagine, experiment, and bring your next great idea to life. Creativity starts with a little curiosity.",
    primaryAction: { label: "Explore your creativity", href: "#start" },
    secondaryAction: { label: "See how it works", href: "#how-it-works" },
    note: "For curious minds. And everything they make.",
    caption: "IMAGINATION, IN GOOD SHAPE.",
    disciplines: "DESIGN · EXPERIMENT · COLLABORATE · CREATE",
    scrollCue: "Your next idea starts here",
  },
  ar: {
    eyebrow: "قليل من اللعب، وإمكانات بلا حدود.",
    headline: "أفكار كبيرة.\nبلا حدود.",
    description: "مساحة لتتخيّل وتجرّب وتمنح فكرتك العظيمة التالية الحياة. الإبداع يبدأ بقليل من الفضول.",
    primaryAction: { label: "أطلق إبداعك", href: "#start" },
    secondaryAction: { label: "تعرّف على طريقة العمل", href: "#how-it-works" },
    note: "للعقول الفضولية، ولكل ما تصنعه.",
    caption: "خيال في أحسن حال.",
    disciplines: "صمّم، جرّب، تعاون، أبدع",
    scrollCue: "فكرتك التالية تبدأ هنا",
  },
}

/** The colour dots, in Figma's order: amber, orange, violet, cyan. */
const SWATCHES = ["bg-chart-4", "bg-chart-1", "bg-chart-3", "bg-chart-2"] as const

/** The hairline guides, at the grid's five tile edges on each axis, in percent. */
const GUIDES = [0, 25, 50, 75, 100] as const

export interface HeroShapeGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroShapeGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo in the middle four tiles of the grid. None by default: a
   * `muted` placeholder of the same size and cut.
   * @default none: a `muted` placeholder
   */
  photo?: HeroShapeGridPhoto
}

export function HeroShapeGrid({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  note,
  caption,
  disciplines,
  scrollCue,
  photo,
  className,
  ...props
}: HeroShapeGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const strapline = note ?? copy.note
  const artworkCaption = caption ?? copy.caption
  const footStart = disciplines ?? copy.disciplines
  const footEnd = scrollCue ?? copy.scrollCue

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-8 [@container(min-width:90rem)]:px-16 [@container(min-width:90rem)]:pb-[22px] [@container(min-width:90rem)]:pt-[86px]">
        <div className="flex flex-col gap-10 [@container(min-width:48rem)]:gap-12 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-start [@container(min-width:90rem)]:gap-[50px]">
          <div className="flex min-w-0 flex-1 flex-col gap-7">
            {label ? (
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                {label}
              </p>
            ) : null}
            <h1 id={headingId} className="whitespace-pre-line text-3xl font-bold text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl">
              {headline ?? copy.headline}
            </h1>
            <p className="text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[460px]">
              {description ?? copy.description}
            </p>
            <div className="flex flex-col items-center gap-7 pt-3 [@container(min-width:48rem)]:flex-row">
              <a href={primary.href} className={cn(buttonVariants({ size: "lg", radius: "rounded" }), "w-full [@container(min-width:48rem)]:w-auto")}>
                {primary.label}
              </a>
              {secondary ? (
                <a
                  href={secondary.href}
                  className="relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-sm text-base font-medium text-foreground [outline:none] before:absolute before:-inset-x-1 before:-inset-y-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {secondary.label}
                  <ArrowRight aria-hidden className="size-6 shrink-0 [&:dir(rtl)]:-scale-x-100" />
                </a>
              ) : null}
            </div>
            {strapline ? (
              <div className="flex items-center gap-3 pt-9">
                <div aria-hidden className="flex shrink-0">
                  {SWATCHES.map((swatch, index) => (
                    <span key={swatch} className={cn("size-6 rounded-full border-2 border-background", swatch, index > 0 && "-ms-1.5")} />
                  ))}
                </div>
                <p className="min-w-0 text-pretty text-sm text-muted-foreground">{strapline}</p>
              </div>
            ) : null}
          </div>

          <div className="flex w-full max-w-[600px] flex-col gap-3.5 [@container(min-width:48rem)]:w-[600px] [@container(min-width:90rem)]:shrink-0">
            <div className="relative aspect-square w-full">
              {/*
                 * Figma's 600 × 600 artwork, tile by tile, in 150px tiles.
                 * Strokes sit inside their shapes, as Figma draws them, so
                 * the outlines are inset by half their 3px width. The whole
                 * drawing mirrors in Arabic.
                 */}
              <svg aria-hidden viewBox="0 0 600 600" className="absolute inset-0 size-full [&:dir(rtl)]:-scale-x-100">
                <g fill="none" stroke="currentColor" strokeWidth={3} className="text-primary">
                  {/* The toggle, across the first two tiles. */}
                  <rect x={1.5} y={1.5} width={297} height={147} rx={73.5} />
                  {/* The ring, bottom start. */}
                  <circle cx={75} cy={525} r={73.5} />
                  <circle cx={75} cy={525} r={33.5} />
                </g>
                <g fill="currentColor" className="text-primary">
                  <circle cx={223} cy={75} r={63} />
                  <circle cx={75} cy={225} r={75} />
                </g>
                <path d="M300 0A150 150 0 0 1 450 150H300Z" fill="currentColor" className="text-chart-3" />
                <circle cx={525} cy={75} r={75} fill="currentColor" className="text-chart-1" />
                <path d="M600 150A150 150 0 0 0 450 300H600Z" fill="currentColor" className="text-chart-4" />
                <path d="M0 300H150V450A150 150 0 0 1 0 300Z" fill="currentColor" className="text-chart-2" />
                {/* The arch: a stadium two tiles tall with a narrow one cut out of it. */}
                <path
                  d="M450 375A75 75 0 0 1 600 375V525A75 75 0 0 1 450 525ZM500 375A25 25 0 0 1 550 375V525A25 25 0 0 1 500 525Z"
                  fillRule="evenodd"
                  fill="currentColor"
                  className="text-chart-2"
                />
                {/* The smile: a half ring under the photo. */}
                <path d="M150 450H225A75 75 0 0 0 375 450H450A150 150 0 0 1 150 450Z" fill="currentColor" className="text-chart-5" />
              </svg>

              {/*
                 * The middle four tiles. Figma rounds the photo's top-left and
                 * bottom-right corners in both directions: the photo, and its
                 * cut, do not mirror.
                 */}
              <div className="absolute start-1/4 top-1/4 size-1/2 overflow-hidden rounded-br-[50%] rounded-tl-[50%] bg-muted">
                {photo ? (
                  <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                ) : null}
              </div>

              {/* The hairline guides, over everything, as Figma layers them. Each sits on the far side of its tile edge. */}
              {GUIDES.map((at) => (
                <React.Fragment key={at}>
                  <span aria-hidden style={{ top: `${at}%` }} className="absolute start-0 h-px w-full bg-border" />
                  <span aria-hidden style={{ insetInlineStart: `${at}%` }} className="absolute top-0 h-full w-px bg-border" />
                </React.Fragment>
              ))}
            </div>
            {artworkCaption ? (
              <p className="hidden ps-[322px] text-xxs font-medium text-primary [@container(min-width:48rem)]:block">{artworkCaption}</p>
            ) : null}
          </div>
        </div>

        {footStart || footEnd ? (
          <div className="flex flex-col border-t border-border pt-5 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-start [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-6">
            {footStart ? <p className="text-sm font-medium text-foreground">{footStart}</p> : null}
            {footEnd ? (
              <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                {footEnd}
                <ArrowDownRight aria-hidden className="size-4 shrink-0 [&:dir(rtl)]:-scale-x-100" />
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroShapeGridCopy = COPY

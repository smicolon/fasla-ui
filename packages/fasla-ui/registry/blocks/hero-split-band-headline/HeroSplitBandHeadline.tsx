"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Split Band Headline Hero.
 *
 * A story opener in two parts. On top, a rounded band split down the middle:
 * the start half is `info` and holds an inset photo, the end half is a
 * photo, and one huge word sits across the split. A counter and two small
 * arrow buttons sit at the band's bottom end corner. Below the band, a solid
 * badge, the headline and a paragraph.
 *
 * Desktop draws the band 600px tall with a 440 × 480 inset photo and the
 * story 900px wide, set in from the band's start edge. Tablet keeps the split
 * at 440px tall with a 300 × 340 inset photo and runs the story the full
 * width. Mobile drops the coloured half and the inset photo: the photo fills
 * the whole 380px band, the word laid over it.
 *
 * In Arabic the band mirrors: the coloured half and its inset photo move to
 * the right, the photo half to the left, and the controls to the bottom-left
 * corner, the counter on their right and the arrows pointing the other way.
 * Numbers stay left to right. The photos are never flipped.
 *
 * The word and the counter stay light in both modes, as Figma draws them:
 * they sit on a photograph, which does not change with the theme. In light
 * mode that is the inverse token; in dark mode the page's own `foreground`
 * holds the same colour, so `dark:` switches to it. Both photos carry the
 * backdrop overlay as a scrim: the word crosses them, and over a bright
 * photo light type would not read. In dark mode `info` turns pale, so the
 * coloured half takes it at 50% over the page's dark ground, a deeper blue
 * that the light word reads on.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the inset photo crowds the word, so Tablet's layout
 * covers 768 to 1439.
 */

export interface HeroSplitBandHeadlineLink {
  /** The link's accessible name. The button shows only its arrow. */
  label: string
  href: string
}

export interface HeroSplitBandHeadlinePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroSplitBandHeadlineCopy {
  /** The solid badge above the headline. Hidden when empty. */
  badge: React.ReactNode
  /** The huge word across the band's split. One line: keep it short. Hidden when empty. */
  word: React.ReactNode
  /** The counter beside the arrows, such as "1 of 4". Hidden when empty. */
  counter: React.ReactNode
  /** The arrow back. Hidden when null. */
  previousLink: HeroSplitBandHeadlineLink | null
  /** The arrow forward. Hidden when null. */
  nextLink: HeroSplitBandHeadlineLink | null
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
}

/** Figma's copy, English and Arabic. The arrows' spoken names are ours: Figma only draws them. */
const COPY: Record<"en" | "ar", HeroSplitBandHeadlineCopy> = {
  en: {
    badge: "Guides",
    word: "FIELD NOTES",
    counter: (
      <>
        <bdi dir="ltr">1</bdi> OF <bdi dir="ltr">4</bdi>
      </>
    ),
    previousLink: { label: "Previous story", href: "#previous" },
    nextLink: { label: "Next story", href: "#next" },
    headline: (
      <>
        The <bdi dir="ltr">2026</bdi> guide to running better events
      </>
    ),
    description: "What changed this year, what organisers learned, and the small decisions that made the biggest difference.",
  },
  ar: {
    badge: "أدلة",
    word: "دفتر الميدان",
    counter: (
      <>
        <bdi dir="ltr">1</bdi> من <bdi dir="ltr">4</bdi>
      </>
    ),
    previousLink: { label: "القصة السابقة", href: "#previous" },
    nextLink: { label: "القصة التالية", href: "#next" },
    headline: (
      <>
        دليل <bdi dir="ltr">2026</bdi> لتنظيم فعاليات أفضل
      </>
    ),
    description: "ما الذي تغيّر هذا العام، وما الذي تعلّمه المنظمون، والقرارات الصغيرة التي صنعت الفرق الأكبر.",
  },
}

/** Figma's arrow buttons: Secondary, light on the photo in both modes. */
const ARROW = buttonVariants({ variant: "secondary", size: "icon-md", className: "dark:bg-primary dark:text-primary-foreground" })

export interface HeroSplitBandHeadlineProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroSplitBandHeadlineCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo that fills the band's end half, and the whole band on Mobile.
   * None by default: the half shows the inverse background, so the word
   * stays readable.
   * @default none: an inverse placeholder
   */
  photo?: HeroSplitBandHeadlinePhoto
  /**
   * The inset photo on the coloured half. Tablet and Desktop only. None by
   * default: a `muted` placeholder of the same size.
   * @default none: a `muted` placeholder
   */
  insetPhoto?: HeroSplitBandHeadlinePhoto
}

export function HeroSplitBandHeadline({
  locale = "en",
  badge,
  word,
  counter,
  previousLink,
  nextLink,
  headline,
  description,
  photo,
  insetPhoto,
  className,
  ...props
}: HeroSplitBandHeadlineProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = badge ?? copy.badge
  const display = word ?? copy.word
  const count = counter ?? copy.counter
  const previous = previousLink === undefined ? copy.previousLink : previousLink
  const next = nextLink === undefined ? copy.nextLink : nextLink

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:min-h-[900px] [@container(min-width:90rem)]:gap-10 [@container(min-width:90rem)]:px-12 [@container(min-width:90rem)]:pb-8 [@container(min-width:90rem)]:pt-10">
        <div className="relative isolate h-[380px] overflow-hidden rounded-3xl bg-info dark:bg-info/50 [@container(min-width:48rem)]:h-[440px] [@container(min-width:90rem)]:h-[600px]">
          {/* The photo half: the end half from Tablet up, the whole band on Mobile. */}
          <div className="absolute inset-y-0 end-0 w-full overflow-hidden bg-background-inverse dark:bg-muted [@container(min-width:48rem)]:w-1/2">
            {photo ? (
              <>
                <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-backdrop-overlay" />
              </>
            ) : null}
          </div>

          {/* The inset photo on the coloured half, where Figma places it: 30px in on Tablet, 96px on Desktop. */}
          <div className="absolute start-[30px] top-[50px] hidden h-[340px] w-[300px] overflow-hidden rounded-xl bg-muted [@container(min-width:48rem)]:block [@container(min-width:90rem)]:start-24 [@container(min-width:90rem)]:top-[60px] [@container(min-width:90rem)]:h-[480px] [@container(min-width:90rem)]:w-[440px]">
            {insetPhoto ? (
              <>
                <img src={insetPhoto.src} alt={insetPhoto.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-backdrop-overlay" />
              </>
            ) : null}
          </div>

          {display ? (
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-center text-4xl font-bold text-foreground-inverse dark:text-foreground [@container(min-width:48rem)]:text-7xl [@container(min-width:90rem)]:text-9xl">
              {display}
            </p>
          ) : null}

          {count || previous || next ? (
            <div className="absolute bottom-6 end-6 flex items-center gap-8 [@container(min-width:90rem)]:bottom-10 [@container(min-width:90rem)]:end-10">
              {count ? (
                <p className="whitespace-nowrap text-xs font-medium text-foreground-inverse dark:text-foreground">{count}</p>
              ) : null}
              {/* Static links: the block draws the controls, it does not run a carousel. */}
              {previous || next ? (
                <div className="flex gap-2">
                  {previous ? (
                    <a href={previous.href} aria-label={previous.label} className={ARROW}>
                      <ArrowLeft size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                    </a>
                  ) : null}
                  {next ? (
                    <a href={next.href} aria-label={next.label} className={ARROW}>
                      <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Figma sets the story 900px wide on Desktop, 200px in from the block's start edge. */}
        <div className="flex w-full flex-col items-start gap-3 [@container(min-width:90rem)]:ms-[152px] [@container(min-width:90rem)]:max-w-[900px]">
          {label ? (
            <Badge variant="solid" tone="info" size="sm" radius="rounded">
              {label}
            </Badge>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:text-lg">{description ?? copy.description}</p>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroSplitBandHeadlineCopy = COPY

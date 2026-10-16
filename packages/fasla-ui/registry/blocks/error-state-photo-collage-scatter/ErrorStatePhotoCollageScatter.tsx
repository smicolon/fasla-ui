"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Photo Collage Scatter.
 *
 * Five prints scattered at an angle around a centred message, like photos
 * tipped out on a table. Mobile keeps three of them, across the top. No
 * photos come with the block: pass `photos`, and until then each print shows
 * a `muted` placeholder of the same size.
 *
 * The message is never covered. From Tablet up the block is three columns:
 * the message in the middle, in the flow and above everything, and a rail of
 * prints either side. Each print is absolutely positioned inside its rail,
 * with its offset and width as a share of the rail, so at Figma's 768 and
 * 1440 it lands on Figma's offsets, and at any other width the prints scale
 * with the rails instead of sliding under the message; they never grow past
 * Figma's size. Figma's Desktop bottom-start print reaches into the
 * message's column; here it stays in its rail. On a phone the three prints
 * sit in a band above the message, at Figma's offsets.
 *
 * Offsets are logical (`start`/`end`), and the prints turn about their
 * top-left corner, as Figma turns them. In Arabic each print's box moves to
 * the mirrored spot and its angle negates, as Figma's RTL variants place
 * them, so the fan reads the same way round. The photographs are never
 * flipped.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface ErrorStatePhotoCollageScatterAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStatePhotoCollageScatterPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface ErrorStatePhotoCollageScatterCopy {
  /** The status code in display type. Hidden when empty. */
  code: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The text under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStatePhotoCollageScatterAction
  /** The outline button beside it: the quieter escape. Hidden when null. */
  secondaryAction: ErrorStatePhotoCollageScatterAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStatePhotoCollageScatterCopy> = {
  en: {
    code: "404",
    heading: "This page is not in the album",
    description: "We kept the pictures, but the page you asked for is gone. Head back and pick up where you left off.",
    primaryAction: { label: "Back to home", href: "/" },
    secondaryAction: { label: "View the gallery", href: "#gallery" },
  },
  ar: {
    code: "404",
    heading: "هذه الصفحة ليست في الألبوم",
    description: "احتفظنا بالصور، لكن الصفحة التي طلبتها لم تعد موجودة. عد وتابع من حيث توقفت.",
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "استعرض المعرض", href: "#gallery" },
  },
}

type Print = {
  /** Which of the five photos it shows, in Figma's order. */
  photo: number
  className: string
  rotate: string
}

/*
 * Where each print sits, and its angle. Figma turns a print anticlockwise for
 * a positive angle, CSS clockwise, so each `rotate` is Figma's angle negated,
 * and negated again in Arabic. Heights follow from each print's aspect ratio.
 */

/** On a phone: Figma's Mobile offsets, in a 258px band above the message. */
const PHONE_PRINTS: Print[] = [
  { photo: 0, className: "start-0 top-0 w-[104px]", rotate: "rotate-[7deg] [&:dir(rtl)]:rotate-[-7deg]" },
  { photo: 3, className: "end-0 top-2 w-[104px]", rotate: "rotate-[-6deg] [&:dir(rtl)]:rotate-[6deg]" },
  { photo: 4, className: "start-24 top-[148px] w-[116px]", rotate: "rotate-[5deg] [&:dir(rtl)]:rotate-[-5deg]" },
]

/**
 * From Tablet up, as shares of the rail: Figma's offsets and widths at 768
 * (a 170px rail) and 1440 (a 414px rail), trimmed where a turned print would
 * otherwise cross into the message's column.
 */
const START_RAIL: Print[] = [
  {
    photo: 0,
    className: "start-0 top-[30px] w-[88%] max-w-[150px] lg:start-[4.8%] lg:top-[54px] lg:w-[49.3%] lg:max-w-[204px]",
    rotate: "rotate-[7deg] [&:dir(rtl)]:rotate-[-7deg]",
  },
  {
    photo: 1,
    className: "start-[5.9%] top-[268px] w-[82%] max-w-[150px] lg:start-[13%] lg:top-[352px] lg:w-[51.7%] lg:max-w-[214px]",
    rotate: "rotate-[-5deg] [&:dir(rtl)]:rotate-[5deg]",
  },
  {
    photo: 2,
    className: "hidden lg:block lg:start-[52%] lg:top-[432px] lg:w-[40.6%] lg:max-w-[168px]",
    rotate: "rotate-[-9deg] [&:dir(rtl)]:rotate-[9deg]",
  },
]

const END_RAIL: Print[] = [
  {
    photo: 2,
    className: "end-[28.2%] top-[402px] w-[65.9%] max-w-[112px] lg:hidden",
    rotate: "rotate-[-9deg] [&:dir(rtl)]:rotate-[9deg]",
  },
  {
    photo: 3,
    className: "end-[1.2%] top-[18px] w-[85.9%] max-w-[146px] lg:end-[8.7%] lg:top-9 lg:w-[48.3%] lg:max-w-[200px]",
    rotate: "rotate-[-6deg] [&:dir(rtl)]:rotate-[6deg]",
  },
  {
    photo: 4,
    className: "end-[3.5%] top-[248px] w-[85%] max-w-[166px] lg:end-[21.7%] lg:top-[336px] lg:w-[55.6%] lg:max-w-[230px]",
    rotate: "rotate-[5deg] [&:dir(rtl)]:rotate-[-5deg]",
  },
]

/** Each photo's print shape, width over height, as Figma draws it at every breakpoint. */
const ASPECT = ["aspect-[204/258]", "aspect-[214/168]", "aspect-[168/150]", "aspect-[200/252]", "aspect-[230/176]"]

export interface ErrorStatePhotoCollageScatterProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStatePhotoCollageScatterCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The five prints' photos, in Figma's order: the tall one at the top start,
   * the two under it, the tall one at the top end and the one under it. None
   * by default: each print shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  photos?: ErrorStatePhotoCollageScatterPhoto[]
}

export function ErrorStatePhotoCollageScatter({
  locale = "en",
  code,
  heading,
  description,
  primaryAction,
  secondaryAction,
  photos = [],
  className,
  ...props
}: ErrorStatePhotoCollageScatterProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const status = code ?? copy.code
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction

  const prints = (list: Print[]) =>
    list.map((print) => {
      const photo = photos[print.photo]
      return (
        <div
          key={print.photo}
          className={cn("absolute origin-top-left rounded-[var(--radius-sm)] bg-card p-2 shadow-lg", ASPECT[print.photo], print.rotate, print.className)}
        >
          <div className="relative size-full overflow-hidden bg-muted">
            {photo ? (
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : null}
          </div>
        </div>
      )
    })

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="relative mx-auto grid min-h-[540px] w-full max-w-[1248px] overflow-hidden md:min-h-[520px] md:grid-cols-[minmax(0,1fr)_minmax(0,300px)_minmax(0,1fr)] lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)_minmax(0,1fr)]">
        <div className="relative h-[258px] md:hidden">{prints(PHONE_PRINTS)}</div>
        <div className="relative hidden md:col-start-1 md:row-start-1 md:block">{prints(START_RAIL)}</div>
        <div className="relative hidden md:col-start-3 md:row-start-1 md:block">{prints(END_RAIL)}</div>

        <div className="relative z-10 flex w-full flex-col items-center gap-5 text-center md:col-start-2 md:row-start-1 md:pt-[146px] lg:pt-[170px]">
          {status ? <p className="text-5xl font-semibold text-foreground md:text-6xl lg:text-7xl">{status}</p> : null}
          <div className="flex w-full flex-col gap-2.5">
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStatePhotoCollageScatterCopy = COPY

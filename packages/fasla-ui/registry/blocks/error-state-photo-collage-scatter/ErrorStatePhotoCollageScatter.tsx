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
 * The prints are absolutely positioned at Figma's offsets, each anchored to
 * the side it sits nearest, with logical properties (`start`/`end`), and turn
 * about their top-left corner, as Figma turns them. In Arabic each print's
 * box moves to the mirrored spot and its angle negates, exactly as Figma's
 * RTL variants place them, so the fan reads the same way round. The
 * photographs are never flipped.
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

/**
 * Where each print sits, at Figma's offsets for Mobile, Tablet and Desktop,
 * and its angle. Figma turns a print anticlockwise for a positive angle, CSS
 * clockwise, so each `rotate` is Figma's angle negated, and negated again in
 * Arabic. Mobile shows the first, fourth and fifth prints only.
 */
const PRINTS: { className: string; rotate: string }[] = [
  {
    className:
      "start-0 top-0 h-[132px] w-[104px] md:top-[30px] md:h-[190px] md:w-[150px] lg:start-5 lg:top-[54px] lg:h-[258px] lg:w-[204px]",
    rotate: "rotate-[7deg] [&:dir(rtl)]:rotate-[-7deg]",
  },
  {
    className:
      "hidden md:block md:start-2.5 md:top-[268px] md:h-[118px] md:w-[150px] lg:start-[54px] lg:top-[352px] lg:h-[168px] lg:w-[214px]",
    rotate: "rotate-[-5deg] [&:dir(rtl)]:rotate-[5deg]",
  },
  {
    className:
      "hidden md:block md:end-12 md:top-[402px] md:h-[100px] md:w-[112px] lg:end-auto lg:start-[292px] lg:top-[432px] lg:h-[150px] lg:w-[168px]",
    rotate: "rotate-[-9deg] [&:dir(rtl)]:rotate-[9deg]",
  },
  {
    className:
      "end-0 top-2 h-[132px] w-[104px] md:end-0.5 md:top-[18px] md:h-[186px] md:w-[146px] lg:end-9 lg:top-9 lg:h-[252px] lg:w-[200px]",
    rotate: "rotate-[-6deg] [&:dir(rtl)]:rotate-[6deg]",
  },
  {
    className:
      "start-24 top-[148px] h-[90px] w-[116px] md:start-auto md:end-1.5 md:top-[248px] md:h-[128px] md:w-[166px] lg:end-[90px] lg:top-[336px] lg:h-[176px] lg:w-[230px]",
    rotate: "rotate-[5deg] [&:dir(rtl)]:rotate-[-5deg]",
  },
]

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

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="relative mx-auto h-[540px] w-full max-w-[1248px] overflow-hidden md:h-[520px] lg:h-[620px]">
        {PRINTS.map((print, index) => {
          const photo = photos[index]
          return (
            <div
              key={index}
              className={cn("absolute origin-top-left rounded-[var(--radius-sm)] bg-card p-2 shadow-lg", print.rotate, print.className)}
            >
              <div className="relative size-full overflow-hidden bg-muted">
                {photo ? (
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                ) : null}
              </div>
            </div>
          )
        })}

        <div className="absolute inset-x-0 top-[258px] mx-auto flex w-full flex-col items-center gap-5 text-center md:top-[146px] md:w-[300px] lg:top-[170px] lg:w-[420px]">
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

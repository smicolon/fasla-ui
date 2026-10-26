"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Editorial Eyebrow Split.
 *
 * An editorial intro, then a hairline, then the marks. On Desktop the intro
 * is split: a short eyebrow in a fixed column at the start and a larger
 * sentence beside it, and the marks spread across one row from edge to edge.
 * From Tablet down the eyebrow sits above the sentence, and the marks centre
 * in rows of three (Tablet, and from `sm:` on a wide phone) or two (Mobile).
 *
 * There is no heading: the eyebrow names the section. Figma draws the
 * hairline with its Separator component; the code registry has no Separator
 * yet, so it is an `hr` in the `border` token.
 *
 * The rows are in DOM order, so `dir="rtl"` on the page puts the eyebrow and
 * the first mark on the right, as Figma's RTL variants do. The marks are
 * never mirrored.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudEditorialEyebrowSplitLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudEditorialEyebrowSplitCopy {
  /** The short label at the start of the intro. It names the section. */
  eyebrow: React.ReactNode
  /** The larger sentence beside the eyebrow: who the marks are. Hidden when null. */
  description: React.ReactNode | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudEditorialEyebrowSplitCopy> = {
  en: {
    eyebrow: "Who we build for",
    description: "For the teams shipping the products people use every day — and for the operators keeping them running.",
  },
  ar: {
    eyebrow: "لمن نبني",
    description: "للفرق التي تُطلق المنتجات التي يستخدمها الناس كل يوم، وللمشغّلين الذين يبقونها تعمل.",
  },
}

/** How many marks Figma shows: the number of placeholders when no logos are passed. */
const PLACEHOLDERS = 6

export interface LogoCloudEditorialEyebrowSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudEditorialEyebrowSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order. Each has a `name` and a `logo`. None by
   * default: each slot shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudEditorialEyebrowSplitLogo[]
}

export function LogoCloudEditorialEyebrowSplit({
  locale = "en",
  eyebrow,
  description,
  logos = [],
  className,
  ...props
}: LogoCloudEditorialEyebrowSplitProps) {
  const copy = COPY[locale]
  const eyebrowId = React.useId()
  const sentence = description === undefined ? copy.description : description

  return (
    <section aria-labelledby={eyebrowId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <div className="flex flex-col gap-4 md:gap-5 lg:flex-row lg:items-start lg:gap-20">
          <p id={eyebrowId} className="text-sm font-medium text-foreground lg:w-60 lg:shrink-0">
            {eyebrow ?? copy.eyebrow}
          </p>
          {sentence ? <p className="text-lg text-muted-foreground lg:max-w-[560px]">{sentence}</p> : null}
        </div>

        <hr className="border-border" />

        <ul className="grid grid-cols-[repeat(2,auto)] justify-center gap-6 sm:grid-cols-[repeat(3,auto)] md:gap-x-10 md:gap-y-8 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-8">
          {logos.length > 0
            ? logos.map((logo, index) => (
                <li key={index} className="flex items-center justify-center">
                  <span className="sr-only">{logo.name}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-5 max-w-[88px] items-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                  >
                    {logo.logo}
                  </span>
                </li>
              ))
            : Array.from({ length: PLACEHOLDERS }, (_, index) => (
                <li key={index} aria-hidden="true" className="flex items-center justify-center">
                  <span className="h-5 w-16 rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
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
export const logoCloudEditorialEyebrowSplitCopy = COPY

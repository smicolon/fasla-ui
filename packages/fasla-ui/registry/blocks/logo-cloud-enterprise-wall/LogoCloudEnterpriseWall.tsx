"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Enterprise Wall.
 *
 * A centred heading over a dense wall of marks: the one layout built for the
 * full 24, for a brand with many customers to show.
 *
 * Desktop sets the marks six to a row, Tablet three and Mobile two, each
 * centred in a cell 48px tall on Desktop, 52px on Tablet and 56px on Mobile,
 * 40px between rows. Each mark sits in a slot as tall as Figma's (28, 24,
 * 20px) and no wider than its cap (110, 100, 88px), so wide wordmarks such as
 * Oracle or Samsung come out shorter than square ones, as in Figma.
 *
 * The marks come in through `logos`, in reading order; the page's `dir` sets
 * which side the first one starts on, and the marks themselves are never
 * flipped. Without logos each cell shows a `muted` placeholder.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudEnterpriseWallLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudEnterpriseWallCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudEnterpriseWallCopy> = {
  en: {
    heading: "Built for teams large and small",
  },
  ar: {
    heading: "مصمَّم للفرق الكبيرة والصغيرة",
  },
}

/** Figma's count of marks, the number of placeholders shown without logos. */
const PLACEHOLDERS = 24

/** The slot a mark sits in: Figma's height at each breakpoint, and its width cap. */
const SLOT =
  "flex h-5 items-center md:h-6 lg:h-7 [&>*]:h-full [&>*]:w-auto [&>*]:max-w-[88px] md:[&>*]:max-w-[100px] lg:[&>*]:max-w-[110px] [&>img]:object-contain"

export interface LogoCloudEnterpriseWallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudEnterpriseWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order. Each has the company's `name` and its `logo`.
   * None by default: each cell shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudEnterpriseWallLogo[]
}

export function LogoCloudEnterpriseWall({
  locale = "en",
  heading,
  logos = [],
  className,
  ...props
}: LogoCloudEnterpriseWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const slots = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-14">
        <h2 id={headingId} className="text-center text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
          {heading ?? copy.heading}
        </h2>

        <ul
          aria-hidden={logos.length === 0 || undefined}
          className="grid grid-cols-2 gap-x-4 gap-y-10 text-muted-foreground md:grid-cols-3 lg:grid-cols-6"
        >
          {slots.map((logo, index) => (
            <li key={index} className="flex h-14 min-w-0 items-center justify-center md:h-[52px] lg:h-12">
              {logo ? (
                <>
                  <span className="sr-only">{logo.name}</span>
                  <span aria-hidden="true" className={SLOT}>
                    {logo.logo}
                  </span>
                </>
              ) : (
                <span className="block h-5 w-16 rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
              )}
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
export const logoCloudEnterpriseWallCopy = COPY

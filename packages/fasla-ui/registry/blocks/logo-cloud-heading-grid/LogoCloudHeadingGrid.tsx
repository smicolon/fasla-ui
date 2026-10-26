"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Heading Grid.
 *
 * A centred heading and one supporting line over an even grid of marks, each
 * centred in its own cell.
 *
 * Desktop lays the eight marks out four to a row, Tablet three and Mobile
 * two, with the cells growing taller as the screen narrows (56px, then 64px on
 * Mobile). A last row that is not full shares the width between its cells, as
 * Figma's Tablet does with its last two marks. Each mark sits in a slot as
 * tall as Figma's (28, 24, 20px) and no wider than its cap (110, 100, 88px).
 *
 * The marks come in through `logos`, in reading order; the page's `dir` sets
 * which side the first one starts on, and the marks themselves are never
 * flipped. Without logos each cell shows a `muted` placeholder.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudHeadingGridLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudHeadingGridCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudHeadingGridCopy> = {
  en: {
    heading: "A few of our customers",
    description: "Product, design and engineering teams ship faster on Fasla.",
  },
  ar: {
    heading: "نخبة من عملائنا",
    description: "فرق المنتج والتصميم والهندسة تُطلق أسرع على فاصلة.",
  },
}

/** Figma's count of marks, the number of placeholders shown without logos. */
const PLACEHOLDERS = 8

/** The slot a mark sits in: Figma's height at each breakpoint, and its width cap. */
const SLOT =
  "flex h-5 items-center md:h-6 lg:h-7 [&>*]:h-full [&>*]:w-auto [&>*]:max-w-[88px] md:[&>*]:max-w-[100px] lg:[&>*]:max-w-[110px] [&>img]:object-contain"

export interface LogoCloudHeadingGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudHeadingGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order. Each has the company's `name` and its `logo`.
   * None by default: each cell shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudHeadingGridLogo[]
}

export function LogoCloudHeadingGrid({
  locale = "en",
  heading,
  description,
  logos = [],
  className,
  ...props
}: LogoCloudHeadingGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const slots = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-3 text-center">
          <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
        </header>

        {/* Flex, not grid: a last row that is not full spreads its cells across the width, as Figma's Tablet does. */}
        <ul aria-hidden={logos.length === 0 || undefined} className="flex flex-wrap gap-x-6 gap-y-10 text-muted-foreground">
          {slots.map((logo, index) => (
            <li
              key={index}
              className="flex h-16 min-w-0 grow basis-[calc((100%-1.5rem)/2-1px)] items-center justify-center md:h-14 md:basis-[calc((100%-3rem)/3-1px)] lg:basis-[calc((100%-4.5rem)/4-1px)]"
            >
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
export const logoCloudHeadingGridCopy = COPY

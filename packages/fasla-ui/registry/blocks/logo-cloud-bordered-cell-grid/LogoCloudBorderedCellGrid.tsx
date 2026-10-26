"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Bordered Cell Grid.
 *
 * A small caption over one card ruled into equal cells, a mark centred in
 * each. No heading: the caption names the section.
 *
 * Desktop rules the ten marks into five columns of 116px cells; Tablet and
 * Mobile into two columns, 88px and then 80px tall. Only the inner lines are
 * drawn: every cell carries a line on its end and bottom side, and the card
 * clips the ones on its outer edges. The lines are logical, so they follow
 * the page's `dir`. Each mark sits in a slot as tall as Figma's (28, 24, 20px)
 * and no wider than its cap (110, 100, 88px).
 *
 * The caption is Figma's uppercase in English only: Arabic has no capitals,
 * so the English copy is written in sentence case and set uppercase in a
 * left-to-right block.
 *
 * The marks come in through `logos`, in reading order, and are never flipped.
 * Without logos each cell shows a `muted` placeholder.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudBorderedCellGridLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudBorderedCellGridCopy {
  /** The small line above the card. It names the section for assistive tech. */
  caption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudBorderedCellGridCopy> = {
  en: {
    caption: "Trusted by 4,000+ teams worldwide",
  },
  ar: {
    caption: (
      <>
        موثوق به لدى أكثر من <bdi dir="ltr">4,000</bdi> فريق حول العالم
      </>
    ),
  },
}

/** Figma's count of marks, the number of placeholders shown without logos. */
const PLACEHOLDERS = 10

/** The slot a mark sits in: Figma's height at each breakpoint, and its width cap. */
const SLOT =
  "flex h-5 items-center md:h-6 lg:h-7 [&>*]:h-full [&>*]:w-auto [&>*]:max-w-[88px] md:[&>*]:max-w-[100px] lg:[&>*]:max-w-[110px] [&>img]:object-contain"

export interface LogoCloudBorderedCellGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudBorderedCellGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order. Each has the company's `name` and its `logo`.
   * None by default: each cell shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudBorderedCellGridLogo[]
}

export function LogoCloudBorderedCellGrid({
  locale = "en",
  caption,
  logos = [],
  className,
  ...props
}: LogoCloudBorderedCellGridProps) {
  const copy = COPY[locale]
  const captionId = React.useId()
  const slots = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={captionId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <p id={captionId} className="text-center text-xs font-semibold text-muted-foreground [&:dir(ltr)]:uppercase">
          {caption ?? copy.caption}
        </p>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {/*
            Pulled out by a pixel on every side but the start, so the card clips the outer cells' lines
            and its border sits over the first row, as Figma's inside stroke does: the card is the rows'
            height, not a pixel taller.
          */}
          <ul
            aria-hidden={logos.length === 0 || undefined}
            className="-mb-px -me-px -mt-px grid grid-cols-2 text-muted-foreground lg:grid-cols-5"
          >
            {slots.map((logo, index) => (
              <li
                key={index}
                className="flex h-20 min-w-0 items-center justify-center border-b border-e border-border px-4 md:h-[88px] lg:h-[116px]"
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
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudBorderedCellGridCopy = COPY

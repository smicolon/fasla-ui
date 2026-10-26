"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Centered Caption Row.
 *
 * One quiet line of text over a row of marks, the lightest way to say "these
 * teams use us". No heading: the caption names the section.
 *
 * Desktop holds the six marks in one row, spread from edge to edge inside a
 * 64px inset; the inset starts at 1280, so a narrow desktop gives the gaps
 * that room instead. Tablet breaks them into two rows of three, the outer marks
 * flush with the edges, and Mobile into three rows of two, each pair centred
 * on its own. Each mark sits in a slot as tall as Figma's (28, 24, 20px) and
 * no wider than its cap (110, 100, 88px), keeping its own proportions.
 *
 * The marks come in through `logos`, in reading order; the page's `dir` sets
 * which side the first one starts on, and the marks themselves are never
 * flipped. Without logos each slot shows a `muted` placeholder of its size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudCenteredCaptionRowLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudCenteredCaptionRowCopy {
  /** The line above the marks. It names the section for assistive tech. */
  caption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudCenteredCaptionRowCopy> = {
  en: {
    caption: "Trusted by teams building on Fasla",
  },
  ar: {
    caption: "موثوق به لدى فرق تبني على فاصلة",
  },
}

/** Figma's count of marks, the number of placeholders shown without logos. */
const PLACEHOLDERS = 6

/** The slot a mark sits in: Figma's height at each breakpoint, and its width cap. */
const SLOT =
  "flex h-5 items-center md:h-6 lg:h-7 [&>*]:h-full [&>*]:w-auto [&>*]:max-w-[88px] md:[&>*]:max-w-[100px] lg:[&>*]:max-w-[110px] [&>img]:object-contain"

export interface LogoCloudCenteredCaptionRowProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudCenteredCaptionRowCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order. Each has the company's `name` and its `logo`.
   * None by default: each slot shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudCenteredCaptionRowLogo[]
}

export function LogoCloudCenteredCaptionRow({
  locale = "en",
  caption,
  logos = [],
  className,
  ...props
}: LogoCloudCenteredCaptionRowProps) {
  const copy = COPY[locale]
  const captionId = React.useId()
  const slots = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)
  const pairs = Array.from({ length: Math.ceil(slots.length / 2) }, (_, row) => slots.slice(row * 2, row * 2 + 2))

  return (
    <section aria-labelledby={captionId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8">
        <p id={captionId} className="text-center text-sm font-medium text-muted-foreground">
          {caption ?? copy.caption}
        </p>

        {/*
          On a phone each row of two is centred on its own, as Figma's Mobile rows are, so the
          marks sit in pairs, not in shared columns. From Tablet up the pairs dissolve
          (`display: contents`) and every mark is a cell of one grid. The wrappers are `role="none"`,
          so the list still reads as one list of marks.
        */}
        <div
          role={logos.length > 0 ? "list" : undefined}
          aria-hidden={logos.length === 0 || undefined}
          className="flex flex-col items-center gap-y-6 text-muted-foreground md:grid md:grid-cols-[repeat(3,auto)] md:items-center md:justify-between md:gap-x-6 md:gap-y-8 lg:grid-cols-[repeat(6,auto)] xl:px-16"
        >
          {pairs.map((pair, row) => (
            <div key={row} role="none" className="flex items-center justify-center gap-x-8 md:contents">
              {pair.map((logo, offset) => {
                const index = row * 2 + offset
                return (
                  <div
                    key={index}
                    role={logo ? "listitem" : undefined}
                    className={cn(
                      "flex justify-center",
                      // Tablet: the outer marks of each row of three sit on the edges, as Figma's space-between rows do.
                      index % 3 === 0 && "md:justify-self-start",
                      index % 3 === 1 && "md:justify-self-center",
                      index % 3 === 2 && "md:justify-self-end",
                      "lg:!justify-self-center"
                    )}
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
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudCenteredCaptionRowCopy = COPY

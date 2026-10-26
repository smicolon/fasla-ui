"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Contained Card.
 *
 * A small caption and a grid of marks inside a bordered card: six marks
 * across on a desktop, three on a tablet and two on a phone. Every cell has
 * the same width and the mark sits in its middle, so a wide wordmark and a
 * square glyph line up on one grid.
 *
 * The grid fills in reading order, so in Arabic the first mark sits at the
 * right of the first row, where Figma's RTL variants place it, with the same
 * list of logos. The marks themselves are never mirrored.
 *
 * No logos come with the block: pass `logos`. Until then each cell shows a
 * `muted` placeholder of a mark's size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudContainedCardLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudContainedCardCopy {
  /** The small line above the marks. It names the section for screen readers. */
  caption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudContainedCardCopy> = {
  en: {
    caption: "Trusted by industry innovators",
  },
  ar: {
    caption: "موثوق به لدى روّاد القطاع",
  },
}

/** How many cells Figma draws, and so how many placeholders show without logos. */
const PLACEHOLDERS = 12

export interface LogoCloudContainedCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudContainedCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: each a `name` and a `logo`. None by default:
   * each cell shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudContainedCardLogo[]
}

export function LogoCloudContainedCard({ locale = "en", caption, logos = [], className, ...props }: LogoCloudContainedCardProps) {
  const copy = COPY[locale]
  const captionId = React.useId()
  const cells = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={captionId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12 rounded-xl border border-border bg-card px-5 py-6 md:p-8 lg:px-16 lg:py-14">
        <p id={captionId} className="w-full text-center text-xs font-semibold uppercase text-muted-foreground">
          {caption ?? copy.caption}
        </p>
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {cells.map((item, index) => (
            <li key={index} className="flex px-2 h-16 min-w-0 items-center justify-center md:h-12 lg:h-11">
              {item ? (
                <>
                  <span className="sr-only">{item.name}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-5 max-w-[min(88px,100%)] items-center justify-center text-muted-foreground md:h-6 md:max-w-[min(100px,100%)] lg:h-7 lg:max-w-[min(110px,100%)] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                  >
                    {item.logo}
                  </span>
                </>
              ) : (
                <span aria-hidden="true" className="h-5 w-20 max-w-full rounded-md bg-muted md:h-6 md:w-24 lg:h-7" />
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
export const logoCloudContainedCardCopy = COPY

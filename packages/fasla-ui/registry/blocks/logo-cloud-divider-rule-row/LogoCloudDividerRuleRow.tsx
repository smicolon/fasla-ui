"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Divider Rule Row.
 *
 * A centred heading over the marks in a ruled band, on an inverted surface:
 * dark in Light, light in Dark. The surface is painted with the inverse
 * tokens, the only way Fasla inverts a surface, so it never forces a `.dark`
 * or `.light` class and never borrows `bg-foreground`. The theme-inverse
 * registry item maps the tokens.
 *
 * The heading is Figma's 4XL style at every breakpoint: its size steps down
 * on smaller screens, but its line height stays the 4XL rung's (44px, 60px
 * in Arabic), read from the type ramp so it follows the direction. `md:`
 * repeats it because `md:text-3xl` would otherwise bring its own.
 *
 * Rules run above and below the band, with a hairline between cells. On
 * Desktop the cells share one row; on Tablet they run three to a row, a
 * shorter last row splitting the width between its cells; on a phone they
 * stack, one mark to a row. The marks take the inverse foreground, so pass
 * them monochrome (drawn in `currentColor`): full-colour marks lose their
 * dark parts on the dark band.
 *
 * The rules between cells are logical (`border-s`), so `dir="rtl"` on the
 * page starts the row on the right, as Figma's RTL variants do. The marks
 * are never mirrored.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudDividerRuleRowLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /**
   * The mark: an `svg` or an `img`. The block sizes it to its cell, keeping
   * its proportions, and gives it the inverse foreground as `currentColor`.
   */
  logo: React.ReactNode
}

export interface LogoCloudDividerRuleRowCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudDividerRuleRowCopy> = {
  en: {
    // Figma breaks the line after "work". On a phone that leaves "work" alone on its line, so
    // the break starts at Tablet and the phone wraps on its own.
    heading: (
      <>
        See how our customers work
        <br className="hidden md:inline" /> with us to build trust.
      </>
    ),
  },
  ar: {
    heading: (
      <>
        اطّلع على كيفية عمل عملائنا
        <br /> معنا لبناء الثقة.
      </>
    ),
  },
}

/** How many marks Figma shows: the number of placeholder cells when no logos are passed. */
const PLACEHOLDERS = 5

/** Cells per row on Tablet. */
const TABLET_ROW = 3

export interface LogoCloudDividerRuleRowProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudDividerRuleRowCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order. Each has a `name` and a `logo`; pass
   * monochrome marks. None by default: each cell shows a placeholder.
   * @default none: placeholders
   */
  logos?: LogoCloudDividerRuleRowLogo[]
}

export function LogoCloudDividerRuleRow({ locale = "en", heading, logos = [], className, ...props }: LogoCloudDividerRuleRowProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const count = logos.length > 0 ? logos.length : PLACEHOLDERS

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background-inverse p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-14">
        <h2
          id={headingId}
          className="mx-auto max-w-[640px] text-balance text-center text-2xl font-semibold leading-[calc(var(--leading-4xl)*2.25rem)] text-foreground-inverse md:text-3xl md:leading-[calc(var(--leading-4xl)*2.25rem)] lg:text-4xl"
        >
          {heading ?? copy.heading}
        </h2>

        <ul className="flex flex-col border-y border-muted-foreground-inverse md:flex-row md:flex-wrap lg:flex-nowrap">
          {Array.from({ length: count }, (_, index) => {
            const logo = logos[index]
            return (
              <li
                key={index}
                aria-hidden={logo ? undefined : true}
                className={cn(
                  "flex h-[72px] min-w-0 items-center justify-center border-muted-foreground-inverse md:h-24 md:grow md:basis-1/3 lg:basis-0",
                  // Phone: a rule above every cell but the first.
                  index > 0 && "border-t",
                  // Tablet: a rule above every row but the first, and between the cells of a row.
                  index < TABLET_ROW ? "md:border-t-0" : "md:border-t",
                  index % TABLET_ROW > 0 && "md:border-s",
                  // Desktop: one row, a rule between the cells.
                  "lg:border-t-0",
                  index > 0 ? "lg:border-s" : "lg:border-s-0"
                )}
              >
                {logo ? (
                  <>
                    <span className="sr-only">{logo.name}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-5 max-w-[88px] items-center text-foreground-inverse md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                    >
                      {logo.logo}
                    </span>
                  </>
                ) : (
                  <span className="h-5 w-16 rounded-md bg-muted-foreground-inverse opacity-40 md:h-6 md:w-20 lg:h-7 lg:w-24" />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudDividerRuleRowCopy = COPY

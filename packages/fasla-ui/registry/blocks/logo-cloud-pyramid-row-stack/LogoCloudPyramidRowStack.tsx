"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Pyramid Row Stack.
 *
 * A one-line caption over the marks in centred rows that narrow as they go
 * down, like an upturned pyramid. Figma's seventeen marks run 8, 6, 3 on
 * Desktop, 4, 4, 4, 3, 2 on Tablet and two to a row on a phone. Any other
 * number keeps the shape: the rows follow the same narrowing sizes, and
 * marks past their total add full rows at the top.
 *
 * Each breakpoint has its own row breaks, so the list is laid out once per
 * breakpoint and only that one is shown; the other two are `display: none`,
 * out of the accessibility tree. Tablet's rows of four start at `sm:` (640),
 * where four phone-sized marks already fit, so a wide phone is not a tall
 * column of pairs.
 *
 * There is no heading: the caption names the section. The rows are in DOM
 * order, so `dir="rtl"` on the page starts each row on the right, as Figma's
 * RTL variants do. The marks are never mirrored.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudPyramidRowStackLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudPyramidRowStackCopy {
  /** The one line above the marks. It names the section. */
  caption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudPyramidRowStackCopy> = {
  en: {
    caption: "Trusted by 500,000 leading teams",
  },
  ar: {
    caption: (
      <>
        موثوق به لدى <bdi dir="ltr">500,000</bdi> فريق رائد
      </>
    ),
  },
}

/** How many marks Figma shows: the number of placeholders when no logos are passed. */
const PLACEHOLDERS = 17

/** Each breakpoint's row sizes, top to bottom, from Figma's 17 marks. */
const ROWS = {
  mobile: [2],
  tablet: [4, 4, 4, 3, 2, 1],
  desktop: [8, 6, 4, 3, 2, 1],
} as const

/** Splits `count` marks into rows that never widen going down. */
function rowSizes(count: number, schedule: readonly number[]) {
  const sizes: number[] = []
  const first = schedule[0] ?? 1
  let left = count
  const fits = schedule.reduce((sum, size) => sum + size, 0)
  while (left > fits) {
    sizes.push(first)
    left -= first
  }
  for (const size of schedule) {
    if (left <= 0) break
    sizes.push(Math.min(size, left))
    left -= Math.min(size, left)
  }
  return sizes
}

export interface LogoCloudPyramidRowStackProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudPyramidRowStackCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order, widest row first. Each has a `name` and a
   * `logo`. None by default: each slot shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudPyramidRowStackLogo[]
}

export function LogoCloudPyramidRowStack({ locale = "en", caption, logos = [], className, ...props }: LogoCloudPyramidRowStackProps) {
  const copy = COPY[locale]
  const captionId = React.useId()
  const count = logos.length > 0 ? logos.length : PLACEHOLDERS

  const item = (index: number) => {
    const logo = logos[index]
    return logo ? (
      <div role="listitem" key={index} className="flex items-center justify-center">
        <span className="sr-only">{logo.name}</span>
        <span
          aria-hidden="true"
          className="flex h-5 max-w-[88px] items-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
        >
          {logo.logo}
        </span>
      </div>
    ) : (
      <div key={index} aria-hidden="true" className="flex items-center justify-center">
        <span className="h-5 w-16 rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
      </div>
    )
  }

  /** One breakpoint's layout: rows of the given sizes, each centred. */
  const stack = (schedule: readonly number[], className: string) => {
    let start = 0
    return (
      <div role={logos.length > 0 ? "list" : undefined} className={cn("flex-col items-center", className)}>
        {rowSizes(count, schedule).map((size, row) => {
          const indexes = Array.from({ length: size }, (_, offset) => start + offset)
          start += size
          return (
            <div key={row} role="none" className="flex items-center justify-center gap-x-10">
              {indexes.map(item)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section aria-labelledby={captionId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <p id={captionId} className="text-center text-sm font-medium text-muted-foreground">
          {caption ?? copy.caption}
        </p>
        {stack(ROWS.mobile, "flex gap-y-5 sm:hidden")}
        {stack(ROWS.tablet, "hidden gap-y-5 sm:flex md:gap-y-6 lg:hidden")}
        {stack(ROWS.desktop, "hidden gap-y-8 lg:flex")}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudPyramidRowStackCopy = COPY

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Dark Logo Wall.
 *
 * A centred heading and line of text over a grid of marks, on an inverted
 * band: dark in Light, light in Dark. Four marks across on a desktop, three
 * on a tablet and two on a phone.
 *
 * The band is painted with the inverse tokens, the only way Fasla inverts a
 * surface, so it never forces a `.dark` or `.light` class and never borrows
 * `bg-foreground`. The theme-inverse registry item maps the tokens. Each
 * mark's slot is coloured `foreground-inverse`, so a mark drawn in
 * `currentColor` (Figma's Monochrome) follows the band. A mark in its brand
 * colours would fight the band, and near-black ones would vanish on it.
 *
 * The grid fills in reading order, so in Arabic the first mark sits at the
 * right of the first row, as Figma's RTL variants place it, with the same
 * list of logos. The marks themselves are never mirrored.
 *
 * No logos come with the block: pass `logos`. Until then each cell shows a
 * placeholder of a mark's size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudDarkLogoWallLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`, drawn in `currentColor`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudDarkLogoWallCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudDarkLogoWallCopy> = {
  en: {
    heading: "From startups to enterprises",
    description: "Thousands of teams run their product work on Fasla.",
  },
  ar: {
    heading: "من الشركات الناشئة إلى المؤسسات الكبرى",
    description: "آلاف الفرق تدير عمل منتجاتها على فاصلة.",
  },
}

/** How many cells Figma draws, and so how many placeholders show without logos. */
const PLACEHOLDERS = 12

export interface LogoCloudDarkLogoWallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudDarkLogoWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: each a `name` and a `logo` drawn in
   * `currentColor`. None by default: each cell shows a placeholder.
   * @default none: placeholders
   */
  logos?: LogoCloudDarkLogoWallLogo[]
}

export function LogoCloudDarkLogoWall({
  locale = "en",
  heading,
  description,
  logos = [],
  className,
  ...props
}: LogoCloudDarkLogoWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const cells = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background-inverse p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-14">
        <header className="flex flex-col gap-3 text-center">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground-inverse md:text-3xl lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground-inverse">{text}</p> : null}
        </header>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {cells.map((item, index) => (
            <li key={index} className="flex px-2 h-[68px] min-w-0 items-center justify-center md:h-[60px] lg:h-16">
              {item ? (
                <>
                  <span className="sr-only">{item.name}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-5 max-w-[min(88px,100%)] items-center justify-center text-foreground-inverse md:h-6 md:max-w-[min(100px,100%)] lg:h-7 lg:max-w-[min(110px,100%)] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                  >
                    {item.logo}
                  </span>
                </>
              ) : (
                <span aria-hidden="true" className="h-5 w-20 max-w-full rounded-md bg-muted-foreground-inverse opacity-25 md:h-6 md:w-24 lg:h-7" />
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
export const logoCloudDarkLogoWallCopy = COPY

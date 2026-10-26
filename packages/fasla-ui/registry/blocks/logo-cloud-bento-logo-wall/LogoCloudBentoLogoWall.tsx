"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Bento Logo Wall.
 *
 * A heading and a line of text above a bento of `card` tiles: one large tile
 * that features the first logo with the company's name and a caption, then a
 * tile per logo for the rest. At Desktop the featured tile takes half the
 * width and two rows, with four logos in a 2 × 2 block beside it and the rest
 * in rows of four below. At Tablet the featured tile runs full width over two
 * columns of tiles; on a phone every tile is full width.
 *
 * One grid holds every tile, so the layout follows the page's direction: in
 * Arabic the featured tile sits on the right. The company's name is a Latin
 * brand name, so it keeps Geist's face and line height in Arabic too, as
 * Figma sets it. Figma's featured tile is 12px
 * shorter than the 2 × 2 block beside it; here it stretches to match.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudBentoLogoWallLogo {
  /** The company's name. Screen readers read it; the featured tile also shows it. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its tile, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudBentoLogoWallCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode
  /** The line under the featured company's name: what it does. Hidden when null. */
  featuredCaption: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudBentoLogoWallCopy> = {
  en: {
    heading: "The companies we build alongside",
    description: "From two-person studios to listed enterprises.",
    featuredCaption: "Search, cloud and workplace tools.",
  },
  ar: {
    heading: "الشركات التي نبني إلى جانبها",
    description: "من استوديوهات من شخصين إلى مؤسسات مُدرَجة.",
    featuredCaption: "البحث والحوسبة السحابية وأدوات العمل.",
  },
}

const TILE = "rounded-lg border border-border bg-card"

/** The featured tile: half the bento and two rows at Desktop, full width below. */
const FEATURED = cn(TILE, "flex flex-col p-5 md:col-span-2 lg:row-span-2 lg:justify-between lg:gap-3")

/** A tile's own row height: the four beside the featured tile are taller at Desktop. */
const tileHeight = (index: number) => cn("h-14 md:h-[88px]", index <= 4 ? "lg:h-[114px]" : "lg:h-[104px]")

const SIZED = "[&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"

/** Figma draws a featured tile and eight others. */
const PLACEHOLDERS = 9

export interface LogoCloudBentoLogoWallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudBentoLogoWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The logos, in order. The first is featured, with its `name` and the
   * caption; the next four sit beside it at Desktop, and the rest fill rows
   * below. Figma shows nine. None by default: each tile is a `muted`
   * placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudBentoLogoWallLogo[]
}

export function LogoCloudBentoLogoWall({
  locale = "en",
  heading,
  description,
  featuredCaption,
  logos = [],
  className,
  ...props
}: LogoCloudBentoLogoWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const caption = featuredCaption === undefined ? copy.featuredCaption : featuredCaption
  const [featured, ...rest] = logos

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-2">
          <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
        </header>

        {featured ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <li className={FEATURED}>
              <span
                aria-hidden="true"
                className={cn("flex h-8 max-w-[200px] items-center text-muted-foreground md:h-10 lg:h-12", SIZED)}
              >
                {featured.logo}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-sans text-xl font-semibold leading-7 text-foreground">{featured.name}</p>
                {caption ? <p className="text-sm text-muted-foreground">{caption}</p> : null}
              </div>
            </li>
            {rest.map((item, index) => (
              <li key={index} className={cn(TILE, "flex items-center justify-center p-5", tileHeight(index + 1))}>
                <span className="sr-only">{item.name}</span>
                <span
                  aria-hidden="true"
                  className={cn("flex h-5 max-w-[84px] items-center justify-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-8 lg:max-w-[150px]", SIZED)}
                >
                  {item.logo}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className={FEATURED}>
              <span className="h-8 w-24 rounded-md bg-muted md:h-10 md:w-32 lg:h-12 lg:w-36" />
              <span className="mt-2 h-5 w-32 rounded-sm bg-muted" />
            </div>
            {Array.from({ length: PLACEHOLDERS - 1 }, (_, index) => (
              <div key={index} className={cn(TILE, "flex items-center justify-center p-5", tileHeight(index + 1))}>
                <span className="h-5 w-16 rounded-md bg-muted md:h-6 md:w-24 lg:h-8 lg:w-28" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudBentoLogoWallCopy = COPY

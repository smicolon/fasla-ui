"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Logo Testimonial Strip.
 *
 * One testimonial beside a borderless grid of marks: a heading, the quote
 * and who said it on one side, three rows of three marks on the other.
 *
 * Desktop sets the testimonial in a column at the start, centred against
 * the grid. The two share the row, the testimonial never past Figma's
 * 560px, so at 1440 the grid takes the rest as in Figma, and on a narrower
 * desktop the grid keeps room for its marks. Tablet stacks the testimonial
 * over the grid, three marks to a row; Mobile keeps the stack with two to a
 * row, and an odd last mark takes the whole row, centred. The marks keep
 * Figma's height per breakpoint (28, 24 and 20px), never past their width
 * cap.
 *
 * Mirroring comes from the page's `dir`: the testimonial moves to the start
 * side, the avatar leads the attribution from that side, and the marks keep
 * their order. The marks are never flipped.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudLogoTestimonialStripLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudLogoTestimonialStripAttribution {
  /** Who said it. Also the source of the avatar's initials. */
  name: string
  /** Their role, under the name. */
  role: React.ReactNode
  /** Their photo. None by default: the avatar shows the initials of `name`. */
  avatar?: string
}

export interface LogoCloudLogoTestimonialStripCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The testimonial under the heading. Name no company: the marks are real ones. */
  quote: React.ReactNode
  /** Who said it: `name`, `role` and an optional `avatar` photo. */
  attribution: LogoCloudLogoTestimonialStripAttribution
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudLogoTestimonialStripCopy> = {
  en: {
    heading: "Hear what others are saying",
    quote:
      "Our teams love the range of building blocks — instead of settling on one rigid template, they compose the screen they actually need, and everything still matches.",
    attribution: { name: "Mona Tarek", role: "Head of Design Systems" },
  },
  ar: {
    heading: "استمع إلى ما يقوله الآخرون",
    quote:
      "تحب فرقنا تنوّع اللبنات. فبدلًا من الاكتفاء بقالب جامد واحد، تُركّب الشاشة التي تحتاجها فعلًا، ويبقى كل شيء متناسقًا.",
    attribution: { name: "منى طارق", role: "رئيسة أنظمة التصميم" },
  },
}

/** Figma's count of marks: what the grid keeps, as placeholders, while no logos are passed. */
const PLACEHOLDERS = 9

export interface LogoCloudLogoTestimonialStripProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudLogoTestimonialStripCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: three to a row on Desktop and Tablet, two on
   * Mobile. None by default: each of Figma's nine slots shows a `muted` placeholder.
   * @default none: 9 `muted` placeholders
   */
  logos?: LogoCloudLogoTestimonialStripLogo[]
}

export function LogoCloudLogoTestimonialStrip({
  locale = "en",
  heading,
  quote,
  attribution,
  logos = [],
  className,
  ...props
}: LogoCloudLogoTestimonialStripProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const who = attribution ?? copy.attribution
  const cells: (LogoCloudLogoTestimonialStripLogo | null)[] =
    logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-col gap-5 lg:max-w-[560px] lg:flex-1">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground">
            {heading ?? copy.heading}
          </h2>
          <figure className="flex flex-col gap-5">
            <blockquote className="text-base text-muted-foreground">{quote ?? copy.quote}</blockquote>
            <figcaption className="flex items-center gap-3">
              {/* The name is printed beside it, so the avatar adds nothing to read. */}
              <Avatar
                aria-hidden="true"
                src={who.avatar}
                name={who.name}
                variant={who.avatar ? "image" : "initials"}
                radius="rounded"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-sm font-semibold text-foreground">{who.name}</p>
                <p className="text-xs text-muted-foreground">{who.role}</p>
              </div>
            </figcaption>
          </figure>
        </div>

        <ul className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
          {cells.map((item, index) => (
            <li
              key={item ? `${item.name}-${index}` : index}
              className="flex h-16 items-center justify-center last:odd:col-span-2 md:h-12 md:last:odd:col-span-1 lg:h-11"
            >
              {item ? (
                <>
                  <span className="sr-only">{item.name}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-5 max-w-[88px] items-center justify-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                  >
                    {item.logo}
                  </span>
                </>
              ) : (
                <span aria-hidden="true" className="h-5 w-[72px] rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
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
export const logoCloudLogoTestimonialStripCopy = COPY

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Heading Left Grid Right.
 *
 * The pitch beside the proof: a Badge, a heading, a line of text and two
 * buttons in a column at the start, and the marks in a ruled grid at the end,
 * three across. On a tablet the copy sits above the grid; on a phone the grid
 * becomes a single column of marks and the buttons stretch to the full width,
 * one above the other.
 *
 * The rules are each cell's bottom and end border. The grid overhangs its
 * box by a pixel on every side and the box clips it: the box's border sits
 * over the grid's edge, as Figma's inside stroke does, so the box is exactly
 * its rows tall and the last column's and last row's rules disappear under
 * the border at any count of marks.
 * Everything is logical, so in Arabic the copy moves to the right and the grid
 * fills from the right, as Figma's RTL variants draw them, with the same list
 * of logos. The marks themselves are never mirrored.
 *
 * No logos come with the block: pass `logos`. Until then each cell shows a
 * `muted` placeholder of a mark's size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudHeadingLeftGridRightLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudHeadingLeftGridRightAction {
  label: React.ReactNode
  href: string
}

export interface LogoCloudHeadingLeftGridRightCopy {
  /** The Badge above the heading. Hidden when null. */
  eyebrow: React.ReactNode | null
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The text under the heading. Hidden when null. */
  description: React.ReactNode | null
  /** The solid button: the main next step. */
  primaryAction: LogoCloudHeadingLeftGridRightAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: LogoCloudHeadingLeftGridRightAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudHeadingLeftGridRightCopy> = {
  en: {
    eyebrow: "Customers",
    heading: "Built for — and proven by — businesses of all sizes",
    description:
      "Over 10,000 companies, from early-stage startups to global enterprises, run their day-to-day work on Fasla.",
    primaryAction: { label: "See customer stories", href: "#customers" },
    secondaryAction: { label: "Talk to sales", href: "#contact" },
  },
  ar: {
    eyebrow: "العملاء",
    heading: "مصمَّم لأعمال بكل الأحجام، ومُثبَت من قِبَلها",
    description: (
      <>
        أكثر من <bdi dir="ltr">10,000</bdi> شركة، من الشركات الناشئة في مراحلها الأولى إلى المؤسسات العالمية، تدير أعمالها
        اليومية على فاصلة.
      </>
    ),
    primaryAction: { label: "اطّلع على قصص العملاء", href: "#customers" },
    secondaryAction: { label: "تحدّث إلى المبيعات", href: "#contact" },
  },
}

/** How many cells Figma draws, and so how many placeholders show without logos. */
const PLACEHOLDERS = 9

export interface LogoCloudHeadingLeftGridRightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudHeadingLeftGridRightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: each a `name` and a `logo`. None by default:
   * each cell shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudHeadingLeftGridRightLogo[]
}

export function LogoCloudHeadingLeftGridRight({
  locale = "en",
  eyebrow,
  heading,
  description,
  primaryAction,
  secondaryAction,
  logos = [],
  className,
  ...props
}: LogoCloudHeadingLeftGridRightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const badge = eyebrow === undefined ? copy.eyebrow : eyebrow
  const text = description === undefined ? copy.description : description
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const cells = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-col items-start gap-5 lg:w-[min(440px,40%)] lg:shrink-0">
          {badge ? (
            <Badge variant="soft" tone="primary" radius="standard" className="uppercase">
              {badge}
            </Badge>
          ) : null}
          <h2 id={headingId} className="text-3xl font-semibold text-foreground">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <a href={primary.href} className={buttonVariants({ className: "w-full md:w-auto" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline", className: "w-full md:w-auto" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border">
          <ul className="-m-px grid grid-cols-1 md:grid-cols-3">
            {cells.map((item, index) => (
              <li key={index} className="flex px-2 h-[52px] min-w-0 items-center justify-center border-b border-e border-border md:h-[104px] lg:h-28">
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
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudHeadingLeftGridRightCopy = COPY

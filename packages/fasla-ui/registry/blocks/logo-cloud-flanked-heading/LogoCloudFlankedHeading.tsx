"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Flanked Heading.
 *
 * A centred heading, a sentence and an outline button, flanked by the marks
 * in small square cards. On Desktop the first half of the marks sits beside
 * the copy at the start and the second half at the end, each in two rows of
 * two with the second row stepped in towards the copy. From Tablet down the
 * flanks become rows of four above and below the copy; on a phone the four
 * 64px cards sit 12px apart, as Figma has them, and shrink only on a screen
 * narrower than that row.
 *
 * The rows are in DOM order with logical offsets, so `dir="rtl"` on the page
 * puts the first half on the right and steps the rows in from the right, as
 * Figma's RTL variants do. The marks are never mirrored.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudFlankedHeadingLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its card, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudFlankedHeadingAction {
  label: React.ReactNode
  href: string
}

export interface LogoCloudFlankedHeadingCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The sentence under the heading. Hidden when null. */
  description: React.ReactNode
  /** The outline button under the sentence. Hidden when null. */
  action: LogoCloudFlankedHeadingAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudFlankedHeadingCopy> = {
  en: {
    heading: "Plug into your favourite tools",
    description: "If your team uses it, Fasla connects to it — over 300 integrations and counting.",
    action: { label: "Explore integrations", href: "#integrations" },
  },
  ar: {
    heading: "اربط أدواتك المفضّلة",
    description: (
      <>
        إن كان فريقك يستخدمها، فاصلة تتصل بها. أكثر من <bdi dir="ltr">300</bdi> تكامل والعدد في ازدياد.
      </>
    ),
    action: { label: "استكشف التكاملات", href: "#integrations" },
  },
}

/** How many marks Figma shows: the number of placeholder cards when no logos are passed. */
const PLACEHOLDERS = 8

export interface LogoCloudFlankedHeadingProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudFlankedHeadingCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: the first half flanks the copy at the
   * start, the rest at the end. Each has a `name` and a `logo`. None by
   * default: each card shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudFlankedHeadingLogo[]
}

/** One flank of cards. The second row of each flank steps in towards the copy on Desktop. */
function Flank({ logos, count, side }: { logos: LogoCloudFlankedHeadingLogo[]; count: number; side: "start" | "end" }) {
  return (
    <ul
      className={cn(
        "grid w-full max-w-[292px] shrink-0 grid-cols-4 gap-3 md:w-auto md:max-w-none md:grid-cols-[repeat(4,5rem)] md:gap-4 lg:flex lg:w-[200px] lg:flex-wrap",
        side === "start" ? "lg:justify-start lg:[&>li:nth-child(4n+3)]:ms-6" : "lg:justify-end lg:[&>li:nth-child(4n)]:me-6"
      )}
    >
      {Array.from({ length: count }, (_, index) => {
        const logo = logos[index]
        return (
          <li
            key={index}
            aria-hidden={logo ? undefined : true}
            className="flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-card shadow-sm md:size-20"
          >
            {logo ? (
              <>
                <span className="sr-only">{logo.name}</span>
                <span
                  aria-hidden="true"
                  className="flex w-[86%] items-center justify-center text-muted-foreground [&>*]:h-auto [&>*]:max-h-5 [&>*]:w-auto [&>*]:max-w-full md:[&>*]:max-h-6 [&>img]:object-contain"
                >
                  {logo.logo}
                </span>
              </>
            ) : (
              <span className="h-4 w-[70%] rounded-md bg-muted md:h-5" />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function LogoCloudFlankedHeading({
  locale = "en",
  heading,
  description,
  action,
  logos = [],
  className,
  ...props
}: LogoCloudFlankedHeadingProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const sentence = description === undefined ? copy.description : description
  const button = action === undefined ? copy.action : action
  const total = logos.length > 0 ? logos.length : PLACEHOLDERS
  const half = Math.ceil(total / 2)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-8 md:gap-10 lg:flex-row lg:gap-12">
        <Flank logos={logos.slice(0, half)} count={half} side="start" />

        <div className="flex w-full flex-col items-center gap-4 text-center md:px-8 lg:min-w-0 lg:flex-1">
          <h2 id={headingId} className="text-balance text-3xl font-semibold text-foreground">
            {heading ?? copy.heading}
          </h2>
          {sentence ? <p className="text-base text-muted-foreground">{sentence}</p> : null}
          {button ? (
            <a href={button.href} className={buttonVariants({ variant: "outline" })}>
              {button.label}
            </a>
          ) : null}
        </div>

        <Flank logos={logos.slice(half)} count={total - half} side="end" />
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudFlankedHeadingCopy = COPY

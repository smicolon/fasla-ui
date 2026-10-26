"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Grid Closing CTA.
 *
 * A centred heading over an even grid of logos, closed by a sentence with a
 * link after it and a button under them. The grid is six columns at Desktop,
 * three at Tablet and two on a phone, where the button runs full width. When
 * the sentence and the link don't fit on one line, the link wraps under the
 * sentence, centred, as Figma's Tablet and Mobile show.
 *
 * The link's arrow points along the reading direction, so it flips in Arabic.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudGridClosingCtaLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its cell, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudGridClosingCtaLink {
  label: React.ReactNode
  href: string
}

export interface LogoCloudGridClosingCtaCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The sentence under the logos. Hidden when null. */
  closing: React.ReactNode
  /** The text link after the sentence, with an arrow. Hidden when null. */
  link: LogoCloudGridClosingCtaLink | null
  /** The button under the sentence. Hidden when null. */
  action: LogoCloudGridClosingCtaLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudGridClosingCtaCopy> = {
  en: {
    heading: "Startups and Fortune 500s all build on Fasla",
    closing: "From startups to Fortune 500s, some of the world’s best teams run on Fasla.",
    link: { label: "View all customers", href: "#customers" },
    action: { label: "Start building free", href: "#start" },
  },
  ar: {
    heading: (
      <>
        الشركات الناشئة وشركات فورتشن <bdi dir="ltr">500</bdi> جميعها تبني على فاصلة
      </>
    ),
    closing: (
      <>
        من الشركات الناشئة إلى شركات فورتشن <bdi dir="ltr">500</bdi>، تعمل بعض أفضل الفرق في العالم على فاصلة.
      </>
    ),
    link: { label: "عرض جميع العملاء", href: "#customers" },
    action: { label: "ابدأ البناء مجانًا", href: "#start" },
  },
}

const CELL = "flex h-16 items-center justify-center md:h-12"

/** Figma's grid holds twelve logos. */
const PLACEHOLDERS = 12

export interface LogoCloudGridClosingCtaProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudGridClosingCtaCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The logos, in reading order. Figma shows twelve: two rows of six at
   * Desktop. None by default: each cell is a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudGridClosingCtaLogo[]
}

export function LogoCloudGridClosingCta({
  locale = "en",
  heading,
  closing,
  link,
  action,
  logos = [],
  className,
  ...props
}: LogoCloudGridClosingCtaProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const sentence = closing === undefined ? copy.closing : closing
  const more = link === undefined ? copy.link : link
  const button = action === undefined ? copy.action : action

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <h2 id={headingId} className="text-center text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
          {heading ?? copy.heading}
        </h2>

        {logos.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {logos.map((item, index) => (
              <li key={index} className={CELL}>
                <span className="sr-only">{item.name}</span>
                <span
                  aria-hidden="true"
                  className="flex h-5 max-w-[88px] items-center justify-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                >
                  {item.logo}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div aria-hidden="true" className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: PLACEHOLDERS }, (_, index) => (
              <div key={index} className={CELL}>
                <span className="h-5 w-16 rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
              </div>
            ))}
          </div>
        )}

        {sentence || more || button ? (
          <footer className="flex flex-col items-center gap-5 pt-4">
            {sentence || more ? (
              <p className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                {sentence ? <span>{sentence}</span> : null}
                {more ? (
                  <a
                    href={more.href}
                    className="inline-flex items-center gap-1 rounded-sm font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {more.label}
                    <ArrowRight
                      aria-hidden="true"
                      size={14}
                      strokeWidth={1.5}
                      absoluteStrokeWidth
                      className="size-3.5 shrink-0 [&:dir(rtl)]:-scale-x-100"
                    />
                  </a>
                ) : null}
              </p>
            ) : null}
            {button ? (
              <a href={button.href} className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}>
                {button.label}
              </a>
            ) : null}
          </footer>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudGridClosingCtaCopy = COPY

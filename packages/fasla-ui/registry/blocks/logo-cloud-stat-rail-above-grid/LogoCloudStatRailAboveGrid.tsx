"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Stat Rail Above Grid.
 *
 * An eyebrow and a heading, a rail of four results, each hung on a short
 * rule at its start edge, and under them the marks in a ruled grid of
 * equal cells. The results name no company: the marks are real ones.
 *
 * The rail is one column on a phone, two from Tablet and four at Desktop;
 * the grid is two columns, four at Desktop, and its cells grow from 80 to
 * 112px tall. The grid's inner rules are each cell's end and bottom
 * borders, with the last column's and last row's clipped by the box, so any
 * number of marks keeps a clean frame.
 *
 * The rules sit on the start edge and the grid fills from the start, so in
 * Arabic both follow the page's direction. The marks are never mirrored. A
 * figure with no Arabic in it keeps Geist and the English line height in
 * Arabic, as Figma's RTL variants set it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudStatRailAboveGridLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudStatRailAboveGridStat {
  /** The figure, in display type. */
  value: React.ReactNode
  /** What the figure measures. */
  label: React.ReactNode
}

export interface LogoCloudStatRailAboveGridCopy {
  /** The small line above the heading. Hidden when null. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The results in the rail, in order. Each has a `value` and a `label`. */
  stats: LogoCloudStatRailAboveGridStat[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudStatRailAboveGridCopy> = {
  en: {
    eyebrow: "Customer success",
    heading: "Achieve stronger results with partners",
    stats: [
      { value: "100%", label: "improvement in manual collection time" },
      { value: "16%", label: "uplift in conversion rate" },
      { value: "150", label: "countries reached after deploying Fasla" },
      { value: "< 12 mo", label: "to launch a live subscription offering" },
    ],
  },
  ar: {
    eyebrow: "نجاح العملاء",
    heading: "حقّق نتائج أقوى مع الشركاء",
    stats: [
      { value: "100%", label: "تحسّن في وقت التحصيل اليدوي" },
      { value: "16%", label: "ارتفاع في معدل التحويل" },
      { value: "150", label: "دولة تم الوصول إليها بعد اعتماد فاصلة" },
      {
        value: (
          <>
            أقل من <bdi dir="ltr">12</bdi> شهرًا
          </>
        ),
        label: "لإطلاق خدمة اشتراك فعليّة",
      },
    ],
  },
}

/** Arabic letters. Text without any is Latin: a figure or a brand name. */
const ARABIC = /[\u0600-\u06FF]/

/** Figma's grid: eight marks, two rows of four at Desktop. */
const PLACEHOLDERS = 8

export interface LogoCloudStatRailAboveGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudStatRailAboveGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks in the grid, in reading order. None by default: each cell shows
   * a `muted` placeholder of a mark's size.
   * @default none: eight `muted` placeholders
   */
  logos?: LogoCloudStatRailAboveGridLogo[]
}

export function LogoCloudStatRailAboveGrid({
  locale = "en",
  eyebrow,
  heading,
  stats,
  logos = [],
  className,
  ...props
}: LogoCloudStatRailAboveGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const kicker = eyebrow === undefined ? copy.eyebrow : eyebrow
  const rail = stats ?? copy.stats
  const cells = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-2">
          {kicker ? <p className="text-sm font-medium text-primary">{kicker}</p> : null}
          <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            {heading ?? copy.heading}
          </h2>
        </header>

        {rail.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
            {rail.map((stat, index) => (
              <li key={index} className="flex flex-col gap-1 border-s-2 border-border ps-5">
                {typeof stat.value === "string" && !ARABIC.test(stat.value) ? (
                  <p className="font-sans text-xl font-semibold leading-7 text-foreground">
                    <bdi dir="ltr">{stat.value}</bdi>
                  </p>
                ) : (
                  <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                )}
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="overflow-hidden rounded-md border border-border">
          <ul aria-hidden={logos.length === 0 || undefined} className="-mb-px -me-px grid grid-cols-2 lg:grid-cols-4">
            {cells.map((item, index) => (
              <li key={index} className="flex h-20 items-center justify-center border-b border-e border-border px-4 md:h-24 lg:h-28">
                {item ? (
                  <>
                    <span className="sr-only">{item.name}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-5 max-w-[88px] items-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
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
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudStatRailAboveGridCopy = COPY

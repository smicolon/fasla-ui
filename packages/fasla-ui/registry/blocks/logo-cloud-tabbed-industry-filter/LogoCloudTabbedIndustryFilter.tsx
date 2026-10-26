"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Tabbed Industry Filter.
 *
 * A centred header, a row of Bordered tabs, one per industry, and under them
 * a bordered grid of the logos tagged with the active industry. The logos are
 * one list: each carries the industries it belongs to, and each tab's panel
 * shows the logos tagged with it, in the list's order. The tabs are the
 * library's: arrow keys move between them and the panel follows.
 *
 * The grid is four columns at Desktop and two below, with a hairline between
 * cells. Each cell draws its end and bottom edges and the grid is pulled out
 * by 1px under its rounded frame, which clips the last column's and last
 * row's lines, so a part-filled last row still closes cleanly.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudTabbedIndustryFilterLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its cell, keeping its proportions. */
  logo: React.ReactNode
  /** The `value`s of the industries it is shown under. */
  industries: string[]
}

export interface LogoCloudTabbedIndustryFilterIndustry {
  /** Identifies the industry: the tab, and the logos tagged with it. */
  value: string
  label: React.ReactNode
}

export interface LogoCloudTabbedIndustryFilterCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode
  /** The tabs, in order. Each industry has a `value` that logos are tagged with and a `label`. */
  industries: LogoCloudTabbedIndustryFilterIndustry[]
  /** The tab row's name for screen readers. */
  filterLabel: string
  /** Shown in place of the grid when the active industry has no logos. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudTabbedIndustryFilterCopy> = {
  en: {
    heading: "Trusted across every industry",
    description: "Filter by sector to see the teams closest to your own.",
    industries: [
      { value: "finance", label: "Finance" },
      { value: "health", label: "Health" },
      { value: "retail", label: "Retail" },
      { value: "technology", label: "Technology" },
    ],
    filterLabel: "Industries",
    empty: "No customers in this industry yet.",
  },
  ar: {
    heading: "موثوق به في كل القطاعات",
    description: "صنِّف حسب القطاع لترى الفرق الأقرب إلى فريقك.",
    industries: [
      { value: "finance", label: "التمويل" },
      { value: "health", label: "الصحة" },
      { value: "retail", label: "التجزئة" },
      { value: "technology", label: "التقنية" },
    ],
    filterLabel: "القطاعات",
    empty: "لا يوجد عملاء في هذا القطاع بعد.",
  },
}

const CELL = "flex h-20 items-center justify-center border-b border-e border-border md:h-24 lg:h-[108px]"

/** Figma's grid holds eight logos. */
const PLACEHOLDERS = 8

export interface LogoCloudTabbedIndustryFilterProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudTabbedIndustryFilterCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Every logo, each tagged with the industries it belongs to. A tab shows
   * the logos tagged with its `value`, in this order. None by default: the
   * grid shows `muted` placeholders.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudTabbedIndustryFilterLogo[]
  /** The industry open at first, by `value`. The first industry, by default. */
  defaultIndustry?: string
  /** Called with the industry's `value` when the visitor picks a tab. */
  onIndustryChange?: (industry: string) => void
}

export function LogoCloudTabbedIndustryFilter({
  locale = "en",
  heading,
  description,
  industries,
  filterLabel,
  empty,
  logos = [],
  defaultIndustry,
  onIndustryChange,
  className,
  ...props
}: LogoCloudTabbedIndustryFilterProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const tabs = industries ?? copy.industries

  const grid = (children: React.ReactNode) => (
    <div className="w-full overflow-hidden rounded-md border border-border">
      <div className="-mb-px -me-px">{children}</div>
    </div>
  )

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-10">
        <header className="flex w-full flex-col gap-3 text-center">
          <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
        </header>

        <Tabs
          defaultValue={defaultIndustry ?? tabs[0]?.value}
          onValueChange={(value) => onIndustryChange?.(String(value))}
          className="flex flex-col items-center gap-10"
        >
          <div className="-m-[3px] max-w-[calc(100%+6px)] overflow-x-auto p-[3px]">
            <TabsList variant="bordered" size="sm" aria-label={filterLabel ?? copy.filterLabel}>
              {tabs.map((industry) => (
                <TabsTrigger key={industry.value} value={industry.value}>
                  {industry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((industry) => {
            const shown = logos.filter((item) => item.industries.includes(industry.value))
            return (
              <TabsContent key={industry.value} value={industry.value} className="mt-0 w-full">
                {logos.length === 0 ? (
                  grid(
                    <div aria-hidden="true" className="grid grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: PLACEHOLDERS }, (_, index) => (
                        <div key={index} className={CELL}>
                          <span className="h-5 w-16 rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
                        </div>
                      ))}
                    </div>
                  )
                ) : shown.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
                ) : (
                  grid(
                    <ul className="grid grid-cols-2 lg:grid-cols-4">
                      {shown.map((item, index) => (
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
                  )
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudTabbedIndustryFilterCopy = COPY

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Logo Metric Tiles.
 *
 * A heading and a line of text, then a grid of cards, each pairing a mark
 * with one figure: the mark at the top, a hairline under it, the figure in
 * display type and what it measures. The figures name no company: the
 * marks are real ones, and the pairing is the example's, not a claim.
 *
 * One column on a phone, two from Tablet and three at Desktop. The mark
 * steps from 20 to 28px tall and the figure from `text-xl` to `text-3xl`.
 *
 * Figma draws the hairline with its Separator component; the code registry
 * has no Separator, so it is an `hr` in the `border` token. Each card's
 * content starts at the start edge, so in Arabic it sits on the right. The
 * marks are never mirrored. A figure with no Arabic in it keeps Geist and the
 * English line height in Arabic, as Figma's RTL variants set it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudLogoMetricTilesLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudLogoMetricTilesTile {
  /** The figure, in display type. */
  value: React.ReactNode
  /** What the figure measures. */
  label: React.ReactNode
  /** The mark the figure sits under. Without it, the card shows a `muted` placeholder of a mark's size. */
  logo?: LogoCloudLogoMetricTilesLogo
}

export interface LogoCloudLogoMetricTilesCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode
  /** The cards, in order. Each has a `value`, a `label` and the `logo` it pairs with. */
  tiles: LogoCloudLogoMetricTilesTile[]
}

/** Figma's copy, English and Arabic. No tile carries a mark: pass them in `tiles`. */
const COPY: Record<"en" | "ar", LogoCloudLogoMetricTilesCopy> = {
  en: {
    heading: "The numbers behind the logos",
    description: "What changed for teams in their first year on Fasla.",
    tiles: [
      { value: "+38%", label: "faster design-to-dev handoff" },
      { value: "2.4×", label: "more components reused per release" },
      { value: "−61%", label: "time spent on spec rework" },
      { value: "11 days", label: "saved per launch cycle" },
      { value: "99.98%", label: "uptime across audit workflows" },
      { value: "4,200", label: "design tokens kept in sync" },
    ],
  },
  ar: {
    heading: "الأرقام خلف الشعارات",
    description: "ما الذي تغيّر للفرق في عامها الأول على فاصلة.",
    tiles: [
      { value: "+38%", label: "تسليم أسرع من التصميم إلى التطوير" },
      { value: "2.4×", label: "مكوّنات مُعاد استخدامها في كل إصدار" },
      { value: "−61%", label: "من الوقت المُنفَق على إعادة صياغة المواصفات" },
      {
        value: (
          <>
            <bdi dir="ltr">11</bdi> يومًا
          </>
        ),
        label: "مُوفَّرة في كل دورة إطلاق",
      },
      { value: "99.98%", label: "جاهزية عبر مسارات التدقيق" },
      { value: "4,200", label: "رمز تصميم مُتزامن" },
    ],
  },
}

/** Arabic letters. Text without any is Latin: a figure or a brand name. */
const ARABIC = /[\u0600-\u06FF]/

export interface LogoCloudLogoMetricTilesProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudLogoMetricTilesCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function LogoCloudLogoMetricTiles({
  locale = "en",
  heading,
  description,
  tiles,
  className,
  ...props
}: LogoCloudLogoMetricTilesProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const list = tiles ?? copy.tiles

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-3">
          <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
        </header>

        {list.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((tile, index) => (
              <li key={index} className="flex flex-col gap-5 rounded-lg bg-card p-8 ring-1 ring-inset ring-border forced-colors:border">
                {tile.logo ? (
                  <>
                    <span className="sr-only">{tile.logo.name}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-5 max-w-[88px] items-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                    >
                      {tile.logo.logo}
                    </span>
                  </>
                ) : (
                  <span aria-hidden="true" className="h-5 w-[72px] rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
                )}
                <hr className="border-border" />
                {typeof tile.value === "string" && !ARABIC.test(tile.value) ? (
                  <p className="font-sans text-xl font-semibold leading-7 text-card-foreground md:text-2xl md:leading-8 lg:text-3xl lg:leading-10">
                    <bdi dir="ltr">{tile.value}</bdi>
                  </p>
                ) : (
                  <p className="text-xl font-semibold text-card-foreground md:text-2xl lg:text-3xl">{tile.value}</p>
                )}
                <p className="text-sm text-muted-foreground">{tile.label}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudLogoMetricTilesCopy = COPY

"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Side Label Rail.
 *
 * A short label and a Badge, then the marks in a ruled grid: a box with a
 * hairline between every cell and a crosshair at each outer corner. On a
 * desktop the label is a narrow column at the start of the row and the grid
 * holds five marks across; on a tablet and a phone the label sits above a
 * grid two marks across.
 *
 * The rules are each cell's bottom and end border. The grid overhangs its
 * box by a pixel on every side and the box clips it: the box's border sits
 * over the grid's edge, as Figma's inside stroke does, so the box is exactly
 * its rows tall and the last column's and last row's rules disappear under
 * the border at any count of marks.
 * Borders, corners and the label column are all logical, so in Arabic the
 * label moves to the right and the grid fills from the right, as Figma's RTL
 * variants draw them, with the same list of logos. The marks themselves are
 * never mirrored.
 *
 * No logos come with the block: pass `logos`. Until then each cell shows a
 * `muted` placeholder of a mark's size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudSideLabelRailLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudSideLabelRailCopy {
  /** The small label at the start. With the Badge, it names the section for screen readers. */
  label: React.ReactNode
  /** The Badge after the label. Hidden when null. */
  badge: React.ReactNode | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudSideLabelRailCopy> = {
  en: {
    label: "Trusted by",
    badge: "Leaders",
  },
  ar: {
    label: "موثوق به لدى",
    badge: "روّاد القطاع",
  },
}

/** How many cells Figma draws, and so how many placeholders show without logos. */
const PLACEHOLDERS = 10

/** Figma's crosshairs: 14px, 8px out from each of the box's outer corners. */
const CORNERS = ["-start-2 -top-2", "-end-2 -top-2", "-bottom-2 -start-2", "-bottom-2 -end-2"]

export interface LogoCloudSideLabelRailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudSideLabelRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: each a `name` and a `logo`. None by default:
   * each cell shows a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudSideLabelRailLogo[]
}

export function LogoCloudSideLabelRail({ locale = "en", label, badge, logos = [], className, ...props }: LogoCloudSideLabelRailProps) {
  const copy = COPY[locale]
  const labelId = React.useId()
  const tag = badge === undefined ? copy.badge : badge
  const cells = logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={labelId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div id={labelId} className="flex flex-wrap items-center gap-3 lg:w-[200px] lg:shrink-0 lg:flex-col lg:items-start">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{label ?? copy.label}</p>
          {tag ? (
            <Badge variant="outline" tone="secondary" radius="standard" className="uppercase">
              {tag}
            </Badge>
          ) : null}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="overflow-hidden rounded-md border border-border">
            <ul className="-m-px grid grid-cols-2 lg:grid-cols-5">
              {cells.map((item, index) => (
                <li key={index} className="flex px-2 h-20 min-w-0 items-center justify-center border-b border-e border-border md:h-[88px] lg:h-[104px]">
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
          {CORNERS.map((corner) => (
            <Plus
              key={corner}
              aria-hidden="true"
              size={14}
              strokeWidth={1.5}
              absoluteStrokeWidth
              className={cn("absolute text-muted-foreground", corner)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudSideLabelRailCopy = COPY

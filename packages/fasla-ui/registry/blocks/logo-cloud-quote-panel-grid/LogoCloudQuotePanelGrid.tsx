"use client"

import * as React from "react"
import { Quote } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Quote Panel Grid.
 *
 * A short heading over two parts side by side: a testimonial on an inverted
 * panel, and the marks in a ruled grid of equal cells. The panel is painted
 * with the inverse tokens, the only way Fasla inverts a surface, so it is
 * dark in Light and light in Dark and never forces a `.dark` class; the
 * theme-inverse registry item maps the tokens.
 *
 * Desktop puts the panel at the start, 440px wide and as tall as the grid,
 * with the attribution held to its bottom, and the grid in four columns.
 * Tablet and Mobile stack the panel over a two-column grid. The cells keep
 * Figma's heights (96, 72 and 76px) and each mark is scaled to Figma's
 * height for that breakpoint, never past its width cap.
 *
 * Mirroring comes from the page's `dir`: the panel moves to the start side,
 * the grid's rules sit on each cell's end and bottom edges, and the marks
 * keep their order. The quote mark and the marks are never flipped.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudQuotePanelGridLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudQuotePanelGridAttribution {
  /** Who said it. Also the source of the avatar's initials. */
  name: string
  /** Their role, under the name. */
  role: React.ReactNode
  /** Their photo. None by default: the avatar shows the initials of `name`. */
  avatar?: string
}

export interface LogoCloudQuotePanelGridCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when `null`. */
  description: React.ReactNode
  /** The testimonial on the panel. Name no company: the marks are real ones. */
  quote: React.ReactNode
  /** Who said it: `name`, `role` and an optional `avatar` photo. */
  attribution: LogoCloudQuotePanelGridAttribution
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudQuotePanelGridCopy> = {
  en: {
    heading: "Customers.",
    description: "Trusted by the world’s leading enterprises.",
    quote: "Fasla gave our twelve product teams one shared language. Handoff time dropped by half in the first quarter.",
    attribution: { name: "Dana Whitfield", role: "VP Product" },
  },
  ar: {
    heading: "العملاء.",
    description: "موثوق به لدى كبرى المؤسسات في العالم.",
    quote: "منحت فاصلة فرق المنتج الاثني عشر لدينا لغة مشتركة واحدة. وانخفض وقت التسليم إلى النصف في الربع الأول.",
    attribution: { name: "دانا ويتفيلد", role: "نائبة رئيس المنتج" },
  },
}

/** Figma's count of cells: what the grid keeps, as placeholders, while no logos are passed. */
const PLACEHOLDERS = 16

export interface LogoCloudQuotePanelGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudQuotePanelGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The marks, in reading order: four to a row on Desktop, two on Tablet and
   * Mobile. None by default: each of Figma's 16 cells shows a `muted` placeholder.
   * @default none: 16 `muted` placeholders
   */
  logos?: LogoCloudQuotePanelGridLogo[]
}

export function LogoCloudQuotePanelGrid({
  locale = "en",
  heading,
  description,
  quote,
  attribution,
  logos = [],
  className,
  ...props
}: LogoCloudQuotePanelGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const lead = description === undefined ? copy.description : description
  const who = attribution ?? copy.attribution
  const cells: (LogoCloudQuotePanelGridLogo | null)[] =
    logos.length > 0 ? logos : Array.from({ length: PLACEHOLDERS }, () => null)

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h2 id={headingId} className="text-lg font-semibold text-foreground md:text-xl lg:text-2xl">
            {heading ?? copy.heading}
          </h2>
          {lead ? <p className="text-lg text-muted-foreground">{lead}</p> : null}
        </header>

        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:gap-6">
          <figure className="flex flex-col gap-8 rounded-lg bg-background-inverse p-10 lg:w-[440px] lg:shrink-0">
            <div className="flex flex-1 flex-col gap-5">
              <Quote aria-hidden="true" size={28} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground-inverse" />
              <blockquote className="text-lg text-foreground-inverse md:text-xl">{quote ?? copy.quote}</blockquote>
            </div>
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
                <p className="text-sm font-semibold text-foreground-inverse">{who.name}</p>
                <p className="text-xs text-muted-foreground-inverse">{who.role}</p>
              </div>
            </figcaption>
          </figure>

          {/* The rules: every cell draws its end and bottom edges, and the box
              clips the last column's and last row's, so only inner lines show. */}
          <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-border lg:self-start">
            <ul className="-mb-px -me-px grid grid-cols-2 lg:grid-cols-4">
              {cells.map((item, index) => (
                <li
                  key={item ? `${item.name}-${index}` : index}
                  className="flex h-[76px] items-center justify-center border-b border-e border-border px-3 md:h-[72px] lg:h-24"
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
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudQuotePanelGridCopy = COPY

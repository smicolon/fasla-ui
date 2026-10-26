"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Scatter Field.
 *
 * Twelve logo tiles scattered over a faint lattice of `muted` squares, around
 * a centred message on a `background` card: a heading, a line of text and a
 * button. The lattice is decoration; the tiles are the list of logos.
 *
 * From Tablet up the stage is a fixed height and each tile is placed at
 * Figma's offset. Across the width an offset is a share of the room the tile
 * can move in (the stage less one tile), so at Figma's 640 and 1248 the tiles
 * land on Figma's spots, and at any width between they spread or close up
 * without leaving the stage. The message card narrows with the stage, so the
 * tiles beside it are never covered. On a phone the tiles sit in two rows of
 * six, above and below the message, as Figma's Mobile does.
 *
 * Offsets are logical (`start`), so in Arabic the field mirrors: the first
 * tile sits at the top right. The logos themselves are never flipped. Figma's
 * RTL variants keep the LTR positions; the code mirrors, as every block does.
 *
 * The heading breaks where Figma's does, after its first phrase. At Tablet
 * the Arabic heading is one step smaller, as Figma sets it, so its second
 * phrase still fits on one line.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudScatterFieldLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its tile, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudScatterFieldAction {
  label: React.ReactNode
  href: string
}

export interface LogoCloudScatterFieldCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode
  /** The button under the text. Hidden when null. */
  action: LogoCloudScatterFieldAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", LogoCloudScatterFieldCopy> = {
  en: {
    heading: (
      <>
        Seamless integrations
        <br />
        with your entire stack
      </>
    ),
    description: "Fasla connects to the tools your team already lives in — no glue code required.",
    action: { label: "See all integrations", href: "#integrations" },
  },
  ar: {
    heading: (
      <>
        تكاملات سلسة
        <br />
        مع منظومتك التقنية بالكامل
      </>
    ),
    description: "تتصل فاصلة بالأدوات التي يعمل بها فريقك يوميًا، دون الحاجة إلى شيفرة ربط.",
    action: { label: "اطّلع على كل التكاملات", href: "#integrations" },
  },
}

/*
 * Each of the twelve spots, in Figma's order. On a phone: six across the top
 * and six across the bottom, evenly spread. From Tablet up: `start` is the
 * tile's Figma offset as a share of the stage less one tile (x / 592 at
 * Tablet, x / 1184 at Desktop), `top` is Figma's offset in pixels.
 */
const SPOTS = [
  "top-2 start-0 md:top-5 md:start-[calc((100%-48px)*0.1166)] lg:top-3 lg:start-[calc((100%-64px)*0.0498)]",
  "top-2 start-[calc((100%-40px)*0.2)] md:top-5 md:start-[calc((100%-48px)*0.2804)] lg:top-3 lg:start-[calc((100%-64px)*0.2162)]",
  "top-2 start-[calc((100%-40px)*0.4)] md:top-5 md:start-[calc((100%-48px)*0.5203)] lg:top-3 lg:start-[calc((100%-64px)*0.4578)]",
  "top-2 start-[calc((100%-40px)*0.6)] md:top-5 md:start-[calc((100%-48px)*0.7601)] lg:top-3 lg:start-[calc((100%-64px)*0.6976)]",
  "top-2 start-[calc((100%-40px)*0.8)] md:top-5 md:start-[calc((100%-48px)*0.9459)] lg:top-3 lg:start-[calc((100%-64px)*0.9451)]",
  "top-2 start-[calc(100%-40px)] md:top-[362px] md:start-[calc((100%-48px)*0.0676)] lg:top-[246px] lg:start-[calc((100%-64px)*0.0101)]",
  "top-[calc(100%-48px)] start-0 md:top-[362px] md:start-[calc((100%-48px)*0.2534)] lg:top-[350px] lg:start-[calc((100%-64px)*0.1723)]",
  "top-[calc(100%-48px)] start-[calc((100%-40px)*0.2)] md:top-[362px] md:start-[calc((100%-48px)*0.5068)] lg:top-[366px] lg:start-[calc((100%-64px)*0.4527)]",
  "top-[calc(100%-48px)] start-[calc((100%-40px)*0.4)] md:top-[362px] md:start-[calc((100%-48px)*0.7601)] lg:top-[366px] lg:start-[calc((100%-64px)*0.7069)]",
  "top-[calc(100%-48px)] start-[calc((100%-40px)*0.6)] md:top-[362px] md:start-[calc((100%-48px)*0.9459)] lg:top-[366px] lg:start-[calc((100%-64px)*0.9451)]",
  "top-[calc(100%-48px)] start-[calc((100%-40px)*0.8)] md:top-[186px] md:start-[calc((100%-48px)*0.0135)] lg:top-[158px] lg:start-[calc((100%-64px)*0.902)]",
  "top-[calc(100%-48px)] start-[calc(100%-40px)] md:top-[166px] md:start-[calc((100%-48px)*0.9932)] lg:top-[149px] lg:start-[calc((100%-64px)*0.0921)]",
]

/** The lattice behind the tiles: Figma's 14 × 5 grid of 72px squares on a 96px pitch. */
const LATTICE = Array.from({ length: 70 }, (_, index) => index)

const TILE =
  "absolute flex size-10 items-center justify-center rounded-lg border border-border bg-card shadow md:size-12 lg:size-16"

export interface LogoCloudScatterFieldProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudScatterFieldCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The logos, one per tile, in Figma's order: the five along the top, then
   * the five along the bottom and the two beside the message (on a phone,
   * six above the message and six below). Twelve spots; logos past the
   * twelfth are not shown. None by default: each tile is a `muted` placeholder.
   * @default none: `muted` placeholders
   */
  logos?: LogoCloudScatterFieldLogo[]
}

export function LogoCloudScatterField({
  locale = "en",
  heading,
  description,
  action,
  logos = [],
  className,
  ...props
}: LogoCloudScatterFieldProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const button = action === undefined ? copy.action : action

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:px-24 lg:py-24", className)} {...props}>
      <div className="relative mx-auto flex min-h-[470px] w-full max-w-[1248px] items-center justify-center overflow-hidden rounded-xl py-14 md:h-[420px] md:min-h-0 md:py-0 lg:h-[440px]">
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-[repeat(14,72px)] content-start gap-6 p-2">
          {LATTICE.map((cell) => (
            <span key={cell} className="size-[72px] rounded-md bg-muted opacity-[0.55]" />
          ))}
        </div>

        {logos.length > 0 ? (
          <ul className="absolute inset-0">
            {logos.slice(0, SPOTS.length).map((item, index) => (
              <li key={index} className={cn(TILE, SPOTS[index])}>
                <span className="sr-only">{item.name}</span>
                <span
                  aria-hidden="true"
                  className="flex h-3 w-[34px] items-center justify-center text-muted-foreground md:h-[15px] md:w-[41px] lg:h-5 lg:w-[55px] [&>*]:h-auto [&>*]:max-h-full [&>*]:w-full [&>*]:max-w-full [&>img]:object-contain"
                >
                  {item.logo}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div aria-hidden="true" className="absolute inset-0">
            {SPOTS.map((spot, index) => (
              <span key={index} className={cn(TILE, spot)}>
                <span className="h-2.5 w-[30px] rounded-sm bg-muted md:h-3 md:w-9 lg:h-4 lg:w-12" />
              </span>
            ))}
          </div>
        )}

        <div className="relative flex w-full flex-col items-center gap-5 rounded-xl bg-background px-8 py-6 text-center md:w-[min(460px,calc(100%-160px))] lg:w-[min(620px,calc(100%-320px))]">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground md:text-4xl md:[&:dir(rtl)]:text-3xl lg:[&:dir(rtl)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
          {button ? (
            <a href={button.href} className={buttonVariants()}>
              {button.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudScatterFieldCopy = COPY

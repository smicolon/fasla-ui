"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Duo Card Hero.
 *
 * Two cards of equal weight. The copy card, in `primary`, carries the pitch:
 * a small eyebrow, the headline, a paragraph and two buttons. The media card
 * holds a portrait, with a quote panel resting on its foot: the customer's
 * words, who said them, and a row of four dots marking the first of several
 * quotes.
 *
 * Desktop sets the two cards side by side, each half the width and 620px
 * tall; the copy card pushes its buttons to the bottom. Tablet stacks the copy
 * card over the media card (460px tall). Mobile stacks them too, with a 400px
 * media card and the buttons full width, one over the other.
 *
 * In Arabic the cards swap sides on Desktop, the copy and the quote read from
 * the right, and the filled dot moves to the right end of its row. Numbers
 * stay left to right. The portrait is never flipped.
 *
 * Figma's Mobile lets the dots run past the end of the quote panel: the name
 * keeps to one line and pushes them out. Here the name wraps instead and the
 * dots keep their room, so nothing leaves its row.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroDuoCardAction {
  label: React.ReactNode
  href: string
}

export interface HeroDuoCardPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroDuoCardCopy {
  /** The small line above the headline. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The light button. */
  primaryAction: HeroDuoCardAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: HeroDuoCardAction | null
  /** The quote on the media card, its marks included. The panel is hidden when empty. */
  quote: React.ReactNode
  /** Who said it, under the quote. */
  author: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroDuoCardCopy> = {
  en: {
    eyebrow: "GLOBAL PAYROLL",
    headline: "Hire anywhere. Pay everyone.",
    description: (
      <>
        Contracts, compliance and payroll for <bdi dir="ltr">150+</bdi> countries — one invoice, zero entities, no surprises
        at the border.
      </>
    ),
    primaryAction: { label: "Speak to sales", href: "#sales" },
    secondaryAction: { label: "How it works", href: "#how-it-works" },
    quote: "“We signed engineers in Lisbon, Lagos and Manila in the same sprint. Legal never blinked.”",
    author: "Dana Whitfield · Head of People, Initech",
  },
  ar: {
    eyebrow: "رواتب عالمية",
    headline: "وظّف من أي مكان، وادفع للجميع.",
    description: (
      <>
        العقود والامتثال والرواتب في أكثر من <bdi dir="ltr">150</bdi> دولة: فاتورة واحدة، بلا كيانات، وبلا مفاجآت على الحدود.
      </>
    ),
    primaryAction: { label: "تحدث مع المبيعات", href: "#sales" },
    secondaryAction: { label: "طريقة العمل", href: "#how-it-works" },
    quote: "«تعاقدنا مع مهندسين في لشبونة ولاغوس ومانيلا في الدورة نفسها، ولم يتردد الفريق القانوني لحظة.»",
    author: "دانة يوسف، مديرة الموارد البشرية في سند",
  },
}

/** Figma draws four dots, the first filled. */
const DOTS = 4

export interface HeroDuoCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroDuoCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The portrait that fills the media card. None by default: a `muted`
   * placeholder of the same size.
   * @default none: a `muted` placeholder
   */
  photo?: HeroDuoCardPhoto
}

export function HeroDuoCard({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  quote,
  author,
  photo,
  className,
  ...props
}: HeroDuoCardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const words = quote ?? copy.quote

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-3 p-4 [@container(min-width:48rem)]:gap-4 [@container(min-width:48rem)]:p-6 [@container(min-width:90rem)]:min-h-[700px] [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:p-10">
        <div className="flex flex-col gap-4 rounded-xl bg-primary px-12 py-14 [@container(min-width:90rem)]:min-w-0 [@container(min-width:90rem)]:flex-1 [@container(min-width:90rem)]:justify-between">
          <div className="flex flex-col gap-3">
            {label ? <p className="text-sm font-medium text-primary-foreground">{label}</p> : null}
            <h1
              id={headingId}
              className="whitespace-pre-line text-3xl font-semibold text-primary-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:90rem)]:text-5xl"
            >
              {headline ?? copy.headline}
            </h1>
            <p className="text-pretty text-base text-primary-foreground [@container(min-width:48rem)]:text-lg">
              {description ?? copy.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 [@container(min-width:48rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                // Figma sets the ghost label in `primary-foreground` to read on
                // the card; the hover tint follows it, so the label stays legible.
                className={buttonVariants({
                  variant: "ghost",
                  tone: "secondary",
                  size: "lg",
                  className: "text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/10",
                })}
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>

        {/*
           * The portrait card is Figma's height at least (400 on Mobile, 460 on
           * Tablet, the row's on Desktop), and grows with a longer quote or
           * larger text, so the panel never runs off its top.
           */}
        <div className="relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl bg-muted p-4 [@container(min-width:48rem)]:min-h-[460px] [@container(min-width:90rem)]:min-h-0 [@container(min-width:90rem)]:min-w-0 [@container(min-width:90rem)]:flex-1 [@container(min-width:90rem)]:p-6">
          {photo ? (
            <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
          ) : null}
          {words ? (
            <figure className="relative flex flex-col gap-3 rounded-lg bg-background p-5 shadow-md">
              <blockquote className="text-pretty text-sm text-foreground">
                <p>{words}</p>
              </blockquote>
              <div className="flex items-center justify-between gap-2">
                <figcaption className="min-w-0 text-xs text-muted-foreground">{author ?? copy.author}</figcaption>
                {/* Decoration: Figma draws the dots, not controls. The first is filled. */}
                <div aria-hidden className="flex shrink-0 items-center gap-1.5">
                  {Array.from({ length: DOTS }, (_, index) => (
                    <span key={index} className={cn("size-2 rounded-full", index === 0 ? "bg-primary" : "bg-border")} />
                  ))}
                </div>
              </div>
            </figure>
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
export const heroDuoCardCopy = COPY

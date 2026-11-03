"use client"

import * as React from "react"
import {
  enter,
  HowItWorksHeader,
  HowItWorksImage,
  HowItWorksLtr,
  HowItWorksScrim,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Overlay Numeral Cards.
 *
 * A left-aligned header, then four photo cards 440px tall. Each carries a large
 * numeral, a title and a line at its foot, set on a dark scrim so the white text
 * reads on any photo. The scrim is a stack of flat `base-black` layers, lightest
 * over the whole card and strongest at its foot, and the text is `base-white`:
 * both stay the same in Light and in Dark (Figma's `custom/black` would flip).
 *
 * Desktop sets the cards four across, Tablet two by two at 360px, Mobile one
 * column of 240px cards with the numeral beside the label. The page's `dir`
 * mirrors the order and the text.
 *
 * Motion plays once, when the block comes into view: each card clips open from
 * its foot (100ms apart in reading order) while its numeral rises from 24px
 * lower, so it reads as parallax against the photo. Hovering a card deepens the
 * scrim, grows the photo to 104% and lifts the numeral 6px (250ms). Under
 * reduced motion the block is its finished state and a hover changes only the
 * scrim.
 *
 * Content limits: the heading up to 52 characters, the line up to 60. A
 * card's title up to 14 characters and its line up to 28.
 */

export interface HowItWorksOverlayNumeralCard {
  /** Keys the card. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksOverlayNumeralCardsCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  /** The cards, in order. The numerals are drawn from 01. */
  cards: HowItWorksOverlayNumeralCard[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksOverlayNumeralCardsCopy> = {
  en: {
    eyebrow: "Four steps",
    heading: "How a project moves from question to shipped screen",
    description: "Each step below is one working session, not a whole phase.",
    cards: [
      { id: "align", title: "Align", description: "Everything on the wall" },
      { id: "sketch", title: "Sketch", description: "Paper before pixels" },
      { id: "design", title: "Design", description: "Screens on a shared board" },
      { id: "review", title: "Review", description: "The team walks it together" },
    ],
  },
  ar: {
    eyebrow: "أربع خطوات",
    heading: "كيف ينتقل المشروع من سؤال إلى شاشة جاهزة",
    description: "كل خطوة أدناه جلسة عمل واحدة، لا مرحلة كاملة.",
    cards: [
      { id: "align", title: "المواءمة", description: "كل شيء على الحائط" },
      { id: "sketch", title: "الرسم", description: "الورق قبل البكسل" },
      { id: "design", title: "التصميم", description: "شاشات على لوح مشترك" },
      { id: "review", title: "المراجعة", description: "الفريق يستعرضها معًا" },
    ],
  },
}

export interface HowItWorksOverlayNumeralCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksOverlayNumeralCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * One photo per card, in order. A card without one shows a `muted` box.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksOverlayNumeralCards({ locale = "en", eyebrow, heading, description, cards, photos, className, ...props }: HowItWorksOverlayNumeralCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = cards ?? copy.cards

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    revealTargets(node, "card").forEach((card, index) => {
      const delay = index * 100
      started.push(enter(card, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 600, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }))
      const numeral = card.querySelector<HTMLElement>('[data-reveal="numeral"]')
      if (numeral) started.push(enter(numeral, [{ transform: "translateY(24px)" }, { transform: "none" }], { duration: 700, delay: delay + 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }))
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <HowItWorksHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} headingClassName="[@container(min-width:64rem)]:text-4xl" descriptionClassName="max-w-none" />

      <ol className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
        {list.map((card, index) => (
          <li
            key={card.id}
            data-reveal="card"
            className="group relative flex h-60 min-w-0 flex-col justify-end overflow-hidden rounded-[10px] bg-muted p-6 [@container(min-width:40rem)]:h-[420px] [@container(min-width:64rem)]:h-[440px]"
          >
            <div className="absolute inset-0 transition-transform duration-[250ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <HowItWorksImage photo={photos?.[index]} />
            </div>
            <HowItWorksScrim />
            <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base-white [@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:gap-1">
              <span data-reveal="numeral" className="block transition-transform duration-[250ms] ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <span className="block text-2xl font-semibold leading-none [@container(min-width:40rem)]:text-6xl">
                  <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
                </span>
              </span>
              <h3 className="text-lg font-medium">{card.title}</h3>
              <p className="basis-full text-sm text-base-white/85 [@container(min-width:40rem)]:basis-auto">{card.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksOverlayNumeralCardsCopy = COPY

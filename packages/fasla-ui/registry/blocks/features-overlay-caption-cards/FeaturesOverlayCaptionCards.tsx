"use client"

import * as React from "react"
import { FeaturesHeader, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Overlay Caption Cards.
 *
 * A header (an eyebrow and the heading), then three tall photo cards. A card
 * is the photo with a half-strength `background-inverse` scrim over it and
 * its caption at the bottom: a 20px title and a 14px line in the inverse
 * tokens, 24px from the edge.
 *
 * Desktop sets the three across at 460px tall, Tablet two across (the third
 * on its own row) at 420px, and Mobile stacks them at 280px. A card's photo
 * grows slightly on hover. Without a photo the card is plain
 * `background-inverse`.
 *
 * Content limits: a card's title up to 24 characters and its line up to 64.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesOverlayCaptionCard {
  /** Keys the card. */
  id: string
  /** The card's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
  /** The card's photo. */
  image?: FeaturesPhoto
}

export interface FeaturesOverlayCaptionCardsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The cards, in order. */
  cards: FeaturesOverlayCaptionCard[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesOverlayCaptionCardsCopy> = {
  en: {
    eyebrow: "USE CASES",
    heading: "One system, three very different jobs",
    cards: [
      { id: "product", title: "Product teams", description: "Ship the roadmap without a weekly status meeting." },
      { id: "operations", title: "Operations", description: "Turn recurring work into templates anyone can run." },
      { id: "leadership", title: "Leadership", description: "A live view of delivery that never needs to be rebuilt." },
    ],
  },
  ar: {
    eyebrow: "حالات الاستخدام",
    heading: "نظام واحد لثلاث مهام مختلفة تمامًا",
    cards: [
      { id: "product", title: "فرق المنتج", description: "أطلِق خارطة الطريق دون اجتماع أسبوعي لمتابعة الحالة." },
      { id: "operations", title: "العمليات", description: "حوّل العمل المتكرر إلى قوالب يستطيع أي شخص تشغيلها." },
      { id: "leadership", title: "القيادة", description: "عرض حيّ لسير التسليم لا يحتاج إلى إعادة بناء أبدًا." },
    ],
  },
}

export interface FeaturesOverlayCaptionCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesOverlayCaptionCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesOverlayCaptionCards({ locale = "en", eyebrow, heading, cards, className, ...props }: FeaturesOverlayCaptionCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = cards ?? copy.cards

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} />
      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-6 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-3">
          {list.map((card) => (
            <li
              key={card.id}
              className="group relative isolate flex h-[280px] flex-col justify-end gap-2 overflow-hidden rounded-lg bg-background-inverse p-6 [@container(min-width:48rem)]:h-[420px] [@container(min-width:72rem)]:h-[460px]"
            >
              {card.image ? (
                <img
                  src={card.image.src}
                  alt={card.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-20 size-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
                />
              ) : null}
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background-inverse/50" />
              <h3 className="text-xl font-semibold text-foreground-inverse">{card.title}</h3>
              <p className="text-sm text-foreground-inverse">{card.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresOverlayCaptionCardsCopy = COPY

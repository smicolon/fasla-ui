"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofPhoto,
  SocialProofQuote,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Tinted-Panel Portrait.
 *
 * A portrait of the author centred on a panel in a 10% `info` tint, beside the
 * quote in XL and a row with the author's name and role at the start and a
 * link to the full story at the end. Desktop: a 480px square panel holding a
 * 340 by 380 portrait. Tablet: a 300 by 340 panel, a 220 by 260 portrait.
 * Phones: the panel full width and 300px tall above the quote, a 200 by 240
 * portrait, and the link under the author when the row runs out of room.
 */

export interface SocialProofTintedPanelPortraitLink {
  label: React.ReactNode
  href: string
}

export interface SocialProofTintedPanelPortraitCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** Up to 290 characters in English, 284 in Arabic. */
  quote: React.ReactNode
  /** The portrait is `photos[author.id]`. */
  author: SocialProofPerson
  /** The link to the full story. Hidden when empty. Up to 25 characters in English, 26 in Arabic. */
  link: SocialProofTintedPanelPortraitLink | null
}

const ADEL = { id: "adel-qasim" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofTintedPanelPortraitCopy> = {
  en: {
    label: "What customers say",
    quote: "“Fasla changed everything. We now build exactly what my team designs, pixel for pixel. Having that power and flexibility at our fingertips is a paradigm shift.”",
    author: { ...ADEL, name: "Adel Qasim", role: "Director of Brand Design, Forma Studio" },
    link: { label: "Customer story", href: "#" },
  },
  ar: {
    label: "ما يقوله العملاء",
    quote: "«غيّرت فاصلة كل شيء. صرنا نبني تمامًا ما يصممه فريقي، بكسلًا بكسل. وامتلاك هذه القوة والمرونة بين أيدينا غيّر طريقة تفكيرنا كلها.»",
    author: { ...ADEL, name: "عادل قاسم", role: "مدير تصميم العلامة، فورما ستوديو" },
    link: { label: "قصة عميل", href: "#" },
  },
}

export interface SocialProofTintedPanelPortraitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofTintedPanelPortraitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Photos by person id: the portrait is the author's. Without it the slot is empty. */
  photos?: SocialProofPhotos
}

export function SocialProofTintedPanelPortrait({
  locale = "en",
  label,
  quote,
  author,
  link,
  photos,
  className,
  ...props
}: SocialProofTintedPanelPortraitProps) {
  const copy = COPY[locale]
  const person = author ?? copy.author
  const more = link === undefined ? copy.link : link

  return (
    <SocialProofSection
      aria-label={label ?? copy.label}
      className={className}
      contentClassName="gap-8 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:gap-16"
      {...props}
    >
      <div
        className={cn(
          "flex h-[300px] w-full shrink-0 items-center justify-center rounded-xl bg-info/10",
          "[@container(min-width:40rem)]:h-[340px] [@container(min-width:40rem)]:w-[300px] [@container(min-width:64rem)]:size-[480px]"
        )}
      >
        <SocialProofPhoto
          src={photos?.[person.id]}
          className="h-[240px] w-[200px] rounded-lg [@container(min-width:40rem)]:h-[260px] [@container(min-width:40rem)]:w-[220px] [@container(min-width:64rem)]:h-[380px] [@container(min-width:64rem)]:w-[340px]"
        />
      </div>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-8 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-1">
        <SocialProofQuote quote={quote ?? copy.quote} className="text-xl text-foreground" />
        <figcaption className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <span className="flex flex-col gap-0.5">
            <cite className="text-sm font-medium not-italic text-foreground">{person.name}</cite>
            <span className="text-xs text-muted-foreground">
              <Isolated>{person.role}</Isolated>
            </span>
          </span>
          {more ? (
            <a
              href={more.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Isolated>{more.label}</Isolated>
              <ArrowRight aria-hidden size={16} className="rtl:rotate-180" />
            </a>
          ) : null}
        </figcaption>
      </figure>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofTintedPanelPortraitCopy = COPY

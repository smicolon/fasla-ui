"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Isolated, SocialProofQuote, SocialProofSection, type SocialProofLocale } from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Bracket-Framed Quote.
 *
 * One quote on a `card` panel, up to 800px wide, framed by four 20px corner
 * brackets drawn in 2px `foreground`: a label above the quote naming the
 * customer, the quote in LG, the author in `primary`, and a figure in 5XL
 * Light (4XL on phones) with what it measures. Desktop and Tablet set the
 * figure at the start and its label at the end; phones stack them.
 */

export interface SocialProofBracketFramedQuoteCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** The line above the quote. Up to 41 characters in English, 31 in Arabic. */
  eyebrow: React.ReactNode
  /** Up to 290 characters in English, 284 in Arabic. */
  quote: React.ReactNode
  /** The author and role, in `primary`. Up to 48 characters in English, 50 in Arabic. */
  author: React.ReactNode
  /** The figure. Up to 5 characters in English, 9 in Arabic. */
  stat: React.ReactNode
  /** What the figure measures. Up to 60 characters in English, 56 in Arabic. */
  statLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofBracketFramedQuoteCopy> = {
  en: {
    label: "What customers say",
    eyebrow: "VERIFIED CUSTOMER — ARVENNA BANK",
    quote: "“I've found Fasla to be a genuinely valuable thought partner. The relationship is as much about how we execute near-term as it is about where design is going.”",
    author: "FAHAD SALEM · BRAND DIRECTOR",
    stat: "99%",
    statLabel: "OF SCREENS PASS BRAND REVIEW ON FIRST SUBMISSION",
  },
  ar: {
    label: "ما يقوله العملاء",
    eyebrow: "عميل موثّق: بنك أرفينا",
    quote: "«وجدت في فاصلة شريكًا نتبادل معه الأفكار بحق، فعلاقتنا تشمل طريقة تنفيذنا اليوم بقدر ما تشمل مستقبل التصميم.»",
    author: "فهد سالم، مدير العلامة التجارية",
    stat: "99%",
    statLabel: "من الشاشات تجتاز مراجعة العلامة من أول محاولة",
  },
}

/** The four corner brackets, each drawing its two outer edges. */
const CORNERS = [
  "top-0 start-0 border-s-2 border-t-2",
  "top-0 end-0 border-e-2 border-t-2",
  "bottom-0 start-0 border-b-2 border-s-2",
  "bottom-0 end-0 border-b-2 border-e-2",
]

export interface SocialProofBracketFramedQuoteProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofBracketFramedQuoteCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
}

export function SocialProofBracketFramedQuote({
  locale = "en",
  label,
  eyebrow,
  quote,
  author,
  stat,
  statLabel,
  className,
  ...props
}: SocialProofBracketFramedQuoteProps) {
  const copy = COPY[locale]
  const line = eyebrow === undefined ? copy.eyebrow : eyebrow
  const figure = stat === undefined ? copy.stat : stat

  return (
    <SocialProofSection aria-label={label ?? copy.label} className={cn("lg:px-24", className)} contentClassName="max-w-[800px]" {...props}>
      <div className="relative flex w-full flex-col gap-6 bg-card p-12">
        {CORNERS.map((corner) => (
          <span key={corner} aria-hidden className={cn("pointer-events-none absolute size-5 border-foreground", corner)} />
        ))}
        {line ? (
          <p className="text-xs font-medium text-muted-foreground">
            <Isolated>{line}</Isolated>
          </p>
        ) : null}
        <figure className="m-0 flex flex-col gap-6">
          <SocialProofQuote quote={quote ?? copy.quote} className="text-lg text-foreground" />
          <figcaption className="text-xs font-medium text-primary">
            <cite className="not-italic">
              <Isolated>{author ?? copy.author}</Isolated>
            </cite>
          </figcaption>
        </figure>
        {figure ? (
          <p className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-end [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
            <span className="text-4xl font-light text-foreground [@container(min-width:40rem)]:text-5xl">
              <bdi dir="ltr">{figure}</bdi>
            </span>
            <span className="text-xs font-medium text-muted-foreground [@container(min-width:40rem)]:text-end">
              <Isolated>{statLabel ?? copy.statLabel}</Isolated>
            </span>
          </p>
        ) : null}
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofBracketFramedQuoteCopy = COPY

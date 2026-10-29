"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import {
  Isolated,
  SocialProofQuote,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Centered Logo Spotlight.
 *
 * One quote, centred in a 768px column: the customer's wordmark (a `primary`
 * logomark and the name in SM Bold) above the quote in 2XL Light (XL on
 * phones), and the author under it, the Avatar drawn at 48px over the name
 * and role. There is no heading; the quote is the section.
 */

export interface SocialProofCenteredLogoSpotlightCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** The company's wordmark, set beside the logomark. Up to 20 characters. */
  company: React.ReactNode
  /** Up to 164 characters in English, 133 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
}

const TARIQ = { id: "tariq-zaki" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofCenteredLogoSpotlightCopy> = {
  en: {
    label: "What customers say",
    company: "MARLOW HR",
    quote: "“Fasla turned our design language into a growth channel. Every launch ships looking exactly like us — on the first try.”",
    author: { ...TARIQ, name: "Tariq Zaki", role: "Head of Product, Marlow HR" },
  },
  ar: {
    label: "ما يقوله العملاء",
    company: "MARLOW HR",
    quote: "«جعلت فاصلة هويتنا البصرية مصدرًا للنمو، فكل إطلاق يخرج بصورتنا تمامًا من المحاولة الأولى.»",
    author: { ...TARIQ, name: "طارق زكي", role: "رئيس المنتج، مارلو إتش آر" },
  },
}

export interface SocialProofCenteredLogoSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofCenteredLogoSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatar shows initials. */
  photos?: SocialProofPhotos
}

export function SocialProofCenteredLogoSpotlight({
  locale = "en",
  label,
  company,
  quote,
  author,
  photos,
  className,
  ...props
}: SocialProofCenteredLogoSpotlightProps) {
  const copy = COPY[locale]
  const person = author ?? copy.author
  const wordmark = company === undefined ? copy.company : company

  return (
    <SocialProofSection aria-label={label ?? copy.label} className={cn("lg:py-28", className)} contentClassName="max-w-[768px]" {...props}>
      <figure className="m-0 flex w-full flex-col items-center gap-8 text-center">
        {wordmark ? (
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span aria-hidden className="size-6 shrink-0 rounded-sm bg-primary" />
            <bdi>{wordmark}</bdi>
          </p>
        ) : null}
        <SocialProofQuote quote={quote ?? copy.quote} className="text-xl font-light text-foreground [@container(min-width:40rem)]:text-2xl" />
        <figcaption className="flex flex-col items-center gap-2">
          <Avatar aria-hidden size="32" radius="rounded" src={photos?.[person.id]} name={person.name} className="size-12" />
          <span className="flex flex-col gap-0.5">
            <cite className="text-sm font-medium not-italic text-foreground">{person.name}</cite>
            <span className="text-xs text-muted-foreground">
              <Isolated>{person.role}</Isolated>
            </span>
          </span>
        </figcaption>
      </figure>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofCenteredLogoSpotlightCopy = COPY

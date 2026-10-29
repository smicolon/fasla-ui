"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import {
  Isolated,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Highlighted-Phrase Spotlight.
 *
 * One quote, centred, in 3XL Medium (2XL on phones), with the phrases that
 * carry the result set in `info`. Under it the author on one line: the Avatar
 * drawn at 40px, the name, and the role in `muted-foreground`.
 *
 * Figma colours the last letter of "finished" `primary`, one letter apart
 * from the rest of its phrase; that reads as a slip, so the whole phrase is
 * `info` here.
 */

/** A run of the quote: plain text, or a phrase set in `info`. */
export type SocialProofQuotePart = string | { highlight: string }

export interface SocialProofHighlightedPhraseSpotlightCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** The quote as runs, the highlighted phrases as `{ highlight }`. Up to 164 characters in English, 133 in Arabic. */
  quote: SocialProofQuotePart[]
  author: SocialProofPerson
}

const SAMI = { id: "sami-naji" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofHighlightedPhraseSpotlightCopy> = {
  en: {
    label: "What customers say",
    quote: [
      "“We didn't buy a component library. We bought back ",
      { highlight: "two design days a week" },
      " — and every release ",
      { highlight: "finally feels finished" },
      ".”",
    ],
    author: { ...SAMI, name: "Sami Naji", role: "Product Lead, Nimbus Labs" },
  },
  ar: {
    label: "ما يقوله العملاء",
    quote: [
      "«لم نشترِ مكتبة مكوّنات، بل استعدنا ",
      { highlight: "يومين من التصميم كل أسبوع" },
      "، وصار كل إصدار ",
      { highlight: "يبدو مكتملًا" },
      " أخيرًا.»",
    ],
    author: { ...SAMI, name: "سامي ناجي", role: "قائد المنتج، نيمبوس لابس" },
  },
}

/** Between the name and the role, as Figma writes it: a middle dot in English, a comma after the name in Arabic. */
const SEPARATOR: Record<SocialProofLocale, { afterName: string; beforeRole: string }> = {
  en: { afterName: "", beforeRole: "· " },
  ar: { afterName: "،", beforeRole: "" },
}

export interface SocialProofHighlightedPhraseSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofHighlightedPhraseSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatar shows initials. */
  photos?: SocialProofPhotos
}

export function SocialProofHighlightedPhraseSpotlight({
  locale = "en",
  label,
  quote,
  author,
  photos,
  className,
  ...props
}: SocialProofHighlightedPhraseSpotlightProps) {
  const copy = COPY[locale]
  const parts = quote ?? copy.quote
  const person = author ?? copy.author
  const separator = SEPARATOR[locale]

  return (
    <SocialProofSection aria-label={label ?? copy.label} className={cn("lg:py-28", className)} contentClassName="gap-10" {...props}>
      <figure className="m-0 flex w-full flex-col items-center gap-10 text-center">
        <blockquote className="m-0">
          <p className="text-2xl font-medium text-foreground [@container(min-width:40rem)]:text-3xl">
            {parts.map((part, index) =>
              typeof part === "string" ? (
                <Isolated key={index}>{part}</Isolated>
              ) : (
                <mark key={index} className="bg-transparent text-info">
                  <Isolated>{part.highlight}</Isolated>
                </mark>
              )
            )}
          </p>
        </blockquote>
        <figcaption className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <Avatar aria-hidden size="32" radius="rounded" src={photos?.[person.id]} name={person.name} className="size-10 shrink-0" />
          <cite className="font-medium not-italic text-foreground">
            {person.name}
            {separator.afterName}
          </cite>
          <span className="text-muted-foreground">
            {separator.beforeRole}
            <Isolated>{person.role}</Isolated>
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
export const socialProofHighlightedPhraseSpotlightCopy = COPY

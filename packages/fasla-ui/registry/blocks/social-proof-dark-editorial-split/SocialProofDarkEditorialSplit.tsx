"use client"

import * as React from "react"
import { Quote } from "lucide-react"
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
 * Figma: `Social Proof` (46368:3361), Type=Dark Editorial Split.
 *
 * One quote on the inverse band (`background-inverse`, its text
 * `foreground-inverse`): a quote mark, the quote in 2XL Light (XL on phones)
 * and the author's name and role on one line, beside a portrait of the
 * author. Desktop sets the portrait 480px square at the end; Tablet 300 by
 * 380; phones put it full width above the quote, 340px tall.
 */

export interface SocialProofDarkEditorialSplitCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** Up to 164 characters in English, 133 in Arabic. */
  quote: React.ReactNode
  /** The portrait is `photos[author.id]`. */
  author: SocialProofPerson
}

const YOUSEF = { id: "yousef-amin" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofDarkEditorialSplitCopy> = {
  en: {
    label: "What customers say",
    quote: "“Fasla set a new bar for quality — and the team hit it while shipping ahead of schedule.”",
    author: { ...YOUSEF, name: "Yousef Amin", role: "Co-founder, Halcyon Games" },
  },
  ar: {
    label: "ما يقوله العملاء",
    quote: "«رفعت فاصلة سقف الجودة، وبلغه الفريق وأطلق قبل موعده.»",
    author: { ...YOUSEF, name: "يوسف أمين", role: "شريك مؤسس، هالسيون غيمز" },
  },
}

/** After the name, before the role: a comma in each language. */
const NAME_SEPARATOR: Record<SocialProofLocale, string> = { en: ",", ar: "،" }

export interface SocialProofDarkEditorialSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofDarkEditorialSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Photos by person id: the portrait is the author's. Without it the slot is empty. */
  photos?: SocialProofPhotos
}

export function SocialProofDarkEditorialSplit({
  locale = "en",
  label,
  quote,
  author,
  photos,
  className,
  ...props
}: SocialProofDarkEditorialSplitProps) {
  const copy = COPY[locale]
  const person = author ?? copy.author

  return (
    <SocialProofSection
      aria-label={label ?? copy.label}
      className={cn("bg-background-inverse", className)}
      contentClassName="flex-col gap-8 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:gap-20"
      {...props}
    >
      <figure className="m-0 flex w-full min-w-0 flex-col gap-8 text-foreground-inverse [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-1">
        <Quote aria-hidden size={28} strokeWidth={1.5} absoluteStrokeWidth />
        <SocialProofQuote quote={quote ?? copy.quote} className="text-xl font-light [@container(min-width:40rem)]:text-2xl" />
        <figcaption className="text-sm">
          <cite className="font-medium not-italic">
            {person.name}
            {NAME_SEPARATOR[locale]}
          </cite>{" "}
          <span>
            <Isolated>{person.role}</Isolated>
          </span>
        </figcaption>
      </figure>
      <SocialProofPhoto
        src={photos?.[person.id]}
        className={cn(
          "order-first h-[340px] w-full shrink-0 rounded-xl bg-foreground-inverse/10",
          "[@container(min-width:40rem)]:order-none [@container(min-width:40rem)]:h-[380px] [@container(min-width:40rem)]:w-[300px]",
          "[@container(min-width:64rem)]:size-[480px]"
        )}
      />
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofDarkEditorialSplitCopy = COPY

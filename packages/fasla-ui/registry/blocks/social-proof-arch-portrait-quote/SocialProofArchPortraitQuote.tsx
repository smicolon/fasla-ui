"use client"

import * as React from "react"
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
 * Figma: `Social Proof` (46368:3361), Type=Arch Portrait Quote.
 *
 * A portrait of the author in an arch (fully rounded top, `border radius/sm`
 * at the foot) with an echo of the arch, a 2px `border` outline, set behind
 * it toward the end and down. Beside it a label, the quote in 2XL Light (XL
 * on phones) and the author. Desktop: a 400 by 520 arch, the echo 44px off.
 * Tablet: 300 by 400, 30px off. Phones: 260 by 350 above the quote.
 */

export interface SocialProofArchPortraitQuoteCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** The line above the quote. Up to 41 characters in English, 31 in Arabic. */
  eyebrow: React.ReactNode
  /** Up to 164 characters in English, 133 in Arabic. */
  quote: React.ReactNode
  /** The portrait is `photos[author.id]`. */
  author: SocialProofPerson
}

const FAHAD = { id: "fahad-salem" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofArchPortraitQuoteCopy> = {
  en: {
    label: "What customers say",
    eyebrow: "A NOTE FROM OUR CUSTOMERS",
    quote: "“Bank-grade compliance and beautiful UI used to be a trade-off. Now our auditors and our designers quote the same source of truth.”",
    author: { ...FAHAD, name: "Fahad Salem", role: "Brand Director, Arvenna Bank" },
  },
  ar: {
    label: "ما يقوله العملاء",
    eyebrow: "كلمة من عملائنا",
    quote: "«كنا نضحّي بجمال الواجهة لنلبّي الامتثال المصرفي. اليوم يرجع مدققونا ومصممونا إلى مصدر واحد للحقيقة.»",
    author: { ...FAHAD, name: "فهد سالم", role: "مدير العلامة التجارية، بنك أرفينا" },
  },
}

/** The arch at each size: the portrait, and the echo pushed toward the end and down. */
const ARCH = "rounded-b-sm rounded-t-full h-[350px] w-[260px] [@container(min-width:40rem)]:h-[400px] [@container(min-width:40rem)]:w-[300px] [@container(min-width:64rem)]:h-[520px] [@container(min-width:64rem)]:w-[400px]"
const ECHO_OFFSET = "start-[30px] top-[30px] [@container(min-width:64rem)]:start-[44px] [@container(min-width:64rem)]:top-[44px]"

export interface SocialProofArchPortraitQuoteProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofArchPortraitQuoteCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Photos by person id: the portrait is the author's. Without it the arch is empty. */
  photos?: SocialProofPhotos
}

export function SocialProofArchPortraitQuote({
  locale = "en",
  label,
  eyebrow,
  quote,
  author,
  photos,
  className,
  ...props
}: SocialProofArchPortraitQuoteProps) {
  const copy = COPY[locale]
  const person = author ?? copy.author
  const line = eyebrow === undefined ? copy.eyebrow : eyebrow

  return (
    <SocialProofSection
      aria-label={label ?? copy.label}
      className={className}
      contentClassName="gap-8 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:gap-20"
      {...props}
    >
      <div className="relative shrink-0 pb-[30px] pe-[30px] [@container(min-width:64rem)]:pb-[44px] [@container(min-width:64rem)]:pe-[44px]">
        <span aria-hidden className={cn("absolute border-2 border-border", ARCH, ECHO_OFFSET)} />
        <SocialProofPhoto src={photos?.[person.id]} className={cn("relative", ARCH)} />
      </div>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-6 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-1">
        {line ? (
          <p className="text-xs font-medium text-muted-foreground">
            <Isolated>{line}</Isolated>
          </p>
        ) : null}
        <SocialProofQuote quote={quote ?? copy.quote} className="text-xl font-light text-foreground [@container(min-width:40rem)]:text-2xl" />
        <figcaption className="flex flex-col gap-0.5">
          <cite className="text-sm font-medium not-italic text-foreground">{person.name}</cite>
          <span className="text-xs text-muted-foreground">
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
export const socialProofArchPortraitQuoteCopy = COPY

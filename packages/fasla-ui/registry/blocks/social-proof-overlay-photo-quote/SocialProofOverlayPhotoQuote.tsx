"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Isolated, SocialProofQuote, type SocialProofLocale, type SocialProofPhotos } from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Overlay Photo Quote.
 *
 * A photograph across the whole section, under a dark scrim, with the quote
 * at the bottom start: the company in XS Bold, the quote in 2XL Medium (XL
 * on phones) and the author on one line. The section is at least 560px tall
 * on Desktop, 440 on Tablet and 480 on phones, and grows with longer copy.
 *
 * The scrim is dark and the text light in both modes, as Figma draws them: a
 * photograph does not change with the theme. Figma's scrim is black at 45%;
 * here it is the `backdrop-overlay` token at its own strength (60% light, 80%
 * dark), as Hero's Framed Full-Bleed and Gallery's Full-Bleed Slider set it,
 * so the light type holds its contrast over a bright photo. The text is the
 * inverse tokens in light mode and the page's own in dark mode.
 */

export interface SocialProofOverlayPhotoQuoteCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** The company, above the quote. Up to 20 characters. */
  company: React.ReactNode
  /** Up to 164 characters in English, 133 in Arabic. */
  quote: React.ReactNode
  /** The author, role and company on one line. Up to 48 characters in English, 50 in Arabic. */
  author: React.ReactNode
  /** Describes the photograph. "" when it is only atmosphere. */
  photoAlt: string
}

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofOverlayPhotoQuoteCopy> = {
  en: {
    label: "What customers say",
    company: "QUILLFIELD",
    quote: "“Half our team works from the field. Fasla is why the app they carry looks as considered as the site we pitch with.”",
    author: "Ziad Karam — CEO, Quillfield",
    photoAlt: "",
  },
  ar: {
    label: "ما يقوله العملاء",
    company: "كويلفيلد",
    quote: "«نصف فريقنا يعمل في الميدان، وبفضل فاصلة يبدو التطبيق الذي يستخدمونه متقنًا كموقعنا الذي نقدّم به عروضنا.»",
    author: "زياد كرم، الرئيس التنفيذي، كويلفيلد",
    photoAlt: "",
  },
}

/** The key in `photos` for the photograph. */
export const SOCIAL_PROOF_OVERLAY_PHOTO = "overlay-photo-quote"

export interface SocialProofOverlayPhotoQuoteProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofOverlayPhotoQuoteCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** The photograph is `photos["overlay-photo-quote"]`. Without it the section shows its `muted` ground under the scrim. */
  photos?: SocialProofPhotos
}

export function SocialProofOverlayPhotoQuote({
  locale = "en",
  label,
  company,
  quote,
  author,
  photoAlt,
  photos,
  className,
  ...props
}: SocialProofOverlayPhotoQuoteProps) {
  const copy = COPY[locale]
  const src = photos?.[SOCIAL_PROOF_OVERLAY_PHOTO]
  const name = company === undefined ? copy.company : company

  return (
    <section
      aria-label={label ?? copy.label}
      className={cn(
        "relative isolate flex min-h-[480px] [container-type:inline-size] flex-col justify-end overflow-hidden bg-muted px-4 py-8 md:min-h-[440px] md:px-6 md:py-14 lg:min-h-[560px] lg:px-28 lg:py-24",
        className
      )}
      {...props}
    >
      {src ? <img src={src} alt={photoAlt ?? copy.photoAlt} decoding="async" className="absolute inset-0 -z-10 size-full object-cover" /> : null}
      <div aria-hidden className="absolute inset-0 -z-10 bg-backdrop-overlay" />
      <figure className="m-0 flex w-full flex-col gap-4 text-foreground-inverse dark:text-foreground [@container(min-width:40rem)]:max-w-[600px] [@container(min-width:64rem)]:max-w-[760px]">
        {name ? (
          <p className="text-xs font-bold">
            <bdi>{name}</bdi>
          </p>
        ) : null}
        <SocialProofQuote quote={quote ?? copy.quote} className="text-xl font-medium [@container(min-width:40rem)]:text-2xl" />
        <figcaption className="text-sm">
          <Isolated>{author ?? copy.author}</Isolated>
        </figcaption>
      </figure>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofOverlayPhotoQuoteCopy = COPY

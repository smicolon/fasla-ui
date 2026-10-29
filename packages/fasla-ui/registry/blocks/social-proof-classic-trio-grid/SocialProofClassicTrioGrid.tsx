"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  SocialProofAuthor,
  SocialProofHeader,
  SocialProofQuote,
  SocialProofRule,
  SocialProofSection,
  SocialProofStars,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Classic Trio Grid.
 *
 * A centred header over three testimonial cards. Each card holds five stars,
 * the quote, a hairline and its author. The cards hug their content: a longer
 * quote makes its card taller, and the cards in a row share the tallest one's
 * height.
 *
 * Desktop sets the three cards in one row; Tablet two to a row and the third
 * across the full width; phones one under another.
 */

export interface SocialProofClassicTrioGridItem {
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
}

export interface SocialProofClassicTrioGridCopy {
  heading: React.ReactNode
  description: React.ReactNode
  /** The cards, in reading order. Three, as Figma lays them out. */
  items: SocialProofClassicTrioGridItem[]
}

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofClassicTrioGridCopy> = {
  en: {
    heading: "Loved by the teams that ship",
    description: "Real feedback from designers and engineers building with Fasla every day.",
    items: [
      {
        quote: "“Fasla replaced three tools the day we onboarded. Our design reviews went from hours of nitpicking to actually shipping.”",
        author: { id: "sami-naji", name: "Sami Naji", role: "Product Lead, Nimbus Labs" },
      },
      {
        quote: "“The tokens map one-to-one with our codebase. Dark mode took an afternoon instead of a quarter.”",
        author: { id: "khalid-saad", name: "Khalid Saad", role: "Frontend Lead, Atlas Freight" },
      },
      {
        quote: "“Every new hire is productive in week one. The documentation reads like it was written for humans.”",
        author: { id: "rashed-al-amri", name: "Rashed Al-Amri", role: "Design Ops Manager, Willow & Co" },
      },
    ],
  },
  ar: {
    heading: "خيار الفرق التي تُطلق منتجاتها",
    description: "آراء حقيقية من مصممين ومهندسين يعملون بفاصلة كل يوم.",
    items: [
      {
        quote: "«أغنتنا فاصلة عن ثلاث أدوات من اليوم الأول، وصارت مراجعات التصميم تنتهي بالإطلاق لا بساعات من التدقيق.»",
        author: { id: "sami-naji", name: "سامي ناجي", role: "قائد المنتج، نيمبوس لابس" },
      },
      {
        quote: "«تتطابق رموز التصميم مع شيفرتنا تطابقًا تامًا، وأنجزنا الوضع الداكن في نصف يوم بدل ربع سنة.»",
        author: { id: "khalid-saad", name: "خالد سعد", role: "قائد الواجهات الأمامية، أطلس فريت" },
      },
      {
        quote: "«يبدأ كل موظف جديد العمل الفعلي في أسبوعه الأول، فالتوثيق مكتوب بلغة يفهمها الجميع.»",
        author: { id: "rashed-al-amri", name: "راشد العمري", role: "مدير عمليات التصميم، ويلو آند كو" },
      },
    ],
  },
}

export interface SocialProofClassicTrioGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofClassicTrioGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
}

export function SocialProofClassicTrioGrid({
  locale = "en",
  heading,
  description,
  items,
  photos,
  className,
  ...props
}: SocialProofClassicTrioGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="gap-16" {...props}>
      <SocialProofHeader headingId={headingId} heading={heading ?? copy.heading} description={description === undefined ? copy.description : description} />
      <ul
        className={cn(
          "grid w-full grid-cols-1 gap-5",
          "[@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-flow-col [@container(min-width:64rem)]:grid-cols-none [@container(min-width:64rem)]:auto-cols-fr"
        )}
      >
        {list.map((item, index) => (
          <li
            key={index}
            className={cn(
              "min-w-0 rounded-xl bg-card p-8 shadow-sm ring-1 ring-inset ring-border forced-colors:border",
              "[@container(min-width:40rem)]:[&:last-child:nth-child(odd)]:col-span-2 [@container(min-width:64rem)]:[&:last-child:nth-child(odd)]:col-span-1"
            )}
          >
            <figure className="m-0 flex flex-col gap-5">
              <SocialProofStars locale={locale} />
              <SocialProofQuote quote={item.quote} className="text-base text-foreground" />
              <SocialProofRule />
              <SocialProofAuthor person={item.author} photos={photos} roleSize="sm" />
            </figure>
          </li>
        ))}
      </ul>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofClassicTrioGridCopy = COPY

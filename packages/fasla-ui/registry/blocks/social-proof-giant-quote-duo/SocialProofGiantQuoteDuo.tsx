"use client"

import * as React from "react"
import { ArrowRight, Quote } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofAuthor,
  SocialProofQuote,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Giant Quote Duo.
 *
 * Two large quotes side by side, with no heading: the first on a 10%
 * `primary` tint, the second on solid `primary` with `primary-foreground`
 * text. A giant quote mark sits cropped in each card's top end corner at 8%
 * opacity. The quote is at the top and the author (Avatar 24) at the bottom
 * of a card at least 420px tall (360 on Tablet, 300 on phones). Under the
 * pair, a line with a figure and a link to more stories.
 *
 * Desktop and Tablet set the two cards side by side, the footer line and the
 * link at either end; phones stack everything.
 */

export interface SocialProofGiantQuoteDuoItem {
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
}

export interface SocialProofGiantQuoteDuoLink {
  label: React.ReactNode
  href: string
}

export interface SocialProofGiantQuoteDuoCopy {
  /** Names the section for assistive tech, since the block has no visible heading. */
  label: string
  /** The two quotes, light card first. */
  items: [SocialProofGiantQuoteDuoItem, SocialProofGiantQuoteDuoItem]
  /** The line under the cards. Hidden when empty. */
  note: React.ReactNode
  /** The link at the end of that line. Hidden when empty. Up to 25 characters in English, 26 in Arabic. */
  link: SocialProofGiantQuoteDuoLink | null
}

const HANI = { id: "hani-jaber" } as const
const KHALID = { id: "khalid-saad" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofGiantQuoteDuoCopy> = {
  en: {
    label: "What customers say",
    items: [
      {
        quote: "“You just have to build one screen with it. You'll feel it immediately.”",
        author: { ...HANI, name: "Hani Jaber", role: "Staff Engineer, Clearfen" },
      },
      {
        quote: "“Our speed is intense and Fasla keeps us action-biased.”",
        author: { ...KHALID, name: "Khalid Saad", role: "Frontend Lead, Atlas Freight" },
      },
    ],
    note: "Fasla powers 2,300+ product teams — from seed startups to global enterprises.",
    link: { label: "Customer stories", href: "#" },
  },
  ar: {
    label: "ما يقوله العملاء",
    items: [
      {
        quote: "«يكفي أن تبني شاشة واحدة بها. ستشعر بالفرق فورًا.»",
        author: { ...HANI, name: "هاني جابر", role: "مهندس أول، كليرفين" },
      },
      {
        quote: "«نعمل بإيقاع سريع، وفاصلة تُبقي تركيزنا على التنفيذ.»",
        author: { ...KHALID, name: "خالد سعد", role: "قائد الواجهات الأمامية، أطلس فريت" },
      },
    ],
    note: "يعتمد على فاصلة أكثر من 2,300 فريق منتج، من الشركات الناشئة إلى المؤسسات العالمية.",
    link: { label: "قصص العملاء", href: "#" },
  },
}

export interface SocialProofGiantQuoteDuoProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<SocialProofGiantQuoteDuoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
}

export function SocialProofGiantQuoteDuo({ locale = "en", label, items, note, link, photos, className, ...props }: SocialProofGiantQuoteDuoProps) {
  const copy = COPY[locale]
  const pair = items ?? copy.items
  const line = note === undefined ? copy.note : note
  const more = link === undefined ? copy.link : link

  return (
    <SocialProofSection aria-label={label ?? copy.label} className={className} contentClassName="gap-8" {...props}>
      <ul className="grid w-full grid-cols-1 gap-5 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6">
        {pair.map((item, index) => {
          const dark = index === 1
          return (
            <li
              key={index}
              className={cn(
                "relative flex min-h-[300px] flex-col overflow-hidden rounded-xl p-10 [@container(min-width:40rem)]:min-h-[360px] [@container(min-width:64rem)]:min-h-[420px]",
                dark ? "bg-primary text-primary-foreground" : "bg-primary/10 text-foreground"
              )}
            >
              <Quote aria-hidden size={180} strokeWidth={1.5} className="pointer-events-none absolute -end-[30px] -top-[30px] opacity-[0.08]" />
              <figure className="relative m-0 flex flex-1 flex-col justify-between gap-6">
                <SocialProofQuote quote={item.quote} className="text-xl font-medium" />
                <SocialProofAuthor
                  person={item.author}
                  photos={photos}
                  avatarSize="24"
                  gap="2.5"
                  roleClassName={dark ? "text-primary-foreground" : "text-foreground"}
                />
              </figure>
            </li>
          )
        })}
      </ul>
      {line || more ? (
        <div className="flex w-full flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
          {line ? (
            <p className="text-sm text-muted-foreground">
              <Isolated>{line}</Isolated>
            </p>
          ) : null}
          {more ? (
            <a
              href={more.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Isolated>{more.label}</Isolated>
              <ArrowRight aria-hidden size={16} className="rtl:rotate-180" />
            </a>
          ) : null}
        </div>
      ) : null}
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofGiantQuoteDuoCopy = COPY

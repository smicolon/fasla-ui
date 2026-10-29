"use client"

import * as React from "react"
import { Sparkles, TrendingUp, Zap, type LucideIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  Isolated,
  SocialProofAuthor,
  SocialProofHeader,
  SocialProofQuote,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Benefit-Title Cards.
 *
 * A centred header over three cards, each led by a benefit: a round icon chip
 * in a 10% tint of its colour (`info`, `success`, `warning`), the benefit as a
 * title, then the quote that backs it and its author. The cards are at least
 * 300px tall (240px on Tablet) and grow with their copy.
 *
 * Desktop sets the three cards in one row; Tablet two to a row and the third
 * across the full width; phones one under another.
 */

/** The icon chip's three tones, as Figma colours them. */
export type SocialProofBenefitTone = "info" | "success" | "warning"

export interface SocialProofBenefitTitleCardsItem {
  /** The benefit. Up to 30 characters in English, 25 in Arabic. */
  title: React.ReactNode
  /** Up to 154 characters in English, 136 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
  /** A Lucide icon for the chip. */
  icon: LucideIcon
  tone: SocialProofBenefitTone
}

export interface SocialProofBenefitTitleCardsCopy {
  heading: React.ReactNode
  description: React.ReactNode
  /** The cards, in reading order. Three, as Figma lays them out. */
  items: SocialProofBenefitTitleCardsItem[]
}

const TONE: Record<SocialProofBenefitTone, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
}

const BADER = { id: "bader-al-ghamdi" } as const
const ADEL = { id: "adel-qasim" } as const
const MAJED = { id: "majed-nouri" } as const

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofBenefitTitleCardsCopy> = {
  en: {
    heading: "Why teams stay",
    description: "Three benefits customers bring up unprompted.",
    items: [
      {
        icon: Zap,
        tone: "info",
        title: "Fast where it matters",
        quote: "“Set-up took one morning. The kit compiles straight into our stack with nothing bolted on.”",
        author: { ...BADER, name: "Bader Al-Ghamdi", role: "CTO, Beacon Analytics" },
      },
      {
        icon: Sparkles,
        tone: "success",
        title: "Cleaner, calmer screens",
        quote: "“We cut a third of our custom CSS. The UI feels lighter to use and to maintain.”",
        author: { ...ADEL, name: "Adel Qasim", role: "Head of Design, Forma Studio" },
      },
      {
        icon: TrendingUp,
        tone: "warning",
        title: "Momentum you can measure",
        quote: "“Feature cycle time dropped 28% in the first quarter. The numbers convinced the board.”",
        author: { ...MAJED, name: "Majed Nouri", role: "COO, Arcadia Health" },
      },
    ],
  },
  ar: {
    heading: "ما يُبقي الفرق معنا",
    description: "ثلاث فوائد يذكرها العملاء دون أن نسألهم.",
    items: [
      {
        icon: Zap,
        tone: "info",
        title: "سرعة حيث تحتاجها",
        quote: "«أنهينا الإعداد في صباح واحد، وتعمل المكتبة مباشرة ضمن أدواتنا دون أي إضافات.»",
        author: { ...BADER, name: "بدر الغامدي", role: "الرئيس التقني، بيكون أناليتكس" },
      },
      {
        icon: Sparkles,
        tone: "success",
        title: "شاشات أنظف وأهدأ",
        quote: "«حذفنا ثلث شيفرة CSS المخصصة، فصارت الواجهة أخف في الاستخدام والصيانة.»",
        author: { ...ADEL, name: "عادل قاسم", role: "رئيس التصميم، فورما ستوديو" },
      },
      {
        icon: TrendingUp,
        tone: "warning",
        title: "تقدّم تقيسه بالأرقام",
        quote: "«انخفض وقت تطوير الميزة بنسبة 28% في الربع الأول، والأرقام أقنعت مجلس الإدارة.»",
        author: { ...MAJED, name: "ماجد نوري", role: "الرئيس التنفيذي للعمليات، أركاديا هيلث" },
      },
    ],
  },
}

export interface SocialProofBenefitTitleCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofBenefitTitleCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
}

export function SocialProofBenefitTitleCards({
  locale = "en",
  heading,
  description,
  items,
  photos,
  className,
  ...props
}: SocialProofBenefitTitleCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="gap-12" {...props}>
      <SocialProofHeader headingId={headingId} heading={heading ?? copy.heading} description={description === undefined ? copy.description : description} />
      <ul
        className={cn(
          "grid w-full grid-cols-1 gap-5",
          "[@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-flow-col [@container(min-width:64rem)]:grid-cols-none [@container(min-width:64rem)]:auto-cols-fr"
        )}
      >
        {list.map((item, index) => {
          const Icon = item.icon
          return (
            <li
              key={index}
              className={cn(
                "flex min-h-[300px] min-w-0 flex-col rounded-xl bg-card p-8 shadow-sm ring-1 ring-inset ring-border forced-colors:border",
                "[@container(min-width:40rem)]:min-h-[240px] [@container(min-width:64rem)]:min-h-[300px]",
                "[@container(min-width:40rem)]:[&:last-child:nth-child(odd)]:col-span-2 [@container(min-width:64rem)]:[&:last-child:nth-child(odd)]:col-span-1"
              )}
            >
              <figure className="m-0 flex flex-1 flex-col gap-5">
                <span aria-hidden className={cn("flex size-10 items-center justify-center rounded-full", TONE[item.tone])}>
                  <Icon size={20} strokeWidth={1.5} absoluteStrokeWidth />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  <Isolated>{item.title}</Isolated>
                </h3>
                <SocialProofQuote quote={item.quote} className="text-base text-muted-foreground" />
                <SocialProofAuthor person={item.author} photos={photos} className="mt-auto" />
              </figure>
            </li>
          )
        })}
      </ul>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofBenefitTitleCardsCopy = COPY

"use client"

import * as React from "react"
import { Activity, Gauge, Lock, ShieldCheck } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { FeaturesHeader, FeaturesSection, Figures, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Colour Block Cards.
 *
 * A header (the heading and a line under it, 700px wide, no eyebrow), then
 * four solid cards. A card is 24px of padding, a 28px Lucide mark, a title
 * and a line, 20px apart, painted `chart-1`, `chart-2` and `chart-3` with
 * `foreground-inverse` text, and the fourth `primary` with `primary-foreground`
 * text. Every card in a row is as tall as the tallest.
 *
 * Desktop sets the four across, Tablet two across and Mobile one. The cards
 * hold no state.
 *
 * Content limits: a title up to 28 characters and its line up to 110. The
 * other limits are in the block's documentation page.
 */

export type FeaturesColourBlockTone = "chart-1" | "chart-2" | "chart-3" | "primary"

export interface FeaturesColourBlockCard {
  /** Keys the card. */
  id: string
  /** The card's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
  /** The Lucide mark at the top. */
  icon?: React.ElementType
  /** The card's colour. Figma sets them `chart-1`, `chart-2`, `chart-3` and `primary` in turn. */
  tone: FeaturesColourBlockTone
}

export interface FeaturesColourBlockCardsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The cards, in order. */
  cards: FeaturesColourBlockCard[]
}

const TONES: Record<FeaturesColourBlockTone, string> = {
  "chart-1": "bg-chart-1 text-foreground-inverse",
  "chart-2": "bg-chart-2 text-foreground-inverse",
  "chart-3": "bg-chart-3 text-foreground-inverse",
  primary: "bg-primary text-primary-foreground",
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesColourBlockCardsCopy> = {
  en: {
    heading: "Built for scale, without the enterprise tax",
    description: "Four guarantees that apply from your first workspace to your five-thousandth.",
    cards: [
      { id: "security", tone: "chart-1", icon: ShieldCheck, title: "Security by default", description: "Encrypted in transit and at rest. Independently audited, with results published twice a year." },
      { id: "performance", tone: "chart-2", icon: Gauge, title: "Performance at volume", description: "A million records in a view still opens in under a second, measured on the slowest plan we sell." },
      { id: "privacy", tone: "chart-3", icon: Lock, title: "Privacy by design", description: "Your content is never used to train a model, and every region can be isolated on request." },
      { id: "reliability", tone: "primary", icon: Activity, title: "Reliability you can cite", description: "99.99% uptime across the last eight quarters, with a public status page and incident history." },
    ],
  },
  ar: {
    heading: "مبنيّ للتوسّع، دون ضريبة المؤسسات",
    description: "أربعة ضمانات تسري من مساحة عملك الأولى حتى الخمسة آلاف.",
    cards: [
      { id: "security", tone: "chart-1", icon: ShieldCheck, title: "الأمان افتراضيًا", description: "يتم تشفير البيانات أثناء النقل وأثناء التخزين. تخضع البيانات لتدقيق مستقل، وتُنشر نتائجه مرتين في السنة." },
      { id: "performance", tone: "chart-2", icon: Gauge, title: "أداء عند الحجم الكبير", description: "مليون سجل في عرض واحد يُفتح في أقل من ثانية، مقيسًا على أبطأ باقة نبيعها." },
      { id: "privacy", tone: "chart-3", icon: Lock, title: "الخصوصية بحكم التصميم", description: "لا يُستخدم محتواك لتدريب أي نموذج، ويمكن عزل كل منطقة عند الطلب." },
      { id: "reliability", tone: "primary", icon: Activity, title: "موثوقية يمكنك الاستشهاد بها", description: "جاهز بنسبة 99.99% عبر الأرباع الثمانية الماضية، مع صفحة حالة عامة وسجل للحوادث." },
    ],
  },
}

export interface FeaturesColourBlockCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesColourBlockCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesColourBlockCards({ locale = "en", heading, description, cards, className, ...props }: FeaturesColourBlockCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = cards ?? copy.cards

  return (
    <FeaturesSection labelledBy={headingId} className={className} {...props}>
      <FeaturesHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} maxWidth={700} />
      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-5 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-4">
          {list.map((card) => {
            const Icon = card.icon
            return (
              <li key={card.id} className={cn("flex flex-col items-start gap-5 rounded-lg p-6", TONES[card.tone])}>
                {Icon ? <Icon size={28} strokeWidth={1.5} absoluteStrokeWidth aria-hidden /> : null}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm">
                    <Figures>{card.description}</Figures>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresColourBlockCardsCopy = COPY

"use client"

import * as React from "react"
import { Clock, GitBranch, Lock, Search, TrendingUp, Users } from "lucide-react"
import { FeaturesHeader, FeaturesSection, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Icon Card Grid.
 *
 * A left-aligned header (an eyebrow, the heading and a line under it, 680px
 * wide on Desktop), then six cards. A card is a `card` surface with a 1px
 * border and a 40px `secondary` chip holding an 18px Lucide mark, then its
 * title and a line on it.
 *
 * Desktop sets the cards three across, Tablet two across and Mobile one. A
 * card never moves or animates; its border only darkens on hover.
 *
 * Content limits: a card's title up to 24 characters and its line up to 110.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface FeaturesIconCardGridCard {
  /** Keys the card. */
  id: string
  /** The card's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
  /** The Lucide mark in the chip. */
  icon?: React.ElementType
}

export interface FeaturesIconCardGridCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The cards, in order. */
  cards: FeaturesIconCardGridCard[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesIconCardGridCopy> = {
  en: {
    eyebrow: "CAPABILITIES",
    heading: "The difference teams notice in week one",
    description: "Six building blocks that cover planning, execution and reporting without a single hand-off script.",
    cards: [
      { id: "search", icon: Search, title: "Instant search", description: "Find any task, doc or thread in under a second — across every project you have access to." },
      { id: "guests", icon: Users, title: "Guest access", description: "Bring clients and contractors into a single project without paying for a full seat." },
      { id: "dashboards", icon: TrendingUp, title: "Live dashboards", description: "Charts that read straight from your data, refreshed on every change rather than on a schedule." },
      { id: "workflows", icon: GitBranch, title: "Branching workflows", description: "Model approvals, reviews and escalations as rules instead of reminders in a group chat." },
      { id: "permissions", icon: Lock, title: "Granular permissions", description: "Decide who sees what at the field level, not just the project level." },
      { id: "time", icon: Clock, title: "Time tracking", description: "Log effort against the same object the work lives on, then export it straight to billing." },
    ],
  },
  ar: {
    eyebrow: "الإمكانات",
    heading: "اختلاف تلاحظه الفِرَق من الأسبوع الأول",
    description: "ست لبنات تغطّي التخطيط والتنفيذ وإعداد التقارير دون أي نص تسليم واحد.",
    cards: [
      { id: "search", icon: Search, title: "بحث فوري", description: "اعثر على أي مهمة أو مستند أو نقاش في أقل من ثانية، عبر كل مشروع تملك صلاحية الوصول إليه." },
      { id: "guests", icon: Users, title: "وصول الضيوف", description: "أدخِل العملاء والمتعاقدين إلى مشروع واحد دون دفع تكلفة مقعد كامل." },
      { id: "dashboards", icon: TrendingUp, title: "لوحات معلومات حيّة", description: "رسوم بيانية تقرأ من بياناتك مباشرة، وتتحدّث مع كل تغيير لا وفق جدول زمني." },
      { id: "workflows", icon: GitBranch, title: "مسارات عمل متفرّعة", description: "صُغ الموافقات والمراجعات والتصعيدات كقواعد بدل التذكيرات في محادثة جماعية." },
      { id: "permissions", icon: Lock, title: "صلاحيات دقيقة", description: "حدّد من يرى ماذا على مستوى الحقل، لا على مستوى المشروع فقط." },
      { id: "time", icon: Clock, title: "تتبّع الوقت", description: "سجّل الجهد على العنصر نفسه الذي يعيش عليه العمل، ثم صدّره مباشرة إلى الفوترة." },
    ],
  },
}

export interface FeaturesIconCardGridProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesIconCardGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesIconCardGrid({ locale = "en", eyebrow, heading, description, cards, className, ...props }: FeaturesIconCardGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = cards ?? copy.cards

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} maxWidth={680} />

      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-6 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-3">
          {list.map((card) => {
            const Icon = card.icon
            return (
              <li
                key={card.id}
                className="flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground motion-safe:transition-colors hover:border-muted-foreground"
              >
                {Icon ? (
                  <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                  </span>
                ) : null}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold text-card-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
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
export const featuresIconCardGridCopy = COPY

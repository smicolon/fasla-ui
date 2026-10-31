"use client"

import * as React from "react"
import { FeaturesHeader, FeaturesSection, Figures, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Stat Feature Band.
 *
 * A rounded `secondary` band inside the section: a header row, the section
 * header at the start and a 14px note at the end on its bottom line, then
 * four stats. A stat is a large figure (48px on Desktop, 30px below), a 16px
 * medium label and a 14px line on it.
 *
 * Desktop sets the stats four across with the band padded 64px. Tablet sets
 * two across and pads it 40px, the note under the heading. Mobile stacks
 * the stats and pads the band 24px. The band holds no state.
 *
 * Content limits: a figure up to 8 characters, its label up to 32 and its
 * line up to 90. The other limits are in the block's documentation page.
 */

export interface FeaturesStat {
  /** Keys the stat. */
  id: string
  /** The figure, such as "62%" or "3.1 hrs". */
  figure: React.ReactNode
  /** What the figure measures. */
  label: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesStatFeatureBandCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The note beside the heading. */
  note: React.ReactNode
  /** The stats, in order. */
  stats: FeaturesStat[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesStatFeatureBandCopy> = {
  en: {
    eyebrow: "MEASURED, NOT CLAIMED",
    heading: "What changes in the first ninety days",
    note: "Averages across 1,240 workspaces that migrated in the last year.",
    stats: [
      { id: "meetings", figure: "62%", label: "fewer status meetings", description: "Progress is visible without anyone scheduling a call to describe it." },
      { id: "handoffs", figure: "4.2×", label: "faster hand-offs", description: "Work moves between teams with its context attached, not in a summary email." },
      { id: "saved", figure: "3.1 hrs", label: "saved per person, weekly", description: "Recovered from searching, re-asking and rebuilding the same report." },
      { id: "uptime", figure: "99.99%", label: "uptime, eight quarters", description: "Published on a status page with the full incident history." },
    ],
  },
  ar: {
    eyebrow: "مقيس لا مُدّعى",
    heading: "ما الذي يتغيّر في التسعين يومًا الأولى",
    note: "متوسطات عبر 1,240 مساحة عمل انتقلت خلال العام الماضي.",
    stats: [
      { id: "meetings", figure: "62%", label: "أقل في اجتماعات المتابعة", description: "التقدّم مرئي دون أن يحدّد أحد مكالمة لوصفه." },
      { id: "handoffs", figure: "4.2×", label: "أسرع في التسليم", description: "ينتقل العمل بين الفرق ومعه سياقه، لا في بريد ملخّص." },
      { id: "saved", figure: "3.1 ساعة", label: "موفَّرة لكل شخص أسبوعيًا", description: "مستردّة من البحث وإعادة السؤال وإعادة بناء التقرير نفسه." },
      { id: "uptime", figure: "99.99%", label: "جهوزية عبر ثمانية أرباع", description: "منشورة على صفحة حالة مع سجل الحوادث كاملًا." },
    ],
  },
}

export interface FeaturesStatFeatureBandProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesStatFeatureBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesStatFeatureBand({ locale = "en", eyebrow, heading, note, stats, className, ...props }: FeaturesStatFeatureBandProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = stats ?? copy.stats

  return (
    <FeaturesSection labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-8 rounded-2xl bg-secondary p-6 text-secondary-foreground [@container(min-width:48rem)]:gap-10 [@container(min-width:48rem)]:p-10 [@container(min-width:72rem)]:gap-16 [@container(min-width:72rem)]:p-16">
        <div className="flex flex-col gap-10 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-end [@container(min-width:72rem)]:justify-between [@container(min-width:72rem)]:gap-16">
          <FeaturesHeader
            headingId={headingId}
            eyebrow={eyebrow ?? copy.eyebrow}
            heading={heading ?? copy.heading}
            className="flex-1 [&_h2]:text-secondary-foreground"
          />
          <p className="text-sm text-muted-foreground [@container(min-width:72rem)]:max-w-[17.5rem]">{note ?? copy.note}</p>
        </div>
        {list.length > 0 ? (
          <ul role="list" className="grid grid-cols-1 gap-x-10 gap-y-10 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:48rem)]:gap-y-12 [@container(min-width:72rem)]:grid-cols-4 [@container(min-width:72rem)]:gap-x-12">
            {list.map((stat) => (
              <li key={stat.id} className="flex min-w-0 flex-col gap-2">
                <p className="text-3xl font-semibold text-secondary-foreground [@container(min-width:72rem)]:text-5xl">
                  <Figures>{stat.figure}</Figures>
                </p>
                <p className="text-base font-medium text-secondary-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresStatFeatureBandCopy = COPY

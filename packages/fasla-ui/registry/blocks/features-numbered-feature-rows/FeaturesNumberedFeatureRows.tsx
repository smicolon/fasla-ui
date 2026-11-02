"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FeaturesHeader, FeaturesSection, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Numbered Feature Rows.
 *
 * A dark band (`background-inverse`): the header, then four features. A
 * feature is a 14px number (1.0, 2.0), a 24px title and a 14px line, 40px
 * apart, with a 1px rule on its start side between neighbours.
 *
 * Desktop sets the four across with rules between them. Tablet sets two
 * across, a rule before each second one. Mobile stacks them with a rule
 * between rows and a 20px title. The band holds no state.
 *
 * Content limits: a title up to 20 characters and its line up to 90. The
 * other limits are in the block's documentation page.
 */

export interface FeaturesNumberedFeatureRow {
  /** Keys the feature. */
  id: string
  /** The number, such as "1.0". */
  number: React.ReactNode
  /** The feature's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesNumberedFeatureRowsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The features, in order. */
  features: FeaturesNumberedFeatureRow[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesNumberedFeatureRowsCopy> = {
  en: {
    eyebrow: "THE SHORT VERSION",
    heading: "Four reasons teams stay",
    features: [
      { id: "adoption", number: "1.0", title: "Adoption", description: "People use it without being told to, so the data stays complete." },
      { id: "speed", number: "2.0", title: "Speed", description: "Views open instantly at any size, on any plan, in any region." },
      { id: "clarity", number: "3.0", title: "Clarity", description: "One definition per metric means the numbers never need a caveat." },
      { id: "control", number: "4.0", title: "Control", description: "Access, retention and residency are yours to set and to prove." },
    ],
  },
  ar: {
    eyebrow: "باختصار",
    heading: "أربعة أسباب تبقي الفرق معنا",
    features: [
      { id: "adoption", number: "1.0", title: "التبنّي", description: "يستخدمه الناس دون أن يُطلب منهم، فتبقى البيانات كاملة." },
      { id: "speed", number: "2.0", title: "السرعة", description: "تُفتح العروض فورًا عند أي حجم، وفي أي باقة، وفي أي منطقة." },
      { id: "clarity", number: "3.0", title: "الوضوح", description: "تعريف واحد لكل مؤشر يعني أن الأرقام لا تحتاج إلى تحفّظ." },
      { id: "control", number: "4.0", title: "التحكّم", description: "الوصول والاحتفاظ والإقامة أمورٌ تقع على عاتقك لتحديدها وإثباتها." },
    ],
  },
}

export interface FeaturesNumberedFeatureRowsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesNumberedFeatureRowsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesNumberedFeatureRows({ locale = "en", eyebrow, heading, features, className, ...props }: FeaturesNumberedFeatureRowsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = features ?? copy.features

  return (
    <FeaturesSection labelledBy={headingId} className={cn("bg-background-inverse text-foreground-inverse", className)} {...props}>
      <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} inverse />
      {list.length > 0 ? (
        <ol role="list" className="grid grid-cols-1 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:48rem)]:gap-10 [@container(min-width:72rem)]:grid-cols-4 [@container(min-width:72rem)]:gap-0">
          {list.map((feature) => (
            <li
              key={feature.id}
              className={cn(
                "flex min-w-0 flex-col gap-4 border-foreground-inverse/20 py-6 first:pt-0 [&:not(:first-child)]:border-t",
                "[@container(min-width:48rem)]:gap-10 [@container(min-width:48rem)]:py-0 [@container(min-width:48rem)]:first:pt-0 [@container(min-width:48rem)]:[&:not(:first-child)]:border-t-0 [@container(min-width:48rem)]:even:border-s [@container(min-width:48rem)]:even:ps-8",
                "[@container(min-width:72rem)]:py-8 [@container(min-width:72rem)]:first:pt-8 [@container(min-width:72rem)]:[&:not(:first-child)]:border-s [@container(min-width:72rem)]:[&:not(:first-child)]:ps-8 [@container(min-width:72rem)]:pe-8"
              )}
            >
              <p className="text-sm text-muted-foreground-inverse">{feature.number}</p>
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold text-foreground-inverse [@container(min-width:48rem)]:text-2xl">{feature.title}</h3>
                <p className="text-sm text-muted-foreground-inverse">{feature.description}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresNumberedFeatureRowsCopy = COPY

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Editorial Photo Split.
 *
 * An editorial top: copy at the start (a 12px `primary` eyebrow, a very
 * large heading, 60px on Desktop, and an 18px line) and a tall photo at the
 * end (460 × 520, 10px radius), vertically centred against it. Under it
 * three numbered features, each a 14px `primary` number, an 18px title and a
 * 14px line, divided by 1px rules on Desktop.
 *
 * Tablet puts the photo under the copy at full width, heading at 48px, and
 * sets the features two across. Mobile stacks everything, heading at 24px.
 *
 * Content limits: the heading up to 40 characters, a feature's title up to
 * 32 and its line up to 85. The other limits are in the block's documentation page.
 */

export interface FeaturesEditorialFeature {
  /** Keys the feature. */
  id: string
  /** The number, such as "01". */
  number: React.ReactNode
  /** The feature's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesEditorialPhotoSplitCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The features, in order. */
  features: FeaturesEditorialFeature[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesEditorialPhotoSplitCopy> = {
  en: {
    eyebrow: "FEATURES",
    heading: "Software that stays out of your way",
    description: "We cut the setup screens, the required fields and the four levels of nesting. What's left is the smallest set of ideas that still describes real work.",
    features: [
      { id: "objects", number: "01", title: "Three objects, not thirty", description: "Projects, items and views. Everything else is a property of one of them." },
      { id: "configure", number: "02", title: "Nothing to configure first", description: "Open it and start typing. Add structure the day you need it, not before." },
      { id: "permanent", number: "03", title: "Nothing is permanent", description: "Every change is versioned, so trying something is never a commitment." },
    ],
  },
  ar: {
    eyebrow: "الميزات",
    heading: "برنامج لا يقف في طريقك",
    description: "حذفنا شاشات الإعداد، والحقول الإلزامية، والتفرّعات الأربعة. ما بقي هو أقل عدد من المفاهيم يكفي لوصف العمل الحقيقي.",
    features: [
      { id: "objects", number: "01", title: "ثلاثة عناصر لا ثلاثون", description: "مشاريع وعناصر وعروض. وكل ما عداها خاصية لأحدها." },
      { id: "configure", number: "02", title: "لا إعدادات قبل البدء", description: "افتح وابدأ الكتابة. أضف التنظيم يوم تحتاجه، لا قبله." },
      { id: "permanent", number: "03", title: "لا شيء نهائي", description: "كل تغيير محفوظ بنسخته، فالتجربة لا تعني الالتزام." },
    ],
  },
}

export interface FeaturesEditorialPhotoSplitProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesEditorialPhotoSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The photo beside the heading. A `muted` placeholder shows without it. */
  photo?: FeaturesPhoto
}

export function FeaturesEditorialPhotoSplit({ locale = "en", eyebrow, heading, description, features, photo, className, ...props }: FeaturesEditorialPhotoSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = features ?? copy.features

  return (
    <FeaturesSection labelledBy={headingId} contentClassName="gap-16" className={className} {...props}>
      <div className="flex flex-col gap-10 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-end [@container(min-width:72rem)]:gap-16">
        <header className="flex min-w-0 flex-col items-start gap-6 [@container(min-width:72rem)]:flex-1">
          {(eyebrow ?? copy.eyebrow) ? <p className="text-xs font-medium tracking-wide text-primary rtl:tracking-normal">{eyebrow ?? copy.eyebrow}</p> : null}
          <h2 id={headingId} className="text-2xl [@container(max-width:47.99rem)]:leading-[44px] [@container(max-width:47.99rem)]:rtl:leading-[60px] font-semibold text-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:72rem)]:text-6xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-lg text-muted-foreground">{description ?? copy.description}</p>
        </header>
        <FeaturesPhotoSlot photo={photo} className="aspect-[296/335] w-full shrink-0 rounded-lg [@container(min-width:48rem)]:aspect-[640/723] [@container(min-width:72rem)]:aspect-[460/520] [@container(min-width:72rem)]:w-[460px] [@container(min-width:72rem)]:max-w-[38%]" />
      </div>
      {list.length > 0 ? (
        <ol role="list" className="grid grid-cols-1 gap-6 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:48rem)]:gap-x-0 [@container(min-width:48rem)]:gap-y-8 [@container(min-width:72rem)]:grid-cols-3">
          {list.map((feature) => (
            <li
              key={feature.id}
              className={cn(
                "flex min-w-0 flex-col gap-3 border-border [@container(min-width:48rem)]:pe-10 [@container(min-width:48rem)]:even:ps-10 [@container(min-width:48rem)]:last:pe-0",
                "[@container(min-width:72rem)]:px-10 [@container(min-width:72rem)]:first:ps-0 [@container(min-width:72rem)]:last:pe-0 [@container(min-width:72rem)]:[&:not(:first-child)]:border-s"
              )}
            >
              <p className="text-sm font-medium text-primary">{feature.number}</p>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
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
export const featuresEditorialPhotoSplitCopy = COPY

"use client"

import * as React from "react"
import { Plug, ShieldCheck, Workflow } from "lucide-react"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Split Photo + Icon List.
 *
 * Copy on one side and a photo on the other. The copy is the header (an
 * eyebrow, the heading and a line under it) over three items; an item is a
 * 44px `secondary` chip holding a 20px Lucide mark, a 16px title and a 14px
 * line. The photo is a 592 × 600 box with a 10px radius.
 *
 * Desktop sets them side by side, copy at the start and the photo at the end,
 * 64px apart. Tablet and Mobile stack the photo under the copy, still square.
 * Without a photo the box stays, as a `muted` placeholder.
 *
 * Content limits: an item's title up to 40 characters and its line up to 110.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesSplitPhotoIconListItem {
  /** Keys the item. */
  id: string
  /** The item's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
  /** The Lucide mark in the chip. */
  icon?: React.ElementType
}

export interface FeaturesSplitPhotoIconListCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The items, in order. */
  items: FeaturesSplitPhotoIconListItem[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesSplitPhotoIconListCopy> = {
  en: {
    eyebrow: "PLATFORM",
    heading: "One platform, every part of the workflow",
    description: "Replace four disconnected tools with a single system your team can actually keep up to date.",
    items: [
      { id: "automations", icon: Workflow, title: "Automations that run themselves", description: "Trigger updates, hand-offs and reminders from the events already happening in your workspace." },
      { id: "security", icon: ShieldCheck, title: "Security your legal team signs off on", description: "Granular roles, full audit logs, and single sign-on on every paid tier." },
      { id: "integrations", icon: Plug, title: "Integrations without a project plan", description: "Two hundred connectors, a documented API and webhooks for everything the UI can do." },
    ],
  },
  ar: {
    eyebrow: "المنصّة",
    heading: "منصّة واحدة تغطّي كل مراحل سير العمل",
    description: "استبدل أربع أدوات منفصلة بنظام واحد يستطيع فريقك إبقاءه محدَّثًا فعليًا.",
    items: [
      { id: "automations", icon: Workflow, title: "أتمتة تعمل من تلقاء نفسها", description: "أطلِق التحديثات والتسليمات والتذكيرات من الأحداث الجارية أصلًا في مساحة عملك." },
      { id: "security", icon: ShieldCheck, title: "أمان توافق عليه إدارتك القانونية", description: "أدوار دقيقة، وسجلات تدقيق كاملة، وتسجيل دخول موحّد في كل الباقات المدفوعة." },
      { id: "integrations", icon: Plug, title: "تكاملات لا تحتاج إلى خطة مشروع", description: "مئتا موصِّل، وواجهة API موثّقة، وخطافات ويب لكل ما تستطيع الواجهة فعله." },
    ],
  },
}

export interface FeaturesSplitPhotoIconListProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesSplitPhotoIconListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The photo beside the copy. A `muted` placeholder shows without it. */
  photo?: FeaturesPhoto
}

export function FeaturesSplitPhotoIconList({ locale = "en", eyebrow, heading, description, items, photo, className, ...props }: FeaturesSplitPhotoIconListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="flex flex-col gap-10 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-center [@container(min-width:72rem)]:gap-16">
        <div className="flex min-w-0 flex-col gap-10 [@container(min-width:72rem)]:flex-1">
          <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} />
          {list.length > 0 ? (
            <ul role="list" className="flex flex-col gap-6">
              {list.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id} className="flex items-start gap-4">
                    {Icon ? (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon size={20} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                      </span>
                    ) : null}
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
        <FeaturesPhotoSlot photo={photo} className="aspect-[592/600] w-full shrink-0 rounded-lg [@container(min-width:72rem)]:w-[592px] [@container(min-width:72rem)]:max-w-[48%]" />
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresSplitPhotoIconListCopy = COPY

"use client"

import * as React from "react"
import { Bell, Calendar, Clock, Code, Database, FileText, Filter, Globe, Lock, Plug, Search, Users } from "lucide-react"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Photo + Feature Chips.
 *
 * A photo beside the copy: the header (an eyebrow, the heading and a line
 * under it) over twelve chips. A chip is a pill (`card` fill, 1px `border`)
 * holding a 16px Lucide mark and a 14px label, 10px from the next.
 *
 * Desktop sets the 560 × 540 photo at the start and the copy at the end, 64px
 * apart. Tablet and Mobile put the photo above the copy at full width. The
 * chips wrap, and hold no state.
 *
 * Content limits: a chip's label up to 22 characters. The other limits are
 * in the block's documentation page.
 */

export interface FeaturesFeatureChip {
  /** Keys the chip. */
  id: string
  /** The chip's label. */
  label: React.ReactNode
  /** The Lucide mark before it. */
  icon?: React.ElementType
}

export interface FeaturesPhotoFeatureChipsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The chips, in order. */
  chips: FeaturesFeatureChip[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesPhotoFeatureChipsCopy> = {
  en: {
    eyebrow: "INCLUDED ON EVERY PLAN",
    heading: "Forty features you will not be upsold on",
    description: "The list below ships with the base tier. No add-ons, no seat minimums, no \"contact sales\" to unlock a checkbox.",
    chips: [
      { id: "guests", icon: Users, label: "Unlimited guests" },
      { id: "search", icon: Search, label: "Global search" },
      { id: "time", icon: Clock, label: "Time tracking" },
      { id: "alerts", icon: Bell, label: "Custom alerts" },
      { id: "history", icon: FileText, label: "Version history" },
      { id: "languages", icon: Globe, label: "12 languages" },
      { id: "sso", icon: Lock, label: "SSO & SCIM" },
      { id: "export", icon: Database, label: "Data export" },
      { id: "integrations", icon: Plug, label: "200 integrations" },
      { id: "timeline", icon: Calendar, label: "Timeline view" },
      { id: "filters", icon: Filter, label: "Saved filters" },
      { id: "api", icon: Code, label: "Public API" },
    ],
  },
  ar: {
    eyebrow: "مشمول في كل الباقات",
    heading: "أربعون ميزة لن تُطالَب بترقية للحصول عليها",
    description: "القائمة أدناه مشمولة في الباقة الأساسية. دون إضافات، ودون حد أدنى للمقاعد، ودون «تواصل مع المبيعات» لتفعيل خيار.",
    chips: [
      { id: "guests", icon: Users, label: "ضيوف بلا حدود" },
      { id: "search", icon: Search, label: "بحث شامل" },
      { id: "time", icon: Clock, label: "تتبّع الوقت" },
      { id: "alerts", icon: Bell, label: "تنبيهات مخصّصة" },
      { id: "history", icon: FileText, label: "سجل الإصدارات" },
      { id: "languages", icon: Globe, label: "12 لغة" },
      { id: "sso", icon: Lock, label: "SSO و SCIM" },
      { id: "export", icon: Database, label: "تصدير البيانات" },
      { id: "integrations", icon: Plug, label: "200 تكامل" },
      { id: "timeline", icon: Calendar, label: "عرض الجدول الزمني" },
      { id: "filters", icon: Filter, label: "مرشّحات محفوظة" },
      { id: "api", icon: Code, label: "واجهة API عامة" },
    ],
  },
}

export interface FeaturesPhotoFeatureChipsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesPhotoFeatureChipsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The photo beside the copy. A `muted` placeholder shows without it. */
  photo?: FeaturesPhoto
}

export function FeaturesPhotoFeatureChips({ locale = "en", eyebrow, heading, description, chips, photo, className, ...props }: FeaturesPhotoFeatureChipsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = chips ?? copy.chips

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="flex flex-col gap-10 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-center [@container(min-width:72rem)]:gap-16">
        <FeaturesPhotoSlot photo={photo} className="aspect-[296/285] w-full shrink-0 rounded-lg [@container(min-width:48rem)]:aspect-[640/615] [@container(min-width:72rem)]:aspect-[560/540] [@container(min-width:72rem)]:w-[560px] [@container(min-width:72rem)]:max-w-[46%]" />
        <div className="flex min-w-0 flex-col gap-10 [@container(min-width:72rem)]:flex-1">
          <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} />
          {list.length > 0 ? (
            <ul role="list" className="flex flex-wrap gap-2.5">
              {list.map((chip) => {
                const Icon = chip.icon
                return (
                  <li key={chip.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-2 pe-4 ps-3 text-sm font-medium text-card-foreground">
                    {Icon ? <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" /> : null}
                    <span>{chip.label}</span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPhotoFeatureChipsCopy = COPY

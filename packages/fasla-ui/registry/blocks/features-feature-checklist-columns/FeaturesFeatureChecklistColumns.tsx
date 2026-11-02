"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Button, buttonVariants } from "../../ui/button/button"
import { FeaturesHeader, FeaturesRule, FeaturesSection, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Feature Checklist Columns.
 *
 * A top row, the section header at the start and a primary Compare plans
 * button at the end, then three columns. A column is a 16px title, a
 * hairline and six items; an item is a 16px Lucide check in `primary` and a
 * 14px line in `muted-foreground`.
 *
 * Desktop sets the three columns across with 64px between them. Tablet sets
 * two across, the third beneath. Mobile stacks them with 40px between, and
 * the button takes the full width under the header.
 *
 * Content limits: a column's title up to 24 characters, an item up to 45.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesChecklistColumn {
  /** Keys the column. */
  id: string
  /** The column's title. */
  title: React.ReactNode
  /** The checked items, in order. */
  items: React.ReactNode[]
}

export interface FeaturesFeatureChecklistColumnsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The columns, in order. */
  columns: FeaturesChecklistColumn[]
  /** The button's label. */
  compare: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesFeatureChecklistColumnsCopy> = {
  en: {
    eyebrow: "WHAT IS INCLUDED",
    heading: "The whole list",
    compare: "Compare plans",
    columns: [
      {
        id: "core",
        title: "Core",
        items: ["Unlimited projects", "Board, table and timeline views", "Custom fields and formulas", "Saved and shared filters", "Templates for every project type", "Full-text search across the workspace"],
      },
      {
        id: "collaboration",
        title: "Collaboration",
        items: ["Free guest accounts", "Threaded comments and mentions", "Real-time multiplayer editing", "Shared inbox for requests", "Approval and review workflows", "Public share links with expiry"],
      },
      {
        id: "admin",
        title: "Admin & security",
        items: ["SSO, SCIM and SAML", "Field-level permissions", "Complete audit log", "Regional data residency", "Ninety-day version history", "One-click full data export"],
      },
    ],
  },
  ar: {
    eyebrow: "ما المشمول",
    heading: "القائمة كاملة",
    compare: "قارن الباقات",
    columns: [
      {
        id: "core",
        title: "الأساسيات",
        items: ["مشاريع بلا حدود", "عروض اللوحة والجدول والجدول الزمني", "حقول ومعادلات مخصّصة", "مرشّحات محفوظة ومشتركة", "قوالب لكل نوع مشروع", "بحث نصّي كامل عبر مساحة العمل"],
      },
      {
        id: "collaboration",
        title: "التعاون",
        items: ["حسابات ضيوف مجانية", "تعليقات متسلسلة وإشارات", "تحرير لحظي متعدد المستخدمين", "صندوق وارد مشترك للطلبات", "مسارات الموافقة والمراجعة", "روابط مشاركة عامة بتاريخ انتهاء"],
      },
      {
        id: "admin",
        title: "الإدارة والأمان",
        items: ["SSO و SCIM و SAML", "صلاحيات على مستوى الحقل", "سجل تدقيق كامل", "إقامة إقليمية للبيانات", "سجل إصدارات لتسعين يومًا", "تصدير كامل للبيانات بنقرة واحدة"],
      },
    ],
  },
}

export interface FeaturesFeatureChecklistColumnsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesFeatureChecklistColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Where the Compare plans button goes. Without it, the button calls `onCompare`. */
  compareHref?: string
  /** Called when the button is pressed and has no `compareHref`. */
  onCompare?: () => void
}

export function FeaturesFeatureChecklistColumns({
  locale = "en",
  eyebrow,
  heading,
  columns,
  compare,
  compareHref,
  onCompare,
  className,
  ...props
}: FeaturesFeatureChecklistColumnsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = columns ?? copy.columns
  const label = compare ?? copy.compare
  const buttonClass = "w-full shrink-0 [@container(min-width:48rem)]:w-auto"

  return (
    <FeaturesSection labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-4 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-end [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-10 [@container(min-width:72rem)]:gap-16">
        <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} className="flex-1" />
        {compareHref ? (
          <a href={compareHref} className={buttonVariants({ variant: "default", size: "md", className: `${buttonClass}` })}>
            {label}
          </a>
        ) : (
          <Button type="button" variant="default" size="md" onClick={onCompare} className={`${buttonClass}`}>
            {label}
          </Button>
        )}
      </div>
      {list.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-3 [@container(min-width:72rem)]:gap-x-16">
          {list.map((column) => (
            <section key={column.id} className="flex min-w-0 flex-col gap-5">
              <h3 className="text-base font-semibold text-foreground">{column.title}</h3>
              <FeaturesRule />
              <ul role="list" className="flex flex-col gap-3">
                {column.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="mt-0.5 shrink-0 text-primary" />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresFeatureChecklistColumnsCopy = COPY

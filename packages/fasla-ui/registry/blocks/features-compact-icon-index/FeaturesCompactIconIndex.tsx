"use client"

import * as React from "react"
import { Bell, Calendar, Clock, Code, Database, FileText, Filter, Globe, History, Inbox, Lock, Plug, Search, Table, Tag, Users } from "lucide-react"
import { FeaturesHeader, FeaturesRule, FeaturesSection, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Compact Icon Index.
 *
 * A header row, the section header at the start and a 14px note at the end
 * on its bottom line, then a hairline, then sixteen items. An item is a 16px
 * Lucide mark and a 14px title on one line, with a 12px line under it.
 *
 * Desktop sets the items four across, Tablet three across and Mobile two
 * across; the header's note drops under the heading on Tablet and Mobile.
 * Titles and lines wrap rather than cut off, which Figma's Mobile does not.
 * The index holds no state.
 *
 * Content limits: an item's title up to 24 characters and its line up to
 * 45. The other limits are in the block's documentation page.
 */

export interface FeaturesCompactIconIndexItem {
  /** Keys the item. */
  id: string
  /** The item's title. */
  title: React.ReactNode
  /** The short line under it. */
  description: React.ReactNode
  /** The Lucide mark before the title. */
  icon?: React.ElementType
}

export interface FeaturesCompactIconIndexCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The note beside the heading. */
  note: React.ReactNode
  /** The items, in order. */
  items: FeaturesCompactIconIndexItem[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesCompactIconIndexCopy> = {
  en: {
    eyebrow: "THE FULL LIST",
    heading: "Everything else, in one place",
    note: "Sixteen of the forty-two features included on every plan.",
    items: [
      { id: "search", icon: Search, title: "Global search", description: "Across every project" },
      { id: "filters", icon: Filter, title: "Saved filters", description: "Share them with the team" },
      { id: "timeline", icon: Calendar, title: "Timeline view", description: "With dependencies" },
      { id: "table", icon: Table, title: "Table view", description: "Editable inline" },
      { id: "alerts", icon: Bell, title: "Custom alerts", description: "Per project or field" },
      { id: "inbox", icon: Inbox, title: "Unified inbox", description: "One place for mentions" },
      { id: "history", icon: FileText, title: "Version history", description: "Ninety days on every plan" },
      { id: "fields", icon: Tag, title: "Custom fields", description: "Twelve field types" },
      { id: "guests", icon: Users, title: "Guest access", description: "Free for external people" },
      { id: "sso", icon: Lock, title: "SSO & SCIM", description: "Okta, Entra, Google" },
      { id: "integrations", icon: Plug, title: "Integrations", description: "Two hundred connectors" },
      { id: "api", icon: Code, title: "Public API", description: "REST and webhooks" },
      { id: "time", icon: Clock, title: "Time tracking", description: "Exports to billing" },
      { id: "export", icon: Database, title: "Full data export", description: "JSON or CSV, anytime" },
      { id: "languages", icon: Globe, title: "Twelve languages", description: "Including RTL layouts" },
      { id: "audit", icon: History, title: "Audit log", description: "Every action, retained" },
    ],
  },
  ar: {
    eyebrow: "القائمة الكاملة",
    heading: "كل ما تبقّى في مكان واحد",
    note: "ستّ عشرة ميزة من أصل اثنتين وأربعين مشمولة في كل الباقات.",
    items: [
      { id: "search", icon: Search, title: "بحث شامل", description: "عبر كل المشاريع" },
      { id: "filters", icon: Filter, title: "مرشّحات محفوظة", description: "شاركها مع الفريق" },
      { id: "timeline", icon: Calendar, title: "عرض الجدول الزمني", description: "مع الاعتماديات" },
      { id: "table", icon: Table, title: "عرض الجدول", description: "قابل للتحرير مباشرة" },
      { id: "alerts", icon: Bell, title: "تنبيهات مخصّصة", description: "لكل مشروع أو حقل" },
      { id: "inbox", icon: Inbox, title: "صندوق وارد موحّد", description: "مكان واحد للإشارات" },
      { id: "history", icon: FileText, title: "سجل الإصدارات", description: "تسعون يومًا في كل الباقات" },
      { id: "fields", icon: Tag, title: "حقول مخصّصة", description: "اثنا عشر نوعًا من الحقول" },
      { id: "guests", icon: Users, title: "وصول الضيوف", description: "مجاني للأشخاص الخارجيين" },
      { id: "sso", icon: Lock, title: "SSO و SCIM", description: "Okta و Entra و Google" },
      { id: "integrations", icon: Plug, title: "التكاملات", description: "مئتا موصِّل" },
      { id: "api", icon: Code, title: "واجهة API عامة", description: "REST وخطافات الويب" },
      { id: "time", icon: Clock, title: "تتبّع الوقت", description: "تصدير إلى الفوترة" },
      { id: "export", icon: Database, title: "تصدير كامل للبيانات", description: "JSON أو CSV في أي وقت" },
      { id: "languages", icon: Globe, title: "اثنتا عشرة لغة", description: "بما فيها التخطيطات من اليمين إلى اليسار" },
      { id: "audit", icon: History, title: "سجل التدقيق", description: "كل إجراء محفوظ" },
    ],
  },
}

export interface FeaturesCompactIconIndexProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesCompactIconIndexCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesCompactIconIndex({ locale = "en", eyebrow, heading, note, items, className, ...props }: FeaturesCompactIconIndexProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <FeaturesSection labelledBy={headingId} gap="md" contentClassName="gap-12" className={className} {...props}>
      <div className="flex flex-col gap-3 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-end [@container(min-width:72rem)]:justify-between [@container(min-width:72rem)]:gap-16">
        <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} className="flex-1" />
        <p className="text-sm text-muted-foreground [@container(min-width:72rem)]:max-w-[22.5rem]">{note ?? copy.note}</p>
      </div>
      <FeaturesRule />
      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-2 gap-x-8 gap-y-8 [@container(min-width:48rem)]:grid-cols-3 [@container(min-width:48rem)]:gap-x-12 [@container(min-width:72rem)]:grid-cols-4 [@container(min-width:72rem)]:gap-y-12">
          {list.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id} className="flex min-w-0 flex-col gap-2">
                <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  {Icon ? <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 [@container(min-width:72rem)]:size-4" /> : null}
                  <p className="min-w-0 text-sm font-medium">{item.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
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
export const featuresCompactIconIndexCopy = COPY

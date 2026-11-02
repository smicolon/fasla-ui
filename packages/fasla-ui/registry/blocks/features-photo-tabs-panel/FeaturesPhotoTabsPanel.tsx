"use client"

import * as React from "react"
import { CircleCheckBig } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Photo Tabs Panel.
 *
 * A centred header (an eyebrow, the heading and a line under it, 660px wide),
 * a Boxed Tabs group of four tabs, and under it one panel at a time in a 1px
 * `border` frame on a `card` surface: the copy (a 24px title, a 16px line and
 * three checked bullets) and a photo (624 × 458).
 *
 * Desktop sets the copy at the start and the photo at the end. Tablet and
 * Mobile put the photo above the copy, and on Mobile the tabs scroll sideways
 * when they do not fit. The tabs are the Tabs atom, so the arrow keys move
 * between them and the indicator slides.
 *
 * Content limits: a tab's label up to 14 characters, a panel's title up to
 * 56, its line up to 190 and a bullet up to 36. The other limits are in the
 * block's documentation page.
 */

export interface FeaturesTabPanel {
  /** Keys the tab and its panel. */
  id: string
  /** The tab's label. */
  label: React.ReactNode
  /** The panel's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
  /** The checked bullets. */
  bullets: React.ReactNode[]
  /** The panel's photo. */
  image?: FeaturesPhoto
}

export interface FeaturesPhotoTabsPanelCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The tabs and their panels, in order. */
  tabs: FeaturesTabPanel[]
}

/** Figma's copy for the first tab, English and Arabic; the other three are written for the code, in the same voice. */
const COPY: Record<FeaturesLocale, FeaturesPhotoTabsPanelCopy> = {
  en: {
    eyebrow: "BY TEAM",
    heading: "Pick the team, see the setup",
    description: "The same objects, arranged for the people who use them most.",
    tabs: [
      {
        id: "product",
        label: "Product",
        title: "Roadmap, specs and releases on one timeline",
        description: "Product teams get a view where the roadmap item, its spec, the open tickets and the release note are the same record — so shipping something never means updating four places.",
        bullets: ["Dependency-aware timeline", "Spec and ticket on one object", "Auto-drafted release notes"],
      },
      {
        id: "marketing",
        label: "Marketing",
        title: "Campaigns, assets and approvals in one place",
        description: "Marketing teams plan a campaign as one object: the brief, the creative, the channel calendar and the sign-off live together, so nothing ships without its approval.",
        bullets: ["Channel calendar with owners", "Asset review in context", "One-click approval trail"],
      },
      {
        id: "operations",
        label: "Operations",
        title: "Recurring work that runs on a template",
        description: "Operations teams turn a checklist into a template once. Each run gets its own owner, dates and audit trail, and nobody rebuilds the process from memory.",
        bullets: ["Templates with owners and due dates", "Hand-offs that notify the next person", "A full history of every run"],
      },
      {
        id: "finance",
        label: "Finance",
        title: "Budgets, approvals and audit trails that agree",
        description: "Finance teams connect each spend request to the budget it draws from, so an approval updates the number everyone is looking at and leaves a record behind it.",
        bullets: ["Requests linked to budget lines", "Approval chains by amount", "Exports that match the dashboard"],
      },
    ],
  },
  ar: {
    eyebrow: "حسب الفريق",
    heading: "اختر الفريق لترى إعداده",
    description: "العناصر نفسها، مرتّبة لمن يستخدمونها أكثر.",
    tabs: [
      {
        id: "product",
        label: "المنتج",
        title: "خارطة الطريق والمواصفات والإصدارات على جدول زمني واحد",
        description: "تحصل فرق المنتج على عرض يكون فيه عنصر خارطة الطريق ومواصفته والتذاكر المفتوحة وملاحظة الإصدار سجلًّا واحدًا، فلا يعني الإطلاق تحديث أربعة مواضع.",
        bullets: ["جدول زمني يراعي الاعتماديات", "المواصفة والتذكرة على عنصر واحد", "ملاحظات إصدار تُصاغ تلقائيًا"],
      },
      {
        id: "marketing",
        label: "التسويق",
        title: "الحملات والمواد والموافقات في مكان واحد",
        description: "تخطّط فرق التسويق الحملة كعنصر واحد: الموجز والتصميم وجدول القنوات والموافقة النهائية تعيش معًا، فلا يُطلَق شيء دون موافقته.",
        bullets: ["جدول قنوات بأسماء المسؤولين", "مراجعة المواد في سياقها", "مسار موافقة بنقرة واحدة"],
      },
      {
        id: "operations",
        label: "العمليات",
        title: "عمل متكرر يسير على قالب",
        description: "تحوّل فرق العمليات قائمة المهام إلى قالب مرة واحدة. يحصل كل تشغيل على مسؤوله وتواريخه وسجله، فلا يعيد أحد بناء الإجراء من الذاكرة.",
        bullets: ["قوالب بمسؤولين وتواريخ استحقاق", "تسليمات تُنبّه الشخص التالي", "سجل كامل لكل تشغيل"],
      },
      {
        id: "finance",
        label: "المالية",
        title: "ميزانيات وموافقات وسجلات تدقيق متّسقة",
        description: "تربط فرق المالية كل طلب إنفاق بالميزانية التي يُسحب منها، فتحدّث الموافقة الرقم الذي ينظر إليه الجميع وتترك وراءها سجلًّا.",
        bullets: ["طلبات مرتبطة ببنود الميزانية", "مسارات موافقة حسب المبلغ", "تصدير يطابق لوحة المعلومات"],
      },
    ],
  },
}

export interface FeaturesPhotoTabsPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "defaultValue">, Partial<FeaturesPhotoTabsPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The `id` of the shown tab, when you control it. */
  value?: string
  /** The `id` of the tab shown first, when you do not. The first tab by default. */
  defaultValue?: string
  /** Called with the tab's `id` when the visitor picks another. */
  onValueChange?: (value: string) => void
}

export function FeaturesPhotoTabsPanel({ locale = "en", eyebrow, heading, description, tabs, value, defaultValue, onValueChange, className, ...props }: FeaturesPhotoTabsPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = tabs ?? copy.tabs

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <FeaturesHeader
        headingId={headingId}
        eyebrow={eyebrow ?? copy.eyebrow}
        heading={heading ?? copy.heading}
        description={description ?? copy.description}
        maxWidth={660}
        className="mx-auto items-center text-center"
      />
      {list.length > 0 ? (
        <Tabs
          value={value}
          defaultValue={defaultValue ?? list[0]!.id}
          onValueChange={onValueChange ? (next) => onValueChange(String(next)) : undefined}
          className="flex flex-col gap-10"
        >
          <div className="-mx-1 flex justify-start overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [@container(min-width:48rem)]:justify-center">
            <TabsList variant="boxed" className="w-max shrink-0">
              {list.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {list.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
              <div className="flex flex-col [@container(min-width:72rem)]:flex-row">
                <div className="flex flex-col justify-center gap-5 p-6 [@container(min-width:48rem)]:p-10 [@container(min-width:72rem)]:order-none [@container(min-width:72rem)]:flex-1 [@container(min-width:72rem)]:p-12">
                  <h3 className="text-xl font-semibold text-card-foreground [@container(min-width:48rem)]:text-2xl">{tab.title}</h3>
                  <p className="text-base text-muted-foreground">{tab.description}</p>
                  <ul role="list" className="flex flex-col gap-2.5">
                    {tab.bullets.map((bullet, position) => (
                      <li key={position} className="flex items-start gap-2.5 text-sm text-card-foreground">
                        <CircleCheckBig size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="mt-px shrink-0" />
                        <span className="min-w-0">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <FeaturesPhotoSlot photo={tab.image} className="order-first aspect-[294/218] w-full shrink-0 [@container(min-width:48rem)]:aspect-[638/471] [@container(min-width:72rem)]:order-none [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:min-h-[458px] [@container(min-width:72rem)]:w-1/2" />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPhotoTabsPanelCopy = COPY

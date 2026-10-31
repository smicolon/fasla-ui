"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesRule, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Feature List + Thumbnails.
 *
 * A header (an eyebrow and the heading), then four rows divided by hairlines.
 * A row is a thumbnail (200 × 132, 8px radius), a 20px title over a 14px
 * line, and a Learn more link in `primary` with an arrow that nudges along
 * the reading direction on hover.
 *
 * Desktop sets the thumbnail, the text and the link on one line. Tablet
 * shrinks the thumbnail to 180 × 119 and sets the link under the text (Figma's
 * Tablet leaves the link out; it stays here so every row keeps its action).
 * Mobile stacks the full-width thumbnail, the text and the link.
 *
 * Content limits: a row's title up to 28 characters and its line up to 130.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesThumbnailRow {
  /** Keys the row. */
  id: string
  /** The row's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
  /** The row's thumbnail. */
  image?: FeaturesPhoto
  /** Where the link goes. Without it, the link calls `onLearnMore` with the row's `id`. */
  href?: string
}

export interface FeaturesFeatureListThumbnailsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The rows, in order. */
  rows: FeaturesThumbnailRow[]
  /** The link's label. */
  learnMore: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesFeatureListThumbnailsCopy> = {
  en: {
    eyebrow: "WHAT YOU GET",
    heading: "Four things that stop being your problem",
    learnMore: "Learn more",
    rows: [
      { id: "onboarding", title: "Onboarding new people", description: "Templates, sample data and role-based views mean a new hire is productive on day one instead of week three." },
      { id: "status", title: "Chasing status updates", description: "Progress is computed from the work itself, so the roll-up is always current without anyone filing a report." },
      { id: "numbers", title: "Reconciling numbers", description: "One definition per metric, applied everywhere it appears — the dashboard and the board deck finally agree." },
      { id: "access", title: "Managing access", description: "Permissions follow the org chart you already sync, and revoke themselves when someone changes team." },
    ],
  },
  ar: {
    eyebrow: "ما الذي تحصل عليه",
    heading: "أربعة أمور تتوقف عن كونها مشكلتك",
    learnMore: "اعرف المزيد",
    rows: [
      { id: "onboarding", title: "تهيئة الموظفين الجدد", description: "القوالب والبيانات النموذجية والعروض المرتبطة بالأدوار تجعل الموظف الجديد منتجًا في يومه الأول بدل أسبوعه الثالث." },
      { id: "status", title: "ملاحقة تحديثات الحالة", description: "يُحتسب التقدّم من العمل نفسه، فيبقى التجميع محدَّثًا دائمًا دون أن يرفع أحد تقريرًا." },
      { id: "numbers", title: "تسوية الأرقام", description: "تعريف واحد لكل مؤشر يُطبَّق أينما ظهر، فتتفق أخيرًا لوحة المعلومات مع عرض مجلس الإدارة." },
      { id: "access", title: "إدارة الوصول", description: "تتبع الصلاحيات الهيكل التنظيمي الذي تزامنه أصلًا، وتُلغى تلقائيًا عند انتقال أحدهم إلى فريق آخر." },
    ],
  },
}

export interface FeaturesFeatureListThumbnailsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesFeatureListThumbnailsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Called with the row's `id` when its link is pressed and the row has no `href`. */
  onLearnMore?: (id: string) => void
}

export function FeaturesFeatureListThumbnails({ locale = "en", eyebrow, heading, rows, learnMore, onLearnMore, className, ...props }: FeaturesFeatureListThumbnailsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = rows ?? copy.rows
  const label = learnMore ?? copy.learnMore
  const linkClass = "group/link inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const arrow = (
    <ArrowRight
      size={16}
      strokeWidth={1.5}
      absoluteStrokeWidth
      aria-hidden
      className="[&:dir(rtl)]:-scale-x-100 motion-safe:transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:rtl:group-hover/link:-translate-x-0.5"
    />
  )

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} />
      {list.length > 0 ? (
        <ul role="list" className="flex flex-col">
          {list.map((row, index) => (
            <li key={row.id} className="flex flex-col">
              {index > 0 ? <FeaturesRule /> : null}
              <div className="grid grid-cols-1 gap-4 py-6 [@container(min-width:48rem)]:grid-cols-[180px_1fr] [@container(min-width:48rem)]:gap-x-8 [@container(min-width:48rem)]:gap-y-3 [@container(min-width:72rem)]:grid-cols-[200px_1fr_auto] [@container(min-width:72rem)]:items-center">
                <FeaturesPhotoSlot photo={row.image} className="aspect-[296/196] w-full rounded-lg [@container(min-width:48rem)]:row-span-2 [@container(min-width:48rem)]:aspect-auto [@container(min-width:48rem)]:h-[119px] [@container(min-width:48rem)]:self-center [@container(min-width:72rem)]:row-span-1 [@container(min-width:72rem)]:h-[132px]" />
                <div className="flex min-w-0 flex-col gap-1.5 [@container(min-width:48rem)]:col-start-2 [@container(min-width:48rem)]:row-start-1 [@container(min-width:48rem)]:self-end [@container(min-width:72rem)]:self-center">
                  <h3 className="text-xl font-semibold text-foreground">{row.title}</h3>
                  <p className="text-sm text-muted-foreground">{row.description}</p>
                </div>
                <div className="self-start [@container(min-width:48rem)]:col-start-2 [@container(min-width:48rem)]:row-start-2 [@container(min-width:72rem)]:col-start-3 [@container(min-width:72rem)]:row-start-1 [@container(min-width:72rem)]:self-center">
                  {row.href ? (
                    <a href={row.href} className={linkClass}>
                      {label}
                      {arrow}
                    </a>
                  ) : (
                    <button type="button" onClick={() => onLearnMore?.(row.id)} className={linkClass}>
                      {label}
                      {arrow}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresFeatureListThumbnailsCopy = COPY

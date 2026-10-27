"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Figures, PricingActionButton, PricingHeader, PricingRule, PricingSection, isLatin, type PricingAction } from "../pricing/pricing"

/*
 * Figma: `Pricing` (46332:2894), Type=Comparison Matrix.
 *
 * Every plan's features side by side in one table: a column per plan headed
 * by its name, price and an sm button, and a row per feature under a `muted`
 * row that names its group. A check in `primary` marks a feature a plan has
 * and a minus in `muted-foreground` one it hasn't; the other cells are text.
 * The recommended plan's column is tinted 5% `primary` from its header down,
 * and its header carries a Solid badge and the Solid button.
 *
 * From Tablet up it is a real table: the feature column is 400px on Desktop
 * and 176px on Tablet, the plans share the rest, and Tablet narrows the cell
 * padding. On phones the table becomes a card per plan, one under another,
 * each listing every feature with its value at the end of the line, and the
 * feature names take their `shortLabel` where they have one.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface PricingComparisonMatrixPlan {
  /** Passed to `onPlanSelect`. */
  id: string
  name: React.ReactNode
  /** The price under the name, with its unit: `$24 /user/mo`, or `Custom pricing`. */
  price: React.ReactNode
  /** A Solid badge above the name, "Most popular". */
  badge?: React.ReactNode
  /** The plan you recommend: its column is tinted and its button Solid. */
  highlighted?: boolean
  action: PricingAction
}

/** A cell: `true` draws a check, `false` a minus, and text shows as it is. */
export type PricingComparisonMatrixValue = React.ReactNode | boolean

export interface PricingComparisonMatrixRow {
  label: React.ReactNode
  /** A shorter name for the cards on phones, as Figma shortens it there. */
  shortLabel?: React.ReactNode
  /** One value per plan, in the plans' order. */
  values: PricingComparisonMatrixValue[]
}

export interface PricingComparisonMatrixGroup {
  label: React.ReactNode
  rows: PricingComparisonMatrixRow[]
}

export interface PricingComparisonMatrixCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The label in the table's top corner, over the feature column. */
  cornerLabel: React.ReactNode
  /** The plans, one column each, in reading order. */
  plans: PricingComparisonMatrixPlan[]
  /** The features, in groups. */
  groups: PricingComparisonMatrixGroup[]
  /** What assistive tech reads for a check. */
  includedLabel: string
  /** What assistive tech reads for a minus. */
  notIncludedLabel: string
}

/**
 * Figma's copy, English and Arabic. The two cell labels are for assistive
 * tech only. One departure: Figma's Arabic short label «SSO و SCIM» puts a و
 * between two Latin names, where it reads as a Latin "g"; the code uses the
 * house separator, «SSO · SCIM».
 */
const COPY: Record<"en" | "ar", PricingComparisonMatrixCopy> = {
  en: {
    heading: "Compare plans in detail",
    description: "Every plan starts with the essentials. Pick the one that matches where your team is headed.",
    cornerLabel: "Compare features",
    plans: [
      { id: "starter", name: "Starter", price: "$10 /user/mo", action: { label: "Get started" } },
      { id: "growth", name: "Growth", price: "$24 /user/mo", badge: "Most popular", highlighted: true, action: { label: "Choose Growth" } },
      { id: "scale", name: "Scale", price: "$49 /user/mo", action: { label: "Choose Scale" } },
      { id: "enterprise", name: "Enterprise", price: "Custom pricing", action: { label: "Talk to sales" } },
    ],
    groups: [
      {
        label: "Usage",
        rows: [
          { label: "Team members", values: ["Up to 3", "Up to 20", "Unlimited", "Custom"] },
          { label: "Active projects", values: ["5", "Unlimited", "Unlimited", "Unlimited"] },
          { label: "File storage", values: ["2 GB", "50 GB", "500 GB", "Custom"] },
        ],
      },
      {
        label: "Features",
        rows: [
          { label: "Analytics", values: ["Basic", "Advanced", "Advanced", "Advanced"] },
          { label: "Custom domains", values: [false, true, true, true] },
          { label: "API access", values: [false, false, true, true] },
          { label: "SSO & SCIM provisioning", shortLabel: "SSO & SCIM", values: [false, false, true, true] },
          { label: "Audit logs", values: [false, false, true, true] },
        ],
      },
      {
        label: "Support & security",
        rows: [
          { label: "Support", values: ["Community", "Priority email", "24/7 chat", "Dedicated manager"] },
          { label: "SOC 2 Type II report", shortLabel: "SOC 2 Type II", values: [false, false, true, true] },
          { label: "Uptime SLA", values: ["—", "—", "—", "99.9%"] },
        ],
      },
    ],
    includedLabel: "Included",
    notIncludedLabel: "Not included",
  },
  ar: {
    heading: "قارن الخطط بالتفصيل",
    description: "كل الخطط تبدأ بالأساسيات. اختر ما يناسب وجهة فريقك.",
    cornerLabel: "قارن الميزات",
    plans: [
      { id: "starter", name: "المبتدئة", price: "$10 /مستخدم/شهر", action: { label: "ابدأ الآن" } },
      { id: "growth", name: "النمو", price: "$24 /مستخدم/شهر", badge: "الأكثر شيوعًا", highlighted: true, action: { label: "اختر النمو" } },
      { id: "scale", name: "التوسّع", price: "$49 /مستخدم/شهر", action: { label: "اختر التوسّع" } },
      { id: "enterprise", name: "المؤسسات", price: "تسعير مخصص", action: { label: "تحدث إلى المبيعات" } },
    ],
    groups: [
      {
        label: "الاستخدام",
        rows: [
          { label: "أعضاء الفريق", values: ["حتى 3", "حتى 20", "غير محدود", "مخصص"] },
          { label: "المشاريع النشطة", values: ["5", "غير محدود", "غير محدود", "غير محدود"] },
          { label: "تخزين الملفات", values: ["2 جيجابايت", "50 جيجابايت", "500 جيجابايت", "مخصص"] },
        ],
      },
      {
        label: "الميزات",
        rows: [
          { label: "التحليلات", values: ["أساسية", "متقدمة", "متقدمة", "متقدمة"] },
          { label: "نطاقات مخصصة", values: [false, true, true, true] },
          { label: "الوصول إلى API", values: [false, false, true, true] },
          { label: "SSO وإدارة SCIM", shortLabel: "SSO · SCIM", values: [false, false, true, true] },
          { label: "سجلات التدقيق", values: [false, false, true, true] },
        ],
      },
      {
        label: "الدعم والأمان",
        rows: [
          { label: "الدعم", values: ["المجتمع", "بريد ذو أولوية", "محادثة 24/7", "مدير مخصص"] },
          { label: "تقرير SOC 2 Type II", shortLabel: "SOC 2 Type II", values: [false, false, true, true] },
          { label: "اتفاقية مستوى الخدمة SLA", values: ["—", "—", "—", "99.9%"] },
        ],
      },
    ],
    includedLabel: "مشمولة",
    notIncludedLabel: "غير مشمولة",
  },
}

/**
 * The 1px `border` line under a row, drawn inside its cells as Figma draws the
 * stroke inside the row, so each row keeps Figma's 48px instead of 49.
 */
const DIVIDER = "shadow-[inset_0_-1px_0_0_var(--border)]"

export interface PricingComparisonMatrixProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<PricingComparisonMatrixCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with the plan's `id` when a button without an `href` is pressed. */
  onPlanSelect?: (planId: string) => void
}

export function PricingComparisonMatrix({
  locale = "en",
  heading,
  description,
  cornerLabel,
  plans,
  groups,
  includedLabel,
  notIncludedLabel,
  onPlanSelect,
  className,
  ...props
}: PricingComparisonMatrixProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const planList = plans ?? copy.plans
  const groupList = groups ?? copy.groups
  const yes = includedLabel ?? copy.includedLabel
  const no = notIncludedLabel ?? copy.notIncludedLabel

  /** A value as the cell shows it: a check, a minus, or the text (Geist when it has no Arabic, as Figma sets it). */
  const value = (cell: PricingComparisonMatrixValue, textClass: string) => {
    if (cell === true || cell === false) {
      const Icon = cell ? Check : Minus
      return (
        <span className="inline-flex">
          <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className={cell ? "text-primary" : "text-muted-foreground"} />
          <span className="sr-only">{cell ? yes : no}</span>
        </span>
      )
    }
    return (
      <span className={cn(textClass, isLatin(cell) && "font-sans leading-5")}>
        <Figures>{cell}</Figures>
      </span>
    )
  }

  return (
    <PricingSection labelledBy={headingId} className={className} {...props}>
      <PricingHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />

      {/* Tablet and Desktop: the table. */}
      <div className="hidden w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm [@container(min-width:40rem)]:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[176px] [@container(min-width:64rem)]:w-[400px]" />
            {planList.map((plan) => (
              <col key={plan.id} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={cn("px-4 py-5 text-start align-bottom text-sm font-semibold text-muted-foreground [@container(min-width:64rem)]:px-6", DIVIDER)}>
                <Figures>{cornerLabel ?? copy.cornerLabel}</Figures>
              </th>
              {planList.map((plan) => (
                <th key={plan.id} scope="col" className={cn("px-2 py-5 align-bottom font-normal [@container(min-width:64rem)]:px-4", DIVIDER, plan.highlighted && "bg-primary/5")}>
                  <div className="flex flex-col items-center gap-2">
                    {plan.badge ? <Badge>{plan.badge}</Badge> : null}
                    <span className="text-base font-semibold text-foreground">
                      <Figures>{plan.name}</Figures>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <Figures>{plan.price}</Figures>
                    </span>
                    <PricingActionButton action={plan.action} highlighted={plan.highlighted} size="sm" onSelect={() => onPlanSelect?.(plan.id)} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {groupList.map((group, groupIndex) => (
            <tbody key={groupIndex}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={planList.length + 1}
                  className="bg-muted px-4 py-2.5 text-start text-sm font-semibold text-foreground [@container(min-width:64rem)]:px-6"
                >
                  <Figures>{group.label}</Figures>
                </th>
              </tr>
              {group.rows.map((row, rowIndex) => {
                const last = groupIndex === groupList.length - 1 && rowIndex === group.rows.length - 1
                return (
                  <tr key={rowIndex}>
                    <th scope="row" className={cn("px-4 py-3.5 text-start text-sm font-normal text-foreground [@container(min-width:64rem)]:px-6", !last && DIVIDER)}>
                      <Figures>{row.label}</Figures>
                    </th>
                    {planList.map((plan, planIndex) => (
                      <td key={plan.id} className={cn("px-2 py-3.5 text-center text-sm", !last && DIVIDER, plan.highlighted && "bg-primary/5")}>
                        {/* A flex box, not a line: the cell keeps Figma's 48px row instead of the body's 24px line box. */}
                        <div className="flex items-center justify-center">{value(row.values[planIndex], "text-sm text-muted-foreground")}</div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          ))}
        </table>
      </div>

      {/* Phones: a card per plan. */}
      <div className="flex w-full flex-col gap-4 [@container(min-width:40rem)]:hidden">
        {planList.map((plan, planIndex) => (
          <article
            key={plan.id}
            className={cn(
              "flex flex-col gap-3 rounded-lg bg-card p-5 ring-1 ring-inset forced-colors:border",
              plan.highlighted ? "bg-gradient-to-r from-primary/5 to-primary/5 ring-primary" : "ring-border"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-foreground">
                <Figures>{plan.name}</Figures>
              </h3>
              {plan.badge ? <Badge>{plan.badge}</Badge> : null}
            </div>
            <p className="text-xs text-muted-foreground">
              <Figures>{plan.price}</Figures>
            </p>
            <PricingActionButton action={plan.action} highlighted={plan.highlighted} size="sm" onSelect={() => onPlanSelect?.(plan.id)} />
            <PricingRule />
            {groupList.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                <p className={cn("text-xs font-semibold text-muted-foreground", groupIndex > 0 && "pt-2")}>
                  <Figures>{group.label}</Figures>
                </p>
                <dl className="flex flex-col gap-3">
                  {group.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-between gap-3">
                      <dt className="min-w-0 text-sm text-muted-foreground">
                        <Figures>{row.shortLabel ?? row.label}</Figures>
                      </dt>
                      {/* A flex box, not a line: the row keeps Figma's 20px instead of the body's 24px line box. */}
                      <dd className="flex shrink-0">{value(row.values[planIndex], "text-sm font-medium text-foreground")}</dd>
                    </div>
                  ))}
                </dl>
              </React.Fragment>
            ))}
          </article>
        ))}
      </div>
    </PricingSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const pricingComparisonMatrixCopy = COPY

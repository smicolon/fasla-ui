"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Radio } from "../../ui/radio/radio"
import { Figures, PricingFeatureList, PricingPrice, PricingRule, PricingSection, isLatin } from "../pricing/pricing"

/*
 * Figma: `Pricing` (46332:2894), Type=Plan Picker + Summary.
 *
 * A checkout step: the plans as rows you choose from, each with the Radio
 * atom, and an order summary for the plan chosen. The chosen row takes a
 * `primary` border and a 5% `primary` tint; a row can list a few features
 * under its description, as Figma's Growth does. The summary lists the
 * plan's lines, a discount code field (Input md) with an Outline Apply button
 * of the same height, the total, the renewal note, the Solid button and a
 * shield before the security line. Every figure in the summary is a prop:
 * each plan brings its own lines and total, and the summary shows the chosen
 * plan's.
 *
 * Desktop sets the list and a 400px summary side by side; Tablet and phones
 * put the summary under the list, and on phones each row's price moves under
 * the plan's name.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface PricingPlanPickerSummaryLine {
  label: React.ReactNode
  /** A second line under the label, "8 seats × $29 × 12 mo". */
  sublabel?: React.ReactNode
  /** The amount at the end of the line. */
  value: React.ReactNode
}

export interface PricingPlanPickerSummaryPlan {
  /** Passed to the callbacks, and the value of its radio. */
  id: string
  name: React.ReactNode
  /** A Soft badge beside the name, "Recommended". */
  badge?: React.ReactNode
  description?: React.ReactNode
  price: React.ReactNode
  /** What the price is per, `/user/mo`. */
  unit?: React.ReactNode
  /** A few features under the description. */
  features?: React.ReactNode[]
  /** The summary's lines while this plan is chosen, before the discount field. */
  summary: PricingPlanPickerSummaryLine[]
  /** The amount due while this plan is chosen. */
  total: React.ReactNode
}

export interface PricingPlanPickerSummaryCopy {
  /** The list's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The plans, in reading order. */
  plans: PricingPlanPickerSummaryPlan[]
  /** The summary's heading. */
  summaryTitle: React.ReactNode
  /** The discount field's placeholder, and its name. */
  discountPlaceholder: string
  /** The button beside the discount field. */
  applyLabel: React.ReactNode
  /** The label before the total. */
  totalLabel: React.ReactNode
  /** The line under the total. Hidden when empty. */
  renewal: React.ReactNode
  /** The summary's button. */
  continueLabel: React.ReactNode
  /** The line under the button, after the shield. Hidden when empty. */
  securityNote: React.ReactNode
}

/**
 * Figma's copy, English and Arabic. Figma's summary is for Growth; Starter's
 * and Scale's follow the same sums: eight seats at the monthly price for
 * twelve months, less the yearly saving.
 */
const COPY: Record<"en" | "ar", PricingPlanPickerSummaryCopy> = {
  en: {
    heading: "Choose a plan",
    description: "You can change this at any time.",
    plans: [
      {
        id: "starter",
        name: "Starter",
        description: "For individuals and small side projects",
        price: "$10",
        unit: "/user/mo",
        summary: [
          { label: "Starter plan", sublabel: "8 seats × $12 × 12 mo", value: "$1,152.00/yr" },
          { label: "Yearly discount (–17%)", value: "–$192.00" },
        ],
        total: "$960.00",
      },
      {
        id: "growth",
        name: "Growth",
        badge: "Recommended",
        description: "For fast-moving product teams",
        price: "$24",
        unit: "/user/mo",
        features: ["Unlimited projects", "50 GB file storage", "Priority email support"],
        summary: [
          { label: "Growth plan", sublabel: "8 seats × $29 × 12 mo", value: "$2,784.00/yr" },
          { label: "Yearly discount (–17%)", value: "–$480.00" },
        ],
        total: "$2,304.00",
      },
      {
        id: "scale",
        name: "Scale",
        description: "For scaling companies with bigger needs",
        price: "$49",
        unit: "/user/mo",
        summary: [
          { label: "Scale plan", sublabel: "8 seats × $59 × 12 mo", value: "$5,664.00/yr" },
          { label: "Yearly discount (–17%)", value: "–$960.00" },
        ],
        total: "$4,704.00",
      },
    ],
    summaryTitle: "Order summary",
    discountPlaceholder: "Discount code",
    applyLabel: "Apply",
    totalLabel: "Due today",
    renewal: "Renews Aug 25, 2027 · Cancel anytime",
    continueLabel: "Continue to payment",
    securityNote: "Payments secured with 256-bit encryption",
  },
  ar: {
    heading: "اختر خطة",
    description: "يمكنك التغيير في أي وقت.",
    plans: [
      {
        id: "starter",
        name: "المبتدئة",
        description: "للأفراد والمشاريع الجانبية الصغيرة",
        price: "$10",
        unit: "/مستخدم/شهر",
        summary: [
          { label: "خطة المبتدئة", sublabel: "8 مقاعد × $12 × 12 شهرًا", value: "$1,152.00/سنة" },
          { label: "خصم سنوي (−17%)", value: "–$192.00" },
        ],
        total: "$960.00",
      },
      {
        id: "growth",
        name: "النمو",
        badge: "موصى بها",
        description: "لفرق المنتجات سريعة الحركة",
        price: "$24",
        unit: "/مستخدم/شهر",
        features: ["مشاريع غير محدودة", "50 جيجابايت لتخزين الملفات", "دعم بريد إلكتروني ذو أولوية"],
        summary: [
          { label: "خطة النمو", sublabel: "8 مقاعد × $29 × 12 شهرًا", value: "$2,784.00/سنة" },
          { label: "خصم سنوي (−17%)", value: "–$480.00" },
        ],
        total: "$2,304.00",
      },
      {
        id: "scale",
        name: "التوسّع",
        description: "للشركات المتوسعة ذات الاحتياجات الأكبر",
        price: "$49",
        unit: "/مستخدم/شهر",
        summary: [
          { label: "خطة التوسّع", sublabel: "8 مقاعد × $59 × 12 شهرًا", value: "$5,664.00/سنة" },
          { label: "خصم سنوي (−17%)", value: "–$960.00" },
        ],
        total: "$4,704.00",
      },
    ],
    summaryTitle: "ملخص الطلب",
    discountPlaceholder: "رمز الخصم",
    applyLabel: "تطبيق",
    totalLabel: "المستحق اليوم",
    renewal: "يتجدد في 25 أغسطس 2027 · الإلغاء في أي وقت",
    continueLabel: "المتابعة إلى الدفع",
    securityNote: "مدفوعات مؤمنة بتشفير 256-بت",
  },
}

export interface PricingPlanPickerSummaryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<PricingPlanPickerSummaryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The plan chosen, to control the rows. */
  value?: string
  /**
   * The plan chosen first.
   * @default "growth"
   */
  defaultValue?: string
  /** Called with the plan's `id` when another row is chosen. */
  onValueChange?: (planId: string) => void
  /** Called with the code typed when Apply is pressed. */
  onApplyDiscount?: (code: string, planId: string) => void
  /** Called with the chosen plan's `id` when the summary's button is pressed. */
  onContinue?: (planId: string) => void
}

export function PricingPlanPickerSummary({
  locale = "en",
  heading,
  description,
  plans,
  summaryTitle,
  discountPlaceholder,
  applyLabel,
  totalLabel,
  renewal,
  continueLabel,
  securityNote,
  value: valueProp,
  defaultValue = "growth",
  onValueChange,
  onApplyDiscount,
  onContinue,
  className,
  ...props
}: PricingPlanPickerSummaryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const groupId = React.useId()
  const list = plans ?? copy.plans
  const [valueState, setValueState] = React.useState(defaultValue)
  const [code, setCode] = React.useState("")
  const value = valueProp ?? valueState
  const chosen = list.find((plan) => plan.id === value) ?? list[0]
  const renewalLine = renewal === undefined ? copy.renewal : renewal
  const securityLine = securityNote === undefined ? copy.securityNote : securityNote

  const choose = (id: string) => {
    if (id === value) return
    setValueState(id)
    onValueChange?.(id)
  }

  /** A figure in Geist when it has no Arabic, as Figma sets the summary's amounts. */
  const amount = (text: React.ReactNode, leading: string) => (
    <span className={cn(isLatin(text) && cn("font-sans", leading))}>
      <Figures>{text}</Figures>
    </span>
  )

  return (
    <PricingSection labelledBy={headingId} className={className} contentClassName="items-stretch" {...props}>
      <div className="flex w-full flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1 pb-2">
            <h2 id={headingId} className="text-lg font-semibold text-foreground">
              <Figures>{heading ?? copy.heading}</Figures>
            </h2>
            <p className="text-sm text-muted-foreground">
              <Figures>{description ?? copy.description}</Figures>
            </p>
          </div>

          <div role="radiogroup" aria-labelledby={headingId} className="flex flex-col gap-3">
            {list.map((plan) => {
              const selected = plan.id === chosen?.id
              const labelId = `${groupId}-${plan.id}-label`
              const descriptionId = `${groupId}-${plan.id}-description`
              const price = <PricingPrice amount={plan.price} unit={plan.unit} size="row" className="flex-nowrap" />
              return (
                <div
                  key={plan.id}
                  onClick={(event) => {
                    // The Radio's own label already chose it; the row only catches clicks around it.
                    if (!(event.target as Element).closest("label")) choose(plan.id)
                  }}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg bg-card p-4 ring-1 ring-inset transition-colors motion-reduce:transition-none forced-colors:border",
                    selected ? "bg-gradient-to-r from-primary/5 to-primary/5 ring-primary" : "ring-border hover:bg-accent"
                  )}
                >
                  <Radio
                    name={groupId}
                    value={plan.id}
                    checked={selected}
                    onChange={() => choose(plan.id)}
                    aria-labelledby={labelId}
                    aria-describedby={plan.description ? descriptionId : undefined}
                    className="shrink-0"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span id={labelId} className="text-base font-semibold text-foreground">
                        <Figures>{plan.name}</Figures>
                      </span>
                      {plan.badge ? (
                        <Badge variant="soft">
                          <span><Figures>{plan.badge}</Figures></span>
                        </Badge>
                      ) : null}
                    </div>
                    <div className="[@container(min-width:40rem)]:hidden">{price}</div>
                    {plan.description ? (
                      <p id={descriptionId} className="text-sm text-muted-foreground">
                        <Figures>{plan.description}</Figures>
                      </p>
                    ) : null}
                    {plan.features?.length ? <PricingFeatureList features={plan.features} size="xs" className="pt-2" /> : null}
                  </div>
                  <div className="hidden shrink-0 [@container(min-width:40rem)]:block">{price}</div>
                </div>
              )
            })}
          </div>
        </div>

        <aside
          aria-labelledby={`${groupId}-summary`}
          className="flex w-full flex-col gap-4 rounded-xl bg-card p-6 shadow-sm ring-1 ring-inset ring-border forced-colors:border [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:shrink-0"
        >
          <h3 id={`${groupId}-summary`} className="text-base font-semibold text-foreground">
            <Figures>{summaryTitle ?? copy.summaryTitle}</Figures>
          </h3>
          {chosen?.summary.map((line, index) => (
            <div key={index} className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm text-muted-foreground">
                  <Figures>{line.label}</Figures>
                </span>
                {line.sublabel ? (
                  <span className="text-xs text-muted-foreground">
                    <Figures>{line.sublabel}</Figures>
                  </span>
                ) : null}
              </div>
              <span className="shrink-0 text-sm font-medium text-foreground">{amount(line.value, "leading-5")}</span>
            </div>
          ))}
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (chosen) onApplyDiscount?.(code, chosen.id)
            }}
          >
            <div className="min-w-0 flex-1">
              <Input
                size="md"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder={discountPlaceholder ?? copy.discountPlaceholder}
                aria-label={discountPlaceholder ?? copy.discountPlaceholder}
              />
            </div>
            <Button type="submit" variant="outline" size="md" className="shrink-0">
              <span><Figures>{applyLabel ?? copy.applyLabel}</Figures></span>
            </Button>
          </form>
          <PricingRule />
          <div className="flex items-center justify-between gap-4 text-base font-semibold text-foreground">
            <span>
              <Figures>{totalLabel ?? copy.totalLabel}</Figures>
            </span>
            {chosen ? amount(chosen.total, "leading-6") : null}
          </div>
          {renewalLine ? (
            <p className="text-xs text-muted-foreground">
              <Figures>{renewalLine}</Figures>
            </p>
          ) : null}
          <Button type="button" className="w-full" onClick={() => chosen && onContinue?.(chosen.id)}>
            <Figures>{continueLabel ?? copy.continueLabel}</Figures>
          </Button>
          {securityLine ? (
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" />
              {/* One span: in the flex row, each isolated figure would otherwise be its own item, gapped from its word. */}
              <span>
                <Figures>{securityLine}</Figures>
              </span>
            </p>
          ) : null}
        </aside>
      </div>
    </PricingSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const pricingPlanPickerSummaryCopy = COPY

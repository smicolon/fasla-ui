"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Radio } from "../../ui/radio/radio"
import { Figures, PricingFeatureList, PricingHeader, PricingPrice, PricingSection } from "../pricing/pricing"

/*
 * Figma: `Pricing` (46332:2894), Type=Plan Spotlight.
 *
 * One plan in one card: the billing column at the start, where you pick how
 * to pay, and the plan's features in a `muted` panel at the end. Each billing
 * option is a row with the Radio atom, its label and note, and its price; the
 * chosen row takes a `primary` border and a 5% `primary` tint, and the lg
 * button under the rows names the option chosen. A shield and a trust line
 * close the column.
 *
 * Desktop holds the card at 960px with a 380px features panel; Tablet lets
 * it fill the row with a 300px panel; phones put the panel under the column
 * and take 24px of padding instead of 32.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface PricingPlanSpotlightOption {
  /** Passed to `onContinue`, and the value of its radio. */
  id: string
  label: React.ReactNode
  /** The line under the label. */
  note?: React.ReactNode
  price: React.ReactNode
  /** What the price is per, `/user/mo`. */
  unit?: React.ReactNode
  /** A Soft Success badge beside the label, "Save 17%". */
  badge?: React.ReactNode
  /** The button's label while this option is chosen. */
  continueLabel: React.ReactNode
}

export interface PricingPlanSpotlightCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The plan's name. */
  planName: React.ReactNode
  /** A Soft badge beside the plan's name. Hidden when empty. */
  planBadge: React.ReactNode
  /** The line under the plan's name. */
  planDescription: React.ReactNode
  /** The ways to pay, in reading order. */
  options: PricingPlanSpotlightOption[]
  /** The line under the button, after the shield. Hidden when empty. */
  trust: React.ReactNode
  /** The short label above the features. */
  featuresLabel: React.ReactNode
  features: React.ReactNode[]
}

/** Figma's copy, English and Arabic. The Monthly and 2-Year button labels follow Figma's Yearly one. */
const COPY: Record<"en" | "ar", PricingPlanSpotlightCopy> = {
  en: {
    heading: "One plan, everything included",
    description: "No tiers to compare — every feature ships with Growth. Pick a billing cycle and go.",
    planName: "Growth",
    planBadge: "14-day free trial",
    planDescription: "All features, unlimited projects, and priority support — one simple price per seat.",
    options: [
      { id: "monthly", label: "Monthly", note: "Cancel anytime", price: "$29", unit: "/user/mo", continueLabel: "Continue with Monthly" },
      {
        id: "yearly",
        label: "Yearly",
        badge: "Save 17%",
        note: "Billed as $288 per user",
        price: "$24",
        unit: "/user/mo",
        continueLabel: "Continue with Yearly",
      },
      { id: "two-year", label: "2-Year", note: "One payment, locked-in rate", price: "$19", unit: "/user/mo", continueLabel: "Continue with 2-Year" },
    ],
    trust: "Secure checkout · 30-day money-back guarantee",
    featuresLabel: "Everything in Growth",
    features: [
      "Unlimited projects",
      "Up to 20 team members",
      "50 GB file storage",
      "Advanced analytics & reports",
      "Custom domains",
      "Priority email support",
      "100+ integrations",
      "Shared workspaces",
    ],
  },
  ar: {
    heading: "خطة واحدة تشمل كل شيء",
    description: "لا خطط للمقارنة — كل الميزات ضمن خطة النمو. اختر دورة الفوترة وانطلق.",
    planName: "النمو",
    planBadge: "تجربة مجانية 14 يومًا",
    planDescription: "جميع الميزات ومشاريع غير محدودة ودعم ذو أولوية — سعر واحد بسيط لكل مقعد.",
    options: [
      { id: "monthly", label: "شهري", note: "الإلغاء في أي وقت", price: "$29", unit: "/مستخدم/شهر", continueLabel: "المتابعة بالخطة الشهرية" },
      {
        id: "yearly",
        label: "سنوي",
        badge: "وفّر 17%",
        note: "تُفوتر $288 لكل مستخدم",
        price: "$24",
        unit: "/مستخدم/شهر",
        continueLabel: "المتابعة بالخطة السنوية",
      },
      { id: "two-year", label: "سنتان", note: "دفعة واحدة وسعر ثابت", price: "$19", unit: "/مستخدم/شهر", continueLabel: "المتابعة بخطة السنتين" },
    ],
    trust: "دفع آمن · ضمان استرداد خلال 30 يومًا",
    featuresLabel: "كل ما في النمو",
    features: [
      "مشاريع غير محدودة",
      "حتى 20 عضوًا في الفريق",
      "50 جيجابايت لتخزين الملفات",
      "تحليلات وتقارير متقدمة",
      "نطاقات مخصصة",
      "دعم بريد إلكتروني ذو أولوية",
      "أكثر من 100 تكامل",
      "مساحات عمل مشتركة",
    ],
  },
}

export interface PricingPlanSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<PricingPlanSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The option chosen, to control the rows. */
  value?: string
  /**
   * The option chosen first.
   * @default "yearly"
   */
  defaultValue?: string
  /** Called with the option's `id` when another row is chosen. */
  onValueChange?: (optionId: string) => void
  /** Called with the chosen option's `id` when the button is pressed. */
  onContinue?: (optionId: string) => void
}

export function PricingPlanSpotlight({
  locale = "en",
  heading,
  description,
  planName,
  planBadge,
  planDescription,
  options,
  trust,
  featuresLabel,
  features,
  value: valueProp,
  defaultValue = "yearly",
  onValueChange,
  onContinue,
  className,
  ...props
}: PricingPlanSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const groupId = React.useId()
  const list = options ?? copy.options
  const [valueState, setValueState] = React.useState(defaultValue)
  const value = valueProp ?? valueState
  const chosen = list.find((option) => option.id === value) ?? list[0]
  const badge = planBadge === undefined ? copy.planBadge : planBadge
  const trustLine = trust === undefined ? copy.trust : trust

  const choose = (id: string) => {
    if (id === value) return
    setValueState(id)
    onValueChange?.(id)
  }

  return (
    <PricingSection labelledBy={headingId} className={className} {...props}>
      <PricingHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex w-full max-w-[960px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md [@container(min-width:40rem)]:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-6 [@container(min-width:40rem)]:p-8">
          <div className="flex items-center justify-between gap-2">
            <h3 id={`${groupId}-name`} className="text-xl font-semibold text-foreground">
              <Figures>{planName ?? copy.planName}</Figures>
            </h3>
            {badge ? (
              <Badge variant="soft">
                <span><Figures>{badge}</Figures></span>
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            <Figures>{planDescription ?? copy.planDescription}</Figures>
          </p>

          <div role="radiogroup" aria-labelledby={`${groupId}-name`} className="flex flex-col gap-3">
            {list.map((option) => {
              const selected = option.id === chosen?.id
              const labelId = `${groupId}-${option.id}-label`
              const noteId = `${groupId}-${option.id}-note`
              return (
                <div
                  key={option.id}
                  onClick={(event) => {
                    // The Radio's own label already chose it; the row only catches clicks around it.
                    if (!(event.target as Element).closest("label")) choose(option.id)
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg bg-card px-4 py-3 ring-1 ring-inset transition-colors motion-reduce:transition-none forced-colors:border",
                    selected ? "bg-gradient-to-r from-primary/5 to-primary/5 ring-primary" : "ring-border hover:bg-accent"
                  )}
                >
                  <Radio
                    name={groupId}
                    value={option.id}
                    checked={selected}
                    onChange={() => choose(option.id)}
                    aria-labelledby={labelId}
                    aria-describedby={option.note ? noteId : undefined}
                    className="shrink-0"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                      <span id={labelId} className="text-sm font-semibold text-foreground">
                        <Figures>{option.label}</Figures>
                      </span>
                      {option.badge ? (
                        <Badge variant="soft" tone="success">
                          <span><Figures>{option.badge}</Figures></span>
                        </Badge>
                      ) : null}
                    </div>
                    {option.note ? (
                      <span id={noteId} className="text-xs text-muted-foreground">
                        <Figures>{option.note}</Figures>
                      </span>
                    ) : null}
                  </div>
                  <PricingPrice amount={option.price} unit={option.unit} size="row" className="shrink-0 flex-nowrap" />
                </div>
              )
            })}
          </div>

          <Button type="button" size="lg" className="w-full" onClick={() => chosen && onContinue?.(chosen.id)}>
            <Figures>{chosen?.continueLabel}</Figures>
          </Button>

          {trustLine ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" />
              {/* One span: in the flex row, each isolated figure would otherwise be its own item, gapped from its word. */}
              <span>
                <Figures>{trustLine}</Figures>
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col bg-muted p-6 [@container(min-width:40rem)]:w-[300px] [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:w-[380px]">
          <PricingFeatureList label={featuresLabel ?? copy.featuresLabel} features={features ?? copy.features} />
        </div>
      </div>
    </PricingSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const pricingPlanSpotlightCopy = COPY

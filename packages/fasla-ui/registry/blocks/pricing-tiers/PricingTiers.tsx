"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs/tabs"
import { Figures, PricingActionButton, PricingHeader, PricingPlanCard, PricingSection, type PricingAction } from "../pricing/pricing"

/*
 * Figma: `Pricing` (46332:2894), Type=Pricing Tiers.
 *
 * Three plan cards under a centred header with a Soft eyebrow badge and a
 * Monthly / Yearly toggle, the saving in a Soft Success badge beside it. The
 * middle plan is the one recommended: a Solid badge, a `primary` border, a 5%
 * `primary` tint and the Solid button. The toggle is the Tabs atom, Boxed,
 * with Yearly active to start in both directions; switching it swaps every
 * card's price and the line under it.
 *
 * Desktop sets the cards in one row; Tablet two to a row, the last card,
 * left alone, across the full width; phones one under another. The cards in
 * a row share the tallest one's height.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export type PricingTiersBilling = "monthly" | "yearly"

export interface PricingTiersPlan {
  /** Passed to `onPlanSelect`. */
  id: string
  name: React.ReactNode
  description?: React.ReactNode
  /** The price for each billing cycle, as the toggle shows it. */
  price: Record<PricingTiersBilling, React.ReactNode>
  /** What the price is per, `/user/mo`. */
  unit?: React.ReactNode
  /** The line under the price, for each billing cycle. */
  note?: Record<PricingTiersBilling, React.ReactNode>
  /** A Solid badge beside the name, "Most popular". */
  badge?: React.ReactNode
  /** The plan you recommend: the tinted card with the Solid button. */
  highlighted?: boolean
  action: PricingAction
  /** The short label above the features. */
  featuresLabel?: React.ReactNode
  features: React.ReactNode[]
}

export interface PricingTiersCopy {
  /** The Soft badge above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The toggle's two labels. */
  billingLabels: Record<PricingTiersBilling, string>
  /** The Soft Success badge beside the toggle. Hidden when empty. */
  saving: React.ReactNode
  /** The plans, in reading order. */
  plans: PricingTiersPlan[]
}

/** Figma's copy, English and Arabic. The monthly lines are the prices Figma's notes give. */
const COPY: Record<"en" | "ar", PricingTiersCopy> = {
  en: {
    eyebrow: "Pricing",
    heading: "Simple pricing that scales with you",
    description: "Start free and upgrade as your team grows. Every plan includes core features — no hidden fees, cancel anytime.",
    billingLabels: { monthly: "Monthly", yearly: "Yearly" },
    saving: "Save 17% yearly",
    plans: [
      {
        id: "starter",
        name: "Starter",
        description: "For individuals and side projects.",
        price: { monthly: "$12", yearly: "$10" },
        unit: "/user/mo",
        note: { monthly: "Billed monthly", yearly: "Billed yearly, or $12 month-to-month" },
        action: { label: "Get started" },
        featuresLabel: "What's included",
        features: ["Up to 3 team members", "5 active projects", "2 GB file storage", "Basic analytics", "Community support"],
      },
      {
        id: "growth",
        name: "Growth",
        badge: "Most popular",
        highlighted: true,
        description: "For fast-moving product teams.",
        price: { monthly: "$29", yearly: "$24" },
        unit: "/user/mo",
        note: { monthly: "Billed monthly", yearly: "Billed yearly, or $29 month-to-month" },
        action: { label: "Choose Growth" },
        featuresLabel: "Everything in Starter, plus",
        features: ["Up to 20 team members", "Unlimited projects", "50 GB file storage", "Advanced analytics & reports", "Priority email support"],
      },
      {
        id: "scale",
        name: "Scale",
        description: "For scaling companies and orgs.",
        price: { monthly: "$59", yearly: "$49" },
        unit: "/user/mo",
        note: { monthly: "Billed monthly", yearly: "Billed yearly, or $59 month-to-month" },
        action: { label: "Choose Scale" },
        featuresLabel: "Everything in Growth, plus",
        features: ["Unlimited team members", "SSO & role-based access", "500 GB file storage", "Audit logs & API access", "24/7 chat support"],
      },
    ],
  },
  ar: {
    eyebrow: "الأسعار",
    heading: "أسعار بسيطة تنمو مع فريقك",
    description: "ابدأ مجانًا وقم بالترقية مع نمو فريقك. كل الخطط تشمل الميزات الأساسية — بلا رسوم خفية، وإلغاء في أي وقت.",
    billingLabels: { monthly: "شهري", yearly: "سنوي" },
    saving: "وفّر 17% سنويًا",
    plans: [
      {
        id: "starter",
        name: "المبتدئة",
        description: "للأفراد والمشاريع الجانبية.",
        price: { monthly: "$12", yearly: "$10" },
        unit: "/مستخدم/شهر",
        note: { monthly: "فوترة شهرية", yearly: "فوترة سنوية، أو $12 شهريًا" },
        action: { label: "ابدأ الآن" },
        featuresLabel: "ماذا تشمل",
        features: ["حتى 3 أعضاء في الفريق", "5 مشاريع نشطة", "2 جيجابايت لتخزين الملفات", "تحليلات أساسية", "دعم المجتمع"],
      },
      {
        id: "growth",
        name: "النمو",
        badge: "الأكثر شيوعًا",
        highlighted: true,
        description: "لفرق المنتجات سريعة الحركة.",
        price: { monthly: "$29", yearly: "$24" },
        unit: "/مستخدم/شهر",
        note: { monthly: "فوترة شهرية", yearly: "فوترة سنوية، أو $29 شهريًا" },
        action: { label: "اختر النمو" },
        featuresLabel: "كل ما في المبتدئة، بالإضافة إلى",
        features: ["حتى 20 عضوًا في الفريق", "مشاريع غير محدودة", "50 جيجابايت لتخزين الملفات", "تحليلات وتقارير متقدمة", "دعم بريد إلكتروني ذو أولوية"],
      },
      {
        id: "scale",
        name: "التوسّع",
        description: "للشركات والمؤسسات المتوسّعة.",
        price: { monthly: "$59", yearly: "$49" },
        unit: "/مستخدم/شهر",
        note: { monthly: "فوترة شهرية", yearly: "فوترة سنوية، أو $59 شهريًا" },
        action: { label: "اختر التوسّع" },
        featuresLabel: "كل ما في النمو، بالإضافة إلى",
        features: ["أعضاء فريق غير محدودين", "SSO وصلاحيات حسب الدور", "500 جيجابايت لتخزين الملفات", "سجلات التدقيق والوصول إلى API", "دعم محادثة 24/7"],
      },
    ],
  },
}

export interface PricingTiersProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<PricingTiersCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The billing cycle shown, to control the toggle. */
  billing?: PricingTiersBilling
  /**
   * The billing cycle shown first.
   * @default "yearly"
   */
  defaultBilling?: PricingTiersBilling
  /** Called when the toggle switches. */
  onBillingChange?: (billing: PricingTiersBilling) => void
  /** Called with the plan's `id` when a button without an `href` is pressed. */
  onPlanSelect?: (planId: string, billing: PricingTiersBilling) => void
}

export function PricingTiers({
  locale = "en",
  eyebrow,
  heading,
  description,
  billingLabels,
  saving,
  plans,
  billing: billingProp,
  defaultBilling = "yearly",
  onBillingChange,
  onPlanSelect,
  className,
  ...props
}: PricingTiersProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const [billingState, setBillingState] = React.useState<PricingTiersBilling>(defaultBilling)
  const billing = billingProp ?? billingState
  const labels = billingLabels ?? copy.billingLabels
  const badge = saving === undefined ? copy.saving : saving
  const list = plans ?? copy.plans

  const changeBilling = (value: unknown) => {
    if (value !== "monthly" && value !== "yearly") return
    setBillingState(value)
    onBillingChange?.(value)
  }

  return (
    <PricingSection labelledBy={headingId} className={className} {...props}>
      <PricingHeader
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        description={description ?? copy.description}
        className="gap-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Tabs value={billing} onValueChange={changeBilling} className="w-auto">
            <TabsList variant="boxed" size="sm">
              <TabsTrigger value="monthly">{labels.monthly}</TabsTrigger>
              <TabsTrigger value="yearly">{labels.yearly}</TabsTrigger>
            </TabsList>
          </Tabs>
          {badge ? (
            <Badge variant="soft" tone="success">
              <span><Figures>{badge}</Figures></span>
            </Badge>
          ) : null}
        </div>
      </PricingHeader>

      <div
        className={cn(
          "grid w-full grid-cols-1 gap-6",
          "[@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-flow-col [@container(min-width:64rem)]:grid-cols-none [@container(min-width:64rem)]:auto-cols-fr"
        )}
      >
        {list.map((plan) => (
          <PricingPlanCard
            key={plan.id}
            name={plan.name}
            badge={plan.badge}
            description={plan.description}
            price={plan.price[billing]}
            unit={plan.unit}
            note={plan.note?.[billing]}
            highlighted={plan.highlighted}
            action={
              <PricingActionButton
                action={plan.action}
                highlighted={plan.highlighted}
                onSelect={() => onPlanSelect?.(plan.id, billing)}
              />
            }
            featuresLabel={plan.featuresLabel}
            features={plan.features}
            className="[@container(min-width:40rem)]:[&:last-child:nth-child(odd)]:col-span-2 [@container(min-width:64rem)]:[&:last-child:nth-child(odd)]:col-span-1"
          />
        ))}
      </div>
    </PricingSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const pricingTiersCopy = COPY

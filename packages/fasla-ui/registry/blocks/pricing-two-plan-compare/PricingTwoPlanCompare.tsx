"use client"

import * as React from "react"
import { PricingActionButton, PricingHeader, PricingPlanCard, PricingSection, type PricingAction } from "../pricing/pricing"

/*
 * Figma: `Pricing` (46332:2894), Type=Two-Plan Compare.
 *
 * A free plan beside the paid one, under a centred header. The paid plan is
 * the one recommended: a Solid badge, a `primary` border, a 5% `primary`
 * tint, the Solid button, and its old price struck through before the new
 * one. The two cards share the taller one's height.
 *
 * Desktop sets the two 430px cards side by side in the middle of the row;
 * Tablet lets them share the width; phones put one under the other.
 *
 * A price of four figures or more ($1,200) does not fit the price row from
 * Tablet down: it pushes the unit off the card. Figma's Content limits say
 * the same; use Pricing Tiers for prices in the thousands.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface PricingTwoPlanComparePlan {
  /** Passed to `onPlanSelect`. */
  id: string
  name: React.ReactNode
  description?: React.ReactNode
  price: React.ReactNode
  /** What the price is per, `/user/mo` or `/forever`. */
  unit?: React.ReactNode
  /** The earlier price, struck through before the price. */
  previousPrice?: React.ReactNode
  /** The line under the price. */
  note?: React.ReactNode
  /** A Solid badge beside the name, "Recommended". */
  badge?: React.ReactNode
  /** The plan you recommend: the tinted card with the Solid button. */
  highlighted?: boolean
  action: PricingAction
  featuresLabel?: React.ReactNode
  features: React.ReactNode[]
}

export interface PricingTwoPlanCompareCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The two plans, in reading order. */
  plans: PricingTwoPlanComparePlan[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", PricingTwoPlanCompareCopy> = {
  en: {
    heading: "Start free. Upgrade when you're ready.",
    description: "Two plans, one decision. Switch, pause, or cancel whenever you like.",
    plans: [
      {
        id: "free",
        name: "Free",
        description: "Everything you need to try it out.",
        price: "$0",
        unit: "/forever",
        note: "No credit card required",
        action: { label: "Start for free" },
        featuresLabel: "What's included",
        features: ["Up to 3 team members", "1 active project", "500 MB file storage", "Community support"],
      },
      {
        id: "growth",
        name: "Growth",
        badge: "Recommended",
        highlighted: true,
        description: "Full power for growing teams.",
        previousPrice: "$29",
        price: "$24",
        unit: "/user/mo",
        note: "Billed yearly, or $29 month-to-month",
        action: { label: "Upgrade to Growth" },
        featuresLabel: "Everything in Free, plus",
        features: [
          "Up to 20 team members",
          "Unlimited projects",
          "50 GB file storage",
          "Advanced analytics & reports",
          "Priority email support",
          "Custom domains",
        ],
      },
    ],
  },
  ar: {
    heading: "ابدأ مجانًا، وقم بالترقية عندما تكون جاهزًا.",
    description: "خطتان وقرار واحد. بدّل أو أوقف أو ألغِ متى شئت.",
    plans: [
      {
        id: "free",
        name: "مجانية",
        description: "كل ما تحتاجه لتجربة المنصة.",
        price: "$0",
        unit: "/للأبد",
        note: "لا حاجة لبطاقة ائتمان",
        action: { label: "ابدأ مجانًا" },
        featuresLabel: "ماذا تشمل",
        features: ["حتى 3 أعضاء في الفريق", "مشروع نشط واحد", "500 ميجابايت لتخزين الملفات", "دعم المجتمع"],
      },
      {
        id: "growth",
        name: "النمو",
        badge: "موصى بها",
        highlighted: true,
        description: "القوة الكاملة للفرق المتنامية.",
        previousPrice: "$29",
        price: "$24",
        unit: "/مستخدم/شهر",
        note: "فوترة سنوية، أو $29 شهريًا",
        action: { label: "الترقية إلى النمو" },
        featuresLabel: "كل ما في المجانية، بالإضافة إلى",
        features: [
          "حتى 20 عضوًا في الفريق",
          "مشاريع غير محدودة",
          "50 جيجابايت لتخزين الملفات",
          "تحليلات وتقارير متقدمة",
          "دعم بريد إلكتروني ذو أولوية",
          "نطاقات مخصصة",
        ],
      },
    ],
  },
}

export interface PricingTwoPlanCompareProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<PricingTwoPlanCompareCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with the plan's `id` when a button without an `href` is pressed. */
  onPlanSelect?: (planId: string) => void
}

export function PricingTwoPlanCompare({
  locale = "en",
  heading,
  description,
  plans,
  onPlanSelect,
  className,
  ...props
}: PricingTwoPlanCompareProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = plans ?? copy.plans

  return (
    <PricingSection labelledBy={headingId} className={className} {...props}>
      <PricingHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />
      <div className="grid w-full grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:w-auto [@container(min-width:64rem)]:grid-cols-[repeat(2,430px)]">
        {list.map((plan) => (
          <PricingPlanCard
            key={plan.id}
            name={plan.name}
            badge={plan.badge}
            description={plan.description}
            price={plan.price}
            unit={plan.unit}
            previousPrice={plan.previousPrice}
            note={plan.note}
            highlighted={plan.highlighted}
            action={<PricingActionButton action={plan.action} highlighted={plan.highlighted} onSelect={() => onPlanSelect?.(plan.id)} />}
            featuresLabel={plan.featuresLabel}
            features={plan.features}
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
export const pricingTwoPlanCompareCopy = COPY

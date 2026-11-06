"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `Mahaam Template` (47694:6712), the Plans section of each of its six
 * variants, and its motion card "Plans Toggle".
 *
 * A heading, a Monthly / Yearly switch and three plans: Free and Team on the
 * muted surface, Pro on the inverse one. Desktop sets them side by side, Free,
 * Pro, Team; Tablet and Mobile stack them in the same order. Choosing Yearly changes
 * the Pro price from $12 to $10 and Team from $20 to $16, and the unit line to
 * "billed yearly"; Free stays $0.
 *
 * Nothing here loops, so the section has no pause control. The switch is a
 * click, not a loop: the pressed state moves in 250ms, and under
 * `prefers-reduced-motion: reduce` it is instant. Prices keep Western digits
 * and the $ sign in Arabic.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"
type Billing = "monthly" | "yearly"

export interface MahaamPlan {
  name: string
  /** What the price is for, monthly and yearly. */
  unit: { monthly: string; yearly: string }
  /** The price in each billing, with its sign, e.g. `$12`. */
  price: { monthly: string; yearly: string }
  description: string
  cta: string
  features: string[]
  ctaHref?: string
}

export interface MahaamPlansCopy {
  /** The heading. A line break (`\n`) is a line break on screen. */
  heading: string
  monthly: React.ReactNode
  yearly: React.ReactNode
  /** The badge on the highlighted plan. */
  popular: string
  free: MahaamPlan
  pro: MahaamPlan
  team: MahaamPlan
  footnote: string
  /** The switch's name, read by assistive tech. */
  switchLabel: string
}

const COPY: Record<Locale, MahaamPlansCopy> = {
  en: {
    heading: "Simple plans.\nStart free.",
    monthly: "Monthly",
    yearly: "Yearly · Save 20%",
    popular: "Most popular",
    free: {
      name: "Free",
      unit: { monthly: "forever", yearly: "forever" },
      price: { monthly: "$0", yearly: "$0" },
      description: "For trying Mahaam on your own.",
      cta: "Get Mahaam free",
      features: ["Unlimited voice notes", "Tasks with dates and owners", "40+ languages", "30 days of history"],
    },
    pro: {
      name: "Pro",
      unit: { monthly: "a month", yearly: "a month, billed yearly" },
      price: { monthly: "$12", yearly: "$10" },
      description: "For people whose day runs on calls.",
      cta: "Start a 14-day trial",
      features: ["Everything in Free", "Calendar scheduling", "Ask Mahaam about anything", "Recaps sent for you", "Full history"],
    },
    team: {
      name: "Team",
      unit: { monthly: "per user a month", yearly: "per user, billed yearly" },
      price: { monthly: "$20", yearly: "$16" },
      description: "For teams who share the work.",
      cta: "Talk to sales",
      features: ["Everything in Pro", "Hand-offs and shared lists", "Team recaps and channels", "Admin controls and SSO"],
    },
    footnote: "Prices are placeholders for this template.",
    switchLabel: "Billing",
  },
  ar: {
    heading: "خطط بسيطة.\nابدأ مجانًا.",
    monthly: "شهريًا",
    yearly: (
      <>
        سنويًا، وفّر <bdi dir="ltr">20%</bdi>
      </>
    ),
    popular: "الأكثر طلبًا",
    free: {
      name: "المجانية",
      unit: { monthly: "دائمًا", yearly: "دائمًا" },
      price: { monthly: "$0", yearly: "$0" },
      description: "لتجربة مهام بنفسك.",
      cta: "ابدأ مع مهام مجانًا",
      features: ["ملاحظات صوتية غير محدودة", "مهام بمواعيد ومسؤولين", "أكثر من 40 لغة", "سجل 30 يومًا"],
    },
    pro: {
      name: "الاحترافية",
      unit: { monthly: "في الشهر", yearly: "في الشهر، تُدفع سنويًا" },
      price: { monthly: "$12", yearly: "$10" },
      description: "لمن يمضي يومه في المكالمات.",
      cta: "ابدأ تجربة 14 يومًا",
      features: ["كل ما في المجانية", "الجدولة في التقويم", "اسأل مهام عن أي شيء", "ملخصات تُرسل عنك", "سجل كامل"],
    },
    team: {
      name: "الفرق",
      unit: { monthly: "للمستخدم في الشهر", yearly: "للمستخدم في الشهر، تُدفع سنويًا" },
      price: { monthly: "$20", yearly: "$16" },
      description: "للفرق التي تتقاسم العمل.",
      cta: "تحدّث إلى المبيعات",
      features: ["كل ما في الاحترافية", "إسناد وقوائم مشتركة", "ملخصات وقنوات للفريق", "أدوات الإدارة والدخول الموحّد"],
    },
    footnote: "الأسعار هنا للعرض فقط.",
    switchLabel: "الفوترة",
  },
}

export interface MahaamPlansProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamPlansCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** Which billing is chosen. Set it to control the switch. */
  billing?: Billing
  /** Which billing an uncontrolled switch starts on. */
  defaultBilling?: Billing
  /** Called when the visitor chooses a billing. */
  onBillingChange?: (billing: Billing) => void
}

function PlanCard({
  plan,
  billing,
  inverse,
  badge,
  className,
}: {
  plan: MahaamPlan
  billing: Billing
  inverse?: boolean
  badge?: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-2xl p-6 [@container(min-width:48rem)]:p-8",
        inverse ? "bg-background-inverse text-foreground-inverse" : "bg-muted text-foreground",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {badge ? (
          <Badge variant="soft" tone="secondary" size="sm">
            {badge}
          </Badge>
        ) : null}
      </div>
      <p className="flex items-end gap-2">
        <bdi dir="ltr" className="text-6xl font-normal">
          {plan.price[billing]}
        </bdi>
        <span className={cn("pb-0 text-sm", inverse ? "text-muted-foreground-inverse" : "text-muted-foreground")}>{plan.unit[billing]}</span>
      </p>
      <p className={cn("text-base", inverse ? "text-muted-foreground-inverse" : "text-muted-foreground")}>{plan.description}</p>
      <a href={plan.ctaHref ?? "#get-mahaam"} className={buttonVariants({ variant: inverse ? "secondary" : "default", size: "lg", className: "w-full" })}>
        {plan.cta}
      </a>
      <hr className={cn("border-t", inverse ? "border-muted-foreground-inverse" : "border-border")} />
      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-base">
            <Check aria-hidden="true" size={16} strokeWidth={1.5} className="shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function MahaamPlans({
  locale = "en",
  heading,
  monthly,
  yearly,
  popular,
  free,
  pro,
  team,
  footnote,
  switchLabel,
  billing: billingProp,
  defaultBilling = "monthly",
  onBillingChange,
  className,
  ...props
}: MahaamPlansProps) {
  const copy = COPY[locale]
  const [own, setOwn] = React.useState<Billing>(defaultBilling)
  const billing = billingProp ?? own
  const choose = (value: unknown) => {
    const next: Billing = value === "yearly" ? "yearly" : "monthly"
    if (billingProp === undefined) setOwn(next)
    onBillingChange?.(next)
  }

  return (
    <section className={cn("[container-type:inline-size]", className)} {...props}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-8 pb-24 pt-8 [@container(min-width:48rem)]:gap-10 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-36 [@container(min-width:48rem)]:pt-12 [@container(min-width:90rem)]:gap-12 [@container(min-width:90rem)]:px-28 [@container(min-width:90rem)]:pb-40 [@container(min-width:90rem)]:pt-16">
        <div className="flex flex-col items-start gap-6 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-center [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-8">
          <h2 className="whitespace-pre-line text-3xl font-normal text-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl">{heading ?? copy.heading}</h2>
          <Tabs value={billing} onValueChange={choose} className="w-auto">
            <TabsList variant="boxed" size="sm" aria-label={switchLabel ?? copy.switchLabel}>
              <TabsTrigger value="monthly">{monthly ?? copy.monthly}</TabsTrigger>
              <TabsTrigger value="yearly">{yearly ?? copy.yearly}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-4 [@container(min-width:90rem)]:flex-row">
          <PlanCard plan={{ ...copy.free, ...free }} billing={billing} className="[@container(min-width:90rem)]:flex-1" />
          <PlanCard
            plan={{ ...copy.pro, ...pro }}
            billing={billing}
            inverse
            badge={popular ?? copy.popular}
            className="[@container(min-width:90rem)]:flex-1"
          />
          <PlanCard plan={{ ...copy.team, ...team }} billing={billing} className="[@container(min-width:90rem)]:flex-1" />
        </div>
        <p className="text-center text-sm text-muted-foreground">{footnote ?? copy.footnote}</p>
      </div>
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamPlansCopy = COPY

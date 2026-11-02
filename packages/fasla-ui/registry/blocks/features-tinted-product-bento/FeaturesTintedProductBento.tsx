"use client"

import * as React from "react"
import { CalendarCheck, Layers, TrendingUp } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"
import { FaslaLogo } from "../../ui/fasla-logo/fasla-logo"
import { Progress } from "../../ui/progress/progress"
import { Switch } from "../../ui/switch/switch"
import { FeaturesSection, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Tinted Product Bento.
 *
 * At the start a 48px heading over a neutral wash holding three stacked
 * product cards (Plan with a Scoped badge, Build with an In progress badge and
 * a Progress at 60%, Scale with a Scaling badge and an Auto-scale Switch). At
 * the end three tinted panels: a wide `info` one (870px) over two half-width
 * ones, `warning` and `success`. A panel holds the Fasla logo and a tag, a
 * 28px heading, a line, a Use it for list of bullets and a solid Button.
 *
 * Desktop sets the wash beside the panels (330px / 870px), the two small
 * panels side by side. Tablet stacks the wash over the panels, the two small
 * ones side by side. Mobile stacks everything. The Switch is live, and the
 * buttons call `onExplore` with the panel's id.
 *
 * Content limits: a panel's heading up to 44 characters, its line up to 150
 * and a bullet up to 50. The other limits are in the block's documentation page.
 */

export interface FeaturesTintedPanel {
  /** Keys the panel, and picks its tint. */
  id: "workflows" | "on-demand" | "dedicated"
  /** The tag beside the logo. */
  tag: string
  /** The panel's heading. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
  /** The words before the bullets. */
  useLabel: string
  /** The bullets. */
  bullets: string[]
  /** The button's label. */
  action: string
  /** Where the button goes. Without it, the button calls `onExplore`. */
  href?: string
}

export interface FeaturesTintedProductBentoCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  plan: { title: string; badge: string; description: string }
  build: { title: string; badge: string; value: number; percent: string }
  scale: { title: string; badge: string; label: string }
  /** The three panels, wide first. */
  panels: FeaturesTintedPanel[]
}

const BTN = "w-full [@container(min-width:48rem)]:w-auto"
const TINT = { workflows: "bg-info/10", "on-demand": "bg-warning/10", dedicated: "bg-success/10" } as const

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesTintedProductBentoCopy> = {
  en: {
    heading: "Plan. Build. Scale.",
    plan: { title: "Plan", badge: "Scoped", description: "Define the goal and the owner." },
    build: { title: "Build", badge: "In progress", value: 60, percent: "60%" },
    scale: { title: "Scale", badge: "Scaling", label: "Auto-scale" },
    panels: [
      {
        id: "workflows",
        tag: "WORKFLOWS",
        title: "Ready-made workflows, built for production.",
        description: "Explore a rich library of templates for planning, reporting and review. All reachable with a simple API. No setup needed, just connect and go.",
        useLabel: "Use it for:",
        bullets: ["Building on proven, well-tested templates", "Tailoring flows to your own brand or team", "Early access to new releases"],
        action: "Explore templates",
      },
      {
        id: "on-demand",
        tag: "ON-DEMAND",
        title: "Instant, scalable compute.",
        description: "Run work at lightning speed on a globally distributed engine. Nothing to configure, no cold starts, no scaling setup.",
        useLabel: "Use it for:",
        bullets: ["Faster results from your existing workloads", "Scale from one task to many instantly", "One framework to run, ship and monitor everything", "Clear visibility across every run"],
        action: "Learn more",
      },
      {
        id: "dedicated",
        tag: "DEDICATED",
        title: "Reserved capacity for your biggest projects.",
        description: "Spin up dedicated capacity to tune, train or run custom work with guaranteed performance. Choose from the latest hardware across global regions.",
        useLabel: "Use it for:",
        bullets: ["Capacity available on request", "Run large training workloads", "A distributed data pipeline built in", "Enterprise-grade reliability and scale"],
        action: "Learn more",
      },
    ],
  },
  ar: {
    heading: "خطّط. ابنِ. توسّع.",
    plan: { title: "التخطيط", badge: "محدَّد", description: "حدّد الهدف والمسؤول." },
    build: { title: "البناء", badge: "قيد التنفيذ", value: 60, percent: "60 بالمئة" },
    scale: { title: "التوسع", badge: "يتوسّع", label: "توسع تلقائي" },
    panels: [
      {
        id: "workflows",
        tag: "مسارات العمل",
        title: "مسارات عمل جاهزة، مصممة للإنتاج.",
        description: "استكشف مكتبة غنية من القوالب للتخطيط والتقارير والمراجعة، يمكن الوصول إليها كلها عبر واجهة برمجية بسيطة. لا حاجة إلى إعداد، اتصل وانطلق.",
        useLabel: "استخدمها في:",
        bullets: ["البناء على قوالب مجرّبة ومختبرة جيدًا", "تخصيص المسارات لعلامتك أو فريقك", "وصول مبكر إلى الإصدارات الجديدة"],
        action: "استكشف القوالب",
      },
      {
        id: "on-demand",
        tag: "عند الطلب",
        title: "قدرة حوسبة فورية وقابلة للتوسع.",
        description: "نفّذ عملك بسرعة البرق على محرك موزَّع عالميًا. لا إعدادات، ولا بدايات باردة، ولا ضبط للتوسع.",
        useLabel: "استخدمها في:",
        bullets: ["نتائج أسرع من أعباء عملك الحالية", "توسّع من مهمة واحدة إلى مهام كثيرة فورًا", "إطار واحد للتشغيل والإطلاق والمراقبة", "رؤية واضحة عبر كل عملية تشغيل"],
        action: "اعرف المزيد",
      },
      {
        id: "dedicated",
        tag: "مخصَّصة",
        title: "سعة محجوزة لأكبر مشاريعك.",
        description: "أطلق سعة مخصصة لضبط أعمالك المخصصة أو تدريبها أو تشغيلها بأداء مضمون. اختر من أحدث العتاد في مناطق العالم.",
        useLabel: "استخدمها في:",
        bullets: ["السعة متاحة عند الطلب", "تشغيل أعباء تدريب كبيرة", "خط بيانات موزَّع مدمج", "موثوقية وتوسع بمستوى المؤسسات"],
        action: "اعرف المزيد",
      },
    ],
  },
}

export interface FeaturesTintedProductBentoProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesTintedProductBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Called with the panel's `id` when its button is pressed and the panel has no `href`. */
  onExplore?: (id: FeaturesTintedPanel["id"]) => void
}

export function FeaturesTintedProductBento({ locale = "en", heading, plan, build, scale, panels, onExplore, className, ...props }: FeaturesTintedProductBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = panels ?? copy.panels
  const pl = plan ?? copy.plan
  const bu = build ?? copy.build
  const sc = scale ?? copy.scale
  const [wide, ...small] = list

  const panel = (item: FeaturesTintedPanel, wideTitle = false) => (
    <section key={item.id} aria-label={String(item.title)} className={cn("flex min-w-0 flex-col items-start gap-4 rounded-xl p-8", TINT[item.id])}>
      <p className="flex items-center gap-3 text-sm font-semibold tracking-wide text-muted-foreground rtl:tracking-normal">
        <FaslaLogo variant="lockup" title="" className="h-7 w-auto" />
        {item.tag}
      </p>
      <h3 className={cn("text-2xl font-semibold text-foreground", wideTitle && "[@container(min-width:48rem)]:text-3xl")}>{item.title}</h3>
      <p className="text-sm text-foreground">{item.description}</p>
      <div className="flex flex-col gap-4 text-sm text-foreground">
        <p>{item.useLabel}</p>
        <ul role="list" className="flex flex-col">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span className="min-w-0">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      {item.href ? (
        <a href={item.href} className={buttonVariants({ variant: "default", size: "md", className: BTN })}>
          {item.action}
        </a>
      ) : (
        <Button type="button" variant="default" size="md" onClick={() => onExplore?.(item.id)} className={BTN}>
          {item.action}
        </Button>
      )}
    </section>
  )

  return (
    <FeaturesSection labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-8 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-start [@container(min-width:72rem)]:gap-12">
        <div className="flex min-w-0 flex-col gap-8 [@container(min-width:72rem)]:w-[330px] [@container(min-width:72rem)]:shrink-0">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:48rem)]:text-5xl">
            {heading ?? copy.heading}
          </h2>
          <div className="flex flex-col justify-center gap-3 rounded-xl bg-foreground/10 p-6 [@container(min-width:72rem)]:h-[360px]">
            <div className="flex flex-col gap-2 rounded-xl bg-card p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-info/30">
                  <CalendarCheck size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                </span>
                <span className="flex-1 text-sm font-semibold">{pl.title}</span>
                <Badge variant="soft" tone="info" size="sm" radius="standard">
                  {pl.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{pl.description}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-card p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-warning/30">
                  <Layers size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                </span>
                <span className="flex-1 text-sm font-semibold">{bu.title}</span>
                <Badge variant="soft" tone="warning" size="sm" radius="standard">
                  {bu.badge}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>{bu.percent}</span>
                <Progress value={bu.value} size="md" showPercentage={false} aria-label={bu.title} className="flex-1" />
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-card p-4 text-card-foreground">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-success/30">
                  <TrendingUp size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                </span>
                <span className="flex-1 text-sm font-semibold">{sc.title}</span>
                <Badge variant="soft" tone="success" size="sm" radius="standard">
                  {sc.badge}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>{sc.label}</span>
                <Switch size="sm" defaultChecked aria-label={sc.label} />
              </div>
            </div>
          </div>
        </div>
        {wide ? (
          <div className="flex min-w-0 flex-col gap-5 [@container(min-width:72rem)]:flex-1">
            {panel(wide, true)}
            {small.length > 0 ? <div className="grid grid-cols-1 gap-5 [@container(min-width:48rem)]:grid-cols-2">{small.map((item) => panel(item))}</div> : null}
          </div>
        ) : null}
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresTintedProductBentoCopy = COPY

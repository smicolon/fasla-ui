"use client"

import * as React from "react"
import { Database, Eye, Layers, Lock, Server, ShieldCheck, Star, Workflow, Zap } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Progress } from "../../ui/progress/progress"
import { Switch } from "../../ui/switch/switch"
import { FeaturesSection, Figures, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Solid Colour Cards.
 *
 * A header row: at the start a 12px eyebrow, a 48px heading and an 18px line
 * (all in `chart-3`), at the end a 340px `info` wash holding a workflow card
 * (a `card` with a mark, "Weekly review", a Progress and three steps, each an
 * Avatar, a label and a Badge). Under it four `chart-3` cards, each a bold
 * lead-in and a line in `primary-foreground`, over a `primary-foreground`
 * wash holding a product mock-up built from the Badge, Switch, Avatar and
 * Progress atoms: Protected with two switches, an avatar stack with a trust
 * badge, three marks with an infrastructure badge, and a Setup progress.
 *
 * The switches are live. Desktop sets the four cards across; Tablet two across,
 * the header's wash under the text; Mobile one across. The cards hold still,
 * and only lift 4px on hover.
 *
 * Content limits: the heading up to 40 characters, a card's lead-in up to 28
 * and its line up to 80. The other limits are in the block's documentation page.
 */

export interface FeaturesSolidColourCard {
  /** Keys the card. */
  id: "secure" | "built" | "agnostic" | "quick"
  /** The bold lead-in of the card's text. */
  lead: string
  /** The rest of its text. */
  text: string
}

export interface FeaturesSolidColourCardsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The four cards, in order. */
  cards: FeaturesSolidColourCard[]
  workflow: { title: string; progress: string; steps: { name: string; label: string; status: string; tone: "success" | "info" }[] }
  protectedMock: { badge: string; rules: string; monitoring: string }
  trustedMock: { names: string[]; badge: string }
  infraMock: { badge: string }
  setupMock: { label: string; badge: string; value: number; percent: string }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesSolidColourCardsCopy> = {
  en: {
    eyebrow: "WHY FASLA?",
    heading: "Powerful workflows, proven success.",
    description: "Fasla is uniquely positioned, and proven, to be the single, secure environment for every team’s agents, apps and automations.",
    cards: [
      { id: "secure", lead: "Secure by design.", text: "Governance, guardrails and monitoring across every surface." },
      { id: "built", lead: "Built for the work that matters.", text: "Trusted by organisations with ambitious plans." },
      { id: "agnostic", lead: "Tool-agnostic.", text: "Works across your whole stack and inside your own infrastructure." },
      { id: "quick", lead: "Quick to value.", text: "Teams love Fasla for speed, power and ease of use." },
    ],
    workflow: {
      title: "Weekly review",
      progress: "3 of 4 steps done",
      steps: [
        { name: "Alex Rivera", label: "Collect updates", status: "Done", tone: "success" },
        { name: "Maya Khan", label: "Draft summary", status: "Done", tone: "success" },
        { name: "Noah Smith", label: "Send to team", status: "Running", tone: "info" },
      ],
    },
    protectedMock: { badge: "Protected", rules: "Access rules", monitoring: "Monitoring" },
    trustedMock: { names: ["Alex Rivera", "Maya Khan", "Noah Smith", "Lena Brooks"], badge: "Trusted by growing teams" },
    infraMock: { badge: "Runs in your infrastructure" },
    setupMock: { label: "Setup", badge: "2 days", value: 85, percent: "85%" },
  },
  ar: {
    eyebrow: "لماذا فاصلة؟",
    heading: "مسارات عمل قوية، ونجاح مثبت.",
    description: "فاصلة في موقع فريد، ومثبتة كفاءتها، لتكون البيئة الواحدة الآمنة لوكلاء كل فريق وتطبيقاته وأتمتته.",
    cards: [
      { id: "secure", lead: "آمنة بالتصميم.", text: "حوكمة وضوابط ومراقبة عبر كل الأسطح." },
      { id: "built", lead: "مبنية لما يهم.", text: "موثوقة لدى مؤسسات ذات طموحات كبيرة." },
      { id: "agnostic", lead: "مرنة مع أي أداة.", text: "تعمل عبر منظومتك كلها وداخل بنيتك التحتية." },
      { id: "quick", lead: "سريعة القيمة.", text: "تحبها الفرق لسرعتها وقوتها وسهولة استخدامها." },
    ],
    workflow: {
      title: "المراجعة الأسبوعية",
      progress: "اكتملت 3 من 4 خطوات",
      steps: [
        { name: "أمل رشيد", label: "جمع التحديثات", status: "تم", tone: "success" },
        { name: "مها كريم", label: "صياغة الملخص", status: "تم", tone: "success" },
        { name: "نورة سالم", label: "إرسال إلى الفريق", status: "قيد التنفيذ", tone: "info" },
      ],
    },
    protectedMock: { badge: "محمي", rules: "قواعد الوصول", monitoring: "المراقبة" },
    trustedMock: { names: ["أمل رشيد", "مها كريم", "نورة سالم", "ليلى بدر"], badge: "تثق بها الفرق النامية" },
    infraMock: { badge: "تعمل داخل بنيتك التحتية" },
    setupMock: { label: "الإعداد", badge: "يومان", value: 85, percent: "85 بالمئة" },
  },
}

export interface FeaturesSolidColourCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesSolidColourCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

const CARD = "flex flex-col gap-8 rounded-2xl bg-chart-3 p-8 text-primary-foreground motion-safe:transition-transform motion-safe:duration-200 hover:motion-safe:-translate-y-1"
const WASH = "flex min-h-[130px] flex-1 flex-col justify-center gap-2 rounded-xl bg-primary-foreground/20 p-3"

export function FeaturesSolidColourCards({ locale = "en", eyebrow, heading, description, cards, workflow, protectedMock, trustedMock, infraMock, setupMock, className, ...props }: FeaturesSolidColourCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = cards ?? copy.cards
  const wf = workflow ?? copy.workflow
  const prot = protectedMock ?? copy.protectedMock
  const trust = trustedMock ?? copy.trustedMock
  const infra = infraMock ?? copy.infraMock
  const setup = setupMock ?? copy.setupMock

  const mock = (id: FeaturesSolidColourCard["id"]) => {
    if (id === "secure")
      return (
        <div className={WASH}>
          <Badge variant="soft" tone="success" size="sm" radius="rounded" icon={<ShieldCheck strokeWidth={1.5} />} className="self-center">
            {prot.badge}
          </Badge>
          <ul role="list" className="flex flex-col gap-1.5 rounded-lg bg-card p-2 text-card-foreground">
            <li className="flex items-center gap-2 text-xs">
              <Lock size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
              <span className="flex-1">{prot.rules}</span>
              <Switch size="sm" defaultChecked aria-label={prot.rules} />
            </li>
            <li className="flex items-center gap-2 text-xs">
              <Eye size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
              <span className="flex-1">{prot.monitoring}</span>
              <Switch size="sm" defaultChecked aria-label={prot.monitoring} />
            </li>
          </ul>
        </div>
      )
    if (id === "built")
      return (
        <div className={WASH}>
          <div className="flex justify-center rounded-lg bg-card p-2 text-card-foreground">
            <div className="flex -space-x-1 rtl:space-x-reverse" aria-hidden="true">
              {trust.names.map((name, index) => (
                <Avatar key={index} variant="initials" name={name} size="32" radius="rounded" border />
              ))}
            </div>
          </div>
          <Badge variant="outline" tone="secondary" size="sm" radius="standard" icon={<Star strokeWidth={1.5} />} className="self-center bg-card">
            {trust.badge}
          </Badge>
        </div>
      )
    if (id === "agnostic")
      return (
        <div className={WASH}>
          <div className="flex justify-center gap-2" aria-hidden="true">
            {[Database, Workflow, Layers].map((Icon, index) => (
              <span key={index} className="flex size-10 items-center justify-center rounded-lg bg-card text-card-foreground">
                <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth />
              </span>
            ))}
          </div>
          <Badge variant="outline" tone="secondary" size="sm" radius="standard" icon={<Server strokeWidth={1.5} />} className="self-center bg-card">
            {infra.badge}
          </Badge>
        </div>
      )
    return (
      <div className={WASH}>
        <div className="flex flex-col gap-2 rounded-lg bg-card p-2 text-card-foreground">
          <div className="flex items-center gap-2 text-xs">
            <Zap size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="text-warning" />
            <span className="flex-1">{setup.label}</span>
            <Badge variant="soft" tone="success" size="sm" radius="standard">
              {setup.badge}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Figures>{setup.percent}</Figures>
            <Progress value={setup.value} size="md" showPercentage={false} aria-label={setup.label} className="flex-1" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="flex flex-col gap-8 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-start [@container(min-width:72rem)]:justify-between [@container(min-width:72rem)]:gap-0">
        <div className="flex min-w-0 flex-col items-start gap-5 [@container(min-width:72rem)]:max-w-[700px]">
          {(eyebrow ?? copy.eyebrow) ? <p className="text-xs font-medium tracking-wide text-chart-3 rtl:tracking-normal">{eyebrow ?? copy.eyebrow}</p> : null}
          <h2 id={headingId} className="text-3xl font-semibold text-chart-3 [@container(min-width:48rem)]:text-5xl">
            {heading ?? copy.heading}
          </h2>
          <p className="max-w-[560px] text-lg text-chart-3">{description ?? copy.description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 rounded-2xl bg-info/10 p-6 [@container(min-width:72rem)]:w-[340px] [@container(min-width:72rem)]:shrink-0" aria-hidden="true">
          <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-info/30">
                <Workflow size={16} strokeWidth={1.5} absoluteStrokeWidth />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold">{wf.title}</span>
                <span className="text-xs text-muted-foreground">{wf.progress}</span>
              </div>
            </div>
            <Progress value={75} size="sm" showPercentage={false} aria-label={wf.title} />
            <ul role="list" className="flex flex-col gap-2">
              {wf.steps.map((step) => (
                <li key={step.label} className="flex items-center gap-2 text-xs">
                  <Avatar variant="initials" name={step.name} size="24" radius="standard" />
                  <span className="flex-1">{step.label}</span>
                  <Badge variant="soft" tone={step.tone} size="sm" radius="standard">
                    {step.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {list.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-6 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-4">
          {list.map((card) => (
            <li key={card.id} className={CARD}>
              <p className="text-xl">
                <span className="font-semibold">{card.lead}</span> {card.text}
              </p>
              {mock(card.id)}
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
export const featuresSolidColourCardsCopy = COPY

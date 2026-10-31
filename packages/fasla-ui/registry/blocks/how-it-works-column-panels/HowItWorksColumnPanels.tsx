"use client"

import * as React from "react"
import { Calendar, Database, FileText, Folder, Mail, Sparkles } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { enter, GROW_Y, HowItWorksEyebrow, HowItWorksLtr, HowItWorksSection, POP, revealTargets, RISE, useRevealOnEnter, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Column Panels.
 *
 * A header (an eyebrow, the heading, and an introduction beside it), then
 * three panels in one frame, divided by 1px hairlines. Each panel is an
 * outline badge with its step, a title, a line, and a 260px picture on
 * `muted`: three sources routed into a hub, a document whose fields are
 * numbered, and a summary with figures and bars. The pictures are drawn here
 * and hidden from screen readers; the panel's words say the same.
 *
 * Desktop sets the intro at the far end of the heading's row and the panels
 * three across. Tablet and Mobile put the intro under the heading and stack
 * the panels, with the same hairlines between them. The page's `dir` mirrors
 * the order.
 *
 * Motion plays once, when the block comes into view: the panels rise left to
 * right 100ms apart; the dashed lines draw into the hub (700ms) before the
 * chip pops; the document's index squares pop in order, 150ms apart; the
 * summary's bars grow from the baseline 60ms apart, the primary bar last,
 * and the chip fades in after. Under reduced motion the block is its finished
 * state.
 *
 * Content limits: a panel's title up to 56 characters and its line up to 120.
 * The heading up to 24, the introduction up to 130.
 */

export interface HowItWorksColumnPanelsCopy {
  /** The small line above the heading. */
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The line beside, or under, the heading. */
  intro: React.ReactNode
  gather: { step: React.ReactNode; title: React.ReactNode; description: React.ReactNode; chip: React.ReactNode }
  organise: {
    step: React.ReactNode
    title: React.ReactNode
    description: React.ReactNode
    document: React.ReactNode
    /** The document's three fields, each a name. */
    fields: [React.ReactNode, React.ReactNode, React.ReactNode]
  }
  share: {
    step: React.ReactNode
    title: React.ReactNode
    description: React.ReactNode
    summary: React.ReactNode
    approved: React.ReactNode
    /** The three figures, each a value and a label. */
    metrics: [{ value: string; label: React.ReactNode }, { value: string; label: React.ReactNode }, { value: string; label: React.ReactNode }]
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksColumnPanelsCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "Your events",
    intro: "Bring guests, vendors and schedules into one place. Ask a question in plain words and get an answer you can check.",
    gather: {
      step: "1 · Gather",
      title: "Bring in every guest list, quote and schedule",
      description: "Everything arrives from the places you already use and lands in the right folder on its own.",
      chip: "Sorted automatically",
    },
    organise: {
      step: "2 · Organise",
      title: "See the whole event on one page",
      description: "Dates, budgets and names are pulled from every document and linked together, so answers come from facts, not guesses.",
      document: "Venue contract",
      fields: ["Deposit", "Event date", "Guest limit"],
    },
    share: {
      step: "3 · Share",
      title: "Send a finished plan, ready to approve",
      description: "Each Friday your team gets a complete summary of what changed. You review it and move on.",
      summary: "Summary",
      approved: "Approved",
      metrics: [
        { value: "12", label: "Guests" },
        { value: "98%", label: "Booked" },
        { value: "3", label: "Open" },
      ],
    },
  },
  ar: {
    eyebrow: "كيف يعمل",
    heading: "فعالياتك",
    intro: "اجمع الضيوف والموردين والجداول في مكان واحد. اطرح سؤالًا بكلمات بسيطة واحصل على إجابة يمكنك التحقق منها.",
    gather: {
      step: "1 · الجمع",
      title: "أضف كل قائمة ضيوف وعرض سعر وجدول",
      description: "يصل كل شيء من الأماكن التي تستخدمها فعلًا ويُحفظ في المجلد المناسب تلقائيًا.",
      chip: "تُصنَّف تلقائيًا",
    },
    organise: {
      step: "2 · التنظيم",
      title: "شاهد الفعالية كاملة في صفحة واحدة",
      description: "تُستخرج التواريخ والميزانيات والأسماء من كل مستند وتُربط معًا، فتأتي الإجابات من الحقائق لا من التخمين.",
      document: "عقد القاعة",
      fields: ["العربون", "تاريخ الفعالية", "الحد الأقصى للضيوف"],
    },
    share: {
      step: "3 · المشاركة",
      title: "أرسل خطة مكتملة جاهزة للاعتماد",
      description: "كل جمعة يصل فريقك ملخص كامل بما تغيّر. تراجعه وتمضي.",
      summary: "الملخص",
      approved: "معتمدة",
      metrics: [
        { value: "12", label: "الضيوف" },
        { value: "98%", label: "المحجوز" },
        { value: "3", label: "المتبقي" },
      ],
    },
  },
}

/** A panel: its step badge, title and line, then its picture on `muted`. */
function Panel({ step, title, description, children }: { step: React.ReactNode; title: React.ReactNode; description: React.ReactNode; children: React.ReactNode }) {
  return (
    <li data-reveal="panel" className="flex min-w-0 flex-col gap-6 bg-background p-6">
      <div>
        <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
          {step}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div aria-hidden="true" className="flex h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-[10px] bg-muted p-4">
        {children}
      </div>
    </li>
  )
}

const INDEX_TONES = ["bg-chart-1", "bg-chart-2", "bg-chart-3"]
const BARS = [24, 36, 30, 48, 42, 60]

export interface HowItWorksColumnPanelsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksColumnPanelsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

export function HowItWorksColumnPanels({ locale = "en", eyebrow, heading, intro, gather, organise, share, className, ...props }: HowItWorksColumnPanelsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const g = gather ?? copy.gather
  const o = organise ?? copy.organise
  const s = share ?? copy.share

  useRevealOnEnter(rootRef, (node) => {
    const animations: Animation[] = []
    revealTargets(node, "panel").forEach((panel, index) => {
      const base = index * 100
      animations.push(enter(panel, RISE, { duration: 400, delay: base }))
      const inner = (name: string) => Array.from(panel.querySelectorAll<HTMLElement | SVGElement>(`[data-reveal="${name}"]`))
      inner("connector").forEach((el) => {
        const length = (el as SVGLineElement).getTotalLength?.() ?? 90
        animations.push(enter(el, [{ strokeDashoffset: `${length}`, opacity: 0 }, { strokeDashoffset: "0", opacity: 1 }], { duration: 700, delay: base + 200 }))
      })
      inner("tile").forEach((el, i) => animations.push(enter(el, POP, { duration: 260, delay: base + 200 + i * 80 })))
      inner("chip").forEach((el) => animations.push(enter(el, POP, { duration: 220, delay: base + 900 })))
      inner("index").forEach((el, i) => animations.push(enter(el, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 150, delay: base + 300 + i * 150 })))
      inner("bar").forEach((el, i) => animations.push(enter(el, GROW_Y, { duration: 300, delay: base + 300 + i * 60 })))
      inner("approved").forEach((el) => animations.push(enter(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: base + 800 })))
    })
    return animations
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-24">
        <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-1">
          <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
          <h2 id={headingId} className="text-3xl font-medium text-foreground [@container(min-width:64rem)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </div>
        <p className="text-base text-muted-foreground [@container(min-width:64rem)]:w-[624px] [@container(min-width:64rem)]:shrink-0">{intro ?? copy.intro}</p>
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border [@container(min-width:64rem)]:grid-cols-3">
        <Panel step={g.step} title={g.title} description={g.description}>
          <div className="relative h-[220px] w-full max-w-[300px]">
            <svg viewBox="0 0 300 220" className="absolute inset-0 size-full" fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 4">
              {(
                [
                  [62, 60, 132, 140],
                  [150, 60, 150, 136],
                  [238, 60, 168, 140],
                ] as const
              ).map(([x1, y1, x2, y2]) => (
                <line key={x1} data-reveal="connector" x1={x1} y1={y1} x2={x2} y2={y2} className="text-border" />
              ))}
            </svg>
            {(
              [
                [Mail, 62],
                [Folder, 150],
                [Calendar, 238],
              ] as const
            ).map(([Icon, x]) => (
              <span
                key={x}
                data-reveal="tile"
                className="absolute flex size-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-card text-foreground"
                style={{ left: `${(x / 300) * 100}%`, top: `${(34 / 220) * 100}%` }}
              >
                <Icon size={22} strokeWidth={1.5} absoluteStrokeWidth />
              </span>
            ))}
            <span
              data-reveal="tile"
              className="absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-primary bg-card text-foreground"
              style={{ left: "50%", top: `${(168 / 220) * 100}%` }}
            >
              <Database size={28} strokeWidth={1.5} absoluteStrokeWidth />
            </span>
            <span data-reveal="chip" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: `${(204 / 220) * 100}%` }}>
              <Badge variant="soft" tone="success" size="sm" radius="rounded" className="whitespace-nowrap">
                {g.chip}
              </Badge>
            </span>
          </div>
        </Panel>

        <Panel step={o.step} title={o.title} description={o.description}>
          <div className="flex w-full flex-col gap-3 rounded-md border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <FileText size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
              <span className="min-w-0 truncate text-sm font-semibold text-foreground">{o.document}</span>
            </div>
            {o.fields.map((field, index) => (
              <div key={index} className="flex items-center gap-2">
                <span data-reveal="index" className={cn("flex h-5 min-w-5 shrink-0 items-center justify-center rounded-[2px] px-1 text-xs font-medium text-background", INDEX_TONES[index])}>
                  <HowItWorksLtr>{`0${index + 1}`}</HowItWorksLtr>
                </span>
                <span className="h-2 w-[70px] shrink-0 rounded-full bg-muted" />
                <span className="min-w-0 truncate text-xs text-foreground">{field}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel step={s.step} title={s.title} description={s.description}>
          <div className="flex w-full flex-col gap-3 rounded-md border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{s.summary}</span>
              <span data-reveal="approved">
                <Badge variant="soft" tone="success" size="sm" radius="rounded">
                  {s.approved}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {s.metrics.map((metric, index) => (
                <div key={index} className="flex min-w-0 flex-col rounded-md bg-muted p-1.5 [@container(min-width:40rem)]:p-2">
                  <HowItWorksLtr className="text-xl font-medium text-foreground">{metric.value}</HowItWorksLtr>
                  <span className="break-words text-xs text-muted-foreground">{metric.label}</span>
                </div>
              ))}
            </div>
            <div className="flex h-[60px] items-end gap-2">
              {BARS.map((height, index) => (
                <span
                  key={index}
                  data-reveal="bar"
                  className={cn("w-[18px] origin-bottom rounded-[2px]", index === BARS.length - 1 ? "bg-primary" : "bg-muted")}
                  style={{ height }}
                />
              ))}
            </div>
          </div>
        </Panel>
      </ul>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksColumnPanelsCopy = COPY

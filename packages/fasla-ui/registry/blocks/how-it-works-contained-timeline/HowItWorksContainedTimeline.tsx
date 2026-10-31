"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import {
  enter,
  HowItWorksEyebrow,
  HowItWorksFigures,
  HowItWorksRule,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Contained Timeline.
 *
 * A left-aligned header (an eyebrow, a two-tone heading, a line), then a
 * bordered container (14px radius, 8px padding) holding a `muted` panel: four
 * steps in a row, each a track (an 8px dot and a 1px line) over a label, a
 * title and a line, a rule, and a footer with a note at the start and two
 * buttons at the end. The first two steps are done (a filled dot and a `foreground`
 * line), the third is current (a hollow dot, a `border` line) and the last is the
 * goal (a `warning` dot, a `border` line).
 *
 * Desktop sets four columns. Tablet sets two by two, the draw following reading
 * order. Mobile is one column, each step's track above it, and the footer stacks
 * with the two buttons the width of the panel. The page's `dir` mirrors all of
 * it: step 1 is the rightmost column in Arabic and every line draws from the
 * right.
 *
 * Motion plays once, when the block comes into view: the track lines draw along
 * the inline axis (480ms, 120ms apart) and each dot pops behind its line. The
 * current step's dot sends out a soft ring twice (1.2s each) and then rests. The
 * goal's dot lands last, then the note and both buttons rise 8px. Under reduced
 * motion the block is its finished state, with no draw and no ring.
 *
 * Content limits: the heading up to 40 characters a line, the intro up to 90.
 * A step's label up to 12 characters, its title up to 24 and its line up to 60.
 * Four steps in Figma; two to six work.
 */

export type HowItWorksContainedStatus = "done" | "current" | "goal"

export interface HowItWorksContainedStep {
  /** Keys the step. */
  id: string
  /** The small line above the title, such as "Step 1". */
  label: string
  title: React.ReactNode
  body: React.ReactNode
  /** Which dot and line it gets. */
  status: HowItWorksContainedStatus
}

export interface HowItWorksContainedTimelineCopy {
  eyebrow: React.ReactNode
  /** The heading's first line, an `h2` together with `headingMuted`. */
  heading: React.ReactNode
  /** The heading's second line, in the muted colour. */
  headingMuted: React.ReactNode
  description: React.ReactNode
  steps: HowItWorksContainedStep[]
  /** The small line over the footer note. */
  noteLabel: React.ReactNode
  note: React.ReactNode
  primaryAction: React.ReactNode
  secondaryAction: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksContainedTimelineCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "From first idea to boarding pass,",
    headingMuted: "in four calm steps.",
    description: "Every detail lives in one place, so nothing slips through along the way.",
    steps: [
      { id: "place", label: "Step 1", title: "Pick a place", body: "Browse ideas and save the ones that feel right.", status: "done" },
      { id: "dates", label: "Step 2", title: "Set the dates", body: "Compare calendars and lock in days that suit everyone.", status: "done" },
      { id: "book", label: "Step 3", title: "Book together", body: "Flights and stays are held while your group decides.", status: "current" },
      { id: "go", label: "Day 1", title: "Go", body: "Everything you need is on your phone, ready offline.", status: "goal" },
    ],
    noteLabel: "Good to know",
    note: "Plans can be changed free of charge up to two days before you leave.",
    primaryAction: "Start planning",
    secondaryAction: "See a sample trip",
  },
  ar: {
    eyebrow: "كيف يعمل",
    heading: "من الفكرة الأولى إلى بطاقة الصعود،",
    headingMuted: "في أربع خطوات هادئة.",
    description: "كل التفاصيل في مكان واحد، فلا يضيع منها شيء في الطريق.",
    steps: [
      { id: "place", label: "الخطوة 1", title: "اختر وجهتك", body: "تصفّح الأفكار واحفظ ما يناسبك.", status: "done" },
      { id: "dates", label: "الخطوة 2", title: "حدّد المواعيد", body: "قارن التقاويم وثبّت أيامًا تناسب الجميع.", status: "done" },
      { id: "book", label: "الخطوة 3", title: "احجزوا معًا", body: "تُحفظ الرحلات والإقامات إلى أن تقرر مجموعتكم.", status: "current" },
      { id: "go", label: "اليوم 1", title: "انطلق", body: "كل ما تحتاجه على هاتفك، جاهز دون اتصال.", status: "goal" },
    ],
    noteLabel: "من المفيد معرفته",
    note: "يمكن تعديل الخطط مجانًا حتى يومين قبل السفر.",
    primaryAction: "ابدأ التخطيط",
    secondaryAction: "شاهد رحلة نموذجية",
  },
}

export interface HowItWorksContainedTimelineProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksContainedTimelineCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /** Called when the primary button is pressed. */
  onPrimaryAction?: () => void
  /** Called when the secondary button is pressed. */
  onSecondaryAction?: () => void
}

const DOT: Record<HowItWorksContainedStatus, string> = {
  done: "bg-foreground",
  current: "border-2 border-foreground bg-transparent",
  goal: "bg-warning",
}
const LINE: Record<HowItWorksContainedStatus, string> = {
  done: "bg-foreground",
  current: "bg-border",
  goal: "bg-border",
}

export function HowItWorksContainedTimeline({
  locale = "en",
  eyebrow,
  heading,
  headingMuted,
  description,
  steps,
  noteLabel,
  note,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  className,
  ...props
}: HowItWorksContainedTimelineProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    const lines = revealTargets(node, "line")
    const dots = revealTargets(node, "dot")
    lines.forEach((line, index) => started.push(enter(line, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 480, delay: index * 120 })))
    dots.forEach((dot, index) => started.push(enter(dot, [{ transform: "scale(0)" }, { transform: "scale(1.2)", offset: 0.7 }, { transform: "scale(1)" }], { duration: 220, delay: index * 120 })))
    // The current step's ring: two soft pulses, then it rests.
    revealTargets(node, "pulse").forEach((ring, index) =>
      started.push(ring.animate([{ opacity: 0.5, transform: "scale(1)" }, { opacity: 0, transform: "scale(3.2)" }], { duration: 1200, iterations: 2, delay: index * 120 + 480, easing: "ease-out", fill: "none" }))
    )
    const after = (list.length - 1) * 120 + 220
    revealTargets(node, "footer").forEach((el, index) => started.push(enter(el, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 350, delay: after + index * 60 })))
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-start gap-3">
        <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
        <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-4xl">
          <span className="block">{heading ?? copy.heading}</span>
          <span className="block text-muted-foreground">{headingMuted ?? copy.headingMuted}</span>
        </h2>
        <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
      </header>

      <div className="rounded-[14px] border border-border bg-background p-2">
        <div className="flex flex-col gap-8 rounded-[10px] bg-muted p-5 [@container(min-width:40rem)]:p-8">
          <ol className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
            {list.map((step) => (
              <li key={step.id} aria-current={step.status === "current" ? "step" : undefined} className="flex min-w-0 flex-col gap-3">
                <div aria-hidden="true" className="flex items-center gap-2">
                  <span className="relative flex size-2 shrink-0">
                    <span data-reveal="dot" className={cn("size-2 rounded-full", DOT[step.status])} />
                    {step.status === "current" ? <span data-reveal="pulse" className="absolute inset-0 rounded-full border border-foreground opacity-0" /> : null}
                  </span>
                  <span data-reveal="line" className={cn("h-px flex-1 origin-left [&:dir(rtl)]:origin-right", LINE[step.status])} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground [&:dir(rtl)]:tracking-normal">
                    <HowItWorksFigures>{step.label}</HowItWorksFigures>
                  </p>
                  <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <HowItWorksRule />
          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
            <div data-reveal="footer" className="flex flex-col gap-1.5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground [&:dir(rtl)]:tracking-normal">{noteLabel ?? copy.noteLabel}</p>
              <p className="text-sm text-foreground">{note ?? copy.note}</p>
            </div>
            <div data-reveal="footer" className="flex flex-col gap-2 [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:flex-row">
              <Button type="button" size="md" onClick={onPrimaryAction}>
                {primaryAction ?? copy.primaryAction}
              </Button>
              <Button type="button" variant="outline" tone="primary" size="md" onClick={onSecondaryAction}>
                {secondaryAction ?? copy.secondaryAction}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksContainedTimelineCopy = COPY

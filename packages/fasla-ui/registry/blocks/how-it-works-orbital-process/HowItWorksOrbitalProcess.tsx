"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  EASE_OUT,
  enter,
  HowItWorksEyebrow,
  HowItWorksImage,
  HowItWorksLtr,
  HowItWorksSection,
  prefersReducedMotion,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Orbital Process.
 *
 * A header (an eyebrow and the heading, with a line at its end), then an orbit:
 * a round photo in the middle, a thin ring around it and a dashed one inside, the
 * active step's number in a pill on top of the ring, and the other two steps as
 * round satellites on either side, each with its title and a line. Under it, the
 * active step's title and a paragraph. Pressing a satellite makes it the active
 * step: it takes the centre and the step that was active takes its place.
 *
 * Desktop (a 1248px column or wider) is the full orbit, 1248 × 560, with a connector from each satellite to
 * the ring. Tablet is a 320px ring in 640px, the satellites below it on its
 * diagonals and no connectors. Mobile gives up the orbit: a 240px photo above a
 * list of the steps, the active one filled, and a step is chosen by pressing its
 * row. The page's `dir` swaps the satellites' sides, so 02 is on the right in
 * Arabic and the order still reads 01, 02, 03; the pill stays on top.
 *
 * Motion: the outer ring draws itself once, over 700ms, when the block comes into
 * view; the connectors extend from the ring and the pill and satellites fade in.
 * Pressing a satellite plays the swap: the pill travels from the satellite to the
 * top of the ring with a soft settle while the step that was active slides out to
 * the vacated place (520ms), and the paragraph cross-fades. Figma's card also has
 * the inner dashed ring turning for ever, once a minute, and it is not in the
 * code: the ring is still. Under reduced motion nothing draws and the swap is a
 * plain change of the active step.
 *
 * Content limits: three steps; the heading up to 46 characters, the line up to 76.
 * A step's title up to 16 characters, its short line up to 28, its paragraph up to
 * 170. Figma draws only the first step's paragraph; the other two are written for
 * the code.
 */

export interface HowItWorksOrbitStep {
  /** Keys the step. */
  id: string
  title: React.ReactNode
  /** The line under the title, on a satellite and in Mobile's list. */
  short: React.ReactNode
  /** The paragraph shown under the orbit while the step is active. */
  body: React.ReactNode
}

export interface HowItWorksOrbitalProcessCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  /** The three steps, in order. The numbers are drawn from 01. */
  steps: [HowItWorksOrbitStep, HowItWorksOrbitStep, HowItWorksOrbitStep]
  /** Names a step's button, such as "Step 2: Design": `{n}` and `{title}` stand for the number and the title. */
  stepLabel: string
}

/** Figma's copy, English and Arabic, and the two paragraphs Figma does not draw. */
const COPY: Record<HowItWorksLocale, HowItWorksOrbitalProcessCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "A loop you re-enter every time the work grows",
    description: "Three phases, and the one at the centre is where the work sits right now.",
    steps: [
      {
        id: "sketch",
        title: "Sketch the flow",
        short: "Paper first, every screen in order.",
        body: "Paper first, every screen in order. From here the loop is yours: design it, review it, and come back to the sketch whenever the problem changes shape.",
      },
      {
        id: "design",
        title: "Design",
        short: "Screens on the grid",
        body: "Layouts move into the file with real content on a shared grid. Review it with the team, or go back to the sketch whenever the problem changes shape.",
      },
      {
        id: "review",
        title: "Review",
        short: "Walk it with the team",
        body: "The whole team walks the flow together and writes down what is unclear. Then back to the sketch if something moved, or on to the handover if nothing did.",
      },
    ],
    stepLabel: "Step {n}: {title}",
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "حلقة تعود إليها كلما نما العمل",
    description: "ثلاث مراحل، والمرحلة في المركز هي موضع العمل الآن.",
    steps: [
      {
        id: "sketch",
        title: "ارسم المسار",
        short: "الورق أولًا، وكل شاشة بالترتيب.",
        body: "الورق أولًا، وكل شاشة بالترتيب. ومن هنا تصبح الحلقة لك: صمّمها، راجعها، وعُد إلى الرسم كلما تغيّر شكل المشكلة.",
      },
      {
        id: "design",
        title: "التصميم",
        short: "شاشات على الشبكة",
        body: "تنتقل التخطيطات إلى الملف بمحتوى حقيقي على شبكة مشتركة. راجعها مع الفريق، أو عُد إلى الرسم كلما تغيّر شكل المشكلة.",
      },
      {
        id: "review",
        title: "المراجعة",
        short: "استعرضها مع الفريق",
        body: "يستعرض الفريق كله المسار معًا ويدوّن ما هو غير واضح. ثم العودة إلى الرسم إن تغيّر شيء، أو التسليم إن لم يتغيّر.",
      },
    ],
    stepLabel: "الخطوة {n}: {title}",
  },
}

const CIRCLE = "flex size-[76px] items-center justify-center rounded-full border border-border bg-background text-sm text-foreground transition-colors"
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export interface HowItWorksOrbitalProcessProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksOrbitalProcessCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * The photo in the middle: one for all the steps, or one per step. A `muted`
   * disc shows without any.
   * @default none: a `muted` placeholder
   */
  photos?: HowItWorksPhoto[]
  /** The step active at first, from 0. */
  defaultStep?: number
  /** Called with the new active step's index. */
  onStepChange?: (index: number) => void
}

export function HowItWorksOrbitalProcess({ locale = "en", eyebrow, heading, description, steps, stepLabel, photos, defaultStep = 0, onStepChange, className, ...props }: HowItWorksOrbitalProcessProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps
  const nameStep = stepLabel ?? copy.stepLabel
  const [active, setActive] = React.useState(Math.min(Math.max(defaultStep, 0), list.length - 1))
  const pillRef = React.useRef<HTMLSpanElement>(null)
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const slotRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const circleRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const jump = React.useRef<{ dx: number; dy: number; slot: number } | null>(null)
  const previous = React.useRef(active)

  const others = list.map((_, index) => index).filter((index) => index !== active)
  const photo = photos?.[Math.min(active, (photos?.length ?? 1) - 1)]

  const choose = (index: number, slot: number) => {
    if (index === active) return
    const from = circleRefs.current[slot]?.getBoundingClientRect()
    const to = pillRef.current?.getBoundingClientRect()
    if (from && to) jump.current = { dx: from.left + from.width / 2 - (to.left + to.width / 2), dy: from.top + from.height / 2 - (to.top + to.height / 2), slot }
    setActive(index)
    onStepChange?.(index)
  }

  // The swap: the pill travels from the satellite, the old step slides into the vacated place.
  React.useLayoutEffect(() => {
    if (previous.current === active) return
    previous.current = active
    const swing = jump.current
    jump.current = null
    if (prefersReducedMotion()) return
    const options = { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    if (swing) {
      pillRef.current?.animate?.([{ transform: `translate(${swing.dx}px, ${swing.dy}px) scale(0.7)`, opacity: 0.5 }, { transform: "none", opacity: 1 }], options)
      slotRefs.current[swing.slot]?.animate?.([{ transform: `translate(${-swing.dx}px, ${-swing.dy}px) scale(0.5)`, opacity: 0 }, { transform: "none", opacity: 1 }], options)
    }
    bodyRef.current?.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: EASE_OUT })
  }, [active])

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    revealTargets(node, "ring").forEach((ring) => started.push(enter(ring, [{ strokeDasharray: "1", strokeDashoffset: "1" }, { strokeDasharray: "1", strokeDashoffset: "0" }], { duration: 700, easing: "ease-in-out" })))
    revealTargets(node, "connector").forEach((line, index) => started.push(enter(line, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 500, delay: 500 + index * 80 })))
    revealTargets(node, "pill").forEach((el) => started.push(enter(el, [{ opacity: 0, transform: "scale(0.85)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 300 })))
    revealTargets(node, "satellite").forEach((el, index) => started.push(enter(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 500 + index * 100 })))
    return started
  })

  const slotClasses = [
    "-ms-[193px] mt-[75px] [@container(min-width:78rem)]:-ms-[574px] [@container(min-width:78rem)]:-mt-[38px]",
    "ms-[33px] mt-[75px] [@container(min-width:78rem)]:ms-[414px] [@container(min-width:78rem)]:-mt-[38px]",
  ]
  const current = list[active]!
  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-24">
        <div className="flex flex-col items-start gap-3">
          <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:max-w-[752px] [@container(min-width:64rem)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </div>
        <p className="text-base text-muted-foreground [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:shrink-0">{description ?? copy.description}</p>
      </header>

      {/* Tablet and Desktop: the orbit. */}
      <div className="relative mx-auto hidden h-[470px] w-[640px] max-w-full [@container(min-width:40rem)]:block [@container(min-width:78rem)]:h-[560px] [@container(min-width:78rem)]:w-[1248px]">
        <div className="absolute start-1/2 top-1/2 size-0">
          <svg aria-hidden="true" viewBox="0 0 340 340" className="absolute -ms-[120px] -mt-[120px] size-[240px] text-border [@container(min-width:78rem)]:-ms-[170px] [@container(min-width:78rem)]:-mt-[170px] [@container(min-width:78rem)]:size-[340px]" fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="4 4">
            <circle cx={170} cy={170} r={169.5} />
          </svg>
          <svg aria-hidden="true" viewBox="0 0 420 420" className="absolute -ms-[160px] -mt-[160px] size-[320px] -rotate-90 text-border [@container(min-width:78rem)]:-ms-[210px] [@container(min-width:78rem)]:-mt-[210px] [@container(min-width:78rem)]:size-[420px]" fill="none" stroke="currentColor" strokeWidth={1}>
            <circle data-reveal="ring" cx={210} cy={210} r={209.5} pathLength={1} />
          </svg>

          {([-448, 218] as const).map((start) => (
            <span key={start} aria-hidden="true" data-reveal="connector" className="absolute -mt-px hidden h-px w-[230px] origin-left bg-border [&:dir(rtl)]:origin-right [@container(min-width:78rem)]:block" style={{ marginInlineStart: start }} />
          ))}
          {([-453, 443] as const).map((start) => (
            <span key={start} aria-hidden="true" className="absolute -mt-[5px] hidden size-[10px] rounded-full border border-border bg-background [@container(min-width:78rem)]:block" style={{ marginInlineStart: start }} />
          ))}

          <div className="absolute -ms-[110px] -mt-[110px] size-[220px] overflow-hidden rounded-full bg-muted [@container(min-width:78rem)]:-ms-[150px] [@container(min-width:78rem)]:-mt-[150px] [@container(min-width:78rem)]:size-[300px]">
            <HowItWorksImage photo={photo} />
          </div>

          <span
            ref={pillRef}
            data-reveal="pill"
            aria-hidden="true"
            className="absolute -ms-[38px] -mt-[189px] flex h-[58px] w-[77px] items-center justify-center rounded-full border border-border bg-background text-2xl font-medium text-foreground [@container(min-width:78rem)]:-mt-[239px]"
          >
            <HowItWorksLtr>{String(active + 1).padStart(2, "0")}</HowItWorksLtr>
          </span>

          {others.map((index, slot) => {
            const step = list[index]!
            return (
              <button
                key={slot}
                ref={(node) => {
                  slotRefs.current[slot] = node
                }}
                type="button"
                data-reveal="satellite"
                aria-label={nameStep.replace("{n}", String(index + 1)).replace("{title}", typeof step.title === "string" ? step.title : String(index + 1))}
                onClick={() => choose(index, slot)}
                className={cn("group absolute flex w-[160px] flex-col items-center gap-4 rounded-2xl text-center", FOCUS, slotClasses[slot])}
              >
                <span
                  ref={(node) => {
                    circleRefs.current[slot] = node
                  }}
                  className={cn(CIRCLE, "group-hover:border-foreground motion-reduce:transition-none")}
                >
                  <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-base font-medium text-foreground">{step.title}</span>
                  <span className="text-sm text-muted-foreground">{step.short}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div ref={bodyRef} aria-live="polite" className="mx-auto hidden w-full max-w-[640px] flex-col items-center gap-2 text-center [@container(min-width:40rem)]:flex">
        <h3 className="text-2xl font-medium text-foreground">{current.title}</h3>
        <p className="text-base text-muted-foreground">{current.body}</p>
      </div>

      {/* Mobile: no orbit, a photo and a list. */}
      <div className="flex flex-col gap-5 [@container(min-width:40rem)]:hidden">
        <div className="relative h-60 w-full overflow-hidden rounded-[10px] bg-muted">
          <HowItWorksImage photo={photo} />
        </div>
        <ol className="flex flex-col gap-3">
          {list.map((step, index) => {
            const on = index === active
            return (
              <li key={step.id}>
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => choose(index, 0)}
                  className={cn("flex w-full items-center gap-3 rounded-lg border p-3 text-start transition-colors motion-reduce:transition-none", FOCUS, on ? "border-transparent bg-muted" : "border-border bg-background")}
                >
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium", on ? "bg-foreground text-background" : "border border-border text-foreground")}>
                    <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-base font-medium text-foreground">{step.title}</span>
                    <span className="text-sm text-muted-foreground">{step.short}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksOrbitalProcessCopy = COPY

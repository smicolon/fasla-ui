"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { enter, HowItWorksFigures, HowItWorksSection, revealTargets, useRevealOnEnter, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Phase Line.
 *
 * A left-aligned header (a heading and a line), then four phases side by side:
 * each a track (a 12px square marker and a 1px line) over a label, a title and a
 * line. The first phase's marker is `foreground` and its line too, to show it is
 * done; the others carry `info`, `warning` and `destructive` markers on a
 * `border` line.
 *
 * Desktop sets the four across, 32px apart. Tablet sets two by two. Mobile is one
 * column, each phase with its own short track above it. The page's `dir` mirrors
 * all of it: phase 1 is the rightmost column in Arabic, and each marker sits at
 * the right end of its track.
 *
 * Motion plays once, when the block comes into view: the first line fills along
 * the inline axis (600ms), then the four markers pop in order (200ms, 80ms apart)
 * and each phase's copy rises 8px behind its marker. A marker grows to 110% on
 * hover (160ms). Under reduced motion the block is its finished state. Figma's
 * Mobile pops each marker as its phase scrolls into view; the code plays the same
 * entrance once for the block at every width.
 *
 * Content limits: the heading up to 40 characters, the line up to 100. A phase's
 * label up to 14 characters, its title up to 20 and its line up to 70. Four phases
 * in Figma; two to six work.
 */

export type HowItWorksPhaseTone = "foreground" | "info" | "warning" | "destructive"

export interface HowItWorksPhase {
  /** Keys the phase. */
  id: string
  /** The small line above the title, such as "Weeks 1–3". */
  label: string
  title: React.ReactNode
  body: React.ReactNode
  /** The marker's theme colour. The first phase also fills its line. */
  tone: HowItWorksPhaseTone
}

export interface HowItWorksPhaseLineCopy {
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  phases: HowItWorksPhase[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksPhaseLineCopy> = {
  en: {
    heading: "A course that grows with you.",
    description: "Twelve weeks, four stages. You move forward when you are ready, not when the calendar says so.",
    phases: [
      { id: "foundations", label: "Weeks 1–3", title: "Foundations", body: "Short lessons that build the basics at your own pace.", tone: "foreground" },
      { id: "practice", label: "Weeks 4–6", title: "Practice", body: "Guided exercises with feedback after every attempt.", tone: "info" },
      { id: "projects", label: "Weeks 7–9", title: "Projects", body: "Apply what you learned to a small real-world brief.", tone: "warning" },
      { id: "showcase", label: "Weeks 10–12", title: "Showcase", body: "Present your work and plan what to learn next.", tone: "destructive" },
    ],
  },
  ar: {
    heading: "دورة تنمو معك.",
    description: "اثنا عشر أسبوعًا وأربع مراحل. تتقدّم عندما تكون مستعدًا، لا عندما يحدّد التقويم ذلك.",
    phases: [
      { id: "foundations", label: "الأسابيع 1–3", title: "الأساسيات", body: "دروس قصيرة تبني الأساس وفق وتيرتك.", tone: "foreground" },
      { id: "practice", label: "الأسابيع 4–6", title: "التطبيق", body: "تمارين موجّهة مع ملاحظات بعد كل محاولة.", tone: "info" },
      { id: "projects", label: "الأسابيع 7–9", title: "المشاريع", body: "طبّق ما تعلمته على مهمة صغيرة من الواقع.", tone: "warning" },
      { id: "showcase", label: "الأسابيع 10–12", title: "العرض", body: "اعرض عملك وخطّط لما ستتعلمه بعد ذلك.", tone: "destructive" },
    ],
  },
}

export interface HowItWorksPhaseLineProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksPhaseLineCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

const MARKER: Record<HowItWorksPhaseTone, string> = {
  foreground: "bg-foreground",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

export function HowItWorksPhaseLine({ locale = "en", heading, description, phases, className, ...props }: HowItWorksPhaseLineProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = phases ?? copy.phases

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    const fills = revealTargets(node, "fill")
    fills.forEach((fill) => started.push(enter(fill, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 600 })))
    revealTargets(node, "marker").forEach((marker, index) =>
      started.push(enter(marker, [{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1.15)", offset: 0.7 }, { opacity: 1, transform: "scale(1)" }], { duration: 200, delay: 600 + index * 80 }))
    )
    revealTargets(node, "copy").forEach((copyBlock, index) =>
      started.push(enter(copyBlock, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: 640 + index * 80 }))
    )
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-start gap-4">
        <h2 id={headingId} className="text-3xl font-medium text-foreground [@container(min-width:64rem)]:text-4xl">
          {heading ?? copy.heading}
        </h2>
        <p className="max-w-[720px] text-base text-muted-foreground">{description ?? copy.description}</p>
      </header>

      <ol className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
        {list.map((phase, index) => (
          <li key={phase.id} className="group flex min-w-0 flex-col gap-4">
            <div aria-hidden="true" className="flex items-center gap-2">
              <span
                data-reveal="marker"
                className={cn("size-3 shrink-0 transition-transform duration-[160ms] group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100", MARKER[phase.tone])}
              />
              <span className="relative h-px flex-1 bg-border">
                {index === 0 ? <span data-reveal="fill" className="absolute inset-0 origin-left bg-foreground [&:dir(rtl)]:origin-right" /> : null}
              </span>
            </div>
            <div data-reveal="copy" className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground [&:dir(rtl)]:tracking-normal">
                <HowItWorksFigures>{phase.label}</HowItWorksFigures>
              </p>
              <h3 className="text-lg font-medium text-foreground">{phase.title}</h3>
              <p className="text-sm text-muted-foreground">{phase.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksPhaseLineCopy = COPY

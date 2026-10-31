"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  enter,
  HowItWorksEyebrow,
  HowItWorksFigures,
  HowItWorksHeader,
  HowItWorksImage,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Center Spine Timeline.
 *
 * A centred header (an eyebrow and the heading), then four weeks along a spine:
 * a 1px `border` line with a 24px node on it for each week, the week's copy on
 * one side and its photo on the other, alternating. Week 1's copy is at the
 * start, week 2's at the end, and so on.
 *
 * Desktop is the two-sided spine, in a 1248px column: copy and photo are 452px
 * wide, 40px from the spine, and each row is centred on its node. Tablet and
 * Mobile move the spine to a rail at the start (a 40px gutter, 32px on phones)
 * and stack each week: eyebrow, title, line, then the photo. The page's `dir`
 * mirrors every width, so in Arabic the sides swap and the rail is at the right.
 *
 * Motion plays once, when the block comes into view: the spine draws down from
 * its top (1.2s), each node pops as the line reaches it, then that week's copy
 * rises 16px and its photo slides 24px in towards the spine. Figma ties the
 * spine to the scroll position; the code draws it once and lets it rest, with no
 * scroll tracking. Phones skip the node pop, as Figma does. Under reduced motion
 * the block is its finished state.
 *
 * Content limits: the heading up to 56 characters. A week's eyebrow up to 16, its
 * title up to 32 and its line up to 120. Four weeks in Figma; two to six work.
 */

export interface HowItWorksSpineStep {
  /** Keys the week. */
  id: string
  /** The small line above the title, such as "Week 1". */
  eyebrow: string
  title: React.ReactNode
  body: React.ReactNode
}

export interface HowItWorksCenterSpineTimelineCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  steps: HowItWorksSpineStep[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksCenterSpineTimelineCopy> = {
  en: {
    eyebrow: "Project timeline",
    heading: "What the first four weeks actually look like",
    steps: [
      { id: "room", eyebrow: "Week 1", title: "Get everyone in one room", body: "Kickoff, constraints, and a shared list of what we are not doing. That last one saves the most time." },
      { id: "wireframe", eyebrow: "Week 2", title: "Wireframe the whole flow", body: "Every screen sketched at low fidelity, so gaps in the flow surface before anything looks finished." },
      { id: "screens", eyebrow: "Week 3", title: "Build the real screens", body: "Layouts move into the file and start carrying real content. Real content changes decisions, so it arrives early." },
      { id: "handover", eyebrow: "Week 4", title: "Review, refine, hand over", body: "A full walkthrough with the team, then a clean handover with the reasoning written down beside the work." },
    ],
  },
  ar: {
    eyebrow: "الجدول الزمني للمشروع",
    heading: "كيف تبدو الأسابيع الأربعة الأولى فعلًا",
    steps: [
      { id: "room", eyebrow: "الأسبوع 1", title: "اجمع الجميع في غرفة واحدة", body: "انطلاقة ومحدّدات وقائمة مشتركة بما لن نفعله. هذه القائمة الأخيرة هي التي توفّر أكبر وقت." },
      { id: "wireframe", eyebrow: "الأسبوع 2", title: "خطّط المسار كاملًا", body: "كل شاشة مرسومة بدقة منخفضة، فتظهر الفراغات في المسار قبل أن يبدو أي شيء مكتملًا." },
      { id: "screens", eyebrow: "الأسبوع 3", title: "ابنِ الشاشات الحقيقية", body: "تنتقل التخطيطات إلى الملف وتبدأ بحمل محتوى حقيقي. المحتوى الحقيقي يغيّر القرارات، لذلك يأتي مبكرًا." },
      { id: "handover", eyebrow: "الأسبوع 4", title: "راجِع، اصقُل، سلّم", body: "استعراض كامل مع الفريق، ثم تسليم نظيف مع تدوين المبرّرات جانب العمل." },
    ],
  },
}

export interface HowItWorksCenterSpineTimelineProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksCenterSpineTimelineCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * One photo per week, in order. A week without one shows a quiet `muted` box.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksCenterSpineTimeline({ locale = "en", eyebrow, heading, steps, photos, className, ...props }: HowItWorksCenterSpineTimelineProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    const spine = revealTargets(node, "spine")[0]
    const wide = (spine?.parentElement?.clientWidth ?? 0) >= 1024
    const phone = (spine?.parentElement?.clientWidth ?? 0) < 520
    const rtl = getComputedStyle(node).direction === "rtl"
    const total = 1200
    if (spine) {
      spine.style.transformOrigin = "top"
      started.push(enter(spine, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: total, easing: "ease-in-out" }))
    }
    const rows = revealTargets(node, "row")
    rows.forEach((row, index) => {
      // The line reaches a node about when the line has covered that row's share of the spine.
      const reached = ((index + 0.5) / rows.length) * total
      const dot = row.querySelector<HTMLElement>('[data-reveal="node"]')
      const words = row.querySelector<HTMLElement>('[data-reveal="copy"]')
      const photo = row.querySelector<HTMLElement>('[data-reveal="photo"]')
      if (dot && !phone) started.push(enter(dot, [{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1.2)", offset: 0.7 }, { opacity: 1, transform: "scale(1)" }], { duration: 300, delay: reached }))
      if (words) started.push(enter(words, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 450, delay: reached + 100 }))
      if (photo) {
        // On the wide spine a photo comes in towards it: from the outer side, which depends on the row and the direction.
        const fromEnd = index % 2 === 0 ? 1 : -1
        const x = wide ? 24 * fromEnd * (rtl ? -1 : 1) : 0
        const y = wide ? 0 : 16
        started.push(enter(photo, [{ opacity: 0, transform: `translate(${x}px, ${y}px)` }, { opacity: 1, transform: "none" }], { duration: 500, delay: reached + 150 }))
      }
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <HowItWorksHeader
        headingId={headingId}
        eyebrow={eyebrow ?? copy.eyebrow}
        heading={heading ?? copy.heading}
        className="items-center text-center"
        headingClassName="text-2xl [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
      />

      <div className="relative">
        {/* The spine: a rail at the start on phones and Tablet, down the middle from Desktop. */}
        <span
          aria-hidden="true"
          data-reveal="spine"
          className="absolute inset-y-0 start-4 w-px bg-border [@container(min-width:40rem)]:start-5 [@container(min-width:64rem)]:start-[calc(50%-0.5px)]"
        />
        <ol className="relative flex flex-col gap-10">
          {list.map((step, index) => {
            const copyFirst = index % 2 === 0
            return (
              <li key={step.id} data-reveal="row" className="relative ps-12 [@container(min-width:40rem)]:ps-14 [@container(min-width:64rem)]:grid [@container(min-width:64rem)]:grid-cols-[1fr_80px_1fr] [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:ps-0">
                <span
                  aria-hidden="true"
                  data-reveal="node"
                  className="absolute -top-1 start-1 flex size-6 items-center justify-center rounded-full border border-border bg-background [@container(min-width:40rem)]:start-2 [@container(min-width:64rem)]:static [@container(min-width:64rem)]:col-start-2 [@container(min-width:64rem)]:row-start-1 [@container(min-width:64rem)]:justify-self-center"
                >
                  <span className="size-2.5 rounded-full bg-primary" />
                </span>
                <div
                  className={cn(
                    "[@container(min-width:64rem)]:row-start-1 [@container(min-width:64rem)]:flex",
                    copyFirst
                      ? "[@container(min-width:64rem)]:col-start-1 [@container(min-width:64rem)]:justify-end [@container(min-width:64rem)]:pe-10 [@container(min-width:64rem)]:text-end"
                      : "[@container(min-width:64rem)]:col-start-3 [@container(min-width:64rem)]:justify-start [@container(min-width:64rem)]:ps-10"
                  )}
                >
                  <div data-reveal="copy" className="flex w-full flex-col gap-2 [@container(min-width:64rem)]:max-w-[452px]">
                    <HowItWorksEyebrow>
                      <HowItWorksFigures>{step.eyebrow}</HowItWorksFigures>
                    </HowItWorksEyebrow>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "mt-5 [@container(min-width:64rem)]:row-start-1 [@container(min-width:64rem)]:mt-0 [@container(min-width:64rem)]:flex",
                    copyFirst
                      ? "[@container(min-width:64rem)]:col-start-3 [@container(min-width:64rem)]:justify-start [@container(min-width:64rem)]:ps-10"
                      : "[@container(min-width:64rem)]:col-start-1 [@container(min-width:64rem)]:justify-end [@container(min-width:64rem)]:pe-10"
                  )}
                >
                  <div data-reveal="photo" className="relative h-[180px] w-full overflow-hidden rounded-[10px] bg-muted [@container(min-width:40rem)]:h-[240px] [@container(min-width:64rem)]:h-[268px] [@container(min-width:64rem)]:w-[452px]">
                    <HowItWorksImage photo={photos?.[Math.min(index, (photos?.length ?? 1) - 1)]} />
                  </div>
                </div>
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
export const howItWorksCenterSpineTimelineCopy = COPY

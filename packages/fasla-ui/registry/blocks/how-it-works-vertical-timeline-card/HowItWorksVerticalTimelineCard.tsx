"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Steps, StepsItem, type StepsProps } from "../../ui/steps/steps"
import {
  enter,
  HowItWorksEyebrow,
  HowItWorksImage,
  HowItWorksSection,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Vertical Timeline Card.
 *
 * One bordered card (`card`, 14px radius, 40px padding) holding an eyebrow, a
 * heading, a line, the Steps atom set vertically with round bullets and a link
 * at the foot, beside a 520px photo. The steps are the atom's: the first two
 * done, the third current, the fourth upcoming, so the line between two done
 * steps is `primary` and the rest is `border`.
 *
 * Desktop sets the card and the photo side by side, 64px apart, the photo as
 * tall as the card. Tablet stacks the photo under the card at 260px tall. Mobile
 * drops the photo and the card takes the column. The page's `dir` is all the
 * atom needs: it moves the bullets to the end and the labels flow the other way,
 * the photo moves to the start side, and the link's arrow is mirrored.
 *
 * Motion plays once, when the block comes into view: each tail draws down
 * (240ms) and the next step's bullet lands as it finishes, its label and line
 * rising 10px behind it. About 1.1s for four steps. Under reduced motion the
 * block is its finished state. Figma also fades the upcoming bullet to 40% as it
 * lands; the atom already draws an upcoming step in its own quiet colours, so the
 * code leaves that to the atom.
 *
 * Content limits: the heading up to 40 characters, the line up to 90. A step's
 * label up to 20 characters and its line up to 50. Four steps in Figma; two to
 * six work.
 */

export type HowItWorksTimelineStatus = "done" | "current" | "upcoming"

export interface HowItWorksTimelineStep {
  /** Keys the step. */
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  /** Which bullet the atom draws. */
  status: HowItWorksTimelineStatus
}

export interface HowItWorksVerticalTimelineCardCopy {
  eyebrow: React.ReactNode
  /** The card's heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  steps: HowItWorksTimelineStep[]
  /** The link at the card's foot. */
  action: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksVerticalTimelineCardCopy> = {
  en: {
    eyebrow: "How the process works",
    heading: "From first session to handover",
    description: "Four steps. The first two belong to design; the last two are shared with engineering.",
    steps: [
      { id: "align", label: "Align", description: "Everyone in one room, assumptions written down.", status: "done" },
      { id: "sketch", label: "Sketch", description: "The whole flow settled on paper.", status: "done" },
      { id: "design", label: "Design", description: "Screens built with real content.", status: "current" },
      { id: "handover", label: "Hand over", description: "Reasoning passed on with the work.", status: "upcoming" },
    ],
    action: "Read the full process",
  },
  ar: {
    eyebrow: "كيف تسير العملية",
    heading: "من الجلسة الأولى إلى التسليم",
    description: "أربع خطوات: الأولى والثانية للتصميم، والثالثة والرابعة مشتركة مع الهندسة.",
    steps: [
      { id: "align", label: "المواءمة", description: "الجميع في غرفة واحدة، والافتراضات مكتوبة.", status: "done" },
      { id: "sketch", label: "الرسم", description: "المسار كاملًا محسوم على الورق.", status: "done" },
      { id: "design", label: "التصميم", description: "شاشات مبنيّة بمحتوى حقيقي.", status: "current" },
      { id: "handover", label: "التسليم", description: "المبرّرات تُسلَّم مع العمل.", status: "upcoming" },
    ],
    action: "اقرأ العملية كاملة",
  },
}

export interface HowItWorksVerticalTimelineCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksVerticalTimelineCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * The photo beside the card, or under it on Tablet: the first one given. A
   * `muted` box shows without one.
   * @default none: a `muted` placeholder
   */
  photos?: HowItWorksPhoto[]
  /** Called when the link at the foot is pressed. */
  onAction?: () => void
  /** The Steps atom's bullet shape. */
  radius?: StepsProps["radius"]
}

export function HowItWorksVerticalTimelineCard({ locale = "en", eyebrow, heading, description, steps, action, photos, onAction, radius = "rounded", className, ...props }: HowItWorksVerticalTimelineCardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    const items = Array.from(node.querySelectorAll<HTMLElement>('[data-slot="steps-item"]'))
    const beat = 280
    items.forEach((item, index) => {
      const bullet = item.querySelector<HTMLElement>('[data-slot="step-icon"]')
      const tail = item.querySelector<HTMLElement>('[data-slot="step-tail"] > span')
      const words = item.querySelector<HTMLElement>('[data-slot="step-text"]')
      if (bullet) started.push(enter(bullet, [{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "scale(1.08)", offset: 0.7 }, { opacity: 1, transform: "scale(1)" }], { duration: 260, delay: index * beat }))
      if (words) started.push(enter(words, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: index * beat + 60 }))
      if (tail) {
        tail.style.transformOrigin = "top"
        started.push(enter(tail, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 240, delay: index * beat + 80 }))
      }
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-16">
        <div className="flex min-w-0 flex-col gap-8 rounded-[14px] border border-border bg-card p-6 [@container(min-width:40rem)]:p-10 [@container(min-width:64rem)]:flex-1 [@container(min-width:64rem)]:gap-8">
          <header className="flex flex-col items-start gap-3">
            <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
            <h2 id={headingId} className="text-xl font-semibold text-card-foreground [@container(min-width:40rem)]:text-2xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
          </header>
          <Steps orientation="vertical" radius={radius}>
            {list.map((step) => (
              <StepsItem key={step.id} status={step.status} label={step.label} description={step.description} />
            ))}
          </Steps>
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 self-start rounded-sm text-sm font-medium text-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:opacity-80"
          >
            {action ?? copy.action}
            <ArrowRight aria-hidden="true" className="size-4 [&:dir(rtl)]:-scale-x-100" />
          </button>
        </div>

        <div className="relative hidden h-[260px] w-full shrink-0 overflow-hidden rounded-[10px] bg-muted [@container(min-width:40rem)]:block [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:min-h-[548px] [@container(min-width:64rem)]:w-[520px]">
          <HowItWorksImage photo={photos?.[0]} />
        </div>
      </div>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksVerticalTimelineCardCopy = COPY

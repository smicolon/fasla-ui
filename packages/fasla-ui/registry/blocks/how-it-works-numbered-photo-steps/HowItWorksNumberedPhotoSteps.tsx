"use client"

import * as React from "react"
import { Badge } from "../../ui/badge/badge"
import {
  enter,
  HowItWorksHeader,
  HowItWorksImage,
  HowItWorksLtr,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Numbered Photo Steps.
 *
 * A left-aligned header (an eyebrow, the heading, a line), then four step
 * cards: a 288 × 320 photo with a solid number badge in its corner, a title
 * and a line under it. A step with no photo shows a quiet `muted` box.
 *
 * Desktop sets the cards four across, 32px apart. Tablet sets them two across,
 * in reading order. Mobile is one column with 220px photos. The page's `dir`
 * mirrors the order and the badge's corner, so step 01 sits at the start.
 *
 * Motion plays once, when the block comes into view: each card rises 16px and
 * fades in, 90ms apart in reading order, the photo inside settles from 106%
 * to 100% over 600ms, and the number badges land last with a small overshoot
 * (1 to 1.08 to 1). Cards lift on hover. Under reduced motion the block is its
 * finished state. Figma's Mobile reveals each card as it scrolls into view;
 * here every card plays its entrance once when the block does, the same at
 * every width.
 *
 * Content limits: the heading up to 56 characters, the line up to 150. A
 * step's title up to 28 and its line up to 110.
 */

export interface HowItWorksNumberedPhotoStep {
  /** Keys the step. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksNumberedPhotoStepsCopy {
  /** The small line above the heading. */
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The steps, in order. The numbers are drawn from 01. */
  steps: HowItWorksNumberedPhotoStep[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksNumberedPhotoStepsCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "From a blank wall to a shipped screen in four steps",
    description: "Every project runs the same way, so nobody has to ask what happens next. Four steps, and each one ends with something you can look at.",
    steps: [
      { id: "wall", title: "Start on the wall", description: "The problem goes up where everyone can see it — one room, one hour, and every assumption written down." },
      { id: "sketch", title: "Sketch before pixels", description: "Rough wireframes on paper first. They are quick to draw, quicker to discard, and they settle the layout early." },
      { id: "open", title: "Design in the open", description: "Screens go up on a shared board as they are built, so feedback arrives while it is still cheap to act on." },
      { id: "ship", title: "Review, then ship", description: "The whole team walks the final flow together before it goes out. Nothing ships on one person's opinion." },
    ],
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "من حائط فارغ إلى شاشة جاهزة في أربع خطوات",
    description: "كل مشروع يسير بالطريقة نفسها، فلا يحتاج أحد أن يسأل ما الخطوة التالية. أربع خطوات، وكل واحدة تنتهي بشيء يمكن النظر إليه.",
    steps: [
      { id: "wall", title: "ابدأ على الحائط", description: "تُعلَّق المشكلة حيث يراها الجميع: غرفة واحدة وساعة واحدة، وكل افتراض مكتوب." },
      { id: "sketch", title: "ارسم قبل البكسل", description: "مخطّطات أوّلية على الورق أولًا: سريعة الرسم وأسرع في التخلّص منها، وهي التي تحسم التخطيط مبكرًا." },
      { id: "open", title: "صمّم على المكشوف", description: "تُعرض الشاشات على لوح مشترك أثناء بنائها، فتصل الملاحظات وما زال تنفيذها رخيصًا." },
      { id: "ship", title: "راجِع ثم أطلِق", description: "يستعرض الفريق كامل المسار النهائي معًا قبل إطلاقه. لا شيء يُطلق برأي شخص واحد." },
    ],
  },
}

export interface HowItWorksNumberedPhotoStepsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksNumberedPhotoStepsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * One photo per step, in order. A step without one shows a `muted` box.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksNumberedPhotoSteps({ locale = "en", eyebrow, heading, description, steps, photos, className, ...props }: HowItWorksNumberedPhotoStepsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    revealTargets(node, "card").forEach((card, index) => {
      const delay = index * 90
      started.push(enter(card, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay }))
      const photo = card.querySelector<HTMLElement>('[data-reveal="photo"]')
      if (photo) started.push(enter(photo, [{ transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 600, delay }))
    })
    revealTargets(node, "badge").forEach((badge, index) =>
      started.push(enter(badge, [{ opacity: 0, transform: "scale(1)" }, { opacity: 1, transform: "scale(1.08)", offset: 0.6 }, { opacity: 1, transform: "scale(1)" }], { duration: 300, delay: list.length * 90 + 450 + index * 60 }))
    )
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <HowItWorksHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} descriptionClassName="max-w-none" />

      <ol className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
        {list.map((step, index) => (
          <li
            key={step.id}
            data-reveal="card"
            className="flex min-w-0 flex-col gap-5 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none hover:motion-reduce:translate-y-0"
          >
            <div className="relative h-[220px] overflow-hidden rounded-[10px] bg-muted [@container(min-width:40rem)]:h-[300px] [@container(min-width:64rem)]:h-80">
              <div data-reveal="photo" className="absolute inset-0">
                <HowItWorksImage photo={photos?.[index]} />
              </div>
              <span data-reveal="badge" className="absolute start-3 top-3">
                <Badge variant="solid" tone="primary" size="sm" radius="rounded">
                  <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
                </Badge>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
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
export const howItWorksNumberedPhotoStepsCopy = COPY

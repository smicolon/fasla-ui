"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  enter,
  HowItWorksEyebrow,
  HowItWorksImage,
  HowItWorksLtr,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Split Photo + Step List.
 *
 * A full-height photo beside a column of copy: an eyebrow, the heading, a line,
 * then four steps between hairlines. A step is a 32px number circle, a title
 * and a line. The active step's circle fills (`muted` to `primary`) and its
 * line goes from 60% to full strength; the photo cross-fades to that step's
 * photo, or stays on the first when the steps share one.
 *
 * Desktop sets the photo on the start side, 640px wide, and the copy beside it
 * on 96px padding. Tablet and Mobile stack the photo above the list (360px and
 * 240px tall). The page's `dir` puts the photo on the other side in Arabic.
 *
 * The block is a menu of steps: press, focus or hover a row to make it active.
 * Where Figma's motion card follows the scroll (a sticky photo, the step nearest
 * the middle of the window going active), the code does not: the photo is not
 * sticky and no step changes on scroll. The block's entrance plays once, when it
 * comes into view: the photo fades in and the rows rise 8px, 80ms apart. Under
 * reduced motion the block is its finished state and the cross-fade is a cut.
 *
 * Content limits: the heading up to 32 characters, the line up to 120. A
 * step's title up to 28 and its line up to 80.
 */

export interface HowItWorksSplitPhotoStepListStep {
  /** Keys the step. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksSplitPhotoStepListCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  /** The steps, in order. The numbers are drawn from 1. */
  steps: HowItWorksSplitPhotoStepListStep[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksSplitPhotoStepListCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "Four steps, one clear path",
    description: "This is the whole process. Anyone joining midway can read it in a minute and know exactly where things stand.",
    steps: [
      { id: "align", title: "Align on the problem", description: "One session, everything written down, nothing assumed." },
      { id: "sketch", title: "Sketch the flow", description: "Low fidelity first, so the structure is settled before the styling starts." },
      { id: "build", title: "Build the screens", description: "Real layouts with real content, all on a shared grid." },
      { id: "review", title: "Review and hand over", description: "A walkthrough together, then a handover that keeps the reasoning intact." },
    ],
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "أربع خطوات ومسار واضح",
    description: "هذه هي العملية بالكامل. من ينضم في منتصفها يقرأها في دقيقة ويعرف تمامًا أين وصلت الأمور.",
    steps: [
      { id: "align", title: "توافقوا على المشكلة", description: "جلسة واحدة، كل شيء مكتوب، ولا شيء مفترض." },
      { id: "sketch", title: "ارسم المسار", description: "دقة منخفضة أولًا، فيُحسم الهيكل قبل أن يبدأ التنسيق." },
      { id: "build", title: "ابنِ الشاشات", description: "تخطيطات حقيقية بمحتوى حقيقي، كلها على شبكة مشتركة." },
      { id: "review", title: "راجِع وسلّم", description: "استعراض مشترك، ثم تسليم يحفظ المبرّرات كما هي." },
    ],
  },
}

export interface HowItWorksSplitPhotoStepListProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksSplitPhotoStepListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * The photo beside the list: one for all the steps, or one per step to
   * cross-fade between. A `muted` placeholder shows without any.
   * @default none: a `muted` placeholder
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksSplitPhotoStepList({ locale = "en", eyebrow, heading, description, steps, photos, className, ...props }: HowItWorksSplitPhotoStepListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps
  const [active, setActive] = React.useState(0)

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    revealTargets(node, "photo").forEach((photo) => started.push(enter(photo, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 })))
    revealTargets(node, "row").forEach((row, index) =>
      started.push(enter(row, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 150 + index * 80 }))
    )
    return started
  })

  const shown = photos && photos.length > 0 ? photos : undefined
  return (
    <section
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background", className)}
      {...props}
    >
      <div className="flex flex-col [@container(min-width:64rem)]:flex-row">
        <div data-reveal="photo" className="relative h-60 w-full shrink-0 overflow-hidden bg-muted [@container(min-width:40rem)]:h-[360px] [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:w-[640px]">
          {shown
            ? shown.map((photo, index) => (
                <div
                  key={photo.src + index}
                  aria-hidden={index !== Math.min(active, shown.length - 1)}
                  className={cn("absolute inset-0 transition-opacity duration-[400ms] ease-out motion-reduce:transition-none", index === Math.min(active, shown.length - 1) ? "opacity-100" : "opacity-0")}
                >
                  <HowItWorksImage photo={photo} />
                </div>
              ))
            : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-12 p-8 md:p-16 lg:p-24">
          <header className="flex flex-col items-start gap-3">
            <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </header>
          <ol className="flex flex-col">
            {list.map((step, index) => {
              const on = index === active
              return (
                <li key={step.id} data-reveal="row" className="border-t border-border last:border-b">
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    className="flex w-full items-start gap-4 rounded-md py-5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 motion-reduce:transition-none",
                        on ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      <HowItWorksLtr>{index + 1}</HowItWorksLtr>
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-base font-medium text-foreground">{step.title}</span>
                      <span className={cn("text-sm text-muted-foreground transition-opacity duration-200 motion-reduce:transition-none", on ? "opacity-100" : "opacity-60")}>{step.description}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksSplitPhotoStepListCopy = COPY

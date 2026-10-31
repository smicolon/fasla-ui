"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import {
  enter,
  HowItWorksEyebrow,
  HowItWorksImage,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Accordion Steps.
 *
 * A header (an eyebrow and the heading, with a line at its end), then the
 * Accordion atom with the plus and minus mark and five steps, beside a 480 × 420
 * photo. One step is open at a time, the first at first; opening another closes
 * the open one. The photo cross-fades to the open step's, or stays on the last
 * one when every step is closed.
 *
 * Desktop sets a 704px accordion and the photo beside it. Tablet stacks the photo
 * under the accordion at 260px tall, and Mobile drops the photo and lets the
 * accordion take the column. The page's `dir` is all the accordion needs: it
 * puts the mark at the other end by itself.
 *
 * Motion: the open step's panel grows and the closing one shuts as a real height
 * change (the atom's 180ms), the plus turns into a minus, and the photo
 * cross-fades over 320ms. The block's entrance plays once: the rows rise 8px,
 * 70ms apart. Under reduced motion the panels open at once and the photo cuts.
 * Figma's card also fades the body in 60ms behind the height; the atom's panel
 * has no such delay, so the two arrive together.
 *
 * Content limits: five steps in Figma; any number from two to eight works. The
 * heading up to 40 characters, the line up to 70. A step's title up to 44
 * characters and its body up to 220. Figma draws only the first step's body;
 * the other four are written for the code.
 */

export interface HowItWorksAccordionStep {
  /** Keys the step. */
  id: string
  /** The row's title, such as "01 — Get the problem onto one wall". */
  title: React.ReactNode
  body: React.ReactNode
}

export interface HowItWorksAccordionStepsCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  steps: HowItWorksAccordionStep[]
}

/** Figma's copy for the first step, English and Arabic, and copy for the other four. */
const COPY: Record<HowItWorksLocale, HowItWorksAccordionStepsCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "Open a step to see what it involves",
    description: "Five steps, and the detail stays out of the way until you ask for it.",
    steps: [
      {
        id: "wall",
        title: "01 — Get the problem onto one wall",
        body: "One session with everyone who has a stake. Constraints, assumptions and open questions all go up where they can be argued with, and we leave with a written list of what is out of scope.",
      },
      {
        id: "paper",
        title: "02 — Sketch the flow on paper",
        body: "Boxes and arrows on paper or a board, every screen in order and nothing styled. It is the cheapest place to find that two screens do the same job, or that one is missing.",
      },
      {
        id: "grid",
        title: "03 — Build the screens on a shared grid",
        body: "Real layouts with real words and real numbers, all on one grid. Every state is drawn, not only the happy one, so the design is tested against what it will hold.",
      },
      {
        id: "team",
        title: "04 — Walk the flow with the team",
        body: "The whole team goes through the flow on one call and says what is unclear. Questions are written down beside the screen they belong to, not carried away in someone's head.",
      },
      {
        id: "handover",
        title: "05 — Hand over with the reasoning intact",
        body: "The flow passes to whoever builds it, with the notes that explain each decision. They can tell what was decided and why, without asking the person who drew it.",
      },
    ],
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "افتح خطوة لترى ما تتضمّنه",
    description: "خمس خطوات، وتبقى التفاصيل بعيدة عن الطريق حتى تطلبها.",
    steps: [
      {
        id: "wall",
        title: "01 — ضع المشكلة على حائط واحد",
        body: "جلسة واحدة تحضرها كل الأطراف المعنيّة. تُعلَّق المحدّدات والافتراضات والأسئلة المفتوحة حيث يمكن مناقشتها، ونخرج بقائمة مكتوبة بما هو خارج النطاق.",
      },
      {
        id: "paper",
        title: "02 — ارسم المسار على الورق",
        body: "مربعات وأسهم على ورقة أو لوح، وكل شاشة بترتيبها دون أي تنسيق. هو أرخص مكان لتكتشف أن شاشتين تؤديان العمل نفسه، أو أن إحداهما ناقصة.",
      },
      {
        id: "grid",
        title: "03 — ابنِ الشاشات على شبكة مشتركة",
        body: "تخطيطات حقيقية بكلمات وأرقام حقيقية، كلها على شبكة واحدة. كل حالة مرسومة لا الحالة المثالية وحدها، فيُختبر التصميم بما سيحمله.",
      },
      {
        id: "team",
        title: "04 — استعرض المسار مع الفريق",
        body: "يستعرض الفريق كله المسار في مكالمة واحدة ويقول ما هو غير واضح. تُدوَّن الأسئلة بجانب الشاشة التي تخصها، لا في رأس أحدهم.",
      },
      {
        id: "handover",
        title: "05 — سلّم مع حفظ المبرّرات",
        body: "ينتقل المسار إلى من يبنيه، مع الملاحظات التي تشرح كل قرار. يعرف ما تقرّر ولماذا دون أن يسأل من رسمه.",
      },
    ],
  },
}

export interface HowItWorksAccordionStepsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksAccordionStepsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * One photo per step, in order; the last one stays when every step is closed.
   * A box without one is a quiet `muted` one.
   * @default none: a `muted` placeholder
   */
  photos?: HowItWorksPhoto[]
  /** The id of the step open at first. */
  defaultStep?: string
  /** Called with the id of the open step, or `null` when every step is closed. */
  onStepChange?: (id: string | null) => void
}

export function HowItWorksAccordionSteps({ locale = "en", eyebrow, heading, description, steps, photos, defaultStep, onStepChange, className, ...props }: HowItWorksAccordionStepsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = steps ?? copy.steps
  const [open, setOpen] = React.useState<string[]>([defaultStep ?? list[0]?.id ?? ""])
  const [shownIndex, setShownIndex] = React.useState(Math.max(0, list.findIndex((step) => step.id === (defaultStep ?? list[0]?.id))))

  useRevealOnEnter(rootRef, (node) =>
    revealTargets(node, "row").map((row, index) => enter(row, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: index * 70 }))
  )

  const hasPhotos = !!photos && photos.length > 0
  const photoIndex = hasPhotos ? Math.min(shownIndex, photos!.length - 1) : 0
  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-24">
        <div className="flex flex-col items-start gap-3">
          <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </div>
        <p className="text-base text-muted-foreground [@container(min-width:64rem)]:w-[360px] [@container(min-width:64rem)]:shrink-0">{description ?? copy.description}</p>
      </header>

      <div className="flex flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-16">
        <Accordion
          indicator="plus"
          value={open}
          onValueChange={(next) => {
            const value = next as string[]
            setOpen(value)
            const id = value[0] ?? null
            if (id !== null) setShownIndex(Math.max(0, list.findIndex((step) => step.id === id)))
            onStepChange?.(id)
          }}
          className="min-w-0 flex-1"
        >
          {list.map((step) => (
            <AccordionItem key={step.id} value={step.id} data-reveal="row">
              <AccordionTrigger>{step.title}</AccordionTrigger>
              <AccordionContent>{step.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div
          className={cn(
            "relative hidden w-full shrink-0 overflow-hidden rounded-[10px] bg-muted [@container(min-width:40rem)]:block [@container(min-width:40rem)]:h-[260px] [@container(min-width:64rem)]:h-[420px] [@container(min-width:64rem)]:w-[480px]"
          )}
          aria-hidden={hasPhotos ? undefined : true}
        >
          {hasPhotos
            ? photos!.map((photo, index) => (
                <div key={photo.src + index} aria-hidden={index !== photoIndex} className={cn("absolute inset-0 transition-opacity duration-[320ms] ease-out motion-reduce:transition-none", index === photoIndex ? "opacity-100" : "opacity-0")}>
                  <HowItWorksImage photo={photo} />
                </div>
              ))
            : null}
        </div>
      </div>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksAccordionStepsCopy = COPY

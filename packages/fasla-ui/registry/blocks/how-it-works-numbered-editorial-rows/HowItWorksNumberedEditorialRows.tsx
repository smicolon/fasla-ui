"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { countUp, enter, HowItWorksEyebrow, HowItWorksRule, HowItWorksSection, revealTargets, useRevealOnEnter, type Cancellable, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Numbered Editorial Rows.
 *
 * A left-aligned header (an eyebrow, a heading, a line), then a list of rows
 * between hairlines. A row is a light numeral, a title and a line, and on
 * Desktop they sit in three columns (96, 360 and the rest, 64px apart). Tablet
 * keeps the numeral in its own 64px column with the title and line stacked
 * beside it. Mobile stacks all three. The page's `dir` mirrors the columns.
 *
 * Motion plays once, when the block comes into view: each hairline draws in
 * from its start edge (400ms) while its row fades up 12px, the rows 90ms
 * apart, and each numeral counts up from 0 over 500ms. Hovering a row shifts
 * it 6px toward the end. Under reduced motion the block is its finished state.
 * Figma has the numeral go from muted to primary on hover; it is already
 * primary at rest in Figma's frame, so only the shift stays.
 *
 * Content limits: four rows in Figma; any number works. A title up to 24
 * characters and its line up to 200. The heading up to 40, the line up to 90.
 */

export interface HowItWorksNumberedEditorialRow {
  /** Keys the row. */
  id: string
  /** The row's title. */
  title: React.ReactNode
  /** The line beside, or under, the title. */
  description: React.ReactNode
}

export interface HowItWorksNumberedEditorialRowsCopy {
  /** The small line above the heading. */
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The rows, in order. The numbers are drawn from 1. */
  rows: HowItWorksNumberedEditorialRow[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksNumberedEditorialRowsCopy> = {
  en: {
    eyebrow: "Our process",
    heading: "Four steps, spelled out",
    description: "No diagram and no metaphor. This is the order the work actually happens in.",
    rows: [
      {
        id: "align",
        title: "Align",
        description: "One session with everyone who has a stake. Constraints, assumptions and open questions go up on the wall, and we leave with a written list of what is out of scope.",
      },
      {
        id: "sketch",
        title: "Sketch",
        description: "The whole flow at low fidelity, on paper. Screens are quick to draw and quicker to discard, which is exactly why the structure gets settled here rather than later.",
      },
      {
        id: "design",
        title: "Design",
        description: "Layouts move into the file with real content on a shared grid. Real content changes decisions, so it arrives early rather than at the end.",
      },
      {
        id: "hand-over",
        title: "Hand over",
        description: "A walkthrough together, then a handover that carries the reasoning and not just the screens.",
      },
    ],
  },
  ar: {
    eyebrow: "طريقة عملنا",
    heading: "أربع خطوات، مشروحة",
    description: "لا مخطّط ولا استعارة. هذا هو الترتيب الذي يجري به العمل فعلًا.",
    rows: [
      {
        id: "align",
        title: "المواءمة",
        description: "جلسة واحدة تحضرها كل الأطراف المعنيّة. تُعلَّق المحدّدات والافتراضات والأسئلة المفتوحة على الحائط، ونخرج بقائمة مكتوبة بما هو خارج النطاق.",
      },
      {
        id: "sketch",
        title: "الرسم",
        description: "المسار كاملًا بدقة منخفضة على الورق. الشاشات سريعة الرسم وأسرع في التخلّص منها، ولهذا يُحسم الهيكل هنا لا لاحقًا.",
      },
      {
        id: "design",
        title: "التصميم",
        description: "تنتقل التخطيطات إلى الملف بمحتوى حقيقي على شبكة مشتركة. المحتوى الحقيقي يغيّر القرارات، لذلك يأتي مبكرًا لا في النهاية.",
      },
      {
        id: "hand-over",
        title: "التسليم",
        description: "استعراض مشترك، ثم تسليم يحمل المبرّرات لا الشاشات وحدها.",
      },
    ],
  },
}

export interface HowItWorksNumberedEditorialRowsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksNumberedEditorialRowsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

export function HowItWorksNumberedEditorialRows({ locale = "en", eyebrow, heading, description, rows, className, ...props }: HowItWorksNumberedEditorialRowsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = rows ?? copy.rows

  useRevealOnEnter(rootRef, (node) => {
    const started: Cancellable[] = []
    const items = revealTargets(node, "row")
    const rules = revealTargets(node, "rule")
    rules.forEach((rule, index) => started.push(enter(rule, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 400, delay: index * 90 })))
    items.forEach((row, index) => {
      started.push(enter(row, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: index * 90 }))
      const count = row.querySelector<HTMLElement>('[data-reveal="count"]')
      if (count) started.push(countUp(count, index + 1, 500, index * 90))
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-start gap-3">
        <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
        <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-5xl">
          {heading ?? copy.heading}
        </h2>
        <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
      </header>

      <ol className="flex flex-col">
        {[...list, null].map((row, index) => (
          <React.Fragment key={row ? row.id : "end"}>
            <li aria-hidden="true" role="presentation" className="origin-left [&:dir(rtl)]:origin-right" data-reveal="rule">
              <HowItWorksRule />
            </li>
            {row ? (
              <li
                data-reveal="row"
                className={cn(
                  "flex flex-col gap-2 py-8 transition-transform duration-200 hover:translate-x-1.5 hover:[&:dir(rtl)]:-translate-x-1.5 motion-reduce:transition-none hover:motion-reduce:translate-x-0",
                  "[@container(min-width:40rem)]:grid [@container(min-width:40rem)]:grid-cols-[64px_1fr] [@container(min-width:40rem)]:gap-x-8 [@container(min-width:40rem)]:py-6",
                  "[@container(min-width:64rem)]:grid-cols-[96px_360px_1fr] [@container(min-width:64rem)]:gap-x-16 [@container(min-width:64rem)]:py-8"
                )}
              >
                <span
                  data-reveal="count"
                  className="text-2xl font-light leading-none text-primary [@container(min-width:40rem)]:row-span-2 [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:row-span-1 [@container(min-width:64rem)]:text-5xl"
                >
                  {index + 1}
                </span>
                <h3 className="text-xl text-foreground [@container(min-width:40rem)]:text-2xl [@container(min-width:64rem)]:text-3xl">{row.title}</h3>
                <p className="text-base text-muted-foreground [@container(min-width:40rem)]:col-start-2 [@container(min-width:64rem)]:col-start-3 [@container(min-width:64rem)]:row-start-1">
                  {row.description}
                </p>
              </li>
            ) : null}
          </React.Fragment>
        ))}
      </ol>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksNumberedEditorialRowsCopy = COPY

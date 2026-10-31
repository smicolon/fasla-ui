"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
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
 * Figma: `How it Works` (42334:294272), Type=Diagonal Photo Collage.
 *
 * A collage of three tilted photos beside the copy: an eyebrow, the heading, a
 * line, and three numbered habits between hairlines. A habit is a numeral, a
 * title and a line.
 *
 * Desktop sets the collage at the start, 592 × 540: a tall photo tilted -3°, a
 * small one at the top tilted 5° and a third at the foot tilted -6°, so the
 * stack fans away from the text. Tablet flattens it to an untilted pair above
 * the list, and Mobile keeps one 240px photo. The page's `dir` moves the
 * collage to the other side and turns each tilt the other way.
 *
 * Motion plays once, when the block comes into view: the photos rise 24px and
 * ease from flat into their tilt, 100ms apart. Hovering a habit moves it 4px
 * toward the end and turns its numeral from `muted-foreground` to `primary`
 * (180ms). Under reduced motion the block is its finished state. Figma's card
 * also moves the three photos at different speeds as the page scrolls and eases
 * the tilt as it passes; the code has no scroll-linked motion, so the collage
 * rests at its tilt.
 *
 * Content limits: the heading up to 46 characters, the line up to 80. A
 * habit's title up to 28 characters and its line up to 120.
 */

export interface HowItWorksDiagonalHabit {
  /** Keys the habit. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksDiagonalPhotoCollageCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  /** The habits, in order. The numerals are drawn from 01. */
  habits: HowItWorksDiagonalHabit[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksDiagonalPhotoCollageCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "Three habits that keep a project on the rails",
    description: "The teams that move fastest all do the same three things in the first week.",
    habits: [
      { id: "sketch", title: "Sketch before you commit", description: "Draw the flow on paper until it stops changing. Paper is the cheapest place in the whole project to be wrong." },
      { id: "decide", title: "Decide once, write it down", description: "Every decision gets a line of reasoning beside it, so it does not quietly get reopened three months later." },
      { id: "open", title: "Work in the open", description: "Put screens up while they are still rough. Feedback on a finished screen arrives too late to use." },
    ],
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "ثلاث عادات تُبقي المشروع على مساره",
    description: "الفرق الأسرع حركة تفعل الأمور الثلاثة نفسها في الأسبوع الأول.",
    habits: [
      { id: "sketch", title: "ارسم قبل أن تلتزم", description: "ارسم المسار على الورق حتى يتوقف عن التغيّر. الورق هو أرخص مكان في المشروع كله لتكون مخطئًا فيه." },
      { id: "decide", title: "قرّر مرة واحدة ودوّنه", description: "كل قرار يُرفق بسطر يشرح مبرّره، فلا يُعاد فتحه بهدوء بعد ثلاثة أشهر." },
      { id: "open", title: "اعمل على المكشوف", description: "اعرض الشاشات وهي ما زالت أوّلية. الملاحظات على شاشة مكتملة تصل متأخرة جدًا للاستفادة منها." },
    ],
  },
}

/** Where each collage photo sits in the 592 × 540 box, its size and its tilt: Figma's. */
const COLLAGE = [
  { left: 0, top: 90, width: 300, height: 380, tilt: "-rotate-[3deg] [&:dir(rtl)]:rotate-[3deg]" },
  { left: 300, top: 0, width: 250, height: 190, tilt: "rotate-[5deg] [&:dir(rtl)]:-rotate-[5deg]" },
  { left: 318, top: 250, width: 262, height: 250, tilt: "-rotate-[6deg] [&:dir(rtl)]:rotate-[6deg]" },
] as const

export interface HowItWorksDiagonalPhotoCollageProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksDiagonalPhotoCollageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * Three photos, in order: the tall one, the small one at the top and the one
   * at the foot. Tablet shows the first two, Mobile the first. Missing ones are
   * `muted` boxes.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksDiagonalPhotoCollage({ locale = "en", eyebrow, heading, description, habits, photos, className, ...props }: HowItWorksDiagonalPhotoCollageProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = habits ?? copy.habits

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    revealTargets(node, "photo").forEach((photo, index) => {
      const rest = getComputedStyle(photo).transform
      const end = rest && rest !== "none" ? rest : "none"
      started.push(enter(photo, [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: end }], { duration: 700, delay: (index % 3) * 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }))
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-12 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-16">
        {/* Desktop: the fanned collage. */}
        <div aria-hidden="true" className="relative hidden h-[540px] w-[592px] shrink-0 [@container(min-width:64rem)]:block">
          {COLLAGE.map((place, index) => (
            <div
              key={index}
              data-reveal="photo"
              className={cn("absolute overflow-hidden rounded-[10px] bg-muted", place.tilt)}
              style={{ insetInlineStart: place.left, top: place.top, width: place.width, height: place.height }}
            >
              <HowItWorksImage photo={photos?.[index]} />
            </div>
          ))}
        </div>
        {/* Tablet: an untilted pair. Mobile: the first photo alone. */}
        <div aria-hidden="true" className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:hidden">
          {[0, 1].map((index) => (
            <div key={index} data-reveal="photo" className={cn("relative h-60 overflow-hidden rounded-[10px] bg-muted [@container(min-width:40rem)]:h-[260px]", index === 1 && "hidden [@container(min-width:40rem)]:block")}>
              <HowItWorksImage photo={photos?.[index]} />
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <HowItWorksHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} headingClassName="text-2xl [@container(min-width:40rem)]:text-2xl [@container(min-width:64rem)]:text-4xl" />
          <ol className="flex flex-col">
            {list.map((habit, index) => (
              <li
                key={habit.id}
                className="group flex items-start gap-5 border-t border-border py-5 transition-transform duration-[180ms] last:border-b hover:translate-x-1 hover:[&:dir(rtl)]:-translate-x-1 motion-reduce:transition-none hover:motion-reduce:translate-x-0"
              >
                <span className="w-12 shrink-0 text-2xl font-light leading-8 text-muted-foreground transition-colors duration-[180ms] group-hover:text-primary motion-reduce:transition-none">
                  <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="text-lg font-medium text-foreground">{habit.title}</h3>
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksDiagonalPhotoCollageCopy = COPY

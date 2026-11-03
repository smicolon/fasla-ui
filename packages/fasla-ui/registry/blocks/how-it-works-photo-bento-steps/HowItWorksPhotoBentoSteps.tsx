"use client"

import * as React from "react"
import {
  enter,
  HowItWorksHeader,
  HowItWorksImage,
  HowItWorksLtr,
  HowItWorksScrim,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Photo Bento Steps.
 *
 * A left-aligned header, then a bento: one large photo card for the long first
 * step (a numeral, a title and a line at its foot, on a dark scrim), and three
 * small cards for the quick steps that follow, each a thumbnail beside a
 * number, a title and a line. The feature card's scrim is a stack of flat
 * `base-black` layers and its text `base-white`, the same in Light and in Dark.
 *
 * Desktop sets the feature card 616px wide beside a column of the small cards.
 * Tablet puts the feature card full width above the small cards, three across
 * with their thumbnails on top. Mobile keeps the feature card at 320px tall and
 * turns each small card into a full-width row with a 96px thumbnail. The page's
 * `dir` swaps the sides and the thumbnail's side in each row.
 *
 * Motion plays once, when the block comes into view: the feature card opens
 * from its start edge (520ms) while its photo settles from 105% to 100%, then
 * the small cards rise 14px, 70ms apart. Hovering a small card raises its shadow
 * from `sm` to `md` and slides its thumbnail 4px (200ms). Under reduced motion
 * the block is its finished state. Figma's Mobile fades the feature card in
 * instead of opening it; here it opens at every width.
 *
 * Content limits: the heading up to 40 characters, the line up to 70. The
 * feature card's title up to 56 characters and its line up to 150; a small
 * card's title up to 26 and its line up to 50.
 */

export interface HowItWorksBentoStep {
  /** Keys the step. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksPhotoBentoStepsCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  /** The long first step, on the feature card. */
  feature: HowItWorksBentoStep
  /** The quick steps after it, on the small cards. The numbers carry on from 02. */
  steps: HowItWorksBentoStep[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksPhotoBentoStepsCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "One long step, then three short ones",
    description: "The first step takes a week. The three after it take a day each.",
    feature: {
      id: "sketch",
      title: "Sketch the entire flow before opening the design file",
      description: "Every screen, at low fidelity, in order. It is the one step where being fast matters more than being neat — and it is where most of the thinking happens.",
    },
    steps: [
      { id: "cluster", title: "Cluster the research", description: "Notes grouped until the themes appear." },
      { id: "design", title: "Design on a shared grid", description: "Real layouts carrying real content." },
      { id: "handover", title: "Hand over to build", description: "Straight into the codebase, reasoning included." },
    ],
  },
  ar: {
    eyebrow: "كيف نعمل",
    heading: "خطوة طويلة واحدة، ثم ثلاث قصيرة",
    description: "الخطوة الأولى تستغرق أسبوعًا، والثلاث التي تليها يومًا لكل واحدة.",
    feature: {
      id: "sketch",
      title: "ارسم المسار كاملًا قبل فتح ملف التصميم",
      description: "كل شاشة، بدقة منخفضة، بالترتيب. هي الخطوة الوحيدة التي تُهمّ فيها السرعة أكثر من الإتقان، وفيها يحدث معظم التفكير.",
    },
    steps: [
      { id: "cluster", title: "اجمع نتائج البحث", description: "ملاحظات مجمّعة حتى تظهر المحاور." },
      { id: "design", title: "صمّم على شبكة مشتركة", description: "تخطيطات حقيقية تحمل محتوى حقيقيًا." },
      { id: "handover", title: "سلّم إلى التنفيذ", description: "مباشرة إلى قاعدة الكود، مع المبرّرات." },
    ],
  },
}

export interface HowItWorksPhotoBentoStepsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksPhotoBentoStepsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * The photos, in order: the feature card's, then each small card's. A card
   * without one shows a `muted` box.
   * @default none: `muted` placeholders
   */
  photos?: HowItWorksPhoto[]
}

export function HowItWorksPhotoBentoSteps({ locale = "en", eyebrow, heading, description, feature, steps, photos, className, ...props }: HowItWorksPhotoBentoStepsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const big = feature ?? copy.feature
  const small = steps ?? copy.steps

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    const rtl = getComputedStyle(node).direction === "rtl"
    revealTargets(node, "feature").forEach((card) => {
      started.push(enter(card, [{ clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }))
      const photo = card.querySelector<HTMLElement>('[data-reveal="feature-photo"]')
      if (photo) started.push(enter(photo, [{ transform: "scale(1.05)" }, { transform: "scale(1)" }], { duration: 520 }))
    })
    revealTargets(node, "card").forEach((card, index) =>
      started.push(enter(card, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 450 + index * 70 }))
    )
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <HowItWorksHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} headingClassName="text-2xl [@container(min-width:40rem)]:text-4xl [@container(min-width:64rem)]:text-4xl" descriptionClassName="max-w-none" />

      <div className="flex flex-col gap-6 [@container(min-width:64rem)]:flex-row">
        <article data-reveal="feature" className="group relative flex h-80 min-w-0 flex-col justify-end overflow-hidden rounded-[10px] bg-muted p-6 [@container(min-width:40rem)]:h-[400px] [@container(min-width:64rem)]:h-[520px] [@container(min-width:64rem)]:w-[616px] [@container(min-width:64rem)]:shrink-0">
          <div data-reveal="feature-photo" className="absolute inset-0">
            <HowItWorksImage photo={photos?.[0]} />
          </div>
          <HowItWorksScrim className="[&>span:first-child]:group-hover:bg-base-black/[0.28]" />
          <div className="relative flex flex-col gap-2 text-base-white">
            <span className="text-4xl font-semibold leading-none [@container(min-width:40rem)]:text-5xl">
              <HowItWorksLtr>01</HowItWorksLtr>
            </span>
            <h3 className="text-lg font-semibold [@container(min-width:40rem)]:text-xl">{big.title}</h3>
            <p className="max-w-[568px] text-sm text-base-white/85">{big.description}</p>
          </div>
        </article>

        <ol className="grid min-w-0 flex-1 grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-1">
          {small.map((step, index) => (
            <li
              key={step.id}
              data-reveal="card"
              className="group flex gap-4 rounded-[10px] border border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none [@container(min-width:40rem)]:flex-col [@container(min-width:64rem)]:flex-row"
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[123px] [@container(min-width:40rem)]:w-full [@container(min-width:64rem)]:w-[168px]">
                <div className="absolute inset-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:[&:dir(rtl)]:-translate-x-1 motion-reduce:transition-none group-hover:motion-reduce:translate-x-0">
                  <HowItWorksImage photo={photos?.[index + 1]} className="scale-110" />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <span className="text-xs font-medium text-primary">
                  <HowItWorksLtr>{String(index + 2).padStart(2, "0")}</HowItWorksLtr>
                </span>
                <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksPhotoBentoStepsCopy = COPY

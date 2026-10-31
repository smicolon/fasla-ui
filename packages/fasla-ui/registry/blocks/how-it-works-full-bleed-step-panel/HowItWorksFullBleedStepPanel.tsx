"use client"

import * as React from "react"
import { CircleCheck } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  EASE_OUT,
  HowItWorksEyebrow,
  HowItWorksImage,
  HowItWorksSection,
  prefersReducedMotion,
  type HowItWorksLocale,
  type HowItWorksPhoto,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Full-Bleed Step Panel.
 *
 * An eyebrow line with a row of step dots at its end, then one wide `muted`
 * panel showing a step at a time: an oversized numeral, a meta line, the title,
 * a paragraph, four ticked points and two buttons, beside a 560 × 440 photo.
 * The dots, the arrow keys and Home and End move between steps.
 *
 * Desktop sets the copy on the start side and the photo at the end. Tablet and
 * Mobile put the photo above the copy (360px and 240px tall) and step the
 * numeral down to 5XL and 4XL. The page's `dir` mirrors the panel and the dots,
 * so step 1 is at the start, and the arrow keys follow the reading direction.
 *
 * A step change fades the copy out and in (a 12px slide, 280ms), the numeral
 * rises into place, and the photo cross-fades (400ms, settling from 103%).
 * Under reduced motion a step is an instant swap. Figma's card also has the
 * panel change by itself every 7s and the numeral roll like a counter; the
 * code has no autoplay (a step changes only when asked) and the numeral
 * rises rather than rolls.
 *
 * Content limits: four steps in Figma; any number from two to six works. A
 * title up to 44 characters, the paragraph up to 170, a point up to 40.
 * Figma draws only step one; steps two to four are written for the code.
 */

export interface HowItWorksFullBleedStep {
  /** Keys the step. */
  id: string
  /** The small uppercase line, such as "Step one — set up the file". */
  meta: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  /** The ticked points. Up to four. */
  points: React.ReactNode[]
}

export interface HowItWorksFullBleedStepPanelCopy {
  /** The small line at the start of the top row, which also names the section. */
  eyebrow: React.ReactNode
  steps: HowItWorksFullBleedStep[]
  /** The two buttons' labels, the first solid and the second outline. */
  primaryAction: string
  secondaryAction: string
  /** The accessible name of the step dots, such as "Steps". */
  stepsLabel: string
  /** Names one step's dot, such as "Step 2 of 4": `{n}` and `{total}` stand for the numbers. */
  stepLabel: string
}

/** Figma's copy for step one, English and Arabic, and generic copy for the other three. */
const COPY: Record<HowItWorksLocale, HowItWorksFullBleedStepPanelCopy> = {
  en: {
    eyebrow: "How it works",
    steps: [
      {
        id: "file",
        meta: "Step one — set up the file",
        title: "Start from a file the whole team can read",
        description: "One structure, named the same way every time. New people find things without asking, and nothing gets rebuilt because someone could not find it.",
        points: ["One page per flow, kept in order", "Every screen named, not numbered", "Decisions noted beside the work", "Light and dark set up from the start"],
      },
      {
        id: "sketch",
        meta: "Step two — sketch the flow",
        title: "Draw the whole flow before you style any of it",
        description: "Boxes and arrows, on paper or on a board. It is the cheapest place to find that two screens do the same job, or that one is missing.",
        points: ["Every screen, in order", "Dead ends marked early", "One owner for each decision", "Nothing styled yet"],
      },
      {
        id: "build",
        meta: "Step three — build the screens",
        title: "Build with real content on a shared grid",
        description: "Real words and real numbers change the layout, so they go in early. Everyone builds on the same grid, so the screens fit together without a clean-up pass.",
        points: ["Real copy from the first draft", "One grid and one type scale", "Every state drawn, not just the happy one", "Both directions checked as you go"],
      },
      {
        id: "handover",
        meta: "Step four — hand over",
        title: "Hand over the reasoning, not only the screens",
        description: "Walk the flow together, then pass it on with the notes that explain it. Whoever builds it next can tell what was decided and why.",
        points: ["A walkthrough with the whole team", "Notes kept beside each screen", "Open questions listed, not buried", "Nothing ships on one person's opinion"],
      },
    ],
    primaryAction: "See the process",
    secondaryAction: "Read the guide",
    stepsLabel: "Steps",
    stepLabel: "Step {n} of {total}",
  },
  ar: {
    eyebrow: "كيف نعمل",
    steps: [
      {
        id: "file",
        meta: "الخطوة الأولى — تجهيز الملف",
        title: "ابدأ من ملف يستطيع الفريق كله قراءته",
        description: "هيكل واحد، بالتسمية نفسها في كل مرة. يجد المنضمّون الجدد ما يريدون دون سؤال، ولا يُعاد بناء شيء لأن أحدهم لم يجده.",
        points: ["صفحة واحدة لكل مسار، مرتّبة", "كل شاشة باسم لا برقم", "المبرّرات مدوّنة جانب العمل", "الوضع الفاتح والداكن مهيّآن من البداية"],
      },
      {
        id: "sketch",
        meta: "الخطوة الثانية — رسم المسار",
        title: "ارسم المسار كاملًا قبل تنسيق أي جزء منه",
        description: "مربعات وأسهم، على ورقة أو على لوح. هو أرخص مكان لتكتشف أن شاشتين تؤديان العمل نفسه، أو أن إحداهما ناقصة.",
        points: ["كل شاشة بترتيبها", "الطرق المسدودة تُعلَّم مبكرًا", "مسؤول واحد عن كل قرار", "لا تنسيق بعد"],
      },
      {
        id: "build",
        meta: "الخطوة الثالثة — بناء الشاشات",
        title: "ابنِ بمحتوى حقيقي على شبكة مشتركة",
        description: "الكلمات والأرقام الحقيقية تغيّر التخطيط، فتدخل مبكرًا. يبني الجميع على الشبكة نفسها، فتتناسق الشاشات دون جولة تنظيف.",
        points: ["نص حقيقي من المسوّدة الأولى", "شبكة واحدة وسلّم خطوط واحد", "كل حالة مرسومة لا الحالة المثالية وحدها", "الاتجاهان يُفحصان أثناء العمل"],
      },
      {
        id: "handover",
        meta: "الخطوة الرابعة — التسليم",
        title: "سلّم المبرّرات لا الشاشات وحدها",
        description: "استعرضوا المسار معًا، ثم مرّروه مع الملاحظات التي تشرحه. من يبنيه بعد ذلك يعرف ما تقرّر ولماذا.",
        points: ["استعراض مع الفريق كله", "ملاحظات بجانب كل شاشة", "الأسئلة المفتوحة مدرجة لا مدفونة", "لا شيء يُطلق برأي شخص واحد"],
      },
    ],
    primaryAction: "اطّلع على العملية",
    secondaryAction: "اقرأ الدليل",
    stepsLabel: "الخطوات",
    stepLabel: "الخطوة {n} من {total}",
  },
}

export interface HowItWorksFullBleedStepPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksFullBleedStepPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /**
   * The photo in the panel: one for all the steps, or one per step to cross-fade
   * between. A `muted` placeholder shows without any.
   * @default none: a `muted` placeholder
   */
  photos?: HowItWorksPhoto[]
  /** Where the first button goes. Without it, the button calls `onPrimaryAction`. */
  primaryHref?: string
  /** Where the second button goes. Without it, the button calls `onSecondaryAction`. */
  secondaryHref?: string
  /** Called when the first button is pressed and has no `primaryHref`. */
  onPrimaryAction?: () => void
  /** Called when the second button is pressed and has no `secondaryHref`. */
  onSecondaryAction?: () => void
  /** The step to show first, from 0. */
  defaultStep?: number
  /** Called with the new step's index when the step changes. */
  onStepChange?: (index: number) => void
}

export function HowItWorksFullBleedStepPanel({
  locale = "en",
  eyebrow,
  steps,
  primaryAction,
  secondaryAction,
  stepsLabel,
  stepLabel,
  photos,
  primaryHref,
  secondaryHref,
  onPrimaryAction,
  onSecondaryAction,
  defaultStep = 0,
  onStepChange,
  className,
  ...props
}: HowItWorksFullBleedStepPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = steps ?? copy.steps
  const [active, setActive] = React.useState(Math.min(Math.max(defaultStep, 0), list.length - 1))
  const copyRef = React.useRef<HTMLDivElement>(null)
  const numeralRef = React.useRef<HTMLSpanElement>(null)
  const dotRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const first = React.useRef(true)
  const step = list[active] ?? list[0]
  const shown = photos && photos.length > 0 ? photos : undefined
  const photoIndex = shown ? Math.min(active, shown.length - 1) : 0
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction ?? copy.secondaryAction

  const go = (next: number, focus = false) => {
    const index = (next + list.length) % list.length
    setActive(index)
    onStepChange?.(index)
    if (focus) dotRefs.current[index]?.focus()
  }

  // A step change after the first render: the copy fades in from 12px below, the numeral rises.
  React.useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (prefersReducedMotion()) return
    const keyframes = [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }]
    const options = { duration: 280, easing: EASE_OUT }
    copyRef.current?.animate?.(keyframes, options)
    numeralRef.current?.animate?.([{ transform: "translateY(24px)" }, { transform: "none" }], { duration: 360, easing: EASE_OUT })
  }, [active])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const forward = rtl ? "ArrowLeft" : "ArrowRight"
    const back = rtl ? "ArrowRight" : "ArrowLeft"
    if (event.key === forward) go(active + 1, true)
    else if (event.key === back) go(active - 1, true)
    else if (event.key === "Home") go(0, true)
    else if (event.key === "End") go(list.length - 1, true)
    else return
    event.preventDefault()
  }

  const action = (label: string, href: string | undefined, onPress: (() => void) | undefined, variant: "default" | "outline") =>
    href ? (
      <a href={href} className={buttonVariants({ variant, size: "md" })}>
        {label}
      </a>
    ) : (
      <Button type="button" variant={variant} size="md" onClick={onPress}>
        {label}
      </Button>
    )

  return (
    <HowItWorksSection labelledBy={headingId} className={className} contentClassName="gap-8" {...props}>
      <div className="flex w-full items-center justify-between gap-4">
        <HowItWorksEyebrow>{eyebrow ?? copy.eyebrow}</HowItWorksEyebrow>
        <div role="group" aria-label={stepsLabel ?? copy.stepsLabel} onKeyDown={onKeyDown} className="flex items-center gap-1">
          {list.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                dotRefs.current[index] = node
              }}
              type="button"
              aria-label={(stepLabel ?? copy.stepLabel).replace("{n}", String(index + 1)).replace("{total}", String(list.length))}
              aria-current={index === active ? "step" : undefined}
              tabIndex={index === active ? 0 : -1}
              onClick={() => go(index)}
              className="group flex h-6 items-center px-0.5 focus-visible:outline-none"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background motion-reduce:transition-none",
                  index === active ? "w-6 bg-foreground" : "w-2 bg-border"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-[14px] bg-muted p-6 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-12 [@container(min-width:64rem)]:p-12">
        <div ref={copyRef} className="flex min-w-0 flex-1 flex-col gap-5" aria-live="polite">
          <span className="block overflow-hidden">
            <span ref={numeralRef} className="block text-4xl font-semibold leading-none text-foreground [@container(min-width:40rem)]:text-5xl [@container(min-width:64rem)]:text-7xl" dir="ltr">
              {String(active + 1).padStart(2, "0")}
            </span>
          </span>
          <HowItWorksEyebrow>{step?.meta}</HowItWorksEyebrow>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:64rem)]:text-3xl">
            {step?.title}
          </h2>
          <p className="text-base text-muted-foreground">{step?.description}</p>
          <ul className="flex flex-col gap-2">
            {step?.points.map((point, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                <CircleCheck size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [&>*]:w-full [@container(min-width:40rem)]:[&>*]:w-auto">
            {action(primary, primaryHref, onPrimaryAction, "default")}
            {action(secondary, secondaryHref, onSecondaryAction, "outline")}
          </div>
        </div>
        <div className="relative order-first h-60 w-full shrink-0 overflow-hidden rounded-[10px] bg-card [@container(min-width:40rem)]:h-[360px] [@container(min-width:64rem)]:order-none [@container(min-width:64rem)]:h-[440px] [@container(min-width:64rem)]:w-[560px]">
          {shown
            ? shown.map((photo, index) => (
                <div
                  key={photo.src + index}
                  aria-hidden={index !== photoIndex}
                  className={cn("absolute inset-0 transition-[opacity,transform] duration-[400ms] ease-out motion-reduce:transition-none", index === photoIndex ? "scale-100 opacity-100" : "scale-[1.03] opacity-0")}
                >
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
export const howItWorksFullBleedStepPanelCopy = COPY

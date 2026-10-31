"use client"

import * as React from "react"
import { ArrowUp, Droplets, Moon, Sun } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { enter, HowItWorksSection, revealTargets, useRevealOnEnter, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Pill Timeline.
 *
 * A centred header (a heading and a line), then three stages on one line: each a
 * soft Badge over a prompt pill, with a caption under it. A 1px `border` line runs
 * through every pill; the pill is a `card` capsule holding an icon, the prompt and
 * a round send button in `accent`.
 *
 * Desktop and Tablet keep three columns. Mobile stacks the stages, each with its
 * own line running edge to edge behind its pill. On Tablet the columns are about
 * 210px, narrower than Figma's pills, which overlap there; the code lets a pill
 * shrink to its column and wrap its prompt over two lines instead. The page's `dir`
 * mirrors it: the morning stage is at the right in Arabic, the icon sits at the
 * pill's right and the send button at its left. The send arrow points up and is
 * not mirrored.
 *
 * Motion plays once, when the block comes into view: the line draws along the
 * inline axis (700ms) through all the stages, then each stage rises 8px and fades
 * in, 120ms apart, badge first, then the pill, then the caption. A pill's send
 * button lifts 2px and fills with `primary` on hover and focus (140ms) and scales
 * to 0.96 on press. Under reduced motion the block is its finished state.
 *
 * Content limits: the heading up to 32 characters, the line up to 70. A stage's
 * badge up to 12 characters, its prompt up to 24 and its caption up to 80. Three
 * stages in Figma; two to four work.
 */

export type HowItWorksStageTone = "warning" | "info" | "success"

export interface HowItWorksStage {
  /** Keys the stage. */
  id: string
  /** The Badge over the pill, such as "Morning". */
  badge: string
  tone: HowItWorksStageTone
  /** The prompt in the pill. */
  prompt: string
  /** The caption under the pill. */
  caption: React.ReactNode
  /** The pill's leading icon. A water drop, a sun and a moon by default. */
  icon?: React.ReactNode
}

export interface HowItWorksPillTimelineCopy {
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  stages: HowItWorksStage[]
  /** Names a pill's send button, such as "Ask: What needs water?": `{prompt}` stands for the prompt. */
  sendLabel: string
}

/** Figma's copy, English and Arabic. The send label is written for the code. */
const COPY: Record<HowItWorksLocale, HowItWorksPillTimelineCopy> = {
  en: {
    heading: "Looks after you all day",
    description: "Small check-ins from sunrise to sunset, tuned to your space.",
    stages: [
      { id: "morning", badge: "Morning", tone: "warning", prompt: "What needs water?", caption: "Start the day knowing which plants need attention first." },
      { id: "midday", badge: "Midday", tone: "info", prompt: "Is it too sunny here?", caption: "Get quick advice when the light or the heat changes." },
      { id: "evening", badge: "Evening", tone: "success", prompt: "Plan tomorrow", caption: "Wrap up the day and set a simple plan for the next one." },
    ],
    sendLabel: "Ask: {prompt}",
  },
  ar: {
    heading: "يرافقك طوال اليوم",
    description: "متابعات قصيرة من الشروق إلى الغروب، مصمّمة لمساحتك.",
    stages: [
      { id: "morning", badge: "الصباح", tone: "warning", prompt: "ما الذي يحتاج إلى سقي؟", caption: "ابدأ يومك وأنت تعرف أي النباتات تحتاج إلى عناية أولًا." },
      { id: "midday", badge: "الظهيرة", tone: "info", prompt: "هل المكان مشمس أكثر من اللازم؟", caption: "احصل على نصيحة سريعة عند تغيّر الضوء أو الحرارة." },
      { id: "evening", badge: "المساء", tone: "success", prompt: "خطّط لغدك", caption: "أنهِ يومك وضع خطة بسيطة لليوم التالي." },
    ],
    sendLabel: "اسأل: {prompt}",
  },
}

export interface HowItWorksPillTimelineProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange">, Partial<HowItWorksPillTimelineCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /** Called with the stage's index when its pill is pressed. */
  onStageSelect?: (index: number) => void
}

/** The stage columns from Tablet up, by how many stages there are: written out so each class is found. */
const COLUMNS: Record<number, string> = {
  2: "[@container(min-width:40rem)]:grid-cols-2",
  3: "[@container(min-width:40rem)]:grid-cols-3",
  4: "[@container(min-width:40rem)]:grid-cols-4",
}

const DEFAULT_ICONS = [<Droplets key="drop" aria-hidden="true" className="size-4 shrink-0" />, <Sun key="sun" aria-hidden="true" className="size-4 shrink-0" />, <Moon key="moon" aria-hidden="true" className="size-4 shrink-0" />]

export function HowItWorksPillTimeline({ locale = "en", heading, description, stages, sendLabel, onStageSelect, className, ...props }: HowItWorksPillTimelineProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const list = stages ?? copy.stages
  const nameSend = sendLabel ?? copy.sendLabel

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    const lines = revealTargets(node, "line")
    // In one row the lines draw as one, a share each in turn; stacked, each draws on its own.
    const row = lines.length > 1 && lines[0]!.getBoundingClientRect().top === lines[1]!.getBoundingClientRect().top
    lines.forEach((line, index) => {
      const share = 700 / lines.length
      started.push(enter(line, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], row ? { duration: share, delay: index * share, easing: "linear" } : { duration: 500, easing: "ease-out" }))
    })
    const rise = [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }]
    revealTargets(node, "stage").forEach((stage, index) => {
      const base = (row ? 700 : 300) + index * 120
      const parts = ["badge", "pill", "caption"]
      parts.forEach((part, step) => {
        const target = stage.querySelector<HTMLElement>(`[data-reveal="${part}"]`)
        if (target) started.push(enter(target, rise, { duration: 350, delay: base + step * 90 }))
      })
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-center gap-4 text-center">
        <h2 id={headingId} className="text-2xl font-medium text-foreground [@container(min-width:64rem)]:text-3xl">
          {heading ?? copy.heading}
        </h2>
        <p className="max-w-[560px] text-base text-muted-foreground">{description ?? copy.description}</p>
      </header>

      <ol className={cn("grid grid-cols-1 gap-10 [@container(min-width:40rem)]:gap-0", COLUMNS[Math.min(Math.max(list.length, 2), 4)])}>
        {list.map((stage, index) => (
          <li key={stage.id} data-reveal="stage" className="flex min-w-0 flex-col items-center gap-4">
            <div data-reveal="badge">
              <Badge variant="soft" tone={stage.tone} size="md">
                {stage.badge}
              </Badge>
            </div>
            <div className="relative flex w-full items-center justify-center">
              <span aria-hidden="true" data-reveal="line" className="absolute inset-x-0 top-1/2 h-px origin-left bg-border [&:dir(rtl)]:origin-right" />
              <button
                type="button"
                data-reveal="pill"
                aria-label={nameSend.replace("{prompt}", stage.prompt)}
                onClick={() => onStageSelect?.(index)}
                className="group relative z-10 inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-border bg-card py-2 ps-4 pe-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [@container(min-width:64rem)]:gap-4"
              >
                {stage.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length]}
                <span className="min-w-0 text-start">{stage.prompt}</span>
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-[transform,background-color,color] duration-[140ms] group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:-translate-y-0.5 group-focus-visible:bg-primary group-focus-visible:text-primary-foreground group-active:scale-[0.96] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0 motion-reduce:group-active:scale-100"
                >
                  <ArrowUp className="size-5" />
                </span>
              </button>
            </div>
            <p data-reveal="caption" className="max-w-[352px] px-4 text-center text-sm text-muted-foreground [@container(min-width:40rem)]:px-8">
              {stage.caption}
            </p>
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
export const howItWorksPillTimelineCopy = COPY

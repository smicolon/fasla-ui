"use client"

import * as React from "react"
import { AppWindow, MousePointer2, TrendingUp } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"
import { Switch } from "../../ui/switch/switch"
import {
  HOW_IT_WORKS_ICON,
  countUp,
  enter,
  HowItWorksFigures,
  HowItWorksGlow,
  HowItWorksLtr,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type Cancellable,
  type HowItWorksGlowTone,
  type HowItWorksLocale,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Stacked Media + Text.
 *
 * A bold teal block (`chart-2`): a soft badge and the heading, with a download
 * button and a note at the far end of the row, then three cards. A card stacks a
 * 300px picture on soft blurred glows, in theme tokens, over a rounded `chart-3`
 * panel with its number, title and line, in `background`. The pictures show a
 * window sitting on the picture's foot: quiet-hours switches, a list of who is
 * around, and a focus gauge. They are drawn here and hidden from screen readers.
 *
 * Desktop sets the cards three across and the button beside the heading. Tablet
 * and Mobile stack the button under the heading and the cards in one column; a
 * window always sits on the foot of its picture. The page's `dir` mirrors the
 * row, the order and the switches' knobs, so the knob sits at the start when a
 * switch is on. The gauge keeps its left-to-right sweep: it is a scale, not a
 * reading order.
 *
 * Motion plays once, when the block comes into view: the glows behind each
 * window drift 24px over six seconds and rest; the quiet-hours switches flip on
 * one after another (180ms, 100ms apart) with the cursor on the first; the list
 * rows fade in 80ms apart; and the gauge sweeps from 0 to 76% (800ms) while its
 * figure counts up. Cards lift 4px on hover. Under reduced motion the block is
 * its finished state. The glows' drift is skipped on narrow widths by the
 * container, not by a different animation: it runs at every width here.
 *
 * Content limits: the heading up to 28 characters, the button up to 20, the
 * note up to 30. A card's title up to 26 characters and its line up to 62.
 */

export type HowItWorksPresenceTone = "success" | "warning" | "destructive"

export interface HowItWorksStackedStep {
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksStackedMediaTextCopy {
  /** The soft badge above the heading. */
  badge: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The button's label, and the small note under it. */
  action: string
  note: React.ReactNode
  /** The three cards. The numbers are drawn from 01. */
  steps: [HowItWorksStackedStep, HowItWorksStackedStep, HowItWorksStackedStep]
  /** The words inside the windows. */
  scene: {
    quiet: { title: React.ReactNode; options: [string, string, string] }
    /** Three people, each a name, a status and its tone. */
    people: [
      { name: string; status: React.ReactNode; tone: HowItWorksPresenceTone },
      { name: string; status: React.ReactNode; tone: HowItWorksPresenceTone },
      { name: string; status: React.ReactNode; tone: HowItWorksPresenceTone },
    ]
    gauge: { label: React.ReactNode; badge: React.ReactNode; value: number; trend: React.ReactNode }
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksStackedMediaTextCopy> = {
  en: {
    badge: "How it works",
    heading: "Three steps to calmer days.",
    action: "Download the app",
    note: "Free for personal use.",
    steps: [
      { title: "Choose your quiet hours", description: "Pick when notifications rest and which contacts can still reach you." },
      { title: "See who is around", description: "A glance shows who is focusing, away or busy." },
      { title: "Watch your focus grow", description: "Track focused time week by week and see what is improving." },
    ],
    scene: {
      quiet: { title: "Quiet hours", options: ["Mute notifications", "Dim the screen", "Allow calls from favourites"] },
      people: [
        { name: "Alex", status: "Focusing", tone: "success" },
        { name: "Sam", status: "Away", tone: "warning" },
        { name: "Jo", status: "Busy", tone: "destructive" },
      ],
      gauge: { label: "Focus score", badge: "This week", value: 76, trend: "Up 12% from last week" },
    },
  },
  ar: {
    badge: "كيف يعمل",
    heading: "ثلاث خطوات نحو أيام أهدأ.",
    action: "نزّل التطبيق",
    note: "مجاني للاستخدام الشخصي.",
    steps: [
      { title: "اختر ساعات هدوئك", description: "حدّد متى تهدأ الإشعارات ومن يمكنه الوصول إليك." },
      { title: "اعرف من المتاح", description: "نظرة واحدة تُظهر من في تركيز أو بعيد أو مشغول." },
      { title: "راقب نمو تركيزك", description: "تابع وقت التركيز أسبوعًا بعد أسبوع وشاهد ما يتحسّن." },
    ],
    scene: {
      quiet: { title: "ساعات الهدوء", options: ["كتم الإشعارات", "تعتيم الشاشة", "السماح بمكالمات المفضّلين"] },
      people: [
        { name: "محمد", status: "في تركيز", tone: "success" },
        { name: "سلمى", status: "بعيدة", tone: "warning" },
        { name: "يوسف", status: "مزدحم", tone: "destructive" },
      ],
      gauge: { label: "نتيجة التركيز", badge: "هذا الأسبوع", value: 76, trend: "ارتفاع 12% عن الأسبوع الماضي" },
    },
  },
}

const GLOW_SETS: [HowItWorksGlowTone, HowItWorksGlowTone, HowItWorksGlowTone][] = [
  ["chart-4", "chart-1", "chart-5"],
  ["info", "chart-2", "chart-3"],
  ["chart-2", "success", "info"],
]
/** The glows in a 400 × 300 picture: Figma's three, as left, top, width, height and strength. */
const GLOWS = [
  { x: 0, y: 0, w: 342, h: 274, strength: 0.49 },
  { x: 152, y: 75, w: 342, h: 274, strength: 0.47 },
  { x: -57, y: 150, w: 266, h: 213, strength: 0.38 },
] as const
const SWITCHES_ON = [true, true, false]

export interface HowItWorksStackedMediaTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksStackedMediaTextCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /** Where the button goes. Without it, the button calls `onAction`. */
  actionHref?: string
  /** Called when the button is pressed and has no `actionHref`. */
  onAction?: () => void
}

export function HowItWorksStackedMediaText({ locale = "en", badge, heading, action, note, steps, scene, actionHref, onAction, className, ...props }: HowItWorksStackedMediaTextProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const cards = steps ?? copy.steps
  const words = scene ?? copy.scene
  const label = action ?? copy.action
  const [switches, setSwitches] = React.useState(SWITCHES_ON)

  useRevealOnEnter(rootRef, (node) => {
    const started: Cancellable[] = []
    revealTargets(node, "glow").forEach((glow, index) => {
      const x = index % 2 === 0 ? 24 : -24
      started.push(glow.animate([{ transform: "translate(0, 0)" }, { transform: `translate(${x}px, ${-x}px)` }, { transform: "translate(0, 0)" }], { duration: 6000, easing: "ease-out" }))
    })
    revealTargets(node, "cursor").forEach((cursor) => started.push(enter(cursor, [{ opacity: 0, transform: "translate(-20px, 12px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 400 })))
    revealTargets(node, "person").forEach((row, index) => started.push(enter(row, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 300 + index * 80 })))
    revealTargets(node, "arc").forEach((arc) => started.push(enter(arc, [{ strokeDashoffset: "76" }, { strokeDashoffset: "0" }], { duration: 800, delay: 300 })))
    revealTargets(node, "count").forEach((count) => started.push(countUp(count, words.gauge.value, 800, 300)))
    revealTargets(node, "trend").forEach((trend) => started.push(enter(trend, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 900 })))
    const timers: number[] = []
    setSwitches([false, false, false])
    SWITCHES_ON.forEach((on, index) => {
      if (on) timers.push(window.setTimeout(() => setSwitches((current) => current.map((value, i) => (i === index ? true : value))), 500 + index * 100))
    })
    started.push({
      cancel() {
        timers.forEach((timer) => window.clearTimeout(timer))
        setSwitches(SWITCHES_ON)
      },
    })
    return started
  })

  const button = actionHref ? (
    <a href={actionHref} className={buttonVariants({ variant: "default", size: "lg" })}>
      {label}
    </a>
  ) : (
    <Button type="button" size="lg" onClick={onAction}>
      {label}
    </Button>
  )
  const window_ = "relative z-10 mx-4 flex [@container(min-width:40rem)]:mx-8 flex-col gap-2 self-end rounded-t-[10px] bg-card p-4 text-foreground"
  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={`bg-chart-2 ${className ?? ""}`} {...props}>
      <header className="flex w-full flex-col gap-6 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-24">
        <div className="flex flex-col items-start gap-3">
          <Badge variant="soft" tone="info" size="md" radius="rounded">
            {badge ?? copy.badge}
          </Badge>
          <h2 id={headingId} className="text-3xl font-medium text-background [@container(min-width:40rem)]:text-4xl [@container(min-width:64rem)]:text-5xl">
            {heading ?? copy.heading}
          </h2>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 [@container(min-width:64rem)]:items-end">
          {button}
          <p className="text-xs text-background">{note ?? copy.note}</p>
        </div>
      </header>

      <ol className="group/cards grid grid-cols-1 items-start gap-6 [@container(min-width:64rem)]:grid-cols-3">
        {cards.map((card, index) => (
          <li key={index} data-reveal="card" className="flex min-w-0 flex-col transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none hover:motion-reduce:translate-y-0">
            <div aria-hidden="true" className="pointer-events-none relative flex h-[300px] overflow-hidden rounded-3xl bg-accent">
              {GLOWS.map((glow, g) => (
                <HowItWorksGlow
                  key={g}
                  tone={GLOW_SETS[index]?.[g] ?? "chart-1"}
                  strength={glow.strength}
                  data-reveal="glow"
                  style={{ insetInlineStart: glow.x, top: glow.y, width: glow.w, height: glow.h, opacity: glow.strength }}
                />
              ))}

              {index === 0 ? (
                <div className={`${window_} min-w-0 flex-1`}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AppWindow size={16} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                    {words.quiet.title}
                  </div>
                  {words.quiet.options.map((option, row) => (
                    <div key={row} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-xs">
                      <span className="min-w-0">{option}</span>
                      <Switch size="sm" checked={switches[row]} onChange={() => {}} tabIndex={-1} aria-label={option} />
                    </div>
                  ))}
                  <MousePointer2 data-reveal="cursor" size={28} {...HOW_IT_WORKS_ICON} className="absolute -bottom-1 end-6 fill-background text-foreground" />
                </div>
              ) : null}
              {index === 1 ? (
                <div className={`${window_} min-w-0 flex-1`}>
                  {words.people.map((person, row) => (
                    <div key={row} data-reveal="person" className="flex items-center gap-2 rounded-lg bg-muted p-2">
                      <Avatar variant="initials" size="24" radius="rounded" border name={person.name} />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-xs font-medium">{person.name}</span>
                        <span className="h-[5px] w-36 max-w-full rounded-full bg-border" />
                      </div>
                      <Badge variant="soft" tone={person.tone} size="sm" radius="rounded">
                        {person.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : null}
              {index === 2 ? (
                <div className={`${window_} min-w-0 flex-1`}>
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{words.gauge.label}</span>
                    <Badge variant="soft" tone="secondary" size="sm" radius="rounded">
                      {words.gauge.badge}
                    </Badge>
                  </div>
                  <div dir="ltr" className="relative mx-auto h-[104px] w-[200px]">
                    <svg viewBox="0 0 200 104" className="absolute inset-0 size-full" fill="none" strokeWidth={18}>
                      <path d="M 9 100 A 91 91 0 0 1 191 100" pathLength={100} className="stroke-muted" />
                      <path data-reveal="arc" d="M 9 100 A 91 91 0 0 1 191 100" pathLength={100} strokeDasharray="76 100" className="stroke-success" />
                    </svg>
                    <span className="absolute inset-x-0 bottom-0 flex justify-center text-2xl font-medium">
                      <HowItWorksLtr>
                        <span data-reveal="count">{words.gauge.value}</span>%
                      </HowItWorksLtr>
                    </span>
                  </div>
                  <div data-reveal="trend" className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp size={14} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                    <HowItWorksFigures>{words.gauge.trend}</HowItWorksFigures>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 rounded-3xl bg-chart-3 p-6 text-background">
              <span className="text-xs">
                <HowItWorksLtr>{String(index + 1).padStart(2, "0")}</HowItWorksLtr>
              </span>
              <h3 className="text-xl font-medium">{card.title}</h3>
              <p className="text-sm">{card.description}</p>
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
export const howItWorksStackedMediaTextCopy = COPY

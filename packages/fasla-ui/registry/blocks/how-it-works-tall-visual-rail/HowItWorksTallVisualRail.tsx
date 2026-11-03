"use client"

import * as React from "react"
import { Calendar, CircleCheck, Coffee, Gift, Package, TrendingUp, Users } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "../../ui/carousel/carousel"
import { Progress } from "../../ui/progress/progress"
import { Switch } from "../../ui/switch/switch"
import {
  HOW_IT_WORKS_ICON,
  countUp,
  enter,
  GROW_Y,
  HowItWorksFigures,
  HowItWorksHeader,
  HowItWorksLtr,
  HowItWorksSection,
  POP,
  RISE,
  useRevealOnEnter,
  type Cancellable,
  type HowItWorksLocale,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Tall Visual Rail.
 *
 * A header, then a rail of four tall cards (380 × 472): a 300px picture on
 * `muted` with a number pill in its corner, over a rounded `chart-3` panel with
 * a title, a line and a Learn more button. The pictures are drawn here and
 * hidden from screen readers: three option cards with one picked, a switch with
 * three triggers, a delivery figure with three progress rows, and two rounds of
 * bars. Under the rail, the Carousel's dots.
 *
 * The rail is the Carousel atom, a real scroll-snap scroller. Desktop shows three
 * cards and the edge of a fourth (380px), Tablet 340px cards, and Mobile one card
 * at the full width of the column, so there is no peek and the dots are the only
 * sign of position. The dots count the positions the rail can reach, so on Desktop
 * there are fewer dots than cards. The page's `dir` starts the rail at the other
 * edge, and the pictures that lean (the option cards) turn the other way.
 *
 * Motion: a picture plays once, the first time its card is in view: the options
 * fan out and the picked one lifts and gets its check; the switch flips and the
 * triggers rise in; the three bars fill to 100%, 80% and 65% while the figure
 * counts up to 95; the bars grow. The browser's scroll-snap moves the rail:
 * Figma's card has a spring with momentum and the demo wait for the card to be
 * the active one; the code plays each picture when it is first in view.
 * Under reduced motion the block is its finished state and the rail jumps.
 *
 * Content limits: the heading up to 32 characters. A card's title up to 22
 * characters, its line up to 62 and its button up to 14.
 */

export interface HowItWorksTallRailCard {
  /** Keys the card. */
  id: string
  title: React.ReactNode
  description: React.ReactNode
}

export interface HowItWorksTallVisualRailCopy {
  eyebrow: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The four cards, in order. The numbers are drawn from 01. */
  cards: [HowItWorksTallRailCard, HowItWorksTallRailCard, HowItWorksTallRailCard, HowItWorksTallRailCard]
  /** The button on each card. */
  action: string
  /** The rail's accessible name. */
  railLabel: string
  /** The words inside the pictures. */
  scene: {
    options: [{ name: string; note: string }, { name: string; note: string }, { name: string; note: string }]
    automation: { label: string; triggers: [string, string, string] }
    delivery: { label: string; badge: string; value: number; rows: [string, string, string] }
    compare: { result: string; before: string; after: string }
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksTallVisualRailCopy> = {
  en: {
    eyebrow: "How it works",
    heading: "Four steps to a happier team.",
    cards: [
      { id: "treat", title: "Pick the treat", description: "Choose from local bakeries and cafés, or build your own box." },
      { id: "moment", title: "Choose the moment", description: "Send on a schedule, on a milestone, or whenever the team earns it." },
      { id: "delivery", title: "Track every delivery", description: "Follow each order live and see how it went." },
      { id: "going", title: "Keep it going", description: "Review what people loved and refine the next round." },
    ],
    action: "Learn more",
    railLabel: "Steps",
    scene: {
      options: [
        { name: "Dessert box", note: "For 10" },
        { name: "Coffee break", note: "For 10" },
        { name: "Lunch pack", note: "For 10" },
      ],
      automation: { label: "Auto-send", triggers: ["Every Friday", "Work anniversary", "Team win"] },
      delivery: { label: "On-time delivery", badge: "+4 pts", value: 95, rows: ["Ordered", "Packed", "Delivered"] },
      compare: { result: "+18% happier teams", before: "Last month", after: "This month" },
    },
  },
  ar: {
    eyebrow: "كيف يعمل",
    heading: "أربع خطوات نحو فريق أسعد.",
    cards: [
      { id: "treat", title: "اختر الهدية", description: "اختر من المخابز والمقاهي المحلية، أو صمّم علبتك بنفسك." },
      { id: "moment", title: "اختر اللحظة", description: "أرسل وفق جدول، أو عند إنجاز، أو كلما استحق الفريق ذلك." },
      { id: "delivery", title: "تابع كل توصيلة", description: "تابع كل طلب مباشرة وشاهد كيف سار." },
      { id: "going", title: "واصل الاستمرار", description: "راجع ما أحبّه الناس وحسّن الجولة التالية." },
    ],
    action: "اعرف المزيد",
    railLabel: "الخطوات",
    scene: {
      options: [
        { name: "علبة حلويات", note: "10 أشخاص" },
        { name: "استراحة قهوة", note: "10 أشخاص" },
        { name: "وجبة غداء", note: "10 أشخاص" },
      ],
      automation: { label: "إرسال تلقائي", triggers: ["كل جمعة", "ذكرى العمل", "إنجاز للفريق"] },
      delivery: { label: "التسليم في الموعد", badge: "زيادة 4 نقاط", value: 95, rows: ["تم الطلب", "تم التغليف", "تم التسليم"] },
      compare: { result: "فرق أسعد بنسبة 18%", before: "الشهر الماضي", after: "هذا الشهر" },
    },
  },
}

const OPTION_ICONS = [Gift, Coffee, Package]
const TRIGGER_ICONS = [Calendar, Gift, Users]
const ROW_VALUES = [100, 80, 65]
const ROUND_BARS = { before: [40, 56, 48], after: [64, 88, 112] }

/** One card. It plays its picture once, the first time it is in view. */
function Card({
  number,
  title,
  description,
  action,
  index,
  scene,
  onPress,
  children,
}: {
  number: number
  title: React.ReactNode
  description: React.ReactNode
  action: string
  index: number
  scene: HowItWorksTallVisualRailCopy["scene"]
  onPress?: () => void
  /** The picture, given whether the switch in it is on. */
  children: (switchOn: boolean) => React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [switchOn, setSwitchOn] = React.useState(true)
  useRevealOnEnter(
    ref,
    (node) => {
      const started: Cancellable[] = []
      const part = (name: string) => Array.from(node.querySelectorAll<HTMLElement>(`[data-reveal="${name}"]`))
      if (index === 0) {
        part("option").forEach((option, i) => {
          const rest = getComputedStyle(option).transform
          started.push(enter(option, [{ opacity: 0, transform: `translateY(24px) rotate(0deg) scale(0.9)` }, { opacity: 1, transform: rest === "none" ? "none" : rest }], { duration: 520, delay: i * 120, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }))
        })
        part("check").forEach((el) => started.push(enter(el, POP, { duration: 260, delay: 520 })))
      }
      if (index === 1) {
        const timers: number[] = []
        setSwitchOn(false)
        timers.push(window.setTimeout(() => setSwitchOn(true), 300))
        started.push({
          cancel() {
            timers.forEach((timer) => window.clearTimeout(timer))
            setSwitchOn(true)
          },
        })
        part("trigger").forEach((el, i) => started.push(enter(el, RISE, { duration: 400, delay: 450 + i * 100 })))
      }
      if (index === 2) {
        part("count").forEach((el) => started.push(countUp(el, scene.delivery.value, 700, 100)))
        part("fill").forEach((el, i) => started.push(enter(el, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 700, delay: 150 + i * 120 })))
      }
      if (index === 3) {
        part("bar").forEach((el, i) => started.push(enter(el, GROW_Y, { duration: 400, delay: 150 + i * 60 })))
        part("result").forEach((el) => started.push(enter(el, RISE, { duration: 300, delay: 700 })))
      }
      return started
    },
    0.5
  )

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden rounded-2xl bg-chart-3 text-background">
      <div aria-hidden="true" className="pointer-events-none relative flex h-[300px] shrink-0 items-center justify-center overflow-hidden bg-muted px-4 pb-4 pt-12 text-foreground">
        <span className="absolute start-4 top-4 rounded-full bg-foreground px-2 py-1 text-xs font-medium text-background">
          <HowItWorksLtr>{String(number).padStart(2, "0")}</HowItWorksLtr>
        </span>
        {children(switchOn)}
      </div>
      <div className="flex flex-1 flex-col items-start gap-3 p-6">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-sm">{description}</p>
        <Button type="button" size="sm" tone="secondary" className="mt-auto" onClick={onPress}>
          {action}
        </Button>
      </div>
    </div>
  )
}

export interface HowItWorksTallVisualRailProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksTallVisualRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
  /** Called with the card's index when its button is pressed. */
  onAction?: (index: number) => void
}

export function HowItWorksTallVisualRail({ locale = "en", eyebrow, heading, cards, action, railLabel, scene, onAction, className, ...props }: HowItWorksTallVisualRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = cards ?? copy.cards
  const words = scene ?? copy.scene
  const label = action ?? copy.action
  const tilt = ["-rotate-6 [&:dir(rtl)]:rotate-6", "", "rotate-6 [&:dir(rtl)]:-rotate-6"]

  return (
    <HowItWorksSection labelledBy={headingId} className={className} {...props}>
      <HowItWorksHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} headingClassName="text-3xl [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl" />

      <Carousel aria-label={railLabel ?? copy.railLabel} className="mt-3 flex flex-col gap-16">
        <CarouselContent className="gap-6 py-2">
          {list.map((card, index) => (
            <CarouselItem key={card.id} className="basis-full [@container(min-width:40rem)]:basis-[340px] [@container(min-width:64rem)]:basis-[380px]">
              <Card number={index + 1} title={card.title} description={card.description} action={label} index={index} scene={words} onPress={() => onAction?.(index)}>
                {(switchOn) => (
                  <>
                {index === 0 ? (
                  <div className="relative h-[200px] w-[300px] max-w-full">
                    {words.options.map((option, i) => {
                      const Icon = OPTION_ICONS[i]!
                      const picked = i === 1
                      return (
                        <div
                          key={i}
                          data-reveal="option"
                          className={cn(
                            "absolute flex h-32 w-24 flex-col items-center gap-2 rounded-[14px] border bg-card px-3 py-4 text-center",
                            picked ? "border-primary" : "border-border",
                            tilt[i]
                          )}
                          style={{ insetInlineStart: [10, 100, 190][i], top: [34, 14, 34][i] }}
                        >
                          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Icon size={22} {...HOW_IT_WORKS_ICON} />
                          </span>
                          <span className="text-sm leading-tight">{option.name}</span>
                          <span className="text-xs text-muted-foreground">
                            <HowItWorksFigures>{option.note}</HowItWorksFigures>
                          </span>
                        </div>
                      )
                    })}
                    <CircleCheck data-reveal="check" size={22} {...HOW_IT_WORKS_ICON} className="absolute top-1.5 rounded-full bg-background" style={{ insetInlineStart: 178 }} />
                  </div>
                ) : null}

                {index === 1 ? (
                  <div className="flex w-[169px] flex-col gap-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-sm">{words.automation.label}</span>
                      <Switch size="lg" checked={switchOn} onChange={() => {}} tabIndex={-1} aria-label={words.automation.label} />
                    </div>
                    {words.automation.triggers.map((trigger, i) => {
                      const Icon = TRIGGER_ICONS[i]!
                      return (
                        <span key={i} data-reveal="trigger" className={cn("flex items-center gap-2 self-center rounded-full border bg-card py-2 pe-4 ps-3 text-sm", i === 0 ? "border-success" : "border-border")}>
                          <Icon size={16} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                          <span className="whitespace-nowrap">{trigger}</span>
                          {i === 0 ? <CircleCheck size={16} {...HOW_IT_WORKS_ICON} className="shrink-0" /> : null}
                        </span>
                      )
                    })}
                  </div>
                ) : null}

                {index === 2 ? (
                  <div className="flex w-full max-w-[332px] flex-col gap-4">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">{words.delivery.label}</span>
                      <Badge variant="soft" tone="success" size="sm" radius="rounded">
                        {words.delivery.badge}
                      </Badge>
                    </div>
                    <span className="text-5xl font-medium leading-none">
                      <HowItWorksLtr>
                        <span data-reveal="count">{words.delivery.value}</span>%
                      </HowItWorksLtr>
                    </span>
                    {words.delivery.rows.map((row, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <span className="text-xs text-muted-foreground">{row}</span>
                        <div data-reveal="fill">
                          <Progress value={ROW_VALUES[i]} size="md" showPercentage={false} aria-label={row} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {index === 3 ? (
                  <div className="flex flex-col gap-4">
                    <span data-reveal="result" className="flex items-center gap-2 text-sm">
                      <TrendingUp size={18} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                      <HowItWorksFigures>{words.compare.result}</HowItWorksFigures>
                    </span>
                    <div className="flex items-end gap-8">
                      {(["before", "after"] as const).map((round) => (
                        <div key={round} className="flex flex-col items-center gap-2">
                          <div dir="ltr" className="flex items-end gap-2" style={{ height: round === "before" ? 56 : 112 }}>
                            {ROUND_BARS[round].map((height, i) => (
                              <span key={i} data-reveal="bar" className={cn("w-5 origin-bottom rounded-[2px]", round === "before" ? "bg-muted-foreground" : "bg-primary")} style={{ height }} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{words.compare[round === "before" ? "before" : "after"]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                  </>
                )}
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksTallVisualRailCopy = COPY

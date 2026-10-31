"use client"

import * as React from "react"
import { Bot, Calendar, Globe, Heart, Mail, MousePointer2, Sparkles } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Progress } from "../../ui/progress/progress"
import { HOW_IT_WORKS_ICON, enter, HowItWorksFigures, HowItWorksGlow, HowItWorksSection, POP, revealTargets, RISE, useRevealOnEnter, type HowItWorksGlowTone, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Split Feature Band.
 *
 * Two rounded bands, one above the other. Each is a soft badge, a two-line
 * headline (the second line in `primary`), a line and two buttons, beside a
 * picture on three blurred glows: a helper's card with a progress bar and its
 * sources, then a three-step workflow with a dashed connector and a Done chip.
 * The pictures are drawn here and hidden from screen readers; the copy says
 * the same. The glows are theme tokens blurred like Figma's 64px layer blur.
 *
 * Desktop sets copy and picture side by side, 32px apart, each 584 wide.
 * Tablet and Mobile stack the picture under the copy (360px tall on Tablet,
 * 300 on Mobile); on Mobile the workflow's tiles shrink to 56px and its labels
 * shorten to Request, Reply and Booking so three steps fit 272px. The page's
 * `dir` mirrors each band: the picture to the left and the dot travelling
 * right to left.
 *
 * Motion plays once, when the block comes into view. First band: the progress
 * bar fills to 65% (700ms), the three sources pop 80ms apart and the result
 * line rises 8px as the cursor glides to it. Second band: a dot travels the
 * dashed connector from the first tile to the last (600ms per hop), each tile
 * pulsing (scale 1.06, 180ms) as it is reached, and the Done chip pops last.
 * The glows drift once (20px, 5s) and rest. Under reduced motion the block is
 * its finished state.
 *
 * Content limits: a headline line up to 32 characters, the line under it up
 * to 110, a button label up to 14. A workflow label up to 14, 8 on Mobile.
 */

export interface HowItWorksSplitFeatureBandCopy {
  agent: {
    /** The soft badge above the headline. */
    badge: React.ReactNode
    /** The headline's two lines, the second in `primary`. */
    headline: [React.ReactNode, React.ReactNode]
    /** The line under the headline. */
    intro: React.ReactNode
    /** The two buttons, solid and outline. */
    actions: [React.ReactNode, React.ReactNode]
    /** The card in the picture. */
    card: {
      title: React.ReactNode
      subtitle: React.ReactNode
      status: React.ReactNode
      /** The three source chips, such as "Web", "Saved" and "Inbox". */
      sources: [React.ReactNode, React.ReactNode, React.ReactNode]
      result: React.ReactNode
    }
  }
  workflow: {
    badge: React.ReactNode
    headline: [React.ReactNode, React.ReactNode]
    intro: React.ReactNode
    actions: [React.ReactNode, React.ReactNode]
    /** The three steps' labels, and the short ones Mobile shows. */
    steps: [
      { label: React.ReactNode; short: React.ReactNode },
      { label: React.ReactNode; short: React.ReactNode },
      { label: React.ReactNode; short: React.ReactNode },
    ]
    done: React.ReactNode
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksSplitFeatureBandCopy> = {
  en: {
    agent: {
      badge: "Helpers",
      headline: ["Hand off the planning to", "a helper that learns your taste."],
      intro: "It compares options in the background, remembers what you liked before and brings back only the best few.",
      actions: ["Try it free", "See how"],
      card: { title: "Trip helper", subtitle: "Comparing 12 stays", status: "Running", sources: ["Web", "Saved", "Inbox"], result: "3 stays match your budget" },
    },
    workflow: {
      badge: "Automation",
      headline: ["Keep every step moving", "without lifting a finger."],
      intro: "Requests, replies and bookings flow from one step to the next while you get on with your day.",
      actions: ["Try it free", "See how"],
      steps: [
        { label: "New request", short: "Request" },
        { label: "Prepare reply", short: "Reply" },
        { label: "Book a time", short: "Booking" },
      ],
      done: "Done in 2 min",
    },
  },
  ar: {
    agent: {
      badge: "المساعدون",
      headline: ["اترك التخطيط إلى", "مساعد يتعلّم ذوقك."],
      intro: "يقارن الخيارات في الخلفية، ويتذكّر ما أعجبك سابقًا، ويعرض عليك أفضل القليل فقط.",
      actions: ["جرّبه مجانًا", "اكتشف كيف"],
      card: { title: "مساعد الرحلات", subtitle: "مقارنة 12 إقامة", status: "قيد العمل", sources: ["الويب", "المحفوظات", "البريد"], result: "3 إقامات تناسب ميزانيتك" },
    },
    workflow: {
      badge: "الأتمتة",
      headline: ["أبقِ كل خطوة تتحرك", "دون أن ترفع إصبعًا."],
      intro: "تنتقل الطلبات والردود والحجوزات من خطوة إلى أخرى وأنت تتابع يومك.",
      actions: ["جرّبه مجانًا", "اكتشف كيف"],
      steps: [
        { label: "طلب جديد", short: "طلب" },
        { label: "تجهيز الرد", short: "رد" },
        { label: "حجز موعد", short: "حجز" },
      ],
      done: "تم في دقيقتين",
    },
  },
}

/** Figma's three glows, placed in the 584 × 440 picture: x, y, width, height, colour and strength. */
const GLOWS: { x: number; y: number; w: number; h: number; strength: number }[] = [
  { x: 0, y: 0, w: 504, h: 403, strength: 0.55 },
  { x: 224, y: 132, w: 504, h: 403, strength: 0.5 },
  { x: -84, y: 220, w: 392, h: 314, strength: 0.4 },
]

function Band({ tone, glows, copy, children }: { tone: string; glows: [HowItWorksGlowTone, HowItWorksGlowTone, HowItWorksGlowTone]; copy: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-6 rounded-[2rem] p-3 [@container(min-width:40rem)]:p-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-8 [@container(min-width:64rem)]:p-4 [@container(min-width:64rem)]:ps-8", tone)}>
      <div className="flex flex-col gap-4 p-3 [@container(min-width:64rem)]:w-1/2 [@container(min-width:64rem)]:p-0">{copy}</div>
      <div
        aria-hidden="true"
        className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-3xl bg-accent [@container(min-width:40rem)]:h-[360px] [@container(min-width:64rem)]:h-[440px] [@container(min-width:64rem)]:w-1/2"
      >
        {GLOWS.map((glow, index) => (
          <HowItWorksGlow
            key={index}
            tone={glows[index] ?? "chart-1"}
            strength={glow.strength}
            data-reveal="glow"
            style={{ insetInlineStart: glow.x, top: glow.y, width: glow.w, height: glow.h, opacity: glow.strength }}
          />
        ))}
        {children}
      </div>
    </div>
  )
}

function BandCopy({ badge, headline, intro, actions }: { badge: React.ReactNode; headline: [React.ReactNode, React.ReactNode]; intro: React.ReactNode; actions: [React.ReactNode, React.ReactNode] }) {
  return (
    <>
      <div>
        <Badge variant="soft" tone="warning" size="md" radius="rounded">
          {badge}
        </Badge>
      </div>
      <h2 className="flex flex-col text-3xl font-medium text-foreground [@container(min-width:64rem)]:text-4xl">
        <span>{headline[0]}</span>
        <span className="text-primary">{headline[1]}</span>
      </h2>
      <p className="text-base text-muted-foreground">{intro}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="md">{actions[0]}</Button>
        <Button size="md" variant="outline">
          {actions[1]}
        </Button>
      </div>
    </>
  )
}

const SOURCE_ICONS = [Globe, Heart, Mail]
const STEP_ICONS = [Mail, Sparkles, Calendar]

export interface HowItWorksSplitFeatureBandProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksSplitFeatureBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

/** What names the section for a screen reader: it has no heading of its own, only one per band. */
const LABELS: Record<HowItWorksLocale, string> = { en: "How it works", ar: "كيف يعمل" }

export function HowItWorksSplitFeatureBand({ locale = "en", agent, workflow, className, ...props }: HowItWorksSplitFeatureBandProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const a = agent ?? copy.agent
  const w = workflow ?? copy.workflow

  useRevealOnEnter(rootRef, (node) => {
    const animations: Animation[] = []
    revealTargets(node, "glow").forEach((glow, index) => {
      const x = index % 2 === 0 ? 20 : -20
      animations.push(glow.animate([{ transform: "translate(0, 0)" }, { transform: `translate(${x}px, ${-x}px)` }, { transform: "translate(0, 0)" }], { duration: 5000, easing: "ease-in-out" }))
    })
    revealTargets(node, "progress").forEach((bar) => {
      const rtl = getComputedStyle(bar).direction === "rtl"
      animations.push(enter(bar, [{ clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 700 }))
    })
    revealTargets(node, "source").forEach((el, i) => animations.push(enter(el, POP, { duration: 220, delay: 300 + i * 80 })))
    revealTargets(node, "result").forEach((el) => animations.push(enter(el, RISE, { duration: 400, delay: 700 })))
    revealTargets(node, "cursor").forEach((el) => animations.push(enter(el, [{ opacity: 0, transform: "translate(-24px, -16px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 600 })))
    const tiles = revealTargets(node, "step")
    const dot = revealTargets(node, "dot")[0]
    tiles.forEach((tile, i) => animations.push(tile.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 180, delay: i * 600 })))
    const [first, second, third] = tiles
    if (dot && first && second && third) {
      const centre = (tile: HTMLElement) => tile.getBoundingClientRect().left + tile.getBoundingClientRect().width / 2
      const hop = (tile: HTMLElement) => centre(tile) - centre(first)
      animations.push(
        dot.animate(
          [
            { opacity: 1, transform: "translateX(0px)" },
            { opacity: 1, transform: `translateX(${hop(second)}px)`, offset: 0.5 },
            { opacity: 1, transform: `translateX(${hop(third)}px)` },
          ],
          { duration: 1200, easing: "linear" }
        )
      )
    }
    revealTargets(node, "done").forEach((el) => animations.push(enter(el, POP, { duration: 220, delay: 1300 })))
    return animations
  })

  return (
    <HowItWorksSection ref={rootRef} aria-label={LABELS[locale]} className={className} {...props}>
      <Band tone="bg-accent" glows={["chart-4", "chart-1", "chart-5"]} copy={<BandCopy badge={a.badge} headline={a.headline} intro={a.intro} actions={a.actions} />}>
        <div className="relative flex w-60 flex-col gap-4 rounded-2xl bg-card p-5 pb-12 [@container(min-width:40rem)]:w-80">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-muted text-foreground">
              <Bot size={20} {...HOW_IT_WORKS_ICON} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-semibold text-foreground">{a.card.title}</span>
              <span className="text-xs text-muted-foreground">
                <HowItWorksFigures>{a.card.subtitle}</HowItWorksFigures>
              </span>
            </div>
            <Badge variant="soft" tone="success" size="sm" radius="rounded">
              {a.card.status}
            </Badge>
          </div>
          <div data-reveal="progress">
            <Progress value={65} size="md" showPercentage={false} aria-label={typeof a.card.title === "string" ? a.card.title : undefined} />
          </div>
          <div className="flex flex-wrap gap-2">
            {a.card.sources.map((source, index) => {
              const Icon = SOURCE_ICONS[index]
              if (!Icon) return null
              return (
                <span key={index} data-reveal="source" className="flex h-6 items-center gap-1.5 rounded-full bg-muted pe-3 ps-2 text-xs text-foreground">
                  <Icon size={12} {...HOW_IT_WORKS_ICON} />
                  {source}
                </span>
              )
            })}
          </div>
          <div data-reveal="result" className="flex items-center gap-2 rounded-[10px] bg-accent px-3 py-2 text-xs text-foreground">
            <Sparkles size={16} {...HOW_IT_WORKS_ICON} className="shrink-0" />
            <span className="min-w-0">
              <HowItWorksFigures>{a.card.result}</HowItWorksFigures>
            </span>
          </div>
          <MousePointer2 data-reveal="cursor" size={26} {...HOW_IT_WORKS_ICON} className="absolute bottom-3 end-5 fill-background text-foreground" />
        </div>
      </Band>

      <Band tone="bg-muted" glows={["info", "chart-2", "chart-3"]} copy={<BandCopy badge={w.badge} headline={w.headline} intro={w.intro} actions={w.actions} />}>
        <div className="relative flex w-full max-w-[460px] flex-col items-center gap-8 px-3">
          <div className="relative flex w-full items-start justify-between">
            {w.steps.map((step, index) => {
              const Icon = STEP_ICONS[index]
              if (!Icon) return null
              return (
                <React.Fragment key={index}>
                  <div className="flex w-14 flex-col items-center gap-2 overflow-visible [@container(min-width:40rem)]:w-24">
                    <span
                      data-reveal="step"
                      className="flex size-14 items-center justify-center rounded-2xl bg-card text-foreground [@container(min-width:40rem)]:size-[88px]"
                    >
                      <Icon size={28} {...HOW_IT_WORKS_ICON} className="[@container(min-width:40rem)]:size-9" />
                    </span>
                    <span className="whitespace-nowrap rounded-full bg-card px-3 py-1 text-xs text-foreground">
                      <span className="[@container(min-width:40rem)]:hidden">{step.short}</span>
                      <span className="hidden [@container(min-width:40rem)]:inline">{step.label}</span>
                    </span>
                  </div>
                  {index < 2 ? <span className="mt-7 h-0 flex-1 self-start border-t border-dashed border-card [@container(min-width:40rem)]:mt-11" /> : null}
                </React.Fragment>
              )
            })}
            <span data-reveal="dot" className="absolute start-[28px] top-[24px] size-2 rounded-full bg-success opacity-0 [@container(min-width:40rem)]:start-12 [@container(min-width:40rem)]:top-10" />
          </div>
          <span data-reveal="done">
            <Badge variant="solid" tone="success" size="md" radius="rounded">
              {w.done}
            </Badge>
          </span>
        </div>
      </Band>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksSplitFeatureBandCopy = COPY

"use client"

import * as React from "react"
import { Check, CircleCheck, Clock, FileText, Layers, Link2, MapPin, Package, Search, Users, WandSparkles, Wallet, X } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { enter, GROW_X, HowItWorksFigures, HowItWorksLtr, HowItWorksSection, POP, revealTargets, RISE, useRevealOnEnter, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Six-Card Grid.
 *
 * A centred heading over six cards, each a picture of the thing it names above
 * a title and a line: a plan with ticks, a sync status and its log, a shared
 * list with avatars, a hub with four tiles, a search with its result, and a
 * swap with the old line struck out. The pictures are drawn here, in the
 * tokens, and hidden from screen readers: the card's title and line say it.
 *
 * Desktop sets the cards three across, Tablet two across and Mobile one, as
 * Figma does. The page's `dir` mirrors the order and the pictures.
 *
 * Motion plays once, when the block comes into view, as Figma's card describes
 * it: the cards rise 90ms apart in reading order and each picture plays its
 * own beat (ticks, a pulsing ring, avatars, a drawn connector, a blinking
 * caret, a struck line). Every loop runs a few times and rests. Cards lift 2px
 * on hover. Under reduced motion the block is its finished state.
 *
 * Content limits: a card's title up to 24 characters and its line up to 90.
 * The pictures' own words are short: a name to 20, a time to 8, a note to 14.
 */

export interface HowItWorksSixCardGridCopy {
  /** The heading, an `h2`. */
  heading: React.ReactNode
  plan: { title: React.ReactNode; description: React.ReactNode; name: React.ReactNode; saved: React.ReactNode }
  sync: {
    title: React.ReactNode
    description: React.ReactNode
    status: React.ReactNode
    /** The two log lines, each a time and what happened. */
    log: [{ time: string; text: React.ReactNode }, { time: string; text: React.ReactNode }]
  }
  share: {
    title: React.ReactNode
    description: React.ReactNode
    badge: React.ReactNode
    /** The three avatars' names, such as "A", "S" and "J". */
    people: [string, string, string]
    /** The two access rows, each a name and what it can do. */
    rows: [{ name: React.ReactNode; access: React.ReactNode }, { name: React.ReactNode; access: React.ReactNode }]
  }
  fill: { title: React.ReactNode; description: React.ReactNode }
  search: {
    title: React.ReactNode
    description: React.ReactNode
    query: React.ReactNode
    result: { name: React.ReactNode; time: React.ReactNode }
    other: React.ReactNode
  }
  swap: { title: React.ReactNode; description: React.ReactNode; prompt: React.ReactNode; removed: React.ReactNode; added: React.ReactNode }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksSixCardGridCopy> = {
  en: {
    heading: "From plan to plate",
    plan: { title: "Plan your week", description: "Drop in your meals and get a tidy plan with a shopping list.", name: "Dinner plan", saved: "Saved" },
    sync: {
      title: "Always up to date",
      description: "Changes sync quietly across all your devices.",
      status: "Syncing across devices",
      log: [
        { time: "09:00", text: "Plan updated" },
        { time: "09:02", text: "List refreshed" },
      ],
    },
    share: {
      title: "Cook together",
      description: "Share the plan with your household and edit it together.",
      badge: "Shared",
      people: ["A", "S", "J"],
      rows: [
        { name: "Family", access: "Can edit" },
        { name: "Friends with the link", access: "Can view" },
      ],
    },
    fill: { title: "Fill the gaps", description: "Missing items go straight to the store you prefer." },
    search: {
      title: "Find any recipe",
      description: "Search by ingredient, time or mood and get ideas instantly.",
      query: "quick pasta",
      result: { name: "Weeknight pasta", time: "12 min" },
      other: "Veggie curry",
    },
    swap: {
      title: "Swap in a tap",
      description: "Change an ingredient and the whole recipe adjusts.",
      prompt: "Swap in something dairy-free",
      removed: "Cream and butter",
      added: "Coconut milk",
    },
  },
  ar: {
    heading: "من الخطة إلى المائدة",
    plan: { title: "خطّط لأسبوعك", description: "أضف وجباتك واحصل على خطة منظمة مع قائمة تسوّق.", name: "خطة العشاء", saved: "محفوظة" },
    sync: {
      title: "محدّثة دائمًا",
      description: "تتزامن التغييرات بهدوء على جميع أجهزتك.",
      status: "المزامنة بين الأجهزة",
      log: [
        { time: "09:00", text: "تم تحديث الخطة" },
        { time: "09:02", text: "تم تحديث القائمة" },
      ],
    },
    share: {
      title: "اطبخوا معًا",
      description: "شارك الخطة مع أهل بيتك وعدّلوها معًا.",
      badge: "مشتركة",
      people: ["أ", "س", "ج"],
      rows: [
        { name: "العائلة", access: "يمكنهم التعديل" },
        { name: "الأصدقاء عبر الرابط", access: "يمكنهم العرض" },
      ],
    },
    fill: { title: "أكمل النواقص", description: "تُرسل المنتجات الناقصة مباشرة إلى المتجر الذي تفضّله." },
    search: {
      title: "اعثر على أي وصفة",
      description: "ابحث بالمكوّن أو الوقت أو المزاج واحصل على أفكار فورًا.",
      query: "معكرونة سريعة",
      result: { name: "معكرونة لليلة عادية", time: "12 دقيقة" },
      other: "كاري الخضار",
    },
    swap: {
      title: "استبدل بنقرة",
      description: "غيّر مكوّنًا واحدًا فتتكيّف الوصفة كلها.",
      prompt: "استبدله بشيء خالٍ من الألبان",
      removed: "القشدة والزبدة",
      added: "حليب جوز الهند",
    },
  },
}

/** The picture's frame: `muted`, 220px tall, its content centred, with 20px at the sides and top and none below. */
function Visual({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex h-[220px] w-full flex-col items-center justify-center gap-2 overflow-hidden bg-muted px-5 pt-5", className)}>
      {children}
    </div>
  )
}

function Card({ title, description, children }: { title: React.ReactNode; description: React.ReactNode; children: React.ReactNode }) {
  return (
    <li
      data-reveal="card"
      className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-background transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none hover:motion-reduce:translate-y-0"
    >
      <article className="flex h-full flex-col">
        <Visual>{children}</Visual>
        <div className="flex flex-col gap-1.5 p-5">
          <h3 className="text-base font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </article>
    </li>
  )
}

const PANEL = "rounded-lg border border-border bg-card"
const BAR_WIDTHS = ["w-[61%]", "w-[50%]", "w-[67%]"]

export interface HowItWorksSixCardGridProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksSixCardGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

export function HowItWorksSixCardGrid({ locale = "en", heading, plan, sync, share, fill, search, swap, className, ...props }: HowItWorksSixCardGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const p = plan ?? copy.plan
  const s = sync ?? copy.sync
  const sh = share ?? copy.share
  const f = fill ?? copy.fill
  const q = search ?? copy.search
  const w = swap ?? copy.swap

  useRevealOnEnter(rootRef, (node) => {
    const animations: Animation[] = []
    revealTargets(node, "card").forEach((card, index) => {
      const base = index * 90
      animations.push(enter(card, RISE, { duration: 400, delay: base, easing: "cubic-bezier(0, 0, 0.2, 1)" }))
      const inner = (name: string) => Array.from(card.querySelectorAll<HTMLElement | SVGElement>(`[data-reveal="${name}"]`))
      inner("tick").forEach((el, i) => animations.push(enter(el, POP, { duration: 160, delay: base + 300 + i * 160 })))
      inner("pulse").forEach((el) =>
        animations.push(el.animate([{ transform: "scale(1)", opacity: 0.25 }, { transform: "scale(2.2)", opacity: 0 }], { duration: 1600, iterations: 3, delay: base + 300, easing: "ease-out" }))
      )
      inner("log").forEach((el, i) => animations.push(enter(el, RISE, { delay: base + 400 + i * 120 })))
      inner("avatar").forEach((el, i) =>
        animations.push(enter(el, [{ opacity: 0, transform: "translateX(-8px)" }, { opacity: 1, transform: "none" }], { delay: base + 300 + i * 80 }))
      )
      inner("chip").forEach((el, i) => animations.push(enter(el, POP, { duration: 220, delay: base + 600 + i * 100 })))
      inner("connector").forEach((el) => {
        const length = (el as SVGLineElement).getTotalLength?.() ?? 60
        animations.push(enter(el, [{ strokeDashoffset: `${length}`, opacity: 0 }, { strokeDashoffset: "0", opacity: 1 }], { duration: 700, delay: base + 200 }))
      })
      inner("tile").forEach((el, i) => animations.push(enter(el, POP, { duration: 260, delay: base + 300 + i * 80 })))
      inner("caret").forEach((el) =>
        animations.push(el.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 800, iterations: 3, delay: base + 300 }))
      )
      inner("lift").forEach((el) => animations.push(enter(el, [{ transform: "translateY(4px)" }, { transform: "none" }], { delay: base + 500 })))
      inner("strike").forEach((el) => animations.push(enter(el, GROW_X, { duration: 240, delay: base + 400 })))
      inner("added").forEach((el) => animations.push(enter(el, RISE, { delay: base + 640 })))
    })
    return animations
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-center gap-4">
        <h2 id={headingId} className="text-center text-2xl font-medium text-foreground [@container(min-width:40rem)]:text-3xl">
          {heading ?? copy.heading}
        </h2>
      </header>

      <ul className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
        <Card title={p.title} description={p.description}>
          <div className={cn(PANEL, "flex w-full flex-col gap-3 p-4")}>
            <div className="flex items-center gap-2">
              <FileText size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{p.name}</span>
              <Badge variant="soft" tone="success" size="sm" radius="rounded">
                {p.saved}
              </Badge>
            </div>
            {BAR_WIDTHS.map((width, index) => (
              <div key={index} className="flex items-center gap-2">
                <CircleCheck data-reveal="tick" size={14} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
                <span className={cn("h-2 rounded-full bg-muted", width)} />
              </div>
            ))}
          </div>
        </Card>

        <Card title={s.title} description={s.description}>
          <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3">
            <span className="relative flex size-[22px] shrink-0 items-center justify-center">
              <span data-reveal="pulse" className="absolute inset-0 rounded-full bg-success/25" />
              <span className="size-2.5 rounded-full bg-success" />
            </span>
            <span className="text-sm font-medium text-foreground">{s.status}</span>
          </div>
          <div className="flex w-full flex-col gap-2 px-2 pt-2">
            {s.log.map((entry) => (
              <div key={entry.time} data-reveal="log" className="flex items-center gap-2 text-xs">
                <Clock size={14} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-muted-foreground" />
                <HowItWorksLtr className="font-medium text-foreground">{entry.time}</HowItWorksLtr>
                <span className="min-w-0 truncate text-muted-foreground">{entry.text}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title={sh.title} description={sh.description}>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {sh.people.map((name) => (
                <span key={name} data-reveal="avatar">
                  <Avatar variant="initials" size="24" radius="rounded" border name={name} />
                </span>
              ))}
            </div>
            <span data-reveal="chip">
              <Badge variant="solid" tone="success" size="sm" radius="rounded">
                {sh.badge}
              </Badge>
            </span>
          </div>
          {sh.rows.map((row, index) => (
            <div key={index} className={cn(PANEL, "flex w-full items-center gap-2 px-3 py-2")}>
              {index === 0 ? (
                <Users size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
              ) : (
                <Link2 size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
              )}
              <div className="flex min-w-0 flex-col text-xs">
                <span className="truncate font-medium text-foreground">{row.name}</span>
                <span className="truncate text-muted-foreground">{row.access}</span>
              </div>
            </div>
          ))}
        </Card>

        <Card title={f.title} description={f.description}>
          <div className="relative h-[170px] w-[300px] max-w-full">
            <svg viewBox="0 0 300 170" className="absolute inset-0 size-full" fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 4">
              {(
                [
                  [78, 38, 128, 74],
                  [222, 38, 172, 74],
                  [78, 132, 128, 96],
                  [222, 132, 172, 96],
                ] as const
              ).map(([x1, y1, x2, y2]) => (
                <line key={`${x1}-${y1}`} data-reveal="connector" x1={x1} y1={y1} x2={x2} y2={y2} className="text-border" />
              ))}
            </svg>
            {(
              [
                [Package, 30, 14],
                [Wallet, 222, 14],
                [MapPin, 30, 108],
                [Clock, 222, 108],
              ] as const
            ).map(([Icon, x, y]) => (
              <span
                key={`${x}-${y}`}
                data-reveal="tile"
                className="absolute flex size-12 items-center justify-center rounded-xl border border-border bg-card text-foreground"
                style={{ insetInlineStart: `${(x / 300) * 100}%`, top: y }}
              >
                <Icon size={22} strokeWidth={1.5} absoluteStrokeWidth />
              </span>
            ))}
            <span
              data-reveal="tile"
              className="absolute flex size-14 items-center justify-center rounded-xl border border-primary bg-card text-foreground"
              style={{ insetInlineStart: `${(122 / 300) * 100}%`, top: 57 }}
            >
              <Layers size={26} strokeWidth={1.5} absoluteStrokeWidth />
            </span>
          </div>
        </Card>

        <Card title={q.title} description={q.description}>
          <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
            <Search size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" />
            <span className="min-w-0 flex-1 truncate">{q.query}</span>
            <span data-reveal="caret" className="h-3.5 w-px bg-foreground" />
          </div>
          <div data-reveal="lift" className="flex w-full flex-col gap-2 rounded-md border border-primary bg-card p-3">
            <div className="flex items-center gap-2">
              <Clock size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{q.result.name}</span>
              <Badge variant="soft" tone="warning" size="sm" radius="rounded">
                <HowItWorksFigures>{q.result.time}</HowItWorksFigures>
              </Badge>
            </div>
            <span className="h-1.5 w-[56%] rounded-full bg-muted" />
          </div>
          <div className="flex w-full flex-col gap-1 rounded-md border border-border bg-card p-3 opacity-70">
            <span className="truncate text-sm font-medium text-foreground">{q.other}</span>
            <span className="h-1.5 w-[45%] rounded-full bg-muted" />
          </div>
        </Card>

        <Card title={w.title} description={w.description}>
          <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <WandSparkles size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" />
            <span className="min-w-0 truncate">{w.prompt}</span>
          </div>
          <div className={cn(PANEL, "flex w-full flex-col gap-2 p-3")}>
            <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-xs text-muted-foreground">
              <X size={14} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" />
              <span className="relative min-w-0 truncate">
                {w.removed}
                <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px origin-left bg-muted-foreground [&:dir(rtl)]:origin-right" data-reveal="strike" />
              </span>
            </div>
            <div data-reveal="added" className="flex items-center gap-2 rounded-md border border-success bg-accent p-2 text-xs font-medium text-foreground">
              <Check size={14} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" />
              <span className="min-w-0 truncate">{w.added}</span>
            </div>
          </div>
        </Card>
      </ul>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksSixCardGridCopy = COPY

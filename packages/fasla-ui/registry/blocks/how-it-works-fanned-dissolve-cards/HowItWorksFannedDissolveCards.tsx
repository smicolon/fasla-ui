"use client"

import * as React from "react"
import { Clock, MapPin, MousePointer2 } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Progress } from "../../ui/progress/progress"
import {
  HOW_IT_WORKS_ICON,
  enter,
  HowItWorksFigures,
  HowItWorksGlow,
  HowItWorksSection,
  revealTargets,
  useRevealOnEnter,
  type HowItWorksGlowTone,
  type HowItWorksLocale,
} from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Fanned Dissolve Cards.
 *
 * A block on the inverted surface (`background-inverse`, with `foreground-inverse`
 * text): a soft badge, the heading and a line, then three cards 500px tall. A
 * card is a 300px scene on soft blurred glows, in theme tokens, above its number
 * and title. The scene's lower edge dissolves into the card with a row of
 * square pixels, so the picture seems to melt into the text. The scenes are
 * drawn here and hidden from screen readers: a place field, a route result with
 * a bar, and a list of trips with their status.
 *
 * Desktop sets the cards three across with the middle one tilted -3°. Tablet and
 * Mobile stack one card per row with no tilt, since a tilted card overflows a
 * narrow column. The page's `dir` mirrors the order and turns the tilt to +3°, so
 * the card still leans toward the start of reading.
 *
 * Motion plays once, when the block comes into view: the cards start stacked a
 * little low and small and fan out to their places, 120ms apart; the pixel
 * squares scale in with delays between 0 and 400ms, so the picture seems to
 * dissolve; the place field types its text, the route bar fills to 20%, and the
 * trip rows slide in 60ms apart. Hovering the row straightens the tilted card and
 * lifts all three 4px. Under reduced motion the block is its finished state.
 *
 * Content limits: the heading up to 52 characters, the line up to 70. A card's
 * title up to 24 characters.
 */

export type HowItWorksTripTone = "destructive" | "success" | "warning"

export interface HowItWorksTrip {
  name: React.ReactNode
  status: React.ReactNode
  tone: HowItWorksTripTone
}

export interface HowItWorksFannedDissolveCardsCopy {
  /** The soft badge above the heading. */
  badge: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  description: React.ReactNode
  /** The three cards' titles. The numbers are drawn from 01. */
  titles: [React.ReactNode, React.ReactNode, React.ReactNode]
  /** The words inside the scenes. */
  scene: {
    place: string
    routeTitle: React.ReactNode
    routeNote: React.ReactNode
    short: React.ReactNode
    long: React.ReactNode
    /** The four trips of the third scene. */
    trips: [HowItWorksTrip, HowItWorksTrip, HowItWorksTrip, HowItWorksTrip]
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksFannedDissolveCardsCopy> = {
  en: {
    badge: "How it works",
    heading: "Three taps from where you are to where you are going.",
    description: "Plan any trip in seconds and share it with whoever is coming along.",
    titles: ["Start with a place", "Get the best route", "Compare a few trips"],
    scene: {
      place: "Central Station",
      routeTitle: "Fastest route found",
      routeNote: "18 minutes, with one change on the way.",
      short: "Short",
      long: "Long",
      trips: [
        { name: "Bus 42", status: "Delayed", tone: "destructive" },
        { name: "Tram 7", status: "On time", tone: "success" },
        { name: "Train 3", status: "Busy", tone: "warning" },
        { name: "Bike lane", status: "Clear", tone: "success" },
      ],
    },
  },
  ar: {
    badge: "كيف يعمل",
    heading: "ثلاث نقرات من موقعك إلى وجهتك.",
    description: "خطّط لأي رحلة في ثوانٍ وشاركها مع من سيرافقك.",
    titles: ["ابدأ بمكان", "احصل على أفضل مسار", "قارن بين عدة رحلات"],
    scene: {
      place: "المحطة المركزية",
      routeTitle: "تم العثور على أسرع مسار",
      routeNote: "18 دقيقة مع تبديل واحد في الطريق.",
      short: "قصير",
      long: "طويل",
      trips: [
        { name: "الحافلة 42", status: "متأخرة", tone: "destructive" },
        { name: "الترام 7", status: "في الموعد", tone: "success" },
        { name: "القطار 3", status: "مزدحم", tone: "warning" },
        { name: "مسار الدراجات", status: "خالٍ", tone: "success" },
      ],
    },
  },
}

const GLOW_SETS: [HowItWorksGlowTone, HowItWorksGlowTone, HowItWorksGlowTone][] = [
  ["chart-4", "chart-1", "chart-5"],
  ["info", "chart-2", "chart-3"],
  ["chart-2", "success", "info"],
]
/** The glows in a 393 × 300 scene: Figma's three, as left, top, width, height and strength. */
const GLOWS = [
  { x: 0, y: 0, w: 353, h: 283, strength: 0.55 },
  { x: 157, y: 77, w: 353, h: 283, strength: 0.5 },
  { x: -59, y: 155, w: 275, h: 220, strength: 0.4 },
] as const
/**
 * Where a card's pixel squares start along the scene's foot, from the start
 * edge: Figma's first square for each card, then one every 96px. The row
 * runs the card's width: three squares on Mobile, four on Desktop, seven on
 * Tablet, where the card is one wide column. `SHOWN_FROM` says which
 * squares each width shows.
 */
const PIXEL_START = [0, 17, 10]
const PIXEL_COUNT = 7
const SHOWN_FROM = [
  "",
  "",
  "",
  "hidden [@container(min-width:40rem)]:block",
  "hidden [@container(min-width:40rem)]:block [@container(min-width:64rem)]:hidden",
  "hidden [@container(min-width:40rem)]:block [@container(min-width:64rem)]:hidden",
  "hidden [@container(min-width:40rem)]:block [@container(min-width:64rem)]:hidden",
]
/** A fixed spread of delays between 0 and 400ms, so the dissolve is irregular but the same every time. */
const DISSOLVE = [180, 40, 320, 400, 110, 260, 20, 360, 90, 300]

export interface HowItWorksFannedDissolveCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksFannedDissolveCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

export function HowItWorksFannedDissolveCards({ locale = "en", badge, heading, description, titles, scene, className, ...props }: HowItWorksFannedDissolveCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const names = titles ?? copy.titles
  const words = scene ?? copy.scene

  useRevealOnEnter(rootRef, (node) => {
    const started: Animation[] = []
    revealTargets(node, "card").forEach((card, index) => {
      const delay = index * 120
      const rest = getComputedStyle(card).transform
      const end = rest && rest !== "none" ? rest : "none"
      started.push(enter(card, [{ opacity: 0, transform: "translateY(24px) scale(0.96)" }, { opacity: 1, transform: end }], { duration: 520, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }))
      Array.from(card.querySelectorAll<HTMLElement>('[data-reveal="pixel"]')).forEach((pixel, i) =>
        started.push(enter(pixel, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 200, delay: delay + 300 + (DISSOLVE[(index * 5 + i) % DISSOLVE.length] ?? 0) }))
      )
      Array.from(card.querySelectorAll<HTMLElement>('[data-reveal="row"]')).forEach((row, i) =>
        started.push(enter(row, [{ opacity: 0, transform: "translateX(-12px)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: delay + 500 + i * 60 }))
      )
      const rtl = getComputedStyle(card).direction === "rtl"
      Array.from(card.querySelectorAll<HTMLElement>('[data-reveal="type"]')).forEach((text) =>
        started.push(enter(text, [{ clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 700, delay: delay + 450, easing: "steps(14, end)" }))
      )
      Array.from(card.querySelectorAll<HTMLElement>('[data-reveal="bar"]')).forEach((bar) =>
        started.push(enter(bar, [{ clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 600, delay: delay + 500 }))
      )
    })
    return started
  })

  const stripe = "relative flex flex-col overflow-hidden rounded-3xl border border-muted-foreground bg-foreground text-foreground-inverse"
  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={`bg-background-inverse ${className ?? ""}`} {...props}>
      <header className="flex w-full flex-col items-start gap-4">
        <Badge variant="soft" tone="info" size="md" radius="rounded">
          {badge ?? copy.badge}
        </Badge>
        <h2 id={headingId} className="text-3xl font-medium text-foreground-inverse [@container(min-width:40rem)]:text-4xl [@container(min-width:64rem)]:text-5xl">
          {heading ?? copy.heading}
        </h2>
        <p className="text-base text-muted-foreground-inverse">{description ?? copy.description}</p>
      </header>

      <ol className="group/cards grid grid-cols-1 gap-6 [@container(min-width:64rem)]:grid-cols-3 [@container(min-width:64rem)]:gap-8 [@container(min-width:64rem)]:py-8">
        {[0, 1, 2].map((index) => (
          <li
            key={index}
            data-reveal="card"
            className={`${stripe} h-[500px] min-w-0 transition-transform duration-300 ease-out group-hover/cards:-translate-y-1 motion-reduce:transition-none ${
              index === 1 ? "[@container(min-width:64rem)]:-rotate-3 [@container(min-width:64rem)]:[&:dir(rtl)]:rotate-3 [@container(min-width:64rem)]:group-hover/cards:rotate-0" : ""
            }`}
          >
            <div aria-hidden="true" className="relative flex h-[300px] shrink-0 items-center justify-center overflow-hidden bg-accent">
              {GLOWS.map((glow, g) => (
                <HowItWorksGlow
                  key={g}
                  tone={GLOW_SETS[index]?.[g] ?? "chart-1"}
                  strength={glow.strength}
                  style={{ insetInlineStart: glow.x, top: glow.y, width: glow.w, height: glow.h, opacity: glow.strength }}
                />
              ))}

              {index === 0 ? (
                <>
                  <div className="absolute start-6 top-[70px] flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-3 text-sm text-foreground">
                    <MapPin size={18} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                    <span data-reveal="type" className="whitespace-nowrap">
                      {words.place}
                    </span>
                  </div>
                  <MousePointer2 size={26} {...HOW_IT_WORKS_ICON} className="absolute end-16 top-[104px] fill-background text-foreground" />
                </>
              ) : null}
              {index === 1 ? (
                <div className="relative flex w-[84%] flex-col gap-3 rounded-[14px] bg-card p-4 text-foreground">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock size={20} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                    <span className="min-w-0">{words.routeTitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <HowItWorksFigures>{words.routeNote}</HowItWorksFigures>
                  </p>
                  <div data-reveal="bar">
                    <Progress value={20} size="md" showPercentage={false} aria-label={typeof words.routeTitle === "string" ? words.routeTitle : undefined} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{words.short}</span>
                    <span>{words.long}</span>
                  </div>
                </div>
              ) : null}
              {index === 2 ? (
                <div className="relative flex w-[86%] flex-col gap-2 rounded-[14px] bg-card p-3 text-foreground">
                  {words.trips.map((trip, row) => (
                    <div key={row} data-reveal="row" className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <MapPin size={14} {...HOW_IT_WORKS_ICON} className="shrink-0" />
                        <span className="min-w-0 truncate">
                          <HowItWorksFigures>{trip.name}</HowItWorksFigures>
                        </span>
                      </span>
                      <Badge variant="soft" tone={trip.tone} size="sm" radius="rounded">
                        {trip.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : null}

              {Array.from({ length: PIXEL_COUNT }, (_, i) => (
                <span key={i} data-reveal="pixel" className={`absolute bottom-0 size-6 bg-foreground ${SHOWN_FROM[i]}`} style={{ insetInlineStart: (PIXEL_START[index] ?? 0) + i * 96 }} />
              ))}
            </div>
            <div className="flex flex-1 flex-col justify-end gap-3 p-6">
              <span className="text-xs text-muted-foreground-inverse">
                <HowItWorksFigures>{`0${index + 1}`}</HowItWorksFigures>
              </span>
              <h3 className="text-2xl font-medium text-foreground-inverse">{names[index]}</h3>
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
export const howItWorksFannedDissolveCardsCopy = COPY

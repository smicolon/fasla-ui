"use client"

import * as React from "react"
import { Hand, Lock, Nfc, Sparkles, Users } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Switch } from "../../ui/switch/switch"
import { HOW_IT_WORKS_ICON, enter, HowItWorksFigures, HowItWorksLtr, HowItWorksSection, revealTargets, useRevealOnEnter, type Cancellable, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Rounded Cards + Device Crop.
 *
 * A left-aligned header (a heading and a line), then three rounded cards. Each
 * is a numbered ring, a title and a line, a hairline, and a phone 420px tall
 * cropped by the card's 330px bottom half: a household with three switches, a
 * reader's waves, and a lock on a dark screen. Under the cards, a footer with
 * "Also works with" and three soft chips. The phones are drawn here and hidden
 * from screen readers; each card's title and line say what they show.
 *
 * Desktop sets the cards three across, 24px apart. Tablet and Mobile stack
 * them in one column; each phone stays centred and cropped at 330px so the
 * screen is always visible. The page's `dir` mirrors the order and the
 * switches' knobs.
 *
 * Motion plays once, when the block comes into view: the cards rise 16px 100ms
 * apart and each phone slides up behind its crop. In the first, the household
 * switches flip on one after another (180ms, 100ms apart) while the third
 * stays off; in the second, two rings expand from the disc three times
 * (1.8s each) and the Searching chip pulses with them, then both rest; in the
 * third, the lock tile pops (260ms) and Door unlocked fades in. Cards lift 2px
 * on hover. Under reduced motion the block is its finished state.
 *
 * The phone's body and the Door unlocked screen are solid black, with white
 * text, in Light and in Dark: Figma's `colors/base/black` and `colors/base/white`
 * (the `base-black` and `base-white` tokens), not `custom/black`, which flips.
 *
 * Content limits: the heading up to 24 characters, the line up to 70. A
 * card's title up to 22 and its line up to 40. A chip up to 12.
 */

export interface HowItWorksRoundedCardsDeviceCropCopy {
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  intro: React.ReactNode
  /** The three cards' titles and lines. */
  steps: [
    { title: React.ReactNode; description: React.ReactNode },
    { title: React.ReactNode; description: React.ReactNode },
    { title: React.ReactNode; description: React.ReactNode },
  ]
  /** The words on the phones' screens. */
  screens: {
    household: React.ReactNode
    /** The three presets, each a name and a count; the third is switched off. */
    presets: [{ name: React.ReactNode; count: React.ReactNode }, { name: React.ReactNode; count: React.ReactNode }, { name: React.ReactNode; count: React.ReactNode }]
    ready: React.ReactNode
    hold: React.ReactNode
    searching: React.ReactNode
    unlocked: React.ReactNode
    relock: React.ReactNode
  }
  /** The footer's lead-in, and its three chips. */
  alsoWorksWith: React.ReactNode
  chips: [React.ReactNode, React.ReactNode, React.ReactNode]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksRoundedCardsDeviceCropCopy> = {
  en: {
    heading: "Tap in, walk in",
    intro: "Add your household once, then tap to open. No keys, no codes.",
    steps: [
      { title: "Add your people", description: "Choose who can come in, and when." },
      { title: "Tap the reader", description: "Hold your phone near the door." },
      { title: "The door opens", description: "It locks itself again after a moment." },
    ],
    screens: {
      household: "Household",
      presets: [
        { name: "Family", count: "4 people" },
        { name: "Guests", count: "2 people" },
        { name: "Cleaners", count: "1 person" },
      ],
      ready: "Ready to unlock",
      hold: "Hold your phone near the reader",
      searching: "Searching…",
      unlocked: "Door unlocked",
      relock: "Locks again in 30 seconds",
    },
    alsoWorksWith: "Also works with",
    chips: ["Keypad", "Fob", "Voice"],
  },
  ar: {
    heading: "المس وادخل",
    intro: "أضف أفراد بيتك مرة واحدة، ثم المس لتفتح. بلا مفاتيح ولا رموز.",
    steps: [
      { title: "أضف أفراد بيتك", description: "حدّد من يمكنه الدخول ومتى." },
      { title: "المس القارئ", description: "قرّب هاتفك من الباب." },
      { title: "يُفتح الباب", description: "يُقفل من جديد بعد لحظة." },
    ],
    screens: {
      household: "أهل البيت",
      presets: [
        { name: "العائلة", count: "4 أشخاص" },
        { name: "الضيوف", count: "شخصان" },
        { name: "عمال النظافة", count: "شخص واحد" },
      ],
      ready: "جاهز للفتح",
      hold: "قرّب هاتفك من القارئ",
      searching: "جارٍ البحث…",
      unlocked: "تم فتح الباب",
      relock: "يُقفل بعد 30 ثانية",
    },
    alsoWorksWith: "يعمل أيضًا مع",
    chips: ["لوحة الأرقام", "مفتاح إلكتروني", "الصوت"],
  },
}

const PRESET_ICONS = [Users, Hand, Sparkles]
/** Which household switches end on: Family and Guests, not Cleaners. */
const SWITCHES_ON = [true, true, false]

function Card({ number, title, description, children }: { number: number; title: React.ReactNode; description: React.ReactNode; children: React.ReactNode }) {
  return (
    <li
      data-reveal="card"
      className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-background transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none hover:motion-reduce:translate-y-0"
    >
      <article className="flex h-full flex-col">
        <div className="flex flex-col gap-3 p-6">
          <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
            <HowItWorksLtr>{number}</HowItWorksLtr>
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div role="presentation" className="border-t border-border" />
        <div aria-hidden="true" className="pointer-events-none flex h-[330px] justify-center overflow-hidden bg-background px-6 pt-6">
          <div data-reveal="phone" className="h-[420px] w-60 shrink-0 rounded-[2rem] bg-base-black p-2">
            {children}
          </div>
        </div>
      </article>
    </li>
  )
}

/** A phone's screen: 224 × 404, with 24px above and 16px around its content. */
function Screen({ tone, className, children }: { tone: "light" | "dark"; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex h-full flex-col gap-3 rounded-3xl border border-muted-foreground px-4 pb-4 pt-6", tone === "light" ? "bg-background" : "bg-base-black", className)}>{children}</div>
  )
}

export interface HowItWorksRoundedCardsDeviceCropProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksRoundedCardsDeviceCropCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

export function HowItWorksRoundedCardsDeviceCrop({ locale = "en", heading, intro, steps, screens, alsoWorksWith, chips, className, ...props }: HowItWorksRoundedCardsDeviceCropProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const cards = steps ?? copy.steps
  const words = screens ?? copy.screens
  const [switches, setSwitches] = React.useState(SWITCHES_ON)

  useRevealOnEnter(rootRef, (node) => {
    const started: Cancellable[] = []
    revealTargets(node, "card").forEach((card, index) =>
      started.push(enter(card, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: index * 100 }))
    )
    revealTargets(node, "phone").forEach((phone, index) =>
      started.push(enter(phone, [{ transform: "translateY(40px)" }, { transform: "none" }], { duration: 500, delay: index * 100 + 150 }))
    )
    revealTargets(node, "ring").forEach((ring, index) =>
      started.push(ring.animate([{ transform: "scale(0.6)", opacity: 0.6 }, { transform: "scale(1.2)", opacity: 0 }], { duration: 1800, iterations: 3, delay: 500 + index * 300, easing: "ease-out" }))
    )
    revealTargets(node, "searching").forEach((chip) => started.push(chip.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: 1800, iterations: 3, delay: 500 })))
    revealTargets(node, "lock").forEach((lock) =>
      started.push(lock.animate([{ transform: "scale(0.8)", opacity: 0 }, { transform: "scale(1.05)", opacity: 1, offset: 0.7 }, { transform: "scale(1)", opacity: 1 }], { duration: 260, delay: 700, fill: "backwards" }))
    )
    revealTargets(node, "unlocked").forEach((text) => started.push(enter(text, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 900 })))
    // The household switches start off and flip on one after another; the third stays off.
    const timers: number[] = []
    setSwitches([false, false, false])
    SWITCHES_ON.forEach((on, index) => {
      if (on) timers.push(window.setTimeout(() => setSwitches((current) => current.map((value, i) => (i === index ? true : value))), 700 + index * 100))
    })
    started.push({
      cancel() {
        timers.forEach((timer) => window.clearTimeout(timer))
        setSwitches(SWITCHES_ON)
      },
    })
    return started
  })

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-start gap-3">
        <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-4xl">
          {heading ?? copy.heading}
        </h2>
        <p className="max-w-[520px] text-base text-muted-foreground">{intro ?? copy.intro}</p>
      </header>

      <ol className="grid grid-cols-1 gap-6 [@container(min-width:64rem)]:grid-cols-3 [@container(min-width:64rem)]:pt-8">
        <Card number={1} title={cards[0].title} description={cards[0].description}>
          <Screen tone="light">
            <span className="text-center text-sm font-medium text-foreground">{words.household}</span>
            {words.presets.map((preset, index) => {
              const Icon = PRESET_ICONS[index]
              if (!Icon) return null
              return (
                <div key={index} className="flex items-center gap-2 rounded-[10px] bg-muted p-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-card text-foreground">
                    <Icon size={16} {...HOW_IT_WORKS_ICON} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col text-xs">
                    <span className="truncate font-medium text-foreground">{preset.name}</span>
                    <span className="truncate text-muted-foreground">
                      <HowItWorksFigures>{preset.count}</HowItWorksFigures>
                    </span>
                  </span>
                  <Switch size="sm" checked={switches[index]} onChange={() => {}} tabIndex={-1} aria-label={typeof preset.name === "string" ? preset.name : undefined} />
                </div>
              )
            })}
          </Screen>
        </Card>

        <Card number={2} title={cards[1].title} description={cards[1].description}>
          <Screen tone="light" className="items-center">
            <div className="relative -mt-1 flex h-[150px] w-[200px] shrink-0 items-center justify-center">
              <span data-reveal="ring" className="absolute size-[150px] rounded-full border-2 border-border opacity-35" />
              <span data-reveal="ring" className="absolute size-28 rounded-full border-2 border-border opacity-60" />
              <span className="flex size-[72px] items-center justify-center rounded-full bg-muted text-foreground">
                <Nfc size={32} {...HOW_IT_WORKS_ICON} />
              </span>
            </div>
            <span className="mt-1 text-sm font-medium text-foreground">{words.ready}</span>
            <span className="text-center text-xs text-muted-foreground">{words.hold}</span>
            <span data-reveal="searching">
              <Badge variant="soft" tone="info" size="sm" radius="rounded">
                {words.searching}
              </Badge>
            </span>
          </Screen>
        </Card>

        <Card number={3} title={cards[2].title} description={cards[2].description}>
          <Screen tone="dark" className="items-center">
            <span data-reveal="lock" className="flex size-[72px] items-center justify-center rounded-2xl bg-base-white text-base-black">
              <Lock size={32} {...HOW_IT_WORKS_ICON} />
            </span>
            <div data-reveal="unlocked" className="flex flex-col items-center gap-3">
              <span className="text-sm text-base-white">{words.unlocked}</span>
              <span className="text-xs text-base-white/70">
                <HowItWorksFigures>{words.relock}</HowItWorksFigures>
              </span>
            </div>
          </Screen>
        </Card>
      </ol>

      <footer className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <span className="text-sm text-muted-foreground">{alsoWorksWith ?? copy.alsoWorksWith}</span>
        {(chips ?? copy.chips).map((chip, index) => (
          <Badge key={index} variant="soft" tone="secondary" size="md" radius="rounded">
            {chip}
          </Badge>
        ))}
      </footer>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksRoundedCardsDeviceCropCopy = COPY

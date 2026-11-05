"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { MahaamPauseButton, usePausedState, type MahaamPauseButtonLabels } from "./mahaam-pause-button"
import { useInView, usePageVisible, usePrefersReducedMotion } from "./mahaam-motion"

/*
 * Figma: `Mahaam Template` (47694:6712), the Testimonials section of each of its
 * six variants, and its motion card "Testimonials Stack".
 *
 * A centred heading over three colourful cards stacked like a hand of cards:
 * the front one flat, the second tilted one way and the third the other. Every
 * 6.5s the front card goes to the back and the next comes forward over 900ms.
 * Arrows and dots do the same by hand, and the active dot stretches from 8px to
 * 26px. Desktop and Tablet put the photo beside the quote; Mobile puts it above.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): the cards turn on their own. They
 * wait under the pointer, while the section is off screen and while the page
 * is hidden, and the pause button, which sits before the arrows, stops them.
 * Under `prefers-reduced-motion: reduce` they stay on the first card and the
 * button is not drawn; the arrows and dots still work.
 *
 * In Arabic the photo moves to the other side, the tilts and offsets mirror,
 * and the arrows swap places and chevrons, so the left one points left.
 *
 * The three tints are Figma's opacity/info/30 and opacity/success/30, which are
 * soft tokens, and opacity/warning/40, which has none and is built here over
 * the card colour from `warning`.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"

export interface MahaamTestimonial {
  quote: string
  name: string
  role: string
}

export interface MahaamTestimonialsCopy {
  /** The heading. A line break (`\n`) is a line break on screen. */
  heading: string
  /** Noura's, Khalid's and Faisal's, in the order they come forward. */
  items: [MahaamTestimonial, MahaamTestimonial, MahaamTestimonial]
  /** The names only assistive tech reads. */
  labels: { previous: string; next: string; dot: (position: number, total: number) => string; region: string }
}

const COPY: Record<Locale, MahaamTestimonialsCopy> = {
  en: {
    heading: "Loved by people\nwho talk for a living.",
    items: [
      { quote: "“I used to end every day with a notebook full of half-sentences. Now I talk on the drive home, and by morning every task has a date and an owner.”", name: "Noura Al-Harbi", role: "Head of Operations, Qamar" },
      { quote: "“The first task app my whole team kept using after week two. Nobody types anything anymore, and nothing falls through.”", name: "Khalid Mansour", role: "Founder, Basalt" },
      { quote: "“I switch between Arabic and English in the same sentence. Mahaam is the only tool that keeps up, and the recaps are actually useful.”", name: "Faisal Al-Otaibi", role: "Product Lead, Meridian" },
    ],
    labels: { previous: "Previous testimonial", next: "Next testimonial", dot: (p, t) => `Testimonial ${p} of ${t}`, region: "Testimonials" },
  },
  ar: {
    heading: "يحبه من يعملون بالكلام.",
    items: [
      { quote: "«كنت أنهي كل يوم بدفتر مليء بنصف جمل. الآن أتحدث وأنا عائدة إلى البيت، وفي الصباح يكون لكل مهمة موعد ومسؤول.»", name: "نورة الحربي", role: "رئيسة العمليات في قمر" },
      { quote: "«أول تطبيق مهام يواصل فريقي كله استخدامه بعد الأسبوع الثاني. لم يعد أحد يكتب شيئًا، ولا شيء يضيع.»", name: "خالد منصور", role: "مؤسس بازلت" },
      { quote: "«أنتقل بين العربية والإنجليزية في الجملة نفسها. مهام هو الأداة الوحيدة التي تواكبني، وملخصاته مفيدة فعلًا.»", name: "فيصل العتيبي", role: "قائد المنتج في ميريديان" },
    ],
    labels: { previous: "الشهادة السابقة", next: "الشهادة التالية", dot: (p, t) => `الشهادة ${p} من ${t}`, region: "الشهادات" },
  },
}

export interface MahaamTestimonialsProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamTestimonialsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** The three portraits, as the people come forward: Noura, Khalid, Faisal. */
  portraits?: { noura?: string; khalid?: string; faisal?: string }
  paused?: boolean
  defaultPaused?: boolean
  onPausedChange?: (paused: boolean) => void
  pauseLabels?: Partial<MahaamPauseButtonLabels>
  /** Which card is in front when it starts, 0 to 2. */
  index?: number
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

const TURN_MS = 6500

/** A card's place in the hand: its size, where its top-start corner sits and how it is tilted, per direction and size. */
const PLACE = {
  front: "left-0 top-0 z-[3] h-full w-full rotate-0",
  second:
    "z-[2] h-[96%] w-[96%] rotate-[-3.5deg] [--mahaam-x:-39px] [--mahaam-y:51.7px] [&:where(:dir(rtl))]:rotate-[3.5deg] [&:where(:dir(rtl))]:[--mahaam-x:31.3px] [&:where(:dir(rtl))]:[--mahaam-y:26.7px] [@container(min-width:48rem)]:[--mahaam-x:-30.8px] [@container(min-width:48rem)]:[--mahaam-y:62.8px] [@container(min-width:48rem)]:[&:dir(rtl)]:[--mahaam-x:57.5px] [@container(min-width:48rem)]:[&:dir(rtl)]:[--mahaam-y:5.8px] [@container(min-width:90rem)]:[--mahaam-x:-32.8px] [@container(min-width:90rem)]:[--mahaam-y:81.9px] [@container(min-width:90rem)]:[&:dir(rtl)]:[--mahaam-x:74.5px] [@container(min-width:90rem)]:[&:dir(rtl)]:[--mahaam-y:-8.1px]",
  third:
    "z-[1] h-[92%] w-[92%] rotate-[3deg] [--mahaam-x:50.9px] [--mahaam-y:69.6px] [&:where(:dir(rtl))]:rotate-[-3deg] [&:where(:dir(rtl))]:[--mahaam-x:-26.9px] [&:where(:dir(rtl))]:[--mahaam-y:69.6px] [@container(min-width:48rem)]:[--mahaam-x:65.1px] [@container(min-width:48rem)]:[--mahaam-y:59.6px] [@container(min-width:48rem)]:[&:dir(rtl)]:[--mahaam-x:-13.1px] [@container(min-width:48rem)]:[&:dir(rtl)]:[--mahaam-y:59.6px] [@container(min-width:90rem)]:[--mahaam-x:88.6px] [@container(min-width:90rem)]:[--mahaam-y:65.8px] [@container(min-width:90rem)]:[&:dir(rtl)]:[--mahaam-x:-7.4px] [@container(min-width:90rem)]:[&:dir(rtl)]:[--mahaam-y:65.8px]",
} as const

/** Each card's own tint over the card colour. */
const TINT = [
  // Noura: opacity/warning/40, built here: `warning` at 40% over the card, as Figma lays it.
  "bg-card bg-gradient-to-r from-[color-mix(in_srgb,var(--warning)_40%,transparent)] to-[color-mix(in_srgb,var(--warning)_40%,transparent)]",
  // Khalid: opacity/success/30.
  "bg-card bg-gradient-to-r from-soft-success-30 to-soft-success-30",
  // Faisal: opacity/info/30.
  "bg-card bg-gradient-to-r from-soft-info-30 to-soft-info-30",
]

export function MahaamTestimonials({
  locale = "en",
  heading,
  items,
  labels,
  portraits = {},
  paused: pausedProp,
  defaultPaused,
  onPausedChange,
  pauseLabels,
  index: startIndex = 0,
  reducedMotion,
  className,
  ...props
}: MahaamTestimonialsProps) {
  const copy = COPY[locale]
  const list = items ?? copy.items
  const l = { ...copy.labels, ...labels }
  const faces = [portraits.noura, portraits.khalid, portraits.faisal]
  const rootRef = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion(reducedMotion)
  const inView = useInView(rootRef)
  const visible = usePageVisible()
  const { paused, toggle } = usePausedState({ paused: pausedProp, defaultPaused, onPausedChange })
  const [hovered, setHovered] = React.useState(false)
  const [current, setCurrent] = React.useState(startIndex)
  const active = !paused && !reduced && inView && visible && !hovered
  const count = list.length

  // Every 6.5s the next card comes forward; using the arrows or dots starts the count again.
  React.useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => setCurrent((value) => (value + 1) % count), TURN_MS)
    return () => window.clearTimeout(timer)
  }, [active, current, count])

  const go = (step: number) => setCurrent((value) => (value + step + count) % count)
  const text = heading ?? copy.heading

  return (
    <section ref={rootRef} aria-label={l.region} className={cn("[container-type:inline-size]", className)} {...props}>
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-8 pb-24 pt-8 [@container(min-width:48rem)]:gap-14 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-36 [@container(min-width:48rem)]:pt-12 [@container(min-width:90rem)]:gap-16 [@container(min-width:90rem)]:px-28 [@container(min-width:90rem)]:pb-40 [@container(min-width:90rem)]:pt-16">
        <h2 className="whitespace-pre-line text-center text-3xl font-normal text-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl">{text}</h2>

        <div
          className="relative h-[600px] w-full [@container(min-width:48rem)]:h-[480px] [@container(min-width:90rem)]:h-[540px] [@container(min-width:90rem)]:max-w-[1000px]"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          {list.map((item, position) => {
            const rel = (position - current + count) % count
            const place = rel === 0 ? PLACE.front : rel === 1 ? PLACE.second : PLACE.third
            const front = rel === 0
            return (
              <figure
                key={item.name}
                aria-hidden={front ? undefined : true}
                className={cn(
                  "absolute flex origin-top-left flex-col gap-4 overflow-hidden rounded-[32px] p-5 transition-[left,top,width,height,transform] duration-[900ms] ease-out motion-reduce:transition-none",
                  "left-[var(--mahaam-x)] top-[var(--mahaam-y)] [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:gap-7 [@container(min-width:48rem)]:p-6",
                  TINT[position % 3],
                  place
                )}
              >
                <div className="order-first h-[200px] shrink-0 overflow-hidden rounded-2xl bg-muted [@container(min-width:48rem)]:order-last [@container(min-width:48rem)]:h-auto [@container(min-width:48rem)]:w-[240px] [@container(min-width:90rem)]:w-[400px]">
                  {faces[position] ? (
                    <img src={faces[position]} alt="" decoding="async" className="size-full object-cover [object-position:50%_0%] [@container(min-width:48rem)]:[object-position:50%_50%]" />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 px-2 pb-6 pt-0 [@container(min-width:48rem)]:gap-4 [@container(min-width:48rem)]:pb-5 [@container(min-width:48rem)]:pe-2 [@container(min-width:48rem)]:ps-6 [@container(min-width:48rem)]:pt-6">
                  <blockquote className="text-2xl text-foreground [@container(min-width:90rem)]:text-4xl">{item.quote}</blockquote>
                  <figcaption className="flex flex-col text-lg">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.role}</span>
                  </figcaption>
                </div>
              </figure>
            )
          })}
        </div>

        <div className="flex items-center gap-5">
          {reduced ? null : <MahaamPauseButton paused={paused} locale={locale} labels={pauseLabels} onClick={toggle} />}
          <Button type="button" variant="outline" tone="primary" size="icon-lg" radius="rounded" aria-label={l.previous} onClick={() => go(-1)}>
            <ChevronLeft aria-hidden="true" className="[&:dir(rtl)]:-scale-x-100" />
          </Button>
          <div className="flex items-center gap-1.5">
            {list.map((item, position) => (
              <button
                key={item.name}
                type="button"
                aria-label={l.dot(position + 1, count)}
                aria-current={position === current ? "true" : undefined}
                onClick={() => setCurrent(position)}
                className={cn(
                  "h-2 rounded-full transition-[width,background-color] duration-[400ms] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none",
                  position === current ? "w-[26px] bg-foreground" : "w-2 bg-border"
                )}
              />
            ))}
          </div>
          <Button type="button" variant="outline" tone="primary" size="icon-lg" radius="rounded" aria-label={l.next} onClick={() => go(1)}>
            <ChevronLeft aria-hidden="true" className="-scale-x-100 [&:dir(rtl)]:scale-x-100" />
          </Button>
        </div>
      </div>
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamTestimonialsCopy = COPY

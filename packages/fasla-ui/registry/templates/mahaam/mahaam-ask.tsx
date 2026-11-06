"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { MahaamPauseButton, usePausedState, type MahaamPauseButtonLabels } from "./mahaam-pause-button"
import { useInView, useLoopClock, usePageVisible, usePrefersReducedMotion } from "./mahaam-motion"

/*
 * Figma: `Mahaam Template` (47694:6712), the Ask section of each of its six
 * variants, and its motion card "Ask Memory".
 *
 * A heading over a field of memory cards that scroll in two rows, one each way,
 * with an ask box in the middle. The box types a question, shimmers
 * "Searching", then opens an answer with numbered sources, lights the cards it
 * cites (a 1.5px outline in `foreground`, a 3px rise) and dims the rest to 40%.
 * Three questions take 12s each. The rows run at constant speed, 60s and 66s
 * for one copy of six cards, and the field fades out over its outer 11.5%.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): everything here plays on its own
 * and loops. It waits under the pointer, while it is off screen and while the
 * page is hidden, and the pause button stops it. Under `prefers-reduced-motion:
 * reduce` it stays on the answered frame of Figma and the button is not drawn.
 *
 * In Arabic the rows travel the other way and the box mirrors, send arrow
 * included. On Mobile the "N sources" label moves from the question's row into
 * the answer.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"

export interface MahaamMemoryCard {
  kind: string
  when: string
  title: string
  body: string
}

export interface MahaamAskQuestion {
  question: string
  answer: string
  /** The cards the answer cites, as positions in `cards`, in the order of their numbers. */
  cites: number[]
  /** What each source is called. */
  sources: string[]
}

export interface MahaamAskCopy {
  heading: string
  subheading: string
  searching: string
  /** "2 sources", for `count` sources. */
  sourceCount: (count: number) => string
  /** The twelve memory cards: the first six in the top row, the rest in the bottom. */
  cards: MahaamMemoryCard[]
  questions: MahaamAskQuestion[]
}

const COPY: Record<Locale, MahaamAskCopy> = {
  en: {
    heading: "Ask anything you’ve ever said.",
    subheading: "Every note, call and task becomes memory you can search in plain words.",
    searching: "Searching",
    sourceCount: (count) => `${count} sources`,
    cards: [
      { kind: "Voice note", when: "Mon, 08:40", title: "Walk to work", body: "Supplier call, the dentist, and Khalid’s budget reply." },
      { kind: "Task", when: "Due Thu", title: "Sanad quote, final version", body: "Pricing table and delivery timeline still open." },
      { kind: "Recap", when: "Tue, 15:20", title: "Marketing sync", body: "Khalid checks the numbers by Friday. Noura owns the brief." },
      { kind: "Event", when: "Wed, 13:00", title: "Call with Sanad", body: "They asked for a first design draft on Sunday." },
      { kind: "Voice note", when: "Thu, 22:14", title: "Late idea", body: "A weekly digest for clients, every Sunday morning." },
      { kind: "Message", when: "Today", title: "Noura: can you send the deck?", body: "Before Tuesday’s review, if possible." },
      { kind: "Task", when: "Next week", title: "Book the studio", body: "For the campaign shoot in December." },
      { kind: "Recap", when: "Sun, 11:00", title: "Hiring debrief", body: "Strong yes for the designer. Offer goes out Tuesday." },
      { kind: "Event", when: "Thu, 10:00", title: "Design review", body: "Onboarding flow, now down to four steps." },
      { kind: "Voice note", when: "Yesterday", title: "Drive home", body: "Renew the office lease before the 15th." },
      { kind: "Task", when: "Waiting on you", title: "Reply to Khalid", body: "About the Q4 budget, before Friday." },
      { kind: "Recap", when: "Wed, 14:00", title: "Partner call", body: "Shared roadmap in Q1, then a joint webinar in March." },
    ],
    questions: [
      { question: "What did I promise Sanad?", answer: "Two things: the final quote by Thursday, and a first design draft on Sunday.", cites: [1, 3], sources: ["Sanad quote", "Call with Sanad"] },
      { question: "Who is waiting on me?", answer: "Noura needs the deck before Tuesday, and Khalid is still waiting on your budget reply.", cites: [5, 10, 2], sources: ["Message from Noura", "Reply to Khalid", "Marketing sync"] },
      { question: "Which ideas did I have this week?", answer: "A weekly digest for clients every Sunday, and a joint webinar with your partner in March.", cites: [4, 11], sources: ["Late idea", "Partner call"] },
    ],
  },
  ar: {
    heading: "اسأل عن أي شيء قلته يومًا.",
    subheading: "كل ملاحظة ومكالمة ومهمة تصبح ذاكرة تبحث فيها بكلماتك العادية.",
    searching: "جارٍ البحث",
    sourceCount: (count) => (count === 2 ? "مصدران" : `${count} مصادر`),
    cards: [
      { kind: "ملاحظة صوتية", when: "الاثنين 08:40", title: "المشي إلى العمل", body: "مكالمة المورّد، وطبيب الأسنان، ورد خالد على الميزانية." },
      { kind: "مهمة", when: "التسليم الخميس", title: "عرض سند، النسخة النهائية", body: "جدول الأسعار وجدول التسليم لا يزالان مفتوحين." },
      { kind: "ملخص", when: "الثلاثاء 15:20", title: "اجتماع التسويق", body: "يراجع خالد الأرقام بحلول الجمعة. وتتولى نورة المذكرة." },
      { kind: "حدث", when: "الأربعاء 13:00", title: "مكالمة مع سند", body: "طلبوا مسودة تصميم أولى يوم الأحد." },
      { kind: "ملاحظة صوتية", when: "الخميس 22:14", title: "فكرة ليلية", body: "ملخص أسبوعي للعملاء، كل صباح أحد." },
      { kind: "رسالة", when: "اليوم", title: "نورة: هل يمكنك إرسال العرض التقديمي؟", body: "قبل مراجعة الثلاثاء، إن أمكن." },
      { kind: "مهمة", when: "الأسبوع القادم", title: "حجز الاستوديو", body: "لجلسة تصوير الحملة في ديسمبر." },
      { kind: "ملخص", when: "الأحد 11:00", title: "مراجعة التوظيف", body: "موافقة بالإجماع على المصمم، ويُرسل العرض يوم الثلاثاء." },
      { kind: "حدث", when: "الخميس 10:00", title: "مراجعة التصميم", body: "مسار الانضمام صار أربع خطوات فقط." },
      { kind: "ملاحظة صوتية", when: "أمس", title: "الطريق إلى البيت", body: "جدّد عقد المكتب قبل يوم 15." },
      { kind: "مهمة", when: "بانتظارك", title: "الرد على خالد", body: "بخصوص ميزانية الربع الرابع، قبل الجمعة." },
      { kind: "ملخص", when: "الأربعاء 14:00", title: "مكالمة الشريك", body: "خارطة طريق مشتركة في الربع الأول، ثم ندوة مشتركة في مارس." },
    ],
    questions: [
      { question: "بماذا وعدتُ سند؟", answer: "أمران: العرض النهائي بحلول الخميس، ومسودة تصميم أولى يوم الأحد.", cites: [1, 3], sources: ["عرض سند", "مكالمة مع سند"] },
      { question: "من ينتظر مني ردًا؟", answer: "نورة تحتاج العرض التقديمي قبل الثلاثاء، وخالد ما زال ينتظر ردك على الميزانية.", cites: [5, 10, 2], sources: ["رسالة من نورة", "الرد على خالد", "اجتماع التسويق"] },
      { question: "ما الأفكار التي خطرت لي هذا الأسبوع؟", answer: "ملخص أسبوعي للعملاء كل يوم أحد، وندوة مشتركة مع شريكك في مارس.", cites: [4, 11], sources: ["فكرة ليلية", "مكالمة الشريك"] },
    ],
  },
}

export interface MahaamAskProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamAskCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  paused?: boolean
  defaultPaused?: boolean
  /** Holds the section on Figma's still frame without changing the pause button, which still shows Pause. For stills of the finished state. */
  still?: boolean
  onPausedChange?: (paused: boolean) => void
  pauseLabels?: Partial<MahaamPauseButtonLabels>
  /** Where in the 36s loop the section starts, 0 to 1. Without it, from the beginning, or from Figma's answered frame when paused. */
  progress?: number
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

/** Frames of 100ms: each question takes 120, and Figma's frame is the first question answered, at 80. */
const FRAME_MS = 100
const QUESTION_FRAMES = 120
const STILL = 80
const ROW_MS = [60000, 66000]

/** The dot before each card's kind: `foreground` for notes and tasks, then the status colours Figma gives recaps, events and messages. */
const KIND_DOT = ["bg-foreground", "bg-foreground", "bg-info", "bg-success", "bg-foreground", "bg-warning", "bg-foreground", "bg-info", "bg-success", "bg-foreground", "bg-foreground", "bg-info"]

const SHIMMER: Keyframe[] = [{ backgroundPosition: "220% 0" }, { backgroundPosition: "0 0" }]

function Shimmer({ children, active }: { children: React.ReactNode; active: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const element = ref.current
    if (!element || typeof element.animate !== "function") return
    const animation = element.animate(SHIMMER, { duration: 1200, iterations: Infinity, easing: "linear" })
    if (!active) animation.pause()
    return () => animation.cancel()
  }, [active])
  return (
    <span
      ref={ref}
      className="bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--foreground)_40%,var(--muted-foreground)_80%)] bg-[length:220%_100%] bg-clip-text text-transparent"
    >
      {children}
    </span>
  )
}

/** One row of cards, twice over, scrolling toward one end of the line at constant speed. */
function Row({ cards, toward, duration, active, reduced, className }: { cards: React.ReactNode; toward: "start" | "end"; duration: number; active: boolean; reduced: boolean; className: string }) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const firstRef = React.useRef<HTMLDivElement>(null)
  const secondRef = React.useRef<HTMLDivElement>(null)
  const animationRef = React.useRef<Animation | null>(null)
  const activeRef = React.useRef(active)
  activeRef.current = active

  React.useEffect(() => {
    const track = trackRef.current
    const first = firstRef.current
    const second = secondRef.current
    if (!track || !first || !second || reduced || typeof track.animate !== "function") return
    const play = () => {
      animationRef.current?.cancel()
      // One copy and the gap after it: where the second copy begins.
      const shift = Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().left)
      if (!shift) return
      // In English the second copy follows the first to the right; in Arabic, to the left.
      const sign = getComputedStyle(track).direction === "rtl" ? 1 : -1
      const away = sign * shift
      const [from, to] = toward === "start" ? [0, away] : [away, 0]
      animationRef.current = track.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }], { duration, iterations: Infinity, easing: "linear" })
      if (!activeRef.current) animationRef.current.pause()
    }
    play()
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(play) : null
    observer?.observe(first)
    return () => {
      observer?.disconnect()
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [duration, reduced, toward])

  React.useEffect(() => {
    const animation = animationRef.current
    if (!animation) return
    if (active) animation.play()
    else animation.pause()
  }, [active])

  return (
    <div className={cn("absolute inset-x-0 h-[122px]", className)}>
      <div ref={trackRef} className="flex w-max gap-3.5 will-change-transform">
        <div ref={firstRef} className="flex gap-3.5">
          {cards}
        </div>
        <div ref={secondRef} aria-hidden="true" className="flex gap-3.5">
          {cards}
        </div>
      </div>
    </div>
  )
}

export function MahaamAsk({
  locale = "en",
  heading,
  subheading,
  searching,
  sourceCount,
  cards,
  questions,
  paused: pausedProp,
  defaultPaused,
  still,
  onPausedChange,
  pauseLabels,
  progress,
  reducedMotion,
  className,
  ...props
}: MahaamAskProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion(reducedMotion)
  const inView = useInView(rootRef)
  const visible = usePageVisible()
  const { paused, toggle } = usePausedState({ paused: pausedProp, defaultPaused, onPausedChange })
  const frozen = paused || Boolean(still)
  const [hovered, setHovered] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => setReady(true), [])
  const active = !frozen && !reduced && inView && visible && !hovered
  const list = cards ?? copy.cards
  const qs = questions ?? copy.questions
  const count = sourceCount ?? copy.sourceCount
  const total = QUESTION_FRAMES * qs.length
  const from = progress !== undefined ? Math.floor(progress * total) : frozen ? STILL : 0
  const clock = useLoopClock({ length: total, intervalMs: FRAME_MS, active, from })
  const frame = reduced ? STILL : ready || progress !== undefined ? clock : STILL

  const index = Math.floor(frame / QUESTION_FRAMES) % qs.length
  const step = frame % QUESTION_FRAMES
  const q = qs[index] ?? qs[0]!
  const typedEnd = Math.ceil(q.question.length / 2) + 4
  const isSearching = step >= typedEnd && step < typedEnd + 12
  const answered = step >= typedEnd + 12 && step < QUESTION_FRAMES - 6
  const typed = q.question.slice(0, Math.max(0, Math.min(q.question.length, step * 2)))
  const rise = frame !== STILL

  const card = (item: MahaamMemoryCard, position: number) => {
    const hit = answered && q.cites.includes(position)
    return (
      <div
        key={position}
        className={cn(
          "flex h-[122px] w-[250px] shrink-0 flex-col gap-1.5 rounded-[14px] border bg-card px-3.5 py-3 transition-[opacity,transform,border-color] duration-500 motion-reduce:transition-none",
          hit ? "border-[1.5px] border-foreground px-[13.5px] py-[11.5px]" : "border-border",
          answered && !hit ? "opacity-40" : "opacity-100",
          hit && rise && "-translate-y-[3px]"
        )}
      >
        <div className="flex items-center justify-between text-xxs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-1.5 rounded-full", KIND_DOT[position])} />
            {item.kind}
          </span>
          <span>{item.when}</span>
        </div>
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.body}</p>
      </div>
    )
  }
  const top = list.slice(0, 6).map((item, i) => card(item, i))
  const bottom = list.slice(6).map((item, i) => card(item, i + 6))

  const sourcesLabel = isSearching ? <Shimmer active={active}>{searching ?? copy.searching}</Shimmer> : answered ? count(q.cites.length) : ""

  return (
    <section ref={rootRef} className={cn("relative [container-type:inline-size]", className)} {...props}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-8 pb-24 pt-12 [@container(min-width:48rem)]:gap-8 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-36 [@container(min-width:48rem)]:pt-12 [@container(min-width:90rem)]:gap-10 [@container(min-width:90rem)]:px-28 [@container(min-width:90rem)]:pb-40 [@container(min-width:90rem)]:pt-16">
        <div className="flex flex-col gap-4 [@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-end [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-8">
          <h2 className="text-3xl font-normal text-foreground [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:max-w-[560px]">{heading ?? copy.heading}</h2>
          <p className="text-base text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[380px]">{subheading ?? copy.subheading}</p>
        </div>

        <div
          className="relative h-[480px] overflow-hidden rounded-3xl bg-muted [@container(min-width:48rem)]:h-[440px]"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent,var(--foreground)_11.5%,var(--foreground)_88.5%,transparent)]">
            <Row cards={top} toward="start" duration={ROW_MS[0] ?? 60000} active={active} reduced={reduced} className="top-7" />
            <Row cards={bottom} toward="end" duration={ROW_MS[1] ?? 66000} active={active} reduced={reduced} className="top-[330px] [@container(min-width:48rem)]:top-[290px]" />
          </div>
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-24px_color-mix(in_srgb,var(--foreground)_25%,transparent)] [@container(min-width:48rem)]:inset-x-0 [@container(min-width:48rem)]:mx-auto [@container(min-width:48rem)]:w-[520px]">
            <div className="flex items-center gap-3 py-2.5 pe-2.5 ps-4">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="shrink-0 fill-foreground">
                <path d="M7 1l1.8 5.2L14 8l-5.2 1.8L7 15l-1.8-5.2L0 8l5.2-1.8z" transform="translate(1 0)" />
              </svg>
              <p className="relative min-h-6 min-w-0 flex-1 text-base text-foreground">
                {/* The whole question holds the room, so the row never moves as it types; the typed part is drawn over it. */}
                <span className="opacity-0">{q.question}</span>
                <span aria-hidden="true" className="absolute inset-0">
                  {typed}
                </span>
              </p>
              <span className="hidden text-xs font-medium text-muted-foreground [@container(min-width:48rem)]:block">{sourcesLabel}</span>
              <span aria-hidden="true" className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
                <ArrowRight size={14} strokeWidth={2.2} className="[&:dir(rtl)]:-scale-x-100" />
              </span>
            </div>
            <div className={cn("grid transition-[grid-template-rows] duration-[600ms] motion-reduce:transition-none", answered ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2.5 border-t border-border p-4">
                  <span className="text-xs font-medium text-muted-foreground [@container(min-width:48rem)]:hidden">{answered ? count(q.cites.length) : ""}</span>
                  <p className="text-sm text-foreground">{q.answer}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {q.sources.map((source, i) => (
                      <li key={source} className="flex items-center gap-1.5 rounded-full bg-muted py-0.5 pe-2 ps-1 text-xs text-foreground">
                        <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-xxs font-medium text-background">{i + 1}</span>
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {reduced ? null : (
        <MahaamPauseButton
          paused={paused}
          locale={locale}
          labels={pauseLabels}
          onClick={toggle}
          className="absolute end-8 top-0 z-10 [@container(min-width:48rem)]:end-16 [@container(min-width:48rem)]:top-0 [@container(min-width:90rem)]:end-28 [@container(min-width:90rem)]:top-4"
        />
      )}
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamAskCopy = COPY

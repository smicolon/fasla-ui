"use client"

import * as React from "react"
import { Mic } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"
import { MahaamPauseButton, usePausedState, type MahaamPauseButtonLabels } from "./mahaam-pause-button"
import { PULSE_KEYFRAMES, useEntrance, useInView, useLoopAnimation, useLoopClock, usePageVisible, usePrefersReducedMotion } from "./mahaam-motion"

/*
 * Figma: `Mahaam Template` (47694:6712), the Hero section of each of its six
 * variants (Breakpoint Desktop / Tablet / Mobile × Direction LTR / RTL).
 *
 * The copy on one side and a painting with a day planner on it on the other.
 * Desktop sets them side by side, five parts to seven; Tablet and Mobile stack
 * them. The planner is the product at work: a voice note types itself, and
 * three task blocks drop into their slots while the now line creeps down.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): this section plays on its own and
 * loops, which the repo's motion rules otherwise forbid. The loop is 200 frames
 * of 60ms. Under `prefers-reduced-motion: reduce`, or with `paused`, it holds
 * on the finished frame (170) or the frame you give, and the section shows
 * Figma's state. It also waits while the pointer is over the painting, and
 * while it is off screen. The pause control is not designed yet, so none is drawn.
 *
 * Sized by the section's own width, not the window's: it is a query container.
 * Mobile is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768)
 * and `[@container(min-width:90rem)]:` its Desktop, from 1440px.
 *
 * Direction is the page's `dir`: every side is a logical one, and the planner's
 * pixel geometry, which Figma draws per variant, switches on `:dir(rtl)`.
 *
 * Arabic strings with no Figma source (the badge's other counts and "Listening")
 * are written here in the same register as Figma's: «أُضيفت 3 مهام من ملاحظتك
 * الصوتية».
 */

type Locale = "en" | "ar"

export interface MahaamHeroTask {
  title: string
  /** The line under the title: time, kind and tag, as Figma sets it. */
  meta: string
  /** The tag's text, in the badge. */
  tag: string
  /** The checklist, for the task that has one. The first is ticked once the voice note has been handled. */
  subtasks?: string[]
}

export interface MahaamHeroCopy {
  /** The line beside the dot, above the heading. */
  eyebrow: string
  /** The heading. A line break (`\n`) is a line break on screen. */
  heading: string
  /** The paragraph under the heading. */
  body: string
  /** The solid button. */
  primaryCta: string
  /** The outline button. */
  secondaryCta: React.ReactNode
  /** The line beside the avatars. A line break (`\n`) is a line break on screen. */
  socialProof: React.ReactNode
  planner: {
    /** The planner's title. */
    day: string
    /** The badge before any task has landed. */
    listening: string
    /** The badge once `count` tasks have landed. */
    added: (count: number) => string
    /** The sentence the voice note types. */
    transcript: string
    /** The two blocks that were already in the day. */
    existing: { design: { title: string; time: string }; teamSync: string }
    /** The three blocks the voice note adds, in the order they land. */
    tasks: { call: MahaamHeroTask; lunch: MahaamHeroTask; sanad: MahaamHeroTask }
  }
}

/** Figma's copy, English and Arabic. «مهام» is masculine. */
const COPY: Record<Locale, MahaamHeroCopy> = {
  en: {
    eyebrow: "Voice-first task manager",
    heading: "Speak your day.\nMahaam sorts\nthe rest.",
    body: "Ramble on your way in. By the time you sit down, every task has a date, an owner and a slot in your week.",
    primaryCta: "Get Mahaam free",
    secondaryCta: "Watch the 60 sec demo",
    socialProof: "Trusted by 40,000 people\nwho would rather talk than type",
    planner: {
      day: "Thursday",
      listening: "Listening",
      added: (count) => `${count} added from your voice note`,
      transcript: "Call the supplier at nine, lunch with Noura at twelve, then block two hours for the Sanad quote",
      existing: { design: { title: "Design review", time: "10:00 to 11:00" }, teamSync: "Team sync" },
      tasks: {
        call: { title: "Call the supplier", meta: "9:00 to 10:00 · Phone call · Cups order", tag: "Cups order" },
        lunch: { title: "Lunch with Noura", meta: "12:00 to 13:00 · Café Qahwa · Catch-up", tag: "Catch-up" },
        sanad: {
          title: "Sanad quote",
          meta: "14:00 to 16:00 · Focus time · High",
          tag: "High",
          subtasks: ["Pricing table", "Delivery timeline", "Send to Faisal for review"],
        },
      },
    },
  },
  ar: {
    eyebrow: "مدير مهام بالصوت",
    heading: "تحدّث عن يومك، ومهام يرتّب الباقي.",
    body: "تحدّث وأنت في طريقك، وحين تصل إلى مكتبك يكون لكل مهمة موعد ومسؤول ومكان في أسبوعك.",
    primaryCta: "ابدأ مع مهام مجانًا",
    // One element, so the button's flex gap doesn't open up around the number.
    secondaryCta: (
      <span>
        شاهد العرض في <bdi dir="ltr">60</bdi> ثانية
      </span>
    ),
    socialProof: (
      <>
        يثق بنا <bdi dir="ltr">40,000</bdi> شخص{"\n"}يفضّلون الكلام على الكتابة
      </>
    ),
    planner: {
      day: "الخميس",
      listening: "جارٍ الاستماع",
      added: (count) => (count === 1 ? "أُضيفت مهمة واحدة من ملاحظتك الصوتية" : count === 2 ? "أُضيفت مهمتان من ملاحظتك الصوتية" : `أُضيفت ${count} مهام من ملاحظتك الصوتية`),
      transcript: "اتصل بالمورّد الساعة التاسعة، وتغدَّ مع نورة الساعة الثانية عشرة، ثم خصّص ساعتين لعرض سند",
      existing: { design: { title: "مراجعة التصميم", time: "10:00 إلى 11:00" }, teamSync: "اجتماع الفريق" },
      tasks: {
        call: { title: "الاتصال بالمورّد", meta: "9:00 إلى 10:00، مكالمة، طلب الأكواب", tag: "طلب الأكواب" },
        lunch: { title: "غداء مع نورة", meta: "12:00 إلى 13:00، مقهى قهوة، لقاء سريع", tag: "لقاء سريع" },
        sanad: {
          title: "عرض سند",
          meta: "14:00 إلى 16:00، وقت تركيز، عالية",
          tag: "عالية",
          subtasks: ["جدول الأسعار", "جدول التسليم", "إرسال إلى فيصل للمراجعة"],
        },
      },
    },
  },
}

export interface MahaamHeroProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamHeroCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** The painting behind the planner. Without it the stage is plain. */
  sceneSrc?: string
  /** The three faces in the social proof and on the tasks. */
  avatars?: { noura?: string; khalid?: string; faisal?: string }
  /**
   * Where the solid button goes.
   * @default "#get-mahaam"
   */
  primaryHref?: string
  /**
   * Where the outline button goes.
   * @default "#demo"
   */
  secondaryHref?: string
  /**
   * Whether the section is paused: the planner's frame and every animation
   * stand still. Set it to control the pause button; leave it out and the
   * button keeps its own state, which starts from `defaultPaused`.
   */
  paused?: boolean
  /** Whether an uncontrolled section starts paused. */
  defaultPaused?: boolean
  /** Called when the visitor presses the pause button. */
  onPausedChange?: (paused: boolean) => void
  /** The pause button's names, in place of `locale`'s. */
  pauseLabels?: Partial<MahaamPauseButtonLabels>
  /**
   * The planner's frame, 0 to 200, where the loop starts, and where it holds
   * under reduced motion. 170 is Figma's finished state.
   * @default 170 when it starts paused or under reduced motion, 0 otherwise
   */
  frame?: number
  /**
   * Holds the planner on `frame` without changing the pause button, which still
   * shows Pause. For stills of the finished state, as Figma draws it.
   */
  still?: boolean
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

/** Frames in the loop, and the frame Figma draws. */
const LOOP_FRAMES = 201
const FINAL_FRAME = 170
const FRAME_MS = 60
/** The voice note types 1.6 characters a frame; the blocks land 6, 16 and 26 frames after it ends. */
const TYPING_RATE = 1.6
const LAND_AFTER = [6, 16, 26]
/** The blocks fade out at this frame, ready for the loop to begin again. */
const FADE_FRAME = 190

/** The waveform's bars, at the full height the wave reaches; at rest they are 30% of it, which is Figma's height. */
const BAR_HEIGHTS = [6.7, 10, 13.3, 10, 16.7, 13.3, 6.7, 10]
const WAVE_KEYFRAMES: Keyframe[] = [{ transform: "scaleY(.3)" }, { transform: "scaleY(1)" }, { transform: "scaleY(.3)" }]
const CARET_KEYFRAMES: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }]
const ZOOM_KEYFRAMES: Keyframe[] = [{ transform: "scale(1)" }, { transform: "scale(1.1) translate(-2%, -1%)" }]

/** The dot that pulses a ring. Figma draws it in `foreground`. */
function PulseDot({ className, enabled, active, children }: { className?: string; enabled: boolean; active: boolean; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useLoopAnimation(ref, PULSE_KEYFRAMES, { duration: 1300, iterations: Infinity, easing: "ease-in-out" }, { enabled, active })
  return (
    <span ref={ref} aria-hidden="true" className={className}>
      {children}
    </span>
  )
}

function WaveBar({ height, index, enabled, active }: { height: number; index: number; enabled: boolean; active: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useLoopAnimation(ref, WAVE_KEYFRAMES, { duration: 900, iterations: Infinity, easing: "ease-in-out", delay: -index * 110 }, { enabled, active })
  return <span ref={ref} className="block w-[2.5px] shrink-0 scale-y-[.3] rounded-[1px] bg-foreground" style={{ height }} />
}

function Caret({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useLoopAnimation(ref, CARET_KEYFRAMES, { duration: 1000, iterations: Infinity, easing: "steps(1)" }, { enabled: true, active })
  return <span ref={ref} aria-hidden="true" className="ms-px inline-block h-[1.05em] w-px bg-foreground align-[-2px]" />
}

type PlannerAvatars = NonNullable<MahaamHeroProps["avatars"]>

/** A tag, in the card colour with its tone's outline, as Figma overrides the Outline badge. */
function Tag({ tone, children }: { tone: "secondary" | "destructive"; children: React.ReactNode }) {
  return (
    <Badge variant="outline" tone={tone} size="sm" className="bg-card">
      {children}
    </Badge>
  )
}

function TagAndOwner({ tag, tone, src }: { tag: string; tone: "secondary" | "destructive"; src?: string }) {
  return (
    <div className="flex items-center gap-2 [@container(min-width:48rem)]:ms-auto [@container(min-width:48rem)]:flex-col [@container(min-width:48rem)]:items-end [@container(min-width:48rem)]:justify-center [@container(min-width:48rem)]:gap-1">
      <Tag tone={tone}>{tag}</Tag>
      <Avatar variant="image" size="24" radius="rounded" border src={src} name="" />
    </div>
  )
}

/** The block's own box: Figma sets its top and height per variant, so they are written out per variant. */
const TASK_BOX =
  "absolute start-10 end-0 top-[var(--mahaam-top)] flex flex-col justify-center gap-2 overflow-hidden rounded-[10px] px-3 py-1.5 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none [@container(min-width:48rem)]:start-12 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-start [@container(min-width:48rem)]:gap-3"

/** Where a block waits: 70px above the timeline, small and clear, as the motion card says. */
const TASK_OFF = "[transform:translateY(calc(-70px_-_var(--mahaam-top)))_scale(.92)] opacity-0"

const BOX = {
  design: "[--mahaam-top:94px] h-[88px] [&:where(:dir(rtl))]:[--mahaam-top:118px] [@container(min-width:48rem)]:[--mahaam-top:60px] [@container(min-width:48rem)]:h-[54px]",
  teamSync: "[--mahaam-top:368px] h-[27px] [&:where(:dir(rtl))]:[--mahaam-top:464px] [@container(min-width:48rem)]:[--mahaam-top:232px]",
  call: "[--mahaam-top:2px] h-[88px] [&:where(:dir(rtl))]:h-[112px] [@container(min-width:48rem)]:h-[54px]",
  lunch: "[--mahaam-top:278px] h-[88px] [&:where(:dir(rtl))]:[--mahaam-top:350px] [&:where(:dir(rtl))]:h-[112px] [@container(min-width:48rem)]:[--mahaam-top:176px] [@container(min-width:48rem)]:h-[54px]",
  sanad:
    "[--mahaam-top:462px] h-[175px] [&:where(:dir(rtl))]:[--mahaam-top:582px] [@container(min-width:48rem)]:[--mahaam-top:292px] [@container(min-width:48rem)]:h-[109px] [@container(min-width:48rem)]:items-start [@container(min-width:48rem)]:[&:dir(rtl)]:h-[132px]",
} as const

/** One hour of the day: a hairline and its label. Figma spaces them 92px on Mobile (116 in Arabic, where the first block is taller), 58 from Tablet. */
const HOUR_ROW = "h-[92px] [&:where(:dir(rtl))]:h-[116px] [@container(min-width:48rem)]:h-[58px]"
const HOUR_LABELS = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]

function Planner({
  copy,
  avatars,
  frame,
  active,
  waving,
}: {
  copy: MahaamHeroCopy["planner"]
  avatars: PlannerAvatars
  frame: number
  active: boolean
  waving: boolean
}) {
  const said = copy.transcript
  const typingEnd = Math.ceil(said.length / TYPING_RATE)
  const typed = said.slice(0, Math.min(said.length, Math.floor(frame * TYPING_RATE)))
  const lands = LAND_AFTER.map((after) => typingEnd + after)
  const fading = frame >= FADE_FRAME
  const on = lands.map((land) => frame >= land && !fading)
  const added = on.filter(Boolean).length
  const ticked = frame >= (lands[2] ?? 0) + 16
  const typing = typed.length < said.length
  const waveOn = waving && frame < typingEnd + 2

  const sanad = copy.tasks.sanad
  return (
    <div className="relative z-10 flex w-full max-w-[600px] flex-col gap-3.5 overflow-hidden rounded-xl border border-border bg-card px-4 pb-4 pt-5 shadow-[0_40px_60px_-30px_color-mix(in_srgb,var(--foreground)_25%,transparent)] [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:pt-6">
      <div className="flex flex-col items-start gap-2 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-between">
        <span className="text-3xl font-normal text-foreground">{copy.day}</span>
        <Badge variant="soft" tone="secondary" size="sm">
          {added ? copy.added(added) : copy.listening}
        </Badge>
      </div>

      <div className="flex flex-col items-start gap-2.5 rounded-[10px] bg-muted px-3 py-2.5 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:gap-3">
        <div className="flex items-center gap-3">
          <PulseDot enabled={waving} active={active} className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-foreground-inverse">
            <Mic size={12} strokeWidth={1.5} />
          </PulseDot>
          <div aria-hidden="true" className="flex h-4 shrink-0 items-center gap-0.5">
            {BAR_HEIGHTS.map((height, index) => (
              <WaveBar key={index} height={height} index={index} enabled={waveOn} active={active} />
            ))}
          </div>
        </div>
        <p className="relative min-w-0 flex-1 text-sm text-foreground">
          {/* The whole sentence holds the room, so the bar never grows as it types; the typed part is drawn over it. */}
          <span className="opacity-0">{said}</span>
          <span aria-hidden="true" className="absolute inset-0 text-foreground">
            {typed}
            {typing ? <Caret active={active} /> : null}
          </span>
        </p>
      </div>

      <div
        className="relative h-[644px] [&:where(:dir(rtl))]:h-[764px] [@container(min-width:48rem)]:h-[406px] [@container(min-width:48rem)]:[&:dir(rtl)]:h-[421px]"
        style={{ "--mahaam-now": Math.min(frame, 200) / 200 } as React.CSSProperties}
      >
        {HOUR_LABELS.map((label) => (
          <div key={label} className={cn("flex border-t border-border pt-1 text-xs text-muted-foreground", HOUR_ROW)}>
            <span className="w-12">{label}</span>
          </div>
        ))}

        <div className={cn(TASK_BOX, BOX.design, "justify-center gap-1 bg-muted py-0.5 text-muted-foreground [@container(min-width:48rem)]:flex-col [@container(min-width:48rem)]:items-start [@container(min-width:48rem)]:justify-center [@container(min-width:48rem)]:gap-1")}>
          <span className="text-sm font-medium">{copy.existing.design.title}</span>
          <span className="text-xs">{copy.existing.design.time}</span>
        </div>
        <div className={cn(TASK_BOX, BOX.teamSync, "bg-muted py-0 text-muted-foreground [@container(min-width:48rem)]:items-center")}>
          <span className="text-sm font-medium">{copy.existing.teamSync}</span>
        </div>

        <div className={cn(TASK_BOX, BOX.call, "bg-background-inverse text-foreground-inverse", !on[0] && TASK_OFF)}>
          <TaskText title={copy.tasks.call.title} meta={copy.tasks.call.meta} />
          <TagAndOwner tag={copy.tasks.call.tag} tone="secondary" src={avatars.khalid} />
        </div>
        <div className={cn(TASK_BOX, BOX.lunch, "bg-card bg-gradient-to-r from-soft-warning-20 to-soft-warning-20 text-foreground", !on[1] && TASK_OFF)}>
          <TaskText title={copy.tasks.lunch.title} meta={copy.tasks.lunch.meta} />
          <TagAndOwner tag={copy.tasks.lunch.tag} tone="secondary" src={avatars.noura} />
        </div>
        <div
          className={cn(
            TASK_BOX,
            BOX.sanad,
            // Figma's destructive/10 over the card: the soft token is that tint, laid over the card as Badge lays it.
            "bg-card bg-gradient-to-r from-soft-destructive to-soft-destructive text-destructive",
            !on[2] && TASK_OFF
          )}
        >
          <TaskText title={sanad.title} meta={sanad.meta}>
            {sanad.subtasks?.map((subtask, index) => (
              <span key={subtask} className={cn("text-xs", index === 0 && ticked && "opacity-60")}>
                {index === 0 && ticked ? "☑" : "☐"} {subtask}
              </span>
            ))}
          </TaskText>
          <TagAndOwner tag={sanad.tag} tone="destructive" src={avatars.faisal} />
        </div>

        <div
          className="absolute start-8 end-0 top-[212px] z-10 h-0.5 bg-foreground transition-transform duration-1000 ease-linear [transform:translateY(calc(var(--mahaam-now)*20px))] motion-reduce:transition-none [&:where(:dir(rtl))]:top-[267px] [@container(min-width:48rem)]:start-10 [@container(min-width:48rem)]:top-[133px]"
          aria-hidden="true"
        >
          <PulseDot enabled={waving} active={active} className="absolute -start-1 -top-[3px] size-2 rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}

function TaskText({ title, meta, children }: { title: string; meta: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-1 [@container(min-width:48rem)]:flex-1">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs">{meta}</span>
      {children}
    </div>
  )
}

export function MahaamHero({
  locale = "en",
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  socialProof,
  planner,
  sceneSrc,
  avatars = {},
  primaryHref = "#get-mahaam",
  secondaryHref = "#demo",
  paused: pausedProp,
  defaultPaused,
  onPausedChange,
  pauseLabels,
  frame: startFrame,
  still,
  reducedMotion,
  className,
  ...props
}: MahaamHeroProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion(reducedMotion)
  const inView = useInView(rootRef)
  const visible = usePageVisible()
  const { paused, toggle } = usePausedState({ paused: pausedProp, defaultPaused, onPausedChange })
  // Frozen: paused, or under reduced motion. Out of sight, or under the pointer, it only waits.
  const frozen = paused || reduced || Boolean(still)
  const [hovered, setHovered] = React.useState(false)
  const active = !frozen && inView && visible && !hovered
  const hold = startFrame ?? FINAL_FRAME
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => setReady(true), [])
  // The server and the first render draw the held frame; once mounted the clock takes over from `frame`, and a pause stops it where it stands.
  const clock = useLoopClock({ length: LOOP_FRAMES, intervalMs: FRAME_MS, active, from: startFrame ?? (paused ? FINAL_FRAME : 0) })
  const frame = reduced || !ready ? hold : clock

  const plannerCopy = { ...copy.planner, ...planner }
  const headingId = React.useId()
  // The copy fades up once, as the page loads; pausing later does not replay it.
  const [entrance] = React.useState(() => !frozen)
  const eyebrowRef = React.useRef<HTMLDivElement>(null)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const bodyRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const proofRef = React.useRef<HTMLDivElement>(null)
  const sceneRef = React.useRef<HTMLDivElement>(null)
  const zoomRef = React.useRef<HTMLImageElement>(null)
  useEntrance(eyebrowRef, 0, entrance)
  useEntrance(headingRef, 100, entrance)
  useEntrance(bodyRef, 220, entrance)
  useEntrance(ctaRef, 360, entrance)
  useEntrance(proofRef, 500, entrance)
  useEntrance(sceneRef, 220, entrance)
  useLoopAnimation(zoomRef, ZOOM_KEYFRAMES, { duration: 32000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" }, { enabled: !reduced && Boolean(sceneSrc), active })

  const avatarList = [
    { key: "noura", src: avatars.noura },
    { key: "khalid", src: avatars.khalid },
    { key: "faisal", src: avatars.faisal },
  ]

  return (
    <section ref={rootRef} aria-labelledby={headingId} className={cn("[container-type:inline-size]", className)} {...props}>
      <div className="mx-auto w-full max-w-[1440px] px-8 pb-16 pt-8 [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-20 [@container(min-width:48rem)]:pt-12 [@container(min-width:90rem)]:max-w-[1440px] [@container(min-width:90rem)]:px-12 [@container(min-width:90rem)]:pb-24 [@container(min-width:90rem)]:pt-16">
        <div className="flex flex-col gap-10 [@container(min-width:48rem)]:gap-14 [@container(min-width:90rem)]:grid [@container(min-width:90rem)]:grid-cols-[5fr_7fr] [@container(min-width:90rem)]:items-center [@container(min-width:90rem)]:gap-16">
          <div className="flex min-w-0 flex-col gap-9 [@container(min-width:48rem)]:gap-11">
            <div className="flex flex-col gap-9">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <div ref={eyebrowRef} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <PulseDot enabled={!reduced} active={active} className="size-2 shrink-0 rounded-full bg-foreground" />
                    {eyebrow ?? copy.eyebrow}
                  </div>
                  {/* On Mobile both languages are 4XL, 36px. */}
                  <h1
                    ref={headingRef}
                    id={headingId}
                    className="whitespace-pre-line text-4xl font-medium text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl"
                  >
                    {heading ?? copy.heading}
                  </h1>
                </div>
                <p ref={bodyRef} className="text-lg text-muted-foreground [@container(min-width:90rem)]:max-w-[470px]">
                  {body ?? copy.body}
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col gap-1.5 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center">
                <a href={primaryHref} className={buttonVariants({ size: "lg", className: "w-full [@container(min-width:48rem)]:w-auto" })}>
                  {primaryCta ?? copy.primaryCta}
                </a>
                <a
                  href={secondaryHref}
                  className={buttonVariants({ variant: "outline", tone: "primary", size: "lg", className: "w-full [@container(min-width:48rem)]:w-auto" })}
                >
                  {secondaryCta ?? copy.secondaryCta}
                </a>
              </div>
            </div>
            <div ref={proofRef} className="flex items-center gap-3.5">
              <div className="flex [&>*+*]:-ms-2.5">
                {avatarList.map((avatar) => (
                  <Avatar key={avatar.key} variant="image" size="32" radius="rounded" border src={avatar.src} name="" />
                ))}
              </div>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{socialProof ?? copy.socialProof}</p>
            </div>
          </div>

          <div
            ref={sceneRef}
            data-slot="mahaam-hero-scene"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            className="relative flex min-h-[976px] items-start justify-center overflow-hidden rounded-3xl bg-muted px-3 pb-6 pt-14 [@container(min-width:48rem)]:min-h-[660px] [@container(min-width:48rem)]:px-6 [@container(min-width:90rem)]:h-[680px] [@container(min-width:90rem)]:min-h-0 [@container(min-width:90rem)]:px-0 [@container(min-width:90rem)]:pt-[58px]"
          >
            {sceneSrc ? <img ref={zoomRef} src={sceneSrc} alt="" decoding="async" className="absolute inset-0 size-full object-cover [object-position:40%_50%]" /> : null}
            {reduced ? null : (
              <MahaamPauseButton
                paused={paused}
                locale={locale}
                labels={pauseLabels}
                onClick={toggle}
                className="absolute end-4 top-3 z-20 [@container(min-width:90rem)]:top-4"
              />
            )}
            <Planner copy={plannerCopy} avatars={avatars} frame={frame} active={active} waving={!reduced} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamHeroCopy = COPY

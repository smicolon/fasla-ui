"use client"

import * as React from "react"
import { Check, CircleDot, Clock, FileText, Play, Users } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  BASE_MS,
  FAST_MS,
  Figures,
  STAGGER_MS,
  STANDARD,
  StarRow,
  VIDEO_CALL_CARD,
  VideoCallSection,
  fillTemplate,
  passedCopy,
  prefersReducedMotion,
  restOf,
  useContainerTier,
  type VideoCallLocale,
  type VideoCallPhoto,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Call Ended Summary.
 *
 * Two cards. The summary card has a green check beside "Call ended" and the
 * meeting's line, four stat tiles (duration, participants, recording,
 * transcript) and the recording row: its still with a play button, a line on
 * it, and Watch and Share. The feedback card asks how the call quality was:
 * five stars, a handful of issue chips, who was there, Send feedback and
 * Rejoin the room.
 *
 * Desktop sets the summary at the start and the 380px feedback card at the end
 * with the stats four across; Tablet stacks the cards and sets the stats 2 × 2;
 * a phone keeps them 2 × 2 and stacks the recording row, still on top.
 *
 * On first paint the check draws itself over 400ms, the four stat tiles rise
 * 8px on a 60ms stagger and their numbers count up from zero over 600ms, and
 * the recording row slides in 120ms after the stats settle (a fade-up on a
 * phone). Hovering the stars fills every star up to the pointer on a 60ms
 * cascade, 40ms on a phone. Reduced motion shows the final numbers at once and
 * turns every move into a 120ms fade. The check, the numbers and the stars
 * have no reading direction; the stars fill from the start, so in Arabic they
 * fill from the right, and the recording row slides in from the start side.
 *
 * Stills only: the recording is a photo with a play button. The stars and the
 * issue chips are state the block keeps itself; every real action (Watch,
 * Share, Send feedback, Rejoin the room) is a callback.
 *
 * Content limits: a stat's value up to 24 characters, a chip up to 16. The
 * other limits are in the block's documentation page, which the default copy
 * stays inside.
 */

export interface VideoCallEndedStat {
  id: string
  /** The mark above the label. */
  icon: "clock" | "users" | "recording" | "file"
  label: string
  /** The value: its first figure counts up on first paint, such as `47 min` or `4,182 words`. */
  value: string
}

export interface VideoCallEndedChip {
  id: string
  label: string
}

export interface VideoCallEndedPerson {
  /** Keys the person and picks their photo from `photos`. */
  id: string
  name: string
}

export interface VideoCallCallEndedSummaryCopy {
  /** The card's heading, an `h2`, and the meeting's line under it. */
  title: string
  subtitle: string
  /** The four stat tiles, in order. */
  stats: VideoCallEndedStat[]
  /** The recording row: its heading, the line on it, and the two buttons. */
  recordingTitle: string
  recordingBody: string
  watch: string
  share: string
  /** Names the play button on the still. */
  playLabel: string
  /** The feedback card. */
  feedbackTitle: string
  /** Names the star group. */
  ratingLabel: string
  /** Names star `n`: `Rate {n} of {count}`. */
  starLabel: string
  /** The issue chips. */
  chips: VideoCallEndedChip[]
  /** Names the chip group. */
  chipsLabel: string
  /** The people on the call, as photos, and the line after them. */
  people: VideoCallEndedPerson[]
  more: string
  send: string
  rejoin: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallCallEndedSummaryCopy> = {
  en: {
    title: "Call ended",
    subtitle: "Design sync — weekly · Today, 10:00 – 10:47",
    stats: [
      { id: "duration", icon: "clock", label: "Duration", value: "47 min" },
      { id: "participants", icon: "users", label: "Participants", value: "6 joined" },
      { id: "recording", icon: "recording", label: "Recording", value: "1.2 GB · ready" },
      { id: "transcript", icon: "file", label: "Transcript", value: "4,182 words" },
    ],
    recordingTitle: "Recording is ready to watch",
    recordingBody: "Transcript, chapters and action items were generated automatically.",
    watch: "Watch",
    share: "Share",
    playLabel: "Watch the recording",
    feedbackTitle: "How was the call quality?",
    ratingLabel: "Rate the call quality",
    starLabel: "Rate {n} of {count}",
    chips: [
      { id: "audio", label: "Clear audio" },
      { id: "video", label: "Sharp video" },
      { id: "echo", label: "Echo" },
      { id: "dropped", label: "Dropped out" },
      { id: "lag", label: "Lag" },
    ],
    chipsLabel: "What stood out",
    people: [
      { id: "mona", name: "Mona Darwish" },
      { id: "karim", name: "Karim Nasser" },
      { id: "omar", name: "Omar Youssef" },
      { id: "tariq", name: "Tariq Aziz" },
    ],
    more: "+2 joined",
    send: "Send feedback",
    rejoin: "Rejoin the room",
  },
  ar: {
    title: "انتهت المكالمة",
    subtitle: "مزامنة التصميم الأسبوعية، اليوم من 10:00 إلى 10:47",
    stats: [
      { id: "duration", icon: "clock", label: "المدة", value: "47 دقيقة" },
      { id: "participants", icon: "users", label: "المشاركون", value: "انضم 6 مشاركين" },
      { id: "recording", icon: "recording", label: "التسجيل", value: "1.2 غيغابايت، جاهز" },
      { id: "transcript", icon: "file", label: "النص", value: "4,182 كلمة" },
    ],
    recordingTitle: "التسجيل جاهز للمشاهدة",
    recordingBody: "تم إنشاء النص والفصول وبنود العمل تلقائيًا.",
    watch: "مشاهدة",
    share: "مشاركة",
    playLabel: "مشاهدة التسجيل",
    feedbackTitle: "كيف كانت جودة المكالمة؟",
    ratingLabel: "تقييم جودة المكالمة",
    starLabel: "تقييم {n} من {count}",
    chips: [
      { id: "audio", label: "صوت واضح" },
      { id: "video", label: "فيديو حاد" },
      { id: "echo", label: "صدى" },
      { id: "dropped", label: "انقطاع" },
      { id: "lag", label: "تأخير" },
    ],
    chipsLabel: "ما لفت انتباهك",
    people: [
      { id: "mona", name: "منى درويش" },
      { id: "karim", name: "كريم ناصر" },
      { id: "omar", name: "عمر يوسف" },
      { id: "tariq", name: "طارق عزيز" },
    ],
    more: "+2 انضموا",
    send: "إرسال التقييم",
    rejoin: "العودة إلى الغرفة",
  },
}

const COPY_KEYS = Object.keys(COPY.en)

const STAT_ICONS = { clock: Clock, users: Users, recording: CircleDot, file: FileText } as const

export interface VideoCallEndedFeedback {
  /** The stars chosen, 0 to 5. */
  rating: number
  /** The ids of the issue chips chosen. */
  issues: string[]
}

export interface VideoCallCallEndedSummaryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<VideoCallCallEndedSummaryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The still on the recording row. Without one the row shows a plain `muted` tile. */
  photo?: VideoCallPhoto
  /** The photos of the people in `people`, by their `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** The stars chosen when the block opens. */
  defaultRating?: number
  /** The ids of the chips chosen when the block opens. */
  defaultIssues?: string[]
  /** Turns the first-paint motion off: the check is drawn, the numbers are final. */
  countUp?: boolean
  /** Called when Watch, or the play button on the still, is pressed. */
  onWatch?: () => void
  /** Called when Share is pressed. */
  onShare?: () => void
  /** Called with the stars and the chips chosen when Send feedback is pressed. */
  onSendFeedback?: (feedback: VideoCallEndedFeedback) => void
  /** Called when Rejoin the room is pressed. */
  onRejoin?: () => void
  /** Called with the new number whenever a star is chosen. */
  onRatingChange?: (rating: number) => void
}

const NUMBER = /^([\s\S]*?)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/

/**
 * A value whose first figure counts up from zero over 600ms, ease-out, once.
 * The figure is a left-to-right run; the words around it are untouched. With
 * `enabled` off, or reduced motion, the final value is there from the first
 * paint.
 */
function CountUp({ value, enabled, delay }: { value: string; enabled: boolean; delay: number }) {
  const match = NUMBER.exec(value)
  const target = match ? Number(match[2]!.replace(/,/g, "")) : 0
  const decimals = match && match[2]!.includes(".") ? match[2]!.split(".")[1]!.length : 0
  const grouped = !!match && match[2]!.includes(",")
  const [shown, setShown] = React.useState<number | null>(null)
  const live = enabled && !!match

  React.useEffect(() => {
    if (!live || prefersReducedMotion() || typeof requestAnimationFrame !== "function") return
    let frame = 0
    let start = 0
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        start ||= now
        const t = Math.min(1, (now - start) / 600)
        setShown(target * (1 - Math.pow(1 - t, 3)))
        if (t < 1) frame = requestAnimationFrame(tick)
        else setShown(null)
      }
      setShown(0)
      frame = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [live, target, delay])

  if (!match) return <Figures>{value}</Figures>
  const text =
    shown === null
      ? match[2]!
      : shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped })
  return (
    <>
      {match[1]}
      <bdi dir="ltr" className="tabular-nums">
        {text}
      </bdi>
      <Figures>{match[3]}</Figures>
    </>
  )
}

export function VideoCallCallEndedSummary({
  locale = "en",
  photo,
  photos,
  defaultRating = 4,
  defaultIssues = [],
  countUp = true,
  onWatch,
  onShare,
  onSendFeedback,
  onRejoin,
  onRatingChange,
  className,
  ...props
}: VideoCallCallEndedSummaryProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallCallEndedSummaryCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const headingId = React.useId()
  const [rating, setRating] = React.useState(defaultRating)
  const [issues, setIssues] = React.useState<string[]>(defaultIssues)
  const [rootRef, tier] = useContainerTier<HTMLDivElement>()
  const check = React.useRef<HTMLSpanElement>(null)
  const stats = React.useRef<HTMLDivElement>(null)
  const recording = React.useRef<HTMLDivElement>(null)

  // The check draws, the stat tiles rise, the recording row slides in: once, on first paint.
  React.useLayoutEffect(() => {
    if (!countUp) return
    const reduced = prefersReducedMotion()
    const animations: Animation[] = []
    const path = check.current?.querySelector<SVGPathElement>("svg path")
    if (path && typeof path.animate === "function" && !reduced) {
      path.setAttribute("pathLength", "1")
      path.style.strokeDasharray = "1"
      animations.push(path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 400, easing: STANDARD }))
    }
    const tiles = Array.from(stats.current?.querySelectorAll<HTMLElement>("[data-stat]") ?? [])
    tiles.forEach((tile, index) => {
      if (typeof tile.animate !== "function") return
      animations.push(
        tile.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
          duration: reduced ? FAST_MS : BASE_MS,
          delay: reduced ? 0 : 400 + index * STAGGER_MS,
          easing: STANDARD,
          fill: "backwards",
        })
      )
    })
    const row = recording.current
    if (row && typeof row.animate === "function") {
      const phone = tier === "mobile"
      const start = getComputedStyle(row).direction === "rtl" ? 12 : -12
      animations.push(
        row.animate(
          reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: phone ? "translateY(8px)" : `translateX(${start}px)` }, { opacity: 1, transform: "none" }],
          { duration: reduced ? FAST_MS : FAST_MS + 60, delay: reduced ? 0 : 400 + 3 * STAGGER_MS + BASE_MS + 120, easing: STANDARD, fill: "backwards" }
        )
      )
    }
    return () => animations.forEach((animation) => animation.cancel())
    // First paint only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const choose = (value: number) => {
    setRating(value)
    onRatingChange?.(value)
  }
  const toggle = (id: string) => setIssues((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]))

  return (
    <VideoCallSection labelledBy={headingId} className={className} {...rest}>
      <div ref={rootRef} className="flex flex-col gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:flex-row">
        {/* The summary card */}
        <div className={cn(VIDEO_CALL_CARD, "flex min-w-0 flex-1 flex-col gap-6 p-6 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:px-10")}>
          <div className="flex items-center gap-4">
            <span ref={check} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <Check aria-hidden className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
                {copy.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                <Figures>{copy.subtitle}</Figures>
              </p>
            </div>
          </div>

          <div ref={stats} className="grid grid-cols-2 gap-4 [@container(min-width:64rem)]:grid-cols-4">
            {copy.stats.map((stat, index) => {
              const Icon = STAT_ICONS[stat.icon]
              return (
                <div key={stat.id} data-stat="" className="flex min-w-0 flex-col gap-2 rounded-[0.625rem] bg-muted p-4">
                  <Icon aria-hidden className="size-[18px] text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <span className="text-base font-semibold text-balance text-foreground">
                    <CountUp value={stat.value} enabled={countUp} delay={400 + index * STAGGER_MS} />
                  </span>
                </div>
              )
            })}
          </div>

          <div ref={recording} className="flex flex-wrap items-center gap-4 rounded-[0.625rem] border border-border p-4">
            <div className="relative h-[104px] w-full shrink-0 overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[84px] [@container(min-width:40rem)]:w-[148px]">
              {photo ? <img src={photo.src} alt={photo.alt} className="size-full object-cover" /> : null}
              <Button type="button" size="icon-md" radius="rounded" aria-label={copy.playLabel} onClick={onWatch} className="absolute inset-0 m-auto">
                <Play aria-hidden />
              </Button>
            </div>
            <div className="flex min-w-[12rem] flex-1 flex-col gap-1">
              <p className="text-base font-medium text-foreground">{copy.recordingTitle}</p>
              <p className="text-sm text-muted-foreground">{copy.recordingBody}</p>
            </div>
            <div className="flex w-full gap-2 [@container(min-width:40rem)]:w-auto">
              <Button type="button" onClick={onWatch} className="flex-1 [@container(min-width:40rem)]:flex-none">
                {copy.watch}
              </Button>
              <Button type="button" variant="outline" tone="secondary" onClick={onShare} className="flex-1 [@container(min-width:40rem)]:flex-none">
                {copy.share}
              </Button>
            </div>
          </div>
        </div>

        {/* The feedback card */}
        <div className={cn(VIDEO_CALL_CARD, "flex shrink-0 flex-col gap-5 p-6 [@container(min-width:40rem)]:p-8 [@container(min-width:64rem)]:w-[380px]")}>
          <p className="text-base font-semibold text-foreground">{copy.feedbackTitle}</p>
          <StarRow
            label={copy.ratingLabel}
            value={rating}
            onValueChange={choose}
            starSize={28}
            cascadeMs={tier === "mobile" ? 40 : 60}
            starLabel={(n, count) => fillTemplate(copy.starLabel, { n, count })}
            className="gap-0.5"
          />
          <div role="group" aria-label={copy.chipsLabel} className="flex flex-wrap gap-2">
            {copy.chips.map((chip) => {
              const on = issues.includes(chip.id)
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(chip.id)}
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Badge variant={on ? "solid" : "outline"} tone="primary" size="sm" radius="rounded">
                    {chip.label}
                  </Badge>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            {copy.people.map((person) => (
              <Avatar
                key={person.id}
                size="32"
                radius="standard"
                variant={photos?.[person.id] ? "image" : "initials"}
                src={photos?.[person.id]?.src}
                name={person.name}
              />
            ))}
            <span className="text-xs text-muted-foreground">
              <Figures>{copy.more}</Figures>
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <Button type="button" className="w-full" onClick={() => onSendFeedback?.({ rating, issues })}>
              {copy.send}
            </Button>
            <Button type="button" variant="outline" tone="secondary" className="w-full" onClick={onRejoin}>
              {copy.rejoin}
            </Button>
          </div>
        </div>
      </div>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallCallEndedSummaryCopy = COPY

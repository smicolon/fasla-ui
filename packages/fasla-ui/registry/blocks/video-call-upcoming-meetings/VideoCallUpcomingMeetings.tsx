"use client"

import * as React from "react"
import { CircleDot, Ellipsis } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  FAST_MS,
  Figures,
  Latin,
  STANDARD,
  VideoCallSection,
  fillTemplate,
  passedCopy,
  prefersReducedMotion,
  restOf,
  type VideoCallLocale,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Upcoming Meetings.
 *
 * A header (the day, a line on how much is booked, New meeting and Open
 * calendar) over a list of meetings. A meeting is a time and its length, a
 * 3px accent bar, the title with its meta line, the people on it, and Join with
 * a More button. The meeting happening now is drawn on `muted` with a 2px
 * `primary` ring, a Happening now badge and a solid Join now.
 *
 * Desktop sets each meeting in one row with its people as a stack of avatars;
 * Tablet drops the stacks and stacks the header's title above its actions; a
 * phone makes each meeting a card, with Join full width under the title.
 *
 * The rows fade and rise 12px on a 50ms stagger the first time the list
 * renders. The live row's ring pulses between 0.6 and 1 opacity on a 2s loop
 * and its dot on a 1.6s one; hovering any row lifts it 2px with a shadow step
 * over 120ms. Joining collapses the row over 200ms; the block hands its bounds
 * to `onJoin`, so a page can expand a call stage out of them. Reduced motion
 * stops the loops and the lift and turns the rest into a 120ms fade. The motion
 * has no reading direction; the rows mirror, with the time and the accent bar
 * at the start and the actions at the end, and times stay in 24-hour numerals.
 *
 * Stills only. Every real action (New meeting, Open calendar, Join, More) is a
 * callback; which row is collapsing is state the block keeps itself, or takes
 * from `joiningId`.
 *
 * Content limits: a title up to 40 characters and a meta line up to 48. The
 * other limits are in the block's documentation page, which the default copy
 * stays inside.
 */

export interface VideoCallMeeting {
  id: string
  /** The start, 24-hour: `10:00`. */
  time: string
  /** The length: `45 min`. */
  duration: string
  title: string
  /** The line under the title: `Recurring · Recording on`. */
  meta: string
  /** The meeting happening now. */
  live?: boolean
  /** Who is on it, by `id` in `photos`. Shown on Desktop only. */
  people?: string[]
  /** How many more are on it past `people`. */
  more?: number
}

export interface VideoCallUpcomingMeetingsCopy {
  /** The day, an `h2`, and the line under it. */
  heading: string
  summary: string
  newMeeting: string
  openCalendar: string
  /** The meetings, in order. */
  meetings: VideoCallMeeting[]
  /** The live row's button, the others' button, and the live badge. */
  joinNow: string
  join: string
  liveLabel: string
  /** Names a row's More button: `More options for {title}`. */
  moreLabel: string
  /** Names the list. */
  listLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallUpcomingMeetingsCopy> = {
  en: {
    heading: "Today · Thursday 12 March",
    summary: "4 meetings · 3h 15m booked · next in 12 minutes",
    newMeeting: "New meeting",
    openCalendar: "Open calendar",
    meetings: [
      { id: "design-sync", time: "10:00", duration: "45 min", title: "Design sync — weekly", meta: "Recurring · Recording on", live: true, people: ["mona", "karim", "layla", "yasmin"], more: 2 },
      { id: "client-review", time: "11:30", duration: "30 min", title: "Client review — Q3 launch", meta: "External guests · Waiting room on", people: ["adam", "nour"] },
      { id: "onboarding", time: "14:00", duration: "60 min", title: "Onboarding walkthrough", meta: "Guest link · No recording", people: ["bilal", "omar", "tariq"] },
      { id: "one-to-one", time: "16:15", duration: "20 min", title: "1:1 with Mona", meta: "Private · Notes shared after", people: ["mona"] },
    ],
    joinNow: "Join now",
    join: "Join",
    liveLabel: "Happening now",
    moreLabel: "More options for {title}",
    listLabel: "Today's meetings",
  },
  ar: {
    heading: "اليوم، الخميس 12 مارس",
    summary: "4 اجتماعات، 195 دقيقة محجوزة، التالي بعد 12 دقيقة",
    newMeeting: "اجتماع جديد",
    openCalendar: "فتح التقويم",
    meetings: [
      { id: "design-sync", time: "10:00", duration: "45 دقيقة", title: "مزامنة التصميم الأسبوعية", meta: "متكرر، التسجيل مفعّل", live: true, people: ["mona", "karim", "layla", "yasmin"], more: 2 },
      { id: "client-review", time: "11:30", duration: "30 دقيقة", title: "مراجعة العميل لإطلاق الربع الثالث", meta: "ضيوف خارجيون، غرفة الانتظار مفعّلة", people: ["adam", "nour"] },
      { id: "onboarding", time: "14:00", duration: "60 دقيقة", title: "جولة التهيئة", meta: "رابط ضيف، بدون تسجيل", people: ["bilal", "omar", "tariq"] },
      { id: "one-to-one", time: "16:15", duration: "20 دقيقة", title: "اجتماع فردي مع منى", meta: "خاص، تُشارك الملاحظات لاحقًا", people: ["mona"] },
    ],
    joinNow: "انضم الآن",
    join: "انضمام",
    liveLabel: "جارٍ الآن",
    moreLabel: "خيارات أخرى لاجتماع {title}",
    listLabel: "اجتماعات اليوم",
  },
}

const COPY_KEYS = Object.keys(COPY.en)

/** Names for the people on a meeting, for the avatars' accessible names. */
const PERSON_NAMES: Record<VideoCallLocale, Record<string, string>> = {
  en: { mona: "Mona Darwish", karim: "Karim Nasser", layla: "Layla Hassan", yasmin: "Yasmin Haddad", adam: "Adam Farouk", nour: "Nour Khalil", bilal: "Bilal Sultan", omar: "Omar Youssef", tariq: "Tariq Aziz" },
  ar: { mona: "منى درويش", karim: "كريم ناصر", layla: "ليلى حسن", yasmin: "ياسمين حداد", adam: "آدم فاروق", nour: "نور خليل", bilal: "بلال سلطان", omar: "عمر يوسف", tariq: "طارق عزيز" },
}

export interface VideoCallUpcomingMeetingsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<VideoCallUpcomingMeetingsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The photos of the people on the meetings, by `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** The row that is collapsing into the call when the block opens. Joining sets it too. */
  joiningId?: string | null
  /** Called with the meeting's id and the row's bounds when Join or Join now is pressed. */
  onJoin?: (id: string, bounds: DOMRect) => void
  /** Called with the meeting's id when its More button is pressed. */
  onMore?: (id: string) => void
  /** Called when New meeting is pressed. */
  onNewMeeting?: () => void
  /** Called when Open calendar is pressed. */
  onOpenCalendar?: () => void
}

export function VideoCallUpcomingMeetings({
  locale = "en",
  photos,
  joiningId: joiningProp,
  onJoin,
  onMore,
  onNewMeeting,
  onOpenCalendar,
  className,
  ...props
}: VideoCallUpcomingMeetingsProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallUpcomingMeetingsCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const headingId = React.useId()
  const [joining, setJoining] = React.useState<string | null>(joiningProp ?? null)
  const list = React.useRef<HTMLUListElement>(null)
  const rows = React.useRef(new Map<string, HTMLLIElement>())

  React.useEffect(() => {
    if (joiningProp !== undefined) setJoining(joiningProp)
  }, [joiningProp])

  // The rows fade and rise 12px, 50ms apart, the first time the list scrolls into view.
  React.useLayoutEffect(() => {
    const node = list.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const items = Array.from(node.querySelectorAll<HTMLElement>("[data-meeting]"))
    let animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const reduced = prefersReducedMotion()
        animations = items
          .filter((item) => typeof item.animate === "function")
          .map((item, index) =>
            item.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
              duration: reduced ? FAST_MS : 180,
              delay: reduced ? 0 : index * 50,
              easing: STANDARD,
              fill: "backwards",
            })
          )
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [])

  // The live row's ring and dot pulse; reduced motion holds them still.
  React.useLayoutEffect(() => {
    const node = list.current
    if (!node || prefersReducedMotion()) return
    const animations: Animation[] = []
    node.querySelectorAll<HTMLElement>("[data-ring]").forEach((ring) => {
      if (typeof ring.animate === "function") animations.push(ring.animate([{ opacity: 0.6 }, { opacity: 1 }, { opacity: 0.6 }], { duration: 2000, iterations: Infinity, easing: "ease-in-out" }))
    })
    node.querySelectorAll<HTMLElement>("[data-dot]").forEach((dot) => {
      if (typeof dot.animate === "function") animations.push(dot.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: 1600, iterations: Infinity, easing: "ease-in-out" }))
    })
    return () => animations.forEach((animation) => animation.cancel())
  }, [])

  const join = (meeting: VideoCallMeeting) => {
    const row = rows.current.get(meeting.id)
    onJoin?.(meeting.id, row?.getBoundingClientRect() ?? new DOMRect())
    setJoining(meeting.id)
  }

  // A joining row collapses to nothing over 200ms.
  React.useLayoutEffect(() => {
    if (!joining) return
    const row = rows.current.get(joining)
    if (!row || typeof row.animate !== "function") return
    const reduced = prefersReducedMotion()
    const height = row.offsetHeight
    const animation = row.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ height: `${height}px`, opacity: 1, marginBottom: "0px" }, { height: "0px", opacity: 0, marginBottom: "-12px" }],
      { duration: reduced ? FAST_MS : 200, easing: STANDARD, fill: "forwards" }
    )
    return () => animation.cancel()
  }, [joining])

  const names = PERSON_NAMES[locale]

  return (
    <VideoCallSection labelledBy={headingId} className={className} gap="sm" contentClassName="gap-6" {...rest}>
      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
            <Figures>{copy.heading}</Figures>
          </h2>
          <p className="text-sm text-muted-foreground">
            <Figures>{copy.summary}</Figures>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={onNewMeeting}>
            {copy.newMeeting}
          </Button>
          <Button type="button" variant="outline" tone="secondary" onClick={onOpenCalendar}>
            {copy.openCalendar}
          </Button>
        </div>
      </div>

      <ul ref={list} aria-label={copy.listLabel} className="flex flex-col gap-3">
        {copy.meetings.map((meeting) => (
          <li
            key={meeting.id}
            ref={(node) => {
              if (node) rows.current.set(meeting.id, node)
              else rows.current.delete(meeting.id)
            }}
            data-meeting=""
            data-live={meeting.live ? "" : undefined}
            aria-busy={joining === meeting.id || undefined}
            className={cn(
              "relative flex flex-col gap-3 overflow-hidden rounded-[0.875rem] p-5 transition-[transform,box-shadow] duration-[120ms] hover:motion-safe:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5",
              meeting.live ? "bg-muted" : "border border-border bg-card"
            )}
          >
            {meeting.live ? <span data-ring="" aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-inset ring-primary" /> : null}
            <div className="flex items-center gap-2 [@container(min-width:40rem)]:w-[84px] [@container(min-width:40rem)]:shrink-0 [@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:gap-0">
              <span className="text-lg font-semibold text-foreground">
                <Latin>{meeting.time}</Latin>
              </span>
              <span className="text-xs text-muted-foreground">
                <Figures>{meeting.duration}</Figures>
              </span>
            </div>
            <span aria-hidden className={cn("hidden h-11 w-[3px] shrink-0 rounded-full [@container(min-width:40rem)]:block", meeting.live ? "bg-primary" : "bg-border")} />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-foreground">
                  <Figures>{meeting.title}</Figures>
                </p>
                {meeting.live ? (
                  <Badge variant="solid" tone="destructive" size="lg" radius="rounded" icon={<span data-dot="" className="inline-flex"><CircleDot /></span>}>
                    {copy.liveLabel}
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                <Figures>{meeting.meta}</Figures>
              </p>
            </div>
            {meeting.people && meeting.people.length > 0 ? (
              <div className="hidden items-center gap-2 [@container(min-width:64rem)]:flex">
                {meeting.people.map((id) => (
                  <Avatar key={id} size="32" radius="standard" variant={photos?.[id] ? "image" : "initials"} src={photos?.[id]?.src} name={names[id] ?? id} />
                ))}
                {meeting.more ? (
                  <span className="text-xs text-muted-foreground">
                    <Figures>{`+${meeting.more}`}</Figures>
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={meeting.live ? "default" : "outline"}
                tone={meeting.live ? "primary" : "secondary"}
                onClick={() => join(meeting)}
                className="flex-1 [@container(min-width:40rem)]:flex-none"
              >
                {meeting.live ? copy.joinNow : copy.join}
              </Button>
              <Button
                type="button"
                size="icon-md"
                variant="outline"
                tone="secondary"
                aria-label={fillTemplate(copy.moreLabel, { title: meeting.title })}
                onClick={() => onMore?.(meeting.id)}
              >
                <Ellipsis aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallUpcomingMeetingsCopy = COPY

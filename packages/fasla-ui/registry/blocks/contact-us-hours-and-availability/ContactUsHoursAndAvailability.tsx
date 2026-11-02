"use client"

import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert/alert"
import { Badge } from "../../ui/badge/badge"
import { Select } from "../../ui/select/select"
import {
  ContactUsHeader,
  ContactUsInverseBand,
  ContactUsRule,
  ContactUsSection,
  formatClock,
  openState,
  prefersReducedMotion,
  splitCopy,
  useLiveNow,
  useReveal,
  zoneParts,
  type ContactUsLocale,
  type ContactUsOpenState,
  type ContactUsWeek,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Hours and Availability.
 *
 * Two columns on Desktop, 64px apart. At the start: the eyebrow, the heading,
 * a bordered card of seven day rows (day in `muted-foreground`, hours in
 * `foreground`; today's row on `muted`, its day in `foreground` semibold with
 * a Soft Primary "Today" Badge; Friday and Saturday say Closed in
 * `muted-foreground`), then a Soft Warning Alert for a closure notice. At the
 * end, 420px wide: a dark "Right now" card (the page's opposite theme, in a
 * ContactUsInverseBand) with a label, a big clock, the open or closed state, a
 * hairline and three channel rows, and under it a Timezone Picker card (`card`,
 * bordered): a label, the Select atom and a helper line. Tablet and Mobile
 * stack the right column below the left, 64px apart; the clock is 60px on
 * Desktop, 48px on Tablet and 24px on Mobile, and the picker spans the width.
 * The section pads 96px on Desktop, 64 x 24 on Tablet and 32 x 16 on Mobile.
 *
 * Real: the week is the `hours` prop (Sunday first, in `timeZone`, "Asia/Dubai"
 * by default) and everything on the card is derived from it and from the
 * moment: today's row (it moves at midnight), the clock, open or closed, the
 * time to closing or the next opening, and the Live chat and Phone rows. Give
 * `now` and the block is frozen there. Before the first tick it is neutral: no
 * row is today's, the clock reads "--:--", the dot is muted and the rows say
 * "--". Choosing a zone in the picker re-draws the clock and every row's hours
 * in that zone, worked out from the schedule's own zone at that moment, and
 * the label names that city. The open or closed line and the countdown are
 * durations or the office's own times, so they do not move with the picker.
 * Static: the Email row ("Replies by 10:00 tomorrow"), the zone list, the
 * notice (`notice`, or `null` for none).
 *
 * Motion: once, in view, the header rises and the cards fade in. When the
 * minute turns, the minute digits of the clock slide up 6px and crossfade over
 * 180ms; when the zone changes the whole clock and the hours crossfade over
 * 150ms; the state dot's colour fades over 260ms. The motion card's 200ms
 * copy fade when the state swaps is a plain swap here. Reduced motion: every
 * swap is instant.
 *
 * Content limits: the heading up to 40 characters, a notice title up to 40,
 * its text up to 140.
 */

export interface ContactUsZone {
  /** The IANA time zone. */
  value: string
  /** What the picker shows: the zone's name and its offset. */
  label: string
  /** The city the "Right now" label names while this zone is chosen. */
  city: string
}

export interface ContactUsHoursAndAvailabilityCopy {
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The seven day names, Sunday first. */
  days: readonly [string, string, string, string, string, string, string]
  /** The badge on today's row. */
  today: string
  /** The hours of a closed day. */
  closed: string
  /** The closure notice. `null` leaves it out. */
  notice: { title: string; text: string } | null
  /** The card's label. `{city}` is the chosen zone's city. */
  nowLabel: string
  /** The line while open. `{time}` is the time left, as "3 h 40 m". */
  openClosesIn: string
  /** The line while closed. `{when}` is the next opening. */
  closedOpens: string
  /** The units in the time left. */
  hourUnit: string
  minuteUnit: string
  /** The next opening. `{time}` and `{day}` are filled in. */
  whenToday: string
  whenTomorrow: string
  whenDay: string
  /** The three channel rows. */
  liveChat: string
  phone: string
  email: string
  /** What a channel row says while open. */
  availableNow: string
  /** What Live chat and Phone say while closed. `{when}` is the next opening. */
  opensAgain: string
  /** The Email row. */
  emailReply: string
  /** The picker's label, its helper line, and the zones it offers. */
  pickerLabel: string
  pickerHelp: string
  zones: ContactUsZone[]
}

// An isolate keeps "+4" in order inside Arabic text.
const LRI = "⁦"
const PDI = "⁩"

const COPY: Record<ContactUsLocale, ContactUsHoursAndAvailabilityCopy> = {
  en: {
    eyebrow: "WHEN WE ARE AROUND",
    heading: "Opening hours and response times",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    today: "Today",
    closed: "Closed",
    notice: { title: "Eid al-Fitr closure", text: "The studio is closed from 29 March to 2 April. Emergency support stays on the usual number." },
    nowLabel: "RIGHT NOW IN {city}",
    openClosesIn: "Open · closes in {time}",
    closedOpens: "Closed · opens {when}",
    hourUnit: "h",
    minuteUnit: "m",
    whenToday: "today at {time}",
    whenTomorrow: "tomorrow at {time}",
    whenDay: "{day} at {time}",
    liveChat: "Live chat",
    phone: "Phone",
    email: "Email",
    availableNow: "Available now",
    opensAgain: "Opens {when}",
    emailReply: "Replies by 10:00 tomorrow",
    pickerLabel: "SEE TIMES IN YOUR ZONE",
    pickerHelp: "We detect your timezone automatically — change it if you are booking for someone else.",
    zones: [
      { value: "Asia/Dubai", label: "Gulf Standard Time (GMT+4)", city: "Dubai" },
      { value: "Asia/Riyadh", label: "Arabia Standard Time (GMT+3)", city: "Riyadh" },
      { value: "Asia/Amman", label: "Jordan Time (GMT+3)", city: "Amman" },
      { value: "Europe/London", label: "London Time (GMT or BST)", city: "London" },
      { value: "Asia/Singapore", label: "Singapore Standard Time (GMT+8)", city: "Singapore" },
    ],
  },
  ar: {
    eyebrow: "متى نكون متاحين",
    heading: "ساعات العمل وأوقات الاستجابة",
    days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    today: "اليوم",
    closed: "مغلق",
    notice: { title: "إغلاق عيد الفطر", text: "الاستوديو مغلق من 29 مارس إلى 2 أبريل. يبقى الدعم الطارئ على الرقم المعتاد." },
    nowLabel: "الآن في {city}",
    openClosesIn: "مفتوح، يغلق خلال {time}",
    closedOpens: "مغلق، يفتح {when}",
    hourUnit: "س",
    minuteUnit: "د",
    whenToday: "اليوم الساعة {time}",
    whenTomorrow: "غدًا الساعة {time}",
    whenDay: "يوم {day} الساعة {time}",
    liveChat: "محادثة مباشرة",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    availableNow: "متاح الآن",
    opensAgain: "يفتح {when}",
    emailReply: "الردّ بحلول 10:00 غدًا",
    pickerLabel: "اعرض الأوقات بتوقيتك",
    pickerHelp: "نكتشف منطقتك الزمنية تلقائيًا، غيّرها إن كنت تحجز لشخص آخر.",
    zones: [
      { value: "Asia/Dubai", label: `توقيت الخليج (غرينتش ${LRI}+4${PDI})`, city: "دبي" },
      { value: "Asia/Riyadh", label: `توقيت السعودية (غرينتش ${LRI}+3${PDI})`, city: "الرياض" },
      { value: "Asia/Amman", label: `توقيت عمّان (غرينتش ${LRI}+3${PDI})`, city: "عمّان" },
      { value: "Europe/London", label: "توقيت لندن (غرينتش أو التوقيت الصيفي)", city: "لندن" },
      { value: "Asia/Singapore", label: `توقيت سنغافورة (غرينتش ${LRI}+8${PDI})`, city: "سنغافورة" },
    ],
  },
}

/** Figma's week: Sunday to Thursday 09:00 to 18:00, Thursday to 16:00, Friday and Saturday closed. */
const DEFAULT_WEEK: ContactUsWeek = [
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "16:00" },
  null,
  null,
]

export interface ContactUsHoursAndAvailabilityProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<ContactUsHoursAndAvailabilityCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** Freezes the block at this moment. Without it, it shows the real time. */
  now?: Date | number | string
  /** The zone the week is in. */
  timeZone?: string
  /** The week's opening hours, Sunday first, in `timeZone`. */
  hours?: ContactUsWeek
}

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))
const pad = (n: number) => String(n).padStart(2, "0")

/** Minutes a clock in `to` is ahead of one in `from` at `now`: -720 to +840, wrapped across the week's edge. */
function offsetMinutes(now: Date, from: string, to: string) {
  const a = zoneParts(now, to)
  const b = zoneParts(now, from)
  const diff = (((a.day - b.day) * 1440 + a.minutes - b.minutes) % 10080 + 10080) % 10080
  return diff > 5040 ? diff - 10080 : diff
}

/** "09:00" moved by `delta` minutes, with "+1" or "-1" when it crosses midnight. */
function shift(time: string, delta: number) {
  const total = toMinutes(time) + delta
  const day = total >= 1440 ? " +1" : total < 0 ? " -1" : ""
  const wrapped = ((total % 1440) + 1440) % 1440
  return `${pad(Math.floor(wrapped / 60))}:${pad(wrapped % 60)}${day}`
}

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "")

/** A value that crossfades over 150ms when it changes. Reduced motion: it just swaps. */
function Crossfade({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const key = typeof children === "string" ? children : ""
  const previous = React.useRef(key)
  React.useEffect(() => {
    if (previous.current === key) return
    previous.current = key
    const node = ref.current
    if (!node || typeof node.animate !== "function" || prefersReducedMotion()) return
    node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "cubic-bezier(0.2, 0, 0, 1)" })
  }, [key])
  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  )
}

/**
 * The clock. When only the minutes change (the tick), the minute digits slide
 * up 6px and fade in over 180ms; when the hour or the zone changes, the whole
 * time crossfades over 150ms. Always Western digits, 24-hour.
 */
function Clock({ time, zone }: { time: string; zone: string }) {
  const hour = time.slice(0, 3)
  const minutes = time.slice(3)
  const whole = React.useRef<HTMLSpanElement>(null)
  const minuteNode = React.useRef<HTMLSpanElement>(null)
  const previous = React.useRef({ time, zone })
  React.useEffect(() => {
    const before = previous.current
    previous.current = { time, zone }
    if (before.time === time || before.time === "--:--") return
    if (typeof Element === "undefined" || typeof Element.prototype.animate !== "function" || prefersReducedMotion()) return
    const ease = "cubic-bezier(0.2, 0, 0, 1)"
    if (before.zone === zone && before.time.slice(0, 3) === time.slice(0, 3)) {
      minuteNode.current?.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: ease })
    } else whole.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: ease })
  }, [time, zone])
  return (
    <bdi dir="ltr" className="block font-semibold tabular-nums text-foreground rtl:text-right">
      <span ref={whole} className="inline-block">
        {hour}
        <span ref={minuteNode} className="inline-block">
          {minutes}
        </span>
      </span>
    </bdi>
  )
}

export function ContactUsHoursAndAvailability({
  locale = "en",
  now,
  timeZone = "Asia/Dubai",
  hours = DEFAULT_WEEK,
  ...given
}: ContactUsHoursAndAvailabilityProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const live = useLiveNow(now)
  const [zone, setZone] = React.useState(timeZone)

  const state: ContactUsOpenState | null = live ? openState(hours, timeZone, live) : null
  const delta = live ? offsetMinutes(live, timeZone, zone) : 0
  const chosen = copy.zones.find((option) => option.value === zone)
  const city = chosen?.city ?? copy.zones[0]?.city ?? ""
  const label = fill(copy.nowLabel, { city: locale === "en" ? city.toUpperCase() : city })
  const clock = live ? formatClock(live, zone) : "--:--"

  const when = (next: NonNullable<ContactUsOpenState["next"]>) => {
    const values = { time: next.time, day: copy.days[next.day] ?? "" }
    return fill(next.daysAhead === 0 ? copy.whenToday : next.daysAhead === 1 ? copy.whenTomorrow : copy.whenDay, values)
  }
  const left = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return [h > 0 ? `${h} ${copy.hourUnit}` : "", m > 0 || h === 0 ? `${m} ${copy.minuteUnit}` : ""].filter(Boolean).join(" ")
  }
  const stateText = !state
    ? "--"
    : state.open
      ? fill(copy.openClosesIn, { time: left(state.closesInMinutes ?? 0) })
      : state.next
        ? fill(copy.closedOpens, { when: when(state.next) })
        : copy.closed
  const channel = !state ? "--" : state.open ? copy.availableNow : state.next ? fill(copy.opensAgain, { when: when(state.next) }) : copy.closed
  const dot = !state ? "bg-muted-foreground" : state.open ? "bg-success" : "bg-muted-foreground"

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-16 [@container(min-width:64rem)]:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <ContactUsHeader
            headingId={headingId}
            eyebrow={copy.eyebrow}
            heading={copy.heading}
            reveal
            className="gap-8"
            eyebrowClassName="leading-5 rtl:leading-6"
            headingClassName="text-2xl leading-8 rtl:leading-10 [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem] [@container(min-width:64rem)]:text-4xl"
          />
          <ul data-reveal="fade" className="divide-y divide-border overflow-hidden rounded-[10px] border border-border bg-card">
            {copy.days.map((name, index) => {
              const day = hours[index]
              const isToday = state?.day === index
              return (
                <li
                  key={index}
                  aria-current={isToday ? "date" : undefined}
                  className={`flex items-center justify-between gap-4 px-6 py-4 motion-safe:transition-colors motion-safe:duration-[180ms] ${isToday ? "bg-muted" : ""}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`text-sm leading-5 rtl:leading-6 ${isToday ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{name}</span>
                    {isToday ? <Badge variant="soft" tone="primary" size="sm" radius="rounded">{copy.today}</Badge> : null}
                  </span>
                  {day ? (
                    <bdi dir="ltr" className="text-sm font-medium leading-5 text-foreground rtl:leading-6">
                      <Crossfade>{`${shift(day.open, delta)} – ${shift(day.close, delta)}`}</Crossfade>
                    </bdi>
                  ) : (
                    <span className="text-sm leading-5 text-muted-foreground rtl:leading-6">{copy.closed}</span>
                  )}
                </li>
              )
            })}
          </ul>
          {copy.notice ? (
            <Alert variant="warning" type="soft" data-reveal="fade">
              <AlertTitle>{copy.notice.title}</AlertTitle>
              <AlertDescription>{copy.notice.text}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-6 [@container(min-width:64rem)]:w-[26.25rem] [@container(min-width:64rem)]:shrink-0">
          <ContactUsInverseBand data-reveal="fade" className="flex flex-col gap-6 rounded-[10px] p-8">
            <p className="text-xs font-semibold leading-4 text-muted-foreground rtl:leading-5">{label}</p>
            <div className="text-2xl leading-[2.75rem] rtl:leading-[3.75rem] [@container(min-width:40rem)]:text-5xl [@container(min-width:40rem)]:leading-[3.625rem] [@container(min-width:40rem)]:rtl:leading-[4.5rem] [@container(min-width:64rem)]:text-6xl [@container(min-width:64rem)]:leading-[4.5rem] [@container(min-width:64rem)]:rtl:leading-[5.625rem]">
              <Clock time={clock} zone={zone} />
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden className={`size-2 shrink-0 rounded-full motion-safe:transition-colors motion-safe:duration-[260ms] ${dot}`} />
              <span className="text-sm font-medium leading-5 text-foreground rtl:leading-6">{stateText}</span>
            </div>
            <ContactUsRule className="bg-muted-foreground" />
            <dl className="flex flex-col gap-3 text-sm leading-5 rtl:leading-6">
              {[
                [copy.liveChat, channel],
                [copy.phone, channel],
                [copy.email, copy.emailReply],
              ].map(([name, value]) => (
                <div key={name} className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">{name}</dt>
                  <dd className="text-end font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </ContactUsInverseBand>

          <div data-reveal="fade" className="flex flex-col gap-4 rounded-[10px] border border-border bg-card p-6">
            <p className="text-xs font-semibold leading-4 text-muted-foreground rtl:leading-5">{copy.pickerLabel}</p>
            <Select
              size="md"
              aria-label={copy.pickerLabel}
              items={copy.zones.map((option) => ({ value: option.value, label: option.label }))}
              value={zone}
              onValueChange={(next) => {
                if (next) setZone(next)
              }}
            />
            <p className="text-xs leading-4 text-muted-foreground rtl:leading-5">{copy.pickerHelp}</p>
          </div>
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsHoursAndAvailabilityCopy = COPY

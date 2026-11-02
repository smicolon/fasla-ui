"use client"

import * as React from "react"
import { ArrowRight, Check, Clock, Globe, Video } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button, buttonVariants } from "../../ui/button/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"
import { ContactUsRule, ContactUsSection, prefersReducedMotion, splitCopy, useReveal, type ContactUsLocale } from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Book a Call.
 *
 * One booking card (1248px, 10px corners, a `border` line and a soft shadow on
 * `card`) in two panels. Summary, 380px wide on Desktop, on `muted`, 32px of
 * padding: the host (a 32px initials Avatar, name and role), the call's name
 * (30px; 20px on Mobile), a description in `muted-foreground` and three meta
 * rows (clock, video and globe icons, 18px, `muted-foreground`). Slot Picker,
 * the rest: "Pick a time" and the month, a Boxed small Tabs of five days (Wed
 * 11 is active), a 4 by 3 grid of twelve slots and, under a hairline, a bar
 * with the chosen time in words and a Solid Primary "Confirm booking" Button.
 * In Arabic the two panels swap sides because the page's `dir` flips the row.
 *
 * Tablet: the summary sits above the picker, and the slot grid wraps from
 * four columns to two. Mobile: the day tabs become a horizontally scrolling
 * strip, the slots stay two-up and 44px tall, and the confirm button spans the
 * card. (Figma draws Tablet side by side and its slots 36px tall on Mobile:
 * this follows the brief's responsive notes, not those static frames.)
 *
 * Real: a picker. Choosing a day swaps the slot grid; choosing a slot presses
 * it (`aria-pressed`, one chosen time at a time, the Figma Pressed ring); the
 * bar states the chosen time and `onBook({ day, slot })` is called by the
 * button. While it runs the button is loading, on success the bar is replaced
 * by a confirmation, on failure a message appears and the button comes back.
 * Day 3 (Wednesday 11 March) and 11:30 are chosen at first: pass
 * `defaultDayId` and `defaultSlot` (`null` for none: the bar then waits, and
 * slides up the first time a slot is picked). No `now` is taken: the days are
 * data.
 *
 * Required fields: none, there are no text fields.
 *
 * STAND-IN: Figma's Toggle (15088:228441), the twelve slot buttons, has no code
 * atom. It is a button styled with `buttonVariants` (Outline, md) with
 * `aria-pressed`; Pressed draws the ring Figma's Pressed instance has (the
 * `ring` line and a 3px halo at 50%).
 *
 * Motion: once, when the block is in view, the summary and the picker rise.
 * The slot grid crossfades on a day switch (180ms, with an 8px slide from the
 * side you are moving to; fade only for reduced motion). A slot springs to 1.04
 * and back as it is chosen (120ms). The confirm bar slides up (translateY 100%
 * to 0, 260ms) the first time a slot is chosen; with reduced motion it fades.
 *
 * Content limits: call name up to 20 characters, description up to 110, host
 * role up to 28, each meta line up to 40, day label up to 8, up to 5 days and
 * 12 slots a day.
 */

export interface ContactUsBookingDay {
  /** What `defaultDayId` points at. */
  id: string
  /** The tab: "Mon 09". */
  label: string
  /** The day in words, for the summary bar: "Monday 9 March". */
  longLabel: string
  /** The slots, as the start times "09:00", in order. */
  slots: string[]
}

/** What `onBook` receives. */
export interface ContactUsBooking {
  day: ContactUsBookingDay
  /** The chosen start time, "11:30". */
  slot: string
}

export interface ContactUsBookACallCopy {
  /** The host's name. */
  hostName: string
  /** What the host does. */
  hostRole: string
  /** The avatar's letters. */
  hostInitials: string
  /** The call's name, the section's `h2`. */
  callName: string
  /** What the call is. */
  description: string
  /** The first meta row: the length. */
  duration: string
  /** The second meta row: where it happens. */
  platform: string
  /** The third meta row: the time zone. */
  zone: string
  /** The picker's heading. */
  pickTime: string
  /** The month, next to it. */
  month: string
  /** The days, in order. */
  days: ContactUsBookingDay[]
  /** The time zone as the bar writes it: "GST". */
  zoneShort: string
  /** What goes between the day and the time in the bar. */
  separator: string
  /** The button's label. */
  confirm: string
  /** The button's label while booking. */
  pendingLabel: string
  /** The confirmation. `{summary}` is the bar's sentence. */
  booked: string
  /** The button that lifts the confirmation to pick another time. */
  change: string
  /** Said when booking failed. */
  bookError: string
  /** Names the slot group for assistive technology. `{day}` is the day in words. */
  slotsLabel: string
}

const DAYS_EN: ContactUsBookingDay[] = [
  ["mon", "Mon 09", "Monday 9 March"],
  ["tue", "Tue 10", "Tuesday 10 March"],
  ["wed", "Wed 11", "Wednesday 11 March"],
  ["thu", "Thu 12", "Thursday 12 March"],
  ["fri", "Fri 13", "Friday 13 March"],
].map(([id, label, longLabel]) => ({
  id: id!,
  label: label!,
  longLabel: longLabel!,
  slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "16:00"],
}))

const DAYS_AR: ContactUsBookingDay[] = [
  ["mon", "الاثنين 09", "الاثنين 9 مارس"],
  ["tue", "الثلاثاء 10", "الثلاثاء 10 مارس"],
  ["wed", "الأربعاء 11", "الأربعاء 11 مارس"],
  ["thu", "الخميس 12", "الخميس 12 مارس"],
  ["fri", "الجمعة 13", "الجمعة 13 مارس"],
].map(([id, label, longLabel]) => ({ id: id!, label: label!, longLabel: longLabel!, slots: DAYS_EN[0]!.slots }))

const COPY: Record<ContactUsLocale, ContactUsBookACallCopy> = {
  en: {
    hostName: "Layla Nassar",
    hostRole: "Solutions lead at Fasla",
    hostInitials: "LN",
    callName: "Intro call",
    description: "A 30 minute call to understand what you are building, who it is for and whether Fasla is the right fit.",
    duration: "30 minutes",
    platform: "Google Meet · link sent on confirm",
    zone: "Gulf Standard Time (GMT+4)",
    pickTime: "Pick a time",
    month: "March 2026",
    days: DAYS_EN,
    zoneShort: "GST",
    separator: " · ",
    confirm: "Confirm booking",
    pendingLabel: "Booking",
    booked: "You are booked in: {summary}. A calendar invite is on its way.",
    change: "Pick another time",
    bookError: "We could not book that time. Please try again.",
    slotsLabel: "Times on {day}",
  },
  ar: {
    hostName: "ليلى نصّار",
    hostRole: "مسؤولة الحلول في فاصلة",
    hostInitials: "ل",
    callName: "مكالمة تعارف",
    description: "مكالمة مدتها 30 دقيقة لفهم ما تبنيه، ولمن، وما إذا كانت فاصلة الخيار المناسب.",
    duration: "30 دقيقة",
    platform: "Google Meet، يُرسل الرابط عند التأكيد",
    zone: "توقيت الخليج (GMT+4)",
    pickTime: "اختر وقتًا",
    month: "مارس 2026",
    days: DAYS_AR,
    zoneShort: "بتوقيت الخليج",
    separator: "، ",
    confirm: "أكّد الحجز",
    pendingLabel: "جارٍ الحجز",
    booked: "تم حجز موعدك: {summary}. ستصلك دعوة التقويم قريبًا.",
    change: "اختر وقتًا آخر",
    bookError: "تعذّر حجز هذا الوقت. حاول مرة أخرى.",
    slotsLabel: "الأوقات يوم {day}",
  },
}

export interface ContactUsBookACallProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<ContactUsBookACallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /**
   * Called with the chosen day and slot when the button is pressed. Resolve to
   * show the confirmation; reject, or throw, to show the error.
   */
  onBook?: (booking: ContactUsBooking) => void | Promise<void>
  /** The day chosen at first, by `id`. Wednesday (`wed`) by default, or the first day. */
  defaultDayId?: string
  /** The slot chosen at first. "11:30" by default; `null` for none. */
  defaultSlot?: string | null
  /** How long a slot is, in minutes: it ends the bar's range. 30 by default. */
  slotMinutes?: number
  /** Turns the slots and the button off. */
  disabled?: boolean
}

const STANDARD = "cubic-bezier(0.2, 0, 0, 1)"

/** "11:30" and 30 give "12:00". */
function addMinutes(time: string, minutes: number) {
  const total = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) + minutes
  const wrapped = ((total % 1440) + 1440) % 1440
  return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`
}

const SLOT_CLASS =
  "w-full cursor-pointer text-sm [@container(max-width:39.99rem)]:h-11 " +
  "aria-pressed:ring-ring aria-pressed:after:inset-[-3px] aria-pressed:after:opacity-100 aria-pressed:after:ring-[3px] aria-pressed:after:ring-ring/50 " +
  "motion-safe:transition-transform"

export function ContactUsBookACall({ locale = "en", onBook, defaultDayId, defaultSlot, slotMinutes = 30, disabled = false, className, ...given }: ContactUsBookACallProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const days = copy.days
  const firstDay = days.find((day) => day.id === defaultDayId) ?? days.find((day) => day.id === "wed") ?? days[0]!
  const [dayId, setDayId] = React.useState(firstDay.id)
  const [chosen, setChosen] = React.useState<{ dayId: string; slot: string } | null>(() => {
    const slot = defaultSlot === undefined ? (firstDay.slots.includes("11:30") ? "11:30" : null) : defaultSlot
    return slot ? { dayId: firstDay.id, slot } : null
  })
  const [status, setStatus] = React.useState<"idle" | "pending" | "success" | "error">("idle")
  const alive = React.useRef(true)
  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const day = days.find((item) => item.id === dayId) ?? days[0]!
  const chosenDay = chosen ? days.find((item) => item.id === chosen.dayId) : undefined
  const summary = chosen && chosenDay ? `${chosenDay.longLabel}${copy.separator}${chosen.slot} – ${addMinutes(chosen.slot, slotMinutes)} ${copy.zoneShort}` : ""

  // The day switch: the grid crossfades, sliding 8px toward the side you moved to.
  const grid = React.useRef<HTMLDivElement>(null)
  const lastDay = React.useRef(dayId)
  React.useEffect(() => {
    const from = days.findIndex((item) => item.id === lastDay.current)
    const to = days.findIndex((item) => item.id === dayId)
    lastDay.current = dayId
    const node = grid.current?.firstElementChild as HTMLElement | null
    if (!node || from === to || typeof node.animate !== "function") return
    const rtl = getComputedStyle(node).direction === "rtl"
    const travel = (to > from ? 8 : -8) * (rtl ? -1 : 1)
    node.animate(prefersReducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: `translateX(${travel}px)` }, { opacity: 1, transform: "none" }], { duration: 180, easing: STANDARD })
  }, [dayId, days])

  // The bar slides up the first time a slot is chosen.
  const bar = React.useRef<HTMLDivElement>(null)
  const wasChosen = React.useRef(chosen !== null)
  React.useEffect(() => {
    if (chosen === null) return
    if (wasChosen.current) return
    wasChosen.current = true
    const node = bar.current
    if (!node || typeof node.animate !== "function") return
    node.animate(prefersReducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 260, easing: STANDARD })
  }, [chosen])

  const pick = (slot: string, node: HTMLElement) => {
    setChosen({ dayId: day.id, slot })
    if (status === "error") setStatus("idle")
    if (typeof node.animate === "function" && !prefersReducedMotion()) node.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)", offset: 0.5 }, { transform: "scale(1)" }], { duration: 120, easing: STANDARD })
  }

  const book = async () => {
    if (!chosen || !chosenDay || status === "pending" || disabled) return
    setStatus("pending")
    try {
      await onBook?.({ day: chosenDay, slot: chosen.slot })
      if (alive.current) setStatus("success")
    } catch {
      if (alive.current) setStatus("error")
    }
  }

  const locked = disabled || status === "pending" || status === "success"
  const meta = [
    { Icon: Clock, text: copy.duration },
    { Icon: Video, text: copy.platform },
    { Icon: Globe, text: copy.zone },
  ]
  const letters = Array.from(copy.hostInitials).slice(0, 2).join(" ")

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...rest}>
      <div
        ref={reveal}
        className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-[0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1)] [@container(min-width:64rem)]:flex-row"
      >
        <div data-reveal="rise" className="flex shrink-0 flex-col gap-6 bg-muted p-8 [@container(min-width:64rem)]:w-[23.75rem]">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-flex shrink-0">
              <Avatar variant="initials" radius="rounded" size="32" name={letters} />
            </span>
            <div className="flex min-w-0 flex-col">
              <p className="text-base font-medium text-foreground rtl:leading-7">{copy.hostName}</p>
              <p className="text-sm text-muted-foreground rtl:leading-6">{copy.hostRole}</p>
            </div>
          </div>
          <h2 id={headingId} className="text-xl font-semibold text-foreground rtl:leading-[2.75rem] [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-10 [@container(min-width:40rem)]:rtl:leading-[3.125rem]">
            {copy.callName}
          </h2>
          <p className="text-base text-muted-foreground rtl:leading-7">{copy.description}</p>
          <ul className="flex flex-col gap-4">
            {meta.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon aria-hidden size={18} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground rtl:leading-6">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal="rise" className="flex min-w-0 flex-1 flex-col gap-6 p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-semibold text-foreground rtl:leading-9">{copy.pickTime}</p>
            <p className="text-sm font-medium text-muted-foreground rtl:leading-6">{copy.month}</p>
          </div>
          <Tabs value={dayId} onValueChange={(next) => setDayId(String(next))}>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [@container(min-width:40rem)]:overflow-visible">
              <TabsList variant="boxed" size="sm" className="flex w-max min-w-full [@container(min-width:40rem)]:w-full">
                {days.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} disabled={locked}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div ref={grid} className="mt-6">
              {days.map((item) => (
                <TabsContent key={item.id} value={item.id} className="mt-0 rounded-none focus-visible:ring-0">
                  <div role="group" aria-label={copy.slotsLabel.replace("{day}", item.longLabel)} className="grid grid-cols-2 gap-3 [@container(min-width:64rem)]:grid-cols-4">
                    {item.slots.map((slot) => {
                      const pressed = chosen?.dayId === item.id && chosen.slot === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          aria-pressed={pressed}
                          disabled={locked}
                          onClick={(event) => pick(slot, event.currentTarget)}
                          className={cn(buttonVariants({ variant: "outline", size: "md" }), SLOT_CLASS)}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
          {chosen ? (
            <>
              <ContactUsRule />
              <div ref={bar}>
                {status === "success" ? (
                  <div role="status" className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
                    <p className="flex items-center gap-3 text-sm font-medium text-foreground rtl:leading-6">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-soft-success text-success">
                        <Check aria-hidden size={14} strokeWidth={1.5} />
                      </span>
                      {copy.booked.replace("{summary}", summary)}
                    </p>
                    <Button type="button" variant="link" onClick={() => setStatus("idle")}>
                      {copy.change}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
                    <p aria-live="polite" className="text-sm font-medium text-foreground rtl:leading-6">
                      {summary}
                    </p>
                    <Button type="button" loading={status === "pending"} loadingLabel={copy.pendingLabel} disabled={disabled} onClick={book} className="w-full [@container(min-width:40rem)]:w-auto">
                      {copy.confirm}
                      <ArrowRight aria-hidden className="rtl:-scale-x-100" />
                    </Button>
                  </div>
                )}
                {status === "error" ? (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {copy.bookError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsBookACallCopy = COPY

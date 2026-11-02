"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  ContactUsPhotoSlot,
  ContactUsSection,
  openState,
  splitCopy,
  useLiveNow,
  type ContactUsHours,
  type ContactUsLocale,
  type ContactUsPhoto,
  type ContactUsWeek,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=HQ Feature.
 *
 * Desktop: a photo (664 × 440, 10px corners) and a 520px details column 64px
 * apart, 96px of padding. The details, 32px apart: eyebrow, h2 (36px), a line,
 * the Hours card (a `muted` card, 10px corners, 24px of padding: the label
 * OPENING HOURS and one row per run of days with its times), the live open or
 * closed row (an 8px dot and a line) and two buttons. Tablet and Mobile stack the
 * photo over the details, 64px apart; the photo band is 289px tall on Tablet
 * and 318px on Mobile (Figma's frame heights). The headline steps 36, 30, 24px; on Mobile both buttons go full width.
 *
 * Real vs static: the open or closed row is live. It is computed from `hours`
 * (a `ContactUsWeek`, Sunday first; the Hours card's rows are that week, a row
 * per run of days with the same hours), `timeZone` (default Asia/Dubai) and
 * `now` (freezes the time, for previews and tests). Open reads "Open now ·
 * closes in 3 hours" (hours rounded down; minutes when under an hour), closed
 * "Closed · opens today at 09:00", "tomorrow" or a day's name. Arabic uses a
 * comma for the dot. Before the real time is known (the first render without
 * `now`) the dot is neutral and the line empty. The photo is static: the
 * scroll parallax of Figma's motion card is not built. "Get directions" is a
 * link (`directionsHref`) and "Book a visit" is a link when `bookHref` is
 * given, else a button that calls `onBook`; both are Figma's Solid Primary and
 * Outline Secondary Buttons. Figma draws no calendar icon in "Book a visit", so
 * none is drawn.
 *
 * Motion: the dot cross-fades its colour in 180ms when the state changes; the
 * buttons lift 2px on hover (not with reduced motion). There is no entrance.
 *
 * Content limits: heading up to 28 characters, the line up to 140.
 */

export interface ContactUsHqFeatureCopy {
  /** The small line above the heading. */
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The line under the heading. */
  description: string
  /** The Hours card's label. */
  hoursLabel: string
  /** The seven days' names, Sunday first. */
  dayNames: string[]
  /** Joins the first and last day of a run: "Sunday – Thursday". */
  rangeJoin: string
  /** The word for a closed day. */
  closedLabel: string
  /** The live row when open, before the time: "Open now". */
  openNow: string
  /** "closes in" (open) */
  closesIn: string
  /** "opens" (closed) */
  opens: string
  /** "today", "tomorrow" and the word before the time. */
  today: string
  tomorrow: string
  at: string
  /** Between the state and the rest of the live row: " · " in English, "، " in Arabic. */
  separator: string
  /** "Get directions". */
  directionsLabel: string
  /** "Book a visit". */
  bookLabel: string
}

/** Figma's copy, English and Arabic (Western digits, a comma for the dot, no dash between words). */
const COPY: Record<ContactUsLocale, ContactUsHqFeatureCopy> = {
  en: {
    eyebrow: "HEADQUARTERS",
    heading: "Boulevard Plaza, Dubai",
    description: "The studio is open to clients and candidates. Coffee is on us — just tell us you are coming so the front desk can sign you in.",
    hoursLabel: "OPENING HOURS",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    rangeJoin: " – ",
    closedLabel: "Closed",
    openNow: "Open now",
    closesIn: "closes in",
    opens: "opens",
    today: "today",
    tomorrow: "tomorrow",
    at: "at",
    separator: " · ",
    directionsLabel: "Get directions",
    bookLabel: "Book a visit",
  },
  ar: {
    eyebrow: "المقر الرئيسي",
    heading: "بوليفارد بلازا، دبي",
    description: "الاستوديو مفتوح للعملاء والمرشحين. القهوة علينا، فقط أخبرنا بقدومك ليسجّلك الاستقبال.",
    hoursLabel: "ساعات العمل",
    dayNames: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    rangeJoin: " إلى ",
    closedLabel: "مغلق",
    openNow: "مفتوح الآن",
    closesIn: "يغلق خلال",
    opens: "يفتح",
    today: "اليوم",
    tomorrow: "غدًا",
    at: "عند",
    separator: "، ",
    directionsLabel: "احصل على الاتجاهات",
    bookLabel: "احجز زيارة",
  },
}

/** Sunday to Thursday 09:00 – 18:00, Friday 09:00 – 13:00, Saturday closed. */
const DEFAULT_WEEK: ContactUsWeek = [
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "18:00" },
  { open: "09:00", close: "13:00" },
  null,
]

const same = (a: ContactUsHours, b: ContactUsHours) => (a === null || b === null ? a === b : a.open === b.open && a.close === b.close)

/** The week as runs of neighbouring days with the same hours: Sunday to Thursday, Friday, Saturday. */
function groupDays(week: ContactUsWeek) {
  const groups: { from: number; to: number; hours: ContactUsHours }[] = []
  week.forEach((hours, day) => {
    const last = groups[groups.length - 1]
    if (last && same(last.hours, hours)) last.to = day
    else groups.push({ from: day, to: day, hours })
  })
  return groups
}

/** "3 hours", "1 hour", «3 ساعات», «ساعتين»: whole hours, or minutes under an hour. Western digits. */
function duration(locale: ContactUsLocale, totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const value = hours >= 1 ? hours : Math.max(1, totalMinutes)
  const unit = hours >= 1 ? "hour" : "minute"
  if (locale === "en") return `${value} ${unit}${value === 1 ? "" : "s"}`
  const forms = unit === "hour" ? ["ساعة", "ساعتين", "ساعات", "ساعة"] : ["دقيقة", "دقيقتين", "دقائق", "دقيقة"]
  if (value === 1) return forms[0]
  if (value === 2) return forms[1]
  return `${value} ${value >= 3 && value <= 10 ? forms[2] : forms[3]}`
}

export interface ContactUsHqFeatureProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof ContactUsHqFeatureCopy>, Partial<ContactUsHqFeatureCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** The photo. A `muted` ground shows without one. */
  photo?: ContactUsPhoto
  /** The week's opening hours, Sunday first, in the studio's own time. Drives the Hours card and the live row. */
  hours?: ContactUsWeek
  /** The studio's time zone. */
  timeZone?: string
  /** Freezes the live row at this moment. Without it the row follows the clock. */
  now?: Date | number | string
  /** Where "Get directions" goes. */
  directionsHref?: string
  /** Makes "Book a visit" a link to here. Without it, it is a button that calls `onBook`. */
  bookHref?: string
  /** Called by "Book a visit" when it is a button. */
  onBook?: () => void | Promise<void>
}

const LIFT = "hover:motion-safe:-translate-y-0.5 motion-safe:transition-[transform,background-color,color,opacity] motion-safe:duration-[120ms]"

export function ContactUsHqFeature({ locale = "en", ...given }: ContactUsHqFeatureProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const {
    photo,
    hours = DEFAULT_WEEK,
    timeZone = "Asia/Dubai",
    now,
    directionsHref = "https://www.google.com/maps/search/?api=1&query=Boulevard+Plaza+Tower+1+Downtown+Dubai",
    bookHref,
    onBook,
    className,
    ...html
  } = rest
  const headingId = React.useId()
  const moment = useLiveNow(now)
  const state = moment ? openState(hours, timeZone, moment) : null

  let status = ""
  if (state) {
    if (state.open) status = `${copy.openNow}${copy.separator}${copy.closesIn} ${duration(locale, state.closesInMinutes ?? 0)}`
    else if (state.next) {
      const when =
        state.next.daysAhead === 0 ? copy.today : state.next.daysAhead === 1 ? copy.tomorrow : copy.dayNames[state.next.day]
      status = `${copy.closedLabel}${copy.separator}${copy.opens} ${when} ${copy.at} ${state.next.time}`
    } else status = copy.closedLabel
  }

  const rows = groupDays(hours).map((group) => ({
    key: group.from,
    days: group.from === group.to ? copy.dayNames[group.from] : `${copy.dayNames[group.from]}${copy.rangeJoin}${copy.dayNames[group.to]}`,
    time: group.hours ? `${group.hours.open} – ${group.hours.close}` : copy.closedLabel,
    closed: !group.hours,
  }))

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div className={cn("flex flex-col gap-16", `[@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start`)}>
        <ContactUsPhotoSlot
          photo={photo}
          className={cn("h-[19.875rem] w-full rounded-[10px]", `[@container(min-width:40rem)]:h-[18.0625rem]`, `[@container(min-width:64rem)]:h-[27.5rem] [@container(min-width:64rem)]:min-w-0 [@container(min-width:64rem)]:flex-1`)}
        />
        <div className={cn("flex min-w-0 flex-col gap-8", `[@container(min-width:64rem)]:w-[32.5rem] [@container(min-width:64rem)]:shrink-0`)}>
          <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
          <h2
            id={headingId}
            className={cn(
              "text-2xl font-semibold leading-8 text-foreground rtl:leading-10",
              `[@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem]`,
              `[@container(min-width:64rem)]:text-4xl [@container(min-width:64rem)]:leading-[2.75rem] [@container(min-width:64rem)]:rtl:leading-[3.75rem]`
            )}
          >
            {copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{copy.description}</p>

          <div className="flex flex-col gap-3 rounded-[10px] bg-muted p-6">
            <p className="text-xs font-semibold text-muted-foreground">{copy.hoursLabel}</p>
            {rows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{row.days}</span>
                <span className="text-sm font-medium text-foreground">
                  <bdi dir="ltr">{row.time}</bdi>
                </span>
              </div>
            ))}
          </div>

          <div role="status" data-state={state ? (state.open ? "open" : "closed") : "unknown"} className="flex min-h-5 items-center gap-2">
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0 rounded-full motion-safe:transition-colors motion-safe:duration-[180ms]",
                state ? (state.open ? "bg-success" : "bg-muted-foreground") : "bg-border"
              )}
            />
            <span className="text-sm font-medium text-foreground">{status}</span>
          </div>

          <div className={cn("flex flex-col gap-3", `[@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center`)}>
            <a href={directionsHref} className={buttonVariants({ variant: "default", size: "md", className: cn(LIFT, "w-full", `[@container(min-width:40rem)]:w-auto`) })}>
              {copy.directionsLabel}
            </a>
            {bookHref ? (
              <a href={bookHref} className={buttonVariants({ variant: "outline", size: "md", className: cn(LIFT, "w-full", `[@container(min-width:40rem)]:w-auto`) })}>
                {copy.bookLabel}
              </a>
            ) : (
              <Button type="button" variant="outline" size="md" className={cn(LIFT, "w-full", `[@container(min-width:40rem)]:w-auto`)} onClick={() => void onBook?.()}>
                {copy.bookLabel}
              </Button>
            )}
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
export const contactUsHqFeatureCopy = COPY

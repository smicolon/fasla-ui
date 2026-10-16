"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { DateLib, type DateRange } from "react-day-picker"
import { ar, enUS } from "react-day-picker/locale"

import { Calendar } from "@fasla-ui/ui/calendar"
import { DatePicker } from "@fasla-ui/ui/date-picker"
import { Button } from "@fasla-ui/ui/button"
import { cn } from "@/lib/utils"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

/**
 * The examples show Figma's dates: June 2026, with today pinned to the 17th,
 * so the page renders the same on the server and in every browser.
 */
const JUNE = new Date(2026, 5, 1)
const TODAY = new Date(2026, 5, 17)
const day = (month: number, date: number) => new Date(2026, month, date)

/** Two calendars side by side from `sm` up, sharing a top edge, centred. */
const PAIR = "grid w-full items-start justify-items-center gap-6 sm:grid-cols-2"

function SingleCalendar({ initial, ...props }: Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect"> & { initial?: Date }) {
  const [selected, setSelected] = React.useState<Date | undefined>(initial)
  return (
    <Calendar
      today={TODAY}
      defaultMonth={JUNE}
      {...(props as object)}
      mode="single"
      selected={selected}
      onSelect={setSelected}
    />
  )
}

function RangeCalendar({ initial, ...props }: Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect"> & { initial?: DateRange }) {
  const [selected, setSelected] = React.useState<DateRange | undefined>(initial)
  return (
    <Calendar
      today={TODAY}
      defaultMonth={JUNE}
      {...(props as object)}
      mode="range"
      selected={selected}
      onSelect={setSelected}
    />
  )
}

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"]

/**
 * Figma's "with time labels": the chosen day's name over a column of time
 * slots, at the calendar's start, split from it by a `border` line. The two
 * earliest slots have passed.
 */
function TimeSlots() {
  const s = useTranslations("docs.calendar")
  const locale = useLocale()
  const lib = React.useMemo(() => new DateLib({ locale: locale === "ar" ? ar : enUS, numerals: "latn" }), [locale])
  const [date, setDate] = React.useState<Date>(day(5, 18))
  const [time, setTime] = React.useState("10:00")
  return (
    // Beside the calendar from `sm` up, as in Figma; above it on a phone,
    // where the two do not fit side by side.
    <div className="flex w-fit flex-col rounded-[var(--radius-md)] bg-background p-3 shadow sm:flex-row">
      <div className="relative shrink-0 border-b border-border pb-3 sm:w-[9.25rem] sm:border-b-0 sm:border-e sm:pb-0">
        <div className="flex flex-col gap-4 sm:absolute sm:inset-0 sm:px-3">
          <p className="pt-1 text-center text-sm font-medium text-foreground">{lib.format(date, s("time.weekday"))}</p>
          <div role="listbox" aria-label={s("time.label")} className="grid grid-cols-3 gap-2 sm:-mx-1 sm:flex sm:min-h-0 sm:flex-1 sm:flex-col sm:overflow-y-auto sm:px-1 sm:pb-1">
            {SLOTS.map((slot, i) => (
              <button
                key={slot}
                type="button"
                role="option"
                aria-selected={slot === time}
                disabled={i < 2}
                onClick={() => setTime(slot)}
                className={cn(
                  "h-8 shrink-0 rounded-[var(--radius-md)] border text-base tabular-nums [outline:none] focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm",
                  slot === time
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-foreground hover:bg-accent hover:text-accent-foreground",
                  "disabled:pointer-events-none disabled:text-muted-foreground"
                )}
              >
                {/* A time reads left to right in both scripts. */}
                <span dir="ltr">{slot.replace(":", " : ")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Calendar
        mode="single"
        required
        today={TODAY}
        defaultMonth={JUNE}
        selected={date}
        onSelect={setDate}
        className="mt-3 rounded-none p-0 shadow-none sm:ms-2 sm:mt-0"
      />
    </div>
  )
}

/** Figma's "With labels": two rows of two Ghost Buttons over the calendar. Today is the 6th here, as in Figma. */
function Presets() {
  const s = useTranslations("docs.calendar")
  const today = day(5, 6)
  const [selected, setSelected] = React.useState<Date>(today)
  const [month, setMonth] = React.useState<Date>(JUNE)
  const presets = [
    { label: s("presets.today"), date: today },
    { label: s("presets.yesterday"), date: day(5, 5) },
    { label: s("presets.lastWeek"), date: day(4, 30) },
    { label: s("presets.lastMonth"), date: day(4, 6) },
  ]
  const choose = (date: Date) => {
    setSelected(date)
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }
  return (
    <div className="flex w-fit flex-col gap-6 rounded-[var(--radius-md)] bg-background p-3 shadow">
      <div className="flex flex-col gap-1">
        {[0, 2].map((first) => (
          <div key={first} className="flex gap-1">
            {presets.slice(first, first + 2).map((preset) => (
              <Button key={preset.label} variant="ghost" size="xs" onClick={() => choose(preset.date)}>
                {preset.label}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <Calendar
        mode="single"
        required
        today={today}
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={setSelected}
        className="rounded-none p-0 shadow-none"
      />
    </div>
  )
}

export default function CalendarPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.calendar")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const calendarProps: PropRow[] = [
    { prop: "mode", type: '"single" | "multiple" | "range"', fallback: "", description: s.rich("props.mode", rich) },
    { prop: "selected", type: "Date | Date[] | DateRange", fallback: "", description: s.rich("props.selected", rich) },
    { prop: "onSelect", type: "(selected) => void", fallback: "", description: s.rich("props.onSelect", rich) },
    { prop: "required", type: "boolean", fallback: "false", description: s.rich("props.required", rich) },
    { prop: "defaultMonth", type: "Date", fallback: "", description: s.rich("props.defaultMonth", rich) },
    { prop: "month", type: "Date", fallback: "", description: s.rich("props.month", rich) },
    { prop: "onMonthChange", type: "(month: Date) => void", fallback: "", description: s.rich("props.onMonthChange", rich) },
    { prop: "numberOfMonths", type: "number", fallback: "1", description: s.rich("props.numberOfMonths", rich) },
    { prop: "captionLayout", type: '"label" | "dropdown"', fallback: '"label"', description: s.rich("props.captionLayout", rich) },
    { prop: "startMonth", type: "Date", fallback: "", description: s.rich("props.startMonth", rich) },
    { prop: "endMonth", type: "Date", fallback: "", description: s.rich("props.endMonth", rich) },
    { prop: "radius", type: '"standard" | "rounded"', fallback: '"standard"', description: s.rich("props.radius", rich) },
    { prop: "disabled", type: "Matcher | Matcher[]", fallback: "", description: s.rich("props.disabled", rich) },
    { prop: "today", type: "Date", fallback: "", description: s.rich("props.today", rich) },
    { prop: "showOutsideDays", type: "boolean", fallback: "true", description: s.rich("props.showOutsideDays", rich) },
    { prop: "fixedWeeks", type: "boolean", fallback: "true", description: s.rich("props.fixedWeeks", rich) },
    { prop: "weekStartsOn", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", fallback: "", description: s.rich("props.weekStartsOn", rich) },
    { prop: "locale", type: "DayPickerLocale", fallback: "", description: s.rich("props.locale", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]
  const propTables = [{ part: "Calendar", rows: calendarProps }]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/calendar/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="calendar" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <SingleCalendar initial={day(5, 6)} />
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className={PAIR}>
            <SingleCalendar initial={day(5, 6)} disabled={{ from: day(5, 9), to: day(5, 11) }} aria-label={s("states.single")} />
            <SingleCalendar initial={TODAY} aria-label={s("states.today")} />
          </div>
        </ComponentPreview>
      </section>

      {/* Radius */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("radius.title")}</h2>
        <p className="text-muted-foreground">{s.rich("radius.body", rich)}</p>
        <ComponentPreview>
          <div className={PAIR}>
            <SingleCalendar radius="rounded" initial={day(5, 6)} />
            <RangeCalendar radius="rounded" initial={{ from: day(5, 7), to: day(5, 18) }} />
          </div>
        </ComponentPreview>
      </section>

      {/* Range */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("range.title")}</h2>
        <p className="text-muted-foreground">{s.rich("range.body", rich)}</p>
        <ComponentPreview>
          <RangeCalendar numberOfMonths={2} initial={{ from: day(6, 4), to: day(6, 16) }} />
        </ComponentPreview>
      </section>

      {/* Three months */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("longRange.title")}</h2>
        <p className="text-muted-foreground">{s.rich("longRange.body", rich)}</p>
        <ComponentPreview>
          <RangeCalendar numberOfMonths={3} initial={{ from: day(5, 25), to: day(7, 13) }} />
        </ComponentPreview>
      </section>

      {/* Month and year menus */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("dropdowns.title")}</h2>
        <p className="text-muted-foreground">{s.rich("dropdowns.body", rich)}</p>
        <ComponentPreview>
          <SingleCalendar captionLayout="dropdown" startMonth={new Date(2016, 0)} endMonth={new Date(2036, 11)} initial={day(5, 6)} />
        </ComponentPreview>
      </section>

      {/* With time slots */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("time.title")}</h2>
        <p className="text-muted-foreground">{s.rich("time.body", rich)}</p>
        <ComponentPreview>
          <TimeSlots />
        </ComponentPreview>
      </section>

      {/* With presets */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("presets.title")}</h2>
        <p className="text-muted-foreground">{s.rich("presets.body", rich)}</p>
        <ComponentPreview>
          <Presets />
        </ComponentPreview>
      </section>

      {/* In a form */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("form.title")}</h2>
        <p className="text-muted-foreground">{s.rich("form.body", rich)}</p>
        <ComponentPreview>
          <form className="flex w-full max-w-[17.25rem] flex-col items-start gap-8" onSubmit={(event) => event.preventDefault()}>
            <DatePicker
              name="dob"
              label={s("form.dob")}
              description={s("form.dobHelp")}
              calendarProps={{ today: TODAY, captionLayout: "dropdown", startMonth: new Date(1926, 0), endMonth: new Date(2026, 11) }}
            />
            <Button type="submit">{s("form.submit")}</Button>
          </form>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.grid", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.focus", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        {propTables.map(({ part, rows }) => (
          <div key={part} className="space-y-3">
            <h3 className="text-lg font-semibold">
              <code dir="ltr">{part}</code>
            </h3>
            <PropsTable rows={rows} />
          </div>
        ))}
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function DeliveryDay() {
  const [day, setDay] = React.useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={day} onSelect={setDay} />
}`}</UsageExample>
        <UsageExample title={s("usage.range")}>{`"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export function StayDates() {
  const [stay, setStay] = React.useState<DateRange | undefined>()
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={stay}
      onSelect={setStay}
      disabled={{ before: new Date() }}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.time")}>{`"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]

export function Appointment() {
  const [day, setDay] = React.useState<Date>(new Date())
  const [time, setTime] = React.useState<string>()
  return (
    <div className="flex w-fit rounded-md bg-background p-3 shadow">
      <div className="relative w-[9.25rem] shrink-0 border-e">
        <div className="absolute inset-0 flex flex-col gap-4 px-3">
          <p className="pt-1 text-center text-sm font-medium">
            {day.toLocaleDateString(undefined, { weekday: "long", day: "numeric" })}
          </p>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                aria-pressed={slot === time}
                onClick={() => setTime(slot)}
                className={cn(
                  "h-8 shrink-0 rounded-md border text-sm",
                  slot === time ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-accent"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Calendar
        mode="single"
        required
        selected={day}
        onSelect={setDay}
        className="ms-2 rounded-none p-0 shadow-none"
      />
    </div>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.presets")}>{`"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

const shift = (date: Date, days: number, months = 0) =>
  new Date(date.getFullYear(), date.getMonth() + months, date.getDate() + days)
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

export function DayWithPresets() {
  const today = new Date()
  const [day, setDay] = React.useState<Date>(today)
  const [month, setMonth] = React.useState<Date>(startOfMonth(today))
  const presets = [
    { label: "${s("presets.today")}", date: today },
    { label: "${s("presets.yesterday")}", date: shift(today, -1) },
    { label: "${s("presets.lastWeek")}", date: shift(today, -7) },
    { label: "${s("presets.lastMonth")}", date: shift(today, 0, -1) },
  ]
  return (
    <div className="flex w-fit flex-col gap-6 rounded-md bg-background p-3 shadow">
      <div className="flex max-w-56 flex-wrap gap-1">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="xs"
            onClick={() => {
              setDay(preset.date)
              setMonth(startOfMonth(preset.date))
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="single"
        required
        month={month}
        onMonthChange={setMonth}
        selected={day}
        onSelect={setDay}
        className="rounded-none p-0 shadow-none"
      />
    </div>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.dropdowns")}>{`"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function BirthDay() {
  const [day, setDay] = React.useState<Date | undefined>()
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      startMonth={new Date(1926, 0)}
      endMonth={new Date()}
      selected={day}
      onSelect={setDay}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}

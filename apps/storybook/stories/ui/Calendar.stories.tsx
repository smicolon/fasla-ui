import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { DateLib, type DateRange } from "react-day-picker"
import { ar, enUS } from "react-day-picker/locale"
import { Calendar, type CalendarProps } from "../../../../packages/fasla-ui/registry/ui/calendar"
import { DatePicker } from "../../../../packages/fasla-ui/registry/ui/date-picker"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { cn } from "../../../../packages/fasla-ui/src/lib/utils"

/**
 * Figma: "Standard Calendar" (15117:6294), 8 types × LTR/RTL, and its "Time
 * and Days" part (42278:36791). Four types are props — `mode`,
 * `numberOfMonths`, `captionLayout` and `radius` — and three are compositions:
 * time slots, presets and a form. Direction is the toolbar. Every story
 * follows the Direction and Theme toolbars, except Light and Dark and
 * Directions, which show both at once.
 *
 * The dates are Figma's, in June 2026, with "today" pinned to the day Figma
 * draws as Current, so the stories never change with the real date.
 */

/** The flat story args: Calendar's props are a union per `mode`, which Storybook's `Meta` cannot take. */
type StoryArgs = {
  mode?: "single" | "range"
  radius?: CalendarProps["radius"]
  numberOfMonths?: number
  captionLayout?: "label" | "dropdown"
  showOutsideDays?: boolean
  className?: string
}

const meta: Meta<StoryArgs> = {
  title: "UI/Calendar",
  component: Calendar as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "inline-radio", options: ["single", "range"], description: "One day, or a range of days." },
    radius: {
      control: "inline-radio",
      options: ["standard", "rounded"],
      description: "Day and range corners: 8px, or full circles.",
    },
    numberOfMonths: {
      control: "inline-radio",
      options: [1, 2, 3],
      description: "How many months show side by side.",
    },
    captionLayout: {
      control: "inline-radio",
      options: ["label", "dropdown"],
      description: "The month's name with arrows, or a month and a year menu.",
    },
    showOutsideDays: { control: "boolean", description: "Show the days of the months either side, muted." },
    className: { control: "text", description: "Classes for the calendar's card." },
  },
  args: { mode: "single", radius: "standard", numberOfMonths: 1, captionLayout: "label", showOutsideDays: true },
}

export default meta
type Story = StoryObj<StoryArgs>

/** Figma's dates. June 2026; today is the 17th, Figma's Current day. */
const JUNE = new Date(2026, 5, 1)
const TODAY = new Date(2026, 5, 17)
const day = (month: number, date: number) => new Date(2026, month, date)

/**
 * Sample copy, per script. Prop names stay English everywhere; the Arabic is
 * written in Modern Standard Arabic, not translated word for word.
 */
const COPY = {
  ltr: {
    presets: ["Today", "Yesterday", "Last week", "Last month"],
    dob: "Date of birth",
    dobHelp: "Your date of birth is used to calculate your age.",
    submit: "Submit",
    weekday: "EEEE, d",
  },
  rtl: {
    presets: ["اليوم", "أمس", "الأسبوع الماضي", "الشهر الماضي"],
    dob: "تاريخ الميلاد",
    dobHelp: "نستخدم تاريخ ميلادك لحساب عمرك.",
    submit: "إرسال",
    weekday: "EEEE، d",
  },
}
type StoryCtx = { globals: { direction?: string } }
const isRtl = (ctx: StoryCtx) => ctx.globals.direction === "rtl"
const copy = (ctx: StoryCtx) => (isRtl(ctx) ? COPY.rtl : COPY.ltr)

/** A caption over a cell: a Figma name, so English and left-to-right in both directions. It never wraps. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={cn("w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className)}>
    {children}
  </span>
)

/**
 * The frame round every story but Default. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone).
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** A captioned cell, its caption on the cell's top edge. */
const Cell = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <Head>{caption}</Head>
    {children}
  </div>
)

/** One day, uncontrolled-looking but held in state so it can be changed. */
function SingleCalendar(props: Omit<Extract<CalendarProps, { mode?: "single" }>, "mode" | "selected" | "onSelect"> & { initial?: Date }) {
  const { initial, ...rest } = props
  const [selected, setSelected] = React.useState<Date | undefined>(initial)
  return <Calendar mode="single" today={TODAY} defaultMonth={JUNE} selected={selected} onSelect={setSelected} {...rest} />
}

/** A range, held in state. */
function RangeCalendar(props: Omit<Extract<CalendarProps, { mode: "range" }>, "mode" | "selected" | "onSelect"> & { initial?: DateRange }) {
  const { initial, ...rest } = props
  const [selected, setSelected] = React.useState<DateRange | undefined>(initial)
  return <Calendar mode="range" today={TODAY} defaultMonth={JUNE} selected={selected} onSelect={setSelected} {...rest} />
}

/** The playground: every row on the Controls panel changes it. */
export const Default: Story = {
  render: (args) => {
    const shared = {
      key: `${args.mode}-${args.numberOfMonths}-${args.captionLayout}`,
      radius: args.radius,
      numberOfMonths: args.numberOfMonths,
      captionLayout: args.captionLayout,
      showOutsideDays: args.showOutsideDays,
      className: args.className,
      startMonth: new Date(2016, 0),
      endMonth: new Date(2036, 11),
    }
    return args.mode === "range" ? (
      <RangeCalendar {...shared} initial={{ from: day(5, 7), to: day(5, 18) }} />
    ) : (
      <SingleCalendar {...shared} initial={day(5, 6)} />
    )
  },
}

/**
 * Figma's Basic calendar: one day chosen (the 6th), today (the 17th) on the
 * `accent` fill, and outside days muted. Six week rows always show, so the
 * calendar never changes height between months.
 */
export const Basic: Story = {
  decorators: [framed],
  render: () => <SingleCalendar initial={day(5, 6)} />,
}

/** Figma's "with rounded elements": `radius="rounded"` makes the days and the range band full circles. */
export const RoundedElements: Story = {
  name: "Rounded Elements",
  decorators: [framed],
  render: () => (
    <div className="grid items-start gap-6 sm:grid-cols-2">
      <Cell caption="Single">
        <SingleCalendar radius="rounded" initial={day(5, 6)} />
      </Cell>
      <Cell caption="Range">
        <RangeCalendar radius="rounded" initial={{ from: day(5, 7), to: day(5, 18) }} />
      </Cell>
    </div>
  ),
}

/**
 * Figma's date range picker: `mode="range"` over two months. The ends are
 * `primary`; the days between sit on an `accent` band, broken at the end of
 * each week. Only the outer months carry arrows.
 */
export const DateRangePicker: Story = {
  name: "Date Range",
  decorators: [framed],
  render: () => <RangeCalendar numberOfMonths={2} initial={{ from: day(6, 4), to: day(6, 16) }} />,
}

/** Figma's long range date picker: three months, a range that runs across all of them. */
export const LongRange: Story = {
  decorators: [framed],
  render: () => <RangeCalendar numberOfMonths={3} initial={{ from: day(5, 25), to: day(7, 13) }} />,
}

/**
 * Figma's With dropdowns: `captionLayout="dropdown"`. The caption becomes a
 * month and a year Select (`sm`), and the arrows go.
 */
export const Dropdowns: Story = {
  decorators: [framed],
  render: () => (
    <SingleCalendar captionLayout="dropdown" startMonth={new Date(2016, 0)} endMonth={new Date(2036, 11)} initial={day(5, 6)} />
  ),
}

/** The time slots of Figma's Time and Days part, `09:00` to `13:00`. */
const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"]

/**
 * Figma's "with time labels": the chosen day's name over a column of time
 * slots, beside the calendar, split by a `border` line. Past slots are muted
 * and cannot be chosen. A composition, not a prop: see the docs page for the
 * code.
 */
function TimeSlots({ rtl }: { rtl: boolean }) {
  const c = rtl ? COPY.rtl : COPY.ltr
  const lib = new DateLib({ locale: rtl ? ar : enUS, numerals: "latn" })
  const [date, setDate] = React.useState<Date>(day(5, 18))
  const [time, setTime] = React.useState<string>("10:00")
  return (
    // Beside the calendar from `sm` up, as in Figma; above it on a phone,
    // where the two do not fit side by side.
    <div className="flex w-fit flex-col rounded-[var(--radius-md)] bg-background p-3 shadow sm:flex-row">
      <div className="relative shrink-0 border-b border-border pb-3 sm:w-[9.25rem] sm:border-b-0 sm:border-e sm:pb-0">
        <div className="flex flex-col gap-4 sm:absolute sm:inset-0 sm:px-3">
          <p className="pt-1 text-center text-sm font-medium text-foreground">{lib.format(date, c.weekday)}</p>
          <div role="listbox" aria-label="Time" className="grid grid-cols-3 gap-2 sm:-mx-1 sm:flex sm:min-h-0 sm:flex-1 sm:flex-col sm:overflow-y-auto sm:px-1 sm:pb-1">
            {SLOTS.map((slot, i) => {
              const past = i < 2
              const chosen = slot === time
              return (
                <button
                  key={slot}
                  type="button"
                  role="option"
                  aria-selected={chosen}
                  disabled={past}
                  onClick={() => setTime(slot)}
                  className={cn(
                    "h-8 shrink-0 rounded-[var(--radius-md)] border text-base tabular-nums [outline:none] focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm",
                    chosen
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-foreground hover:bg-accent hover:text-accent-foreground",
                    "disabled:pointer-events-none disabled:text-muted-foreground"
                  )}
                >
                  {/* A time reads left to right in both scripts. */}
                <span dir="ltr">{slot.replace(":", " : ")}</span>
                </button>
              )
            })}
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

export const TimeLabels: Story = {
  name: "Time Slots",
  decorators: [framed],
  render: (_args, ctx) => <TimeSlots rtl={isRtl(ctx)} />,
}

/**
 * Figma's "With labels": preset days as Ghost Buttons (`xs`) over the
 * calendar. Today is the 6th here, as in Figma; a chosen today keeps a dot
 * under its number. A composition, not a prop.
 */
function Presets({ rtl }: { rtl: boolean }) {
  const c = rtl ? COPY.rtl : COPY.ltr
  const today = day(5, 6)
  const [selected, setSelected] = React.useState<Date>(today)
  const [month, setMonth] = React.useState<Date>(JUNE)
  const choose = (date: Date) => {
    setSelected(date)
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }
  const presets = [
    today,
    new Date(2026, 5, 5),
    new Date(2026, 4, 30),
    new Date(2026, 4, 6),
  ]
  return (
    <div className="flex w-fit flex-col gap-6 rounded-[var(--radius-md)] bg-background p-3 shadow">
      {/* Figma's two rows of two, 4px apart. */}
      <div className="flex flex-col gap-1">
        {[0, 2].map((first) => (
          <div key={first} className="flex gap-1">
            {c.presets.slice(first, first + 2).map((label, i) => (
              <Button key={label} variant="ghost" size="xs" onClick={() => choose(presets[first + i]!)}>
                {label}
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

export const WithPresets: Story = {
  name: "Presets",
  decorators: [framed],
  render: (_args, ctx) => <Presets rtl={isRtl(ctx)} />,
}

/** Figma's Date Form: a Date Picker with its label and helper text in a form, over a Submit button. */
export const DateForm: Story = {
  decorators: [framed],
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <form className="flex w-[17.25rem] flex-col items-start gap-8" onSubmit={(event) => event.preventDefault()}>
        <DatePicker name="dob" label={c.dob} description={c.dobHelp} calendarProps={{ today: TODAY, captionLayout: "dropdown", startMonth: new Date(1926, 0), endMonth: new Date(2026, 11) }} />
        <Button type="submit">{c.submit}</Button>
      </form>
    )
  },
}

/**
 * Every day state Figma draws, in one month: chosen (the 6th), today (the
 * 17th), a range from the 22nd to the 25th, outside days, and days that
 * cannot be chosen (the 9th to the 11th, at half opacity). Point at a day to
 * see Hover.
 */
export const DayStates: Story = {
  name: "States",
  decorators: [framed],
  render: () => (
    <div className="grid items-start gap-6 sm:grid-cols-2">
      <Cell caption="Chosen · today · disabled">
        <SingleCalendar initial={day(5, 6)} disabled={{ from: day(5, 9), to: day(5, 11) }} />
      </Cell>
      <Cell caption="Range · chosen today">
        <RangeCalendar initial={{ from: day(5, 17), to: day(5, 25) }} />
      </Cell>
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/** Light and Dark, one panel each, whatever the Theme toolbar says. */
export const LightAndDark: Story = {
  decorators: [framed],
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {THEMES.map((theme) => (
        <div key={theme} className={cn(theme, "flex flex-col gap-4 rounded-lg border bg-background p-6 text-foreground")}>
          <Head>{theme[0]!.toUpperCase() + theme.slice(1)}</Head>
          <RangeCalendar initial={{ from: day(5, 7), to: day(5, 12) }} />
        </div>
      ))}
    </div>
  ),
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its own
 * `dir`, `lang` and font. In RTL the week starts on Saturday, the months are
 * Arabic with Western digits, the weekdays are one letter, and the arrows
 * swap ends and point the other way.
 */
export const Directions: Story = {
  decorators: [framed],
  render: () => (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      {(["ltr", "rtl"] as const).map((direction) => (
        <div
          key={direction}
          dir={direction}
          lang={direction === "rtl" ? "ar" : "en"}
          className={cn("flex flex-col gap-1.5", direction === "rtl" && "font-arabic")}
        >
          <Head>{direction.toUpperCase()}</Head>
          <RangeCalendar numberOfMonths={2} initial={{ from: day(6, 4), to: day(6, 16) }} />
        </div>
      ))}
    </div>
  ),
}

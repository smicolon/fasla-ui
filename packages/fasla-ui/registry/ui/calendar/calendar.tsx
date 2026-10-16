"use client"

import * as React from "react"
import {
  DayPicker,
  type ChevronProps,
  type DayButtonProps,
  type DayPickerLocale,
  type DayPickerProps,
  type DropdownProps,
} from "react-day-picker"
import { ar, enUS } from "react-day-picker/locale"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../button/button"
import { Select } from "../select/select"

/*
 * Figma: "Standard Calendar" (15117:6294), 8 types × LTR/RTL, and its "Time
 * and Days" part (42278:36791).
 *
 * Built on react-day-picker, which owns the behaviour: the month grid, the
 * keyboard (arrows, Page Up/Down, Home/End), single, multiple and range
 * selection, disabled days and the screen-reader labels. This file owns the
 * look and the reading direction.
 *
 * Figma type → code:
 *  - Basic calendar → `mode="single"`.
 *  - with rounded elements → `radius="rounded"`.
 *  - date range picker → `mode="range" numberOfMonths={2}`.
 *  - long range date picker → `mode="range" numberOfMonths={3}`.
 *  - With dropdowns → `captionLayout="dropdown"`: the caption is a month and
 *    a year Select, and the arrows go.
 *  - with time labels, With labels (presets) and Date Form are compositions,
 *    shown in the stories and on the docs page.
 *  - `Direction` → the page's `dir`, read from where the calendar sits.
 *
 * The day cells, in Figma's names:
 *  - a plain day → `foreground`; outside the month → `muted-foreground`.
 *  - Hover → `accent` with `accent-foreground`, outside days too.
 *  - Current (today) → `accent` with `accent-foreground`.
 *  - Selected, and both ends of a range → `primary` with
 *    `primary-foreground`. Today, chosen, keeps a 3px dot under its number.
 *  - The days between a range's ends sit on an `accent` band, rounded where
 *    the range starts and ends and where a week row starts and ends.
 */

type CalendarRadius = "standard" | "rounded"

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * Where the calendar sits: its direction and language. Read from the
 * calendar's parent, not from the calendar, which carries the `dir` and `lang`
 * it was given.
 */
type PlaceContext = { direction: "ltr" | "rtl"; lang?: string }

function readContext(node: HTMLElement): PlaceContext {
  const parent = node.parentElement ?? node
  const attribute = parent.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
  const isRtl = attribute === "rtl" || (attribute !== "ltr" && getComputedStyle(parent).direction === "rtl")
  return {
    direction: isRtl ? "rtl" : "ltr",
    lang: parent.closest("[lang]")?.getAttribute("lang") || undefined,
  }
}

/** Arabic on an Arabic page, or on a right-to-left page with no `lang`. */
const isArabic = (context: PlaceContext) =>
  context.lang ? context.lang.toLowerCase().startsWith("ar") : context.direction === "rtl"

/**
 * Corner classes per radius, written out whole so Tailwind finds them:
 * Figma's `border radius/md` (8px, the preset's `--radius-md`) or a full
 * circle.
 */
const RADIUS = {
  standard: {
    box: "rounded-[var(--radius-md)]",
    start: "rounded-s-[var(--radius-md)]",
    end: "rounded-e-[var(--radius-md)]",
    rowEnds: "first:rounded-s-[var(--radius-md)] last:rounded-e-[var(--radius-md)]",
  },
  rounded: {
    box: "rounded-full",
    start: "rounded-s-full",
    end: "rounded-e-full",
    rowEnds: "first:rounded-s-full last:rounded-e-full",
  },
} as const

const CalendarContext = React.createContext<{ radius: CalendarRadius; multipleMonths: boolean }>({
  radius: "standard",
  multipleMonths: false,
})

type DayModifiers = DayButtonProps["modifiers"]

/**
 * A day's selection, as drawn. With more than one month shown, a day outside
 * its month is also shown in its own, so only that one is drawn chosen, as in
 * Figma's two-month type.
 */
function drawnSelection(modifiers: DayModifiers, multipleMonths: boolean) {
  if (multipleMonths && modifiers.outside) return { start: false, middle: false, end: false, chosen: false }
  const middle = Boolean(modifiers.range_middle)
  return {
    start: Boolean(modifiers.range_start),
    middle,
    end: Boolean(modifiers.range_end),
    chosen: !middle && Boolean(modifiers.selected || modifiers.range_start || modifiers.range_end),
  }
}

/**
 * A day's grid cell. It draws the band behind a range: `accent`, from the
 * range's start to its end, rounded there and at both ends of each week row.
 */
function CalendarDay({
  modifiers,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { day?: unknown; modifiers: DayModifiers }) {
  // The cell already carries the day as `data-day`; the object itself is not
  // an attribute.
  delete props.day
  const { radius, multipleMonths } = React.useContext(CalendarContext)
  const corners = RADIUS[radius]
  const { start, middle, end } = drawnSelection(modifiers, multipleMonths)
  const banded = start || middle || end
  return (
    <td
      className={cn(
        className,
        banded && cn("bg-accent", corners.rowEnds, start && corners.start, end && corners.end)
      )}
      {...props}
    />
  )
}

/**
 * A day: Figma's 32px `Number` cell, `text-sm` in a box with the radius's
 * corners. The look follows the day's state, strongest first: a day between a
 * range's ends, a chosen day (or a range end), today, then a plain or outside
 * day.
 *
 * Focus is Input's halo: a 3px `ring/50` round the box, drawn above the
 * neighbouring days. Forced colours drop it, so there a 2px `Highlight`
 * outline marks focus instead, and a chosen day keeps a system outline.
 */
function CalendarDayButton({ day, modifiers, className, ...props }: DayButtonProps) {
  const { radius, multipleMonths } = React.useContext(CalendarContext)
  const ref = React.useRef<HTMLButtonElement>(null)
  // react-day-picker's own DayButton moves focus here as the grid's focus
  // moves. A day that already has focus is left alone: focusing it again would
  // only risk scrolling the page.
  React.useEffect(() => {
    if (modifiers.focused && ref.current && document.activeElement !== ref.current) ref.current.focus()
  }, [modifiers.focused])

  const { start, middle, end, chosen } = drawnSelection(modifiers, multipleMonths)
  const today = !middle && !chosen && modifiers.today

  return (
    <button
      ref={ref}
      data-slot="calendar-day"
      data-day={day.isoDate}
      data-chosen={chosen || undefined}
      data-range-start={start || undefined}
      data-range-middle={middle || undefined}
      data-range-end={end || undefined}
      className={cn(
        "relative flex size-8 items-center justify-center text-sm font-normal [outline:none]",
        RADIUS[radius].box,
        "transition-[color,background-color,box-shadow] motion-reduce:transition-none",
        "focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "focus-visible:forced-colors:[outline:2px_solid_Highlight]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        chosen
          ? "bg-primary text-primary-foreground forced-colors:[outline:1px_solid_Highlight]"
          : today
            ? "bg-accent text-accent-foreground"
            : cn(
                "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                modifiers.outside ? "text-muted-foreground" : middle ? "text-accent-foreground" : "text-foreground"
              ),
        // Figma's 3px dot, 2px above the box's bottom edge.
        chosen &&
          modifiers.today &&
          "after:absolute after:inset-x-0 after:bottom-0.5 after:mx-auto after:size-[3px] after:rounded-full after:bg-primary-foreground after:content-['']",
        className
      )}
      {...props}
    />
  )
}

/** The arrows' glyphs: lucide's chevrons at Figma's 1.5 stroke, sized by the button. */
function CalendarChevron({ orientation, className }: ChevronProps) {
  const Icon =
    orientation === "left"
      ? ChevronLeftIcon
      : orientation === "right"
        ? ChevronRightIcon
        : orientation === "up"
          ? ChevronUpIcon
          : ChevronDownIcon
  return <Icon aria-hidden="true" strokeWidth={1.5} className={className} />
}

/**
 * The previous and next arrows: Figma's Icon Button, Outline in the Primary
 * style at xs (26px). react-day-picker points each chevron for the reading
 * direction, so in RTL the previous month's arrow is on the right and points
 * right.
 */
function CalendarNavButton({ className, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return <Button variant="outline" tone="primary" size="icon-xs" className={className} {...props} />
}

/**
 * The month and year menus of `captionLayout="dropdown"`: Figma's Select
 * Input at `sm`, side by side and sharing the row.
 */
function CalendarDropdown({ options = [], value, onChange, disabled, "aria-label": ariaLabel }: DropdownProps) {
  const items = React.useMemo(
    () => options.map((option) => ({ value: String(option.value), label: option.label, disabled: option.disabled })),
    [options]
  )
  return (
    <Select
      size="sm"
      aria-label={ariaLabel}
      disabled={disabled}
      modal={false}
      className="min-w-0 flex-1"
      items={items}
      value={value == null ? null : String(value)}
      onValueChange={(next) => {
        if (next == null) return
        // react-day-picker reads the new value off a select's change event.
        onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>)
      }}
    />
  )
}

/** `Omit` for each member of a union, so the mode-shaped prop sets stay apart. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type CalendarProps = DistributiveOmit<DayPickerProps, "navLayout"> & {
  /** Day and range corners: Figma's 8px `border radius/md`, or full circles. */
  radius?: CalendarRadius
}

/**
 * A month calendar for choosing a day or a range, from Figma's Standard
 * Calendar. Takes every react-day-picker prop but `navLayout`.
 *
 * Reads the page's direction and language: an Arabic page gets Arabic month
 * names and one-letter weekdays, with the week starting on Saturday; any
 * other page starts the week on Sunday. Digits are Western in both. Pass
 * `dir`, `locale` or `weekStartsOn` to choose for yourself.
 */
function Calendar({
  radius = "standard",
  showOutsideDays = true,
  fixedWeeks = true,
  captionLayout = "label",
  hideNavigation,
  dir,
  locale,
  weekStartsOn,
  numerals = "latn",
  className,
  classNames,
  components,
  formatters,
  ...props
}: CalendarProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const [context, setContext] = React.useState<PlaceContext>({ direction: "ltr" })

  // Read before the first paint, then again whenever an ancestor's `dir`,
  // `lang` or `class` changes — a locale switch, Storybook's toolbar. Each
  // ancestor is observed on its own, without `subtree`.
  useIsomorphicLayoutEffect(() => {
    const node = rootRef.current
    if (!node) return
    const read = () => {
      const next = readContext(node)
      setContext((prev) => (prev.direction === next.direction && prev.lang === next.lang ? prev : next))
    }
    read()
    if (typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(read)
    for (let el = node.parentElement; el; el = el.parentElement) {
      observer.observe(el, { attributes: true, attributeFilter: ["dir", "lang", "class"] })
    }
    return () => observer.disconnect()
  }, [])

  const direction = dir === "rtl" || dir === "ltr" ? dir : context.direction
  const arabic = isArabic({ ...context, direction })
  const resolvedLocale: Partial<DayPickerLocale> = locale ?? (arabic ? ar : enUS)
  const dropdowns = captionLayout.startsWith("dropdown")

  const parts = React.useMemo(
    () => ({
      Root: ({ rootRef: pickerRef, ...rootProps }: React.ComponentPropsWithoutRef<"div"> & { rootRef?: React.Ref<HTMLDivElement> }) => (
        <div ref={mergeRefs(pickerRef, rootRef)} data-slot="calendar" {...rootProps} />
      ),
      Chevron: CalendarChevron,
      Day: CalendarDay,
      DayButton: CalendarDayButton,
      PreviousMonthButton: CalendarNavButton,
      NextMonthButton: CalendarNavButton,
      Dropdown: CalendarDropdown,
      ...components,
    }),
    [components]
  )

  return (
    <CalendarContext.Provider value={{ radius, multipleMonths: (props.numberOfMonths ?? 1) > 1 }}>
      <DayPicker
        dir={direction}
        locale={resolvedLocale}
        weekStartsOn={weekStartsOn ?? (direction === "rtl" ? 6 : 0)}
        numerals={numerals}
        showOutsideDays={showOutsideDays}
        fixedWeeks={fixedWeeks}
        captionLayout={captionLayout}
        hideNavigation={hideNavigation ?? dropdowns}
        navLayout="around"
        formatters={{
          // Figma's weekday heads: two letters in English, one in Arabic.
          formatWeekdayName: (date, _options, dateLib) => dateLib!.format(date, arabic ? "ccccc" : "cccccc"),
          ...formatters,
        }}
        classNames={{
          // Figma's card: `background`, 12px padding, `border radius/md` and
          // `shadow/default/sm` (Tailwind 3's `shadow`).
          // `className` is merged in here, so it can override the card.
          root: cn("relative w-fit rounded-[var(--radius-md)] bg-background p-3 text-foreground shadow", className),
          // Months sit 8px apart, as in the two-month type; the first is at
          // the start, so in RTL it is on the right. Where they do not fit
          // side by side (a phone), they wrap, centred, 16px apart.
          months: "relative flex flex-wrap justify-center gap-x-2 gap-y-4",
          // The caption — the month's name, or the month and year menus — sits
          // 16px above the grid. The arrows hang at its two ends; only the
          // outer months have them.
          month: "relative flex w-56 flex-col gap-4",
          month_caption: dropdowns ? "flex" : "flex min-h-6 justify-center pt-1",
          caption_label: "text-sm font-medium text-foreground",
          dropdowns: "flex w-full gap-1.5",
          button_previous: "absolute start-0 top-px z-10",
          button_next: "absolute end-0 top-px z-10",
          chevron: "",
          // The grid: the weekday row and six week rows, 8px apart.
          month_grid: "flex flex-col gap-2",
          weekdays: "flex",
          weekday: "flex h-5 w-8 items-center justify-center text-xs font-normal text-muted-foreground",
          weeks: "flex flex-col gap-2",
          week: "flex",
          day: "relative size-8 p-0 text-center",
          day_button: "",
          // The band behind a range is drawn by CalendarDay.
          range_start: "",
          range_middle: "",
          range_end: "",
          selected: "",
          today: "",
          outside: "",
          disabled: "",
          hidden: "invisible",
          focused: "",
          footer: "mt-3 text-sm text-muted-foreground",
          ...classNames,
        }}
        components={parts}
        // The rest is one of DayPicker's mode-shaped prop sets, which a spread
        // of the destructured rest no longer narrows.
        {...(props as DayPickerProps)}
      />
    </CalendarContext.Provider>
  )
}
Calendar.displayName = "Calendar"

export { Calendar, CalendarDayButton }
export type { CalendarRadius }

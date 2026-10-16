"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { CalendarIcon } from "lucide-react"
import { DateLib, type DateRange, type PropsBase } from "react-day-picker"
import { ar, enUS } from "react-day-picker/locale"
import { cn } from "../../../src/lib/utils"
import { Calendar, type CalendarRadius } from "../calendar/calendar"
import { selectFieldClasses, selectTriggerVariants } from "../select/select"

/*
 * Figma: "Date Picker" (15113:5466, 48 variants), opening Figma's Standard
 * Calendar (15117:6294).
 *
 * The trigger is Select's: the same box, padding, gaps, border, shadow, text
 * and focus ring, read from `selectTriggerVariants`, so a Date Picker and a
 * Select of the same size line up in a form. The calendar opens in Base UI's
 * Popover, which owns opening and closing, Escape, presses outside, returning
 * focus to the trigger and placing the calendar against it.
 *
 * Figma axis → code:
 *  - `Size` (xs / sm / md / lg) → `size`. Figma's default is xs; code's is md,
 *    as for every atom.
 *  - `State`: Default → nothing; Focus → real keyboard focus, and the whole
 *    time the calendar is open; Disabled → `disabled`.
 *  - `Variants` (Inactive / Active) → not a prop: the placeholder, or a value.
 *  - `Label` → `label`. The helper labels are named as on Select.
 *  - `Direction` → the page's `dir`, read from the trigger and handed to Base
 *    UI and to the calendar.
 */

type DatePickerSize = "xs" | "sm" | "md" | "lg"
type DatePickerMode = "single" | "range"

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
 * Where the trigger sits: its direction, language and font. The calendar is
 * portalled to `<body>`, out of the trigger's subtree, so it inherits none of
 * them; the positioner re-applies them so an Arabic page gets a right-to-left,
 * Cairo calendar. Base UI only learns the direction from its
 * DirectionProvider. The same reading as Select's and Tooltip's.
 */
type TriggerContext = {
  direction: "ltr" | "rtl"
  lang?: string
  fontFamily?: string
}

function readContext(node: HTMLElement): TriggerContext {
  const attribute = node.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
  const style = getComputedStyle(node)
  const isRtl = attribute === "rtl" || (attribute !== "ltr" && style.direction === "rtl")
  return {
    direction: isRtl ? "rtl" : "ltr",
    lang: node.closest("[lang]")?.getAttribute("lang") || undefined,
    fontFamily: style.fontFamily || undefined,
  }
}

const isArabic = (context: TriggerContext) =>
  context.lang ? context.lang.toLowerCase().startsWith("ar") : context.direction === "rtl"

/**
 * Figma's value and placeholder, per language: "Jan 20, 2026" and
 * "20 يناير 2026", with Western digits in both. A range joins its two ends
 * with " - ".
 */
const COPY = {
  en: { locale: enUS, format: "MMM dd, yyyy", placeholder: "Pick a date" },
  ar: { locale: ar, format: "dd MMMM yyyy", placeholder: "اختر تاريخًا" },
} as const

/**
 * The open calendar's surface: Select's menu surface — `popover`, a 1px
 * `input` border and `shadow/md` — so every floating panel has the same edge.
 * Figma's Calendar card is shadow only, which leaves it without an edge on a
 * Dark page.
 */
const FLOATING = "border border-input bg-popover text-popover-foreground shadow-md"

/** The submitted value: an ISO 8601 date, or a range as an ISO 8601 interval ("start/end"). */
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

/** The Calendar props a Date Picker passes through. It sets the mode and the selection itself. */
type DatePickerCalendarProps = Omit<PropsBase, "navLayout" | "numberOfMonths" | "dir"> & {
  /** Day and range corners: Figma's 8px `border radius/md`, or full circles. */
  radius?: CalendarRadius
}

type DatePickerFieldProps = {
  /** Field height: 28, 32, 36 or 40px, as on Select. */
  size?: DatePickerSize
  /** The field's label, above it. Without it, pass `aria-label`. */
  label?: React.ReactNode
  /** A short note at the end of the label row — "Optional". Read out with the field. */
  labelEnd?: React.ReactNode
  /** Helper text at the start of the row under the field. */
  description?: React.ReactNode
  /** Helper text at the end of the row under the field. */
  descriptionEnd?: React.ReactNode
  /** Shown while no date is chosen. Defaults to "Pick a date", or "اختر تاريخًا" on an Arabic page. */
  placeholder?: React.ReactNode
  /** Makes the field unusable and dims it to half opacity. */
  disabled?: boolean
  /** How many months the calendar shows side by side. */
  numberOfMonths?: number
  /** More Calendar props: disabled days, the shown month, the caption layout, `radius`. */
  calendarProps?: DatePickerCalendarProps
  /** The name the value is submitted under: `2026-01-20`, or `2026-01-20/2026-02-09` for a range. */
  name?: string
  /** The id of a form this field belongs to, when it sits outside it. */
  form?: string
  /** The trigger's id. */
  id?: string
  /** Controls whether the calendar is open. */
  open?: boolean
  /** Whether the calendar starts open. */
  defaultOpen?: boolean
  /** Called when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void
  /**
   * How the calendar avoids the window edge. By default it flips above the
   * trigger when there is no room below. Pass `{ side: "none" }` to keep it
   * below.
   */
  collisionAvoidance?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Positioner>["collisionAvoidance"]
  /** Where the calendar renders. Default `<body>`. */
  container?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>["container"]
  "aria-label"?: string
  "aria-labelledby"?: string
  /** Classes for the whole field group. The `ref` goes to the trigger. */
  className?: string
}

type SingleProps = {
  /** One day, or a range from one day to another. */
  mode?: "single"
  /** The chosen day, when controlled. `null` shows the placeholder. */
  value?: Date | null
  /** The day chosen on first render. */
  defaultValue?: Date | null
  /** Called with the new day. The calendar closes once a day is chosen. */
  onValueChange?: (value: Date | null) => void
}

type RangeProps = {
  mode: "range"
  /** The chosen range, when controlled. */
  value?: DateRange | null
  /** The range chosen on first render. */
  defaultValue?: DateRange | null
  /** Called with the new range, at each end. The calendar closes once both ends are chosen. */
  onValueChange?: (value: DateRange | null) => void
}

export type DatePickerProps = DatePickerFieldProps & (SingleProps | RangeProps)

/**
 * A date field: Select's trigger, with a calendar icon and the chosen day or
 * range, opening a Calendar under it. From Figma's Date Picker.
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      size = "md",
      mode = "single",
      label,
      labelEnd,
      description,
      descriptionEnd,
      placeholder,
      disabled = false,
      numberOfMonths,
      calendarProps,
      name,
      form,
      id,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      collisionAvoidance,
      container,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...valueProps
    },
    ref
  ) => {
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const mergedRef = React.useMemo(() => mergeRefs(ref, triggerRef), [ref])
    const popupRef = React.useRef<HTMLDivElement | null>(null)

    const [context, setContext] = React.useState<TriggerContext>({ direction: "ltr" })
    const read = React.useCallback((node: HTMLElement | null) => {
      if (!node) return
      const next = readContext(node)
      setContext((prev) =>
        prev.direction === next.direction && prev.lang === next.lang && prev.fontFamily === next.fontFamily
          ? prev
          : next
      )
    }, [])
    // Read before the first paint, then whenever an ancestor's `dir`, `lang`,
    // `class` or `style` changes, as Select does.
    useIsomorphicLayoutEffect(() => {
      const node = triggerRef.current
      read(node)
      if (!node || typeof MutationObserver === "undefined") return
      const observer = new MutationObserver(() => read(triggerRef.current))
      for (let el = node.parentElement; el; el = el.parentElement) {
        observer.observe(el, { attributes: true, attributeFilter: ["dir", "lang", "class", "style"] })
      }
      return () => observer.disconnect()
    }, [read])

    // Open state, controlled or not, so choosing a day can close it.
    const [openState, setOpenState] = React.useState(defaultOpen)
    const open = openProp ?? openState
    const setOpen = (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    }
    useIsomorphicLayoutEffect(() => {
      if (open) read(triggerRef.current)
    }, [open, read])

    // The value, controlled or not.
    const [uncontrolled, setUncontrolled] = React.useState<Date | DateRange | null>(valueProps.defaultValue ?? null)
    const isControlled = valueProps.value !== undefined
    const value = isControlled ? valueProps.value ?? null : uncontrolled
    const setValue = (next: Date | DateRange | null) => {
      if (!isControlled) setUncontrolled(next)
      ;(valueProps.onValueChange as ((value: Date | DateRange | null) => void) | undefined)?.(next)
    }

    const copy = isArabic(context) ? COPY.ar : COPY.en
    const dateLib = React.useMemo(() => new DateLib({ locale: copy.locale, numerals: "latn" }), [copy])
    const show = (date: Date) => dateLib.format(date, copy.format)

    const range = mode === "range" ? (value as DateRange | null) : null
    const day = mode === "single" ? (value as Date | null) : null
    const text = range?.from
      ? range.to
        ? `${show(range.from)} - ${show(range.to)}`
        : show(range.from)
      : day
        ? show(day)
        : null
    const submitted = range?.from ? `${iso(range.from)}/${iso(range.to ?? range.from)}` : day ? iso(day) : ""

    const ids = React.useId()
    const labelId = `${ids}-label`
    const nameId = `${ids}-name`
    const valueId = `${ids}-value`
    const describedBy =
      [labelEnd && `${ids}-label-end`, description && `${ids}-description`, descriptionEnd && `${ids}-description-end`]
        .filter(Boolean)
        .join(" ") || undefined
    // The trigger's name is the label and the value, so both are read out.
    const nameSource = ariaLabelledBy ?? (label ? labelId : ariaLabel ? nameId : undefined)
    const labelledBy = [nameSource, valueId].filter(Boolean).join(" ")

    const shownMonth = range?.from ?? day ?? undefined

    return (
      <div
        data-slot="date-picker-field"
        data-disabled={disabled || undefined}
        className={cn("group/date-picker flex w-full min-w-0 flex-col data-[disabled]:opacity-50", className)}
      >
        {(label || labelEnd) && (
          <div data-slot="date-picker-label-row" className={selectFieldClasses.labelRow}>
            {label && (
              // Not a native <label>: on a button, one would press it and
              // open the calendar. A press moves focus to the trigger instead.
              <div
                id={labelId}
                data-slot="date-picker-label"
                onClick={() => triggerRef.current?.focus()}
                className={selectFieldClasses.label}
              >
                {label}
              </div>
            )}
            {labelEnd && (
              <div
                id={`${ids}-label-end`}
                data-slot="date-picker-label-end"
                className={cn("ms-auto max-w-[50%] shrink-0 text-end", selectFieldClasses.helper)}
              >
                {labelEnd}
              </div>
            )}
          </div>
        )}
        {!label && ariaLabel && !ariaLabelledBy && (
          <span id={nameId} hidden>
            {ariaLabel}
          </span>
        )}

        <DirectionProvider direction={context.direction}>
          <PopoverPrimitive.Root
            open={open}
            onOpenChange={(next) => {
              if (next) read(triggerRef.current)
              setOpen(next)
            }}
          >
            <PopoverPrimitive.Trigger
              ref={mergedRef}
              id={id}
              disabled={disabled}
              data-slot="date-picker-trigger"
              data-disabled={disabled || undefined}
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              className={selectTriggerVariants({ size })}
              onPointerDown={(event) => read(event.currentTarget)}
              onFocus={(event) => read(event.currentTarget)}
            >
              {/* Figma's calendar icon, at the start in both directions. */}
              <span data-slot="date-picker-icon" aria-hidden="true" className={selectFieldClasses.icon}>
                <CalendarIcon strokeWidth={1.5} />
              </span>
              {/* One line that overhangs the box's block edges, as Select's
                  value does, so Cairo's taller line never grows an xs box. */}
              <span id={valueId} data-slot="date-picker-value" className="-my-1 min-w-0 flex-1 truncate">
                {text ?? (
                  <span data-slot="date-picker-placeholder" className="text-muted-foreground">
                    {placeholder ?? copy.placeholder}
                  </span>
                )}
              </span>
            </PopoverPrimitive.Trigger>

            {name && <input type="hidden" name={name} form={form} value={submitted} disabled={disabled} />}

            <PopoverPrimitive.Portal container={container}>
              <PopoverPrimitive.Positioner
                data-slot="date-picker-positioner"
                side="bottom"
                align="start"
                sideOffset={4}
                collisionAvoidance={collisionAvoidance}
                dir={context.direction}
                lang={context.lang}
                style={{ fontFamily: context.fontFamily }}
                className="z-50 [outline:none]"
              >
                <PopoverPrimitive.Popup
                  ref={popupRef}
                  data-slot="date-picker-content"
                  aria-labelledby={nameSource}
                  initialFocus={(openType) => {
                    // Opened by `defaultOpen` or a controlled `open`, not by
                    // the user: focus stays where it is.
                    if (openType === "") return false
                    // On touch, Base UI's own choice: the popup, so no
                    // virtual keyboard opens.
                    if (openType === "touch") return popupRef.current
                    // Otherwise the chosen day, or today: the day the grid's
                    // arrow keys start from. Focused here, without scrolling:
                    // Base UI focuses a returned element with scrolling on,
                    // and before the calendar is placed it sits at the end of
                    // the page, so the page would scroll to the bottom.
                    const day = popupRef.current?.querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]')
                    if (!day) return true
                    day.focus({ preventScroll: true })
                    return false
                  }}
                  className={cn(
                    // Never wider than the window: a calendar of several months wraps instead.
                    "max-w-[var(--available-width)] [outline:none]",
                    "transition-opacity duration-150 motion-reduce:transition-none",
                    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
                  )}
                >
                  {mode === "range" ? (
                    <Calendar
                      {...calendarProps}
                      className={cn(FLOATING, calendarProps?.className)}
                      dir={context.direction}
                      mode="range"
                      resetOnSelect
                      numberOfMonths={numberOfMonths}
                      defaultMonth={calendarProps?.defaultMonth ?? shownMonth}
                      selected={range ?? undefined}
                      onSelect={(next) => {
                        setValue(next ?? null)
                        if (next?.from && next.to) setOpen(false)
                      }}
                    />
                  ) : (
                    <Calendar
                      {...calendarProps}
                      className={cn(FLOATING, calendarProps?.className)}
                      dir={context.direction}
                      mode="single"
                      required
                      numberOfMonths={numberOfMonths}
                      defaultMonth={calendarProps?.defaultMonth ?? shownMonth}
                      selected={day ?? undefined}
                      onSelect={(next) => {
                        setValue(next ?? null)
                        setOpen(false)
                      }}
                    />
                  )}
                </PopoverPrimitive.Popup>
              </PopoverPrimitive.Positioner>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
        </DirectionProvider>

        {(description || descriptionEnd) && (
          <div data-slot="date-picker-helper-row" className={selectFieldClasses.helperRow}>
            {description && (
              <div
                id={`${ids}-description`}
                data-slot="date-picker-description"
                className={cn("min-w-0", selectFieldClasses.helper)}
              >
                {description}
              </div>
            )}
            {descriptionEnd && (
              <div
                id={`${ids}-description-end`}
                data-slot="date-picker-description-end"
                className={cn("ms-auto max-w-[50%] shrink-0 text-end", selectFieldClasses.helper)}
              >
                {descriptionEnd}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
export type { DatePickerSize, DatePickerMode, DatePickerCalendarProps }
export type { DateRange }

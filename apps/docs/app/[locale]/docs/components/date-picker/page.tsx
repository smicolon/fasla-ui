"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { MapPin } from "lucide-react"

import { DatePicker, type DatePickerProps } from "@fasla-ui/ui/date-picker"
import { Select } from "@fasla-ui/ui/select"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const SIZES = ["xs", "sm", "md", "lg"] as const

/**
 * The examples show Figma's dates, with today pinned to 17 June 2026, so the
 * page renders the same on the server and in every browser.
 */
const TODAY = new Date(2026, 5, 17)
const DAY = new Date(2026, 5, 6)
const RANGE = { from: new Date(2026, 0, 20), to: new Date(2026, 1, 9) }
const calendarProps = { today: TODAY }

/** A grid of fields that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start gap-x-6 gap-y-5 sm:grid-cols-2"

/**
 * A date picker held open, with exactly the room its calendar takes reserved
 * under it: the calendar's own height plus the 4px gap. The calendar renders
 * into this cell, so it scrolls with the page and stays in the preview. It
 * never flips above the trigger. The room changes only when it is more than a
 * pixel off.
 */
function HeldDatePicker(props: DatePickerProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + 4
      setRoom((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const calendar = cell.querySelector("[data-slot=calendar]")
      if (calendar && calendar !== observed) {
        if (observed) resize.unobserve(observed)
        observed = calendar
        resize.observe(calendar)
      }
    }
    const mutations = new MutationObserver(find)
    mutations.observe(cell, { childList: true, subtree: true })
    find()
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [cell])

  // Base UI misses a change caused by a parent's padding; a resize makes it
  // measure and place the calendar again.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
    return () => cancelAnimationFrame(frame)
  }, [room])

  return (
    <div ref={setCell} className="relative w-full" style={{ paddingBottom: room }}>
      {cell && (
        <DatePicker
          defaultOpen
          collisionAvoidance={{ side: "none" }}
          container={cell}
          {...props}
          calendarProps={{ ...calendarProps, ...props.calendarProps }}
        />
      )}
    </div>
  )
}

/** A preview with a calendar held open: `isolate` keeps it under the site header. */
function HeldPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <ComponentPreview>{children}</ComponentPreview>
    </div>
  )
}

export default function DatePickerPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.datePicker")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const pickerProps: PropRow[] = [
    { prop: "mode", type: '"single" | "range"', fallback: '"single"', description: s.rich("props.mode", rich) },
    { prop: "value", type: "Date | DateRange | null", fallback: "", description: s.rich("props.value", rich) },
    { prop: "defaultValue", type: "Date | DateRange | null", fallback: "", description: s.rich("props.defaultValue", rich) },
    { prop: "onValueChange", type: "(value) => void", fallback: "", description: s.rich("props.onValueChange", rich) },
    { prop: "placeholder", type: "ReactNode", fallback: "", description: s.rich("props.placeholder", rich) },
    { prop: "size", type: '"xs" | "sm" | "md" | "lg"', fallback: '"md"', description: s.rich("props.size", rich) },
    { prop: "numberOfMonths", type: "number", fallback: "1", description: s.rich("props.numberOfMonths", rich) },
    { prop: "calendarProps", type: "CalendarProps", fallback: "", description: s.rich("props.calendarProps", rich) },
    { prop: "label", type: "ReactNode", fallback: "", description: s.rich("props.label", rich) },
    { prop: "aria-label", type: "string", fallback: "", description: s.rich("props.ariaLabel", rich) },
    { prop: "aria-labelledby", type: "string", fallback: "", description: s.rich("props.ariaLabelledby", rich) },
    { prop: "labelEnd", type: "ReactNode", fallback: "", description: s.rich("props.labelEnd", rich) },
    { prop: "description", type: "ReactNode", fallback: "", description: s.rich("props.description", rich) },
    { prop: "descriptionEnd", type: "ReactNode", fallback: "", description: s.rich("props.descriptionEnd", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("props.disabled", rich) },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", rich) },
    { prop: "form", type: "string", fallback: "", description: s.rich("props.form", rich) },
    { prop: "id", type: "string", fallback: "", description: s.rich("props.id", rich) },
    { prop: "open", type: "boolean", fallback: "", description: s.rich("props.open", rich) },
    { prop: "defaultOpen", type: "boolean", fallback: "false", description: s.rich("props.defaultOpen", rich) },
    { prop: "onOpenChange", type: "(open) => void", fallback: "", description: s.rich("props.onOpenChange", rich) },
    {
      prop: "collisionAvoidance",
      type: "{ side, align, fallbackAxisSide }",
      fallback: "",
      description: s.rich("props.collisionAvoidance", rich),
    },
    { prop: "container", type: "HTMLElement", fallback: "", description: s.rich("props.container", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]
  const propTables = [{ part: "DatePicker", rows: pickerProps }]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/date-picker/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="date-picker" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <DatePicker className="max-w-xs" label={s("date")} description={s("dateHelp")} calendarProps={calendarProps} />
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{s.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            {SIZES.map((size) => (
              <DatePicker key={size} size={size} aria-label={s(`sizes.${size}`)} placeholder={s(`sizes.${size}`)} calendarProps={calendarProps} />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <DatePicker label={s("states.enabled")} calendarProps={calendarProps} />
            <DatePicker disabled label={s("states.disabled")} defaultValue={DAY} calendarProps={calendarProps} />
          </div>
        </ComponentPreview>
      </section>

      {/* Range */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("range.title")}</h2>
        <p className="text-muted-foreground">{s.rich("range.body", rich)}</p>
        <ComponentPreview>
          <DatePicker
            className="max-w-xs"
            mode="range"
            numberOfMonths={2}
            label={s("stay")}
            description={s("stayHelp")}
            defaultValue={RANGE}
            calendarProps={calendarProps}
          />
        </ComponentPreview>
      </section>

      {/* Beside a Select */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("parts.title")}</h2>
        <p className="text-muted-foreground">{s.rich("parts.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <Select
              label={s("parts.city")}
              labelEnd={s("parts.optional")}
              description={s("parts.cityHelp")}
              startIcon={<MapPin />}
              defaultValue="riyadh"
              items={[{ value: "riyadh", label: s("parts.riyadh") }]}
            />
            <DatePicker
              label={s("date")}
              labelEnd={s("parts.optional")}
              description={s("dateHelp")}
              defaultValue={DAY}
              calendarProps={calendarProps}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* The calendar */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("calendar.title")}</h2>
        <p className="text-muted-foreground">{s.rich("calendar.body", rich)}</p>
        <HeldPreview>
          <div className="w-full max-w-xs">
            <HeldDatePicker label={s("date")} defaultValue={DAY} />
          </div>
        </HeldPreview>
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
          <li>{s.rich("a11y.roles", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.label", rich)}</li>
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
        <UsageExample title={s("usage.basic")}>{`import { DatePicker } from "@/components/ui/date-picker"

export function DeliveryDate() {
  return (
    <DatePicker
      name="delivery"
      label="${s("date")}"
      description="${s("dateHelp")}"
      calendarProps={{ disabled: { before: new Date() } }}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.range")}>{`"use client"

import * as React from "react"
import { DatePicker, type DateRange } from "@/components/ui/date-picker"

export function StayDates() {
  const [stay, setStay] = React.useState<DateRange | null>(null)
  return (
    <DatePicker
      mode="range"
      numberOfMonths={2}
      label="${s("stay")}"
      value={stay}
      onValueChange={setStay}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.form")}>{`import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"

export function BirthDateForm() {
  return (
    <form action="/profile" className="flex flex-col items-start gap-8">
      <DatePicker
        name="dob"
        label="${s("form.dob")}"
        description="${s("form.dobHelp")}"
        calendarProps={{
          captionLayout: "dropdown",
          startMonth: new Date(1926, 0),
          endMonth: new Date(),
        }}
      />
      <Button type="submit">${s("form.submit")}</Button>
    </form>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}

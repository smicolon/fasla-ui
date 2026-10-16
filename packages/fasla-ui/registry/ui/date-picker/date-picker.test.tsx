import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { DatePicker, type DatePickerProps } from "./date-picker"
import { Select, selectTriggerVariants } from "../select/select"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout, so Base UI cannot place the calendar and the visual
 * tests assert **class presence only**. That the trigger lines up with a
 * Select at every size, the 4px gap, and the RTL mirror were measured in a
 * real browser. The wiring — the value's format per language, the name read
 * out, opening, choosing and closing, the hidden input, disabled, the
 * direction handed to the calendar — is real DOM and is tested as such.
 */

const DAY = new Date(2026, 5, 6)
const RANGE = { from: new Date(2026, 0, 20), to: new Date(2026, 1, 9) }

const trigger = () => document.querySelector<HTMLButtonElement>("[data-slot=date-picker-trigger]")!
const slot = (name: string, root: ParentNode = document) => root.querySelector<HTMLElement>(`[data-slot=${name}]`)
const day = (iso: string) =>
  document.querySelector<HTMLElement>(`td[data-day="${iso}"]:not([data-outside]) [data-slot=calendar-day]`)!

async function open() {
  await act(async () => {
    fireEvent.click(trigger())
  })
}

const Picker = (props: Partial<DatePickerProps>) => <DatePicker aria-label="Delivery date" {...(props as DatePickerProps)} />

describe("DatePicker — trigger", () => {
  it("is Select's trigger, at md by default", () => {
    render(<Picker />)
    expect(trigger().className).toBe(selectTriggerVariants({ size: "md" }))
  })

  it.each(["xs", "sm", "md", "lg"] as const)("takes Select's classes at size %s", (size) => {
    render(
      <>
        <Picker size={size} />
        <Select size={size} aria-label="City" items={[]} />
      </>
    )
    const select = document.querySelector("[data-slot=select-trigger]")!
    expect(trigger().className).toBe(select.className)
  })

  it("shows the calendar icon at the start and the placeholder", () => {
    render(<Picker />)
    const [first, second] = [...trigger().children]
    expect(first).toHaveAttribute("data-slot", "date-picker-icon")
    expect(second).toHaveTextContent("Pick a date")
    expect(slot("date-picker-placeholder")).toHaveClass("text-muted-foreground")
  })

  it("uses the Arabic placeholder on an Arabic page", () => {
    render(
      <div dir="rtl" lang="ar">
        <Picker />
      </div>
    )
    expect(slot("date-picker-value")).toHaveTextContent("اختر تاريخًا")
  })

  it("formats a day and a range as Figma does", () => {
    render(
      <>
        <Picker defaultValue={DAY} />
        <Picker mode="range" defaultValue={RANGE} />
      </>
    )
    const values = [...document.querySelectorAll("[data-slot=date-picker-value]")].map((el) => el.textContent)
    expect(values).toEqual(["Jun 06, 2026", "Jan 20, 2026 - Feb 09, 2026"])
  })

  it("formats in Arabic with Western digits", () => {
    render(
      <div dir="rtl" lang="ar">
        <Picker mode="range" defaultValue={RANGE} />
      </div>
    )
    expect(slot("date-picker-value")).toHaveTextContent("20 يناير 2026 - 09 فبراير 2026")
  })

  it("is named by its label and its value, and described by its helper text", () => {
    render(<DatePicker label="Delivery date" description="We deliver between 9am and 5pm." defaultValue={DAY} />)
    expect(screen.getByRole("button", { name: "Delivery date Jun 06, 2026" })).toBe(trigger())
    expect(trigger()).toHaveAccessibleDescription("We deliver between 9am and 5pm.")
  })

  it("is named by aria-label without a label", () => {
    render(<Picker />)
    expect(screen.getByRole("button", { name: "Delivery date Pick a date" })).toBe(trigger())
  })

  it("dims the whole field and blocks the trigger when disabled", () => {
    render(<Picker disabled label="Date" />)
    expect(trigger()).toBeDisabled()
    expect(slot("date-picker-field")).toHaveAttribute("data-disabled")
    expect(slot("date-picker-field")).toHaveClass("data-[disabled]:opacity-50")
  })

  it("submits an ISO date, or an ISO interval for a range", () => {
    const { container } = render(
      <form>
        <Picker name="day" defaultValue={DAY} />
        <Picker name="stay" mode="range" defaultValue={RANGE} />
      </form>
    )
    const data = new FormData(container.querySelector("form")!)
    expect(data.get("day")).toBe("2026-06-06")
    expect(data.get("stay")).toBe("2026-01-20/2026-02-09")
  })
})

describe("DatePicker — calendar", () => {
  it("opens a calendar on the chosen month", async () => {
    render(<Picker defaultValue={DAY} />)
    await open()
    expect(trigger()).toHaveAttribute("aria-expanded", "true")
    expect(slot("calendar")).not.toBeNull()
    expect(screen.getByText("June 2026")).toBeInTheDocument()
    expect(day("2026-06-06")).toHaveClass("bg-primary")
  })

  it("draws the open calendar on Select's menu surface, so it has an edge in Dark", async () => {
    render(<Picker />)
    await open()
    expect(slot("calendar")).toHaveClass("border", "border-input", "bg-popover", "shadow-md")
    expect(slot("calendar")).not.toHaveClass("bg-background", "shadow")
  })

  it("focuses the chosen day without scrolling the page", async () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus")
    render(<Picker defaultValue={DAY} />)
    await act(async () => {
      fireEvent.pointerDown(trigger(), { pointerType: "mouse" })
      fireEvent.mouseDown(trigger())
      fireEvent.click(trigger())
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    })
    expect(document.activeElement).toBe(day("2026-06-06"))
    const onDay = focus.mock.calls.filter((_, i) => (focus.mock.instances[i] as unknown) === day("2026-06-06"))
    expect(onDay.length).toBeGreaterThan(0)
    expect(onDay.every(([options]) => (options as FocusOptions | undefined)?.preventScroll === true)).toBe(true)
    focus.mockRestore()
  })

  it("leaves focus alone when it opens without the user, with defaultOpen", async () => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <Picker defaultOpen defaultValue={DAY} />
      </>
    )
    const elsewhere = screen.getByRole("button", { name: "Elsewhere" })
    elsewhere.focus()
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    })
    expect(slot("calendar")).not.toBeNull()
    expect(document.activeElement).toBe(elsewhere)
  })

  it("chooses a day and closes", async () => {
    const onValueChange = vi.fn()
    render(<Picker defaultValue={DAY} onValueChange={onValueChange} />)
    await open()
    await act(async () => fireEvent.click(day("2026-06-12")))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 12))
    expect(slot("date-picker-value")).toHaveTextContent("Jun 12, 2026")
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  it("keeps the day when the chosen one is pressed again", async () => {
    render(<Picker defaultValue={DAY} />)
    await open()
    await act(async () => fireEvent.click(day("2026-06-06")))
    expect(slot("date-picker-value")).toHaveTextContent("Jun 06, 2026")
  })

  it("stays open for a range until both ends are chosen", async () => {
    const onValueChange = vi.fn()
    render(<Picker mode="range" defaultValue={null} onValueChange={onValueChange} calendarProps={{ defaultMonth: new Date(2026, 5, 1) }} />)
    await open()
    await act(async () => fireEvent.click(day("2026-06-07")))
    expect(trigger()).toHaveAttribute("aria-expanded", "true")
    await act(async () => fireEvent.click(day("2026-06-18")))
    expect(onValueChange).toHaveBeenLastCalledWith({ from: new Date(2026, 5, 7), to: new Date(2026, 5, 18) })
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
    expect(slot("date-picker-value")).toHaveTextContent("Jun 07, 2026 - Jun 18, 2026")
  })

  it("hands the page's direction, language and month count to the calendar", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Picker mode="range" numberOfMonths={2} defaultValue={RANGE} />
      </div>
    )
    await open()
    expect(slot("date-picker-positioner")).toHaveAttribute("dir", "rtl")
    expect(slot("date-picker-positioner")).toHaveAttribute("lang", "ar")
    expect(slot("calendar")).toHaveAttribute("dir", "rtl")
    expect(document.querySelectorAll("[data-slot=calendar] table")).toHaveLength(2)
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<Picker value={DAY} />)
    expect(slot("date-picker-value")).toHaveTextContent("Jun 06, 2026")
    rerender(<Picker value={null} />)
    expect(slot("date-picker-value")).toHaveTextContent("Pick a date")
  })
})

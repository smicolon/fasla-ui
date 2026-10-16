import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Calendar } from "./calendar"

/**
 * What these tests can and cannot prove.
 *
 * jsdom applies no stylesheet and has no layout, so the visual tests assert
 * **class presence only**. The 32px days, the 8px row gaps, the band's
 * corners, the arrows on the outer edges and the RTL mirror were measured in
 * a real browser. The wiring — the week's first day per direction, the
 * Arabic month and weekday names, Western digits, the day states and the
 * selection — is real DOM and is tested as such.
 */

const JUNE = new Date(2026, 5, 1)
const TODAY = new Date(2026, 5, 17)
const day = (date: number, month = 5) => new Date(2026, month, date)

const slot = (name: string, root: ParentNode = document) => root.querySelector<HTMLElement>(`[data-slot=${name}]`)
const weekdays = () => [...document.querySelectorAll("thead th")].map((th) => th.textContent)
/** The day button for an ISO date in the month it belongs to. */
const dayButton = (iso: string) =>
  document.querySelector<HTMLElement>(`td[data-day="${iso}"]:not([data-outside]) [data-slot=calendar-day]`)!

describe("Calendar — layout", () => {
  it("draws Figma's card: background, 12px padding, 8px corners and the sm shadow", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} />)
    expect(slot("calendar")).toHaveClass("bg-background", "p-3", "rounded-[var(--radius-md)]", "shadow")
  })

  it("lets className override the card", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} className="p-0 shadow-none" />)
    expect(slot("calendar")).toHaveClass("p-0", "shadow-none")
    expect(slot("calendar")).not.toHaveClass("p-3")
  })

  it("always shows six weeks, with the outside days", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} />)
    expect(document.querySelectorAll("tbody tr")).toHaveLength(6)
    expect(document.querySelector('td[data-day="2026-05-31"][data-outside]')).not.toBeNull()
  })

  it("starts the week on Sunday in LTR, with two-letter weekdays", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} />)
    expect(weekdays()).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"])
    expect(screen.getByText("June 2026")).toBeInTheDocument()
  })

  it("starts the week on Saturday in Arabic, with one-letter weekdays, Arabic months and Western digits", () => {
    render(
      <div dir="rtl" lang="ar">
        <Calendar mode="single" defaultMonth={JUNE} />
      </div>
    )
    expect(weekdays()).toEqual(["س", "ح", "ن", "ث", "ر", "خ", "ج"])
    expect(screen.getByText("يونيو 2026")).toBeInTheDocument()
    expect(slot("calendar")).toHaveAttribute("dir", "rtl")
    expect(dayButton("2026-06-17")).toHaveTextContent("17")
  })

  it("treats a right-to-left page with no lang as Arabic", () => {
    render(
      <div dir="rtl">
        <Calendar mode="single" defaultMonth={JUNE} />
      </div>
    )
    expect(weekdays()[0]).toBe("س")
  })

  it("keeps an explicit weekStartsOn", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} weekStartsOn={1} />)
    expect(weekdays()[0]).toBe("Mo")
  })
})

describe("Calendar — navigation", () => {
  it("uses Icon Button, Outline Primary xs, for the arrows", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} />)
    const previous = screen.getByRole("button", { name: /previous month/i })
    expect(previous).toHaveAttribute("data-slot", "button")
    expect(previous).toHaveAttribute("data-variant", "outline")
    expect(previous).toHaveAttribute("data-tone", "primary")
    expect(previous).toHaveAttribute("data-size", "icon-xs")
  })

  it("puts arrows on the outer months only", () => {
    render(<Calendar mode="range" defaultMonth={JUNE} numberOfMonths={3} />)
    const months = [...document.querySelectorAll("[data-slot=calendar] > div > div")]
    expect(months).toHaveLength(3)
    expect(months[0]!.querySelectorAll("button[aria-label*='Previous']")).toHaveLength(1)
    expect(months[1]!.querySelectorAll("[data-slot=button]")).toHaveLength(0)
    expect(months[2]!.querySelectorAll("button[aria-label*='Next']")).toHaveLength(1)
  })

  it("moves a month with the arrows", async () => {
    render(<Calendar mode="single" defaultMonth={JUNE} />)
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /next month/i })))
    expect(screen.getByText("July 2026")).toBeInTheDocument()
  })

  it("names the arrows in Arabic on an Arabic page", () => {
    render(
      <div dir="rtl" lang="ar">
        <Calendar mode="single" defaultMonth={JUNE} />
      </div>
    )
    expect(screen.getByRole("button", { name: "اذهب إلى الشهر السابق" })).toBeInTheDocument()
  })

  it("swaps the arrows for a month and a year Select with captionLayout=dropdown", () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={JUNE}
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
      />
    )
    expect(document.querySelectorAll("[data-slot=select-trigger]")).toHaveLength(2)
    expect(screen.queryByRole("button", { name: /previous month/i })).toBeNull()
  })
})

describe("Calendar — days", () => {
  it("draws plain, outside, today and chosen days as Figma does", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} today={TODAY} selected={day(6)} />)
    expect(dayButton("2026-06-10")).toHaveClass("text-foreground", "hover:bg-accent", "size-8", "rounded-[var(--radius-md)]")
    expect(document.querySelector('td[data-day="2026-05-31"] [data-slot=calendar-day]')).toHaveClass("text-muted-foreground")
    expect(dayButton("2026-06-17")).toHaveClass("bg-accent", "text-accent-foreground")
    expect(dayButton("2026-06-06")).toHaveClass("bg-primary", "text-primary-foreground")
  })

  it("marks a chosen today with a dot", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} today={TODAY} selected={TODAY} />)
    expect(dayButton("2026-06-17")).toHaveClass("bg-primary", "after:size-[3px]", "after:bg-primary-foreground")
  })

  it("dims and blocks disabled days", () => {
    render(<Calendar mode="single" defaultMonth={JUNE} disabled={{ from: day(9), to: day(11) }} />)
    expect(dayButton("2026-06-10")).toBeDisabled()
    expect(dayButton("2026-06-10")).toHaveClass("disabled:opacity-50")
  })

  it("chooses a day", async () => {
    const onSelect = vi.fn()
    render(<Calendar mode="single" defaultMonth={JUNE} onSelect={onSelect} />)
    await act(async () => fireEvent.click(dayButton("2026-06-12")))
    expect(onSelect).toHaveBeenCalledWith(day(12), expect.anything(), expect.anything(), expect.anything())
  })

  it("rounds days fully with radius=rounded", () => {
    render(<Calendar mode="single" radius="rounded" defaultMonth={JUNE} selected={day(6)} />)
    expect(dayButton("2026-06-06")).toHaveClass("rounded-full")
  })
})

describe("Calendar — range", () => {
  const range = { from: day(7), to: day(18) }

  it("draws the ends in primary and the days between on an accent band", () => {
    render(<Calendar mode="range" defaultMonth={JUNE} selected={range} />)
    const td = (iso: string) => document.querySelector<HTMLElement>(`td[data-day="${iso}"]:not([data-outside])`)!
    expect(dayButton("2026-06-07")).toHaveClass("bg-primary")
    expect(dayButton("2026-06-18")).toHaveClass("bg-primary")
    expect(dayButton("2026-06-10")).toHaveClass("text-accent-foreground")
    expect(dayButton("2026-06-10")).not.toHaveClass("bg-primary")
    expect(td("2026-06-07")).toHaveClass("bg-accent", "rounded-s-[var(--radius-md)]")
    expect(td("2026-06-10")).toHaveClass("bg-accent", "first:rounded-s-[var(--radius-md)]", "last:rounded-e-[var(--radius-md)]")
    expect(td("2026-06-18")).toHaveClass("bg-accent", "rounded-e-[var(--radius-md)]")
    expect(td("2026-06-20")).not.toHaveClass("bg-accent")
  })

  it("draws an outside day once, in its own month, when several months show", () => {
    render(<Calendar mode="range" defaultMonth={JUNE} numberOfMonths={2} selected={{ from: day(1, 6), to: day(4, 6) }} />)
    const outside = document.querySelector<HTMLElement>('td[data-day="2026-07-01"][data-outside]')!
    expect(outside).not.toHaveClass("bg-accent")
    expect(outside.querySelector("[data-slot=calendar-day]")).not.toHaveClass("bg-primary")
    expect(dayButton("2026-07-01")).toHaveClass("bg-primary")
  })

  it("keeps a range across outside days with one month", () => {
    render(<Calendar mode="range" defaultMonth={JUNE} selected={{ from: day(28), to: day(2, 6) }} />)
    expect(document.querySelector('td[data-day="2026-07-01"][data-outside]')).toHaveClass("bg-accent")
  })
})

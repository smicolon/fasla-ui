import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ContactUsBookACall, contactUsBookACallCopy } from "./contact-us-book-a-call"

// jsdom has no layout: Figma's sizes and the container-query layouts were
// measured in a browser. These assert the picker's contract.

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []
const pressed = () => screen.getAllByRole("button").filter((b) => b.getAttribute("aria-pressed") === "true")

describe("Book a Call", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2, in %s", (locale) => {
    const { container } = render(<ContactUsBookACall locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent).toBe(contactUsBookACallCopy[locale].callName)
  })

  it("has Arabic copy for every English key and the same days and slots", () => {
    const { en, ar } = contactUsBookACallCopy
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort())
    expect(ar.days.map((d) => d.id)).toEqual(en.days.map((d) => d.id))
    expect(ar.days.map((d) => d.slots)).toEqual(en.days.map((d) => d.slots))
  })

  it("writes Arabic without a middle dot, a dash outside digits, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(contactUsBookACallCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d\s)–|–(?!\s\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("starts on Wednesday 11 March with 11:30 pressed and the bar saying so", () => {
    render(<ContactUsBookACall />)
    expect(screen.getAllByRole("tab")).toHaveLength(5)
    expect(screen.getByRole("tab", { name: "Wed 11" }).getAttribute("aria-selected")).toBe("true")
    expect(screen.getAllByRole("group")[0]!.querySelectorAll("button")).toHaveLength(12)
    expect(pressed().map((b) => b.textContent)).toEqual(["11:30"])
    expect(screen.getByText("Wednesday 11 March · 11:30 – 12:00 GST")).toBeTruthy()
  })

  it("says the bar in Arabic with a comma and Western digits", () => {
    render(<ContactUsBookACall locale="ar" />)
    expect(screen.getByText("الأربعاء 11 مارس، 11:30 – 12:00 بتوقيت الخليج")).toBeTruthy()
  })

  it("keeps one slot pressed at a time", async () => {
    const user = userEvent.setup()
    render(<ContactUsBookACall />)
    await user.click(screen.getByRole("button", { name: "14:00" }))
    expect(pressed().map((b) => b.textContent)).toEqual(["14:00"])
    expect(screen.getByText("Wednesday 11 March · 14:00 – 14:30 GST")).toBeTruthy()
  })

  it("switches the day, showing that day's slots, and carries the choice in the bar", async () => {
    const user = userEvent.setup()
    render(
      <ContactUsBookACall
        days={[
          { id: "a", label: "A 01", longLabel: "Day A", slots: ["09:00", "09:30"] },
          { id: "b", label: "B 02", longLabel: "Day B", slots: ["10:00"] },
        ]}
        defaultDayId="a"
        defaultSlot="09:30"
      />
    )
    expect(screen.getByRole("group").querySelectorAll("button")).toHaveLength(2)
    await user.click(screen.getByRole("tab", { name: "B 02" }))
    const group = await screen.findByRole("group", { name: "Times on Day B" })
    expect(within(group).getAllByRole("button")).toHaveLength(1)
    expect(pressed()).toHaveLength(0)
    expect(screen.getByText("Day A · 09:30 – 10:00 GST")).toBeTruthy()
  })

  it("waits with no bar until a slot is chosen when none is chosen at first", async () => {
    const user = userEvent.setup()
    render(<ContactUsBookACall defaultSlot={null} />)
    expect(screen.queryByRole("button", { name: /Confirm booking/ })).toBeNull()
    await user.click(screen.getByRole("button", { name: "09:00" }))
    expect(screen.getByRole("button", { name: /Confirm booking/ })).toBeTruthy()
  })

  it("books the chosen day and slot, shows the confirmation, and lets the reader pick again", async () => {
    const user = userEvent.setup()
    const onBook = vi.fn().mockResolvedValue(undefined)
    render(<ContactUsBookACall onBook={onBook} />)
    await user.click(screen.getByRole("button", { name: "13:30" }))
    await user.click(screen.getByRole("button", { name: /Confirm booking/ }))
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Wednesday 11 March · 13:30 – 14:00 GST"))
    expect(onBook).toHaveBeenCalledTimes(1)
    expect(onBook.mock.calls[0]![0].slot).toBe("13:30")
    expect(onBook.mock.calls[0]![0].day.id).toBe("wed")
    expect(screen.queryByRole("button", { name: /Confirm booking/ })).toBeNull()
    await user.click(screen.getByRole("button", { name: "Pick another time" }))
    expect(screen.getByRole("button", { name: /Confirm booking/ })).toBeTruthy()
  })

  it("shows the button loading while it books, then the error when it fails", async () => {
    const user = userEvent.setup()
    let fail: (e: Error) => void = () => {}
    const onBook = vi.fn(() => new Promise<void>((_, reject) => (fail = reject)))
    render(<ContactUsBookACall locale="ar" onBook={onBook} />)
    await user.click(screen.getByRole("button", { name: /أكّد الحجز/ }))
    expect(screen.getByRole("button", { name: /جارٍ الحجز/ }).getAttribute("disabled")).not.toBeNull()
    fail(new Error("no"))
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(contactUsBookACallCopy.ar.bookError))
    expect(screen.getByRole("button", { name: /أكّد الحجز/ })).toBeTruthy()
  })

  it("has no text field, so nothing is required, and no asterisk", () => {
    const { container } = render(<ContactUsBookACall />)
    expect(container.querySelectorAll("input,textarea,select")).toHaveLength(0)
    expect(screen.queryByText("Required")).toBeNull()
    expect(container.textContent).not.toContain("*")
  })

  it("styles the slots with buttonVariants (Outline, md) and draws Pressed as Figma's ring", () => {
    render(<ContactUsBookACall />)
    const slot = screen.getByRole("button", { name: "09:00" })
    expect(slot.className).toContain("ring-inset")
    expect(slot.className).toContain("h-9")
    expect(slot.className).toContain("aria-pressed:ring-ring")
    expect(slot.className).toContain("aria-pressed:after:ring-ring/50")
    // Mobile slots are 44px tall.
    expect(slot.className).toContain("[@container(max-width:39.99rem)]:h-11")
  })

  it("takes no `now`: the days are data", () => {
    const { container } = render(<ContactUsBookACall />)
    expect(container.querySelector("[now]")).toBeNull()
  })
})

import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import userEvent from "@testing-library/user-event"
import { render, screen, within } from "@testing-library/react"
import { ContactUsHoursAndAvailability, contactUsHoursAndAvailabilityCopy } from "./contact-us-hours-and-availability"

// jsdom has no layout: the Figma sizes and the container-query layouts were
// measured in a browser. These assert the contract around them.

const NOW = "2026-03-10T10:20:00Z" // Tuesday, 14:20 in Dubai
const keys = (value: unknown): string[] => Object.keys(value as object).sort()
const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

describe("Hours and Availability", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 (%s)", (locale) => {
    const { container } = render(<ContactUsHoursAndAvailability locale={locale} now={NOW} />)
    const section = container.querySelector("section")!
    const heading = within(section).getByRole("heading", { level: 2 })
    expect(section.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(heading.textContent).toBe(contactUsHoursAndAvailabilityCopy[locale].heading)
  })

  it("has the same copy keys in English and Arabic", () => {
    const { en, ar } = contactUsHoursAndAvailabilityCopy
    expect(keys(ar)).toEqual(keys(en))
    expect(ar.zones.map((z) => z.value)).toEqual(en.zones.map((z) => z.value))
  })

  it("keeps the Arabic rules: no middle dot, no dash outside digits, no Arabic-Indic digit, no percent sign", () => {
    const text = strings(contactUsHoursAndAvailabilityCopy.ar).join(" ")
    expect(text).not.toMatch(/·/)
    expect(text.replace(/(\d) – (\d)/g, "$1$2")).not.toMatch(/[–—]/)
    expect(text).not.toMatch(/[٠-٩۰-۹]/)
    expect(text).not.toContain("%")
    expect(text).not.toContain("*")
  })

  it("at the frozen moment reads Figma's strings: clock 14:20, open, closes in 3 h 40 m", () => {
    const { container } = render(<ContactUsHoursAndAvailability now={NOW} />)
    const text = container.textContent ?? ""
    expect(text).toContain("RIGHT NOW IN DUBAI")
    expect(text).toContain("14:20")
    expect(text).toContain("Open · closes in 3 h 40 m")
    expect(screen.getAllByText("Available now").length).toBe(2)
    expect(text).toContain("Replies by 10:00 tomorrow")
  })

  it("in Arabic: the comma, Western digits, the label", () => {
    const { container } = render(<ContactUsHoursAndAvailability locale="ar" now={NOW} />)
    const text = container.textContent ?? ""
    expect(text).toContain("الآن في دبي")
    expect(text).toContain("مفتوح، يغلق خلال 3 س 40 د")
    expect(text).toContain("14:20")
  })

  it("marks today's row, derived from the moment, and shows the days' hours", () => {
    render(<ContactUsHoursAndAvailability now={NOW} />)
    const today = document.querySelector("[aria-current=date]")!
    expect(today.textContent).toContain("Tuesday")
    expect(today.textContent).toContain("Today")
    expect(today.className).toContain("bg-muted")
    expect(screen.getAllByText("Closed").length).toBe(2)
    expect(screen.getByText("09:00 – 16:00")).toBeTruthy()
  })

  it("a different moment moves today, and a closed one says when it opens", () => {
    const { container } = render(<ContactUsHoursAndAvailability now="2026-03-13T10:20:00Z" />) // Friday
    expect(document.querySelector("[aria-current=date]")!.textContent).toContain("Friday")
    expect(container.textContent).toContain("Closed · opens Sunday at 09:00")
    expect(container.textContent).toContain("Opens Sunday at 09:00")
  })

  it("is neutral before any time is known", () => {
    // The first render, as the server draws it, before a time is known.
    const html = renderToString(<ContactUsHoursAndAvailability />)
    expect(html.replace(/<[^>]+>/g, "")).toContain("--:--")
    expect(html).not.toContain("aria-current")
    expect(html).not.toContain("Available now")
  })

  it("shows the closure notice, and leaves it out when it is null", () => {
    const { rerender } = render(<ContactUsHoursAndAvailability now={NOW} />)
    expect(screen.getByText("Eid al-Fitr closure")).toBeTruthy()
    rerender(<ContactUsHoursAndAvailability now={NOW} notice={null} />)
    expect(screen.queryByText("Eid al-Fitr closure")).toBeNull()
  })

  it("takes the week, and a zone, and its hours come from them", () => {
    const week = [null, { open: "10:00", close: "12:00" }, null, null, null, null, null] as const
    const { container } = render(<ContactUsHoursAndAvailability now="2026-03-09T07:00:00Z" hours={week} />) // Monday 11:00 in Dubai
    expect(container.textContent).toContain("Open · closes in 1 h")
    expect(container.textContent).toContain("10:00 – 12:00")
  })

  it("choosing another zone re-draws the clock and the hours in that zone", async () => {
    const { container } = render(<ContactUsHoursAndAvailability now={NOW} />)
    await userEvent.click(screen.getByRole("combobox"))
    await userEvent.click(await screen.findByRole("option", { name: /Singapore/ }))
    const text = container.textContent ?? ""
    expect(text).toContain("RIGHT NOW IN SINGAPORE")
    expect(text).toContain("18:20")
    expect(text).toContain("13:00 – 22:00")
  })

  it("has no form and nothing required", () => {
    const { container } = render(<ContactUsHoursAndAvailability now={NOW} />)
    expect(container.querySelector("form, input[required]")).toBeNull()
    expect(container.textContent).not.toContain("*")
  })
})

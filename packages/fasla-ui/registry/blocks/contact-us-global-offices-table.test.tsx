import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { render, screen, within } from "@testing-library/react"
import { ContactUsGlobalOfficesTable, contactUsGlobalOfficesTableCopy } from "./contact-us-global-offices-table"

// jsdom has no layout: the Figma sizes and the container-query layouts were
// measured in a browser. These assert the contract around them.

const NOW = "2026-04-07T10:20:00Z"
const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === "object" && !("$$typeof" in value) ? Object.values(value).flatMap(strings) : []
const keys = (value: unknown): string[] => Object.keys(value as object).sort()
const textOf = (node: React.ReactNode) => render(<>{node}</>).container.textContent ?? ""

describe("Global Offices Table", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 (%s)", (locale) => {
    const { container } = render(<ContactUsGlobalOfficesTable locale={locale} now={NOW} />)
    const section = container.querySelector("section")!
    const heading = within(section).getByRole("heading", { level: 2 })
    expect(section.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(heading.textContent).toBe(contactUsGlobalOfficesTableCopy[locale].heading)
  })

  it("has the same copy keys, and the same offices, in English and Arabic", () => {
    const { en, ar } = contactUsGlobalOfficesTableCopy
    expect(keys(ar)).toEqual(keys(en))
    expect(ar.offices.length).toBe(en.offices.length)
    expect(ar.offices.map((o) => o.timeZone)).toEqual(en.offices.map((o) => o.timeZone))
  })

  it("keeps the Arabic rules: no middle dot, no dash outside digits, no Arabic-Indic digit, no percent sign", () => {
    const text = strings({ ...contactUsGlobalOfficesTableCopy.ar, description: textOf(contactUsGlobalOfficesTableCopy.ar.description) }).join(" ")
    expect(text).not.toMatch(/·/)
    expect(text).not.toMatch(/[–—]/)
    expect(text).not.toMatch(/[٠-٩۰-۹]/)
    expect(text).not.toContain("%")
    expect(text).not.toContain("*")
  })

  it("is a real table with column and row headers", () => {
    render(<ContactUsGlobalOfficesTable now={NOW} />)
    const table = screen.getByRole("table")
    const columns = within(table).getAllByRole("columnheader").map((c) => c.textContent)
    expect(columns).toEqual(["Office", "Region", "Phone", "Local time", "Hours"])
    const rows = within(table).getAllByRole("rowheader").map((c) => c.textContent)
    expect(rows.map((r) => r?.replace("Open now", ""))).toEqual(["Dubai — HQ", "Riyadh", "Amman", "London", "Singapore"])
    expect(table.querySelectorAll("th[scope=col]").length).toBe(5)
    expect(table.querySelectorAll("th[scope=row]").length).toBe(5)
  })

  it("shows Figma's local times at the frozen moment, in Western digits", () => {
    const { container } = render(<ContactUsGlobalOfficesTable now={NOW} />)
    const text = container.textContent ?? ""
    for (const time of ["14:20 GST", "13:20 AST", "13:20 EEST", "11:20 BST", "18:20 SGT"]) expect(text).toContain(time)
  })

  it("keeps Western digits and 24 hours in Arabic", () => {
    const { container } = render(<ContactUsGlobalOfficesTable locale="ar" now={NOW} />)
    const text = container.textContent ?? ""
    expect(text).toContain("14:20 GST")
    expect(text).not.toMatch(/[٠-٩]/)
  })

  it("a different moment changes the times", () => {
    const { container } = render(<ContactUsGlobalOfficesTable now="2026-04-07T22:05:00Z" />)
    const text = container.textContent ?? ""
    expect(text).toContain("02:05 GST")
    expect(text).not.toContain("14:20 GST")
  })

  it("reads --:-- before any time is known", () => {
    // The first render, as the server draws it, before a time is known.
    const html = renderToString(<ContactUsGlobalOfficesTable />)
    expect(html).toContain("--:--")
    expect(html).not.toContain("GST")
    expect(html).not.toContain("Open now")
  })

  it("marks the offices that are open, and not the one that is closed", () => {
    render(<ContactUsGlobalOfficesTable now={NOW} />)
    const open = (name: string) => within(screen.getByRole("rowheader", { name: new RegExp(name) })).queryByText("Open now")
    for (const name of ["Dubai", "Riyadh", "Amman", "London"]) expect(open(name)).not.toBeNull()
    expect(open("Singapore")).toBeNull()
  })

  it("takes offices, and a press kit link", () => {
    const offices = [{ ...contactUsGlobalOfficesTableCopy.en.offices[0]!, name: "Cairo", phone: "+20 2 1234 5678" }]
    render(<ContactUsGlobalOfficesTable now={NOW} offices={offices} pressKitHref="/press.zip" />)
    expect(screen.getByRole("rowheader", { name: /Cairo/ })).toBeTruthy()
    expect(screen.queryByText("Riyadh")).toBeNull()
    expect(screen.getByRole("link", { name: "Download press kit" }).getAttribute("href")).toBe("/press.zip")
  })

  it("has no Copy address button, and no form, so nothing is required", () => {
    const { container } = render(<ContactUsGlobalOfficesTable now={NOW} />)
    expect(screen.queryByText(/copy address/i)).toBeNull()
    expect(container.querySelector("form, input")).toBeNull()
    expect(container.textContent).not.toContain("*")
  })
})

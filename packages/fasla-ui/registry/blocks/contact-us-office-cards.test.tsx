import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ContactUsOfficeCards, contactUsOfficeCardsCopy } from "./contact-us-office-cards"

const PHOTO = { src: "/dubai.webp", alt: "Dubai coast" }
const strings = (value: unknown): string[] => (typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [])

describe("Office Cards", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 and three h3 cities, in %s", (locale) => {
    const { container } = render(<ContactUsOfficeCards locale={locale} />)
    const section = container.querySelector("section")!
    expect(document.getElementById(section.getAttribute("aria-labelledby")!)?.tagName).toBe("H2")
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(contactUsOfficeCardsCopy[locale].offices.map((o) => o.city))
  })

  it("orders the cities Dubai, Riyadh, Amman", () => {
    render(<ContactUsOfficeCards />)
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Dubai", "Riyadh", "Amman"])
  })

  it("has Arabic copy for every English string, and every office has the same fields", () => {
    expect(Object.keys(contactUsOfficeCardsCopy.ar).sort()).toEqual(Object.keys(contactUsOfficeCardsCopy.en).sort())
    expect(contactUsOfficeCardsCopy.ar.offices).toHaveLength(3)
    for (const [i, office] of contactUsOfficeCardsCopy.ar.offices.entries()) expect(Object.keys(office).sort()).toEqual(Object.keys(contactUsOfficeCardsCopy.en.offices[i]!).sort())
  })

  it("writes Arabic without a middle dot, a dash outside digits, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(contactUsOfficeCardsCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d\s?)–|–(?!\s?\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("aligns photos to the cards: an undefined entry leaves a quiet ground", () => {
    const { container } = render(<ContactUsOfficeCards photos={[PHOTO, undefined, undefined]} />)
    const cards = container.querySelectorAll("li")
    expect(cards[0]!.querySelector("img")?.getAttribute("src")).toBe(PHOTO.src)
    expect(cards[1]!.querySelector("img")).toBeNull()
    expect(cards[2]!.querySelector("img")).toBeNull()
  })

  it("rises the cards 80ms apart", () => {
    const { container } = render(<ContactUsOfficeCards />)
    expect([...container.querySelectorAll("li")].map((li) => li.getAttribute("data-reveal-delay"))).toEqual(["0", "80", "160"])
  })

  it("makes phones tel links and Directions links named with the city", () => {
    render(<ContactUsOfficeCards />)
    expect(screen.getByRole("link", { name: "+966 11 288 4100" }).getAttribute("href")).toBe("tel:+966112884100")
    const links = screen.getAllByRole("link", { name: /^Directions, / })
    expect(links.map((l) => l.getAttribute("aria-label"))).toEqual(["Directions, Dubai", "Directions, Riyadh", "Directions, Amman"])
    for (const link of links) expect(link.getAttribute("href")).toMatch(/^https:/)
  })

  it("flips the arrow in a right-to-left page and draws no local-time chip", () => {
    const { container } = render(<ContactUsOfficeCards />)
    expect(container.querySelector("svg.lucide-arrow-up-right")!.getAttribute("class")).toContain("[&:dir(rtl)]:-scale-x-100")
    expect(container.textContent).not.toMatch(/\d{1,2}:\d{2}/)
  })

  it("sets the badge as Badge Soft Secondary small Rounded, with no colour of its own", () => {
    render(<ContactUsOfficeCards />)
    const badge = screen.getByText("Headquarters").closest("[class*=rounded-full]")!
    expect(badge.className).toContain("from-soft-secondary")
    expect(badge.className).toContain("rounded-full")
  })

  it("takes its own offices", () => {
    render(<ContactUsOfficeCards offices={[{ city: "Cairo", badge: "Sales", address: "Zamalek", phone: "+20 2 000 0000" }]} />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1)
  })
})

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ContactUsMapSplit, contactUsMapSplitCopy } from "./contact-us-map-split"

// jsdom has no layout: the Figma sizes and container-query layouts were measured
// in a browser. These assert the contract: copy, links, the photo slot, Arabic rules.

const PHOTO = { src: "/photo.webp", alt: "A skyline" }
const strings = (value: unknown): string[] => (typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [])

describe("Map Split", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2, in %s", (locale) => {
    const { container } = render(<ContactUsMapSplit locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent).toBe(contactUsMapSplitCopy[locale].heading)
  })

  it("has Arabic copy for every English string", () => {
    expect(Object.keys(contactUsMapSplitCopy.ar).sort()).toEqual(Object.keys(contactUsMapSplitCopy.en).sort())
  })

  it("writes Arabic without a middle dot, a dash outside digits, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(contactUsMapSplitCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d\s?)–|–(?!\s?\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("shows a photo when given one, and a quiet ground when not, with no map library", () => {
    const { container, rerender } = render(<ContactUsMapSplit />)
    expect(container.querySelector("img")).toBeNull()
    rerender(<ContactUsMapSplit photo={PHOTO} />)
    const img = container.querySelector("img")!
    expect(img.getAttribute("src")).toBe(PHOTO.src)
    expect(img.getAttribute("alt")).toBe(PHOTO.alt)
    expect(img.getAttribute("data-reveal")).toBe("pan")
  })

  it("holds the Map Pin Card over the photo, rising 200ms after the pan starts", () => {
    const { container } = render(<ContactUsMapSplit photo={PHOTO} />)
    const card = screen.getByText("Fasla HQ").parentElement!
    expect(card.getAttribute("data-reveal-delay")).toBe("200")
    expect(card.className).toContain("start-6")
    expect(card.className).toContain("bottom-6")
    expect(container.querySelector("img")!.parentElement!.contains(card)).toBe(true)
  })

  it("links Get directions and Email the studio, styled as Buttons", () => {
    render(<ContactUsMapSplit directionsHref="https://maps.example/x" emailAddress="studio@fasla.com" />)
    const directions = screen.getByRole("link", { name: "Get directions" })
    expect(directions.getAttribute("href")).toBe("https://maps.example/x")
    const email = screen.getByRole("link", { name: "Email the studio" })
    expect(email.getAttribute("href")).toBe("mailto:studio@fasla.com")
    expect(directions.className).toContain("bg-primary")
    expect(email.className).toContain("border")
  })

  it("makes the phone a tel link in one left-to-right run", () => {
    render(<ContactUsMapSplit />)
    const phone = screen.getByRole("link", { name: "+971 4 512 8800" })
    expect(phone.getAttribute("href")).toBe("tel:+97145128800")
    expect(phone.querySelector("bdi")?.getAttribute("dir")).toBe("ltr")
  })

  it("lets a copy prop replace its default", () => {
    render(<ContactUsMapSplit heading="Find us" />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Find us")
  })
})

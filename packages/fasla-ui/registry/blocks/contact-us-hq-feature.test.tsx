import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ContactUsHqFeature, contactUsHqFeatureCopy } from "./contact-us-hq-feature"

const NOW = "2026-03-10T10:20:00Z" // Tuesday 14:20 in Dubai, 3 h 40 m before close
const PHOTO = { src: "/lounge.webp", alt: "A lounge" }
const strings = (value: unknown): string[] => (typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [])
const status = (container: HTMLElement) => container.querySelector("[role=status]")!

describe("HQ Feature", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2, in %s", (locale) => {
    const { container } = render(<ContactUsHqFeature locale={locale} now={NOW} />)
    const section = container.querySelector("section")!
    expect(document.getElementById(section.getAttribute("aria-labelledby")!)?.tagName).toBe("H2")
  })

  it("has Arabic copy for every English string", () => {
    expect(Object.keys(contactUsHqFeatureCopy.ar).sort()).toEqual(Object.keys(contactUsHqFeatureCopy.en).sort())
  })

  it("writes Arabic without a middle dot, a dash outside digits, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(contactUsHqFeatureCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d\s?)–|–(?!\s?\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("reads exactly Figma's live line at the frozen moment, and a different moment changes it", () => {
    const { container, rerender } = render(<ContactUsHqFeature now={NOW} />)
    expect(status(container).textContent).toBe("Open now · closes in 3 hours")
    expect(status(container).getAttribute("data-state")).toBe("open")
    rerender(<ContactUsHqFeature now="2026-03-10T13:40:00Z" />) // 17:40, 20 minutes before close
    expect(status(container).textContent).toBe("Open now · closes in 20 minutes")
    rerender(<ContactUsHqFeature now="2026-03-14T10:20:00Z" />) // Saturday
    expect(status(container).textContent).toBe("Closed · opens tomorrow at 09:00")
    expect(status(container).getAttribute("data-state")).toBe("closed")
    rerender(<ContactUsHqFeature now="2026-03-13T11:00:00Z" />) // Friday 15:00, after 13:00
    expect(status(container).textContent).toBe("Closed · opens Sunday at 09:00")
    rerender(<ContactUsHqFeature now="2026-03-10T03:00:00Z" />) // Tuesday 07:00
    expect(status(container).textContent).toBe("Closed · opens today at 09:00")
  })

  it("reads the line in Arabic with a comma and Western digits", () => {
    const { container, rerender } = render(<ContactUsHqFeature locale="ar" now={NOW} />)
    expect(status(container).textContent).toBe("مفتوح الآن، يغلق خلال 3 ساعات")
    rerender(<ContactUsHqFeature locale="ar" now="2026-03-10T13:40:00Z" />)
    expect(status(container).textContent).toBe("مفتوح الآن، يغلق خلال 20 دقيقة")
    rerender(<ContactUsHqFeature locale="ar" now="2026-03-14T10:20:00Z" />)
    expect(status(container).textContent).toBe("مغلق، يفتح غدًا عند 09:00")
  })

  it("uses a green dot when open and a muted one when closed", () => {
    const { container, rerender } = render(<ContactUsHqFeature now={NOW} />)
    expect(status(container).firstElementChild!.className).toContain("bg-success")
    rerender(<ContactUsHqFeature now="2026-03-14T10:20:00Z" />)
    expect(status(container).firstElementChild!.className).toContain("bg-muted-foreground")
    expect(status(container).firstElementChild!.className).toContain("duration-[180ms]")
  })

  it("is neutral, with no countdown, before the time is known", () => {
    // Without `now` the first render has no time; the live one comes after mount, so read the server render.
    const { renderToString } = require("react-dom/server") as typeof import("react-dom/server")
    const html = renderToString(<ContactUsHqFeature />)
    expect(html).toContain('data-state="unknown"')
    expect(html).not.toContain("Open now")
    expect(html).not.toContain("closes in")
  })

  it("draws the Hours card from the week, one row per run of days", () => {
    render(<ContactUsHqFeature now={NOW} />)
    for (const text of ["OPENING HOURS", "Sunday – Thursday", "Friday", "Saturday", "09:00 – 18:00", "09:00 – 13:00", "Closed"]) expect(screen.getByText(text)).toBeTruthy()
    const { rerender } = render(<ContactUsHqFeature now={NOW} hours={[null, { open: "10:00", close: "16:00" }, { open: "10:00", close: "16:00" }, null, null, null, null]} />)
    rerender(<ContactUsHqFeature now={NOW} hours={[null, { open: "10:00", close: "16:00" }, { open: "10:00", close: "16:00" }, null, null, null, null]} />)
    expect(screen.getByText("Monday – Tuesday")).toBeTruthy()
  })

  it("follows the time zone", () => {
    // 10:20Z is 11:20 in London, not yet open for a 12:00 opening.
    const week = Array(7).fill({ open: "12:00", close: "20:00" }) as never
    const { container } = render(<ContactUsHqFeature now={NOW} timeZone="Europe/London" hours={week} />)
    expect(status(container).textContent).toBe("Closed · opens today at 12:00")
  })

  it("links Get directions and offers Book a visit as a button or a link", () => {
    const onBook = vi.fn()
    const { rerender } = render(<ContactUsHqFeature now={NOW} directionsHref="https://maps.example/hq" onBook={onBook} />)
    expect(screen.getByRole("link", { name: "Get directions" }).getAttribute("href")).toBe("https://maps.example/hq")
    fireEvent.click(screen.getByRole("button", { name: "Book a visit" }))
    expect(onBook).toHaveBeenCalledTimes(1)
    rerender(<ContactUsHqFeature now={NOW} bookHref="/book" />)
    expect(screen.getByRole("link", { name: "Book a visit" }).getAttribute("href")).toBe("/book")
    expect(screen.getByRole("link", { name: "Book a visit" }).className).toContain("hover:motion-safe:-translate-y-0.5")
  })

  it("shows a photo when given one, and a quiet ground when not; the photo does not move on scroll", () => {
    const { container, rerender } = render(<ContactUsHqFeature now={NOW} />)
    expect(container.querySelector("img")).toBeNull()
    rerender(<ContactUsHqFeature now={NOW} photo={PHOTO} />)
    const img = container.querySelector("img")!
    expect(img.getAttribute("src")).toBe(PHOTO.src)
    expect(img.getAttribute("data-reveal")).toBeNull()
  })
})

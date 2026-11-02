import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { ContactUsSocialRail, contactUsSocialRailCopy } from "./contact-us-social-rail"

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true })
})

const withClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
  return writeText
}

describe("Social Rail", () => {
  it.each(["en", "ar"] as const)("is a labelled section whose heading is the email address, in %s", (locale) => {
    const { container } = render(<ContactUsSocialRail locale={locale} />)
    const section = container.querySelector("section")!
    expect(document.getElementById(section.getAttribute("aria-labelledby")!)?.textContent).toBe("hello@fasla.com")
    expect(container.querySelector("h2 button")).toBeTruthy()
  })

  it("has Arabic copy for every English string, written by the Arabic rules", () => {
    expect(Object.keys(contactUsSocialRailCopy.ar).sort()).toEqual(Object.keys(contactUsSocialRailCopy.en).sort())
    const arabic = strings(contactUsSocialRailCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d)–|–(?!\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("has no form, so no field is required and no asterisk shows", () => {
    const { container } = render(<ContactUsSocialRail />)
    expect(container.querySelector("form, input, textarea")).toBeNull()
    expect(container.textContent).not.toContain("*")
  })

  it("draws eight links, four a row on Desktop, each with both mark sets, a name and a handle", () => {
    const { container } = render(<ContactUsSocialRail />)
    const tiles = [...container.querySelectorAll("a[href]")]
    expect(tiles).toHaveLength(8)
    expect(tiles.map((tile) => tile.querySelector("[data-platform]")?.getAttribute("data-platform"))).toEqual(["linkedin", "x", "instagram", "dribbble", "github", "youtube", "threads", "medium"])
    for (const tile of tiles) {
      expect([...tile.querySelectorAll("[data-slot=social-icon]")].map((icon) => icon.getAttribute("data-color"))).toEqual(["original", "negative"])
      expect(tile.querySelector("bdi")?.getAttribute("dir")).toBe("ltr")
    }
    expect(screen.getByRole("link", { name: /LinkedIn/ }).getAttribute("href")).toContain("linkedin.com")
    expect(container.querySelector("[class*='grid-cols-4']")).toBeTruthy()
  })

  it("takes its tiles from socialLinks, and never mirrors a mark while the arrow does", () => {
    const { container } = render(<ContactUsSocialRail socialLinks={[{ platform: "github", name: "Code", handle: "/x", href: "https://example.com" }]} />)
    expect(container.querySelectorAll("a[href]")).toHaveLength(1)
    expect(container.querySelector("a svg[data-slot=social-icon]")?.getAttribute("class")).not.toContain("scale-x")
    expect(container.querySelector("a svg.lucide")?.getAttribute("class")).toContain("rtl:-scale-x-100")
  })

  it("rises the tiles on a 50ms stagger", () => {
    const { container } = render(<ContactUsSocialRail />)
    expect([...container.querySelectorAll("a[data-reveal=rise]")].map((tile) => tile.getAttribute("data-reveal-delay"))).toEqual(["0", "50", "100", "150", "200", "250", "300", "350"])
  })

  it("moves each mark from Original to Negative and slides the arrow, only when motion is welcome", () => {
    const { container } = render(<ContactUsSocialRail />)
    const tile = container.querySelector("a")!
    const [original, negative] = [...tile.querySelectorAll("[data-slot=social-icon]")]
    expect(original!.getAttribute("class")).toContain("group-hover/tile:motion-safe:opacity-0")
    expect(negative!.getAttribute("class")).toContain("group-hover/tile:motion-safe:opacity-100")
    expect(tile.innerHTML).toContain("group-hover/tile:motion-safe:translate-x-1")
    expect(tile.innerHTML).toContain("rtl:group-hover/tile:motion-safe:-translate-x-1")
  })

  it("copies the address from the headline, says Copied for 1.6s with a live announcement, then goes back", async () => {
    vi.useFakeTimers()
    const writeText = withClipboard()
    const onCopy = vi.fn()
    const { container } = render(<ContactUsSocialRail onCopy={onCopy} />)
    const headline = screen.getByRole("button", { name: "Copy hello@fasla.com" })
    await act(async () => {
      fireEvent.click(headline)
    })
    expect(writeText).toHaveBeenCalledWith("hello@fasla.com")
    expect(onCopy).toHaveBeenCalledWith("hello@fasla.com")
    expect(container.querySelector("[role=status]")?.textContent).toBe("Copied hello@fasla.com")
    expect(screen.getByRole("button", { name: /Copied/ })).toBeTruthy()
    await act(async () => {
      vi.advanceTimersByTime(1600)
    })
    expect(container.querySelector("[role=status]")?.textContent).toBe("")
    expect(screen.getByRole("button", { name: "Copy email" })).toBeTruthy()
  })

  it("copies from the Copy email button too, with a custom address, in Arabic", async () => {
    const writeText = withClipboard()
    render(<ContactUsSocialRail locale="ar" email="team@fasla.com" />)
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "انسخ البريد" }))
    })
    expect(writeText).toHaveBeenCalledWith("team@fasla.com")
    expect(screen.getByRole("button", { name: /تم النسخ/ })).toBeTruthy()
  })

  it("claims nothing when there is no clipboard to write to", async () => {
    const { container } = render(<ContactUsSocialRail />)
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy hello@fasla.com" }))
    })
    expect(container.querySelector("[role=status]")?.textContent).toBe("")
  })

  it("sets the footer button as Button Outline Secondary, with no colour of its own", () => {
    render(<ContactUsSocialRail />)
    const button = screen.getByRole("button", { name: "Copy email" })
    expect(button.className).toContain("ring-1")
    expect(button.className).toContain("text-foreground ring-border")
    expect(button.className).toContain("w-full shrink-0 [@container(min-width:40rem)]:w-auto")
  })
})

import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { VideoCallHeroCallMockup, videoCallHeroCallMockupCopy } from "../video-call-hero-call-mockup/VideoCallHeroCallMockup"

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = readFileSync(resolve(here, "../video-call-hero-call-mockup/VideoCallHeroCallMockup.tsx"), "utf8")

/** Every string a copy object holds as a value, without its ids. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" ? [] : [value]
  if (Array.isArray(value)) return value.flatMap((item) => strings(item))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, k))
  return []
}

const originalMatchMedia = window.matchMedia
const originalAnimate = (Element.prototype as unknown as { animate?: unknown }).animate

function reduceMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

/** A fake `Element.animate` that records its calls, as jsdom has none. */
function stubAnimate() {
  const calls: { target: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }[] = []
  ;(Element.prototype as unknown as { animate: unknown }).animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    calls.push({ target: this, keyframes, options })
    return { cancel: vi.fn(), finish: vi.fn(), finished: Promise.resolve(), onfinish: null }
  }
  return calls
}

afterEach(() => {
  cleanup()
  window.matchMedia = originalMatchMedia
  if (originalAnimate === undefined) delete (Element.prototype as unknown as { animate?: unknown }).animate
  else (Element.prototype as unknown as { animate: unknown }).animate = originalAnimate
  vi.restoreAllMocks()
})

describe("the hero source", () => {
  it("uses logical properties only, and the motion library never", () => {
    expect(SOURCE).not.toMatch(/\b(?:ml|mr|pl|pr)-(?:\d|\[|px|auto)/)
    expect(SOURCE).not.toMatch(/(?:^|[\s"'`:])(?:left|right)-(?:\d|\[|px|auto|full)/)
    expect(SOURCE).not.toMatch(/text-(?:left|right)\b/)
    expect(SOURCE).not.toMatch(/\b(?:rounded|border)-(?:l|r)(?:-|\b)/)
    expect(SOURCE).not.toMatch(/from ["'](?:framer-motion|motion\/react)["']/)
    expect(SOURCE).not.toMatch(/from ["'][^"']*src\/motion/)
  })

  it("asks for no camera, microphone or video element: stills only", () => {
    expect(SOURCE).not.toMatch(/getUserMedia|<video\b|mediaDevices/)
  })

  it("never writes a bare opacity tint, which has no rule under Tailwind 3", () => {
    expect(SOURCE).not.toMatch(/\bbg-(?:primary|success|destructive)\/\d/)
  })
})

describe("the copy", () => {
  it("has the same keys in English and Arabic, and no em dash, middle dot or bracketed English in the Arabic", () => {
    expect(Object.keys(videoCallHeroCallMockupCopy.en)).toEqual(Object.keys(videoCallHeroCallMockupCopy.ar))
    for (const text of strings(videoCallHeroCallMockupCopy.ar)) {
      expect(text, text).not.toMatch(/[—·]/)
      expect(text, text).not.toMatch(/\([A-Za-z]/)
      expect(text, text).not.toMatch(/(?:^|\s)[وبكلـ]+[A-Za-z]/)
    }
  })
})

describe("Hero — Call Mockup", () => {
  it("names the section by its headline, and shows the tag, the line, the buttons and the proof", () => {
    render(<VideoCallHeroCallMockup />)
    const heading = screen.getByRole("heading", { level: 2, name: "Meetings that start on time" })
    expect(screen.getByRole("region", { name: "Meetings that start on time" })).toContainElement(heading)
    expect(screen.getByText(/No downloads/)).toBeInTheDocument()
    expect(screen.getByText(/remembers every device choice/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Start a free room" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Watch a 2-min tour" })).toBeInTheDocument()
    expect(screen.getByText("4.9 from 2,100 teams that switched this year")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Rated 4.9 out of 5" })).toBeInTheDocument()
  })

  it("calls back for Start and for the tour", () => {
    const onStart = vi.fn()
    const onTour = vi.fn()
    render(<VideoCallHeroCallMockup onStart={onStart} onTour={onTour} />)
    fireEvent.click(screen.getByRole("button", { name: "Start a free room" }))
    fireEvent.click(screen.getByRole("button", { name: "Watch a 2-min tour" }))
    expect(onStart).toHaveBeenCalledTimes(1)
    expect(onTour).toHaveBeenCalledTimes(1)
  })

  it("keeps the mockup a hidden, inert picture that nothing in it can focus", () => {
    const { container } = render(<VideoCallHeroCallMockup />)
    const mock = container.querySelector("[data-hero-mock]")!
    expect(mock).toHaveAttribute("aria-hidden", "true")
    expect(mock).toHaveAttribute("inert")
    for (const button of mock.querySelectorAll("button")) expect(button).toHaveAttribute("tabindex", "-1")
    // Only the two real buttons are reachable by name.
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("draws three tiles, a dock of five controls and Leave, and hides the third tile and last two controls on a phone", () => {
    const { container } = render(<VideoCallHeroCallMockup />)
    const tiles = container.querySelectorAll("[data-hero-tile]")
    expect(tiles).toHaveLength(3)
    expect(tiles[2]!.className).toMatch(/(?:^|\s)hidden(?:\s|$)/)
    expect(tiles[1]!.className).not.toMatch(/(?:^|\s)hidden(?:\s|$)/)
    const dock = container.querySelectorAll("[data-hero-mock] button")
    expect(dock).toHaveLength(6)
    expect(dock[3]!.className).toMatch(/(?:^|\s)hidden(?:\s|$)/)
    expect(dock[4]!.className).toMatch(/(?:^|\s)hidden(?:\s|$)/)
    expect(dock[2]!.className).not.toMatch(/(?:^|\s)hidden(?:\s|$)/)
    expect(container.querySelector("[data-hero-mock]")).toHaveTextContent("Leave")
    expect(container.querySelector("[data-hero-mock]")).toHaveTextContent("REC")
  })

  it("shows a still on each tile and a face in the proof only when given photos, with initials otherwise", () => {
    const photos = { mona: { src: "/m.webp", alt: "Mona" }, adam: { src: "/a.webp", alt: "Adam" } }
    const { container, rerender } = render(<VideoCallHeroCallMockup photos={photos} />)
    const srcs = Array.from(container.querySelectorAll("[data-hero-tile] img")).map((img) => img.getAttribute("src"))
    expect(srcs).toEqual(["/m.webp", "/a.webp"])
    rerender(<VideoCallHeroCallMockup />)
    expect(container.querySelectorAll("[data-hero-tile] img")).toHaveLength(0)
  })

  it("rises the five copy parts 16px and 70ms apart, then the mockup 120ms after the last, then the tiles 60ms apart", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    const { container } = render(<VideoCallHeroCallMockup />)
    const copy = calls.filter((call) => (call.target as HTMLElement).hasAttribute("data-hero-copy"))
    expect(copy).toHaveLength(5)
    expect(copy.map((call) => call.options.delay)).toEqual([0, 70, 140, 210, 280])
    expect(copy[0]!.keyframes[0]).toMatchObject({ opacity: 0, transform: "translateY(16px)" })
    const mock = calls.find((call) => call.target === container.querySelector("[data-hero-mock]"))!
    expect(mock.options.delay).toBe(280 + 120)
    const tiles = calls.filter((call) => (call.target as HTMLElement).hasAttribute("data-hero-tile"))
    expect(tiles).toHaveLength(3)
    expect(tiles.map((call) => Number(call.options.delay) - Number(mock.options.delay) - 240)).toEqual([0, 60, 120])
  })

  it("scales the mockup in from 0.96 with its shadow growing, from Tablet up, and only fades it on a phone", () => {
    reduceMotion(false)
    let calls = stubAnimate()
    let view = render(<VideoCallHeroCallMockup />)
    // jsdom measures nothing, so the first render is a phone: a plain fade.
    const phone = calls.find((call) => call.target === view.container.querySelector("[data-hero-mock]"))!
    expect(phone.keyframes).toHaveLength(2)
    expect(JSON.stringify(phone.keyframes)).not.toContain("scale")
    view.unmount()

    // A wide section: patch the width before the effect reads it.
    const proto = HTMLElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(proto, "clientWidth")
    Object.defineProperty(proto, "clientWidth", { configurable: true, get: () => 1280 })
    calls = stubAnimate()
    view = render(<VideoCallHeroCallMockup />)
    const wide = calls.find((call) => call.target === view.container.querySelector("[data-hero-mock]"))!
    expect(wide.keyframes[0]).toMatchObject({ transform: "scale(0.96)" })
    // The shadow grows from none into whatever shadow-2xl computes to (nothing in jsdom).
    expect(wide.keyframes[0]!.boxShadow).toBe("none")
    expect(wide.keyframes[1]).toHaveProperty("boxShadow")
    if (descriptor) Object.defineProperty(proto, "clientWidth", descriptor)
    else delete (proto as unknown as { clientWidth?: unknown }).clientWidth
  })

  it("starts the REC dot's 1.6s pulse only once the mockup has landed, and it is the only loop", async () => {
    reduceMotion(false)
    const calls = stubAnimate()
    render(<VideoCallHeroCallMockup />)
    await act(async () => {
      await Promise.resolve()
    })
    const loops = calls.filter((call) => call.options.iterations === Infinity)
    expect(loops).toHaveLength(1)
    expect((loops[0]!.target as HTMLElement).hasAttribute("data-hero-dot")).toBe(true)
    expect(loops[0]!.options.duration).toBe(1600)
  })

  it("under reduced motion fades the parts in 120ms together and loops nothing", async () => {
    reduceMotion(true)
    const calls = stubAnimate()
    render(<VideoCallHeroCallMockup />)
    await act(async () => {
      await Promise.resolve()
    })
    expect(calls.length).toBeGreaterThan(0)
    for (const call of calls) {
      expect(call.options.duration).toBe(120)
      expect(call.options.delay ?? 0).toBe(0)
      expect(call.keyframes).toHaveLength(2)
      expect(JSON.stringify(call.keyframes)).not.toContain("translate")
      expect(call.options.iterations).toBeUndefined()
    }
  })

  it("writes the Arabic copy, with the figures kept left to right and the Arabic tile names", () => {
    const { container } = render(<VideoCallHeroCallMockup locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: "اجتماعات تبدأ في وقتها" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "ابدأ غرفة مجانية" })).toBeInTheDocument()
    const proof = screen.getByText(/فريق انتقلوا هذا العام/)
    expect(proof.querySelectorAll("bdi[dir='ltr']").length).toBeGreaterThanOrEqual(2)
    expect(container.querySelector("[data-hero-mock]")).toHaveTextContent("منى")
    expect(container.querySelector("[data-hero-mock]")).toHaveTextContent("تسجيل")
    expect(container.querySelector("[data-hero-mock]")).toHaveTextContent("خروج")
  })

  it("passes a changed string through and keeps the rest", () => {
    render(<VideoCallHeroCallMockup heading="Calls that start now" />)
    expect(screen.getByRole("heading", { level: 2, name: "Calls that start now" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Start a free room" })).toBeInTheDocument()
  })
})

describe("Figures and a thousands comma", () => {
  it("keeps 2,100 one left-to-right run inside an Arabic sentence, so it cannot read 100,2", () => {
    render(<VideoCallHeroCallMockup locale="ar" />)
    const isolates = Array.from(screen.getByText(/فريق انتقلوا هذا العام/).querySelectorAll("bdi[dir='ltr']")).map((node) => node.textContent)
    expect(isolates).toContain("2,100")
    expect(isolates).toContain("4.9")
  })
})

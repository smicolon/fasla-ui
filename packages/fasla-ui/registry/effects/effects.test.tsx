import { describe, it, expect, vi, afterEach } from "vitest"
import { act, fireEvent, render, waitFor } from "@testing-library/react"
import { ShimmerButton } from "./shimmer-button/shimmer-button"
import { AnimatedGradient } from "./animated-gradient/animated-gradient"
import { TypewriterText } from "./typewriter-text/typewriter-text"
import { Spotlight, SpotlightCard } from "./spotlight/spotlight"
import { GlowCard } from "./glow-card/glow-card"
import { BorderBeam, GlowingBorder } from "./border-beam/border-beam"

afterEach(() => {
  vi.useRealTimers()
})

describe("ShimmerButton", () => {
  it("draws the sheen in primary-foreground by default, so it shows on the primary background", () => {
    const { getByRole } = render(<ShimmerButton>Shop</ShimmerButton>)
    expect(getByRole("button").style.getPropertyValue("--shimmer-color")).toContain("--primary-foreground")
  })

  it("sizes the sheen with shimmerSize, full width by default", () => {
    const { getByRole, rerender } = render(<ShimmerButton>Shop</ShimmerButton>)
    expect(getByRole("button").style.getPropertyValue("--shimmer-size")).toBe("100%")
    rerender(<ShimmerButton shimmerSize="3rem">Shop</ShimmerButton>)
    const button = getByRole("button")
    expect(button.style.getPropertyValue("--shimmer-size")).toBe("3rem")
    const sheen = Array.from(button.querySelectorAll<HTMLElement>("div")).find((el) => el.style.width)
    expect(sheen?.style.width).toBe("var(--shimmer-size)")
  })

  it("ships its own keyframes, so it needs no Tailwind config", () => {
    const { container } = render(<ShimmerButton>Shop</ShimmerButton>)
    expect(container.querySelector("style")?.textContent).toContain("@keyframes fasla-shimmer")
  })
})

describe("TypewriterText", () => {
  it("does not restart when the parent passes a new inline onComplete", () => {
    vi.useFakeTimers()
    const { container, rerender } = render(<TypewriterText text="Hello" speed={10} onComplete={() => {}} />)
    act(() => {
      vi.advanceTimersByTime(35)
    })
    const typed = container.textContent
    rerender(<TypewriterText text="Hello" speed={10} onComplete={() => {}} />)
    expect(container.textContent).toBe(typed)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(container.textContent).toBe("Hello|")
  })

  it("calls the latest onComplete once the text is typed", () => {
    vi.useFakeTimers()
    const first = vi.fn()
    const latest = vi.fn()
    const { rerender } = render(<TypewriterText text="Hi" speed={10} onComplete={first} />)
    rerender(<TypewriterText text="Hi" speed={10} onComplete={latest} />)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledTimes(1)
  })
})

describe("SpotlightCard", () => {
  it("centres the light on the pointer", () => {
    const { container } = render(<SpotlightCard spotlightSize={300}>Card</SpotlightCard>)
    fireEvent.mouseEnter(container.firstElementChild!)
    const light = container.querySelector<HTMLElement>(".rounded-full")!
    expect(light.style.left).toBe("-150px")
    expect(light.style.top).toBe("-150px")
  })
})

describe("GlowCard", () => {
  it("puts the glow between the card surface and the content, not under an opaque layer", () => {
    const { container, getByText } = render(<GlowCard hoverOnly={false}>Card</GlowCard>)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("bg-card")
    const content = getByText("Card")
    expect(content.className).not.toContain("bg-")
    expect(root.firstElementChild?.className).toContain("opacity-100")
  })
})

describe("BorderBeam", () => {
  it("paints the beam above the content", () => {
    const { container, getByText } = render(<BorderBeam>Card</BorderBeam>)
    const root = container.firstElementChild as HTMLElement
    const beam = root.lastElementChild as HTMLElement
    expect(root.firstElementChild).toBe(getByText("Card"))
    expect(beam.className).toContain("z-10")
    expect(beam.getAttribute("aria-hidden")).toBe("true")
  })
})

describe("GlowingBorder", () => {
  it("draws a coloured ring above the content with a tight glow and no spread", () => {
    const { container, getByText } = render(
      <GlowingBorder glowColor="red" intensity="lg">
        Card
      </GlowingBorder>
    )
    const root = container.firstElementChild as HTMLElement
    const ring = root.lastElementChild as HTMLElement
    expect(root.firstChild?.textContent).toBe(getByText("Card").textContent)
    expect(ring.className).toContain("z-10")
    const shadow = ring.style.boxShadow
    expect(shadow).toContain("inset 0 0 0 2px red")
    // Every outer layer is a blur with zero spread: "0 0 <blur>px 0".
    for (const layer of shadow.split(/,(?![^(]*\))/).slice(1)) {
      expect(layer.trim()).toMatch(/^0 0 \d+px 0 red$/)
    }
  })
})

describe("Spotlight", () => {
  it("keeps the resting light centred when the container resizes, until the pointer moves", async () => {
    let resize: () => void = () => {}
    const saved = globalThis.ResizeObserver
    globalThis.ResizeObserver = class {
      constructor(callback: () => void) {
        resize = callback
      }
      observe() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
    let width = 400
    const widthSpy = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(() => width)
    const heightSpy = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => 200)
    try {
      const { container } = render(<Spotlight size={100}>Panel</Spotlight>)
      const light = container.querySelector<HTMLElement>(".rounded-full")!
      // framer writes translateX(<n>px); jsdom has no DOMMatrix to parse it.
      const x = () => Number(/translateX\((-?[\d.]+)px\)/.exec(light.style.transform)?.[1] ?? 0)
      // framer writes the transform on its next frame, hence waitFor.
      await waitFor(() => expect(x()).toBe(200)) // centre of 400
      width = 800
      act(() => resize())
      await waitFor(() => expect(x()).toBe(400)) // centre of 800
      fireEvent.mouseMove(container.firstElementChild!, { clientX: 10, clientY: 10 })
      width = 1000
      act(() => resize())
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(x()).not.toBe(500) // the pointer has taken over from the centre
    } finally {
      widthSpy.mockRestore()
      heightSpy.mockRestore()
      globalThis.ResizeObserver = saved
    }
  })
})

/**
 * A blank string prop (what a cleared Storybook control or an empty form field
 * passes) falls back to the default instead of emptying the style it feeds.
 */
describe("blank string props fall back to their defaults", () => {
  it("ShimmerButton: every string prop", () => {
    const { getByRole } = render(
      <ShimmerButton shimmerColor="" shimmerSize=" " shimmerDuration="" borderRadius="" background="">
        Shop
      </ShimmerButton>
    )
    const style = getByRole("button").style
    expect(style.getPropertyValue("--shimmer-color")).toContain("--primary-foreground")
    expect(style.getPropertyValue("--shimmer-size")).toBe("100%")
    expect(style.getPropertyValue("--shimmer-duration")).toBe("2s")
    expect(style.getPropertyValue("--border-radius")).toBe("0.5rem")
    expect(style.getPropertyValue("--background")).toBe("var(--primary)")
  })

  it("ShimmerButton: no stacked motion-safe hover variant, anywhere in the source", async () => {
    const { getByRole } = render(<ShimmerButton>Shop</ShimmerButton>)
    expect(getByRole("button").className).toContain("hover:scale-105")
    // Tailwind generates classes it finds in comments, so check the file itself.
    const { readFileSync } = await import("node:fs")
    const { resolve } = await import("node:path")
    const source = readFileSync(resolve(__dirname, "shimmer-button/shimmer-button.tsx"), "utf8")
    expect(source).not.toMatch(/motion-(safe|reduce):(hover|focus)/)
  })

  it("BorderBeam and GlowingBorder", async () => {
    const beam = render(<BorderBeam colorFrom="" colorTo="">Card</BorderBeam>)
    const ring = beam.container.firstElementChild!.lastElementChild as HTMLElement
    await waitFor(() => expect(ring.style.background).toContain("var(--primary) 360deg"))
    expect(ring.style.background).toContain("transparent 270deg")

    const glow = render(<GlowingBorder glowColor="" borderRadius="">Card</GlowingBorder>)
    const root = glow.container.firstElementChild as HTMLElement
    expect(root.style.borderRadius).toBe("0.5rem")
    expect((root.lastElementChild as HTMLElement).style.boxShadow).toContain("var(--primary)")
  })

  it("GlowCard and GlowContainer", () => {
    const card = render(<GlowCard glowColor="" hoverOnly={false}>Card</GlowCard>)
    const layer = card.container.firstElementChild!.firstElementChild as HTMLElement
    expect(layer.style.background).toContain("var(--primary)")
  })

  it("Spotlight and SpotlightCard", () => {
    const spot = render(<Spotlight color="">Panel</Spotlight>)
    expect(spot.container.querySelector<HTMLElement>(".rounded-full")!.style.background).toContain("var(--primary)")
    const card = render(<SpotlightCard spotlightColor="">Card</SpotlightCard>)
    fireEvent.mouseEnter(card.container.firstElementChild!)
    expect(card.container.querySelector<HTMLElement>(".rounded-full")!.style.background).toContain("var(--primary)")
  })

  it("AnimatedGradient: blank colours are dropped, an empty list uses the default", () => {
    const empty = render(<AnimatedGradient colors={[]} />)
    expect(empty.container.querySelectorAll(".rounded-full")).toHaveLength(4)
    const some = render(<AnimatedGradient colors={["", "red", " "]} />)
    const blobs = some.container.querySelectorAll<HTMLElement>(".rounded-full")
    expect(blobs).toHaveLength(1)
    expect(blobs[0]!.style.background).toBe("red")
  })

  it("TypewriterText: a blank cursorChar keeps the default cursor", () => {
    const { container } = render(<TypewriterText text="Hi" cursorChar="" />)
    expect(container.querySelector("[aria-hidden]")?.textContent).toBe("|")
  })
})

describe("Spotlight size", () => {
  // The light's centre is its translate plus its left offset plus half its size.
  const centreOf = (light: HTMLElement) => {
    const translate = Number(/translateX\((-?[\d.]+)px\)/.exec(light.style.transform)?.[1] ?? 0)
    return translate + parseFloat(light.style.left) + light.offsetWidth / 2
  }

  it("keeps the light centred on the pointer when size changes after the pointer moved", async () => {
    const widthSpy = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.classList.contains("rounded-full") ? parseFloat(this.style.width) : 400
    })
    try {
      const { container, rerender } = render(<Spotlight size={100}>Panel</Spotlight>)
      const root = container.firstElementChild!
      fireEvent.mouseMove(root, { clientX: 120, clientY: 60 })
      const light = () => container.querySelector<HTMLElement>(".rounded-full")!
      await waitFor(() => expect(Math.round(centreOf(light()))).toBe(120))
      rerender(<Spotlight size={300}>Panel</Spotlight>)
      await waitFor(() => expect(light().style.width).toBe("300px"))
      expect(Math.round(centreOf(light()))).toBe(120)
      expect(light().style.left).toBe("-150px")
    } finally {
      widthSpy.mockRestore()
    }
  })

  it("keeps the resting light at the container's centre when size changes", async () => {
    const widthSpy = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.classList.contains("rounded-full") ? parseFloat(this.style.width) : 400
    })
    try {
      const { container, rerender } = render(<Spotlight size={100}>Panel</Spotlight>)
      const light = () => container.querySelector<HTMLElement>(".rounded-full")!
      await waitFor(() => expect(Math.round(centreOf(light()))).toBe(200))
      rerender(<Spotlight size={300}>Panel</Spotlight>)
      await waitFor(() => expect(light().style.width).toBe("300px"))
      expect(Math.round(centreOf(light()))).toBe(200)
    } finally {
      widthSpy.mockRestore()
    }
  })
})

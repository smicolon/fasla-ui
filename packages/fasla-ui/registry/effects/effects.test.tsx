import { describe, it, expect, vi, afterEach } from "vitest"
import { act, fireEvent, render } from "@testing-library/react"
import { ShimmerButton } from "./shimmer-button/shimmer-button"
import { TypewriterText } from "./typewriter-text/typewriter-text"
import { SpotlightCard } from "./spotlight/spotlight"
import { GlowCard } from "./glow-card/glow-card"
import { BorderBeam } from "./border-beam/border-beam"

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

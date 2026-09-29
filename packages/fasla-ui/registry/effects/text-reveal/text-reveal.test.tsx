import { describe, it, expect, beforeAll } from "vitest"
import { render } from "@testing-library/react"
import { TextReveal, revealUnits } from "./text-reveal"

// framer-motion's useInView needs an observer, which jsdom does not provide.
beforeAll(() => {
  globalThis.IntersectionObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
})

describe("TextReveal units", () => {
  it("splits Latin text into characters", () => {
    expect(revealUnits("Hi there")).toEqual(["H", "i", " ", "t", "h", "e", "r", "e"])
  })

  it("keeps a combining mark with its letter", () => {
    expect(revealUnits("été")).toEqual(["é", "t", "é"])
  })

  it("splits Arabic into words, so the letters stay joined", () => {
    expect(revealUnits("مكوّن جاهز")).toEqual(["مكوّن", " ", "جاهز"])
  })

  it("renders one span per Arabic word", () => {
    const { container } = render(<TextReveal text="أطلق متجرك اليوم" triggerOnView={false} />)
    const spans = Array.from(container.querySelectorAll("span[aria-hidden]"), (span) => span.textContent)
    expect(spans).toEqual(["أطلق", "\u00A0", "متجرك", "\u00A0", "اليوم"])
  })

  it("gives assistive tech the whole text once", () => {
    const { container } = render(<TextReveal text="Hello" triggerOnView={false} />)
    expect(container.querySelector(".sr-only")?.textContent).toBe("Hello")
    expect(container.querySelectorAll("span[aria-hidden]")).toHaveLength(5)
  })
})

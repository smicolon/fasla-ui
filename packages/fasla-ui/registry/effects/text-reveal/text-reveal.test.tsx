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
    expect(spans).toEqual(["أطلق", "متجرك", "اليوم"])
  })

  it("gives assistive tech the whole text once", () => {
    const { container } = render(<TextReveal text="Hello" triggerOnView={false} />)
    expect(container.querySelector(".sr-only")?.textContent).toBe("Hello")
    expect(container.querySelectorAll("span[aria-hidden]")).toHaveLength(5)
  })

  it("keeps whitespace as plain text, so white-space rules apply as they do to the unanimated text", () => {
    const text = "أطلق  متجرك\nاليوم"
    const { container } = render(<TextReveal text={text} triggerOnView={false} className="whitespace-pre-wrap" />)
    const root = container.firstElementChild!
    const visible = Array.from(root.childNodes)
      .filter((node) => !(node instanceof HTMLElement && node.classList.contains("sr-only")))
      .map((node) => node.textContent)
      .join("")
    expect(visible).toBe(text)
    expect(root.querySelectorAll("span[aria-hidden]")).toHaveLength(3)
  })

  it("keeps a combining mark with its letter when Intl.Segmenter is missing", () => {
    const intl = Intl as unknown as { Segmenter?: unknown }
    const saved = intl.Segmenter
    delete intl.Segmenter
    try {
      expect(revealUnits("e\u0301te\u0300")).toEqual(["e\u0301", "t", "e\u0300"])
    } finally {
      intl.Segmenter = saved
    }
  })

  it("is exported from the effect's entry point", async () => {
    const entry = await import("./index")
    expect(entry.revealUnits).toBe(revealUnits)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { HeroMaskedTypeReveal } from "./hero-masked-type-reveal"
import { HeroScrambleDecode, heroScrambleDecodeCopy } from "./hero-scramble-decode"
import { HeroSplitFlapCounters, heroSplitFlapCountersCopy } from "./hero-split-flap-counters"
import { HeroVelocityMarquee, heroVelocityMarqueeCopy } from "./hero-velocity-marquee"
import { HeroVideoInType, heroVideoInTypeCopy } from "./hero-video-in-type"
import { HeroVideoSpotlight, heroVideoSpotlightCopy } from "./hero-video-spotlight"

/*
 * The six Hero Types that move. jsdom has no media queries, observers, Web
 * Animations or media playback, so each is stubbed: the tests check what the
 * blocks do with them (the finished state under reduced motion, the pause
 * control, a film that starts only when asked), not how the browser animates.
 */

type FakeAnimation = { playbackRate: number; pause: () => void; play: () => void; cancel: () => void; finished: Promise<void> }

let animations: FakeAnimation[]
let observers: { callback: IntersectionObserverCallback; observer: IntersectionObserver }[]
let playSpy: Mock<[], Promise<void>>
let pauseSpy: Mock<[], void>

/** Every media query answers `reduced` for reduced motion, and false otherwise. */
function setReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

/** Brings every observed block into view, as scrolling to it would. */
function scrollIntoView() {
  act(() => {
    for (const { callback, observer } of [...observers]) callback([{ isIntersecting: true } as IntersectionObserverEntry], observer)
  })
}

beforeEach(() => {
  animations = []
  observers = []
  globalThis.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) {
      observers.push({ callback, observer: this as unknown as IntersectionObserver })
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  Element.prototype.animate = vi.fn(() => {
    const animation: FakeAnimation = { playbackRate: 1, pause: vi.fn(), play: vi.fn(), cancel: vi.fn(), finished: Promise.resolve() }
    animations.push(animation)
    return animation as unknown as Animation
  })
  // A marquee row needs a width to scroll by; jsdom lays nothing out.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 600, height: 40, top: 0, left: 0, right: 600, bottom: 40, x: 0, y: 0, toJSON() {} } as DOMRect)
  // The pause button eases the row to a stop over a few frames; run them at once.
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((step) => {
    step(performance.now() + 1000)
    return 0
  })
  // Playback: `paused` follows play() and pause(), and each fires its event as a browser does.
  const paused = new WeakMap<HTMLMediaElement, boolean>()
  Object.defineProperty(HTMLMediaElement.prototype, "paused", { configurable: true, get() { return paused.get(this) ?? true } })
  playSpy = vi.fn(function (this: HTMLMediaElement) {
    paused.set(this, false)
    this.dispatchEvent(new Event("play"))
    return Promise.resolve()
  })
  pauseSpy = vi.fn(function (this: HTMLMediaElement) {
    paused.set(this, true)
    this.dispatchEvent(new Event("pause"))
  })
  HTMLMediaElement.prototype.play = playSpy as unknown as HTMLMediaElement["play"]
  HTMLMediaElement.prototype.pause = pauseSpy as unknown as HTMLMediaElement["pause"]
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const FILM = { src: "/film.mp4", type: "video/mp4" }

describe("Hero motion: under reduced motion each block shows its finished state", () => {
  beforeEach(() => setReducedMotion(true))

  it("Masked Type Reveal shows the whole word, with no sweep", () => {
    render(<HeroMaskedTypeReveal />)
    scrollIntoView()
    expect(Element.prototype.animate).not.toHaveBeenCalled()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/MAKE IT\s*MATTER/)
  })

  it("Scramble Decode shows the decoded headline and a full meter, with no scramble", () => {
    render(<HeroScrambleDecode />)
    scrollIntoView()
    const { lead, accent } = heroScrambleDecodeCopy.en.headline
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent(`${lead} ${accent}`)
    expect(heading.querySelector("[aria-hidden='true']")).toBeNull()
    expect(screen.getByText(String(heroScrambleDecodeCopy.en.decodedLabel), { exact: false })).toHaveTextContent("100%")
  })

  it("Split-Flap Counters show the final figures, with no flip", () => {
    const { container } = render(<HeroSplitFlapCounters />)
    scrollIntoView()
    expect(Element.prototype.animate).not.toHaveBeenCalled()
    const figures = Array.from(container.querySelectorAll(".sr-only"), (node) => node.textContent)
    for (const counter of heroSplitFlapCountersCopy.en.counters) expect(figures).toContain(counter.value)
  })

  it("Velocity Marquee keeps its rows still and offers no pause button", () => {
    render(<HeroVelocityMarquee />)
    expect(Element.prototype.animate).not.toHaveBeenCalled()
    expect(screen.queryByRole("button", { name: heroVelocityMarqueeCopy.en.pauseLabel })).toBeNull()
  })

  it("Video-in-Type holds the poster: the film never starts on its own", () => {
    render(<HeroVideoInType video={FILM} />)
    expect(playSpy).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: heroVideoInTypeCopy.en.playLabel })).toBeInTheDocument()
  })
})

describe("Hero motion: whatever keeps moving can be paused", () => {
  beforeEach(() => setReducedMotion(false))

  it("Velocity Marquee's button stops the rows and starts them again", () => {
    render(<HeroVelocityMarquee />)
    expect(animations.length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: heroVelocityMarqueeCopy.en.pauseLabel }))
    for (const animation of animations) expect(animation.playbackRate).toBe(0)
    fireEvent.click(screen.getByRole("button", { name: heroVelocityMarqueeCopy.en.playLabel }))
    for (const animation of animations) expect(animation.playbackRate).toBe(1)
  })

  it("Video-in-Type plays on its own, and its button pauses it and plays it again", () => {
    render(<HeroVideoInType video={FILM} />)
    expect(playSpy).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole("button", { name: heroVideoInTypeCopy.en.pauseLabel }))
    expect(pauseSpy).toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: heroVideoInTypeCopy.en.playLabel }))
    expect(playSpy).toHaveBeenCalledTimes(2)
  })
})

describe("Hero motion: Video Spotlight plays only when asked", () => {
  beforeEach(() => setReducedMotion(false))

  it("waits for the play button, then starts the film and moves focus to the player", () => {
    const { container } = render(<HeroVideoSpotlight video={FILM} />)
    expect(playSpy).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: heroVideoSpotlightCopy.en.playLabel }))
    expect(playSpy).toHaveBeenCalledTimes(1)
    const player = container.querySelector("video")
    expect(player).toHaveAttribute("controls")
    expect(document.activeElement).toBe(player)
  })

  it("asks for CORS when told to, so captions from another origin can load", () => {
    const { container } = render(
      <HeroVideoSpotlight
        video={{ ...FILM, crossOrigin: "anonymous" }}
        captions={[{ src: "https://cdn.example/film.vtt", srcLang: "en", label: "English" }]}
      />
    )
    expect(container.querySelector("video")).toHaveAttribute("crossorigin", "anonymous")
    expect(container.querySelector("track")).toHaveAttribute("src", "https://cdn.example/film.vtt")
  })
})

import { describe, it, expect, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { Isolated, SocialProofStars, STAGGERED_DRIFT_SPEED, WALL_DRIFT_SPEED, driftDuration, toColumns } from "./social-proof"
import { SocialProofClassicTrioGrid } from "../social-proof-classic-trio-grid/SocialProofClassicTrioGrid"
import { SocialProofVerticalColumnWall } from "../social-proof-vertical-column-wall/SocialProofVerticalColumnWall"
import { SocialProofTweetWall } from "../social-proof-tweet-wall/SocialProofTweetWall"
import { SocialProofAppReviewRow, socialProofAppReviewRowCopy } from "../social-proof-app-review-row/SocialProofAppReviewRow"
import { SocialProofHighlightedPhraseSpotlight } from "../social-proof-highlighted-phrase-spotlight/SocialProofHighlightedPhraseSpotlight"
import { SocialProofDarkEditorialSplit } from "../social-proof-dark-editorial-split/SocialProofDarkEditorialSplit"
import { SocialProofOverlayPhotoQuote } from "../social-proof-overlay-photo-quote/SocialProofOverlayPhotoQuote"
import { SocialProofSpotlightCarousel } from "../social-proof-spotlight-carousel/SocialProofSpotlightCarousel"
import { SocialProofAvatarSelectorRow } from "../social-proof-avatar-selector-row/SocialProofAvatarSelectorRow"
import { SocialProofProgressCarousel } from "../social-proof-progress-carousel/SocialProofProgressCarousel"
import { SocialProofPersonaPillars } from "../social-proof-persona-pillars/SocialProofPersonaPillars"
import { SocialProofWorkplacePortraitStories } from "../social-proof-workplace-portrait-stories/SocialProofWorkplacePortraitStories"
import { SocialProofStatStoryCards } from "../social-proof-stat-story-cards/SocialProofStatStoryCards"
import { SocialProofVideoStoryCards, socialProofVideoStoryCardsCopy } from "../social-proof-video-story-cards/SocialProofVideoStoryCards"
import { SocialProofCaseStudyRow } from "../social-proof-case-study-row/SocialProofCaseStudyRow"
import { SocialProofStaggeredColumns } from "../social-proof-staggered-columns/SocialProofStaggeredColumns"
import { SocialProofProofBento } from "../social-proof-proof-bento/SocialProofProofBento"

describe("Isolated", () => {
  it("sets every figure, handle and time in its own left-to-right run", () => {
    const { container } = render(
      <p>
        <Isolated>{"يعتمد على فاصلة أكثر من 2,300 فريق، بنسبة 28% و2.1× مع @Fasla في 2:14 والعدّاد 01 / 04"}</Isolated>
      </p>
    )
    expect([...container.querySelectorAll("bdi")].map((bdi) => [bdi.getAttribute("dir"), bdi.textContent])).toEqual([
      ["ltr", "2,300"],
      ["ltr", "28%"],
      ["ltr", "2.1×"],
      ["ltr", "@Fasla"],
      ["ltr", "2:14"],
      ["ltr", "01 / 04"],
    ])
    expect(container.textContent).toBe("يعتمد على فاصلة أكثر من 2,300 فريق، بنسبة 28% و2.1× مع @Fasla في 2:14 والعدّاد 01 / 04")
  })
})

describe("SocialProofStars", () => {
  it("draws five full stars under one accessible name, in each language", () => {
    const { rerender } = render(<SocialProofStars />)
    const stars = screen.getByRole("img", { name: "Rated 5 out of 5" })
    expect(stars.querySelectorAll("svg")).toHaveLength(5)
    rerender(<SocialProofStars locale="ar" />)
    expect(screen.getByRole("img", { name: "التقييم 5 من 5" })).toBeTruthy()
  })
})

describe("toColumns", () => {
  it("deals items into columns as Figma's walls do: runs for three, turns for two", () => {
    const items = [1, 2, 3, 4, 5, 6]
    expect(toColumns(items, 3)).toEqual([[1, 2], [3, 4], [5, 6]])
    expect(toColumns(items, 2)).toEqual([[1, 3, 5], [2, 4, 6]])
    expect(toColumns(items, 1)).toEqual([items])
  })
})

describe("Classic Trio Grid", () => {
  it("names the section by its heading and attributes every quote", () => {
    render(<SocialProofClassicTrioGrid />)
    expect(screen.getByRole("region", { name: "Loved by the teams that ship" })).toBeTruthy()
    expect([...document.querySelectorAll("figure cite")].map((cite) => cite.textContent)).toEqual(["Sami Naji", "Khalid Saad", "Rashed Al-Amri"])
  })
})

describe("Vertical Column Wall", () => {
  it("holds all twelve cards, each ready for the one-time reveal", () => {
    const { container } = render(<SocialProofVerticalColumnWall />)
    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(12)
  })
})

describe("Tweet Wall", () => {
  it("sets every mention in info, in its own left-to-right run", () => {
    const { container } = render(<SocialProofTweetWall locale="ar" />)
    const mentions = [...container.querySelectorAll("bdi.text-info")]
    expect(mentions).toHaveLength(6)
    expect(mentions.every((bdi) => bdi.textContent === "@Fasla" && bdi.getAttribute("dir") === "ltr")).toBe(true)
  })
})

describe("App Review Row", () => {
  it("disables both arrows when Figma's three reviews make one set", () => {
    render(<SocialProofAppReviewRow />)
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("steps to the next set of three and back, stopping at both ends", async () => {
    const reviews = socialProofAppReviewRowCopy.en.items
    const more = [...reviews, ...reviews.map((review) => ({ ...review, quote: `${review.handle} again` }))]
    render(<SocialProofAppReviewRow items={more} />)
    const previous = screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement
    const next = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement
    expect(previous.disabled).toBe(true)
    fireEvent.click(next)
    expect(await screen.findByText("· chicago_pm again")).toBeTruthy()
    expect(next.disabled).toBe(true)
    expect(previous.disabled).toBe(false)
    fireEvent.click(previous)
    expect(await screen.findByText(/Fasla Studio is flat-out awesome/)).toBeTruthy()
  })
})

describe("Highlighted-Phrase Spotlight", () => {
  it("marks each highlighted phrase whole, in both languages", () => {
    const { container, rerender } = render(<SocialProofHighlightedPhraseSpotlight />)
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual(["two design days a week", "finally feels finished"])
    rerender(<SocialProofHighlightedPhraseSpotlight locale="ar" />)
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual(["يومين من التصميم كل أسبوع", "يبدو مكتملًا"])
  })
})

describe("Photo slots", () => {
  it("leave the slot empty without a photo, and fill it with one", () => {
    const { container, rerender } = render(<SocialProofDarkEditorialSplit />)
    expect(container.querySelector("img")).toBeNull()
    rerender(<SocialProofDarkEditorialSplit photos={{ "yousef-amin": "/yousef.webp" }} />)
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/yousef.webp")
  })

  it("set Overlay Photo Quote's photograph from its own key", () => {
    const { container } = render(<SocialProofOverlayPhotoQuote photos={{ "overlay-photo-quote": "/office.webp" }} />)
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/office.webp")
    expect(screen.getByRole("region", { name: "What customers say" })).toBeTruthy()
  })
})

describe("Spotlight Carousel", () => {
  it("opens on the first quote with previous disabled, steps with next and the arrow keys, and stops at the end", async () => {
    render(<SocialProofSpotlightCarousel />)
    const previous = screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement
    const next = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement
    expect(previous.disabled).toBe(true)
    expect(screen.getByText(/Support tickets about visual bugs/)).toBeTruthy()
    fireEvent.click(next)
    expect(await screen.findByText(/turned our design language into a growth channel/)).toBeTruthy()
    fireEvent.keyDown(screen.getByRole("group", { name: "Quote 2 of 4" }), { key: "End" })
    expect(await screen.findByText(/set a new bar for quality/)).toBeTruthy()
    expect(next.disabled).toBe(true)
  })

  it("moves forward with the left arrow on an Arabic page", async () => {
    render(
      <div dir="rtl">
        <SocialProofSpotlightCarousel locale="ar" />
      </div>
    )
    fireEvent.keyDown(screen.getByRole("group", { name: "الاقتباس 1 من 4" }), { key: "ArrowLeft" })
    expect(await screen.findByText(/جعلت فاصلة هويتنا البصرية/)).toBeTruthy()
  })
})

describe("Avatar-Selector Row", () => {
  it("opens on Khalid Saad, and selecting another portrait shows that person's quote", () => {
    render(<SocialProofAvatarSelectorRow />)
    expect(screen.getByRole("tab", { name: /Khalid Saad/ }).getAttribute("aria-selected")).toBe("true")
    fireEvent.click(screen.getByRole("tab", { name: /Hani Jaber/ }))
    expect(screen.getByRole("tab", { name: /Hani Jaber/ }).getAttribute("aria-selected")).toBe("true")
    expect(screen.getByRole("tabpanel").textContent).toContain("You just have to build one screen")
  })
})

describe("Progress Carousel", () => {
  it("counts the story and steps the bar by a quarter, only when you navigate", async () => {
    render(<SocialProofProgressCarousel />)
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("25")
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(await screen.findByText("ARVENNA BANK")).toBeTruthy()
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50")
  })

  it("gives every story a photo key of its own", async () => {
    const photos = { "progress-carousel-1": "/one.webp", "progress-carousel-2": "/two.webp" }
    const { container } = render(<SocialProofProgressCarousel photos={photos} />)
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/one.webp")
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    await screen.findByText("ARVENNA BANK")
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/two.webp")
  })
})

describe("Persona Pillars", () => {
  it("opens on Engineers and widens the pillar you press into its quote", () => {
    render(<SocialProofPersonaPillars />)
    expect(screen.getByRole("button", { name: "Engineers", pressed: true })).toBeTruthy()
    fireEvent.click(screen.getAllByRole("button", { name: "Product" })[0]!)
    expect(screen.getByRole("button", { name: "Product", pressed: true })).toBeTruthy()
    expect(screen.getByText(/turned our design language into a growth channel/)).toBeTruthy()
  })
})

describe("Workplace Portrait Stories", () => {
  it("features Design leads first, and shows a benefit line only where Figma has one", () => {
    render(<SocialProofWorkplacePortraitStories />)
    expect(screen.getAllByText(/Give every squad the same tokens/).length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole("button", { name: "Founders" })[0]!)
    expect(screen.queryByText(/Give every squad the same tokens/)).toBeNull()
    expect(screen.getAllByText("Yousef Amin").length).toBeGreaterThan(0)
  })
})

describe("Stat-Story Cards", () => {
  it("shows the first set of three, and a dot pages to another set, manually", async () => {
    render(<SocialProofStatStoryCards />)
    expect(screen.getAllByRole("article")).toHaveLength(3)
    expect(screen.getByText("41%")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Set 2 of 3" }))
    expect(await screen.findByText(/We deleted forty thousand lines/)).toBeTruthy()
    expect(screen.queryByText("41%")).toBeNull()
  })

  it("moves between dots with the arrow keys, Home and End, and follows the page direction", async () => {
    render(
      <div dir="rtl">
        <SocialProofStatStoryCards locale="ar" />
      </div>
    )
    const group = screen.getByRole("group", { name: "مجموعات القصص" })
    fireEvent.keyDown(group, { key: "ArrowLeft" })
    expect(await screen.findByText(/حذفنا أربعين ألف سطر/)).toBeTruthy()
    fireEvent.keyDown(group, { key: "Home" })
    expect(await screen.findByText(/لم أدرك كم كلّفتنا الواجهات البطيئة/)).toBeTruthy()
    fireEvent.keyDown(group, { key: "End" })
    expect(await screen.findByText(/أنهينا الإعداد في صباح واحد/)).toBeTruthy()
  })
})

describe("Video Story Cards", () => {
  it("shows posters only until play is pressed, then plays that story and can close it", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve())
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
    const items = socialProofVideoStoryCardsCopy.en.items.map((item) => ({ ...item, videoSrc: "/film.mp4" }))
    const { container } = render(<SocialProofVideoStoryCards items={items} />)
    expect(container.querySelector("video")).toBeNull()
    fireEvent.click(screen.getAllByRole("button", { name: "Play" })[0]!)
    expect(container.querySelectorAll("video")).toHaveLength(1)
    expect(play).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole("button", { name: "Close video" }))
    expect(container.querySelector("video")).toBeNull()
    expect(screen.getAllByRole("button", { name: "Play" })).toHaveLength(2)
    play.mockRestore()
  })

  it("does nothing on play without a video", () => {
    const { container } = render(<SocialProofVideoStoryCards />)
    fireEvent.click(screen.getAllByRole("button", { name: "Play" })[0]!)
    expect(container.querySelector("video")).toBeNull()
  })
})

describe("Case-Study Row", () => {
  it("sets two case studies with their figures and links, and no controls but links", () => {
    render(<SocialProofCaseStudyRow />)
    expect(screen.getAllByRole("article")).toHaveLength(2)
    expect(screen.getByText("2.1×")).toBeTruthy()
    expect(screen.getAllByRole("link", { name: /Read more/ })).toHaveLength(2)
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })
})

describe("Proof Bento", () => {
  it("plays the video tile only when its button is pressed, and closes it", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve())
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
    const { container } = render(<SocialProofProofBento videoSrc="/film.mp4" />)
    expect(container.querySelector("video")).toBeNull()
    expect(screen.getByText((_, el) => el?.tagName === "P" && el.textContent === "Watch the story · 2:14")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(container.querySelector("video")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Close video" }))
    expect(container.querySelector("video")).toBeNull()
    play.mockRestore()
  })
})

/** Stubs the browser APIs the moving blocks use, and records what they were asked to do. */
function stubMotion({ reduced = false, width = 1300, height = 400 }: { reduced?: boolean; width?: number; height?: number } = {}) {
  const calls: { keyframes: Keyframe[]; options: KeyframeAnimationOptions; play: ReturnType<typeof vi.fn>; pause: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> }[] = []
  const animate = vi.fn(function (keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const call = { keyframes, options, play: vi.fn(), pause: vi.fn(), cancel: vi.fn() }
    calls.push(call)
    return { ...call, finished: Promise.resolve() } as unknown as Animation
  })
  Object.defineProperty(HTMLElement.prototype, "animate", { value: animate, configurable: true, writable: true })
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduced && query.includes("reduce"), addEventListener: () => {}, removeEventListener: () => {} }))
  let intersect: (visible: boolean) => void = () => {}
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        intersect = (visible) => callback([{ isIntersecting: visible }])
      }
      observe() {}
      disconnect() {}
    }
  )
  // jsdom lays nothing out: every element is `width` wide, and every column's first copy `height` tall.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width, height, x: 0, y: 0, top: 0, left: 0, right: width, bottom: height, toJSON: () => ({}) } as DOMRect)
  return {
    calls,
    intersect: (visible: boolean) => act(() => intersect(visible)),
    restore: () => {
      delete (HTMLElement.prototype as { animate?: unknown }).animate
      vi.unstubAllGlobals()
      vi.restoreAllMocks()
    },
  }
}

const translateXs = (calls: { keyframes: Keyframe[] }[]) => calls.map((call) => String(call.keyframes.map((k) => k.transform).find((x) => x && x !== "none") ?? "none"))

describe("Progress Carousel slides sideways", () => {
  it("slides the next story in from the right in LTR, and the old one out to the left", async () => {
    const motion = stubMotion()
    render(<SocialProofProgressCarousel />)
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    await screen.findByText("ARVENNA BANK")
    const moves = translateXs(motion.calls)
    expect(moves[0]).toBe("translateX(-24px)")
    expect(moves.at(-1)).toBe("translateX(24px)")
    fireEvent.click(screen.getByRole("button", { name: "Previous" }))
    await screen.findByText("BEACON ANALYTICS")
    expect(translateXs(motion.calls).slice(-3).includes("translateX(-24px)")).toBe(true)
    motion.restore()
  })

  it("mirrors it in RTL: next comes in from the left and the old story leaves to the right", async () => {
    const motion = stubMotion()
    render(
      <div dir="rtl">
        <SocialProofProgressCarousel locale="ar" />
      </div>
    )
    fireEvent.click(screen.getByRole("button", { name: "التالي" }))
    await screen.findByText("بنك أرفينا")
    const moves = translateXs(motion.calls)
    expect(moves[0]).toBe("translateX(24px)")
    expect(moves.at(-1)).toBe("translateX(-24px)")
    motion.restore()
  })

  it("uses opacity only with reduced motion", async () => {
    const motion = stubMotion({ reduced: true })
    render(<SocialProofProgressCarousel />)
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    await screen.findByText("ARVENNA BANK")
    expect(translateXs(motion.calls).every((x) => x === "none")).toBe(true)
    expect(motion.calls.every((call) => call.options.duration === 120)).toBe(true)
    motion.restore()
  })
})

describe("Vertical Column Wall drifts", () => {
  it("drifts three columns, the middle one the other way, only while in view, and pauses on hover and focus", () => {
    const motion = stubMotion()
    const { container } = render(<SocialProofVerticalColumnWall />)
    // The first pass runs before the width is measured, with one column; the last three are the real ones.
    const drift = motion.calls.filter((call) => call.options.iterations === Infinity).slice(-3)
    // One copy is 400px tall in this stub and the gap is 20, so a loop is 420px of travel.
    expect(drift.map((call) => [call.options.duration, call.options.direction])).toEqual([
      [(420 / WALL_DRIFT_SPEED.outer) * 1000, "normal"],
      [(420 / WALL_DRIFT_SPEED.middle) * 1000, "reverse"],
      [(420 / WALL_DRIFT_SPEED.outer) * 1000, "normal"],
    ])
    expect(drift.every((call) => (call.keyframes[1] as { transform: string }).transform === "translateY(-420px)")).toBe(true)
    expect(drift.every((call) => call.options.easing === "linear")).toBe(true)
    expect(drift.every((call) => call.pause.mock.calls.length > 0 && call.play.mock.calls.length === 0)).toBe(true)
    motion.intersect(true)
    expect(drift.every((call) => call.play.mock.calls.length > 0)).toBe(true)
    const root = container.querySelector("[data-drift]")!.parentElement!.parentElement!.parentElement!
    const playsBefore = drift[0]!.play.mock.calls.length
    fireEvent.pointerEnter(root)
    expect(drift[0]!.pause.mock.calls.length).toBeGreaterThan(1)
    fireEvent.pointerLeave(root)
    expect(drift[0]!.play.mock.calls.length).toBeGreaterThan(playsBefore)
    const pausesBefore = drift[0]!.pause.mock.calls.length
    fireEvent.focusIn(root)
    expect(drift[0]!.pause.mock.calls.length).toBeGreaterThan(pausesBefore)
    motion.intersect(false)
    motion.restore()
  })

  it("holds every card three times, the repeats hidden from assistive technology and out of the Tab order", () => {
    const motion = stubMotion()
    const { container } = render(<SocialProofVerticalColumnWall />)
    const lists = [...container.querySelectorAll("[data-drift] > ul")]
    expect(lists).toHaveLength(9)
    const repeats = lists.filter((list) => list.getAttribute("aria-hidden") === "true")
    expect(repeats).toHaveLength(6)
    expect(repeats.every((list) => list.hasAttribute("inert"))).toBe(true)
    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(12)
    expect(screen.getAllByText("“Rolled out across four product lines in one sprint.”")).toHaveLength(3)
    motion.restore()
  })

  it("stands still with reduced motion: no repeat, no drift", () => {
    const motion = stubMotion({ reduced: true })
    const { container } = render(<SocialProofVerticalColumnWall />)
    expect(container.querySelectorAll("[aria-hidden=true][inert]")).toHaveLength(0)
    expect(motion.calls.filter((call) => call.options.iterations === Infinity)).toHaveLength(0)
    motion.restore()
  })
})

describe("Reading speeds", () => {
  it("keeps the wall's middle column slower than its outer ones, near 40px per second", () => {
    expect(WALL_DRIFT_SPEED.middle).toBeLessThan(WALL_DRIFT_SPEED.outer)
    expect(WALL_DRIFT_SPEED.outer).toBeGreaterThanOrEqual(40)
    expect(WALL_DRIFT_SPEED.outer).toBeLessThanOrEqual(45)
    expect(WALL_DRIFT_SPEED.middle).toBeGreaterThanOrEqual(36)
    expect(STAGGERED_DRIFT_SPEED).toBe(40)
  })

  it("turns a distance and a speed into a duration", () => {
    expect(driftDuration(400, 40)).toBe(10000)
    expect(driftDuration(420, 42)).toBe(10000)
  })

  it("gives different loop heights the same speed", () => {
    const short = stubMotion({ height: 200 })
    const a = render(<SocialProofVerticalColumnWall />)
    const shortCall = short.calls.filter((call) => call.options.iterations === Infinity).slice(-3)[0]!
    a.unmount()
    short.restore()
    const tall = stubMotion({ height: 800 })
    render(<SocialProofVerticalColumnWall />)
    const tallCall = tall.calls.filter((call) => call.options.iterations === Infinity).slice(-3)[0]!
    expect((220 / (shortCall.options.duration as number)) * 1000).toBeCloseTo(WALL_DRIFT_SPEED.outer, 5)
    expect((820 / (tallCall.options.duration as number)) * 1000).toBeCloseTo(WALL_DRIFT_SPEED.outer, 5)
    tall.restore()
  })
})

describe("Staggered Columns drift", () => {
  it("drifts three columns one way each, up then down then up, at one speed, and two the same", () => {
    const motion = stubMotion({ width: 1300 })
    const { unmount } = render(<SocialProofStaggeredColumns />)
    // The first pass runs before the width is measured, with one column; the last three are the real ones.
    const wide = motion.calls.filter((call) => call.options.iterations === Infinity).slice(-3)
    // One copy is 400px tall in this stub and the gap is 24: 424px of travel.
    expect(wide.map((call) => [call.keyframes.map((k) => k.transform), call.options.direction])).toEqual([
      [["translateY(0)", "translateY(-424px)"], "normal"],
      [["translateY(0)", "translateY(-424px)"], "reverse"],
      [["translateY(0)", "translateY(-424px)"], "normal"],
    ])
    expect(wide.every((call) => call.options.easing === "linear" && call.options.duration === (424 / STAGGERED_DRIFT_SPEED) * 1000)).toBe(true)
    unmount()
    motion.restore()
    const tablet = stubMotion({ width: 700 })
    render(<SocialProofStaggeredColumns />)
    const two = tablet.calls.filter((call) => call.options.iterations === Infinity).slice(-2)
    expect(two.map((call) => call.options.direction)).toEqual(["normal", "reverse"])
    expect(two.every((call) => call.options.duration === (424 / STAGGERED_DRIFT_SPEED) * 1000)).toBe(true)
    tablet.restore()
  })

  it("keeps the resting stagger as a margin and holds every card twice, the repeat hidden and inert", () => {
    const motion = stubMotion({ width: 1300 })
    const { container } = render(<SocialProofStaggeredColumns />)
    const columns = [...container.querySelectorAll("[data-drift]")]
    expect(columns).toHaveLength(3)
    expect(columns.map((column) => column.parentElement!.classList.contains("mt-14"))).toEqual([false, true, false])
    const repeats = container.querySelectorAll("[data-drift] > ul[aria-hidden=true]")
    expect(repeats).toHaveLength(3)
    expect([...repeats].every((list) => list.hasAttribute("inert"))).toBe(true)
    expect(screen.getAllByText(/theming engine paid for itself/)).toHaveLength(2)
    motion.restore()
  })

  it("only runs while in view, and pauses on hover and while focus is inside", () => {
    const motion = stubMotion({ width: 1300 })
    const { container } = render(<SocialProofStaggeredColumns />)
    const drift = motion.calls.filter((call) => call.options.iterations === Infinity).slice(-3)
    expect(drift.every((call) => call.play.mock.calls.length === 0)).toBe(true)
    motion.intersect(true)
    expect(drift.every((call) => call.play.mock.calls.length > 0)).toBe(true)
    const root = container.querySelector("[data-drift]")!.parentElement!.parentElement!.parentElement!
    const plays = drift[0]!.play.mock.calls.length
    fireEvent.pointerEnter(root)
    const pauses = drift[0]!.pause.mock.calls.length
    fireEvent.pointerLeave(root)
    expect(drift[0]!.play.mock.calls.length).toBeGreaterThan(plays)
    fireEvent.focusIn(root)
    expect(drift[0]!.pause.mock.calls.length).toBeGreaterThan(pauses)
    motion.restore()
  })

  it("stays still on phones and with reduced motion, with no repeats", () => {
    const phone = stubMotion({ width: 330 })
    const first = render(<SocialProofStaggeredColumns />)
    expect(phone.calls.filter((call) => call.options.iterations === Infinity)).toHaveLength(0)
    expect(first.container.querySelectorAll("[aria-hidden=true][inert]")).toHaveLength(0)
    first.unmount()
    phone.restore()
    const reduced = stubMotion({ reduced: true })
    const second = render(<SocialProofStaggeredColumns />)
    expect(reduced.calls.filter((call) => call.options.iterations === Infinity)).toHaveLength(0)
    expect(second.container.querySelectorAll("[aria-hidden=true][inert]")).toHaveLength(0)
    reduced.restore()
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { AboutImpactStatsBand } from "./AboutImpactStatsBand"

// jsdom has no media playback.
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe("AboutImpactStatsBand video", () => {
  it("shows the play chip only when a video is supplied", () => {
    render(<AboutImpactStatsBand />)
    expect(screen.queryByRole("button", { name: "Play video" })).toBeNull()
  })

  it("starts over when the video is removed and another one is supplied", () => {
    const { container, rerender } = render(<AboutImpactStatsBand videoSrc="/first.mp4" />)
    const chip = screen.getByRole("button", { name: "Play video" })
    expect(chip.getAttribute("aria-pressed")).toBe("false")

    fireEvent.click(chip)
    expect(chip.getAttribute("aria-pressed")).toBe("true")
    expect(container.querySelector("video")?.getAttribute("src")).toBe("/first.mp4")

    rerender(<AboutImpactStatsBand />)
    expect(screen.queryByRole("button", { name: "Play video" })).toBeNull()
    expect(container.querySelector("video")).toBeNull()

    rerender(<AboutImpactStatsBand videoSrc="/second.mp4" />)
    expect(screen.getByRole("button", { name: "Play video" }).getAttribute("aria-pressed")).toBe("false")
    expect(container.querySelector("video")).toBeNull()
  })

  it("starts over when one video is swapped for another", () => {
    const { container, rerender } = render(<AboutImpactStatsBand videoSrc="/first.mp4" />)
    fireEvent.click(screen.getByRole("button", { name: "Play video" }))
    rerender(<AboutImpactStatsBand videoSrc="/second.mp4" />)
    expect(screen.getByRole("button", { name: "Play video" }).getAttribute("aria-pressed")).toBe("false")
    expect(container.querySelector("video")).toBeNull()
  })
})

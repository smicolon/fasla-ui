import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MahaamMotionToggle } from "./mahaam-motion-toggle"

afterEach(cleanup)

describe("MahaamMotionToggle", () => {
  it("is Pause while the page plays", () => {
    render(<MahaamMotionToggle paused={false} />)
    expect(screen.getByRole("button", { name: "Pause animation" })).toBeTruthy()
  })

  it("is Play while the page is paused", () => {
    render(<MahaamMotionToggle paused />)
    expect(screen.getByRole("button", { name: "Play animation" })).toBeTruthy()
  })

  it("sets no aria-pressed, so the changing name is the only announcement of the state", () => {
    const { rerender } = render(<MahaamMotionToggle paused={false} />)
    expect(screen.getByRole("button").hasAttribute("aria-pressed")).toBe(false)
    rerender(<MahaamMotionToggle paused />)
    expect(screen.getByRole("button").hasAttribute("aria-pressed")).toBe(false)
  })

  it("tells onPausedChange the new state", () => {
    const onPausedChange = vi.fn()
    const { rerender } = render(<MahaamMotionToggle paused={false} onPausedChange={onPausedChange} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onPausedChange).toHaveBeenLastCalledWith(true)
    rerender(<MahaamMotionToggle paused onPausedChange={onPausedChange} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onPausedChange).toHaveBeenLastCalledWith(false)
  })

  it("is named in Arabic in the Arabic locale, and takes its own names", () => {
    const { rerender } = render(<MahaamMotionToggle paused={false} locale="ar" />)
    expect(screen.getByRole("button", { name: "إيقاف الحركة مؤقتًا" })).toBeTruthy()
    rerender(<MahaamMotionToggle paused locale="ar" />)
    expect(screen.getByRole("button", { name: "تشغيل الحركة" })).toBeTruthy()
    rerender(<MahaamMotionToggle paused={false} labels={{ pause: "Stop" }} />)
    expect(screen.getByRole("button", { name: "Stop" })).toBeTruthy()
  })
})

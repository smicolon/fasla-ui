import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MahaamMotionToggle } from "./mahaam-motion-toggle"

afterEach(cleanup)

describe("MahaamMotionToggle", () => {
  it("is Pause while the page plays, and not pressed", () => {
    render(<MahaamMotionToggle paused={false} />)
    const button = screen.getByRole("button", { name: "Pause animation" })
    expect(button.getAttribute("aria-pressed")).toBe("false")
  })

  it("is Play while the page is paused, and pressed", () => {
    render(<MahaamMotionToggle paused />)
    const button = screen.getByRole("button", { name: "Play animation" })
    expect(button.getAttribute("aria-pressed")).toBe("true")
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

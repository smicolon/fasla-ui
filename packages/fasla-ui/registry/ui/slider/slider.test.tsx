import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { Slider } from "./slider"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine, so nothing here proves where a thumb lands, how
 * tall the track is or which side the fill starts on. Those were measured in
 * a real browser in both directions: 6/8/12px tracks, a 16px thumb inside the
 * track's ends, the fill starting at the left in English and at the right in
 * Arabic. The visual tests below assert the classes only.
 */

/**
 * The thumbs' range inputs. With the thumbs held inside the track's ends
 * (Base UI's `thumbAlignment="edge"`), Base UI hides a thumb until it has
 * measured the track, which jsdom never lays out, so the queries include
 * hidden elements. In a browser the thumbs show on first paint.
 */
const getThumbs = () => screen.getAllByRole("slider", { hidden: true })
const getThumb = () => screen.getByRole("slider", { hidden: true })
const slot = (name: string) => document.querySelector<HTMLElement>(`[data-slot=${name}]`)
const slots = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-slot=${name}]`)]

describe("Slider — semantics", () => {
  it("is a slider with its value and range", () => {
    render(<Slider defaultValue={40} aria-label="Volume" />)
    const thumb = getThumb()
    // jsdom computes no name for a hidden element, so the label is read off the input.
    expect(thumb).toHaveAttribute("aria-label", "Volume")
    expect(thumb).toHaveAttribute("aria-valuenow", "40")
    expect(thumb).toHaveAttribute("min", "0")
    expect(thumb).toHaveAttribute("max", "100")
  })

  it("takes min, max and step", () => {
    render(<Slider defaultValue={250} min={100} max={1000} step={50} aria-label="Budget" />)
    const thumb = getThumb()
    expect(thumb).toHaveAttribute("aria-valuenow", "250")
    expect(thumb).toHaveAttribute("min", "100")
    expect(thumb).toHaveAttribute("max", "1000")
    expect(thumb).toHaveAttribute("step", "50")
  })

  it("renders one thumb for a number and two for a range", () => {
    const { unmount } = render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(getThumbs()).toHaveLength(1)
    unmount()

    render(<Slider defaultValue={[20, 80]} getAriaLabel={(i) => (i === 0 ? "Minimum price" : "Maximum price")} />)
    const [start, end] = getThumbs()
    expect(start).toHaveAttribute("aria-label", "Minimum price")
    expect(start).toHaveAttribute("aria-valuenow", "20")
    expect(end).toHaveAttribute("aria-label", "Maximum price")
    expect(end).toHaveAttribute("aria-valuenow", "80")
  })

  it("reads a range's values as the number alone, not English 'start range'", () => {
    render(<Slider defaultValue={[20, 80]} getAriaLabel={(i) => `Thumb ${i}`} />)
    const [start, end] = getThumbs()
    expect(start).toHaveAttribute("aria-valuetext", "20")
    expect(end).toHaveAttribute("aria-valuetext", "80")
  })

  it("takes custom value text", () => {
    render(
      <Slider
        defaultValue={250}
        max={1000}
        aria-label="Budget"
        getAriaValueText={(formatted) => `SAR ${formatted}`}
      />
    )
    expect(getThumb()).toHaveAttribute("aria-valuetext", "SAR 250")
  })

  it("formats with Latin digits by default, on an Arabic page too", () => {
    render(
      <div dir="rtl" lang="ar">
        <Slider defaultValue={[1500, 3000]} max={5000} getAriaLabel={() => "السعر"} />
      </div>
    )
    expect(getThumbs()[0]).toHaveAttribute("aria-valuetext", "1,500")
  })

  it("submits its value with a form under name", () => {
    render(
      <form data-testid="form">
        <Slider name="volume" defaultValue={30} aria-label="Volume" />
      </form>
    )
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.get("volume")).toBe("30")
  })
})

describe("Slider — keyboard", () => {
  it("raises and lowers the value with the arrow keys", () => {
    const onValueChange = vi.fn()
    render(<Slider defaultValue={50} aria-label="Volume" onValueChange={onValueChange} />)
    const thumb = getThumb()
    fireEvent.keyDown(thumb, { key: "ArrowRight" })
    expect(thumb).toHaveAttribute("aria-valuenow", "51")
    fireEvent.keyDown(thumb, { key: "ArrowLeft" })
    fireEvent.keyDown(thumb, { key: "ArrowLeft" })
    expect(thumb).toHaveAttribute("aria-valuenow", "49")
    expect(onValueChange).toHaveBeenLastCalledWith(49, expect.anything())
  })

  it("mirrors the left and right arrows on a right-to-left page", () => {
    render(
      <div dir="rtl">
        <Slider defaultValue={50} aria-label="الصوت" />
      </div>
    )
    const thumb = getThumb()
    fireEvent.focus(thumb)
    // The fill grows to the left in Arabic, so the left arrow raises the value.
    fireEvent.keyDown(thumb, { key: "ArrowLeft" })
    expect(thumb).toHaveAttribute("aria-valuenow", "51")
    fireEvent.keyDown(thumb, { key: "ArrowRight" })
    fireEvent.keyDown(thumb, { key: "ArrowRight" })
    expect(thumb).toHaveAttribute("aria-valuenow", "49")
    // Up and Down do not depend on direction.
    fireEvent.keyDown(thumb, { key: "ArrowUp" })
    expect(thumb).toHaveAttribute("aria-valuenow", "50")
  })

  it("picks up a direction that changes after mount", async () => {
    const { container } = render(
      <div dir="ltr">
        <Slider defaultValue={50} aria-label="Volume" />
      </div>
    )
    // MutationObserver callbacks run as a microtask; act() lets the re-render land.
    await act(async () => {
      ;(container.firstElementChild as HTMLElement).setAttribute("dir", "rtl")
    })
    const thumb = getThumb()
    fireEvent.keyDown(thumb, { key: "ArrowLeft" })
    expect(thumb).toHaveAttribute("aria-valuenow", "51")
  })

  it("jumps to the ends with Home and End", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    const thumb = getThumb()
    fireEvent.keyDown(thumb, { key: "End" })
    expect(thumb).toHaveAttribute("aria-valuenow", "100")
    fireEvent.keyDown(thumb, { key: "Home" })
    expect(thumb).toHaveAttribute("aria-valuenow", "0")
  })
})

describe("Slider — look", () => {
  it("names its layers as Figma does", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(slot("slider")).not.toBeNull()
    expect(slot("slider-control")).not.toBeNull()
    expect(slot("slider-track")).not.toBeNull()
    expect(slot("slider-indicator")).not.toBeNull()
    expect(slots("slider-thumb")).toHaveLength(1)
  })

  it("defaults to md, an 8px track", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(slot("slider")).toHaveAttribute("data-size", "md")
    expect(slot("slider-track")).toHaveClass("h-2")
  })

  it.each([
    ["sm", "h-1.5"],
    ["md", "h-2"],
    ["lg", "h-3"],
  ] as const)("size %s sets the track to %s and keeps the 16px thumb", (size, height) => {
    render(<Slider size={size} defaultValue={50} aria-label="Volume" />)
    expect(slot("slider-track")).toHaveClass(height)
    expect(slot("slider-control")).toHaveClass("h-4")
    expect(slot("slider-thumb")).toHaveClass("size-4")
  })

  it("colours every part with tokens: muted track, primary fill, background thumb with a primary border", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(slot("slider-track")).toHaveClass("bg-muted", "rounded-full")
    expect(slot("slider-indicator")).toHaveClass("bg-primary")
    expect(slot("slider-thumb")).toHaveClass("bg-background", "border", "border-primary", "rounded-full", "shadow")
  })

  it("shows keyboard focus as a 4px ring at 50% in place of the shadow", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(slot("slider-thumb")).toHaveClass(
      "data-[focus-visible]:ring-4",
      "data-[focus-visible]:ring-ring/50",
      "data-[focus-visible]:shadow-none"
    )
  })

  it("marks a thumb data-focus-visible while its input shows focus, and clears it on blur", () => {
    render(<Slider defaultValue={[20, 80]} getAriaLabel={(i) => `Thumb ${i}`} />)
    const [start, end] = getThumbs()
    const [startThumb, endThumb] = slots("slider-thumb")
    act(() => start!.focus())
    expect(startThumb).toHaveAttribute("data-focus-visible")
    expect(endThumb).not.toHaveAttribute("data-focus-visible")
    act(() => end!.focus())
    expect(startThumb).not.toHaveAttribute("data-focus-visible")
    expect(endThumb).toHaveAttribute("data-focus-visible")
  })

  it("gives the thumb a 24px hit area without growing it", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(slot("slider-thumb")).toHaveClass("size-4", "before:absolute", "before:-inset-1")
  })

  it("centres the thumb by the real direction in CSS, before the page runs", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />)
    expect(slot("slider-thumb")).toHaveClass("![translate:-50%_-50%]", "[&:dir(rtl)]:![translate:50%_-50%]")
  })

  it("adds className to the root", () => {
    render(<Slider defaultValue={50} aria-label="Volume" className="max-w-xs" />)
    expect(slot("slider")).toHaveClass("max-w-xs", "w-full")
  })

  it("forwards its ref to the root", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Slider ref={ref} defaultValue={50} aria-label="Volume" />)
    expect(ref.current).toBe(slot("slider"))
  })
})

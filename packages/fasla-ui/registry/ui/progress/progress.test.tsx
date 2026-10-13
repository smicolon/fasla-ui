import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Progress } from "./progress"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine, so nothing here proves where the indicator
 * starts, how tall the track is or where the label lands. Those were measured
 * in a real browser in both directions: 6/8/12px tracks, 32/38/44px label
 * columns, an 8px gap, the fill starting at the left in English and at the
 * right in Arabic, with the label before the bar in both. The visual tests
 * below assert the classes and inline styles only.
 */

const bar = () => screen.getByRole("progressbar")
const slot = (name: string) => document.querySelector<HTMLElement>(`[data-slot=${name}]`)

describe("Progress — semantics", () => {
  it("is a progressbar with its value and range", () => {
    render(<Progress value={40} aria-label="Uploading report" />)
    const el = bar()
    expect(el).toHaveAccessibleName("Uploading report")
    expect(el).toHaveAttribute("aria-valuenow", "40")
    expect(el).toHaveAttribute("aria-valuemin", "0")
    expect(el).toHaveAttribute("aria-valuemax", "100")
    expect(el).toHaveAttribute("aria-valuetext", "40%")
  })

  it("hides the visible percentage from assistive tech, so it is read once", () => {
    render(<Progress value={40} aria-label="Uploading report" />)
    const label = slot("percentage")!
    expect(label).toHaveTextContent("40%")
    expect(label).toHaveAttribute("aria-hidden", "true")
    // Only the progressbar's own value text carries the number.
    expect(screen.queryByText("40%", { ignore: "[aria-hidden=true]" })).toBeNull()
  })

  it("accepts any value, not only 5% steps", () => {
    render(<Progress value={33.4} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("aria-valuenow", "33.4")
    expect(slot("indicator")!.style.width).toBe("33.4%")
    expect(slot("percentage")).toHaveTextContent("33%")
  })

  it("clamps values outside 0 to 100", () => {
    const { rerender } = render(<Progress value={140} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("aria-valuenow", "100")
    expect(slot("indicator")!.style.width).toBe("100%")
    expect(slot("percentage")).toHaveTextContent("100%")

    rerender(<Progress value={-20} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("aria-valuenow", "0")
    expect(slot("indicator")!.style.width).toBe("0%")
    expect(slot("percentage")).toHaveTextContent("0%")
  })

  it("starts at 0 when no value is given", () => {
    render(<Progress aria-label="Sync" />)
    expect(bar()).toHaveAttribute("aria-valuenow", "0")
    expect(slot("indicator")!.style.width).toBe("0%")
  })

  it("marks complete at 100 and progressing below it", () => {
    const { rerender } = render(<Progress value={100} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("data-complete")
    rerender(<Progress value={99} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("data-progressing")
  })

  it("keeps Latin digits on an Arabic page, as Figma's RTL variants do", () => {
    render(
      <div dir="rtl" lang="ar">
        <Progress value={50} aria-label="رفع الملف" />
      </div>
    )
    expect(slot("percentage")).toHaveTextContent("50%")
    expect(bar()).toHaveAttribute("aria-valuetext", "50%")
  })

  it("lets an app replace the spoken value", () => {
    render(<Progress value={3} aria-label="Steps" getAriaValueText={(_, v) => `Step ${v} of 5`} />)
    expect(bar()).toHaveAttribute("aria-valuetext", "Step 3 of 5")
  })

  it("forwards its ref to the progressbar", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={10} aria-label="Sync" />)
    expect(ref.current).toBe(bar())
  })
})

describe("Progress — showPercentage", () => {
  it("shows the label by default, as Figma's Show Percentage does", () => {
    render(<Progress value={25} aria-label="Sync" />)
    expect(slot("percentage")).not.toBeNull()
  })

  it("drops the label, and its gap, when off", () => {
    render(<Progress value={25} showPercentage={false} aria-label="Sync" />)
    expect(slot("percentage")).toBeNull()
    // The track is then the row's only child, so the 8px gap draws nothing.
    expect(bar().children[0]).toBe(slot("track"))
  })

  it("puts the label before the bar, so it sits at the inline start in both directions", () => {
    render(<Progress value={25} aria-label="Sync" />)
    const children = [...bar().children]
    expect(children.indexOf(slot("percentage")!)).toBeLessThan(children.indexOf(slot("track")!))
  })
})

describe("Progress — layers and sizes (Figma)", () => {
  it("names its layers as Figma does", () => {
    render(<Progress value={50} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("data-slot", "progress")
    expect(slot("track")).not.toBeNull()
    expect(slot("indicator")!.parentElement).toBe(slot("track"))
  })

  it("fills its container and keeps an 8px gap", () => {
    render(<Progress value={50} aria-label="Sync" className="max-w-xs" />)
    expect(bar()).toHaveClass("flex", "w-full", "items-center", "gap-2", "max-w-xs")
  })

  it.each([
    ["sm", "h-1.5", "w-8", "text-xs"],
    ["md", "h-2", "w-[2.375rem]", "text-sm"],
    ["lg", "h-3", "w-11", "text-base"],
  ] as const)("%s: track %s, label column %s, %s", (size, height, width, text) => {
    render(<Progress value={50} size={size} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("data-size", size)
    expect(slot("track")).toHaveClass(height)
    expect(slot("percentage")).toHaveClass(width, text, "font-medium", "text-end", "tabular-nums")
  })

  it("is md by default", () => {
    render(<Progress value={50} aria-label="Sync" />)
    expect(bar()).toHaveAttribute("data-size", "md")
    expect(slot("track")).toHaveClass("h-2")
  })

  it("draws a round track in primary at 20% that clips a primary indicator", () => {
    render(<Progress value={50} aria-label="Sync" />)
    expect(slot("track")).toHaveClass("rounded-full", "overflow-hidden", "bg-primary/20")
    expect(slot("indicator")).toHaveClass("h-full", "bg-primary")
    expect(slot("percentage")).toHaveClass("text-foreground")
  })

  it("positions the indicator with logical properties only", () => {
    render(<Progress value={50} aria-label="Sync" />)
    const style = slot("indicator")!.getAttribute("style") ?? ""
    expect(style).toContain("inset-inline-start: 0")
    expect(style).not.toMatch(/\b(left|right)\s*:/)
  })

  it("stays visible in forced colors, where the browser drops both fills", () => {
    render(<Progress value={50} aria-label="Sync" />)
    expect(slot("track")).toHaveClass("forced-colors:outline", "forced-colors:outline-[CanvasText]")
    expect(slot("indicator")).toHaveClass("forced-colors:bg-[CanvasText]")
  })

  it("turns off its width transition under reduced motion", () => {
    render(<Progress value={50} aria-label="Sync" />)
    expect(slot("indicator")).toHaveClass("transition-[width]", "motion-reduce:transition-none")
  })
})

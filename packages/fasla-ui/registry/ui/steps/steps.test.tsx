import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { Steps, StepsItem, fitHorizontalSteps, stepEndInset, type StepStatus, type StepsProps } from "./steps"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine, so nothing here proves where the tail sits or
 * how a long label lies under its bullet. Those were measured in a real
 * browser, in both directions: a 38px bullet, the tail on the bullet's centre
 * with 8px at each end, the label 10px from the bullet, and the first and last
 * labels inside the list. The visual tests below assert the classes only.
 */

const FLOW: { status: StepStatus; label: string }[] = [
  { status: "done", label: "Account" },
  { status: "current", label: "Shipping" },
  { status: "upcoming", label: "Payment" },
]

function Flow(props: StepsProps) {
  return (
    <Steps aria-label="Checkout" {...props}>
      {FLOW.map((step) => (
        <StepsItem key={step.label} status={step.status} label={step.label} />
      ))}
    </Steps>
  )
}

const items = () => screen.getAllByRole("listitem")
const slot = (el: HTMLElement | undefined, name: string) => el!.querySelector<HTMLElement>(`[data-slot=${name}]`)

describe("Steps — semantics", () => {
  it("is an ordered list with one item per step", () => {
    render(<Flow />)
    const list = screen.getByRole("list", { name: "Checkout" })
    expect(list.tagName).toBe("OL")
    expect(items()).toHaveLength(3)
  })

  it("marks only the current step with aria-current=step", () => {
    render(<Flow />)
    const [done, current, upcoming] = items()
    expect(current).toHaveAttribute("aria-current", "step")
    expect(done).not.toHaveAttribute("aria-current")
    expect(upcoming).not.toHaveAttribute("aria-current")
  })

  it("says the status after the label in English, and in Arabic under lang=ar", () => {
    render(<Flow />)
    const [done, current, upcoming] = items()
    expect(done).toHaveTextContent("Account, completed")
    expect(within(done!).getByText("، مكتملة")).toHaveClass("hidden", "[&:lang(ar)]:inline")
    expect(upcoming).toHaveTextContent("Payment, not started")
    // The current step says nothing extra: aria-current announces it.
    expect(current!.textContent).toBe("2Shipping")
  })

  it("takes a custom status label, or none", () => {
    render(
      <Steps>
        <StepsItem status="done" label="Account" statusLabel=" (done)" />
        <StepsItem status="upcoming" label="Payment" statusLabel="" />
      </Steps>
    )
    const [done, upcoming] = items()
    expect(done!.textContent).toBe("1Account (done)")
    expect(upcoming!.textContent).toBe("2Payment")
  })

  it("hides the bullet and the tail from assistive tech", () => {
    render(<Flow />)
    for (const item of items()) {
      expect(slot(item, "step-icon")).toHaveAttribute("aria-hidden", "true")
      const tail = slot(item, "step-tail")
      if (tail) expect(tail).toHaveAttribute("aria-hidden", "true")
    }
  })
})

describe("Steps — content", () => {
  it("numbers the steps from 1, in Western digits", () => {
    render(<Flow />)
    expect(items().map((item) => slot(item, "step-icon")!.textContent)).toEqual(["1", "2", "3"])
  })

  it("counts steps written with a map or one by one alike", () => {
    render(
      <Steps>
        <StepsItem label="One" />
        {["Two", "Three"].map((label) => (
          <StepsItem key={label} label={label} />
        ))}
      </Steps>
    )
    expect(items().map((item) => slot(item, "step-icon")!.textContent)).toEqual(["1", "2", "3"])
  })

  it("counts steps grouped in a fragment one by one", () => {
    render(
      <Steps>
        <StepsItem label="One" />
        <>
          <StepsItem label="Two" />
          <StepsItem label="Three" />
        </>
      </Steps>
    )
    expect(items().map((item) => slot(item, "step-icon")!.textContent)).toEqual(["1", "2", "3"])
    expect(items().map((item) => slot(item, "step-tail") !== null)).toEqual([true, true, false])
  })

  it("shows the check instead of the number with icon", () => {
    render(
      <Steps>
        <StepsItem status="done" icon label="Account" />
      </Steps>
    )
    const icon = slot(items()[0], "step-icon")!
    expect(icon.textContent).toBe("")
    expect(icon.querySelector("svg")).toHaveClass("size-[1.375rem]")
  })

  it("shows the description only when given", () => {
    render(
      <Steps>
        <StepsItem label="Account" description="Email and password" />
        <StepsItem label="Payment" />
      </Steps>
    )
    const [withText, without] = items()
    expect(slot(withText, "step-description")).toHaveTextContent("Email and password")
    expect(slot(without, "step-description")).toBeNull()
  })

  it("draws a tail on every step but the last", () => {
    render(<Flow />)
    expect(items().map((item) => slot(item, "step-tail") !== null)).toEqual([true, true, false])
  })

  it("draws no tail on a single step", () => {
    render(
      <Steps>
        <StepsItem label="Only" />
      </Steps>
    )
    expect(slot(items()[0], "step-tail")).toBeNull()
  })
})

describe("Steps — look", () => {
  it("colours each bullet by its status, with the tokens Figma binds", () => {
    render(<Flow />)
    const [done, current, upcoming] = items().map((item) => slot(item, "step-icon")!)
    expect(done).toHaveClass("bg-primary", "text-primary-foreground", "shadow")
    expect(current).toHaveClass("border-primary", "text-primary")
    expect(upcoming).toHaveClass("border-border", "text-card-foreground")
  })

  it("colours each tail by its own step's status", () => {
    render(<Flow />)
    const [done, current] = items()
      .slice(0, 2)
      .map((item) => slot(item, "step-tail")!.firstElementChild!)
    expect(done).toHaveClass("bg-primary")
    expect(current).toHaveClass("bg-border")
  })

  it("rounds every bullet by the list's radius", () => {
    const { rerender } = render(<Flow />)
    for (const item of items()) expect(slot(item, "step-icon")).toHaveClass("rounded-[var(--radius-md)]")
    rerender(<Flow radius="rounded" />)
    for (const item of items()) expect(slot(item, "step-icon")).toHaveClass("rounded-full")
  })

  it("lays the steps in a row with the label under the bullet, or a column with it beside", () => {
    const { rerender } = render(<Flow />)
    const list = screen.getByRole("list")
    expect(list).toHaveAttribute("data-orientation", "horizontal")
    expect(list).not.toHaveClass("flex-col")
    expect(slot(items()[0], "step-details")!.contains(slot(items()[0], "step-text"))).toBe(true)
    expect(slot(items()[0], "step-tail")).toHaveClass("h-[2.375rem]", "px-2")

    rerender(<Flow orientation="vertical" />)
    expect(list).toHaveAttribute("data-orientation", "vertical")
    expect(list).toHaveClass("flex-col")
    const first = items()[0]
    expect(slot(first, "step-details")!.contains(slot(first, "step-text"))).toBe(false)
    expect(slot(first, "step-details")!.contains(slot(first, "step-tail"))).toBe(true)
    expect(slot(first, "step-tail")).toHaveClass("min-h-[2.875rem]", "py-2")
  })

  it("lets every step but the last share the space", () => {
    render(<Flow />)
    expect(items().map((item) => item.classList.contains("flex-1"))).toEqual([true, true, false])
  })

  it("centres every horizontal label under its own bullet, the first and last too", () => {
    render(<Flow />)
    for (const item of items()) {
      expect(slot(item, "step-text")!.parentElement).toHaveClass("justify-center")
      expect(slot(item, "step-text")).toHaveClass("w-max", "shrink-0", "text-center")
    }
  })

  it("insets the list's ends on the first and last steps only, horizontally", () => {
    const { rerender } = render(<Flow />)
    const inset = (item: HTMLElement | undefined) =>
      [stepEndInset.start, stepEndInset.end].filter((c) => item!.classList.contains(c))
    expect(items().map(inset)).toEqual([[stepEndInset.start], [], [stepEndInset.end]])

    rerender(<Flow orientation="vertical" />)
    expect(items().map(inset)).toEqual([[], [], []])
  })

  it("tells the labels how many steps and tails share the row", () => {
    render(<Flow />)
    const list = screen.getByRole("list")
    expect(list.style.getPropertyValue("--steps-count")).toBe("3")
    expect(list.style.getPropertyValue("--steps-tails")).toBe("2")
  })

  it("merges className on the list and on a step", () => {
    render(
      <Steps className="max-w-md">
        <StepsItem label="One" className="custom" />
      </Steps>
    )
    expect(screen.getByRole("list")).toHaveClass("max-w-md", "flex")
    expect(items()[0]).toHaveClass("custom", "flex")
  })
})

describe("Steps — fitting a horizontal row to its labels", () => {
  const row = { bullet: 38, gap: 16 }
  const pitch = (width: number, count: number, f: { start: number; end: number }) =>
    (width - f.start - f.end - row.bullet) / (count - 1)

  it("insets nothing for labels no wider than their bullets", () => {
    const fitted = fitHorizontalSteps({ ...row, width: 400, count: 3, first: 32, last: 38 })
    expect(fitted.start).toBe(0)
    expect(fitted.end).toBe(0)
    // Each label may reach halfway to its neighbours' bullets, less 8px on each side.
    expect(fitted.cap).toBeCloseTo((400 - 38) / 2 - 16, 3)
  })

  it("insets each end by as far as its own label reaches past the bullet", () => {
    const fitted = fitHorizontalSteps({ ...row, width: 440, count: 3, first: 48, last: 90 })
    expect(fitted.start).toBeCloseTo(5, 3)
    expect(fitted.end).toBeCloseTo(26, 3)
    expect(fitted.cap).toBeCloseTo(pitch(440, 3, fitted) - 16, 3)
  })

  it("holds a label wider than its room to that room, and insets for the held width", () => {
    const fitted = fitHorizontalSteps({ ...row, width: 300, count: 3, first: 400, last: 40 })
    expect(fitted.start).toBeCloseTo((fitted.cap - 38) / 2, 3)
    expect(fitted.cap).toBeCloseTo(pitch(300, 3, fitted) - 16, 3)
    // The first label, held to `cap` and centred, starts exactly at the row's start.
    expect(fitted.start + 19 - fitted.cap / 2).toBeCloseTo(0, 3)
  })

  it("centres a single step's label in its own room", () => {
    const fitted = fitHorizontalSteps({ ...row, width: 300, count: 1, first: 80, last: 80 })
    expect(fitted.start).toBe(21)
    expect(fitted.end).toBe(21)
  })
})

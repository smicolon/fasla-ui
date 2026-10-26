import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { Steps, StepsItem, type StepStatus, type StepsProps } from "./steps"

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

  it("shows the check instead of the number with icon", () => {
    render(
      <Steps>
        <StepsItem status="done" icon label="Account" />
      </Steps>
    )
    const icon = slot(items()[0], "step-icon")!
    expect(icon.textContent).toBe("")
    expect(icon.querySelector("svg")).toHaveClass("size-[22px]")
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
    expect(slot(items()[0], "step-tail")).toHaveClass("h-[38px]", "px-2")

    rerender(<Flow orientation="vertical" />)
    expect(list).toHaveAttribute("data-orientation", "vertical")
    expect(list).toHaveClass("flex-col")
    const first = items()[0]
    expect(slot(first, "step-details")!.contains(slot(first, "step-text"))).toBe(false)
    expect(slot(first, "step-details")!.contains(slot(first, "step-tail"))).toBe(true)
    expect(slot(first, "step-tail")).toHaveClass("min-h-[46px]", "py-2")
  })

  it("lets every step but the last share the space", () => {
    render(<Flow />)
    expect(items().map((item) => item.classList.contains("flex-1"))).toEqual([true, true, false])
  })

  it("keeps the first and last horizontal labels inside the list", () => {
    render(<Flow />)
    const justify = items().map((item) => slot(item, "step-text")!.parentElement!.className)
    expect(justify[0]).toContain("justify-start")
    expect(justify[1]).toContain("justify-center")
    expect(justify[2]).toContain("justify-end")
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

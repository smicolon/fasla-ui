import { describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Figures } from "./pricing"
import { PricingTiers } from "../pricing-tiers/PricingTiers"
import { PricingPlanSpotlight } from "../pricing-plan-spotlight/PricingPlanSpotlight"
import { PricingPlanPickerSummary } from "../pricing-plan-picker-summary/PricingPlanPickerSummary"
import { PricingComparisonMatrix } from "../pricing-comparison-matrix/PricingComparisonMatrix"

describe("Figures", () => {
  it("isolates every figure in its own left-to-right run, and leaves a trailing % outside it", () => {
    const { container } = render(
      <p>
        <Figures>{"8 مقاعد × $29 × 12 شهرًا · وفّر 17%"}</Figures>
      </p>
    )
    const runs = [...container.querySelectorAll("bdi")].map((bdi) => [bdi.getAttribute("dir"), bdi.textContent])
    expect(runs).toEqual([
      ["ltr", "8"],
      ["ltr", "$29"],
      ["ltr", "12"],
      ["ltr", "17"],
    ])
    expect(container.textContent).toBe("8 مقاعد × $29 × 12 شهرًا · وفّر 17%")
  })

  it("keeps figures joined by a slash in one run, so 24/7 is not read back as 7/24", () => {
    const { container } = render(<Figures>{"دعم محادثة 24/7"}</Figures>)
    expect([...container.querySelectorAll("bdi")].map((bdi) => bdi.textContent)).toEqual(["24/7"])
  })
})

describe("Pricing Tiers", () => {
  it("opens on Yearly, and the toggle swaps every price and its note", () => {
    render(<PricingTiers />)
    expect(screen.getByRole("tab", { name: "Yearly" }).getAttribute("aria-selected")).toBe("true")
    expect(screen.getByText("$24")).toBeTruthy()
    fireEvent.click(screen.getByRole("tab", { name: "Monthly" }))
    expect(screen.getByText("$29")).toBeTruthy()
    expect(screen.queryByText("$24")).toBeNull()
    expect(screen.getAllByText("Billed monthly")).toHaveLength(3)
  })
})

describe("Plan Spotlight", () => {
  it("names the chosen option on its button", () => {
    render(<PricingPlanSpotlight />)
    expect(screen.getByRole("button", { name: "Continue with Yearly" })).toBeTruthy()
    fireEvent.click(screen.getByRole("radio", { name: "Monthly" }))
    expect(screen.getByRole("button", { name: "Continue with Monthly" })).toBeTruthy()
  })
})

describe("Plan Picker + Summary", () => {
  it("shows Figma's Growth sums, and the chosen plan's when another is picked", () => {
    // A figure is its own isolate, so "$2,784.00" and "/yr" are separate text nodes: read the summary's text.
    render(<PricingPlanPickerSummary />)
    const summary = () => screen.getByRole("complementary").textContent
    expect(summary()).toContain("$2,784.00/yr")
    expect(summary()).toContain("–$480.00")
    expect(summary()).toContain("$2,304.00")
    fireEvent.click(screen.getByRole("radio", { name: "Starter" }))
    expect(summary()).toContain("$1,152.00/yr")
    expect(summary()).toContain("$960.00")
  })

  it("passes the code typed to onApplyDiscount", () => {
    let applied: [string, string] | undefined
    render(<PricingPlanPickerSummary onApplyDiscount={(code, plan) => (applied = [code, plan])} />)
    fireEvent.change(screen.getByRole("textbox", { name: "Discount code" }), { target: { value: "LAUNCH" } })
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(applied).toEqual(["LAUNCH", "growth"])
  })
})

describe("Comparison Matrix", () => {
  it("names each check and minus for assistive tech", () => {
    const { container } = render(<PricingComparisonMatrix />)
    const table = container.querySelector("table")!
    const row = [...table.querySelectorAll("tr")].find((tr) => tr.querySelector("th")?.textContent === "API access")!
    expect([...row.querySelectorAll("td")].map((td) => td.textContent)).toEqual(["Not included", "Not included", "Included", "Included"])
  })
})

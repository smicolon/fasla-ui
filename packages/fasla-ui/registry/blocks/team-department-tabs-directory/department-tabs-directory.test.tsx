import { afterEach, describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { TeamDepartmentTabsDirectory } from "./TeamDepartmentTabsDirectory"

const cards = () => screen.getAllByRole("listitem")

afterEach(() => {
  // @ts-expect-error -- remove the mock
  delete Element.prototype.animate
})

describe("Team Department Tabs Directory", () => {
  it("names the section by its h2 and starts on All with eight cards", () => {
    const { container } = render(<TeamDepartmentTabsDirectory />)
    const heading = screen.getByRole("heading", { level: 2, name: "Find the person you need" })
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["All", "Design", "Engineering", "Product", "People"])
    expect(screen.getByRole("tab", { name: "All" }).getAttribute("aria-selected")).toBe("true")
    expect(cards()).toHaveLength(8)
  })

  it("filters the cards by tab, and All brings them back", () => {
    render(<TeamDepartmentTabsDirectory />)
    fireEvent.click(screen.getByRole("tab", { name: "Engineering" }))
    expect(cards().map((card) => card.textContent)).toEqual([
      expect.stringContaining("Tomas Vidal"),
      expect.stringContaining("Grace Okafor"),
    ])
    expect(screen.getByText("Lukas Berg").closest("li")?.hidden).toBe(true)
    fireEvent.click(screen.getByRole("tab", { name: "All" }))
    expect(cards()).toHaveLength(8)
  })

  it("is controllable, and reports a change", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<TeamDepartmentTabsDirectory value="design" onValueChange={onValueChange} />)
    expect(cards()).toHaveLength(2)
    fireEvent.click(screen.getByRole("tab", { name: "Product" }))
    expect(onValueChange).toHaveBeenCalledWith("product")
    expect(cards()).toHaveLength(2)
    rerender(<TeamDepartmentTabsDirectory value="product" onValueChange={onValueChange} />)
    expect(screen.getByText("Omar Nasser")).toBeTruthy()
    expect(screen.getByText("Lukas Berg").closest("li")?.hidden).toBe(true)
  })

  it("starts on defaultValue", () => {
    render(<TeamDepartmentTabsDirectory defaultValue="people" />)
    expect(screen.getByRole("tab", { name: "People" }).getAttribute("aria-selected")).toBe("true")
    expect(cards()).toHaveLength(2)
  })

  it("renders Figma's Arabic copy", () => {
    render(<TeamDepartmentTabsDirectory locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: "اعرف الشخص المناسب" })).toBeTruthy()
    expect(screen.getByRole("tab", { name: "الكل" })).toBeTruthy()
    expect(cards()).toHaveLength(8)
  })

  it("cross-fades the cards that leave and enter, through the Web Animations API", () => {
    const animate = vi.fn(() => ({ onfinish: null }))
    Element.prototype.animate = animate as unknown as typeof Element.prototype.animate
    render(<TeamDepartmentTabsDirectory />)
    expect(animate).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("tab", { name: "Design" }))
    const calls = animate.mock.calls as unknown as [Keyframe[]][]
    // Six cards fade out; the two that stay do not fade (a single column in jsdom does not move them).
    expect(calls.filter(([frames]) => frames[0]?.opacity === 1)).toHaveLength(6)
    fireEvent.click(screen.getByRole("tab", { name: "All" }))
    expect(calls.filter(([frames]) => frames[0]?.opacity === 0)).toHaveLength(6)
  })

  it("moves the sliding underline to the active tab", () => {
    const { container } = render(<TeamDepartmentTabsDirectory />)
    expect(container.querySelector('[data-slot="tab-underline"]')).toBeTruthy()
  })
})

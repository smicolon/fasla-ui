import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Radio } from "./radio"

describe("Radio", () => {
  it("renders a radio input", () => {
    render(<Radio aria-label="Option A" />)
    expect(screen.getByRole("radio")).toBeInTheDocument()
  })

  it("is unchecked by default and reflects defaultChecked", () => {
    const { rerender } = render(<Radio aria-label="Option A" />)
    expect(screen.getByRole("radio")).not.toBeChecked()

    rerender(<Radio aria-label="Option A" defaultChecked />)
    expect(screen.getByRole("radio")).toBeChecked()
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<Radio size="sm" label="Small" />)
    expect(screen.getByRole("radio").nextElementSibling).toHaveClass("size-4")

    rerender(<Radio size="md" label="Medium" />)
    expect(screen.getByRole("radio").nextElementSibling).toHaveClass("size-5")

    rerender(<Radio size="lg" label="Large" />)
    expect(screen.getByRole("radio").nextElementSibling).toHaveClass("size-6")
  })

  it("renders the layout variant with a border", () => {
    const { rerender } = render(<Radio label="Default" data-testid="radio" />)
    expect(screen.getByTestId("radio").closest("label")).not.toHaveClass("border")

    rerender(<Radio variant="layout" label="Layout" data-testid="radio" />)
    expect(screen.getByTestId("radio").closest("label")).toHaveClass("border")
  })

  it("defaults to the default variant when variant is omitted", () => {
    render(<Radio label="Option" data-testid="radio" />)
    expect(screen.getByTestId("radio").closest("label")).not.toHaveClass(
      "border"
    )
  })

  it("rejects null as a variant", () => {
    // @ts-expect-error `variant` is declared on RadioProps rather than
    // inherited from CVA's VariantProps, which widens every variant with
    // `| null` and shows a meaningless third option in the Storybook control.
    render(<Radio label="Option" variant={null} data-testid="radio" />)
    expect(screen.getByTestId("radio")).toBeInTheDocument()
  })

  it("associates the label so clicking it selects the radio", () => {
    render(<Radio label="Express delivery" />)
    fireEvent.click(screen.getByText("Express delivery"))
    expect(screen.getByRole("radio")).toBeChecked()
  })

  it("links the description via aria-describedby", () => {
    render(<Radio label="Express" description="Arrives tomorrow" />)
    expect(screen.getByRole("radio")).toHaveAccessibleDescription(
      "Arrives tomorrow"
    )
  })

  it("renders no text column when label and description are omitted", () => {
    render(<Radio aria-label="Bare" />)
    expect(screen.getByRole("radio").parentElement?.childElementCount).toBe(2)
  })

  it("selects only one radio per name group", () => {
    render(
      <>
        <Radio name="plan" value="a" label="Plan A" />
        <Radio name="plan" value="b" label="Plan B" />
      </>
    )
    const radios = screen.getAllByRole("radio")
    const a = radios[0]!
    const b = radios[1]!

    fireEvent.click(a)
    expect(a).toBeChecked()
    expect(b).not.toBeChecked()

    fireEvent.click(b)
    expect(a).not.toBeChecked()
    expect(b).toBeChecked()
  })

  it("handles onChange", () => {
    const handleChange = vi.fn()
    render(<Radio label="Option" onChange={handleChange} />)

    fireEvent.click(screen.getByRole("radio"))
    expect(handleChange).toHaveBeenCalled()
  })

  it("is disabled when disabled prop is true", () => {
    render(<Radio label="Option" disabled />)
    expect(screen.getByRole("radio")).toBeDisabled()
    expect(screen.getByRole("radio").closest("label")).toHaveClass(
      "has-[:disabled]:opacity-50"
    )
  })

  it("applies custom className to the root", () => {
    render(<Radio label="Option" className="custom-class" />)
    expect(screen.getByRole("radio").closest("label")).toHaveClass(
      "custom-class"
    )
  })

  it("forwards ref correctly", () => {
    const ref = vi.fn()
    render(<Radio aria-label="Option" ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Input } from "./input"

describe("Input", () => {
  it("renders with default props", () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument()
  })

  it("renders with different variants", () => {
    const { rerender } = render(<Input variant="default" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("border-input")

    rerender(<Input variant="error" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("border-destructive")

    rerender(<Input variant="success" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("border-green-500")
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<Input inputSize="sm" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("h-8")

    rerender(<Input inputSize="default" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("h-9")

    rerender(<Input inputSize="lg" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("h-11")
  })

  it("renders with start icon", () => {
    render(
      <Input
        startIcon={<span data-testid="start-icon">🔍</span>}
        data-testid="input"
      />
    )
    expect(screen.getByTestId("start-icon")).toBeInTheDocument()
    expect(screen.getByTestId("input")).toHaveClass("pl-10")
  })

  it("renders with end icon", () => {
    render(
      <Input
        endIcon={<span data-testid="end-icon">✓</span>}
        data-testid="input"
      />
    )
    expect(screen.getByTestId("end-icon")).toBeInTheDocument()
    expect(screen.getByTestId("input")).toHaveClass("pr-10")
  })

  it("handles onChange", () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} data-testid="input" />)

    fireEvent.change(screen.getByTestId("input"), { target: { value: "test" } })
    expect(handleChange).toHaveBeenCalled()
  })

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId("input")).toBeDisabled()
  })

  it("applies custom className", () => {
    render(<Input className="custom-class" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})

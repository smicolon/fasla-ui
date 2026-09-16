import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders with default props", () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText("Default")).toBeInTheDocument()
  })

  it("renders with default variant styling", () => {
    render(<Badge data-testid="badge">Default</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("bg-primary")
  })

  it("renders with different variants", () => {
    const { rerender } = render(<Badge variant="default" data-testid="badge">Default</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("bg-primary")

    rerender(<Badge variant="secondary" data-testid="badge">Secondary</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("bg-secondary")

    rerender(<Badge variant="destructive" data-testid="badge">Destructive</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("bg-destructive")

    rerender(<Badge variant="outline" data-testid="badge">Outline</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("text-foreground")

    rerender(<Badge variant="success" data-testid="badge">Success</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("bg-green-500")

    rerender(<Badge variant="warning" data-testid="badge">Warning</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("bg-yellow-500")
  })

  it("applies custom className", () => {
    render(<Badge className="custom-class" data-testid="badge">Badge</Badge>)
    expect(screen.getByTestId("badge")).toHaveClass("custom-class")
  })

  it("renders with base styling classes", () => {
    render(<Badge data-testid="badge">Badge</Badge>)
    const badge = screen.getByTestId("badge")
    expect(badge).toHaveClass("inline-flex", "items-center", "rounded-md", "border", "px-2.5", "py-0.5", "text-xs", "font-semibold")
  })

  it("passes additional props to underlying element", () => {
    render(<Badge data-testid="badge" aria-label="status badge">Status</Badge>)
    expect(screen.getByTestId("badge")).toHaveAttribute("aria-label", "status badge")
  })
})

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { EmptyState, EmptySearchResults, EmptyData } from "./EmptyState"

describe("EmptyState", () => {
  it("renders with required title prop", () => {
    render(<EmptyState title="No items found" />)
    expect(screen.getByText("No items found")).toBeInTheDocument()
  })

  it("renders with description", () => {
    render(
      <EmptyState
        title="No items"
        description="Start by adding your first item"
      />
    )
    expect(screen.getByText("Start by adding your first item")).toBeInTheDocument()
  })

  it("renders with icon", () => {
    render(
      <EmptyState
        title="Empty"
        icon={<span data-testid="icon">📭</span>}
      />
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("renders with action", () => {
    render(
      <EmptyState
        title="No items"
        action={<button>Add Item</button>}
      />
    )
    expect(screen.getByRole("button", { name: "Add Item" })).toBeInTheDocument()
  })

  it("renders with secondary action", () => {
    render(
      <EmptyState
        title="No items"
        action={<button>Primary</button>}
        secondaryAction={<button>Secondary</button>}
      />
    )
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument()
  })

  it("renders with small size", () => {
    render(<EmptyState title="Empty" size="sm" data-testid="empty" />)
    expect(screen.getByTestId("empty")).toHaveClass("py-8")
  })

  it("renders with default size", () => {
    render(<EmptyState title="Empty" size="default" data-testid="empty" />)
    expect(screen.getByTestId("empty")).toHaveClass("py-12")
  })

  it("renders with large size", () => {
    render(<EmptyState title="Empty" size="lg" data-testid="empty" />)
    expect(screen.getByTestId("empty")).toHaveClass("py-16")
  })

  it("applies custom className", () => {
    render(<EmptyState title="Empty" className="custom-class" data-testid="empty" />)
    expect(screen.getByTestId("empty")).toHaveClass("custom-class")
  })
})

describe("EmptySearchResults", () => {
  it("renders with default no results message", () => {
    render(<EmptySearchResults />)
    expect(screen.getByText("No results found")).toBeInTheDocument()
  })

  it("renders with query in description", () => {
    render(<EmptySearchResults query="test search" />)
    expect(screen.getByText('No results for "test search". Try a different search term.')).toBeInTheDocument()
  })

  it("renders without query showing generic message", () => {
    render(<EmptySearchResults />)
    expect(screen.getByText("Try adjusting your search or filters.")).toBeInTheDocument()
  })

  it("renders search icon", () => {
    const { container } = render(<EmptySearchResults />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})

describe("EmptyData", () => {
  it("renders with default resource name", () => {
    render(<EmptyData />)
    expect(screen.getByText("No items yet")).toBeInTheDocument()
    expect(screen.getByText("Get started by creating your first item.")).toBeInTheDocument()
  })

  it("renders with custom resource name", () => {
    render(<EmptyData resourceName="projects" />)
    expect(screen.getByText("No projects yet")).toBeInTheDocument()
    expect(screen.getByText("Get started by creating your first project.")).toBeInTheDocument()
  })

  it("renders with action passed through", () => {
    render(<EmptyData action={<button>Create</button>} />)
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument()
  })

  it("renders document icon", () => {
    const { container } = render(<EmptyData />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})

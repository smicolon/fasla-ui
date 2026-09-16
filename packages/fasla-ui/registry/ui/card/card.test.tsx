import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"

describe("Card", () => {
  it("renders Card with children", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("renders Card with correct base classes", () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId("card")
    expect(card).toHaveClass("rounded-xl", "border", "bg-card", "shadow")
  })

  it("applies custom className to Card", () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>)
    expect(screen.getByTestId("card")).toHaveClass("custom-class")
  })

  it("forwards ref to Card", () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Content</Card>)
    expect(ref).toHaveBeenCalled()
  })
})

describe("CardHeader", () => {
  it("renders CardHeader with children", () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText("Header content")).toBeInTheDocument()
  })

  it("renders CardHeader with correct classes", () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId("header")).toHaveClass("flex", "flex-col", "p-6")
  })

  it("applies custom className to CardHeader", () => {
    render(<CardHeader className="custom-class" data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId("header")).toHaveClass("custom-class")
  })
})

describe("CardTitle", () => {
  it("renders CardTitle with children", () => {
    render(<CardTitle>My Title</CardTitle>)
    expect(screen.getByText("My Title")).toBeInTheDocument()
  })

  it("renders CardTitle with correct classes", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId("title")).toHaveClass("font-semibold", "leading-none")
  })
})

describe("CardDescription", () => {
  it("renders CardDescription with children", () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText("Description text")).toBeInTheDocument()
  })

  it("renders CardDescription with correct classes", () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId("desc")).toHaveClass("text-sm", "text-muted-foreground")
  })
})

describe("CardContent", () => {
  it("renders CardContent with children", () => {
    render(<CardContent>Content here</CardContent>)
    expect(screen.getByText("Content here")).toBeInTheDocument()
  })

  it("renders CardContent with correct classes", () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId("content")).toHaveClass("p-6", "pt-0")
  })
})

describe("CardFooter", () => {
  it("renders CardFooter with children", () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText("Footer content")).toBeInTheDocument()
  })

  it("renders CardFooter with correct classes", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId("footer")).toHaveClass("flex", "items-center", "p-6", "pt-0")
  })
})

describe("Full Card composition", () => {
  it("renders a complete card with all parts", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    )

    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card description")).toBeInTheDocument()
    expect(screen.getByText("Main content")).toBeInTheDocument()
    expect(screen.getByText("Footer actions")).toBeInTheDocument()
  })
})

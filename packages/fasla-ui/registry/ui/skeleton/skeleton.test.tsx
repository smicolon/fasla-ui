import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from "./skeleton"

describe("Skeleton", () => {
  it("renders with default props", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toBeInTheDocument()
  })

  it("renders with animation by default", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("animate-pulse")
  })

  it("can disable animation", () => {
    render(<Skeleton animate={false} data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).not.toHaveClass("animate-pulse")
  })

  it("renders with default variant (rounded-md)", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("rounded-md")
  })

  it("renders with circular variant", () => {
    render(<Skeleton variant="circular" data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("rounded-full")
  })

  it("renders with rectangular variant", () => {
    render(<Skeleton variant="rectangular" data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("rounded-none")
  })

  it("applies custom className", () => {
    render(<Skeleton className="h-10 w-20" data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("h-10", "w-20")
  })
})

describe("SkeletonText", () => {
  it("renders with default 3 lines", () => {
    render(<SkeletonText data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    expect(container.children).toHaveLength(3)
  })

  it("renders with specified number of lines", () => {
    render(<SkeletonText lines={5} data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    expect(container.children).toHaveLength(5)
  })

  it("last line is shorter when multiple lines", () => {
    render(<SkeletonText lines={3} data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    const lastLine = container.children[2]
    expect(lastLine).toHaveClass("w-4/5")
  })

  it("single line is full width", () => {
    render(<SkeletonText lines={1} data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    const line = container.children[0]
    expect(line).toHaveClass("w-full")
  })
})

describe("SkeletonAvatar", () => {
  it("renders with circular variant", () => {
    render(<SkeletonAvatar data-testid="skeleton-avatar" />)
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass("rounded-full")
  })

  it("renders with default size", () => {
    render(<SkeletonAvatar data-testid="skeleton-avatar" />)
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass("h-10", "w-10")
  })

  it("accepts custom className to override size", () => {
    render(<SkeletonAvatar className="h-16 w-16" data-testid="skeleton-avatar" />)
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass("h-16", "w-16")
  })
})

describe("SkeletonCard", () => {
  it("renders a card container", () => {
    render(<SkeletonCard data-testid="skeleton-card" />)
    expect(screen.getByTestId("skeleton-card")).toHaveClass("rounded-xl", "border", "bg-card", "shadow")
  })

  it("contains an avatar skeleton", () => {
    const { container } = render(<SkeletonCard />)
    const avatars = container.querySelectorAll(".rounded-full")
    expect(avatars.length).toBeGreaterThan(0)
  })

  it("contains text skeletons", () => {
    const { container } = render(<SkeletonCard />)
    const skeletons = container.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

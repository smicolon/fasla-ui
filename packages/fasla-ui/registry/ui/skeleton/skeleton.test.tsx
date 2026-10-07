import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonListItem,
  SkeletonCard,
} from "./skeleton"

describe("Skeleton", () => {
  it("renders with default props", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toBeInTheDocument()
  })

  it("uses the secondary token, as Figma does", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("bg-secondary")
  })

  it("pulses by default, only when motion is allowed", () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId("skeleton")
    expect(skeleton).toHaveClass("motion-safe:animate-pulse")
    expect(skeleton).not.toHaveClass("animate-pulse")
  })

  it("can disable animation", () => {
    render(<Skeleton animate={false} data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).not.toHaveClass("motion-safe:animate-pulse")
  })

  it("renders with default variant (4px radius)", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveClass("rounded")
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

  it("lets className override the radius", () => {
    render(<Skeleton className="rounded-lg" data-testid="skeleton" />)
    const skeleton = screen.getByTestId("skeleton")
    expect(skeleton).toHaveClass("rounded-lg")
    expect(skeleton).not.toHaveClass("rounded")
  })

  it("is hidden from assistive technology", () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true")
  })

  it("forwards a ref to the element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} data-testid="skeleton" />)
    expect(ref.current).toBe(screen.getByTestId("skeleton"))
  })
})

describe("SkeletonText", () => {
  it("renders 2 lines by default, as Figma does", () => {
    render(<SkeletonText data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    expect(container.children).toHaveLength(2)
  })

  it("renders with specified number of lines", () => {
    render(<SkeletonText lines={5} data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    expect(container.children).toHaveLength(5)
  })

  it("makes every line a full-width 16px bar", () => {
    render(<SkeletonText lines={3} data-testid="skeleton-text" />)
    const lines = Array.from(screen.getByTestId("skeleton-text").children)
    for (const line of lines) expect(line).toHaveClass("h-4", "w-full")
  })

  it("stacks lines 8px apart", () => {
    render(<SkeletonText data-testid="skeleton-text" />)
    expect(screen.getByTestId("skeleton-text")).toHaveClass("flex", "flex-col", "gap-2")
  })

  it("passes animate to every line", () => {
    render(<SkeletonText animate={false} data-testid="skeleton-text" />)
    const lines = Array.from(screen.getByTestId("skeleton-text").children)
    for (const line of lines) expect(line).not.toHaveClass("motion-safe:animate-pulse")
  })

  it("keeps animate and variant off the DOM", () => {
    render(<SkeletonText animate variant="circular" data-testid="skeleton-text" />)
    const container = screen.getByTestId("skeleton-text")
    expect(container).not.toHaveAttribute("animate")
    expect(container).not.toHaveAttribute("variant")
  })

  it("keeps variant off the DOM in the list item and card too", () => {
    render(
      <>
        <SkeletonListItem variant="circular" data-testid="list-item" />
        <SkeletonCard variant="circular" data-testid="card" />
      </>
    )
    expect(screen.getByTestId("list-item")).not.toHaveAttribute("variant")
    expect(screen.getByTestId("card")).not.toHaveAttribute("variant")
  })
})

describe("SkeletonAvatar", () => {
  it("renders with circular variant", () => {
    render(<SkeletonAvatar data-testid="skeleton-avatar" />)
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass("rounded-full")
  })

  it("renders at 48px by default", () => {
    render(<SkeletonAvatar data-testid="skeleton-avatar" />)
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass("h-12", "w-12")
  })

  it("accepts custom className to override size", () => {
    render(<SkeletonAvatar className="h-16 w-16" data-testid="skeleton-avatar" />)
    const avatar = screen.getByTestId("skeleton-avatar")
    expect(avatar).toHaveClass("h-16", "w-16")
    expect(avatar).not.toHaveClass("h-12", "w-12")
  })
})

describe("SkeletonListItem", () => {
  it("puts the avatar first, then the lines, 16px apart", () => {
    render(<SkeletonListItem data-testid="skeleton-list-item" />)
    const row = screen.getByTestId("skeleton-list-item")
    expect(row).toHaveClass("flex", "items-center", "gap-4")
    expect(row.children[0]).toHaveClass("rounded-full", "h-12", "w-12")
    expect(row.children[1]!.children).toHaveLength(2)
  })

  it("accepts lines", () => {
    render(<SkeletonListItem lines={3} data-testid="skeleton-list-item" />)
    expect(screen.getByTestId("skeleton-list-item").children[1]!.children).toHaveLength(3)
  })

  it("passes animate to every block", () => {
    const { container } = render(<SkeletonListItem animate={false} />)
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3)
    expect(container.querySelectorAll(".motion-safe\\:animate-pulse")).toHaveLength(0)
  })

  it("is hidden from assistive technology", () => {
    render(<SkeletonListItem data-testid="skeleton-list-item" />)
    expect(screen.getByTestId("skeleton-list-item")).toHaveAttribute("aria-hidden", "true")
  })
})

describe("SkeletonCard", () => {
  it("has no card surface of its own", () => {
    render(<SkeletonCard data-testid="skeleton-card" />)
    const card = screen.getByTestId("skeleton-card")
    expect(card).toHaveClass("flex", "flex-col", "gap-4")
    expect(card).not.toHaveClass("border", "bg-card", "shadow")
  })

  it("puts a 122px media block above 2 lines", () => {
    render(<SkeletonCard data-testid="skeleton-card" />)
    const card = screen.getByTestId("skeleton-card")
    expect(card.children[0]).toHaveClass("h-[122px]", "w-full", "rounded")
    expect(card.children[1]!.children).toHaveLength(2)
  })

  it("passes animate to every block", () => {
    const { container } = render(<SkeletonCard animate={false} />)
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3)
    expect(container.querySelectorAll(".motion-safe\\:animate-pulse")).toHaveLength(0)
  })
})

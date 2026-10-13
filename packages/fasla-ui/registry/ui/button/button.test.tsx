import { afterEach, describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { PlusIcon } from "lucide-react"
import { Button, buttonVariants } from "./button"

const button = () => screen.getByRole("button")

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
    // Figma's default: Solid / Primary / md / Standard.
    expect(button()).toHaveClass("bg-primary", "text-primary-foreground", "h-9", "px-4", "rounded-[var(--radius-md)]")
    expect(button()).toHaveAttribute("data-variant", "default")
    expect(button()).toHaveAttribute("data-tone", "primary")
    expect(button()).toHaveAttribute("data-size", "default")
  })

  describe("each variant is one Figma Type and Style", () => {
    it.each([
      ["default", "primary", ["bg-primary", "text-primary-foreground", "hover:opacity-90", "active:opacity-80"]],
      ["secondary", "secondary", ["bg-secondary", "text-secondary-foreground", "hover:opacity-90", "active:from-soft-primary"]],
      ["destructive", "destructive", ["bg-destructive", "text-destructive-foreground", "hover:opacity-90", "active:opacity-80"]],
      ["outline", "secondary", ["bg-background", "ring-1", "ring-inset", "ring-border", "text-foreground", "hover:bg-secondary"]],
      ["ghost", "secondary", ["text-foreground", "hover:bg-accent", "active:from-soft-primary"]],
      ["link", "primary", ["underline", "text-primary", "hover:opacity-90", "active:opacity-80"]],
      ["soft", "primary", ["bg-card", "from-soft-primary", "hover:from-soft-primary-20", "active:from-soft-primary-30", "text-primary"]],
    ] as const)("%s → %s", (variant, tone, classes) => {
      render(<Button variant={variant}>Label</Button>)
      expect(button()).toHaveClass(...classes)
      expect(button()).toHaveAttribute("data-tone", tone)
    })
  })

  describe("tone reaches the other Styles of a Type", () => {
    it.each([
      ["outline", "primary", ["ring-primary", "text-primary", "hover:bg-accent", "hover:text-accent-foreground"]],
      ["outline", "destructive", ["ring-destructive", "text-destructive", "hover:bg-soft-destructive", "active:bg-soft-destructive-20"]],
      ["ghost", "primary", ["text-primary", "hover:bg-accent", "hover:text-accent-foreground"]],
      ["ghost", "destructive", ["text-destructive", "hover:bg-soft-destructive", "active:bg-soft-destructive-20"]],
      ["link", "secondary", ["underline", "text-secondary-foreground"]],
      ["link", "destructive", ["underline", "text-destructive"]],
      ["soft", "secondary", ["from-soft-secondary", "hover:from-soft-secondary-20", "active:from-soft-secondary-30", "text-secondary-foreground"]],
      ["soft", "destructive", ["from-soft-destructive", "hover:from-soft-destructive-20", "active:from-soft-destructive-30", "text-destructive"]],
    ] as const)("%s + %s", (variant, tone, classes) => {
      render(
        <Button variant={variant} tone={tone}>
          Label
        </Button>
      )
      expect(button()).toHaveClass(...classes)
    })

    it("does not leak another tone's colours", () => {
      render(
        <Button variant="outline" tone="destructive">
          Delete
        </Button>
      )
      expect(button()).not.toHaveClass("ring-border", "text-foreground", "hover:bg-secondary")
    })
  })

  it("underlines a link in every state, not only on hover", () => {
    render(
      <Button variant="link" disabled>
        Learn more
      </Button>
    )
    expect(button()).toHaveClass("underline", "disabled:opacity-50")
    expect(button().className).not.toMatch(/hover:underline/)
  })

  it("keeps Link the same height and padding as the other Types", () => {
    const { rerender } = render(<Button variant="link">Learn more</Button>)
    const link = button().className
    rerender(<Button variant="ghost">Learn more</Button>)
    for (const c of ["h-9", "px-4", "gap-2", "text-sm"]) {
      expect(link).toContain(c)
      expect(button()).toHaveClass(c)
    }
  })

  it.each([
    ["xs", ["h-[1.625rem]", "px-2", "gap-1.5", "text-xs"]],
    ["sm", ["h-8", "px-3", "gap-1.5", "text-sm"]],
    ["default", ["h-9", "px-4", "gap-2", "text-sm"]],
    ["lg", ["h-10", "px-6", "gap-2", "text-sm"]],
    ["icon-xs", ["size-[1.625rem]"]],
    ["icon-sm", ["size-8"]],
    ["icon", ["size-9"]],
    ["icon-lg", ["size-10"]],
  ] as const)("size %s matches Figma", (size, classes) => {
    render(
      <Button size={size} aria-label="Add">
        Label
      </Button>
    )
    expect(button()).toHaveClass(...classes, "[&_svg]:size-4")
  })

  it("rounds to a pill, ring included", () => {
    render(<Button radius="rounded">Save</Button>)
    expect(button()).toHaveClass("rounded-full", "after:rounded-full")
    expect(button()).not.toHaveClass("rounded-[var(--radius-md)]")
  })

  it("draws Figma's focus ring: 2px, 2px outside, on keyboard focus only", () => {
    render(<Button>Save</Button>)
    expect(button()).toHaveClass(
      "after:absolute",
      "after:-inset-1",
      "after:ring-2",
      "after:ring-inset",
      "after:ring-ring",
      "after:opacity-0",
      "focus-visible:after:opacity-100",
      "after:rounded-[calc(var(--radius-md)+4px)]"
    )
  })

  it("keeps an edge and a focus mark in forced colours", () => {
    render(<Button>Save</Button>)
    expect(button()).toHaveClass(
      "[outline:none]",
      "forced-colors:border",
      "forced-colors:border-[ButtonText]",
      "forced-colors:focus-visible:[outline:2px_solid_Highlight]"
    )
    expect(button()).not.toHaveClass("outline-none")
  })

  it("dims every variant to half opacity when disabled", () => {
    render(
      <Button variant="soft" disabled>
        Save
      </Button>
    )
    expect(button()).toBeDisabled()
    expect(button()).toHaveClass("disabled:opacity-50", "disabled:pointer-events-none")
  })

  it("shows loading state", () => {
    render(<Button loading>Submit</Button>)
    expect(button()).toBeDisabled()
    expect(button()).toHaveAttribute("aria-busy", "true")
    expect(screen.getByText("Submit")).toBeInTheDocument()
    expect(screen.getByText("Loading")).toBeInTheDocument()
  })

  it("announces the loading text it is given", () => {
    render(
      <Button loading loadingLabel="جارٍ الحفظ">
        حفظ
      </Button>
    )
    expect(screen.getByText("جارٍ الحفظ")).toBeInTheDocument()
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  })

  it("swaps an icon button's glyph for the spinner while loading", () => {
    render(
      <Button size="icon" aria-label="Add" loading>
        <PlusIcon data-testid="plus" />
      </Button>
    )
    expect(screen.queryByTestId("plus")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled()
  })

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(button())
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    )
    fireEvent.click(button())
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("does not call onClick when loading", () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} loading>
        Click me
      </Button>
    )
    fireEvent.click(button())
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(button()).toHaveClass("custom-class")
  })

  it("forwards its ref", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref}>Save</Button>)
    expect(ref.current).toBe(button())
  })

  describe("asChild", () => {
    it("styles its child as the button", () => {
      render(
        <Button asChild variant="link">
          <a href="/pricing">View all</a>
        </Button>
      )
      const link = screen.getByRole("link", { name: "View all" })
      expect(link).toHaveClass("underline", "text-primary")
      expect(link).not.toHaveAttribute("disabled")
    })

    it("marks a disabled link with aria-disabled instead of disabled", () => {
      render(
        <Button asChild disabled>
          <a href="/pricing">View all</a>
        </Button>
      )
      const link = screen.getByRole("link", { name: "View all" })
      expect(link).toHaveAttribute("aria-disabled", "true")
      expect(link).not.toHaveAttribute("disabled")
      expect(link).toHaveClass("aria-disabled:opacity-50", "aria-disabled:pointer-events-none")
    })

    it("keeps a disabled link out of the tab order and stops it navigating", () => {
      const onClick = vi.fn()
      render(
        <Button asChild disabled onClick={onClick}>
          <a href="/pricing">View all</a>
        </Button>
      )
      const link = screen.getByRole("link", { name: "View all" })
      expect(link).toHaveAttribute("tabindex", "-1")
      const click = new MouseEvent("click", { bubbles: true, cancelable: true })
      link.dispatchEvent(click)
      expect(click.defaultPrevented).toBe(true)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe("icon sizes need an accessible name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    afterEach(() => {
      warn.mockClear()
    })

    it("warns in development when there is none", () => {
      render(
        <Button size="icon">
          <PlusIcon />
        </Button>
      )
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]?.[0]).toMatch(/icon-only button needs an accessible name/)
    })

    it.each([
      ["aria-label", { "aria-label": "Add" }],
      ["title", { title: "Add" }],
    ])("is quiet with %s", (_, extra) => {
      render(
        <Button size="icon-sm" {...extra}>
          <PlusIcon />
        </Button>
      )
      expect(warn).not.toHaveBeenCalled()
    })

    it("is quiet with visually hidden text", () => {
      render(
        <Button size="icon-lg">
          <PlusIcon />
          <span className="sr-only">Add</span>
        </Button>
      )
      expect(warn).not.toHaveBeenCalled()
    })

    it("warns once, not on every render", () => {
      const { rerender } = render(
        <Button size="icon">
          <PlusIcon />
        </Button>
      )
      rerender(
        <Button size="icon" className="x">
          <PlusIcon />
        </Button>
      )
      expect(warn).toHaveBeenCalledTimes(1)
    })

    it("does not check buttons with a label", () => {
      render(<Button size="sm" />)
      expect(warn).not.toHaveBeenCalled()
    })

    it("is quiet in production", () => {
      vi.stubEnv("NODE_ENV", "production")
      render(
        <Button size="icon">
          <PlusIcon />
        </Button>
      )
      vi.unstubAllEnvs()
      expect(warn).not.toHaveBeenCalled()
    })
  })
})

describe("buttonVariants", () => {
  it("styles another element with the same options", () => {
    expect(buttonVariants({ variant: "outline" })).toContain("ring-border")
    expect(buttonVariants({ variant: "outline", tone: "primary" })).toContain("ring-primary")
    expect(buttonVariants({ variant: "soft", size: "lg", radius: "rounded" })).toContain("rounded-full")
    expect(buttonVariants({ className: "w-full" })).toContain("w-full")
  })

  it("defaults to Figma's Solid / Primary / md / Standard", () => {
    const classes = buttonVariants()
    for (const c of ["bg-primary", "h-9", "rounded-[var(--radius-md)]"]) expect(classes).toContain(c)
  })
})

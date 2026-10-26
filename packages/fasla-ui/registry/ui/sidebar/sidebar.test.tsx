import { beforeAll, describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarSubItem,
  SidebarPlanCard,
  SidebarFooter,
  SidebarProfile,
  type SidebarProps,
} from "./sidebar"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and no style resolution: it matches neither
 * `:hover` nor `:focus-visible`, runs no transitions and measures every box
 * at zero. So the visual tests assert class presence only. Widths, row
 * heights, the focus ring, the tooltip's placement and the tokens in Light
 * and Dark were checked in a real browser, in both directions.
 */

const Icon = () => <svg data-testid="icon" />

/*
 * The default names are two hidden runs, and CSS keeps the one matching the
 * nearest `lang`, as on Breadcrumb. jsdom loads no Tailwind, so inject exactly
 * the compiled rules the names depend on.
 */
beforeAll(() => {
  const style = document.createElement("style")
  style.textContent = [
    ".hidden { display: none }",
    ".\\[\\&\\:lang\\(ar\\)\\]\\:hidden:lang(ar) { display: none }",
    ".\\[\\&\\:lang\\(ar\\)\\]\\:inline:lang(ar) { display: inline }",
  ].join("\n")
  document.head.appendChild(style)
})

function Example(props: Partial<SidebarProps>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader logo={<span>Logo</span>} logoIcon={<span>L</span>} />
      <SidebarContent aria-label="Main">
        <SidebarGroup label="Store">
          <SidebarItem label="Dashboard" icon={<Icon />} href="/dashboard" />
          <SidebarItem label="Orders" icon={<Icon />}>
            <SidebarSubItem label="All orders" href="/orders" selected />
            <SidebarSubItem label="Returns" href="/returns" />
          </SidebarItem>
          <SidebarItem label="Products" icon={<Icon />} badge />
        </SidebarGroup>
      </SidebarContent>
      <SidebarPlanCard title="Pro Plan" description="3 team members" footer="Next renewal: 10 Mar" />
      <SidebarFooter>
        <SidebarProfile name="Nadia Rahman" description="Fasla" />
      </SidebarFooter>
    </Sidebar>
  )
}

describe("Sidebar — expanded and collapsed", () => {
  it("is expanded by default: 256px with the full logo, titles and plan card", () => {
    const { container } = render(<Example />)
    const aside = container.querySelector("aside")!
    expect(aside).toHaveAttribute("data-state", "expanded")
    expect(aside).toHaveClass("w-64")
    expect(screen.getByText("Logo")).toBeTruthy()
    expect(screen.getByText("Store")).not.toHaveClass("sr-only")
    expect(screen.getByText("Pro Plan")).toBeTruthy()
  })

  it("collapses and expands from the header toggle, uncontrolled", () => {
    const onCollapsedChange = vi.fn()
    const { container } = render(<Example onCollapsedChange={onCollapsedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }))
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(container.querySelector("aside")).toHaveAttribute("data-state", "collapsed")
    expect(container.querySelector("aside")).toHaveClass("w-20")

    const expand = screen.getByRole("button", { name: "Expand sidebar" })
    expect(expand).toHaveAttribute("aria-expanded", "false")
    fireEvent.click(expand)
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false)
    expect(container.querySelector("aside")).toHaveAttribute("data-state", "expanded")
  })

  it("follows `collapsed` when controlled", () => {
    const onCollapsedChange = vi.fn()
    const { container } = render(<Example collapsed onCollapsedChange={onCollapsedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }))
    expect(onCollapsedChange).toHaveBeenCalledWith(false)
    // Still collapsed until the owner passes the new state.
    expect(container.querySelector("aside")).toHaveAttribute("data-state", "collapsed")
  })

  it("collapsed: icon logo, titles become dividers, no plan card, only the avatar", () => {
    const { container } = render(<Example defaultCollapsed />)
    expect(screen.getByText("L")).toBeTruthy()
    expect(screen.queryByText("Logo")).toBeNull()
    expect(screen.getByText("Store")).toHaveClass("sr-only")
    expect(container.querySelector("[data-slot=sidebar-divider]")).toBeTruthy()
    expect(screen.queryByText("Pro Plan")).toBeNull()
    expect(screen.getByRole("button", { name: "Nadia Rahman" })).toBeTruthy()
    expect(screen.queryByText("Fasla", { selector: "[data-slot=sidebar-profile] span" })).toBeNull()
  })

  it("collapsed: items keep their label as their accessible name", () => {
    render(<Example defaultCollapsed />)
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeTruthy()
    expect(screen.getByText("Dashboard")).toHaveClass("sr-only")
  })

  it("collapsed: cells take the expanded rows' corners and tokens", () => {
    render(<Example defaultCollapsed />)
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveClass(
      "rounded-[var(--radius-sm)]",
      "text-sidebar-foreground",
      "hover:bg-sidebar-accent"
    )
    expect(screen.getByRole("button", { name: "Orders" })).toHaveClass(
      "rounded-[var(--radius-sm)]",
      "bg-sidebar-primary",
      "text-sidebar-primary-foreground"
    )
  })

  it("collapsed: an item whose sub-item is the current page shows as selected", () => {
    render(<Example defaultCollapsed />)
    expect(screen.getByRole("button", { name: "Orders" })).toHaveAttribute("data-selected")
  })

  it("collapsed: pressing an item with sub-items expands the sidebar with them open", () => {
    const { container } = render(<Example defaultCollapsed />)
    fireEvent.click(screen.getByRole("button", { name: "Orders" }))
    expect(container.querySelector("aside")).toHaveAttribute("data-state", "expanded")
    expect(screen.getByRole("button", { name: "Orders" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("link", { name: "Returns" })).toBeTruthy()
  })
})

describe("SidebarItem", () => {
  it("marks the selected item as the current page", () => {
    render(<Example />)
    expect(screen.getByRole("link", { name: "All orders" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current")
  })

  it("opens to show a selected sub-item, and closes from its own row", () => {
    render(<Example />)
    const orders = screen.getByRole("button", { name: "Orders" })
    expect(orders).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(orders)
    expect(orders).toHaveAttribute("aria-expanded", "false")
  })

  it("renders a button without an href, and `render` in place of the link", () => {
    render(
      <ul>
        <SidebarItem label="Log out" />
        <SidebarItem label="Help" render={<a href="/help" data-router="" />} />
      </ul>
    )
    expect(screen.getByRole("button", { name: "Log out" })).toHaveAttribute("type", "button")
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("data-router")
  })

  it("names the badge for screen readers", () => {
    render(<Example />)
    expect(screen.getByRole("button", { name: "Products New" })).toBeTruthy()
  })

  it("takes the selected tokens, and the hover tokens only when not selected", () => {
    render(<Example />)
    expect(screen.getByRole("link", { name: "All orders" })).toHaveClass("bg-sidebar-primary", "text-sidebar-primary-foreground")
    const dashboard = screen.getByRole("link", { name: "Dashboard" })
    expect(dashboard).toHaveClass("hover:bg-sidebar-accent", "hover:text-sidebar-accent-foreground")
  })

  it("draws Select's focus ring", () => {
    render(<Example />)
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveClass(
      "focus-visible:border-ring",
      "focus-visible:ring-[3px]",
      "focus-visible:ring-ring/50"
    )
  })
})

describe("Sidebar — labels", () => {
  it("lets the toggle's name be translated", () => {
    render(
      <Sidebar>
        <SidebarHeader collapseLabel="طيّ القائمة" />
      </Sidebar>
    )
    expect(screen.getByRole("button", { name: "طيّ القائمة" })).toBeTruthy()
  })

  it("keeps its English names when the labels are passed as undefined", () => {
    render(
      <Sidebar>
        <SidebarHeader collapseLabel={undefined} expandLabel={undefined} />
        <ul>
          <SidebarItem label="Inbox" badge badgeLabel={undefined} />
        </ul>
      </Sidebar>
    )
    expect(screen.getByRole("button", { name: "Collapse sidebar" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Inbox New" })).toBeTruthy()
  })

  it("passes no Sidebar prop through to the aside", () => {
    const { container } = render(
      <Sidebar collapsed={false} onCollapsedChange={() => {}} defaultCollapsed={false}>
        <span />
      </Sidebar>
    )
    expect(container.querySelector("aside")?.getAttributeNames().sort()).toEqual(["class", "data-slot", "data-state"])
  })
})

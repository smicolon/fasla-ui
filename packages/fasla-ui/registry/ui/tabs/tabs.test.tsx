import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Tabs, TabsList, TabsTrigger, TabsContent, type TabsListProps } from "./tabs"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and no style resolution: it matches neither
 * `:hover` nor `:focus-visible`, applies no stylesheet, and every
 * `getBoundingClientRect` is zero. So the visual tests below assert **class
 * presence only** — that the component emits the right utility on the right
 * element. Tab heights, padding, the Lifted corners, the underline and the
 * tokens in Light and Dark were measured in a real browser.
 * Treat a green run here as "the contract is wired", not "it looks right".
 *
 * The RTL keyboard test relies on the `dir` attribute, which the component
 * reads directly; jsdom computes no `direction` from it.
 */

function Example({
  listProps,
  disabled = [],
  ...props
}: {
  listProps?: Partial<TabsListProps>
  disabled?: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <Tabs {...props}>
      <TabsList aria-label="Account" {...listProps}>
        {["one", "two", "three"].map((v) => (
          <TabsTrigger key={v} value={v} disabled={disabled.includes(v)}>
            {v}
          </TabsTrigger>
        ))}
      </TabsList>
      {["one", "two", "three"].map((v) => (
        <TabsContent key={v} value={v}>
          Panel {v}
        </TabsContent>
      ))}
    </Tabs>
  )
}

const tab = (name: string) => screen.getByRole("tab", { name })
const keyDown = (key: string) =>
  fireEvent.keyDown(document.activeElement as HTMLElement, { key })

describe("Tabs", () => {
  it("wires tablist, tab and tabpanel roles together", () => {
    render(<Example defaultValue="one" />)
    expect(screen.getByRole("tablist")).toHaveAccessibleName("Account")
    expect(screen.getAllByRole("tab")).toHaveLength(3)

    const panel = screen.getByRole("tabpanel")
    expect(tab("one")).toHaveAttribute("aria-controls", panel.id)
    expect(panel).toHaveAttribute("aria-labelledby", tab("one").id)
    expect(panel).toHaveAccessibleName("one")
    expect(tab("two").getAttribute("aria-controls")).not.toBe(panel.id)
  })

  it("selects from defaultValue and switches on click", () => {
    render(<Example defaultValue="two" />)
    expect(tab("two")).toHaveAttribute("aria-selected", "true")
    expect(tab("two")).toHaveAttribute("data-state", "active")
    expect(tab("one")).toHaveAttribute("aria-selected", "false")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two")

    fireEvent.click(tab("three"))
    expect(tab("three")).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel three")
  })

  it("follows a controlled value", () => {
    const handleChange = vi.fn()
    const { rerender } = render(<Example value="one" onValueChange={handleChange} />)
    fireEvent.click(tab("two"))
    expect(handleChange).toHaveBeenCalledWith("two")
    // Still "one" until the parent passes the new value back.
    expect(tab("one")).toHaveAttribute("aria-selected", "true")

    rerender(<Example value="two" onValueChange={handleChange} />)
    expect(tab("two")).toHaveAttribute("aria-selected", "true")
  })

  it("activates the first enabled tab when no value is given", () => {
    // Figma: a group is never left without an active tab.
    render(<Example disabled={["one"]} />)
    expect(tab("two")).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two")
  })

  it("uses a roving tabindex: only the active tab is in the tab order", () => {
    render(<Example defaultValue="two" />)
    expect(tab("one")).toHaveAttribute("tabindex", "-1")
    expect(tab("two")).toHaveAttribute("tabindex", "0")
    expect(tab("three")).toHaveAttribute("tabindex", "-1")
  })

  it("moves focus and selection with the arrow keys, wrapping at the ends", () => {
    render(<Example defaultValue="one" />)
    tab("one").focus()

    keyDown("ArrowRight")
    expect(tab("two")).toHaveFocus()
    expect(tab("two")).toHaveAttribute("aria-selected", "true")

    keyDown("ArrowRight")
    keyDown("ArrowRight")
    expect(tab("one")).toHaveFocus()

    keyDown("ArrowLeft")
    expect(tab("three")).toHaveFocus()
    expect(tab("three")).toHaveAttribute("aria-selected", "true")
  })

  it("reverses the arrow keys in RTL", () => {
    render(
      <div dir="rtl">
        <Example defaultValue="one" />
      </div>
    )
    tab("one").focus()
    // In RTL the next tab is to the left.
    keyDown("ArrowLeft")
    expect(tab("two")).toHaveFocus()
    keyDown("ArrowRight")
    expect(tab("one")).toHaveFocus()
  })

  it("jumps to the first and last tab with Home and End", () => {
    render(<Example defaultValue="two" />)
    tab("two").focus()
    keyDown("End")
    expect(tab("three")).toHaveFocus()
    keyDown("Home")
    expect(tab("one")).toHaveFocus()
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
  })

  it("skips disabled tabs, by keyboard and by pointer", () => {
    render(<Example defaultValue="one" disabled={["two"]} />)
    expect(tab("two")).toBeDisabled()

    tab("one").focus()
    keyDown("ArrowRight")
    expect(tab("three")).toHaveFocus()

    fireEvent.click(tab("two"))
    expect(tab("two")).toHaveAttribute("aria-selected", "false")
  })

  it("ignores other keys and leaves them to the page", () => {
    render(<Example defaultValue="one" />)
    tab("one").focus()
    const event = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true })
    tab("one").dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(tab("one")).toHaveFocus()
  })

  it("sizes every tab to the Figma set", () => {
    const cases = [
      ["sm", ["h-7", "px-2", "text-sm", "[&_svg:not([data-slot=corner])]:size-4"]],
      ["md", ["h-[30px]", "px-2.5", "text-sm", "[&_svg:not([data-slot=corner])]:size-4"]],
      ["lg", ["h-8", "px-3", "text-base", "[&_svg:not([data-slot=corner])]:size-5"]],
    ] as const
    for (const [size, classes] of cases) {
      const { unmount } = render(<Example defaultValue="one" listProps={{ size }} />)
      for (const t of screen.getAllByRole("tab")) {
        expect(t).toHaveClass("gap-1.5", "font-medium", ...classes)
        // The ramp owns the leading (English and Arabic differ).
        expect(t.className).not.toMatch(/\bleading-/)
      }
      unmount()
    }
  })

  it("defaults to boxed md", () => {
    render(<Example defaultValue="one" />)
    expect(tab("one")).toHaveClass("h-[30px]", "rounded-[var(--radius-md)]")
  })

  it("paints boxed with Figma's tokens", () => {
    render(<Example defaultValue="one" listProps={{ variant: "boxed" }} />)
    expect(tab("one")).toHaveClass(
      "text-foreground",
      "data-[state=active]:bg-background",
      "data-[state=active]:shadow",
      "hover:bg-muted",
      // Figma's 1px ring stroke, inset so the tab does not grow.
      "focus-visible:outline-1",
      "focus-visible:-outline-offset-1",
      "focus-visible:outline-ring"
    )
    expect(screen.getByRole("tablist").querySelector("[data-slot=corner]")).toBeNull()
  })

  it("paints bordered with Figma's tokens", () => {
    render(<Example defaultValue="one" listProps={{ variant: "bordered" }} />)
    expect(tab("one")).toHaveClass(
      "shadow-[inset_0_-2px_0_0_var(--border)]",
      "data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)]",
      "data-[state=active]:text-primary",
      "data-[state=active]:bg-background",
      "hover:bg-muted"
    )
    // An underline, not a box: no radius.
    expect(tab("one").className).not.toMatch(/\brounded-/)
  })

  it("paints lifted with Figma's tokens and flares only the active tab", () => {
    render(<Example defaultValue="two" listProps={{ variant: "lifted" }} />)
    expect(tab("one")).toHaveClass(
      "rounded-[var(--radius-sm)]",
      "border-b-border",
      // Transparent sides, so the active tab's side borders change no width.
      "border-x",
      "border-transparent",
      "hover:border-b-primary/20",
      "data-[state=active]:rounded-t-[10px]",
      "data-[state=active]:border-t",
      "data-[state=active]:border-b-0",
      "data-[state=active]:text-primary"
    )
    const corners = (t: HTMLElement) => t.querySelectorAll("[data-slot=corner]")
    expect(corners(tab("one"))).toHaveLength(0)
    expect(corners(tab("two"))).toHaveLength(2)

    const [left, right] = Array.from(corners(tab("two"))) as [Element, Element]
    expect(left).toHaveAttribute("aria-hidden", "true")
    expect(left).toHaveClass("absolute", "bottom-0", "size-[9px]", "-left-[9px]")
    expect(right).toHaveClass("-right-[9px]", "-scale-x-100")
    // The icon sizing must not reach the corners.
    expect(tab("two").className).toMatch(/\[&_svg:not\(\[data-slot=corner\]\)\]:size-4/)
    expect(left.querySelector(".fill-background")).not.toBeNull()
    expect(left.querySelector(".fill-border")).not.toBeNull()
  })

  it("keeps a corner's name out of the tab's accessible name", () => {
    render(<Example defaultValue="one" listProps={{ variant: "lifted" }} />)
    expect(tab("one")).toHaveAccessibleName("one")
  })

  it("has no direction-specific classes", () => {
    // Logical layout only. The Lifted corners are the one physical
    // placement: they are a mirror-image pair, so left/right is correct in
    // both directions.
    for (const variant of ["lifted", "boxed", "bordered"] as const) {
      const { container, unmount } = render(
        <Example defaultValue="one" listProps={{ variant }} />
      )
      const clone = container.cloneNode(true) as HTMLElement
      clone.querySelectorAll("[data-slot=corner]").forEach((c) => c.remove())
      expect(clone.innerHTML).not.toMatch(/\brtl:/)
      expect(clone.innerHTML).not.toMatch(/translate-x/)
      expect(clone.innerHTML).not.toMatch(/\b-?(left|right)-/)
      unmount()
    }
  })

  it("shows keyboard focus on every style", () => {
    for (const variant of ["lifted", "boxed", "bordered"] as const) {
      const { unmount } = render(<Example defaultValue="one" listProps={{ variant }} />)
      expect(tab("one")).toHaveClass(
        "outline-none",
        "focus-visible:ring-[3px]",
        "focus-visible:ring-ring/50"
      )
      unmount()
    }
  })

  it("greys a disabled tab and takes it out of pointer events", () => {
    render(<Example defaultValue="one" disabled={["two"]} />)
    expect(tab("two")).toHaveClass(
      "disabled:text-muted-foreground",
      "disabled:pointer-events-none"
    )
  })

  it("respects reduced motion", () => {
    render(<Example defaultValue="one" />)
    expect(tab("one")).toHaveClass("motion-reduce:transition-none")
  })

  it("makes the panel focusable", () => {
    render(<Example defaultValue="one" />)
    expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0")
  })

  it("lets a caller's onClick cancel the change", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">one</TabsTrigger>
          <TabsTrigger value="two" onClick={(e) => e.preventDefault()}>
            two
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
    fireEvent.click(tab("two"))
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
  })

  it("makes ids safe for values with spaces", () => {
    render(
      <Tabs defaultValue="my account">
        <TabsList>
          <TabsTrigger value="my account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="my account">Panel</TabsContent>
      </Tabs>
    )
    expect(tab("Account").id).not.toMatch(/\s/)
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Account")
  })

  it("merges className on every part", () => {
    render(
      <Tabs defaultValue="one" className="c-root">
        <TabsList className="c-list">
          <TabsTrigger value="one" className="c-tab">
            one
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="c-panel">
          Panel
        </TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tablist")).toHaveClass("c-list", "inline-flex")
    expect(screen.getByRole("tablist").parentElement).toHaveClass("c-root", "w-full")
    expect(tab("one")).toHaveClass("c-tab", "h-[30px]")
    expect(screen.getByRole("tabpanel")).toHaveClass("c-panel")
  })

  it("forwards refs", () => {
    const refs = {
      root: { current: null as HTMLDivElement | null },
      list: { current: null as HTMLDivElement | null },
      tab: { current: null as HTMLButtonElement | null },
      panel: { current: null as HTMLDivElement | null },
    }
    render(
      <Tabs defaultValue="one" ref={refs.root}>
        <TabsList ref={refs.list}>
          <TabsTrigger value="one" ref={refs.tab}>
            one
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one" ref={refs.panel}>
          Panel
        </TabsContent>
      </Tabs>
    )
    expect(refs.list.current).toBe(screen.getByRole("tablist"))
    expect(refs.root.current).toBe(refs.list.current?.parentElement)
    expect(refs.tab.current).toBe(tab("one"))
    expect(refs.panel.current).toBe(screen.getByRole("tabpanel"))
  })

  it("throws outside a Tabs provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TabsTrigger value="x">x</TabsTrigger>)).toThrow(
      /within a Tabs provider/
    )
    spy.mockRestore()
  })

  it("rejects null as a variant", () => {
    // @ts-expect-error `variant` is declared on TabsListProps rather than
    // inherited from CVA's VariantProps, which would widen it with `| null`.
    render(<Example defaultValue="one" listProps={{ variant: null }} />)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
  })
})

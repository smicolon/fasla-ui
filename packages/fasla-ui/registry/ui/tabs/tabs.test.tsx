import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Tabs, TabsList, TabsTrigger, TabsContent, type TabsListProps } from "./tabs"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and no style resolution: it matches neither
 * `:hover` nor `:focus-visible`, applies no stylesheet, and every
 * `getBoundingClientRect` is zero. So the visual tests below assert **class
 * presence only** — that the component emits the right utility on the right
 * element. Tab heights, padding, the Lifted corners, the underline and the
 * tokens in Light and Dark were measured in a real browser, in both
 * directions. Treat a green run here as "the contract is wired", not "it
 * looks right".
 *
 * Base UI moves focus in a microtask after an arrow key, so keyboard steps
 * are awaited. The RTL tests rely on the `dir` attribute, which the
 * component reads; jsdom computes no `direction` from it.
 */

const VALUES = ["one", "two", "three"]

function Example({
  listProps,
  disabled = [],
  panels = true,
  ...props
}: {
  listProps?: Partial<TabsListProps>
  disabled?: string[]
  panels?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, details: { cancel: () => void; reason: string }) => void
}) {
  return (
    <Tabs {...props}>
      <TabsList aria-label="Account" {...listProps}>
        {VALUES.map((v) => (
          <TabsTrigger key={v} value={v} disabled={disabled.includes(v)}>
            {v}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels &&
        VALUES.map((v) => (
          <TabsContent key={v} value={v}>
            Panel {v}
          </TabsContent>
        ))}
    </Tabs>
  )
}

const tab = (name: string) => screen.getByRole("tab", { name })
const tabStops = () => screen.getAllByRole("tab").filter((t) => t.getAttribute("tabindex") === "0")
/** A key on the focused element, then the microtask Base UI focuses in. */
const press = async (key: string) => {
  await act(async () => {
    fireEvent.keyDown(document.activeElement as HTMLElement, { key })
  })
}
const focus = async (element: HTMLElement) => {
  await act(async () => {
    element.focus()
  })
}

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
    expect(tab("two")).toHaveAttribute("data-active")
    expect(tab("one")).toHaveAttribute("aria-selected", "false")
    expect(tab("one")).not.toHaveAttribute("data-active")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two")

    fireEvent.click(tab("three"))
    expect(tab("three")).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel three")
  })

  it("follows a controlled value", () => {
    const handleChange = vi.fn()
    const { rerender } = render(<Example value="one" onValueChange={handleChange} />)
    fireEvent.click(tab("two"))
    expect(handleChange).toHaveBeenCalledWith("two", expect.objectContaining({ reason: "none" }))
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

  it("moves focus and selection with the arrow keys, wrapping at the ends", async () => {
    render(<Example defaultValue="one" />)
    await focus(tab("one"))

    await press("ArrowRight")
    expect(tab("two")).toHaveFocus()
    expect(tab("two")).toHaveAttribute("aria-selected", "true")

    await press("ArrowRight")
    await press("ArrowRight")
    expect(tab("one")).toHaveFocus()

    await press("ArrowLeft")
    expect(tab("three")).toHaveFocus()
    expect(tab("three")).toHaveAttribute("aria-selected", "true")
  })

  it("can leave selection to Enter and Space", async () => {
    render(<Example defaultValue="one" listProps={{ activateOnFocus: false }} />)
    await focus(tab("one"))
    await press("ArrowRight")
    expect(tab("two")).toHaveFocus()
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
  })

  it("reverses the arrow keys in RTL", async () => {
    render(
      <div dir="rtl">
        <Example defaultValue="one" />
      </div>
    )
    await focus(tab("one"))
    // In RTL the next tab is to the left.
    await press("ArrowLeft")
    expect(tab("two")).toHaveFocus()
    await press("ArrowRight")
    expect(tab("one")).toHaveFocus()
  })

  it("follows a dir that changes after mount", async () => {
    // Storybook's direction toolbar and a locale switch change `dir` on a
    // page that is already rendered.
    const { container } = render(
      <div dir="ltr">
        <Example defaultValue="one" />
      </div>
    )
    ;(container.firstChild as HTMLElement).setAttribute("dir", "rtl")
    await focus(tab("one"))
    await press("ArrowLeft")
    expect(tab("two")).toHaveFocus()
  })

  it("jumps to the first and last tab with Home and End", async () => {
    render(<Example defaultValue="two" />)
    await focus(tab("two"))
    await press("End")
    expect(tab("three")).toHaveFocus()
    await press("Home")
    expect(tab("one")).toHaveFocus()
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
  })

  it("never selects a disabled tab, by keyboard or by pointer", async () => {
    // A disabled tab stays focusable, as WAI-ARIA allows, so a screen reader
    // announces it as unavailable; it can never be selected.
    render(<Example defaultValue="one" disabled={["two"]} />)
    expect(tab("two")).toHaveAttribute("aria-disabled", "true")
    expect(tab("two")).toHaveAttribute("data-disabled")

    await focus(tab("one"))
    await press("ArrowRight")
    expect(tab("two")).toHaveFocus()
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
    await press("ArrowRight")
    expect(tab("three")).toHaveAttribute("aria-selected", "true")

    fireEvent.click(tab("two"))
    expect(tab("two")).toHaveAttribute("aria-selected", "false")
  })

  it("ignores other keys and leaves them to the page", async () => {
    render(<Example defaultValue="one" />)
    await focus(tab("one"))
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

  it("sets boxed tabs in a muted track, and leaves the other styles a plain row", () => {
    const { unmount } = render(<Example defaultValue="one" listProps={{ variant: "boxed" }} />)
    // Figma: `muted` fill, `spacing/1` padding, `border radius/lg`.
    expect(screen.getByRole("tablist")).toHaveClass("bg-muted", "p-1", "rounded-lg", "inline-flex")
    unmount()
    for (const variant of ["bordered", "lifted"] as const) {
      const { unmount } = render(<Example defaultValue="one" listProps={{ variant }} />)
      expect(screen.getByRole("tablist").className).not.toMatch(/\bbg-|\bp-\d|\brounded/)
      unmount()
    }
  })

  it("keeps every tab a fixed height with no vertical padding, content centred", () => {
    for (const variant of ["lifted", "boxed", "bordered"] as const) {
      const { unmount } = render(<Example defaultValue="one" listProps={{ variant }} />)
      for (const t of screen.getAllByRole("tab")) {
        expect(t).toHaveClass("items-center")
        expect(t.className).not.toMatch(/\bp[ytb]-/)
      }
      unmount()
    }
  })

  it("paints boxed with Figma's tokens", () => {
    render(<Example defaultValue="one" listProps={{ variant: "boxed" }} />)
    expect(tab("one")).toHaveClass(
      "text-foreground",
      "data-[active]:bg-background",
      "data-[active]:shadow",
      // Figma "Track Hover": `background` at 60%, on the track.
      "hover:bg-background/60",
      // Figma's 1px ring stroke, inset so the tab does not grow.
      "focus-visible:outline-1",
      "focus-visible:-outline-offset-1",
      "focus-visible:outline-ring"
    )
    expect(tab("one")).not.toHaveClass("hover:bg-muted")
    expect(screen.getByRole("tablist").querySelector("[data-slot=corner]")).toBeNull()
  })

  it("paints bordered with Figma's tokens", () => {
    render(<Example defaultValue="one" listProps={{ variant: "bordered" }} />)
    expect(tab("one")).toHaveClass(
      "shadow-[inset_0_-2px_0_0_var(--border)]",
      // The shadow colour utilities recolour that one underline.
      "hover:shadow-primary/20",
      "data-[active]:shadow-primary",
      "data-[active]:text-primary",
      "data-[active]:bg-background",
      "hover:bg-muted"
    )
    // An underline, not a box: no radius.
    expect(tab("one").className).not.toMatch(/\brounded-/)
  })

  it("paints lifted with Figma's tokens and flares only the active tab", () => {
    render(<Example defaultValue="two" listProps={{ variant: "lifted" }} />)
    expect(tab("one")).toHaveClass(
      // Top corners only: the bottom stays square, so the baseline is unbroken.
      "rounded-t-[var(--radius-sm)]",
      // Transparent sides, so the active tab's side borders change no width.
      "border-x",
      "border-transparent",
      // The baseline: the bottom border of an ::after box spanning the tab's
      // border box, under its side borders, so neighbouring tabs' lines meet
      // with no notch between them.
      "after:absolute",
      "after:-inset-x-px",
      "after:inset-y-0",
      "after:border-b",
      "after:border-border",
      "hover:after:border-primary/20",
      // Beside the active tab, the shared bottom corner rounds by 8px on the
      // tab and its ::after, so the baseline's curve lies inside the flare's.
      // Logical corners, so RTL mirrors it.
      "[&:has(+[data-active])]:rounded-ee-[var(--radius-md)]",
      "[&:has(+[data-active])]:after:rounded-ee-[var(--radius-md)]",
      "[[data-active]+&]:rounded-es-[var(--radius-md)]",
      "[[data-active]+&]:after:rounded-es-[var(--radius-md)]",
      "data-[active]:rounded-t-[10px]",
      "data-[active]:border-t",
      "data-[active]:after:hidden",
      "data-[active]:text-primary"
    )
    // No bottom border on the tab, and no unconditional bottom radius.
    expect(tab("one").className).not.toMatch(/(^|\s)(rounded-\[|rounded-b-|rounded-e[se]-|rounded-s[se]-|border-b)/)
    const corners = (t: HTMLElement) => Array.from(t.querySelectorAll("[data-slot=corner]"))
    // Every Lifted tab carries both corners; they show only on the active
    // one, keyed off the tab's own `data-active` through its named group.
    expect(tab("one")).toHaveClass("group/tab")
    for (const t of [tab("one"), tab("two")]) {
      expect(corners(t)).toHaveLength(2)
      for (const corner of corners(t)) {
        expect(corner).toHaveClass("hidden", "group-data-[active]/tab:block")
      }
    }

    const [left, right] = corners(tab("two")) as [Element, Element]
    expect(left).toHaveAttribute("aria-hidden", "true")
    // Above the next tab, which paints later and would cover it on hover.
    expect(left).toHaveClass("absolute", "bottom-0", "z-[1]", "size-[9px]", "-left-[9px]")
    expect(right).toHaveClass("-right-[9px]", "-scale-x-100")
    // The icon sizing must not reach the corners.
    expect(tab("two").className).toMatch(/\[&_svg:not\(\[data-slot=corner\]\)\]:size-4/)
    expect(left.querySelector(".fill-background")).not.toBeNull()
    expect(left.querySelector(".fill-border")).not.toBeNull()
  })

  it("renders tabs as adjacent siblings, which the Lifted corner rules rely on", () => {
    // `:has(+[data-active])` and `[data-active]+` find the tabs either side
    // of the active one; anything rendered between them would break that.
    render(<Example defaultValue="two" listProps={{ variant: "lifted" }} />)
    expect(tab("one").nextElementSibling).toBe(tab("two"))
    expect(tab("two").nextElementSibling).toBe(tab("three"))
    expect(tab("two")).toHaveAttribute("data-active")
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
      expect(clone.innerHTML).not.toMatch(/\b-?(left|right)-|\b[mp][lr]-|\btext-(left|right)\b|\brounded-(?:[lr]|[tb][lr])(?=[-\s"])/)
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
      "data-[disabled]:text-muted-foreground",
      "data-[disabled]:pointer-events-none"
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

  it("lets onValueChange cancel the change", () => {
    render(<Example defaultValue="one" onValueChange={(_, details) => details.cancel()} />)
    fireEvent.click(tab("two"))
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
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

  it("throws outside Tabs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TabsTrigger value="x">x</TabsTrigger>)).toThrow(/Tabs/)
    spy.mockRestore()
  })

  it("rejects null as a variant", () => {
    // @ts-expect-error `variant` is declared on TabsListProps rather than
    // inherited from CVA's VariantProps, which would widen it with `| null`.
    render(<Example defaultValue="one" listProps={{ variant: null }} />)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
  })
})

/**
 * Greptile's review of PR #33 found five keyboard and accessibility defects in
 * the hand-written version. One test each, named after the finding.
 */
describe("Tabs: Greptile review findings", () => {
  it("1. two tabs never share an id", () => {
    // The old ids replaced whitespace with "-", so these two collided.
    render(
      <Tabs defaultValue="my account">
        <TabsList aria-label="Account">
          <TabsTrigger value="my account">Spaced</TabsTrigger>
          <TabsTrigger value="my-account">Hyphenated</TabsTrigger>
        </TabsList>
        <TabsContent value="my account">Panel spaced</TabsContent>
        <TabsContent value="my-account">Panel hyphenated</TabsContent>
      </Tabs>
    )
    const ids = screen.getAllByRole("tab").map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
    expect(ids.every((id) => id && !/\s/.test(id))).toBe(true)
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Spaced")

    fireEvent.click(tab("Hyphenated"))
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Hyphenated")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel hyphenated")
  })

  it("2. tabs that arrive after the first render become reachable", () => {
    function Late({ ready }: { ready: boolean }) {
      return (
        <Tabs>
          <TabsList aria-label="Account">
            {ready &&
              VALUES.map((v) => (
                <TabsTrigger key={v} value={v}>
                  {v}
                </TabsTrigger>
              ))}
          </TabsList>
          {VALUES.map((v) => (
            <TabsContent key={v} value={v}>
              Panel {v}
            </TabsContent>
          ))}
        </Tabs>
      )
    }
    const { rerender } = render(<Late ready={false} />)
    expect(screen.queryAllByRole("tab")).toHaveLength(0)

    rerender(<Late ready />)
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
    expect(tabStops()).toEqual([tab("one")])
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel one")
  })

  it.each([
    ["names a tab that does not exist", "missing", []],
    ["names a disabled tab", "one", ["one"]],
  ])("3. a group can be entered when its value %s", async (_, value, disabled) => {
    render(<Example value={value} disabled={disabled} />)
    // Exactly one tab stop, and it can take focus: the old version made a
    // disabled tab natively `disabled`, so its tab stop could not be focused.
    const stops = tabStops()
    expect(stops).toHaveLength(1)
    expect(stops[0]).not.toBeDisabled()
    await focus(stops[0]!)
    expect(stops[0]).toHaveFocus()

    // And the enabled tabs are reachable from it.
    await press("ArrowRight")
    expect(document.activeElement).not.toBe(stops[0])
    expect(document.activeElement).not.toHaveAttribute("aria-disabled", "true")
  })

  it("4. focus and the tab stop stay together when a change is refused", async () => {
    // A controlled parent that keeps its value: the change never lands.
    render(<Example value="one" onValueChange={() => {}} />)
    await focus(tab("one"))
    await press("ArrowRight")

    // Focus moved, the selection was refused...
    expect(tab("two")).toHaveFocus()
    expect(tab("one")).toHaveAttribute("aria-selected", "true")
    // ...and the tab stop went with focus, so Tab out and Shift+Tab back
    // returns to the tab the user was on, not to a different one.
    expect(tabStops()).toEqual([tab("two")])
  })

  it("5. tabs point only to panels that exist", () => {
    const dangling = () =>
      screen
        .getAllByRole("tab")
        .map((t) => t.getAttribute("aria-controls"))
        .filter((id): id is string => id !== null && document.getElementById(id) === null)

    // No panels at all: no tab claims one.
    const { unmount } = render(<Example defaultValue="two" panels={false} />)
    expect(screen.getAllByRole("tab").filter((t) => t.hasAttribute("aria-controls"))).toEqual([])
    unmount()

    // Panels: every reference resolves, before and after a change.
    render(<Example defaultValue="two" />)
    expect(tab("two")).toHaveAttribute("aria-controls", screen.getByRole("tabpanel").id)
    expect(dangling()).toEqual([])
    fireEvent.click(tab("three"))
    expect(tab("three")).toHaveAttribute("aria-controls", screen.getByRole("tabpanel").id)
    expect(dangling()).toEqual([])
  })
})

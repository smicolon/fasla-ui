import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
  type SheetSide,
} from "./sheet"
import { Button } from "../button/button"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and runs no transitions, so nothing here proves
 * where the sheet sits, how wide it is, which way it slides, or that the
 * footer stays at the bottom while the body scrolls. Those were measured in a
 * real browser in both directions: 384px wide for Start and End, full width
 * for Top and Bottom, the close button 16px from the end edge and centred on
 * the title's first line (32px in English, 40 in Arabic). The visual tests
 * below assert class presence only.
 */

function Example({
  defaultOpen = true,
  onSave,
  body,
  ...content
}: Partial<SheetContentProps> & {
  defaultOpen?: boolean
  onSave?: () => void
  body?: React.ReactNode
}) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger>Edit profile</SheetTrigger>
      <SheetContent {...content}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
        {body ?? (
          <div className="px-4">
            <input aria-label="Name" />
          </div>
        )}
        <SheetFooter>
          <Button onClick={onSave}>Save changes</Button>
          <SheetClose render={<Button variant="outline" tone="primary" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const content = () => document.querySelector<HTMLElement>("[data-slot=sheet-content]")
const overlay = () => document.querySelector<HTMLElement>("[data-slot=sheet-overlay]")
const slot = (name: string) => content()!.querySelector<HTMLElement>(`[data-slot=${name}]`)

describe("Sheet — behaviour", () => {
  it("renders only the trigger while closed", () => {
    render(<Example defaultOpen={false} />)
    expect(screen.getByRole("button", { name: "Edit profile" })).toBeInTheDocument()
    expect(content()).toBeNull()
  })

  it("opens from the trigger as a dialog named by its title and described by its description", async () => {
    render(<Example defaultOpen={false} />)
    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }))
    const dialog = await screen.findByRole("dialog")
    expect(dialog).toHaveAccessibleName("Edit profile")
    expect(dialog).toHaveAccessibleDescription("Make changes to your profile here.")
  })

  it("moves focus into the content first, and back to the trigger when it closes", async () => {
    render(<Example defaultOpen={false} />)
    const trigger = screen.getByRole("button", { name: "Edit profile" })
    act(() => trigger.focus())
    fireEvent.click(trigger)
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus())
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(content()).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("closes on Escape", async () => {
    render(<Example />)
    const dialog = await screen.findByRole("dialog")
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(content()).toBeNull())
  })

  it("closes when the overlay is pressed", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    fireEvent.pointerDown(overlay()!)
    fireEvent.mouseDown(overlay()!)
    fireEvent.click(overlay()!)
    await waitFor(() => expect(content()).toBeNull())
  })

  it("closes from the × button and from SheetClose", async () => {
    const { unmount } = render(<Example />)
    await screen.findByRole("dialog")
    fireEvent.click(slot("sheet-close-button")!)
    await waitFor(() => expect(content()).toBeNull())
    unmount()

    render(<Example />)
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(content()).toBeNull())
  })

  it("leaves a plain button in the footer to the app: it does not close the sheet", async () => {
    const onSave = vi.fn()
    render(<Example onSave={onSave} />)
    fireEvent.click(await screen.findByRole("button", { name: "Save changes" }))
    expect(onSave).toHaveBeenCalledTimes(1)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("follows a controlled open and reports changes", async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
    expect(content()).toBeNull()

    rerender(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })
})

describe("Sheet — close button", () => {
  it("is Figma's Icon Button: Ghost, Secondary, xs, with a 16px ×", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    // Both language runs are in the DOM and CSS hides one, which jsdom does
    // not apply; the name is checked by text instead.
    const close = slot("sheet-close-button")!
    expect(close.tagName).toBe("BUTTON")
    expect(close.textContent).toContain("Close")
    expect(close).toHaveAttribute("data-variant", "ghost")
    expect(close).toHaveAttribute("data-tone", "secondary")
    expect(close).toHaveAttribute("data-size", "icon-xs")
    expect(close.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("sits 16px from the top and the end, in a cell one title line tall, over the sticky header", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("sheet-close-cell")).toHaveClass("absolute", "end-4", "top-4", "z-[2]", "h-[1lh]", "text-2xl", "items-center")
  })

  it("comes after the content in the DOM, so focus reaches the content first", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    const children = [...content()!.children].map((el) => el.getAttribute("data-slot"))
    expect(children.indexOf("sheet-close-cell")).toBeGreaterThan(children.indexOf("sheet-scroll"))
  })

  it("is named in the page's language, or by closeLabel", async () => {
    const { unmount } = render(
      <div lang="ar">
        <Example />
      </div>
    )
    await screen.findByRole("dialog")
    expect(slot("sheet-close-button")!.textContent).toContain("إغلاق")
    unmount()

    render(<Example closeLabel="Fermer" />)
    expect(await screen.findByRole("button", { name: "Fermer" })).toBeInTheDocument()
  })

  it("can be left out", async () => {
    render(<Example showCloseButton={false} />)
    await screen.findByRole("dialog")
    expect(slot("sheet-close-button")).toBeNull()
  })
})

describe("Sheet — Figma variants", () => {
  it("opens from the end by default", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("data-side", "end")
  })

  const SIDES: { side: SheetSide; classes: string[] }[] = [
    { side: "end", classes: ["inset-y-0", "end-0", "h-full", "w-96", "after:start-0", "after:w-px"] },
    { side: "start", classes: ["inset-y-0", "start-0", "h-full", "w-96", "after:end-0", "after:w-px"] },
    { side: "top", classes: ["inset-x-0", "top-0", "after:bottom-0", "after:h-px"] },
    { side: "bottom", classes: ["inset-x-0", "bottom-0", "after:top-0", "after:h-px"] },
  ]

  it.each(SIDES)("places $side with a border line on the edge that faces the page, taking no room", async ({ side, classes }) => {
    render(<Example side={side} />)
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("data-side", side)
    expect(content()).toHaveClass(...classes)
    expect(content()!.className).not.toMatch(/(?:^|\s)border-[setb](?:\s|$)/)
  })

  it.each(["top", "bottom"] as const)("lets %s hug its content: no fixed height", async (side) => {
    render(<Example side={side} />)
    await screen.findByRole("dialog")
    expect(content()).not.toHaveClass("h-full")
    expect(content()!.className).toMatch(/max-h-/)
  })

  it("draws Figma's panel: card fill, card-foreground text, shadow lg, border token, no radius", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(content()).toHaveClass("bg-card", "text-card-foreground", "shadow-lg", "after:bg-border")
    expect(content()!.className).not.toMatch(/rounded/)
  })

  it("scrolls between a header and a footer that stay put, 16px apart", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("sheet-scroll")).toHaveClass("overflow-y-auto", "flex-col", "gap-4", "min-h-0")
    expect(slot("sheet-header")).toHaveClass("sticky", "top-0", "bg-card")
    expect(slot("sheet-footer")).toHaveClass("sticky", "bottom-0", "mt-auto", "bg-card")
  })

  it("pads the scrolling area by the pinned header's and footer's heights, so focus never lands behind them", async () => {
    // jsdom lays nothing out, so both heights read 0; the padding being set at
    // all is what this proves. Shift+Tab into a field under the header was
    // measured in Chrome: the field stops at the header's bottom edge.
    const { unmount } = render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("sheet-scroll")!.style.scrollPaddingTop).toBe("0px")
    expect(slot("sheet-scroll")!.style.scrollPaddingBottom).toBe("0px")
    unmount()

    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>No header or footer</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    await screen.findByRole("dialog")
    expect(slot("sheet-scroll")!.style.scrollPaddingTop).toBe("")
    expect(slot("sheet-scroll")!.style.scrollPaddingBottom).toBe("")
  })

  it("pads the header 16px with 48px at the end, title and description 12px apart", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("sheet-header")).toHaveClass("p-4", "pe-12", "gap-3", "flex-col")
  })

  it("stacks the footer's actions full width, 16px apart, with 16px padding", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("sheet-footer")).toHaveClass("flex-col", "gap-4", "p-4")
  })

  it("sets the title 2XL Semi Bold in card-foreground and the description Base in muted-foreground", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("sheet-title")).toHaveClass("text-2xl", "font-semibold", "text-card-foreground")
    expect(slot("sheet-title")!.tagName).toBe("H2")
    expect(slot("sheet-description")).toHaveClass("text-base", "text-muted-foreground")
  })

  it("lays the overlay token over the page", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(overlay()).toHaveClass("fixed", "inset-0", "bg-backdrop-overlay")
  })

  it.each(["start", "end", "top", "bottom"] as const)(
    "names no physical inline side in %s, so it mirrors with the page",
    async (side) => {
      render(<Example side={side} />)
      await screen.findByRole("dialog")
      const classes = [content()!, ...content()!.querySelectorAll<HTMLElement>("*")].flatMap((el) =>
        [...el.classList].filter((c) =>
          /^(?:-?(?:ml|mr|pl|pr|left|right)-|border-[lr]$|border-[lr]-|text-(?:left|right)$|rounded-[lr]-)/.test(c)
        )
      )
      expect(classes).toEqual([])
    }
  )

  it("flips the slide of start and end under a right-to-left direction", async () => {
    render(<Example side="end" />)
    await screen.findByRole("dialog")
    expect(content()!.className).toContain("[&:dir(rtl)]:data-[starting-style]:-translate-x-full")
    expect(content()!.className).toContain("data-[starting-style]:translate-x-full")
  })

  it("does not move with reduced motion: the slide is motion-safe only, and it fades instead", async () => {
    render(<Example side="bottom" />)
    await screen.findByRole("dialog")
    const translate = [...content()!.classList].filter((c) => c.includes("translate"))
    expect(translate.length).toBeGreaterThan(0)
    expect(translate.every((c) => c.startsWith("motion-safe:"))).toBe(true)
    expect(content()).toHaveClass("motion-reduce:data-[starting-style]:opacity-0")
  })
})

describe("Sheet — direction", () => {
  // The font is copied too; jsdom does not inherit `font-family`, so that was
  // checked in a browser (Cairo on the docs site's Arabic pages).
  it("takes the page's direction and language into the portalled sheet", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Example />
      </div>
    )
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("dir", "rtl")
    expect(content()).toHaveAttribute("lang", "ar")
  })

  // The slide is a transition on transform, and Start/End take opposite offsets
  // per direction. A panel that rendered `ltr` and was corrected to `rtl` while
  // still starting would animate that correction: in Arabic, End slid in from
  // the page side instead of from off-screen left (measured in Chrome before
  // the fix: left edge 384 → 0 rather than -384 → 0). So the panel must be
  // created with the page's direction, never flipped after.
  it.each(["end", "start"] as const)(
    "creates the %s panel with the page's direction when it opens, without flipping it after",
    async (side) => {
      render(
        <div dir="rtl" lang="ar">
          <Example defaultOpen={false} side={side} />
        </div>
      )
      const records: MutationRecord[] = []
      const observer = new MutationObserver((list) => records.push(...list))
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["dir"], attributeOldValue: true })

      fireEvent.click(screen.getByRole("button", { name: "Edit profile" }))
      await screen.findByRole("dialog")
      await new Promise((resolve) => setTimeout(resolve, 50))
      records.push(...observer.takeRecords())
      observer.disconnect()

      const flips = records.filter(
        (r) => r.type === "attributes" && (r.target as HTMLElement).dataset?.slot === "sheet-content"
      )
      expect(flips).toEqual([])
      expect(content()).toHaveAttribute("dir", "rtl")
      expect(content()!.style.transition).toBe("")
    }
  )

  it("holds the slide off for a frame when it is open on its very first render, so a late correction never animates", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Example />
      </div>
    )
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("dir", "rtl")
    await waitFor(() => expect(content()!.style.transition).toBe(""))
  })

  it("is left-to-right on a page with no direction", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("dir", "ltr")
  })

  it("follows the page when its direction changes while open", async () => {
    render(
      <div data-testid="page" dir="ltr" lang="en">
        <Example />
      </div>
    )
    await screen.findByRole("dialog")
    const page = screen.getByTestId("page")
    await act(async () => {
      page.setAttribute("dir", "rtl")
      page.setAttribute("lang", "ar")
    })
    await waitFor(() => expect(content()).toHaveAttribute("dir", "rtl"))
    expect(content()).toHaveAttribute("lang", "ar")
  })

  it("leaves no box in the page where it is written", () => {
    const { container } = render(<Example defaultOpen={false} />)
    expect(container.querySelector("[data-slot=sheet-anchor]")).toHaveAttribute("hidden")
  })
})

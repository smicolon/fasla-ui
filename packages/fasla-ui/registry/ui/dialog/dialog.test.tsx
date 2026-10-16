import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
} from "./dialog"
import { Button } from "../button/button"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and runs no transitions, so nothing here proves
 * where the dialog sits, how wide it is, that the header and footer stay put
 * while the content scrolls, or that the type is Figma's. Those were measured
 * in a real browser in both directions: 512/672/1148px wide, 16px padding and
 * gaps, the 4px title gap, the close × 16px from the edge on the title's
 * line, the back chevron at the content edge 4px from the title. The visual
 * tests below assert class presence only.
 */

function Example({
  defaultOpen = true,
  header,
  footer,
  extra,
  description = true,
  ...content
}: Partial<DialogContentProps> & {
  defaultOpen?: boolean
  header?: Partial<DialogHeaderProps>
  footer?: Partial<DialogFooterProps> & { actions?: React.ReactNode }
  extra?: React.ReactNode
  description?: boolean
}) {
  const { actions, ...footerProps } = footer ?? {}
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogContent {...content}>
        <DialogHeader {...header}>
          <DialogTitle>Edit profile</DialogTitle>
          {description && <DialogDescription>Make changes to your profile here.</DialogDescription>}
        </DialogHeader>
        <label>
          Email address
          <input />
        </label>
        {extra}
        <DialogFooter {...footerProps}>
          {actions ?? (
            <>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <Button>Save changes</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const content = () => document.querySelector<HTMLElement>("[data-slot=dialog-content]")
const overlay = () => document.querySelector<HTMLElement>("[data-slot=dialog-overlay]")
const slot = (name: string) => content()!.querySelector<HTMLElement>(`[data-slot=${name}]`)!

describe("Dialog — behaviour", () => {
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

  it("moves focus into the dialog when it opens, and back to the trigger when it closes", async () => {
    render(<Example defaultOpen={false} />)
    const trigger = screen.getByRole("button", { name: "Edit profile" })
    act(() => trigger.focus())
    fireEvent.click(trigger)
    // The first control in reading order: the field, before the footer and the close button.
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Email address" })).toHaveFocus())
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

  it("closes from the × button, which is named Close", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    // Both language runs are in the DOM and CSS hides one, which jsdom does
    // not apply; the name is checked by text instead.
    const close = slot("dialog-close-button")
    expect(close.tagName).toBe("BUTTON")
    expect(close.textContent).toContain("Close")
    fireEvent.click(close)
    await waitFor(() => expect(content()).toBeNull())
  })

  it("names the × in Arabic on an Arabic page, and takes a name of its own", async () => {
    const { unmount } = render(
      <div lang="ar" dir="rtl">
        <Example />
      </div>
    )
    await screen.findByRole("dialog")
    const close = slot("dialog-close-button")
    // Both runs are in the DOM; CSS hides the English one under `lang="ar"`.
    expect(close.querySelector(".hidden.\\[\\&\\:lang\\(ar\\)\\]\\:inline")).toHaveTextContent("إغلاق")
    unmount()

    render(<Example closeLabel="Dismiss" />)
    await screen.findByRole("dialog")
    expect(screen.getByRole("button", { name: "Dismiss" })).toBe(slot("dialog-close-button"))
  })

  it("follows a controlled open and reports changes", async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change your plan</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    expect(content()).toBeNull()
    rerender(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change your plan</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    await screen.findByRole("dialog")
    fireEvent.click(slot("dialog-close-button"))
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    // Still controlled: it stays open until `open` changes.
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("calls onBack from the back button and stays open", async () => {
    const onBack = vi.fn()
    render(<Example header={{ onBack }} />)
    await screen.findByRole("dialog")
    const back = slot("dialog-back-button")
    expect(back.textContent).toContain("Back")
    fireEvent.click(back)
    expect(onBack).toHaveBeenCalledTimes(1)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("takes a name of its own for the back button", async () => {
    render(<Example header={{ onBack: () => {}, backLabel: "Back to plans" }} />)
    await screen.findByRole("dialog")
    expect(screen.getByRole("button", { name: "Back to plans" })).toBe(slot("dialog-back-button"))
  })

  it("adds shadcn's footer Close button with showCloseButton", async () => {
    render(<Example footer={{ showCloseButton: true, actions: <Button>Save changes</Button> }} />)
    await screen.findByRole("dialog")
    const footerClose = slot("dialog-footer").querySelector("button")!
    expect(footerClose).toHaveAttribute("data-slot", "dialog-footer-close")
    expect(footerClose).toHaveTextContent("Close")
    expect(footerClose).toHaveAttribute("data-variant", "outline")
    fireEvent.click(footerClose)
    await waitFor(() => expect(content()).toBeNull())
  })
})

describe("Dialog — Figma variants", () => {
  it.each([
    ["lg", "max-w-[32rem]"],
    ["xl", "max-w-[42rem]"],
    ["2xl", "max-w-[71.75rem]"],
  ] as const)("gives size %s Figma's width, %s", async (size, width) => {
    render(<Example size={size} />)
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("data-size", size)
    expect(content()).toHaveClass(width)
  })

  it("is size L by default", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("data-size", "lg")
    expect(content()).toHaveClass("max-w-[32rem]")
  })

  it("draws Figma's box: popover fill, 8px radius, shadow lg, 16px padding and gaps, a 16px gutter", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(content()).toHaveClass(
      "bg-popover",
      "text-popover-foreground",
      "rounded-[var(--radius-md)]",
      "shadow-lg",
      "inset-x-4",
      "mx-auto",
      "max-h-[calc(100dvh-2rem)]"
    )
    expect(slot("dialog-scroll")).toHaveClass("p-4", "gap-4", "overflow-y-auto")
  })

  it("lays the overlay token over the page, as Alert Dialog does", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(overlay()).toHaveClass("fixed", "inset-0", "bg-backdrop-overlay")
  })

  it("draws the header: a border under it, 16px under the text, 4px between title and description", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    const header = slot("dialog-header")
    expect(header).toHaveAttribute("data-type", "default")
    expect(header).toHaveClass("border-b", "border-border", "pb-4", "gap-y-1", "grid-cols-[minmax(0,1fr)]")
    expect(header.querySelector("[data-slot=dialog-back-cell]")).toBeNull()
  })

  it("sets the title LG Semi Bold and the description SM Regular, both in foreground", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("dialog-title")).toHaveClass("text-lg", "font-semibold", "text-foreground")
    expect(slot("dialog-title").tagName).toBe("H2")
    expect(slot("dialog-description")).toHaveClass("text-sm", "text-foreground", "pe-8")
  })

  it("keeps the title clear of the close button, and lets it run to the edge without one", async () => {
    const { unmount } = render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("dialog-title")).toHaveClass("pe-8")
    unmount()

    render(<Example showCloseButton={false} />)
    await screen.findByRole("dialog")
    expect(slot("dialog-title")).not.toHaveClass("pe-8")
    expect(content()!.querySelector("[data-slot=dialog-close-button]")).toBeNull()
  })

  it("draws the × as Figma's Icon Button: Ghost Secondary xs, 16px icon, on the title's line, last in the DOM", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    const cell = slot("dialog-close-cell")
    expect(cell).toHaveClass("absolute", "top-4", "end-4", "h-[1lh]", "text-lg", "items-center")
    expect(content()!.lastElementChild).toBe(cell)
    const button = slot("dialog-close-button")
    expect(button).toHaveAttribute("data-variant", "ghost")
    expect(button).toHaveAttribute("data-tone", "secondary")
    expect(button).toHaveAttribute("data-size", "icon-xs")
    expect(button.querySelector("svg")).toHaveClass("lucide-x")
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("puts the back button before the title in the Back type, and lines the description up with the title", async () => {
    render(<Example header={{ onBack: () => {} }} />)
    await screen.findByRole("dialog")
    const header = slot("dialog-header")
    expect(header).toHaveAttribute("data-type", "back")
    expect(header).toHaveClass("grid-cols-[auto_minmax(0,1fr)]", "gap-x-1", "[&>:not([data-slot=dialog-back-cell])]:col-start-2")
    const cell = header.firstElementChild as HTMLElement
    expect(cell).toHaveAttribute("data-slot", "dialog-back-cell")
    expect(cell).toHaveClass("col-start-1", "row-start-1", "h-[1lh]", "w-4", "text-lg")
    const button = slot("dialog-back-button")
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveAttribute("data-variant", "ghost")
    expect(button).toHaveAttribute("data-size", "icon-xs")
  })

  it("points the back chevron to the start, so it flips in RTL", async () => {
    render(<Example header={{ onBack: () => {} }} />)
    await screen.findByRole("dialog")
    const svg = slot("dialog-back-button").querySelector("svg")!
    expect(svg).toHaveClass("lucide-chevron-left", "[&:dir(rtl)]:-scale-x-100")
  })

  it("draws the footer: a border above it, 16px above the actions, 8px between them", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    expect(slot("dialog-footer")).toHaveClass("border-t", "border-border", "pt-4", "gap-2")
  })

  it("lays the actions in a row at the end by default, and sends a third one to the start", async () => {
    render(<Example />)
    await screen.findByRole("dialog")
    const footer = slot("dialog-footer")
    expect(footer).toHaveAttribute("data-layout", "horizontal")
    expect(footer).toHaveClass("justify-end", "flex-wrap", "[&>:first-child:not([data-slot=dialog-footer-close]):nth-last-child(n+3)]:me-auto")
    expect(footer).not.toHaveClass("flex-col")
  })

  it("stacks the actions full width with layout stacked", async () => {
    render(<Example footer={{ layout: "stacked" }} />)
    await screen.findByRole("dialog")
    const footer = slot("dialog-footer")
    expect(footer).toHaveAttribute("data-layout", "stacked")
    expect(footer).toHaveClass("flex-col", "[&>*]:w-full")
    expect(footer).not.toHaveClass("justify-end")
  })

  it("keeps the actions in DOM order, so a right-to-left page mirrors them", async () => {
    render(
      <Example
        footer={{
          actions: (
            <>
              <Button variant="ghost">Skip</Button>
              <Button variant="outline">Previous</Button>
              <Button>Next</Button>
            </>
          ),
        }}
      />
    )
    await screen.findByRole("dialog")
    const buttons = [...slot("dialog-footer").querySelectorAll("button")].map((b) => b.textContent)
    expect(buttons).toEqual(["Skip", "Previous", "Next"])
  })

  it("pins the header and the footer, and scrolls only what sits between them", async () => {
    render(<Example extra={<p data-testid="extra">More</p>} />)
    await screen.findByRole("dialog")
    const scroll = slot("dialog-scroll")
    const parts = [...scroll.children].map((el) => el.getAttribute("data-slot") ?? el.getAttribute("data-testid") ?? el.tagName)
    expect(parts).toEqual(["dialog-header", "LABEL", "extra", "dialog-footer"])
    expect(slot("dialog-header")).toHaveClass("sticky", "-top-4", "-mt-4", "bg-popover")
    expect(slot("dialog-footer")).toHaveClass("sticky", "-bottom-4", "-mb-4", "bg-popover")
    // The box itself never scrolls: the close button stays where it is.
    expect(content()).toHaveClass("overflow-hidden", "flex-col")
    expect(slot("dialog-scroll")).toHaveClass("min-h-0", "flex-auto")
  })

  it("names no physical side anywhere, so it mirrors with the page", async () => {
    render(<Example header={{ onBack: () => {} }} footer={{ layout: "horizontal" }} />)
    await screen.findByRole("dialog")
    const classes = [content()!, ...content()!.querySelectorAll<HTMLElement>("*")].flatMap((el) =>
      [...el.classList].filter((c) => /^(?:-?(?:ml|mr|pl|pr|left|right)-|text-(?:left|right)$|rounded-[lr]-)/.test(c))
    )
    expect(classes).toEqual([])
  })
})

describe("Dialog — direction", () => {
  // The font is copied too; jsdom does not inherit `font-family`, so that was
  // checked in a browser (Cairo on the docs site's Arabic pages).
  it("takes the page's direction and language into the portalled dialog", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Example />
      </div>
    )
    await screen.findByRole("dialog")
    expect(content()).toHaveAttribute("dir", "rtl")
    expect(content()).toHaveAttribute("lang", "ar")
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
    expect(container.querySelector("[data-slot=dialog-anchor]")).toHaveAttribute("hidden")
  })
})

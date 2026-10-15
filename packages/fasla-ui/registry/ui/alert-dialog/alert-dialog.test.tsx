import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import { TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
  type AlertDialogActionProps,
} from "./alert-dialog"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and runs no transitions, so nothing here proves
 * where the dialog sits, how wide it is, or that the type is Figma's. Those
 * were measured in a real browser in both directions: 512px wide, 24px
 * padding, 16px gaps, the 8px title gap, 28/20px lines in English and 32/24
 * in Arabic, the actions at the end of the row (mirrored in RTL). The visual
 * tests below assert class presence only.
 */

function Example({
  defaultOpen = true,
  onAction,
  actionProps,
  extra,
  ...content
}: Partial<AlertDialogContentProps> & {
  defaultOpen?: boolean
  onAction?: AlertDialogActionProps["onClick"]
  actionProps?: Partial<AlertDialogActionProps>
  extra?: React.ReactNode
}) {
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger>Delete project</AlertDialogTrigger>
      <AlertDialogContent {...content}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>Its files and history are removed for everyone.</AlertDialogDescription>
        </AlertDialogHeader>
        {extra}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAction} {...actionProps}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const content = () => document.querySelector<HTMLElement>("[data-slot=alert-dialog-content]")
const overlay = () => document.querySelector<HTMLElement>("[data-slot=alert-dialog-overlay]")
const slot = (name: string) => content()!.querySelector<HTMLElement>(`[data-slot=${name}]`)!

describe("AlertDialog — behaviour", () => {
  it("renders only the trigger while closed", () => {
    render(<Example defaultOpen={false} />)
    expect(screen.getByRole("button", { name: "Delete project" })).toBeInTheDocument()
    expect(content()).toBeNull()
  })

  it("opens from the trigger as an alertdialog named by its title and described by its description", async () => {
    render(<Example defaultOpen={false} />)
    fireEvent.click(screen.getByRole("button", { name: "Delete project" }))
    const dialog = await screen.findByRole("alertdialog")
    expect(dialog).toHaveAccessibleName("Delete this project?")
    expect(dialog).toHaveAccessibleDescription("Its files and history are removed for everyone.")
  })

  it("moves focus to Cancel when it opens, and back to the trigger when it closes", async () => {
    render(<Example defaultOpen={false} />)
    const trigger = screen.getByRole("button", { name: "Delete project" })
    act(() => trigger.focus())
    fireEvent.click(trigger)
    await waitFor(() => expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus())
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(content()).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("closes on Escape", async () => {
    render(<Example />)
    const dialog = await screen.findByRole("alertdialog")
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(content()).toBeNull())
  })

  it("stays open when the overlay is pressed", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    fireEvent.pointerDown(overlay()!)
    fireEvent.mouseDown(overlay()!)
    fireEvent.click(overlay()!)
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
  })

  it("closes from Cancel and from the main action, after the action's onClick", async () => {
    const onAction = vi.fn()
    const { unmount } = render(<Example onAction={onAction} />)
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }))
    expect(onAction).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(content()).toBeNull())
    unmount()

    render(<Example />)
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(content()).toBeNull())
  })

  it("stays open when the action's onClick calls preventBaseUIHandler", async () => {
    render(
      <Example
        onAction={(event) => event.preventBaseUIHandler()}
      />
    )
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }))
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
  })

  it("follows a controlled open and reports changes", async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <AlertDialog open={false} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of every device?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(content()).toBeNull()
    rerender(
      <AlertDialog open onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of every device?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    // Still controlled: it stays open until `open` changes.
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
  })

  it("passes loading to the action's Button", async () => {
    render(<Example actionProps={{ loading: true, loadingLabel: "Deleting" }} />)
    const action = await screen.findByRole("button", { name: /Delete/ })
    expect(action).toBeDisabled()
    expect(screen.getByRole("status")).toHaveTextContent("Deleting")
  })
})

describe("AlertDialog — Figma variants", () => {
  it("uses Outline Secondary md for Cancel and Solid Primary md for the action by default", async () => {
    render(<Example />)
    const cancel = await screen.findByRole("button", { name: "Cancel" })
    const action = screen.getByRole("button", { name: "Delete" })
    expect(cancel).toHaveAttribute("data-variant", "outline")
    expect(cancel).toHaveAttribute("data-tone", "secondary")
    expect(cancel).toHaveAttribute("data-size", "md")
    expect(action).toHaveAttribute("data-variant", "default")
    expect(action).toHaveAttribute("data-tone", "primary")
    expect(action).toHaveAttribute("data-size", "md")
    expect(content()).not.toHaveAttribute("data-destructive")
  })

  it("turns the action Solid Destructive when destructive", async () => {
    render(<Example destructive />)
    const action = await screen.findByRole("button", { name: "Delete" })
    expect(action).toHaveAttribute("data-variant", "destructive")
    expect(action).toHaveClass("bg-destructive", "text-destructive-foreground")
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("data-variant", "outline")
    expect(content()).toHaveAttribute("data-destructive", "true")
  })

  it("puts Cancel before the action, so a right-to-left page mirrors the pair", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    const buttons = [...slot("alert-dialog-footer").querySelectorAll("button")].map((b) => b.textContent)
    expect(buttons).toEqual(["Cancel", "Delete"])
  })

  it("aligns to the edge by default: text at the start, actions at the end", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(content()).toHaveAttribute("data-align", "edge")
    expect(slot("alert-dialog-header")).toHaveClass("text-start")
    expect(slot("alert-dialog-header")).not.toHaveClass("flex-col")
    expect(slot("alert-dialog-footer")).toHaveClass("justify-end")
  })

  it("centres the text and the actions when align is center", async () => {
    render(<Example align="center" />)
    await screen.findByRole("alertdialog")
    expect(content()).toHaveAttribute("data-align", "center")
    expect(slot("alert-dialog-header")).toHaveClass("flex-col", "items-center", "text-center")
    expect(slot("alert-dialog-footer")).toHaveClass("justify-center")
  })

  it("has no icon unless asked for", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(content()!.querySelector("[data-slot=alert-dialog-icon]")).toBeNull()
  })

  it("shows Figma's circle-alert for icon, hidden from assistive tech, in the title's colour", async () => {
    render(<Example icon />)
    await screen.findByRole("alertdialog")
    const icon = slot("alert-dialog-icon")
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(icon).toHaveClass("text-foreground", "[&_svg]:size-6")
    expect(icon.querySelector("svg")).toHaveClass("lucide-circle-alert")
    expect(icon.querySelector("svg")).toHaveAttribute("stroke-width", "1.5")
  })

  it("puts the edge icon beside one column that holds the text and the additional content", async () => {
    render(<Example icon extra={<p data-testid="extra">Type the project name to confirm.</p>} />)
    await screen.findByRole("alertdialog")
    const icon = slot("alert-dialog-icon")
    // The icon belongs to the box, first, in the first column and first row.
    expect(icon.parentElement).toBe(content())
    expect(content()!.firstElementChild).toBe(icon)
    expect(icon).toHaveClass("col-start-1", "row-start-1", "self-start")
    // One line of the title tall, with the 24px icon centred in it.
    expect(icon).toHaveClass("h-[1lh]", "w-6", "text-lg", "items-center", "justify-center")
    // Everything else but the footer starts in the second column; the footer spans both.
    expect(content()).toHaveClass(
      "grid-cols-[auto_minmax(0,1fr)]",
      "[&>:not([data-slot=alert-dialog-icon],[data-slot=alert-dialog-footer])]:col-start-2",
      "[&>[data-slot=alert-dialog-footer]]:col-span-full"
    )
    expect(slot("alert-dialog-header").querySelector("[data-slot=alert-dialog-icon]")).toBeNull()
    expect(screen.getByTestId("extra").parentElement).toBe(content())
  })

  it("keeps one full-width column in edge without an icon", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(content()).toHaveClass("grid-cols-[minmax(0,1fr)]")
    expect(content()).not.toHaveClass("grid-cols-[auto_minmax(0,1fr)]")
  })

  it("puts the center icon above the title, inside the header", async () => {
    render(<Example align="center" icon />)
    await screen.findByRole("alertdialog")
    const icon = slot("alert-dialog-icon")
    expect(icon.parentElement).toBe(slot("alert-dialog-header"))
    expect(icon.nextElementSibling).toBe(slot("alert-dialog-text"))
    expect(icon).toHaveClass("size-6")
    expect(content()).toHaveClass("grid-cols-[minmax(0,1fr)]")
  })

  it.each(["edge", "center"] as const)("gives an icon of your own the same cell as circle-alert, in %s", async (align) => {
    const { unmount } = render(<Example align={align} icon />)
    await screen.findByRole("alertdialog")
    const builtIn = slot("alert-dialog-icon").className
    unmount()

    // Even an icon that asks for another size is drawn at 24px in the cell.
    render(<Example align={align} icon={<TrashIcon className="size-4" strokeWidth={1.5} />} />)
    await screen.findByRole("alertdialog")
    const icon = slot("alert-dialog-icon")
    expect(icon.className).toBe(builtIn)
    expect(icon).toHaveClass("text-foreground", "[&_svg]:size-6")
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(icon.querySelector("svg")).toHaveClass("lucide-trash")
    expect(icon.querySelector(".lucide-circle-alert")).toBeNull()
  })

  it("keeps content placed between the header and the footer in that order", async () => {
    render(<Example extra={<p data-testid="extra">Type the project name to confirm.</p>} />)
    await screen.findByRole("alertdialog")
    const parts = [...content()!.children].map((el) => el.getAttribute("data-slot") ?? el.getAttribute("data-testid"))
    expect(parts).toEqual(["alert-dialog-header", "extra", "alert-dialog-footer"])
  })

  it("draws Figma's box: 512px at most, 24px padding, 16px gaps, radius lg, shadow lg, background", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(content()).toHaveClass(
      "max-w-lg",
      "p-6",
      "gap-4",
      "rounded-lg",
      "shadow-lg",
      "bg-background",
      "grid",
      "inset-x-4",
      "mx-auto"
    )
    expect(slot("alert-dialog-text")).toHaveClass("gap-2")
    expect(slot("alert-dialog-header")).toHaveClass("gap-4")
    expect(slot("alert-dialog-footer")).toHaveClass("gap-2")
  })

  it("sets the title LG Semi Bold in foreground and the description SM in muted-foreground", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(slot("alert-dialog-title")).toHaveClass("text-lg", "font-semibold", "text-foreground")
    expect(slot("alert-dialog-title").tagName).toBe("H2")
    expect(slot("alert-dialog-description")).toHaveClass("text-sm", "text-muted-foreground")
  })

  it("lays the overlay token over the page", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(overlay()).toHaveClass("fixed", "inset-0", "bg-backdrop-overlay")
  })

  it("names no physical side anywhere, so it mirrors with the page", async () => {
    render(<Example icon />)
    await screen.findByRole("alertdialog")
    const classes = [content()!, ...content()!.querySelectorAll<HTMLElement>("*")].flatMap((el) =>
      [...el.classList].filter((c) => /^(?:-?(?:ml|mr|pl|pr|left|right)-|text-(?:left|right)$|rounded-[lr]-)/.test(c))
    )
    expect(classes).toEqual([])
  })
})

describe("AlertDialog — direction", () => {
  // The font is copied too; jsdom does not inherit `font-family`, so that was
  // checked in a browser (Cairo on the docs site's Arabic pages).
  it("takes the page's direction and language into the portalled dialog", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Example />
      </div>
    )
    await screen.findByRole("alertdialog")
    expect(content()).toHaveAttribute("dir", "rtl")
    expect(content()).toHaveAttribute("lang", "ar")
  })

  it("is left-to-right on a page with no direction", async () => {
    render(<Example />)
    await screen.findByRole("alertdialog")
    expect(content()).toHaveAttribute("dir", "ltr")
  })

  it("follows the page when its direction changes while open", async () => {
    render(
      <div data-testid="page" dir="ltr" lang="en">
        <Example />
      </div>
    )
    await screen.findByRole("alertdialog")
    const page = screen.getByTestId("page")
    await act(async () => {
      page.setAttribute("dir", "rtl")
      page.setAttribute("lang", "ar")
    })
    await waitFor(() => expect(content()).toHaveAttribute("dir", "rtl"))
    expect(content()).toHaveAttribute("lang", "ar")
  })

  it("reads the direction when it opens, after the page changed while it was closed", async () => {
    render(
      <div data-testid="page" dir="ltr" lang="en">
        <Example defaultOpen={false} />
      </div>
    )
    const page = screen.getByTestId("page")
    page.setAttribute("dir", "rtl")
    page.setAttribute("lang", "ar")
    fireEvent.click(screen.getByRole("button", { name: "Delete project" }))
    await screen.findByRole("alertdialog")
    expect(content()).toHaveAttribute("dir", "rtl")
    expect(content()).toHaveAttribute("lang", "ar")
  })

  it("leaves no box in the page where it is written", () => {
    const { container } = render(<Example defaultOpen={false} />)
    const anchor = container.querySelector("[data-slot=alert-dialog-anchor]")
    expect(anchor).toHaveAttribute("hidden")
  })
})

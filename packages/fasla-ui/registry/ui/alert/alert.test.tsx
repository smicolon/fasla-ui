import * as React from "react"
import { beforeAll, describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle, type AlertProps } from "./alert"

/*
 * The close button's default name is two runs, and CSS keeps the one matching
 * the nearest `lang`. jsdom loads no Tailwind, so inject exactly the compiled
 * rules the name depends on.
 */
beforeAll(() => {
  const style = document.createElement("style")
  style.textContent = [
    ".hidden { display: none }",
    ".\\[\\&\\:lang\\(ar\\)\\]\\:hidden:lang(ar) { display: none }",
    ".\\[\\&\\:lang\\(ar\\)\\]\\:inline:lang(ar) { display: inline }",
  ].join("\n")
  document.head.append(style)
})

/** Figma's alert: icon, title, description, action and close. */
function Full(props: AlertProps) {
  return (
    <Alert {...props}>
      <AlertTitle>New message</AlertTitle>
      <AlertDescription>12 unread messages. Open them to read.</AlertDescription>
      <AlertAction>View</AlertAction>
      <AlertClose />
    </Alert>
  )
}

const VARIANTS = ["default", "info", "success", "warning", "destructive"] as const
const TYPES = ["outline", "solid", "soft"] as const

const box = () => document.querySelector<HTMLElement>("[data-slot=alert]")!
const icon = () => document.querySelector<HTMLElement>("[data-slot=alert-icon]")
const part = (slot: string) => document.querySelector<HTMLElement>(`[data-slot=${slot}]`)!

describe("Alert", () => {
  it("defaults to the default variant and outline type, Figma's defaults", () => {
    render(<Full />)
    expect(box()).toHaveAttribute("data-variant", "default")
    expect(box()).toHaveAttribute("data-type", "outline")
    expect(box()).toHaveClass("bg-card", "ring-1", "ring-inset", "ring-border", "text-foreground")
  })

  it("is Figma's box: 16px inline and 12px block padding, border radius/lg, full width", () => {
    render(<Full />)
    expect(box()).toHaveClass("px-4", "py-3", "rounded-lg", "w-full", "text-sm")
  })

  describe("role follows how urgent the message is", () => {
    it.each(VARIANTS.filter((v) => v !== "destructive"))("%s is a status", (variant) => {
      render(<Full variant={variant} />)
      expect(screen.getByRole("status")).toBe(box())
      expect(screen.queryByRole("alert")).toBeNull()
    })

    it("destructive is an alert", () => {
      render(<Full variant="destructive" />)
      expect(screen.getByRole("alert")).toBe(box())
    })

    it("takes another role when given one", () => {
      render(<Full variant="destructive" role="note" />)
      expect(screen.getByRole("note")).toBe(box())
      expect(screen.queryByRole("alert")).toBeNull()
    })
  })

  describe("the icon", () => {
    it.each([
      ["default", "lucide-info"],
      ["info", "lucide-info"],
      ["success", "lucide-circle-check"],
      ["warning", "lucide-triangle-alert"],
      ["destructive", "lucide-circle-alert"],
    ] as const)("%s shows Figma's %s", (variant, glyph) => {
      render(<Full variant={variant} />)
      const svg = icon()!.querySelector("svg")!
      expect(svg).toHaveClass(glyph)
      expect(svg).toHaveAttribute("stroke-width", "1.5")
    })

    it("is hidden from assistive technology, beside the title in the first column", () => {
      render(<Full />)
      expect(icon()).toHaveAttribute("aria-hidden", "true")
      expect(icon()).toHaveClass("col-start-1", "me-3", "[&>svg]:size-4")
    })

    it("is centred on the title's first line, whatever the script", () => {
      render(<Full />)
      expect(icon()).toHaveClass("min-h-[1lh]", "items-center", "text-sm", "self-start")
    })

    it("can be left out", () => {
      render(<Full icon={false} />)
      expect(icon()).toBeNull()
    })

    it("can be any element, such as an avatar", () => {
      render(<Full icon={<img alt="" data-testid="avatar" />} />)
      expect(icon()).toContainElement(screen.getByTestId("avatar"))
    })
  })

  describe("colours, as the Figma set binds them", () => {
    it.each([
      ["outline", "default", ["bg-card", "ring-border", "text-foreground"], "text-muted-foreground"],
      ["outline", "info", ["bg-card", "ring-info", "text-info"], "text-info"],
      ["outline", "success", ["bg-card", "ring-success", "text-success"], "text-success"],
      ["outline", "warning", ["bg-card", "ring-warning", "text-warning"], "text-warning"],
      ["outline", "destructive", ["bg-card", "ring-destructive", "text-destructive"], "text-destructive"],
      ["solid", "default", ["bg-primary", "text-foreground-inverse"], "text-foreground-inverse"],
      ["solid", "info", ["bg-info", "text-foreground-inverse"], "text-foreground-inverse"],
      ["solid", "success", ["bg-success", "text-foreground-inverse"], "text-foreground-inverse"],
      ["solid", "warning", ["bg-warning", "text-foreground-inverse"], "text-foreground-inverse"],
      ["solid", "destructive", ["bg-destructive", "text-foreground-inverse"], "text-foreground-inverse"],
      ["soft", "default", ["bg-card", "from-soft-primary", "text-primary"], "text-primary"],
      ["soft", "info", ["bg-card", "from-soft-info", "text-info"], "text-info"],
      ["soft", "success", ["bg-card", "from-soft-success", "text-success"], "text-success"],
      ["soft", "warning", ["bg-card", "from-soft-warning", "text-warning"], "text-warning"],
      ["soft", "destructive", ["bg-card", "from-soft-destructive", "text-destructive"], "text-destructive"],
    ] as const)("%s %s", (type, variant, boxClasses, description) => {
      render(<Full type={type} variant={variant} />)
      expect(box()).toHaveClass(...boxClasses)
      expect(part("alert-description")).toHaveClass(description)
    })

    it("draws only Outline with a stroke", () => {
      for (const type of TYPES) {
        const { unmount } = render(<Full type={type} variant="info" />)
        if (type === "outline") expect(box()).toHaveClass("ring-1")
        else expect(box()).not.toHaveClass("ring-1")
        unmount()
      }
    })

    it("keeps an edge in forced colours", () => {
      render(<Full />)
      expect(box()).toHaveClass("forced-colors:border", "forced-colors:border-[CanvasText]")
    })
  })

  describe("title and description", () => {
    it("sit in the text column, 2px apart, the title in medium", () => {
      render(<Full />)
      expect(part("alert-title")).toHaveClass("col-start-2", "font-medium")
      expect(part("alert-description")).toHaveClass("col-start-2", "[[data-slot=alert-title]+&]:mt-0.5")
    })

    it("break long words and underline links", () => {
      render(<Full />)
      for (const slot of ["alert-title", "alert-description"]) {
        expect(part(slot)).toHaveClass("break-words", "[&_a]:underline")
      }
    })

    it("put any other content in the text column too", () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          <ul data-testid="extra" />
        </Alert>
      )
      expect(box()).toHaveClass("[&>:not([data-slot^=alert])]:col-start-2")
    })
  })

  describe("the action", () => {
    it.each([
      ["outline", "outline", "primary"],
      ["solid", "default", "secondary"],
      ["soft", "default", "primary"],
    ] as const)("in %s is Figma's %s Button in %s, at xs", (type, variant, tone) => {
      render(<Full type={type} />)
      const action = screen.getByRole("button", { name: "View" })
      expect(action).toHaveAttribute("data-variant", variant)
      expect(action).toHaveAttribute("data-tone", tone)
      expect(action).toHaveAttribute("data-size", "xs")
      expect(action).toHaveAttribute("type", "button")
    })

    it("comes before the close button, 12px from the text", () => {
      render(<Full />)
      const action = screen.getByRole("button", { name: "View" })
      const close = screen.getByRole("button", { name: "Close" })
      expect(action.compareDocumentPosition(close) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(action).toHaveClass("col-start-3", "ms-3")
      expect(close).toHaveClass("col-start-4", "ms-3")
    })

    it("takes Button's props", () => {
      const onClick = vi.fn()
      render(
        <Alert>
          <AlertAction variant="ghost" size="sm" onClick={onClick}>
            Undo
          </AlertAction>
        </Alert>
      )
      const action = screen.getByRole("button", { name: "Undo" })
      expect(action).toHaveAttribute("data-variant", "ghost")
      expect(action).toHaveAttribute("data-size", "sm")
      fireEvent.click(action)
      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe("the close button", () => {
    it("is Ghost Icon Button at icon-xs with a 16px ×", () => {
      render(<Full />)
      const close = screen.getByRole("button", { name: "Close" })
      expect(close).toHaveAttribute("data-variant", "ghost")
      expect(close).toHaveAttribute("data-size", "icon-xs")
      expect(close.querySelector("svg")).toHaveClass("lucide-x")
      expect(close.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
    })

    it("is named in the page's language", () => {
      render(
        <div lang="ar">
          <Full />
        </div>
      )
      expect(screen.getByRole("button", { name: "إغلاق" })).toBeTruthy()
    })

    it("takes another name from label", () => {
      render(
        <Alert>
          <AlertClose label="Dismiss the message" />
        </Alert>
      )
      expect(screen.getByRole("button", { name: "Dismiss the message" })).toBeTruthy()
    })

    it("hovers in the × colour at 20% on Solid, where Ghost's grey would hide it", () => {
      render(<Full type="solid" />)
      const close = screen.getByRole("button", { name: "Close" })
      expect(close).toHaveClass("text-foreground-inverse", "hover:bg-foreground-inverse/20")
      expect(close).not.toHaveClass("hover:bg-accent")
    })

    it("rings focus in the × colour on Solid, so the ring holds 3:1 on the fill", () => {
      render(<Full type="solid" />)
      expect(screen.getByRole("button", { name: "Close" })).toHaveClass("after:ring-foreground-inverse")
      expect(screen.getByRole("button", { name: "View" })).toHaveClass("after:ring-foreground-inverse")
      expect(screen.getByRole("button", { name: "Close" })).not.toHaveClass("after:ring-ring")
    })

    it("keeps Button's own focus ring elsewhere", () => {
      render(<Full type="outline" />)
      expect(screen.getByRole("button", { name: "Close" })).toHaveClass("after:ring-ring")
      expect(screen.getByRole("button", { name: "View" })).toHaveClass("after:ring-ring")
    })

    it("keeps Ghost's own hover elsewhere", () => {
      render(<Full type="soft" />)
      expect(screen.getByRole("button", { name: "Close" })).toHaveClass("text-foreground", "hover:bg-accent")
    })

    it("closes the alert and reports it", () => {
      const onOpenChange = vi.fn()
      render(<Full onOpenChange={onOpenChange} />)
      fireEvent.click(screen.getByRole("button", { name: "Close" }))
      expect(box()).toBeNull()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it("leaves the alert open when onClick prevents the default", () => {
      render(
        <Alert>
          <AlertClose onClick={(event) => event.preventDefault()} />
        </Alert>
      )
      fireEvent.click(screen.getByRole("button", { name: "Close" }))
      expect(box()).not.toBeNull()
    })

    it("leaves a controlled alert to its owner", () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(<Full open onOpenChange={onOpenChange} />)
      fireEvent.click(screen.getByRole("button", { name: "Close" }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(box()).not.toBeNull()
      rerender(<Full open={false} onOpenChange={onOpenChange} />)
      expect(box()).toBeNull()
    })

    it("reports to the onOpenChange of the latest render", () => {
      const first = vi.fn()
      const latest = vi.fn()
      const { rerender } = render(<Full open onOpenChange={first} />)
      rerender(<Full open onOpenChange={latest} />)
      fireEvent.click(screen.getByRole("button", { name: "Close" }))
      expect(first).not.toHaveBeenCalled()
      expect(latest).toHaveBeenCalledWith(false)
    })
  })

  it("starts closed with defaultOpen={false}", () => {
    render(<Full defaultOpen={false} />)
    expect(box()).toBeNull()
  })

  it("forwards its ref and extra props", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Alert ref={ref} id="notice" className="max-w-xl">
        <AlertTitle>Title</AlertTitle>
      </Alert>
    )
    expect(ref.current).toBe(box())
    expect(box()).toHaveAttribute("id", "notice")
    expect(box()).toHaveClass("max-w-xl")
  })

  it("has no direction prop: every inset is logical, so dir mirrors it", () => {
    render(<Full />)
    const classes = [box(), icon()!, part("alert-action"), part("alert-close")].flatMap((el) => [...el.classList])
    expect(classes.filter((c) => /(^|:)(ml|mr|pl|pr|left|right)-/.test(c))).toEqual([])
  })
})

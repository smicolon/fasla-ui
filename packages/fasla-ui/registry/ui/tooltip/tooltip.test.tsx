import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Tooltip, TooltipTrigger, TooltipContent, type TooltipContentProps } from "./tooltip"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine: every rect is zero, so Base UI cannot place the
 * tooltip, and nothing here proves which side of the trigger it lands on, how
 * far away, or where the arrow sits. Those were measured in a real browser in
 * both directions — 28px tall in English and 32 in Arabic, 6/12 padding, an
 * 8×4 arrow flush with the bubble (1px into a Rounded one on the sides) and
 * centred on the trigger, 4px from the trigger to its tip, 320px wide at most
 * (340 with an icon), `left`/`right` physical and `inline-*` mirrored in RTL.
 * The visual tests below assert class presence only. Treat a green run as
 * "the contract is wired", not "it looks right".
 */

function Example({
  open = true,
  label = "Share",
  ...content
}: Partial<TooltipContentProps> & { open?: boolean; label?: string }) {
  return (
    <Tooltip open={open}>
      <TooltipTrigger>{label}</TooltipTrigger>
      <TooltipContent {...content}>{content.children ?? "Copy link"}</TooltipContent>
    </Tooltip>
  )
}

const popup = () => document.querySelector<HTMLElement>("[data-slot=tooltip-content]")!
const positioner = () => document.querySelector<HTMLElement>("[data-slot=tooltip-positioner]")!
const slot = (name: string) => popup().querySelector<HTMLElement>(`[data-slot=${name}]`)

describe("Tooltip — behaviour", () => {
  it("renders the trigger as a button and nothing else while closed", () => {
    render(
      <Tooltip>
        <TooltipTrigger>Share</TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>
    )
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument()
    expect(popup()).toBeNull()
  })

  it("opens on keyboard focus and closes on Escape", async () => {
    render(
      <Tooltip>
        <TooltipTrigger>Share</TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>
    )
    const trigger = screen.getByRole("button", { name: "Share" })
    await act(async () => {
      trigger.focus()
    })
    expect(await screen.findByText("Copy link")).toBeInTheDocument()
    await act(async () => {
      fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" })
    })
    expect(screen.queryByText("Copy link")).toBeNull()
  })

  it("portals the tooltip to <body>, or into the container it is given", () => {
    const { unmount } = render(<Example />)
    expect(positioner().parentElement?.parentElement).toBe(document.body)
    unmount()

    const container = document.createElement("div")
    document.body.appendChild(container)
    render(<Example container={container} />)
    expect(container.contains(popup())).toBe(true)
    container.remove()
  })
})

describe("Tooltip — direction and language come from the trigger", () => {
  it("carries the trigger's dir and lang onto the portalled tooltip", () => {
    render(
      <div dir="rtl" lang="ar">
        <Example label="مشاركة">نسخ الرابط</Example>
      </div>
    )
    expect(positioner()).toHaveAttribute("dir", "rtl")
    expect(positioner()).toHaveAttribute("lang", "ar")
  })

  it("is left-to-right outside any rtl subtree", () => {
    render(<Example />)
    expect(positioner()).toHaveAttribute("dir", "ltr")
  })

  it("follows a dir that changes after mount, read when focus arrives", async () => {
    function Switcher() {
      const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr")
      return (
        <div dir={dir}>
          <button type="button" onClick={() => setDir("rtl")}>
            Flip
          </button>
          <Tooltip>
            <TooltipTrigger>Share</TooltipTrigger>
            <TooltipContent>Copy link</TooltipContent>
          </Tooltip>
        </div>
      )
    }
    render(<Switcher />)
    fireEvent.click(screen.getByRole("button", { name: "Flip" }))
    await act(async () => {
      screen.getByRole("button", { name: "Share" }).focus()
    })
    await screen.findByText("Copy link")
    expect(positioner()).toHaveAttribute("dir", "rtl")
  })

  it("reports the logical side it was asked for", () => {
    render(
      <div dir="rtl">
        <Example side="inline-start" />
      </div>
    )
    expect(popup()).toHaveAttribute("data-side", "inline-start")
    expect(slot("tooltip-arrow")).toHaveAttribute("data-side", "inline-start")
  })
})

describe("Tooltip — Figma Style and Radius", () => {
  it.each([
    ["primary", "bg-foreground", "text-background"],
    ["secondary", "bg-secondary", "text-secondary-foreground"],
    ["info", "bg-info", "text-info-foreground"],
    ["success", "bg-success", "text-success-foreground"],
    ["warning", "bg-warning", "text-warning-foreground"],
    ["destructive", "bg-destructive", "text-destructive-foreground"],
  ] as const)("%s is %s with %s", (variant, bg, text) => {
    render(<Example variant={variant} />)
    expect(popup()).toHaveClass(bg, text)
    expect(popup()).toHaveAttribute("data-variant", variant)
  })

  it("defaults to primary, standard radius, on top", () => {
    render(<Example />)
    expect(popup()).toHaveClass("bg-foreground", "rounded-[var(--radius-md)]")
    expect(popup()).toHaveAttribute("data-side", "top")
  })

  it("has Figma's 16px border radius/2xl when rounded, not a 9999px pill", () => {
    render(<Example radius="rounded" />)
    expect(popup()).toHaveClass("rounded-2xl")
    expect(popup()).not.toHaveClass("rounded-full")
    expect(popup()).not.toHaveClass("rounded-[var(--radius-md)]")
  })

  it("has Figma's padding, gap and type, with logical alignment", () => {
    render(<Example />)
    expect(popup()).toHaveClass("px-3", "py-1.5", "gap-1", "text-xs", "text-start")
  })

  it("caps the text at 296px, as Figma does, not the bubble", () => {
    render(<Example description="Sub title" />)
    expect(slot("tooltip-text")).toHaveClass("max-w-[296px]")
    expect(slot("tooltip-text")).toContainElement(slot("tooltip-description"))
    expect(popup().className).not.toMatch(/\bmax-w-/)
  })

  it("fades over 150ms, and not at all with reduced motion", () => {
    render(<Example />)
    expect(popup()).toHaveClass(
      "transition-opacity",
      "duration-150",
      "motion-reduce:transition-none",
      "data-[starting-style]:opacity-0",
      "data-[ending-style]:opacity-0"
    )
  })

  it("lets className override the look", () => {
    render(<Example className="px-4" />)
    expect(popup()).toHaveClass("px-4")
    expect(popup()).not.toHaveClass("px-3")
  })
})

describe("Tooltip — arrow (Figma Position)", () => {
  it("shows an arrow in the bubble's own colour by default", () => {
    render(<Example />)
    expect(slot("tooltip-arrow")).toHaveClass("bg-inherit")
  })

  it("has no arrow when arrow is off — Figma's None", () => {
    render(<Example arrow={false} />)
    expect(slot("tooltip-arrow")).toBeNull()
  })

  it("overlaps a Rounded bubble by 1px on the sides, and sits flush otherwise", () => {
    const { unmount } = render(<Example radius="rounded" side="left" />)
    expect(slot("tooltip-arrow")).toHaveClass(
      "data-[side=left]:left-[calc(100%-1px)]",
      "data-[side=inline-start]:start-[calc(100%-1px)]"
    )
    expect(slot("tooltip-arrow")).not.toHaveClass("data-[side=left]:left-full")
    // Top and bottom arrows meet a straight edge, so they stay flush.
    expect(slot("tooltip-arrow")).toHaveClass("data-[side=top]:top-full")
    unmount()

    render(<Example side="left" />)
    expect(slot("tooltip-arrow")).toHaveClass("data-[side=left]:left-full")
    expect(slot("tooltip-arrow")).not.toHaveClass("data-[side=left]:left-[calc(100%-1px)]")
  })

  it("mirrors the arrow on logical sides only", () => {
    render(<Example side="inline-end" />)
    expect(slot("tooltip-arrow")).toHaveClass(
      "data-[side=inline-end]:end-full",
      "rtl:data-[side=inline-end]:-scale-x-100"
    )
  })
})

describe("Tooltip — slots", () => {
  it("adds the description under the title at 70% of the text colour", () => {
    render(<Example description="Anyone with the link can view this file." />)
    const description = slot("tooltip-description")!
    expect(description).toHaveTextContent("Anyone with the link can view this file.")
    expect(description).toHaveClass("opacity-70")
    expect(slot("tooltip-title")).toHaveTextContent("Copy link")
  })

  it("uses muted-foreground for the description on Secondary", () => {
    render(<Example variant="secondary" description="Sub title" />)
    expect(slot("tooltip-description")).toHaveClass("text-muted-foreground")
    expect(slot("tooltip-description")).not.toHaveClass("opacity-70")
  })

  it("renders no description, icon or avatar unless given", () => {
    render(<Example />)
    expect(slot("tooltip-description")).toBeNull()
    expect(slot("tooltip-icon")).toBeNull()
    expect(slot("tooltip-avatar")).toBeNull()
  })

  it("sizes the icon to 16px and hides it from assistive technology", () => {
    render(<Example icon={<svg data-testid="glyph" />} />)
    expect(slot("tooltip-icon")).toHaveClass("[&_svg]:size-4")
    expect(slot("tooltip-icon")).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByTestId("glyph")).toBeInTheDocument()
  })

  it("renders the avatar as our round Avatar at size 12, centred in a 16px slot, before the icon", () => {
    render(<Example avatar={{ name: "Layla Haddad" }} icon={<svg />} />)
    const avatar = slot("tooltip-avatar")!
    expect(avatar).toHaveClass("w-4", "justify-center", "items-center")
    expect(avatar.firstElementChild).toHaveClass("size-3")
    expect(avatar.querySelector(".rounded-full")).not.toBeNull()
    expect(avatar.compareDocumentPosition(slot("tooltip-icon")!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    )
  })

  it("keeps the avatar at 12 even if a size sneaks through", () => {
    render(<Example avatar={{ name: "Layla Haddad", ...({ size: "32" } as object) }} />)
    expect(slot("tooltip-avatar")!.firstElementChild).toHaveClass("size-3")
  })
})

import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu"
import { menuItemClasses, menuPopupClasses } from "../select/select"

/**
 * What these tests can and cannot prove.
 *
 * jsdom applies no stylesheet and has no layout, so Base UI cannot place the
 * menu and the visual tests assert **class presence only** — that the right
 * utility lands on the right element. The 32px rows in both scripts, the
 * menu's 4px gap, the icon sizes, the tokens in Light and Dark and the RTL
 * mirror of the chevron and the submenu were measured in a real browser. The
 * wiring — roles, opening and closing, choosing, checking, disabled, the
 * direction handed to the menu — is real DOM and is tested as such.
 */

const trigger = () => screen.getByRole("button", { name: "Account" })
const slot = (name: string, root: ParentNode = document) => root.querySelector<HTMLElement>(`[data-slot=${name}]`)
const slots = (name: string, root: ParentNode = document) => [...root.querySelectorAll<HTMLElement>(`[data-slot=${name}]`)]
const classesOf = (el: Element) => el.getAttribute("class")!.split(" ")

async function open() {
  await act(async () => {
    fireEvent.click(trigger())
  })
}

/** A press on a row, as a mouse makes it. jsdom has no PointerEvent constructor for keyboard paths. */
async function press(row: HTMLElement) {
  await act(async () => {
    fireEvent.pointerDown(row, { pointerType: "mouse" })
    fireEvent.mouseDown(row)
    fireEvent.pointerUp(row, { pointerType: "mouse" })
    fireEvent.mouseUp(row)
    fireEvent.click(row)
  })
}

/** Figma's Basic Dropdown. */
function Basic(props: { onProfile?: () => void; onApi?: () => void; open?: boolean }) {
  return (
    <DropdownMenu open={props.open} modal={props.open ? false : undefined}>
      <DropdownMenuTrigger>Account</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.onProfile}>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem icon={<svg data-testid="icon" />}>Billing</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        <DropdownMenuItem disabled onClick={props.onApi}>
          API
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe("DropdownMenu — trigger and menu", () => {
  it("renders a button that opens a menu", async () => {
    render(<Basic />)
    expect(trigger().tagName).toBe("BUTTON")
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu")
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    await open()
    expect(screen.getByRole("menu")).toBeInTheDocument()
    expect(trigger()).toHaveAttribute("aria-expanded", "true")
  })

  it("draws the menu on Select's surface: the same classes, from tokens only", async () => {
    render(<Basic />)
    await open()
    const content = slot("dropdown-menu-content")!
    for (const c of menuPopupClasses.split(" ")) expect(classesOf(content)).toContain(c)
    expect(content).toHaveClass("rounded-[var(--radius-md)]", "border-input", "bg-popover", "text-popover-foreground", "p-1", "shadow-md", "min-w-32")
    // Unlike Select's menu it is not tied to the trigger's width.
    expect(content).not.toHaveClass("w-[var(--anchor-width)]")
  })

  it("opens below the trigger, lined up with its start edge", async () => {
    render(<Basic />)
    await open()
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("data-side", "bottom")
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("data-align", "start")
  })

  it("closes when a row is pressed, and runs its onClick", async () => {
    const onProfile = vi.fn()
    render(<Basic onProfile={onProfile} />)
    await open()
    await press(screen.getByRole("menuitem", { name: /Profile/ }))
    expect(onProfile).toHaveBeenCalledTimes(1)
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  it("passes a className to the menu", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    await open()
    expect(slot("dropdown-menu-content")).toHaveClass("w-72")
  })
})

describe("DropdownMenu — rows", () => {
  it("draws every row with Select's row classes: 32px, 8px padding and gap, radius sm", async () => {
    render(<Basic />)
    await open()
    for (const row of screen.getAllByRole("menuitem")) {
      // A destructive row swaps the text colours, at rest and highlighted, and only those.
      const swapped = ["text-popover-foreground", "data-[highlighted]:text-accent-foreground"]
      const expected = menuItemClasses
        .split(" ")
        .filter((c) => row.dataset.variant !== "destructive" || !swapped.includes(c))
      for (const c of expected) expect(classesOf(row)).toContain(c)
      expect(row).toHaveClass("min-h-8", "px-2", "py-1", "gap-2", "rounded-[var(--radius-sm)]", "text-sm")
    }
  })

  it("highlights in accent, and outlines the highlight in forced colours", async () => {
    render(<Basic />)
    await open()
    const row = screen.getByRole("menuitem", { name: /Profile/ })
    expect(row).toHaveClass(
      "data-[highlighted]:bg-accent",
      "data-[highlighted]:text-accent-foreground",
      "forced-colors:data-[highlighted]:[outline:2px_solid_Highlight]",
      "[outline:none]"
    )
    expect(row).not.toHaveClass("outline-none")
  })

  it("sets a destructive row's text and icon in destructive, highlighted too", async () => {
    render(
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<svg />}>Edit</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" icon={<svg />}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const row = screen.getByRole("menuitem", { name: "Delete" })
    expect(row).toHaveAttribute("data-variant", "destructive")
    expect(row).toHaveClass("text-destructive", "data-[highlighted]:text-destructive", "[&>svg]:text-destructive")
    const icon = slot("dropdown-menu-item-icon", row)!
    expect(icon).toHaveClass("text-destructive")
    expect(icon).not.toHaveClass("text-foreground")
    // A default row's icon stays foreground.
    const edit = screen.getByRole("menuitem", { name: "Edit" })
    expect(edit).toHaveAttribute("data-variant", "default")
    expect(slot("dropdown-menu-item-icon", edit)).toHaveClass("text-foreground")
  })

  it("dims a disabled row and will not run it", async () => {
    const onApi = vi.fn()
    render(<Basic onApi={onApi} />)
    await open()
    const api = screen.getByRole("menuitem", { name: "API" })
    expect(api).toHaveAttribute("aria-disabled", "true")
    expect(api).toHaveClass("data-[disabled]:opacity-50")
    await press(api)
    expect(onApi).not.toHaveBeenCalled()
  })

  it("puts the icon in a hidden 16px slot before the text, in foreground", async () => {
    render(<Basic />)
    await open()
    const billing = screen.getByRole("menuitem", { name: "Billing" })
    const icon = slot("dropdown-menu-item-icon", billing)!
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(icon).toHaveClass("[&_svg]:size-4", "text-foreground")
    expect(billing.firstElementChild).toBe(icon)
  })

  it("insets a row's text past the icon column", async () => {
    render(
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>My account</DropdownMenuLabel>
          <DropdownMenuItem inset>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByRole("menuitem")).toHaveClass("ps-8")
    expect(slot("dropdown-menu-label")).toHaveClass("ps-8")
  })

  it("sets the shortcut at the end, muted, with its keys left to right in both directions", async () => {
    render(
      <div dir="rtl">
        <Basic />
      </div>
    )
    await open()
    const shortcut = slot("dropdown-menu-shortcut")!
    expect(shortcut).toHaveTextContent("⇧⌘P")
    expect(shortcut).toHaveClass("ms-auto", "text-xs", "text-muted-foreground")
    // No `dir` on the pushed span itself: `ms-auto` must resolve against the
    // row's direction, or an RTL row seats the keys beside the label.
    expect(shortcut).not.toHaveAttribute("dir")
    expect(shortcut.firstElementChild).toHaveAttribute("dir", "ltr")
    expect(shortcut.firstElementChild).toHaveTextContent("⇧⌘P")
  })
})

describe("DropdownMenu — label, group and separator", () => {
  it("draws the label as Figma's Dropdown Label", async () => {
    render(<Basic />)
    await open()
    expect(slot("dropdown-menu-label")).toHaveClass("min-h-8", "px-2", "py-1", "text-sm", "font-medium", "text-popover-foreground")
  })

  it("names a group with the label inside it", async () => {
    render(
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByRole("group", { name: "My account" })).toContainElement(screen.getByRole("menuitem"))
  })

  it("renders a label outside any group as a plain heading, without throwing", () => {
    render(<Basic open />)
    const label = slot("dropdown-menu-label")!
    expect(label).toHaveTextContent("My account")
    expect(label).not.toHaveAttribute("aria-hidden")
  })

  it("draws the separator as Figma's: 1px of border with 4px either side", () => {
    render(<Basic open />)
    const separator = screen.getByRole("separator")
    expect(separator).toHaveAttribute("data-slot", "dropdown-menu-separator")
    expect(separator).toHaveClass("my-1", "h-px", "bg-border")
  })
})

describe("DropdownMenu — checkbox items", () => {
  function Checkboxes(props: { onCheckedChange?: (checked: boolean) => void; checked?: boolean; indicator?: "check" | "switch" }) {
    return (
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem defaultChecked indicator={props.indicator}>
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            indicator={props.indicator}
            checked={props.checked}
            onCheckedChange={(next) => props.onCheckedChange?.(next)}
          >
            Activity bar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  it("is a menuitemcheckbox with a check slot before the text that is always there", () => {
    render(<Checkboxes />)
    const [status, activity] = screen.getAllByRole("menuitemcheckbox")
    expect(status).toHaveAttribute("aria-checked", "true")
    expect(activity).toHaveAttribute("aria-checked", "false")
    for (const row of [status!, activity!]) {
      const indicator = slot("dropdown-menu-checkbox-indicator", row)!
      expect(indicator).toHaveClass("size-4", "shrink-0")
      expect(row.firstElementChild).toBe(indicator)
    }
    expect(slot("dropdown-menu-checkbox-indicator", status!)!.querySelector("svg")).not.toBeNull()
    expect(slot("dropdown-menu-checkbox-indicator", activity!)!.querySelector("svg")).toBeNull()
  })

  it("toggles on press and stays open", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkboxes onCheckedChange={onCheckedChange} />)
    const activity = screen.getByRole("menuitemcheckbox", { name: "Activity bar" })
    await press(activity)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(activity).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("menu")).toBeInTheDocument()
  })

  it("leaves a controlled value to its owner", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkboxes checked={false} onCheckedChange={onCheckedChange} />)
    const activity = screen.getByRole("menuitemcheckbox", { name: "Activity bar" })
    await press(activity)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(activity).toHaveAttribute("aria-checked", "false")
  })

  it("draws our Switch at the end with indicator=\"switch\": Solid when on, Outline when off", async () => {
    render(<Checkboxes indicator="switch" />)
    const [status, activity] = screen.getAllByRole("menuitemcheckbox")
    expect(slot("dropdown-menu-checkbox-indicator", status!)).toBeNull()
    const on = slot("dropdown-menu-switch", status!)!
    const off = slot("dropdown-menu-switch", activity!)!
    expect(status!.lastElementChild).toBe(on)
    expect(on.querySelector("input")).toBeChecked()
    expect(off.querySelector("input")).not.toBeChecked()
    expect(slot("track", on)).toHaveClass("bg-input", "group-has-[:checked]/switch:bg-primary")
    expect(slot("track", off)).toHaveClass("outline-input", "group-has-[:checked]/switch:outline-primary")

    await press(activity!)
    expect(activity).toHaveAttribute("aria-checked", "true")
    expect(off.querySelector("input")).toBeChecked()
    expect(slot("track", off)).toHaveClass("bg-input", "group-has-[:checked]/switch:bg-primary")
  })

  it("keeps the Switch out of the accessibility tree and the tab order: the row is the checkbox", () => {
    render(<Checkboxes indicator="switch" />)
    const wrap = slot("dropdown-menu-switch")!
    expect(wrap).toHaveAttribute("aria-hidden", "true")
    expect(wrap).toHaveClass("pointer-events-none")
    // inert, not only aria-hidden: a tabindex of -1 still leaves the checkbox focusable by assistive technology.
    expect(wrap).toHaveAttribute("inert")
    expect(wrap.querySelector("input")).toHaveAttribute("tabindex", "-1")
    expect(screen.queryByRole("switch")).not.toBeInTheDocument()
  })
})

describe("DropdownMenu — radio group", () => {
  function Positions(props: { onValueChange?: (value: string) => void }) {
    return (
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup defaultValue="top" onValueChange={(v) => props.onValueChange?.(v as string)}>
            <DropdownMenuLabel>Panel position</DropdownMenuLabel>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right" disabled>
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  it("is a labelled group of menuitemradio rows with a dot slot that is always there", () => {
    render(<Positions />)
    expect(screen.getByRole("group", { name: "Panel position" })).toBeInTheDocument()
    const rows = screen.getAllByRole("menuitemradio")
    expect(rows.map((r) => r.getAttribute("aria-checked"))).toEqual(["true", "false", "false"])
    for (const row of rows) expect(slot("dropdown-menu-radio-indicator", row)).toHaveClass("size-4", "shrink-0")
    expect(rows.map((r) => !!slot("dropdown-menu-radio-indicator", r)!.querySelector("svg"))).toEqual([true, false, false])
  })

  it("chooses on press, stays open, and skips a disabled row", async () => {
    const onValueChange = vi.fn()
    render(<Positions onValueChange={onValueChange} />)
    await press(screen.getByRole("menuitemradio", { name: "Bottom" }))
    expect(onValueChange).toHaveBeenLastCalledWith("bottom")
    expect(screen.getByRole("menuitemradio", { name: "Bottom" })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("menu")).toBeInTheDocument()
    onValueChange.mockClear()
    await press(screen.getByRole("menuitemradio", { name: "Right" }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe("DropdownMenu — submenu", () => {
  it("opens the submenu from its trigger row, which shows a chevron that mirrors in RTL", async () => {
    render(<Basic />)
    await open()
    const sub = screen.getByRole("menuitem", { name: "Invite users" })
    expect(sub).toHaveAttribute("aria-haspopup", "menu")
    const chevron = slot("dropdown-menu-sub-chevron", sub)!
    expect(chevron).toHaveAttribute("aria-hidden", "true")
    expect(chevron).toHaveClass("ms-auto", "text-foreground")
    // The element's own direction, not Tailwind 3's `rtl:`, which matches any RTL ancestor.
    expect(chevron.querySelector("svg")).toHaveClass("[&:dir(rtl)]:-scale-x-100")
    expect(sub).toHaveClass("data-[popup-open]:bg-accent", "forced-colors:data-[popup-open]:[outline:2px_solid_Highlight]")

    await press(sub)
    expect(sub).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("menuitem", { name: "Email" })).toBeInTheDocument()
    const content = slot("dropdown-menu-sub-content")!
    for (const c of menuPopupClasses.split(" ")) expect(classesOf(content)).toContain(c)
  })

  it("opens the submenu at the end of the line, in the page's direction", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Basic />
      </div>
    )
    await open()
    await press(screen.getByRole("menuitem", { name: "Invite users" }))
    const positioner = slot("dropdown-menu-sub-positioner")!
    expect(positioner).toHaveAttribute("dir", "rtl")
    expect(positioner).toHaveAttribute("data-side", "inline-end")
  })

  it("renders the submenu into the menu's container", () => {
    const host = document.createElement("div")
    document.body.appendChild(host)
    render(
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent container={host}>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(slots("dropdown-menu-content", host)).toHaveLength(1)
    expect(slots("dropdown-menu-sub-content", host)).toHaveLength(1)
    host.remove()
  })
})

describe("DropdownMenu — direction", () => {
  // The font is copied too; jsdom does not inherit `font-family`, so that was
  // checked in a browser (Cairo on the Arabic menu).
  it("hands the trigger's direction and language to the portalled menu", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Basic />
      </div>
    )
    await open()
    const positioner = slot("dropdown-menu-positioner")!
    expect(positioner).toHaveAttribute("dir", "rtl")
    expect(positioner).toHaveAttribute("lang", "ar")
  })

  it("renders a menu held open with open={true} in the wrapper's direction", () => {
    render(
      <div dir="rtl" lang="ar">
        <Basic open />
      </div>
    )
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("dir", "rtl")
  })

  it("follows a direction change while the menu is open", async () => {
    render(
      <div data-testid="page" dir="ltr" lang="en">
        <Basic open />
      </div>
    )
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("dir", "ltr")
    const page = screen.getByTestId("page")
    await act(async () => {
      page.setAttribute("dir", "rtl")
      page.setAttribute("lang", "ar")
    })
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("dir", "rtl")
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("lang", "ar")
  })

  it("stays left-to-right on a left-to-right page", async () => {
    render(<Basic />)
    await open()
    expect(slot("dropdown-menu-positioner")).toHaveAttribute("dir", "ltr")
  })
})

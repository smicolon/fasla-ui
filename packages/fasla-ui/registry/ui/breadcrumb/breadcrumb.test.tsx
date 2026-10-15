import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, describe, it, expect } from "vitest"
import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { HouseIcon, SlashIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu/dropdown-menu"

const SOURCE = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "breadcrumb.tsx"), "utf8")

/** The name a screen reader would hear from the ellipsis: its visible (not display: none) runs. */
function spokenName(el: HTMLElement) {
  return Array.from(el.querySelectorAll<HTMLElement>(".sr-only"))
    .filter((run) => getComputedStyle(run).display !== "none")
    .map((run) => run.textContent)
    .join("")
}

/*
 * The ellipsis name is two hidden runs, and CSS keeps the one matching the
 * nearest `lang`. jsdom loads no Tailwind, so inject exactly the compiled
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

/** Figma's Count=+4: the first item, the ellipsis, then the last two. */
const Collapsed = ({ separator }: { separator?: React.ReactNode }) => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/" icon={<HouseIcon data-testid="icon" />}>
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator data-testid="separator">{separator}</BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbEllipsis data-testid="ellipsis" />
      </BreadcrumbItem>
      <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink href="/documents">Documents</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage>Add Document</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
)

/** The docs' collapsed trail: the ellipsis opens a Dropdown Menu of the steps it hides, as links. */
const CollapsedWithMenu = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Hidden steps">
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem render={<a href="/projects" />}>Projects</DropdownMenuItem>
            <DropdownMenuItem render={<a href="/projects/website" />}>Website</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Add Document</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
)

describe("Breadcrumb", () => {
  it("is a navigation landmark named Breadcrumb by default", () => {
    render(<Collapsed />)
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveAttribute("data-slot", "breadcrumb")
  })

  it("takes its accessible name from aria-label", () => {
    render(<Breadcrumb aria-label="مسار التنقّل" />)
    expect(screen.getByRole("navigation", { name: "مسار التنقّل" })).toBeTruthy()
  })

  it("is an ordered list whose items are only the steps", () => {
    render(<Collapsed />)
    const list = screen.getByRole("list")
    expect(list.tagName).toBe("OL")
    // Separators are presentation and hidden, so they are not list items.
    expect(within(list).getAllByRole("listitem")).toHaveLength(4)
  })

  it("lays the trail out with Figma's 10px gap, in text-sm and muted-foreground", () => {
    render(<Collapsed />)
    expect(screen.getByRole("list")).toHaveClass(
      "flex",
      "flex-wrap",
      "items-center",
      "gap-x-2.5",
      "text-sm",
      "text-muted-foreground"
    )
  })
})

describe("BreadcrumbLink", () => {
  it("is a muted link that turns foreground on hover", () => {
    render(<Collapsed />)
    const link = screen.getByRole("link", { name: "Documents" })
    expect(link).toHaveAttribute("href", "/documents")
    expect(link).toHaveClass("text-muted-foreground", "hover:text-foreground", "motion-reduce:transition-none")
  })

  it("shows a visible focus outline on the ring token", () => {
    render(<Collapsed />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass(
      "focus-visible:outline",
      "focus-visible:outline-2",
      "focus-visible:outline-ring"
    )
  })

  it("renders a leading icon 4px from its label, hidden and on foreground", () => {
    render(<Collapsed />)
    const link = screen.getByRole("link", { name: "Home" })
    expect(link).toHaveClass("gap-1")
    const slot = screen.getByTestId("icon").parentElement!
    expect(slot).toHaveAttribute("aria-hidden", "true")
    expect(slot).toHaveAttribute("data-slot", "breadcrumb-icon")
    expect(slot).toHaveClass("text-foreground", "[&>svg]:size-3.5", "[&>svg]:[stroke-width:1.5]")
    // DOM order icon → label, so dir=rtl puts the icon at the start (the right).
    expect(link.firstElementChild).toBe(slot)
  })

  it("renders no icon slot without an icon", () => {
    render(<Collapsed />)
    expect(screen.getByRole("link", { name: "Documents" }).querySelector("[data-slot=breadcrumb-icon]")).toBeNull()
  })

  it("renders its child as the link with asChild, keeping the icon", () => {
    render(
      <BreadcrumbLink asChild icon={<HouseIcon data-testid="icon" />}>
        <a href="/home" data-router="">
          Home
        </a>
      </BreadcrumbLink>
    )
    const link = screen.getByRole("link", { name: "Home" })
    expect(link).toHaveAttribute("data-router")
    expect(link).toHaveAttribute("data-slot", "breadcrumb-link")
    expect(link).toHaveClass("text-muted-foreground")
    expect(link).toContainElement(screen.getByTestId("icon"))
  })

  it("forwards its ref to the anchor", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(<BreadcrumbLink ref={ref} href="/" />)
    expect(ref.current?.tagName).toBe("A")
  })
})

describe("BreadcrumbPage", () => {
  it("marks the current page, on foreground, and is not a link", () => {
    render(<Collapsed />)
    const page = screen.getByText("Add Document")
    expect(page.tagName).toBe("SPAN")
    expect(page).toHaveAttribute("aria-current", "page")
    expect(page).toHaveClass("text-foreground")
    expect(screen.queryByRole("link", { name: "Add Document" })).toBeNull()
  })

  it("takes an icon too", () => {
    render(<BreadcrumbPage icon={<HouseIcon data-testid="icon" />}>Home</BreadcrumbPage>)
    expect(screen.getByText("Home")).toContainElement(screen.getByTestId("icon"))
  })
})

describe("BreadcrumbSeparator", () => {
  it("is hidden from assistive technology", () => {
    render(<Collapsed />)
    const separator = screen.getByTestId("separator")
    expect(separator.tagName).toBe("LI")
    expect(separator).toHaveAttribute("role", "presentation")
    expect(separator).toHaveAttribute("aria-hidden", "true")
  })

  it("draws a 14px chevron on foreground by default, mirrored in RTL", () => {
    render(<Collapsed />)
    const separator = screen.getByTestId("separator")
    expect(separator).toHaveClass("text-foreground", "[&>svg]:size-3.5")
    const svg = separator.querySelector("svg")!
    expect(svg).toHaveClass("lucide-chevron-right", "[&:dir(rtl)]:-scale-x-100")
  })

  it("draws a child icon in place of the chevron: Figma's Custom Separator", () => {
    render(<Collapsed separator={<SlashIcon data-testid="slash" />} />)
    const separator = screen.getByTestId("separator")
    expect(separator).toContainElement(screen.getAllByTestId("slash")[0]!)
    expect(separator.querySelector(".lucide-chevron-right")).toBeNull()
  })
})

describe("BreadcrumbEllipsis", () => {
  it("is a 14px glyph on foreground, the glyph hidden", () => {
    render(<Collapsed />)
    const ellipsis = screen.getByTestId("ellipsis")
    expect(ellipsis).toHaveClass("size-3.5", "text-foreground")
    expect(ellipsis.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("is not interactive on its own: a trigger wrapped around it is the button", () => {
    render(<Collapsed />)
    expect(within(screen.getByRole("navigation")).queryByRole("button")).toBeNull()

    render(<CollapsedWithMenu />)
    const trigger = screen.getByRole("button", { name: "Hidden steps" })
    expect(trigger).toContainElement(screen.getAllByTestId("ellipsis").at(-1)!)
    expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("opens a menu of the hidden steps, each a link", async () => {
    render(<CollapsedWithMenu />)
    const trigger = screen.getByRole("button", { name: "Hidden steps" })
    await act(async () => {
      fireEvent.click(trigger)
    })
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    const menu = screen.getByRole("menu")
    const rows = within(menu).getAllByRole("menuitem")
    expect(rows.map((row) => row.textContent)).toEqual(["Projects", "Website"])
    expect(rows.map((row) => [row.tagName, row.getAttribute("href")])).toEqual([
      ["A", "/projects"],
      ["A", "/projects/website"],
    ])
  })

  it("closes on Escape and returns focus to the ellipsis", async () => {
    render(<CollapsedWithMenu />)
    const trigger = screen.getByRole("button", { name: "Hidden steps" })
    await act(async () => {
      fireEvent.click(trigger)
    })
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" })
    })
    expect(screen.queryByRole("menu")).toBeNull()
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveFocus()
  })

  it.each([
    ["en", "More"],
    ["ar", "المزيد"],
  ])("is read as the %s word for more", (lang, name) => {
    render(
      <div lang={lang}>
        <BreadcrumbEllipsis data-testid="e" />
      </div>
    )
    expect(spokenName(screen.getByTestId("e"))).toBe(name)
  })
})

describe("Breadcrumb source", () => {
  const classes = [...SOURCE.matchAll(/"([^"]*)"/g)].map((m) => m[1]!).join(" ")

  it("uses logical properties only", () => {
    expect(classes).not.toMatch(/(^|\s|:)-?(ml|mr|pl|pr|left|right|inset-l|inset-r|rounded-[lr]|border-[lr])-/)
    expect(classes).not.toMatch(/text-(left|right)\b/)
  })

  it("flips only the chevron for RTL, with one icon, by its own direction", () => {
    expect([...classes.matchAll(/:dir\(rtl\)\]:\S+/g)].map((m) => m[0])).toEqual([":dir(rtl)]:-scale-x-100"])
    // `rtl:` matches any dir="rtl" ancestor, so an LTR island inside RTL would flip too.
    expect(classes).not.toMatch(/(^|\s)rtl:/)
    expect(SOURCE).not.toMatch(/ChevronLeft/)
  })

  it("leaves Arabic's taller line to the type ramp", () => {
    expect(classes).not.toMatch(/\bleading-/)
  })
})

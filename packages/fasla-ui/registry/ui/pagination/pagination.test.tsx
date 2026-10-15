import * as React from "react"
import { beforeAll, describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationProps,
} from "./pagination"

/*
 * The default labels are two runs each, and CSS keeps the one matching the
 * nearest `lang`. jsdom loads no Tailwind, so inject exactly the compiled
 * rules the names depend on.
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

/** Figma's row — Previous, pages 1 to 4 with 2 current, Next — or the long range 1 … 5 6 7 … 20. */
function Row({ iconOnly, long, ...props }: PaginationProps & { iconOnly?: boolean; long?: boolean }) {
  const pages = long ? [1, null, 5, 6, 7, null, 20] : [1, 2, 3, 4]
  const current = long ? 6 : 2
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" iconOnly={iconOnly} />
        </PaginationItem>
        {pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === null ? (
              <PaginationEllipsis data-testid="ellipsis" />
            ) : (
              <PaginationLink href={`?page=${page}`} isActive={page === current}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="?page=3" iconOnly={iconOnly} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const page = (n: number) => screen.getByRole("link", { name: String(n) })
const previous = () => screen.getByRole("link", { name: "Previous" })
const next = () => screen.getByRole("link", { name: "Next" })

describe("Pagination", () => {
  it("is a navigation landmark named Pagination by default", () => {
    render(<Row />)
    const nav = screen.getByRole("navigation", { name: "Pagination" })
    expect(nav).toHaveAttribute("data-slot", "pagination")
    expect(nav).toHaveClass("flex", "justify-center")
  })

  it("takes its accessible name from aria-label", () => {
    render(<Row aria-label="التنقّل بين الصفحات" />)
    expect(screen.getByRole("navigation", { name: "التنقّل بين الصفحات" })).toBeTruthy()
  })

  it("is a list of its items, 4px apart, wrapping rather than overflowing", () => {
    render(<Row />)
    const list = screen.getByRole("list")
    expect(list).toHaveClass("flex", "flex-wrap", "items-center", "gap-1")
    expect(within(list).getAllByRole("listitem")).toHaveLength(6)
  })

  it("marks only the current page, with aria-current", () => {
    render(<Row />)
    expect(page(2)).toHaveAttribute("aria-current", "page")
    expect(page(2)).toHaveAttribute("data-active", "true")
    for (const n of [1, 3, 4]) expect(page(n)).not.toHaveAttribute("aria-current")
  })

  it("renders links with their href", () => {
    render(<Row />)
    expect(page(3)).toHaveAttribute("href", "?page=3")
    expect(previous()).toHaveAttribute("href", "?page=1")
  })

  it("defaults to the default variant, square and md", () => {
    render(<Row />)
    const nav = screen.getByRole("navigation")
    expect(nav).toHaveAttribute("data-variant", "default")
    expect(nav).toHaveAttribute("data-shape", "square")
    expect(nav).toHaveAttribute("data-size", "md")
    expect(page(1)).toHaveClass("size-9", "rounded-[var(--radius-md)]")
    expect(previous()).toHaveClass("h-9")
  })

  describe("each variant is Figma's choice of Button Type, all in Primary", () => {
    it.each([
      // variant, page, current page, Previous / Next
      ["default", "ghost", "default", "ghost"],
      ["solid", "soft", "default", "ghost"],
      ["outlined", "outline", "soft", "outline"],
    ] as const)("%s", (variant, pages, current, steps) => {
      render(<Row variant={variant} />)
      expect(page(1)).toHaveAttribute("data-variant", pages)
      expect(page(2)).toHaveAttribute("data-variant", current)
      expect(previous()).toHaveAttribute("data-variant", steps)
      expect(next()).toHaveAttribute("data-variant", steps)
      for (const link of [page(1), page(2), previous(), next()]) {
        expect(link).toHaveAttribute("data-tone", "primary")
      }
    })

    it("draws them with Button's own classes", () => {
      render(<Row variant="outlined" />)
      expect(page(1)).toHaveClass("ring-1", "ring-inset", "ring-primary", "text-primary")
      expect(page(2)).toHaveClass("bg-card", "from-soft-primary")
      render(<Row variant="default" />)
      expect(screen.getAllByRole("link", { name: "2" })[1]).toHaveClass("bg-primary", "text-primary-foreground")
    })
  })

  describe("sizes are Button's, the pages Icon Button's square", () => {
    it.each([
      ["xs", "icon-xs", "size-[1.625rem]", "h-[1.625rem]"],
      ["sm", "icon-sm", "size-8", "h-8"],
      ["md", "icon-md", "size-9", "h-9"],
      ["lg", "icon-lg", "size-10", "h-10"],
    ] as const)("%s", (size, iconSize, box, height) => {
      render(<Row size={size} long />)
      expect(page(1)).toHaveAttribute("data-size", iconSize)
      expect(page(1)).toHaveClass(box)
      expect(previous()).toHaveAttribute("data-size", size)
      expect(previous()).toHaveClass(height)
      for (const ellipsis of screen.getAllByTestId("ellipsis")) expect(ellipsis).toHaveClass(box)
    })

    it("sets every number at 14px, and lets a wide number widen its box", () => {
      render(<Row size="xs" />)
      expect(page(1)).toHaveClass("text-sm", "tabular-nums", "min-w-fit", "px-1")
    })
  })

  it("rounded is Button's full radius on every Button in the row", () => {
    render(<Row shape="rounded" variant="outlined" />)
    for (const link of [page(1), page(2), previous(), next()]) expect(link).toHaveClass("rounded-full")
  })

  describe("Previous and Next", () => {
    it("read Previous and Next, a chevron before and after the label", () => {
      render(<Row />)
      expect(previous().textContent).toContain("Previous")
      expect(previous().firstElementChild?.tagName.toLowerCase()).toBe("svg")
      expect(next().lastElementChild?.tagName.toLowerCase()).toBe("svg")
    })

    it("read السابق and التالي under an Arabic lang", () => {
      render(
        <div lang="ar" dir="rtl">
          <Row aria-label="التنقّل بين الصفحات" />
        </div>
      )
      expect(screen.getByRole("link", { name: "السابق" })).toBeTruthy()
      expect(screen.getByRole("link", { name: "التالي" })).toBeTruthy()
    })

    it("take their label from text", () => {
      render(
        <Pagination>
          <PaginationPrevious href="#" text="Newer" />
          <PaginationNext href="#" text="Older" />
        </Pagination>
      )
      expect(screen.getByRole("link", { name: "Newer" })).toBeTruthy()
      expect(screen.getByRole("link", { name: "Older" })).toBeTruthy()
    })

    it("flip their chevrons by their own direction, not an ancestor's", () => {
      render(<Row />)
      for (const link of [previous(), next()]) {
        const chevron = link.querySelector("svg")!
        expect(chevron).toHaveClass("[&:dir(rtl)]:-scale-x-100")
        expect(chevron).toHaveAttribute("aria-hidden", "true")
      }
    })

    it("iconOnly keeps the label for screen readers, in Icon Button's square", () => {
      render(<Row iconOnly />)
      expect(previous()).toHaveAttribute("data-size", "icon-md")
      expect(previous()).toHaveClass("size-9")
      expect(previous().querySelector(".sr-only")?.textContent).toContain("Previous")
      expect(next().querySelector(".sr-only")?.textContent).toContain("Next")
    })

    it("disabled leaves the tab order and ignores clicks", () => {
      const onClick = vi.fn()
      render(
        <Pagination>
          <PaginationPrevious href="#" disabled onClick={onClick} />
        </Pagination>
      )
      expect(previous()).toHaveAttribute("aria-disabled", "true")
      expect(previous()).toHaveAttribute("tabindex", "-1")
      fireEvent.click(previous())
      expect(onClick).not.toHaveBeenCalled()
    })

    it("asChild puts the label and chevron in the child element", () => {
      render(
        <Pagination>
          <PaginationNext asChild>
            <button type="button" />
          </PaginationNext>
        </Pagination>
      )
      const button = screen.getByRole("button", { name: "Next" })
      expect(button).toHaveAttribute("data-slot", "pagination-next")
      expect(button.querySelector("svg")).toBeTruthy()
    })
  })

  describe("PaginationLink", () => {
    it("asChild renders the child element, a button for onClick paging", () => {
      const onClick = vi.fn()
      render(
        <Pagination>
          <PaginationLink asChild isActive>
            <button type="button" onClick={onClick}>
              3
            </button>
          </PaginationLink>
        </Pagination>
      )
      const button = screen.getByRole("button", { name: "3" })
      expect(button).toHaveAttribute("aria-current", "page")
      expect(button).toHaveAttribute("data-slot", "pagination-link")
      fireEvent.click(button)
      expect(onClick).toHaveBeenCalledOnce()
    })

    it("forwards its ref to the anchor", () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Pagination>
          <PaginationLink ref={ref} href="#">
            1
          </PaginationLink>
        </Pagination>
      )
      expect(ref.current?.tagName).toBe("A")
    })

    it("marks the current page in Windows high contrast, where fills are dropped", () => {
      render(<Row />)
      expect(page(2)).toHaveClass(
        "forced-colors:aria-[current=page]:bg-[color:Highlight]",
        "forced-colors:aria-[current=page]:text-[color:HighlightText]"
      )
    })

    it("warns in development when it has no href and no asChild", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      render(
        <Pagination>
          <PaginationLink>1</PaginationLink>
          <PaginationLink href="?page=2">2</PaginationLink>
          <PaginationPrevious disabled />
        </Pagination>
      )
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]![0]).toContain("PaginationLink")
      warn.mockRestore()
    })

    it("merges className", () => {
      render(
        <Pagination>
          <PaginationLink href="#" className="extra">
            1
          </PaginationLink>
        </Pagination>
      )
      expect(page(1)).toHaveClass("extra", "size-9")
    })

    it("works outside Pagination with the defaults", () => {
      render(<PaginationLink href="#">1</PaginationLink>)
      expect(page(1)).toHaveAttribute("data-variant", "ghost")
      expect(page(1)).toHaveClass("size-9")
    })
  })

  describe("PaginationEllipsis", () => {
    it("is not interactive, its glyph hidden and More pages read", () => {
      render(<Row long />)
      const [ellipsis] = screen.getAllByTestId("ellipsis")
      expect(ellipsis!.tagName).toBe("SPAN")
      expect(ellipsis).not.toHaveAttribute("tabindex")
      expect(ellipsis!.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
      expect(within(ellipsis!).getByText("More pages")).toBeTruthy()
      expect(ellipsis).toHaveClass("text-primary")
      // Holds its absolutely placed screen-reader text, which would otherwise
      // escape a scrolling row and widen the page.
      expect(ellipsis).toHaveClass("relative")
      expect(ellipsis!.querySelector("svg")).toHaveClass("size-4")
    })

    it("reads مزيد من الصفحات under an Arabic lang", () => {
      render(
        <div lang="ar">
          <Pagination>
            <PaginationEllipsis data-testid="ellipsis" />
          </Pagination>
        </div>
      )
      const runs = Array.from(screen.getByTestId("ellipsis").querySelectorAll<HTMLElement>(".sr-only span"))
      const spoken = runs.filter((run) => getComputedStyle(run).display !== "none").map((run) => run.textContent)
      expect(spoken).toEqual(["مزيد من الصفحات"])
    })
  })
})

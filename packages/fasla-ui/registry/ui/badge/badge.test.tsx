import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Badge, type BadgeProps } from "./badge"

const SOURCE = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "badge.tsx"),
  "utf8"
)

const Star = () => (
  <svg data-testid="icon" viewBox="0 0 24 24">
    <path d="M12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9Z" />
  </svg>
)

function badge(props: Partial<BadgeProps> = {}) {
  render(
    <Badge data-testid="badge" {...props}>
      {props.children ?? "Badge"}
    </Badge>
  )
  return screen.getByTestId("badge")
}

describe("Badge", () => {
  it("renders a span with Figma's defaults: Solid, Primary, sm, Rounded", () => {
    const el = badge()
    expect(el.tagName).toBe("SPAN")
    expect(el).toHaveClass("bg-primary", "text-primary-foreground", "rounded-full")
    expect(el).toHaveClass("min-h-5", "px-1.5", "py-0.5", "gap-0.5", "text-xs", "font-medium")
  })

  describe("variant × tone", () => {
    const cases: Array<[BadgeProps["variant"], BadgeProps["tone"], string[]]> = [
      ["solid", "primary", ["bg-primary", "text-primary-foreground"]],
      ["solid", "secondary", ["bg-secondary", "text-secondary-foreground"]],
      ["solid", "info", ["bg-info", "text-info-foreground"]],
      ["solid", "success", ["bg-success", "text-success-foreground"]],
      ["solid", "warning", ["bg-warning", "text-warning-foreground"]],
      ["solid", "destructive", ["bg-destructive", "text-destructive-foreground"]],
      ["soft", "primary", ["from-soft-primary", "to-soft-primary", "text-primary"]],
      // Figma binds Soft Secondary's text to `foreground`, unlike Outline Secondary.
      ["soft", "secondary", ["from-soft-secondary", "to-soft-secondary", "text-foreground"]],
      ["soft", "info", ["from-soft-info", "to-soft-info", "text-info"]],
      ["soft", "success", ["from-soft-success", "to-soft-success", "text-success"]],
      ["soft", "warning", ["from-soft-warning", "to-soft-warning", "text-warning"]],
      ["soft", "destructive", ["from-soft-destructive", "to-soft-destructive", "text-destructive"]],
      ["outline", "primary", ["ring-primary", "text-primary"]],
      ["outline", "secondary", ["ring-secondary", "text-secondary-foreground"]],
      ["outline", "info", ["ring-info", "text-info"]],
      ["outline", "success", ["ring-success", "text-success"]],
      ["outline", "warning", ["ring-warning", "text-warning"]],
      ["outline", "destructive", ["ring-destructive", "text-destructive"]],
    ]

    it.each(cases)("%s / %s binds the Figma tokens", (variant, tone, classes) => {
      expect(badge({ variant, tone })).toHaveClass(...classes)
    })

    it("lays the Soft tint over card, as Figma stacks the two fills", () => {
      expect(badge({ variant: "soft" })).toHaveClass("bg-card", "bg-gradient-to-r")
    })

    it("draws Outline's stroke inside, so it is the same size as Solid", () => {
      const el = badge({ variant: "outline" })
      expect(el).toHaveClass("ring-1", "ring-inset")
      expect(el.className).not.toMatch(/\bborder\b/)
    })

    it("uses no raw colours", () => {
      expect(SOURCE).not.toMatch(/#[0-9a-f]{3,8}\b/i)
      expect(SOURCE).not.toMatch(/-(green|yellow|red|blue|sky|amber)-\d{2,3}/)
    })
  })

  describe("size", () => {
    it.each([
      ["sm", ["min-h-5", "px-1.5", "py-0.5", "gap-0.5"]],
      ["md", ["min-h-[1.375rem]", "px-2", "py-0.5", "gap-1"]],
      ["lg", ["min-h-[1.625rem]", "px-3", "py-1", "gap-1.5"]],
    ] as const)("%s matches Figma's padding and gap", (size, classes) => {
      expect(badge({ size })).toHaveClass(...classes)
    })

    it("sets minimum heights, not fixed ones, so Arabic can grow", () => {
      expect(SOURCE).not.toMatch(/(?<![\w-])h-(5|\[1\.375rem\]|\[1\.625rem\])/)
    })
  })

  describe("radius", () => {
    it("Rounded is a pill", () => {
      expect(badge({ radius: "rounded" })).toHaveClass("rounded-full")
    })

    it("Standard binds border radius/sm, never a literal 6px", () => {
      expect(badge({ radius: "standard" })).toHaveClass("rounded-[var(--radius-sm)]")
      expect(SOURCE).not.toMatch(/\[6px\]|:\s*6px/)
    })
  })

  describe("icon and avatar", () => {
    it("wraps the icon at 12px and hides it from assistive technology", () => {
      badge({ icon: <Star /> })
      const wrapper = screen.getByTestId("icon").parentElement!
      expect(wrapper).toHaveAttribute("aria-hidden", "true")
      expect(wrapper).toHaveClass("size-3", "[&>svg]:size-3")
    })

    it("clips the avatar to a 12px circle and keeps it accessible", () => {
      badge({ avatar: <img src="/a.png" alt="Layla" /> })
      const img = screen.getByAltText("Layla")
      expect(img.parentElement).toHaveClass("size-3", "rounded-full", "overflow-hidden")
      expect(img.parentElement).not.toHaveAttribute("aria-hidden")
    })

    it("allows both at once, as Figma's two independent booleans do", () => {
      badge({ icon: <Star />, avatar: <img src="/a.png" alt="Layla" /> })
      expect(screen.getByTestId("icon")).toBeInTheDocument()
      expect(screen.getByAltText("Layla")).toBeInTheDocument()
    })

    it("renders icon, avatar, label, close in DOM order, which dir mirrors", () => {
      const el = badge({
        icon: <Star />,
        avatar: <img src="/a.png" alt="Layla" />,
        onClose: () => {},
      })
      const kids = Array.from(el.children)
      expect(kids[0]).toContainElement(screen.getByTestId("icon"))
      expect(kids[1]).toContainElement(screen.getByAltText("Layla"))
      expect(kids[2]).toHaveTextContent("Badge")
      expect(kids[3]?.tagName).toBe("BUTTON")
    })
  })

  describe("close", () => {
    /*
     * The default name is two hidden runs, and CSS keeps the one matching the
     * nearest `lang`. jsdom loads no Tailwind, so inject exactly the compiled
     * rules the name depends on; the accessible-name computation then drops
     * the `display: none` run, as a browser does.
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

    it("renders no button without onClose", () => {
      badge()
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    it("is a real button that calls onClose", () => {
      const onClose = vi.fn()
      badge({ onClose, children: "Cairo" })
      const button = screen.getByRole("button", { name: "Remove Cairo" })
      expect(button).toHaveAttribute("type", "button")
      fireEvent.click(button)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("falls back to a bare verb when the label is not plain text", () => {
      render(
        <Badge onClose={() => {}}>
          <strong>Cairo</strong>
        </Badge>
      )
      expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument()
    })

    it("names itself in Arabic when the page is Arabic", () => {
      render(
        <div lang="ar" dir="rtl">
          <Badge onClose={() => {}}>القاهرة</Badge>
        </div>
      )
      expect(screen.getByRole("button", { name: "إزالة القاهرة" })).toBeInTheDocument()
    })

    it("follows the nearest lang, so an English island on an Arabic page stays English", () => {
      render(
        <div lang="ar">
          <div lang="en">
            <Badge onClose={() => {}}>Cairo</Badge>
          </div>
        </div>
      )
      expect(screen.getByRole("button", { name: "Remove Cairo" })).toBeInTheDocument()
    })

    it("follows a live language change without remounting", () => {
      const { container } = render(
        <div lang="en">
          <Badge onClose={() => {}}>القاهرة</Badge>
        </div>
      )
      expect(screen.getByRole("button", { name: "Remove القاهرة" })).toBeInTheDocument()
      container.firstElementChild!.setAttribute("lang", "ar")
      expect(screen.getByRole("button", { name: "إزالة القاهرة" })).toBeInTheDocument()
    })

    it("carries both names in the markup, so server HTML needs no script", () => {
      badge({ onClose: () => {}, children: "Cairo" })
      const runs = Array.from(screen.getByRole("button").querySelectorAll(".sr-only"))
      expect(runs.map((r) => r.textContent)).toEqual(["Remove Cairo", "إزالة Cairo"])
      expect(SOURCE).not.toMatch(/useEffect|useState|useLayoutEffect/)
    })

    it("takes an explicit label over the page language", () => {
      render(
        <div lang="ar">
          <Badge onClose={() => {}} closeLabel="Remove filter: Cairo">
            Cairo
          </Badge>
        </div>
      )
      const button = screen.getByRole("button", { name: "Remove filter: Cairo" })
      expect(button.querySelector(".sr-only")).toBeNull()
    })

    it("widens the hit area to 24px without changing the 12px glyph", () => {
      badge({ onClose: () => {} })
      expect(screen.getByRole("button")).toHaveClass("size-3", "after:absolute", "after:-inset-1.5")
    })
  })

  describe("focus ring", () => {
    it("exists only when there is something to focus", () => {
      expect(badge().querySelector(".peer-focus-visible\\:opacity-100")).toBeNull()
    })

    it("follows the close button as a peer, 2px out, on the badge's own radius", () => {
      const el = badge({ onClose: () => {} })
      const ring = screen.getByRole("button").nextElementSibling!
      expect(ring.parentElement).toBe(el)
      expect(ring).toHaveAttribute("aria-hidden", "true")
      expect(ring).toHaveClass(
        "absolute",
        "-inset-0.5",
        "rounded-[inherit]",
        "ring-1",
        "opacity-0",
        "peer-focus-visible:opacity-100"
      )
      expect(screen.getByRole("button")).toHaveClass("peer")
    })

    it.each([
      ["primary", "ring-ring/50"],
      ["secondary", "ring-ring/50"],
      ["info", "ring-info/20"],
      ["success", "ring-success/20"],
      ["warning", "ring-warning/20"],
      ["destructive", "ring-destructive/20"],
    ] as const)("%s uses Figma's ring colour and opacity", (tone, cls) => {
      badge({ tone, onClose: () => {} })
      expect(screen.getByRole("button").nextElementSibling).toHaveClass(cls)
    })
  })

  it("is a client component, so a server component can render it", () => {
    expect(SOURCE.startsWith('"use client"')).toBe(true)
  })

  it("forwards its ref, merges className and passes props through", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Badge ref={ref} className="custom" aria-label="status" data-testid="badge">
        Status
      </Badge>
    )
    const el = screen.getByTestId("badge")
    expect(ref.current).toBe(el)
    expect(el).toHaveClass("custom")
    expect(el).toHaveAttribute("aria-label", "status")
  })
})

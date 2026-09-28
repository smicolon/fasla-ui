import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusIndicator, type StatusIndicatorProps } from "./status-indicator"

const SOURCE = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "status-indicator.tsx"),
  "utf8"
)

function dot(props: Partial<StatusIndicatorProps> = {}) {
  render(<StatusIndicator data-testid="dot" {...props} />)
  return screen.getByTestId("dot")
}

/** The name a screen reader would hear: the visible (not display: none) runs. */
function spokenName(el: HTMLElement) {
  return Array.from(el.querySelectorAll<HTMLElement>(".sr-only"))
    .filter((run) => getComputedStyle(run).display !== "none")
    .map((run) => run.textContent)
    .join("")
}

/*
 * The default name is two hidden runs, and CSS keeps the one matching the
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

describe("StatusIndicator", () => {
  it("renders Figma's defaults: Online, 8px, a 2px background ring", () => {
    const el = dot()
    expect(el.tagName).toBe("SPAN")
    expect(el).toHaveClass("bg-success", "size-2", "ring-2", "ring-background", "rounded-full")
  })

  it.each([
    ["online", "bg-success"],
    ["away", "bg-warning"],
    ["busy", "bg-destructive"],
    ["offline", "bg-muted"],
  ] as const)("%s binds the Figma token %s", (status, fill) => {
    expect(dot({ status })).toHaveClass(fill)
  })

  it("draws the 4px dot with a 1px ring", () => {
    const el = dot({ size: "4" })
    expect(el).toHaveClass("size-1", "ring-1")
    expect(el).not.toHaveClass("size-2", "ring-2")
  })

  it("keeps the ring outside the dot, so it never changes the footprint", () => {
    // A border would add to the box; Figma's stroke is OUTSIDE.
    expect(SOURCE).not.toMatch(/\bborder(-\d)?\b/)
  })

  it("uses tokens only — no raw colour or pixel values", () => {
    expect(SOURCE).not.toMatch(/#[0-9a-f]{3,8}\b|\[\d+px\]|rgb\(/i)
  })

  it("merges a consumer className", () => {
    expect(dot({ className: "absolute" })).toHaveClass("absolute", "bg-success")
  })

  describe("accessible name", () => {
    it.each([
      ["online", "Online", "متصل"],
      ["away", "Away", "بعيد"],
      ["busy", "Busy", "مشغول"],
      ["offline", "Offline", "غير متصل"],
    ] as const)("%s is %s in English and %s in Arabic", (status, en, ar) => {
      render(
        <>
          <div lang="en">
            <StatusIndicator data-testid="en" status={status} />
          </div>
          <div lang="ar" dir="rtl">
            <StatusIndicator data-testid="ar" status={status} />
          </div>
        </>
      )
      expect(spokenName(screen.getByTestId("en"))).toBe(en)
      expect(spokenName(screen.getByTestId("ar"))).toBe(ar)
    })

    it("follows the nearest lang, so an English island on an Arabic page stays English", () => {
      render(
        <div lang="ar">
          <div lang="en">
            <StatusIndicator data-testid="dot" status="busy" />
          </div>
        </div>
      )
      expect(spokenName(screen.getByTestId("dot"))).toBe("Busy")
    })

    it("follows a live language change without remounting", () => {
      const { container } = render(
        <div lang="en">
          <StatusIndicator data-testid="dot" status="away" />
        </div>
      )
      expect(spokenName(screen.getByTestId("dot"))).toBe("Away")
      container.firstElementChild!.setAttribute("lang", "ar")
      expect(spokenName(screen.getByTestId("dot"))).toBe("بعيد")
    })

    it("takes an explicit label over the page language", () => {
      render(
        <div lang="ar">
          <StatusIndicator data-testid="dot" status="online" label="Layla is online" />
        </div>
      )
      const el = screen.getByTestId("dot")
      expect(spokenName(el)).toBe("Layla is online")
      expect(el.querySelectorAll(".sr-only")).toHaveLength(1)
    })

    it("is silent with label=\"\", for when text beside it already says the status", () => {
      render(
        <div lang="ar">
          <StatusIndicator data-testid="dot" status="busy" label="" />
        </div>
      )
      const el = screen.getByTestId("dot")
      expect(el.querySelectorAll(".sr-only")).toHaveLength(0)
      expect(el.textContent).toBe("")
    })

    it("puts the name in text, not in colour alone", () => {
      const el = dot({ status: "offline" })
      expect(el.textContent).toContain("Offline")
      expect(el).not.toHaveAttribute("aria-hidden")
    })
  })
})

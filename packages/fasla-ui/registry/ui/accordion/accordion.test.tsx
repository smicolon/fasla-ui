import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act, within } from "@testing-library/react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
} from "./accordion"
import { Avatar } from "../avatar/avatar"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and no style resolution: it matches neither
 * `:hover` nor `:focus-visible`, runs no transitions and measures every box
 * at zero. So the visual tests assert **class presence only**: that the right
 * utility lands on the right element. Row heights, padding, the ring's inset,
 * the underline, the open and close animation and the tokens in Light and
 * Dark were measured in a real browser, in both directions.
 */

const ITEMS = ["one", "two", "three"]

function Example(props: Partial<AccordionProps>) {
  return (
    <Accordion {...props}>
      {ITEMS.map((v) => (
        <AccordionItem key={v} value={v}>
          <AccordionTrigger>Question {v}</AccordionTrigger>
          <AccordionContent>Answer {v}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

const trigger = (name: string) => screen.getByRole("button", { name })
const click = async (element: HTMLElement) => {
  await act(async () => {
    fireEvent.click(element)
  })
}

describe("Accordion behaviour (Base UI)", () => {
  it("renders each heading as a button inside a heading, collapsed by default", () => {
    render(<Example />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
    for (const v of ITEMS) {
      expect(trigger(`Question ${v}`)).toHaveAttribute("aria-expanded", "false")
    }
    expect(screen.queryByRole("region")).toBeNull()
  })

  it("links an open trigger and its region both ways", () => {
    render(<Example defaultValue={["two"]} />)
    const button = trigger("Question two")
    const region = screen.getByRole("region")
    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(button).toHaveAttribute("aria-controls", region.id)
    expect(region).toHaveAttribute("aria-labelledby", button.id)
    expect(region).toHaveTextContent("Answer two")
  })

  it("opens one item at a time by default, and closes the open one again", async () => {
    const onValueChange = vi.fn()
    render(<Example onValueChange={onValueChange} />)

    await click(trigger("Question one"))
    expect(trigger("Question one")).toHaveAttribute("aria-expanded", "true")

    await click(trigger("Question two"))
    expect(trigger("Question one")).toHaveAttribute("aria-expanded", "false")
    expect(trigger("Question two")).toHaveAttribute("aria-expanded", "true")
    expect(onValueChange).toHaveBeenLastCalledWith(["two"], expect.anything())

    await click(trigger("Question two"))
    expect(trigger("Question two")).toHaveAttribute("aria-expanded", "false")
  })

  it("keeps several items open with `multiple`", async () => {
    render(<Example multiple />)
    await click(trigger("Question one"))
    await click(trigger("Question three"))
    expect(trigger("Question one")).toHaveAttribute("aria-expanded", "true")
    expect(trigger("Question three")).toHaveAttribute("aria-expanded", "true")
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<Example value={["one"]} />)
    expect(trigger("Question one")).toHaveAttribute("aria-expanded", "true")
    rerender(<Example value={["three"]} />)
    expect(trigger("Question one")).toHaveAttribute("aria-expanded", "false")
    expect(trigger("Question three")).toHaveAttribute("aria-expanded", "true")
  })

  it("is a native button, so Enter and Space need no handler of ours", () => {
    render(<Example />)
    const button = trigger("Question one")
    expect(button.tagName).toBe("BUTTON")
    expect(button).toHaveAttribute("type", "button")
  })

  it("nests: an accordion inside content works on its own", async () => {
    render(
      <Accordion defaultValue={["parent"]}>
        <AccordionItem value="parent">
          <AccordionTrigger>Parent</AccordionTrigger>
          <AccordionContent>
            <Accordion>
              <AccordionItem value="child">
                <AccordionTrigger>Child</AccordionTrigger>
                <AccordionContent>Child answer</AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await click(trigger("Child"))
    expect(trigger("Child")).toHaveAttribute("aria-expanded", "true")
    expect(trigger("Parent")).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Child answer")).toBeInTheDocument()
  })
})

describe("Accordion variants", () => {
  const root = (container: HTMLElement) => container.querySelector("[data-slot=accordion]")!
  const items = (container: HTMLElement) => [...container.querySelectorAll("[data-slot=accordion-item]")]

  it("default: dividers between items, none after the last, no inset", () => {
    const { container } = render(<Example />)
    expect(root(container)).toHaveAttribute("data-variant", "default")
    for (const item of items(container)) {
      expect(item).toHaveClass("border-b", "border-border", "last:border-b-0")
      expect(item).not.toHaveClass("px-5")
    }
  })

  it("split: card items with shadow-md, 8px apart, 20px inset, 8px radius", () => {
    const { container } = render(<Example variant="split" />)
    expect(root(container)).toHaveClass("gap-2")
    for (const item of items(container)) {
      expect(item).toHaveClass("bg-card", "shadow-md", "px-5", "rounded-[var(--radius-md)]")
      expect(item).not.toHaveClass("border", "border-b")
      // Forced colours drop the fill and shadow; the outline keeps the card.
      expect(item).toHaveClass("forced-colors:outline", "forced-colors:outline-1")
    }
  })

  it("outline: a border round each item, 8px apart, and 16px rows", () => {
    const { container } = render(<Example variant="outline" />)
    expect(root(container)).toHaveClass("gap-2")
    for (const item of items(container)) {
      expect(item).toHaveClass("border", "border-border", "px-5", "rounded-[var(--radius-md)]")
    }
    expect(trigger("Question one")).toHaveClass("py-4")
  })

  it("table: one box round the group, dividers inside, 20px inset", () => {
    const { container } = render(<Example variant="table" />)
    expect(root(container)).toHaveClass("rounded-lg", "border", "border-border")
    for (const item of items(container)) {
      expect(item).toHaveClass("border-b", "px-5", "last:border-b-0")
    }
  })

  it.each(["default", "split", "table"] as const)("%s rows are 12px above and below the title", (variant) => {
    render(<Example variant={variant} />)
    expect(trigger("Question one")).toHaveClass("py-3")
  })
})

describe("Accordion indicator", () => {
  const indicator = (name: string) => trigger(name).querySelector("[data-slot=accordion-indicator]")!

  it("defaults to one chevron that turns while open", () => {
    render(<Example defaultValue={["one"]} />)
    const svgs = indicator("Question one").querySelectorAll("svg")
    expect(svgs).toHaveLength(1)
    expect(svgs[0]).toHaveClass("lucide-chevron-down", "group-data-[panel-open]/trigger:rotate-180")
    expect(trigger("Question one")).toHaveAttribute("data-panel-open")
  })

  it("plus swaps Plus for Minus while open", () => {
    render(<Example indicator="plus" />)
    const [plus, minus] = [...indicator("Question one").querySelectorAll("svg")]
    expect(plus).toHaveClass("lucide-plus", "group-data-[panel-open]/trigger:hidden")
    expect(minus).toHaveClass("lucide-minus", "hidden", "group-data-[panel-open]/trigger:block")
  })

  it("draws Figma's 1px stroke and sits at the inline end, hidden from assistive tech", () => {
    render(<Example />)
    const box = indicator("Question one")
    expect(box).toHaveAttribute("aria-hidden", "true")
    expect(box).toHaveClass("ms-auto", "size-4")
    expect(box.querySelector("svg")).toHaveAttribute("stroke-width", "1.5")
  })

  it("leaves the trigger's accessible name to the title", () => {
    render(<Example indicator="plus" />)
    expect(trigger("Question one")).toHaveAccessibleName("Question one")
  })
})

describe("Accordion trigger look", () => {
  it("wraps bare text in one span, so the hover underline has an element and no gap splits it", () => {
    // `Question {v}` is two strings to React: they must share one span, not
    // become two flex items 12px apart.
    render(<Example />)
    const titles = trigger("Question one").querySelectorAll("[data-slot=accordion-title]")
    expect(titles).toHaveLength(1)
    expect(titles[0]).toHaveTextContent(/^Question one$/)
  })

  it("keeps text either side of an element in separate spans, in order", () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>
            Before <b>bold</b> after
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
    const parts = [...screen.getByRole("button").children].map((c) => c.textContent)
    expect(parts.slice(0, 3)).toEqual(["Before ", "bold", " after"])
  })

  it("underlines the title on hover, never the indicator, an icon or an avatar", () => {
    render(<Example />)
    // The row sets the variable on hover; only the title children read it.
    const button = trigger("Question one")
    expect(button).toHaveClass("hover:[--accordion-title-decoration:underline]")
    expect(button.className).toContain(
      "[&>:not([data-slot=accordion-indicator]):not([data-slot=avatar]):not(svg)]:[text-decoration-line:var(--accordion-title-decoration,none)]"
    )
    // Never `hover:[&>…]`: in Tailwind 3 that hovers the child, not the row.
    expect(button.className).not.toMatch(/hover:\[&/)
  })

  it("draws the focus ring on the trigger: 2px of ring, 1px inside top and bottom, 6px past each side", () => {
    render(<Example />)
    expect(trigger("Question one")).toHaveClass(
      "relative",
      "[outline:none]",
      "after:border-2",
      "after:border-ring",
      "after:inset-y-px",
      "after:-inset-x-1.5",
      "after:rounded-[var(--radius-sm)]",
      "after:hidden",
      "focus-visible:after:block"
    )
  })

  it("keeps an avatar and an icon in the row, and the avatar out of the underline", () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>
            <Avatar name="Huda Salem" />
            <span>Huda Salem</span>
          </AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const button = screen.getByRole("button")
    const avatar = within(button).getByText("HS").closest("[data-slot=avatar]")
    expect(avatar?.parentElement).toBe(button)
  })
})

describe("Accordion content", () => {
  it("puts className and the 16px bottom padding on the inner box", () => {
    render(
      <Accordion defaultValue={["a"]}>
        <AccordionItem value="a">
          <AccordionTrigger>Title</AccordionTrigger>
          <AccordionContent className="ps-11">Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const region = screen.getByRole("region")
    const inner = screen.getByText("Body")
    expect(inner).toHaveClass("pb-4", "ps-11")
    expect(region).not.toHaveClass("ps-11")
    expect(region).toHaveClass("text-sm", "text-muted-foreground", "overflow-y-clip", "overflow-x-visible")
  })

  it("animates height from Base UI's measurement, and not under reduced motion", () => {
    render(<Example defaultValue={["one"]} />)
    expect(screen.getByRole("region")).toHaveClass(
      "h-[var(--accordion-panel-height)]",
      "transition-[height]",
      "data-[starting-style]:h-0",
      "data-[ending-style]:h-0",
      "motion-reduce:transition-none"
    )
  })
})

describe("Accordion source", () => {
  const source = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "accordion.tsx"), "utf8")
  const classes = [...source.matchAll(/"([^"]*)"/g)].map((m) => m[1]!).join(" ")

  it("uses logical properties only, so RTL needs no class of its own", () => {
    expect(classes).not.toMatch(/(^|\s|:)-?(ml|mr|pl|pr|left|right|inset-l|inset-r|rounded-[lr]|border-[lr])-/)
    expect(classes).not.toMatch(/text-(left|right)\b/)
    expect(classes).not.toMatch(/\brtl:/)
  })

  it("never mirrors the indicator with a transform", () => {
    expect(classes).not.toMatch(/scale-x|-scale-x/)
  })
})

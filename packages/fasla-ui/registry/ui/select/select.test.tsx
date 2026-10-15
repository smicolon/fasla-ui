import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Select, SelectItem, type SelectProps } from "./select"
import { Input, inputBoxVariants } from "../input/input"

/**
 * What these tests can and cannot prove.
 *
 * jsdom applies no stylesheet and has no layout, so Base UI cannot place the
 * menu and the visual tests assert **class presence only** — that the right
 * utility lands on the right element. Heights (28/32/36/40 in both scripts,
 * 32px items), the menu's width and 4px gap, the icon sizes, the tokens in
 * Light and Dark and the RTL mirror were measured in a real browser. The
 * wiring — roles, labels, descriptions, choosing, the hidden input,
 * disabled, the direction handed to the menu — is real DOM and is tested as
 * such.
 */

const CITIES = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "dammam", label: "Dammam" },
]

const trigger = () => screen.getByRole("combobox")
const slot = (name: string, root: ParentNode = document) => root.querySelector<HTMLElement>(`[data-slot=${name}]`)
const slots = (name: string, root: ParentNode = document) => [...root.querySelectorAll<HTMLElement>(`[data-slot=${name}]`)]

async function open() {
  await act(async () => {
    fireEvent.click(trigger())
  })
}

/** A press on an option, as a mouse makes it. jsdom has no PointerEvent constructor for keyboard paths. */
async function press(option: HTMLElement) {
  await act(async () => {
    fireEvent.pointerDown(option, { pointerType: "mouse" })
    fireEvent.mouseDown(option)
    fireEvent.pointerUp(option, { pointerType: "mouse" })
    fireEvent.mouseUp(option)
    fireEvent.click(option)
  })
}

const Cities = (props: Partial<SelectProps>) => (
  <Select aria-label="City" placeholder="Select a city" items={CITIES} {...(props as SelectProps)} />
)

describe("Select — trigger", () => {
  it("renders a combobox button showing the placeholder", () => {
    render(<Cities />)
    expect(trigger().tagName).toBe("BUTTON")
    expect(trigger()).toHaveAttribute("aria-haspopup", "listbox")
    expect(slot("select-placeholder")).toHaveTextContent("Select a city")
    expect(slot("select-placeholder")).toHaveClass("text-muted-foreground")
  })

  it("defaults to md and Standard", () => {
    render(<Cities />)
    expect(trigger()).toHaveClass("min-h-9", "gap-1.5", "px-3", "rounded-[var(--radius-md)]")
  })

  it.each([
    ["xs", "min-h-7", "gap-0.5"],
    ["sm", "min-h-8", "gap-1"],
    ["md", "min-h-9", "gap-1.5"],
    ["lg", "min-h-10", "gap-2"],
  ] as const)("size %s is %s with %s, 12px padding and 16px icons", (size, height, gap) => {
    render(<Cities size={size} startIcon={<svg />} />)
    expect(trigger()).toHaveClass(height, gap, "px-3")
    // No block padding: Cairo's taller line would push an Arabic value out of xs.
    expect(trigger().getAttribute("class")).not.toMatch(/(^|\s)py-/)
    expect(slot("select-start-icon")).toHaveClass("[&_svg]:size-4")
    expect(slot("select-chevron")).toHaveClass("[&_svg]:size-4")
  })

  it.each(["xs", "sm", "md", "lg"] as const)("matches Input's box and text at size %s", (size) => {
    render(
      <>
        <Input size={size} aria-label="Name" />
        <Cities size={size} />
      </>
    )
    // The text size Input gives its value: 16px below md (iOS zooms into any
    // field under 16px), 14px from md up.
    const inputText = screen.getByRole("textbox").getAttribute("class")!.split(" ")
    for (const text of ["text-base", "md:text-sm", "text-foreground"]) {
      expect(inputText, `Input's value has ${text}`).toContain(text)
      expect(trigger().getAttribute("class")!.split(" "), `Select has ${text}`).toContain(text)
    }
    const input = new Set(inputBoxVariants({ size }).split(" "))
    const select = trigger().getAttribute("class")!.split(" ")
    // The same height (a minimum here, so badges can wrap), gap and padding.
    const height = [...input].find((c) => /^h-\d+$/.test(c))!
    expect(select).toContain(`min-${height}`)
    for (const shared of [
      [...input].find((c) => c.startsWith("gap-"))!,
      "px-3",
      "border",
      "border-input",
      "bg-background",
      "dark:bg-input/30",
      "shadow-sm",
      "rounded-[var(--radius-md)]",
    ]) {
      expect(input.has(shared), `Input has ${shared}`).toBe(true)
      expect(select, `Select has ${shared}`).toContain(shared)
    }
  })

  it("sets the value and placeholder at 16px below md and 14px from md up, at every size", () => {
    for (const size of ["xs", "sm", "md", "lg"] as const) {
      const { unmount } = render(<Cities size={size} />)
      expect(trigger()).toHaveClass("text-base", "md:text-sm")
      expect(trigger().getAttribute("class")).not.toMatch(/(^|\s)text-(xs|sm)(\s|$)/)
      unmount()
    }
  })

  it("lets one line of text overhang the box, so Cairo's 28px line never grows an xs trigger", () => {
    render(<Cities size="xs" defaultValue="riyadh" />)
    expect(slot("select-value")).toHaveClass("-my-1", "truncate")
  })

  it("renders the Rounded radius", () => {
    render(<Cities radius="rounded" />)
    expect(trigger()).toHaveClass("rounded-full")
  })

  it("draws the trigger from tokens only, with Input's shadow and focus ring, on keyboard focus and while open", () => {
    render(<Cities />)
    expect(trigger()).toHaveClass(
      "border-input",
      "bg-background",
      "dark:bg-input/30",
      "text-foreground",
      "shadow-sm",
      "focus-visible:border-ring",
      "focus-visible:shadow-none",
      "focus-visible:ring-[3px]",
      "focus-visible:ring-ring/50",
      "data-[popup-open]:border-ring",
      "data-[popup-open]:shadow-none",
      "data-[popup-open]:ring-[3px]",
      "data-[popup-open]:ring-ring/50"
    )
  })

  it("keeps focus visible in forced colours, and draws no outline at rest there", () => {
    render(<Cities />)
    expect(trigger()).toHaveClass(
      "forced-colors:focus-visible:[outline:2px_solid_Highlight]",
      "forced-colors:data-[popup-open]:[outline:2px_solid_Highlight]"
    )
    // Tailwind 3's `outline-none` is a transparent outline that forced colours paint.
    expect(trigger()).toHaveClass("[outline:none]")
    expect(trigger()).not.toHaveClass("outline-none")
  })

  it("shows the chosen option's label, not its value", () => {
    render(<Cities defaultValue="jeddah" />)
    expect(trigger()).toHaveTextContent("Jeddah")
    expect(slot("select-placeholder")).toBeNull()
  })

  it("takes labels from SelectItem children when there are no items", () => {
    render(
      <Select aria-label="City" defaultValue="dammam">
        <SelectItem value="riyadh">Riyadh</SelectItem>
        <SelectItem value="dammam">
          <span>Dammam</span>
        </SelectItem>
      </Select>
    )
    expect(trigger()).toHaveTextContent("Dammam")
  })

  it("keeps an aria-label without dropping the label's aria-labelledby", () => {
    const { unmount } = render(<Cities aria-label="Delivery city" />)
    expect(trigger()).toHaveAttribute("aria-label", "Delivery city")
    unmount()
    render(<Select label="City" items={CITIES} />)
    const labelledBy = trigger().getAttribute("aria-labelledby")!
    expect(document.getElementById(labelledBy)).toHaveTextContent("City")
  })
})

describe("Select — field parts", () => {
  it("labels the trigger with a non-native label that focuses it without opening", async () => {
    render(<Select label="City" items={CITIES} />)
    const label = slot("select-label")!
    expect(label.tagName).toBe("DIV")
    await act(async () => {
      fireEvent.click(label)
    })
    expect(trigger()).toHaveFocus()
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  it("describes the trigger with every helper label", () => {
    render(
      <Select label="City" labelEnd="Optional" description="Where we deliver" descriptionEnd="1 of 8" items={CITIES} />
    )
    const ids = trigger().getAttribute("aria-describedby")!.split(" ")
    const texts = ids.map((id) => document.getElementById(id)?.textContent)
    expect(texts).toEqual(expect.arrayContaining(["Optional", "Where we deliver", "1 of 8"]))
  })

  it("lays the label and helper rows out exactly as Input does", () => {
    render(<Select label="City" labelEnd="Optional" description="Help" descriptionEnd="1/8" items={CITIES} />)
    expect(slot("select-label-row")).toHaveClass("flex", "justify-between", "gap-2", "p-1", "items-baseline")
    expect(slot("select-helper-row")).toHaveClass("flex", "justify-between", "gap-2", "p-1", "items-start")
    expect(slot("select-label")).toHaveClass("text-sm", "font-medium", "text-foreground")
    for (const name of ["select-label-end", "select-description", "select-description-end"]) {
      expect(slot(name)).toHaveClass("text-xs", "text-muted-foreground")
      expect(slot(name)!.getAttribute("class")).not.toMatch(/\/80/)
    }
  })

  it("renders no rows it has nothing for", () => {
    render(<Cities />)
    expect(slot("select-label-row")).toBeNull()
    expect(slot("select-helper-row")).toBeNull()
  })

  it("hides the prefix icon from assistive technology", () => {
    render(<Cities startIcon={<svg data-testid="icon" />} />)
    expect(slot("select-start-icon")).toHaveAttribute("aria-hidden", "true")
  })
})

describe("Select — menu", () => {
  it("opens a listbox of the options", async () => {
    render(<Cities />)
    await open()
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Riyadh", "Jeddah", "Dammam"])
    expect(trigger()).toHaveAttribute("aria-expanded", "true")
  })

  it("draws the menu at the trigger's width from tokens only", async () => {
    render(<Cities />)
    await open()
    expect(slot("select-content")).toHaveClass(
      "w-[var(--anchor-width)]",
      "rounded-[var(--radius-md)]",
      "border-input",
      "bg-popover",
      "text-popover-foreground",
      "p-1",
      "shadow-md"
    )
  })

  it("opens below the trigger rather than over it", async () => {
    render(<Cities />)
    await open()
    expect(slot("select-positioner")).toHaveAttribute("data-side", "bottom")
  })

  it("chooses an option: the trigger, the hidden input and onValueChange all follow", async () => {
    const onValueChange = vi.fn()
    const { container } = render(<Cities name="city" onValueChange={onValueChange} />)
    await open()
    await press(screen.getByRole("option", { name: "Jeddah" }))
    expect(onValueChange).toHaveBeenCalledWith("jeddah")
    expect(trigger()).toHaveTextContent("Jeddah")
    expect(container.querySelector<HTMLInputElement>("input[name=city]")!.value).toBe("jeddah")
  })

  it("leaves a controlled value to its owner", async () => {
    const onValueChange = vi.fn()
    render(<Cities value="riyadh" onValueChange={onValueChange} />)
    await open()
    await press(screen.getByRole("option", { name: "Dammam" }))
    expect(onValueChange).toHaveBeenCalledWith("dammam")
    expect(trigger()).toHaveTextContent("Riyadh")
  })

  it("keeps the check's slot on every item, and shows the check only on the chosen one", async () => {
    render(<Cities defaultValue="jeddah" />)
    await open()
    const options = screen.getAllByRole("option")
    for (const option of options) {
      expect(slot("select-item-indicator", option)).toHaveClass("size-4", "shrink-0")
    }
    expect(options.map((o) => !!slot("select-item-indicator", o)!.querySelector("svg"))).toEqual([false, true, false])
    expect(options[1]).toHaveAttribute("aria-selected", "true")
  })

  it("keeps the highlight apart from the selection", async () => {
    render(<Cities />)
    await open()
    const item = screen.getAllByRole("option")[0]!
    expect(item).toHaveClass("data-[highlighted]:bg-accent", "data-[highlighted]:text-accent-foreground")
    expect(item.getAttribute("class")).not.toMatch(/data-\[selected\]:bg/)
  })

  it("marks the highlighted option in forced colours, where the fill is dropped", async () => {
    render(<Cities />)
    await open()
    const item = screen.getAllByRole("option")[0]!
    expect(item).toHaveClass("forced-colors:data-[highlighted]:[outline:2px_solid_Highlight]", "[outline:none]")
    expect(item).not.toHaveClass("outline-none")
  })

  it("draws items at Figma's size and radius, with wrapping text", async () => {
    render(<Cities />)
    await open()
    const item = screen.getAllByRole("option")[0]!
    expect(item).toHaveClass("min-h-8", "px-2", "py-1", "gap-2", "rounded-[var(--radius-sm)]", "text-sm")
    expect(slot("select-item-text", item)).toHaveClass("flex-1", "[overflow-wrap:anywhere]")
  })

  it("marks a disabled option and will not choose it", async () => {
    const onValueChange = vi.fn()
    render(
      <Select aria-label="City" onValueChange={onValueChange}>
        <SelectItem value="riyadh">Riyadh</SelectItem>
        <SelectItem value="makkah" disabled>
          Makkah
        </SelectItem>
      </Select>
    )
    await open()
    const makkah = screen.getByRole("option", { name: "Makkah" })
    expect(makkah).toHaveAttribute("aria-disabled", "true")
    await press(makkah)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe("Select — multiple", () => {
  const Multi = (props: Partial<SelectProps>) => (
    <Select multiple aria-label="Cities" items={CITIES} defaultValue={["riyadh", "jeddah"]} {...(props as object)} />
  )

  it("shows each chosen value as Figma's Badge: Soft, Primary, sm, Standard", () => {
    render(<Multi />)
    const badges = slots("select-badge")
    expect(badges.map((b) => b.textContent)).toEqual(["Riyadh", "Jeddah"])
    expect(badges[0]).toHaveClass("from-soft-primary", "text-primary", "min-h-5", "rounded-[var(--radius-sm)]")
  })

  it("lets the badges wrap, with block padding that fits one Arabic row", () => {
    render(<Multi size="xs" />)
    expect(slot("select-value")).toHaveClass("flex", "flex-wrap", "gap-1", "py-px")
  })

  it("removes a value from its badge without opening the menu", async () => {
    const onValueChange = vi.fn()
    render(<Multi onValueChange={onValueChange} />)
    const remove = slots("select-badge-remove")[0]!
    expect(remove).toHaveAttribute("aria-hidden", "true")
    await act(async () => {
      fireEvent.pointerDown(remove)
      fireEvent.mouseDown(remove)
      fireEvent.click(remove)
    })
    expect(onValueChange).toHaveBeenCalledWith(["jeddah"])
    expect(slots("select-badge").map((b) => b.textContent)).toEqual(["Jeddah"])
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  it("adds to the values from the menu and stays open", async () => {
    const onValueChange = vi.fn()
    render(<Multi onValueChange={onValueChange} />)
    await open()
    await press(screen.getByRole("option", { name: "Dammam" }))
    expect(onValueChange).toHaveBeenCalledWith(["riyadh", "jeddah", "dammam"])
    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(
      screen.getAllByRole("option").map((o) => o.getAttribute("aria-selected"))
    ).toEqual(["true", "true", "true"])
  })

  it("shows the values as one line of text with display=\"text\"", () => {
    render(<Multi display="text" />)
    expect(slot("select-badge")).toBeNull()
    expect(slot("select-value")).toHaveTextContent("Riyadh, Jeddah")
    expect(slot("select-value")).toHaveClass("truncate")
  })

  it("joins the text with the Arabic comma on an Arabic page", () => {
    render(
      <div dir="rtl" lang="ar">
        <Select
          multiple
          display="text"
          aria-label="المدن"
          items={[
            { value: "riyadh", label: "الرياض" },
            { value: "jeddah", label: "جدة" },
          ]}
          defaultValue={["riyadh", "jeddah"]}
        />
      </div>
    )
    expect(slot("select-value")).toHaveTextContent("الرياض، جدة")
  })

  it("shows the placeholder while nothing is chosen", () => {
    render(<Multi defaultValue={[]} placeholder="Select cities" />)
    expect(slot("select-placeholder")).toHaveTextContent("Select cities")
  })
})

describe("Select — disabled and read-only", () => {
  it("disables the trigger and dims the whole field", () => {
    render(<Select disabled label="City" items={CITIES} />)
    expect(trigger()).toBeDisabled()
    expect(slot("select-field")).toHaveAttribute("data-disabled")
    expect(slot("select-field")).toHaveClass("data-[disabled]:opacity-50")
  })

  it("drops the badges' remove when disabled or read-only", () => {
    const { unmount } = render(<Select multiple disabled aria-label="Cities" items={CITIES} defaultValue={["riyadh"]} />)
    expect(slot("select-badge")).not.toBeNull()
    expect(slot("select-badge-remove")).toBeNull()
    unmount()
    render(<Select multiple readOnly aria-label="Cities" items={CITIES} defaultValue={["riyadh"]} />)
    expect(slot("select-badge-remove")).toBeNull()
  })
})

describe("Select — direction", () => {
  // The font is copied too; jsdom does not inherit `font-family`, so that was
  // checked in a browser (Cairo on the Arabic menu).
  it("hands the trigger's direction and language to the portalled menu", async () => {
    render(
      <div dir="rtl" lang="ar">
        <Cities />
      </div>
    )
    await open()
    const positioner = slot("select-positioner")!
    expect(positioner).toHaveAttribute("dir", "rtl")
    expect(positioner).toHaveAttribute("lang", "ar")
  })

  it("stays left-to-right on a left-to-right page", async () => {
    render(<Cities />)
    await open()
    expect(slot("select-positioner")).toHaveAttribute("dir", "ltr")
  })
})

import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Form } from "@base-ui/react/form"
import { InputNumber, type InputNumberVariant } from "./input-number"
import { inputBoxVariants, inputLabelClassName, inputLabelRowClassName } from "../input/input"

/**
 * What these tests can and cannot prove.
 *
 * jsdom applies no stylesheet and has no layout, so the visual tests assert
 * **class presence only** — that the right utility lands on the right element.
 * Heights, the dividers, the tokens in Light and Dark and the RTL mirror were
 * measured in a real browser. The wiring — the label, stepping, the limits,
 * the buttons' names, `aria-invalid`, disabled — is real DOM and is tested as
 * such.
 */

const VARIANTS: InputNumberVariant[] = [
  "default",
  "vertically-stacked",
  "horizontally-stacked",
  "horizontally-stretched",
  "mini",
]

const slot = (container: HTMLElement, name: string) => container.querySelector(`[data-slot=${name}]`) as HTMLElement
const box = (container: HTMLElement) => slot(container, "input-number-box")
const root = (container: HTMLElement) => slot(container, "input-number-field")
const inc = (container: HTMLElement) => slot(container, "input-number-increment")
const dec = (container: HTMLElement) => slot(container, "input-number-decrement")
/** The order the parts come in the box, in DOM order — the LTR reading order. */
const order = (container: HTMLElement) =>
  Array.from(box(container).querySelectorAll("[data-slot^=input-number-]"))
    .map((node) => node.getAttribute("data-slot")!.replace("input-number-", ""))
    .filter((name) => name !== "buttons")

describe("InputNumber", () => {
  it("renders a numeric text input", () => {
    render(<InputNumber aria-label="Quantity" defaultValue={3} />)
    const input = screen.getByRole("textbox", { name: "Quantity" })
    expect(input).toHaveValue("3")
    expect(input).toHaveAttribute("inputmode", "numeric")
  })

  it("defaults to the Default variant", () => {
    const { container } = render(<InputNumber aria-label="Quantity" />)
    expect(root(container)).toHaveAttribute("data-variant", "default")
  })

  it("draws Input's md box: the same classes, so the same height, border, shadow and focus ring", () => {
    for (const variant of VARIANTS) {
      const { container, unmount } = render(<InputNumber variant={variant} aria-label="Quantity" />)
      const shared = inputBoxVariants({ size: "md" })
        .split(" ")
        // Only the inline padding and gap change per variant.
        .filter((c) => !/^(px-|gap-|cursor-)/.test(c))
      expect(box(container)).toHaveClass(...shared)
      expect(box(container)).toHaveClass("h-9", "border-input", "shadow-sm", "focus-within:ring-[3px]")
      unmount()
    }
  })

  it("centres the value, at Input's text size", () => {
    render(<InputNumber aria-label="Quantity" />)
    expect(screen.getByRole("textbox")).toHaveClass("text-center", "text-base", "md:text-sm", "text-foreground")
  })

  it.each([
    ["default", ["input", "decrement", "increment"]],
    ["vertically-stacked", ["input", "increment", "decrement"]],
    ["horizontally-stacked", ["input", "decrement", "increment"]],
    ["horizontally-stretched", ["decrement", "input", "increment"]],
    ["mini", ["decrement", "input", "increment"]],
  ] as const)("%s puts its parts in Figma's order", (variant, expected) => {
    const { container } = render(<InputNumber variant={variant} aria-label="Quantity" />)
    expect(order(container)).toEqual(expected)
  })

  it.each(["default", "mini"] as const)("%s uses Icon Button: Soft, Primary, icon-xs", (variant) => {
    const { container } = render(<InputNumber variant={variant} aria-label="Quantity" />)
    for (const button of [inc(container), dec(container)]) {
      expect(button).toHaveAttribute("data-variant", "soft")
      expect(button).toHaveAttribute("data-tone", "primary")
      expect(button).toHaveAttribute("data-size", "icon-xs")
    }
  })

  it("Default keeps 6px between and around its buttons", () => {
    const { container } = render(<InputNumber aria-label="Quantity" />)
    expect(slot(container, "input-number-buttons")).toHaveClass("gap-1.5", "px-1.5")
    expect(box(container)).toHaveClass("px-0", "gap-0")
  })

  it("Mini is 128px wide and keeps Input's 12px padding and 6px gap", () => {
    const { container } = render(<InputNumber variant="mini" aria-label="Quantity" />)
    expect(root(container)).toHaveClass("w-32")
    expect(box(container)).toHaveClass("px-3", "gap-1.5")
  })

  it("puts each segment's divider on the logical side that faces the field", () => {
    const stacked = render(<InputNumber variant="horizontally-stacked" aria-label="Quantity" />)
    expect(dec(stacked.container)).toHaveClass("border-s", "w-9", "h-full")
    expect(inc(stacked.container)).toHaveClass("border-s", "w-9", "h-full")
    stacked.unmount()

    const stretched = render(<InputNumber variant="horizontally-stretched" aria-label="Quantity" />)
    expect(dec(stretched.container)).toHaveClass("border-e")
    expect(dec(stretched.container)).not.toHaveClass("border-s")
    expect(inc(stretched.container)).toHaveClass("border-s")
    stretched.unmount()

    const vertical = render(<InputNumber variant="vertically-stacked" aria-label="Quantity" />)
    expect(inc(vertical.container)).toHaveClass("border-s", "border-b", "h-1/2")
    expect(dec(vertical.container)).toHaveClass("border-s", "h-1/2")
    expect(dec(vertical.container)).not.toHaveClass("border-b")
    expect(slot(vertical.container, "input-number-buttons")).toHaveClass("w-[23px]", "flex-col")
  })

  it("uses logical properties only: no physical side and no forced direction", () => {
    for (const variant of VARIANTS) {
      const { container, unmount } = render(<InputNumber variant={variant} label="Quantity" />)
      const classes = Array.from(container.querySelectorAll("[class]"))
        .map((node) => node.getAttribute("class"))
        .join(" ")
      // `border-l` or `border-r`, not `border-ring`.
      expect(classes).not.toMatch(/(^|\s|:)(border-[lr](?![a-z])|[pm][lr]-|left-|right-|text-left|text-right)/)
      expect(container.querySelector("[dir=ltr], [dir=rtl]")).toBeNull()
      unmount()
    }
  })

  it("lets the value pick its own direction, so a minus sign stays before the digits in RTL", () => {
    render(<InputNumber aria-label="Change" defaultValue={-5} />)
    expect(screen.getByRole("textbox")).toHaveAttribute("dir", "auto")
  })

  it("links the label to the input", () => {
    render(<InputNumber label="Quantity" />)
    expect(screen.getByRole("textbox", { name: "Quantity" })).toBeInTheDocument()
  })

  it("uses Input's label: the same row and the same classes", () => {
    const { container } = render(<InputNumber label="Quantity" />)
    expect(slot(container, "input-number-label-row").className).toBe(inputLabelRowClassName)
    expect(screen.getByText("Quantity").className).toBe(inputLabelClassName)
    expect(screen.getByText("Quantity")).toHaveClass("text-sm", "font-medium", "text-foreground")
  })

  it("gives the segment buttons no hover, as Input and Select have none", () => {
    for (const variant of ["vertically-stacked", "horizontally-stacked", "horizontally-stretched"] as const) {
      const { container, unmount } = render(<InputNumber variant={variant} aria-label="Quantity" />)
      for (const button of [inc(container), dec(container)]) {
        expect(button.getAttribute("class")).not.toMatch(/hover:/)
      }
      unmount()
    }
  })

  it("steps with ArrowUp and ArrowDown", () => {
    const onValueChange = vi.fn()
    render(<InputNumber aria-label="Quantity" defaultValue={2} onValueChange={onValueChange} />)
    const input = screen.getByRole("textbox")
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(input).toHaveValue("3")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(input).toHaveValue("1")
    expect(onValueChange).toHaveBeenLastCalledWith(1, expect.anything())
  })

  it("steps with the buttons, by `step`", () => {
    const { container } = render(<InputNumber aria-label="Quantity" defaultValue={10} step={5} />)
    fireEvent.click(inc(container))
    expect(screen.getByRole("textbox")).toHaveValue("15")
    fireEvent.click(dec(container))
    fireEvent.click(dec(container))
    expect(screen.getByRole("textbox")).toHaveValue("5")
  })

  it.each(VARIANTS)("%s disables the matching button at min and max, and never hides it", (variant) => {
    const { container, rerender } = render(
      <InputNumber variant={variant} aria-label="Quantity" value={0} min={0} max={3} />
    )
    expect(dec(container)).toBeDisabled()
    expect(dec(container)).toBeVisible()
    expect(inc(container)).not.toBeDisabled()
    rerender(<InputNumber variant={variant} aria-label="Quantity" value={3} min={0} max={3} />)
    expect(inc(container)).toBeDisabled()
    expect(inc(container)).toBeVisible()
    expect(dec(container)).not.toBeDisabled()
  })

  it("keeps ArrowUp inside max", () => {
    render(<InputNumber aria-label="Quantity" defaultValue={3} max={3} />)
    const input = screen.getByRole("textbox")
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(input).toHaveValue("3")
  })

  it("names the buttons Increase and Decrease, in Arabic under an Arabic lang", () => {
    const { container } = render(<InputNumber aria-label="Quantity" />)
    // Base UI's own English aria-label is cleared, so the hidden text names them.
    expect(inc(container)).not.toHaveAttribute("aria-label")
    expect(screen.getByRole("button", { name: /Increase/ })).toBe(inc(container))
    expect(screen.getByRole("button", { name: /Decrease/ })).toBe(dec(container))
    expect(inc(container).textContent).toContain("زيادة")
    expect(dec(container).textContent).toContain("إنقاص")
    expect(screen.getByText("زيادة")).toHaveClass("hidden", "[&:lang(ar)]:inline")
    expect(screen.getByText("Increase")).toHaveClass("[&:lang(ar)]:hidden")
  })

  it("takes its own button names", () => {
    const { container } = render(
      <InputNumber aria-label="Guests" incrementLabel="Add a guest" decrementLabel="Remove a guest" />
    )
    expect(screen.getByRole("button", { name: "Add a guest" })).toBe(inc(container))
    expect(screen.getByRole("button", { name: "Remove a guest" })).toBe(dec(container))
    expect(inc(container).textContent).not.toContain("Increase")
  })

  it("takes the buttons out of the tab order: the input steps from the keyboard", () => {
    const { container } = render(<InputNumber aria-label="Quantity" />)
    expect(inc(container)).toHaveAttribute("tabindex", "-1")
    expect(dec(container)).toHaveAttribute("tabindex", "-1")
  })

  it("shows Western digits in an Arabic locale", () => {
    render(<InputNumber aria-label="Quantity" defaultValue={1250} locale="ar-EG" />)
    // The group separator is the locale's; the digits are 0–9.
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toMatch(/^1\D?250$/)
  })

  it("reads a value typed in Arabic-Indic digits as the same number", () => {
    const onValueChange = vi.fn()
    render(<InputNumber aria-label="Quantity" onValueChange={onValueChange} />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "٤٢" } })
    expect(onValueChange).toHaveBeenLastCalledWith(42, expect.anything())
  })

  it("marks Success on the root, for Input's status classes", () => {
    const { container } = render(<InputNumber aria-label="Quantity" status="success" />)
    expect(root(container)).toHaveAttribute("data-status", "success")
    expect(root(container)).toHaveClass("group/input")
  })

  it("marks the field invalid with `invalid` or `aria-invalid`", () => {
    const { container, rerender } = render(<InputNumber aria-label="Quantity" invalid />)
    expect(root(container)).toHaveAttribute("data-invalid")
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
    rerender(<InputNumber aria-label="Quantity" aria-invalid />)
    expect(root(container)).toHaveAttribute("data-invalid")
    rerender(<InputNumber aria-label="Quantity" />)
    expect(root(container)).not.toHaveAttribute("data-invalid")
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid")
  })

  it("turns invalid through Base UI's own validation", async () => {
    const { container } = render(
      <Form onSubmit={(event) => event.preventDefault()}>
        <InputNumber aria-label="Quantity" name="quantity" required />
        <button type="submit">Save</button>
      </Form>
    )
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save" }))
    })
    expect(root(container)).toHaveAttribute("data-invalid")
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })

  it("disables the input and both buttons, and dims the field once", () => {
    const { container } = render(<InputNumber variant="mini" aria-label="Quantity" defaultValue={2} disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
    expect(inc(container)).toBeDisabled()
    expect(dec(container)).toBeDisabled()
    expect(root(container)).toHaveAttribute("data-disabled")
    expect(root(container)).toHaveClass("data-[disabled]:opacity-50")
    // The buttons don't dim again on top of the field.
    expect(inc(container)).toHaveClass("group-data-[disabled]/input:opacity-100")
  })

  it("submits the value under `name`", () => {
    const { container } = render(<InputNumber aria-label="Quantity" name="quantity" defaultValue={4} />)
    const hidden = container.querySelector("input[type=number]") as HTMLInputElement
    expect(hidden).toHaveValue(4)
  })

  it("puts className on the field group and the ref on the input", () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(<InputNumber ref={ref} aria-label="Quantity" className="max-w-xs" />)
    expect(root(container)).toHaveClass("max-w-xs")
    expect(ref.current).toBe(screen.getByRole("textbox"))
  })

  it("lets className widen Mini", () => {
    const { container } = render(<InputNumber variant="mini" aria-label="Quantity" className="w-40" />)
    expect(root(container)).toHaveClass("w-40")
    expect(root(container)).not.toHaveClass("w-32")
  })
})

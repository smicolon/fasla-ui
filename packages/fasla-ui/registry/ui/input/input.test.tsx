import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Form } from "@base-ui/react/form"
import { Input } from "./input"

/**
 * What these tests can and cannot prove.
 *
 * jsdom applies no stylesheet and has no layout, so the visual tests assert
 * **class presence only** — that the right utility lands on the right element.
 * Heights, padding, the tokens in Light and Dark and the RTL mirror were
 * measured in a real browser. The wiring — labels, descriptions, errors,
 * `aria-invalid`, disabled — is real DOM and is tested as such.
 */

const box = (container: HTMLElement) => container.querySelector("[data-slot=input-box]")!
const root = (container: HTMLElement) => container.querySelector("[data-slot=input-field]")!

describe("Input", () => {
  it("renders a text input with its placeholder", () => {
    render(<Input placeholder="Type here" />)
    expect(screen.getByPlaceholderText("Type here").tagName).toBe("INPUT")
  })

  it("defaults to md and Standard", () => {
    const { container } = render(<Input />)
    expect(box(container)).toHaveClass("h-9", "gap-1.5", "rounded-[var(--radius-md)]")
  })

  it.each([
    ["xs", "h-7", "gap-0.5"],
    ["sm", "h-8", "gap-1"],
    ["md", "h-9", "gap-1.5"],
    ["lg", "h-10", "gap-2"],
  ] as const)("size %s is %s with %s", (size, height, gap) => {
    const { container } = render(<Input size={size} />)
    expect(box(container)).toHaveClass(height, gap, "px-3")
    // No block padding: it would shrink the input under Cairo's 16px line.
    expect(box(container).getAttribute("class")).not.toMatch(/(^|\s)py-/)
  })

  it("sets the value at 16px below md and 14px from md up", () => {
    render(<Input aria-label="Name" />)
    expect(screen.getByRole("textbox")).toHaveClass("text-base", "md:text-sm")
  })

  it("draws the helper labels at full strength", () => {
    const { container } = render(<Input label="Bio" labelEnd="Optional" description="Help" descriptionEnd="0/160" />)
    for (const slot of ["input-label-end", "input-description", "input-description-end"]) {
      const node = container.querySelector(`[data-slot=${slot}]`)!
      expect(node).toHaveClass("text-muted-foreground")
      expect(node.getAttribute("class")).not.toMatch(/\/80/)
    }
  })

  it("renders the Rounded radius", () => {
    const { container } = render(<Input radius="rounded" />)
    expect(box(container)).toHaveClass("rounded-full")
  })

  it("draws the box from tokens only", () => {
    const { container } = render(<Input />)
    expect(box(container)).toHaveClass(
      "border-input",
      "bg-background",
      "dark:bg-input/30",
      "focus-within:border-ring",
      "focus-within:ring-[3px]",
      "focus-within:ring-ring/50"
    )
  })

  it("links the label to the input", () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText("Email").tagName).toBe("INPUT")
  })

  it("keeps a caller's id, so an outside label still works", () => {
    render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" />
      </>
    )
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email")
  })

  it("describes the input with every helper label", () => {
    render(
      <Input label="Bio" labelEnd="Optional" description="Shown on your profile" descriptionEnd="0/160" />
    )
    const input = screen.getByLabelText("Bio")
    expect(input).toHaveAccessibleDescription(/Optional/)
    expect(input).toHaveAccessibleDescription(/Shown on your profile/)
    expect(input).toHaveAccessibleDescription(/0\/160/)
  })

  it("puts the helper labels at the start and end of their rows", () => {
    const { container } = render(
      <Input label="Bio" labelEnd="Optional" description="Help" descriptionEnd="0/160" />
    )
    expect(container.querySelector("[data-slot=input-label-end]")).toHaveClass("ms-auto", "text-end")
    expect(container.querySelector("[data-slot=input-description-end]")).toHaveClass("ms-auto", "text-end")
  })

  it("keeps each end note on its row's first line", () => {
    const { container } = render(
      <Input label="Bio" labelEnd="Optional" description="Help" descriptionEnd="0/160" />
    )
    // The label row shares the label's baseline; the helper row is top-aligned.
    const labelRow = container.querySelector("[data-slot=input-label-row]")
    const helperRow = container.querySelector("[data-slot=input-helper-row]")
    expect(labelRow).toHaveClass("items-baseline")
    expect(labelRow).not.toHaveClass("items-start")
    expect(labelRow).not.toHaveClass("items-center")
    expect(helperRow).toHaveClass("items-start")
    expect(helperRow).not.toHaveClass("items-baseline")
    expect(helperRow).not.toHaveClass("items-center")
  })

  it("renders no label or helper row when they are not used", () => {
    const { container } = render(<Input aria-label="Search" />)
    expect(container.querySelector("[data-slot=input-label-row]")).toBeNull()
    expect(container.querySelector("[data-slot=input-helper-row]")).toBeNull()
  })

  it("marks the field invalid with `invalid`", () => {
    const { container } = render(<Input label="Email" invalid />)
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true")
    expect(root(container)).toHaveAttribute("data-invalid")
  })

  it("marks the field invalid with `aria-invalid`", () => {
    const { container } = render(<Input label="Email" aria-invalid />)
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true")
    expect(root(container)).toHaveAttribute("data-invalid")
  })

  it.each(["grammar", "spelling"] as const)("treats aria-invalid=%s as invalid", (value) => {
    const { container } = render(<Input label="Bio" aria-invalid={value} error="Check the spelling" />)
    expect(root(container)).toHaveAttribute("data-invalid")
    expect(screen.getByLabelText("Bio")).toHaveAccessibleDescription("Check the spelling")
  })

  it("treats aria-invalid=false as valid", () => {
    const { container } = render(<Input label="Bio" aria-invalid="false" />)
    expect(root(container)).not.toHaveAttribute("data-invalid")
  })

  it("turns the box, label and helpers destructive while invalid", () => {
    const { container } = render(<Input label="Email" description="Help" invalid />)
    expect(box(container)).toHaveClass("group-data-[invalid]/input:border-destructive")
    expect(container.querySelector("[data-slot=input-label]")).toHaveClass(
      "group-data-[invalid]/input:text-destructive"
    )
    expect(container.querySelector("[data-slot=input-description]")).toHaveClass(
      "group-data-[invalid]/input:text-destructive"
    )
  })

  it("shows the error in place of the description while invalid", () => {
    const { rerender } = render(
      <Input label="Email" description="We never share it" error="Enter a valid email" />
    )
    expect(screen.getByText("We never share it")).toBeInTheDocument()
    expect(screen.queryByText("Enter a valid email")).toBeNull()

    rerender(<Input label="Email" description="We never share it" error="Enter a valid email" invalid />)
    expect(screen.queryByText("We never share it")).toBeNull()
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("Enter a valid email")
  })

  it("keeps the description when invalid with no error message", () => {
    render(<Input label="Email" description="We never share it" invalid />)
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("We never share it")
  })

  it("shows Base UI's validation result after a submit", () => {
    const { container } = render(
      <Form>
        <Input label="Name" name="name" required error="Enter your name" />
        <button type="submit">Save</button>
      </Form>
    )
    expect(root(container)).not.toHaveAttribute("data-invalid")
    fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(root(container)).toHaveAttribute("data-invalid")
    expect(screen.getByText("Enter your name")).toBeInTheDocument()
  })

  it("marks success with `status`", () => {
    const { container } = render(<Input label="Coupon" status="success" />)
    expect(root(container)).toHaveAttribute("data-status", "success")
    expect(box(container)).toHaveClass("group-[:not([data-invalid])[data-status=success]]/input:border-success")
    expect(container.querySelector("[data-slot=input-label]")).toHaveClass(
      "group-[:not([data-invalid])[data-status=success]]/input:text-success"
    )
  })

  it("dims the whole group and disables the input", () => {
    const { container } = render(<Input label="Name" disabled />)
    expect(screen.getByLabelText("Name")).toBeDisabled()
    expect(root(container)).toHaveAttribute("data-disabled")
    expect(root(container)).toHaveClass("data-[disabled]:opacity-50")
  })

  it("places the icons at the start and end of the box", () => {
    const { container } = render(
      <Input
        aria-label="Search"
        startIcon={<svg data-testid="start" />}
        endIcon={<svg data-testid="end" />}
      />
    )
    const children = Array.from(box(container).children)
    expect(children[0]).toContainElement(screen.getByTestId("start"))
    expect(children[1]).toBe(screen.getByRole("textbox"))
    expect(children[2]).toContainElement(screen.getByTestId("end"))
  })

  it("focuses the input from a press on a decorative icon", () => {
    render(<Input aria-label="Search" startIcon={<svg data-testid="start" />} />)
    fireEvent.mouseDown(screen.getByTestId("start"))
    expect(screen.getByRole("textbox")).toHaveFocus()
  })

  it("leaves a button in an icon slot alone", () => {
    const onClick = vi.fn()
    render(
      <Input
        aria-label="Password"
        endIcon={
          <button type="button" onClick={onClick}>
            Show
          </button>
        }
      />
    )
    fireEvent.mouseDown(screen.getByRole("button"))
    expect(screen.getByRole("textbox", { name: "Password" })).not.toHaveFocus()
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalled()
  })

  it("uses only logical properties", () => {
    const { container } = render(
      <Input label="A" labelEnd="B" description="C" descriptionEnd="D" startIcon={<svg />} endIcon={<svg />} />
    )
    const classes = Array.from(container.querySelectorAll("[class]"))
      .map((node) => node.getAttribute("class"))
      .join(" ")
    expect(classes).not.toMatch(/(^|\s)(pl|pr|ml|mr|left|right|text-left|text-right)-/)
  })

  it("handles onChange", () => {
    const onChange = vi.fn()
    render(<Input aria-label="Name" onChange={onChange} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Layla" } })
    expect(onChange).toHaveBeenCalled()
  })

  it("puts className on the group and forwards the ref to the input", () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(<Input ref={ref} className="max-w-sm" />)
    expect(root(container)).toHaveClass("max-w-sm")
    expect(ref.current?.tagName).toBe("INPUT")
  })
})

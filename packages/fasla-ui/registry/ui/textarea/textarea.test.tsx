import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Form } from "@base-ui/react/form"
import { Textarea } from "./textarea"

/**
 * What these tests can and cannot prove.
 *
 * jsdom applies no stylesheet and has no layout, so the visual tests assert
 * **class presence only** — that the right utility lands on the right element.
 * The auto-grow height, the resize grip, the tokens in Light and Dark and the
 * RTL mirror were measured in a real browser. The wiring — labels,
 * descriptions, errors, `aria-invalid`, disabled — is real DOM and is tested
 * as such.
 */

const root = (container: HTMLElement) => container.querySelector("[data-slot=textarea-field]")!

describe("Textarea", () => {
  it("renders a textarea with its placeholder", () => {
    render(<Textarea placeholder="Type here" />)
    expect(screen.getByPlaceholderText("Type here").tagName).toBe("TEXTAREA")
  })

  it("draws the box from Figma: 60px minimum, 6/14px padding, 8px radius", () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByRole("textbox")).toHaveClass(
      "min-h-[60px]",
      "py-1.5",
      "px-3.5",
      "rounded-[var(--radius-md)]"
    )
  })

  it("grows with its text and resizes vertically only", () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByRole("textbox")).toHaveClass("[field-sizing:content]", "resize-y")
  })

  it("has no size prop", () => {
    // @ts-expect-error — Figma has no size axis.
    render(<Textarea aria-label="Notes" size="lg" />)
    expect(screen.getByRole("textbox").getAttribute("class")).not.toMatch(/(^|\s)h-\d/)
  })

  it("sets the value at 16px below md and 14px from md up", () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByRole("textbox")).toHaveClass("text-base", "md:text-sm")
  })

  it("draws the box from tokens only", () => {
    render(<Textarea aria-label="Notes" />)
    expect(screen.getByRole("textbox")).toHaveClass(
      "border-input",
      "bg-background",
      "dark:bg-input/30",
      "focus-visible:border-ring",
      "focus-visible:ring-[3px]",
      "focus-visible:ring-ring/50",
      "[&::-webkit-resizer]:text-muted-foreground"
    )
  })

  it("gives Default no shadow and Success and Error Figma's sm shadow", () => {
    render(<Textarea aria-label="Notes" />)
    const classes = screen.getByRole("textbox").getAttribute("class")!.split(/\s+/)
    expect(classes).not.toContain("shadow")
    expect(classes).not.toContain("shadow-sm")
    expect(classes).toContain("group-data-[invalid]/textarea:shadow")
    expect(classes).toContain("group-[:not([data-invalid])[data-status=success]]/textarea:shadow")
  })

  it("mirrors the resize grip to the bottom-left corner in RTL", () => {
    render(<Textarea aria-label="Notes" />)
    const classes = screen.getByRole("textbox").getAttribute("class")!
    expect(classes).toMatch(/\[&::-webkit-resizer\]:\[background:var\(--textarea-grip-ltr\)_right_/)
    expect(classes).toMatch(/rtl:\[&::-webkit-resizer\]:\[background:var\(--textarea-grip-rtl\)_left_/)
  })

  it("draws the helper labels at full strength", () => {
    const { container } = render(
      <Textarea label="Bio" labelEnd="Optional" description="Help" descriptionEnd="0/160" />
    )
    for (const slot of ["textarea-label-end", "textarea-description", "textarea-description-end"]) {
      const node = container.querySelector(`[data-slot=${slot}]`)!
      expect(node).toHaveClass("text-muted-foreground")
      expect(node.getAttribute("class")).not.toMatch(/\/80/)
    }
  })

  it("spaces the label row, the box and the helper row 6px apart, as Figma does", () => {
    const { container } = render(<Textarea label="Bio" />)
    expect(root(container)).toHaveClass("flex-col", "gap-1.5")
  })

  it("links the label to the textarea", () => {
    render(<Textarea label="Message" />)
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA")
  })

  it("keeps a caller's id, so an outside label still works", () => {
    render(
      <>
        <label htmlFor="message">Message</label>
        <Textarea id="message" />
      </>
    )
    expect(screen.getByLabelText("Message")).toHaveAttribute("id", "message")
  })

  it("describes the textarea with every helper label", () => {
    render(
      <Textarea label="Bio" labelEnd="Optional" description="Shown on your profile" descriptionEnd="0/160" />
    )
    const textarea = screen.getByLabelText("Bio")
    expect(textarea).toHaveAccessibleDescription(/Optional/)
    expect(textarea).toHaveAccessibleDescription(/Shown on your profile/)
    expect(textarea).toHaveAccessibleDescription(/0\/160/)
  })

  it("puts the helper labels at the start and end of their rows", () => {
    const { container } = render(
      <Textarea label="Bio" labelEnd="Optional" description="Help" descriptionEnd="0/160" />
    )
    expect(container.querySelector("[data-slot=textarea-label-end]")).toHaveClass("ms-auto", "text-end")
    expect(container.querySelector("[data-slot=textarea-description-end]")).toHaveClass("ms-auto", "text-end")
  })

  it("keeps each end note on its row's first line", () => {
    const { container } = render(
      <Textarea label="Bio" labelEnd="Optional" description="Help" descriptionEnd="0/160" />
    )
    const labelRow = container.querySelector("[data-slot=textarea-label-row]")
    const helperRow = container.querySelector("[data-slot=textarea-helper-row]")
    expect(labelRow).toHaveClass("items-baseline")
    expect(helperRow).toHaveClass("items-start")
  })

  it("renders no label or helper row when they are not used", () => {
    const { container } = render(<Textarea aria-label="Notes" />)
    expect(container.querySelector("[data-slot=textarea-label-row]")).toBeNull()
    expect(container.querySelector("[data-slot=textarea-helper-row]")).toBeNull()
  })

  it("updates a counter passed as descriptionEnd", () => {
    function Counted() {
      const [value, setValue] = React.useState("")
      return (
        <Textarea
          label="Notes"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={200}
          descriptionEnd={`${value.length}/200`}
        />
      )
    }
    render(<Counted />)
    expect(screen.getByLabelText("Notes")).toHaveAccessibleDescription("0/200")
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Leave it at the door" } })
    expect(screen.getByLabelText("Notes")).toHaveAccessibleDescription("20/200")
    expect(screen.getByLabelText("Notes")).toHaveAttribute("maxlength", "200")
  })

  it("marks the field invalid with `invalid`", () => {
    const { container } = render(<Textarea label="Message" invalid />)
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-invalid", "true")
    expect(root(container)).toHaveAttribute("data-invalid")
  })

  it("marks the field invalid with `aria-invalid`", () => {
    const { container } = render(<Textarea label="Message" aria-invalid />)
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-invalid", "true")
    expect(root(container)).toHaveAttribute("data-invalid")
  })

  it.each(["grammar", "spelling"] as const)("keeps aria-invalid=%s on the textarea", (value) => {
    const { container } = render(<Textarea label="Bio" aria-invalid={value} error="Check the spelling" />)
    expect(root(container)).toHaveAttribute("data-invalid")
    expect(screen.getByLabelText("Bio")).toHaveAttribute("aria-invalid", value)
    expect(screen.getByLabelText("Bio")).toHaveAccessibleDescription("Check the spelling")
  })

  it("lets `invalid={false}` win over an aria-invalid token", () => {
    const { container } = render(<Textarea label="Bio" invalid={false} aria-invalid="spelling" />)
    expect(root(container)).not.toHaveAttribute("data-invalid")
    expect(screen.getByLabelText("Bio")).not.toHaveAttribute("aria-invalid", "spelling")
  })

  it("treats aria-invalid=false as valid", () => {
    const { container } = render(<Textarea label="Bio" aria-invalid="false" />)
    expect(root(container)).not.toHaveAttribute("data-invalid")
  })

  it("turns the box, label and helpers destructive while invalid", () => {
    const { container } = render(<Textarea label="Message" description="Help" invalid />)
    expect(screen.getByLabelText("Message")).toHaveClass("group-data-[invalid]/textarea:border-destructive")
    expect(container.querySelector("[data-slot=textarea-label]")).toHaveClass(
      "group-data-[invalid]/textarea:text-destructive"
    )
    expect(container.querySelector("[data-slot=textarea-description]")).toHaveClass(
      "group-data-[invalid]/textarea:text-destructive"
    )
  })

  it("shows the error in place of the description while invalid", () => {
    const { rerender } = render(
      <Textarea label="Message" description="We reply within a day" error="Write a message first" />
    )
    expect(screen.getByText("We reply within a day")).toBeInTheDocument()
    expect(screen.queryByText("Write a message first")).toBeNull()

    rerender(<Textarea label="Message" description="We reply within a day" error="Write a message first" invalid />)
    expect(screen.queryByText("We reply within a day")).toBeNull()
    expect(screen.getByLabelText("Message")).toHaveAccessibleDescription("Write a message first")
  })

  it("keeps the description when invalid with no error message", () => {
    render(<Textarea label="Message" description="We reply within a day" invalid />)
    expect(screen.getByLabelText("Message")).toHaveAccessibleDescription("We reply within a day")
  })

  it("shows Base UI's validation result after a submit", () => {
    const { container } = render(
      <Form>
        <Textarea label="Message" name="message" required error="Write a message first" />
        <button type="submit">Send</button>
      </Form>
    )
    expect(root(container)).not.toHaveAttribute("data-invalid")
    fireEvent.click(screen.getByRole("button", { name: "Send" }))
    expect(root(container)).toHaveAttribute("data-invalid")
    expect(screen.getByText("Write a message first")).toBeInTheDocument()
  })

  it("marks success with `status`", () => {
    const { container } = render(<Textarea label="Review" status="success" />)
    expect(root(container)).toHaveAttribute("data-status", "success")
    expect(screen.getByLabelText("Review")).toHaveClass(
      "group-[:not([data-invalid])[data-status=success]]/textarea:border-success"
    )
    expect(container.querySelector("[data-slot=textarea-label]")).toHaveClass(
      "group-[:not([data-invalid])[data-status=success]]/textarea:text-success"
    )
  })

  it("dims the whole group and disables the textarea", () => {
    const { container } = render(<Textarea label="Message" disabled />)
    expect(screen.getByLabelText("Message")).toBeDisabled()
    expect(root(container)).toHaveAttribute("data-disabled")
    expect(root(container)).toHaveClass("data-[disabled]:opacity-50")
  })

  it("uses only logical properties outside the RTL grip", () => {
    const { container } = render(
      <Textarea label="A" labelEnd="B" description="C" descriptionEnd="D" />
    )
    const classes = Array.from(container.querySelectorAll("[class]"))
      .flatMap((node) => node.getAttribute("class")!.split(/\s+/))
      // The grip is drawn on `::-webkit-resizer`, which has no logical
      // background position; its RTL rule mirrors it explicitly.
      .filter((cls) => !cls.includes("::-webkit-resizer"))
      .join(" ")
    expect(classes).not.toMatch(/(^|\s)(pl|pr|ml|mr|left|right|text-left|text-right)-/)
  })

  it("handles onChange and onValueChange", () => {
    const onChange = vi.fn()
    const onValueChange = vi.fn()
    render(<Textarea aria-label="Notes" onChange={onChange} onValueChange={onValueChange} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Ring twice" } })
    expect(onChange).toHaveBeenCalled()
    expect(onValueChange).toHaveBeenCalledWith("Ring twice", expect.anything())
  })

  it("keeps a defaultValue", () => {
    render(<Textarea aria-label="Notes" defaultValue="Ring twice" />)
    expect(screen.getByRole("textbox")).toHaveValue("Ring twice")
  })

  it("puts className on the group and forwards the ref to the textarea", () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    const { container } = render(<Textarea ref={ref} className="max-w-sm" />)
    expect(root(container)).toHaveClass("max-w-sm")
    expect(ref.current?.tagName).toBe("TEXTAREA")
  })
})

import * as React from "react"
import { afterEach, describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, type InputOTPProps } from "./input-otp"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and no caret movement of its own, so nothing
 * here proves slot sizes, where the ring falls or how a browser moves the
 * caret. Those were measured in Chrome, Safari (WebKit) and Firefox in both
 * directions: 36px slots, shared borders, the 24px separator, the slots
 * filling from the right in Arabic and every arrow moving the way it points.
 * The visual tests below assert the classes only.
 */

/** Figma's Simple type: two groups of three with a separator between. */
function Simple(props: Omit<InputOTPProps, "maxLength" | "children" | "render">) {
  return (
    <InputOTP maxLength={6} aria-label="Verification code" {...props}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

const input = () => screen.getByRole("textbox", { name: "Verification code" }) as HTMLInputElement
const slots = () => [...document.querySelectorAll<HTMLElement>("[data-slot=input-otp-slot]")]
const slotText = () => slots().map((slot) => slot.textContent)

describe("InputOTP — semantics", () => {
  it("is one text field for the whole code, asking for the SMS code and the numeric keyboard", () => {
    render(<Simple />)
    expect(screen.getAllByRole("textbox")).toHaveLength(1)
    expect(input()).toHaveAttribute("autocomplete", "one-time-code")
    expect(input()).toHaveAttribute("inputmode", "numeric")
    expect(input()).toHaveAttribute("maxlength", "6")
  })

  it("hides the slots and the separator from assistive tech, so the code is read once", () => {
    render(<Simple defaultValue="123" />)
    for (const slot of slots()) expect(slot).toHaveAttribute("aria-hidden", "true")
    expect(document.querySelector("[data-slot=input-otp-separator]")).toHaveAttribute("aria-hidden", "true")
    expect(document.querySelector("[data-slot=input-otp-separator]")).not.toHaveAttribute("role")
  })

  it("shows each character of the value in its slot", () => {
    render(<Simple defaultValue="1234" />)
    expect(slotText()).toEqual(["1", "2", "3", "4", "", ""])
  })

  it("passes the ref to the input", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(
      <InputOTP ref={ref} maxLength={2} aria-label="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(ref.current).toBe(input())
  })
})

describe("InputOTP — value", () => {
  it("calls onChange with each new code, and onComplete once the last slot is filled", () => {
    const onChange = vi.fn()
    const onComplete = vi.fn()
    render(<Simple onChange={onChange} onComplete={onComplete} />)
    fireEvent.change(input(), { target: { value: "12345" } })
    expect(onChange).toHaveBeenLastCalledWith("12345")
    expect(onComplete).not.toHaveBeenCalled()
    fireEvent.change(input(), { target: { value: "123456" } })
    expect(onComplete).toHaveBeenCalledWith("123456")
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<Simple value="12" onChange={() => {}} />)
    expect(slotText()).toEqual(["1", "2", "", "", "", ""])
    rerender(<Simple value="9876" onChange={() => {}} />)
    expect(slotText()).toEqual(["9", "8", "7", "6", "", ""])
  })

  it("ignores a change that fails the pattern", () => {
    const onChange = vi.fn()
    render(<Simple pattern={REGEXP_ONLY_DIGITS} onChange={onChange} />)
    fireEvent.change(input(), { target: { value: "12a" } })
    expect(onChange).not.toHaveBeenCalled()
    expect(input().value).toBe("")
  })

  it("stores Arabic-Indic digits as Western digits, and lets them pass a digits pattern", () => {
    const onChange = vi.fn()
    render(<Simple pattern={REGEXP_ONLY_DIGITS} onChange={onChange} />)
    fireEvent.change(input(), { target: { value: "١٢٣۴" } })
    expect(onChange).toHaveBeenLastCalledWith("1234")
    expect(input().value).toBe("1234")
    expect(slotText()).toEqual(["1", "2", "3", "4", "", ""])
  })

  it("shows a controlled value's Arabic-Indic digits as Western digits", () => {
    render(<Simple value="١٢" onChange={() => {}} />)
    expect(input().value).toBe("12")
    expect(slotText()).toEqual(["1", "2", "", "", "", ""])
  })

  it("keeps the caller's pattern on the input for native validation", () => {
    render(<Simple pattern={REGEXP_ONLY_DIGITS} />)
    expect(input()).toHaveAttribute("pattern", REGEXP_ONLY_DIGITS)
  })
})

describe("InputOTP — states", () => {
  it("marks the input and every slot invalid with aria-invalid", () => {
    render(<Simple aria-invalid />)
    expect(input()).toHaveAttribute("aria-invalid", "true")
    for (const slot of slots()) expect(slot).toHaveAttribute("data-invalid")
  })

  it("reads aria-invalid as ARIA does: false and \"false\" are valid", () => {
    const { rerender } = render(<Simple aria-invalid={false} />)
    for (const slot of slots()) expect(slot).not.toHaveAttribute("data-invalid")
    rerender(<Simple aria-invalid="false" />)
    for (const slot of slots()) expect(slot).not.toHaveAttribute("data-invalid")
  })

  it("lets one slot be marked invalid on its own", () => {
    render(
      <InputOTP maxLength={2} aria-label="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} aria-invalid />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(slots()[0]).not.toHaveAttribute("data-invalid")
    expect(slots()[1]).toHaveAttribute("data-invalid")
  })

  it("disables the input, and dims the whole field through the container", () => {
    render(<Simple disabled />)
    expect(input()).toBeDisabled()
    expect(input().closest("[data-input-otp-container]")).toHaveClass("has-[:disabled]:opacity-50")
  })

  it("marks the slot the next character goes into as active while focused", () => {
    render(<Simple defaultValue="12" />)
    expect(slots().some((slot) => slot.hasAttribute("data-active"))).toBe(false)
    fireEvent.focus(input())
    expect(slots()[2]).toHaveAttribute("data-active")
  })
})

describe("InputOTP — direction", () => {
  /**
   * jsdom does not inherit `direction`, so a right-to-left field is one whose
   * computed style says so, as a browser's would under `dir="rtl"`.
   */
  const rtl = () => {
    const computed = window.getComputedStyle
    return vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
      const style = computed(element, pseudo)
      if (!(element instanceof HTMLInputElement)) return style
      return new Proxy(style, {
        get: (target, key) => {
          if (key === "direction") return "rtl"
          const value = Reflect.get(target, key)
          return typeof value === "function" ? value.bind(target) : value
        },
      })
    })
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /** Puts a collapsed caret at `at`, presses `key`, and returns where the caret is. */
  const press = (key: string, at: number) => {
    input().setSelectionRange(at, at)
    fireEvent.keyDown(input(), { key })
    return input().selectionStart
  }

  it("moves the caret the way each arrow points in a right-to-left field", () => {
    rtl()
    render(<Simple defaultValue="1234" />)
    expect(press("ArrowLeft", 2)).toBe(3)
    expect(press("ArrowRight", 2)).toBe(1)
    expect(press("ArrowLeft", 4)).toBe(4)
    expect(press("ArrowRight", 0)).toBe(0)
  })

  it("leaves a left-to-right field's arrows to the browser", () => {
    render(<Simple defaultValue="1234" />)
    expect(press("ArrowLeft", 2)).toBe(2)
    expect(press("ArrowRight", 2)).toBe(2)
  })

  it("lets the caller's onKeyDown prevent the move", () => {
    rtl()
    render(<Simple defaultValue="1234" onKeyDown={(event) => event.preventDefault()} />)
    expect(press("ArrowLeft", 2)).toBe(2)
    expect(press("ArrowLeft", 2)).toBe(2)
  })

  it("leaves Shift and the other modified arrows to the browser", () => {
    rtl()
    render(<Simple defaultValue="1234" />)
    input().setSelectionRange(2, 2)
    fireEvent.keyDown(input(), { key: "ArrowLeft", shiftKey: true })
    expect(input().selectionStart).toBe(2)
  })
})

describe("InputOTP — look", () => {
  it("draws Figma's 36px slot: 1px input border, SM text, no fill", () => {
    render(<Simple />)
    expect(slots()[0]).toHaveClass("size-9", "border-y", "border-e", "border-input", "text-sm", "text-foreground")
    expect(slots()[0]!.className).not.toMatch(/\bbg-/)
  })

  it("shares borders inside a group and rounds only the group's ends, on logical sides", () => {
    render(<Simple />)
    expect(slots()[0]).toHaveClass("first:border-s", "first:rounded-s-lg", "last:rounded-e-lg")
    expect(slots()[0]!.className).not.toMatch(/rounded-(l|r)-|border-(l|r)\b/)
  })

  it("draws Active as a 3px ring, destructive at 20% when invalid", () => {
    render(<Simple />)
    expect(slots()[0]).toHaveClass(
      "data-[active]:z-10",
      "data-[active]:ring-[3px]",
      "data-[active]:ring-ring",
      "data-[invalid]:border-destructive",
      "data-[invalid]:data-[active]:ring-destructive/20"
    )
  })

  it("draws the separator as a 20px, 1px line in a 24px box", () => {
    render(<Simple />)
    const separator = document.querySelector("[data-slot=input-otp-separator]")!
    expect(separator).toHaveClass("size-6", "text-foreground")
    expect(separator.firstElementChild).toHaveClass("h-px", "w-5", "rounded-full", "bg-current")
  })

  it("keeps the hidden input's text transparent in forced colors", () => {
    render(<Simple />)
    expect(input()).toHaveClass("[forced-color-adjust:none]")
  })

  it("spaces the row 8px by default, and takes containerClassName over it", () => {
    const { unmount } = render(<Simple />)
    expect(input().closest("[data-input-otp-container]")).toHaveClass("gap-2")
    unmount()
    render(<Simple containerClassName="gap-1.5" />)
    const container = input().closest("[data-input-otp-container]")!
    expect(container).toHaveClass("gap-1.5")
    expect(container).not.toHaveClass("gap-2")
  })
})

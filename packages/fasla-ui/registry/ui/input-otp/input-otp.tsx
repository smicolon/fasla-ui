"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: OTP Input (40465:54984), 8 variants, and its slot, Otp Input Item
 * (15097:22526), 5 states.
 *
 * Built on input-otp, as shadcn's Input OTP is. One real `<input>` lies over
 * the slots and owns the behaviour: typing, pasting, deleting, the one-time
 * code autofill (`autocomplete="one-time-code"`), the numeric keyboard and
 * form submission. The slots only draw what it holds. This file owns the
 * look, with shadcn's four parts: `InputOTP`, `InputOTPGroup`,
 * `InputOTPSlot` and `InputOTPSeparator`.
 *
 * Figma axis → code:
 *  - `Type` → how the parts are composed, never a prop:
 *     - Simple: two groups of three slots, a separator between, 6px apart.
 *     - Digits only: one group of six slots.
 *     - With Separator: three groups of two slots, separators between, 8px
 *       apart.
 *     - With Spacing: six groups of one slot, 8px apart, so every slot has
 *       its own border and corners.
 *  - `Direction` → the page's `dir`, never a prop. In Arabic the first slot
 *    is on the right, and the arrow keys move the way they point.
 *  - Otp Input Item `State`:
 *     - Default → nothing.
 *     - Active → the slot the next character goes into, while the field has
 *       focus.
 *     - Destructive Default / Destructive Active → `aria-invalid` on
 *       `InputOTP`, as on Input.
 *     - Disabled → `disabled` on `InputOTP`: the whole field at 50%.
 */

/** Arabic-Indic (٠–٩) and Extended Arabic-Indic (۰–۹) digits, as Western digits. */
function toLatinDigits(text: string) {
  return text.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (digit) =>
    String((digit.charCodeAt(0) - 0x0660) % 0x90)
  )
}

/** Whether an `aria-invalid` value marks the field invalid: any value but `false`, as ARIA reads it. */
const saysInvalid = (value: React.AriaAttributes["aria-invalid"]) =>
  value !== undefined && value !== false && value !== "false"

/** Whether the field is invalid, for the slots: `aria-invalid` on `InputOTP`. */
const InputOTPInvalidContext = React.createContext(false)

/**
 * In Arabic the slots run from the right, so the left arrow must move to the
 * next slot and the right arrow to the previous one. Browsers disagree on
 * digits in a right-to-left field: Chrome moves that way, but Safari and
 * Firefox move through the digits left to right, so their left arrow steps
 * back to the slot on the right. So in a right-to-left field the caret is
 * moved here, in every browser: exactly as the browser moves it for the
 * other arrow in English, and input-otp then selects the slot as it always
 * does.
 */
function moveCaretVisually(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
  if (event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return
  const input = event.currentTarget
  if (getComputedStyle(input).direction !== "rtl") return
  event.preventDefault()
  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? start
  const forward = event.key === "ArrowLeft"
  const caret = forward
    ? start === end
      ? Math.min(end + 1, input.value.length)
      : end
    : start === end
      ? Math.max(start - 1, 0)
      : start
  input.setSelectionRange(caret, caret)
}

type OTPInputProps = React.ComponentPropsWithoutRef<typeof OTPInput>

export type InputOTPProps = Omit<OTPInputProps, "value" | "defaultValue" | "onChange" | "pattern"> & {
  /** The code, for a controlled field. */
  value?: string
  /** The code the field starts with, for an uncontrolled field. */
  defaultValue?: string
  /** Called with the new code on every change. Arabic-Indic digits arrive as Western digits. */
  onChange?: (value: string) => void
  /**
   * A regular expression every character must match, such as input-otp's
   * `REGEXP_ONLY_DIGITS`. A typed or pasted value that fails it is ignored.
   * Arabic-Indic digits are read as Western digits before the test.
   */
  pattern?: string
  /** Classes for the row that holds the groups and separators. */
  containerClassName?: string
  /** Classes for the hidden `<input>`. */
  className?: string
}

/**
 * The field: one `<input>` and the row of groups drawn under it. The row is
 * 8px between its groups and separators, Figma's gap for With Separator and
 * With Spacing; Simple sets 6px with `containerClassName="gap-1.5"`.
 *
 * `aria-invalid` goes to the input, so a screen reader hears the field is
 * invalid, and turns every slot `destructive`. `disabled` dims the whole
 * field to 50%, as on Input.
 *
 * Digits typed or pasted in Arabic-Indic form (٠١٢…) are stored as Western
 * digits, so the code reads the same in every locale and passes a digits
 * pattern. The ref is the input's.
 *
 * The input keeps input-otp's transparent text in forced colors (Windows
 * high contrast): the browser would otherwise paint it, and the whole code
 * would show piled up over the first slot.
 */
const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      pattern,
      containerClassName,
      className,
      onKeyDown,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(() => toLatinDigits(defaultValue ?? ""))
    const code = value === undefined ? uncontrolled : toLatinDigits(value)

    // input-otp tests each change against the pattern before it reaches
    // `onChange`, so the test itself reads Arabic-Indic digits as Western.
    // `source` stays the caller's, for the input's own `pattern` attribute.
    const regexp = React.useMemo(() => {
      if (!pattern) return undefined
      const rule = new RegExp(pattern)
      const accepting = new RegExp(pattern)
      accepting.test = (text: string) => rule.test(toLatinDigits(text))
      return accepting
    }, [pattern])

    const handleChange = (next: string) => {
      const latin = toLatinDigits(next)
      if (value === undefined) setUncontrolled(latin)
      onChange?.(latin)
    }

    return (
      <InputOTPInvalidContext.Provider value={saysInvalid(ariaInvalid)}>
        <OTPInput
          ref={ref}
          data-slot="input-otp"
          value={code}
          onChange={handleChange}
          // input-otp also takes a RegExp here; its types only say string.
          pattern={regexp as unknown as string | undefined}
          aria-invalid={ariaInvalid}
          containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
          className={cn("[forced-color-adjust:none] disabled:cursor-not-allowed", className)}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (!event.defaultPrevented) moveCaretVisually(event)
          }}
          {...(props as OTPInputProps)}
        />
      </InputOTPInvalidContext.Provider>
    )
  }
)
InputOTP.displayName = "InputOTP"

/**
 * A group: slots that touch and share their borders, Figma's `Simple` frame.
 * Only the ends of a group are rounded, so a group of one slot (With
 * Spacing) is rounded all round.
 */
const InputOTPGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />
  )
)
InputOTPGroup.displayName = "InputOTPGroup"

/**
 * A slot: Figma's Otp Input Item. 36 × 36px, the character in SM Regular
 * `foreground`, a 1px `input` border and no fill.
 *
 * In a group the slots share their borders: each draws its top, bottom and
 * end edges, and only the first draws its start edge. The first slot rounds
 * its start corners and the last its end corners, by Figma's
 * `border radius/lg` (10px): `rounded-lg`, the project's `--radius`, as Tabs
 * and Accordion use for the same step. Logical sides, so in Arabic the
 * first slot is the one on the right.
 *
 * Active: the slot the next character goes into, while the field has focus.
 * A 3px `ring` outside the border, which keeps its `input` colour, as in
 * Figma. It rises over its neighbours so the ring is never covered.
 *
 * Destructive: the border turns `destructive`, and the Active ring is
 * `destructive` at 20% (Figma's `opacity/destructive/20`, in Light and
 * Dark). Set by `aria-invalid` on `InputOTP`, or on one slot.
 *
 * In forced colors (Windows high contrast), where rings are not painted, the
 * Active slot gets a 2px system `Highlight` outline instead.
 *
 * The slot is hidden from assistive tech: the input already holds the code,
 * so a screen reader would read every character twice.
 */
const inputOTPSlotClasses = cn(
  "relative flex size-9 items-center justify-center border-y border-e border-input text-sm text-foreground",
  "first:rounded-s-lg first:border-s last:rounded-e-lg",
  "transition-[border-color,box-shadow] motion-reduce:transition-none",
  "data-[active]:z-10 data-[active]:ring-[3px] data-[active]:ring-ring",
  "data-[invalid]:border-destructive data-[invalid]:data-[active]:ring-destructive/20",
  "forced-colors:data-[active]:[outline:2px_solid_Highlight]"
)

type InputOTPSlotProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Which character of the code this slot shows, from 0. */
  index: number
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const context = React.useContext(OTPInputContext)
    const fieldInvalid = React.useContext(InputOTPInvalidContext)
    const { char, isActive } = context?.slots?.[index] ?? {}
    const invalid = ariaInvalid === undefined ? fieldInvalid : saysInvalid(ariaInvalid)
    return (
      <div
        ref={ref}
        data-slot="input-otp-slot"
        data-active={isActive ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        aria-hidden
        className={cn(inputOTPSlotClasses, className)}
        {...props}
      >
        {char}
      </div>
    )
  }
)
InputOTPSlot.displayName = "InputOTPSlot"

/**
 * The separator between groups: Figma's 24px `Seprator` frame, a 20px line
 * 1px thick in `foreground`, with round ends. Decorative, like the slots.
 * Pass children to draw something else in the same 24px box.
 */
const InputOTPSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-otp-separator"
      aria-hidden
      className={cn("flex size-6 shrink-0 items-center justify-center text-foreground", className)}
      {...props}
    >
      {children ?? <span className="h-px w-5 rounded-full bg-current" />}
    </div>
  )
)
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

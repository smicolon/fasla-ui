"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: "Textarea" (3928:2374), beside Default Input.
 *
 * Built like Input, on Base UI's Field, which owns the wiring: the label's
 * `for`, the description and error ids in `aria-describedby`, `aria-invalid`,
 * and native constraint validation (`required`, `minLength`, a `validate`
 * function on a Base UI Form). Field's control renders a `<textarea>` here.
 * This file owns the look.
 *
 * Figma axis → code:
 *  - `State`:
 *     - Default → nothing.
 *     - Focus → real focus.
 *     - Success → `status="success"`.
 *     - Error → the field's invalid state: `invalid`, `aria-invalid`, or
 *       Base UI's own validation. Never a colour prop.
 *     - Disabled → `disabled`.
 *  - `Filled` → not a prop: it is the difference between a placeholder and a
 *    value.
 *  - `Direction` → the page's `dir`. Everything is laid out with logical
 *    properties, so the helper labels and the resize grip swap sides in RTL.
 *  - The booleans → optional props, named as Input's: `- Label` → `label`,
 *    `- Top Right label` → `labelEnd`, `- Bottom Left / Right label` →
 *    `description` (or `error`) / `descriptionEnd`, the character counter.
 *  - No size axis, so no `size` prop.
 */

type TextareaStatus = "default" | "success"

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * Figma's resize handle: two 1px strokes in `muted-foreground`, drawn on the
 * browser's own resizer so the grip still resizes. Each stroke is the
 * diagonal of its own 6.67 × 9.33px box — a `to bottom right` gradient puts
 * its 50% line through the other two corners — anchored where Figma has it,
 * measured from the bottom corner inside the 1px border. RTL mirrors it to
 * the bottom-left corner, where Chrome and Safari put the resizer.
 *
 * Chromium and WebKit draw it; Firefox has no `::-webkit-resizer` and keeps
 * its own grip, in the same corner. The stroke is a custom property so each
 * corner's rule names it twice instead of spelling it out; Tailwind reads
 * classes as written, so they stay literal.
 */
const GRIP = [
  "[--textarea-grip-ltr:linear-gradient(to_bottom_right,transparent_calc(50%-0.5px),currentColor_calc(50%-0.5px)_calc(50%+0.5px),transparent_calc(50%+0.5px))]",
  "[--textarea-grip-rtl:linear-gradient(to_bottom_left,transparent_calc(50%-0.5px),currentColor_calc(50%-0.5px)_calc(50%+0.5px),transparent_calc(50%+0.5px))]",
  "[&::-webkit-resizer]:text-muted-foreground",
  "[&::-webkit-resizer]:[background:var(--textarea-grip-ltr)_right_5.67px_bottom_2.33px/6.67px_9.33px_no-repeat,var(--textarea-grip-ltr)_right_1.67px_bottom_2.33px/6.67px_9.33px_no-repeat]",
  "rtl:[&::-webkit-resizer]:[background:var(--textarea-grip-rtl)_left_5.67px_bottom_2.33px/6.67px_9.33px_no-repeat,var(--textarea-grip-rtl)_left_1.67px_bottom_2.33px/6.67px_9.33px_no-repeat]",
]

/**
 * The field box: Figma's `input` frame, which here is the `<textarea>`
 * itself, so the browser's resizer sits in the box's corner.
 *
 * From Figma: 6px block and 14px inline padding, Figma's `border radius/md`
 * (8px, read through the preset's `--radius-md`, as Input does) and a 60px
 * minimum height, which holds two lines of Geist; two lines of Cairo's
 * taller leading grow it to 62px. The fill
 * is `background`, and `input` at 30% in Dark: Figma's
 * `custom/background-input-30`, the same as Input.
 *
 * Height follows the text: `field-sizing: content` grows the box a line at a
 * time from the minimum, and `useAutoGrow` does the same where the browser
 * lacks it. The grip still resizes it by hand, vertically only.
 *
 * The shadow is Input's: Figma's xs shadow — Tailwind 3's `shadow-sm` — in
 * every state but Focus, which swaps it for a `ring` border and a 3px
 * `ring/50` halo. Success and Error recolour the border, keep it through
 * focus and tint the halo. Success matches only a field that is not invalid,
 * so an invalid field never shows as a success, and the group selectors
 * out-rank `focus-visible:`.
 *
 * Disabled turns resizing off. With `resize: none` no browser draws a
 * resizer, so the grip goes too, as in Figma's Disabled variants.
 */
const BOX = [
  "block min-h-[60px] w-full min-w-0 resize-y rounded-[var(--radius-md)] border border-input bg-background px-3.5 py-1.5 shadow-sm dark:bg-input/30",
  "[field-sizing:content]",
  "transition-[color,border-color,box-shadow] motion-reduce:transition-none",
  "focus-visible:border-ring focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "group-[:not([data-invalid])[data-status=success]]/textarea:border-success group-[:not([data-invalid])[data-status=success]]/textarea:ring-success/20 dark:group-[:not([data-invalid])[data-status=success]]/textarea:ring-success/40",
  "group-data-[invalid]/textarea:border-destructive group-data-[invalid]/textarea:ring-destructive/20 dark:group-data-[invalid]/textarea:ring-destructive/40",
  // The value is 16px below `md` and Figma's SM (14px) from `md` up, as
  // Input's is: iOS Safari zooms the page into any field set under 16px when
  // it takes focus. Both rungs re-lead under `[dir="rtl"]` to Cairo's 28
  // and 24px.
  "text-start text-base text-foreground md:text-sm",
  "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:resize-none",
  GRIP,
]

/**
 * The label row and the helper row: Figma's `Top` and `Bottom` frames, as
 * Input's. 4px padding all round and an 8px gap; the two labels sit at either
 * end. The label row aligns to the baseline, so the smaller `labelEnd` sits
 * on the label's first line; the helper row aligns to the top, so the
 * counter stays on the first line of a wrapping description.
 */
const ROW = "flex justify-between gap-2 p-1"
const LABEL_ROW = cn(ROW, "items-baseline")
const HELPER_ROW = cn(ROW, "items-start")

/**
 * Figma's Top Right and Bottom labels: XS Regular in `muted-foreground`, and
 * the status colour in Success and Error. Full strength, as Input's: Figma's
 * 0.8 layer opacity put the grey text under AA.
 */
const HELPER = [
  "text-xs text-muted-foreground",
  "group-[:not([data-invalid])[data-status=success]]/textarea:text-success",
  "group-data-[invalid]/textarea:text-destructive",
]

/**
 * Grows the box with its text where the browser has no `field-sizing`
 * (Firefox, older Safari). It sets the height to the text's, never under the
 * CSS minimum, and never under a height the reader dragged the grip to. A
 * change of width re-fits it, since the text re-wraps.
 */
function useAutoGrow(ref: React.RefObject<HTMLTextAreaElement | null>, value: unknown) {
  const fitRef = React.useRef<() => void>(() => {})

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof CSS !== "undefined" && CSS.supports?.("field-sizing", "content")) return

    let dragged = 0
    let set = 0
    let width = el.offsetWidth
    const fit = () => {
      // Not laid out (hidden, or a test DOM): nothing to measure.
      if (!el.offsetParent && el.offsetHeight === 0) return
      // From zero, not `auto`: `auto` keeps the default two rows, which in
      // Cairo is taller than the 60px minimum. At zero the minimum decides.
      el.style.height = "0px"
      const border = el.offsetHeight - el.clientHeight
      set = Math.max(el.scrollHeight + border, dragged)
      el.style.height = `${set}px`
    }
    fitRef.current = fit
    fit()
    // A web font that loads after the first fit re-wraps the text.
    let live = true
    document.fonts?.ready.then(() => live && fit())

    el.addEventListener("input", fit)
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            if (el.offsetWidth !== width) {
              width = el.offsetWidth
              fit()
            } else if (el.offsetHeight !== set) {
              // Only the grip changes the height without changing the width.
              dragged = el.offsetHeight
              set = dragged
            }
          })
    observer?.observe(el)
    return () => {
      live = false
      el.removeEventListener("input", fit)
      observer?.disconnect()
      fitRef.current = () => {}
    }
  }, [ref])

  // A controlled value set from outside fires no `input` event.
  React.useEffect(() => fitRef.current(), [value])
}

export interface TextareaProps
  extends Omit<React.ComponentPropsWithoutRef<"textarea">, "className" | "defaultValue"> {
  /** The starting text, when uncontrolled. */
  defaultValue?: string
  /** Called with the new text when it changes. */
  onValueChange?: FieldPrimitive.Control.Props["onValueChange"]
  /**
   * Marks a field that passed validation. An invalid field shows as invalid
   * whatever this says.
   */
  status?: TextareaStatus
  /**
   * Marks the field invalid: the border, the label and the helper labels turn
   * `destructive`, and the textarea gets `aria-invalid`. Passing
   * `aria-invalid` does the same — any value but `false` — and the textarea
   * keeps the value passed (`grammar`, `spelling`); so does Base UI's own
   * validation.
   */
  invalid?: boolean
  /** The field's label, above it. Without it, pass `aria-label` or label the textarea yourself. */
  label?: React.ReactNode
  /**
   * A short note at the end of the label row — "Optional", "Max 500 chars".
   * Read out with the description.
   */
  labelEnd?: React.ReactNode
  /** Helper text at the start of the row under the field. */
  description?: React.ReactNode
  /** Helper text at the end of the row under the field — usually a character count. */
  descriptionEnd?: React.ReactNode
  /**
   * The message shown while the field is invalid, in place of `description`.
   * Without it, an invalid field shows Base UI's validation message, if it has one.
   */
  error?: React.ReactNode
  /** Classes for the whole field group. The `ref` and every other prop go to the `<textarea>`. */
  className?: string
}

// A multi-line text field that grows with its text, with an optional label,
// helper text and character counter. Not a JSDoc block: Storybook would show
// it as the Docs page's intro, and no component has one yet.
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      status = "default",
      invalid,
      disabled,
      label,
      labelEnd,
      description,
      descriptionEnd,
      error,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const mergedRef = React.useMemo(() => mergeRefs(ref, textareaRef), [ref])
    useAutoGrow(textareaRef, props.value)
    // ARIA reads every `aria-invalid` value but `false` as invalid — `true`,
    // `grammar`, `spelling`, and any value it does not recognise.
    const ariaSaysInvalid = ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false"
    const isInvalid = invalid ?? ariaSaysInvalid
    // Base UI writes `aria-invalid="true"` on an invalid field, after the
    // caller's props, so a passed token would be lost; the render function
    // puts a caller's `grammar` or `spelling` back. Only while the field is
    // invalid: `invalid={false}` wins.
    const ariaInvalidToken = isInvalid && ariaSaysInvalid ? ariaInvalid : undefined

    return (
      <FieldPrimitive.Root
        data-slot="textarea-field"
        data-status={status === "success" ? "success" : undefined}
        invalid={isInvalid}
        disabled={disabled}
        className={cn("group/textarea flex w-full min-w-0 flex-col gap-1.5 data-[disabled]:opacity-50", className)}
      >
        {(label || labelEnd) && (
          <div data-slot="textarea-label-row" className={LABEL_ROW}>
            {label && (
              <FieldPrimitive.Label
                data-slot="textarea-label"
                className={cn(
                  "min-w-0 text-sm font-medium text-foreground",
                  "group-[:not([data-invalid])[data-status=success]]/textarea:text-success group-data-[invalid]/textarea:text-destructive"
                )}
              >
                {label}
              </FieldPrimitive.Label>
            )}
            {labelEnd && (
              <FieldPrimitive.Description
                data-slot="textarea-label-end"
                className={cn("ms-auto max-w-[50%] shrink-0 text-end", HELPER)}
              >
                {labelEnd}
              </FieldPrimitive.Description>
            )}
          </div>
        )}

        <FieldPrimitive.Control
          ref={mergedRef}
          data-slot="textarea"
          className={cn(BOX)}
          {...(props as FieldPrimitive.Control.Props)}
          render={(controlProps) => (
            <textarea
              {...(controlProps as React.ComponentPropsWithRef<"textarea">)}
              aria-invalid={ariaInvalidToken ?? controlProps["aria-invalid"]}
            />
          )}
        />

        {/* The helper row. While the field is invalid, the start of it shows
            the error — `error`, else Base UI's message — in place of the
            description, so a screen reader hears only the one that shows. */}
        <FieldPrimitive.Validity>
          {({ validity, error: validityError }) => {
            const message = validity.valid === false ? (error ?? (validityError || null)) : null
            if (!message && !description && !descriptionEnd) return null
            return (
              <div data-slot="textarea-helper-row" className={HELPER_ROW}>
                {message ? (
                  <FieldPrimitive.Error data-slot="textarea-error" match className={cn("min-w-0", HELPER)}>
                    {message}
                  </FieldPrimitive.Error>
                ) : (
                  description && (
                    <FieldPrimitive.Description data-slot="textarea-description" className={cn("min-w-0", HELPER)}>
                      {description}
                    </FieldPrimitive.Description>
                  )
                )}
                {descriptionEnd && (
                  <FieldPrimitive.Description
                    data-slot="textarea-description-end"
                    className={cn("ms-auto max-w-[50%] shrink-0 text-end", HELPER)}
                  >
                    {descriptionEnd}
                  </FieldPrimitive.Description>
                )}
              </div>
            )
          }}
        </FieldPrimitive.Validity>
      </FieldPrimitive.Root>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaStatus }

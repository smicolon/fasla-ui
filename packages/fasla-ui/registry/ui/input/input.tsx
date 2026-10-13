"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: "Default Input" (414:12784), on the Text Input page.
 *
 * Built on Base UI's Field and Input, which own the wiring: the label's `for`,
 * the description and error ids in `aria-describedby`, `aria-invalid`, and
 * native constraint validation (`required`, `pattern`, a `validate` function on
 * a Base UI Form). This file owns the look.
 *
 * Figma axis → code:
 *  - `Size` (xs / sm / md / lg) → `size`. Figma's default is xs; code's is md,
 *    as for every atom.
 *  - `Radius` (Standard / Rounded) → `radius`.
 *  - `State`:
 *     - Default → nothing.
 *     - Focus → real focus.
 *     - Success → `status="success"`.
 *     - Destructive → the field's invalid state: `invalid`, `aria-invalid`, or
 *       Base UI's own validation. Never a colour prop.
 *     - Disabled → `disabled`.
 *  - `Filled` → not a prop: it is the difference between a placeholder and a
 *    value.
 *  - `Direction` → the page's `dir`. Everything is laid out with logical
 *    properties, so icons and the helper labels swap sides in RTL.
 *  - The booleans → optional props: `- Label` → `label`, `- Top Additional
 *    label` → `labelEnd`, `- Additional Bottom Left / Right label` →
 *    `description` / `descriptionEnd`, `Prefix-icon` / `Suffix-icon` →
 *    `startIcon` / `endIcon`.
 */

type InputSize = "xs" | "sm" | "md" | "lg"
type InputRadius = "standard" | "rounded"
type InputStatus = "default" | "success"

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * The field box: Figma's `input` frame. It draws the border, fill and focus
 * ring around the icons and the text, which sit in a row as Figma's auto
 * layout has them.
 *
 * Shared: 12px inline padding at every size, a 1px `input` border and Figma's
 * xs shadow — Tailwind 3's `shadow-sm`. The fill is `background`, and `input`
 * at 30% in Dark: Figma's `custom/background-input-30`, shadcn's
 * `dark:bg-input/30`.
 *
 * Focus is Figma's: a `ring` border and a 3px `ring/50` halo, in place of the
 * shadow. `focus-within`, so the halo stays while focus is on a button in an
 * icon slot (a show-password toggle), and so Storybook's pseudo-states addon
 * can force it.
 *
 * Success and Destructive recolour the border. They keep it through focus,
 * and tint the halo with the same colour — shadcn's
 * `aria-invalid:ring-destructive/20`, `/40` in Dark. Figma has no Focus +
 * Destructive variant. The group selectors out-rank `focus-within:`, so the
 * status colours win however Tailwind orders them. Success matches only a
 * field that is not invalid, so an invalid field never shows as a success.
 *
 * Size sets the height and the icon↔text gap, from Figma: 28 / 32 / 36 /
 * 40px and 2 / 4 / 6 / 8px. Figma's block padding (2 / 4 / 4 / 6px) is left
 * out: the height is fixed and the row centres its content, so the padding
 * draws nothing — but it would shrink the input, and at 16px Cairo's 28px
 * line then clips the dots below the line (ي) in xs and sm.
 */
const inputBoxVariants = cva(
  [
    "flex w-full min-w-0 cursor-text items-center border border-input bg-background px-3 shadow-sm dark:bg-input/30",
    "transition-[color,border-color,box-shadow] motion-reduce:transition-none",
    "focus-within:border-ring focus-within:shadow-none focus-within:ring-[3px] focus-within:ring-ring/50",
    "group-[:not([data-invalid])[data-status=success]]/input:border-success group-[:not([data-invalid])[data-status=success]]/input:ring-success/20 dark:group-[:not([data-invalid])[data-status=success]]/input:ring-success/40",
    "group-data-[invalid]/input:border-destructive group-data-[invalid]/input:ring-destructive/20 dark:group-data-[invalid]/input:ring-destructive/40",
    "group-data-[disabled]/input:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        xs: "h-7 gap-0.5",
        sm: "h-8 gap-1",
        md: "h-9 gap-1.5",
        lg: "h-10 gap-2",
      },
      // Figma `border radius/md` (8px), read through the preset's
      // `--radius-md`, as Tabs does; Rounded is `border radius/rounded`.
      radius: {
        standard: "rounded-[var(--radius-md)]",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "standard",
    },
  }
)

/**
 * The label row and the helper row: Figma's `Top` and `Bottom` frames. 4px
 * padding all round and an 8px gap; the two labels sit at either end.
 */
const ROW = "flex items-center justify-between gap-2 p-1"

/**
 * Figma's Top Right and Bottom labels: XS Regular in `muted-foreground`, and
 * the status colour in Success and Destructive. Full strength: Figma's 0.8
 * layer opacity put the grey text at 3.2:1, under AA's 4.5:1, so it was
 * dropped on both sides. `text-xs` re-leads itself under `[dir="rtl"]` to
 * Cairo's 20px, so Arabic needs nothing here.
 */
const HELPER = [
  "text-xs text-muted-foreground",
  "group-[:not([data-invalid])[data-status=success]]/input:text-success",
  "group-data-[invalid]/input:text-destructive",
]

/** An icon slot. Icons are `foreground` at 16px, as in Figma. */
const ICON = "flex shrink-0 items-center text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof InputPrimitive>, "size" | "className" | "render"> {
  /** Field height: 28, 32, 36 or 40px. */
  size?: InputSize
  /** Corner shape: Figma's 8px `border radius/md`, or a full pill. */
  radius?: InputRadius
  /**
   * Marks a field that passed validation. An invalid field shows as invalid
   * whatever this says.
   */
  status?: InputStatus
  /**
   * Marks the field invalid: the border, the label and the helper labels turn
   * `destructive`, and the input gets `aria-invalid`. Passing `aria-invalid`
   * does the same; so does Base UI's own validation.
   */
  invalid?: boolean
  /** The field's label, above it. Without it, pass `aria-label` or label the input yourself. */
  label?: React.ReactNode
  /**
   * A short note at the end of the label row — "Optional", "Max 160 chars".
   * Read out with the description.
   */
  labelEnd?: React.ReactNode
  /** Helper text at the start of the row under the field. */
  description?: React.ReactNode
  /** Helper text at the end of the row under the field — a character count, a status. */
  descriptionEnd?: React.ReactNode
  /**
   * The message shown while the field is invalid, in place of `description`.
   * Without it, an invalid field shows Base UI's validation message, if it has one.
   */
  error?: React.ReactNode
  /** An icon before the text, usually a lucide icon. Sized to 16px. */
  startIcon?: React.ReactNode
  /** An icon or a small button after the text. Sized to 16px. */
  endIcon?: React.ReactNode
  /** Classes for the whole field group. The `ref` and every other prop go to the `<input>`. */
  className?: string
}

/**
 * A text field with an optional label, helper labels and icons, from Figma's
 * Default Input.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = "md",
      radius = "standard",
      status = "default",
      invalid,
      disabled,
      label,
      labelEnd,
      description,
      descriptionEnd,
      error,
      startIcon,
      endIcon,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const mergedRef = React.useMemo(() => mergeRefs(ref, inputRef), [ref])
    const isInvalid = invalid ?? (ariaInvalid === true || ariaInvalid === "true")

    /**
     * A press on the box outside the text — its padding, a decorative icon —
     * focuses the input, as a press on a native field's padding does. A
     * press on anything interactive in an icon slot is left alone.
     */
    const focusInput = (event: React.MouseEvent<HTMLDivElement>) => {
      const input = inputRef.current
      const target = event.target as HTMLElement
      if (!input || target === input || disabled) return
      if (target.closest("button, a, input, select, textarea, [tabindex]")) return
      event.preventDefault()
      input.focus()
    }

    return (
      <FieldPrimitive.Root
        data-slot="input-field"
        data-status={status === "success" ? "success" : undefined}
        invalid={isInvalid}
        disabled={disabled}
        className={cn("group/input flex w-full min-w-0 flex-col data-[disabled]:opacity-50", className)}
      >
        {(label || labelEnd) && (
          <div data-slot="input-label-row" className={ROW}>
            {label && (
              <FieldPrimitive.Label
                data-slot="input-label"
                className={cn(
                  "min-w-0 text-sm font-medium text-foreground",
                  "group-[:not([data-invalid])[data-status=success]]/input:text-success group-data-[invalid]/input:text-destructive"
                )}
              >
                {label}
              </FieldPrimitive.Label>
            )}
            {labelEnd && (
              <FieldPrimitive.Description
                data-slot="input-label-end"
                className={cn("ms-auto max-w-[50%] shrink-0 text-end", HELPER)}
              >
                {labelEnd}
              </FieldPrimitive.Description>
            )}
          </div>
        )}

        <div
          data-slot="input-box"
          className={inputBoxVariants({ size, radius })}
          onMouseDown={focusInput}
        >
          {startIcon && (
            <span data-slot="input-start-icon" className={ICON}>
              {startIcon}
            </span>
          )}
          {/* The value is 16px below `md` and Figma's SM (14px) from `md` up,
              at every size, as shadcn does: iOS Safari zooms the page into
              any field set under 16px when it takes focus. Both rungs re-lead
              under `[dir="rtl"]` to Cairo's 28 and 24px. */}
          <InputPrimitive
            ref={mergedRef}
            data-slot="input"
            className={cn(
              "h-full w-full min-w-0 flex-1 truncate bg-transparent p-0 text-start text-base text-foreground outline-none md:text-sm",
              "placeholder:text-muted-foreground disabled:cursor-not-allowed"
            )}
            {...props}
          />
          {endIcon && (
            <span data-slot="input-end-icon" className={ICON}>
              {endIcon}
            </span>
          )}
        </div>

        {/* The helper row. While the field is invalid, the start of it shows
            the error — `error`, else Base UI's message — in place of the
            description, so a screen reader hears only the one that shows. */}
        <FieldPrimitive.Validity>
          {({ validity, error: validityError }) => {
            const message = validity.valid === false ? (error ?? (validityError || null)) : null
            if (!message && !description && !descriptionEnd) return null
            return (
              <div data-slot="input-helper-row" className={ROW}>
                {message ? (
                  <FieldPrimitive.Error
                    data-slot="input-error"
                    match
                    className={cn("min-w-0", HELPER)}
                  >
                    {message}
                  </FieldPrimitive.Error>
                ) : (
                  description && (
                    <FieldPrimitive.Description
                      data-slot="input-description"
                      className={cn("min-w-0", HELPER)}
                    >
                      {description}
                    </FieldPrimitive.Description>
                  )
                )}
                {descriptionEnd && (
                  <FieldPrimitive.Description
                    data-slot="input-description-end"
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
Input.displayName = "Input"

export { Input, inputBoxVariants }
export type { InputSize, InputRadius, InputStatus }

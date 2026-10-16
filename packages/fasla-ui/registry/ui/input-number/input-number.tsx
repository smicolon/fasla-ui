"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusIcon, PlusIcon } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"
import { Button } from "../button/button"
import { inputBoxVariants, inputLabelClassName, inputLabelRowClassName, type InputStatus } from "../input/input"

/*
 * Figma: "Input Number" (39043:1432, 100 variants) and its internal "Input
 * Number Button" (46381:5702).
 *
 * Built on Base UI's Field and NumberField, which own the behaviour: parsing
 * and formatting, `min` / `max` / `step`, ArrowUp / ArrowDown (Shift and Alt
 * for the large and small steps), Home / End, press-and-hold on the buttons,
 * disabling a button at its limit, and the hidden input that submits the
 * value. Field links the label and carries the invalid and disabled states.
 * This file owns the look.
 *
 * Figma axis → code:
 *  - `Variant` → `variant`: `default`, `vertically-stacked`,
 *    `horizontally-stacked`, `horizontally-stretched` and `mini`.
 *  - `State`, as on Input:
 *     - Default → nothing.
 *     - Focus → real focus.
 *     - Success → `status="success"`.
 *     - Destructive → `invalid`, `aria-invalid`, or Base UI's validation.
 *     - Disabled → `disabled`.
 *  - `Filled` → not a prop: it is the difference between a placeholder and a
 *    value. In Figma's `Filled=No`, the field is at its minimum, so its
 *    decrement button is disabled; Base UI does that from `min`.
 *  - `Direction` → the page's `dir`. Every row is laid out in DOM order with
 *    logical properties, so the buttons and their dividers mirror in RTL.
 *  - `With Label` → `label`.
 *
 * The box is Input's: `inputBoxVariants` at `md`, so the height, border,
 * fill, shadow, focus ring and the Success and Destructive colours are the
 * same classes, keyed off the same `group/input` root.
 */

type InputNumberVariant = "default" | "vertically-stacked" | "horizontally-stacked" | "horizontally-stretched" | "mini"

/**
 * Text that follows the language of the page: English, or Arabic under an
 * Arabic `lang`. Both runs are rendered and CSS keeps the one that matches the
 * nearest `lang`, as Alert's close button does.
 */
const Localised = ({ en, ar }: { en: string; ar: string }) => (
  <>
    <span className="[&:lang(ar)]:hidden">{en}</span>
    <span className="hidden [&:lang(ar)]:inline">{ar}</span>
  </>
)

/**
 * Per variant, what changes on Input's box. Every variant but Mini takes the
 * box's padding off and puts it inside the parts: the field keeps Input's
 * 12px, and the buttons sit flush against the border.
 */
const boxVariants = cva("", {
  variants: {
    variant: {
      default: "gap-0 px-0",
      "vertically-stacked": "gap-0 px-0",
      "horizontally-stacked": "gap-0 px-0",
      "horizontally-stretched": "gap-0 px-0",
      // Figma's 12px inline padding and 6px gap: Input's `md`, unchanged.
      mini: "",
    },
  },
})

/**
 * The value: Input's text, centred, as in every Figma variant. 16px below `md`
 * and 14px from `md` up, as on Input, so iOS does not zoom in. In Mini the
 * field is only as wide as the space between the buttons, so it drops its
 * own padding.
 */
const valueVariants = cva(
  [
    "h-full w-full min-w-0 flex-1 truncate bg-transparent p-0 text-center text-base text-foreground outline-none md:text-sm",
    "placeholder:text-muted-foreground disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        default: "px-3",
        "vertically-stacked": "px-3",
        "horizontally-stacked": "px-3",
        "horizontally-stretched": "px-3",
        mini: "",
      },
    },
  }
)

/**
 * Figma's "Input Number Button": a borderless button with a `foreground`
 * plus or minus, and a 1px `input` divider on one logical side — the side
 * that faces the field. `border-s` / `border-e` swap physical sides with the
 * direction, so the divider follows the field in RTL.
 *
 *  - `segment`: 36px wide, the box's full height, a 14px icon.
 *  - `stack-top` / `stack-bottom`: half the box's height in a 23px column,
 *    a 12px icon. The top one also draws the line between the two.
 *
 * No hover: it is part of the field, and Input and Select have none. At a
 * limit the icon dims to half, as an Icon Button's does, and the divider
 * stays.
 */
const stepperVariants = cva(
  [
    "flex shrink-0 cursor-pointer select-none items-center justify-center border-input text-foreground [outline:none]",
    "disabled:cursor-not-allowed disabled:[&_svg]:opacity-50",
    // A disabled field is already at half opacity, the buttons with it.
    "group-data-[disabled]/input:[&_svg]:opacity-100",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      type: {
        segment: "h-full w-9 [&_svg]:size-3.5",
        // Exact halves, the top one's line inside its half as Figma's
        // inside stroke is: `flex-1` would add the line on top of a half.
        "stack-top": "h-1/2 w-full border-b [&_svg]:size-3",
        "stack-bottom": "h-1/2 w-full [&_svg]:size-3",
      },
      divider: {
        start: "border-s",
        end: "border-e",
      },
    },
    defaultVariants: { type: "segment", divider: "start" },
  }
)

type StepperType = "segment" | "stack-top" | "stack-bottom"
type StepperDivider = "start" | "end"
type Direction = "increment" | "decrement"

const STEPPER = {
  increment: { Part: NumberFieldPrimitive.Increment, Icon: PlusIcon, en: "Increase", ar: "زيادة" },
  decrement: { Part: NumberFieldPrimitive.Decrement, Icon: MinusIcon, en: "Decrease", ar: "إنقاص" },
} as const

/**
 * One stepper button. Base UI's Increment or Decrement owns the behaviour; it
 * renders as Icon Button (Soft, Primary, `icon-xs`) for Default and Mini, and
 * as the internal Input Number Button for the segmented variants.
 *
 * Its name is `label` when given, else "Increase" / "Decrease" in the page's
 * language. Base UI's own English `aria-label` is cleared, so the hidden text
 * names the button.
 */
function Stepper({
  direction,
  label,
  type,
  divider,
}: {
  direction: Direction
  label?: string
  type?: StepperType
  divider?: StepperDivider
}) {
  const { Part, Icon, en, ar } = STEPPER[direction]
  const content = (
    <>
      <Icon aria-hidden="true" strokeWidth={1.5} />
      {!label && (
        <span className="sr-only">
          <Localised en={en} ar={ar} />
        </span>
      )}
    </>
  )
  if (!type) {
    return (
      <Part
        data-slot={`input-number-${direction}`}
        aria-label={label}
        // A disabled field is already at half opacity, the button with it:
        // only a button at its limit in a live field dims on its own.
        render={<Button type="button" variant="soft" size="icon-xs" className="group-data-[disabled]/input:opacity-100" />}
      >
        {content}
      </Part>
    )
  }
  return (
    <Part
      data-slot={`input-number-${direction}`}
      aria-label={label}
      className={stepperVariants({ type, divider })}
    >
      {content}
    </Part>
  )
}

export interface InputNumberProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NumberFieldPrimitive.Root>,
    "className" | "render" | "children" | "style" | "inputRef"
  > {
  /**
   * Figma `Variant`: where the buttons sit. `default` puts two Icon Buttons
   * after the value; `vertically-stacked` stacks plus over minus after it;
   * `horizontally-stacked` puts minus and plus after it, divided;
   * `horizontally-stretched` puts minus before it and plus after it; `mini`
   * is a 128px field with Icon Buttons on both sides.
   */
  variant?: InputNumberVariant
  /**
   * Marks a field that passed validation. An invalid field shows as invalid
   * whatever this says.
   */
  status?: InputStatus
  /**
   * Marks the field invalid: the border turns `destructive`, and the input
   * gets `aria-invalid`. Passing `aria-invalid` does the same; so does Base
   * UI's own validation.
   */
  invalid?: boolean
  /** The field's label, above it. Without it, pass `aria-label` or `aria-labelledby`. */
  label?: React.ReactNode
  /** Text shown while the field is empty. */
  placeholder?: string
  /** The increment button's accessible name. Defaults to "Increase", or "زيادة" under an Arabic `lang`. */
  incrementLabel?: string
  /** The decrement button's accessible name. Defaults to "Decrease", or "إنقاص" under an Arabic `lang`. */
  decrementLabel?: string
  /** Names the input when there is no visible `label`. */
  "aria-label"?: string
  /** The id of an element that names the input, in place of `label`. */
  "aria-labelledby"?: string
  /** The id of an element that describes the input. */
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  /** Classes for the whole field group. The `ref` goes to the `<input>`. */
  className?: string
}

/**
 * A number field with step buttons, from Figma's Input Number. Western digits
 * in every language; a value typed in Arabic-Indic digits is read as the same
 * number.
 */
const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      variant = "default",
      status = "default",
      invalid,
      disabled,
      label,
      placeholder,
      incrementLabel,
      decrementLabel,
      format,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const isInvalid = invalid ?? (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false")
    // Western digits whatever the reader's locale: an Arabic locale would
    // otherwise format the value in Arabic-Indic digits. The caller's options
    // win, `numberingSystem` included.
    const formatOptions = React.useMemo<Intl.NumberFormatOptions>(
      () => ({ numberingSystem: "latn", ...format }),
      [format]
    )
    // Only the names the caller passed: an `undefined` would wipe the label
    // link Field puts on the input.
    const inputNames = {
      ...(ariaLabel !== undefined && { "aria-label": ariaLabel }),
      ...(ariaLabelledby !== undefined && { "aria-labelledby": ariaLabelledby }),
      ...(ariaDescribedby !== undefined && { "aria-describedby": ariaDescribedby }),
    }

    const increment = (type?: StepperType, divider?: StepperDivider) => (
      <Stepper direction="increment" label={incrementLabel} type={type} divider={divider} />
    )
    const decrement = (type?: StepperType, divider?: StepperDivider) => (
      <Stepper direction="decrement" label={decrementLabel} type={type} divider={divider} />
    )

    const value = (
      <NumberFieldPrimitive.Input
        ref={ref}
        data-slot="input-number-input"
        placeholder={placeholder}
        // `auto`, not the page's direction: a minus sign is a neutral
        // character, and in an RTL paragraph it would land after the digits.
        dir="auto"
        // Base UI's English "Number field" would be read out on Arabic pages
        // too; the label, the value and the named buttons say enough.
        aria-roledescription={undefined}
        // Field marks its own controls invalid, not NumberField's input. A
        // caller's own token (`grammar`, `spelling`) is kept, as on Input.
        aria-invalid={isInvalid ? (ariaInvalid && ariaInvalid !== "false" ? ariaInvalid : true) : undefined}
        className={valueVariants({ variant })}
        {...inputNames}
      />
    )

    return (
      <FieldPrimitive.Root
        data-slot="input-number-field"
        data-variant={variant}
        data-status={status === "success" ? "success" : undefined}
        invalid={isInvalid}
        disabled={disabled}
        className={cn(
          "group/input flex min-w-0 flex-col data-[disabled]:opacity-50",
          variant === "mini" ? "w-32" : "w-full",
          className
        )}
      >
        {label && (
          // Input's label row and label: SM Medium `foreground`, recoloured
          // in Success and Destructive by the same `group/input` root.
          <div data-slot="input-number-label-row" className={inputLabelRowClassName}>
            <FieldPrimitive.Label data-slot="input-number-label" className={inputLabelClassName}>
              {label}
            </FieldPrimitive.Label>
          </div>
        )}
        <NumberFieldPrimitive.Root
          data-slot="input-number"
          disabled={disabled}
          format={formatOptions}
          className="w-full"
          {...props}
        >
          <NumberFieldPrimitive.Group
            data-slot="input-number-box"
            className={cn(inputBoxVariants({ size: "md" }), "cursor-default", boxVariants({ variant }))}
          >
            {variant === "default" && (
              <>
                {value}
                {/* Figma's `Count`: 6px in from the border, 6px apart. */}
                <div data-slot="input-number-buttons" className="flex h-full shrink-0 items-center gap-1.5 px-1.5">
                  {decrement()}
                  {increment()}
                </div>
              </>
            )}
            {variant === "vertically-stacked" && (
              <>
                {value}
                {/* Plus over minus, in either direction. */}
                <div data-slot="input-number-buttons" className="flex h-full w-[23px] shrink-0 flex-col">
                  {increment("stack-top")}
                  {decrement("stack-bottom")}
                </div>
              </>
            )}
            {variant === "horizontally-stacked" && (
              <>
                {value}
                {decrement("segment", "start")}
                {increment("segment", "start")}
              </>
            )}
            {variant === "horizontally-stretched" && (
              <>
                {decrement("segment", "end")}
                {value}
                {increment("segment", "start")}
              </>
            )}
            {variant === "mini" && (
              <>
                {decrement()}
                {value}
                {increment()}
              </>
            )}
          </NumberFieldPrimitive.Group>
        </NumberFieldPrimitive.Root>
      </FieldPrimitive.Root>
    )
  }
)
InputNumber.displayName = "InputNumber"

export { InputNumber }
export type { InputNumberVariant }

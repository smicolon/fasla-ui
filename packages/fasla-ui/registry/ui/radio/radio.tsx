import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/**
 * The height of one line of label text, in whichever script is rendering.
 *
 * The type ramp publishes `--leading-sm` as a *unitless ratio* (`calc(20 / 14)`),
 * not a length, so the line box is ratio × font-size. Writing it this way makes
 * the control direction-aware for free: under `[dir="rtl"]` the ramp re-points
 * `--leading-sm` at Cairo's 24px leading and the control re-centres itself with
 * no RTL-specific class.
 *
 * The label deliberately has no fixed height. Figma pins its label boxes to
 * 16/20/24px, which is a defect there — at `sm` a 16px box holds 20px English
 * and 24px Arabic text — and it must not be mirrored here. The ramp sets the
 * leading; nothing else does.
 */
const LINE_BOX = "h-[calc(var(--leading-sm)*0.875rem)]"

const radioVariants = cva(
  "group relative inline-flex cursor-pointer items-start gap-3 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        // In Layout the whole card is the target, so hover fills it and focus
        // rings it. The card ships with no fill, so hover *adds* one.
        layout:
          "rounded-md border p-2 transition-colors motion-reduce:transition-none hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Control, dot and hover halo per size. The dot is always the control less 8px;
 * the halo is always the control plus 8px.
 */
const sizeClasses = {
  sm: { control: "size-4", dot: "size-2", halo: "size-6" },
  md: { control: "size-5", dot: "size-3", halo: "size-7" },
  lg: { control: "size-6", dot: "size-4", halo: "size-8" },
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Visual treatment. `layout` wraps the control and text in a bordered card.
   * Declared here rather than inherited from `VariantProps`, which widens every
   * variant with `| null` and shows a meaningless third option in Storybook.
   */
  variant?: "default" | "layout"
  /** Label text. Without it (or `description`) pass `aria-label` for an accessible name. */
  label?: string
  /** Secondary line below the label */
  description?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      label,
      description,
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const descriptionId = `${inputId}-description`
    const sizes = sizeClasses[size]

    return (
      <label
        htmlFor={inputId}
        className={cn(radioVariants({ variant }), className)}
      >
        <input
          type="radio"
          ref={ref}
          id={inputId}
          className="peer sr-only"
          aria-describedby={
            description ? cn(descriptionId, ariaDescribedBy) : ariaDescribedBy
          }
          {...props}
        />
        {/*
         * The control sits in a band exactly one line tall and centres itself
         * in it, so it aligns optically with the *first* line of the label
         * rather than drifting to the middle of a wrapped block. At `lg` the
         * 24px control is taller than a 20px English line and overflows the
         * band by 2px a side — deliberate, and well inside the card's 8px
         * padding.
         */}
        {/*
         * Focus rings are real elements, exactly as Figma models them — an
         * ellipse at −2,−2 for Default and a rounded rectangle at −1,−1 for
         * Layout, rather than a property of the control or the card.
         *
         * Each is a *direct sibling of the input*, so a plain
         * `peer-focus-visible:opacity-100` drives it. That matters beyond
         * tidiness: `:has()` and arbitrary-variant selectors both resolve in a
         * browser but are invisible to the pseudo-state renderer the Storybook
         * states grid uses, so the grid would quietly stop matching the
         * component. A simple class on a sibling is the one form that survives.
         */}
        {variant === "layout" && (
          <span
            aria-hidden="true"
            // −2px, not −1px: an absolutely positioned child is offset from the
            // *padding* box, which already sits 1px inside the 1px border. −1
            // would land the ring exactly on the border with no gap at all.
            className="pointer-events-none absolute -inset-[2px] rounded-[calc(var(--radius)-1px)] opacity-0 ring-2 ring-ring peer-focus-visible:opacity-100"
          />
        )}
        {variant === "default" && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute start-0 top-0 flex items-center opacity-0 peer-focus-visible:opacity-100",
              LINE_BOX
            )}
          >
            <span
              className={cn(
                "rounded-full ring-2 ring-ring ring-offset-2",
                sizes.control
              )}
            />
          </span>
        )}
        <span
          aria-hidden="true"
          className={cn("relative flex shrink-0 items-center", LINE_BOX)}
        >
          {/*
           * Hover halo — Default only; in Layout the card fills instead. Kept
           * absolute so it can never affect layout, which is the constraint the
           * Figma set is built on: every Interaction variant has identical
           * frame sizes.
           */}
          {variant === "default" && (
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100",
                sizes.halo
              )}
            />
          )}
          <span
            data-slot="control"
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full border border-input",
              sizes.control
            )}
          >
            <span
              className={cn(
                // `bg-foreground`, not `bg-primary`. Figma's theme/primary for
                // the dot is the strong neutral (#0a0a0a light, white dark) —
                // the same meaning `--foreground` carries in code. The docs app
                // has repurposed `--primary` as the Fasla brand red, so
                // `bg-primary` would render the dot red there and near-black in
                // Storybook. `--foreground` is correct in both apps and in both
                // modes, with no app-level change.
                "scale-0 rounded-full bg-foreground transition-transform motion-reduce:transition-none group-has-[:checked]:scale-100",
                sizes.dot
              )}
            />
          </span>
        </span>
        {(label || description) && (
          <span className="flex min-w-0 flex-col gap-2">
            {label && (
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
            )}
            {description && (
              <span
                id={descriptionId}
                className="text-sm text-muted-foreground"
              >
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    )
  }
)
Radio.displayName = "Radio"

export { Radio, radioVariants }

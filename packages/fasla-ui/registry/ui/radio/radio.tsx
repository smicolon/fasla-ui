import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

const radioVariants = cva(
  "group relative inline-flex cursor-pointer items-start gap-3 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        layout: "rounded-md border p-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** Control, dot and label-line heights per size. The dot is always the control less 8px. */
const sizeClasses = {
  sm: { control: "size-4", dot: "size-2", labelLine: "h-4" },
  md: { control: "size-5", dot: "size-3", labelLine: "h-5" },
  lg: { control: "size-6", dot: "size-4", labelLine: "h-6" },
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
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border border-input transition-colors",
            "group-hover:border-primary/50",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-checked:[&>span]:scale-100",
            sizes.control
          )}
        >
          <span
            className={cn(
              "scale-0 rounded-full bg-primary transition-transform motion-reduce:transition-none",
              sizes.dot
            )}
          />
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-2">
            {label && (
              <span
                className={cn(
                  "flex items-center text-sm font-medium leading-5 text-foreground",
                  sizes.labelLine
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                id={descriptionId}
                className="text-sm leading-5 text-muted-foreground"
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

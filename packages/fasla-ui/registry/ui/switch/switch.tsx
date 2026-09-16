import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Label text */
  label?: string
  /** Description text */
  description?: string
  /** Size variant */
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: {
    track: "h-4 w-7",
    thumb: "h-3 w-3 data-[state=checked]:translate-x-3",
  },
  default: {
    track: "h-5 w-9",
    thumb: "h-4 w-4 data-[state=checked]:translate-x-4",
  },
  lg: {
    track: "h-6 w-11",
    thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
  },
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = "default", id, ...props }, ref) => {
    const inputId = id || React.useId()
    const sizes = sizeClasses[size]

    const switchElement = (
      <label
        htmlFor={inputId}
        className={cn(
          "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-input has-[:checked]:bg-primary",
          sizes.track,
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          id={inputId}
          className="sr-only"
          {...props}
        />
        <span
          data-state={props.checked ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
            sizes.thumb
          )}
        />
      </label>
    )

    if (!label && !description) {
      return switchElement
    }

    return (
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-1">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {switchElement}
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

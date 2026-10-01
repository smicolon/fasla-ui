import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label text */
  label?: string
  /** Description text */
  description?: string
  /** Error state */
  error?: boolean
  /** Indeterminate state */
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, id, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    const inputId = id || React.useId()

    const checkbox = (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={inputRef}
          id={inputId}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            error
              ? "border-destructive peer-checked:border-destructive peer-checked:bg-destructive"
              : "border-input",
            className
          )}
        >
          <CheckIcon
            size={12}
            strokeWidth={1.5}
            className={cn(
              "opacity-0 peer-checked:opacity-100",
              indeterminate ? "hidden" : "block"
            )}
          />
          {indeterminate && (
            <MinusIcon size={12} strokeWidth={1.5} />
          )}
        </div>
      </div>
    )

    if (!label && !description) {
      return checkbox
    }

    return (
      <div className="flex items-start gap-3">
        {checkbox}
        <div className="grid gap-1 leading-none">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-destructive"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

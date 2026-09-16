import * as React from "react"
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "opacity-0 peer-checked:opacity-100",
              indeterminate ? "hidden" : "block"
            )}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {indeterminate && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
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

"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Options to display */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
  /** Size variant */
  selectSize?: "sm" | "default" | "lg"
  /** Error state */
  error?: boolean
}

const sizeClasses = {
  sm: "h-8 px-2 py-1 text-xs",
  default: "h-9 px-3 py-2 text-sm",
  lg: "h-11 px-4 py-2 text-base",
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder,
      selectSize = "default",
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-md border bg-transparent transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input",
            sizeClasses[selectSize],
            "pr-10",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }

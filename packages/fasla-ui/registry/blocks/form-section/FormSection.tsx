import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title: string
  /** Section description */
  description?: string
  /** Form fields content */
  children: React.ReactNode
  /** Whether to show a divider at the bottom */
  divider?: boolean
}

/**
 * Form section for grouping related form fields.
 * Provides consistent spacing and typography for form organization.
 */
export function FormSection({
  title,
  description,
  children,
  divider = true,
  className,
  ...props
}: FormSectionProps) {
  return (
    <div
      className={cn(
        "grid gap-6 pb-6",
        divider && "border-b",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h3 className="text-base font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  )
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label: string
  /** Field description/help text */
  description?: string
  /** Error message */
  error?: string
  /** Whether the field is required */
  required?: boolean
  /** The form input element */
  children: React.ReactNode
  /** HTML for attribute to connect label with input */
  htmlFor?: string
}

/**
 * Form field wrapper with label, description, and error handling.
 */
export function FormField({
  label,
  description,
  error,
  required,
  children,
  htmlFor,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Action buttons */
  children: React.ReactNode
  /** Alignment of actions */
  align?: "left" | "right" | "center" | "between"
  /** Whether to make it sticky at the bottom */
  sticky?: boolean
}

const alignClasses = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
  between: "justify-between",
}

/**
 * Form actions bar for submit/cancel buttons.
 * Can be sticky at the bottom of the form.
 */
export function FormActions({
  children,
  align = "right",
  sticky = false,
  className,
  ...props
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-6",
        alignClasses[align],
        sticky && "sticky bottom-0 border-t bg-background py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

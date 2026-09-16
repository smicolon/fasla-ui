import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

const textareaVariants = cva(
  "flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input shadow-sm",
        error: "border-destructive focus-visible:ring-destructive",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      resize: "vertical",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Show character count */
  showCount?: boolean
  /** Maximum character count */
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, resize, showCount, maxLength, ...props }, ref) => {
    const [count, setCount] = React.useState(
      (props.defaultValue as string)?.length || 0
    )

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length)
      props.onChange?.(e)
    }

    const textarea = (
      <textarea
        className={cn(textareaVariants({ variant, resize }), className)}
        ref={ref}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
    )

    if (!showCount) {
      return textarea
    }

    return (
      <div className="relative">
        {textarea}
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {maxLength ? `${count}/${maxLength}` : count}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }

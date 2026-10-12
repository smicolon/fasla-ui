import * as React from "react"
import { cva } from "class-variance-authority"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/**
 * The height of one line of label text, in whichever script is rendering —
 * 20px for Geist, 24px for Cairo. The ramp publishes `--leading-sm` as a
 * unitless ratio and re-points it under `[dir="rtl"]`, so nothing here is
 * direction-specific. The fallback, English's 20 / 14, is for a project that
 * does not load the Fasla preset. Same derivation as Radio's LINE_BOX.
 */
const LINE_BOX = "h-[calc(var(--leading-sm,calc(20/14))*0.875rem)]"

/**
 * Half of what a 24px box overhangs one label line: 2px in English, 0 in
 * Arabic, whose line is already 24px. At `lg` it drops the text column by that
 * much, so the first line stays centred on the box once the row grows to the
 * box's height.
 */
const LG_TEXT_OFFSET =
  "pt-[max(0px,calc((1.5rem_-_var(--leading-sm,calc(20/14))*0.875rem)/2))]"

/*
 * `indeterminate` has no HTML attribute, so server-rendered HTML cannot carry
 * it. The component renders `data-indeterminate` instead and removes it once
 * the DOM property is set. A layout effect, so the swap lands before paint.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * Root layout. Figma's two Types:
 *  - `default`: box, then label, no frame.
 *  - `layout`: the same row inside a bordered card — 1px `border`, 8px
 *    padding, 6px radius (`rounded-md`). The whole card is the target, so
 *    hover fills it, as Radio's Layout card does.
 *
 * `group/checkbox` is a *named* group so the `:has()` lookups below can never
 * be answered by an unrelated input in some outer `.group`.
 *
 * Disabled dims the whole component, like Radio and Switch. Figma dims the box
 * and label but not the description or the card border; with the description
 * already muted the difference is slight, and one disabled treatment across
 * the selection controls is worth more.
 */
const checkboxVariants = cva(
  "group/checkbox relative inline-flex cursor-pointer items-start gap-3 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "",
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
 * Box, glyph and hover halo per size, straight from the Figma set. The glyph is
 * always the box less 4px; the halo is always the box plus 8px. Figma draws
 * lucide's `check` and `minus` with a 1px stroke at 16px — 1.5 on lucide's
 * 24-unit grid — and scales it, so the stroke is the same 1.5 at every size.
 *
 * `row` and `text` matter at `lg` only: the 24px box is taller than a 20px
 * English line, so the row grows to the box (Figma's 24px row, and 8px from
 * box to border in the Layout card) and the text drops to stay centred.
 */
const sizeClasses = {
  sm: { box: "size-4", glyph: "size-3", halo: "size-6", row: "", text: "" },
  md: { box: "size-5", glyph: "size-4", halo: "size-7", row: "", text: "" },
  lg: { box: "size-6", glyph: "size-5", halo: "size-8", row: "min-h-6", text: LG_TEXT_OFFSET },
}

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Visual treatment. `layout` wraps the box and text in a bordered card.
   * Declared here rather than inherited from `VariantProps`, which widens every
   * variant with `| null` and shows a meaningless third option in Storybook.
   */
  variant?: "default" | "layout"
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Label text. Without it (or `description`) pass `aria-label` for an accessible name. */
  label?: string
  /** Secondary line below the label */
  description?: string
  /**
   * Shows the "some, not all" dash — for a parent of a partly selected list.
   * Sets the input's `indeterminate` property, so assistive technology hears
   * "mixed". A click clears it, as the browser does natively; keep the prop in
   * step from your own state.
   */
  indeterminate?: boolean
}

/**
 * A native checkbox with an optional label and description, in Figma's two
 * types (`default`, `layout`) and three sizes. Checked, indeterminate, hover,
 * focus and disabled are CSS states of the real `<input>`, so the box always
 * shows what the browser and assistive technology see.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      label,
      description,
      indeterminate = false,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    /*
     * `indeterminate` is a DOM property with no attribute, so it is set here —
     * on every render, not only when the prop changes. A click clears it in the
     * DOM; if the parent re-renders with the prop still true, a deps-guarded
     * effect would never run again and the box would stay ticked.
     */
    useIsomorphicLayoutEffect(() => {
      const input = inputRef.current
      if (!input) return
      input.indeterminate = indeterminate
      input.removeAttribute("data-indeterminate")
    })

    // Called on every render, so the hook order holds when id comes and goes
    const generatedId = React.useId()
    const inputId = id || generatedId
    const labelId = `${inputId}-label`
    const descriptionId = `${inputId}-description`

    /*
     * The wrapping <label> would name the checkbox with *all* its text, label
     * and description together, while `aria-describedby` reads the description
     * again. So the name points at the label alone, unless the caller named
     * the checkbox themselves; and the description is linked only when the
     * name comes from somewhere else. Same rule as Switch.
     */
    const labelledBy = ariaLabelledBy ?? (label && !ariaLabel ? labelId : undefined)
    const isNamedElsewhere = Boolean(label || ariaLabel || ariaLabelledBy)
    // Plain join: these are ids, and `cn` would merge them as classes.
    const describedBy =
      [description && isNamedElsewhere ? descriptionId : undefined, ariaDescribedBy]
        .filter(Boolean)
        .join(" ") || undefined

    // Fall back to the defaults for an untyped caller passing null or a typo.
    const sizes = sizeClasses[size] ?? sizeClasses.md
    const isLayout = variant === "layout"

    return (
      <label
        htmlFor={inputId}
        className={cn(checkboxVariants({ variant: isLayout ? "layout" : "default" }), className)}
      >
        <input
          type="checkbox"
          ref={inputRef}
          id={inputId}
          className="peer sr-only"
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          data-indeterminate={indeterminate ? "" : undefined}
          {...props}
        />
        {/*
         * Focus rings are real elements and *direct siblings of the input*, so
         * a plain `peer-focus-visible:opacity-100` drives them — the one form
         * the pseudo-states addon behind the Storybook states grid can force.
         * Layout rings the card; Default rings the box with a 2px gap. Figma
         * has no focus variant; this matches Radio's.
         */}
        {isLayout ? (
          <span
            aria-hidden="true"
            // −2px, not −1px: an absolute child is offset from the padding
            // box, which sits 1px inside the border.
            className="pointer-events-none absolute -inset-[2px] rounded-[calc(var(--radius)-1px)] opacity-0 ring-2 ring-ring peer-focus-visible:opacity-100"
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute start-0 top-0 flex items-center opacity-0 peer-focus-visible:opacity-100",
              LINE_BOX,
              sizes.row
            )}
          >
            {/* The 2px gap takes the page colour; Tailwind's default offset is white, which shows in Dark. */}
            <span
              className={cn(
                "rounded ring-2 ring-ring ring-offset-2 ring-offset-background",
                sizes.box
              )}
            />
          </span>
        )}
        {/*
         * The box sits in a band one label line tall and centres itself in it,
         * so it lines up with the *first* line of a wrapped label. At `lg` the
         * band grows to the 24px box instead of letting it overhang a 20px
         * English line, and the text column drops to match.
         */}
        <span
          aria-hidden="true"
          className={cn("relative flex shrink-0 items-center", LINE_BOX, sizes.row)}
        >
          {/*
           * Hover halo — Default only; in Layout the card fills instead. The
           * band is exactly as wide as the box, so `-start-1` centres the halo
           * in both directions. Absolute, so it never moves anything: every
           * Figma Interaction variant has the same frame size.
           */}
          {!isLayout && (
            <span
              data-slot="halo"
              className={cn(
                "pointer-events-none absolute -start-1 top-1/2 -translate-y-1/2 rounded-[0.5rem] bg-accent opacity-0 transition-opacity motion-reduce:transition-none group-hover/checkbox:opacity-100",
                sizes.halo
              )}
            />
          )}
          <span
            data-slot="control"
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded border border-input text-primary-foreground transition-colors motion-reduce:transition-none",
              "group-has-[:checked]/checkbox:border-primary group-has-[:checked]/checkbox:bg-primary",
              "group-has-[:indeterminate]/checkbox:border-primary group-has-[:indeterminate]/checkbox:bg-primary",
              "group-has-[[data-indeterminate]]/checkbox:border-primary group-has-[[data-indeterminate]]/checkbox:bg-primary",
              sizes.box
            )}
          >
            {/* Neither glyph mirrors in RTL: a tick and a dash have no direction. */}
            <CheckIcon
              data-slot="check"
              strokeWidth={1.5}
              className={cn(
                "absolute opacity-0 group-has-[:checked:not(:indeterminate):not([data-indeterminate])]/checkbox:opacity-100",
                sizes.glyph
              )}
            />
            <MinusIcon
              data-slot="minus"
              strokeWidth={1.5}
              className={cn(
                "absolute opacity-0 group-has-[:indeterminate]/checkbox:opacity-100 group-has-[[data-indeterminate]]/checkbox:opacity-100",
                sizes.glyph
              )}
            />
          </span>
        </span>
        {(label || description) && (
          <span className={cn("flex min-w-0 flex-col gap-2", sizes.text)}>
            {label && (
              <span id={labelId} className="text-sm font-medium text-foreground">
                {label}
              </span>
            )}
            {description && (
              <span id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/**
 * Root layout. Figma's two Types:
 *  - `control-first` (the default): track, then label. The description sits
 *    under the label, so it is indented by the track width plus the 8px gap,
 *    exactly as Figma's 40/48/56px indent.
 *  - `label-first`: label at the start, track pushed to the end — a settings
 *    row. It fills its container; the description stays under the label.
 *
 * `group/switch` is a *named* group so the `:has(:checked)` lookups below can
 * never be answered by an unrelated checkbox in some outer `.group`.
 *
 * Disabled dims the whole component, label and description included — Figma
 * puts 50% opacity on the variant root, not on the track.
 */
const switchVariants = cva(
  "group/switch cursor-pointer items-start gap-2 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
  {
    variants: {
      layout: {
        "control-first": "inline-flex",
        "label-first": "flex justify-between",
      },
    },
    defaultVariants: {
      layout: "control-first",
    },
  }
)

/**
 * Geometry per size, straight from the Figma set: track, thumb, and where the
 * thumb sits when on. The thumb is always inset 1px, so "on" is the track width
 * less the thumb less 1px.
 *
 * `--sw-h` is the track height. With `--sw-line` (one line of label text, see
 * `LINE` below) it sizes the band the track is centred in, and the label's
 * padding. Every class is written out literally so Tailwind can find it.
 */
const sizeClasses = {
  sm: {
    root: "[--sw-h:18px]",
    track: "h-[18px] w-8",
    thumb: "size-4 group-has-[:checked]/switch:start-[15px]",
  },
  md: {
    root: "[--sw-h:20px]",
    track: "h-5 w-10",
    thumb: "size-[18px] group-has-[:checked]/switch:start-[21px]",
  },
  lg: {
    root: "[--sw-h:24px]",
    track: "h-6 w-12",
    thumb: "size-[22px] group-has-[:checked]/switch:start-[25px]",
  },
}

/**
 * Colours per Figma Style. All `☾ Mode` tokens, so Dark follows on its own.
 *
 *  - solid: track `input` → `primary`, thumb `primary-foreground`, and Figma's
 *    `shadow/default/xs` on the *track* (Tailwind's `shadow-sm` is the same
 *    0 1 2 0 black/5%). Disabled keeps the same thumb; only the opacity changes.
 *  - outline: track `background` with a 1px stroke *outside* it, `input` →
 *    `primary`; the thumb takes the stroke colour. A CSS outline is the exact
 *    model of a Figma OUTSIDE stroke: painted, but not part of the box, so the
 *    track keeps Figma's size and the thumb its 1px inset.
 *
 * `focus` is the focus-ring element (see below). Figma draws focus as a 1px
 * stroke in `ring` — inside the track for solid, replacing the outside stroke
 * for outline, where an *on* outline keeps its `primary` stroke — plus a 3px
 * halo. Figma's halo colour is a raw #a1a1aa at 50%; this uses the `ring`
 * token at 50%, which is the same grey in Light and follows the mode in Dark.
 */
const variantClasses = {
  solid: {
    track: "bg-input shadow-sm group-has-[:checked]/switch:bg-primary",
    thumb: "bg-primary-foreground",
    focus: "border border-ring",
  },
  outline: {
    track:
      "bg-background outline outline-1 outline-input group-has-[:checked]/switch:outline-primary",
    thumb: "bg-input group-has-[:checked]/switch:bg-primary",
    focus: "outline outline-1 outline-ring group-has-[:checked]/switch:outline-primary",
  },
}

/**
 * One line of `text-sm` label, in whichever script is rendering — 20px for
 * Geist, 24px for Cairo. The ramp re-points `--leading-sm` under `[dir="rtl"]`,
 * so nothing here is direction-specific. The fallback is English's 20 / 14,
 * for a project without the Fasla preset. Same derivation as Radio's LINE_BOX.
 */
const LINE = "[--sw-line:calc(var(--leading-sm,calc(20/14))*0.875rem)]"

/** The taller of one label line and the track. */
const BAND_HEIGHT = "h-[max(var(--sw-line),var(--sw-h))]"

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Visual treatment: a filled track, or an outlined one. Declared here rather
   * than inherited from `VariantProps`, which widens every variant with
   * `| null` and shows a meaningless third option in Storybook.
   */
  variant?: "solid" | "outline"
  /** Track before the label, or label first with the track at the end. */
  layout?: "control-first" | "label-first"
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Label text. Without it (or `description`) pass `aria-label` for an accessible name. */
  label?: string
  /** Secondary line below the label */
  description?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      variant = "solid",
      layout = "control-first",
      size = "md",
      label,
      description,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const labelId = `${inputId}-label`
    const descriptionId = `${inputId}-description`
    /*
     * The wrapping <label> would name the switch with *all* its text, label
     * and description together, while `aria-describedby` reads the description
     * again. So the name points at the label alone, unless the caller named
     * the switch themselves; and the description is linked only when the name
     * comes from somewhere else, or it would be the name and the description.
     */
    const labelledBy = ariaLabelledBy ?? (label && !ariaLabel ? labelId : undefined)
    const isNamedElsewhere = Boolean(label || ariaLabel || ariaLabelledBy)
    // Plain join: these are ids, and `cn` would merge "text-sm text-lg" as classes.
    const describedBy =
      [description && isNamedElsewhere ? descriptionId : undefined, ariaDescribedBy]
        .filter(Boolean)
        .join(" ") || undefined
    // Fall back to the defaults for an untyped caller passing null or a typo.
    const sizes = sizeClasses[size] ?? sizeClasses.md
    const colors = variantClasses[variant] ?? variantClasses.solid
    const hasText = Boolean(label || description)

    /*
     * The track sits in a band one label line tall — or the track's height, if
     * that is taller — and centres itself in it. So it aligns with the *first*
     * line of a wrapped label instead of drifting to the middle of the block.
     *
     * The band is a *direct sibling of the input*, so a plain
     * `peer-focus-visible` sets `--sw-focus` on it, and the focus ring inside
     * the track reads that variable as its opacity. That is the one selector
     * form `storybook-addon-pseudo-states` can force — it cannot force
     * `:has(:focus-visible)` — and keeping the ring inside the track means it
     * follows the track wherever padding on the root moves it.
     */
    const band = (
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center peer-focus-visible:[--sw-focus:1]",
          BAND_HEIGHT
        )}
      >
        <span
          data-slot="track"
          className={cn(
            "relative block rounded-full transition-colors motion-reduce:transition-none",
            sizes.track,
            colors.track
          )}
        >
          {/*
           * Positioned with `inset-inline-start`, a logical property, so the
           * thumb travels towards the end of the line in either direction with
           * no RTL-specific class: `start-px` is left in LTR and right in RTL.
           */}
          <span
            data-slot="thumb"
            className={cn(
              "absolute start-px top-px block rounded-full transition-[inset-inline-start,background-color] motion-reduce:transition-none",
              sizes.thumb,
              colors.thumb
            )}
          />
          {/*
           * Laid exactly over the track. Figma draws focus as a 1px `ring`
           * stroke (inside for solid, replacing the outside stroke for
           * outline) plus a 3px halo; painted after the thumb, it never
           * overlaps it, because the thumb is inset by that same 1px.
           */}
          <span
            data-slot="focus-ring"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full opacity-[var(--sw-focus,0)] ring-[3px] ring-ring/50",
              colors.focus
            )}
          />
        </span>
      </span>
    )

    const text = hasText && (
      <span
        className={cn(
          "flex min-w-0 flex-col gap-0.5",
          layout === "label-first" && "flex-1"
        )}
      >
        {label && (
          // Padded so a single line centres on a track taller than the line
          // (lg in English: 24px track, 20px line). The padding is zero
          // whenever the line is the taller of the two.
          <span
            id={labelId}
            className="py-[max(0px,calc((var(--sw-h)-var(--sw-line))/2))] text-sm font-medium text-foreground"
          >
            {label}
          </span>
        )}
        {description && (
          <span
            id={descriptionId}
            className="text-xs font-light text-muted-foreground"
          >
            {description}
          </span>
        )}
      </span>
    )

    return (
      <label
        htmlFor={inputId}
        className={cn(
          switchVariants({ layout }),
          LINE,
          sizes.root,
          className
        )}
      >
        <input
          type="checkbox"
          role="switch"
          ref={ref}
          id={inputId}
          className="peer sr-only"
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          {...props}
        />
        {layout === "label-first" ? (
          <>
            {text}
            {band}
          </>
        ) : (
          <>
            {band}
            {text}
          </>
        )}
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch, switchVariants }

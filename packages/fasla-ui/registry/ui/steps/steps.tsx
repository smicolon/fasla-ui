import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Steps / Step item` (405:7832), 48 variants, assembled into
 * `Steps Horizontal` (3793:70328) and `Steps Vertical` (3793:70403).
 *
 * Display only: the steps show where the reader is in a flow, and none of
 * them is a link or a button, so there is no hover or focus state (Figma has
 * none). `Steps` is the ordered list and `StepsItem` one step in it.
 *
 * Figma axis → code:
 *  - `Orientation` (Horizontal / Vertical) → `orientation` on `Steps`.
 *  - `Radius` (Standard / Rounded) → `radius` on `Steps`, so a stepper never
 *    mixes the two (Figma's doc: "Don't mix Standard and Rounded").
 *  - `Status` (Done / Current / Upcoming) → `status` on each `StepsItem`.
 *    Current also sets `aria-current="step"`.
 *  - `Has tail` → never a prop. Every step but the last draws a tail.
 *  - `Step Number` / `Step Number Text` → the step's position, counted for you.
 *  - `Step Icon` → `icon`: Figma's `check` in place of the number.
 *  - `Sub Text` → `description`.
 *  - `Direction` → the page's `dir`, never a prop. The rows are in DOM
 *    order, so `dir="rtl"` mirrors them, as Figma's RTL variants do.
 *
 * One layout change from Figma, on purpose: Figma's vertical Step item is
 * 38px wide and lets its label overflow the box, so the tail can sit under the
 * bullet. Here the label is laid out properly in its own column beside the
 * bullet, and the tail stays centred under it.
 *
 * Layers, named as in Figma (`data-slot`): `step-details`, `step-icon`,
 * `step-text`, `step-label`, `step-description` and `step-tail`, inside a
 * `steps-item`, inside `steps`.
 */

type StepsOrientation = "horizontal" | "vertical"
type StepsRadius = "standard" | "rounded"
type StepStatus = "done" | "current" | "upcoming"

const StepsContext = React.createContext<{ orientation: StepsOrientation; radius: StepsRadius }>({
  orientation: "horizontal",
  radius: "standard",
})

/** Where a step sits in its list, set by `Steps` for each child. */
const StepsItemContext = React.createContext<{ index: number; count: number }>({ index: 0, count: 1 })

/** A screen-reader string in the page's language, picked by CSS from the nearest `lang`. */
const Localised = ({ en, ar }: { en: string; ar: string }) => (
  <>
    <span className="[&:lang(ar)]:hidden">{en}</span>
    <span className="hidden [&:lang(ar)]:inline">{ar}</span>
  </>
)

/** What a screen reader hears after the label. Current says nothing: `aria-current` speaks for it. */
const STATUS_TEXT = {
  done: { en: ", completed", ar: "، مكتملة" },
  current: null,
  upcoming: { en: ", not started", ar: "، لم تبدأ" },
} as const

/**
 * The list. Horizontal, the steps share the row and each tail stretches to
 * the next step, the last step as wide as its bullet (Figma's `Fill` items
 * and `Hug` last item). Vertical, the steps stack, and each tail is at least
 * 46px tall; give the list a height and the tails stretch to fill it, as in
 * Figma's 500px Steps Vertical.
 *
 * Horizontal, the list is a size container (`container-type: inline-size`),
 * so each label can be held to its share of the row (see `stepTextVariants`).
 * It fills its container's width and takes none from its content, so give it
 * a block to sit in, as Figma's 700px Steps Horizontal does.
 */
const stepsVariants = cva("m-0 flex list-none p-0", {
  variants: {
    orientation: {
      horizontal: "w-full items-start [container-type:inline-size]",
      vertical: "flex-col",
    },
  },
  defaultVariants: { orientation: "horizontal" },
})

/**
 * The bullet: 38px, Figma's `step-icon`, with the number in `Tailwind
 * En/LG/Medium` (18px; the type ramp gives it a 28px line in English and 32px
 * in Arabic).
 *
 * Colours, all bound in Figma:
 *  - Done: a `primary` fill, the number or check in `primary-foreground`, and
 *    Figma's `shadow/sm`, which is Tailwind 3's `shadow`.
 *  - Current: a 1px `primary` border, the number in `primary`.
 *  - Upcoming: a 1px `border` border, the number in `card-foreground`.
 * Current also carries a `shadow ring` effect in Figma, which Figma does not
 * draw (a spread on a frame with no fill); it is left out, as rendered.
 *
 * Radius: Standard is Figma's 8px `rounded-field`, read through the preset's
 * `--radius-md`; Rounded is `border radius/rounded`, a circle.
 *
 * In forced colors (Windows high contrast) the fills would be dropped and
 * Done would look like Upcoming, so each status keeps its look in system
 * colours: Done filled, Current outlined, Upcoming outlined in grey.
 */
const stepIconVariants = cva(
  [
    "inline-flex size-[38px] shrink-0 items-center justify-center border text-lg font-medium",
    "forced-colors:[forced-color-adjust:none]",
  ],
  {
    variants: {
      status: {
        done: [
          "border-transparent bg-primary text-primary-foreground shadow",
          "forced-colors:border-[CanvasText] forced-colors:bg-[CanvasText] forced-colors:text-[Canvas]",
        ],
        current: [
          "border-primary text-primary",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
        ],
        upcoming: [
          "border-border text-card-foreground",
          "forced-colors:border-[GrayText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
        ],
      },
      radius: {
        standard: "rounded-[var(--radius-md)]",
        rounded: "rounded-full",
      },
    },
    defaultVariants: { status: "upcoming", radius: "standard" },
  }
)

/**
 * The tail: Figma's `Divider`, a 2px line with 8px (`spacing/2`) of room at
 * each end, which fills the space to the next step. It follows its own step's
 * status: `primary` after a done step, `border` after the current one and the
 * upcoming ones. The line sits on the bullet's centre: across the row when
 * horizontal, down the bullet's column when vertical.
 */
const stepTailVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "h-[38px] min-w-0 flex-1 items-center px-2",
      vertical: "min-h-[46px] w-full flex-1 justify-center py-2",
    },
  },
  defaultVariants: { orientation: "horizontal" },
})

/**
 * The text under a horizontal bullet: the label, then 2px, then the
 * description, centred on the bullet. It is as wide as its text, so a label
 * wider than the bullet reaches out on both sides, as in Figma, but never
 * wider than its share of the row, so two labels always keep 16px between
 * them (the two 8px ends of the tail between their bullets), and a longer
 * label wraps. A single word longer than that breaks rather than run into
 * the next label. `shrink-0` keeps the text at that width: a flex item would
 * otherwise shrink to the 38px column and wrap at every word.
 *
 * The share comes from the bullets' pitch: the row less the last 38px bullet,
 * over the number of tails (`--steps-tails`, set by `Steps`), read in `cqi`,
 * the list's width. A step between two others may reach half a pitch less
 * 8px each way. The first and last steps sit at the row's ends, so their text
 * starts at the start (or ends at the end) once it is wider than the bullet,
 * and may reach half a pitch plus 11px into the row, which keeps the same
 * 16px from the next label's room.
 */
const stepTextVariants = cva("mx-auto flex w-max shrink-0 flex-col items-center gap-0.5 break-words text-center", {
  variants: {
    // Written out in full, not built from a shared string: Tailwind only
    // generates classes it can read whole in the source.
    position: {
      first: "max-w-[calc((100cqi_-_38px)_/_var(--steps-tails,1)_/_2_+_11px)]",
      middle: "max-w-[calc((100cqi_-_38px)_/_var(--steps-tails,1)_-_16px)]",
      last: "max-w-[calc((100cqi_-_38px)_/_var(--steps-tails,1)_/_2_+_11px)]",
    },
  },
  defaultVariants: { position: "middle" },
})

const stepTailLineVariants = cva("block", {
  variants: {
    orientation: {
      horizontal: "h-0.5 w-full",
      vertical: "h-full w-0.5",
    },
    status: {
      done: "bg-primary forced-colors:bg-[CanvasText]",
      current: "bg-border forced-colors:bg-[GrayText]",
      upcoming: "bg-border forced-colors:bg-[GrayText]",
    },
  },
  defaultVariants: { orientation: "horizontal", status: "upcoming" },
})

export interface StepsProps extends React.ComponentPropsWithoutRef<"ol"> {
  /** Figma `Orientation`: steps in a row with the labels below, or a column with the labels beside. */
  orientation?: StepsOrientation
  /** Figma `Radius`: an 8px square bullet, or a circle. Every step takes it. */
  radius?: StepsRadius
}

/**
 * The stepper: an ordered list of `StepsItem`s, so screen readers say how
 * many steps there are and which one each is. Numbers each step, and leaves
 * the tail off the last.
 */
const Steps = React.forwardRef<HTMLOListElement, StepsProps>(
  ({ orientation = "horizontal", radius = "standard", className, style, children, ...props }, ref) => {
    const look = React.useMemo(() => ({ orientation, radius }), [orientation, radius])
    const items = React.Children.toArray(children).filter(React.isValidElement)
    return (
      <StepsContext.Provider value={look}>
        <ol
          ref={ref}
          data-slot="steps"
          data-orientation={orientation}
          data-radius={radius}
          className={cn(stepsVariants({ orientation }), className)}
          style={{ "--steps-tails": Math.max(items.length - 1, 1), ...style } as React.CSSProperties}
          {...props}
        >
          {items.map((child, index) => (
            <StepsItemContext.Provider key={child.key ?? index} value={{ index, count: items.length }}>
              {child}
            </StepsItemContext.Provider>
          ))}
        </ol>
      </StepsContext.Provider>
    )
  }
)
Steps.displayName = "Steps"

export interface StepsItemProps extends Omit<React.ComponentPropsWithoutRef<"li">, "children"> {
  /** Figma `Status`. `current` also marks the step with `aria-current="step"`. */
  status?: StepStatus
  /** The step's name: Figma's Step Label. */
  label: React.ReactNode
  /** A line under the label: Figma's `Sub Text`. */
  description?: React.ReactNode
  /** Figma `Step Icon`: a check in the bullet instead of the number. Meant for done steps. */
  icon?: boolean
  /**
   * What screen readers hear after the label, since colour alone can't carry
   * the status. Defaults to the page's language: ", completed" / "، مكتملة"
   * for done, ", not started" / "، لم تبدأ" for upcoming, and nothing for the
   * current step, which `aria-current` announces. Pass `""` to silence it.
   */
  statusLabel?: string
}

/**
 * One step. Horizontal, the label and description are centred under the
 * bullet, and wrap within the step's share of the row; the first and last
 * steps keep a long label inside the list, against its start and end.
 * Vertical, they sit beside the bullet, the label's first line on the
 * bullet's centre, and wrap.
 */
const StepsItem = React.forwardRef<HTMLLIElement, StepsItemProps>(
  ({ status = "upcoming", label, description, icon = false, statusLabel, className, ...props }, ref) => {
    const { orientation, radius } = React.useContext(StepsContext)
    const { index, count } = React.useContext(StepsItemContext)
    const first = index === 0
    const last = index === count - 1
    const horizontal = orientation === "horizontal"
    const statusText = STATUS_TEXT[status]

    const bullet = (
      // Decorative: the list already numbers the steps for screen readers,
      // and the status is read after the label.
      <span aria-hidden="true" data-slot="step-icon" className={stepIconVariants({ status, radius })}>
        {icon ? <CheckIcon strokeWidth={1.5} className="size-[22px]" /> : index + 1}
      </span>
    )

    const tail = last ? null : (
      <span aria-hidden="true" data-slot="step-tail" className={stepTailVariants({ orientation })}>
        <span className={stepTailLineVariants({ orientation, status })} />
      </span>
    )

    const text = (
      <>
        <span data-slot="step-label" className="text-base text-card-foreground">
          {label}
          {statusLabel === "" ? null : statusLabel ? (
            <span className="sr-only">{statusLabel}</span>
          ) : statusText ? (
            <span className="sr-only">
              <Localised en={statusText.en} ar={statusText.ar} />
            </span>
          ) : null}
        </span>
        {description != null && description !== false && (
          <span data-slot="step-description" className="text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </>
    )

    return (
      <li
        ref={ref}
        aria-current={status === "current" ? "step" : undefined}
        data-slot="steps-item"
        data-status={status}
        className={cn(
          // `relative` keeps the absolutely placed screen-reader text inside
          // the step, so it never widens a scrolling page.
          "relative flex min-w-0",
          last ? "flex-none" : "flex-1",
          horizontal ? "items-start" : "gap-2.5",
          className
        )}
        {...props}
      >
        {horizontal ? (
          <>
            {/* Figma's `step-details`: the bullet, then 10px (`spacing/2,5`), then the text. */}
            <span data-slot="step-details" className="flex w-[38px] shrink-0 flex-col items-center gap-2.5">
              {bullet}
              {/*
               * The auto margins centre the text on the bullet while it fits;
               * once it is wider, they drop to zero and the row's
               * justification takes over: the first step's text starts at the
               * list's start and the last step's ends at its end, so neither
               * leaves the list.
               */}
              <span
                className={cn(
                  "flex w-full",
                  first ? "justify-start" : last ? "justify-end" : "justify-center"
                )}
              >
                <span
                  data-slot="step-text"
                  className={stepTextVariants({ position: first ? "first" : last ? "last" : "middle" })}
                >
                  {text}
                </span>
              </span>
            </span>
            {tail}
          </>
        ) : (
          <>
            <span data-slot="step-details" className="flex w-[38px] shrink-0 flex-col items-center">
              {bullet}
              {tail}
            </span>
            {/*
             * The label's first line is centred on the 38px bullet: the top
             * padding is half of what the line leaves free (7px in English,
             * 5px for Arabic's taller line). Steps with a tail keep 8px below
             * the text, so a long description never meets the next step.
             */}
            <span
              data-slot="step-text"
              className={cn(
                "flex min-w-0 flex-col gap-0.5 pt-[calc((38px-1lh)/2)] text-start text-base",
                !last && "pb-2"
              )}
            >
              {text}
            </span>
          </>
        )}
      </li>
    )
  }
)
StepsItem.displayName = "StepsItem"

export {
  Steps,
  StepsItem,
  stepsVariants,
  stepIconVariants,
  stepTailVariants,
  stepTailLineVariants,
  stepTextVariants,
  type StepsOrientation,
  type StepsRadius,
  type StepStatus,
}

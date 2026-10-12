"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"
import { Avatar, type AvatarProps } from "../avatar/avatar"

/*
 * Figma: "Tooltip" (15139:15897), 120 variants.
 *
 * Built on Base UI's Tooltip, which owns the behaviour: opening on hover and
 * on keyboard focus, closing on Escape, blur and pointer leave, placement
 * against the trigger, flipping away from the viewport edge, and keeping the
 * arrow on the trigger. This file owns the look.
 *
 * Figma axis → code:
 *  - `Style` (Primary / Secondary / Info / Success / Warning / destructive)
 *    → `variant` on `TooltipContent`.
 *  - `Radius` (Standard / Rounded) → `radius`.
 *  - `Position` (Top / Bottom / Left / Right) → `side`, the side of the
 *    trigger the tooltip sits on. `left` and `right` are physical, as in
 *    Figma's RTL variants; `inline-start` and `inline-end` follow the reading
 *    direction. Figma's `None` is `arrow={false}`.
 *  - `Direction` → the trigger's `dir`, never a prop.
 *  - `Description` + `Sub Text` → `description`.
 *  - `icon` → `icon`, a 16px glyph; `Avatar` → `avatar`, our Avatar at 12,
 *    round, centred in a 16px slot so it lines up with an icon.
 *
 * Base UI gives the popup no ARIA role and the trigger no description, on
 * purpose: a tooltip is a visual hint, so the trigger needs its own
 * accessible name (visible text or `aria-label`).
 */

type TooltipVariant = "primary" | "secondary" | "info" | "success" | "warning" | "destructive"
type TooltipRadius = "standard" | "rounded"
type TooltipSide = "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * Where the trigger sits: its direction, language and font. The popup is
 * portalled to `<body>`, out of the trigger's subtree, so it inherits none of
 * them; the content re-applies them so an Arabic page gets a right-to-left,
 * Cairo tooltip. Base UI only learns the direction from its
 * DirectionProvider, which `inline-start` and `inline-end` resolve against.
 */
type TriggerContext = {
  direction: "ltr" | "rtl"
  lang?: string
  fontFamily?: string
}

const TooltipContext = React.createContext<{
  context: TriggerContext
  read: (node: HTMLElement | null) => void
}>({ context: { direction: "ltr" }, read: () => {} })

function readContext(node: HTMLElement): TriggerContext {
  const attribute = node.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
  const style = getComputedStyle(node)
  const isRtl = attribute === "rtl" || (attribute !== "ltr" && style.direction === "rtl")
  return {
    direction: isRtl ? "rtl" : "ltr",
    lang: node.closest("[lang]")?.getAttribute("lang") || undefined,
    fontFamily: style.fontFamily || undefined,
  }
}

export interface TooltipProviderProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider> {}

/**
 * Shares one delay across a group of tooltips, so moving from one trigger to
 * the next opens the next at once. Every `Tooltip` already has one; wrap a
 * toolbar in your own only to change the delays.
 */
function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />
}

export interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {}

/** One tooltip: a `TooltipTrigger` and a `TooltipContent`. Opens with no delay. */
function Tooltip(props: TooltipProps) {
  const [context, setContext] = React.useState<TriggerContext>({ direction: "ltr" })
  const read = React.useCallback((node: HTMLElement | null) => {
    if (!node) return
    const next = readContext(node)
    setContext((prev) =>
      prev.direction === next.direction &&
      prev.lang === next.lang &&
      prev.fontFamily === next.fontFamily
        ? prev
        : next
    )
  }, [])
  const value = React.useMemo(() => ({ context, read }), [context, read])

  return (
    <TooltipContext.Provider value={value}>
      <DirectionProvider direction={context.direction}>
        <TooltipProvider>
          <TooltipPrimitive.Root {...props} />
        </TooltipProvider>
      </DirectionProvider>
    </TooltipContext.Provider>
  )
}
Tooltip.displayName = "Tooltip"

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> {}

/**
 * What the tooltip describes. Renders a `<button>`; pass `render` to use your
 * own element, such as a Button or a link.
 *
 * Reads the trigger's direction on mount and again as the pointer or focus
 * arrives — which always comes before the tooltip opens — so a `dir` that
 * changes later (a locale switch, Storybook's toolbar) is picked up too.
 */
const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ onPointerEnter, onFocus, ...props }, ref) => {
    const { read } = React.useContext(TooltipContext)
    const localRef = React.useRef<HTMLButtonElement | null>(null)
    const mergedRef = React.useMemo(() => mergeRefs(ref, localRef), [ref])
    useIsomorphicLayoutEffect(() => read(localRef.current), [read])

    return (
      <TooltipPrimitive.Trigger
        ref={mergedRef}
        data-slot="tooltip-trigger"
        onPointerEnter={(event) => {
          read(event.currentTarget)
          onPointerEnter?.(event)
        }}
        onFocus={(event) => {
          read(event.currentTarget)
          onFocus?.(event)
        }}
        {...props}
      />
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

/**
 * The bubble, per Figma Style and Radius.
 *
 * Shared: 12px padding inline and 6px block (Figma `spacing/3`, `spacing/1,5`),
 * a 4px gap between avatar, icon and text (`spacing/1`), `XS/Regular` text —
 * which re-leads itself to Cairo's 20px under `dir="rtl"` — and no border or
 * shadow. The cap is on the text, as in Figma: title and description each
 * wrap at 296px, so the bubble is at most 320px wide, 340 with an icon. A
 * word longer than that breaks rather than overflowing.
 *
 * Fades in and out over 150ms on Base UI's starting and ending styles; with
 * reduced motion it appears and disappears at once.
 *
 *  - primary: `foreground` with `background` text — Figma's
 *    `background-inverse` and `foreground-inverse`, by shadcn's names.
 *  - secondary: `secondary` with `secondary-foreground` text.
 *  - info, success, warning, destructive: the status colour with its
 *    `-foreground` text.
 *  - standard: `--radius-md` (Figma `border radius/md`, 8px).
 *  - rounded: Figma `border radius/2xl`, 16px — `rounded-2xl`, which is 16px
 *    in both apps, so it needs no variable of its own. A one-line tooltip
 *    (28px, or 32 in Arabic) still reads as a pill; a full 9999px radius
 *    would clip the icon, avatar and text corners once the text wraps.
 */
const tooltipVariants = cva(
  [
    "flex w-fit items-start gap-1 px-3 py-1.5 text-start text-xs font-normal [overflow-wrap:anywhere]",
    "transition-opacity duration-150 motion-reduce:transition-none",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background",
        secondary: "bg-secondary text-secondary-foreground",
        info: "bg-info text-info-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      radius: {
        standard: "rounded-[var(--radius-md)]",
        rounded: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      radius: "standard",
    },
  }
)

/**
 * Figma's 8×4 triangle, pointing at the trigger. It takes the bubble's own
 * colour (`bg-inherit`), so every style gets a matching arrow, and sits flush
 * against the bubble's edge. Base UI places it along that edge; the side
 * Base UI reports — after any flip away from the viewport edge — decides which
 * edge and which way it points. The logical sides use logical insets and
 * mirror the triangle in RTL.
 *
 * On a Rounded bubble a side arrow overlaps the body by 1px, as in Figma: the
 * curve leaves a hairline gap where a flush arrow would meet it.
 */
const tooltipArrowClasses = cn(
  "pointer-events-none bg-inherit",
  "data-[side=top]:top-full data-[side=top]:h-1 data-[side=top]:w-2 data-[side=top]:[clip-path:polygon(0_0,100%_0,50%_100%)]",
  "data-[side=bottom]:bottom-full data-[side=bottom]:h-1 data-[side=bottom]:w-2 data-[side=bottom]:[clip-path:polygon(50%_0,100%_100%,0_100%)]",
  "data-[side=left]:left-full data-[side=left]:h-2 data-[side=left]:w-1 data-[side=left]:[clip-path:polygon(0_0,100%_50%,0_100%)]",
  "data-[side=right]:right-full data-[side=right]:h-2 data-[side=right]:w-1 data-[side=right]:[clip-path:polygon(100%_0,0_50%,100%_100%)]",
  "data-[side=inline-start]:start-full data-[side=inline-start]:h-2 data-[side=inline-start]:w-1 data-[side=inline-start]:[clip-path:polygon(0_0,100%_50%,0_100%)]",
  "data-[side=inline-end]:end-full data-[side=inline-end]:h-2 data-[side=inline-end]:w-1 data-[side=inline-end]:[clip-path:polygon(100%_0,0_50%,100%_100%)]",
  "rtl:data-[side=inline-start]:-scale-x-100 rtl:data-[side=inline-end]:-scale-x-100"
)
const tooltipArrowRoundedClasses = cn(
  "data-[side=left]:left-[calc(100%-1px)] data-[side=right]:right-[calc(100%-1px)]",
  "data-[side=inline-start]:start-[calc(100%-1px)] data-[side=inline-end]:end-[calc(100%-1px)]"
)

/** The arrow is 4px deep; the tooltip keeps 4px between its tip and the trigger. */
const ARROW_DEPTH = 4
const GAP = 4
const isInlineSide = (side: string) => side !== "top" && side !== "bottom"

/**
 * Bubble-to-trigger distance that leaves 4px between the arrow's tip and the
 * trigger — 1px less where a Rounded bubble's side arrow overlaps the body.
 * Base UI passes the side it actually lands on, so a flip keeps the gap.
 */
function defaultSideOffset(arrow: boolean, radius: TooltipRadius) {
  if (!arrow) return GAP
  if (radius !== "rounded") return ARROW_DEPTH + GAP
  return ({ side }: { side: string }) => ARROW_DEPTH + GAP - (isInlineSide(side) ? 1 : 0)
}

export interface TooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>, "className"> {
  /** Figma `Style`. */
  variant?: TooltipVariant
  /** Figma `Radius`: `standard` is 8px, `rounded` 16px — a pill on one line. */
  radius?: TooltipRadius
  /**
   * The side of the trigger the tooltip sits on. `left` and `right` stay put
   * in RTL; `inline-start` and `inline-end` follow the reading direction. It
   * flips to the opposite side when there is no room.
   */
  side?: TooltipSide
  /** Where along that side it lines up with the trigger. */
  align?: "start" | "center" | "end"
  /**
   * Distance from the trigger to the bubble, in px. Defaults to 4px between
   * the trigger and the arrow's tip — 8 with the arrow, 4 without (7 for a
   * Rounded bubble's side arrow, which overlaps the body by 1px).
   */
  sideOffset?: number
  /** Shifts the tooltip along `align`, in px. */
  alignOffset?: number
  /**
   * How it avoids the viewport edge: by default it flips to the opposite
   * side, then shifts along it. Pass `{ side: "none", align: "none" }` to
   * hold it where `side` and `align` put it.
   */
  collisionAvoidance?: React.ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Positioner
  >["collisionAvoidance"]
  /** Show the arrow. Off is Figma's `Position = None`. */
  arrow?: boolean
  /**
   * A second line under the title — Figma's Sub Text. It is 70% of the text
   * colour, or `muted-foreground` on Secondary.
   */
  description?: React.ReactNode
  /** A glyph before the text, shown at 16px in the text colour. */
  icon?: React.ReactNode
  /**
   * An Avatar before the text (and before `icon`), always at size 12. It is
   * round, as in Figma, unless you pass `radius`.
   */
  avatar?: Omit<AvatarProps, "size">
  /**
   * The element the tooltip is portalled into. Defaults to `<body>`; pass a
   * container inside a themed subtree (a `.dark` panel) to keep its tokens.
   */
  container?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>["container"]
  className?: string
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      variant = "primary",
      radius = "standard",
      side = "top",
      align = "center",
      sideOffset,
      alignOffset = 0,
      collisionAvoidance,
      arrow = true,
      description,
      icon,
      avatar,
      container,
      children,
      ...props
    },
    ref
  ) => {
    const { context } = React.useContext(TooltipContext)

    return (
      <TooltipPrimitive.Portal container={container}>
        <TooltipPrimitive.Positioner
          data-slot="tooltip-positioner"
          side={side}
          align={align}
          sideOffset={sideOffset ?? defaultSideOffset(arrow, radius)}
          alignOffset={alignOffset}
          collisionAvoidance={collisionAvoidance}
          dir={context.direction}
          lang={context.lang}
          style={{ fontFamily: context.fontFamily }}
          className="z-50"
        >
          <TooltipPrimitive.Popup
            ref={ref}
            data-slot="tooltip-content"
            data-variant={variant}
            className={cn(tooltipVariants({ variant, radius }), className)}
            {...props}
          >
            {avatar && (
              <span
                data-slot="tooltip-avatar"
                className="flex h-[1lh] w-4 shrink-0 items-center justify-center"
              >
                <Avatar radius="rounded" {...avatar} size="12" />
              </span>
            )}
            {icon && (
              <span
                data-slot="tooltip-icon"
                aria-hidden="true"
                className="flex h-[1lh] shrink-0 items-center [&_svg]:size-4 [&_svg]:shrink-0"
              >
                {icon}
              </span>
            )}
            <span data-slot="tooltip-text" className="flex min-w-0 max-w-[296px] flex-col gap-1">
              <span data-slot="tooltip-title">{children}</span>
              {description && (
                <span
                  data-slot="tooltip-description"
                  className={variant === "secondary" ? "text-muted-foreground" : "opacity-70"}
                >
                  {description}
                </span>
              )}
            </span>
            {arrow && (
              <TooltipPrimitive.Arrow
                data-slot="tooltip-arrow"
                className={cn(tooltipArrowClasses, radius === "rounded" && tooltipArrowRoundedClasses)}
              />
            )}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, tooltipVariants }
export type { TooltipVariant, TooltipRadius, TooltipSide }

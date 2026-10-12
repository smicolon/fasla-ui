"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: "Tabs & Pills" — `Tabs / Tab item` (408:8904) and `Tabs Component`
 * (39913:32645). "Pills" is another name for the same component.
 *
 * Built on Base UI's Tabs, which owns the behaviour: the tablist, tab and
 * tabpanel roles and the ids that link them, the roving tab stop, the arrow,
 * Home and End keys, and the fallback to the first enabled tab. This file
 * owns the look.
 *
 * Figma axis → code:
 *  - `Style` (Lifted / Boxed / Bordered) → `variant` ("lifted" | "boxed" |
 *    "bordered") on `TabsList`, shared by every tab in it — Figma's doc says
 *    never to mix styles in one group.
 *  - `size` (sm / md / lg) → `size` on `TabsList`, for the same reason.
 *  - `State` → real interaction: inactive / Active (`data-active`), Hover,
 *    Focus (`:focus-visible`), disabled (`data-disabled`).
 *  - `Direction` → the page's `dir`, never a prop.
 *  - `Has Icon` → put a lucide icon before the label; it is sized for you.
 *  - The composite set's `Tabs` (2–8) and `Active Tab` axes are content.
 */

type TabsVariant = "lifted" | "boxed" | "bordered"
type TabsSize = "sm" | "md" | "lg"

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * The direction the tabs sit in, read from the DOM: the nearest `dir`, else
 * the computed `direction`. Base UI only learns the direction from its
 * DirectionProvider, so this feeds it the page's. It is read on mount and
 * again whenever focus enters the tabs, which always comes before an arrow
 * key, so a `dir` that changes later (a locale switch, Storybook's toolbar)
 * is picked up too.
 */
function useDocumentDirection() {
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr")
  const ref = React.useRef<HTMLDivElement | null>(null)
  const read = React.useCallback(() => {
    const node = ref.current
    if (!node) return
    const attribute = node.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
    const isRtl =
      attribute === "rtl" ||
      (attribute !== "ltr" && getComputedStyle(node).direction === "rtl")
    setDirection(isRtl ? "rtl" : "ltr")
  }, [])
  useIsomorphicLayoutEffect(read, [read])
  return { direction, ref, read }
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export interface TabsProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "className" | "orientation"> {
  /**
   * The tab active on first render. Without it (and without `value`), the
   * first enabled tab is activated — Figma's rule is that a group always has
   * an active tab.
   */
  defaultValue?: TabsPrimitive.Tab.Value
  className?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, onFocusCapture, ...props }, ref) => {
    const { direction, ref: directionRef, read } = useDocumentDirection()
    const mergedRef = React.useMemo(() => mergeRefs(ref, directionRef), [ref, directionRef])

    return (
      <DirectionProvider direction={direction}>
        <TabsPrimitive.Root
          ref={mergedRef}
          data-slot="tabs"
          className={cn("w-full", className)}
          onFocusCapture={(event) => {
            read()
            onFocusCapture?.(event)
          }}
          {...props}
        />
      </DirectionProvider>
    )
  }
)
Tabs.displayName = "Tabs"

/**
 * The group: Figma's Tabs Component. Tabs sit flush, with no gap.
 *
 *  - boxed: a track — `muted` fill, 4px padding (Figma `spacing/1`) and
 *    `rounded-lg` — that the tabs sit in. Figma's `border radius/lg` is 10px,
 *    shadcn's default `--radius`, which `rounded-lg` reads; the theme leaves
 *    the lg step to the project on purpose, so this follows its `--radius`.
 *  - bordered, lifted: a plain row; each tab carries its own line.
 */
const tabsListVariants = cva("relative inline-flex items-center", {
  variants: {
    variant: {
      boxed: "rounded-lg bg-muted p-1",
      bordered: "",
      lifted: "",
    },
  },
  defaultVariants: {
    variant: "boxed",
  },
})

/**
 * One tab, per Figma Style and size.
 *
 * Shared: Geist/Cairo Medium, `foreground` text, a 6px icon↔label gap, and
 * `muted-foreground` text when disabled. Each tab is a fixed height with no
 * vertical padding, its content centred. Hover is a plain
 * `hover:`, which the Storybook pseudo-states addon can force (it cannot
 * force a `:hover` chained with other pseudo-classes). Tailwind emits
 * `data-[active]:` after `hover:`, so the active fill still wins, and a
 * disabled tab takes no pointer events. Every style shows keyboard focus as
 * Figma's 3px halo, in `ring/50`; Boxed adds a 1px `ring` stroke.
 *
 *  - boxed: radius `--radius-md` (Figma `rounded-field`, 8px), inside the
 *    list's `muted` track. Hover is `background/60` (Figma "Track Hover").
 *    Active is a `background` pill with Figma's `shadow/sm` — exactly
 *    Tailwind 3's `shadow` — so it stands out from the track in both
 *    modes. Focus adds Figma's 1px `ring` stroke, drawn as an inset
 *    outline so the tab does not grow.
 *  - bordered: a 2px underline, `border` → `primary` when active, drawn as
 *    an inset shadow so it overlays the box as in Figma instead of taking
 *    height from it; hover tints it `primary/20`, as Lifted's baseline. The
 *    shadow colour utilities recolour that one shadow. Active fills
 *    `background` and sets the text `primary`.
 *  - lifted: every tab but the active one sits on a 1px `border` baseline,
 *    with `--radius-sm` (6px) on its top corners and square bottom corners,
 *    so the baseline runs unbroken under the row. The active tab rises out
 *    of it — `background`, 1px `border` on three sides, Figma's raw 10px top
 *    radius, and the two flared corners each tab carries, shown only while
 *    it is active. Every tab keeps transparent side borders so switching
 *    never changes a tab's width. The baseline is an `::after` line that
 *    runs under those side borders: a `border-bottom` would meet them in a
 *    mitred corner and leave a notch at every tab edge. Hover is a `muted`
 *    fill and tints the baseline `primary/20` (Figma
 *    `opacity/primary-light`). Bordered hovers `muted` too.
 */
const tabsTriggerVariants = cva(
  [
    "group/tab relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium text-foreground outline-none",
    "transition-[color,background-color,border-color,box-shadow] motion-reduce:transition-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        boxed: [
          "rounded-[var(--radius-md)]",
          "hover:bg-background/60",
          "data-[active]:bg-background data-[active]:shadow",
          "focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring",
        ],
        bordered: [
          "shadow-[inset_0_-2px_0_0_var(--border)]",
          "hover:bg-muted hover:shadow-primary/20",
          "data-[active]:bg-background data-[active]:text-primary data-[active]:shadow-primary",
        ],
        lifted: [
          "rounded-t-[var(--radius-sm)] border-x border-transparent",
          "after:pointer-events-none after:absolute after:-inset-x-px after:bottom-0 after:h-px after:bg-border",
          "hover:bg-muted hover:after:bg-primary/20",
          "data-[active]:rounded-t-[10px] data-[active]:border-t data-[active]:border-border data-[active]:bg-background data-[active]:text-primary data-[active]:after:hidden",
        ],
      },
      // Icons are sized by size; the Lifted corners are SVGs too, so they
      // are excluded and keep their own 9px.
      size: {
        sm: "h-7 px-2 text-sm [&_svg:not([data-slot=corner])]:size-4",
        md: "h-[30px] px-2.5 text-sm [&_svg:not([data-slot=corner])]:size-4",
        lg: "h-8 px-3 text-base [&_svg:not([data-slot=corner])]:size-5",
      },
    },
    defaultVariants: {
      variant: "boxed",
      size: "md",
    },
  }
)

const TabsListContext = React.createContext<{
  variant: TabsVariant
  size: TabsSize
}>({ variant: "boxed", size: "md" })

export interface TabsListProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>, "className"> {
  /**
   * How the active tab is shown: lifted out of a baseline, a boxed pill, or
   * an underline. Declared here rather than inherited from `VariantProps`,
   * which widens every variant with `| null` and shows a meaningless option
   * in Storybook.
   */
  variant?: TabsVariant
  /** Size of every tab in the group */
  size?: TabsSize
  /**
   * Whether moving focus with the arrow keys also selects the tab. On by
   * default, so the panel follows the keys; turn it off when showing a
   * panel is slow, and Enter or Space selects instead.
   */
  activateOnFocus?: boolean
  className?: string
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "boxed", size = "md", activateOnFocus = true, ...props }, ref) => {
    const listContext = React.useMemo(() => ({ variant, size }), [variant, size])

    return (
      <TabsListContext.Provider value={listContext}>
        <TabsPrimitive.List
          ref={ref}
          data-slot="tabs-list"
          activateOnFocus={activateOnFocus}
          className={cn(tabsListVariants({ variant }), className)}
          {...props}
        />
      </TabsListContext.Provider>
    )
  }
)
TabsList.displayName = "TabsList"

/**
 * Lifted's flared corner: Figma's `.Tab / Corner`, a 9px concave curve that
 * runs the active tab's side border into the baseline. The paths are Figma's;
 * the fills are tokens. Every Lifted tab carries both, and they show only
 * while it is active, so the tab's own state draws them.
 *
 * The one physical placement in Tabs, on purpose: the two corners are mirror
 * images, each drawn for its own side, so `left` / `right` is correct in
 * either direction. Logical `start` / `end` would move each one to the other
 * side in RTL with its curve still facing the old way.
 *
 * Offset 9px from the padding edge, so the curve's top lands on the tab's
 * 1px side border and the `background` fill paints out the border below it:
 * the side border flows into the flare as one line.
 */
function LiftedCorner({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      data-slot="corner"
      viewBox="0 0 9 9"
      className={cn(
        "pointer-events-none absolute bottom-0 hidden size-[9px] group-data-[active]/tab:block",
        side === "left" ? "-left-[9px]" : "-right-[9px] -scale-x-100"
      )}
    >
      <path
        className="fill-background"
        fillRule="evenodd"
        d="M9 0H8C8 4.41828 4.41828 8 0 8V9H9V0Z"
      />
      <path
        className="fill-border"
        fillRule="evenodd"
        d="M0 8C4.41828 8 8 4.41828 8 0H9C9 4.97056 4.97056 9 0 9V8Z"
      />
    </svg>
  )
}

export interface TabsTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>, "className"> {
  className?: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, size } = React.useContext(TabsListContext)

    return (
      <TabsPrimitive.Tab
        ref={ref}
        data-slot="tabs-trigger"
        className={cn(tabsTriggerVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {variant === "lifted" && (
          <>
            <LiftedCorner side="left" />
            <LiftedCorner side="right" />
          </>
        )}
      </TabsPrimitive.Tab>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>, "className"> {
  className?: string
}

/**
 * A panel. Base UI makes it focusable while shown, so keyboard users can
 * reach a panel with no focusable content of its own straight from the tab.
 */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Panel
      ref={ref}
      data-slot="tabs-content"
      className={cn(
        "mt-2 rounded-[var(--radius-sm)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
)
TabsContent.displayName = "TabsContent"

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
}
export type { TabsVariant, TabsSize }

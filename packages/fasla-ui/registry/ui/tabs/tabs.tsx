"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: "Tabs & Pills" — `Tabs / Tab item` (408:8904) and `Tabs Component`
 * (39913:32645). "Pills" is another name for the same component.
 *
 * Figma axis → code:
 *  - `Style` (Lifted / Boxed / Borderd) → `variant` ("lifted" | "boxed" |
 *    "bordered") on `TabsList`, shared by every tab in it — Figma's doc says
 *    never to mix styles in one group. Figma's "Borderd" is a typo.
 *  - `size` (sm / md / lg) → `size` on `TabsList`, for the same reason.
 *  - `State` → real interaction: inactive / Active (`data-state`), Hover,
 *    Focus (`:focus-visible`), disabled (`:disabled`).
 *  - `Direction` → the page's `dir`, never a prop.
 *  - `Has Icon` → put a lucide icon before the label; it is sized for you.
 *  - The composite set's `Tabs` (2–8) and `Active Tab` axes are content.
 */

type TabsVariant = "lifted" | "boxed" | "bordered"
type TabsSize = "sm" | "md" | "lg"

interface TabsContextValue {
  baseId: string
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

const TabsListContext = React.createContext<{
  variant: TabsVariant
  size: TabsSize
}>({ variant: "boxed", size: "md" })

/** A value as an id fragment: ids may not contain whitespace. */
const idPart = (value: string) => value.replace(/\s+/g, "-")
const triggerId = (baseId: string, value: string) =>
  `${baseId}-trigger-${idPart(value)}`
const contentId = (baseId: string, value: string) =>
  `${baseId}-content-${idPart(value)}`

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "dir"> {
  /** The controlled value of the tab to activate */
  value?: string
  /**
   * The tab active on first render. Without it (and without `value`), the
   * first enabled tab is activated — Figma's rule is that a group always has
   * an active tab.
   */
  defaultValue?: string
  /** Called when the value changes */
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId()
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? ""
    )
    const value = controlledValue ?? uncontrolledValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        setUncontrolledValue(newValue)
        onValueChange?.(newValue)
      },
      [onValueChange]
    )

    const context = React.useMemo(
      () => ({ baseId, value, onValueChange: handleValueChange }),
      [baseId, value, handleValueChange]
    )

    return (
      <TabsContext.Provider value={context}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

/**
 * The group. Figma's Tabs Component is a plain row: no track fill, no gap —
 * tabs sit flush, and each tab carries its own style.
 */
const tabsListVariants = cva("relative inline-flex items-center")

/**
 * One tab, per Figma Style and size.
 *
 * Shared: Geist/Cairo Medium, `foreground` text, a 6px icon↔label gap, and
 * `muted-foreground` text when disabled. Hover is a `muted` fill: a plain
 * `hover:`, which the Storybook pseudo-states addon can force (it cannot
 * force a `:hover` chained with other pseudo-classes). Tailwind emits
 * `data-[state=active]:` after `hover:`, so the active fill still wins, and
 * a disabled tab takes no pointer events. Every style shows keyboard focus as a 3px
 * `ring/50` halo; Figma draws Focus only for Boxed, and the halo is that
 * design applied to the other two, since focus must always be visible.
 *
 *  - boxed: radius `--radius-md` (Figma `rounded-field`, 8px). Active is a
 *    `background` pill with Figma's `shadow/sm` — exactly Tailwind 3's
 *    `shadow`. Focus adds Figma's 1px `ring` stroke, drawn as an inset
 *    outline so the tab does not grow.
 *  - bordered: a 2px underline, `border` → `primary` when active, drawn as
 *    an inset shadow so it overlays the box as in Figma instead of taking
 *    height from it. Active fills `background` and sets the text `primary`.
 *  - lifted: inactive tabs sit on a 1px `border` baseline (radius
 *    `--radius-sm`, 6px); the active tab rises out of it — `background`,
 *    1px `border` on three sides, Figma's raw 10px top radius, and the two
 *    flared corners `TabsTrigger` adds. Inactive tabs keep transparent side
 *    borders so switching never changes a tab's width. Hover tints the
 *    baseline `primary/20` (Figma `opacity/primary-light`).
 */
const tabsTriggerVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium text-foreground outline-none",
    "transition-[color,background-color,border-color,box-shadow] motion-reduce:transition-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:text-muted-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        boxed: [
          "rounded-[var(--radius-md)]",
          "hover:bg-muted",
          "data-[state=active]:bg-background data-[state=active]:shadow",
          "focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring",
        ],
        bordered: [
          "shadow-[inset_0_-2px_0_0_var(--border)]",
          "hover:bg-muted",
          "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)]",
        ],
        lifted: [
          "rounded-[var(--radius-sm)] border-x border-b border-transparent border-b-border",
          "hover:bg-muted hover:border-b-primary/20",
          "data-[state=active]:rounded-b-none data-[state=active]:rounded-t-[10px] data-[state=active]:border-b-0 data-[state=active]:border-t data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-primary",
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

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * How the active tab is shown: lifted out of a baseline, a boxed pill, or
   * an underline. Declared here rather than inherited from `VariantProps`,
   * which widens every variant with `| null` and shows a meaningless option
   * in Storybook.
   */
  variant?: TabsVariant
  /** Size of every tab in the group */
  size?: TabsSize
  children: React.ReactNode
}

const TAB_SELECTOR = '[role="tab"]:not(:disabled)'

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (
    { className, variant = "boxed", size = "md", children, onKeyDown, ...props },
    ref
  ) => {
    const { value, onValueChange } = useTabsContext()
    const listRef = React.useRef<HTMLDivElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    // No active tab yet (no `value`, no `defaultValue`): activate the first
    // enabled one, so the group is never without an active, focusable tab.
    useIsomorphicLayoutEffect(() => {
      if (value !== "" || !listRef.current) return
      const first = listRef.current.querySelector<HTMLElement>(TAB_SELECTOR)
      const firstValue = first?.dataset.value
      if (firstValue !== undefined) onValueChange(firstValue)
    }, [value, onValueChange])

    /*
     * WAI-ARIA tabs, automatic activation: arrows move focus *and* select,
     * wrapping at the ends; Home/End jump to the first/last tab; disabled
     * tabs are skipped. ArrowRight means "next" in LTR and "previous" in
     * RTL — the direction is read from the nearest `dir` (or the computed
     * `direction`), so it follows whatever the page or any ancestor sets.
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || !listRef.current) return
      const tabs = Array.from(
        listRef.current.querySelectorAll<HTMLElement>(TAB_SELECTOR)
      )
      const index = tabs.indexOf(document.activeElement as HTMLElement)
      if (index === -1) return

      const isRtl =
        listRef.current.closest("[dir]")?.getAttribute("dir")?.toLowerCase() ===
          "rtl" || getComputedStyle(listRef.current).direction === "rtl"
      const step = { ArrowRight: isRtl ? -1 : 1, ArrowLeft: isRtl ? 1 : -1 }
      let next: number
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        next = (index + step[event.key] + tabs.length) % tabs.length
      } else if (event.key === "Home") {
        next = 0
      } else if (event.key === "End") {
        next = tabs.length - 1
      } else {
        return
      }
      const target = tabs[next]
      if (!target) return
      event.preventDefault()
      target.focus()
      target.click()
    }

    const listContext = React.useMemo(() => ({ variant, size }), [variant, size])

    return (
      <TabsListContext.Provider value={listContext}>
        <div
          ref={setRefs}
          role="tablist"
          aria-orientation="horizontal"
          data-slot="tabs-list"
          className={cn(tabsListVariants(), className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </TabsListContext.Provider>
    )
  }
)
TabsList.displayName = "TabsList"

/**
 * Lifted's flared corner: Figma's `.Tab / Corner`, a 9px concave curve that
 * runs the active tab's side border into the baseline. The paths are Figma's;
 * the fills are tokens. The two corners are mirror images, so each sits on a
 * fixed physical side (`left` / `right`) and is correct in either direction.
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
        "pointer-events-none absolute bottom-0 size-[9px]",
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The unique value for the tab */
  value: string
  children: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, onClick, disabled, ...props }, ref) => {
    const { baseId, value: selectedValue, onValueChange } = useTabsContext()
    const { variant, size } = React.useContext(TabsListContext)
    const isSelected = selectedValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId(baseId, value)}
        aria-selected={isSelected}
        aria-controls={contentId(baseId, value)}
        // Roving tabindex: Tab enters the group on the active tab, and the
        // arrow keys move between tabs.
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        data-state={isSelected ? "active" : "inactive"}
        data-value={value}
        data-slot="tabs-trigger"
        className={cn(tabsTriggerVariants({ variant, size }), className)}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) onValueChange(value)
        }}
        {...props}
      >
        {children}
        {variant === "lifted" && isSelected && (
          <>
            <LiftedCorner side="left" />
            <LiftedCorner side="right" />
          </>
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The unique value for the tab panel */
  value: string
  children: React.ReactNode
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { baseId, value: selectedValue } = useTabsContext()

    if (selectedValue !== value) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={contentId(baseId, value)}
        aria-labelledby={triggerId(baseId, value)}
        // Focusable, so keyboard users can reach a panel with no focusable
        // content of its own straight from the tab.
        tabIndex={0}
        data-state="active"
        data-slot="tabs-content"
        className={cn(
          "mt-2 rounded-[var(--radius-sm)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
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

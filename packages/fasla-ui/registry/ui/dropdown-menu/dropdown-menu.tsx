"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { CheckIcon, ChevronRightIcon, DotIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { menuItemClasses, menuPopupClasses } from "../select/select"
import { Switch } from "../switch/switch"

/*
 * Figma: "Dropdown" (3969:51446, 20 variants), with its parts on the same
 * page: "Dropdown Item" (46229:3337, 24 variants), "Dropdown Label"
 * (46229:243341) and "Dropdown Separator" (46229:243342).
 *
 * Built on Base UI's Menu, which owns the behaviour: the menu, menuitem,
 * menuitemcheckbox and menuitemradio roles, opening on press and on the
 * arrow keys, moving the highlight with the arrow keys, Home, End and
 * type-ahead, opening a submenu with the arrow that points into it, closing
 * on Escape and on a press outside, returning focus to the trigger, and
 * placing the menu against the trigger. This file owns the look. The parts
 * and their names follow shadcn's DropdownMenu.
 *
 * The surface and the rows are Select's (`menuPopupClasses`,
 * `menuItemClasses`): Figma draws the two menus with the same popover, border,
 * radius, shadow, 4px padding and 32px rows.
 *
 * Figma → code:
 *  - The Dropdown set's Variants are compositions of these parts, not props.
 *  - Dropdown Item `Type`: Default → `DropdownMenuItem`; Destructive →
 *    `variant="destructive"`; Checkbox → `DropdownMenuCheckboxItem`; Radio →
 *    `DropdownMenuRadioItem` in a `DropdownMenuRadioGroup`.
 *  - `State`: Hover is Base UI's highlight — the pointer or the arrow keys;
 *    Disabled → `disabled`.
 *  - The booleans: `Icon` → `icon`; `Shortcut` → `DropdownMenuShortcut`;
 *    `Sub-menu` → `DropdownMenuSubTrigger`, whose chevron mirrors in RTL;
 *    `Switch` → `indicator="switch"` on a checkbox item; `Checked` →
 *    `checked`.
 *  - `Direction` → the trigger's `dir`, never a prop.
 */

type DropdownMenuItemVariant = "default" | "destructive"
type DropdownMenuIndicator = "check" | "switch"

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
 * Where the trigger sits: its direction, language and font. The menu is
 * portalled to `<body>`, out of the trigger's subtree, so it inherits none of
 * them; the positioner re-applies them so an Arabic page gets a right-to-left,
 * Cairo menu. Base UI only learns the direction from its DirectionProvider,
 * which also decides the side a submenu opens on.
 */
type TriggerContext = {
  direction: "ltr" | "rtl"
  lang?: string
  fontFamily?: string
}

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

const DropdownMenuContext = React.createContext<{
  context: TriggerContext
  read: (node: HTMLElement | null) => void
  triggerRef: React.MutableRefObject<HTMLElement | null>
}>({ context: { direction: "ltr" }, read: () => {}, triggerRef: { current: null } })

/** Where the open menu renders, so a submenu renders there too. */
type Container = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>["container"]
const ContainerContext = React.createContext<Container>(undefined)

/** Whether a label sits in a group, and so names it. */
const GroupContext = React.createContext(false)

/**
 * A row's icon slot: Figma's 16px glyph, in `foreground` in every state and
 * type, as Figma binds it. The prefix icon and the submenu chevron.
 */
const ICON =
  "flex shrink-0 items-center text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

/**
 * The 16px slot before a checkbox or radio item's text. It is always there,
 * so a row's text does not move when it is checked.
 */
const INDICATOR = "flex size-4 shrink-0 items-center justify-center"

/** `inset` lines a row's text up with the text of rows that have an icon or indicator: 8 + 16 + 8px. */
const INSET = "ps-8"

/**
 * Rows' own icons, passed as children rather than through `icon`, get the
 * icon slot's size. Long words break inside the menu rather than overflow it.
 */
const ROW = cn(menuItemClasses, "[overflow-wrap:anywhere] [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0")

export type DropdownMenuProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Root>

/**
 * One dropdown menu: a `DropdownMenuTrigger` and a `DropdownMenuContent`.
 * While it is open the rest of the page is inert (Base UI's `modal`); pass
 * `modal={false}` to keep the page live.
 */
function DropdownMenu({ onOpenChange, open, ...props }: DropdownMenuProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const [context, setContext] = React.useState<TriggerContext>({ direction: "ltr" })
  const read = React.useCallback((node: HTMLElement | null) => {
    if (!node) return
    const next = readContext(node)
    setContext((prev) =>
      prev.direction === next.direction && prev.lang === next.lang && prev.fontFamily === next.fontFamily
        ? prev
        : next
    )
  }, [])
  // A controlled `open` can open the menu with no press or focus to read on.
  useIsomorphicLayoutEffect(() => {
    if (open) read(triggerRef.current)
  }, [open, read])
  const value = React.useMemo(() => ({ context, read, triggerRef }), [context, read])

  return (
    <DropdownMenuContext.Provider value={value}>
      <DirectionProvider direction={context.direction}>
        <MenuPrimitive.Root
          open={open}
          onOpenChange={(next, details) => {
            if (next) read(triggerRef.current)
            onOpenChange?.(next, details)
          }}
          {...props}
        />
      </DirectionProvider>
    </DropdownMenuContext.Provider>
  )
}
DropdownMenu.displayName = "DropdownMenu"

export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>

/**
 * What opens the menu. Renders a `<button>`; pass `render` to use your own
 * element, such as a Button: `render={<Button variant="outline" />}`.
 *
 * Reads the trigger's direction before the first paint, and again whenever an
 * ancestor's `dir`, `lang`, `class` or `style` changes — a locale switch, a
 * font class, Storybook's toolbar — so an open menu follows the page.
 */
const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>((props, ref) => {
  const { read, triggerRef } = React.useContext(DropdownMenuContext)
  const localRef = React.useRef<HTMLButtonElement | null>(null)
  const mergedRef = React.useMemo(
    () =>
      mergeRefs<HTMLButtonElement>(ref, localRef, (node) => {
        triggerRef.current = node
      }),
    [ref, triggerRef]
  )
  // Each ancestor is observed on its own, without `subtree`, so changes
  // elsewhere in the page never wake it.
  useIsomorphicLayoutEffect(() => {
    const node = localRef.current
    read(node)
    if (!node || typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(() => read(localRef.current))
    for (let el = node.parentElement; el; el = el.parentElement) {
      observer.observe(el, { attributes: true, attributeFilter: ["dir", "lang", "class", "style"] })
    }
    return () => observer.disconnect()
  }, [read])

  return <MenuPrimitive.Trigger ref={mergedRef} data-slot="dropdown-menu-trigger" {...props} />
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

type PositionerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>

export interface DropdownMenuContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>, "className"> {
  /** Side of the trigger the menu opens on. `inline-start` and `inline-end` follow the reading direction. */
  side?: PositionerProps["side"]
  /** Where the menu lines up along that side. */
  align?: PositionerProps["align"]
  /** Distance from the trigger to the menu, in px. */
  sideOffset?: number
  /** Shifts the menu along `align`, in px. */
  alignOffset?: number
  /**
   * How the menu avoids the window edge. By default it flips to the other
   * side of the trigger when there is no room. Pass `{ side: "none" }` to keep
   * it where it is.
   */
  collisionAvoidance?: PositionerProps["collisionAvoidance"]
  /** Where the menu renders, and its submenus with it. Default `<body>`. */
  container?: Container
  className?: string
}

/**
 * The menu: Figma's Dropdown frame, on Select's menu surface — `popover`, a
 * 1px `input` border, 4px padding, `border radius/md`, `shadow/md` — 4px
 * under the trigger and lined up with its start edge. At least 128px wide,
 * otherwise as wide as its rows; give it a width with `className`. It scrolls
 * when it is taller than the room left in the window.
 */
const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      side = "bottom",
      align = "start",
      sideOffset = 4,
      alignOffset = 0,
      collisionAvoidance,
      container,
      className,
      ...props
    },
    ref
  ) => {
    const { context } = React.useContext(DropdownMenuContext)
    return (
      <ContainerContext.Provider value={container}>
        <MenuPrimitive.Portal container={container}>
          <MenuPrimitive.Positioner
            data-slot="dropdown-menu-positioner"
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionAvoidance={collisionAvoidance}
            dir={context.direction}
            lang={context.lang}
            style={{ fontFamily: context.fontFamily }}
            className="z-50 [outline:none]"
          >
            <MenuPrimitive.Popup
              ref={ref}
              data-slot="dropdown-menu-content"
              className={cn(menuPopupClasses, "min-w-32", className)}
              {...props}
            />
          </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
      </ContainerContext.Provider>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>

/** Related rows. A `DropdownMenuLabel` inside names the group for screen readers. */
const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>((props, ref) => (
  <GroupContext.Provider value={true}>
    <MenuPrimitive.Group ref={ref} data-slot="dropdown-menu-group" {...props} />
  </GroupContext.Provider>
))
DropdownMenuGroup.displayName = "DropdownMenuGroup"

export interface DropdownMenuLabelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  /** Lines the label up with rows that have an icon or an indicator. */
  inset?: boolean
  className?: string
}

/**
 * A heading over some rows: Figma's Dropdown Label. 32px tall, `text-sm`
 * medium in `popover-foreground`, 8px inline padding — a row's text column.
 *
 * Inside a `DropdownMenuGroup` or `DropdownMenuRadioGroup` it names that
 * group for screen readers (Base UI's group label). Elsewhere it is a plain
 * heading over the rows.
 */
const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ inset, className, ...props }, ref) => {
    const inGroup = React.useContext(GroupContext)
    const classes = cn(
      "flex min-h-8 items-center gap-2 px-2 py-1 text-start text-sm font-medium text-popover-foreground [overflow-wrap:anywhere]",
      inset && INSET,
      className
    )
    return inGroup ? (
      <MenuPrimitive.GroupLabel ref={ref} data-slot="dropdown-menu-label" className={classes} {...props} />
    ) : (
      <div ref={ref} data-slot="dropdown-menu-label" className={classes} {...props} />
    )
  }
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export interface DropdownMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>, "className"> {
  /** `destructive` sets the text in `destructive`, for an action that deletes or cannot be undone. */
  variant?: DropdownMenuItemVariant
  /** A 16px icon before the text, usually a lucide icon. */
  icon?: React.ReactNode
  /** Lines the text up with rows that have an icon or an indicator. */
  inset?: boolean
  className?: string
}

/**
 * One action: Figma's Dropdown Item. Select's row — 32px tall with 4px block
 * padding, 8px inline padding, an 8px gap, `border radius/sm`, `text-sm` in
 * `popover-foreground`. Highlighted (the pointer or the arrow keys) is the
 * `accent` fill with `accent-foreground` text; disabled is half opacity.
 * Pressing it closes the menu.
 *
 * Destructive keeps its `destructive` text when highlighted. Its icon stays
 * `foreground`, as in Figma.
 */
const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ variant = "default", icon, inset, className, children, ...props }, ref) => (
    <MenuPrimitive.Item
      ref={ref}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        ROW,
        variant === "destructive" && "text-destructive data-[highlighted]:text-destructive",
        inset && INSET,
        className
      )}
      {...props}
    >
      {icon && (
        <span data-slot="dropdown-menu-item-icon" aria-hidden="true" className={ICON}>
          {icon}
        </span>
      )}
      {children}
    </MenuPrimitive.Item>
  )
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const setInert = (node: HTMLElement | null) => node?.setAttribute("inert", "")

export interface DropdownMenuCheckboxItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>, "className"> {
  /**
   * How the row shows it is on: a check before the text (Figma's Checkbox
   * type), or our Switch at the end of the row (Figma's Switch).
   */
  indicator?: DropdownMenuIndicator
  className?: string
}

/**
 * A setting that is on or off: Figma's Checkbox type, or a row with a Switch.
 * Pressing it toggles it and leaves the menu open.
 *
 *  - `check`: a 16px check, before the text. Its slot is always there, so
 *    the text never moves.
 *  - `switch`: our Switch, md, at the end of the row — Solid when on and
 *    Outline when off, as Figma pairs them. It is a picture of the row's
 *    state: the row itself is the checkbox screen readers and the keyboard
 *    use, so the Switch is hidden from them and takes no presses.
 */
const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  (
    { indicator = "check", checked, defaultChecked = false, onCheckedChange, className, children, ...props },
    ref
  ) => {
    // Held here, controlled or not, so the Switch can draw it.
    const [uncontrolled, setUncontrolled] = React.useState(defaultChecked)
    const isControlled = checked !== undefined
    const on = isControlled ? checked : uncontrolled

    return (
      <MenuPrimitive.CheckboxItem
        ref={ref}
        data-slot="dropdown-menu-checkbox-item"
        data-indicator={indicator}
        checked={on}
        onCheckedChange={(next, details) => {
          if (!isControlled) setUncontrolled(next)
          onCheckedChange?.(next, details)
        }}
        className={cn(ROW, className)}
        {...props}
      >
        {indicator === "check" && (
          <span data-slot="dropdown-menu-checkbox-indicator" className={INDICATOR}>
            <MenuPrimitive.CheckboxItemIndicator className="flex">
              <CheckIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
            </MenuPrimitive.CheckboxItemIndicator>
          </span>
        )}
        {children}
        {indicator === "switch" && (
          // `inert` takes the Switch's own checkbox out of focus and the
          // accessibility tree, so the row is the only control. Set through a
          // ref: React 18 has no `inert` prop, and React 19 reads `inert=""`
          // as false.
          <span
            ref={setInert}
            data-slot="dropdown-menu-switch"
            aria-hidden="true"
            className="pointer-events-none ms-auto flex shrink-0"
          >
            <Switch variant={on ? "solid" : "outline"} size="md" checked={on} readOnly tabIndex={-1} />
          </span>
        )}
      </MenuPrimitive.CheckboxItem>
    )
  }
)
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

export type DropdownMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>

/** Radio items of which one is chosen. A `DropdownMenuLabel` inside names it. */
const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>((props, ref) => (
  <GroupContext.Provider value={true}>
    <MenuPrimitive.RadioGroup ref={ref} data-slot="dropdown-menu-radio-group" {...props} />
  </GroupContext.Provider>
))
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"

export interface DropdownMenuRadioItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>, "className"> {
  className?: string
}

/**
 * One choice of a `DropdownMenuRadioGroup`: Figma's Radio type. The chosen
 * one shows Figma's dot — lucide's at a 1.5 stroke — in a 16px slot before the
 * text that is always there. Pressing it chooses it and leaves the menu open.
 */
const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ className, children, ...props }, ref) => (
    <MenuPrimitive.RadioItem ref={ref} data-slot="dropdown-menu-radio-item" className={cn(ROW, className)} {...props}>
      <span data-slot="dropdown-menu-radio-indicator" className={INDICATOR}>
        <MenuPrimitive.RadioItemIndicator className="flex">
          <DotIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
)
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

export interface DropdownMenuSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>, "className"> {
  className?: string
}

/** A line between groups of rows: Figma's Dropdown Separator, 1px of `border` with 4px above and below. */
const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <MenuPrimitive.Separator
      ref={ref}
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>

/**
 * A keyboard shortcut at the end of a row: Figma's Shortcut, `text-xs` in
 * `muted-foreground`. It only shows the keys; listen for them yourself. It is
 * set left to right in both directions, so `⇧⌘P` keeps its order on an
 * Arabic page.
 */
const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      dir="ltr"
      data-slot="dropdown-menu-shortcut"
      className={cn("ms-auto shrink-0 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export type DropdownMenuSubProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuRoot>

/** A submenu: a `DropdownMenuSubTrigger` and a `DropdownMenuSubContent`. */
function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <MenuPrimitive.SubmenuRoot {...props} />
}
DropdownMenuSub.displayName = "DropdownMenuSub"

export interface DropdownMenuSubTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger>, "className"> {
  /** A 16px icon before the text, usually a lucide icon. */
  icon?: React.ReactNode
  /** Lines the text up with rows that have an icon or an indicator. */
  inset?: boolean
  className?: string
}

/**
 * The row that opens a submenu: Figma's Sub-menu. A row with a 16px chevron
 * at its end, in `foreground`, pointing to the side the submenu opens on — so
 * it mirrors in RTL. It stays highlighted while its submenu is open (outlined
 * in forced colours). It opens
 * on hover, on press, and on the arrow key that points into it.
 *
 * The mirror reads the chevron's own direction (`:dir(rtl)`), not an `rtl:`
 * class: Tailwind 3's `rtl:` also matches an LTR menu inside an RTL page.
 */
const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  ({ icon, inset, className, children, ...props }, ref) => (
    <MenuPrimitive.SubmenuTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        ROW,
        "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
        // Forced colours drop the fill, so the open row is outlined there, as a highlighted one is.
        "forced-colors:data-[popup-open]:[outline:2px_solid_Highlight] forced-colors:data-[popup-open]:[outline-offset:-2px]",
        inset && INSET,
        className
      )}
      {...props}
    >
      {icon && (
        <span data-slot="dropdown-menu-item-icon" aria-hidden="true" className={ICON}>
          {icon}
        </span>
      )}
      {children}
      <span data-slot="dropdown-menu-sub-chevron" aria-hidden="true" className={cn(ICON, "ms-auto")}>
        <ChevronRightIcon strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
      </span>
    </MenuPrimitive.SubmenuTrigger>
  )
)
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

export type DropdownMenuSubContentProps = Omit<DropdownMenuContentProps, "side" | "align">

/**
 * The submenu: the same surface as the menu, beside its trigger on the side
 * the reading direction ends on — the right in LTR, the left in RTL — with
 * its first row level with the trigger. It flips to the other side when there
 * is no room, and renders where the menu does.
 */
const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  // -5: the submenu's 1px border and 4px padding, so its first row lines up with the trigger row.
  ({ sideOffset = 0, alignOffset = -5, collisionAvoidance, container, className, ...props }, ref) => {
    const { context } = React.useContext(DropdownMenuContext)
    const inherited = React.useContext(ContainerContext)
    return (
      <MenuPrimitive.Portal container={container ?? inherited}>
        <MenuPrimitive.Positioner
          data-slot="dropdown-menu-sub-positioner"
          side="inline-end"
          align="start"
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionAvoidance={collisionAvoidance}
          dir={context.direction}
          lang={context.lang}
          style={{ fontFamily: context.fontFamily }}
          className="z-50 [outline:none]"
        >
          <MenuPrimitive.Popup
            ref={ref}
            data-slot="dropdown-menu-sub-content"
            className={cn(menuPopupClasses, "min-w-32", className)}
            {...props}
          />
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    )
  }
)
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
export type { DropdownMenuItemVariant, DropdownMenuIndicator }

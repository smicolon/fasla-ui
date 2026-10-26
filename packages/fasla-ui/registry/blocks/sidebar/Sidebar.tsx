"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { useRender } from "@base-ui/react/use-render"
import { ChevronRightIcon, ChevronsUpDownIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar, type AvatarProps } from "../../ui/avatar/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip/tooltip"

/*
 * Figma: "Side Bar" (40503:333), Direction × State × Plan card, and its item,
 * "Side Bar Inside Item" (40492:58601), State × Sub-item × Direction with the
 * Icon, Badge and Have sub-items booleans.
 *
 * Figma property → code:
 *  - Side Bar `State` (Expanded / Collapsed) → `collapsed` / `defaultCollapsed`
 *    on `Sidebar`, switched by the toggle `SidebarHeader` draws.
 *  - Side Bar `Plan card` → `SidebarPlanCard`, rendered only when you add it.
 *  - Item `State` Selected → `selected`; Hover and Focus are `:hover` and
 *    keyboard focus (`:focus-visible`), never props.
 *  - Item `Sub-item` → `SidebarSubItem`, inside a `SidebarItem`.
 *  - Item `Have sub-items?` → giving a `SidebarItem` sub-items as children.
 *  - Item `Icon` / `Select Icon` → `icon`; `Badge` → `badge`; `Label` → `label`.
 *  - `Direction` → the page's `dir`, never a prop. Every inset is logical, so
 *    the sidebar mirrors itself; the toggle and the sub-item chevron flip.
 *
 * Sizes, as Figma draws them: the sidebar is 256px wide with an 8px gutter
 * round a bordered panel (240px), and 80px collapsed round a 64px panel. Rows
 * are 40px tall with 16px either side; the header is 64px.
 */

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

/**
 * Whether the enclosing Sidebar is collapsed, and how to change it. Parts used
 * outside a Sidebar draw themselves expanded.
 */
const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
})

/** The enclosing Sidebar's state. */
function useSidebar() {
  return React.useContext(SidebarContext)
}

/**
 * Focus is Select's, and Input's: a `ring` border and a 3px `ring/50` halo on
 * keyboard focus (Figma's 1px `ring` stroke and its `shadow ring` effect). The
 * border is there, transparent, at rest, so focus moves nothing. Forced colours
 * drop the halo, so there focus draws a 2px `Highlight` outline instead.
 * `[outline:none]`, not Tailwind 3's `outline-none`: that is a transparent 2px
 * outline, which forced colours paint round the control all the time.
 */
const focusRing = cn(
  "border border-transparent [outline:none]",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "focus-visible:forced-colors:[outline:2px_solid_Highlight] forced-colors:[outline-offset:2px]"
)

/**
 * Open and close, at the motion presets' `base` duration (180ms) and
 * `standard` easing, as Accordion does: CSS cannot read the Framer Motion
 * presets themselves. Reduced motion moves at once.
 */
const motion = "duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"

/* ── Sidebar ──────────────────────────────────────────────────────────── */

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Collapses it to icons only. Pair with `onCollapsedChange`. */
  collapsed?: boolean
  /** Starts collapsed, when you do not control `collapsed`. */
  defaultCollapsed?: boolean
  /** Called with the new state when it collapses or expands. */
  onCollapsedChange?: (collapsed: boolean) => void
  children: React.ReactNode
}

/**
 * The sidebar: an `<aside>` holding a bordered panel, 256px wide and 80px
 * collapsed, as tall as its container. The width eases between the two over
 * 180ms. The panel takes its final width at once and the aside clips it while
 * it moves, so the labels never re-wrap mid-way.
 */
const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, className, children, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultCollapsed)
    const collapsed = collapsedProp ?? uncontrolled

    const onChange = React.useRef(onCollapsedChange)
    onChange.current = onCollapsedChange
    const setCollapsed = React.useCallback(
      (next: boolean) => {
        if (collapsedProp === undefined) setUncontrolled(next)
        onChange.current?.(next)
      },
      [collapsedProp]
    )

    const value = React.useMemo(() => ({ collapsed, setCollapsed }), [collapsed, setCollapsed])
    const state = collapsed ? "collapsed" : "expanded"

    return (
      <SidebarContext.Provider value={value}>
        <aside
          ref={ref}
          data-slot="sidebar"
          data-state={state}
          className={cn(
            "flex h-full shrink-0 overflow-hidden p-2 transition-[width]",
            motion,
            collapsed ? "w-20" : "w-64",
            className
          )}
          {...props}
        >
          <div
            data-slot="sidebar-panel"
            data-state={state}
            className={cn(
              "flex h-full shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border bg-sidebar text-sidebar-foreground",
              collapsed ? "w-16" : "w-60"
            )}
          >
            {children}
          </div>
        </aside>
      </SidebarContext.Provider>
    )
  }
)
Sidebar.displayName = "Sidebar"

/* ── Header ───────────────────────────────────────────────────────────── */

/**
 * The toggle's accessible name when none is given: both runs are rendered and
 * CSS keeps the one that matches the nearest `lang`, as Breadcrumb's "More"
 * does, so it is right in the server HTML before anything runs.
 */
function ToggleName({ collapsed, collapseLabel, expandLabel }: { collapsed: boolean; collapseLabel?: string; expandLabel?: string }) {
  const given = collapsed ? expandLabel : collapseLabel
  if (given) return <span className="sr-only">{given}</span>
  return (
    <>
      <span className="sr-only [&:lang(ar)]:hidden">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
      <span className="sr-only hidden [&:lang(ar)]:inline">{collapsed ? "توسيع الشريط الجانبي" : "طيّ الشريط الجانبي"}</span>
    </>
  )
}

export interface SidebarHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The full logo, shown expanded. Figma: 28px tall. */
  logo?: React.ReactNode
  /** The logo's icon alone, shown collapsed. Figma: 28 × 28px. */
  logoIcon?: React.ReactNode
  /** The toggle's accessible name while expanded. Default "Collapse sidebar", or Arabic under an Arabic `lang`. */
  collapseLabel?: string
  /** The toggle's accessible name while collapsed. Default "Expand sidebar", or Arabic under an Arabic `lang`. */
  expandLabel?: string
}

/**
 * The 64px header. Expanded: the logo, and the toggle at the end. Collapsed:
 * the logo's icon, centred, and the toggle moves under the header, at the top
 * of the icon column, as Figma draws it.
 *
 * The toggle is Lucide's `panel-left-close` (24px) and `panel-left-open`
 * (16px, in a 40px box), mirrored in RTL so they point at the edge the
 * sidebar folds toward.
 */
const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ logo, logoIcon, collapseLabel, expandLabel, className, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebar()
    const toggle = (
      <button
        type="button"
        data-slot="sidebar-toggle"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "relative flex shrink-0 items-center justify-center text-foreground",
          focusRing,
          // Expanded, Figma draws the bare 24px icon; the press area reaches
          // 8px past it (40px), as the collapsed toggle's box does.
          collapsed ? "size-10" : "size-6 rounded-[var(--radius-xs)] after:absolute after:-inset-2 after:content-['']"
        )}
      >
        {collapsed ? (
          <PanelLeftOpenIcon aria-hidden="true" className="size-4 [&:dir(rtl)]:-scale-x-100" strokeWidth={1.5} />
        ) : (
          <PanelLeftCloseIcon aria-hidden="true" className="size-6 [&:dir(rtl)]:-scale-x-100" strokeWidth={1.5} />
        )}
        <ToggleName collapsed={collapsed} collapseLabel={collapseLabel} expandLabel={expandLabel} />
      </button>
    )

    if (collapsed) {
      return (
        <>
          <div
            ref={ref}
            data-slot="sidebar-header"
            className={cn("flex size-16 shrink-0 items-center justify-center border-b", className)}
            {...props}
          >
            {logoIcon && <span className="flex size-7 items-center justify-center [&>*]:max-h-full">{logoIcon}</span>}
          </div>
          <div data-slot="sidebar-toggle-row" className="flex shrink-0 justify-center pt-3">
            {toggle}
          </div>
        </>
      )
    }

    return (
      <div
        ref={ref}
        data-slot="sidebar-header"
        className={cn("flex h-16 shrink-0 items-center border-b p-2", className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 p-2">
          <div className="flex h-8 min-w-0 flex-1 items-center">{logo}</div>
          {toggle}
        </div>
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

/* ── Content and groups ───────────────────────────────────────────────── */

export type SidebarContentProps = React.HTMLAttributes<HTMLElement>

/**
 * The `<nav>` that holds the groups and scrolls when they do not fit. Name it
 * with `aria-label` when the page has another navigation landmark.
 *
 * Expanded: 16px above the first group and 8px between groups. Collapsed: the
 * groups share one 40px-wide column with 4px between rows.
 */
const SidebarContent = React.forwardRef<HTMLElement, SidebarContentProps>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar()
  return (
    <nav
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-clip pb-2",
        collapsed ? "items-center gap-1 pt-1" : "gap-2 pt-4",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export interface SidebarGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The section title (Figma "Title"). Collapsed, it becomes a divider and stays the group's accessible name. */
  label?: React.ReactNode
  /** `SidebarItem`s. */
  children: React.ReactNode
}

/**
 * A titled section of items, closed by a line under it. Collapsed, the title
 * gives way to a 32px divider with 16px either side, as Figma's Collapsed
 * state draws it.
 */
const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(({ label, className, children, ...props }, ref) => {
  const { collapsed } = useSidebar()
  const labelId = React.useId()
  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      data-slot="sidebar-group"
      className={cn("flex flex-col", collapsed ? "items-center gap-1" : "gap-2", className)}
      {...props}
    >
      {collapsed && <div aria-hidden="true" data-slot="sidebar-divider" className="my-3 h-px w-8 shrink-0 bg-border" />}
      {label && (
        <div
          id={labelId}
          data-slot="sidebar-group-label"
          className={collapsed ? "sr-only" : "px-4 text-xs text-muted-foreground"}
        >
          {label}
        </div>
      )}
      <ul className={cn("flex flex-col gap-1", collapsed ? "items-center" : "border-b pb-4")}>{children}</ul>
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

/* ── Items ────────────────────────────────────────────────────────────── */

/**
 * Figma's Notification Badge: an 8px `destructive` dot, with a name for screen
 * readers. Figma's collapsed cells show no dot, so there only the name is
 * kept (`nameOnly`).
 */
function Badge({ label, nameOnly = false }: { label?: string; nameOnly?: boolean }) {
  return (
    <>
      {!nameOnly && (
        <span aria-hidden="true" data-slot="sidebar-badge" className="size-2 shrink-0 rounded-full bg-destructive forced-colors:bg-[Highlight]" />
      )}
      {label ? (
        <span className="sr-only">{label}</span>
      ) : (
        <>
          <span className="sr-only [&:lang(ar)]:hidden">New</span>
          <span className="sr-only hidden [&:lang(ar)]:inline">جديد</span>
        </>
      )}
    </>
  )
}

/**
 * The row both item kinds share: 40px tall, 8px from the highlight's edges,
 * `SM/Regular` text. Default is `sidebar-foreground` on the sidebar; Hover
 * `sidebar-accent`; Selected `sidebar-primary`. A selected row keeps its fill
 * under the pointer. The 1px focus border is inside the padding, hence 7px
 * and 9px.
 */
const rowClasses = (selected: boolean) =>
  cn(
    "flex min-h-10 w-full min-w-0 items-center gap-1 rounded-[var(--radius-sm)] px-[7px] py-[9px] text-start text-sm",
    "transition-[color,background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
    focusRing,
    selected
      ? "bg-sidebar-primary text-sidebar-primary-foreground forced-colors:border-[Highlight]"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  )

/** A link when there is an `href`, the element you pass as `render`, else a button. */
function linkOrButton(href: string | undefined, render: React.ReactElement | undefined) {
  if (render) return render
  return href !== undefined ? <a href={href} /> : <button type="button" />
}

interface ItemLinkProps {
  /** Renders a link to this address. */
  href?: string
  /** Renders this element instead, such as a router's `<Link href="…" />`. */
  render?: React.ReactElement
}

export interface SidebarItemProps
  extends ItemLinkProps,
    Omit<React.HTMLAttributes<HTMLElement>, "children" | "onToggle"> {
  /** The item's text. Collapsed, it is the tooltip and the accessible name. */
  label: React.ReactNode
  /** A 16px icon before the label. Collapsed, the icon is all that shows, so give every item one. */
  icon?: React.ReactNode
  /** Marks the current page: the `sidebar-primary` fill and `aria-current="page"`. Keep it to one item. */
  selected?: boolean
  /** Shows the notification dot at the end of the row. */
  badge?: boolean
  /** The dot's name for screen readers. Default "New", or Arabic under an Arabic `lang`. */
  badgeLabel?: string
  /** Whether its sub-items are showing. Pair with `onOpenChange`. */
  open?: boolean
  /** Starts with its sub-items showing. Default: open when one of them is selected. */
  defaultOpen?: boolean
  /** Called when its sub-items open or close. */
  onOpenChange?: (open: boolean) => void
  /** `SidebarSubItem`s. Given any, the item opens and closes them instead of linking. */
  children?: React.ReactNode
}

function hasSelectedChild(children: React.ReactNode) {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement<{ selected?: boolean }>(child) && child.props.selected === true
  )
}

/**
 * A row in a group. With sub-items it is a disclosure: its chevron points at
 * the end edge closed and up open, and the sub-items ease open under it.
 *
 * Collapsed, it is a 40px icon cell with the library's Tooltip, at its end
 * side, for the label. A cell whose sub-items hold the current page shows as
 * selected. Pressing a cell with sub-items expands the sidebar with them open.
 */
const SidebarItem = React.forwardRef<HTMLElement, SidebarItemProps>(
  (
    {
      label,
      icon,
      selected = false,
      badge = false,
      badgeLabel,
      href,
      render,
      open: openProp,
      defaultOpen,
      onOpenChange,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { collapsed, setCollapsed } = useSidebar()
    const hasSubItems = React.Children.count(children) > 0
    const childSelected = hasSubItems && hasSelectedChild(children)

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? childSelected)
    const open = openProp ?? uncontrolledOpen
    const setOpen = (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    }

    const iconSlot = icon && (
      <span aria-hidden="true" data-slot="sidebar-item-icon" className="flex shrink-0 [&_svg]:size-4 [&_svg]:shrink-0">
        {icon}
      </span>
    )

    if (collapsed) {
      const current = selected || childSelected
      return (
        <li data-slot="sidebar-item" className="flex">
          <Tooltip>
            <TooltipTrigger
              ref={ref as React.Ref<HTMLButtonElement>}
              render={hasSubItems ? <button type="button" /> : linkOrButton(href, render)}
              aria-current={current && !hasSubItems ? "page" : undefined}
              data-selected={current ? "" : undefined}
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                onClick?.(event)
                if (hasSubItems && !event.defaultPrevented) {
                  setOpen(true)
                  setCollapsed(false)
                }
              }}
              className={cn(
                "relative flex size-10 items-center justify-center",
                "transition-[color,background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
                focusRing,
                current
                  ? "bg-sidebar-primary text-sidebar-primary-foreground forced-colors:border-[Highlight]"
                  : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                className
              )}
              {...props}
            >
              {iconSlot}
              <span className="sr-only">{label}</span>
              {badge && <Badge label={badgeLabel} nameOnly />}
            </TooltipTrigger>
            <TooltipContent side="inline-end">{label}</TooltipContent>
          </Tooltip>
        </li>
      )
    }

    const body = (
      <>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {iconSlot}
          <span data-slot="sidebar-item-label" className="min-w-0 flex-1 [overflow-wrap:anywhere]">
            {label}
          </span>
        </span>
        {hasSubItems && (
          <ChevronRightIcon
            aria-hidden="true"
            data-slot="sidebar-item-chevron"
            strokeWidth={1.5}
            className={cn(
              "size-4 shrink-0 transition-transform [&:dir(rtl)]:-scale-x-100",
              motion,
              open && "-rotate-90 [&:dir(rtl)]:rotate-90"
            )}
          />
        )}
        {badge && <Badge label={badgeLabel} />}
      </>
    )

    if (hasSubItems) {
      return (
        <Collapsible.Root
          open={open}
          onOpenChange={setOpen}
          render={<li data-slot="sidebar-item" className="flex flex-col px-4" />}
        >
          <Collapsible.Trigger
            ref={ref as React.Ref<HTMLButtonElement>}
            className={cn(rowClasses(selected), className)}
            onClick={onClick}
            {...props}
          >
            {body}
          </Collapsible.Trigger>
          <Collapsible.Panel
            data-slot="sidebar-sub-items"
            className={cn(
              // The list's own 4px above and below is room for the focus halo,
              // which the clip would cut; the bottom 4px is taken back with a
              // margin, so the next item stays the usual 4px away.
              "-mb-1 h-[var(--collapsible-panel-height)] overflow-y-clip overflow-x-visible transition-[height,margin]",
              motion,
              "data-[ending-style]:mb-0 data-[starting-style]:mb-0 data-[ending-style]:h-0 data-[starting-style]:h-0"
            )}
          >
            <ul className="flex flex-col py-1">{children}</ul>
          </Collapsible.Panel>
        </Collapsible.Root>
      )
    }

    return (
      <li data-slot="sidebar-item" className="flex px-4">
        <ItemElement
          ref={ref}
          href={href}
          render={render}
          selected={selected}
          className={cn(rowClasses(selected), className)}
          onClick={onClick}
          {...props}
        >
          {body}
        </ItemElement>
      </li>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

/** The link or button of an item, merged through Base UI's `useRender`. */
const ItemElement = React.forwardRef<
  HTMLElement,
  ItemLinkProps & { selected: boolean } & React.HTMLAttributes<HTMLElement>
>(({ href, render, selected, ...props }, ref) =>
  useRender({
    render: linkOrButton(href, render),
    ref,
    props: {
      ...props,
      "aria-current": selected ? "page" : undefined,
      "data-selected": selected ? "" : undefined,
    },
  })
)
ItemElement.displayName = "SidebarItemElement"

export interface SidebarSubItemProps extends ItemLinkProps, Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The sub-item's text. */
  label: React.ReactNode
  /** Marks the current page. Its parent item opens to show it, and shows as selected when collapsed. */
  selected?: boolean
  /** Shows the notification dot at the end of the row. */
  badge?: boolean
  /** The dot's name for screen readers. Default "New", or Arabic under an Arabic `lang`. */
  badgeLabel?: string
}

/**
 * A nested row under a `SidebarItem` (Figma `Sub-item=True`): no icon, 32px
 * in from the start with a 1px `border` line 16px before the label's
 * highlight. The lines of a run of sub-items join into one rail.
 */
const SidebarSubItem = React.forwardRef<HTMLElement, SidebarSubItemProps>(
  ({ label, selected = false, badge = false, badgeLabel, href, render, className, ...props }, ref) => (
    <li data-slot="sidebar-sub-item" className="flex ps-4">
      <div className="flex min-w-0 flex-1 border-s ps-4">
        <ItemElement
          ref={ref}
          href={href}
          render={render}
          selected={selected}
          className={cn(rowClasses(selected), className)}
          {...props}
        >
          <span data-slot="sidebar-item-label" className="min-w-0 flex-1 [overflow-wrap:anywhere]">
            {label}
          </span>
          {badge && <Badge label={badgeLabel} />}
        </ItemElement>
      </div>
    </li>
  )
)
SidebarSubItem.displayName = "SidebarSubItem"

/* ── Plan card ────────────────────────────────────────────────────────── */

export interface SidebarPlanCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The plan's name, such as "Pro Plan". */
  title: React.ReactNode
  /** A line under it, such as "3 team members". */
  description?: React.ReactNode
  /** The line under the divider, such as "Next renewal: 10 Mar". */
  footer?: React.ReactNode
  /** A 16px icon before `footer`. */
  footerIcon?: React.ReactNode
}

/**
 * Figma's optional Plan card (`Plan card=True`, off by default): a `card`
 * panel at the foot of the body, above the footer. Render it to show it; it
 * hides itself while the sidebar is collapsed.
 */
const SidebarPlanCard = React.forwardRef<HTMLDivElement, SidebarPlanCardProps>(
  ({ title, description, footer, footerIcon, className, ...props }, ref) => {
    const { collapsed } = useSidebar()
    if (collapsed) return null
    return (
      <div data-slot="sidebar-plan-card" className="shrink-0 px-4 pb-4 pt-2">
        <div
          ref={ref}
          className={cn("flex flex-col gap-2 rounded-[var(--radius-md)] border bg-card p-4 text-card-foreground", className)}
          {...props}
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {footer && (
            <div className="flex items-center gap-1 border-t pt-2 text-xs font-medium text-muted-foreground">
              {footerIcon && (
                <span aria-hidden="true" className="flex shrink-0 [&_svg]:size-4">
                  {footerIcon}
                </span>
              )}
              <span className="min-w-0 flex-1">{footer}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
SidebarPlanCard.displayName = "SidebarPlanCard"

/* ── Footer ───────────────────────────────────────────────────────────── */

export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>

/** The foot of the sidebar, for a `SidebarProfile`: 8px round it, 12px above and below collapsed. */
const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar()
  return (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn("shrink-0", collapsed ? "flex justify-center py-3" : "p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export interface SidebarProfileProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The person's name. Collapsed, it is the button's accessible name. */
  name: string
  /** A line under the name, such as the workspace. */
  description?: React.ReactNode
  /** The Avatar, at 32px. Its name defaults to `name`. */
  avatar?: Omit<AvatarProps, "size">
}

/**
 * Figma's Sidebar Profile: the avatar, the name and a line under it, and
 * Lucide's `chevrons-up-down` (24px), in a bordered 10px-radius box. It is a
 * button, so it can open an account menu: pass it as a menu trigger's
 * `render`. Collapsed, only the avatar shows.
 */
const SidebarProfile = React.forwardRef<HTMLButtonElement, SidebarProfileProps>(
  ({ name, description, avatar, className, type = "button", ...props }, ref) => {
    const { collapsed } = useSidebar()
    // Figma binds the avatar's corners to `border radius/lg`, as the box's.
    // Hidden from screen readers: the name beside it (or, collapsed, the
    // button's own name) already says who it is, and the Avatar still gets the
    // name for its initials.
    const avatarNode = (
      <span aria-hidden="true" className="flex shrink-0">
        <Avatar {...avatar} name={avatar?.name ?? name} size="32" className="[&>span:first-child]:rounded-lg" />
      </span>
    )

    if (collapsed) {
      return (
        <button
          ref={ref}
          type={type}
          data-slot="sidebar-profile"
          // -m-px: the transparent focus border sits outside the avatar's 32px.
          className={cn("-m-px flex rounded-lg", focusRing, className)}
          {...props}
        >
          {avatarNode}
          <span className="sr-only">{name}</span>
        </button>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        data-slot="sidebar-profile"
        className={cn(
          "flex w-full min-w-0 items-center gap-2 rounded-lg border bg-sidebar px-3 py-2 text-start [outline:none]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "focus-visible:forced-colors:[outline:2px_solid_Highlight] forced-colors:[outline-offset:2px]",
          className
        )}
        {...props}
      >
        {avatarNode}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm text-foreground [overflow-wrap:anywhere]">{name}</span>
          {description && <span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">{description}</span>}
        </span>
        <ChevronsUpDownIcon aria-hidden="true" className="size-6 shrink-0 text-foreground" strokeWidth={1.5} />
      </button>
    )
  }
)
SidebarProfile.displayName = "SidebarProfile"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarSubItem,
  SidebarPlanCard,
  SidebarFooter,
  SidebarProfile,
  useSidebar,
}

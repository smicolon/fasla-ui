import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { ChevronRightIcon, EllipsisIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Breadcrumbs` (3771:68266), 32 variants: Direction × Style × Count,
 * plus a `Has-Icon` boolean.
 *
 * Composable, as shadcn's Breadcrumb is: the developer writes the trail, so
 * there is no `count` prop. Figma axis → code:
 *  - `Count` 2 / 3 / 4 → that many `BreadcrumbItem`s. `+4` is the collapsed
 *    trail: the first item, `BreadcrumbEllipsis`, then the last two.
 *  - `Style` Default → the chevron `BreadcrumbSeparator` draws on its own.
 *    Custom Separator → `<BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>`.
 *    With Badge and Outline Badge are compositions: a Soft or Outline `Badge`
 *    inside each link and the page, not variants of this component.
 *  - `Has-Icon` → the `icon` prop on `BreadcrumbLink` and `BreadcrumbPage`.
 *  - `Direction` → the page's `dir`, never a prop. The row is in DOM order,
 *    so `dir="rtl"` mirrors it, and the one chevron is flipped in CSS. The
 *    flip reads the chevron's own direction (`:dir(rtl)`), not Tailwind's
 *    `rtl:`, which matches any `dir="rtl"` ancestor: an English island on an
 *    Arabic page would get a backwards chevron.
 *
 * Measurements, all Figma's: a 10px gap (`spacing/2,5`) between items and
 * separators, 4px (`spacing/1`) between an icon and its label, 14px icons,
 * separators and ellipsis. Labels are `text-sm`, so the type ramp gives
 * Arabic its 24px line (English 20px) with no RTL class here.
 *
 * Colours, all bound in Figma: links `muted-foreground`, the current page
 * `foreground`, and every icon, separator and the ellipsis `foreground`.
 */

/** Sizes any SVG icon passed in to Figma's 14px glyph, with its 1.5 stroke at that size. */
const ICON = "[&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:[stroke-width:1.5]"

/** The navigation landmark. Name it in the page's language with `aria-label`. */
const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  ({ "aria-label": ariaLabel = "Breadcrumb", ...props }, ref) => (
    <nav ref={ref} aria-label={ariaLabel} data-slot="breadcrumb" {...props} />
  )
)
Breadcrumb.displayName = "Breadcrumb"

/**
 * The trail, an ordered list. It wraps onto a second line when it runs out
 * of room, rather than overflowing, and a label too long for one line breaks.
 */
const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 break-words text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

/** One step of the trail: a link, the current page or the ellipsis. */
const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} data-slot="breadcrumb-item" className={cn("inline-flex min-w-0 items-center", className)} {...props} />
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

/**
 * The leading icon — Figma's `Has-Icon`. One text line tall, so it stays on
 * the first line of a label that wraps; decorative, so hidden from assistive
 * technology.
 */
const ItemIcon = ({ children }: { children: React.ReactNode }) => (
  <span aria-hidden="true" data-slot="breadcrumb-icon" className={cn("inline-flex h-[1lh] shrink-0 items-center self-start text-foreground", ICON)}>
    {children}
  </span>
)

/** The parts the link and the page share: the icon slot and the 4px gap. */
const item = "inline-flex min-w-0 items-center gap-1"

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  /**
   * Render the child element — a router's `Link`, say — as the link, with
   * these styles and props merged onto it.
   */
  asChild?: boolean
  /**
   * Leading icon (Figma `Has-Icon`). Sized to 14px and coloured with
   * `currentColor` on `foreground`, so pass an SVG icon with no size or
   * colour of its own. Decorative: hidden from assistive technology.
   */
  icon?: React.ReactNode
}

/** A step the reader can go back to. */
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild = false, icon, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn(
          item,
          // Colour and opacity, so a link that wraps a dimmed Badge fades up on hover too.
          "rounded-[var(--radius-sm)] text-muted-foreground transition-[color,opacity] duration-150 hover:text-foreground motion-reduce:transition-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className
        )}
        {...props}
      >
        {icon && <ItemIcon>{icon}</ItemIcon>}
        <Slottable>{children}</Slottable>
      </Comp>
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

export interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Leading icon (Figma `Has-Icon`), as on `BreadcrumbLink`. */
  icon?: React.ReactNode
}

/** The page the reader is on: the last step, not a link, marked `aria-current="page"`. */
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ icon, className, children, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn(item, "text-foreground", className)}
      {...props}
    >
      {icon && <ItemIcon>{icon}</ItemIcon>}
      {children}
    </span>
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

/**
 * The mark between two steps. A chevron by default, pointing along the
 * trail: right in LTR, left in RTL. Pass any icon as the child to replace it,
 * a `SlashIcon` for Figma's Custom Separator; it is sized to 14px the same
 * way. Hidden from assistive technology: the list already says where one
 * step ends.
 */
const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn("inline-flex shrink-0 items-center text-foreground", ICON, className)}
      {...props}
    >
      {children ?? <ChevronRightIcon className="[&:dir(rtl)]:-scale-x-100" />}
    </li>
  )
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

/**
 * Where collapsed steps would be. The glyph is hidden; screen readers hear
 * "More", or "المزيد" under an Arabic `lang`, so they know the trail is
 * shortened. To reach the hidden steps, put it inside a
 * `DropdownMenuTrigger` that opens a menu of them, as links.
 */
const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      className={cn("inline-flex size-3.5 shrink-0 items-center justify-center text-foreground", ICON, className)}
      {...props}
    >
      <EllipsisIcon aria-hidden="true" />
      {/*
       * Both runs are rendered and CSS keeps the one that matches the nearest
       * `lang`, as Badge's close label does: right in the server HTML before
       * any script runs, and it follows a live language change.
       */}
      <span className="sr-only [&:lang(ar)]:hidden">More</span>
      <span className="sr-only hidden [&:lang(ar)]:inline">المزيد</span>
    </span>
  )
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "lucide-react"
import { Button, type ButtonProps } from "../button/button"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Pagination` (400:6808), 48 variants: Direction × size ×
 * Variants × Shape, plus the `Next - Pre button` and `Next - Pre icon button`
 * booleans; and `Pagination Ellipsis` (46207:243282), one per size.
 *
 * Composable, with shadcn's part names. Figma axis → code:
 *  - `Variants` Default / Solid / Outlined → `variant` on `Pagination`.
 *  - `Shape` Square / Rounded → `shape`: Button's `standard` and `rounded` radius.
 *  - `size` xs / sm / md / lg → `size`. Figma's default is xs, the smallest;
 *    the code's is md, as on Button and Input.
 *  - `Next - Pre button` → `PaginationPrevious` and `PaginationNext`, a label
 *    and a chevron. `Next - Pre icon button` → the same parts with `iconOnly`.
 *  - `Direction` → the page's `dir`, never a prop. The row is in DOM order,
 *    so `dir="rtl"` mirrors it, and each chevron flips to point outward. The
 *    flip reads the chevron's own direction (`:dir(rtl)`), not Tailwind's
 *    `rtl:`, which matches any `dir="rtl"` ancestor.
 *
 * Every link, Previous and Next is Fasla's Button, so the colours, states,
 * focus ring and radius are the Button's own; nothing is restyled here. Each
 * `variant` is Figma's choice of Button Type, all in the Primary style:
 *
 *   variant    pages     current page   Previous / Next
 *   default    Ghost     Solid          Ghost
 *   solid      Soft      Solid          Ghost
 *   outlined   Outline   Soft           Outline
 *
 * Page links are Icon Buttons with a number in place of the icon: Figma's
 * `Tailwind En/SM/Medium`, 14px at every size. Every gap is `spacing/1`, 4px.
 */

type PaginationVariant = "default" | "solid" | "outlined"
type PaginationShape = "square" | "rounded"
type PaginationSize = "xs" | "sm" | "md" | "lg"

type Look = { variant: NonNullable<ButtonProps["variant"]>; tone: NonNullable<ButtonProps["tone"]> }
const GHOST: Look = { variant: "ghost", tone: "primary" }
const SOLID: Look = { variant: "default", tone: "primary" }
const SOFT: Look = { variant: "soft", tone: "primary" }
const OUTLINE: Look = { variant: "outline", tone: "primary" }

const LOOKS: Record<PaginationVariant, { page: Look; current: Look; step: Look }> = {
  default: { page: GHOST, current: SOLID, step: GHOST },
  solid: { page: SOFT, current: SOLID, step: GHOST },
  outlined: { page: OUTLINE, current: SOFT, step: OUTLINE },
}

const RADIUS = { square: "standard", rounded: "rounded" } as const

/**
 * Windows high contrast drops every fill, so the current page would look like
 * the others. It takes the system's selection colours instead, as a selected
 * item does in a native list.
 */
const CURRENT_IN_FORCED_COLORS = [
  "forced-colors:aria-[current=page]:[forced-color-adjust:none]",
  "forced-colors:aria-[current=page]:bg-none",
  "forced-colors:aria-[current=page]:bg-[color:Highlight]",
  "forced-colors:aria-[current=page]:text-[color:HighlightText]",
].join(" ")

/** Icon Button's square at each size: 26, 32, 36 and 40px. */
const BOX: Record<PaginationSize, string> = {
  xs: "size-[1.625rem]",
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
}

type PaginationContextValue = { variant: PaginationVariant; shape: PaginationShape; size: PaginationSize }

const PaginationContext = React.createContext<PaginationContextValue>({
  variant: "default",
  shape: "square",
  size: "md",
})

export interface PaginationProps extends React.ComponentPropsWithoutRef<"nav"> {
  /**
   * Figma `Variants`. `default`: Ghost pages and a Solid current page.
   * `solid`: Soft pages and a Solid current page. `outlined`: Outline pages
   * and a Soft current page, with Outline Previous and Next.
   */
  variant?: PaginationVariant
  /** Figma `Shape`: `square` is Button's standard radius, `rounded` its full radius. */
  shape?: PaginationShape
  /** Figma `size`: the Button size of every part, 26, 32, 36 or 40px tall. */
  size?: PaginationSize
}

/**
 * The navigation landmark, and the look every part inside it takes. Name it
 * in the page's language with `aria-label`.
 */
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ variant = "default", shape = "square", size = "md", "aria-label": ariaLabel = "Pagination", className, ...props }, ref) => {
    const look = React.useMemo(() => ({ variant, shape, size }), [variant, shape, size])
    return (
      <PaginationContext.Provider value={look}>
        <nav
          ref={ref}
          aria-label={ariaLabel}
          data-slot="pagination"
          data-variant={variant}
          data-shape={shape}
          data-size={size}
          className={cn("mx-auto flex w-full justify-center", className)}
          {...props}
        />
      </PaginationContext.Provider>
    )
  }
)
Pagination.displayName = "Pagination"

/**
 * The row of items, a list. It wraps onto a second row when it runs out of
 * room, rather than overflowing its container.
 */
const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="pagination-content"
      className={cn("flex flex-row flex-wrap items-center justify-center gap-1", className)}
      {...props}
    />
  )
)
PaginationContent.displayName = "PaginationContent"

/** One entry of the row: a page link, Previous, Next or the ellipsis. */
const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} data-slot="pagination-item" className={cn("inline-flex", className)} {...props} />
  )
)
PaginationItem.displayName = "PaginationItem"

interface PaginationAnchorProps extends React.ComponentPropsWithoutRef<"a"> {
  /**
   * Render the child element — a router's `Link`, or a `<button>` for
   * pagination driven by `onClick` — with these styles and props merged onto it.
   */
  asChild?: boolean
  /**
   * Dims the item and takes it out of use: it is marked `aria-disabled`,
   * leaves the tab order, and ignores clicks.
   */
  disabled?: boolean
}

export interface PaginationLinkProps extends PaginationAnchorProps {
  /** The page the reader is on. Marks it `aria-current="page"` and draws it in the current-page look. */
  isActive?: boolean
}

/**
 * Warns, in development only, when a link has nowhere to go: an `<a>` with no
 * `href` is not a link, so the keyboard skips it and screen readers do not
 * announce it as one. Checked once, after the first paint, as Button checks
 * an icon button's name.
 */
function useHrefCheck(part: string, { href, asChild, disabled }: PaginationAnchorProps) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || asChild || disabled || href !== undefined) return
    console.warn(
      `[fasla-ui] ${part}: give it an href, or use asChild with a <button> (or a router's Link) when paging changes state.`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * A link to one page. Its text is the page number: write Western digits
 * (1, 2, 3) on Arabic pages too.
 */
const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ isActive = false, asChild = false, disabled, className, children, ...props }, ref) => {
    const { variant, shape, size } = React.useContext(PaginationContext)
    const look = LOOKS[variant][isActive ? "current" : "page"]
    useHrefCheck("PaginationLink", { href: props.href, asChild, disabled })
    return (
      <Button
        asChild
        variant={look.variant}
        tone={look.tone}
        size={`icon-${size}`}
        radius={RADIUS[shape]}
        disabled={disabled}
        // Button types its props for a <button>; these land on the anchor or
        // the slotted child, which takes them.
        {...(props as ButtonProps)}
        ref={ref as React.Ref<HTMLButtonElement>}
        data-slot="pagination-link"
        data-active={isActive || undefined}
        aria-current={isActive ? "page" : undefined}
        // The number is 14px at every size, as in Figma. The box is Icon
        // Button's square; a number too wide for it (100 at xs) widens it by
        // its own width plus 4px a side, instead of touching the edges.
        className={cn("min-w-fit px-1 text-sm tabular-nums", CURRENT_IN_FORCED_COLORS, className)}
      >
        {asChild ? children : <a>{children}</a>}
      </Button>
    )
  }
)
PaginationLink.displayName = "PaginationLink"

/**
 * Text that follows the language of the page: English, or Arabic under an
 * Arabic `lang`. Both runs are rendered and CSS keeps the one that matches the
 * nearest `lang`, as Breadcrumb's ellipsis label does: right in the server
 * HTML before any script runs, and it follows a live language change. The
 * hidden run is `display: none`, so it is neither seen nor read.
 */
const Localised = ({ en, ar }: { en: string; ar: string }) => (
  <>
    <span className="[&:lang(ar)]:hidden">{en}</span>
    <span className="hidden [&:lang(ar)]:inline">{ar}</span>
  </>
)

export interface PaginationStepProps extends PaginationAnchorProps {
  /**
   * The label. Defaults to the page's language: "Previous" / "Next", or
   * "السابق" / "التالي" under an Arabic `lang`.
   */
  text?: React.ReactNode
  /**
   * Figma `Next - Pre icon button`: the chevron alone, in Icon Button's
   * square. The label is kept for screen readers.
   */
  iconOnly?: boolean
}

/** Previous and Next: the same Button, its label and chevron in reading order. */
function useStep(
  step: "previous" | "next",
  { text, iconOnly = false, asChild = false, disabled, className, children, ...props }: PaginationStepProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const { variant, shape, size } = React.useContext(PaginationContext)
  const look = LOOKS[variant].step
  useHrefCheck(step === "previous" ? "PaginationPrevious" : "PaginationNext", { href: props.href, asChild, disabled })
  // lucide's left chevron for Previous, flipped in RTL so each points outward,
  // the way the row reads.
  const Chevron = step === "previous" ? ChevronLeftIcon : ChevronRightIcon
  const chevron = <Chevron aria-hidden="true" strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
  const label =
    text ?? (step === "previous" ? <Localised en="Previous" ar="السابق" /> : <Localised en="Next" ar="التالي" />)
  const content = (
    <>
      {step === "previous" && chevron}
      {iconOnly ? <span className="sr-only">{label}</span> : label}
      {step === "next" && chevron}
    </>
  )
  return (
    <Button
      asChild
      variant={look.variant}
      tone={look.tone}
      size={iconOnly ? `icon-${size}` : size}
      radius={RADIUS[shape]}
      disabled={disabled}
      {...(props as ButtonProps)}
      ref={ref as React.Ref<HTMLButtonElement>}
      data-slot={`pagination-${step}`}
      className={className}
    >
      {/* With asChild, the child supplies the element and this the content. */}
      {asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? (
        React.cloneElement(children, undefined, content)
      ) : (
        <a>{content}</a>
      )}
    </Button>
  )
}

/** A link to the page before this one. */
const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationStepProps>((props, ref) =>
  useStep("previous", props, ref)
)
PaginationPrevious.displayName = "PaginationPrevious"

/** A link to the page after this one. */
const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationStepProps>((props, ref) =>
  useStep("next", props, ref)
)
PaginationNext.displayName = "PaginationNext"

/**
 * Where pages are left out. Not interactive: Icon Button's square at each
 * size, with the 16px glyph in `primary`. The glyph is hidden; screen readers
 * hear "More pages", or "مزيد من الصفحات" under an Arabic `lang`.
 */
const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(PaginationContext)
    return (
      <span
        ref={ref}
        data-slot="pagination-ellipsis"
        // `relative` keeps the absolutely placed screen-reader text inside the
        // ellipsis: without it, in a row that scrolls, the text escapes and
        // widens the page.
        className={cn("relative inline-flex shrink-0 items-center justify-center text-primary", BOX[size], className)}
        {...props}
      >
        <EllipsisIcon aria-hidden="true" strokeWidth={1.5} className="size-4" />
        <span className="sr-only">
          <Localised en="More pages" ar="مزيد من الصفحات" />
        </span>
      </span>
    )
  }
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

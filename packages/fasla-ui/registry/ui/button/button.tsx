"use client"

import * as React from "react"
import { LoaderCircleIcon } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/**
 * Built against the Figma `Button` set (307:333, 1,200 variants) and `Icon
 * Button` set (3615:13506, 480 variants): Type × Style × Size × State × Radius,
 * plus Direction on Button. Every colour below is the token the sets bind.
 *
 * `variant` keeps shadcn's names, each pinned to one Figma Type and Style, and
 * adds Figma's Soft. `tone` reaches the other Styles of a Type, so
 * `variant="outline" tone="destructive"` is Outline/Destructive.
 *
 * The icon sizes are Figma's Icon Button: the same Types, Styles and states,
 * square, with one 16px icon and no label.
 *
 * Direction is not a prop. The row is a plain flex row in DOM order, so
 * `dir="rtl"` on the page mirrors it into Figma's RTL variant, and the type
 * ramp re-leads the label to Cairo's line on its own.
 */

type Variant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "soft"
type Tone = "primary" | "secondary" | "destructive"
type Size = "xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"
type Radius = "standard" | "rounded"

/** Each shadcn variant is one Figma Type, in the Style that matches its name. */
const TYPE = {
  default: "solid",
  secondary: "solid",
  destructive: "solid",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  soft: "soft",
} as const

const DEFAULT_TONE: Record<Variant, Tone> = {
  default: "primary",
  secondary: "secondary",
  destructive: "destructive",
  outline: "secondary",
  ghost: "secondary",
  link: "primary",
  soft: "primary",
}

// Figma stacks a second, translucent fill on the first for Clicked (and for
// Soft in every state). A one-colour gradient is that second fill: it paints
// over the background colour without replacing it.
const PRESSED_OVERLAY = "active:bg-gradient-to-r active:from-soft-primary active:to-soft-primary"

const styles = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap font-medium",
    "transition-[color,background-color,opacity] duration-150 motion-reduce:transition-none",
    // Figma's Focus ring: a 2px band in `ring`, from 2px to 4px outside the
    // button, with the gap left clear. Its own layer, so it never competes
    // with Outline's inset ring and draws the same in Tailwind 3 and 4.
    "[outline:none] after:pointer-events-none after:absolute after:-inset-1 after:opacity-0 after:ring-2 after:ring-inset after:ring-ring focus-visible:after:opacity-100",
    // Windows high contrast drops fills and box-shadows, so the ring and every
    // fill vanish. The system border keeps the button's edge, and a system
    // outline marks focus. (`[outline:none]`, not `outline-none`: Tailwind 3's
    // version is a transparent outline that forced colours paints visibly.)
    "forced-colors:border forced-colors:border-[ButtonText] forced-colors:focus-visible:[outline:2px_solid_Highlight] forced-colors:focus-visible:[outline-offset:2px]",
    // Disabled is the Enabled look at half opacity, in every Type.
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      type: {
        // Hover and Clicked fade the whole button, as in Figma.
        solid: "",
        // `card` underneath, the tint on top — Figma's two fills.
        soft: "bg-card bg-gradient-to-r",
        // Figma's stroke is 1px INSIDE, so the button is the same size as
        // Solid. An inset ring draws exactly that; a border would push the
        // label in by 1px.
        outline: "bg-background shadow-sm ring-1 ring-inset",
        ghost: "",
        // Always underlined, so a link reads as one at rest and on touch
        // screens. Hover and Clicked fade it like Solid.
        link: "underline hover:opacity-90 active:opacity-80 forced-colors:border-0",
      },
      tone: {
        primary: "",
        secondary: "",
        destructive: "",
      },
      size: {
        // 26px has no Tailwind step; it is Figma's xs height.
        xs: "h-[1.625rem] gap-1.5 px-2 text-xs",
        sm: "h-8 gap-1.5 px-3 text-sm",
        default: "h-9 gap-2 px-4 text-sm",
        lg: "h-10 gap-2 px-6 text-sm",
        "icon-xs": "size-[1.625rem]",
        "icon-sm": "size-8",
        icon: "size-9",
        "icon-lg": "size-10",
      },
      radius: {
        // Figma `border radius/md`. No class is 8px in both apps. The ring's
        // outer edge is 4px further out, so 4px rounder (Figma `border
        // radius/lg` on its inner edge).
        standard: "rounded-[var(--radius-md)] after:rounded-[calc(var(--radius-md)+4px)]",
        rounded: "rounded-full after:rounded-full",
      },
    },
    compoundVariants: [
      { type: "solid", tone: "primary", class: "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80" },
      // Secondary is the one Solid that tints on Clicked instead of fading.
      {
        type: "solid",
        tone: "secondary",
        class: `bg-secondary text-secondary-foreground hover:opacity-90 active:opacity-100 ${PRESSED_OVERLAY}`,
      },
      {
        type: "solid",
        tone: "destructive",
        class: "bg-destructive text-destructive-foreground hover:opacity-90 active:opacity-80",
      },

      {
        type: "soft",
        tone: "primary",
        class:
          "from-soft-primary to-soft-primary text-primary hover:from-soft-primary-20 hover:to-soft-primary-20 active:from-soft-primary-30 active:to-soft-primary-30",
      },
      {
        type: "soft",
        tone: "secondary",
        class:
          "from-soft-secondary to-soft-secondary text-secondary-foreground hover:from-soft-secondary-20 hover:to-soft-secondary-20 active:from-soft-secondary-30 active:to-soft-secondary-30",
      },
      {
        type: "soft",
        tone: "destructive",
        class:
          "from-soft-destructive to-soft-destructive text-destructive hover:from-soft-destructive-20 hover:to-soft-destructive-20 active:from-soft-destructive-30 active:to-soft-destructive-30",
      },

      {
        type: "outline",
        tone: "primary",
        class: `text-primary ring-primary hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground ${PRESSED_OVERLAY}`,
      },
      {
        type: "outline",
        tone: "secondary",
        class: `text-foreground ring-border hover:bg-secondary active:bg-secondary ${PRESSED_OVERLAY}`,
      },
      // Destructive swaps its background for the tint, as Figma does.
      {
        type: "outline",
        tone: "destructive",
        class: "text-destructive ring-destructive hover:bg-soft-destructive active:bg-soft-destructive-20",
      },

      {
        type: "ghost",
        tone: "primary",
        class: `text-primary hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground ${PRESSED_OVERLAY}`,
      },
      { type: "ghost", tone: "secondary", class: `text-foreground hover:bg-accent active:bg-accent ${PRESSED_OVERLAY}` },
      { type: "ghost", tone: "destructive", class: "text-destructive hover:bg-soft-destructive active:bg-soft-destructive-20" },

      { type: "link", tone: "primary", class: "text-primary" },
      { type: "link", tone: "secondary", class: "text-secondary-foreground" },
      { type: "link", tone: "destructive", class: "text-destructive" },
    ],
    defaultVariants: {
      type: "solid",
      tone: "primary",
      size: "default",
      radius: "standard",
    },
  }
)

type ButtonVariantOptions = {
  variant?: Variant | null
  tone?: Tone | null
  size?: Size | null
  radius?: Radius | null
  className?: string
}

/**
 * The button's classes, for styling another element as a button — a link,
 * say. Takes the same `variant`, `tone`, `size` and `radius` as `Button`.
 */
function buttonVariants({ variant, tone, size, radius, className }: ButtonVariantOptions = {}) {
  const v = variant ?? "default"
  return cn(styles({ type: TYPE[v], tone: tone ?? DEFAULT_TONE[v], size, radius }), className)
}

const ICON_SIZES = new Set<Size>(["icon-xs", "icon-sm", "icon", "icon-lg"])

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Figma `Type`, by shadcn's names: `default`, `secondary` and `destructive`
   * are Solid; `outline`, `ghost`, `link` and `soft` are the other four.
   */
  variant?: Variant
  /**
   * Figma `Style`. Each variant has its own default: Primary for `default`,
   * `link` and `soft`, Secondary for `secondary`, `outline` and `ghost`,
   * Destructive for `destructive`.
   */
  tone?: Tone
  /**
   * Figma `Size`: `xs` 26px, `sm` 32px, `default` 36px (Figma's md), `lg`
   * 40px. The `icon-*` sizes are Icon Button, square at the same heights, and
   * need an accessible name — `aria-label` or visually hidden text.
   */
  size?: Size
  /** Figma `Radius`: `standard` is `border radius/md`, `rounded` is a pill. */
  radius?: Radius
  /** Renders its only child instead of a `<button>`, with the button's styles. */
  asChild?: boolean
  /** Shows a spinner, disables the button and announces `loadingLabel`. */
  loading?: boolean
  /** Screen-reader text announced while loading */
  loadingLabel?: string
}

/** Warns, in development only, when an icon-only button has no accessible name. */
function useIconButtonNameCheck(ref: React.RefObject<HTMLElement | null>, isIcon: boolean) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || !isIcon) return
    const el = ref.current
    if (!el) return
    const named =
      el.getAttribute("aria-label")?.trim() ||
      el.getAttribute("aria-labelledby")?.trim() ||
      el.getAttribute("title")?.trim() ||
      el.textContent?.trim()
    if (!named) {
      console.warn(
        "[fasla-ui] Button: an icon-only button needs an accessible name. Add aria-label, or text inside the button (it can be visually hidden)."
      )
    }
    // Checked once, after the first paint: a warning per re-render would bury
    // the console without saying anything new.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      tone,
      size = "default",
      radius = "standard",
      asChild = false,
      loading = false,
      loadingLabel = "Loading",
      children,
      disabled,
      onClickCapture,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isIcon = ICON_SIZES.has(size)
    const inactive = Boolean(disabled || loading)

    const innerRef = React.useRef<HTMLButtonElement | null>(null)
    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )
    useIconButtonNameCheck(innerRef, isIcon)

    return (
      <Comp
        ref={setRef}
        data-slot="button"
        data-variant={variant}
        data-tone={tone ?? DEFAULT_TONE[variant]}
        data-size={size}
        className={buttonVariants({ variant, tone, size, radius, className })}
        // A link or other non-button child can't be `disabled`. It is marked
        // with aria-disabled instead, which the same styles respond to, and
        // taken out of the tab order so Enter can't follow it either.
        disabled={asChild ? undefined : inactive}
        aria-disabled={asChild && inactive ? true : undefined}
        tabIndex={asChild && inactive ? -1 : undefined}
        aria-busy={loading || undefined}
        // Blocked in the capture phase: Slot runs the child's own onClick
        // before the button's, so a bubble-phase guard would come too late.
        onClickCapture={
          asChild && inactive
            ? (event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                event.stopPropagation()
              }
            : onClickCapture
        }
        {...props}
      >
        {loading && !asChild ? (
          <>
            <LoaderCircleIcon aria-hidden="true" className="animate-spin motion-reduce:animate-none" strokeWidth={1.5} />
            {/* A status, so it is announced even when aria-label names the button. */}
            <span role="status" className="sr-only">
              {loadingLabel}
            </span>
            {/* An icon button has room for one glyph: the spinner replaces it. */}
            {!isIcon && children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

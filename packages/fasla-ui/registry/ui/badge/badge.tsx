"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/**
 * Built against the Figma `Badge` set (326:2134): Type × Tone × Size × Radius ×
 * Direction × Stats, 432 variants. Every colour below is the token the set binds.
 *
 * Direction is not a prop. The row is a plain flex row in DOM order — icon,
 * avatar, label, close — so `dir="rtl"` on the page mirrors it into Figma's RTL
 * order (close, label, avatar, icon) with no RTL-specific class, and the type
 * ramp re-leads `text-xs` to Cairo's 20px line on its own.
 *
 * Heights are minimums, not fixed. Figma pins md and lg to 22 and 26px, which
 * holds English (a 16px line) but squeezes Arabic's 20px line into md's padding.
 * Here RTL is allowed to grow: 24 / 24 / 28px against LTR's 20 / 22 / 26px.
 */
const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center whitespace-nowrap text-xs font-medium",
  {
    variants: {
      variant: {
        solid: "",
        // Figma stacks two fills: `card` underneath, the translucent tint on
        // top. Doing the same keeps the chip opaque and identical on any
        // surface, rather than letting whatever is behind it show through.
        soft: "bg-card bg-gradient-to-r",
        // Figma's stroke is 1px INSIDE, so the badge is the same size as Solid.
        // An inset ring draws exactly that; a border would add 2px.
        outline: "ring-1 ring-inset",
      },
      tone: {
        primary: "",
        secondary: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
      },
      size: {
        sm: "min-h-5 gap-0.5 px-1.5 py-0.5",
        // 22px and 26px have no Tailwind step; they are Figma's fixed heights.
        md: "min-h-[1.375rem] gap-1 px-2 py-0.5",
        lg: "min-h-[1.625rem] gap-1.5 px-3 py-1",
      },
      radius: {
        rounded: "rounded-full",
        // Figma `border radius/sm`. No class is 6px in both apps.
        standard: "rounded-[var(--radius-sm)]",
      },
    },
    compoundVariants: [
      { variant: "solid", tone: "primary", class: "bg-primary text-primary-foreground" },
      { variant: "solid", tone: "secondary", class: "bg-secondary text-secondary-foreground" },
      { variant: "solid", tone: "info", class: "bg-info text-info-foreground" },
      { variant: "solid", tone: "success", class: "bg-success text-success-foreground" },
      { variant: "solid", tone: "warning", class: "bg-warning text-warning-foreground" },
      {
        variant: "solid",
        tone: "destructive",
        class: "bg-destructive text-destructive-foreground",
      },

      { variant: "soft", tone: "primary", class: "from-soft-primary to-soft-primary text-primary" },
      // Figma sets Soft Secondary's text on `foreground`, not `secondary-foreground`.
      {
        variant: "soft",
        tone: "secondary",
        class: "from-soft-secondary to-soft-secondary text-foreground",
      },
      { variant: "soft", tone: "info", class: "from-soft-info to-soft-info text-info" },
      { variant: "soft", tone: "success", class: "from-soft-success to-soft-success text-success" },
      { variant: "soft", tone: "warning", class: "from-soft-warning to-soft-warning text-warning" },
      {
        variant: "soft",
        tone: "destructive",
        class: "from-soft-destructive to-soft-destructive text-destructive",
      },

      { variant: "outline", tone: "primary", class: "ring-primary text-primary" },
      { variant: "outline", tone: "secondary", class: "ring-secondary text-secondary-foreground" },
      { variant: "outline", tone: "info", class: "ring-info text-info" },
      { variant: "outline", tone: "success", class: "ring-success text-success" },
      { variant: "outline", tone: "warning", class: "ring-warning text-warning" },
      { variant: "outline", tone: "destructive", class: "ring-destructive text-destructive" },
    ],
    defaultVariants: {
      variant: "solid",
      tone: "primary",
      size: "sm",
      radius: "rounded",
    },
  }
)

/**
 * Figma's focus ring: its own node, 2px outside the badge on every side, a 1px
 * line in the tone's colour at partial opacity — 50% on `ring` for the two
 * neutral tones, 20% on the tone itself for the four status tones.
 */
const focusRingTone = {
  primary: "ring-ring/50",
  secondary: "ring-ring/50",
  info: "ring-info/20",
  success: "ring-success/20",
  warning: "ring-warning/20",
  destructive: "ring-destructive/20",
}

/** The close button's accessible name, per script, with the badge's label when it is plain text. */
const CLOSE_LABELS = {
  en: (label?: string) => (label ? `Remove ${label}` : "Remove"),
  ar: (label?: string) => (label ? `إزالة ${label}` : "إزالة"),
}

type Variant = "solid" | "soft" | "outline"
type Tone = keyof typeof focusRingTone
type Size = "sm" | "md" | "lg"
type Radius = "rounded" | "standard"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual weight — Figma `Type`. Declared here rather than inherited from
   * `VariantProps`, which widens every option with `| null`.
   */
  variant?: Variant
  /** Semantic colour — Figma `Tone`. */
  tone?: Tone
  /** Figma `Size`. */
  size?: Size
  /** Figma `Radius`: `rounded` is a pill, `standard` is `border radius/sm`. */
  radius?: Radius
  /**
   * Leading icon. Sized to 12px and coloured with `currentColor`, so pass any
   * SVG icon without size or colour of its own. Decorative: hidden from
   * assistive technology.
   */
  icon?: React.ReactNode
  /**
   * Leading avatar — a single image. The badge owns its 12px size and circular
   * clip; the child only supplies the picture, and its own `alt`.
   */
  avatar?: React.ReactNode
  /** Renders a close button at the trailing edge, and is called when it is pressed. */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Accessible name for the close button — read by screen readers, never shown.
   * Defaults to "Remove {label}" when the label is plain text, or "إزالة {label}"
   * when the page's `lang` is Arabic; "Remove" / "إزالة" otherwise.
   */
  closeLabel?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "solid",
      tone = "primary",
      size = "sm",
      radius = "rounded",
      icon,
      avatar,
      onClose,
      closeLabel,
      children,
      ...props
    },
    ref
  ) => {
    const label =
      typeof children === "string" || typeof children === "number"
        ? String(children).trim() || undefined
        : undefined

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, tone, size, radius }), className)}
        {...props}
      >
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex size-3 shrink-0 items-center justify-center [&>svg]:size-3"
          >
            {icon}
          </span>
        )}
        {avatar && (
          <span className="inline-flex size-3 shrink-0 overflow-hidden rounded-full [&>img]:size-full [&>img]:object-cover">
            {avatar}
          </span>
        )}
        <span>{children}</span>
        {onClose && (
          <>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              // The ring below is the badge's focus indicator, so the button
              // draws none of its own. `after:` widens the hit area to 24×24px
              // (WCAG 2.5.8) without moving anything: the glyph stays Figma's
              // 12px, and an absolute pseudo-element can't change the badge's
              // height even where it reaches past sm's 20px.
              className="peer relative inline-flex size-3 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none after:absolute after:-inset-1.5 after:content-['']"
            >
              {/*
               * Without `closeLabel`, the name comes from these two hidden
               * runs, and CSS keeps the one that matches the nearest `lang` —
               * the same way `dir` is inherited. That is right in the server
               * HTML before any script runs, and it follows a live language
               * change; `display: none` takes the other out of the name.
               */}
              {!closeLabel && (
                <>
                  <span className="sr-only [&:lang(ar)]:hidden">{CLOSE_LABELS.en(label)}</span>
                  <span className="sr-only hidden [&:lang(ar)]:inline">
                    {CLOSE_LABELS.ar(label)}
                  </span>
                </>
              )}
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            {/*
             * A sibling of the button, after it, so a plain
             * `peer-focus-visible:` drives it — the one form the Storybook
             * pseudo-state renderer can show. `:has()` would work in a browser
             * but not in the states grid. `rounded-[inherit]` keeps the ring on
             * the badge's own radius, as Figma binds the same token to both.
             */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -inset-0.5 rounded-[inherit] opacity-0 ring-1 peer-focus-visible:opacity-100",
                focusRingTone[tone]
              )}
            />
          </>
        )}
      </span>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/**
 * Built against the Figma `Status Indicator` set (323:390): Type × Size, 8
 * variants. Every colour below is the token the set binds.
 *
 * The dot has no Direction axis: it is a circle, so there is nothing to mirror.
 * Where it sits is the parent's job — Avatar pins it to the end corner.
 *
 * Figma's ring is a `theme/background` stroke drawn OUTSIDE the dot, 2px on the
 * 8px dot and 1px on the 4px one. `ring-*` is a box-shadow, so it draws there
 * too and never changes the dot's footprint.
 */
const statusIndicatorVariants = cva(
  "relative inline-block shrink-0 rounded-full ring-background",
  {
    variants: {
      status: {
        online: "bg-success",
        away: "bg-warning",
        busy: "bg-destructive",
        offline: "bg-muted",
      },
      size: {
        "8": "size-2 ring-2",
        "4": "size-1 ring-1",
      },
    },
    defaultVariants: {
      status: "online",
      size: "8",
    },
  }
)

/** The accessible name of each status, per script. Colour alone can't carry it. */
const STATUS_LABELS = {
  en: { online: "Online", away: "Away", busy: "Busy", offline: "Offline" },
  ar: { online: "متصل", away: "بعيد", busy: "مشغول", offline: "غير متصل" },
} as const

type Status = keyof typeof STATUS_LABELS.en
type Size = "8" | "4"

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Figma `Type`. */
  status?: Status
  /** Figma `Size`, in px: `8`, or `4` for the smallest avatar. */
  size?: Size
  /**
   * Accessible name — read by screen readers, never shown. Defaults to the
   * status in the page's language: "Online" / "متصل", "Away" / "بعيد",
   * "Busy" / "مشغول", "Offline" / "غير متصل".
   */
  label?: string
}

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ className, status = "online", size = "8", label, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(statusIndicatorVariants({ status, size }), className)}
      {...props}
    >
      {/*
       * Without `label`, the name comes from these two hidden runs, and CSS
       * keeps the one that matches the nearest `lang` — the same way Badge's
       * close button names itself. It is right in the server HTML before any
       * script runs, and follows a live language change.
       */}
      {label ? (
        <span className="sr-only">{label}</span>
      ) : (
        <>
          <span className="sr-only [&:lang(ar)]:hidden">{STATUS_LABELS.en[status]}</span>
          <span className="sr-only hidden [&:lang(ar)]:inline">{STATUS_LABELS.ar[status]}</span>
        </>
      )}
    </span>
  )
)
StatusIndicator.displayName = "StatusIndicator"

export { StatusIndicator, statusIndicatorVariants, STATUS_LABELS }

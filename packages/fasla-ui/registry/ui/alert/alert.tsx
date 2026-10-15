"use client"

import * as React from "react"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon, type LucideIcon } from "lucide-react"
import { Button, type ButtonProps } from "../button/button"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Alert` (15226:58727), 30 variants: Variants × Type × Direction, plus
 * the `Left Icon`, `Avatar`, `Title`, `Subtitle`, `Show Actions` and `Close
 * Icon` booleans.
 *
 * Composable, with shadcn's part names. Figma property → code:
 *  - `Variants` Default / Info / Success / Warning / Destructive → `variant`.
 *  - `Type` Outline / Solid / Soft → `type`. Figma's default is Outline, and
 *    so is the code's.
 *  - `Left Icon` and `Avatar` → `icon`: the variant's icon by default, `false`
 *    for none, or any element — another icon, or an Avatar.
 *  - `Title` and `Subtitle` → `AlertTitle` and `AlertDescription`.
 *  - `Show Actions` → `AlertAction`, Button at xs. `Close Icon` →
 *    `AlertClose`, Icon Button at icon-xs.
 *  - `Direction` → the page's `dir`, never a prop. Every inset is logical, so
 *    `dir="rtl"` mirrors the row into Figma's RTL variant, and the type ramp
 *    re-leads the text to Cairo's line on its own.
 *
 * The box: 16px inline and 12px block padding (`spacing/4`, `spacing/3`),
 * 12px between the icon, the text, the action and the close button
 * (`spacing/3`), 2px between the title and the description (`spacing/0,5`),
 * `border radius/lg`. Figma's width is a fixed 576px; here the alert fills its
 * container.
 *
 * Colours, as the set binds them:
 *
 *   type      box                               text and icon
 *   outline   card, 1px inside stroke           the tone; Default: foreground,
 *             in the tone (Default: border)     description muted-foreground
 *   solid     the tone (Default: primary)       foreground-inverse
 *   soft      card under the tone's /10 tint    the tone (Default: primary)
 *
 * The action is the Button Figma puts in each Type, all xs: Outline/Primary
 * in Outline, Solid/Secondary in Solid, Solid/Primary in Soft. The close
 * button is Ghost Icon Button; its × takes the alert's foreground, or
 * foreground-inverse on Solid.
 */

type AlertVariant = "default" | "info" | "success" | "warning" | "destructive"
type AlertType = "outline" | "solid" | "soft"

/** Figma's `Left Icon` for each Variant. */
const ICONS: Record<AlertVariant, LucideIcon> = {
  default: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: CircleAlertIcon,
}

/**
 * Windows high contrast drops fills and box-shadows, so the box would lose
 * its edge and Solid its fill. A system border keeps the edge; the text keeps
 * the system's colours, which are readable on any of them.
 */
const FORCED_COLORS = "forced-colors:border forced-colors:border-[CanvasText]"

const BOX: Record<AlertType, Record<AlertVariant, string>> = {
  // Figma's stroke is 1px INSIDE, so Outline is the same size as Solid and
  // Soft. An inset ring draws exactly that; a border would push the text in.
  outline: {
    default: "bg-card ring-1 ring-inset ring-border",
    info: "bg-card ring-1 ring-inset ring-info",
    success: "bg-card ring-1 ring-inset ring-success",
    warning: "bg-card ring-1 ring-inset ring-warning",
    destructive: "bg-card ring-1 ring-inset ring-destructive",
  },
  solid: {
    default: "bg-primary",
    info: "bg-info",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  },
  // `card` underneath, the tint on top — Figma's two fills. A one-colour
  // gradient is the second fill: it paints over the background colour
  // without replacing it, as Soft Button and Badge do.
  soft: {
    default: "bg-card bg-gradient-to-r from-soft-primary to-soft-primary",
    info: "bg-card bg-gradient-to-r from-soft-info to-soft-info",
    success: "bg-card bg-gradient-to-r from-soft-success to-soft-success",
    warning: "bg-card bg-gradient-to-r from-soft-warning to-soft-warning",
    destructive: "bg-card bg-gradient-to-r from-soft-destructive to-soft-destructive",
  },
}

/** The title's and the icon's colour. */
const TEXT: Record<AlertType, Record<AlertVariant, string>> = {
  outline: {
    default: "text-foreground",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  },
  solid: {
    default: "text-foreground-inverse",
    info: "text-foreground-inverse",
    success: "text-foreground-inverse",
    warning: "text-foreground-inverse",
    destructive: "text-foreground-inverse",
  },
  soft: {
    default: "text-primary",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  },
}

/** The description is the title's colour, except on Default Outline. */
const descriptionColour = (type: AlertType, variant: AlertVariant) =>
  type === "outline" && variant === "default" ? "text-muted-foreground" : TEXT[type][variant]

/**
 * Button's focus ring is `ring`, a mid grey that sits near 1.5:1 on the Solid
 * fills, under the 3:1 a focus indicator needs. On Solid the action's and the
 * close button's ring take the alert's own text colour instead, which holds
 * the same contrast as the text.
 */
const SOLID_FOCUS = "after:ring-foreground-inverse"

/**
 * A long word, such as a URL or a file name, breaks rather than overflow the
 * text column. Links stay underlined, so they never depend on colour alone.
 */
const TEXT_FLOW = "break-words [&_a]:underline [&_a]:underline-offset-2"

type Look = { variant: NonNullable<ButtonProps["variant"]>; tone: NonNullable<ButtonProps["tone"]> }
/** The action's Button in each Type. */
const ACTION: Record<AlertType, Look> = {
  outline: { variant: "outline", tone: "primary" },
  solid: { variant: "default", tone: "secondary" },
  soft: { variant: "default", tone: "primary" },
}

type AlertContextValue = {
  variant: AlertVariant
  type: AlertType
  close: () => void
}

const AlertContext = React.createContext<AlertContextValue>({
  variant: "default",
  type: "outline",
  close: () => {},
})

/**
 * Figma's Icon frame: as tall as one line of the title (20px in Geist, 24px
 * in Cairo; `1lh` of the same `text-sm`, so it follows the type ramp in
 * either script) with the 16px icon centred in it, so the icon sits on the
 * middle of the title's first line. It only sets a minimum, so an Avatar,
 * taller than the line, sits at the top as Figma's does. A browser without
 * the `lh` unit (before Safari 16.4) drops the height, and the icon sits at
 * the top of the line instead.
 */
const ICON_SLOT =
  "col-start-1 row-span-full row-start-1 me-3 flex min-h-[1lh] items-center justify-center self-start text-sm [&>svg]:size-4 [&>svg]:shrink-0"

export interface AlertProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Figma `Variants`: what the message is about. */
  variant?: AlertVariant
  /** Figma `Type`: a card with a stroke, a solid fill, or a tint. */
  type?: AlertType
  /**
   * Figma `Left Icon` and `Avatar`: the variant's icon by default, `false` for
   * none, or any element, such as another lucide icon or an Avatar. An icon
   * is drawn at 16px in the title's colour.
   */
  icon?: boolean | React.ReactNode
  /** Whether the alert is shown. Set it to control the alert yourself. */
  open?: boolean
  /** Whether the alert is shown at first, when you don't control it. */
  defaultOpen?: boolean
  /** Called when `AlertClose` is pressed, with `false`. */
  onOpenChange?: (open: boolean) => void
}

// The message box. Its role follows the variant: `alert` for `destructive`,
// which is announced at once, and `status` for the rest, announced when the
// reader is free. Pass `role` to choose another. (A `//` comment: a JSDoc
// block here would become the Storybook Docs page's intro.)
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "default",
      type = "outline",
      icon = true,
      open: openProp,
      defaultOpen = true,
      onOpenChange,
      role,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [openState, setOpenState] = React.useState(defaultOpen)
    const open = openProp ?? openState
    const close = React.useCallback(() => {
      setOpenState(false)
      onOpenChange?.(false)
    }, [onOpenChange])
    const look = React.useMemo(() => ({ variant, type, close }), [variant, type, close])

    if (!open) return null

    const Icon = ICONS[variant]
    const leading = icon === true ? <Icon strokeWidth={1.5} /> : icon || null

    return (
      <AlertContext.Provider value={look}>
        <div
          ref={ref}
          role={role ?? (variant === "destructive" ? "alert" : "status")}
          data-slot="alert"
          data-variant={variant}
          data-type={type}
          className={cn(
            // Four columns — icon, text, action, close — that collapse to
            // nothing when a part is left out. The spacing is each part's own
            // margin, not the grid's gap, so a missing part leaves no gap.
            // Two rows, for the title and the description; the icon, the
            // action and the close button span both.
            "relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] grid-rows-[auto_auto] items-start rounded-lg px-4 py-3 text-sm",
            // Anything that isn't a part goes in the text column too.
            "[&>:not([data-slot^=alert])]:col-start-2",
            BOX[type][variant],
            TEXT[type][variant],
            FORCED_COLORS,
            className
          )}
          {...props}
        >
          {leading && (
            <span data-slot="alert-icon" aria-hidden="true" className={ICON_SLOT}>
              {leading}
            </span>
          )}
          {children}
        </div>
      </AlertContext.Provider>
    )
  }
)
Alert.displayName = "Alert"

/** Figma's Title: `Tailwind En/SM/Medium`, or `Tailwind AR/SM/Medium` in Arabic. */
const AlertTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="alert-title" className={cn("col-start-2 font-medium", TEXT_FLOW, className)} {...props} />
  )
)
AlertTitle.displayName = "AlertTitle"

/**
 * Figma's Subtitle: `SM/Regular`, 2px under the title. It can hold more than
 * a sentence: paragraphs, a list or a link.
 */
const AlertDescription = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { variant, type } = React.useContext(AlertContext)
    return (
      <div
        ref={ref}
        data-slot="alert-description"
        className={cn(
          "col-start-2 [[data-slot=alert-title]+&]:mt-0.5",
          TEXT_FLOW,
          descriptionColour(type, variant),
          className
        )}
        {...props}
      />
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export type AlertActionProps = ButtonProps

/**
 * Figma's action: a Button at xs, in the look Figma gives each Type. It takes
 * every Button prop, so `variant` and `tone` can change the look, and
 * `asChild` makes it a link.
 */
const AlertAction = React.forwardRef<HTMLButtonElement, AlertActionProps>(
  ({ variant, tone, size = "xs", asChild, className, ...props }, ref) => {
    const { type } = React.useContext(AlertContext)
    const look = ACTION[type]
    return (
      <Button
        ref={ref}
        // A link made with asChild keeps its own element; only a button gets a type.
        type={asChild ? undefined : "button"}
        asChild={asChild}
        variant={variant ?? look.variant}
        tone={tone ?? (variant ? undefined : look.tone)}
        size={size}
        data-slot="alert-action"
        className={cn("col-start-3 row-span-full row-start-1 ms-3", type === "solid" && SOLID_FOCUS, className)}
        {...props}
      />
    )
  }
)
AlertAction.displayName = "AlertAction"

/**
 * Text that follows the language of the page: English, or Arabic under an
 * Arabic `lang`. Both runs are rendered and CSS keeps the one that matches the
 * nearest `lang`, as Pagination's labels do.
 */
const Localised = ({ en, ar }: { en: string; ar: string }) => (
  <>
    <span className="[&:lang(ar)]:hidden">{en}</span>
    <span className="hidden [&:lang(ar)]:inline">{ar}</span>
  </>
)

export interface AlertCloseProps extends Omit<ButtonProps, "variant" | "tone" | "size" | "asChild"> {
  /**
   * The button's name for screen readers. Defaults to the page's language:
   * "Close", or "إغلاق" under an Arabic `lang`.
   */
  label?: string
}

/**
 * Figma's Close Icon: Ghost Icon Button at icon-xs with a 16px ×. Pressing it
 * closes the alert, unless `onClick` calls `event.preventDefault()`.
 *
 * On Solid the × is foreground-inverse, and so are its hover, the same token
 * at 20% (30% pressed), and its focus ring: Ghost's grey would hide the × on
 * a coloured fill. Figma has no hover inside the Alert set; this one is the
 * code's.
 */
const AlertClose = React.forwardRef<HTMLButtonElement, AlertCloseProps>(
  ({ label, onClick, className, children, ...props }, ref) => {
    const { type, close } = React.useContext(AlertContext)
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        tone="secondary"
        size="icon-xs"
        aria-label={label}
        data-slot="alert-close"
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) close()
        }}
        className={cn(
          "col-start-4 row-span-full row-start-1 ms-3",
          type === "solid" &&
            `text-foreground-inverse hover:bg-foreground-inverse/20 active:bg-foreground-inverse/30 active:bg-none ${SOLID_FOCUS}`,
          className
        )}
        {...props}
      >
        {children ?? <XIcon aria-hidden="true" strokeWidth={1.5} />}
        {!label && (
          <span className="sr-only">
            <Localised en="Close" ar="إغلاق" />
          </span>
        )}
      </Button>
    )
  }
)
AlertClose.displayName = "AlertClose"

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertClose }

"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { CircleAlertIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../button/button"

/*
 * Figma: "Alert Dialog" (15455:53947), 8 variants.
 *
 * Built on Base UI's Alert Dialog. Base UI owns the behaviour: the
 * `alertdialog` role, naming it by its title and describing it by its
 * description, trapping focus inside, moving focus in on open (to the first
 * button, Cancel) and back to the trigger on close, closing on Escape, locking
 * the page's scroll, and ignoring presses outside. This file owns the look.
 *
 * Figma axis → code:
 *  - `Align` (Edge / Center) → `align` on `AlertDialogContent`.
 *  - `Destructive` (False / True) → `destructive`: the main action turns from
 *    Solid Primary to Solid Destructive.
 *  - `Icon` → `icon`: Figma's circle-alert, 24px, in the title's colour.
 *    In `edge` it sits beside one column that holds the title, the
 *    description and any additional content, centred on the title's first
 *    line; in `center` it sits above the title.
 *  - `Additional Content` and its slot → anything placed between
 *    `AlertDialogHeader` and `AlertDialogFooter`. It sits 16px from both, as
 *    wide as the text column.
 *  - `Direction` → the page's `dir`, never a prop. Read where the content is
 *    written and handed to the portalled dialog, so the actions mirror.
 */

type AlertDialogAlign = "edge" | "center"

type AlertDialogLook = {
  align: AlertDialogAlign
  destructive: boolean
  icon: React.ReactNode
}

const LookContext = React.createContext<AlertDialogLook>({ align: "edge", destructive: false, icon: null })

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * Where the dialog is written: its direction, language and font. The dialog
 * is portalled to `<body>`, out of that subtree, so it inherits none of them;
 * the popup re-applies them so an Arabic page gets a right-to-left, Cairo
 * dialog with Cairo's line heights.
 */
type PlaceContext = {
  direction: "ltr" | "rtl"
  lang?: string
  fontFamily?: string
}

function readContext(node: HTMLElement): PlaceContext {
  const attribute = node.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
  const style = getComputedStyle(node)
  const isRtl = attribute === "rtl" || (attribute !== "ltr" && style.direction === "rtl")
  return {
    direction: isRtl ? "rtl" : "ltr",
    lang: node.closest("[lang]")?.getAttribute("lang") || undefined,
    fontFamily: style.fontFamily || undefined,
  }
}

/**
 * Keeps the open dialog in step with the page it was written in. Rendered
 * inside the popup, so it runs only while the dialog is open: a page with a
 * dialog on every table row watches nothing until one opens.
 *
 * Reads before the first paint, so the dialog never shows in the wrong
 * direction, then again whenever an ancestor's `dir`, `lang`, `class` or
 * `style` changes — a locale switch, a font class, Storybook's toolbar. Each
 * ancestor is observed on its own, without `subtree`, so changes elsewhere in
 * the page never wake it.
 */
function FollowPlace({
  anchorRef,
  onChange,
}: {
  anchorRef: React.RefObject<HTMLSpanElement | null>
  onChange: React.Dispatch<React.SetStateAction<PlaceContext>>
}) {
  useIsomorphicLayoutEffect(() => {
    const node = anchorRef.current
    if (!node) return
    const read = () => {
      const next = readContext(node)
      onChange((prev) =>
        prev.direction === next.direction && prev.lang === next.lang && prev.fontFamily === next.fontFamily
          ? prev
          : next
      )
    }
    read()
    if (typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(read)
    for (let el = node.parentElement; el; el = el.parentElement) {
      observer.observe(el, { attributes: true, attributeFilter: ["dir", "lang", "class", "style"] })
    }
    return () => observer.disconnect()
  }, [anchorRef, onChange])
  return null
}

export type AlertDialogProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>

/**
 * One alert dialog: an `AlertDialogTrigger` and an `AlertDialogContent`. Open
 * it from the trigger, or control it with `open` and `onOpenChange`.
 */
function AlertDialog(props: AlertDialogProps) {
  return <AlertDialogPrimitive.Root {...props} />
}
AlertDialog.displayName = "AlertDialog"

export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>

/**
 * What opens the dialog. Renders a `<button>`; pass `render` to use your own
 * element, such as a Button: `render={<Button variant="outline" />}`.
 */
const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>((props, ref) => (
  <AlertDialogPrimitive.Trigger ref={ref} data-slot="alert-dialog-trigger" {...props} />
))
AlertDialogTrigger.displayName = "AlertDialogTrigger"

/**
 * The overlay: Figma's `custom/backdrop-overlay`, which is translucent and
 * denser in Dark. Fades with the dialog. Forced colours drop it, and the
 * dialog's own border keeps it apart from the page.
 */
const OVERLAY = cn(
  "fixed inset-0 z-50 bg-backdrop-overlay",
  "transition-opacity duration-150 motion-reduce:transition-none",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
)

/**
 * The dialog box. Figma's 512px width as a maximum, centred in the window
 * with a 16px gutter on a phone; it scrolls inside when it is taller than the
 * window, and `overscroll-contain` keeps that scroll from running on into the
 * page. 24px padding, 16px between its parts, `border radius/lg` (Tailwind's
 * `rounded-lg`), Figma's `shadow/lg` (Tailwind 3's `shadow-lg`) and the
 * `background` fill. No border, as in Figma, except in forced colours, where
 * the shadow is dropped and a system border marks the edge.
 *
 * Fades and grows from 95% over 150ms on Base UI's starting and ending
 * styles; with reduced motion it appears and disappears at once.
 */
const CONTENT = cn(
  "fixed inset-x-4 top-1/2 z-50 mx-auto grid max-h-[calc(100dvh-2rem)] max-w-lg -translate-y-1/2 grid-cols-[minmax(0,1fr)] gap-4 overflow-y-auto overscroll-contain",
  "rounded-lg bg-background p-6 text-foreground shadow-lg [outline:none]",
  "forced-colors:border forced-colors:border-[CanvasText]",
  "transition-[opacity,transform] duration-150 motion-reduce:transition-none",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
)

/**
 * `edge` with an icon: Figma's Text frame, two columns. The icon takes the
 * first, on the first row only; the header and any additional content share
 * the second, so the description and the extra content start where the title
 * does; the footer spans both. Grid columns follow the reading direction, so
 * an Arabic dialog puts the icon on the right with nothing else changed.
 */
const EDGE_WITH_ICON = cn(
  "grid-cols-[auto_minmax(0,1fr)]",
  // The two rules match different children, so neither overrides the other.
  "[&>:not([data-slot=alert-dialog-icon],[data-slot=alert-dialog-footer])]:col-start-2",
  "[&>[data-slot=alert-dialog-footer]]:col-span-full"
)

/**
 * Figma's Icon frame in `edge`: as tall as one line of the title (28px in
 * Geist, 32px in Cairo; `1lh` of the same `text-lg`, so it follows the type
 * ramp in either script) with the 24px icon centred in it, so the icon sits
 * on the middle of the title's first line. A browser without the `lh` unit
 * (before Safari 16.4) drops the height, and the icon sits at the top of the
 * line instead; nothing else moves.
 */
const EDGE_ICON =
  "col-start-1 row-start-1 flex h-[1lh] w-6 items-center justify-center self-start text-lg text-foreground [&_svg]:size-6 [&_svg]:shrink-0"

type PopupProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup>

export interface AlertDialogContentProps extends Omit<PopupProps, "className" | "render"> {
  /**
   * Figma `Align`. `edge` lines the text up with the reading edge and puts
   * the actions at the end; an icon sits beside the title, and the text and
   * any additional content line up with the title. `center` centres all
   * three, with the icon above the title.
   */
  align?: AlertDialogAlign
  /** Turns the main action into Solid Destructive, for an action that cannot be undone. */
  destructive?: boolean
  /**
   * An icon with the title: `true` for Figma's circle-alert, or any icon
   * element, such as a lucide icon. Whichever it is, it is drawn at 24px in
   * the title's colour, in the same cell.
   */
  icon?: boolean | React.ReactNode
  /** Where the dialog renders. Default `<body>`. */
  container?: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>["container"]
  /** Classes for the dialog box. */
  className?: string
}

/**
 * The dialog itself, over its overlay: an `AlertDialogHeader`, any content
 * of your own, and an `AlertDialogFooter`.
 */
const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ align = "edge", destructive = false, icon = false, container, className, style, children, ...props }, ref) => {
    // Rendered where the content is written, outside the portal, so the page's
    // direction, language and font can be read from it.
    const anchorRef = React.useRef<HTMLSpanElement>(null)
    const [place, setPlace] = React.useState<PlaceContext>({ direction: "ltr" })

    const look = React.useMemo<AlertDialogLook>(
      () => ({ align, destructive, icon: icon === true ? <CircleAlertIcon strokeWidth={1.5} /> : icon || null }),
      [align, destructive, icon]
    )
    const edgeIcon = align === "edge" && look.icon != null

    return (
      <>
        <span ref={anchorRef} hidden data-slot="alert-dialog-anchor" />
        <AlertDialogPrimitive.Portal container={container}>
          <AlertDialogPrimitive.Backdrop data-slot="alert-dialog-overlay" className={OVERLAY} />
          <AlertDialogPrimitive.Popup
            ref={ref}
            data-slot="alert-dialog-content"
            data-align={align}
            data-destructive={destructive || undefined}
            dir={place.direction}
            lang={place.lang}
            style={typeof style === "function" ? style : { fontFamily: place.fontFamily, ...style }}
            className={cn(CONTENT, edgeIcon && EDGE_WITH_ICON, className)}
            {...props}
          >
            <FollowPlace anchorRef={anchorRef} onChange={setPlace} />
            {edgeIcon && (
              <span data-slot="alert-dialog-icon" aria-hidden="true" className={EDGE_ICON}>
                {look.icon}
              </span>
            )}
            <LookContext.Provider value={look}>{children}</LookContext.Provider>
          </AlertDialogPrimitive.Popup>
        </AlertDialogPrimitive.Portal>
      </>
    )
  }
)
AlertDialogContent.displayName = "AlertDialogContent"

export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Figma's Header: the title over the description, 8px apart. In `center` it
 * also holds the icon, centred 16px above the title. In `edge` the icon
 * belongs to the dialog box instead, beside this header and any additional
 * content, so all of them start at the same edge.
 */
const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { align, icon } = React.useContext(LookContext)
    const center = align === "center"
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-header"
        className={cn("flex gap-4", center ? "flex-col items-center text-center" : "text-start", className)}
        {...props}
      >
        {center && icon && (
          <span
            data-slot="alert-dialog-icon"
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center text-foreground [&_svg]:size-6 [&_svg]:shrink-0"
          >
            {icon}
          </span>
        )}
        <div data-slot="alert-dialog-text" className={cn("flex min-w-0 flex-col gap-2", center ? "w-full" : "flex-1")}>
          {children}
        </div>
      </div>
    )
  }
)
AlertDialogHeader.displayName = "AlertDialogHeader"

export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Figma's Actions: Cancel, then the main action, 8px apart, at the end of the
 * row in `edge` and centred in `center`. A plain row in DOM order, so a
 * right-to-left page mirrors it. Long labels wrap onto a second row.
 */
const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => {
    const { align } = React.useContext(LookContext)
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-footer"
        className={cn(
          "flex flex-wrap items-center gap-2",
          align === "center" ? "justify-center" : "justify-end",
          className
        )}
        {...props}
      />
    )
  }
)
AlertDialogFooter.displayName = "AlertDialogFooter"

export type AlertDialogTitleProps = Omit<React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>, "className"> & {
  className?: string
}

/** The question the dialog asks. Names the dialog for assistive tech. LG Semi Bold in `foreground`. */
const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("text-lg font-semibold text-foreground [overflow-wrap:anywhere]", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

export type AlertDialogDescriptionProps = Omit<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>,
  "className"
> & {
  className?: string
}

/** What happens if the user goes ahead. Describes the dialog for assistive tech. SM Regular in `muted-foreground`. */
const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground [overflow-wrap:anywhere]", className)}
      {...props}
    />
  )
)
AlertDialogDescription.displayName = "AlertDialogDescription"

type CloseProps = Omit<React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close>, "className" | "render">

export interface AlertDialogActionProps extends CloseProps {
  /** Shows a spinner, disables the button and announces `loadingLabel`, as on Button. */
  loading?: boolean
  /** Screen-reader text announced while loading. */
  loadingLabel?: string
  className?: string
}

/**
 * The main action: Solid Primary md, or Solid Destructive md when the content
 * is `destructive`. It closes the dialog after your `onClick`. To keep it open
 * — while a request runs, say — call `event.preventBaseUIHandler()` in
 * `onClick` and close it yourself with `open`.
 */
const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, loading, loadingLabel, ...props }, ref) => {
    const { destructive } = React.useContext(LookContext)
    return (
      <AlertDialogPrimitive.Close
        ref={ref}
        data-slot="alert-dialog-action"
        render={
          <Button
            variant={destructive ? "destructive" : "default"}
            size="md"
            loading={loading}
            loadingLabel={loadingLabel}
            className={className}
          />
        }
        {...props}
      />
    )
  }
)
AlertDialogAction.displayName = "AlertDialogAction"

export interface AlertDialogCancelProps extends CloseProps {
  className?: string
}

/** Closes the dialog and changes nothing: Outline Secondary md. It takes focus when the dialog opens. */
const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Close
    ref={ref}
    data-slot="alert-dialog-cancel"
    render={<Button variant="outline" size="md" className={className} />}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
export type { AlertDialogAlign }

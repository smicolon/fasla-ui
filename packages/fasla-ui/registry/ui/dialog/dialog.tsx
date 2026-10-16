"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { ChevronLeftIcon, XIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../button/button"

/*
 * Figma: "Dialog" (38975:3887), 6 variants: Size × Direction, built from
 * "Dialog Header" (38975:3913) and "Footer Actions" (38975:3834).
 *
 * Built on Base UI's Dialog. Base UI owns the behaviour: the `dialog` role,
 * naming it by its title and describing it by its description, trapping focus
 * inside, moving focus in on open and back to the trigger on close, closing on
 * Escape and on a press on the overlay, and locking the page's scroll. This
 * file owns the look.
 *
 * Figma axis → code:
 *  - `Size` (L / XL / 2XL) → `size` on `DialogContent`: `lg`, `xl`, `2xl`.
 *  - Dialog Header `Close` → `showCloseButton` on `DialogContent`.
 *  - Dialog Header `Type` (Default / Back) → `onBack` on `DialogHeader`: with
 *    it, a back button sits before the title.
 *  - Dialog Header `Description` → whether a `DialogDescription` is there.
 *  - `Slot` → anything between `DialogHeader` and `DialogFooter`. It scrolls
 *    when the dialog is taller than the window; the header and footer stay.
 *  - `Show Footer` → whether a `DialogFooter` is there.
 *  - Footer Actions `Horizontal` → `layout` on `DialogFooter`. `Actions`,
 *    `Secondary Action` and `3rd Action` are the Buttons you put in it.
 *  - `Direction` → the page's `dir`, never a prop. Read where the content is
 *    written and handed to the portalled dialog, so everything mirrors.
 */

type DialogSize = "lg" | "xl" | "2xl"
type DialogFooterLayout = "horizontal" | "stacked"

/** What the parts need to know about the content they sit in. */
type DialogLook = {
  /** The close button is showing, so the title keeps clear of it. */
  close: boolean
}

const LookContext = React.createContext<DialogLook>({ close: false })

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

/** The 16px of `gap-4` between the pinned header or footer and the content, which they keep clear. */
const PINNED_GAP = 16

/**
 * Keeps a focused field out from under the pinned header and footer. They
 * stick inside the scrolling area, and a browser scrolls a field into view
 * against that area's edges, so a field reached with Shift+Tab would stop
 * behind the header. Scroll padding as tall as each one, and the 16px it
 * keeps clear, moves those edges in. It measures them while the dialog is
 * open and again whenever they change size (a title that wraps, a locale
 * switch) or are added or removed.
 */
function PinnedInsets({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  useIsomorphicLayoutEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    // Not only direct children: a `<form className="contents">` round the
    // parts lays them out in the scrolling area all the same.
    const pinned = () =>
      ["[data-slot=dialog-header]", "[data-slot=dialog-footer]"].map((selector) =>
        scroll.querySelector<HTMLElement>(selector)
      )
    const apply = () => {
      const [header, footer] = pinned()
      scroll.style.scrollPaddingTop = header ? `${header.offsetHeight + PINNED_GAP}px` : ""
      scroll.style.scrollPaddingBottom = footer ? `${footer.offsetHeight + PINNED_GAP}px` : ""
    }
    // Without ResizeObserver (an old browser, a test runner) it measures once.
    if (typeof ResizeObserver === "undefined") return apply()
    const sizes = new ResizeObserver(apply)
    const watch = () => {
      sizes.disconnect()
      for (const el of pinned()) if (el) sizes.observe(el)
      apply()
    }
    const children = new MutationObserver(watch)
    children.observe(scroll, { childList: true, subtree: true })
    watch()
    return () => {
      children.disconnect()
      sizes.disconnect()
    }
  }, [scrollRef])
  return null
}

/**
 * Text that follows the language of the dialog: English, or Arabic under an
 * Arabic `lang`. Both runs are rendered and CSS keeps the one that matches,
 * as Alert's and Sheet's close labels do.
 */
const Localised = ({ en, ar }: { en: string; ar: string }) => (
  <>
    <span className="[&:lang(ar)]:hidden">{en}</span>
    <span className="hidden [&:lang(ar)]:inline">{ar}</span>
  </>
)

export type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>

/**
 * One dialog: a `DialogTrigger` and a `DialogContent`. Open it from the
 * trigger, or control it with `open` and `onOpenChange`.
 */
function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root {...props} />
}
Dialog.displayName = "Dialog"

export type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>

/**
 * What opens the dialog. Renders a `<button>`; pass `render` to use your own
 * element, such as a Button: `render={<Button variant="outline" />}`.
 */
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>((props, ref) => (
  <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />
))
DialogTrigger.displayName = "DialogTrigger"

export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>

/**
 * Closes the dialog. Renders a `<button>`; pass `render` to use your own
 * element, such as Figma's Cancel: `render={<Button variant="outline" />}`.
 */
const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>((props, ref) => (
  <DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />
))
DialogClose.displayName = "DialogClose"

/*
 * Motion, from the presets in src/motion/presets.ts. The dialog takes
 * `modalScale`: it fades in from 98% over `base` (180ms) on `emphasized`
 * easing, and out the same way. The overlay takes `fadeIn`: `base` on
 * `standard`. With reduced motion nothing moves; both fade over `fast`
 * (120ms), as the presets' reduced form does.
 */
const OVERLAY = cn(
  "fixed inset-0 z-50 bg-backdrop-overlay",
  "transition-opacity duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:duration-[120ms]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
)

/**
 * The dialog box: Figma's Dialog. `popover` fill and text, 8px
 * `Radius/radius-md` (`--radius-md`, as Button's standard radius), Figma's
 * `shadow/lg` (Tailwind 3's `shadow-lg`) and no border, except in forced
 * colours, where the shadow is dropped and a system border marks the edge.
 *
 * Centred in the window with a 16px gutter on a phone, as tall as its
 * content up to the window less that gutter. Past that, only what sits
 * between the header and the footer scrolls.
 */
const CONTENT = cn(
  "fixed inset-x-4 top-1/2 z-50 mx-auto flex max-h-[calc(100dvh-2rem)] -translate-y-1/2 flex-col overflow-hidden",
  "rounded-[var(--radius-md)] bg-popover text-popover-foreground shadow-lg [outline:none]",
  "forced-colors:border forced-colors:border-[CanvasText]",
  // `transform` scales in Tailwind 3, `scale` in Tailwind 4.
  "motion-safe:transition-[opacity,transform,scale] motion-safe:duration-[180ms] motion-safe:ease-[cubic-bezier(0.2,0.8,0.2,1)]",
  "motion-safe:data-[starting-style]:scale-[0.98] motion-safe:data-[ending-style]:scale-[0.98]",
  "motion-reduce:transition-opacity motion-reduce:duration-[120ms]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
)

/** Figma `Size`: the box's width, less the 16px gutter each side when the window is narrower. */
const SIZE: Record<DialogSize, string> = {
  lg: "max-w-[32rem]", // L, 512px
  xl: "max-w-[42rem]", // XL, 672px
  "2xl": "max-w-[71.75rem]", // 2XL, 1148px
}

/**
 * Everything inside the dialog but the close button: Figma's Header, Slot and
 * Footer Actions, 16px apart, with 16px padding. It is what scrolls, so the
 * close button never moves; the header and the footer stick to its top and
 * bottom, and only what sits between them scrolls. It is not a scroll trap:
 * once it reaches its end, the wheel goes on to the page, which Base UI keeps
 * still while the dialog is open. Its scroll padding, set by `PinnedInsets`,
 * keeps a focused field clear of the header and the footer.
 */
const SCROLL = "flex min-h-0 flex-auto flex-col gap-4 overflow-y-auto p-4"

/*
 * The header and the footer sit in that 16px padding (`-mt-4`, `-mb-4`) and
 * stick at `-top-4` and `-bottom-4`: a sticky box keeps clear of its scroll
 * container's padding, so `top-0` would leave a 16px strip above the header
 * for the content to scroll through.
 */

type PopupProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>

export interface DialogContentProps extends Omit<PopupProps, "className" | "render"> {
  /** Figma `Size`: `lg` is 512px wide, `xl` 672px, `2xl` 1148px. */
  size?: DialogSize
  /** Figma's Close: the × button at the end of the header, on the title's line. */
  showCloseButton?: boolean
  /**
   * The close button's name for screen readers. Defaults to the page's
   * language: "Close", or "إغلاق" under an Arabic `lang`.
   */
  closeLabel?: string
  /** Where the dialog renders. Default `<body>`. */
  container?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>["container"]
  /** Classes for the dialog box. */
  className?: string
}

/**
 * The dialog itself, over its overlay: a `DialogHeader`, any content of your
 * own, and a `DialogFooter`.
 */
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ size = "lg", showCloseButton = true, closeLabel, container, className, style, children, ...props }, ref) => {
    // Rendered where the content is written, outside the portal, so the page's
    // direction, language and font can be read from it.
    const anchorRef = React.useRef<HTMLSpanElement>(null)
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const [place, setPlace] = React.useState<PlaceContext>({ direction: "ltr" })
    const look = React.useMemo<DialogLook>(() => ({ close: showCloseButton }), [showCloseButton])

    return (
      <>
        <span ref={anchorRef} hidden data-slot="dialog-anchor" />
        <DialogPrimitive.Portal container={container}>
          <DialogPrimitive.Backdrop data-slot="dialog-overlay" className={OVERLAY} />
          <DialogPrimitive.Popup
            ref={ref}
            data-slot="dialog-content"
            data-size={size}
            dir={place.direction}
            lang={place.lang}
            style={typeof style === "function" ? style : { fontFamily: place.fontFamily, ...style }}
            className={cn(CONTENT, SIZE[size], className)}
            {...props}
          >
            <FollowPlace anchorRef={anchorRef} onChange={setPlace} />
            <div ref={scrollRef} data-slot="dialog-scroll" className={SCROLL}>
              <LookContext.Provider value={look}>{children}</LookContext.Provider>
            </div>
            <PinnedInsets scrollRef={scrollRef} />
            {showCloseButton && (
              // A cell one title line tall (28px in Geist, 32 in Cairo: `1lh`
              // of the same `text-lg`), 16px below the top, with the 26px Icon
              // Button centred in it, so it sits on the middle of the title's
              // first line in either script. Its 16px × ends 16px from the
              // edge, where Figma draws it: the button's 5px of padding hangs
              // past the content edge. Above the pinned header, and last in
              // the DOM, so focus reaches the content first.
              <div
                data-slot="dialog-close-cell"
                className="absolute end-4 top-4 z-[2] flex h-[1lh] items-center text-lg"
              >
                <DialogPrimitive.Close
                  data-slot="dialog-close-button"
                  render={
                    <Button variant="ghost" tone="secondary" size="icon-xs" aria-label={closeLabel} className="-me-[5px]" />
                  }
                >
                  <XIcon aria-hidden="true" strokeWidth={1.5} />
                  {!closeLabel && (
                    <span className="sr-only">
                      <Localised en="Close" ar="إغلاق" />
                    </span>
                  )}
                </DialogPrimitive.Close>
              </div>
            )}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </>
    )
  }
)
DialogContent.displayName = "DialogContent"

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Figma's Back header type: a back button before the title, for a step in
   * a flow. Called when it is pressed; the dialog stays open.
   */
  onBack?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * The back button's name for screen readers. Defaults to the page's
   * language: "Back", or "رجوع" under an Arabic `lang`.
   */
  backLabel?: string
}

/**
 * Figma's Dialog Header: the title over the description, 4px apart, with a
 * 1px `border` under them and 16px of padding above it. It stays at the top
 * while the content under it scrolls, and the line marks where it goes under.
 *
 * With `onBack` it is Figma's Back type: a 16px chevron before the title,
 * centred on its first line and 4px from it, and the description lines up
 * with the title. The chevron points to the start, so it mirrors in RTL.
 */
const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ onBack, backLabel, className, children, ...props }, ref) => {
    const back = onBack != null
    return (
      <div
        ref={ref}
        data-slot="dialog-header"
        data-type={back ? "back" : "default"}
        className={cn(
          "sticky -top-4 z-[1] -mt-4 grid gap-y-1 border-b border-border bg-popover pb-4 pt-4 text-start",
          back
            ? "grid-cols-[auto_minmax(0,1fr)] gap-x-1 [&>:not([data-slot=dialog-back-cell])]:col-start-2"
            : "grid-cols-[minmax(0,1fr)]",
          className
        )}
        {...props}
      >
        {back && (
          // One title line tall, like the close cell, and 16px wide: the 26px
          // button's 5px of padding hangs past it on both sides, so its
          // chevron sits at the content edge and 4px from the title.
          <div data-slot="dialog-back-cell" className="col-start-1 row-start-1 flex h-[1lh] w-4 items-center justify-center text-lg">
            <Button
              type="button"
              data-slot="dialog-back-button"
              variant="ghost"
              tone="secondary"
              size="icon-xs"
              aria-label={backLabel}
              className="-mx-[5px]"
              onClick={onBack}
            >
              <ChevronLeftIcon aria-hidden="true" strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
              {!backLabel && (
                <span className="sr-only">
                  <Localised en="Back" ar="رجوع" />
                </span>
              )}
            </Button>
          </div>
        )}
        {children}
      </div>
    )
  }
)
DialogHeader.displayName = "DialogHeader"

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Figma `Horizontal`. `horizontal` puts the actions in a row at the end,
   * 8px apart, with a third action at the start: write them third, then
   * Cancel, then the main action. `stacked` makes each one full width, one
   * under the other: write the main action first, then Cancel, then a third.
   */
  layout?: DialogFooterLayout
  /** Adds an Outline "Close" button that closes the dialog, as shadcn's footer does. */
  showCloseButton?: boolean
}

/**
 * Figma's Footer Actions: a 1px `border` above the actions and 16px of
 * padding under it. It stays at the bottom while the content above it
 * scrolls.
 *
 * Plain rows in DOM order, so a right-to-left page mirrors them.
 */
const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ layout = "horizontal", showCloseButton = false, className, children, ...props }, ref) => {
    const close = showCloseButton && (
      <DialogPrimitive.Close data-slot="dialog-footer-close" render={<Button variant="outline" size="md" />}>
        <Localised en="Close" ar="إغلاق" />
      </DialogPrimitive.Close>
    )
    return (
      <div
        ref={ref}
        data-slot="dialog-footer"
        data-layout={layout}
        className={cn(
          "sticky -bottom-4 z-[1] -mb-4 mt-auto flex gap-2 border-t border-border bg-popover pb-4 pt-4",
          layout === "stacked"
            ? "flex-col [&>*]:w-full"
            : // A third action goes to the start; one or two stay at the end.
              // The footer's own Close stands in for Cancel, so it stays there.
              "flex-wrap items-center justify-end [&>:first-child:not([data-slot=dialog-footer-close]):nth-last-child(n+3)]:me-auto",
          className
        )}
        {...props}
      >
        {layout === "horizontal" && close}
        {children}
        {layout === "stacked" && close}
      </div>
    )
  }
)
DialogFooter.displayName = "DialogFooter"

export type DialogTitleProps = Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>, "className"> & {
  className?: string
}

/**
 * What the dialog is for. Names the dialog for assistive tech. LG Semi Bold
 * in `foreground`; with the close button showing, it keeps 32px clear of the
 * end for it (16px gap, 16px icon).
 */
const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, ...props }, ref) => {
  const { close } = React.useContext(LookContext)
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-lg font-semibold text-foreground [overflow-wrap:anywhere]", close && "pe-8", className)}
      {...props}
    />
  )
})
DialogTitle.displayName = "DialogTitle"

export type DialogDescriptionProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
  "className"
> & {
  className?: string
}

/**
 * A line on what to do in the dialog. Describes the dialog for assistive
 * tech. SM Regular in `foreground`, with 32px clear at the end, as in Figma.
 */
const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn("pe-8 text-sm text-foreground [overflow-wrap:anywhere]", className)}
      {...props}
    />
  )
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
export type { DialogSize, DialogFooterLayout }

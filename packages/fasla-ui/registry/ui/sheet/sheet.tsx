"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../button/button"

/*
 * Figma: "Sheet" (15043:262710), 8 variants: Side × Direction.
 *
 * Built on Base UI's Dialog. Base UI owns the behaviour: the `dialog` role,
 * naming it by its title and describing it by its description, trapping focus
 * inside, moving focus in on open and back to the trigger on close, closing on
 * Escape and on a press on the overlay, and locking the page's scroll. This
 * file owns the look.
 *
 * Figma axis → code:
 *  - `Side` (Top / Bottom / Start / End) → `side` on `SheetContent`. Start and
 *    End are logical: End is the right edge on a left-to-right page and the
 *    left edge on a right-to-left one, and the slide follows it.
 *  - `Direction` → the page's `dir`, never a prop. Read where the content is
 *    written and handed to the portalled sheet.
 *  - Close → `showCloseButton`: Figma's Icon Button (Ghost, Secondary, xs)
 *    with a 16px ×, 16px from the end edge, on the title's first line.
 *  - Header, Content Area, Footer → `SheetHeader`, anything of your own, and
 *    `SheetFooter`. The footer stays at the bottom; everything between it and
 *    the header scrolls.
 */

type SheetSide = "top" | "bottom" | "start" | "end"

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * Where the sheet is written: its direction, language and font. The sheet is
 * portalled to `<body>`, out of that subtree, so it inherits none of them; the
 * popup re-applies them so an Arabic page gets a right-to-left, Cairo sheet
 * with Cairo's line heights, opening from the left for End.
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
 * Keeps the open sheet in step with the page it was written in, after its
 * first render: whenever an ancestor's `dir`, `lang`, `class` or `style`
 * changes — a locale switch, a font class, Storybook's toolbar. Rendered
 * inside the popup, so it runs only while the sheet is open. Each ancestor is
 * observed on its own, without `subtree`, so changes elsewhere in the page
 * never wake it.
 *
 * It does not set the first direction: `SheetPopup` reads that before its
 * first render (see there for why).
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

/**
 * Keeps a focused field out from under the pinned header and footer. They
 * stick inside the scrolling area, and a browser scrolls a field into view
 * against that area's edges, so a field reached with Shift+Tab would stop
 * behind the header. Scroll padding as tall as each one moves those edges in.
 * It measures them while the sheet is open and again whenever they change size
 * (a title that wraps, a locale switch) or are added or removed.
 */
function PinnedInsets({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  useIsomorphicLayoutEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    const pinned = () =>
      [":scope > [data-slot=sheet-header]", ":scope > [data-slot=sheet-footer]"].map((selector) =>
        scroll.querySelector<HTMLElement>(selector)
      )
    const apply = () => {
      const [header, footer] = pinned()
      scroll.style.scrollPaddingTop = header ? `${header.offsetHeight}px` : ""
      scroll.style.scrollPaddingBottom = footer ? `${footer.offsetHeight}px` : ""
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
    children.observe(scroll, { childList: true })
    watch()
    return () => {
      children.disconnect()
      sizes.disconnect()
    }
  }, [scrollRef])
  return null
}

/**
 * Text that follows the language of the sheet: English, or Arabic under an
 * Arabic `lang`. Both runs are rendered and CSS keeps the one that matches,
 * as Alert's close label does.
 */
const Localised = ({ en, ar }: { en: string; ar: string }) => (
  <>
    <span className="[&:lang(ar)]:hidden">{en}</span>
    <span className="hidden [&:lang(ar)]:inline">{ar}</span>
  </>
)

export type SheetProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>

/**
 * One sheet: a `SheetTrigger` and a `SheetContent`. Open it from the trigger,
 * or control it with `open` and `onOpenChange`.
 */
function Sheet(props: SheetProps) {
  return <DialogPrimitive.Root {...props} />
}
Sheet.displayName = "Sheet"

export type SheetTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>

/**
 * What opens the sheet. Renders a `<button>`; pass `render` to use your own
 * element, such as a Button: `render={<Button variant="outline" />}`.
 */
const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>((props, ref) => (
  <DialogPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />
))
SheetTrigger.displayName = "SheetTrigger"

export type SheetCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>

/**
 * Closes the sheet. Renders a `<button>`; pass `render` to use your own
 * element, such as Figma's Cancel: `render={<Button variant="outline" tone="primary" />}`.
 */
const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>((props, ref) => (
  <DialogPrimitive.Close ref={ref} data-slot="sheet-close" {...props} />
))
SheetClose.displayName = "SheetClose"

/*
 * Motion, from the presets in src/motion/presets.ts: the slide takes `slow`
 * (260ms) on `standard` easing, in and out. With reduced motion the sheet
 * does not move; it fades over `fast` (120ms), as the presets' reduced form
 * does.
 */
const MOTION = cn(
  "motion-safe:transition-transform motion-safe:duration-[260ms] motion-safe:ease-[cubic-bezier(0.2,0,0,1)]",
  "motion-reduce:transition-opacity motion-reduce:duration-[120ms]",
  "motion-reduce:data-[starting-style]:opacity-0 motion-reduce:data-[ending-style]:opacity-0"
)

/**
 * The overlay: Figma's `custom/backdrop-overlay`, as behind Alert Dialog,
 * translucent and denser in Dark. Fades with the sheet. Forced colours drop
 * it, and the sheet's border keeps it apart from the page.
 */
const OVERLAY = cn(
  "fixed inset-0 z-50 bg-backdrop-overlay",
  "transition-opacity duration-[260ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:duration-[120ms]",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
)

/**
 * The sheet itself: Figma's Sheet content. `card` fill, `card-foreground`
 * text, Figma's `shadow/lg` (Tailwind 3's `shadow-lg`), no radius, and a 1px
 * `border` line on the one edge that faces the page.
 *
 * The line is drawn over the panel's edge, not as a CSS border: Figma's
 * stroke sits inside the frame and takes no room, so the header starts 16px
 * from the edge whichever side the line is on. A border would push the
 * content 1px further in on that side. In forced colours it is drawn in the
 * system's text colour, so the panel keeps its edge without the shadow.
 */
const CONTENT = cn(
  "fixed z-50 flex flex-col overflow-hidden bg-card text-card-foreground shadow-lg [outline:none]",
  "after:pointer-events-none after:absolute after:z-[3] after:bg-border after:content-['']",
  "forced-colors:after:bg-[CanvasText] forced-colors:after:[forced-color-adjust:none]",
  MOTION
)

/**
 * Per side. Start and End are 384px wide and as tall as the window, with
 * 48px of overlay always left beside them on a phone so a press outside can
 * still close them. Top and Bottom are as wide as the window and as tall as
 * their content, up to the window less the same 48px.
 *
 * Every side is written with logical properties (`start-0`, `after:end-0`), so
 * Start and End swap edges on a right-to-left page. The slide is the one
 * physical value — `translate` has no logical form — so End and Start flip
 * their offset under `:dir(rtl)`, which the popup's own `dir` sets.
 */
const SIDE: Record<SheetSide, string> = {
  end: cn(
    "inset-y-0 end-0 h-full w-96 max-w-[calc(100%-3rem)] after:inset-y-0 after:start-0 after:w-px",
    "motion-safe:data-[starting-style]:translate-x-full motion-safe:data-[ending-style]:translate-x-full",
    "motion-safe:[&:dir(rtl)]:data-[starting-style]:-translate-x-full motion-safe:[&:dir(rtl)]:data-[ending-style]:-translate-x-full"
  ),
  start: cn(
    "inset-y-0 start-0 h-full w-96 max-w-[calc(100%-3rem)] after:inset-y-0 after:end-0 after:w-px",
    "motion-safe:data-[starting-style]:-translate-x-full motion-safe:data-[ending-style]:-translate-x-full",
    "motion-safe:[&:dir(rtl)]:data-[starting-style]:translate-x-full motion-safe:[&:dir(rtl)]:data-[ending-style]:translate-x-full"
  ),
  top: cn(
    "inset-x-0 top-0 max-h-[calc(100%-3rem)] after:inset-x-0 after:bottom-0 after:h-px",
    "motion-safe:data-[starting-style]:-translate-y-full motion-safe:data-[ending-style]:-translate-y-full"
  ),
  bottom: cn(
    "inset-x-0 bottom-0 max-h-[calc(100%-3rem)] after:inset-x-0 after:top-0 after:h-px",
    "motion-safe:data-[starting-style]:translate-y-full motion-safe:data-[ending-style]:translate-y-full"
  ),
}

/**
 * Everything inside the sheet but the close button: Figma's Header, Body and
 * Footer, 16px apart. It is what scrolls, so the close button never moves;
 * the header and the footer stick to its top and bottom, and only what sits
 * between them scrolls. The footer's `mt-auto` holds it at the bottom when
 * there is little to show. It is not a scroll trap: once it reaches its end,
 * the wheel goes on to the page, which Base UI keeps still while the sheet is
 * open. Its scroll padding, set by `PinnedInsets`, keeps a focused field
 * clear of the header and the footer.
 */
const SCROLL = "flex min-h-0 flex-auto flex-col gap-4 overflow-y-auto"

type PopupProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>

export interface SheetContentProps extends Omit<PopupProps, "className" | "render"> {
  /**
   * Figma `Side`: the edge it slides in from. `start` and `end` follow the
   * reading direction: `end` is the right edge in left-to-right, the left
   * edge in right-to-left.
   */
  side?: SheetSide
  /** Figma's Close: the × button at the end of the header. */
  showCloseButton?: boolean
  /**
   * The close button's name for screen readers. Defaults to the page's
   * language: "Close", or "إغلاق" under an Arabic `lang`.
   */
  closeLabel?: string
  /** Where the sheet renders. Default `<body>`. */
  container?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>["container"]
  /** Classes for the sheet's panel. */
  className?: string
}

type SheetPopupProps = Omit<SheetContentProps, "container" | "showCloseButton" | "closeLabel"> & {
  side: SheetSide
  showCloseButton: boolean
  closeLabel?: string
  anchorRef: React.RefObject<HTMLSpanElement | null>
}

/**
 * The panel. It mounts only while the sheet is open (Base UI's Portal renders
 * nothing while it is closed), so its first render is the moment it opens.
 *
 * The page's direction has to be on the panel from that first render. The
 * slide is a transition on `transform`, and Start and End take opposite
 * offsets in each direction (`translate-x-full` against `-translate-x-full`).
 * A panel that rendered left-to-right and was then corrected to right-to-left
 * while still in its starting style would see its offset change mid-start,
 * and the browser would animate that change too: in Arabic, End would slide
 * in from the page side, towards the left edge, instead of from off-screen.
 * So the direction is read from the anchor, which is already in the page,
 * before the first render.
 *
 * If the anchor is not in the page yet (a sheet open on its very first
 * render, where the anchor and the panel arrive in the same commit), it falls
 * back to `ltr`, `FollowPlace` corrects it before the first paint, and the
 * transition is held off until the frame after, so the correction is never
 * animated: that sheet appears without sliding rather than sliding the wrong
 * way.
 */
const SheetPopup = React.forwardRef<HTMLDivElement, SheetPopupProps>(
  ({ side, showCloseButton, closeLabel, anchorRef, className, style, children, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const [place, setPlace] = React.useState<PlaceContext | null>(() =>
      anchorRef.current ? readContext(anchorRef.current) : null
    )
    const [settled, setSettled] = React.useState(place !== null)
    const current = place ?? { direction: "ltr" as const }

    React.useEffect(() => {
      if (settled) return
      const frame = requestAnimationFrame(() => setSettled(true))
      return () => cancelAnimationFrame(frame)
    }, [settled])

    const followPlace = React.useCallback<React.Dispatch<React.SetStateAction<PlaceContext>>>(
      (next) => setPlace((prev) => (typeof next === "function" ? next(prev ?? { direction: "ltr" }) : next)),
      []
    )

    return (
      <DialogPrimitive.Popup
        ref={ref}
        data-slot="sheet-content"
        data-side={side}
        dir={current.direction}
        lang={current.lang}
        style={
          typeof style === "function"
            ? style
            : { fontFamily: current.fontFamily, ...(settled ? null : { transition: "none" }), ...style }
        }
        className={cn(CONTENT, SIDE[side], className)}
        {...props}
      >
        <FollowPlace anchorRef={anchorRef} onChange={followPlace} />
        <div ref={scrollRef} data-slot="sheet-scroll" className={SCROLL}>
          {children}
        </div>
        <PinnedInsets scrollRef={scrollRef} />
        {showCloseButton && (
          // A cell one title line tall (32px in Geist, 40 in Cairo: `1lh`
          // of the same `text-2xl`), 16px below the header's top, with the
          // 26px button centred in it, so the button sits on the middle of
          // the title's first line in either script. 16px from the sheet's
          // outer end edge, as in Figma, on every side. Above the sticky
          // header, and last in the DOM, so focus reaches the content first.
          <div data-slot="sheet-close-cell" className="absolute end-4 top-4 z-[2] flex h-[1lh] items-center text-2xl">
            <DialogPrimitive.Close
              data-slot="sheet-close-button"
              render={<Button variant="ghost" tone="secondary" size="icon-xs" aria-label={closeLabel} />}
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
    )
  }
)
SheetPopup.displayName = "SheetPopup"

/**
 * The sheet itself, over its overlay: a `SheetHeader`, any content of your
 * own, and a `SheetFooter`.
 */
const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "end", showCloseButton = true, closeLabel, container, ...props }, ref) => {
    // Rendered where the content is written, outside the portal, so the page's
    // direction, language and font can be read from it.
    const anchorRef = React.useRef<HTMLSpanElement>(null)

    return (
      <>
        <span ref={anchorRef} hidden data-slot="sheet-anchor" />
        <DialogPrimitive.Portal container={container}>
          <DialogPrimitive.Backdrop data-slot="sheet-overlay" className={OVERLAY} />
          <SheetPopup
            ref={ref}
            side={side}
            showCloseButton={showCloseButton}
            closeLabel={closeLabel}
            anchorRef={anchorRef}
            {...props}
          />
        </DialogPrimitive.Portal>
      </>
    )
  }
)
SheetContent.displayName = "SheetContent"

export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Figma's Header: the title over the description, 12px apart, 16px padding
 * with 48px at the end, so a long title wraps before it reaches the close
 * button. It stays at the top while the content under it scrolls.
 */
const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sheet-header"
    className={cn("sticky top-0 z-[1] flex flex-col gap-3 bg-card p-4 pe-12 text-start", className)}
    {...props}
  />
))
SheetHeader.displayName = "SheetHeader"

export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Figma's Footer: the actions stacked full width, 16px apart, with 16px
 * padding; the main action first. It stays at the bottom of the sheet, over
 * the content when that scrolls.
 */
const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sheet-footer"
    className={cn("sticky bottom-0 z-[1] mt-auto flex flex-col gap-4 bg-card p-4", className)}
    {...props}
  />
))
SheetFooter.displayName = "SheetFooter"

export type SheetTitleProps = Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>, "className"> & {
  className?: string
}

/** What the sheet is for. Names the sheet for assistive tech. 2XL Semi Bold in `card-foreground`. */
const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn("text-2xl font-semibold text-card-foreground [overflow-wrap:anywhere]", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

export type SheetDescriptionProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
  "className"
> & {
  className?: string
}

/** A line on what to do in the sheet. Describes the sheet for assistive tech. Base Regular in `muted-foreground`. */
const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn("text-base text-muted-foreground [overflow-wrap:anywhere]", className)}
      {...props}
    />
  )
)
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
export type { SheetSide }

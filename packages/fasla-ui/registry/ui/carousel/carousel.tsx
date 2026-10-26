"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/**
 * A scroll-snap carousel. The engine is the browser's: the track is a real
 * `overflow-x` scroller with `scroll-snap`, so touch, trackpad and scrollbar
 * gestures all work, and RTL comes free from logical layout — no `rtl:`
 * overrides, no physical offsets, no measuring in JavaScript.
 *
 * The active slide is *read back* from the scroller with an
 * IntersectionObserver rather than derived from React state, so it stays
 * right whichever way the user scrolls. Navigation (dots, arrows) scrolls
 * with `scrollIntoView` on the inline axis and lets the observer confirm.
 *
 * Figma's `Active Item` axis is the `activeIndex` / `defaultActiveIndex` /
 * `onActiveIndexChange` trio; its `Direction` axis is the page's `dir`,
 * never a prop.
 */

interface CarouselContextValue {
  activeIndex: number
  count: number
  /** Navigate to a slide: scrolls the track and (uncontrolled) sets the index. */
  scrollTo: (index: number) => void
  registerItem: (el: HTMLElement) => () => void
  indexOf: (el: HTMLElement | null) => number
  setTrack: (el: HTMLDivElement | null) => void
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("Carousel components must be used within a Carousel provider")
  }
  return context
}

/** The one ref-merging shape React bails out on: a stable callback. */
function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The controlled index of the active slide. */
  activeIndex?: number
  /** The slide to start on when the index is uncontrolled. */
  defaultActiveIndex?: number
  /** Called whenever the active slide changes — navigation and manual scrolling alike. */
  onActiveIndexChange?: (index: number) => void
  children: React.ReactNode
}

/**
 * The root names the whole widget for assistive technology (the APG carousel
 * pattern): pass `aria-label` (or `aria-labelledby`) with it. It carries no
 * layout of its own beyond `relative`; compose `CarouselContent` and
 * `CarouselDots` inside it.
 */
const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      activeIndex: controlledIndex,
      defaultActiveIndex = 0,
      onActiveIndexChange,
      onKeyDown,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalIndex, setInternalIndex] = React.useState(defaultActiveIndex)
    const isControlled = controlledIndex !== undefined
    const activeIndex = isControlled ? controlledIndex : internalIndex

    // Items in DOM order, registered by each CarouselItem on mount. State, not
    // a ref: the dots and the observer must re-render when slides come and go.
    const [items, setItems] = React.useState<HTMLElement[]>([])
    const registerItem = React.useCallback((el: HTMLElement) => {
      setItems((prev) => {
        const next = [...prev, el]
        next.sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        )
        return next
      })
      return () => setItems((prev) => prev.filter((item) => item !== el))
    }, [])
    const indexOf = React.useCallback(
      (el: HTMLElement | null) => (el ? items.indexOf(el) : -1),
      [items]
    )

    const [track, setTrack] = React.useState<HTMLDivElement | null>(null)

    // What the track actually shows, as last reported by the observer. It
    // starts at the start, where every scroller does.
    const visibleIndexRef = React.useRef(0)
    // The slide a navigation is scrolling to. Until the track gets there, the
    // observer's reports of the slides it passes on the way are not changes.
    const targetRef = React.useRef<number | null>(null)

    const itemsRef = React.useRef(items)
    itemsRef.current = items

    /** Whether the track is, or is on its way to, showing `index`. */
    const isShowing = React.useCallback(
      (index: number) =>
        targetRef.current === null ? visibleIndexRef.current === index : targetRef.current === index,
      []
    )

    const scrollToItem = React.useCallback((index: number, behavior?: ScrollBehavior) => {
      const item = itemsRef.current[index]
      if (!item) return
      if (!isShowing(index)) targetRef.current = index
      // No behavior for user navigation: `scroll-smooth motion-reduce:scroll-auto`
      // on the track decides, so reduced motion is honoured by CSS alone.
      item.scrollIntoView?.({
        block: "nearest",
        inline: "start",
        ...(behavior ? { behavior } : {}),
      })
    }, [isShowing])

    const stateRef = React.useRef({ isControlled, activeIndex, onActiveIndexChange })
    stateRef.current = { isControlled, activeIndex, onActiveIndexChange }

    /**
     * Navigation asks for a slide. Uncontrolled, the carousel takes it;
     * controlled, the parent decides, and the track only moves when the new
     * `activeIndex` arrives. Either way the track follows the index (the
     * effect below), so the dots and arrows always describe what is shown.
     */
    const scrollTo = React.useCallback(
      (index: number) => {
        const clamped = Math.max(0, Math.min(itemsRef.current.length - 1, index))
        const state = stateRef.current
        if (clamped !== state.activeIndex) {
          if (!state.isControlled) setInternalIndex(clamped)
          state.onActiveIndexChange?.(clamped)
        } else if (!isShowing(clamped)) {
          // The index already says so but the track is elsewhere: bring it back.
          scrollToItem(clamped)
        }
      },
      [scrollToItem, isShowing]
    )

    // Starting off-zero means scrolling there before the observer first looks,
    // instantly — a smooth animation on mount would be motion nobody asked for.
    // This effect is declared before the observer's so it runs first.
    const didInit = React.useRef(false)
    React.useEffect(() => {
      if (didInit.current || items.length === 0) return
      didInit.current = true
      if (activeIndex > 0) scrollToItem(activeIndex, "instant")
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items])

    React.useEffect(() => {
      if (!track || items.length === 0 || typeof IntersectionObserver === "undefined") {
        return
      }
      // A slide is "shown" when at least half of it is inside the track; the
      // active one is the first shown, i.e. the slide snapped to the start.
      const ratios = new Map<Element, number>()
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio)
          const next = items.findIndex((item) => (ratios.get(item) ?? 0) >= 0.5)
          if (next === -1 || next === visibleIndexRef.current) return
          visibleIndexRef.current = next
          if (targetRef.current !== null) {
            if (next !== targetRef.current) return
            targetRef.current = null
          }
          const state = stateRef.current
          if (next === state.activeIndex) return
          if (!state.isControlled) setInternalIndex(next)
          state.onActiveIndexChange?.(next)
        },
        { root: track, threshold: 0.5 }
      )
      for (const item of items) observer.observe(item)
      return () => observer.disconnect()
    }, [track, items])

    /*
     * When scrolling settles, the track and the index must agree. A
     * navigation that never arrived stops waiting; the track's slide wins
     * when the carousel owns its index, and a controlled carousel whose
     * parent kept its index (it refused the swipe) scrolls back to it. The
     * check waits two frames, so the observer's report of the last position
     * is in first. `scrollend` where the browser has it; a quiet 150ms of
     * `scroll` events where it does not.
     */
    React.useEffect(() => {
      if (!track) return
      let quiet: ReturnType<typeof setTimeout> | undefined
      let frame = 0
      const settle = () => {
        clearTimeout(quiet)
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            targetRef.current = null
            const visible = visibleIndexRef.current
            const state = stateRef.current
            if (visible === state.activeIndex) return
            if (state.isControlled) return scrollToItem(state.activeIndex)
            setInternalIndex(visible)
            state.onActiveIndexChange?.(visible)
          })
        })
      }
      const onScroll = () => {
        clearTimeout(quiet)
        quiet = setTimeout(settle, 150)
      }
      track.addEventListener("scroll", onScroll, { passive: true })
      track.addEventListener("scrollend", settle)
      return () => {
        clearTimeout(quiet)
        cancelAnimationFrame(frame)
        track.removeEventListener("scroll", onScroll)
        track.removeEventListener("scrollend", settle)
      }
    }, [track, scrollToItem])

    // The track follows the index: scroll there, unless it already shows it
    // or is on its way (the change came *from* the observer, or a navigation).
    React.useEffect(() => {
      if (!didInit.current) return
      if (!isShowing(activeIndex)) scrollToItem(activeIndex)
    }, [activeIndex, scrollToItem, isShowing])

    const context = React.useMemo<CarouselContextValue>(
      () => ({
        activeIndex,
        count: items.length,
        scrollTo,
        registerItem,
        indexOf,
        setTrack,
      }),
      [activeIndex, items.length, scrollTo, registerItem, indexOf]
    )

    /*
     * Keyboard navigation, from anywhere inside the carousel: the arrow keys
     * move one slide — read against the carousel's *computed* direction, so
     * the key that points forward on screen always goes forward — and Home
     * and End jump to the ends. Keys inside an editable control are left
     * alone: a text field in a slide keeps its own caret movement.
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const { key } = event
      if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") {
        return
      }
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      if (key === "Home") return scrollTo(0)
      if (key === "End") return scrollTo(itemsRef.current.length - 1)
      const isRtl = getComputedStyle(event.currentTarget).direction === "rtl"
      const forward = (key === "ArrowRight") !== isRtl
      scrollTo(stateRef.current.activeIndex + (forward ? 1 : -1))
    }

    return (
      <CarouselContext.Provider value={context}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          className={cn("relative", className)}
          {...props}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The slides. An empty track is fine — the dots render nothing with it. */
  children?: React.ReactNode
}

/**
 * The track: a flex scroller with mandatory inline snapping, slides 16px
 * apart. The scrollbar is hidden in both engines — the dots or arrows are the
 * visible affordance — but the area still scrolls by touch and trackpad.
 *
 * It is a tab stop with a visible ring: a scrollable region a keyboard cannot
 * reach fails WCAG 2.1.1, and once it has focus the root's key handling moves
 * one slide per arrow press — so a carousel composed without dots or arrows
 * is still fully keyboard-operable.
 */
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    const { setTrack } = useCarousel()
    const composedRef = React.useMemo(() => composeRefs(setTrack, ref), [setTrack, ref])
    return (
      <div
        ref={composedRef}
        data-slot="carousel-content"
        tabIndex={0}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth motion-reduce:scroll-auto",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
CarouselContent.displayName = "CarouselContent"

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * One slide: a full-width snap point (override `basis-*` for more per view).
 * Exposed as the APG's `group`/`slide`, named "N / M" — digits, so the name
 * needs no locale. Pass `aria-label` to name a slide by its content instead.
 */
const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { registerItem, indexOf, count } = useCarousel()
    const [node, setNode] = React.useState<HTMLElement | null>(null)
    React.useEffect(() => {
      if (node) return registerItem(node)
    }, [node, registerItem])
    const index = indexOf(node)
    const composedRef = React.useMemo(() => composeRefs(setNode, ref), [ref])
    return (
      <div
        ref={composedRef}
        role="group"
        aria-roledescription="slide"
        aria-label={index === -1 ? undefined : `${index + 1} / ${count}`}
        data-slot="carousel-item"
        className={cn("min-w-0 shrink-0 grow-0 basis-full snap-start", className)}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = "CarouselItem"

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * How many dots, for dots used on their own. Inside a `Carousel` leave it
   * out: the carousel counts its own slides. Passing it makes the dots
   * standalone, driven by `activeIndex` and `onActiveIndexChange`.
   */
  count?: number
  /** The active dot, when standalone. */
  activeIndex?: number
  /** Called with a dot's index when it is pressed, when standalone. */
  onActiveIndexChange?: (index: number) => void
  /** Accessible name per dot. The default is the slide's own "N / M". */
  label?: (index: number, count: number) => string
}

/**
 * Figma's dot stepper, one dot per slide. Inside a `Carousel` it reads the
 * carousel; with a `count` of its own it stands alone, for a gallery or a
 * stepper whose slides are not a Carousel. The geometry is the set's exactly:
 * dots 8px tall and 4px apart, the inactive a `muted-foreground` 8px circle
 * (rebound from `muted` on 2026-10-06 — `muted` on `background` was ~1.07:1,
 * far under WCAG 1.4.11's 3:1), the active a `primary` 24px pill, everything
 * `9999px`-rounded. The width animates, so activation reads as the dot
 * stretching — unless motion is reduced.
 *
 * Each dot is a real button. The visual is a child span: the button pads it
 * by 2px sideways and 6px vertically into a 12×20 hit box, and negative
 * margins give the padding back, so the flex `gap-1` stays the visible 4px
 * gap and neighbouring hit boxes touch without overlapping. 12px of pitch
 * cannot hold WCAG 2.5.8's 24px targets — the focusable, swipeable track and
 * the arrow keys are the equivalent controls.
 */
const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  (
    {
      count: ownCount,
      activeIndex: ownIndex,
      onActiveIndexChange,
      className,
      label,
      ...props
    },
    ref
  ) => {
    const carousel = React.useContext(CarouselContext)
    const standalone = ownCount !== undefined
    if (!standalone && !carousel) {
      throw new Error("CarouselDots needs a Carousel around it, or a count of its own")
    }
    const count = standalone ? Math.max(0, ownCount) : carousel!.count
    const activeIndex = standalone
      ? Math.max(0, Math.min(count - 1, ownIndex ?? 0))
      : carousel!.activeIndex
    const select = standalone ? (index: number) => onActiveIndexChange?.(index) : carousel!.scrollTo
    if (count === 0) return null
    return (
      <div
        ref={ref}
        data-slot="carousel-dots"
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        {Array.from({ length: count }, (_, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={index}
              type="button"
              data-slot="carousel-dot"
              aria-label={label ? label(index, count) : `${index + 1} / ${count}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => select(index)}
              className="-mx-0.5 -my-1.5 rounded-full px-0.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none",
                  isActive ? "w-6 bg-primary" : "w-2 bg-muted-foreground"
                )}
              />
            </button>
          )
        })}
      </div>
    )
  }
)
CarouselDots.displayName = "CarouselDots"

export { Carousel, CarouselContent, CarouselItem, CarouselDots }

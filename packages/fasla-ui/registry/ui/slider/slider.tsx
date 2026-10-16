"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: Slider (40500:60632), 42 variants.
 *
 * Built on Base UI's Slider, which owns the behaviour: a `slider` role on a
 * real range input in each thumb, `aria-valuenow` / `aria-valuemin` /
 * `aria-valuemax`, the arrow, Page Up / Page Down, Home and End keys,
 * dragging, pressing the track, and hidden inputs that submit the value with
 * a form. This file owns the look.
 *
 * Figma axis → code:
 *  - `Size` (sm / md / lg) → `size`. Only the track changes: 6, 8 and 12px.
 *    The thumb is 16px at every size.
 *  - `Style` Empty / Half-Full / Full → the value, not a prop: the minimum,
 *    anything between, and the maximum.
 *  - `Style` Double slider → a range: pass an array (`[20, 80]`) as `value` or
 *    `defaultValue` and you get a thumb per value, with the fill between them.
 *  - `Direction` → the page's `dir`, never a prop. In Arabic the fill starts
 *    at the right and the arrow keys follow what you see: the left arrow
 *    raises the value.
 *  - `State` Focus → keyboard focus (`:focus-visible`) on a thumb.
 *
 * Figma has no disabled variant, so the slider takes no `disabled` prop.
 *
 * Layers, named as in Figma (`data-slot`): `slider-track` (Track),
 * `slider-indicator` (the fill, Figma's `drag` / `Progress bar`) and
 * `slider-thumb` (Thumb), inside a `slider-control` and a `slider` root.
 */

type SliderSize = "sm" | "md" | "lg"
type SliderValue = number | readonly number[]

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * The direction the slider sits in, read from the DOM: the nearest `dir`,
 * else the computed `direction`. Base UI only learns the direction from its
 * DirectionProvider, and it needs it twice: to turn a pointer position into
 * a value and to mirror the arrow keys. It is read on mount and again
 * whenever a `dir` attribute changes anywhere on the page (a locale switch,
 * Storybook's toolbar), and as the pointer or focus arrives, which always
 * comes before a drag or a key press.
 */
function useDocumentDirection() {
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr")
  const ref = React.useRef<HTMLDivElement | null>(null)
  const read = React.useCallback(() => {
    const node = ref.current
    if (!node) return
    const attribute = node.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
    const isRtl =
      attribute === "rtl" ||
      (attribute !== "ltr" && getComputedStyle(node).direction === "rtl")
    setDirection(isRtl ? "rtl" : "ltr")
  }, [])
  useIsomorphicLayoutEffect(() => {
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
      subtree: true,
    })
    return () => observer.disconnect()
  }, [read])
  return { direction, ref, read }
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * The root: the full width of its container, as Figma's `Fill` resizing does
 * (235px is only the canvas width). It stops a drag from scrolling the page on
 * touch screens or selecting text.
 */
const sliderVariants = cva("relative w-full min-w-0 touch-none select-none")

/**
 * The control: what the pointer presses. It is as tall as the thumb (16px,
 * Figma's height for every variant), so the track sits centred in it.
 */
const sliderControlClasses = "relative flex h-4 w-full items-center"

/**
 * The Track: the full range, a `muted` pill (Figma `border radius/rounded`).
 * Heights per Figma: 6, 8 and 12px.
 *
 * The thumbs sit inside the track at its ends, never past them, as on
 * Figma's canvas: at the minimum the thumb's start edge meets the track's
 * start (Base UI's `thumbAlignment="edge"`).
 *
 * In forced colors (Windows high contrast) the browser drops the fill, so
 * the track gains a 1px inset outline in the system text colour there, as on
 * Progress.
 */
const sliderTrackVariants = cva(
  [
    "relative w-full rounded-full bg-muted",
    "forced-colors:outline forced-colors:outline-1 forced-colors:-outline-offset-1 forced-colors:outline-[CanvasText]",
  ],
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

/**
 * The Indicator: Figma's fill, `primary`, the track's full height (Base UI
 * sets `height: inherit`). It starts at the inline start of the track (the
 * left in English, the right in Arabic) and runs to the thumb's centre, so
 * its end is always under the thumb; in a range it runs from one thumb to
 * the other. Base UI positions it with `inset-inline-start`, so nothing here
 * says left or right.
 */
const sliderIndicatorClasses = "rounded-full bg-primary forced-colors:bg-[CanvasText]"

/**
 * The Thumb: a 16px circle at every size, `background` with a 1px `primary`
 * border and Figma's `shadow/sm` (exactly Tailwind 3's `shadow`, as on Tabs).
 *
 * Focus (Figma `State=Focus`): keyboard focus lands on the range input inside
 * the thumb, and the thumb answers with Figma's 4px ring in `ring` at 50%,
 * in place of the shadow. Pointer focus draws no ring. In forced colors,
 * where box shadows are not painted, a 2px system `Highlight` outline shows
 * focus instead.
 *
 * Why `data-focus-visible`, the one exception to the library's rule of
 * styling focus with a `focus-visible:` variant: Base UI puts the focusable
 * range input inside the thumb, as its last child, so no plain variant can
 * reach the thumb from it. `:has(:focus-visible)` can, but its class name
 * breaks the Storybook pseudo-states addon (see
 * src/storybook/pseudo-variant-order.test.ts). `focus-within:` would also
 * light the ring while the mouse drags, since Base UI focuses the input on
 * any press; Figma and every other component show it for the keyboard only.
 * So `SliderThumb` copies its input's `:focus-visible` onto the thumb.
 *
 * Touch: an invisible 24px circle round the thumb (`before:`) is what the
 * pointer presses, so the 16px thumb meets the WCAG 2.5.8 target size
 * without looking any bigger.
 *
 * Centring: Base UI centres the thumb on its value with an inline
 * `translate`, signed by the direction it was told. It only learns the
 * direction once the page runs, so a server-rendered Arabic thumb would sit
 * 16px off until then. `:dir()` reads the real direction in CSS from the
 * first paint, and sets the same values Base UI does.
 */
const sliderThumbClasses = cn(
  "block size-4 rounded-full border border-primary bg-background shadow outline-none",
  "![translate:-50%_-50%] [&:dir(rtl)]:![translate:50%_-50%]",
  "before:absolute before:-inset-1 before:rounded-full before:content-['']",
  "transition-[box-shadow] motion-reduce:transition-none",
  "data-[focus-visible]:shadow-none data-[focus-visible]:ring-4 data-[focus-visible]:ring-ring/50",
  "forced-colors:data-[focus-visible]:[outline:2px_solid_Highlight] forced-colors:data-[focus-visible]:[outline-offset:2px]"
)

/** Whether an input shows keyboard focus. Engines without `:focus-visible` fall back to any focus. */
function isFocusVisible(input: HTMLInputElement) {
  try {
    return input.matches(":focus-visible")
  } catch {
    return input.matches(":focus")
  }
}

/**
 * One thumb. It mirrors its input's `:focus-visible` onto itself as
 * `data-focus-visible` when the input gains focus, and clears it on blur:
 * a thumb reached with Tab shows the ring, a thumb pressed with the pointer
 * does not, exactly as the browser's own `:focus-visible` decides.
 */
function SliderThumb(props: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>) {
  const [focusVisible, setFocusVisible] = React.useState(false)
  return (
    <SliderPrimitive.Thumb
      {...props}
      data-slot="slider-thumb"
      data-focus-visible={focusVisible ? "" : undefined}
      className={sliderThumbClasses}
      onFocus={(event) => setFocusVisible(isFocusVisible(event.currentTarget))}
      onBlur={() => setFocusVisible(false)}
    />
  )
}

type SliderRootProps<Value extends SliderValue> = Omit<
  SliderPrimitive.Root.Props<Value>,
  "className" | "style" | "render" | "disabled" | "orientation" | "thumbAlignment"
>

export interface SliderProps<Value extends SliderValue = SliderValue> extends SliderRootProps<Value> {
  /** Track height: 6, 8 or 12px. The thumb is 16px at every size. */
  size?: SliderSize
  /**
   * Names the slider for screen readers when no visible label names it. With
   * two thumbs, prefer `getAriaLabel`, so each thumb has its own name.
   */
  "aria-label"?: string
  /** Names each thumb by its index: the start of a range is 0, the end is 1. */
  getAriaLabel?: (index: number) => string
  /**
   * The text screen readers hear for a thumb's value, such as "SAR 250". By
   * default they hear the number alone.
   */
  getAriaValueText?: (formattedValue: string, value: number, index: number) => string
  className?: string
}

function SliderImpl<Value extends SliderValue>(
  {
    size = "md",
    value,
    defaultValue,
    locale = "en-US",
    "aria-label": ariaLabel,
    getAriaLabel,
    getAriaValueText,
    className,
    onFocusCapture,
    onPointerEnter,
    ...props
  }: SliderProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { direction, ref: directionRef, read } = useDocumentDirection()
  const mergedRef = React.useMemo(() => mergeRefs(ref, directionRef), [ref, directionRef])

  // One thumb per value: a number is one thumb, an array one per entry.
  const initial = value ?? defaultValue
  const count = Array.isArray(initial) ? Math.max(initial.length, 1) : 1
  const range = count > 1

  // Base UI reads a range's thumbs as "20 start range" and "80 end range",
  // in English whatever the page's language. The number alone stays neutral;
  // each thumb's name comes from `getAriaLabel`.
  const valueText = getAriaValueText ?? (range ? (formatted: string) => formatted : undefined)

  return (
    <DirectionProvider direction={direction}>
      <SliderPrimitive.Root
        ref={mergedRef}
        data-slot="slider"
        data-size={size}
        value={value}
        defaultValue={defaultValue}
        // Keeps the digits Latin in Arabic, as in Figma's RTL variants, and
        // the server and the browser formatting the same text.
        locale={locale}
        thumbAlignment="edge"
        className={cn(sliderVariants(), className)}
        onFocusCapture={(event) => {
          read()
          onFocusCapture?.(event)
        }}
        onPointerEnter={(event) => {
          read()
          onPointerEnter?.(event)
        }}
        {...props}
      >
        <SliderPrimitive.Control data-slot="slider-control" className={sliderControlClasses}>
          <SliderPrimitive.Track data-slot="slider-track" className={sliderTrackVariants({ size })}>
            <SliderPrimitive.Indicator data-slot="slider-indicator" className={sliderIndicatorClasses} />
            {Array.from({ length: count }, (_, index) => (
              <SliderThumb
                key={index}
                index={index}
                aria-label={getAriaLabel ? undefined : ariaLabel}
                getAriaLabel={getAriaLabel}
                getAriaValueText={valueText}
              />
            ))}
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </DirectionProvider>
  )
}

/**
 * A slider: one thumb for a value, or two for a range. `Value` follows what
 * you pass, so `onValueChange` hands back a number for a number and an array
 * for an array.
 */
const Slider = React.forwardRef(SliderImpl) as (<Value extends SliderValue = SliderValue>(
  props: SliderProps<Value> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement) & { displayName?: string }
Slider.displayName = "Slider"

export {
  Slider,
  sliderVariants,
  sliderTrackVariants,
  type SliderSize,
  type SliderValue,
}

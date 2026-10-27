"use client"

import * as React from "react"
import { ChevronsLeftRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Slider } from "../../ui/slider/slider"

/*
 * Figma: `Gallery` (42478:479), Type=Before / After Compare.
 *
 * Two photos of the same place in one frame, split by a divider with a round
 * handle on it: the "before" photo from the start edge to the divider, the
 * "after" photo from the divider to the end edge, each with its pill label in
 * the top corner on its side. Moving the divider shows more of one and less
 * of the other. Figma draws the divider halfway, so that is the default.
 *
 * The control is the library's Slider, unchanged. Both photos fill the whole
 * frame, the after photo below and the before photo above it, clipped at the
 * divider, so a photo never squashes as the divider moves. Over the frame, on
 * the line of the handle, lies a Slider from 0 to 100 (the share of the frame
 * the before photo gets, measured from the start edge), with its wrapper
 * transparent: Figma's handle and divider are drawn here and follow its
 * value. The Slider is what keyboards and screen readers reach: one `slider`
 * in the tab order, with arrow keys, Page Up / Page Down, Home and End, and
 * its value read out as a percentage. When it has keyboard focus, the drawn
 * handle shows the house focus ring, since the Slider's own thumb is not
 * visible. The wrapper reaches 8px past both edges, so the Slider's 16px
 * thumb, which stops at the ends of its track, has its centre exactly on the
 * divider at every value. The Slider only catches the pointer on its 16px
 * band; the rest of the frame takes a press or a horizontal drag too, so the
 * whole 48px handle, or anywhere on the photos, moves the divider. Vertical
 * swipes still scroll the page on a phone.
 *
 * In Arabic the frame mirrors, as Figma's RTL variants draw it: the before
 * photo sits on the right (the start) and the after photo on the left, with
 * their labels in the top-right and top-left corners. The value still runs
 * from the start edge, so it rises as the divider moves left, and the left
 * arrow raises it, as the Slider does in Arabic. The photographs are never
 * flipped, and the handle's double chevron is symmetric, so it isn't either.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryBeforeAfterComparePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryBeforeAfterCompareCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading: how to use the comparison. */
  description: React.ReactNode
  /** The pill on the before photo, in its top start corner. */
  beforeLabel: React.ReactNode
  /** The pill on the after photo, in its top end corner. */
  afterLabel: React.ReactNode
  /** Names the divider's slider for screen readers. Plain text. */
  sliderLabel: string
  /** Shown in place of the photos when `photos` is an empty list. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryBeforeAfterCompareCopy> = {
  en: {
    eyebrow: "RENOVATION",
    heading: "Same room, eighteen months apart",
    description: "Drag the handle to compare the space before and after the refit.",
    beforeLabel: "Before",
    afterLabel: "After",
    sliderLabel: "Share of the before photo",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "تجديد",
    heading: "الغرفة نفسها بعد ثمانية عشر شهرًا",
    description: "اسحب المقبض لمقارنة المساحة قبل التجديد وبعده.",
    beforeLabel: "قبل",
    afterLabel: "بعد",
    sliderLabel: "نسبة ظهور صورة ما قبل التجديد",
    empty: "لا توجد صور بعد.",
  },
}

export interface GalleryBeforeAfterCompareProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryBeforeAfterCompareCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The two photos, in Figma's order: the before photo, then the after
   * photo. Shoot them from the same spot, at the same framing, or the
   * comparison jumps. None by default: each half shows a `muted`
   * placeholder. An empty list shows the `empty` line instead of the frame.
   * @default none: `muted` placeholders
   */
  photos?: GalleryBeforeAfterComparePhoto[]
  /**
   * Where the divider sits, from 0 to 100: the share of the frame the before
   * photo gets, from the start edge. Pass it with `onPositionChange` to
   * control the divider; leave it out and the block keeps its own.
   */
  position?: number
  /**
   * Where the divider starts when `position` isn't passed.
   * @default 50
   */
  defaultPosition?: number
  /** Called with the new position, 0 to 100, as the divider moves. */
  onPositionChange?: (position: number) => void
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

/** Whether an element shows keyboard focus. Engines without `:focus-visible` fall back to any focus. */
function isFocusVisible(element: Element) {
  try {
    return element.matches(":focus-visible")
  } catch {
    return element.matches(":focus")
  }
}

export function GalleryBeforeAfterCompare({
  locale = "en",
  eyebrow,
  heading,
  description,
  beforeLabel,
  afterLabel,
  sliderLabel,
  empty,
  photos,
  position,
  defaultPosition = 50,
  onPositionChange,
  className,
  ...props
}: GalleryBeforeAfterCompareProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const stageRef = React.useRef<HTMLDivElement>(null)
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const [ownPosition, setOwnPosition] = React.useState(() => clamp(defaultPosition))
  const [focusVisible, setFocusVisible] = React.useState(false)
  const current = clamp(position ?? ownPosition)

  const move = (next: number) => {
    const value = clamp(next)
    if (position === undefined) setOwnPosition(value)
    onPositionChange?.(value)
  }

  // A press or drag anywhere on the frame outside the Slider's band: the
  // position under the pointer, measured from the start edge.
  const fromPointer = (clientX: number) => {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    if (!rect.width) return
    const rtl = getComputedStyle(stage).direction === "rtl"
    const offset = rtl ? rect.right - clientX : clientX - rect.left
    move((offset / rect.width) * 100)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    // The Slider handles a press on its own band.
    if (sliderRef.current?.contains(event.target as Node)) return
    event.currentTarget.setPointerCapture(event.pointerId)
    fromPointer(event.clientX)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    fromPointer(event.clientX)
  }

  const [before, after] = photos ?? []
  const layer = (photo: GalleryBeforeAfterComparePhoto | undefined) =>
    photo ? (
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 size-full object-cover" />
    ) : null

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex w-full flex-col gap-3">
            {label ? <p className="text-xs font-medium text-primary">{label}</p> : null}
            <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          <p className="w-full max-w-[520px] text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>

        {photos && photos.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div
            ref={stageRef}
            className="relative aspect-[296/370] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg [@container(min-width:40rem)]:aspect-[640/400] [@container(min-width:64rem)]:aspect-[1248/600]"
            style={{ "--gallery-compare-position": `${current}%` } as React.CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
          >
            <div className="absolute inset-0 bg-muted">{layer(after)}</div>
            <div className="absolute inset-0 bg-muted [clip-path:inset(0_calc(100%_-_var(--gallery-compare-position))_0_0)] [&:dir(rtl)]:[clip-path:inset(0_0_0_calc(100%_-_var(--gallery-compare-position)))]">
              {layer(before)}
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-[var(--gallery-compare-position)] -ms-px w-0.5 bg-card" />
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute start-[var(--gallery-compare-position)] top-1/2 -ms-6 -mt-6 flex size-12 items-center justify-center rounded-full bg-card text-foreground shadow-lg",
                focusVisible && "outline outline-2 outline-offset-2 outline-ring"
              )}
            >
              <ChevronsLeftRight size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-6" />
            </div>

            <span className="pointer-events-none absolute start-3 top-3 whitespace-nowrap rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground [@container(min-width:40rem)]:start-6 [@container(min-width:40rem)]:top-6">
              {beforeLabel ?? copy.beforeLabel}
            </span>
            <span className="pointer-events-none absolute end-3 top-3 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground [@container(min-width:40rem)]:end-6 [@container(min-width:40rem)]:top-6">
              {afterLabel ?? copy.afterLabel}
            </span>

            <div
              ref={sliderRef}
              className="absolute -end-2 -start-2 top-1/2 -mt-2 cursor-ew-resize opacity-0"
              onFocus={(event) => setFocusVisible(isFocusVisible(event.target))}
              onBlur={() => setFocusVisible(false)}
            >
              <Slider
                value={current}
                onValueChange={(value) => move(value)}
                min={0}
                max={100}
                aria-label={sliderLabel ?? copy.sliderLabel}
                getAriaValueText={(_formatted, value) => `${Math.round(value)}%`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryBeforeAfterCompareCopy = COPY

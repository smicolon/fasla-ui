"use client"

import * as React from "react"
import { ChevronLeft, Star } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"

/*
 * Figma: `Social Proof` (46368:3361). The parts every `social-proof-*` block
 * is built from: the section and its 1216px column, the header, a quote, the
 * author line under it, the five stars, the hairline between a quote and its
 * author, and the previous / next arrows.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Pricing and Gallery blocks are: the section is a query container, so a block
 * lays out for the room it is given. The base classes are Figma's Mobile
 * (360); `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself. The page's
 * `dir` sets the direction; nothing here takes one.
 *
 * No block ships with photos. Every person and photo slot has an id, and a
 * block takes `photos`, a map from those ids to image URLs: without it the
 * avatars show initials and the photo slots their `muted` ground.
 */

export type SocialProofLocale = "en" | "ar"

/** Photo URLs by id: a person's id (`"sami-naji"`) or a block's photo slot. */
export type SocialProofPhotos = Partial<Record<string, string>>

/** Someone quoted: the id their photo is keyed by, their name and their role. */
export interface SocialProofPerson {
  /** The key in `photos` for this person's avatar. */
  id: string
  /** Up to 19 characters in English, 19 in Arabic. */
  name: string
  /** Role and company. Up to 48 characters in English, 50 in Arabic. */
  role: React.ReactNode
}

/**
 * A figure, a handle or a time inside a sentence: `2,300+`, `28%`, `2.1×`,
 * `@Fasla`, `2:14`, `1.2K`, `01 / 04`. Each is a neutral run that an Arabic
 * sentence would reorder (`+2,300`, `Fasla@`), so it is set in its own
 * left-to-right isolate, as Figma's LRI…PDI marks set it.
 */
const FIGURE = /(@[A-Za-z0-9_.]+|\d+ \/ \d+|[−–-]?\$?\d[\d,.:]*[×%+Kh]?)/

/** Text with every figure and handle in its own left-to-right isolate. Anything but a string passes through. */
export function Isolated({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>
  const parts = children.split(FIGURE)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <bdi key={index} dir="ltr">
            {part}
          </bdi>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

export interface SocialProofSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the column inside the padding. */
  contentClassName?: string
}

/**
 * Figma's section: `background`, padding 96 × 112 on Desktop, 64 × 24 on
 * Tablet and 32 × 16 on phones, and a 1216px column. Each block sets the gap
 * between its header and what follows on `contentClassName`.
 */
export function SocialProofSection({ labelledBy, className, contentClassName, children, ...props }: SocialProofSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-28 lg:py-24", className)}
      {...props}
    >
      <div className={cn("mx-auto flex w-full max-w-[1216px] flex-col items-center", contentClassName)}>{children}</div>
    </section>
  )
}

/** Figma's two header sizes: 4XL (3XL on phones), or 3XL (2XL on phones). */
export type SocialProofHeadingSize = "4xl" | "3xl"

const HEADING: Record<SocialProofHeadingSize, string> = {
  "4xl": "text-3xl [@container(min-width:40rem)]:text-4xl",
  "3xl": "text-2xl [@container(min-width:40rem)]:text-3xl",
}

export interface SocialProofHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The section's heading, an `h2`. Up to 46 characters in English, 40 in Arabic. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. Up to 128 characters in English, 125 in Arabic. */
  description?: React.ReactNode
  headingSize?: SocialProofHeadingSize
  /** LG under a 4XL heading, Base under a 3XL one. */
  descriptionSize?: "lg" | "base"
}

/**
 * The centred header: the heading, Semi Bold in `foreground`, and the
 * description in `muted-foreground` under it.
 */
export function SocialProofHeader({
  headingId,
  heading,
  description,
  headingSize = "4xl",
  descriptionSize = "lg",
  className,
  children,
  ...props
}: SocialProofHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col items-center gap-4 text-center", className)} {...props}>
      <h2 id={headingId} className={cn("font-semibold text-foreground", HEADING[headingSize])}>
        <Isolated>{heading}</Isolated>
      </h2>
      {description ? (
        <p className={cn("text-muted-foreground", descriptionSize === "lg" ? "text-lg" : "text-base")}>
          <Isolated>{description}</Isolated>
        </p>
      ) : null}
      {children}
    </header>
  )
}

export interface SocialProofPhotoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The image URL, from the block's `photos`. Without it the slot shows its `muted` ground. */
  src?: string
  /** Describes the photo. "" for a portrait beside the person's name, which already says who it is. */
  alt?: string
}

/**
 * A photo slot: the image cropped to fill the slot, or the slot's `muted`
 * ground when no photo is passed, as the About blocks show an empty slot.
 * Photographs never mirror in RTL; only the slot moves.
 */
export function SocialProofPhoto({ src, alt = "", className, ...props }: SocialProofPhotoProps) {
  return (
    <div className={cn("overflow-hidden bg-muted", className)} {...props}>
      {src ? <img src={src} alt={alt} decoding="async" loading="lazy" className="size-full object-cover" /> : null}
    </div>
  )
}

/** The default accessible name of the five stars, per language. */
const STARS_LABEL: Record<SocialProofLocale, string> = { en: "Rated 5 out of 5", ar: "التقييم 5 من 5" }

export interface SocialProofStarsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Figma's Rating colours: `warning` is Amber, `primary` is Primary. */
  tone?: "warning" | "primary"
  locale?: SocialProofLocale
}

/**
 * STAND-IN for the Rating atom (Figma `363:7242`), which is not in the code
 * library yet: five full 16px stars, touching, as Figma's `sm` Rating draws
 * them. Replace it with the Rating atom once it exists. That atom needs a
 * `value` prop: Figma's `Filled=True` draws 4½ stars, and every Social Proof
 * instance overrides the half star to show five.
 */
export function SocialProofStars({ tone = "warning", locale = "en", className, ...props }: SocialProofStarsProps) {
  return (
    <span role="img" aria-label={STARS_LABEL[locale]} className={cn("inline-flex shrink-0", tone === "warning" ? "text-warning" : "text-primary", className)} {...props}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={16} strokeWidth={0} fill="currentColor" aria-hidden />
      ))}
    </span>
  )
}

/**
 * STAND-IN for the Separator atom (Figma `14860:69243`), which is not in the
 * code library yet: a 1px `border` line across its container, as Pricing's
 * `PricingRule` is. Replace it with the Separator atom once it exists.
 */
export function SocialProofRule({ className }: { className?: string }) {
  return <div role="presentation" className={cn("w-full border-t border-border", className)} />
}

export interface SocialProofQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  quote: React.ReactNode
}

/** The customer's words as a `blockquote`, its paragraph styled by the block. */
export function SocialProofQuote({ quote, className, ...props }: SocialProofQuoteProps) {
  return (
    <blockquote className={cn("m-0", className)} {...props}>
      <p>
        <Isolated>{quote}</Isolated>
      </p>
    </blockquote>
  )
}

export interface SocialProofAuthorProps extends React.HTMLAttributes<HTMLElement> {
  person: SocialProofPerson
  photos?: SocialProofPhotos
  /** Figma's Avatar size: 32, or 24 in Giant Quote Duo. */
  avatarSize?: "32" | "24"
  /** Classes for the avatar, for the walls that draw the 32 Avatar at 28 or 36. */
  avatarClassName?: string
  /** SM Medium names, or SM Semi Bold in Tweet Wall. */
  nameClassName?: string
  /** The role's size: SM in the trio cards, XS everywhere else. */
  roleSize?: "sm" | "xs"
  /** The role's colour class, `text-muted-foreground` unless the card is dark. */
  roleClassName?: string
  /** The gap: 12px beside a 32 Avatar, 10px in the walls and the duo. */
  gap?: "3" | "2.5"
  /** Anything after the name and role, such as Tweet Wall's X mark. */
  trailing?: React.ReactNode
}

/**
 * The author line: the Avatar, then the name in `foreground` over the role.
 * It is the `figcaption` of the `figure` that holds the quote, the name a
 * `<cite>`, so it must sit inside that figure.
 * The avatar is decorative beside the name: it shows the photo or, without
 * one, the person's initials, and assistive tech skips it.
 */
export function SocialProofAuthor({
  person,
  photos,
  avatarSize = "32",
  avatarClassName,
  nameClassName = "font-medium",
  roleSize = "xs",
  roleClassName = "text-muted-foreground",
  gap = "3",
  trailing,
  className,
  ...props
}: SocialProofAuthorProps) {
  return (
    <figcaption className={cn("flex w-full items-center", gap === "3" ? "gap-3" : "gap-2.5", className)} {...props}>
      <Avatar aria-hidden size={avatarSize} radius="rounded" src={photos?.[person.id]} name={person.name} className={cn("shrink-0", avatarClassName)} />
      <div className={cn("flex min-w-0 flex-1 flex-col", roleSize === "sm" && "gap-0.5")}>
        <cite className={cn("text-sm not-italic", nameClassName)}>{person.name}</cite>
        <span className={cn(roleSize === "sm" ? "text-sm" : "text-xs", roleClassName)}>
          <Isolated>{person.role}</Isolated>
        </span>
      </div>
      {trailing}
    </figcaption>
  )
}

/** The arrows' accessible names, per language. */
const STEP_LABELS: Record<SocialProofLocale, { previous: string; next: string }> = {
  en: { previous: "Previous", next: "Next" },
  ar: { previous: "السابق", next: "التالي" },
}

export interface SocialProofStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The item or set shown, from 0. */
  index: number
  /** How many items or sets there are. */
  count: number
  onIndexChange: (index: number) => void
  locale?: SocialProofLocale
  /** Overrides the arrows' accessible names. */
  labels?: { previous: string; next: string }
  /** Figma's Icon Button: Ghost xs (26px) in App Review Row, Outline xs in the carousels. */
  variant?: "ghost" | "outline"
  /** Names the region the arrows step through. */
  controls?: string
}

/**
 * The previous and next arrows, Figma's Icon Button. Paging stops at both
 * ends rather than wrapping, so previous is disabled on the first item and
 * next on the last. The arrows follow the reading direction: previous sits at
 * the start and points back, so in Arabic it is the right-hand arrow, pointing
 * right.
 */
export function SocialProofStepper({
  index,
  count,
  onIndexChange,
  locale = "en",
  labels,
  variant = "ghost",
  controls,
  className,
  ...props
}: SocialProofStepperProps) {
  const names = labels ?? STEP_LABELS[locale]
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button
        type="button"
        variant={variant}
        size="icon-xs"
        aria-label={names.previous}
        aria-controls={controls}
        disabled={index <= 0}
        onClick={() => onIndexChange(index - 1)}
      >
        <ChevronLeft aria-hidden className="rtl:rotate-180" />
      </Button>
      <Button
        type="button"
        variant={variant}
        size="icon-xs"
        aria-label={names.next}
        aria-controls={controls}
        disabled={index >= count - 1}
        onClick={() => onIndexChange(index + 1)}
      >
        <ChevronLeft aria-hidden className="rotate-180 rtl:rotate-0" />
      </Button>
    </div>
  )
}

/**
 * Whether the page reads right to left, from the closest `dir`. Swipes use it:
 * on an Arabic page, swiping toward the right goes to the next item.
 */
function isRtl(el: Element | null) {
  return el?.closest("[dir]")?.getAttribute("dir") === "rtl"
}

/**
 * Swipe to step, for the blocks whose motion note offers it on Mobile: a
 * horizontal drag of 40px or more steps once, toward the next item when it
 * moves against the reading direction. Touch and pen only, and only while the
 * swiped element is phone-sized (under 640px, Figma's Tablet), as the notes
 * offer it on Mobile alone; a vertical drag scrolls the page as usual. Spread
 * the result on the element to swipe.
 */
export function useSwipeStep(step: (delta: 1 | -1) => void) {
  const start = React.useRef<{ x: number; y: number } | null>(null)
  return {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" || event.currentTarget.getBoundingClientRect().width >= 640) return
      start.current = { x: event.clientX, y: event.clientY }
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      const from = start.current
      start.current = null
      if (!from) return
      const dx = event.clientX - from.x
      const dy = event.clientY - from.y
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
      const forward = isRtl(event.currentTarget) ? dx > 0 : dx < 0
      step(forward ? 1 : -1)
    },
    onPointerCancel: () => {
      start.current = null
    },
  }
}

/**
 * The arrow keys, for a block the reader steps through: the key pointing along
 * the reading direction goes to the next item, so on an Arabic page the left
 * arrow is next. Home and End jump to the first and last item. Spread the
 * result on the focusable region or the row of choices.
 */
export function stepKeys(index: number, count: number, go: (index: number) => void) {
  return (event: React.KeyboardEvent<HTMLElement>) => {
    const rtl = isRtl(event.currentTarget)
    const next = rtl ? "ArrowLeft" : "ArrowRight"
    const previous = rtl ? "ArrowRight" : "ArrowLeft"
    let target: number | null = null
    if (event.key === next) target = Math.min(index + 1, count - 1)
    else if (event.key === previous) target = Math.max(index - 1, 0)
    else if (event.key === "Home") target = 0
    else if (event.key === "End") target = count - 1
    if (target === null) return
    event.preventDefault()
    if (target !== index) go(target)
  }
}

/*
 * Motion, from the house presets in src/motion/presets.ts, copied as values
 * so the block installs without them, as the Hero and Sheet blocks do:
 * `fast` 120ms, `base` 180ms, the `standard` curve, and items entering 60ms
 * apart (the stagger preset). Reduced motion keeps opacity only, in 120ms,
 * with no stagger. It runs on the Web Animations API, like the other blocks.
 */
// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const FAST_MS = 120
const BASE_MS = 180
const STAGGER_MS = 60
const STANDARD = "cubic-bezier(0.2, 0, 0, 1)"

function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Plays an entrance on each element: a fade (fadeIn) or, with `slide`, a 10px
 * rise with the fade (slideUp), 180ms each, 60ms apart with `stagger`. An
 * element marked `data-step-item="slide"` or `"fade"` picks its own. With
 * reduced motion every element fades in together in 120ms.
 */
export function playEntrance(
  nodes: HTMLElement[],
  { slide = false, stagger = true, fromX }: { slide?: boolean; stagger?: boolean; fromX?: number } = {}
) {
  const reduced = prefersReducedMotion()
  return nodes
    .filter((node) => typeof node.animate === "function")
    .map((node, index) =>
      node.animate(
        reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : fromX !== undefined
            ? [{ opacity: 0, transform: `translateX(${fromX}px)` }, { opacity: 1, transform: "none" }]
            : !(node.dataset.stepItem === "slide" || (slide && node.dataset.stepItem !== "fade"))
              ? [{ opacity: 0 }, { opacity: 1 }]
              : [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        {
          duration: reduced ? FAST_MS : BASE_MS,
          delay: reduced || !stagger ? 0 : index * STAGGER_MS,
          easing: STANDARD,
          fill: "backwards",
        }
      )
    )
}

/**
 * Fades the elements out together, 180ms (120ms with reduced motion), and
 * resolves when they are gone. With `toX` they also move that many pixels
 * sideways, in 120ms: the horizontal swap's exit.
 */
export function playExit(nodes: HTMLElement[], { toX }: { toX?: number } = {}) {
  const reduced = prefersReducedMotion()
  const animations = nodes
    .filter((node) => typeof node.animate === "function")
    .map((node) =>
      node.animate(
        !reduced && toX !== undefined
          ? [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${toX}px)` }]
          : [{ opacity: 1 }, { opacity: 0 }],
        { duration: reduced || toX !== undefined ? FAST_MS : BASE_MS, easing: STANDARD, fill: "forwards" }
      )
    )
  return Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)))
}

/** How far a horizontal swap moves, in px: the `slideX` preset's 24. */
const SLIDE_X = 24

/**
 * State for content the reader steps through or picks from: a set of
 * reviews, a quote, a story, a portrait. `go` fades the shown items
 * (`[data-step-item]` inside `ref`) out unless `exit` is off, swaps the index,
 * then plays their entrance on the new ones, 60ms apart with `stagger`. It is
 * manual only: nothing advances on a timer, and it stops at both ends.
 */
export function useStepper<T extends HTMLElement>({
  count,
  index: controlled,
  onIndexChange,
  defaultIndex = 0,
  slide = true,
  stagger = false,
  exit = true,
  axis = "y",
}: {
  count: number
  index?: number
  onIndexChange?: (index: number) => void
  defaultIndex?: number
  slide?: boolean
  stagger?: boolean
  exit?: boolean
  /**
   * `"x"` swaps sideways (the `slideX` preset): every item leaves toward the
   * start of the swap and the new ones arrive from the other side, mirrored on
   * a right-to-left page. Going forward is toward the reading direction's end.
   */
  axis?: "x" | "y"
}) {
  const ref = React.useRef<T>(null)
  const step = React.useRef(1)
  const [own, setOwn] = React.useState(defaultIndex)
  const index = Math.min(Math.max(controlled ?? own, 0), Math.max(count - 1, 0))
  const changed = React.useRef(false)
  const items = () => Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-step-item]") ?? [])
  useIsomorphicLayoutEffect(() => {
    if (!changed.current) return
    changed.current = false
    playEntrance(items(), { slide, stagger, fromX: axis === "x" ? step.current * SLIDE_X : undefined })
  }, [index, slide, stagger, axis])
  const go = React.useCallback(
    (next: number) => {
      if (next < 0 || next >= count || next === index) return
      const swap = () => {
        changed.current = true
        setOwn(next)
        onIndexChange?.(next)
      }
      // +1 when the new item comes in from the end side: right in LTR, left in RTL.
      step.current = (next > index ? 1 : -1) * (isRtl(ref.current) ? -1 : 1)
      if (exit) playExit(items(), { toX: axis === "x" ? -step.current * SLIDE_X : undefined }).then(swap)
      else swap()
    },
    [count, index, onIndexChange, exit, axis]
  )
  return { ref, index, go }
}

/**
 * How many columns a stacked layout has room for, by the element's own width:
 * one on phones, two from 640px (Figma's Tablet), three from 1024px (its
 * Desktop), as the container queries split them. It starts at one, so the
 * first render is the phone layout until the element has been measured.
 */
export function useColumnCount<T extends HTMLElement>(max: 2 | 3 = 3) {
  const ref = React.useRef<T>(null)
  const [count, setCount] = React.useState(1)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = (width: number) => setCount(width >= 1024 && max === 3 ? 3 : width >= 640 ? 2 : 1)
    measure(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver((entries) => measure(entries[0]?.contentRect.width ?? el.getBoundingClientRect().width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [max])
  return [ref, count] as const
}

/**
 * Splits items into columns the way Figma's walls do: three columns take the
 * items in runs (1–2, 3–4, 5–6), two columns take them in turn (1, 3, 5 and
 * 2, 4, 6), and one column takes them all.
 */
export function toColumns<T>(items: T[], count: number): T[][] {
  if (count <= 1) return [items]
  if (count === 2) return [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)]
  const size = Math.ceil(items.length / count)
  return Array.from({ length: count }, (_, i) => items.slice(i * size, (i + 1) * size))
}

/**
 * Plays the entrance once, the first time the element enters the viewport:
 * its `[data-reveal]` children fade in one after another (fadeIn with the
 * stagger preset), then stay. Vertical Column Wall's reveal is the only
 * entrance in Social Proof. Besides it, only the two column Types move on
 * their own (`useDrift`); everything else moves when the reader acts.
 */
export function useRevealOnce<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return
    let animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        animations = playEntrance(Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]")))
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [])
  return ref
}

/** The play and stop buttons' accessible names, per language. */
const VIDEO_LABELS: Record<SocialProofLocale, { play: string; stop: string }> = {
  en: { play: "Play", stop: "Close video" },
  ar: { play: "تشغيل", stop: "إغلاق الفيديو" },
}

/**
 * The play state of a story's video, for Video Story Cards and Proof Bento.
 * The video starts only when the reader presses play: no hover preview, no
 * autoplay, no pulse. Starting swaps the poster for the video with a fade
 * (fadeIn, 180ms; 120ms with reduced motion), and the video's own controls
 * take over. Figma shows the poster only, so the playing state and the way
 * out of it, `stop`, are the block's. Focus follows: to the video on play,
 * back to the play button on stop. Without a `src` there is nothing to play.
 */
export function useVideoPlayback(src: string | undefined, locale: SocialProofLocale = "en") {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const playRef = React.useRef<HTMLButtonElement>(null)
  const [started, setStarted] = React.useState(false)
  const refocus = React.useRef(false)
  const play = () => {
    if (!src) return
    setStarted(true)
  }
  const stop = React.useCallback(() => {
    videoRef.current?.pause()
    refocus.current = true
    setStarted(false)
  }, [])
  useIsomorphicLayoutEffect(() => {
    const video = videoRef.current
    if (started && video) {
      playEntrance([video], { slide: false, stagger: false })
      video.currentTime = 0
      const playing = video.play?.()
      playing?.catch?.(() => {})
      video.focus()
    } else if (refocus.current) {
      refocus.current = false
      playRef.current?.focus()
    }
  }, [started])
  return { videoRef, playRef, started, play, stop, labels: VIDEO_LABELS[locale], available: Boolean(src) }
}

/*
 * Drift: the two column Types move on their own while they are in view, as
 * the home page's wall of love does. It is the only motion in Social Proof
 * that no one asked for, so it is held back wherever it could cost someone:
 * it runs only while the block is in the viewport, pauses while the pointer
 * is over it or focus is inside it, and does not run at all with reduced
 * motion (a still frame). There is no pause button: hover and focus are the
 * pause, and the block has nothing in it to read that moves faster than a
 * slow loop.
 */

/*
 * Reading speeds, in px per second. A column's loop lasts its distance (one
 * copy's height plus the gap) divided by its speed, so every variant reads at
 * the same pace whatever its card heights. Tune the drift here.
 */

/** Vertical Column Wall: the outer columns, and the middle one a little slower so the parallax stays. */
export const WALL_DRIFT_SPEED = { outer: 42, middle: 38 }

/** Staggered Columns: every column, up or down. */
export const STAGGERED_DRIFT_SPEED = 40

/** How long a loop of `distance` px takes at `speed` px per second, in ms. */
export function driftDuration(distance: number, speed: number) {
  return (distance / speed) * 1000
}

/**
 * Runs the animations `make` builds for `root`, only while it is in view and
 * not hovered or holding focus. `make` is called again when the root's width
 * changes, or the size of anything `watch` selects, since the distances depend
 * on the cards' heights (which change as fonts and photos load). The
 * animations are cancelled on unmount and when reduced motion is turned on.
 */
export function useDrift<T extends HTMLElement>(make: (root: T) => Animation[], deps: React.DependencyList, watch = "[data-drift] > :first-child") {
  const ref = React.useRef<T>(null)
  React.useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === "undefined" || prefersReducedMotion()) return
    let animations: Animation[] = []
    let visible = false
    let hovered = false
    let focused = false
    const sync = () => animations.forEach((animation) => (visible && !hovered && !focused ? animation.play() : animation.pause()))
    const start = () => {
      animations.forEach((animation) => animation.cancel())
      animations = []
      // A resize after reduced motion was turned on must not bring the drift back.
      if (prefersReducedMotion()) return
      animations = make(root)
      animations.forEach((animation) => animation.pause())
      sync()
    }
    start()
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    intersection.observe(root)
    let frame = 0
    const watched = () => Array.from(root.querySelectorAll<HTMLElement>(watch))
    const measure = () => [root, ...watched()].map((el) => Math.round(el.getBoundingClientRect().height) + "x" + Math.round(el.getBoundingClientRect().width)).join()
    let size = measure()
    const resize =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            const next = measure()
            if (next === size) return
            size = next
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(start)
          })
    resize?.observe(root)
    watched().forEach((el) => resize?.observe(el))
    const enter = () => ((hovered = true), sync())
    const leave = () => ((hovered = false), sync())
    const focusIn = () => ((focused = true), sync())
    const focusOut = (event: FocusEvent) => {
      focused = root.contains(event.relatedTarget as Node | null)
      sync()
    }
    root.addEventListener("pointerenter", enter)
    root.addEventListener("pointerleave", leave)
    root.addEventListener("focusin", focusIn)
    root.addEventListener("focusout", focusOut)
    const reduce = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null
    const stopForReduced = () => {
      if (reduce?.matches) animations.forEach((animation) => animation.cancel())
    }
    reduce?.addEventListener?.("change", stopForReduced)
    return () => {
      cancelAnimationFrame(frame)
      intersection.disconnect()
      resize?.disconnect()
      root.removeEventListener("pointerenter", enter)
      root.removeEventListener("pointerleave", leave)
      root.removeEventListener("focusin", focusIn)
      root.removeEventListener("focusout", focusOut)
      reduce?.removeEventListener?.("change", stopForReduced)
      animations.forEach((animation) => animation.cancel())
    }
    // `make` is rebuilt every render; `deps` says when it would build something different.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

/** True once mounted without reduced motion: when a drifting block adds its looped repeat. */
export function useCanDrift() {
  const [can, setCan] = React.useState(false)
  React.useEffect(() => setCan(!prefersReducedMotion()), [])
  return can
}

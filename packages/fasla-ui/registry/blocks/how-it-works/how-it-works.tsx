"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `How it Works` (42334:294272). The parts every `how-it-works-*` block
 * is built from, one per thing the Figma set repeats: the section and its
 * 1248px column, the eyebrow line, the plain hairline, a run of figures that
 * keeps its order in Arabic, and the helpers that play a block's motion once.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Careers and Pricing blocks are: the section is a query container, so a block
 * lays out for the room it is given, such as a docs preview narrower than the
 * screen. The base classes are Figma's Mobile (360, 296px of content);
 * `[@container(min-width:40rem)]:` is its Tablet, from 640px of content
 * (Figma's Tablet, 768 less its padding), and `[@container(min-width:64rem)]:`
 * its Desktop, from 1024px of content. The section's own padding still follows
 * the window, since an element can't query itself. The page's `dir` sets the
 * direction; nothing here takes one.
 *
 * Where the code differs from Figma, for every Type in the set:
 *
 * - Separator: the code library has no Separator component yet, so the 1px
 *   hairline is `HowItWorksRule`, a line in the `border` token. Replace it with
 *   Separator once that is built.
 * - Motion plays once, when the block enters the view. Nothing is tied to the
 *   scroll position, pinned, cycled on a timer, autoplayed or looped for good:
 *   a loop in Figma runs a few times and rests, and under
 *   `prefers-reduced-motion` a block renders its finished state. See each
 *   Type's own comment for what it dropped from its Figma motion card.
 * - A scrim over a photo stays dark, and the text on it light, in Light and in
 *   Dark, as Gallery does it, so white text stays readable on the photo.
 *   Figma's `custom/black` and `custom/white` flip in Dark; here they are
 *   `background-inverse` and `foreground-inverse`, pinned as Gallery pins them.
 */

export type HowItWorksLocale = "en" | "ar"

export interface HowItWorksSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the 1248px column inside the padding. */
  contentClassName?: string
}

/**
 * Figma's section: `theme/background`, padding 96 on Desktop, 64 on Tablet and
 * 32 on phones, a 1248px column and 48px between its parts.
 */
export const HowItWorksSection = React.forwardRef<HTMLElement, HowItWorksSectionProps>(function HowItWorksSection(
  { labelledBy, className, contentClassName, children, ...props },
  ref
) {
  return (
    <section ref={ref} aria-labelledby={labelledBy} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className={cn("mx-auto flex w-full max-w-[1248px] flex-col gap-12", contentClassName)}>{children}</div>
    </section>
  )
})

/** A photo a block shows: its file and what it shows. Pass `alt=""` for a purely decorative one. */
export interface HowItWorksPhoto {
  src: string
  alt: string
}

/**
 * A photo filling its box, cropped to fit. The box (`relative`, a `muted`
 * fill and `overflow-hidden`) is the caller's; without a photo it stays a
 * quiet `muted` placeholder.
 */
export function HowItWorksImage({ photo, className }: { photo?: HowItWorksPhoto; className?: string }) {
  if (!photo) return null
  return <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable={false} className={cn("absolute inset-0 size-full object-cover", className)} />
}

/**
 * The dark scrim under white text on a photo: Figma's stack of flat black
 * layers, one over the whole photo and three stronger over its lower part, so
 * the foot is about 70% black and the top about 28%. Each layer is `base-black`
 * at a fixed strength, the same in Light and in Dark. Inside a `group`, hovering
 * deepens the whole stack. Place it between the photo and the text.
 */
export function HowItWorksScrim({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <span className="absolute inset-0 bg-base-black/[0.28] transition-colors duration-[250ms] group-hover:bg-base-black/[0.42] motion-reduce:transition-none" />
      <span className="absolute inset-x-0 bottom-0 h-3/5 bg-base-black/20" />
      <span className="absolute inset-x-0 bottom-0 h-2/5 bg-base-black/25" />
      <span className="absolute inset-x-0 bottom-0 h-1/4 bg-base-black/30" />
    </span>
  )
}

export interface HowItWorksHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The small line above the heading. Hidden when empty. */
  eyebrow?: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description?: React.ReactNode
  /** Classes for the eyebrow, the heading and the line: how a Type recolours them on its own surface. */
  eyebrowClassName?: string
  headingClassName?: string
  descriptionClassName?: string
}

/**
 * The left-aligned header most Types open with: an eyebrow, a heading (3XL on
 * phones, 4XL on Tablet, 5XL on Desktop) and a line, 12px apart.
 */
export function HowItWorksHeader({ headingId, eyebrow, heading, description, eyebrowClassName, headingClassName, descriptionClassName, className, children, ...props }: HowItWorksHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col items-start gap-3", className)} {...props}>
      {eyebrow ? <HowItWorksEyebrow className={eyebrowClassName}>{eyebrow}</HowItWorksEyebrow> : null}
      <h2 id={headingId} className={cn("text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl [@container(min-width:64rem)]:text-5xl", headingClassName)}>
        {heading}
      </h2>
      {description ? <p className={cn("max-w-[720px] text-base text-muted-foreground", descriptionClassName)}>{description}</p> : null}
      {children}
    </header>
  )
}

/**
 * The small line above a heading: `XS/Medium` in `primary`, set in capitals
 * with 8% tracking. Arabic has no capitals and joins its letters, so in RTL
 * the tracking is dropped.
 */
export function HowItWorksEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-medium uppercase tracking-[0.08em] text-primary [&:dir(rtl)]:tracking-normal", className)}>{children}</p>
}

/**
 * Figma's `Separator`: a 1px `border` line across its container. The code
 * library has no Separator component yet; swap this for it once it does.
 */
export function HowItWorksRule({ className }: { className?: string }) {
  return <div role="presentation" className={cn("w-full border-t border-border", className)} />
}

/** The theme colours a glow can take. Each is a token, never a raw colour. */
export type HowItWorksGlowTone = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5" | "info" | "success" | "warning" | "destructive"

const GLOW_TONES: Record<HowItWorksGlowTone, string> = {
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

export interface HowItWorksGlowProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: HowItWorksGlowTone
  /** How solid the shape is, 0 to 1. Figma sets 0.4 to 0.55. */
  strength?: number
}

/**
 * A soft blurred shape of colour for a background: an ellipse in a theme
 * token, blurred and thinned to `strength`. Figma's 64px layer blur is a
 * Gaussian radius, which CSS spells as half that: `blur(32px)`. Place it with `style` or
 * classes inside a box that clips (`overflow-hidden`). It carries no meaning,
 * so it is hidden from screen readers.
 */
export function HowItWorksGlow({ tone, strength = 0.5, className, style, ...props }: HowItWorksGlowProps) {
  return <span aria-hidden="true" className={cn("pointer-events-none absolute rounded-[50%] blur-[32px]", GLOW_TONES[tone], className)} style={{ opacity: strength, ...style }} {...props} />
}

/**
 * A run that keeps its left-to-right order inside Arabic text: a time such as
 * `09:00`, a figure, a code. Western digits stay Western in Figma's Arabic.
 */
export function HowItWorksLtr({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={cn("whitespace-nowrap", className)}>
      {children}
    </bdi>
  )
}

/**
 * A line with figures in it, such as "12 دقيقة" or "Locks again in 30
 * seconds": each run of digits is set in its own left-to-right isolate, so a
 * figure keeps its order and the words around it keep theirs. Anything but a
 * string passes through untouched.
 */
export function HowItWorksFigures({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>
  const parts = children.split(/(\d[\d.,:%]*)/)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <HowItWorksLtr key={index}>{part}</HowItWorksLtr>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

/** The stroke Figma gives every Lucide icon in the set: 1.5px at any size. Spread it onto an icon. */
export const HOW_IT_WORKS_ICON = { strokeWidth: 1.5, absoluteStrokeWidth: true } as const

/** Figma's ease-out: fast at the start, a soft settle. */
export const EASE_OUT = "cubic-bezier(0, 0, 0.2, 1)"

/** Whether the visitor asked for less motion. False where there are no media queries. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Anything a block's entrance starts that can be stopped: a Web Animation, or a count that steps by hand. */
export type Cancellable = { cancel(): void }

/**
 * Counts a figure up from 0 to `value` over `duration` ms, writing into the
 * text node it already has, and leaves the final value in place. Returns a
 * handle that stops it and restores the value.
 */
export function countUp(element: HTMLElement, value: number, duration = 500, delay = 0): Cancellable {
  const text = element.firstChild
  const final = String(value)
  let frame = 0
  let timer = 0
  const finish = () => {
    if (text) text.nodeValue = final
  }
  const start = () => {
    const began = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / duration)
      if (text) text.nodeValue = String(Math.round(value * t))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }
  if (text) text.nodeValue = "0"
  timer = window.setTimeout(start, delay)
  return {
    cancel() {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      finish()
    },
  }
}

/**
 * Plays a block's entrance once, when it first comes into view. `play` gets
 * the block's root and returns what it started; those are cancelled when the
 * block unmounts. Nothing plays under reduced motion, which leaves
 * the block in its finished state, nor where the browser has no Web
 * Animations or no IntersectionObserver.
 */
export function useRevealOnEnter(root: React.RefObject<HTMLElement | null>, play: (node: HTMLElement) => Cancellable[], threshold = 0.2) {
  const playRef = React.useRef(play)
  playRef.current = play
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || typeof IntersectionObserver === "undefined") return
    if (prefersReducedMotion()) return
    let animations: Cancellable[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        animations = playRef.current(node)
      },
      { threshold }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [root, threshold])
}

/** Every element a block marked `data-reveal="name"`, in document order. */
export function revealTargets(node: HTMLElement, name: string) {
  return Array.from(node.querySelectorAll<HTMLElement>(`[data-reveal="${name}"]`))
}

/**
 * Starts one entrance: the element rests in its natural state, so the
 * keyframes name where it comes from. `fill: "backwards"` holds the first
 * frame through the delay.
 */
export function enter(element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions = {}): Animation {
  return element.animate(keyframes, { duration: 400, easing: EASE_OUT, fill: "backwards", ...options })
}

/** Rises 8px while fading in: the entrance most blocks give their cards and lines. */
export const RISE: Keyframe[] = [
  { opacity: 0, transform: "translateY(8px)" },
  { opacity: 1, transform: "none" },
]

/** Pops from nothing past full size and back, as Figma's markers and tiles do. */
export const POP: Keyframe[] = [
  { opacity: 0, transform: "scale(0)" },
  { opacity: 1, transform: "scale(1.15)", offset: 0.7 },
  { opacity: 1, transform: "scale(1)" },
]

/** Draws a line from its start: the track, a rule, a bar growing along its inline axis. */
export const GROW_X: Keyframe[] = [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]

/** Draws a line down from its top. */
export const GROW_Y: Keyframe[] = [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]

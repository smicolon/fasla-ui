"use client"

import * as React from "react"
import { Mic, MicOff, PhoneOff, Pin, Star } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip/tooltip"

/*
 * Figma: `Video Call` (42869:1033). The parts every `video-call-*` block is
 * built from, one per thing the Figma set repeats: the section and its 1248px
 * column, the heading, the stage bar, the participant tile, the controls dock
 * (compact and labelled, with a Leave that needs a hold), and the small helpers
 * that keep Latin words and figures whole inside Arabic.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Careers and Pricing blocks are: the section is a query container, so a block
 * lays out for the room it is given. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet, from 640px of content
 * (Figma's Tablet, 768 less its padding), and `[@container(min-width:64rem)]:`
 * its Desktop, from 1024px of content. The section's own padding still follows
 * the window, since an element can't query itself. The page's `dir` sets the
 * direction; nothing here takes one.
 *
 * STAND-INS. The code library has no Toast, Rating or Separator yet, so this
 * file carries three small ones, named here so they are easy to swap:
 *   - `VideoCallToast` (and `useVideoCallToast`): a polite live region that
 *     disappears on its own. Replace it with the Toast atom when there is one.
 *   - `StarRow`: five toggle stars that fill up to the pointer. Replace it with
 *     the Rating atom.
 *   - `VideoCallSeparator`: a 1px `border` line. Replace it with Separator.
 * The real atoms come in a later PR, and none of the shared atoms in
 * `registry/ui` is changed here.
 *
 * Stills only: a tile shows a photo, never a video element, and nothing here
 * asks for the camera or the microphone. Every real action (leave, mute, share,
 * react) is a callback; what the controls show (pressed, open, hovered) is state
 * the block keeps itself.
 */

export type VideoCallLocale = "en" | "ar"

/* ───────────────────────── Latin inside Arabic ───────────────────────── */

const ARABIC = /[؀-ۿ]/

/** Whether a string has no Arabic letters. */
export const isLatin = (text: React.ReactNode) => typeof text === "string" && !ARABIC.test(text)

/** A run of Latin letters, figures and the marks that join them: `Fasla`, `⌘ D`, `fasla.to/room`, `+44 20 7946 0212`. */
const LATIN_RUN = /([A-Za-z0-9⌘][A-Za-z0-9⌘ .:@/+'’&_–-]*[A-Za-z0-9⌘]|[A-Za-z0-9⌘])/

/** One Latin run kept whole and left-to-right inside any sentence, as Figma's LRI…PDI marks do. */
export function Latin({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={cn("whitespace-nowrap", className)}>
      {children}
    </bdi>
  )
}

/**
 * Text with each Latin run or figure set in its own left-to-right isolate, so
 * a name, a shortcut or a number inside an Arabic sentence keeps its order and
 * never glues to the Arabic word beside it. A string with no Arabic, or
 * anything that is not a string, passes through untouched.
 */
export function Figures({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string" || !ARABIC.test(children)) return <>{children}</>
  const parts = children.split(LATIN_RUN)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <Latin key={index}>{part}</Latin>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

/* ─────────────────────────────── Motion ─────────────────────────────── */

/**
 * The motion presets, copied in because a block must not import `src/motion`:
 * those files do not resolve after a CLI install. 120ms for a fade, 180ms for
 * a move, 60ms between siblings, and the standard ease.
 */
export const FAST_MS = 120
export const BASE_MS = 180
export const STAGGER_MS = 60
export const STANDARD = "cubic-bezier(0.2, 0, 0, 1)"

/** Whether the visitor asked for less motion. False where there is no `matchMedia`, as in a test. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * Fades the nodes in together, or in a staggered rise of 8px. With reduced
 * motion every node fades in together in 120ms and nothing moves. Returns the
 * running animations so a caller can cancel them.
 */
export function playEntrance(nodes: HTMLElement[], { rise = 8, stagger = true }: { rise?: number; stagger?: boolean } = {}) {
  const reduced = prefersReducedMotion()
  return nodes
    .filter((node) => typeof node.animate === "function")
    .map((node, index) =>
      node.animate(reduced || !rise ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: `translateY(${rise}px)` }, { opacity: 1, transform: "none" }], {
        duration: reduced ? FAST_MS : BASE_MS,
        delay: reduced || !stagger ? 0 : index * STAGGER_MS,
        easing: STANDARD,
        fill: "backwards",
      })
    )
}

/**
 * Plays `playEntrance` once, the first time the element scrolls into view, on
 * every child marked `data-reveal`. Content that is already on screen when
 * there is no IntersectionObserver is simply shown.
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

/* ─────────────────────── Section, heading, rules ─────────────────────── */

export interface VideoCallSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the 1248px column inside the padding. */
  contentClassName?: string
  /** The space between the parts in the column: 48px (`lg`) or 16px (`sm`), as Figma sets each Type. */
  gap?: "lg" | "sm"
}

/**
 * Figma's section: `theme/background`, padding 32 on phones, 64 on Tablet and
 * 96 on Desktop, and a 1248px column.
 */
export function VideoCallSection({ labelledBy, className, contentClassName, gap = "lg", children, ...props }: VideoCallSectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className={cn("mx-auto flex w-full max-w-[1248px] flex-col", gap === "lg" ? "gap-12" : "gap-4", contentClassName)}>{children}</div>
    </section>
  )
}

export interface VideoCallHeadingProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The small line above the heading, in `primary`. */
  eyebrow?: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description?: React.ReactNode
}

/** The start-aligned heading: an eyebrow, an `h2` (2xl on phones, 3xl from Tablet) and a line in `muted-foreground`, 12px apart. */
export function VideoCallHeading({ headingId, eyebrow, heading, description, className, ...props }: VideoCallHeadingProps) {
  return (
    <header className={cn("flex w-full flex-col items-start gap-3", className)} {...props}>
      {eyebrow ? <p className="text-xs font-medium text-primary">{eyebrow}</p> : null}
      <h2 id={headingId} className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
        {heading}
      </h2>
      {description ? <p className="max-w-[720px] text-base text-muted-foreground">{description}</p> : null}
    </header>
  )
}

/** Figma's `Separator`: a 1px `border` line across its container. A stand-in until the library has the atom. */
export function VideoCallSeparator({ className }: { className?: string }) {
  return <div role="separator" aria-orientation="horizontal" className={cn("h-px w-full shrink-0 bg-border", className)} />
}

/* ───────────────────────────── Toast (stand-in) ───────────────────────────── */

/**
 * Holds a short message for `ms` (1.6s by default) and then clears it. A
 * stand-in for the Toast atom: the dock uses it where a phone has no hover and
 * a tooltip becomes a toast above the dock.
 */
export function useVideoCallToast(ms = 1600) {
  const [message, setMessage] = React.useState<React.ReactNode>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const show = React.useCallback(
    (next: React.ReactNode) => {
      setMessage(next)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setMessage(null), ms)
    },
    [ms]
  )
  React.useEffect(() => () => clearTimeout(timer.current), [])
  return { message, show }
}

/** The toast itself: a pill in `foreground` that rises 8px as it appears. Renders nothing without a message. */
export function VideoCallToast({ message, className }: { message: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  useIsomorphicLayoutEffect(() => {
    if (message && ref.current) playEntrance([ref.current], { stagger: false })
  }, [message])
  return (
    <div role="status" aria-live="polite" className="contents">
      {message ? (
        <div ref={ref} className={cn("pointer-events-none rounded-lg bg-foreground px-3 py-1.5 text-center text-xs text-background", className)}>
          {message}
        </div>
      ) : null}
    </div>
  )
}

/* ──────────────────────────── Star row (stand-in) ──────────────────────────── */

export interface StarRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** How many stars are filled, 0 to `count`. */
  value?: number
  /** Where the row starts when `value` is not passed. */
  defaultValue?: number
  /** Called with the new number when a star is chosen. */
  onValueChange?: (value: number) => void
  /** The number of stars. */
  count?: number
  /** Names the group for assistive technology. */
  label: string
  /** Names star `n`: `Rate 3 of 5`. */
  starLabel?: (n: number, count: number) => string
}

/**
 * Five toggle stars. Hovering fills every star up to the pointer, on a 60ms
 * cascade; choosing one keeps it. The row is a plain flex row, so it fills from
 * the start in either direction. A stand-in for the Rating atom.
 */
export function StarRow({ value, defaultValue = 0, onValueChange, count = 5, label, starLabel, className, ...props }: StarRowProps) {
  const [own, setOwn] = React.useState(defaultValue)
  const [hover, setHover] = React.useState<number | null>(null)
  const current = value ?? own
  const shown = hover ?? current
  const choose = (n: number) => {
    setOwn(n)
    onValueChange?.(n)
  }
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex items-center gap-1", className)} onPointerLeave={() => setHover(null)} {...props}>
      {Array.from({ length: count }, (_, index) => {
        const n = index + 1
        const filled = n <= shown
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={starLabel ? starLabel(n, count) : `${n} / ${count}`}
            data-filled={filled ? "" : undefined}
            onPointerEnter={() => setHover(n)}
            onClick={() => choose(n)}
            onKeyDown={(event) => {
              const step = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0
              if (!step) return
              event.preventDefault()
              const dir = getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1
              choose(Math.min(count, Math.max(1, (current || 1) + step * dir)))
            }}
            style={{ transitionDelay: hover !== null ? `${index * 60}ms` : undefined }}
            className="inline-flex size-6 items-center justify-center rounded-sm text-warning outline-none transition-[color] duration-150 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
          >
            <Star size={20} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className={filled ? "fill-current" : "fill-transparent"} />
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────── Stage bar ────────────────────────────── */

export interface StageBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The meeting's name. */
  title: React.ReactNode
  /** The elapsed time, `24:18`, set in `muted-foreground` beside the name. */
  time?: React.ReactNode
  /** Live state beside the name: a REC badge, a connection badge. */
  state?: React.ReactNode
  /** View switcher, participant count and fullscreen, at the end. */
  actions?: React.ReactNode
}

/** Figma's Stage Bar: the meeting name and its live state at the start, the view controls at the end, wrapping to a second row on phones. */
export function StageBar({ title, time, state, actions, className, ...props }: StageBarProps) {
  return (
    <div className={cn("flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2", className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <p className="min-w-0 truncate text-sm font-semibold text-foreground">{title}</p>
        {time ? <p className="text-sm text-muted-foreground tabular-nums">{time}</p> : null}
        {state}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/* ──────────────────────────── Participant tile ──────────────────────────── */

export interface VideoCallPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface ParticipantTileProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The participant's name, shown in the name chip. */
  name: string
  /** The camera still. Without one the tile shows `initials` on `muted`, as Figma does for a camera that is off. */
  photo?: VideoCallPhoto
  /** One or two letters for a camera that is off. */
  initials?: string
  /** Shows the mic-off mark on the name chip. */
  muted?: boolean
  /** Draws the speaking ring. */
  speaking?: boolean
  /** Where the name chip sits: bottom start, bottom end, or not at all. */
  chip?: "start" | "end" | "none"
  /** Extra classes for the name chip, such as one that hides it on phones. */
  chipClassName?: string
  /** Whether the tile is pinned. Pinned tiles keep the pin on show. */
  pinned?: boolean
  /** Called when the pin is pressed; without it the tile has no pin. */
  onPinnedChange?: (pinned: boolean) => void
  /** Names the pin button: `Pin Adam`. */
  pinLabel?: string
}

/**
 * A camera tile: a photo (or initials) filling a rounded box, a name chip in
 * `primary` at the bottom, an optional speaking ring that fades in over 90ms,
 * and an optional pin. Anything passed as children sits on top, such as a
 * caption bar or a reaction.
 */
export function ParticipantTile({
  name,
  photo,
  initials,
  muted = false,
  speaking = false,
  chip = "start",
  chipClassName,
  pinned = false,
  onPinnedChange,
  pinLabel,
  className,
  children,
  ...props
}: ParticipantTileProps) {
  return (
    <div
      data-speaking={speaking ? "" : undefined}
      className={cn(
        "relative isolate overflow-hidden rounded-lg bg-muted ring-2 ring-inset ring-transparent transition-shadow duration-100 motion-reduce:transition-none",
        speaking && "ring-border",
        className
      )}
      {...props}
    >
      {photo ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover object-[50%_42%]" />
      ) : initials ? (
        <span aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center text-3xl font-semibold text-foreground">
          {initials}
        </span>
      ) : null}
      {onPinnedChange ? (
        <Button
          type="button"
          size="icon-xs"
          radius="rounded"
          aria-label={pinLabel ?? `Pin ${name}`}
          aria-pressed={pinned}
          onClick={() => onPinnedChange(!pinned)}
          className={cn("absolute start-3 top-3 transition-transform duration-100 motion-reduce:transition-none", pinned && "rotate-[15deg]")}
        >
          <Pin aria-hidden />
        </Button>
      ) : null}
      {chip !== "none" ? (
        <Badge
          variant="solid"
          tone="primary"
          size="lg"
          radius="standard"
          icon={muted ? <MicOff /> : <Mic />}
          className={cn("absolute bottom-3", chip === "start" ? "start-3" : "end-3", chipClassName)}
        >
          <Figures>{name}</Figures>
        </Badge>
      ) : null}
      {children}
    </div>
  )
}

/* ─────────────────────────────── Controls dock ─────────────────────────────── */

export interface DockControl {
  id: string
  /** The glyph, from your icon set. */
  icon: React.ElementType
  /** The glyph while pressed, such as a crossed-out mic. It cross-fades with `icon` over 100ms. */
  pressedIcon?: React.ElementType
  /** The button's name and its tooltip: "Mute". */
  label: string
  /** The name while pressed: "Unmute". */
  pressedLabel?: string
  /** What the tooltip says while pressed, when it says more: "You're muted. Press ⌘ D to talk". */
  pressedTip?: string
  /** The short line under the button in the labelled dock. Defaults to `label`. */
  caption?: string
  /** The caption while pressed. */
  pressedCaption?: string
  /** `off` controls (mic, camera) turn destructive when pressed; `on` controls (hand, captions) turn secondary. */
  kind?: "off" | "on"
  /** Makes it a toggle that keeps its own pressed state. Without it the control only calls back. */
  toggle?: boolean
  /** Where it starts. */
  defaultPressed?: boolean
  /** Leaves it out of the phone layout, as Figma trims the dock to five controls. */
  hideOnPhone?: boolean
  /** Items for a menu that opens from the control: the More menu. */
  menu?: { id: string; label: string }[]
}

export type DockSize = "md" | "lg" | "xl"

const DOCK_SIZE: Record<DockSize, string> = {
  md: "size-9",
  lg: "size-11",
  xl: "size-11 [@container(min-width:40rem)]:size-12",
}

export interface ControlsDockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  controls: DockControl[]
  /** `compact` is the round buttons alone; `labelled` stacks a short caption under each. */
  density?: "compact" | "labelled"
  /** The control size: 36px, 44px, or 44px on phones and 48px from Tablet. */
  size?: DockSize
  /** Names the Leave button and is its text: "Leave". */
  leaveLabel: string
  /** What the Leave button says while it waits for the second press: "Press again to leave". */
  leaveConfirmLabel: string
  /** A line for the first mouse click on Leave: "Hold to leave". */
  leaveHint: string
  /** How long Leave must be held, in ms. */
  holdMs?: number
  /** Draws Leave's corners as a pill (`rounded`) or 8px (`standard`), as the compact and labelled rows differ. */
  leaveRadius?: "rounded" | "standard"
  /** Keeps Leave labelled on phones too, as the labelled dock does. */
  leaveLabelled?: boolean
  /** Keeps Leave out of the dock, for a row that is only controls. */
  hideLeave?: boolean
  /** The accessible name of the dock. */
  label?: string
  /** Called when a control is pressed; toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for `holdMs`, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

/** Whether the device can hover. Phones can't, so a tooltip becomes a toast. False before the first read. */
function useCanHover() {
  const [can, setCan] = React.useState(true)
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    setCan(window.matchMedia("(hover: hover)").matches)
  }, [])
  return can
}

interface DockButtonProps {
  control: DockControl
  size: DockSize
  pressed: boolean
  canHover: boolean
  onPress: () => void
  onMenuAction?: (id: string) => void
  onHint: (text: string) => void
}

function DockButton({ control, size, pressed, canHover, onPress, onMenuAction, onHint }: DockButtonProps) {
  const Icon = control.icon
  const PressedIcon = control.pressedIcon
  const name = pressed ? (control.pressedLabel ?? control.label) : control.label
  const tip = pressed ? (control.pressedTip ?? name) : name
  const tone = pressed ? (control.kind === "on" ? "secondary" : "destructive") : "primary"
  const button = (
    <Button
      type="button"
      size="icon-lg"
      radius="rounded"
      tone={tone}
      aria-label={name}
      aria-pressed={control.toggle ? pressed : undefined}
      data-control={control.id}
      onClick={() => {
        onPress()
        if (!canHover) onHint(tip)
      }}
      className={cn(DOCK_SIZE[size], "transition-[transform,background-color] duration-150 motion-reduce:transition-none", canHover && "hover:motion-safe:scale-[1.06]", "active:motion-safe:scale-[0.96]")}
    >
      <span className="grid size-4 place-items-center" aria-hidden>
        <Icon className={cn("col-start-1 row-start-1 transition-opacity duration-100 motion-reduce:transition-none", PressedIcon && pressed && "opacity-0")} />
        {PressedIcon ? <PressedIcon className={cn("col-start-1 row-start-1 transition-opacity duration-100 motion-reduce:transition-none", !pressed && "opacity-0")} /> : null}
      </span>
    </Button>
  )
  if (control.menu) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon-lg"
              radius="rounded"
              aria-label={name}
              data-control={control.id}
              className={cn(DOCK_SIZE[size], "transition-[transform,background-color] duration-150 motion-reduce:transition-none hover:motion-safe:scale-[1.06] active:motion-safe:scale-[0.96]")}
            />
          }
        >
          <Icon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center">
          {control.menu.map((item) => (
            <DropdownMenuItem key={item.id} onClick={() => onMenuAction?.(item.id)}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  if (!canHover) return button
  return (
    <Tooltip>
      <TooltipTrigger delay={400} render={button} />
      <TooltipContent side="top">
        <Figures>{tip}</Figures>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Leave, held. A mouse or finger has to stay down for `holdMs` (400ms) before
 * `onLeave` is called, with a fill that grows across the button; a quick click
 * only shows the hint. From the keyboard a hold is unreliable, so the first
 * press arms the button ("Press again to leave") and a second press within
 * three seconds leaves. On phones it is an icon-only 44px button, from Tablet
 * a labelled 40px one.
 */
export function LeaveButton({
  label,
  confirmLabel,
  hint,
  holdMs = 400,
  radius = "rounded",
  alwaysLabelled = false,
  onLeave,
  onHint,
  className,
}: {
  label: string
  confirmLabel: string
  hint: string
  holdMs?: number
  radius?: "rounded" | "standard"
  /** Keeps the label on phones too, as Figma's labelled dock does; otherwise a phone gets an icon-only 44px button. */
  alwaysLabelled?: boolean
  onLeave?: () => void
  onHint?: (text: string) => void
  className?: string
}) {
  const [armed, setArmed] = React.useState(false)
  const fill = React.useRef<HTMLSpanElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const armTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const animation = React.useRef<Animation>(undefined)
  const held = React.useRef(false)

  const stop = () => {
    clearTimeout(timer.current)
    animation.current?.cancel()
  }
  React.useEffect(() => () => { stop(); clearTimeout(armTimer.current) }, [])

  const start = () => {
    held.current = false
    stop()
    if (fill.current && typeof fill.current.animate === "function" && !prefersReducedMotion()) {
      animation.current = fill.current.animate([{ width: "0%" }, { width: "100%" }], { duration: holdMs, easing: "linear", fill: "forwards" })
    }
    timer.current = setTimeout(() => {
      held.current = true
      onLeave?.()
    }, holdMs)
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="lg"
      radius={radius}
      aria-label={armed ? confirmLabel : label}
      data-control="leave"
      data-armed={armed ? "" : undefined}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return
        start()
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onClick={(event) => {
        // A real pointer click has `detail >= 1`; Enter and Space report 0.
        if (event.detail > 0) {
          if (!held.current) onHint?.(hint)
          return
        }
        if (armed) {
          clearTimeout(armTimer.current)
          setArmed(false)
          onLeave?.()
        } else {
          setArmed(true)
          onHint?.(confirmLabel)
          armTimer.current = setTimeout(() => setArmed(false), 3000)
        }
      }}
      className={cn(
        "relative overflow-hidden",
        alwaysLabelled ? "h-10 w-auto px-6" : "size-11 px-0 [@container(min-width:40rem)]:h-10 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:px-6",
        className
      )}
    >
      <span ref={fill} aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-0 bg-destructive-foreground opacity-20" />
      <PhoneOff aria-hidden className="relative" />
      <span className={cn("relative", !alwaysLabelled && "hidden [@container(min-width:40rem)]:inline")}>{armed ? confirmLabel : label}</span>
    </Button>
  )
}

/**
 * Figma's controls dock. Toggles keep their own pressed state; every press is
 * reported with `onControl`. A mic or camera that is off turns `destructive`
 * over 160ms while its glyph cross-fades in 100ms; hovering lifts a control to
 * 1.06 and pressing settles it to 0.96; a tooltip opens after 400ms. On a phone
 * there is no hover: the controls only settle on press, a tooltip becomes a
 * 1.6s toast above the dock, and the dock drops the controls marked
 * `hideOnPhone`. In RTL the whole dock mirrors, so Leave stays on the side the
 * eye leaves from.
 */
export function ControlsDock({
  controls,
  density = "compact",
  size = "lg",
  leaveLabel,
  leaveConfirmLabel,
  leaveHint,
  holdMs,
  leaveRadius = "rounded",
  leaveLabelled = false,
  hideLeave = false,
  label,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: ControlsDockProps) {
  const [pressed, setPressed] = React.useState<Record<string, boolean>>(() => Object.fromEntries(controls.map((c) => [c.id, Boolean(c.defaultPressed)])))
  const canHover = useCanHover()
  const toast = useVideoCallToast()
  const isPressed = (c: DockControl) => pressed[c.id] ?? Boolean(c.defaultPressed)
  return (
    <div className={cn("relative", className)} {...props}>
      <div role="group" aria-label={label} className={cn("flex items-start justify-center", density === "labelled" ? "gap-2 [@container(min-width:40rem)]:gap-5" : "gap-2")}>
        {controls.map((control) => {
          const on = isPressed(control)
          const button = (
            <DockButton
              control={control}
              size={size}
              pressed={on}
              canHover={canHover}
              onHint={toast.show}
              onMenuAction={onMenuAction}
              onPress={() => {
                const next = control.toggle ? !on : false
                if (control.toggle) setPressed((state) => ({ ...state, [control.id]: next }))
                onControl?.(control.id, next)
              }}
            />
          )
          return (
            <div
              key={control.id}
              className={cn(
                density === "labelled" ? "flex flex-col items-center gap-1.5" : "block",
                control.hideOnPhone && (density === "labelled" ? "hidden [@container(min-width:40rem)]:flex" : "hidden [@container(min-width:40rem)]:block")
              )}
            >
              {button}
              {density === "labelled" ? <span className="text-xs text-muted-foreground">{on ? (control.pressedCaption ?? control.caption ?? control.label) : (control.caption ?? control.label)}</span> : null}
            </div>
          )
        })}
        {hideLeave ? null : (
          <LeaveButton label={leaveLabel} confirmLabel={leaveConfirmLabel} hint={leaveHint} holdMs={holdMs} radius={leaveRadius} alwaysLabelled={leaveLabelled} onLeave={onLeave} onHint={toast.show} />
        )}
      </div>
      <VideoCallToast message={toast.message} className="absolute inset-x-0 bottom-full mx-auto mb-2 w-fit max-w-full" />
    </div>
  )
}

"use client"

import * as React from "react"
import { Ellipsis, Hand, MessageSquare, Mic, MicOff, PhoneOff, Pin, ScreenShare, Search, Smile, Star, UserPlus, Video, VideoOff, X } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"
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
    <section aria-labelledby={labelledBy} data-video-call="" className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
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
  /** The star's drawn size in pixels: Figma's rating row is 28, the stand-in's default 20. */
  starSize?: number
  /** The gap between one star's fill and the next while hovering: 60ms, and 40 on a phone. */
  cascadeMs?: number
}

/**
 * Five toggle stars. The chosen ones are drawn in `warning` outline, the rest
 * pale, as Figma draws them; hovering fills every star up to the pointer, on a
 * 60ms cascade, and choosing one keeps it. The row is a plain flex row, so it
 * fills from the start in either direction. A stand-in for the Rating atom.
 */
export function StarRow({ value, defaultValue = 0, onValueChange, count = 5, label, starLabel, starSize = 20, cascadeMs = 60, className, ...props }: StarRowProps) {
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
            style={{ transitionDelay: hover !== null ? `${index * cascadeMs}ms` : undefined, width: starSize + 4, height: starSize + 4 }}
            className={cn(
              "inline-flex items-center justify-center rounded-sm outline-none transition-[color] duration-150 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
              filled ? "text-warning" : "text-border"
            )}
          >
            <Star size={starSize} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className={cn("transition-[fill] duration-150 motion-reduce:transition-none", filled && hover !== null ? "fill-current" : "fill-transparent")} />
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────── Stage bar ────────────────────────────── */

export interface StageBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Something before the name: the REC badge. */
  leading?: React.ReactNode
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
export function StageBar({ leading, title, time, state, actions, className, ...props }: StageBarProps) {
  return (
    <div className={cn("flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2", className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        {leading}
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
  /** Whether the tile is pinned. A pinned tile keeps the pin on show; an unpinned one shows it on hover or focus, and always on a touch screen. */
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
        "group/tile relative isolate overflow-hidden rounded-lg bg-muted ring-2 ring-inset ring-transparent transition-shadow duration-100 motion-reduce:transition-none",
        speaking && "ring-border",
        className
      )}
      {...props}
    >
      {photo ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover object-[50%_42%]" />
      ) : initials ? (
        <span aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center pb-6 text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
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
          className={cn(
            "absolute start-3 top-3 transition-[transform,opacity] duration-100 motion-reduce:transition-none",
            pinned ? "rotate-[15deg]" : "opacity-0 focus-visible:opacity-100 group-focus-within/tile:opacity-100 group-hover/tile:opacity-100 [@media(pointer:coarse)]:opacity-100"
          )}
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

export type DockSize = "md" | "stage" | "lg" | "xl"

const DOCK_SIZE: Record<DockSize, string> = {
  md: "size-9",
  stage: "size-9 [@container(min-width:40rem)]:size-11",
  lg: "size-11",
  xl: "size-11 [@container(min-width:40rem)]:size-12",
}

export interface ControlsDockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  controls: DockControl[]
  /** `compact` is the round buttons alone; `labelled` stacks a short caption under each. */
  density?: "compact" | "labelled"
  /** The control size: 36px; `stage`, 36px on phones and 44px from Tablet; 44px; or 44px on phones and 48px from Tablet. */
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

/* ═══════════════════════════ Call stages ═══════════════════════════
 * What the four call-stage Types share: the stage card, the people on it, the
 * stage dock's controls, the container tier a script can read, the FLIP that
 * moves tiles when people come and go, and the side panel.
 */

/** Fills `{name}`-style holes in a copy string. */
export const fillTemplate = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""))

/** The surface of a card in Figma's Video Call set: `card`, a 1px `border`, a 16px radius. */
export const VIDEO_CALL_CARD = "rounded-2xl border border-border bg-card"

/** The copy props a caller passed, so they win over the defaults. `keys` are the copy's own keys. */
export function passedCopy(keys: readonly string[], props: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(props).filter(([key, value]) => keys.includes(key) && value !== undefined))
}

/** The props that are not copy, for the element the block renders. */
export function restOf<T extends Record<string, unknown>>(keys: readonly string[], props: T) {
  return Object.fromEntries(Object.entries(props).filter(([key]) => !keys.includes(key))) as Partial<T>
}

/** A person on a call stage. Their photo comes from the block's `photos`, by `id`. */
export interface VideoCallParticipant {
  /** Keys the person, and picks their photo. */
  id: string
  /** The name on the chip: `Karim Nasser`. */
  name: string
  /** The short form a phone or a strip shows: `Adam F.`. */
  shortName?: string
  /** One or two letters for a camera that is off. A person with no photo and no initials shows a plain `muted` tile. */
  initials?: string
  /** Shows the mic-off mark on their chip. */
  muted?: boolean
}

/** The photos a stage shows, by participant `id`. A person without one shows their initials. */
export type VideoCallPhotos = Record<string, VideoCallPhoto>

/**
 * Figma's Call Stage: a `card` surface, 16px radius, 1px `border`, 16px apart
 * inside. A phone's stage hugs its tiles, 4px at the sides.
 */
export function CallStage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-call-stage=""
      className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-card px-1 py-4 [@container(min-width:40rem)]:p-4", className)}
      {...props}
    />
  )
}

/* ───────────────────────────── Stage dock ───────────────────────────── */

export interface StageDockCopy {
  /** Names the dock. */
  label: string
  mic: { label: string; pressedLabel: string; tip: string }
  video: { label: string; pressedLabel: string }
  share: string
  chat: string
  reactions: string
  hand: { label: string; pressedLabel: string }
  more: string
  menu: { id: string; label: string }[]
  /** Leave's label, and its two lines of help. */
  leave: string
  leaveConfirm: string
  leaveHint: string
}

/** The dock every call stage carries, English and Arabic. */
export const STAGE_DOCK_COPY: Record<VideoCallLocale, StageDockCopy> = {
  en: {
    label: "Call controls",
    mic: { label: "Mute", pressedLabel: "Unmute", tip: "You're muted. Press ⌘ D to talk" },
    video: { label: "Stop video", pressedLabel: "Start video" },
    share: "Share screen",
    chat: "Chat",
    reactions: "Reactions",
    hand: { label: "Raise hand", pressedLabel: "Lower hand" },
    more: "More",
    menu: [
      { id: "settings", label: "Settings" },
      { id: "report", label: "Report a problem" },
    ],
    leave: "Leave",
    leaveConfirm: "Press again to leave",
    leaveHint: "Hold to leave",
  },
  ar: {
    label: "عناصر التحكم في المكالمة",
    mic: { label: "كتم", pressedLabel: "إلغاء الكتم", tip: "الميكروفون مكتوم. اضغط ⌘ D للتحدث" },
    video: { label: "إيقاف الفيديو", pressedLabel: "تشغيل الفيديو" },
    share: "مشاركة الشاشة",
    chat: "الدردشة",
    reactions: "التفاعلات",
    hand: { label: "رفع اليد", pressedLabel: "خفض اليد" },
    more: "المزيد",
    menu: [
      { id: "settings", label: "الإعدادات" },
      { id: "report", label: "الإبلاغ عن مشكلة" },
    ],
    leave: "خروج",
    leaveConfirm: "اضغط مرة أخرى للخروج",
    leaveHint: "اضغط مطولًا للخروج",
  },
}

/**
 * The seven controls of a call stage's dock, in Figma's order: mic, camera,
 * share, chat, reactions, hand and More. A phone keeps five: share and
 * reactions drop out. `chat: "toggle"` makes Chat a toggle that keeps its own
 * pressed state, for a stage whose chat opens a panel.
 */
export function stageDockControls(d: StageDockCopy, { chat = "button" }: { chat?: "button" | "toggle" } = {}): DockControl[] {
  return [
    { id: "mic", icon: Mic, pressedIcon: MicOff, label: d.mic.label, pressedLabel: d.mic.pressedLabel, pressedTip: d.mic.tip, toggle: true },
    { id: "video", icon: Video, pressedIcon: VideoOff, label: d.video.label, pressedLabel: d.video.pressedLabel, toggle: true },
    { id: "screen-share", icon: ScreenShare, label: d.share, hideOnPhone: true },
    { id: "chat", icon: MessageSquare, label: d.chat, kind: "on", toggle: chat === "toggle" },
    { id: "reactions", icon: Smile, label: d.reactions, hideOnPhone: true },
    { id: "hand", icon: Hand, label: d.hand.label, pressedLabel: d.hand.pressedLabel, kind: "on", toggle: true },
    { id: "more", icon: Ellipsis, label: d.more, menu: d.menu },
  ]
}

/* ───────────────────── Container tier, FLIP and debounce ───────────────────── */

export type ContainerTier = "mobile" | "tablet" | "desktop"

/**
 * Which of Figma's three breakpoints the block's own width is at, the same
 * 640px and 1024px of content the container queries use. A script reads this
 * where a class can't act: which way a wipe runs, which axis a panel opens on.
 */
export function containerTier(node: Element | null): ContainerTier {
  const root = node?.closest<HTMLElement>("[data-video-call]")
  if (!root || typeof getComputedStyle !== "function") return "mobile"
  const style = getComputedStyle(root)
  const width = root.clientWidth - (parseFloat(style.paddingInlineStart) || 0) - (parseFloat(style.paddingInlineEnd) || 0)
  return width >= 1024 ? "desktop" : width >= 640 ? "tablet" : "mobile"
}

/** The tier of the section a node is in, kept up to date as the section resizes. */
export function useContainerTier<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [tier, setTier] = React.useState<ContainerTier>("mobile")
  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const read = () => setTier(containerTier(node))
    read()
    const root = node.closest("[data-video-call]")
    if (!root || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(read)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])
  return [ref, tier] as const
}

/**
 * FLIP for a list: every child marked `data-flip="<id>"` slides from where it
 * was to where it is, over 260ms ease-out, whenever `key` changes, so the
 * tiles that stay travel instead of jumping when someone joins or leaves. A
 * tile that is new fades in. Reduced motion skips it. It measures, so it works
 * in either direction.
 */
export function useFlip<T extends HTMLElement>(key: string, duration = 260) {
  const ref = React.useRef<T>(null)
  const rects = React.useRef(new Map<string, DOMRect>())
  const last = React.useRef<string | undefined>(undefined)
  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const items = Array.from(node.querySelectorAll<HTMLElement>("[data-flip]"))
    const next = new Map<string, DOMRect>()
    for (const el of items) next.set(el.dataset.flip!, el.getBoundingClientRect())
    if (last.current !== undefined && last.current !== key && !prefersReducedMotion()) {
      for (const el of items) {
        if (typeof el.animate !== "function") continue
        const before = rects.current.get(el.dataset.flip!)
        const after = next.get(el.dataset.flip!)!
        if (!before) {
          el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: BASE_MS, easing: STANDARD })
          continue
        }
        const dx = before.left - after.left
        const dy = before.top - after.top
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration, easing: "ease-out" })
      }
    }
    rects.current = next
    last.current = key
  }, [key, duration])
  return ref
}

/** A value that follows `value` after it has held still for `ms`: the active-speaker ring never strobes between two voices. */
export function useDebouncedValue<T>(value: T, ms: number): T {
  const [held, setHeld] = React.useState(value)
  React.useEffect(() => {
    if (Object.is(value, held)) return
    const timer = setTimeout(() => setHeld(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms, held])
  return held
}

/* ───────────────────────────── Side panel ───────────────────────────── */

export interface SidePanelPerson {
  id: string
  name: string
  /** Their role: Host, Guest. */
  role?: string
  photo?: VideoCallPhoto
  initials?: string
  /** Shows the mic as off, in `destructive`. */
  muted?: boolean
}

export interface SidePanelMessage {
  id: string
  author: string
  text: string
}

export interface SidePanelCopy {
  /** The panel's heading, and its name. */
  title: string
  /** Names the close button. */
  close: string
  /** Names the tab list. */
  tabsLabel: string
  participants: string
  chat: string
  /** Names the search field and is its placeholder. */
  search: string
  /** The line above the list; `{count}` is filled in. */
  inCall: string
  /** What the list says when the search finds no one. */
  noResults: string
  /** What the Chat tab says with no messages. */
  noMessages: string
  /** Names the Chat tab's dot. */
  unread: string
  invite: string
  /** Names a person's menu button; `{name}` is filled in. */
  more: string
  /** Names the mic mark of someone who is muted. */
  muted: string
  /** Names the handle that resizes the sheet on a phone. */
  handle: string
}

export type SidePanelSnap = "60" | "92"

export interface SidePanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange"> {
  copy: SidePanelCopy
  people: SidePanelPerson[]
  /** The Chat tab's messages. */
  messages?: SidePanelMessage[]
  /** Puts the dot on the Chat tab, scaling in from nothing, until the Chat tab is opened. */
  unread?: boolean
  /** The open tab, when you control it. */
  tab?: "participants" | "chat"
  defaultTab?: "participants" | "chat"
  onTabChange?: (tab: "participants" | "chat") => void
  /** Makes the panel a bottom sheet on a phone: a handle on top, and a height of 60% that a drag or a press steps to 92%. From Tablet it is a plain card. */
  sheet?: boolean
  /** The sheet's height step, when you control it. */
  snap?: SidePanelSnap
  defaultSnap?: SidePanelSnap
  onSnapChange?: (snap: SidePanelSnap) => void
  /** Called when the close button is pressed; without it the panel has none. */
  onClose?: () => void
  /** Called when Invite is pressed. */
  onInvite?: () => void
  /** Called with a person's id when their menu button is pressed. */
  onPersonMenu?: (id: string) => void
}

function useControlled<T>(value: T | undefined, initial: T, onChange?: (next: T) => void) {
  const [own, setOwn] = React.useState(initial)
  const current = value ?? own
  const set = (next: T) => {
    if (value === undefined) setOwn(next)
    onChange?.(next)
  }
  return [current, set] as const
}

/** The sheet's grab handle: a press steps between the two heights, and a drag up or down of 24px picks one. */
function SheetHandle({ label, snap, onSnap }: { label: string; snap: SidePanelSnap; onSnap: (snap: SidePanelSnap) => void }) {
  const start = React.useRef<number | null>(null)
  const dragged = React.useRef(false)
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={snap === "92"}
      onPointerDown={(event) => {
        start.current = event.clientY
        dragged.current = false
      }}
      onPointerUp={(event) => {
        if (start.current === null) return
        const dy = event.clientY - start.current
        start.current = null
        if (Math.abs(dy) >= 24) {
          dragged.current = true
          onSnap(dy < 0 ? "92" : "60")
        }
      }}
      onPointerCancel={() => (start.current = null)}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false
          return
        }
        onSnap(snap === "92" ? "60" : "92")
      }}
      className="-mt-2 flex h-6 w-full shrink-0 items-center justify-center rounded-md outline-none [touch-action:none] focus-visible:ring-2 focus-visible:ring-ring [@container(min-width:40rem)]:hidden"
    >
      <span aria-hidden className="h-1 w-9 rounded-full bg-muted-foreground" />
    </button>
  )
}

/** A person's row. A row that arrives after the first render grows in over 180ms, height and opacity together. */
function PersonRow({ person, copy, isNew, onMenu }: { person: SidePanelPerson; copy: SidePanelCopy; isNew: boolean; onMenu?: (id: string) => void }) {
  const ref = React.useRef<HTMLLIElement>(null)
  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!isNew || !node || typeof node.animate !== "function") return
    const height = node.offsetHeight
    node.animate(prefersReducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ height: "0px", opacity: 0, overflow: "hidden" }, { height: `${height}px`, opacity: 1, overflow: "hidden" }], {
      duration: BASE_MS,
      easing: STANDARD,
    })
  }, [])
  const Mark = person.muted ? MicOff : Mic
  return (
    <li ref={ref} data-person={person.id} className="flex items-center gap-3 rounded-lg p-2">
      <Avatar size="32" radius="standard" variant={person.photo ? "image" : "initials"} src={person.photo?.src} name={person.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          <Figures>{person.name}</Figures>
        </span>
        {person.role ? <span className="truncate text-xs text-muted-foreground">{person.role}</span> : null}
      </div>
      <Mark aria-hidden className={cn("size-4 shrink-0", person.muted ? "text-destructive" : "text-muted-foreground")} />
      {person.muted ? <span className="sr-only">{copy.muted}</span> : null}
      <Button type="button" variant="ghost" tone="secondary" size="icon-xs" aria-label={fillTemplate(copy.more, { name: person.name })} onClick={() => onMenu?.(person.id)}>
        <Ellipsis aria-hidden />
      </Button>
    </li>
  )
}

/**
 * Figma's side panel: a heading with a close button, a Participants / Chat
 * tab pair, a people search and the list, and Invite at the foot. The search
 * filters for real; the tabs cross-fade their content in 120ms; the Chat tab's
 * dot scales in from 0; a row that arrives grows in. As a sheet on a phone it
 * is 60% tall with a handle that steps it to 92%. A card, 360px wide beside the
 * stage on Desktop and full width below it from Tablet.
 */
export function SidePanel({
  copy,
  people,
  messages = [],
  unread = false,
  tab,
  defaultTab = "participants",
  onTabChange,
  sheet = false,
  snap,
  defaultSnap = "60",
  onSnapChange,
  onClose,
  onInvite,
  onPersonMenu,
  className,
  ...props
}: SidePanelProps) {
  const [current, setTab] = useControlled(tab, defaultTab, onTabChange)
  const [size, setSize] = useControlled(snap, defaultSnap, onSnapChange)
  const [query, setQuery] = React.useState("")
  const content = React.useRef<HTMLDivElement>(null)
  const dot = React.useRef<HTMLSpanElement>(null)
  const seen = React.useRef<Set<string> | null>(null)
  const firstTab = React.useRef(true)
  const shown = people.filter((person) => person.name.toLowerCase().includes(query.trim().toLowerCase()))
  const fresh = new Set(seen.current ? people.filter((person) => !seen.current!.has(person.id)).map((person) => person.id) : [])
  React.useEffect(() => {
    seen.current = new Set(people.map((person) => person.id))
  })
  React.useEffect(() => {
    if (firstTab.current) {
      firstTab.current = false
      return
    }
    if (content.current) playEntrance([content.current], { rise: 0, stagger: false })
  }, [current])
  React.useEffect(() => {
    const node = dot.current
    if (!unread || !node || typeof node.animate !== "function") return
    node.animate(prefersReducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: BASE_MS, easing: STANDARD })
  }, [unread, current])

  return (
    <aside
      aria-label={copy.title}
      data-side-panel=""
      data-snap={sheet ? size : undefined}
      className={cn(
        "flex min-h-0 w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5",
        sheet && "h-[468px] transition-[height] duration-200 motion-reduce:transition-none data-[snap=92]:h-[600px] [@container(min-width:40rem)]:h-auto",
        className
      )}
      {...props}
    >
      {sheet ? <SheetHandle label={copy.handle} snap={size} onSnap={setSize} /> : null}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{copy.title}</h3>
        {onClose ? (
          <Button type="button" variant="ghost" tone="secondary" size="icon-xs" aria-label={copy.close} onClick={onClose}>
            <X aria-hidden />
          </Button>
        ) : null}
      </div>
      <Tabs value={current} onValueChange={(value) => setTab(value as "participants" | "chat")} className="flex min-h-0 flex-1 flex-col gap-4">
        <TabsList variant="bordered" aria-label={copy.tabsLabel}>
          <TabsTrigger value="participants">{copy.participants}</TabsTrigger>
          <TabsTrigger value="chat">
            <span className="relative">
              {copy.chat}
              {unread && current !== "chat" ? <span ref={dot} role="img" aria-label={copy.unread} className="absolute -top-1 -end-2 size-2 rounded-full bg-destructive" /> : null}
            </span>
          </TabsTrigger>
        </TabsList>
        <div ref={content} className="flex min-h-0 flex-1 flex-col gap-4">
          <TabsContent value="participants" className="flex min-h-0 flex-1 flex-col gap-4">
            <Input size="lg" aria-label={copy.search} placeholder={copy.search} startIcon={<Search aria-hidden />} value={query} onChange={(event) => setQuery(event.target.value)} />
            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto [@container(min-width:40rem)]:max-h-[22rem]">
              <p className="text-xs font-medium text-muted-foreground">
                <Figures>{fillTemplate(copy.inCall, { count: people.length })}</Figures>
              </p>
              {shown.length ? (
                <ul className="flex flex-col gap-1">
                  {shown.map((person) => (
                    <PersonRow key={person.id} person={person} copy={copy} isNew={fresh.has(person.id)} onMenu={onPersonMenu} />
                  ))}
                </ul>
              ) : (
                <p role="status" className="py-4 text-sm text-muted-foreground">{copy.noResults}</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="chat" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
            {messages.length ? (
              messages.map((message) => (
                <p key={message.id} className="flex flex-col gap-0.5 text-sm">
                  <span className="font-semibold text-foreground">
                    <Figures>{message.author}</Figures>
                  </span>
                  <span className="text-muted-foreground">
                    <Figures>{message.text}</Figures>
                  </span>
                </p>
              ))
            ) : (
              <p className="py-4 text-sm text-muted-foreground">{copy.noMessages}</p>
            )}
          </TabsContent>
        </div>
      </Tabs>
      <Button type="button" size="lg" className="w-full" onClick={onInvite}>
        <UserPlus aria-hidden />
        {copy.invite}
      </Button>
    </aside>
  )
}

"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { badgeVariants } from "../../ui/badge/badge"
import { Button, type ButtonProps } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { DatePicker } from "../../ui/date-picker/date-picker"
import { Input } from "../../ui/input/input"
import { Select } from "../../ui/select/select"
import { SOCIAL_PLATFORM_NAMES, SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"
import { Textarea } from "../../ui/textarea/textarea"

/*
 * Figma: `Contact Us` (42334:293941). The parts every `contact-us-*` block is
 * built from, one per thing the Figma set repeats: the section and its
 * 1248px column, the header, the hairline, the contact form (its fields, its
 * state machine and its three outcomes), the single-choice chips, the
 * social links, and the small motion helper the entrances use.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Careers, Pricing and Gallery blocks are: the section is a query container,
 * so a block lays out for the room it is given, such as a docs preview
 * narrower than the screen. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet, from 640px of content
 * (Figma's Tablet, 768 less its padding), and `[@container(min-width:64rem)]:`
 * its Desktop, from 1024px of content. The section's own padding still
 * follows the window, since an element can't query itself. The page's `dir`
 * sets the direction; nothing here takes one.
 *
 * Forms: there is no backend. A form validates on the client, then calls the
 * block's `onSubmit(values)`: resolve to show the thank-you panel, reject (or
 * throw) to show the send error.
 *
 * Required fields: a required text field, select or textarea shows the word
 * `requiredLabel` ("Required", «مطلوب») and nothing else, in the atom's own Top
 * Right label slot (`labelEnd`), at the end of the label row. A field with no
 * visible label (`hideLabel`) shows no word and no extra row; it is still
 * required in behaviour. No label or placeholder carries an asterisk,
 * anywhere. `aria-required` and the error on submit are the behaviour. Consent and terms checkboxes are required too, with neither
 * the word nor an asterisk.
 *
 * STAND-INS. Figma components this family has no code atom for. Each is
 * replaced by plain markup inside this file, so it can be swapped for the
 * real atom, in one place, once the atom exists. Rating is used by no Type.
 *
 *  - Toggle (15088:228441): the 12 time-slot buttons of Book a Call.
 *    Stand-in: `aria-pressed` buttons styled with `buttonVariants`. Used by
 *    Book a Call.
 *  - Table Cell (39961:4559): the 30 cells of Global Offices Table.
 *    Stand-in: native `<table>` markup, a `th` or `td` styled like the cell.
 *    Used by Global Offices Table.
 *  - Separator (14860:69243): the 3 dividing lines of Editorial & Address Card.
 *    Stand-in: `ContactUsRule`, a 1px `bg-border` line. Used by Editorial &
 *    Address Card, and by Ruled Split Form and Oversized Wordmark, where Figma
 *    draws a plain frame.
 *
 * Tints: `soft-warning-5`, `soft-warning-30` and `soft-success-30` are
 * Figma's `opacity/warning/5`, `opacity/warning/30` and `opacity/success/30`.
 * They live in the theme with the other soft tints.
 *
 * Motion uses the repo's presets, copied in (120, 180 and 260ms,
 * `cubic-bezier(0.2, 0, 0, 1)`), as the Web Animations API, once, when the
 * block is a fifth in view, and never when the reader prefers reduced motion:
 * then a block only fades.
 */

export type ContactUsLocale = "en" | "ar"

/**
 * Splits a block's props into its copy (every key the default copy has, with
 * the default where the prop is left out) and the rest.
 */
export function splitCopy<C extends object, P extends object>(defaults: C, props: P) {
  const copy: Record<string, unknown> = { ...(defaults as Record<string, unknown>) }
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (key in defaults) {
      if (value !== undefined) copy[key] = value
    } else rest[key] = value
  }
  return { copy: copy as C, rest: rest as Omit<P, keyof C> }
}

/** The props every form block takes, besides its copy. */
export interface ContactUsFormBlockProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit"> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /**
   * Called with the checked fields, by name. Resolve to show the thank-you
   * panel; reject, or throw, to show the send error. The block sends nothing
   * itself.
   */
  onSubmit?: (values: ContactUsValues) => void | Promise<void>
  /** Turns every field and the button off. */
  disabled?: boolean
}

/* ───────────────────────────── Motion ───────────────────────────── */

const STANDARD = "cubic-bezier(0.2, 0, 0, 1)"
const FAST_MS = 120
const BASE_MS = 180
const SLOW_MS = 260
const STAGGER_MS = 50
const MAX_STAGGER_MS = 300

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/** Whether the reader asked the system for less motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Plays one entrance on each node, in order. What a node does is named by its
 * `data-reveal`: `rise` (the default: fade up 12px), `fade`, `word` (fade up
 * 14px, for a sentence set word by word), `draw-x` and `draw-y` (a rule drawn
 * from its start or its top; set its `transform-origin` in CSS) and `wipe`
 * (opens from the start edge while it scales in). A node's own
 * `data-reveal-delay` (ms) replaces its place in the stagger.
 */
export function playReveal(nodes: HTMLElement[]) {
  const reduced = prefersReducedMotion()
  return nodes
    .filter((node) => typeof node.animate === "function")
    .map((node, index) => {
      const kind = node.dataset.reveal || "rise"
      const own = node.dataset.revealDelay === undefined ? Number.NaN : Number(node.dataset.revealDelay)
      const delay = reduced ? 0 : Number.isFinite(own) ? own : Math.min(index * STAGGER_MS, MAX_STAGGER_MS)
      const rtl = getComputedStyle(node).direction === "rtl"
      let frames: Keyframe[]
      if (reduced || kind === "fade") frames = [{ opacity: 0 }, { opacity: 1 }]
      else if (kind === "draw-x") frames = [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
      else if (kind === "draw-y") frames = [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]
      else if (kind === "pan") frames = [{ transform: "scale(1.08)" }, { transform: "none" }]
      else if (kind === "drop")
        // The pin: falls 24px, overshoots by 3px and settles, one keyframe of overshoot.
        frames = [
          { opacity: 0, transform: "translateY(-24px)" },
          { opacity: 1, transform: "translateY(3px)", offset: 0.7 },
          { opacity: 1, transform: "none" },
        ]
      else if (kind === "ring") frames = [{ opacity: 0.5, transform: "scale(0.6)" }, { opacity: 0, transform: "scale(1.8)" }]
      else if (kind === "settle") frames = [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }]
      else if (kind === "slide") {
        // Travels 16px to its place, from the end side (the default) or the start side, whichever way the page reads.
        const side = (node.dataset.revealFrom === "start" ? -1 : 1) * (rtl ? -1 : 1)
        frames = [{ opacity: 0, transform: `translateX(${16 * side}px)` }, { opacity: 1, transform: "none" }]
      } else if (kind === "wipe")
        frames = [
          { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", opacity: 0, transform: "scale(0.94)" },
          { clipPath: "inset(0 0 0 0)", opacity: 1, transform: "none" },
        ]
      else frames = [{ opacity: 0, transform: `translateY(${kind === "word" ? 14 : 12}px)` }, { opacity: 1, transform: "none" }]
      return node.animate(frames, {
        duration: reduced ? FAST_MS : ["wipe", "settle", "slide", "pan", "drop", "ring"].includes(kind) ? SLOW_MS : BASE_MS,
        delay,
        easing: STANDARD,
        fill: "backwards",
      })
    })
}

/**
 * Plays `playReveal` once on the `[data-reveal]` nodes inside the returned
 * ref's element, when a fifth of it is in view. Before then, and without
 * script, everything is simply there.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return
    let animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        animations = playReveal(Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]")))
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

/**
 * A sentence set word by word, each word a `data-reveal="word"` span that
 * rises 30ms after the one before. The words stay one run of text for
 * assistive technology.
 */
export function ContactUsWords({ children, className }: { children: string; className?: string }) {
  const words = children.split(/\s+/).filter(Boolean)
  return (
    <span className={className}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {index > 0 ? " " : null}
          <span data-reveal="word" data-reveal-delay={Math.min(index * 30, 360)} className="inline-block">
            {word}
          </span>
        </React.Fragment>
      ))}
    </span>
  )
}

/* ───────────────────────────── Live time ───────────────────────────── */

/** One day's opening hours, "09:00" to "18:00" in the place's own time, or `null` when it is closed. */
export type ContactUsHours = { open: string; close: string } | null

/** A week of opening hours, Sunday first, as `Date#getDay` counts. */
export type ContactUsWeek = readonly [ContactUsHours, ContactUsHours, ContactUsHours, ContactUsHours, ContactUsHours, ContactUsHours, ContactUsHours]

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
const partFormatters = new Map<string, Intl.DateTimeFormat>()

/** The weekday (0 is Sunday) and the minutes since midnight at `date` in `timeZone`. */
export function zoneParts(date: Date, timeZone: string) {
  let format = partFormatters.get(timeZone)
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    partFormatters.set(timeZone, format)
  }
  const parts = format.formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ""
  return { day: WEEKDAYS[get("weekday")] ?? 0, minutes: Number(get("hour")) * 60 + Number(get("minute")) }
}

/** "14:20": the time at `date` in `timeZone`, 24-hour, always with Western digits, in any language. */
export function formatClock(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date)
}

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))

export interface ContactUsOpenState {
  open: boolean
  /** The weekday at `now` in the place's time zone, 0 is Sunday. */
  day: number
  /** While open: the minutes until it closes. */
  closesInMinutes?: number
  /** While closed: when it opens next, `daysAhead` days on (0 is later today) at `time`. */
  next?: { daysAhead: number; day: number; time: string }
}

/** Whether a place on `week` is open at `now`, and when that next changes. */
export function openState(week: ContactUsWeek, timeZone: string, now: Date): ContactUsOpenState {
  const { day, minutes } = zoneParts(now, timeZone)
  const today = week[day]
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) return { open: true, day, closesInMinutes: toMinutes(today.close) - minutes }
  if (today && minutes < toMinutes(today.open)) return { open: false, day, next: { daysAhead: 0, day, time: today.open } }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const d = (day + ahead) % 7
    const hours = week[d]
    if (hours) return { open: false, day, next: { daysAhead: ahead, day: d, time: hours.open } }
  }
  return { open: false, day }
}

/** 220 minutes becomes { hours: 3, minutes: 40 }. */
export const splitMinutes = (total: number) => ({ hours: Math.floor(total / 60), minutes: total % 60 })

/**
 * The time a live block shows. Give it `now` and it is frozen there, the same
 * on the server and in the browser. Without it the first render is `null`, so
 * the server and the browser agree, then it is the real time, ticking on every
 * minute and paused while the tab is hidden.
 */
export function useLiveNow(now?: Date | number | string): Date | null {
  const frozen = now === undefined ? null : new Date(now)
  const frozenAt = frozen ? frozen.getTime() : null
  const [live, setLive] = React.useState<Date | null>(null)
  React.useEffect(() => {
    if (frozenAt !== null) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const tick = () => {
      setLive(new Date())
      const at = new Date()
      timer = setTimeout(tick, 60_000 - (at.getSeconds() * 1000 + at.getMilliseconds()))
    }
    const sync = () => {
      clearTimeout(timer)
      if (!document.hidden) tick()
    }
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [frozenAt])
  return frozen ?? live
}

/**
 * Counts `target` up from zero once, the first time half of the element is in
 * view, over the slow preset. Reduced motion, and a browser without
 * IntersectionObserver, show the target at once. The first render is the target.
 */
export function useCountUp<T extends HTMLElement>(target: number) {
  const ref = React.useRef<T>(null)
  const [value, setValue] = React.useState(target)
  React.useEffect(() => {
    setValue(target)
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined" || prefersReducedMotion()) return
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const step = (at: number) => {
          const t = Math.min(1, (at - start) / SLOW_MS)
          setValue(Math.round(target * (1 - (1 - t) * (1 - t))))
          if (t < 1) frame = requestAnimationFrame(step)
        }
        setValue(0)
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target])
  return [ref, value] as const
}

/* ─────────────────────────── The dark band ─────────────────────────── */

/**
 * Which theme scope a dark band takes: `dark` on a light page and `light` on a
 * dark one, so the band is the page's opposite, as Figma's `background-inverse`
 * panels are. A light page is assumed until the browser says otherwise.
 */
export function useInverseScope(): "dark" | "light" {
  const [scope, setScope] = React.useState<"dark" | "light">("dark")
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement
    const read = () => setScope(root.classList.contains("dark") ? "light" : "dark")
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return scope
}

/**
 * A panel on the page's opposite theme. Everything inside it, the atoms
 * included, draws with the other mode's tokens, so a field on it is dark with no
 * colour of ours. Inside, use the plain tokens (`text-foreground`,
 * `text-muted-foreground`): they already mean what Figma's `*-inverse` tokens do.
 */
export function ContactUsInverseBand({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const scope = useInverseScope()
  return (
    <div className={cn(scope, "bg-background text-foreground", className)} {...props}>
      {children}
    </div>
  )
}

/* ──────────────────────────── Page parts ──────────────────────────── */

export interface ContactUsSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the 1248px column inside the padding. */
  contentClassName?: string
  /** The padding around the column: 96px on Desktop (`lg`) or 64px (`md`), as Figma sets each Type. */
  padding?: "lg" | "md"
  /** The space between the column's parts: 48px (`lg`), 40px (`md`) or none. */
  gap?: "lg" | "md" | "none"
  /** The section's ground: `background`, or `muted`. */
  tone?: "background" | "muted"
  /** Something drawn behind the column and across the whole section, such as Grand Headline Form's grid. */
  backdrop?: React.ReactNode
}

/**
 * Figma's section: padding 96 on Desktop, 64 × 24 on Tablet and 32 × 16 on
 * phones (64 on Desktop for `md`), and a 1248px column.
 */
export function ContactUsSection({ labelledBy, className, contentClassName, padding = "lg", gap = "lg", tone = "background", backdrop, children, ...props }: ContactUsSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        "[container-type:inline-size] px-4 py-8 md:px-6 md:py-16",
        padding === "lg" ? "lg:p-24" : "lg:p-16",
        tone === "muted" ? "bg-muted" : "bg-background",
        backdrop ? "relative overflow-hidden" : undefined,
        className
      )}
      {...props}
    >
      {backdrop}
      <div className={cn("mx-auto flex w-full max-w-[1248px] flex-col", backdrop ? "relative" : undefined, gap === "lg" ? "gap-12" : gap === "md" ? "gap-10" : "gap-0", contentClassName)}>{children}</div>
    </section>
  )
}

export interface ContactUsHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The small line above the heading. Hidden when empty. */
  eyebrow?: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description?: React.ReactNode
  /** Where the header's lines sit: at the start, or centred. */
  align?: "start" | "center"
  /** Replaces the eyebrow's classes. */
  eyebrowClassName?: string
  /** Replaces the heading's classes. */
  headingClassName?: string
  /** Replaces the description's classes. */
  descriptionClassName?: string
  /** Lets the heading rise into place once, when the block is in view. */
  reveal?: boolean
}

/** The header: an optional eyebrow, the heading and its description in `muted-foreground`, 12px apart. */
export function ContactUsHeader({
  headingId,
  eyebrow,
  heading,
  description,
  align = "start",
  eyebrowClassName,
  headingClassName,
  descriptionClassName,
  reveal,
  className,
  children,
  ...props
}: ContactUsHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col gap-3", align === "center" ? "items-center text-center" : "items-start", className)} {...props}>
      {eyebrow ? <p className={cn("text-sm font-semibold text-primary", eyebrowClassName)}>{eyebrow}</p> : null}
      <h2 id={headingId} data-reveal={reveal ? "rise" : undefined} className={cn("text-4xl font-semibold text-foreground", headingClassName)}>
        {heading}
      </h2>
      {description ? <p className={cn("text-base text-muted-foreground", descriptionClassName)}>{description}</p> : null}
      {children}
    </header>
  )
}

/** The plain hairline: a 1px `border` line, across (the default) or down. Stand-in for Separator. */
export function ContactUsRule({ orientation = "horizontal", className, ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return <div aria-hidden className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch", className)} {...props} />
}

/**
 * A photo a block shows. No block ships with one: pass your own. Alt is empty
 * ("") for a decorative photo. The slot crops the photo to fill it, around its
 * middle; `focus` moves that middle, as Figma's image crops do.
 */
export interface ContactUsPhoto {
  src: string
  alt: string
  /**
   * Where the slot's crop is centred, as CSS `object-position` values such as
   * "50% 81%": on a phone (`base`), from Tablet (`tablet`) and from Desktop
   * (`desktop`). Each falls back to the one before, and all to the middle.
   */
  focus?: { base?: string; tablet?: string; desktop?: string }
}

/**
 * A photo slot: the box Figma calls Image Slot, which crops its photo to fill
 * it. A `muted` ground shows without a photo. `photoReveal` puts a `data-reveal`
 * on the photo itself, so a `settle` stays inside the box's clip.
 */
export function ContactUsPhotoSlot({ photo, photoReveal, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { photo?: ContactUsPhoto; photoReveal?: string }) {
  const focus = photo?.focus
  const style = focus
    ? ({ "--cu-pos": focus.base, "--cu-pos-t": focus.tablet, "--cu-pos-d": focus.desktop } as React.CSSProperties)
    : undefined
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)} {...props}>
      {photo ? (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          data-reveal={photoReveal}
          style={style}
          className="absolute inset-0 size-full object-cover [object-position:var(--cu-pos,50%_50%)] [@container(min-width:40rem)]:[object-position:var(--cu-pos-t,var(--cu-pos,50%_50%))] [@container(min-width:64rem)]:[object-position:var(--cu-pos-d,var(--cu-pos-t,var(--cu-pos,50%_50%)))]"
        />
      ) : null}
      {children}
    </div>
  )
}

export interface ContactUsSocialLink {
  /** Which brand's mark. */
  platform: SocialPlatform
  /** Where it goes. */
  href: string
  /** Names the link for assistive technology. The brand's own name without it. */
  label?: string
}

/** A row of brand marks, each a link, 12px apart. The marks come from the Social Icons atom. */
export function ContactUsSocialLinks({ links, className }: { links: ContactUsSocialLink[]; className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {links.map((link) => (
        <li key={link.platform} className="flex">
          <a
            href={link.href}
            aria-label={link.label ?? SOCIAL_PLATFORM_NAMES[link.platform]}
            className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <SocialIcon platform={link.platform} className="size-6" />
          </a>
        </li>
      ))}
    </ul>
  )
}

/* ───────────────────────────── The form ───────────────────────────── */

export type ContactUsValue = string | boolean
/** What `onSubmit` receives: every field by name. Text and choices are strings (trimmed), a checkbox is a boolean. */
export type ContactUsValues = Record<string, ContactUsValue>
export type ContactUsStatus = "idle" | "pending" | "success" | "error"

export interface ContactUsOption {
  value: string
  label: string
}

export interface ContactUsFieldDef {
  /** The key in `onSubmit`'s values. */
  name: string
  kind: "text" | "email" | "tel" | "date" | "select" | "textarea" | "checkbox"
  /** The label, as Figma writes it. A required field gets no asterisk: the atom shows the word `requiredLabel` at the end of its label row. */
  label: string
  /** Keeps the label for assistive technology but draws none, as Editorial Statement's fields do. */
  hideLabel?: boolean
  placeholder?: string
  required?: boolean
  autoComplete?: string
  /** A select's choices. */
  options?: readonly ContactUsOption[]
  /** Size of the field or checkbox: `sm`, `md` (the default) or `lg`. Fields are 32, 36 and 40px tall. */
  size?: "sm" | "md" | "lg"
  /** Corner shape of a text field or select: Figma's 8px `standard` (the default), or a `rounded` pill. */
  radius?: "standard" | "rounded"
  /** An icon after a text field's value. Sized to 16px by the atom. */
  endIcon?: React.ReactNode
  /** Classes for the field group, such as the min height Figma gives a Textarea. */
  groupClassName?: string
  /** A textarea's limit. The counter shows from 80% of it. */
  maxLength?: number
}

/** What a block says about the outcomes of a send. Default copy comes from `contactUsFormMessages`. */
export interface ContactUsFormMessages {
  /** Shown on the submit button while the message sends. */
  pendingLabel: string
  /** Said once the message is sent. */
  success: React.ReactNode
  /** Said when sending failed. */
  error: React.ReactNode
  /** Said under a required field left empty. */
  requiredError: string
  /** Said under an email field that is not an address. */
  emailError: string
  /** Said under a required checkbox left clear. */
  consentError: string
  /** The word at the end of a required field's label row, in the atom's Top Right label slot. */
  requiredLabel: string
  /** The thank-you panel's button, which brings the form back. */
  againLabel: string
}

export const contactUsFormMessages: Record<ContactUsLocale, ContactUsFormMessages> = {
  en: {
    pendingLabel: "Sending",
    success: "Thank you. Your message is on its way to the team.",
    error: "We could not send that. Please try again.",
    requiredError: "This field is required.",
    emailError: "Enter a valid email address.",
    consentError: "Accept this to continue.",
    requiredLabel: "Required",
    againLabel: "Send another message",
  },
  ar: {
    pendingLabel: "جارٍ الإرسال",
    success: "شكرًا لك. وصلت رسالتك إلى الفريق.",
    error: "تعذّر الإرسال. حاول مرة أخرى.",
    requiredError: "هذا الحقل مطلوب.",
    emailError: "اكتب بريدًا إلكترونيًا صحيحًا.",
    consentError: "وافق للمتابعة.",
    requiredLabel: "مطلوب",
    againLabel: "أرسل رسالة أخرى",
  },
}

/** The messages for a language, with any the block was given in place of the defaults. */
export function pickFormMessages(locale: ContactUsLocale, given: Partial<ContactUsFormMessages>): ContactUsFormMessages {
  const defaults = contactUsFormMessages[locale]
  return {
    pendingLabel: given.pendingLabel ?? defaults.pendingLabel,
    success: given.success ?? defaults.success,
    error: given.error ?? defaults.error,
    requiredError: given.requiredError ?? defaults.requiredError,
    emailError: given.emailError ?? defaults.emailError,
    consentError: given.consentError ?? defaults.consentError,
    requiredLabel: given.requiredLabel ?? defaults.requiredLabel,
    againLabel: given.againLabel ?? defaults.againLabel,
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactUsFormState {
  values: ContactUsValues
  errors: Record<string, string>
  status: ContactUsStatus
  /** True while sending, or when the block is disabled. */
  disabled: boolean
  messages: ContactUsFormMessages
  formRef: React.MutableRefObject<HTMLFormElement | null>
  setValue: (name: string, value: ContactUsValue) => void
  submit: (event: React.FormEvent) => void
  reset: () => void
}

export interface UseContactUsFormOptions {
  fields: readonly ContactUsFieldDef[]
  messages: ContactUsFormMessages
  onSubmit?: (values: ContactUsValues) => void | Promise<void>
  disabled?: boolean
  /** What the fields hold at first, and again after "send another". */
  defaultValues?: ContactUsValues
}

/**
 * The form's state machine: idle, pending, success or error. Submitting
 * checks every field, puts the reader's focus on the first one that fails,
 * and only then calls `onSubmit`.
 */
export function useContactUsForm({ fields, messages, onSubmit, disabled = false, defaultValues }: UseContactUsFormOptions): ContactUsFormState {
  const initial = React.useRef<ContactUsValues>(defaultValues ?? {})
  const [values, setValues] = React.useState<ContactUsValues>(initial.current)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [status, setStatus] = React.useState<ContactUsStatus>("idle")
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const focusFirst = React.useRef(false)
  const alive = React.useRef(true)
  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const setValue = React.useCallback((name: string, value: ContactUsValue) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!(name in current)) return current
      const rest = { ...current }
      delete rest[name]
      return rest
    })
    setStatus((current) => (current === "error" ? "idle" : current))
  }, [])

  const complete = (): ContactUsValues =>
    Object.fromEntries(
      fields.map((field) => {
        const value = values[field.name]
        if (field.kind === "checkbox") return [field.name, value === true]
        return [field.name, typeof value === "string" ? value.trim() : ""]
      })
    )

  const validate = (clean: ContactUsValues) => {
    const next: Record<string, string> = {}
    for (const field of fields) {
      const value = clean[field.name]
      if (field.kind === "checkbox") {
        if (field.required && value !== true) next[field.name] = messages.consentError
      } else if (value === "") {
        if (field.required) next[field.name] = messages.requiredError
      } else if (field.kind === "email" && !EMAIL.test(String(value))) {
        next[field.name] = messages.emailError
      }
    }
    return next
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (status === "pending" || disabled) return
    const clean = complete()
    const next = validate(clean)
    setErrors(next)
    if (Object.keys(next).length > 0) {
      focusFirst.current = true
      return
    }
    setStatus("pending")
    try {
      await onSubmit?.(clean)
      if (alive.current) setStatus("success")
    } catch {
      if (alive.current) setStatus("error")
    }
  }

  // After a failed check, the first field that failed takes focus.
  React.useEffect(() => {
    if (!focusFirst.current) return
    focusFirst.current = false
    formRef.current?.querySelector<HTMLElement>("[data-invalid] input, [data-invalid] textarea, [data-invalid] button")?.focus()
  }, [errors])

  const reset = React.useCallback(() => {
    setValues(initial.current)
    setErrors({})
    setStatus("idle")
  }, [])

  return { values, errors, status, disabled: disabled || status === "pending", messages, formRef, setValue, submit, reset }
}

const ContactUsFormContext = React.createContext<ContactUsFormState | null>(null)

function useFormContext() {
  const form = React.useContext(ContactUsFormContext)
  if (!form) throw new Error("A Contact Us field must sit inside a ContactUsForm.")
  return form
}

export interface ContactUsFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** The state from `useContactUsForm`. */
  form: ContactUsFormState
}

/**
 * The `<form>`, which checks its own fields. Once the message is sent it shows
 * the thank-you panel in place of its children; when sending fails it adds the
 * error under them.
 */
export function ContactUsForm({ form, className, children, ...props }: ContactUsFormProps) {
  return (
    <ContactUsFormContext.Provider value={form}>
      <form ref={form.formRef} noValidate onSubmit={form.submit} aria-busy={form.status === "pending" || undefined} className={className} {...props}>
        {form.status === "success" ? (
          <div role="status" className="flex flex-col items-start gap-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-soft-success text-success">
              <Check aria-hidden size={20} strokeWidth={1.5} />
            </span>
            <p className="text-base font-medium text-foreground">{form.messages.success}</p>
            <Button type="button" variant="outline" size="md" onClick={form.reset}>
              {form.messages.againLabel}
            </Button>
          </div>
        ) : (
          <>
            {children}
            {form.status === "error" ? (
              <p role="alert" className="text-sm text-destructive">
                {form.messages.error}
              </p>
            ) : null}
          </>
        )}
      </form>
    </ContactUsFormContext.Provider>
  )
}

/** The submit button: it shows the pending label while the message sends. */
export function ContactUsSubmit({ children, ...props }: Omit<ButtonProps, "type" | "loading" | "loadingLabel">) {
  const form = useFormContext()
  return (
    <Button type="submit" loading={form.status === "pending"} loadingLabel={form.messages.pendingLabel} disabled={form.disabled && form.status !== "pending"} {...props}>
      {children}
    </Button>
  )
}

// Textarea's own box is 60px, with its label row 88px: a group can ask for
// more, as Figma's fixed 104px Textarea does. Tailwind reads classes as written.
export const CONTACT_US_TEXTAREA_88 = "min-h-[88px]"
export const CONTACT_US_TEXTAREA_104 = "min-h-[104px]"

/**
 * A phone field. Browsers give `type=tel` a left-to-right direction of its own,
 * so in an Arabic page its value and placeholder would sit on the left while
 * every other field's sit on the right. The direction stays left-to-right, so
 * "+971 50 123 4567" never reverses, and only the alignment follows the page.
 */
const TEL_ALIGN = "rtl:[&_[data-slot=input]]:text-right"

/** A date field keeps its value as `yyyy-mm-dd`, the same text a native date input sends. */
const isoDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
const parseIsoDate = (text: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text)
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null
}

/** One field of the form, drawn with the atom its `kind` names. */
export function ContactUsField({ field, className, reveal }: { field: ContactUsFieldDef; className?: string; reveal?: boolean }) {
  const form = useFormContext()
  const errorId = React.useId()
  const error = form.errors[field.name]
  const value = form.values[field.name]
  const text = typeof value === "string" ? value : ""
  const wrap = { "data-contact-field": field.name, "data-invalid": error ? "" : undefined, "data-reveal": reveal ? "rise" : undefined, className: cn("min-w-0", className) }
  const aria = { "aria-required": field.required || undefined, "aria-label": field.hideLabel ? field.label : undefined }
  // The word sits in the atom's Top Right label slot, so a field with no visible label has no slot and shows nothing. It is still required.
  const requiredWord = field.required && !field.hideLabel ? form.messages.requiredLabel : undefined
  const label = field.hideLabel ? undefined : field.label

  if (field.kind === "select")
    return (
      <div {...wrap}>
        <Select
          name={field.name}
          size={field.size ?? "md"}
          radius={field.radius}
          label={label}
          labelEnd={requiredWord}
          placeholder={field.placeholder}
          items={field.options ?? []}
          value={text === "" ? null : text}
          onValueChange={(next) => form.setValue(field.name, next ?? "")}
          disabled={form.disabled}
          description={error ? <span className="text-destructive">{error}</span> : undefined}
          {...aria}
        />
      </div>
    )

  if (field.kind === "textarea") {
    const max = field.maxLength
    const near = max !== undefined && text.length >= max * 0.8
    return (
      <div {...wrap}>
        <Textarea
          name={field.name}
          label={label}
          labelEnd={requiredWord}
          placeholder={field.placeholder}
          maxLength={max}
          disabled={form.disabled}
          value={text}
          onChange={(event) => form.setValue(field.name, event.target.value)}
          invalid={Boolean(error)}
          error={error}
          descriptionEnd={
            near && max !== undefined ? (
              <span className={text.length >= max ? "text-destructive" : text.length >= max * 0.9 ? "text-warning" : undefined}>
                {text.length}/{max}
              </span>
            ) : undefined
          }
          className={field.groupClassName}
          {...aria}
        />
      </div>
    )
  }

  if (field.kind === "checkbox")
    return (
      <div {...wrap}>
        <Checkbox
          name={field.name}
          size={field.size ?? "md"}
          label={field.label}
          checked={value === true}
          disabled={form.disabled}
          onChange={(event) => form.setValue(field.name, event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...aria}
        />
        {error ? (
          <p id={errorId} className="mt-1 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    )

  if (field.kind === "date")
    return (
      <div {...wrap}>
        <DatePicker
          size={field.size ?? "md"}
          label={label}
          labelEnd={requiredWord}
          placeholder={field.placeholder}
          disabled={form.disabled}
          value={parseIsoDate(text)}
          onValueChange={(next) => form.setValue(field.name, next ? isoDate(next) : "")}
          description={error ? <span className="text-destructive">{error}</span> : undefined}
          aria-label={field.hideLabel ? field.label : undefined}
        />
      </div>
    )

  return (
    <div {...wrap}>
      <Input
        name={field.name}
        type={field.kind}
        size={field.size ?? "md"}
        radius={field.radius}
        endIcon={field.endIcon}
        label={label}
        labelEnd={requiredWord}
        className={cn(field.kind === "tel" && TEL_ALIGN, field.groupClassName)}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        disabled={form.disabled}
        value={text}
        onChange={(event) => form.setValue(field.name, event.target.value)}
        invalid={Boolean(error)}
        error={error}
        {...aria}
      />
    </div>
  )
}

/**
 * A single choice, as chips: Figma's Badge, Solid Success when chosen and
 * Outline otherwise. Each chip is an `aria-pressed` button; pressing the chosen one
 * clears the choice. The chosen chip's `value` is the field's value.
 */
export function ContactUsChoiceGroup({ name, label, options, className }: { name: string; label: string; options: readonly ContactUsOption[]; className?: string }) {
  const form = useFormContext()
  const labelId = React.useId()
  const chosen = form.values[name]
  return (
    <div role="group" aria-labelledby={labelId} className={cn("flex min-w-0 flex-col gap-3", className)}>
      <p id={labelId} className="text-sm font-medium text-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const pressed = chosen === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              disabled={form.disabled}
              onClick={() => form.setValue(name, pressed ? "" : option.value)}
              className={cn(
                badgeVariants({ variant: pressed ? "solid" : "outline", tone: "primary", size: "lg", radius: "rounded" }),
                "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-[transform,background-color,color] motion-safe:duration-[120ms] active:motion-safe:scale-[0.97]"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

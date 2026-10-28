"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Team` (46368:243916). The parts every `team-*` block is built from:
 * the section and its 1280px column, the header, a portrait that stands in
 * for a photo when none is passed, a hairline, the link arrow, and the one-time
 * entrance reveal each block's motion card describes.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Pricing blocks are: the section is a query container, so a block lays out
 * for the room it is given, such as a docs preview narrower than the screen.
 * The base classes are Figma's Mobile (360); `[@container(min-width:40rem)]:`
 * is its Tablet, from 640px of content (Figma's Tablet, 768 less its padding),
 * and `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The page's `dir` sets the direction; nothing here takes one.
 *
 * No block ships with photos. Each person takes a `photo` ({ src, alt }); the
 * docs site and the Storybook stories pass the ones in public/blocks/team/.
 */

export type TeamLocale = "en" | "ar"

/** A photo passed in as a prop: the file, and the alt text in the page's language. */
export interface TeamPhoto {
  src: string
  alt: string
}

/** The two lines every Type gives a person. */
export interface TeamPerson {
  name: React.ReactNode
  role: React.ReactNode
  /** Hidden when empty: a neutral tile with the initials stands in. */
  photo?: TeamPhoto
}

const ARABIC = /[؀-ۿ]/

/**
 * Text with every run of digits in it set in its own left-to-right isolate, so
 * a count inside an Arabic sentence keeps its order, as Figma's LRM marks do.
 * Anything but a string passes through untouched.
 */
export function TeamFigures({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>
  const parts = children.split(/(\d[\d,.]*)/)
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

/** Up to two initials from a name, for the tile that stands in for a photo. */
export function initialsOf(name: React.ReactNode) {
  if (typeof name !== "string") return ""
  const words = name.trim().split(/\s+/)
  if (ARABIC.test(name)) return words[0]?.[0] ?? ""
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

/* ------------------------------------------------------------------ */
/* The one-time entrance reveal                                        */
/* ------------------------------------------------------------------ */

/**
 * Starts a block's entrance once, when it first scrolls into view, and never
 * again. Nothing is tied to the scroll position: the section only flips from
 * `pending` to `done`, and the CSS transitions on the parts do the rest.
 *
 * With reduced motion the state is never set, so everything is simply there.
 * Without JavaScript, or before the hook runs, nothing is hidden either.
 */
export function useRevealOnce<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [state, setState] = React.useState<"idle" | "pending" | "done">("idle")

  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node || typeof window === "undefined") return
    if (typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setState("pending")
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("done")
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, state] as const
}

/**
 * Classes that give a part its entrance: it sits `--reveal-y` / `--reveal-x`
 * away and transparent while the section is `pending`, then eases into place.
 * They are all `motion-safe:`, so reduced motion never sees the hidden state.
 */
export const REVEAL =
  "motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out motion-safe:[transition-delay:calc(var(--reveal-i,0)*var(--reveal-step,60ms))] rtl:[--reveal-dir:-1] " +
  "motion-safe:group-data-[reveal=pending]/team:opacity-0 motion-safe:group-data-[reveal=pending]/team:[transform:translate(calc(var(--reveal-x,0px)*var(--reveal-dir,1)),var(--reveal-y,12px))]"

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Its place in the sequence, for the stagger. */
  index?: number
  /** Pixels it rises from. Default 12. */
  y?: number
  /** Pixels it slides in from, away from the start of the line (flipped for right-to-left). Default 0. */
  x?: number
  /** The gap between two parts of the sequence, in ms. Default 60. */
  step?: number
  as?: "div" | "li" | "article" | "header" | "span"
}

/** A part of a block with the entrance above. `x` follows the page's direction. */
export function Reveal({ index = 0, y = 12, x = 0, step = 60, as: Tag = "div", className, style, ...props }: RevealProps) {
  return (
    <Tag
      className={cn(REVEAL, className)}
      style={{ "--reveal-i": index, "--reveal-y": `${y}px`, "--reveal-x": `${x}px`, "--reveal-step": `${step}ms`, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Section, header, portrait                                           */
/* ------------------------------------------------------------------ */

export interface TeamSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Paints the section with the inverse tokens, as Hairline Team Grid is. */
  inverse?: boolean
  /** Classes for the 1280px column inside the padding. */
  contentClassName?: string
}

/**
 * Figma's section: `background`, padding 96 × 80 on Desktop, 64 × 24 on Tablet
 * and 32 × 16 on phones, and a 1280px column with 48px between the header and
 * what follows. It also runs the block's one-time entrance.
 */
export function TeamSection({ labelledBy, inverse, className, contentClassName, children, ...props }: TeamSectionProps) {
  const [ref, reveal] = useRevealOnce<HTMLElement>()
  return (
    <section
      ref={ref}
      aria-labelledby={labelledBy}
      data-reveal={reveal}
      className={cn(
        "group/team [container-type:inline-size] px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        inverse ? "bg-background-inverse text-foreground-inverse" : "bg-background text-foreground",
        className
      )}
      {...props}
    >
      <div className={cn("mx-auto flex w-full max-w-[1280px] flex-col gap-12", contentClassName)}>{children}</div>
    </section>
  )
}

export interface TeamHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The small label above the heading. Hidden when empty. */
  eyebrow?: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. Hidden when empty. */
  description?: React.ReactNode
  /** Centres the header; by default it starts at the start edge. */
  centered?: boolean
  /** The inverse tokens, for a block painted with them. */
  inverse?: boolean
  /** Classes for the heading, to set its size and weight. */
  headingClassName?: string
}

/**
 * The header: an eyebrow in `muted-foreground`, the heading (3XL on phones, 4XL
 * from Tablet up) and the description, 12px apart. Anything passed as children,
 * such as the two buttons of the Roster, follows them.
 */
export function TeamHeader({
  headingId,
  eyebrow,
  heading,
  description,
  centered,
  inverse,
  className,
  headingClassName,
  children,
  ...props
}: TeamHeaderProps) {
  const muted = inverse ? "text-muted-foreground-inverse" : "text-muted-foreground"
  return (
    <header className={cn("flex w-full flex-col gap-3", centered ? "items-center text-center" : "items-start text-start", className)} {...props}>
      {eyebrow ? (
        <Reveal index={0} className={cn("text-sm font-medium", muted)}>
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal index={1} as="div" className="w-full">
        <h2
          id={headingId}
          className={cn(
            "text-3xl font-semibold [@container(min-width:40rem)]:text-4xl",
            inverse ? "text-foreground-inverse" : "text-foreground",
            headingClassName
          )}
        >
          <TeamFigures>{heading}</TeamFigures>
        </h2>
      </Reveal>
      {description ? (
        <Reveal index={2} className={cn("text-base [@container(min-width:40rem)]:text-lg", muted, "max-w-[45rem]")}>
          <p>
            <TeamFigures>{description}</TeamFigures>
          </p>
        </Reveal>
      ) : null}
      {children}
    </header>
  )
}

export interface TeamPortraitProps extends React.HTMLAttributes<HTMLDivElement> {
  person: Pick<TeamPerson, "name" | "photo">
  /** Classes for the image, such as `object-top`. */
  imageClassName?: string
}

/**
 * A person's photo filling its box, `object-cover`, or, with no photo, a tile in
 * `muted` with their initials. The box takes its size from the classes passed.
 */
export function TeamPortrait({ person, className, imageClassName, ...props }: TeamPortraitProps) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)} {...props}>
      {person.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- a registry block can't assume next/image
        <img src={person.photo.src} alt={person.photo.alt} loading="lazy" decoding="async" draggable={false} className={cn("size-full object-cover", imageClassName)} />
      ) : (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center text-lg font-medium text-muted-foreground">
          {initialsOf(person.name)}
        </span>
      )}
    </div>
  )
}

/** A hairline between two groups. Not the Separator component, which Fasla has not built yet. */
export function TeamRule({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" aria-hidden className={cn("h-px w-full bg-border", className)} {...props} />
}

/** The up-right arrow that marks a link, mirrored for right-to-left pages. */
export function TeamLinkArrow({ className, ...props }: React.ComponentProps<typeof ArrowUpRight>) {
  return <ArrowUpRight aria-hidden className={cn("size-4 shrink-0 rtl:-scale-x-100", className)} {...props} />
}

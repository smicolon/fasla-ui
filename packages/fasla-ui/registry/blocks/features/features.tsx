"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Features` (42367:57765). The parts every `features-*` block is built
 * from, one per thing the Figma set repeats: the section and its 1248px
 * column, the left-aligned section header (a 12px eyebrow, the heading and a
 * line under it), the figures helper and the plain hairline.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container, so a block lays out for the room it is given, such as a docs
 * preview narrower than the screen. The base classes are Figma's Mobile
 * (360); `[@container(min-width:48rem)]:` is its Tablet (768) and
 * `[@container(min-width:72rem)]:` its Desktop. The padding is on an inner
 * wrapper so it can follow the container too: 32px, 64px, 96px. The page's
 * `dir` sets the direction; nothing here takes one.
 */

export type FeaturesLocale = "en" | "ar"

const FIGURE = /(\d[\d,.]*[%×]?)/

/**
 * Figures inside a sentence, such as `99.99%` or `1,240`, each set in its own
 * left-to-right isolate so they keep their order inside Arabic text, as
 * Figma's LRI…PDI marks do. Anything but a string passes through untouched.
 */
export function Figures({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>
  const parts = children.split(FIGURE)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <bdi key={index} dir="ltr" className="whitespace-nowrap">
            {part}
          </bdi>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

export interface FeaturesSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the 1248px column inside the padding. */
  contentClassName?: string
  /** The space between the header and what follows: 64px (`lg`), 48px (`md`) or 32px (`sm`), as Figma sets each Type. */
  gap?: "lg" | "md" | "sm"
}

/**
 * Figma's section: `theme/background` (a Type paints its own with
 * `className`), padding 32 on phones, 64 on Tablet and 96 on Desktop, and a
 * 1248px column.
 */
export function FeaturesSection({ labelledBy, className, contentClassName, gap = "lg", children, ...props }: FeaturesSectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={cn("[container-type:inline-size] bg-background text-foreground", className)} {...props}>
      <div className="p-8 [@container(min-width:48rem)]:p-16 [@container(min-width:72rem)]:p-24">
        <div
          className={cn(
            "mx-auto flex w-full max-w-[1248px] flex-col",
            gap === "lg" ? "gap-12 [@container(min-width:48rem)]:gap-16" : gap === "md" ? "gap-10 [@container(min-width:72rem)]:gap-12" : "gap-8",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}

export interface FeaturesHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The 12px line above the heading, in `primary`. Hidden when empty. */
  eyebrow?: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading, in `muted-foreground`. Hidden when empty. */
  description?: React.ReactNode
  /** Paints the header on an inverse surface. */
  inverse?: boolean
  /** Caps the header's width in px, as Figma narrows it beside a note or a button. */
  maxWidth?: number
}

/**
 * Figma's `Section Header`: the eyebrow, the heading (3XL on phones, 3XL from
 * Tablet, 4XL on Desktop) and its line, 16px apart.
 */
export function FeaturesHeader({ headingId, eyebrow, heading, description, inverse = false, maxWidth, className, style, children, ...props }: FeaturesHeaderProps) {
  return (
    <header className={cn("flex w-full min-w-0 flex-col items-start gap-4", className)} style={maxWidth ? { maxWidth, ...style } : style} {...props}>
      {eyebrow ? (
        <p className={cn("text-xs font-medium tracking-wide rtl:tracking-normal", inverse ? "text-muted-foreground-inverse" : "text-primary")}>{eyebrow}</p>
      ) : null}
      <h2
        id={headingId}
        className={cn(
          "text-2xl font-semibold [@container(min-width:48rem)]:text-3xl [@container(min-width:72rem)]:text-4xl",
          inverse ? "text-foreground-inverse" : "text-foreground"
        )}
      >
        {heading}
      </h2>
      {description ? <p className={cn("text-base", inverse ? "text-muted-foreground-inverse" : "text-muted-foreground")}>{description}</p> : null}
      {children}
    </header>
  )
}

/**
 * Figma's `Separator`: a 1px `border` line across its container. The code
 * library has no Separator component yet; swap this for it once it does.
 */
export function FeaturesRule({ className }: { className?: string }) {
  return <div data-separator="" aria-hidden="true" className={cn("h-px w-full shrink-0 bg-border", className)} />
}

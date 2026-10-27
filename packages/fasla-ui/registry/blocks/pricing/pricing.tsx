"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Pricing` (46332:2894). The parts every `pricing-*` block is built
 * from, one per thing the Figma set repeats: the section and its 1280px
 * content, the centred header, a price with its unit, the list of features
 * with a check before each, and the hairline between groups.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Gallery blocks are: the section is a query container, so a block lays out
 * for the room it is given, such as a docs preview narrower than the screen.
 * The base classes are Figma's Mobile (360); `[@container(min-width:40rem)]:`
 * is its Tablet, from 640px of content (Figma's Tablet, 768 less its padding),
 * and `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element can't
 * query itself. The page's `dir` sets the direction; nothing here takes one.
 */

export type PricingLocale = "en" | "ar"

const ARABIC = /[؀-ۿ]/

/**
 * Whether a string has no Arabic letters. Figma keeps such figures — a price,
 * "99.9%", "—" — on its English style in the Arabic variants too, so they stay
 * in Geist: `font-sans` with the English line height, set explicitly because
 * `[dir="rtl"]` re-leads every `text-*` size to Cairo's.
 */
export const isLatin = (text: React.ReactNode) => typeof text === "string" && !ARABIC.test(text)

/**
 * A price, an amount or a count, with its sign and currency: `$29`,
 * `–$480.00`, `2,784.00`, `24`. Figures joined by a slash stay one run, so
 * `24/7` is not split into `24` and `7` and read back as `7/24`.
 */
const FIGURE = /([−–-]?\$?\d[\d,.]*(?:\/\d[\d,.]*)*)/

/**
 * Text with every figure in it set in its own left-to-right isolate, so a
 * price inside an Arabic sentence keeps its order — `فوترة سنوية، أو $59
 * شهريًا`, `8 مقاعد × $29 × 12 شهرًا` — as Figma's LRI…PDI marks keep it.
 * A trailing `%` stays outside the isolate, as it does in Figma.
 * Anything but a string passes through untouched.
 */
export function Figures({ children }: { children: React.ReactNode }) {
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

export interface PricingSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the 1280px column inside the padding. */
  contentClassName?: string
}

/**
 * Figma's section: `theme/background`, padding 96 × 80 on Desktop, 64 × 24
 * on Tablet and 32 × 16 on phones, and a 1280px column with 48px between
 * the header and what follows.
 */
export function PricingSection({ labelledBy, className, contentClassName, children, ...props }: PricingSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24", className)}
      {...props}
    >
      <div className={cn("mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12", contentClassName)}>{children}</div>
    </section>
  )
}

export interface PricingHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The Soft badge above the heading. Hidden when empty. */
  eyebrow?: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description?: React.ReactNode
}

/**
 * The centred header: an optional Soft badge, the heading (2XL on phones, 3XL
 * from Tablet up) and the description in `muted-foreground`, 12px apart.
 * Anything passed as children, such as the billing toggle, follows them.
 */
export function PricingHeader({ headingId, eyebrow, heading, description, className, children, ...props }: PricingHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col items-center gap-3 text-center", className)} {...props}>
      {eyebrow ? (
        <Badge variant="soft" size="sm">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
        <Figures>{heading}</Figures>
      </h2>
      {description ? (
        <p className="text-base text-muted-foreground">
          <Figures>{description}</Figures>
        </p>
      ) : null}
      {children}
    </header>
  )
}

/** Figma's two price sizes: 5XL on the plan cards, LG in the rows you choose from. */
export type PricingPriceSize = "display" | "row"

const AMOUNT: Record<PricingPriceSize, string> = {
  display: "text-5xl leading-[3.625rem]",
  row: "text-lg leading-7",
}
const UNIT: Record<PricingPriceSize, string> = {
  display: "text-sm",
  row: "text-xs",
}

export interface PricingPriceProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** The price, `$24`. */
  amount: React.ReactNode
  /** What the price is per, `/user/mo`. Hidden when empty. */
  unit?: React.ReactNode
  /** A struck-through price before it, the one the plan used to cost. Hidden when empty. */
  previous?: React.ReactNode
  /** Which of Figma's two sizes. */
  size?: PricingPriceSize
}

/**
 * The amount in `foreground`, Semi Bold, with its unit in `muted-foreground`
 * after it on the same baseline (6px apart on a card, 4px in a row). A
 * previous price, when there is one, comes first, struck through, at LG.
 * The amount keeps Geist in Arabic, as Figma sets it.
 */
export function PricingPrice({ amount, unit, previous, size = "display", className, ...props }: PricingPriceProps) {
  return (
    <p className={cn("flex flex-wrap items-baseline", size === "display" ? "gap-x-1.5" : "gap-x-1", className)} {...props}>
      {previous ? (
        <s className={cn("text-lg text-muted-foreground", isLatin(previous) && "font-sans leading-7")}>
          <Figures>{previous}</Figures>
        </s>
      ) : null}
      <span className={cn("font-semibold text-foreground", AMOUNT[size], isLatin(amount) && "font-sans")}>
        <Figures>{amount}</Figures>
      </span>
      {unit ? (
        <span className={cn("text-muted-foreground", UNIT[size])}>
          <Figures>{unit}</Figures>
        </span>
      ) : null}
    </p>
  )
}

export interface PricingFeatureListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The short label above the list, "What's included". Hidden when empty. */
  label?: React.ReactNode
  /** One line per feature. */
  features: React.ReactNode[]
  /** Figma's two sizes: SM text and 16px checks on the cards, XS and 14px in Plan Picker's rows. */
  size?: "sm" | "xs"
}

/**
 * The features, one per line, each after a `primary` check (Lucide's, at
 * Figma's 1.5 stroke). The label is SM Medium in `foreground`; the lines are
 * `muted-foreground`.
 */
export function PricingFeatureList({ label, features, size = "sm", className, ...props }: PricingFeatureListProps) {
  const small = size === "xs"
  return (
    <div className={cn("flex w-full flex-col", small ? "gap-1.5" : "gap-3", className)} {...props}>
      {label ? (
        <p className="text-sm font-medium text-foreground">
          <Figures>{label}</Figures>
        </p>
      ) : null}
      <ul className={cn("flex flex-col", small ? "gap-1.5" : "gap-3")}>
        {features.map((feature, index) => (
          <li key={index} className={cn("flex items-center gap-2 text-muted-foreground", small ? "text-xs" : "text-sm")}>
            <Check size={small ? 14 : 16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 text-primary" />
            <span className="min-w-0">
              <Figures>{feature}</Figures>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Figma's `Separator`: a 1px `border` line across its container. The code
 * library has no Separator component yet; swap this for it once it does.
 */
export function PricingRule({ className }: { className?: string }) {
  return <div role="presentation" className={cn("w-full border-t border-border", className)} />
}

/** A plan's button: a link when it has an `href`, a button that calls `onPlanSelect` when it hasn't. */
export interface PricingAction {
  label: React.ReactNode
  href?: string
}

export interface PricingActionButtonProps {
  action: PricingAction
  /** Solid `primary` for the plan you recommend, Outline for the others. */
  highlighted?: boolean
  /** Figma's Button sizes: md (36px) on the cards, sm (32px) in the matrix, lg (40px) in Plan Spotlight. */
  size?: "sm" | "md" | "lg"
  /** Called when a button without an `href` is pressed. */
  onSelect?: () => void
  className?: string
}

/** The action as a full-width Button, or as a link styled as one when it has an `href`. */
export function PricingActionButton({ action, highlighted = false, size = "md", onSelect, className }: PricingActionButtonProps) {
  const variant = highlighted ? "default" : "outline"
  const label = (
    <span>
      <Figures>{action.label}</Figures>
    </span>
  )
  if (action.href) {
    return (
      <a href={action.href} className={buttonVariants({ variant, size, className: cn("w-full", className) })}>
        {label}
      </a>
    )
  }
  return (
    <Button type="button" variant={variant} size={size} onClick={onSelect} className={cn("w-full", className)}>
      {label}
    </Button>
  )
}

export interface PricingPlanCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  name: React.ReactNode
  /** A Solid badge beside the name, "Most popular". Hidden when empty. */
  badge?: React.ReactNode
  description?: React.ReactNode
  price: React.ReactNode
  unit?: React.ReactNode
  /** A struck-through earlier price before the price. Hidden when empty. */
  previousPrice?: React.ReactNode
  /** The line under the price, how the plan is billed. Hidden when empty. */
  note?: React.ReactNode
  /** Figma's Growth card: a `primary` border, a 5% `primary` tint, the md shadow and a Solid button. */
  highlighted?: boolean
  /** The button: Solid on the highlighted card, Outline on the others. */
  action: React.ReactNode
  featuresLabel?: React.ReactNode
  features: React.ReactNode[]
}

/**
 * The card Pricing Tiers and Two-Plan Compare are built from: 32px padding,
 * 24px between its groups, `border radius/xl` (14px), a 1px `border` line
 * and Figma's xs shadow. The line is an inset ring, drawn inside the card as
 * Figma draws its stroke, so the card keeps Figma's height; forced-colors
 * mode, which drops shadows, gets a real border instead. The name (XL Semi
 * Bold) and its badge share the top row, then the description, the price and
 * its note, the button, a rule, and the features. The highlighted card lays a
 * 5% `primary` tint over `card`, as Figma stacks the two fills.
 */
export function PricingPlanCard({
  name,
  badge,
  description,
  price,
  unit,
  previousPrice,
  note,
  highlighted = false,
  action,
  featuresLabel,
  features,
  className,
  ...props
}: PricingPlanCardProps) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-6 rounded-xl bg-card p-8 ring-1 ring-inset forced-colors:border",
        highlighted ? "bg-gradient-to-r from-primary/5 to-primary/5 shadow-md ring-primary" : "shadow-sm ring-border",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold text-foreground">
            <Figures>{name}</Figures>
          </h3>
          {badge ? <Badge>{badge}</Badge> : null}
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">
            <Figures>{description}</Figures>
          </p>
        ) : null}
        <div className="flex flex-col gap-1">
          <PricingPrice amount={price} unit={unit} previous={previousPrice} />
          {note ? (
            <p className="text-xs text-muted-foreground">
              <Figures>{note}</Figures>
            </p>
          ) : null}
        </div>
      </div>
      {action}
      <PricingRule />
      <PricingFeatureList label={featuresLabel} features={features} />
    </article>
  )
}

"use client"

import * as React from "react"
import { ArrowUpRight, Banknote, Clock, MapPin, Users } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants, type ButtonProps } from "../../ui/button/button"

/*
 * Figma: `Careers` (46378:5405). The parts every `careers-*` block is built
 * from, one per thing the Figma set repeats: the section and its 1248px
 * column, the left-aligned header, a role's meta line (place, commitment and
 * pay, each after a Lucide mark), the New badge, a role's action, the plain
 * hairline, and the small helpers that filter and count roles.
 *
 * Mobile first, and sized by the block's own width, not the window's, as the
 * Pricing and Gallery blocks are: the section is a query container, so a
 * block lays out for the room it is given, such as a docs preview narrower
 * than the screen. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet, from 640px of content
 * (Figma's Tablet, 768 less its padding), and `[@container(min-width:64rem)]:`
 * its Desktop, from 1024px of content. The section's own padding still
 * follows the window, since an element can't query itself. The page's `dir`
 * sets the direction; nothing here takes one.
 */

export type CareersLocale = "en" | "ar"

/** The value every "all" filter holds. */
export const CAREERS_ALL = "all"

/**
 * One open role. Blocks take a list of these; the fields a block does not
 * draw are simply left out.
 */
export interface CareersRole {
  /** Keys the role, and names it for filters and callbacks. */
  id: string
  /** The role's title. */
  title: React.ReactNode
  /** The team, such as "Design". Filters on this value, so write it the way the filter shows it. */
  department?: string
  /** One line on what the role does. */
  summary?: React.ReactNode
  /** Where the role is, such as "Remote (EU)". Filters on this value. */
  location?: string
  /** How the role is worked, such as "Full-time". Filters on this value. */
  commitment?: string
  /** The pay, such as `$95K–$120K`. */
  pay?: React.ReactNode
  /** Shows the New badge beside the title. */
  isNew?: boolean
  /** When the role was posted, such as "Posted 2 days ago". */
  posted?: React.ReactNode
  /** Where the role's page is. A role without one calls the block's `onRoleSelect`. */
  href?: string
}

const ARABIC = /[؀-ۿ]/

/** Whether a string has no Arabic letters, such as a pay range, which Figma keeps on its English style in Arabic too. */
export const isLatin = (text: React.ReactNode) => typeof text === "string" && !ARABIC.test(text)

/**
 * A pay range and the figures around it: `$95K–$120K` stays one run, and a
 * number inside an Arabic sentence, `من 95 إلى 120 ألف دولار`, keeps its
 * order. Each figure is set in its own left-to-right isolate, as Figma's
 * LRI…PDI marks do. Anything but a string passes through untouched.
 */
const FIGURE = /(\$?\d[\d,.]*K?(?:[–-]\$?\d[\d,.]*K?)?)/

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

export interface CareersSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** The id of the heading that names the section. */
  labelledBy?: string
  /** Classes for the 1248px column inside the padding. */
  contentClassName?: string
  /** The space between the header and what follows: 48px (`lg`) or 40px (`md`), as Figma sets each Type. */
  gap?: "lg" | "md"
}

/**
 * Figma's section: `theme/background`, padding 80 × 96 on Desktop, 64 × 24
 * on Tablet and 32 × 16 on phones, and a 1248px column.
 */
export function CareersSection({ labelledBy, className, contentClassName, gap = "lg", children, ...props }: CareersSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-24 lg:py-20", className)}
      {...props}
    >
      <div className={cn("mx-auto flex w-full max-w-[1248px] flex-col", gap === "lg" ? "gap-12" : "gap-10", contentClassName)}>{children}</div>
    </section>
  )
}

export interface CareersHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The id the section's `aria-labelledby` points at. */
  headingId: string
  /** The small line above the heading, or a Soft badge when `eyebrowBadge` is set. Hidden when empty. */
  eyebrow?: React.ReactNode
  /** Sets the eyebrow in a Soft badge rather than as a line of text. */
  eyebrowBadge?: boolean
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description?: React.ReactNode
  /** Figma's two heading sizes: 3XL on phones and 4XL from Tablet (`lg`), or 2XL and 3XL (`md`). */
  size?: "lg" | "md"
}

/**
 * The header, set from the start: an optional eyebrow, the heading and its
 * description in `muted-foreground`, 12px apart. Anything passed as children
 * follows them.
 */
export function CareersHeader({ headingId, eyebrow, eyebrowBadge = false, heading, description, size = "lg", className, children, ...props }: CareersHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col items-start gap-3", className)} {...props}>
      {eyebrow ? (
        eyebrowBadge ? (
          <Badge variant="soft" tone="secondary" size="md" radius="rounded">
            {eyebrow}
          </Badge>
        ) : (
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        )
      ) : null}
      <h2
        id={headingId}
        className={cn(
          "font-semibold text-foreground",
          size === "lg" ? "text-3xl [@container(min-width:40rem)]:text-4xl" : "text-2xl [@container(min-width:40rem)]:text-3xl"
        )}
      >
        {heading}
      </h2>
      {description ? <p className={cn("max-w-[720px] text-muted-foreground", size === "lg" ? "text-lg" : "text-base")}>{description}</p> : null}
      {children}
    </header>
  )
}

/**
 * Figma's `Separator`: a 1px `border` line across its container. The code
 * library has no Separator component yet; swap this for it once it does.
 */
export function CareersRule({ className }: { className?: string }) {
  return <div role="presentation" className={cn("w-full border-t border-border", className)} />
}

/** The "New" badge beside a role's title: Soft, `success`, small and pill-shaped, as Figma draws it. */
export function CareersNewBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Badge variant="soft" tone="success" size="sm" radius="rounded" className={cn("shrink-0", className)}>
      {children}
    </Badge>
  )
}

export interface CareersMetaItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ElementType
  children: React.ReactNode
}

/** One fact about a role: a 16px Lucide mark and its text, in `muted-foreground`. */
export function CareersMetaItem({ icon: Icon, children, className, ...props }: CareersMetaItemProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)} {...props}>
      <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0" />
      <span className="min-w-0">
        <Figures>{children}</Figures>
      </span>
    </span>
  )
}

export interface CareersRoleMetaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  role: Pick<CareersRole, "location" | "commitment" | "pay">
  /** The team, such as "Design Systems team", after a people mark, when a block shows it among the facts. */
  team?: React.ReactNode
  /** Lays the facts out in a column, as the card does, rather than in a wrapping row. */
  stacked?: boolean
}

/** A role's place, commitment and pay, each after its mark (map pin, clock, banknote), and its team when given. */
export function CareersRoleMeta({ role, team, stacked = false, className, ...props }: CareersRoleMetaProps) {
  const { location, commitment, pay } = role
  if (!location && !commitment && !pay && !team) return null
  return (
    <div className={cn("flex", stacked ? "flex-col gap-2" : "flex-wrap gap-x-4 gap-y-1", className)} {...props}>
      {location ? <CareersMetaItem icon={MapPin}>{location}</CareersMetaItem> : null}
      {commitment ? <CareersMetaItem icon={Clock}>{commitment}</CareersMetaItem> : null}
      {pay ? <CareersMetaItem icon={Banknote}>{pay}</CareersMetaItem> : null}
      {team ? <CareersMetaItem icon={Users}>{team}</CareersMetaItem> : null}
    </div>
  )
}

export interface CareersRoleActionProps {
  role: CareersRole
  /** The button's label, such as "View role". */
  label: React.ReactNode
  /** Figma's Button type: Outline on the list rows, Ghost on the cards, Solid on the featured role. */
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  /** Draws Figma's arrow-up-right after the label, mirrored in RTL. */
  arrow?: boolean
  /** Called when a role without an `href` is pressed. */
  onSelect?: (role: CareersRole) => void
  className?: string
}

/**
 * A role's button: a link styled as one when the role has an `href`, a
 * button that calls `onSelect` when it hasn't. Its accessible name adds the
 * role's title, so a list of "View role" buttons is not eight of the same.
 */
export function CareersRoleAction({ role, label, variant = "outline", size = "md", arrow = false, onSelect, className }: CareersRoleActionProps) {
  const text = typeof label === "string" ? label : undefined
  const ariaLabel = text && typeof role.title === "string" ? `${text}: ${role.title}` : undefined
  const content = (
    <>
      <span>{label}</span>
      {arrow ? <ArrowUpRight aria-hidden strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" /> : null}
    </>
  )
  if (role.href) {
    return (
      <a href={role.href} aria-label={ariaLabel} className={buttonVariants({ variant, size, className })}>
        {content}
      </a>
    )
  }
  return (
    <Button type="button" variant={variant} size={size} aria-label={ariaLabel} onClick={() => onSelect?.(role)} className={className}>
      {content}
    </Button>
  )
}

export interface CareersRoleFilters {
  department?: string
  location?: string
  commitment?: string
  /** Matches the title, summary and team, ignoring case. */
  query?: string
}

const textOf = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(" ")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

/** Whether a filter value narrows anything: empty, or the "all" value, does not. */
const active = (value: string | undefined) => !!value && value !== CAREERS_ALL

/** The roles a set of filters leaves, in their own order. */
export function filterRoles(roles: readonly CareersRole[], filters: CareersRoleFilters = {}): CareersRole[] {
  const query = filters.query?.trim().toLowerCase()
  return roles.filter((role) => {
    if (active(filters.department) && role.department !== filters.department) return false
    if (active(filters.location) && role.location !== filters.location) return false
    if (active(filters.commitment) && role.commitment !== filters.commitment) return false
    if (query) {
      const haystack = [textOf(role.title), textOf(role.summary), role.department ?? ""].join(" ").toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

/** The distinct values a field takes across the roles, in order of first appearance. */
export function distinctValues(roles: readonly CareersRole[], field: "department" | "location" | "commitment"): string[] {
  const seen = new Set<string>()
  for (const role of roles) {
    const value = role[field]
    if (value) seen.add(value)
  }
  return Array.from(seen)
}

/**
 * A count in Arabic, which agrees with its noun: one and two have their own
 * forms, 3 to 10 take the plural, 11 and over the singular. Each form is a
 * string with `{n}` where the number goes; the number is written in Western
 * digits. English needs none of this: `n === 1 ? "role" : "roles"`.
 */
export function arabicCount(n: number, forms: { zero: string; one: string; two: string; few: string; many: string }): string {
  const form = n === 0 ? forms.zero : n === 1 ? forms.one : n === 2 ? forms.two : n <= 10 ? forms.few : forms.many
  return form.replace("{n}", String(n))
}

/**
 * A value that is controlled when `value` is passed and held here when it is
 * not, so a block filters on its own and still takes `onChange` and a value
 * from the page that owns it.
 */
export function useControllableValue<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void): [T, (next: T) => void] {
  const [inner, setInner] = React.useState<T>(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [current, set]
}

/**
 * A role with its description, for the blocks that read a whole posting: the
 * panel and the page. Every field after `team` is optional; a block draws only
 * the sections it has.
 */
export interface CareersPosting extends CareersRole {
  /** The team's name, such as "Design Systems". */
  team?: string
  /** The paragraph under "About the role". */
  about?: React.ReactNode
  /** What the person will do, one bullet each. */
  responsibilities?: string[]
  /** What the team is looking for, one bullet each. */
  requirements?: string[]
  /** How the team hires, as a paragraph. */
  hiring?: React.ReactNode
}

/** A heading over what it names: Figma's section of a posting. */
export function CareersPostingSection({
  heading,
  level = 3,
  className,
  children,
}: {
  heading: React.ReactNode
  /** The heading's level, 2 on a page that has no `h2` of its own above it and 3 under one. */
  level?: 2 | 3
  className?: string
  children: React.ReactNode
}) {
  const Heading = level === 2 ? "h2" : "h3"
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <Heading className="text-base font-semibold text-foreground">{heading}</Heading>
      {children}
    </section>
  )
}

/** A bulleted list in `muted-foreground`, in one column or two from Tablet. */
export function CareersBullets({ items, columns = 1, className }: { items: readonly React.ReactNode[]; columns?: 1 | 2; className?: string }) {
  return (
    <ul
      className={cn(
        "list-disc space-y-2 ps-5 text-sm text-muted-foreground marker:text-muted-foreground",
        columns === 2 && "[@container(min-width:40rem)]:columns-2 [@container(min-width:40rem)]:gap-8 [@container(min-width:40rem)]:space-y-0 [&>li]:break-inside-avoid [&>li]:pb-2",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index}>
          <Figures>{item}</Figures>
        </li>
      ))}
    </ul>
  )
}

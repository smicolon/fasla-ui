"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cva } from "class-variance-authority"
import { ChevronDownIcon, MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Accordion` (15217:41213) and its row, `Accordion Item` (324:856).
 *
 * Built on Base UI's Accordion, which owns the behaviour: the button and
 * region roles and the ids that link them, `aria-expanded`, single or
 * multiple open items, Enter and Space, and the panel height it measures for
 * the open and close animation. There is no keyboard logic here; Tab moves
 * between the headings, as the WAI-ARIA pattern now recommends. This file
 * owns the look.
 *
 * Figma axis → code:
 *  - `Variants` Default / Split / Outline / Table Accordion → `variant`
 *    ("default" | "split" | "outline" | "table") on `Accordion`.
 *  - `Variants` Plus Minus → `indicator="plus"`. It is the Default layout with
 *    Lucide Plus and Minus in place of the chevron, so it works on every
 *    variant.
 *  - `Variants` Avatar, Icons and Multi-level are compositions, not props: an
 *    Avatar or icon inside `AccordionTrigger`, a second Accordion inside
 *    `AccordionContent`.
 *  - Item `Opened` → `value` / `defaultValue`; `State` → real hover and
 *    keyboard focus; `Direction` → the page's `dir`, never a prop.
 *
 * Figma draws every stroke inside its frame, overlapping the padding. Here
 * the dividers and outlines are ordinary borders outside it, so the padding
 * is Figma's and each bordered row is 1px taller than its frame.
 */

type AccordionVariant = "default" | "split" | "outline" | "table"
type AccordionIndicator = "chevron" | "plus"

const AccordionContext = React.createContext<{
  variant: AccordionVariant
  indicator: AccordionIndicator
}>({ variant: "default", indicator: "chevron" })

/**
 * The group.
 *
 *  - default: items stacked flush.
 *  - split, outline: an 8px gap (Figma `spacing/2`), each item its own card.
 *  - table: one 1px `border` box round the whole group, at Figma's
 *    `border radius/box` 10px — `rounded-lg`, the project's `--radius`, as
 *    Tabs uses for the same step.
 */
const accordionVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default: "",
      split: "gap-2",
      outline: "gap-2",
      table: "rounded-lg border border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * One item.
 *
 *  - default, table: a 1px `border` divider under every item but the last.
 *    Table insets the row 20px (Figma `spacing/5`) from its box.
 *  - split: a `card` surface with Figma's `shadow/md` — exactly Tailwind 3's
 *    `shadow-md` — and no stroke, 20px inset.
 *  - outline: a 1px `border` all round, 20px inset.
 *
 * Split and outline round each item to Figma's `rounded-field`, 8px:
 * `--radius-md`, which is 8px in both apps where no Tailwind class is.
 */
const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "border-b border-border last:border-b-0",
      // Forced colours drop both the fill and the shadow, so the card gets
      // an outline there instead; outline takes no room, so nothing moves.
      split: "rounded-[var(--radius-md)] bg-card px-5 shadow-md forced-colors:outline forced-colors:outline-1",
      outline: "rounded-[var(--radius-md)] border border-border px-5",
      table: "border-b border-border px-5 last:border-b-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

/**
 * The heading row. Geist (Cairo in Arabic) Medium 14px in `foreground`, a
 * 12px gap between whatever it holds, and the indicator pushed to the inline
 * end, which is the right in English and the left in Arabic. The type ramp
 * gives Arabic its own 24px line, so its rows are 4px taller with no class
 * here knowing about it.
 *
 * Rows are 12px above and below the title (Figma `spacing/3`); Outline's are
 * 16px (`spacing/4`).
 *
 * Hover underlines the title, never an avatar or icon beside it: a text
 * decoration set on the row would reach an avatar's initials, and nothing
 * below can take it off again, so the underline goes on each child that is
 * not the indicator, an avatar or an icon. Bare text is wrapped in a span for
 * it. Hovering the row sets `--accordion-title-decoration` and those
 * children read it, so the whole row underlines its title, wherever the
 * pointer is in it. (`[&:hover>…]` would do the same, but Storybook's
 * pseudo-states addon cannot force a `:hover` written inside a class name;
 * Tailwind 3's `hover:[&>…]` hovers the child, not the row.) The thickness,
 * position and ink-skipping follow the font, as Figma's underline does.
 *
 * Keyboard focus draws Figma's ring: 2px of `ring` at `--radius-sm` (6px,
 * Figma `rounded-md`). It is a pseudo-element, so it adds no size, inset 1px
 * from the row's top and bottom edges so it never meets the content or the
 * divider, and 6px past each side so it clears the title and the indicator.
 * The browser's own outline is removed outright: Tailwind 3's `outline-none`
 * leaves a transparent one that forced colours paint round every row, while
 * the ring's border shows there in the system colour on focus.
 */
const accordionTriggerVariants = cva(
  [
    "group/trigger relative flex w-full flex-1 cursor-pointer items-center gap-3 text-start text-sm font-medium text-foreground [outline:none] [overflow-wrap:anywhere]",
    "hover:[--accordion-title-decoration:underline]",
    "[&>:not([data-slot=accordion-indicator]):not([data-slot=avatar]):not(svg)]:[text-decoration-line:var(--accordion-title-decoration,none)]",
    "[&>*]:decoration-from-font [text-decoration-skip-ink:none] [text-underline-position:from-font]",
    "after:pointer-events-none after:absolute after:-inset-x-1.5 after:inset-y-px after:hidden after:rounded-[var(--radius-sm)] after:border-2 after:border-ring",
    "focus-visible:after:block",
    "[&>svg]:size-4 [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "py-3",
        split: "py-3",
        outline: "py-4",
        table: "py-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Open and close, at the motion presets' `base` duration (180ms) and
 * `standard` easing, since CSS cannot read the Framer Motion presets
 * themselves. Base UI writes the panel's measured height to
 * `--accordion-panel-height` and holds it at 0 on its starting and ending
 * styles; once open, the height returns to `auto`, so a nested accordion can
 * still grow its parent. Reduced motion opens and closes at once.
 *
 * The panel clips only vertically, which is all the animation needs.
 * `overflow: hidden` would also cut off anything reaching sideways out of
 * the content: a nested accordion's focus ring, 6px past its row, or a
 * nested group pulled out to the edges of a Split or Table item.
 */
const accordionContentVariants = cva([
  "h-[var(--accordion-panel-height)] overflow-x-visible overflow-y-clip text-sm text-muted-foreground",
  "transition-[height] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
  "data-[starting-style]:h-0 data-[ending-style]:h-0",
])

export interface AccordionProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, "className" | "orientation" | "loopFocus"> {
  /**
   * The look of every item in the group: `default` divides items with a
   * line, `split` sets each on its own card, `outline` gives each a border,
   * and `table` boxes the whole group. Declared here rather than inherited
   * from `VariantProps`, which widens it with `| null`.
   */
  variant?: AccordionVariant
  /** What shows open and closed at the end of each heading: a chevron, or plus and minus. */
  indicator?: AccordionIndicator
  className?: string
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, variant = "default", indicator = "chevron", ...props }, ref) => {
    const context = React.useMemo(() => ({ variant, indicator }), [variant, indicator])

    return (
      <AccordionContext.Provider value={context}>
        <AccordionPrimitive.Root
          ref={ref}
          data-slot="accordion"
          data-variant={variant}
          className={cn(accordionVariants({ variant }), className)}
          {...props}
        />
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

export interface AccordionItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, "className"> {
  className?: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => {
    const { variant } = React.useContext(AccordionContext)

    return (
      <AccordionPrimitive.Item
        ref={ref}
        data-slot="accordion-item"
        className={cn(accordionItemVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
AccordionItem.displayName = "AccordionItem"

/**
 * The open and closed mark, 16px of Figma's own Lucide glyphs at their 1px
 * stroke (1.5 on Lucide's 24px grid). The chevron points down and turns to
 * point up while open; it is symmetrical, so turning it needs no RTL case.
 * Plus swaps for Minus.
 */
function AccordionIndicatorIcon({ indicator }: { indicator: AccordionIndicator }) {
  return (
    <span
      aria-hidden="true"
      data-slot="accordion-indicator"
      className="ms-auto flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {indicator === "plus" ? (
        <>
          <PlusIcon strokeWidth={1.5} className="group-data-[panel-open]/trigger:hidden" />
          <MinusIcon strokeWidth={1.5} className="hidden group-data-[panel-open]/trigger:block" />
        </>
      ) : (
        <ChevronDownIcon
          strokeWidth={1.5}
          className="transition-transform duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] group-data-[panel-open]/trigger:rotate-180 motion-reduce:transition-none"
        />
      )}
    </span>
  )
}

/**
 * Bare text becomes a span, so the hover underline has an element to go on.
 * Neighbouring runs share one span: `Question {n}` is two strings to React,
 * and as two flex items they would sit a 12px gap apart.
 */
function wrapText(children: React.ReactNode) {
  const out: React.ReactNode[] = []
  let text: string[] = []
  const flush = () => {
    if (text.length === 0) return
    out.push(
      <span key={`title-${out.length}`} data-slot="accordion-title">
        {text.join("")}
      </span>
    )
    text = []
  }
  // toArray drops empty children and keys the rest.
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      text.push(String(child))
    } else {
      flush()
      out.push(child)
    }
  }
  flush()
  return out
}

export interface AccordionTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>, "className"> {
  className?: string
}

/**
 * The heading's button, inside Base UI's heading element, an `h3` as in
 * shadcn. Put a 16px icon or an Avatar before the title and the row spaces
 * it; the indicator is added for you.
 */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, indicator } = React.useContext(AccordionContext)

    return (
      <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          data-slot="accordion-trigger"
          className={cn(accordionTriggerVariants({ variant }), className)}
          {...props}
        >
          {wrapText(children)}
          <AccordionIndicatorIcon indicator={indicator} />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

export interface AccordionContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>, "className"> {
  /** Goes on the inner box, which holds the padding, so the panel can close to 0. */
  className?: string
}

/**
 * The revealed body: 14px `muted-foreground` text and 16px below it (Figma
 * `spacing/4`). The panel animates; the box inside it holds the padding and
 * takes `className`, so indenting the body under an avatar is a `ps-*` here.
 */
const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Panel
      ref={ref}
      data-slot="accordion-content"
      className={accordionContentVariants()}
      {...props}
    >
      <div className={cn("pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
)
AccordionContent.displayName = "AccordionContent"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
}
export type { AccordionVariant, AccordionIndicator }

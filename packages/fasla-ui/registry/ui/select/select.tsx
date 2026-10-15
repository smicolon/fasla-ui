"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"
import { badgeVariants } from "../badge/badge"

/*
 * Figma: "Select Input" (3884:6936, 192 variants), "Select Item"
 * (46162:1970), "Select Menu" (46162:242459) and the open preview
 * (46162:242460).
 *
 * Built on Base UI's Select and Field. Base UI owns the behaviour: the
 * combobox and listbox roles, opening on click and on the arrow keys,
 * highlighting by pointer and keyboard, type-ahead, Escape, returning focus
 * to the trigger, the hidden input that submits the value, and placing the
 * menu against the trigger. This file owns the look, the field parts shared
 * with Input, and the badges of a multiple select.
 *
 * Figma axis → code:
 *  - `Size` (xs / sm / md / lg) → `size`. Figma's default is xs; code's is md,
 *    as for every atom.
 *  - `Radius` (Standard / Rounded) → `radius`.
 *  - `State`:
 *     - Default → nothing.
 *     - Focus → real keyboard focus, and the whole time the menu is open (the
 *       open preview draws the trigger in Focus).
 *     - Disabled → `disabled`.
 *  - `Filled` → not a prop: it is the difference between the placeholder and
 *    a value.
 *  - `Multi Select` → `multiple`. `Show Badges` / `Show Text` →
 *    `display="badges"` (the default) or `display="text"`.
 *  - `Direction` → the page's `dir`. It is read from the trigger and handed to
 *    Base UI, so the menu, the chevron and the check all mirror.
 *  - The booleans → optional props, named as on Input: `- Label` → `label`,
 *    `- Top Right label` → `labelEnd`, `- Bottom Left / Right label` →
 *    `description` / `descriptionEnd`, `Prefix Icon` → `startIcon`.
 *
 * Select Item: `Hover` is Base UI's highlight — the pointer or the arrow keys
 * — and `Selected` is the check at the end of the row. The two are separate,
 * so a selected item that is not highlighted shows only the check.
 */

type SelectSize = "xs" | "sm" | "md" | "lg"
type SelectRadius = "standard" | "rounded"
type SelectDisplay = "badges" | "text"

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * Where the trigger sits: its direction, language and font. The menu is
 * portalled to `<body>`, out of the trigger's subtree, so it inherits none of
 * them; the positioner re-applies them so an Arabic page gets a right-to-left,
 * Cairo menu. Base UI only learns the direction from its DirectionProvider.
 */
type TriggerContext = {
  direction: "ltr" | "rtl"
  lang?: string
  fontFamily?: string
}

function readContext(node: HTMLElement): TriggerContext {
  const attribute = node.closest("[dir]")?.getAttribute("dir")?.toLowerCase()
  const style = getComputedStyle(node)
  const isRtl = attribute === "rtl" || (attribute !== "ltr" && style.direction === "rtl")
  return {
    direction: isRtl ? "rtl" : "ltr",
    lang: node.closest("[lang]")?.getAttribute("lang") || undefined,
    fontFamily: style.fontFamily || undefined,
  }
}

/**
 * The trigger: Figma's `input` frame. It is the field box itself — a button
 * that draws the border, fill and focus ring around the icon, the value and
 * the chevron.
 *
 * Everything a Select and an Input of the same size share is the same here,
 * so the two line up side by side in a form: a 1px `input` border, 12px
 * inline padding at every size, text in `foreground` — 16px below `md` and
 * Figma's 14px from `md` up, at every size, as Input sets its value — Figma's xs
 * shadow (Tailwind 3's `shadow-sm`), and the fill — `background`, and `input`
 * at 30% in Dark (Figma's `custom/background-input-30`).
 *
 * Focus is Input's: a `ring` border and a 3px `ring/50` halo in place of the
 * shadow. On keyboard focus (`focus-visible`), and while the menu is open
 * (`data-popup-open`), as Figma's open preview shows. A mouse press that
 * opens and closes the menu leaves no ring behind. Forced colours drop the halo, so there the same two states
 * draw a 2px `Highlight` outline instead. `[outline:none]`, not Tailwind 3's
 * `outline-none`: that is a transparent 2px outline, which forced colours
 * paint round the trigger all the time.
 *
 * Size sets the height and the icon↔text gap, as on Input: 28 / 32 / 36 /
 * 40px tall, with 2 / 4 / 6 / 8px gaps. The height is a minimum: one line of text or badges centres in it, and badges
 * that wrap onto a second row grow the box. Figma's block padding is left out,
 * as on Input: it draws nothing at a fixed height, and Cairo's taller line
 * would push an Arabic value out of an xs box.
 */
const selectTriggerVariants = cva(
  [
    "flex w-full min-w-0 items-center border border-input bg-background px-3 text-start text-base text-foreground shadow-sm [outline:none] dark:bg-input/30 md:text-sm",
    "transition-[color,border-color,box-shadow] motion-reduce:transition-none",
    "focus-visible:border-ring focus-visible:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "data-[popup-open]:border-ring data-[popup-open]:shadow-none data-[popup-open]:ring-[3px] data-[popup-open]:ring-ring/50",
    "forced-colors:focus-visible:[outline:2px_solid_Highlight] forced-colors:data-[popup-open]:[outline:2px_solid_Highlight] forced-colors:[outline-offset:2px]",
    "data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        xs: "min-h-7 gap-0.5",
        sm: "min-h-8 gap-1",
        md: "min-h-9 gap-1.5",
        lg: "min-h-10 gap-2",
      },
      // Figma `border radius/md` (8px), read through the preset's
      // `--radius-md`, as Input does; Rounded is `border radius/rounded`.
      radius: {
        standard: "rounded-[var(--radius-md)]",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "standard",
    },
  }
)

/**
 * An icon slot: the prefix icon and the chevron. `foreground` at 16px at
 * every size, as on Input. The chevron is lucide's at Figma's 1.5 stroke.
 */
const ICON = "flex shrink-0 items-center text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

/**
 * The badges of a multiple select wrap onto more rows when they run out of
 * room. This block padding keeps a wrapped row off the border and is sized so
 * one row of Arabic badges (24px: Cairo leads `text-xs` to 20px) still fits
 * the box's height: (height − 2px of border − 24) ÷ 2.
 */
const BADGE_ROW_PADDING: Record<SelectSize, string> = {
  xs: "py-px",
  sm: "py-[3px]",
  md: "py-[5px]",
  lg: "py-[7px]",
}

/**
 * The label row and the helper row, exactly as on Input, so a Select and an
 * Input line up side by side in a form: 4px padding all round, an 8px gap,
 * the two labels at either end. The label row aligns to the baseline, the
 * helper row to the top.
 */
const ROW = "flex justify-between gap-2 p-1"
const LABEL_ROW = cn(ROW, "items-baseline")
const HELPER_ROW = cn(ROW, "items-start")
/** Figma's Top Right and Bottom labels: XS Regular in `muted-foreground`, at full strength as on Input. */
const HELPER = "text-xs text-muted-foreground"

/**
 * The menu: Figma's Select Menu. The trigger's width (`--anchor-width`, from
 * Base UI), 4px below it, `popover` with a 1px `input` border, 4px padding,
 * Figma's `border radius/md` and `shadow/md` — Tailwind 3's `shadow-md`. It
 * scrolls when the list is taller than the room left in the window.
 *
 * Fades in and out over 150ms on Base UI's starting and ending styles; with
 * reduced motion it appears and disappears at once.
 */
const POPUP = cn(
  "w-[var(--anchor-width)] max-h-[var(--available-height)] overflow-y-auto overscroll-contain",
  "rounded-[var(--radius-md)] border border-input bg-popover p-1 text-popover-foreground shadow-md [outline:none]",
  "transition-opacity duration-150 motion-reduce:transition-none",
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
)

/**
 * One option: Figma's Select Item. 32px tall, 8px inline padding, an 8px gap
 * and Figma's `border radius/sm` (6px, `--radius-sm`, as Badge reads it).
 * `text-sm` in `popover-foreground`.
 *
 * The height is a 32px minimum with 4px block padding, as in Figma: a
 * one-line row is 32px in both scripts (Cairo's 24px line fills it exactly),
 * and long text wraps inside the menu instead of overflowing it.
 *
 *  - Highlighted (Figma `Hover`: the pointer or the arrow keys) → `accent`
 *    with `accent-foreground` text.
 *  - Selected → the check, at the end of the row. Its 16px slot is always
 *    there, so the text never moves when an item is chosen.
 *  - Disabled → half opacity, and no pointer events.
 *
 * Forced colours drop the `accent` fill, so there the highlighted row draws a
 * 2px `Highlight` outline inside its edge instead.
 */
const ITEM = cn(
  "relative flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1 text-start text-sm text-popover-foreground [outline:none]",
  "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
  "forced-colors:data-[highlighted]:[outline:2px_solid_Highlight] forced-colors:data-[highlighted]:[outline-offset:-2px]",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
)

export interface SelectOption {
  value: string
  /** What the menu, the trigger and the badges show. */
  label: string
  disabled?: boolean
}

type SelectFieldProps = {
  /** Field height: 28, 32, 36 or 40px. */
  size?: SelectSize
  /** Corner shape: Figma's 8px `border radius/md`, or a full pill. */
  radius?: SelectRadius
  /** The field's label, above it. Without it, pass `aria-label`. */
  label?: React.ReactNode
  /** A short note at the end of the label row — "Optional". Read out with the description. */
  labelEnd?: React.ReactNode
  /** Helper text at the start of the row under the field. */
  description?: React.ReactNode
  /** Helper text at the end of the row under the field. */
  descriptionEnd?: React.ReactNode
  /** An icon before the value, usually a lucide icon. Sized with the field. */
  startIcon?: React.ReactNode
  /** Shown in the trigger while nothing is chosen. */
  placeholder?: React.ReactNode
  /**
   * The options, as data. Pass these, or `SelectItem` children for full
   * control of each row; with both, the children are rendered and the items
   * supply the labels.
   */
  items?: readonly SelectOption[]
  children?: React.ReactNode
  /** Makes the field unusable and dims it to half opacity. */
  disabled?: boolean
  /** Shows the value but stops it changing. */
  readOnly?: boolean
  /** The field must have a value before its form submits. */
  required?: boolean
  /** The name the value is submitted under. */
  name?: string
  /** The id of a form this field belongs to, when it sits outside it. */
  form?: string
  /** The trigger's id, for a `<label htmlFor>` of your own. */
  id?: string
  /** Controls whether the menu is open. */
  open?: boolean
  /** Whether the menu starts open. */
  defaultOpen?: boolean
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /**
   * While the menu is open, block the rest of the page: no page scroll and
   * no presses outside. Base UI's default. Pass `false` to keep the page live.
   */
  modal?: boolean
  /**
   * How the menu avoids the window edge. By default it flips above the
   * trigger when there is no room below. Pass `{ side: "none" }` to keep it
   * below.
   */
  collisionAvoidance?: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Positioner>["collisionAvoidance"]
  /** Where the menu renders. Default `<body>`. */
  container?: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Portal>["container"]
  "aria-label"?: string
  "aria-labelledby"?: string
  /** Classes for the whole field group. The `ref` goes to the trigger. */
  className?: string
}

type SingleProps = {
  /** Lets the user choose more than one option. */
  multiple?: false
  /** The chosen value, when controlled. `null` shows the placeholder. */
  value?: string | null
  /** The value chosen on first render. */
  defaultValue?: string | null
  /** Called with the new value. */
  onValueChange?: (value: string | null) => void
  display?: never
}

type MultipleProps = {
  multiple: true
  /** The chosen values, when controlled. */
  value?: readonly string[]
  /** The values chosen on first render. */
  defaultValue?: readonly string[]
  /** Called with the new values — after a choice in the menu, or a badge's remove. */
  onValueChange?: (value: string[]) => void
  /** How the trigger shows the chosen values: as badges (the default) or as one line of text. */
  display?: SelectDisplay
}

export type SelectProps = SelectFieldProps & (SingleProps | MultipleProps)

/** The plain text of an item's children, for the trigger and type-ahead. */
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

/** Every `SelectItem` among the children, however deeply wrapped, as options. */
function optionsOf(children: React.ReactNode, out: SelectOption[] = []): SelectOption[] {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<SelectItemProps>(child)) return
    if (child.type === SelectItem) {
      out.push({
        value: child.props.value,
        label: child.props.label ?? textOf(child.props.children),
        disabled: child.props.disabled,
      })
    } else {
      optionsOf(child.props.children, out)
    }
  })
  return out
}

/** The list separator for a selection shown as text: the Arabic comma on an Arabic page. */
const separatorFor = (context: TriggerContext) =>
  context.lang?.toLowerCase().startsWith("ar") || (!context.lang && context.direction === "rtl") ? "، " : ", "

/**
 * A select field with an optional label, helper labels and prefix icon, from
 * Figma's Select Input, Select Menu and Select Item.
 */
const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      size = "md",
      radius = "standard",
      multiple = false,
      display = "badges",
      label,
      labelEnd,
      description,
      descriptionEnd,
      startIcon,
      placeholder,
      items,
      children,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      form,
      id,
      open,
      defaultOpen,
      onOpenChange,
      modal = true,
      collisionAvoidance,
      container,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...valueProps
    },
    ref
  ) => {
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const mergedRef = React.useMemo(() => mergeRefs(ref, triggerRef), [ref])

    const [context, setContext] = React.useState<TriggerContext>({ direction: "ltr" })
    const read = React.useCallback((node: HTMLElement | null) => {
      if (!node) return
      const next = readContext(node)
      setContext((prev) =>
        prev.direction === next.direction && prev.lang === next.lang && prev.fontFamily === next.fontFamily
          ? prev
          : next
      )
    }, [])
    useIsomorphicLayoutEffect(() => read(triggerRef.current), [read])

    // The value is held here, controlled or not, so a badge's remove can change
    // it. Base UI always sees a controlled select.
    const empty = multiple ? [] : null
    const [uncontrolled, setUncontrolled] = React.useState<string | readonly string[] | null>(
      valueProps.defaultValue ?? empty
    )
    const isControlled = valueProps.value !== undefined
    const value = isControlled ? valueProps.value ?? empty : uncontrolled
    const setValue = (next: string | string[] | null) => {
      if (!isControlled) setUncontrolled(next)
      ;(valueProps.onValueChange as ((value: string | string[] | null) => void) | undefined)?.(next)
    }

    const options = React.useMemo(() => {
      const fromChildren = optionsOf(children)
      if (!items) return fromChildren
      const known = new Set(items.map((item) => item.value))
      return [...items, ...fromChildren.filter((item) => !known.has(item.value))]
    }, [items, children])
    const labels = React.useMemo(() => new Map(options.map((option) => [option.value, option.label])), [options])
    const labelFor = React.useCallback((v: string) => labels.get(v) ?? v, [labels])

    const chosen: string[] = multiple ? [...((value as readonly string[] | null) ?? [])] : []
    const hasValue = multiple ? chosen.length > 0 : value != null
    const locked = disabled || readOnly

    const remove = (v: string) => setValue(chosen.filter((x) => x !== v))
    const stop = (event: React.SyntheticEvent) => {
      event.stopPropagation()
      event.preventDefault()
    }

    const placeholderNode = <span data-slot="select-placeholder" className="truncate text-muted-foreground">{placeholder}</span>

    return (
      <FieldPrimitive.Root
        data-slot="select-field"
        disabled={disabled}
        className={cn("group/select flex w-full min-w-0 flex-col data-[disabled]:opacity-50", className)}
      >
        <DirectionProvider direction={context.direction}>
          <SelectPrimitive.Root
            id={id}
            name={name}
            form={form}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            open={open}
            defaultOpen={defaultOpen}
            modal={modal}
            onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
            items={options}
            multiple={multiple}
            value={value as never}
            onValueChange={(next) => setValue(next as string | string[] | null)}
          >
            {(label || labelEnd) && (
              <div data-slot="select-label-row" className={LABEL_ROW}>
                {label && (
                  // Not a native <label>: on a button, one would press it and
                  // open the menu. A press moves focus to the trigger instead.
                  <FieldPrimitive.Label
                    data-slot="select-label"
                    nativeLabel={false}
                    render={<div />}
                    onClick={() => triggerRef.current?.focus()}
                    className="min-w-0 text-sm font-medium text-foreground"
                  >
                    {label}
                  </FieldPrimitive.Label>
                )}
                {labelEnd && (
                  <FieldPrimitive.Description
                    data-slot="select-label-end"
                    className={cn("ms-auto max-w-[50%] shrink-0 text-end", HELPER)}
                  >
                    {labelEnd}
                  </FieldPrimitive.Description>
                )}
              </div>
            )}

            <SelectPrimitive.Trigger
              ref={mergedRef}
              data-slot="select-trigger"
              // Only when passed: an explicit `undefined` would replace the
              // `aria-labelledby` Base UI points at the label.
              {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
              {...(ariaLabelledBy !== undefined && { "aria-labelledby": ariaLabelledBy })}
              className={selectTriggerVariants({ size, radius })}
              onPointerDown={(event) => read(event.currentTarget)}
              onFocus={(event) => read(event.currentTarget)}
            >
              {startIcon && (
                <span data-slot="select-start-icon" aria-hidden="true" className={ICON}>
                  {startIcon}
                </span>
              )}
              {/* One line of text overhangs the box's block edges by 4px a
                  side, so its line never sets the height: under 768px an
                  Arabic value is 16px on Cairo's 28px line, taller than an
                  xs box's 26px inside its border. Input's own input clips it
                  the same way. Badges wrap and grow the box instead. */}
              <SelectPrimitive.Value
                data-slot="select-value"
                className={cn(
                  "min-w-0 flex-1",
                  multiple && display === "badges" && hasValue
                    ? cn("flex flex-wrap gap-1", BADGE_ROW_PADDING[size])
                    : "-my-1 truncate"
                )}
              >
                {() => {
                  if (!hasValue) return placeholderNode
                  if (!multiple) return labelFor(value as string)
                  if (display === "text") return chosen.map(labelFor).join(separatorFor(context))
                  return chosen.map((v) => (
                    // Figma's Badge: Soft, Primary, sm, Standard. Drawn here
                    // rather than as a Badge with `onClose`: that is a button,
                    // and a button cannot sit inside the trigger's. The remove
                    // is for the pointer; from the keyboard, unchoose the item
                    // in the menu.
                    <span
                      key={v}
                      data-slot="select-badge"
                      className={cn(
                        badgeVariants({ variant: "soft", tone: "primary", size: "sm", radius: "standard" }),
                        "max-w-full"
                      )}
                    >
                      <span className="truncate">{labelFor(v)}</span>
                      {!locked && (
                        <span
                          data-slot="select-badge-remove"
                          aria-hidden="true"
                          onPointerDown={stop}
                          onMouseDown={stop}
                          onClick={(event) => {
                            stop(event)
                            remove(v)
                          }}
                          // `after:` widens the hit area to 24×24px (WCAG 2.5.8)
                          // without moving the 12px glyph, as on Badge.
                          className="relative inline-flex size-3 shrink-0 cursor-pointer items-center justify-center after:absolute after:-inset-1.5 after:content-['']"
                        >
                          <XIcon size={12} strokeWidth={1.5} />
                        </span>
                      )}
                    </span>
                  ))
                }}
              </SelectPrimitive.Value>
              {/* The chevron points down in both directions; only its side swaps. */}
              <SelectPrimitive.Icon data-slot="select-chevron" className={ICON}>
                <ChevronDownIcon strokeWidth={1.5} />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            {(description || descriptionEnd) && (
              <div data-slot="select-helper-row" className={HELPER_ROW}>
                {description && (
                  <FieldPrimitive.Description data-slot="select-description" className={cn("min-w-0", HELPER)}>
                    {description}
                  </FieldPrimitive.Description>
                )}
                {descriptionEnd && (
                  <FieldPrimitive.Description
                    data-slot="select-description-end"
                    className={cn("ms-auto max-w-[50%] shrink-0 text-end", HELPER)}
                  >
                    {descriptionEnd}
                  </FieldPrimitive.Description>
                )}
              </div>
            )}

            <SelectPrimitive.Portal container={container}>
              <SelectPrimitive.Positioner
                data-slot="select-positioner"
                side="bottom"
                align="start"
                sideOffset={4}
                // Figma opens the menu under the trigger, never over it.
                alignItemWithTrigger={false}
                collisionAvoidance={collisionAvoidance}
                dir={context.direction}
                lang={context.lang}
                style={{ fontFamily: context.fontFamily }}
                className="z-50 [outline:none]"
              >
                <SelectPrimitive.Popup data-slot="select-content" className={POPUP}>
                  <SelectPrimitive.List data-slot="select-list">
                    {children ??
                      items?.map((item) => (
                        <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                          {item.label}
                        </SelectItem>
                      ))}
                  </SelectPrimitive.List>
                </SelectPrimitive.Popup>
              </SelectPrimitive.Positioner>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>
        </DirectionProvider>
      </FieldPrimitive.Root>
    )
  }
)
Select.displayName = "Select"

export interface SelectItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, "value" | "className" | "label"> {
  /** The value this option submits. */
  value: string
  /**
   * The text the trigger, the badges and type-ahead use. Defaults to the
   * children's text; pass it when the children are more than text.
   */
  label?: string
  className?: string
}

/** One option in the menu. The check at its end shows it is chosen. */
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, label, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      label={label}
      className={cn(ITEM, className)}
      {...props}
    >
      <SelectPrimitive.ItemText data-slot="select-item-text" className="min-w-0 flex-1 [overflow-wrap:anywhere]">
        {children}
      </SelectPrimitive.ItemText>
      {/* Figma's check is a 24px glyph at a 1.5 stroke, cropped to a 16px
          slot — larger than a 16px icon would draw it. */}
      <span data-slot="select-item-indicator" className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
        <SelectPrimitive.ItemIndicator className="flex">
          <CheckIcon aria-hidden="true" className="size-6 shrink-0" strokeWidth={1.5} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
)
SelectItem.displayName = "SelectItem"

export { Select, SelectItem, selectTriggerVariants }
export type { SelectSize, SelectRadius, SelectDisplay }

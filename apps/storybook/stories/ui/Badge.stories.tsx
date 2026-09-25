import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Badge, type BadgeProps } from "../../../../packages/fasla-ui/registry/ui/badge"

/** The consumer's icons — 24-grid SVGs with no size or colour of their own. */
const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
)

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

/**
 * A placeholder portrait — deliberately not the library's Avatar, which is being
 * rebuilt. Inline rather than an image file so it takes theme tokens and follows
 * the mode. The badge owns the 12px size and the circular clip; an empty `alt`
 * marks it decorative, for when the label already names the person.
 */
const avatar = (alt: string) => (
  <svg
    viewBox="0 0 48 48"
    className="size-full"
    {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
  >
    <rect width="48" height="48" className="fill-muted" />
    <circle cx="24" cy="19" r="9" className="fill-muted-foreground" />
    <path d="M6 48c1.5-10 9-16 18-16s16.5 6 18 16Z" className="fill-muted-foreground" />
  </svg>
)

/**
 * `closable` is a story-only arg, not a Badge prop: the component shows its close
 * button when it is given `onClose`, and a boolean is the only way to toggle that
 * from the Controls panel. `onClose` itself is a spy in `args`, so every press
 * shows up in the Actions panel.
 */
type BadgeStoryArgs = BadgeProps & { closable?: boolean }

const meta: Meta<BadgeStoryArgs> = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    variant: "solid",
    tone: "primary",
    size: "sm",
    radius: "rounded",
    icon: "none" as unknown as React.ReactNode,
    avatar: "none" as unknown as React.ReactNode,
    closable: false,
    onClose: fn(),
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "soft", "outline"] },
    tone: {
      control: "select",
      options: ["primary", "secondary", "info", "success", "warning", "destructive"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["rounded", "standard"] },
    children: {
      name: "label",
      control: "text",
      description:
        "Label text. Leave empty for the sample label in the current direction; type long English or Arabic text to test wrapping-free growth.",
      table: { type: { summary: "ReactNode" } },
    },
    // Controls can't author a ReactNode, so each slot offers named choices and
    // `mapping` turns the choice into a real element.
    icon: {
      control: { type: "select", labels: { none: "None", star: "Star", heart: "Heart" } },
      options: ["none", "star", "heart"],
      mapping: { none: undefined, star: <StarIcon />, heart: <HeartIcon /> },
      table: { type: { summary: "ReactNode" } },
    },
    avatar: {
      control: { type: "select", labels: { none: "None", sample: "Sample image" } },
      options: ["none", "sample"],
      mapping: { none: undefined, sample: avatar("") },
      table: { type: { summary: "ReactNode" } },
    },
    closable: {
      control: "boolean",
      description:
        "Story-only. Passes `onClose`, which renders the close button; presses are logged in the Actions panel.",
    },
    onClose: { control: false },
    closeLabel: {
      control: "text",
      description:
        "Not visible. The close button's accessible name, read by screen readers. Defaults to \"Remove {label}\", or \"إزالة {label}\" when the page's `lang` is Arabic.",
      if: { arg: "closable" },
    },
  },
}

export default meta
type Story = StoryObj<BadgeStoryArgs>

/**
 * Sample copy, per script. Prop and axis names stay English — they are code and
 * Figma identifiers — and only the rendered label switches with the Direction
 * toolbar. `badge` is Figma's own RTL sample text.
 */
const COPY = {
  ltr: {
    badge: "Badge",
    tones: ["Primary", "Secondary", "Info", "Success", "Warning", "Destructive"],
    sizes: ["Small", "Medium", "Large"],
    featured: "Featured",
    filter: "Design",
    author: "Layla",
    reset: "Reset",
    filters: ["Cairo", "In stock", "Free shipping", "On sale"],
    removeFilter: (name: string) => `Remove filter: ${name}`,
  },
  rtl: {
    badge: "شارة",
    tones: ["أساسي", "ثانوي", "معلومة", "نجاح", "تحذير", "خطر"],
    sizes: ["صغير", "متوسط", "كبير"],
    featured: "مميز",
    filter: "تصميم",
    author: "ليلى",
    reset: "إعادة الضبط",
    filters: ["القاهرة", "متوفر", "شحن مجاني", "تخفيضات"],
    removeFilter: (name: string) => `إزالة فلتر: ${name}`,
  },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const VARIANTS = ["solid", "soft", "outline"] as const
const TONES = ["primary", "secondary", "info", "success", "warning", "destructive"] as const
const SIZES = ["sm", "md", "lg"] as const

export const Default: Story = {
  render: ({ closable, onClose, children, ...args }, ctx) => (
    <Badge {...args} onClose={closable ? onClose : undefined}>
      {children || copy(ctx).badge}
    </Badge>
  ),
}

/** Figma's Type × Tone: three visual weights, six semantic tones. */
export const Types: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[4.5rem_repeat(6,max-content)] items-center gap-x-3 gap-y-3">
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span dir="ltr" className="text-xs text-muted-foreground">
              {variant}
            </span>
            {TONES.map((tone, i) => (
              <Badge key={tone} variant={variant} tone={tone}>
                {c.tones[i]}
              </Badge>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * sm / md / lg. In Arabic the heights are 24 / 24 / 28px rather than LTR's
 * 20 / 22 / 26px: Cairo's 20px line is allowed to grow the badge, where Figma
 * pins md and lg to their English heights.
 */
export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex items-center gap-3">
        {SIZES.map((size, i) => (
          <Badge key={size} size={size} icon={<StarIcon />} onClose={() => {}}>
            {c.sizes[i]}
          </Badge>
        ))}
      </div>
    )
  },
}

/** `rounded` is a pill; `standard` is Figma's `border radius/sm`. */
export const Radius: Story = {
  render: (_args, ctx) => (
    <div className="flex items-center gap-3">
      <Badge radius="rounded">{copy(ctx).badge}</Badge>
      <Badge radius="standard">{copy(ctx).badge}</Badge>
      <Badge variant="soft" radius="standard">
        {copy(ctx).badge}
      </Badge>
      <Badge variant="outline" radius="standard">
        {copy(ctx).badge}
      </Badge>
    </div>
  ),
}

/** Icon, avatar and close are independent — any combination, as in Figma. */
export const Slots: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col items-start gap-3">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex items-center gap-3">
            <Badge variant={variant} icon={<StarIcon />}>
              {c.featured}
            </Badge>
            {/* The label already names the person, so the picture is decorative. */}
            <Badge variant={variant} avatar={avatar("")}>
              {c.author}
            </Badge>
            <Badge variant={variant} onClose={() => {}}>
              {c.filter}
            </Badge>
            <Badge
              variant={variant}
              icon={<StarIcon />}
              avatar={avatar(c.author)}
              onClose={() => {}}
            >
              {c.badge}
            </Badge>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Active filters, each removable. One tone throughout, because this story is
 * about the close button, not colour. Each close button gets its own
 * `closeLabel`, "Remove filter: Cairo", because the default "Remove Cairo" names
 * the item but not what kind of thing removing it changes.
 */
export const Removable: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    // Removed filters are tracked by position, not by text, so flipping the
    // Direction toolbar swaps the language without resetting the story.
    const [removed, setRemoved] = React.useState<number[]>([])
    const remaining = c.filters.map((_, i) => i).filter((i) => !removed.includes(i))
    return (
      <div className="flex flex-wrap items-center gap-2">
        {remaining.map((i) => (
          <Badge
            key={i}
            variant="soft"
            closeLabel={c.removeFilter(c.filters[i]!)}
            onClose={() => setRemoved((all) => [...all, i])}
          >
            {c.filters[i]}
          </Badge>
        ))}
        {remaining.length === 0 && (
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => setRemoved([])}
          >
            {c.reset}
          </button>
        )}
      </div>
    )
  },
}

const cellId = (v: string, t: string) => `focus-${v}-${t}`

/**
 * Figma's `Stats = Focus`, for every Type × Tone, rendered statically by
 * `storybook-addon-pseudo-states`. The target is the close `<button>`, the one
 * focusable thing in a badge; the ring is its `peer` sibling, so the addon's
 * `:focus-visible` drives the real rule rather than an imitation of it.
 *
 * Primary and Secondary ring on `ring` at 50%; the status tones ring in their
 * own colour at 20%. Both are Figma's values.
 */
export const FocusStates: Story = {
  parameters: {
    pseudo: {
      focusVisible: VARIANTS.flatMap((v) => TONES.map((t) => `#${cellId(v, t)} button`)),
    },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[4.5rem_repeat(6,max-content)] items-center gap-x-4 gap-y-4">
        {VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <span dir="ltr" className="text-xs text-muted-foreground">
              {variant}
            </span>
            {TONES.map((tone, i) => (
              <span key={tone} id={cellId(variant, tone)} className="inline-flex">
                <Badge variant={variant} tone={tone} onClose={() => {}}>
                  {c.tones[i]}
                </Badge>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

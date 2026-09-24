import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "../../../../packages/fasla-ui/registry/ui/badge"

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "soft", "outline"] },
    tone: {
      control: "select",
      options: ["primary", "secondary", "info", "success", "warning", "destructive"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["rounded", "standard"] },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

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
    author: "Yasmin",
    reset: "Reset",
  },
  rtl: {
    badge: "شارة",
    tones: ["أساسي", "ثانوي", "معلومة", "نجاح", "تحذير", "خطر"],
    sizes: ["صغير", "متوسط", "كبير"],
    featured: "مميز",
    filter: "تصميم",
    author: "ياسمين",
    reset: "إعادة الضبط",
  },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const VARIANTS = ["solid", "soft", "outline"] as const
const TONES = ["primary", "secondary", "info", "success", "warning", "destructive"] as const
const SIZES = ["sm", "md", "lg"] as const

/** The consumer's icon — any 24-grid SVG with no size or colour of its own. */
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

/**
 * A plain circular `<img>` — deliberately not the library's Avatar, which is
 * being rebuilt. The badge owns the 12px size and the clip.
 */
const avatar = (alt: string) => <img src="/samples/avatar.svg" alt={alt} />

export const Default: Story = {
  render: (args, ctx) => <Badge {...args}>{copy(ctx).badge}</Badge>,
}

/** Figma's Type × Tone: three visual weights, six semantic tones. */
export const Types: Story = {
  parameters: { layout: "padded" },
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

/** A removable filter: the close button is real and calls `onClose`. */
export const Removable: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [items, setItems] = React.useState<string[]>([...c.tones.slice(0, 4)])
    return (
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <Badge
            key={item}
            variant="soft"
            onClose={() => setItems((all) => all.filter((x) => x !== item))}
          >
            {item}
          </Badge>
        ))}
        {items.length === 0 && (
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => setItems([...c.tones.slice(0, 4)])}
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
    layout: "padded",
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

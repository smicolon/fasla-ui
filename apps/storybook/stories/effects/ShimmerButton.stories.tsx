import type { Meta, StoryObj } from "@storybook/react"
import { ArrowUpIcon } from "lucide-react"
import { ShimmerButton } from "../../../../packages/fasla-ui/registry/effects/shimmer-button"

const meta: Meta<typeof ShimmerButton> = {
  title: "Effects/ShimmerButton",
  component: ShimmerButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    shimmerColor: {
      control: "color",
    },
    background: {
      control: "color",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. The sheen sweeps in the reading direction, so switch the
 * toolbar to RTL to see it run right to left.
 */
const COPY = {
  ltr: {
    label: "Shop the collection",
    colours: ["Shop the collection", "Join the waitlist", "Browse new arrivals"],
    icon: "Start shopping",
    disabled: "Sold out",
    speeds: ["Fast: 1 second", "Default: 2 seconds", "Slow: 4 seconds"],
    widths: ["Narrow sheen: 20%", "Half width: 50%", "Default: 100%"],
    sizes: ["Small", "Default", "Large"],
  },
  rtl: {
    label: "تسوّق التشكيلة",
    colours: ["تسوّق التشكيلة", "انضم إلى قائمة الانتظار", "تصفّح الوافد الجديد"],
    icon: "ابدأ التسوّق",
    disabled: "نفدت الكمية",
    speeds: ["سريع: ثانية واحدة", "افتراضي: ثانيتان", "بطيء: 4 ثوانٍ"],
    widths: ["بريق ضيّق: 20%", "نصف العرض: 50%", "افتراضي: 100%"],
    sizes: ["صغير", "افتراضي", "كبير"],
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const SHEEN = "color-mix(in oklch, var(--primary-foreground) 35%, transparent)"
const GRADIENTS = [
  "linear-gradient(135deg, var(--chart-2), var(--chart-3))",
  "linear-gradient(135deg, var(--chart-1), var(--chart-5))",
  "linear-gradient(135deg, var(--chart-4), var(--chart-1))",
]

export const Default: Story = {
  render: (args, ctx) => <ShimmerButton {...args}>{copy(ctx).label}</ShimmerButton>,
}

export const CustomColors: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4">
      {GRADIENTS.map((background, i) => (
        <ShimmerButton key={background} background={background} shimmerColor={SHEEN}>
          {copy(ctx).colours[i]}
        </ShimmerButton>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args, ctx) => (
    <ShimmerButton {...args}>
      {/* A bag, not an arrow: it needs no mirroring in RTL */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {copy(ctx).icon}
    </ShimmerButton>
  ),
}

export const Disabled: Story = {
  render: (args, ctx) => (
    <ShimmerButton {...args} disabled>
      {copy(ctx).disabled}
    </ShimmerButton>
  ),
}

export const CustomDuration: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4">
      {(["1s", "2s", "4s"] as const).map((duration, i) => (
        <ShimmerButton key={duration} shimmerDuration={duration}>
          {copy(ctx).speeds[i]}
        </ShimmerButton>
      ))}
    </div>
  ),
}

/** `shimmerSize` sets the width of the sheen; the default is the full button. */
export const ShimmerSize: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-4">
      {(["20%", "50%", "100%"] as const).map((size, i) => (
        <ShimmerButton key={size} shimmerSize={size}>
          {copy(ctx).widths[i]}
        </ShimmerButton>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (_args, ctx) => {
    const [small, normal, large] = copy(ctx).sizes
    return (
      <div className="flex items-center gap-4">
        <ShimmerButton className="h-8 px-4 text-xs">{small}</ShimmerButton>
        <ShimmerButton>{normal}</ShimmerButton>
        <ShimmerButton className="h-12 px-8 text-base">{large}</ShimmerButton>
      </div>
    )
  },
}

import type { Meta, StoryObj } from "@storybook/react"
import {
  AnimatedGradient,
  AnimatedGradientText,
} from "../../../../packages/fasla-ui/registry/effects/animated-gradient"

const meta: Meta<typeof AnimatedGradient> = {
  title: "Effects/AnimatedGradient",
  component: AnimatedGradient,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    blur: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    speed: {
      control: { type: "range", min: 2, max: 20, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. Colours are theme variables, so every story follows light
 * and dark mode.
 */
const COPY = {
  ltr: {
    title: "The autumn edit is here",
    body: "New pieces in linen, wool and leather, in store now.",
    gradientText: "The autumn edit",
    customColours: "New season colours",
    slow: "A slower gradient",
    welcome: "Welcome to My store",
    heroBody: "Free delivery on every order in Riyadh this week.",
  },
  rtl: {
    title: "تشكيلة الخريف وصلت",
    body: "قطع جديدة من الكتان والصوف والجلد، في المتجر الآن.",
    gradientText: "تشكيلة الخريف",
    customColours: "ألوان الموسم الجديد",
    slow: "تدرّج أبطأ",
    welcome: "مرحبًا بك في متجري",
    heroBody: "توصيل مجاني لكل الطلبات داخل الرياض هذا الأسبوع.",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const WARM = ["var(--chart-1)", "var(--chart-5)", "var(--chart-4)", "var(--chart-1)"]
const COOL = ["var(--chart-2)", "var(--chart-3)", "var(--chart-2)", "var(--chart-3)"]

// The default speed, 10 seconds a cycle, is calm by design; the stories use 3 so
// the motion is easy to see at a glance.
export const Default: Story = {
  args: {
    className: "h-64 w-96 rounded-xl",
    speed: 3,
  },
}

export const WithContent: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <AnimatedGradient speed={3} {...args} className="flex h-64 w-96 items-center justify-center rounded-xl border">
        <div className="space-y-2 px-6 text-center">
          <h2 className="text-2xl font-bold">{c.title}</h2>
          <p className="text-muted-foreground">{c.body}</p>
        </div>
      </AnimatedGradient>
    )
  },
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AnimatedGradient speed={3} className="h-32 w-64 rounded-xl" colors={WARM} />
      <AnimatedGradient speed={3} className="h-32 w-64 rounded-xl" colors={COOL} />
    </div>
  ),
}

export const BlurVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {(["sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((blur) => (
        <AnimatedGradient
          key={blur}
          blur={blur}
          speed={3}
          colors={WARM}
          className="flex h-24 w-32 items-center justify-center rounded-lg border"
        >
          <code className="text-sm font-medium">{blur}</code>
        </AnimatedGradient>
      ))}
    </div>
  ),
}

export const GradientText: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-4">
        <AnimatedGradientText className="text-4xl font-bold">{c.gradientText}</AnimatedGradientText>
        <br />
        <AnimatedGradientText className="text-2xl font-semibold" colors={["var(--chart-1)", "var(--chart-5)", "var(--chart-1)"]}>
          {c.customColours}
        </AnimatedGradientText>
        <br />
        <AnimatedGradientText className="text-xl" speed={6} colors={["var(--chart-2)", "var(--chart-3)", "var(--chart-2)"]}>
          {c.slow}
        </AnimatedGradientText>
      </div>
    )
  },
}

export const Hero: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <AnimatedGradient speed={3} colors={WARM} className="flex h-80 w-full max-w-2xl items-center justify-center rounded-2xl border p-8">
        <div className="text-center">
          <AnimatedGradientText className="text-5xl font-bold" colors={["var(--primary)", "var(--chart-1)", "var(--primary)"]}>
            {c.welcome}
          </AnimatedGradientText>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">{c.heroBody}</p>
        </div>
      </AnimatedGradient>
    )
  },
}

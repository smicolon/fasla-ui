import type { Meta, StoryObj } from "@storybook/react"
import {
  BorderBeam,
  GlowingBorder,
} from "../../../../packages/fasla-ui/registry/effects/border-beam"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof BorderBeam> = {
  title: "Effects/BorderBeam",
  component: BorderBeam,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    duration: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
    },
    borderWidth: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    },
    colorFrom: {
      control: "color",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. The card's button is the library's own.
 */
const COPY = {
  ltr: {
    title: "Autumn sale ends tonight",
    body: "Up to 30% off linen and wool.",
    colours: ["Linen", "Wool", "Leather"],
    speeds: ["Fast: 2 seconds", "Default: 4 seconds", "Slow: 8 seconds"],
    glowTitle: "Free delivery",
    glowBody: "On every order in Riyadh this week.",
    intensities: ["Soft glow", "Medium glow", "Strong glow"],
    member: "Members’ early access",
    memberBody: "Shop the autumn edit a day before everyone else, with free delivery and returns.",
    join: "Become a member",
  },
  rtl: {
    title: "تخفيضات الخريف تنتهي الليلة",
    body: "خصم حتى 30% على الكتان والصوف.",
    colours: ["الكتان", "الصوف", "الجلد"],
    speeds: ["سريع: ثانيتان", "افتراضي: 4 ثوانٍ", "بطيء: 8 ثوانٍ"],
    glowTitle: "توصيل مجاني",
    glowBody: "لكل الطلبات داخل الرياض هذا الأسبوع.",
    intensities: ["توهّج خفيف", "توهّج متوسط", "توهّج قوي"],
    member: "وصول مبكر للأعضاء",
    memberBody: "تسوّق تشكيلة الخريف قبل الجميع بيوم، مع توصيل وإرجاع مجانيين.",
    join: "انضم إلى العضوية",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const CHART = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)"]
const glowOf = (color: string) => `color-mix(in oklch, ${color} 50%, transparent)`

export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <BorderBeam duration={3} {...args} className="w-64">
        <div className="p-6">
          <h3 className="font-semibold">{c.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
        </div>
      </BorderBeam>
    )
  },
}

export const CustomColors: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-6">
      {CHART.map((color, i) => (
        <BorderBeam key={color} colorFrom={color} duration={3} className="w-64">
          <div className="p-6">
            <h3 className="font-semibold">{copy(ctx).colours[i]}</h3>
          </div>
        </BorderBeam>
      ))}
    </div>
  ),
}

export const DifferentSpeeds: Story = {
  render: (_args, ctx) => (
    <div className="flex gap-6">
      {[2, 4, 8].map((duration, i) => (
        <BorderBeam key={duration} duration={duration} className="w-48">
          <div className="p-4 text-center">
            <p className="text-sm font-medium">{copy(ctx).speeds[i]}</p>
          </div>
        </BorderBeam>
      ))}
    </div>
  ),
}

export const GlowingBorderDefault: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <GlowingBorder className="w-64">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">{c.glowTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{c.glowBody}</p>
        </div>
      </GlowingBorder>
    )
  },
}

export const GlowIntensities: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-8">
      {(["sm", "md", "lg"] as const).map((intensity, i) => (
        <GlowingBorder key={intensity} intensity={intensity}>
          <div className="w-64 rounded-lg border bg-card p-6">
            <h3 className="font-semibold">{copy(ctx).intensities[i]}</h3>
          </div>
        </GlowingBorder>
      ))}
    </div>
  ),
}

export const GlowColors: Story = {
  render: (_args, ctx) => (
    <div className="flex gap-6">
      {CHART.map((color, i) => (
        <GlowingBorder key={color} glowColor={glowOf(color)}>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm font-medium">{copy(ctx).colours[i]}</p>
          </div>
        </GlowingBorder>
      ))}
    </div>
  ),
}

export const CardExample: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <BorderBeam colorFrom="var(--primary)" duration={3} className="w-80">
        <div className="p-6">
          <h3 className="text-lg font-semibold">{c.member}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{c.memberBody}</p>
          <Button className="mt-4 w-full">{c.join}</Button>
        </div>
      </BorderBeam>
    )
  },
}

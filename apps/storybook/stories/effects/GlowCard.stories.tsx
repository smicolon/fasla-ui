import type { Meta, StoryObj } from "@storybook/react"
import { GlowCard, GlowContainer } from "../../../../packages/fasla-ui/registry/effects/glow-card"

const meta: Meta<typeof GlowCard> = {
  title: "Effects/GlowCard",
  component: GlowCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof GlowCard>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. Colours are theme variables; GlowContainer's glow slides in
 * the reading direction.
 */
const COPY = {
  ltr: {
    delivery: { title: "Free delivery", body: "Hover over this card to see the glow." },
    follow: { title: "Easy returns", body: "The glow follows your pointer." },
    colours: ["Linen", "Wool", "Leather"],
    always: { title: "Members’ offer", body: "This card glows without hover." },
    container: { title: "Early access", body: "Members get early access to the autumn edit." },
  },
  rtl: {
    delivery: { title: "توصيل مجاني", body: "مرّر مؤشر الفأرة فوق البطاقة لترى التوهّج." },
    follow: { title: "إرجاع سهل", body: "يتبع التوهّج مؤشر الفأرة." },
    colours: ["الكتان", "الصوف", "الجلد"],
    always: { title: "عرض الأعضاء", body: "تتوهّج هذه البطاقة دون تمرير." },
    container: { title: "وصول مبكر", body: "يحصل الأعضاء على وصول مبكر إلى تشكيلة الخريف." },
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const CHART = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)"]

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{body}</p>
  </div>
)

export const Default: Story = {
  render: (args, ctx) => (
    <GlowCard {...args} className="w-[350px]">
      <Body {...copy(ctx).delivery} />
    </GlowCard>
  ),
}

export const FollowMouse: Story = {
  render: (args, ctx) => (
    <GlowCard {...args} followMouse className="w-[350px]">
      <Body {...copy(ctx).follow} />
    </GlowCard>
  ),
}

export const CustomColor: Story = {
  render: (_args, ctx) => (
    <div className="flex gap-4">
      {CHART.map((color, i) => (
        <GlowCard key={color} glowColor={color} className="w-[200px]">
          <div className="p-4">
            <h3 className="font-semibold">{copy(ctx).colours[i]}</h3>
          </div>
        </GlowCard>
      ))}
    </div>
  ),
}

export const AlwaysOn: Story = {
  render: (args, ctx) => (
    <GlowCard {...args} hoverOnly={false} glowColor="var(--chart-1)" className="w-[350px]">
      <Body {...copy(ctx).always} />
    </GlowCard>
  ),
}

export const GlowContainerExample: Story = {
  render: (_args, ctx) => (
    <GlowContainer glowColor="var(--chart-1)" duration={2}>
      <Body {...copy(ctx).container} />
    </GlowContainer>
  ),
}

import type { Meta, StoryObj } from "@storybook/react"
import { TypewriterText, TypewriterWords } from "../../../../packages/fasla-ui/registry/effects/typewriter-text"

const meta: Meta<typeof TypewriterText> = {
  title: "Effects/TypewriterText",
  component: TypewriterText,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TypewriterText>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. The cursor sits at the end of the line, so on the left in RTL.
 */
const COPY = {
  ltr: {
    default: "Your order is on its way.",
    slow: "Typing slowly…",
    delayed: "This started after a pause.",
    noCursor: "No cursor here.",
    looping: "Free delivery in Riyadh this week.",
    prefix: "New in:",
    words: ["linen shirts", "leather bags", "wool scarves", "desert boots"],
    heroTitle: "Welcome to My store",
    heroBody: "New pieces in linen, wool and leather, in store now.",
  },
  rtl: {
    default: "طلبك في الطريق إليك.",
    slow: "كتابة بطيئة…",
    delayed: "بدأت الكتابة بعد توقف قصير.",
    noCursor: "لا مؤشر كتابة هنا.",
    looping: "توصيل مجاني داخل الرياض هذا الأسبوع.",
    prefix: "وصل حديثًا:",
    words: ["قمصان الكتان", "حقائب الجلد", "أوشحة الصوف", "أحذية الصحراء"],
    heroTitle: "مرحبًا بك في متجري",
    heroBody: "قطع جديدة من الكتان والصوف والجلد، في المتجر الآن.",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  args: { className: "text-2xl font-bold" },
  render: (args, ctx) => <TypewriterText {...args} text={copy(ctx).default} />,
}

export const SlowSpeed: Story = {
  args: { speed: 150, className: "text-xl" },
  render: (args, ctx) => <TypewriterText {...args} text={copy(ctx).slow} />,
}

export const WithDelay: Story = {
  args: { delay: 1000, className: "text-xl" },
  render: (args, ctx) => <TypewriterText {...args} text={copy(ctx).delayed} />,
}

export const NoCursor: Story = {
  args: { cursor: false, className: "text-xl" },
  render: (args, ctx) => <TypewriterText {...args} text={copy(ctx).noCursor} />,
}

export const Looping: Story = {
  args: { loop: true, loopDelay: 1500, className: "text-xl" },
  render: (args, ctx) => <TypewriterText {...args} text={copy(ctx).looping} />,
}

export const WordsCycle: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="text-2xl font-bold">
        {c.prefix} <TypewriterWords words={c.words} className="text-primary" />
      </div>
    )
  },
}

export const HeroExample: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          <TypewriterText text={c.heroTitle} speed={80} />
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          <TypewriterText text={c.heroBody} delay={2500} speed={30} />
        </p>
      </div>
    )
  },
}

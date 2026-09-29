import type { Meta, StoryObj } from "@storybook/react"
import {
  TextReveal,
  WordReveal,
} from "../../../../packages/fasla-ui/registry/effects/text-reveal"

const meta: Meta<typeof TextReveal> = {
  title: "Effects/TextReveal",
  component: TextReveal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    delay: {
      control: { type: "range", min: 0.01, max: 0.1, step: 0.01 },
    },
    duration: {
      control: { type: "range", min: 0.1, max: 1, step: 0.1 },
    },
    triggerOnView: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. TextReveal reveals Arabic a word at a time, so its letters
 * stay joined; switch the toolbar to RTL to see it.
 */
const COPY = {
  ltr: {
    welcome: "Welcome to My store",
    character: "Revealed a character at a time",
    faster: "A faster reveal",
    slower: "A slower reveal",
    words: "Words appear one by one, with a soft blur",
    long: "Free delivery on every order in Riyadh this week, and free returns within 30 days on everything in the autumn edit",
    headline: "The autumn edit is here",
    subline: "New pieces in linen, wool and leather",
    speeds: ["Fast", "Default", "Slow"],
    speedLines: ["A quick reveal", "The default reveal", "A slow reveal"],
    scroll: "Scroll down to see the animation",
    scrolled: "This text reveals when it scrolls into view",
  },
  rtl: {
    welcome: "مرحبًا بك في متجري",
    character: "ظهور تدريجي للنص",
    faster: "ظهور أسرع",
    slower: "ظهور أبطأ",
    words: "تظهر الكلمات واحدة تلو الأخرى، مع تمويه خفيف",
    long: "توصيل مجاني لكل الطلبات داخل الرياض هذا الأسبوع، وإرجاع مجاني خلال 30 يومًا لكل قطع تشكيلة الخريف",
    headline: "تشكيلة الخريف وصلت",
    subline: "قطع جديدة من الكتان والصوف والجلد",
    speeds: ["سريع", "افتراضي", "بطيء"],
    speedLines: ["ظهور سريع", "الظهور الافتراضي", "ظهور بطيء"],
    scroll: "مرّر إلى الأسفل لترى الحركة",
    scrolled: "يظهر هذا النص حين يصل إلى الشاشة",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  args: {
    className: "text-2xl font-semibold",
  },
  render: (args, ctx) => <TextReveal {...args} text={copy(ctx).welcome} />,
}

export const CharacterReveal: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        <TextReveal text={c.character} className="block text-3xl font-bold" triggerOnView={false} />
        <TextReveal text={c.faster} className="block text-2xl" delay={0.02} duration={0.2} triggerOnView={false} />
        <TextReveal text={c.slower} className="block text-2xl" delay={0.06} duration={0.5} triggerOnView={false} />
      </div>
    )
  },
}

export const WordByWord: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="max-w-lg space-y-8">
        <WordReveal text={c.words} className="text-3xl font-bold" triggerOnView={false} />
        <WordReveal text={c.long} className="text-xl" triggerOnView={false} />
      </div>
    )
  },
}

export const Headlines: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-12 text-center">
        <TextReveal text={c.headline} className="block text-5xl font-bold" triggerOnView={false} />
        <WordReveal text={c.subline} className="text-2xl text-muted-foreground" triggerOnView={false} />
      </div>
    )
  },
}

export const WithDifferentSpeeds: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        {[0.02, 0.03, 0.06].map((delay, i) => (
          <div key={delay}>
            <p className="mb-2 text-sm text-muted-foreground">
              {c.speeds[i]} <code>delay={delay}</code>
            </p>
            <TextReveal text={c.speedLines[i]!} className="text-xl font-semibold" delay={delay} triggerOnView={false} />
          </div>
        ))}
      </div>
    )
  },
}

export const ScrollTriggered: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="h-[150vh] pt-[50vh] text-center">
        <p className="mb-8 text-muted-foreground">{c.scroll}</p>
        <TextReveal text={c.scrolled} className="text-3xl font-bold" triggerOnView />
      </div>
    )
  },
  parameters: {
    layout: "fullscreen",
  },
}

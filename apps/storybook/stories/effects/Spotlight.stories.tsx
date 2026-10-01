import type { Meta, StoryObj } from "@storybook/react"
import {
  Spotlight,
  SpotlightCard,
} from "../../../../packages/fasla-ui/registry/effects/spotlight"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof Spotlight> = {
  title: "Effects/Spotlight",
  component: Spotlight,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "range", min: 100, max: 800, step: 50 },
    },
    blur: {
      control: { type: "range", min: 20, max: 200, step: 10 },
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sample copy, per script: the same store as the docs page. The Arabic follows
 * design/content/. Buttons are the library's own, never hand-styled controls.
 */
const COPY = {
  ltr: {
    move: "Move your pointer around",
    moveHint: "to see the spotlight",
    colours: ["Linen", "Wool", "Leather"],
    card: { title: "Free delivery", body: "Hover over this card and the light follows your pointer." },
    grid: [
      { title: "Orders", body: "Track every order" },
      { title: "Products", body: "Manage your catalogue" },
      { title: "Customers", body: "See who buys what" },
      { title: "Settings", body: "Set up your store" },
    ],
    large: { title: "Meet the autumn edit", body: "A larger, softer light for a calmer, more ambient effect." },
    sizes: ["Small: 200px", "Default: 400px", "Large: 600px"],
    hero: {
      title: "Welcome to My store",
      body: "New pieces in linen, wool and leather, with free delivery in Riyadh this week.",
      primary: "Shop the collection",
      secondary: "Our story",
    },
  },
  rtl: {
    move: "حرّك مؤشر الفأرة هنا",
    moveHint: "لترى بقعة الضوء",
    colours: ["الكتان", "الصوف", "الجلد"],
    card: { title: "توصيل مجاني", body: "مرّر مؤشر الفأرة فوق البطاقة وسيتبعه الضوء." },
    grid: [
      { title: "الطلبات", body: "تابع كل طلب" },
      { title: "المنتجات", body: "أدِر منتجات متجرك" },
      { title: "العملاء", body: "اعرف من يشتري ماذا" },
      { title: "الإعدادات", body: "اضبط متجرك" },
    ],
    large: { title: "تعرّف إلى تشكيلة الخريف", body: "ضوء أكبر وأنعم لتأثير أهدأ يملأ المساحة." },
    sizes: ["صغير: 200px", "افتراضي: 400px", "كبير: 600px"],
    hero: {
      title: "مرحبًا بك في متجري",
      body: "قطع جديدة من الكتان والصوف والجلد، مع توصيل مجاني داخل الرياض هذا الأسبوع.",
      primary: "تسوّق التشكيلة",
      secondary: "قصتنا",
    },
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const lightOf = (color: string) => `color-mix(in oklch, ${color} 30%, transparent)`
const CHART = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)"]

export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <Spotlight {...args} className="flex h-64 w-96 items-center justify-center rounded-xl border bg-card">
        <p className="text-center">
          {c.move}
          <br />
          <span className="text-sm text-muted-foreground">{c.moveHint}</span>
        </p>
      </Spotlight>
    )
  },
}

export const CustomColors: Story = {
  render: (_args, ctx) => (
    <div className="flex flex-col gap-6">
      {CHART.map((color, i) => (
        <Spotlight
          key={color}
          color={lightOf(color)}
          className="flex h-40 w-64 items-center justify-center rounded-xl border bg-card"
        >
          <p className="text-sm">{copy(ctx).colours[i]}</p>
        </Spotlight>
      ))}
    </div>
  ),
}

export const SpotlightCardDefault: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx).card
    return (
      <SpotlightCard className="w-72">
        <h3 className="font-semibold">{c.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
      </SpotlightCard>
    )
  },
}

export const CardGrid: Story = {
  render: (_args, ctx) => (
    <div className="grid grid-cols-2 gap-4">
      {copy(ctx).grid.map((item) => (
        <SpotlightCard key={item.title} className="w-48">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
        </SpotlightCard>
      ))}
    </div>
  ),
}

export const LargeSpotlight: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx).large
    return (
      <Spotlight
        size={600}
        blur={100}
        className="flex h-80 w-full max-w-2xl items-center justify-center rounded-2xl border bg-card p-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">{c.title}</h2>
          <p className="mt-4 max-w-md text-muted-foreground">{c.body}</p>
        </div>
      </Spotlight>
    )
  },
}

export const DifferentSizes: Story = {
  render: (_args, ctx) => (
    <div className="flex gap-6">
      {[200, 400, 600].map((size, i) => (
        <Spotlight
          key={size}
          size={size}
          className="flex h-40 w-48 items-center justify-center rounded-xl border bg-card"
        >
          <p className="text-sm">{copy(ctx).sizes[i]}</p>
        </Spotlight>
      ))}
    </div>
  ),
}

export const Hero: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx).hero
    return (
      <Spotlight
        size={500}
        blur={80}
        color={lightOf("var(--chart-1)")}
        className="h-96 w-full max-w-3xl rounded-2xl border bg-card"
      >
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl font-bold">{c.title}</h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">{c.body}</p>
          <div className="mt-8 flex gap-4">
            <Button>{c.primary}</Button>
            <Button variant="outline">{c.secondary}</Button>
          </div>
        </div>
      </Spotlight>
    )
  },
}

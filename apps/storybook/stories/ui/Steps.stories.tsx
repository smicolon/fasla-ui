import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  Steps,
  StepsItem,
  type StepStatus,
  type StepsOrientation,
  type StepsRadius,
} from "../../../../packages/fasla-ui/registry/ui/steps"

/**
 * Figma: Steps / Step item (405:7832), assembled into Steps Horizontal
 * (3793:70328) and Steps Vertical (3793:70403). Orientation and Radius are
 * props on `Steps`; Status is a prop on each `StepsItem`; Has tail is never a
 * prop, since every step but the last draws one; Step Icon is `icon`; Sub
 * Text is `description`; Direction is the toolbar. Every story follows the
 * Direction and Theme toolbars, except Light And Dark and LTR And RTL, which
 * show both at once.
 */

/**
 * The Default story's controls. `current` and `descriptions` are story-only:
 * the steps before `current` are done and the ones after it are upcoming, as
 * a real flow sets them; `descriptions` turns on every step's Sub Text. `icon`
 * shows the check on the done steps.
 */
type StoryArgs = {
  orientation: StepsOrientation
  radius: StepsRadius
  current: number
  icon: boolean
  descriptions: boolean
  className?: string
}

const meta: Meta<StoryArgs> = {
  title: "UI/Steps",
  component: Steps as unknown as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Figma `Orientation`: a row with the labels under the bullets, or a column with them beside.",
      table: { defaultValue: { summary: '"horizontal"' } },
    },
    radius: {
      control: "inline-radio",
      options: ["standard", "rounded"],
      description: "Figma `Radius`: 8px square bullets, or circles.",
      table: { defaultValue: { summary: '"standard"' } },
    },
    current: {
      control: { type: "range", min: 1, max: 6, step: 1 },
      description:
        "Story only: which step is current. The steps before it are `done`, the ones after it `upcoming`; 6 makes every step done.",
    },
    icon: {
      control: "boolean",
      description: "`icon` on the done steps: Figma's Step Icon, a check in place of the number.",
    },
    descriptions: {
      control: "boolean",
      description: "Story only: a `description` on every step, Figma's Sub Text.",
    },
    className: {
      control: "text",
      description: "Extra classes for the list.",
      table: { type: { summary: "string" } },
    },
  },
  args: { orientation: "horizontal", radius: "standard", current: 3, icon: false, descriptions: false },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: a checkout, written from design/content/, not
 * translated. Digits stay Western in Arabic.
 */
const COPY = {
  ltr: {
    name: "Checkout",
    steps: [
      { label: "Cart", description: "3 items" },
      { label: "Shipping", description: "Address and delivery" },
      { label: "Payment", description: "Card or wallet" },
      { label: "Review", description: "Check your order" },
      { label: "Confirmation", description: "Order placed" },
    ],
    long: [
      { label: "Create your account", description: "Your name, email and a password of at least 8 characters" },
      { label: "Verify your email", description: "Enter the 6-digit code we sent to your inbox" },
      { label: "Choose a plan", description: "Pick a monthly or yearly plan; you can change it at any time" },
    ],
  },
  rtl: {
    name: "إتمام الشراء",
    steps: [
      { label: "السلة", description: "3 منتجات" },
      { label: "الشحن", description: "العنوان وطريقة التوصيل" },
      { label: "الدفع", description: "بطاقة أو محفظة" },
      { label: "المراجعة", description: "راجع طلبك" },
      { label: "التأكيد", description: "تم الطلب" },
    ],
    long: [
      { label: "أنشئ حسابك", description: "اسمك وبريدك الإلكتروني وكلمة مرور من 8 أحرف على الأقل" },
      { label: "أكّد بريدك الإلكتروني", description: "أدخل الرمز المكوّن من 6 أرقام الذي أرسلناه إلى بريدك" },
      { label: "اختر خطة", description: "اختر خطة شهرية أو سنوية، ويمكنك تغييرها في أي وقت" },
    ],
  },
}

type Copy = (typeof COPY)["ltr"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const RADII = ["standard", "rounded"] as const
const THEMES = ["light", "dark"] as const

/** A step's status from the current step's number, counting from 1. */
const statusOf = (step: number, current: number): StepStatus =>
  step < current ? "done" : step === current ? "current" : "upcoming"

/**
 * Row widths. Figma's Steps Horizontal is 700px; 560px fits the Docs page
 * beside a row label. A panel, two to a row, holds 400px, so it shows four
 * steps: five would leave each label under 60px.
 */
const ROW = "w-[560px]"
const PANEL_ROW = "w-[400px]"

/**
 * A flow of steps, as a developer writes one: every step before `current`
 * done, then the current step, then the upcoming ones.
 */
function Flow({
  steps,
  current = 3,
  icon = false,
  descriptions = false,
  name,
  ...props
}: {
  steps: Copy["steps"] | Copy["long"]
  current?: number
  icon?: boolean
  descriptions?: boolean
  name: string
  orientation?: StepsOrientation
  radius?: StepsRadius
  className?: string
}) {
  return (
    <Steps aria-label={name} {...props}>
      {steps.map((step, i) => {
        const status = statusOf(i + 1, current)
        return (
          <StepsItem
            key={step.label}
            status={status}
            icon={icon && status === "done"}
            label={step.label}
            description={descriptions ? step.description : undefined}
          />
        )
      })}
    </Steps>
  )
}

/**
 * A column header or panel title: a Figma property value, so English and
 * left-to-right in both directions. It never wraps.
 */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label: left-aligned in both directions, never wrapped, and a
 * full column gap from the steps. It is 38px tall, so it centres on the
 * bullets' line, not on the labels under them.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="flex h-[38px] items-center whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/**
 * The frame round every story but Default. It centres the content in either
 * direction, and scrolls it sideways in the story's own direction when it is
 * wider than the canvas (a phone).
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/**
 * The playground: every row on the Controls panel changes it. Horizontal, the
 * list takes its container's width (560px here); vertical, it is as tall as
 * its steps.
 */
export const Default: Story = {
  render: ({ orientation, radius, current, icon, descriptions, className }, ctx) => {
    const c = copy(ctx)
    return (
      <div className={orientation === "horizontal" ? ROW : "w-max"}>
        <Flow
          steps={c.steps}
          name={c.name}
          orientation={orientation}
          radius={radius}
          current={current}
          icon={icon}
          descriptions={descriptions}
          className={className}
        />
      </div>
    )
  },
}

/**
 * Figma's Steps Horizontal, in both radii: done, current and upcoming steps
 * with the labels centred under the bullets. Each tail fills the space to the
 * next step, `primary` after a done step and `border` after the others. The
 * last step has none.
 */
export const Horizontal: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_max-content] items-start gap-x-6 gap-y-8">
        {RADII.map((radius) => (
          <React.Fragment key={radius}>
            <RowHead>{radius}</RowHead>
            <div className={ROW}>
              <Flow steps={c.steps} name={c.name} radius={radius} />
            </div>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's Steps Vertical, in both radii. The labels sit beside the bullets,
 * the first line on the bullet's centre, and each tail runs down from the
 * bullet to the next step, at least 46px long.
 */
export const Vertical: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[repeat(2,max-content)] items-start gap-x-16 gap-y-4">
        {RADII.map((radius) => (
          <Head key={radius}>{radius}</Head>
        ))}
        {RADII.map((radius) => (
          <Flow key={radius} steps={c.steps} name={c.name} orientation="vertical" radius={radius} />
        ))}
      </div>
    )
  },
}

/**
 * Figma's Step Icon: `icon` on the done steps puts a 22px check in place of
 * the number, in `primary-foreground`. Shown in both orientations and radii.
 */
export const StepIcon: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_max-content] items-start gap-x-6 gap-y-8">
        {RADII.map((radius) => (
          <React.Fragment key={radius}>
            <RowHead>{radius}</RowHead>
            <div className={ROW}>
              <Flow steps={c.steps} name={c.name} radius={radius} current={4} icon />
            </div>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/**
 * Figma's Sub Text: a `description` under each label, in `muted-foreground`,
 * 2px below it. Horizontal, it is centred with the label; vertical, it starts
 * where the label starts.
 */
export const WithDescription: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_max-content] items-start gap-x-6 gap-y-8">
        <RowHead>horizontal</RowHead>
        <div className={ROW}>
          <Flow steps={c.steps} name={c.name} descriptions />
        </div>
        <RowHead>vertical</RowHead>
        <Flow steps={c.steps} name={c.name} orientation="vertical" descriptions />
      </div>
    )
  },
}

/**
 * Long text. Horizontal, a label wider than its bullet reaches out on both
 * sides, up to its share of the row, and wraps there, so two labels always
 * keep 16px apart; the first and last keep inside the list, against its
 * start and end. Vertical, the label and description wrap in their column,
 * and the tail grows to the next step.
 */
export const LongText: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_max-content] items-start gap-x-6 gap-y-8">
        <RowHead>horizontal</RowHead>
        <div className={ROW}>
          <Flow steps={c.long} name={c.name} current={2} />
        </div>
        <RowHead>vertical</RowHead>
        <div className="w-[320px]">
          <Flow steps={c.long} name={c.name} orientation="vertical" current={2} descriptions />
        </div>
      </div>
    )
  },
}

/**
 * Light and Dark, one panel each, whatever the theme toolbar says. Each panel
 * sets its own theme: the `light` or `dark` class re-points every token for
 * that subtree. Language and direction follow the toolbar.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[theme, "flex flex-col gap-6 rounded-lg border bg-background p-6 text-foreground"].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            <div className={PANEL_ROW}>
              <Flow steps={c.steps.slice(0, 4)} name={c.name} current={3} icon />
            </div>
            <Flow steps={c.steps} name={c.name} orientation="vertical" radius="rounded" current={3} descriptions />
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Both directions at once, whatever the toolbar says: each panel sets its own
 * `dir`, `lang` and font. In Arabic the first step is on the right and the
 * tails run to the left; vertical, the bullets are on the right and the labels
 * to their left. The numbers stay Western.
 */
export const LtrAndRtl: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    // Each panel is a subgrid of the same rows, so the two sides share every
    // row's top edge.
    <div className="grid gap-4 md:grid-cols-2">
      {(["ltr", "rtl"] as const).map((direction) => {
        const c = COPY[direction]
        return (
          <div
            key={direction}
            dir={direction}
            lang={direction === "rtl" ? "ar" : "en"}
            className={[
              "row-span-3 grid grid-rows-subgrid gap-6 rounded-lg border p-6",
              direction === "rtl" ? "font-arabic" : "font-sans",
            ].join(" ")}
          >
            <Head>{direction.toUpperCase()}</Head>
            <div className={PANEL_ROW}>
              <Flow steps={c.steps.slice(0, 4)} name={c.name} current={3} descriptions />
            </div>
            <Flow steps={c.steps} name={c.name} orientation="vertical" current={3} descriptions />
          </div>
        )
      })}
    </div>
  ),
}

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
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shows where the reader is in a flow of several steps: which are done, which is current, and which are still to come.",
      },
    },
  },
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
    // Two-word labels that stay on one line; the descriptions are the long
    // part, about one and a half lines each in the horizontal row.
    long: [
      { label: "Create account", description: "Use your work email and a strong password." },
      { label: "Verify email", description: "Enter the 6-digit code we sent to your inbox." },
      { label: "Invite team", description: "Add your teammates now or invite them later." },
      { label: "Choose plan", description: "Pay monthly or yearly, and switch at any time." },
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
      { label: "أنشئ حسابك", description: "استخدم بريد العمل، واختر كلمة مرور لا تقل عن 8 أحرف." },
      { label: "أكّد بريدك", description: "أدخل الرمز المكوّن من 6 أرقام الذي وصلك في البريد." },
      { label: "ادعُ فريقك", description: "أضف زملاءك الآن، أو ادعُهم لاحقًا من الإعدادات." },
      { label: "اختر خطتك", description: "اختر الفوترة الشهرية أو السنوية، وغيّرها متى شئت." },
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

/*
 * Row widths. Each label may use the space up to halfway to its neighbours'
 * bullets, less 16px. The longest sample text, "Address and delivery", needs
 * 134px, so five steps need a 780px row (Figma's Steps Horizontal is 700px),
 * and a panel, two to a row on the ~1000px Docs page with 24px of padding,
 * holds 440px: three steps with descriptions, or four with labels only.
 */
const ROW = "w-[780px]"
const PANEL_ROW = "w-[440px]"
const PANEL = "rounded-lg border p-6"

// A flow of steps, as a developer writes one: every step before `current`
// done, then the current step, then the upcoming ones.
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

// A column header or panel title: a Figma property value, so English and
// left-to-right in both directions. It never wraps.
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

// A side row label: left-aligned in both directions, never wrapped, and a
// full column gap from the steps. It is as tall as a bullet, so it centres on
// the bullets' line, not on the labels under them.
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="flex h-[2.375rem] items-center whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

// The frame round every story. It centres the content in either direction,
// and scrolls it sideways in the story's own direction when it is wider than
// the canvas (a phone). No padding: Steps has no focus ring to keep clear.
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max">
      <Story />
    </div>
  </div>
)

/** A checkout you can change from the Controls panel. */
export const Default: Story = {
  decorators: [framed],
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

/** Steps in a row, with square and round bullets. */
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

/** Steps in a column, with square and round bullets. */
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

/** Done steps with a check in place of their number. */
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

/** Steps with a short description under each label. */
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

/** Long descriptions, which wrap to fit the space each step has. */
export const LongText: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[max-content_max-content] items-start gap-x-6 gap-y-8">
        <RowHead>horizontal</RowHead>
        <div className={ROW}>
          <Flow steps={c.long} name={c.name} current={2} descriptions />
        </div>
        <RowHead>vertical</RowHead>
        <div className="w-[240px]">
          <Flow steps={c.long} name={c.name} orientation="vertical" current={2} descriptions />
        </div>
      </div>
    )
  },
}

/** The same steps in the light and dark themes. */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      // Each panel's `light` or `dark` class re-points every token for its
      // subtree. Language and direction follow the toolbar.
      <div className="grid gap-4 md:grid-cols-2">
        {THEMES.map((theme) => (
          <div key={theme} className={[theme, PANEL, "flex flex-col gap-6 bg-background text-foreground"].join(" ")}>
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

/** The same steps in English and Arabic, mirrored for right-to-left. */
export const LtrAndRtl: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    // Each panel sets its own `dir`, `lang` and font, and is a subgrid of the
    // same rows, so the two sides share every row's top edge.
    <div className="grid gap-4 md:grid-cols-2">
      {(["ltr", "rtl"] as const).map((direction) => {
        const c = COPY[direction]
        return (
          <div
            key={direction}
            dir={direction}
            lang={direction === "rtl" ? "ar" : "en"}
            className={[
              PANEL,
              "row-span-3 grid grid-rows-subgrid gap-6",
              direction === "rtl" ? "font-arabic" : "font-sans",
            ].join(" ")}
          >
            <Head>{direction.toUpperCase()}</Head>
            <div className={PANEL_ROW}>
              <Flow steps={c.steps.slice(0, 3)} name={c.name} current={2} descriptions />
            </div>
            <Flow steps={c.steps.slice(0, 3)} name={c.name} orientation="vertical" current={2} descriptions />
          </div>
        )
      })}
    </div>
  ),
}

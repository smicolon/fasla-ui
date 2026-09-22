import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Radio } from "../../../../packages/fasla-ui/registry/ui/radio"

const meta: Meta<typeof Radio> = {
  title: "UI/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Radio>

/**
 * Sample copy, per script.
 *
 * Only the *rendered values* change — prop names stay English everywhere,
 * because they are code identifiers and the argTypes table documents the API,
 * not the sample. Arabic is Modern Standard Arabic, written for the sample
 * rather than transliterated.
 *
 * The long strings deliberately avoid digits, colons and dashes: those are
 * bidi-neutral and get reordered in an RTL run, which would make the sample
 * look broken for reasons that have nothing to do with the component.
 */
const COPY = {
  ltr: {
    label: "Label",
    sizes: ["Small", "Medium", "Large"],
    standard: "Standard",
    express: "Express",
    courier: "Same-day courier",
    standardDesc: "Three to five business days",
    expressDesc: "Arrives tomorrow before six in the evening",
    courierDesc: "Unavailable in your area",
    expressFull: "Express delivery",
    expressFullDesc: "Arrives tomorrow before six in the evening",
    disabledOff: "Disabled, unselected",
    disabledOn: "Disabled, selected",
    longLabel: "Same-day courier delivery to a residential address",
    longDesc: "Unavailable in some areas, and subject to a surcharge at checkout",
  },
  rtl: {
    label: "عنوان",
    sizes: ["صغير", "متوسط", "كبير"],
    standard: "شحن عادي",
    express: "شحن سريع",
    courier: "توصيل في نفس اليوم",
    standardDesc: "من ثلاثة إلى خمسة أيام عمل",
    expressDesc: "يصل غداً قبل السادسة مساءً",
    courierDesc: "غير متاح في منطقتك",
    expressFull: "شحن سريع",
    expressFullDesc: "يصل غداً قبل السادسة مساءً",
    disabledOff: "معطّل، غير محدد",
    disabledOn: "معطّل، محدد",
    longLabel: "توصيل بالبريد السريع في نفس اليوم إلى عنوان سكني",
    longDesc: "غير متاح في بعض المناطق ويخضع لرسوم إضافية عند الدفع",
  },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (args, ctx) => <Radio label={copy(ctx).label} {...args} />,
}

export const Checked: Story = {
  render: (args, ctx) => <Radio label={copy(ctx).label} defaultChecked {...args} />,
}

export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-4">
        {(["sm", "md", "lg"] as const).map((size, i) => (
          <Radio
            key={size}
            name={`sizes-${size}`}
            size={size}
            label={c.sizes[i]}
            defaultChecked
          />
        ))}
      </div>
    )
  },
}

export const WithDescription: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return <Radio label={c.expressFull} description={c.expressFullDesc} />
  },
}

export const Layout: Story = {
  render: (_args, ctx) => (
    <Radio variant="layout" label={copy(ctx).expressFull} defaultChecked />
  ),
}

export const LayoutGroup: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const options = [
      { value: "standard", label: c.standard, description: c.standardDesc },
      { value: "express", label: c.express, description: c.expressDesc },
      { value: "courier", label: c.courier, description: c.courierDesc, disabled: true },
    ]
    return (
      <div className="flex w-80 flex-col gap-2">
        {options.map((option, i) => (
          <Radio
            key={option.value}
            name="shipping"
            value={option.value}
            variant="layout"
            label={option.label}
            description={option.description}
            className="w-full"
            disabled={option.disabled}
            defaultChecked={i === 0}
          />
        ))}
      </div>
    )
  },
}

export const Disabled: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-4">
        <Radio name="disabled-a" label={c.disabledOff} disabled />
        <Radio name="disabled-b" label={c.disabledOn} disabled defaultChecked />
      </div>
    )
  },
}

const Cell = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <div id={id} className="flex min-h-9 items-center">
    {children}
  </div>
)

const Head = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs text-muted-foreground">{children}</span>
)

const VARIANTS = ["default", "layout"] as const
const CHECKED = [false, true] as const
const INTERACTIONS = ["enabled", "hover", "focus", "disabled"] as const

const cellId = (v: string, c: boolean, i: string) => `c-${v}-${c}-${i}`

/**
 * The addon applies the state to whatever these select, so each points at the
 * element the CSS actually keys off: `hover` at the `<label>` (the `group`), and
 * `focusVisible` at the `<input>`, which the card and control read through
 * `:has(:focus-visible)`.
 */
const hoverTargets = VARIANTS.flatMap((v) =>
  CHECKED.map((c) => `#${cellId(v, c, "hover")} label`)
)
const focusTargets = VARIANTS.flatMap((v) =>
  CHECKED.map((c) => `#${cellId(v, c, "focus")} input`)
)

/**
 * Figma's `Interaction` axis — Enabled / Hover / Focus / Disabled — crossed with
 * `State`, for both types.
 *
 * All four render statically. `storybook-addon-pseudo-states` applies the real
 * `:hover` and `:focus-visible` rather than an imitation built from utility
 * classes, so the grid cannot drift from the component: if the component's hover
 * rule changes, this grid changes with it.
 *
 * The axis and value names stay English in both directions — they are Figma
 * property identifiers (`Type=Layout`, `Interaction=Hover`), not sample copy.
 * Only the control's own label switches script.
 *
 * In Figma this axis is 4 values × 2 states × 2 types × 3 sizes × 2 directions.
 * Size is covered by `Sizes` and direction by the Direction toolbar, so this
 * grid holds those two fixed to stay readable.
 */
export const AllStates: Story = {
  parameters: {
    layout: "padded",
    pseudo: { hover: hoverTargets, focusVisible: focusTargets },
  },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const section = (variant: (typeof VARIANTS)[number], title: string) => (
      <div className="space-y-3">
        <h3 dir="ltr" className="text-sm font-medium text-foreground">
          {title}
        </h3>
        <div className="grid grid-cols-[4.5rem_repeat(4,minmax(0,1fr))] items-center gap-x-4 gap-y-2">
          <span />
          {INTERACTIONS.map((interaction) => (
            <Head key={interaction}>
              {interaction[0]!.toUpperCase() + interaction.slice(1)}
            </Head>
          ))}

          {CHECKED.map((checked) => (
            <React.Fragment key={String(checked)}>
              <Head>{checked ? "Checked" : "Unchecked"}</Head>
              {INTERACTIONS.map((interaction) => (
                <Cell key={interaction} id={cellId(variant, checked, interaction)}>
                  <Radio
                    name={`grid-${variant}-${checked}-${interaction}`}
                    variant={variant}
                    label={c.label}
                    defaultChecked={checked}
                    disabled={interaction === "disabled"}
                    className={variant === "layout" ? "w-full" : undefined}
                  />
                </Cell>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    )

    return (
      <div className="space-y-8">
        {section("default", "Type = Default")}
        {section("layout", "Type = Layout")}
      </div>
    )
  },
}

/**
 * A label long enough to wrap, at all three sizes. The control must sit on the
 * *first* line, not in the middle of the block. Flip the Direction toolbar to
 * check the same thing in Arabic, where the ramp gives every line 24px instead
 * of 20px and the control re-centres itself.
 */
export const WrappedLabel: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex w-64 flex-col gap-4">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Radio
            key={size}
            name={`wrapped-${size}`}
            size={size}
            label={c.longLabel}
            defaultChecked
          />
        ))}
        <Radio
          name="wrapped-layout"
          variant="layout"
          label={c.longLabel}
          description={c.longDesc}
          className="w-full"
        />
      </div>
    )
  },
}

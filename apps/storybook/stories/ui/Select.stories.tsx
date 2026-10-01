import type { Meta, StoryObj } from "@storybook/react"
import { Select } from "../../../../packages/fasla-ui/registry/ui/select"

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Select>

/**
 * Sample copy, per script: the same cities in both, as Radio uses the same
 * shipping options. Option values are the same Latin identifiers in both;
 * only the labels and placeholders change. The Arabic follows design/content/.
 */
const COPY = {
  ltr: {
    options: [
      { value: "riyadh", label: "Riyadh" },
      { value: "jeddah", label: "Jeddah" },
      { value: "dammam", label: "Dammam" },
      { value: "makkah", label: "Makkah" },
    ],
    placeholder: "Select a city",
    sizes: ["Select a city", "Select a city", "Select a city"],
    disabledOption: "Abha, coming soon",
  },
  rtl: {
    options: [
      { value: "riyadh", label: "الرياض" },
      { value: "jeddah", label: "جدة" },
      { value: "dammam", label: "الدمام" },
      { value: "makkah", label: "مكة المكرمة" },
    ],
    placeholder: "اختر مدينة",
    sizes: ["اختر مدينة", "اختر مدينة", "اختر مدينة"],
    disabledOption: "أبها، قريبًا",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (args, ctx) => (
    <Select {...args} options={args.options ?? copy(ctx).options} placeholder={args.placeholder ?? copy(ctx).placeholder} className="w-[200px]" />
  ),
}

export const Sizes: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="flex flex-col gap-4">
        <Select options={c.options} selectSize="sm" placeholder={c.sizes[0]} className="w-[200px]" />
        <Select options={c.options} selectSize="default" placeholder={c.sizes[1]} className="w-[200px]" />
        <Select options={c.options} selectSize="lg" placeholder={c.sizes[2]} className="w-[200px]" />
      </div>
    )
  },
}

export const Error: Story = {
  render: (args, ctx) => <Select {...args} options={args.options ?? copy(ctx).options} error className="w-[200px]" />,
}

export const Disabled: Story = {
  render: (args, ctx) => <Select {...args} options={args.options ?? copy(ctx).options} disabled className="w-[200px]" />,
}

export const WithDisabledOption: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <Select
        {...args}
        options={args.options ?? [...c.options, { value: "disabled", label: c.disabledOption, disabled: true }]}
        className="w-[200px]"
      />
    )
  },
}

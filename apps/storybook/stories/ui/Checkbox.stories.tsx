import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "../../../../packages/fasla-ui/registry/ui/checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Checkbox>

/**
 * Sample copy, per script. Only the rendered values change; prop names stay
 * English. The Arabic follows design/content/: real situations, never a
 * placeholder, and one label long enough to wrap.
 */
const COPY = {
  ltr: {
    terms: "Accept terms and conditions",
    marketing: "Marketing emails",
    marketingDesc: "Receive emails about new products and features",
    disabled: "Disabled checkbox",
    required: "Required field",
    selectAll: "Select all",
    long: "Email me a weekly summary of new components and release notes",
  },
  rtl: {
    terms: "أوافق على الشروط والأحكام",
    marketing: "رسائل العروض",
    marketingDesc: "تصلك رسائل عن المنتجات والميزات الجديدة",
    disabled: "النسخ الاحتياطي التلقائي",
    required: "أوافق على سياسة الخصوصية",
    selectAll: "تحديد كل الملفات",
    long: "أرسل لي ملخصًا أسبوعيًا بالمكوّنات الجديدة وملاحظات الإصدار عبر البريد الإلكتروني",
  },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithLabel: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).terms} {...args} />,
}

export const WithDescription: Story = {
  render: (args, ctx) => (
    <Checkbox label={copy(ctx).marketing} description={copy(ctx).marketingDesc} {...args} />
  ),
}

export const Disabled: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).disabled} disabled {...args} />,
}

export const Error: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).required} error {...args} />,
}

export const Indeterminate: Story = {
  render: (args, ctx) => <Checkbox label={copy(ctx).selectAll} indeterminate {...args} />,
}

/** A label long enough to wrap: the box must stay on the first line. */
export const WrappedLabel: Story = {
  render: (args, ctx) => (
    <div className="w-64">
      <Checkbox label={copy(ctx).long} {...args} />
    </div>
  ),
}

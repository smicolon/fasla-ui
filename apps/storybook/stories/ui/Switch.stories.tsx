import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "../../../../packages/fasla-ui/registry/ui/switch"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Switch>

/**
 * Sample copy, per script. Only the rendered values change; prop names stay
 * English. The Arabic follows design/content/.
 */
const COPY = {
  ltr: {
    airplane: "Airplane mode",
    notifications: "Notifications",
    notificationsDesc: "Receive push notifications",
    disabled: "Disabled",
    long: "Download updates over mobile data when Wi-Fi is unavailable",
  },
  rtl: {
    airplane: "وضع الطيران",
    notifications: "الإشعارات",
    notificationsDesc: "تصلك الإشعارات الفورية",
    disabled: "المزامنة عبر بيانات الجوّال",
    long: "تنزيل التحديثات تلقائيًا عبر بيانات الجوّال عند غياب شبكة Wi-Fi",
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

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" />
      <Switch size="md" />
      <Switch size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: (args, ctx) => <Switch label={copy(ctx).airplane} {...args} />,
}

export const WithDescription: Story = {
  render: (args, ctx) => (
    <Switch label={copy(ctx).notifications} description={copy(ctx).notificationsDesc} {...args} />
  ),
}

export const Disabled: Story = {
  render: (args, ctx) => <Switch label={copy(ctx).disabled} disabled {...args} />,
}

/** A label long enough to wrap: the track must stay on the first line. */
export const WrappedLabel: Story = {
  render: (args, ctx) => (
    <div className="w-64">
      <Switch label={copy(ctx).long} defaultChecked {...args} />
    </div>
  ),
}

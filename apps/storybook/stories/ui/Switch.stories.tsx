import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "../../../../packages/smi-ui/registry/ui/switch"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Switch>

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
      <Switch size="default" />
      <Switch size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    label: "Airplane mode",
  },
}

export const WithDescription: Story = {
  args: {
    label: "Notifications",
    description: "Receive push notifications",
  },
}

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
  },
}

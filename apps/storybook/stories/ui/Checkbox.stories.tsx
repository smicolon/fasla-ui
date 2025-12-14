import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "../../../../packages/smi-ui/registry/ui/checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithLabel: Story = {
  args: {
    label: "Accept terms and conditions",
  },
}

export const WithDescription: Story = {
  args: {
    label: "Marketing emails",
    description: "Receive emails about new products and features",
  },
}

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    label: "Required field",
    error: true,
  },
}

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    indeterminate: true,
  },
}

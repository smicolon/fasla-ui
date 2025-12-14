import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "../../../../packages/smi-ui/registry/ui/textarea"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
    className: "w-[300px]",
  },
}

export const WithCharacterCount: Story = {
  args: {
    placeholder: "Write something...",
    showCount: true,
    maxLength: 200,
    className: "w-[300px]",
  },
}

export const Error: Story = {
  args: {
    placeholder: "Error state",
    variant: "error",
    className: "w-[300px]",
  },
}

export const NoResize: Story = {
  args: {
    placeholder: "Cannot resize",
    resize: "none",
    className: "w-[300px]",
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
    className: "w-[300px]",
  },
}

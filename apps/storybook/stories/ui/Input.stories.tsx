import type { Meta, StoryObj } from "@storybook/react"
import { CheckIcon, MailIcon, SearchIcon, UserIcon } from "lucide-react"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "success"],
    },
    inputSize: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Input placeholder="Default" variant="default" />
      <Input placeholder="Error state" variant="error" />
      <Input placeholder="Success state" variant="success" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Input placeholder="Small" inputSize="sm" />
      <Input placeholder="Default" inputSize="default" />
      <Input placeholder="Large" inputSize="lg" />
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Input
        placeholder="Search..."
        startIcon={
          <SearchIcon size={16} strokeWidth={1.5} />
        }
      />
      <Input
        placeholder="Enter email"
        endIcon={
          <MailIcon size={16} strokeWidth={1.5} />
        }
      />
      <Input
        placeholder="Both icons"
        startIcon={
          <UserIcon size={16} strokeWidth={1.5} />
        }
        endIcon={
          <CheckIcon size={16} strokeWidth={1.5} />
        }
      />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
}

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search" />
    </div>
  ),
}

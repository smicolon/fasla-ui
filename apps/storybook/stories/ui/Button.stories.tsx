import type { Meta, StoryObj } from "@storybook/react"
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    loading: {
      control: "boolean",
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
    children: "Button",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <PlusIcon size={16} strokeWidth={1.5} />
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  args: {
    loading: true,
    children: "Loading",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>
        <UploadIcon size={16} strokeWidth={1.5} />
        Upload
      </Button>
      <Button variant="outline">
        Download
        <DownloadIcon size={16} strokeWidth={1.5} />
      </Button>
    </div>
  ),
}

export const AllVariantsDisabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default" disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="link" disabled>Link</Button>
    </div>
  ),
}

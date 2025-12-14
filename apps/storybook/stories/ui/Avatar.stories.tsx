import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarGroup } from "../../../../packages/smi-ui/registry/ui/avatar"

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    src: "https://github.com/shadcn.png",
    alt: "User",
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" src="https://github.com/shadcn.png" alt="User" />
      <Avatar size="sm" src="https://github.com/shadcn.png" alt="User" />
      <Avatar size="default" src="https://github.com/shadcn.png" alt="User" />
      <Avatar size="lg" src="https://github.com/shadcn.png" alt="User" />
      <Avatar size="xl" src="https://github.com/shadcn.png" alt="User" />
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar alt="John Doe" />
      <Avatar fallback="JD" />
      <Avatar />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar src="https://github.com/shadcn.png" alt="User 1" />
      <Avatar src="https://github.com/vercel.png" alt="User 2" />
      <Avatar alt="John Doe" />
      <Avatar alt="Jane Smith" />
      <Avatar alt="Bob Wilson" />
      <Avatar alt="Alice Brown" />
    </AvatarGroup>
  ),
}

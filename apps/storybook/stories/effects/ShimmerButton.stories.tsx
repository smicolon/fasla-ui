import type { Meta, StoryObj } from "@storybook/react"
import { ArrowUpIcon } from "lucide-react"
import { ShimmerButton } from "../../../../packages/fasla-ui/registry/effects/shimmer-button"

const meta: Meta<typeof ShimmerButton> = {
  title: "Effects/ShimmerButton",
  component: ShimmerButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    shimmerColor: {
      control: "color",
    },
    background: {
      control: "color",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Shimmer Button",
  },
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ShimmerButton
        shimmerColor="rgba(255, 255, 255, 0.3)"
        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        Purple Gradient
      </ShimmerButton>
      <ShimmerButton
        shimmerColor="rgba(255, 255, 255, 0.4)"
        background="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      >
        Pink Gradient
      </ShimmerButton>
      <ShimmerButton
        shimmerColor="rgba(255, 255, 255, 0.3)"
        background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
      >
        Blue Gradient
      </ShimmerButton>
    </div>
  ),
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <ArrowUpIcon size={16} strokeWidth={1.5} />
        Get Started
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
}

export const CustomDuration: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ShimmerButton shimmerDuration="1s">Fast (1s)</ShimmerButton>
      <ShimmerButton shimmerDuration="2s">Default (2s)</ShimmerButton>
      <ShimmerButton shimmerDuration="4s">Slow (4s)</ShimmerButton>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ShimmerButton className="h-8 px-4 text-xs">Small</ShimmerButton>
      <ShimmerButton>Default</ShimmerButton>
      <ShimmerButton className="h-12 px-8 text-base">Large</ShimmerButton>
    </div>
  ),
}

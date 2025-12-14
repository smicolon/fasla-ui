import type { Meta, StoryObj } from "@storybook/react"
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from "../../../../packages/smi-ui/registry/ui/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "circular", "rectangular"],
    },
    animate: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: "w-32 h-4",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="default" className="w-32 h-4" />
        <span className="text-sm text-muted-foreground">Default (rounded)</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <span className="text-sm text-muted-foreground">Circular</span>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" className="w-32 h-20" />
        <span className="text-sm text-muted-foreground">Rectangular</span>
      </div>
    </div>
  ),
}

export const NoAnimation: Story = {
  args: {
    className: "w-32 h-4",
    animate: false,
  },
}

export const Text: Story = {
  render: () => (
    <div className="w-64">
      <SkeletonText lines={4} />
    </div>
  ),
}

export const Avatar: Story = {
  render: () => (
    <div className="flex gap-4">
      <SkeletonAvatar />
      <SkeletonAvatar className="h-12 w-12" />
      <SkeletonAvatar className="h-16 w-16" />
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="w-[350px]">
      <SkeletonCard />
    </div>
  ),
}

export const ProfileLoading: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <SkeletonAvatar className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  ),
}

export const TableLoading: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  ),
}

export const ListLoading: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <SkeletonAvatar />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  ),
}

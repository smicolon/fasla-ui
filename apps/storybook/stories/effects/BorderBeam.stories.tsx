import type { Meta, StoryObj } from "@storybook/react"
import {
  BorderBeam,
  GlowingBorder,
} from "../../../../packages/smi-ui/registry/effects/border-beam"

const meta: Meta<typeof BorderBeam> = {
  title: "Effects/BorderBeam",
  component: BorderBeam,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    duration: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
    },
    borderWidth: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    },
    colorFrom: {
      control: "color",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <BorderBeam className="w-64 h-40">
      <div className="p-6">
        <h3 className="font-semibold">Border Beam</h3>
        <p className="text-sm text-muted-foreground mt-2">
          A rotating border effect
        </p>
      </div>
    </BorderBeam>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <BorderBeam colorFrom="hsl(340 100% 60%)" className="w-64">
        <div className="p-6">
          <h3 className="font-semibold">Pink Beam</h3>
        </div>
      </BorderBeam>
      <BorderBeam colorFrom="hsl(180 100% 50%)" className="w-64">
        <div className="p-6">
          <h3 className="font-semibold">Cyan Beam</h3>
        </div>
      </BorderBeam>
      <BorderBeam colorFrom="hsl(280 100% 60%)" className="w-64">
        <div className="p-6">
          <h3 className="font-semibold">Purple Beam</h3>
        </div>
      </BorderBeam>
    </div>
  ),
}

export const DifferentSpeeds: Story = {
  render: () => (
    <div className="flex gap-6">
      <BorderBeam duration={2} className="w-48">
        <div className="p-4 text-center">
          <p className="text-sm font-medium">Fast (2s)</p>
        </div>
      </BorderBeam>
      <BorderBeam duration={4} className="w-48">
        <div className="p-4 text-center">
          <p className="text-sm font-medium">Default (4s)</p>
        </div>
      </BorderBeam>
      <BorderBeam duration={8} className="w-48">
        <div className="p-4 text-center">
          <p className="text-sm font-medium">Slow (8s)</p>
        </div>
      </BorderBeam>
    </div>
  ),
}

export const GlowingBorderDefault: Story = {
  render: () => (
    <GlowingBorder className="w-64">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold">Glowing Border</h3>
        <p className="text-sm text-muted-foreground mt-2">
          A static glow effect
        </p>
      </div>
    </GlowingBorder>
  ),
}

export const GlowIntensities: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <GlowingBorder intensity="sm">
        <div className="rounded-lg border bg-card p-6 w-64">
          <h3 className="font-semibold">Small Glow</h3>
        </div>
      </GlowingBorder>
      <GlowingBorder intensity="md">
        <div className="rounded-lg border bg-card p-6 w-64">
          <h3 className="font-semibold">Medium Glow</h3>
        </div>
      </GlowingBorder>
      <GlowingBorder intensity="lg">
        <div className="rounded-lg border bg-card p-6 w-64">
          <h3 className="font-semibold">Large Glow</h3>
        </div>
      </GlowingBorder>
    </div>
  ),
}

export const GlowColors: Story = {
  render: () => (
    <div className="flex gap-6">
      <GlowingBorder glowColor="hsl(340 100% 50% / 0.5)">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium">Pink</p>
        </div>
      </GlowingBorder>
      <GlowingBorder glowColor="hsl(180 100% 50% / 0.5)">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium">Cyan</p>
        </div>
      </GlowingBorder>
      <GlowingBorder glowColor="hsl(280 100% 50% / 0.5)">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium">Purple</p>
        </div>
      </GlowingBorder>
    </div>
  ),
}

export const CardExample: Story = {
  render: () => (
    <BorderBeam colorFrom="hsl(var(--primary))" className="w-80">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Premium Feature</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Unlock all features with our premium plan. Get access to advanced analytics,
          priority support, and more.
        </p>
        <button className="mt-4 w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90">
          Upgrade Now
        </button>
      </div>
    </BorderBeam>
  ),
}

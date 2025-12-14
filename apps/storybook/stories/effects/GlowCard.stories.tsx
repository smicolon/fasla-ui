import type { Meta, StoryObj } from "@storybook/react"
import { GlowCard, GlowContainer } from "../../../../packages/smi-ui/registry/effects/glow-card"

const meta: Meta<typeof GlowCard> = {
  title: "Effects/GlowCard",
  component: GlowCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof GlowCard>

export const Default: Story = {
  render: () => (
    <GlowCard className="w-[350px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Glow Card</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Hover over this card to see the glow effect.
        </p>
      </div>
    </GlowCard>
  ),
}

export const FollowMouse: Story = {
  render: () => (
    <GlowCard followMouse className="w-[350px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Mouse Following</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The glow follows your cursor position.
        </p>
      </div>
    </GlowCard>
  ),
}

export const CustomColor: Story = {
  render: () => (
    <div className="flex gap-4">
      <GlowCard glowColor="#ff0080" className="w-[200px]">
        <div className="p-4">
          <h3 className="font-semibold">Pink Glow</h3>
        </div>
      </GlowCard>
      <GlowCard glowColor="#00ff88" className="w-[200px]">
        <div className="p-4">
          <h3 className="font-semibold">Green Glow</h3>
        </div>
      </GlowCard>
      <GlowCard glowColor="#0088ff" className="w-[200px]">
        <div className="p-4">
          <h3 className="font-semibold">Blue Glow</h3>
        </div>
      </GlowCard>
    </div>
  ),
}

export const AlwaysOn: Story = {
  render: () => (
    <GlowCard hoverOnly={false} glowColor="#7c3aed" className="w-[350px]">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Always Glowing</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This card glows even without hover.
        </p>
      </div>
    </GlowCard>
  ),
}

export const GlowContainerExample: Story = {
  render: () => (
    <GlowContainer glowColor="#7c3aed" duration={2}>
      <div className="p-6">
        <h3 className="text-lg font-semibold">Animated Border</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The border has a sliding glow animation.
        </p>
      </div>
    </GlowContainer>
  ),
}

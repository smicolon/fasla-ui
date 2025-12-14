import type { Meta, StoryObj } from "@storybook/react"
import {
  Spotlight,
  SpotlightCard,
} from "../../../../packages/smi-ui/registry/effects/spotlight"

const meta: Meta<typeof Spotlight> = {
  title: "Effects/Spotlight",
  component: Spotlight,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "range", min: 100, max: 800, step: 50 },
    },
    blur: {
      control: { type: "range", min: 20, max: 200, step: 10 },
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Spotlight className="h-64 w-96 rounded-xl border bg-card flex items-center justify-center">
      <p className="text-center">
        Move your cursor around<br />
        <span className="text-sm text-muted-foreground">to see the spotlight effect</span>
      </p>
    </Spotlight>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Spotlight
        color="hsl(340 100% 60% / 0.2)"
        className="h-40 w-64 rounded-xl border bg-card flex items-center justify-center"
      >
        <p className="text-sm">Pink Spotlight</p>
      </Spotlight>
      <Spotlight
        color="hsl(180 100% 50% / 0.2)"
        className="h-40 w-64 rounded-xl border bg-card flex items-center justify-center"
      >
        <p className="text-sm">Cyan Spotlight</p>
      </Spotlight>
      <Spotlight
        color="hsl(280 100% 60% / 0.2)"
        className="h-40 w-64 rounded-xl border bg-card flex items-center justify-center"
      >
        <p className="text-sm">Purple Spotlight</p>
      </Spotlight>
    </div>
  ),
}

export const SpotlightCardDefault: Story = {
  render: () => (
    <SpotlightCard className="w-72">
      <h3 className="font-semibold">Spotlight Card</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Hover over this card to see the spotlight effect follow your cursor.
      </p>
    </SpotlightCard>
  ),
}

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {[
        { title: "Analytics", desc: "Track your performance" },
        { title: "Insights", desc: "Get actionable data" },
        { title: "Reports", desc: "Generate custom reports" },
        { title: "Settings", desc: "Configure your dashboard" },
      ].map((item, i) => (
        <SpotlightCard key={i} className="w-48">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
        </SpotlightCard>
      ))}
    </div>
  ),
}

export const LargeSpotlight: Story = {
  render: () => (
    <Spotlight
      size={600}
      blur={100}
      className="h-80 w-full max-w-2xl rounded-2xl border bg-card flex items-center justify-center p-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold">Large Spotlight</h2>
        <p className="mt-4 text-muted-foreground max-w-md">
          A larger spotlight with increased blur for a softer, more ambient effect.
        </p>
      </div>
    </Spotlight>
  ),
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex gap-6">
      <Spotlight
        size={200}
        className="h-40 w-48 rounded-xl border bg-card flex items-center justify-center"
      >
        <p className="text-sm">Small (200px)</p>
      </Spotlight>
      <Spotlight
        size={400}
        className="h-40 w-48 rounded-xl border bg-card flex items-center justify-center"
      >
        <p className="text-sm">Default (400px)</p>
      </Spotlight>
      <Spotlight
        size={600}
        className="h-40 w-48 rounded-xl border bg-card flex items-center justify-center"
      >
        <p className="text-sm">Large (600px)</p>
      </Spotlight>
    </div>
  ),
}

export const Hero: Story = {
  render: () => (
    <Spotlight
      size={500}
      blur={80}
      color="hsl(var(--primary) / 0.2)"
      className="h-96 w-full max-w-3xl rounded-2xl border bg-card"
    >
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to SMI-UI</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-lg">
          A beautiful collection of animated components for your next project.
          Built with React, Tailwind CSS, and Framer Motion.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
            Get Started
          </button>
          <button className="border px-6 py-2 rounded-md font-medium hover:bg-accent">
            Learn More
          </button>
        </div>
      </div>
    </Spotlight>
  ),
}

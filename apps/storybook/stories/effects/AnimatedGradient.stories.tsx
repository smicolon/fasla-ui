import type { Meta, StoryObj } from "@storybook/react"
import {
  AnimatedGradient,
  AnimatedGradientText,
} from "../../../../packages/smi-ui/registry/effects/animated-gradient"

const meta: Meta<typeof AnimatedGradient> = {
  title: "Effects/AnimatedGradient",
  component: AnimatedGradient,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    blur: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    speed: {
      control: { type: "range", min: 2, max: 20, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: "h-64 w-96 rounded-xl",
  },
}

export const WithContent: Story = {
  render: () => (
    <AnimatedGradient className="h-64 w-96 rounded-xl flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold">Hello World</h2>
        <p className="mt-2 text-white/80">Content over animated gradient</p>
      </div>
    </AnimatedGradient>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AnimatedGradient
        className="h-32 w-64 rounded-xl"
        colors={[
          "hsl(340 100% 70%)",
          "hsl(280 100% 70%)",
          "hsl(220 100% 70%)",
          "hsl(180 100% 70%)",
        ]}
      />
      <AnimatedGradient
        className="h-32 w-64 rounded-xl"
        colors={[
          "hsl(140 70% 50%)",
          "hsl(180 70% 50%)",
          "hsl(220 70% 50%)",
          "hsl(260 70% 50%)",
        ]}
      />
    </div>
  ),
}

export const BlurVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {(["sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((blur) => (
        <AnimatedGradient
          key={blur}
          blur={blur}
          className="h-24 w-32 rounded-lg flex items-center justify-center"
        >
          <span className="text-white text-sm font-medium">{blur}</span>
        </AnimatedGradient>
      ))}
    </div>
  ),
}

export const GradientText: Story = {
  render: () => (
    <div className="space-y-4">
      <AnimatedGradientText className="text-4xl font-bold">
        Animated Gradient Text
      </AnimatedGradientText>
      <AnimatedGradientText
        className="text-2xl font-semibold"
        colors={["hsl(340 100% 60%)", "hsl(280 100% 60%)", "hsl(340 100% 60%)"]}
      >
        Custom Colors
      </AnimatedGradientText>
      <AnimatedGradientText
        className="text-xl"
        speed={6}
        colors={["hsl(140 70% 50%)", "hsl(200 70% 50%)", "hsl(140 70% 50%)"]}
      >
        Slow Animation
      </AnimatedGradientText>
    </div>
  ),
}

export const Hero: Story = {
  render: () => (
    <AnimatedGradient className="h-80 w-full max-w-2xl rounded-2xl flex items-center justify-center p-8">
      <div className="text-center">
        <AnimatedGradientText className="text-5xl font-bold text-white">
          Welcome
        </AnimatedGradientText>
        <p className="mt-4 text-lg text-white/80 max-w-md mx-auto">
          Create beautiful, animated backgrounds with just a few lines of code.
        </p>
      </div>
    </AnimatedGradient>
  ),
}

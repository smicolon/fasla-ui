import type { Meta, StoryObj } from "@storybook/react"
import { TypewriterText, TypewriterWords } from "../../../../packages/smi-ui/registry/effects/typewriter-text"

const meta: Meta<typeof TypewriterText> = {
  title: "Effects/TypewriterText",
  component: TypewriterText,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TypewriterText>

export const Default: Story = {
  args: {
    text: "Hello, I'm a typewriter effect!",
    className: "text-2xl font-bold",
  },
}

export const SlowSpeed: Story = {
  args: {
    text: "This is typing slowly...",
    speed: 150,
    className: "text-xl",
  },
}

export const WithDelay: Story = {
  args: {
    text: "I started after a delay",
    delay: 1000,
    className: "text-xl",
  },
}

export const NoCursor: Story = {
  args: {
    text: "No cursor here",
    cursor: false,
    className: "text-xl",
  },
}

export const Looping: Story = {
  args: {
    text: "This will loop forever",
    loop: true,
    loopDelay: 1500,
    className: "text-xl",
  },
}

export const WordsCycle: Story = {
  render: () => (
    <div className="text-2xl font-bold">
      We build{" "}
      <TypewriterWords
        words={["websites", "apps", "software", "experiences"]}
        className="text-primary"
      />
    </div>
  ),
}

export const HeroExample: Story = {
  render: () => (
    <div className="text-center">
      <h1 className="text-4xl font-bold">
        <TypewriterText text="Welcome to the Future" speed={80} />
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">
        <TypewriterText
          text="Building amazing experiences, one character at a time."
          delay={2500}
          speed={30}
        />
      </p>
    </div>
  ),
}

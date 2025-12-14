import type { Meta, StoryObj } from "@storybook/react"
import {
  TextReveal,
  WordReveal,
} from "../../../../packages/smi-ui/registry/effects/text-reveal"

const meta: Meta<typeof TextReveal> = {
  title: "Effects/TextReveal",
  component: TextReveal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    delay: {
      control: { type: "range", min: 0.01, max: 0.1, step: 0.01 },
    },
    duration: {
      control: { type: "range", min: 0.1, max: 1, step: 0.1 },
    },
    triggerOnView: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: "Hello, World!",
    className: "text-2xl font-semibold",
  },
}

export const CharacterReveal: Story = {
  render: () => (
    <div className="space-y-8">
      <TextReveal
        text="Character by character reveal"
        className="text-3xl font-bold"
        triggerOnView={false}
      />
      <TextReveal
        text="Faster animation"
        className="text-2xl"
        delay={0.02}
        duration={0.2}
        triggerOnView={false}
      />
      <TextReveal
        text="Slower animation"
        className="text-2xl"
        delay={0.06}
        duration={0.5}
        triggerOnView={false}
      />
    </div>
  ),
}

export const WordByWord: Story = {
  render: () => (
    <div className="space-y-8 max-w-lg">
      <WordReveal
        text="Words appear one by one with a blur effect"
        className="text-3xl font-bold"
        triggerOnView={false}
      />
      <WordReveal
        text="This is a longer sentence to demonstrate the word reveal animation with multiple words appearing sequentially"
        className="text-xl"
        triggerOnView={false}
      />
    </div>
  ),
}

export const Headlines: Story = {
  render: () => (
    <div className="space-y-12 text-center">
      <TextReveal
        text="Welcome to the Future"
        className="text-5xl font-bold"
        triggerOnView={false}
      />
      <WordReveal
        text="Build beautiful interfaces with stunning animations"
        className="text-2xl text-muted-foreground"
        triggerOnView={false}
      />
    </div>
  ),
}

export const WithDifferentSpeeds: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Fast (delay: 0.02)</p>
        <TextReveal
          text="Quick reveal animation"
          className="text-xl font-semibold"
          delay={0.02}
          triggerOnView={false}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default (delay: 0.03)</p>
        <TextReveal
          text="Default reveal animation"
          className="text-xl font-semibold"
          delay={0.03}
          triggerOnView={false}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Slow (delay: 0.06)</p>
        <TextReveal
          text="Slow reveal animation"
          className="text-xl font-semibold"
          delay={0.06}
          triggerOnView={false}
        />
      </div>
    </div>
  ),
}

export const ScrollTriggered: Story = {
  render: () => (
    <div className="h-[150vh] pt-[50vh]">
      <p className="text-center text-muted-foreground mb-8">
        Scroll down to see the animation
      </p>
      <TextReveal
        text="This text reveals when scrolled into view"
        className="text-3xl font-bold text-center"
        triggerOnView={true}
      />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
}

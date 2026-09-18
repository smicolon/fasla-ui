import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Radio } from "../../../../packages/fasla-ui/registry/ui/radio"

const meta: Meta<typeof Radio> = {
  title: "UI/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {
  args: { label: "Label" },
}

export const Checked: Story = {
  args: { label: "Label", defaultChecked: true },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio name="sizes-sm" size="sm" label="Small" defaultChecked />
      <Radio name="sizes-md" size="md" label="Medium" defaultChecked />
      <Radio name="sizes-lg" size="lg" label="Large" defaultChecked />
    </div>
  ),
}

export const WithDescription: Story = {
  args: {
    label: "Express delivery",
    description: "Arrives tomorrow before 6pm",
  },
}

export const Layout: Story = {
  args: {
    variant: "layout",
    label: "Express delivery",
    defaultChecked: true,
  },
}

export const LayoutGroup: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Radio
        name="shipping"
        value="standard"
        variant="layout"
        label="Standard"
        description="3–5 business days"
        className="w-full"
        defaultChecked
      />
      <Radio
        name="shipping"
        value="express"
        variant="layout"
        label="Express"
        description="Arrives tomorrow before 6pm"
        className="w-full"
      />
      <Radio
        name="shipping"
        value="courier"
        variant="layout"
        label="Same-day courier"
        description="Unavailable in your area"
        className="w-full"
        disabled
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio name="disabled-a" label="Disabled, unselected" disabled />
      <Radio
        name="disabled-b"
        label="Disabled, selected"
        disabled
        defaultChecked
      />
    </div>
  ),
}

/** All 12 states the Figma set defines for a single reading direction. */
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-8 gap-y-4">
      <span />
      <span className="text-xs text-muted-foreground">Unselected</span>
      <span className="text-xs text-muted-foreground">Selected</span>
      <span className="text-xs text-muted-foreground">Disabled</span>
      <span className="text-xs text-muted-foreground">Disabled selected</span>

      {(["sm", "md", "lg"] as const).map((size) => (
        <React.Fragment key={size}>
          <span className="text-xs text-muted-foreground">{size}</span>
          <Radio name={`all-${size}-1`} size={size} label="Label" />
          <Radio name={`all-${size}-2`} size={size} label="Label" defaultChecked />
          <Radio name={`all-${size}-3`} size={size} label="Label" disabled />
          <Radio
            name={`all-${size}-4`}
            size={size}
            label="Label"
            disabled
            defaultChecked
          />
        </React.Fragment>
      ))}
    </div>
  ),
}

/** Direction is inherited from `dir`, not a prop — the layout mirrors on its own. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="flex w-80 flex-col gap-2">
      <Radio name="rtl" value="standard" label="عنوان" defaultChecked />
      <Radio
        name="rtl"
        value="express"
        variant="layout"
        label="عنوان"
        description="وصف قصير للخيار"
        className="w-full"
      />
    </div>
  ),
}

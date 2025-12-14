import type { Meta, StoryObj } from "@storybook/react"
import { Select } from "../../../../packages/smi-ui/registry/ui/select"

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Select>

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
]

export const Default: Story = {
  args: {
    options,
    placeholder: "Select a framework",
    className: "w-[200px]",
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select options={options} selectSize="sm" placeholder="Small" className="w-[200px]" />
      <Select options={options} selectSize="default" placeholder="Default" className="w-[200px]" />
      <Select options={options} selectSize="lg" placeholder="Large" className="w-[200px]" />
    </div>
  ),
}

export const Error: Story = {
  args: {
    options,
    error: true,
    className: "w-[200px]",
  },
}

export const Disabled: Story = {
  args: {
    options,
    disabled: true,
    className: "w-[200px]",
  },
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      ...options,
      { value: "disabled", label: "Disabled Option", disabled: true },
    ],
    className: "w-[200px]",
  },
}

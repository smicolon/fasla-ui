import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Combobox, ComboboxOption } from "../../../../packages/smi-ui/registry/ui/combobox"

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

const frameworks: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "astro", label: "Astro" },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>("")
    return (
      <div className="w-[300px]">
        <Combobox
          options={frameworks}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Select framework..."
        />
      </div>
    )
  },
}

export const WithSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string>("react")
    return (
      <div className="w-[300px]">
        <Combobox
          options={frameworks}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Select framework..."
          searchPlaceholder="Search frameworks..."
        />
      </div>
    )
  },
}

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["react", "next"])
    return (
      <div className="w-[300px]">
        <Combobox
          options={frameworks}
          value={value}
          onChange={(v) => setValue(v as string[])}
          placeholder="Select frameworks..."
          multiple
        />
      </div>
    )
  },
}

export const Creatable: Story = {
  render: () => {
    const [options, setOptions] = useState<ComboboxOption[]>(frameworks)
    const [value, setValue] = useState<string>("")

    return (
      <div className="w-[300px]">
        <Combobox
          options={options}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Select or create..."
          creatable
          onCreate={(newValue) => {
            const newOption = { value: newValue.toLowerCase(), label: newValue }
            setOptions([...options, newOption])
            setValue(newOption.value)
          }}
        />
      </div>
    )
  },
}

export const CreatableMultiple: Story = {
  render: () => {
    const [options, setOptions] = useState<ComboboxOption[]>(frameworks)
    const [value, setValue] = useState<string[]>([])

    return (
      <div className="w-[300px]">
        <Combobox
          options={options}
          value={value}
          onChange={(v) => setValue(v as string[])}
          placeholder="Select or create tags..."
          multiple
          creatable
          onCreate={(newValue) => {
            const newOption = { value: newValue.toLowerCase(), label: newValue }
            setOptions([...options, newOption])
            setValue([...value, newOption.value])
          }}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px]">
      <Combobox
        options={frameworks}
        value="react"
        placeholder="Disabled..."
        disabled
      />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-[300px]">
      <Combobox
        options={[]}
        placeholder="Loading..."
        loading
      />
    </div>
  ),
}

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string>("")
    const optionsWithDisabled: ComboboxOption[] = [
      ...frameworks.slice(0, 3),
      { value: "disabled1", label: "Disabled Option", disabled: true },
      ...frameworks.slice(3, 6),
      { value: "disabled2", label: "Another Disabled", disabled: true },
      ...frameworks.slice(6),
    ]

    return (
      <div className="w-[300px]">
        <Combobox
          options={optionsWithDisabled}
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Some options disabled..."
        />
      </div>
    )
  },
}

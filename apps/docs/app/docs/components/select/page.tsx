"use client"

import { Select } from "../../../../../../packages/smi-ui/registry/ui/select"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
]

export default function SelectPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Select</h1>
        <p className="text-xl text-muted-foreground">
          A native select input with custom styling.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <CodeBlock>npx @smicolon/smi-ui add select</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <Select
            options={options}
            placeholder="Select a framework"
            className="w-[200px]"
          />
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4 w-[200px]">
            <Select options={options} selectSize="sm" placeholder="Small" />
            <Select options={options} selectSize="default" placeholder="Default" />
            <Select options={options} selectSize="lg" placeholder="Large" />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">States</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4 w-[200px]">
            <Select options={options} placeholder="Default" />
            <Select options={options} placeholder="Error state" error />
            <Select options={options} placeholder="Disabled" disabled />
          </div>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`import { Select } from "@/components/ui/select"

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
]

// Basic select
<Select
  options={options}
  placeholder="Select a framework"
/>

// Different sizes
<Select options={options} selectSize="sm" />
<Select options={options} selectSize="default" />
<Select options={options} selectSize="lg" />

// Error state
<Select options={options} error />`}</CodeBlock>
      </section>
    </div>
  )
}

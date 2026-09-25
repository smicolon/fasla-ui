"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { Combobox } from "@fasla-ui/ui/combobox"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
]

export default function ComboboxPage() {
  const t = useTranslations("docs.sections")
  const [value, setValue] = useState<string>("")
  const [multiValue, setMultiValue] = useState<string[]>([])
  const [options, setOptions] = useState(frameworks)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Combobox</h1>
        <p className="text-xl text-muted-foreground">
          A searchable dropdown with autocomplete, multi-select, and create-new functionality.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="combobox" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Combobox
            options={frameworks}
            placeholder="Select a framework..."
            className="w-[250px]"
          />
        </ComponentPreview>
      </section>

      {/* Searchable */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Searchable</h2>
        <ComponentPreview>
          <Combobox
            options={frameworks}
            value={value}
            onChange={(v) => setValue(v as string)}
            placeholder="Search frameworks..."
            searchPlaceholder="Type to search..."
            className="w-[250px]"
          />
        </ComponentPreview>
      </section>

      {/* Multi-select */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Multi-select</h2>
        <ComponentPreview>
          <Combobox
            options={frameworks}
            value={multiValue}
            onChange={(v) => setMultiValue(v as string[])}
            placeholder="Select frameworks..."
            multiple
            className="w-[300px]"
          />
        </ComponentPreview>
      </section>

      {/* Creatable */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Creatable</h2>
        <ComponentPreview>
          <Combobox
            options={options}
            placeholder="Select or create..."
            creatable
            onCreate={(newValue) => {
              setOptions([...options, { value: newValue.toLowerCase(), label: newValue }])
            }}
            className="w-[250px]"
          />
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4 w-[250px]">
            <Combobox options={frameworks} placeholder="Default" />
            <Combobox options={frameworks} placeholder="Disabled" disabled />
            <Combobox options={frameworks} placeholder="Loading..." loading />
          </div>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <CodeBlock>{`import { Combobox } from "@/components/ui/combobox"

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
]

// Basic combobox
<Combobox
  options={options}
  placeholder="Select option..."
/>

// Controlled with search
const [value, setValue] = useState("")
<Combobox
  options={options}
  value={value}
  onChange={setValue}
/>

// Multi-select
<Combobox
  options={options}
  multiple
  value={selectedValues}
  onChange={setSelectedValues}
/>

// Creatable
<Combobox
  options={options}
  creatable
  onCreate={(value) => {
    // Add new option to your list
  }}
/>`}</CodeBlock>
      </section>
    </div>
  )
}

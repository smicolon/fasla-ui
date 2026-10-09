"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { Combobox } from "@fasla-ui/ui/combobox"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** The same countries in both locales: the value is a Latin identifier, the label is the locale's. */
const OPTIONS = [
  ["a", "sa"],
  ["b", "ae"],
  ["c", "eg"],
  ["d", "jo"],
  ["e", "ma"],
  ["f", "kw"],
] as const

export default function ComboboxPage() {
  const t = useTranslations("docs.sections")
  const c = useTranslations("docs.combobox")

  const initialOptions = OPTIONS.map(([key, value]) => ({ value: value as string, label: c(`options.${key}`) }))

  const [value, setValue] = useState<string>("")
  const [multiValue, setMultiValue] = useState<string[]>([])
  const [options, setOptions] = useState(initialOptions)

  // The component's own text, in the page's language.
  const text = {
    searchPlaceholder: c("text.search"),
    emptyText: c("text.empty"),
    createText: c("text.create"),
    loadingText: c("text.loading"),
    openLabel: c("text.open"),
    closeLabel: c("text.close"),
    removeLabel: (label: string) => c("text.remove", { label }),
  }

  const props: PropRow[] = [
    { prop: "options", type: "ComboboxOption[]", fallback: "", description: c.rich("props.options", richCode) },
    { prop: "value", type: "string | string[]", fallback: "", description: c.rich("props.value", richCode) },
    { prop: "onChange", type: "(value) => void", fallback: "", description: c.rich("props.onChange", richCode) },
    { prop: "placeholder", type: "string", fallback: '"Select option..."', description: c.rich("props.placeholder", richCode) },
    { prop: "searchPlaceholder", type: "string", fallback: '"Search..."', description: c.rich("props.searchPlaceholder", richCode) },
    { prop: "multiple", type: "boolean", fallback: "false", description: c.rich("props.multiple", richCode) },
    { prop: "creatable", type: "boolean", fallback: "false", description: c.rich("props.creatable", richCode) },
    { prop: "onCreate", type: "(value) => void", fallback: "", description: c.rich("props.onCreate", richCode) },
    { prop: "emptyText", type: "string", fallback: '"No options found."', description: c.rich("props.emptyText", richCode) },
    { prop: "createText", type: "string", fallback: '"Create"', description: c.rich("props.createText", richCode) },
    { prop: "loading", type: "boolean", fallback: "false", description: c.rich("props.loading", richCode) },
    { prop: "loadingText", type: "string", fallback: '"Loading..."', description: c.rich("props.loadingText", richCode) },
    { prop: "openLabel", type: "string", fallback: '"Open"', description: c.rich("props.openLabel", richCode) },
    { prop: "closeLabel", type: "string", fallback: '"Close"', description: c.rich("props.closeLabel", richCode) },
    { prop: "removeLabel", type: "(label) => string", fallback: "", description: c.rich("props.removeLabel", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: c.rich("props.disabled", richCode) },
    { prop: "className", type: "string", fallback: "", description: c.rich("props.className", richCode) },
  ]

  const codeOptions = initialOptions
    .slice(0, 3)
    .map((option) => `  { value: "${option.value}", label: "${option.label}" },`)
    .join("\n")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/combobox/" /></h1>
        <p className="text-xl text-muted-foreground">{c("lead")}</p>
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
          <Combobox options={initialOptions} placeholder={c("placeholder")} className="w-[250px]" {...text} />
        </ComponentPreview>
      </section>

      {/* Searchable */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{c("searchableTitle")}</h2>
        <ComponentPreview>
          <Combobox
            options={initialOptions}
            value={value}
            onChange={(v) => setValue(v as string)}
            className="w-[250px]"
            {...text}
            placeholder={c("searchable.placeholder")}
            searchPlaceholder={c("searchable.search")}
          />
        </ComponentPreview>
      </section>

      {/* Multi-select */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{c("multiTitle")}</h2>
        <ComponentPreview>
          <Combobox
            options={initialOptions}
            value={multiValue}
            onChange={(v) => setMultiValue(v as string[])}
            placeholder={c("multi")}
            multiple
            className="w-[300px]"
            {...text}
          />
        </ComponentPreview>
      </section>

      {/* Creatable */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{c("creatableTitle")}</h2>
        <ComponentPreview>
          <Combobox
            options={options}
            placeholder={c("creatable")}
            creatable
            onCreate={(newValue) => {
              setOptions([...options, { value: newValue.toLowerCase(), label: newValue }])
            }}
            className="w-[250px]"
            {...text}
          />
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <ComponentPreview>
          <div className="flex w-[250px] flex-col gap-4">
            <Combobox options={initialOptions} placeholder={c("states.default")} {...text} />
            <Combobox options={initialOptions} placeholder={c("states.disabled")} disabled {...text} />
            <Combobox options={initialOptions} placeholder={c("states.loading")} loading {...text} />
          </div>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={c("usage.basic")}>{`"use client"

import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"

const countries = [
${codeOptions}
]

export function CountryCombobox() {
  const [country, setCountry] = useState("")

  return (
    <Combobox
      options={countries}
      value={country}
      onChange={(value) => setCountry(value as string)}
      placeholder="${c("usage.codePlaceholder")}"
      searchPlaceholder="${c("text.search")}"
      emptyText="${c("text.empty")}"
    />
  )
}`}</UsageExample>
        <UsageExample title={c("usage.controlled")}>{`"use client"

import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"

const countries = [
${codeOptions}
]

export function ControlledCountryCombobox() {
  const [country, setCountry] = useState("${initialOptions[0]!.value}")

  return (
    <Combobox
      options={countries}
      value={country}
      onChange={(value) => setCountry(value as string)}
      placeholder="${c("usage.codePlaceholder")}"
      searchPlaceholder="${c("text.search")}"
      emptyText="${c("text.empty")}"
    />
  )
}`}</UsageExample>
        <UsageExample title={c("usage.multi")}>{`"use client"

import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"

const countries = [
${codeOptions}
]

export function CountriesCombobox() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <Combobox
      options={countries}
      multiple
      value={selected}
      onChange={(value) => setSelected(value as string[])}
      placeholder="${c("usage.codePlaceholder")}"
      searchPlaceholder="${c("text.search")}"
      emptyText="${c("text.empty")}"
    />
  )
}`}</UsageExample>
        <UsageExample title={c("usage.creatable")}>{`"use client"

import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"

export function CreatableCountryCombobox() {
  const [countries, setCountries] = useState([
${codeOptions.split("\n").map((line) => `  ${line}`).join("\n")}
  ])
  const [country, setCountry] = useState("")

  return (
    <Combobox
      options={countries}
      value={country}
      onChange={(value) => setCountry(value as string)}
      creatable
      // ${c("usage.addNew")}
      onCreate={(label) => {
        setCountries((current) => [...current, { value: label, label }])
        setCountry(label)
      }}
      placeholder="${c("usage.codePlaceholder")}"
      searchPlaceholder="${c("text.search")}"
      emptyText="${c("text.empty")}"
      createText="${c("text.create")}"
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}

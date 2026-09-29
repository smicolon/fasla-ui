"use client"

import { useTranslations } from "next-intl"

import { Select } from "@fasla-ui/ui/select"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** Option values stay Latin identifiers in both locales; each locale picks its own. */
const OPTION_KEYS = ["a", "b", "c", "d"] as const

export default function SelectPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.select")

  const options = OPTION_KEYS.map((key) => ({ value: s(`optionValues.${key}`), label: s(`options.${key}`) }))

  const props: PropRow[] = [
    { prop: "options", type: "SelectOption[]", fallback: "", description: s.rich("props.options", richCode) },
    { prop: "placeholder", type: "string", fallback: "", description: s.rich("props.placeholder", richCode) },
    { prop: "selectSize", type: '"sm" | "default" | "lg"', fallback: '"default"', description: s.rich("props.selectSize", richCode) },
    { prop: "error", type: "boolean", fallback: "false", description: s.rich("props.error", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("props.disabled", richCode) },
    { prop: "value", type: "string", fallback: "", description: s.rich("props.value", richCode) },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", richCode) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: s.rich("props.onChange", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  const codeOptions = options
    .slice(0, 3)
    .map((option) => `  { value: "${option.value}", label: "${option.label}" },`)
    .join("\n")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/select/" /></h1>
        <p className="text-xl text-muted-foreground">{s.rich("lead", richCode)}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="select" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Select options={options} placeholder={s("placeholder")} className="w-[200px]" />
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex w-[200px] flex-col gap-4">
            <Select options={options} selectSize="sm" placeholder={s("sizes.sm")} />
            <Select options={options} selectSize="default" placeholder={s("sizes.default")} />
            <Select options={options} selectSize="lg" placeholder={s("sizes.lg")} />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <ComponentPreview>
          <div className="flex w-[200px] flex-col gap-4">
            <Select options={options} placeholder={s("states.default")} />
            <Select options={options} placeholder={s("states.error")} error />
            <Select options={options} placeholder={s("states.disabled")} disabled />
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
        <CodeBlock>{`import { Select } from "@/components/ui/select"

const options = [
${codeOptions}
]

// ${s("usage.basic")}
<Select
  options={options}
  placeholder="${s("placeholder")}"
/>

// ${s("usage.sizes")}
<Select options={options} selectSize="sm" />
<Select options={options} selectSize="default" />
<Select options={options} selectSize="lg" />

// ${s("usage.error")}
<Select options={options} error />`}</CodeBlock>
      </section>
    </div>
  )
}

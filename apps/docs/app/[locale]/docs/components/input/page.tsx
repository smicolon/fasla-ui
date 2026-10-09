"use client"

import { useTranslations } from "next-intl"

import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function InputPage() {
  const t = useTranslations("docs.sections")
  const i = useTranslations("docs.input")

  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "error" | "success"', fallback: '"default"', description: i.rich("props.variant", richCode) },
    { prop: "inputSize", type: '"sm" | "default" | "lg"', fallback: '"default"', description: i.rich("props.inputSize", richCode) },
    { prop: "startIcon", type: "ReactNode", fallback: "", description: i.rich("props.startIcon", richCode) },
    { prop: "endIcon", type: "ReactNode", fallback: "", description: i.rich("props.endIcon", richCode) },
    { prop: "placeholder", type: "string", fallback: "", description: i.rich("props.placeholder", richCode) },
    { prop: "type", type: "string", fallback: '"text"', description: i.rich("props.type", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: i.rich("props.disabled", richCode) },
    { prop: "value", type: "string", fallback: "", description: i.rich("props.value", richCode) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: i.rich("props.onChange", richCode) },
    { prop: "className", type: "string", fallback: "", description: i.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/input/" /></h1>
        <p className="text-xl text-muted-foreground">{i("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="input" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Input placeholder={i("placeholder")} className="max-w-sm" />
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <ComponentPreview>
          <div className="flex max-w-sm flex-col gap-4">
            <Input variant="default" placeholder={i("variants.default")} />
            <Input variant="error" placeholder={i("variants.error")} />
            <Input variant="success" placeholder={i("variants.success")} />
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex max-w-sm flex-col gap-4">
            <Input inputSize="sm" placeholder={i("sizes.sm")} />
            <Input inputSize="default" placeholder={i("sizes.default")} />
            <Input inputSize="lg" placeholder={i("sizes.lg")} />
          </div>
        </ComponentPreview>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("iconsTitle")}</h2>
        <ComponentPreview>
          <div className="flex max-w-sm flex-col gap-4">
            <Input startIcon={<span aria-hidden="true">🔍</span>} placeholder={i("icons.search")} />
            <Input endIcon={<span aria-hidden="true">✓</span>} placeholder={i("icons.end")} />
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
        <UsageExample>{`import { Input } from "@/components/ui/input"

export function EmailField() {
  return (
    <div className="grid max-w-sm gap-2">
      <label htmlFor="email" className="text-sm font-medium">${i("usage.label")}</label>
      <Input id="email" name="email" type="email" placeholder="you@example.com" />
    </div>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
